/**
 * PsikoVaka — "Nöro" avatar ailesi (özgün tasarım).
 *
 * Küçük, yuvarlak, tüylü bir yaratık: yumuşak gövde, tepesinde ucu parlayan kısa dendrit tüyleri
 * (nöron hücresi motifi), iki büyük göz, minik ayaklar; yalnızca bir şey tutarken kısa kollar.
 * Tamamen JS ile üretilen satır içi SVG; dış dosya, emoji, id/defs (gradyan, clipPath) YOK —
 * aynı sayfada yüzlerce avatar çakışmadan çizilebilir.
 *
 * API: window.PsikoVakaAvatar
 *   PARTS                      slot -> [{ id, name }] katalog (body, color, tufts, eyes, mouth, pattern, headwear, accessory, background)
 *   SLOTS                      studio sırası: [{ key, label }]
 *   DEFAULT                    varsayılan yapılandırma (v: 2)
 *   EMOTES                     ['wave', 'cheer', 'think', 'sad', 'laugh'] (+ EMOTE_LABELS)
 *   normalize(cfg)             her girdiyi geçerli v2 yapılandırmaya çevirir. Eski biçimi
 *                              ({bg, skin, hat, eye, mouth, prop}) belirlenimci olarak eşler.
 *   isLegacy(cfg)              eski biçim mi?
 *   equals(a, b)               normalize edilmiş iki yapılandırma aynı mı?
 *   randomConfig(seed?)        tohum verilirse belirlenimci (botlar, yer tutucular)
 *   render(cfg, opts)          SVG dizesi. opts: { size=56, framed=true, animated=false, title, emote, className,
 *                                activity: 'read'|'tea'|'doze'|'stretch'|'think'|'wave'|null, facing: 'front'|'left'|'right',
 *                                walking: true|false }
 *                              activity: kısa döngülü poz + nesne (kitap, fincan, "z"…); emote verilirse emote kazanır.
 *                              facing: 'right' 3/4 yan poz (yüz/şapka bakılan yana kayar, tüyler geriye yatar), 'left' onun aynası.
 *                              walking: sırayla adım atan ayaklar + hafif sekme (css/style.css; hareket azaltmada durur).
 *   setPose(el, {facing, walking, activity})  çizilmiş Nöro'yu yerinde değiştirir (aynı <svg>): facing/walking yalnızca
 *                              sınıf, activity yalnızca o svg'nin içini yeniden üretir. getPose(el) mevcut pozu döner.
 *   ACTIVITIES, ACTIVITY_LABELS, FACINGS
 *   Kapsayıcıya .nv-paused sınıfı eklenirse içindeki tüm Nöro animasyonları durur (ör. sekme gizliyken).
 *                              framed: dairesel rozet arka planı (profil, sıralama). framed=false: şeffaf zemin +
 *                              yumuşak yer gölgesi (lobi). animated: CSS sınıf kancaları (nefes, göz kırpma, tüy ucu
 *                              parıltısı; css/style.css "Nöro avatar"; prefers-reduced-motion'a uyar).
 *
 * Yapılandırma v2 (profiles.avatar jsonb'de ve realtime yayında taşınır; küçük tutulur):
 *   { v: 2, body, color, tufts, eyes, mouth, pattern, headwear, accessory, background }
 */
(function (global) {
    'use strict';

    // ------------------------------------------------------------------ katalog
    const PARTS = {
        body: [
            { id: 'round', name: 'Yuvarlak' },
            { id: 'tall', name: 'Uzun' },
            { id: 'wide', name: 'Tombul' },
            { id: 'drop', name: 'Damla' },
            { id: 'cube', name: 'Lokum' }
        ],
        color: [
            { id: 'mint', name: 'Nane', hex: '#7fdcb4' },
            { id: 'sky', name: 'Gök', hex: '#86c9f2' },
            { id: 'lilac', name: 'Leylak', hex: '#b9a6f5' },
            { id: 'peach', name: 'Şeftali', hex: '#ffb77e' },
            { id: 'rose', name: 'Pembe', hex: '#f6a3c8' },
            { id: 'lemon', name: 'Limon', hex: '#f8dc5c' },
            { id: 'coral', name: 'Mercan', hex: '#fb8a7e' },
            { id: 'teal', name: 'Turkuaz', hex: '#45c7bd' },
            { id: 'indigo', name: 'Çivit', hex: '#8f95f5' },
            { id: 'cream', name: 'Krem', hex: '#f3e3c3' },
            { id: 'cloud', name: 'Bulut', hex: '#b4bfd0' },
            { id: 'cocoa', name: 'Kakao', hex: '#c99068' }
        ],
        tufts: [
            { id: 'pair', name: 'Çift dendrit' },
            { id: 'single', name: 'Tek anten' },
            { id: 'trio', name: 'Üçlü' },
            { id: 'branch', name: 'Dallı' },
            { id: 'curl', name: 'Kıvrık' },
            { id: 'fluff', name: 'Kabarık' }
        ],
        eyes: [
            { id: 'round', name: 'Yuvarlak' },
            { id: 'big', name: 'Kocaman' },
            { id: 'sparkle', name: 'Pırıltılı' },
            { id: 'happy', name: 'Mutlu' },
            { id: 'sleepy', name: 'Uykulu' },
            { id: 'wink', name: 'Göz kırpan' },
            { id: 'dot', name: 'Nokta' },
            { id: 'focus', name: 'Odaklı' }
        ],
        mouth: [
            { id: 'smile', name: 'Gülümseme' },
            { id: 'open', name: 'Neşeli' },
            { id: 'cat', name: 'Kedi ağzı' },
            { id: 'o', name: 'Şaşkın' },
            { id: 'tooth', name: 'Tek diş' },
            { id: 'smirk', name: 'Yan gülüş' }
        ],
        pattern: [
            { id: 'none', name: 'Yok' },
            { id: 'cheeks', name: 'Yanaklar' },
            { id: 'belly', name: 'Göbek' },
            { id: 'spots', name: 'Benekler' },
            { id: 'folds', name: 'Kıvrımlar' }
        ],
        headwear: [
            { id: 'none', name: 'Yok' },
            { id: 'gradcap', name: 'Mezuniyet kepi' },
            { id: 'beanie', name: 'Bere' },
            { id: 'headphones', name: 'Kulaklık' },
            { id: 'crown', name: 'Taç' },
            { id: 'bandana', name: 'Bandana' },
            { id: 'goggles', name: 'Lab gözlüğü' },
            { id: 'flower', name: 'Çiçek' },
            { id: 'party', name: 'Parti şapkası' },
            { id: 'headband', name: 'Saç bandı' },
            { id: 'sage', name: 'Bilge şapkası' }
        ],
        accessory: [
            { id: 'none', name: 'Yok' },
            { id: 'glasses', name: 'Yuvarlak gözlük' },
            { id: 'bowtie', name: 'Papyon' },
            { id: 'scarf', name: 'Atkı' },
            { id: 'stethoscope', name: 'Stetoskop' },
            { id: 'pencil', name: 'Kulakta kalem' },
            { id: 'notebook', name: 'Defter' },
            { id: 'coffee', name: 'Kahve' },
            { id: 'clipboard', name: 'Not panosu' },
            { id: 'book', name: 'Kitap' },
            { id: 'lollipop', name: 'Lolipop' }
        ],
        background: [
            { id: 'lavender', name: 'Lavanta', hex: '#cdd0ff', ring: 'rgba(40,40,90,.14)' },
            { id: 'mint', name: 'Nane', hex: '#c4f0dc', ring: 'rgba(20,70,50,.14)' },
            { id: 'peach', name: 'Şeftali', hex: '#ffdcc2', ring: 'rgba(90,50,20,.14)' },
            { id: 'sky', name: 'Gök', hex: '#c6e6fb', ring: 'rgba(20,60,90,.14)' },
            { id: 'rose', name: 'Gül', hex: '#fbd2e2', ring: 'rgba(90,30,60,.14)' },
            { id: 'sun', name: 'Güneş', hex: '#fbecaa', ring: 'rgba(90,70,10,.14)' },
            { id: 'night', name: 'Gece', hex: '#2c3350', ring: 'rgba(255,255,255,.16)' },
            { id: 'plum', name: 'Mürdüm', hex: '#5a3f7d', ring: 'rgba(255,255,255,.16)' },
            { id: 'none', name: 'Yok', hex: null, ring: null }
        ]
    };

    const SLOTS = [
        { key: 'body', label: 'Gövde' },
        { key: 'color', label: 'Renk' },
        { key: 'tufts', label: 'Tüy' },
        { key: 'eyes', label: 'Göz' },
        { key: 'mouth', label: 'Ağız' },
        { key: 'pattern', label: 'Desen' },
        { key: 'headwear', label: 'Şapka' },
        { key: 'accessory', label: 'Aksesuar' },
        { key: 'background', label: 'Arka plan' }
    ];
    const KEYS = SLOTS.map(s => s.key);

    const DEFAULT = Object.freeze({
        v: 2, body: 'round', color: 'mint', tufts: 'pair', eyes: 'round', mouth: 'smile',
        pattern: 'cheeks', headwear: 'none', accessory: 'none', background: 'lavender'
    });

    const EMOTES = ['wave', 'cheer', 'think', 'sad', 'laugh'];
    const EMOTE_LABELS = { wave: 'El sallıyor', cheer: 'Seviniyor', think: 'Düşünüyor', sad: 'Üzgün', laugh: 'Gülüyor' };

    const byId = {};
    KEYS.forEach(k => { byId[k] = {}; PARTS[k].forEach(p => { byId[k][p.id] = p; }); });

    // ------------------------------------------------------------------ eski biçim (v1) eşlemesi
    const LEGACY_KEYS = ['bg', 'skin', 'hat', 'eye', 'mouth', 'prop'];
    const LEGACY = {
        bg: { bg_indigo: 'lavender', bg_emerald: 'mint', bg_rose: 'rose', bg_amber: 'sun', bg_cyan: 'sky', 'bg_ cosmic': 'plum', bg_cosmic: 'plum' },
        skin: { skin_warm: 'peach', skin_light: 'cream', skin_tan: 'cocoa', skin_alien: 'mint', skin_zombie: 'lilac', skin_robot: 'sky' },
        hat: {
            hat_einstein: { headwear: 'none', tufts: 'curl' },
            hat_brain: { headwear: 'none', tufts: 'branch', pattern: 'folds' },
            hat_funnel: { headwear: 'party', tufts: 'pair' },
            hat_freud: { headwear: 'gradcap', tufts: 'single' },
            hat_coffee: { headwear: 'headphones', tufts: 'trio' },
            hat_clown: { headwear: 'party', tufts: 'fluff' },
            hat_crown: { headwear: 'crown', tufts: 'pair' },
            hat_scrub: { headwear: 'goggles', tufts: 'single' }
        },
        eye: {
            eye_hypno: { eyes: 'sparkle' },
            'eye_ sleepless': { eyes: 'sleepy' }, eye_sleepless: { eyes: 'sleepy' },
            eye_monocle: { eyes: 'round', glasses: true },
            eye_cool: { eyes: 'focus' },
            eye_nerd: { eyes: 'big', glasses: true },
            eye_wink: { eyes: 'wink' }
        },
        mouth: { mouth_freud: 'smirk', mouth_tongue: 'open', mouth_mustache: 'cat', mouth_coffee_jitters: 'tooth', mouth_thermometer: 'o', mouth_laugh: 'open' },
        prop: { prop_steth: 'stethoscope', prop_coffee: 'coffee', prop_dsm: 'book', prop_bowtie: 'bowtie', prop_hypno: 'lollipop' }
    };
    const LEGACY_BODIES = ['round', 'tall', 'wide', 'drop', 'cube'];

    function hashString(s) {
        let h = 2166136261 >>> 0;
        for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
        return h >>> 0;
    }
    function isLegacy(cfg) {
        return !!(cfg && typeof cfg === 'object' && cfg.v !== 2 && LEGACY_KEYS.some(k => typeof cfg[k] === 'string'));
    }
    function fromLegacy(o) {
        const s = (k) => (typeof o[k] === 'string' ? o[k] : '');
        const out = Object.assign({}, DEFAULT);
        out.background = LEGACY.bg[s('bg')] || DEFAULT.background;
        out.color = LEGACY.skin[s('skin')] || 'peach';
        const hat = LEGACY.hat[s('hat')] || LEGACY.hat.hat_einstein;
        out.headwear = hat.headwear;
        out.tufts = hat.tufts;
        out.pattern = hat.pattern || 'cheeks';
        const eye = LEGACY.eye[s('eye')] || LEGACY.eye.eye_hypno;
        out.eyes = eye.eyes;
        out.mouth = LEGACY.mouth[s('mouth')] || 'open';
        out.accessory = eye.glasses ? 'glasses' : (LEGACY.prop[s('prop')] || 'none');
        // Gövde biçimi eskide yoktu: eski değerlerin özetinden belirlenimci seçim
        const key = LEGACY_KEYS.map(k => s(k)).join('|');
        out.body = LEGACY_BODIES[hashString(key) % LEGACY_BODIES.length];
        return out;
    }

    function normalize(cfg) {
        if (!cfg || typeof cfg !== 'object' || Array.isArray(cfg)) return Object.assign({}, DEFAULT);
        if (isLegacy(cfg)) return fromLegacy(cfg);
        const out = { v: 2 };
        KEYS.forEach(k => {
            const val = cfg[k];
            out[k] = (typeof val === 'string' && byId[k][val]) ? val : DEFAULT[k];
        });
        return out;
    }

    function equals(a, b) {
        const x = normalize(a), y = normalize(b);
        return KEYS.every(k => x[k] === y[k]);
    }

    function mulberry32(seed) {
        let t = seed >>> 0;
        return function () {
            t = (t + 0x6D2B79F5) >>> 0;
            let r = Math.imul(t ^ (t >>> 15), 1 | t);
            r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
            return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
        };
    }
    function randomConfig(seed) {
        const rnd = (seed === undefined || seed === null) ? Math.random : mulberry32(hashString(String(seed)));
        const pick = (k, filter) => {
            const list = PARTS[k].filter(p => !filter || filter(p));
            return list[Math.floor(rnd() * list.length) % list.length].id;
        };
        const cfg = { v: 2 };
        cfg.body = pick('body');
        cfg.color = pick('color');
        cfg.tufts = pick('tufts');
        cfg.eyes = pick('eyes');
        cfg.mouth = pick('mouth');
        cfg.pattern = pick('pattern');
        cfg.headwear = rnd() < 0.4 ? 'none' : pick('headwear', p => p.id !== 'none');
        cfg.accessory = rnd() < 0.4 ? 'none' : pick('accessory', p => p.id !== 'none');
        cfg.background = pick('background', p => p.id !== 'none');
        return cfg;
    }

    // ------------------------------------------------------------------ renk yardımcıları
    function hexToRgb(h) {
        const s = h.replace('#', '');
        return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
    }
    function mix(a, b, t) {
        const x = hexToRgb(a), y = hexToRgb(b);
        const c = x.map((v, i) => Math.round(v + (y[i] - v) * t));
        return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
    }
    const INK = '#231c35';        // göz/ağız
    const OUTLINE_TO = '#1d1630'; // kontur karışım hedefi
    const SHADE_TO = '#3a2f5c';   // gölge karışım hedefi (hafif mor, sıcak)

    function palette(colorId) {
        const base = (byId.color[colorId] || byId.color[DEFAULT.color]).hex;
        return {
            base,
            shade: mix(base, SHADE_TO, 0.24),
            outline: mix(base, OUTLINE_TO, 0.66),
            light: mix(base, '#ffffff', 0.55),
            spot: mix(base, SHADE_TO, 0.34)
        };
    }

    // ------------------------------------------------------------------ gövde geometrisi
    // viewBox 0 0 120 120, gövde ortası x=60. Her biçim parametrik bir damla: tepe, orta, taban noktaları.
    const CX = 60;
    const BODIES = {
        round: { top: 38, bottom: 100, midY: 71, wMid: 35, wTop: 21, wBot: 26, kT: 0.56, kB: 0.6 },
        tall: { top: 31, bottom: 101, midY: 70, wMid: 29, wTop: 17, wBot: 22, kT: 0.56, kB: 0.6 },
        wide: { top: 46, bottom: 100, midY: 76, wMid: 41, wTop: 28, wBot: 33, kT: 0.58, kB: 0.55 },
        drop: { top: 31, bottom: 101, midY: 75, wMid: 34, wTop: 6, wBot: 26, kT: 0.82, kB: 0.6 },
        cube: { top: 39, bottom: 100, midY: 70, wMid: 34, wTop: 27, wBot: 30, kT: 0.34, kB: 0.34 }
    };
    const f1 = (n) => Math.round(n * 10) / 10;

    function bodyPath(b) {
        const { top: T, bottom: B, midY: M, wMid: W, wTop, wBot, kT, kB } = b;
        const yT = M - (M - T) * kT, yB = M + (B - M) * kB;
        return `M${CX} ${T}C${f1(CX + wTop)} ${T} ${CX + W} ${f1(yT)} ${CX + W} ${M}` +
            `C${CX + W} ${f1(yB)} ${f1(CX + wBot)} ${B} ${CX} ${B}` +
            `C${f1(CX - wBot)} ${B} ${CX - W} ${f1(yB)} ${CX - W} ${M}` +
            `C${CX - W} ${f1(yT)} ${f1(CX - wTop)} ${T} ${CX} ${T}Z`;
    }
    function cubic(p0, p1, p2, p3, t) {
        const u = 1 - t;
        return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
    }
    // Yarım genişlik tablosu: y (tam sayı) -> sağ kenarın merkezden uzaklığı
    function buildWidthTable(b) {
        const { top: T, bottom: B, midY: M, wMid: W, wTop, wBot, kT, kB } = b;
        const yT = M - (M - T) * kT, yB = M + (B - M) * kB;
        const pts = [];
        for (let i = 0; i <= 80; i++) {
            const t = i / 80;
            pts.push([cubic(CX, CX + wTop, CX + W, CX + W, t) - CX, cubic(T, T, yT, M, t)]);
        }
        for (let i = 1; i <= 80; i++) {
            const t = i / 80;
            pts.push([cubic(CX + W, CX + W, CX + wBot, CX, t) - CX, cubic(M, yB, B, B, t)]);
        }
        const table = {};
        for (let y = Math.ceil(T); y <= B; y++) {
            let best = 0;
            for (let i = 1; i < pts.length; i++) {
                const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
                if ((y0 - y) * (y1 - y) <= 0 && y0 !== y1) {
                    const x = x0 + (x1 - x0) * ((y - y0) / (y1 - y0));
                    if (x > best) best = x;
                } else if (y0 === y && x0 > best) best = x0;
            }
            table[y] = best;
        }
        return table;
    }
    const GEOM = {};
    Object.keys(BODIES).forEach(id => {
        const b = BODIES[id];
        const table = buildWidthTable(b);
        const hw = (y) => {
            const yy = Math.round(y);
            if (yy < b.top) return 0;
            if (yy > b.bottom) return 0;
            return table[yy] || 0;
        };
        const H = b.bottom - b.top;
        const eyeY = Math.round(b.top + H * 0.40);
        const eyeDx = Math.max(10, Math.min(14, hw(eyeY) * 0.40));
        GEOM[id] = {
            b, hw, path: bodyPath(b), H,
            eyeY, eyeDx,
            mouthY: eyeY + 13,
            armY: b.bottom - 5,
            // tüy kökü: gövdenin içinde kalan en yüksek nokta
            rootY: (dx) => { for (let y = b.top; y < b.bottom; y++) if (hw(y) > Math.abs(dx) + 3) return y + 4; return b.top + 6; }
        };
    });

    // ------------------------------------------------------------------ parça çizimleri
    function tuftStroke(d, pal) {
        return `<path d="${d}" fill="none" stroke="${pal.outline}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` +
            `<path d="${d}" fill="none" stroke="${pal.base}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    function tuftTip(x, y, pal, r = 4.2) {
        return `<circle class="nv-tip-glow" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r + 4.4)}" fill="#ffe896" opacity=".28"/>` +
            `<circle class="nv-tip-glow-in" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r + 1.8)}" fill="#fff6c8" opacity=".42"/>` +
            `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${pal.outline}"/>` +
            `<circle class="nv-tip" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r - 1.5)}" fill="#fff4b8"/>` +
            `<circle cx="${f1(x - 0.9)}" cy="${f1(y - 0.9)}" r="${f1(Math.max(0.8, r * 0.28))}" fill="#ffffff"/>`;
    }
    function drawTufts(id, g, pal, droop) {
        const T = g.b.top;
        const out = [];
        const tuft = (dx, d, tip) => { out.push(tuftStroke(d, pal)); if (tip) out.push(tuftTip(tip[0], tip[1], pal)); };
        const dy = droop ? 6 : 0;
        if (id === 'single') {
            const r = g.rootY(0);
            tuft(0, `M60 ${r}C60 ${T - 6} 66 ${T - 10 + dy} 66 ${T - 18 + dy}`, [66, T - 18 + dy]);
        } else if (id === 'pair') {
            const rl = g.rootY(6);
            tuft(-6, `M54 ${rl}C53 ${T - 4} 48 ${T - 8 + dy} 45 ${T - 15 + dy}`, [45, T - 15 + dy]);
            tuft(6, `M66 ${rl}C67 ${T - 4} 72 ${T - 8 + dy} 75 ${T - 15 + dy}`, [75, T - 15 + dy]);
        } else if (id === 'trio') {
            const r0 = g.rootY(0), r1 = g.rootY(8);
            tuft(-8, `M52 ${r1}C50 ${T - 2} 45 ${T - 4 + dy} 41 ${T - 9 + dy}`, [41, T - 9 + dy]);
            tuft(8, `M68 ${r1}C70 ${T - 2} 75 ${T - 4 + dy} 79 ${T - 9 + dy}`, [79, T - 9 + dy]);
            tuft(0, `M60 ${r0}C60 ${T - 6} 60 ${T - 12 + dy} 60 ${T - 19 + dy}`, [60, T - 19 + dy]);
        } else if (id === 'branch') {
            const r0 = g.rootY(0);
            const fy = T - 9;
            out.push(tuftStroke(`M60 ${r0}C60 ${T - 2} 60 ${fy + 2} 60 ${fy}M60 ${fy}C58 ${fy - 3} 53 ${fy - 5 + dy} 50 ${fy - 9 + dy}M60 ${fy}C62 ${fy - 3} 67 ${fy - 5 + dy} 70 ${fy - 9 + dy}`, pal));
            out.push(tuftTip(50, fy - 9 + dy, pal, 3.8));
            out.push(tuftTip(70, fy - 9 + dy, pal, 3.8));
        } else if (id === 'curl') {
            const r0 = g.rootY(0);
            tuft(0, `M60 ${r0}C59 ${T - 6} 68 ${T - 9} 68 ${T - 15}C68 ${T - 20} 61 ${T - 21} 60 ${T - 17}`, [60, T - 17]);
        } else if (id === 'fluff') {
            // Kabarık tüy: tepede üç yumuşak tutam (ucu parlamaz)
            const c = (x, y, r) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${pal.base}" stroke="${pal.outline}" stroke-width="3"/>`;
            out.push(c(52, T + 3, 6.5), c(68, T + 3, 6.5), c(60, T - 1, 7.5));
        }
        return `<g class="nv-tufts">${out.join('')}</g>`;
    }

    function drawFeet(g, pal) {
        const b = g.b;
        const fx = Math.max(9, b.wBot * 0.5);
        const e = (x, side) => `<g class="nv-foot nv-foot-${side}"><ellipse cx="${f1(x)}" cy="${b.bottom - 1}" rx="7.5" ry="4.6" fill="${pal.shade}" stroke="${pal.outline}" stroke-width="3"/></g>`;
        return `<g class="nv-feet">${e(60 - fx, 'l')}${e(60 + fx, 'r')}</g>`;
    }

    function drawBody(g, pal) {
        const T = g.b.top, B = g.b.bottom;
        const hx = 60 - g.hw(g.eyeY - 10) * 0.48;
        const hy = T + (g.eyeY - T) * 0.40;
        const rxBounce = Math.max(10, g.hw(B - 10) * 0.62);
        return `<path d="${g.path}" fill="${pal.shade}" stroke="${pal.outline}" stroke-width="3.2" stroke-linejoin="round"/>` +
            `<path d="${g.path}" fill="${pal.base}" transform="translate(58.5 ${T}) scale(.925 .905) translate(-60 ${-T})"/>` +
            `<path d="${g.path}" fill="${pal.light}" opacity=".26" transform="translate(56.5 ${T + 2}) scale(.76 .52) translate(-60 ${-T})"/>` +
            `<ellipse cx="60" cy="${f1(B - 7)}" rx="${f1(rxBounce)}" ry="4.5" fill="${pal.light}" opacity=".20"/>` +
            `<ellipse cx="${f1(hx)}" cy="${f1(hy)}" rx="8" ry="4.4" fill="#fff" opacity=".48" transform="rotate(-26 ${f1(hx)} ${f1(hy)})"/>` +
            `<circle cx="${f1(hx + 8.5)}" cy="${f1(hy - 4.2)}" r="2.2" fill="#fff" opacity=".55"/>`;
    }

    function drawPattern(id, g, pal) {
        const T = g.b.top, B = g.b.bottom;
        if (id === 'cheeks') {
            const y = g.eyeY + 8.5, dx = g.eyeDx + 6;
            return `<ellipse cx="${f1(60 - dx)}" cy="${f1(y)}" rx="4.6" ry="2.8" fill="#ff7f9e" opacity=".5"/>` +
                `<ellipse cx="${f1(60 + dx)}" cy="${f1(y)}" rx="4.6" ry="2.8" fill="#ff7f9e" opacity=".5"/>`;
        }
        if (id === 'belly') {
            const cy = B - g.H * 0.2, ry = Math.min(12, (B - (g.mouthY + 5)) / 2 + 1);
            const rx = g.hw(cy) * 0.6;
            return `<ellipse cx="60" cy="${f1(B - ry - 3)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${pal.light}" opacity=".85"/>`;
        }
        if (id === 'spots') {
            const y1 = T + 10, y2 = g.eyeY + 17, y3 = g.eyeY + 25;
            return `<circle cx="${f1(60 - g.hw(y1) * 0.42)}" cy="${y1}" r="3.4" fill="${pal.spot}"/>` +
                `<circle cx="${f1(60 + g.hw(y2) * 0.62)}" cy="${y2}" r="4.4" fill="${pal.spot}"/>` +
                `<circle cx="${f1(60 - g.hw(y3) * 0.64)}" cy="${y3}" r="2.8" fill="${pal.spot}"/>` +
                `<circle cx="${f1(60 + g.hw(T + 15) * 0.5)}" cy="${T + 15}" r="2.2" fill="${pal.spot}"/>`;
        }
        if (id === 'folds') {
            // Beyin kıvrımı gibi iki dalgalı çizgi (alında)
            const w1 = Math.min(13, g.hw(T + 9) * 0.62), w2 = Math.min(16, g.hw(T + 16) * 0.62);
            const wave = (y, w) => {
                const s = (2 * w) / 4;
                return `M${f1(60 - w)} ${y}q${f1(s / 2)} -3.2 ${f1(s)} 0t${f1(s)} 0t${f1(s)} 0t${f1(s)} 0`;
            };
            return `<path d="${wave(T + 9, w1)}${wave(T + 16, w2)}" fill="none" stroke="${pal.spot}" stroke-width="2.4" stroke-linecap="round"/>`;
        }
        return '';
    }

    function eyeShape(id, x, y, side, pal) {
        const glint = (gx, gy, r, op = 1) => `<circle cx="${f1(gx)}" cy="${f1(gy)}" r="${r}" fill="#fff"${op < 1 ? ` opacity="${op}"` : ''}/>`;
        if (id === 'round') {
            return `<ellipse cx="${f1(x)}" cy="${y}" rx="6.2" ry="7.6" fill="${INK}"/>` +
                `<ellipse cx="${f1(x)}" cy="${f1(y + 2.2)}" rx="4.2" ry="3.2" fill="#4f4675" opacity=".45"/>` +
                glint(x - 2.1, y - 2.8, 2.5) + glint(x + 2.1, y + 2.6, 1.15, 0.85);
        }
        if (id === 'big') {
            return `<ellipse cx="${f1(x)}" cy="${y}" rx="8.4" ry="9.2" fill="#fff" stroke="${pal.outline}" stroke-width="2"/>` +
                `<circle cx="${f1(x + side * 0.8)}" cy="${y + 1}" r="5.4" fill="${INK}"/>` +
                `<ellipse cx="${f1(x + side * 0.8)}" cy="${f1(y + 2.6)}" rx="3.2" ry="2.2" fill="#52487d" opacity=".5"/>` +
                glint(x + side * 0.8 - 1.9, y - 1.4, 2.1) + glint(x + side * 0.8 + 1.8, y + 2.4, 1.0, 0.85);
        }
        if (id === 'sparkle') {
            const sx = x - 2, sy = y - 2.6;
            return `<ellipse cx="${f1(x)}" cy="${y}" rx="6.6" ry="8" fill="${INK}"/>` +
                `<path d="M${f1(sx)} ${f1(sy - 3.4)}L${f1(sx + 1)} ${f1(sy - 1)}L${f1(sx + 3.4)} ${f1(sy)}L${f1(sx + 1)} ${f1(sy + 1)}L${f1(sx)} ${f1(sy + 3.4)}L${f1(sx - 1)} ${f1(sy + 1)}L${f1(sx - 3.4)} ${f1(sy)}L${f1(sx - 1)} ${f1(sy - 1)}Z" fill="#fff"/>` +
                glint(x + 2.4, y + 3, 1.2);
        }
        if (id === 'happy') {
            return `<path d="M${f1(x - 6)} ${y + 2}Q${f1(x)} ${y - 6.5} ${f1(x + 6)} ${y + 2}" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>`;
        }
        if (id === 'sleepy') {
            return `<path d="M${f1(x - 6.4)} ${y - 0.5}A6.4 6.4 0 0 0 ${f1(x + 6.4)} ${y - 0.5}Z" fill="${INK}"/>` +
                `<path d="M${f1(x - 7.4)} ${y - 0.5}L${f1(x + 7.4)} ${y - 0.5}" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>` + glint(x - 2, y + 2.2, 1.3);
        }
        if (id === 'closed') {
            return `<path d="M${f1(x - 6)} ${y}Q${f1(x)} ${y + 5} ${f1(x + 6)} ${y}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
        }
        if (id === 'down') { // kitaba bakan: yarı kapalı kapak, aşağı bakan göz bebeği
            return `<path d="M${f1(x - 6)} ${y - 0.5}Q${f1(x)} ${y - 2.4} ${f1(x + 6)} ${y - 0.5}Q${f1(x + 6)} ${y + 7} ${f1(x)} ${y + 7}Q${f1(x - 6)} ${y + 7} ${f1(x - 6)} ${y - 0.5}Z" fill="${INK}"/>` +
                glint(x - 2.2, y + 3.4, 1.5);
        }
        if (id === 'dot') {
            return `<circle cx="${f1(x)}" cy="${y}" r="3.8" fill="${INK}"/>` + glint(x - 1.2, y - 1.3, 1.1);
        }
        if (id === 'up') { // düşünürken yukarı bakan
            return `<ellipse cx="${f1(x)}" cy="${y}" rx="6" ry="7.4" fill="#fff" stroke="${pal.outline}" stroke-width="1.8"/>` +
                `<circle cx="${f1(x + 1.5)}" cy="${y - 3}" r="3.6" fill="${INK}"/>`;
        }
        if (id === 'focus') {
            const bx = side < 0 ? 1 : -1;
            return `<ellipse cx="${f1(x)}" cy="${y + 1}" rx="5.6" ry="6.6" fill="${INK}"/>` + glint(x - 1.8, y - 1.4, 2) +
                `<path d="M${f1(x - 7)} ${y - 9 + bx * 2}L${f1(x + 7)} ${y - 9 - bx * 2}" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/>`;
        }
        return '';
    }
    function drawEyes(id, g, pal) {
        const y = g.eyeY, dx = g.eyeDx;
        if (id === 'wink') {
            return eyeShape('round', 60 - dx, y, -1, pal) + eyeShape('happy', 60 + dx, y, 1, pal);
        }
        return eyeShape(id, 60 - dx, y, -1, pal) + eyeShape(id, 60 + dx, y, 1, pal);
    }

    function drawMouth(id, g) {
        const y = g.mouthY;
        const st = `fill="none" stroke="${INK}" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"`;
        switch (id) {
            case 'smile': return `<path d="M54.5 ${y - 1}Q60 ${y + 4.5} 65.5 ${y - 1}" ${st}/>`;
            case 'open': return `<path d="M53.5 ${y - 2}Q60 ${y - 0.5} 66.5 ${y - 2}Q66 ${y + 7.5} 60 ${y + 7.5}Q54 ${y + 7.5} 53.5 ${y - 2}Z" fill="${INK}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>` +
                `<path d="M56 ${y + 5}Q60 ${y + 1.6} 64 ${y + 5}Q62 ${y + 7} 60 ${y + 7}Q58 ${y + 7} 56 ${y + 5}Z" fill="#ff8fa6"/>`;
            case 'cat': return `<path d="M53.5 ${y - 1}Q56.75 ${y + 3.6} 60 ${y}Q63.25 ${y + 3.6} 66.5 ${y - 1}" ${st}/>`;
            case 'o': return `<ellipse cx="60" cy="${y + 1}" rx="2.8" ry="3.4" fill="${INK}"/>`;
            case 'tooth': return `<path d="M54 ${y - 1.5}Q60 ${y - 0.2} 66 ${y - 1.5}Q65 ${y + 5.5} 60 ${y + 5.5}Q55 ${y + 5.5} 54 ${y - 1.5}Z" fill="${INK}" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>` +
                `<rect x="57.4" y="${y - 1.2}" width="4.2" height="3.4" rx="1" fill="#fff"/>`;
            case 'smirk': return `<path d="M54.5 ${y + 0.5}Q60.5 ${y + 3.5} 66 ${y - 2.5}" ${st}/>`;
            case 'sad': return `<path d="M55 ${y + 3}Q60 ${y - 2} 65 ${y + 3}" ${st}/>`;
            case 'laugh': return `<path d="M52.5 ${y - 2.5}Q60 ${y - 1} 67.5 ${y - 2.5}Q67 ${y + 9.5} 60 ${y + 9.5}Q53 ${y + 9.5} 52.5 ${y - 2.5}Z" fill="${INK}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>` +
                `<path d="M55.5 ${y + 6.5}Q60 ${y + 2.5} 64.5 ${y + 6.5}Q62.5 ${y + 9} 60 ${y + 9}Q57.5 ${y + 9} 55.5 ${y + 6.5}Z" fill="#ff8fa6"/>`;
            default: return '';
        }
    }

    // Başlık: tepe noktası T, alın çizgisi gövde genişliğine göre (dar/damla gövdede tam oturur)
    function drawHeadwear(id, g, pal) {
        const T = g.b.top;
        const hw = g.hw;
        const OUT = '#2a2238';
        const isNarrowTop = g.b.wTop < 12; // damla gövde tepesi dar: şapkaları biraz daha derin oturt
        const seat = isNarrowTop ? 4 : 0;
        switch (id) {
            case 'gradcap': {
                const y = T + 8 + seat;
                const w = Math.max(12, Math.min(20, hw(y) + 1));
                const by = T + seat;
                return `<path d="M${f1(60 - w)} ${y}Q60 ${by - 2} ${f1(60 + w)} ${y}Z" fill="#323a5c" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>` +
                    `<path d="M${f1(60 - w - 7)} ${by}L60 ${by - 7.5}L${f1(60 + w + 7)} ${by}L60 ${by + 7.5}Z" fill="#3d4670" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>` +
                    `<path d="M60 ${by}L${f1(60 + w + 1)} ${by + 2}L${f1(60 + w + 1)} ${by + 11}" fill="none" stroke="#f2c14e" stroke-width="2" stroke-linecap="round"/>` +
                    `<rect x="${f1(60 + w - 1.4)}" y="${by + 10}" width="4.8" height="6" rx="1.6" fill="#f2c14e" stroke="${OUT}" stroke-width="1.2"/>` +
                    `<circle cx="60" cy="${by}" r="2" fill="#f2c14e"/>`;
            }
            case 'beanie': {
                const y = Math.min(g.eyeY - 9, T + 13 + seat);
                const w = Math.max(13, hw(y) + 1.8);
                return `<path d="M${f1(60 - w)} ${y}C${f1(60 - w)} ${T - 5 + seat} ${f1(60 + w)} ${T - 5 + seat} ${f1(60 + w)} ${y}Z" fill="#e2574c" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>` +
                    `<rect x="${f1(60 - w - 1)}" y="${y - 4.5}" width="${f1(2 * w + 2)}" height="7" rx="3.5" fill="#c54238" stroke="${OUT}" stroke-width="2.4"/>` +
                    `<path d="M${f1(60 - w * 0.5)} ${y - 3.5}v4.5M60 ${y - 3.5}v4.5M${f1(60 + w * 0.5)} ${y - 3.5}v4.5" stroke="#a7362e" stroke-width="1.6" stroke-linecap="round"/>` +
                    `<circle cx="60" cy="${T - 3 + seat}" r="4.8" fill="#fff3ea" stroke="${OUT}" stroke-width="2.2"/>`;
            }
            case 'headphones': {
                const y = g.eyeY - 3, w = hw(y) + 0.8;
                return `<path d="M${f1(60 - w)} ${y}C${f1(60 - w)} ${T - 8} ${f1(60 + w)} ${T - 8} ${f1(60 + w)} ${y}" fill="none" stroke="${OUT}" stroke-width="6.5" stroke-linecap="round"/>` +
                    `<path d="M${f1(60 - w)} ${y}C${f1(60 - w)} ${T - 8} ${f1(60 + w)} ${T - 8} ${f1(60 + w)} ${y}" fill="none" stroke="#5b6480" stroke-width="3" stroke-linecap="round"/>` +
                    `<rect x="${f1(60 - w - 5.5)}" y="${y - 7}" width="10.5" height="16.5" rx="5" fill="#ff7a6b" stroke="${OUT}" stroke-width="2.4"/>` +
                    `<rect x="${f1(60 + w - 5)}" y="${y - 7}" width="10.5" height="16.5" rx="5" fill="#ff7a6b" stroke="${OUT}" stroke-width="2.4"/>`;
            }
            case 'crown': {
                const y = T + 5 + seat;
                const cw = Math.max(10, Math.min(14, hw(y) * 0.85));
                return `<path d="M${f1(60 - cw)} ${y}L${f1(60 - cw - 2)} ${y - 14}L${f1(60 - cw * 0.45)} ${y - 7.5}L60 ${y - 18}L${f1(60 + cw * 0.45)} ${y - 7.5}L${f1(60 + cw + 2)} ${y - 14}L${f1(60 + cw)} ${y}Z" fill="#f6c945" stroke="#8a6110" stroke-width="2.3" stroke-linejoin="round"/>` +
                    `<rect x="${f1(60 - cw - 1)}" y="${y - 3}" width="${f1(cw * 2 + 2)}" height="5.2" rx="2" fill="#e8b02c" stroke="#8a6110" stroke-width="2"/>` +
                    `<circle cx="60" cy="${y - 7.5}" r="2.2" fill="#ef5a7a"/><circle cx="${f1(60 - cw - 2)}" cy="${y - 14}" r="1.7" fill="#fff6d0"/><circle cx="${f1(60 + cw + 2)}" cy="${y - 14}" r="1.7" fill="#fff6d0"/>`;
            }
            case 'bandana': {
                const y = Math.min(g.eyeY - 12, T + 11 + seat), w = Math.max(12, hw(y + 2) + 0.2);
                return `<path d="M${f1(60 - w)} ${y + 3}Q60 ${y - 6} ${f1(60 + w)} ${y + 3}L${f1(60 + w)} ${y + 9}Q60 ${y} ${f1(60 - w)} ${y + 9}Z" fill="#3d7de0" stroke="${OUT}" stroke-width="2.2" stroke-linejoin="round"/>` +
                    `<circle cx="52" cy="${y + 1.5}" r="1.2" fill="#fff"/><circle cx="60" cy="${y - 0.5}" r="1.2" fill="#fff"/><circle cx="68" cy="${y + 1.5}" r="1.2" fill="#fff"/>` +
                    `<path d="M${f1(60 + w - 1)} ${y + 5}l8 -4.5l-1 7.5zM${f1(60 + w - 1)} ${y + 6}l7.5 5.5l-8.5 1z" fill="#3d7de0" stroke="${OUT}" stroke-width="2" stroke-linejoin="round"/>`;
            }
            case 'goggles': {
                const y = Math.min(g.eyeY - 11, T + 10 + seat), w = Math.max(14, hw(y) + 0.2);
                return `<path d="M${f1(60 - w)} ${y + 1}Q60 ${y - 4} ${f1(60 + w)} ${y + 1}" fill="none" stroke="#3d4458" stroke-width="3.2"/>` +
                    `<circle cx="52" cy="${y}" r="6.4" fill="#bfe8f7" stroke="#3d4458" stroke-width="2.5"/><circle cx="68" cy="${y}" r="6.4" fill="#bfe8f7" stroke="#3d4458" stroke-width="2.5"/>` +
                    `<path d="M58.4 ${y}h3.2" stroke="#3d4458" stroke-width="2.5"/>` +
                    `<path d="M49 ${y - 2.2}q2 -2 4.6 -1.6M65 ${y - 2.2}q2 -2 4.6 -1.6" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`;
            }
            case 'flower': {
                const y = T + 7 + seat, x = 60 + Math.max(7, hw(y) * 0.62);
                const p = (a) => { const r = a * Math.PI / 180; return `<circle cx="${f1(x + Math.cos(r) * 4.6)}" cy="${f1(y + Math.sin(r) * 4.6)}" r="3.9" fill="#ff9ec4" stroke="${OUT}" stroke-width="1.6"/>`; };
                return [0, 72, 144, 216, 288].map(a => p(a - 90)).join('') + `<circle cx="${f1(x)}" cy="${y}" r="2.9" fill="#ffd54d" stroke="${OUT}" stroke-width="1.4"/>`;
            }
            case 'party': {
                const y = T + 6 + seat;
                const pw = Math.max(8, Math.min(11, hw(y) * 0.75));
                return `<path d="M${f1(60 - pw)} ${y}L${f1(60 + 5)} ${y - 26}L${f1(60 + pw)} ${y}Z" fill="#7b6cf6" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>` +
                    `<path d="M${f1(60 - pw * 0.72)} ${y - 6}L${f1(60 + pw * 0.85)} ${y - 6}M${f1(60 - pw * 0.35)} ${y - 14}L${f1(60 + pw * 0.65)} ${y - 14}" stroke="#ffd34d" stroke-width="2.5"/>` +
                    `<path d="M${f1(60 - pw)} ${y}L${f1(60 + 5)} ${y - 26}L${f1(60 + pw)} ${y}Z" fill="none" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>` +
                    `<circle cx="${f1(60 + 5)}" cy="${y - 27}" r="3.8" fill="#ff7a9c" stroke="${OUT}" stroke-width="2"/>`;
            }
            case 'headband': {
                const y = Math.min(g.eyeY - 12, T + 9 + seat), w = Math.max(12, hw(y + 2) + 0.2);
                return `<path d="M${f1(60 - w)} ${y + 3}Q60 ${y - 5} ${f1(60 + w)} ${y + 3}L${f1(60 + w)} ${y + 8}Q60 ${y} ${f1(60 - w)} ${y + 8}Z" fill="#fafafa" stroke="${OUT}" stroke-width="2.2" stroke-linejoin="round"/>` +
                    `<path d="M${f1(60 - w + 1)} ${y + 5.4}Q60 ${y - 2.4} ${f1(60 + w - 1)} ${y + 5.4}" fill="none" stroke="#2fb38a" stroke-width="2.2"/>`;
            }
            case 'sage': {
                const y = T + 7 + seat;
                const sw = Math.max(10, Math.min(13, hw(y) * 0.82));
                return `<ellipse cx="60" cy="${y}" rx="${f1(Math.min(28, hw(y) + 10))}" ry="4.8" fill="#4a3f9c" stroke="${OUT}" stroke-width="2.4"/>` +
                    `<path d="M${f1(60 - sw)} ${y - 1}C${f1(60 - sw + 2)} ${y - 14} 58 ${y - 22} 70 ${y - 27}C74 ${y - 29} 77 ${y - 26} 74 ${y - 24}C68 ${y - 19} ${f1(60 + sw - 1)} ${y - 10} ${f1(60 + sw)} ${y - 1}Z" fill="#5a4fbf" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>` +
                    `<path d="M62 ${y - 13}l1.4 3l3.2 .4l-2.4 2.2l.6 3.2l-2.8 -1.6l-2.8 1.6l.6 -3.2l-2.4 -2.2l3.2 -.4z" fill="#ffd54d"/>` +
                    `<circle cx="54" cy="${y - 6}" r="1.2" fill="#ffd54d"/>`;
            }
            default: return '';
        }
    }

    const ACC_HELD = { notebook: 1, coffee: 1, clipboard: 1, book: 1, lollipop: 1 };
    function drawAccessoryBehind(id, g) {
        if (id !== 'pencil') return '';
        const T = g.b.top;
        const y = T + 15, x = 60 + g.hw(y) - 7;
        return `<g transform="rotate(-38 ${f1(x)} ${y})"><rect x="${f1(x - 2)}" y="${y - 3}" width="22" height="6" rx="1.2" fill="#f7c948" stroke="#2a2238" stroke-width="2"/>` +
            `<path d="M${f1(x + 20)} ${y - 3}l6 3l-6 3z" fill="#f3d9b0" stroke="#2a2238" stroke-width="2" stroke-linejoin="round"/>` +
            `<rect x="${f1(x - 5)}" y="${y - 3}" width="4.5" height="6" rx="1.4" fill="#f58fa6" stroke="#2a2238" stroke-width="2"/></g>`;
    }
    function drawAccessoryFront(id, g, pal) {
        const OUT = '#2a2238';
        const y = g.mouthY;
        switch (id) {
            case 'glasses': {
                const ey = g.eyeY, dx = g.eyeDx, w = g.hw(ey);
                const edge = Math.min(w - 1.2, dx + 13.5);
                return `<circle cx="${f1(60 - dx)}" cy="${ey}" r="9.4" fill="#fff" fill-opacity=".16" stroke="${OUT}" stroke-width="2.4"/>` +
                    `<circle cx="${f1(60 + dx)}" cy="${ey}" r="9.4" fill="#fff" fill-opacity=".16" stroke="${OUT}" stroke-width="2.4"/>` +
                    `<path d="M${f1(60 - dx + 9.4)} ${ey - 1}Q60 ${ey - 4} ${f1(60 + dx - 9.4)} ${ey - 1}M${f1(60 - dx - 9.4)} ${ey - 1}L${f1(60 - edge)} ${ey - 2.6}M${f1(60 + dx + 9.4)} ${ey - 1}L${f1(60 + edge)} ${ey - 2.6}" fill="none" stroke="${OUT}" stroke-width="2.2" stroke-linecap="round"/>`;
            }
            case 'bowtie': {
                const by = Math.min(g.b.bottom - 12, y + 12);
                return `<path d="M60 ${by}L50 ${by - 5.5}L50 ${by + 5.5}Z M60 ${by}L70 ${by - 5.5}L70 ${by + 5.5}Z" fill="#e8475f" stroke="${OUT}" stroke-width="2.2" stroke-linejoin="round"/>` +
                    `<rect x="57" y="${by - 3}" width="6" height="6" rx="2" fill="#c9314a" stroke="${OUT}" stroke-width="2"/>`;
            }
            case 'scarf': {
                const sy = Math.min(g.b.bottom - 14, y + 10), w = g.hw(sy) + 0.5;
                return `<path d="M${f1(60 - w)} ${sy - 3}Q60 ${sy + 3} ${f1(60 + w)} ${sy - 3}L${f1(60 + w - 0.5)} ${sy + 4}Q60 ${sy + 10} ${f1(60 - w + 0.5)} ${sy + 4}Z" fill="#ff8a5c" stroke="${OUT}" stroke-width="2.2" stroke-linejoin="round"/>` +
                    `<path d="M${f1(60 + w * 0.35)} ${sy + 3}l2 15l7 -1l-1.5 -15z" fill="#ff8a5c" stroke="${OUT}" stroke-width="2.2" stroke-linejoin="round"/>` +
                    `<path d="M${f1(60 + w * 0.35 + 2.4)} ${sy + 16}l6.2 -.8" stroke="#e06a3d" stroke-width="1.6"/>`;
            }
            case 'stethoscope': {
                const sy = Math.min(g.b.bottom - 16, y + 7), w = Math.min(15, g.hw(sy) - 5);
                return `<path d="M${f1(60 - w)} ${sy}C${f1(60 - w)} ${sy + 11} ${f1(60 + w)} ${sy + 11} ${f1(60 + w)} ${sy}" fill="none" stroke="#4a5368" stroke-width="2.6" stroke-linecap="round"/>` +
                    `<path d="M${f1(60 + w * 0.4)} ${sy + 8}C${f1(60 + w * 0.5)} ${sy + 13} ${f1(60 + w * 0.6)} ${sy + 14} ${f1(60 + w * 0.6)} ${sy + 14.5}" fill="none" stroke="#4a5368" stroke-width="2.4" stroke-linecap="round"/>` +
                    `<circle cx="${f1(60 + w * 0.6)}" cy="${sy + 17}" r="3.6" fill="#d7dde8" stroke="${OUT}" stroke-width="2"/>` +
                    `<circle cx="${f1(60 - w)}" cy="${sy}" r="1.6" fill="#4a5368"/><circle cx="${f1(60 + w)}" cy="${sy}" r="1.6" fill="#4a5368"/>`;
            }
            default: return '';
        }
    }

    function arm(g, pal, side, px, py) {
        // Gövde kenarından pati noktasına kısa, yumuşak kol
        const sy = py - 7;
        const sx = 60 + side * (g.hw(sy) - 3);
        const d = `M${f1(sx)} ${f1(sy)}Q${f1(sx + side * 4)} ${f1(py + 1)} ${f1(px)} ${f1(py)}`;
        return `<path d="${d}" fill="none" stroke="${pal.outline}" stroke-width="10" stroke-linecap="round"/>` +
            `<path d="${d}" fill="none" stroke="${pal.base}" stroke-width="6" stroke-linecap="round"/>`;
    }
    function drawHeld(id, g, pal) {
        const OUT = '#2a2238';
        const ay = g.armY;
        let item = '', arms = '';
        if (id === 'coffee') {
            item = `<path d="M53.5 ${ay - 14}L66.5 ${ay - 14}L65 ${ay + 3}Q60 ${ay + 4.5} 55 ${ay + 3}Z" fill="#fbf6ec" stroke="${OUT}" stroke-width="2.2" stroke-linejoin="round"/>` +
                `<rect x="52.5" y="${ay - 17}" width="15" height="4" rx="1.6" fill="#7b5236" stroke="${OUT}" stroke-width="2"/>` +
                `<path d="M54.4 ${ay - 8}L65.6 ${ay - 8}L65.1 ${ay - 2}L54.9 ${ay - 2}Z" fill="#c98a55"/>`;
            arms = arm(g, pal, -1, 54, ay - 4) + arm(g, pal, 1, 66, ay - 4);
        } else if (id === 'notebook') {
            item = `<rect x="48" y="${ay - 14}" width="24" height="17" rx="2.4" fill="#5a8ff0" stroke="${OUT}" stroke-width="2.2"/>` +
                `<rect x="55" y="${ay - 10}" width="10" height="5" rx="1" fill="#fff"/>` +
                `<path d="M52 ${ay - 16}v4M57 ${ay - 16}v4M62 ${ay - 16}v4M67 ${ay - 16}v4" stroke="${OUT}" stroke-width="1.8" stroke-linecap="round"/>`;
            arms = arm(g, pal, -1, 49, ay - 3) + arm(g, pal, 1, 71, ay - 3);
        } else if (id === 'clipboard') {
            item = `<rect x="49" y="${ay - 16}" width="22" height="20" rx="2.4" fill="#b98352" stroke="${OUT}" stroke-width="2.2"/>` +
                `<rect x="52" y="${ay - 12.5}" width="16" height="14" rx="1" fill="#fff"/>` +
                `<path d="M54.5 ${ay - 8}h11M54.5 ${ay - 4.5}h11M54.5 ${ay - 1}h7" stroke="#9aa3b5" stroke-width="1.6" stroke-linecap="round"/>` +
                `<rect x="55.5" y="${ay - 18.5}" width="9" height="4.6" rx="1.6" fill="#a9b2c3" stroke="${OUT}" stroke-width="1.8"/>`;
            arms = arm(g, pal, -1, 50, ay - 3) + arm(g, pal, 1, 70, ay - 3);
        } else if (id === 'book') {
            item = `<rect x="47.5" y="${ay - 13}" width="25" height="16" rx="2" fill="#d9534f" stroke="${OUT}" stroke-width="2.2"/>` +
                `<path d="M50 ${ay + 0.5}h20" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>` +
                `<path d="M56 ${ay - 8.5}h8M57.5 ${ay - 5}h5" stroke="#f6d17a" stroke-width="1.8" stroke-linecap="round"/>`;
            arms = arm(g, pal, -1, 48.5, ay - 3) + arm(g, pal, 1, 71.5, ay - 3);
        } else if (id === 'lollipop') {
            const px = 60 + Math.min(18, g.hw(ay) - 6), cy = ay - 17;
            item = `<path d="M${f1(px + 1)} ${ay}L${f1(px + 2)} ${cy + 5}" stroke="#f1ece4" stroke-width="2.6" stroke-linecap="round"/>` +
                `<circle cx="${f1(px + 2)}" cy="${cy}" r="7" fill="#ff7ab0" stroke="${OUT}" stroke-width="2.2"/>` +
                `<path d="M${f1(px + 2)} ${cy}m-3.6 0a3.6 3.6 0 1 0 3.6 -3.6a2 2 0 1 0 2 2" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>`;
            arms = arm(g, pal, 1, px, ay + 1);
        }
        return { item, arms };
    }

    // Duygu/poz kolları
    function drawEmoteArms(emote, g, pal) {
        const ay = g.armY;
        if (emote === 'wave') {
            const sx = 60 + g.hw(ay - 8) - 3;
            const d = `M${f1(sx)} ${ay - 8}Q${f1(sx + 9)} ${ay - 12} ${f1(sx + 10)} ${ay - 24}`;
            return `<g class="nv-wave-arm"><path d="${d}" fill="none" stroke="${pal.outline}" stroke-width="10" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${pal.base}" stroke-width="6" stroke-linecap="round"/></g>`;
        }
        if (emote === 'cheer') {
            const one = (side) => {
                const sx = 60 + side * (g.hw(ay - 10) - 3);
                const d = `M${f1(sx)} ${ay - 10}Q${f1(sx + side * 10)} ${ay - 16} ${f1(sx + side * 11)} ${ay - 28}`;
                return `<path d="${d}" fill="none" stroke="${pal.outline}" stroke-width="10" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${pal.base}" stroke-width="6" stroke-linecap="round"/>`;
            };
            return `<g class="nv-cheer-arms">${one(-1)}${one(1)}</g>`;
        }
        if (emote === 'think') {
            return arm(g, pal, 1, 64, g.mouthY + 6);
        }
        return '';
    }
    function drawEmoteExtras(emote, g) {
        const T = g.b.top;
        if (emote === 'think') {
            const bx = 60 + g.hw(g.eyeY) + 2;
            return `<g class="nv-think-dots"><circle cx="${f1(bx)}" cy="${T + 4}" r="2.4" fill="#fff" stroke="#2a2238" stroke-width="1.6"/>` +
                `<circle cx="${f1(bx + 6)}" cy="${T - 3}" r="3.4" fill="#fff" stroke="#2a2238" stroke-width="1.6"/>` +
                `<circle cx="${f1(bx + 13)}" cy="${T - 12}" r="4.6" fill="#fff" stroke="#2a2238" stroke-width="1.6"/></g>`;
        }
        if (emote === 'sad') {
            const x = 60 - g.eyeDx - 1, y = g.eyeY + 7;
            return `<path class="nv-tear" d="M${f1(x)} ${y}q-3.2 5 0 7q3.2 -2 0 -7z" fill="#7cc4ff" stroke="#2a5a8a" stroke-width="1.2"/>`;
        }
        if (emote === 'cheer') {
            return `<g class="nv-confetti"><path d="M24 ${T}l3 -3M96 ${T + 4}l-3 -3M30 ${T + 18}l-4 1M90 ${T + 20}l4 1" stroke="#ffd34d" stroke-width="2.6" stroke-linecap="round"/></g>`;
        }
        return '';
    }
    const EMOTE_FACE = {
        wave: { eyes: 'happy', mouth: 'open' },
        cheer: { eyes: 'sparkle', mouth: 'laugh' },
        think: { eyes: 'up', mouth: 'o' },
        sad: { eyes: 'sleepy', mouth: 'sad' },
        laugh: { eyes: 'closed', mouth: 'laugh' }
    };

    // ------------------------------------------------------------------ etkinlikler (kısa döngülü pozlar + nesne)
    const ACTIVITIES = ['read', 'tea', 'doze', 'stretch', 'think', 'wave'];
    const ACTIVITY_LABELS = { read: 'Kitap okuyor', tea: 'Çay içiyor', doze: 'Kestiriyor', stretch: 'Geriniyor', think: 'Düşünüyor', wave: 'El sallıyor' };
    const ACT_FACE = {
        read: { eyes: 'down', mouth: 'smile' },
        tea: { eyes: 'happy', mouth: 'smile' },
        doze: { eyes: 'closed', mouth: 'o' },
        stretch: { eyes: 'closed', mouth: 'o' },
        think: { eyes: 'up', mouth: 'smirk' },
        wave: { eyes: 'happy', mouth: 'open' }
    };
    function limb(d, pal, cls) {
        return `<g${cls ? ` class="${cls}"` : ''}><path d="${d}" fill="none" stroke="${pal.outline}" stroke-width="10" stroke-linecap="round"/>` +
            `<path d="${d}" fill="none" stroke="${pal.base}" stroke-width="6" stroke-linecap="round"/></g>`;
    }
    // "z" harfi: kalın beyaz, koyu konturlu (her zeminde okunur)
    function zee(x, y, s, cls) {
        const d = `M${f1(x)} ${f1(y)}h${f1(s)}l${f1(-s)} ${f1(s * 1.1)}h${f1(s)}`;
        return `<g class="${cls}"><path d="${d}" fill="none" stroke="#2a2238" stroke-width="${f1(s * 0.62)}" stroke-linecap="round" stroke-linejoin="round"/>` +
            `<path d="${d}" fill="none" stroke="#fff" stroke-width="${f1(s * 0.3)}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    }
    /** Etkinlik çizimi: { item: gövde içinde (nefesle hareket eder), extras: gövde dışında, droop } */
    function drawActivity(act, g, pal) {
        const OUT = '#2a2238';
        const T = g.b.top, ay = g.armY, my = g.mouthY;
        if (act === 'read') {
            const by = Math.max(my + 6.5, ay - 16);
            const h = Math.min(15, ay + 5 - by);
            const pw = 15.5;
            const cover = `M60 ${by + 1}L${f1(60 - pw - 1.6)} ${f1(by - 1)}L${f1(60 - pw - 1.6)} ${f1(by + h + 1.6)}L60 ${f1(by + h + 3.4)}L${f1(60 + pw + 1.6)} ${f1(by + h + 1.6)}L${f1(60 + pw + 1.6)} ${f1(by - 1)}Z`;
            const pageL = `M60 ${by + 0.5}L${f1(60 - pw)} ${f1(by - 1.5)}L${f1(60 - pw)} ${f1(by + h)}L60 ${f1(by + h + 2)}Z`;
            const pageR = `M60 ${by + 0.5}L${f1(60 + pw)} ${f1(by - 1.5)}L${f1(60 + pw)} ${f1(by + h)}L60 ${f1(by + h + 2)}Z`;
            const lines = [3.2, 6.4, 9.6].filter(dy => dy < h - 1).map(dy =>
                `M${f1(60 - pw + 2.5)} ${f1(by + dy - 0.6)}L${f1(60 - 3)} ${f1(by + dy + 0.4)}M${f1(60 + 3)} ${f1(by + dy + 0.4)}L${f1(60 + pw - 2.5)} ${f1(by + dy - 0.6)}`).join('');
            const item = `<g class="nv-prop nv-book"><path d="${cover}" fill="#2f7f86" stroke="${OUT}" stroke-width="2.2" stroke-linejoin="round"/>` +
                `<path d="${pageL}" fill="#fbf4e4" stroke="${OUT}" stroke-width="1.6" stroke-linejoin="round"/>` +
                `<path d="${pageR}" fill="#fffaf0" stroke="${OUT}" stroke-width="1.6" stroke-linejoin="round"/>` +
                `<path d="${lines}" stroke="#a9a08c" stroke-width="1.3" stroke-linecap="round"/>` +
                `<path class="nv-page" d="${pageR}" fill="#fffdf7" stroke="${OUT}" stroke-width="1.4" stroke-linejoin="round"/>` +
                `<path d="M60 ${by + 0.5}V${f1(by + h + 2)}" stroke="${OUT}" stroke-width="1.6"/></g>`;
            const arms = arm(g, pal, -1, 60 - pw - 0.5, by + h * 0.6) + arm(g, pal, 1, 60 + pw + 0.5, by + h * 0.6);
            return { item: item + arms, extras: '' };
        }
        if (act === 'tea') {
            const cy = my + 6;                         // fincanın ağzı
            const cx = 60 + Math.min(17, g.hw(cy) * 0.6);
            const cup = `<path d="M${f1(cx - 8.5)} ${cy}L${f1(cx + 8.5)} ${cy}Q${f1(cx + 8)} ${cy + 11} ${f1(cx)} ${cy + 11}Q${f1(cx - 8)} ${cy + 11} ${f1(cx - 8.5)} ${cy}Z" fill="#fdfaf3" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>` +
                `<path d="M${f1(cx - 7.6)} ${cy + 4}L${f1(cx + 7.6)} ${cy + 4}" stroke="#e0705a" stroke-width="2.2"/>` +
                `<ellipse cx="${f1(cx)}" cy="${cy + 0.8}" rx="7" ry="1.6" fill="#b9683a"/>` +
                `<path d="M${f1(cx + 8)} ${cy + 2.4}q5 .4 4.4 4q-.6 3 -5.4 2.4" fill="none" stroke="${OUT}" stroke-width="2.4" stroke-linecap="round"/>` +
                `<ellipse cx="${f1(cx)}" cy="${cy + 12}" rx="11.5" ry="2.6" fill="#fdfaf3" stroke="${OUT}" stroke-width="2"/>`;
            const steam = `<g class="nv-steam"><path class="nv-steam-1" d="M${f1(cx - 3)} ${cy - 3}q-2.6 -3.2 0 -6.4q2.6 -3.2 0 -6.4" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".9"/>` +
                `<path class="nv-steam-2" d="M${f1(cx + 3)} ${cy - 2}q-2.2 -2.8 0 -5.6q2.2 -2.8 0 -5.6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".75"/></g>`;
            const hands = arm(g, pal, -1, cx - 10, cy + 12) + arm(g, pal, 1, cx + 9, cy + 9);
            return { item: `<g class="nv-prop nv-sip">${hands}${steam}${cup}</g>`, extras: '' };
        }
        if (act === 'doze') {
            const x = 60 + Math.min(14, g.hw(T + 8) * 0.6) + 4, y = T - 2;
            return {
                item: '', droop: true,
                extras: `<g class="nv-zzz">${zee(x - 2, y + 2, 7.5, 'nv-z nv-z-1')}${zee(x + 8, y - 9, 9.5, 'nv-z nv-z-2')}${zee(x + 19, y - 22, 11.5, 'nv-z nv-z-3')}</g>`
            };
        }
        if (act === 'stretch') {
            const one = (side) => {
                const sy = g.eyeY + 6, sx = 60 + side * (g.hw(sy) - 3);
                return limb(`M${f1(sx)} ${sy}Q${f1(sx + side * 7)} ${sy - 8} ${f1(sx + side * 6)} ${sy - 20}`, pal);
            };
            return { item: `<g class="nv-stretch-arms">${one(-1)}${one(1)}</g>`, extras: '' };
        }
        if (act === 'think') {
            const sy = ay - 6, sx = 60 + g.hw(sy) - 3;
            return { item: limb(`M${f1(sx)} ${sy}Q${f1(sx - 2)} ${f1(my + 12)} ${63} ${f1(my + 7)}`, pal, 'nv-chin'), extras: drawEmoteExtras('think', g) };
        }
        if (act === 'wave') {
            const sy = g.eyeY + 10, sx = 60 + g.hw(sy) - 3;
            return { item: limb(`M${f1(sx)} ${sy}Q${f1(sx + 10)} ${sy - 3} ${f1(sx + 10)} ${sy - 17}`, pal, 'nv-wave-arm'), extras: '' };
        }
        return { item: '', extras: '' };
    }

    // ------------------------------------------------------------------ render
    function esc(s) {
        return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }
    const FACINGS = ['front', 'left', 'right'];
    const cfgKey = (cfg) => KEYS.map(k => cfg[k]).join('.');
    function cfgFromKey(str) {
        const parts = String(str || '').split('.');
        if (parts.length !== KEYS.length) return null;
        const o = { v: 2 };
        KEYS.forEach((k, i) => { o[k] = parts[i]; });
        return normalize(o);
    }

    /** SVG'nin iç işaretlemesi (kök <svg> hariç) */
    function inner(cfg, framed, emote, activity) {
        const g = GEOM[cfg.body] || GEOM.round;
        const pal = palette(cfg.color);
        const face = emote ? EMOTE_FACE[emote] : (activity ? ACT_FACE[activity] : null);
        const eyes = face ? face.eyes : cfg.eyes;
        const mouth = face ? face.mouth : cfg.mouth;
        const act = (!emote && activity) ? drawActivity(activity, g, pal) : null;

        const held = (!emote && !act && ACC_HELD[cfg.accessory]) ? drawHeld(cfg.accessory, g, pal) : { item: '', arms: '' };
        const glasses = cfg.accessory === 'glasses';
        const faceAcc = (glasses && !emote) ? drawAccessoryFront('glasses', g, pal) : '';
        const bodyAcc = glasses ? '' : drawAccessoryFront(cfg.accessory, g, pal);
        const cheeks = cfg.pattern === 'cheeks';

        const figure =
            `<g class="nv-sway">` +
            drawAccessoryBehind(cfg.accessory, g) +
            drawTufts(cfg.tufts, g, pal, emote === 'sad' || !!(act && act.droop)) +
            drawFeet(g, pal) +
            `<g class="nv-torso">` +
            drawBody(g, pal) +
            (cheeks ? '' : drawPattern(cfg.pattern, g, pal)) +
            `<g class="nv-face">` +
            (cheeks ? drawPattern('cheeks', g, pal) : '') +
            `<g class="nv-look"><g class="nv-eyes">${drawEyes(eyes, g, pal)}</g></g>` +
            drawMouth(mouth, g) +
            faceAcc +
            `</g>` +
            (bodyAcc ? `<g class="nv-chest">${bodyAcc}</g>` : '') +
            `<g class="nv-hat">${drawHeadwear(cfg.headwear, g, pal)}</g>` +
            held.item + held.arms +
            (emote ? drawEmoteArms(emote, g, pal) : '') +
            (act ? act.item : '') +
            `</g>` +
            (emote ? drawEmoteExtras(emote, g) : '') +
            (act ? act.extras : '') +
            `</g>`;

        const bg = byId.background[cfg.background] || byId.background[DEFAULT.background];
        let frame = '';
        let wrapOpen;
        if (framed) {
            if (bg.hex) frame = `<circle cx="60" cy="60" r="58" fill="${bg.hex}" stroke="${bg.ring}" stroke-width="2"/>`;
            wrapOpen = `<g transform="translate(60 63) scale(.9) translate(-60 -63)">`;
        } else {
            frame = `<ellipse class="nv-ground" cx="60" cy="104" rx="27" ry="4.5" fill="#000" opacity=".16"/>`;
            wrapOpen = `<g transform="translate(0 2)">`;
        }
        // nv-flip: yön (sola bakış = yatay ayna). Görünmez dikdörtgen kutuyu 0-120 aralığında simetrik tutar,
        // böylece CSS dönüşümü (transform-box: fill-box) tam ortadan aynalar.
        return frame + wrapOpen + `<g class="nv-figure"><g class="nv-flip"><rect x="0" y="0" width="120" height="1" fill="none"/>${figure}</g></g></g>`;
    }

    function rootClasses(cfg, o) {
        const framed = o.framed !== false;
        const emote = EMOTES.includes(o.emote) ? o.emote : null;
        const activity = (!emote && ACTIVITIES.includes(o.activity)) ? o.activity : null;
        const facing = FACINGS.includes(o.facing) ? o.facing : 'front';
        const h = hashString(KEYS.map(k => cfg[k]).join('|'));
        const cls = ['nv', framed ? 'nv-framed' : 'nv-free'];
        if (o.animated) cls.push('nv-anim', 'nv-dly-' + (h % 4));
        if (emote) cls.push('nv-emote', 'nv-emote-' + emote);
        if (activity) cls.push('nv-act', 'nv-act-' + activity);
        if (facing !== 'front') cls.push('nv-f-side', 'nv-f-' + facing);
        if (o.walking) cls.push('nv-walking');
        if (o.className) cls.push(String(o.className).replace(/[^\w\- ]/g, ''));
        return { cls, framed, emote, activity, facing };
    }

    function render(config, opts) {
        const o = opts || {};
        const cfg = normalize(config);
        const size = Math.max(12, Math.round(Number(o.size) || 56));
        const r = rootClasses(cfg, o);
        const a11y = o.title ? `role="img" aria-label="${esc(o.title)}"` : 'aria-hidden="true" focusable="false"';
        // data-nv: kısa yapılandırma anahtarı; setPose etkinliği aynı öğe içinde yeniden çizebilsin diye
        return `<svg class="${r.cls.join(' ')}" viewBox="0 0 120 120" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" data-nv="${cfgKey(cfg)}" ${a11y}>` +
            inner(cfg, r.framed, r.emote, r.activity) + `</svg>`;
    }

    /**
     * Çizilmiş bir Nöro'nun pozunu yerinde değiştirir (aynı <svg> öğesi kalır).
     * el: svg.nv ya da onu içeren öğe. pose: { facing?, walking?, activity? } (verilmeyen değişmez).
     * facing/walking yalnızca sınıf değiştirir (DOM değişmez, CSS ile yumuşak döner);
     * activity değişince yalnızca o svg'nin iç işaretlemesi yeniden üretilir. Dönen değer: svg ya da null.
     */
    function setPose(el, pose) {
        const svg = el && (el.matches && el.matches('svg.nv') ? el : el.querySelector && el.querySelector('svg.nv'));
        if (!svg || !pose) return null;
        const cl = svg.classList;
        if (pose.facing !== undefined) {
            const f = FACINGS.includes(pose.facing) ? pose.facing : 'front';
            cl.toggle('nv-f-side', f !== 'front');
            cl.toggle('nv-f-left', f === 'left');
            cl.toggle('nv-f-right', f === 'right');
        }
        if (pose.walking !== undefined) cl.toggle('nv-walking', !!pose.walking);
        if (pose.activity !== undefined) {
            const act = ACTIVITIES.includes(pose.activity) ? pose.activity : null;
            const cur = ACTIVITIES.find(a => cl.contains('nv-act-' + a)) || null;
            const emote = EMOTES.find(e => cl.contains('nv-emote-' + e)) || null;
            if (act !== cur) {
                ACTIVITIES.forEach(a => cl.remove('nv-act-' + a));
                cl.toggle('nv-act', !!act && !emote);
                if (act && !emote) cl.add('nv-act-' + act);
                const cfg = cfgFromKey(svg.getAttribute('data-nv')) || normalize(null);
                svg.innerHTML = inner(cfg, cl.contains('nv-framed'), emote, emote ? null : act);
            }
        }
        return svg;
    }
    function getPose(el) {
        const svg = el && (el.matches && el.matches('svg.nv') ? el : el.querySelector && el.querySelector('svg.nv'));
        if (!svg) return null;
        const cl = svg.classList;
        return {
            facing: cl.contains('nv-f-left') ? 'left' : cl.contains('nv-f-right') ? 'right' : 'front',
            walking: cl.contains('nv-walking'),
            activity: ACTIVITIES.find(a => cl.contains('nv-act-' + a)) || null
        };
    }

    function partName(slot, id) {
        const p = byId[slot] && byId[slot][id];
        return p ? p.name : '';
    }
    function describe(config) {
        const c = normalize(config);
        return `${partName('color', c.color)} ${partName('body', c.body).toLocaleLowerCase('tr')} Nöro`;
    }

    const api = { PARTS, SLOTS, DEFAULT, EMOTES, EMOTE_LABELS, ACTIVITIES, ACTIVITY_LABELS, FACINGS, normalize, isLegacy, equals, randomConfig, render, setPose, getPose, partName, describe };
    global.PsikoVakaAvatar = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
