// PsikoVaka — 0005 isim filtresi senaryo testi
//   (supabase/tests klasöründe) node isim_filtresi.test.mjs           PGlite
//   DATABASE_URL=postgres://... node isim_filtresi.test.mjs           boş, atılabilir bir test veritabanı (ASLA canlı proje)
// Derlem ve SQL/JS eşliği: node tools/isim_filtresi/test/calistir.mjs --sql
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const read = (p) => readFileSync(path.join(root, p), 'utf8');

async function connect() {
  if (process.env.DATABASE_URL) {
    const { default: pg } = await import('pg');
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const notices = [];
    client.on('notice', (n) => notices.push(n.message));
    return { name: 'postgres (pg)', exec: (s) => client.query(s), query: (s, p) => client.query(s, p), close: () => client.end(), notices };
  }
  const { PGlite } = await import('@electric-sql/pglite');
  const db = new PGlite();
  return { name: 'PGlite', exec: (s) => db.exec(s), query: (s, p) => db.query(s, p), close: () => db.close(), notices: [] };
}

const db = await connect();
console.log(`Veritabanı: ${db.name}`);
await db.exec(read('tests/00_supabase_stubs.sql'));
await db.exec(read('migrations/0001_init.sql'));
await db.exec(read('seed/0002_cases_answer_key.sql'));
for (const m of ['0002_online_ek', '0003_gunluk_ve_hizli', '0004_kural_duzeltmeleri']) await db.exec(read(`migrations/${m}.sql`));

let passed = 0, failed = 0;
async function test(name, fn) {
  try { await fn(); passed++; console.log(`  ok   ${name}`); }
  catch (e) { failed++; console.log(`  FAIL ${name}\n       ${e.stack || e.message}`); }
  finally { await db.exec('reset role'); }
}
function eq(a, b, msg = '') { const A = JSON.stringify(a), B = JSON.stringify(b); if (A !== B) throw new Error(`${msg} beklenen ${B}, gelen ${A}`); }
function ok(c, msg) { if (!c) throw new Error(msg || 'koşul sağlanmadı'); }
async function expectErr(p, codeOrRe) {
  try { await p; } catch (e) {
    const m = e.message || '';
    if (codeOrRe instanceof RegExp ? codeOrRe.test(m) : m === codeOrRe) return m;
    throw new Error(`beklenen hata ${codeOrRe}, gelen "${m}"`);
  }
  throw new Error(`beklenen hata ${codeOrRe}, ama başarılı oldu`);
}
const DENIED = /permission denied/;
async function as(uid, fn) {
  const claims = uid ? JSON.stringify({ sub: uid, role: 'authenticated' }) : '';
  await db.exec(`select set_config('request.jwt.claims', '${claims}', false); set role ${uid ? 'authenticated' : 'anon'};`);
  try { return await fn(); } finally { await db.exec('reset role'); }
}
const q = (uid, sql, params = []) => as(uid, () => db.query(sql, params));
async function rpc(uid, fn, args = {}) {
  const keys = Object.keys(args);
  const res = await q(uid, `select public.${fn}(${keys.map((k, i) => `${k} => $${i + 1}`).join(', ')}) as r`, keys.map((k) => args[k]));
  return res.rows[0].r;
}
const admin = (sql, params = []) => db.query(sql, params);
const one = async (sql, params) => (await admin(sql, params)).rows[0];
async function newUser(fullName) {
  const id = randomUUID();
  await admin(`insert into auth.users (id, email, raw_user_meta_data) values ($1, $2, $3)`,
    [id, `${id.slice(0, 8)}@test.local`, JSON.stringify(fullName ? { full_name: fullName } : {})]);
  return id;
}
const prof = (id) => one(`select username, display_name, needs_rename, ranked_points, updated_at from public.profiles where id = $1`, [id]);

// ---------------------------------------------------------------- 0005 ÖNCESİ: canlıdaki gibi kötü adlı hesaplar
const KOTU = await newUser('Kötü Ad');           // kullanıcı adı uygunsuz
await rpc(KOTU, 'set_username', { p_username: 'AmYalamak31' });
const KOTU_GA = await newUser('Orospu Çocuğu');  // kullanıcı adı temiz, görünen ad uygunsuz
await rpc(KOTU_GA, 'set_username', { p_username: 'temiz_ad' });
const IKISI = await newUser('Siktir Git');       // ikisi de uygunsuz
await rpc(IKISI, 'set_username', { p_username: 'fuckboy99' });
const AYRILMIS = await newUser('Destek');        // eski ayrılmış ad: işaretlenmez
await rpc(AYRILMIS, 'set_username', { p_username: 'admin' });
const NORMAL = await newUser('Ayşe Kaya');
await rpc(NORMAL, 'set_username', { p_username: 'ayse_kaya' });
const NORMAL2 = await newUser('Mehmet');
await rpc(NORMAL2, 'set_username', { p_username: 'amca_mehmet' });
for (const [u, rp] of [[KOTU, 900], [KOTU_GA, 800], [IKISI, 700], [NORMAL, 100], [NORMAL2, 50]]) {
  await admin(`update public.profiles set ranked_points = $2 where id = $1`, [u, rp]);
}
// günlük sonuçlar (pes ederek)
for (const u of [KOTU, NORMAL, NORMAL2]) {
  await rpc(u, 'daily_begin', { p_target: 'diagnosis' });
  await rpc(u, 'daily_give_up', { p_target: 'diagnosis' });
}
// KOTU'nun açık lobisi; NORMAL ile arkadaşlık
const odaKotu = await rpc(KOTU, 'create_room', { p_mode: 'ffa', p_capacity: 4, p_visibility: 'public' });
const odaNormal = await rpc(NORMAL2, 'create_room', { p_mode: 'ffa', p_capacity: 4, p_visibility: 'public' });
await rpc(NORMAL, 'send_friend_request', { p_username: 'AmYalamak31' });
await rpc(KOTU, 'respond_friend_request', { p_friendship_id: (await one(`select id from public.friendships where requester_id = $1`, [NORMAL])).id, p_accept: true });
const once = await one(`select username from public.profiles where id = $1`, [KOTU]);

// ---------------------------------------------------------------- 0005 (iki kez)
const MIG = read('migrations/0005_isim_filtresi.sql');
await db.exec(MIG);
const sonra1 = await prof(KOTU);
const bayrak1 = (await one(`select count(*)::int n from public.profiles where needs_rename`)).n;
await db.exec(MIG);

console.log('\nTaşıma ve tarama');
await test('0005 mevcut kötü adları işaretler (ayrılmış eski ad işaretlenmez)', async () => {
  eq((await prof(KOTU)).needs_rename, true, 'kullanıcı adı');
  eq((await prof(KOTU_GA)).needs_rename, true, 'görünen ad');
  eq((await prof(IKISI)).needs_rename, true, 'ikisi');
  eq((await prof(AYRILMIS)).needs_rename, false, 'ayrılmış');
  eq((await prof(NORMAL)).needs_rename, false);
  eq((await prof(NORMAL2)).needs_rename, false, 'amca_mehmet');
  eq(bayrak1, 3);
});
await test('0005 ikinci kez çalışınca hiçbir şey değişmez', async () => {
  eq((await one(`select count(*)::int n from public.profiles where needs_rename`)).n, 3);
  const s2 = await prof(KOTU);
  eq(String(s2.updated_at), String(sonra1.updated_at), 'updated_at');
  eq(s2.username, once.username, 'ad korunur');
  eq((await one(`select count(*)::int n from public.isim_filtresi_desenler`)).n, 4);
  eq((await one(`select count(*)::int n from public.isim_filtresi_terimleri where tur = 'tr'`)).n > 50, true);
});
await test('tarama NOTICE ile sayıyı bildirir (Actions günlüğü)', async () => {
  if (db.name === 'PGlite') return; // PGlite notice dinleyicisi bu sarmalayıcıda yok
  ok(db.notices.some((m) => /isim filtresi: \d+ profil/.test(m)), 'notice');
});

console.log('\nGizleme');
await test('leaderboard: işaretliler başkalarına ve kendine görünmez', async () => {
  const r = await q(NORMAL, `select user_id from public.leaderboard`);
  const ids = r.rows.map((x) => x.user_id);
  ok(!ids.includes(KOTU) && !ids.includes(KOTU_GA) && !ids.includes(IKISI), 'gizli');
  ok(ids.includes(NORMAL) && ids.includes(AYRILMIS), 'normal görünür');
  const r2 = await q(KOTU, `select user_id from public.leaderboard where user_id = $1`, [KOTU]);
  eq(r2.rows.length, 0, 'kendisi');
  eq((await q(NORMAL, `select position from public.leaderboard where user_id = $1`, [NORMAL])).rows[0].position | 0, 1, 'sıra işaretlileri saymaz');
});
await test('profiles doğrudan okuma (arkadaş arama, gömmeler): işaretli başkası görünmez, kendisi görür', async () => {
  eq((await q(NORMAL, `select id from public.profiles where username ilike 'Am%'`)).rows.map((x) => x.id), [NORMAL2]);
  eq((await q(NORMAL, `select count(*)::int n from public.profiles where id = $1`, [KOTU])).rows[0].n, 0);
  const own = (await q(KOTU, `select username, needs_rename from public.profiles where id = $1`, [KOTU])).rows[0];
  eq(own.needs_rename, true);
  // arkadaşlık satırı kalır ama gömülen profil boş gelir (istemci atlar)
  const f = await q(NORMAL, `select f.status, p.id as pid from public.friendships f left join public.profiles p on p.id = f.addressee_id where f.requester_id = $1`, [NORMAL]);
  eq(f.rows.map((x) => [x.status, x.pid]), [['accepted', null]]);
});
await test('send_friend_request: işaretli kullanıcı USER_NOT_FOUND', async () => {
  await expectErr(rpc(NORMAL2, 'send_friend_request', { p_username: 'AmYalamak31' }), 'USER_NOT_FOUND');
  await expectErr(rpc(NORMAL2, 'send_friend_request', { p_username: 'temiz_ad' }), 'USER_NOT_FOUND');
  const r = await rpc(NORMAL2, 'send_friend_request', { p_username: 'ayse_kaya' });
  eq(r.status, 'pending');
});
await test('açık oda listesi: işaretli sahibin lobisi listelenmez; üyesi görmeye devam eder', async () => {
  const r = await q(NORMAL, `select id from public.rooms where visibility = 'public' and status = 'lobby'`);
  const ids = r.rows.map((x) => x.id);
  ok(!ids.includes(odaKotu.id), 'gizli');
  ok(ids.includes(odaNormal.id), 'normal oda görünür');
  eq((await q(KOTU, `select count(*)::int n from public.rooms where id = $1`, [odaKotu.id])).rows[0].n, 1, 'sahibi');
});
await test("get_room_state: işaretli BAŞKA oyuncu 'Oyuncu' görünür, kendisi kendi adını görür", async () => {
  await rpc(NORMAL, 'join_room', { p_code: odaKotu.code });
  const st = await rpc(NORMAL, 'get_room_state', { p_room_id: odaKotu.id });
  const k = st.players.find((p) => p.user_id === KOTU);
  eq([k.username, k.display_name], ['Oyuncu', 'Oyuncu']);
  eq(st.players.find((p) => p.user_id === NORMAL).username, 'ayse_kaya');
  const st2 = await rpc(KOTU, 'get_room_state', { p_room_id: odaKotu.id });
  eq(st2.players.find((p) => p.user_id === KOTU).username, 'AmYalamak31');
  await rpc(NORMAL, 'leave_room', { p_room_id: odaKotu.id });
});
await test("günlük sıralama: işaretli satırlarda yok; kendi 'me' satırı var; görünüm de süzer", async () => {
  const b = await rpc(NORMAL, 'get_daily_leaderboard', { p_target: 'diagnosis' });
  ok(!b.rows.some((r) => r.user_id === KOTU), 'satırlarda yok');
  eq(b.rows.length, 2);
  const m = await rpc(KOTU, 'get_daily_leaderboard', { p_target: 'diagnosis' });
  ok(m.me && m.me.user_id === KOTU, 'me');
  ok(!m.rows.some((r) => r.user_id === KOTU), 'kendi satırı listede değil');
  const v = await q(NORMAL, `select user_id from public.daily_leaderboard`);
  ok(!v.rows.some((r) => r.user_id === KOTU), 'görünüm');
});

console.log('\nset_username');
await test('uygunsuz / ayrılmış / temiz', async () => {
  const u = await newUser();
  for (const n of ['siktir', 'AmYalamak31', 'Orospu_34', 'n1gger', 'ali_amk', 'FuckYou']) {
    await expectErr(rpc(u, 'set_username', { p_username: n }), 'USERNAME_INAPPROPRIATE');
  }
  for (const n of ['admin', 'Admin_01', 'PsikoVaka', 'moderator', 'destek', 'Claude']) {
    await expectErr(rpc(u, 'set_username', { p_username: n }), 'USERNAME_RESERVED');
  }
  await expectErr(rpc(u, 'set_username', { p_username: 'a b' }), 'USERNAME_INVALID');
  for (const n of ['amca_ali', 'Kasimpasa', 'assistant', 'sikke34']) {
    const r = await rpc(u, 'set_username', { p_username: n });
    eq(r.username, n);
  }
  eq((await prof(u)).needs_rename, false);
});
await test('hata ayrıntısı Türkçe ve eşleşen sözcüğü söylemez', async () => {
  const u = await newUser();
  try { await rpc(u, 'set_username', { p_username: 'siktir' }); throw new Error('geçti'); }
  catch (e) { ok(!/sik/i.test(String(e.detail || '')), 'detail'); ok(/kullanılamıyor/.test(String(e.detail || 'kullanılamıyor'))); }
});
await test('yeniden adlandırma: kullanıcı adı uygunsuz -> yeni adla bayrak kalkar, sıralamada görünür', async () => {
  await expectErr(rpc(KOTU, 'set_username', { p_username: 'AmYalamak32' }), 'USERNAME_INAPPROPRIATE');
  eq((await prof(KOTU)).needs_rename, true);
  const r = await rpc(KOTU, 'set_username', { p_username: 'yeni_ad1' });
  eq([r.username, r.needs_rename, r.display_name], ['yeni_ad1', false, 'Kötü Ad']);
  ok((await q(NORMAL, `select user_id from public.leaderboard`)).rows.some((x) => x.user_id === KOTU), 'görünür');
  const b = await rpc(NORMAL, 'get_daily_leaderboard', { p_target: 'diagnosis' });
  ok(b.rows.some((x) => x.user_id === KOTU), 'günlükte görünür');
});
await test("yeniden adlandırma: yalnızca görünen ad kötü -> aynı kullanıcı adıyla onaylayınca görünen ad 'Klinisyen'", async () => {
  const r = await rpc(KOTU_GA, 'set_username', { p_username: 'temiz_ad' });
  eq([r.username, r.display_name, r.needs_rename], ['temiz_ad', 'Klinisyen', false]);
});
await test("yeniden adlandırma: ikisi de kötü -> yeni ad + 'Klinisyen'", async () => {
  const r = await rpc(IKISI, 'set_username', { p_username: 'iyi_oyuncu' });
  eq([r.display_name, r.needs_rename], ['Klinisyen', false]);
});
await test('işaretli değilken set_username görünen adı değiştirmez', async () => {
  const r = await rpc(AYRILMIS, 'set_username', { p_username: 'yeni_isim' });
  eq([r.display_name, r.needs_rename], ['Destek', false]);
});

console.log('\nGörünen ad tetikleyicisi');
await test('istemci uygunsuz görünen ad yazamaz: DISPLAY_NAME_INAPPROPRIATE', async () => {
  for (const n of ['Orospu', 's.i.k.t.i.r', 'AMK', 'Big Dick', 'Admin', 'PsikoVaka Destek']) {
    await expectErr(q(NORMAL, `update public.profiles set display_name = $1 where id = $2`, [n, NORMAL]), 'DISPLAY_NAME_INAPPROPRIATE');
  }
  for (const n of ['Dr. Ayşe Kaya', 'Ali Amca', 'Sıkı Dostlar', 'Klinisyen']) {
    const r = await q(NORMAL, `update public.profiles set display_name = $1 where id = $2 returning display_name`, [n, NORMAL]);
    eq(r.rows[0].display_name, n);
  }
});
await test('yönetici (panel) ayrılmış görünen ad verebilir; uygunsuz adı veremez', async () => {
  await admin(`update public.profiles set display_name = 'PsikoVaka' where id = $1`, [NORMAL2]);
  await expectErr(admin(`update public.profiles set display_name = 'Orospu' where id = $1`, [NORMAL2]), 'DISPLAY_NAME_INAPPROPRIATE');
  await expectErr(admin(`update public.profiles set username = 'siktir_' where id = $1`, [NORMAL2]), 'USERNAME_INAPPROPRIATE');
});
await test('avatar güncellemesi ve RP/maç sayacı güncellemesi etkilenmez (eski kötü görünen adla bile)', async () => {
  const u = await newUser('Temiz');
  await rpc(u, 'set_username', { p_username: 'legacy_user' });
  await admin(`alter table public.profiles disable trigger profiles_isim_denetle`);
  await admin(`update public.profiles set display_name = 'Orospu' where id = $1`, [u]);
  await admin(`alter table public.profiles enable trigger profiles_isim_denetle`);
  await admin(`update public.profiles set ranked_points = ranked_points + 10, matches_played = matches_played + 1 where id = $1`, [u]);
  const r = await q(u, `update public.profiles set avatar = '{"v":2}'::jsonb where id = $1 returning display_name`, [u]);
  eq(r.rows[0].display_name, 'Orospu');
  eq((await prof(u)).ranked_points, 10);
});
await test('işaretli kullanıcı yalnızca görünen adı kötüyse görünen adı düzeltince bayrak kalkar', async () => {
  const u = await newUser('Temiz');
  await rpc(u, 'set_username', { p_username: 'gec_kalan' });
  await admin(`update public.profiles set needs_rename = true where id = $1`, [u]);
  await q(u, `update public.profiles set display_name = 'Yeni Ad' where id = $1`, [u]);
  eq((await prof(u)).needs_rename, false);
});
await test("kayıt: uygunsuz full_name kaydı bozmaz, görünen ad 'Klinisyen'; varsayılan geçer", async () => {
  const u = await newUser('Siktir Git');
  eq((await prof(u)).display_name, 'Klinisyen');
  const v = await newUser();
  eq((await prof(v)).display_name, 'Klinisyen');
  const w = await newUser('Ayşe Yılmaz');
  eq((await prof(w)).display_name, 'Ayşe Yılmaz');
});

console.log('\nYetkiler');
await test('needs_rename istemciden yazılamaz; terim tabloları okunamaz; ayrıntı fonksiyonu kapalı', async () => {
  await expectErr(q(KOTU, `update public.profiles set needs_rename = false where id = $1`, [KOTU]), DENIED);
  for (const t of ['isim_filtresi_terimleri', 'isim_filtresi_harita', 'isim_filtresi_desenler', 'isim_filtresi_surum']) {
    await expectErr(q(NORMAL, `select * from public.${t}`), DENIED);
  }
  await expectErr(q(NORMAL, `select public.isim_kontrol_ayrinti('x')`), DENIED);
  await expectErr(q(NORMAL, `select public._isim_filtresi_tara()`), DENIED);
  eq((await q(NORMAL, `select public.isim_uygun_mu('siktir') a, public.isim_uygun_mu('Ayşe') b`)).rows[0], { a: false, b: true });
  await expectErr(q(null, `select public.isim_uygun_mu('x')`), DENIED);
});

console.log(`\nSonuç: ${passed} geçti, ${failed} kaldı`);
await db.close();
process.exit(failed ? 1 : 0);
