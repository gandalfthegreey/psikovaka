/**
 * PsikoVaka — Nöro avatar stüdyosu (eski js/online_arena.js'ten taşındı, ajan M 2026-11-15).
 * Eski arena (ntfy.sh / PeerJS / BroadcastChannel, yerel arkadaş listesi, yerel RP) kaldırıldı;
 * canlı oyun artık js/online/ altında (Supabase). Bu dosyada yalnızca avatar kalır:
 *   renderFunnyAvatarSVG(cfg, size, opts)  eski çağrı yerleri için PsikoVakaAvatar sarmalayıcısı
 *   attachAvatarStudioToGame(PsikoVakaGame) prototipe ekler: initAvatarStudio, openAvatarStudio,
 *     loadMyAvatar, saveMyAvatar, renderHeaderProfilePill, renderAvatarStudioTab, renderAvatarStudioPreview,
 *     selectAvatarStudioSlot, pickAvatarOption, setStudioAvatar, setAvatarSaveStatus
 * Pencere: #avatarStudioModal (Profil > "Avatar ve ad" ve profil düzenleme > "Avatarı değiştir").
 */

/** Her yapılandırmayı (eski v1 dahil) Nöro'ya çevirip çizer. */
function renderFunnyAvatarSVG(avatarCfg = {}, size = 56, opts = {}) {
    if (typeof PsikoVakaAvatar === 'undefined') return '';
    return PsikoVakaAvatar.render(PsikoVakaAvatar.normalize(avatarCfg), Object.assign({ size }, opts));
}

function attachAvatarStudioToGame(GameClass) {
    const proto = GameClass.prototype;

    proto.initAvatarStudio = function () {
        this.myAvatar = this.loadMyAvatar();
        this.renderHeaderProfilePill();
        const pill = document.getElementById('btnHeaderProfilePill');
        if (pill) pill.addEventListener('click', () => this.openAvatarStudio());
        const rnd = document.getElementById('btnRandomizeFunnyAvatar');
        if (rnd) rnd.addEventListener('click', () => { this.setStudioAvatar(PsikoVakaAvatar.randomConfig(), true); this.playTone('warm'); });
    };

    proto.openAvatarStudio = function () {
        const modal = document.getElementById('avatarStudioModal');
        if (!modal) return;
        this.renderAvatarStudioTab();
        this.openModal(modal);
    };

    // Yerel avatar her yüklemede Nöro v2'ye normalize edilir; eski (v1) kayıt bulunursa v2 olarak geri yazılır.
    proto.loadMyAvatar = function () {
        let parsed = null;
        try {
            const raw = localStorage.getItem('psikovaka_funny_avatar');
            if (raw) parsed = JSON.parse(raw);
        } catch (e) { /* yok */ }
        const cfg = PsikoVakaAvatar.normalize(parsed);
        if (!parsed || JSON.stringify(parsed) !== JSON.stringify(cfg)) {
            try { localStorage.setItem('psikovaka_funny_avatar', JSON.stringify(cfg)); } catch (e) { /* yok */ }
        }
        return cfg;
    };

    proto.saveMyAvatar = function () {
        this.myAvatar = PsikoVakaAvatar.normalize(this.myAvatar);
        try { localStorage.setItem('psikovaka_funny_avatar', JSON.stringify(this.myAvatar)); } catch (e) { /* yok */ }
        this.renderHeaderProfilePill();
    };

    /** Profil kartındaki avatar ve ad (app.js installProfileMirrors bunu sarar ve aynaları günceller). */
    proto.renderHeaderProfilePill = function () {
        const avatarMount = document.getElementById('headerFunnyAvatarMount');
        const nameMount = document.getElementById('headerPlayerNameMount');
        if (avatarMount) avatarMount.innerHTML = renderFunnyAvatarSVG(this.myAvatar, 34);
        if (nameMount) nameMount.textContent = this.duelMyNickname || 'Klinisyen';
    };

    proto.renderAvatarStudioTab = function () {
        const previewEl = document.getElementById('funnyAvatarLivePreview');
        const tabsEl = document.getElementById('avatarSlotTabs');
        const gridEl = document.getElementById('funnyAvatarControlsGrid');
        if (!previewEl || !tabsEl || !gridEl) return;
        const A = PsikoVakaAvatar;
        this.myAvatar = A.normalize(this.myAvatar);
        if (!this.avatarStudioSlot) this.avatarStudioSlot = 'body';

        if (!this._avatarStudioBound) {
            this._avatarStudioBound = true;
            const icons = { body: 'av-body', color: 'av-color', tufts: 'av-tuft', eyes: 'eye', mouth: 'av-mouth', pattern: 'av-pattern', headwear: 'av-hat', accessory: 'av-acc', background: 'av-bg' };
            tabsEl.innerHTML = A.SLOTS.map(sl => `<button type="button" class="nv-slot-tab" role="tab" id="avatarSlotTab-${sl.key}" data-slot="${sl.key}" aria-controls="avatarSlotPanel" aria-selected="false" tabindex="-1"><svg class="icon" aria-hidden="true"><use href="#i-${icons[sl.key]}"/></svg><span>${sl.label}</span></button>`).join('');
            tabsEl.addEventListener('click', (e) => {
                const b = e.target.closest('[data-slot]');
                if (b) this.selectAvatarStudioSlot(b.dataset.slot, false);
            });
            tabsEl.addEventListener('keydown', (e) => {
                const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
                if (!keys.includes(e.key)) return;
                e.preventDefault();
                const order = A.SLOTS.map(s => s.key);
                let i = order.indexOf(this.avatarStudioSlot);
                if (e.key === 'ArrowRight') i = (i + 1) % order.length;
                else if (e.key === 'ArrowLeft') i = (i - 1 + order.length) % order.length;
                else if (e.key === 'Home') i = 0;
                else i = order.length - 1;
                this.selectAvatarStudioSlot(order[i], true);
            });
            gridEl.addEventListener('click', (e) => {
                const b = e.target.closest('[data-val]');
                if (b) this.pickAvatarOption(b.dataset.val, false);
            });
            gridEl.addEventListener('keydown', (e) => {
                const items = Array.from(gridEl.querySelectorAll('[data-val]'));
                if (!items.length) return;
                const cur = Math.max(0, items.findIndex(x => x.getAttribute('aria-checked') === 'true'));
                let next = null;
                const cols = Math.max(1, Math.round(gridEl.clientWidth / Math.max(1, items[0].offsetWidth)));
                if (e.key === 'ArrowRight') next = (cur + 1) % items.length;
                else if (e.key === 'ArrowLeft') next = (cur - 1 + items.length) % items.length;
                else if (e.key === 'ArrowDown') next = Math.min(items.length - 1, cur + cols);
                else if (e.key === 'ArrowUp') next = Math.max(0, cur - cols);
                else if (e.key === 'Home') next = 0;
                else if (e.key === 'End') next = items.length - 1;
                else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this.pickAvatarOption(items[cur].dataset.val, true); return; }
                if (next === null) return;
                e.preventDefault();
                this.pickAvatarOption(items[next].dataset.val, true);
            });
            const btnReset = document.getElementById('btnResetAvatar');
            if (btnReset) btnReset.addEventListener('click', () => this.setStudioAvatar(Object.assign({}, A.DEFAULT), true));
        }
        this.renderAvatarStudioPreview();
        this.selectAvatarStudioSlot(this.avatarStudioSlot, false);
    };

    proto.renderAvatarStudioPreview = function () {
        const A = PsikoVakaAvatar;
        const previewEl = document.getElementById('funnyAvatarLivePreview');
        if (previewEl) previewEl.innerHTML = A.render(this.myAvatar, { size: 200, framed: true, animated: true, title: `Avatarın: ${A.describe(this.myAvatar)}` });
        const nameEl = document.getElementById('avatarStudioName');
        const snap = this.accountSnap && this.accountSnap.state === 'ready' && this.accountSnap.profile ? this.accountSnap.profile : null;
        if (nameEl) nameEl.textContent = snap ? (snap.display_name || snap.username) : (this.duelMyNickname || 'Klinisyen');
        const descEl = document.getElementById('avatarStudioDesc');
        if (descEl) descEl.textContent = A.describe(this.myAvatar);
    };

    proto.selectAvatarStudioSlot = function (slot, focus) {
        const A = PsikoVakaAvatar;
        const sl = A.SLOTS.find(s => s.key === slot) || A.SLOTS[0];
        this.avatarStudioSlot = sl.key;
        const tabsEl = document.getElementById('avatarSlotTabs');
        const gridEl = document.getElementById('funnyAvatarControlsGrid');
        const panel = document.getElementById('avatarSlotPanel');
        if (!tabsEl || !gridEl) return;
        tabsEl.querySelectorAll('[data-slot]').forEach(b => {
            const on = b.dataset.slot === sl.key;
            b.setAttribute('aria-selected', String(on));
            b.tabIndex = on ? 0 : -1;
            b.classList.toggle('active', on);
            if (on && focus) b.focus();
            if (on) { try { b.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) { /* yok */ } }
        });
        if (panel) panel.setAttribute('aria-labelledby', `avatarSlotTab-${sl.key}`);
        gridEl.setAttribute('aria-label', sl.label);
        gridEl.classList.toggle('is-colors', sl.key === 'color' || sl.key === 'background');
        const cur = this.myAvatar[sl.key];
        gridEl.innerHTML = A.PARTS[sl.key].map(p => {
            const cfg = Object.assign({}, this.myAvatar, { [sl.key]: p.id });
            const framed = sl.key === 'background' ? p.id !== 'none' : true;
            if (sl.key !== 'background' && sl.key !== 'color') cfg.background = this.myAvatar.background === 'none' ? 'lavender' : this.myAvatar.background;
            const on = p.id === cur;
            return `<button type="button" class="nv-swatch" role="radio" aria-checked="${on}" tabindex="${on ? 0 : -1}" data-val="${p.id}">
                <span class="nv-swatch-art">${A.render(cfg, { size: 64, framed })}</span>
                <span class="nv-swatch-label">${p.name}</span>
            </button>`;
        }).join('');
    };

    proto.pickAvatarOption = function (val, focus) {
        const slot = this.avatarStudioSlot;
        const gridEl = document.getElementById('funnyAvatarControlsGrid');
        if (!gridEl) return;
        gridEl.querySelectorAll('[data-val]').forEach(b => {
            const on = b.dataset.val === val;
            b.setAttribute('aria-checked', String(on));
            b.tabIndex = on ? 0 : -1;
            if (on && focus) b.focus();
        });
        if (this.myAvatar[slot] === val) return;
        this.setStudioAvatar(Object.assign({}, this.myAvatar, { [slot]: val }), false);
    };

    /** Stüdyodan gelen değişiklik: önizleme hemen güncellenir, kayıt (yerel + hesap) kısa gecikmeyle. */
    proto.setStudioAvatar = function (cfg, rerenderGrid) {
        this.myAvatar = PsikoVakaAvatar.normalize(cfg);
        this.renderAvatarStudioPreview();
        if (rerenderGrid) this.selectAvatarStudioSlot(this.avatarStudioSlot, false);
        clearTimeout(this._avatarSaveTimer);
        this._avatarSaveTimer = setTimeout(() => {
            this._avatarSaveTimer = null;
            this.saveMyAvatar();
            const remote = typeof this.accountReady === 'function' && this.accountReady();
            this.setAvatarSaveStatus(remote ? 'saving' : 'saved');
        }, 300);
    };

    /** 'saving' | 'saved' | 'error' | '' — hesap senkronu (app.js) sonucu da buraya bildirir. */
    proto.setAvatarSaveStatus = function (state) {
        const el = document.getElementById('avatarSaveStatus');
        if (!el) return;
        const text = { saving: 'Kaydediliyor…', saved: 'Kaydedildi', error: 'Sunucuya kaydedilemedi; bu cihazda kayıtlı.' }[state] || '';
        el.textContent = text;
        el.dataset.state = state || '';
        clearTimeout(this._avatarStatusTimer);
        if (state === 'saved') this._avatarStatusTimer = setTimeout(() => { el.textContent = ''; el.dataset.state = ''; }, 2500);
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderFunnyAvatarSVG, attachAvatarStudioToGame };
}
