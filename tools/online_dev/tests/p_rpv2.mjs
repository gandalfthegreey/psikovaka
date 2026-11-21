// Ajan P: RP v2 gösterimi (sahte sunucu): final dökümü, lig değişimi, eski sunucu (döküm yok), ayrılma uyarısı, tur sonucu açıklaması
import { browser, ctx, page, check, sleep } from './lib.mjs';
const HAR = process.env.HAR || 'http://localhost:8899/tools/online_dev/harness.html?mock=1';
const SHOTS = process.env.SHOTS || '/home/claude/shots';
const b = await browser();
for (const vp of [{ w: 360, h: 740, dark: true }, { w: 390, h: 844, dark: false }, { w: 1440, h: 900, dark: true }]) {
  const tag = `${vp.w}_${vp.dark ? 'koyu' : 'acik'}`;
  console.log('== ', tag);
  const c = await ctx(b, { viewport: { width: vp.w, height: vp.h }, theme: vp.dark ? 'dark' : 'light', dark: vp.dark, reduced: vp.w === 360 });
  const p = await page(c, 'rp');
  await p.goto(HAR + '#/online');
  await p.waitForFunction(() => window.olMock && window.PsikoVakaOnline.leaguesView);
  await sleep(600);
  // final v2: ben 2. (ffa, rp 495 → 510 = Bronz 3 → Gümüş 1)
  await p.evaluate(() => {
    window.olMock.scenario('final', { n: 4 });
    const st = window.olMock.state;
    st.results.forEach((r, i) => { r.rp_breakdown = { rounds: [{ round: 1, outcome: 'g2', delta: 8 }, { round: 2, outcome: 'fail', delta: -10 }, { round: 3, outcome: 'g1', delta: 10 }, { round: 4, outcome: 'g4', delta: 4 }, { round: 5, outcome: 'g6', delta: 1 }], placement: r.final_rank === 2 ? 5 : r.final_rank === 1 ? 15 : 0, voided: false, total: 0 }; });
    const me = st.results[0]; me.rp_delta = 18; me.rp_after = 510;
    st.results[3].rp_delta = -12; window.PsikoVakaOnline.rooms.refresh();
  });
  await p.waitForSelector('.ol-final-view');
  await sleep(500);
  check(await p.locator('.ol-league-change.is-up').isVisible() && /Yeni lig: Gümüş 1/.test(await p.locator('.ol-league-change').innerText()), 'lig yükseldi: Bronz 3 → Gümüş 1');
  check(await p.locator('.ol-rpbd').isVisible(), 'RP dökümü (açılır)');
  await p.locator('.ol-rpbd summary').click();
  const bd = await p.locator('.ol-rpbd').innerText();
  check(/Tur 2/.test(bd) && /−10/.test(bd) && /Sıralama primi/.test(bd) && /\+5/.test(bd), 'döküm: turlar + sıralama primi');
  check((await p.locator('.ol-res-rp.is-minus').count()) >= 1, 'eksi RP kırmızı (−12)');
  await p.screenshot({ path: `${SHOTS}/rpv2_final_${tag}.png`, fullPage: true });
  // lig düşüşü
  await p.evaluate(() => { const st = window.olMock.state; const me = st.results[0]; me.rp_delta = -20; me.rp_after = 490; window.PsikoVakaOnline.app.route(); window.PsikoVakaOnline.rooms.refresh(); });
  await sleep(500);
  check(/Lig düştü: Bronz 3/.test(await p.locator('.ol-view-body').innerText()), 'lig düştü: Gümüş 1 → Bronz 3');
  // eski sunucu: döküm yok
  await p.evaluate(() => { const st = window.olMock.state; st.results.forEach(r => { delete r.rp_breakdown; }); st.results[0].rp_delta = 20; st.results[0].rp_after = 780; window.PsikoVakaOnline.rooms.refresh(); });
  await sleep(500);
  check((await p.locator('.ol-rpbd').count()) === 0 && (await p.locator('.ol-league-change').count()) === 0, 'eski sunucu: döküm ve lig değişimi yok, sunucunun RP\'si gösterilir');
  check(/\+20 Elo/.test(await p.locator('.ol-res-list').innerText()), 'sunucunun bildirdiği +20 Elo');
  // ayrılma uyarısı: v2 config
  await p.evaluate(() => { window.olMock.scenario('playing', { n: 2 }); });
  await sleep(800);
  await p.evaluate(() => window.PsikoVakaOnline.leaguesView.loadConfig());
  await sleep(300);
  await p.evaluate(() => { window.PsikoVakaOnline.app.leaveRoom(); });
  await sleep(400);
  check(/kalan 4 tur çözülemedi sayılır: −40 Elo/.test(await p.locator('.ol-sheet').last().innerText()), 'ayrılma uyarısı: kalan turlar −10 Elo');
  await p.locator('.ol-sheet [data-ol-action="no"]').last().click(); await sleep(200);
  // tur sonucu: açıklama (tanı hedefi) ve sızıntı yok
  const xp = await p.evaluate(() => { const st = window.olMock.state; const c = window.game.allMasterCases.find(x => x.id === st.round.case_id); const others = window.game.diagnoses.filter(d => d.id !== c.diagnosisId).slice(0, 2); c.explanation = { whyThis: ['A', 'B'], whyNot: others.map(o => ({ diagnosisId: o.id, reason: 'neden ' + o.id })), teachingPoint: 'Ders' }; return { wrong: others[1].id }; });
  check((await p.locator('.ol-explain').count()) === 0 && (await p.locator('.xp').count()) === 0, 'tur sürerken açıklama yok');
  await p.evaluate(() => { const ids = window.game.allMasterCases.map(x => x.id); const c = window.game.allMasterCases.find(x => x.id === ids[11]); const others = window.game.diagnoses.filter(d => d.id !== c.diagnosisId).slice(0, 2); c.explanation = { whyThis: ['Ana neden bir', 'Ana neden iki'], whyNot: others.map(o => ({ diagnosisId: o.id, reason: 'Bu tanı değil çünkü örnek gerekçe.' })), teachingPoint: 'Öğretici nokta.' }; window.olMock.scenario('result', { n: 2, target: 'diagnosis', myGuesses: [{ stage: 1, guess_no: 1, item_id: others[1].id, is_correct: false, same_group: false }] }); });
  await sleep(700);
  check(await p.locator('.ol-explain').isVisible(), 'tur sonucu (sunucu kapattı): açıklama');
  check(await p.locator('.ol-explain .xp-alt').first().evaluate(e => e.classList.contains('is-mine')), 'tur sonucunda "Senin tahminin" üstte');
  check((await p.locator('.ol-explain a').count()) === 0, 'maç içinde kütüphane bağlantısı yok');
  if (vp.w < 768) await p.locator('.ol-explain .xp-summary').click();
  await p.screenshot({ path: `${SHOTS}/tur_sonucu_aciklama_${tag}.png` });
  await p.evaluate(() => { window.olMock.scenario('result', { n: 2, target: 'therapy' }); });
  await sleep(600);
  check((await p.locator('.ol-explain').count()) === 0, 'terapi turunda (tanı gösterilmiyor) açıklama yok');
  check(p._errors.length === 0, 'konsol temiz ' + p._errors.join('|'));
  await c.close();
}
await b.close();
console.log(`SONUÇ ${check.oks || 0} ok / ${check.fails || 0} fail`);
