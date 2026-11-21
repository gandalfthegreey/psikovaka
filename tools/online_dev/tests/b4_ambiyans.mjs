// Ajan B4: renk bulutu arka planı (js/ambiyans.js, css/ambiyans.css). Kenar boşluğu Nöro'ları ve ana sayfa Nöro'su
// Emre isteğiyle kaldırıldı (2026-11-21): her ekranda yoklukları denetlenir.
// Kontrast (zemindeki en kötü bulut rengine karşı, animasyonun 6 anında), hareket azaltma, gizli sekme, sınıf/online katmanı, CPU.
import { browser, ctx, page, check, sleep } from './lib.mjs';
const IDX = process.env.IDX || 'http://localhost:8899/index.html';
const b = await browser();

async function open(vp, theme, route, extra = {}) {
  const c = await ctx(b, { viewport: { width: vp[0], height: vp[1] }, theme, dark: theme === 'dark', mobile: vp[0] < 600, reduced: !!extra.reduced });
  await c.route(/supabase\.co/, r => r.abort());
  await c.addInitScript(() => { try { localStorage.setItem('psikovaka_onboarded', '1'); } catch (e) {} });
  const p = await page(c, `${vp[0]} ${theme} ${route}`);
  await p.goto(IDX + '#/' + route);
  await p.waitForFunction(() => window.game && document.querySelector('.amb-bg'));
  await sleep(500);
  return { c, p };
}

// ---------- 1) kontrast
const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const results = [];
for (const [vp, theme, route] of [[[1440, 900], 'dark', 'oyna'], [[1440, 900], 'dark', 'kutuphane'], [[1920, 1080], 'dark', 'profil'], [[1440, 900], 'light', 'oyna'], [[1440, 900], 'light', 'kutuphane'], [[390, 844], 'dark', 'oyna'], [[390, 844], 'light', 'oyna']]) {
  const { c, p } = await open(vp, theme, route);
  const tag = `${vp[0]} ${theme} ${route}`;
  // Zemin üstündeki metinler: ata zincirinde opak/yarı opak zemin olmayan görünür metin öğeleri
  const texts = await p.evaluate(() => {
    const out = [];
    const parse = (s) => { const m = /rgba?\(([^)]+)\)/.exec(s); if (!m) return null; const a = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { rgb: a.slice(0, 3), a: a.length > 3 ? a[3] : 1 }; };
    const onBg = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); const bg = parse(cs.backgroundColor); if ((bg && bg.a > 0) || cs.backgroundImage !== 'none') return e.closest('.app-header') && e.classList.contains('app-header') ? 'header' : false; } return 'page'; };
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    while (w.nextNode()) {
      const t = w.currentNode; if (!t.textContent.trim()) continue;
      const el = t.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
      if (el.closest('.amb-bg,.amb-margin,svg,[hidden],script,style')) continue;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height || r.bottom < 0 || r.top > innerHeight) continue;
      const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
      const where = onBg(el); if (!where) continue;
      const col = parse(cs.color); if (!col) continue;
      out.push({ where, color: col.rgb, alpha: col.a, txt: t.textContent.trim().slice(0, 30), x: r.x, y: r.y, w: r.width, h: r.height });
    }
    return out;
  });
  // Bulut katmanını tek başına çek, 6 ayrı animasyon anında; en kötü (koyuda en açık / açıkta en koyu) zemin pikseli
  await p.addStyleTag({ content: 'body > *:not(.amb-bg){visibility:hidden!important} ' });
  let worst = null;
  const { PNG } = await import('/home/claude/rt/node_modules/pngjs/lib/png.js').catch(() => ({}));
  for (let k = 0; k < 6; k++) {
    await p.evaluate((k) => document.getAnimations().forEach(a => { if (a.animationName && a.animationName.startsWith('amb-')) { a.pause(); const d = a.effect.getComputedTiming().duration; a.currentTime = (d * 2) * k / 6; } }), k);
    await sleep(80);
    const buf = await p.screenshot();
    const px = await p.evaluate(async (b64) => { const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode(); const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height; const x = cv.getContext('2d'); x.drawImage(img, 0, 0); const d = x.getImageData(0, 0, cv.width, cv.height).data; let hi = [0, 0, 0], hiL = -1, lo = [255, 255, 255], loL = 1e9; for (let i = 0; i < d.length; i += 16) { const s = d[i] * 0.2126 + d[i + 1] * 0.7152 + d[i + 2] * 0.0722; if (s > hiL) { hiL = s; hi = [d[i], d[i + 1], d[i + 2]]; } if (s < loL) { loL = s; lo = [d[i], d[i + 1], d[i + 2]]; } } return { hi, lo }; }, buf.toString('base64'));
    const cand = theme === 'dark' ? px.hi : px.lo;
    if (!worst || (theme === 'dark' ? lum(cand) > lum(worst) : lum(cand) < lum(worst))) worst = cand;
  }
  const base = theme === 'dark' ? [0x0f, 0x11, 0x17] : [0xee, 0xf0, 0xf3];
  const header = worst.map((v, i) => Math.round(base[i] * 0.88 + v * 0.12));
  let min = 99, minT = null;
  for (const t of texts) {
    const bg = t.where === 'header' ? header : worst;
    const col = t.color.map((v, i) => Math.round(v * t.alpha + bg[i] * (1 - t.alpha)));
    const r = ratio(col, bg);
    if (r < min) { min = r; minT = t; }
  }
  results.push({ tag, worst, n: texts.length, min: +min.toFixed(2), minTxt: minT && minT.txt });
  check(texts.length > 0 && min >= 4.5, `${tag}: zemindeki ${texts.length} metnin en düşük kontrastı ${min.toFixed(2)} ≥ 4.5 (en kötü bulut rengi rgb(${worst}), en düşük: "${minT && minT.txt}")`);
  check(ratio(worst, base) < 1.25, `${tag}: bulut zemini en çok %${((ratio(worst, base) - 1) * 100).toFixed(1)} değiştiriyor (< %25)`);
  await c.close();
}

// ---------- 2) bulut katmanı + Nöro'suz ekranlar (kenar boşluğu Nöro'ları ve ana sayfa Nöro'su Emre isteğiyle kaldırıldı)
for (const vp of [[1920, 1080], [1440, 900], [1024, 768], [390, 844]]) {
  const { c, p } = await open(vp, 'dark', 'oyna');
  const bgOk = await p.evaluate(() => { const bg = document.querySelector('.amb-bg'); const cs = getComputedStyle(bg); return { pe: cs.pointerEvents, z: cs.zIndex, pos: cs.position, blobs: [...bg.children].filter(x => getComputedStyle(x).display !== 'none').length, anim: getComputedStyle(bg.children[0]).animationName }; });
  check(bgOk.pe === 'none' && bgOk.z === '-1' && bgOk.pos === 'fixed', `${vp[0]}px: bulut katmanı sabit, en altta, tıklamayı geçirir`);
  check(bgOk.blobs === (vp[0] < 480 ? 2 : vp[0] < 768 ? 3 : 4) && bgOk.anim.startsWith('amb-drift'), `${vp[0]}px: ${bgOk.blobs} bulut, kayma animasyonu açık`);
  for (const r of ['oyna', 'kutuphane', 'profil', 'ligler']) {
    await p.evaluate((r) => { location.hash = '#/' + r; }, r); await sleep(300);
    const n = await p.evaluate(() => ({ margin: document.querySelectorAll('.amb-margin,.amb-noro').length, home: [...document.querySelectorAll('#screenHome svg.nv')].filter(s => s.getBoundingClientRect().width > 0).length }));
    check(n.margin === 0 && n.home === 0, `${vp[0]}px #/${r}: kenar boşluğu Nöro'su yok${r === 'oyna' ? ', ana sayfada görünür Nöro yok' : ''}`);
  }
  check(p._errors.length === 0, `${vp[0]}px: konsol hatası yok ${p._errors.join(' | ')}`);
  await c.close();
}

// ---------- 3) vaka turu, tam ekran katmanlar, gizli sekme
{
  const { c, p } = await open([1440, 900], 'dark', 'oyna');
  await p.click('#btnStartPractice');
  await sleep(600);
  const playing = await p.evaluate(() => ({ playing: document.body.classList.contains('is-playing'), bgOp: getComputedStyle(document.querySelector('.amb-bg')).opacity }));
  check(playing.playing && +playing.bgOp <= 0.6, `vaka turu: bulutlar daha soluk (opaklık ${playing.bgOp})`);
  await p.evaluate(() => { location.hash = '#/kutuphane'; }); await sleep(400);
  for (const cls of ['sinif-open', 'ol-layer-open']) {
    await p.evaluate((cls) => document.body.classList.add(cls), cls); await sleep(120);
    check(await p.evaluate(() => getComputedStyle(document.querySelector('.amb-bg')).display === 'none'), `body.${cls}: bulut katmanı çizilmiyor (opak tam ekran katmanın altında)`);
    await p.evaluate((cls) => document.body.classList.remove(cls), cls); await sleep(120);
  }
  await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
  await sleep(100);
  check(await p.evaluate(() => document.documentElement.classList.contains('amb-hidden') && getComputedStyle(document.querySelector('.amb-blob')).animationPlayState === 'paused'), 'gizli sekme: bulutlar duraklatıldı');
  await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); });
  await sleep(100);
  check(await p.evaluate(() => !document.documentElement.classList.contains('amb-hidden') && getComputedStyle(document.querySelector('.amb-blob')).animationPlayState === 'running'), 'sekme görünür: bulutlar yeniden kayıyor');
  check(p._errors.length === 0, 'konsol hatası yok ' + p._errors.join(' | '));
  await c.close();
}

// ---------- 4) hareket azaltma
{
  const { c, p } = await open([1440, 900], 'dark', 'oyna', { reduced: true });
  check(await p.evaluate(() => getComputedStyle(document.querySelector('.amb-blob')).animationName) === 'none', 'hareket azaltma: bulutlar duruk');
  await c.close();
}

// ---------- 5) CPU: ambiyans açık / kapalı (5 sn boşta, ana iş parçacığı süresi)
{
  const cpu = {};
  for (const on of [true, false]) {
    const { c, p } = await open([1920, 1080], 'dark', 'oyna');
    if (!on) await p.addStyleTag({ content: '.amb-bg{display:none!important}' });
    const s = await c.newCDPSession(p);
    await s.send('Performance.enable');
    await sleep(500);
    const m0 = Object.fromEntries((await s.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]));
    await sleep(5000);
    const m1 = Object.fromEntries((await s.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]));
    cpu[on ? 'on' : 'off'] = { task: +(m1.TaskDuration - m0.TaskDuration).toFixed(3), layout: m1.LayoutCount - m0.LayoutCount, style: m1.RecalcStyleCount - m0.RecalcStyleCount };
    await c.close();
  }
  console.log('  CPU', JSON.stringify(cpu));
  check(cpu.on.task - cpu.off.task < 0.25, `CPU: 5 sn'de ek ana iş parçacığı süresi ${((cpu.on.task - cpu.off.task) * 1000).toFixed(0)} ms (< 250 ms)`);
  check(cpu.on.layout - cpu.off.layout <= 1, `CPU: boşta ek yerleşim yok (5 sn'de ${cpu.on.layout} / kapalıyken ${cpu.off.layout})`);
}

console.log('\nKONTRAST', JSON.stringify(results, null, 0));
console.log(`\nb4_ambiyans: ${check.oks || 0} ok, ${check.fails || 0} FAIL`);
await b.close();
process.exit(check.fails ? 1 : 0);
