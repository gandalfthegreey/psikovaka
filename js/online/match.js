/**
 * PsikoVaka Online — maç: mevcut oyun motorunu (PsikoVakaGame) "online" kipinde sürer.
 *  - Vaka sunucunun seçtiği case_id ile CLINICAL_CASES'ten yüklenir; ipucu, tahmin kutusu, öneriler motorundur.
 *  - Her tahmin submit_guess'e gider; doğru/yanlış, puan, aşama ve bitiş SUNUCUNUN kararıdır.
 *    Yerel motor puan vermez, kazanma/kaybetmeye karar vermez, istatistik/çözüldü kaydı yazmaz.
 *  - Üst şerit (HUD): tur, sunucu saatine göre sayaç, puan, rakiplerin tahmin sayısı/bitti durumu (tahmin içeriği asla).
 *  - Katman görünümleri: geri sayım, tur sonucu, HP çubukları, eleme/izleyici, eşleşme ağacı, final podyumu.
 */
(function (global) {
    'use strict';
    const NS = global.PsikoVakaOnline;
    const { esc, icon, $ } = NS.util;
    const T = NS.T;

    const M = {
        roundKey: null, saved: null, busy: false, hudTimer: null, overrides: false,
        lastAnswer: null, keyIssues: [], finishedKey: null, prevHp: {}
    };

    const g = () => NS.game();
    const S = () => NS.rooms.state;
    const myId = () => NS.api.myId();
    // ---- zorluk (0007, ajan Z1): odanın ayarları sunucudan (rooms.tek_hak / kategori_gizli)
    const Zm = () => global.PsikoVakaZorluk;
    function zor() { const s = S(); return { tekHak: !!(s && s.room && s.room.tek_hak), kategoriGizli: !!(s && s.room && s.room.kategori_gizli) }; }
    const cluesOf = (rp) => Math.min(6, 1 + ((rp && rp.ek_ipucu) || 0));
    const zorBadge = (cls) => (Zm() ? Zm().badge(zor(), { cls }) : '');
    function applyRoomZorluk() {
        const s = S(), gm = g();
        if (!s || !gm || !gm.setCaseZorluk) return;
        const z = zor();
        gm.setCaseZorluk(z, { locked: true });
        gm.clueRevealHandler = z.tekHak ? async () => {
            const st = S(); if (!st || !st.round) return { ok: false };
            const key = st.room.id + ':' + st.round.round_no;
            const r = await NS.api.revealClue(st.room.id, st.round.round_no);
            if (M.roundKey !== key) return { ok: false };
            if (!r.ok) { gm.showToast(r.error.code === 'UNSUPPORTED' ? 'Sunucu bu özelliği henüz desteklemiyor.' : r.error.message); return { ok: false }; }
            const mine = NS.rooms.myRound(); if (mine) mine.ek_ipucu = Math.max(0, (r.data.clues_opened || 1) - 1);
            updateHud();
            return { ok: true, clues: r.data.clues_opened };
        } : null;
        const mine = NS.rooms.myRound();
        if (z.tekHak && mine && cluesOf(mine) > gm.unlockedClues) { gm.unlockedClues = cluesOf(mine); gm.renderClues(); gm.updateRemainingGuessesUI(); }
    }

    // ------------------------------------------------------------ veri yardımcıları
    function findCase(id) {
        const gm = g();
        const pool = (gm && gm.allMasterCases) || (typeof CLINICAL_CASES !== 'undefined' ? CLINICAL_CASES : []);
        return pool.find(c => c.id === id) || null;
    }
    function itemName(kind, id) {
        const gm = g(); if (!gm || !id) return id || '';
        const list = kind === 'therapy' ? gm.therapies : kind === 'pharmacology' ? gm.pharmacology : gm.diagnoses;
        const x = list.find(i => i.id === id);
        return x ? x.nameTr : id;
    }
    function localAnswer(caseObj) {
        if (!caseObj) return null;
        const gm = g();
        return {
            diagnosis_id: caseObj.diagnosisId,
            therapy_id: caseObj.therapyId || 'cbt_general',
            pharmacology_id: caseObj.pharmacologyId || (gm && gm.getFallbackPharmacologyId ? gm.getFallbackPharmacologyId(caseObj) : null)
        };
    }
    function answerText(ans, target) {
        if (!ans) return '';
        const d = itemName('diagnosis', ans.diagnosis_id), t = itemName('therapy', ans.therapy_id), p = itemName('pharmacology', ans.pharmacology_id);
        if (target === 'therapy') return t;
        if (target === 'pharmacology') return p;
        if (target === 'combo') return [d, t, p].join(' · ');
        return d;
    }
    function roundAnswer() {
        const s = S();
        if (!s || !s.round) return null;
        if (M.lastAnswer && M.lastAnswer.key === s.room.id + ':' + s.round.round_no) return M.lastAnswer.answer;
        return localAnswer(findCase(s.round.case_id));
    }
    function noteKeyIssue(kind, detail) {
        const k = kind + ':' + JSON.stringify(detail);
        if (M.keyIssues.find(x => x.k === k)) return;
        M.keyIssues.push({ k, kind, detail, at: new Date().toISOString() });
        console.warn('[PsikoVakaOnline] CEVAP ANAHTARI UYUŞMAZLIĞI', kind, detail);
        NS.bus.emit('key-issue', M.keyIssues);
    }
    function compareAnswer(caseObj, ans) {
        const loc = localAnswer(caseObj);
        if (!loc || !ans) return;
        ['diagnosis_id', 'therapy_id', 'pharmacology_id'].forEach(k => {
            if (ans[k] && loc[k] && ans[k] !== loc[k]) noteKeyIssue('answer', { case_id: caseObj.id, field: k, server: ans[k], client: loc[k] });
        });
    }

    function stageKind(stage) {
        const s = S();
        if (!s) return 'diagnosis';
        if (s.room.target_type === 'combo') return ['diagnosis', 'therapy', 'pharmacology'][(stage || 1) - 1];
        return s.room.target_type;
    }
    function opponentsFor(s) {
        const me = myId();
        const rps = s.round_players || [];
        if (s.room.format === 'bracket') {
            const pr = (s.pairings || []).find(p => p.bracket_round === s.room.current_round && (p.player_a === me || p.player_b === me));
            const opp = pr ? (pr.player_a === me ? pr.player_b : pr.player_a) : null;
            return rps.filter(r => r.user_id === opp);
        }
        return rps.filter(r => r.user_id !== me);
    }
    function myPairing(s) {
        const me = myId();
        return (s.pairings || []).find(p => p.bracket_round === s.room.current_round && (p.player_a === me || p.player_b === me)) || null;
    }
    function myPairingDone(s) {
        const pr = myPairing(s);
        if (!pr) return false;
        const rp = (uid) => (s.round_players || []).find(r => r.user_id === uid);
        const a = rp(pr.player_a), b = rp(pr.player_b);
        return !!(a && a.finished && (!pr.player_b || (b && b.finished)));
    }

    // ------------------------------------------------------------ motor köprüsü
    function saveGameState() {
        const gm = g();
        if (!gm || M.saved) return;
        M.saved = { targetGameMode: gm.targetGameMode, currentMode: gm.currentMode };
    }
    function installOverrides() {
        const gm = g();
        if (!gm || M.overrides) return;
        gm.submitGuess = onlineSubmit;
        gm.giveUp = onlineGiveUp;
        M.overrides = true;
        document.body.classList.add('ol-in-match');
    }
    function removeOverrides() {
        const gm = g();
        if (gm && M.overrides) { delete gm.submitGuess; delete gm.giveUp; }
        M.overrides = false;
        document.body.classList.remove('ol-in-match');
    }

    /** Oynanan turu ekrana getirir (tekrar çağrılması güvenli). */
    function enterRound() {
        const s = S(), gm = g();
        if (!s || !gm || !s.round) return;
        const key = s.room.id + ':' + s.round.round_no;
        const mine = NS.rooms.myRound();
        saveGameState();
        installOverrides();
        if (M.roundKey !== key) {
            M.roundKey = key;
            M.finishedKey = null;
            const caseObj = findCase(s.round.case_id);
            M.missingKey = null;
            if (!caseObj) {
                noteKeyIssue('missing_case', { case_id: s.round.case_id });
                M.missingKey = key;
                showMissingCase(s.round.case_id);
                return;
            }
            if (gm.targetGameMode !== s.room.target_type) gm.setTargetGameMode(s.room.target_type, false);
            gm.currentMode = 'online';
            gm.startCase(caseObj, `Tur ${s.round.round_no}/${s.room.round_count}`);
            restoreGuesses(caseObj, mine);
            applyRoomZorluk();
            ensureHud();
        } else if (M.missingKey === key) {
            return;
        } else if (gm.currentScreen !== 'play') {
            gm.showScreen('play');
        }
        if (mine && mine.finished && M.finishedKey !== key) {
            finishLocal(mine.won, mine.points, null, mine.elapsed_sec, mine.finish_reason);
        }
        ensureHud();
        updateHud();
    }

    function restoreGuesses(caseObj, mine) {
        const s = S(), gm = g();
        const list = (s.my_guesses || []).slice().sort((a, b) => (a.stage - b.stage) || (a.guess_no - b.guess_no));
        if (!list.length) return;
        const stage = mine ? mine.stage : 1;
        let wrong = 0;
        gm.guesses = [];
        list.forEach(x => {
            const kind = stageKind(x.stage);
            if (!x.is_correct) wrong++;
            if (s.room.target_type === 'combo' && x.is_correct && x.stage < stage) {
                const el = gm.dom['comboStep' + x.stage + 'Val'];
                if (el) el.textContent = itemName(kind, x.item_id);
            }
            if (x.stage === stage) gm.guesses.push(guessView(kind, x.item_id, x.is_correct, x.same_group, x.stage));
        });
        gm.comboStage = stage;
        gm.unlockedClues = Math.min(gm.maxClues, 1 + wrong);
        if (s.room.target_type === 'combo') {
            if (gm.dom.comboStep2Val && stage >= 2 && stage === 2) gm.dom.comboStep2Val.textContent = 'Şimdi terapiyi seç';
            if (gm.dom.comboStep3Val && stage === 3) gm.dom.comboStep3Val.textContent = 'Şimdi ilacı seç';
        }
        gm.updateComboStepperUI();
        gm.syncInputAndBrowserLabels();
        gm.renderClues(); gm.renderGuesses(); gm.updateRemainingGuessesUI();
    }

    function guessView(kind, id, isCorrect, sameGroup, stage) {
        const gm = g();
        let obj, groupName = '';
        if (kind === 'therapy') { obj = gm.therapies.find(t => t.id === id); groupName = obj ? ((gm.therapyFamilies[obj.family] || {}).name || obj.family) : ''; }
        else if (kind === 'pharmacology') { obj = gm.pharmacology.find(p => p.id === id); groupName = obj ? ((gm.pharmacologyFamilies[obj.family] || {}).name || obj.family) : ''; }
        else { obj = gm.diagnoses.find(d => d.id === id); groupName = obj ? ((gm.categories[obj.category] || {}).name || obj.category) : ''; }
        const stageBadge = S() && S().room.target_type === 'combo' ? ['Aşama 1 · Tanı', 'Aşama 2 · Terapi', 'Aşama 3 · İlaç'][stage - 1] : '';
        return { itemId: id, stage, stageBadge, nameTr: obj ? obj.nameTr : id, isCorrect: !!isCorrect, categoryMatch: !!sameGroup, categoryName: groupName };
    }

    /** Motorun kendi seçim mantığıyla (id, ad, takma ad) yazılanı bulur. */
    function resolveChoice() {
        const gm = g();
        const inputVal = gm.dom.diagnosisInput.value.trim();
        if (!inputVal) { gm.showToast('Bir seçenek yaz ya da listeden seç.'); return null; }
        const sel = gm.dom.diagnosisInput.dataset.selectedId;
        const clean = gm.normalizeTurkish(inputVal);
        const kind = gm.getEffectiveTargetType();
        const list = kind === 'therapy' ? gm.therapies : kind === 'pharmacology' ? gm.pharmacology : gm.diagnoses;
        const found = list.find(x => x.id === sel) || list.find(x =>
            gm.normalizeTurkish(x.nameTr) === clean || gm.normalizeTurkish(x.nameEn) === clean ||
            (x.aliases && x.aliases.some(a => gm.normalizeTurkish(a) === clean)));
        if (!found) { gm.showToast('Bu seçenek listede yok. Önerilerden seç.'); return null; }
        return { kind, obj: found };
    }

    function setSubmitting(on) {
        const gm = g();
        M.busy = on;
        if (gm.dom.btnSubmit) { gm.dom.btnSubmit.disabled = on; gm.dom.btnSubmit.classList.toggle('is-loading', on); }
        if (gm.dom.diagnosisInput) gm.dom.diagnosisInput.setAttribute('aria-busy', on ? 'true' : 'false');
    }

    async function onlineSubmit() {
        const gm = g(), s = S();
        if (!s || !s.round || gm.isGameOver || M.busy) return;
        const ch = resolveChoice();
        if (!ch) return;
        if (gm.guesses.some(x => x.itemId === ch.obj.id && x.stage === gm.comboStage)) { gm.showToast('Bunu zaten tahmin ettin.'); return; }
        const roomId = s.room.id, roundNo = s.round.round_no, key = roomId + ':' + roundNo;
        const caseObj = findCase(s.round.case_id);
        setSubmitting(true);
        const r = await NS.api.submitGuess(roomId, roundNo, ch.obj.id);
        setSubmitting(false);
        if (M.roundKey !== key) return;  // tur değişti
        if (!r.ok) {
            const c = r.error.code;
            if (c === 'DUPLICATE_GUESS' || c === 'UNKNOWN_ITEM') { gm.showToast(r.error.message); return; }
            if (c === 'ROUND_CLOSED') { gm.showToast('Süre doldu.'); await NS.api.advanceIfDue(roomId); NS.rooms.refresh(); return; }
            if (c === 'ROUND_NOT_STARTED') { gm.showToast('Tur henüz başlamadı.'); return; }
            gm.showToast(r.error.message);
            NS.rooms.refresh();
            return;
        }
        const d = r.data;
        const kind = stageKind(d.stage);
        // Uyuşmazlık: yerelde doğru olan sunucuda yanlışsa cevap anahtarı eski olabilir
        if (caseObj && !d.is_correct) {
            const loc = localAnswer(caseObj);
            const locId = loc[kind + '_id'];
            if (locId === ch.obj.id) noteKeyIssue('rejected_correct', { case_id: caseObj.id, kind, item: ch.obj.id });
        }
        gm.guesses.push(guessView(kind, ch.obj.id, d.is_correct, d.same_group, d.stage));
        gm.dom.diagnosisInput.value = '';
        delete gm.dom.diagnosisInput.dataset.selectedId;
        gm.closeAutocomplete();
        gm.playTone(d.is_correct ? 'win' : (d.same_group ? 'warm' : 'cold'));
        if (!d.is_correct && gm.unlockedClues < gm.maxClues && !zor().tekHak) gm.unlockedClues++;

        // HUD için kendi satırımı hemen güncelle (sunucu yanıtı)
        const mine = NS.rooms.myRound();
        if (mine) { mine.guess_count = (mine.guess_count || 0) + 1; mine.stage = d.next_stage || d.stage; if (d.finished) { mine.finished = true; mine.won = d.won; mine.points = d.points; mine.elapsed_sec = d.elapsed_sec; mine.finish_reason = d.won ? 'solved' : 'failed'; } }

        if (d.is_correct && d.next_stage) {
            const el = gm.dom['comboStep' + d.stage + 'Val'];
            if (el) el.textContent = ch.obj.nameTr;
            const nx = gm.dom['comboStep' + d.next_stage + 'Val'];
            if (nx) nx.textContent = d.next_stage === 2 ? 'Şimdi terapiyi seç' : 'Şimdi ilacı seç';
            gm.comboStage = d.next_stage;
            gm.guesses = [];
            gm.updateComboStepperUI(); gm.syncInputAndBrowserLabels();
            gm.renderGuesses(); gm.updateRemainingGuessesUI();
            gm.showToast(d.next_stage === 2 ? 'Tanı doğru. Şimdi terapiyi seç.' : 'Terapi doğru. Şimdi ilacı seç.');
            NS.announce(d.next_stage === 2 ? 'Aşama 2: terapi' : 'Aşama 3: ilaç');
        } else if (d.finished) {
            if (d.won && s.room.target_type === 'combo') { const el = gm.dom.comboStep3Val; if (el) el.textContent = ch.obj.nameTr; }
            if (d.answer) { M.lastAnswer = { key, answer: d.answer }; compareAnswer(caseObj, d.answer); }
            finishLocal(d.won, d.points, d.answer, d.elapsed_sec, d.won ? 'solved' : 'failed');
        } else {
            gm.renderClues(); gm.renderGuesses(); gm.updateRemainingGuessesUI();
            // Bilgi bildirimi yok (H1): tahmin şeridi "grup doğru"yu gösterir
            NS.announce(d.same_group ? `Grup doğru: ${gm.guesses[gm.guesses.length - 1].categoryName}. İpucu ${gm.unlockedClues}/${gm.maxClues} açıldı.` : `Yanlış. İpucu ${gm.unlockedClues}/${gm.maxClues} açıldı.`);
        }
        updateHud();
        if (d.room && (d.room.status !== s.room.status || (d.room.round && d.room.round.closed_at))) NS.rooms.refresh();
    }

    async function onlineGiveUp() {
        const gm = g(), s = S();
        if (!s || !s.round || gm.isGameOver || M.busy) return;
        const pen = NS.leaguesView && NS.leaguesView.failPenalty ? NS.leaguesView.failPenalty() : null;
        const ok = await NS.ui.confirm('Pes et', pen ? `Bu turdan 0 puan alırsın ve tur çözülemedi sayılır (−${pen} Elo). Maç devam eder.` : 'Bu turdan 0 puan alırsın. Maç devam eder.', 'Pes et', { danger: true });
        if (!ok) return;
        const key = s.room.id + ':' + s.round.round_no;
        setSubmitting(true);
        const r = await NS.api.forfeitRound(s.room.id, s.round.round_no);
        setSubmitting(false);
        if (M.roundKey !== key) return;
        if (!r.ok) { gm.showToast(r.error.message); NS.rooms.refresh(); return; }
        if (r.data.answer) { M.lastAnswer = { key, answer: r.data.answer }; compareAnswer(findCase(s.round.case_id), r.data.answer); }
        const mine = NS.rooms.myRound();
        if (mine) { mine.finished = true; mine.won = false; mine.points = 0; mine.finish_reason = 'gave_up'; }
        finishLocal(false, 0, r.data.answer, null, 'gave_up');
        NS.rooms.refreshSoon();
    }

    /** Oyuncu turu bitirdi: girişi kapat, ipuçlarını aç, bekleme paneli. Yerel istatistik yazılmaz. */
    function finishLocal(won, points, answer, elapsed, reason) {
        const gm = g(), s = S();
        if (!gm || !s) return;
        M.finishedKey = M.roundKey;
        gm.isGameOver = true;
        gm.gameWon = !!won;
        if (gm.dom.diagnosisInput) gm.dom.diagnosisInput.disabled = true;
        if (gm.dom.btnSubmit) gm.dom.btnSubmit.disabled = true;
        if (gm.dom.mainInputSection) gm.dom.mainInputSection.hidden = true;
        if (gm.dom.finishedActions) gm.dom.finishedActions.hidden = true;
        gm.closeAutocomplete(); gm.closeCategoryTree();
        if (gm.cluesUsed == null) gm.cluesUsed = gm.unlockedClues;
        gm.unlockedClues = gm.maxClues;
        gm.updateComboStepperUI();
        gm.renderClues(); gm.renderGuesses(); gm.updateRemainingGuessesUI();
        if (typeof gm.renderZorlukUI === 'function') gm.renderZorlukUI();
        if (won && typeof gm.launchConfetti === 'function' && !NS.util.reducedMotion()) gm.launchConfetti();
        const ans = answer || roundAnswer();
        renderWaitPanel(won, points, ans, elapsed, reason);
        try { document.dispatchEvent(new CustomEvent('psikovaka:playstate')); } catch (e) {}
        NS.announce(won ? `Doğru. ${points} puan.` : 'Bu turu bitirdin.');
    }

    function renderWaitPanel(won, points, ans, elapsed, reason) {
        const gm = g(), s = S();
        const host = gm.dom.guessesFeed && gm.dom.guessesFeed.parentNode;
        if (!host) return;
        let p = document.getElementById('olWaitPanel');
        if (!p) {
            p = document.createElement('section');
            p.id = 'olWaitPanel';
            p.className = 'ol-wait';
            p.setAttribute('aria-live', 'polite');
            gm.dom.guessesFeed.insertAdjacentElement('afterend', p);
            p.addEventListener('click', (e) => {
                const b = e.target.closest('[data-ol-m]');
                if (!b) return;
                if (b.dataset.olM === 'bracket') openBracketSheet();
                if (b.dataset.olM === 'report' && gm.openResultModal) gm.openResultModal(gm.gameWon);
            });
        }
        const mine = NS.rooms.myRound();
        const n = mine ? mine.guess_count : gm.guesses.length;
        const title = won ? `+${points} puan` : (T.finish[reason] || 'Bu tur olmadı');
        const sub = won ? `${zor().tekHak ? `Tek hakla, ${mine ? cluesOf(mine) : (gm.cluesUsed || 1)}. ipucunda` : `${n}. tahminde`}${elapsed != null ? ` · ${elapsed} sn` : ''}` : 'Bu turdan puan yok';
        p.innerHTML = `
            <div class="ol-wait-head ${won ? 'is-win' : 'is-loss'}">
                <span class="ol-wait-icon">${icon(won ? 'check' : 'flag')}</span>
                <span class="ol-wait-text"><span class="ol-wait-title">${esc(title)}</span><span class="ol-wait-sub">${esc(sub)}</span>${zorBadge('is-sm')}</span>
            </div>
            ${ans ? `<div class="ol-wait-answer"><span class="ol-eyebrow">Doğru cevap</span><span>${esc(answerText(ans, s.room.target_type))}</span></div>` : ''}
            <div class="ol-wait-others" id="olWaitOthers"></div>
            <p class="ol-wait-note">${icon('hourglass')}<span>Sonuç herkes bitirince ya da süre dolunca gelir.</span></p>
            <div class="ol-wait-actions">
                ${s.room.format === 'bracket' ? `<button class="btn btn-secondary btn-sm" type="button" data-ol-m="bracket">${icon('bracket')}<span>Ağacı gör</span></button>` : ''}
                <button class="btn btn-ghost btn-sm" type="button" data-ol-m="report">${icon('file')}<span>Vaka raporu</span></button>
            </div>`;
        updateWaitOthers();
    }
    function removeWaitPanel() { const p = document.getElementById('olWaitPanel'); if (p) p.remove(); }

    function statusBits(rp) {
        if (!rp) return { cls: 'is-wait', text: 'Bekliyor', icon: 'hourglass' };
        const tek = zor().tekHak;
        if (rp.finished && rp.won) return { cls: 'is-won', text: tek ? `Çözdü · ${cluesOf(rp)}. ipucu` : `Çözdü · ${rp.guess_count}. tahmin`, icon: 'check' };
        if (rp.finished) return { cls: 'is-lost', text: T.finish[rp.finish_reason] || 'Bitti', icon: rp.finish_reason === 'absent' ? 'wifi-off' : 'x' };
        return { cls: 'is-play', text: tek ? `${cluesOf(rp)}. ipucu açık` : `${rp.guess_count} tahmin`, icon: 'pen' };
    }
    function updateWaitOthers() {
        const box = document.getElementById('olWaitOthers');
        const s = S();
        if (!box || !s) return;
        const opps = opponentsFor(s);
        if (!opps.length) { box.innerHTML = ''; return; }
        box.innerHTML = `<ul class="ol-mini-list">${opps.map(r => {
            const p = NS.rooms.player(r.user_id) || {};
            const st = statusBits(r);
            return `<li class="ol-mini ${st.cls}">${NS.avatar(p.avatar, { size: 28, framed: true })}<span class="ol-mini-name">${esc(p.username || '')}</span><span class="ol-mini-st">${icon(st.icon)}${esc(st.text)}</span></li>`;
        }).join('')}</ul>`;
    }

    function showMissingCase(caseId) {
        const gm = g();
        NS.app.showLayerView('missing', (root) => {
            root.innerHTML = `<div class="ol-center-view"><div class="ol-card-big">
                <span class="ol-big-icon is-warn">${icon('alert')}</span>
                <h2 class="ol-h2">Vaka bulunamadı</h2>
                <p class="ol-muted">Sunucu bu tur için <code>${esc(caseId)}</code> vakasını seçti ama bu sürümde yok. Sunucudaki cevap anahtarı güncel olmayabilir. Sayfayı yenilemeyi dene.</p>
                <div class="ol-row-btns"><button class="btn btn-secondary" type="button" data-ol-x="forfeit">Bu turu pas geç</button><button class="btn btn-primary" type="button" data-ol-x="reload">${icon('refresh')}<span>Yenile</span></button></div>
            </div></div>`;
            root.querySelector('[data-ol-x="reload"]').onclick = () => location.reload();
            root.querySelector('[data-ol-x="forfeit"]').onclick = async (e) => {
                e.currentTarget.disabled = true;
                const s = S(); if (s && s.round) await NS.api.forfeitRound(s.room.id, s.round.round_no);
                NS.rooms.refresh();
            };
        });
        void gm;
    }

    // ------------------------------------------------------------ HUD
    function ensureHud() {
        const gm = g();
        const scr = gm && gm.dom.screenPlay;
        if (!scr) return null;
        let hud = document.getElementById('olHud');
        if (!hud) {
            hud = document.createElement('div');
            hud.id = 'olHud';
            hud.className = 'ol-hud';
            const bar = scr.querySelector('.play-bar');
            if (bar) bar.insertAdjacentElement('afterend', hud); else scr.insertBefore(hud, scr.firstChild);
            hud.addEventListener('click', (e) => { if (e.target.closest('[data-ol-m="bracket"]')) openBracketSheet(); });
        }
        if (!M.hudTimer) M.hudTimer = setInterval(tickHud, 250);
        return hud;
    }
    function removeHud() {
        clearInterval(M.hudTimer); M.hudTimer = null;
        const h = document.getElementById('olHud'); if (h) h.remove();
        removeWaitPanel();
    }
    function hpBars(s, opts) {
        const me = myId();
        const pl = NS.rooms.active().filter(p => p.played);
        const mine = pl.find(p => p.user_id === me) || pl[0];
        const opp = pl.find(p => p !== mine);
        const max = 600;
        const bar = (p, side) => {
            if (!p) return '';
            const hp = p.hp == null ? max : p.hp;
            const prev = opts && opts.prev && opts.prev[p.user_id] != null ? opts.prev[p.user_id] : hp;
            const dmg = opts && opts.dmg ? (opts.dmg[p.user_id] || 0) : 0;
            return `<div class="ol-hp-side ${side}" data-uid="${esc(p.user_id)}">
                <div class="ol-hp-who">${NS.avatar(p.avatar, { size: opts && opts.big ? 48 : 28, framed: true })}<span class="ol-hp-name">${esc(p.username)}</span><span class="ol-hp-val">${hp}</span></div>
                <div class="ol-hp-track" role="meter" aria-label="${esc(p.username)} can" aria-valuemin="0" aria-valuemax="${max}" aria-valuenow="${hp}">
                    <div class="ol-hp-ghost" data-pct="${(prev / max * 100).toFixed(1)}"></div>
                    <div class="ol-hp-fill${hp / max < 0.3 ? ' is-low' : ''}" data-pct="${(hp / max * 100).toFixed(1)}" data-from="${(prev / max * 100).toFixed(1)}"></div>
                </div>
                ${dmg ? `<span class="ol-hp-dmg">−${dmg}</span>` : ''}
            </div>`;
        };
        return `<div class="ol-hp${opts && opts.big ? ' is-big' : ''}">${bar(mine, 'is-me')}<span class="ol-hp-vs">${opts && opts.mult ? `×${opts.mult}` : 'VS'}</span>${bar(opp, 'is-opp')}</div>`;
    }
    /** HP doluluklarını animasyonla uygula (inline stil yok: CSS değişkeni). */
    function animateHp(root) {
        root.querySelectorAll('.ol-hp-fill, .ol-hp-ghost').forEach(el => {
            const to = el.dataset.pct, from = el.dataset.from;
            if (from != null && !NS.util.reducedMotion()) {
                el.style.setProperty('--pct', from + '%');
                requestAnimationFrame(() => requestAnimationFrame(() => el.style.setProperty('--pct', to + '%')));
            } else el.style.setProperty('--pct', to + '%');
        });
    }

    function updateHud() {
        const hud = document.getElementById('olHud');
        const s = S();
        if (!hud || !s || !s.round) return;
        const me = NS.rooms.me();
        const opps = opponentsFor(s);
        const mult = s.round.hp_multiplier ? Number(s.round.hp_multiplier) : null;
        const sig = JSON.stringify([s.round.round_no, opps.map(o => [o.user_id, o.guess_count, o.ek_ipucu, o.finished, o.won]), me && me.total_score, NS.rooms.active().map(p => p.hp), s.room.tek_hak, s.room.kategori_gizli]);
        if (hud.dataset.sig !== sig) {
            hud.dataset.sig = sig;
            hud.innerHTML = `
                <div class="ol-hud-top">
                    <span class="ol-hud-round">${icon(T.targetIcon[s.room.target_type])}Tur ${s.round.round_no}/${s.room.round_count}</span>
                    <span class="ol-hud-timer" id="olHudTimer" role="timer" aria-label="Kalan süre">--:--</span>
                    <span class="ol-hud-score">${s.room.format === 'hp' ? (mult && mult !== 1 ? `Çarpan ×${mult}` : 'Can düellosu') : `${me ? me.total_score : 0} puan`}</span>
                    ${zorBadge('is-sm ol-hud-zor')}
                </div>
                ${s.room.format === 'hp' ? hpBars(s) : ''}
                ${opps.length && s.room.format !== 'hp' ? `<ul class="ol-hud-opps" aria-label="Rakipler">${opps.map(r => {
                    const p = NS.rooms.player(r.user_id) || {};
                    const st = statusBits(r);
                    const used = zor().tekHak ? cluesOf(r) : (r.stage_guess_count != null ? r.stage_guess_count : r.guess_count);
                    const dots = Array.from({ length: 6 }, (_, i) => `<i class="${i < used ? 'on' : ''}"></i>`).join('');
                    return `<li class="ol-opp ${st.cls}" aria-label="${esc(p.username)}: ${esc(st.text)}">${NS.avatar(p.avatar, { size: 28, framed: true })}<span class="ol-opp-body"><span class="ol-opp-name">${esc(p.username || '')}</span><span class="ol-opp-dots" aria-hidden="true">${r.finished ? icon(st.icon) : dots}</span></span></li>`;
                }).join('')}</ul>` : ''}
                ${s.room.format === 'hp' && opps[0] ? `<div class="ol-hud-oppline">${(() => { const st = statusBits(opps[0]); const p = NS.rooms.player(opps[0].user_id) || {}; return `<span class="ol-mini-st ${st.cls}">${icon(st.icon)}${esc(p.username)}: ${esc(st.text)}</span>`; })()}</div>` : ''}
                ${s.room.format === 'bracket' ? `<button class="btn btn-ghost btn-sm ol-hud-bracket" type="button" data-ol-m="bracket">${icon('bracket')}<span>Ağaç</span></button>` : ''}`;
            if (s.room.format === 'hp') animateHp(hud);
        }
        tickHud();
        updateWaitOthers();
    }
    function tickHud() {
        const el = document.getElementById('olHudTimer');
        const s = S();
        if (!el || !s || !s.round) return;
        const left = NS.clock.secUntil(s.round.deadline_at);
        el.textContent = NS.util.fmtClock(left);
        el.classList.toggle('is-warn', left <= 30 && left > 10);
        el.classList.toggle('is-danger', left <= 10);
        if (left <= 0) el.textContent = 'Süre doldu';
    }

    /** Maç ekranından tamamen çık: motoru eski haline getir. */
    function exit() {
        const gm = g();
        removeHud();
        removeOverrides();
        M.roundKey = null; M.finishedKey = null; M.prevHp = {};
        if (gm && M.saved) {
            gm.currentMode = M.saved.currentMode === 'online' ? 'practice' : M.saved.currentMode;
            if (gm.targetGameMode !== M.saved.targetGameMode) gm.setTargetGameMode(M.saved.targetGameMode, false);
            gm.isGameOver = true;
            if (gm.dom.diagnosisInput) gm.dom.diagnosisInput.disabled = false;
            if (gm.dom.btnSubmit) gm.dom.btnSubmit.disabled = false;
        }
        M.saved = null;
    }

    // ------------------------------------------------------------ katman görünümleri
    function playersById(s) { const m = {}; (s.players || []).forEach(p => { m[p.user_id] = p; }); return m; }

    function renderCountdown(root) {
        const s = S();
        if (!s || !s.round) return;
        const r = s.round, room = s.room;
        let extra = '';
        if (room.format === 'hp') { const m = Number(r.hp_multiplier || 1); extra = `<span class="ol-count-extra">${icon('heart')}Hasar çarpanı ×${m}</span>`; }
        if (room.format === 'battle') extra = `<span class="ol-count-extra">${icon('users')}${NS.rooms.active().filter(p => p.played && p.eliminated_round == null).length} oyuncu kaldı</span>`;
        let vs = '';
        if (room.format === 'bracket') {
            const pr = myPairing(s);
            if (pr) {
                const P = playersById(s);
                const a = P[pr.player_a], b = P[pr.player_b];
                vs = `<div class="ol-count-vs">${[a, b].map(p => p ? `<span class="ol-count-vs-p">${NS.avatar(p.avatar, { size: 64, framed: false, animated: true })}<span>${esc(p.username)}</span></span>` : '<span class="ol-count-vs-p">—</span>').join('<span class="ol-count-vs-x">VS</span>')}</div>`;
            } else extra = `<span class="ol-count-extra">${icon('eye')}İzliyorsun</span>`;
        }
        const roundLabel = room.format === 'bracket' ? bracketRoundName(r.round_no, room.round_count) : `Tur ${r.round_no}/${room.round_count}`;
        if (!root.querySelector('.ol-count-view') || root.dataset.round !== String(r.round_no)) {
            root.dataset.round = String(r.round_no);
            root.innerHTML = `<div class="ol-count-view"><div class="ol-count-card">
                <span class="ol-eyebrow">${esc(roundLabel)}</span>
                <span class="ol-count-num" id="olCountNum" aria-live="assertive">3</span>
                <span class="ol-count-sub">${icon(T.targetIcon[room.target_type])}${esc(T.target[room.target_type])} · ${esc(NS.roomTitle(room))}</span>
                ${zorBadge('ol-count-zor')}
                ${vs}${extra}
            </div></div>`;
        }
        const tick = () => {
            const el = document.getElementById('olCountNum');
            const st = S();
            if (!el || !st || !st.round) return;
            const n = Math.max(0, Math.ceil(NS.clock.secUntil(st.round.starts_at)));
            const txt = n > 0 ? String(n) : 'Başla';
            if (el.textContent !== txt) { el.textContent = txt; el.classList.remove('is-pop'); void el.offsetWidth; el.classList.add('is-pop'); }
        };
        tick();
        return setInterval(tick, 100);
    }

    function bracketRoundName(r, total) {
        const left = total - r;
        if (left === 0) return 'Final';
        if (left === 1) return 'Yarı final';
        if (left === 2) return 'Çeyrek final';
        return `Tur ${r}`;
    }

    function bracketRoundLoc(r, total) {
        const left = total - r;
        return left === 0 ? 'Finalde' : left === 1 ? 'Yarı finalde' : left === 2 ? 'Çeyrek finalde' : `${r}. turda`;
    }

    function resultRows(s) {
        const P = playersById(s);
        const rps = (s.round_players || []).slice().sort((a, b) => (b.points - a.points) || ((a.elapsed_sec || 9999) - (b.elapsed_sec || 9999)));
        const elim = new Set((s.round && s.round.eliminated_user_ids) || []);
        const me = myId();
        return `<ol class="ol-res-list">${rps.map((r, i) => {
            const p = P[r.user_id] || {};
            const res = r.won ? (zor().tekHak ? `${cluesOf(r)}. ipucunda` : `${r.guess_count}. tahminde`) : (T.finish[r.finish_reason] || '—');
            return `<li class="ol-res-row${r.user_id === me ? ' is-me' : ''}${elim.has(r.user_id) ? ' is-out' : ''}${r.won ? ' is-won' : ''}">
                <span class="ol-res-pos">${i + 1}</span>
                ${NS.avatar(p.avatar, { size: 36, framed: true })}
                <span class="ol-res-main"><span class="ol-res-name">${esc(p.username || '')}${r.user_id === me ? ' <span class="ol-me-tag">sen</span>' : ''}${elim.has(r.user_id) ? ' <span class="ol-out-tag">Elendi</span>' : ''}</span>
                    <span class="ol-res-sub">${icon(r.won ? 'check' : r.finish_reason === 'absent' ? 'wifi-off' : 'x')}${esc(res)}${r.elapsed_sec != null && r.won ? ` · ${r.elapsed_sec} sn` : ''}</span></span>
                <span class="ol-res-pts">${r.points ? '+' + r.points : '0'}</span>
                <span class="ol-res-total">${s.room.format === 'hp' ? `${r.hp_after != null ? r.hp_after : (p.hp != null ? p.hp : '')} can` : `${p.total_score || 0}`}</span>
            </li>`;
        }).join('')}</ol>`;
    }

    /**
     * Tur sonucu: "Neden bu tanı?" açıklaması (js/explain.js). Yalnızca sunucu turu kapattıktan sonra
     * (bu görünüm zaten round_result / closed_at'te açılır) ve tanının bu kipte açıklandığı hedeflerde
     * (tanı, kombo). Terapi/ilaç turunda sonuç ekranı tanıyı göstermediği için açıklama da gösterilmez.
     * Maç içinde kütüphane bağlantısı yok (maçtan çıkarır).
     */
    function roundExplain(s) {
        const X = global.PsikoVakaExplain;
        if (!X || !s.round || !(s.room.status === 'round_result' || s.round.closed_at)) return '';
        if (!['diagnosis', 'combo'].includes(s.room.target_type)) return '';
        const c = findCase(s.round.case_id);
        if (!c || !X.has(c)) return '';
        const wrong = (s.my_guesses || []).filter(x => !x.is_correct && (s.room.target_type === 'diagnosis' || x.stage === 1)).map(x => x.item_id);
        const gm = g();
        const desktop = gm && gm.libIsDesktop ? gm.libIsDesktop() : false;
        return `<div class="ol-explain">${X.render(c, { wrongIds: wrong, links: false, collapsed: !desktop, idPrefix: 'oxp' })}</div>`;
    }

    function renderResult(root) {
        const s = S();
        if (!s || !s.round) return null;
        const room = s.room, r = s.round;
        const ans = roundAnswer();
        const me = myId();
        const rpMe = (s.round_players || []).find(x => x.user_id === me);
        let hp = '';
        if (room.format === 'hp') {
            const prev = {}, dmg = {};
            (s.round_players || []).forEach(x => { if (x.hp_after != null) { prev[x.user_id] = x.hp_after + (x.hp_damage || 0); dmg[x.user_id] = x.hp_damage || 0; } });
            hp = `<div class="ol-res-hp">${hpBars(s, { big: true, prev, dmg, mult: Number(r.hp_multiplier || 1) })}
                <p class="ol-muted ol-center">${Object.values(dmg).some(Boolean) ? 'Düşük puanlı taraf farkın ' + Number(r.hp_multiplier || 1) + ' katı can kaybetti.' : 'Eşit puan: kimse can kaybetmedi.'}</p></div>`;
        }
        let elimNote = '';
        if (room.format === 'battle' && r.eliminated_user_ids && r.eliminated_user_ids.length) {
            const p = NS.rooms.player(r.eliminated_user_ids[0]);
            elimNote = `<div class="ol-elim-note${r.eliminated_user_ids[0] === me ? ' is-me' : ''}">${icon('flag')}<span>${r.eliminated_user_ids[0] === me ? 'Elendin. Maçı izlemeye devam edebilirsin.' : `${esc(p ? p.username : '')} elendi.`}</span></div>`;
        }
        const title = room.format === 'bracket' ? `${bracketRoundName(r.round_no, room.round_count)} sonucu` : `Tur ${r.round_no} sonucu`;
        root.innerHTML = `<div class="ol-view ol-result-view">
            ${topbar(title)}
            <div class="ol-view-body">
                <div class="ol-answer-card">
                    <span class="ol-eyebrow">Doğru cevap</span>
                    <span class="ol-answer-text">${ans ? esc(answerText(ans, room.target_type)) : 'Bu vaka bu sürümde yok (sunucu cevap anahtarı güncel değil).'}</span>
                    ${rpMe ? `<span class="ol-answer-me ${rpMe.won ? 'is-win' : 'is-loss'}">${icon(rpMe.won ? 'check' : 'x')}${rpMe.won ? `Sen: +${rpMe.points} puan` : `Sen: ${esc(T.finish[rpMe.finish_reason] || 'puan yok')}`}</span>` : `<span class="ol-answer-me">${icon('eye')}İzliyorsun</span>`}
                </div>
                ${hp}
                ${elimNote}
                ${roundExplain(s)}
                ${room.format === 'bracket' ? `<div class="ol-bracket-wrap">${bracketHtml(s)}</div>` : resultRows(s)}
                ${room.format === 'bracket' ? `<details class="ol-details"><summary>Bu turun puanları</summary>${resultRows(s)}</details>` : ''}
            </div>
            <div class="ol-view-foot"><p class="ol-next-line" id="olNextLine" aria-live="polite"></p></div>
        </div>`;
        if (room.format === 'hp') animateHp(root);
        const tick = () => {
            const el = document.getElementById('olNextLine');
            const st = S();
            if (!el || !st) return;
            if (st.room.status === 'round_result' && st.room.next_round_at) {
                const n = Math.max(0, Math.ceil(NS.clock.secUntil(st.room.next_round_at)));
                el.innerHTML = `${icon('clock')}<span>${n > 0 ? `Sonraki tur ${n} sn içinde` : 'Sonraki tur başlıyor…'}</span>`;
            } else el.innerHTML = `${icon('hourglass')}<span>Sonuçlar hesaplanıyor…</span>`;
        };
        tick();
        return setInterval(tick, 250);
    }

    function renderSpectate(root, why) {
        const s = S();
        if (!s) return null;
        const room = s.room;
        const isBracket = room.format === 'bracket';
        const mePlayed = NS.rooms.me();
        const elim = mePlayed && mePlayed.eliminated_round != null;
        const head = why === 'pairing'
            ? `<div class="ol-spec-banner">${icon('hourglass')}<span>Eşleşmen bitti. Diğer eşleşmeler sürüyor.</span></div>`
            : elim ? `<div class="ol-spec-banner is-out">${icon('eye')}<span>Elendin. Maçı izliyorsun.</span></div>`
                : `<div class="ol-spec-banner">${icon('eye')}<span>Bu turda oynamıyorsun. Maçı izliyorsun.</span></div>`;
        const live = (s.round_players || []).map(r => {
            const p = NS.rooms.player(r.user_id) || {};
            const st = statusBits(r);
            return `<li class="ol-mini ${st.cls}">${NS.avatar(p.avatar, { size: 32, framed: true })}<span class="ol-mini-name">${esc(p.username)}</span><span class="ol-mini-st">${icon(st.icon)}${esc(st.text)}</span><span class="ol-mini-total">${p.total_score || 0}</span></li>`;
        }).join('');
        root.innerHTML = `<div class="ol-view ol-spec-view">
            ${topbar(s.round ? (isBracket ? bracketRoundName(s.round.round_no, room.round_count) : `Tur ${s.round.round_no}/${room.round_count}`) : NS.roomTitle(room), true)}
            <div class="ol-view-body">
                ${head}
                ${isBracket ? `<div class="ol-bracket-wrap">${bracketHtml(s)}</div>` : `<h2 class="ol-h3">Canlı durum</h2><ul class="ol-mini-list is-large">${live}</ul>`}
            </div>
        </div>`;
        const tick = () => { const el = document.getElementById('olSpecTimer'); const st = S(); if (el && st && st.round) el.textContent = NS.util.fmtClock(NS.clock.secUntil(st.round.deadline_at)); };
        tick();
        return setInterval(tick, 250);
    }

    function topbar(title, timer) {
        const s = S();
        return `<header class="ol-topbar">
            <button class="icon-btn" type="button" data-ol-v="leave" aria-label="Maçtan ayrıl">${icon('arrow-left')}</button>
            <div class="ol-topbar-main"><h1 class="ol-topbar-title">${esc(title)}</h1><div class="ol-topbar-chips"><span class="ol-chip-static">${esc(NS.roomTitle(s.room))}</span><span class="ol-chip-static ol-t-${esc(s.room.target_type)}">${icon(T.targetIcon[s.room.target_type])}${esc(T.target[s.room.target_type])}</span>${zorBadge()}</div></div>
            ${timer ? `<span class="ol-hud-timer" id="olSpecTimer" role="timer">--:--</span>` : ''}
        </header>`;
    }

    // ------------------------------------------------------------ eşleşme ağacı
    function bracketHtml(s) {
        const room = s.room;
        const P = playersById(s);
        const total = room.round_count;
        const cap = room.capacity;
        const me = myId();
        const live = {}; (s.round_players || []).forEach(r => { live[r.user_id] = r; });
        const cols = [];
        for (let r = 1; r <= total; r++) {
            const n = cap / Math.pow(2, r);
            const cells = [];
            for (let slot = 0; slot < n; slot++) {
                const pr = (s.pairings || []).find(x => x.bracket_round === r && x.slot === slot);
                const cur = r === room.current_round && room.status === 'in_round';
                const side = (uid, seed) => {
                    if (!uid) return `<div class="ol-br-p is-tbd"><span class="ol-br-name">Bekleniyor</span></div>`;
                    const p = P[uid] || {};
                    const won = pr && pr.winner_id === uid, lost = pr && pr.winner_id && pr.winner_id !== uid;
                    const lr = cur ? live[uid] : null;
                    const st = lr ? (lr.finished ? (lr.won ? `+${lr.points}` : '0') : `${lr.guess_count}…`) : '';
                    return `<div class="ol-br-p${won ? ' is-win' : ''}${lost ? ' is-lose' : ''}${uid === me ? ' is-me' : ''}">
                        ${NS.avatar(p.avatar, { size: 24, framed: true })}<span class="ol-br-name">${esc(p.username || '')}</span>
                        ${seed ? `<span class="ol-br-seed">${seed}</span>` : ''}<span class="ol-br-st">${esc(st)}${won ? icon('check') : ''}</span></div>`;
                };
                cells.push(`<div class="ol-br-match${pr && pr.winner_id ? ' is-done' : ''}${cur && pr && !pr.winner_id ? ' is-live' : ''}" aria-label="${bracketRoundName(r, total)} eşleşme ${slot + 1}">
                    ${side(pr && pr.player_a, pr && pr.seed_a)}${side(pr && pr.player_b, pr && pr.seed_b)}
                    ${pr && pr.decided_reason === 'forfeit' ? '<span class="ol-br-note">Hükmen galibiyet</span>' : ''}</div>`);
            }
            cols.push(`<div class="ol-br-col"><span class="ol-br-head">${bracketRoundName(r, total)}</span><div class="ol-br-cells">${cells.join('')}</div></div>`);
        }
        const champ = (s.pairings || []).find(x => x.bracket_round === total && x.winner_id);
        cols.push(`<div class="ol-br-col ol-br-champ"><span class="ol-br-head">Şampiyon</span><div class="ol-br-cells"><div class="ol-br-trophy">${champ ? NS.avatar((P[champ.winner_id] || {}).avatar, { size: 56, framed: false, animated: true, emote: 'cheer' }) + `<span>${esc((P[champ.winner_id] || {}).username || '')}</span>` : icon('trophy')}</div></div></div>`);
        return `<div class="ol-bracket" data-cap="${cap}">${cols.join('')}</div>`;
    }
    function openBracketSheet() {
        const s = S(); if (!s) return;
        const sh = NS.ui.sheet({ title: 'Eşleşme ağacı', wide: true, body: `<div class="ol-bracket-wrap">${bracketHtml(s)}</div>` });
        const off = NS.rooms.bus.on('state', () => { if (sh.closed) { off(); return; } const st = S(); if (st) sh.body.innerHTML = `<div class="ol-bracket-wrap">${bracketHtml(st)}</div>`; });
    }

    // ------------------------------------------------------------ final
    function renderFinal(root) {
        const s = S();
        if (!s) return null;
        const room = s.room;
        const P = playersById(s);
        const me = myId();
        const res = (s.results || []).slice().sort((a, b) => a.final_rank - b.final_rank);
        const mine = res.find(x => x.user_id === me);
        const pod = res.slice(0, 3);
        const order = pod.length >= 3 ? [pod[1], pod[0], pod[2]] : pod.length === 2 ? [pod[1], pod[0]] : pod;
        const metric = (x) => room.format === 'hp' ? `${x.final_hp != null ? x.final_hp : 0} can` : (room.format === 'battle' || room.format === 'bracket') && x.final_rank > 1 && x.eliminated_round ? `${x.total_score} puan` : `${x.total_score} puan`;
        // 0004 sonrası: rakipler erken ayrıldıysa kalanlar tur RP'sini alır, yalnızca galibiyet primi verilmez (rp_breakdown.erken_bitis). Eski sunucu: toplam 0 → eski metin.
        const earlyEnd = !!(mine && mine.rp_breakdown && mine.rp_breakdown.erken_bitis === true);
        const noRp = !earlyEnd && room.ended_early && res.length && res.every(x => x.rp_delta === 0);
        const L = global.PsikoVakaLeagues;
        let league = '';
        if (mine && mine.rp_after != null && L) {
            const t = L.tierFor(mine.rp_after);
            league = `<a class="ol-league-line" href="#/ligler" data-ol-v="leagues" aria-label="Lig bilgisi">${L.badge(mine.rp_after, 40)}<span class="ol-league-text"><span class="ol-league-name">${esc(t.name)} · ${mine.rp_after} Elo</span><span class="ol-league-sub">${esc(L.progressText(mine.rp_after))}</span></span>
                <span class="ol-league-bar"><i data-pct="${t.pct}"></i></span></a>`;
            // Lig değişimi (kademe sınırı aşıldıysa): önceki RP ≈ rp_after − rp_delta (0 tabanı yüzünden yaklaşık; sınırlar 0'dan uzak)
            const prev = Math.max(0, mine.rp_after - (Number(mine.rp_delta) || 0));
            const pt = L.tierFor(prev);
            if (pt.id !== t.id) {
                const up = L.TIERS.findIndex(x => x.id === t.id) > L.TIERS.findIndex(x => x.id === pt.id);
                league = `<div class="ol-league-change ${up ? 'is-up' : 'is-down'}" role="status">
                    <span class="ol-lc-badges">${L.badge(prev, 36)}${icon('arrow-right')}<span class="ol-lc-new">${L.badge(mine.rp_after, 56)}</span></span>
                    <span class="ol-lc-text"><span class="ol-lc-title">${up ? 'Yeni lig' : 'Lig düştü'}: ${esc(t.name)}</span><span class="ol-lc-sub">${esc(pt.name)} → ${esc(t.name)}</span></span></div>` + league;
            }
        }
        const bdHtml = mine ? rpBreakdownHtml(mine) : '';
        root.innerHTML = `<div class="ol-view ol-final-view">
            <header class="ol-topbar"><button class="icon-btn" type="button" data-ol-v="exit" aria-label="Çık">${icon('x')}</button>
                <div class="ol-topbar-main"><h1 class="ol-topbar-title">Maç bitti</h1><div class="ol-topbar-chips"><span class="ol-chip-static">${esc(NS.roomTitle(room))}</span>${zorBadge()}</div></div></header>
            <div class="ol-view-body">
                ${res.length ? `<div class="ol-podium" data-n="${pod.length}">${order.map(x => {
                    const p = P[x.user_id] || {};
                    const em = x.final_rank === 1 ? 'cheer' : x.final_rank === 2 ? 'laugh' : 'wave';
                    return `<div class="ol-pod ol-pod-${x.final_rank}${x.user_id === me ? ' is-me' : ''}">
                        <div class="ol-pod-fig">${NS.avatar(p.avatar, { size: x.final_rank === 1 ? 112 : 84, framed: false, animated: true, emote: em, title: p.username })}</div>
                        <span class="ol-pod-name">${x.final_rank === 1 ? icon('crown') : ''}${esc(p.username || '')}</span>
                        <span class="ol-pod-metric">${esc(metric(x))}</span>
                        <div class="ol-pod-block"><span>${x.final_rank}</span></div>
                    </div>`;
                }).join('')}</div>` : `<div class="ol-empty">${icon('hourglass')}<span>Sonuçlar yükleniyor…</span></div>`}
                ${earlyEnd ? `<div class="notice">${icon('info')}<span>Rakip erken ayrıldı: galibiyet primi verilmedi.</span></div>` : ''}
                ${noRp ? `<div class="notice">${icon('info')}<span>Maç erken bittiği için Elo verilmedi (turların yarısı oynanmadı).</span></div>` : ''}
                ${mine && mine.left_early ? `<div class="notice">${icon('info')}<span>${Number(mine.rp_delta) < 0 ? 'Maçtan erken ayrıldın: kalan turlar çözülemedi sayıldı.' : 'Maçtan erken ayrıldığın için Elo almadın.'}</span></div>` : ''}
                ${league}
                ${bdHtml}
                <ol class="ol-res-list">${res.map(x => {
                    const p = P[x.user_id] || {};
                    return `<li class="ol-res-row${x.user_id === me ? ' is-me' : ''}">
                        <span class="ol-res-pos">${x.final_rank}</span>${NS.avatar(p.avatar, { size: 36, framed: true })}
                        <span class="ol-res-main"><span class="ol-res-name">${esc(p.username || '')}${x.user_id === me ? ' <span class="ol-me-tag">sen</span>' : ''}${x.left_early ? ' <span class="ol-out-tag">Ayrıldı</span>' : ''}</span>
                        <span class="ol-res-sub">${esc(metric(x))}${x.eliminated_round ? ` · ${room.format === 'bracket' ? bracketRoundLoc(x.eliminated_round, room.round_count) : x.eliminated_round + '. turda'} elendi` : ''}</span></span>
                        <span class="ol-res-rp${x.rp_delta > 0 ? ' is-plus' : x.rp_delta < 0 ? ' is-minus' : ''}">${x.rp_delta > 0 ? '+' : x.rp_delta < 0 ? '−' : ''}${Math.abs(x.rp_delta)} Elo</span>
                    </li>`;
                }).join('')}</ol>
                <div class="ol-rematch" id="olRematch"></div>
            </div>
            <div class="ol-view-foot ol-row-btns">
                <button class="btn btn-secondary btn-lg" type="button" data-ol-v="exit">Çık</button>
                ${room.is_quick ? `<button class="btn btn-primary btn-lg" type="button" data-ol-v="quick-again">${icon('zap')}<span>Tekrar eşleş</span></button>` : `<button class="btn btn-primary btn-lg" type="button" data-ol-v="rematch">${icon('refresh')}<span>Lobiye dön</span></button>`}
            </div>
        </div>`;
        root.querySelectorAll('.ol-league-bar i').forEach(i => i.style.setProperty('--pct', (i.dataset.pct || 0) + '%'));
        if (NS.app.pendingRematch) showRematchOffer(NS.app.pendingRematch);
        if (mine && mine.final_rank === 1 && !M.confetti && g() && g().launchConfetti && !NS.util.reducedMotion()) { M.confetti = room.id; g().launchConfetti(); }
        NS.announce(mine ? `Maç bitti. ${mine.final_rank}. oldun. ${mine.rp_delta ? (mine.rp_delta > 0 ? 'artı ' : 'eksi ') + Math.abs(mine.rp_delta) + ' Elo' : ''}` : 'Maç bitti.');
        return null;
    }
    /** RP v2 dökümü (match_results.rp_breakdown, §13.4). Alan yoksa (eski sunucu) hiçbir şey çizilmez. */
    const RP_OUT = { g1: '1. tahminde çözdün', g2: '2. tahminde çözdün', g3: '3. tahminde çözdün', g4: '4. tahminde çözdün', g5: '5. tahminde çözdün', g6: '6. tahminde çözdün', fail: 'Çözemedin', void: 'Yarıda kaldı' };
    function rpBreakdownHtml(x) {
        const bd = x.rp_breakdown;
        if (!bd || typeof bd !== 'object' || !Array.isArray(bd.rounds)) return '';
        const sg = (n) => (n > 0 ? '+' + n : n < 0 ? '−' + Math.abs(n) : '0');
        const cls = (n) => (n > 0 ? 'is-plus' : n < 0 ? 'is-minus' : '');
        const total = Number(x.rp_delta) || 0;
        const place = Number(bd.placement) || 0;
        const mult = Number(bd.zorluk_carpani) || 1;
        const tek = !!(bd.zorluk && bd.zorluk.tek_hak);
        const Z = Zm();
        const outTxt = (r) => { const m = /^g([1-6])$/.exec(r.outcome || ''); return m && tek ? `Tek hakla, ${m[1]}. ipucunda çözdün` : (RP_OUT[r.outcome] || r.outcome || ''); };
        const baseTxt = (r) => (r.base != null && Number(r.base) !== Number(r.delta) ? ` <span class="ol-rpbd-base">(${sg(Number(r.base))} ${esc(Z ? Z.fmtMult(mult) : '×' + mult)})</span>` : '');
        return `<details class="ol-rpbd">
            <summary class="ol-rpbd-sum"><span>Bu maçın Elo dökümü</span><span class="ol-rpbd-total ${cls(total)}">${sg(total)} Elo</span></summary>
            <ul class="ol-rpbd-list">${bd.rounds.map(r => { const d = Number(r.delta) || 0; return `<li><span class="ol-rpbd-r">Tur ${esc(r.round)}</span><span class="ol-rpbd-o">${esc(r.missed ? 'Oynanmadı (ayrıldın)' : outTxt(r))}${r.missed ? '' : baseTxt(r)}</span><span class="ol-rpbd-d ${cls(d)}">${sg(d)}</span></li>`; }).join('')}
                ${place ? `<li class="ol-rpbd-place"><span class="ol-rpbd-r">Sıralama primi</span><span class="ol-rpbd-o"></span><span class="ol-rpbd-d is-plus">${sg(place)}</span></li>` : ''}
            </ul>
            ${mult > 1 && Z ? `<p class="ol-rpbd-zor">${Z.badge(bd.zorluk, { cls: 'is-sm' })}<span>Zorluk bonusu ${esc(Z.fmtMult(mult))}: turlarda kazandığın Elo ${esc(Z.fmtMult(mult))} sayıldı (−10 ve sıralama primi aynı).</span></p>` : ''}
            ${bd.voided ? `<p class="ol-muted ol-small">Maç erken bittiği için bu maç geçersiz sayıldı.</p>` : ''}
            ${x.rp_after === 0 && total < 0 ? `<p class="ol-muted ol-small">Elo 0'ın altına inmez.</p>` : ''}
        </details>`;
    }

    function showRematchOffer(offer) {
        const box = document.getElementById('olRematch');
        if (!box || !offer) return;
        box.innerHTML = `<div class="ol-rematch-card">${NS.avatar(offer.avatar, { size: 40, framed: true, animated: true, emote: 'wave' })}
            <span><strong>${esc(offer.username)}</strong> yeni oda kurdu (${esc(offer.code)}).</span>
            <button class="btn btn-primary btn-sm" type="button" data-ol-v="join-rematch">Katıl</button></div>`;
    }

    NS.match = {
        enterRound, exit, updateHud, finishLocal, renderCountdown, renderResult, renderSpectate, renderFinal, showRematchOffer,
        bracketHtml, openBracketSheet, myPairingDone, removeWaitPanel, findCase,
        get keyIssues() { return M.keyIssues.slice(); },
        isMissingCase() { const s = S(); return !!(s && s.round && M.missingKey === s.room.id + ':' + s.round.round_no); },
        get active() { return M.overrides; }
    };
})(typeof window !== 'undefined' ? window : globalThis);
