import { browser, ctx, page, signIn, sleep, check } from './lib.mjs';
const b = await browser();
const c = await ctx(b);
const p = await page(c, 'u1');
await signIn(p, 'test1@psikovaka.test');
await sleep(2500);
const info = await p.evaluate(async () => {
  const NS = window.PsikoVakaOnline;
  const cur = await NS.api.getMyCurrentRoom();
  const live = Array.from(NS.realtime._live.values()).map(r => [r.name, r.status]);
  return { cur, live, offset: NS.clock.offset, hub: document.getElementById('onlineHubMount').dataset.state, hubHtml: document.getElementById('onlineHubMount').innerText.slice(0, 400) };
});
console.log(JSON.stringify(info, null, 1));
check(info.hub === 'ready', 'hub ready');
await p.screenshot({ path: '/tmp/smoke_hub.png', fullPage: true });
console.log('errors', p._errors);
await b.close();
