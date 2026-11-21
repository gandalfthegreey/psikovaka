// PsikoVaka — 0007 testleri: zorluk ayarları (tek tahmin hakkı + kategori gizli) ve Elo zorluk bonusu
//
// Çalıştırma (supabase/tests klasöründe):
//   npm install
//   node zorluk.test.mjs                               # PGlite
//   DATABASE_URL=postgres://... node zorluk.test.mjs   # boş, atılabilir gerçek Postgres
// Gerçek Supabase projesine ASLA bağlamayın.
//
// Migration dosyası: önce supabase/migrations/0007_zorluk.sql, yoksa geliştirme taslağı
// supabase/tools/0007_zorluk.sql.taslak (ZORLUK_MIG ortam değişkeniyle de verilebilir).
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const read = (p) => readFileSync(path.join(root, p), 'utf8');
const MIG7 = process.env.ZORLUK_MIG
  || (existsSync(path.join(root, 'migrations/0007_zorluk.sql')) ? 'migrations/0007_zorluk.sql' : 'tools/0007_zorluk.sql.taslak');

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
console.log(`Veritabanı: ${db.name}; 0007: ${MIG7}`);
for (const f of ['tests/00_supabase_stubs.sql', 'migrations/0001_init.sql', 'seed/0002_cases_answer_key.sql',
  'migrations/0002_online_ek.sql', 'migrations/0003_gunluk_ve_hizli.sql', 'migrations/0004_kural_duzeltmeleri.sql',
  'migrations/0005_isim_filtresi.sql', 'migrations/0006_sinif_modu.sql']) await db.exec(read(f));

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
    if (codeOrRe instanceof RegExp ? codeOrRe.test(m) : m === codeOrRe) return e;
    throw new Error(`beklenen hata ${codeOrRe}, gelen "${m}"`);
  }
  throw new Error(`beklenen hata ${codeOrRe}, ama başarılı oldu`);
}
const ANON = new Set();
async function as(uid, fn) {
  const claims = uid ? JSON.stringify({ sub: uid, role: 'authenticated', is_anonymous: ANON.has(uid) }) : '';
  await db.exec(`select set_config('request.jwt.claims', '${claims}', false); set role ${uid ? 'authenticated' : 'anon'};`);
  try { return await fn(); } finally { await db.exec('reset role'); }
}
const q = (uid, sql, params = []) => as(uid, () => db.query(sql, params));
async function rpc(uid, fn, args = {}) {
  const keys = Object.keys(args);
  const sql = `select public.${fn}(${keys.map((k, i) => `${k} => $${i + 1}`).join(', ')}) as r`;
  return (await q(uid, sql, keys.map((k) => args[k]))).rows[0].r;
}
const admin = (sql, params = []) => db.query(sql, params);
const one = async (sql, params) => (await admin(sql, params)).rows[0];
const num = async (sql, params) => Number(Object.values(await one(sql, params))[0]);
const KINDS = ['diagnosis', 'therapy', 'pharmacology'];

let nUser = 0;
async function makeUser(username) {
  const id = randomUUID();
  await admin(`insert into auth.users (id, email, raw_user_meta_data) values ($1, $2, '{}')`, [id, `z${++nUser}@test.local`]);
  if (username) await rpc(id, 'set_username', { p_username: username });
  return id;
}
async function makeAnon() {
  const id = randomUUID();
  await admin(`insert into auth.users (id, is_anonymous, raw_user_meta_data) values ($1, true, '{}')`, [id]);
  ANON.add(id);
  return id;
}

// ---- maç yardımcıları (scenario / daily_quick ile aynı kalıp)
async function currentRound(roomId) {
  return one(`select rr.*, r.target_type, k.diagnosis_id, k.therapy_id, k.pharmacology_id
                from public.rooms r
                join public.room_rounds rr on rr.room_id = r.id and rr.round_no = r.current_round
                join public.cases_answer_key k on k.case_id = rr.case_id
               where r.id = $1`, [roomId]);
}
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
  const kind = r.target_type === 'combo' ? KINDS[stage - 1] : r.target_type;
  return { kind, id: r[`${kind}_id`], round: r.round_no };
}
async function wrongIds(roomId, uid, n, sameGroup = null) {
  const c = await correctId(roomId, uid);
  const g = (await one(`select group_id from public.answer_catalog where kind = $1 and item_id = $2`, [c.kind, c.id])).group_id;
  const rows = (await admin(`select item_id from public.answer_catalog where kind = $1 and item_id <> $2
                              and ($4::boolean is null or (group_id = $3) = $4) order by item_id limit $5`,
    [c.kind, c.id, g, sameGroup, n])).rows;
  return { ...c, wrong: rows.map((x) => x.item_id) };
}
const guess = (uid, roomId, round, item) => rpc(uid, 'submit_guess', { p_room_id: roomId, p_round_no: round, p_item_id: item });
async function nextRound(roomId, uid) {
  await admin(`update public.rooms set next_round_at = now() - interval '1 second' where id = $1`, [roomId]);
  return rpc(uid, 'advance_if_due', { p_room_id: roomId });
}
async function setupMatch(host, others, opts) {
  const r = await rpc(host, 'create_room', opts);
  for (const o of others) {
    await rpc(o, 'join_room', { p_code: r.code });
    await rpc(o, 'set_ready', { p_room_id: r.id, p_ready: true });
  }
  await rpc(host, 'start_match', { p_room_id: r.id });
  await startedAgo(r.id, 20);
  return r;
}
const revealN = async (uid, roomId, round, n) => { let last; for (let i = 0; i < n; i++) last = await rpc(uid, 'reveal_clue', { p_room_id: roomId, p_round_no: round }); return last; };
const result = async (roomId, uid) => one(`select rp_delta, rp_breakdown from public.match_results where room_id = $1 and user_id = $2`, [roomId, uid]);
const speed = (e) => Math.max(0, Math.min(20, Math.round((60 - Math.min(60, e || 30)) / 3)));
const base = (g) => ({ 1: 100, 2: 85, 3: 70, 4: 55, 5: 40, 6: 25 })[g];

const fingerprint = async () => (await one(`
  select md5(coalesce((select string_agg(p.oid::regprocedure::text || ':' || md5(p.prosrc) || ':' || coalesce(array_to_string(p.proacl, ','), '') || ':' || p.prosecdef || ':' || coalesce(array_to_string(p.proconfig, ','), ''), '|' order by 1)
                         from pg_proc p where p.pronamespace = 'public'::regnamespace), '')) as f,
         md5(coalesce((select string_agg(key || '=' || value, ',' order by key) from public.game_config), '')) as c,
         md5(coalesce((select string_agg(table_name || '.' || column_name || ':' || coalesce(column_default, ''), ',' order by table_name, column_name)
                         from information_schema.columns where table_schema = 'public'), '')) as cols,
         md5(coalesce((select string_agg(tablename || '.' || policyname || ':' || permissive || ':' || coalesce(qual, ''), ',' order by tablename, policyname) from pg_policies where schemaname in ('public', 'realtime')), '')) as pol,
         md5(coalesce((select string_agg(conname, ',' order by conname) from pg_constraint where connamespace = 'public'::regnamespace), '')) as con,
         md5(coalesce((select string_agg(tablename, ',' order by tablename) from pg_publication_tables where pubname = 'supabase_realtime'), '')) as pub,
         md5(coalesce((select string_agg(c.relname || ':' || coalesce(array_to_string(c.relacl, ','), ''), ',' order by c.relname)
                         from pg_class c where c.relnamespace = 'public'::regnamespace), '')) as acl`));

// =============================================================================
const P = [];
for (let i = 0; i < 8; i++) P.push(await makeUser(`zuser${i}`));
let oldLobby;
console.log('\n[0007 kurulumu]');
await test('0007 uygulanır (eski lobi odası korunur, ayarları kapalı); ikinci kez çalıştırılınca parmak izi aynı', async () => {
  oldLobby = await rpc(P[7], 'create_room', { p_mode: 'duel' });
  await db.exec(read(MIG7));
  const a = await fingerprint();
  await admin(`update public.game_config set value = 1.3 where key = 'rp_zorluk_carpan_1'`);   // ayarlanmış değer korunmalı
  const a2 = await fingerprint();
  ok(JSON.stringify(a) !== JSON.stringify(a2));
  await db.exec(read(MIG7));
  eq(await fingerprint(), a2);
  eq(await num(`select value from public.game_config where key = 'rp_zorluk_carpan_1'`), 1.3);
  await admin(`update public.game_config set value = 1.25 where key = 'rp_zorluk_carpan_1'`);
  const r = await one(`select tek_hak, kategori_gizli from public.rooms where id = $1`, [oldLobby.id]);
  eq([r.tek_hak, r.kategori_gizli], [false, false]);
  await rpc(P[7], 'leave_room', { p_room_id: oldLobby.id });
});

await test('İmzalar: create_room / update_room_settings / daily_begin tek sürüm (aşırı yükleme yok); güvenlik + search_path', async () => {
  for (const fn of ['create_room', 'update_room_settings', 'daily_begin', 'submit_guess', 'reveal_clue', 'daily_reveal_clue',
    'daily_submit_guess', 'get_daily_leaderboard', 'sinif_olustur', 'sinif_tahmin', '_finish_match', '_round_guess_rank', '_zorluk_carpan']) {
    const rows = (await admin(`select p.prosecdef, p.proconfig from pg_proc p where p.pronamespace = 'public'::regnamespace and p.proname = $1`, [fn])).rows;
    eq(rows.length, 1, fn + ' sürüm sayısı');
    ok(rows[0].prosecdef, fn + ' security definer');
    ok(String(rows[0].proconfig).includes('search_path=""'), fn + ' search_path');
  }
  for (const fn of ['reveal_clue', 'daily_reveal_clue', 'create_room', 'daily_begin']) {
    const r = await one(`select has_function_privilege('anon', p.oid, 'execute') a, has_function_privilege('authenticated', p.oid, 'execute') u
                           from pg_proc p where p.pronamespace = 'public'::regnamespace and p.proname = $1`, [fn]);
    eq([r.a, r.u], [false, true], fn + ' yetki');
  }
  for (const fn of ['_zorluk_carpan', '_finish_match', '_round_guess_rank', '_daily_record']) {
    const r = await one(`select has_function_privilege('authenticated', p.oid, 'execute') u from pg_proc p where p.pronamespace = 'public'::regnamespace and p.proname = $1`, [fn]);
    eq(r.u, false, fn + ' iç fonksiyon');
  }
});

console.log('\n[Eski istemci uyumu]');
await test('Eski çağrılar aynen çalışır: create_room (8 ad), update_room_settings (6 ad), daily_begin(p_target)', async () => {
  const r = await rpc(P[0], 'create_room', { p_mode: 'ffa', p_format: null, p_target_type: 'diagnosis', p_capacity: 4,
    p_round_count: 3, p_visibility: 'private', p_round_time_limit_sec: null, p_bracket_seeding: 'random' });
  eq([r.tek_hak, r.kategori_gizli], [false, false]);
  const u = await rpc(P[0], 'update_room_settings', { p_room_id: r.id, p_round_count: 4 });
  eq([u.round_count, u.tek_hak, u.changed], [4, false, true]);
  const probe = await expectErr(rpc(P[0], 'update_room_settings', { p_room_id: '00000000-0000-0000-0000-000000000000' }), 'ROOM_NOT_FOUND');
  ok(probe);
  await rpc(P[0], 'leave_room', { p_room_id: r.id });
  await admin(`select set_config('psikovaka.test_today', '2026-08-01', false)`);
  const d = await rpc(P[6], 'daily_begin', { p_target: 'therapy' });
  eq([d.status, d.tek_hak, d.kategori_gizli, d.guesses_left, d.clues_opened, d.zorluk_kilitli], ['in_progress', false, false, 6, 1, false]);
});

console.log('\n[Özel oda: ayarlar]');
await test('create_room p_tek_hak / p_kategori_gizli; update_room_settings yalnızca host, lobi; hazır olanlar sıfırlanır', async () => {
  const r = await rpc(P[0], 'create_room', { p_mode: 'duel', p_tek_hak: true });
  eq([r.tek_hak, r.kategori_gizli], [true, false]);
  await rpc(P[1], 'join_room', { p_code: r.code });
  await rpc(P[1], 'set_ready', { p_room_id: r.id, p_ready: true });
  await expectErr(rpc(P[1], 'update_room_settings', { p_room_id: r.id, p_kategori_gizli: true }), 'NOT_HOST');
  const u = await rpc(P[0], 'update_room_settings', { p_room_id: r.id, p_kategori_gizli: true });
  eq([u.tek_hak, u.kategori_gizli, u.changed], [true, true, true]);
  eq((await one(`select is_ready from public.room_players where room_id = $1 and user_id = $2`, [r.id, P[1]])).is_ready, false);
  const u2 = await rpc(P[0], 'update_room_settings', { p_room_id: r.id, p_tek_hak: false });
  eq([u2.tek_hak, u2.kategori_gizli], [false, true]);
  const st = await rpc(P[1], 'get_room_state', { p_room_id: r.id });
  eq([st.room.tek_hak, st.room.kategori_gizli], [false, true], 'get_room_state.room');
  await rpc(P[1], 'set_ready', { p_room_id: r.id, p_ready: true });
  await rpc(P[0], 'start_match', { p_room_id: r.id });
  await expectErr(rpc(P[0], 'update_room_settings', { p_room_id: r.id, p_tek_hak: true }), 'ALREADY_STARTED');
  await rpc(P[0], 'leave_room', { p_room_id: r.id }); await rpc(P[1], 'leave_room', { p_room_id: r.id });
});

await test('Hızlı eşleşme her zaman normal kurallar (kısıt: hızlı odada ayar açılamaz; ayar RPC\'si QUICK_ROOM)', async () => {
  const qm = await rpc(P[2], 'quick_match', { p_mode: 'duel', p_target: 'diagnosis' });
  eq([qm.room.tek_hak, qm.room.kategori_gizli], [false, false]);
  await expectErr(rpc(P[2], 'update_room_settings', { p_room_id: qm.room_id, p_tek_hak: true }), 'QUICK_ROOM');
  await expectErr(admin(`update public.rooms set tek_hak = true where id = $1`, [qm.room_id]), /rooms_quick_normal/);
  await rpc(P[2], 'leave_room', { p_room_id: qm.room_id });
});

console.log('\n[Özel oda: tek tahmin hakkı]');
let duel;
await test('Tek hak: yanlış ilk tahmin turu bitirir (başarısız); ikinci tahmin ALREADY_FINISHED; guesses_left 0', async () => {
  duel = await setupMatch(P[0], [P[1]], { p_mode: 'duel', p_round_count: 3, p_tek_hak: true });
  const w = await wrongIds(duel.id, P[1], 2);
  const g = await guess(P[1], duel.id, w.round, w.wrong[0]);
  eq([g.is_correct, g.finished, g.won, g.guesses_left, g.points, g.clues_opened], [false, true, false, 0, 0, 1]);
  await expectErr(guess(P[1], duel.id, w.round, w.wrong[1]), 'ALREADY_FINISHED');
  await expectErr(rpc(P[1], 'reveal_clue', { p_room_id: duel.id, p_round_no: w.round }), 'ALREADY_FINISHED');
  const rp = await one(`select finish_reason, guess_count from public.round_players where room_id = $1 and round_no = $2 and user_id = $3`, [duel.id, w.round, P[1]]);
  eq([rp.finish_reason, rp.guess_count], ['failed', 1]);
});
await test('Tek hak: reveal_clue 2…6, sonra NO_MORE_CLUES; doğru tahmin puanı açılan ipucuna göre (3. ipucu → 70 + hız)', async () => {
  const c = await correctId(duel.id, P[0]);
  const r2 = await revealN(P[0], duel.id, c.round, 2);
  eq(r2.clues_opened, 3);
  const g = await guess(P[0], duel.id, c.round, c.id);
  eq([g.is_correct, g.finished, g.clues_opened], [true, true, 3]);
  eq(g.points, base(3) + speed(g.elapsed_sec), 'puan');
  // tur kapandı → sonraki tur: 6 ipucuna kadar aç
  await nextRound(duel.id, P[0]);
  await startedAgo(duel.id, 20);
  const c2 = await correctId(duel.id, P[0]);
  const r5 = await revealN(P[0], duel.id, c2.round, 5);
  eq(r5.clues_opened, 6);
  await expectErr(rpc(P[0], 'reveal_clue', { p_room_id: duel.id, p_round_no: c2.round }), 'NO_MORE_CLUES');
  await expectErr(rpc(P[0], 'reveal_clue', { p_room_id: duel.id, p_round_no: c2.round + 1 }), 'ROUND_CLOSED');
  await expectErr(rpc(P[3], 'reveal_clue', { p_room_id: duel.id, p_round_no: c2.round }), 'NOT_MEMBER');
  const g2 = await guess(P[0], duel.id, c2.round, c2.id);
  eq(g2.points, base(6) + speed(g2.elapsed_sec));
  // rakip yanlış → tur 2 kapanır; tur 3: ikisi de 1. ipucunda çözer
  const w = await wrongIds(duel.id, P[1], 1);
  await guess(P[1], duel.id, w.round, w.wrong[0]);
  await nextRound(duel.id, P[0]);
  await startedAgo(duel.id, 20);
  const c3 = await correctId(duel.id, P[0]);
  await guess(P[0], duel.id, c3.round, c3.id);
  await guess(P[1], duel.id, c3.round, c3.id);
  eq((await one(`select status from public.rooms where id = $1`, [duel.id])).status, 'finished');
});
await test('Elo bonusu ×1,25 (tek ayar): g3 6→8 (7,5 yuvarlanır), g6 1→1 (1,25), g1 10→13 (12,5); −10 ve sıralama primi aynı', async () => {
  const a = await result(duel.id, P[0]);
  const bd = a.rp_breakdown;
  eq(bd.zorluk_carpani, 1.25);
  eq(bd.zorluk, { tek_hak: true, kategori_gizli: false });
  eq(bd.rounds.map((x) => [x.outcome, x.delta, x.base ?? null]), [['g3', 8, 6], ['g6', 1, null], ['g1', 13, 10]]);
  eq(bd.placement, 10);
  eq(a.rp_delta, 8 + 1 + 13 + 10);
  const b = await result(duel.id, P[1]);
  eq(b.rp_breakdown.rounds.map((x) => [x.outcome, x.delta]), [['fail', -10], ['fail', -10], ['g1', 13]]);
  eq(b.rp_delta, -10 - 10 + 13);
});

await test('Normal özel oda (ayarlar kapalı): reveal_clue SINGLE_GUESS_OFF, 6 tahmin hakkı, çarpan 1 ve "base" alanı yok', async () => {
  const r = await setupMatch(P[2], [P[3]], { p_mode: 'duel', p_round_count: 1 });
  const c = await correctId(r.id, P[2]);
  await expectErr(rpc(P[2], 'reveal_clue', { p_room_id: r.id, p_round_no: c.round }), 'SINGLE_GUESS_OFF');
  const w = await wrongIds(r.id, P[2], 1);
  const g = await guess(P[2], r.id, w.round, w.wrong[0]);
  eq([g.finished, g.guesses_left], [false, 5]);
  await guess(P[2], r.id, c.round, c.id);
  await guess(P[3], r.id, c.round, c.id);
  const a = await result(r.id, P[2]);
  eq(a.rp_breakdown.zorluk_carpani, 1);
  eq(a.rp_breakdown.rounds.map((x) => [x.outcome, x.delta, x.base ?? null]), [['g2', 8, null]]);
  eq(a.rp_delta, 8, 'rakip 1. tahminde çözdü: sıralama primi rakibin');
});

console.log('\n[Özel oda: kategori gizli]');
await test('Kategori gizli: aynı gruptan yanlış tahmin → same_group false (yanıt, round_guesses, get_room_state.my_guesses); normal odada true', async () => {
  const r = await setupMatch(P[4], [P[5]], { p_mode: 'duel', p_round_count: 1, p_kategori_gizli: true });
  const w = await wrongIds(r.id, P[4], 1, true);
  ok(w.wrong.length === 1, 'aynı gruptan yanlış seçenek bulunmalı');
  const g = await guess(P[4], r.id, w.round, w.wrong[0]);
  eq([g.is_correct, g.same_group, g.finished], [false, false, false]);
  eq((await one(`select same_group from public.round_guesses where room_id = $1 and user_id = $2`, [r.id, P[4]])).same_group, false);
  const st = await rpc(P[4], 'get_room_state', { p_room_id: r.id });
  eq(st.my_guesses.map((x) => x.same_group), [false]);
  ok(!/"(category|group_id|course)"/.test(JSON.stringify(st) + JSON.stringify(g)), 'yanıtta kategori/grup alanı yok');
  // Elo ×1,25: 2. tahminde çözdü (g2 8 → 10)
  const c = await correctId(r.id, P[4]);
  await guess(P[4], r.id, c.round, c.id);
  await guess(P[5], r.id, c.round, c.id);
  const a = await result(r.id, P[4]);
  eq(a.rp_breakdown.rounds.map((x) => [x.outcome, x.delta, x.base]), [['g2', 10, 8]]);
  // karşılaştırma: normal oda aynı grubu söyler
  const n = await setupMatch(P[4], [P[5]], { p_mode: 'duel', p_round_count: 1 });
  const wn = await wrongIds(n.id, P[4], 1, true);
  eq((await guess(P[4], n.id, wn.round, wn.wrong[0])).same_group, true);
  await rpc(P[4], 'leave_room', { p_room_id: n.id }); await rpc(P[5], 'leave_room', { p_room_id: n.id });
});

console.log('\n[Özel oda: ikisi birden, FFA + kombo]');
await test('İki ayar ×1,5: FFA 3 kişi, kombo; tek hak aşama başına 1 tahmin, puan/Elo ipucu sayısına göre; ffa 2. primi aynı', async () => {
  const r = await setupMatch(P[0], [P[1], P[2]], { p_mode: 'ffa', p_capacity: 3, p_round_count: 1, p_target_type: 'combo', p_tek_hak: true, p_kategori_gizli: true });
  const solveCombo = async (u, extra) => {
    const c0 = await correctId(r.id, u);
    if (extra) await revealN(u, r.id, c0.round, extra);
    let last;
    for (let s = 0; s < 3; s++) { const c = await correctId(r.id, u); last = await guess(u, r.id, c.round, c.id); if (s < 2) eq([last.finished, last.next_stage], [false, s + 2]); }
    return last;
  };
  const a = await solveCombo(P[0], 0);
  eq(a.points, base(1) + speed(a.elapsed_sec));
  const b = await solveCombo(P[1], 3);            // 4. ipucunda
  eq(b.points, base(4) + speed(b.elapsed_sec));
  // P[2]: aşama 1 doğru, aşama 2 yanlış → başarısız
  const c1 = await correctId(r.id, P[2]);
  await guess(P[2], r.id, c1.round, c1.id);
  const w2 = await wrongIds(r.id, P[2], 1);
  const f = await guess(P[2], r.id, w2.round, w2.wrong[0]);
  eq([f.finished, f.won, f.same_group], [true, false, false]);
  const ra = await result(r.id, P[0]), rb = await result(r.id, P[1]), rc = await result(r.id, P[2]);
  eq(ra.rp_breakdown.zorluk_carpani, 1.5);
  eq(ra.rp_breakdown.rounds.map((x) => [x.outcome, x.delta, x.base]), [['g1', 15, 10]]);
  eq(ra.rp_delta, 15 + 15);                       // ffa 1. primi +15 (çarpılmaz)
  eq(rb.rp_breakdown.rounds.map((x) => [x.outcome, x.delta, x.base]), [['g4', 6, 4]]);
  eq(rb.rp_delta, 6 + 5);                         // ffa 2. primi +5
  eq(rc.rp_breakdown.rounds.map((x) => [x.outcome, x.delta, x.base ?? null]), [['fail', -10, null]]);
  eq(rc.rp_delta, -10);
});

await test('Ayrılan oyuncu: kalan turlar −10 (çarpan yok), pozitif kalemleri silinir; kalan oyuncu turun bonuslu Elo\'sunu alır', async () => {
  const r = await setupMatch(P[3], [P[4]], { p_mode: 'duel', p_round_count: 4, p_tek_hak: true, p_kategori_gizli: true });
  const c = await correctId(r.id, P[3]);
  await guess(P[3], r.id, c.round, c.id);
  await guess(P[4], r.id, c.round, c.id);
  await nextRound(r.id, P[3]); await startedAgo(r.id, 20);
  const c2 = await correctId(r.id, P[3]);
  await guess(P[3], r.id, c2.round, c2.id);
  await guess(P[4], r.id, c2.round, c2.id);
  await nextRound(r.id, P[3]); await startedAgo(r.id, 20);
  await rpc(P[4], 'leave_room', { p_room_id: r.id });
  const lv = await result(r.id, P[4]);
  eq(lv.rp_breakdown.voided, false);
  eq(lv.rp_delta, 15 + 15 + 5 * 0 - 10 - 10, 'yarısı oynandı: kural tetiklenmez, ayrılan kalan iki turu −10 öder');
  const st = await result(r.id, P[3]);
  ok(st.rp_breakdown.rounds.filter((x) => x.outcome === 'g1').every((x) => x.delta === 15), 'kalan: g1 15');
  eq(st.rp_breakdown.placement, 10);
});

console.log('\n[Günün vakası]');
const day = '2026-09-10';
await admin(`select set_config('psikovaka.test_today', $1, false)`, [day]);
const dkey = async (t) => one(`select k.* from public.daily_challenges d join public.cases_answer_key k on k.case_id = d.case_id where d.challenge_date = $1 and d.target_type = $2`, [day, t]);
const dWrong = async (t, sameGroup = null) => {
  const k = await dkey(t); const kind = t === 'combo' ? 'diagnosis' : t; const id = k[kind + '_id'];
  const g = (await one(`select group_id from public.answer_catalog where kind = $1 and item_id = $2`, [kind, id])).group_id;
  return { id, wrong: (await admin(`select item_id from public.answer_catalog where kind = $1 and item_id <> $2 and ($4::boolean is null or (group_id = $3) = $4) order by item_id limit 3`, [kind, id, g, sameGroup])).rows.map((x) => x.item_id) };
};
await test('daily_begin zorluk: ilk tahmine kadar değiştirilebilir; ek ipucundan sonra kilitli (sessizce yok sayılır)', async () => {
  let d = await rpc(P[0], 'daily_begin', { p_target: 'diagnosis', p_tek_hak: true });
  eq([d.tek_hak, d.kategori_gizli, d.guesses_left, d.zorluk_kilitli], [true, false, 1, false]);
  d = await rpc(P[0], 'daily_begin', { p_target: 'diagnosis', p_tek_hak: false, p_kategori_gizli: true });
  eq([d.tek_hak, d.kategori_gizli, d.guesses_left], [false, true, 6]);
  d = await rpc(P[0], 'daily_begin', { p_target: 'diagnosis', p_tek_hak: true });
  eq([d.tek_hak, d.kategori_gizli], [true, true], 'verilmeyen ayar korunur');
  await expectErr(rpc(P[1], 'daily_reveal_clue', { p_target: 'diagnosis' }), 'DAILY_NOT_STARTED');
  const rc = await rpc(P[0], 'daily_reveal_clue', { p_target: 'diagnosis' });
  eq([rc.clues_opened, rc.zorluk_kilitli], [2, true]);
  d = await rpc(P[0], 'daily_begin', { p_target: 'diagnosis', p_tek_hak: false, p_kategori_gizli: false });
  eq([d.tek_hak, d.kategori_gizli, d.zorluk_kilitli, d.clues_opened], [true, true, true, 2], 'kilitli');
  const s = await rpc(P[0], 'get_daily_challenge', { p_target: 'diagnosis' });
  eq([s.tek_hak, s.clues_opened], [true, 2]);
});
await test('Günlük tek hak + gizli: aynı gruptan yanlış → same_group false, bitti; ikinci tahmin DAILY_ALREADY_FINISHED; Elo yok', async () => {
  const rpBefore = await num(`select ranked_points from public.profiles where id = $1`, [P[0]]);
  const w = await dWrong('diagnosis', true);
  const g = await rpc(P[0], 'daily_submit_guess', { p_target: 'diagnosis', p_item_id: w.wrong[0] });
  eq([g.correct, g.same_group, g.finished, g.won, g.guesses_left, g.tek_hak, g.kategori_gizli], [false, false, true, false, 0, true, true]);
  await expectErr(rpc(P[0], 'daily_submit_guess', { p_target: 'diagnosis', p_item_id: w.id }), 'DAILY_ALREADY_FINISHED');
  await expectErr(rpc(P[0], 'daily_reveal_clue', { p_target: 'diagnosis' }), 'DAILY_ALREADY_FINISHED');
  eq((await one(`select same_group from public.daily_guesses where user_id = $1 and challenge_date = $2`, [P[0], day])).same_group, false);
  eq(await num(`select ranked_points from public.profiles where id = $1`, [P[0]]), rpBefore);
  const r = await one(`select tek_hak, kategori_gizli, guess_count from public.daily_results where user_id = $1 and challenge_date = $2 and target_type = 'diagnosis'`, [P[0], day]);
  eq([r.tek_hak, r.kategori_gizli, r.guess_count], [true, true, 2], 'tek hakta guess_count = açılan ipucu');
});
await test('Günlük tek hak kazanç: 3. ipucunda doğru → 70 + hız; sıralama kuralı aynı (guess_count = ipucu), satırda zorluk', async () => {
  await rpc(P[1], 'daily_begin', { p_target: 'diagnosis', p_tek_hak: true });
  await rpc(P[1], 'daily_reveal_clue', { p_target: 'diagnosis' });
  await rpc(P[1], 'daily_reveal_clue', { p_target: 'diagnosis' });
  const w = await dWrong('diagnosis');
  const g = await rpc(P[1], 'daily_submit_guess', { p_target: 'diagnosis', p_item_id: w.id });
  eq([g.correct, g.finished, g.won, g.clues_opened], [true, true, true, 3]);
  eq(g.points, base(3) + speed(g.time_sec));
  // normal oyuncu: 2. tahminde (önce yanlış) → guess_count 2 → tek hakkı 3. ipucunda kullanan oyuncunun önünde
  await rpc(P[2], 'daily_begin', { p_target: 'diagnosis' });
  await rpc(P[2], 'daily_submit_guess', { p_target: 'diagnosis', p_item_id: w.wrong[0] });
  await rpc(P[2], 'daily_submit_guess', { p_target: 'diagnosis', p_item_id: w.id });
  // normal oyuncu 4 tahmin → arkada
  await rpc(P[3], 'daily_begin', { p_target: 'diagnosis' });
  for (const x of w.wrong) await rpc(P[3], 'daily_submit_guess', { p_target: 'diagnosis', p_item_id: x });
  await rpc(P[3], 'daily_submit_guess', { p_target: 'diagnosis', p_item_id: w.id });
  const lb = await rpc(P[1], 'get_daily_leaderboard', { p_target: 'diagnosis' });
  eq(lb.rows.map((x) => [x.user_id === P[2] ? 'n2' : x.user_id === P[1] ? 't3' : x.user_id === P[3] ? 'n4' : 'kayip', x.guesses_used, x.tek_hak, x.kategori_gizli]),
    [['n2', 2, false, false], ['t3', 3, true, false], ['n4', 4, false, false], ['kayip', 2, true, true]]);
  eq([lb.me.tek_hak, lb.me.guesses_used], [true, 3]);
});
await test('Günlük normal (ayarsız) değişmedi: daily_reveal_clue SINGLE_GUESS_OFF; aynı grup bilgisi döner', async () => {
  await rpc(P[4], 'daily_begin', { p_target: 'diagnosis' });
  await expectErr(rpc(P[4], 'daily_reveal_clue', { p_target: 'diagnosis' }), 'SINGLE_GUESS_OFF');
  const w = await dWrong('diagnosis', true);
  const g = await rpc(P[4], 'daily_submit_guess', { p_target: 'diagnosis', p_item_id: w.wrong[0] });
  eq([g.same_group, g.finished, g.guesses_left], [true, false, 5]);
});

console.log('\n[Sınıf modu]');
async function sinifKey(oid) {
  return one(`select t.tur_no, k.diagnosis_id, c.group_id from public.sinif_oturumlari o
                join public.sinif_turlari t on t.oturum_id = o.id and t.tur_no = o.tur_no
                join public.cases_answer_key k on k.case_id = t.case_id
                join public.answer_catalog c on c.kind = 'diagnosis' and c.item_id = k.diagnosis_id where o.id = $1`, [oid]);
}
async function setElapsed(oid, sec) {
  await admin(`update public.sinif_oturumlari set tur_baslangic = now() - make_interval(secs => $2),
                      tur_son = now() - make_interval(secs => $2) + make_interval(secs => 6 * ipucu_araligi_sn) where id = $1`, [oid, sec]);
  await admin(`update public.sinif_turlari t set baslangic = o.tur_baslangic, son = o.tur_son
                 from public.sinif_oturumlari o where o.id = t.oturum_id and t.tur_no = o.tur_no and o.id = $1`, [oid]);
}
await test('sinif_olustur tek_hak → tahmin_hakki 1 (verilen 3 yok sayılır); ayarlar JSON\'da tek_hak/kategori_gizli; geçersiz tür INVALID_SETTINGS', async () => {
  const s = await rpc(P[5], 'sinif_olustur', { p_ayarlar: { vaka_sayisi: 3, tahmin_hakki: 3, tek_hak: true, kategori_gizli: true } });
  eq([s.ayarlar.tahmin_hakki, s.ayarlar.tek_hak, s.ayarlar.kategori_gizli], [1, true, true]);
  const s2 = await rpc(P[5], 'sinif_olustur', { p_ayarlar: { vaka_sayisi: 3 } });
  eq([s2.ayarlar.tahmin_hakki, s2.ayarlar.tek_hak, s2.ayarlar.kategori_gizli], [3, false, false]);
  await expectErr(rpc(P[5], 'sinif_olustur', { p_ayarlar: { tek_hak: 'evet' } }), 'INVALID_SETTINGS');
  await rpc(P[5], 'sinif_bitir', { p_oturum: s2.oturum_id });
  // tek hak + gizli: aynı gruptan yanlış → same_group false, hak biter
  const A = await makeAnon();
  await rpc(A, 'sinif_katil', { p_kod: s.kod, p_takma_ad: 'Ada' });
  await rpc(P[5], 'sinif_basla', { p_oturum: s.oturum_id });
  await setElapsed(s.oturum_id, 5);
  const k = await sinifKey(s.oturum_id);
  const w = (await admin(`select item_id from public.answer_catalog where kind = 'diagnosis' and item_id <> $1 and group_id = $2 limit 1`, [k.diagnosis_id, k.group_id])).rows[0].item_id;
  const g = await rpc(A, 'sinif_tahmin', { p_oturum: s.oturum_id, p_item_id: w });
  eq([g.correct, g.same_group, g.done, g.guesses_left], [false, false, true, 0]);
  const d = await rpc(A, 'sinif_durum', { p_oturum: s.oturum_id });
  eq(d.ben.tahminlerim.map((x) => x.ayni_grup), [false]);
  eq([d.oturum.ayarlar.tek_hak, d.oturum.ayarlar.kategori_gizli], [true, true]);
  ok(!JSON.stringify(d).includes(k.group_id), 'durumda grup kimliği yok');
  await rpc(P[5], 'sinif_bitir', { p_oturum: s.oturum_id });
  await expectErr(admin(`update public.sinif_oturumlari set tahmin_hakki = 2 where id = $1`, [s.oturum_id]), /sinif_tek_hak_bir/);
});

console.log('\n[Anonim]');
await test('Anonim kullanıcı yeni RPC\'lerde ANON_IZINSIZ; girişsiz (anon rolü) yetkisiz', async () => {
  const A = await makeAnon();
  await expectErr(rpc(A, 'reveal_clue', { p_room_id: duel.id, p_round_no: 1 }), 'ANON_IZINSIZ');
  await expectErr(rpc(A, 'daily_reveal_clue', { p_target: 'diagnosis' }), 'ANON_IZINSIZ');
  await expectErr(rpc(A, 'daily_begin', { p_target: 'diagnosis', p_tek_hak: true }), 'ANON_IZINSIZ');
  await expectErr(rpc(A, 'create_room', { p_mode: 'duel', p_tek_hak: true }), 'ANON_IZINSIZ');
  await expectErr(rpc(null, 'reveal_clue', { p_room_id: duel.id, p_round_no: 1 }), /permission denied/);
});

console.log(`\nSonuç: ${passed} geçti, ${failed} kaldı`);
if (failed) console.log('Kalanlar:\n - ' + failures.join('\n - '));
await db.close();
process.exit(failed ? 1 : 0);
