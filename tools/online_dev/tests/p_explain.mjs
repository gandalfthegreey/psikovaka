// Ajan P: vaka sonrası açıklama (tek kişilik + arşiv + alanı olmayan vaka + sızıntı yok)
import { browser, ctx, page, check, sleep } from './lib.mjs';
const BASE = process.env.IDX || 'http://localhost:8899/index.html';
const SHOTS = process.env.SHOTS || '/home/claude/shots';
const XP = { whyThis: ['Belirti en az iki haftadır sürüyor ve işlevselliği bozuyor.', 'Çökkün duygudurum ve ilgi kaybı birlikte.'], whyNot: [{ diagnosisId: 'bipolar_1', reason: 'Öyküde mani ya da hipomani dönemi yok.' }, { diagnosisId: 'gad', reason: 'Kaygı baskın değil; tablo duygudurum merkezli.' }, { diagnosisId: 'adjustment_disorder', reason: 'Belirtiler tek bir stres etkenine bağlı değil ve tam ölçütleri karşılıyor.' }], teachingPoint: 'Ayırıcı tanıda önce mani/hipomani öyküsünü sor.' };
const b = await browser();
for (const vp of [{ w: 390, h: 844, dark: true }, { w: 360, h: 740, dark: false }, { w: 1440, h: 900, dark: true }, { w: 1440, h: 900, dark: false }]) {
  console.log('== viewport', vp.w, vp.dark ? 'dark' : 'light');
  const c = await ctx(b, { viewport: { width: vp.w, height: vp.h }, theme: vp.dark ? 'dark' : 'light', dark: vp.dark });
  const p = await page(c, 'xp');
  await p.goto(BASE + '#/oyna');
  await p.waitForFunction(() => window.game && window.PsikoVakaExplain);
  // Pratik vakasına açıklama ekle, sonra başlat
  const caseId = await p.evaluate((xp) => {
    const g = window.game; const c = g.cases.find(x => x.diagnosisId && g.diagnoses.find(d => d.id === x.diagnosisId));
    // whyNot tanıları gerçek kimliklerden seç
    const others = g.diagnoses.filter(d => d.id !== c.diagnosisId).slice(0, 3);
    xp.whyNot = xp.whyNot.map((r, i) => ({ diagnosisId: others[i].id, reason: r.reason }));
    c.explanation = xp; g.setTargetGameMode('diagnosis', false); g.currentMode = 'practice'; g.startCase(c, 'Pratik'); return { id: c.id, wrong: others[1].id };
  }, XP);
  check(await p.locator('#resultExplainBox').isHidden(), 'açıklama vaka sürerken gizli');
  check((await p.locator('.xp').count()) === 0, 'vaka sürerken DOM\'da açıklama yok');
  check(await p.locator('#playResultTakeaway').isHidden(), 'akılda kalsın satırı gizli');
  // yanlış tahmin: whyNot'taki ikinci tanı
  await p.evaluate((id) => { const g = window.game; const d = g.diagnoses.find(x => x.id === id); g.dom.diagnosisInput.value = d.nameTr; g.dom.diagnosisInput.dataset.selectedId = id; g.submitGuess(); }, caseId.wrong);
  check((await p.locator('.xp').count()) === 0, 'yanlış tahminden sonra açıklama yok');
  await p.evaluate(() => window.game.giveUp());
  // Ajan U (H3): rapor artık kendiliğinden açılmıyor; sonuç kartındaki düğmeyle açılır
  await sleep(800);
  check(!(await p.evaluate(() => window.game.dom.resultModal.classList.contains('open'))), 'rapor kendiliğinden açılmadı');
  await p.click('#btnMainShowReport');
  await sleep(500);
  check(await p.locator('#resultExplainBox').isVisible(), 'raporda açıklama görünür');
  const firstMine = await p.locator('#resultExplainBox .xp-alt').first().evaluate(e => e.classList.contains('is-mine'));
  check(firstMine, '"Senin tahminin" satırı en üstte');
  const mobile = vp.w < 768;
  const open = await p.locator('#resultExplainBox details.xp-more').count();
  check(mobile ? open === 1 : open === 0, mobile ? 'telefonda "Açıklamayı gör" kapalı' : 'masaüstünde açık');
  if (mobile) { await p.locator('#resultExplainBox .xp-summary').click(); }
  check(await p.locator('#resultExplainBox a.xp-alt-name').first().isVisible(), 'tanı adı kütüphane bağlantısı');
  await p.locator('#resultExplainBox').scrollIntoViewIfNeeded();
  await p.screenshot({ path: `${SHOTS}/xp_report_${vp.w}_${vp.dark ? 'koyu' : 'acik'}.png` });
  const ov = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  check(!ov, 'yatay taşma yok');
  // kapat, inline takeaway
  await p.evaluate(() => window.game.closeModal(window.game.dom.resultModal));
  check(await p.locator('#playResultTakeaway').isVisible(), 'oyun ekranında "Akılda kalsın" görünür');
  // bağlantı → kütüphane
  // arşivden rapor
  await p.evaluate((id) => { window.game.markCaseAsSolved(id); window.game.openArchiveModal(); }, caseId.id);
  await sleep(300);
  await p.locator('#solvedArchiveList .btn-archive-report').first().click();
  await sleep(800);
  check(await p.locator('#resultExplainBox').isVisible(), 'arşiv tekrar ziyaretinde açıklama');
  check((await p.locator('#resultExplainBox .is-mine').count()) === 0, 'arşivde "Senin tahminin" yok (tahmin kaydı yok)');
  await p.evaluate(() => window.game.closeModal(window.game.dom.resultModal));
  // alanı olmayan vaka
  await p.evaluate(() => { const g = window.game; const c = g.cases.find(x => !x.explanation); g.currentMode = 'practice'; g.startCase(c, 'Pratik'); g.giveUp(); });
  await sleep(800);
  check(await p.locator('#resultExplainBox').isHidden(), 'alanı olmayan vakada bölüm gizli');
  check(await p.locator('#playResultTakeaway').isHidden(), 'alanı olmayan vakada akılda kalsın gizli');
  if (vp.w === 390) {
    // kütüphane bağlantısı modal kapatıp sayfaya gider
    await p.evaluate(() => window.game.closeModal(window.game.dom.resultModal));
  }
  check(p._errors.length === 0, 'konsol hatası yok ' + p._errors.join(' | '));
  await c.close();
}
await b.close();
console.log(`SONUÇ ${check.oks || 0} ok / ${check.fails || 0} fail`);
