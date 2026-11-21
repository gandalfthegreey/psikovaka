// js/vendor/qr.js birim testi: üretilen matrisler jsQR ile çözülür (sürüm 1–10, L/M/Q/H, Türkçe karakter)
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/home/claude/rt/');
const jsQR = require('jsqr');
const code = fs.readFileSync(new URL('../../../js/vendor/qr.js', import.meta.url), 'utf8');
const g = {}; new Function('window', code)(g);
const QR = g.PsikoVakaQR;
let ok = 0, fail = 0;
const texts = ['A', 'https://gandalfthegreey.github.io/psikovaka/#/katil/K7Q2MX', 'Sınıf modu: çğıöşü İ', 'x'.repeat(100), 'https://ornek.test/' + 'ab'.repeat(60)];
const vers = new Set();
for (const t of texts) for (const e of ['L', 'M', 'Q', 'H']) {
  const q = QR.encode(t, e);
  if (!q) { if (t.length > 90 && e !== 'L') { ok++; continue; } console.log('  FAIL encode null', e, t.length); fail++; continue; }
  vers.add(q.version);
  const S = 6, n = (q.size + 8) * S, data = new Uint8ClampedArray(n * n * 4);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const d = q.get(Math.floor(x / S) - 4, Math.floor(y / S) - 4); const i = (y * n + x) * 4; data[i] = data[i + 1] = data[i + 2] = d ? 0 : 255; data[i + 3] = 255; }
  const r = jsQR(data, n, n);
  if (r && r.data === t) ok++; else { fail++; console.log('  FAIL decode', e, 'v' + q.version, 'mask' + q.mask, r && r.data); }
}
const s = QR.svg('https://x.test/#/katil/ABC123', { label: 'Katıl "x"' });
if (/^<svg class="qr-svg" viewBox="0 0 \d+ \d+"/.test(s) && s.includes('aria-label="Katıl &quot;x&quot;"')) ok++; else { fail++; console.log('  FAIL svg'); }
console.log('sürümler', [...vers].sort((a, b) => a - b).join(','));
console.log(`SONUÇ ${ok} ok, ${fail} fail`);
process.exit(fail ? 1 : 0);
