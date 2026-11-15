/**
 * YALNIZCA GELİŞTİRME: harness.html?mock=1 ile yüklenir. Sunucu olmadan arayüz durumlarını çizer.
 * Hesap ve sunucu sahte; realtime kapalı. Konsoldan: olMock.scenario('lobby', { n: 8, long: true })
 * Senaryolar: hub, hub-empty, hub-error, lobby, countdown, playing, hp-playing, result, hp-result,
 *             battle-result, spectate, bracket, final, abandoned, missing
 */
(function () {
    'use strict';
    const NS = window.PsikoVakaOnline;
    const realAcc = window.PsikoVakaAccount;
    const ME = '00000000-0000-4000-8000-000000000001';
    const AV = window.PsikoVakaAvatar;
    const names = ['sen_buradasin', 'ayse_klinik', 'mehmet_psk', 'zeynep_dsm', 'can_terapi', 'elif_noro', 'burak_ilac', 'deniz_vaka'];
    const longNames = ['sen_buradasin_cokuzun', 'ayse_klinik_psikolog', 'mehmet_psikiyatri_20', 'zeynep_dsm5tr_uzmani', 'can_bilissel_terapi', 'elif_noropsikoloji_x', 'burak_farmakoloji_1', 'deniz_vaka_cozucu_99'];
    const uid = (i) => i === 0 ? ME : `00000000-0000-4000-8000-00000000000${i + 1}`;
    const now = () => Date.now() + NS.clock.offset;
    const iso = (ms) => new Date(ms).toISOString();

    // ---------------------------------------------------------- sahte hesap
    const listeners = new Set();
    const snap = () => ({ state: 'ready', availability: 'ready', user: { id: ME, email: 'sen@ornek.test' },
        profile: { id: ME, username: names[0], display_name: 'Sen', avatar: AV.randomConfig('me'), ranked_points: 760 }, remember: true, passwordMinLength: 8 });
    const fakeAcc = Object.assign({}, realAcc, {
        init: async () => { listeners.forEach(f => f(snap(), { type: 'state' })); return { ok: true }; },
        onChange: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
        snapshot: snap,
        getClient: () => ({ mock: true }),
        getRemember: () => true,
        refreshProfile: async () => ({ ok: true }),
        getLeaderboard: async () => ({ ok: true, rows: names.slice(0, 8).map((n, i) => ({ user_id: uid(i), username: n, avatar: AV.randomConfig(n), ranked_points: 2100 - i * 230, position: i + 1 })), me: null })
    });
    Object.defineProperty(fakeAcc, 'state', { get: () => 'ready' });
    Object.defineProperty(fakeAcc, 'availability', { get: () => 'ready' });
    window.PsikoVakaAccount = fakeAcc;

    // ---------------------------------------------------------- sahte realtime
    const noopHandle = { track() {}, send() { return true; }, presence() { return {}; }, isLive() { return true; }, leave() {} };
    Object.assign(NS.realtime, {
        startSelf() {}, stopSelf() {}, setStatus() {}, watchFriends() {}, friendStatus: (id) => (/[2357]$/.test(id) ? { status: id.endsWith('3') ? 'in_match' : 'online' } : null),
        watchPublicRooms() {}, stopPublicRooms() {}, joinRoom: () => noopHandle, stopAll() {}
    });

    // ---------------------------------------------------------- sahte sunucu
    const M = { state: null, hubMode: 'full' };
    const ok = (data) => Promise.resolve({ ok: true, data });
    const err = (code, message) => Promise.resolve({ ok: false, error: { code, message } });
    function player(i, opts) {
        const o = opts || {};
        const nm = (o.long ? longNames : names)[i];
        return { user_id: uid(i), username: nm, display_name: nm, avatar: AV.randomConfig(nm), ranked_points: [760, 1520, 240, 2050, 410, 980, 1310, 120][i],
            is_host: i === (o.host || 0), is_ready: o.ready ? o.ready.includes(i) : i % 2 === 1, joined_at: iso(now() - 60000 + i * 1000), left_at: null,
            played: !!o.played, total_score: o.scores ? o.scores[i] : 0, eliminated_round: o.elim ? (o.elim[i] == null ? null : o.elim[i]) : null, hp: o.hp ? o.hp[i] : null, team: null };
    }
    function room(o) {
        return Object.assign({ id: 'mock-room', code: 'K7M2QX', host_id: ME, mode: 'duel', format: 'rounds', target_type: 'diagnosis', visibility: 'private', capacity: 2, round_count: 5,
            round_time_limit_sec: 180, intermission_sec: 10, bracket_seeding: 'random', status: 'lobby', player_count: 1, current_round: 0, next_round_at: null, ended_early: false }, o);
    }
    function caseIds() { return (window.game && window.game.allMasterCases || []).map(c => c.id); }
    function rp(i, r, o) {
        return Object.assign({ room_id: 'mock-room', round_no: r, user_id: uid(i), stage: 1, stage_guess_count: 0, guess_count: 0, finished: false, won: false, points: 0, elapsed_sec: null, finish_reason: null, finished_at: null, hp_damage: null, hp_after: null }, o);
    }
    const brief = () => { const s = M.state; return s ? { server_time: iso(Date.now()), room_id: s.room.id, status: s.room.status, current_round: s.room.current_round, round_count: s.room.round_count, next_round_at: s.room.next_round_at, round: s.round } : null; };

    Object.assign(NS.api, {
        client: () => ({ mock: true }),
        myId: () => ME,
        listFriendships: () => M.hubMode === 'error' ? err('OFFLINE', 'Bağlantı kurulamadı. İnternetini kontrol edip tekrar dene.') : ok(M.hubMode === 'empty' ? [] : [
            { id: 'f1', status: 'accepted', requester_id: ME, addressee_id: uid(1), updated_at: iso(now()), requester: null, addressee: { id: uid(1), username: names[1], avatar: AV.randomConfig(names[1]), ranked_points: 1520 } },
            { id: 'f2', status: 'accepted', requester_id: uid(2), addressee_id: ME, updated_at: iso(now()), requester: { id: uid(2), username: names[2], avatar: AV.randomConfig(names[2]), ranked_points: 240 }, addressee: null },
            { id: 'f3', status: 'accepted', requester_id: ME, addressee_id: uid(3), updated_at: iso(now()), requester: null, addressee: { id: uid(3), username: longNames[3], avatar: AV.randomConfig(names[3]), ranked_points: 2050 } },
            { id: 'f4', status: 'accepted', requester_id: ME, addressee_id: uid(4), updated_at: iso(now()), requester: null, addressee: { id: uid(4), username: names[4], avatar: AV.randomConfig(names[4]), ranked_points: 410 } },
            { id: 'f5', status: 'pending', requester_id: uid(5), addressee_id: ME, updated_at: iso(now()), requester: { id: uid(5), username: names[5], avatar: AV.randomConfig(names[5]), ranked_points: 980 }, addressee: null },
            { id: 'f6', status: 'pending', requester_id: ME, addressee_id: uid(6), updated_at: iso(now()), requester: null, addressee: { id: uid(6), username: names[6], avatar: AV.randomConfig(names[6]), ranked_points: 1310 } }
        ]),
        listPublicRooms: () => M.hubMode === 'error' ? err('OFFLINE', 'Bağlantı kurulamadı. İnternetini kontrol edip tekrar dene.') : ok(M.hubMode === 'empty' ? [] : [
            { id: 'p1', code: 'ABC234', mode: 'ffa', format: 'rounds', target_type: 'combo', capacity: 6, player_count: 3, round_count: 5, host: { username: names[3], avatar: AV.randomConfig(names[3]) } },
            { id: 'p2', code: 'QWE789', mode: 'tournament', format: 'bracket', target_type: 'diagnosis', capacity: 8, player_count: 5, round_count: 3, host: { username: longNames[4], avatar: AV.randomConfig(names[4]) } },
            { id: 'p3', code: 'ZXC456', mode: 'duel', format: 'hp', target_type: 'pharmacology', capacity: 2, player_count: 1, round_count: 10, host: { username: names[7], avatar: AV.randomConfig(names[7]) } }
        ]),
        listPendingInvites: () => ok(M.hubMode === 'full' ? [{ id: 'inv1', room_id: 'r9', room_code: 'TRN888', inviter_id: uid(1), invitee_id: ME, status: 'pending', created_at: iso(now()), expires_at: iso(now() + 600000),
            inviter: { username: names[1], avatar: AV.randomConfig(names[1]) }, room: { mode: 'tournament', format: 'battle', target_type: 'therapy', capacity: 4, player_count: 2, status: 'lobby' } }] : []),
        getMyCurrentRoom: () => ok(null),
        searchUsers: () => ok([]),
        sendFriendRequest: () => err('USER_NOT_FOUND', 'Bu kullanıcı adıyla biri bulunamadı.'),
        createRoom: (o) => { M.state = { server_time: iso(Date.now()), room: room({ mode: o.mode, format: o.format, target_type: o.target, capacity: o.capacity, round_count: NS.ui.roundsFor(o) }), players: [player(0)], round: null, round_players: [], my_guesses: [], pairings: [], results: [] }; return ok(M.state.room); },
        joinRoom: () => err('ALREADY_STARTED', 'Maç başladı; sonradan katılınamaz.'),
        getRoomState: () => M.state ? ok(JSON.parse(JSON.stringify(Object.assign({}, M.state, { server_time: iso(Date.now()) })))) : err('NOT_MEMBER', 'Bu odada değilsin.'),
        heartbeat: () => ok(brief()), advanceIfDue: () => ok(brief()),
        setReady: (id, r) => { const me = M.state.players[0]; me.is_ready = r; return ok({ ok: true, is_ready: r }); },
        startMatch: () => err('NOT_ALL_READY', 'Herkes hazır olmadan maç başlamaz.'),
        leaveRoom: () => { M.state = null; return ok({ ok: true }); },
        submitGuess: () => err('ROUND_CLOSED', 'Bu tur kapandı.'),
        forfeitRound: () => err('ROUND_CLOSED', 'Bu tur kapandı.'),
        inviteFriend: () => ok({}),
        updateRoomSettings: () => err('UNSUPPORTED', 'Bu özellik sunucuda henüz açık değil.'),
        respondRoomInvite: () => err('INVITE_EXPIRED', 'Davetin süresi dolmuş.')
    });

    // ---------------------------------------------------------- senaryolar
    function scenario(name, o) {
        o = o || {};
        const ids = caseIds();
        const n = o.n || (name.startsWith('hp') ? 2 : 4);
        const all = Array.from({ length: n }, (_, i) => i);
        let s = null;
        const T0 = now();
        if (!name.startsWith('hub')) NS.ui.closeBanner('inv-inv1');
        if (name.startsWith('hub')) {
            M.hubMode = name === 'hub-empty' ? 'empty' : name === 'hub-error' ? 'error' : 'full';
            NS.app.exitToHub();
            NS.friends.reset(); NS.friends.load({ silent: true }); NS.friends.loadInvites();
            NS.hub.render(); NS.hub.refreshPublicRooms(); NS.hub.loadLeaderboard();
            return;
        }
        const mode = o.mode || (n === 2 ? 'duel' : n >= 4 && o.tour ? 'tournament' : 'ffa');
        if (name === 'lobby') {
            s = { room: room({ mode: n === 2 ? 'duel' : n === 4 && o.tour ? 'tournament' : 'ffa', format: n === 2 ? 'rounds' : o.tour ? 'bracket' : 'rounds', capacity: o.cap || n, player_count: o.present || n, target_type: o.target || 'combo', visibility: 'public' }),
                players: Array.from({ length: o.present || n }, (_, i) => player(i, { long: o.long, ready: o.allReady ? all : undefined })), round: null, round_players: [], my_guesses: [], pairings: [], results: [] };
        } else if (['countdown', 'playing', 'hp-playing', 'missing'].includes(name)) {
            const hp = name === 'hp-playing';
            const r = { room_id: 'mock-room', round_no: hp ? 5 : 2, case_id: name === 'missing' ? 'case-146' : ids[7], starts_at: iso(name === 'countdown' ? T0 + 2600 : T0 - 40000), deadline_at: iso(T0 + 140000), closed_at: null, close_reason: null, hp_multiplier: hp ? 2 : null, eliminated_user_ids: [] };
            s = { room: room({ mode: hp ? 'duel' : mode, format: hp ? 'hp' : 'rounds', capacity: n, player_count: n, status: 'in_round', current_round: r.round_no, round_count: hp ? 10 : 5, target_type: o.target || 'diagnosis' }),
                players: all.map(i => player(i, { long: o.long, played: true, scores: [185, 210, 95, 0, 60, 120, 40, 30], hp: hp ? [420, 265] : null })), round: r,
                round_players: all.map(i => rp(i, r.round_no, i === 0 ? {} : i === 1 ? { finished: true, won: true, guess_count: 2, stage_guess_count: 2, points: 95, elapsed_sec: 31, finish_reason: 'solved' } : i === 2 ? { guess_count: 3, stage_guess_count: 3 } : { finished: true, guess_count: 6, stage_guess_count: 6, finish_reason: 'failed' })),
                my_guesses: [], pairings: [], results: [] };
        } else if (['result', 'hp-result', 'battle-result'].includes(name)) {
            const hp = name === 'hp-result', battle = name === 'battle-result';
            const r = { room_id: 'mock-room', round_no: hp ? 6 : 2, case_id: ids[11], starts_at: iso(T0 - 90000), deadline_at: iso(T0 + 90000), closed_at: iso(T0 - 1000), close_reason: 'all_finished', hp_multiplier: hp ? 2.5 : null, eliminated_user_ids: battle ? [uid(3)] : [] };
            s = { room: room({ mode: hp ? 'duel' : battle ? 'tournament' : mode, format: hp ? 'hp' : battle ? 'battle' : 'rounds', capacity: n, player_count: n, status: 'round_result', current_round: r.round_no, round_count: hp ? 10 : battle ? n - 1 : 5, next_round_at: iso(T0 + 8000), target_type: o.target || 'therapy' }),
                players: all.map(i => player(i, { long: o.long, played: true, scores: [295, 210, 165, 40, 120, 80, 60, 20], hp: hp ? [480, 195] : null, elim: battle ? { 3: 2 } : null })), round: r,
                round_players: all.map(i => rp(i, r.round_no, i === 0 ? { finished: true, won: true, guess_count: 1, points: 110, elapsed_sec: 22, finish_reason: 'solved', hp_after: hp ? 480 : null, hp_damage: hp ? 0 : null }
                    : i === 1 ? { finished: true, won: true, guess_count: 3, points: 72, elapsed_sec: 54, finish_reason: 'solved', hp_after: hp ? 195 : null, hp_damage: hp ? 95 : null }
                        : i === 2 ? { finished: true, won: false, guess_count: 4, points: 0, elapsed_sec: 180, finish_reason: 'timeout' } : { finished: true, guess_count: 6, finish_reason: i === 3 ? 'absent' : 'failed' })),
                my_guesses: [], pairings: [], results: [] };
        } else if (name === 'bracket' || name === 'spectate') {
            const cap = o.cap || 8, rounds = cap === 8 ? 3 : 2;
            const P = Array.from({ length: cap }, (_, i) => i);
            const cur = o.round || 2;
            const r = { room_id: 'mock-room', round_no: cur, case_id: ids[3], starts_at: iso(T0 - 30000), deadline_at: iso(T0 + 150000), closed_at: null, close_reason: null, hp_multiplier: null, eliminated_user_ids: [] };
            const pairings = [];
            const order = cap === 8 ? [0, 7, 3, 4, 2, 5, 1, 6] : [0, 3, 1, 2];
            for (let k = 0; k < cap / 2; k++) pairings.push({ room_id: 'mock-room', bracket_round: 1, slot: k, player_a: uid(order[2 * k]), player_b: uid(order[2 * k + 1]), seed_a: 2 * k + 1, seed_b: 2 * k + 2, winner_id: cur > 1 ? uid(order[2 * k + (k % 2)]) : null, decided_reason: cur > 1 ? (k === 3 ? 'forfeit' : 'score') : null });
            if (cur >= 2) for (let k = 0; k < cap / 4; k++) pairings.push({ room_id: 'mock-room', bracket_round: 2, slot: k, player_a: pairings[2 * k].winner_id, player_b: pairings[2 * k + 1].winner_id, winner_id: null, decided_reason: null });
            const alive = new Set(pairings.filter(p => p.bracket_round === cur).flatMap(p => [p.player_a, p.player_b]));
            const meAlive = name === 'bracket' && alive.has(ME);
            s = { room: room({ mode: 'tournament', format: 'bracket', capacity: cap, player_count: cap, status: 'in_round', current_round: cur, round_count: rounds, target_type: 'diagnosis' }),
                players: P.map(i => player(i, { long: o.long, played: true, scores: [180, 95, 140, 70, 160, 110, 30, 60], elim: Object.fromEntries(P.filter(i => !alive.has(uid(i))).map(i => [i, 1])) })), round: r,
                round_players: P.filter(i => alive.has(uid(i))).map((i, k) => rp(i, cur, i === 0 ? (name === 'spectate' ? { finished: true, won: true, guess_count: 2, points: 95, finish_reason: 'solved' } : {}) : k % 2 ? { finished: true, won: true, guess_count: 2, points: 90, finish_reason: 'solved' } : { guess_count: 2 })),
                my_guesses: [], pairings, results: [] };
            if (!meAlive && name === 'bracket') s.round_players = s.round_players.filter(x => x.user_id !== ME);
            if (name === 'spectate') { s.players[0].eliminated_round = 1; s.round_players = s.round_players.filter(x => x.user_id !== ME); s.room.format = o.battle ? 'battle' : 'bracket'; if (o.battle) { s.room.round_count = cap - 1; s.pairings = []; } }
        } else if (name === 'final') {
            const hp = o.hp;
            s = { room: room({ mode: hp ? 'duel' : n === 2 ? 'duel' : 'ffa', format: hp ? 'hp' : 'rounds', capacity: n, player_count: n, status: 'finished', current_round: 5, round_count: 5, ended_early: !!o.early }),
                players: all.map(i => player(i, { long: o.long, played: true, scores: [410, 455, 300, 120, 200, 90, 60, 20] })), round: null, round_players: [], my_guesses: [], pairings: [],
                results: all.map(i => ({ room_id: 'mock-room', user_id: uid(i), final_rank: [2, 1, 3, 5, 4, 6, 7, 8][i], total_score: [410, 455, 300, 120, 200, 90, 60, 20][i], eliminated_round: null, final_hp: hp ? [0, 215][i] : null, left_early: i === 3 && n > 3, rp_delta: o.early ? 0 : [20, 50, 5, 0, 5, 5, 5, 5][i], rp_after: [780, 1570, 245, 410, 415, 985, 1315, 125][i] })) };
        } else if (name === 'abandoned') {
            s = { room: room({ status: 'abandoned' }), players: [player(0)], round: null, round_players: [], my_guesses: [], pairings: [], results: [] };
        }
        if (!s) throw new Error('bilinmeyen senaryo ' + name);
        s.server_time = iso(Date.now());
        M.state = s;
        if (window.game && window.game.showRoute) window.game.showRoute('online');
        NS.rooms.close(true);
        NS.app.exitToHub();
        NS.rooms.open('mock-room');
    }
    window.olMock = { scenario, get state() { return M.state; } };
})();
