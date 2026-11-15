// Ajan P: vaka BİTMEDEN ekranda kategori/ders/tanı adı sızıntısı yok (her modda 20 rastgele vaka).
// Denetlenen: görünür sayfa metni (ipuçları ve hasta özeti HARİÇ: onlar vaka verisi; ayrıca "veri" olarak raporlanır),
// document.title ve görünür öğelerin aria-label/title nitelikleri. Sayılar/kimlikler koda gömülü değil.
import { browser, ctx, page, check, sleep } from './lib.mjs';
const IDX = process.env.IDX || 'http://localhost:8899/index.html';
const HAR = process.env.HAR || 'http://localhost:8899/tools/online_dev/harness.html?mock=1';
const N = Number(process.env.N || 20);
const b = await browser();
const c = await ctx(b, { viewport: { width: 390, height: 844 } });

// Sayfada çalışan denetleyici
const AUDIT = () => {
  const g = window.game, cs = g.currentCase;
  const norm = (s) => g.libNorm(s);
  const cat = (g.categories[cs.category] || {}).name;
  const course = (typeof COURSE_CATEGORIES !== 'undefined' && COURSE_CATEGORIES[cs.course]) ? COURSE_CATEGORIES[cs.course].name : null;
  const d = g.diagnoses.find(x => x.id === cs.diagnosisId) || {};
  const terms = [['kategori', cat], ['ders', course], ['tanı', d.nameTr], ['tanı', d.nameEn]].concat((d.aliases || []).map(a => ['takma ad', a]))
    .filter(([, t]) => t && norm(t).length >= 4);
  const skip = new Set(['cluesContainer', 'patientSummaryText']);
  const vis = (el) => el.checkVisibility ? el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : !!(el.offsetWidth || el.getClientRects().length);
  const walk = (el, out) => { if (skip.has(el.id) || !vis(el)) return; for (const n of el.childNodes) { if (n.nodeType === 3) out.push(n.textContent); else if (n.nodeType === 1) walk(n, out); } };
  const parts = []; walk(document.body, parts);
  document.querySelectorAll('[aria-label],[title]').forEach(el => { if (vis(el) && !el.closest('#cluesContainer,#patientSummaryText')) parts.push(el.getAttribute('aria-label') || '', el.getAttribute('title') || ''); });
  parts.push(document.title);
  const ui = ' ' + norm(parts.join(' ')) + ' ';
  const dataTxt = ' ' + norm([document.getElementById('patientSummaryText')?.textContent || ''].join(' ')) + ' ';
  const hits = terms.filter(([, t]) => ui.includes(' ' + norm(t) + ' ')).map(([k, t]) => `${k}: ${t}`);
  const dataHits = terms.filter(([, t]) => dataTxt.includes(' ' + norm(t) + ' ')).map(([k, t]) => `${k}: ${t}`);
  return { id: cs.id, over: g.isGameOver, hits, dataHits };
};

let total = 0, bad = 0; const dataReport = new Set();
async function run(p, label, startFn) {
  let fails = 0;
  for (let i = 0; i < N; i++) {
    await p.evaluate(startFn, i);
    await sleep(120);
    const r = await p.evaluate(AUDIT);
    total++;
    if (r.over) { console.log('  ! vaka bitmiş başladı', label, r.id); continue; }
    if (r.hits.length) { fails++; bad++; console.log(`  SIZINTI ${label} ${r.id}: ${r.hits.join(', ')}`); }
    r.dataHits.forEach(h => dataReport.add(`${r.id} (${h})`));
  }
  check(fails === 0, `${label}: ${N} vakada arayüzde sızıntı yok`);
}

let p = await page(c, 'leak');
await p.goto(IDX + '#/oyna');
await p.waitForFunction(() => window.game && window.game.cases.length);
for (const t of ['diagnosis', 'therapy', 'pharmacology', 'combo']) {
  await p.evaluate((t) => window.game.setTargetGameMode(t, false), t);
  await run(p, `pratik/${t}`, () => { window.game.setMode('practice'); });
}
await p.evaluate(() => window.game.setTargetGameMode('diagnosis', false));
await run(p, 'pratik (kategori filtresi seçili)', () => { const g = window.game; const c = g.cases[Math.floor(Math.random() * g.cases.length)]; g.activeCategoryFilter = c.category; g.activeCourseFilter = 'ALL'; g.setMode('practice'); });
await p.evaluate(() => { window.game.activeCategoryFilter = 'ALL'; });
await run(p, 'günün vakası (yerel, farklı günler)', (i) => { const g = window.game; g.getDailySeed = () => `2026-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + i).padStart(2, '0')}`; g.setMode('daily'); });
await run(p, 'paketler', (i) => { const g = window.game; const packs = g.getBuiltInPacksDefinition().filter(x => x.count > 0 && x.id !== 'all'); const pk = packs[i % packs.length]; g.applyActivePack(pk.id, true); });
await p.evaluate(() => { const g = window.game; const all = g.getBuiltInPacksDefinition().find(x => x.id === 'all') || null; if (all) g.applyActivePack('all', false); else g.cases = g.allMasterCases.slice(); });
await run(p, 'arşivden tekrar çöz', () => { const g = window.game; const c = g.allMasterCases[Math.floor(Math.random() * g.allMasterCases.length)]; g.markCaseAsSolved(c.id); g.openArchiveModal(); const row = Array.from(document.querySelectorAll('#solvedArchiveList .row-item')).find(r => r.textContent.includes('#' + c.caseNumber + ' ')) || document.querySelector('#solvedArchiveList .row-item'); row.querySelector('.btn-archive-replay').click(); });
await run(p, 'paylaşılan bağlantı (#duel=)', () => { const g = window.game; const c = g.allMasterCases[Math.floor(Math.random() * g.allMasterCases.length)]; g.startDuelChallenge(c, { n: 'Arkadaş', s: 0, g: 3, t: 40 }); });
check(p._errors.length === 0, 'konsol temiz (index) ' + p._errors.join('|'));
await p.close();

// Sahte sunucu: online tur, hızlı eşleşme, sunucu günlüğü
p = await page(c, 'leakm');
await p.goto(HAR + '#/online');
await p.waitForFunction(() => window.olMock && window.game.cases.length);
await sleep(500);
await run(p, 'online tur', (i) => { const ids = window.game.allMasterCases.map(x => x.id); const st = { n: 2 }; window.olMock.scenario('playing', st); window.olMock.state.round.case_id = ids[Math.floor(Math.random() * ids.length)]; window.PsikoVakaOnline.rooms.refresh(); });
await sleep(400);
const stateRun = async (label, fn) => { await run(p, label, fn); };
await stateRun('online tur (vaka yüklendikten sonra)', async () => {});
await p.evaluate(() => window.PsikoVakaOnline.app.exitToHub());
check(p._errors.length === 0, 'konsol temiz (mock) ' + p._errors.join('|'));
await p.close();

// Sunucu günlüğü: farklı vakalar
p = await page(c, 'leakd');
await p.goto(HAR + '#/oyna');
await p.waitForFunction(() => window.olMock && window.PsikoVakaOnline.daily);
await sleep(400);
for (let i = 0; i < N; i++) {
  await p.evaluate(async (i) => { const ids = window.game.allMasterCases.map(x => x.id); window.olMock.set({ daily: 'on', dailyCase: ids[Math.floor(Math.random() * ids.length)] }); window.olMock.resetDaily(); window.PsikoVakaOnline.daily._reset(); if (window.game.currentScreen === 'play') window.game.leavePlayScreen(); window.game.setTargetGameMode('diagnosis', false); await window.game.loadDailyCase(); }, i);
  await sleep(250);
  const r = await p.evaluate(AUDIT); total++;
  if (r.hits.length) { bad++; console.log('  SIZINTI günlük(sunucu)', r.id, r.hits.join(', ')); }
  r.dataHits.forEach(h => dataReport.add(`${r.id} (${h})`));
}
check(true, `günlük (sunucu modu): ${N} vaka denendi`);
await p.close();
await b.close();
console.log(`toplam ${total} vaka başlangıcı, arayüz sızıntısı: ${bad}`);
console.log(`VERİ (hasta özeti) içinde ad geçen vakalar (ajan R için bilgi): ${[...dataReport].length}`); [...dataReport].slice(0, 40).forEach(x => console.log('   veri:', x));
console.log(`SONUÇ ${check.oks || 0} ok / ${check.fails || 0} fail`);
