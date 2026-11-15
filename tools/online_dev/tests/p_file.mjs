// Ajan P: tek dosyalık sürüm file:// altında (FILE env: PsikoVaka_Tam_Surum.html yolu)
import { browser, ctx, page, check, sleep } from './lib.mjs';
const F = 'file://' + (process.env.FILE || '/home/claude/bt/PsikoVaka_Tam_Surum.html');
const b = await browser(); const c = await ctx(b, { viewport: { width: 390, height: 844 } }); const p = await page(c, 'file');
await p.goto(F + '#/oyna'); await p.waitForFunction(() => window.game && window.PsikoVakaOnline && window.PsikoVakaOnline.daily); await sleep(800);
check(await p.locator('#btnDailyBoard').isHidden() && await p.locator('#dailyStreakChip').isHidden(), 'file://: sıralama ve seri gizli');
await p.click('#btnStartDaily'); await sleep(500);
check(await p.evaluate(() => window.game.currentScreen === 'play' && window.game.currentMode === 'daily'), 'file://: yerel günlük');
await p.evaluate(() => { window.game.giveUp(); }); await sleep(800);
await p.evaluate(() => { window.game.closeModal(window.game.dom.resultModal); window.game.leavePlayScreen(); location.hash = '#/gunluk'; }); await sleep(500);
check(/bu sürümde kapalı/.test(await p.locator('#dailyMount').innerText()), 'file://: sıralama "bu sürümde kapalı"');
await p.evaluate(() => { location.hash = '#/ligler'; }); await sleep(500);
check((await p.locator('.lg-tier').count()) === 17, 'file://: Lig bilgisi merdiveni');
await p.evaluate(() => { location.hash = '#/online'; }); await sleep(500);
check(/bu sürümde kapalı/.test(await p.locator('#onlineHubMount').innerText()), 'file://: Online kapalı açıklaması');
check(p._errors.length === 0, 'konsol temiz ' + p._errors.join('|'));
await b.close(); console.log(`SONUÇ ${check.oks || 0} ok / ${check.fails || 0} fail`);
