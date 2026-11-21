// PsikoVaka — 0003 testleri: günlük vaka + seriler, hızlı eşleşme, RP v2
// (+ 0004: erken ayrılma kuralı ve günlük sıralama; 0003'ün tekrar testinden sonra uygulanır)
//
// Çalıştırma (supabase/tests klasöründe):
//   npm install
//   node daily_quick.test.mjs                         # PGlite
//   DATABASE_URL=postgres://... node daily_quick.test.mjs   # boş, atılabilir gerçek Postgres
//                                                          # (+ iki bağlantılı eşzamanlılık testleri)
// Gerçek Supabase projesine ASLA bağlamayın.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const readRaw = (p) => readFileSync(path.join(root, p), 'utf8');
// ILE_0006=1: 0005 her yüklendiğinde ardından 0006 da uygulanır (0006 sonrası geriye uyum denemesi)
const MIG6_YOL = ['migrations/0006_sinif_modu.sql', 'tools/0006_sinif_modu.sql.taslak'].find((p) => existsSync(path.join(root, p)));
const read = (p) => readRaw(p) + (process.env.ILE_0006 && p === 'migrations/0005_isim_filtresi.sql' && MIG6_YOL ? '\n' + readRaw(MIG6_YOL) : '');

async function connect() {
  if (process.env.DATABASE_URL) {
    const { default: pg } = await import('pg');
    const mk = async () => {
      const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
      await c.connect();
      return c;
    };
    const client = await mk();
    return { name: 'postgres (pg)', pg: true, mk, exec: (s) => client.query(s), query: (s, p) => client.query(s, p), close: () => client.end() };
  }
  const { PGlite } = await import('@electric-sql/pglite');
  const db = new PGlite();
  return { name: 'PGlite', pg: false, exec: (s) => db.exec(s), query: (s, p) => db.query(s, p), close: () => db.close() };
}

const db = await connect();
console.log(`Veritabanı: ${db.name}`);
await db.exec(read('tests/00_supabase_stubs.sql'));
await db.exec(read('migrations/0001_init.sql'));
await db.exec(read('seed/0002_cases_answer_key.sql'));
await db.exec(read('migrations/0002_online_ek.sql'));

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
const DENIED = /permission denied|row-level security/;

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
const setDay = (d) => admin(`select set_config('psikovaka.test_today', $1, false)`, [d || '']);
const addDays = (d, n) => { const x = new Date(d + 'T00:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };

const U = {};
async function makeUser(n) {
  const id = randomUUID();
  await admin(`insert into auth.users (id, email, raw_user_meta_data) values ($1, $2, '{}')`, [id, `d${n}@test.local`]);
  await rpc(id, 'set_username', { p_username: `duser${n}` });
  U[n] = id;
  return id;
}
const rp = async (uid) => (await one(`select ranked_points from public.profiles where id = $1`, [uid])).ranked_points;
const room = async (id) => one(`select * from public.rooms where id = $1`, [id]);
const speedBonus = (e) => Math.max(0, Math.min(20, Math.round((60 - Math.min(60, e || 30)) / 3)));
const base = (g) => ({ 1: 100, 2: 85, 3: 70, 4: 55, 5: 40, 6: 25 })[g] || 25;

// ---- günlük yardımcılar
async function dailyKey(day, target) {
  return one(`select k.* from public.daily_challenges d join public.cases_answer_key k on k.case_id = d.case_id
               where d.challenge_date = $1 and d.target_type = $2`, [day, target]);
}
const KINDS = ['diagnosis', 'therapy', 'pharmacology'];
async function dailyCorrect(uid, day, target) {
  const k = await dailyKey(day, target);
  const a = await one(`select stage from public.daily_attempts where user_id = $1 and challenge_date = $2 and target_type = $3`, [uid, day, target]);
  const kind = target === 'combo' ? KINDS[(a?.stage ?? 1) - 1] : target;
  return { kind, id: k[`${kind}_id`], key: k };
}
async function dailyWrong(uid, day, target, n) {
  const c = await dailyCorrect(uid, day, target);
  const rows = (await admin(`select item_id from public.answer_catalog where kind = $1 and item_id <> $2 order by item_id limit $3`, [c.kind, c.id, n])).rows;
  return { ...c, wrong: rows.map((x) => x.item_id) };
}
async function dailySolve(uid, day, target, wrongFirst = 0) {
  const c = await dailyWrong(uid, day, target, wrongFirst);
  for (const w of c.wrong) await rpc(uid, 'daily_submit_guess', { p_target: target, p_item_id: w });
  return rpc(uid, 'daily_submit_guess', { p_target: target, p_item_id: c.id });
}
async function dailyFail(uid, day, target) {
  const c = await dailyWrong(uid, day, target, 6);
  let last;
  for (const w of c.wrong) last = await rpc(uid, 'daily_submit_guess', { p_target: target, p_item_id: w });
  return last;
}

// ---- maç yardımcıları (scenario.test.mjs ile aynı)
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
async function wrongIds(roomId, uid, n) {
  const c = await correctId(roomId, uid);
  const rows = (await admin(`select item_id from public.answer_catalog where kind = $1 and item_id <> $2 order by item_id limit $3`,
    [c.kind, c.id, n])).rows;
  return { ...c, wrong: rows.map((x) => x.item_id) };
}
async function solve(roomId, uid, wrongFirst = 0) {
  const c = await wrongIds(roomId, uid, wrongFirst);
  for (const w of c.wrong) await rpc(uid, 'submit_guess', { p_room_id: roomId, p_round_no: c.round, p_item_id: w });
  return rpc(uid, 'submit_guess', { p_room_id: roomId, p_round_no: c.round, p_item_id: c.id });
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
async function setupMatch(host, others, opts) {
  const r = await rpc(host, 'create_room', opts);
  for (const o of others) {
    await rpc(o, 'join_room', { p_code: r.code });
    await rpc(o, 'set_ready', { p_room_id: r.id, p_ready: true });
  }
  await rpc(host, 'start_match', { p_room_id: r.id });
  return r;
}
const results = async (roomId) => (await admin(
  `select user_id, final_rank, rp_delta, rp_after, rp_breakdown, left_early from public.match_results where room_id = $1 order by final_rank`, [roomId])).rows;
const outcomes = (b) => b.rounds.map((x) => x.outcome);

// =============================================================================
console.log('\n[0003 kurulumu]');
let oldUser;
await test('0003 öncesi açılan hesap 250 RP; 0003 sonrası yeni hesap 0 RP (mevcutlar değişmez)', async () => {
  oldUser = await makeUser(0);
  eq(await rp(oldUser), 250);
  await db.exec(read('migrations/0003_gunluk_ve_hizli.sql'));
  eq(await rp(oldUser), 250, 'mevcut satır değişmemeli');
  for (let i = 1; i <= 16; i++) await makeUser(i);
  eq(await rp(U[1]), 0);
  eq(Number((await one(`select value from public.game_config where key = 'rp_default'`)).value), 0);
  eq((await one(`select column_default from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='ranked_points'`)).column_default, '0');
});
const fingerprint = async () => (await one(`
  select md5(coalesce((select string_agg(p.proname || ':' || md5(p.prosrc) || ':' || coalesce(array_to_string(p.proacl, ','), ''), '|' order by p.proname, p.oid)
                         from pg_proc p where p.pronamespace = 'public'::regnamespace), '')) as f,
         md5(coalesce((select string_agg(key || '=' || value, ',' order by key) from public.game_config), '')) as c,
         md5(coalesce((select string_agg(table_name || '.' || column_name || ':' || coalesce(column_default, ''), ',' order by table_name, column_name)
                         from information_schema.columns where table_schema = 'public'), '')) as cols,
         md5(coalesce((select string_agg(tablename || '.' || policyname, ',' order by tablename, policyname) from pg_policies where schemaname = 'public'), '')) as pol,
         md5(coalesce((select string_agg(conname, ',' order by conname) from pg_constraint where connamespace = 'public'::regnamespace), '')) as con,
         md5(coalesce((select string_agg(c.relname || ':' || coalesce(array_to_string(c.relacl, ','), ''), ',' order by c.relname)
                         from pg_class c where c.relnamespace = 'public'::regnamespace), '')) as acl`));
await test('0003 ikinci kez çalıştırılınca hiçbir şey değişmez (fonksiyon, yetki, ayar, sütun, politika, kısıt parmak izi)', async () => {
  await admin(`update public.game_config set value = 150 where key = 'quick_wait_timeout_sec'`);   // ayarlanmış değer korunmalı
  const a = await fingerprint();
  await db.exec(read('migrations/0003_gunluk_ve_hizli.sql'));
  const b = await fingerprint();
  eq(b, a);
  eq(Number((await one(`select value from public.game_config where key = 'quick_wait_timeout_sec'`)).value), 150);
  await admin(`update public.game_config set value = 120 where key = 'quick_wait_timeout_sec'`);
});

console.log('\n[0004 kurulumu]');
const grantsOf = async () => (await admin(`
  select p.proname, coalesce(array_to_string(p.proacl, ','), '') as acl, p.prosecdef, array_to_string(p.proconfig, ',') as cfg
    from pg_proc p where p.pronamespace = 'public'::regnamespace and p.proname in ('_finish_match', 'get_daily_leaderboard')
   order by p.proname`)).rows;
const viewAcl = async () => (await one(`select coalesce(array_to_string(relacl, ','), '') as acl, reloptions::text as opt from pg_class where oid = 'public.daily_leaderboard'::regclass`));
let grants3, view3;
await test('0004 uygulanır; yetkiler, security definer ve search_path 0003 ile aynı; imzalar değişmez', async () => {
  grants3 = await grantsOf(); view3 = await viewAcl();
  const sig = async () => (await admin(`select p.oid::regprocedure::text as s, pg_get_function_result(p.oid) as r from pg_proc p
                                         where p.pronamespace = 'public'::regnamespace and p.proname in ('_finish_match', 'get_daily_leaderboard') order by 1`)).rows;
  const s3 = await sig();
  await db.exec(read('migrations/0004_kural_duzeltmeleri.sql'));
  eq(await sig(), s3, 'imza/dönüş');
  eq(await grantsOf(), grants3, 'fonksiyon yetkileri');
  eq(await viewAcl(), view3, 'görünüm yetkisi ve security_invoker');
  ok(grants3.every((g) => g.prosecdef && g.cfg === 'search_path=""'), JSON.stringify(grants3));
  ok(/authenticated=X/.test(grants3.find((g) => g.proname === 'get_daily_leaderboard').acl), 'authenticated çağırabilir');
  ok(!/(^|,)(anon|authenticated)=|(^|,)=X/.test(grants3.find((g) => g.proname === '_finish_match').acl), '_finish_match istemciye kapalı');
  ok((await one(`select prosrc from pg_proc where proname = '_finish_match'`)).prosrc.includes('erken_bitis'), '0004 gövdesi');
});
await test('0004 ikinci kez çalıştırılınca hiçbir şey değişmez (parmak izi)', async () => {
  const a = await fingerprint();
  await db.exec(read('migrations/0004_kural_duzeltmeleri.sql'));
  eq(await fingerprint(), a);
});

console.log('\n[0005 kurulumu (isim filtresi)]');
await test('0005 uygulanır ve ikinci kez çalıştırılınca hiçbir şey değişmez (parmak izi); bu dosyadaki adlar işaretlenmez', async () => {
  await db.exec(read('migrations/0005_isim_filtresi.sql'));
  const a = await fingerprint();
  await db.exec(read('migrations/0005_isim_filtresi.sql'));
  eq(await fingerprint(), a);
  eq(Number((await one(`select count(*) n from public.profiles where needs_rename`)).n), 0);
});

console.log('\n[Günlük: yetki]');
await test('anon yalnızca get_daily_challenge çağırabilir; diğer yeni RPC\'ler ve tablolar kapalı', async () => {
  await setDay('2026-03-01');
  const g = await rpc(null, 'get_daily_challenge', { p_target: 'diagnosis' });
  eq([g.status, g.guesses_used, g.won, g.points, g.day], ['not_started', 0, null, null, '2026-03-01']);
  ok(g.case_id, 'case_id dönmeli');
  ok(!('answer' in g), 'cevap yok');
  for (const [fn, args] of [['daily_begin', { p_target: 'diagnosis' }], ['daily_submit_guess', { p_target: 'diagnosis', p_item_id: 'mdd' }],
    ['daily_give_up', { p_target: 'diagnosis' }], ['get_daily_leaderboard', { p_target: 'diagnosis' }], ['get_my_streaks', {}],
    ['quick_match', { p_mode: 'duel' }], ['get_my_rp_history', {}]]) {
    await expectErr(rpc(null, fn, args), DENIED);
  }
  await expectErr(q(null, `select * from public.daily_attempts`), DENIED);
  await expectErr(q(null, `select * from public.daily_results`), DENIED);
  await expectErr(q(null, `select public._daily_today()`), DENIED);
});
await test('authenticated günlük deneme/tahmin tablolarını ve günün vakası tablosunu okuyamaz, yazamaz; iç fonksiyonları çağıramaz', async () => {
  await expectErr(q(U[1], `select * from public.daily_attempts`), DENIED);
  await expectErr(q(U[1], `select * from public.daily_guesses`), DENIED);
  await expectErr(q(U[1], `select * from public.daily_challenges`), DENIED);
  await expectErr(q(U[1], `insert into public.daily_results (user_id, challenge_date, target_type, case_id, won, guess_count, points, elapsed_sec)
                           values ($1, '2026-03-01', 'diagnosis', 'x', true, 1, 999, 1)`, [U[1]]), DENIED);
  await expectErr(q(U[1], `select public._daily_record($1, '2026-03-01', 'diagnosis')`, [U[1]]), DENIED);
  await expectErr(q(U[1], `select public._start_match_locked(gen_random_uuid())`), DENIED);
  await expectErr(q(U[1], `select public._quick_timeout_if_due(gen_random_uuid())`), DENIED);
});
await test('Test kancası (psikovaka.test_today) süper kullanıcı olmayan oturumda yok sayılır', async () => {
  eq((await one(`select public._daily_today()::text as d`)).d, '2026-03-01');
  const src = (await one(`select prosrc from pg_proc where proname = '_daily_today'`)).prosrc;
  ok(/rolsuper/.test(src) && /session_user/.test(src), 'süper kullanıcı koşulu');
  if (!db.pg) return;   // PGlite 'reset session authorization' desteklemiyor; davranış testi gerçek Postgres'te
  const real = (await one(`select ((now() at time zone 'Europe/Istanbul')::date)::text as d`)).d;
  await db.exec(`set session authorization authenticated`);
  try {
    await db.exec(`select set_config('psikovaka.test_today', '2026-03-01', false); select set_config('request.jwt.claims', '', false);`);
    const g = (await db.query(`select public.get_daily_challenge('diagnosis') as r`)).rows[0].r;
    eq(g.day, real, 'istemci oturumu gerçek İstanbul gününü görmeli');
  } finally { await db.exec(`reset session authorization`); }
  await setDay('2026-03-01');
});
console.log('\n[Günlük: vaka seçimi]');
await test('Aynı gün iki kullanıcı (ve misafir) aynı vakayı alır; INVALID_TARGET', async () => {
  const a = await rpc(U[1], 'get_daily_challenge', { p_target: 'diagnosis' });
  const b = await rpc(U[2], 'get_daily_challenge', { p_target: 'diagnosis' });
  const g = await rpc(null, 'get_daily_challenge', { p_target: 'diagnosis' });
  eq([a.case_id, b.case_id], [g.case_id, g.case_id]);
  eq((await one(`select count(*)::int as n from public.daily_challenges where challenge_date = '2026-03-01' and target_type = 'diagnosis'`)).n, 1);
  await expectErr(rpc(U[1], 'get_daily_challenge', { p_target: 'bogus' }), 'INVALID_TARGET');
  await expectErr(rpc(U[1], 'daily_begin', { p_target: null }), 'INVALID_TARGET');
});
await test('Farklı günler farklı olabilir; 40 gün boyunca aynı hedefte tekrar yok (60 günlük kural)', async () => {
  const ids = [];
  for (let i = 0; i < 40; i++) {
    await setDay(addDays('2025-01-01', i));
    ids.push((await rpc(null, 'get_daily_challenge', { p_target: 'therapy' })).case_id);
  }
  eq(new Set(ids).size, 40, 'tekrar olmamalı');
  await setDay('2026-03-01');
});
await test('Bütün aktif vakalar son 60 günde kullanılmışsa yine de vaka seçilir', async () => {
  const n = (await one(`select count(*)::int as n from public.cases_answer_key where is_active`)).n;
  await admin(`insert into public.daily_challenges (challenge_date, target_type, case_id)
               select '2024-06-30'::date - (row_number() over (order by case_id))::int, 'pharmacology', case_id
                 from public.cases_answer_key where is_active`);
  await setDay('2024-06-30');
  const g = await rpc(null, 'get_daily_challenge', { p_target: 'pharmacology' });
  ok(g.case_id, `vaka seçilmeli (${n} aktif)`);
  await setDay('2026-03-01');
});

console.log('\n[Günlük: oyun]');
const D1 = '2026-03-01';
await test('daily_submit_guess daily_begin\'den önce -> DAILY_NOT_STARTED; daily_begin idempotent, saati bir kez başlatır', async () => {
  await expectErr(rpc(U[1], 'daily_submit_guess', { p_target: 'diagnosis', p_item_id: 'mdd' }), 'DAILY_NOT_STARTED');
  await expectErr(rpc(U[1], 'daily_give_up', { p_target: 'diagnosis' }), 'DAILY_NOT_STARTED');
  const b1 = await rpc(U[1], 'daily_begin', { p_target: 'diagnosis' });
  eq([b1.status, b1.guesses_used, b1.guesses_left, b1.guesses, b1.answer, b1.stage], ['in_progress', 0, 6, [], null, 1]);
  const b2 = await rpc(U[1], 'daily_begin', { p_target: 'diagnosis' });
  eq(b2.started_at, b1.started_at);
  eq((await rpc(U[1], 'get_daily_challenge', { p_target: 'diagnosis' })).status, 'in_progress');
  eq((await rpc(null, 'get_daily_challenge', { p_target: 'diagnosis' })).status, 'not_started', 'misafir hep not_started');
});
await test('Kullanıcı adı olmadan günlük oynanamaz (USERNAME_REQUIRED)', async () => {
  const id = randomUUID();
  await admin(`insert into auth.users (id, email) values ($1, 'nouser@test.local')`, [id]);
  await expectErr(rpc(id, 'daily_begin', { p_target: 'diagnosis' }), 'USERNAME_REQUIRED');
});
await test('UNKNOWN_ITEM ve DUPLICATE_GUESS hak yemez; bitmeden hiçbir yanıtta cevap yok', async () => {
  await expectErr(rpc(U[1], 'daily_submit_guess', { p_target: 'diagnosis', p_item_id: 'yok_boyle' }), 'UNKNOWN_ITEM');
  const c = await dailyWrong(U[1], D1, 'diagnosis', 1);
  const w = await rpc(U[1], 'daily_submit_guess', { p_target: 'diagnosis', p_item_id: c.wrong[0] });
  eq([w.correct, w.finished, w.won, w.points, w.answer, w.guesses_used, w.guesses_left, w.guess_no], [false, false, null, null, null, 1, 5, 1]);
  const e = await expectErr(rpc(U[1], 'daily_submit_guess', { p_target: 'diagnosis', p_item_id: c.wrong[0] }), 'DUPLICATE_GUESS');
  const bag = JSON.stringify([w, await rpc(U[1], 'daily_begin', { p_target: 'diagnosis' }), await rpc(U[1], 'get_daily_challenge', { p_target: 'diagnosis' }),
    e.message, e.detail, await rpc(U[1], 'get_daily_leaderboard', { p_target: 'diagnosis' })]);
  ok(!bag.includes(`"${c.id}"`) && !bag.includes(c.key.therapy_id) && !bag.includes(c.key.pharmacology_id), 'cevap sızmamalı');
  eq((await rpc(U[1], 'daily_begin', { p_target: 'diagnosis' })).guesses_used, 1);
});
await test('2. tahminde çözme: puan = 85 + hız bonusu (sunucu saati); cevap bitince döner', async () => {
  await admin(`update public.daily_attempts set started_at = now() - interval '12.3 seconds' where user_id = $1 and challenge_date = $2`, [U[1], D1]);
  const c = await dailyCorrect(U[1], D1, 'diagnosis');
  const r = await rpc(U[1], 'daily_submit_guess', { p_target: 'diagnosis', p_item_id: c.id });
  eq([r.correct, r.finished, r.won, r.guess_no, r.guesses_used, r.guesses_left], [true, true, true, 2, 2, 0]);
  ok(r.time_sec >= 12 && r.time_sec <= 14, `time ${r.time_sec}`);
  eq(r.points, 85 + speedBonus(r.time_sec));
  eq([r.answer.diagnosis_id, r.answer.therapy_id, r.answer.pharmacology_id], [c.key.diagnosis_id, c.key.therapy_id, c.key.pharmacology_id]);
  const st = await rpc(U[1], 'get_daily_challenge', { p_target: 'diagnosis' });
  eq([st.status, st.won, st.points, st.guesses_used], ['finished', true, r.points, 2]);
  const b = await rpc(U[1], 'daily_begin', { p_target: 'diagnosis' });
  eq([b.status, b.guesses.length, b.guesses[1].correct, !!b.answer], ['finished', 2, true, true]);
});
await test('Bitince tek sonuç: yeni tahmin / pes -> DAILY_ALREADY_FINISHED; daily_results tek satır', async () => {
  await expectErr(rpc(U[1], 'daily_submit_guess', { p_target: 'diagnosis', p_item_id: 'mdd' }), 'DAILY_ALREADY_FINISHED');
  await expectErr(rpc(U[1], 'daily_give_up', { p_target: 'diagnosis' }), 'DAILY_ALREADY_FINISHED');
  eq((await one(`select count(*)::int as n from public.daily_results where user_id = $1`, [U[1]])).n, 1);
});
await test('6 yanlış -> kayıp (0 puan), 7. tahmin reddedilir', async () => {
  await rpc(U[2], 'daily_begin', { p_target: 'diagnosis' });
  const last = await dailyFail(U[2], D1, 'diagnosis');
  eq([last.finished, last.won, last.points, last.guesses_used, last.guesses_left], [true, false, 0, 6, 0]);
  ok(last.answer && last.answer.diagnosis_id, 'bitince cevap');
  const c = await dailyCorrect(U[2], D1, 'diagnosis');
  await expectErr(rpc(U[2], 'daily_submit_guess', { p_target: 'diagnosis', p_item_id: c.id }), 'DAILY_ALREADY_FINISHED');
});
await test('Pes etme kayıp olarak biter ve cevabı döner', async () => {
  await rpc(U[3], 'daily_begin', { p_target: 'diagnosis' });
  const g = await rpc(U[3], 'daily_give_up', { p_target: 'diagnosis' });
  eq([g.status, g.won, g.points], ['finished', false, 0]);
  ok(g.answer.diagnosis_id);
});
await test('Günlük oyun RP ve maç sayısı vermez', async () => {
  const p = await one(`select ranked_points, matches_played, matches_won from public.profiles where id = $1`, [U[1]]);
  eq([p.ranked_points, p.matches_played, p.matches_won], [0, 0, 0]);
});
await test('Liderlik (0004): kazananlar > tahmin ↑ > süre ↑; kaybedenler tahmin ↓; me; total_players; cevap/case_id yok; limit', async () => {
  // U4: 1. tahminde ama yavaş; U5: 1. tahminde hızlı
  for (const u of [4, 5]) await rpc(U[u], 'daily_begin', { p_target: 'diagnosis' });
  await admin(`update public.daily_attempts set started_at = now() - interval '50 seconds' where user_id = $1 and challenge_date = $2`, [U[4], D1]);
  await admin(`update public.daily_attempts set started_at = now() - interval '5 seconds' where user_id = $1 and challenge_date = $2`, [U[5], D1]);
  await dailySolve(U[4], D1, 'diagnosis');
  await dailySolve(U[5], D1, 'diagnosis');
  const lb = await rpc(U[2], 'get_daily_leaderboard', { p_target: 'diagnosis' });
  eq(lb.total_players, 5);
  eq(lb.rows.map((r) => [r.rank, r.user_id, r.won]), [[1, U[5], true], [2, U[4], true], [3, U[1], true], [4, U[2], false], [5, U[3], false]]);
  // kaybedenler: çok tahmin önde (6 yanlış yapan 6 tahmin, pes eden 0)
  eq(lb.me.user_id, U[2]); eq(lb.me.rank, 4);
  ok(!JSON.stringify(lb).includes('case_id') && !JSON.stringify(lb).includes('diagnosis_id'), 'cevap/case_id yok');
  ok(['username', 'display_name', 'avatar', 'ranked_points', 'points', 'time_sec'].every((k) => k in lb.rows[0]));
  const small = await rpc(U[9], 'get_daily_leaderboard', { p_target: 'diagnosis', p_limit: 2 });
  eq([small.rows.length, small.me, small.total_players], [2, null, 5]);
});
await test('Liderlik görünümü (daily_leaderboard) yeni sıralamayla tutarlı', async () => {
  const v = (await q(U[1], `select user_id, position from public.daily_leaderboard where challenge_date = $1 and target_type = 'diagnosis' order by position`, [D1])).rows;
  eq(v.map((x) => x.user_id), [U[5], U[4], U[1], U[2], U[3]]);
  eq(v.map((x) => Number(x.position)), [1, 2, 3, 4, 5]);
});
await test('Geçmiş gün sorgulanabilir (salt okunur), oynanmamış gün boş', async () => {
  await setDay('2026-03-02');
  const lb = await rpc(U[1], 'get_daily_leaderboard', { p_target: 'diagnosis', p_day: D1 });
  eq([lb.day, lb.total_players], [D1, 5]);
  const today = await rpc(U[1], 'get_daily_leaderboard', { p_target: 'diagnosis' });
  eq([today.day, today.total_players, today.rows, today.me], ['2026-03-02', 0, [], null]);
  eq((await rpc(U[1], 'get_daily_challenge', { p_target: 'diagnosis' })).status, 'not_started', 'yeni gün yeni deneme');
});
await test('Gece yarısını geçen deneme: dünkü bitmemiş deneme bugün erişilemez (DAILY_NOT_STARTED)', async () => {
  await setDay('2026-03-05');
  await rpc(U[6], 'daily_begin', { p_target: 'therapy' });
  await setDay('2026-03-06');
  await expectErr(rpc(U[6], 'daily_submit_guess', { p_target: 'therapy', p_item_id: 'cbt' }), 'DAILY_NOT_STARTED');
});

console.log('\n[Günlük: seriler]');
await test('Seri: art arda kazanç uzatır, kaçırılan gün ve kayıp sıfırlar; en iyi seri korunur; played_today', async () => {
  const u = U[7], t = 'pharmacology';
  const play = async (day, win) => {
    await setDay(day);
    await rpc(u, 'daily_begin', { p_target: t });
    if (win) await dailySolve(u, day, t); else await rpc(u, 'daily_give_up', { p_target: t });
  };
  const mine = async () => (await rpc(u, 'get_my_streaks')).find((x) => x.target === t);
  await setDay('2026-04-01');
  const s0 = await rpc(u, 'get_my_streaks');
  eq(s0.map((x) => x.target), ['diagnosis', 'therapy', 'pharmacology', 'combo']);
  eq(s0.map((x) => [x.current_streak, x.best_streak, x.last_day, x.played_today]), Array(4).fill([0, 0, null, false]));
  await play('2026-04-01', true);
  let s = await mine(); eq([s.current_streak, s.best_streak, s.played_today], [1, 1, true]);
  await play('2026-04-02', true);
  await play('2026-04-03', true);
  s = await mine(); eq([s.current_streak, s.best_streak, s.last_day], [3, 3, '2026-04-03']);
  await setDay('2026-04-04');
  s = await mine(); eq([s.current_streak, s.played_today], [3, false], 'dün oynandı: seri sürüyor');
  await setDay('2026-04-05');
  s = await mine(); eq([s.current_streak, s.best_streak], [0, 3], 'bir gün kaçtı: gösterilen seri 0');
  await play('2026-04-05', true);
  s = await mine(); eq([s.current_streak, s.best_streak], [1, 3]);
  await play('2026-04-06', false);
  s = await mine(); eq([s.current_streak, s.best_streak, s.played_today], [0, 3, true]);
  await play('2026-04-07', true);
  s = await mine(); eq([s.current_streak, s.best_streak], [1, 3]);
  const row = await one(`select current_streak, best_streak, last_day from public.solo_streaks where user_id = $1 and target_type = $2`, [u, t]);
  eq([row.current_streak, row.best_streak], [1, 3]);
  ok((await q(U[1], `select * from public.solo_streaks where user_id = $1`, [u])).rows.length === 1, 'seriler herkese okunur (0001)');
  await expectErr(q(u, `update public.solo_streaks set best_streak = 99 where user_id = $1`, [u]), DENIED);
  // hedefler bağımsız
  eq((await rpc(u, 'get_my_streaks')).find((x) => x.target === 'diagnosis').best_streak, 0);
});

console.log('\n[Günlük: kombo]');
await test('Kombo günlük: aşamalar tanı -> terapi -> ilaç; puan = taban ortalaması + hız bonusu', async () => {
  const day = '2026-05-01'; await setDay(day);
  const u = U[8];
  const b = await rpc(u, 'daily_begin', { p_target: 'combo' });
  eq(b.stage, 1);
  await admin(`update public.daily_attempts set started_at = now() - interval '20.2 seconds' where user_id = $1 and challenge_date = $2`, [u, day]);
  let r = await dailySolve(u, day, 'combo', 1);       // tanı 2. tahminde
  eq([r.correct, r.stage, r.next_stage, r.stage_completed, r.finished, r.answer], [true, 1, 2, true, false, null]);
  r = await dailySolve(u, day, 'combo', 0);           // terapi 1.
  eq([r.stage, r.next_stage], [2, 3]);
  eq((await rpc(u, 'daily_begin', { p_target: 'combo' })).stage, 3);
  r = await dailySolve(u, day, 'combo', 2);           // ilaç 3.
  eq([r.stage, r.next_stage, r.finished, r.won, r.guesses_used], [3, null, true, true, 6]);
  eq(r.points, Math.round((85 + 100 + 70) / 3) + speedBonus(r.time_sec));
  const g = (await rpc(u, 'daily_begin', { p_target: 'combo' })).guesses;
  eq(g.map((x) => x.stage), [1, 1, 2, 3, 3, 3]);
});
await test('Kombo günlük: 2. aşamada 6 yanlış -> kayıp', async () => {
  const day = '2026-05-01', u = U[9];
  await rpc(u, 'daily_begin', { p_target: 'combo' });
  await dailySolve(u, day, 'combo', 0);
  const last = await dailyFail(u, day, 'combo');
  eq([last.stage, last.finished, last.won, last.points, last.guesses_used], [2, true, false, 0, 7]);
});

console.log('\n[Hızlı eşleşme]');
await setDay('');
let qd;
await test('İlk çağıran oda kurar (bekler); ikinci katılır ve maç sunucuda otomatik başlar', async () => {
  const a = await rpc(U[1], 'quick_match', { p_mode: 'duel', p_target: 'diagnosis' });
  eq([a.created, a.players, a.capacity, a.status], [true, 1, 2, 'lobby']);
  const r0 = await room(a.room_id);
  eq([r0.is_quick, r0.visibility, r0.format, r0.round_count, r0.round_time_limit_sec, r0.target_type], [true, 'private', 'rounds', 3, 180, 'diagnosis']);
  const b = await rpc(U[2], 'quick_match', { p_mode: 'duel', p_target: 'diagnosis' });
  eq([b.room_id, b.created, b.players, b.status], [a.room_id, false, 2, 'in_round']);
  const r = await room(a.room_id);
  eq([r.status, r.current_round, !!r.started_at], ['in_round', 1, true]);
  const pl = (await admin(`select user_id, played, is_ready from public.room_players where room_id = $1 order by joined_at`, [a.room_id])).rows;
  eq(pl.map((x) => [x.user_id, x.played, x.is_ready]), [[U[1], true, true], [U[2], true, true]]);
  const rr = await one(`select count(*)::int as n from public.round_players where room_id = $1 and round_no = 1`, [a.room_id]);
  eq(rr.n, 2);
  const rnd = await one(`select starts_at > now() as future from public.room_rounds where room_id = $1 and round_no = 1`, [a.room_id]);
  eq(rnd.future, true, 'geri sayım (starts_at) ileride');
  qd = a;
});
await test('Üçüncü çağıran yeni oda kurar', async () => {
  const c = await rpc(U[3], 'quick_match', { p_mode: 'duel', p_target: 'diagnosis' });
  eq([c.created, c.players], [true, 1]);
  ok(c.room_id !== qd.room_id);
});
await test('Bekleyen kendi odası: aynı çağrı aynı odayı döner; başka hedef/oda -> ALREADY_IN_ROOM', async () => {
  const again = await rpc(U[3], 'quick_match', { p_mode: 'duel', p_target: 'diagnosis' });
  eq([again.created, again.players], [false, 1]);
  const e = await expectErr(rpc(U[3], 'quick_match', { p_mode: 'duel', p_target: 'therapy' }), 'ALREADY_IN_ROOM');
  eq(e.detail, again.code);
  await expectErr(rpc(U[1], 'quick_match', {}), 'ALREADY_IN_ROOM');   // maçta
  const nr = await rpc(U[4], 'create_room', { p_mode: 'duel' });
  await expectErr(rpc(U[4], 'quick_match', {}), 'ALREADY_IN_ROOM');
  await rpc(U[4], 'leave_room', { p_room_id: nr.id });
});
await test('INVALID_MODE / INVALID_TARGET; kullanıcı adı şart', async () => {
  await expectErr(rpc(U[5], 'quick_match', { p_mode: 'tournament' }), 'INVALID_MODE');
  await expectErr(rpc(U[5], 'quick_match', { p_mode: 'duel', p_target: 'x' }), 'INVALID_TARGET');
  const id = randomUUID();
  await admin(`insert into auth.users (id, email) values ($1, 'nouser2@test.local')`, [id]);
  await expectErr(rpc(id, 'quick_match', {}), 'USERNAME_REQUIRED');
});
await test('Hızlı odalar açık oda listesinde görünmez; üye olmayan okuyamaz', async () => {
  const pub = (await q(U[6], `select id from public.rooms where visibility = 'public' and status = 'lobby'`)).rows.map((x) => x.id);
  const waiting = (await one(`select room_id from public.room_players where user_id = $1 and is_current`, [U[3]])).room_id;
  ok(!pub.includes(waiting));
  eq((await q(U[6], `select * from public.rooms where id = $1`, [waiting])).rows.length, 0);
});
await test('Hızlı odada ayar değiştirilemez (QUICK_ROOM)', async () => {
  const waiting = (await one(`select room_id from public.room_players where user_id = $1 and is_current`, [U[3]])).room_id;
  await expectErr(rpc(U[3], 'update_room_settings', { p_room_id: waiting, p_visibility: 'public' }), 'QUICK_ROOM');
});
await test('Zaman aşımı: tek başına 120 sn bekleyen QUICK_TIMEOUT alır, oda kapanır; önce değil', async () => {
  const w = await rpc(U[3], 'quick_match', {});
  await admin(`update public.room_players set joined_at = now() - interval '100 seconds' where room_id = $1`, [w.room_id]);
  const hb0 = await rpc(U[3], 'heartbeat', { p_room_id: w.room_id });
  ok(!('error' in hb0), '120 sn dolmadan kapanmamalı');
  eq(hb0.status, 'lobby');
  await admin(`update public.room_players set joined_at = now() - interval '130 seconds' where room_id = $1`, [w.room_id]);
  const hb = await rpc(U[3], 'heartbeat', { p_room_id: w.room_id });
  eq([hb.ok, hb.error, hb.status], [false, 'QUICK_TIMEOUT', 'abandoned']);
  const r = await room(w.room_id);
  eq([r.status, r.close_reason], ['abandoned', 'quick_timeout']);
  const hb2 = await rpc(U[3], 'advance_if_due', { p_room_id: w.room_id });
  eq([hb2.ok, hb2.error], [false, 'QUICK_TIMEOUT'], 'kapalı odaya sonraki çağrı da aynı yanıt');
  const st = await rpc(U[3], 'get_room_state', { p_room_id: w.room_id });
  eq([st.room.is_quick, st.room.close_reason], [true, 'quick_timeout']);
  const n = await rpc(U[3], 'quick_match', {});
  eq(n.created, true, 'yeniden aramak yeni oda kurar');
  ok(n.room_id !== w.room_id);
});
await test('Zaman aşımına uğramış ya da kalp atışı kesilmiş bekleyen odaya kimse eşleşmez', async () => {
  const w = (await one(`select room_id from public.room_players where user_id = $1 and is_current`, [U[3]])).room_id;
  await admin(`update public.room_heartbeats set last_seen_at = now() - interval '90 seconds' where room_id = $1`, [w]);
  const x = await rpc(U[5], 'quick_match', {});
  eq(x.created, true, 'hayalet odaya girilmez');
  ok(x.room_id !== w);
  await rpc(U[5], 'leave_room', { p_room_id: x.room_id });
  eq((await room(x.room_id)).status, 'abandoned', 'son kişi çıkınca oda kapanır (leave_room)');
  await admin(`update public.room_heartbeats set last_seen_at = now() where room_id = $1`, [w]);
  await admin(`update public.room_players set joined_at = now() - interval '200 seconds' where room_id = $1`, [w]);
  const y = await rpc(U[5], 'quick_match', {});
  ok(y.room_id !== w && y.created, 'süresi geçmiş odaya girilmez');
  await rpc(U[5], 'leave_room', { p_room_id: y.room_id });
  await rpc(U[3], 'leave_room', { p_room_id: w });
});
await test('FFA hızlı: 4 kişi; 2. ve 3. bekler, 4. katılınca başlar; kombo hedefte süre 300', async () => {
  const ids = [U[10], U[11], U[12], U[13]];
  const res = [];
  for (const u of ids) res.push(await rpc(u, 'quick_match', { p_mode: 'ffa', p_target: 'combo' }));
  eq(res.map((r) => [r.created, r.players, r.status]), [[true, 1, 'lobby'], [false, 2, 'lobby'], [false, 3, 'lobby'], [false, 4, 'in_round']]);
  eq(new Set(res.map((r) => r.room_id)).size, 1);
  const r = await room(res[0].room_id);
  eq([r.capacity, r.round_time_limit_sec, r.target_type, r.mode], [4, 300, 'combo', 'ffa']);
  for (const u of ids) await rpc(u, 'leave_room', { p_room_id: r.id });
});
await test('Hızlı odaya kodla join_room da dolunca otomatik başlatır', async () => {
  const a = await rpc(U[14], 'quick_match', { p_mode: 'duel', p_target: 'therapy' });
  const j = await rpc(U[15], 'join_room', { p_code: a.code });
  eq(j.status, 'in_round');
  for (const u of [14, 15]) await rpc(U[u], 'leave_room', { p_room_id: a.room_id });
});
await test('Hızlı düello baştan sona: RP v2 normal kurallarla (+ düello primi)', async () => {
  const A = U[1], B = U[2];
  const id = qd.room_id;
  await startedAgo(id, 10.2);
  await solve(id, A); await failRound(id, B);
  for (const n of [2, 3]) {
    await nextRound(id, A);
    await startedAgo(id, 10.2);
    await solve(id, A, 1); await solve(id, B, 2);
  }
  eq((await room(id)).status, 'finished');
  const res = await results(id);
  eq(res.map((r) => [r.user_id, r.rp_delta]), [[A, 10 + 8 + 8 + 10], [B, -10 + 6 + 6]]);
  eq(await rp(A), 36); eq(await rp(B), 2);
});

console.log('\n[RP v2]');
await test('Her sonuç: g1..g6 = +10 +8 +6 +4 +2 +1; başarısız −10; düello primi +10; taban 0', async () => {
  const A = U[4], B = U[5];
  const d = await setupMatch(A, [B], { p_mode: 'duel', p_round_count: 6 });
  for (let i = 0; i < 6; i++) {
    if (i) await nextRound(d.id, A);
    await startedAgo(d.id, 10.2);
    await solve(d.id, A, i);
    await failRound(d.id, B);
  }
  const res = await results(d.id);
  eq(outcomes(res[0].rp_breakdown), ['g1', 'g2', 'g3', 'g4', 'g5', 'g6']);
  eq(res[0].rp_breakdown.rounds.map((x) => x.delta), [10, 8, 6, 4, 2, 1]);
  eq([res[0].rp_breakdown.placement, res[0].rp_delta], [10, 41]);
  eq(res.map((x) => [x.rp_breakdown.voided, x.rp_breakdown.erken_bitis]), [[false, false], [false, false]], 'normal maç: bayrak yok');
  eq([res[1].rp_delta, res[1].rp_after], [-60, 0]);
  eq(await rp(B), 0, 'RP 0\'ın altına inmez');
});
await test('Pes, süre dolması ve kopma (absent) her biri −10', async () => {
  const A = U[6], B = U[7];
  await admin(`update public.profiles set ranked_points = 100 where id = any($1)`, [[A, B]]);
  const d = await setupMatch(A, [B], { p_mode: 'duel', p_round_count: 3 });
  await startedAgo(d.id, 10.2);
  await solve(d.id, A); await rpc(B, 'forfeit_round', { p_room_id: d.id, p_round_no: 1 });
  await nextRound(d.id, A);
  await startedAgo(d.id, 10.2);
  await solve(d.id, A);
  await startedAgo(d.id, 200);
  await rpc(A, 'advance_if_due', { p_room_id: d.id });
  await nextRound(d.id, A);
  await startedAgo(d.id, 10.2);
  await admin(`update public.room_heartbeats set last_seen_at = now() - interval '5 minutes' where room_id = $1 and user_id = $2`, [d.id, B]);
  await solve(d.id, A);
  eq((await room(d.id)).status, 'finished');
  const reasons = (await admin(`select finish_reason from public.round_players where room_id = $1 and user_id = $2 order by round_no`, [d.id, B])).rows.map((x) => x.finish_reason);
  eq(reasons, ['gave_up', 'timeout', 'absent']);
  const res = await results(d.id);
  eq(res.map((r) => [r.user_id, r.rp_delta]), [[A, 40], [B, -30]]);
  eq([await rp(A), await rp(B)], [140, 70]);
});
await test('Maç sürerken çıkan kalan turların cezasını öder; maç sürer, kalanlar normal puanlanır', async () => {
  const [A, B, C] = [U[8], U[9], U[10]];
  await admin(`update public.profiles set ranked_points = 100 where id = any($1)`, [[A, B, C]]);
  const f = await setupMatch(A, [B, C], { p_mode: 'ffa', p_capacity: 3, p_round_count: 4 });
  await startedAgo(f.id, 10.2);
  await solve(f.id, A); await solve(f.id, B); await solve(f.id, C);   // herkes +10
  await rpc(C, 'leave_room', { p_room_id: f.id });                    // ara sürede çıkar
  for (const n of [2, 3, 4]) {
    await nextRound(f.id, A);
    await startedAgo(f.id, 10.2);
    await solve(f.id, A); await solve(f.id, B, 1);
  }
  const r = await room(f.id);
  eq([r.status, r.ended_early], ['finished', false]);
  const res = await results(f.id);
  eq(res.map((x) => [x.user_id, x.rp_delta, x.left_early]), [[A, 40 + 15, false], [B, 10 + 24 + 5, false], [C, 10 - 30, true]]);
  const bc = res[2].rp_breakdown;
  eq([outcomes(bc), bc.rounds.filter((x) => x.missed).length, bc.placement], [['g1', 'fail', 'fail', 'fail'], 3, 0]);
});
await test('Battle: tur içinde çıkan o tur + kalan turlar (cap) için ceza; elenen için ceza yok', async () => {
  const [A, B, C, D] = [U[11], U[12], U[13], U[14]];
  const t = await setupMatch(A, [B, C, D], { p_mode: 'tournament', p_capacity: 4, p_format: 'battle' });
  await startedAgo(t.id, 10.2);
  await solve(t.id, A); await solve(t.id, B); await solve(t.id, C, 1); await failRound(t.id, D);   // D elenir
  await nextRound(t.id, A);
  await startedAgo(t.id, 10.2);
  await solve(t.id, A);
  await rpc(C, 'leave_room', { p_room_id: t.id });   // tur 2 sırasında çıkar
  await solve(t.id, B, 2);
  await nextRound(t.id, A);
  await startedAgo(t.id, 10.2);
  await solve(t.id, A); await solve(t.id, B, 1);
  eq((await room(t.id)).status, 'finished');
  const res = Object.fromEntries((await results(t.id)).map((x) => [x.user_id, x]));
  eq(outcomes(res[C].rp_breakdown), ['g2', 'fail', 'fail']);
  eq(res[C].rp_delta, 8 - 20);
  eq([outcomes(res[D].rp_breakdown), res[D].rp_delta], [['fail'], -10]);
  eq([res[A].final_rank, res[A].rp_delta], [1, 30 + 25]);
  eq([res[B].final_rank, res[B].rp_delta], [2, 10 + 6 + 8 + 10]);
});
await test('Bracket: ara sürede çıkan yalnızca eşleşmesinin turu için ceza öder; kaybeden sonrası için ceza yok', async () => {
  const ids = [U[1], U[2], U[3], U[15]];
  const t = await setupMatch(ids[0], ids.slice(1), { p_mode: 'tournament', p_capacity: 4, p_format: 'bracket' });
  const p1 = (await admin(`select * from public.match_pairings where room_id = $1 and bracket_round = 1 order by slot`, [t.id])).rows;
  const [A, B, C, D] = [p1[0].player_a, p1[0].player_b, p1[1].player_a, p1[1].player_b];
  await startedAgo(t.id, 10.2);
  await solve(t.id, A); await failRound(t.id, B); await solve(t.id, C); await solve(t.id, D, 1);
  await rpc(A, 'leave_room', { p_room_id: t.id });   // finale kaldı ama ara sürede çıktı -> tek kişi kaldı, maç biter
  const r = await room(t.id);
  eq([r.status, r.ended_early], ['finished', true]);   // 1/2 tur oynandı: eşik (yarısı) sağlandı, RP geçerli
  const res = Object.fromEntries((await results(t.id)).map((x) => [x.user_id, x]));
  eq([outcomes(res[A].rp_breakdown), res[A].rp_breakdown.rounds[1].missed, res[A].rp_delta], [['g1', 'fail'], true, 0]);
  eq([outcomes(res[B].rp_breakdown), res[B].rp_delta], [['fail'], -10], 'elenen: 2. tur için ceza yok');
  eq([res[D].final_rank, outcomes(res[D].rp_breakdown), res[D].rp_delta], [2, ['g2'], 8 + 10]);
  eq([res[C].final_rank, res[C].rp_delta], [1, 10 + 25]);
  eq([res[C].rp_breakdown.erken_bitis, res[C].rp_breakdown.voided], [false, false], 'eşik sağlandı: kural tetiklenmez, prim verilir');
});
await test('Kombo: N = aşama tahmin sayılarının yuvarlanmış ortalaması; bir aşama başarısızsa fail', async () => {
  const [A, B] = [U[4], U[5]];
  const d = await setupMatch(A, [B], { p_mode: 'duel', p_target_type: 'combo', p_round_count: 1 });
  await startedAgo(d.id, 10.2);
  await solve(d.id, A, 0); await solve(d.id, A, 1); await solve(d.id, A, 3);   // 1, 2, 4 -> ort 2.33 -> g2
  await solve(d.id, B, 0); await failRound(d.id, B);                          // 2. aşamada 6 yanlış
  const res = await results(d.id);
  eq(res.map((x) => [x.user_id, outcomes(x.rp_breakdown)]), [[A, ['g2']], [B, ['fail']]]);
  eq(res[0].rp_delta, 8 + 10);
});
await test('FFA 2 kişiyle 2.lik primi yok; turnuva 2.si +10 (battle testinde)', async () => {
  const [A, B] = [U[6], U[7]];
  const f = await setupMatch(A, [B], { p_mode: 'ffa', p_capacity: 2, p_round_count: 1 });
  await startedAgo(f.id, 10.2);
  await solve(f.id, A); await solve(f.id, B);
  const res = await results(f.id);
  eq(res.map((x) => x.rp_breakdown.placement), [15, 0]);
});
await test('Erken bitiş (0004): kalan oynadığı turların RP\'sini alır (burada −10), prim yok, erken_bitis; çıkan yalnızca negatiflerini öder', async () => {
  const [A, B] = [U[8], U[9]];
  await admin(`update public.profiles set ranked_points = 100 where id = any($1)`, [[A, B]]);
  const wonBefore = (await one(`select matches_won from public.profiles where id = $1`, [A])).matches_won;
  const d = await setupMatch(A, [B], { p_mode: 'duel', p_round_count: 5 });
  await startedAgo(d.id, 10.2);
  await failRound(d.id, A); await solve(d.id, B);   // A −10, B +10
  await rpc(B, 'leave_room', { p_room_id: d.id });
  const r = await room(d.id);
  eq([r.status, r.ended_early], ['finished', true]);
  const res = Object.fromEntries((await results(d.id)).map((x) => [x.user_id, x]));
  const bA = res[A].rp_breakdown;
  eq([res[A].final_rank, res[A].rp_delta, bA.voided, bA.erken_bitis, bA.placement, bA.total, outcomes(bA)], [1, -10, false, true, 0, -10, ['fail']]);
  eq([res[B].rp_delta, res[B].rp_breakdown.voided, res[B].rp_breakdown.erken_bitis], [-40, true, false], 'B: +10 silinir, 4 kaçırılan tur × −10');
  eq([await rp(A), await rp(B)], [90, 60]);
  eq((await one(`select matches_won from public.profiles where id = $1`, [A])).matches_won, wonBefore, 'erken biten maç galibiyet sayılmaz');
});
await test('Bitirme tekrar çağrılsa da RP bir kez uygulanır (RP v2)', async () => {
  const A = U[8];
  const before = await rp(A);
  const rid = (await one(`select room_id from public.match_results where user_id = $1 order by created_at desc limit 1`, [A])).room_id;
  await admin(`update public.rooms set status = 'in_round' where id = $1`, [rid]);
  await admin(`select public._finish_match($1, false)`, [rid]);
  await admin(`select public._finish_match($1, true)`, [rid]);
  eq(await rp(A), before);
});
await test('Oda üyesi rp_breakdown okur, üye olmayan okuyamaz; get_room_state.results içerir', async () => {
  const rid = qd.room_id;
  eq((await q(U[2], `select rp_breakdown from public.match_results where room_id = $1`, [rid])).rows.length, 2);
  eq((await q(U[12], `select rp_breakdown from public.match_results where room_id = $1`, [rid])).rows.length, 0);
  const st = await rpc(U[2], 'get_room_state', { p_room_id: rid });
  ok(st.results.every((x) => x.rp_breakdown && Array.isArray(x.rp_breakdown.rounds)));
  await expectErr(q(U[2], `update public.match_results set rp_delta = 999 where room_id = $1`, [rid]), DENIED);
});
await test('get_my_rp_history: en yeniden eskiye, alanlar, limit', async () => {
  const h = await rpc(U[8], 'get_my_rp_history', {});
  ok(h.length >= 2);
  const keys = ['room_id', 'finished_at', 'mode', 'format', 'target', 'placement', 'players', 'rp_delta', 'rp_breakdown', 'rp_after'];
  ok(keys.every((k) => k in h[0]), JSON.stringify(Object.keys(h[0])));
  eq([h[0].mode, h[0].players, h[0].rp_delta, h[0].rp_after, h[0].target], ['duel', 2, -10, 90, 'diagnosis']);
  ok(new Date(h[0].finished_at) >= new Date(h[1].finished_at));
  eq((await rpc(U[8], 'get_my_rp_history', { p_limit: 1 })).length, 1);
  eq(await rpc(U[16], 'get_my_rp_history', {}), []);
});

console.log('\n[0004: erken ayrılma]');
await test('Erken ayrılma: kalan çözdüğü turların +, çözemediğinin −10\'unu alır; yarıda kalan tur 0; prim yok; çıkan eskisi gibi', async () => {
  const A = await makeUser(30), B = await makeUser(31);
  await admin(`update public.profiles set ranked_points = 100 where id = any($1)`, [[A, B]]);
  const before = await one(`select matches_played, matches_won from public.profiles where id = $1`, [A]);
  const d = await setupMatch(A, [B], { p_mode: 'duel', p_round_count: 10 });
  await startedAgo(d.id, 10.2);
  await solve(d.id, A); await solve(d.id, B);            // A g1 +10
  await nextRound(d.id, A); await startedAgo(d.id, 10.2);
  await solve(d.id, A, 1); await solve(d.id, B);         // A g2 +8
  await nextRound(d.id, A); await startedAgo(d.id, 10.2);
  await failRound(d.id, A); await solve(d.id, B);        // A fail −10
  await nextRound(d.id, A); await startedAgo(d.id, 10.2);
  await rpc(B, 'leave_room', { p_room_id: d.id });       // 4. tur sürerken çıkar -> maç biter (4/10 < yarı)
  const r = await room(d.id);
  eq([r.status, r.ended_early], ['finished', true]);
  const res = Object.fromEntries((await results(d.id)).map((x) => [x.user_id, x]));
  const bA = res[A].rp_breakdown, bB = res[B].rp_breakdown;
  eq(outcomes(bA), ['g1', 'g2', 'fail', 'void']);
  eq(bA.rounds.map((x) => x.delta), [10, 8, -10, 0]);
  eq([res[A].final_rank, res[A].rp_delta, bA.placement, bA.voided, bA.erken_bitis, bA.total], [1, 8, 0, false, true, 8],
    'kalan: tur toplamı, galibiyet primi (+10) yok');
  // çıkan: 1-3. turlar +10'ar (silinir), 4. tur 'left' −10, 5-10. turlar 6 × −10 -> yalnızca negatifler
  eq([outcomes(bB), bB.rounds.filter((x) => x.missed).length], [['g1', 'g1', 'g1', 'fail', 'fail', 'fail', 'fail', 'fail', 'fail', 'fail'], 6]);
  eq([res[B].rp_delta, bB.placement, bB.voided, bB.erken_bitis, bB.total, res[B].left_early], [-70, 0, true, false, -70, true]);
  eq([await rp(A), await rp(B)], [108, 30]);
  const after = await one(`select matches_played, matches_won from public.profiles where id = $1`, [A]);
  eq([after.matches_played - before.matches_played, after.matches_won - before.matches_won], [1, 0], 'oynandı sayılır, galibiyet sayılmaz');
  const st = await rpc(A, 'get_room_state', { p_room_id: d.id });
  eq(st.results.find((x) => x.user_id === A).rp_breakdown.erken_bitis, true, 'get_room_state de bayrağı taşır');
  const h = await rpc(A, 'get_my_rp_history', { p_limit: 1 });
  eq([h[0].room_id, h[0].rp_delta, h[0].rp_breakdown.erken_bitis, h[0].rp_after], [d.id, 8, true, 108]);
  // idempotent: bitirme tekrar çağrılsa da hiçbir şey değişmez
  const snap = JSON.stringify(await results(d.id));
  await admin(`update public.rooms set status = 'in_round' where id = $1`, [d.id]);
  await admin(`select public._finish_match($1, true)`, [d.id]);
  await admin(`select public._finish_match($1, false)`, [d.id]);
  await admin(`select public._finish_match($1, true)`, [d.id]);
  eq([await rp(A), await rp(B)], [108, 30]);
  eq(JSON.stringify(await results(d.id)), snap);
  const again = await one(`select matches_played from public.profiles where id = $1`, [A]);
  eq(again.matches_played, after.matches_played);
});
await test('Erken ayrılma: kalanın eksi toplamı da uygulanır ve 0 tabanı geçerli', async () => {
  const A = await makeUser(32), B = await makeUser(33);
  await admin(`update public.profiles set ranked_points = 5 where id = any($1)`, [[A, B]]);
  const d = await setupMatch(A, [B], { p_mode: 'duel', p_round_count: 6 });
  await startedAgo(d.id, 10.2);
  await failRound(d.id, A); await solve(d.id, B);        // A −10
  await rpc(B, 'leave_room', { p_room_id: d.id });       // ara sürede çıkar (1/6 tur)
  const res = Object.fromEntries((await results(d.id)).map((x) => [x.user_id, x]));
  eq([res[A].rp_delta, res[A].rp_after, res[A].rp_breakdown.erken_bitis], [-10, 0, true]);
  eq([res[B].rp_delta, res[B].rp_after], [-50, 0]);
});

console.log('\n[0004: günlük sıralama]');
await test('Günlük sıralama: 2 tahminde yavaş kazanan 3 tahminde hızlıdan önde; eşit tahminde süre; kaybedenler tahmin ↓; me; geçmiş gün', async () => {
  const D = '2026-04-10';
  await setDay(D);
  const [W3f, W2s, W2f, L6, L2, L0, W2t] = [await makeUser(40), await makeUser(41), await makeUser(42), await makeUser(43), await makeUser(44), await makeUser(45), await makeUser(46)];
  const play = async (u, ago, fn) => {
    await rpc(u, 'daily_begin', { p_target: 'diagnosis' });
    await admin(`update public.daily_attempts set started_at = now() - make_interval(secs => $3) where user_id = $1 and challenge_date = $2`, [u, D, ago]);
    return fn();
  };
  const r3f = await play(W3f, 2, () => dailySolve(W3f, D, 'diagnosis', 2));    // 3 tahmin, ~2 sn  -> 70 + 19
  const r2s = await play(W2s, 87, () => dailySolve(W2s, D, 'diagnosis', 1));   // 2 tahmin, ~87 sn -> 85 + 0
  const r2f = await play(W2f, 30, () => dailySolve(W2f, D, 'diagnosis', 1));   // 2 tahmin, ~30 sn
  ok(r3f.points > r2s.points, `puan: ${r3f.points} > ${r2s.points} (puan sırayı belirlememeli)`);
  ok(r2f.time_sec < r2s.time_sec, 'süre farkı');
  await play(L6, 1, () => dailyFail(L6, D, 'diagnosis'));                        // 6 tahmin, kayıp
  await play(L2, 1, async () => {                                                // 2 yanlış + pes
    const c = await dailyWrong(L2, D, 'diagnosis', 2);
    for (const w of c.wrong) await rpc(L2, 'daily_submit_guess', { p_target: 'diagnosis', p_item_id: w });
    return rpc(L2, 'daily_give_up', { p_target: 'diagnosis' });
  });
  await play(L0, 1, () => rpc(L0, 'daily_give_up', { p_target: 'diagnosis' })); // 0 tahmin, pes
  // W2t: W2f ile aynı tahmin ve aynı süre, daha geç bitirdi -> bitiş anı belirler
  await play(W2t, 30, () => dailySolve(W2t, D, 'diagnosis', 1));
  await admin(`update public.daily_results set elapsed_sec = (select elapsed_sec from public.daily_results where user_id = $1 and challenge_date = $3),
                      completed_at = (select completed_at from public.daily_results where user_id = $1 and challenge_date = $3) + interval '1 second'
                where user_id = $2 and challenge_date = $3`, [W2f, W2t, D]);
  const expectOrder = [W2f, W2t, W2s, W3f, L6, L2, L0];
  const lb = await rpc(W3f, 'get_daily_leaderboard', { p_target: 'diagnosis' });
  eq(lb.rows.map((r) => r.user_id), expectOrder);
  eq(lb.rows.map((r) => r.rank), [1, 2, 3, 4, 5, 6, 7]);
  eq(lb.rows.map((r) => [r.won, r.guesses_used]), [[true, 2], [true, 2], [true, 2], [true, 3], [false, 6], [false, 2], [false, 0]]);
  ok(lb.rows.every((r) => Number.isInteger(r.points)), 'puan satırda kalır');
  eq([lb.me.user_id, lb.me.rank], [W3f, 4]);
  eq((await rpc(L2, 'get_daily_leaderboard', { p_target: 'diagnosis', p_limit: 2 })).me.rank, 6, 'ilk N dışında da me doğru');
  const small = await rpc(L2, 'get_daily_leaderboard', { p_target: 'diagnosis', p_limit: 2 });
  eq([small.rows.map((r) => r.user_id), small.total_players], [[W2f, W2t], 7]);
  const v = (await q(W3f, `select user_id, position from public.daily_leaderboard where challenge_date = $1 and target_type = 'diagnosis' order by position`, [D])).rows;
  eq(v.map((x) => x.user_id), expectOrder, 'görünüm aynı sırada');
  eq(v.map((x) => Number(x.position)), [1, 2, 3, 4, 5, 6, 7]);
  await setDay(addDays(D, 1));
  const past = await rpc(L0, 'get_daily_leaderboard', { p_target: 'diagnosis', p_day: D });
  eq([past.day, past.rows.map((r) => r.user_id), past.me.rank], [D, expectOrder, 7], 'geçmiş gün aynı sıra');
});

// ---------------------------------------------------------------- iki bağlantı: gerçek eşzamanlılık (yalnızca pg)
if (db.pg) {
  console.log('\n[Eşzamanlılık (iki bağlantı)]');
  const sess = async (uid) => {
    const c = await db.mk();
    await c.query('begin');
    await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: uid, role: 'authenticated' })]);
    await c.query('set local role authenticated');
    return c;
  };
  const late = (p) => Promise.race([p.then(() => 'done', () => 'done'), new Promise((r) => setTimeout(() => r('waiting'), 400))]);
  await test('İki kişi aynı anda quick_match: biri kurar, öbürü ona katılır (iki oda açılmaz) ve maç başlar', async () => {
    const [a, b] = [await sess(U[16]), await sess(U[13])];
    const ra = await a.query(`select public.quick_match('duel', 'pharmacology') as r`);
    const pb = b.query(`select public.quick_match('duel', 'pharmacology') as r`);
    eq(await late(pb), 'waiting', 'ikinci çağrı ilkinin işlemi bitene kadar beklemeli');
    await a.query('commit');
    const rb = await pb; await b.query('commit');
    eq([ra.rows[0].r.created, rb.rows[0].r.created, rb.rows[0].r.room_id], [true, false, ra.rows[0].r.room_id]);
    eq((await room(ra.rows[0].r.room_id)).status, 'in_round');
    await a.end(); await b.end();
  });
  await test('Aynı kullanıcı iki sekmeden aynı günlük tahmini: biri sayılır, öbürü DUPLICATE_GUESS', async () => {
    await setDay('2026-07-01');   // bu oturum için; diğer bağlantılara kendi ayarı verilecek
    const u = U[12];
    await rpc(u, 'daily_begin', { p_target: 'therapy' });
    const c = await dailyWrong(u, '2026-07-01', 'therapy', 1);
    const mk = async () => { const s = await sess(u); await s.query(`select set_config('psikovaka.test_today', '2026-07-01', true)`); return s; };
    const [a, b] = [await mk(), await mk()];
    await a.query(`select public.daily_submit_guess('therapy', $1)`, [c.wrong[0]]);
    const pb = b.query(`select public.daily_submit_guess('therapy', $1)`, [c.wrong[0]]);
    eq(await late(pb), 'waiting', 'satır kilidi beklemeli');
    await a.query('commit');
    let err = null;
    try { await pb; } catch (e) { err = e.message; }
    await b.query('rollback');
    eq(err, 'DUPLICATE_GUESS');
    eq((await rpc(u, 'daily_begin', { p_target: 'therapy' })).guesses_used, 1);
    await a.end(); await b.end();
  });
} else {
  console.log('\n[Eşzamanlılık] PGlite tek bağlantılı: atlandı (DATABASE_URL ile çalışır).');
}

console.log(`\nSonuç: ${passed} geçti, ${failed} kaldı`);
if (failed) console.log('Kalanlar:\n - ' + failures.join('\n - '));
await db.close();
process.exit(failed ? 1 : 0);
