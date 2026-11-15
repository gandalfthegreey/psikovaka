/**
 * PsikoVaka — "Lig bilgisi" ekranı (#/ligler). js/leagues.js tablosunu, puan kurallarını ve son maçların RP geçmişini gösterir.
 *  - Puan kuralları sunucudaki game_config'ten okunur (giriş yapılmışsa); RP v2 anahtarları varsa yeni kurallar,
 *    yalnızca eski anahtarlar varsa eski kurallar gösterilir (ekran sunucunun uyguladığından farklı bir şey söylemez).
 *    Okunamazsa (misafir, çevrimdışı, file://) belgelenmiş RP v2 varsayılanları "varsayılan" notuyla.
 *  - Son maçlar: get_my_rp_history(p_limit) (migration 0003). Fonksiyon yoksa bölüm gizlenir.
 * Bağımlılık: PsikoVakaOnline (core, api), PsikoVakaLeagues, PsikoVakaAccount (isteğe bağlı).
 */
(function (global) {
    'use strict';
    const NS = global.PsikoVakaOnline;
    const { esc, icon } = NS.util;
    const T = NS.T;

    // RP v2 (TASARIM.md §13.4) game_config anahtarları ve belgelenmiş varsayılanlar
    const V2 = {
        guess: ['rp_round_g1', 'rp_round_g2', 'rp_round_g3', 'rp_round_g4', 'rp_round_g5', 'rp_round_g6'],
        fail: 'rp_round_fail',
        duelWin: 'rp_place_duel_1', ffa1: 'rp_place_ffa_1', ffa2: 'rp_place_ffa_2', tour1: 'rp_place_tournament_1', tour2: 'rp_place_tournament_2'
    };
    const V2_DEFAULTS = {
        rp_round_g1: 10, rp_round_g2: 8, rp_round_g3: 6, rp_round_g4: 4, rp_round_g5: 2, rp_round_g6: 1,
        rp_round_fail: -10, rp_place_duel_1: 10, rp_place_ffa_1: 15, rp_place_ffa_2: 5, rp_place_tournament_1: 25, rp_place_tournament_2: 10
    };
    const OLD_KEYS = ['rp_win_tournament', 'rp_win_ffa', 'rp_win_duel', 'rp_second', 'rp_completion'];

    const S = { mount: null, cfg: null, cfgAt: 0, cfgLoading: false, hist: null, histAt: 0, histUid: null, histLoading: false, pos: null, posAt: 0, scrolled: false };

    function acc() { return global.PsikoVakaAccount || null; }
    function signedIn() { const a = acc(); return !!(a && a.availability === 'ready' && a.state === 'ready' && NS.api.client()); }
    function myProfile() { const a = acc(); const s = a && a.snapshot ? a.snapshot() : null; return s && s.profile ? s.profile : null; }
    const signed = (n) => (n > 0 ? '+' + n : n < 0 ? '−' + Math.abs(n) : '0');

    // ------------------------------------------------------------ veri
    async function loadConfig() {
        if (S.cfgLoading || (S.cfg && Date.now() - S.cfgAt < 5 * 60000) || !signedIn()) return;
        S.cfgLoading = true;
        const r = await NS.api.getConfig();
        S.cfgLoading = false;
        if (r.ok && Array.isArray(r.data)) {
            const m = {}; r.data.forEach(x => { m[x.key] = Number(x.value); });
            S.cfg = m; S.cfgAt = Date.now();
            render();
        }
    }
    async function loadHistory() {
        const me = NS.api.myId();
        if (!signedIn() || S.histLoading) return;
        if (S.histUid === me && S.hist && Date.now() - S.histAt < 30000) return;
        if (S.hist === 'unsupported' && S.histUid === me) return;
        S.histLoading = true;
        const r = await NS.api.getMyRpHistory(20);
        S.histLoading = false;
        S.histUid = me; S.histAt = Date.now();
        if (r.ok) S.hist = Array.isArray(r.data) ? r.data : ((r.data && r.data.rows) || []);
        else S.hist = r.error.code === 'UNSUPPORTED' ? 'unsupported' : { error: r.error };
        render();
    }
    async function loadPosition() {
        const a = acc();
        if (!signedIn() || !a || !a.getLeaderboard || (S.pos && Date.now() - S.posAt < 60000)) return;
        S.posAt = Date.now();
        const r = await a.getLeaderboard(10);
        if (!r.ok) return;
        const me = NS.api.myId();
        const row = (r.rows || []).find(x => x.user_id === me) || (r.me && r.me.user_id === me ? r.me : null);
        S.pos = row && row.position ? row.position : null;
        render();
    }

    /** { kind: 'v2'|'old', values, source: 'server'|'default' } */
    function rules() {
        const c = S.cfg;
        if (c && V2.guess.every(k => isFinite(c[k]))) return { kind: 'v2', v: Object.assign({}, V2_DEFAULTS, c), source: 'server' };
        if (c && OLD_KEYS.some(k => isFinite(c[k]))) return { kind: 'old', v: c, source: 'server' };
        return { kind: 'v2', v: V2_DEFAULTS, source: 'default' };
    }

    // ------------------------------------------------------------ çizim
    function headHtml() {
        const L = global.PsikoVakaLeagues;
        const p = myProfile();
        if (!signedIn() || !p) {
            const a = acc();
            const canSign = a && a.availability === 'ready';
            return `<article class="card lg-head lg-head-guest">
                <div class="lg-head-text"><h2 class="lg-head-title">Ligler ve sıralama puanı</h2>
                <p class="lg-muted">Online maçlarda RP kazanır ya da kaybedersin; RP'n ligini belirler. ${canSign ? 'Kendi ligini ve son maçlarını görmek için giriş yap.' : 'Online özellikler bu sürümde ya da şu an kullanılamıyor.'}</p></div>
                ${canSign ? `<div class="lg-head-actions"><button class="btn btn-primary" type="button" data-lg="signin">Giriş yap</button><button class="btn btn-secondary" type="button" data-lg="signup">Hesap oluştur</button></div>` : ''}
            </article>`;
        }
        const rp = Number(p.ranked_points) || 0;
        const t = L.tierFor(rp);
        return `<article class="card lg-head">
            <div class="lg-head-emblem">${L.badge(rp, 88)}</div>
            <div class="lg-head-main">
                <span class="lg-eyebrow">Ligin</span>
                <h2 class="lg-head-title">${esc(t.name)}</h2>
                <span class="lg-head-rp">${rp} RP${S.pos ? ` <span class="lg-head-pos">· Sıralamada ${S.pos}.</span>` : ''}</span>
                <div class="lg-bar" role="progressbar" aria-label="Sonraki kademeye ilerleme" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${t.pct}"><i data-pct="${t.pct}"></i></div>
                <span class="lg-head-next">${t.next ? `${esc(t.next.name)} için ${t.toNext} RP kaldı` : 'En üst ligdesin'}</span>
            </div>
        </article>`;
    }

    function ladderHtml() {
        const L = global.PsikoVakaLeagues;
        const p = signedIn() ? myProfile() : null;
        const cur = p ? L.tierFor(Number(p.ranked_points) || 0).id : null;
        const curIdx = cur ? L.TIERS.findIndex(t => t.id === cur) : -1;
        return `<section class="lg-sec" aria-labelledby="lgLadderT">
            <h2 class="lg-sec-title" id="lgLadderT">Lig merdiveni</h2>
            <ol class="lg-ladder">${L.TIERS.map((t, i) => {
                const range = t.max === Infinity ? `${t.min}+ RP` : `${t.min}–${t.max} RP`;
                const state = curIdx < 0 ? '' : i === curIdx ? ' is-current' : i > curIdx ? ' is-locked' : ' is-passed';
                return `<li class="lg-tier${state}"${i === curIdx ? ' aria-current="true" data-lg-current' : ''}>
                    <span class="lg-tier-badge">${L.badge(t.min, 32)}</span>
                    <span class="lg-tier-name">${esc(t.name)}${i === curIdx ? ' <span class="ol-me-tag">sen</span>' : ''}</span>
                    <span class="lg-tier-range">${range}</span>
                    ${i > curIdx && curIdx >= 0 ? `<span class="lg-tier-lock">${icon('lock')}<span class="visually-hidden">Henüz ulaşılmadı</span></span>` : ''}
                </li>`;
            }).join('')}</ol>
        </section>`;
    }

    function rulesHtml() {
        const R = rules(), v = R.v;
        const row = (label, val) => `<tr><th scope="row">${esc(label)}</th><td class="${val > 0 ? 'is-plus' : val < 0 ? 'is-minus' : ''}">${signed(val)} RP</td></tr>`;
        let body = '';
        if (R.kind === 'v2') {
            body = `<table class="lg-table"><caption class="lg-cap">Her tur</caption><tbody>
                ${[1, 2, 3, 4, 5, 6].map(n => row(`${n}. tahminde çözdün`, v[V2.guess[n - 1]])).join('')}
                ${row('Çözemedin (6 yanlış, pes, süre doldu, hükmen)', v[V2.fail])}
                </tbody></table>
                <table class="lg-table"><caption class="lg-cap">Maç sonu sıralama bonusu</caption><tbody>
                ${row('Düello galibiyeti', v[V2.duelWin])}
                ${row('Herkes tek: 1.', v[V2.ffa1])}${row('Herkes tek: 2. (en az 3 kişi)', v[V2.ffa2])}
                ${row('Turnuva: 1.', v[V2.tour1])}${row('Turnuva: 2.', v[V2.tour2])}
                </tbody></table>
                <ul class="lg-notes">
                    <li>Maçtan erken ayrılırsan kalan her tur çözülemedi sayılır. Elendikten sonraki turlar puan götürmez.</li>
                    <li>Kombo: üç aşamadaki tahmin sayılarının ortalaması kullanılır; bir aşama çözülemezse tur çözülemedi sayılır.</li>
                    <li>Rakipler ayrıldığı için maç erken biterse, kalanlar için maç geçersiz olur (0 RP).</li>
                    <li>RP 0'ın altına düşmez. Yeni hesaplar 0 RP ile başlar.</li>
                    <li>Günün vakası ve tek kişilik pratik RP vermez.</li>
                </ul>`;
        } else {
            body = `<table class="lg-table"><tbody>
                ${isFinite(v.rp_win_duel) ? row('Düello galibiyeti', v.rp_win_duel) : ''}
                ${isFinite(v.rp_win_ffa) ? row('Herkes tek: 1.', v.rp_win_ffa) : ''}
                ${isFinite(v.rp_win_tournament) ? row('Turnuva: 1.', v.rp_win_tournament) : ''}
                ${isFinite(v.rp_second) ? row('İkincilik (2\'den fazla oyuncu)', v.rp_second) : ''}
                ${isFinite(v.rp_completion) ? row('Maçı tamamlama', v.rp_completion) : ''}
                </tbody></table>
                <ul class="lg-notes"><li>Maç erken biterse ya da erken ayrılırsan RP verilmez.</li><li>Günün vakası ve tek kişilik pratik RP vermez.</li></ul>`;
        }
        return `<section class="lg-sec" aria-labelledby="lgRulesT">
            <h2 class="lg-sec-title" id="lgRulesT">Puan nasıl kazanılır, nasıl kaybedilir?</h2>
            ${body}
            ${R.source === 'default' ? `<p class="lg-muted lg-small">${icon('info')}<span>Belgelenmiş varsayılan değerler. Giriş yaptığında güncel değerler sunucudan okunur.</span></p>` : ''}
        </section>`;
    }

    function fmtDate(iso) {
        const d = new Date(iso);
        if (!isFinite(d)) return '';
        try { return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }); } catch (e) { return d.toISOString().slice(0, 10); }
    }
    /** RP v2 tur sonucu (§13.4): g1..g6 | fail | void */
    function outcomeText(x) {
        const o = String(x.outcome || '');
        const m = /^g([1-6])$/.exec(o);
        if (m) return `${m[1]}. tahminde çözdü`;
        if (o === 'fail') return x.missed ? 'Oynanmadı (ayrıldın)' : 'Çözemedi';
        if (o === 'void') return 'Yarıda kaldı';
        return o || '—';
    }
    /** rp_breakdown (§13.4): { rounds: [{round, outcome, delta, missed?}], placement, voided, total } */
    function breakdownHtml(bd) {
        if (!bd || typeof bd !== 'object' || !Array.isArray(bd.rounds)) return '';
        const place = Number(bd.placement || 0);
        return `<ul class="lg-bd">${bd.rounds.map(x => { const d = Number(x.delta) || 0; return `<li><span>Tur ${esc(x.round)}</span><span class="lg-bd-o">${esc(outcomeText(x))}</span><span class="lg-delta ${d > 0 ? 'is-plus' : d < 0 ? 'is-minus' : ''}">${signed(d)}</span></li>`; }).join('')}
            ${place ? `<li class="lg-bd-place"><span>Sıralama primi</span><span class="lg-delta is-plus">${signed(place)}</span></li>` : ''}
            ${bd.voided ? `<li class="lg-bd-note"><span>Maç erken bittiği için geçersiz sayıldı.</span></li>` : ''}</ul>`;
    }
    function historyHtml() {
        if (!signedIn()) return '';
        const h = S.hist;
        if (h === 'unsupported') return '';
        let inner;
        if (h == null) inner = `<div class="ol-skel"></div><div class="ol-skel"></div>`;
        else if (h.error) inner = `<div class="ol-empty">${icon('alert')}<span>${esc(h.error.message)}</span><button class="btn btn-sm btn-secondary" type="button" data-lg="retry-hist">Tekrar dene</button></div>`;
        else if (!h.length) inner = `<div class="ol-empty">${icon('trophy')}<span>Henüz RP'li maçın yok. Online'da bir maç bitir, burada görünsün.</span></div>`;
        else inner = `<ul class="lg-hist">${h.map(x => {
            const d = Number(x.rp_delta) || 0;
            const room = { mode: x.mode, format: x.format };
            const rank = x.placement != null ? x.placement : x.final_rank;
            const n = x.players != null ? x.players : x.player_count;
            const tgt = x.target || x.target_type;
            const place = rank ? `${rank}.${n ? ` / ${n}` : ''}` : '';
            const bd = breakdownHtml(x.rp_breakdown);
            const head = `<span class="lg-hist-main"><span class="lg-hist-title">${esc(NS.roomTitle(room))}</span>
                <span class="lg-hist-sub">${esc(fmtDate(x.finished_at || x.created_at))}${tgt ? ` · ${esc(T.target[tgt] || tgt)}` : ''}${place ? ` · ${esc(place)}` : ''}</span></span>
                <span class="lg-delta lg-delta-big ${d > 0 ? 'is-plus' : d < 0 ? 'is-minus' : ''}">${signed(d)} RP</span>`;
            return bd ? `<li class="lg-hist-row"><details><summary class="lg-hist-sum">${head}</summary>${bd}</details></li>` : `<li class="lg-hist-row"><div class="lg-hist-sum">${head}</div></li>`;
        }).join('')}</ul>`;
        return `<section class="lg-sec" aria-labelledby="lgHistT"><h2 class="lg-sec-title" id="lgHistT">Son maçlar</h2>${inner}</section>`;
    }

    function render() {
        const m = S.mount;
        if (!m) return;
        const scr = m.closest('.screen');
        if (scr && scr.hidden) return;
        const y = window.scrollY;
        m.innerHTML = `<div class="lg">${headHtml()}${historyHtml()}${ladderHtml()}${rulesHtml()}</div>`;
        m.querySelectorAll('.lg-bar i').forEach(i => i.style.setProperty('--pct', (i.dataset.pct || 0) + '%'));
        if (!S.scrolled) {
            const cur = m.querySelector('[data-lg-current]');
            if (cur) {
                S.scrolled = true;
                const ladder = cur.closest('.lg-ladder');
                if (ladder && ladder.scrollHeight > ladder.clientHeight) ladder.scrollTop = cur.offsetTop - ladder.clientHeight / 2 + cur.clientHeight / 2;
            }
        } else window.scrollTo(0, y);
    }

    function onShow(info) {
        S.mount = document.getElementById('leaguesMount');
        if (!S.mount) return;
        if (info && info.changed) {
            S.scrolled = false;
            const h = document.getElementById('leaguesTitle');
            if (h) setTimeout(() => { try { h.focus({ preventScroll: true }); } catch (e) { /* yok */ } }, 0);
        }
        render();
        loadConfig(); loadHistory(); loadPosition();
    }

    function init() {
        const gm = NS.game();
        if (!gm || !gm.registerScreen) { setTimeout(init, 60); return; }
        const m = document.getElementById('leaguesMount');
        if (m && !m._lgBound) {
            m._lgBound = true;
            m.addEventListener('click', (e) => {
                const b = e.target.closest('[data-lg]');
                if (!b) return;
                const g = NS.game();
                if (b.dataset.lg === 'signin' && g) g.openAuthSheet('signin');
                else if (b.dataset.lg === 'signup' && g) g.openAuthSheet('signup');
                else if (b.dataset.lg === 'retry-hist') { S.hist = null; S.histAt = 0; render(); loadHistory(); }
            });
        }
        gm.registerScreen('ligler', onShow);
        const a = acc();
        if (a && a.onChange) a.onChange(() => { S.cfg = null; S.pos = null; S.hist = null; S.histUid = null; if (gm.currentScreen === 'ligler') onShow({}); else loadConfig(); });
        loadConfig();
    }

    /** Maçtan ayrılma/pes etme uyarıları için: sunucuda RP v2 açık mı, tur cezası kaç? (yalnızca sunucudan okunduysa) */
    function failPenalty() { const R = rules(); return R.kind === 'v2' && R.source === 'server' ? Math.abs(Number(R.v[V2.fail]) || 0) : null; }
    NS.leaguesView = { render, onShow, rules, failPenalty, loadConfig, invalidate() { S.hist = null; S.histAt = 0; S.pos = null; S.cfg = null; S.cfgAt = 0; S.histUid = null; }, V2_DEFAULTS };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0)); else setTimeout(init, 0);
})(typeof window !== 'undefined' ? window : globalThis);
