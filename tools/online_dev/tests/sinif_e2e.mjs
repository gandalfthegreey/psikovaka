// Sınıf (projeksiyon) modu uçtan uca (ajan C2): Node'da TEK sahte sunucu (sinif_mock.js), bir projeksiyon bağlamı
// (1920×1080, oturum sahibi) ve birkaç telefon bağlamı (390×844, misafir → anonim). Sahte saat: sunucu saati +37 sn kayık
// ve test ilerletir (skew); istemciler saat farkını server_now'dan hesaplar.
//   BASE=http://localhost:8899/tools/online_dev/harness.html OUT=/tmp/sinif node tools/online_dev/tests/sinif_e2e.mjs
import { browser, ctx, page, check, sleep } from './lib.mjs';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const require = createRequire(import.meta.url);
const reqRt = createRequire('/home/claude/rt/');
const BASE = process.env.BASE || 'http://localhost:8899/tools/online_dev/harness.html';
const URL = BASE + '?mock=1';
const OUT = process.env.OUT || '/tmp/sinif';
fs.mkdirSync(OUT, { recursive: true });

// ---------------------------------------------------------------- veri + sahte sunucu
const vctx = {}; vm.createContext(vctx);
for (const f of ['diagnoses', 'cases']) vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', f + '.js'), 'utf8').replace(/^const /mg, 'var '), vctx);
const CASES = vctx.CLINICAL_CASES, DX = vctx.DIAGNOSES_DATABASE;
const dxName = (id) => (DX.find(d => d.id === id) || {}).nameTr;
const FILTRE = require(path.join(ROOT, 'js', 'isim_filtresi.js'));
const SM = require(path.join(ROOT, 'tools', 'online_dev', 'sinif_mock.js'));
const SERVER_OFFSET = 37000;
let skew = 0;
const E = SM.create({ cases: CASES, diagnoses: DX, isimUygun: (n) => FILTRE.check(n).ok, now: () => Date.now() + SERVER_OFFSET + skew, kod: 'K7Q2MX', seed: 7 });
const subs = [];
E.on(ev => subs.forEach(s => {
  if ((ev.new.oturum_id || ev.new.id) !== s.oturum) return;
  if (!s.host && ev.table !== 'sinif_oturumlari') return;
  if (!E.canSee(s.uid, ev)) return;
  s.page.evaluate(e => window.__sinifPush && window.__sinifPush(e), ev).catch(() => {});
}));
async function wire(c) {
  await c.exposeBinding('__sinifRpc', (src, id, fn, args) => {
    if (id) E.users[id.uid] = { username: id.username || null, display_name: id.display_name || null, avatar: id.avatar || {}, anonymous: !!id.anonymous };
    return E.call(id && id.uid, fn, args);
  });
  await c.exposeBinding('__sinifSelect', (src, id, table, q) => {
    if (table === 'profiles') return { data: (q.ids || []).filter(x => E.users[x] && !E.users[x].anonymous).map(x => ({ id: x, avatar: E.users[x].avatar })), error: null };
    return { data: E.select(id.uid, table, q).data, error: null };
  });
  await c.exposeBinding('__sinifSub', (src, uid, oturum, host) => {
    for (let i = subs.length - 1; i >= 0; i--) if (subs[i].page === src.page && subs[i].oturum === oturum) subs.splice(i, 1);
    subs.push({ page: src.page, uid, oturum, host });
  });
  await c.exposeBinding('__sinifUnsub', (src, uid, oturum) => {
    for (let i = subs.length - 1; i >= 0; i--) if (subs[i].page === src.page && subs[i].oturum === oturum) subs.splice(i, 1);
  });
}

const b = await browser();
const pages = [];
async function mk(label, o) {
  const c = await ctx(b, { viewport: o.vp, mobile: !!o.mobile, theme: o.theme || 'dark', reduced: !!o.reduced });
  await wire(c);
  await c.addInitScript((opt) => {
    try {
      sessionStorage.setItem('olMockPersist', '1');
      if (!sessionStorage.getItem('olMockState')) sessionStorage.setItem('olMockState', JSON.stringify({ state: null, opt, daily: {} }));
      localStorage.setItem('psikovaka_tutorial_seen', '1');
    } catch (e) { /* yok */ }
  }, o.mockOpt || {});
  const p = await page(c, label);
  p._ctx = c;
  pages.push(p);
  return p;
}
const proj = (label, o = {}) => mk(label, Object.assign({ vp: { width: 1920, height: 1080 } }, o));
const phone = (label, o = {}) => mk(label, Object.assign({ vp: { width: 390, height: 844 }, mobile: true, mockOpt: { guest: true } }, o));
const shot = (p, name) => p.screenshot({ path: `${OUT}/${name}.png` });
const txt = (p, sel) => p.locator(sel).first().evaluate(el => el.textContent.replace(/\s+/g, ' ').trim()).catch(() => '');
async function waitText(p, sel, re, timeout = 8000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) { const t = await txt(p, sel); if (re.test(t)) return true; await sleep(150); }
  return false;
}
/** Sunucu saatini ilerlet ve sayfaları yeniden örneklet (sıçrama > 2 sn hemen kabul edilir). */
async function advance(ms) {
  skew += ms;
  for (const p of pages) if (!p.isClosed()) await p.evaluate(() => { const S = window.PsikoVakaOnline && window.PsikoVakaOnline.sinif; if (S && S.state.id) return window.PsikoVakaOnline.sinifApi.ozet(S.state.id); }).catch(() => {});
  await sleep(450);
}
async function noOverflow(p, label) {
  const r = await p.evaluate(() => {
    const L = document.getElementById('sinifLayer');
    const W = window.innerWidth, H = window.innerHeight;
    const off = [];
    L.querySelectorAll('*').forEach(el => { const b = el.getBoundingClientRect(); if (b.width && b.right > W + 1 && !el.closest('svg')) off.push(el.className && el.className.baseVal === undefined ? String(el.className).split(' ')[0] : el.tagName); });
    const main = L.querySelector('.sp-main');
    return { off: off.slice(0, 5), sw: L.scrollWidth, W, mainOver: main ? main.scrollHeight - main.clientHeight : 0, inl: Array.from(L.querySelectorAll('[style]')).filter(e => !e.closest('svg') && (e.getAttribute('style') || '').trim()).map(e => e.tagName + '.' + e.className + ' ' + e.getAttribute('style')),
      emoji: /\p{Extended_Pictographic}/u.test(L.innerText) };
  });
  check(!r.off.length && r.sw <= r.W, `${label}: yatay taşma yok ${JSON.stringify(r.off)}`);
  if (r.mainOver !== 0) check(r.mainOver <= 2, `${label}: projeksiyon içeriği ekrana sığıyor (fazla ${r.mainOver}px)`);
  check(r.inl.length === 0, `${label}: satır içi stil yok ${JSON.stringify(r.inl.slice(0, 3))}`);
  check(!r.emoji, `${label}: emoji yok`);
}
async function taps(p, label) {
  const small = await p.evaluate(() => Array.from(document.querySelectorAll('#sinifLayer button, #sinifLayer a, #sinifLayer input:not([type=radio]):not([type=checkbox]), #sinifLayer [role=option]'))
    .filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height && getComputedStyle(e).visibility !== 'hidden' && (r.height < 43.5 || r.width < 43.5); })
    .map(e => (e.getAttribute('aria-label') || e.textContent || e.className).trim().slice(0, 24) + ':' + Math.round(e.getBoundingClientRect().height)));
  check(!small.length, `${label}: dokunma hedefleri ≥44 px ${JSON.stringify(small.slice(0, 4))}`);
}
async function joinUI(p, kod, ad) {
  await p.goto(URL + '#/katil/' + kod);
  await p.waitForSelector('[data-sn-join]', { timeout: 15000 });
  await p.fill('#snName', ad);
  await p.click('.sinif-join-btn');
}
async function guessUI(p, id) {
  const name = dxName(id);
  await p.fill('#snGuess', name);
  const pick = p.locator(`[data-sn-pick="${id}"]`);
  if (await pick.count()) await pick.first().click(); else await p.press('#snGuess', 'Enter');
  await sleep(350);
}
const ses = () => E.ic(SID);
const answer = (n) => ses().vakalar[(n || ses().tur_no) - 1].diagnosisId;
function sameGroup(id) { const c = (DX.find(d => d.id === id) || {}).category; return (DX.find(d => d.category === c && d.id !== id) || {}).id; }
function otherGroup(id) { const c = (DX.find(d => d.id === id) || {}).category; return DX.find(d => d.category !== c).id; }

// ================================================================ 1. özellik yokken giriş noktaları gizli
{
  const p = await proj('yok-host', { mockOpt: { sinif: 'unsupported' } });
  await p.goto(URL + '#/online');
  await p.waitForFunction(() => document.getElementById('onlineHubMount') && document.getElementById('onlineHubMount').dataset.state === 'ready', null, { timeout: 15000 });
  await sleep(800);
  check(await p.evaluate(() => { const s = document.getElementById('olSinifSlot'); return !!s && s.hidden && !s.innerHTML; }), 'özellik yok: üye merkezinde Sınıf kartı gizli');
  await p.evaluate(() => { location.hash = '#/katil/ABC234'; });
  check(await waitText(p, '#sinifLayer', /şu an kullanılamıyor/), 'özellik yok: #/katil "kullanılamıyor" der');
  check(await p.evaluate(() => window.olMock.anonCalls) === 0, 'özellik yok: anonim giriş yapılmadı');
  const g = await phone('yok-misafir', { mockOpt: { guest: true, sinif: 'unsupported' } });
  await g.goto(URL + '#/online'); await sleep(1500);
  check(await g.evaluate(() => { const s = document.getElementById('olSinifSlot'); return !s || s.hidden; }), 'özellik yok: misafir merkezinde katılma kartı gizli');
  check(!p._errors.length && !g._errors.length, 'özellik yok: konsol temiz ' + JSON.stringify(p._errors.concat(g._errors).slice(0, 2)));
  await p._ctx.close(); await g._ctx.close(); pages.length = 0;
}

// ================================================================ 2. var olan akışlar anonim giriş tetiklemez
{
  const g = await phone('misafir-akis');
  for (const h of ['#/oyna', '#/online', '#/profil', '#/kutuphane', '#/gunluk']) { await g.goto(URL + h); await sleep(700); }
  await g.evaluate(() => { const b = document.getElementById('btnStartDaily'); if (b) b.click(); }); await sleep(600);
  check(await g.evaluate(() => window.olMock.anonCalls) === 0, 'misafir gezinme (ana sayfa, online, profil, kütüphane, günlük): anonim giriş YOK');
  check(await g.evaluate(() => { const s = document.getElementById('olSinifSlot'); return !!s && !s.hidden && /Sınıf oyununa katıl/.test(s.innerText); }), 'misafir Online merkezinde "Sınıf oyununa katıl" var');
  await g._ctx.close(); pages.length = 0;
}

// ================================================================ 3. oturum kurma (projeksiyon)
const P = await proj('projeksiyon');
await P.goto(URL + '#/online');
await P.waitForSelector('#olSinifSlot:not([hidden]) [data-sn-hub="setup"]', { timeout: 15000 });
check(/Sınıf modu/.test(await txt(P, '#olSinifSlot')), 'üye merkezinde "Sınıf modu" kartı');
await P.click('[data-sn-hub="setup"]');
await P.waitForSelector('.sinif-setup');
check(/İpucu aralığı: 15 sn/.test(await txt(P, '.sinif-setup')), 'kurulum: varsayılan ipucu aralığı 15 sn');
check(await P.locator('.sinif-setup input[name="tahmin_hakki"][value="3"]').isChecked(), 'kurulum: varsayılan tahmin hakkı 3');
await P.click('.ol-chip:has(input[name="vaka_sayisi"][value="3"])');
await P.selectOption('select[name="kurs"]', 'FORENSIC'); await sleep(150);
check(/Uygun vaka: \d+/.test(await txt(P, '[data-sn-count]')), 'kurulum: süzgece uyan vaka sayısı görünür');
await P.selectOption('select[name="kurs"]', ''); await sleep(150);
await P.click('[data-ol-action="start"]');
await P.waitForSelector('.sp-code', { timeout: 10000 });
const SID = await P.evaluate(() => window.PsikoVakaOnline.sinif.state.id);
check(/^#\/sinif\//.test(await P.evaluate(() => location.hash)) && ses().ayarlar.vaka_sayisi === 3, 'oturum kuruldu, projeksiyon #/sinif/<id>');
const KOD = ses().kod;
check((await txt(P, '.sp-code')) === KOD, 'lobi: kod büyük yazılı ' + KOD);
// QR kodu çözülür
{
  const PNG = reqRt('pngjs').PNG, jsQR = reqRt('jsqr');
  const buf = await P.locator('.sp-qr-svg').screenshot();
  const img = PNG.sync.read(buf);
  const qr = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
  const want = await P.evaluate((k) => `${location.origin}${location.pathname}#/katil/${k}`, KOD);
  check(qr && qr.data === want, `lobi QR kodu katılım bağlantısını taşıyor (${qr && qr.data})`);
}
const fs0 = await P.evaluate(() => parseFloat(getComputedStyle(document.getElementById('sinifLayer')).fontSize));
check(fs0 >= 28, `projeksiyon temel yazı ≥ 28 px (1920×1080: ${fs0})`);

// ================================================================ 4. katılım
const A = await phone('ada');
await A.goto(URL + '#/katil/' + KOD);
await A.waitForSelector('[data-sn-join]');
check((await A.inputValue('#snCode')) === KOD, 'telefon: #/katil/KOD kodu doldurur');
await shot(A, 'tel_katil');
await taps(A, 'telefon katılma formu');
// isim filtresi (istemci): sunucuya gitmeden uyarı
const kotu = fs.readFileSync(path.join(ROOT, 'tools/isim_filtresi/test/engellenmeli.txt'), 'utf8').split('\n').map(s => s.trim()).find(s => s && !s.startsWith('#') && !s.startsWith('k:') && !s.startsWith('=') && s.length >= 3 && s.length <= 14);
await A.fill('#snName', kotu);
await A.click('.sinif-join-btn'); await sleep(300);
check(/kullanılamıyor/.test(await txt(A, '#snNameErr')) && !(await A.evaluate(() => (window.olMock.sinifCalls || {}).sinif_katil)), 'isim filtresi: uygunsuz takma ad istemcide engellendi');
check(await A.evaluate(() => window.olMock.anonCalls) === 0, 'geçersiz formda anonim giriş yapılmadı');
await A.fill('#snName', 'A'); await A.click('.sinif-join-btn'); await sleep(200);
check(/2–16/.test(await txt(A, '#snNameErr')), 'tek harfli takma ad reddedildi');
await A.fill('#snName', 'Ada'); await A.click('.sinif-join-btn');
await A.waitForSelector('.st-head', { timeout: 10000 });
check(await waitText(A, '.st-main', /Ekrana bak/), 'Ada katıldı: "Ekrana bak"');
check(await A.evaluate(() => window.olMock.anonCalls === 1 && window.PsikoVakaAccount.snapshot().anonymous === true && window.PsikoVakaAccount.state === 'guest'), 'katılırken BİR kez anonim giriş; uygulama için misafir');
check(await waitText(P, '.sp-people', /1\s*kişi katıldı/) && /Ada/.test(await txt(P, '.sp-tiles')), 'projeksiyon: Ada listede (Realtime)');

const Bb = await phone('berk');
await joinUI(Bb, KOD, 'ada');
check(await waitText(Bb, '#snNameErr', /alınmış/), 'aynı takma ad (büyük/küçük harf duyarsız) reddedildi');
await Bb.fill('#snName', 'Berk'); await Bb.click('.sinif-join-btn');
await Bb.waitForSelector('.st-head', { timeout: 10000 });
const Cc = await phone('cem'); await joinUI(Cc, KOD, 'Cem'); await Cc.waitForSelector('.st-head', { timeout: 10000 });
// hesaplı katılımcı (anonim değil): kullanıcı adı önerilir, anonim giriş yapılmaz
const Dd = await phone('hesapli', { mockOpt: { sinifUid: '00000000-0000-4000-8000-0000000000d1', sinifUsername: 'deniz_hoca' } });
await Dd.goto(URL + '#/katil/' + KOD); await Dd.waitForSelector('[data-sn-join]');
check((await Dd.inputValue('#snName')) === 'sen_buradasin', 'hesaplı kullanıcıda takma ad kullanıcı adıyla dolu');
await Dd.fill('#snName', 'Deniz'); await Dd.click('.sinif-join-btn'); await Dd.waitForSelector('.st-head', { timeout: 10000 });
check(await Dd.evaluate(() => window.olMock.anonCalls === 0), 'hesaplı katılımcı: anonim giriş yok');
const Kk = await phone('kick'); await joinUI(Kk, KOD, 'Kemal'); await Kk.waitForSelector('.st-head', { timeout: 10000 });
// sunucu tarafında 15 katılımcı daha (20 ad)
const BOTS = ['Ece', 'Fırat', 'Gül', 'Hakan', 'Irmak', 'Jale', 'Lale', 'Mert', 'Nil', 'Oya', 'Pelin', 'Rüzgar', 'Selin', 'Tuna', 'Umut'].map((n, i) => {
  const uid = 'bot-' + i; E.users[uid] = { anonymous: true };
  const r = E.call(uid, 'sinif_katil', { p_kod: KOD, p_takma_ad: n });
  return { uid, ad: n, kid: r.data && r.data.katilimci_id };
});
check(BOTS.every(x => x.kid), '15 ek katılımcı sunucuda katıldı');
check(await waitText(P, '.sp-people-title', /^20\s*kişi katıldı/), 'projeksiyon: 20 kişi');
await sleep(900);
await shot(P, 'proj_lobi_20');
await noOverflow(P, 'projeksiyon lobi 20 kişi');
check(await P.evaluate(() => document.querySelector('.sp-tile [data-sn-kick]') !== null), 'lobide adlar dokunulabilir (çıkarma)');
// hesaplı katılımcının gerçek Nöro'su (profiles), anonimlerinki takma addan
check(await P.evaluate(() => window.PsikoVakaOnline.sinif.state.avatars.size) >= 1, 'hesaplı katılımcının profil avatarı yüklendi');

// kapasite (ayrı oturum, kapasite 2)
{
  const r = E.call(Object.keys(E.users).find(u => E.users[u].username === 'sen_buradasin'), 'sinif_olustur', { p_ayarlar: { kapasite: 2, vaka_sayisi: 3 } });
  const k2 = r.data.kod;
  ['cap-1', 'cap-2'].forEach(u => { E.users[u] = { anonymous: true }; E.call(u, 'sinif_katil', { p_kod: k2, p_takma_ad: u }); });
  const X = await phone('kapasite');
  await joinUI(X, k2, 'Zeynep');
  check(await waitText(X, '#snCodeErr', /dolu/), 'kapasite dolu: "Oturum dolu."');
  await X.fill('#snCode', 'ZZZZZZ'); await X.click('.sinif-join-btn');
  check(await waitText(X, '#snCodeErr', /açık bir oturum yok/), 'yanlış kod: "Bu kodla açık bir oturum yok"');
  E.call(Object.keys(E.users).find(u => E.users[u].username === 'sen_buradasin'), 'sinif_bitir', { p_oturum: r.data.oturum_id });
  await X._ctx.close(); pages.splice(pages.indexOf(X), 1);
}

// atma
await P.click(`[data-sn-kick="${ses().katilimcilar.find(k => k.takma_ad === 'Kemal').id}"]`);
await P.waitForSelector('.ol-sheet [data-ol-action="yes"]');
await P.click('.ol-sheet [data-ol-action="yes"]');
check(await waitText(P, '.sp-people-title', /^19\s*kişi/) && !/Kemal/.test(await txt(P, '.sp-tiles')), 'projeksiyon: Kemal çıkarıldı (19 kişi)');
check(await waitText(Kk, '#sinifLayer', /Oturumdan çıkarıldın/, 6000), 'telefon: "Oturumdan çıkarıldın" (yoklamada ATILDIN)');
await joinUI(Kk, KOD, 'Kemal2');
check(await waitText(Kk, '#snCodeErr', /çıkardı/), 'atılan kullanıcı yeniden katılamaz');

// ================================================================ 5. başlat, geri sayım, ipucu zaman çizelgesi
await P.click('[data-sn="start"]');
check(await waitText(P, '.sp-main', /Hazır ol/), 'başlat: projeksiyonda "Hazır ol" geri sayımı');
check(await waitText(A, '.st-main', /Hazır ol/, 6000), 'telefon: "Hazır ol"');
await advance(37000);   // tur başı + 34 sn → 3. ipucu penceresinin 4. saniyesi
const caseId = ses().vakalar[0].id;
const kase = CASES.find(c => c.id === caseId);
check(await waitText(P, '.sp-clue-count', /3\/6/), 'projeksiyon: ipucu 3/6 (sunucu saatiyle, +37 sn kayıklık dahil)');
check(E.ipucuNo(SID) === 3, 'sahte sunucu da 3. ipucunda');
check((await txt(P, '.sp-clue-now-t')) === kase.clues[2], 'projeksiyon: güncel ipucu metni 3. ipucu');
check(!(await txt(P, '#sinifLayer')).includes(dxName(kase.diagnosisId)), 'projeksiyon: tur sırasında cevap YOK');
const fsClue = await P.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.sp-clue-now-t')).fontSize));
check(fsClue >= 34, `projeksiyon: güncel ipucu yazısı büyük (${fsClue}px)`);
check(await waitText(A, '.st-pline', /İpucu 3\/6/), 'telefon: İpucu 3/6');
check((await A.locator('.st-clue').count()) === 3 && (await txt(A, '.st-clue.is-now .st-clue-t')) === kase.clues[2], 'telefon: üç ipucu metni, en yenisi vurgulu');
check(await A.evaluate(() => { const v = document.querySelector('[data-sn-bar]'); return v && v.value > 150 && v.value < 500; }), 'ilerleme çubuğu sonraki ipucuna kalan süreyi gösteriyor');
await sleep(400);
await shot(P, 'proj_tur_ipucu3');
await noOverflow(P, 'projeksiyon tur');
await shot(A, 'tel_tur');
await taps(A, 'telefon tur');
await noOverflow(A, 'telefon tur');

// ================================================================ 6. tahminler ve puan
const ans = answer(1);
await guessUI(Bb, otherGroup(ans));
check(await waitText(Bb, '.st-feedback', /değil\. 2 hakkın kaldı/), 'yanlış tahmin: geri bildirim + kalan hak');
check(/Kalan hak 2\/3/.test(await txt(Bb, '[data-sn-marks]')), 'kalan hak işaretleri 2/3');
await guessUI(Cc, sameGroup(ans));
check(await waitText(Cc, '.st-feedback', /aynı tanı grubunda/), 'aynı gruptan tahmin: ipucu');
await sleep(300); await shot(Cc, 'tel_geri_bildirim');
await guessUI(Cc, sameGroup(ans));
check(await waitText(Cc, '.st-feedback', /zaten tahmin ettin/), 'aynı tahmin tekrarı hak yemez');
check(/Kalan hak 2\/3/.test(await txt(Cc, '[data-sn-marks]')), 'tekrar tahmin hakkı düşmedi');
await A.fill('#snGuess', 'yok böyle bir tanı xyz'); await A.press('#snGuess', 'Enter'); await sleep(200);
check(/Listede yok/.test(await txt(A, '.st-feedback')), 'listede olmayan yazı: sunucuya gitmeden uyarı');
await guessUI(A, ans);
check(await waitText(A, '.st-main', /Bildin!/), 'doğru tahmin: "Bildin! Diğerleri bekleniyor"');
const adaPts = ses().sonuclar.find(r => r.katilimci_id === ses().katilimcilar.find(k => k.takma_ad === 'Ada').id).puan;
check(adaPts >= 700 && adaPts <= 800 && (await txt(A, '.st-gain')) === `+${adaPts} puan`, `puan: 3. ipucunda 700 + hız bonusu = ${adaPts}, telefonda aynı`);
await shot(A, 'tel_bildin');
check(await waitText(P, '[data-sn-live]', /^1\s*\/\s*19\s*bildi/), 'projeksiyon: "1/19 bildi" (cevap gösterilmeden)');
check(!(await txt(P, '#sinifLayer')).includes(dxName(ans)), 'projeksiyon hâlâ cevabı göstermiyor');
// hesaplı Deniz ve botlar
await guessUI(Dd, ans);
BOTS.forEach((x, i) => { if (i < 7) E.call(x.uid, 'sinif_tahmin', { p_oturum: SID, p_item_id: ans }); });
await advance(16000);   // 4. ipucu
BOTS.forEach((x, i) => { if (i >= 7 && i < 11) E.call(x.uid, 'sinif_tahmin', { p_oturum: SID, p_item_id: ans }); else if (i >= 11) { for (const id of [otherGroup(ans), sameGroup(ans), DX.find(d => d.id !== ans && d.id !== otherGroup(ans) && d.id !== sameGroup(ans)).id]) E.call(x.uid, 'sinif_tahmin', { p_oturum: SID, p_item_id: id }); } });
check(await waitText(P, '[data-sn-live]', /^13\s*\/\s*19\s*bildi/), 'projeksiyon: canlı sayaç 13/19 bildi');
check(await waitText(P, '.sp-done', /17\/19 bitirdi/), 'projeksiyon: 17/19 bitirdi');
// son ikisi bitince tur kendiliğinden kapanır
await guessUI(Bb, sameGroup(ans)); await guessUI(Bb, DX.find(d => d.id !== ans && d.id !== otherGroup(ans) && d.id !== sameGroup(ans)).id);
check(await waitText(Bb, '.st-main', /Hakların bitti/), 'hak bitti: "Hakların bitti"');
await guessUI(Cc, ans);
check(await waitText(P, '.sp-main', new RegExp(dxName(ans).replace(/[()]/g, '.'))), 'herkes bitince tur kendiliğinden kapandı: projeksiyonda cevap');
check(ses().tur_kapanma_nedeni === 'herkes_bitti', 'kapanma nedeni herkes_bitti');

// ================================================================ 7. cevap görünümü
check(/Kaçıncı ipucunda bildiler/.test(await txt(P, '.sp-chart')) && (await P.locator('.sp-bar-col').count()) === 7, 'cevap: ipucuna göre çubuk grafik (6 ipucu + bilemedi)');
check((await P.locator('.sp-fast-row').count()) === 5, 'cevap: en hızlı 5');
check(/^1\s*Ada/.test((await txt(P, '.sp-fast-row')).replace(/\s+/g, ' ').trim()) || (await txt(P, '.sp-fast-list')).includes('Ada'), 'en hızlılarda Ada');
check(await waitText(A, '.st-main', /Cevap/) && (await txt(A, '.st-ans')) === dxName(ans), 'telefon: cevap + tur sonucu');
check(/sıradasın/.test(await txt(A, '.st-rank')), 'telefon: sıra ve puan');
await sleep(800);
await shot(P, 'proj_cevap');
await noOverflow(P, 'projeksiyon cevap');
if (await P.locator('[data-sn="explain"]').count()) {
  await P.click('[data-sn="explain"]'); await sleep(300);
  check((await P.locator('.sp-explain-body').count()) === 1, 'açıklama projeksiyonda açıldı');
  await shot(P, 'proj_aciklama');
  await P.click('[data-sn="explain"]'); await sleep(200);
}

// ================================================================ 8. sıralama, sonraki tur, geç katılım, yeniden yükleme, ağ kopması
await P.click('[data-sn="next"]');
check(await waitText(P, '.sp-main', /Sıralama/), 'sonraki: sıralama görünümü');
check((await P.locator('.sp-rank-row').count()) === 10, 'sıralama: ilk 10');
check(/Ada/.test(await txt(P, '.sp-rank-row'))
  , 'sıralama birincisi Ada');
check(await waitText(A, '.st-rank', /1\.\s*sıradasın/), 'telefon: 1. sıradasın');
await P.click('[data-sn="next"]');
check(await waitText(P, '.sp-main', /Hazır ol/), 'sonraki vaka: tur 2 geri sayımı');
const Late = await phone('gec');
await joinUI(Late, KOD, 'Geç Gelen');
check(await waitText(Late, '.st-main', /Bir sonraki turda sen de varsın/, 10000), 'geç katılım: sonraki turdan oynar');
await advance(5000);
check(await waitText(P, '.sp-clue-count', /1\/6/), 'tur 2: ipucu 1/6');
// telefon yenileme
await A.reload();
check(await waitText(A, '.st-pline', /İpucu 1\/6/, 10000), 'telefon yenilendi: oturum ve ipucu geri geldi (anonim oturum kalıcı)');
check(await A.evaluate(() => window.olMock.anonCalls) === 0, 'yenilemede yeniden anonim giriş yok');
await guessUI(A, otherGroup(answer(2)));
await A.reload();
check(await waitText(A, '[data-sn-marks]', /Kalan hak 2\/3/, 10000) && (await A.locator('.st-guess').count()) === 1, 'yenilemede kalan hak ve tahminler sinif_durum\'dan');
// projeksiyon yenileme
await P.reload();
check(await waitText(P, '.sp-clue-count', /1\/6/, 10000), 'projeksiyon yenilendi: tur görünümü geri geldi');
// QR'ı yeniden okutmak: açık oturuma doğrudan dönüş
await Cc.goto(URL + '#/katil/' + KOD);
check(await waitText(Cc, '.st-pline', /İpucu 1\/6/, 10000), 'aynı QR yeniden açılınca açık oturuma dönülür');
// ağ kopması
E.fail = { fn: '*', code: 'NETWORK' };
check(await Bb.locator('[data-sn-offline]').waitFor({ state: 'visible', timeout: 7000 }).then(() => true).catch(() => false), 'ağ koptu: telefonda "Bağlantı koptu" uyarısı');
await advance(15000 + 0);   // ipucu yine de yerel saatle açılır (ozet başarısız olur)
E.fail = null;
check(await waitText(Bb, '.st-pline', /İpucu 2\/6/, 7000), 'ağ yokken ipucu yerel saatle açıldı / döndüğünde senkron');
check(await Bb.locator('[data-sn-offline]').isHidden({ timeout: 7000 }).catch(() => false) || await (async () => { await sleep(4000); return Bb.locator('[data-sn-offline]').isHidden(); })(), 'ağ geri geldi: uyarı kalktı');
// tur 1'de bilemeyen botlar tur 2'de bilir → yükselir
BOTS.forEach((x, i) => { if (i >= 11) E.call(x.uid, 'sinif_tahmin', { p_oturum: SID, p_item_id: answer(2) }); });
// sunucu turu bitirir → sıralamada hareket okları
await P.click('[data-sn="endround"]');
check(await waitText(P, '.sp-main', /Cevap/), 'Turu bitir: cevap görünümü');
await P.click('[data-sn="next"]');
check(await waitText(P, '.sp-main', /Sıralama/), 'tur 2 sıralaması');
check((await P.locator('.sp-move.is-down, .sp-move.is-up').count()) >= 1, 'sıralamada hareket okları (bir önceki turdan bu yana)');
await sleep(900);
await shot(P, 'proj_siralama');
await noOverflow(P, 'projeksiyon sıralama');

// ================================================================ 9. son tur, bitiş, podyum
await P.click('[data-sn="next"]');
await advance(5000);
check(await waitText(Late, '.st-pline', /İpucu 1\/6/, 8000), 'geç gelen tur 3\'te oynuyor');
await guessUI(Late, answer(3));
check(await waitText(Late, '.st-main', /Bildin!/), 'geç gelen tahmin etti');
await P.click('[data-sn="end"]');
await P.waitForSelector('.ol-sheet [data-ol-action="yes"]');
await P.click('.ol-sheet [data-ol-action="yes"]');
check(await waitText(P, '.sp-main', /Kazananlar/), 'oturumu bitir: podyum');
check((await P.locator('.sp-pod-col.is-1 .sp-pod-name').count()) >= 1, 'podyumda birinci');
check(await waitText(A, '.st-main', /Oyun bitti/, 8000) && /oldun/.test(await txt(A, '.st-main h1')), 'telefon: final sırası');
check((await A.locator('[data-sn="signup"]').count()) === 1 && (await Dd.locator('[data-sn="signup"]').count()) === 0, 'anonim katılımcıya "Hesap aç", hesaplıya değil');
await sleep(1200);
await shot(P, 'proj_podyum');
await noOverflow(P, 'projeksiyon podyum');
await shot(A, 'tel_final');

// ================================================================ 10. anonim kullanıcı uygulamanın geri kalanında misafir
await A.click('[data-sn="home"]');
await A.evaluate(() => { location.hash = '#/online'; }); await sleep(900);
check(await A.evaluate(() => document.getElementById('onlineHubMount').dataset.state === 'guest'), 'anonim kullanıcı Online\'da misafir (giriş/kayıt çağrısı)');
check(/Hesap oluştur/.test(await txt(A, '#onlineHubMount')), 'giriş/kayıt seçenekleri normal görünür');
check(await A.evaluate(() => { const m = document.getElementById('usernameModal'); return !m || !m.classList.contains('open'); }), 'kullanıcı adı adımı açılmadı');
await A.evaluate(() => { location.hash = '#/profil'; }); await sleep(600);
check(await A.evaluate(() => window.game.accountSnap && window.game.accountSnap.state === 'guest'), 'Profil: misafir');

// açık tema + hareket azaltma örnekleri
{
  const L = await proj('acik', { theme: 'light', reduced: true });
  const r = E.call(Object.keys(E.users).find(u => E.users[u].username === 'sen_buradasin'), 'sinif_olustur', { p_ayarlar: { vaka_sayisi: 3 } });
  const id2 = r.data.oturum_id;
  BOTS.slice(0, 6).forEach(x => E.call(x.uid, 'sinif_katil', { p_kod: r.data.kod, p_takma_ad: x.ad }));
  await L.goto(URL + '#/sinif/' + id2); await L.waitForSelector('.sp-code', { timeout: 10000 });
  await shot(L, 'proj_lobi_acik');
  E.call(Object.keys(E.users).find(u => E.users[u].username === 'sen_buradasin'), 'sinif_basla', { p_oturum: id2 });
  await advance(37000);
  check(await waitText(L, '.sp-clue-count', /3\/6/, 8000), 'açık tema projeksiyon turu');
  check(await L.evaluate(() => getComputedStyle(document.querySelector('.sp-clue-now')).animationName === 'none'), 'hareket azaltma: ipucu animasyonu yok');
  await shot(L, 'proj_tur_acik');
  await noOverflow(L, 'açık tema projeksiyon');
  E.call(Object.keys(E.users).find(u => E.users[u].username === 'sen_buradasin'), 'sinif_bitir', { p_oturum: id2 });
}

const errs = pages.flatMap(p => (p._errors || []).map(e => p._label + ': ' + e));
check(!errs.length, 'konsol hatası yok ' + JSON.stringify(errs.slice(0, 4)));
console.log(`SONUÇ ${check.oks || 0} ok, ${check.fails || 0} fail`);
await b.close();
process.exit(check.fails ? 1 : 0);
