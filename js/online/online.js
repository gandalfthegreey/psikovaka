/**
 * PsikoVaka Online — giriş noktası ve yönlendirme.
 * Kendi kendine başlar (DOMContentLoaded, window.game hazır olduktan sonra).
 * Online merkezi #onlineHubMount içine çizilir (yoksa merkez çizilmez; geri kalan yine çalışır).
 * Lobi/geri sayım/sonuç/final tam ekran bir katmanda (#olLayer); oynanan tur oyunun kendi ekranında.
 * #room=KOD bağlantıları: giriş yoksa önce giriş, sonra odaya.
 */
(function (global) {
    'use strict';
    const NS = global.PsikoVakaOnline;
    const { esc, icon } = NS.util;
    const T = NS.T;

    const PENDING_KEY = 'psikovaka_online_pending_room';
    const A = {
        started: false, layer: null, view: null, viewTimer: null, uid: null,
        pendingRematch: null, lastPhase: null, leaving: false,
        challenge: null, chTimer: null
    };

    // ------------------------------------------------------------ düello çağrısı (ajan P): davetin durumunu izle
    function setChallenge(ch) {
        A.challenge = ch;
        clearInterval(A.chTimer); A.chTimer = null;
        if (ch && ch.inviteId && ch.status === 'pending') A.chTimer = setInterval(pollChallenge, 4000);
        if (A.view === 'lobby' && NS.lobby) NS.lobby.update();
    }
    function clearChallenge() { clearInterval(A.chTimer); A.chTimer = null; A.challenge = null; }
    async function pollChallenge() {
        const ch = A.challenge;
        if (!ch || NS.rooms.roomId !== ch.roomId) { clearChallenge(); return; }
        const s = NS.rooms.state;
        if (s && s.room.status !== 'lobby') { clearChallenge(); return; }
        if (s && s.players.some(p => p.user_id === ch.user.id && !p.left_at)) { ch.status = 'joined'; clearInterval(A.chTimer); A.chTimer = null; if (NS.lobby) NS.lobby.update(); return; }
        if (document.hidden) return;
        const r = await NS.api.getInvite(ch.inviteId);
        if (A.challenge !== ch || !r.ok || !r.data[0]) return;
        const row = r.data[0];
        let st = row.status;
        if (st === 'pending' && NS.clock.msUntil(row.expires_at) <= 0) st = 'expired';
        if (st !== ch.status && st !== 'pending') {
            ch.status = st;
            if (st === 'declined') { NS.toast(`${ch.user.username} daveti reddetti.`); NS.announce(`${ch.user.username} daveti reddetti.`); }
            if (st === 'expired') NS.announce('Davetin süresi doldu.');
            if (st !== 'accepted') { clearInterval(A.chTimer); A.chTimer = null; }
            if (NS.lobby) NS.lobby.update();
        }
    }
    async function reinviteChallenge(btn) {
        const ch = A.challenge;
        if (!ch) return;
        if (btn) { btn.disabled = true; btn.classList.add('is-loading'); }
        const r = await NS.api.inviteFriend(ch.roomId, ch.user.id);
        if (btn) { btn.disabled = false; btn.classList.remove('is-loading'); }
        if (r.ok) { ch.inviteId = r.data && r.data.id; ch.status = 'pending'; ch.error = null; NS.toast('Davet yeniden gönderildi.'); }
        else { ch.status = 'error'; ch.error = r.error; }
        setChallenge(ch);
    }

    function account() { return global.PsikoVakaAccount || null; }
    function ready() { const a = account(); return !!(a && a.availability === 'ready' && a.state === 'ready' && NS.api.client()); }

    // ------------------------------------------------------------ katman
    function layer() {
        if (!A.layer || !document.body.contains(A.layer)) {
            A.layer = document.createElement('div');
            A.layer.id = 'olLayer';
            A.layer.className = 'ol-layer';
            A.layer.hidden = true;
            A.layer.setAttribute('role', 'region');
            A.layer.setAttribute('aria-label', 'Online oda');
            A.layer.innerHTML = '<div class="ol-layer-inner" id="olLayerInner"></div>';
            document.body.appendChild(A.layer);
            A.layer.addEventListener('click', onLayerClick);
        }
        return A.layer;
    }
    function layerInner() { return layer().querySelector('#olLayerInner'); }
    function showLayer(on) {
        const l = layer();
        if (l.hidden === !on) return;
        l.hidden = !on;
        document.body.classList.toggle('ol-layer-open', !!on);
        if (on) { try { l.querySelector('#olLayerInner').scrollTop = 0; } catch (e) { /* yok */ } }
    }
    function clearView() {
        clearInterval(A.viewTimer); A.viewTimer = null;
        if (A.view === 'lobby' && NS.lobby) NS.lobby.destroy();
        A.view = null;
    }
    /** Katmanda özel bir görünüm (ör. eksik vaka uyarısı). */
    function showLayerView(name, renderFn) {
        clearView();
        A.view = name;
        showLayer(true);
        const root = layerInner();
        root.innerHTML = '';
        const t = renderFn(root);
        if (t) A.viewTimer = t;
    }

    // ------------------------------------------------------------ yönlendirme (oda fazına göre)
    function route() {
        const s = NS.rooms.state;
        if (!s) return;
        const phase = NS.rooms.phase();
        const mine = NS.rooms.myRound();
        let view = phase;
        if (phase === 'playing') {
            if (!mine) view = 'spectate';
            else if (s.room.format === 'bracket' && mine.finished && NS.match.myPairingDone(s)) view = 'pairing';
            else view = 'play';
        }
        const sigParts = [view, s.room.current_round, s.round && s.round.closed_at ? 1 : 0];
        if (view === 'result' || view === 'spectate' || view === 'pairing') sigParts.push(JSON.stringify([s.round_players.map(r => [r.user_id, r.finished, r.guess_count, r.points]), s.pairings.map(p => p.winner_id), s.room.next_round_at, s.players.map(p => [p.total_score, p.hp, p.eliminated_round])]));
        if (view === 'finished') sigParts.push(s.results.length, JSON.stringify(s.results.map(r => r.rp_after)));
        const sig = JSON.stringify(sigParts);

        if (view === 'play') {
            if (NS.match.isMissingCase()) { A.sig = sig; return; }   // eksik vaka uyarısı katmanda kalır
            if (A.view !== 'play') { clearView(); A.view = 'play'; }
            showLayer(false);
            NS.match.enterRound();
            if (NS.match.isMissingCase()) { A.sig = sig; return; }
            A.sig = sig;
            return;
        }
        // play dışı görünümler: oyun ekranını boşa çıkar
        if (A.view === 'play') NS.match.removeWaitPanel();
        if (view === 'lobby') {
            if (NS.match.active) { NS.match.exit(); }
            if (A.view !== 'lobby') { clearView(); A.view = 'lobby'; layerInner().innerHTML = ''; }
            showLayer(true);
            NS.lobby.render(layerInner());
            A.sig = sig;
            return;
        }
        if (A.view === view && A.sig === sig) return;
        A.sig = sig;
        clearView();
        A.view = view;
        showLayer(true);
        const root = layerInner();
        if (view === 'countdown') A.viewTimer = NS.match.renderCountdown(root);
        else if (view === 'result') A.viewTimer = NS.match.renderResult(root);
        else if (view === 'spectate') A.viewTimer = NS.match.renderSpectate(root, 'spectate');
        else if (view === 'pairing') A.viewTimer = NS.match.renderSpectate(root, 'pairing');
        else if (view === 'finished') { NS.match.exit(); NS.match.renderFinal(root); }
        else if (view === 'abandoned' && s.room.is_quick && s.room.close_reason === 'quick_timeout') {
            NS.match.exit();
            const me = NS.rooms.me() || {};
            root.innerHTML = `<div class="ol-center-view"><div class="ol-card-big">
                <div class="ol-big-fig" aria-hidden="true">${NS.avatar(me.avatar, { size: 96, framed: false, animated: true, emote: 'think' })}</div>
                <h2 class="ol-h2">Şu an kimse yok</h2>
                <p class="ol-muted">${esc(T.mode[s.room.mode])} · ${esc(T.target[s.room.target_type])} için iki dakikada rakip bulunamadı.</p>
                <div class="ol-row-btns ol-row-btns-wrap">
                    <button class="btn btn-primary" type="button" data-ol-v="quick-again">${icon('refresh')}<span>Tekrar dene</span></button>
                    <button class="btn btn-secondary" type="button" data-ol-v="quick-create">${icon('swords')}<span>Oda kur</span></button>
                    <button class="btn btn-secondary" type="button" data-ol-v="quick-invite">${icon('user-plus')}<span>Arkadaş davet et</span></button>
                </div>
                <button class="btn btn-ghost btn-sm" type="button" data-ol-v="exit">Online'a dön</button></div></div>`;
        }
        else if (view === 'abandoned') {
            NS.match.exit();
            root.innerHTML = `<div class="ol-center-view"><div class="ol-card-big"><span class="ol-big-icon">${icon('door')}</span><h2 class="ol-h2">Oda kapandı</h2>
                <p class="ol-muted">Bu odada uzun süre kimseden ses gelmediği için oda kapatıldı. RP verilmedi.</p>
                <div class="ol-row-btns"><button class="btn btn-primary" type="button" data-ol-v="exit">Online'a dön</button></div></div></div>`;
        }
        if (view !== A.lastPhase) {
            const msgs = { countdown: 'Tur başlıyor', result: 'Tur bitti', finished: 'Maç bitti', spectate: 'İzleyici kipindesin' };
            if (msgs[view]) NS.announce(msgs[view]);
        }
        A.lastPhase = view;
    }

    async function onLayerClick(e) {
        const b = e.target.closest('[data-ol-v]');
        if (!b) return;
        const act = b.dataset.olV;
        if (act === 'leave') leaveRoom();
        else if (act === 'exit') exitToHub();
        else if (act === 'leagues') { e.preventDefault(); exitToHub(); location.hash = '#/ligler'; }
        else if (act === 'rematch') rematch(b);
        else if (act === 'quick-again' || act === 'quick-create' || act === 'quick-invite') quickFollowUp(act, b);
        else if (act === 'join-rematch' && A.pendingRematch) { b.disabled = true; const code = A.pendingRematch.code; A.pendingRematch = null; const r = await joinByCode(code, b); if (!r.ok) b.disabled = false; }
    }

    // ------------------------------------------------------------ eylemler
    function inviteLink(code) { return `${location.origin}${location.pathname}#room=${code}`; }

    async function openRoom(roomId) {
        NS.ui.closeAllSheets();
        A.pendingRematch = null;
        A.sig = null;
        NS.rooms.open(roomId);
        showLayer(true);
        if (!NS.rooms.state) {
            clearView();
            layerInner().innerHTML = `<div class="ol-center-view"><div class="ol-gate-loading"><span class="ol-spinner" aria-hidden="true"></span><span>Odaya bağlanılıyor…</span></div></div>`;
        }
    }

    async function createRoom(settings) {
        if (!ready()) return { ok: false, error: { code: 'NO_SESSION', message: 'Online oynamak için giriş yapmalısın.' } };
        const r = await NS.api.createRoom(settings);
        if (r.ok) await openRoom(r.data.id);
        return r;
    }

    async function joinByCode(code, btn, onError) {
        const c = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (!ready()) {
            try { sessionStorage.setItem(PENDING_KEY, c); } catch (e) { /* yok */ }
            const gm = NS.game();
            if (gm && gm.openAuthSheet && account() && account().availability === 'ready') gm.openAuthSheet('signin');
            if (gm && gm.showRoute) gm.showRoute('online');
            NS.toast('Odaya katılmak için önce giriş yap.');
            return { ok: false, error: { code: 'NO_SESSION', message: 'Önce giriş yap.' } };
        }
        if (btn) { btn.disabled = true; btn.classList.add('is-loading'); }
        const r = await NS.api.joinRoom(c);
        if (btn) { btn.disabled = false; btn.classList.remove('is-loading'); }
        if (!r.ok) {
            const msg = r.error.code === 'ALREADY_STARTED' ? 'Bu odada maç başladı; sonradan katılınamaz.' : r.error.message;
            if (onError) onError(msg); else NS.toast(msg);
            return r;
        }
        await openRoom(r.data.id);
        return r;
    }

    async function acceptInvite(inv) {
        if (!ready()) return { ok: false, error: { code: 'NO_SESSION', message: 'Önce giriş yap.' } };
        const r = await NS.api.respondRoomInvite(inv.id, true);
        if (r.ok && r.data && r.data.room) await openRoom(r.data.room.id);
        return r;
    }

    async function leaveRoom() {
        const s = NS.rooms.state;
        if (!s) { exitToHub(); return; }
        const st = s.room.status;
        const me = NS.rooms.me();
        const inMatch = (st === 'in_round' || st === 'round_result') && me && me.played && !me.left_at;
        if (inMatch) {
            const alive = me.eliminated_round == null;
            const pen = NS.leaguesView && NS.leaguesView.failPenalty ? NS.leaguesView.failPenalty() : null;
            // RP v2 (§13.4): kalan her tur (bu tur dahil, bitirmediysen) −pen; hp'de tur sınırı 10, bracket'te yalnızca bu eşleşme
            const mr = NS.rooms.myRound();
            const total = s.room.format === 'hp' ? 10 : s.room.round_count;
            const cur = s.room.current_round || 0;
            const left = s.room.format === 'bracket' ? 1 : Math.max(1, total - cur + (mr && !mr.finished ? 1 : 0));
            const leaveText = pen ? `Ayrılırsan kalan ${left} tur çözülemedi sayılır: −${left * pen} RP. Sıralama primi de alamazsın.` : 'Ayrılırsan maçı hükmen kaybedersin ve bu maçtan RP alamazsın.';
            const ok = await NS.ui.confirm('Maçtan ayrıl', alive ? leaveText : 'İzlemeyi bırakıp çıkmak istiyor musun? Sıralaman değişmez ama RP alamazsın.', 'Ayrıl', { danger: true, cancelLabel: 'Maça dön' });
            if (!ok) return;
        }
        if (st === 'finished' || st === 'abandoned') { exitToHub(); return; }
        A.leaving = true;
        await NS.rooms.leave();
        A.leaving = false;
        exitToHub();
    }

    function exitToHub() {
        clearChallenge();
        NS.match.exit();
        if (NS.rooms.roomId) NS.rooms.close(true);
        clearView();
        showLayer(false);
        A.pendingRematch = null;
        const gm = NS.game();
        if (gm && gm.showRoute) gm.showRoute('online');
        if (location.hash.startsWith('#room=')) { try { history.replaceState(null, '', location.pathname + location.search + '#/online'); } catch (e) { /* yok */ } }
        if (NS.hub && NS.hub.refreshPublicRooms) NS.hub.refreshPublicRooms();
    }

    /** Rövanş: aynı ayarlarla yeni oda, eski odanın kanalında haber ver, arkadaş olanları davet et. */
    async function rematch(btn) {
        const s = NS.rooms.state;
        if (!s) return;
        if (A.pendingRematch) {
            const code = A.pendingRematch.code; A.pendingRematch = null;
            return joinByCode(code, btn);
        }
        const room = s.room;
        const oldHandle = NS.rooms;
        const others = s.players.filter(p => p.played && p.user_id !== NS.api.myId()).map(p => p.user_id);
        btn.disabled = true; btn.classList.add('is-loading');
        const r = await NS.api.createRoom({ mode: room.mode, format: room.format, target: room.target_type, capacity: room.capacity, rounds: room.format === 'rounds' ? room.round_count : null, visibility: room.visibility, timeLimit: room.round_time_limit_sec, seeding: room.bracket_seeding });
        btn.disabled = false; btn.classList.remove('is-loading');
        if (!r.ok) { NS.toast(r.error.message); return; }
        const me = NS.rooms.me() || {};
        oldHandle.send('rematch', { code: r.data.code, username: me.username, avatar: me.avatar });
        // eski kanaldan çıkmadan önce mesajın gitmesine kısa süre tanı
        await new Promise(res => setTimeout(res, 400));
        const friends = new Set((NS.friends.state.friends || []).map(f => f.user.id));
        await openRoom(r.data.id);
        others.filter(id => friends.has(id)).forEach(id => NS.api.inviteFriend(r.data.id, id));
        if (others.some(id => !friends.has(id))) NS.toast('Arkadaşın olmayan oyuncular oda kodu ya da final ekranındaki "Katıl" düğmesiyle gelebilir.');
    }

    /** Hızlı odadan sonra: tekrar eşleş / aynı ayarlarla oda kur / oda kurup arkadaş davet et. */
    async function quickFollowUp(act, btn) {
        const s = NS.rooms.state;
        if (!s) return;
        const mode = s.room.mode === 'ffa' ? 'ffa' : 'duel', target = s.room.target_type;
        exitToHub();
        if (act === 'quick-again') { if (NS.quick) NS.quick.start(mode, target); return; }
        if (act === 'quick-create') { NS.hub.openCreateSheet(Object.assign(NS.ui.defaultsFor(mode, { target }), { target })); return; }
        const r = await createRoom({ mode, format: 'rounds', target, capacity: mode === 'ffa' ? 4 : 2, rounds: 5, visibility: 'private' });
        if (!r.ok) { NS.toast(r.error.message); return; }
        setTimeout(() => { const st = NS.rooms.state; if (st) NS.friends.openInvitePicker(st.room); }, 300);
        void btn;
    }

    // ------------------------------------------------------------ oyun ekranı geri tuşu
    function guardPlayBack() {
        const gm = NS.game();
        const back = gm && gm.dom && gm.dom.btnPlayBack;
        if (back && !back._olGuard) {
            back._olGuard = true;
            back.addEventListener('click', (e) => {
                if (!NS.match.active) return;
                e.stopImmediatePropagation(); e.preventDefault();
                leaveRoom();
            }, true);
        }
        global.addEventListener('popstate', () => {
            if (!NS.match.active || A.view !== 'play') return;
            // uygulama oyun ekranını kapattı: maçta kal, ayrılmayı sor
            setTimeout(() => {
                const g2 = NS.game();
                if (g2) { g2.showScreen('play'); try { history.pushState({ psikovakaPlay: true }, '', location.href); g2.playHistoryPushed = true; } catch (e) { /* yok */ } }
                leaveRoom();
            }, 0);
        });
    }

    // ------------------------------------------------------------ hesap durumu
    async function onAccount(snap) {
        const isReady = ready();
        const uid = snap && snap.user ? snap.user.id : null;
        if (!isReady) {
            if (A.uid) {
                // çıkış yapıldı
                NS.match.exit();
                NS.rooms.close(true);
                clearView(); showLayer(false);
                NS.realtime.stopAll();
                NS.friends.reset();
                clearInterval(A.pollTimer);
                A.uid = null;
            }
            NS.hub.render();
            return;
        }
        if (A.uid === uid) { NS.hub.render(); return; }
        A.uid = uid;
        NS.realtime.startSelf(uid, {
            onFriendship: (p) => NS.friends.onFriendshipChange(p),
            onInvite: (p) => NS.friends.onInviteChange(p),
            onResync: () => { NS.friends.load({ silent: true }); NS.friends.loadInvites(); }
        });
        NS.friends.load({ silent: true });
        NS.friends.loadInvites();
        NS.hub.render();
        // Yedek: Realtime olayı kaçarsa istekler/davetler en geç 30 sn'de görünür
        clearInterval(A.pollTimer);
        A.pollTimer = setInterval(() => { if (!document.hidden && ready()) { NS.friends.load({}); NS.friends.loadInvites(); } }, 30000);
        // kaldığın odaya dön (yenileme / yeniden bağlanma)
        let pending = null;
        try { pending = sessionStorage.getItem(PENDING_KEY); sessionStorage.removeItem(PENDING_KEY); } catch (e) { /* yok */ }
        const hashCode = /^#room=([A-Za-z0-9]{6})/.exec(location.hash || '');
        const cur = await NS.api.getMyCurrentRoom();
        if (A.uid !== uid) return;
        if (cur.ok && cur.data && !NS.rooms.roomId) { await openRoom(cur.data.id); if (!pending && !hashCode) return; if ((pending || (hashCode && hashCode[1].toUpperCase())) === cur.data.code) return; }
        const code = pending || (hashCode && hashCode[1]);
        if (code) joinByCode(code);
    }

    function onHash() {
        const m = /^#room=([A-Za-z0-9]{6})/.exec(location.hash || '');
        if (m) {
            const gm = NS.game();
            if (gm && gm.showRoute) gm.showRoute('online');
            if (NS.rooms.state && NS.rooms.state.room.code === m[1].toUpperCase()) return;
            joinByCode(m[1]);
        }
    }

    // ------------------------------------------------------------ başlangıç
    function init() {
        if (A.started) return;
        const gm = NS.game();
        if (!gm) { setTimeout(init, 50); return; }
        A.started = true;
        NS.injectSprite();
        // Eski arenanın #room= işleyicisini yenisine yönlendir
        gm.joinLiveDuelRoom = (code) => joinByCode(code);
        const mount = document.getElementById('onlineHubMount');
        if (mount) NS.hub.mount(mount);
        guardPlayBack();
        NS.rooms.bus.on('state', () => route());
        NS.rooms.bus.on('broadcast', (ev, p) => {
            if (ev === 'rematch' && p && p.code && NS.rooms.state && NS.rooms.state.room.status === 'finished') {
                A.pendingRematch = { code: p.code, username: p.username || 'Bir oyuncu', avatar: p.avatar };
                NS.match.showRematchOffer(A.pendingRematch);
                NS.announce(`${A.pendingRematch.username} yeni oda kurdu.`);
            }
        });
        NS.rooms.bus.on('removed', () => {
            if (A.leaving) return;
            NS.toast('Odadan çıkarıldın (bağlantı uzun süre koptu).');
            exitToHub();
        });
        NS.rooms.bus.on('error', (e) => { if (e && e.code === 'OFFLINE') NS.toast(e.message); });
        global.addEventListener('hashchange', onHash);
        const acc = account();
        if (acc && acc.onChange) acc.onChange((snap) => onAccount(snap));
        onAccount(acc && acc.snapshot ? acc.snapshot() : null);
        // Online sekmesine her gelişte merkezi tazele
        document.querySelectorAll('[data-route="online"]').forEach(a => a.addEventListener('click', () => setTimeout(() => { if (NS.hub) { NS.hub.render(); NS.hub.refreshPublicRooms(); } }, 0)));
        global.addEventListener('beforeunload', () => { try { NS.realtime.stopAll(); } catch (e) { /* yok */ } });
    }

    NS.app = {
        init, createRoom, openRoom, setChallenge, reinviteChallenge, joinByCode, acceptInvite, leaveRoom, exitToHub, inviteLink, showLayerView, route,
        get pendingRematch() { return A.pendingRematch; },
        get challenge() { return A.challenge && NS.rooms.roomId === A.challenge.roomId ? A.challenge : null; },
        get view() { return A.view; }
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
    else setTimeout(init, 0);
})(typeof window !== 'undefined' ? window : globalThis);
