// Ajan P: günün vakası sıralaması + seri (sahte sunucu, §13.1)
import { browser, ctx, page, check, sleep } from './lib.mjs';
const HAR = process.env.HAR || 'http://localhost:8899/tools/online_dev/harness.html?mock=1';
const SHOTS = process.env.SHOTS || '/home/claude/shots';
const b = await browser();
async function open(c, opt, hash) {
  const p = await page(c, 'd');
  await p.goto(HAR + (hash || '#/oyna'));
  await p.waitForFunction(() => window.olMock && window.PsikoVakaOnline.daily);
  await p.evaluate((o) => { window.olMock.set(o); window.olMock.resetDaily(); localStorage.removeItem('psikovaka_daily_done'); window.PsikoVakaOnline.daily._reset(); }, opt || {});
  await p.evaluate(() => window.PsikoVakaOnline.daily.refreshCard(true));
  await sleep(300);
  return p;
}
async function guess(p, id) {
  await p.evaluate((id) => { const g = window.game; const k = g.getEffectiveTargetType(); const list = k === 'therapy' ? g.therapies : k === 'pharmacology' ? g.pharmacology : g.diagnoses; const x = list.find(i => i.id === id); g.dom.diagnosisInput.value = x.nameTr; g.dom.diagnosisInput.dataset.selectedId = id; g.submitGuess(); }, id);
  await sleep(250);
}
for (const vp of [{ w: 360, h: 740, dark: false }, { w: 390, h: 844, dark: true }, { w: 1440, h: 900, dark: false }, { w: 1440, h: 900, dark: true }]) {
  const tag = `${vp.w}_${vp.dark ? 'koyu' : 'acik'}`;
  console.log('== ', tag);
  const c = await ctx(b, { viewport: { width: vp.w, height: vp.h }, theme: vp.dark ? 'dark' : 'light', dark: vp.dark });
  // 1) üye: başla → yanlışlar → kazan
  let p = await open(c, { daily: 'on', boardRows: 30, mePos: 'outside', streakBase: 3 });
  check(await p.locator('#dailyStreakChip').isVisible() && /3 günlük seri/.test(await p.locator('#dailyStreakChip').innerText()), 'kartta seri: 3 günlük seri');
  check(await p.locator('#btnDailyBoard').isVisible(), 'kartta "Sıralamayı gör"');
  if (vp.w === 390) await p.screenshot({ path: `${SHOTS}/gunluk_kart_once_${tag}.png` });
  await p.click('#btnStartDaily');
  await p.waitForFunction(() => window.game.currentScreen === 'play');
  const info = await p.evaluate(() => { const g = window.game; const d = window.olMock.daily.diagnosis; const c = g.currentCase; const wrong = g.diagnoses.filter(x => x.id !== c.diagnosisId).slice(0, 2).map(x => x.id); return { same: c.id === d.case_id, right: c.diagnosisId, wrong, server: window.PsikoVakaOnline.daily.isServerDaily() }; });
  check(info.same && info.server, 'vaka sunucunun case_id\'si, sunucu modu açık');
  await guess(p, info.wrong[0]);
  check((await p.evaluate(() => window.olMock.daily.diagnosis.guesses.length)) === 1, 'tahmin daily_submit_guess\'e gitti');
  check((await p.evaluate(() => window.game.unlockedClues)) === 2, 'yanlışta ipucu açıldı');
  // yenileme gibi: kartdan tekrar başla → kaldığı yerden
  await p.evaluate(() => { window.game.leavePlayScreen(); });
  await sleep(300);
  check(/Devam et/.test(await p.locator('#btnStartDaily').innerText()), 'yarıda: "Devam et"');
  await p.click('#btnStartDaily'); await sleep(400);
  check((await p.evaluate(() => window.game.guesses.length)) === 1, 'kaldığı yerden (tahmin geri kuruldu)');
  await guess(p, info.wrong[1]);
  await guess(p, info.right);
  await sleep(900);
  check(await p.evaluate(() => window.game.isGameOver && window.game.gameWon), 'sunucu kararıyla kazandı');
  // Ajan U (H3): rapor kendiliğinden açılmaz; seri sonuç kartında da görünür
  check(await p.locator('#playResultStreak').isVisible() && /4 günlük seri/.test(await p.locator('#playResultStreak').innerText()), 'sonuç kartında güncel seri (4)');
  await p.click('#btnMainShowReport'); await sleep(400);
  check(await p.locator('#resultStreakNote').isVisible() && /4 günlük seri/.test(await p.locator('#resultStreakNote').innerText()), 'raporda güncel seri (4)');
  check(!/\bRP\b|Elo/.test(await p.locator('#resultModal .result-banner').innerText()), 'raporda RP/Elo yok');
  if (vp.w === 390) await p.screenshot({ path: `${SHOTS}/gunluk_rapor_${tag}.png` });
  await p.evaluate(() => { window.game.closeModal(window.game.dom.resultModal); location.hash = '#/oyna'; window.game.showRoute('oyna'); });
  await sleep(500);
  check(await p.locator('#btnStartDaily').isHidden() && await p.locator('#dailyResultBox').isVisible(), 'bitince: sonuç özeti, Başla yok');
  check(/3\. tahminde bildin/.test(await p.locator('#dailyResultTitle').innerText()), 'özet: 3. tahminde bildin');
  await p.screenshot({ path: `${SHOTS}/gunluk_kart_sonra_${tag}.png` });
  // tekrar oynama engeli
  const before = await p.evaluate(() => window.olMock.daily.diagnosis.guesses.length);
  await p.evaluate(() => window.game.setMode('daily')); await sleep(500);
  // B3: tekrar başlatma → bitmiş vaka salt okunur (eskiden sıralamaya yönlendiriyordu)
  await p.waitForFunction(() => window.game.currentScreen === 'play' && window.game.dailyReadOnly, null, { timeout: 4000 }).catch(() => {});
  check(await p.evaluate(() => window.game.currentScreen === 'play' && window.game.isGameOver && window.game.dailyReadOnly && window.game.dom.mainInputSection.hidden), 'tekrar başlatma → bitmiş vaka salt okunur ' + await p.evaluate(() => JSON.stringify([window.game.currentScreen, window.game.isGameOver, window.game.dailyReadOnly, window.game.dom.mainInputSection.hidden])));
  check((await p.evaluate(() => window.olMock.daily.diagnosis.guesses.length)) === before, 'yeni deneme yok');
  await p.evaluate(() => { location.hash = '#/gunluk'; }); await sleep(300);
  // sıralama: 30 satır, kendi satırı dışarıda (sabit)
  await p.waitForSelector('.dl-list', { timeout: 4000 });
  check((await p.locator('.dl-row').count()) === 31, '30 satır + sabitlenmiş kendi satırın');
  check(await p.locator('.dl-row.is-me.is-pinned').isVisible(), 'kendi satırın vurgulu ve sabit');
  check(/oyuncu bitirdi/.test(await p.locator('.dl-total').innerText()), 'toplam oyuncu');
  check((await p.locator('.dl-row').first().locator('.dl-pips i').count()) === 6, 'tahmin pipleri');
  check(await p.locator('[data-route="oyna"].active').count() >= 1 || vp.w >= 768, 'menüde Oyna etkin');
  await p.screenshot({ path: `${SHOTS}/gunluk_siralama_${tag}.png` });
  check(!(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), 'taşma yok');
  // dün
  await p.click('[data-dl-day="yesterday"]'); await sleep(400);
  check((await p.locator('.dl-row.is-me').count()) === 0 && await p.locator('[data-dl-day="yesterday"]').getAttribute('aria-checked') === 'true', 'Dün: kendi bugünkü satırın yok');
  // arkadaşlar
  await p.click('[data-dl-day="today"]'); await sleep(400);
  await p.check('[data-dl-friends]'); await sleep(300);
  check((await p.locator('.dl-row').count()) >= 1 && /ayse_klinik/.test(await p.locator('.dl-list').innerText()), 'yalnızca arkadaşlar (ayse_klinik)');
  check(p._errors.length === 0, 'konsol temiz ' + p._errors.join('|'));
  await p.close();
  // 2) pes etme + 0 / 1 satır + kendi satırı üstte
  p = await open(c, { daily: 'on', boardRows: 1, mePos: 'top' });
  await p.click('#btnStartDaily'); await p.waitForFunction(() => window.game.currentScreen === 'play');
  await p.evaluate(() => window.game.giveUp()); await sleep(900);
  check(await p.evaluate(() => window.game.isGameOver && !window.game.gameWon), 'pes etti (sunucu)');
  check(/Seri sıfırlandı/.test(await p.locator('#playResultStreak').innerText()), 'sonuç kartında: seri sıfırlandı');
  await p.click('#btnMainShowReport'); await sleep(400);
  check(/Seri sıfırlandı/.test(await p.locator('#resultStreakNote').innerText()), 'raporda: seri sıfırlandı');
  check(await p.locator('#resultExplainBox').count() === 1, 'rapor açık');
  await p.evaluate(() => { window.game.closeModal(window.game.dom.resultModal); location.hash = '#/gunluk'; }); await sleep(600);
  check((await p.locator('.dl-row').count()) === 1 && (await p.locator('.dl-row.is-me').count()) === 1, '1 satır: kendi satırın');
  await p.evaluate(() => { window.olMock.set({ boardRows: 0 }); }); await p.click('[data-dl-target="therapy"]'); await sleep(500);
  check(/henüz kimse bitirmedi/.test(await p.locator('.dl-body').innerText()), '0 satır: boş durum');
  check(await p.locator('.dl-cta').isVisible(), 'terapi oynanmadı → "Başla" çağrısı');
  if (vp.w === 390) await p.screenshot({ path: `${SHOTS}/gunluk_bos_${tag}.png` });
  await p.close();
  // 3) misafir: aynı case_id ile yerel oyun, sıralamada giriş çağrısı, seri gizli
  p = await open(c, { daily: 'on', guest: true });
  check(await p.locator('#dailyStreakChip').isHidden(), 'misafir: seri gizli');
  await p.click('#btnStartDaily'); await p.waitForFunction(() => window.game.currentScreen === 'play');
  check(await p.evaluate(() => window.game.currentCase.id === window.olMock.daily.diagnosis.case_id && !window.PsikoVakaOnline.daily.isServerDaily()), 'misafir: üyelerle aynı vaka, yerel oyun');
  await p.evaluate(() => { window.game.leavePlayScreen(); location.hash = '#/gunluk'; }); await sleep(500);
  check(/giriş yap/i.test(await p.locator('.dl-body').innerText()), 'misafir sıralamada giriş çağrısı');
  await p.close();
  // 4) RPC yok → her şey yerel, girişler gizli
  p = await open(c, { daily: 'unsupported' });
  check(await p.locator('#btnDailyBoard').isHidden() && await p.locator('#dailyStreakChip').isHidden(), 'RPC yok: sıralama düğmesi ve seri gizli');
  await p.click('#btnStartDaily'); await p.waitForFunction(() => window.game.currentScreen === 'play');
  check(!(await p.evaluate(() => window.PsikoVakaOnline.daily.isServerDaily())), 'RPC yok: yerel günlük');
  await p.evaluate(() => { window.game.leavePlayScreen(); location.hash = '#/gunluk'; }); await sleep(500);
  check(/yakında/.test(await p.locator('.dl-body').innerText()), 'RPC yok: sıralama "yakında"');
  await p.evaluate(() => { location.hash = '#/profil'; }); await sleep(400);
  check(await p.locator('#profileStreaks').isHidden(), 'RPC yok: Profil serisi gizli');
  check(p._errors.length === 0, 'konsol temiz ' + p._errors.join('|'));
  await p.close();
  // 5) Profil serisi (açık)
  p = await open(c, { daily: 'on' }, '#/profil');
  await p.evaluate(() => { location.hash = '#/oyna'; }); await sleep(200); await p.evaluate(() => { location.hash = '#/profil'; }); await sleep(600);
  check(await p.locator('#profileStreaks').isVisible() && /En iyi 6/.test(await p.locator('#profileStreaks').innerText()), 'Profil: seri + en iyi');
  if (vp.w === 390) await p.screenshot({ path: `${SHOTS}/gunluk_profil_${tag}.png` });
  await p.close();
  await c.close();
}
await b.close();
console.log(`SONUÇ ${check.oks || 0} ok / ${check.fails || 0} fail`);
