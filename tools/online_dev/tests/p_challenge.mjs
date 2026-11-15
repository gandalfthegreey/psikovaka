// Ajan P: arkadaşı düelloya çağırma (sahte sunucu) + davet afişinin lobi üst çubuğunu örtmemesi
import { browser, ctx, page, check, sleep } from './lib.mjs';
const HAR = process.env.HAR || 'http://localhost:8899/tools/online_dev/harness.html?mock=1';
const SHOTS = process.env.SHOTS || '/home/claude/shots';
const b = await browser();
const overlap = (a, c) => a && c && !(a.bottom <= c.top || c.bottom <= a.top || a.right <= c.left || c.right <= a.left);
for (const vp of [{ w: 360, h: 740, dark: false }, { w: 390, h: 844, dark: true }, { w: 1440, h: 900, dark: true }]) {
  const tag = `${vp.w}_${vp.dark ? 'koyu' : 'acik'}`;
  console.log('== ', tag);
  const c = await ctx(b, { viewport: { width: vp.w, height: vp.h }, theme: vp.dark ? 'dark' : 'light', dark: vp.dark });
  const p = await page(c, 'ch');
  await p.goto(HAR + '#/online');
  await p.waitForFunction(() => window.olMock && document.querySelector('#olFriendsMount .ol-friend'));
  await p.evaluate(() => window.olMock.set({ duelInvite: false }));
  await sleep(300);
  const n = await p.locator('#olFriendsMount [data-ol-f="challenge"]').count();
  check(n === 4, 'her arkadaş satırında "Düelloya çağır" (' + n + ')');
  // çevrimdışı arkadaş: not
  await p.locator('#olFriendsMount li[data-uid$="004"] [data-ol-f="challenge"]').click();
  await p.waitForSelector('.ol-sheet [data-ol-ch]');
  check(/çevrimdışı/.test(await p.locator('.ol-sheet').innerText()), 'çevrimdışı arkadaşa not: 10 dakika geçerli');
  check(await p.locator('.ol-sheet input[name="target"][value="diagnosis"]').isChecked(), 'varsayılan hedef Tanı');
  check(await p.locator('.ol-sheet input[name="format"][value="rounds"]').isChecked(), 'varsayılan biçim Tur puanı');
  await p.locator('.ol-sheet [data-ol-close]').click(); await sleep(250);
  // çevrimiçi arkadaş: Kombo + Can barı
  await p.locator('#olFriendsMount li[data-uid$="002"] [data-ol-f="challenge"]').click();
  await p.waitForSelector('.ol-sheet [data-ol-ch]');
  await p.locator('.ol-sheet label.ol-chip:has(input[value="combo"])').click();
  await p.locator('.ol-sheet label.ol-chip:has(input[value="hp"])').click();
  if (vp.w === 390) await p.screenshot({ path: `${SHOTS}/cagri_sayfa_${tag}.png` });
  await p.locator('.ol-sheet [data-ol-action="go"]').click();
  await p.waitForSelector('.ol-lobby', { timeout: 5000 });
  await sleep(500);
  const st = await p.evaluate(() => ({ room: window.olMock.state.room, inv: window.olMock.lastInvite }));
  check(st.room.mode === 'duel' && st.room.format === 'hp' && st.room.target_type === 'combo' && st.room.visibility === 'private', 'özel düello odası: kombo + can barı');
  check(st.inv && st.inv.fid.endsWith('002'), 'arkadaşa davet gitti');
  check(/ayse_klinik bekleniyor/.test(await p.locator('.ol-slot').innerText()), 'boş yerde "ayse_klinik bekleniyor"');
  check(await p.locator('#olChNote').isVisible(), 'lobide bekleme notu');
  await p.screenshot({ path: `${SHOTS}/cagri_lobi_${tag}.png` });
  // reddetti
  await p.evaluate(() => window.olMock.set({ inviteStatus: 'declined' }));
  await p.waitForFunction(() => /reddetti/.test((document.getElementById('olChNote') || {}).textContent || ''), null, { timeout: 7000 }).catch(() => {});
  check(/reddetti/.test(await p.locator('#olChNote').innerText()), 'reddedince lobide bildirim + seçenekler');
  check((await p.locator('#olChNote [data-ol-l="leave"]').count()) === 1, '"Odayı kapat" seçeneği');
  // zaten odadayken yeni çağrı
  await p.evaluate(() => { window.PsikoVakaOnline.friends.openChallengeSheet({ id: 'x', username: 'can_terapi', avatar: {} }); });
  await sleep(300);
  check(/Zaten bir odadasın/.test(await p.locator('.ol-sheet').last().innerText()), 'zaten odadayken: açıklama + "Odaya dön"');
  await p.locator('.ol-sheet [data-ol-action="back"]').click(); await sleep(200);
  // davet afişi (düello çağrısı) lobide üst çubuğu örtmemeli
  await p.evaluate(() => { window.olMock.set({ duelInvite: true }); window.PsikoVakaOnline.friends.state.seenInvites.clear(); window.PsikoVakaOnline.friends.loadInvites(); });
  await p.waitForSelector('.ol-banner', { timeout: 3000 });
  await sleep(400);
  const txt = await p.locator('.ol-banner[data-key="inv-invd"]').innerText();
  check(/seni düelloya çağırdı/.test(txt) && /Tanı · Can barı/.test(txt) && /Kabul et/.test(txt), 'afiş: "mehmet_psk seni düelloya çağırdı · Tanı · Can barı" + Kabul et');
  const r = await p.evaluate(() => ({ ban: document.querySelector('.ol-banners').getBoundingClientRect().toJSON(), bar: document.querySelector('.ol-lobby .ol-topbar').getBoundingClientRect().toJSON(), back: document.querySelector('.ol-lobby [data-ol-l="leave"]').getBoundingClientRect().toJSON() }));
  check(!overlap(r.ban, r.bar), 'afiş lobi üst çubuğunu örtmüyor');
  await p.screenshot({ path: `${SHOTS}/cagri_afis_lobi_${tag}.png` });
  // hub'da afiş içerik başlığını örtmesin
  await p.evaluate(() => window.PsikoVakaOnline.app.exitToHub());
  await sleep(400);
  const r2 = await p.evaluate(() => ({ ban: document.querySelector('.ol-banners').getBoundingClientRect().toJSON(), h: document.querySelector('#onlineTitle').getBoundingClientRect().toJSON() }));
  check(!overlap(r2.ban, r2.h), 'afiş Online başlığını örtmüyor');
  check(p._errors.length === 0, 'konsol temiz ' + p._errors.join('|'));
  await c.close();
}
await b.close();
console.log(`SONUÇ ${check.oks || 0} ok / ${check.fails || 0} fail`);
