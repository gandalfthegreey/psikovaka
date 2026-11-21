// Ajan P: Lig bilgisi ekranı (#/ligler) — misafir, giriş yapmış (sahte), v2/eski kurallar, geçmiş yok/var
import { browser, ctx, page, check, sleep } from './lib.mjs';
const IDX = process.env.IDX || 'http://localhost:8899/index.html';
const HAR = process.env.HAR || 'http://localhost:8899/tools/online_dev/harness.html?mock=1';
const SHOTS = process.env.SHOTS || '/home/claude/shots';
const b = await browser();
for (const vp of [{ w: 390, h: 844, dark: true }, { w: 360, h: 740, dark: false }, { w: 1440, h: 900, dark: true }, { w: 1440, h: 900, dark: false }]) {
  const tag = `${vp.w}_${vp.dark ? 'koyu' : 'acik'}`;
  console.log('== ', tag);
  const c = await ctx(b, { viewport: { width: vp.w, height: vp.h }, theme: vp.dark ? 'dark' : 'light', dark: vp.dark });
  // misafir (gerçek index; supabase'e gerçek bağlanabilir ama misafir)
  const p = await page(c, 'g');
  await p.goto(IDX + '#/ligler');
  await p.waitForSelector('#leaguesMount .lg-ladder', { timeout: 15000 });
  check(await p.locator('#screenLeagues').isVisible(), 'misafir: ekran açık');
  check((await p.locator('.lg-tier').count()) === 17, '17 kademe');
  check((await p.locator('.lg-head-guest').count()) === 1, 'misafir: kişisel veri yerine giriş çağrısı');
  check((await p.locator('#lgHistT').count()) === 0, 'misafir: son maçlar yok');
  check((await p.locator('.lg-table').count()) >= 1, 'kurallar tablosu');
  check(await p.locator('[data-route="profil"].active').count() >= 1 || vp.w >= 768, 'menüde Profil etkin');
  if (vp.w === 390) await p.screenshot({ path: `${SHOTS}/lig_misafir_${tag}.png`, fullPage: false });
  check(!(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), 'taşma yok');
  check(p._errors.length === 0, 'konsol temiz ' + p._errors.join('|'));
  // sahte sunucu: giriş yapmış
  const q = await page(c, 'm');
  await q.goto(HAR.replace('?mock=1', '?mock=1') + '#/oyna');
  await q.waitForFunction(() => window.olMock && window.PsikoVakaOnline && window.PsikoVakaOnline.leaguesView);
  await sleep(500);
  // home çipine dokun → #/ligler
  await q.click('#homeRpMount');
  await q.waitForSelector('.lg-head:not(.lg-head-guest)', { timeout: 5000 });
  const head = await q.locator('.lg-head').innerText();
  check(/Gümüş 2/.test(head) && /760 Elo/.test(head), 'kendi ligin (760 Elo → Gümüş 2): ' + head.replace(/\n/g, ' '));
  check(/Gümüş 3 için 140 Elo kaldı/.test(head), 'ilerleme metni');
  check((await q.locator('.lg-tier.is-current').count()) === 1, 'güncel kademe vurgulu');
  check((await q.locator('.lg-tier.is-locked').count()) === 12, 'üstteki 12 kademe kilitli görünümde');
  const v2 = await q.locator('#lgRulesT + table').innerText().catch(() => '');
  check(/\+10 Elo/.test(v2) && /−10 Elo/.test(v2), 'v2 kuralları (sunucu config v2): ' + v2.slice(0, 40).replace(/\n/g, ' '));
  check((await q.locator('.lg-hist-row').count()) === 3, 'son maçlar 3 satır');
  await q.locator('.lg-hist-row summary').first().click();
  check(await q.locator('.lg-bd').first().isVisible(), 'tur dökümü açılır');
  await q.locator('.lg-tier.is-current').scrollIntoViewIfNeeded();
  await q.screenshot({ path: `${SHOTS}/lig_uye_${tag}.png`, fullPage: true });
  // geçmiş RPC yok + eski config
  await q.evaluate(() => { window.olMock.set({ rpHistory: 'unsupported', config: 'old' }); window.PsikoVakaOnline.leaguesView.invalidate(); });
  await q.evaluate(() => { location.hash = '#/oyna'; });
  await sleep(200);
  await q.evaluate(() => { location.hash = '#/ligler'; });
  await sleep(600);
  check((await q.locator('#lgHistT').count()) === 0, 'get_my_rp_history yok → bölüm gizli');
  check(q._errors.length === 0, 'konsol temiz ' + q._errors.join('|'));
  await c.close();
}
await b.close();
console.log(`SONUÇ ${check.oks || 0} ok / ${check.fails || 0} fail`);
