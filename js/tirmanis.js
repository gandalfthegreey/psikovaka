/**
 * PsikoVaka — Tırmanış Modu (Oda-İçi Canlı Seans + Zor Mod Kesintisiz Seri + 10 İpucu Bütçesi).
 * - Ayrı vaka ekranına atmaz; tüm seans doğrudan Uzman Klinik odasının içinde oynanır.
 * - Danışan Nöro soldaki kapıdan içeri yürür; ipuçları danışanın üstündeki konuşma balonunda açılır.
 * - Danışan Nöro'ya tıklayarak veya "Sonraki İpucu" düğmesiyle yeni ipucu açılır.
 * - Başlangıçta 10 ipucu bütçesi: 1. ipucu +2 | 2. +1 | 3. ±0 | 4. -1 | 5. -2 | 6. -3.
 * - Doğru tahminde danışan sevinip kapıdan çıkar, tanı bilgilendirme kartı açılır ve "Sıradaki Danışan" ile yenisi gelir.
 * - Yanlış tahminde (Tek Hak) seri biter; doğru tanı ve açıklama gösterilir, skor online sıralamaya kaydedilir.
 */
(function (global) {
    'use strict';

    const STORAGE_KEY = 'psikovaka_tirmanis_v1';
    const START_BUDGET = 10;
    const DELTA_BY_CLUE = { 1: 2, 2: 1, 3: 0, 4: -1, 5: -2, 6: -3 };
    const CLUE_LABELS = [
        'Başvuru şikâyeti',
        'Süre ve başlangıç',
        'İşlevsellik ve davranış',
        'Tıbbi dışlama ve tetikleyiciler',
        'Ruhsal durum muayenesi',
        'Kilit tanı kriteri'
    ];

    let state = null;
    let lastFinishedRun = null;
    let lbCache = { loading: false, rows: null, me: null, error: null, unsupported: false };

    // Aktif oda-içi seans durumu (yalnızca bellekte)
    let session = null; // { caseObj, patientAvatar, phase: 'entering'|'seated'|'leaving'|'gone', emote, unlockedClues, viewingClue, result }
    let walkTimer = 0;
    let leaveTimer = 0;
    let acIndex = -1;
    let acItems = [];

    function defaultState() {
        return {
            bestStreak: 0,
            totalRuns: 0,
            activeRun: null // { streak, budget, totalClues, usedIds: [] }
        };
    }

    function load() {
        if (state) return state;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const p = JSON.parse(raw);
                state = Object.assign(defaultState(), p || {});
                if (state.activeRun && typeof state.activeRun !== 'object') state.activeRun = null;
                return state;
            }
        } catch (e) {}
        state = defaultState();
        return state;
    }

    function save() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(load())); } catch (e) {}
    }

    function deltaFor(clueNum) {
        const n = Math.max(1, Math.min(6, Number(clueNum) || 1));
        return DELTA_BY_CLUE[n];
    }

    function fmtDelta(d) {
        if (d > 0) return `+${d}`;
        if (d < 0) return `${d}`;
        return '±0';
    }

    function requiredBudgetFor(nextClueNum) {
        return Math.max(0, (Number(nextClueNum) || 1) - 3);
    }

    function canRevealClue(nextClueNum) {
        const run = load().activeRun;
        if (!run) return true;
        return run.budget >= requiredBudgetFor(nextClueNum);
    }

    function esc(str) {
        return String(str == null ? '' : str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    function normTr(str) {
        return String(str || '')
            .replace(/İ/g, 'i').replace(/I/g, 'ı')
            .toLowerCase()
            .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
            .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function renderAvatar(cfg, size, opts) {
        const AV = global.PsikoVakaAvatar;
        if (!AV) return '';
        return AV.render(cfg, Object.assign({ size: size || 88, framed: false, animated: true }, opts || {}));
    }

    function randomPatientAvatar(seed) {
        const AV = global.PsikoVakaAvatar;
        if (AV && typeof AV.randomConfig === 'function') {
            return AV.randomConfig(seed || ('pat_' + Date.now() + '_' + Math.random()));
        }
        return {};
    }

    // ------------------------------------------------------------ Online Sıralama
    function getAccount() { return global.PsikoVakaAccount || null; }
    function getSbClient() {
        const acc = getAccount();
        return acc && typeof acc.getClient === 'function' ? acc.getClient() : null;
    }

    async function submitScoreRemote(streak, avgClues) {
        const acc = getAccount();
        const client = getSbClient();
        if (!acc || !client || acc.state !== 'ready' || !(streak > 0)) return;
        try {
            const { error } = await client.rpc('submit_climb_score', {
                p_streak: Math.round(streak),
                p_avg_clues: Number.isFinite(Number(avgClues)) ? Number(Number(avgClues).toFixed(2)) : 0
            });
            if (!error) fetchLeaderboard(true);
        } catch (e) {}
    }

    async function fetchLeaderboard(force) {
        const client = getSbClient();
        if (!client) {
            lbCache = { loading: false, rows: null, me: null, error: 'offline', unsupported: false };
            renderLeaderboardMount();
            return;
        }
        if (lbCache.loading && !force) return;
        lbCache.loading = true;
        lbCache.error = null;
        renderLeaderboardMount();
        try {
            const { data, error } = await client.rpc('get_climb_leaderboard', { p_limit: 30 });
            if (error) {
                const msg = String(error.message || error.code || '');
                const unsup = error.code === 'PGRST202' || /get_climb_leaderboard/i.test(msg) || /does not exist/i.test(msg);
                lbCache = { loading: false, rows: null, me: null, error: msg, unsupported: unsup };
            } else {
                const d = data || {};
                lbCache = { loading: false, rows: Array.isArray(d.rows) ? d.rows : [], me: d.me || null, error: null, unsupported: false };
            }
        } catch (e) {
            lbCache = { loading: false, rows: null, me: null, error: 'network', unsupported: false };
        }
        renderLeaderboardMount();
    }

    function renderLeaderboardMount() {
        const mount = document.getElementById('climbLeaderboardMount');
        if (!mount) return;
        const acc = getAccount();
        const snap = acc && typeof acc.snapshot === 'function' ? acc.snapshot() : null;
        const myId = snap && snap.user ? snap.user.id : null;
        const isGuest = !acc || acc.state !== 'ready';

        if (lbCache.loading && !lbCache.rows) {
            mount.innerHTML = `<div class="tr-lb-state">Sıralama yükleniyor…</div>`;
            return;
        }
        if (lbCache.unsupported) {
            mount.innerHTML = `<div class="tr-lb-state">Online Tırmanış sıralaması sunucu güncellemesi (0009) uygulandığında burada görünecek.</div>`;
            return;
        }
        if (lbCache.error === 'offline') {
            mount.innerHTML = `<div class="tr-lb-state">Çevrimdışı modda online sıralama görüntülenemiyor.</div>`;
            return;
        }
        if (lbCache.error || !lbCache.rows) {
            mount.innerHTML = `<div class="tr-lb-state">Sıralama şu an yüklenemedi.</div>`;
            return;
        }
        if (!lbCache.rows.length) {
            mount.innerHTML = `<div class="tr-lb-state">Henüz kayıtlı Tırmanış rekoru yok — ilk rekoru sen kır!</div>` +
                (isGuest ? `<p class="tr-lb-guest-note">Skorunun sıralamaya yazılması için <a href="#/profil">giriş yap</a>.</p>` : '');
            return;
        }

        const badgeFn = (rp) => (global.PsikoVakaOnline && typeof global.PsikoVakaOnline.leagueBadge === 'function')
            ? global.PsikoVakaOnline.leagueBadge(rp, 16) : '';
        const rowHtml = (r) => {
            const medal = r.pos === 1 ? '🥇' : r.pos === 2 ? '🥈' : r.pos === 3 ? '🥉' : `#${r.pos}`;
            const isMe = myId && r.user_id === myId;
            const avgTxt = Number(r.avg_clues) > 0 ? `ort. ${Number(r.avg_clues).toFixed(1)} ipucu` : '';
            return `<li class="tr-lb-row${isMe ? ' is-me' : ''}">
                <span class="tr-lb-pos">${medal}</span>
                <span class="tr-lb-av">${renderAvatar(r.avatar || {}, 34, { animated: false })}</span>
                <span class="tr-lb-who">
                    <span class="tr-lb-name">${esc(r.username)}${isMe ? ' <em>(sen)</em>' : ''}</span>
                    <span class="tr-lb-sub">${badgeFn(r.ranked_points)}<span>${avgTxt}</span></span>
                </span>
                <span class="tr-lb-score"><strong>${r.best_streak}</strong><span>seri</span></span>
            </li>`;
        };
        const inTop = lbCache.me && lbCache.rows.some(r => r.user_id === lbCache.me.user_id);
        mount.innerHTML = `
            ${isGuest ? `<p class="tr-lb-guest-note">Skorunun sıralamaya yazılması için <a href="#/profil">giriş yap</a>.</p>` : ''}
            <ol class="tr-lb-list">${lbCache.rows.map(rowHtml).join('')}</ol>
            ${lbCache.me && !inTop ? `<div class="tr-lb-me-sep">Senin sıran</div><ol class="tr-lb-list">${rowHtml(lbCache.me)}</ol>` : ''}
        `;
    }

    // ------------------------------------------------------------ Vaka & Tanı Verisi
    function getAllCases() {
        const gm = global.game;
        const raw = (gm && Array.isArray(gm.allMasterCases) && gm.allMasterCases.length)
            ? gm.allMasterCases
            : (typeof CLINICAL_CASES !== 'undefined' ? CLINICAL_CASES : []);
        return raw.filter(c => c && !c.archived && c.diagnosisId && Array.isArray(c.clues) && c.clues.length >= 6);
    }

    function getDiagnoses() {
        const gm = global.game;
        if (gm && Array.isArray(gm.diagnoses) && gm.diagnoses.length) return gm.diagnoses;
        return typeof DIAGNOSES_DATABASE !== 'undefined' ? DIAGNOSES_DATABASE : [];
    }

    function pickNextCase(run) {
        const all = getAllCases();
        if (!all.length) return null;
        const used = new Set((run && run.usedIds) || []);
        let fresh = all.filter(c => !used.has(c.id));
        if (!fresh.length) {
            if (run) run.usedIds = [];
            fresh = all;
        }
        return fresh[Math.floor(Math.random() * fresh.length)];
    }

    function clueTextAt(caseObj, idx) {
        if (!caseObj || !Array.isArray(caseObj.clues)) return '';
        const raw = caseObj.clues[idx];
        return typeof raw === 'object' && raw !== null ? (raw.text || '') : String(raw || '');
    }

    // ------------------------------------------------------------ Oda-İçi Seans Akışı
    function clearTimers() {
        clearTimeout(walkTimer); walkTimer = 0;
        clearTimeout(leaveTimer); leaveTimer = 0;
    }

    function startNewRun() {
        clearTimers();
        const s = load();
        lastFinishedRun = null;
        s.activeRun = {
            streak: 0,
            budget: START_BUDGET,
            totalClues: 0,
            usedIds: []
        };
        save();
        updateHomeCard();
        bringNextPatient();
    }

    function continueRun() {
        const s = load();
        if (!s.activeRun) {
            startNewRun();
            return;
        }
        if (session && !session.result) {
            render();
            return;
        }
        bringNextPatient();
    }

    function bringNextPatient() {
        clearTimers();
        const s = load();
        if (!s.activeRun) {
            startNewRun();
            return;
        }
        const c = pickNextCase(s.activeRun);
        if (!c) return;
        s.activeRun.usedIds.push(c.id);
        save();

        session = {
            caseObj: c,
            patientAvatar: randomPatientAvatar(c.id + '_' + Date.now()),
            phase: 'entering',
            emote: null,
            unlockedClues: 1,
            viewingClue: 1,
            result: null
        };
        acIndex = -1;
        acItems = [];
        render();

        const gm = global.game;
        if (gm && typeof gm.playTone === 'function') gm.playTone('click');

        // Danışan sol kapıdan halıya yürüyüp oturur
        walkTimer = setTimeout(() => {
            if (!session || session.phase !== 'entering') return;
            session.phase = 'seated';
            render();
            const inp = document.getElementById('trGuessInput');
            if (inp) { try { inp.focus({ preventScroll: true }); } catch (e) {} }
        }, 760);
    }

    function revealNextClue() {
        if (!session || session.result || session.phase !== 'seated') return;
        const maxClues = Math.min(6, (session.caseObj.clues || []).length);
        if (session.unlockedClues >= maxClues) return;
        const nextNum = session.unlockedClues + 1;
        if (!canRevealClue(nextNum)) {
            const btn = document.getElementById('btnTrNextClue');
            if (btn) {
                btn.classList.remove('is-shake');
                void btn.offsetWidth;
                btn.classList.add('is-shake');
                setTimeout(() => btn.classList.remove('is-shake'), 260);
            }
            return;
        }
        session.unlockedClues = nextNum;
        session.viewingClue = nextNum;
        const gm = global.game;
        if (gm && typeof gm.playTone === 'function') gm.playTone('clue');
        render();

        // Danışan konuşma zıplaması
        const pat = document.getElementById('trPatientNode');
        if (pat) {
            pat.classList.remove('is-talking');
            void pat.offsetWidth;
            pat.classList.add('is-talking');
            setTimeout(() => pat.classList.remove('is-talking'), 260);
        }
    }

    function selectClueTab(num) {
        if (!session || session.result) return;
        const n = Math.max(1, Math.min(session.unlockedClues, Number(num) || 1));
        if (session.viewingClue === n) return;
        session.viewingClue = n;
        const gm = global.game;
        if (gm && typeof gm.playTone === 'function') gm.playTone('click');
        render();
    }

    function submitGuess(rawText, selectedId) {
        if (!session || session.result || session.phase !== 'seated') return;
        const diagnoses = getDiagnoses();
        const clean = normTr(rawText);
        let chosen = (selectedId && diagnoses.find(d => d.id === selectedId)) ||
            diagnoses.find(d =>
                normTr(d.nameTr) === clean ||
                normTr(d.nameEn) === clean ||
                (Array.isArray(d.aliases) && d.aliases.some(a => normTr(a) === clean))
            );
        if (!chosen) {
            const bar = document.getElementById('trGuessBar');
            const err = document.getElementById('trGuessErr');
            if (bar) {
                bar.classList.remove('is-shake');
                void bar.offsetWidth;
                bar.classList.add('is-shake');
                setTimeout(() => bar.classList.remove('is-shake'), 260);
            }
            if (err) err.textContent = 'Listede yok; önerilerden bir tanı seç.';
            return;
        }

        const c = session.caseObj;
        const correctDiag = diagnoses.find(d => d.id === c.diagnosisId) || {};
        const won = chosen.id === c.diagnosisId;
        const usedClues = session.unlockedClues;
        const d = deltaFor(usedClues);
        const s = load();
        const gm = global.game;

        if (won) {
            if (gm && typeof gm.playTone === 'function') gm.playTone('win');
            if (gm && typeof gm.launchConfetti === 'function') gm.launchConfetti();
            if (s.activeRun) {
                s.activeRun.streak += 1;
                s.activeRun.totalClues += usedClues;
                s.activeRun.budget = Math.max(0, s.activeRun.budget + d);
                const newRec = s.activeRun.streak > s.bestStreak;
                if (newRec) {
                    s.bestStreak = s.activeRun.streak;
                    submitScoreRemote(s.activeRun.streak, s.activeRun.totalClues / s.activeRun.streak);
                }
                session.result = {
                    won: true,
                    chosenName: chosen.nameTr,
                    correctName: correctDiag.nameTr || c.diagnosisId,
                    correctEn: correctDiag.nameEn || '',
                    usedClues,
                    delta: d,
                    newRecord: newRec,
                    streakAfter: s.activeRun.streak,
                    budgetAfter: s.activeRun.budget
                };
            }
            session.emote = 'cheer';
            save();
            updateHomeCard();
        } else {
            if (gm && typeof gm.playTone === 'function') gm.playTone('cold');
            const run = s.activeRun || { streak: 0, totalClues: 0 };
            const finalStreak = run.streak || 0;
            const avgNum = finalStreak > 0 ? (run.totalClues / finalStreak) : 0;
            const isRec = finalStreak > 0 && finalStreak >= s.bestStreak;
            s.totalRuns += 1;
            s.activeRun = null;
            lastFinishedRun = { streak: finalStreak, avgClues: finalStreak > 0 ? avgNum.toFixed(1) : '—', isRecord: isRec };
            session.result = {
                won: false,
                chosenName: chosen.nameTr,
                correctName: correctDiag.nameTr || c.diagnosisId,
                correctEn: correctDiag.nameEn || '',
                usedClues,
                delta: 0,
                finalStreak,
                avgClues: lastFinishedRun.avgClues,
                isRecord: isRec
            };
            session.emote = 'sad';
            save();
            updateHomeCard();
            if (finalStreak > 0) submitScoreRemote(finalStreak, avgNum);
        }

        render();

        // Kısa tepki sonrası danışan sol kapıdan çıkar
        leaveTimer = setTimeout(() => {
            if (!session || !session.result) return;
            session.phase = 'leaving';
            render();
            walkTimer = setTimeout(() => {
                if (!session || !session.result) return;
                session.phase = 'gone';
                render();
            }, 780);
        }, 900);
    }

    function buildDiagnosisInfoHtml(caseObj, res) {
        const xp = (global.PsikoVakaExplain && typeof global.PsikoVakaExplain.get === 'function')
            ? global.PsikoVakaExplain.get(caseObj) : null;
        const manual = (typeof DSM5_MANUAL !== 'undefined' && DSM5_MANUAL && DSM5_MANUAL[caseObj.diagnosisId])
            ? DSM5_MANUAL[caseObj.diagnosisId] : null;
        const whyThis = (xp && xp.whyThis) || (caseObj.explanation && caseObj.explanation.whyThis) || (manual && manual.clinicalDescription && manual.clinicalDescription.overview) || '';
        const teaching = (xp && xp.teachingPoint) || (caseObj.explanation && caseObj.explanation.teachingPoint) || '';

        return `
            <div class="tr-result-card ${res.won ? 'is-win' : 'is-loss'}">
                <div class="tr-result-top">
                    <div class="tr-result-badge">${res.won ? '✅ Doğru Teşhis!' : '❌ Tırmanış Sona Erdi'}</div>
                    <div class="tr-result-meta">
                        ${res.won
                            ? `<span>Seri: <strong>${res.streakAfter}</strong></span> · <span>Bütçe: <strong>${res.budgetAfter}</strong> (${fmtDelta(res.delta)})</span>${res.newRecord ? ' · <strong class="tr-rec-tag">🏆 Yeni Rekor!</strong>' : ''}`
                            : `<span>Toplam Seri: <strong>${res.finalStreak}</strong></span> · <span>Ort. İpucu: <strong>${res.avgClues}</strong></span>`
                        }
                    </div>
                </div>
                <div class="tr-result-diag">
                    <strong>${esc(res.correctName)}</strong>
                    ${res.correctEn ? `<span class="tr-result-en">${esc(res.correctEn)}</span>` : ''}
                    ${!res.won ? `<div class="tr-result-yours">Senin tahminin: <span>${esc(res.chosenName)}</span></div>` : ''}
                </div>
                ${whyThis ? `<p class="tr-result-why">${esc(whyThis)}</p>` : ''}
                ${teaching ? `<div class="tr-result-tip"><strong>💡 Klinik Not:</strong> ${esc(teaching)}</div>` : ''}
                <div class="tr-result-actions">
                    <a class="btn btn-secondary" href="#/kutuphane/tani/${encodeURIComponent(caseObj.diagnosisId)}">📖 Tanıyı İncele</a>
                    ${res.won
                        ? `<button type="button" class="btn btn-primary tr-start-btn" id="btnTrNextPatient">➡️ Sıradaki Danışan (Vaka #${res.streakAfter + 1})</button>`
                        : `<button type="button" class="btn btn-primary tr-start-btn" id="btnClimbStart">🔄 Yeni Tırmanışa Başla</button>`
                    }
                </div>
            </div>
        `;
    }

    // ------------------------------------------------------------ Render
    function render() {
        const root = document.getElementById('climbMount');
        if (!root) return;
        const s = load();
        const gm = global.game;
        const myCfg = (gm && gm.myAvatar) || (global.PsikoVakaAvatar && global.PsikoVakaAvatar.DEFAULT) || {};
        const run = s.activeRun;
        const inCase = !!(session && !session.result);
        const curClue = session ? session.unlockedClues : 1;
        const curDelta = deltaFor(curClue);

        // Danışan Nöro katmanı
        let patientHtml = '';
        if (session && session.phase !== 'gone') {
            const pCls = session.phase === 'entering' ? 'is-entering' : (session.phase === 'leaving' ? 'is-leaving' : 'is-seated');
            const pFace = session.phase === 'leaving' ? 'left' : 'right';
            const pWalk = session.phase === 'entering' || session.phase === 'leaving';
            const canClickPat = session.phase === 'seated' && !session.result && session.unlockedClues < 6 && canRevealClue(session.unlockedClues + 1);
            const reactionTxt = session.result ? (session.result.won ? 'Teşekkürler hocam! ✨' : 'Anladım hocam…') : '';

            patientHtml = `
                <div class="tr-patient ${pCls}${canClickPat ? ' is-clickable' : ''}" id="trPatientNode" ${canClickPat ? 'role="button" tabindex="0" title="Yeni ipucu için danışana tıkla"' : ''}>
                    ${reactionTxt ? `<div class="tr-react-bubble">${esc(reactionTxt)}</div>` : ''}
                    ${renderAvatar(session.patientAvatar, 88, { facing: pFace, walking: pWalk, emote: session.emote || undefined })}
                    <span class="tr-noro-tag">Danışan${canClickPat ? ' · 💬' : ''}</span>
                </div>
            `;
        }

        // Danışanın üstündeki konuşma balonu (aktif vaka + danışan oturduğunda)
        let clueBubbleHtml = '';
        if (session && !session.result && session.phase === 'seated') {
            const c = session.caseObj;
            const maxC = Math.min(6, (c.clues || []).length);
            const vIdx = Math.max(1, Math.min(session.unlockedClues, session.viewingClue));
            const nextNum = session.unlockedClues + 1;
            const canMore = session.unlockedClues < maxC && canRevealClue(nextNum);
            const nextDelta = deltaFor(nextNum);

            const tabs = Array.from({ length: session.unlockedClues }, (_, i) => {
                const n = i + 1;
                return `<button type="button" class="tr-clue-tab${n === vIdx ? ' is-active' : ''}" data-tr-clue="${n}">${n}</button>`;
            }).join('');

            clueBubbleHtml = `
                <div class="tr-clue-bubble" id="trClueBubble">
                    <div class="tr-clue-top">
                        <span class="tr-clue-who">${esc(c.patientSummary || 'Danışan')}</span>
                        <div class="tr-clue-tabs" aria-label="Açılan ipuçları">${tabs}</div>
                    </div>
                    <div class="tr-clue-label">${vIdx}. ${esc(CLUE_LABELS[vIdx - 1] || 'İpucu')}</div>
                    <p class="tr-clue-text">${esc(clueTextAt(c, vIdx - 1))}</p>
                    <div class="tr-clue-foot">
                        ${session.unlockedClues < maxC
                            ? (canMore
                                ? `<button type="button" class="btn btn-secondary btn-sm tr-next-clue-btn" id="btnTrNextClue">💬 Sonraki İpucu (${nextNum}/${maxC} · ${fmtDelta(nextDelta)})</button>`
                                : `<span class="tr-clue-locked">🔒 Bütçe yetersiz (gerekli: ${requiredBudgetFor(nextNum)})</span>`)
                            : `<span class="tr-clue-locked">Tüm ipuçları açıldı (${maxC}/${maxC})</span>`
                        }
                    </div>
                </div>
            `;
        }

        // Alt etkileşim alanı: aktif tahmin kutusu VEYA tanı bilgilendirme kartı VEYA başla düğmesi
        let bottomControlHtml = '';
        if (session && session.result) {
            bottomControlHtml = buildDiagnosisInfoHtml(session.caseObj, session.result);
        } else if (session && !session.result) {
            const deltaCls = curDelta > 0 ? 'is-pos' : curDelta < 0 ? 'is-neg' : 'is-zero';
            bottomControlHtml = `
                <div class="tr-guess-wrap">
                    <div class="tr-guess-hint-row">
                        <span class="tr-hud-pill tr-hud-delta ${deltaCls}">Şu an bilirsen: <strong>${fmtDelta(curDelta)} bütçe</strong></span>
                        <span class="tr-guess-tip">Zor Mod · Tek tahmin hakkı · Kategori gizli</span>
                    </div>
                    <div class="tr-guess-bar" id="trGuessBar">
                        <div class="tr-ac-wrap">
                            <input type="text" id="trGuessInput" class="form-input tr-guess-input" placeholder="DSM-5-TR tanısı yaz..." autocomplete="off" spellcheck="false" ${session.phase !== 'seated' ? 'disabled' : ''}>
                            <ul class="tr-ac-list" id="trAcList" hidden role="listbox"></ul>
                        </div>
                        <button type="button" class="btn btn-primary" id="btnTrSubmitGuess" ${session.phase !== 'seated' ? 'disabled' : ''}>Tahmin Et</button>
                    </div>
                    <div class="tr-guess-err" id="trGuessErr" role="alert"></div>
                </div>
            `;
        } else {
            bottomControlHtml = `
                <div class="tr-actions">
                    ${run ? `
                        <button type="button" class="btn btn-primary tr-start-btn" id="btnClimbContinue">▶️ Devam Et (Vaka #${run.streak + 1})</button>
                        <button type="button" class="btn btn-secondary" id="btnClimbRestart">🔄 Sıfırdan Başla</button>
                    ` : `
                        <button type="button" class="btn btn-primary tr-start-btn" id="btnClimbStart">🏔️ Tırmanışa Başla</button>
                    `}
                </div>
            `;
        }

        root.innerHTML = `
            <div class="tr-header">
                <div>
                    <h1 class="tr-title">🏔️ Tırmanış</h1>
                    <p class="tr-sub">Zor modda tek hakla art arda kaç danışana doğru teşhis koyabilirsin?</p>
                </div>
                <div class="tr-stats">
                    <div class="tr-stat-pill is-best"><span>🏆</span><strong>Rekor: ${s.bestStreak}</strong></div>
                    ${run ? `<div class="tr-stat-pill is-active"><span>🔥</span><strong>Seri: ${run.streak}</strong></div>` : ''}
                    ${run ? `<div class="tr-stat-pill is-budget${run.budget <= 2 ? ' is-low' : ''}"><span>💡</span><strong>Bütçe: ${run.budget}</strong></div>` : ''}
                </div>
            </div>

            <div class="tr-stage-shell">
                <div class="tr-stage${inCase ? ' is-in-session' : ''}">
                    <div class="tr-bg-photo" aria-hidden="true"></div>
                    <div class="tr-fire-ambient" aria-hidden="true"></div>
                    <div class="tr-motes" aria-hidden="true">
                        <span class="tr-mote" style="left:28%;top:28%;animation-delay:0s"></span>
                        <span class="tr-mote" style="left:45%;top:36%;animation-delay:2.1s"></span>
                        <span class="tr-mote" style="left:62%;top:30%;animation-delay:4.2s"></span>
                        <span class="tr-mote" style="left:78%;top:40%;animation-delay:1.5s"></span>
                    </div>
                    ${patientHtml}
                    <div class="tr-noro-seat">
                        ${renderAvatar(myCfg, 90, { facing: 'left', activity: inCase ? 'think' : (session && session.result && session.result.won ? 'wave' : null) })}
                        <span class="tr-noro-tag">Sen</span>
                    </div>
                </div>
                ${clueBubbleHtml}
            </div>

            ${bottomControlHtml}

            <section class="tr-rules-card" aria-label="Tırmanış ipucu bütçesi kuralları">
                <div class="tr-rules-head">
                    <strong>💡 Paylaşımlı İpucu Bütçesi (Başlangıç: 10)</strong>
                    <span>Danışana tıklayarak yeni ipucu iste. Erken bilerek bütçe biriktir; 4–6. ipuçları bütçenden düşer.</span>
                </div>
                <div class="tr-delta-grid">
                    <div class="tr-delta-cell is-pos"><span>1. İpucu</span><strong>+2</strong></div>
                    <div class="tr-delta-cell is-pos"><span>2. İpucu</span><strong>+1</strong></div>
                    <div class="tr-delta-cell is-zero"><span>3. İpucu</span><strong>±0</strong></div>
                    <div class="tr-delta-cell is-neg"><span>4. İpucu</span><strong>−1</strong></div>
                    <div class="tr-delta-cell is-neg"><span>5. İpucu</span><strong>−2</strong></div>
                    <div class="tr-delta-cell is-neg"><span>6. İpucu</span><strong>−3</strong></div>
                </div>
            </section>

            <section class="tr-lb-card" aria-labelledby="trLbTitle">
                <div class="tr-lb-head">
                    <h2 class="tr-lb-title" id="trLbTitle">🏆 En İyi Tırmanışçılar</h2>
                    <button type="button" class="btn btn-ghost btn-sm" id="btnClimbRefreshLb">↻ Yenile</button>
                </div>
                <div id="climbLeaderboardMount"></div>
            </section>
        `;

        bindEvents();
        renderLeaderboardMount();
        if (!lbCache.rows && !lbCache.loading) fetchLeaderboard(false);
    }

    function bindEvents() {
        const btnStart = document.getElementById('btnClimbStart');
        if (btnStart) btnStart.addEventListener('click', startNewRun);

        const btnCont = document.getElementById('btnClimbContinue');
        if (btnCont) btnCont.addEventListener('click', continueRun);

        const btnRestart = document.getElementById('btnClimbRestart');
        if (btnRestart) btnRestart.addEventListener('click', startNewRun);

        const btnNextPat = document.getElementById('btnTrNextPatient');
        if (btnNextPat) btnNextPat.addEventListener('click', bringNextPatient);

        const btnNextClue = document.getElementById('btnTrNextClue');
        if (btnNextClue) btnNextClue.addEventListener('click', revealNextClue);

        const patNode = document.getElementById('trPatientNode');
        if (patNode && patNode.classList.contains('is-clickable')) {
            patNode.addEventListener('click', revealNextClue);
            patNode.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); revealNextClue(); }
            });
        }

        document.querySelectorAll('[data-tr-clue]').forEach(btn => {
            btn.addEventListener('click', () => selectClueTab(btn.dataset.trClue));
        });

        const btnRefLb = document.getElementById('btnClimbRefreshLb');
        if (btnRefLb) btnRefLb.addEventListener('click', () => fetchLeaderboard(true));

        // Otomatik tamamlamalı tanı tahmin kutusu
        const inp = document.getElementById('trGuessInput');
        const list = document.getElementById('trAcList');
        const submitBtn = document.getElementById('btnTrSubmitGuess');
        const errEl = document.getElementById('trGuessErr');
        if (inp && list && submitBtn) {
            const closeAc = () => { list.hidden = true; list.innerHTML = ''; acItems = []; acIndex = -1; };
            const pickItem = (d) => {
                inp.value = d.nameTr;
                inp.dataset.selectedId = d.id;
                if (errEl) errEl.textContent = '';
                closeAc();
                inp.focus();
            };
            const renderAc = (q) => {
                const nq = normTr(q);
                if (!nq) { closeAc(); return; }
                const diags = getDiagnoses();
                const matches = diags.filter(d =>
                    normTr(d.nameTr).includes(nq) ||
                    normTr(d.nameEn).includes(nq) ||
                    (Array.isArray(d.aliases) && d.aliases.some(a => normTr(a).includes(nq)))
                ).slice(0, 8);
                acItems = matches;
                acIndex = matches.length ? 0 : -1;
                if (!matches.length) { closeAc(); return; }
                list.innerHTML = matches.map((d, i) =>
                    `<li class="tr-ac-item${i === 0 ? ' is-active' : ''}" role="option" data-ac-idx="${i}">
                        <strong>${esc(d.nameTr)}</strong>
                        ${d.nameEn ? `<span>${esc(d.nameEn)}</span>` : ''}
                    </li>`
                ).join('');
                list.hidden = false;
            };

            inp.addEventListener('input', () => {
                delete inp.dataset.selectedId;
                if (errEl) errEl.textContent = '';
                renderAc(inp.value);
            });
            inp.addEventListener('keydown', (e) => {
                if (!list.hidden && acItems.length) {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        acIndex = (acIndex + 1) % acItems.length;
                        list.querySelectorAll('.tr-ac-item').forEach((el, i) => el.classList.toggle('is-active', i === acIndex));
                        return;
                    }
                    if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        acIndex = (acIndex - 1 + acItems.length) % acItems.length;
                        list.querySelectorAll('.tr-ac-item').forEach((el, i) => el.classList.toggle('is-active', i === acIndex));
                        return;
                    }
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (acIndex >= 0 && acItems[acIndex]) pickItem(acItems[acIndex]);
                        return;
                    }
                    if (e.key === 'Escape') { closeAc(); return; }
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    submitGuess(inp.value, inp.dataset.selectedId);
                }
            });
            list.addEventListener('mousedown', (e) => {
                const li = e.target.closest('[data-ac-idx]');
                if (!li) return;
                e.preventDefault();
                const d = acItems[Number(li.dataset.acIdx)];
                if (d) pickItem(d);
            });
            submitBtn.addEventListener('click', () => submitGuess(inp.value, inp.dataset.selectedId));
        }
    }

    function updateHomeCard() {
        const sub = document.getElementById('homeClimbMeta');
        const btn = document.getElementById('btnHomeClimb');
        if (!sub) return;
        const s = load();
        if (s.activeRun && s.activeRun.streak > 0) {
            sub.textContent = `Seri: ${s.activeRun.streak} · Bütçe: ${s.activeRun.budget} · Rekor: ${s.bestStreak}`;
            if (btn) btn.textContent = `Devam (#${s.activeRun.streak + 1})`;
        } else if (s.bestStreak > 0) {
            sub.textContent = `🏆 Rekor: ${s.bestStreak} seri · Zor mod`;
            if (btn) btn.textContent = 'Başla';
        } else {
            sub.textContent = 'Zor mod seri · 10 ipucu bütçesi';
            if (btn) btn.textContent = 'Başla';
        }
    }

    function renderPlayHud() {
        const bar = document.getElementById('climbHudBar');
        if (bar) bar.hidden = true;
    }

    global.PsikoVakaTirmanis = {
        START_BUDGET,
        load,
        render,
        startNewRun,
        continueRun,
        bringNextPatient,
        renderPlayHud,
        updateHomeCard,
        canRevealClue,
        requiredBudgetFor,
        deltaFor,
        fmtDelta
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateHomeCard);
    } else {
        updateHomeCard();
    }
})(typeof window !== 'undefined' ? window : globalThis);
