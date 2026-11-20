// PsikoVaka — isim filtresi istemci testi (Playwright, sahte Supabase istemcisi; ağ yok)
//   python3 -m http.server 8899   (depo kökünde)   sonra   node tools/isim_filtresi/test/istemci.mjs
// Gerçek js/account.js + js/app.js çalışır; yalnızca window.supabase.createClient sahtedir.
// Denenen: kullanıcı adı adımında anında uyarı ve gönderim engeli, profil düzenlemede görünen ad,
// sunucu hata kodlarının Türkçe karşılığı, needs_rename ile zorunlu yeniden adlandırma (açıklama satırı,
// kapatılamaz, uygunsuz ön dolgunun temizlenmesi, yeni adla çıkış), 0005 öncesi sunucu (sütun yok).
import { chromium } from 'playwright';
const URL = process.env.URL || 'http://localhost:8899/index.html#/profil';
const EXE = process.env.CHROME || '/usr/bin/google-chrome';
let oks = 0, fails = 0;
const check = (c, m) => { if (c) { oks++; console.log('  ok  ', m); } else { fails++; console.log('  FAIL', m); } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Sahte supabase-js: zincirlenebilir sorgu + set_username RPC + filtre (sunucu gibi davranır)
function fakeSupabase(cfg) {
    const S = { profile: Object.assign({ id: 'u1', username: null, display_name: 'Klinisyen', avatar: {}, ranked_points: 0, matches_played: 0, matches_won: 0, needs_rename: false }, cfg.profile || {}), calls: [] };
    window.__fake = S;
    const F = () => window.PsikoVakaIsimFiltresi;
    const user = { id: 'u1', email: 'u1@test.local' };
    const session = { user, access_token: 'x' };
    function pick(cols) {
        const out = {};
        for (const c of cols.split(',')) out[c] = S.profile[c];
        return out;
    }
    function builder(table) {
        const st = { table, op: 'select', cols: '*', patch: null };
        const res = () => {
            S.calls.push(st.op + ':' + table + ':' + st.cols);
            if (table !== 'profiles') return { data: [], error: null };
            if (cfg.pre0005 && /needs_rename/.test(st.cols)) return { data: null, error: { code: '42703', message: 'column profiles.needs_rename does not exist' } };
            if (st.op === 'update') {
                if (st.patch.display_name !== undefined) {
                    const r = F().check(st.patch.display_name);
                    if (!r.ok) return { data: null, error: { code: 'P0001', message: 'DISPLAY_NAME_INAPPROPRIATE', details: 'Bu ad kullanılamıyor.' } };
                }
                Object.assign(S.profile, st.patch);
            }
            const cols = st.cols === '*' ? Object.keys(S.profile).join(',') : st.cols;
            return { data: pick(cols), error: null };
        };
        const p = new Proxy({}, {
            get(_, k) {
                if (k === 'then') return (a, b) => Promise.resolve(res()).then(a, b);
                if (k === 'select') return (c) => { if (c) st.cols = c; return p; };
                if (k === 'update') return (patch) => { st.op = 'update'; st.patch = patch; return p; };
                return () => p;
            }
        });
        return p;
    }
    return {
        auth: {
            initialize: async () => ({ error: null }),
            getSession: async () => ({ data: { session } }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
            signOut: async () => ({ error: null })
        },
        from: (t) => builder(t),
        rpc: async (fn, args) => {
            S.calls.push('rpc:' + fn);
            if (fn !== 'set_username') return { data: null, error: { code: 'PGRST202', message: 'not found' } };
            const r = F().check(args.p_username);
            if (cfg.serverAlwaysReject) return { data: null, error: { code: 'P0001', message: cfg.serverAlwaysReject } };
            if (!r.ok) return { data: null, error: { code: 'P0001', message: r.reason === 'ayrilmis' ? 'USERNAME_RESERVED' : 'USERNAME_INAPPROPRIATE' } };
            S.profile.username = args.p_username;
            if (S.profile.needs_rename && !F().check(S.profile.display_name).ok) S.profile.display_name = 'Klinisyen';
            S.profile.needs_rename = false;
            return { data: Object.assign({}, S.profile), error: null };
        },
        channel: () => ({ on() { return this; }, subscribe() { return this; }, track() {}, send() {}, presenceState: () => ({}), unsubscribe() {} }),
        removeChannel: () => {}, removeAllChannels: () => {}
    };
}

const b = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
async function open(cfg, local) {
    const c = await b.newContext({ viewport: { width: 390, height: 844 } });
    await c.route('**/*', (r) => (/^http:\/\/localhost/.test(r.request().url()) ? r.continue() : r.abort()));
    await c.addInitScript(([src, cf, loc]) => {
        // eslint-disable-next-line no-new-func
        const make = new Function('cfg', 'return (' + src + ')(cfg)');
        window.supabase = { createClient: () => make(cf) };
        try { for (const [k, v] of Object.entries(loc || {})) localStorage.setItem(k, v); } catch (e) {}
    }, [fakeSupabase.toString(), cfg, local || {}]);
    const p = await c.newPage();
    p._errors = [];
    p.on('pageerror', (e) => p._errors.push(e.message));
    p.on('console', (m) => { if (m.type() === 'error' && !/net::|Failed to load resource/.test(m.text())) p._errors.push(m.text()); });
    await p.goto(URL);
    await p.waitForFunction(() => window.PsikoVakaAccount && window.PsikoVakaAccount.availability === 'ready' && window.PsikoVakaAccount.state !== 'guest', null, { timeout: 15000 });
    await sleep(300);
    return { c, p };
}
const vis = (p, id) => p.evaluate((i) => { const e = document.getElementById(i); return !!(e && !e.hidden && e.offsetParent !== null && getComputedStyle(e).display !== 'none'); }, id);
const txt = (p, id) => p.evaluate((i) => (document.getElementById(i) || {}).textContent || '', id);
const modalOpen = (p) => p.evaluate(() => { const m = document.getElementById('usernameModal'); return !!(m && (m.classList.contains('is-open') || m.classList.contains('open') || m.getAttribute('aria-hidden') === 'false' || (!m.hidden && getComputedStyle(m).display !== 'none' && getComputedStyle(m).visibility !== 'hidden' && getComputedStyle(m).opacity !== '0'))); });

console.log('\n1) Yeni hesap: kullanıcı adı adımı');
{
    const { c, p } = await open({});
    check(await p.evaluate(() => window.PsikoVakaAccount.state) === 'signed_in_no_username', 'durum signed_in_no_username');
    check(await modalOpen(p), 'kullanıcı adı penceresi açık');
    check(await p.evaluate(() => typeof (window.PsikoVakaIsimFiltresi && window.PsikoVakaIsimFiltresi.check) === 'function'), 'PsikoVakaIsimFiltresi yüklü');
    check(await p.evaluate(() => Object.keys(window.PsikoVakaIsimFiltresi).sort().join(',')) === 'check,surum', 'tarayıcıda yalnızca check/surum');
    await p.fill('#usernameInput', '');
    await p.type('#usernameInput', 'AmYalamak31');
    await sleep(100);
    check(await vis(p, 'usernameError'), 'yazarken uyarı görünür');
    const t = await txt(p, 'usernameError');
    check(t === 'Bu ad kullanılamıyor. Lütfen başka bir ad seç.', 'uyarı metni nötr ve sözcüğü tekrar etmiyor');
    await p.click('#usernameSubmit');
    await sleep(200);
    check(!(await p.evaluate(() => window.__fake.calls.includes('rpc:set_username'))), 'uygunsuz adla sunucuya istek gitmez');
    await p.fill('#usernameInput', 'Admin_01');
    await p.click('#usernameSubmit');
    await sleep(200);
    check((await txt(p, 'usernameError')) === 'Bu ad ayrılmış. Lütfen başka bir ad seç.', 'ayrılmış ad metni');
    await p.fill('#usernameInput', 'amca_ali');
    await sleep(100);
    check(!(await vis(p, 'usernameError')), 'temiz adda uyarı yok');
    await p.click('#usernameSubmit');
    await p.waitForFunction(() => window.PsikoVakaAccount.state === 'ready', null, { timeout: 5000 });
    check(true, 'temiz adla hazır');
    check(!(await vis(p, 'usernameRenameNote')), 'yeni hesapta yeniden adlandırma açıklaması yok');
    check(!p._errors.length, 'konsol hatası yok ' + JSON.stringify(p._errors.slice(0, 3)));
    await c.close();
}

console.log('\n2) Sunucu hata kodları (istemci filtresi atlanırsa)');
{
    const { c, p } = await open({ serverAlwaysReject: 'USERNAME_INAPPROPRIATE' });
    const r = await p.evaluate(async () => window.PsikoVakaAccount.setUsername('temiz_ad'));
    check(!r.ok && r.error.code === 'USERNAME_INAPPROPRIATE' && r.error.message === 'Bu ad kullanılamıyor. Lütfen başka bir ad seç.', 'USERNAME_INAPPROPRIATE eşlendi');
    const d = await p.evaluate(() => [window.PsikoVakaAccount.describeError({ message: 'USERNAME_RESERVED' }), window.PsikoVakaAccount.describeError({ message: 'DISPLAY_NAME_INAPPROPRIATE' })]);
    check(d[0].code === 'USERNAME_RESERVED' && /ayrılmış/.test(d[0].message), 'USERNAME_RESERVED eşlendi');
    check(d[1].code === 'DISPLAY_NAME_INAPPROPRIATE' && d[1].message === 'Bu ad kullanılamıyor. Lütfen başka bir ad seç.', 'DISPLAY_NAME_INAPPROPRIATE eşlendi');
    await c.close();
}

console.log('\n3) Profil düzenleme: görünen ad');
{
    const { c, p } = await open({ profile: { username: 'ayse_kaya', display_name: 'Ayşe' } });
    check(await p.evaluate(() => window.PsikoVakaAccount.state) === 'ready', 'hazır');
    await p.evaluate(() => { window.location.hash = '#/profil'; });
    await sleep(300);
    await p.evaluate(() => document.getElementById('btnEditProfile') && document.getElementById('btnEditProfile').click());
    await sleep(300);
    await p.fill('#editDisplayName', '');
    await p.type('#editDisplayName', 'Orospu Çocuğu');
    await sleep(100);
    check(await vis(p, 'editProfileError') && (await txt(p, 'editProfileError')) === 'Bu ad kullanılamıyor. Lütfen başka bir ad seç.', 'yazarken uyarı');
    await p.click('#editProfileSave');
    await sleep(200);
    check(!(await p.evaluate(() => window.__fake.calls.some((x) => x.startsWith('update:profiles')))), 'uygunsuz görünen ad gönderilmez');
    const r = await p.evaluate(async () => window.PsikoVakaAccount.saveProfile({ displayName: 's.i.k.t.i.r' }));
    check(!r.ok && r.error.message === 'Bu ad kullanılamıyor. Lütfen başka bir ad seç.', 'saveProfile istemcide reddeder');
    await p.fill('#editDisplayName', 'Dr. Ayşe Kaya');
    await sleep(100);
    check(!(await vis(p, 'editProfileError')), 'temiz adda uyarı yok');
    await p.click('#editProfileSave');
    await sleep(300);
    check(await p.evaluate(() => window.__fake.profile.display_name) === 'Dr. Ayşe Kaya', 'temiz görünen ad kaydedildi');
    check(!p._errors.length, 'konsol hatası yok ' + JSON.stringify(p._errors.slice(0, 3)));
    await c.close();
}

console.log('\n4) Zorunlu yeniden adlandırma (needs_rename)');
{
    const { c, p } = await open({ profile: { username: 'AmYalamak31', display_name: 'Orospu', needs_rename: true } },
        { psikovaka_nickname: 'Orospu' });
    const snap = await p.evaluate(() => window.PsikoVakaAccount.snapshot());
    check(snap.state === 'signed_in_no_username' && snap.renameRequired === true, 'durum signed_in_no_username + renameRequired');
    await sleep(200);
    check(await modalOpen(p), 'kullanıcı adı penceresi açık');
    check(await vis(p, 'usernameRenameNote') && (await txt(p, 'usernameRenameNote')) === 'Kullanıcı adın topluluk kurallarına uymadığı için değiştirmen gerekiyor.', 'tek satırlık açıklama');
    check(await p.evaluate(() => document.getElementById('usernameInput').value) === '', 'uygunsuz ön dolgu temizlendi');
    check(await p.evaluate(() => document.getElementById('usernameModal').dataset.locked === 'true' && !document.querySelector('#usernameModal .btn-close-modal')), 'pencere kapatılamaz (kapat düğmesi yok, kilitli)');
    await p.keyboard.press('Escape');
    await sleep(200);
    check(await modalOpen(p), 'Escape kapatmaz');
    check(!(await p.evaluate(() => window.__fake.calls.some((x) => x.startsWith('update:profiles')))), 'işaretliyken yerel takma ad sunucuya itilmez');
    await p.fill('#usernameInput', 'AmYalamak32');
    await p.click('#usernameSubmit');
    await sleep(200);
    check(await p.evaluate(() => window.PsikoVakaAccount.state) === 'signed_in_no_username', 'uygunsuz yeni adla çıkılmaz');
    await p.fill('#usernameInput', 'yeni_ad');
    await p.click('#usernameSubmit');
    await p.waitForFunction(() => window.PsikoVakaAccount.state === 'ready', null, { timeout: 5000 });
    const s2 = await p.evaluate(() => window.PsikoVakaAccount.snapshot());
    check(s2.renameRequired === false && s2.profile.username === 'yeni_ad' && s2.profile.display_name === 'Klinisyen', 'yeni adla hazır; görünen ad Klinisyen');
    await sleep(200);
    check(!(await modalOpen(p)), 'pencere kapandı');
    check(!(await vis(p, 'usernameRenameNote')), 'açıklama gizlendi');
    check(!p._errors.length, 'konsol hatası yok ' + JSON.stringify(p._errors.slice(0, 3)));
    await c.close();
}

console.log('\n5) 0005 öncesi sunucu (needs_rename sütunu yok)');
{
    const { c, p } = await open({ pre0005: true, profile: { username: 'ayse_kaya', display_name: 'Ayşe' } });
    check(await p.evaluate(() => window.PsikoVakaAccount.state) === 'ready', 'sütun yokken de hazır');
    const calls = await p.evaluate(() => window.__fake.calls.filter((x) => x.includes('profiles')));
    check(calls.length >= 2 && /needs_rename/.test(calls[0]) && !/needs_rename/.test(calls[1]), 'bir kez sütunlu, sonra sütunsuz');
    const r = await p.evaluate(async () => window.PsikoVakaAccount.saveProfile({ displayName: 'Ayşe K' }));
    check(r.ok, 'kaydetme çalışır');
    const n = await p.evaluate(() => window.__fake.calls.filter((x) => /needs_rename/.test(x)).length);
    check(n === 1, 'sütun bir daha istenmez');
    check(!p._errors.length, 'konsol hatası yok ' + JSON.stringify(p._errors.slice(0, 3)));
    await c.close();
}

console.log(`\nSONUÇ ${oks} ok, ${fails} fail`);
await b.close();
process.exit(fails ? 1 : 0);
