/**
 * PsikoVaka Online — oda deposu ve denetleyicisi.
 * Gerçeğin tek kaynağı get_room_state anlık görüntüsüdür. Realtime olayları yalnızca
 *  (a) güvenli, tekdüze yamalar (round_players tahmin sayısı / bitti) ve
 *  (b) "yeniden oku" tetikleyicisi olarak kullanılır. Sıra dışı gelen olaylar her zaman
 *  sunucudan yeniden okunarak uzlaştırılır (istek sıra numarası: eski yanıt yeniyi ezemez).
 * Zaman geçişleri (TASARIM.md §4): 10 sn'de bir heartbeat; deadline_at ve next_round_at anında advance_if_due.
 */
(function (global) {
    'use strict';
    const NS = global.PsikoVakaOnline;

    const HEARTBEAT_MS = 10000;
    const R = {
        roomId: null, state: null, handle: null,
        presence: {},       // uid -> { x, y, at }
        lastSeenLive: {},   // uid -> ms (presence'te en son görüldüğü an)
        seq: 0, applied: 0,
        timers: [], hbTimer: null,
        bus: NS.util.emitter(),
        removed: false
    };

    const now = () => NS.clock.now();
    const ts = (iso) => (iso ? Date.parse(iso) : NaN);

    // ------------------------------------------------------------ türetilmiş
    function me() { const id = NS.api.myId(); return R.state ? R.state.players.find(p => p.user_id === id) || null : null; }
    function active() { return R.state ? R.state.players.filter(p => !p.left_at) : []; }
    function isHost() { const m = me(); return !!(m && m.is_host); }
    function player(uid) { return R.state ? R.state.players.find(p => p.user_id === uid) || null : null; }
    function myRound() { const id = NS.api.myId(); return R.state && R.state.round_players ? R.state.round_players.find(r => r.user_id === id) || null : null; }

    /** 'lobby' | 'countdown' | 'playing' | 'result' | 'finished' | 'abandoned' | null */
    function phase() {
        const s = R.state;
        if (!s || !s.room) return null;
        const st = s.room.status;
        if (st === 'lobby') return 'lobby';
        if (st === 'finished') return 'finished';
        if (st === 'abandoned') return 'abandoned';
        if (st === 'round_result') return 'result';
        if (st === 'in_round') {
            if (s.round && s.round.closed_at) return 'result';
            if (s.round && now() < ts(s.round.starts_at)) return 'countdown';
            return 'playing';
        }
        return null;
    }

    // ------------------------------------------------------------ yaşam döngüsü
    function open(roomId) {
        if (R.roomId === roomId && R.handle) { refresh(); return; }
        close(true);
        R.roomId = roomId;
        R.removed = false;
        R.presence = {};
        R.lastSeenLive = {};
        const uid = NS.api.myId();
        R.handle = NS.realtime.joinRoom(roomId, uid, {
            onChange,
            onResync: () => refresh(),
            onPresence,
            onBroadcast: (ev, p) => {
                if (!p || !p.user_id || p.user_id === uid) return;
                if (ev === 'move' && isFinite(p.x) && isFinite(p.y)) {
                    R.presence[p.user_id] = Object.assign({}, R.presence[p.user_id], { x: clampPos(p.x), y: clampPos(p.y), at: Date.now() });
                }
                R.bus.emit('broadcast', ev, p);
            },
            onStatus: (s) => R.bus.emit('conn', s)
        });
        R.hbTimer = setInterval(beat, HEARTBEAT_MS);
        document.addEventListener('visibilitychange', onVisible);
        global.addEventListener('online', onVisible);
        refresh();
    }

    function close(silent) {
        clearTimers();
        clearInterval(R.hbTimer); R.hbTimer = null;
        document.removeEventListener('visibilitychange', onVisible);
        global.removeEventListener('online', onVisible);
        if (R.handle) R.handle.leave();
        R.handle = null;
        const was = R.roomId;
        R.roomId = null; R.state = null; R.presence = {};
        refreshSoon.cancel();
        if (NS.realtime) NS.realtime.setStatus('online', null);
        if (was && !silent) R.bus.emit('closed', was);
    }

    async function leave() {
        const id = R.roomId;
        if (!id) return { ok: true };
        const r = await NS.api.leaveRoom(id);
        close();
        return r;
    }

    function onVisible() {
        if (document.hidden || !R.roomId) return;
        beat();
        refresh();
    }

    // ------------------------------------------------------------ okuma ve uygulama
    async function refresh() {
        const id = R.roomId;
        if (!id) return;
        const mySeq = ++R.seq;
        const r = await NS.api.getRoomState(id);
        if (id !== R.roomId || mySeq < R.applied) return;   // eski yanıt
        R.applied = mySeq;
        if (!r.ok) {
            if (r.error.code === 'NOT_MEMBER') { R.removed = true; R.bus.emit('removed', id); close(); }
            else R.bus.emit('error', r.error);
            return;
        }
        apply(r.data);
    }
    const refreshSoon = NS.util.debounce(refresh, 180);

    function apply(snap) {
        const prev = R.state;
        snap.players = snap.players || [];
        snap.round_players = snap.round_players || [];
        snap.my_guesses = snap.my_guesses || [];
        snap.pairings = snap.pairings || [];
        snap.results = snap.results || [];
        R.state = snap;
        // Arkadaş presence'i: oda durumu
        const st = snap.room.status;
        const m = me();
        if (m && !m.left_at && ['lobby', 'in_round', 'round_result'].includes(st)) {
            NS.realtime.setStatus(st === 'lobby' ? 'in_lobby' : 'in_match', snap.room.id);
        } else {
            NS.realtime.setStatus('online', null);
        }
        if (m && m.left_at) { R.removed = true; }
        scheduleTimers();
        R.bus.emit('state', snap, prev);
    }

    function onChange(table, p) {
        const s = R.state;
        if (!s) { refreshSoon(); return; }
        const row = p && p.new;
        if (table === 'round_players' && row && s.room && row.round_no === s.room.current_round) {
            const i = s.round_players.findIndex(x => x.user_id === row.user_id);
            const cur = i >= 0 ? s.round_players[i] : null;
            // tekdüze: bitmiş satır bitmemişe dönemez; tahmin sayısı azalamaz
            if (cur && ((cur.finished && !row.finished) || (row.guess_count < cur.guess_count))) { refreshSoon(); return; }
            if (i >= 0) s.round_players[i] = Object.assign({}, cur, row); else s.round_players.push(row);
            R.bus.emit('state', s, s);
            return;
        }
        if (table === 'rooms' && row) {
            const r = s.room;
            const structural = row.status !== r.status || row.current_round !== r.current_round ||
                row.host_id !== r.host_id || row.next_round_at !== r.next_round_at;
            // ayar/sayı yamaları hemen görünsün
            s.room = Object.assign({}, r, row);
            R.bus.emit('state', s, s);
            if (structural) refresh(); else refreshSoon();
            return;
        }
        refreshSoon();
    }

    // ------------------------------------------------------------ zaman geçişleri
    function clearTimers() { R.timers.forEach(clearTimeout); R.timers = []; }
    function at(iso, fn, extraMs) {
        const ms = NS.clock.msUntil(iso) + (extraMs || 0);
        if (!isFinite(ms)) return;
        R.timers.push(setTimeout(fn, Math.max(0, Math.min(ms, 2147483000))));
    }
    function scheduleTimers() {
        clearTimers();
        const s = R.state;
        if (!s || !s.room) return;
        const id = s.room.id;
        if (s.room.status === 'in_round' && s.round && !s.round.closed_at) {
            at(s.round.starts_at, () => R.bus.emit('state', R.state, R.state), 20);
            at(s.round.deadline_at, () => nudge(id), 250 + Math.random() * 300);
        } else if (s.room.status === 'round_result' && s.room.next_round_at) {
            at(s.room.next_round_at, () => nudge(id), 150 + Math.random() * 350);
        }
    }
    async function nudge(id) {
        if (id !== R.roomId) return;
        const r = await NS.api.advanceIfDue(id);
        if (id !== R.roomId) return;
        if (r.ok && differs(r.data)) refresh();
        else if (!r.ok && (r.error.code === 'NOT_MEMBER' || r.error.code === 'QUICK_TIMEOUT')) refresh();
        else {
            // geçiş henüz olmadıysa (saat farkı) kısa süre sonra yine dene
            const s = R.state;
            if (s && r.ok && ((s.room.status === 'in_round' && r.data.status === 'in_round') || (s.room.status === 'round_result' && r.data.status === 'round_result'))) {
                R.timers.push(setTimeout(() => nudge(id), 1500));
            }
        }
    }
    function differs(brief) {
        const s = R.state;
        if (!s || !brief) return true;
        return brief.status !== s.room.status || brief.current_round !== s.room.current_round ||
            !!(brief.round && s.round && brief.round.closed_at && !s.round.closed_at);
    }
    async function beat() {
        const id = R.roomId;
        if (!id || !R.state) return;
        const st = R.state.room.status;
        if (st === 'finished' || st === 'abandoned') return;
        const m = me();
        if (m && m.left_at) return;
        const r = await NS.api.heartbeat(id);
        if (id !== R.roomId) return;
        if (r.ok) { if (differs(r.data)) refresh(); }
        else if (r.error.code === 'NOT_MEMBER' || r.error.code === 'QUICK_TIMEOUT') refresh();
    }

    // ------------------------------------------------------------ presence (görsel)
    function clampPos(v) { return Math.max(0.04, Math.min(0.96, Number(v))); }
    function onPresence(state) {
        const seen = {};
        Object.keys(state || {}).forEach(k => {
            (state[k] || []).forEach(meta => {
                if (!meta || !meta.user_id) return;
                seen[meta.user_id] = true;
                R.lastSeenLive[meta.user_id] = Date.now();
                const cur = R.presence[meta.user_id] || {};
                // broadcast ile daha yeni konum geldiyse presence'in eski değerini alma
                if (isFinite(meta.x) && isFinite(meta.y) && !(cur.at && cur.at > Date.parse(meta.at || 0))) {
                    R.presence[meta.user_id] = { x: clampPos(meta.x), y: clampPos(meta.y), at: Date.parse(meta.at || 0) || Date.now() };
                }
            });
        });
        R.online = seen;
        R.bus.emit('presence', R.presence, seen);
    }
    /** Görünür bağlantı durumu: presence'te yok ve 6 sn'den uzun süredir görülmedi -> koptu */
    function isDisconnected(uid) {
        if (!R.handle || !R.handle.isLive()) return false;
        if (uid === NS.api.myId()) return false;
        if (R.online && R.online[uid]) return false;
        const last = R.lastSeenLive[uid];
        if (!last) return (R.openedAt || 0) && Date.now() - R.openedAt > 8000;
        return Date.now() - last > 6000;
    }

    const sendMove = NS.util.throttle((x, y) => {
        if (!R.handle) return;
        const uid = NS.api.myId();
        R.handle.send('move', { user_id: uid, x, y });
        trackPresence(x, y);
    }, 350);
    const trackPresence = NS.util.throttle((x, y) => {
        if (!R.handle) return;
        R.handle.track({ user_id: NS.api.myId(), x, y, at: new Date().toISOString() });
    }, 1200);
    function move(x, y) {
        const uid = NS.api.myId();
        x = clampPos(x); y = clampPos(y);
        R.presence[uid] = { x, y, at: Date.now() };
        sendMove(x, y);
    }
    function trackInitial(x, y) {
        if (!R.handle) return;
        const uid = NS.api.myId();
        const cur = R.presence[uid];
        R.handle.track({ user_id: uid, x: cur ? cur.x : x, y: cur ? cur.y : y, at: new Date().toISOString() });
    }
    /** Yayın; kanal henüz bağlı değilse (ör. ilk abonelik yeniden deneniyor) kısa aralıklarla 3 kez daha dener. */
    function send(ev, payload, tries) {
        if (!R.handle) return false;
        const ok = R.handle.send(ev, Object.assign({ user_id: NS.api.myId() }, payload));
        const left = tries == null ? 3 : tries;
        if (!ok && left > 0) { const h = R.handle; setTimeout(() => { if (R.handle === h) send(ev, payload, left - 1); }, 900); }
        return ok;
    }

    // ------------------------------------------------------------ eylemler
    async function setReady(ready) {
        const r = await NS.api.setReady(R.roomId, ready);
        if (r.ok) { const m = me(); if (m) m.is_ready = !!ready; R.bus.emit('state', R.state, R.state); }
        refreshSoon();
        return r;
    }
    async function start() {
        const r = await NS.api.startMatch(R.roomId);
        refresh();
        return r;
    }

    /** Lobideki başlatma kuralı (sunucuyla aynı): dolu + host dışındaki herkes hazır + host. */
    function startGate() {
        const s = R.state;
        if (!s) return { can: false, reason: '' };
        const act = active();
        const cap = s.room.capacity;
        if (act.length < cap) return { can: false, reason: `${act.length}/${cap} oyuncu. Oda dolunca başlar.`, code: 'ROOM_NOT_FULL' };
        const notReady = act.filter(p => !p.is_host && !p.is_ready).length;
        if (notReady > 0) return { can: false, reason: notReady === 1 ? '1 oyuncu hazır değil.' : `${notReady} oyuncu hazır değil.`, code: 'NOT_ALL_READY' };
        if (!isHost()) return { can: false, reason: 'Oda sahibinin başlatması bekleniyor.', code: 'NOT_HOST' };
        return { can: true, reason: 'Herkes hazır.' };
    }

    NS.rooms = {
        get roomId() { return R.roomId; },
        get state() { return R.state; },
        get removed() { return R.removed; },
        get presence() { return R.presence; },
        bus: R.bus,
        open(id) { R.openedAt = Date.now(); open(id); },
        close, leave, refresh, refreshSoon, apply, phase, me, active, isHost, player, myRound, startGate,
        setReady, start, move, trackInitial, send, isDisconnected, beat
    };
})(typeof window !== 'undefined' ? window : globalThis);
