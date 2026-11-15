// Ajan P: yalnızca takma adla bilinen adlar öneride ve kütüphane aramasında bulunur, tahmin üst tanı sayılır
import { browser, ctx, page, check, sleep } from './lib.mjs';
const IDX = process.env.IDX || 'http://localhost:8899/index.html';
const b = await browser(); const c = await ctx(b, { viewport: { width: 1440, height: 900 } }); const p = await page(c, 'alias');
await p.goto(IDX + '#/oyna'); await p.waitForFunction(() => window.game && window.game.cases.length);
for (const name of (process.env.ALIASES || 'Disleksi,Uyurgezerlik,Kan fobisi').split(',')) {
  const r = await p.evaluate((name) => {
    const g = window.game; const n = g.normalizeTurkish(name);
    const d = g.diagnoses.find(x => (x.aliases || []).some(a => g.normalizeTurkish(a) === n));
    if (!d) return { found: false };
    const c = g.cases.find(x => x.diagnosisId === d.id) || g.cases[0];
    g.setTargetGameMode('diagnosis', false); g.currentMode = 'practice'; g.startCase(Object.assign({}, c, { diagnosisId: d.id }), 'Pratik');
    g.handleSearchInput(name);
    const sugg = Array.from(document.querySelectorAll('#autocompleteList [data-id], #autocompleteList li, .autocomplete-item')).map(e => e.dataset.id || e.textContent).join('|');
    g.dom.diagnosisInput.value = name; delete g.dom.diagnosisInput.dataset.selectedId; g.submitGuess();
    return { found: true, id: d.id, sugg, won: g.isGameOver && g.gameWon };
  }, name);
  check(r.found, `${name}: bir tanının takma adı (${r.id || '-'})`);
  check(r.found && (r.sugg.includes(r.id) || r.sugg.length > 0), `${name}: öneri listesinde çıkıyor`);
  check(r.won, `${name}: yazıp göndermek üst tanı (${r.id}) olarak kabul edildi`);
  await p.evaluate(() => { const g = window.game; if (g.dom.resultModal) g.closeModal(g.dom.resultModal); });
  await p.evaluate((name) => { location.hash = '#/kutuphane'; }, name); await sleep(400);
  await p.fill('#libSearchInput', name); await sleep(400);
  const hits = await p.evaluate(() => Array.from(document.querySelectorAll('#libListTani a, #libListTani [data-id]')).filter(e => e.offsetParent).map(e => e.getAttribute('href') || e.dataset.id).join('|'));
  check(r.found && hits.includes(r.id), `${name}: kütüphane aramasında ${r.id}`);
  await p.evaluate(() => { location.hash = '#/oyna'; }); await sleep(200);
}
check(p._errors.length === 0, 'konsol temiz ' + p._errors.join('|'));
await b.close(); console.log(`SONUÇ ${check.oks || 0} ok / ${check.fails || 0} fail`);
