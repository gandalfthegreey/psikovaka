// Ajan P: birleştirilmiş GERÇEK açıklama verisiyle rapor (whyNot'taki bir tanı tahmin edilince "Senin tahminin" üstte)
import { browser, ctx, page, check, sleep } from './lib.mjs';
const IDX = process.env.IDX || 'http://localhost:8899/index.html';
const SHOTS = process.env.SHOTS || '/home/claude/shots';
const b = await browser();
for (const vp of [{ w: 390, h: 844, dark: true }, { w: 1440, h: 900, dark: false }]) {
  const c = await ctx(b, { viewport: { width: vp.w, height: vp.h }, theme: vp.dark ? 'dark' : 'light', dark: vp.dark }); const p = await page(c, 'xr');
  await p.goto(IDX + '#/oyna'); await p.waitForFunction(() => window.game && window.game.cases.length);
  const r = await p.evaluate(() => { const g = window.game; const withX = g.cases.filter(c => c.explanation); const c = withX[Math.floor(Math.random() * withX.length)];
    g.setTargetGameMode('diagnosis', false); g.currentMode = 'practice'; g.startCase(c, 'Pratik');
    const w = c.explanation.whyNot[c.explanation.whyNot.length - 1].diagnosisId; const d = g.diagnoses.find(x => x.id === w);
    g.dom.diagnosisInput.value = d.nameTr; g.dom.diagnosisInput.dataset.selectedId = w; g.submitGuess(); g.giveUp(); return { n: withX.length, total: g.cases.length, w }; });
  await sleep(900);
  check(r.n === r.total, `tüm vakalarda açıklama var (${r.n}/${r.total})`);
  check(await p.locator('#resultExplainBox .xp-alt').first().evaluate(e => e.classList.contains('is-mine')), 'gerçek veride "Senin tahminin" üstte');
  if (vp.w < 768) await p.locator('#resultExplainBox .xp-summary').click();
  await p.locator('#resultExplainBox').scrollIntoViewIfNeeded();
  await p.screenshot({ path: `${SHOTS}/aciklama_gercek_${vp.w}_${vp.dark ? 'koyu' : 'acik'}.png` });
  check(p._errors.length === 0, 'konsol temiz'); await c.close();
}
await b.close(); console.log(`SONUÇ ${check.oks || 0} ok / ${check.fails || 0} fail`);
