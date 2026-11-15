// PsikoVaka Supabase şeması — senaryo testi
//
// Çalıştırma (supabase/tests klasöründe):
//   npm install
//   npm test                                   # PGlite (WASM Postgres) ile
//   DATABASE_URL=postgres://... npm test       # boş bir test veritabanında gerçek Postgres ile
//
// DİKKAT: DATABASE_URL verilirse o veritabanına stub şema ve migration kurulur.
// Gerçek Supabase projesine ASLA bağlamayın; yalnızca boş, atılabilir bir test veritabanı.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const read = (p) => readFileSync(path.join(root, p), 'utf8');

// ---------------------------------------------------------------- bağlantı
async function connect() {
  if (process.env.DATABASE_URL) {
    const { default: pg } = await import('pg');
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    return { name: 'postgres (pg)', exec: (s) => client.query(s), query: (s, p) => client.query(s, p), close: () => client.end() };
  }
  const { PGlite } = await import('@electric-sql/pglite');
  const db = new PGlite();
  return { name: 'PGlite', exec: (s) => db.exec(s), query: (s, p) => db.query(s, p), close: () => db.close() };
}

const db = await connect();
console.log(`Veritabanı: ${db.name}`);
await db.exec(read('tests/00_supabase_stubs.sql'));
await db.exec(read('migrations/0001_init.sql'));
await db.exec(read('seed/0002_cases_answer_key.sql'));
await db.exec(read('migrations/0002_online_ek.sql'));
await db.exec(read('migrations/0002_online_ek.sql')); // tekrar çalıştırılabilir olmalı
await db.exec(read('migrations/0003_gunluk_ve_hizli.sql'));
await db.exec(read('migrations/0003_gunluk_ve_hizli.sql')); // tekrar çalıştırılabilir olmalı

// ---------------------------------------------------------------- mini test aracı
let passed = 0, failed = 0;
const failures = [];
async function test(name, fn) {
  try { await fn(); passed++; console.log(`  ok   ${name}`); }
  catch (e) { failed++; failures.push(name); console.log(`  FAIL ${name}\n       ${e.stack || e.message}`); }
  finally { await db.exec('reset role'); }
}
function eq(a, b, msg = '') {
  const A = JSON.stringify(a), B = JSON.stringify(b);
  if (A !== B) throw new Error(`${msg} beklenen ${B}, gelen ${A}`);
}
function ok(c, msg) { if (!c) throw new Error(msg || 'koşul sağlanmadı'); }
async function expectErr(p, codeOrRe) {
  try { await p; } catch (e) {
    const m = e.message || '';
    if (codeOrRe instanceof RegExp ? codeOrRe.test(m) : m === codeOrRe) return m;
    throw new Error(`beklenen hata ${codeOrRe}, gelen "${m}"`);
  }
  throw new Error(`beklenen hata ${codeOrRe}, ama başarılı oldu`);
}
const DENIED = /permission denied|row-level security/;

// ---------------------------------------------------------------- rol / RPC yardımcıları
async function as(uid, fn) {
  const claims = uid ? JSON.stringify({ sub: uid, role: 'authenticated' }) : '';
  await db.exec(`select set_config('request.jwt.claims', '${claims}', false); set role ${uid ? 'authenticated' : 'anon'};`);
  try { return await fn(); } finally { await db.exec('reset role'); }
}
const q = (uid, sql, params = []) => as(uid, () => db.query(sql, params));
async function rpc(uid, fn, args = {}) {
  const keys = Object.keys(args);
  const sql = `select public.${fn}(${keys.map((k, i) => `${k} => $${i + 1}`).join(', ')}) as r`;
  const res = await q(uid, sql, keys.map((k) => args[k]));
  return res.rows[0].r;
}
const admin = (sql, params = []) => db.query(sql, params);
const one = async (sql, params) => (await admin(sql, params)).rows[0];

// ---------------------------------------------------------------- oyun yardımcıları
const U = {};
async function makeUser(n) {
  const id = randomUUID();
  await admin(`insert into auth.users (id, email, raw_user_meta_data) values ($1, $2, $3)`,
    [id, `u${n}@test.local`, JSON.stringify({ full_name: `Kullanıcı ${n}` })]);
  await rpc(id, 'set_username', { p_username: `user${n}` });
  U[n] = id;
  return id;
}
const rp = async (uid) => (await one(`select ranked_points from public.profiles where id = $1`, [uid])).ranked_points;
const room = async (id) => one(`select * from public.rooms where id = $1`, [id]);

async function currentRound(roomId) {
  return one(`select rr.*, r.target_type, k.diagnosis_id, k.therapy_id, k.pharmacology_id
                from public.rooms r
                join public.room_rounds rr on rr.room_id = r.id and rr.round_no = r.current_round
                join public.cases_answer_key k on k.case_id = rr.case_id
               where r.id = $1`, [roomId]);
}
// Turun başlangıcını geriye alır (geri sayımı atlamak ve hız bonusunu belirlemek için)
async function startedAgo(roomId, sec) {
  await admin(`update public.room_rounds rr
                  set starts_at = now() - make_interval(secs => $2),
                      deadline_at = now() - make_interval(secs => $2) + make_interval(secs => r.round_time_limit_sec)
                 from public.rooms r
                where r.id = rr.room_id and rr.room_id = $1 and rr.round_no = r.current_round`, [roomId, sec]);
  await admin(`update public.room_heartbeats set last_seen_at = now() where room_id = $1`, [roomId]);
}
async function correctId(roomId, uid) {
  const r = await currentRound(roomId);
  const stage = (await one(`select stage from public.round_players where room_id = $1 and round_no = $2 and user_id = $3`,
    [roomId, r.round_no, uid]))?.stage ?? 1;
  const kind = r.target_type === 'combo' ? ['diagnosis', 'therapy', 'pharmacology'][stage - 1] : r.target_type;
  return { kind, id: r[`${kind}_id`], round: r.round_no };
}
async function wrongIds(roomId, uid, n) {
  const c = await correctId(roomId, uid);
  const rows = (await admin(`select item_id from public.answer_catalog where kind = $1 and item_id <> $2 order by item_id limit $3`,
    [c.kind, c.id, n])).rows;
  return { ...c, wrong: rows.map((x) => x.item_id) };
}
async function solve(roomId, uid, wrongFirst = 0) {
  const c = await wrongIds(roomId, uid, wrongFirst);
  let last;
  for (const w of c.wrong) last = await rpc(uid, 'submit_guess', { p_room_id: roomId, p_round_no: c.round, p_item_id: w });
  last = await rpc(uid, 'submit_guess', { p_room_id: roomId, p_round_no: c.round, p_item_id: c.id });
  return last;
}
async function failRound(roomId, uid) {
  const c = await wrongIds(roomId, uid, 6);
  let last;
  for (const w of c.wrong) last = await rpc(uid, 'submit_guess', { p_room_id: roomId, p_round_no: c.round, p_item_id: w });
  return last;
}
async function nextRound(roomId, uid) {
  await admin(`update public.rooms set next_round_at = now() - interval '1 second' where id = $1`, [roomId]);
  return rpc(uid, 'advance_if_due', { p_room_id: roomId });
}
// Bir odayı kur, herkesi kat, hazırla, başlat
async function setupMatch(host, others, opts) {
  const r = await rpc(host, 'create_room', opts);
  for (const o of others) {
    await rpc(o, 'join_room', { p_code: r.code });
    await rpc(o, 'set_ready', { p_room_id: r.id, p_ready: true });
  }
  await rpc(host, 'start_match', { p_room_id: r.id });
  return r;
}
const speedBonus = (e) => Math.max(0, Math.min(20, Math.round((60 - Math.min(60, e || 30)) / 3)));
const casePoints = (won, g, e) => !won ? 0 : (({ 1: 100, 2: 85, 3: 70, 4: 55, 5: 40, 6: 25 })[g] || 25) + speedBonus(e);

// =============================================================================
console.log('\n[Kurulum]');
await test('12 kullanıcı oluşturulur; tetikleyici profil açar, RP varsayılanı 0 (RP v2)', async () => {
  for (let i = 1; i <= 12; i++) await makeUser(i);
  const r = await one(`select count(*)::int as n, min(ranked_points) as lo, max(ranked_points) as hi from public.profiles`);
  eq([r.n, r.lo, r.hi], [12, 0, 0]);
  eq((await one(`select display_name from public.profiles where id = $1`, [U[1]])).display_name, 'Kullanıcı 1');
});

console.log('\n[Profil ve yetkiler]');
await test('USERNAME_TAKEN (büyük/küçük harf duyarsız) ve USERNAME_INVALID', async () => {
  await expectErr(rpc(U[2], 'set_username', { p_username: 'USER1' }), 'USERNAME_TAKEN');
  await expectErr(rpc(U[2], 'set_username', { p_username: 'a b' }), 'USERNAME_INVALID');
});
await test('İstemci ranked_points / matches_won güncelleyemez (yetki reddi)', async () => {
  await expectErr(q(U[1], `update public.profiles set ranked_points = 9999 where id = $1`, [U[1]]), DENIED);
  await expectErr(q(U[1], `update public.profiles set matches_won = 50 where id = $1`, [U[1]]), DENIED);
  eq(await rp(U[1]), 0);
});
await test('İstemci kendi avatarını değiştirebilir, başkasınınkini değiştiremez', async () => {
  const own = await q(U[1], `update public.profiles set avatar = '{"bg":"bg_rose"}'::jsonb where id = $1`, [U[1]]);
  eq(own.rowCount ?? own.affectedRows, 1);
  const other = await q(U[1], `update public.profiles set avatar = '{"bg":"bg_rose"}'::jsonb where id = $1`, [U[2]]);
  eq(other.rowCount ?? other.affectedRows, 0);
});
await test('anon hiçbir tabloyu okuyamaz, hiçbir RPC çağıramaz', async () => {
  await expectErr(q(null, `select * from public.profiles`), DENIED);
  await expectErr(q(null, `select * from public.leaderboard`), DENIED);
  await expectErr(rpc(null, 'create_room', { p_mode: 'duel' }), DENIED);
});
await test('authenticated cevap anahtarını, vaka sırasını, kalp atışlarını okuyamaz; iç fonksiyonları çağıramaz; doğrudan INSERT yapamaz', async () => {
  await expectErr(q(U[1], `select * from public.cases_answer_key`), DENIED);
  await expectErr(q(U[1], `select * from public.room_case_queue`), DENIED);
  await expectErr(q(U[1], `select * from public.room_heartbeats`), DENIED);
  await expectErr(q(U[1], `select public._finish_match(gen_random_uuid())`), DENIED);
  await expectErr(q(U[1], `select public._cfg('hp_start')`), DENIED);
  await expectErr(q(U[1], `insert into public.rooms (code, host_id, mode, format, capacity, round_count, round_time_limit_sec, intermission_sec)
                             values ('AAAAAA', $1, 'duel', 'rounds', 2, 5, 180, 10)`, [U[1]]), DENIED);
  await expectErr(q(U[1], `insert into public.match_results (room_id, user_id, mode, format, final_rank, total_score, rp_delta)
                             values (gen_random_uuid(), $1, 'duel', 'rounds', 1, 0, 1000)`, [U[1]]), DENIED);
});
await test('Ayarlar (game_config) giriş yapmış kullanıcıya okunur', async () => {
  const r = await q(U[1], `select value from public.game_config where key = 'hp_start'`);
  eq(Number(r.rows[0].value), 600);
});

console.log('\n[Arkadaşlık]');
await test('İstek kabul edilmeden arkadaş sayılmaz; kabulden sonra karşılıklı', async () => {
  const f = await rpc(U[1], 'send_friend_request', { p_username: 'user2' });
  eq(f.status, 'pending');
  eq((await q(U[1], `select public.is_friend($1) as v`, [U[2]])).rows[0].v, false);
  eq((await q(U[3], `select * from public.friendships`)).rows.length, 0, 'üçüncü kişi isteği görmemeli');
  eq((await q(U[2], `select * from public.friendships`)).rows.length, 1);
  await expectErr(rpc(U[1], 'respond_friend_request', { p_friendship_id: f.friendship_id, p_accept: true }), 'REQUEST_NOT_FOUND');
  const a = await rpc(U[2], 'respond_friend_request', { p_friendship_id: f.friendship_id, p_accept: true });
  eq(a.status, 'accepted');
  eq((await q(U[1], `select public.is_friend($1) as v`, [U[2]])).rows[0].v, true);
  eq((await q(U[2], `select public.is_friend($1) as v`, [U[1]])).rows[0].v, true);
});
await test('Karşılıklı istek otomatik kabul; arkadaşlıktan çıkarma; reddedilen istek yeniden gönderilebilir', async () => {
  await rpc(U[3], 'send_friend_request', { p_username: 'user1' });
  eq((await rpc(U[1], 'send_friend_request', { p_username: 'user3' })).status, 'accepted');
  await rpc(U[1], 'remove_friend', { p_user_id: U[3] });
  eq((await q(U[1], `select public.is_friend($1) as v`, [U[3]])).rows[0].v, false);
  const f = await rpc(U[5], 'send_friend_request', { p_username: 'user6' });
  eq((await rpc(U[6], 'respond_friend_request', { p_friendship_id: f.friendship_id, p_accept: false })).status, 'declined');
  eq((await rpc(U[5], 'send_friend_request', { p_username: 'user6' })).status, 'pending');
  await expectErr(rpc(U[1], 'send_friend_request', { p_username: 'user1' }), 'CANNOT_FRIEND_SELF');
  await expectErr(rpc(U[1], 'send_friend_request', { p_username: 'nobody_here' }), 'USER_NOT_FOUND');
});

console.log('\n[FFA odası: lobi, başlatma kuralları, tahmin, puan, tur kapanışı, RP]');
let ffa;
await test('Oda kurulur; kod 6 karakter ve belirsiz harf yok', async () => {
  ffa = await rpc(U[1], 'create_room', { p_mode: 'ffa', p_capacity: 3, p_round_count: 3 });
  ok(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/.test(ffa.code), ffa.code);
  eq([ffa.status, ffa.format, ffa.player_count, ffa.host_id], ['lobby', 'rounds', 1, U[1]]);
});
await test('Geçersiz ayarlar reddedilir', async () => {
  await expectErr(rpc(U[9], 'create_room', { p_mode: 'duel', p_capacity: 3 }), 'INVALID_SETTINGS');
  await expectErr(rpc(U[9], 'create_room', { p_mode: 'ffa', p_format: 'hp' }), 'INVALID_SETTINGS');
  await expectErr(rpc(U[9], 'create_room', { p_mode: 'tournament', p_capacity: 6 }), 'INVALID_SETTINGS');
  await expectErr(rpc(U[9], 'create_room', { p_mode: 'banana' }), 'INVALID_SETTINGS');
});
await test('start_match: host değilse NOT_HOST, oda dolmadıysa ROOM_NOT_FULL', async () => {
  await rpc(U[2], 'join_room', { p_code: ffa.code.toLowerCase() });
  await expectErr(rpc(U[2], 'start_match', { p_room_id: ffa.id }), 'NOT_HOST');
  await expectErr(rpc(U[1], 'start_match', { p_room_id: ffa.id }), 'ROOM_NOT_FULL');
});
await test('Davet yalnızca arkadaşa ve yalnızca davet edilene görünür; davetle katılma', async () => {
  await expectErr(rpc(U[1], 'invite_friend', { p_room_id: ffa.id, p_friend_id: U[3] }), 'NOT_FRIENDS');
  const f = await rpc(U[1], 'send_friend_request', { p_username: 'user4' });
  await rpc(U[4], 'respond_friend_request', { p_friendship_id: f.friendship_id, p_accept: true });
  eq((await q(U[4], `select * from public.rooms where id = $1`, [ffa.id])).rows.length, 0, 'davetten önce özel oda görünmemeli');
  const inv = await rpc(U[1], 'invite_friend', { p_room_id: ffa.id, p_friend_id: U[4] });
  eq((await q(U[4], `select id from public.room_invites`)).rows.map((r) => r.id), [inv.id]);
  eq((await q(U[5], `select id from public.room_invites`)).rows.length, 0);
  eq((await q(U[4], `select code from public.rooms where id = $1`, [ffa.id])).rows.length, 1, 'davetli odayı görebilmeli');
  const res = await rpc(U[4], 'respond_room_invite', { p_invite_id: inv.id, p_accept: true });
  eq(res.status, 'accepted');
  eq((await room(ffa.id)).player_count, 3);
});
await test('Dolu oda + herkes hazır değil -> NOT_ALL_READY', async () => {
  await rpc(U[2], 'set_ready', { p_room_id: ffa.id, p_ready: true });
  await expectErr(rpc(U[1], 'start_match', { p_room_id: ffa.id }), 'NOT_ALL_READY');
});
await test('Dolu oda + herkes hazır -> başlar; sunucu farklı vakalar seçer; tur 1 açılır', async () => {
  await rpc(U[4], 'set_ready', { p_room_id: ffa.id, p_ready: true });
  const s = await rpc(U[1], 'start_match', { p_room_id: ffa.id });
  eq([s.status, s.current_round], ['in_round', 1]);
  const qrow = await one(`select count(*)::int as n, count(distinct case_id)::int as d from public.room_case_queue where room_id = $1`, [ffa.id]);
  eq([qrow.n, qrow.d], [3, 3]);
  eq((await admin(`select count(*)::int as n from public.room_rounds where room_id = $1`, [ffa.id])).rows[0].n, 1, 'gelecek turlar görünmemeli');
  await expectErr(rpc(U[1], 'start_match', { p_room_id: ffa.id }), 'ALREADY_STARTED');
});
await test('Başladıktan sonra katılma reddedilir (ALREADY_STARTED)', async () => {
  await expectErr(rpc(U[5], 'join_room', { p_code: ffa.code }), 'ALREADY_STARTED');
});
await test('Üye olmayan room_players / room_rounds okuyamaz ve tahmin gönderemez', async () => {
  eq((await q(U[5], `select * from public.room_players where room_id = $1`, [ffa.id])).rows.length, 0);
  eq((await q(U[5], `select * from public.room_rounds where room_id = $1`, [ffa.id])).rows.length, 0);
  eq((await q(U[5], `select * from public.rooms where id = $1`, [ffa.id])).rows.length, 0);
  await expectErr(rpc(U[5], 'submit_guess', { p_room_id: ffa.id, p_round_no: 1, p_item_id: 'mdd' }), 'NOT_MEMBER');
  eq((await q(U[2], `select * from public.room_players where room_id = $1`, [ffa.id])).rows.length, 3);
});
await test('Geri sayım bitmeden tahmin -> ROUND_NOT_STARTED', async () => {
  await expectErr(rpc(U[1], 'submit_guess', { p_room_id: ffa.id, p_round_no: 1, p_item_id: 'mdd' }), 'ROUND_NOT_STARTED');
});
let u1Points;
await test('Yanlış sonra doğru tahmin: 2. tahmin taban 85 + hız bonusu (calculateCasePoints ile aynı)', async () => {
  await startedAgo(ffa.id, 12.3);
  const c = await wrongIds(ffa.id, U[1], 1);
  const w = await rpc(U[1], 'submit_guess', { p_room_id: ffa.id, p_round_no: 1, p_item_id: c.wrong[0] });
  eq([w.is_correct, w.guess_no, w.finished, w.guesses_left], [false, 1, false, 5]);
  ok(!('answer' in w) || w.answer === null, 'yanlış tahminde cevap sızmamalı');
  const r = await rpc(U[1], 'submit_guess', { p_room_id: ffa.id, p_round_no: 1, p_item_id: c.id });
  eq([r.is_correct, r.guess_no, r.finished, r.won], [true, 2, true, true]);
  ok(r.elapsed_sec >= 12 && r.elapsed_sec <= 14, `elapsed ${r.elapsed_sec}`);
  eq(r.points, casePoints(true, 2, r.elapsed_sec));
  eq(r.points, 85 + Math.round((60 - r.elapsed_sec) / 3));
  u1Points = r.points;
});
await test('Tur sürerken başka oyuncunun tahmin içeriği görünmez; sayısı/durumu görünür', async () => {
  eq((await q(U[2], `select * from public.round_guesses where user_id = $1`, [U[1]])).rows.length, 0);
  eq((await q(U[1], `select * from public.round_guesses where user_id = $1`, [U[1]])).rows.length, 2);
  const rp1 = (await q(U[2], `select * from public.round_players where room_id = $1 and user_id = $2`, [ffa.id, U[1]])).rows[0];
  eq([rp1.guess_count, rp1.finished, rp1.won, rp1.points], [2, true, true, u1Points]);
  ok(!Object.keys(rp1).some((k) => k.includes('item')), 'round_players tahmin kimliği içermemeli');
});
await test('İstemci puan / toplam skor yazamaz (RLS + yetki)', async () => {
  await expectErr(q(U[2], `update public.round_players set points = 999 where room_id = $1`, [ffa.id]), DENIED);
  await expectErr(q(U[2], `update public.room_players set total_score = 999 where room_id = $1`, [ffa.id]), DENIED);
  await expectErr(q(U[2], `delete from public.round_guesses`), DENIED);
});
await test('Bilinmeyen seçenek ve aynı tahmini tekrar -> UNKNOWN_ITEM / DUPLICATE_GUESS (hak yemez)', async () => {
  await expectErr(rpc(U[4], 'submit_guess', { p_room_id: ffa.id, p_round_no: 1, p_item_id: 'yok_boyle_tani' }), 'UNKNOWN_ITEM');
  const c = await wrongIds(ffa.id, U[4], 1);
  await rpc(U[4], 'submit_guess', { p_room_id: ffa.id, p_round_no: 1, p_item_id: c.wrong[0] });
  await expectErr(rpc(U[4], 'submit_guess', { p_room_id: ffa.id, p_round_no: 1, p_item_id: c.wrong[0] }), 'DUPLICATE_GUESS');
  eq((await one(`select guess_count from public.round_players where room_id = $1 and user_id = $2 and round_no = 1`, [ffa.id, U[4]])).guess_count, 1);
});
await test('6 yanlıştan sonra oyuncu biter (0 puan); 7. tahmin reddedilir', async () => {
  const last = await failRound(ffa.id, U[2]);
  eq([last.finished, last.won, last.points, last.guess_no], [true, false, 0, 6]);
  ok(last.answer && last.answer.diagnosis_id, 'bitince cevap dönmeli');
  const c = await correctId(ffa.id, U[2]);
  await expectErr(rpc(U[2], 'submit_guess', { p_room_id: ffa.id, p_round_no: 1, p_item_id: c.id }), 'ALREADY_FINISHED');
  eq((await room(ffa.id)).status, 'in_round', 'U4 bitmeden tur kapanmamalı');
});
await test('Tüm aktif oyuncular bitince tur kapanır; sonra tahmin içerikleri herkese açılır', async () => {
  await rpc(U[4], 'forfeit_round', { p_room_id: ffa.id, p_round_no: 1 });
  const r = await room(ffa.id);
  eq(r.status, 'round_result');
  const rr = await one(`select closed_at, close_reason from public.room_rounds where room_id = $1 and round_no = 1`, [ffa.id]);
  ok(rr.closed_at, 'closed_at'); eq(rr.close_reason, 'all_finished');
  eq((await q(U[2], `select * from public.round_guesses where user_id = $1`, [U[1]])).rows.length, 2);
  await expectErr(rpc(U[1], 'submit_guess', { p_room_id: ffa.id, p_round_no: 1, p_item_id: 'mdd' }), 'ROUND_CLOSED');
});
await test('advance_if_due: ara süre dolmadan değişmez, dolunca 2. tur; tekrarlı çağrı güvenli', async () => {
  eq((await rpc(U[2], 'advance_if_due', { p_room_id: ffa.id })).status, 'round_result');
  const s = await nextRound(ffa.id, U[2]);
  eq([s.status, s.current_round], ['in_round', 2]);
  eq((await rpc(U[4], 'advance_if_due', { p_room_id: ffa.id })).current_round, 2);
});
await test('Kalp atışı kesilen oyuncu turu kaybeder (absent) ve oda takılmaz', async () => {
  await startedAgo(ffa.id, 20.2);
  await solve(ffa.id, U[1]);
  await solve(ffa.id, U[2], 2);
  await admin(`update public.room_heartbeats set last_seen_at = now() - interval '5 minutes' where room_id = $1 and user_id = $2`, [ffa.id, U[4]]);
  const s = await rpc(U[1], 'advance_if_due', { p_room_id: ffa.id });
  eq(s.status, 'round_result');
  eq((await one(`select finish_reason from public.round_players where room_id = $1 and round_no = 2 and user_id = $2`, [ffa.id, U[4]])).finish_reason, 'absent');
});
await test('Süre dolunca tur zaman aşımıyla kapanır; son turda maç biter', async () => {
  await nextRound(ffa.id, U[1]);
  await startedAgo(ffa.id, 200);   // 180 sn sınır
  await expectErr(rpc(U[1], 'submit_guess', { p_room_id: ffa.id, p_round_no: 3, p_item_id: 'mdd' }), 'ROUND_CLOSED');
  const s = await rpc(U[2], 'advance_if_due', { p_room_id: ffa.id });
  eq(s.status, 'finished');
  eq((await one(`select close_reason from public.room_rounds where room_id = $1 and round_no = 3`, [ffa.id])).close_reason, 'timeout');
});
await test('RP v2 (ffa): tur başına g2 +8 / g1 +10 / g3 +6 / başarısız −10, prim 1. +15 2. +5; taban 0', async () => {
  const res = (await admin(`select user_id, final_rank, rp_delta, rp_after, rp_breakdown from public.match_results where room_id = $1 order by final_rank`, [ffa.id])).rows;
  // U1: 8 + 10 − 10 (zaman aşımı) + 15 = 23; U2: −10 + 6 − 10 + 5 = −9; U4: pes −10, absent −10, zaman aşımı −10 = −30
  eq(res.map((r) => [r.user_id, r.final_rank, r.rp_delta]), [[U[1], 1, 23], [U[2], 2, -9], [U[4], 3, -30]]);
  const b1 = res[0].rp_breakdown;
  eq([b1.total, b1.voided, b1.placement, b1.rounds], [23, false, 15, [{ delta: 8, round: 1, outcome: 'g2' }, { delta: 10, round: 2, outcome: 'g1' }, { delta: -10, round: 3, outcome: 'fail' }]]);
  eq(res[2].rp_breakdown.rounds.map((x) => x.outcome), ['fail', 'fail', 'fail']);
  eq([await rp(U[1]), await rp(U[2]), await rp(U[4])], [23, 0, 0], 'RP 0\'ın altına inmez');
  eq(res.map((r) => r.rp_after), [23, 0, 0]);
});
await test('Maç bitirme iki kez (ve advance_if_due tekrar) çağrılsa da RP bir kez verilir', async () => {
  await admin(`select public._finish_match($1, false)`, [ffa.id]);
  await admin(`select public._finish_match($1, false)`, [ffa.id]);
  await rpc(U[1], 'advance_if_due', { p_room_id: ffa.id });
  // durum zorla geri alınsa bile match_results tekil anahtarı + rp_after koruması çifte ödemeyi engeller
  await admin(`update public.rooms set status = 'in_round' where id = $1`, [ffa.id]);
  await admin(`select public._finish_match($1, false)`, [ffa.id]);
  eq([await rp(U[1]), await rp(U[2]), await rp(U[4])], [23, 0, 0]);
  eq((await one(`select matches_played, matches_won from public.profiles where id = $1`, [U[1]])), { matches_played: 1, matches_won: 1 });
});
await test('Liderlik tablosu görünümü sıralı', async () => {
  const r = (await q(U[7], `select username, ranked_points, position from public.leaderboard order by position, username limit 3`)).rows;
  eq(r.map((x) => [x.username, x.ranked_points, Number(x.position)]), [['user1', 23, 1], ['user10', 0, 2], ['user11', 0, 2]]);
});

console.log('\n[Düello lobisi: kapasite, host devri, boş oda]');
await test('Dolu düelloya katılma -> ROOM_FULL', async () => {
  const d = await rpc(U[6], 'create_room', { p_mode: 'duel' });
  await rpc(U[7], 'join_room', { p_code: d.code });
  await expectErr(rpc(U[8], 'join_room', { p_code: d.code }), 'ROOM_FULL');
  await rpc(U[6], 'leave_room', { p_room_id: d.id });
  eq([(await room(d.id)).host_id, (await room(d.id)).player_count], [U[7], 1], 'host en erken katılana geçmeli');
  await rpc(U[7], 'leave_room', { p_room_id: d.id });
  eq((await room(d.id)).status, 'abandoned', 'boş oda kapanmalı');
});
await test('Lobide kalp atışı kesilen host düşer, host devredilir', async () => {
  const d = await rpc(U[6], 'create_room', { p_mode: 'duel' });
  await rpc(U[8], 'join_room', { p_code: d.code });
  await admin(`update public.room_heartbeats set last_seen_at = now() - interval '2 minutes' where room_id = $1 and user_id = $2`, [d.id, U[6]]);
  await rpc(U[8], 'advance_if_due', { p_room_id: d.id });
  const r = await room(d.id);
  eq([r.host_id, r.player_count, r.status], [U[8], 1, 'lobby']);
});
await test('Kullanıcı aynı anda tek odada: yeni odaya katılınca eskisinden çıkar', async () => {
  const d = await rpc(U[9], 'create_room', { p_mode: 'duel' });
  await rpc(U[9], 'create_room', { p_mode: 'duel' });
  eq((await room(d.id)).status, 'abandoned');
  eq((await one(`select count(*)::int as n from public.room_players where user_id = $1 and is_current`, [U[9]])).n, 1);
});

console.log('\n[Turnuva: battle formatı]');
await test('4 kişi battle: her tur en düşük puanlı elenir, elenen tahmin gönderemez, sıralama; RP v2: elenen sonraki turlar için cezalandırılmaz, prim 1. +25 2. +10', async () => {
  const before = { 1: await rp(U[1]), 2: await rp(U[2]), 4: await rp(U[4]), 5: await rp(U[5]) };
  const t = await setupMatch(U[1], [U[2], U[4], U[5]], { p_mode: 'tournament', p_capacity: 4, p_format: 'battle' });
  eq((await room(t.id)).round_count, 3);
  // Tur 1: U5 çözemiyor -> elenir
  await startedAgo(t.id, 10.2);
  await solve(t.id, U[1]); await solve(t.id, U[2], 1); await solve(t.id, U[4], 2); await failRound(t.id, U[5]);
  let rr = await one(`select eliminated_user_ids from public.room_rounds where room_id = $1 and round_no = 1`, [t.id]);
  eq(rr.eliminated_user_ids, [U[5]]);
  await nextRound(t.id, U[1]);
  await startedAgo(t.id, 10.2);
  const c = await correctId(t.id, U[1]);
  await expectErr(rpc(U[5], 'submit_guess', { p_room_id: t.id, p_round_no: 2, p_item_id: c.id }), 'NOT_IN_ROUND');
  ok((await rpc(U[5], 'get_room_state', { p_room_id: t.id })).players.length === 4, 'elenen izleyebilmeli');
  // Tur 2: U4 en düşük (aynı tahmin sayısında daha yavaş/çözemedi) -> elenir
  await solve(t.id, U[1]); await solve(t.id, U[2], 1); await rpc(U[4], 'forfeit_round', { p_room_id: t.id, p_round_no: 2 });
  rr = await one(`select eliminated_user_ids from public.room_rounds where room_id = $1 and round_no = 2`, [t.id]);
  eq(rr.eliminated_user_ids, [U[4]]);
  // Tur 3 (final): 2 kişi kaldı, eleme yok
  await nextRound(t.id, U[2]);
  await startedAgo(t.id, 10.2);
  await solve(t.id, U[1]); await failRound(t.id, U[2]);
  eq((await room(t.id)).status, 'finished');
  const res = (await admin(`select user_id, final_rank, rp_delta from public.match_results where room_id = $1 order by final_rank`, [t.id])).rows;
  // U1: 10+10+10+25 = 55; U2: 8+8−10+10 = 16; U4: 6−10 = −4 (tur 3 yok); U5: −10 (tur 2-3 yok)
  eq(res.map((r) => [r.user_id, r.final_rank, r.rp_delta]), [[U[1], 1, 55], [U[2], 2, 16], [U[4], 3, -4], [U[5], 4, -10]]);
  const b5 = (await one(`select rp_breakdown from public.match_results where room_id = $1 and user_id = $2`, [t.id, U[5]])).rp_breakdown;
  eq(b5.rounds, [{ delta: -10, round: 1, outcome: 'fail' }], 'elenen oyuncu sonraki turlar için ceza almaz');
  eq(await rp(U[1]), before[1] + 55);
  eq(await rp(U[5]), Math.max(0, before[5] - 10));
});

console.log('\n[Turnuva: bracket formatı (tek eleme)]');
await test('4 kişi bracket: eşleşmeler, hükmen galibiyet (bağlantı koptu), eşitlikte erken bitiren, RP v2 (+25/+10 prim)', async () => {
  const ids = [U[6], U[7], U[8], U[10]];
  const before = Object.fromEntries(await Promise.all(ids.map(async (id) => [id, await rp(id)])));
  const t = await setupMatch(U[6], [U[7], U[8], U[10]], { p_mode: 'tournament', p_capacity: 4, p_format: 'bracket', p_bracket_seeding: 'ranked' });
  eq((await room(t.id)).round_count, 2, 'log2(4) = 2 tur');
  const p1 = (await admin(`select * from public.match_pairings where room_id = $1 and bracket_round = 1 order by slot`, [t.id])).rows;
  eq(p1.length, 2);
  eq(new Set(p1.flatMap((p) => [p.player_a, p.player_b])).size, 4, 'herkes tam bir eşleşmede');
  eq(p1.map((p) => [p.seed_a, p.seed_b]), [[1, 4], [2, 3]]);
  // Üyeler ağacı okur; üye olmayan okuyamaz
  eq((await q(U[7], `select * from public.match_pairings where room_id = $1`, [t.id])).rows.length, 2);
  eq((await q(U[1], `select * from public.match_pairings where room_id = $1`, [t.id])).rows.length, 0);

  const [A, B] = [p1[0].player_a, p1[0].player_b];
  const [C, D] = [p1[1].player_a, p1[1].player_b];
  await startedAgo(t.id, 10.2);
  // Eşleşme 0: A çözer, B çözemez -> A (score)
  await solve(t.id, A, 1); await failRound(t.id, B);
  // Eşleşme 1: D çözer, C'nin bağlantısı kopar -> D (forfeit)
  await solve(t.id, D, 3);
  await admin(`update public.room_heartbeats set last_seen_at = now() - interval '5 minutes' where room_id = $1 and user_id = $2`, [t.id, C]);
  await rpc(D, 'advance_if_due', { p_room_id: t.id });
  const d1 = (await admin(`select slot, winner_id, decided_reason from public.match_pairings where room_id = $1 and bracket_round = 1 order by slot`, [t.id])).rows;
  eq(d1.map((p) => [p.winner_id, p.decided_reason]), [[A, 'score'], [D, 'forfeit']]);
  const final = await one(`select * from public.match_pairings where room_id = $1 and bracket_round = 2 and slot = 0`, [t.id]);
  eq([final.player_a, final.player_b], [A, D], 'kazananlar finalde');
  eq((await room(t.id)).status, 'round_result');

  // Final: ikisi de ilk tahminde, aynı saniyede çözer; D önce bitirir -> D (tiebreak)
  await nextRound(t.id, A);
  await startedAgo(t.id, 10.4);
  await expectErr(rpc(B, 'submit_guess', { p_room_id: t.id, p_round_no: 2, p_item_id: 'mdd' }), 'NOT_IN_ROUND');
  const rd = await solve(t.id, D);
  const ra = await solve(t.id, A);
  eq(ra.points, rd.points, 'aynı puan beklenir (aynı saniye)');
  const fp = await one(`select winner_id, decided_reason from public.match_pairings where room_id = $1 and bracket_round = 2`, [t.id]);
  eq([fp.winner_id, fp.decided_reason], [D, 'tiebreak']);
  const r = await room(t.id);
  eq([r.status, r.ended_early], ['finished', false]);
  const res = (await admin(`select user_id, final_rank, rp_delta from public.match_results where room_id = $1 order by final_rank`, [t.id])).rows;
  // D: g4 +4, g1 +10, +25 = 39; A: g2 +8, g1 +10, +10 = 28; B (çözemedi) ve C (koptu) −10, tur 2 için ceza yok
  eq(res.slice(0, 2).map((x) => [x.user_id, x.final_rank, x.rp_delta]), [[D, 1, 39], [A, 2, 28]]);
  eq(res.slice(2).map((x) => x.rp_delta), [-10, -10]);
  eq(new Set(res.slice(2).map((x) => x.user_id)), new Set([B, C]));
  eq(await rp(D), before[D] + 39);
  eq(await rp(C), Math.max(0, before[C] - 10));
});

console.log('\n[HP düellosu]');
await test('Çarpan: tur 1-3 = 1.0, sonra +0.5', async () => {
  const r = (await admin(`select array_agg(public._hp_multiplier(g)::float8 order by g) as m from generate_series(1, 6) g`)).rows[0].m;
  eq(r, [1, 1, 1, 1.5, 2, 2.5]);
});
await test('HP: düşük puanlı fark × çarpan kadar can kaybeder; 0 olunca maç biter (RP v2: +30 / −20)', async () => {
  const b1 = await rp(U[11]), b2 = await rp(U[12]);
  const d = await setupMatch(U[11], [U[12]], { p_mode: 'duel', p_format: 'hp' });
  const r0 = await room(d.id);
  eq([r0.round_count, r0.format], [10, 'hp']);
  eq((await admin(`select hp from public.room_players where room_id = $1 order by user_id`, [d.id])).rows.map((x) => x.hp), [600, 600]);
  await startedAgo(d.id, 12.3);
  const s = await solve(d.id, U[11]);
  await failRound(d.id, U[12]);
  const hp12 = (await one(`select hp from public.room_players where room_id = $1 and user_id = $2`, [d.id, U[12]])).hp;
  eq(hp12, 600 - s.points);
  const rpRow = await one(`select hp_damage, hp_after from public.round_players where room_id = $1 and round_no = 1 and user_id = $2`, [d.id, U[12]]);
  eq([rpRow.hp_damage, rpRow.hp_after], [s.points, 600 - s.points]);
  // Tur 4'e atla (çarpan 1.5) ve canı düşür
  await admin(`update public.room_players set hp = 50 where room_id = $1 and user_id = $2`, [d.id, U[12]]);
  await nextRound(d.id, U[11]);
  await startedAgo(d.id, 12.3);
  await solve(d.id, U[11]); await rpc(U[12], 'forfeit_round', { p_room_id: d.id, p_round_no: 2 });
  const r = await room(d.id);
  eq([r.status, r.ended_early], ['finished', false]);
  eq((await one(`select hp from public.room_players where room_id = $1 and user_id = $2`, [d.id, U[12]])).hp, 0);
  const res = (await admin(`select user_id, final_rank, rp_delta, final_hp from public.match_results where room_id = $1 order by final_rank`, [d.id])).rows;
  eq(res.map((x) => [x.user_id, x.rp_delta, x.final_hp]), [[U[11], 30, 600], [U[12], -20, 0]]);
  eq([await rp(U[11]), await rp(U[12])], [b1 + 30, Math.max(0, b2 - 20)]);
});
await test('HP: tur sınırında canı yüksek olan kazanır', async () => {
  const d = await setupMatch(U[3], [U[9]], { p_mode: 'duel', p_format: 'hp' });
  await admin(`update public.rooms set round_count = 1 where id = $1`, [d.id]);   // sınırı test için 1'e indir
  await startedAgo(d.id, 12.3);
  await solve(d.id, U[3], 1);   // 85 + bonus
  await solve(d.id, U[9]);      // 100 + bonus -> U3 15 hasar alır
  const r = await room(d.id);
  eq(r.status, 'finished');
  const res = (await admin(`select user_id, final_hp from public.match_results where room_id = $1 order by final_rank`, [d.id])).rows;
  eq(res.map((x) => [x.user_id, x.final_hp]), [[U[9], 600], [U[3], 585]]);
});

console.log('\n[Erken bitiş ve RP çiftçiliği koruması]');
await test('Rakip ilk turda çıkarsa maç biter; kalan için maç geçersiz (0), çıkan kalan turların cezasını öder (RP v2)', async () => {
  const b = await rp(U[5]);
  const d = await setupMatch(U[5], [U[6]], { p_mode: 'duel', p_format: 'rounds', p_round_count: 5 });
  await rpc(U[6], 'leave_room', { p_room_id: d.id });
  const r = await room(d.id);
  eq([r.status, r.ended_early], ['finished', true]);
  const res = (await admin(`select user_id, rp_delta, left_early from public.match_results where room_id = $1 order by final_rank`, [d.id])).rows;
  // U6: tur 1 'left' −10 + oynamadığı 2-5. turlar 4 × −10 = −50; U5: geçersiz maç, 0
  eq(res.map((x) => [x.user_id, x.rp_delta, x.left_early]), [[U[5], 0, false], [U[6], -50, true]]);
  const b6 = (await one(`select rp_breakdown from public.match_results where room_id = $1 and user_id = $2`, [d.id, U[6]])).rp_breakdown;
  eq([b6.voided, b6.rounds.filter((x) => x.missed).length, b6.total], [true, 4, -50]);
  eq(await rp(U[5]), b);
});

console.log('\n[Kombo]');
await test('Kombo: aşama başına 6 hak, aşama geçişi, puan = taban ortalaması + hız bonusu', async () => {
  const d = await setupMatch(U[7], [U[8]], { p_mode: 'duel', p_target_type: 'combo', p_round_count: 1 });
  await startedAgo(d.id, 12.3);
  const s1 = await solve(d.id, U[7]);           // aşama 1: 1 tahmin
  eq([s1.stage_completed, s1.finished, s1.next_stage, s1.guesses_left], [true, false, 2, 6]);
  const s2 = await solve(d.id, U[7], 1);        // aşama 2: 2 tahmin
  eq([s2.stage, s2.next_stage], [2, 3]);
  const s3 = await solve(d.id, U[7], 2);        // aşama 3: 3 tahmin
  eq([s3.finished, s3.won], [true, true]);
  eq(s3.points, Math.round((100 + 85 + 70) / 3) + speedBonus(s3.elapsed_sec));
});

console.log('\n[Yerel ilerleme aktarımı]');
await test('Bir kez aktarılır, bilinmeyen vaka kimlikleri atlanır, RP değişmez; ikinci kez ALREADY_IMPORTED', async () => {
  const b = await rp(U[10]);
  const stats = { played: 10, won: 7, currentStreak: 2, maxStreak: 4, distribution: { 1: 2, 2: 3, 3: 1, 4: 1, 5: 0, 6: 0 }, rankedPoints: 99999 };
  const r = await rpc(U[10], 'import_local_progress', { p_solved_case_ids: ['case-001', 'case-002', 'case-002', 'case-999x'], p_stats: JSON.stringify(stats) });
  eq([r.imported_case_count, r.ignored_case_count], [2, 2]);
  await expectErr(rpc(U[10], 'import_local_progress', { p_solved_case_ids: [], p_stats: JSON.stringify(stats) }), 'ALREADY_IMPORTED');
  eq(await rp(U[10]), b);
  const own = (await q(U[10], `select solved_case_ids from public.user_progress`)).rows;
  eq(own.map((x) => x.solved_case_ids), [['case-001', 'case-002']]);
  eq((await q(U[11], `select * from public.user_progress`)).rows.length, 0);
});
await test('Tutarsız istatistik -> INVALID_STATS', async () => {
  await expectErr(rpc(U[11], 'import_local_progress', { p_solved_case_ids: [], p_stats: JSON.stringify({ played: 3, won: 5, currentStreak: 0, maxStreak: 0, distribution: {} }) }), 'INVALID_STATS');
  await expectErr(rpc(U[11], 'import_local_progress', { p_solved_case_ids: [], p_stats: JSON.stringify({ played: 3, won: 1, currentStreak: 0, maxStreak: 1, distribution: { 1: 4 } }) }), 'INVALID_STATS');
});

console.log('\n[Realtime]');
await test('Yayında doğru tablolar var; tahminler ve cevap anahtarı yok', async () => {
  const t = (await admin(`select tablename from pg_publication_tables where pubname = 'supabase_realtime' `)).rows.map((r) => r.tablename).sort();
  eq(t, ['friendships', 'match_pairings', 'match_results', 'room_invites', 'room_players', 'room_rounds', 'rooms', 'round_players']);
});
await test('Özel kanal yetkisi: room:<id> yalnızca üyeler; online:<id> sahibi yazar, arkadaşlar okur', async () => {
  const d = await rpc(U[1], 'create_room', { p_mode: 'duel' });
  const can = async (uid, topic, write) => (await q(uid, `select public.can_use_realtime_topic($1, $2) as v`, [topic, write])).rows[0].v;
  eq(await can(U[1], `room:${d.id}`, true), true);
  eq(await can(U[3], `room:${d.id}`, false), false);
  eq(await can(U[2], `online:${U[1]}`, false), true, 'arkadaş okur');
  eq(await can(U[2], `online:${U[1]}`, true), false, 'arkadaş yazamaz');
  eq(await can(U[3], `online:${U[1]}`, false), false, 'yabancı okuyamaz');
  eq(await can(U[1], `bogus:${U[1]}`, false), false);
  // realtime.messages üzerindeki politika gerçekten uygulanıyor mu
  await db.exec(`select set_config('realtime.topic', 'room:${d.id}', false)`);
  await q(U[1], `insert into realtime.messages (topic, extension, event) values ('room:${d.id}', 'presence', 'track')`);
  await expectErr(q(U[3], `insert into realtime.messages (topic, extension, event) values ('room:${d.id}', 'presence', 'track')`), DENIED);
  eq((await q(U[3], `select * from realtime.messages`)).rows.length, 0);
  eq((await q(U[1], `select * from realtime.messages`)).rows.length, 1);
  await db.exec(`select set_config('realtime.topic', '', false)`);
});

console.log('\n[0002: lobide ayar değiştirme]');
await test('update_room_settings: yalnızca host, yalnızca lobide; değişince diğerlerinin hazırı sıfırlanır', async () => {
  const r = await rpc(U[4], 'create_room', { p_mode: 'ffa', p_capacity: 4 });
  await rpc(U[5], 'join_room', { p_code: r.code });
  await rpc(U[6], 'join_room', { p_code: r.code });
  await rpc(U[5], 'set_ready', { p_room_id: r.id, p_ready: true });
  await expectErr(rpc(U[5], 'update_room_settings', { p_room_id: r.id, p_target_type: 'therapy' }), 'NOT_HOST');
  await expectErr(rpc(U[7], 'update_room_settings', { p_room_id: r.id, p_target_type: 'therapy' }), 'NOT_MEMBER');
  await expectErr(rpc(U[4], 'update_room_settings', { p_room_id: r.id, p_capacity: 2 }), 'INVALID_SETTINGS');
  await expectErr(rpc(U[4], 'update_room_settings', { p_room_id: r.id, p_round_count: 16 }), 'INVALID_SETTINGS');
  await expectErr(rpc(U[4], 'update_room_settings', { p_room_id: r.id, p_target_type: 'bogus' }), 'INVALID_SETTINGS');
  const same = await rpc(U[4], 'update_room_settings', { p_room_id: r.id });
  eq(same.changed, false);
  eq((await one(`select is_ready from public.room_players where room_id = $1 and user_id = $2`, [r.id, U[5]])).is_ready, true, 'değişmeyince hazır kalır');
  const ch = await rpc(U[4], 'update_room_settings', { p_room_id: r.id, p_target_type: 'combo', p_round_count: 3, p_visibility: 'public', p_capacity: 3 });
  eq([ch.changed, ch.target_type, ch.round_count, ch.visibility, ch.capacity, ch.round_time_limit_sec], [true, 'combo', 3, 'public', 3, 300]);
  eq((await one(`select is_ready from public.room_players where room_id = $1 and user_id = $2`, [r.id, U[5]])).is_ready, false, 'değişince sıfırlanır');
  const back = await rpc(U[4], 'update_room_settings', { p_room_id: r.id, p_target_type: 'diagnosis' });
  eq(back.round_time_limit_sec, 180, 'varsayılan süre hedefle birlikte döner');
  await rpc(U[5], 'set_ready', { p_room_id: r.id, p_ready: true });
  await rpc(U[6], 'set_ready', { p_room_id: r.id, p_ready: true });
  await rpc(U[4], 'start_match', { p_room_id: r.id });
  await expectErr(rpc(U[4], 'update_room_settings', { p_room_id: r.id, p_round_count: 2 }), 'ALREADY_STARTED');
  for (const u of [4, 5, 6]) await rpc(U[u], 'leave_room', { p_room_id: r.id });
});
await test('update_room_settings: turnuvada tur sayısı kapasiteden hesaplanır; anon çağıramaz', async () => {
  const t = await rpc(U[4], 'create_room', { p_mode: 'tournament', p_format: 'bracket', p_capacity: 4 });
  const u = await rpc(U[4], 'update_room_settings', { p_room_id: t.id, p_capacity: 8, p_round_count: 9 });
  eq([u.capacity, u.round_count], [8, 3]);
  await expectErr(rpc(null, 'update_room_settings', { p_room_id: t.id }), DENIED);
  await rpc(U[4], 'leave_room', { p_room_id: t.id });
});

console.log(`\nSonuç: ${passed} geçti, ${failed} kaldı`);
if (failed) console.log('Kalanlar:\n - ' + failures.join('\n - '));
await db.close();
process.exit(failed ? 1 : 0);
