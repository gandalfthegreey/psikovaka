/**
 * PsikoVaka Online — Hızlı eşleşme (TASARIM.md §13.2, migration 0003).
 *  - Online merkezinde "Hızlı eşleş" kartı (hedef + Düello/Herkes tek). Sunucuda quick_match yoksa kart gizli:
 *    destek game_config'teki quick_round_count anahtarından anlaşılır (0003 ekler); RPC yine de PGRST202 dönerse kart kapanır.
 *  - Arama ekranı = hızlı odanın lobisi (lobby.js "is-quick" görünümü: kendi Nöro'n, boş yerler, geçen süre, Vazgeç).
 *    Oda dolunca sunucu maçı kendisi başlatır; istemci normal geri sayım → maç akışına geçer.
 *  - QUICK_TIMEOUT: kalp atışı { ok:false, error:'QUICK_TIMEOUT' } döner, oda 'abandoned' + close_reason 'quick_timeout'
 *    olur; online.js bunu "Şu an kimse yok" ekranıyla gösterir (tekrar dene / oda kur / arkadaş davet et).
 *  - ALREADY_IN_ROOM: sunucunun verdiği oda koduna dönmeyi önerir.
 *  - Sekme kapanırken hâlâ aranıyorsa leave_room (keepalive istek) gönderilir.
 */
(function (global) {
    'use strict';
    const NS = global.PsikoVakaOnline;
    const { esc, icon } = NS.util;
    const T = NS.T;
    const LAST_KEY = 'psikovaka_online_last_quick';

    const Q = { supported: null, probing: false, busy: false, token: null };

    function last() {
        try { const v = JSON.parse(localStorage.getItem(LAST_KEY) || 'null'); if (v && T.target[v.target] && (v.mode === 'duel' || v.mode === 'ffa')) return v; } catch (e) { /* yok */ }
        return { mode: 'duel', target: 'diagnosis' };
    }
    function save(v) { try { localStorage.setItem(LAST_KEY, JSON.stringify(v)); } catch (e) { /* yok */ } }

    /** Sunucu hızlı eşleşmeyi destekliyor mu? (bir kez sorar) */
    async function probe() {
        if (Q.supported != null || Q.probing) return Q.supported;
        if (!NS.api.isSupported('quick_match')) { Q.supported = false; return false; }
        Q.probing = true;
        const r = await NS.api.getConfig();
        Q.probing = false;
        if (!r.ok) return null;  // bilinmiyor: sonra yine sorulur
        Q.supported = r.data.some(x => x.key === 'quick_round_count');
        if (NS.hub) renderCard();
        return Q.supported;
    }

    function cardHtml() {
        const v = last();
        const chips = ['diagnosis', 'therapy', 'pharmacology', 'combo'].map(t =>
            `<label class="ol-chip${t === v.target ? ' is-checked' : ''}"><input type="radio" name="qtarget" value="${t}" ${t === v.target ? 'checked' : ''}><span>${esc(T.target[t])}</span></label>`).join('');
        const modes = [['duel', 'Düello', '2 kişi'], ['ffa', 'Herkes tek', '4 kişi']].map(([m, l, n]) =>
            `<label class="ol-qmode${m === v.mode ? ' is-checked' : ''}"><input type="radio" name="qmode" value="${m}" ${m === v.mode ? 'checked' : ''}><span class="ol-qmode-t">${l}</span><span class="ol-qmode-n">${n}</span></label>`).join('');
        return `<div class="ol-quick-head"><span class="ol-cta-icon">${icon('zap')}</span>
                <span class="ol-cta-text"><h2 class="ol-cta-title ol-quick-title" id="olQuickT">Hızlı eşleş</h2><span class="ol-cta-sub">Rastgele rakiplerle 3 tur. Oda dolunca kendiliğinden başlar.</span></span></div>
            <div class="ol-quick-opts">
                <div class="ol-chips" role="radiogroup" aria-label="Hedef">${chips}</div>
                <div class="ol-qmodes" role="radiogroup" aria-label="Mod">${modes}</div>
            </div>
            <button class="btn btn-primary btn-lg ol-quick-go" type="button" data-ol-q="go">${icon('zap')}<span>Eşleş</span></button>
            <p class="ol-form-error" id="olQuickErr" role="alert"></p>`;
    }
    function renderCard() {
        const el = document.getElementById('olQuick');
        if (!el) return;
        if (Q.supported !== true) { el.hidden = true; if (Q.supported == null) probe(); return; }
        if (!el.dataset.built) { el.innerHTML = cardHtml(); el.dataset.built = '1'; }
        el.hidden = false;
    }
    function bindCard(mount) {
        if (mount._olQBound) return;
        mount._olQBound = true;
        mount.addEventListener('change', (e) => {
            const card = e.target.closest('#olQuick');
            if (!card) return;
            card.querySelectorAll('.ol-chip, .ol-qmode').forEach(l => { const i = l.querySelector('input'); l.classList.toggle('is-checked', !!(i && i.checked)); });
            save(readCard(card));
        });
        mount.addEventListener('click', (e) => {
            const b = e.target.closest('[data-ol-q="go"]');
            if (!b) return;
            const card = b.closest('#olQuick');
            const v = readCard(card);
            save(v);
            start(v.mode, v.target, b, (msg) => { const er = card.querySelector('#olQuickErr'); if (er) er.textContent = msg; });
        });
    }
    function readCard(card) {
        const t = card.querySelector('input[name="qtarget"]:checked');
        const m = card.querySelector('input[name="qmode"]:checked');
        return { target: t ? t.value : 'diagnosis', mode: m ? m.value : 'duel' };
    }

    /** quick_match → odaya gir (arama ekranı ya da doğrudan geri sayım). */
    async function start(mode, target, btn, onError) {
        if (Q.busy) return { ok: false };
        Q.busy = true;
        if (btn) { btn.disabled = true; btn.classList.add('is-loading'); }
        const r = await NS.api.quickMatch(mode, target);
        if (btn) { btn.disabled = false; btn.classList.remove('is-loading'); }
        Q.busy = false;
        if (r.ok) {
            const er = document.getElementById('olQuickErr'); if (er) er.textContent = '';
            await NS.app.openRoom(r.data.room_id || (r.data.room && r.data.room.id));
            NS.announce(r.data.status === 'in_round' ? 'Rakip bulundu. Maç başlıyor.' : 'Rakip aranıyor.');
            return r;
        }
        const c = r.error.code;
        if (c === 'UNSUPPORTED') { Q.supported = false; renderCard(); NS.toast('Hızlı eşleşme şu an kullanılamıyor.'); return r; }
        if (c === 'ALREADY_IN_ROOM') { alreadyInRoom(r.error.detail); return r; }
        if (onError) onError(r.error.message); else NS.toast(r.error.message);
        return r;
    }

    function alreadyInRoom(code) {
        const clean = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
        NS.ui.sheet({
            title: 'Zaten bir odadasın',
            body: `<p class="ol-sheet-text">Yeni bir eşleşme aramadan önce bulunduğun odadan çıkmalısın${clean.length === 6 ? ` (oda <strong class="ol-mono">${esc(clean)}</strong>)` : ''}.</p>`,
            actions: [{ id: 'back', label: 'Odaya dön', kind: 'primary', icon: 'arrow-right' }],
            async onAction(id, sh) {
                sh.close(true);
                if (clean.length === 6) { NS.app.joinByCode(clean); return; }
                const cur = await NS.api.getMyCurrentRoom();
                if (cur.ok && cur.data) NS.app.openRoom(cur.data.id); else NS.toast('Oda bulunamadı. Sayfayı yenile.');
            }
        });
    }

    // ------------------------------------------------------------ sekme kapanırken aramadan çık
    function searching() { const s = NS.rooms.state; return !!(s && s.room && s.room.is_quick && s.room.status === 'lobby'); }
    async function cacheToken() {
        try {
            const c = NS.api.client();
            if (!c || !c.auth) return;
            const { data } = await c.auth.getSession();
            Q.token = data && data.session ? data.session.access_token : null;
        } catch (e) { /* yok */ }
    }
    function leaveOnUnload() {
        if (!searching() || !Q.token || typeof PSIKOVAKA_SUPABASE === 'undefined') return;
        try {
            fetch(`${PSIKOVAKA_SUPABASE.url}/rest/v1/rpc/leave_room`, {
                method: 'POST', keepalive: true,
                headers: { 'content-type': 'application/json', apikey: PSIKOVAKA_SUPABASE.publishableKey, authorization: `Bearer ${Q.token}` },
                body: JSON.stringify({ p_room_id: NS.rooms.state.room.id })
            });
        } catch (e) { /* yok */ }
    }

    function init() {
        NS.rooms.bus.on('state', () => { if (searching()) cacheToken(); });
        global.addEventListener('pagehide', leaveOnUnload);
    }

    NS.quick = {
        init, probe, renderCard, bindCard, start, alreadyInRoom, searching,
        get supported() { return Q.supported; },
        reset() { Q.supported = null; const el = document.getElementById('olQuick'); if (el) { el.hidden = true; delete el.dataset.built; } }
    };
    init();
})(typeof window !== 'undefined' ? window : globalThis);
