/**
 * PsikoVaka Online — arkadaşlar: arama/istek/kabul/ret/çıkarma, çevrimiçi noktaları (presence),
 * gelen istek ve oda daveti rozetleri, davet afişi ve "arkadaş davet et" seçicisi.
 */
(function (global) {
    'use strict';
    const NS = global.PsikoVakaOnline;
    const { esc, icon, $ } = NS.util;

    const F = {
        loaded: false, loading: false, error: null,
        friends: [],   // { id (friendship), user: profile, since }
        incoming: [],  // { id, user }
        outgoing: [],  // { id, user }
        invites: [],   // room_invites satırları (bekleyen)
        mount: null,
        seenIncoming: new Set(),
        seenInvites: new Set()
    };

    function me() { return NS.api.myId(); }

    async function load(opts) {
        if (F.loading) { F.reloadAgain = true; return; }
        F.loading = true;
        const r = await NS.api.listFriendships();
        F.loading = false;
        if (!r.ok) { F.error = r.error; F.loaded = true; render(); if (F.reloadAgain) { F.reloadAgain = false; load(); } return; }
        F.error = null;
        const uid = me();
        const friends = [], incoming = [], outgoing = [];
        r.data.forEach(f => {
            const other = f.requester_id === uid ? f.addressee : f.requester;
            if (!other) return;
            const row = { id: f.id, user: other, since: f.updated_at };
            if (f.status === 'accepted') friends.push(row);
            else if (f.status === 'pending' && f.addressee_id === uid) incoming.push(row);
            else if (f.status === 'pending') outgoing.push(row);
        });
        friends.sort((a, b) => (a.user.username || '').localeCompare(b.user.username || '', 'tr'));
        const firstLoad = !F.loaded;
        F.friends = friends; F.incoming = incoming; F.outgoing = outgoing; F.loaded = true;
        // yeni gelen istek bildirimi (ilk yüklemede sessiz)
        incoming.forEach(x => {
            if (!F.seenIncoming.has(x.id)) {
                F.seenIncoming.add(x.id);
                if (!firstLoad && !(opts && opts.silent)) NS.toast(`${x.user.username} sana arkadaşlık isteği gönderdi.`);
            }
        });
        NS.realtime.watchFriends(friends.map(x => x.user.id), () => render());
        render();
        updateBadge();
        NS.bus.emit('friends', F);
        if (F.reloadAgain) { F.reloadAgain = false; load(); }
    }
    const reloadSoon = NS.util.debounce(() => load(), 300);

    async function loadInvites() {
        const r = await NS.api.listPendingInvites();
        if (!r.ok) return;
        F.invites = r.data.filter(x => x.room && ['lobby'].includes(x.room.status));
        F.invites.forEach(showInviteBanner);
        updateBadge();
        render();
    }
    const reloadInvitesSoon = NS.util.debounce(loadInvites, 300);

    function updateBadge() {
        NS.ui.setNavBadge(F.incoming.length + F.invites.length);
    }

    function showInviteBanner(inv) {
        if (F.seenInvites.has(inv.id)) return;
        // Zaten o odadaysam gösterme
        if (NS.rooms && NS.rooms.roomId === inv.room_id) return;
        F.seenInvites.add(inv.id);
        const who = (inv.inviter && inv.inviter.username) || 'Bir arkadaşın';
        const room = inv.room || {};
        const what = room.mode ? `${NS.T.mode[room.mode]} · ${NS.T.format[room.format]} · ${NS.T.target[room.target_type]}` : 'oda';
        const ttl = Math.max(5000, NS.clock.msUntil(inv.expires_at));
        NS.announce(`${who} seni bir odaya davet etti.`);
        NS.ui.banner({
            key: 'inv-' + inv.id, ttlMs: ttl,
            html: `${NS.avatar(inv.inviter && inv.inviter.avatar, { size: 40, framed: true, animated: true })}
                <span class="ol-banner-text"><strong>${esc(who)}</strong> seni odasına çağırıyor<span class="ol-banner-sub">${esc(what)}</span></span>`,
            actions: [{ id: 'no', label: 'Reddet' }, { id: 'yes', label: 'Katıl', kind: 'primary' }],
            async onAction(id, close, btn) {
                btn.disabled = true;
                if (id === 'yes') {
                    const r = await NS.app.acceptInvite(inv);
                    if (!r.ok) { btn.disabled = false; NS.toast(r.error.message); if (['INVITE_EXPIRED', 'INVITE_NOT_FOUND', 'ROOM_NOT_FOUND', 'ALREADY_STARTED', 'ROOM_FULL'].includes(r.error.code)) close(); return; }
                } else {
                    await NS.api.respondRoomInvite(inv.id, false);
                }
                close();
                F.invites = F.invites.filter(x => x.id !== inv.id);
                updateBadge(); render();
            }
        });
    }

    // ------------------------------------------------------------ eylemler
    async function add(username) {
        const v = String(username || '').trim();
        const A = global.PsikoVakaAccount;
        const err = A && A.validateUsername ? A.validateUsername(v) : null;
        if (err) return { ok: false, error: { code: 'USERNAME_INVALID', message: 'Geçerli bir kullanıcı adı yaz.' } };
        const r = await NS.api.sendFriendRequest(v);
        if (r.ok) {
            NS.toast(r.data.status === 'accepted' ? `${v} ile artık arkadaşsınız.` : `${v} kişisine istek gönderildi.`);
            load({ silent: true });
        }
        return r;
    }
    async function respond(fid, accept) {
        const r = await NS.api.respondFriendRequest(fid, accept);
        if (!r.ok) NS.toast(r.error.message);
        load({ silent: true });
        return r;
    }
    async function remove(userId, name) {
        const ok = await NS.ui.confirm('Arkadaşlıktan çıkar', `${name} arkadaş listenden çıkarılsın mı?`, 'Çıkar', { danger: true });
        if (!ok) return;
        const r = await NS.api.removeFriend(userId);
        if (!r.ok) NS.toast(r.error.message);
        load({ silent: true });
    }

    // ------------------------------------------------------------ görünüm
    function statusOf(uid) {
        const s = NS.realtime.friendStatus(uid);
        if (!s) return { cls: 'off', text: 'Çevrimdışı' };
        if (s.status === 'in_match') return { cls: 'busy', text: 'Maçta' };
        if (s.status === 'in_lobby') return { cls: 'lobby', text: 'Lobide' };
        return { cls: 'on', text: 'Çevrimiçi' };
    }

    function friendRow(f, opts) {
        const u = f.user, st = statusOf(u.id);
        const canInvite = opts && opts.inviteRoom;
        return `<li class="ol-friend" data-uid="${esc(u.id)}">
            <span class="ol-friend-av">${NS.avatar(u.avatar, { size: 40, framed: true })}<span class="ol-dot ol-dot-${st.cls}" aria-hidden="true"></span></span>
            <span class="ol-friend-text"><span class="ol-friend-name">${esc(u.username)}</span><span class="ol-friend-sub">${NS.leagueBadge(u.ranked_points, 14)}<span>${esc(st.text)}</span></span></span>
            ${canInvite ? `<button class="btn btn-sm btn-primary" type="button" data-ol-f="invite" ${opts.invited && opts.invited.has(u.id) ? 'disabled' : ''}>${opts.invited && opts.invited.has(u.id) ? 'Davet edildi' : 'Davet et'}</button>` : ''}
            ${opts && opts.manage ? `<button class="icon-btn icon-btn-sm icon-btn-danger" type="button" data-ol-f="remove" aria-label="${esc(u.username)} arkadaşlıktan çıkar">${icon('x')}</button>` : ''}
        </li>`;
    }

    function render() {
        const m = F.mount;
        if (!m || !document.body.contains(m)) return;
        const keepFocus = document.activeElement && m.contains(document.activeElement) ? document.activeElement.id : null;
        const draft = $('#olFriendInput', m) ? $('#olFriendInput', m).value : '';
        const errText = $('#olFriendErr', m) ? $('#olFriendErr', m).textContent : '';
        const online = F.friends.filter(f => NS.realtime.friendStatus(f.user.id));
        const offline = F.friends.filter(f => !NS.realtime.friendStatus(f.user.id));
        m.innerHTML = `
            <form class="ol-friend-add" data-ol-fadd novalidate>
                <label class="ol-offscreen" for="olFriendInput">Kullanıcı adıyla arkadaş ekle</label>
                <div class="ol-friend-add-row">
                    <span class="ol-input-icon">${icon('at')}</span>
                    <input class="form-input" id="olFriendInput" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="20" placeholder="Kullanıcı adı" list="olFriendSuggest" aria-describedby="olFriendErr">
                    <datalist id="olFriendSuggest"></datalist>
                    <button class="btn btn-primary" type="submit">${icon('user-plus')}<span>Ekle</span></button>
                </div>
                <span class="ol-form-error" id="olFriendErr" role="alert"></span>
            </form>
            ${F.error ? `<div class="ol-empty">${icon('alert')}<span>${esc(F.error.message)}</span><button class="btn btn-sm btn-secondary" type="button" data-ol-f="reload">Tekrar dene</button></div>` : ''}
            ${F.incoming.length ? `<div class="ol-subhead">İstekler <span class="ol-count">${F.incoming.length}</span></div><ul class="ol-friend-list">${F.incoming.map(f => `
                <li class="ol-friend is-request" data-fid="${esc(f.id)}">
                    <span class="ol-friend-av">${NS.avatar(f.user.avatar, { size: 40, framed: true })}</span>
                    <span class="ol-friend-text"><span class="ol-friend-name">${esc(f.user.username)}</span><span class="ol-friend-sub">Arkadaşlık isteği</span></span>
                    <button class="btn btn-sm btn-secondary" type="button" data-ol-f="decline">Reddet</button>
                    <button class="btn btn-sm btn-primary" type="button" data-ol-f="accept">Kabul et</button>
                </li>`).join('')}</ul>` : ''}
            ${F.invites.length ? `<div class="ol-subhead">Oda davetleri <span class="ol-count">${F.invites.length}</span></div><ul class="ol-friend-list">${F.invites.map(inv => `
                <li class="ol-friend is-request" data-inv="${esc(inv.id)}">
                    <span class="ol-friend-av">${NS.avatar(inv.inviter && inv.inviter.avatar, { size: 40, framed: true })}</span>
                    <span class="ol-friend-text"><span class="ol-friend-name">${esc(inv.inviter ? inv.inviter.username : 'Arkadaşın')}</span><span class="ol-friend-sub">${esc(inv.room ? NS.T.mode[inv.room.mode] + ' · ' + NS.T.target[inv.room.target_type] : 'Oda')}</span></span>
                    <button class="btn btn-sm btn-secondary" type="button" data-ol-f="inv-no">Reddet</button>
                    <button class="btn btn-sm btn-primary" type="button" data-ol-f="inv-yes">Katıl</button>
                </li>`).join('')}</ul>` : ''}
            ${!F.loaded ? `<div class="ol-skel"></div><div class="ol-skel"></div>` : ''}
            ${F.loaded && !F.friends.length && !F.error ? `<div class="ol-empty">${icon('users')}<span>Henüz arkadaşın yok. Kullanıcı adıyla ekleyebilirsin.</span></div>` : ''}
            ${online.length ? `<div class="ol-subhead">Çevrimiçi <span class="ol-count">${online.length}</span></div><ul class="ol-friend-list">${online.map(f => friendRow(f, { manage: true })).join('')}</ul>` : ''}
            ${offline.length ? `<div class="ol-subhead">Çevrimdışı</div><ul class="ol-friend-list">${offline.map(f => friendRow(f, { manage: true })).join('')}</ul>` : ''}
            ${F.outgoing.length ? `<div class="ol-subhead">Gönderilen istekler</div><ul class="ol-friend-list">${F.outgoing.map(f => `
                <li class="ol-friend is-outgoing" data-uid="${esc(f.user.id)}">
                    <span class="ol-friend-av">${NS.avatar(f.user.avatar, { size: 40, framed: true })}</span>
                    <span class="ol-friend-text"><span class="ol-friend-name">${esc(f.user.username)}</span><span class="ol-friend-sub">Yanıt bekleniyor</span></span>
                    <button class="btn btn-sm btn-ghost" type="button" data-ol-f="cancel">İptal</button>
                </li>`).join('')}</ul>` : ''}`;
        const inp = $('#olFriendInput', m);
        if (inp) inp.value = draft;
        const er = $('#olFriendErr', m); if (er) er.textContent = errText;
        if (keepFocus) { const el = document.getElementById(keepFocus); if (el) el.focus({ preventScroll: true }); }
    }

    function bind(m) {
        if (m._olBound) return;
        m._olBound = true;
        m.addEventListener('submit', async (e) => {
            const f = e.target.closest('[data-ol-fadd]');
            if (!f) return;
            e.preventDefault();
            const inp = $('#olFriendInput', m), err = $('#olFriendErr', m), btn = f.querySelector('button[type="submit"]');
            btn.disabled = true; btn.classList.add('is-loading');
            const r = await add(inp.value);
            btn.disabled = false; btn.classList.remove('is-loading');
            const er2 = $('#olFriendErr', m);
            if (r.ok) { const i2 = $('#olFriendInput', m); if (i2) i2.value = ''; if (er2) er2.textContent = ''; }
            else if (er2) er2.textContent = r.error.message;
        });
        const suggest = NS.util.debounce(async (q) => {
            const r = await NS.api.searchUsers(q);
            const dl = $('#olFriendSuggest', m);
            if (!r.ok || !dl) return;
            const uid = me();
            dl.innerHTML = r.data.filter(p => p.id !== uid).map(p => `<option value="${esc(p.username)}"></option>`).join('');
        }, 250);
        m.addEventListener('input', (e) => {
            if (e.target.id !== 'olFriendInput') return;
            const er = $('#olFriendErr', m); if (er) er.textContent = '';
            suggest(e.target.value);
        });
        m.addEventListener('click', async (e) => {
            const b = e.target.closest('[data-ol-f]');
            if (!b) return;
            const act = b.dataset.olF;
            const li = b.closest('li');
            if (act === 'reload') { load(); return; }
            b.disabled = true;
            if (act === 'accept' || act === 'decline') await respond(li.dataset.fid, act === 'accept');
            else if (act === 'remove' || act === 'cancel') {
                const f = F.friends.concat(F.outgoing).find(x => x.user.id === li.dataset.uid);
                if (act === 'cancel') { const r = await NS.api.removeFriend(li.dataset.uid); if (!r.ok) NS.toast(r.error.message); load({ silent: true }); }
                else await remove(li.dataset.uid, f ? f.user.username : '');
            } else if (act === 'inv-yes' || act === 'inv-no') {
                const inv = F.invites.find(x => x.id === li.dataset.inv);
                if (inv) {
                    if (act === 'inv-yes') { const r = await NS.app.acceptInvite(inv); if (!r.ok) NS.toast(r.error.message); }
                    else await NS.api.respondRoomInvite(inv.id, false);
                    NS.ui.closeBanner('inv-' + inv.id);
                }
                F.invites = F.invites.filter(x => x.id !== li.dataset.inv);
                updateBadge();
                loadInvites();
            }
            if (document.body.contains(b)) b.disabled = false;
        });
    }

    function renderInto(el) {
        if (!el) return;
        F.mount = el;
        bind(el);
        render();
    }

    /** Lobiden "Arkadaş davet et": çevrimiçiler üstte. */
    function openInvitePicker(room) {
        const invited = new Set();
        const inRoom = new Set((NS.rooms.state && NS.rooms.state.players || []).filter(p => !p.left_at).map(p => p.user_id));
        const build = () => {
            const list = F.friends.filter(f => !inRoom.has(f.user.id))
                .sort((a, b) => (NS.realtime.friendStatus(b.user.id) ? 1 : 0) - (NS.realtime.friendStatus(a.user.id) ? 1 : 0));
            if (!F.loaded) return `<div class="ol-skel"></div>`;
            if (!list.length) return `<div class="ol-empty">${icon('users')}<span>${F.friends.length ? 'Bütün arkadaşların zaten odada.' : 'Henüz arkadaşın yok. Online sayfasından kullanıcı adıyla ekleyebilirsin.'}</span></div>`;
            return `<ul class="ol-friend-list">${list.map(f => friendRow(f, { inviteRoom: room, invited })).join('')}</ul>
                <p class="ol-field-note">Davet yalnızca seçtiğin kişiye gider ve 10 dakika geçerlidir.</p>`;
        };
        const sh = NS.ui.sheet({ title: 'Arkadaş davet et', body: build() });
        sh.body.addEventListener('click', async (e) => {
            const b = e.target.closest('[data-ol-f="invite"]');
            if (!b) return;
            const uid = b.closest('li').dataset.uid;
            b.disabled = true; b.classList.add('is-loading');
            const r = await NS.api.inviteFriend(room.id, uid);
            b.classList.remove('is-loading');
            if (r.ok) { invited.add(uid); b.textContent = 'Davet edildi'; }
            else { b.disabled = false; NS.toast(r.error.message); }
        });
        const off = NS.bus.on('friends', () => { if (!sh.closed) sh.body.innerHTML = build(); else off(); });
        return sh;
    }

    function reset() {
        F.loaded = false; F.friends = []; F.incoming = []; F.outgoing = []; F.invites = [];
        F.seenIncoming.clear(); F.seenInvites.clear();
        NS.ui.setNavBadge(0);
        render();
    }

    NS.friends = {
        state: F, load, loadInvites, reloadSoon, reloadInvitesSoon, renderInto, render, openInvitePicker, reset, add, respond,
        onFriendshipChange() { reloadSoon(); },
        onInviteChange(p) { reloadInvitesSoon(); if (p && p.new && p.new.status !== 'pending') NS.ui.closeBanner('inv-' + p.new.id); }
    };
})(typeof window !== 'undefined' ? window : globalThis);
