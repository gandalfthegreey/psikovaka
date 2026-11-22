/**
 * PsikoVaka 2.0 - Klinik Vaka, Terapi, Psikofarmakoloji ve Tam Konsültasyon (Kombo) motoru.
 * Canlı çok oyunculu katman: js/online/ (Supabase); bu dosya yalnızca #duel= meydan okuma bağlantısını taşır
 */

class PsikoVakaGame {
    constructor() {
        this.allMasterCases = (typeof CLINICAL_CASES !== 'undefined') ? [...CLINICAL_CASES] : [];
        this.diagnoses = (typeof DIAGNOSES_DATABASE !== 'undefined') ? DIAGNOSES_DATABASE : [];
        this.categories = (typeof DSM_CATEGORIES !== 'undefined') ? DSM_CATEGORIES : {};
        this.courses = (typeof COURSE_CATEGORIES !== 'undefined') ? COURSE_CATEGORIES : {};
        this.therapies = (typeof THERAPIES_DATABASE !== 'undefined') ? THERAPIES_DATABASE : [];
        this.therapyFamilies = (typeof THERAPY_FAMILIES !== 'undefined') ? THERAPY_FAMILIES : {};
        this.pharmacology = (typeof PHARMACOLOGY_DATABASE !== 'undefined') ? PHARMACOLOGY_DATABASE : [];
        this.pharmacologyFamilies = (typeof PHARMACOLOGY_FAMILIES !== 'undefined') ? PHARMACOLOGY_FAMILIES : {};

        // Ensure every case has a pharmacologyId
        this.allMasterCases.forEach(c => {
            if (!c.pharmacologyId) {
                c.pharmacologyId = this.getFallbackPharmacologyId(c);
            }
        });

        this.cases = [...this.allMasterCases];
        this.activePackId = localStorage.getItem('psikovaka_active_pack_id') || 'all';
        this.savedCustomPacks = this.loadSavedCustomPacks();
        this.solvedCaseIds = this.loadSolvedCaseIds();
        this.onlyUnsolvedMode = localStorage.getItem('psikovaka_only_unsolved') === 'true';

        this.currentCase = null;
        this.currentMode = 'daily'; // 'daily', 'practice', 'custom', 'duel'
        this.targetGameMode = 'diagnosis'; // 'diagnosis', 'therapy', 'pharmacology', 'combo'
        this.comboStage = 1; // 1: Diagnosis, 2: Therapy, 3: Pharmacology
        this.comboResults = { stage1Guesses: 0, stage2Guesses: 0, stage3Guesses: 0 };

        this.unlockedClues = 1;
        this.maxClues = 6;
        // Zorluk (ajan Z1): bu vakanın ayarları; pratik seçimi localStorage'da (js/zorluk.js)
        this.zorluk = { tekHak: false, kategoriGizli: false };
        this.practiceZorluk = window.PsikoVakaZorluk ? window.PsikoVakaZorluk.load() : { tekHak: false, kategoriGizli: false };
        this.clueRevealHandler = null;   // online/günlük: sunucuya giden "Sonraki ipucu"
        this.dailyZorlukHandler = null;  // günlük (üye): ayar değişince sunucuya
        this.cluesUsed = null;           // vaka bitince açık ipucu sayısı (tek hak sonucu)
        this.guesses = [];
        this.isGameOver = false;
        this.gameWon = false;
        this.activeCategoryFilter = 'ALL';
        this.activeCourseFilter = 'ALL';
        this.currentDisplayTitle = '';
        this.recentPracticeIds = [];

        this.selectedAutocompleteIndex = -1;
        this.autocompleteResults = [];

        // Duel & Stopwatch State
        this.caseStartTime = Date.now();
        this.elapsedSeconds = 0;
        this.duelTimerInterval = null;
        this.activeDuelChallenge = null; // #duel= meydan okuma bağlantısı: { caseId, mode, challengerName, challengerGuesses, challengerTimeSec }
        this.duelMyNickname = localStorage.getItem('psikovaka_nickname') || 'Klinisyen';

        this.stats = this.loadStats();

        this.currentScreen = null;
        this.currentRoute = 'oyna';
        this.libDefaultTitle = (typeof document !== 'undefined') ? document.title : '';
        this.caseTargetMode = null;
        this.playHistoryPushed = false;

        this.initDOM();
        this.applyActivePack(this.activePackId, false);
        this.initEventListeners();
        if (typeof this.initAvatarStudio === 'function') {
            this.initAvatarStudio();   // js/avatar_studio.js (canlı oyun: js/online/)
        }
        this.installProfileMirrors();
        this.initGroupColors();
        this.initRouter();
        this.updateUnsolvedUI();
        this.updateTargetHint();
        this.updatePracticeSummary();
        this.updateHomeMeta();
        this.checkURLForCustomOrDuelCase();
        this.initAccountUI();
    }

    // =====================================================================
    // ARAYÜZ: Simge yardımcısı, ekran yönlendirici (router), profil aynaları
    // =====================================================================

    /** SVG sprite'tan simge döndürür: icon('check') -> <svg class="icon"><use href="#i-check"/></svg> */
    icon(name, extraClass = '') {
        return `<svg class="icon${extraClass ? ' ' + extraClass : ''}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
    }

    initRouter() {
        this.routeScreens = {
            oyna: this.dom.screenHome,
            klinigim: document.getElementById('screenClinic'),
            online: this.dom.screenOnline,
            kutuphane: this.dom.screenLibrary,
            profil: this.dom.screenProfile,
            ligler: document.getElementById('screenLeagues'),
            gunluk: document.getElementById('screenDaily'),
            notfound: document.getElementById('screenNotFound')
        };
        // Alt ekranlar: menüde hangi ana sekme etkin görünsün
        this.routeNavParent = { ligler: 'profil', gunluk: 'oyna' };
        this.screenHooks = this.screenHooks || {};

        window.addEventListener('hashchange', () => {
            const r = this.parseRouteHash();
            if (r) this.showRoute(r);
        });

        window.addEventListener('popstate', () => {
            if (this.currentScreen === 'play' && this.playHistoryPushed) {
                this.playHistoryPushed = false;
                this.showRoute(this.parseRouteHash() || this.currentRoute || 'oyna', { fromPop: true });
            }
        });

        document.querySelectorAll('[data-route]').forEach(link => {
            link.addEventListener('click', (e) => {
                const r = link.dataset.route;
                if (window.location.hash === `#/${r}`) {
                    e.preventDefault();
                    this.showRoute(r);
                }
            });
        });

        const brand = document.querySelector('.brand');
        if (brand) {
            brand.addEventListener('click', (e) => {
                if (window.location.hash === '#/oyna') {
                    e.preventDefault();
                    this.showRoute('oyna');
                }
            });
        }
    }

    /** '#/profil' -> 'profil'. Diğer hash'ler (#room=, #duel=, #case=, #id=) için null. */
    parseRouteHash() {
        const h = window.location.hash || '';
        const m = /^#\/([a-z]+)/.exec(h);
        if (m && this.routeScreens && this.routeScreens[m[1]] && m[1] !== 'notfound') return m[1];
        // Bilinmeyen "#/..." adresi: ayrı "Bu sayfa yok" ekranı (H13)
        if (/^#\/./.test(h) && this.routeScreens && this.routeScreens.notfound) return 'notfound';
        return null;
    }

    /** Oyuncunun kendi Nöro'su (yoksa misafir için sabit bir Nöro), isteğe bağlı hareketle. */
    renderNoro(emote, size) {
        const AV = window.PsikoVakaAvatar;
        if (!AV) return '';
        let cfg = null;
        try { cfg = this.myAvatar ? AV.normalize(this.myAvatar) : AV.randomConfig('misafir'); } catch (e) { cfg = AV.randomConfig('misafir'); }
        return AV.render(cfg, { size: size || 96, framed: false, emote: emote || null, animated: true });
    }

    showRoute(route, opts = {}) {
        if (!this.routeScreens || !this.routeScreens[route]) route = 'oyna';
        if (this.currentScreen === 'play' && this.playHistoryPushed && !opts.fromPop) {
            // Telefonun geri tuşu için eklenen geçmiş kaydını sessizce düşür
            this.playHistoryPushed = false;
            try { history.replaceState(null, '', window.location.href); } catch (e) {}
        }
        this.currentRoute = route;
        this.showScreen(route);
        if (route === 'kutuphane') this.renderLibraryRoute();
    }

    /** name: 'oyna' | 'online' | 'kutuphane' | 'profil' | 'play' */
    showScreen(name) {
        const all = [this.dom.screenHome, this.dom.screenOnline, this.dom.screenLibrary, this.dom.screenProfile, this.dom.screenPlay]
            .concat(Object.values(this.routeScreens || {}).filter(x => x && ![this.dom.screenHome, this.dom.screenOnline, this.dom.screenLibrary, this.dom.screenProfile].includes(x)));
        const target = name === 'play' ? this.dom.screenPlay : (this.routeScreens && this.routeScreens[name]);
        all.forEach(s => { if (s) s.hidden = (s !== target); });

        const isPlay = name === 'play';
        document.body.classList.toggle('is-playing', isPlay);

        document.querySelectorAll('[data-route]').forEach(link => {
            const active = !isPlay && link.dataset.route === ((this.routeNavParent && this.routeNavParent[name]) || name);
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });

        const changed = this.currentScreen !== name;
        this.currentScreen = name;

        if (name === 'oyna') { this.updateHomeMeta(); this.updatePracticeSummary(); this.updateWelcomeCard(); }
        if (name === 'profil') this.updateProfileScreen();
        if (name === 'notfound') {
            const m = document.getElementById('notFoundNoro');
            if (m) m.innerHTML = this.renderNoro('think', 120);
        }
        if (changed) this.emitPlayState();
        const hook = this.screenHooks && this.screenHooks[name];
        if (hook) { try { hook({ changed }); } catch (e) { console.warn('[PsikoVaka] ekran', name, e); } }

        if (changed) {
            this.libViewKey = null; // kütüphaneye her girişte görünüm yeniden kurulur
            if (name !== 'kutuphane' && this.libDefaultTitle) document.title = this.libDefaultTitle;
            window.scrollTo(0, 0);
            if (this.dom.appMain && !isPlay) {
                try { this.dom.appMain.focus({ preventScroll: true }); } catch (e) {}
            }
        }
    }

    /**
     * Modüllerin ekran kancası (ör. js/online/ligler.js -> 'ligler'). Ekran açık görünürken kayıt olursa hemen çağrılır.
     * fn({ changed }) her showScreen(name) çağrısında.
     */
    /** Vaka başladı/bitti/ekran değişti: online katmanı (davet afişi) dinler. */
    emitPlayState() {
        try { document.dispatchEvent(new CustomEvent('psikovaka:playstate')); } catch (e) {}
    }

    registerScreen(name, fn) {
        this.screenHooks = this.screenHooks || {};
        this.screenHooks[name] = fn;
        if (this.currentScreen === name) { try { fn({ changed: true }); } catch (e) { console.warn('[PsikoVaka] ekran', name, e); } }
    }

    /** Tahmin şeridinin yapışacağı yükseklik = oyun çubuğunun alt kenarı (telefonda 0'dan, masaüstünde başlığın altından). */
    updatePlayStickyOffset() {
        const scr = this.dom.screenPlay;
        const bar = scr && scr.querySelector('.play-bar');
        if (!bar) return;
        const top = parseFloat(getComputedStyle(bar).top) || 0;
        scr.style.setProperty('--play-bar-bottom', `${Math.round(top + bar.offsetHeight)}px`);
        if (!this._playBarObserved && typeof ResizeObserver === 'function') {
            this._playBarObserved = true;
            new ResizeObserver(() => this.updatePlayStickyOffset()).observe(bar);
            window.addEventListener('resize', () => this.updatePlayStickyOffset());
        }
    }

    enterPlayScreen() {
        this.updatePlayStickyOffset();
        if (this.currentScreen !== 'play') {
            this.showScreen('play');
            try {
                history.pushState({ psikovakaPlay: true }, '', window.location.href);
                this.playHistoryPushed = true;
            } catch (e) {
                this.playHistoryPushed = false;
            }
        } else {
            window.scrollTo(0, 0);
        }
    }

    leavePlayScreen() {
        this.closeAutocomplete();
        this.closeCategoryTree();
        if (this.playHistoryPushed) {
            history.back(); // popstate -> showRoute
        } else {
            this.showRoute(this.parseRouteHash() || this.currentRoute || 'oyna');
        }
    }

    // =====================================================================
    // HESAP ARAYÜZÜ (js/account.js — PsikoVakaAccount). Misafir modu kalıcı:
    // hesap katmanı yüklenemezse bu bölüm sessizce misafir görünümünde kalır.
    // =====================================================================

    initAccountUI() {
        const A = (typeof window !== 'undefined' && window.PsikoVakaAccount) ? window.PsikoVakaAccount : null;
        this.account = A;
        this.accountSnap = { state: 'guest', availability: A ? 'pending' : 'disabled', user: null, profile: null, profileError: null, remember: true, passwordMinLength: 8 };
        if (A) {
            try { this.accountSnap = Object.assign(this.accountSnap, A.snapshot(), { availability: A.availability }); } catch (e) {}
        }
        const ids = [
            'accountGuestCard', 'accountUnavailableNote', 'btnAccountSignUp', 'btnAccountSignIn', 'btnOpenPrivacy',
            'accountUsernameCard', 'btnAccountPickUsername', 'profileUsername', 'profileRpNote',
            'accountProfileError', 'accountProfileErrorText', 'btnRetryProfile', 'accountSignedInGroup', 'btnEditProfile', 'btnSignOut', 'accountEmailLabel',
            'authModal', 'authModalTitle', 'authViewForm', 'authTabSignIn', 'authTabSignUp', 'authForm', 'authEmail', 'authPassword',
            'authPasswordToggle', 'authPasswordHint', 'authForgotLink', 'authError', 'authSubmit', 'authSubmitLabel', 'authRemember',
            'authLegal', 'authPrivacyLink', 'authViewForgot', 'forgotForm', 'forgotEmail', 'forgotError', 'forgotSuccess', 'forgotSubmit', 'forgotBack',
            'authViewCheckEmail', 'checkEmailAddress', 'checkEmailExisting', 'checkEmailError', 'checkEmailSuccess', 'btnResendConfirm', 'btnResendConfirmLabel', 'checkEmailToSignIn',
            'usernameModal', 'usernameForm', 'usernameInput', 'usernameHint', 'usernameError', 'usernameSubmit', 'usernameSignOut',
            'newPasswordModal', 'newPasswordForm', 'newPasswordInput', 'newPasswordToggle', 'newPasswordHint', 'newPasswordError', 'newPasswordSubmit',
            'editProfileModal', 'editProfileAvatarMount', 'editProfileUsername', 'editProfileAvatarBtn', 'editProfileForm', 'editDisplayName', 'editProfileError', 'editProfileSave',
            'privacyModal'
        ];
        this.adom = {};
        ids.forEach(id => { this.adom[id] = document.getElementById(id); });
        this.authTab = 'signin';
        this.authEmailPending = '';
        this.cooldowns = {};
        this.profilePushTimer = null;
        this.profilePushInFlight = false;

        try { this.bindAccountUI(); } catch (e) { console.warn('Hesap arayüzü bağlanamadı:', e && e.message); }
        this.renderAccountUI();
        if (!A) return;

        // Avatar stüdyosunda yapılan değişiklik giriş yapılmışsa profiles.avatar'a da yazılır
        if (typeof this.saveMyAvatar === 'function') {
            const origSave = this.saveMyAvatar;
            this.saveMyAvatar = (...args) => {
                origSave.apply(this, args);
                this.queueProfilePush();
            };
        }

        A.onChange((snap, ev) => {
            try { this.handleAccountChange(snap, ev || { type: 'state' }); } catch (e) { console.warn('Hesap durumu işlenemedi:', e && e.message); }
        });
        try {
            const p = A.init();
            if (p && typeof p.catch === 'function') p.catch(() => {});
        } catch (e) {}
    }

    accountReady() {
        const s = this.accountSnap;
        return !!(s && s.state === 'ready' && s.profile);
    }

    handleAccountChange(snap, ev) {
        const prev = this.accountSnap || {};
        this.accountSnap = snap;

        if (snap.profile && snap.state === 'ready') this.applyServerIdentity(snap.profile);
        this.renderAccountUI();

        // Zorunlu kullanıcı adı adımı
        if (snap.state === 'signed_in_no_username' && !snap.recovery) {
            if (!this.isModalOpen(this.adom.usernameModal) && !this.isModalOpen(this.adom.newPasswordModal)) {
                this.closeModal(this.adom.authModal);
                this.openUsernameModal();
            }
        } else if (snap.state !== 'signed_in_no_username' && this.isModalOpen(this.adom.usernameModal)) {
            this.closeModal(this.adom.usernameModal);
        }

        if (ev.type === 'password_recovery') {
            this.closeModal(this.adom.authModal);
            this.closeModal(this.adom.usernameModal);
            this.openNewPasswordModal();
        }

        if (ev.type === 'redirect' && ev.result) {
            const r = ev.result;
            if (r.ok && !r.recovery) {
                if (!this.parseRouteHash() && this.currentScreen !== 'play') {
                    try { history.replaceState(null, '', window.location.pathname + window.location.search + '#/profil'); } catch (e) {}
                    this.showRoute('profil');
                }
                if (snap.state !== 'signed_in_no_username') this.showToast('Giriş yapıldı.');
            } else if (!r.ok) {
                this.showToast(r.message);
                if (r.info && snap.state === 'guest') this.openAuthSheet('signin');
            }
        }

        if (ev.type === 'import' && ev.result && ev.result.status === 'imported') {
            const n = ev.result.importedCaseCount || 0;
            this.showToast(`Bu cihazdaki ilerlemen hesabına aktarıldı (${n} çözülen vaka).`);
        }

    }

    /** Sunucu profilini (görünen ad, avatar) yerel oyun kimliğine yansıtır; eski arena bu değerleri kullanmaya devam eder. */
    applyServerIdentity(profile) {
        if (!profile || this.profilePushTimer || this.profilePushInFlight || this._avatarSaveTimer) return;
        let changed = false;
        const av = profile.avatar;
        const AV = window.PsikoVakaAvatar;
        if (AV && av && typeof av === 'object' && !AV.equals(av, this.myAvatar)) {
            this.myAvatar = AV.normalize(av);
            try { localStorage.setItem('psikovaka_funny_avatar', JSON.stringify(this.myAvatar)); } catch (e) {}
            changed = true;
        }
        if (profile.display_name && profile.display_name !== this.duelMyNickname) {
            this.duelMyNickname = profile.display_name;
            try { localStorage.setItem('psikovaka_nickname', this.duelMyNickname); } catch (e) {}
            changed = true;
        }
        if (changed && typeof this.renderHeaderProfilePill === 'function') this.renderHeaderProfilePill();
    }

    /** Yerel kimlik (avatar / görünen ad) değiştiyse, giriş yapılmışsa sunucuya kısa gecikmeyle yazar. */
    queueProfilePush() {
        if (!this.account || !this.accountReady()) return;
        const p = this.accountSnap.profile;
        const patch = this.buildProfilePatch(p);
        if (!patch) return;
        clearTimeout(this.profilePushTimer);
        this.profilePushTimer = setTimeout(() => { this.profilePushTimer = null; this.runProfilePush(); }, 1200);
    }

    /** Bekleyen profil yazımını beklemeden yapar (ör. avatar stüdyosu kapanınca; lobide herkes hemen görsün). */
    flushProfilePush() {
        if (!this.profilePushTimer) return;
        clearTimeout(this.profilePushTimer);
        this.profilePushTimer = null;
        this.runProfilePush();
    }

    async runProfilePush() {
        if (!this.accountSnap || !this.accountReady()) return;
        const latest = this.buildProfilePatch(this.accountSnap.profile);
        if (!latest) return;
        if (this.profilePushInFlight) { this.queueProfilePush(); return; }
        this.profilePushInFlight = true;
        let r;
        try { r = await this.account.saveProfile(latest); } catch (e) { r = { ok: false }; }
        this.profilePushInFlight = false;
        if (typeof this.setAvatarSaveStatus === 'function' && latest.avatar) this.setAvatarSaveStatus(r && r.ok ? 'saved' : 'error');
        if (r && r.ok) {
            // Online lobi bunu dinler: odadakilere yeni avatarı duyurur (js/online/lobby.js)
            try { window.dispatchEvent(new CustomEvent('psikovaka:profile-saved', { detail: { avatar: latest.avatar || null, displayName: latest.displayName || null } })); } catch (e) {}
        } else {
            const now = Date.now();
            if (!this.lastPushErrorAt || now - this.lastPushErrorAt > 30000) {
                this.lastPushErrorAt = now;
                this.showToast(`Profil sunucuya kaydedilemedi. ${(r && r.error && r.error.message) || ''}`.trim());
            }
        }
    }

    buildProfilePatch(p) {
        if (!p) return null;
        const patch = {};
        const a = this.myAvatar;
        const AV = window.PsikoVakaAvatar;
        if (AV && a && !AV.equals(a, p.avatar)) patch.avatar = AV.normalize(a);
        const nick = String(this.duelMyNickname || '').trim();
        if (nick && nick.length <= 30 && nick !== p.display_name) patch.displayName = nick;
        return Object.keys(patch).length ? patch : null;
    }

    isModalOpen(modal) {
        return !!(modal && modal.classList.contains('open'));
    }

    renderAccountUI() {
        const a = this.adom || {};
        const s = this.accountSnap || { state: 'guest', availability: 'disabled' };
        const show = (el, v) => { if (el) el.hidden = !v; };
        const accountsOn = s.availability !== 'disabled';
        const guest = s.state === 'guest';

        show(a.accountGuestCard, accountsOn && guest);
        let note = '';
        if (s.availability === 'unsupported') note = 'Hesaplar yalnızca sitenin çevrimiçi sürümünde çalışır. Bu dosyada misafir olarak oynamaya devam edebilirsin.';
        else if (s.availability === 'unavailable') note = 'Hesap hizmetine şu an ulaşılamıyor. Misafir olarak oynamaya devam edebilirsin.';
        if (a.accountUnavailableNote) { a.accountUnavailableNote.textContent = note; a.accountUnavailableNote.hidden = !note; }
        const blocked = s.availability === 'unsupported' || s.availability === 'unavailable';
        [a.btnAccountSignUp, a.btnAccountSignIn].forEach(b => { if (b) b.disabled = blocked; });

        show(a.accountUsernameCard, s.state === 'signed_in_no_username');
        show(a.accountSignedInGroup, !guest);
        if (a.accountEmailLabel) a.accountEmailLabel.textContent = s.user ? s.user.email : '';
        const pErr = s.state === 'ready' && !s.profile && s.profileError;
        show(a.accountProfileError, !!pErr);
        if (pErr && a.accountProfileErrorText) a.accountProfileErrorText.textContent = `Profil yüklenemedi. ${s.profileError.message || ''}`.trim();

        document.body.classList.toggle('is-signed-in', !guest);
        this.syncProfileMirrors();
    }

    bindAccountUI() {
        const a = this.adom;
        const on = (el, ev, fn) => { if (el) el.addEventListener(ev, fn); };

        on(a.btnAccountSignUp, 'click', () => this.openAuthSheet('signup'));
        on(a.btnAccountSignIn, 'click', () => this.openAuthSheet('signin'));
        on(document.getElementById('profileLeagueCta'), 'click', () => this.openAuthSheet('signup'));
        on(a.btnOpenPrivacy, 'click', () => this.openModal(a.privacyModal));
        on(a.authPrivacyLink, 'click', () => this.openModal(a.privacyModal));
        on(a.btnAccountPickUsername, 'click', () => this.openUsernameModal());
        on(a.btnRetryProfile, 'click', async () => {
            if (!this.account) return;
            a.btnRetryProfile.disabled = true;
            await this.account.refreshProfile();
            a.btnRetryProfile.disabled = false;
        });

        on(a.authTabSignIn, 'click', () => this.setAuthTab('signin'));
        on(a.authTabSignUp, 'click', () => this.setAuthTab('signup'));
        [a.authTabSignIn, a.authTabSignUp].forEach(t => on(t, 'keydown', (e) => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            e.preventDefault();
            const next = this.authTab === 'signin' ? 'signup' : 'signin';
            this.setAuthTab(next);
            (next === 'signin' ? a.authTabSignIn : a.authTabSignUp).focus();
        }));
        this.bindPasswordToggle(a.authPasswordToggle, a.authPassword);
        this.bindPasswordToggle(a.newPasswordToggle, a.newPasswordInput);
        [a.authEmail, a.authPassword].forEach(i => on(i, 'input', () => this.setFormMessage(a.authError, '')));
        on(a.authForm, 'submit', (e) => { e.preventDefault(); this.submitAuthForm(); });

        on(a.authForgotLink, 'click', () => {
            this.showAuthView('forgot');
            if (a.forgotEmail && a.authEmail) a.forgotEmail.value = a.authEmail.value.trim();
            this.setFormMessage(a.forgotError, '');
            this.setFormMessage(a.forgotSuccess, '');
            if (a.authModalTitle) a.authModalTitle.textContent = 'Şifremi unuttum';
            setTimeout(() => { try { a.forgotEmail.focus(); } catch (e) {} }, 30);
        });
        on(a.forgotBack, 'click', () => this.openAuthSheet('signin', { keepOpen: true }));
        on(a.forgotEmail, 'input', () => this.setFormMessage(a.forgotError, ''));
        on(a.forgotForm, 'submit', (e) => { e.preventDefault(); this.submitForgotForm(); });

        on(a.btnResendConfirm, 'click', () => this.resendConfirmation());
        on(a.checkEmailToSignIn, 'click', () => this.openAuthSheet('signin', { keepOpen: true }));

        on(a.usernameInput, 'input', () => {
            this.setFormMessage(a.usernameError, '');
            if (a.usernameInput) a.usernameInput.removeAttribute('aria-invalid');
        });
        on(a.usernameForm, 'submit', (e) => { e.preventDefault(); this.submitUsernameForm(); });
        on(a.usernameSignOut, 'click', () => this.signOutAccount());

        on(a.newPasswordInput, 'input', () => this.setFormMessage(a.newPasswordError, ''));
        on(a.newPasswordForm, 'submit', (e) => { e.preventDefault(); this.submitNewPassword(); });

        on(a.btnEditProfile, 'click', () => this.openEditProfile());
        on(a.editProfileAvatarBtn, 'click', () => {
            this.closeModal(a.editProfileModal);
            if (typeof this.openAvatarStudio === 'function') this.openAvatarStudio();
        });
        on(a.editDisplayName, 'input', () => this.setFormMessage(a.editProfileError, ''));
        on(a.editProfileForm, 'submit', (e) => { e.preventDefault(); this.submitEditProfile(); });

        on(a.btnSignOut, 'click', () => this.signOutAccount());
    }

    bindPasswordToggle(btn, input) {
        if (!btn || !input) return;
        btn.addEventListener('click', () => {
            const show = input.type === 'password';
            input.type = show ? 'text' : 'password';
            btn.setAttribute('aria-pressed', String(show));
            btn.setAttribute('aria-label', show ? 'Şifreyi gizle' : 'Şifreyi göster');
            btn.innerHTML = this.icon(show ? 'eye-off' : 'eye');
            try { input.focus({ preventScroll: true }); } catch (e) {}
        });
    }

    resetPasswordToggle(btn, input) {
        if (!btn || !input) return;
        input.type = 'password';
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('aria-label', 'Şifreyi göster');
        btn.innerHTML = this.icon('eye');
    }

    setBusy(btn, busy) {
        if (!btn) return;
        btn.disabled = !!busy;
        btn.classList.toggle('is-loading', !!busy);
        if (busy) btn.setAttribute('aria-busy', 'true'); else btn.removeAttribute('aria-busy');
    }

    setFormMessage(el, text) {
        if (!el) return;
        el.textContent = text || '';
        el.hidden = !text;
    }

    async waitAccountInit() {
        if (!this.account) return;
        try { await this.account.init(); } catch (e) {}
    }

    minPwHint() {
        const n = (this.accountSnap && this.accountSnap.passwordMinLength) || 8;
        return `En az ${n} karakter.`;
    }

    showAuthView(view) {
        const a = this.adom;
        if (a.authViewForm) a.authViewForm.hidden = view !== 'form';
        if (a.authViewForgot) a.authViewForgot.hidden = view !== 'forgot';
        if (a.authViewCheckEmail) a.authViewCheckEmail.hidden = view !== 'check';
        const body = a.authModal && a.authModal.querySelector('.modal-body');
        if (body) body.scrollTop = 0;
    }

    openAuthSheet(tab = 'signin', opts = {}) {
        const a = this.adom;
        if (!a || !a.authModal) return;
        if (this.dom.duelCenterModal && this.isModalOpen(this.dom.duelCenterModal)) this.closeModal(this.dom.duelCenterModal);
        this.showAuthView('form');
        this.setAuthTab(tab);
        this.setFormMessage(a.authError, '');
        if (a.authRemember && this.account && typeof this.account.getRemember === 'function') a.authRemember.checked = this.account.getRemember();
        if (a.authEmail && !a.authEmail.value && this.authEmailPending) a.authEmail.value = this.authEmailPending;
        if (!this.isModalOpen(a.authModal)) this.openModal(a.authModal);
        if (opts.keepOpen) setTimeout(() => { try { a.authEmail.focus({ preventScroll: true }); } catch (e) {} }, 30);
    }

    setAuthTab(tab) {
        const a = this.adom;
        this.authTab = tab === 'signup' ? 'signup' : 'signin';
        const isUp = this.authTab === 'signup';
        if (a.authTabSignIn) { a.authTabSignIn.classList.toggle('active', !isUp); a.authTabSignIn.setAttribute('aria-selected', String(!isUp)); a.authTabSignIn.tabIndex = isUp ? -1 : 0; }
        if (a.authTabSignUp) { a.authTabSignUp.classList.toggle('active', isUp); a.authTabSignUp.setAttribute('aria-selected', String(isUp)); a.authTabSignUp.tabIndex = isUp ? 0 : -1; }
        if (a.authModalTitle) a.authModalTitle.textContent = isUp ? 'Kayıt ol' : 'Giriş yap';
        if (a.authSubmitLabel) a.authSubmitLabel.textContent = isUp ? 'Hesap oluştur' : 'Giriş yap';
        if (a.authPassword) a.authPassword.setAttribute('autocomplete', isUp ? 'new-password' : 'current-password');
        if (a.authPasswordHint) { a.authPasswordHint.textContent = this.minPwHint(); a.authPasswordHint.hidden = !isUp; }
        if (a.authForgotLink) a.authForgotLink.hidden = isUp;
        if (a.authLegal) a.authLegal.hidden = !isUp;
        this.setFormMessage(a.authError, '');
    }

    async submitAuthForm() {
        const a = this.adom;
        const A = this.account;
        if (!A || (a.authSubmit && a.authSubmit.disabled)) return;
        const email = (a.authEmail.value || '').trim();
        const pw = a.authPassword.value || '';
        const isUp = this.authTab === 'signup';
        const e1 = A.validateEmail(email);
        if (e1) { this.setFormMessage(a.authError, e1); a.authEmail.focus(); return; }
        const e2 = isUp ? A.validatePassword(pw) : (pw ? null : 'Şifreni gir.');
        if (e2) { this.setFormMessage(a.authError, e2); a.authPassword.focus(); return; }

        this.setBusy(a.authSubmit, true);
        this.setFormMessage(a.authError, '');
        await this.waitAccountInit();
        let r;
        const remember = a.authRemember ? !!a.authRemember.checked : true;
        try { r = isUp ? await A.signUp(email, pw, { remember }) : await A.signIn(email, pw, { remember }); } catch (e) { r = { ok: false, error: A.describeError(e) }; }
        this.setBusy(a.authSubmit, false);
        this.authEmailPending = email;

        if (!r.ok) {
            if (r.error && r.error.code === 'email_not_confirmed') {
                this.showCheckEmail(email, { fromSignIn: true });
                return;
            }
            this.setFormMessage(a.authError, (r.error && r.error.message) || 'Bir şeyler ters gitti.');
            return;
        }
        a.authPassword.value = '';
        this.resetPasswordToggle(a.authPasswordToggle, a.authPassword);
        if (isUp && r.needsConfirmation) {
            this.showCheckEmail(email, { maybeExisting: r.maybeExisting, justSent: true });
            return;
        }
        this.closeModal(a.authModal);
        if (this.accountSnap.state !== 'signed_in_no_username') this.showToast('Giriş yapıldı.');
    }

    showCheckEmail(email, opts = {}) {
        const a = this.adom;
        this.showAuthView('check');
        if (a.authModalTitle) a.authModalTitle.textContent = opts.fromSignIn ? 'E-posta onayı gerekli' : 'Kayıt ol';
        if (a.checkEmailAddress) a.checkEmailAddress.textContent = email;
        if (a.checkEmailExisting) a.checkEmailExisting.hidden = !opts.maybeExisting;
        this.setFormMessage(a.checkEmailError, opts.fromSignIn ? 'E-postanı henüz onaylamadın. Gelen kutundaki bağlantıya tıkla ya da yeni bağlantı iste.' : '');
        this.setFormMessage(a.checkEmailSuccess, '');
        if (opts.justSent) this.startCooldown('resend', 60, a.btnResendConfirm, a.btnResendConfirmLabel, 'Tekrar gönder');
        else this.refreshCooldown('resend', a.btnResendConfirm, a.btnResendConfirmLabel, 'Tekrar gönder');
    }

    async resendConfirmation() {
        const a = this.adom;
        if (!this.account || this.cooldownLeft('resend') > 0) return;
        const email = (a.checkEmailAddress && a.checkEmailAddress.textContent) || this.authEmailPending;
        this.setBusy(a.btnResendConfirm, true);
        this.setFormMessage(a.checkEmailError, '');
        this.setFormMessage(a.checkEmailSuccess, '');
        await this.waitAccountInit();
        const r = await this.account.resendConfirmation(email);
        this.setBusy(a.btnResendConfirm, false);
        if (r.ok) {
            this.setFormMessage(a.checkEmailSuccess, 'Yeni bağlantı gönderildi.');
            this.startCooldown('resend', 60, a.btnResendConfirm, a.btnResendConfirmLabel, 'Tekrar gönder');
        } else {
            this.setFormMessage(a.checkEmailError, r.error.message);
            if (r.error.code === 'over_email_send_rate_limit' || r.error.code === 'over_request_rate_limit') {
                this.startCooldown('resend', 60, a.btnResendConfirm, a.btnResendConfirmLabel, 'Tekrar gönder');
            }
        }
    }

    cooldownLeft(key) {
        const until = this.cooldowns[key] ? this.cooldowns[key].until : 0;
        return Math.max(0, Math.ceil((until - Date.now()) / 1000));
    }

    startCooldown(key, seconds, btn, labelEl, label) {
        const prev = this.cooldowns[key];
        if (prev && prev.timer) clearInterval(prev.timer);
        this.cooldowns[key] = { until: Date.now() + seconds * 1000, timer: null };
        this.refreshCooldown(key, btn, labelEl, label);
    }

    refreshCooldown(key, btn, labelEl, label) {
        const c = this.cooldowns[key];
        const tick = () => {
            const left = this.cooldownLeft(key);
            if (labelEl) labelEl.textContent = left > 0 ? `${label} (${left} sn)` : label;
            if (btn && !btn.classList.contains('is-loading')) btn.disabled = left > 0;
            if (left <= 0 && c && c.timer) { clearInterval(c.timer); c.timer = null; }
        };
        tick();
        if (c && !c.timer && this.cooldownLeft(key) > 0) c.timer = setInterval(tick, 1000);
    }

    async submitForgotForm() {
        const a = this.adom;
        const A = this.account;
        if (!A || this.cooldownLeft('forgot') > 0) return;
        const email = (a.forgotEmail.value || '').trim();
        const e1 = A.validateEmail(email);
        if (e1) { this.setFormMessage(a.forgotError, e1); a.forgotEmail.focus(); return; }
        this.setBusy(a.forgotSubmit, true);
        this.setFormMessage(a.forgotError, '');
        this.setFormMessage(a.forgotSuccess, '');
        await this.waitAccountInit();
        const r = await A.sendPasswordReset(email);
        this.setBusy(a.forgotSubmit, false);
        if (r.ok) {
            this.authEmailPending = email;
            this.setFormMessage(a.forgotSuccess, 'Bu adresle bir hesap varsa şifre yenileme bağlantısı gönderildi. E-postanı kontrol et.');
            this.startCooldown('forgot', 60, a.forgotSubmit, a.forgotSubmit.querySelector('span:last-child'), 'Bağlantı gönder');
        } else {
            this.setFormMessage(a.forgotError, r.error.message);
        }
    }

    openUsernameModal() {
        const a = this.adom;
        if (!a.usernameModal) return;
        this.setFormMessage(a.usernameError, '');
        if (a.usernameInput && !a.usernameInput.value) {
            // Öneri: yerel takma addan kurala uyan bir taslak
            const base = String(this.duelMyNickname || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
                .replace(/ı/g, 'i').replace(/İ/g, 'I').replace(/[^A-Za-z0-9_]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 20);
            if (base.length >= 3 && base.toLowerCase() !== 'klinisyen') a.usernameInput.value = base;
        }
        this.openModal(a.usernameModal);
        setTimeout(() => { try { a.usernameInput.focus({ preventScroll: true }); } catch (e) {} }, 40);
    }

    async submitUsernameForm() {
        const a = this.adom;
        const A = this.account;
        if (!A || a.usernameSubmit.disabled) return;
        const name = (a.usernameInput.value || '').trim();
        const err = A.validateUsername(name);
        if (err) {
            this.setFormMessage(a.usernameError, err);
            a.usernameInput.setAttribute('aria-invalid', 'true');
            a.usernameInput.focus();
            return;
        }
        this.setBusy(a.usernameSubmit, true);
        const r = await A.setUsername(name);
        this.setBusy(a.usernameSubmit, false);
        if (!r.ok) {
            this.setFormMessage(a.usernameError, r.error.message);
            a.usernameInput.setAttribute('aria-invalid', 'true');
            a.usernameInput.focus();
            return;
        }
        this.closeModal(a.usernameModal);
        this.showToast(`Hoş geldin, @${r.profile ? r.profile.username : name}.`);
    }

    openNewPasswordModal() {
        const a = this.adom;
        if (!a.newPasswordModal) return;
        if (a.newPasswordInput) a.newPasswordInput.value = '';
        this.resetPasswordToggle(a.newPasswordToggle, a.newPasswordInput);
        if (a.newPasswordHint) a.newPasswordHint.textContent = this.minPwHint();
        this.setFormMessage(a.newPasswordError, '');
        this.openModal(a.newPasswordModal);
        setTimeout(() => { try { a.newPasswordInput.focus({ preventScroll: true }); } catch (e) {} }, 40);
    }

    async submitNewPassword() {
        const a = this.adom;
        const A = this.account;
        if (!A || a.newPasswordSubmit.disabled) return;
        const pw = a.newPasswordInput.value || '';
        const err = A.validatePassword(pw);
        if (err) { this.setFormMessage(a.newPasswordError, err); a.newPasswordInput.focus(); return; }
        this.setBusy(a.newPasswordSubmit, true);
        const r = await A.updatePassword(pw);
        this.setBusy(a.newPasswordSubmit, false);
        if (!r.ok) { this.setFormMessage(a.newPasswordError, r.error.message); return; }
        a.newPasswordInput.value = '';
        this.closeModal(a.newPasswordModal);
        this.showToast('Şifren güncellendi.');
        if (this.accountSnap.state === 'signed_in_no_username') this.openUsernameModal();
    }

    openEditProfile() {
        const a = this.adom;
        const p = this.accountSnap && this.accountSnap.profile;
        if (!a.editProfileModal || !p) return;
        if (a.editDisplayName) a.editDisplayName.value = p.display_name || '';
        if (a.editProfileUsername) a.editProfileUsername.textContent = p.username ? `@${p.username}` : '';
        if (a.editProfileAvatarMount && typeof renderFunnyAvatarSVG === 'function' && this.myAvatar) {
            a.editProfileAvatarMount.innerHTML = renderFunnyAvatarSVG(this.myAvatar, 56);
        }
        this.setFormMessage(a.editProfileError, '');
        this.openModal(a.editProfileModal);
    }

    async submitEditProfile() {
        const a = this.adom;
        const A = this.account;
        if (!A || a.editProfileSave.disabled) return;
        const name = (a.editDisplayName.value || '').trim();
        const err = A.validateDisplayName(name);
        if (err) { this.setFormMessage(a.editProfileError, err); a.editDisplayName.focus(); return; }
        this.setBusy(a.editProfileSave, true);
        const r = await A.saveProfile({ displayName: name });
        this.setBusy(a.editProfileSave, false);
        if (!r.ok) { this.setFormMessage(a.editProfileError, r.error.message); return; }
        this.closeModal(a.editProfileModal);
        this.showToast('Profil kaydedildi.');
    }

    async signOutAccount() {
        if (!this.account) return;
        clearTimeout(this.profilePushTimer);
        this.profilePushTimer = null;
        await this.account.signOut();
        this.closeModal(this.adom.usernameModal);
        this.closeModal(this.adom.editProfileModal);
        this.showToast('Çıkış yapıldı. Misafir olarak devam ediyorsun.');
    }

    installProfileMirrors() {
        if (typeof this.renderHeaderProfilePill === 'function') {
            const orig = this.renderHeaderProfilePill;
            this.renderHeaderProfilePill = (...args) => {
                orig.apply(this, args);
                this.syncProfileMirrors();
            };
        }
        this.syncProfileMirrors();
    }

    syncProfileMirrors() {
        // Giriş yapılmış ve profil okunmuşsa ad/RP sunucudan; değilse bu cihazdaki (misafir) değerler
        const acct = (this.accountSnap && this.accountSnap.state === 'ready' && this.accountSnap.profile) ? this.accountSnap.profile : null;
        const name = acct ? (acct.display_name || acct.username) : (this.duelMyNickname || 'Klinisyen');
        const chipName = acct && acct.username ? acct.username : name;
        const localRp = (typeof this.myRankedPoints === 'number') ? this.myRankedPoints : null;
        const rp = acct ? acct.ranked_points : localRp;
        const hasAvatar = typeof renderFunnyAvatarSVG === 'function' && this.myAvatar;
        const LG = window.PsikoVakaLeagues;
        const hasRp = rp !== null && rp !== undefined;
        const tier = (LG && hasRp) ? LG.tierFor(rp) : null;

        if (this.dom.navNameMount) this.dom.navNameMount.textContent = chipName;
        if (this.dom.homeGreetingName) this.dom.homeGreetingName.textContent = name;
        // RP yalnızca online maçlardan gelir: misafirde RP hapı ve "0 RP" gösterilmez (H5)
        if (this.dom.homeRpMount) {
            this.dom.homeRpMount.textContent = (acct && hasRp) ? `${rp} Elo` : '';
            this.dom.homeRpMount.hidden = !(acct && hasRp);
        }
        const leagueLink = document.getElementById('profileLeagueLink');
        if (leagueLink) leagueLink.hidden = !acct;
        const leagueCta = document.getElementById('profileLeagueCta');
        if (leagueCta) {
            const snap = this.accountSnap || {};
            const canSignUp = snap.availability === 'ready' || snap.availability === 'pending';
            leagueCta.hidden = !!acct || !canSignUp || snap.state !== 'guest';
        }
        if (hasAvatar) {
            if (this.dom.navAvatarMount) this.dom.navAvatarMount.innerHTML = renderFunnyAvatarSVG(this.myAvatar, 28);
            // Ana sayfa masasındaki Nöro: büyük, çerçevesiz, hareketli (boyutu CSS verir: 88/112/168 px). Aynı avatar
            // yeniden çizilmez (animasyon her profil güncellemesinde baştan başlamasın).
            const hm = this.dom.homeAvatarMount;
            if (hm) {
                const sig = JSON.stringify(this.myAvatar);
                if (hm.dataset.sig !== sig || !hm.firstChild) {
                    hm.innerHTML = renderFunnyAvatarSVG(this.myAvatar, 168, { animated: true, framed: false });
                    hm.dataset.sig = sig;
                }
            }
            const profileAvatar = document.getElementById('headerFunnyAvatarMount');
            if (profileAvatar) profileAvatar.innerHTML = renderFunnyAvatarSVG(this.myAvatar, 64);
        }
        if (typeof this.updateNoroNudge === 'function') this.updateNoroNudge();
        const nameMount = document.getElementById('headerPlayerNameMount');
        if (nameMount) nameMount.textContent = name;
        const rpMount = document.getElementById('headerPlayerRpMount');
        if (rpMount && acct && hasRp) {
            rpMount.textContent = `${rp} Elo`;
            rpMount.style.color = '';
        }
        if (this.dom.profileTierLabel) this.dom.profileTierLabel.textContent = (acct && tier) ? tier.name : '';
        const tierBadge = document.getElementById('profileTierBadge');
        if (tierBadge) tierBadge.innerHTML = (acct && tier) ? LG.badge(rp, 22) : '';
        const tierProg = document.getElementById('profileTierProgress');
        if (tierProg) { tierProg.textContent = (acct && tier) ? LG.progressText(rp) : ''; tierProg.hidden = !acct; }
        const chip = this.dom.navProfileChip || document.getElementById('navProfileChip');
        if (chip) chip.setAttribute('aria-label', acct ? `Profil: @${acct.username}` : 'Profil');

        const a = this.adom || {};
        if (a.profileUsername) {
            a.profileUsername.hidden = !(acct && acct.username);
            a.profileUsername.textContent = acct && acct.username ? `@${acct.username}` : '';
        }
        if (a.profileRpNote) {
            const differs = !!(acct && localRp !== null && localRp !== acct.ranked_points);
            a.profileRpNote.hidden = !differs;
            if (differs) a.profileRpNote.textContent = `Elo (sıralama puanı) sunucuda tutulur; bu cihazdaki ${localRp} Elo aktarılmaz.`;
        }
    }

    /** İlk ziyaret kartı: yalnızca hiç oynamamış ve kartı geçmemiş kişide; dönen kullanıcıyı asla bekletmez. */
    updateWelcomeCard() {
        const card = document.getElementById('homeWelcome');
        if (!card) return;
        let flag = false;
        try { flag = localStorage.getItem('psikovaka_onboarded') === '1'; } catch (e) { flag = true; }
        const hasHistory = (this.stats && this.stats.played > 0) || (this.solvedCaseIds && this.solvedCaseIds.size > 0);
        if (!flag && hasHistory) { this.markOnboarded(); flag = true; }
        card.hidden = flag;
        if (!flag) {
            const m = document.getElementById('welcomeNoro');
            if (m && !m.firstChild) m.innerHTML = this.renderNoro('wave', 96);
        }
        if (typeof this.updateNoroNudge === 'function') this.updateNoroNudge();
    }

    markOnboarded() {
        try { localStorage.setItem('psikovaka_onboarded', '1'); } catch (e) {}
        const card = document.getElementById('homeWelcome');
        if (card) card.hidden = true;
        if (typeof this.updateNoroNudge === 'function') this.updateNoroNudge();
    }

    /** "İlk vakayı oyna": elle seçilmiş kolay bir vaka (tipik majör depresyon), tanı hedefiyle. */
    startFirstCase() {
        this.markOnboarded();
        const easy = this.cases.find(c => c.diagnosisId === 'mdd' && /kolay/i.test(String(c.difficulty)))
            || this.cases.find(c => /kolay/i.test(String(c.difficulty)))
            || this.cases[0];
        if (!easy) { this.setMode('practice'); return; }
        if (this.targetGameMode !== 'diagnosis') this.setTargetGameMode('diagnosis', false);
        this.currentMode = 'practice';
        this.startCase(easy, `Pratik · Vaka #${easy.caseNumber || 1}`);
    }

    updateProfileScreen() {
        this.syncProfileMirrors();
        const s = this.stats || { played: 0, won: 0, currentStreak: 0 };
        const winRate = s.played > 0 ? Math.round((s.won / s.played) * 100) : 0;
        if (this.dom.profileStatPlayed) this.dom.profileStatPlayed.textContent = s.played;
        if (this.dom.profileStatWin) this.dom.profileStatWin.textContent = `%${winRate}`;
        if (this.dom.profileStatStreak) this.dom.profileStatStreak.textContent = s.currentStreak;
        if (this.dom.profileArchiveCount) this.dom.profileArchiveCount.textContent = `${this.solvedCaseIds.size} vaka`;
        if (this.dom.profilePackLabel && this.dom.quickPackLabel) this.dom.profilePackLabel.textContent = this.dom.quickPackLabel.textContent;
    }

    updateHomeMeta() {
        if (this.dom.dailyDateLabel) {
            try {
                // Klasör sekmesi: "21 Kasım" + gün adı (dar telefonda gün adı gizlenir ki sekme Nöro'nun altına girmesin)
                const now = new Date();
                const dm = now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
                const wd = now.toLocaleDateString('tr-TR', { weekday: 'long' });
                this.dom.dailyDateLabel.innerHTML = `${this.libEsc(dm)}<span class="desk-date-wd"> ${this.libEsc(wd)}</span>`;
            } catch (e) {
                this.dom.dailyDateLabel.textContent = this.getDailySeed();
            }
        }
        // Danışan özeti: js/online/daily.js varsa o çizer (sunucunun vakasıyla); yoksa yerel günün vakası
        if (!(window.PsikoVakaOnline && window.PsikoVakaOnline.daily)) this.setDailyTeaser(this.getLocalDailyCase());
        if (this.dom.homeResume) {
            // Bitmiş (başka sekmede bitirilmiş ya da günü geçmiş) günlük "devam et" olarak sunulmaz
            const staleDaily = this.currentMode === 'daily' && this.dailyContext && (this.isDailyContextFinished() || this.dailyContext.day !== this.getDailyDay());
            const canResume = !!(this.currentCase && !this.isGameOver && this.caseTargetMode === this.targetGameMode && !staleDaily);
            this.dom.homeResume.hidden = !canResume;
            if (canResume && this.dom.homeResumeLabel) this.dom.homeResumeLabel.textContent = this.currentDisplayTitle || 'Vaka';
        }
        const setCount = (el, txt) => { if (el) el.textContent = txt; };
        setCount(this.dom.libDsmCount, String(this.diagnoses.length));
        setCount(this.dom.libTherapyCount, String(this.therapies.length));
        setCount(this.dom.libPharmaCount, String(this.pharmacology.length));
    }

    updateTargetHint() {
        const hints = {
            diagnosis: 'Vakadaki danışanın DSM-5-TR tanısını bul.',
            therapy: 'Vaka için kanıta dayalı ilk tercih psikoterapiyi bul.',
            pharmacology: 'Birinci basamak ilacı ya da biyolojik müdahaleyi bul.',
            combo: 'Sırayla tanı, terapi ve ilaç. Her aşamada 6 hak.'
        };
        if (this.dom.targetModeHint) this.dom.targetModeHint.textContent = hints[this.targetGameMode] || hints.diagnosis;
    }

    updatePracticeSummary() {
        if (!this.dom.practiceSummary) return;
        const parts = [];
        const packLabel = this.dom.quickPackLabel ? this.dom.quickPackLabel.textContent : 'Tüm vakalar';
        parts.push(packLabel);
        if (this.activeCourseFilter && this.activeCourseFilter !== 'ALL') {
            const course = Object.values(this.courses).find(c => c.id === this.activeCourseFilter);
            if (course) parts.push(course.name);
        }
        if (this.activeCategoryFilter && this.activeCategoryFilter !== 'ALL') {
            const cat = this.categories[this.activeCategoryFilter];
            if (cat) parts.push(cat.name);
        }
        if (this.onlyUnsolvedMode) parts.push('sadece çözülmemişler');
        const Z = window.PsikoVakaZorluk;
        if (Z && Z.any(this.practiceZorluk)) parts.push('Zor: ' + Z.names(this.practiceZorluk).join(' + ').toLocaleLowerCase('tr'));
        this.dom.practiceSummary.textContent = parts.join(' · ');
    }

    openPracticeSettings() {
        this.renderCourseFilters();
        this.renderCategoryFilters();
        this.updateUnsolvedUI();
        this.openModal(this.dom.practiceSettingsModal);
    }

    openArchiveModal() {
        this.renderSolvedArchiveList();
        this.openModal(this.dom.archiveModal);
    }

    getFallbackPharmacologyId(c) {
        if (typeof resolvePharmacologyIdForCase === 'function') {
            return resolvePharmacologyIdForCase(c);
        }
        const diagId = c.diagnosisId || '';
        const cat = c.category || '';
        if (diagId === 'major_neurocognitive_huntington') return 'valbenazine_vmat2';
        if (diagId === 'catatonia_associated' || diagId === 'catatonia_medical') return 'lorazepam_catatonia';
        if (diagId === 'wernicke_korsakoff_syndrome') return 'thiamine_iv_wernicke';
        if (diagId === 'narcolepsy') return 'modafinil_oxybate';
        if (diagId === 'rem_sleep_behavior_disorder' || diagId === 'nrem_sleep_arousal') return 'clonazepam_parasomnia';
        if (diagId === 'restless_legs_syndrome') return 'pramipexole_gabapentin_rls';
        if (diagId === 'enuresis') return 'desmopressin_enuresis';
        if (diagId === 'bipolar_2' || diagId === 'hallucinogen_persisting_perception') return 'lamotrigine_bipolar2';
        if (cat === 'BIPOLAR') return 'lithium_gold';
        if (cat === 'PSYCHOTIC') return 'atypical_ap_secondgen';
        if (cat === 'NEUROCOGNITIVE') return 'cholinesterase_donepezil';
        if (cat === 'SUBSTANCE') return 'naltrexone_acamprosate';
        if (cat === 'NEURODEV') {
            if (diagId.includes('adhd')) return 'methylphenidate_stimulant';
            if (diagId.includes('tic') || diagId.includes('tourette')) return 'alpha2_agonist_tic';
            return 'psychotherapy_first_no_drug';
        }
        if (cat === 'PERSONALITY_A' || cat === 'PERSONALITY_B' || cat === 'PERSONALITY_C' || cat === 'DISSOCIATIVE') {
            return 'psychotherapy_first_no_drug';
        }
        return 'ssri_firstline';
    }

    getBuiltInPacksDefinition() {
        // Paketler caseNumber aralığına göre tanımlanır (arşivlenen numaralar boşluk bırakır, sorun değil).
        // Tanımlı son aralığın üstündeki (veya numarası olmayan) vakalar otomatik "Yeni vakalar" paketine girer.
        // Sayılar her zaman gerçek vaka listesinden hesaplanır; boş kalan paket gizlenir.
        const ranges = [
            { id: 'pack1', title: 'Paket 1: Çekirdek Vakalar', from: 1, to: 29,
              desc: 'Duygudurum, anksiyete, psikotik, OKB, kişilik ve yeme bozukluklarının klasik tabloları.' },
            { id: 'pack2', title: 'Paket 2: Klinik Derinlik', from: 30, to: 49,
              desc: 'Kişilik, travma, dissosiyatif, yeme, nörogelişimsel ve dürtü kontrol vakaları.' },
            { id: 'pack3', title: 'Paket 3: İleri Ayırıcı Tanı', from: 50, to: 69,
              desc: 'Psikotik, bipolar, OKB ile ilişkili, anksiyete ve dürtü kontrol vakalarında ayırıcı tanı.' },
            { id: 'pack4', title: 'Paket 4: Özel Sendromlar', from: 70, to: 89,
              desc: 'Parafilik, uyku-uyanıklık, cinsel işlev ve nörobilişsel bozukluk vakaları.' },
            { id: 'pack5', title: 'Paket 5: Nöropsikiyatri', from: 90, to: 109,
              desc: 'Uyku, nörobilişsel, nörogelişimsel ve parafilik bozukluk vakaları; psikotik ve duygudurum tabloları.' },
            { id: 'pack6', title: 'Paket 6: Master Klinik & İlaç', from: 110, to: 150,
              desc: 'Psikotik, duygudurum, anksiyete, OKB, yeme, dışa atım, uyku ve nörobilişsel bozukluk vakaları.' }
        ];
        const lastTo = ranges[ranges.length - 1].to;
        const numOf = (c) => {
            const n = Number(c && c.caseNumber);
            return Number.isFinite(n) ? n : NaN;
        };
        const total = this.allMasterCases.length;
        const defs = ranges.map(r => ({
            id: r.id,
            title: r.title,
            desc: `${r.desc} (No. ${r.from}–${r.to})`,
            filterFn: (c) => { const n = numOf(c); return n >= r.from && n <= r.to; }
        }));
        defs.push({
            id: 'pack_yeni',
            title: 'Yeni Vakalar',
            desc: `Sonradan eklenen vakalar (No. ${lastTo + 1} ve üstü).`,
            filterFn: (c) => { const n = numOf(c); return !(n <= lastTo); }
        });

        const visible = [];
        defs.forEach(d => {
            const count = this.allMasterCases.filter(d.filterFn).length;
            if (count > 0) visible.push({ ...d, count, badge: `${count} vaka` });
        });

        return [
            {
                id: 'all',
                title: `Tüm Vakalar (Tam Koleksiyon)`,
                badge: `${total} vaka`,
                count: total,
                desc: 'Sistemdeki tüm DSM-5-TR klinik vakalarının eksiksiz tam havuzu.',
                filterFn: () => true
            },
            ...visible.reverse()
        ];
    }

    loadSavedCustomPacks() {
        try {
            const raw = localStorage.getItem('psikovaka_saved_packs');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch (e) {}
        return [];
    }

    saveCustomPacksToStorage() {
        localStorage.setItem('psikovaka_saved_packs', JSON.stringify(this.savedCustomPacks));
    }

    loadSolvedCaseIds() {
        try {
            const raw = localStorage.getItem('psikovaka_solved_cases');
            if (raw) {
                const arr = JSON.parse(raw);
                if (Array.isArray(arr)) return new Set(arr);
            }
        } catch (e) {}
        return new Set();
    }

    markCaseAsSolved(caseId) {
        if (!caseId) return;
        this.solvedCaseIds.add(caseId);
        localStorage.setItem('psikovaka_solved_cases', JSON.stringify([...this.solvedCaseIds]));
        this.updateUnsolvedUI();
    }

    resetSolvedCases() {
        this.solvedCaseIds.clear();
        localStorage.removeItem('psikovaka_solved_cases');
        this.updateUnsolvedUI();
        this.renderPackShelf();
        this.showToast('Çözülen vaka geçmişi sıfırlandı.');
    }

    applyActivePack(packId, launchPracticeCase = true) {
        // Kayıtlı paket kimliği artık yoksa (veya paket boşaldıysa) sessizce "Tüm Vakalar"a dön.
        const hasDiag = (c) => !!c && this.diagnoses.some(d => d.id === c.diagnosisId);
        const builtIn = this.getBuiltInPacksDefinition().find(p => p.id === packId);
        const customPack = this.savedCustomPacks.find(p => p.id === packId);
        const customCases = (customPack && Array.isArray(customPack.cases)) ? customPack.cases.filter(hasDiag) : [];

        let packTitle = 'Tüm Vakalar';
        if (builtIn) {
            this.activePackId = builtIn.id;
            this.cases = this.allMasterCases.filter(builtIn.filterFn);
            packTitle = `${builtIn.title.replace(/^[^\wÇĞİÖŞÜçğıöşü]+\s*/, '').replace(/\s*\(.*\)\s*$/, '')} (${this.cases.length})`;
        } else if (customPack && customCases.length > 0) {
            this.activePackId = customPack.id;
            this.cases = customCases.map(c => ({
                ...c,
                pharmacologyId: c.pharmacologyId || this.getFallbackPharmacologyId(c)
            }));
            packTitle = `${customPack.name} (${this.cases.length})`;
        } else {
            this.activePackId = 'all';
            this.cases = [...this.allMasterCases];
            packTitle = `Tüm Vakalar (${this.cases.length})`;
        }
        localStorage.setItem('psikovaka_active_pack_id', this.activePackId);

        if (this.dom && this.dom.quickPackLabel) {
            this.dom.quickPackLabel.textContent = packTitle;
        }

        this.updateUnsolvedUI();
        this.renderPackShelf();
        this.updatePracticeSummary();
        if (this.dom && this.dom.profilePackLabel) this.dom.profilePackLabel.textContent = packTitle;

        if (launchPracticeCase) {
            this.setMode('practice');
        }
    }

    updateUnsolvedUI() {
        if (!this.dom) return;
        const unsolvedInPack = this.cases.filter(c => !this.solvedCaseIds.has(c.id)).length;
        if (this.dom.unsolvedCountBadge) {
            this.dom.unsolvedCountBadge.textContent = unsolvedInPack;
        }
        if (this.dom.btnToggleUnsolved) {
            this.dom.btnToggleUnsolved.classList.toggle('active', this.onlyUnsolvedMode);
            this.dom.btnToggleUnsolved.setAttribute('aria-checked', String(this.onlyUnsolvedMode));
        }
    }

    initDOM() {
        this.dom = {
            themeToggleBtn: document.getElementById('themeToggleBtn'),
            statsBtn: document.getElementById('statsBtn'),
            helpBtn: document.getElementById('helpBtn'),
            caseStudioBtn: document.getElementById('caseStudioBtn'),
            caseManagerBtn: document.getElementById('caseManagerBtn'),
            duelCenterBtn: document.getElementById('duelCenterBtn'),

            // Target Game Mode Switcher (4 Modes)
            btnModeDiagnosis: document.getElementById('btnModeDiagnosis'),
            btnModeTherapy: document.getElementById('btnModeTherapy'),
            btnModePharmacology: document.getElementById('btnModePharmacology'),
            btnModeCombo: document.getElementById('btnModeCombo'),

            btnToggleUnsolved: document.getElementById('btnToggleUnsolved'),
            unsolvedCountBadge: document.getElementById('unsolvedCountBadge'),
            btnQuickPackIndicator: document.getElementById('btnQuickPackIndicator'),
            quickPackLabel: document.getElementById('quickPackLabel'),
            filterBar: document.getElementById('filterBar'),
            courseNav: document.getElementById('courseNav'),

            // Duel HUD & Combo Stepper
            duelHudBanner: document.getElementById('duelHudBanner'),
            duelMyName: document.getElementById('duelMyName'),
            duelMyScoreBadge: document.getElementById('duelMyScoreBadge'),
            duelOpponentName: document.getElementById('duelOpponentName'),
            duelOpponentStatus: document.getElementById('duelOpponentStatus'),
            duelTimerText: document.getElementById('duelTimerText'),
            btnExitDuel: document.getElementById('btnExitDuel'),
            comboStepperBar: document.getElementById('comboStepperBar'),
            comboStep1: document.getElementById('comboStep1'),
            comboStep2: document.getElementById('comboStep2'),
            comboStep3: document.getElementById('comboStep3'),
            comboStep1Val: document.getElementById('comboStep1Val'),
            comboStep2Val: document.getElementById('comboStep2Val'),
            comboStep3Val: document.getElementById('comboStep3Val'),

            // Patient Chart
            patientId: document.getElementById('patientId'),
            difficultyBadge: document.getElementById('difficultyBadge'),
            modeBadge: document.getElementById('modeBadge'),
            btnQuickChallengeCase: document.getElementById('btnQuickChallengeCase'),
            patientSummaryText: document.getElementById('patientSummaryText'),
            caseSolvedStatusBadge: document.getElementById('caseSolvedStatusBadge'),
            clueProgressTracker: document.getElementById('clueProgressTracker'),
            cluesContainer: document.getElementById('cluesContainer'),
            guessesFeed: document.getElementById('guessesFeed'),
            guessStrip: document.getElementById('guessStrip'),

            // Input & Autocomplete
            diagnosisInput: document.getElementById('diagnosisInput'),
            btnSubmit: document.getElementById('btnSubmit'),
            btnSubmitLabel: document.getElementById('btnSubmitLabel'),
            autocompleteDropdown: document.getElementById('autocompleteDropdown'),
            remainingGuessesText: document.getElementById('remainingGuessesText'),
            guessDots: document.getElementById('guessDots'),
            btnGiveUp: document.getElementById('btnGiveUp'),
            btnNextClue: document.getElementById('btnNextClue'),
            playZorBadge: document.getElementById('playZorBadge'),
            playZorlukPanel: document.getElementById('playZorlukPanel'),
            playResultZor: document.getElementById('playResultZor'),
            practiceZorlukMount: document.getElementById('practiceZorlukMount'),
            mainInputSection: document.getElementById('mainInputSection'),
            finishedActions: document.getElementById('finishedActions'),
            btnMainNextCase: document.getElementById('btnMainNextCase'),
            btnMainShowReport: document.getElementById('btnMainShowReport'),
            btnMainDuelShare: document.getElementById('btnMainDuelShare'),

            // Category & Diagnosis Tree Browser
            btnCategoryBrowser: document.getElementById('btnCategoryBrowser'),
            categoryTreePanel: document.getElementById('categoryTreePanel'),
            categoryBrowserWrapper: document.getElementById('categoryBrowserWrapper'),
            categoryBrowserIcon: document.getElementById('categoryBrowserIcon'),
            categoryBrowserLabel: document.getElementById('categoryBrowserLabel'),
            treePanelTitle: document.getElementById('treePanelTitle'),
            btnCloseCategoryTree: document.getElementById('btnCloseCategoryTree'),
            categoryTreeSearchInput: document.getElementById('categoryTreeSearchInput'),
            categoryTreeContent: document.getElementById('categoryTreeContent'),

            // Modals
            resultModal: document.getElementById('resultModal'),
            statsModal: document.getElementById('statsModal'),
            helpModal: document.getElementById('helpModal'),
            caseStudioModal: document.getElementById('caseStudioModal'),
            caseManagerModal: document.getElementById('caseManagerModal'),
            duelCenterModal: document.getElementById('duelCenterModal'),
            dsmCriteriaDetailModal: document.getElementById('dsmCriteriaDetailModal'),

            toastContainer: document.getElementById('toastContainer'),

            // Yeni arayüz: ekranlar, ana sayfa, profil, pratik ayarları
            appMain: document.getElementById('appMain'),
            screenHome: document.getElementById('screenHome'),
            screenOnline: document.getElementById('screenOnline'),
            screenLibrary: document.getElementById('screenLibrary'),
            screenProfile: document.getElementById('screenProfile'),
            screenPlay: document.getElementById('screenPlay'),
            navAvatarMount: document.getElementById('navAvatarMount'),
            navNameMount: document.getElementById('navNameMount'),
            homeAvatarMount: document.getElementById('homeAvatarMount'),
            homeGreetingName: document.getElementById('homeGreetingName'),
            homeRpMount: document.getElementById('homeRpMount'),
            homeResume: document.getElementById('homeResume'),
            homeResumeLabel: document.getElementById('homeResumeLabel'),
            btnResumeCase: document.getElementById('btnResumeCase'),
            targetModeHint: document.getElementById('targetModeHint'),
            dailyDateLabel: document.getElementById('dailyDateLabel'),
            btnStartDaily: document.getElementById('btnStartDaily'),
            btnStartPractice: document.getElementById('btnStartPractice'),
            btnOpenPracticeSettings: document.getElementById('btnOpenPracticeSettings'),
            practiceSummary: document.getElementById('practiceSummary'),
            practiceSettingsModal: document.getElementById('practiceSettingsModal'),
            btnPracticeSheetStart: document.getElementById('btnPracticeSheetStart'),
            btnResetPracticeFilters: document.getElementById('btnResetPracticeFilters'),
            libDsmCount: document.getElementById('libDsmCount'),
            libTherapyCount: document.getElementById('libTherapyCount'),
            libPharmaCount: document.getElementById('libPharmaCount'),
            libHome: document.getElementById('libHome'),
            libDetail: document.getElementById('libDetail'),
            libraryTitle: document.getElementById('libraryTitle'),
            libSearchInput: document.getElementById('libSearchInput'),
            libSearchStatus: document.getElementById('libSearchStatus'),
            libListTani: document.getElementById('libListTani'),
            libListTerapi: document.getElementById('libListTerapi'),
            libListIlac: document.getElementById('libListIlac'),
            libEmpty: document.getElementById('libEmpty'),
            playResultLinks: document.getElementById('playResultLinks'),
            playResultTakeaway: document.getElementById('playResultTakeaway'),
            resultExplainBox: document.getElementById('resultExplainBox'),
            resultLibraryLinks: document.getElementById('resultLibraryLinks'),
            profileTierLabel: document.getElementById('profileTierLabel'),
            profileStatPlayed: document.getElementById('profileStatPlayed'),
            profileStatWin: document.getElementById('profileStatWin'),
            profileStatStreak: document.getElementById('profileStatStreak'),
            profileArchiveCount: document.getElementById('profileArchiveCount'),
            profilePackLabel: document.getElementById('profilePackLabel'),
            btnOpenArchive: document.getElementById('btnOpenArchive'),
            archiveModal: document.getElementById('archiveModal'),
            themeToggleIcon: document.getElementById('themeToggleIcon'),
            themeToggleLabel: document.getElementById('themeToggleLabel'),
            btnPlayBack: document.getElementById('btnPlayBack'),
            clueProgressLabel: document.getElementById('clueProgressLabel'),
            playResultBox: document.getElementById('playResultBox'),
            playResultIcon: document.getElementById('playResultIcon'),
            playResultTitle: document.getElementById('playResultTitle'),
            playResultAnswer: document.getElementById('playResultAnswer')
        };
    }

    initEventListeners() {
        if (this.dom.themeToggleBtn) {
            this.dom.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        }

        // Hedef seçici (ana sayfadaki segmentli kontrol): vaka başlatmaz, sadece seçimi değiştirir
        ['btnModeDiagnosis', 'btnModeTherapy', 'btnModePharmacology', 'btnModeCombo'].forEach(btnKey => {
            if (this.dom[btnKey]) {
                this.dom[btnKey].addEventListener('click', (e) => {
                    const target = e.currentTarget.dataset.target;
                    this.setTargetGameMode(target, false);
                    this.updateTargetHint();
                    this.updateHomeMeta();
                });
                this.dom[btnKey].addEventListener('keydown', (e) => {
                    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
                    const keys = ['btnModeDiagnosis', 'btnModeTherapy', 'btnModePharmacology', 'btnModeCombo'];
                    const idx = keys.indexOf(btnKey);
                    const next = this.dom[keys[(idx + (e.key === 'ArrowRight' ? 1 : 3)) % 4]];
                    if (next) { e.preventDefault(); next.focus(); next.click(); }
                });
            }
        });

        // Ana sayfa eylemleri
        if (this.dom.btnStartDaily) this.dom.btnStartDaily.addEventListener('click', () => this.setMode('daily'));
        if (this.dom.btnStartPractice) this.dom.btnStartPractice.addEventListener('click', () => this.setMode('practice'));
        if (this.dom.btnOpenPracticeSettings) this.dom.btnOpenPracticeSettings.addEventListener('click', () => this.openPracticeSettings());
        if (this.dom.btnPracticeSheetStart) {
            this.dom.btnPracticeSheetStart.addEventListener('click', () => {
                this.closeModal(this.dom.practiceSettingsModal);
                this.setMode('practice');
            });
        }
        if (this.dom.btnResetPracticeFilters) {
            this.dom.btnResetPracticeFilters.addEventListener('click', () => {
                this.activeCourseFilter = 'ALL';
                this.activeCategoryFilter = 'ALL';
                this.renderCourseFilters();
                this.renderCategoryFilters();
                this.updatePracticeSummary();
            });
        }
        if (this.dom.btnResumeCase) {
            this.dom.btnResumeCase.addEventListener('click', () => {
                if (!this.currentCase || this.isGameOver) return;
                if (this.currentMode === 'daily' && this.dailyContext && (this.isDailyContextFinished() || this.dailyContext.day !== this.getDailyDay())) { this.setMode('daily'); return; }
                this.enterPlayScreen();
            });
        }
        // Başka sekmede günlük bitirildi: ana sayfa kartı ve oynanan aynı günlük güncellensin
        window.addEventListener('storage', (e) => {
            if (e.key !== 'psikovaka_daily_done') return;
            if (this.currentScreen === 'oyna') this.updateHomeMeta();
            const NSd = window.PsikoVakaOnline && window.PsikoVakaOnline.daily;
            if (NSd && typeof NSd.refreshCard === 'function') NSd.refreshCard();
            if (this.currentMode === 'daily' && this.dailyContext && !this.isGameOver && this.dailyContext.src !== 'server' && this.isDailyContextFinished()) {
                const rec = this.getDailyRecord(this.dailyContext.target, this.dailyContext.day);
                if (this.currentScreen === 'play') this.openFinishedDaily(this.findCaseById(rec.caseId), rec);
            }
        });
        if (this.dom.btnPlayBack) this.dom.btnPlayBack.addEventListener('click', () => this.leavePlayScreen());
        if (this.dom.btnOpenArchive) this.dom.btnOpenArchive.addEventListener('click', () => this.openArchiveModal());
        document.querySelectorAll('[data-arena-tab]').forEach(btn => {
            btn.addEventListener('click', () => this.openDuelCenterModal(btn.dataset.arenaTab));
        });

        // role="button" olan div'ler (arena mod kartları) klavyeyle de seçilebilsin
        document.addEventListener('keydown', (e) => {
            const el = e.target;
            if ((e.key === 'Enter' || e.key === ' ') && el && el.getAttribute && el.getAttribute('role') === 'button' && el.tagName !== 'BUTTON') {
                e.preventDefault();
                el.click();
            }
            if (e.key === 'Escape') {
                const open = [...document.querySelectorAll('.modal-backdrop.open')];
                if (open.length) {
                    const top = open[open.length - 1];
                    if (top.dataset.locked !== 'true') this.closeModal(top);
                } else if (this.dom.categoryTreePanel && this.dom.categoryTreePanel.classList.contains('open')) {
                    this.closeCategoryTree();
                }
            }
        });

        // Sadece çözülmemişler (pratik ayarları içinde)
        if (this.dom.btnToggleUnsolved) {
            this.dom.btnToggleUnsolved.addEventListener('click', () => {
                this.onlyUnsolvedMode = !this.onlyUnsolvedMode;
                localStorage.setItem('psikovaka_only_unsolved', String(this.onlyUnsolvedMode));
                this.updateUnsolvedUI();
                this.updatePracticeSummary();
            });
        }

        if (this.dom.btnQuickPackIndicator) {
            this.dom.btnQuickPackIndicator.addEventListener('click', () => {
                this.closeModal(this.dom.practiceSettingsModal);
                this.openCaseManagerModal();
            });
        }

        // Category Browser Toggle & Search
        if (this.dom.btnCategoryBrowser) {
            this.dom.btnCategoryBrowser.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleCategoryTree();
            });
        }
        if (this.dom.btnCloseCategoryTree) {
            this.dom.btnCloseCategoryTree.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeCategoryTree();
            });
        }
        if (this.dom.categoryTreeSearchInput) {
            this.dom.categoryTreeSearchInput.addEventListener('input', (e) => {
                this.renderCategoryTree(e.target.value);
            });
        }

        document.addEventListener('click', (e) => {
            if (this.dom.categoryBrowserWrapper && !this.dom.categoryBrowserWrapper.contains(e.target)) {
                this.closeCategoryTree();
            }
            if (this.dom.diagnosisInput && this.dom.autocompleteDropdown &&
                !this.dom.diagnosisInput.contains(e.target) && !this.dom.autocompleteDropdown.contains(e.target)) {
                this.closeAutocomplete();
            }
        });

        // Search & Submit
        this.dom.diagnosisInput.addEventListener('input', (e) => this.handleSearchInput(e.target.value));
        this.dom.diagnosisInput.addEventListener('keydown', (e) => this.handleSearchKeydown(e));
        this.dom.btnSubmit.addEventListener('click', () => this.submitGuess());

        if (this.dom.btnGiveUp) {
            this.dom.btnGiveUp.addEventListener('click', () => this.giveUp());
        }
        if (this.dom.btnNextClue) {
            this.dom.btnNextClue.addEventListener('click', () => this.revealNextClue());
        }
        this.initZorlukUI();

        // Finished Actions on Main Screen
        if (this.dom.btnMainNextCase) {
            this.dom.btnMainNextCase.addEventListener('click', () => {
                if (this.currentMode === 'clinic') {
                    this.showRoute('klinigim');
                    return;
                }
                this.setMode('practice');
            });
        }
        if (this.dom.btnMainShowReport) {
            this.dom.btnMainShowReport.addEventListener('click', () => this.openResultModal(this.gameWon));
        }
        const btnMainShare = document.getElementById('btnMainShare');
        if (btnMainShare) btnMainShare.addEventListener('click', () => this.shareResult());
        if (this.dom.btnMainDuelShare) {
            this.dom.btnMainDuelShare.addEventListener('click', () => this.openDuelCenterModal());
        }
        if (this.dom.btnQuickChallengeCase) {
            this.dom.btnQuickChallengeCase.addEventListener('click', () => this.openDuelCenterModal());
        }
        if (this.dom.btnExitDuel) {
            this.dom.btnExitDuel.addEventListener('click', () => this.exitDuelMode());
        }

        // Kütüphane ve profil ekranlarındaki açıcılar
        this.dom.statsBtn.addEventListener('click', () => this.openStatsModal());
        this.dom.helpBtn.addEventListener('click', () => this.openModal(this.dom.helpModal));
        const homeHelp = document.getElementById('btnHomeHelp');
        if (homeHelp) homeHelp.addEventListener('click', () => this.openModal(this.dom.helpModal));
        const wPlay = document.getElementById('btnWelcomePlay');
        if (wPlay) wPlay.addEventListener('click', () => this.startFirstCase());
        const wSkip = document.getElementById('btnWelcomeSkip');
        if (wSkip) wSkip.addEventListener('click', () => { this.markOnboarded(); const t = document.getElementById('homeTitle'); if (t) { t.setAttribute('tabindex', '-1'); try { t.focus(); } catch (e) {} } });
        const soundBtn = document.getElementById('soundToggleBtn');
        if (soundBtn) soundBtn.addEventListener('click', () => this.setSoundOn(!this.isSoundOn()));
        this.syncSoundToggle();
        this.dom.caseStudioBtn.addEventListener('click', () => this.openModal(this.dom.caseStudioModal));
        if (this.dom.caseManagerBtn) {
            this.dom.caseManagerBtn.addEventListener('click', () => this.openCaseManagerModal());
        }
        if (this.dom.duelCenterBtn) {
            this.dom.duelCenterBtn.addEventListener('click', () => this.openDuelCenterModal());
        }

        // Case Manager Actions
        const btnExport = document.getElementById('btnExportJSON');
        if (btnExport) btnExport.addEventListener('click', () => this.exportCasesJSON());

        const btnExportMasterJS = document.getElementById('btnExportMasterCasesJS');
        if (btnExportMasterJS) btnExportMasterJS.addEventListener('click', () => this.exportMasterCasesJS());

        const btnUpload = document.getElementById('btnTriggerUploadJSON');
        const fileInput = document.getElementById('jsonFileInput');
        if (btnUpload && fileInput) {
            btnUpload.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.handleImportJSON(e));
        }

        const btnImportPasted = document.getElementById('btnImportPastedJSON');
        if (btnImportPasted) {
            btnImportPasted.addEventListener('click', () => this.handleImportPastedJSON());
        }

        const btnRestore = document.getElementById('btnRestoreDefaultPool');
        if (btnRestore) {
            btnRestore.addEventListener('click', () => {
                this.applyActivePack('all', true);
                this.closeModal(this.dom.caseManagerModal);
                this.showToast(`Tüm vakalar (${this.allMasterCases.length}) havuzda.`);
            });
        }

        const btnResetSolved = document.getElementById('btnResetSolvedHistory');
        if (btnResetSolved) {
            btnResetSolved.addEventListener('click', () => this.resetSolvedCases());
        }

        // Modal Closers
        document.querySelectorAll('.btn-close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.currentTarget.closest('.modal-backdrop');
                if (modal) this.closeModal(modal);
            });
        });

        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop && backdrop.dataset.locked !== 'true') this.closeModal(backdrop);
            });
        });

        const studioForm = document.getElementById('caseStudioForm');
        if (studioForm) {
            studioForm.addEventListener('submit', (e) => this.handleCreateCustomCase(e));
        }

        if (this.dom.filterBar) this.renderCategoryFilters();
        if (this.dom.courseNav) this.renderCourseFilters();
    }

    // --- URL Routing for Custom Cases, Direct Case IDs & Live/Link Duels ---
    checkURLForCustomOrDuelCase() {
        const hash = window.location.hash;
        // Siteye ilk girişte (hash yokken) otomatik olarak Günün Vakası başlar;
        // #/oyna veya başka bir rota varsa ilgili ekran açılır.
        // daily.js yüklenip sunucu oturumunu netleştirmeden yerel günlük başlamasın diye _autoStartDaily kancası kullanılır.
        if (!hash || hash === '#') {
            this.currentRoute = 'oyna';
            this.showScreen('oyna');
            this._autoStartDaily = true;
            setTimeout(() => { if (this._autoStartDaily) { this._autoStartDaily = false; this.setMode('daily'); } }, 350);
            return;
        }
        if (hash.startsWith('#/')) {
            this.showRoute(this.parseRouteHash() || 'oyna');
            return;
        }
        // Paylaşılan link vakası açılırsa geri tuşu ana sayfaya dönsün
        this.currentRoute = 'oyna';
        this.showScreen('oyna');

        if (hash.startsWith('#room=')) {
            const roomCode = hash.replace('#room=', '').trim().toUpperCase();
            if (roomCode) {
                setTimeout(() => this.joinLiveDuelRoom(roomCode), 300);
                return;
            }
        }

        if (hash.startsWith('#duel=')) {
            try {
                const encoded = hash.replace('#duel=', '');
                const duelData = JSON.parse(decodeURIComponent(escape(atob(encoded))));
                const foundCase = this.allMasterCases.find(c => c.id === duelData.caseId || c.caseNumber === duelData.caseNumber);
                if (foundCase) {
                    if (duelData.mode && ['diagnosis', 'therapy', 'pharmacology', 'combo'].includes(duelData.mode)) {
                        this.setTargetGameMode(duelData.mode, false);
                    }
                    this.startDuelChallenge(foundCase, duelData);
                    return;
                }
            } catch (e) {
                console.error("Düello linki çözümlenemedi:", e);
            }
        }

        if (hash.startsWith('#daily=')) {
            const mode = hash.replace('#daily=', '').trim().toLowerCase();
            if (['diagnosis', 'therapy', 'pharmacology', 'combo'].includes(mode)) {
                this.setTargetGameMode(mode, false);
            }
            this.currentRoute = 'oyna';
            this.showScreen('oyna');
            this._autoStartDaily = true;
            setTimeout(() => { if (this._autoStartDaily) { this._autoStartDaily = false; this.setMode('daily'); } }, 350);
            return;
        }

        if (hash.startsWith('#id=')) {
            const raw = hash.replace('#id=', '').trim();
            const parts = raw.split('&mode=');
            const targetId = parts[0].trim().toLowerCase();
            const mode = parts[1] ? parts[1].trim().toLowerCase() : '';
            if (['diagnosis', 'therapy', 'pharmacology', 'combo'].includes(mode)) {
                this.setTargetGameMode(mode, false);
            }
            const found = this.allMasterCases.find(c => c.id.toLowerCase() === targetId || String(c.caseNumber) === targetId);
            if (found) {
                this.currentMode = 'practice';
                this.startCase(found, `Paylaşılan Vaka #${found.caseNumber}`);
                return;
            }
        }

        if (hash.startsWith('#case=')) {
            try {
                const encodedData = hash.replace('#case=', '');
                const jsonString = decodeURIComponent(escape(atob(encodedData)));
                const customCase = JSON.parse(jsonString);
                if (customCase && customCase.clues && customCase.diagnosisId) {
                    customCase.pharmacologyId = customCase.pharmacologyId || this.getFallbackPharmacologyId(customCase);
                    this.loadCustomCase(customCase);
                    return;
                }
            } catch (err) {
                console.error("Özel vaka yüklenemedi:", err);
            }
        }

        this.showRoute('oyna');
    }

    // --- Effective Target Type Helper (Supports 3-Stage Combo Mode) ---
    getEffectiveTargetType() {
        if (this.targetGameMode === 'combo') {
            if (this.comboStage === 1) return 'diagnosis';
            if (this.comboStage === 2) return 'therapy';
            return 'pharmacology';
        }
        return this.targetGameMode;
    }

    setTargetGameMode(targetMode, restartCurrentCase = true) {
        this.targetGameMode = targetMode;
        this.comboStage = 1;

        ['btnModeDiagnosis', 'btnModeTherapy', 'btnModePharmacology', 'btnModeCombo'].forEach(btnKey => {
            if (this.dom[btnKey]) {
                const isActive = this.dom[btnKey].dataset.target === targetMode;
                this.dom[btnKey].classList.toggle('active', isActive);
                this.dom[btnKey].setAttribute('aria-checked', String(isActive));
                this.dom[btnKey].tabIndex = isActive ? 0 : -1;
            }
        });

        document.body.classList.toggle('therapy-mode-active', targetMode === 'therapy');
        document.body.classList.toggle('pharmacology-mode-active', targetMode === 'pharmacology');
        document.body.classList.toggle('combo-mode-active', targetMode === 'combo');

        if (this.dom.comboStepperBar) {
            this.dom.comboStepperBar.hidden = (targetMode !== 'combo');
        }
        this.updateTargetHint();

        this.syncInputAndBrowserLabels();

        if (this.dom.categoryTreePanel && this.dom.categoryTreePanel.classList.contains('open')) {
            this.renderCategoryTree();
        }

        if (restartCurrentCase && this.currentCase) {
            if (this.currentMode === 'daily') this.setMode('daily'); // günlük: bu hedefin günlüğü (bittiyse salt okunur)
            else this.startCase(this.currentCase, this.currentDisplayTitle || 'Vaka');
        }

        const modeMessages = {
            diagnosis: 'Hedef: tanı.',
            therapy: 'Hedef: terapi.',
            pharmacology: 'Hedef: ilaç.',
            combo: 'Hedef: kombo (tanı → terapi → ilaç).'
        };
        if (restartCurrentCase) {
            this.showToast(modeMessages[targetMode] || "Mod değiştirildi.");
        }
    }

    syncInputAndBrowserLabels() {
        const effectiveType = this.getEffectiveTargetType();
        if (this.dom.categoryBrowserIcon && this.dom.categoryBrowserLabel) {
            const isCombo = this.targetGameMode === 'combo';
            if (effectiveType === 'therapy') {
                this.dom.categoryBrowserIcon.innerHTML = this.icon('shield');
                this.dom.categoryBrowserLabel.textContent = 'Ekoller';
                if (this.dom.btnCategoryBrowser) this.dom.btnCategoryBrowser.setAttribute('aria-label', 'Terapi ekollerinden seç');
                if (this.dom.treePanelTitle) this.dom.treePanelTitle.textContent = 'Terapi ekolleri';
                if (this.dom.diagnosisInput) this.dom.diagnosisInput.placeholder = 'Terapi yaz ya da listeden seç';
            } else if (effectiveType === 'pharmacology') {
                this.dom.categoryBrowserIcon.innerHTML = this.icon('pill');
                this.dom.categoryBrowserLabel.textContent = 'Gruplar';
                if (this.dom.btnCategoryBrowser) this.dom.btnCategoryBrowser.setAttribute('aria-label', 'İlaç gruplarından seç');
                if (this.dom.treePanelTitle) this.dom.treePanelTitle.textContent = 'İlaç grupları';
                if (this.dom.diagnosisInput) this.dom.diagnosisInput.placeholder = 'İlaç yaz ya da listeden seç';
            } else {
                this.dom.categoryBrowserIcon.innerHTML = this.icon('folder');
                this.dom.categoryBrowserLabel.textContent = 'Kategoriler';
                if (this.dom.btnCategoryBrowser) this.dom.btnCategoryBrowser.setAttribute('aria-label', 'DSM-5-TR kategorilerinden seç');
                if (this.dom.treePanelTitle) this.dom.treePanelTitle.textContent = `DSM-5-TR kategorileri (${this.diagnoses.length} tanı)`;
                if (this.dom.diagnosisInput) this.dom.diagnosisInput.placeholder = 'Tanı yaz ya da listeden seç';
            }
            if (this.dom.btnSubmitLabel) this.dom.btnSubmitLabel.textContent = 'Tahmin et';
        }
    }

    updateComboStepperUI() {
        if (!this.dom.comboStepperBar) return;
        this.dom.comboStepperBar.hidden = (this.targetGameMode !== 'combo');
        if (this.targetGameMode !== 'combo') return;

        const steps = [this.dom.comboStep1, this.dom.comboStep2, this.dom.comboStep3];
        steps.forEach((el, idx) => {
            if (!el) return;
            const stageNum = idx + 1;
            el.classList.remove('active', 'completed');
            if (stageNum < this.comboStage || (this.isGameOver && this.gameWon)) {
                el.classList.add('completed');
            } else if (stageNum === this.comboStage) {
                el.classList.add('active');
            }
        });
    }

    // --- Category & Diagnosis/Therapy/Pharmacology Tree Browser ---
    toggleCategoryTree() {
        if (!this.dom.categoryTreePanel) return;
        if (this.dom.categoryTreePanel.classList.contains('open')) {
            this.closeCategoryTree();
        } else {
            this.openCategoryTree();
        }
    }

    openCategoryTree() {
        if (!this.dom.categoryTreePanel) return;
        if (this.zorluk && (this.zorluk.kategoriGizli || this.zorluk.tekHak)) return;
        this.dom.categoryTreePanel.classList.add('open');
        this.closeAutocomplete();
        if (this.dom.btnCategoryBrowser) {
            this.dom.btnCategoryBrowser.classList.add('active');
            this.dom.btnCategoryBrowser.setAttribute('aria-expanded', 'true');
        }
        if (this.dom.categoryTreeSearchInput) {
            this.dom.categoryTreeSearchInput.value = '';
        }
        this.renderCategoryTree();
        setTimeout(() => {
            if (this.dom.categoryTreeSearchInput) this.dom.categoryTreeSearchInput.focus();
        }, 60);
    }

    closeCategoryTree() {
        if (!this.dom.categoryTreePanel) return;
        this.dom.categoryTreePanel.classList.remove('open');
        if (this.dom.btnCategoryBrowser) {
            this.dom.btnCategoryBrowser.classList.remove('active');
            this.dom.btnCategoryBrowser.setAttribute('aria-expanded', 'false');
        }
    }

    renderCategoryTree(filterQuery = '') {
        const container = this.dom.categoryTreeContent;
        if (!container) return;
        container.innerHTML = '';

        const cleanQuery = this.normalizeTurkish(filterQuery);
        const fragment = document.createDocumentFragment();
        const effectiveType = this.getEffectiveTargetType();

        this.syncInputAndBrowserLabels();

        if (effectiveType === 'therapy') {
            Object.keys(this.therapyFamilies).forEach(famKey => {
                const fam = this.therapyFamilies[famKey];
                let items = this.therapies.filter(t => t.family === famKey);
                if (cleanQuery) {
                    items = items.filter(t =>
                        this.normalizeTurkish(t.nameTr).includes(cleanQuery) ||
                        this.normalizeTurkish(t.nameEn).includes(cleanQuery) ||
                        this.normalizeTurkish(fam.name).includes(cleanQuery)
                    );
                }
                if (items.length === 0) return;
                fragment.appendChild(this.buildTreeGroupElement(fam.color || '', fam.name, `${items.length} Yöntem`, items, cleanQuery, (id) => {
                    return this.therapies.find(t => t.id === id);
                }));
            });
        } else if (effectiveType === 'pharmacology') {
            Object.keys(this.pharmacologyFamilies).forEach(famKey => {
                const fam = this.pharmacologyFamilies[famKey];
                let items = this.pharmacology.filter(p => p.family === famKey);
                if (cleanQuery) {
                    items = items.filter(p =>
                        this.normalizeTurkish(p.nameTr).includes(cleanQuery) ||
                        this.normalizeTurkish(p.nameEn).includes(cleanQuery) ||
                        this.normalizeTurkish(fam.name).includes(cleanQuery)
                    );
                }
                if (items.length === 0) return;
                fragment.appendChild(this.buildTreeGroupElement(fam.color || '', fam.name, `${items.length} Protokol`, items, cleanQuery, (id) => {
                    return this.pharmacology.find(p => p.id === id);
                }));
            });
        } else {
            Object.keys(this.categories).forEach(catKey => {
                const cat = this.categories[catKey];
                let items = this.diagnoses.filter(d => d.category === catKey);
                if (cleanQuery) {
                    items = items.filter(d =>
                        this.normalizeTurkish(d.nameTr).includes(cleanQuery) ||
                        this.normalizeTurkish(d.nameEn).includes(cleanQuery) ||
                        this.normalizeTurkish(cat.name).includes(cleanQuery)
                    );
                }
                if (items.length === 0) return;
                fragment.appendChild(this.buildTreeGroupElement(cat.color || '', cat.name, `${items.length} Tanı`, items, cleanQuery, (id) => {
                    return this.diagnoses.find(d => d.id === id);
                }));
            });
        }

        container.appendChild(fragment);
    }

    /** Kategori/ekol rengi küçük nokta olarak (H6: emoji yerine). Renkler initGroupColors'ta tek stil bloğuna yazılır. */
    groupDot(kind, key) {
        return key ? `<span class="group-dot" data-g="${kind}-${String(key).replace(/[^A-Za-z0-9_-]/g, '')}" aria-hidden="true"></span>` : '';
    }

    initGroupColors() {
        if (document.getElementById('groupColorStyles')) return;
        const rules = [];
        const add = (kind, obj) => Object.keys(obj || {}).forEach(k => {
            const c = obj[k] && obj[k].color;
            if (c && /^#[0-9a-fA-F]{3,8}$/.test(c)) rules.push(`.group-dot[data-g="${kind}-${k.replace(/[^A-Za-z0-9_-]/g, '')}"]{--group-color:${c}}`);
        });
        add('dx', this.categories); add('th', this.therapyFamilies); add('ph', this.pharmacologyFamilies);
        const st = document.createElement('style');
        st.id = 'groupColorStyles';
        st.textContent = rules.join('\n');
        document.head.appendChild(st);
    }

    buildTreeGroupElement(color, groupName, countText, items, cleanQuery, finderFn) {
        const groupDiv = document.createElement('div');
        groupDiv.className = `tree-category-group ${cleanQuery ? 'open' : ''}`;

        groupDiv.innerHTML = `
            <button class="tree-category-btn" type="button" aria-expanded="${cleanQuery ? 'true' : 'false'}">
                <span class="tree-category-title-wrap">
                    <span class="tree-category-arrow">${this.icon('chevron-right')}</span>
                    <span class="tree-category-name">${groupName}</span>
                </span>
                <span class="tree-category-count">${countText}</span>
            </button>
            <div class="tree-diagnoses-list">
                ${items.map(item => `
                    <button class="tree-diagnosis-item" type="button" data-id="${item.id}" title="${(item.shortDefinition || '').replace(/"/g, '&quot;')}">
                        <span class="tree-item-main">
                            <span class="tree-item-name-tr">${item.nameTr}</span>
                            <span class="tree-item-name-en">${item.nameEn || ''}</span>
                        </span>
                        <span class="tree-item-action-icon">Seç</span>
                    </button>
                `).join('')}
            </div>
        `;

        const btn = groupDiv.querySelector('.tree-category-btn');
        btn.onclick = () => {
            const willOpen = !groupDiv.classList.contains('open');
            groupDiv.classList.toggle('open');
            btn.setAttribute('aria-expanded', String(willOpen));
            if (willOpen) {
                setTimeout(() => groupDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 40);
            }
        };

        groupDiv.querySelectorAll('.tree-diagnosis-item').forEach(itemEl => {
            itemEl.onclick = () => {
                const found = finderFn(itemEl.dataset.id);
                if (found) {
                    this.selectItem(found);
                    this.closeCategoryTree();
                }
            };
        });

        return groupDiv;
    }

    setMode(mode) {
        this.currentMode = mode;

        if (mode === 'daily') {
            this.loadDailyCase();
        } else if (mode === 'practice') {
            this.loadRandomPracticeCase();
        }
    }

    getDailySeed() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /** Yerel günlük (misafir / sunucu yok): gün = İstanbul günü (sunucuyla aynı kaynak). Bittiyse salt okunur sonuç açılır. */
    loadDailyCase() {
        const day = this.getDailyDay();
        const target = this.targetGameMode;
        const rec = this.getDailyRecord(target, day);
        if (rec && this.openFinishedDaily(this.findCaseById(rec.caseId), rec)) return;
        let hash = 0;
        for (let i = 0; i < day.length; i++) {
            hash = ((hash << 5) - hash) + day.charCodeAt(i);
            hash |= 0;
        }
        const index = Math.abs(hash) % this.cases.length;
        const dailyCase = this.cases[index];
        this.startDailyCase(dailyCase, { day, target, src: 'local' });
    }

    // ---------------------------------------------------------------- Günün vakası: bitti kaydı (B3)
    // Bir hedefte günde tek oyun. Kayıt localStorage 'psikovaka_daily_done' { "<gün>|<hedef>": kayıt }; gün = İstanbul günü.
    // Misafirde tek kaynak bu kayıt; üyede sunucu (js/online/daily.js), kayıt yalnızca sunucuya ulaşılamazsa yedek.

    /** İstanbul takvim günü 'YYYY-AA-GG' (sunucunun günü, §13.1). Sunucu saat farkı biliniyorsa onu kullanır. */
    getDailyDay(ms) {
        let t = ms;
        if (t == null) {
            const C = window.PsikoVakaOnline && window.PsikoVakaOnline.clock;
            t = C && typeof C.now === 'function' ? C.now() : Date.now();
        }
        try {
            const s = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(t));
            if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
        } catch (e) {}
        return new Date(t + 3 * 3600e3).toISOString().slice(0, 10); // Türkiye: sabit UTC+3
    }

    findCaseById(id) {
        if (!id) return null;
        return (this.allMasterCases || []).find(c => c.id === id) || (this.cases || []).find(c => c.id === id) || null;
    }

    dailyRecords() {
        try {
            const o = JSON.parse(localStorage.getItem('psikovaka_daily_done') || '{}');
            return o && typeof o === 'object' && !Array.isArray(o) ? o : {};
        } catch (e) { return {}; }
    }

    /** Bugünün (ya da verilen günün) bu hedefteki bitmiş günlük kaydı; yoksa null. */
    getDailyRecord(target, day) {
        const r = this.dailyRecords()[`${day || this.getDailyDay()}|${target || this.targetGameMode}`];
        return r && r.caseId ? r : null;
    }

    /** İlk sonuç kalır (overwrite yoksa). En yeni 40 kayıt tutulur. */
    saveDailyRecord(rec, overwrite) {
        if (!rec || !rec.day || !rec.target || !rec.caseId) return null;
        const all = this.dailyRecords();
        const key = `${rec.day}|${rec.target}`;
        if (all[key] && !overwrite) return all[key];
        all[key] = rec;
        Object.keys(all).sort((a, b) => String((all[b] || {}).day || '').localeCompare(String((all[a] || {}).day || ''))).slice(40).forEach(k => { delete all[k]; });
        try { localStorage.setItem('psikovaka_daily_done', JSON.stringify(all)); } catch (e) {}
        return rec;
    }

    updateDailyRecord(target, day, patch) {
        const r = this.getDailyRecord(target, day);
        if (r) this.saveDailyRecord(Object.assign(r, patch || {}), true);
    }

    /** Şu an oynanan günlüğün bitiş görüntüsü (tahminler, kombo aşamaları, süre). */
    snapshotDailyRecord(won) {
        const c = this.dailyContext;
        const log = this.stageGuessLog || {};
        const earlier = Object.keys(log).filter(k => Number(k) !== this.comboStage).reduce((n, k) => n + (log[k] || []).length, 0);
        return {
            day: c.day, target: c.target, caseId: this.currentCase.id, src: c.src || 'local', userId: c.userId || null,
            won: !!won, guessesUsed: earlier + this.guesses.length, comboStage: this.comboStage,
            guesses: this.guesses.map(g => Object.assign({}, g)),
            stageGuessLog: JSON.parse(JSON.stringify(log)), comboResults: Object.assign({}, this.comboResults || {}),
            diagWrongLog: (this.diagWrongLog || []).slice(), elapsed: this.elapsedSeconds || 0,
            zorluk: Object.assign({}, this.zorluk || {}), cluesUsed: this.cluesUsed || this.unlockedClues,
            steps: [1, 2, 3].map(i => { const el = this.dom['comboStep' + i + 'Val']; return el ? el.textContent : ''; }),
            at: Date.now()
        };
    }

    /** Günlük oyunu başlatır ve hangi güne/hedefe ait olduğunu işaretler (bitişte kayıt için). */
    startDailyCase(caseObj, ctx) {
        if (!caseObj) return;
        this.currentMode = 'daily';
        this.startCase(caseObj, `Günün vakası · #${caseObj.caseNumber || ''}`.replace(/ · #$/, ''));
        this.dailyContext = Object.assign({ day: this.getDailyDay(), target: this.targetGameMode, src: 'local', userId: null }, ctx || {}, { caseId: caseObj.id });
    }

    /** Bu oyun hâlâ oynanabilir bir günlük mü? (gün değişmediyse ve bitmiş kaydı yoksa) */
    isDailyContextFinished(ctx) {
        const c = ctx || this.dailyContext;
        return !!(c && this.getDailyRecord(c.target, c.day));
    }

    /**
     * Bitmiş günlüğü SALT OKUNUR açar: bütün ipuçları, tahminler, sonuç kartı + açıklama; tahmin alanı yok, istatistik yazılmaz.
     * opts.fill(): tahminleri dışarıdan kurmak için (sunucu günlüğü), opts.title: sonuç başlığı.
     */
    openFinishedDaily(caseObj, rec, opts = {}) {
        if (!caseObj || !rec) return false;
        if (rec.target && rec.target !== this.targetGameMode) this.setTargetGameMode(rec.target, false);
        this.currentMode = 'daily';
        this.startCase(caseObj, `Günün vakası · #${caseObj.caseNumber || ''}`.replace(/ · #$/, '') + ' · bitti');
        clearInterval(this.duelTimerInterval);
        this.dailyContext = { day: rec.day, target: rec.target || this.targetGameMode, caseId: caseObj.id, src: rec.src || 'local', userId: rec.userId || null };
        this.dailyReadOnly = true;
        if (typeof opts.fill === 'function') {
            opts.fill();
        } else {
            this.guesses = (rec.guesses || []).map(g => Object.assign({}, g));
            this.stageGuessLog = rec.stageGuessLog || {};
            if (rec.comboResults) this.comboResults = Object.assign({}, rec.comboResults);
            this.diagWrongLog = (rec.diagWrongLog || []).slice();
            if (this.targetGameMode === 'combo') {
                this.comboStage = rec.comboStage || 3;
                (rec.steps || []).forEach((t, i) => { const el = this.dom['comboStep' + (i + 1) + 'Val']; if (el && t) el.textContent = t; });
            }
        }
        this.elapsedSeconds = rec.elapsed || 0;
        if (rec.zorluk) this.zorluk = Object.assign({ tekHak: false, kategoriGizli: false }, rec.zorluk);
        if (rec.cluesUsed) this.cluesUsed = rec.cluesUsed;
        this.zorlukLocked = true;
        this.renderGameOverView(!!rec.won);
        if (opts.title && this.dom.playResultTitle) this.dom.playResultTitle.textContent = opts.title;
        if (this.dom.btnMainNextCase) this.dom.btnMainNextCase.textContent = 'Pratiğe devam et';
        this.emitPlayState();
        this.announcePlay('Bugünün vakasını bu hedefte bitirdin. Sonucun ve açıklaması aşağıda.');
        return true;
    }

    /**
     * Ana sayfa dosyasındaki özet için yerel (misafir / sunucusuz) günün vakası: loadDailyCase ile aynı seçim
     * (aynı gün anahtarı ve tohum); bu hedefte bugün bitmiş bir yerel kayıt varsa onun vakası. Oyun başlatmaz.
     */
    getLocalDailyCase() {
        if (!this.cases || !this.cases.length) return null;
        const day = typeof this.getDailyDay === 'function' ? this.getDailyDay() : this.getDailySeed();
        if (typeof this.getDailyRecord === 'function' && typeof this.findCaseById === 'function') {
            const rec = this.getDailyRecord(this.targetGameMode, day);
            const done = rec && this.findCaseById(rec.caseId);
            if (done) return done;
        }
        let hash = 0;
        for (let i = 0; i < day.length; i++) {
            hash = ((hash << 5) - hash) + day.charCodeAt(i);
            hash |= 0;
        }
        return this.cases[Math.abs(hash) % this.cases.length];
    }

    /**
     * Ana sayfa dosyasındaki daktilo etiketi: günün danışanının kısa özeti (vakanın patientSummary alanı; yalnızca
     * demografi + meslek, tanı/kategori/ders taşımaz — 2026-11-15 kuralı). Üyede/misafirde js/online/daily.js
     * zaten okuduğu sunucu vakasıyla çağırır (ek istek yok); daily.js yoksa yerel günün vakası.
     */
    setDailyTeaser(c) {
        const el = document.getElementById('dailyTeaser');
        if (!el) return;
        const t = c && typeof c.patientSummary === 'string' ? c.patientSummary.trim() : '';
        if (el.textContent !== t) el.textContent = t;
        el.hidden = !t;
    }

    /**
     * Ana sayfa Online kartındaki not (js/online/friends.js bekleyen istek/davet sayısını değiştirince çağırır):
     * { count, inviter, duel } → "<ad> seni odasına çağırıyor · N bekleyen bildirim"; count 0 ve davet yoksa gizli.
     */
    setHomeOnlineNote(info) {
        const el = document.getElementById('homeOnlineNote');
        if (!el) return;
        const count = (info && info.count) || 0;
        const who = info && info.inviter ? String(info.inviter) : '';
        if (!count && !who) { el.hidden = true; el.textContent = ''; return; }
        const parts = [];
        if (who) parts.push(`<strong>${this.libEsc(who)}</strong> ${info.duel ? 'seni düelloya çağırdı' : 'seni odasına çağırıyor'}`);
        if (count) parts.push(`${count} bekleyen bildirim`);
        const html = parts.join('<span aria-hidden="true"> · </span>');
        if (el.innerHTML !== html) el.innerHTML = html;
        el.hidden = false;
    }

    loadRandomPracticeCase() {
        let pool = [...this.cases];

        if (this.activeCourseFilter && this.activeCourseFilter !== 'ALL') {
            pool = pool.filter(c => c.course === this.activeCourseFilter);
        }
        if (this.activeCategoryFilter && this.activeCategoryFilter !== 'ALL') {
            pool = pool.filter(c => c.category === this.activeCategoryFilter);
        }

        // Unsolved filter
        if (this.onlyUnsolvedMode) {
            const unsolvedPool = pool.filter(c => !this.solvedCaseIds.has(c.id));
            if (unsolvedPool.length > 0) {
                pool = unsolvedPool;
            } else if (pool.length > 0) {
                this.showToast('Bu filtredeki tüm vakaları çözdün. Havuz baştan karıştırıldı.');
            }
        }

        if (!pool || pool.length === 0) pool = [...this.cases];

        const availablePool = pool.filter(c => !this.recentPracticeIds.includes(c.id));
        const finalPool = availablePool.length > 0 ? availablePool : pool;

        const randomIndex = Math.floor(Math.random() * finalPool.length);
        const selectedCase = finalPool[randomIndex];

        this.recentPracticeIds.push(selectedCase.id);
        if (this.recentPracticeIds.length > 15) {
            this.recentPracticeIds.shift();
        }

        this.startCase(selectedCase, `Pratik · Vaka #${selectedCase.caseNumber || (randomIndex + 1)}`);
    }

    loadCustomCase(customCase) {
        this.currentMode = 'custom';
        this.startCase(customCase, 'Paylaşılan vaka');
        this.showToast('Paylaşılan vaka yüklendi.');
    }

    // --- Core Game Flow ---
    startCase(caseData, displayModeTitle = 'Vaka') {
        if (!caseData) return;
        this.dailyReadOnly = false;
        this.dailyContext = null; // günlük ise startDailyCase / openFinishedDaily hemen sonra kurar
        this.currentCase = caseData;
        // Zorluk: pratik ve paylaşılan vakada pratik seçimi; günlük/online/meydan okumada kapalı (günlük ve online sonra kurar)
        this.zorluk = (this.currentMode === 'practice' || this.currentMode === 'custom')
            ? Object.assign({}, this.practiceZorluk) : { tekHak: false, kategoriGizli: false };
        this.zorlukLocked = false;
        this.clueRevealHandler = null;
        this.dailyZorlukHandler = null;
        this.cluesUsed = null;
        if (!this.currentCase.pharmacologyId) {
            this.currentCase.pharmacologyId = this.getFallbackPharmacologyId(this.currentCase);
        }
        this.currentDisplayTitle = displayModeTitle;
        this.guesses = [];
        this.unlockedClues = 1;
        this.isGameOver = false;
        this.gameWon = false;
        this.comboStage = 1;
        this.comboResults = { stage1Guesses: 0, stage2Guesses: 0, stage3Guesses: 0 };
        this.shareStreak = 0;     // günlük seri (js/online/daily.js bildirir; paylaşım satırı)
        this.setResultStreak('');
        this.stageGuessLog = {};  // kombo: biten aşamaların tahminleri (paylaşım satırı için)
        this.diagWrongLog = [];   // yanlış TANI tahminleri (açıklamadaki "Senin tahminin" için; kombo aşamaları sıfırlansa da kalır)

        this.caseTargetMode = this.targetGameMode;
        if (this.dom.comboStep1Val) this.dom.comboStep1Val.textContent = 'Tanıyı belirle';
        if (this.dom.comboStep2Val) this.dom.comboStep2Val.textContent = 'Bekliyor';
        if (this.dom.comboStep3Val) this.dom.comboStep3Val.textContent = 'Bekliyor';
        this.updateComboStepperUI();
        this.syncInputAndBrowserLabels();

        this.closeAutocomplete();
        this.closeCategoryTree();

        // Start Timer for Duels / Speed stats
        this.startCaseTimer();

        // Reset UI
        this.dom.patientId.textContent = String(this.currentCase.id || '').toUpperCase();

        let diffStr = 'Orta';
        if (typeof this.currentCase.difficulty === 'number') {
            diffStr = this.currentCase.difficulty === 1 ? 'Kolay' : (this.currentCase.difficulty === 2 ? 'Orta' : 'Zor');
        } else if (typeof this.currentCase.difficulty === 'string') {
            diffStr = this.currentCase.difficulty;
        }
        this.dom.difficultyBadge.textContent = diffStr;
        this.dom.difficultyBadge.className = `badge badge-difficulty-${diffStr.toLowerCase()}`;

        const modePrefixes = {
            diagnosis: 'Tanı',
            therapy: 'Terapi',
            pharmacology: 'İlaç',
            combo: 'Kombo'
        };
        this.dom.modeBadge.textContent = `${modePrefixes[this.targetGameMode] || 'Tanı'} · ${displayModeTitle}`;
        this.dom.patientSummaryText.textContent = this.currentCase.patientSummary;

        if (this.dom.caseSolvedStatusBadge) {
            const isSolved = this.solvedCaseIds.has(this.currentCase.id);
            this.dom.caseSolvedStatusBadge.hidden = !isSolved;
        }

        this.dom.diagnosisInput.value = '';
        delete this.dom.diagnosisInput.dataset.selectedId;
        this.dom.diagnosisInput.disabled = false;
        this.dom.btnSubmit.disabled = false;

        if (this.dom.finishedActions) this.dom.finishedActions.hidden = true;
        if (this.dom.mainInputSection) this.dom.mainInputSection.hidden = false;

        this.renderClues();
        this.renderGuesses();
        this.updateRemainingGuessesUI();
        this.renderZorlukUI();
        this.enterPlayScreen();
        this.markOnboarded();
        this.emitPlayState();
        this.maybeShowListCoachTip();
    }

    /** İlk vakada bir kez: liste düğmesini gösteren küçük balon (H8). Atlanabilir, bir daha çıkmaz. */
    maybeShowListCoachTip() {
        const tip = document.getElementById('listCoachTip');
        if (!tip) return;
        let seen = false;
        try { seen = localStorage.getItem('psikovaka_hint_list') === '1'; } catch (e) { seen = true; }
        if (seen || this.currentMode === 'online') { tip.hidden = true; return; }
        tip.hidden = false;
        if (!this._coachBound) {
            this._coachBound = true;
            const done = () => this.dismissListCoachTip();
            const ok = document.getElementById('btnListCoachOk');
            if (ok) ok.addEventListener('click', (e) => { e.stopPropagation(); done(); });
            if (this.dom.btnCategoryBrowser) this.dom.btnCategoryBrowser.addEventListener('click', done);
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !tip.hidden) done(); });
        }
    }

    dismissListCoachTip() {
        const tip = document.getElementById('listCoachTip');
        if (tip) tip.hidden = true;
        try { localStorage.setItem('psikovaka_hint_list', '1'); } catch (e) {}
    }

    startCaseTimer() {
        this.caseStartTime = Date.now();
        this.elapsedSeconds = 0;
        if (this.duelTimerInterval) clearInterval(this.duelTimerInterval);
        this.duelTimerInterval = setInterval(() => {
            if (!this.isGameOver) {
                this.elapsedSeconds = Math.floor((Date.now() - this.caseStartTime) / 1000);
                if (this.dom.duelTimerText) {
                    const mins = String(Math.floor(this.elapsedSeconds / 60)).padStart(2, '0');
                    const secs = String(this.elapsedSeconds % 60).padStart(2, '0');
                    this.dom.duelTimerText.textContent = `${mins}:${secs}`;
                }
            }
        }, 500);
    }

    // ---------------------------------------------------------------- Zorluk (ajan Z1)
    /** Aşama başına tahmin hakkı: tek hakta 1, değilse 6. */
    maxGuesses() { return this.zorluk && this.zorluk.tekHak ? 1 : this.maxClues; }

    /** Vakanın zorluk ayarlarını değiştirir (online/günlük çağırır). opts.locked: değiştirilemez (rozet gösterilir). */
    setCaseZorluk(z, opts = {}) {
        const Z = window.PsikoVakaZorluk;
        this.zorluk = Z ? Z.norm(z) : { tekHak: !!(z && z.tekHak), kategoriGizli: !!(z && z.kategoriGizli) };
        if (opts.locked != null) this.zorlukLocked = !!opts.locked;
        this.renderClues();
        this.renderGuesses();
        this.updateRemainingGuessesUI();
        this.renderZorlukUI();
    }

    /** Günlük, pratik ve klinikte ayar seçimi yalnızca ilk tahminden (ya da ilk ek ipucundan) önce. */
    canEditZorluk() {
        if ((this.currentMode !== 'daily' && this.currentMode !== 'practice' && this.currentMode !== 'clinic') || this.dailyReadOnly || this.isGameOver || this.zorlukLocked) return false;
        const log = this.stageGuessLog || {};
        const earlier = Object.keys(log).reduce((n, k) => n + (log[k] || []).length, 0);
        return (this.guesses || []).length === 0 && earlier === 0 && this.unlockedClues <= 1 && this.comboStage === 1;
    }

    /** Oyun başlığındaki "Zor" rozeti, "Sonraki ipucu" düğmesi, kategori kilidi ve günlük ayar paneli. */
    renderZorlukUI() {
        const Z = window.PsikoVakaZorluk;
        if (!Z) return;
        const isHard = Z.any(this.zorluk);
        if (this.dom.playZorBadge) this.dom.playZorBadge.innerHTML = Z.badge(this.zorluk);
        if (this.dom.screenPlay) this.dom.screenPlay.classList.toggle('is-kategori-gizli', isHard);
        if (this.dom.categoryBrowserWrapper) this.dom.categoryBrowserWrapper.hidden = isHard;
        if (this.dom.btnCategoryBrowser) this.dom.btnCategoryBrowser.disabled = isHard;
        if (isHard) this.closeCategoryTree();
        if (this.dom.diagnosisInput) {
            const t = this.getEffectiveTargetType();
            if (isHard) {
                this.dom.diagnosisInput.placeholder = t === 'therapy' ? 'Terapi yaz' : (t === 'pharmacology' ? 'İlaç yaz' : 'Tanı yaz');
            } else {
                this.dom.diagnosisInput.placeholder = t === 'therapy' ? 'Terapi yaz ya da listeden seç' : (t === 'pharmacology' ? 'İlaç yaz ya da listeden seç' : 'Tanı yaz ya da listeden seç');
            }
        }
        const panel = this.dom.playZorlukPanel;
        if (panel) {
            const isDailyOrPractice = (this.currentMode === 'daily' || this.currentMode === 'practice' || this.currentMode === 'clinic');
            const editable = this.canEditZorluk();
            const show = isDailyOrPractice && !this.dailyReadOnly;
            if (show) {
                const sig = JSON.stringify(this.zorluk) + ':' + String(editable);
                if (panel.dataset.sig !== sig || !panel.firstChild) {
                    panel.dataset.sig = sig;
                    panel.innerHTML = Z.switches(this.zorluk, { id: 'dailyZor', hideTitle: true, disabled: !editable });
                }
            }
            panel.hidden = !show;
        }
        this.updateNextClueButton();
    }

    updateNextClueButton() {
        const b = this.dom.btnNextClue;
        if (!b) return;
        b.hidden = true;
        b.disabled = true;
    }

    /** Tek hak: tahmin etmeden sonraki ipucunu açar. Online/günlük üye: sunucuya sorar (clueRevealHandler). */
    async revealNextClue() {
        if (!(this.zorluk && this.zorluk.tekHak) || this.isGameOver || this.dailyReadOnly || this._revealBusy) return;
        if (this.unlockedClues >= this.maxClues) return;
        let n = this.unlockedClues + 1;
        if (typeof this.clueRevealHandler === 'function') {
            this._revealBusy = true; this.updateNextClueButton();
            let r = null;
            try { r = await this.clueRevealHandler(); } catch (e) { r = null; }
            this._revealBusy = false;
            if (!r || !r.ok) { this.updateNextClueButton(); return; }
            n = Math.min(this.maxClues, Math.max(this.unlockedClues, r.clues || n));
        }
        if (this.isGameOver) return;
        this.unlockedClues = n;
        this.zorlukLocked = true;
        this.renderClues();
        this.updateRemainingGuessesUI();
        this.renderZorlukUI();
        this.announcePlay(`İpucu ${this.unlockedClues}/${this.maxClues} açıldı.`);
    }

    /** Pratik ayarları penceresindeki ve günlük paneldeki anahtarlar. */
    initZorlukUI() {
        const Z = window.PsikoVakaZorluk;
        if (!Z) return;
        const mount = this.dom.practiceZorlukMount;
        if (mount) {
            mount.innerHTML = Z.switches(this.practiceZorluk, { id: 'practiceZor' });
            Z.bind(mount, (z) => {
                this.practiceZorluk = z;
                Z.save(z);
                this.updatePracticeSummary();
            });
        }
        if (this.dom.playZorlukPanel) {
            Z.bind(this.dom.playZorlukPanel, async (z) => {
                if (!this.canEditZorluk()) { this.renderZorlukUI(); return; }
                if (this.currentMode === 'practice') {
                    this.practiceZorluk = z;
                    Z.save(z);
                    if (this.dom.practiceZorlukMount) Z.set(this.dom.practiceZorlukMount, z);
                    this.updatePracticeSummary();
                } else if (typeof this.dailyZorlukHandler === 'function') {
                    const r = await this.dailyZorlukHandler(z);
                    if (r && r.zorluk) z = r.zorluk;
                    if (r && r.locked) this.zorlukLocked = true;
                }
                this.setCaseZorluk(z);
            });
        }
    }

    renderClues() {
        this.dom.cluesContainer.innerHTML = '';

        const clueLabels = [
            "Başvuru şikâyeti",
            "Süre ve başlangıç",
            "İşlevsellik ve davranış",
            "Tıbbi dışlama ve tetikleyiciler",
            "Ruhsal durum muayenesi",
            "Kilit tanı kriteri"
        ];

        const visibleCount = Math.min(this.unlockedClues, this.maxClues);
        for (let i = 0; i < visibleCount; i++) {
            const isLatest = !this.isGameOver && i === visibleCount - 1;
            const clueBox = document.createElement('article');
            clueBox.className = `clue-box active${isLatest ? ' is-latest' : ''}`;

            const rawClue = (this.currentCase && this.currentCase.clues && this.currentCase.clues[i]) ? this.currentCase.clues[i] : '';
            let clueContent = typeof rawClue === 'object' && rawClue !== null ? (rawClue.text || '') : String(rawClue);

            if (this.isGameOver && this.currentCase && Array.isArray(this.currentCase.symptomHighlights)) {
                this.currentCase.symptomHighlights.forEach((hl) => {
                    if (hl && hl.clueIndex === i && typeof hl.text === 'string' && clueContent.includes(hl.text)) {
                        const escapedDsm = (hl.dsmMatch || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
                        const escapedText = hl.text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                        const tagLabel = hl.dsmMatch ? hl.dsmMatch.split(':')[0] : 'DSM-5';
                        const replacement = `<button type="button" class="symptom-tag-highlight" onclick="window.game.showDsmDetail('${escapedDsm}', '${escapedText}')" title="DSM-5 kriterini gör">${hl.text} <span class="symptom-pill">${tagLabel}</span></button>`;
                        clueContent = clueContent.replace(hl.text, replacement);
                    }
                });
            }

            clueBox.innerHTML = `
                <div class="clue-header">
                    <span class="clue-num">${i + 1}</span>
                    <span class="clue-tag">${clueLabels[i]}</span>
                    ${isLatest && i > 0 ? '<span class="clue-new">Yeni</span>' : ''}
                </div>
                <div class="clue-text">${clueContent}</div>
            `;

            this.dom.cluesContainer.appendChild(clueBox);
        }

        // Zor modda bir sonraki ipucunu açmak için son ipucunun hemen altında düğme
        if (this.zorluk && this.zorluk.tekHak && !this.isGameOver && !this.dailyReadOnly && this.currentCase && visibleCount < this.maxClues) {
            const nextBtn = document.createElement('button');
            nextBtn.type = 'button';
            nextBtn.id = 'btnInlineNextClue';
            nextBtn.className = 'btn btn-secondary btn-inline-next-clue';
            nextBtn.disabled = !!this._revealBusy;
            nextBtn.innerHTML = `${this.icon('plus')}<span>Sonraki ipucunu aç (${visibleCount + 1}/${this.maxClues})</span>`;
            nextBtn.addEventListener('click', () => this.revealNextClue());
            this.dom.cluesContainer.appendChild(nextBtn);
        }

        this.dom.clueProgressTracker.innerHTML = '';
        for (let i = 0; i < this.maxClues; i++) {
            const node = document.createElement('div');
            node.className = 'clue-step-node';
            if (this.gameWon) {
                node.classList.add('correct');
            } else if (i < this.unlockedClues) {
                node.classList.add('unlocked');
            }
            this.dom.clueProgressTracker.appendChild(node);
        }
        if (this.dom.clueProgressLabel) {
            this.dom.clueProgressLabel.textContent = `İpucu ${Math.min(this.unlockedClues, this.maxClues)}/${this.maxClues}`;
        }

        // Yeni açılan ipucunu görünür alana getir (ilk ipucunda sayfa başında kal)
        const latest = this.dom.cluesContainer.querySelector('.clue-box.is-latest');
        if (latest && this.unlockedClues > 1 && !this.isGameOver && typeof latest.scrollIntoView === 'function') {
            const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            // Yeni açılan ipucu bir kez parlar (H1); aynı ipucu yeniden çizilince tekrar parlamaz
            const key = `${this.currentCase && this.currentCase.id}:${this.comboStage}:${this.unlockedClues}`;
            if (this._lastFlashKey !== key) {
                this._lastFlashKey = key;
                latest.classList.add('is-flash');
                setTimeout(() => latest.classList.remove('is-flash'), 700);
            }
            setTimeout(() => latest.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }), 30);
        }
    }

    showDsmDetail(dsmMatch, symptomText) {
        const modalSymptom = document.getElementById('modalSymptomText');
        const modalCriteria = document.getElementById('modalCriteriaText');
        if (modalSymptom && modalCriteria) {
            modalSymptom.textContent = `"${symptomText}"`;
            modalCriteria.textContent = dsmMatch;
            this.openModal(this.dom.dsmCriteriaDetailModal);
        }
    }

    renderGuesses() {
        this.renderGuessStrip();
        // İlk tahminden sonra liste ipucu balonu kendiliğinden kapanır (yerel, günlük ve online yolların hepsi buradan geçer)
        if ((this.guesses || []).length > 0) { const tip = document.getElementById('listCoachTip'); if (tip && !tip.hidden) this.dismissListCoachTip(); }
        this.dom.guessesFeed.innerHTML = '';

        this.guesses.forEach((guess, index) => {
            const card = document.createElement('div');
            let cardClass = 'guess-card wrong';
            let statusText = this.zorluk && this.zorluk.kategoriGizli ? 'Yanlış' : 'Farklı grup';
            let iconName = 'x';

            if (guess.isCorrect) {
                cardClass = 'guess-card correct';
                statusText = 'Doğru';
                iconName = 'check';
            } else if (guess.categoryMatch && !(this.zorluk && this.zorluk.kategoriGizli)) {
                cardClass = 'guess-card category-match';
                statusText = `Grup doğru: ${guess.categoryName}`;
                iconName = 'target';
            }

            const stageTag = guess.stageBadge ? `<span class="badge badge-muted">${guess.stageBadge}</span>` : '';

            card.className = cardClass;
            card.innerHTML = `
                <span class="guess-icon">${this.icon(iconName)}</span>
                <div class="guess-name">
                    <span class="guess-index">${index + 1}</span>
                    <span class="guess-label">${guess.nameTr}</span>
                    ${stageTag}
                </div>
                <div class="guess-status-pill">${statusText}</div>
            `;
            this.dom.guessesFeed.appendChild(card);
        });
    }

    /**
     * Tahmin şeridi (H2): ilerleme çubuğunun altında yapışkan, yatay kayan çipler.
     * Vaka sürerken alttaki tam liste gizlenir; vaka bitince tam liste görünür, şerit kalkar.
     */
    renderGuessStrip() {
        const strip = this.dom.guessStrip || document.getElementById('guessStrip');
        if (!strip) return;
        const list = this.guesses || [];
        const playing = !this.isGameOver;
        strip.hidden = !(playing && list.length > 0);
        if (this.dom.screenPlay) this.dom.screenPlay.classList.toggle('has-guess-strip', playing && list.length > 0);
        if (strip.hidden) { strip.innerHTML = ''; return; }
        const short = (t) => { const x = String(t || ''); return x.length > 22 ? x.slice(0, 21).trimEnd() + '…' : x; };
        const esc = (t) => String(t || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
        const hide = !!(this.zorluk && this.zorluk.kategoriGizli);
        strip.innerHTML = list.map((g, i) => {
            const near = g.categoryMatch && !hide;
            const kind = g.isCorrect ? 'is-correct' : (near ? 'is-close' : 'is-wrong');
            const ico = g.isCorrect ? 'check' : (near ? 'target' : 'x');
            const state = g.isCorrect ? 'doğru' : (near ? `grup doğru: ${g.categoryName}` : (hide ? 'yanlış' : 'farklı grup'));
            return `<li class="guess-chip ${kind}" title="${esc(g.nameTr)}">
                <span class="guess-chip-ico">${this.icon(ico)}</span>
                <span class="guess-chip-text"><span class="guess-chip-name">${esc(short(g.nameTr))}</span>${near && !g.isCorrect ? `<span class="guess-chip-sub">${esc(short(g.categoryName))}</span>` : ''}</span>
                <span class="visually-hidden">${i + 1}. tahmin, ${esc(state)}</span>
            </li>`;
        }).join('');
        // En yeni çip görünür kalsın
        try { strip.scrollLeft = strip.scrollWidth; } catch (e) {}
    }

    updateRemainingGuessesUI() {
        const maxG = this.maxGuesses();
        const remaining = Math.max(0, maxG - this.guesses.length);
        this.dom.remainingGuessesText.textContent = this.zorluk && this.zorluk.tekHak ? (remaining ? 'Tek hak' : 'Hak kalmadı') : `Kalan hak ${remaining}/${maxG}`;

        this.dom.guessDots.innerHTML = '';
        for (let i = 0; i < maxG; i++) {
            const dot = document.createElement('div');
            dot.className = 'guess-dot';
            if (i < this.guesses.length) {
                dot.classList.add('used');
            } else if (i === this.guesses.length) {
                dot.classList.add('active');
            }
            this.dom.guessDots.appendChild(dot);
        }
        this.renderZorlukUI();
    }

    // --- Autocomplete & Search ---
    normalizeTurkish(str) {
        if (!str) return '';
        return str
            .replace(/İ/g, 'i')
            .replace(/I/g, 'ı')
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .trim();
    }

    handleSearchInput(query) {
        const cleanQuery = this.normalizeTurkish(query);
        if (cleanQuery.length < 1) {
            this.closeAutocomplete();
            return;
        }

        const effectiveType = this.getEffectiveTargetType();

        if (effectiveType === 'therapy') {
            this.autocompleteResults = this.therapies.filter(t => {
                const tr = this.normalizeTurkish(t.nameTr);
                const en = this.normalizeTurkish(t.nameEn);
                const aliasMatch = t.aliases && t.aliases.some(a => this.normalizeTurkish(a).includes(cleanQuery));
                const defMatch = t.shortDefinition && this.normalizeTurkish(t.shortDefinition).includes(cleanQuery);
                return tr.includes(cleanQuery) || en.includes(cleanQuery) || aliasMatch || defMatch;
            }).slice(0, 8);
        } else if (effectiveType === 'pharmacology') {
            this.autocompleteResults = this.pharmacology.filter(p => {
                const tr = this.normalizeTurkish(p.nameTr);
                const en = this.normalizeTurkish(p.nameEn);
                const aliasMatch = p.aliases && p.aliases.some(a => this.normalizeTurkish(a).includes(cleanQuery));
                const defMatch = p.shortDefinition && this.normalizeTurkish(p.shortDefinition).includes(cleanQuery);
                return tr.includes(cleanQuery) || en.includes(cleanQuery) || aliasMatch || defMatch;
            }).slice(0, 8);
        } else {
            this.autocompleteResults = this.diagnoses.filter(d => {
                const tr = this.normalizeTurkish(d.nameTr);
                const en = this.normalizeTurkish(d.nameEn);
                const aliasMatch = d.aliases && d.aliases.some(a => this.normalizeTurkish(a).includes(cleanQuery));
                return tr.includes(cleanQuery) || en.includes(cleanQuery) || aliasMatch;
            }).slice(0, 8);
        }

        this.renderAutocomplete();
    }

    renderAutocomplete() {
        if (this.autocompleteResults.length === 0) {
            this.closeAutocomplete();
            return;
        }

        this.dom.autocompleteDropdown.innerHTML = '';
        this.selectedAutocompleteIndex = -1;
        const effectiveType = this.getEffectiveTargetType();

        this.autocompleteResults.forEach((item) => {
            const div = document.createElement('div');
            div.className = 'autocomplete-item';

            if (effectiveType === 'therapy') {
                const fam = this.therapyFamilies[item.family] || { name: item.family };
                div.innerHTML = `
                    <div class="item-main">
                        <span class="item-name-tr">${item.nameTr}</span>
                        <span class="item-name-en">${item.nameEn}</span>
                    </div>
                    <span class="therapy-family-tag">${this.groupDot('th', item.family)}${fam.name}</span>
                `;
            } else if (effectiveType === 'pharmacology') {
                const fam = this.pharmacologyFamilies[item.family] || { name: item.family };
                div.innerHTML = `
                    <div class="item-main">
                        <span class="item-name-tr">${item.nameTr}</span>
                        <span class="item-name-en">${item.nameEn}</span>
                    </div>
                    <span class="pharma-family-tag">${this.groupDot('ph', item.family)}${fam.name}</span>
                `;
            } else {
                const categoryObj = this.categories[item.category] || { name: item.category };
                div.innerHTML = `
                    <div class="item-main">
                        <span class="item-name-tr">${item.nameTr}</span>
                        <span class="item-name-en">${item.nameEn}</span>
                    </div>
                    <span class="item-category-badge">${this.groupDot('dx', item.category)}${categoryObj.name}</span>
                `;
            }

            div.addEventListener('click', () => this.selectItem(item));
            this.dom.autocompleteDropdown.appendChild(div);
        });

        this.dom.autocompleteDropdown.classList.add('open');
    }

    closeAutocomplete() {
        this.dom.autocompleteDropdown.classList.remove('open');
        this.selectedAutocompleteIndex = -1;
    }

    selectItem(item) {
        this.dom.diagnosisInput.value = item.nameTr;
        this.dom.diagnosisInput.dataset.selectedId = item.id;
        this.closeAutocomplete();
        this.submitGuess();
    }

    handleSearchKeydown(e) {
        const items = this.dom.autocompleteDropdown.querySelectorAll('.autocomplete-item');
        if (!this.dom.autocompleteDropdown.classList.contains('open') || items.length === 0) {
            if (e.key === 'Enter') this.submitGuess();
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.selectedAutocompleteIndex = (this.selectedAutocompleteIndex + 1) % items.length;
            this.updateAutocompleteSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selectedAutocompleteIndex = (this.selectedAutocompleteIndex - 1 + items.length) % items.length;
            this.updateAutocompleteSelection(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this.selectedAutocompleteIndex >= 0 && this.selectedAutocompleteIndex < this.autocompleteResults.length) {
                this.selectItem(this.autocompleteResults[this.selectedAutocompleteIndex]);
            } else {
                this.submitGuess();
            }
        } else if (e.key === 'Escape') {
            this.closeAutocomplete();
        }
    }

    updateAutocompleteSelection(items) {
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedAutocompleteIndex);
            if (index === this.selectedAutocompleteIndex) {
                item.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    // --- Submit Guess Logic (Diagnosis, Therapy, Pharmacology, and 3-Stage Combo) ---
    submitGuess() {
        if (this.isGameOver) return;

        const inputVal = this.dom.diagnosisInput.value.trim();
        const effectiveType = this.getEffectiveTargetType();

        if (!inputVal) {
            this.showToast("Bir seçenek yaz ya da listeden seç.");
            return;
        }

        const selectedId = this.dom.diagnosisInput.dataset.selectedId;
        const clean = this.normalizeTurkish(inputVal);

        let chosenObj = null;
        let isCorrect = false;
        let categoryMatch = false;
        let categoryName = '';
        let correctLabel = '';
        let wrongLabel = '';
        let stageBadge = '';

        if (effectiveType === 'therapy') {
            chosenObj = this.therapies.find(t => t.id === selectedId) ||
                this.therapies.find(t =>
                    this.normalizeTurkish(t.nameTr) === clean ||
                    this.normalizeTurkish(t.nameEn) === clean ||
                    (t.aliases && t.aliases.some(a => this.normalizeTurkish(a) === clean))
                );
            if (!chosenObj) {
                this.showToast("Listede yok; öneriden seç.");
                return;
            }
            const targetTherapyId = this.currentCase.therapyId || 'cbt_general';
            const targetTherapyObj = this.therapies.find(t => t.id === targetTherapyId);
            isCorrect = (chosenObj.id === targetTherapyId);
            categoryMatch = (!isCorrect && targetTherapyObj && chosenObj.family === targetTherapyObj.family);
            const famObj = this.therapyFamilies[chosenObj.family] || {};
            categoryName = famObj.name || chosenObj.family;
            correctLabel = 'Doğru terapi';
            wrongLabel = 'Farklı Terapi Ekolü';
            if (this.targetGameMode === 'combo') stageBadge = 'Aşama 2 • Terapi';
        } else if (effectiveType === 'pharmacology') {
            chosenObj = this.pharmacology.find(p => p.id === selectedId) ||
                this.pharmacology.find(p =>
                    this.normalizeTurkish(p.nameTr) === clean ||
                    this.normalizeTurkish(p.nameEn) === clean ||
                    (p.aliases && p.aliases.some(a => this.normalizeTurkish(a) === clean))
                );
            if (!chosenObj) {
                this.showToast("Listede yok; öneriden seç.");
                return;
            }
            const targetPharmaId = this.currentCase.pharmacologyId || this.getFallbackPharmacologyId(this.currentCase);
            const targetPharmaObj = this.pharmacology.find(p => p.id === targetPharmaId);
            isCorrect = (chosenObj.id === targetPharmaId);
            categoryMatch = (!isCorrect && targetPharmaObj && chosenObj.family === targetPharmaObj.family);
            const famObj = this.pharmacologyFamilies[chosenObj.family] || {};
            categoryName = famObj.name || chosenObj.family;
            correctLabel = 'Doğru protokol';
            wrongLabel = 'Farklı İlaç Grubu';
            if (this.targetGameMode === 'combo') stageBadge = 'Aşama 3 • İlaç';
        } else {
            chosenObj = this.diagnoses.find(d => d.id === selectedId) ||
                this.diagnoses.find(d =>
                    this.normalizeTurkish(d.nameTr) === clean ||
                    this.normalizeTurkish(d.nameEn) === clean ||
                    (d.aliases && d.aliases.some(a => this.normalizeTurkish(a) === clean))
                );
            if (!chosenObj) {
                this.showToast("Listede yok; öneriden seç.");
                return;
            }
            isCorrect = (chosenObj.id === this.currentCase.diagnosisId);
            const correctDiagnosisObj = this.diagnoses.find(d => d.id === this.currentCase.diagnosisId);
            categoryMatch = (!isCorrect && correctDiagnosisObj && chosenObj.category === correctDiagnosisObj.category);
            const categoryObj = this.categories[chosenObj.category] || {};
            categoryName = categoryObj.name || chosenObj.category;
            correctLabel = 'Doğru tanı';
            wrongLabel = 'Farklı Tanı Grubu';
            if (this.targetGameMode === 'combo') stageBadge = 'Aşama 1 • Tanı';
        }

        if (this.guesses.some(g => g.itemId === chosenObj.id && g.stage === this.comboStage)) {
            this.showToast("Bunu zaten denedin.");
            return;
        }
        // Kategori gizli: aynı grup bilgisi hiç üretilmez (yalnızca "yanlış")
        if (this.zorluk && this.zorluk.kategoriGizli) { categoryMatch = false; categoryName = ''; }

        const guessData = {
            itemId: chosenObj.id,
            diagnosisId: effectiveType === 'diagnosis' ? chosenObj.id : undefined,
            therapyId: effectiveType === 'therapy' ? chosenObj.id : undefined,
            pharmacologyId: effectiveType === 'pharmacology' ? chosenObj.id : undefined,
            stage: this.comboStage,
            stageBadge,
            nameTr: chosenObj.nameTr,
            isCorrect,
            categoryMatch,
            categoryName,
            correctLabel,
            wrongLabel
        };

        this.guesses.push(guessData);
        if (effectiveType === 'diagnosis' && !isCorrect) (this.diagWrongLog = this.diagWrongLog || []).push(chosenObj.id);
        this.dom.diagnosisInput.value = '';
        delete this.dom.diagnosisInput.dataset.selectedId;
        this.closeAutocomplete();

        this.playTone(isCorrect ? 'win' : (categoryMatch ? 'warm' : 'cold'));


        if (isCorrect) {
            if (this.targetGameMode === 'combo' && this.comboStage < 3) {
                // Advance to next Combo Stage!
                if (this.comboStage === 1) {
                    this.comboResults.stage1Guesses = this.guesses.filter(g => g.stage === 1).length;
                    if (this.dom.comboStep1Val) this.dom.comboStep1Val.textContent = chosenObj.nameTr;
                    if (this.dom.comboStep2Val) this.dom.comboStep2Val.textContent = 'Şimdi terapiyi seç';
                    this.archiveStageGuesses();
                    this.comboStage = 2;
                    this.guesses = []; // Reset 6-guess allowance for Stage 2
                    this.updateComboStepperUI();
                    this.syncInputAndBrowserLabels();
                    this.renderGuesses();
                    this.updateRemainingGuessesUI();
                    this.showToast('Tanı doğru. Şimdi terapiyi seç.');
                    return;
                } else if (this.comboStage === 2) {
                    this.comboResults.stage2Guesses = this.guesses.filter(g => g.stage === 2).length;
                    if (this.dom.comboStep2Val) this.dom.comboStep2Val.textContent = chosenObj.nameTr;
                    if (this.dom.comboStep3Val) this.dom.comboStep3Val.textContent = 'Şimdi ilacı seç';
                    this.archiveStageGuesses();
                    this.comboStage = 3;
                    this.guesses = []; // Reset 6-guess allowance for Stage 3
                    this.updateComboStepperUI();
                    this.syncInputAndBrowserLabels();
                    this.renderGuesses();
                    this.updateRemainingGuessesUI();
                    this.showToast('Terapi doğru. Şimdi ilacı seç.');
                    return;
                }
            }

            if (this.targetGameMode === 'combo' && this.comboStage === 3) {
                this.comboResults.stage3Guesses = this.guesses.filter(g => g.stage === 3).length;
                if (this.dom.comboStep3Val) this.dom.comboStep3Val.textContent = chosenObj.nameTr;
            }

            this.handleGameEnd(true);
        } else {
            if (this.unlockedClues < this.maxClues && !(this.zorluk && this.zorluk.tekHak)) {
                this.unlockedClues++;
            }

            if (this.guesses.length >= this.maxGuesses()) {
                this.handleGameEnd(false);
            } else {
                this.renderClues();
                this.renderGuesses();
                this.updateRemainingGuessesUI();

                // Bilgi bildirimi yok (H1): yeni ipucu kartı parlar ve görünür alana kayar; tahmin şeridi grubu gösterir.
                this.announcePlay(categoryMatch ? `Grup doğru: ${guessData.categoryName}. İpucu ${this.unlockedClues}/${this.maxClues} açıldı.` : `Yanlış. İpucu ${this.unlockedClues}/${this.maxClues} açıldı.`);
            }
        }
    }

    /** Ekran okuyucuya kısa oyun duyurusu (bildirim baloncuğu olmadan). */
    announcePlay(msg) {
        const el = document.getElementById('playAnnouncer');
        if (!el) return;
        el.textContent = '';
        setTimeout(() => { el.textContent = msg; }, 30);
    }

    /** Kombo: aşama değişmeden önce o aşamanın tahminlerini sakla (paylaşım satırı için). */
    archiveStageGuesses() {
        this.stageGuessLog = this.stageGuessLog || {};
        this.stageGuessLog[this.comboStage] = this.guesses.map(g => ({ isCorrect: !!g.isCorrect, categoryMatch: !!g.categoryMatch }));
    }

    giveUp() {
        if (this.isGameOver) return;
        this.unlockedClues = this.maxClues;
        this.handleGameEnd(false);
    }

    /** Bitmiş vaka görünümü (yan etkisiz): tahmin alanı kapalı, sonuç kartı, bütün ipuçları. */
    renderGameOverView(won) {
        this.isGameOver = true;
        this.gameWon = won;
        this.dom.diagnosisInput.disabled = true;
        this.dom.btnSubmit.disabled = true;

        if (this.dom.finishedActions) this.dom.finishedActions.hidden = false;
        if (this.dom.mainInputSection) this.dom.mainInputSection.hidden = true;
        this.closeAutocomplete();
        this.closeCategoryTree();
        if (this.cluesUsed == null) this.cluesUsed = this.unlockedClues;
        this.renderInlineResult(won);

        this.unlockedClues = this.maxClues;
        this.updateComboStepperUI();
        this.renderZorlukUI();

        this.renderClues();
        this.renderGuesses();
        this.updateRemainingGuessesUI();
    }

    handleGameEnd(won) {
        if (won && this.currentCase) {
            this.markCaseAsSolved(this.currentCase.id);
        }
        this.renderGameOverView(won);

        this.recordStats(won, this.guesses.length);

        if (won) {
            this.launchConfetti();
        }

        // Günün vakası: bu gün + hedef için bitti kaydı (ilk sonuç kalır; salt okunur görünümde yazılmaz)
        if (this.currentMode === 'daily' && this.dailyContext && !this.dailyReadOnly && this.currentCase && this.dailyContext.caseId === this.currentCase.id) {
            this.saveDailyRecord(this.snapshotDailyRecord(won));
            this.updateHomeMeta();
        }

        // Kliniğim modu: seans ücreti ve danışan yorumu
        if (this.currentMode === 'clinic' && window.PsikoVakaKlinik && typeof window.PsikoVakaKlinik.onCaseFinished === 'function') {
            window.PsikoVakaKlinik.onCaseFinished(won, this);
        }

        this.emitPlayState();
        // Rapor kendiliğinden açılmaz (H3): sonuç kartı görünür alana gelir; rapor bir dokunuş uzakta.
        this.focusResultCard();
    }

    /** 72 -> "1 dk 12 sn", 45 -> "45 sn" */
    formatDuration(sec) {
        const n = Math.max(0, Math.round(Number(sec) || 0));
        const m = Math.floor(n / 60), r = n % 60;
        return m > 0 ? `${m} dk${r ? ` ${r} sn` : ''}` : `${r} sn`;
    }

    /** Sonuç kartında günlük seri satırı (js/online/daily.js çağırır). text boşsa gizlenir. */
    setResultStreak(text, isLoss) {
        const el = document.getElementById('playResultStreak');
        const t = document.getElementById('playResultStreakText');
        if (!el || !t) return;
        t.textContent = text || '';
        el.hidden = !text;
        el.classList.toggle('is-loss', !!isLoss);
    }

    focusResultCard() {
        const card = this.dom.finishedActions;
        if (!card || card.hidden) return;
        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setTimeout(() => {
            try { card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); } catch (e) {}
            const btn = this.dom.btnMainShowReport;
            if (btn) { try { btn.focus({ preventScroll: true }); } catch (e) {} }
        }, 60);
    }

    /** Vaka bitince oyun ekranında gösterilen kısa sonuç kartı */
    renderInlineResult(won) {
        if (!this.currentCase) return;
        const diag = this.diagnoses.find(d => d.id === this.currentCase.diagnosisId);
        const therapy = this.therapies.find(t => t.id === (this.currentCase.therapyId || 'cbt_general'));
        const pharma = this.pharmacology.find(p => p.id === (this.currentCase.pharmacologyId || this.getFallbackPharmacologyId(this.currentCase)));
        let answer = diag ? diag.nameTr : '';
        if (this.targetGameMode === 'therapy') answer = therapy ? therapy.nameTr : answer;
        else if (this.targetGameMode === 'pharmacology') answer = pharma ? pharma.nameTr : answer;
        else if (this.targetGameMode === 'combo') answer = [diag && diag.nameTr, therapy && therapy.nameTr, pharma && pharma.nameTr].filter(Boolean).join(' · ');

        if (this.dom.playResultBox) this.dom.playResultBox.className = `result-inline ${won ? 'is-win' : 'is-loss'}`;
        if (this.dom.playResultIcon) this.dom.playResultIcon.innerHTML = this.icon(won ? 'check' : 'flag');
        if (this.dom.playResultTitle) {
            this.dom.playResultTitle.textContent = won
                ? (this.zorluk && this.zorluk.tekHak ? `Tek hakla bildin · ${this.cluesUsed || 1}. ipucunda · ${this.formatDuration(this.elapsedSeconds)}` : `${this.guesses.length}. tahminde bildin · ${this.formatDuration(this.elapsedSeconds)}`)
                : 'Bu sefer olmadı';
        }
        if (this.dom.playResultAnswer) this.dom.playResultAnswer.textContent = answer ? `Doğru cevap: ${answer}` : '';
        if (this.dom.playResultZor) this.dom.playResultZor.innerHTML = window.PsikoVakaZorluk ? window.PsikoVakaZorluk.badge(this.zorluk) : '';
        if (this.dom.playResultTakeaway) {
            const xp = window.PsikoVakaExplain ? window.PsikoVakaExplain.get(this.currentCase) : null;
            this.dom.playResultTakeaway.hidden = !(xp && xp.teachingPoint && this.isGameOver);
            const t = this.dom.playResultTakeaway.querySelector('[data-xp-text]');
            if (t) t.textContent = xp && xp.teachingPoint ? xp.teachingPoint : '';
        }
        if (this.dom.btnMainNextCase) {
            this.dom.btnMainNextCase.disabled = false;
            this.dom.btnMainNextCase.textContent = this.currentMode === 'daily' ? 'Pratiğe devam et' : 'Sıradaki vaka';
        }
        this.renderResultLibraryLinks();
    }

    openResultModal(won) {
        const correctDiag = this.diagnoses.find(d => d.id === this.currentCase.diagnosisId);
        const correctName = correctDiag ? correctDiag.nameTr : "Belirtilmemiş Tanı";
        const correctEn = correctDiag ? correctDiag.nameEn : "";

        const targetTherapyId = this.currentCase.therapyId || 'cbt_general';
        const targetTherapy = this.therapies.find(t => t.id === targetTherapyId);

        const targetPharmaId = this.currentCase.pharmacologyId || this.getFallbackPharmacologyId(this.currentCase);
        const targetPharma = this.pharmacology.find(p => p.id === targetPharmaId);

        const banner = document.getElementById('resultBanner');
        const icon = document.getElementById('resultIcon');
        const heading = document.getElementById('resultHeading');
        const diagNameEl = document.getElementById('resultDiagnosisName');
        const diagEnEl = document.getElementById('resultDiagnosisEn');
        const diffDiagEl = document.getElementById('resultDiffDiag');
        const dsmCriteriaEl = document.getElementById('resultDsmCriteria');
        const shareScoreTextEl = document.getElementById('shareScoreText');

        banner.className = won ? 'result-banner success' : 'result-banner failure';
        icon.innerHTML = this.icon(won ? 'check' : 'flag');
        const zorEl = document.getElementById('resultZor');
        if (zorEl) zorEl.innerHTML = window.PsikoVakaZorluk ? window.PsikoVakaZorluk.badge(this.zorluk) : '';
        if (this.targetGameMode === 'therapy') {
            heading.textContent = won ? `${this.guesses.length}. tahminde doğru terapi` : 'Terapi vakası tamamlandı';
            diagNameEl.textContent = targetTherapy ? targetTherapy.nameTr : 'Kanıta dayalı psikoterapi';
            diagEnEl.innerHTML = `Tanı: <strong>${correctName}</strong>${correctEn ? ` (${correctEn})` : ''}`;
        } else if (this.targetGameMode === 'pharmacology') {
            heading.textContent = won ? `${this.guesses.length}. tahminde doğru protokol` : 'İlaç vakası tamamlandı';
            diagNameEl.textContent = targetPharma ? targetPharma.nameTr : 'Birinci basamak farmakoterapi';
            diagEnEl.innerHTML = `Tanı: <strong>${correctName}</strong> · Terapi: <strong>${targetTherapy ? targetTherapy.nameTr : '-'}</strong>`;
        } else if (this.targetGameMode === 'combo') {
            heading.textContent = won ? 'Üç aşamayı da tamamladın' : 'Konsültasyon raporu';
            diagNameEl.textContent = correctName;
            diagEnEl.textContent = `${targetTherapy ? targetTherapy.nameTr : ''} · ${targetPharma ? targetPharma.nameTr : ''}`;
        } else {
            heading.textContent = won ? `${this.guesses.length}. tahminde bildin · ${this.formatDuration(this.elapsedSeconds)}` : 'Bu sefer olmadı';
            diagNameEl.textContent = correctName;
            diagEnEl.textContent = correctEn;
        }

        // Combo Summary Box
        const comboBox = document.getElementById('comboSummaryBox');
        if (comboBox) {
            if (this.targetGameMode === 'combo') {
                comboBox.hidden = false;
                const totalScore = won ? Math.max(100, 300 - ((this.comboResults.stage1Guesses - 1) * 20) - ((this.comboResults.stage2Guesses - 1) * 20) - ((this.comboResults.stage3Guesses - 1) * 20)) : 0;
                comboBox.innerHTML = `
                    <div class="edu-title">Kombo karnesi · ${totalScore}/300 puan</div>
                    <div class="combo-summary-grid">
                        <div class="combo-summary-cell">
                            <span class="combo-summary-step">1. Tanı</span>
                            <strong>${correctName}</strong>
                            <span class="combo-summary-tries">${this.comboResults.stage1Guesses || '-'} deneme</span>
                        </div>
                        <div class="combo-summary-cell">
                            <span class="combo-summary-step">2. Terapi</span>
                            <strong>${targetTherapy ? targetTherapy.nameTr : '-'}</strong>
                            <span class="combo-summary-tries">${this.comboResults.stage2Guesses || '-'} deneme</span>
                        </div>
                        <div class="combo-summary-cell">
                            <span class="combo-summary-step">3. İlaç</span>
                            <strong>${targetPharma ? targetPharma.nameTr : '-'}</strong>
                            <span class="combo-summary-tries">${this.comboResults.stage3Guesses || '-'} deneme</span>
                        </div>
                    </div>
                `;
            } else {
                comboBox.hidden = true;
            }
        }

        // Render Duel / FFA / Tournament Comparison Podium if Duel is Active
        if (typeof this.CheckTournamentEliminationAndRenderPodium === 'function') {
            this.CheckTournamentEliminationAndRenderPodium();
        } else {
            this.renderDuelPodium(won);
        }

        this.renderResultExplanation();

        diffDiagEl.textContent = this.currentCase.differentialDiagnosis || 'Ayırıcı tanı bilgisi bulunmuyor.';

        // 1. Detaylı Klinik Tanım
        const clinicalEl = document.getElementById('resultClinicalOverview');
        const manualData = (typeof DSM5_MANUAL !== 'undefined') ? DSM5_MANUAL[this.currentCase.diagnosisId] : null;

        if (clinicalEl) {
            if (manualData && manualData.clinicalDescription) {
                const desc = manualData.clinicalDescription;
                clinicalEl.innerHTML = `
                    <div class="clinical-overview-grid">
                        <div class="clinical-subcard">
                            <div class="clinical-subcard-title">Genel bakış</div>
                            <div class="clinical-subcard-text">${desc.overview || ''}</div>
                        </div>
                        <div class="clinical-subcard">
                            <div class="clinical-subcard-title">Yaygınlık ve başlangıç</div>
                            <div class="clinical-subcard-text">${desc.epidemiology || ''}</div>
                        </div>
                        <div class="clinical-subcard">
                            <div class="clinical-subcard-title">Etiyoloji</div>
                            <div class="clinical-subcard-text">${desc.etiology || ''}</div>
                        </div>
                        <div class="clinical-subcard">
                            <div class="clinical-subcard-title">Seyir ve prognoz</div>
                            <div class="clinical-subcard-text">${desc.prognosis || ''}</div>
                        </div>
                    </div>
                `;
            } else {
                clinicalEl.innerHTML = `<p class="edu-text">${correctName} (${correctEn}), DSM-5-TR sınıflamasında yer alan klinik tablolardandır.</p>`;
            }
        }

        // 2. Resmi DSM-5 Tanı Kriterleri
        const fullCriteriaEl = document.getElementById('resultDsmFullCriteria');
        if (fullCriteriaEl) {
            if (manualData && manualData.criteriaList && manualData.criteriaList.length > 0) {
                let fullHTML = `<div class="dsm-criteria-container">`;
                manualData.criteriaList.forEach(crit => {
                    let itemsHTML = '';
                    if (crit.items && crit.items.length > 0) {
                        itemsHTML += `<div class="dsm-criterion-items-list">`;
                        crit.items.forEach(it => {
                            itemsHTML += `<div class="dsm-criterion-item-row">• ${it}</div>`;
                        });
                        itemsHTML += `</div>`;
                    }
                    fullHTML += `
                        <div class="dsm-criterion-card">
                            <div class="dsm-criterion-header">
                                <span class="dsm-criterion-badge">${crit.code}</span>
                                <span class="dsm-criterion-title">${crit.title}</span>
                            </div>
                            <div class="dsm-criterion-desc">${crit.content || ''}</div>
                            ${itemsHTML}
                        </div>
                    `;
                });
                fullHTML += `</div>`;
                fullCriteriaEl.innerHTML = fullHTML;
            } else {
                fullCriteriaEl.innerHTML = `<p class="edu-text">${this.currentCase.dsmCriteriaSummary || 'DSM-5 tanı kriterleri özeti mevcut.'}</p>`;
            }
        }

        // 3. Vakadaki Belirti ➔ DSM-5 Eşleştirmeleri
        let criteriaHTML = `<p class="edu-text">${this.currentCase.dsmCriteriaSummary || 'DSM-5 kriter özeti bulunuyor.'}</p>`;
        if (this.currentCase.symptomHighlights && this.currentCase.symptomHighlights.length > 0) {
            criteriaHTML += `<div class="symptom-map-list">`;
            this.currentCase.symptomHighlights.forEach(hl => {
                criteriaHTML += `
                    <div class="symptom-map-row">
                        <span class="symptom-map-quote">"${hl.text}"</span>
                        <span class="symptom-map-match">${hl.dsmMatch}</span>
                    </div>
                `;
            });
            criteriaHTML += `</div>`;
        }
        dsmCriteriaEl.innerHTML = criteriaHTML;

        this.renderMiniQuiz();
        this.renderTherapyCard(targetPharma);

        const shareString = this.generateShareString(won);
        shareScoreTextEl.textContent = shareString;

        const btnCopyScore = document.getElementById('btnCopyScore');
        if (btnCopyScore) {
            btnCopyScore.onclick = async () => {
                const ok = await this.copyText(this.generateShareString(this.gameWon));
                this.showToast(ok ? 'Sonuç panoya kopyalandı.' : 'Kopyalanamadı. Metni elle kopyala.');
            };
        }

        const btnShareWA = document.getElementById('btnShareWhatsApp');
        if (btnShareWA) {
            btnShareWA.onclick = () => {
                window.open(`https://wa.me/?text=${encodeURIComponent(this.generateShareString(this.gameWon))}`, '_blank', 'noopener');
            };
        }

        const btnChallengeLink = document.getElementById('btnChallengeFriendLink');
        if (btnChallengeLink) {
            btnChallengeLink.onclick = async () => {
                const ok = await this.copyText(this.buildCurrentCaseDuelLink());
                this.showToast(ok ? 'Meydan okuma bağlantısı kopyalandı.' : 'Kopyalanamadı.');
            };
        }

        const btnNextPractice = document.getElementById('btnNextPractice');
        if (btnNextPractice) {
            btnNextPractice.onclick = () => {
                btnNextPractice.disabled = false;
                btnNextPractice.textContent = 'Sıradaki vaka';
                this.closeModal(this.dom.resultModal);
                this.setMode('practice');
            };
        }

        if (btnNextPractice) {
            btnNextPractice.disabled = false;
            btnNextPractice.style.opacity = '';
            btnNextPractice.style.cursor = '';
            btnNextPractice.textContent = this.currentMode === 'daily' ? 'Pratiğe devam et' : 'Sıradaki vaka';
        }

        this.renderResultLibraryLinks();
        this.openModal(this.dom.resultModal);
    }

    /**
     * Vaka raporundaki "Neden bu tanı, neden diğerleri değil?" bölümü (js/explain.js).
     * Yalnızca vaka bittiyse; online maç turunda rapor penceresinde gösterilmez (tur sonucu ekranı,
     * sunucu turu kapatınca gösterir). Alanı olmayan vakada bölüm gizli kalır.
     */
    renderResultExplanation() {
        const box = this.dom.resultExplainBox || document.getElementById('resultExplainBox');
        if (!box) return;
        const X = window.PsikoVakaExplain;
        const show = !!(X && this.currentCase && this.isGameOver && this.currentMode !== 'online' && X.has(this.currentCase));
        if (!show) { box.hidden = true; box.innerHTML = ''; return; }
        box.innerHTML = X.render(this.currentCase, {
            wrongIds: this.diagWrongLog || [],
            links: true,
            collapsed: !this.libIsDesktop(),
            idPrefix: 'rxp'
        });
        box.hidden = false;
        // Kütüphane bağlantısı pencereyi kapatır (rapordaki diğer bağlantılar gibi)
        box.querySelectorAll('a[href^="#/kutuphane/"]').forEach(a => a.addEventListener('click', () => this.closeModal(this.dom.resultModal)));
    }

    renderMiniQuiz() {
        const quizBox = document.getElementById('resultMiniQuizBox');
        const quizQ = document.getElementById('quizQuestion');
        const quizList = document.getElementById('quizOptionsList');
        const quizExp = document.getElementById('quizExplanation');

        if (!quizBox || !quizQ || !quizList || !quizExp) return;

        const quizData = this.currentCase.miniQuiz;
        if (!quizData) {
            quizBox.hidden = true;
            return;
        }

        quizBox.hidden = false;
        quizQ.textContent = quizData.question;
        quizList.innerHTML = '';
        quizExp.hidden = true;
        quizExp.innerHTML = '';

        quizData.options.forEach((optText, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opt-btn';
            btn.type = 'button';
            btn.innerHTML = `<span class="quiz-opt-letter">${String.fromCharCode(65 + idx)}</span><span class="quiz-opt-text"></span>`;
            btn.querySelector('.quiz-opt-text').textContent = optText;

            btn.onclick = () => {
                quizList.querySelectorAll('.quiz-opt-btn').forEach(b => b.disabled = true);
                if (idx === quizData.correctIndex) {
                    btn.classList.add('correct');
                    this.playTone('warm');
                    quizExp.innerHTML = `<strong>Doğru.</strong> ${quizData.explanation}`;
                } else {
                    btn.classList.add('wrong');
                    const correctBtn = quizList.querySelectorAll('.quiz-opt-btn')[quizData.correctIndex];
                    if (correctBtn) correctBtn.classList.add('correct');
                    quizExp.innerHTML = `<strong>Doğru cevap ${String.fromCharCode(65 + quizData.correctIndex)}.</strong> ${quizData.explanation}`;
                }
                quizExp.hidden = false;
            };

            quizList.appendChild(btn);
        });
    }

    renderTherapyCard(targetPharma) {
        const therapyBox = document.getElementById('resultTherapyBox');
        const goldEl = document.getElementById('therapyGold');
        const descEl = document.getElementById('therapyDesc');
        const pharmEl = document.getElementById('therapyPharm');

        if (!therapyBox || !goldEl || !descEl || !pharmEl) return;

        const therapyData = this.currentCase.treatmentModality;
        if (!therapyData) {
            therapyBox.hidden = true;
            return;
        }

        therapyBox.hidden = false;
        goldEl.textContent = therapyData.goldStandardTherapy;
        descEl.textContent = therapyData.therapyDetails;
        const pharmaName = targetPharma ? `${targetPharma.nameTr}. ` : '';
        pharmEl.innerHTML = `<strong>Farmakoterapi:</strong> `;
        pharmEl.appendChild(document.createTextNode(`${pharmaName}${therapyData.pharmacologyNote || ''}`));
    }

    // --- Built-in Pack Shelf & Custom Pack Library ---
    openCaseManagerModal() {
        this.renderPackShelf();
        this.openModal(this.dom.caseManagerModal);
    }

    renderPackShelf() {
        const shelfEl = document.getElementById('builtInPackShelf');
        const totalCountEl = document.getElementById('totalCasesCount');
        const savedListEl = document.getElementById('savedCustomPacksList');

        if (totalCountEl) {
            const solvedInActive = this.cases.filter(c => this.solvedCaseIds.has(c.id)).length;
            totalCountEl.textContent = `${this.dom && this.dom.quickPackLabel ? this.dom.quickPackLabel.textContent.replace(/\s*\(\d+\)$/, '') : 'Aktif paket'} · ${solvedInActive}/${this.cases.length} çözüldü`;
        }

        if (shelfEl) {
            shelfEl.innerHTML = '';
            const packs = this.getBuiltInPacksDefinition();
            packs.forEach(pk => {
                const packCases = this.allMasterCases.filter(pk.filterFn); // pk.count ile aynı
                const solvedCount = packCases.filter(c => this.solvedCaseIds.has(c.id)).length;
                const pct = packCases.length > 0 ? Math.round((solvedCount / packCases.length) * 100) : 0;

                const card = document.createElement('button');
                card.type = 'button';
                card.className = `pack-card ${this.activePackId === pk.id ? 'active' : ''}`;
                if (this.activePackId === pk.id) card.setAttribute('aria-current', 'true');
                const cleanTitle = String(pk.title).replace(/^[^\wÇĞİÖŞÜçğıöşü]+\s*/, '');
                card.innerHTML = `
                    <span class="pack-card-header">
                        <span class="pack-card-title">${cleanTitle}</span>
                        <span class="pack-card-badge">${String(pk.badge).replace(/^[^\wÇĞİÖŞÜçğıöşü]+\s*/, '')}</span>
                    </span>
                    <span class="pack-card-desc">${pk.desc}</span>
                    <span class="pack-progress-meta">
                        <span>${solvedCount}/${packCases.length} çözüldü</span>
                        <span>%${pct}</span>
                    </span>
                    <span class="pack-progress-bar"><span class="pack-progress-fill"></span></span>
                `;
                card.querySelector('.pack-progress-fill').style.width = `${pct}%`;
                card.onclick = () => {
                    this.applyActivePack(pk.id, true);
                    this.closeModal(this.dom.caseManagerModal);
                    this.showToast(`"${cleanTitle}" seçildi (${packCases.length} vaka).`);
                };
                shelfEl.appendChild(card);
            });
        }

        if (savedListEl) {
            savedListEl.innerHTML = '';
            if (this.savedCustomPacks.length === 0) {
                savedListEl.innerHTML = `<p class="empty-state">Henüz kaydettiğin paket yok. Aşağıdan eklediğin paketler burada kalır.</p>`;
            } else {
                this.savedCustomPacks.forEach(cp => {
                    const row = document.createElement('div');
                    row.className = 'row-item';
                    const isCurrent = this.activePackId === cp.id;
                    row.innerHTML = `
                        <div class="row-item-main">
                            <strong class="row-item-title${isCurrent ? ' is-active' : ''}"></strong>
                            <span class="row-item-sub">${cp.cases.length} vaka</span>
                        </div>
                        <div class="row-item-actions">
                            <button type="button" class="btn ${isCurrent ? 'btn-secondary' : 'btn-primary'} btn-sm btn-play-cp">${isCurrent ? 'Aktif' : 'Oyna'}</button>
                            <button type="button" class="icon-btn icon-btn-sm icon-btn-danger btn-del-cp" aria-label="Paketi sil">${this.icon('trash')}</button>
                        </div>
                    `;
                    row.querySelector('.row-item-title').textContent = cp.name;
                    row.querySelector('.btn-play-cp').onclick = () => {
                        this.applyActivePack(cp.id, true);
                        this.closeModal(this.dom.caseManagerModal);
                        this.showToast(`"${cp.name}" paketi seçildi.`);
                    };
                    row.querySelector('.btn-del-cp').onclick = () => {
                        this.savedCustomPacks = this.savedCustomPacks.filter(x => x.id !== cp.id);
                        this.saveCustomPacksToStorage();
                        if (this.activePackId === cp.id) this.applyActivePack('all', true);
                        else this.renderPackShelf();
                    };
                    savedListEl.appendChild(row);
                });
            }
        }

        this.renderSolvedArchiveList();
    }

    renderSolvedArchiveList() {
        const archiveEl = document.getElementById('solvedArchiveList');
        if (!archiveEl) return;
        archiveEl.innerHTML = '';

        // Gather all unique cases across master + custom packs that are solved
        const allAvailableMap = new Map();
        this.allMasterCases.forEach(c => allAvailableMap.set(c.id, c));
        this.savedCustomPacks.forEach(cp => {
            if (Array.isArray(cp.cases)) {
                cp.cases.forEach(c => {
                    if (!allAvailableMap.has(c.id)) allAvailableMap.set(c.id, c);
                });
            }
        });

        const solvedCases = [];
        this.solvedCaseIds.forEach(id => {
            if (allAvailableMap.has(id)) {
                solvedCases.push(allAvailableMap.get(id));
            }
        });

        if (solvedCases.length === 0) {
            archiveEl.innerHTML = `<p class="empty-state">Henüz çözülmüş vakan yok. Doğru çözdüğün vakalar buraya eklenir.</p>`;
            return;
        }

        solvedCases.forEach(c => {
            const diagObj = this.diagnoses.find(d => d.id === c.diagnosisId);
            const diagName = diagObj ? diagObj.nameTr : c.diagnosisId;
            const row = document.createElement('div');
            row.className = 'row-item row-item-wrap';
            row.innerHTML = `
                <div class="row-item-main">
                    <span class="row-item-title"><span class="mono">#${c.caseNumber}</span> ${diagName}</span>
                    <span class="row-item-sub row-item-ellipsis">${c.patientSummary || ''}</span>
                </div>
                <div class="row-item-actions">
                    <button type="button" class="btn btn-ghost btn-sm btn-archive-report">Rapor</button>
                    <button type="button" class="btn btn-secondary btn-sm btn-archive-replay">Tekrar çöz</button>
                </div>
            `;

            row.querySelector('.btn-archive-report').onclick = () => {
                this.closeModal(this.dom.caseManagerModal);
                this.closeModal(this.dom.archiveModal);
                this.currentMode = 'practice';
                this.startCase(c, `Arşiv · Vaka #${c.caseNumber}`);
                this.unlockedClues = this.maxClues;
                this.isGameOver = true;
                this.gameWon = true;
                this.renderClues();
                this.openResultModal(true);
            };

            row.querySelector('.btn-archive-replay').onclick = () => {
                this.closeModal(this.dom.caseManagerModal);
                this.closeModal(this.dom.archiveModal);
                this.currentMode = 'practice';
                this.startCase(c, `Tekrar · Vaka #${c.caseNumber}`);
            };

            archiveEl.appendChild(row);
        });
    }

    exportMasterCasesJS() {
        const merged = [...this.allMasterCases];
        const existingIds = new Set(merged.map(c => c.id));
        let nextNum = merged.reduce((max, c) => Math.max(max, Number(c.caseNumber) || 0), 0) + 1;

        this.savedCustomPacks.forEach(cp => {
            if (Array.isArray(cp.cases)) {
                cp.cases.forEach(c => {
                    if (!existingIds.has(c.id)) {
                        const clone = { ...c };
                        clone.caseNumber = nextNum;
                        clone.id = `case-${String(nextNum).padStart(3, '0')}`;
                        clone.pharmacologyId = clone.pharmacologyId || this.getFallbackPharmacologyId(clone);
                        merged.push(clone);
                        existingIds.add(clone.id);
                        nextNum++;
                    }
                });
            }
        });

        this.allMasterCases = merged;
        const jsContent = `/**\n * PsikoVaka 2.0 - Birleştirilmiş Klinik Vaka Veritabanı (${merged.length} Vaka)\n * Otomatik oluşturuldu: ${new Date().toISOString()}\n */\nconst CLINICAL_CASES = ${JSON.stringify(merged, null, 4)};\n`;
        const blob = new Blob([jsContent], { type: 'application/javascript;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `cases.js`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.renderPackShelf();
        this.showToast(`${merged.length} vakalık cases.js indirildi.`);
    }

    exportCasesJSON() {
        const jsonStr = JSON.stringify(this.cases, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `psikovaka_paket_${this.activePackId}_${this.getDailySeed()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('Vaka paketi JSON olarak indirildi.');
    }

    processAndSaveImportedCases(rawArray, defaultName) {
        if (!Array.isArray(rawArray) || rawArray.length === 0) {
            throw new Error("JSON geçerli bir vaka listesi (Array) içermelidir.");
        }

        const validCases = [];
        let skippedUnknownDx = 0;
        rawArray.forEach((newCase, idx) => {
            if (!newCase || typeof newCase !== 'object') return;
            if (newCase.diagnosisId && Array.isArray(newCase.clues) && newCase.clues.length >= 6
                && !this.diagnoses.some(d => d.id === newCase.diagnosisId)) {
                skippedUnknownDx++;
                return;
            }
            if (newCase.diagnosisId && Array.isArray(newCase.clues) && newCase.clues.length >= 6) {
                if (!newCase.id) newCase.id = `custom-pack-${Date.now()}-${idx + 1}`;
                if (!newCase.caseNumber) newCase.caseNumber = idx + 1;
                newCase.pharmacologyId = newCase.pharmacologyId || this.getFallbackPharmacologyId(newCase);
                validCases.push(newCase);
            }
        });

        if (validCases.length === 0) {
            throw new Error(skippedUnknownDx > 0
                ? `Tanısı güncel listede olmayan ${skippedUnknownDx} vaka atlandı; geçerli vaka kalmadı.`
                : "6 ipucuna sahip geçerli klinik vaka bulunamadı.");
        }

        const nameInput = document.getElementById('customPackNameInput');
        const customName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : defaultName;
        const packId = `custom_${Date.now()}`;

        this.savedCustomPacks.unshift({
            id: packId,
            name: customName,
            cases: validCases,
            createdAt: new Date().toISOString()
        });
        this.saveCustomPacksToStorage();
        if (nameInput) nameInput.value = '';

        this.applyActivePack(packId, true);
        this.closeModal(this.dom.caseManagerModal);
        this.showToast(`"${customName}" (${validCases.length} vaka) kaydedildi ve başlatıldı.${skippedUnknownDx > 0 ? ` ${skippedUnknownDx} vaka tanısı güncel listede olmadığı için atlandı.` : ''}`);
    }

    handleImportJSON(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                const cleanFileName = file.name.replace(/\.json$/i, '');
                this.processAndSaveImportedCases(imported, cleanFileName);
                e.target.value = '';
            } catch (err) {
                this.showToast(`Geçersiz JSON dosyası. ${err.message || ''}`.trim());
            }
        };
        reader.readAsText(file);
    }

    handleImportPastedJSON() {
        const textarea = document.getElementById('pasteJsonTextarea');
        if (!textarea || !textarea.value.trim()) {
            this.showToast('Önce JSON metnini kutuya yapıştır.');
            return;
        }
        try {
            const parsed = JSON.parse(textarea.value.trim());
            this.processAndSaveImportedCases(parsed, `Yapıştırılan Paket #${this.savedCustomPacks.length + 1}`);
            textarea.value = '';
        } catch (err) {
            this.showToast(`JSON biçimi hatalı. ${err.message || ''}`.trim());
        }
    }

    // --- Live Duel & Challenge Link System ---
    openDuelCenterModal() {
        const nickInput = document.getElementById('duelNicknameInput');
        if (nickInput) {
            nickInput.value = this.duelMyNickname;
            nickInput.onchange = () => {
                this.duelMyNickname = nickInput.value.trim() || 'Klinisyen';
                localStorage.setItem('psikovaka_nickname', this.duelMyNickname);
            };
        }

        const duelLinkInput = document.getElementById('currentCaseDuelLinkInput');
        if (duelLinkInput) {
            duelLinkInput.value = this.buildCurrentCaseDuelLink();
        }

        const btnCopyDuel = document.getElementById('btnCopyCurrentDuelLink');
        if (btnCopyDuel) {
            btnCopyDuel.onclick = () => {
                this.saveDuelNicknameFromModal();
                const link = this.buildCurrentCaseDuelLink();
                if (duelLinkInput) duelLinkInput.value = link;
                navigator.clipboard.writeText(link);
                this.showToast('Düello bağlantısı kopyalandı.');
            };
        }

        const btnWaDuel = document.getElementById('btnWhatsappCurrentDuel');
        if (btnWaDuel) {
            btnWaDuel.onclick = () => {
                this.saveDuelNicknameFromModal();
                const link = this.buildCurrentCaseDuelLink();
                const caseNum = this.currentCase ? this.currentCase.caseNumber : 1;
                const msg = `⚔️ *PsikoVaka Klinik Düello Daveti!*\n\n🧑‍⚕️ *${this.duelMyNickname}* seni *Vaka #${caseNum}* üzerinde düelloya davet ediyor!\nBakalım kaçıncı ipucunda doğru tanıyı koyabileceksin?\n\n👉 Hemen tıkla ve yarışa başla:\n${link}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
            };
        }

        this.openModal(this.dom.duelCenterModal);
    }

    saveDuelNicknameFromModal() {
        const nickInput = document.getElementById('duelNicknameInput');
        if (nickInput && nickInput.value.trim()) {
            this.duelMyNickname = nickInput.value.trim();
            localStorage.setItem('psikovaka_nickname', this.duelMyNickname);
        }
    }

    buildCurrentCaseDuelLink() {
        const c = this.currentCase || this.cases[0];
        const payload = {
            caseId: c.id,
            caseNumber: c.caseNumber,
            mode: this.targetGameMode,
            challengerName: this.duelMyNickname || 'Klinisyen',
            challengerGuesses: this.isGameOver && this.gameWon ? this.guesses.length : null,
            challengerTimeSec: this.isGameOver && this.gameWon ? this.elapsedSeconds : null
        };
        const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
        return `${window.location.origin}${window.location.pathname}#duel=${encoded}`;
    }

    startDuelChallenge(caseObj, duelData) {
        this.activeDuelChallenge = {
            ...duelData,
            isRoomDuel: false
        };
        if (this.dom.duelHudBanner) {
            this.dom.duelHudBanner.style.display = 'flex';
            if (this.dom.duelMyName) this.dom.duelMyName.textContent = this.duelMyNickname;
            if (this.dom.duelMyScoreBadge) this.dom.duelMyScoreBadge.textContent = 'Yarışıyor...';
            if (this.dom.duelOpponentName) this.dom.duelOpponentName.textContent = duelData.challengerName || 'Rakip Klinisyen';
            if (this.dom.duelOpponentStatus) {
                if (duelData.challengerGuesses) {
                    this.dom.duelOpponentStatus.textContent = `${duelData.challengerGuesses}/6 tahmin · ${duelData.challengerTimeSec || 30} sn`;
                } else {
                    this.dom.duelOpponentStatus.textContent = 'Meydan okudu';
                }
            }
        }
        this.startCase(caseObj, `Düello · Vaka #${caseObj.caseNumber}`);
        this.showToast(`${duelData.challengerName || 'Arkadaşın'} sana bu vakayla meydan okudu.`);
    }

    /** Eski #room= işleyicisi: artık sunucu odalarına (js/online/) yönlendirir. */
    joinLiveDuelRoom(code) {
        if (window.PsikoVakaOnline && window.PsikoVakaOnline.app) window.PsikoVakaOnline.app.joinByCode(code);
        else this.showRoute('online');
    }

    exitDuelMode() {
        this.activeDuelChallenge = null;
        if (this.dom.duelHudBanner) this.dom.duelHudBanner.style.display = 'none';
        window.location.hash = '';
        this.setMode('practice');
        this.showToast("Düello modundan çıkıldı.");
    }

    renderDuelPodium(won) {
        const podiumEl = document.getElementById('duelPodiumBox');
        if (!podiumEl) return;

        if (!this.activeDuelChallenge) {
            podiumEl.style.display = 'none';
            return;
        }

        podiumEl.style.display = 'block';
        const myGuesses = won ? this.guesses.length : 7;
        const myTime = this.elapsedSeconds;
        const oppName = this.activeDuelChallenge.challengerName || 'Rakip';
        const oppGuesses = this.activeDuelChallenge.challengerGuesses;
        const oppTime = this.activeDuelChallenge.challengerTimeSec;

        const esc = (t) => String(t || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
        let verdict = { cls: 'is-wait', text: 'Rakibin sonucu bekleniyor.' };
        if (oppGuesses) {
            if (myGuesses < oppGuesses || (myGuesses === oppGuesses && myTime < oppTime)) verdict = { cls: 'is-win', text: `Düelloyu kazandın: ${oppName} geride kaldı.` };
            else if (myGuesses > oppGuesses || (myGuesses === oppGuesses && myTime > oppTime)) verdict = { cls: 'is-loss', text: `Bu turu ${oppName} kazandı. Rövanş için sıradaki vakaya geç.` };
            else verdict = { cls: 'is-tie', text: 'Berabere: aynı tahmin sayısı, aynı süre.' };
        }
        podiumEl.innerHTML = `
            <div class="duel-podium-title">Düello karşılaştırması</div>
            <div class="duel-podium-verdict ${verdict.cls}">${esc(verdict.text)}</div>
            <div class="duel-podium-grid">
                <div class="duel-podium-side is-me">
                    <div class="duel-podium-name">${esc(this.duelMyNickname)} (sen)</div>
                    <div class="duel-podium-sub">${won ? `${this.guesses.length}/6 tahmin` : 'Çözemedi'} · ${this.formatDuration(myTime)}</div>
                </div>
                <div class="duel-vs-badge">VS</div>
                <div class="duel-podium-side is-opp">
                    <div class="duel-podium-name">${esc(oppName)}</div>
                    <div class="duel-podium-sub">${oppGuesses ? (oppGuesses <= 6 ? `${oppGuesses}/6 tahmin · ${oppTime ? this.formatDuration(oppTime) : '-'}` : 'Çözemedi') : 'Oynuyor…'}</div>
                </div>
            </div>
        `;
    }

    renderCourseFilters() {
        if (!this.dom.courseNav) return;
        this.dom.courseNav.innerHTML = '';

        Object.keys(this.courses).forEach(courseKey => {
            const course = this.courses[courseKey];
            const btn = document.createElement('button');
            btn.type = 'button';
            const isActive = this.activeCourseFilter === course.id;
            btn.className = `chip-btn course-pill ${isActive ? 'active' : ''}`;
            btn.setAttribute('aria-pressed', String(isActive));
            btn.textContent = course.id === 'ALL' ? 'Tümü' : course.name;

            // Yeni arayüz: seçim sadece filtreyi değiştirir; vaka "Pratiğe başla" ile açılır
            btn.onclick = () => {
                this.activeCourseFilter = course.id;
                this.renderCourseFilters();
                this.updatePracticeSummary();
            };

            this.dom.courseNav.appendChild(btn);
        });
    }

    renderCategoryFilters() {
        if (!this.dom.filterBar) return;
        this.dom.filterBar.innerHTML = '';

        const allPill = document.createElement('button');
        allPill.type = 'button';
        allPill.className = `chip-btn filter-pill ${this.activeCategoryFilter === 'ALL' ? 'active' : ''}`;
        allPill.setAttribute('aria-pressed', String(this.activeCategoryFilter === 'ALL'));
        allPill.textContent = 'Tümü';
        allPill.onclick = () => {
            this.activeCategoryFilter = 'ALL';
            this.renderCategoryFilters();
            this.updatePracticeSummary();
        };
        this.dom.filterBar.appendChild(allPill);

        Object.keys(this.categories).forEach(catKey => {
            const cat = this.categories[catKey];
            const pill = document.createElement('button');
            pill.type = 'button';
            const isActive = this.activeCategoryFilter === catKey;
            pill.className = `chip-btn filter-pill ${isActive ? 'active' : ''}`;
            pill.setAttribute('aria-pressed', String(isActive));
            pill.textContent = cat.name;
            pill.onclick = () => {
                this.activeCategoryFilter = catKey;
                this.renderCategoryFilters();
                this.updatePracticeSummary();
            };
            this.dom.filterBar.appendChild(pill);
        });
    }

    /**
     * Paylaşım metni (H7, Wordle tarzı, cevabı söylemez):
     *   PsikoVaka · Günün vakası · 16 Kasım
     *   Tanı 4/6 · 1 dk 12 sn · 🔥 4 gün
     *   🟥🟨🟨🟩⬜⬜
     *   https://gandalfthegreey.github.io/psikovaka/
     * 🟥 farklı grup, 🟨 grup doğru, 🟩 doğru, ⬜ kullanılmayan hak. Kombo: aşama başına bir satır.
     */
    generateShareString(won) {
        const BASE = 'https://gandalfthegreey.github.io/psikovaka/';
        const mode = this.targetGameMode || 'diagnosis';
        let SITE = BASE;
        if (this.currentMode === 'daily') {
            SITE = mode !== 'diagnosis' ? `${BASE}#daily=${mode}` : BASE;
        } else if (this.currentMode === 'practice' && this.currentCase && this.currentCase.caseNumber) {
            SITE = `${BASE}#id=${this.currentCase.caseNumber}&mode=${mode}`;
        }
        const max = this.maxClues || 6;
        const sq = (list) => {
            const row = (list || []).slice(0, max).map(g => g.isCorrect ? '🟩' : (g.categoryMatch ? '🟨' : '🟥'));
            while (row.length < max) row.push('⬜');
            return row.join('');
        };
        let title = 'PsikoVaka';
        if (this.currentMode === 'daily') {
            let day = '';
            try { day = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', timeZone: 'Europe/Istanbul' }); }
            catch (e) { day = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }); }
            title += ` · Günün vakası · ${day}`;
        } else if (this.currentMode === 'practice') {
            title += ` · Pratik · Vaka #${this.currentCase.caseNumber || '?'}`;
        } else {
            title += ` · Vaka #${this.currentCase.caseNumber || '?'}`;
        }
        const extra = [this.formatDuration(this.elapsedSeconds)];
        if (won && this.currentMode === 'daily' && this.shareStreak > 0) extra.push(`🔥 ${this.shareStreak} gün`);
        const lines = [title];
        const Z = window.PsikoVakaZorluk;
        const zLine = Z ? Z.shareLine(this.zorluk) : '';
        if (this.zorluk && this.zorluk.tekHak) {
            const label = { diagnosis: 'Tanı', therapy: 'Terapi', pharmacology: 'İlaç', combo: 'Kombo' }[this.targetGameMode] || 'Tanı';
            lines.push([`${label} ${won ? `${this.cluesUsed || 1}. ipucunda` : 'X'} · tek hak`].concat(extra).join(' · '));
            lines.push(won ? '🟩' : '🟥');
            if (zLine) lines.push(zLine);
            lines.push(SITE);
            return lines.join('\n');
        }
        if (this.targetGameMode === 'combo') {
            lines.push(['Kombo'].concat(extra).join(' · '));
            const log = Object.assign({}, this.stageGuessLog || {});
            log[this.comboStage] = this.guesses;
            [['Tanı', 1], ['Terapi', 2], ['İlaç', 3]].forEach(([label, st]) => {
                const list = log[st];
                if (!list) { lines.push(`${label} –`); return; }
                const ok = list.some(g => g.isCorrect);
                lines.push(`${label} ${ok ? list.length : 'X'}/${max} ${sq(list)}`);
            });
        } else {
            const label = { diagnosis: 'Tanı', therapy: 'Terapi', pharmacology: 'İlaç' }[this.targetGameMode] || 'Tanı';
            lines.push([`${label} ${won ? this.guesses.length : 'X'}/${max}`].concat(extra).join(' · '));
            lines.push(sq(this.guesses));
        }
        if (zLine) lines.push(zLine);
        lines.push(SITE);
        return lines.join('\n');
    }

    /** Sonucu paylaş: telefonda paylaşım menüsü, yoksa panoya kopyala (onay bildirimiyle). */
    async shareResult() {
        if (!this.currentCase || !this.isGameOver) return;
        const text = this.generateShareString(this.gameWon);
        if (navigator.share && (!navigator.canShare || navigator.canShare({ text }))) {
            try { await navigator.share({ text }); return; }
            catch (e) { if (e && e.name === 'AbortError') return; }
        }
        const ok = await this.copyText(text);
        this.showToast(ok ? 'Sonuç panoya kopyalandı.' : 'Kopyalanamadı. Rapordaki metni elle kopyala.');
    }

    async copyText(text) {
        try {
            if (navigator.clipboard && window.isSecureContext !== false) { await navigator.clipboard.writeText(text); return true; }
        } catch (e) {}
        try {
            const ta = document.createElement('textarea');
            ta.value = text; ta.setAttribute('readonly', ''); ta.className = 'visually-hidden';
            document.body.appendChild(ta); ta.select();
            const ok = document.execCommand('copy'); ta.remove(); return !!ok;
        } catch (e) { return false; }
    }

    handleCreateCustomCase(e) {
        e.preventDefault();

        const diagnosisId = document.getElementById('studioDiagnosisSelect').value;
        const difficulty = document.getElementById('studioDifficulty').value;
        const patientSummary = document.getElementById('studioPatientSummary').value.trim();
        const clue1 = document.getElementById('studioClue1').value.trim();
        const clue2 = document.getElementById('studioClue2').value.trim();
        const clue3 = document.getElementById('studioClue3').value.trim();
        const clue4 = document.getElementById('studioClue4').value.trim();
        const clue5 = document.getElementById('studioClue5').value.trim();
        const clue6 = document.getElementById('studioClue6').value.trim();
        const diffDiag = document.getElementById('studioDiffDiag').value.trim();
        const dsmSummary = document.getElementById('studioDsmSummary').value.trim();

        if (!diagnosisId || !patientSummary || !clue1 || !clue2 || !clue3 || !clue4 || !clue5 || !clue6) {
            this.showToast('Altı ipucunu ve vaka bilgilerini doldur.');
            return;
        }

        const selectedDiag = this.diagnoses.find(d => d.id === diagnosisId);

        const customCase = {
            id: `custom-${Date.now().toString(36)}`,
            caseNumber: 999,
            difficulty,
            diagnosisId,
            category: selectedDiag ? selectedDiag.category : 'MOOD',
            patientSummary,
            clues: [clue1, clue2, clue3, clue4, clue5, clue6],
            differentialDiagnosis: diffDiag || "Kullanıcı tarafından oluşturulmuş özel vaka.",
            dsmCriteriaSummary: dsmSummary || "DSM-5 Kriterleri"
        };

        const jsonStr = JSON.stringify(customCase);
        const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
        const shareUrl = `${window.location.origin}${window.location.pathname}#case=${encoded}`;

        const resultContainer = document.getElementById('studioResultContainer');
        const shareLinkInput = document.getElementById('studioShareLinkInput');

        if (resultContainer && shareLinkInput) {
            resultContainer.hidden = false;
            shareLinkInput.value = shareUrl;

            document.getElementById('btnCopyStudioLink').onclick = () => {
                navigator.clipboard.writeText(shareUrl);
                this.showToast('Özel vaka bağlantısı kopyalandı.');
            };

            document.getElementById('btnPlayStudioCase').onclick = () => {
                this.closeModal(this.dom.caseStudioModal);
                window.location.hash = `case=${encoded}`;
                this.loadCustomCase(customCase);
            };
        }
    }

    // =====================================================================
    // KÜTÜPHANE (ajan L): #/kutuphane, #/kutuphane/terapiler, #/kutuphane/ilaclar,
    // #/kutuphane/tani/<id>, #/kutuphane/terapi/<id>, #/kutuphane/ilac/<id>.
    // Liste DOM'u bir kez kurulur (açık gruplar ve kaydırma konumu korunur); arama yalnızca
    // satırların `hidden` niteliğini değiştirir. Detay sayfaları her girişte yeniden çizilir.
    // Tüm veri metinleri HTML olarak değil, kaçışlanmış düz metin olarak basılır.
    // =====================================================================

    libEsc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    /** Aksan/Türkçe harf duyarsız arama anahtarı: "Clérambault" -> "clerambault", "İLAÇ" -> "ilac" */
    libNorm(s) {
        return String(s == null ? '' : s)
            .replace(/İ/g, 'i').replace(/I/g, 'ı')
            .toLowerCase()
            .normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/ı/g, 'i')
            .replace(/[^a-z0-9.]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    libIsCode(a) { return /^[A-Z]\d{2}(\.[0-9A-Z]{1,4})?$/.test(String(a || '').trim()); }
    libCodesOf(item) { return (item.aliases || []).filter(a => this.libIsCode(a)); }
    libOtherNamesOf(item) {
        const own = new Set([this.libNorm(item.nameTr), this.libNorm(item.nameEn)]);
        return (item.aliases || []).filter(a => !this.libIsCode(a) && !own.has(this.libNorm(a)));
    }

    libHref(kind, id) {
        const base = { tani: '#/kutuphane/tani/', terapi: '#/kutuphane/terapi/', ilac: '#/kutuphane/ilac/' }[kind];
        return base + encodeURIComponent(id);
    }

    libIsDesktop() {
        return !!(window.matchMedia && window.matchMedia('(min-width: 768px)').matches);
    }

    /** Devam eden vaka tedavi/ilaç hedefliyse tanı↔tedavi eşleşmeleri gizlenir (cevap anahtarı olmasın) */
    libHideTreatmentLinks() {
        return !!(this.currentCase && !this.isGameOver && this.caseTargetMode && this.caseTargetMode !== 'diagnosis');
    }

    /** '#/kutuphane/...' -> { view: 'list', tab } | { view: 'detail', kind, id } | { view: 'notfound' } */
    parseLibraryHash() {
        const m = /^#\/kutuphane(?:\/([a-z]+)(?:\/([^/?#]*))?)?\/?$/.exec(window.location.hash || '');
        if (!m) return { view: 'list', tab: 'tani' };
        const seg = m[1];
        let id = m[2] || '';
        try { id = decodeURIComponent(id); } catch (e) {}
        if (!seg || seg === 'tanilar') return { view: 'list', tab: 'tani' };
        if (seg === 'terapiler') return { view: 'list', tab: 'terapi' };
        if (seg === 'ilaclar') return { view: 'list', tab: 'ilac' };
        if ((seg === 'tani' || seg === 'terapi' || seg === 'ilac') && id) return { view: 'detail', kind: seg, id };
        return { view: 'notfound' };
    }

    initLibrary() {
        if (this.libInited) return;
        this.libInited = true;
        this.libView = null;
        this.libViewKey = null;
        this.libTab = 'tani';
        this.libScroll = { tani: 0, terapi: 0, ilac: 0 };
        this.libLastHref = { tani: null, terapi: null, ilac: null };
        this.libIndex = {};
        try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}

        const d = this.dom;
        this.buildLibraryList('tani');
        this.buildLibraryList('terapi');
        this.buildLibraryList('ilac');

        let raf = 0;
        window.addEventListener('scroll', () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = 0;
                if (this.currentScreen === 'kutuphane' && this.libView === 'list') this.libScroll[this.libTab] = window.scrollY;
            });
        }, { passive: true });

        if (d.libSearchInput) {
            let t = 0;
            d.libSearchInput.addEventListener('input', () => {
                clearTimeout(t);
                t = setTimeout(() => this.applyLibrarySearch(), 120);
            });
            d.libSearchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && d.libSearchInput.value) {
                    e.stopPropagation();
                    d.libSearchInput.value = '';
                    this.applyLibrarySearch();
                }
            });
        }

        // Listeden açılan satırı hatırla (geri dönünce odak oraya)
        [d.libListTani, d.libListTerapi, d.libListIlac].forEach((el, i) => {
            if (!el) return;
            const tab = ['tani', 'terapi', 'ilac'][i];
            el.addEventListener('click', (e) => {
                const a = e.target.closest && e.target.closest('a.lib-row');
                if (a) this.libLastHref[tab] = a.getAttribute('href');
                // açılmadan önceki başlık konumu (masaüstünde açılan bölüm iki sütunu kapladığı için başlık yer değiştirir)
                const sm = e.target.closest && e.target.closest('summary.lib-group-head');
                if (sm) sm._top0 = sm.getBoundingClientRect().top;
            });
            // Akordeon (ajan D1): arama dışında bir bölüm açılınca diğerleri kapanır; açılan başlık ekranda yerinde kalır.
            el.addEventListener('toggle', (e) => {
                const g = e.target;
                if (!g || !g.classList || !g.classList.contains('lib-group')) return;
                const idx = this.libIndex[tab];
                if (!idx || idx.searching || !g.open) { const h = g.querySelector('.lib-group-head'); if (h) h._top0 = null; return; }
                const others = idx.groups.filter(x => x.el !== g && x.el.open);
                const head = g.querySelector('.lib-group-head');
                const top0 = head ? (head._top0 != null ? head._top0 : head.getBoundingClientRect().top) : 0;
                if (head) head._top0 = null;
                others.forEach(x => { x.el.open = false; });
                if (head) {
                    const dy = head.getBoundingClientRect().top - top0;
                    if (Math.abs(dy) > 1) window.scrollBy(0, dy);
                }
            }, true);
        });

        // Rapor penceresindeki kütüphane bağlantısı pencereyi kapatır
        if (d.resultLibraryLinks) {
            d.resultLibraryLinks.addEventListener('click', (e) => {
                if (e.target.closest && e.target.closest('a')) this.closeModal(this.dom.resultModal);
            });
        }

        if (d.libDetail) {
            d.libDetail.addEventListener('click', (e) => {
                const jump = e.target.closest && e.target.closest('[data-lib-jump]');
                if (jump) {
                    e.preventDefault();
                    const sec = document.getElementById(jump.dataset.libJump);
                    if (sec) {
                        if (sec.tagName === 'DETAILS') sec.open = true;
                        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                        sec.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
                        const h = sec.querySelector('.lib-sec-title');
                        if (h) { h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (err) {} }
                    }
                    return;
                }
                const act = e.target.closest && e.target.closest('[data-lib-action]');
                if (!act) return;
                if (act.dataset.libAction === 'practice') this.startPracticeFromCategory(act.dataset.cat);
                if (act.dataset.libAction === 'resume' && this.currentCase && !this.isGameOver) this.enterPlayScreen();
            });
        }
    }

    /**
     * Bir sekmenin bölümleri (boş bölümler atlanır). Liste ve detay sayfası aynı sırayı kullanır: bölüm numarası
     * 1…N ve madde numarası "bölüm.sıra" (ör. 4.1) aramada da değişmez.
     */
    libChapters(tab) {
        let groups = [];
        if (tab === 'tani') {
            groups = Object.keys(this.categories).map(k => ({
                key: k, name: this.categories[k].name, items: this.diagnoses.filter(x => x.category === k)
            }));
        } else if (tab === 'terapi') {
            groups = Object.keys(this.therapyFamilies).map(k => ({
                key: k, name: this.therapyFamilies[k].name, items: this.therapies.filter(x => x.family === k)
            }));
        } else {
            groups = Object.keys(this.pharmacologyFamilies).map(k => ({
                key: k, name: this.pharmacologyFamilies[k].name, items: this.pharmacology.filter(x => x.family === k)
            }));
        }
        return groups.filter(g => g.items.length > 0);
    }

    /** "4.1 Depresif Bozukluklar" üst bilgi satırı için: { no: '4.1', chapter: 'Depresif Bozukluklar' } */
    libEntryNo(tab, item) {
        const groups = this.libChapters(tab);
        for (let gi = 0; gi < groups.length; gi++) {
            const ri = groups[gi].items.indexOf(item);
            if (ri >= 0) return { no: `${gi + 1}.${ri + 1}`, chapter: groups[gi].name };
        }
        return { no: '', chapter: '' };
    }

    /** Bir sekmenin gruplu listesini (içindekiler) kurar (bir kez). */
    buildLibraryList(tab) {
        const d = this.dom;
        const host = { tani: d.libListTani, terapi: d.libListTerapi, ilac: d.libListIlac }[tab];
        if (!host) return;
        const groups = this.libChapters(tab);

        const esc = (s) => this.libEsc(s);
        const chevron = this.icon('chevron-right', 'lib-row-chevron');
        let html = '';
        const unit = { tani: 'tanı', terapi: 'terapi', ilac: 'tedavi' }[tab] || 'madde';
        // Ajan D1: açılışta bütün bölümler kapalı (yalnızca başlıklar + madde sayısı); bir başlık açılınca diğerleri kapanır.
        // <details>/<summary>: klavyeyle (Tab, Enter/Boşluk) açılır, açık/kapalı durumu yardımcı teknolojiye bildirilir.
        groups.forEach((g, gi) => {
            html += `<details class="lib-group" data-group="${esc(g.key)}">`;
            html += `<summary class="lib-group-head"><span class="lib-ch">${gi + 1}</span><span class="lib-group-title">${esc(g.name)}</span><span class="lib-group-count">${g.items.length}</span><span class="visually-hidden"> ${unit}</span></summary>`;
            html += `<ul class="lib-rows">`;
            g.items.forEach((it, ri) => {
                const codes = tab === 'tani' ? this.libCodesOf(it) : [];
                // İçindekilerde kod sayfa numarası gibi: yalnız ilki (tamamı tanı sayfasında ve title'da; arama dizini tüm kodları içerir)
                const codeHtml = codes.length
                    ? `<span class="lib-row-codes"${codes.length > 1 ? ` title="${esc(codes.join(', '))}"` : ''}>${esc(codes[0])}</span>` : '';
                html += `<li class="lib-row-item" data-id="${esc(it.id)}"><a class="lib-row${codes.length ? ' has-code' : ''}" href="${this.libHref(tab, it.id)}">` +
                    `<span class="lib-no">${gi + 1}.${ri + 1}</span>` +
                    `<span class="lib-row-text"><span class="lib-row-title">${esc(it.nameTr)}</span>` +
                    `<span class="lib-row-sub" lang="en">${esc(it.nameEn || '')}</span></span>` +
                    codeHtml +
                    `${chevron}</a></li>`;
            });
            html += `</ul></details>`;
        });
        host.innerHTML = html;

        const byKey = Object.fromEntries(groups.map(g => [g.key, g]));
        const idx = { groups: [], total: 0, searching: false };
        host.querySelectorAll('.lib-group').forEach(gEl => {
            const g = byKey[gEl.dataset.group];
            const rows = [];
            gEl.querySelectorAll('.lib-row-item').forEach((li, i) => {
                const it = g.items[i];
                rows.push({ el: li, hay: this.libNorm([it.nameTr, it.nameEn].concat(it.aliases || []).join(' | ')) });
            });
            idx.groups.push({ el: gEl, key: g.key, rows, countEl: gEl.querySelector('.lib-group-count') });
            idx.total += rows.length;
        });
        this.libIndex[tab] = idx;
    }

    setLibraryTab(tab) {
        const d = this.dom;
        this.libTab = tab;
        const lists = { tani: d.libListTani, terapi: d.libListTerapi, ilac: d.libListIlac };
        Object.keys(lists).forEach(k => { if (lists[k]) lists[k].hidden = (k !== tab); });
        document.querySelectorAll('[data-lib-tab]').forEach(a => {
            const on = a.dataset.libTab === tab;
            a.classList.toggle('active', on);
            if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
        });
        if (d.libSearchInput) {
            const ph = {
                tani: 'Tanı ara: ad, İngilizce ad, kod',
                terapi: 'Terapi ara: ad, kısaltma',
                ilac: 'İlaç ara: grup, etken madde'
            };
            d.libSearchInput.placeholder = ph[tab];
            d.libSearchInput.setAttribute('aria-label', ph[tab]);
        }
        this.applyLibrarySearch();
    }

    applyLibrarySearch() {
        const d = this.dom;
        const tab = this.libTab || 'tani';
        const idx = this.libIndex && this.libIndex[tab];
        if (!idx) return;
        const q = this.libNorm(d.libSearchInput ? d.libSearchInput.value : '');
        const tokens = q ? q.split(' ').filter(Boolean) : [];
        const searching = tokens.length > 0;
        let shown = 0;
        idx.groups.forEach(g => {
            let n = 0;
            g.rows.forEach(r => {
                const ok = !searching || tokens.every(t => r.hay.includes(t));
                if (r.el.hidden === ok) r.el.hidden = !ok;
                if (ok) n++;
            });
            g.el.hidden = n === 0;
            g.countEl.textContent = searching ? `${n}/${g.rows.length}` : String(g.rows.length);
            // aramada eşleşen bölümler kendiliğinden açılır; arama silinince hepsi yeniden kapanır
            if (searching) { if (n > 0 && !g.el.open) g.el.open = true; }
            else if (idx.searching && g.el.open) g.el.open = false;
            shown += n;
        });
        idx.searching = searching;
        // Ararken "İçindekiler" başlığı yerine dizin (sonuçlar); masaüstünde tek sütun
        const tocTitle = document.getElementById('libContentsTitle');
        if (tocTitle) tocTitle.hidden = searching;
        const page = document.getElementById('libPage');
        if (page) page.classList.toggle('is-searching', searching);
        if (d.libSearchStatus) d.libSearchStatus.textContent = searching ? (shown ? `${shown} sonuç` : '') : '';
        if (d.libEmpty) d.libEmpty.hidden = !(searching && shown === 0);
    }

    /** showRoute('kutuphane') sonrası çağrılır: liste ya da detay sayfası. */
    renderLibraryRoute() {
        this.initLibrary();
        const d = this.dom;
        if (!d.libHome || !d.libDetail) return;
        const r = this.parseLibraryHash();
        const key = r.view === 'list' ? `list/${r.tab}` : (r.view === 'detail' ? `${r.kind}/${r.id}` : 'notfound');
        if (key === this.libViewKey) return;
        const prevView = this.libViewKey ? this.libView : null; // null: başka ekrandan gelindi

        if (r.view === 'list') {
            const restoreY = prevView === 'detail' ? (this.libScroll[r.tab] || 0) : null;
            d.libDetail.hidden = true;
            d.libDetail.classList.remove('is-book');
            d.libDetail.innerHTML = '';
            d.libHome.hidden = false;
            this.libView = 'list';
            this.libViewKey = key;
            this.setLibraryTab(r.tab);
            if (restoreY !== null) {
                const href = this.libLastHref[r.tab];
                const link = href ? d.libHome.querySelector(`a.lib-row[href="${href.replace(/"/g, '\\"')}"]`) : null;
                // açılan maddenin bölümü (başka yoldan kapanmışsa) yeniden açılır ki odak görünür satıra dönsün
                const grp = link && link.closest('details.lib-group');
                if (grp && !grp.open) grp.open = true;
                window.scrollTo(0, restoreY);
                // doğrudan bağlantıyla gelinip listeye hiç bakılmadıysa (kaydırma 0) maddeyi ekrana getir
                if (link && restoreY === 0) { try { link.scrollIntoView({ block: 'center' }); } catch (e) {} }
                if (link) { try { link.focus({ preventScroll: true }); } catch (e) {} }
                else this.libFocus(d.libraryTitle);
            } else if (prevView === null) {
                this.libFocus(d.libraryTitle);
            }
            return;
        }

        let html = '';
        let found = true;
        if (r.view === 'detail') {
            if (r.kind === 'tani') {
                const item = this.diagnoses.find(x => x.id === r.id);
                html = item ? this.renderDiagnosisDetail(item) : '';
                found = !!item;
            } else if (r.kind === 'terapi') {
                const item = this.therapies.find(x => x.id === r.id);
                html = item ? this.renderTreatmentDetail('terapi', item) : '';
                found = !!item;
            } else {
                const item = this.pharmacology.find(x => x.id === r.id);
                html = item ? this.renderTreatmentDetail('ilac', item) : '';
                found = !!item;
            }
        } else {
            found = false;
        }
        if (!found) html = this.renderLibraryNotFound(r.kind);
        // listeye dönünce bu maddenin bölümü açılsın ve odak satırına gelsin (doğrudan bağlantıyla gelindiyse de)
        else this.libLastHref[r.kind] = this.libHref(r.kind, r.id);

        d.libHome.hidden = true;
        d.libDetail.classList.toggle('is-book', found); // ders kitabı sayfası (css/kutuphane.css)
        d.libDetail.innerHTML = html;
        d.libDetail.hidden = false;
        this.libView = 'detail';
        this.libViewKey = key;
        window.scrollTo(0, 0);
        this.libFocus(document.getElementById('libDetailTitle'));
        try {
            const t = d.libDetail.querySelector('#libDetailTitle');
            document.title = `${t ? t.textContent : 'Kütüphane'} | PsikoVaka`;
        } catch (e) {}
    }

    libFocus(el) {
        if (!el) return;
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        try { el.focus({ preventScroll: true }); } catch (e) {}
    }

    libBackLink(kind) {
        const map = {
            tani: ['#/kutuphane', 'Tanılar'],
            terapi: ['#/kutuphane/terapiler', 'Terapiler'],
            ilac: ['#/kutuphane/ilaclar', 'İlaçlar']
        };
        const [href, label] = map[kind] || map.tani;
        return `<a class="lib-back" href="${href}">${this.icon('arrow-left')}<span><span class="lib-back-pre">İçindekiler: </span>${label}</span></a>`;
    }

    /** Kitap sayfası üst bilgi satırı: "4.1 Depresif Bozukluklar · PsikoVaka Kütüphanesi" */
    libRunningHead(tab, item, fallbackChapter) {
        const esc = (s) => this.libEsc(s);
        const e = this.libEntryNo(tab, item);
        const chapter = e.chapter || fallbackChapter || '';
        return `<div class="lib-run"><span class="lib-run-l">${e.no ? `<span class="lib-run-no">${esc(e.no)}</span> ` : ''}${esc(chapter)}</span><span class="lib-run-r">PsikoVaka Kütüphanesi</span></div>`;
    }

    renderLibraryNotFound(kind) {
        return `${this.libBackLink(kind || 'tani')}
            <div class="lib-notfound card">
                <span class="card-icon">${this.icon('search')}</span>
                <h1 class="lib-detail-title" id="libDetailTitle" tabindex="-1">Bulunamadı</h1>
                <p class="lib-notfound-text">Bu sayfa kütüphanede yok. Bağlantı eski olabilir ya da kayıt adı değişmiş olabilir.</p>
                <a class="btn btn-secondary" href="#/kutuphane">Kütüphaneye dön</a>
            </div>`;
    }

    libCaseNotice() {
        if (!(this.currentCase && !this.isGameOver)) return '';
        const hidden = this.libHideTreatmentLinks();
        return `<div class="notice lib-case-notice" role="note">
                ${this.icon('info')}
                <span class="lib-case-notice-text">Devam eden bir vakan var.${hidden ? ' Tanı ile tedavi arasındaki eşleşmeler vaka bitene kadar gizli.' : ''}</span>
                <button class="btn btn-secondary btn-sm" type="button" data-lib-action="resume">Vakaya dön</button>
            </div>`;
    }

    libDisclaimer(kind) {
        const extra = kind === 'tani'
            ? 'Tanı koymak için DSM-5-TR el kitabına başvurun.'
            : 'Tedavi kararları için güncel klinik kılavuzlara başvurun.';
        return `<p class="lib-disclaimer lib-note"><span class="lib-note-h">Kenar notu</span><span>Bu özetler ${kind === 'tani' ? 'DSM-5-TR metni değildir; ' : ''}projenin kendi cümleleriyle yazılmış çalışma notlarıdır ve hata içerebilir. ${extra}</span></p>`;
    }

    /** a etiketli bağlantı listesi; çoksa ilk `limit` tanesi görünür, gerisi "daha fazla" içinde. */
    libLinkList(items, limit = 12, cls = '') {
        const esc = (s) => this.libEsc(s);
        const li = (x) => `<li><a class="lib-link" href="${x.href}"><span class="lib-link-title">${esc(x.title)}</span>${x.sub ? `<span class="lib-link-sub">${esc(x.sub)}</span>` : ''}${this.icon('chevron-right', 'lib-link-chevron')}</a></li>`;
        const head = items.slice(0, limit).map(li).join('');
        const rest = items.slice(limit);
        const c = cls ? ` ${cls}` : '';
        let html = `<ul class="lib-links${c}">${head}</ul>`;
        if (rest.length) {
            html += `<details class="lib-more"><summary class="lib-more-summary">${rest.length} kayıt daha</summary><ul class="lib-links${c}">${rest.map(li).join('')}</ul></details>`;
        }
        return html;
    }

    /** Tanıya bağlı terapi ve ilaçlar (yalnızca var olan eşleşmeler: goldForDiagnoses, vakalar, ilaç haritası). */
    libTreatmentsForDiagnosis(diagId) {
        const casesFor = this.allMasterCases.filter(c => c.diagnosisId === diagId);
        const therapyIds = [];
        const pushU = (arr, v) => { if (v && !arr.includes(v)) arr.push(v); };
        this.therapies.forEach(t => { if ((t.goldForDiagnoses || []).includes(diagId)) pushU(therapyIds, t.id); });
        casesFor.forEach(c => pushU(therapyIds, c.therapyId));
        const pharmaIds = [];
        const map = (typeof DIAGNOSIS_TO_PHARMACOLOGY_MAP !== 'undefined') ? DIAGNOSIS_TO_PHARMACOLOGY_MAP : {};
        pushU(pharmaIds, map[diagId]);
        this.pharmacology.forEach(p => { if ((p.goldForDiagnoses || []).includes(diagId)) pushU(pharmaIds, p.id); });
        casesFor.forEach(c => pushU(pharmaIds, c.pharmacologyId || this.getFallbackPharmacologyId(c)));
        return {
            therapies: therapyIds.map(id => this.therapies.find(t => t.id === id)).filter(Boolean),
            pharma: pharmaIds.map(id => this.pharmacology.find(p => p.id === id)).filter(Boolean)
        };
    }

    /** Terapiye/ilaca bağlı tanılar (aynı eşleşmelerin ters yönü). */
    libDiagnosesForTreatment(kind, item) {
        const ids = [];
        const pushU = (v) => { if (v && !ids.includes(v)) ids.push(v); };
        (item.goldForDiagnoses || []).forEach(pushU);
        if (kind === 'terapi') {
            this.allMasterCases.forEach(c => { if (c.therapyId === item.id) pushU(c.diagnosisId); });
        } else {
            const map = (typeof DIAGNOSIS_TO_PHARMACOLOGY_MAP !== 'undefined') ? DIAGNOSIS_TO_PHARMACOLOGY_MAP : {};
            Object.keys(map).forEach(k => { if (map[k] === item.id) pushU(k); });
            this.allMasterCases.forEach(c => { if ((c.pharmacologyId || this.getFallbackPharmacologyId(c)) === item.id) pushU(c.diagnosisId); });
        }
        // Yalnızca güncel listede olan tanılar; liste sırasıyla
        const set = new Set(ids);
        return this.diagnoses.filter(dg => set.has(dg.id));
    }

    renderDiagnosisDetail(item) {
        const esc = (s) => this.libEsc(s);
        const cat = this.categories[item.category] || { name: item.category };
        const manual = (typeof DSM5_MANUAL !== 'undefined') ? DSM5_MANUAL[item.id] : null;
        const codes = this.libCodesOf(item);
        const others = this.libOtherNamesOf(item);
        const desktop = this.libIsDesktop();

        // Başlık
        let html = this.libBackLink('tani');
        html += this.libCaseNotice();
        html += `<header class="lib-detail-head">
            ${this.libRunningHead('tani', item, cat.name)}
            <h1 class="lib-detail-title" id="libDetailTitle" tabindex="-1">${esc(item.nameTr)}</h1>
            <p class="lib-detail-en" lang="en">${esc(item.nameEn)}</p>`;
        if (codes.length || others.length) {
            html += `<dl class="lib-meta">`;
            if (codes.length) html += `<div class="lib-meta-row"><dt>Kod</dt><dd class="lib-meta-codes">${codes.map(c => `<span class="lib-code">${esc(c)}</span>`).join('')}</dd></div>`;
            if (others.length) {
                const head = others.slice(0, 6).map(esc).join(' · ');
                const rest = others.slice(6);
                html += `<div class="lib-meta-row"><dt>Diğer adları</dt><dd>${head}${rest.length ? `<details class="lib-more lib-more-inline"><summary class="lib-more-summary">${rest.length} ad daha</summary><p class="lib-more-text">${rest.map(esc).join(' · ')}</p></details>` : ''}</dd></div>`;
            }
            html += `</dl>`;
        }
        html += `</header>`;

        // Bölümler
        const toc = [];
        let body = '';

        // 1. Tanı kriterleri
        const crit = manual && Array.isArray(manual.criteriaList) ? manual.criteriaList : [];
        toc.push(['lib-sec-criteria', 'Tanı kriterleri']);
        body += `<section class="lib-sec" id="lib-sec-criteria" aria-labelledby="lib-h-criteria">
            <h2 class="lib-sec-title" id="lib-h-criteria">Tanı kriterleri</h2>`;
        if (crit.length) {
            body += `<ol class="lib-crit-list">`;
            crit.forEach(c => {
                const items = Array.isArray(c.items) ? c.items : [];
                // Kenar etiketi: "Kriter A" (telefonda yalnız "A"); başka etiketler (ör. "Belirleyiciler") ayrı biçimde
                const code = String(c.code == null ? '' : c.code).trim();
                const km = /^Kriter\s+(.+)$/i.exec(code);
                const codeHtml = km
                    ? `<span class="lib-crit-code"><span class="lib-crit-code-pre">Kriter </span>${esc(km[1])}</span>`
                    : `<span class="lib-crit-code">${esc(code)}</span>`;
                // Alt maddeler: baştaki "A1." / "1)" asılı numara olur
                const itemHtml = (x) => {
                    const t = String(x == null ? '' : x);
                    const mm = /^\s*([A-Z]?\d{1,2}[a-z]?)[.)]\s+/.exec(t);
                    return mm ? `<li class="is-hung"><span class="lib-hang">${esc(mm[1])}</span>${esc(t.slice(mm[0].length))}</li>` : `<li>${esc(t)}</li>`;
                };
                // Birleşik etiketler ("C & D", "A-C") telefonda kenara sığmaz: başlığın üstünde tam "Kriter C & D"
                const wide = km && km[1].length > 2;
                body += `<li class="lib-crit${km ? '' : ' lib-crit-other'}${wide ? ' lib-crit-wide' : ''}">
                    <div class="lib-crit-head">${codeHtml}<h3 class="lib-crit-title">${esc(c.title)}</h3></div>
                    ${c.content ? `<p class="lib-crit-text">${esc(c.content)}</p>` : ''}
                    ${items.length ? `<ul class="lib-crit-items">${items.map(itemHtml).join('')}</ul>` : ''}
                </li>`;
            });
            body += `</ol>`;
        } else {
            body += `<p class="lib-prose-text">Bu tanı için kriter özeti henüz yok.</p>`;
        }
        body += `</section>`;

        // 2-5. Klinik özet
        const cd = (manual && manual.clinicalDescription) || {};
        [['overview', 'Genel bakış'], ['epidemiology', 'Epidemiyoloji'], ['etiology', 'Etiyoloji'], ['prognosis', 'Seyir ve prognoz']].forEach(([k, label]) => {
            if (!cd[k]) return;
            toc.push([`lib-sec-${k}`, label]);
            // Masaüstünde kitaptaki gibi düz bölüm; telefonda kapalı açılır bölüm (uzun tanılar binlerce piksel olmasın)
            body += desktop
                ? `<section class="lib-sec lib-clin" id="lib-sec-${k}" aria-labelledby="lib-h-${k}">
                <h2 class="lib-sec-title" id="lib-h-${k}">${label}</h2>
                <div class="lib-prose"><p>${esc(cd[k])}</p></div>
            </section>`
                : `<details class="lib-sec lib-collapse" id="lib-sec-${k}">
                <summary class="lib-collapse-head"><h2 class="lib-sec-title">${label}</h2></summary>
                <div class="lib-prose"><p>${esc(cd[k])}</p></div>
            </details>`;
        });

        // 6. Ayırıcı tanı: aynı DSM-5-TR bölümündeki tanılar
        const siblings = this.diagnoses.filter(x => x.category === item.category && x.id !== item.id);
        if (siblings.length) {
            toc.push(['lib-sec-diff', 'Ayırıcı tanı']);
            body += `<section class="lib-sec lib-see" id="lib-sec-diff" aria-labelledby="lib-h-diff">
                <h2 class="lib-sec-title" id="lib-h-diff">Ayırıcı tanı</h2>
                <p class="lib-sec-note">Aynı DSM-5-TR bölümündeki (${esc(cat.name)}) diğer tanılar. Liste otomatik oluşturulur; klinik bir ayırıcı tanı listesi değildir.</p>
                ${this.libLinkList(siblings.map(x => ({ href: this.libHref('tani', x.id), title: x.nameTr, sub: x.nameEn })), 10)}
            </section>`;
        }

        // 7. Tedavi
        const tx = this.libTreatmentsForDiagnosis(item.id);
        if (tx.therapies.length || tx.pharma.length) {
            toc.push(['lib-sec-tx', 'Tedavi']);
            body += `<section class="lib-sec lib-refs" id="lib-sec-tx" aria-labelledby="lib-h-tx">
                <h2 class="lib-sec-title" id="lib-h-tx">Tedavi</h2>`;
            if (this.libHideTreatmentLinks()) {
                body += `<p class="lib-sec-note">Devam eden vakan bitince burada bu tanıyla eşleşen terapi ve ilaçlar görünür.</p>`;
            } else {
                body += `<p class="lib-sec-note">Oyunda bu tanıyla eşleştirilen protokoller.</p>`;
                if (tx.therapies.length) {
                    body += `<h3 class="lib-sub-title">Psikoterapi</h3>` + this.libLinkList(tx.therapies.map(t => ({
                        href: this.libHref('terapi', t.id), title: t.nameTr, sub: (this.therapyFamilies[t.family] || {}).name || ''
                    })));
                }
                if (tx.pharma.length) {
                    body += `<h3 class="lib-sub-title">Farmakoterapi ve biyolojik tedavi</h3>` + this.libLinkList(tx.pharma.map(p => ({
                        href: this.libHref('ilac', p.id), title: p.nameTr, sub: (this.pharmacologyFamilies[p.family] || {}).name || ''
                    })));
                }
            }
            body += `</section>`;
        }

        // 8. Bu alandan pratik yap (kategoriye göre; tanının kendisi değil)
        const n = this.cases.filter(c => c.category === item.category).length;
        if (n > 0) {
            body += `<section class="lib-practice lib-foot card" aria-labelledby="lib-h-practice">
                <div class="lib-practice-text">
                    <h2 class="lib-sec-title" id="lib-h-practice">Bu alandan pratik yap</h2>
                    <p class="lib-sec-note">${esc(cat.name)} bölümünden rastgele bir vaka, ${n} vaka arasından. Cevap belli olmasın diye tanı değil bölüm seçilir.</p>
                </div>
                <button class="btn btn-primary" type="button" data-lib-action="practice" data-cat="${esc(item.category)}">${this.icon('play')} Pratik yap</button>
            </section>`;
        }

        body += this.libDisclaimer('tani');

        html += `<div class="lib-detail-layout">
            <nav class="lib-toc" aria-label="Bu sayfada">
                <p class="lib-toc-title">Bu sayfada</p>
                <ol class="lib-toc-list">${toc.map(([id, label]) => `<li><button class="lib-toc-link" type="button" data-lib-jump="${id}">${label}</button></li>`).join('')}</ol>
            </nav>
            <div class="lib-detail-body">${body}</div>
        </div>`;
        return html;
    }

    renderTreatmentDetail(kind, item) {
        const esc = (s) => this.libEsc(s);
        const fams = kind === 'terapi' ? this.therapyFamilies : this.pharmacologyFamilies;
        const list = kind === 'terapi' ? this.therapies : this.pharmacology;
        const fam = fams[item.family] || { name: item.family || '' };
        const others = this.libOtherNamesOf(item);
        const strip = (s) => String(s || '').replace(/^\s*\d+[.)]\s*/, '');

        let html = this.libBackLink(kind);
        html += this.libCaseNotice();
        html += `<header class="lib-detail-head">
            ${this.libRunningHead(kind, item, fam.name)}
            <h1 class="lib-detail-title" id="libDetailTitle" tabindex="-1">${esc(item.nameTr)}</h1>
            ${item.nameEn ? `<p class="lib-detail-en" lang="en">${esc(item.nameEn)}</p>` : ''}
            ${others.length ? `<dl class="lib-meta"><div class="lib-meta-row"><dt>Diğer adları</dt><dd>${others.map(esc).join(' · ')}</dd></div></dl>` : ''}
        </header>`;

        let body = '';
        const sec = (id, title, inner) => `<section class="lib-sec" id="${id}" aria-labelledby="${id}-h"><h2 class="lib-sec-title" id="${id}-h">${title}</h2>${inner}</section>`;
        const secSee = (id, title, inner) => `<section class="lib-sec lib-see" id="${id}" aria-labelledby="${id}-h"><h2 class="lib-sec-title" id="${id}-h">${title}</h2>${inner}</section>`;
        if (item.shortDefinition) body += sec('lib-sec-def', 'Tanım', `<div class="lib-prose"><p>${esc(item.shortDefinition)}</p></div>`);
        if (kind === 'ilac' && item.mechanism) body += sec('lib-sec-mech', 'Etki mekanizması', `<div class="lib-prose"><p>${esc(item.mechanism)}</p></div>`);
        if (item.targetMechanism) body += sec('lib-sec-target', kind === 'terapi' ? 'Değişim mekanizması' : 'Hedef', `<div class="lib-prose"><p>${esc(item.targetMechanism)}</p></div>`);
        if (Array.isArray(item.protocolSteps) && item.protocolSteps.length) {
            body += sec('lib-sec-steps', kind === 'terapi' ? 'Protokol adımları' : 'Uygulama ve endikasyon',
                `<ol class="lib-steps">${item.protocolSteps.map(s => `<li>${esc(strip(s))}</li>`).join('')}</ol>`);
        }
        if (item.pitfalls) {
            body += `<aside class="lib-callout lib-note-box" aria-labelledby="lib-h-pit">
                <h2 class="lib-callout-title" id="lib-h-pit">${this.icon('alert')}${kind === 'terapi' ? 'Klinik tuzak' : 'Kontrendikasyon ve yan etki'}</h2>
                <p>${esc(item.pitfalls)}</p>
            </aside>`;
        }

        const diags = this.libDiagnosesForTreatment(kind, item);
        if (diags.length) {
            body += `<section class="lib-sec lib-see" id="lib-sec-used" aria-labelledby="lib-h-used"><h2 class="lib-sec-title" id="lib-h-used">Kullanıldığı tanılar</h2>`;
            if (this.libHideTreatmentLinks()) {
                body += `<p class="lib-sec-note">Devam eden vakan bitince burada bu protokolle eşleşen tanılar görünür.</p>`;
            } else {
                body += `<p class="lib-sec-note">Oyunda bu protokolle eşleştirilen tanılar (${diags.length}).</p>` +
                    this.libLinkList(diags.map(x => ({ href: this.libHref('tani', x.id), title: x.nameTr, sub: (this.categories[x.category] || {}).name || '' })));
            }
            body += `</section>`;
        }

        const siblings = list.filter(x => x.family === item.family && x.id !== item.id);
        if (siblings.length) {
            body += secSee('lib-sec-family', kind === 'terapi' ? 'Aynı ekolden' : 'Aynı gruptan',
                this.libLinkList(siblings.map(x => ({ href: this.libHref(kind, x.id), title: x.nameTr, sub: x.nameEn || '' })), 8));
        }

        body += this.libDisclaimer(kind);
        html += `<div class="lib-detail-layout lib-detail-layout-single"><div class="lib-detail-body">${body}</div></div>`;
        return html;
    }

    /** Tanı sayfasındaki "Bu alandan pratik yap": kategori filtresiyle pratik başlatır. */
    startPracticeFromCategory(cat) {
        if (!cat || !this.categories[cat]) return;
        this.activeCategoryFilter = cat;
        this.activeCourseFilter = 'ALL';
        if (this.dom.filterBar) this.renderCategoryFilters();
        if (this.dom.courseNav) this.renderCourseFilters();
        this.updatePracticeSummary();
        this.setMode('practice');
    }

    /** Vaka sonu: doğru cevabın kütüphane sayfalarına bağlantılar (oyun sürerken çağrılmaz). */
    libResultLinksHTML() {
        if (!this.currentCase) return '';
        const mode = this.caseTargetMode || this.targetGameMode;
        const diag = this.diagnoses.find(x => x.id === this.currentCase.diagnosisId);
        const therapy = this.therapies.find(x => x.id === (this.currentCase.therapyId || 'cbt_general'));
        const pharma = this.pharmacology.find(x => x.id === (this.currentCase.pharmacologyId || this.getFallbackPharmacologyId(this.currentCase)));
        const links = [];
        if (diag) links.push([this.libHref('tani', diag.id), 'Tanı sayfasını aç', 'book']);
        if (therapy && (mode === 'therapy' || mode === 'combo')) links.push([this.libHref('terapi', therapy.id), 'Terapi sayfasını aç', 'shield']);
        if (pharma && (mode === 'pharmacology' || mode === 'combo')) links.push([this.libHref('ilac', pharma.id), 'İlaç sayfasını aç', 'pill']);
        return links.map(([href, label, ic]) => `<a class="btn btn-ghost btn-sm lib-result-link" href="${href}">${this.icon(ic)}${label}</a>`).join('');
    }

    renderResultLibraryLinks() {
        const html = this.libResultLinksHTML();
        [this.dom.playResultLinks, this.dom.resultLibraryLinks].forEach(el => {
            if (!el) return;
            el.innerHTML = html;
            el.hidden = !html;
        });
    }

    // --- Statistics ---
    loadStats() {
        const saved = localStorage.getItem('psikovaka_stats');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return {
            played: 0,
            won: 0,
            currentStreak: 0,
            maxStreak: 0,
            distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
        };
    }

    recordStats(won, guessCount) {
        this.stats.played++;
        if (won) {
            this.stats.won++;
            this.stats.currentStreak++;
            if (this.stats.currentStreak > this.stats.maxStreak) {
                this.stats.maxStreak = this.stats.currentStreak;
            }
            if (this.stats.distribution[guessCount] !== undefined) {
                this.stats.distribution[guessCount]++;
            }
        } else {
            this.stats.currentStreak = 0;
        }
        localStorage.setItem('psikovaka_stats', JSON.stringify(this.stats));
    }

    openStatsModal() {
        document.getElementById('statPlayed').textContent = this.stats.played;
        const winRate = this.stats.played > 0 ? Math.round((this.stats.won / this.stats.played) * 100) : 0;
        document.getElementById('statWinRate').textContent = `%${winRate}`;
        document.getElementById('statStreak').textContent = this.stats.currentStreak;
        document.getElementById('statMaxStreak').textContent = this.stats.maxStreak;

        const distContainer = document.getElementById('statDistribution');
        distContainer.innerHTML = '';

        const maxVal = Math.max(...Object.values(this.stats.distribution), 1);

        for (let i = 1; i <= 6; i++) {
            const count = this.stats.distribution[i] || 0;
            const pct = Math.max(7, Math.round((count / maxVal) * 100));

            const row = document.createElement('div');
            row.className = 'dist-row';
            row.innerHTML = `
                <span class="dist-label">${i}</span>
                <div class="dist-track"><div class="dist-bar${count > 0 ? ' has-value' : ''}">${count}</div></div>
            `;
            row.querySelector('.dist-bar').style.width = `${pct}%`;
            distContainer.appendChild(row);
        }

        this.openModal(this.dom.statsModal);
    }

    /** Ses ve titreşim ayarı (H14): localStorage psikovaka_sound, varsayılan açık. */
    isSoundOn() {
        try { return localStorage.getItem('psikovaka_sound') !== '0'; } catch (e) { return true; }
    }

    setSoundOn(on) {
        try { localStorage.setItem('psikovaka_sound', on ? '1' : '0'); } catch (e) {}
        this.syncSoundToggle();
        if (on) this.playTone('warm');
    }

    syncSoundToggle() {
        const btn = document.getElementById('soundToggleBtn');
        if (!btn) return;
        const on = this.isSoundOn();
        btn.setAttribute('aria-checked', on ? 'true' : 'false');
        const lbl = document.getElementById('soundToggleLabel');
        if (lbl) lbl.textContent = on ? 'Açık' : 'Kapalı';
        const ico = document.getElementById('soundToggleIcon');
        if (ico) ico.innerHTML = this.icon(on ? 'volume' : 'volume-x');
    }

    /** Tek paylaşılan AudioContext (her ses için yenisi açılmaz). */
    getAudioCtx() {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        if (!this._audioCtx) this._audioCtx = new AudioCtx();
        if (this._audioCtx.state === 'suspended' && this._audioCtx.resume) { try { this._audioCtx.resume(); } catch (e) {} }
        return this._audioCtx;
    }

    playTone(type) {
        if (!this.isSoundOn()) return;
        // Telefonda kısa titreşim (yalnızca vaka ekranında; ses ayarı kapalıysa titreşim de yok)
        if (this.currentScreen === 'play' && navigator.vibrate) {
            try { navigator.vibrate(type === 'win' ? 30 : [20, 40, 20]); } catch (e) {}
        }
        try {
            const ctx = this.getAudioCtx();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            const t = ctx.currentTime;

            if (type === 'win') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, t);
                osc.frequency.setValueAtTime(659.25, t + 0.1);
                osc.frequency.setValueAtTime(783.99, t + 0.2);
                osc.frequency.setValueAtTime(1046.50, t + 0.3);
                gain.gain.setValueAtTime(0.15, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
                osc.start(t);
                osc.stop(t + 0.6);
            } else if (type === 'warm') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, t);
                osc.frequency.setValueAtTime(554.37, t + 0.1);
                gain.gain.setValueAtTime(0.1, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
                osc.start(t);
                osc.stop(t + 0.25);
            } else {
                // yanlış: yumuşak tek nota (bölüm 3: 250 Hz yerine 330 Hz sinüs)
                osc.type = 'sine';
                osc.frequency.setValueAtTime(330, t);
                gain.gain.setValueAtTime(0.08, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
                osc.start(t);
                osc.stop(t + 0.2);
            }
        } catch (e) {}
    }

    launchConfetti() {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#3b6fd6', '#2f9e62', '#e0a800', '#e5484d', '#7ea6ff', '#c93838'];

        for (let i = 0; i < 90; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15 - 5,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10
            });
        }

        let animationFrame;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let activeCount = 0;
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.32;
                p.rotation += p.rotSpeed;
                if (p.y < canvas.height) {
                    activeCount++;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.restore();
                }
            });
            if (activeCount > 0) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                cancelAnimationFrame(animationFrame);
                canvas.remove();
            }
        };
        animate();
    }

    openModal(modal) {
        if (!modal) return;
        if (!modal.classList.contains('open')) {
            modal._returnFocus = document.activeElement;
        }
        modal.classList.add('open');
        document.body.classList.add('modal-open');
        const body = modal.querySelector('.modal-body');
        if (body) body.scrollTop = 0;
        const focusTarget = modal.querySelector('.modal-header .btn-close-modal') || modal.querySelector('button');
        // pencere bu arada kapandıysa (ör. hemen Esc) odağı gizli düğmeye taşıma
        if (focusTarget) setTimeout(() => { if (!modal.classList.contains('open')) return; try { focusTarget.focus({ preventScroll: true }); } catch (e) {} }, 30);
    }

    closeModal(modal) {
        if (!modal) return;
        const wasOpen = modal.classList.contains('open');
        modal.classList.remove('open');
        if (!document.querySelector('.modal-backdrop.open')) {
            document.body.classList.remove('modal-open');
        }
        if (wasOpen && modal._returnFocus && document.body.contains(modal._returnFocus) && typeof modal._returnFocus.focus === 'function') {
            try { modal._returnFocus.focus({ preventScroll: true }); } catch (e) {}
        }
        modal._returnFocus = null;
    }

    /**
     * Kısa bildirim. Aynı anda tek bildirim: yenisi gelince eskisi kalkar (H1).
     * Oyun ekranında yalnızca hata/uyarı bildirimleri kullanılır; bilgi zaten ekranda (ipucu kartı, tahmin şeridi).
     */
    showToast(message, opts = {}) {
        if (!this.dom || !this.dom.toastContainer) return;
        const box = this.dom.toastContainer;
        Array.from(box.children).forEach(el => el.remove());
        clearTimeout(this._toastTimer); clearTimeout(this._toastTimer2);
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        box.appendChild(toast);
        this._toastTimer = setTimeout(() => {
            toast.classList.add('is-leaving');
            this._toastTimer2 = setTimeout(() => { if (toast.parentNode) toast.remove(); }, 350);
        }, opts.duration || 3000);
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('psikovaka_theme', next);
        applyThemeChrome(next);
    }
}

/** Tema düğmesinin simgesi/etiketi ve tarayıcı tema rengi */
function applyThemeChrome(theme) {
    const iconEl = document.getElementById('themeToggleIcon');
    const labelEl = document.getElementById('themeToggleLabel');
    if (iconEl) iconEl.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#i-${theme === 'light' ? 'sun' : 'moon'}"/></svg>`;
    if (labelEl) labelEl.textContent = theme === 'light' ? 'Açık' : 'Koyu';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#eef0f3' : '#0f1117');
}

window.addEventListener('DOMContentLoaded', () => {
    const studioSelect = document.getElementById('studioDiagnosisSelect');
    if (studioSelect && typeof DIAGNOSES_DATABASE !== 'undefined') {
        DIAGNOSES_DATABASE.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.id;
            opt.textContent = `${d.nameTr} (${d.nameEn})`;
            studioSelect.appendChild(opt);
        });
    }

    const savedTheme = localStorage.getItem('psikovaka_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    applyThemeChrome(savedTheme);

    if (typeof attachAvatarStudioToGame === 'function') {
        attachAvatarStudioToGame(PsikoVakaGame);
    }
    window.game = new PsikoVakaGame();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PsikoVakaGame };
}
