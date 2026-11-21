/**
 * PsikoVaka Online — Sınıf (projeksiyon) modu istemcisi (ajan C2, 2026-11-21). Sözleşme: supabase/TASARIM.md §15.
 *
 * Yollar: #/katil (kod + takma ad), #/katil/KOD (QR kodu bunu açar), #/sinif/<oturum_id> (sunucuya projeksiyon,
 * katılımcıya telefon görünümü; hangisi olduğu sinif_durum.rol'den gelir). Görünüm tam ekran bir katmanda (#sinifLayer).
 * Giriş noktaları: Online merkezinde "Sınıf modu" kartı (kullanıcı adı olan hesap) ve "Sınıf oyununa katıl" (herkes).
 * §15 RPC'leri yoksa (özellik algılama) ya da sayfa file:// ise hiçbir giriş noktası görünmez.
 * Anonim giriş YALNIZCA katılma formunda, oturum yoksa yapılır (NS.sinifApi.ensureSession).
 * İpuçları sunucu saatine göre yerelde açılır (ağ gerekmez); yoklama + Realtime ile durum güncel tutulur.
 */
(function (global) {
    'use strict';
    const NS = global.PsikoVakaOnline;
    const { esc, $ } = NS.util;
    const API = NS.sinifApi;

    const LAST_KEY = 'psikovaka_sinif_son';
    const SETTINGS_KEY = 'psikovaka_sinif_ayar';
    const CLUE_LABELS = ['Başvuru şikâyeti', 'Süre ve başlangıç', 'İşlevsellik ve davranış', 'Tıbbi dışlama ve tetikleyiciler', 'Ruhsal durum muayenesi', 'Kilit tanı kriteri'];
    const NAME_RE = /^[\p{L}0-9 _.\-]+$/u;
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const DURUM_AD = { lobi: 'Lobi', tur: 'Tur sürüyor', cevap: 'Cevap', skor: 'Sıralama', bitti: 'Bitti', iptal: 'İptal' };

    const C = {
        started: false, layer: null, screen: null, frame: null,
        id: null, d: null, mode: null, surum: null, loading: false, again: false,
        sub: null, live: false, pollT: null, tickT: null, lastClue: -1, closeReqAt: 0,
        solved: new Map(), solvedTur: 0, avatars: new Map(), avatarAskedAt: 0, avatarAsked: new Set(),
        offline: false, view: null, showExplain: false, guessBusy: false, feedback: null, ac: { items: [], idx: -1 },
        hubOpen: null, hubOpenAt: 0, gone: null, refreshDeb: null, prevRoute: null
    };

    // ------------------------------------------------------------ yardımcılar
    const game = () => NS.game();
    const acc = () => global.PsikoVakaAccount || null;
    function snap() { const a = acc(); try { return a && a.snapshot ? a.snapshot() : null; } catch (e) { return null; } }
    function signedIn() { const a = acc(); return !!(a && a.availability === 'ready' && a.state === 'ready'); }
    function isFile() { return location.protocol === 'file:'; }
    function reduced() { return NS.util.reducedMotion(); }
    function cases() { const g = game(); return (g && (g.allMasterCases || g.cases)) || (typeof CLINICAL_CASES !== 'undefined' ? CLINICAL_CASES : []); }
    function findCase(id) { return cases().find(c => c.id === id) || null; }
    function diagnoses() { const g = game(); return (g && g.diagnoses) || (typeof DIAGNOSES_DATABASE !== 'undefined' ? DIAGNOSES_DATABASE : []); }
    function diag(id) { return diagnoses().find(d => d.id === id) || null; }
    function catName(key) { const g = game(); const c = g && g.categories && g.categories[key]; return c ? c.name : (key || ''); }
    function norm(s) { const g = game(); return g && g.normalizeTurkish ? g.normalizeTurkish(s) : String(s || '').toLocaleLowerCase('tr').trim(); }
    function toast(m) { NS.toast(m); }
    function announce(m) { const el = C.layer && C.layer.querySelector('#sinifLive'); if (!el) { NS.announce(m); return; } el.textContent = ''; setTimeout(() => { el.textContent = m; }, 30); }
    const SPRITE = {
        maximize: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
        minimize: '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>',
        up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
        down: '<path d="M12 5v14M5 12l7 7 7-7"/>',
        same: '<path d="M5 12h14"/>',
        next: '<path d="M5 12h14M13 6l6 6-6 6"/>',
        stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
        door: '<path d="M14 3H6v18h8M14 3l5 2v14l-5 2zM11.5 12h.01"/>',
        school: '<path d="M2 9l10-5 10 5-10 5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6"/>',
        star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>'
    };
    function ic(name, cls) {
        const id = SPRITE[name] ? 'sn-' + name : 'i-' + name;
        return `<svg class="icon${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#${id}"/></svg>`;
    }
    function injectSprite() {
        if (document.getElementById('sinifSprite')) return;
        const s = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
        const w = document.createElement('div');
        w.innerHTML = `<svg id="sinifSprite" class="icon-sprite" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs>${Object.entries(SPRITE).map(([k, v]) => `<symbol id="sn-${k}" viewBox="0 0 24 24"><g ${s}>${v}</g></symbol>`).join('')}</defs></svg>`;
        document.body.insertBefore(w.firstChild, document.body.firstChild);
    }
    function noroCfg(p) {
        const A = global.PsikoVakaAvatar;
        if (!A) return {};
        if (p && C.avatars.has(p.katilimci_id)) return C.avatars.get(p.katilimci_id);
        return A.randomConfig('sinif:' + String((p && p.takma_ad) || '?').toLocaleLowerCase('tr'));
    }
    function myCfg() {
        const s = snap();
        if (s && s.state === 'ready' && s.profile && s.profile.avatar) return s.profile.avatar;
        const me = C.d && C.d.ben;
        return noroCfg(me ? { takma_ad: me.takma_ad } : null);
    }
    function noro(cfg, size, o) {
        const opt = Object.assign({ size, framed: false, animated: !reduced() }, o || {});
        if (reduced()) { opt.animated = false; }
        return NS.avatar(cfg, opt);
    }
    function joinUrl(kod) { return `${location.origin}${location.pathname}#/katil/${kod}`; }
    function shortUrl() { return `${location.host}${location.pathname.replace(/index\.html$/, '').replace(/\/$/, '')}/#/katil`; }
    function fmtSec(s) { s = Math.max(0, Math.ceil(s)); return s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : `${s} sn`; }
    function setHTML(el, html) { if (el && el._sig !== html) { el._sig = html; el.innerHTML = html; return true; } return false; }

    // ------------------------------------------------------------ zaman çizelgesi (§15.1)
    function tl() {
        const d = C.d;
        if (!d || !d.tur || d.oturum.durum !== 'tur') return null;
        const start = Date.parse(d.tur.baslangic), end = Date.parse(d.tur.son);
        const ar = (d.oturum.ayarlar && d.oturum.ayarlar.ipucu_araligi_sn) || 15;
        const now = API.clock.now();
        const g = (now - start) / 1000;
        const k = g < 0 ? 0 : Math.min(6, 1 + Math.floor(g / ar));
        let left, frac;
        if (k === 0) { left = -g; frac = 0; }
        else if (k < 6) { const into = g - (k - 1) * ar; left = ar - into; frac = into / ar; }
        else { left = (end - now) / 1000; frac = 1 - Math.max(0, left) / ar; }
        return { k, left: Math.max(0, left), frac: Math.max(0, Math.min(1, frac)), ar, end, now };
    }
    function clueIndex() { const t = tl(); return t ? t.k : 6; }

    // ------------------------------------------------------------ katman ve ekran
    function ensureScreen() {
        if (C.screen && document.body.contains(C.screen)) return C.screen;
        const online = document.getElementById('screenOnline');
        const sec = document.createElement('section');
        sec.className = 'screen';
        sec.id = 'screenSinif';
        sec.dataset.screen = 'sinif';
        sec.hidden = true;
        sec.setAttribute('aria-label', 'Sınıf modu');
        if (online && online.parentNode) online.parentNode.insertBefore(sec, online.nextSibling); else document.body.appendChild(sec);
        C.screen = sec;
        return sec;
    }
    function layer() {
        if (C.layer && document.body.contains(C.layer)) return C.layer;
        const l = document.createElement('div');
        l.id = 'sinifLayer';
        l.className = 'sinif-layer';
        l.hidden = true;
        l.setAttribute('role', 'region');
        l.setAttribute('aria-label', 'Sınıf modu');
        l.innerHTML = '<div class="sinif-root" id="sinifRoot"></div><div class="ol-offscreen" id="sinifLive" aria-live="polite" role="status"></div>';
        document.body.appendChild(l);
        l.addEventListener('click', onClick);
        l.addEventListener('submit', onSubmit);
        l.addEventListener('input', onInput);
        l.addEventListener('keydown', onKeydown);
        C.layer = l;
        return l;
    }
    function root() { return layer().querySelector('#sinifRoot'); }
    function showLayer(on, kind) {
        const l = layer();
        l.hidden = !on;
        document.body.classList.toggle('sinif-open', !!on);
        l.classList.toggle('is-proj', on && kind === 'proj');
        l.classList.toggle('is-tel', on && kind !== 'proj');
        if (!on) { C.frame = null; root().innerHTML = ''; }
    }
    /** Basit tek parça görünüm (katılma formu, hata, bitiş mesajları): telefon çerçevesi. */
    function simpleView(key, html) {
        showLayer(true, 'tel');
        C.frame = 'simple';
        C.view = key;
        const r = root();
        r.className = 'sinif-root sinif-simple';
        r.innerHTML = `<div class="sinif-simple-inner">${html}</div>`;
        const f = r.querySelector('[data-autofocus]');
        if (f) setTimeout(() => { try { f.focus({ preventScroll: true }); } catch (e) { /* yok */ } }, 30);
    }
    function topBar(extra) {
        return `<div class="sinif-topbar"><button class="icon-btn" type="button" data-sn="home" aria-label="Sınıf modundan çık">${ic('arrow-left')}</button>
            <span class="sinif-brand">${ic('school')}<span>Sınıf modu</span></span>${extra || ''}</div>`;
    }
    function msgBox(fig, title, text, btns) {
        return `${topBar()}<div class="sinif-msg"><div class="sinif-msg-fig" aria-hidden="true">${fig}</div>
            <h1 class="sinif-h1" tabindex="-1" data-autofocus>${esc(title)}</h1>${text ? `<p class="sinif-msg-text">${esc(text)}</p>` : ''}
            <div class="sinif-msg-btns">${btns || ''}</div></div>`;
    }
    const homeBtn = (kind) => `<button class="btn ${kind || 'btn-secondary'} btn-lg" type="button" data-sn="home">${ic('home')}<span>Ana sayfaya dön</span></button>`;
    const signupBtn = () => `<button class="btn btn-primary btn-lg" type="button" data-sn="signup">${ic('user')}<span>Hesap aç</span></button>`;

    // ------------------------------------------------------------ giriş noktası: Online merkezi kartı
    function renderHubCard(slot) {
        if (!slot) return;
        if (isFile() || !API) { slot.hidden = true; slot.innerHTML = ''; return; }
        if (API.supported !== true) {
            slot.hidden = true;
            API.probe().then(ok => { if (ok) renderHubCard(document.getElementById('olSinifSlot')); });
            return;
        }
        const ready = signedIn();
        let html;
        if (ready) {
            const open = (C.hubOpen || []).map(o => `<li class="sinif-open-row"><span class="sinif-open-code">${esc(o.kod)}</span>
                <span class="sinif-open-meta">${esc(DURUM_AD[o.durum] || o.durum)} · ${o.katilimci_sayisi} kişi</span>
                <a class="btn btn-secondary btn-sm" href="#/sinif/${esc(o.oturum_id)}">Projeksiyona dön</a></li>`).join('');
            html = `<section class="sinif-hub card" aria-labelledby="sinifHubT">
                <div class="sinif-hub-main">
                    <span class="sinif-hub-icon" aria-hidden="true">${ic('school')}</span>
                    <span class="sinif-hub-text"><h2 class="sinif-hub-title" id="sinifHubT">Sınıf modu</h2><span class="sinif-hub-sub">Derste projeksiyonla oyna: öğrenciler telefondan takma adla katılır.</span></span>
                    <button class="btn btn-primary" type="button" data-sn-hub="setup">${ic('play')}<span>Oturum kur</span></button>
                </div>
                ${open ? `<ul class="sinif-open-list" aria-label="Açık oturumların">${open}</ul>` : ''}
                <a class="sinif-hub-join" href="#/katil">${ic('link')}<span>Bir sınıf oyununa katıl</span></a>
            </section>`;
            if (Date.now() - C.hubOpenAt > 15000) {
                C.hubOpenAt = Date.now();
                API.oturumlarim().then(r => {
                    const list = r.ok && r.data && Array.isArray(r.data.oturumlar) ? r.data.oturumlar : [];
                    const changed = JSON.stringify(list) !== JSON.stringify(C.hubOpen || []);
                    C.hubOpen = list;
                    if (changed) renderHubCard(document.getElementById('olSinifSlot'));
                });
            }
        } else {
            html = `<section class="sinif-hub sinif-hub-guest card" aria-labelledby="sinifHubT">
                <div class="sinif-hub-main">
                    <span class="sinif-hub-icon" aria-hidden="true">${ic('school')}</span>
                    <span class="sinif-hub-text"><h2 class="sinif-hub-title" id="sinifHubT">Derste misin?</h2><span class="sinif-hub-sub">Öğretmenin verdiği kodla, hesap açmadan takma adla katıl.</span></span>
                    <a class="btn btn-primary" href="#/katil">${ic('link')}<span>Sınıf oyununa katıl</span></a>
                </div>
            </section>`;
        }
        slot.hidden = false;
        setHTML(slot, html);
        if (!slot._snBound) {
            slot._snBound = true;
            slot.addEventListener('click', (e) => { const b = e.target.closest('[data-sn-hub]'); if (b && b.dataset.snHub === 'setup') openSetup(); });
        }
    }

    // ------------------------------------------------------------ oturum kurma sayfası
    function loadSettings() {
        const d = { vaka_sayisi: 5, kurs: '', kategori: '', ipucu_araligi_sn: 15, tahmin_hakki: 3, gec_katilim: true, tek_hak: false, kategori_gizli: false };
        try { return Object.assign(d, JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')); } catch (e) { return d; }
    }
    // ---- zorluk (0007, ajan Z1): sunucu destekliyorsa (game_config çarpan anahtarı) kurulumda iki anahtar
    const Zm = () => global.PsikoVakaZorluk;
    const zorOk = () => !!(Zm() && NS.leaguesView && NS.leaguesView.zorlukSupported());
    const zorOfA = (a) => ({ tekHak: !!(a && a.tek_hak), kategoriGizli: !!(a && a.kategori_gizli) });
    function matching(s) { return cases().filter(c => (!s.kurs || c.course === s.kurs) && (!s.kategori || c.category === s.kategori)); }
    function setupForm(s) {
        const courses = typeof COURSE_CATEGORIES !== 'undefined' ? Object.values(COURSE_CATEGORIES).filter(c => c.id !== 'ALL') : [];
        const all = cases();
        const byCourse = all.filter(c => !s.kurs || c.course === s.kurs);
        const cats = Array.from(new Set(byCourse.map(c => c.category))).filter(Boolean).sort((a, b) => catName(a).localeCompare(catName(b), 'tr'));
        if (s.kategori && !cats.includes(s.kategori)) s.kategori = '';
        const n = matching(s).length;
        const chips = (name, vals, cur, label) => `<div class="ol-chips" role="radiogroup" aria-label="${esc(label)}">${vals.map(v =>
            `<label class="ol-chip${String(v) === String(cur) ? ' is-checked' : ''}"><input type="radio" name="${name}" value="${v}" ${String(v) === String(cur) ? 'checked' : ''}><span>${v}</span></label>`).join('')}</div>`;
        const mins = Math.round(s.vaka_sayisi * (6 * s.ipucu_araligi_sn + 45) / 60);
        return `
            <fieldset class="ol-field"><legend class="ol-legend">Vaka sayısı</legend>
                ${chips('vaka_sayisi', [3, 5, 7, 10, 15], s.vaka_sayisi, 'Vaka sayısı')}
                <p class="ol-field-note">Her tur bir vaka. Tahmini süre: yaklaşık ${mins} dakika.</p></fieldset>
            <div class="sinif-setup-row">
                <label class="sinif-field"><span class="ol-legend">Ders (isteğe bağlı)</span>
                    <select class="form-input" name="kurs"><option value="">Bütün dersler</option>${courses.map(c => `<option value="${esc(c.id)}" ${s.kurs === c.id ? 'selected' : ''}>${esc(c.name)} (${all.filter(x => x.course === c.id).length})</option>`).join('')}</select>
                    <span class="ol-field-note">Yalnızca bu dersin vakaları sorulur.</span></label>
                <label class="sinif-field"><span class="ol-legend">Tanı grubu (isteğe bağlı)</span>
                    <select class="form-input" name="kategori"><option value="">Bütün gruplar</option>${cats.map(k => `<option value="${esc(k)}" ${s.kategori === k ? 'selected' : ''}>${esc(catName(k))} (${byCourse.filter(x => x.category === k).length})</option>`).join('')}</select>
                    <span class="ol-field-note">Örneğin yalnızca kişilik bozuklukları.</span></label>
            </div>
            <p class="sinif-setup-count${n < s.vaka_sayisi ? ' is-bad' : ''}" data-sn-count>${n < s.vaka_sayisi ? `Bu süzgece uyan ${n} vaka var; vaka sayısını azalt ya da süzgeci kaldır.` : `Uygun vaka: ${n}`}</p>
            <fieldset class="ol-field"><legend class="ol-legend" id="snIntL">İpucu aralığı: <output name="araOut" for="snInt">${s.ipucu_araligi_sn} sn</output></legend>
                <input class="sinif-range" type="range" id="snInt" name="ipucu_araligi_sn" min="8" max="60" step="1" value="${s.ipucu_araligi_sn}" aria-labelledby="snIntL">
                <p class="ol-field-note">İpuçları projeksiyonda bu aralıkla kendiliğinden açılır (8–60 sn).</p></fieldset>
            <fieldset class="ol-field${zorOk() && s.tek_hak ? ' is-locked' : ''}" data-sn-hak><legend class="ol-legend">Tahmin hakkı</legend>
                ${zorOk() && s.tek_hak ? chips('tahmin_hakki', [1, 2, 3, 4, 5, 6], 1, 'Tahmin hakkı').replace(/<input /g, '<input disabled ') : chips('tahmin_hakki', [1, 2, 3, 4, 5, 6], s.tahmin_hakki, 'Tahmin hakkı')}
                <p class="ol-field-note">${zorOk() && s.tek_hak ? 'Tek tahmin hakkı açık: her öğrencinin vaka başına 1 tahmini var.' : 'Bir öğrencinin bir vakada yapabileceği en fazla tahmin.'}</p></fieldset>
            ${zorOk() ? `<div data-sn-zorluk>${Zm().switches({ tekHak: s.tek_hak, kategoriGizli: s.kategori_gizli }, { id: 'snZor', title: 'Zorluk', desc: { tekHak: 'Her öğrencinin vaka başına tek tahmini var; yanlışsa o tur onun için biter. İpuçları yine kendiliğinden açılır.', kategoriGizli: 'Tur boyunca tanı grubu gösterilmez; telefonlarda yanlış tahmin yalnızca "yanlış" der (aynı grup bilgisi yok).' }, note: 'Tek hak açıkken tahmin hakkı 1 olur. Kategori gizliyken telefonlarda "aynı grup" bilgisi ve projeksiyonda tur boyunca tanı grubu gösterilmez. Puanlama değişmez.' })}</div>` : ''}
            <label class="ol-switch-row"><span class="ol-switch-text"><span class="ol-opt-title">Geç katılım</span><span class="ol-opt-sub">Başladıktan sonra gelenler bir sonraki turdan katılır.</span></span>
                <input type="checkbox" class="ol-switch-input" name="gec_katilim" ${s.gec_katilim ? 'checked' : ''}><span class="switch" aria-hidden="true"><span class="switch-knob"></span></span></label>`;
    }
    function readSetup(rootEl, s) {
        const v = (n) => { const x = rootEl.querySelector(`input[name="${n}"]:checked`); return x ? x.value : null; };
        const out = Object.assign({}, s);
        if (v('vaka_sayisi')) out.vaka_sayisi = parseInt(v('vaka_sayisi'), 10);
        if (v('tahmin_hakki')) out.tahmin_hakki = parseInt(v('tahmin_hakki'), 10);
        const r = rootEl.querySelector('input[name="ipucu_araligi_sn"]'); if (r) out.ipucu_araligi_sn = Math.max(8, Math.min(60, parseInt(r.value, 10) || 15));
        const k = rootEl.querySelector('select[name="kurs"]'); if (k) out.kurs = k.value;
        const g = rootEl.querySelector('select[name="kategori"]'); if (g) out.kategori = g.value;
        const l = rootEl.querySelector('input[name="gec_katilim"]'); if (l) out.gec_katilim = l.checked;
        const zr = rootEl.querySelector('[data-sn-zorluk]');
        if (zr && Zm()) { const z = Zm().read(zr); out.tek_hak = z.tekHak; out.kategori_gizli = z.kategoriGizli; }
        else { out.tek_hak = false; out.kategori_gizli = false; }
        return out;
    }
    function openSetup() {
        if (!signedIn()) { toast('Oturum kurmak için giriş yap.'); return null; }
        let s = loadSettings();
        const sh = NS.ui.sheet({
            title: 'Sınıf oturumu kur', wide: true, className: 'sinif-setup-sheet',
            body: `<form class="ol-form sinif-setup" data-sn-setup novalidate>${setupForm(s)}</form><p class="ol-form-error" data-sn-err role="alert"></p>`,
            actions: [{ id: 'start', label: 'Oturumu başlat', kind: 'primary', icon: 'play' }],
            async onAction(id, shx) {
                if (id !== 'start') return;
                s = readSetup(shx.body, s);
                const errEl = shx.body.querySelector('[data-sn-err]');
                if (matching(s).length < s.vaka_sayisi) { errEl.textContent = API.MSG.NOT_ENOUGH_CASES; return; }
                shx.setBusy('start', true);
                const zz = zorOk() ? { tek_hak: !!s.tek_hak, kategori_gizli: !!s.kategori_gizli } : {};
                const r = await API.olustur(Object.assign({ vaka_sayisi: s.vaka_sayisi, hedef: 'diagnosis', kurslar: s.kurs ? [s.kurs] : null, kategoriler: s.kategori ? [s.kategori] : null,
                    ipucu_araligi_sn: s.ipucu_araligi_sn, tahmin_hakki: zz.tek_hak ? 1 : s.tahmin_hakki, gec_katilim: s.gec_katilim }, zz));
                shx.setBusy('start', false);
                if (!r.ok) { errEl.textContent = r.error.message; return; }
                try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch (e) { /* yok */ }
                C.hubOpenAt = 0;
                shx.close(true);
                location.hash = '#/sinif/' + r.data.oturum_id;
            }
        });
        const rerender = (focusName) => {
            const form = sh.body.querySelector('[data-sn-setup]');
            const y = sh.body.scrollTop;
            form.innerHTML = setupForm(s);
            sh.body.scrollTop = y;
            const again = focusName && form.querySelector(`[name="${focusName}"]`);
            if (again) try { again.focus({ preventScroll: true }); } catch (e) { /* yok */ }
        };
        if (Zm()) Zm().bind(sh.body, () => { s = readSetup(sh.body, s); rerender(null); });
        if (NS.leaguesView && !zorOk() && NS.leaguesView.loadConfig) Promise.resolve(NS.leaguesView.loadConfig()).then(() => { if (!sh.closed && zorOk() && !sh.body.querySelector('[data-sn-zorluk]')) { s = readSetup(sh.body, s); rerender(null); } });
        sh.body.addEventListener('change', (e) => {
            s = readSetup(sh.body, s);
            sh.body.querySelector('[data-sn-err]').textContent = '';
            if (['kurs', 'kategori', 'vaka_sayisi'].includes(e.target.name)) rerender(e.target.name === 'vaka_sayisi' ? null : e.target.name);
            else NS.ui.syncChecked(sh.body);
            if (e.target.name === 'vaka_sayisi') { const x = sh.body.querySelector(`input[name="vaka_sayisi"][value="${s.vaka_sayisi}"]`); if (x) x.focus({ preventScroll: true }); }
        });
        sh.body.addEventListener('input', (e) => {
            if (e.target.name !== 'ipucu_araligi_sn') return;
            const out = sh.body.querySelector('output[name="araOut"]');
            if (out) out.textContent = `${e.target.value} sn`;
        });
        return sh;
    }

    // ------------------------------------------------------------ yönlendirme
    function parseHash() {
        const h = location.hash || '';
        let m = /^#\/katil(?:\/([A-Za-z0-9]{1,8}))?\/?$/.exec(h);
        if (m) return { kind: 'join', kod: m[1] ? m[1].toUpperCase() : '' };
        m = /^#\/sinif\/([0-9a-fA-F-]{36})\/?$/.exec(h);
        if (m && UUID_RE.test(m[1])) return { kind: 'session', id: m[1].toLowerCase() };
        if (/^#\/(katil|sinif)\b/.test(h)) return { kind: 'join', kod: '' };
        return null;
    }
    async function handleRoute() {
        const r = parseHash();
        if (!r) { if (C.layer && !C.layer.hidden) closeAll(); return; }
        injectSprite();
        if (isFile()) {
            stopSession();
            simpleView('file', msgBox(noro(myCfg(), 120, { emote: 'think' }), 'Sınıf modu bu sürümde kapalı', 'Tek dosyalık sürüm sunucuya bağlanamaz. Siteyi tarayıcıdan aç: gandalfthegreey.github.io/psikovaka', homeBtn('btn-primary')));
            return;
        }
        const a = acc();
        if (!a || a.availability === 'pending' || (API.supported == null && a.availability === 'ready' && !C.probed)) {
            if (!C.frame) simpleView('loading', `${topBar()}<div class="sinif-msg"><span class="ol-spinner" aria-hidden="true"></span><p class="sinif-msg-text">Bağlanıyor…</p></div>`);
            if (a && a.availability === 'ready') { C.probed = true; await API.probe(); handleRoute(); }
            return;
        }
        if (a.availability !== 'ready' || !(await API.probe())) {
            stopSession();
            simpleView('unsupported', msgBox(noro(myCfg(), 120, { emote: 'think' }), 'Sınıf modu şu an kullanılamıyor', a.availability !== 'ready' ? 'Sunucuya ulaşılamıyor. Bağlantını kontrol edip sayfayı yenile.' : 'Bu özellik sunucuda henüz açık değil.', homeBtn('btn-primary')));
            return;
        }
        if (r.kind === 'join') { stopSession(); renderJoin(r.kod); return; }
        if (C.id !== r.id || !C.d) startSession(r.id);
    }
    function closeAll() {
        stopSession();
        showLayer(false);
        if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
    }
    function goHome(route) {
        closeAll();
        const target = route || (signedIn() ? 'online' : 'oyna');
        try { history.replaceState(null, '', location.pathname + location.search + '#/' + target); } catch (e) { /* yok */ }
        const g = game();
        if (g && g.showRoute) g.showRoute(target);
    }

    // ------------------------------------------------------------ katılma formu
    function lastSession() { try { return JSON.parse(localStorage.getItem(LAST_KEY) || 'null'); } catch (e) { return null; } }
    function saveLast(o) { try { if (o) localStorage.setItem(LAST_KEY, JSON.stringify(o)); else localStorage.removeItem(LAST_KEY); } catch (e) { /* yok */ } }
    function nameProblem(v) {
        const t = String(v || '').trim().replace(/\s+/g, ' ');
        if (t.length < 2 || t.length > 16 || !NAME_RE.test(t)) return API.MSG.TAKMA_AD_GECERSIZ;
        const F = global.PsikoVakaIsimFiltresi;
        if (F && F.check && !F.check(t).ok) return API.MSG.TAKMA_AD_UYGUNSUZ;
        return null;
    }
    async function renderJoin(kod) {
        const last = lastSession();
        // QR'ı yeniden okutan / sayfayı yenileyen öğrenci: aynı koddaki açık oturumuna doğrudan dön
        if (last && last.id && (!kod || kod === last.kod) && !C.joinChecked) {
            C.joinChecked = true;
            const r = await API.durum(last.id);
            if (r.ok && r.data.rol === 'katilimci' && !['bitti', 'iptal'].includes(r.data.oturum.durum)) { location.replace('#/sinif/' + last.id); return; }
        }
        C.joinChecked = false;
        const s = snap();
        const defName = (s && s.state === 'ready' && s.profile && s.profile.username) ? s.profile.username.slice(0, 16) : ((last && last.ad) || '');
        simpleView('join', `${topBar()}
            <form class="sinif-join" data-sn-join novalidate>
                <div class="sinif-join-fig" aria-hidden="true" data-sn-joinfig>${noro(s && s.state === 'ready' && s.profile ? s.profile.avatar : noroCfg({ takma_ad: defName || 'misafir' }), 112, { emote: 'wave' })}</div>
                <h1 class="sinif-h1">Sınıf oyununa katıl</h1>
                <p class="sinif-msg-text">Hesap gerekmez. Takma adın yalnızca bu oturumda görünür.</p>
                <label class="sinif-field" for="snCode"><span class="sinif-label">Oturum kodu</span>
                    <input class="form-input sinif-code-input" id="snCode" name="kod" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="6" placeholder="ABC234" value="${esc(kod || '')}" aria-describedby="snCodeErr" ${kod ? '' : 'data-autofocus'}>
                    <span class="ol-form-error" id="snCodeErr" role="alert"></span></label>
                <label class="sinif-field" for="snName"><span class="sinif-label">Takma ad</span>
                    <input class="form-input" id="snName" name="ad" autocomplete="nickname" maxlength="16" placeholder="Örneğin Ada" value="${esc(defName)}" aria-describedby="snNameErr snNameHint" ${kod ? 'data-autofocus' : ''}>
                    <span class="ol-field-note" id="snNameHint">2–16 karakter. Projeksiyonda herkes görür.</span>
                    <span class="ol-form-error" id="snNameErr" role="alert"></span></label>
                <button class="btn btn-primary btn-lg sinif-join-btn" type="submit">${ic('arrow-right')}<span>Katıl</span></button>
            </form>`);
    }
    async function submitJoin(form) {
        const codeEl = form.querySelector('#snCode'), nameEl = form.querySelector('#snName');
        const codeErr = form.querySelector('#snCodeErr'), nameErr = form.querySelector('#snNameErr');
        codeErr.textContent = ''; nameErr.textContent = '';
        const kod = (codeEl.value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
        const ad = (nameEl.value || '').trim().replace(/\s+/g, ' ');
        if (kod.length !== 6) { codeErr.textContent = 'Kod 6 karakter olmalı.'; codeEl.focus(); return; }
        const np = nameProblem(ad);
        if (np) { nameErr.textContent = np; nameEl.focus(); return; }
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true; btn.classList.add('is-loading');
        const done = () => { btn.disabled = false; btn.classList.remove('is-loading'); };
        const ses = await API.ensureSession();
        if (!ses.ok) { done(); codeErr.textContent = ses.error.message; return; }
        const r = await API.katil(kod, ad);
        done();
        if (!r.ok) {
            const c = r.error.code;
            if (/^TAKMA_AD/.test(c)) { nameErr.textContent = r.error.message; nameEl.focus(); }
            else { codeErr.textContent = r.error.message; codeEl.focus(); }
            return;
        }
        saveLast({ id: r.data.oturum_id, kod, ad: r.data.takma_ad });
        if (r.data.yeniden) toast('Kaldığın yerden devam ediyorsun.');
        location.hash = '#/sinif/' + r.data.oturum_id;
    }

    // ------------------------------------------------------------ oturum senkronu
    function startSession(id) {
        stopSession();
        C.id = id; C.d = null; C.mode = null; C.surum = null; C.lastClue = -1; C.closeReqAt = 0;
        C.solved = new Map(); C.solvedTur = 0; C.offline = false; C.feedback = null; C.showExplain = false; C.gone = null;
        if (!C.frame || C.frame === 'simple') simpleView('loading', `${topBar()}<div class="sinif-msg"><span class="ol-spinner" aria-hidden="true"></span><p class="sinif-msg-text">Oturuma bağlanılıyor…</p></div>`);
        refresh();
        C.tickT = setInterval(tick, 200);
        schedulePoll();
    }
    function stopSession() {
        clearInterval(C.tickT); C.tickT = null;
        clearTimeout(C.pollT); C.pollT = null;
        clearTimeout(C.refreshDeb); C.refreshDeb = null;
        if (C.sub) { try { C.sub.leave(); } catch (e) { /* yok */ } }
        C.sub = null; C.live = false;
        C.id = null; C.d = null; C.mode = null;
    }
    function schedulePoll() {
        clearTimeout(C.pollT);
        if (!C.id) return;
        const base = C.mode === 'host' && C.live ? 8000 : 3000;
        C.pollT = setTimeout(poll, base - 500 + Math.random() * 1000);
    }
    async function poll() {
        const id = C.id;
        if (!id) return;
        if (document.hidden && C.mode !== 'host') { schedulePoll(); return; }
        const r = await API.ozet(id);
        if (C.id !== id) return;
        if (!r.ok) { onError(r.error, true); schedulePoll(); return; }
        setOffline(false);
        const o = r.data;
        const d = C.d;
        if (d && C.mode === 'player' && o.surum === C.surum && o.katilimci_sayisi !== d.oturum.katilimci_sayisi) { d.oturum.katilimci_sayisi = o.katilimci_sayisi; render(true); }
        const stale = !d || o.surum !== C.surum || (C.mode === 'host' && (o.katilimci_sayisi !== d.oturum.katilimci_sayisi || (!C.live && d.oturum.durum === 'tur')));
        if (stale) await refresh();
        schedulePoll();
    }
    function refreshSoon(ms) { clearTimeout(C.refreshDeb); C.refreshDeb = setTimeout(() => refresh(), ms); }
    async function refresh() {
        const id = C.id;
        if (!id) return;
        if (C.loading) { C.again = true; return; }
        C.loading = true;
        const r = await API.durum(id);
        C.loading = false;
        if (C.id !== id) return;
        if (!r.ok) onError(r.error, false);
        else { setOffline(false); apply(r.data); }
        if (C.again) { C.again = false; refresh(); }
    }
    function setOffline(on) {
        if (C.offline === on) return;
        C.offline = on;
        const el = C.layer && C.layer.querySelector('[data-sn-offline]');
        if (el) el.hidden = !on;
        if (on) announce('Bağlantı koptu. Yeniden bağlanılıyor.');
        else if (C.d) { announce('Bağlantı geri geldi.'); refreshSoon(50); }
    }
    function onError(e, fromPoll) {
        const code = e && e.code;
        if (code === 'ATILDIN') { gone('kicked'); return; }
        if (code === 'SINIF_YOK' || code === 'NOT_AUTHENTICATED' || code === 'NO_CLIENT') {
            if (C.d && C.d.oturum && ['bitti', 'iptal'].includes(C.d.oturum.durum)) return;
            const s = snap();
            if (!s || (!s.user && !s.anonymous)) { const last = lastSession(); stopSession(); location.replace('#/katil' + (last && last.id === C.id && last.kod ? '/' + last.kod : '')); return; }
            gone('notfound');
            return;
        }
        if (code === 'UNSUPPORTED') { gone('unsupported'); return; }
        // ağ hatası: yerel saatle devam, bağlantı uyarısı
        setOffline(true);
        if (!C.d) {
            simpleView('offline', msgBox(noro(myCfg(), 112, { emote: 'think' }), 'Bağlantı kurulamadı', 'İnternet bağlantını kontrol et. Yeniden deneniyor…', `<button class="btn btn-primary btn-lg" type="button" data-sn="retry">${ic('refresh')}<span>Tekrar dene</span></button>${homeBtn()}`));
        }
        void fromPoll;
    }
    function gone(kind) {
        const anon = !!(snap() || {}).anonymous;
        const kod = C.d && C.d.oturum ? C.d.oturum.kod : (lastSession() || {}).kod;
        stopSession();
        if (kind === 'kicked') saveLast(null);
        C.gone = kind;
        const fig = noro(myCfg(), 120, { emote: kind === 'left' ? 'wave' : 'sad' });
        if (kind === 'kicked') simpleView('kicked', msgBox(fig, 'Oturumdan çıkarıldın', API.MSG.ATILDIN, homeBtn('btn-primary')));
        else if (kind === 'left') simpleView('left', msgBox(fig, 'Oturumdan ayrıldın', 'Puanın saklanıyor; aynı kodla yeniden katılabilirsin.',
            `${kod ? `<a class="btn btn-primary btn-lg" href="#/katil/${esc(kod)}">${ic('refresh')}<span>Yeniden katıl</span></a>` : ''}${anon ? signupBtn().replace('btn-primary', 'btn-secondary') : ''}${homeBtn()}`));
        else if (kind === 'unsupported') simpleView('unsupported', msgBox(fig, 'Sınıf modu şu an kullanılamıyor', 'Bu özellik sunucuda henüz açık değil.', homeBtn('btn-primary')));
        else simpleView('notfound', msgBox(fig, 'Oturum bulunamadı', 'Bu oturum kapanmış olabilir. Kodu öğretmenine sor.', `<a class="btn btn-primary btn-lg" href="#/katil">${ic('link')}<span>Koda katıl</span></a>${homeBtn()}`));
    }
    function subscribe() {
        if (C.sub || !C.d) return;
        const host = C.mode === 'host';
        // §15.6: öğrenciler yalnızca kalabalık değilse (≤ 40 aktif) oturum satırına abone olur; aksi hâlde yalnızca yoklama
        if (!host && C.d.oturum.katilimci_sayisi > 40) return;
        const id = C.id;
        C.sub = API.subscribe(id, { host }, {
            onChange: (table, p) => { if (C.id === id) onChange(table, p); },
            onStatus: (st) => { if (C.id !== id) return; C.live = st === 'live'; schedulePoll(); },
            onResync: () => { if (C.id === id) refresh(); }
        });
    }
    function onChange(table, p) {
        const row = p && p.new;
        if (table === 'sinif_oturumlari') { if (!row || row.surum !== C.surum) refresh(); return; }
        if (table === 'sinif_katilimcilar') { refreshSoon(350); return; }
        if (table === 'sinif_tur_sonuclari' && row && C.d && row.tur_no === C.d.oturum.tur_no) {
            C.solved.set(row.katilimci_id, row);
            renderHostLive();
        }
    }
    function apply(d) {
        const prev = C.d;
        C.d = d;
        C.surum = d.oturum.surum;
        C.mode = d.rol === 'sunucu' ? 'host' : 'player';
        const durum = d.oturum.durum;
        if (C.mode === 'player') {
            if (d.ben) saveLast({ id: d.oturum.id, kod: d.oturum.kod, ad: d.ben.takma_ad });
            if (!prev || prev.oturum.tur_no !== d.oturum.tur_no || (prev.oturum.durum !== 'tur' && durum === 'tur')) C.feedback = null;
        } else {
            if (d.oturum.tur_no !== C.solvedTur) { C.solved = new Map(); C.solvedTur = d.oturum.tur_no; if (durum === 'tur') loadSolved(); }
            if (!prev || prev.oturum.durum !== durum) C.showExplain = false;
            if (durum === 'lobi' || durum === 'bitti') loadAvatars();
        }
        subscribe();
        render();
    }
    async function loadSolved() {
        const id = C.id, tur = C.d.oturum.tur_no;
        const r = await API.turSonuclari(id, tur);
        if (C.id !== id || !r.ok || !C.d || C.d.oturum.tur_no !== tur) return;
        r.data.forEach(row => { if (row.tur_no === tur) C.solved.set(row.katilimci_id, row); });
        renderHostLive();
    }
    async function loadAvatars() {
        if (Date.now() - C.avatarAskedAt < 2500 || !C.d) return;
        const need = C.d.katilimcilar.filter(p => !C.avatarAsked.has(p.katilimci_id));
        if (!need.length) return;
        C.avatarAskedAt = Date.now();
        const id = C.id;
        const r = await API.katilimciKullanicilari(id);
        if (!r.ok || C.id !== id) return;
        need.forEach(p => C.avatarAsked.add(p.katilimci_id));
        const byUser = new Map(r.data.filter(x => x.user_id).map(x => [x.user_id, x.id]));
        if (!byUser.size) return;
        const pr = await API.profilAvatarlari(Array.from(byUser.keys()));
        if (!pr.ok || C.id !== id) return;
        let any = false;
        pr.data.forEach(row => { const kid = byUser.get(row.id); if (kid && row.avatar && Object.keys(row.avatar).length) { C.avatars.set(kid, row.avatar); any = true; } });
        if (any) render(true);
    }

    function tick() {
        if (!C.d || !C.id) return;
        const t = tl();
        if (t) {
            if (t.k !== C.lastClue) { const was = C.lastClue; C.lastClue = t.k; render(true); if (C.mode === 'player' && t.k > 0 && was >= 0 && t.k > was) announceClue(t.k); }
            updateTimers(t);
            // tur süresi doldu: sunucu ilk çağrıda kapatır (§15.1 a)
            const late = C.mode === 'host' ? 300 : 600 + Math.random() * 900;
            if (t.now >= t.end + late && Date.now() - C.closeReqAt > (C.mode === 'host' ? 1500 : 2500)) { C.closeReqAt = Date.now(); refresh(); }
        } else if (C.lastClue !== -1 && C.d.oturum.durum !== 'tur') { C.lastClue = -1; }
    }
    function announceClue(k) {
        const c = findCase(C.d.tur && C.d.tur.case_id);
        if (!c) return;
        announce(`${k}. ipucu açıldı. ${CLUE_LABELS[k - 1]}: ${c.clues[k - 1] || ''}`);
    }
    function updateTimers(t) {
        const r = C.layer;
        if (!r) return;
        r.querySelectorAll('[data-sn-bar]').forEach(el => { const v = Math.round(t.frac * 1000); if (el.value !== v) el.value = v; });
        r.querySelectorAll('[data-sn-left]').forEach(el => {
            const txt = t.k === 0 ? String(Math.max(1, Math.ceil(t.left))) : t.k < 6 ? `Sonraki ipucu ${fmtSec(t.left)}` : `Süre ${fmtSec(t.left)}`;
            if (el.textContent !== txt) el.textContent = txt;
        });
    }

    // ------------------------------------------------------------ çizim
    function render(soft) {
        const d = C.d;
        if (!d) return;
        if (C.mode === 'host') renderProj(soft); else renderPhone(soft);
    }
    function ensureFrame(kind) {
        if (C.frame === kind) return;
        showLayer(true, kind);
        C.frame = kind;
        const r = root();
        r.className = 'sinif-root sinif-' + kind;
        if (kind === 'proj') {
            r.innerHTML = `<header class="sp-head" data-sn-head></header>
                <div class="sinif-offline" data-sn-offline role="status" ${C.offline ? '' : 'hidden'}>${ic('refresh')}<span>Bağlantı koptu. Yeniden bağlanılıyor…</span></div>
                <main class="sp-main" data-sn-main></main>`;
        } else {
            r.innerHTML = `<header class="st-head" data-sn-head></header>
                <div class="sinif-offline" data-sn-offline role="status" ${C.offline ? '' : 'hidden'}>${ic('refresh')}<span>Bağlantı koptu. Yeniden bağlanılıyor…</span></div>
                <main class="st-main" data-sn-main></main>
                <div class="st-dock" data-sn-dock hidden></div>`;
        }
    }

    // ---------- projeksiyon (sunucu)
    function hostControls(d) {
        const du = d.oturum.durum;
        const last = d.oturum.tur_no >= d.oturum.vaka_sayisi;
        const fs = !!document.fullscreenElement;
        const btn = (act, label, iconName, kind, extra) => `<button class="btn ${kind} sp-ctl" type="button" data-sn="${act}" ${extra || ''}>${ic(iconName)}<span>${label}</span></button>`;
        let main = '';
        if (du === 'lobi') main = btn('start', 'Başlat', 'play', 'btn-primary', d.katilimcilar.some(p => !p.ayrildi) ? '' : 'disabled');
        else if (du === 'tur') main = btn('endround', 'Turu bitir', 'stop', 'btn-secondary');
        else if (du === 'cevap') main = btn('next', 'Sonraki', 'next', 'btn-primary');
        else if (du === 'skor') main = btn('next', last ? 'Sonuçları göster' : 'Sonraki vaka', 'next', 'btn-primary');
        const end = ['lobi', 'tur', 'cevap', 'skor'].includes(du) ? btn('end', 'Oturumu bitir', 'x', 'btn-ghost') : btn('home', 'Online\'a dön', 'arrow-left', 'btn-secondary');
        const fsb = `<button class="btn btn-ghost sp-ctl" type="button" data-sn="fullscreen" aria-pressed="${fs}">${ic(fs ? 'minimize' : 'maximize')}<span>${fs ? 'Tam ekrandan çık' : 'Tam ekran'}</span></button>`;
        return `${fsb}${end}${main}`;
    }
    function renderProj(soft) {
        const d = C.d;
        ensureFrame('proj');
        const r = root();
        const du = d.oturum.durum;
        const k = clueIndex();
        const head = r.querySelector('[data-sn-head]');
        const tur = d.oturum.tur_no;
        const left = du === 'lobi' ? `<span class="sp-title">Sınıf oyunu</span>`
            : ['bitti', 'iptal'].includes(du) ? `<span class="sp-title">${du === 'iptal' ? 'Oturum iptal edildi' : 'Oyun bitti'}</span>`
            : `<span class="sp-title">Tur ${tur}<span class="sp-dim"> / ${d.oturum.vaka_sayisi}</span></span>${Zm() ? Zm().badge(zorOfA(d.oturum.ayarlar)) : ''}`;
        const codeChip = ['lobi', 'bitti', 'iptal'].includes(du) || !d.oturum.ayarlar.gec_katilim ? '' : `<span class="sp-codechip" title="Geç katılım">${esc(shortUrl())} · <b>${esc(d.oturum.kod)}</b></span>`;
        setHTML(head, `<div class="sp-head-l"><button class="icon-btn" type="button" data-sn="home" aria-label="Projeksiyondan çık (oturum sürer)">${ic('arrow-left')}</button>
            <span class="sp-brand">${ic('school')}</span>${left}${codeChip}</div><div class="sp-head-r">${hostControls(d)}</div>`);
        const main = r.querySelector('[data-sn-main]');
        if (du === 'lobi' && main.dataset.view === 'lobi' && patchLobby(main, d)) return;
        let html = '';
        if (du === 'lobi') html = projLobby(d);
        else if (du === 'tur') html = k === 0 ? projCountdown(d) : projRound(d, k);
        else if (du === 'cevap') html = projAnswer(d);
        else if (du === 'skor') html = projRanking(d);
        else if (du === 'bitti') html = projPodium(d);
        else html = `<div class="sp-center"><div class="sp-fig">${noro(myCfg(), 200, { emote: 'wave' })}</div><h1 class="sp-h1">Oturum iptal edildi</h1><p class="sp-sub">Oyun başlamadan kapatıldı.</p></div>`;
        const changed = setHTML(main, html);
        if (changed) {
            main.dataset.view = du + (du === 'tur' ? (k === 0 ? '-0' : '') : '');
            const ul = main.querySelector('.sp-tiles');
            if (ul) { ul._anim = d.katilimcilar.filter(p => !p.ayrildi).length <= 30; Array.from(ul.children).forEach(li => { li.dataset.av = String(C.avatars.has(li.dataset.kid)); }); }
        }
        const t = tl(); if (t) updateTimers(t);
        renderHostLive();
        if (changed && !soft) { const h = main.querySelector('h1, .sp-h1'); void h; }
    }
    function lobbyTile(p, anim) {
        return `<li class="sp-tile" data-kid="${esc(p.katilimci_id)}"><button class="sp-tile-btn" type="button" data-sn-kick="${esc(p.katilimci_id)}" aria-label="${esc(p.takma_ad)}: oturumdan çıkar">
                <span class="sp-tile-fig" aria-hidden="true">${noro(noroCfg(p), 64, { animated: anim && !reduced(), emote: anim ? 'wave' : null })}</span><span class="sp-tile-name">${esc(p.takma_ad)}</span></button></li>`;
    }
    /** Lobide yeni gelen/ayrılan adlar: listeyi baştan çizmeden ekle/çıkar (her katılımda bütün adlar yeniden zıplamasın). */
    function patchLobby(main, d) {
        const ul = main.querySelector('.sp-tiles');
        const ps = d.katilimcilar.filter(p => !p.ayrildi);
        if (!ul || !ps.length) return false;
        const anim = ps.length <= 30;
        if (!!ul._anim !== anim) return false;
        const want = new Map(ps.map(p => [p.katilimci_id, p]));
        Array.from(ul.children).forEach(li => { const p = want.get(li.dataset.kid); if (!p || li.dataset.av !== String(C.avatars.has(p.katilimci_id))) li.remove(); });
        const have = new Set(Array.from(ul.children).map(li => li.dataset.kid));
        ps.forEach(p => { if (!have.has(p.katilimci_id)) { ul.insertAdjacentHTML('beforeend', lobbyTile(p, anim)); ul.lastElementChild.dataset.av = String(C.avatars.has(p.katilimci_id)); } });
        ul.classList.toggle('is-dense', ps.length > 40);
        const n = main.querySelector('.sp-count'); if (n && n.textContent !== String(ps.length)) n.textContent = String(ps.length);
        const startBtn = C.layer.querySelector('[data-sn="start"]'); if (startBtn) startBtn.disabled = !ps.length;
        main._sig = null;
        return true;
    }
    function projLobby(d) {
        const ps = d.katilimcilar.filter(p => !p.ayrildi);
        const qr = global.PsikoVakaQR ? global.PsikoVakaQR.svg(joinUrl(d.oturum.kod), { ecl: 'M', label: 'Katılım bağlantısının QR kodu', cls: 'sp-qr-svg' }) : '';
        const anim = ps.length <= 30;
        const a = d.oturum.ayarlar;
        const tiles = ps.map(p => lobbyTile(p, anim)).join('');
        return `<div class="sp-lobby">
            <section class="sp-join" aria-label="Nasıl katılınır">
                <div class="sp-join-steps">
                    <p class="sp-step"><span class="sp-step-n">1</span><span>Telefonundan aç:</span></p>
                    <p class="sp-url">${esc(shortUrl())}</p>
                    <p class="sp-step"><span class="sp-step-n">2</span><span>Kodu yaz:</span></p>
                    <p class="sp-code" aria-label="Oturum kodu ${esc(d.oturum.kod.split('').join(' '))}">${esc(d.oturum.kod)}</p>
                </div>
                <div class="sp-join-foot">
                    ${qr ? `<figure class="sp-qr">${qr}<figcaption>ya da telefonunun kamerasıyla QR kodu okut</figcaption></figure>` : ''}
                    <ul class="sp-settings" aria-label="Oturum ayarları"><li>${a.vaka_sayisi} vaka</li><li>İpucu ${a.ipucu_araligi_sn} sn'de bir</li><li>${a.tek_hak ? 'Tek tahmin hakkı' : `${a.tahmin_hakki} tahmin hakkı`}</li>${a.kategori_gizli ? '<li>Kategori gizli</li>' : ''}</ul>
                </div>
            </section>
            <section class="sp-people" aria-labelledby="spPeopleT">
                <h2 class="sp-people-title" id="spPeopleT"><span class="sp-count" aria-live="polite">${ps.length}</span> kişi katıldı</h2>
                ${ps.length ? `<ul class="sp-tiles${ps.length > 40 ? ' is-dense' : ''}">${tiles}</ul><p class="sp-hint">Bir adı çıkarmak için üzerine dokun.</p>`
                    : `<div class="sp-empty"><div class="sp-fig">${noro(myCfg(), 140, { emote: 'think' })}</div><p>Katılımcılar bekleniyor…</p></div>`}
            </section>
        </div>`;
    }
    function caseOf(d) { return d.tur ? findCase(d.tur.case_id) : null; }
    function projCountdown(d) {
        const c = caseOf(d);
        return `<div class="sp-center sp-countdown">
            <p class="sp-kicker">Tur ${d.oturum.tur_no} / ${d.oturum.vaka_sayisi}</p>
            <h1 class="sp-h1">Hazır ol</h1>
            <p class="sp-cd-num" data-sn-left aria-hidden="true">3</p>
            ${c ? '' : '<p class="sp-sub sinif-warn">Bu vaka bu sürümde yok. Sayfayı yenile.</p>'}
        </div>`;
    }
    function projRound(d, k) {
        const c = caseOf(d);
        if (!c) return `<div class="sp-center"><h1 class="sp-h1">Vaka bulunamadı</h1><p class="sp-sub">Sunucunun seçtiği vaka (${esc(d.tur.case_id)}) bu sürümde yok. Sayfayı yenile; olmazsa turu bitir.</p></div>`;
        const prev = [];
        for (let i = 0; i < k - 1; i++) prev.push(`<li class="sp-clue-old"><span class="sp-clue-n">${i + 1}</span><span class="sp-clue-old-t"><b>${esc(CLUE_LABELS[i])}</b> · ${esc(c.clues[i])}</span></li>`);
        const fut = [];
        for (let i = k; i < 6; i++) fut.push(`<li class="sp-clue-lock"><span class="sp-clue-n">${i + 1}</span>${ic('lock')}<span>${esc(CLUE_LABELS[i])}</span></li>`);
        return `<div class="sp-round">
            <section class="sp-case" aria-label="Vaka">
                <p class="sp-patient"><span class="sp-patient-l">Danışan</span>${esc(c.patientSummary)}</p>
                ${prev.length ? `<ol class="sp-clues-old" aria-label="Önceki ipuçları">${prev.join('')}</ol>` : ''}
                <article class="sp-clue-now ${c.clues[k - 1].length < 130 ? 'is-short' : c.clues[k - 1].length < 240 ? 'is-mid' : 'is-long'}" aria-live="off">
                    <p class="sp-clue-now-h"><span class="sp-clue-n is-now">${k}</span><span>${esc(CLUE_LABELS[k - 1])}</span></p>
                    <p class="sp-clue-now-t">${esc(c.clues[k - 1])}</p>
                </article>
                ${fut.length ? `<ol class="sp-clues-lock" aria-label="Kilitli ipuçları">${fut.join('')}</ol>` : ''}
            </section>
            <aside class="sp-side">
                <div class="sp-progress">
                    <p class="sp-clue-count"><span>İpucu</span> <b>${k}/6</b></p>
                    <progress class="sp-bar" data-sn-bar max="1000" value="0" aria-label="Sonraki ipucuna kalan süre"></progress>
                    <p class="sp-left" data-sn-left></p>
                </div>
                <div class="sp-live" data-sn-live></div>
            </aside>
        </div>`;
    }
    /** "12/30 bildi" sayacı: tur sonuçları satırlarından (Realtime/okuma), yoksa sinif_durum'dan. */
    function liveCounts(d) {
        const act = d.tur ? d.tur.aktif_sayisi : 0;
        let solved = 0, done = 0;
        C.solved.forEach(row => { if (row.cozdu) solved++; if (row.bitti) done++; });
        done = Math.max(done, d.tur ? d.tur.biten_sayisi || 0 : 0, d.katilimcilar.filter(p => p.bitti).length);
        return { act, solved, done };
    }
    function renderHostLive() {
        if (C.mode !== 'host' || !C.d || C.d.oturum.durum !== 'tur' || !C.layer) return;
        const el = C.layer.querySelector('[data-sn-live]');
        if (!el) return;
        const { act, solved, done } = liveCounts(C.d);
        const prevSolved = el._solved;
        setHTML(el, `<p class="sp-big"><span class="sp-big-n${prevSolved != null && solved > prevSolved && !reduced() ? ' is-bump' : ''}">${solved}</span><span class="sp-big-of">/${act}</span></p>
            <p class="sp-big-l">bildi</p>
            <progress class="sp-meter" max="${Math.max(1, act)}" value="${done}" aria-label="${done} / ${act} kişi bitirdi"></progress>
            <p class="sp-done">${done}/${act} bitirdi</p>`);
        el._solved = solved;
    }
    function projAnswer(d) {
        const c = caseOf(d);
        const ans = d.tur && d.tur.cevap ? diag(d.tur.cevap.diagnosis_id) : null;
        const ps = d.katilimcilar.filter(p => p.cozdu != null && p.katildigi_tur <= d.oturum.tur_no);
        const per = [0, 0, 0, 0, 0, 0];
        ps.forEach(p => { if (p.cozdu && p.ipucu_no >= 1 && p.ipucu_no <= 6) per[p.ipucu_no - 1]++; });
        const fail = ps.filter(p => !p.cozdu).length;
        const max = Math.max(1, ...per, fail);
        const bars = per.map((n, i) => `<li class="sp-bar-col"><span class="sp-bar-n">${n}</span><span class="sp-bar-v is-h${Math.round(n / max * 20)}"></span><span class="sp-bar-l">${i + 1}. ipucu</span></li>`).join('')
            + `<li class="sp-bar-col is-fail"><span class="sp-bar-n">${fail}</span><span class="sp-bar-v is-h${Math.round(fail / max * 20)}"></span><span class="sp-bar-l">Bilemedi</span></li>`;
        const fast = ps.filter(p => p.cozdu).sort((a, b) => (b.tur_puan || 0) - (a.tur_puan || 0)).slice(0, 5);
        const hasEx = !!(c && global.PsikoVakaExplain && global.PsikoVakaExplain.has && global.PsikoVakaExplain.has(c));
        const solved = d.tur.cozen_sayisi != null ? d.tur.cozen_sayisi : ps.filter(p => p.cozdu).length;
        if (C.showExplain && hasEx) {
            return `<div class="sp-explain">
                <div class="sp-explain-head"><h1 class="sp-h2">${esc(ans ? ans.nameTr : '')}</h1><button class="btn btn-secondary sp-ctl" type="button" data-sn="explain" aria-pressed="true">${ic('x')}<span>Açıklamayı kapat</span></button></div>
                <div class="sp-explain-body">${global.PsikoVakaExplain.render(c, { idPrefix: 'sp' })}</div>
            </div>`;
        }
        return `<div class="sp-answer">
            <section class="sp-ans-main">
                <p class="sp-kicker">Cevap</p>
                <h1 class="sp-ans-name">${esc(ans ? ans.nameTr : (d.tur.cevap ? d.tur.cevap.diagnosis_id : ''))}</h1>
                ${ans ? `<p class="sp-ans-en">${esc(ans.nameEn)} · ${esc(catName(ans.category))}</p>` : ''}
                <p class="sp-ans-stat"><b>${solved}</b> / ${ps.length} kişi bildi</p>
                ${hasEx ? `<button class="btn btn-secondary btn-lg" type="button" data-sn="explain" aria-pressed="false">${ic('book')}<span>Açıklamayı göster</span></button>` : ''}
            </section>
            <section class="sp-chart" aria-labelledby="spChartT">
                <h2 class="sp-h3" id="spChartT">Kaçıncı ipucunda bildiler?</h2>
                <ol class="sp-bars${reduced() ? '' : ' is-anim'}">${bars}</ol>
            </section>
            <section class="sp-fast" aria-labelledby="spFastT">
                <h2 class="sp-h3" id="spFastT">En hızlı ${fast.length || ''}</h2>
                ${fast.length ? `<ol class="sp-fast-list">${fast.map((p, i) => `<li class="sp-fast-row"><span class="sp-rank">${i + 1}</span><span class="sp-fast-fig" aria-hidden="true">${noro(noroCfg(p), 52, { animated: false })}</span><span class="sp-fast-name">${esc(p.takma_ad)}</span><span class="sp-fast-pts">+${p.tur_puan}</span></li>`).join('')}</ol>`
                    : '<p class="sp-sub">Bu vakayı kimse bilemedi.</p>'}
            </section>
        </div>`;
    }
    /** Sıralama + bir önceki turdan bu yana hareket (önceki puan = puan − tur_puan; yeniden yüklemede de doğru). */
    function rankingWithMoves(d) {
        const list = d.katilimcilar.slice();
        const prevPts = new Map(list.map(p => [p.katilimci_id, p.puan - (p.tur_puan || 0)]));
        const sortedPrev = list.filter(p => p.katildigi_tur < d.oturum.tur_no || (p.katildigi_tur <= d.oturum.tur_no && d.oturum.tur_no > 1))
            .slice().sort((a, b) => prevPts.get(b.katilimci_id) - prevPts.get(a.katilimci_id));
        const prevRank = new Map();
        let lastP = null, lastR = 0;
        sortedPrev.forEach((p, i) => { const v = prevPts.get(p.katilimci_id); if (v !== lastP) { lastR = i + 1; lastP = v; } prevRank.set(p.katilimci_id, lastR); });
        return list.map(p => {
            const pr = d.oturum.tur_no > 1 ? prevRank.get(p.katilimci_id) : null;
            const move = pr == null ? (d.oturum.tur_no > 1 ? 'new' : null) : pr > p.sira ? 'up' : pr < p.sira ? 'down' : 'same';
            return Object.assign({}, p, { move, delta: pr != null ? pr - p.sira : 0 });
        });
    }
    function moveIcon(p) {
        if (!p.move) return '';
        if (p.move === 'new') return `<span class="sp-move is-new">yeni</span>`;
        const label = p.move === 'up' ? `${p.delta} sıra yükseldi` : p.move === 'down' ? `${-p.delta} sıra düştü` : 'Sırası değişmedi';
        return `<span class="sp-move is-${p.move}" role="img" aria-label="${label}">${ic(p.move === 'up' ? 'up' : p.move === 'down' ? 'down' : 'same')}${p.move !== 'same' ? `<span>${Math.abs(p.delta)}</span>` : ''}</span>`;
    }
    function projRanking(d) {
        const rows = rankingWithMoves(d).filter(p => !p.ayrildi || p.puan > 0).slice(0, 10);
        return `<div class="sp-ranking">
            <h1 class="sp-h2">Sıralama <span class="sp-dim">· ${d.oturum.tur_no}. vakadan sonra</span></h1>
            <ol class="sp-rank-list${reduced() ? '' : ' is-anim'}">${rows.map((p, i) => `<li class="sp-rank-row${p.sira <= 3 ? ' is-top' : ''}">
                <span class="sp-rank">${p.sira}</span><span class="sp-rank-fig" aria-hidden="true">${noro(noroCfg(p), 56, { animated: false })}</span>
                <span class="sp-rank-name">${esc(p.takma_ad)}</span>${moveIcon(p)}
                <span class="sp-rank-gain">${p.tur_puan ? '+' + p.tur_puan : ''}</span><span class="sp-rank-pts">${p.puan}</span></li>`).join('')}</ol>
            ${rows.length ? '' : '<p class="sp-sub">Henüz puan alan yok.</p>'}
        </div>`;
    }
    function projPodium(d) {
        const pod = d.podyum || [];
        const at = (r) => pod.filter(p => p.sira === r);
        const col = (r, cls) => {
            const ps = at(r);
            if (!ps.length) return `<div class="sp-pod-col ${cls} is-empty"></div>`;
            const many = ps.length > 1;
            const more = ps.length > 3 ? `<span class="sp-pod-more">+${ps.length - 3} kişi</span>` : '';
            return `<div class="sp-pod-col ${cls}"><div class="sp-pod-whos${many ? ' is-many' : ''}">${ps.slice(0, 3).map(p => `<div class="sp-pod-who"><span class="sp-pod-fig" aria-hidden="true">${noro(noroCfg(p), many ? 84 : r === 1 ? 150 : 116, { emote: r === 1 ? 'cheer' : 'wave' })}</span>
                <span class="sp-pod-name">${esc(p.takma_ad)}</span><span class="sp-pod-pts">${p.puan} puan</span></div>`).join('')}</div>${more}
                <div class="sp-pod-step"><span class="sp-pod-n">${r}</span></div></div>`;
        };
        const rest = d.katilimcilar.filter(p => p.sira > 3).slice(0, 7);
        return `<div class="sp-final">
            <h1 class="sp-h2">Kazananlar</h1>
            <div class="sp-podium${reduced() ? '' : ' is-anim'}">${col(2, 'is-2')}${col(1, 'is-1')}${col(3, 'is-3')}</div>
            ${rest.length ? `<ol class="sp-rest" aria-label="Diğer sıralar">${rest.map(p => `<li><span class="sp-rank">${p.sira}</span><span>${esc(p.takma_ad)}</span><span class="sp-rest-pts">${p.puan}</span></li>`).join('')}</ol>` : ''}
            ${pod.length ? '' : '<p class="sp-sub">Kimse puan almadı.</p>'}
        </div>`;
    }

    // ---------- telefon (katılımcı)
    function renderPhone(soft) {
        const d = C.d;
        ensureFrame('tel');
        const r = root();
        const me = d.ben || {};
        const du = d.oturum.durum;
        const head = r.querySelector('[data-sn-head]');
        const pts = me.puan != null ? me.puan : 0;
        setHTML(head, `<button class="icon-btn" type="button" data-sn="leave" aria-label="Oturumdan ayrıl">${ic('arrow-left')}</button>
            <span class="st-me"><span class="st-me-fig" aria-hidden="true">${noro(myCfg(), 36, { animated: false })}</span><span class="st-me-name">${esc(me.takma_ad || '')}</span></span>
            ${Zm() ? Zm().badge(zorOfA(d.oturum.ayarlar), { cls: 'is-sm st-zor' }) : ''}<span class="st-pts" aria-label="Toplam puan ${pts}">${pts} puan</span>`);
        const main = r.querySelector('[data-sn-main]');
        const dock = r.querySelector('[data-sn-dock]');
        const k = clueIndex();
        const tur = d.oturum.tur_no;
        const mt = me.tur || null;
        const notYet = me.katildigi_tur > tur;
        let html = '', showDock = false;
        if (du === 'lobi') {
            html = `<div class="st-center"><div class="st-fig">${noro(myCfg(), 150, { emote: 'wave' })}</div>
                <h1 class="sinif-h1">Ekrana bak</h1><p class="sinif-msg-text">Katıldın. Öğretmen başlatınca ilk vaka burada da açılır.</p>
                <p class="st-chip">${d.oturum.katilimci_sayisi} kişi katıldı</p></div>`;
        } else if (du === 'tur' && notYet) {
            html = `<div class="st-center"><div class="st-fig">${noro(myCfg(), 130, { emote: 'think' })}</div>
                <h1 class="sinif-h1">Bir sonraki turda sen de varsın</h1><p class="sinif-msg-text">Bu tur sürerken katıldın. ${tur < d.oturum.vaka_sayisi ? 'Sonraki vakadan itibaren oynayacaksın.' : 'Bu son turdu; sonuçları ekrandan izleyebilirsin.'}</p></div>`;
        } else if (du === 'tur' && k === 0) {
            html = `<div class="st-center"><p class="st-kicker">Tur ${tur} / ${d.oturum.vaka_sayisi}</p><h1 class="sinif-h1">Hazır ol</h1><p class="st-cd" data-sn-left aria-hidden="true">3</p></div>`;
        } else if (du === 'tur' && mt && mt.bitti) {
            html = mt.cozdu
                ? `<div class="st-center is-compact"><div class="st-fig">${noro(myCfg(), 150, { emote: 'cheer' })}</div><h1 class="sinif-h1">Bildin!</h1>
                    <p class="st-gain">+${mt.puan} puan</p><p class="sinif-msg-text">Diğerleri bekleniyor. Cevap birazdan ekranda.</p></div>`
                : `<div class="st-center is-compact"><div class="st-fig">${noro(myCfg(), 140, { emote: 'sad' })}</div><h1 class="sinif-h1">Hakların bitti</h1>
                    <p class="sinif-msg-text">Cevap birazdan ekranda. Sonraki vakada tekrar dene.</p></div>`;
            html += phoneGuesses(me, true);
        } else if (du === 'tur') {
            html = phoneRound(d, k, me);
            showDock = true;
        } else if (du === 'cevap' || du === 'skor') {
            const ans = d.tur && d.tur.cevap ? diag(d.tur.cevap.diagnosis_id) : null;
            const played = !notYet && me.katildigi_tur <= tur;
            const res = !played ? 'Bu turu izledin.' : mt && mt.cozdu ? `Bu vakada <b>+${mt.puan}</b> puan aldın.` : 'Bu vakayı bilemedin.';
            html = `<div class="st-center"><p class="st-kicker">Tur ${tur} / ${d.oturum.vaka_sayisi} bitti</p>
                ${ans ? `<p class="st-ans-l">Cevap</p><p class="st-ans">${esc(ans.nameTr)}</p>` : ''}
                <p class="sinif-msg-text">${res}</p>
                <div class="st-rank"><span class="st-rank-n">${me.sira || '–'}.</span><span class="st-rank-l">sıradasın · ${pts} puan</span></div>
                <p class="st-look">${ic('eye')}<span>Ekrana bak</span></p></div>`;
        } else if (du === 'bitti') {
            const anon = !!(snap() || {}).anonymous;
            const medal = me.sira && me.sira <= 3;
            html = `<div class="st-center"><div class="st-fig">${noro(myCfg(), 160, { emote: medal ? 'cheer' : 'wave' })}</div>
                <p class="st-kicker">Oyun bitti</p><h1 class="sinif-h1">${me.sira ? `${me.sira}. oldun` : 'Teşekkürler'}</h1>
                <p class="st-gain">${pts} puan</p>
                <p class="sinif-msg-text">${medal ? 'Podyumdasın, tebrikler!' : 'Katıldığın için teşekkürler.'}</p>
                <div class="sinif-msg-btns">${anon ? `<p class="st-note">PsikoVaka'da tek başına da vaka çözebilirsin. Hesap açarsan ilerlemen ve sıralaman saklanır.</p>${signupBtn()}` : ''}${homeBtn(anon ? 'btn-secondary' : 'btn-primary')}</div></div>`;
        } else {
            html = `<div class="st-center"><div class="st-fig">${noro(myCfg(), 130, { emote: 'sad' })}</div><h1 class="sinif-h1">Oturum iptal edildi</h1>
                <p class="sinif-msg-text">Öğretmen oturumu başlamadan kapattı.</p><div class="sinif-msg-btns">${homeBtn('btn-primary')}</div></div>`;
        }
        setHTML(main, html);
        dock.hidden = !showDock;
        if (showDock) renderDock(d, me); else { dock._built = null; dock.innerHTML = ''; }
        const t = tl(); if (t) updateTimers(t);
        void soft;
    }
    function phoneRound(d, k, me) {
        const c = caseOf(d);
        if (!c) return `<div class="st-center"><h1 class="sinif-h1">Vaka bulunamadı</h1><p class="sinif-msg-text">Bu vaka bu sürümde yok. Sayfayı yenile.</p></div>`;
        const items = [];
        for (let i = k - 1; i >= 0; i--) {
            items.push(`<li class="st-clue${i === k - 1 ? ' is-now' : ''}"><p class="st-clue-h"><span class="st-clue-n">${i + 1}</span><span>${esc(CLUE_LABELS[i])}</span>${i === k - 1 ? '<span class="st-new">yeni</span>' : ''}</p><p class="st-clue-t">${esc(c.clues[i])}</p></li>`);
        }
        return `<div class="st-round">
            <div class="st-progress"><p class="st-pline"><span>Tur ${d.oturum.tur_no}/${d.oturum.vaka_sayisi}</span><b>İpucu ${k}/6</b></p>
                <progress class="sp-bar st-bar" data-sn-bar max="1000" value="0" aria-label="Sonraki ipucuna kalan süre"></progress><p class="st-left" data-sn-left></p></div>
            <p class="st-patient"><span class="st-patient-l">Danışan</span>${esc(c.patientSummary)}</p>
            <ol class="st-clues" aria-label="Açılan ipuçları (en yenisi üstte)">${items.join('')}</ol>
            ${phoneGuesses(me, false)}
        </div>`;
    }
    function phoneGuesses(me, done) {
        const g = (me && me.tahminlerim) || [];
        if (!g.length) return '';
        return `<section class="st-guesses${done ? ' is-done' : ''}" aria-label="Tahminlerin"><h2 class="st-h2">Tahminlerin</h2><ul>${g.map(x => {
            const dd = diag(x.item_id);
            const near = x.ayni_grup && !(C.d && C.d.oturum && C.d.oturum.ayarlar && C.d.oturum.ayarlar.kategori_gizli);
            const st = x.dogru ? 'is-ok' : near ? 'is-near' : 'is-bad';
            const lab = x.dogru ? 'Doğru' : near ? 'Aynı grup' : 'Yanlış';
            return `<li class="st-guess ${st}">${ic(x.dogru ? 'check' : 'x')}<span class="st-guess-n">${esc(dd ? dd.nameTr : x.item_id)}</span><span class="st-guess-tag">${lab}</span></li>`;
        }).join('')}</ul></section>`;
    }
    function renderDock(d, me) {
        const dock = C.layer.querySelector('[data-sn-dock]');
        const key = d.oturum.id + ':' + d.oturum.tur_no;
        const total = d.oturum.ayarlar.tahmin_hakki;
        const kalan = me.tur ? me.tur.kalan : total;
        if (dock._built !== key) {
            dock._built = key;
            dock.innerHTML = `<p class="st-feedback" data-sn-fb role="status" aria-live="polite"></p>
                <form class="st-guess-form" data-sn-guess novalidate role="search" aria-label="Tanı tahmini">
                    <div class="st-ac" data-sn-ac role="listbox" id="snAcList" aria-label="Öneriler" hidden></div>
                    <div class="st-guess-row">
                        <label class="ol-offscreen" for="snGuess">Tanı tahmini</label>
                        <input class="form-input st-guess-input" id="snGuess" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Tanı yaz ve listeden seç"
                            role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="snAcList" aria-describedby="snMarks">
                        <button class="btn btn-primary st-guess-btn" type="submit" aria-label="Tahmin et">${ic('send')}</button>
                    </div>
                    <p class="st-marks" id="snMarks" data-sn-marks></p>
                </form>`;
        }
        const marks = dock.querySelector('[data-sn-marks]');
        const used = total - kalan;
        setHTML(marks, `<span class="st-mark-dots" aria-hidden="true">${Array.from({ length: total }, (_, i) => `<span class="st-mark${i < used ? ' is-used' : ''}"></span>`).join('')}</span><span>Kalan hak ${kalan}/${total}</span>`);
        const fb = dock.querySelector('[data-sn-fb]');
        const f = C.feedback;
        const fbHtml = f ? `<span class="st-fb ${f.cls}">${ic(f.icon)}<span>${f.html}</span></span>` : '';
        if (fb._sig !== fbHtml) { fb._sig = fbHtml; fb.innerHTML = fbHtml; }
        const btn = dock.querySelector('.st-guess-btn');
        if (btn) btn.disabled = C.guessBusy;
    }

    // ---------- otomatik tamamlama (telefon)
    function acSearch(q) {
        const qq = norm(q);
        if (!qq) return [];
        return diagnoses().filter(dd => norm(dd.nameTr).includes(qq) || norm(dd.nameEn).includes(qq) || (dd.aliases || []).some(a => norm(a).includes(qq))).slice(0, 8);
    }
    function acRender(input) {
        const box = C.layer.querySelector('[data-sn-ac]');
        if (!box) return;
        const items = C.ac.items;
        if (!items.length) { box.hidden = true; box.innerHTML = ''; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); return; }
        box.innerHTML = items.map((dd, i) => `<div class="st-ac-item${i === C.ac.idx ? ' is-sel' : ''}" role="option" id="snAc${i}" data-sn-pick="${esc(dd.id)}" aria-selected="${i === C.ac.idx}">
            <span class="st-ac-tr">${esc(dd.nameTr)}</span><span class="st-ac-en">${esc(dd.nameEn)} · ${esc(catName(dd.category))}</span></div>`).join('');
        box.hidden = false;
        input.setAttribute('aria-expanded', 'true');
        if (C.ac.idx >= 0) input.setAttribute('aria-activedescendant', 'snAc' + C.ac.idx); else input.removeAttribute('aria-activedescendant');
    }
    function acClose() { C.ac = { items: [], idx: -1 }; const i = C.layer && C.layer.querySelector('#snGuess'); if (i) acRender(i); }

    async function sendGuess(itemId) {
        const d = C.d;
        if (!d || C.guessBusy) return;
        const input = C.layer.querySelector('#snGuess');
        const tur = d.oturum.tur_no;
        C.guessBusy = true; renderDock(d, d.ben || {});
        const r = await API.tahmin(d.oturum.id, itemId, tur);
        C.guessBusy = false;
        if (!C.d || C.d.oturum.tur_no !== tur) return;
        const dd = diag(itemId);
        if (!r.ok) {
            const code = r.error.code;
            C.feedback = { cls: 'is-warn', icon: 'alert', html: esc(r.error.message) };
            if (['ZATEN_COZDUN', 'HAK_BITTI', 'TUR_KAPALI', 'TUR_DISI', 'TUR_BASLAMADI'].includes(code)) refresh();
            if (code === 'ATILDIN') { gone('kicked'); return; }
            renderDock(C.d, C.d.ben || {});
            announce(r.error.message);
            return;
        }
        const g = r.data;
        const me = C.d.ben;
        if (me) {
            me.tur = me.tur || { tahmin_sayisi: 0, kalan: d.oturum.ayarlar.tahmin_hakki, bitti: false, cozdu: false, puan: 0 };
            me.tur.tahmin_sayisi = g.guess_no; me.tur.kalan = g.guesses_left; me.tur.bitti = !!g.done; me.tur.cozdu = !!g.correct; me.tur.puan = g.points || 0;
            me.tahminlerim = (me.tahminlerim || []).concat([{ tahmin_no: g.guess_no, item_id: g.item_id, dogru: g.correct, ayni_grup: g.same_group, ipucu_no: g.clue_index }]);
        }
        if (input) { input.value = ''; delete input.dataset.selectedId; }
        acClose();
        const name = esc(dd ? dd.nameTr : itemId);
        if (g.correct) { C.feedback = { cls: 'is-ok', icon: 'check', html: `Doğru! +${g.points} puan` }; announce(`Doğru! ${g.points} puan.`); }
        else if (g.same_group && !(d.oturum.ayarlar && d.oturum.ayarlar.kategori_gizli)) { C.feedback = { cls: 'is-near', icon: 'info', html: `${name} değil, ama aynı tanı grubunda. ${g.guesses_left ? `${g.guesses_left} hakkın kaldı.` : 'Hakların bitti.'}` }; announce(`Yanlış ama aynı grup. ${g.guesses_left} hak kaldı.`); }
        else { C.feedback = { cls: 'is-bad', icon: 'x', html: `${name} değil. ${g.guesses_left ? `${g.guesses_left} hakkın kaldı.` : 'Hakların bitti.'}` }; announce(`Yanlış. ${g.guesses_left} hak kaldı.`); }
        render();
        if (!g.done && input) { try { input.focus({ preventScroll: true }); } catch (e) { /* yok */ } }
    }
    function submitGuess() {
        const input = C.layer.querySelector('#snGuess');
        if (!input) return;
        let id = input.dataset.selectedId;
        const v = (input.value || '').trim();
        if (!v) { C.feedback = { cls: 'is-warn', icon: 'alert', html: 'Bir tanı yaz ve listeden seç.' }; renderDock(C.d, C.d.ben || {}); return; }
        if (!id) {
            const q = norm(v);
            const ex = diagnoses().find(dd => norm(dd.nameTr) === q || norm(dd.nameEn) === q || (dd.aliases || []).some(a => norm(a) === q));
            if (ex) id = ex.id;
            else if (C.ac.items.length === 1) id = C.ac.items[0].id;
        }
        if (!id) { C.feedback = { cls: 'is-warn', icon: 'alert', html: API.MSG.UNKNOWN_ITEM }; renderDock(C.d, C.d.ben || {}); return; }
        sendGuess(id);
    }

    // ------------------------------------------------------------ olaylar
    async function onClick(e) {
        const pick = e.target.closest('[data-sn-pick]');
        if (pick) { e.preventDefault(); const input = C.layer.querySelector('#snGuess'); const dd = diag(pick.dataset.snPick); if (input && dd) { input.value = dd.nameTr; input.dataset.selectedId = dd.id; } acClose(); sendGuess(pick.dataset.snPick); return; }
        const kick = e.target.closest('[data-sn-kick]');
        if (kick && C.mode === 'host') { kickAsk(kick.dataset.snKick); return; }
        const b = e.target.closest('[data-sn]');
        if (!b) { if (!e.target.closest('.st-guess-form')) acClose(); return; }
        const act = b.dataset.sn;
        if (act === 'home') { goHome(); return; }
        if (act === 'retry') { if (C.id) refresh(); else handleRoute(); return; }
        if (act === 'signup') { goHome('oyna'); const g = game(); if (g && g.openAuthSheet) setTimeout(() => g.openAuthSheet('signup'), 50); return; }
        if (act === 'fullscreen') { toggleFullscreen(); return; }
        if (act === 'explain') { C.showExplain = !C.showExplain; render(); return; }
        if (act === 'leave') { leaveAsk(); return; }
        if (!C.d || C.mode !== 'host') return;
        const id = C.d.oturum.id;
        const run = async (fn) => {
            b.disabled = true; b.classList.add('is-loading');
            const r = await fn();
            b.disabled = false; b.classList.remove('is-loading');
            if (!r.ok) { toast(r.error.message); refresh(); return; }
            if (r.data && r.data.oturum) apply(r.data); else refresh();
        };
        if (act === 'start') run(() => API.basla(id));
        else if (act === 'endround') run(() => API.turuBitir(id));
        else if (act === 'next') run(() => API.sonraki(id, C.d.oturum.durum));
        else if (act === 'end') {
            const ok = await NS.ui.confirm('Oturumu bitir', C.d.oturum.durum === 'lobi' ? 'Oturum iptal edilir; katılımcılar ayrılır.' : 'Oyun burada biter ve podyum gösterilir. Açık tur puanlanarak kapanır.', 'Bitir', { danger: true, cancelLabel: 'Vazgeç' });
            if (ok) run(() => API.bitir(id));
        }
    }
    async function kickAsk(kid) {
        const p = C.d && C.d.katilimcilar.find(x => x.katilimci_id === kid);
        if (!p) return;
        const ok = await NS.ui.confirm('Oturumdan çıkar', `${p.takma_ad} oturumdan çıkarılsın mı? Bu oturuma yeniden katılamaz.`, 'Çıkar', { danger: true, cancelLabel: 'Vazgeç' });
        if (!ok || !C.d) return;
        const r = await API.at(C.d.oturum.id, kid);
        if (!r.ok) toast(r.error.message); else { toast(`${p.takma_ad} çıkarıldı.`); refresh(); }
    }
    async function leaveAsk() {
        if (!C.d) { goHome(); return; }
        if (['bitti', 'iptal'].includes(C.d.oturum.durum)) { goHome(); return; }
        const ok = await NS.ui.confirm('Oturumdan ayrıl', 'Puanın saklanır; aynı kodla yeniden katılabilirsin.', 'Ayrıl', { danger: true, cancelLabel: 'Oyunda kal' });
        if (!ok || !C.d) return;
        const r = await API.ayril(C.d.oturum.id);
        if (!r.ok && r.error.code !== 'SINIF_YOK') { toast(r.error.message); return; }
        gone('left');
    }
    function onSubmit(e) {
        const j = e.target.closest('[data-sn-join]');
        if (j) { e.preventDefault(); submitJoin(j); return; }
        const g = e.target.closest('[data-sn-guess]');
        if (g) {
            e.preventDefault();
            if (C.ac.idx >= 0 && C.ac.items[C.ac.idx]) { const dd = C.ac.items[C.ac.idx]; const input = C.layer.querySelector('#snGuess'); input.value = dd.nameTr; input.dataset.selectedId = dd.id; acClose(); sendGuess(dd.id); return; }
            submitGuess();
        }
    }
    function onInput(e) {
        const t = e.target;
        if (t.id === 'snCode') {
            const v = t.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
            if (v !== t.value) t.value = v;
            const er = C.layer.querySelector('#snCodeErr'); if (er) er.textContent = '';
        } else if (t.id === 'snName') {
            const er = C.layer.querySelector('#snNameErr');
            const v = t.value.trim();
            if (er) er.textContent = v.length >= 2 && global.PsikoVakaIsimFiltresi && !global.PsikoVakaIsimFiltresi.check(v).ok ? API.MSG.TAKMA_AD_UYGUNSUZ : '';
            const fig = C.layer.querySelector('[data-sn-joinfig]');
            const s = snap();
            if (fig && !(s && s.state === 'ready' && s.profile)) { clearTimeout(C.figT); C.figT = setTimeout(() => { fig.innerHTML = noro(noroCfg({ takma_ad: v || 'misafir' }), 112, { emote: 'wave' }); }, 250); }
        } else if (t.id === 'snGuess') {
            delete t.dataset.selectedId;
            C.ac = { items: acSearch(t.value), idx: -1 };
            acRender(t);
            if (C.feedback && C.feedback.cls === 'is-warn') { C.feedback = null; renderDock(C.d, C.d.ben || {}); }
        }
    }
    function onKeydown(e) {
        if (e.target.id === 'snGuess') {
            const n = C.ac.items.length;
            if (!n) return;
            if (e.key === 'ArrowDown') { e.preventDefault(); C.ac.idx = (C.ac.idx + 1) % n; acRender(e.target); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); C.ac.idx = (C.ac.idx - 1 + n) % n; acRender(e.target); }
            else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); acClose(); }
            return;
        }
        // Projeksiyon kısayolu: F tam ekran
        if (C.mode === 'host' && !e.target.closest('input, select, textarea, button')) {
            if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFullscreen(); }
        }
    }
    function toggleFullscreen() {
        // Belgenin tamamı: onay sayfaları ve bildirimler tam ekranda da görünsün
        const el = document.documentElement;
        if (!document.fullscreenElement) { if (el && el.requestFullscreen) el.requestFullscreen().catch(() => toast('Tarayıcı tam ekrana izin vermedi.')); }
        else if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
    }

    // ------------------------------------------------------------ başlangıç
    function init() {
        if (C.started) return;
        const g = game();
        if (!g || !g.routeScreens) { setTimeout(init, 50); return; }
        C.started = true;
        if (!API) return;
        injectSprite();
        const scr = ensureScreen();
        g.routeScreens.katil = scr;
        g.routeScreens.sinif = scr;
        g.routeNavParent = Object.assign(g.routeNavParent || {}, { katil: 'online', sinif: 'online' });
        if (g.registerScreen) { g.registerScreen('katil', () => handleRoute()); g.registerScreen('sinif', () => handleRoute()); }
        global.addEventListener('hashchange', () => { if (!parseHash() && C.layer && !C.layer.hidden) closeAll(); });
        document.addEventListener('visibilitychange', () => { if (!document.hidden && C.id) refresh(); });
        global.addEventListener('online', () => { if (C.id) refresh(); });
        document.addEventListener('fullscreenchange', () => { if (C.mode === 'host' && C.d) render(true); });
        const a = acc();
        if (a && a.onChange) a.onChange(() => {
            const slot = document.getElementById('olSinifSlot');
            if (slot) renderHubCard(slot);
            if (parseHash() && (!C.layer || C.layer.hidden || C.view === 'loading' || C.view === 'unsupported')) handleRoute();
        });
        // Uygulama #/katil'i bu modül kaydolmadan önce "bulunamadı" saymış olabilir
        if (parseHash() && g.showRoute) g.showRoute(/^#\/sinif\//.test(location.hash) ? 'sinif' : 'katil');
    }

    NS.sinif = {
        init, renderHubCard, openSetup, handleRoute,
        get state() { return C; },
        _tl: tl
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
    else setTimeout(init, 0);
})(typeof window !== 'undefined' ? window : globalThis);
