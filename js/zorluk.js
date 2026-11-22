/**
 * PsikoVaka — zorluk ayarları (Normal | Zor).
 * Tek birleşik Zor mod: tek tahmin hakkı + kategori gizli + kategori tarayıcısı kapalı.
 * Sunucu sözleşmesi (0007): tek_hak ve kategori_gizli alanları birlikte true/false gönderilir.
 */
(function (global) {
    'use strict';
    const KEY = 'psikovaka_zorluk';
    const ITEMS = [
        { key: 'tekHak', db: 'tek_hak', icon: 'target', title: 'Tek tahmin hakkı', short: 'Tek hak', desc: '' },
        { key: 'kategoriGizli', db: 'kategori_gizli', icon: 'eye-off', title: 'Kategori gizli', short: 'Kategori gizli', desc: '' }
    ];
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const svg = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;

    /** Her biçimden (istemci {tekHak}, sunucu {tek_hak}) {tekHak, kategoriGizli}. */
    function norm(z) {
        z = z || {};
        const tekHak = !!(z.tekHak != null ? z.tekHak : z.tek_hak);
        const kategoriGizli = !!(z.kategoriGizli != null ? z.kategoriGizli : z.kategori_gizli);
        return { tekHak, kategoriGizli };
    }
    const count = (z) => { const n = norm(z); return (n.tekHak ? 1 : 0) + (n.kategoriGizli ? 1 : 0); };
    const any = (z) => count(z) > 0;
    const toDb = (z) => { const n = norm(z); return { tek_hak: n.tekHak, kategori_gizli: n.kategoriGizli }; };

    function load() {
        try {
            const n = norm(JSON.parse(localStorage.getItem(KEY) || '{}'));
            return any(n) ? { tekHak: true, kategoriGizli: true } : { tekHak: false, kategoriGizli: false };
        } catch (e) {
            return { tekHak: false, kategoriGizli: false };
        }
    }
    function save(z) {
        try {
            const isHard = any(z);
            localStorage.setItem(KEY, JSON.stringify({ tekHak: isHard, kategoriGizli: isHard }));
        } catch (e) { /* yok */ }
    }

    /** Elo çarpanı (online özel oda): cfg = game_config nesnesi; yoksa 1,25 / 1,5. */
    function multiplier(z, cfg) {
        const n = count(z);
        if (!n) return 1;
        const c = cfg || {};
        const v = n === 1 ? c.rp_zorluk_carpan_1 : c.rp_zorluk_carpan_2;
        return Number(v) > 0 ? Number(v) : (n === 1 ? 1.25 : 1.5);
    }
    /** 1.5 → "×1,5" */
    function fmtMult(m) { return '×' + String(Math.round(Number(m) * 100) / 100).replace('.', ','); }
    function names(z) { return any(z) ? ['Zor'] : []; }
    function label(z) { return any(z) ? 'Zor' : ''; }

    /** Küçük "Zor" rozeti. Ayar yoksa ''. */
    function badge(z, opts) {
        if (!any(z)) return '';
        const o = opts || {};
        return `<span class="zor-badge${o.cls ? ' ' + o.cls : ''}" role="img" aria-label="Zor mod" title="Zor mod">${svg('zap')}<span class="zor-badge-t">Zor</span></span>`;
    }
    /** Paylaşım satırı: "Zor mod" */
    function shareLine(z) { return any(z) ? 'Zor mod' : ''; }

    /**
     * Sade zorluk seçici: yalnızca "Normal" ve "Zor" (ek açıklama yok).
     * Zor seçildiğinde tekHak ve kategoriGizli birlikte aktif olur.
     */
    function switches(z, opts) {
        const isHard = any(z);
        const o = opts || {};
        const id = o.id || 'zor';
        const dis = o.disabled ? ' disabled' : '';
        return `<div class="settings-group zorluk-group" data-zorluk-root="${esc(id)}">
            <span class="settings-label" id="${esc(id)}Label">${esc(o.title || 'Zorluk')}</span>
            <div class="segmented zorluk-segmented" role="radiogroup" aria-labelledby="${esc(id)}Label">
                <button class="segmented-btn zorluk-seg-btn${!isHard ? ' active' : ''}" type="button" role="radio" id="${esc(id)}-normal" data-zorluk-mode="normal" aria-checked="${!isHard}"${dis}>Normal</button>
                <button class="segmented-btn zorluk-seg-btn${isHard ? ' active' : ''}" type="button" role="radio" id="${esc(id)}-zor" data-zorluk-mode="zor" aria-checked="${isHard}"${dis}>Zor</button>
            </div>
        </div>`;
    }

    function multHtml(m) {
        return m > 1 ? `${svg('zap')}<span>Elo ${esc(fmtMult(m))}</span>` : '';
    }

    /** Kökteki seçimi okur: Zor → {tekHak: true, kategoriGizli: true}, Normal → {tekHak: false, kategoriGizli: false}. */
    function read(root) {
        if (!root) return { tekHak: false, kategoriGizli: false };
        const zorBtn = root.querySelector('[data-zorluk-mode="zor"]');
        const isHard = !!(zorBtn && zorBtn.getAttribute('aria-checked') === 'true');
        return { tekHak: isHard, kategoriGizli: isHard };
    }

    /** Tıklama bağlar; onChange(yeniZ, 'zor'). Bir kez bağlanır (kök başına). */
    function bind(root, onChange) {
        if (!root || root._zorBound) return;
        root._zorBound = true;
        root.addEventListener('click', (e) => {
            const b = e.target.closest('[data-zorluk-mode]');
            if (!b || b.disabled || !root.contains(b)) return;
            const isHard = b.dataset.zorlukMode === 'zor';
            set(root, { tekHak: isHard, kategoriGizli: isHard });
            if (onChange) onChange({ tekHak: isHard, kategoriGizli: isHard }, 'zor');
        });
    }

    function set(root, z) {
        if (!root) return;
        const isHard = any(z);
        const normBtn = root.querySelector('[data-zorluk-mode="normal"]');
        const zorBtn = root.querySelector('[data-zorluk-mode="zor"]');
        if (normBtn) {
            normBtn.setAttribute('aria-checked', String(!isHard));
            normBtn.classList.toggle('active', !isHard);
        }
        if (zorBtn) {
            zorBtn.setAttribute('aria-checked', String(isHard));
            zorBtn.classList.toggle('active', isHard);
        }
    }

    global.PsikoVakaZorluk = { KEY, ITEMS, norm, count, any, toDb, load, save, multiplier, fmtMult, names, label, badge, shareLine, switches, multHtml, read, bind, set };
})(typeof window !== 'undefined' ? window : globalThis);
