/**
 * PsikoVaka Online — Realtime kanal yönetimi (supabase-js v2).
 *  - online:<user_id>  (özel)  kendi çevrimiçi durumum (presence track); arkadaşlarınkini okurum
 *  - room:<room_id>    (özel)  lobi presence (konum) + broadcast: move / emote / say / rematch / profile (avatar değişti → yeniden oku)
 *  - pg-*              (genel) postgres_changes; yetkiyi RLS verir
 * Kanal koparsa/hata verirse kademeli geri çekilmeyle yeniden kurulur; yeniden bağlanınca onResync çağrılır.
 * Bu katmandan gelen hiçbir bilgi otoriter değildir (TASARIM.md §6.2): puan/hazır/kazanan yalnızca tablolardan.
 */
(function (global) {
    'use strict';
    const NS = global.PsikoVakaOnline;

    const live = new Map(); // ad -> kayıt

    function client() { return NS.api.client(); }

    /**
     * Yönetilen kanal. build(ch) içinde .on(...) bağlanır. opts: { private, presenceKey, onStatus, onResync }
     * Dönüş: { name, get channel(), track(p), untrack(), send(ev, p), presence(), leave() }
     */
    function managed(name, opts, build) {
        if (live.has(name)) live.get(name).leave();
        const rec = {
            name, ch: null, closed: false, attempts: 0, timer: null, everSubscribed: false, status: 'connecting',
            lastTrack: null
        };
        const c = client();
        if (!c) return null;

        function open() {
            if (rec.closed) return;
            const cfg = { config: {} };
            if (opts.private) cfg.config.private = true;
            if (opts.presenceKey) cfg.config.presence = { key: opts.presenceKey };
            cfg.config.broadcast = { self: false, ack: false };
            const ch = c.channel(name, cfg);
            rec.ch = ch;
            try { build(ch); } catch (e) { console.warn('[PsikoVakaOnline] kanal kurulum', name, e); }
            ch.subscribe((status, err) => {
                if (rec.closed || rec.ch !== ch) return;
                rec.status = status;
                if (status === 'SUBSCRIBED') {
                    const again = rec.everSubscribed || rec.attempts > 0;
                    rec.everSubscribed = true;
                    rec.attempts = 0;
                    if (rec.lastTrack) ch.track(rec.lastTrack).catch(() => {});
                    if (opts.onStatus) opts.onStatus('live');
                    if (again && opts.onResync) opts.onResync();
                } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
                    if (opts.onStatus) opts.onStatus('down', err);
                    retry();
                }
            });
        }
        function retry() {
            if (rec.closed || rec.timer) return;
            const ch = rec.ch;
            rec.ch = null;
            if (ch) { try { c.removeChannel(ch); } catch (e) { /* yok say */ } }
            const delay = Math.min(15000, 800 * Math.pow(2, rec.attempts++)) + Math.floor(Math.random() * 400);
            rec.timer = setTimeout(() => { rec.timer = null; open(); }, delay);
        }

        rec.track = (payload) => {
            rec.lastTrack = payload;
            if (rec.ch && rec.status === 'SUBSCRIBED') return rec.ch.track(payload).catch(() => {});
            return Promise.resolve();
        };
        rec.untrack = () => { rec.lastTrack = null; if (rec.ch) rec.ch.untrack().catch(() => {}); };
        rec.send = (event, payload) => {
            if (!rec.ch || rec.status !== 'SUBSCRIBED') return false;
            rec.ch.send({ type: 'broadcast', event, payload }).catch(() => {});
            return true;
        };
        rec.presence = () => (rec.ch ? rec.ch.presenceState() : {});
        rec.isLive = () => rec.status === 'SUBSCRIBED';
        rec.leave = () => {
            if (rec.closed) return;
            rec.closed = true;
            clearTimeout(rec.timer);
            const ch = rec.ch; rec.ch = null;
            if (ch) { try { if (rec.lastTrack) ch.untrack(); } catch (e) { /* yok */ } try { c.removeChannel(ch); } catch (e) { /* yok */ } }
            if (live.get(name) === rec) live.delete(name);
        };
        live.set(name, rec);
        open();
        return rec;
    }

    // --------------------------------------------------------- kişisel: çevrimiçi + davet + arkadaşlık
    let me = null, selfCh = null, userPg = null, selfStatus = { status: 'online', room_id: null };

    function startSelf(uid, handlers) {
        stopSelf();
        me = uid;
        selfCh = managed('online:' + uid, { private: true, presenceKey: uid }, () => {});
        if (selfCh) selfCh.track(Object.assign({ user_id: uid, at: new Date().toISOString() }, selfStatus));
        userPg = managed('pg-user-' + uid, { onResync: handlers.onResync, onStatus: (st) => { if (st === 'live' && handlers.onResync) handlers.onResync(); } }, (ch) => {
            ch.on('postgres_changes', { event: '*', schema: 'public', table: 'friendships' }, (p) => handlers.onFriendship && handlers.onFriendship(p));
            ch.on('postgres_changes', { event: '*', schema: 'public', table: 'room_invites', filter: 'invitee_id=eq.' + uid }, (p) => handlers.onInvite && handlers.onInvite(p));
        });
    }
    function setStatus(status, roomId) {
        selfStatus = { status: status || 'online', room_id: roomId || null };
        if (selfCh && me) selfCh.track(Object.assign({ user_id: me, at: new Date().toISOString() }, selfStatus));
    }
    function stopSelf() {
        if (selfCh) selfCh.leave();
        if (userPg) userPg.leave();
        selfCh = userPg = null;
        friendChans.forEach(r => r.leave());
        friendChans.clear();
        friendOnline.clear();
        me = null;
    }

    // --------------------------------------------------------- arkadaşların çevrimiçi durumu
    const friendChans = new Map();
    const friendOnline = new Map(); // id -> { status, room_id } | undefined
    let friendCb = null;
    function watchFriends(ids, cb) {
        friendCb = cb;
        const want = new Set(ids || []);
        friendChans.forEach((rec, id) => { if (!want.has(id)) { rec.leave(); friendChans.delete(id); friendOnline.delete(id); } });
        want.forEach(id => {
            if (friendChans.has(id)) return;
            const rec = managed('online:' + id, { private: true }, (ch) => {
                ch.on('presence', { event: 'sync' }, () => {
                    const st = ch.presenceState();
                    const metas = Object.values(st).flat();
                    const m = metas.find(x => x && x.user_id === id) || metas[0];
                    const prev = friendOnline.get(id);
                    const next = m ? { status: m.status || 'online', room_id: m.room_id || null } : null;
                    if (JSON.stringify(prev || null) !== JSON.stringify(next)) {
                        if (next) friendOnline.set(id, next); else friendOnline.delete(id);
                        if (friendCb) friendCb(id, next);
                    }
                });
            });
            if (rec) friendChans.set(id, rec);
        });
    }
    const friendStatus = (id) => friendOnline.get(id) || null;

    // --------------------------------------------------------- herkese açık lobi listesi
    let publicPg = null;
    function watchPublicRooms(cb) {
        if (publicPg) publicPg.leave();
        publicPg = managed('pg-public-rooms', { onResync: cb }, (ch) => {
            ch.on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: 'visibility=eq.public' }, () => cb());
        });
    }
    function stopPublicRooms() { if (publicPg) publicPg.leave(); publicPg = null; }

    // --------------------------------------------------------- oda
    /**
     * handlers: { onChange(table, payload), onResync(), onPresence(state), onBroadcast(event, payload), onStatus(s) }
     * Dönüş: { track(p), send(ev, p), presence(), leave(), isLive() }
     */
    function joinRoom(roomId, uid, handlers) {
        const tables = ['rooms', 'room_players', 'room_rounds', 'round_players', 'match_pairings', 'match_results'];
        const pg = managed('pg-room-' + roomId, { onResync: handlers.onResync, onStatus: handlers.onStatus }, (ch) => {
            tables.forEach(t => {
                const filter = t === 'rooms' ? 'id=eq.' + roomId : 'room_id=eq.' + roomId;
                ch.on('postgres_changes', { event: '*', schema: 'public', table: t, filter }, (p) => handlers.onChange(t, p));
            });
        });
        const rt = managed('room:' + roomId, { private: true, presenceKey: uid, onResync: handlers.onResync }, (ch) => {
            ch.on('presence', { event: 'sync' }, () => handlers.onPresence && handlers.onPresence(ch.presenceState()));
            ['move', 'emote', 'say', 'rematch', 'profile'].forEach(ev => {
                ch.on('broadcast', { event: ev }, (msg) => handlers.onBroadcast && handlers.onBroadcast(ev, msg && msg.payload));
            });
        });
        return {
            track: (p) => rt && rt.track(p),
            send: (ev, p) => !!(rt && rt.send(ev, p)),
            presence: () => (rt ? rt.presence() : {}),
            isLive: () => !!(rt && rt.isLive()),
            leave: () => { if (pg) pg.leave(); if (rt) rt.leave(); }
        };
    }

    function stopAll() {
        stopSelf();
        stopPublicRooms();
        Array.from(live.values()).forEach(r => r.leave());
    }

    NS.realtime = { startSelf, stopSelf, setStatus, watchFriends, friendStatus, watchPublicRooms, stopPublicRooms, joinRoom, stopAll, _live: live };
})(typeof window !== 'undefined' ? window : globalThis);
