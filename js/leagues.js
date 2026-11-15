/**
 * PsikoVaka — Lig tablosu (tek kaynak). Lig adları yalnızca istemcide hesaplanır; sunucu yalnızca RP tutar.
 *
 * Bronz, Gümüş, Altın, Platin, Elmas: her biri 3 kademe ("Altın 1" en düşük, "Altın 3" en yüksek), her kademe 100 RP.
 * Uzman (1500+) ve Kahin (2000+) tek kademe. Yeni hesap 250 RP = Bronz 3.
 *
 * API: window.PsikoVakaLeagues
 *   TIERS                 [{ id, league, leagueName, level, name, min, max, color }]  (17 kademe, artan)
 *   tierFor(rp)           { ...kademe, next: kademe|null, toNext: RP|null, pct: 0-100 }
 *   progressText(rp)      "Altın 3'e 40 RP kaldı" | "En üst ligdesin"
 *   badge(rp, size)       küçük özgün SVG amblem (lig şekli + 1-3 kademe noktası), aria-hidden
 */
(function (global) {
    'use strict';

    const LEAGUES = [
        { id: 'bronz', name: 'Bronz', color: '#c27a43', dark: '#6e3f1c', levels: 3 },
        { id: 'gumus', name: 'Gümüş', color: '#b4bfcf', dark: '#566174', levels: 3 },
        { id: 'altin', name: 'Altın', color: '#f0c33c', dark: '#8a6510', levels: 3 },
        { id: 'platin', name: 'Platin', color: '#57cdbf', dark: '#1d6e66', levels: 3 },
        { id: 'elmas', name: 'Elmas', color: '#6fa8ff', dark: '#2a4f9a', levels: 3 },
        { id: 'uzman', name: 'Uzman', color: '#a879ff', dark: '#52309c', levels: 1 },
        { id: 'kahin', name: 'Kahin', color: '#ff5f86', dark: '#8f1f43', levels: 1 }
    ];

    const TIERS = [];
    let rp = 0;
    LEAGUES.forEach(L => {
        for (let lv = 1; lv <= L.levels; lv++) {
            const min = L.id === 'kahin' ? 2000 : rp;
            const span = L.id === 'uzman' ? 500 : 100;
            TIERS.push({
                id: L.levels > 1 ? `${L.id}${lv}` : L.id,
                league: L.id,
                leagueName: L.name,
                level: L.levels > 1 ? lv : 0,
                name: L.levels > 1 ? `${L.name} ${lv}` : L.name,
                min,
                max: L.id === 'kahin' ? Infinity : min + span - 1,
                color: L.color,
                dark: L.dark
            });
            rp = min + span;
        }
    });

    function clean(v) {
        const n = Math.floor(Number(v));
        return Number.isFinite(n) && n > 0 ? n : 0;
    }
    function tierFor(value) {
        const r = clean(value);
        let i = 0;
        for (let k = 0; k < TIERS.length; k++) if (r >= TIERS[k].min) i = k;
        const t = TIERS[i];
        const next = TIERS[i + 1] || null;
        const toNext = next ? next.min - r : null;
        const pct = next ? Math.max(0, Math.min(100, Math.round(((r - t.min) / (next.min - t.min)) * 100))) : 100;
        return Object.assign({}, t, { rp: r, next: next ? Object.assign({}, next) : null, toNext, pct });
    }
    // Türkçe yönelme eki: "Altın 1'e", "Altın 2'ye", "Uzman'a", "Kahin'e"
    function dative(name) {
        const last = name.trim().split(' ').pop();
        if (last === '1' || last === '3') return `${name}'e`;
        if (last === '2') return `${name}'ye`;
        if (last === 'Uzman') return `${name}'a`;
        return `${name}'e`;
    }
    function progressText(value) {
        const t = tierFor(value);
        if (!t.next) return 'En üst ligdesin';
        return `${dative(t.next.name)} ${t.toNext} RP kaldı`;
    }

    // Amblem: 0 0 24 24; lige göre şekil, kademe kadar nokta
    const SHAPES = {
        shield: 'M12 2.2L20 5v6.2c0 5-3.4 8.6-8 10.6C7.4 19.8 4 16.2 4 11.2V5z',
        gem: 'M7 3h10l4.5 5.5L12 21.5 2.5 8.5z',
        star: 'M12 2l2.9 6.2 6.8.8-5 4.6 1.3 6.7L12 17l-6 3.3 1.3-6.7-5-4.6 6.8-.8z',
        eye: 'M12 2.5L21.5 12 12 21.5 2.5 12z'
    };
    function badge(value, size) {
        const t = tierFor(value);
        const s = Math.max(12, Math.round(Number(size) || 20));
        let shape = SHAPES.shield;
        if (t.league === 'elmas') shape = SHAPES.gem;
        else if (t.league === 'uzman') shape = SHAPES.star;
        else if (t.league === 'kahin') shape = SHAPES.eye;
        let inner = '';
        if (t.league === 'platin') {
            inner = `<path d="M12 6l4 2.6v4.8L12 16l-4-2.6V8.6z" fill="#fff" opacity=".35"/>`;
        } else if (t.league === 'elmas') {
            inner = `<path d="M7 3l5 18.5L17 3M2.5 8.5h19" fill="none" stroke="#fff" stroke-width="1" opacity=".45"/>`;
        } else if (t.league === 'kahin') {
            inner = `<path d="M6.5 12q5.5-5 11 0q-5.5 5-11 0z" fill="#fff"/><circle cx="12" cy="12" r="2.2" fill="${t.dark}"/>`;
        } else if (t.league !== 'uzman') {
            inner = `<path d="M12 4.6L17.8 6.6v4.6c0 3.6-2.4 6.3-5.8 7.9" fill="none" stroke="#fff" stroke-width="1.2" opacity=".35"/>`;
        }
        let pips = '';
        if (t.level > 0) {
            const xs = t.level === 1 ? [12] : t.level === 2 ? [10, 14] : [8.4, 12, 15.6];
            pips = xs.map(x => `<circle cx="${x}" cy="11.4" r="1.55" fill="#fff" stroke="${t.dark}" stroke-width=".8"/>`).join('');
        }
        return `<svg class="league-badge league-${t.league}" viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true" focusable="false">` +
            `<path d="${shape}" fill="${t.color}" stroke="${t.dark}" stroke-width="1.4" stroke-linejoin="round"/>${inner}${pips}</svg>`;
    }

    const api = { LEAGUES, TIERS, tierFor, progressText, badge };
    global.PsikoVakaLeagues = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
