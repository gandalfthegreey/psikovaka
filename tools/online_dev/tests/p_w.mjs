// Ajan W: canlı testten çıkan istemci hataları (sahte sunucu)
//  1) maç sonrası RP/lig tazelenmesi  2) hızlı oda iki olayla kapanınca "Şu an kimse yok"
//  3) ayrılma uyarısı tutarları       4) arkadaş listesi kaçan olay / yeniden bağlanma
import { browser, ctx, page, check, sleep } from './lib.mjs';
const HAR = process.env.HAR || 'http://localhost:8899/tools/online_dev/harness.html?mock=1';
const b = await browser();
const c = await ctx(b, { viewport: { width: 390, height: 844 }, theme: 'dark' });
async function open(opt) {
  const p = await page(c, 'w');
  await p.goto(HAR + '#/online');
  await p.waitForFunction(() => window.olMock && window.PsikoVakaOnline.leaguesView && window.PsikoVakaOnline.app);
  await sleep(500);
  if (opt) await p.evaluate((o) => window.olMock.set(o), opt);
  return p;
}
const txt = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); return e ? e.textContent.trim() : null; }, sel);

console.log('== 1) maç sonrası RP / lig');
{
  const p = await open();
  await p.evaluate(() => window.olMock.setRp(495, 513));
  await sleep(300);
  check((await txt(p, '#homeRpMount')) === '495 Elo', 'başlangıç: ana sayfa hapı 495 Elo (' + await txt(p, '#homeRpMount') + ')');
  await p.evaluate(() => {
    window.olMock.scenario('final', { n: 4 });
    const st = window.olMock.state; const me = st.results[0]; me.rp_delta = 18; me.rp_after = 513;
    window.PsikoVakaOnline.rooms.refresh();
  });
  await p.waitForSelector('.ol-final-view');
  await sleep(900);
  check(/Yeni lig: Gümüş 1/.test(await p.locator('.ol-league-change').innerText()) && /Bronz 3\s*→\s*Gümüş 1/.test(await p.locator('.ol-lc-sub').innerText()), 'podyum: lig değişimi maç sonucundan (Bronz 3 → Gümüş 1)');
  check((await p.evaluate(() => window.olMock.refreshCalls)) >= 1, 'final görününce profil tazelendi');
  check((await txt(p, '#homeRpMount')) === '513 Elo', 'ana sayfa hapı 513 Elo (' + await txt(p, '#homeRpMount') + ')');
  check(/Gümüş 1/.test(await p.locator('.ol-league-change').innerText()), 'tazelemeden sonra da podyum değişmedi');
  // başlık hapı (avatar + ad; RP yok): ad/aria bozulmadı
  check(/@sen_buradasin/.test(await p.evaluate(() => document.getElementById('navProfileChip').getAttribute('aria-label'))), 'başlık hapı sağlam');
  // çıkışta bir kez daha tazele
  await p.evaluate(() => window.olMock.setRp(null, 530));
  await p.locator('[data-ol-v="exit"]').first().click();
  await sleep(600);
  check((await txt(p, '#homeRpMount')) === '530 Elo', 'hub\'a dönünce yeniden tazelendi: 530 Elo (' + await txt(p, '#homeRpMount') + ')');
  await p.evaluate(() => { location.hash = '#/profil'; });
  await sleep(500);
  check((await txt(p, '#headerPlayerRpMount')) === '530 Elo' && (await txt(p, '#profileTierLabel')) === 'Gümüş 1', 'Profil: 530 Elo · Gümüş 1 (' + await txt(p, '#headerPlayerRpMount') + ' ' + await txt(p, '#profileTierLabel') + ')');
  await p.evaluate(() => { location.hash = '#/ligler'; });
  await sleep(800);
  check(/530 Elo/.test(await txt(p, '.lg-head-rp') || '') && /Gümüş 1/.test(await txt(p, '.lg-head-title') || ''), '#/ligler: 530 Elo · Gümüş 1 (' + await txt(p, '.lg-head-rp') + ' ' + await txt(p, '.lg-head-title') + ')');
  check(p._errors.length === 0, 'konsol temiz ' + p._errors.join('|'));
  await p.close();
}

console.log('== 2) hızlı oda: iki ayrı olay');
{
  const p = await open({ quick: 'wait', quickTimeout: false });
  await p.evaluate(() => { window.PsikoVakaOnline.quick.reset(); window.PsikoVakaOnline.hub.render(); });
  await sleep(300);
  await p.locator('#olQuick [data-ol-q="go"]').click();
  await p.waitForSelector('.ol-lobby.is-quick');
  // olay 1: durum abandoned, close_reason henüz yok
  await p.evaluate(() => window.olMock.emitRoomChange({ status: 'abandoned', close_reason: null }));
  await sleep(700);
  let t = await p.locator('#olLayer').innerText();
  check(/Şu an kimse yok/.test(t), 'olay 1 (close_reason yok): "Şu an kimse yok"');
  // olay 2: close_reason geldi
  await p.evaluate(() => window.olMock.emitRoomChange({ close_reason: 'quick_timeout' }));
  await sleep(700);
  t = await p.locator('#olLayer').innerText();
  check(/Şu an kimse yok/.test(t) && !/Oda kapandı/.test(t), 'olay 2 sonrası da zaman aşımı ekranı');
  check(/Tekrar dene/.test(t) && /Oda kur/.test(t) && /Arkadaş davet et/.test(t), 'üç seçenek: Tekrar dene / Oda kur / Arkadaş davet et');
  await p.evaluate(() => window.olMock.set({ quickTimeout: false }));
  if (await p.locator('[data-ol-v="quick-again"]').count()) await p.locator('[data-ol-v="quick-again"]').click();
  await p.waitForSelector('.ol-lobby.is-quick', { timeout: 5000 }).catch(() => {});
  check(await p.locator('.ol-lobby.is-quick').isVisible(), '"Tekrar dene" yeniden arar');
  // başka kapanma nedeni: genel ekran
  await p.evaluate(() => window.olMock.emitRoomChange({ status: 'abandoned', close_reason: 'idle' }));
  await sleep(700);
  t = await p.locator('#olLayer').innerText();
  check(/Oda kapandı/.test(t) && !/Şu an kimse yok/.test(t), 'başka close_reason: genel "Oda kapandı"');
  await p.close();
  // kalp atışı QUICK_TIMEOUT yolu
  const q = await open({ quick: 'wait', quickTimeout: false });
  await q.evaluate(() => { window.PsikoVakaOnline.quick.reset(); window.PsikoVakaOnline.hub.render(); });
  await sleep(300);
  await q.locator('#olQuick [data-ol-q="go"]').click();
  await q.waitForSelector('.ol-lobby.is-quick');
  await q.evaluate(() => { window.olMock.set({ quickTimeout: true }); window.PsikoVakaOnline.rooms.beat(); });
  await q.waitForSelector('[data-ol-v="quick-again"]', { timeout: 5000 }).catch(() => {});
  t = await q.locator('#olLayer').innerText();
  check(/Şu an kimse yok/.test(t) && /Tekrar dene/.test(t) && /Oda kur/.test(t) && /Arkadaş davet et/.test(t), 'heartbeat QUICK_TIMEOUT yolu: ekran + 3 seçenek');
  check(q._errors.length === 0, 'konsol temiz ' + q._errors.join('|'));
  await q.close();
}

console.log('== 3) ayrılma uyarısı');
{
  const p = await open();
  await p.evaluate(() => window.PsikoVakaOnline.leaguesView.loadConfig());
  await sleep(300);
  async function warn(setup, label) {
    await p.evaluate(setup);
    await sleep(400);
    await p.evaluate(() => window.PsikoVakaOnline.rooms.refresh());
    await sleep(700);
    await p.evaluate(() => { window.PsikoVakaOnline.app.leaveRoom(); });
    await sleep(350);
    const t = await p.locator('.ol-sheet').last().innerText();
    await p.locator('.ol-sheet [data-ol-action="no"]').last().click();
    await sleep(250);
    console.log('   [' + label + '] ' + t.replace(/\s+/g, ' ').slice(0, 170));
    return t;
  }
  let t = await warn(() => window.olMock.scenario('playing', { n: 2 }), 'düello tur 2/5, bitirmedim');
  check(/kalan 4 tur çözülemedi sayılır: −40 Elo/.test(t), 'tur ortası (rounds): kalan 4 tur −40 Elo');
  t = await warn(() => {
    window.olMock.scenario('playing', { n: 2 });
    const st = window.olMock.state; st.room.current_round = 5; st.round.round_no = 5;
    st.round_players.forEach(r => { r.round_no = 5; if (r.user_id === '00000000-0000-4000-8000-000000000001') { r.finished = true; r.won = true; r.guess_count = 2; } });
  }, 'son tur çözüldü');
  check(!/−\d+ Elo/.test(t) && !/tur çözülemedi/.test(t) && /Bitirilmemiş tur kalmadığı/.test(t), 'son turdan sonra: RP uyarısı yok, düz metin');
  t = await warn(() => window.olMock.scenario('playing', { n: 2 }) || (window.olMock.state.round.round_no = 5, window.olMock.state.room.current_round = 5), 'son tur, bitirmedim');
  check(/kalan 1 tur çözülemedi sayılır: −10 Elo/.test(t), 'son tur ama bitirmedim: kalan 1 tur −10 Elo');
  t = await warn(() => window.olMock.scenario('hp-playing', { n: 2 }), 'hp tur 5');
  check(/kalan 6 tur çözülemedi sayılır: −60 Elo/.test(t), 'hp (tavan 10 tur): kalan 6 tur −60 Elo');
  t = await warn(() => {
    window.olMock.scenario('hp-playing', { n: 2 });
    const st = window.olMock.state; st.room.current_round = 10; st.round.round_no = 10;
    st.round_players.forEach(r => { r.round_no = 10; if (r.user_id === '00000000-0000-4000-8000-000000000001') { r.finished = true; r.won = true; } });
  }, 'hp son tur çözüldü');
  check(!/−\d+ Elo/.test(t) && /Bitirilmemiş tur kalmadığı/.test(t), 'hp 10. tur çözüldü: uyarı yok');
  t = await warn(() => window.olMock.scenario('bracket', { cap: 4, round: 1 }), 'bracket yarı final');
  check(/kalan 1 tur çözülemedi sayılır: −10 Elo/.test(t), 'bracket: yalnızca bu eşleşmenin turu −10 Elo');
  t = await warn(() => {
    window.olMock.scenario('bracket', { cap: 4, round: 1 });
    const st = window.olMock.state; st.round_players.forEach(r => { if (r.user_id === '00000000-0000-4000-8000-000000000001') { r.finished = true; r.won = true; r.guess_count = 2; } });
  }, 'bracket bitirdim, rakip bekleniyor');
  check(!/−\d+ Elo/.test(t), 'bracket: turu bitirmiş (rakip bekleniyor) → RP uyarısı yok');
  t = await warn(() => window.olMock.scenario('battle-result', { n: 4 }), 'battle tur 2/3 sonuç');
  check(/kalan 1 tur çözülemedi sayılır: −10 Elo/.test(t), 'battle (tur sonucu, 3 turluk): kalan 1 tur −10 Elo');
  check(p._errors.length === 0, 'konsol temiz ' + p._errors.join('|'));
  await p.close();
}

console.log('== 4) arkadaş listesi');
{
  const p = await open();
  const names = () => p.evaluate(() => ({ f: window.PsikoVakaOnline.friends.state.friends.map(x => x.user.username), o: window.PsikoVakaOnline.friends.state.outgoing.map(x => x.user.username) }));
  check(await p.evaluate(() => window.olMock.hasSelfHandlers), 'abonelik girişte kuruldu (Arkadaşlar açılmadan)');
  let n = await names();
  check(n.o.includes('burak_ilac') && !n.f.includes('burak_ilac'), 'başlangıç: gönderilen istek bekliyor');
  // a) olayla
  await p.evaluate(() => { window.olMock.set({ f6accepted: true }); window.olMock.emitFriendship(); });
  await sleep(1200);
  n = await names(); check(n.f.includes('burak_ilac'), 'olay gelince liste güncellendi');
  // b) olay kaçtı, Online ekranına yeniden gelince
  await p.evaluate(() => { window.olMock.set({ f6accepted: false }); window.PsikoVakaOnline.friends.load({ silent: true }); });
  await sleep(600);
  n = await names(); check(!n.f.includes('burak_ilac'), '(hazırlık) tekrar bekliyor');
  await p.evaluate(() => { window.olMock.set({ f6accepted: true }); location.hash = '#/oyna'; });
  await sleep(600);
  await p.evaluate(() => { location.hash = '#/online'; });
  await sleep(900);
  n = await names(); check(n.f.includes('burak_ilac'), 'olay kaçtı: Online ekranına dönünce liste güncellendi');
  // c) yeniden bağlanma (SUBSCRIBED → onResync)
  await p.evaluate(() => { window.olMock.set({ f6accepted: false }); window.PsikoVakaOnline.friends.load({ silent: true }); });
  await sleep(600);
  await p.evaluate(() => { window.olMock.set({ f6accepted: true }); window.olMock.emitResync(); });
  await sleep(900);
  n = await names(); check(n.f.includes('burak_ilac'), 'yeniden bağlanma: onResync listeyi tazeledi');
  // d) olay işlem görünmeden geldi (ilk okuma eski), 2,5 sn sonra doğrulama okuması
  await p.evaluate(() => { window.olMock.set({ f6accepted: false }); window.PsikoVakaOnline.friends.load({ silent: true }); });
  await sleep(600);
  await p.evaluate(() => { window.olMock.emitFriendship(); });
  await sleep(700);
  await p.evaluate(() => window.olMock.set({ f6accepted: true }));
  await sleep(3200);
  n = await names(); check(n.f.includes('burak_ilac'), 'erken gelen olay: doğrulama okuması listeyi düzeltti');
  // e) sekme yeniden görünür
  await p.evaluate(() => { window.olMock.set({ f6accepted: false }); window.PsikoVakaOnline.friends.load({ silent: true }); });
  await sleep(600);
  await p.evaluate(() => { window.olMock.set({ f6accepted: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await sleep(900);
  n = await names(); check(n.f.includes('burak_ilac'), 'sekme görünür olunca tazelendi');
  check(p._errors.length === 0, 'konsol temiz ' + p._errors.join('|'));
  await p.close();
}
console.log('== 5) 0004: erken ayrılma (erken_bitis) metinleri');
{
  const p = await open({ erkenBitis: true });
  await p.evaluate(() => {
    window.olMock.scenario('final', { n: 2, early: true });
    const st = window.olMock.state; const me = st.results.find(r => r.user_id === '00000000-0000-4000-8000-000000000001');
    st.results.forEach(r => { r.rp_delta = 0; r.rp_after = 760; });
    me.rp_delta = 8; me.rp_after = 768; me.rp_breakdown = { rounds: [{ round: 1, outcome: 'g2', delta: 8 }], placement: 0, voided: false, erken_bitis: true, total: 8 };
    window.PsikoVakaOnline.rooms.refresh();
  });
  await p.waitForSelector('.ol-final-view'); await sleep(700);
  let t = await p.locator('.ol-view-body').innerText();
  check(/Rakip erken ayrıldı: galibiyet primi verilmedi/.test(t) && !/Elo verilmedi/.test(t), 'erken_bitis: "Rakip erken ayrıldı: galibiyet primi verilmedi" (RP verilmedi yok)');
  check(/\+8 Elo/.test(t), 'kalanın tur RP\'si görünüyor (+8)');
  // eski sunucu: dökümsüz, hepsi 0 → eski metin
  await p.evaluate(() => { const st = window.olMock.state; st.results.forEach(r => { r.rp_delta = 0; r.rp_after = 761; delete r.rp_breakdown; }); window.PsikoVakaOnline.rooms.refresh(); });
  await sleep(700);
  t = await p.locator('.ol-view-body').innerText();
  check(/Maç erken bittiği için Elo verilmedi/.test(t) && !/galibiyet primi verilmedi/.test(t), 'eski sunucu: eski metin korunur');
  await p.locator('[data-ol-v="exit"]').first().click(); await sleep(500);
  await p.evaluate(() => { location.hash = '#/ligler'; }); await sleep(1200);
  const rules = await p.locator('#leaguesMount').innerText();
  check(/kalanlara galibiyet primi verilmez/.test(rules) && !/0 Elo\)/.test(rules), 'Lig bilgisi kuralları: yeni erken bitiş cümlesi, eski "0 Elo" yok');
  check(/Rakip erken ayrıldı: galibiyet primi verilmedi/.test(await p.locator('#leaguesMount').evaluate(e => e.textContent)), 'Son maçlar dökümünde erken_bitis notu');
  check(p._errors.length === 0, 'konsol temiz ' + p._errors.join('|'));
  await p.close();
}
await b.close();
console.log(`SONUÇ ${check.oks || 0} ok / ${check.fails || 0} fail`);
process.exit(check.fails ? 1 : 0);
