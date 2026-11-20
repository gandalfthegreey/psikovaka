/**
 * PsikoVaka — Günün vakası: sunucu sıralaması ve seriler (TASARIM.md §13.1, migration 0003).
 *
 * Özellik algılama: get_daily_challenge(p_target) yanıt verirse özellik açık sayılır (misafir de çağırabilir).
 * Fonksiyon yoksa (PGRST202) ya da sunucuya ulaşılamazsa (file://, çevrimdışı) her şey bugünkü gibi yerel kalır.
 *
 *  - Üye (giriş + kullanıcı adı) + özellik açık: vaka daily_begin'den; her tahmin daily_submit_guess'e gider ve karar
 *    SUNUCUNUNDUR (yerel motor yalnızca ipucu/öneri/görünüm). Hedef başına günde bir oyun: bitince kart sonucu ve
 *    "Sıralamayı gör"ü gösterir. Günlük oyun RP vermez (RP gösterilmez).
 *  - Misafir + özellik açık: get_daily_challenge'ın case_id'siyle yerel oyun (üyelerle aynı vaka); hata olursa yerel seçim.
 *  - Seri: get_my_streaks() (kart, Profil, kazanınca rapor). Özellik kapalıysa gizli ("0" gösterilmez).
 *  - Sıralama ekranı: #/gunluk (index.html #screenDaily, #dailyMount).
 */
(function (global) {
    'use strict';
    const NS = global.PsikoVakaOnline;
    const { esc, icon } = NS.util;
    const T = NS.T;
    const TARGETS = ['diagnosis', 'therapy', 'pharmacology', 'combo'];

    const D = {
        avail: null,           // null bilinmiyor | true | false
        ch: {},                // hedef -> daily_state (get_daily_challenge / daily_begin / bitiş)
        chAt: {},
        streaks: null,         // [{target,current_streak,best_streak,last_day,played_today}] | null
        streaksAt: 0,
        active: null,          // { target, caseId, day } sunucu günlüğü oynanıyor
        busy: false,
        board: { target: null, day: 'today', friends: false, data: null, error: null, loading: false, timer: null, reqSeq: 0 }
    };

    const g = () => NS.game();
    function acc() { return global.PsikoVakaAccount || null; }
    function member() { const a = acc(); return !!(a && a.availability === 'ready' && a.state === 'ready' && NS.api.client()); }
    function canReach() { const a = acc(); return !!(location.protocol !== 'file:' && a && a.availability === 'ready' && NS.api.client()); }
    /** Hesap durumu henüz netleşmedi: hizmet yükleniyor ya da oturum var ama profil yükleniyor (geçici 'guest'). */
    function accSettling() {
        const a = acc();
        if (!a || D.settleGaveUp) return false;
        if (a.availability === 'pending') return true;
        try { const s = a.snapshot ? a.snapshot() : null; if (s && s.user && a.state === 'guest') return true; } catch (e) { /* yok */ }
        return false;
    }
    function waitSettled(ms) {
        return new Promise(res => {
            if (!accSettling()) return res();
            const t0 = Date.now();
            const iv = setInterval(() => {
                if (!accSettling()) { clearInterval(iv); res(); return; }
                if (Date.now() - t0 > (ms || 12000)) { D.settleGaveUp = true; clearInterval(iv); res(); } // hesap hizmeti yanıt vermiyor: misafir gibi devam
            }, 100);
        });
    }
    function curTarget() { const gm = g(); return (gm && gm.targetGameMode) || 'diagnosis'; }
    function findCase(id) { const gm = g(); return gm ? (gm.allMasterCases || gm.cases || []).find(c => c.id === id) || null : null; }
    const fmtTime = (s) => (s == null ? '' : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`);

    // ------------------------------------------------------------ veri
    async function loadChallenge(target, force) {
        // Ulaşılamıyor (hesap hizmeti yükleniyor, file://, çevrimdışı): özellik durumunu DEĞİŞTİRME. Eskiden burada
        // D.avail=false yazılıyordu ve hesap değişiminde de false korunuyordu: açılışta erken çağrılırsa üye o sayfa
        // boyunca yerel günlüğe düşüyor, bitirdiği günü yeniden oynayabiliyordu (B3).
        if (!canReach()) return null;
        if (D.avail === false) return null;
        const fresh = D.ch[target] && Date.now() - (D.chAt[target] || 0) < 60000;
        if (fresh && !force) return D.ch[target];
        const r = await NS.api.getDailyChallenge(target);
        if (r.ok) { D.avail = true; D.ch[target] = r.data; D.chAt[target] = Date.now(); return r.data; }
        if (r.error.code === 'UNSUPPORTED') D.avail = false;
        return null;
    }
    async function loadStreaks(force) {
        if (!member() || D.avail !== true) { D.streaks = null; return null; }
        if (D.streaks && !force && Date.now() - D.streaksAt < 60000) return D.streaks;
        const r = await NS.api.getMyStreaks();
        if (r.ok && Array.isArray(r.data)) { D.streaks = r.data; D.streaksAt = Date.now(); }
        return D.streaks;
    }
    function streakFor(target) { return D.streaks ? D.streaks.find(x => x.target === target) || null : null; }

    // ------------------------------------------------------------ tek yetki: bugünün günlüğü (hedef) bitti mi?
    /** Yerel kaydın günü: sunucunun bildirdiği gün (biliniyorsa) ya da İstanbul günü. */
    function localDay(target) { const st = D.ch[target]; const gm = g(); return (st && st.day) || (gm && gm.getDailyDay ? gm.getDailyDay() : null); }
    function localRecord(target) { const gm = g(); return gm && gm.getDailyRecord ? gm.getDailyRecord(target, localDay(target)) : null; }
    /**
     * { finished, src: 'server'|'local', st (sunucu durumu|null), rec (yerel kayıt|null), serverOk }
     * Üye + özellik açık: sunucu otoritedir; yerel kayıt yalnızca sunucuya ulaşılamazsa yedek. Misafir / özellik yok: yerel kayıt.
     * Hesap durumu netleşmeden karar verilmez (açılıştaki geçici 'guest' durumu üyeyi misafir saymasın).
     */
    async function status(target, force) {
        target = target || curTarget();
        await waitSettled();
        if (member() && D.avail !== false) {
            const st = await loadChallenge(target, force);
            if (st) {
                const fin = st.status === 'finished';
                return { finished: fin, src: 'server', st, rec: fin ? localRecord(target) : null, serverOk: true };
            }
            if (D.avail !== false) { const rec = localRecord(target); return { finished: !!rec, src: 'local', st: null, rec, serverOk: false }; }
        }
        if (canReach() && D.avail !== false && !D.ch[target]) await loadChallenge(target, force);
        const rec = localRecord(target);
        return { finished: !!rec, src: 'local', st: D.ch[target] || null, rec, serverOk: !!D.ch[target] };
    }
    /** Eşzamanlı sürüm (kart çizimi): elde olan bilgiyle. */
    function statusNow(target, st) {
        if (member() && D.avail !== false && st) return { finished: st.status === 'finished', src: 'server', st, rec: null };
        const rec = localRecord(target);
        return { finished: !!rec, src: 'local', st: st || null, rec };
    }

    // ------------------------------------------------------------ ana sayfa kartı
    function $(id) { return document.getElementById(id); }
    let cardSeq = 0;
    async function refreshCard(force) {
        const seq = ++cardSeq;
        const target = curTarget();
        if (accSettling()) { renderCard(target, null); await waitSettled(); if (seq !== cardSeq) return; }
        const st = await loadChallenge(target, force);
        if (member()) await loadStreaks(force);
        if (seq !== cardSeq) return;
        renderCard(target, st);
    }
    function renderCard(target, st) {
        const btn = $('btnStartDaily'), lbl = $('btnStartDailyLabel'), board = $('btnDailyBoard');
        const box = $('dailyResultBox'), chip = $('dailyStreakChip'), text = $('dailyCardText');
        if (!btn) return;
        // Dosyadaki danışan özeti: bu okumanın vakası (ek istek yok); sunucu yoksa yerel günün vakası (ajan R3)
        const gmT = g();
        if (gmT && gmT.setDailyTeaser) gmT.setDailyTeaser((st && st.case_id && findCase(st.case_id)) || (gmT.getLocalDailyCase ? gmT.getLocalDailyCase() : null));
        const on = D.avail === true;
        board.hidden = !on;
        // seri
        const sk = on && member() ? streakFor(target) : null;
        if (sk && sk.current_streak > 0) { chip.hidden = false; $('dailyStreakText').textContent = `${sk.current_streak} günlük seri`; }
        else chip.hidden = true;
        const settling = accSettling();
        const S = settling ? { finished: false } : statusNow(target, st);
        const finished = !!S.finished;
        bindResultBox(box);
        box.hidden = !finished;
        btn.hidden = !!finished;
        btn.disabled = settling; // hesap netleşmeden başlatılmaz (üye misafir sanılmasın)
        board.classList.toggle('btn-primary', !!finished);
        board.classList.toggle('btn-secondary', !finished);
        if (finished) {
            const srv = S.src === 'server' ? S.st : null, rec = S.rec;
            const won = srv ? !!srv.won : !!(rec && rec.won);
            box.className = 'daily-result is-tappable ' + (won ? 'is-win' : 'is-loss');
            $('dailyResultIcon').innerHTML = icon(won ? 'check' : 'flag');
            $('dailyResultTitle').textContent = won ? `${srv ? srv.guesses_used : rec.guessesUsed}. tahminde bildin` : 'Bugün olmadı';
            const tail = 'Yarın yeni vaka · Vakayı gör';
            $('dailyResultSub').textContent = won ? (srv ? `${srv.points} puan · ${fmtTime(srv.time_sec)} · ${tail}` : `${fmtTime(rec.elapsed)} · ${tail}`) : `Yarın yeni vaka seni bekliyor · Vakayı gör`;
            text.textContent = on
                ? `Bugünün ${T.target[target].toLocaleLowerCase('tr')} vakasını bitirdin. Sıralamada nerede olduğuna bak.`
                : `Bugünün ${T.target[target].toLocaleLowerCase('tr')} vakasını bitirdin. Yarın yeni vaka var.`;
        } else {
            text.textContent = 'Bugün herkes aynı vakayı çözüyor. İlk ipucuyla başla, yanlış tahminde yeni ipucu açılır.';
            lbl.textContent = on && member() && st && st.status === 'in_progress' ? 'Devam et' : 'Başla';
        }
    }
    /** Bitmiş günün sonuç kutusu: dokununca vaka salt okunur açılır. */
    function bindResultBox(box) {
        if (!box || box._b3) return;
        box._b3 = true;
        box.setAttribute('role', 'button');
        box.tabIndex = 0;
        box.setAttribute('aria-label', 'Bugünkü sonucu ve vakayı gör');
        box.classList.add('is-tappable'); // imleç/odak/üzerine gelme: css/anasayfa.css (satır içi stil yok; ajan R3)
        const go = () => { const gm = g(); if (gm) gm.setMode('daily'); };
        box.addEventListener('click', go);
        box.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    }

    // ------------------------------------------------------------ oyun: başlatma
    /** game.loadDailyCase yerine (setMode('daily') çağırır). */
    /** Yerel bitmiş kaydı salt okunur açar. */
    function openLocalFinished(rec) {
        const gm = g();
        D.active = null;
        return gm.openFinishedDaily(findCase(rec.caseId), rec);
    }
    /** Sunucuda bitmiş denemeyi salt okunur açar (daily_begin'in tahminleri + sonucu). Yeni tahmin gönderilmez. */
    function openServerFinished(target, st) {
        const gm = g();
        const c = findCase(st.case_id);
        if (!c) { gm.showToast('Günün vakası bu sürümde yok. Sayfayı yenile.'); return false; }
        D.active = { target, caseId: c.id, day: st.day };
        installOverrides();
        const rec = { day: st.day, target, caseId: c.id, src: 'server', userId: NS.api.myId(), won: !!st.won, elapsed: st.time_sec || 0 };
        const ok = gm.openFinishedDaily(c, rec, {
            fill: () => { restore(st); },
            title: st.won ? `${st.guesses_used}. tahminde bildin · ${st.points} puan` : null
        });
        if (ok && gm.saveDailyRecord) gm.saveDailyRecord(gm.snapshotDailyRecord(!!st.won)); // sunucuya ulaşılamazsa yedek
        if (ok) gm.updateDailyRecord(target, st.day, { points: st.points, time_sec: st.time_sec, guessesUsed: st.guesses_used, src: 'server' });
        return ok;
    }

    async function loadDaily(orig) {
        const gm = g();
        const target = gm.targetGameMode || 'diagnosis';
        if (D.busy) return;
        D.busy = true;
        const btn = $('btnStartDaily'); if (btn) { btn.disabled = true; btn.classList.add('is-loading'); }
        let S;
        try { S = await status(target, true); } finally { D.busy = false; if (btn) { btn.disabled = false; btn.classList.remove('is-loading'); } }
        if (gm.targetGameMode !== target) return; // beklerken hedef değişti
        // Misafir / özellik kapalı / ulaşılamıyor: yerel kayıt tek kaynak (misafirde mümkünse sunucunun case_id'si)
        if (!(member() && D.avail !== false && S.serverOk)) {
            if (member() && D.avail !== false && !S.serverOk && !S.finished) { gm.showToast('Sunucuya ulaşılamadı. Biraz sonra yeniden dene.'); return; }
            if (S.finished && S.rec && openLocalFinished(S.rec)) { renderCard(target, S.st); return; }
            const st = S.st;
            const c = st && findCase(st.case_id);
            if (c) { D.active = null; gm.startDailyCase(c, { day: st.day, target, src: 'local' }); return; }
            return orig();
        }
        D.busy = true;
        if (btn) { btn.disabled = true; btn.classList.add('is-loading'); }
        const r = await NS.api.dailyBegin(target);
        if (btn) { btn.disabled = false; btn.classList.remove('is-loading'); }
        D.busy = false;
        if (!r.ok) {
            if (r.error.code === 'UNSUPPORTED') { D.avail = false; renderCard(target, null); return loadDaily(orig); }
            gm.showToast(r.error.message);
            return;
        }
        const st = r.data;
        D.avail = true; D.ch[target] = st; D.chAt[target] = Date.now();
        if (st.status === 'finished') { renderCard(target, st); openServerFinished(target, st); return; }
        const c = findCase(st.case_id);
        if (!c) { gm.showToast('Günün vakası bu sürümde yok. Sayfayı yenile.'); console.warn('[PsikoVaka] günlük vaka yok', st.case_id); return; }
        D.active = { target, caseId: c.id, day: st.day };
        gm.startDailyCase(c, { day: st.day, target, src: 'server', userId: NS.api.myId() });
        if (st.started_at) { const ms = NS.clock.now() - Date.parse(st.started_at); if (isFinite(ms) && ms > 0) gm.caseStartTime = Date.now() - ms; }
        installOverrides();
        restore(st);
    }

    function isServerDaily() {
        const gm = g();
        return !!(D.active && gm && gm.currentMode === 'daily' && gm.currentCase && gm.currentCase.id === D.active.caseId && gm.targetGameMode === D.active.target);
    }
    function installOverrides() {
        const gm = g();
        gm.submitGuess = function () { return isServerDaily() ? serverSubmit() : Object.getPrototypeOf(gm).submitGuess.call(gm); };
        gm.giveUp = function () { return isServerDaily() ? serverGiveUp() : Object.getPrototypeOf(gm).giveUp.call(gm); };
    }

    function stageKind(stage) { const t = D.active.target; return t === 'combo' ? TARGETS[(stage || 1) - 1] : t; }
    function guessView(kind, id, ok, same, stage) {
        const gm = g();
        let obj, grp = '';
        if (kind === 'therapy') { obj = gm.therapies.find(t => t.id === id); grp = obj ? ((gm.therapyFamilies[obj.family] || {}).name || obj.family) : ''; }
        else if (kind === 'pharmacology') { obj = gm.pharmacology.find(p => p.id === id); grp = obj ? ((gm.pharmacologyFamilies[obj.family] || {}).name || obj.family) : ''; }
        else { obj = gm.diagnoses.find(d => d.id === id); grp = obj ? ((gm.categories[obj.category] || {}).name || obj.category) : ''; }
        const badge = D.active.target === 'combo' ? ['Aşama 1 · Tanı', 'Aşama 2 · Terapi', 'Aşama 3 · İlaç'][stage - 1] : '';
        return { itemId: id, stage, stageBadge: badge, nameTr: obj ? obj.nameTr : id, isCorrect: !!ok, categoryMatch: !!same, categoryName: grp };
    }
    function itemName(kind, id) { const gm = g(); const list = kind === 'therapy' ? gm.therapies : kind === 'pharmacology' ? gm.pharmacology : gm.diagnoses; const x = list.find(i => i.id === id); return x ? x.nameTr : id; }

    function restore(st) {
        const gm = g();
        const list = (st.guesses || []).slice().sort((a, b) => (a.stage - b.stage) || (a.guess_no - b.guess_no));
        if (!list.length) return;
        const stage = st.stage || 1;
        let wrong = 0;
        gm.guesses = []; gm.diagWrongLog = [];
        list.forEach(x => {
            const kind = stageKind(x.stage);
            if (!x.correct) { wrong++; if (kind === 'diagnosis') gm.diagWrongLog.push(x.item_id); }
            if (D.active.target === 'combo' && x.correct && x.stage < stage) { const el = gm.dom['comboStep' + x.stage + 'Val']; if (el) el.textContent = itemName(kind, x.item_id); }
            if (x.stage === stage) gm.guesses.push(guessView(kind, x.item_id, x.correct, x.same_group, x.stage));
            else { gm.stageGuessLog = gm.stageGuessLog || {}; (gm.stageGuessLog[x.stage] = gm.stageGuessLog[x.stage] || []).push({ isCorrect: !!x.correct, categoryMatch: !!x.same_group }); }
        });
        gm.comboStage = stage;
        gm.unlockedClues = Math.min(gm.maxClues, 1 + wrong);
        if (D.active.target === 'combo') {
            if (stage === 2 && gm.dom.comboStep2Val) gm.dom.comboStep2Val.textContent = 'Şimdi terapiyi seç';
            if (stage === 3 && gm.dom.comboStep3Val) gm.dom.comboStep3Val.textContent = 'Şimdi ilacı seç';
        }
        gm.updateComboStepperUI(); gm.syncInputAndBrowserLabels();
        gm.renderClues(); gm.renderGuesses(); gm.updateRemainingGuessesUI();
    }

    function resolveChoice() {
        const gm = g();
        const v = gm.dom.diagnosisInput.value.trim();
        if (!v) { gm.showToast('Bir seçenek yaz ya da listeden seç.'); return null; }
        const sel = gm.dom.diagnosisInput.dataset.selectedId, clean = gm.normalizeTurkish(v), kind = gm.getEffectiveTargetType();
        const list = kind === 'therapy' ? gm.therapies : kind === 'pharmacology' ? gm.pharmacology : gm.diagnoses;
        const found = list.find(x => x.id === sel) || list.find(x => gm.normalizeTurkish(x.nameTr) === clean || gm.normalizeTurkish(x.nameEn) === clean || (x.aliases && x.aliases.some(a => gm.normalizeTurkish(a) === clean)));
        if (!found) { gm.showToast('Bu seçenek listede yok. Önerilerden seç.'); return null; }
        return { kind, obj: found };
    }
    function setBusy(on) { const gm = g(); D.busy = on; if (gm.dom.btnSubmit) { gm.dom.btnSubmit.disabled = on; gm.dom.btnSubmit.classList.toggle('is-loading', on); } }

    async function serverSubmit() {
        const gm = g();
        if (gm.isGameOver || D.busy) return;
        const ch = resolveChoice();
        if (!ch) return;
        if (gm.guesses.some(x => x.itemId === ch.obj.id && x.stage === gm.comboStage)) { gm.showToast('Bunu zaten tahmin ettin.'); return; }
        const caseId = D.active.caseId;
        setBusy(true);
        const r = await NS.api.dailySubmitGuess(D.active.target, ch.obj.id);
        setBusy(false);
        if (!isServerDaily() || gm.currentCase.id !== caseId) return;
        if (!r.ok) {
            const c = r.error.code;
            if (c === 'DAILY_ALREADY_FINISHED') { gm.showToast(r.error.message); const t = D.active.target; const b = await NS.api.dailyBegin(t); if (b.ok && b.data.status === 'finished') { D.ch[t] = b.data; D.chAt[t] = Date.now(); openServerFinished(t, b.data); } refreshCard(true); return; }
            if (c === 'DAILY_NOT_STARTED') { gm.showToast('Gün değişti. Yeni günün vakasını başlat.'); return; }
            gm.showToast(r.error.message);
            return;
        }
        const d = r.data;
        const kind = stageKind(d.stage);
        gm.guesses.push(guessView(kind, ch.obj.id, d.correct, d.same_group, d.stage));
        if (kind === 'diagnosis' && !d.correct) (gm.diagWrongLog = gm.diagWrongLog || []).push(ch.obj.id);
        gm.dom.diagnosisInput.value = ''; delete gm.dom.diagnosisInput.dataset.selectedId; gm.closeAutocomplete();
        gm.playTone(d.correct ? 'win' : (d.same_group ? 'warm' : 'cold'));
        if (!d.correct && gm.unlockedClues < gm.maxClues) gm.unlockedClues++;
        if (d.correct && d.next_stage && !d.finished) {
            const el = gm.dom['comboStep' + d.stage + 'Val']; if (el) el.textContent = ch.obj.nameTr;
            const nx = gm.dom['comboStep' + d.next_stage + 'Val']; if (nx) nx.textContent = d.next_stage === 2 ? 'Şimdi terapiyi seç' : 'Şimdi ilacı seç';
            if (typeof gm.archiveStageGuesses === 'function') gm.archiveStageGuesses();
            gm.comboStage = d.next_stage; gm.guesses = [];
            gm.updateComboStepperUI(); gm.syncInputAndBrowserLabels(); gm.renderGuesses(); gm.updateRemainingGuessesUI();
            gm.showToast(d.next_stage === 2 ? 'Tanı doğru. Şimdi terapiyi seç.' : 'Terapi doğru. Şimdi ilacı seç.');
            return;
        }
        if (d.finished) {
            if (d.won && D.active.target === 'combo' && gm.dom.comboStep3Val) gm.dom.comboStep3Val.textContent = ch.obj.nameTr;
            finish(d);
            return;
        }
        gm.renderClues(); gm.renderGuesses(); gm.updateRemainingGuessesUI();
        // Bilgi bildirimi yok (H1): ipucu kartı parlar, tahmin şeridi grubu gösterir
        if (typeof gm.announcePlay === 'function') gm.announcePlay(d.same_group ? `Grup doğru: ${gm.guesses[gm.guesses.length - 1].categoryName}. İpucu ${gm.unlockedClues}/${gm.maxClues} açıldı.` : `Yanlış. İpucu ${gm.unlockedClues}/${gm.maxClues} açıldı.`);
    }
    async function serverGiveUp() {
        const gm = g();
        if (gm.isGameOver || D.busy) return;
        setBusy(true);
        const r = await NS.api.dailyGiveUp(D.active.target);
        setBusy(false);
        if (!r.ok) { gm.showToast(r.error.message); return; }
        finish(Object.assign({ won: false, finished: true }, r.data));
    }

    /** Sunucu bitişi: motorun kendi bitiş akışı (rapor, konfeti, açıklama) + günlük kart/seri. */
    function finish(d) {
        const gm = g();
        const target = D.active.target;
        if (d.time_sec != null) gm.elapsedSeconds = d.time_sec;
        clearInterval(gm.duelTimerInterval);
        const st = Object.assign({}, D.ch[target] || {}, { status: 'finished', won: !!d.won, points: d.points != null ? d.points : 0, time_sec: d.time_sec, guesses_used: d.guesses_used != null ? d.guesses_used : (D.ch[target] || {}).guesses_used });
        D.ch[target] = st; D.chAt[target] = Date.now();
        D.board.data = null;
        Object.getPrototypeOf(gm).handleGameEnd.call(gm, !!d.won);
        if (gm.dom.playResultTitle && d.won) gm.dom.playResultTitle.textContent = `${st.guesses_used}. tahminde bildin · ${d.points} puan`;
        if (gm.dom.btnMainNextCase) gm.dom.btnMainNextCase.textContent = 'Pratiğe devam et';
        if (gm.updateDailyRecord) gm.updateDailyRecord(target, st.day || D.active.day, { points: st.points, time_sec: st.time_sec, guessesUsed: st.guesses_used, src: 'server' });
        renderCard(target, st);
        loadStreaks(true).then(() => showStreakInReport(target, !!d.won));
    }
    function showStreakInReport(target, won) {
        const el = $('resultStreakNote');
        if (!el) return;
        const sk = streakFor(target);
        if (!sk || !isServerDaily()) { el.hidden = true; return; }
        $('resultStreakText').textContent = won
            ? `${sk.current_streak} günlük seri${sk.best_streak > sk.current_streak ? ` · En iyi ${sk.best_streak}` : sk.current_streak > 1 ? ' · En iyi serin' : ''}`
            : `Seri sıfırlandı · En iyi ${sk.best_streak}`;
        el.classList.toggle('is-loss', !won);
        el.hidden = false;
        // Rapor artık kendiliğinden açılmıyor: seri sonuç kartında da görünsün, paylaşım satırına girsin
        const gm = g();
        if (gm) {
            gm.shareStreak = won ? sk.current_streak : 0;
            if (typeof gm.setResultStreak === 'function') gm.setResultStreak($('resultStreakText').textContent, !won);
        }
        renderCard(target, D.ch[target]);
    }

    // ------------------------------------------------------------ Profil
    async function renderProfile() {
        const box = $('profileStreaks'), list = $('profileStreaksList');
        if (!box) return;
        if (!member() || D.avail === false) { box.hidden = true; return; }
        if (D.avail == null) await loadChallenge(curTarget());
        const sk = D.avail === true ? await loadStreaks() : null;
        if (!sk) { box.hidden = true; return; }
        list.innerHTML = TARGETS.map(t => { const x = sk.find(s => s.target === t) || { current_streak: 0, best_streak: 0 }; return `
            <li class="profile-streak${x.current_streak > 0 ? ' is-on' : ''}"><span class="profile-streak-t">${esc(T.target[t])}</span>
            <span class="profile-streak-v">${x.current_streak} günlük seri</span><span class="profile-streak-b">En iyi ${x.best_streak}</span></li>`; }).join('');
        box.hidden = false;
    }

    // ------------------------------------------------------------ sıralama ekranı (#/gunluk)
    function boardState() {
        if (location.protocol === 'file:') return 'file';
        const a = acc();
        if (!a || a.availability !== 'ready') return a && a.availability === 'pending' ? 'pending' : 'unavailable';
        if (D.avail === false) return 'soon';
        if (a.state !== 'ready') return 'guest';
        return 'ready';
    }
    async function loadBoard(force) {
        const B = D.board;
        if (boardState() !== 'ready') { renderBoard(); return; }
        if (B.loading && !force) return;
        const seq = ++B.reqSeq;
        B.loading = true; renderBoard();
        const day = B.day === 'yesterday' ? yesterday() : null;
        const [r] = await Promise.all([NS.api.getDailyLeaderboard(B.target, day, 200), loadChallenge(B.target)]);
        if (seq !== B.reqSeq) return;
        B.loading = false;
        if (r.ok) { B.data = r.data; B.error = null; D.avail = true; }
        else if (r.error.code === 'UNSUPPORTED') { D.avail = false; B.data = null; }
        else { B.error = r.error; }
        renderBoard();
    }
    function yesterday() {
        const st = D.ch[D.board.target];
        const base = st && st.day ? new Date(st.day + 'T12:00:00Z') : new Date(NS.clock.now() + 3 * 3600e3);
        base.setUTCDate(base.getUTCDate() - 1);
        return base.toISOString().slice(0, 10);
    }
    function pips(row, target) {
        if (target === 'combo') return `<span class="dl-guess-n">${row.guesses_used} tahmin</span>`;
        const n = Math.min(6, row.guesses_used || 0);
        return `<span class="dl-pips" aria-hidden="true">${Array.from({ length: 6 }, (_, i) => `<i class="${i < n ? (row.won && i === n - 1 ? 'is-hit' : 'is-miss') : ''}"></i>`).join('')}</span>`;
    }
    function rowHtml(x, me, target) {
        const label = x.won ? `${x.guesses_used}. tahminde` : 'Çözemedi';
        return `<li class="dl-row${x.user_id === me ? ' is-me' : ''}${x.won ? '' : ' is-lost'}" aria-label="${x.rank}. ${esc(x.username)}, ${label}, ${x.points} puan">
            <span class="dl-rank">${x.rank}</span>
            ${NS.avatar(x.avatar, { size: 36, framed: true })}
            <span class="dl-main"><span class="dl-name">${esc(x.username || x.display_name)}${x.user_id === me ? ' <span class="ol-me-tag">sen</span>' : ''}<span class="dl-badge" title="${esc(NS.leagueName(x.ranked_points))}">${NS.leagueBadge(x.ranked_points, 16)}</span></span>
                <span class="dl-sub">${pips(x, target)}<span class="dl-sub-t">${x.won ? fmtTime(x.time_sec) : 'Çözemedi'}</span></span></span>
            <span class="dl-pts">${x.points}</span>
        </li>`;
    }
    function renderBoard() {
        const m = $('dailyMount');
        if (!m) return;
        const scr = m.closest('.screen'); if (scr && scr.hidden) return;
        const B = D.board;
        const st = boardState();
        const seg = (name, vals, cur, label) => `<div class="segmented dl-seg" role="radiogroup" aria-label="${esc(label)}">${vals.map(([v, l]) =>
            `<button class="segmented-btn${v === cur ? ' active' : ''}" type="button" role="radio" aria-checked="${v === cur}" data-dl-${name}="${v}">${esc(l)}</button>`).join('')}</div>`;
        const controls = `<div class="dl-controls">
            ${seg('target', TARGETS.map(t => [t, T.target[t]]), B.target, 'Hedef')}
            <div class="dl-controls-row">
                ${seg('day', [['today', 'Bugün'], ['yesterday', 'Dün']], B.day, 'Gün')}
                ${st === 'ready' ? `<label class="dl-friends"><input type="checkbox" data-dl-friends ${B.friends ? 'checked' : ''}><span>Yalnızca arkadaşlar</span></label>` : ''}
            </div></div>`;
        let body = '';
        const gate = (title, text, btns) => `<div class="ol-empty dl-gate">${icon('podium')}<span class="dl-gate-text"><strong>${title}</strong><span>${text}</span></span>${btns || ''}</div>`;
        if (st === 'file') body = gate('Sıralama bu sürümde kapalı', 'Tek dosyalık sürüm sunucuya bağlanamaz. Günün vakasını yine oynayabilirsin.');
        else if (st === 'pending') body = `<div class="ol-skel"></div><div class="ol-skel"></div>`;
        else if (st === 'unavailable') body = gate('Sunucuya ulaşılamıyor', 'Sıralama şu an yüklenemiyor. Günün vakası yine oynanabilir.');
        else if (st === 'soon') body = gate('Günlük sıralama yakında', 'Bu özellik sunucuda henüz açılmadı. Günün vakası her zamanki gibi oynanabilir.');
        else if (st === 'guest') body = gate('Sıralamaya girmek için giriş yap', 'Günün vakasını üyelerle aynı vaka üzerinden oynayabilirsin; sonucunun sıralamada görünmesi için hesap gerekir.',
            `<span class="dl-gate-btns"><button class="btn btn-primary btn-sm" type="button" data-dl-act="signin">Giriş yap</button><button class="btn btn-secondary btn-sm" type="button" data-dl-act="signup">Hesap oluştur</button></span>`);
        else if (B.error) body = `<div class="ol-empty">${icon('alert')}<span>${esc(B.error.message)}</span><button class="btn btn-sm btn-secondary" type="button" data-dl-act="retry">Tekrar dene</button></div>`;
        else if (!B.data) body = `<div class="ol-skel"></div><div class="ol-skel"></div><div class="ol-skel"></div>`;
        else body = listHtml();
        const mine = D.ch[B.target];
        const cta = st === 'ready' && B.day === 'today' && mine && mine.status !== 'finished'
            ? `<div class="dl-cta">${icon('play')}<span>Bugünün ${esc(T.target[B.target].toLocaleLowerCase('tr'))} vakasını henüz bitirmedin.</span><button class="btn btn-primary btn-sm" type="button" data-dl-act="play">${mine.status === 'in_progress' ? 'Devam et' : 'Başla'}</button></div>` : '';
        const focusKey = document.activeElement && m.contains(document.activeElement) ? (document.activeElement.getAttribute('data-dl-target') ? 't:' + document.activeElement.getAttribute('data-dl-target') : document.activeElement.getAttribute('data-dl-day') ? 'd:' + document.activeElement.getAttribute('data-dl-day') : document.activeElement.hasAttribute('data-dl-friends') ? 'f' : null) : null;
        m.innerHTML = `<div class="dl">${controls}${cta}<div class="dl-body" aria-live="polite" aria-busy="${B.loading ? 'true' : 'false'}">${body}</div></div>`;
        if (focusKey) { const sel = focusKey === 'f' ? '[data-dl-friends]' : focusKey[0] === 't' ? `[data-dl-target="${focusKey.slice(2)}"]` : `[data-dl-day="${focusKey.slice(2)}"]`; const el = m.querySelector(sel); if (el) el.focus({ preventScroll: true }); }
    }
    function listHtml() {
        const B = D.board, data = B.data, me = NS.api.myId();
        let rows = data.rows || [];
        if (B.friends) {
            const ids = new Set(((NS.friends && NS.friends.state.friends) || []).map(f => f.user.id).concat([me]));
            rows = rows.filter(x => ids.has(x.user_id));
        }
        const total = data.total_players || 0;
        const head = `<p class="dl-total">${total ? `${total} oyuncu bitirdi` : ''}${B.friends ? ' · arkadaşların gösteriliyor' : ''}</p>`;
        if (!rows.length) {
            return head + `<div class="ol-empty">${icon('podium')}<span>${B.friends ? 'Arkadaşlarından bu gün bitiren yok.' : B.day === 'yesterday' ? 'Dün bu hedefte kimse bitirmemiş.' : 'Bugün henüz kimse bitirmedi. İlk sen ol.'}</span></div>`;
        }
        const meIn = rows.some(x => x.user_id === me);
        const pinned = !meIn && data.me && !B.friends ? `<li class="dl-gap" aria-hidden="true">…</li>${rowHtml(data.me, me, B.target).replace('class="dl-row', 'class="dl-row is-pinned')}` : '';
        return head + `<ol class="dl-list">${rows.map(x => rowHtml(x, me, B.target)).join('')}${pinned}</ol>`;
    }

    function onBoardShow(info) {
        const B = D.board;
        if (!B.target) B.target = curTarget();
        if (info && info.changed) { const h = $('dailyTitle'); if (h) setTimeout(() => { try { h.focus({ preventScroll: true }); } catch (e) { /* yok */ } }, 0); }
        renderBoard();
        loadBoard(true);
        clearInterval(B.timer);
        B.timer = setInterval(() => { const scr = $('screenDaily'); if (!scr || scr.hidden) { clearInterval(B.timer); B.timer = null; return; } if (!document.hidden) loadBoard(); }, 45000);
    }

    function bindBoard() {
        const m = $('dailyMount');
        if (!m || m._dlBound) return;
        m._dlBound = true;
        m.addEventListener('click', (e) => {
            const B = D.board;
            const t = e.target.closest('[data-dl-target]'), d = e.target.closest('[data-dl-day]'), a = e.target.closest('[data-dl-act]');
            if (t) { B.target = t.dataset.dlTarget; B.data = null; renderBoard(); loadBoard(true); return; }
            if (d) { B.day = d.dataset.dlDay; B.data = null; renderBoard(); loadBoard(true); return; }
            if (!a) return;
            const gm = g();
            if (a.dataset.dlAct === 'retry') loadBoard(true);
            else if (a.dataset.dlAct === 'signin') gm.openAuthSheet('signin');
            else if (a.dataset.dlAct === 'signup') gm.openAuthSheet('signup');
            else if (a.dataset.dlAct === 'play') { if (gm.targetGameMode !== B.target) gm.setTargetGameMode(B.target, false); gm.setMode('daily'); }
        });
        m.addEventListener('change', (e) => {
            if (e.target.matches('[data-dl-friends]')) { D.board.friends = e.target.checked; if (e.target.checked && NS.friends && !NS.friends.state.loaded) NS.friends.load({ silent: true }); renderBoard(); }
        });
        // segmented: ok tuşları
        m.addEventListener('keydown', (e) => {
            const b = e.target.closest('.dl-seg .segmented-btn');
            if (!b || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
            const all = Array.from(b.parentNode.children);
            const n = all[(all.indexOf(b) + (e.key === 'ArrowRight' ? 1 : all.length - 1)) % all.length];
            e.preventDefault(); n.click();
        });
    }

    // ------------------------------------------------------------ başlangıç
    function init() {
        const gm = g();
        if (!gm || !gm.registerScreen) { setTimeout(init, 60); return; }
        const orig = gm.loadDailyCase.bind(gm);
        gm.loadDailyCase = () => loadDaily(orig);
        bindBoard();
        gm.registerScreen('gunluk', onBoardShow);
        const prevOyna = gm.screenHooks && gm.screenHooks.oyna;
        gm.registerScreen('oyna', (i) => { if (prevOyna) prevOyna(i); refreshCard(); });
        const prevProfil = gm.screenHooks && gm.screenHooks.profil;
        gm.registerScreen('profil', (i) => { if (prevProfil) prevProfil(i); renderProfile(); });
        document.querySelectorAll('.target-mode-btn').forEach(b => b.addEventListener('click', () => setTimeout(() => refreshCard(), 0)));
        // rapor kapanınca seri notu sıfırlansın (başka vakada görünmesin)
        const origOpen = gm.openResultModal.bind(gm);
        gm.openResultModal = (won) => { const el = $('resultStreakNote'); if (el && !isServerDaily()) el.hidden = true; return origOpen(won); };
        const a = acc();
        if (a && a.onChange) a.onChange(() => { D.settleGaveUp = false; D.ch = {}; D.chAt = {}; D.streaks = null; D.avail = D.avail === false ? false : null; D.active = null; D.board.data = null;
            if (gm.currentScreen === 'oyna') refreshCard(true); if (gm.currentScreen === 'gunluk') onBoardShow({}); if (gm.currentScreen === 'profil') renderProfile(); });
        if (gm.currentScreen === 'oyna') refreshCard();
    }

    NS.daily = {
        refreshCard, loadBoard, renderBoard, renderProfile, status,
        get available() { return D.avail; }, get active() { return D.active; }, isServerDaily,
        _reset() { D.avail = null; D.ch = {}; D.chAt = {}; D.streaks = null; D.board.data = null; D.active = null; }
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0)); else setTimeout(init, 0);
})(typeof window !== 'undefined' ? window : globalThis);
