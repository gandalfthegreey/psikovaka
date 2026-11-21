// Ajan D1: (1) Kütüphane bölümleri kapalı başlar + akordeon + arama açar/silince kapanır + doğrudan bağlantı;
// (2) lobi konuşma/duygu balonu ayrı üst katmanda (eşyaların ve Nöro'ların önünde, yürürken izler, kenarda kırpılmaz);
// (2b) "Mesaj" menüsü (Hazırım! …) odadaki eşyaların/Nöro'ların üstünde (sahne kendi yığın bağlamında);
// (3) durum çipi okunur (AA), 360×740'ta 8 kişide ad plakaları örtüşmez.
//   python3 -m http.server 8899 (depo kökünde) && node tools/online_dev/tests/d1_kutuphane_lobi.mjs
import { browser, ctx, page, sleep, check } from './lib.mjs';
const IDX = process.env.IDX || 'http://localhost:8899/index.html';
const HAR = 'http://localhost:8899/tools/online_dev/harness.html?mock=1#/online';
const b = await browser();

// ---------------------------------------------------------------- 1. Kütüphane
for (const vp of [{ w: 360, h: 740, th: 'light' }, { w: 1440, h: 900, th: 'dark' }]) {
  const c = await ctx(b, { viewport: { width: vp.w, height: vp.h }, theme: vp.th, dark: vp.th === 'dark', mobile: vp.w < 1000 });
  const p = await page(c, 'lib' + vp.w);
  await p.goto(IDX + '#/kutuphane');
  await p.waitForFunction(() => window.game && document.querySelector('#libListTani .lib-group'));
  const openOf = (list) => p.evaluate((l) => [...document.querySelectorAll(`#${l} .lib-group`)].filter(g => g.open).map(g => g.dataset.group), list);
  for (const l of ['libListTani', 'libListTerapi', 'libListIlac']) {
    const r = await p.evaluate((l) => { const gs = [...document.querySelectorAll(`#${l} .lib-group`)]; return { n: gs.length, open: gs.filter(g => g.open).length, counts: gs.every(g => /^\d+$/.test(g.querySelector('.lib-group-count').textContent) && g.querySelector('summary .visually-hidden')) }; }, l);
    check(r.n > 3 && r.open === 0 && r.counts, `${vp.w}: ${l} açılışta ${r.n} bölümün hepsi kapalı, sayılar görünür`);
  }
  const vis = await p.evaluate(() => [...document.querySelectorAll('#libListTani a.lib-row')].filter(a => a.checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true })).length);
  check(vis === 0, `${vp.w}: kapalıyken hiçbir madde görünmüyor`);
  await p.click('#libListTani .lib-group[data-group="MOOD"] summary'); await sleep(150);
  check((await openOf('libListTani')).join() === 'MOOD', `${vp.w}: tıklanan bölüm açıldı`);
  // gerçek kullanım: başlık ekrandayken tıklanır (yukarıdaki açık bölüm kapanınca başlık yerinde kalmalı)
  const y0 = await p.evaluate(() => { const h = document.querySelector('#libListTani .lib-group[data-group="SLEEP"] summary'); h.scrollIntoView({ block: 'center' }); return h.getBoundingClientRect().top; });
  await p.evaluate(() => document.querySelector('#libListTani .lib-group[data-group="SLEEP"] summary').click()); await sleep(200);
  const y1 = await p.evaluate(() => document.querySelector('#libListTani .lib-group[data-group="SLEEP"] summary').getBoundingClientRect().top);
  check((await openOf('libListTani')).join() === 'SLEEP', `${vp.w}: başka bölüm açılınca önceki kapandı (akordeon)`);
  const sy = await p.evaluate(() => scrollY);
  // yukarı yeterince kaydırılamıyorsa (sayfa başı) başlık en azından ekranda kalmalı
  check(Math.abs(y1 - y0) < 3 || (sy === 0 && y1 >= 0 && y1 < vp.h - 48), `${vp.w}: açılan başlık ekranda yerinde kaldı (${Math.round(y0)}→${Math.round(y1)}, scrollY ${sy})`);
  // klavye
  await p.focus('#libListTani .lib-group[data-group="ANXIETY"] summary'); await p.keyboard.press('Enter'); await sleep(150);
  check((await openOf('libListTani')).join() === 'ANXIETY', `${vp.w}: klavye Enter ile açılır, diğeri kapanır`);
  await p.keyboard.press('Enter'); await sleep(150);
  check((await openOf('libListTani')).length === 0, `${vp.w}: Enter ile yeniden kapanır`);
  // arama
  await p.fill('#libSearchInput', 'uyku'); await sleep(400);
  const so = await openOf('libListTani');
  const shownGroups = await p.evaluate(() => [...document.querySelectorAll('#libListTani .lib-group')].filter(g => !g.hidden).map(g => g.dataset.group));
  check(so.length >= 1 && so.join() === shownGroups.join() && so.includes('SLEEP'), `${vp.w}: aramada eşleşen bölümler açık (${so})`);
  await p.fill('#libSearchInput', ''); await sleep(400);
  check((await openOf('libListTani')).length === 0, `${vp.w}: arama silinince hepsi kapalı`);
  // terapiler sekmesi aynı düzen
  await p.evaluate(() => { location.hash = '#/kutuphane/terapiler'; }); await sleep(200);
  await p.evaluate(() => document.querySelector('#libListTerapi .lib-group:nth-child(2) summary').click()); await sleep(100);
  await p.evaluate(() => document.querySelector('#libListTerapi .lib-group:nth-child(3) summary').click()); await sleep(150);
  check((await openOf('libListTerapi')).length === 1, `${vp.w}: terapilerde de akordeon`);
  await c.close();
  // doğrudan bağlantı: yeni sekmede tanı sayfası, sonra İçindekiler'e dönüş → bölümü açık, odak satırda
  const c2 = await ctx(b, { viewport: { width: vp.w, height: vp.h }, theme: vp.th, dark: vp.th === 'dark', mobile: vp.w < 1000 });
  const p2 = await page(c2, 'deep' + vp.w);
  await p2.goto(IDX + '#/kutuphane/tani/ptsd');
  await p2.waitForFunction(() => window.game && document.getElementById('libDetailTitle'));
  check(await p2.evaluate(() => !document.getElementById('libDetail').hidden && /Travma|PTSD|Stres/i.test(document.getElementById('libDetailTitle').textContent)), `${vp.w}: doğrudan bağlantı tanı sayfasını açtı`);
  await p2.click('.lib-back'); await sleep(400);
  const back = await p2.evaluate(() => { const a = document.activeElement; const g = a && a.closest && a.closest('details.lib-group'); const r = a.getBoundingClientRect();
    return { href: a.getAttribute && a.getAttribute('href'), open: [...document.querySelectorAll('#libListTani .lib-group')].filter(x => x.open).map(x => x.dataset.group), grp: g && g.dataset.group, inView: r.top >= 0 && r.bottom <= innerHeight }; });
  check(back.href === '#/kutuphane/tani/ptsd' && back.open.length === 1 && back.open[0] === back.grp && back.inView, `${vp.w}: listeye dönünce maddenin bölümü açık, odak ve görünür ${JSON.stringify(back)}`);
  check(p._errors.length === 0 && p2._errors.length === 0, `${vp.w}: konsol temiz`);
  await c2.close();
}

// ---------------------------------------------------------------- 2-3. Lobi
function lum(c) { const m = c.match(/[\d.]+/g).map(Number); const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]); }
const ratio = (a, b2) => { const x = lum(a), y = lum(b2); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
async function lobby(label, vp, theme, n, mobile) {
  const c = await ctx(b, { viewport: vp, theme, mobile });
  const p = await page(c, label);
  await p.goto(HAR);
  await p.waitForFunction(() => window.olMock && document.getElementById('onlineHubMount').dataset.state === 'ready', null, { timeout: 15000 });
  await p.evaluate(() => { const RT = window.PsikoVakaOnline.realtime, orig = RT.joinRoom; RT.joinRoom = (id, u, h) => { const hd = orig(id, u, h); window.__rt = h; return Object.assign({}, hd, { send: () => true, track: () => {} }); }; });
  await p.evaluate((n) => window.olMock.scenario('lobby', { n }), n);
  await p.waitForSelector('.ol-p.is-me'); await sleep(600);
  return { c, p };
}
async function menuOnTop(p, label) {
  await p.click('[data-ol-l="quick"]'); await sleep(250);
  const r = await p.evaluate(() => [...document.querySelectorAll('#olQuickMenu button')].map(bt => { const rr = bt.getBoundingClientRect(); const e = document.elementFromPoint(rr.left + 12, rr.top + rr.height / 2); return e === bt || bt.contains(e); }));
  check(r.length === 4 && r.every(Boolean), `${label}: açık "Mesaj" menüsünün her satırı en üstte (eşya/Nöro örtmüyor) ${JSON.stringify(r)}`);
  await p.keyboard.press('Escape'); await sleep(100);
}
for (const theme of ['dark', 'light']) {
  const { c, p } = await lobby('lobi-' + theme, { width: 1440, height: 900 }, theme, 4);
  const other = await p.evaluate(() => { const me = window.PsikoVakaOnline.api.myId(); return window.PsikoVakaOnline.rooms.active().find(q => q.user_id !== me).user_id; });
  await menuOnTop(p, `1440 ${theme}`);
  // koltuğun arkasına yürüt, mesaj gönder
  const tgt = await p.evaluate((u) => { const r = window.PsikoVakaOnline.lobby.room; const it = r.layout.items.find(i => i.id === 'chair'); const t = r.nearestFree(it.x, it.base - 0.06); window.__rt.onBroadcast('move', { user_id: u, x: t.x, y: t.y }); return t; }, other);
  // yürürken balon izler
  await sleep(300);
  await p.evaluate((u) => window.__rt.onBroadcast('say', { user_id: u, key: 'ready' }), other);
  const track = [];
  for (let i = 0; i < 8; i++) { track.push(await p.evaluate((u) => { const n = document.querySelector(`.ol-p[data-uid="${u}"]`), bb = document.querySelector(`.ol-p-bubble[data-uid="${u}"]`); const a = n.querySelector('.ol-p-fig').getBoundingClientRect(), r = bb.getBoundingClientRect(); return { fx: a.left + a.width / 2, bx: r.left + r.width / 2, vis: !bb.hidden }; }, other)); await sleep(120); }
  check(track.every(t => t.vis && Math.abs(t.fx - t.bx) < 4) && Math.abs(track[0].fx - track[track.length - 1].fx) > 10, `${theme}: balon yürüyen Nöro'yu izliyor (${track.map(t => Math.round(t.fx - t.bx)).join(',')})`);
  await sleep(5500);
  await p.evaluate((u) => window.__rt.onBroadcast('say', { user_id: u, key: 'ready' }), other); await sleep(350);
  const z = await p.evaluate((u) => {
    const bb = document.querySelector(`.ol-p-bubble[data-uid="${u}"]`), layer = bb.parentElement, n = document.querySelector(`.ol-p[data-uid="${u}"]`);
    const chair = document.querySelector('.olr-item-chair');
    const maxItem = Math.max(...[...document.querySelectorAll('.olr-item, .ol-p, .olr-objs')].map(e => +getComputedStyle(e).zIndex || 0));
    const br = bb.getBoundingClientRect(), cr = chair.getBoundingClientRect(), st = document.getElementById('olStage').getBoundingClientRect();
    return { inNode: n.contains(bb), layerId: layer.id, layerZ: +getComputedStyle(layer).zIndex, maxItem, nodeZ: +n.style.zIndex, chairZ: +chair.style.zIndex,
      overlapsChair: (() => { const f = n.querySelector('.ol-p-fig').getBoundingClientRect(); return f.left < cr.right && f.right > cr.left && f.bottom > cr.top + 10; })(), inStage: br.left >= st.left && br.right <= st.right && br.top >= st.top, say: bb.classList.contains('is-say') && /Hazır/.test(bb.textContent) };
  }, other);
  check(!z.inNode && z.layerId === 'olBubbleLayer' && z.layerZ > z.maxItem, `${theme}: balon ayrı üst katmanda (z ${z.layerZ} > eşya/Nöro en çok ${z.maxItem})`);
  check(z.nodeZ < z.chairZ && z.overlapsChair && z.inStage && z.say, `${theme}: Nöro koltuğun arkasında (z ${z.nodeZ} < ${z.chairZ}), Nöro koltukla örtüşüyor, balon sahnede ${JSON.stringify(z)}`);
  if (theme === 'dark') await (await p.$('#olStage')).screenshot({ path: (process.env.SHOTS || '/tmp') + '/d1_balon_koltuk.png' });
  // kenar: sola dayanmış Nöro, duygu balonu kırpılmaz
  const u2 = await p.evaluate(() => window.PsikoVakaOnline.rooms.active()[3].user_id);
  await p.evaluate((u) => window.__rt.onBroadcast('move', { user_id: u, x: 0.96, y: 0.88 }), u2); await sleep(7000);
  await p.evaluate((u) => window.__rt.onBroadcast('say', { user_id: u, key: 'go' }), u2); await sleep(350);
  const e = await p.evaluate((u) => { const bb = document.querySelector(`.ol-p-bubble[data-uid="${u}"]`).getBoundingClientRect(), st = document.getElementById('olStage').getBoundingClientRect(); return { r: bb.right, sr: st.right, l: bb.left, sl: st.left }; }, u2);
  check(e.r <= e.sr - 2 && e.l >= e.sl, `${theme}: kenardaki balon sahnenin içinde (${Math.round(e.r)} ≤ ${Math.round(e.sr)})`);
  // durum çipi kontrastı
  const cs = await p.evaluate(() => [...document.querySelectorAll('.ol-p-state')].map(s => { const g = getComputedStyle(s); return { t: s.textContent.trim(), c: g.color, bg: g.backgroundColor, pad: parseFloat(g.paddingLeft) }; }));
  const bad = cs.filter(s => !/rgba?\(/.test(s.bg) || /rgba\([^)]*,\s*0(\.\d+)?\)$/.test(s.bg) && !/, 1\)$/.test(s.bg) || ratio(s.c, s.bg) < 4.5);
  check(cs.length === 4 && bad.length === 0 && cs.every(s => s.pad > 0), `${theme}: durum çipleri opak zeminli, kontrast ≥ 4.5 (${cs.map(s => s.t + ' ' + ratio(s.c, s.bg).toFixed(1)).join(', ')})`);
  check(p._errors.length === 0, `${theme}: konsol temiz`);
  await c.close();
}
// telefon 360×740, 8 kişi: ad plakaları örtüşmez
for (const theme of ['dark', 'light']) {
  const { c, p } = await lobby('tel8-' + theme, { width: 360, height: 740 }, theme, 8, true);
  await sleep(400);
  await menuOnTop(p, `360 ${theme} 8 kişi`);
  const r = await p.evaluate(() => {
    const plates = [...document.querySelectorAll('.ol-p .ol-p-plate')].map(e => e.getBoundingClientRect());
    const figs = [...document.querySelectorAll('.ol-p .ol-p-fig')].map(e => e.getBoundingClientRect());
    const st = document.getElementById('olStage').getBoundingClientRect();
    const ov = (a, c2, k = 0) => a.left < c2.right - k && a.right > c2.left + k && a.top < c2.bottom - k && a.bottom > c2.top + k;
    let pp = 0, pf = 0, out = 0;
    plates.forEach((a, i) => { plates.forEach((c2, j) => { if (j > i && ov(a, c2)) pp++; }); figs.forEach((f, j) => { if (j !== i && ov(a, f, 8)) pf++; }); if (a.left < st.left - 1 || a.right > st.right + 1) out++; });
    return { n: plates.length, pp, pf, out };
  });
  check(r.n === 8 && r.pp === 0 && r.pf === 0 && r.out === 0, `360×740 ${theme} 8 kişi: plakalar birbirine/başlara binmiyor, sahnede ${JSON.stringify(r)}`);
  check(p._errors.length === 0, `tel8 ${theme}: konsol temiz`);
  await c.close();
}
await b.close();
console.log(`SONUÇ ${check.oks || 0} ok, ${check.fails || 0} fail`);
