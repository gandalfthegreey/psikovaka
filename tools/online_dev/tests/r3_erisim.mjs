// Ajan R3: ana sayfa "çalışma masası" + kütüphane — dokunma hedefleri (≥44 px, cümle içi bağlantılar hariç), odak görünür, satır içi stil yok, emoji yok
import { browser, ctx, page, check, sleep } from './lib.mjs';
const IDX = process.env.IDX || 'http://localhost:8899/index.html';
const HAR = process.env.HAR || 'http://localhost:8899/tools/online_dev/harness.html?mock=1';
const b = await browser();
const targets = [['home-guest', IDX + '#/oyna'], ['home-member', HAR + '#/oyna'], ['lib', IDX + '#/kutuphane'], ['dx-mdd', IDX + '#/kutuphane/tani/mdd'], ['dx-opioid', IDX + '#/kutuphane/tani/opioid_use_disorder'], ['terapi', IDX + '#/kutuphane/terapi/erp'], ['ilac', IDX + '#/kutuphane/ilac/ssri_firstline']];
for (const [w, h] of [[360, 740], [390, 844], [1440, 900]]) for (const th of ['dark', 'light']) {
  const c = await ctx(b, { viewport: { width: w, height: h }, mobile: w < 1000, theme: th, dark: th === 'dark' });
  await c.addInitScript(() => { localStorage.setItem('psikovaka_onboarded', '1'); });
  const p = await page(c, `${w}${th}`);
  for (const [name, url] of targets) {
    await p.goto(url); await p.waitForFunction(() => window.game && window.game.myAvatar); await sleep(name === 'home-member' ? 1500 : 500);
    const r = await p.evaluate(({ coarse, name }) => {
      const scope = document.querySelector(name.startsWith('home') ? '#screenHome' : '#screenLibrary');
      const vis = (e) => { const s = getComputedStyle(e); const rc = e.getBoundingClientRect(); return rc.width > 0 && rc.height > 0 && s.visibility !== 'hidden'; };
      const small = [];
      scope.querySelectorAll('a[href], button, summary, input, [role="radio"]').forEach(e => {
        if (!vis(e)) return;
        const rc = e.getBoundingClientRect();
        const inline = getComputedStyle(e).display === 'inline' || e.closest('.lib-see .lib-links, .lib-prose, .lib-sec-note');
        if (inline && e.tagName === 'A') return;
        if (coarse && (rc.height < 43.5 || rc.width < 43.5)) small.push(`${e.id || e.className || e.tagName} ${Math.round(rc.width)}×${Math.round(rc.height)}`);
      });
      const inl = Array.from(scope.querySelectorAll('[style]')).filter(e => !e.closest('svg') && !e.closest('.ol-banners')).map(e => e.id || e.className).slice(0, 5);
      const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(scope.innerText);
      return { small: small.slice(0, 8), n: small.length, inl, emoji, ov: document.scrollingElement.scrollWidth > innerWidth };
    }, { coarse: w < 1000, name });
    check(r.n === 0, `${w} ${th} ${name}: dokunma hedefleri ≥44 px ${r.small.join(', ')}`);
    check(r.inl.length === 0 && !r.emoji && !r.ov, `${w} ${th} ${name}: satır içi stil yok, emoji yok, taşma yok ${JSON.stringify(r.inl)}`);
    // odak görünür: ilk 25 Tab durağının her birinde outline/box-shadow/border/underline farkı
    if (th === 'dark' && w !== 360) {
      await p.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0); });
      const scopeSel = name.startsWith('home') ? '#screenHome' : '#screenLibrary';
      const miss = [];
      for (let i = 0; i < 40; i++) {
        await p.keyboard.press('Tab');
        const f = await p.evaluate((sel) => { const e = document.activeElement; if (!e || !e.closest(sel)) return null; const s = getComputedStyle(e); const ring = (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || (s.boxShadow && s.boxShadow !== 'none'); return { id: e.id || e.className, ring, tag: e.tagName }; }, scopeSel);
        if (f && !f.ring) miss.push(f.id + ':' + f.tag);
      }
      check(miss.length === 0, `${w} ${name}: klavye odağı görünür ${miss.slice(0, 5).join(', ')}`);
    }
  }
  check(p._errors.length === 0, `${w} ${th}: konsol temiz ${p._errors.slice(0, 2)}`);
  await c.close();
}
await b.close(); console.log(`SONUÇ ${check.oks || 0} ok / ${check.fails || 0} fail`);
