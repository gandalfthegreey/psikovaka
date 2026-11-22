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
        NOT_FULL_CODE: 'Oda kodu 6 karakter olmalı.',
        QUICK_TIMEOUT: 'Şu an eşleşecek kimse yok.',
        ALREADY_IN_ROOM: 'Zaten bir odadasın.',
        QUICK_ROOM: 'Hızlı eşleşme odasının ayarları değiştirilemez.',
        DAILY_ALREADY_FINISHED: 'Bugünün vakasını bu hedefte zaten bitirdin.',
        DAILY_NOT_STARTED: 'Önce vakayı başlat.'
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
    // details: sunucunun ek bilgisi (ör. ALREADY_IN_ROOM -> mevcut oda kodu)
    const fail = (e) => { const er = mapError(e); if (e && typeof e === 'object' && e.details) er.detail = e.details; return { ok: false, error: er }; };

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

    /** Sonradan eklenen RPC: PGRST202 gelirse işaretlenir, sonraki çağrılar sunucuya gitmeden UNSUPPORTED döner. */
    async function feature(fn, args) {
        if (unsupported.has(fn)) return fail({ code: 'PGRST202' });
        const r = await rpc(fn, args);
        if (!r.ok && r.error.code === 'UNSUPPORTED') unsupported.add(fn);
        return r;
    }

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
        /** Zorluk parametreleri (0007) yalnızca bir ayar açıksa gönderilir: eski sunucu (0007 yok) kapalı ayarla çalışmaya devam eder. */
        createRoom: (o) => rpc('create_room', Object.assign({
            p_mode: o.mode, p_format: o.format || null, p_target_type: o.target || 'diagnosis',
            p_capacity: o.capacity == null ? null : o.capacity,
            p_round_count: o.rounds == null ? null : o.rounds,
            p_visibility: o.visibility || 'private',
            p_round_time_limit_sec: o.timeLimit == null ? null : o.timeLimit,
            p_bracket_seeding: o.seeding || 'random'
        }, o.tekHak || o.kategoriGizli ? { p_tek_hak: !!o.tekHak, p_kategori_gizli: !!o.kategoriGizli } : {})),
        joinRoom: (code) => rpc('join_room', { p_code: String(code || '').trim().toUpperCase() }),
        leaveRoom: (id) => rpc('leave_room', { p_room_id: id }),
        setReady: (id, ready) => rpc('set_ready', { p_room_id: id, p_ready: !!ready }),
        startMatch: (id) => rpc('start_match', { p_room_id: id }),
        submitGuess: (id, round, item) => rpc('submit_guess', { p_room_id: id, p_round_no: round, p_item_id: item }),
        /** 0007: tek hakta sonraki ipucu. */
        revealClue: (id, round) => feature('reveal_clue', { p_room_id: id, p_round_no: round }),
        forfeitRound: (id, round) => rpc('forfeit_round', { p_room_id: id, p_round_no: round }),
        heartbeat: (id) => rpc('heartbeat', { p_room_id: id }),
        advanceIfDue: (id) => rpc('advance_if_due', { p_room_id: id }),
        inviteFriend: (roomId, friendId) => rpc('invite_friend', { p_room_id: roomId, p_friend_id: friendId }),
        respondRoomInvite: (id, accept) => rpc('respond_room_invite', { p_invite_id: id, p_accept: !!accept }),
        getRoomState: (id) => rpc('get_room_state', { p_room_id: id }),

        /** 0002 migration'ı: yoksa UNSUPPORTED döner ve bir daha denenmez. */
        async updateRoomSettings(id, patch) {
            if (unsupported.has('update_room_settings')) return fail({ code: 'PGRST202' });
            const hasZor = patch.tekHak != null || patch.kategoriGizli != null;
            const r = await rpc('update_room_settings', Object.assign({
                p_room_id: id,
                p_target_type: patch.target || null,
                p_round_count: patch.rounds == null ? null : patch.rounds,
                p_visibility: patch.visibility || null,
                p_capacity: patch.capacity == null ? null : patch.capacity,
                p_round_time_limit_sec: patch.timeLimit == null ? null : patch.timeLimit
            }, hasZor ? { p_tek_hak: patch.tekHak == null ? null : !!patch.tekHak, p_kategori_gizli: patch.kategoriGizli == null ? null : !!patch.kategoriGizli } : {}));
            // zorluk alanıyla gelen PGRST202 "0007 yok" demektir; ayar sayfasının tamamını kapatma
            if (!r.ok && r.error.code === 'UNSUPPORTED' && !hasZor) unsupported.add('update_room_settings');
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

        // ---- migration 0003 (§13): yoksa UNSUPPORTED döner ve bir daha sorulmaz (sayfa yenilenene kadar)
        getDailyChallenge: (target) => feature('get_daily_challenge', { p_target: target || 'diagnosis' }),
        dailyBegin: (target) => feature('daily_begin', { p_target: target || 'diagnosis' }),
        /** 0007: ilk tahminden önce zorluk seçimi (daily_begin'in ek parametreleri). feature() değil: PGRST202 günlüğü kapatmasın. */
        dailySetZorluk: (target, z) => rpc('daily_begin', { p_target: target || 'diagnosis', p_tek_hak: !!(z && z.tekHak), p_kategori_gizli: !!(z && z.kategoriGizli) }),
        dailyRevealClue: (target) => feature('daily_reveal_clue', { p_target: target || 'diagnosis' }),
        dailySubmitGuess: (target, item) => feature('daily_submit_guess', { p_target: target, p_item_id: item }),
        dailyGiveUp: (target) => feature('daily_give_up', { p_target: target }),
        getDailyLeaderboard: (target, day, limit) => feature('get_daily_leaderboard', { p_target: target, p_day: day || null, p_limit: limit || 50 }),
        getMyStreaks: () => feature('get_my_streaks', {}),
        quickMatch: (mode, target) => feature('quick_match', { p_mode: mode, p_target: target || 'diagnosis' }),
        getMyRpHistory: (limit) => feature('get_my_rp_history', { p_limit: limit || 20 }),

        listPublicRooms: async () => {
            await feature('cleanup_stale_rooms', {});
            return select(c => c.from('rooms')
                .select('id,code,mode,format,target_type,capacity,player_count,round_count,created_at,host_id,host:profiles!rooms_host_id_fkey(username,avatar,ranked_points)')
                .eq('visibility', 'public').eq('status', 'lobby').gt('player_count', 0)
                .order('created_at', { ascending: false }).limit(20));
        },
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
        /** Gönderdiğim bir davetin durumu (RLS: davet eden de okur). */
        getInvite: (id) => select(c => c.from('room_invites').select('id,status,expires_at').eq('id', id).limit(1)),
        getConfig: () => select(c => c.from('game_config').select('key,value'))
    };

    NS.api = api;
})(typeof window !== 'undefined' ? window : globalThis);
