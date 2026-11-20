// Marka görselleri (assets/og.png + uygulama ikonları) — Bilgi Kartı yönü renkleri/yazı tipleri.
// Kullanım: proje kökünde, statik sunucu açıkken:  node tools/marka_gorselleri/uret.mjs [--out assets]
// Ortam: PLAYWRIGHT (playwright paketinin yolu), CHROME (varsayılan /usr/bin/google-chrome), BASE (varsayılan http://localhost:8899),
//        FONT_CSS + FONT_DIR (isteğe bağlı: çevrimdışı ortamda Google Fonts yerine yerel css/woff2 sunmak için).
import fs from 'node:fs';
import path from 'node:path';
const { chromium } = await import(process.env.PLAYWRIGHT || 'playwright');
const BASE = process.env.BASE || 'http://localhost:8899';
const out = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : 'assets';
const b = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const jobs = [
  ['og', 1200, 630, 'og.png', false], ['icon', 512, 512, 'icon-512.png', true], ['icon', 192, 192, 'icon-192.png', true],
  ['maskable', 512, 512, 'icon-maskable-512.png', false], ['apple', 180, 180, 'apple-touch-icon.png', false]
];
for (const [k, w, h, file, alpha] of jobs) {
  const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  if (process.env.FONT_CSS) await c.route('**/*', (r) => {
    const u = r.request().url();
    if (u.includes('/__fonts/')) return r.fulfill({ status: 200, contentType: 'font/woff2', body: fs.readFileSync(path.join(process.env.FONT_DIR, u.split('/__fonts/')[1].split('?')[0])), headers: { 'access-control-allow-origin': '*' } });
    if (u.includes('fonts.googleapis.com')) return r.fulfill({ status: 200, contentType: 'text/css', body: fs.readFileSync(process.env.FONT_CSS, 'utf8'), headers: { 'access-control-allow-origin': '*' } });
    if (/fonts\.gstatic/.test(u)) return r.abort();
    return r.continue();
  });
  const p = await c.newPage();
  await p.goto(`${BASE}/tools/marka_gorselleri/marka.html?k=${k}&size=${w}`);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(out, file), omitBackground: alpha, type: 'png' });
  await c.close();
}
await b.close();
console.log('yazıldı:', jobs.map(j => j[3]).join(', '));
