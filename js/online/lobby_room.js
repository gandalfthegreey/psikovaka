/**
 * PsikoVaka Online — lobi "terapi odası" (özgün çizim) + yürüme motoru.
 * Oda sahne boyutuna göre JS ile çizilir (iki yerleşim: geniş / dar), katmanlıdır:
 *   arka SVG (duvar, pencere, kitaplık, şömine, saat, diplomalar, zemin, halı) → yerdeki eşyalar (koltuk, kanepe,
 *   sehpa, lambader; her biri ayrı SVG, z sırası taban y'sine göre, Nöro'larla aynı sıralamada) → ön plan (saksı).
 * Konumlar 0-1 (sahne kutusuna göre; eski istemcilerle aynı koordinatlar). Yürünebilir alan: x 0.04-0.96,
 * y 0.46-0.90 eksi eşya izleri; yol: ızgara üzerinde A* + görüş hattı düzeltmesi.
 * API: NS.lobbyRoom = { create(stageEl, opts) -> room }
 *   room.layout, room.objects, room.nearestFree(x,y), room.route(from,to,seat), room.spotPos(spot),
 *   room.walker (bkz. createWalker), room.relayout(), room.destroy()
 */
(function (global) {
    'use strict';
    const NS = global.PsikoVakaOnline;

    const FLOOR_LINE = 0.40, FT = 0.46, FB = 0.90, XMIN = 0.04, XMAX = 0.96;
    const f1 = (n) => Math.round(n * 10) / 10;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    // ------------------------------------------------------------ yerleşim
    /** Sahne piksel boyutundan yerleşim: eşyalar (normalize çapa + px boyut), engeller, etkileşimli nesneler. */
    function computeLayout(W, H) {
        const narrow = W < 560;
        const u = narrow ? Math.max(W / 1000, Math.min(H / 560, W / 620)) : Math.min(W / 1000, H / 560);
        const P = narrow ? {
            window: { x: 0.15, w: 108, top: 0.07, hMax: 150 },
            shelf: { x: 0.875, w: 112, top: 0.05, base: 0.465 },
            fire: { x: 0.53, w: 196, base: 0.48 },
            clock: { x: 0.31, y: 0.13, r: 21 },
            diplomas: [],
            chair: { x: 0.17, base: 0.6, w: 136 },
            table: { x: 0.385, base: 0.545, w: 66 },
            couch: { x: 0.74, base: 0.615, w: 250 },
            lamp: { x: 0.035, base: 0.51, w: 52 },
            plant: { x: 0.955, base: 1.02, w: 104 },
            rug: [[0.18, 0.66], [0.82, 0.66], [0.92, 0.96], [0.08, 0.96]]
        } : {
            window: { x: 0.11, w: 146, top: 0.06, hMax: 190 },
            shelf: { x: 0.295, w: 168, top: 0.045, base: 0.465 },
            fire: { x: 0.505, w: 226, base: 0.48 },
            clock: { x: 0.66, y: 0.14, r: 27 },
            diplomas: [{ x: 0.765, y: 0.1 }, { x: 0.855, y: 0.13 }],
            chair: { x: 0.165, base: 0.72, w: 168 },
            table: { x: 0.305, base: 0.615, w: 82 },
            couch: { x: 0.78, base: 0.705, w: 318 },
            lamp: { x: 0.955, base: 0.56, w: 62 },
            plant: { x: 0.035, base: 1.02, w: 124 },
            rug: [[0.31, 0.585], [0.73, 0.585], [0.79, 0.885], [0.25, 0.885]]
        };
        const px = (n) => n * u;
        const nx = (p) => p / W, ny = (p) => p / H;
        const L = { W, H, u, narrow, P, floorY: FLOOR_LINE * H, items: [], obstacles: [], objects: [] };
        // yerdeki eşyalar: tasarım kutusu (vw×vh), genişlik px, taban y
        const item = (id, x, base, w, vw, vh, fg) => {
            const wpx = px(w), hpx = wpx * vh / vw;
            const left = clamp(x * W - wpx / 2, 0, W - wpx);   // sahne kenarından taşmasın
            const it = { id, x: (left + wpx / 2) / W, base, w: wpx, h: hpx, vw, vh, fg: !!fg, left, top: base * H - hpx };
            L.items.push(it);
            return it;
        };
        const chair = item('chair', P.chair.x, P.chair.base, P.chair.w, 160, 150);
        const table = item('table', P.table.x, P.table.base, P.table.w, 90, 120);
        const couch = item('couch', P.couch.x, P.couch.base, P.couch.w, 320, 150);
        const lamp = item('lamp', P.lamp.x, P.lamp.base, P.lamp.w, 70, 240);
        item('plant', P.plant.x, P.plant.base, P.plant.w, 120, 180, true);
        // duvar eşyaları (arka SVG'de çizilir) — boyutlar px
        const win = { cx: P.window.x * W, w: px(P.window.w), top: P.window.top * H };
        win.h = Math.min(px(P.window.hMax), FLOOR_LINE * H - win.top - px(narrow ? 36 : 48));
        const shelf = { cx: P.shelf.x * W, w: px(P.shelf.w), top: P.shelf.top * H, bottom: P.shelf.base * H };
        const fire = { cx: P.fire.x * W, w: px(P.fire.w), bottom: P.fire.base * H };
        fire.h = Math.min(px(190), (P.fire.base - 0.17) * H);
        L.win = win; L.shelf = shelf; L.fire = fire;
        // engeller (normalize; yürüyen Nöro'nun yarı genişliği ızgarada ayrıca eklenir)
        const ob = (x0, y0, x1, y1) => L.obstacles.push({ x0, y0, x1, y1 });
        ob(nx(shelf.cx - shelf.w / 2), 0, nx(shelf.cx + shelf.w / 2), P.shelf.base + 0.005);
        ob(nx(fire.cx - fire.w * 0.56), 0, nx(fire.cx + fire.w * 0.56), P.fire.base + 0.012);
        const foot = (it, fw, depth) => ob(it.x - nx(it.w * fw / 2), it.base - depth, it.x + nx(it.w * fw / 2), it.base);
        foot(chair, 0.86, narrow ? 0.085 : 0.1);
        foot(couch, 0.94, narrow ? 0.085 : 0.1);
        foot(table, 0.7, 0.035);
        foot(lamp, 0.5, 0.025);
        // etkileşimli nesneler: yaklaşma noktası, oturma yerleri, dokunma kutusu (px)
        const seatPt = (it, dx, dy) => ({ x: it.x + nx((dx / it.vw - 0.5) * it.w), y: it.base - ny((1 - dy / it.vh) * it.h) });
        const hitOf = (l, t, w, h) => ({ l, t, w, h });
        L.objects = [
            { id: 'shelf', label: 'Kitaplığa git', act: 'read', approach: { x: P.shelf.x, y: P.shelf.base + 0.05 }, facing: 'front',
                hit: hitOf(shelf.cx - shelf.w / 2, shelf.top, shelf.w, shelf.bottom - shelf.top) },
            { id: 'couch', label: 'Kanepeye otur', act: 'read', approach: { x: couch.x, y: couch.base + 0.04 }, facing: 'front',
                seats: [seatPt(couch, 98, 97), seatPt(couch, 160, 97), seatPt(couch, 222, 97)],
                hit: hitOf(couch.left, couch.top, couch.w, couch.h) },
            { id: 'table', label: 'Sehpada çay iç', act: 'tea', approach: { x: table.x + nx(table.w * 0.2), y: table.base + 0.04 }, facing: 'front',
                hit: hitOf(table.left, table.top, table.w, table.h) },
            { id: 'chair', label: 'Koltukta kestir', act: 'doze', approach: { x: chair.x + nx(chair.w * 0.42), y: chair.base + 0.04 }, facing: 'right',
                seats: [seatPt(chair, 84, 104)], hit: hitOf(chair.left, chair.top, chair.w, chair.h) },
            { id: 'fire', label: 'Şöminede ısın', act: 'stretch', approach: { x: P.fire.x, y: P.fire.base + 0.055 }, facing: 'front',
                hit: hitOf(fire.cx - fire.w / 2, fire.bottom - fire.h, fire.w, fire.h) },
            { id: 'window', label: 'Pencereden dışarı bak', act: 'think', approach: { x: P.window.x, y: FT + 0.03 }, facing: 'front',
                hit: hitOf(win.cx - win.w / 2 - px(10), win.top - px(8), win.w + px(20), win.h + px(30)) }
        ];
        L.objects.find(o => o.id === 'couch').base = couch.base;
        L.objects.find(o => o.id === 'chair').base = chair.base;
        L.objects.forEach(o => { o.approach.x = clamp(o.approach.x, XMIN + 0.01, XMAX - 0.01); o.approach.y = clamp(o.approach.y, FT, FB); });
        return L;
    }

    // ------------------------------------------------------------ ızgara + yol bulma
    const GC = 56, GR = 26;
    function buildGrid(L) {
        const mx = 0.022 * (L.narrow ? 1.25 : 1), my = 0.014;
        const blocked = new Uint8Array(GC * GR);
        const cx = (i) => XMIN + (i + 0.5) * (XMAX - XMIN) / GC;
        const cy = (j) => FT + (j + 0.5) * (FB - FT) / GR;
        for (let j = 0; j < GR; j++) for (let i = 0; i < GC; i++) {
            const x = cx(i), y = cy(j);
            if (L.obstacles.some(o => x > o.x0 - mx && x < o.x1 + mx && y > o.y0 - my && y < o.y1 + my)) blocked[j * GC + i] = 1;
        }
        const ci = (x) => clamp(Math.floor((x - XMIN) / (XMAX - XMIN) * GC), 0, GC - 1);
        const cj = (y) => clamp(Math.floor((y - FT) / (FB - FT) * GR), 0, GR - 1);
        const free = (x, y) => x >= XMIN && x <= XMAX && y >= FT && y <= FB && !blocked[cj(y) * GC + ci(x)];
        // dünyadaki uzaklık (en-boy oranı farklı istemcilerde süre aynı olsun diye sabit ölçek)
        const dist = (a, b) => Math.hypot((a.x - b.x) * 1000, (a.y - b.y) * 600);
        function nearestFree(x, y) {
            x = clamp(x, XMIN, XMAX); y = clamp(y, FT, FB);
            if (free(x, y)) return { x, y };
            let best = null, bd = Infinity;
            for (let j = 0; j < GR; j++) for (let i = 0; i < GC; i++) {
                if (blocked[j * GC + i]) continue;
                const p = { x: cx(i), y: cy(j) }, d = dist(p, { x, y });
                if (d < bd) { bd = d; best = p; }
            }
            return best || { x: 0.5, y: 0.8 };
        }
        function lineFree(a, b) {
            const n = Math.ceil(dist(a, b) / 6) + 1;
            for (let k = 1; k < n; k++) { const t = k / n; if (!free(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)) return false; }
            return true;
        }
        function astar(a, b) {
            const s = cj(a.y) * GC + ci(a.x), g = cj(b.y) * GC + ci(b.x);
            if (s === g) return [];
            const gS = new Float64Array(GC * GR).fill(Infinity), from = new Int32Array(GC * GR).fill(-1), done = new Uint8Array(GC * GR);
            const pos = (k) => ({ x: cx(k % GC), y: cy(Math.floor(k / GC)) });
            const gp = pos(g);
            const open = [s]; gS[s] = 0;
            const fS = new Map([[s, dist(pos(s), gp)]]);
            let guard = 0;
            while (open.length && guard++ < 4000) {
                let bi = 0; for (let q = 1; q < open.length; q++) if (fS.get(open[q]) < fS.get(open[bi])) bi = q;
                const k = open.splice(bi, 1)[0];
                if (k === g) break;
                done[k] = 1;
                const i = k % GC, j = Math.floor(k / GC), pk = pos(k);
                for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
                    if (!di && !dj) continue;
                    const ii = i + di, jj = j + dj;
                    if (ii < 0 || jj < 0 || ii >= GC || jj >= GR) continue;
                    const n = jj * GC + ii;
                    if (blocked[n] || done[n]) continue;
                    if (di && dj && (blocked[j * GC + ii] || blocked[jj * GC + i])) continue;
                    const ng = gS[k] + dist(pk, pos(n));
                    if (ng < gS[n]) { gS[n] = ng; from[n] = k; fS.set(n, ng + dist(pos(n), gp)); if (!open.includes(n)) open.push(n); }
                }
            }
            if (from[g] < 0) return null;
            const out = []; let k = g;
            while (k !== s && k >= 0) { out.push(pos(k)); k = from[k]; }
            return out.reverse();
        }
        /** a'dan b'ye nokta listesi (a hariç). seat: b bir oturma yeri (engelin içinde) → yaklaşma noktasından sonra eklenir. */
        function route(a, b, approach) {
            const pts = [];
            let start = a;
            if (!free(a.x, a.y)) { start = nearestFree(a.x, a.y); pts.push(start); }   // oturduğu yerden kalkış
            const goal = approach ? nearestFree(approach.x, approach.y) : nearestFree(b.x, b.y);
            let mid;
            if (lineFree(start, goal)) mid = [];
            else {
                const raw = astar(start, goal);
                mid = raw ? raw.slice(0, -1) : [];
                // görüş hattı düzeltmesi
                const sm = []; let cur = start;
                for (let k = 0; k < mid.length; k++) {
                    const nxt = (k + 1 < mid.length) ? mid[k + 1] : goal;
                    if (!lineFree(cur, nxt)) { sm.push(mid[k]); cur = mid[k]; }
                }
                mid = sm;
            }
            pts.push(...mid, goal);
            if (approach) pts.push({ x: b.x, y: b.y });
            return pts;
        }
        return { free, nearestFree, route, dist, blocked, GC, GR };
    }

    // ------------------------------------------------------------ çizim yardımcıları
    function mulberry(seed) { let t = seed >>> 0; return () => { t = (t + 0x6D2B79F5) >>> 0; let r = Math.imul(t ^ (t >>> 15), 1 | t); r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r; return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
    const OUT = '#3a2a24';
    function timeOfDay(h) { return h >= 6 && h < 10 ? 'morning' : h >= 10 && h < 17 ? 'day' : h >= 17 && h < 20 ? 'evening' : 'night'; }

    function drawWindow(x, y, w, h, u) {
        const fw = Math.max(5, 9 * u);       // çerçeve
        const sx = x - w / 2;
        const rnd = mulberry(7);
        const stars = Array.from({ length: 9 }, () => `<circle cx="${f1(sx + fw + rnd() * (w - 2 * fw))}" cy="${f1(y + fw + rnd() * (h * 0.6))}" r="${f1(0.8 + rnd() * 1.1)}"/>`).join('');
        const cw = w * 0.34;   // perde
        const fold = (cx0, dir) => {
            const top = y - 10 * u, bot = y + h + 16 * u;
            const d = `M${f1(cx0)} ${f1(top)}L${f1(cx0 + dir * cw)} ${f1(top)}Q${f1(cx0 + dir * cw * 0.55)} ${f1(y + h * 0.45)} ${f1(cx0 + dir * cw * 0.78)} ${f1(bot)}L${f1(cx0 - dir * 4 * u)} ${f1(bot)}Z`;
            const l1 = `M${f1(cx0 + dir * cw * 0.3)} ${f1(top + 4)}Q${f1(cx0 + dir * cw * 0.2)} ${f1(y + h * 0.5)} ${f1(cx0 + dir * cw * 0.25)} ${f1(bot - 2)}`;
            const l2 = `M${f1(cx0 + dir * cw * 0.62)} ${f1(top + 4)}Q${f1(cx0 + dir * cw * 0.42)} ${f1(y + h * 0.5)} ${f1(cx0 + dir * cw * 0.55)} ${f1(bot - 2)}`;
            return `<path class="olr-curtain" d="${d}"/><path class="olr-curtain-fold" d="${l1}${l2}"/>`;
        };
        return `<g class="olr-window">
            <rect class="olr-sky" x="${f1(sx)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}"/>
            <g class="olr-stars">${stars}</g>
            <circle class="olr-sun" cx="${f1(sx + w * 0.7)}" cy="${f1(y + h * 0.3)}" r="${f1(Math.max(5, 11 * u))}"/>
            <path class="olr-hills" d="M${f1(sx)} ${f1(y + h * 0.78)}Q${f1(sx + w * 0.3)} ${f1(y + h * 0.6)} ${f1(sx + w * 0.55)} ${f1(y + h * 0.74)}T${f1(sx + w)} ${f1(y + h * 0.66)}V${f1(y + h)}H${f1(sx)}Z"/>
            <path class="olr-tree" d="M${f1(sx + w * 0.2)} ${f1(y + h * 0.74)}c${f1(-8 * u)} 0 ${f1(-9 * u)} ${f1(-14 * u)} 0 ${f1(-20 * u)}c${f1(9 * u)} ${f1(6 * u)} ${f1(8 * u)} ${f1(20 * u)} 0 ${f1(20 * u)}z"/>
            <rect x="${f1(sx)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="none" stroke="#8a5a3c" stroke-width="${f1(fw)}"/>
            <path d="M${f1(x)} ${f1(y)}V${f1(y + h)}M${f1(sx)} ${f1(y + h * 0.48)}H${f1(sx + w)}" stroke="#8a5a3c" stroke-width="${f1(fw * 0.6)}"/>
            <rect x="${f1(sx - 8 * u)}" y="${f1(y + h)}" width="${f1(w + 16 * u)}" height="${f1(Math.max(4, 8 * u))}" rx="${f1(2 * u)}" fill="#a06d4b" stroke="${OUT}" stroke-width="1.2"/>
            <g transform="translate(${f1(sx + w * 0.78)} ${f1(y + h)})"><path d="M${f1(-7 * u)} 0l${f1(2 * u)} ${f1(-9 * u)}h${f1(10 * u)}l${f1(2 * u)} ${f1(9 * u)}z" fill="#c8754d" stroke="${OUT}" stroke-width="1"/>
                <path d="M0 ${f1(-9 * u)}c${f1(-1 * u)} ${f1(-7 * u)} ${f1(-6 * u)} ${f1(-9 * u)} ${f1(-6 * u)} ${f1(-14 * u)}M0 ${f1(-9 * u)}c${f1(2 * u)} ${f1(-6 * u)} ${f1(7 * u)} ${f1(-7 * u)} ${f1(6 * u)} ${f1(-13 * u)}" fill="none" stroke="#4f8a4f" stroke-width="${f1(Math.max(2, 3.4 * u))}" stroke-linecap="round"/></g>
            <rect x="${f1(sx - cw * 0.15)}" y="${f1(y - 14 * u)}" width="${f1(w + cw * 0.3)}" height="${f1(Math.max(3, 5 * u))}" rx="2" fill="#6b4630"/>
            ${fold(sx + 2, -1)}${fold(sx + w - 2, 1)}
        </g>`;
    }

    function drawShelf(S, u, narrow) {
        const { cx, w, top, bottom } = S;
        const x0 = cx - w / 2, side = Math.max(5, 9 * u), h = bottom - top;
        const n = narrow ? 4 : 5;
        const rows = Array.from({ length: n }, (_, i) => top + side + (h - side * 2) * (i + 1) / n);
        const rnd = mulberry(narrow ? 11 : 3);
        const cols = ['#c0533f', '#2f6f8f', '#d9a441', '#6a8f5a', '#7b5ea7', '#e0b48f', '#38506e', '#a3442f', '#4d8c84', '#d97a5a'];
        let books = '';
        rows.forEach((ry, ri) => {
            let bx = x0 + side + 2;
            const rowTop = ri === 0 ? top + side : rows[ri - 1] + Math.max(3, 5 * u);
            const maxH = ry - rowTop - 2;
            const end = x0 + w - side - 2;
            while (bx < end - 4 * u) {
                const r = rnd();
                if (r < 0.08 && ri % 2 === 1) {   // küçük beyin modeli / saksı
                    const s = Math.min(maxH * 0.7, 16 * u);
                    if (bx + s * 1.4 > end) break;
                    books += ri === 1 ? `<g><ellipse cx="${f1(bx + s * 0.7)}" cy="${f1(ry - s * 0.55)}" rx="${f1(s * 0.7)}" ry="${f1(s * 0.5)}" fill="#f2a7b5" stroke="${OUT}" stroke-width="1.2"/><path d="M${f1(bx + s * 0.3)} ${f1(ry - s * 0.6)}q${f1(s * 0.2)} ${f1(-s * 0.3)} ${f1(s * 0.4)} 0t${f1(s * 0.4)} 0M${f1(bx + s * 0.7)} ${f1(ry - s)}v${f1(s * 0.9)}" fill="none" stroke="#c76b80" stroke-width="1.1"/></g>`
                        : `<g><path d="M${f1(bx + s * 0.25)} ${f1(ry)}l${f1(-s * 0.1)} ${f1(-s * 0.5)}h${f1(s * 1.1)}l${f1(-s * 0.1)} ${f1(s * 0.5)}z" fill="#c8754d" stroke="${OUT}" stroke-width="1"/><circle cx="${f1(bx + s * 0.4)}" cy="${f1(ry - s * 0.75)}" r="${f1(s * 0.32)}" fill="#5c9a5c"/><circle cx="${f1(bx + s * 0.75)}" cy="${f1(ry - s * 0.85)}" r="${f1(s * 0.35)}" fill="#6fae64"/></g>`;
                    bx += s * 1.5;
                    continue;
                }
                const bw = (5 + rnd() * 6) * u, bh = maxH * (0.62 + rnd() * 0.36);
                if (bx + bw > end) break;
                const c = cols[Math.floor(rnd() * cols.length)];
                const lean = r > 0.9 && bx + bw * 2 < end;
                if (lean) {
                    books += `<rect x="${f1(bx + bw * 0.4)}" y="${f1(ry - bh)}" width="${f1(bw)}" height="${f1(bh)}" rx="1" fill="${c}" stroke="${OUT}" stroke-width=".9" transform="rotate(14 ${f1(bx + bw * 1.4)} ${f1(ry)})"/>`;
                    bx += bw * 2.2;
                } else {
                    books += `<rect x="${f1(bx)}" y="${f1(ry - bh)}" width="${f1(bw)}" height="${f1(bh)}" rx="1" fill="${c}" stroke="${OUT}" stroke-width=".9"/>` +
                        (bw > 7 * u ? `<path d="M${f1(bx + bw * 0.2)} ${f1(ry - bh * 0.8)}h${f1(bw * 0.6)}" stroke="#fff" stroke-opacity=".55" stroke-width="1.2"/>` : '');
                    bx += bw + 0.6;
                }
            }
        });
        return `<g class="olr-shelf">
            <rect x="${f1(x0 + 4 * u)}" y="${f1(bottom - 4 * u)}" width="${f1(w - 8 * u)}" height="${f1(8 * u)}" rx="${f1(4 * u)}" fill="#000" opacity=".18"/>
            <rect x="${f1(x0)}" y="${f1(top)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(3 * u)}" fill="#7a4d33" stroke="${OUT}" stroke-width="1.6"/>
            <rect x="${f1(x0 + side)}" y="${f1(top + side)}" width="${f1(w - side * 2)}" height="${f1(h - side * 2)}" fill="#4b2f22"/>
            ${books}
            ${rows.map(ry => `<rect x="${f1(x0 + side - 1)}" y="${f1(ry)}" width="${f1(w - side * 2 + 2)}" height="${f1(Math.max(3, 5 * u))}" fill="#93603f" stroke="${OUT}" stroke-width=".8"/>`).join('')}
            <rect x="${f1(x0 - 3 * u)}" y="${f1(top - 4 * u)}" width="${f1(w + 6 * u)}" height="${f1(Math.max(4, 7 * u))}" rx="2" fill="#93603f" stroke="${OUT}" stroke-width="1.4"/>
        </g>`;
    }

    function drawFireplace(F, u, L) {
        const { cx, w, bottom, h } = F;
        const x0 = cx - w / 2, top = bottom - h;
        const mantelH = Math.max(6, 11 * u);
        const boxW = w * 0.5, boxH = h * 0.5, bx = cx - boxW / 2, by = bottom - boxH - 8 * u;
        const fl = (dx, s, cls) => {
            const fx = cx + dx * boxW, fy = bottom - 14 * u;
            return `<path class="olr-flame ${cls}" d="M${f1(fx - 9 * s * u)} ${f1(fy)}C${f1(fx - 12 * s * u)} ${f1(fy - 14 * s * u)} ${f1(fx - 2 * s * u)} ${f1(fy - 18 * s * u)} ${f1(fx)} ${f1(fy - 30 * s * u)}C${f1(fx + 4 * s * u)} ${f1(fy - 18 * s * u)} ${f1(fx + 13 * s * u)} ${f1(fy - 12 * s * u)} ${f1(fx + 9 * s * u)} ${f1(fy)}Z"/>`;
        };
        // tuğla deseni
        let bricks = '';
        const bhh = Math.max(5, 9 * u), bww = Math.max(12, 22 * u);
        for (let y = top + mantelH + 2, r = 0; y < bottom - bhh; y += bhh, r++) {
            for (let x = x0 + 4 + (r % 2 ? bww / 2 : 0); x < x0 + w - 6; x += bww) {
                const xe = Math.min(x + bww - 2, x0 + w - 4);
                if (x > bx - 3 && xe < bx + boxW + 3 && y > by - bhh) continue;
                bricks += `M${f1(x)} ${f1(y)}H${f1(xe)}`;
            }
        }
        // tablo (şöminenin üstünde): tepeler + güneş
        const pw = Math.min(w * 0.62, 140 * u), ph = Math.min(pw * 0.62, top - L.H * 0.05 - 10 * u);
        const pxx = cx - pw / 2, pyy = top - ph - 12 * u;
        const painting = ph > 18 ? `<g class="olr-painting"><rect x="${f1(pxx)}" y="${f1(pyy)}" width="${f1(pw)}" height="${f1(ph)}" fill="#e9d9b8" stroke="#b2884c" stroke-width="${f1(Math.max(3, 6 * u))}"/>
            <rect x="${f1(pxx + 5 * u)}" y="${f1(pyy + 5 * u)}" width="${f1(pw - 10 * u)}" height="${f1(ph - 10 * u)}" fill="#f2d7a6"/>
            <circle cx="${f1(pxx + pw * 0.68)}" cy="${f1(pyy + ph * 0.38)}" r="${f1(ph * 0.14)}" fill="#e9905d"/>
            <path d="M${f1(pxx + 5 * u)} ${f1(pyy + ph * 0.72)}Q${f1(pxx + pw * 0.3)} ${f1(pyy + ph * 0.42)} ${f1(pxx + pw * 0.55)} ${f1(pyy + ph * 0.66)}T${f1(pxx + pw - 5 * u)} ${f1(pyy + ph * 0.6)}V${f1(pyy + ph - 5 * u)}H${f1(pxx + 5 * u)}Z" fill="#7fa38a"/>
            <path d="M${f1(pxx + 5 * u)} ${f1(pyy + ph * 0.84)}Q${f1(pxx + pw * 0.45)} ${f1(pyy + ph * 0.66)} ${f1(pxx + pw - 5 * u)} ${f1(pyy + ph * 0.8)}V${f1(pyy + ph - 5 * u)}H${f1(pxx + 5 * u)}Z" fill="#5d8670"/></g>` : '';
        // şömine rafındaki küçük eşyalar
        const my = top;
        const vase = `<path d="M${f1(x0 + w * 0.16)} ${f1(my)}c${f1(-5 * u)} ${f1(-4 * u)} ${f1(-5 * u)} ${f1(-12 * u)} ${f1(-1 * u)} ${f1(-16 * u)}h${f1(8 * u)}c${f1(4 * u)} ${f1(4 * u)} ${f1(4 * u)} ${f1(12 * u)} ${f1(-1 * u)} ${f1(16 * u)}z" fill="#4f7fa6" stroke="${OUT}" stroke-width="1"/>
            <path d="M${f1(x0 + w * 0.16 + 3 * u)} ${f1(my - 16 * u)}c${f1(-2 * u)} ${f1(-8 * u)} ${f1(-7 * u)} ${f1(-10 * u)} ${f1(-9 * u)} ${f1(-14 * u)}M${f1(x0 + w * 0.16 + 3 * u)} ${f1(my - 16 * u)}c${f1(2 * u)} ${f1(-9 * u)} ${f1(6 * u)} ${f1(-11 * u)} ${f1(9 * u)} ${f1(-14 * u)}" stroke="#6a9a5a" stroke-width="${f1(Math.max(1.5, 2.2 * u))}" fill="none" stroke-linecap="round"/>
            <circle cx="${f1(x0 + w * 0.16 - 6 * u)}" cy="${f1(my - 30 * u)}" r="${f1(3 * u)}" fill="#f2c14e"/><circle cx="${f1(x0 + w * 0.16 + 12 * u)}" cy="${f1(my - 30 * u)}" r="${f1(3 * u)}" fill="#ef8a6b"/>`;
        const frame = `<rect x="${f1(x0 + w * 0.72)}" y="${f1(my - 18 * u)}" width="${f1(15 * u)}" height="${f1(18 * u)}" fill="#f1e2c4" stroke="#8a5a3c" stroke-width="${f1(Math.max(1.5, 2.5 * u))}"/>
            <circle cx="${f1(x0 + w * 0.72 + 7.5 * u)}" cy="${f1(my - 11 * u)}" r="${f1(3.4 * u)}" fill="#86c9f2"/>`;
        return `<g class="olr-fire">
            ${painting}
            <g class="olr-fire-glow">${[1, 0.72, 0.46].map(k => `<ellipse cx="${f1(cx)}" cy="${f1(bottom + 12 * u)}" rx="${f1(w * 0.75 * k)}" ry="${f1(30 * u * k)}"/>`).join('')}</g>
            <rect x="${f1(x0)}" y="${f1(top)}" width="${f1(w)}" height="${f1(h)}" fill="#a65d45" stroke="${OUT}" stroke-width="1.6"/>
            <path d="${bricks}" stroke="#8c4936" stroke-width="1.2"/>
            <path d="M${f1(bx)} ${f1(bottom - 6 * u)}V${f1(by + boxW * 0.32)}A${f1(boxW / 2)} ${f1(boxW * 0.36)} 0 0 1 ${f1(bx + boxW)} ${f1(by + boxW * 0.32)}V${f1(bottom - 6 * u)}Z" fill="#2a1b17" stroke="${OUT}" stroke-width="1.6"/>
            <ellipse class="olr-fire-inner" cx="${f1(cx)}" cy="${f1(bottom - 16 * u)}" rx="${f1(boxW * 0.42)}" ry="${f1(boxH * 0.36)}"/>
            <g class="olr-flames">${fl(-0.12, 0.85, 'olr-fl-a')}${fl(0.13, 0.75, 'olr-fl-b')}${fl(0, 1.08, 'olr-fl-c')}${fl(0.02, 0.55, 'olr-fl-d')}</g>
            <path d="M${f1(cx - boxW * 0.32)} ${f1(bottom - 10 * u)}l${f1(boxW * 0.6)} ${f1(-5 * u)}M${f1(cx + boxW * 0.32)} ${f1(bottom - 10 * u)}l${f1(-boxW * 0.6)} ${f1(-5 * u)}" stroke="#6b3f2a" stroke-width="${f1(Math.max(3, 6 * u))}" stroke-linecap="round"/>
            <rect x="${f1(x0 - 9 * u)}" y="${f1(top - mantelH * 0.4)}" width="${f1(w + 18 * u)}" height="${f1(mantelH)}" rx="${f1(2 * u)}" fill="#8a5a3c" stroke="${OUT}" stroke-width="1.5"/>
            ${vase}${frame}
            <rect x="${f1(x0 - 12 * u)}" y="${f1(bottom - 3 * u)}" width="${f1(w + 24 * u)}" height="${f1(Math.max(5, 9 * u))}" rx="${f1(2 * u)}" fill="#8d8178" stroke="${OUT}" stroke-width="1.4"/>
        </g>`;
    }

    function drawClock(x, y, r) {
        const ticks = Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `M${f1(x + Math.sin(a) * r * 0.78)} ${f1(y - Math.cos(a) * r * 0.78)}L${f1(x + Math.sin(a) * r * 0.9)} ${f1(y - Math.cos(a) * r * 0.9)}`; }).join('');
        const now = new Date();
        const sec = now.getHours() % 12 * 3600 + now.getMinutes() * 60 + now.getSeconds();
        // CSS animasyonu (saat 12 saatte, yelkovan 1 saatte döner); negatif gecikme şu anki zamana hizalar
        const st = (period, offs) => `style="transform-origin:${f1(x)}px ${f1(y)}px;animation-duration:${period}s;animation-delay:-${offs}s"`;
        return `<g class="olr-clock">
            <circle cx="${f1(x)}" cy="${f1(y + 2)}" r="${f1(r + 3)}" fill="#000" opacity=".15"/>
            <circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r + 3)}" fill="#7a4d33" stroke="${OUT}" stroke-width="1.4"/>
            <circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#fbf4e4"/>
            <path d="${ticks}" stroke="#3a2a24" stroke-width="${f1(Math.max(1.2, r * 0.07))}" stroke-linecap="round"/>
            <path class="olr-hand" ${st(43200, sec % 43200)} d="M${f1(x)} ${f1(y + r * 0.1)}V${f1(y - r * 0.5)}" stroke="#3a2a24" stroke-width="${f1(Math.max(2, r * 0.11))}" stroke-linecap="round"/>
            <path class="olr-hand" ${st(3600, sec % 3600)} d="M${f1(x)} ${f1(y + r * 0.12)}V${f1(y - r * 0.74)}" stroke="#3a2a24" stroke-width="${f1(Math.max(1.4, r * 0.07))}" stroke-linecap="round"/>
            <path class="olr-hand olr-hand-s" ${st(60, sec % 60)} d="M${f1(x)} ${f1(y + r * 0.16)}V${f1(y - r * 0.8)}" stroke="#c0533f" stroke-width="1.1" stroke-linecap="round"/>
            <circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(Math.max(1.5, r * 0.08))}" fill="#c0533f"/>
        </g>`;
    }

    function drawDiploma(x, y, u, i) {
        const w = 58 * u, h = 44 * u;
        return `<g class="olr-diploma"><rect x="${f1(x - w / 2 + 2)}" y="${f1(y + 3)}" width="${f1(w)}" height="${f1(h)}" fill="#000" opacity=".14"/>
            <rect x="${f1(x - w / 2)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${i ? '#2f2a28' : '#b2884c'}" stroke="${OUT}" stroke-width="1"/>
            <rect x="${f1(x - w / 2 + 5 * u)}" y="${f1(y + 5 * u)}" width="${f1(w - 10 * u)}" height="${f1(h - 10 * u)}" fill="#fbf4e4"/>
            <path d="M${f1(x - w * 0.3)} ${f1(y + h * 0.32)}h${f1(w * 0.6)}M${f1(x - w * 0.24)} ${f1(y + h * 0.48)}h${f1(w * 0.48)}M${f1(x - w * 0.28)} ${f1(y + h * 0.62)}h${f1(w * 0.3)}" stroke="#9a8f80" stroke-width="${f1(Math.max(1, 1.6 * u))}"/>
            <circle cx="${f1(x + w * 0.22)}" cy="${f1(y + h * 0.66)}" r="${f1(5 * u)}" fill="${i ? '#2f6f8f' : '#c0533f'}"/></g>`;
    }

    function drawFloorAndWall(L) {
        const { W, H, u, floorY } = L;
        const wainTop = floorY - Math.max(26, 64 * u);
        // perspektifli tahta derzleri: kaçış noktası duvarın üstünde ortada
        const vx = W / 2, vy = floorY - H * 1.1;
        let seams = '';
        const n = L.narrow ? 9 : 15;
        for (let i = -3; i <= n + 3; i++) {
            const xb = (i / n) * W;
            const t = (floorY - vy) / (H - vy);
            const xt = vx + (xb - vx) * t;
            // sahne dışına taşan kısmı kırp (yalnızca görünür parça çizilir)
            let t0 = 0, t1 = 1;
            const dxl = xb - xt;
            if (dxl !== 0) {
                const ta = (0 - xt) / dxl, tb = (W - xt) / dxl;
                t0 = Math.max(t0, Math.min(ta, tb)); t1 = Math.min(t1, Math.max(ta, tb));
            } else if (xt < 0 || xt > W) continue;
            if (t1 <= t0) continue;
            const yA = floorY + (H - floorY) * t0, yB = floorY + (H - floorY) * t1;
            seams += `M${f1(xt + dxl * t0)} ${f1(yA)}L${f1(xt + dxl * t1)} ${f1(yB)}`;
        }
        let rows = '';
        for (let k = 1; k < 9; k++) { const y = floorY + (H - floorY) * Math.pow(k / 9, 1.35); rows += `M0 ${f1(y)}H${f1(W)}`; }
        const panels = [];
        const pn = L.narrow ? 4 : 7;
        for (let i = 0; i < pn; i++) {
            const pw = W / pn;
            panels.push(`<rect x="${f1(i * pw + 7 * u)}" y="${f1(wainTop + 9 * u)}" width="${f1(pw - 14 * u)}" height="${f1(floorY - wainTop - 18 * u)}" rx="${f1(2 * u)}" class="olr-panel"/>`);
        }
        const r = L.P.rug.map(([x, y]) => [x * W, y * H]);
        const rp = (pts) => 'M' + pts.map(p => `${f1(p[0])} ${f1(p[1])}`).join('L') + 'Z';
        const inset = (k) => { const c = [W * 0.5 * (L.P.rug[0][0] + L.P.rug[1][0]), H * 0.5 * (L.P.rug[0][1] + L.P.rug[2][1])]; return r.map(p => [c[0] + (p[0] - c[0]) * k, c[1] + (p[1] - c[1]) * k]); };
        // pencere ışığı: pencereden zemine düşen yumuşak dörtgen
        const wx = L.win.cx, ww = L.win.w;
        const beam = `M${f1(wx - ww * 0.42)} ${f1(floorY + 4)}L${f1(wx + ww * 0.42)} ${f1(floorY + 4)}L${f1(wx + ww * 1.25)} ${f1(floorY + (H - floorY) * 0.55)}L${f1(wx + ww * 0.05)} ${f1(floorY + (H - floorY) * 0.55)}Z`;
        const fringe = (a, b) => { let d = ''; for (let k = 0; k <= 14; k++) { const x = a[0] + (b[0] - a[0]) * k / 14, y = a[1] + (b[1] - a[1]) * k / 14; d += `M${f1(x)} ${f1(y)}v${f1(5 * u)}`; } return d; };
        return `
            <rect class="olr-wall" x="0" y="0" width="${W}" height="${f1(floorY)}"/>
            <path class="olr-wall-stripes" d="${Array.from({ length: Math.ceil(W / (26 * u)) + 1 }, (_, i) => `M${f1(i * 26 * u)} 0V${f1(wainTop)}`).join('')}"/>
            <rect class="olr-wain" x="0" y="${f1(wainTop)}" width="${W}" height="${f1(floorY - wainTop)}"/>
            ${panels.join('')}
            <rect class="olr-rail" x="0" y="${f1(wainTop - 3 * u)}" width="${W}" height="${f1(Math.max(3, 6 * u))}"/>
            <rect class="olr-floor" x="0" y="${f1(floorY)}" width="${W}" height="${f1(H - floorY)}"/>
            <path class="olr-seams" d="${seams}${rows}"/>
            <rect class="olr-floor-shade" x="0" y="${f1(floorY)}" width="${W}" height="${f1((H - floorY) * 0.35)}"/>
            <path class="olr-beam" d="${beam}"/>
            <rect class="olr-base" x="0" y="${f1(floorY - 4 * u)}" width="${W}" height="${f1(Math.max(4, 9 * u))}"/>
            <g class="olr-rug"><path d="${rp(r)}" class="olr-rug-a"/><path d="${rp(inset(0.84))}" class="olr-rug-b"/><path d="${rp(inset(0.66))}" class="olr-rug-a"/>
                <path d="${rp(inset(0.4))}" class="olr-rug-c"/><path d="${fringe(r[3], r[2])}" class="olr-rug-fringe"/></g>`;
    }

    function renderBack(L) {
        const { W, H, u } = L;
        const tod = timeOfDay(new Date().getHours());
        return `<svg class="olr-back olr-t-${tod}" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true" focusable="false">
            ${drawFloorAndWall(L)}
            ${drawWindow(L.win.cx, L.win.top, L.win.w, L.win.h, u)}
            ${drawShelf(L.shelf, u, L.narrow)}
            ${drawFireplace(L.fire, u, L)}
            ${drawClock(L.P.clock.x * W, L.P.clock.y * H, L.P.clock.r * u)}
            ${L.P.diplomas.map((d, i) => drawDiploma(d.x * W, d.y * H, u, i)).join('')}
        </svg>`;
    }

    // ---- yerdeki eşyalar (tasarım koordinatlarında)
    const ART = {
        chair: () => `
            <ellipse cx="82" cy="144" rx="70" ry="6" fill="#000" opacity=".18"/>
            <path d="M30 128l-3 16M126 128l2 15M62 132l-1 12" stroke="#4a2f22" stroke-width="5" stroke-linecap="round"/>
            <path d="M22 26Q22 8 44 8L98 12Q114 14 114 32L112 100L24 104Z" fill="#2f6f73" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>
            <path d="M34 22Q60 18 100 24" fill="none" stroke="#4a9093" stroke-width="3" stroke-linecap="round"/>
            <circle cx="48" cy="44" r="2.2" fill="#24585b"/><circle cx="76" cy="46" r="2.2" fill="#24585b"/><circle cx="100" cy="48" r="2.2" fill="#24585b"/><circle cx="60" cy="70" r="2.2" fill="#24585b"/><circle cx="90" cy="72" r="2.2" fill="#24585b"/>
            <path d="M8 74Q8 60 22 60Q36 60 36 74L36 128L10 128Z" fill="#2a6366" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>
            <path d="M26 98L134 96Q148 98 148 110L148 118L28 122Z" fill="#3b8487" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>
            <path d="M24 120L150 116L150 132Q150 136 146 136L28 138Q24 138 24 134Z" fill="#285d60" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>
            <path d="M122 70Q122 56 138 56Q154 56 154 70L154 132L124 134Z" fill="#348084" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>
            <path d="M126 66Q138 58 150 66" fill="none" stroke="#5aa3a6" stroke-width="3" stroke-linecap="round"/>
            <path d="M6 66Q14 54 30 58L40 100Q30 104 22 102L18 128L6 124Z" fill="#e3b04b" stroke="${OUT}" stroke-width="2" stroke-linejoin="round"/>
            <path d="M10 80L36 76M12 96L38 92M10 112L22 110" stroke="#c98d2a" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M8 124l-2 6M13 125l-1 6M18 126l0 6" stroke="#c98d2a" stroke-width="1.8" stroke-linecap="round"/>`,
        couch: () => `
            <ellipse cx="160" cy="144" rx="150" ry="7" fill="#000" opacity=".18"/>
            <path d="M30 132v12M290 132v12M110 136v8M210 136v8" stroke="#4a2f22" stroke-width="6" stroke-linecap="round"/>
            <path d="M24 30Q24 14 42 14L278 14Q296 14 296 30L296 96L24 96Z" fill="#b5654f" stroke="${OUT}" stroke-width="2.6" stroke-linejoin="round"/>
            <rect x="40" y="24" width="76" height="64" rx="14" fill="#c27560" stroke="${OUT}" stroke-width="2"/>
            <rect x="122" y="24" width="76" height="64" rx="14" fill="#c27560" stroke="${OUT}" stroke-width="2"/>
            <rect x="204" y="24" width="76" height="64" rx="14" fill="#c27560" stroke="${OUT}" stroke-width="2"/>
            <path d="M48 32q30 -6 60 0M130 32q30 -6 60 0M212 32q30 -6 60 0" fill="none" stroke="#d68f78" stroke-width="3" stroke-linecap="round"/>
            <g transform="rotate(-10 76 62)"><path d="M56 44Q76 38 96 44Q100 62 96 80Q76 86 56 80Q52 62 56 44Z" fill="#e3b04b" stroke="${OUT}" stroke-width="2" stroke-linejoin="round"/>
                <path d="M58 56Q76 51 94 56M58 68Q76 63 94 68" fill="none" stroke="#c98d2a" stroke-width="2.6" stroke-linecap="round"/></g>
            <g transform="rotate(12 248 62)"><path d="M230 46Q248 40 266 46Q270 62 266 78Q248 84 230 78Q226 62 230 46Z" fill="#f2e6cf" stroke="${OUT}" stroke-width="2" stroke-linejoin="round"/>
                <circle cx="240" cy="54" r="2.2" fill="#2f6f73"/><circle cx="254" cy="58" r="2.2" fill="#2f6f73"/><circle cx="244" cy="68" r="2.2" fill="#2f6f73"/><circle cx="257" cy="72" r="2.2" fill="#2f6f73"/></g>
            <rect x="34" y="88" width="254" height="22" rx="8" fill="#c97d66" stroke="${OUT}" stroke-width="2.4"/>
            <path d="M118 90v18M204 90v18" stroke="#9f5341" stroke-width="2"/>
            <path d="M28 106H292V128Q292 134 286 134H34Q28 134 28 128Z" fill="#9f5341" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>
            <path d="M4 64Q4 48 22 48Q40 48 40 64L40 134L8 134Q4 134 4 130Z" fill="#a85b46" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>
            <path d="M280 64Q280 48 298 48Q316 48 316 64L316 130Q316 134 312 134L280 134Z" fill="#a85b46" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>
            <path d="M10 58q12 -8 24 0M286 58q12 -8 24 0" fill="none" stroke="#c97d66" stroke-width="3" stroke-linecap="round"/>`,
        table: () => `
            <ellipse cx="45" cy="114" rx="30" ry="5" fill="#000" opacity=".18"/>
            <path d="M45 62V108M26 112Q45 100 64 112" fill="none" stroke="#6b4630" stroke-width="6" stroke-linecap="round"/>
            <ellipse cx="45" cy="62" rx="40" ry="10" fill="#8a5a3c" stroke="${OUT}" stroke-width="2.2"/>
            <ellipse cx="45" cy="59" rx="40" ry="10" fill="#a8734e" stroke="${OUT}" stroke-width="2.2"/>
            <g class="olr-steam"><path d="M38 22q-3 -5 0 -10q3 -5 0 -10" /><path d="M46 24q-3 -5 0 -10q3 -5 0 -10"/></g>
            <path d="M20 46q-9 -2 -10 -10" fill="none" stroke="${OUT}" stroke-width="5" stroke-linecap="round"/><path d="M20 46q-9 -2 -10 -10" fill="none" stroke="#3d6fb6" stroke-width="2.6" stroke-linecap="round"/>
            <path d="M56 38q10 0 9 9q-1 6 -9 6" fill="none" stroke="${OUT}" stroke-width="5"/><path d="M56 38q10 0 9 9q-1 6 -9 6" fill="none" stroke="#3d6fb6" stroke-width="2.4"/>
            <path d="M22 44Q22 28 40 28Q58 28 58 44Q58 58 40 58Q22 58 22 44Z" fill="#3d6fb6" stroke="${OUT}" stroke-width="2.2"/>
            <circle cx="32" cy="42" r="2" fill="#fff"/><circle cx="44" cy="48" r="2" fill="#fff"/><circle cx="50" cy="38" r="2" fill="#fff"/>
            <path d="M30 30Q40 22 50 30Z" fill="#2f5c9c" stroke="${OUT}" stroke-width="2"/><circle cx="40" cy="23" r="3" fill="#2f5c9c" stroke="${OUT}" stroke-width="1.8"/>
            <path d="M64 50h14l-2 8h-10z" fill="#fdfaf3" stroke="${OUT}" stroke-width="1.8" stroke-linejoin="round"/><ellipse cx="71" cy="59" rx="10" ry="2.4" fill="#fdfaf3" stroke="${OUT}" stroke-width="1.6"/>`,
        lamp: () => `
            <ellipse class="olr-lamp-glow" cx="35" cy="40" rx="42" ry="34"/>
            <ellipse cx="35" cy="236" rx="20" ry="4" fill="#000" opacity=".2"/>
            <path d="M35 60V226" stroke="#3a2a24" stroke-width="4"/>
            <ellipse cx="35" cy="228" rx="16" ry="5" fill="#5a4636" stroke="${OUT}" stroke-width="2"/>
            <path d="M14 58L22 18H48L56 58Z" fill="#f4e3c1" stroke="${OUT}" stroke-width="2.2" stroke-linejoin="round"/>
            <path class="olr-lamp-shine" d="M18 56L24 22H34L32 56Z" fill="#fff6dd" opacity=".7"/>
            <ellipse cx="35" cy="58" rx="21" ry="4" fill="#ffe7a3"/>`,
        plant: () => `
            <path d="M60 120C40 100 10 104 4 80C24 72 48 86 60 120Z" fill="#4f8a4f" stroke="#2e5a33" stroke-width="2"/>
            <path d="M60 118C78 92 108 96 116 70C94 64 70 82 60 118Z" fill="#5f9e58" stroke="#2e5a33" stroke-width="2"/>
            <path d="M58 116C42 80 52 40 70 14C82 44 76 84 58 116Z" fill="#6fae64" stroke="#2e5a33" stroke-width="2"/>
            <path d="M58 116C46 92 20 64 26 34C48 50 60 82 58 116Z" fill="#5a9853" stroke="#2e5a33" stroke-width="2"/>
            <path d="M62 116C80 84 104 66 100 40C80 54 64 84 62 116Z" fill="#78b86b" stroke="#2e5a33" stroke-width="2"/>
            <path d="M70 18C66 50 62 80 58 114M28 38C40 60 52 86 58 114M98 44C84 66 70 92 62 114" fill="none" stroke="#2e5a33" stroke-width="1.4" opacity=".7"/>
            <path d="M30 116H90L82 176H38Z" fill="#c8754d" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>
            <rect x="26" y="110" width="68" height="12" rx="3" fill="#b5653f" stroke="${OUT}" stroke-width="2.4"/>
            <path d="M40 140h40M42 154h36" stroke="#a75a37" stroke-width="2"/>`
    };
    function renderItem(it) {
        return `<svg class="olr-item olr-item-${it.id}" viewBox="0 0 ${it.vw} ${it.vh}" width="${f1(it.w)}" height="${f1(it.h)}" aria-hidden="true" focusable="false"
            style="left:${f1(it.left)}px;top:${f1(it.top)}px;z-index:${it.fg ? 150 : 10 + Math.round(it.base * 100)}">${ART[it.id]()}</svg>`;
    }

    // ------------------------------------------------------------ yürüme motoru
    /**
     * createWalker({ onFrame(uid, st), onArrive(uid, st), reduced: () => bool })
     *   st = { x, y, path, v, facing, walking, target, opts }
     *   go(uid, path, opts)  path: nokta listesi (normalize). Yolda yeniden çağrılırsa hızı koruyarak döner.
     *   place(uid, p)        anında yerleştir (geç gelen / hareket azaltma)
     */
    const VMAX = 122, ACC = 420, VMIN = 26;   // dünya birimi/sn (1000 birim = sahne genişliği)
    function createWalker(h) {
        const S = new Map();
        let raf = 0, last = 0;
        const dist = (a, b) => Math.hypot((a.x - b.x) * 1000, (a.y - b.y) * 600);
        function get(uid) { return S.get(uid); }
        function place(uid, p, opts) {
            const st = S.get(uid) || {};
            Object.assign(st, { x: p.x, y: p.y, path: [], v: 0, walking: false, target: p, opts: opts || {} });
            if (!st.facing) st.facing = 'front';
            S.set(uid, st);
            h.onFrame(uid, st);
            return st;
        }
        function go(uid, path, opts) {
            let st = S.get(uid);
            if (!st || !path || !path.length) return place(uid, path && path.length ? path[path.length - 1] : { x: 0.5, y: 0.8 }, opts);
            st.path = path.slice();
            st.target = path[path.length - 1];
            st.opts = opts || {};
            st.arrived = false;
            if (h.reduced()) { const t = st.target; st.path = []; st.x = t.x; st.y = t.y; st.walking = false; st.v = 0; h.onFrame(uid, st, true); h.onArrive(uid, st); return st; }
            if (dist(st, st.target) < 2 && st.path.length === 1) { st.path = []; st.x = st.target.x; st.y = st.target.y; h.onFrame(uid, st); h.onArrive(uid, st); return st; }
            st.walking = true;
            kick();
            return st;
        }
        function remove(uid) { S.delete(uid); }
        function kick() { if (!raf && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(step); } }
        function step(now) {
            raf = 0;
            let dt = (now - last) / 1000; last = now;
            const snap = dt > 0.6;          // sekme uzun süre arka plandaysa: hedefe atla
            dt = Math.min(dt, 0.05);
            let any = false;
            S.forEach((st, uid) => {
                if (!st.walking) return;
                if (snap) { const t = st.target; st.x = t.x; st.y = t.y; st.path = []; }
                // kalan toplam yol
                let rem = 0, px = st.x, py = st.y;
                st.path.forEach(p => { rem += dist({ x: px, y: py }, p); px = p.x; py = p.y; });
                if (rem < 0.6 || !st.path.length) {
                    st.walking = false; st.v = 0; st.path = [];
                    st.x = st.target.x; st.y = st.target.y;
                    h.onFrame(uid, st); h.onArrive(uid, st);
                    return;
                }
                any = true;
                st.v = Math.min(VMAX, st.v + ACC * dt);
                const stopV = Math.sqrt(2 * ACC * rem);
                if (st.v > stopV) st.v = Math.max(VMIN, stopV);
                let move = st.v * dt;
                while (move > 0 && st.path.length) {
                    const p = st.path[0], d = dist(st, p);
                    const dxp = (p.x - st.x);
                    if (Math.abs(dxp) * 1000 > d * 0.35) st.facing = dxp > 0 ? 'right' : 'left';
                    else if (st.facing === 'front' && (p.y - st.y) < 0) st.facing = 'right';
                    if (d <= move) { st.x = p.x; st.y = p.y; st.path.shift(); move -= d; }
                    else { st.x += (p.x - st.x) * move / d; st.y += (p.y - st.y) * move / d; move = 0; }
                }
                h.onFrame(uid, st);
            });
            if (any) raf = requestAnimationFrame(step);
        }
        function onVis() { if (!document.hidden) { let w = false; S.forEach(st => { if (st.walking) w = true; }); if (w) kick(); } }
        document.addEventListener('visibilitychange', onVis);
        function destroy() { if (raf) cancelAnimationFrame(raf); raf = 0; S.clear(); document.removeEventListener('visibilitychange', onVis); }
        return { go, place, get, remove, destroy, states: S };
    }

    // ------------------------------------------------------------ oda
    function create(stage, opts) {
        const o = opts || {};
        const room = { stage, layout: null, grid: null, objects: [] };
        const host = document.createElement('div');
        host.className = 'olr';
        host.setAttribute('aria-hidden', 'true');
        stage.insertBefore(host, stage.firstChild);
        const objLayer = document.createElement('div');
        objLayer.className = 'olr-objs';
        stage.appendChild(objLayer);
        let lastW = 0, lastH = 0;
        function relayout(force) {
            const W = Math.round(stage.clientWidth), H = Math.round(stage.clientHeight);
            if (!W || !H) return false;
            if (!force && W === lastW && H === lastH) return false;
            lastW = W; lastH = H;
            const L = computeLayout(W, H);
            room.layout = L;
            room.grid = buildGrid(L);
            room.objects = L.objects;
            host.innerHTML = renderBack(L);
            // yerdeki eşyalar oyuncu katmanında (aynı z sırası)
            const layer = o.itemLayer || stage;
            layer.querySelectorAll('.olr-item').forEach(e => e.remove());
            layer.insertAdjacentHTML('beforeend', L.items.map(renderItem).join(''));
            objLayer.innerHTML = o.interactive === false ? '' : L.objects.map(ob =>
                `<button type="button" class="olr-obj" data-olr-obj="${ob.id}" aria-label="${ob.label}" title="${ob.label}"
                    style="left:${f1(ob.hit.l)}px;top:${f1(ob.hit.t)}px;width:${f1(ob.hit.w)}px;height:${f1(ob.hit.h)}px"></button>`).join('');
            if (o.onLayout) o.onLayout(L);
            return true;
        }
        room.relayout = relayout;
        room.setInteractive = (on) => { o.interactive = !!on; objLayer.hidden = !on; if (on && !objLayer.children.length) relayout(true); };
        room.object = (id) => room.objects.find(x => x.id === id) || null;
        room.nearestFree = (x, y) => room.grid ? room.grid.nearestFree(x, y) : { x, y };
        room.free = (x, y) => room.grid ? room.grid.free(x, y) : true;
        room.route = (a, b, approach) => room.grid ? room.grid.route(a, b, approach) : [b];
        /** Yer kimliği ("couch.1", "chair.0", "shelf"...) → { x, y, seat, object } (yoksa null) */
        room.spotPos = (spot) => {
            if (!spot || typeof spot !== 'string') return null;
            const [id, k] = spot.split('.');
            const ob = room.object(id);
            if (!ob) return null;
            if (k != null && ob.seats && ob.seats[+k]) return { x: ob.seats[+k].x, y: ob.seats[+k].y, seat: true, object: ob, approach: ob.approach, zBase: ob.base };
            return { x: ob.approach.x, y: ob.approach.y, seat: false, object: ob };
        };
        let ro = null, tmr = 0;
        if (global.ResizeObserver) {
            ro = new ResizeObserver(() => { clearTimeout(tmr); tmr = setTimeout(() => relayout(false), 120); });
            ro.observe(stage);
        }
        relayout(true);
        room.destroy = () => { if (ro) ro.disconnect(); clearTimeout(tmr); host.remove(); objLayer.remove(); stage.querySelectorAll('.olr-item').forEach(e => e.remove()); };
        return room;
    }

    NS.lobbyRoom = { create, createWalker, computeLayout, buildGrid, FT, FB, FLOOR_LINE, timeOfDay };
})(typeof window !== 'undefined' ? window : globalThis);
