// PsikoVaka — 0006 testleri: sınıf (projeksiyon) modu + anonim kullanıcı sertleştirmesi
//
// Çalıştırma (supabase/tests klasöründe):
//   npm install
//   node sinif_modu.test.mjs                               # PGlite
//   DATABASE_URL=postgres://... node sinif_modu.test.mjs   # boş, atılabilir gerçek Postgres
//                                                          # (+ iki bağlantılı eşzamanlılık testi)
// Gerçek Supabase projesine ASLA bağlamayın.
//
// Migration dosyası: önce supabase/migrations/0006_sinif_modu.sql, yoksa geliştirme taslağı
// supabase/tools/0006_sinif_modu.sql.taslak (SINIF_MIG ortam değişkeniyle de verilebilir).
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const read = (p) => readFileSync(path.join(root, p), 'utf8');
const MIG6 = process.env.SINIF_MIG
  || (existsSync(path.join(root, 'migrations/0006_sinif_modu.sql')) ? 'migrations/0006_sinif_modu.sql' : 'tools/0006_sinif_modu.sql.taslak');

async function connect() {
  if (process.env.DATABASE_URL) {
    const { default: pg } = await import('pg');
    const mk = async () => { const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect(); return c; };
    const client = await mk();
    return { name: 'postgres (pg)', pg: true, mk, exec: (s) => client.query(s), query: (s, p) => client.query(s, p), close: () => client.end() };
  }
  const { PGlite } = await import('@electric-sql/pglite');
  const db = new PGlite();
  return { name: 'PGlite', pg: false, exec: (s) => db.exec(s), query: (s, p) => db.query(s, p), close: () => db.close() };
}

const db = await connect();
console.log(`Veritabanı: ${db.name}; 0006: ${MIG6}`);
for (const f of ['tests/00_supabase_stubs.sql', 'migrations/0001_init.sql', 'seed/0002_cases_answer_key.sql',
  'migrations/0002_online_ek.sql', 'migrations/0003_gunluk_ve_hizli.sql', 'migrations/0004_kural_duzeltmeleri.sql',
  'migrations/0005_isim_filtresi.sql']) await db.exec(read(f));

let passed = 0, failed = 0;
const failures = [];
async function test(name, fn) {
  try { await fn(); passed++; console.log(`  ok   ${name}`); }
  catch (e) { failed++; failures.push(name); console.log(`  FAIL ${name}\n       ${e.stack || e.message}`); }
  finally { await db.exec('reset role'); }
}
const canon = (v) => Array.isArray(v) ? v.map(canon)
  : (v && typeof v === 'object') ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])])) : v;
function eq(a, b, msg = '') {
  const A = JSON.stringify(canon(a)), B = JSON.stringify(canon(b));
  if (A !== B) throw new Error(`${msg} beklenen ${B}, gelen ${A}`);
}
function ok(c, msg) { if (!c) throw new Error(msg || 'koşul sağlanmadı'); }
function near(a, b, tol, msg = '') { if (Math.abs(a - b) > tol) throw new Error(`${msg} beklenen ≈${b} (±${tol}), gelen ${a}`); }
async function expectErr(p, codeOrRe) {
  try { await p; } catch (e) {
    const m = e.message || '';
    if (codeOrRe instanceof RegExp ? codeOrRe.test(m) : m === codeOrRe) return e;
    throw new Error(`beklenen hata ${codeOrRe}, gelen "${m}"`);
  }
  throw new Error(`beklenen hata ${codeOrRe}, ama başarılı oldu`);
}
const DENIED = /permission denied|row-level security/;

// Kimlik: null = girişsiz (anon rolü); {id, anon} = authenticated (+ JWT is_anonymous)
const ANON = new Set();
const claimsOf = (uid) => JSON.stringify({ sub: uid, role: 'authenticated', is_anonymous: ANON.has(uid) });
async function as(uid, fn) {
  const claims = uid ? claimsOf(uid) : '';
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
const num = async (sql, params) => Number(Object.values(await one(sql, params))[0]);

let nUser = 0;
async function makeUser(username) {
  const id = randomUUID();
  await admin(`insert into auth.users (id, email, raw_user_meta_data) values ($1, $2, '{}')`, [id, `s${++nUser}@test.local`]);
  if (username) await rpc(id, 'set_username', { p_username: username });
  return id;
}
async function makeAnon() {
  const id = randomUUID();
  await admin(`insert into auth.users (id, is_anonymous, raw_user_meta_data) values ($1, true, '{}')`, [id]);
  ANON.add(id);
  return id;
}
const sess = (id) => one(`select * from public.sinif_oturumlari where id = $1`, [id]);
async function key(oid) {
  return one(`select t.tur_no, t.case_id, k.diagnosis_id, c.group_id
                from public.sinif_oturumlari o
                join public.sinif_turlari t on t.oturum_id = o.id and t.tur_no = o.tur_no
                join public.cases_answer_key k on k.case_id = t.case_id
                join public.answer_catalog c on c.kind = 'diagnosis' and c.item_id = k.diagnosis_id
               where o.id = $1`, [oid]);
}
async function wrongIds(oid, n, sameGroup = false) {
  const k = await key(oid);
  const rows = (await admin(`select item_id from public.answer_catalog where kind = 'diagnosis' and item_id <> $1
                              and (group_id = $2) = $3 order by item_id limit $4`, [k.diagnosis_id, k.group_id, sameGroup, n])).rows;
  return rows.map((r) => r.item_id);
}
// Turun başlangıcını "şu andan sec saniye önce" yap (tur_son da kayar)
async function setElapsed(oid, sec) {
  await admin(`update public.sinif_oturumlari
                  set tur_baslangic = now() - make_interval(secs => $2),
                      tur_son = now() - make_interval(secs => $2) + make_interval(secs => 6 * ipucu_araligi_sn)
                where id = $1`, [oid, sec]);
  await admin(`update public.sinif_turlari t set baslangic = o.tur_baslangic, son = o.tur_son
                 from public.sinif_oturumlari o where o.id = t.oturum_id and t.tur_no = o.tur_no and o.id = $1`, [oid]);
}
const guess = (uid, oid, item, extra = {}) => rpc(uid, 'sinif_tahmin', { p_oturum: oid, p_item_id: item, ...extra });
const durum = (uid, oid) => rpc(uid, 'sinif_durum', { p_oturum: oid });

const fingerprint = async () => (await one(`
  select md5(coalesce((select string_agg(p.oid::regprocedure::text || ':' || md5(p.prosrc) || ':' || coalesce(array_to_string(p.proacl, ','), '') || ':' || p.prosecdef || ':' || coalesce(array_to_string(p.proconfig, ','), ''), '|' order by 1)
                         from pg_proc p where p.pronamespace = 'public'::regnamespace), '')) as f,
         md5(coalesce((select string_agg(key || '=' || value, ',' order by key) from public.game_config), '')) as c,
         md5(coalesce((select string_agg(table_name || '.' || column_name || ':' || coalesce(column_default, ''), ',' order by table_name, column_name)
                         from information_schema.columns where table_schema = 'public'), '')) as cols,
         md5(coalesce((select string_agg(tablename || '.' || policyname || ':' || permissive || ':' || coalesce(qual, ''), ',' order by tablename, policyname) from pg_policies where schemaname in ('public', 'realtime')), '')) as pol,
         md5(coalesce((select string_agg(conname, ',' order by conname) from pg_constraint where connamespace = 'public'::regnamespace), '')) as con,
         md5(coalesce((select string_agg(tgname, ',' order by tgname) from pg_trigger where not tgisinternal), '')) as trg,
         md5(coalesce((select string_agg(tablename, ',' order by tablename) from pg_publication_tables where pubname = 'supabase_realtime'), '')) as pub,
         md5(coalesce((select string_agg(c.relname || ':' || coalesce(array_to_string(c.relacl, ','), ''), ',' order by c.relname)
                         from pg_class c where c.relnamespace = 'public'::regnamespace), '')) as acl`));

// ---- 0006 öncesi veri: RP / liderlik / maç sonuçları değişmemeli
const H = await makeUser('hoca1');          // sunucu
const H2 = await makeUser('hoca2');
const H3 = await makeUser('hoca3');
const H4 = await makeUser('hoca4');
const R1 = await makeUser('ogrenci_hesap');  // normal hesapla katılan öğrenci
const NOUSER = await makeUser(null);         // kullanıcı adı yok
await admin(`update public.profiles set ranked_points = 77 where id = $1`, [R1]);
const BASE = [H, H2, H3, H4, R1, NOUSER];

console.log('\n[0006 kurulumu]');
let fp0;
await test('0006 uygulanır; ikinci kez çalıştırılınca hiçbir şey değişmez (fonksiyon/yetki/ayar/sütun/politika/kısıt/tetikleyici/yayın)', async () => {
  fp0 = await fingerprint();
  await db.exec(read(MIG6));
  const a = await fingerprint();
  ok(JSON.stringify(a) !== JSON.stringify(fp0), '0006 bir şey değiştirmeli');
  await admin(`update public.game_config set value = 4 where key = 'sinif_geri_sayim_sn'`);   // ayarlanmış değer korunmalı
  const a2 = await fingerprint();
  await db.exec(read(MIG6));
  eq(await fingerprint(), a2);
  eq(await num(`select value from public.game_config where key = 'sinif_geri_sayim_sn'`), 4);
  await admin(`update public.game_config set value = 3 where key = 'sinif_geri_sayim_sn'`);
});
const rpSnap = async () => (await admin(`
  select (select md5(string_agg(id::text || ranked_points || ':' || matches_played || ':' || matches_won, ',' order by id)) from public.profiles where id = any($1::uuid[])) as p,
         (select coalesce(sum(ranked_points + matches_played + matches_won), 0) from public.profiles) as total,
         (select count(*) from public.match_results) as mr, (select count(*) from public.daily_results) as dr,
         (select count(*) from public.solo_streaks) as ss, (select count(*) from public.rooms) as rooms`, [BASE])).rows[0];
const snapBefore = await rpSnap();

console.log('\n[Anonim kullanıcı: profil ve sertleştirme]');
const A = [];
await test('Anonim kayıt profil AÇMAZ; normal kayıt açar; anonim → kalıcı dönüşünce profil açılır', async () => {
  for (let i = 0; i < 34; i++) A.push(await makeAnon());
  eq(await num(`select count(*) from public.profiles where id = any($1::uuid[])`, [A]), 0);
  ok(await num(`select count(*) from public.profiles where id = $1`, [R1]) === 1);
  const up = await makeAnon();
  await admin(`update auth.users set is_anonymous = false, email = 'donusen@test.local' where id = $1`, [up]);
  ANON.delete(up);
  eq(await num(`select count(*) from public.profiles where id = $1`, [up]), 1);
  eq((await rpc(up, 'set_username', { p_username: 'donusen' })).username, 'donusen');
});

await test('anon_mu(): JWT claim ya da auth.users.is_anonymous; normal kullanıcıda false', async () => {
  eq((await q(A[0], `select public.anon_mu() as v`)).rows[0].v, true);
  eq((await q(R1, `select public.anon_mu() as v`)).rows[0].v, false);
  // claim eksik olsa da auth.users satırı yakalar
  await db.exec(`select set_config('request.jwt.claims', '${JSON.stringify({ sub: A[0], role: 'authenticated' })}', false); set role authenticated;`);
  const r = await db.query(`select public.anon_mu() as v`);
  await db.exec('reset role');
  eq(r.rows[0].v, true);
});

// İzin listesi: anonim çağırabilir. RLS yardımcıları anonime false döner (aşağıda ayrıca denenir).
const ALLOW = new Set(['anon_mu', 'isim_uygun_mu', 'get_daily_challenge',
  'sinif_katil', 'sinif_ayril', 'sinif_tahmin', 'sinif_durum', 'sinif_ozet',
  'sinif_at', 'sinif_basla', 'sinif_turu_bitir', 'sinif_sonraki', 'sinif_bitir',   // sunucu RPC'leri: SADECE_SUNUCU/SINIF_YOK
  'is_room_member', 'has_room_invite', 'is_friend', 'can_use_realtime_topic',
  'sinif_sunucusu_mu', 'sinif_uyesi_mi', 'sinif_tur_sonucu_okunur']);
const DUMMY = { uuid: '00000000-0000-0000-0000-000000000001', text: 'diagnosis', integer: '1', smallint: '1', boolean: 'false',
  jsonb: '{}', 'text[]': '{}', date: '2026-01-01' };
let enumerated = [];
await test('NUMARALANDIRMA: authenticated\'a açık HER fonksiyon ya izin listesinde ya da anonimi ANON_IZINSIZ ile reddediyor', async () => {
  const fns = (await admin(`
    select p.oid, p.proname, p.pronargs, coalesce((select array_agg(format_type(t, null) order by i)
             from unnest(p.proargtypes) with ordinality as a(t, i)), '{}') as types
      from pg_proc p
     where p.pronamespace = 'public'::regnamespace and p.prokind = 'f'
       and has_function_privilege('authenticated', p.oid, 'execute')
     order by p.proname`)).rows;
  ok(fns.length >= 40, `beklenenden az fonksiyon: ${fns.length}`);
  const bad = [];
  for (const f of fns) {
    if (ALLOW.has(f.proname)) continue;
    const types = Array.isArray(f.types) ? f.types : String(f.types).replace(/[{}"]/g, '').split(',').filter(Boolean);
    const sql = `select public.${f.proname}(${types.map((t, i) => `$${i + 1}::${t}`).join(', ')})`;
    let msg = null;
    for (const vals of [types.map(() => null), types.map((t) => DUMMY[t] ?? null)]) {
      try { await q(A[0], sql, vals); msg = 'BAŞARILI'; } catch (e) { msg = e.message; }
      if (msg === 'ANON_IZINSIZ') break;
    }
    if (msg !== 'ANON_IZINSIZ') bad.push(`${f.proname}(${types.join(',')}) → ${msg}`);
    else enumerated.push(f.proname);
    if (process.env.LISTE) console.log('         ret', f.proname);
  }
  eq(bad, [], 'anonimi reddetmeyen fonksiyonlar');
  const allowSeen = fns.filter((f) => ALLOW.has(f.proname)).map((f) => f.proname);
  console.log(`       ${fns.length} fonksiyon: ${enumerated.length} anonimi ANON_IZINSIZ ile reddediyor, ${allowSeen.length} izin listesinde`);
});

await test('İzin listesindeki RLS yardımcıları anonime false; realtime kanalı (kendi online: kanalı dahil) kapalı', async () => {
  const z = '00000000-0000-0000-0000-000000000001';
  for (const [sql, args] of [[`select public.is_room_member($1) v`, [z]], [`select public.has_room_invite($1) v`, [z]],
    [`select public.is_friend($1) v`, [z]], [`select public.can_use_realtime_topic('online:' || $1, true) v`, [A[0]]],
    [`select public.can_use_realtime_topic('online:' || $1, false) v`, [A[0]]], [`select public.sinif_uyesi_mi($1) v`, [z]],
    [`select public.sinif_sunucusu_mu($1) v`, [z]]]) {
    eq((await q(A[0], sql, args)).rows[0].v, false, sql);
  }
  eq((await q(R1, `select public.can_use_realtime_topic('online:' || $1, true) v`, [R1])).rows[0].v, true, 'normal kullanıcı etkilenmez');
  eq((await q(A[0], `select public.isim_uygun_mu('Ada') v`)).rows[0].v, true);
  eq(typeof (await rpc(A[0], 'get_daily_challenge', { p_target: 'diagnosis' })).case_id, 'string');
});

await test('NUMARALANDIRMA: sınıf dışı her tablo/görünüm anonime boş; anonim profil/oda/arkadaş yazamaz', async () => {
  // biraz veri: arkadaşlık, oda, günlük sonuç
  await rpc(R1, 'send_friend_request', { p_username: 'hoca1' });
  await rpc(H, 'create_room', { p_mode: 'ffa', p_visibility: 'public', p_capacity: 4 });
  await admin(`insert into public.daily_results (user_id, challenge_date, target_type, case_id, won, guess_count, elapsed_sec, points)
               values ($1, '2026-01-01', 'diagnosis', (select min(case_id) from public.cases_answer_key), true, 1, 10, 110)`, [R1]);
  const rels = (await admin(`
    select c.relname from pg_class c
     where c.relnamespace = 'public'::regnamespace and c.relkind in ('r', 'v')
       and has_table_privilege('authenticated', c.oid, 'select')
     order by 1`)).rows.map((r) => r.relname);
  const leaks = [], seenByUser = [];
  for (const t of rels) {
    const n = Number((await q(A[0], `select count(*) n from public.${t}`)).rows[0].n);
    const m = Number((await q(R1, `select count(*) n from public.${t}`)).rows[0].n);
    if (m > 0) seenByUser.push(t);
    if (t === 'game_config' || t.startsWith('sinif_')) continue;
    if (n !== 0) leaks.push(`${t}: ${n}`);
  }
  eq(leaks, [], 'anonime görünen satırlar');
  ok(['profiles', 'leaderboard', 'rooms', 'friendships'].every((t) => seenByUser.includes(t)), `normal kullanıcı görmeli: ${seenByUser}`);
  ok(Number((await q(A[0], `select count(*) n from public.game_config`)).rows[0].n) > 0, 'game_config okunur');
  console.log(`       ${rels.length} tablo/görünüm denendi (game_config + 4 sinif_* hariç hepsi anonime boş)`);
  const up = await q(A[0], `update public.profiles set display_name = 'X' where id = $1`, [R1]);
  eq(up.rowCount ?? up.affectedRows ?? 0, 0);
  await expectErr(q(A[0], `insert into public.rooms (code, host_id) values ('ZZZZZZ', $1)`, [A[0]]), DENIED);
  // realtime.messages okuma/yazma politikası
  await db.exec(`select set_config('realtime.topic', 'online:${A[0]}', false)`);
  eq(Number((await q(A[0], `select count(*) n from realtime.messages`)).rows[0].n), 0);
  await expectErr(q(A[0], `insert into realtime.messages (topic, extension) values ('online:${A[0]}', 'presence')`), DENIED);
  await db.exec(`select set_config('realtime.topic', '', false)`);
});

await test('Anonim: set_username, arkadaşlık, oda, hızlı eşleşme, günlük, davet, sıralama → ANON_IZINSIZ (örnekler)', async () => {
  for (const [fn, args] of [['set_username', { p_username: 'anonadam' }], ['send_friend_request', { p_username: 'hoca1' }],
    ['create_room', { p_mode: 'duel' }], ['join_room', { p_code: 'ABCDEF' }], ['quick_match', {}],
    ['daily_begin', { p_target: 'diagnosis' }], ['get_daily_leaderboard', { p_target: 'diagnosis' }],
    ['get_my_streaks', {}], ['import_local_progress', { p_solved_case_ids: [], p_stats: {} }],
    ['sinif_olustur', {}], ['sinif_oturumlarim', {}]]) {
    await expectErr(rpc(A[0], fn, args), 'ANON_IZINSIZ');
  }
  await expectErr(rpc(null, 'sinif_katil', { p_kod: 'ABCDEF', p_takma_ad: 'Ada' }), DENIED);   // girişsiz rol
});

console.log('\n[Oturum oluşturma]');
let S;   // ana oturum
await test('sinif_olustur: kullanıcı adı şart; ayar doğrulama (her alan); süzgeç; NOT_ENOUGH_CASES', async () => {
  await expectErr(rpc(NOUSER, 'sinif_olustur', { p_ayarlar: {} }), 'USERNAME_REQUIRED');
  for (const [a, f] of [[{ vaka_sayisi: 2 }, 'vaka_sayisi'], [{ vaka_sayisi: 16 }, 'vaka_sayisi'], [{ vaka_sayisi: 4.5 }, 'vaka_sayisi'],
    [{ vaka_sayisi: '5' }, 'vaka_sayisi'], [{ ipucu_araligi_sn: 7 }, 'ipucu_araligi_sn'], [{ ipucu_araligi_sn: 61 }, 'ipucu_araligi_sn'],
    [{ tahmin_hakki: 0 }, 'tahmin_hakki'], [{ tahmin_hakki: 7 }, 'tahmin_hakki'], [{ kapasite: 101 }, 'kapasite'], [{ kapasite: 1 }, 'kapasite'],
    [{ hedef: 'combo' }, 'hedef'], [{ hedef: 3 }, 'hedef'], [{ gec_katilim: 'evet' }, 'gec_katilim'], [{ kurslar: [1] }, 'kurslar'],
    [{ kategoriler: [''] }, 'kategoriler'], [{ kurslar: {} }, 'kurslar']]) {
    const e = await expectErr(rpc(H, 'sinif_olustur', { p_ayarlar: a }), 'INVALID_SETTINGS');
    eq(e.detail, f, JSON.stringify(a));
  }
  await expectErr(rpc(H, 'sinif_olustur', { p_ayarlar: '[]' }), 'INVALID_SETTINGS');
  const e = await expectErr(rpc(H, 'sinif_olustur', { p_ayarlar: { kurslar: 'YOK_BOYLE_DERS' } }), 'NOT_ENOUGH_CASES');
  ok(/0/.test(e.detail));
  const r = await rpc(H, 'sinif_olustur', { p_ayarlar: { ipucu_araligi_sn: 10 } });
  ok(r.ok && /^[A-Z0-9]{6}$/.test(r.kod) && r.server_now, JSON.stringify(r));
  eq(r.ayarlar, { vaka_sayisi: 5, hedef: 'diagnosis', kurslar: null, kategoriler: null, ipucu_araligi_sn: 10, tahmin_hakki: 3, kapasite: 100, gec_katilim: true });
  S = r;
  const d = await durum(H, S.oturum_id);
  eq([d.rol, d.oturum.durum, d.oturum.tur_no, d.tur, d.ben, d.katilimcilar, d.oturum.sunucu.username], ['sunucu', 'lobi', 0, null, null, [], 'hoca1']);
});

await test('sinif_olustur: sunucu başına en çok 3 açık oturum (COK_FAZLA_OTURUM); sinif_oturumlarim listeler', async () => {
  const b = await rpc(H, 'sinif_olustur', {}); const c = await rpc(H, 'sinif_olustur', {});
  await expectErr(rpc(H, 'sinif_olustur', {}), 'COK_FAZLA_OTURUM');
  const l = await rpc(H, 'sinif_oturumlarim', {});
  eq(l.oturumlar.length, 3);
  await rpc(H, 'sinif_bitir', { p_oturum: b.oturum_id });
  const cd = await rpc(H, 'sinif_bitir', { p_oturum: c.oturum_id });
  eq([cd.oturum.durum, cd.oturum.bitis_nedeni], ['iptal', 'iptal']);
  eq((await rpc(H, 'sinif_bitir', { p_oturum: c.oturum_id })).oturum.durum, 'iptal', 'idempotent');
  await expectErr(rpc(H, 'sinif_basla', { p_oturum: c.oturum_id }), 'SINIF_BITTI');
  eq((await rpc(H, 'sinif_oturumlarim', {})).oturumlar.map((o) => o.oturum_id), [S.oturum_id]);
});

console.log('\n[Katılım]');
const P = {};   // katılımcı adı → {uid, id}
await test('Takma ad: uzunluk/karakter, uygunsuz, büyük/küçük harf duyarsız tekrar; boşluklar kırpılır', async () => {
  for (const ad of ['A', 'Ç', '12345678901234567', '😀😀', 'Ada<script>', '', null, 'Ada\u0007B']) {
    await expectErr(rpc(A[0], 'sinif_katil', { p_kod: S.kod, p_takma_ad: ad }), 'TAKMA_AD_GECERSIZ');
  }
  await expectErr(rpc(A[0], 'sinif_katil', { p_kod: S.kod, p_takma_ad: 'siktir' }), 'TAKMA_AD_UYGUNSUZ');
  await expectErr(rpc(A[0], 'sinif_katil', { p_kod: S.kod, p_takma_ad: 'Admin' }), 'TAKMA_AD_UYGUNSUZ');
  const r = await rpc(A[0], 'sinif_katil', { p_kod: ' ' + S.kod.toLowerCase().split('').join(' ') + ' ', p_takma_ad: '  Ayşe   Çağ  ' });
  eq([r.ok, r.takma_ad, r.yeniden, r.katildigi_tur, r.durum, r.oturum_id], [true, 'Ayşe Çağ', false, 1, 'lobi', S.oturum_id]);
  P['Ayşe Çağ'] = { uid: A[0], id: r.katilimci_id };
  await expectErr(rpc(A[1], 'sinif_katil', { p_kod: S.kod, p_takma_ad: 'AYŞE ÇAĞ' }), /TAKMA_AD_ALINMIS/);
  await expectErr(rpc(A[1], 'sinif_katil', { p_kod: 'QQQQQQ', p_takma_ad: 'Ada' }), 'SINIF_YOK');
});

await test('30 anonim katılımcı katılır; aynı kullanıcı yeniden katılınca aynı katılımcı döner (ad değişmez)', async () => {
  for (let i = 1; i < 30; i++) {
    const ad = `Ogr ${i}`;
    const r = await rpc(A[i], 'sinif_katil', { p_kod: S.kod, p_takma_ad: ad });
    P[ad] = { uid: A[i], id: r.katilimci_id };
  }
  const again = await rpc(A[5], 'sinif_katil', { p_kod: S.kod, p_takma_ad: 'Baska Ad' });
  eq([again.katilimci_id, again.takma_ad, again.yeniden], [P['Ogr 5'].id, 'Ogr 5', true]);
  eq((await rpc(H, 'sinif_ozet', { p_oturum: S.oturum_id })).katilimci_sayisi, 30);
  eq((await rpc(A[3], 'sinif_ozet', { p_oturum: S.oturum_id })).durum, 'lobi');
});

await test('Normal hesap: takma ad verilmezse kullanıcı adı; sunucu kendi oturumuna katılamaz; kullanıcı adı yoksa ad şart', async () => {
  const r = await rpc(R1, 'sinif_katil', { p_kod: S.kod });
  eq(r.takma_ad, 'ogrenci_hesap');
  P.ogrenci_hesap = { uid: R1, id: r.katilimci_id };
  await expectErr(rpc(H, 'sinif_katil', { p_kod: S.kod }), 'SUNUCU_KATILAMAZ');
  await expectErr(rpc(NOUSER, 'sinif_katil', { p_kod: S.kod }), 'TAKMA_AD_GECERSIZ');
});

await test('Ayrıl + yeniden katıl (puan korunur); atılan geri dönemez (ATILDIN) ve okuyamaz', async () => {
  eq((await rpc(A[30], 'sinif_katil', { p_kod: S.kod, p_takma_ad: 'Gidecek' })).durum, 'lobi');
  eq((await rpc(A[30], 'sinif_ayril', { p_oturum: S.oturum_id })).ok, true);
  eq((await rpc(A[30], 'sinif_ayril', { p_oturum: S.oturum_id })).ok, true, 'idempotent');
  eq((await rpc(H, 'sinif_ozet', { p_oturum: S.oturum_id })).katilimci_sayisi, 31);
  const back = await rpc(A[30], 'sinif_katil', { p_kod: S.kod });
  eq([back.yeniden, back.takma_ad], [true, 'Gidecek']);
  await expectErr(rpc(A[1], 'sinif_at', { p_oturum: S.oturum_id, p_katilimci: back.katilimci_id }), 'SADECE_SUNUCU');
  await expectErr(rpc(A[33], 'sinif_at', { p_oturum: S.oturum_id, p_katilimci: back.katilimci_id }), 'SINIF_YOK');
  await expectErr(rpc(H, 'sinif_at', { p_oturum: S.oturum_id, p_katilimci: randomUUID() }), 'KATILIMCI_YOK');
  eq((await rpc(H, 'sinif_at', { p_oturum: S.oturum_id, p_katilimci: back.katilimci_id })).ok, true);
  await expectErr(rpc(A[30], 'sinif_katil', { p_kod: S.kod, p_takma_ad: 'Yeni Ad' }), 'ATILDIN');
  await expectErr(durum(A[30], S.oturum_id), 'ATILDIN');
  await expectErr(rpc(A[30], 'sinif_ozet', { p_oturum: S.oturum_id }), 'ATILDIN');
  eq(Number((await q(A[30], `select count(*) n from public.sinif_oturumlari where id = $1`, [S.oturum_id])).rows[0].n), 0, 'RLS');
  const d = await durum(H, S.oturum_id);
  eq(d.katilimcilar.length, 31, 'atılan listede yok');
  ok(!d.katilimcilar.some((k) => k.takma_ad === 'Gidecek'));
  await expectErr(rpc(A[31], 'sinif_katil', { p_kod: S.kod, p_takma_ad: 'gidecek' }), 'TAKMA_AD_ALINMIS');
});

await test('Kapasite: dolu oturuma katılım ve ayrılıp dönüş SINIF_DOLU', async () => {
  const s = await rpc(H2, 'sinif_olustur', { p_ayarlar: { kapasite: 2 } });
  await rpc(A[31], 'sinif_katil', { p_kod: s.kod, p_takma_ad: 'K1' });
  await rpc(A[32], 'sinif_katil', { p_kod: s.kod, p_takma_ad: 'K2' });
  await expectErr(rpc(A[33], 'sinif_katil', { p_kod: s.kod, p_takma_ad: 'K3' }), 'SINIF_DOLU');
  await rpc(A[32], 'sinif_ayril', { p_oturum: s.oturum_id });
  await rpc(A[33], 'sinif_katil', { p_kod: s.kod, p_takma_ad: 'K3' });
  await expectErr(rpc(A[32], 'sinif_katil', { p_kod: s.kod }), 'SINIF_DOLU');
  await rpc(H2, 'sinif_bitir', { p_oturum: s.oturum_id });
  await expectErr(rpc(A[32], 'sinif_katil', { p_kod: s.kod }), 'SINIF_YOK');
});

await test('Hız sınırı: bir kullanıcı 1 saatte en çok 10 farklı oturuma katılır (COK_FAZLA_ISTEK)', async () => {
  const u = await makeAnon();
  const hosts = [H2, H3, H4, H2, H3, H4, H2, H3, H4, H2, H3];
  const made = [];
  for (let i = 0; i < 11; i++) {
    const s = await rpc(hosts[i], 'sinif_olustur', {});
    made.push([hosts[i], s]);
    if (i < 10) await rpc(u, 'sinif_katil', { p_kod: s.kod, p_takma_ad: 'Hizli' });
    else await expectErr(rpc(u, 'sinif_katil', { p_kod: s.kod, p_takma_ad: 'Hizli' }), 'COK_FAZLA_ISTEK');
    if ((i + 1) % 3 === 0 || i === 10) for (const [h, x] of made.splice(0)) await rpc(h, 'sinif_bitir', { p_oturum: x.oturum_id });
  }
  for (const [h, x] of made) await rpc(h, 'sinif_bitir', { p_oturum: x.oturum_id });
});

await test('RLS: üye olmayan oturumu, katılımcıları, turları göremez; gizli tablolar kimseye kapalı', async () => {
  const out = A[33];
  for (const t of ['sinif_oturumlari', 'sinif_katilimcilar', 'sinif_turlari', 'sinif_tur_sonuclari']) {
    eq(Number((await q(out, `select count(*) n from public.${t} where oturum_id = $1 or ($2 and id = $1)`.replace('oturum_id = $1 or ($2 and id = $1)', t === 'sinif_oturumlari' ? 'id = $1' : 'oturum_id = $1'), [S.oturum_id])).rows[0].n), 0, t);
    eq(Number((await q(R1, `select count(*) n from public.${t}`)).rows[0].n) >= (t === 'sinif_oturumlari' || t === 'sinif_katilimcilar' ? 1 : 0), true, t);
  }
  eq(Number((await q(A[2], `select count(*) n from public.sinif_katilimcilar where oturum_id = $1`, [S.oturum_id])).rows[0].n), 32, 'üye görür (atılan satırı atildi=true ile dahil)');
  for (const t of ['sinif_vaka_sirasi', 'sinif_tahminleri', 'cases_answer_key', 'answer_catalog']) {
    await expectErr(q(A[2], `select * from public.${t} limit 1`), DENIED);
    await expectErr(q(H, `select * from public.${t} limit 1`), DENIED);
  }
  await expectErr(durum(out, S.oturum_id), 'SINIF_YOK');
  await expectErr(rpc(out, 'sinif_ozet', { p_oturum: S.oturum_id }), 'SINIF_YOK');
  await expectErr(q(A[2], `update public.sinif_katilimcilar set puan = 99999 where oturum_id = $1`, [S.oturum_id]), DENIED);
  await expectErr(q(H, `update public.sinif_oturumlari set durum = 'bitti' where id = $1`, [S.oturum_id]), DENIED);
});

console.log('\n[Başlatma]');
await test('sinif_basla: yalnızca sunucu; boş lobide KIMSE_YOK; süzgece uyan FARKLI vakalar; geri sayım', async () => {
  const e = await rpc(H2, 'sinif_olustur', {});
  await expectErr(rpc(H2, 'sinif_basla', { p_oturum: e.oturum_id }), 'KIMSE_YOK');
  await rpc(H2, 'sinif_bitir', { p_oturum: e.oturum_id });
  // süzgeç: en kalabalık ders
  const top = await one(`select course, count(*) n from public.cases_answer_key where is_active and course is not null group by course order by 2 desc limit 1`);
  const f = await rpc(H3, 'sinif_olustur', { p_ayarlar: { kurslar: [top.course], vaka_sayisi: Math.min(15, Number(top.n)) } });
  await rpc(A[31], 'sinif_katil', { p_kod: f.kod, p_takma_ad: 'Suzgec' });
  await rpc(H3, 'sinif_basla', { p_oturum: f.oturum_id });
  const qrows = (await admin(`select q.case_id, k.course from public.sinif_vaka_sirasi q join public.cases_answer_key k using (case_id) where q.oturum_id = $1`, [f.oturum_id])).rows;
  eq(qrows.length, Math.min(15, Number(top.n)));
  eq(new Set(qrows.map((r) => r.case_id)).size, qrows.length, 'farklı vakalar');
  ok(qrows.every((r) => r.course === top.course), 'süzgeç');
  await rpc(H3, 'sinif_bitir', { p_oturum: f.oturum_id });

  await expectErr(rpc(A[1], 'sinif_basla', { p_oturum: S.oturum_id }), 'SADECE_SUNUCU');
  const d = await rpc(H, 'sinif_basla', { p_oturum: S.oturum_id });
  eq([d.oturum.durum, d.oturum.tur_no, d.tur.tur_no, d.tur.ipucu_no, d.tur.cevap, d.tur.aktif_sayisi], ['tur', 1, 1, 0, null, 31]);
  const cs = (await admin(`select case_id from public.sinif_vaka_sirasi where oturum_id = $1`, [S.oturum_id])).rows;
  eq(new Set(cs.map((r) => r.case_id)).size, 5);
  const ms = new Date(d.tur.son) - new Date(d.tur.baslangic);
  eq(ms, 60000, 'tur_son = başlangıç + 6 × 10 sn');
  const lead = new Date(d.tur.baslangic) - new Date(d.server_now);
  near(lead, 3000, 50, 'geri sayım 3 sn');
  await expectErr(rpc(H, 'sinif_basla', { p_oturum: S.oturum_id }), 'SINIF_BASLADI');
  await expectErr(guess(A[1], S.oturum_id, 'mdd'), 'TUR_BASLAMADI');
});

console.log('\n[Tur: ipuçları, tahmin, puan]');
await test('İpucu numarası sunucu saatine göre ilerler (enjekte edilen zaman)', async () => {
  for (const [sec, k] of [[0.001, 1], [9.9, 1], [10.0, 2], [25, 3], [49.9, 5], [55, 6]]) {
    await setElapsed(S.oturum_id, sec);
    const d = await durum(A[2], S.oturum_id);
    eq([d.tur.ipucu_no, d.oturum.durum], [k, 'tur'], `t=${sec}`);
  }
  await setElapsed(S.oturum_id, 0.001);
});

await test('Durumda cevap yok; katılımcının gördüğü vaka kimliği; başkalarının tahmini görünmez', async () => {
  const d = await durum(A[2], S.oturum_id);
  eq([d.rol, d.tur.cevap, d.tur_sonuclari, d.ben.takma_ad, d.ben.tur, d.ben.tahminlerim],
     ['katilimci', null, [], 'Ogr 2', { tahmin_sayisi: 0, kalan: 3, bitti: false, cozdu: false, puan: 0 }, []]);
  ok(typeof d.tur.case_id === 'string');
  ok(!JSON.stringify(d).includes('"diagnosis_id"'), 'cevap sızmamalı');
  ok(d.katilimcilar.every((k) => k.tur_puan === null && k.cozdu === null));
});

let k1;
await test('Doğru tahmin 1. ipucunda ≈1100; 4. ipucu ortasında ≈600; cevap dönmez', async () => {
  k1 = await key(S.oturum_id);
  await setElapsed(S.oturum_id, 0.001);
  const r = await guess(A[1], S.oturum_id, k1.diagnosis_id, { p_tur_no: 1 });
  eq([r.correct, r.same_group, r.guess_no, r.guesses_left, r.done, r.clue_index, r.tur_no], [true, false, 1, 0, true, 1, 1]);
  near(r.points, 1100, 1, '1. ipucu');
  ok(!('answer' in r) && !JSON.stringify(r).includes('therapy'), 'cevap yok');
  await setElapsed(S.oturum_id, 35);   // 4. ipucu (30–40 sn) penceresinin ortası
  const r4 = await guess(A[2], S.oturum_id, k1.diagnosis_id);
  eq([r4.correct, r4.clue_index], [true, 4]);
  near(r4.points, 550 + 50, 1, '4. ipucu');
  await setElapsed(S.oturum_id, 39.99);
  const r4b = await guess(A[3], S.oturum_id, k1.diagnosis_id);
  near(r4b.points, 550, 1, '4. ipucu sonu (bonus ≈0)');
  await setElapsed(S.oturum_id, 2);
  await expectErr(guess(A[1], S.oturum_id, k1.diagnosis_id), 'ZATEN_COZDUN');
});

await test('Yanlış, aynı grup ipucu, UNKNOWN_ITEM/DUPLICATE_GUESS hak yemez, hak sınırı (HAK_BITTI), p_tur_no uyuşmazlığı', async () => {
  const [same] = await wrongIds(S.oturum_id, 1, true);
  const others = await wrongIds(S.oturum_id, 3, false);
  const u = A[4];
  if (same) {
    const r = await guess(u, S.oturum_id, same);
    eq([r.correct, r.same_group, r.guesses_left, r.done, r.points], [false, true, 2, false, 0]);
  } else {
    await guess(u, S.oturum_id, others.pop());
  }
  await expectErr(guess(u, S.oturum_id, 'yok_boyle_tani'), 'UNKNOWN_ITEM');
  await expectErr(guess(u, S.oturum_id, same || others[0]), same ? 'DUPLICATE_GUESS' : /DUPLICATE_GUESS|.*/);
  await expectErr(guess(u, S.oturum_id, others[0], { p_tur_no: 2 }), 'TUR_KAPALI');
  const r2 = await guess(u, S.oturum_id, others[0]);
  eq([r2.correct, r2.same_group, r2.guess_no, r2.guesses_left, r2.done], [false, false, 2, 1, false]);
  const r3 = await guess(u, S.oturum_id, others[1]);
  eq([r3.guess_no, r3.guesses_left, r3.done], [3, 0, true]);
  await expectErr(guess(u, S.oturum_id, k1.diagnosis_id), 'HAK_BITTI');
  const d = await durum(u, S.oturum_id);
  eq([d.ben.tur.bitti, d.ben.tur.cozdu, d.ben.tur.kalan, d.ben.tahminlerim.length], [true, false, 0, 3]);
  eq(d.ben.tahminlerim.map((g) => g.tahmin_no), [1, 2, 3]);
  await expectErr(guess(H, S.oturum_id, k1.diagnosis_id), 'SINIF_YOK');
});

await test('Tur sırasında: tamamlananlar "bitti" olarak görünür ama puan/çözme bilgisi ve toplam puan değişmez', async () => {
  const d = await durum(A[9], S.oturum_id);
  eq(d.tur.biten_sayisi, 4);
  eq(d.katilimcilar.filter((k) => k.bitti).length, 4);
  ok(d.katilimcilar.every((k) => k.puan === 0 && k.tur_puan === null && k.cozdu === null), 'toplamlar tur kapanınca');
  eq(d.tur.cozen_sayisi, null);
  // RLS: başkasının tur sonucu satırı tur kapanmadan görünmez; kendi satırı görünür; sunucu hepsini görür
  eq(Number((await q(A[9], `select count(*) n from public.sinif_tur_sonuclari where oturum_id = $1`, [S.oturum_id])).rows[0].n), 0);
  eq(Number((await q(A[1], `select count(*) n from public.sinif_tur_sonuclari where oturum_id = $1`, [S.oturum_id])).rows[0].n), 1);
  eq(Number((await q(H, `select count(*) n from public.sinif_tur_sonuclari where oturum_id = $1`, [S.oturum_id])).rows[0].n), 4);
});

await test('Geç katılım: tur sırasında katılan sonraki turdan oynar (TUR_DISI); "herkes bitti" sayımına girmez', async () => {
  const r = await rpc(A[31], 'sinif_katil', { p_kod: S.kod, p_takma_ad: 'Gec Kalan' });
  eq([r.katildigi_tur, r.durum, r.tur_no], [2, 'tur', 1]);
  P['Gec Kalan'] = { uid: A[31], id: r.katilimci_id };
  await expectErr(guess(A[31], S.oturum_id, k1.diagnosis_id), 'TUR_DISI');
  eq((await durum(A[31], S.oturum_id)).ben.aktif, false);
  const s = await rpc(H4, 'sinif_olustur', { p_ayarlar: { gec_katilim: false } });
  await rpc(A[32], 'sinif_katil', { p_kod: s.kod, p_takma_ad: 'Erken' });
  await rpc(H4, 'sinif_basla', { p_oturum: s.oturum_id });
  await expectErr(rpc(A[33], 'sinif_katil', { p_kod: s.kod, p_takma_ad: 'Gec' }), 'SINIF_BASLADI');
  eq((await rpc(A[32], 'sinif_katil', { p_kod: s.kod })).yeniden, true, 'eski katılımcı yine bağlanır');
  await rpc(H4, 'sinif_bitir', { p_oturum: s.oturum_id });
});

await test('Herkes bitince tur kendiliğinden kapanır (herkes_bitti); cevap ve sonuçlar açılır; toplamlar eklenir', async () => {
  const s0 = (await sess(S.oturum_id)).surum;
  // Ogr 5..29 + ogrenci_hesap + Ayşe: bazıları çözer, bazıları 3 yanlışla biter
  const wrong = await wrongIds(S.oturum_id, 3, false);
  const finishers = Object.entries(P).filter(([n]) => !['Ogr 1', 'Ogr 2', 'Ogr 3', 'Ogr 4', 'Gec Kalan'].includes(n));
  eq(finishers.length, 27);
  await setElapsed(S.oturum_id, 12);   // 2. ipucu
  for (let i = 0; i < finishers.length; i++) {
    const [n, p] = finishers[i];
    const last = i === finishers.length - 1;
    if (i % 3 === 0) {   // 3 yanlış
      for (const w of wrong) {
        const r = await guess(p.uid, S.oturum_id, w);
        if (!last) eq((await sess(S.oturum_id)).durum, 'tur', `${n} sonrası tur açık kalmalı`);
        if (r.done) break;
      }
    } else {
      const r = await guess(p.uid, S.oturum_id, k1.diagnosis_id);
      eq([r.correct, r.clue_index], [true, 2]);
    }
  }
  const o = await sess(S.oturum_id);
  eq([o.durum, o.surum, o.tur_no], ['cevap', s0 + 1, 1]);
  eq((await one(`select kapanma_nedeni from public.sinif_turlari where oturum_id = $1 and tur_no = 1`, [S.oturum_id])).kapanma_nedeni, 'herkes_bitti');
  const d = await durum(A[9], S.oturum_id);
  eq(d.tur.cevap.diagnosis_id, k1.diagnosis_id);
  eq(Object.keys(d.tur.cevap).sort(), ['diagnosis_id', 'pharmacology_id', 'therapy_id']);
  eq(d.tur_sonuclari.length, 1);
  eq(d.tur_sonuclari[0].cozen_sayisi, 3 + 18);   // Ogr1-3 + 18 çözen
  eq(d.tur_sonuclari[0].katilan_sayisi, 31);
  eq(d.tur.cozen_sayisi, 21);
  const top = d.katilimcilar[0];
  eq([top.takma_ad, top.sira, top.cozdu, top.ipucu_no], ['Ogr 1', 1, true, 1]);
  near(top.puan, 1100, 1);
  eq(top.tur_puan, top.puan);
  ok(d.katilimcilar.find((k) => k.takma_ad === 'Ogr 4').tur_puan === 0);
  await expectErr(guess(A[10], S.oturum_id, k1.diagnosis_id), 'TUR_KAPALI');
  eq(Number((await q(A[9], `select count(*) n from public.sinif_tur_sonuclari where oturum_id = $1`, [S.oturum_id])).rows[0].n), 31, 'kapanınca hepsi görünür (4 + 27)');
});

await test('Sıralama: puan azalan, eşit puan aynı sıra (rank), sonra doğru sayısı/süre/ad', async () => {
  const d = await durum(H, S.oturum_id);
  const L = d.katilimcilar;
  for (let i = 1; i < L.length; i++) ok(L[i - 1].puan >= L[i].puan, 'azalan');
  for (let i = 1; i < L.length; i++) {
    if (L[i].puan === L[i - 1].puan) eq(L[i].sira, L[i - 1].sira, 'eşitlik');
    else eq(L[i].sira, i + 1, 'rank');
  }
  // eşitlik kesin olsun: iki kişiye aynı puanı ver
  const zeros = L.filter((k) => k.puan === 0);
  ok(zeros.length >= 2 && zeros.every((k) => k.sira === zeros[0].sira), 'sıfırlar aynı sırada');
  const me = await durum(A[5], S.oturum_id);
  eq(me.ben.sira, L.find((k) => k.katilimci_id === me.ben.katilimci_id).sira);
});

console.log('\n[Sunucu akışı]');
await test('sinif_sonraki: cevap → skor → tur 2; çift tık koruması (p_beklenen); yanlış aşama hataları', async () => {
  await expectErr(rpc(A[1], 'sinif_sonraki', { p_oturum: S.oturum_id }), 'SADECE_SUNUCU');
  const a = await rpc(H, 'sinif_sonraki', { p_oturum: S.oturum_id, p_beklenen: 'cevap' });
  eq([a.oturum.durum, a.degisti], ['skor', true]);
  const b = await rpc(H, 'sinif_sonraki', { p_oturum: S.oturum_id, p_beklenen: 'cevap' });
  eq([b.oturum.durum, b.degisti], ['skor', false]);
  const t2 = await rpc(H, 'sinif_sonraki', { p_oturum: S.oturum_id });
  eq([t2.oturum.durum, t2.oturum.tur_no, t2.tur.tur_no, t2.tur.cevap, t2.degisti], ['tur', 2, 2, null, true]);
  ok(t2.tur.case_id !== k1.case_id, 'yeni vaka');
  eq(t2.tur_sonuclari.length, 1, 'önceki tur özeti kalır');
  await expectErr(rpc(H, 'sinif_sonraki', { p_oturum: S.oturum_id }), 'ASAMA_UYGUN_DEGIL');
  eq(t2.tur.aktif_sayisi, 32, 'geç katılan artık aktif');
});

await test('Süre dolunca (6 × aralık) ilk okuma turu kapatır (sure); sunucu erken bitirme (sunucu); turu_bitir idempotent', async () => {
  const k2 = await key(S.oturum_id);
  await setElapsed(S.oturum_id, 5);
  const g = await guess(A[31], S.oturum_id, k2.diagnosis_id);   // geç kalan bu turda oynar
  eq(g.correct, true);
  await setElapsed(S.oturum_id, 60);
  await expectErr(guess(A[2], S.oturum_id, k2.diagnosis_id), 'TUR_KAPALI');
  const oz = await rpc(A[2], 'sinif_ozet', { p_oturum: S.oturum_id });
  eq([oz.durum, oz.tur_no], ['cevap', 2]);
  eq((await one(`select kapanma_nedeni from public.sinif_turlari where oturum_id = $1 and tur_no = 2`, [S.oturum_id])).kapanma_nedeni, 'sure');
  const x = await rpc(H, 'sinif_turu_bitir', { p_oturum: S.oturum_id });
  eq([x.oturum.durum, x.degisti], ['cevap', false]);
  await rpc(H, 'sinif_sonraki', { p_oturum: S.oturum_id });
  await rpc(H, 'sinif_sonraki', { p_oturum: S.oturum_id });   // tur 3
  await setElapsed(S.oturum_id, 1);
  const k3 = await key(S.oturum_id);
  await guess(A[6], S.oturum_id, k3.diagnosis_id);
  await expectErr(rpc(A[6], 'sinif_turu_bitir', { p_oturum: S.oturum_id }), 'SADECE_SUNUCU');
  const e = await rpc(H, 'sinif_turu_bitir', { p_oturum: S.oturum_id });
  eq([e.oturum.durum, e.degisti, e.tur.kapanma_nedeni, e.tur.cevap.diagnosis_id], ['cevap', true, 'sunucu', k3.diagnosis_id]);
});

await test('Son tur sonrası skor → bitti; podyum; bitmiş oturumda değişiklik SINIF_BITTI; durum okunur', async () => {
  await rpc(H, 'sinif_sonraki', { p_oturum: S.oturum_id });   // skor
  for (let t = 4; t <= 5; t++) {
    const d = await rpc(H, 'sinif_sonraki', { p_oturum: S.oturum_id });
    eq([d.oturum.durum, d.oturum.tur_no], ['tur', t]);
    await rpc(H, 'sinif_turu_bitir', { p_oturum: S.oturum_id });
    await rpc(H, 'sinif_sonraki', { p_oturum: S.oturum_id });
  }
  const f = await rpc(H, 'sinif_sonraki', { p_oturum: S.oturum_id, p_beklenen: 'skor' });
  eq([f.oturum.durum, f.oturum.bitis_nedeni, f.degisti], ['bitti', 'tamamlandi', true]);
  ok(Array.isArray(f.podyum) && f.podyum.length >= 3 && f.podyum.every((p) => p.sira <= 3), JSON.stringify(f.podyum));
  eq(f.podyum[0].takma_ad, f.katilimcilar[0].takma_ad);
  eq(f.tur_sonuclari.length, 5);
  for (const fn of ['sinif_sonraki', 'sinif_turu_bitir', 'sinif_basla']) await expectErr(rpc(H, fn, { p_oturum: S.oturum_id }), 'SINIF_BITTI');
  eq((await rpc(H, 'sinif_bitir', { p_oturum: S.oturum_id })).oturum.durum, 'bitti', 'idempotent');
  await expectErr(guess(A[1], S.oturum_id, 'mdd'), 'TUR_KAPALI');
  const me = await durum(A[1], S.oturum_id);
  eq(me.oturum.durum, 'bitti');
  ok(me.podyum.length >= 3);
  await expectErr(rpc(A[33], 'sinif_katil', { p_kod: S.kod, p_takma_ad: 'Sonradan' }), 'SINIF_YOK');
});

await test('Ayrılan katılımcı "herkes bitti" sayımından düşer; sunucu tur ortasında bitirince tur puanlanır', async () => {
  const s = await rpc(H2, 'sinif_olustur', { p_ayarlar: { vaka_sayisi: 3, tahmin_hakki: 1 } });
  const u1 = await makeAnon(), u2 = await makeAnon();
  await rpc(u1, 'sinif_katil', { p_kod: s.kod, p_takma_ad: 'Bir' });
  await rpc(u2, 'sinif_katil', { p_kod: s.kod, p_takma_ad: 'Iki' });
  await rpc(H2, 'sinif_basla', { p_oturum: s.oturum_id });
  await setElapsed(s.oturum_id, 1);
  const k = await key(s.oturum_id);
  await guess(u1, s.oturum_id, k.diagnosis_id);
  eq((await sess(s.oturum_id)).durum, 'tur');
  await rpc(u2, 'sinif_ayril', { p_oturum: s.oturum_id });
  eq((await sess(s.oturum_id)).durum, 'cevap', 'kalan herkes bitti');
  await rpc(H2, 'sinif_sonraki', { p_oturum: s.oturum_id });
  await rpc(H2, 'sinif_sonraki', { p_oturum: s.oturum_id });
  await setElapsed(s.oturum_id, 1);
  const k2 = await key(s.oturum_id);
  const g = await guess(u1, s.oturum_id, k2.diagnosis_id);
  eq((await sess(s.oturum_id)).durum, 'cevap', 'tek aktif kişi bitti');
  await rpc(H2, 'sinif_sonraki', { p_oturum: s.oturum_id });
  await rpc(H2, 'sinif_sonraki', { p_oturum: s.oturum_id });   // tur 3
  await setElapsed(s.oturum_id, 1);
  const k3 = await key(s.oturum_id);
  const g3 = await rpc(u2, 'sinif_katil', { p_kod: s.kod });   // geri döndü, oynayabilir (katildigi_tur 1)
  eq(g3.yeniden, true);
  await guess(u2, s.oturum_id, k3.diagnosis_id);
  const b = await rpc(H2, 'sinif_bitir', { p_oturum: s.oturum_id });
  eq([b.oturum.durum, b.oturum.bitis_nedeni, b.tur.kapanma_nedeni], ['bitti', 'sunucu', 'oturum_bitti']);
  const bir = b.katilimcilar.find((x) => x.takma_ad === 'Bir'), iki = b.katilimcilar.find((x) => x.takma_ad === 'Iki');
  eq(iki.dogru_sayisi, 1, 'son tur puanlandı');
  eq(bir.dogru_sayisi, 2);
  ok(bir.puan > iki.puan && g.points > 0);
});

console.log('\n[Zaman aşımı]');
await test('Hareketsiz (2 sa) / eski (24 sa) açık oturum bitti olur (zaman_asimi); kod yeniden kullanılabilir', async () => {
  const s = await rpc(H3, 'sinif_olustur', {});
  const u = await makeAnon();
  await rpc(u, 'sinif_katil', { p_kod: s.kod, p_takma_ad: 'Uyuyan' });
  await admin(`update public.sinif_oturumlari set durum_degisti = now() - interval '121 minutes' where id = $1`, [s.oturum_id]);
  const oz = await rpc(u, 'sinif_ozet', { p_oturum: s.oturum_id });
  eq([oz.durum], ['bitti']);
  eq((await sess(s.oturum_id)).bitis_nedeni, 'zaman_asimi');
  // tur ortasında + süpürme (başka bir oturum açılırken)
  const t = await rpc(H3, 'sinif_olustur', {});
  await rpc(u, 'sinif_katil', { p_kod: t.kod, p_takma_ad: 'Uyuyan' });
  await rpc(await makeAnon(), 'sinif_katil', { p_kod: t.kod, p_takma_ad: 'Uyuyan2' });
  await rpc(H3, 'sinif_basla', { p_oturum: t.oturum_id });
  await setElapsed(t.oturum_id, 1);
  await guess(u, t.oturum_id, (await key(t.oturum_id)).diagnosis_id);
  await admin(`update public.sinif_oturumlari set olusturma = now() - interval '25 hours' where id = $1`, [t.oturum_id]);
  await rpc(H4, 'sinif_olustur', {});   // süpürür
  const o = await sess(t.oturum_id);
  eq([o.durum, o.bitis_nedeni], ['bitti', 'zaman_asimi']);
  eq((await one(`select kapanma_nedeni from public.sinif_turlari where oturum_id = $1 and tur_no = 1`, [t.oturum_id])).kapanma_nedeni, 'oturum_bitti');
  ok((await one(`select puan from public.sinif_katilimcilar where oturum_id = $1`, [t.oturum_id])).puan > 0, 'açık tur puanlandı');
  // kod çakışması: bitmiş oturumun kodu açık bir oturumda yeniden kullanılabilir
  await admin(`update public.sinif_oturumlari set kod = $2 where id = (select id from public.sinif_oturumlari where host_id = $1 and durum = 'lobi' limit 1)`, [H4, s.kod]);
  eq((await one(`select count(*) n from public.sinif_oturumlari where kod = $1`, [s.kod])).n > 1, true);
});

console.log('\n[Yan etki yok]');
await test('Sınıf oyunları RP, maç sayısı, maç sonucu, günlük ve seri tablolarına dokunmaz', async () => {
  // NUMARALANDIRMA testinde oda/günlük satırı eklendi; onları hesaba katmak için yeniden ölçüm 0006 testlerinden önceki ek veriyle
  const now = await rpSnap();
  eq([now.p, now.total, now.mr, now.ss], [snapBefore.p, snapBefore.total, snapBefore.mr, snapBefore.ss], 'RP/maç/seri');
  eq(Number(now.dr), Number(snapBefore.dr) + 1, 'yalnızca testin elle eklediği günlük satır');
  eq(await num(`select ranked_points from public.profiles where id = $1`, [R1]), 77);
  for (const fn of ['sinif_tahmin', 'sinif_durum', '_sinif_turu_kapat', '_sinif_durum_json', 'sinif_sonraki', 'sinif_bitir']) {
    const src = (await one(`select string_agg(prosrc, ' ') s from pg_proc where proname = $1`, [fn])).s;
    ok(!/ranked_points|match_results|matches_played|daily_results|solo_streaks/.test(src), fn);
  }
});

await test('Yetkiler: sınıf RPC\'leri yalnızca authenticated; iç fonksiyonlar kimseye açık değil; hepsi security definer + search_path=""', async () => {
  const rows = (await admin(`
    select p.proname, has_function_privilege('authenticated', p.oid, 'execute') a, has_function_privilege('anon', p.oid, 'execute') n,
           p.prosecdef d, array_to_string(p.proconfig, ',') cfg
      from pg_proc p where p.pronamespace = 'public'::regnamespace and (p.proname like 'sinif%' or p.proname like '\\_sinif%' or p.proname in ('anon_mu', '_uid', '_profil_ac', '_handle_user_upgraded'))`)).rows;
  for (const r of rows) {
    ok(!r.n, `${r.proname} anon'a açık`);
    ok(r.cfg === 'search_path=""', `${r.proname} search_path`);
    if (r.proname.startsWith('_')) ok(!r.a, `${r.proname} istemciye açık`);
    else ok(r.a, `${r.proname} authenticated'a kapalı`);
  }
  ok(rows.filter((r) => r.proname.startsWith('sinif_')).every((r) => r.d), 'security definer');
  const pub = (await admin(`select tablename from pg_publication_tables where pubname = 'supabase_realtime' and tablename like 'sinif%' order by 1`)).rows.map((r) => r.tablename);
  eq(pub, ['sinif_katilimcilar', 'sinif_oturumlari', 'sinif_tur_sonuclari']);
});

if (db.pg) {
  console.log('\n[Eşzamanlılık (iki bağlantı)]');
  const conn = async (uid) => {
    const c = await db.mk();
    await c.query('begin');
    await c.query(`select set_config('request.jwt.claims', $1, true)`, [claimsOf(uid)]);
    await c.query('set local role authenticated');
    return c;
  };
  const late = (p) => Promise.race([p.then(() => 'done', () => 'done'), new Promise((r) => setTimeout(() => r('waiting'), 400))]);
  await test('Son iki katılımcı aynı anda bitirir: tur tam bir kez kapanır (surum +1)', async () => {
    const s = await rpc(H2, 'sinif_olustur', {});
    const u1 = await makeAnon(), u2 = await makeAnon();
    await rpc(u1, 'sinif_katil', { p_kod: s.kod, p_takma_ad: 'Es1' });
    await rpc(u2, 'sinif_katil', { p_kod: s.kod, p_takma_ad: 'Es2' });
    await rpc(H2, 'sinif_basla', { p_oturum: s.oturum_id });
    await setElapsed(s.oturum_id, 1);
    const k = await key(s.oturum_id);
    const v0 = (await sess(s.oturum_id)).surum;
    const [a, b] = [await conn(u1), await conn(u2)];
    await a.query(`select public.sinif_tahmin($1, $2)`, [s.oturum_id, k.diagnosis_id]);
    const pb = b.query(`select public.sinif_tahmin($1, $2)`, [s.oturum_id, k.diagnosis_id]);
    eq(await late(pb), 'waiting', 'oturum satırı kilidi beklemeli');
    await a.query('commit');
    await pb; await b.query('commit');
    const o = await sess(s.oturum_id);
    eq([o.durum, o.surum], ['cevap', v0 + 1]);
    await a.end(); await b.end();
    await rpc(H2, 'sinif_bitir', { p_oturum: s.oturum_id });
  });
  await test('Aynı takma adla aynı anda iki katılım: biri TAKMA_AD_ALINMIS', async () => {
    const s = await rpc(H2, 'sinif_olustur', {});
    const u1 = await makeAnon(), u2 = await makeAnon();
    const [a, b] = [await conn(u1), await conn(u2)];
    await a.query(`select public.sinif_katil($1, 'Ikiz')`, [s.kod]);
    const pb = b.query(`select public.sinif_katil($1, 'ikiz')`, [s.kod]);
    eq(await late(pb), 'waiting');
    await a.query('commit');
    let err = null;
    try { await pb; } catch (e) { err = e.message; }
    await b.query('rollback');
    eq(err, 'TAKMA_AD_ALINMIS');
    await a.end(); await b.end();
    await rpc(H2, 'sinif_bitir', { p_oturum: s.oturum_id });
  });
} else {
  console.log('\n[Eşzamanlılık] PGlite tek bağlantılı: atlandı (DATABASE_URL ile çalışır).');
}

console.log(`\nSonuç: ${passed} geçti, ${failed} kaldı`);
if (failed) console.log('Kalanlar:\n - ' + failures.join('\n - '));
await db.close();
process.exit(failed ? 1 : 0);
