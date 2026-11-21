// Ajan B4: renk bulutu arka planı + kenar boşluğu Nöro'ları (js/ambiyans.js, css/ambiyans.css).
// Kontrast (zemindeki en kötü bulut rengine karşı, animasyonun 6 anında), Nöro yerleşimi/görünürlüğü, yürüme,
// hareket azaltma, gizli sekme, sınıf/online katmanı, telefonda yokluk, CPU karşılaştırması.
import { browser, ctx, page, check, sleep } from './lib.mjs';
const IDX = process.env.IDX || 'http://localhost:8899/index.html';
const b = await browser();

async function open(vp, theme, route, extra = {}) {
  const c = await ctx(b, { viewport: { width: vp[0], height: vp[1] }, theme, dark: theme === 'dark', mobile: vp[0] < 600, reduced: !!extra.reduced });
  await c.route(/supabase\.co/, r => r.abort());
  await c.addInitScript(() => { try { localStorage.setItem('psikovaka_onboarded', '1'); } catch (e) {} });
  const p = await page(c, `${vp[0]} ${theme} ${route}`);
  await p.goto(IDX + '#/' + route);
  await p.waitForFunction(() => window.game && window.PsikoVakaAmbiyans && document.querySelector('.amb-bg'));
  await sleep(500);
  return { c, p };
}
const st = (p) => p.evaluate(() => window.PsikoVakaAmbiyans.state());

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

// ---------- 2) kenar boşluğu Nöro'ları: yerleşim
for (const [vp, exp] of [[[1440, 900], 2], [[1920, 1080], 4], [[1280, 800], 2], [[1180, 800], 0], [[1024, 768], 0], [[390, 844], 0]]) {
  const { c, p } = await open(vp, 'dark', 'oyna');
  const s = await st(p);
  check(s.count === exp, `${vp[0]}px: ${exp} kenar Nöro'su (${s.count})`);
  if (s.count) {
    const geo = await p.evaluate(() => {
      const m = document.getElementById('appMain').getBoundingClientRect();
      const out = [];
      document.querySelectorAll('.amb-noro').forEach(n => {
        const r = n.getBoundingClientRect();
        const overlapMain = !(r.right <= m.left || r.left >= m.right);
        // altında tıklanabilir öğe var mı (Nöro katmanını yok sayarak)
        const pts = [[r.left + 4, r.top + 4], [r.right - 4, r.top + 4], [r.left + r.width / 2, r.top + r.height / 2], [r.left + 4, r.bottom - 4], [r.right - 4, r.bottom - 4]];
        const hit = pts.some(([x, y]) => document.elementsFromPoint(x, y).some(e => !e.closest('.amb-margin,.amb-bg') && e.closest('a,button,input,select,textarea,[role=button],[tabindex]:not([tabindex="-1"])')));
        out.push({ overlapMain, hit, inView: r.left >= 0 && r.right <= document.documentElement.clientWidth && r.bottom <= innerHeight, pe: getComputedStyle(n).pointerEvents });
      });
      return out;
    });
    check(geo.every(g => !g.overlapMain), `${vp[0]}px: hiçbir Nöro içerik sütununa girmiyor`);
    check(geo.every(g => !g.hit), `${vp[0]}px: hiçbir Nöro düğme/bağlantı örtmüyor`);
    check(geo.every(g => g.inView), `${vp[0]}px: Nöro'lar pencere içinde`);
    check(geo.every(g => g.pe === 'none'), `${vp[0]}px: pointer-events yok`);
  }
  const bgOk = await p.evaluate(() => { const bg = document.querySelector('.amb-bg'); const cs = getComputedStyle(bg); return { pe: cs.pointerEvents, z: cs.zIndex, pos: cs.position, blobs: [...bg.children].filter(x => getComputedStyle(x).display !== 'none').length, anim: getComputedStyle(bg.children[0]).animationName }; });
  check(bgOk.pe === 'none' && bgOk.z === '-1' && bgOk.pos === 'fixed', `${vp[0]}px: bulut katmanı sabit, en altta, tıklamayı geçirir`);
  check(bgOk.blobs === (vp[0] < 480 ? 2 : vp[0] < 768 ? 3 : 4) && bgOk.anim.startsWith('amb-drift'), `${vp[0]}px: ${bgOk.blobs} bulut, kayma animasyonu açık`);
  check(p._errors.length === 0, `${vp[0]}px: konsol hatası yok ${p._errors.join(' | ')}`);
  await c.close();
}

// ---------- 3) ekranlara göre görünürlük + yürüme + gizli sekme
{
  const { c, p } = await open([1440, 900], 'dark', 'oyna');
  for (const r of ['kutuphane', 'profil', 'ligler', 'oyna']) {
    await p.evaluate((r) => { location.hash = '#/' + r; }, r); await sleep(350);
    const s = await st(p);
    check(s.visible && s.count === 2 && !(await p.evaluate(() => document.querySelector('.amb-margin').hidden)), `#/${r}: kenar Nöro'ları görünür`);
  }
  await p.evaluate(() => { location.hash = '#/online'; }); await sleep(350);
  check(await p.evaluate(() => document.querySelector('.amb-margin').hidden), '#/online: kenar Nöro\'ları gizli');
  await p.evaluate(() => { location.hash = '#/oyna'; }); await sleep(350);
  // Vaka turu (pratik)
  await p.click('#btnStartPractice');
  await sleep(600);
  const playing = await p.evaluate(() => ({ playing: document.body.classList.contains('is-playing'), hidden: document.querySelector('.amb-margin').hidden, bgOp: getComputedStyle(document.querySelector('.amb-bg')).opacity }));
  if (playing.playing) {
    check(playing.hidden, 'vaka turu: kenar Nöro\'ları gizli');
    check(+playing.bgOp <= 0.6, `vaka turu: bulutlar daha soluk (opaklık ${playing.bgOp})`);
  } else check(false, 'vaka turu başlatılamadı (test)');
  await p.evaluate(() => { location.hash = '#/kutuphane'; }); await sleep(400);
  await p.evaluate(() => { location.hash = '#/oyna'; }); await sleep(400);
  check((await st(p)).visible, 'turdan çıkınca yeniden görünür');
  // Açık pencere (modal) ve sınıf / online katmanı sınıfları
  for (const cls of ['modal-open', 'sinif-open', 'ol-layer-open']) {
    await p.evaluate((cls) => document.body.classList.add(cls), cls); await sleep(120);
    const s = await p.evaluate(() => ({ h: document.querySelector('.amb-margin').hidden, bg: getComputedStyle(document.querySelector('.amb-bg')).display }));
    check(s.h, `body.${cls}: kenar Nöro'ları gizli`);
    if (cls !== 'modal-open') check(s.bg === 'none', `body.${cls}: bulut katmanı çizilmiyor (opak tam ekran katmanın altında)`);
    await p.evaluate((cls) => document.body.classList.remove(cls), cls); await sleep(120);
  }
  check((await st(p)).visible, 'katmanlar kapanınca yeniden görünür');
  // Yürüme: zorla bir adım; yürüyorsa yön + walking sınıfı + konum değişimi + bant içinde kalma
  let walked = false;
  for (let i = 0; i < 30 && !walked; i++) {
    const before = (await st(p)).noros[0];
    await p.evaluate(() => window.PsikoVakaAmbiyans._step(0));
    await sleep(60);
    const cls = await p.evaluate(() => document.querySelector('.amb-noro svg.nv').getAttribute('class'));
    if (/nv-walking/.test(cls)) {
      walked = true;
      await sleep(400);
      const s1 = (await st(p)).noros[0];
      const dir = s1.x > before.x ? 'right' : 'left';
      check(cls.includes('nv-f-' + dir), `yürüme: yürüme yönüne bakıyor (${dir})`);
      await sleep(1500);
      const mid = await p.evaluate(() => document.querySelector('.amb-noro').getBoundingClientRect().x);
      check(Math.abs(mid - before.x) > 2 && Math.abs(mid - before.x) < 60, `yürüme: yavaş ilerliyor (1.5 sn'de ${Math.abs(mid - before.x).toFixed(1)} px)`);
      const m = await p.evaluate(() => document.getElementById('appMain').getBoundingClientRect().left);
      check(s1.x >= 0 && s1.x + s1.size <= m, 'yürüme: hedef sol kenar boşluğunda');
      // gizli sekme: yürürken durur, animasyonlar duraklar
      await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
      await sleep(100);
      const hid = await p.evaluate(() => ({ html: document.documentElement.classList.contains('amb-hidden'), paused: document.querySelector('.amb-margin').classList.contains('nv-paused'), walking: !!document.querySelector('.amb-noro svg.nv-walking'), blob: getComputedStyle(document.querySelector('.amb-blob')).animationPlayState }));
      check(hid.html && hid.paused && !hid.walking && hid.blob === 'paused', 'gizli sekme: bulutlar ve Nöro\'lar duraklatıldı, yürüme kesildi');
      await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); });
      await sleep(150);
      const vis = await p.evaluate(() => ({ html: document.documentElement.classList.contains('amb-hidden'), paused: document.querySelector('.amb-margin').classList.contains('nv-paused') }));
      check(!vis.html && !vis.paused && (await st(p)).visible, 'sekme görünür: yeniden çalışıyor');
    }
  }
  check(walked, 'yürüme denendi');
  const k1 = await p.evaluate(() => [...document.querySelectorAll('.amb-noro svg')].map(s => s.getAttribute('data-nv')).join());
  // Kendi Nöro'su (giriş yapmış)
  const own = await p.evaluate(() => {
    const AV = window.PsikoVakaAvatar; const cfg = AV.randomConfig('b4-own');
    window.game.myAvatar = AV.normalize(cfg); document.body.classList.add('is-signed-in');
    window.PsikoVakaAmbiyans.refresh();
    const el = document.querySelector('.amb-noro[data-own="1"] svg.nv');
    const ref = document.createElement('div'); ref.innerHTML = AV.render(cfg, { size: 10 });
    return { n: document.querySelectorAll('.amb-noro[data-own="1"]').length, same: el && el.getAttribute('data-nv') === ref.firstChild.getAttribute('data-nv') };
  });
  check(own.n === 1 && own.same, 'giriş yapmış kullanıcı: bir kenar Nöro\'su onun Nöro\'su');
  // Oturum boyunca sabit rastgele Nöro'lar
  await p.reload(); await p.waitForFunction(() => window.PsikoVakaAmbiyans); await sleep(400);
  const k2 = await p.evaluate(() => [...document.querySelectorAll('.amb-noro svg')].map(s => s.getAttribute('data-nv')).join());
  check(k1 && k1 === k2, 'rastgele Nöro\'lar oturum boyunca aynı');
  check(p._errors.length === 0, 'konsol hatası yok ' + p._errors.join(' | '));
  await c.close();
}

// ---------- 4) hareket azaltma
{
  const { c, p } = await open([1440, 900], 'dark', 'oyna', { reduced: true });
  const r = await p.evaluate(() => ({ blob: getComputedStyle(document.querySelector('.amb-blob')).animationName, anim: !!document.querySelector('.amb-noro svg.nv-anim'), n: document.querySelectorAll('.amb-noro').length }));
  check(r.blob === 'none', 'hareket azaltma: bulutlar duruk');
  check(r.n === 2 && !r.anim, 'hareket azaltma: Nöro\'lar duruk pozda');
  await p.evaluate(() => window.PsikoVakaAmbiyans._step(0)); await sleep(50);
  // _step zorla çağrılsa bile kendiliğinden zamanlama yok; yürüme geçişi kapalı
  const tr = await p.evaluate(() => getComputedStyle(document.querySelector('.amb-noro')).transitionDuration);
  check(parseFloat(tr) < 0.01, `hareket azaltma: konum geçişi yok (${tr})`);
  await c.close();
}

// ---------- 5) CPU: ambiyans açık / kapalı (5 sn boşta, ana iş parçacığı süresi)
{
  const cpu = {};
  for (const on of [true, false]) {
    const { c, p } = await open([1920, 1080], 'dark', 'oyna');
    if (!on) await p.addStyleTag({ content: '.amb-bg,.amb-margin{display:none!important}' });
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
  check(cpu.on.layout - cpu.off.layout <= 15, `CPU: boşta ek yerleşim/stil hesabı seyrek (5 sn'de ${cpu.on.layout} / kapalıyken ${cpu.off.layout}; SVG Nöro animasyonları)`);
}

console.log('\nKONTRAST', JSON.stringify(results, null, 0));
console.log(`\nb4_ambiyans: ${check.oks || 0} ok, ${check.fails || 0} FAIL`);
await b.close();
process.exit(check.fails ? 1 : 0);
