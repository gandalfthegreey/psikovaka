// Ajan P: hızlı eşleşme (sahte sunucu): hemen bulundu, bekledikten sonra bulundu, zaman aşımı, vazgeç, yenileme, zaten odada, RPC yok
import { browser, ctx, page, check, sleep } from './lib.mjs';
const HAR = process.env.HAR || 'http://localhost:8899/tools/online_dev/harness.html?mock=1';
const SHOTS = process.env.SHOTS || '/home/claude/shots';
const b = await browser();
async function hub(c, opt, persist) {
  const p = await page(c, 'q');
  if (persist) await p.addInitScript(() => sessionStorage.setItem('olMockPersist', '1'));
  await p.goto(HAR + '#/online');
  await p.waitForFunction(() => window.olMock && window.PsikoVakaOnline.quick);
  await p.evaluate((o) => { window.olMock.set(o); window.PsikoVakaOnline.quick.reset(); window.PsikoVakaOnline.hub.render(); }, opt || {});
  await sleep(400);
  return p;
}
for (const vp of [{ w: 360, h: 740, dark: true }, { w: 390, h: 844, dark: false }, { w: 1440, h: 900, dark: true }]) {
  const tag = `${vp.w}_${vp.dark ? 'koyu' : 'acik'}`;
  console.log('== ', tag);
  const c = await ctx(b, { viewport: { width: vp.w, height: vp.h }, theme: vp.dark ? 'dark' : 'light', dark: vp.dark });
  // 1) kart + bekleyerek bulundu
  let p = await hub(c, { quick: 'wait', waitedMs: 12000 });
  check(await p.locator('#olQuick').isVisible(), 'Hızlı eşleş kartı görünür');
  const order = await p.evaluate(() => { const q = document.getElementById('olQuick'), o = document.querySelector('[data-ol-hub="create"]'); return !!(q.compareDocumentPosition(o) & Node.DOCUMENT_POSITION_FOLLOWING); });
  check(order, 'kart "Oda kur"un üstünde');
  check(await p.locator('#olQuick input[name="qtarget"][value="diagnosis"]').isChecked(), 'varsayılan hedef Tanı');
  if (vp.w !== 1440) await p.screenshot({ path: `${SHOTS}/hizli_kart_${tag}.png` });
  await p.locator('#olQuick label.ol-qmode:has(input[value="ffa"])').click();
  await p.locator('#olQuick [data-ol-q="go"]').click();
  await p.waitForSelector('.ol-lobby.is-quick', { timeout: 5000 });
  await sleep(1300);
  check(await p.locator('#olSearch').isVisible(), 'arama ekranı');
  check(/1\/4 oyuncu · 3 kişi aranıyor/.test(await p.locator('#olSearchTitle').innerText()), 'FFA: 1/4 · 3 kişi aranıyor');
  check(/^0:1[2-9]$/.test(await p.locator('#olSearchTime').innerText()), 'geçen süre sayıyor: ' + await p.locator('#olSearchTime').innerText());
  check(await p.locator('#olLobbyTools').isHidden(), 'davet/ayar araçları gizli');
  check((await p.locator('[data-ol-l="ready"], [data-ol-l="start"]').count()) === 0, 'hazır/başlat yok');
  check(await p.locator('.ol-topbar-side').isHidden(), 'oda kodu gizli');
  check((await p.locator('.ol-slot').count()) === 3, '3 boş yer');
  check(await p.locator('[data-ol-l="leave"].ol-cancel-btn').isVisible(), 'Vazgeç düğmesi');
  await p.screenshot({ path: `${SHOTS}/hizli_arama_${tag}.png` });
  await p.evaluate(() => { window.olMock.addPlayer(1); });
  await sleep(500);
  check(/2\/4/.test(await p.locator('#olSearchTitle').innerText()), 'katılan oyuncu sayıya yansır');
  await p.evaluate(() => { window.olMock.addPlayer(2); window.olMock.addPlayer(3); });
  await p.waitForSelector('.ol-count-view', { timeout: 5000 }).catch(() => {});
  check(await p.locator('.ol-count-view').isVisible(), 'oda dolunca geri sayım (hazır adımı yok)');
  await p.waitForFunction(() => window.PsikoVakaOnline.app.view === 'play', null, { timeout: 8000 }).catch(() => {});
  check(await p.evaluate(() => window.PsikoVakaOnline.app.view === 'play'), 'maç başladı (oyun ekranı)');
  check(p._errors.length === 0, 'konsol temiz ' + p._errors.join('|'));
  await p.close();
  // 2) hemen bulundu + final "Tekrar eşleş"
  p = await hub(c, { quick: 'found' });
  await p.locator('#olQuick [data-ol-q="go"]').click();
  await p.waitForSelector('.ol-count-view', { timeout: 5000 }).catch(() => {});
  check(await p.locator('.ol-count-view').isVisible(), 'hemen bulundu → doğrudan geri sayım');
  await p.evaluate(() => { const st = window.olMock.state; st.room.status = 'finished'; st.round = null; st.results = st.players.map((x, i) => ({ room_id: 'mock-room', user_id: x.user_id, final_rank: i + 1, total_score: 200 - i * 50, rp_delta: i ? -10 : 18, rp_after: 300, left_early: false })); window.PsikoVakaOnline.rooms.refresh(); });
  await p.waitForSelector('.ol-final-view', { timeout: 4000 });
  check((await p.locator('[data-ol-v="quick-again"]').count()) === 1 && (await p.locator('[data-ol-v="rematch"]').count()) === 0, 'final: "Tekrar eşleş" (Lobiye dön yok)');
  await p.close();
  // 3) zaman aşımı
  p = await hub(c, { quick: 'wait', quickTimeout: false });
  await p.locator('#olQuick [data-ol-q="go"]').click();
  await p.waitForSelector('.ol-lobby.is-quick');
  await p.evaluate(() => { window.olMock.set({ quickTimeout: true }); window.PsikoVakaOnline.rooms.beat(); });
  await p.waitForSelector('[data-ol-v="quick-again"]', { timeout: 5000 }).catch(() => {});
  const t = await p.locator('#olLayer').innerText();
  check(/Şu an kimse yok/.test(t) && /Tekrar dene/.test(t) && /Oda kur/.test(t) && /Arkadaş davet et/.test(t), 'QUICK_TIMEOUT: "Şu an kimse yok" + 3 seçenek');
  await p.screenshot({ path: `${SHOTS}/hizli_zamanasimi_${tag}.png` });
  await p.evaluate(() => window.olMock.set({ quickTimeout: false }));
  await p.locator('[data-ol-v="quick-again"]').click();
  await p.waitForSelector('.ol-lobby.is-quick', { timeout: 5000 }).catch(() => {});
  check(await p.locator('.ol-lobby.is-quick').isVisible(), '"Tekrar dene" yeniden arar');
  // 4) vazgeç
  const before = await p.evaluate(() => window.olMock.left);
  await p.locator('[data-ol-l="leave"].ol-cancel-btn').click();
  await sleep(500);
  check((await p.evaluate(() => window.olMock.left)) === before + 1, 'Vazgeç → leave_room');
  check(await p.locator('#olLayer').isHidden() && await p.locator('#olQuick').isVisible(), 'merkeze dönüldü');
  await p.close();
  // 5) zaten odada
  p = await hub(c, { quick: 'already' });
  await p.locator('#olQuick [data-ol-q="go"]').click();
  await sleep(400);
  check(/Zaten bir odadasın/.test(await p.locator('.ol-sheet').innerText()) && /K7M2QX/.test(await p.locator('.ol-sheet').innerText()), 'ALREADY_IN_ROOM: oda koduyla "Odaya dön"');
  await p.close();
  // 6) RPC yok → kart gizli
  p = await hub(c, { quick: 'unsupported' });
  check(await p.locator('#olQuick').isHidden(), 'quick_match yok → kart gizli');
  check(p._errors.length === 0, 'konsol temiz ' + p._errors.join('|'));
  await p.close();
  // 7) aramadayken yenileme
  if (vp.w === 390) {
    p = await hub(c, { quick: 'wait' }, true);
    await p.locator('#olQuick [data-ol-q="go"]').click();
    await p.waitForSelector('.ol-lobby.is-quick');
    await p.reload();
    await p.waitForSelector('.ol-lobby.is-quick', { timeout: 8000 }).catch(() => {});
    check(await p.locator('.ol-lobby.is-quick').isVisible(), 'yenilemede arama ekranı geri geldi');
    await p.evaluate(() => sessionStorage.removeItem('olMockPersist'));
    await p.close();
  }
  await c.close();
}
await b.close();
console.log(`SONUÇ ${check.oks || 0} ok / ${check.fails || 0} fail`);
