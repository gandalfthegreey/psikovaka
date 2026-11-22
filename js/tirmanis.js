/**
 * PsikoVaka — Tırmanış Modu (Zor Mod Kesintisiz Seri + Paylaşımlı İpucu Bütçesi).
 * - Başlangıçta 10 ipucu bütçesiyle başlanır.
 * - Her vaka Zor Modda (Tek Tahmin Hakkı + Kategori Gizli) oynanır.
 * - Doğru tahminde kaçıncı ipucunda bilindiğine göre bütçe değişimi:
 *   1. ipucu: +2 | 2.: +1 | 3.: ±0 | 4.: -1 | 5.: -2 | 6.: -3
 * - Yanlış tahminde tırmanış biter.
 * - İlerleme localStorage.psikovaka_tirmanis_v1 içinde saklanır (online Elo'yu etkilemez).
 */
(function (global) {
    'use strict';

    const STORAGE_KEY = 'psikovaka_tirmanis_v1';
    const START_BUDGET = 10;
    const DELTA_BY_CLUE = { 1: 2, 2: 1, 3: 0, 4: -1, 5: -2, 6: -3 };

    let state = null;
    let lastFinishedRun = null;

    function defaultState() {
        return {
            bestStreak: 0,
            totalRuns: 0,
            activeRun: null // { streak, budget, totalClues, usedIds: [], targetMode }
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

    function renderAvatar(cfg, size, opts) {
        const AV = global.PsikoVakaAvatar;
        if (!AV) return '';
        return AV.render(cfg, Object.assign({ size: size || 88, framed: false, animated: true }, opts || {}));
    }

    function pickNextCase(gm, run) {
        const all = (global.CASES_DATABASE || []).filter(c => !c.archived);
        const mode = (run && run.targetMode) || (gm && gm.targetMode) || 'diagnosis';
        let pool = all;
        if (mode === 'therapy') pool = all.filter(c => c.targetTherapyId);
        else if (mode === 'pharmacology') pool = all.filter(c => c.targetPharmacologyId);
        else if (mode === 'combo') pool = all.filter(c => c.targetTherapyId || c.targetPharmacologyId);
        if (!pool.length) pool = all;

        const used = new Set((run && run.usedIds) || []);
        let fresh = pool.filter(c => !used.has(c.id));
        if (!fresh.length) {
            if (run) run.usedIds = [];
            fresh = pool;
        }
        return fresh[Math.floor(Math.random() * fresh.length)];
    }

    function startNewRun() {
        const s = load();
        const gm = global.game;
        lastFinishedRun = null;
        s.activeRun = {
            streak: 0,
            budget: START_BUDGET,
            totalClues: 0,
            usedIds: [],
            targetMode: (gm && gm.targetMode) || 'diagnosis'
        };
        save();
        updateHomeCard();
        launchNextCase();
    }

    function continueRun() {
        const s = load();
        if (!s.activeRun) {
            startNewRun();
            return;
        }
        launchNextCase();
    }

    function launchNextCase() {
        const s = load();
        const gm = global.game;
        if (!gm || !s.activeRun) return;
        const c = pickNextCase(gm, s.activeRun);
        if (!c) return;
        s.activeRun.usedIds.push(c.id);
        save();

        gm.currentMode = 'climb';
        gm.dailyReadOnly = false;
        gm.dailyContext = null;
        gm.clueRevealHandler = null;
        gm.dailyZorlukHandler = null;
        if (s.activeRun.targetMode && gm.targetMode !== s.activeRun.targetMode) {
            gm.setTargetMode(s.activeRun.targetMode, { silent: true });
        }
        gm.setCaseZorluk({ tekHak: true, kategoriGizli: true }, { locked: true });
        gm.loadCase(c);
        gm.showScreen('play');
        if (gm.dom && gm.dom.playModePill) {
            gm.dom.playModePill.textContent = `Tırmanış #${s.activeRun.streak + 1}`;
        }
        renderPlayHud(gm);
    }

    function renderPlayHud(gm) {
        const bar = document.getElementById('climbHudBar');
        if (!bar) return;
        const s = load();
        const run = s.activeRun;
        if (!gm || gm.currentMode !== 'climb' || !run) {
            bar.hidden = true;
            bar.innerHTML = '';
            return;
        }
        const curClue = Math.max(1, Math.min(6, gm.unlockedClues || 1));
        const d = deltaFor(curClue);
        const deltaCls = d > 0 ? 'is-pos' : d < 0 ? 'is-neg' : 'is-zero';
        bar.hidden = false;
        bar.innerHTML = `
            <span class="tr-hud-pill tr-hud-streak">🔥 Seri: <strong>${run.streak}</strong></span>
            <span class="tr-hud-pill tr-hud-budget${run.budget <= 2 ? ' is-low' : ''}">💡 İpucu Bütçesi: <strong>${run.budget}</strong></span>
            <span class="tr-hud-pill tr-hud-delta ${deltaCls}">Bu ipucunda bilirsen: <strong>${fmtDelta(d)}</strong></span>
            <span class="tr-hud-pill tr-hud-best">🏆 Rekor: <strong>${s.bestStreak}</strong></span>
        `;
    }

    function onCaseFinished(won, gm) {
        const s = load();
        const run = s.activeRun;
        if (!run) return;

        if (won) {
            const usedClue = Math.max(1, Math.min(6, gm.unlockedClues || 1));
            const d = deltaFor(usedClue);
            run.streak += 1;
            run.totalClues += usedClue;
            run.budget = Math.max(0, run.budget + d);
            const newRecord = run.streak > s.bestStreak;
            if (newRecord) s.bestStreak = run.streak;
            save();
            renderPlayHud(gm);
            updateHomeCard();

            if (gm && typeof gm.setResultStreak === 'function') {
                gm.setResultStreak(`🏔️ Tırmanış Serisi: ${run.streak} · Bütçe: ${run.budget} (${fmtDelta(d)})${newRecord ? ' · 🏆 Yeni Rekor!' : ''}`, false);
            }
            if (gm && gm.dom && gm.dom.btnMainNextCase) {
                gm.dom.btnMainNextCase.innerHTML = `➡️ Sıradaki Vaka (Seri #${run.streak + 1})`;
            }
        } else {
            const finalStreak = run.streak;
            const avg = finalStreak > 0 ? (run.totalClues / finalStreak).toFixed(1) : '—';
            const isRecord = finalStreak > 0 && finalStreak >= s.bestStreak;
            s.totalRuns += 1;
            s.activeRun = null;
            lastFinishedRun = { streak: finalStreak, avgClues: avg, isRecord };
            save();
            renderPlayHud(gm);
            updateHomeCard();

            if (gm && typeof gm.setResultStreak === 'function') {
                gm.setResultStreak(`🏔️ Tırmanış bitti · Seri: ${finalStreak} (Rekor: ${s.bestStreak})`, true);
            }
            if (gm && gm.dom && gm.dom.btnMainNextCase) {
                gm.dom.btnMainNextCase.innerHTML = `🏔️ Tırmanış Odasına Dön`;
            }
        }
    }

    function handlePostCaseAction() {
        const s = load();
        if (s.activeRun) {
            continueRun();
        } else {
            location.hash = '#/tirmanis';
            render();
        }
    }

    function updateHomeCard() {
        const sub = document.getElementById('homeClimbMeta');
        const btn = document.getElementById('btnHomeClimb');
        if (!sub) return;
        const s = load();
        if (s.activeRun && s.activeRun.streak > 0) {
            sub.textContent = `Devam eden seri: ${s.activeRun.streak} · Bütçe: ${s.activeRun.budget} · Rekor: ${s.bestStreak}`;
            if (btn) btn.textContent = `Seriye devam et (#${s.activeRun.streak + 1})`;
        } else if (s.bestStreak > 0) {
            sub.textContent = `🏆 En iyi serin: ${s.bestStreak} vaka · Zor mod + 10 ipucu bütçesi`;
            if (btn) btn.textContent = 'Tırmanışa başla';
        } else {
            sub.textContent = 'Zor modda 10 ipucu bütçesiyle art arda kaç vaka bilebilirsin?';
            if (btn) btn.textContent = 'Tırmanışa başla';
        }
    }

    function therapistBubbleText(s) {
        if (lastFinishedRun) {
            return lastFinishedRun.isRecord && lastFinishedRun.streak > 0
                ? `🏆 ${lastFinishedRun.streak} vakalık yeni rekor!`
                : `🔥 ${lastFinishedRun.streak} seri yaptın, tekrar deneyelim!`;
        }
        if (s.activeRun) {
            return `🔥 Seri ${s.activeRun.streak} · ${s.activeRun.budget} ipucu kaldı!`;
        }
        if (s.bestStreak >= 5) {
            return `🏔️ Rekorun ${s.bestStreak}! Üstüne çıkabilir misin?`;
        }
        return '☕ Hazırsan ilk zor vakayı alalım!';
    }

    function render() {
        const root = document.getElementById('climbMount');
        if (!root) return;
        const s = load();
        const gm = global.game;
        const myCfg = (gm && gm.myAvatar) || (global.PsikoVakaAvatar && global.PsikoVakaAvatar.DEFAULT) || {};
        const run = s.activeRun;

        const summaryBanner = lastFinishedRun ? `
            <div class="tr-summary-banner${lastFinishedRun.isRecord && lastFinishedRun.streak > 0 ? ' is-record' : ''}">
                <div class="tr-summary-main">
                    <strong>${lastFinishedRun.isRecord && lastFinishedRun.streak > 0 ? `🏆 Yeni Tırmanış Rekoru: ${lastFinishedRun.streak} Vaka!` : `🏔️ Tırmanış Tamamlandı — ${lastFinishedRun.streak} Vaka Seri`}</strong>
                    <span>Ortalama ipucu: ${lastFinishedRun.avgClues} · Genel rekor: ${s.bestStreak}</span>
                </div>
                <button type="button" class="btn btn-ghost btn-sm" id="btnClimbDismissSummary">Tamam</button>
            </div>` : '';

        root.innerHTML = `
            <div class="tr-header">
                <div>
                    <h1 class="tr-title">🏔️ Tırmanış</h1>
                    <p class="tr-sub">Zor modda (Tek Tahmin Hakkı + Kategori Gizli) art arda kaç vaka bilebilirsin?</p>
                </div>
                <div class="tr-stats">
                    <div class="tr-stat-pill is-best"><span>🏆</span><strong>Rekor: ${s.bestStreak}</strong></div>
                    ${run ? `<div class="tr-stat-pill is-active"><span>🔥</span><strong>Seri: ${run.streak}</strong></div>` : ''}
                    ${run ? `<div class="tr-stat-pill is-budget"><span>💡</span><strong>Bütçe: ${run.budget}</strong></div>` : ''}
                    <div class="tr-stat-pill"><span>🎮</span><strong>${s.totalRuns} deneme</strong></div>
                </div>
            </div>

            ${summaryBanner}

            <div class="tr-stage">
                <div class="tr-bg-photo" aria-hidden="true"></div>
                <div class="tr-fire-ambient" aria-hidden="true"></div>
                <div class="tr-motes" aria-hidden="true">
                    <span class="tr-mote" style="left:28%;top:28%;animation-delay:0s"></span>
                    <span class="tr-mote" style="left:45%;top:36%;animation-delay:2.1s"></span>
                    <span class="tr-mote" style="left:62%;top:30%;animation-delay:4.2s"></span>
                    <span class="tr-mote" style="left:78%;top:40%;animation-delay:1.5s"></span>
                </div>
                <div class="tr-noro-seat">
                    <div class="tr-noro-bubble">${esc(therapistBubbleText(s))}</div>
                    ${renderAvatar(myCfg, 92, { facing: 'left', activity: run ? 'think' : null })}
                    <span class="tr-noro-tag">Sen</span>
                </div>
            </div>

            <div class="tr-actions">
                ${run ? `
                    <button type="button" class="btn btn-primary btn-lg tr-start-btn" id="btnClimbContinue">
                        ▶️ Tırmanışa Devam Et (Vaka #${run.streak + 1})
                    </button>
                    <button type="button" class="btn btn-secondary btn-lg" id="btnClimbRestart">
                        🔄 Sıfırdan Başla
                    </button>
                ` : `
                    <button type="button" class="btn btn-primary btn-lg tr-start-btn" id="btnClimbStart">
                        🏔️ Tırmanışa Başla (10 İpucu)
                    </button>
                `}
            </div>

            <section class="tr-rules-card" aria-label="Tırmanış ipucu bütçesi kuralları">
                <div class="tr-rules-head">
                    <strong>💡 Paylaşımlı İpucu Bütçesi (Başlangıç: 10)</strong>
                    <span>Erken bilerek bütçe biriktir; 4–6. ipuçları bütçenden düşer. 1 yanlışta tırmanış biter.</span>
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
        `;

        const btnStart = document.getElementById('btnClimbStart');
        if (btnStart) btnStart.addEventListener('click', startNewRun);

        const btnCont = document.getElementById('btnClimbContinue');
        if (btnCont) btnCont.addEventListener('click', continueRun);

        const btnRestart = document.getElementById('btnClimbRestart');
        if (btnRestart) btnRestart.addEventListener('click', startNewRun);

        const btnDismiss = document.getElementById('btnClimbDismissSummary');
        if (btnDismiss) btnDismiss.addEventListener('click', () => { lastFinishedRun = null; render(); });
    }

    global.PsikoVakaTirmanis = {
        START_BUDGET,
        load,
        render,
        startNewRun,
        continueRun,
        launchNextCase,
        renderPlayHud,
        onCaseFinished,
        handlePostCaseAction,
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
