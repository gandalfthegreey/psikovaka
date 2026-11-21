/**
 * PsikoVaka — küçük QR kodu üreticisi (yalnızca bayt kipi, sürüm 1–10, hata düzeltme L/M/Q/H).
 * Ağ yok, bağımlılık yok; SVG üretir. Sınıf modunda katılım bağlantısını projeksiyonda göstermek için.
 *
 * Algoritma ISO/IEC 18004 (QR Code) standardını izler; yapı ve tablolar Project Nayuki'nin
 * "QR Code generator library" (MIT Lisansı, Copyright (c) Project Nayuki, https://www.nayuki.io/page/qr-code-generator-library)
 * kitaplığından uyarlanarak kısaltıldı. "QR Code", DENSO WAVE INCORPORATED'ın tescilli markasıdır.
 *
 * MIT Lisansı: Bu yazılımın bir kopyasını edinen herkese, yazılımı kısıtlamasız kullanma, kopyalama, değiştirme, birleştirme,
 * yayımlama, dağıtma hakkı ücretsiz verilir; yukarıdaki telif hakkı bildirimi ve bu izin bildirimi tüm kopyalarda yer almalıdır.
 * YAZILIM "OLDUĞU GİBİ" SUNULUR, HİÇBİR GARANTİ VERİLMEZ.
 *
 * Kullanım: PsikoVakaQR.encode('https://…', 'M') -> { size, get(x, y) } | null
 *           PsikoVakaQR.svg('https://…', { ecl: 'M', label: 'Katılım bağlantısı' }) -> '<svg …>' | ''
 */
(function (global) {
    'use strict';
    const ECL = { L: 0, M: 1, Q: 2, H: 3 };
    const FORMAT_BITS = [1, 0, 3, 2];
    // [ecl][sürüm] (indeks 0 kullanılmaz)
    const ECC_PER_BLOCK = [
        [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18],
        [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26],
        [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24],
        [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28]
    ];
    const NUM_BLOCKS = [
        [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4],
        [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5],
        [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8],
        [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8]
    ];
    const MAX_VER = 10;

    function rawModules(ver) {
        let r = (16 * ver + 128) * ver + 64;
        if (ver >= 2) { const n = Math.floor(ver / 7) + 2; r -= (25 * n - 10) * n - 55; if (ver >= 7) r -= 36; }
        return r;
    }
    function dataCodewords(ver, e) { return Math.floor(rawModules(ver) / 8) - ECC_PER_BLOCK[e][ver] * NUM_BLOCKS[e][ver]; }

    function gfMul(x, y) {
        let z = 0;
        for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11d); z ^= ((y >>> i) & 1) * x; }
        return z & 0xff;
    }
    function rsDivisor(deg) {
        const r = new Array(deg).fill(0); r[deg - 1] = 1;
        let root = 1;
        for (let i = 0; i < deg; i++) {
            for (let j = 0; j < deg; j++) { r[j] = gfMul(r[j], root); if (j + 1 < deg) r[j] ^= r[j + 1]; }
            root = gfMul(root, 0x02);
        }
        return r;
    }
    function rsRemainder(data, div) {
        const r = div.map(() => 0);
        for (const b of data) {
            const f = b ^ r.shift(); r.push(0);
            div.forEach((c, i) => { r[i] ^= gfMul(c, f); });
        }
        return r;
    }
    function utf8(str) {
        const out = [];
        const s = unescape(encodeURIComponent(String(str)));
        for (let i = 0; i < s.length; i++) out.push(s.charCodeAt(i));
        return out;
    }

    function encode(text, eclName) {
        const e = ECL[eclName] != null ? ECL[eclName] : ECL.M;
        const bytes = utf8(text);
        let ver = 0;
        for (let v = 1; v <= MAX_VER; v++) {
            const cc = v < 10 ? 8 : 16;
            if (4 + cc + bytes.length * 8 <= dataCodewords(v, e) * 8) { ver = v; break; }
        }
        if (!ver) return null;
        // bit akışı
        const bits = [];
        const put = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
        put(4, 4); put(bytes.length, ver < 10 ? 8 : 16); bytes.forEach(b => put(b, 8));
        const cap = dataCodewords(ver, e) * 8;
        put(0, Math.min(4, cap - bits.length));
        put(0, (8 - bits.length % 8) % 8);
        for (let pad = 0xec; bits.length < cap; pad ^= 0xec ^ 0x11) put(pad, 8);
        const data = [];
        for (let i = 0; i < bits.length; i += 8) { let b = 0; for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j]; data.push(b); }
        // hata düzeltme + serpiştirme
        const nb = NUM_BLOCKS[e][ver], eccLen = ECC_PER_BLOCK[e][ver], raw = Math.floor(rawModules(ver) / 8);
        const nShort = nb - raw % nb, shortLen = Math.floor(raw / nb);
        const div = rsDivisor(eccLen);
        const blocks = [];
        for (let i = 0, k = 0; i < nb; i++) {
            const dat = data.slice(k, k + shortLen - eccLen + (i < nShort ? 0 : 1));
            k += dat.length;
            const ecc = rsRemainder(dat, div);
            if (i < nShort) dat.push(0);
            blocks.push(dat.concat(ecc));
        }
        const cw = [];
        for (let i = 0; i < blocks[0].length; i++) blocks.forEach((b, j) => { if (i !== shortLen - eccLen || j >= nShort) cw.push(b[i]); });

        // matris
        const size = ver * 4 + 17;
        const mod = [], fn = [];
        for (let y = 0; y < size; y++) { mod.push(new Array(size).fill(false)); fn.push(new Array(size).fill(false)); }
        const setF = (x, y, d) => { mod[y][x] = d; fn[y][x] = true; };
        for (let i = 0; i < size; i++) { setF(6, i, i % 2 === 0); setF(i, 6, i % 2 === 0); }
        const finder = (cx, cy) => {
            for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
                const d = Math.max(Math.abs(dx), Math.abs(dy)), x = cx + dx, y = cy + dy;
                if (x >= 0 && x < size && y >= 0 && y < size) setF(x, y, d !== 2 && d !== 4);
            }
        };
        finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
        const align = [];
        if (ver > 1) {
            const n = Math.floor(ver / 7) + 2;
            const step = Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2;
            align.push(6);
            for (let pos = size - 7; align.length < n; pos -= step) align.splice(1, 0, pos);
        }
        align.forEach((ay, i) => align.forEach((ax, j) => {
            const last = align.length - 1;
            if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) return;
            for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) setF(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
        }));
        const drawFormat = (mask) => {
            const d = FORMAT_BITS[e] << 3 | mask;
            let rem = d;
            for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
            const b = (d << 10 | rem) ^ 0x5412;
            const bit = (i) => ((b >>> i) & 1) !== 0;
            for (let i = 0; i <= 5; i++) setF(8, i, bit(i));
            setF(8, 7, bit(6)); setF(8, 8, bit(7)); setF(7, 8, bit(8));
            for (let i = 9; i < 15; i++) setF(14 - i, 8, bit(i));
            for (let i = 0; i < 8; i++) setF(size - 1 - i, 8, bit(i));
            for (let i = 8; i < 15; i++) setF(8, size - 15 + i, bit(i));
            setF(8, size - 8, true);
        };
        drawFormat(0);
        if (ver >= 7) {
            let rem = ver;
            for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
            const b = ver << 12 | rem;
            for (let i = 0; i < 18; i++) {
                const d = ((b >>> i) & 1) !== 0, a = size - 11 + i % 3, c = Math.floor(i / 3);
                setF(a, c, d); setF(c, a, d);
            }
        }
        // veri modülleri (zikzak)
        let k = 0;
        for (let right = size - 1; right >= 1; right -= 2) {
            if (right === 6) right = 5;
            for (let v = 0; v < size; v++) for (let j = 0; j < 2; j++) {
                const x = right - j, up = ((right + 1) & 2) === 0, y = up ? size - 1 - v : v;
                if (!fn[y][x] && k < cw.length * 8) { mod[y][x] = ((cw[k >>> 3] >>> (7 - (k & 7))) & 1) !== 0; k++; }
            }
        }
        const maskFn = [
            (x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x) => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
            (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => x * y % 2 + x * y % 3 === 0,
            (x, y) => (x * y % 2 + x * y % 3) % 2 === 0, (x, y) => ((x + y) % 2 + x * y % 3) % 2 === 0
        ];
        const applyMask = (m) => { for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!fn[y][x] && maskFn[m](x, y)) mod[y][x] = !mod[y][x]; };
        const penalty = () => {
            let p = 0, dark = 0;
            const line = (get) => {
                for (let a = 0; a < size; a++) {
                    let run = 1;
                    const seq = [];
                    for (let b = 0; b < size; b++) {
                        const c = get(a, b); seq.push(c ? 1 : 0);
                        if (b > 0) { if (c === get(a, b - 1)) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; }
                    }
                    const s = '0000' + seq.join('') + '0000';
                    for (const pat of ['10111010000', '00001011101']) { let i = s.indexOf(pat); while (i >= 0) { p += 40; i = s.indexOf(pat, i + 1); } }
                }
            };
            line((a, b) => mod[a][b]); line((a, b) => mod[b][a]);
            for (let y = 0; y < size - 1; y++) for (let x = 0; x < size - 1; x++) {
                const c = mod[y][x];
                if (c === mod[y][x + 1] && c === mod[y + 1][x] && c === mod[y + 1][x + 1]) p += 3;
            }
            for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (mod[y][x]) dark++;
            const total = size * size;
            p += (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10;
            return p;
        };
        let best = 0, bestP = Infinity;
        for (let m = 0; m < 8; m++) {
            applyMask(m); drawFormat(m);
            const p = penalty();
            if (p < bestP) { bestP = p; best = m; }
            applyMask(m);
        }
        applyMask(best); drawFormat(best);
        return { size, version: ver, mask: best, get: (x, y) => x >= 0 && y >= 0 && x < size && y < size && mod[y][x] };
    }

    /** Kare SVG (4 modül sessiz alan). Renkler currentColor/zemin sınıfıyla CSS'ten gelir. */
    function svg(text, opts) {
        const o = opts || {};
        const q = encode(text, o.ecl || 'M');
        if (!q) return '';
        const n = q.size + 8;
        let d = '';
        for (let y = 0; y < q.size; y++) for (let x = 0; x < q.size; x++) if (q.get(x, y)) d += `M${x + 4} ${y + 4}h1v1h-1z`;
        const label = String(o.label || 'QR kodu').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
        return `<svg class="${o.cls || 'qr-svg'}" viewBox="0 0 ${n} ${n}" role="img" aria-label="${label}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><rect class="qr-bg" width="${n}" height="${n}"/><path class="qr-fg" d="${d}"/></svg>`;
    }

    global.PsikoVakaQR = { encode, svg };
})(typeof window !== 'undefined' ? window : globalThis);
