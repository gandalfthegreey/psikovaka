/**
 * PsikoVaka — Ambiyans (ajan B4, 2026-11-21). Yalnızca süs: hiçbir oyun bilgisi okumaz/göstermez.
 *
 * 1) Renk bulutu arka planı: <body>'nin başına .amb-bg (4 yumuşak radyal gradyan, css/ambiyans.css'te yavaş kayar).
 *    Sekme gizliyken <html>.amb-hidden → animasyon durur.
 * 2) Kenar boşluğu Nöro'ları: geniş masaüstü ekranında (.app-main'in her iki yanında ≥ 160 px boşluk) kenar boşluğunun
 *    altında 1–2 küçük Nöro (boşluk ≥ 270 px ise 2). Sakin etkinlikler (okuma, çay, kestirme, gerinme, düşünme), 20–40 sn'de
 *    bir değişir; ara sıra kısa ve yavaş yürür (yalnızca transform geçişi; requestAnimationFrame döngüsü yok).
 *    Yalnızca ana sayfa, Kütüphane, Profil ve Lig bilgisi ekranlarında; vaka turu, sınıf modu, online katman ve
 *    açık pencere (modal) sırasında gizli. pointer-events yok. Hareket azaltmada duruk poz, yürüme yok.
 *    Giriş yapmış kullanıcının Nöro'su (game.myAvatar) bir tanesi olur; diğerleri oturum boyunca sabit rastgele.
 *
 * API (testler için): window.PsikoVakaAmbiyans = { refresh(), state() }
 */
(function () {
    'use strict';
    const doc = document;
    const root = doc.documentElement;
    const SHOW_ON = { oyna: 1, kutuphane: 1, profil: 1, ligler: 1 };
    const MIN_GUTTER = 160;     // bundan dar kenar boşluğunda Nöro yok
    const TWO_GUTTER = 270;     // bundan geniş kenar boşluğunda iki Nöro
    const EDGE = 12;            // içerik sütunuyla ve pencere kenarıyla arada bırakılan boşluk
    const IDLE_ACTS = ['read', 'tea', 'doze', 'stretch', 'think', null];
    const SPEED = 20;           // px/sn (yavaş gezinti)
    const reduceMq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

    // ------------------------------------------------------------- 1) arka plan
    function mountBg() {
        if (doc.querySelector('.amb-bg')) return;
        const bg = doc.createElement('div');
        bg.className = 'amb-bg';
        bg.setAttribute('aria-hidden', 'true');
        bg.innerHTML = '<span class="amb-blob amb-b1"></span><span class="amb-blob amb-b2"></span><span class="amb-blob amb-b3"></span><span class="amb-blob amb-b4"></span>';
        doc.body.insertBefore(bg, doc.body.firstChild);
    }

    // ------------------------------------------------------------- 2) kenar boşluğu Nöro'ları
    const S = { layer: null, noros: [], key: '', visible: false, hidden: doc.hidden, timer: null };

    function seed() {
        let s = null;
        try { s = sessionStorage.getItem('psikovaka_amb_seed'); } catch (e) { /* yok */ }
        if (!s) {
            s = Math.random().toString(36).slice(2, 10);
            try { sessionStorage.setItem('psikovaka_amb_seed', s); } catch (e) { /* yok */ }
        }
        return s;
    }
    const SEED = seed();
    // Oturum boyunca sabit, Nöro başına ayrı küçük rastgele dizi
    function rng(n) {
        let h = 2166136261;
        const str = SEED + ':' + n;
        for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
        let a = h >>> 0;
        return function () {
            a = (a + 0x6D2B79F5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function ownConfig() {
        const g = window.game;
        if (!g || !g.myAvatar || !doc.body.classList.contains('is-signed-in')) return null;
        return g.myAvatar;
    }

    function shouldShow() {
        const g = window.game, b = doc.body;
        if (!g || !window.PsikoVakaAvatar || S.hidden) return false;
        if (!SHOW_ON[g.currentScreen]) return false;
        if (b.classList.contains('is-playing') || b.classList.contains('sinif-open') || b.classList.contains('ol-layer-open') ||
            b.classList.contains('modal-open') || b.classList.contains('ol-sheet-open')) return false;
        if (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches) return false;
        return true;
    }

    /** Sol/sağ boş bant: [x0, x1] (pencere koordinatı). İçerik sütunu = .app-main (dolgusu dahil). */
    function gutters() {
        const main = doc.getElementById('appMain') || doc.querySelector('.app-main');
        if (!main) return null;
        const r = main.getBoundingClientRect();
        const vw = root.clientWidth; // kaydırma çubuğu hariç
        const left = { x0: EDGE, x1: Math.floor(r.left) - EDGE };
        const right = { x0: Math.ceil(r.right) + EDGE, x1: vw - EDGE };
        const wl = Math.floor(r.left), wr = Math.floor(vw - r.right);
        return { left, right, wl, wr, w: Math.min(wl, wr), vw };
    }

    function clearNoros() {
        S.noros.forEach(n => { clearTimeout(n.t); });
        S.noros = [];
        if (S.layer) S.layer.innerHTML = '';
    }

    function layer() {
        if (S.layer) return S.layer;
        const l = doc.createElement('div');
        l.className = 'amb-margin';
        l.setAttribute('aria-hidden', 'true');
        l.hidden = true;
        doc.body.appendChild(l);
        S.layer = l;
        return l;
    }

    function build() {
        const g = gutters();
        const AV = window.PsikoVakaAvatar;
        if (!g || g.w < MIN_GUTTER) { clearNoros(); S.key = ''; return false; }
        const per = g.w >= TWO_GUTTER ? 2 : 1;
        const size = g.w >= 300 ? 72 : g.w >= 220 ? 64 : 56;
        const own = ownConfig();
        const key = [g.vw, g.wl, g.wr, per, size, own ? JSON.stringify(own) : '-'].join('|');
        if (key === S.key && S.noros.length) return true;
        clearNoros();
        S.key = key;
        const l = layer();
        const bands = [];
        [['left', g.left], ['right', g.right]].forEach(([side, b]) => {
            const w = b.x1 - b.x0;
            if (per === 1) bands.push({ side, x0: b.x0, x1: b.x1 });
            else {
                const half = Math.floor(w / 2);
                bands.push({ side, x0: b.x0, x1: b.x0 + half - 4 });
                bands.push({ side, x0: b.x0 + half + 4, x1: b.x1 });
            }
        });
        const reduce = reduceMq.matches;
        bands.forEach((band, i) => {
            const rnd = rng(i);
            // Kullanıcının Nöro'su: sol bandın içe yakın olanı (içerik sütununa en yakın sol bant)
            const isOwn = own && i === (per === 1 ? 0 : 1);
            const cfg = isOwn ? own : AV.randomConfig('amb-' + SEED + '-' + i);
            const span = Math.max(0, band.x1 - band.x0 - size);
            const x = band.x0 + Math.round(span * (0.2 + rnd() * 0.6));
            const act = IDLE_ACTS[Math.floor(rnd() * IDLE_ACTS.length)];
            const facing = 'front';
            const el = doc.createElement('div');
            el.className = 'amb-noro' + (reduce ? '' : ' is-in');
            el.dataset.side = band.side;
            el.dataset.own = isOwn ? '1' : '0';
            el.innerHTML = AV.render(cfg, { size, framed: false, animated: !reduce, activity: act, facing });
            const bottom = 10 + Math.round(rnd() * 6);
            el.style.transform = `translate3d(${x}px, ${-bottom}px, 0)`;
            l.appendChild(el);
            const n = { el, band, size, x, bottom, rnd, act, walking: false, t: null };
            S.noros.push(n);
            if (!reduce) schedule(n, 8000 + rnd() * 22000);
        });
        return true;
    }

    function schedule(n, ms) {
        clearTimeout(n.t);
        n.t = setTimeout(() => step(n), ms);
    }

    /** Bir sonraki davranış: yeni etkinlik ya da kısa yürüyüş. */
    function step(n) {
        if (!S.visible || S.hidden || !n.el.isConnected) return;
        const AV = window.PsikoVakaAvatar;
        const span = Math.max(0, n.band.x1 - n.band.x0 - n.size);
        if (span > 36 && n.rnd() < 0.45) {
            // kısa yürüyüş: 30 px … bandın tamamı, yön seyahat yönü
            let target = n.band.x0 + Math.round(n.rnd() * span);
            if (Math.abs(target - n.x) < 30) target = n.x + (n.x - n.band.x0 > span / 2 ? -1 : 1) * Math.min(span, 30 + n.rnd() * 40);
            target = Math.max(n.band.x0, Math.min(n.band.x0 + span, Math.round(target)));
            const dist = Math.abs(target - n.x);
            const dur = dist / SPEED;
            const facing = target > n.x ? 'right' : 'left';
            AV.setPose(n.el, { activity: null, facing, walking: true });
            n.walking = true;
            // önce dönsün (220 ms), sonra yürüsün
            n.t = setTimeout(() => {
                n.el.style.transitionDuration = dur.toFixed(2) + 's';
                n.el.style.transform = `translate3d(${target}px, ${-n.bottom}px, 0)`;
                n.x = target;
                n.t = setTimeout(() => arrive(n), dur * 1000 + 60);
            }, 240);
        } else {
            let act = IDLE_ACTS[Math.floor(n.rnd() * IDLE_ACTS.length)];
            if (act === n.act) act = IDLE_ACTS[(IDLE_ACTS.indexOf(act) + 1) % IDLE_ACTS.length];
            n.act = act;
            AV.setPose(n.el, { activity: act, facing: 'front', walking: false });
            schedule(n, 20000 + n.rnd() * 20000);
        }
    }
    function arrive(n) {
        const AV = window.PsikoVakaAvatar;
        n.walking = false;
        n.el.style.transitionDuration = '0s';
        AV.setPose(n.el, { walking: false });
        n.t = setTimeout(() => {
            if (!n.el.isConnected) return;
            AV.setPose(n.el, { facing: 'front' });
            let act = IDLE_ACTS[Math.floor(n.rnd() * IDLE_ACTS.length)];
            n.act = act;
            AV.setPose(n.el, { activity: act });
            schedule(n, 20000 + n.rnd() * 20000);
        }, 200);
    }

    function pauseAll(on) {
        if (S.layer) S.layer.classList.toggle('nv-paused', !!on);
        if (on) S.noros.forEach(n => { clearTimeout(n.t); if (n.walking) freeze(n); });
        else if (!reduceMq.matches) S.noros.forEach(n => schedule(n, 4000 + n.rnd() * 12000));
    }
    /** Yürürken durdurulursa o anki konumda bırak (geçişi kes). */
    function freeze(n) {
        const m = getComputedStyle(n.el).transform;
        let x = n.x;
        const mm = /matrix\(([^)]+)\)/.exec(m);
        if (mm) x = parseFloat(mm[1].split(',')[4]) || x;
        n.el.style.transitionDuration = '0s';
        n.el.style.transform = `translate3d(${Math.round(x)}px, ${-n.bottom}px, 0)`;
        n.x = Math.round(x);
        n.walking = false;
        window.PsikoVakaAvatar.setPose(n.el, { walking: false, facing: 'front' });
    }

    function refresh() {
        const want = shouldShow() && window.innerWidth >= 1200;
        if (!want) {
            if (S.visible) { S.visible = false; pauseAll(true); }
            if (S.layer) S.layer.hidden = true;
            return;
        }
        const ok = build();
        layer().hidden = !ok;
        if (ok && !S.visible) { S.visible = true; pauseAll(false); }
        if (!ok) S.visible = false;
    }

    let rq = 0;
    function queue() {
        if (rq) return;
        rq = requestAnimationFrame(() => { rq = 0; refresh(); });
    }

    function onVisibility() {
        S.hidden = doc.hidden;
        root.classList.toggle('amb-hidden', S.hidden);
        if (S.hidden) { S.visible = false; pauseAll(true); } else queue();
    }

    function init() {
        mountBg();
        root.classList.toggle('amb-hidden', !!doc.hidden);
        doc.addEventListener('visibilitychange', onVisibility);
        doc.addEventListener('psikovaka:playstate', queue);
        window.addEventListener('hashchange', queue);
        window.addEventListener('psikovaka:profile-saved', () => { S.key = ''; queue(); });
        let rt = 0;
        window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(queue, 150); });
        if (reduceMq.addEventListener) reduceMq.addEventListener('change', () => { S.key = ''; queue(); });
        // body sınıfları (is-playing, sinif-open, ol-layer-open, modal-open, is-signed-in) değişince
        if (typeof MutationObserver === 'function') {
            new MutationObserver(queue).observe(doc.body, { attributes: true, attributeFilter: ['class'] });
        }
        queue();
    }

    window.PsikoVakaAmbiyans = {
        refresh: () => { S.key = ''; refresh(); },
        state: () => ({ visible: S.visible, count: S.noros.length, noros: S.noros.map(n => ({ side: n.band.side, x: n.x, size: n.size, act: n.act, walking: n.walking, own: n.el.dataset.own === '1', rect: n.el.getBoundingClientRect().toJSON() })) }),
        _step: (i) => { const n = S.noros[i]; if (n) step(n); }
    };

    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
    else init();
})();
