// Ajan B3: günün vakası hedef başına günde bir kez (sahte sunucu). Her giriş yolu bitmiş günü SALT OKUNUR açmalı.
import { browser, page, check, sleep } from './lib.mjs';
const HAR = process.env.HAR || 'http://localhost:8899/tools/online_dev/harness.html?mock=1';
const b = await browser();
async function newCtx(opts = {}) {
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, timezoneId: opts.tz || 'Europe/Istanbul' });
  await c.route('**/*', (r) => /fonts\.(googleapis|gstatic)|unpkg\.com|cdn\.jsdelivr/.test(r.request().url()) ? r.abort() : r.continue());
  // sahte sunucu durumu yenilemede kalsın (sessionStorage) + başlangıç seçenekleri
  await c.addInitScript((o) => { sessionStorage.setItem('olMockPersist', '1'); if (o && !sessionStorage.getItem('olMockState')) sessionStorage.setItem('olMockState', JSON.stringify({ state: null, opt: o, daily: {} })); }, opts.mock || { daily: 'on' });
  return c;
}
async function open(c, hash, clock) {
  const p = await page(c, 'b3');
  if (clock) await p.clock.install({ time: clock });
  await p.goto(HAR + (hash || '#/oyna'));
  await p.waitForFunction(() => window.olMock && window.PsikoVakaOnline && window.PsikoVakaOnline.daily && window.game);
  await sleep(400);
  return p;
}
const S = (p) => p.evaluate(() => { const g = window.game, $ = (id) => document.getElementById(id); return {
  btn: !$('btnStartDaily').hidden, btnDis: $('btnStartDaily').disabled, res: !$('dailyResultBox').hidden, board: !$('btnDailyBoard').hidden, title: $('dailyResultTitle').textContent,
  screen: g.currentScreen, mode: g.currentMode, over: !!g.isGameOver, ro: !!g.dailyReadOnly, input: !g.dom.mainInputSection.hidden, clues: g.unlockedClues, nguess: g.guesses.length,
  resume: !$('homeResume').hidden, caseId: g.currentCase && g.currentCase.id, target: g.targetGameMode, label: g.currentDisplayTitle, avail: window.PsikoVakaOnline.daily.available,
  begin: window.olMock.beginCalls, submit: window.olMock.submitCalls, server: window.PsikoVakaOnline.daily.isServerDaily() }; });
// sahte sunucu seçeneği: hemen + yenilemeden sonra da geçerli (mock yalnızca günlük değişince kaydediyor)
const opt = (p, o) => p.evaluate((o) => { const st = JSON.parse(sessionStorage.getItem('olMockState') || 'null') || { state: null, opt: {}, daily: {} }; Object.assign(st.opt, o); st.daily = window.olMock.daily; sessionStorage.setItem('olMockState', JSON.stringify(st)); window.olMock.set(o); }, o);
const home = async (p) => { await p.evaluate(() => { const g = window.game; g.closeModal && g.dom.resultModal && g.closeModal(g.dom.resultModal); if (g.currentScreen === 'play') g.leavePlayScreen(); location.hash = '#/oyna'; g.showRoute('oyna'); }); await sleep(500); };
const setTarget = async (p, t) => { await p.click(`.target-mode-btn[data-target="${t}"]`); await sleep(400); };
async function answer(p) { return p.evaluate(() => { const g = window.game, c = g.currentCase, k = g.getEffectiveTargetType(); return k === 'therapy' ? (c.therapyId || 'cbt_general') : k === 'pharmacology' ? (c.pharmacologyId || g.getFallbackPharmacologyId(c)) : c.diagnosisId; }); }
async function guess(p, id) { await p.evaluate((id) => { const g = window.game; const k = g.getEffectiveTargetType(); const list = k === 'therapy' ? g.therapies : k === 'pharmacology' ? g.pharmacology : g.diagnoses; const x = list.find(i => i.id === id); g.dom.diagnosisInput.value = x.nameTr; g.dom.diagnosisInput.dataset.selectedId = id; g.submitGuess(); }, id); await sleep(350); }
async function wrongThenWin(p) { const w = await p.evaluate(() => { const g = window.game; const c = g.currentCase; return g.diagnoses.find(d => d.id !== c.diagnosisId).id; }); if ((await S(p)).target !== 'combo' && (await S(p)).target === 'diagnosis') await guess(p, w); await guess(p, await answer(p)); }
async function startDaily(p) { await p.evaluate(() => window.game.setMode('daily')); await p.waitForFunction(() => window.game.currentScreen === 'play', null, { timeout: 8000 }); await sleep(300); }
function readOnly(s, msg) { check(s.screen === 'play' && s.mode === 'daily' && s.over && s.ro && !s.input && s.clues === 6, msg + ' ' + JSON.stringify({ screen: s.screen, over: s.over, ro: s.ro, input: s.input, clues: s.clues })); }

// ================================================================ MİSAFİR (yerel kayıt; sunucunun case_id'si)
console.log('== misafir');
let c = await newCtx({ mock: { daily: 'on', guest: true } });
let p = await open(c);
let s = await S(p);
check(s.btn && !s.res, 'misafir: başta "Başla"');
await startDaily(p);
const gCase = (await S(p)).caseId;
check(gCase === await p.evaluate(() => window.olMock.daily.diagnosis.case_id) && !(await S(p)).server, 'misafir: sunucunun case_id\'si, yerel oyun');
await wrongThenWin(p);
s = await S(p); check(s.over && !s.ro && s.nguess === 2, 'misafir: 2. tahminde bitti');
const rec = await p.evaluate(() => JSON.parse(localStorage.getItem('psikovaka_daily_done')));
const day = await p.evaluate(() => (window.game.getDailyDay ? window.game.getDailyDay() : new Date(Date.now() + 3 * 3600e3).toISOString().slice(0, 10)));
check(rec && rec[`${day}|diagnosis`] && rec[`${day}|diagnosis`].caseId === gCase, 'misafir: kayıt anahtarı İstanbul günü + hedef ' + Object.keys(rec || {}));
await home(p); s = await S(p);
check(!s.btn && s.res && s.board && /2\. tahminde bildin/.test(s.title), 'misafir: kart sonucu + Sıralamayı gör, Başla yok');
check(!s.resume, 'misafir: "devam et" afişi yok');
await p.reload(); await sleep(700); s = await S(p);
check(!s.btn && s.res && /2\. tahminde/.test(s.title), 'misafir yenileme: kart hâlâ bitti');
await p.click('#dailyResultBox'); await sleep(500); s = await S(p);
readOnly(s, 'misafir: karta dokun → salt okunur');
check(s.caseId === gCase && s.nguess === 2 && /bitti/.test(s.label), 'misafir salt okunur: aynı vaka, 2 tahmin geri kuruldu');
check(await p.locator('#finishedActions').isVisible() && await p.locator('#playResultBox').isVisible(), 'salt okunur: sonuç kartı görünür');
await p.click('#btnMainShowReport'); await sleep(400);
check(await p.locator('#resultModal.open, #resultModal .result-banner').first().isVisible(), 'salt okunur: rapor/açıklama açılır');
await home(p);
// doğrudan setMode + tahmin denemesi
await startDaily(p); s = await S(p); readOnly(s, 'misafir: setMode(daily) → salt okunur');
await guess(p, await p.evaluate(() => window.game.diagnoses[0].id)); s = await S(p);
check(s.nguess === 2, 'salt okunur: tahmin eklenmez');
// geri tuşu / ileri
await p.goBack(); await sleep(400); s = await S(p);
check(s.screen === 'oyna' && !s.btn && s.res, 'geri: ana sayfa, kart bitti');
await p.goForward(); await sleep(400); s = await S(p);
check(s.screen !== 'play' || (s.over && s.ro), 'ileri: oynanabilir günlük açılmaz');
await home(p);
// hedefler bağımsız
for (const t of ['therapy', 'pharmacology', 'combo']) {
  await setTarget(p, t); s = await S(p);
  check(s.btn && !s.res, `${t}: bağımsız, "Başla"`);
}
await setTarget(p, 'therapy'); await startDaily(p);
check(!(await S(p)).ro && !(await S(p)).over, 'terapi: oynanabilir');
await p.evaluate(() => window.game.giveUp()); await sleep(300);
await home(p); s = await S(p);
check(!s.btn && s.res && /olmadı/.test(s.title), 'terapi: pes → kart "Bugün olmadı"');
await setTarget(p, 'pharmacology'); s = await S(p); check(s.btn && !s.res, 'ilaç hâlâ "Başla"');
await setTarget(p, 'combo'); await startDaily(p);
await p.evaluate(() => window.game.giveUp()); await sleep(300); await home(p);
check(!(await S(p)).btn, 'kombo bitti');
await setTarget(p, 'diagnosis'); s = await S(p); check(!s.btn && s.res, 'tanıya dönünce: bitti');
// yeni sekme
let p2 = await open(c); s = await S(p2);
check(!s.btn && s.res, 'yeni sekme: bitti');
await p2.close();
// pratik aynı vakayı verebilir (pratik etiketi)
await p.evaluate((id) => { const g = window.game; g.currentMode = 'practice'; g.startCase(g.allMasterCases.find(x => x.id === id), 'Pratik · Vaka'); }, gCase); s = await S(p);
check(s.mode === 'practice' && !s.ro && /Pratik/.test(s.label), 'pratik: aynı vaka pratik olarak (etiketli) açılabilir');
await home(p);
// derin bağlantı: #id= pratik açar (günlük değil), #/gunluk misafir kapısı
await p.goto(HAR + '#id=' + gCase); await sleep(900); s = await S(p);
check(s.mode !== 'daily' && !/Günün vakası/.test(s.label || ''), '#id= bağlantısı günlük olarak açılmaz: ' + s.label);
await p.goto(HAR + '#/gunluk'); await sleep(700);
check(await p.locator('.dl-cta').count() === 0, '#/gunluk: misafire "Başla" çağrısı yok');
await p.goto(HAR + '#/oyna'); await sleep(600); s = await S(p);
check(!s.btn && s.res, 'bağlantılardan sonra kart hâlâ bitti');
// iki sekme: A'da yarıda, B'de bitir → A salt okunur
await setTarget(p, 'pharmacology'); await startDaily(p);
p2 = await open(c); await setTarget(p2, 'pharmacology'); await startDaily(p2);
await p2.evaluate(() => window.game.giveUp()); await sleep(600);
s = await S(p); check(s.over && s.ro, 'iki sekme: diğerinde bitince bu sekme salt okunura geçer');
await home(p); s = await S(p); check(!s.resume && !s.btn, 'iki sekme: afiş yok, kart bitti');
await p2.close();
check(p._errors.length === 0, 'misafir konsol temiz ' + p._errors.join('|'));
await c.close();

// ================================================================ ÜYE (sunucu otoriter)
console.log('== üye');
c = await newCtx({ mock: { daily: 'on' } });
p = await open(c);
await startDaily(p); s = await S(p);
check(s.server && s.begin === 1, 'üye: sunucu günlüğü (daily_begin)');
await wrongThenWin(p); s = await S(p);
check(s.over && s.submit === 2, 'üye: 2 tahmin sunucuya gitti, bitti');
await home(p); s = await S(p); check(!s.btn && s.res && s.board, 'üye: kart sonucu + Sıralamayı gör');
await p.reload(); await sleep(800); s = await S(p);
check(!s.btn && s.res && /2\. tahminde/.test(s.title), 'üye yenileme: kart bitti (sunucu)');
const sub0 = s.submit;
await p.click('#dailyResultBox'); await p.waitForFunction(() => window.game.dailyReadOnly, null, { timeout: 5000 }).catch(() => {}); s = await S(p);
readOnly(s, 'üye: karta dokun → salt okunur');
check(s.nguess === 2 && s.server, 'üye salt okunur: sunucunun tahminleri geri kuruldu');
await guess(p, await p.evaluate(() => window.game.diagnoses[3].id)); await p.evaluate(() => window.game.giveUp()); await sleep(300);
check((await S(p)).submit === sub0, 'üye salt okunur: daily_submit_guess / pes çağrılmaz');
await home(p);
await p.goto(HAR + '#/gunluk'); await sleep(700);
check(await p.locator('.dl-cta').count() === 0, 'üye #/gunluk: bitmiş günde "Başla" yok');
await p.goto(HAR + '#/oyna'); await sleep(600);
// hesap açılışta yükleniyor (pending) → yerel günlüğe düşmemeli
await opt(p, { accPending: true });
await p.reload(); await sleep(600); s = await S(p);
check(await p.evaluate(() => window.PsikoVakaAccount.availability) === 'pending', 'sahte: hesap hizmeti yükleniyor');
check(!s.btn || s.btnDis, 'hesap yükleniyor: kart "Başla" oynatmaz ' + JSON.stringify([s.btn, s.btnDis]));
const pend = p.evaluate(() => window.game.setMode('daily'));
await sleep(500); s = await S(p);
check(s.screen !== 'play' || s.ro, 'hesap yükleniyor: günlük taze açılmadı');
await opt(p, { accPending: false }); await p.evaluate(() => window.olMock.emitAcc()); await pend; await sleep(700); s = await S(p);
readOnly(s, 'hesap hazır olunca: salt okunur (sunucu)');
check(s.avail === true, 'özellik durumu kalıcı "yok"a düşmedi');
await home(p); s = await S(p); check(!s.btn && s.res, 'hesap hazır: kart bitti');
// oturum var, profil yükleniyor (geçici 'guest')
await opt(p, { accLoading: true });
await p.reload(); await sleep(600);
const pend2 = p.evaluate(() => window.game.setMode('daily')); await sleep(400); s = await S(p);
check(s.screen !== 'play' || s.ro, 'profil yükleniyor: misafir sanılıp taze açılmadı');
await opt(p, { accLoading: false }); await p.evaluate(() => window.olMock.emitAcc()); await pend2; await sleep(700); s = await S(p);
readOnly(s, 'profil yüklenince: salt okunur');
await home(p);
// RPC aksaklığı: yerel yedek
await opt(p, { dailyFail: true });
await p.reload(); await sleep(700); s = await S(p);
check(!s.btn && s.res, 'sunucu aksıyor: yerel yedekle kart bitti');
await startDaily(p); s = await S(p); readOnly(s, 'sunucu aksıyor: salt okunur (yerel yedek)');
await home(p);
await setTarget(p, 'therapy'); const before = await S(p);
await p.evaluate(() => window.game.setMode('daily')); await sleep(600); s = await S(p);
check(s.screen !== 'play' && s.submit === before.submit, 'sunucu aksıyor + kayıt yok: yerel günlüğe düşmez (uyarı)');
await opt(p, { dailyFail: false });
await setTarget(p, 'diagnosis');
// üye → misafir aynı gün: yerel kayıt bitti der
await opt(p, { guest: true }); await p.evaluate(() => window.olMock.emitAcc()); await sleep(600); s = await S(p);
check(!s.btn && s.res, 'üye→misafir: kart bitti');
await startDaily(p); s = await S(p); readOnly(s, 'üye→misafir: salt okunur');
await home(p);
check(p._errors.length === 0, 'üye konsol temiz ' + p._errors.join('|'));
await c.close();

// misafir → üye aynı gün: sunucu otoriter (üyenin sunucu denemesi yok → oynayabilir, karar sunucunun)
console.log('== misafir → üye');
c = await newCtx({ mock: { daily: 'on', guest: true } });
p = await open(c);
await startDaily(p); await p.evaluate(() => window.game.giveUp()); await sleep(300); await home(p);
check(!(await S(p)).btn, 'misafir bitirdi');
await opt(p, { guest: false }); await p.evaluate(() => window.olMock.emitAcc()); await sleep(800); s = await S(p);
check(s.btn && !s.res, 'misafir→üye: sunucuya göre (deneme yok) "Başla"');
await startDaily(p); s = await S(p); check(s.server && !s.ro, 'misafir→üye: sunucu günlüğü');
await p.evaluate(() => window.game.giveUp()); await sleep(500); await home(p);
await startDaily(p); s = await S(p); readOnly(s, 'misafir→üye bitirince: salt okunur');
await c.close();

// ================================================================ GECE YARISI (İstanbul) + tarayıcı saat dilimi farkı
console.log('== gece yarısı');
for (const mode of ['on', 'unsupported']) {
  c = await newCtx({ tz: 'America/New_York', mock: { daily: mode, guest: true } });
  // 2026-11-21 23:58 İstanbul = 15:58 New York (yerel gün 21)
  p = await open(c, '#/oyna', new Date('2026-11-21T20:58:00Z'));
  check((await p.evaluate(() => (window.game.getDailyDay ? window.game.getDailyDay() : new Date(Date.now() + 3 * 3600e3).toISOString().slice(0, 10)))) === '2026-11-21', `[${mode}] gün = İstanbul günü 2026-11-21`);
  await startDaily(p); await p.evaluate(() => window.game.giveUp()); await sleep(300); await home(p);
  check(!(await S(p)).btn, `[${mode}] 23:58 bitti`);
  await p.clock.setSystemTime(new Date('2026-11-21T21:01:00Z')); // İstanbul 00:01, New York hâlâ 21 Kasım
  await p.evaluate(() => window.PsikoVakaOnline.daily.refreshCard(true)); await sleep(700); s = await S(p);
  check(s.btn && !s.res, `[${mode}] İstanbul gece yarısından sonra yeni gün: "Başla" (tarayıcı günü değişmese de)`);
  await startDaily(p); s = await S(p); check(!s.ro && !s.over, `[${mode}] yeni günün vakası oynanabilir`);
  await home(p);
  await c.close();
}
// New York 2026-11-21 19:30 = İstanbul 2026-11-22 02:30: kayıt İstanbul gününe
c = await newCtx({ tz: 'America/New_York', mock: { daily: 'unsupported', guest: true } });
p = await open(c, '#/oyna', new Date('2026-11-21T23:30:00Z'));
await startDaily(p); await p.evaluate(() => window.game.giveUp()); await sleep(300);
const keys = await p.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('psikovaka_daily_done') || '{}')));
check(keys.includes('2026-11-22|diagnosis'), 'tarayıcı günü 21, İstanbul 22: kayıt 2026-11-22 ' + keys);
await c.close();

await b.close();
console.log(`SONUÇ ${check.oks || 0} ok / ${check.fails || 0} fail`);
