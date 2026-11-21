// Sınıf modu — GERÇEK js/account.js + js/online/* ile anonim oturum davranışı (ajan C2).
// supabase-js yerine sahte bir istemci yüklenir (ağ yok). Doğrulananlar: anonim giriş yalnızca katılma formunda ve bir kez;
// anonim kullanıcı için profil okunmaz, kullanıcı adı adımı açılmaz, durum 'guest', Online merkezi misafir, online kanalları
// (online:<uid>, pg-user-…) kurulmaz; yenilemede aynı anonim oturum; anonim giriş kapalıysa anlaşılır hata; gerçek girişte profil okunur.
//   BASE=http://localhost:8899/tools/online_dev/harness.html node tools/online_dev/tests/sinif_hesap.mjs
import { chromium } from 'playwright';
import { check, sleep } from './lib.mjs';
import fs from 'node:fs';
const SUPA = fs.readFileSync('/home/claude/rt/node_modules/@supabase/supabase-js/dist/umd/supabase.js');

const BASE = process.env.BASE || 'http://localhost:8899/tools/online_dev/harness.html';
const FAKE = `(() => {
  const LOG = window.__fakeLog = { rpc: [], from: [], channels: [], anonCalls: 0, pwCalls: 0 };
  const listeners = [];
  const load = () => { try { return JSON.parse(localStorage.getItem('fakeSession') || 'null'); } catch (e) { return null; } };
  const save = (s) => { if (s) localStorage.setItem('fakeSession', JSON.stringify(s)); else localStorage.removeItem('fakeSession'); };
  const fire = (ev, s) => listeners.forEach(fn => setTimeout(() => fn(ev, s), 0));
  const res = (data, error) => Promise.resolve({ data: data == null ? null : data, error: error || null });
  function q(table) {
    LOG.from.push(table);
    const b = { _single: false };
    ['select', 'eq', 'in', 'order', 'limit', 'ilike', 'not', 'gt', 'is', 'update', 'neq'].forEach(m => { b[m] = () => b; });
    b.maybeSingle = () => { b._single = true; return b; };
    b.single = b.maybeSingle;
    b.then = (ok, bad) => {
      const s = load();
      let data = b._single ? null : [];
      if (table === 'profiles' && s && !s.user.is_anonymous && b._single) data = { id: s.user.id, username: 'hoca_ali', display_name: 'Ali', avatar: {}, ranked_points: 100, matches_played: 0, matches_won: 0 };
      return Promise.resolve({ data, error: null }).then(ok, bad);
    };
    return b;
  }
  const client = {
    auth: {
      initialize: () => res({}),
      getSession: () => res({ session: load() }),
      onAuthStateChange: (fn) => { listeners.push(fn); return { data: { subscription: { unsubscribe() {} } } }; },
      signInAnonymously: async () => {
        LOG.anonCalls++;
        if (localStorage.getItem('fakeAnonOff') === '1') return { data: { session: null, user: null }, error: { message: 'Anonymous sign-ins are disabled', code: 'anonymous_provider_disabled', status: 422 } };
        const s = { access_token: 'x', user: { id: 'aaaaaaaa-0000-4000-8000-00000000a0a0', is_anonymous: true, email: '' } };
        save(s); fire('SIGNED_IN', s);
        return { data: { session: s, user: s.user }, error: null };
      },
      signInWithPassword: async ({ email }) => {
        LOG.pwCalls++;
        const s = { access_token: 'y', user: { id: 'bbbbbbbb-0000-4000-8000-00000000b0b0', is_anonymous: false, email } };
        save(s); fire('SIGNED_IN', s);
        return { data: { session: s, user: s.user }, error: null };
      },
      signOut: async () => { save(null); fire('SIGNED_OUT', null); return { error: null }; },
      signUp: async () => ({ data: {}, error: null }),
      resetPasswordForEmail: async () => ({ error: null }),
      updateUser: async () => ({ data: {}, error: null })
    },
    rpc: (fn, args) => {
      LOG.rpc.push(fn);
      const s = load();
      if (!s) return res(null, { message: 'permission denied for function ' + fn, code: '42501' });
      if (fn === 'sinif_ozet') return res(null, { message: 'SINIF_YOK', details: 'Oturum bulunamadı.' });
      if (fn === 'sinif_katil') return res({ ok: true, server_now: new Date().toISOString(), oturum_id: '11111111-1111-4111-8111-111111111111', katilimci_id: '22222222-2222-4222-8222-222222222222', takma_ad: args.p_takma_ad, yeniden: false, katildigi_tur: 1, durum: 'lobi', tur_no: 0 });
      if (fn === 'sinif_durum') return res({ ok: true, server_now: new Date().toISOString(), rol: 'katilimci', oturum: { id: args.p_oturum, kod: 'ABC234', durum: 'lobi', surum: 1, tur_no: 0, vaka_sayisi: 5, ayarlar: { vaka_sayisi: 5, ipucu_araligi_sn: 15, tahmin_hakki: 3, gec_katilim: true }, sunucu: {}, katilimci_sayisi: 1 }, tur: null,
        ben: { katilimci_id: '22222222-2222-4222-8222-222222222222', takma_ad: 'Ada', puan: 0, sira: 1, katildigi_tur: 1, aktif: true, tur: null, tahminlerim: [] }, katilimcilar: [{ katilimci_id: '22222222-2222-4222-8222-222222222222', takma_ad: 'Ada', puan: 0, sira: 1 }], tur_sonuclari: [], podyum: null });
      if (s.user.is_anonymous) return res(null, { message: 'ANON_IZINSIZ' });
      return res(null, { message: 'Could not find the function public.' + fn, code: 'PGRST202' });
    },
    from: (t) => q(t),
    channel: (name) => { LOG.channels.push(name); const ch = { on() { return ch; }, subscribe(cb) { setTimeout(() => cb && cb('SUBSCRIBED'), 0); return ch; }, track: () => Promise.resolve(), untrack: () => Promise.resolve(), send: () => Promise.resolve(), presenceState: () => ({}) }; return ch; },
    removeChannel: () => {}
  };
  const fake = { createClient: () => client };
  Object.defineProperty(window, 'supabase', { configurable: true, get: () => fake, set: () => {} });
})();`;

const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
async function mk() {
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: 'dark' });
  await c.route('**/*', (r) => {
    const u = r.request().url();
    // gerçek dosya (SRI tutsun), ama window.supabase sahte istemciye sabitlenir (addInitScript)
    if (u.includes('cdn.jsdelivr.net/npm/@supabase/supabase-js')) return r.fulfill({ status: 200, contentType: 'application/javascript', body: SUPA, headers: { 'access-control-allow-origin': '*' } });
    if (/fonts\.(googleapis|gstatic)/.test(u)) return r.abort();
    return r.continue();
  });
  await c.addInitScript(FAKE);
  const p = await c.newPage();
  p._errors = [];
  p.on('pageerror', e => p._errors.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::/.test(m.text())) p._errors.push(m.text()); });
  return { c, p };
}
const ready = (p) => p.waitForFunction(() => window.PsikoVakaAccount && window.PsikoVakaAccount.availability === 'ready' && window.PsikoVakaOnline && window.PsikoVakaOnline.sinif, null, { timeout: 15000 });
const log = (p) => p.evaluate(() => window.__fakeLog);

// 1) misafir: hiçbir akış anonim giriş yapmaz
const { c, p } = await mk();
for (const h of ['#/oyna', '#/online', '#/profil', '#/kutuphane']) { await p.goto(BASE + h); await ready(p); await sleep(600); }
let L = await log(p);
check(L.anonCalls === 0, 'misafir gezinme: signInAnonymously çağrılmadı');
await p.goto(BASE + '#/online'); await ready(p); await sleep(800);
check(await p.evaluate(() => { const s = document.getElementById('olSinifSlot'); return !!s && !s.hidden; }), 'misafir Online merkezinde katılma kartı (özellik algılandı: sinif_ozet ≠ PGRST202)');

// 2) katılma formu: anonim giriş bir kez, profil okunmaz, kullanıcı adı adımı yok
await p.evaluate(() => { location.hash = '#/katil/ABC234'; });
await p.waitForSelector('[data-sn-join]', { timeout: 10000 });
await p.fill('#snName', 'Ada');
const fromBefore = (await log(p)).from.filter(t => t === 'profiles').length;
await p.click('.sinif-join-btn');
await p.waitForSelector('.st-head', { timeout: 10000 });
await sleep(800);
L = await log(p);
check(L.anonCalls === 1, 'katılırken tek anonim giriş');
check(L.from.filter(t => t === 'profiles').length === fromBefore, 'anonim kullanıcı için profiles sorgusu YOK');
const st = await p.evaluate(() => ({ s: window.PsikoVakaAccount.state, snap: window.PsikoVakaAccount.snapshot(), modal: document.getElementById('usernameModal').classList.contains('open'), hub: document.getElementById('onlineHubMount').dataset.state }));
check(st.s === 'guest' && st.snap.anonymous === true && st.snap.user === null, 'anonim: durum guest, snapshot.anonymous, user null');
check(!st.modal, 'kullanıcı adı penceresi açılmadı');
check(!L.channels.some(n => /^online:|^pg-user-/.test(n)), 'anonimde online:/pg-user- kanalları kurulmadı ' + JSON.stringify(L.channels));
check(L.channels.some(n => /^pg-sinif-/.test(n)), 'yalnızca sınıf kanalı (pg-sinif-<oturum>)');
check(!L.rpc.some(fn => !/^sinif_|^get_daily_challenge$/.test(fn)), 'anonimken sınıf dışı RPC çağrılmadı ' + JSON.stringify([...new Set(L.rpc)]));
await p.click('[data-sn="leave"]'); await p.click('.ol-sheet [data-ol-action="yes"]').catch(() => {});
await sleep(400);
await p.evaluate(() => { location.hash = '#/online'; }); await sleep(800);
check(await p.evaluate(() => document.getElementById('onlineHubMount').dataset.state) === 'guest', 'Online merkezi anonime misafir görünümü');
await p.evaluate(() => { location.hash = '#/profil'; }); await sleep(500);
check(await p.evaluate(() => window.game.accountSnap.state === 'guest'), 'Profil: misafir (giriş seçenekleri normal)');

// 3) yenileme: aynı anonim oturum, yine misafir, profil yok
await p.reload(); await ready(p); await sleep(1000);
L = await log(p);
check(L.anonCalls === 0 && L.from.filter(t => t === 'profiles').length === 0 && await p.evaluate(() => window.PsikoVakaAccount.snapshot().anonymous), 'yenileme: kalıcı anonim oturum, profil okunmadı, yeni anonim giriş yok');

// 4) gerçek giriş anonim oturumun yerine geçer: profil okunur, hazır
await p.evaluate(() => window.PsikoVakaAccount.signIn('ali@ornek.test', 'gizli-sifre-123', { remember: true }));
await p.waitForFunction(() => window.PsikoVakaAccount.state === 'ready', null, { timeout: 8000 }).catch(() => {});
L = await log(p);
check(await p.evaluate(() => window.PsikoVakaAccount.state === 'ready' && !window.PsikoVakaAccount.snapshot().anonymous) && L.from.includes('profiles'), 'gerçek giriş: profil okundu, durum ready');
check(!p._errors.length, 'konsol temiz ' + JSON.stringify(p._errors.slice(0, 3)));
await c.close();

// 5) sunucuda anonim giriş kapalı
{
  const { c: c2, p: p2 } = await mk();
  await p2.addInitScript(() => localStorage.setItem('fakeAnonOff', '1'));
  await p2.goto(BASE + '#/katil/ABC234'); await ready(p2);
  await p2.waitForSelector('[data-sn-join]', { timeout: 10000 });
  await p2.fill('#snName', 'Ada'); await p2.click('.sinif-join-btn'); await sleep(800);
  check(/kapalı/.test(await p2.locator('#snCodeErr').innerText()), 'anonim giriş kapalıysa anlaşılır hata');
  check(await p2.evaluate(() => window.PsikoVakaAccount.state === 'guest' && !window.PsikoVakaAccount.snapshot().anonymous), 'kapalıyken misafir kalır');
  await c2.close();
}
console.log(`SONUÇ ${check.oks || 0} ok, ${check.fails || 0} fail`);
await b.close();
process.exit(check.fails ? 1 : 0);
