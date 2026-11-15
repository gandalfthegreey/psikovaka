/**
 * PsikoVaka Online — sunucu sözleşmesinin (supabase/TASARIM.md §7) ince sarmalayıcıları.
 * Hiçbir yöntem hata fırlatmaz: { ok, data } ya da { ok:false, error:{ code, message } } döner (account.js ile aynı).
 * Sunucu saatini (server_time) her yanıttan örnekler (NS.clock).
 */
(function (global) {
    'use strict';
    const NS = global.PsikoVakaOnline;

    const EXTRA_MESSAGES = {
        UNSUPPORTED: 'Bu özellik sunucuda henüz açık değil.',
        NO_SESSION: 'Online oynamak için giriş yapmalısın.',
        CASE_MISSING: 'Sunucunun seçtiği vaka bu sürümde yok. Sayfayı yenile.',
        INVITE_EXPIRED: 'Davetin süresi dolmuş.',
        ROOM_NOT_FOUND: 'Oda bulunamadı ya da kapandı.',
        ALREADY_STARTED: 'Maç başladı; sonradan katılınamaz.',
        NOT_FULL_CODE: 'Oda kodu 6 karakter olmalı.'
    };

    function acc() { return global.PsikoVakaAccount || null; }
    function client() {
        const A = acc();
        return A && typeof A.getClient === 'function' ? A.getClient() : null;
    }
    function myId() {
        const A = acc();
        const s = A && A.snapshot ? A.snapshot() : null;
        return s && s.user ? s.user.id : null;
    }

    function mapError(err) {
        if (!err) return { code: 'UNKNOWN', message: 'Bir şeyler ters gitti.' };
        if (typeof err === 'string') err = { message: err };
        // PostgREST: fonksiyon bulunamadı -> migration uygulanmamış
        if (err.code === 'PGRST202' || /Could not find the function/i.test(err.message || '')) {
            return { code: 'UNSUPPORTED', message: EXTRA_MESSAGES.UNSUPPORTED };
        }
        const m = String(err.message || '');
        if (EXTRA_MESSAGES[m]) return { code: m, message: EXTRA_MESSAGES[m] };
        const A = acc();
        if (A && typeof A.describeError === 'function') {
            const d = A.describeError(err);
            if (d && d.code && d.code !== 'UNKNOWN') return d;
            if (/^[A-Z_]+$/.test(m)) return { code: m, message: (d && d.message) || m };
            return d || { code: 'UNKNOWN', message: 'Bir şeyler ters gitti.' };
        }
        return { code: /^[A-Z_]+$/.test(m) ? m : 'UNKNOWN', message: m || 'Bir şeyler ters gitti.' };
    }
    const fail = (e) => ({ ok: false, error: mapError(e) });

    function sampleClock(data, t0, t1) {
        if (!data || typeof data !== 'object') return;
        const st = data.server_time || (data.room && data.room.server_time);
        if (st) NS.clock.sample(st, t0, t1);
    }

    async function rpc(fn, args) {
        const c = client();
        if (!c) return fail({ message: 'NO_SESSION' });
        const t0 = Date.now();
        try {
            const { data, error } = await c.rpc(fn, args || {});
            const t1 = Date.now();
            if (error) return fail(error);
            sampleClock(data, t0, t1);
            // respond_room_invite süresi geçmiş daveti hata yerine { ok:false, error } ile döner
            if (data && data.ok === false && data.error) return fail({ message: data.error });
            return { ok: true, data };
        } catch (e) { return fail(e); }
    }

    async function select(build) {
        const c = client();
        if (!c) return fail({ message: 'NO_SESSION' });
        try {
            const { data, error } = await build(c);
            if (error) return fail(error);
            return { ok: true, data: data || [] };
        } catch (e) { return fail(e); }
    }

    const PROFILE_COLS = 'id,username,display_name,avatar,ranked_points';
    const unsupported = new Set();

    const api = {
        client, myId, mapError, PROFILE_COLS,
        isSupported: (fn) => !unsupported.has(fn),

        // ---- arkadaşlık
        sendFriendRequest: (username) => rpc('send_friend_request', { p_username: String(username || '').trim() }),
        respondFriendRequest: (id, accept) => rpc('respond_friend_request', { p_friendship_id: id, p_accept: !!accept }),
        removeFriend: (userId) => rpc('remove_friend', { p_user_id: userId }),
        listFriendships: () => select(c => c.from('friendships')
            .select(`id,status,requester_id,addressee_id,created_at,updated_at,requester:profiles!friendships_requester_id_fkey(${PROFILE_COLS}),addressee:profiles!friendships_addressee_id_fkey(${PROFILE_COLS})`)
            .in('status', ['pending', 'accepted'])
            .order('updated_at', { ascending: false })),
        /** Kullanıcı adı önekine göre arama (ilk 8). */
        searchUsers: (prefix) => {
            const p = String(prefix || '').trim().replace(/[^A-Za-z0-9_]/g, '');
            if (p.length < 2) return Promise.resolve({ ok: true, data: [] });
            return select(c => c.from('profiles').select(PROFILE_COLS).ilike('username', p + '%').not('username', 'is', null).order('username').limit(8));
        },
        getProfiles: (ids) => (ids && ids.length)
            ? select(c => c.from('profiles').select(PROFILE_COLS).in('id', ids))
            : Promise.resolve({ ok: true, data: [] }),

        // ---- oda
        createRoom: (o) => rpc('create_room', {
            p_mode: o.mode, p_format: o.format || null, p_target_type: o.target || 'diagnosis',
            p_capacity: o.capacity == null ? null : o.capacity,
            p_round_count: o.rounds == null ? null : o.rounds,
            p_visibility: o.visibility || 'private',
            p_round_time_limit_sec: o.timeLimit == null ? null : o.timeLimit,
            p_bracket_seeding: o.seeding || 'random'
        }),
        joinRoom: (code) => rpc('join_room', { p_code: String(code || '').trim().toUpperCase() }),
        leaveRoom: (id) => rpc('leave_room', { p_room_id: id }),
        setReady: (id, ready) => rpc('set_ready', { p_room_id: id, p_ready: !!ready }),
        startMatch: (id) => rpc('start_match', { p_room_id: id }),
        submitGuess: (id, round, item) => rpc('submit_guess', { p_room_id: id, p_round_no: round, p_item_id: item }),
        forfeitRound: (id, round) => rpc('forfeit_round', { p_room_id: id, p_round_no: round }),
        heartbeat: (id) => rpc('heartbeat', { p_room_id: id }),
        advanceIfDue: (id) => rpc('advance_if_due', { p_room_id: id }),
        inviteFriend: (roomId, friendId) => rpc('invite_friend', { p_room_id: roomId, p_friend_id: friendId }),
        respondRoomInvite: (id, accept) => rpc('respond_room_invite', { p_invite_id: id, p_accept: !!accept }),
        getRoomState: (id) => rpc('get_room_state', { p_room_id: id }),

        /** 0002 migration'ı: yoksa UNSUPPORTED döner ve bir daha denenmez. */
        async updateRoomSettings(id, patch) {
            if (unsupported.has('update_room_settings')) return fail({ code: 'PGRST202' });
            const r = await rpc('update_room_settings', {
                p_room_id: id,
                p_target_type: patch.target || null,
                p_round_count: patch.rounds == null ? null : patch.rounds,
                p_visibility: patch.visibility || null,
                p_capacity: patch.capacity == null ? null : patch.capacity,
                p_round_time_limit_sec: patch.timeLimit == null ? null : patch.timeLimit
            });
            if (!r.ok && r.error.code === 'UNSUPPORTED') unsupported.add('update_room_settings');
            return r;
        },
        /** Sunucuda update_room_settings var mı? (bir kez sorar; sonucu saklar) */
        async probeRoomSettings() {
            if (unsupported.has('update_room_settings')) return false;
            if (api._probed != null) return api._probed;
            const r = await rpc('update_room_settings', { p_room_id: '00000000-0000-0000-0000-000000000000' });
            api._probed = !(r.error && r.error.code === 'UNSUPPORTED');
            if (!api._probed) unsupported.add('update_room_settings');
            return api._probed;
        },

        listPublicRooms: () => select(c => c.from('rooms')
            .select('id,code,mode,format,target_type,capacity,player_count,round_count,created_at,host_id,host:profiles!rooms_host_id_fkey(username,avatar,ranked_points)')
            .eq('visibility', 'public').eq('status', 'lobby')
            .order('created_at', { ascending: false }).limit(20)),
        listPendingInvites: () => {
            const me = myId();
            if (!me) return Promise.resolve({ ok: true, data: [] });
            return select(c => c.from('room_invites')
                .select('id,room_id,room_code,inviter_id,invitee_id,status,created_at,expires_at,inviter:profiles!room_invites_inviter_id_fkey(username,display_name,avatar,ranked_points),room:rooms(mode,format,target_type,capacity,player_count,status)')
                .eq('invitee_id', me).eq('status', 'pending').gt('expires_at', new Date(NS.clock.now()).toISOString())
                .order('created_at', { ascending: false }));
        },
        /** Kullanıcının şu anki (bitmemiş) odası: yeniden yüklemede kaldığı yere dönmek için. */
        async getMyCurrentRoom() {
            const me = myId();
            if (!me) return { ok: true, data: null };
            const r = await select(c => c.from('room_players').select('room_id,left_at,is_current,room:rooms(id,code,status)')
                .eq('user_id', me).eq('is_current', true).is('left_at', null).limit(1));
            if (!r.ok) return r;
            const row = r.data[0];
            const room = row && row.room;
            return { ok: true, data: room && ['lobby', 'in_round', 'round_result'].includes(room.status) ? room : null };
        },
        getConfig: () => select(c => c.from('game_config').select('key,value'))
    };

    NS.api = api;
})(typeof window !== 'undefined' ? window : globalThis);
