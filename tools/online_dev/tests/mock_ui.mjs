// Sahte sunucuyla arayüz durumları: taşma, konsol hatası, ekran görüntüsü
import { browser, ctx, page, sleep, check } from './lib.mjs';
const URL = 'http://localhost:8899/tools/online_dev/harness.html?mock=1#/online';
const SC = (process.env.SC || 'hub,hub-empty,hub-error,lobby:2,lobby:4,lobby:8,lobby:8L,lobby:3/6,countdown,playing,hp-playing,result,hp-result,battle-result,bracket,bracket4,spectate,final,final-early,abandoned,missing,create').split(',');
const VP = (process.env.VP || '360,390,1440').split(',').map(Number);
const THEMES = (process.env.TH || 'dark,light').split(',');
const b = await browser();
for (const th of THEMES) for (const w of VP) {
  const c = await ctx(b, { viewport: { width: w, height: w > 1000 ? 900 : (w === 360 ? 740 : 844) }, mobile: w < 1000, theme: th });
  const p = await page(c, `${th}-${w}`);
  await p.goto(URL);
  await p.waitForFunction(() => window.olMock && window.PsikoVakaOnline.app && document.getElementById('onlineHubMount') && document.getElementById('onlineHubMount').dataset.state === 'ready', null, { timeout: 15000 });
  for (const sc of SC) {
    let [name, arg] = sc.split(':');
    const o = {};
    if (arg) { if (arg.endsWith('L')) { o.long = true; arg = arg.slice(0, -1); } if (arg.includes('/')) { const [a, bb] = arg.split('/'); o.present = +a; o.n = +bb; o.cap = +bb; } else o.n = +arg; }
    if (name === 'bracket4') { name = 'bracket'; o.cap = 4; o.round = 1; }
    if (name === 'final-early') { name = 'final'; o.early = true; o.n = 2; }
    if (name === 'final') o.n = o.n || 4;
    if (name === 'create') {
      await p.evaluate(() => { window.olMock.scenario('hub'); });
      await sleep(400);
      await p.click('[data-ol-hub="create"]');
      await p.click('.ol-opt:has(input[value="tournament"])');
    } else {
      await p.evaluate(([n, oo]) => window.olMock.scenario(n, oo), [name, o]);
    }
    await sleep(name === 'countdown' ? 700 : 900);
    const ov = await p.evaluate(() => {
      const W = window.innerWidth;
      const doc = document.scrollingElement.scrollWidth;
      const inner = document.getElementById('olLayerInner');
      const lw = inner && !document.getElementById('olLayer').hidden ? inner.scrollWidth : 0;
      const offenders = [];
      document.querySelectorAll('body *').forEach(el => { const r = el.getBoundingClientRect(); if (r.width && r.right > W + 1 && !el.closest('.ol-bracket-wrap,.ol-hud-opps,.ol-topbar-chips,.ol-lobby-tools,.icon-sprite,#olSprite,.toast-container,.clue-progress-tracker') && getComputedStyle(el).position !== 'fixed') offenders.push((el.id ? '#' + el.id : el.className && el.className.baseVal === undefined ? '.' + String(el.className).split(' ')[0] : el.tagName) + ':' + Math.round(r.right)); });
      return { W, doc, lw, offenders: offenders.slice(0, 6) };
    });
    const okw = ov.doc <= ov.W && ov.lw <= ov.W && !ov.offenders.length;
    check(okw, `${th} ${w} ${sc}: taşma yok ${okw ? '' : JSON.stringify(ov)}`);
    await p.screenshot({ path: `/tmp/mock/${th}_${w}_${sc.replace(/[:/]/g, '-')}.png`, fullPage: false });
    if (name === 'create') await p.keyboard.press('Escape');
  }
  check(!p._errors.length, `${th} ${w}: konsol hatası yok ${JSON.stringify(p._errors.slice(0, 3))}`);
  await c.close();
}
console.log(`SONUÇ ${check.oks || 0} ok, ${check.fails || 0} fail`);
await b.close();
