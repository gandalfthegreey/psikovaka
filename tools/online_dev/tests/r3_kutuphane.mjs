// Ajan R3: Kütüphane "ders kitabı" — tüm sayfalar (179 tanı + 45 terapi + 34 ilaç) 360/1440, undefined/NaN/taşma yok,
// kitap sayfası işaretleri, telefonda klinik özet kapalı, masaüstünde düz bölüm; liste/arama/odak geri dönüşü.
import { browser, ctx, page, check, sleep } from './lib.mjs';
const IDX = process.env.IDX || 'http://localhost:8899/index.html';
const b = await browser();
for (const vp of [{ w: 360, h: 740, th: 'light' }, { w: 1440, h: 900, th: 'dark' }]) {
  const c = await ctx(b, { viewport: { width: vp.w, height: vp.h }, theme: vp.th, dark: vp.th === 'dark', mobile: vp.w < 1000 });
  const p = await page(c, 'lib' + vp.w);
  await p.goto(IDX + '#/kutuphane');
  await p.waitForFunction(() => window.game && document.querySelector('#libListTani .lib-group'));
  const ids = await p.evaluate(() => ({ tani: window.game.diagnoses.map(x => x.id), terapi: window.game.therapies.map(x => x.id), ilac: window.game.pharmacology.map(x => x.id) }));
  const bad = []; let n = 0, longest = 0, longId = '', opioidH = 0;
  for (const kind of ['tani', 'terapi', 'ilac']) for (const id of ids[kind]) {
    await p.evaluate(([k, i]) => { location.hash = `#/kutuphane/${k}/${encodeURIComponent(i)}`; }, [kind, id]);
    const r = await p.evaluate(() => new Promise(res => requestAnimationFrame(() => {
      const d = document.getElementById('libDetail'); const t = d.innerText;
      res({ ok: !d.hidden && d.classList.contains('is-book') && !!d.querySelector('.lib-run .lib-run-no'), undef: /undefined|\[object Object\]|NaN/.test(t), ov: document.scrollingElement.scrollWidth > innerWidth,
        wide: Array.from(d.querySelectorAll('*')).some(e => e.getBoundingClientRect().right > innerWidth + 1 && getComputedStyle(e).position !== 'fixed'),
        crit: d.querySelectorAll('.lib-crit').length, h: document.scrollingElement.scrollHeight,
        clinOpen: Array.from(d.querySelectorAll('details.lib-collapse')).filter(x => x.open).length, clinSec: d.querySelectorAll('section.lib-clin').length, details: d.querySelectorAll('details.lib-collapse').length });
    })));
    n++;
    if (!r.ok || r.undef || r.ov || r.wide || (kind === 'tani' && !r.crit)) bad.push(`${kind}/${id} ${JSON.stringify(r)}`);
    if (vp.w < 768 && (r.clinOpen || r.clinSec)) bad.push(`${kind}/${id} telefonda klinik özet açık`);
    if (vp.w >= 768 && r.details) bad.push(`${kind}/${id} masaüstünde açılır bölüm`);
    if (kind === 'tani' && r.h > longest) { longest = r.h; longId = id; }
    if (id === 'opioid_use_disorder') opioidH = r.h;
  }
  check(n === ids.tani.length + ids.terapi.length + ids.ilac.length && n === 258, `${vp.w}: ${n} sayfa açıldı (179+45+34)`);
  check(bad.length === 0, `${vp.w}: sorunlu sayfa yok ${bad.slice(0, 4).join(' | ')}`);
  if (vp.w < 768) { console.log(`  bilgi ${vp.w}: en uzun tanı sayfası ${longId} ${longest} px; opioid ${opioidH} px`); check(opioidH < 4000, `${vp.w}: opioid sayfası ${opioidH} px (< 4000; klinik özetler kapalı)`); }
  // opioid: telefonda kapalı özet açılınca içerik görünür
  await p.evaluate(() => { location.hash = '#/kutuphane/tani/opioid_use_disorder'; }); await sleep(200);
  if (vp.w < 768) {
    const s = await p.evaluate(() => { const d = document.getElementById('lib-sec-overview'); const h = d.querySelector('summary'); const r = h.getBoundingClientRect(); return { closed: !d.open, h: r.height }; });
    check(s.closed && s.h >= 44, `${vp.w}: Genel bakış kapalı başlar, başlık ≥44 px (${s.h})`);
    await p.click('#lib-sec-overview summary'); await sleep(100);
    check(await p.evaluate(() => document.getElementById('lib-sec-overview').open), `${vp.w}: dokununca açılır`);
  }
  // "Bu sayfada" atlaması (masaüstü) — Genel bakış
  if (vp.w >= 900) {
    await p.click('[data-lib-jump="lib-sec-overview"]'); await sleep(1200);
    const y = await p.evaluate(() => document.getElementById('lib-sec-overview').getBoundingClientRect().top);
    check(y >= 0 && y < 200, `${vp.w}: "Bu sayfada" atlaması çalışıyor (${Math.round(y)})`);
  }
  // kriter etiketleri: mdd'de "Kriter A" (okunur metin), A1.. asılı
  await p.evaluate(() => { location.hash = '#/kutuphane/tani/mdd'; }); await sleep(200);
  const k = await p.evaluate(() => ({ code: document.querySelector('.lib-crit-code').textContent, hung: document.querySelectorAll('.lib-crit-items li.is-hung').length, hang: document.querySelector('.lib-hang') && document.querySelector('.lib-hang').textContent, run: document.querySelector('.lib-run').textContent, note: document.querySelector('.lib-note .lib-note-h') && document.querySelector('.lib-note .lib-note-h').textContent }));
  check(k.code === 'Kriter A' && k.hung >= 9 && k.hang === 'A1', `${vp.w}: mdd kriter etiketi ve asılı numaralar ${JSON.stringify(k)}`);
  check(/^4\.1 Depresif Bozukluklar/.test(k.run) && k.note === 'Kenar notu', `${vp.w}: üst bilgi satırı + kenar notu`);
  // listeye dönüş: odak açılan satıra, kaydırma geri
  await p.evaluate(() => { location.hash = '#/kutuphane'; }); await sleep(200);
  await p.evaluate(() => { document.querySelector('#libListTani .lib-group[data-group="SLEEP"]').open = true; });
  const href = await p.evaluate(() => { const a = document.querySelector('#libListTani .lib-group[data-group="SLEEP"] a.lib-row'); a.scrollIntoView({ block: 'center' }); return a.getAttribute('href'); });
  await sleep(200); const y0 = await p.evaluate(() => scrollY);
  // (Playwright'ın tıklama öncesi scrollIntoViewIfNeeded'i çok sütunlu düzende Chrome'da yanlış konuma kaydırıyor; gerçek tıklama kaydırmaz)
  await p.evaluate((h) => document.querySelector(`a.lib-row[href="${h}"]`).click(), href); await sleep(300);
  await p.goBack(); await sleep(400);
  const back = await p.evaluate(() => ({ y: scrollY, f: document.activeElement && document.activeElement.getAttribute('href') }));
  check(Math.abs(back.y - y0) < 4 && back.f === href, `${vp.w}: geri dönünce kaydırma (${y0}→${back.y}) ve odak açılan satırda`);
  // bölüm/madde numaraları + açık/kapalı göstergesi
  const toc = await p.evaluate(() => { const g = document.querySelector('#libListTani .lib-group[data-group="SLEEP"]'); const head = g.querySelector('summary'); const mk = getComputedStyle(head, '::after'); return { ch: head.querySelector('.lib-ch').textContent, no: g.querySelector('.lib-no').textContent, marker: mk.display !== 'none' && mk.content !== 'none', tf: mk.transform, open: g.open, h: head.getBoundingClientRect().height }; });
  check(toc.ch === '12' && toc.no === '12.1' && toc.marker && toc.h >= 44, `${vp.w}: bölüm 12, madde 12.1, açık/kapalı işareti görünür, başlık ≥44 px ${JSON.stringify(toc)}`);
  await p.evaluate(() => { document.querySelector('#libListTani .lib-group[data-group="SLEEP"]').open = false; }); await sleep(400);
  const tfClosed = await p.evaluate(() => getComputedStyle(document.querySelector('#libListTani .lib-group[data-group="SLEEP"] summary'), '::after').transform);
  check(tfClosed !== toc.tf, `${vp.w}: işaret açık/kapalıda farklı`);
  // arama: numaralar değişmez, başlık gizli, kod araması, aksan
  await p.fill('#libSearchInput', 'uyku'); await sleep(400);
  const s1 = await p.evaluate(() => ({ title: document.getElementById('libContentsTitle').hidden, nos: Array.from(document.querySelectorAll('#libListTani .lib-row-item:not([hidden]) .lib-no')).map(e => e.textContent).slice(0, 3), status: document.getElementById('libSearchStatus').textContent, cls: document.getElementById('libPage').classList.contains('is-searching') }));
  check(s1.title && s1.cls && s1.nos[0] === '12.1' && /sonuç/.test(s1.status), `${vp.w}: arama "uyku" → 12.1…, başlık gizli ${JSON.stringify(s1)}`);
  for (const [q, id] of [['F33.9', 'mdd'], ['sizofreni', 'schizophrenia'], ['ŞİZOFRENİ', 'schizophrenia'], ['Capgras', 'delusional_disorder']]) {
    await p.fill('#libSearchInput', q); await sleep(350);
    const ok = await p.evaluate((id) => { const li = document.querySelector(`#libListTani .lib-row-item[data-id="${id}"]`); return !!li && !li.hidden; }, id);
    check(ok, `${vp.w}: arama "${q}" → ${id}`);
  }
  await p.fill('#libSearchInput', ''); await sleep(350);
  check(await p.evaluate(() => !document.getElementById('libContentsTitle').hidden && !document.getElementById('libPage').classList.contains('is-searching')), `${vp.w}: arama silinince İçindekiler başlığı geri`);
  // tek kod gösterimi + title
  const code = await p.evaluate(() => { const e = document.querySelector('#libListTani .lib-row-item[data-id="mdd"] .lib-row-codes'); return { t: e.textContent, title: e.getAttribute('title') }; });
  check(code.t === 'F32.9' && /F33\.9/.test(code.title || ''), `${vp.w}: içindekilerde yalnız ilk kod, tamamı title'da ${JSON.stringify(code)}`);
  // bulunamadı
  await p.evaluate(() => { location.hash = '#/kutuphane/tani/yok-boyle'; }); await sleep(200);
  check(await p.evaluate(() => /Bulunamadı/.test(document.getElementById('libDetail').innerText) && !document.getElementById('libDetail').classList.contains('is-book')), `${vp.w}: bulunamadı (kitap sayfası değil)`);
  check(p._errors.length === 0, `${vp.w}: konsol temiz ${p._errors.slice(0, 2).join('|')}`);
  await c.close();
}
await b.close(); console.log(`SONUÇ ${check.oks || 0} ok / ${check.fails || 0} fail`);
