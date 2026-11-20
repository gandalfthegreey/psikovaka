// Ajan W: canlı doğrulama (özel oda, 2 test hesabı): maç sonrası Profil RP = sunucu RP (yenilemeden) + ayrılma uyarısı tutarı = sunucunun kestiği
import { browser, ctx, page, signIn, sleep, check } from './lib.mjs';
import { resetUser, answers, guess, waitPhase, waitPlaying, state, myProfile } from './helpers.mjs';
const b = await browser();
const c1 = await ctx(b, { viewport: { width: 390, height: 844 }, mobile: true });
const c2 = await ctx(b, { viewport: { width: 1440, height: 900 } });
const p1 = await page(c1, 'bir'), p2 = await page(c2, 'iki');
await Promise.all([signIn(p1, 't1@psikovaka.test'), signIn(p2, 't2@psikovaka.test')]);
await Promise.all([resetUser(p1), resetUser(p2)]);
async function room(rounds) {
  const r = await p1.evaluate(async (n) => { const NS = window.PsikoVakaOnline; const r = await NS.api.createRoom({ mode: 'duel', format: 'rounds', target: 'diagnosis', capacity: 2, rounds: n, visibility: 'private', timeLimit: 180 }); if (r.ok) await NS.app.openRoom(r.data.id); return r.ok ? r.data : r.error; }, rounds);
  if (!r.code) throw new Error('oda kurulamadı ' + JSON.stringify(r));
  await p1.waitForSelector('.ol-lobby .ol-p.is-me', { timeout: 15000 });
  await p2.evaluate(async (code) => (await window.PsikoVakaOnline.app.joinByCode(code)).ok, r.code);
  await p2.waitForSelector('.ol-lobby .ol-p.is-me', { timeout: 15000 });
  await p1.waitForFunction(() => document.querySelectorAll('.ol-lobby .ol-p').length === 2, null, { timeout: 15000 });
  await p2.click('[data-ol-l="ready"]');
  await p1.waitForFunction(() => !document.querySelector('[data-ol-l="start"]').disabled, null, { timeout: 10000 });
  await p1.click('[data-ol-l="start"]');
}
const serverRp = async (p) => (await myProfile(p)).ranked_points;
const txt = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); return e ? e.textContent.trim() : null; }, sel);

console.log('== A) maç sonrası Profil RP');
const before1 = await serverRp(p1);
await p1.evaluate(() => window.PsikoVakaAccount.refreshProfile()); await sleep(500);
console.log('   t1 maç öncesi sunucu RP', before1, '| ana sayfa hapı', await txt(p1, '#homeRpMount'));
await room(3);
for (let r = 1; r <= 3; r++) {
  await Promise.all([waitPlaying(p1, r, 60000), waitPlaying(p2, r, 60000)]);
  const [a1, a2] = await Promise.all([answers(p1), answers(p2)]);
  await Promise.all([guess(p1, a1.right), (async () => { if (r === 2) await guess(p2, a2.wrong[0]); await guess(p2, a2.right); })()]);
  await Promise.all([waitPhase(p1, ['result', 'finished'], 60000), waitPhase(p2, ['result', 'finished'], 60000)]);
}
await Promise.all([waitPhase(p1, 'finished', 60000), waitPhase(p2, 'finished', 60000)]);
await p1.waitForSelector('.ol-final-view .ol-pod', { timeout: 15000 });
await sleep(2500);
const after1 = await serverRp(p1);
const res = (await state(p1)).results; const me1 = await p1.evaluate(() => window.PsikoVakaOnline.api.myId()); const mine = res.find(x => x.user_id === me1);
console.log('   sonuç satırı', JSON.stringify([mine.rp_delta, mine.rp_after]), '| sunucu RP', after1);
check(after1 === mine.rp_after, 'sunucu RP = sonuç rp_after');
check((await txt(p1, '#homeRpMount')) === `${after1} RP`, 'ana sayfa hapı = sunucu RP (yenilemesiz): ' + await txt(p1, '#homeRpMount'));
await p1.click('.ol-view-foot [data-ol-v="exit"]'); await p2.click('.ol-view-foot [data-ol-v="exit"]');
await sleep(800);
await p1.evaluate(() => { location.hash = '#/profil'; }); await sleep(900);
check((await txt(p1, '#headerPlayerRpMount')) === `${after1} RP`, 'Profil RP = sunucu RP: ' + await txt(p1, '#headerPlayerRpMount') + ' · ' + await txt(p1, '#profileTierLabel'));
await p1.evaluate(() => { location.hash = '#/ligler'; }); await sleep(1500);
check(new RegExp(`${after1} RP`).test(await txt(p1, '.lg-head-rp') || ''), '#/ligler RP = sunucu RP: ' + await txt(p1, '.lg-head-rp') + ' · ' + await txt(p1, '.lg-head-title'));
await p1.evaluate(() => { location.hash = '#/oyna'; });

console.log('== B) ayrılma uyarısı tutarı = sunucunun kestiği');
await resetUser(p1); await resetUser(p2);
const b1 = await serverRp(p1);
await room(3);
await Promise.all([waitPlaying(p1, 1, 60000), waitPlaying(p2, 1, 60000)]);
await p1.evaluate(() => window.PsikoVakaOnline.leaguesView.loadConfig()); await sleep(600);
await p1.evaluate(() => { window.PsikoVakaOnline.app.leaveRoom(); });
await sleep(500);
const warn = await p1.locator('.ol-sheet').last().innerText();
console.log('   uyarı:', warn.replace(/\s+/g, ' '));
const m = /kalan (\d+) tur .*?−(\d+) RP/.exec(warn);
await p1.locator('.ol-sheet [data-ol-action="yes"]').last().click();
await sleep(5000);
await p1.evaluate(() => window.PsikoVakaAccount.refreshProfile()); await sleep(600);
const a1 = await serverRp(p1);
const cut = b1 - a1;
console.log('   önce', b1, 'sonra', a1, 'kesilen', cut, '| uyarı', m && m[2]);
check(m && Number(m[2]) === cut, 'uyarıdaki tutar = sunucunun kestiği');
check((await txt(p1, '#homeRpMount')) === `${a1} RP`, 'ayrılınca ana sayfa hapı sunucuyla aynı: ' + await txt(p1, '#homeRpMount'));
await Promise.all([resetUser(p1), resetUser(p2)]);
const left = await Promise.all([p1, p2].map(p => p.evaluate(async () => { const r = await window.PsikoVakaOnline.api.getMyCurrentRoom(); return r.data; })));
check(!left[0] && !left[1], 'açık oda kalmadı');
console.log('errors', p1._errors, p2._errors);
console.log(`SONUÇ ${check.oks || 0} ok / ${check.fails || 0} fail`);
await b.close();
