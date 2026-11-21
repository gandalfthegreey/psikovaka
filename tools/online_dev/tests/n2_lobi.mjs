// N2: lobi terapi odası + yürüyen Nöro'lar. Sahte sunucu, İKİ (ve üç) istemci arası köprü:
// A'nın gönderdiği move/emote/say yayınları ve presence izi B'ye "ayse_klinik" (uid 2) adına iletilir.
import { browser, ctx, page, sleep, check } from './lib.mjs';
import fs from 'node:fs';
const URL = 'http://localhost:8899/tools/online_dev/harness.html?mock=1#/online';
const OUT = process.env.SHOTS || '/tmp/n2';
fs.mkdirSync(OUT, { recursive: true });
const U1 = '00000000-0000-4000-8000-000000000002';
const b = await browser();

async function client(label, opts = {}) {
  const c = await ctx(b, { viewport: opts.viewport || { width: 1440, height: 900 }, theme: opts.theme || 'dark', reduced: opts.reduced, mobile: opts.mobile });
  const p = await page(c, label);
  await p.goto(URL);
  await p.waitForFunction(() => window.olMock && document.getElementById('onlineHubMount').dataset.state === 'ready', null, { timeout: 15000 });
  await p.evaluate(() => {
    const RT = window.PsikoVakaOnline.realtime, orig = RT.joinRoom;
    window.__out = []; window.__pres = {};
    RT.joinRoom = (id, u, h) => { const hd = orig(id, u, h); window.__rt = h; return Object.assign({}, hd, {
      send: (ev, pl) => { window.__out.push(['b', ev, pl]); return true; },
      track: (meta) => { window.__out.push(['t', 'track', meta]); } }); };
  });
  await p.evaluate((n) => window.olMock.scenario('lobby', { n }), opts.n || 4);
  await p.waitForSelector('.ol-p.is-me');
  await sleep(500);
  return { c, p };
}
// A'nın çıkışlarını B'lere ilet (uid 2 adına)
async function pump(A, Bs) {
  const out = await A.p.evaluate(() => window.__out.splice(0));
  for (const [kind, ev, pl] of out) for (const B of Bs) {
    await B.p.evaluate(([kind, ev, pl, U1]) => {
      const q = Object.assign({}, pl, { user_id: U1 });
      if (kind === 'b') window.__rt.onBroadcast(ev, q);
      else { window.__pres[U1] = q; window.__rt.onPresence({ k: Object.values(window.__pres) }); }
    }, [kind, ev, pl, U1]);
  }
  return out;
}
const nodeState = (P, uid) => P.p.evaluate((uid) => {
  const NS = window.PsikoVakaOnline; const id = uid || NS.api.myId();
  const n = document.querySelector(`.ol-p[data-uid="${id}"]`); const s = NS.lobby.walker && NS.lobby.walker.get(id);
  return n && s ? { x: s.x, y: s.y, walking: s.walking, facing: s.facing, act: n.dataset.act || '', z: +n.style.zIndex, dx: +n.dataset.x, dy: +n.dataset.y, spot: n.dataset.spot,
    svg: n.querySelector('svg.nv').className.baseVal, tele: n.classList.contains('is-teleport') } : null;
}, uid);
async function tapStage(P, fx, fy) { const bb = await (await P.p.$('#olStage')).boundingBox(); await P.p.mouse.click(bb.x + bb.width * fx, bb.y + bb.height * fy); }

// ---------------------------------------------------------------- 1. iki istemci: yürüme
const A = await client('A'), B = await client('B', { theme: 'light' });
const room = await A.p.evaluate(() => { const r = window.PsikoVakaOnline.lobby.room; return { obstacles: r.layout.obstacles, objects: r.objects.map(o => o.id) }; });
check(room.objects.join(',') === 'shelf,couch,table,chair,fire,window', `oda nesneleri ${room.objects}`);
check(await A.p.evaluate(() => document.querySelectorAll('.olr-obj').length === 6 && [...document.querySelectorAll('.olr-obj')].every(b => b.getAttribute('aria-label'))), 'nesne düğmeleri etiketli (6)');
await sleep(300); await pump(A, [B]);            // ilk presence
const b0 = await nodeState(B, U1);
await tapStage(A, 0.7, 0.86);
await sleep(80);
const sent = await pump(A, [B]);
const mv = sent.find(x => x[1] === 'move');
check(mv && Math.abs(mv[2].x - 0.7) < 0.03 && !('act' in mv[2]), `A: yalnızca hedef yayınlandı ${JSON.stringify(mv && mv[2])}`);
const samples = [];
for (let i = 0; i < 40; i++) { const s = await nodeState(B, U1); samples.push(s); if (!s.walking && i > 3) break; await sleep(100); }
check(samples.some(s => s.walking), 'B: A\'nın Nöro\'su yürüdü (zıplamadı)');
check(samples.some(s => s.walking && /nv-walking/.test(s.svg) && /nv-f-(left|right)/.test(s.svg)), 'B: yürürken yan poz + adım sınıfı');
const last = samples[samples.length - 1];
await sleep(400);
check(Math.abs(last.x - 0.7) < 0.03 && !last.walking && /^nv nv-free/.test(last.svg) && !/nv-f-side/.test((await nodeState(B, U1)).svg), `B: hedefe vardı, öne döndü (${last.x.toFixed(3)})`);
const jumps = samples.slice(1).map((s, i) => Math.hypot((s.x - samples[i].x) * 1000, (s.y - samples[i].y) * 600));
check(Math.max(...jumps) < 25, `B: akıcı (100 ms'de en çok ${Math.max(...jumps).toFixed(1)} birim)`);
const dur = samples.filter(s => s.walking).length * 0.1;
const dist = Math.hypot((0.7 - b0.x) * 1000, (0.86 - b0.y) * 600);
check(dur > dist / 160 && dur < dist / 70 + 1, `süre mesafeyle orantılı (${dist.toFixed(0)} birim, ~${dur.toFixed(1)} sn)`);

// ---------------------------------------------------------------- 2. yolda yön değiştirme + engel
await tapStage(A, 0.2, 0.86); await sleep(60); await pump(A, [B]);
await sleep(700);
const mid = await nodeState(B, U1);
await tapStage(A, 0.62, 0.62); await sleep(60); await pump(A, [B]);
const s2 = [mid];
for (let i = 0; i < 60; i++) { const s = await nodeState(B, U1); s2.push(s); if (!s.walking && i > 3) break; await sleep(100); }
const j2 = s2.slice(1).map((s, i) => Math.hypot((s.x - s2[i].x) * 1000, (s.y - s2[i].y) * 600));
if (process.env.VERBOSE) console.log(s2.map(s => s.x.toFixed(3) + ',' + s.y.toFixed(3)).join(' '));
check(mid.walking && Math.max(...j2) < 25, `yolda yeni hedef: sıçramadan döndü (en çok ${Math.max(...j2).toFixed(1)})`);
const inside = (s) => room.obstacles.some(o => s.x > o.x0 && s.x < o.x1 && s.y > o.y0 && s.y < o.y1);
check(!s2.some(inside) && !samples.some(inside), 'yürüyüş hiçbir eşyanın içinden geçmedi');
const fin = s2[s2.length - 1];
check(Math.abs(fin.x - 0.62) < 0.05, `yeni hedefe vardı (${fin.x.toFixed(3)}, ${fin.y.toFixed(3)})`);
// engelin arkasına: kanepenin arkasına tıklama → yürünebilir en yakın nokta, A* yolu
const route = await A.p.evaluate(() => { const r = window.PsikoVakaOnline.lobby.room; const p = r.route({ x: 0.5, y: 0.88 }, { x: 0.79, y: 0.5 }); return { p, ok: p.every(q => r.free(q.x, q.y)) }; });
check(route.ok && route.p.length >= 1, `kanepenin arkasına yol: ${route.p.length} nokta, hepsi yürünebilir`);

// ---------------------------------------------------------------- 3. derinlik
const zs = await B.p.evaluate(() => [...document.querySelectorAll('.ol-p')].map(n => ({ z: +n.style.zIndex, y: parseFloat(n.style.transform.split(',')[1]) })));
check(zs.every(a => zs.every(c => (a.y < c.y - 2 ? a.z <= c.z : true))), 'derinlik: aşağıdaki Nöro önde (z-index y ile artar)');
const couchZ = await B.p.evaluate(() => +document.querySelector('.olr-item-couch').style.zIndex);

// ---------------------------------------------------------------- 4. nesne etkileşimi: kanepe → okuma (oturur)
await A.p.click('[data-olr-obj="couch"]'); await sleep(60);
const sc = await pump(A, [B]);
const mvc = sc.find(x => x[1] === 'move');
check(mvc && mvc[2].act === 'read' && /^couch\.\d$/.test(mvc[2].spot), `kanepe: move {act:read, spot:${mvc && mvc[2].spot}}`);
for (let i = 0; i < 80; i++) { const s = await nodeState(B, U1); if (s.act) break; await sleep(100); }
const sb = await nodeState(B, U1);
check(sb.act === 'read' && /nv-act-read/.test(sb.svg), 'B: A kanepede kitap okuyor');
check(sb.z > couchZ, `B: oturan Nöro kanepenin önünde çizili (z ${sb.z} > ${couchZ})`);
const sa = await nodeState(A);
check(sa.act === 'read', 'A: kendi Nöro\'m da okuyor');
await A.p.screenshot({ path: `${OUT}/iki_istemci_A_kanepe.png` }); await B.p.screenshot({ path: `${OUT}/iki_istemci_B_kanepe.png` });
// sehpa → çay, koltuk → kestirme, şömine → gerinme, pencere → düşünme, kitaplık → okuma
for (const [obj, act] of [['table', 'tea'], ['chair', 'doze'], ['fire', 'stretch'], ['window', 'think'], ['shelf', 'read']]) {
  await A.p.click(`[data-olr-obj="${obj}"]`); await sleep(60); await pump(A, [B]);
  let s; for (let i = 0; i < 90; i++) { s = await nodeState(B, U1); if (s.act === act && !s.walking) break; await sleep(100); }
  check(s.act === act, `${obj} → B'de ${act}`);
  if (obj === 'chair') { await B.p.screenshot({ path: `${OUT}/iki_istemci_B_koltuk.png` }); }
}
// ---------------------------------------------------------------- 5. duygu etkinliği bitirir; mesaj balonu
await A.p.click('[data-ol-emote="wave"]'); await sleep(80); await pump(A, [B]);
await sleep(300);
const se = await nodeState(B, U1);
check(se.act === '' && /nv-emote-wave/.test(se.svg), 'duygu: B\'de etkinlik bitti, el sallıyor');
check(await B.p.evaluate((u) => !document.querySelector(`.ol-p[data-uid="${u}"] .ol-p-bubble`).hidden, U1), 'duygu balonu görünür');
check((await nodeState(A)).act === '', 'A: kendi etkinliğim de bitti');
await sleep(2800);
await A.p.click('[data-ol-l="quick"]'); await A.p.click('[data-ol-say="gg"]'); await sleep(80); await pump(A, [B]);
check(await B.p.evaluate((u) => { const bb = document.querySelector(`.ol-p[data-uid="${u}"] .ol-p-bubble`); return !bb.hidden && bb.classList.contains('is-say'); }, U1), 'hazır mesaj balonu B\'de');

// ---------------------------------------------------------------- 6. eski istemci "hop" iletisi (act/spot yok)
const U2 = '00000000-0000-4000-8000-000000000003';
await B.p.evaluate((u) => window.__rt.onBroadcast('move', { user_id: u, x: 0.3, y: 0.86 }), U2);
await sleep(250);
const so = await nodeState(B, U2);
check(so.walking && Math.abs(so.dx - 0.3) < 0.001, 'eski istemcinin move iletisi: Nöro yürüyor');
// bilinmeyen act/spot yok sayılır
await B.p.evaluate((u) => window.__rt.onBroadcast('move', { user_id: u, x: 0.32, y: 0.86, act: 'dance<script>', spot: '../x' }), U2);
await sleep(200);
check(await B.p.evaluate((u) => { const pr = window.PsikoVakaOnline.rooms.presence[u]; return pr.act === null && pr.spot === null; }, U2), 'geçersiz act/spot yok sayıldı');

// ---------------------------------------------------------------- 7. geç gelen: konum + etkinlik anında
const C = await client('C', { viewport: { width: 390, height: 844 }, mobile: true, theme: 'light' });
await C.p.evaluate((u) => { window.__rt.onPresence({ k: [{ user_id: u, x: 0.4, y: 0.62, act: 'tea', spot: 'table', at: new Date().toISOString() }] }); }, U1);
await sleep(150);
const sl = await nodeState(C, U1);
check(sl && !sl.walking && sl.act === 'tea', `geç gelen: A sehpada çay içerken görünür, yürümeden (${JSON.stringify(sl && { act: sl.act, w: sl.walking })})`);
await C.p.screenshot({ path: `${OUT}/gec_gelen_390.png` });

// ---------------------------------------------------------------- 8. hareket azaltma: yürüme yok, solarak yer değiştirme
const R = await client('R', { reduced: true });
await tapStage(R, 0.6, 0.85); await sleep(120);
const sr = await nodeState(R);
check(!sr.walking && Math.abs(sr.x - 0.6) < 0.03 && sr.tele, 'hareket azaltma: anında yer değiştirme + solma');
const anim = await R.p.evaluate(() => { const f = document.querySelector('.olr-flame'); return getComputedStyle(f).animationName; });
check(anim === 'none', 'hareket azaltma: alevler durağan');
await R.p.click('[data-olr-obj="table"]'); await sleep(200);
const srt = await nodeState(R);
check(srt.act === 'tea' && await R.p.evaluate(() => getComputedStyle(document.querySelector('.ol-p.is-me .nv-sip')).animationName === 'none'), 'hareket azaltma: etkinlik durağan poz');

// ---------------------------------------------------------------- 9. sekme gizli: animasyonlar durur
await A.p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
const paused = await A.p.evaluate(() => document.getElementById('olStage').classList.contains('nv-paused') && getComputedStyle(document.querySelector('.olr-flame')).animationPlayState === 'paused');
check(paused, 'sekme gizli: oda ve Nöro animasyonları duraklatıldı');
await A.p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); });
check(await A.p.evaluate(() => !document.getElementById('olStage').classList.contains('nv-paused')), 'sekme görünür: yeniden başladı');

// ---------------------------------------------------------------- 10. klavye: nesne düğmeleri ve oklar
await A.p.focus('[data-olr-obj="shelf"]'); await A.p.keyboard.press('Enter'); await sleep(60);
const kb = await A.p.evaluate(() => window.__out.filter(x => x[1] === 'move').pop());
check(kb && kb[2].act === 'read' && kb[2].spot === 'shelf', 'klavye: "Kitaplığa git" Enter ile çalışır');
await A.p.focus('#olStage'); await A.p.keyboard.press('ArrowLeft'); await sleep(400);
check(await A.p.evaluate(() => window.__out.filter(x => x[1] === 'move').length >= 2), 'klavye: ok tuşu yürütür');
// hızlı eşleşme: nesne düğmeleri yok
await A.p.evaluate(() => { window.olMock.scenario('lobby', { n: 2 }); const s = window.olMock.state; s.room.is_quick = true; s.room.capacity = 2; window.PsikoVakaOnline.rooms.refresh(); });
await sleep(700);
check(await A.p.evaluate(() => { const o = document.querySelector('.olr-objs'); return !o || o.hidden; }), 'hızlı eşleşme: oda sade, nesne etkileşimi kapalı');

const errs = [A, B, C, R].flatMap(x => x.p._errors);
check(!errs.length, `konsol temiz ${JSON.stringify(errs.slice(0, 3))}`);
console.log(`SONUÇ ${check.oks || 0} ok, ${check.fails || 0} fail`);
await b.close();
