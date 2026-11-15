/**
 * PsikoVaka Online — çekirdek (ad alanı, yardımcılar, sunucu saati, olay yolu, metinler).
 * window.PsikoVakaOnline altında. Paketleyici yok; klasik betik. Bağımlılık: yok.
 * Diğer modüller: api.js, realtime.js, friends.js, rooms.js, views.js, lobby.js, match.js, online.js
 */
(function (global) {
    'use strict';
    const NS = global.PsikoVakaOnline = global.PsikoVakaOnline || {};

    // ------------------------------------------------------------ yardımcılar
    const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, c => ESC[c]); }

    /** Simge: önce ana sprite (#i-ad), yoksa online sprite (#ol-ad). */
    const OWN_ICONS = new Set(['crown', 'hand', 'message', 'wifi-off', 'heart', 'user-plus', 'smile', 'frown', 'laugh', 'bulb', 'bracket', 'party', 'door', 'settings', 'hourglass', 'medal']);
    function icon(name, cls) {
        const id = OWN_ICONS.has(name) ? 'ol-' + name : 'i-' + name;
        return `<svg class="icon${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#${id}"/></svg>`;
    }

    function $(sel, root) { return (root || document).querySelector(sel); }
    function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

    function debounce(fn, ms) {
        let t = null;
        const d = function (...a) { clearTimeout(t); t = setTimeout(() => { t = null; fn.apply(this, a); }, ms); };
        d.cancel = () => { clearTimeout(t); t = null; };
        return d;
    }
    /** Sızdıran (leading) sınırlayıcı: en fazla ms'de bir; son çağrı kaybolmaz. */
    function throttle(fn, ms) {
        let last = 0, t = null, pending = null;
        const run = () => { last = Date.now(); t = null; const a = pending; pending = null; fn.apply(null, a); };
        const th = (...a) => {
            pending = a;
            const wait = ms - (Date.now() - last);
            if (wait <= 0) run();
            else if (!t) t = setTimeout(run, wait);
        };
        th.cancel = () => { clearTimeout(t); t = null; pending = null; };
        return th;
    }
    /** Basit hız sınırı: pencere içinde en fazla n olay. */
    function rateLimiter(n, windowMs) {
        const hits = [];
        return () => {
            const now = Date.now();
            while (hits.length && now - hits[0] > windowMs) hits.shift();
            if (hits.length >= n) return false;
            hits.push(now);
            return true;
        };
    }
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    function fmtClock(sec) {
        sec = Math.max(0, Math.ceil(sec));
        return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
    }

    async function copyText(text) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); return true; }
        } catch (e) { /* aşağıdaki yedek */ }
        try {
            const ta = document.createElement('textarea');
            ta.value = text; ta.setAttribute('readonly', ''); ta.className = 'ol-offscreen';
            document.body.appendChild(ta); ta.select();
            const ok = document.execCommand('copy');
            ta.remove();
            return ok;
        } catch (e) { return false; }
    }

    const reducedMotion = () => !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);

    // ------------------------------------------------------------ sunucu saati
    // RPC yanıtlarındaki server_time ile istemci saat farkı. En kısa gidiş-dönüşlü örnek kazanır.
    const clock = {
        offset: 0, rtt: Infinity, samples: 0,
        sample(serverIso, t0, t1) {
            const s = Date.parse(serverIso);
            if (!isFinite(s)) return;
            const rtt = Math.max(0, t1 - t0);
            const off = s - (t0 + t1) / 2;
            // Eski örnekler zamanla değer kaybeder (uyku/saat değişimi): rtt'yi her örnekte biraz büyüt
            this.rtt = this.rtt * 1.05 + 5;
            if (rtt <= this.rtt || this.samples < 3) { this.offset = off; this.rtt = rtt; }
            this.samples++;
        },
        now() { return Date.now() + this.offset; },
        msUntil(iso) { const t = Date.parse(iso); return isFinite(t) ? t - this.now() : NaN; },
        secUntil(iso) { return this.msUntil(iso) / 1000; }
    };

    // ------------------------------------------------------------ olay yolu
    function emitter() {
        const map = new Map();
        return {
            on(ev, fn) { if (!map.has(ev)) map.set(ev, new Set()); map.get(ev).add(fn); return () => map.get(ev) && map.get(ev).delete(fn); },
            emit(ev, ...a) { (map.get(ev) || []).forEach(fn => { try { fn(...a); } catch (e) { console.warn('[PsikoVakaOnline]', ev, e); } }); },
            clear() { map.clear(); }
        };
    }
    const bus = emitter();

    // ------------------------------------------------------------ metinler
    const T = {
        mode: { duel: 'Düello', ffa: 'Herkes tek', tournament: 'Turnuva' },
        modeSub: {
            duel: 'İki kişi, aynı vakalar.',
            ffa: '2–8 kişi, en yüksek toplam kazanır.',
            tournament: '4 ya da 8 kişi, son kalan kazanır.'
        },
        format: { rounds: 'Tur puanı', hp: 'Can barı', battle: 'Eleme', bracket: 'Eşleşme ağacı' },
        formatSub: {
            rounds: 'Her tur puan toplanır; sonunda en yüksek toplam kazanır.',
            hp: 'İki taraf 600 canla başlar. Turu düşük puanla bitiren farkı can olarak kaybeder.',
            battle: 'Herkes aynı vakayı çözer; her turun sonunda en düşük puanlı elenir.',
            bracket: 'Bire bir eleme ağacı. Kazanan bir üst tura çıkar.'
        },
        target: { diagnosis: 'Tanı', therapy: 'Terapi', pharmacology: 'İlaç', combo: 'Kombo' },
        targetSub: {
            diagnosis: 'DSM-5-TR tanısını bul.',
            therapy: 'Kanıta dayalı terapiyi bul.',
            pharmacology: 'Birinci basamak ilacı bul.',
            combo: 'Sırayla tanı, terapi ve ilaç.'
        },
        targetIcon: { diagnosis: 'stethoscope', therapy: 'shield', pharmacology: 'pill', combo: 'zap' },
        visibility: { private: 'Özel', public: 'Herkese açık' },
        finish: {
            solved: 'Çözdü', failed: 'Çözemedi', gave_up: 'Pes etti', timeout: 'Süre doldu',
            absent: 'Bağlantı koptu', left: 'Ayrıldı', aborted: 'Bitiremedi'
        },
        emotes: { wave: 'El salla', cheer: 'Sevin', think: 'Düşün', sad: 'Üzül', laugh: 'Gül' },
        emoteIcon: { wave: 'hand', cheer: 'party', think: 'bulb', sad: 'frown', laugh: 'laugh' },
        quick: { ready: 'Hazırım!', wait: 'Bir dakika', gg: 'İyi oyunlar', go: 'Hadi başlayalım', gj: 'Tebrikler!', rematch: 'Bir daha?' },
        quickLobby: ['ready', 'wait', 'gg', 'go'],
        quickFinal: ['gg', 'gj', 'rematch']
    };

    /** "Düello · Tur puanı" */
    function roomTitle(room) {
        if (!room) return '';
        return `${T.mode[room.mode] || room.mode} · ${T.format[room.format] || room.format}`;
    }

    // ------------------------------------------------------------ ortam
    function game() { return global.game || null; }
    function toast(msg) { const g = game(); if (g && typeof g.showToast === 'function') g.showToast(msg); }

    let liveEl = null;
    /** Ekran okuyucuya duyuru (lobi/maç olayları). */
    function announce(msg) {
        if (!liveEl) {
            liveEl = document.createElement('div');
            liveEl.className = 'ol-offscreen';
            liveEl.setAttribute('aria-live', 'polite');
            liveEl.setAttribute('role', 'status');
            document.body.appendChild(liveEl);
        }
        liveEl.textContent = '';
        setTimeout(() => { if (liveEl) liveEl.textContent = msg; }, 30);
    }

    /** Ek simgeler (ana sprite'ta olmayanlar), sayfaya bir kez eklenir. */
    function injectSprite() {
        if (document.getElementById('olSprite')) return;
        const s = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
        const sym = (id, body) => `<symbol id="ol-${id}" viewBox="0 0 24 24">${body}</symbol>`;
        const wrap = document.createElement('div');
        wrap.innerHTML = `<svg id="olSprite" class="icon-sprite" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs>
${sym('crown', `<path ${s} d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>`)}
${sym('hand', `<path ${s} d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V5.5a1.5 1.5 0 0 1 3 0V14c0 4-2.5 7-6.5 7S5 18.5 4.2 16.6L3 13.5a1.5 1.5 0 0 1 2.6-1.4L8 15"/>`)}
${sym('message', `<path ${s} d="M4 5h16v11H9l-5 4z"/>`)}
${sym('wifi-off', `<path ${s} d="M3 3l18 18M8.5 16.4a5 5 0 0 1 7 0M5 12.9a10 10 0 0 1 4.3-2.4M19 12.9a10 10 0 0 0-2.6-1.8M2 9.3a15 15 0 0 1 4.2-2.6M22 9.3A15 15 0 0 0 12 5.5c-.7 0-1.4 0-2 .1"/><circle cx="12" cy="19.5" r="1" fill="currentColor" stroke="none"/>`)}
${sym('heart', `<path ${s} d="M12 20s-7.5-4.6-7.5-10A4.4 4.4 0 0 1 12 7.3 4.4 4.4 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>`)}
${sym('user-plus', `<circle ${s} cx="9" cy="8" r="3.5"/><path ${s} d="M2.5 20a6.5 6.5 0 0 1 13 0M19 8v6M16 11h6"/>`)}
${sym('smile', `<circle ${s} cx="12" cy="12" r="9"/><path ${s} d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/>`)}
${sym('frown', `<circle ${s} cx="12" cy="12" r="9"/><path ${s} d="M8.5 16a4.5 4.5 0 0 1 7 0M9 9.5h.01M15 9.5h.01"/>`)}
${sym('laugh', `<circle ${s} cx="12" cy="12" r="9"/><path ${s} d="M7.5 13h9a4.5 4.5 0 0 1-9 0zM8 9l2 1M16 9l-2 1"/>`)}
${sym('bulb', `<path ${s} d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>`)}
${sym('bracket', `<path ${s} d="M3 5h5v5H3M3 14h5v5H3M8 7.5h3v9H8M11 12h4M16 9.5h5v5h-5"/>`)}
${sym('party', `<path ${s} d="M4 20l4.5-12 7.5 7.5zM14 4v2M18 6l-1.5 1.5M20 10h-2M11 3.5l.5 1.5M18.5 2.5l-.3.9"/>`)}
${sym('door', `<path ${s} d="M14 3H6v18h8M14 3l5 2v14l-5 2zM11.5 12h.01"/>`)}
${sym('settings', `<circle ${s} cx="12" cy="12" r="3"/><path ${s} d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>`)}
${sym('hourglass', `<path ${s} d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/>`)}
${sym('medal', `<circle ${s} cx="12" cy="15" r="5"/><path ${s} d="M8.5 10.5L6 3h4l2 4 2-4h4l-2.5 7.5"/>`)}
</defs></svg>`;
        document.body.insertBefore(wrap.firstChild, document.body.firstChild);
    }

    /** Avatar: PsikoVakaAvatar varsa onunla, yoksa boş daire. */
    function avatar(cfg, opts) {
        const A = global.PsikoVakaAvatar;
        if (!A) return '<span class="ol-avatar-fallback"></span>';
        try { return A.render(A.normalize(cfg || {}), opts || {}); } catch (e) { return '<span class="ol-avatar-fallback"></span>'; }
    }
    function leagueBadge(rp, size) {
        const L = global.PsikoVakaLeagues;
        if (!L) return '';
        try { return L.badge(rp || 0, size || 18); } catch (e) { return ''; }
    }
    function leagueName(rp) {
        const L = global.PsikoVakaLeagues;
        try { return L ? L.tierFor(rp || 0).name : ''; } catch (e) { return ''; }
    }

    Object.assign(NS, {
        version: '1.0.0',
        util: { esc, icon, $, $all, debounce, throttle, rateLimiter, clamp, fmtClock, copyText, reducedMotion, emitter },
        clock, bus, T, roomTitle, game, toast, announce, injectSprite, avatar, leagueBadge, leagueName
    });
})(typeof window !== 'undefined' ? window : globalThis);
