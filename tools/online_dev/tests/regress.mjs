// Aşama 9 regresyonu: index.html (yayın sayfası) üzerinde tek kişilik özellikler + online girişleri
import { browser, ctx, page, signIn, sleep, check } from './lib.mjs';
const ROOT = 'http://localhost:8899/index.html';
const b = await browser();
for (const vp of [{ width: 390, height: 844, mobile: true }, { width: 1440, height: 900 }]) {
  const c = await ctx(b, { viewport: { width: vp.width, height: vp.height }, mobile: vp.mobile });
  const p = await page(c, 'r' + vp.width);
  await p.goto(ROOT);
  await p.waitForFunction(() => window.game && window.PsikoVakaOnline && window.PsikoVakaOnline.app, null, { timeout: 15000 });
  check(await p.evaluate(() => typeof Peer === 'undefined' && !document.querySelector('script[src*="peerjs"]')), vp.width + ': PeerJS yok');
  check(await p.evaluate(() => typeof attachOnlineArenaToGame === 'undefined' && typeof window.game.startMatchmaking === 'undefined'), 'eski arena kodu yok');
  // günlük vaka
  await p.click('#btnStartDaily');
  await p.waitForSelector('#screenPlay:not([hidden])');
  const wrong = await p.evaluate(() => { const g = window.game; return g.diagnoses.find(d => d.id !== g.currentCase.diagnosisId).nameTr; });
  await p.fill('#diagnosisInput', wrong); await p.click('#btnSubmit'); await sleep(300);
  check(await p.evaluate(() => window.game.guesses.length === 1 && window.game.unlockedClues === 2), 'günlük vaka: yanlış tahmin yeni ipucu açtı');
  const right = await p.evaluate(() => { const g = window.game; return g.diagnoses.find(d => d.id === g.currentCase.diagnosisId).nameTr; });
  await p.fill('#diagnosisInput', right); await p.click('#btnSubmit'); await sleep(900);
  check(await p.evaluate(() => window.game.isGameOver && window.game.gameWon), 'günlük vaka çözüldü');
  await p.evaluate(() => window.game.closeModal(window.game.dom.resultModal));
  // meydan okuma penceresi
  await p.evaluate(() => window.game.openDuelCenterModal());
  await sleep(300);
  const link = await p.$eval('#currentCaseDuelLinkInput', e => e.value);
  check(/#duel=/.test(link), 'meydan okuma bağlantısı üretildi');
  await p.evaluate(() => window.game.closeModal(window.game.dom.duelCenterModal));
  // pratik + kombo
  await p.evaluate(() => { window.game.setTargetGameMode('combo', false); window.game.setMode('practice'); });
  await sleep(300);
  const t = await p.evaluate(() => window.game.diagnoses.find(d => d.id === window.game.currentCase.diagnosisId).nameTr);
  await p.fill('#diagnosisInput', t); await p.click('#btnSubmit'); await sleep(300);
  check(await p.evaluate(() => window.game.comboStage === 2), 'kombo: aşama 2');
  await p.evaluate(() => window.game.setTargetGameMode('diagnosis', false));
  await p.click('#btnPlayBack'); await sleep(400);
  // kütüphane, profil, avatar stüdyosu
  await p.goto(ROOT + '#/kutuphane'); await sleep(800);
  check(await p.evaluate(() => !document.getElementById('screenLibrary').hidden && document.querySelectorAll('#libListTani a, #libListTani button, #libListTani li').length > 20), 'kütüphane listesi');
  await p.goto(ROOT + '#/profil'); await sleep(600);
  await p.click('#btnHeaderProfilePill');
  await p.waitForSelector('#avatarStudioModal.open', { timeout: 5000 });
  await p.click('#avatarSlotTabs [data-slot="color"]');
  await p.click('#funnyAvatarControlsGrid [data-val="coral"]');
  await sleep(600);
  check(await p.evaluate(() => JSON.parse(localStorage.getItem('psikovaka_funny_avatar')).color === 'coral'), 'avatar stüdyosu: seçim kaydedildi');
  await p.screenshot({ path: `/tmp/shots/reg_avatar_${vp.width}.png` });
  await p.keyboard.press('Escape');
  // paylaşılan bağlantılar
  await p.goto(ROOT + '#id=case-001'); await p.reload(); await sleep(800);
  check(await p.evaluate(() => window.game.currentCase && window.game.currentCase.id === 'case-001' && !document.getElementById('screenPlay').hidden), '#id= bağlantısı');
  const duelHash = link.split('#')[1];
  await p.goto(ROOT + '#' + duelHash); await p.reload(); await sleep(800);
  check(await p.evaluate(() => !!window.game.activeDuelChallenge && !document.getElementById('screenPlay').hidden), '#duel= bağlantısı (meydan okuma) çalışıyor');
  // online: misafir
  await p.goto(ROOT + '#/online'); await p.reload();
  await p.waitForFunction(() => { const m = document.getElementById('onlineHubMount'); return m && ['guest', 'ready'].includes(m.dataset.state); }, null, { timeout: 15000 });
  const st = await p.$eval('#onlineHubMount', e => e.dataset.state);
  check(st === 'guest' || st === 'ready', 'online merkez durumu: ' + st);
  if (st === 'guest') { await p.screenshot({ path: `/tmp/shots/hub_guest_${vp.width}.png` }); }
  // #room= misafirken: giriş penceresi
  await p.goto(ROOT + '#room=ZZZZZ9'); await p.reload(); await sleep(1500);
  check(await p.evaluate(() => document.getElementById('authModal').classList.contains('open') || window.PsikoVakaAccount.state === 'ready'), '#room= misafirde giriş penceresi açtı');
  check(!p._errors.length, 'konsol hatası yok ' + JSON.stringify(p._errors.slice(0, 3)));
  await c.close();
}
// giriş yapılmış + bilinmeyen oda kodu + tek dosyalık sürüm
{
  const c = await ctx(b); const p = await page(c, 'login');
  await signIn(p, 'test5@psikovaka.test', ROOT + '#/online');
  await p.waitForFunction(() => document.getElementById('onlineHubMount').dataset.state === 'ready');
  await p.fill('#olJoinCode', 'ZZZZZ9'); await p.click('[data-ol-join] button[type="submit"]'); await sleep(1500);
  check(/bulunamadı/i.test(await p.$eval('#olJoinErr', e => e.textContent)), 'bilinmeyen kod: hata mesajı');
  await p.screenshot({ path: '/tmp/shots/hub_signed_390.png', fullPage: true });
  check(!p._errors.length, 'konsol hatası yok (girişli) ' + JSON.stringify(p._errors.slice(0, 3)));
  const f = await c.newPage(); const errs = [];
  f.on('pageerror', e => errs.push(e.message));
  await f.goto('file:///home/claude/pv/PsikoVaka_Tam_Surum.html#/online'); await sleep(1500);
  check(await f.evaluate(() => document.getElementById('onlineHubMount').dataset.state === 'file'), 'tek dosya: online açıklama durumu');
  await f.screenshot({ path: '/tmp/shots/file_online.png' });
  await f.evaluate(() => document.getElementById('btnStartDaily') && 0);
  await f.goto('file:///home/claude/pv/PsikoVaka_Tam_Surum.html#/oyna'); await sleep(800);
  await f.click('#btnStartDaily'); await sleep(400);
  check(await f.evaluate(() => !document.getElementById('screenPlay').hidden), 'tek dosya: günlük vaka başlıyor');
  check(!errs.length, 'tek dosya: sayfa hatası yok ' + JSON.stringify(errs));
  await c.close();
}
console.log(`SONUÇ ${check.oks || 0} ok, ${check.fails || 0} fail`);
await b.close();
