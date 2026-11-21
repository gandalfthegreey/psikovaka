/**
 * PsikoVaka — zorluk ayarları (ajan Z1, 2026-11-21; Emre kararı).
 * İki bağımsız ayar: "Tek tahmin hakkı" (tekHak) ve "Kategori gizli" (kategoriGizli).
 * Pratik, günün vakası, özel online odalar ve sınıf modu bu modülün metinlerini, rozetini ve
 * anahtarlarını (switch) ortak kullanır. Sunucu adları: tek_hak / kategori_gizli (0007).
 * Bağımlılık yok; satır içi stil yok (görünüm css/style.css "Zorluk" bölümü).
 */
(function (global) {
    'use strict';
    const KEY = 'psikovaka_zorluk';
    const ITEMS = [
        { key: 'tekHak', db: 'tek_hak', icon: 'target', title: 'Tek tahmin hakkı', short: 'Tek hak',
            desc: 'Vaka başına tek tahminin var; yanlışsa vaka biter. İpuçlarını tahmin etmeden "Sonraki ipucu" ile açabilirsin.' },
        { key: 'kategoriGizli', db: 'kategori_gizli', icon: 'eye-off', title: 'Kategori gizli', short: 'Kategori gizli',
            desc: 'Oyun sırasında tanı grubu ve "aynı grup" geri bildirimi gösterilmez; yanlış tahmin yalnızca "yanlış" der.' }
    ];
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const svg = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;

    /** Her biçimden (istemci {tekHak}, sunucu {tek_hak}) {tekHak, kategoriGizli}. */
    function norm(z) {
        z = z || {};
        return { tekHak: !!(z.tekHak != null ? z.tekHak : z.tek_hak), kategoriGizli: !!(z.kategoriGizli != null ? z.kategoriGizli : z.kategori_gizli) };
    }
    const count = (z) => { const n = norm(z); return (n.tekHak ? 1 : 0) + (n.kategoriGizli ? 1 : 0); };
    const any = (z) => count(z) > 0;
    const toDb = (z) => { const n = norm(z); return { tek_hak: n.tekHak, kategori_gizli: n.kategoriGizli }; };

    function load() { try { return norm(JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { return norm({}); } }
    function save(z) { try { localStorage.setItem(KEY, JSON.stringify(norm(z))); } catch (e) { /* yok */ } }

    /** Elo çarpanı (online özel oda): cfg = game_config nesnesi {anahtar: değer}; yoksa 1,25 / 1,5. */
    function multiplier(z, cfg) {
        const n = count(z);
        if (!n) return 1;
        const c = cfg || {};
        const v = n === 1 ? c.rp_zorluk_carpan_1 : c.rp_zorluk_carpan_2;
        return Number(v) > 0 ? Number(v) : (n === 1 ? 1.25 : 1.5);
    }
    /** 1.5 → "×1,5" */
    function fmtMult(m) { return '×' + String(Math.round(Number(m) * 100) / 100).replace('.', ','); }
    function names(z) { const n = norm(z); return ITEMS.filter(i => n[i.key]).map(i => i.title); }
    function label(z) { return names(z).join(' + '); }

    /** Küçük "Zor" rozeti + açık ayarların simgeleri. Ayar yoksa ''. */
    function badge(z, opts) {
        const n = norm(z);
        if (!any(n)) return '';
        const o = opts || {};
        const txt = 'Zor: ' + names(n).join(', ');
        return `<span class="zor-badge${o.cls ? ' ' + o.cls : ''}" role="img" aria-label="${esc(txt)}" title="${esc(txt)}">${svg('zap')}<span class="zor-badge-t">Zor</span>${ITEMS.filter(i => n[i.key]).map(i => `<span class="zor-badge-i">${svg(i.icon)}</span>`).join('')}</span>`;
    }
    /** Paylaşım satırı (emoji yok): "Zor: tek hak + kategori gizli" */
    function shareLine(z) { const n = norm(z); return any(n) ? 'Zor: ' + ITEMS.filter(i => n[i.key]).map(i => i.short.toLocaleLowerCase('tr')).join(' + ') : ''; }

    /**
     * "Zorluk" bölümü: iki anahtar (button role=switch, mevcut .switch-row bileşeni).
     * opts: { id: önek, disabled, note (düz metin), title, mult: true → bonus satırı, cfg, desc: { tekHak?, kategoriGizli? } açıklamayı değiştirir }
     */
    function switches(z, opts) {
        const n = norm(z), o = opts || {};
        const id = o.id || 'zor';
        const mult = o.mult ? multiplier(n, o.cfg) : 1;
        return `<div class="settings-group zorluk-group" data-zorluk-root="${esc(id)}">
            <span class="settings-label" id="${esc(id)}Label">${esc(o.title || 'Zorluk')}</span>
            ${ITEMS.map(i => `<button class="switch-row zorluk-switch" type="button" role="switch" id="${esc(id)}-${i.key}" data-zorluk="${i.key}" aria-checked="${n[i.key]}"${o.disabled ? ' disabled' : ''}>
                <span class="zorluk-switch-ico">${svg(i.icon)}</span>
                <span class="switch-row-text"><span class="list-row-title">${esc(i.title)}</span><span class="list-row-sub">${esc((o.desc && o.desc[i.key]) || i.desc)}</span></span>
                <span class="switch" aria-hidden="true"><span class="switch-knob"></span></span>
            </button>`).join('')}
            ${o.mult ? `<p class="zorluk-mult" data-zorluk-mult>${multHtml(mult)}</p>` : ''}
            ${o.note ? `<p class="zorluk-note">${esc(o.note)}</p>` : ''}
        </div>`;
    }
    function multHtml(m) {
        return m > 1 ? `${svg('zap')}<span>Zorluk bonusu ${esc(fmtMult(m))}: turda kazandığın Elo ${esc(fmtMult(m))} olur (çözemezsen −10 aynı kalır).</span>`
            : `${svg('info')}<span>Bir ayar açıkken kazandığın Elo ×1,25, ikisi açıkken ×1,5 olur.</span>`;
    }
    /** Kökteki anahtarları okur. */
    function read(root) {
        const z = { tekHak: false, kategoriGizli: false };
        if (!root) return z;
        root.querySelectorAll('[data-zorluk]').forEach(b => { z[b.dataset.zorluk] = b.getAttribute('aria-checked') === 'true'; });
        return z;
    }
    /** Tıklama bağlar; onChange(yeniZ, anahtar). Bir kez bağlanır (kök başına). */
    function bind(root, onChange, opts) {
        if (!root || root._zorBound) return;
        root._zorBound = true;
        const o = opts || {};
        root.addEventListener('click', (e) => {
            const b = e.target.closest('[data-zorluk]');
            if (!b || b.disabled || !root.contains(b)) return;
            b.setAttribute('aria-checked', String(b.getAttribute('aria-checked') !== 'true'));
            const z = read(root);
            const m = root.querySelector('[data-zorluk-mult]');
            if (m) m.innerHTML = multHtml(multiplier(z, typeof o.cfg === 'function' ? o.cfg() : o.cfg));
            if (onChange) onChange(z, b.dataset.zorluk);
        });
    }
    function set(root, z) {
        if (!root) return;
        const n = norm(z);
        root.querySelectorAll('[data-zorluk]').forEach(b => b.setAttribute('aria-checked', String(!!n[b.dataset.zorluk])));
    }

    global.PsikoVakaZorluk = { KEY, ITEMS, norm, count, any, toDb, load, save, multiplier, fmtMult, names, label, badge, shareLine, switches, multHtml, read, bind, set };
})(typeof window !== 'undefined' ? window : globalThis);
