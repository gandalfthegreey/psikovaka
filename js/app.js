/**
 * PsikoVaka 2.0 - Klinik Vaka, Terapi, Psikofarmakoloji, Tam Konsültasyon (Kombo) & Canlı Düello Motoru
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
        this.activeDuelChallenge = null; // { caseId, mode, challengerName, challengerGuesses, challengerTimeSec, roomCode }
        this.peer = null;
        this.peerConn = null;
        this.broadcastChannel = null;
        this.duelMyNickname = localStorage.getItem('psikovaka_nickname') || 'Klinisyen';

        this.stats = this.loadStats();

        this.currentScreen = null;
        this.currentRoute = 'oyna';
        this.caseTargetMode = null;
        this.playHistoryPushed = false;

        this.initDOM();
        this.applyActivePack(this.activePackId, false);
        this.initEventListeners();
        if (typeof this.initOnlineArena === 'function') {
            this.initOnlineArena();
        }
        this.installProfileMirrors();
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
            online: this.dom.screenOnline,
            kutuphane: this.dom.screenLibrary,
            profil: this.dom.screenProfile
        };

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
        const m = /^#\/([a-z]+)/.exec(window.location.hash || '');
        if (m && this.routeScreens && this.routeScreens[m[1]]) return m[1];
        return null;
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
    }

    /** name: 'oyna' | 'online' | 'kutuphane' | 'profil' | 'play' */
    showScreen(name) {
        const all = [this.dom.screenHome, this.dom.screenOnline, this.dom.screenLibrary, this.dom.screenProfile, this.dom.screenPlay];
        const target = name === 'play' ? this.dom.screenPlay : (this.routeScreens && this.routeScreens[name]);
        all.forEach(s => { if (s) s.hidden = (s !== target); });

        const isPlay = name === 'play';
        document.body.classList.toggle('is-playing', isPlay);

        document.querySelectorAll('[data-route]').forEach(link => {
            const active = !isPlay && link.dataset.route === name;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });

        const changed = this.currentScreen !== name;
        this.currentScreen = name;

        if (name === 'oyna') { this.updateHomeMeta(); this.updatePracticeSummary(); }
        if (name === 'profil') this.updateProfileScreen();

        if (changed) {
            window.scrollTo(0, 0);
            if (this.dom.appMain && !isPlay) {
                try { this.dom.appMain.focus({ preventScroll: true }); } catch (e) {}
            }
        }
    }

    enterPlayScreen() {
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

        if (prev.state !== snap.state || ev.type === 'profile_saved') {
            const board = document.getElementById('tabArenaScoreboard');
            if (board && board.style.display !== 'none' && this.isModalOpen(this.dom.duelCenterModal) && typeof this.renderRankedScoreboardTab === 'function') {
                this.renderRankedScoreboardTab();
            }
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
        this.profilePushTimer = setTimeout(async () => {
            this.profilePushTimer = null;
            const latest = this.buildProfilePatch(this.accountSnap.profile);
            if (!latest || !this.accountReady()) return;
            this.profilePushInFlight = true;
            let r;
            try { r = await this.account.saveProfile(latest); } catch (e) { r = { ok: false }; }
            this.profilePushInFlight = false;
            if (typeof this.setAvatarSaveStatus === 'function' && latest.avatar) this.setAvatarSaveStatus(r && r.ok ? 'saved' : 'error');
            if (!r || !r.ok) {
                const now = Date.now();
                if (!this.lastPushErrorAt || now - this.lastPushErrorAt > 30000) {
                    this.lastPushErrorAt = now;
                    this.showToast(`Profil sunucuya kaydedilemedi. ${(r && r.error && r.error.message) || ''}`.trim());
                }
            }
        }, 1200);
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
            if (typeof this.openDuelCenterModal === 'function') this.openDuelCenterModal('tabArenaAvatar');
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
        if (this.dom.homeRpMount) this.dom.homeRpMount.textContent = (rp !== null && rp !== undefined) ? `${rp} RP` : '';
        if (hasAvatar) {
            if (this.dom.navAvatarMount) this.dom.navAvatarMount.innerHTML = renderFunnyAvatarSVG(this.myAvatar, 28);
            if (this.dom.homeAvatarMount) this.dom.homeAvatarMount.innerHTML = renderFunnyAvatarSVG(this.myAvatar, 44);
            const profileAvatar = document.getElementById('headerFunnyAvatarMount');
            if (profileAvatar) profileAvatar.innerHTML = renderFunnyAvatarSVG(this.myAvatar, 64);
        }
        const nameMount = document.getElementById('headerPlayerNameMount');
        if (nameMount) nameMount.textContent = name;
        const rpMount = document.getElementById('headerPlayerRpMount');
        if (rpMount && rp !== null && rp !== undefined) {
            rpMount.textContent = `${rp} RP`;
            rpMount.style.color = '';
        }
        if (this.dom.profileTierLabel) this.dom.profileTierLabel.textContent = tier ? tier.name : '';
        const tierBadge = document.getElementById('profileTierBadge');
        if (tierBadge) tierBadge.innerHTML = tier ? LG.badge(rp, 22) : '';
        const tierProg = document.getElementById('profileTierProgress');
        if (tierProg) tierProg.textContent = tier ? LG.progressText(rp) : '';
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
            if (differs) a.profileRpNote.textContent = `Sıralama puanı sunucuda herkes için 250 RP ile başlar; bu cihazdaki ${localRp} RP aktarılmaz.`;
        }
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
                this.dom.dailyDateLabel.textContent = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });
            } catch (e) {
                this.dom.dailyDateLabel.textContent = this.getDailySeed();
            }
        }
        if (this.dom.homeResume) {
            const canResume = !!(this.currentCase && !this.isGameOver && this.caseTargetMode === this.targetGameMode);
            this.dom.homeResume.hidden = !canResume;
            if (canResume && this.dom.homeResumeLabel) this.dom.homeResumeLabel.textContent = this.currentDisplayTitle || 'Vaka';
        }
        const setCount = (el, txt) => { if (el) el.textContent = txt; };
        setCount(this.dom.libDsmCount, `${this.diagnoses.length} tanı, ${Object.keys(this.categories).length} kategori`);
        setCount(this.dom.libTherapyCount, `${this.therapies.length} yöntem, ${Object.keys(this.therapyFamilies).length} ekol`);
        setCount(this.dom.libPharmaCount, `${this.pharmacology.length} protokol, ${Object.keys(this.pharmacologyFamilies).length} grup`);
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
        if (diagId === 'mdd_with_psychotic') return 'ect_biological_acute';
        if (diagId === 'catatonia_associated' || diagId === 'catatonia_medical') return 'lorazepam_catatonia';
        if (diagId === 'wernicke_korsakoff_syndrome') return 'thiamine_iv_wernicke';
        if (diagId === 'narcolepsy') return 'modafinil_oxybate';
        if (diagId === 'rem_sleep_behavior_disorder' || diagId === 'sleepwalking_disorder') return 'clonazepam_parasomnia';
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
            { id: 'pack1', title: '🏛️ Paket 1: Çekirdek Vakalar', from: 1, to: 29,
              desc: 'Duygudurum, anksiyete, psikotik, OKB, kişilik ve yeme bozukluklarının klasik tabloları.' },
            { id: 'pack2', title: '📘 Paket 2: Klinik Derinlik', from: 30, to: 49,
              desc: 'Kişilik, travma, dissosiyatif, yeme, nörogelişimsel ve dürtü kontrol vakaları.' },
            { id: 'pack3', title: '🔬 Paket 3: İleri Ayırıcı Tanı', from: 50, to: 69,
              desc: 'Psikotik, bipolar, OKB ile ilişkili, anksiyete ve dürtü kontrol vakalarında ayırıcı tanı.' },
            { id: 'pack4', title: '⚡ Paket 4: Özel Sendromlar', from: 70, to: 89,
              desc: 'Parafilik, uyku-uyanıklık, cinsel işlev ve nörobilişsel bozukluk vakaları.' },
            { id: 'pack5', title: '🧠 Paket 5: Nöropsikiyatri', from: 90, to: 109,
              desc: 'Uyku, nörobilişsel, nörogelişimsel ve parafilik bozukluk vakaları; psikotik ve duygudurum tabloları.' },
            { id: 'pack6', title: '🔥 Paket 6: Master Klinik & İlaç', from: 110, to: 150,
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
            title: '🚀 Yeni Vakalar',
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
                title: `🌟 Tüm Vakalar (Tam Koleksiyon)`,
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
        this.showToast("🧹 Çözülen vaka geçmişi sıfırlandı! Tüm vakalar tekrar yeni olarak işaretlendi.");
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
            dsmGuideBtn: document.getElementById('dsmGuideBtn'),
            therapyGuideBtn: document.getElementById('therapyGuideBtn'),
            pharmaGuideBtn: document.getElementById('pharmaGuideBtn'),
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

            // Input & Autocomplete
            diagnosisInput: document.getElementById('diagnosisInput'),
            btnSubmit: document.getElementById('btnSubmit'),
            btnSubmitLabel: document.getElementById('btnSubmitLabel'),
            autocompleteDropdown: document.getElementById('autocompleteDropdown'),
            remainingGuessesText: document.getElementById('remainingGuessesText'),
            guessDots: document.getElementById('guessDots'),
            btnGiveUp: document.getElementById('btnGiveUp'),
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
            dsmGuideModal: document.getElementById('dsmGuideModal'),
            therapyGuideModal: document.getElementById('therapyGuideModal'),
            pharmaGuideModal: document.getElementById('pharmaGuideModal'),
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
                if (this.currentCase && !this.isGameOver) this.enterPlayScreen();
            });
        }
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

        // Finished Actions on Main Screen
        if (this.dom.btnMainNextCase) {
            this.dom.btnMainNextCase.addEventListener('click', () => {
                if (this.activeDuelChallenge && this.activeDuelChallenge.isRoomDuel) {
                    this.nextRoomDuelCase();
                } else {
                    this.setMode('practice');
                }
            });
        }
        if (this.dom.btnMainShowReport) {
            this.dom.btnMainShowReport.addEventListener('click', () => this.openResultModal(this.gameWon));
        }
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
        this.dom.dsmGuideBtn.addEventListener('click', () => this.openDsmGuideModal());
        if (this.dom.therapyGuideBtn) {
            this.dom.therapyGuideBtn.addEventListener('click', () => this.openTherapyGuideModal());
        }
        if (this.dom.pharmaGuideBtn) {
            this.dom.pharmaGuideBtn.addEventListener('click', () => this.openPharmaGuideModal());
        }
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
                this.showToast(`🌟 Tüm ${this.allMasterCases.length} vaka aktif havuza alındı!`);
            });
        }

        const btnResetSolved = document.getElementById('btnResetSolvedHistory');
        if (btnResetSolved) {
            btnResetSolved.addEventListener('click', () => this.resetSolvedCases());
        }

        // Duel Center Modal Actions
        const btnStartMM = document.getElementById('btnStartMatchmaking');
        if (btnStartMM) {
            btnStartMM.addEventListener('click', () => this.startMatchmaking());
        }
        const btnCancelMM = document.getElementById('btnCancelMatchmaking');
        if (btnCancelMM) {
            btnCancelMM.addEventListener('click', () => this.cancelMatchmaking());
        }

        const btnCreateRoom = document.getElementById('btnCreateLiveDuelRoom');
        if (btnCreateRoom) {
            btnCreateRoom.addEventListener('click', () => this.createLiveDuelRoom());
        }
        const btnJoinRoom = document.getElementById('btnJoinLiveDuelRoom');
        if (btnJoinRoom) {
            btnJoinRoom.addEventListener('click', () => {
                const code = (document.getElementById('joinRoomCodeInput').value || '').trim().toUpperCase();
                if (code) this.joinLiveDuelRoom(code);
            });
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
        // Yeni arayüz: açılışta vaka otomatik başlamaz, ana sayfa (veya #/rota) gösterilir.
        if (!hash || hash.startsWith('#/')) {
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

        if (hash.startsWith('#id=')) {
            const targetId = hash.replace('#id=', '').trim().toLowerCase();
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
            this.startCase(this.currentCase, this.currentDisplayTitle || 'Vaka');
        }

        const modeMessages = {
            diagnosis: "🩺 DSM-5 Tanı Avcısı Modu Aktif!",
            therapy: "🛡️ Terapi Simülatörü Aktif! Altın standart psikoterapiyi bulun.",
            pharmacology: "💊 Farmakoterapi Avcısı Aktif! Birinci basamak ilacı/müdahaleyi seçin.",
            combo: "⚡ Tam Konsültasyon (Kombo) Modu! Sırasıyla Tanı ➔ Terapi ➔ İlaç belirleyin!"
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
                if (this.dom.diagnosisInput) this.dom.diagnosisInput.placeholder = isCombo ? 'Aşama 2: terapi yaz' : 'Terapi yöntemi yaz';
            } else if (effectiveType === 'pharmacology') {
                this.dom.categoryBrowserIcon.innerHTML = this.icon('pill');
                this.dom.categoryBrowserLabel.textContent = 'Gruplar';
                if (this.dom.btnCategoryBrowser) this.dom.btnCategoryBrowser.setAttribute('aria-label', 'İlaç gruplarından seç');
                if (this.dom.treePanelTitle) this.dom.treePanelTitle.textContent = 'İlaç grupları';
                if (this.dom.diagnosisInput) this.dom.diagnosisInput.placeholder = isCombo ? 'Aşama 3: ilaç yaz' : 'İlaç ya da müdahale yaz';
            } else {
                this.dom.categoryBrowserIcon.innerHTML = this.icon('folder');
                this.dom.categoryBrowserLabel.textContent = 'Kategoriler';
                if (this.dom.btnCategoryBrowser) this.dom.btnCategoryBrowser.setAttribute('aria-label', 'DSM-5-TR kategorilerinden seç');
                if (this.dom.treePanelTitle) this.dom.treePanelTitle.textContent = `DSM-5-TR kategorileri (${this.diagnoses.length} tanı)`;
                if (this.dom.diagnosisInput) this.dom.diagnosisInput.placeholder = isCombo ? 'Aşama 1: tanı yaz' : 'Tanı yaz';
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
                fragment.appendChild(this.buildTreeGroupElement(fam.icon || '🛡️', fam.name, `${items.length} Yöntem`, items, cleanQuery, (id) => {
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
                fragment.appendChild(this.buildTreeGroupElement(fam.icon || '💊', fam.name, `${items.length} Protokol`, items, cleanQuery, (id) => {
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
                fragment.appendChild(this.buildTreeGroupElement(cat.icon || '🏷️', cat.name, `${items.length} Tanı`, items, cleanQuery, (id) => {
                    return this.diagnoses.find(d => d.id === id);
                }));
            });
        }

        container.appendChild(fragment);
    }

    buildTreeGroupElement(icon, groupName, countText, items, cleanQuery, finderFn) {
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

    loadDailyCase() {
        const seedStr = this.getDailySeed();
        let hash = 0;
        for (let i = 0; i < seedStr.length; i++) {
            hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
            hash |= 0;
        }
        const index = Math.abs(hash) % this.cases.length;
        const dailyCase = this.cases[index];

        this.startCase(dailyCase, `Günün vakası · #${dailyCase.caseNumber || (index + 1)}`);
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
                this.showToast("🎉 Bu filtredeki tüm vakaları çözdünüz! Havuz baştan karıştırılıyor.");
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
        this.currentCase = caseData;
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
        this.enterPlayScreen();
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

        for (let i = 0; i < this.maxClues; i++) {
            const isUnlocked = (i < this.unlockedClues);
            const isLatest = isUnlocked && !this.isGameOver && i === this.unlockedClues - 1;
            const clueBox = document.createElement('article');
            clueBox.className = `clue-box ${isUnlocked ? 'active' : 'locked'}${isLatest ? ' is-latest' : ''}`;

            if (isUnlocked) {
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
            } else {
                clueBox.innerHTML = `
                    <div class="clue-header">
                        <span class="clue-num">${this.icon('lock')}</span>
                        <span class="clue-tag">${clueLabels[i]}</span>
                    </div>
                    <span class="clue-locked-note">${i}. yanlışta açılır</span>
                `;
            }

            this.dom.cluesContainer.appendChild(clueBox);
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
        if (latest && this.unlockedClues > 1 && typeof latest.scrollIntoView === 'function') {
            const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
        this.dom.guessesFeed.innerHTML = '';

        this.guesses.forEach((guess, index) => {
            const card = document.createElement('div');
            let cardClass = 'guess-card wrong';
            let statusText = 'Farklı grup';
            let iconName = 'x';

            if (guess.isCorrect) {
                cardClass = 'guess-card correct';
                statusText = 'Doğru';
                iconName = 'check';
            } else if (guess.categoryMatch) {
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

    updateRemainingGuessesUI() {
        const remaining = Math.max(0, this.maxClues - this.guesses.length);
        this.dom.remainingGuessesText.textContent = `Kalan hak ${remaining}/${this.maxClues}`;

        this.dom.guessDots.innerHTML = '';
        for (let i = 0; i < this.maxClues; i++) {
            const dot = document.createElement('div');
            dot.className = 'guess-dot';
            if (i < this.guesses.length) {
                dot.classList.add('used');
            } else if (i === this.guesses.length) {
                dot.classList.add('active');
            }
            this.dom.guessDots.appendChild(dot);
        }
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
                const fam = this.therapyFamilies[item.family] || { name: item.family, icon: '🛡️' };
                div.innerHTML = `
                    <div class="item-main">
                        <span class="item-name-tr">${item.nameTr}</span>
                        <span class="item-name-en">${item.nameEn}</span>
                    </div>
                    <span class="therapy-family-tag">${fam.icon || '🛡️'} ${fam.name}</span>
                `;
            } else if (effectiveType === 'pharmacology') {
                const fam = this.pharmacologyFamilies[item.family] || { name: item.family, icon: '💊' };
                div.innerHTML = `
                    <div class="item-main">
                        <span class="item-name-tr">${item.nameTr}</span>
                        <span class="item-name-en">${item.nameEn}</span>
                    </div>
                    <span class="pharma-family-tag">${fam.icon || '💊'} ${fam.name}</span>
                `;
            } else {
                const categoryObj = this.categories[item.category] || { name: item.category };
                div.innerHTML = `
                    <div class="item-main">
                        <span class="item-name-tr">${item.nameTr}</span>
                        <span class="item-name-en">${item.nameEn}</span>
                    </div>
                    <span class="item-category-badge">${categoryObj.icon || '🏷️'} ${categoryObj.name}</span>
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
            this.showToast("Lütfen bir seçim yazın veya soldaki kategorilerden seçin.");
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
                this.showToast("❓ Terapi listede bulunamadı! Lütfen önerilen listeden seçin.");
                return;
            }
            const targetTherapyId = this.currentCase.therapyId || 'cbt_general';
            const targetTherapyObj = this.therapies.find(t => t.id === targetTherapyId);
            isCorrect = (chosenObj.id === targetTherapyId);
            categoryMatch = (!isCorrect && targetTherapyObj && chosenObj.family === targetTherapyObj.family);
            const famObj = this.therapyFamilies[chosenObj.family] || {};
            categoryName = famObj.name || chosenObj.family;
            correctLabel = '🛡️ Altın Standart Terapi!';
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
                this.showToast("❓ Farmakoterapi protokolü bulunamadı! Lütfen listeden seçin.");
                return;
            }
            const targetPharmaId = this.currentCase.pharmacologyId || this.getFallbackPharmacologyId(this.currentCase);
            const targetPharmaObj = this.pharmacology.find(p => p.id === targetPharmaId);
            isCorrect = (chosenObj.id === targetPharmaId);
            categoryMatch = (!isCorrect && targetPharmaObj && chosenObj.family === targetPharmaObj.family);
            const famObj = this.pharmacologyFamilies[chosenObj.family] || {};
            categoryName = famObj.name || chosenObj.family;
            correctLabel = '💊 Doğru Farmakoterapi Protokolü!';
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
                this.showToast("❓ Tanı listede bulunamadı! Lütfen önerilen tanı listesinden seçin.");
                return;
            }
            isCorrect = (chosenObj.id === this.currentCase.diagnosisId);
            const correctDiagnosisObj = this.diagnoses.find(d => d.id === this.currentCase.diagnosisId);
            categoryMatch = (!isCorrect && correctDiagnosisObj && chosenObj.category === correctDiagnosisObj.category);
            const categoryObj = this.categories[chosenObj.category] || {};
            categoryName = categoryObj.name || chosenObj.category;
            correctLabel = '🩺 Kesin DSM-5 Tanısı!';
            wrongLabel = 'Farklı Tanı Grubu';
            if (this.targetGameMode === 'combo') stageBadge = 'Aşama 1 • Tanı';
        }

        if (this.guesses.some(g => g.itemId === chosenObj.id && g.stage === this.comboStage)) {
            this.showToast("⚠️ Bu seçeneği zaten tahmin ettiniz!");
            return;
        }

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
        this.dom.diagnosisInput.value = '';
        delete this.dom.diagnosisInput.dataset.selectedId;
        this.closeAutocomplete();

        this.playTone(isCorrect ? 'win' : (categoryMatch ? 'warm' : 'cold'));

        // Broadcast live duel progress if in room duel
        this.broadcastDuelProgress(false);

        if (isCorrect) {
            if (this.targetGameMode === 'combo' && this.comboStage < 3) {
                // Advance to next Combo Stage!
                if (this.comboStage === 1) {
                    this.comboResults.stage1Guesses = this.guesses.filter(g => g.stage === 1).length;
                    if (this.dom.comboStep1Val) this.dom.comboStep1Val.textContent = `✅ ${chosenObj.nameTr}`;
                    if (this.dom.comboStep2Val) this.dom.comboStep2Val.textContent = 'Şimdi Terapiyi Seçin!';
                    this.comboStage = 2;
                    this.guesses = []; // Reset 6-guess allowance for Stage 2
                    this.updateComboStepperUI();
                    this.syncInputAndBrowserLabels();
                    this.renderGuesses();
                    this.updateRemainingGuessesUI();
                    this.showToast("🎉 Aşama 1 (Tanı) Tamamlandı! Şimdi Aşama 2: Altın Standart Psikoterapiyi Seçin!");
                    return;
                } else if (this.comboStage === 2) {
                    this.comboResults.stage2Guesses = this.guesses.filter(g => g.stage === 2).length;
                    if (this.dom.comboStep2Val) this.dom.comboStep2Val.textContent = `✅ ${chosenObj.nameTr}`;
                    if (this.dom.comboStep3Val) this.dom.comboStep3Val.textContent = 'Şimdi Farmakoterapiyi Seçin!';
                    this.comboStage = 3;
                    this.guesses = []; // Reset 6-guess allowance for Stage 3
                    this.updateComboStepperUI();
                    this.syncInputAndBrowserLabels();
                    this.renderGuesses();
                    this.updateRemainingGuessesUI();
                    this.showToast("🛡️ Aşama 2 (Terapi) Tamamlandı! Şimdi Aşama 3: Birinci Basamak İlacı/Müdahaleyi Seçin!");
                    return;
                }
            }

            if (this.targetGameMode === 'combo' && this.comboStage === 3) {
                this.comboResults.stage3Guesses = this.guesses.filter(g => g.stage === 3).length;
                if (this.dom.comboStep3Val) this.dom.comboStep3Val.textContent = `✅ ${chosenObj.nameTr}`;
            }

            this.handleGameEnd(true);
        } else {
            if (this.unlockedClues < this.maxClues) {
                this.unlockedClues++;
            }

            if (this.guesses.length >= this.maxClues) {
                this.handleGameEnd(false);
            } else {
                this.renderClues();
                this.renderGuesses();
                this.updateRemainingGuessesUI();

                if (categoryMatch) {
                    this.showToast(`🟨 Sıcak! Grup Doğru (${guessData.categoryName}), spesifik seçeneği daraltın!`);
                } else {
                    this.showToast(`Yeni ipucu açıldı! 🔍 (${this.unlockedClues}/${this.maxClues})`);
                }
            }
        }
    }

    giveUp() {
        if (this.isGameOver) return;
        this.unlockedClues = this.maxClues;
        this.handleGameEnd(false);
    }

    handleGameEnd(won) {
        this.isGameOver = true;
        this.gameWon = won;
        this.dom.diagnosisInput.disabled = true;
        this.dom.btnSubmit.disabled = true;

        if (this.dom.finishedActions) this.dom.finishedActions.hidden = false;
        if (this.dom.mainInputSection) this.dom.mainInputSection.hidden = true;
        this.closeAutocomplete();
        this.closeCategoryTree();
        this.renderInlineResult(won);

        this.unlockedClues = this.maxClues;
        this.updateComboStepperUI();

        if (won && this.currentCase) {
            this.markCaseAsSolved(this.currentCase.id);
        }

        this.renderClues();
        this.renderGuesses();
        this.updateRemainingGuessesUI();

        this.recordStats(won, this.guesses.length);
        this.broadcastDuelProgress(true, won);

        if (won) {
            this.launchConfetti();
        }

        setTimeout(() => {
            this.openResultModal(won);
        }, 500);
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
                ? `${this.guesses.length}. tahminde bildin · ${this.elapsedSeconds} sn`
                : 'Bu sefer olmadı';
        }
        if (this.dom.playResultAnswer) this.dom.playResultAnswer.textContent = answer ? `Doğru cevap: ${answer}` : '';
        if (this.dom.btnMainNextCase && !(this.activeDuelChallenge && this.activeDuelChallenge.isRoomDuel)) {
            this.dom.btnMainNextCase.disabled = false;
            this.dom.btnMainNextCase.textContent = this.currentMode === 'daily' ? 'Pratiğe devam et' : 'Sıradaki vaka';
        }
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
            heading.textContent = won ? `${this.guesses.length}. ipucunda bildin · ${this.elapsedSeconds} sn` : 'Vaka tamamlandı';
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
            btnCopyScore.onclick = () => {
                navigator.clipboard.writeText(shareString);
                this.showToast("📋 Skor ve vaka linki panoya kopyalandı!");
            };
        }

        const btnShareWA = document.getElementById('btnShareWhatsApp');
        if (btnShareWA) {
            btnShareWA.onclick = () => {
                const duelUrl = this.buildCurrentCaseDuelLink();
                const waText = `${shareString}\n⚔️ Aynı vakada beni geçebilir misin? Tıkla ve çöz:\n${duelUrl}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`, '_blank');
            };
        }

        const btnChallengeLink = document.getElementById('btnChallengeFriendLink');
        if (btnChallengeLink) {
            btnChallengeLink.onclick = () => {
                const duelUrl = this.buildCurrentCaseDuelLink();
                navigator.clipboard.writeText(duelUrl);
                this.showToast("⚔️ Meydan okuma düello linki kopyalandı! Arkadaşına gönder!");
            };
        }

        const btnNextPractice = document.getElementById('btnNextPractice');
        if (btnNextPractice) {
            btnNextPractice.onclick = () => {
                if (this.activeDuelChallenge && this.activeDuelChallenge.isRoomDuel) {
                    if (typeof this.areAllActivePlayersFinished === 'function' && !this.areAllActivePlayersFinished()) {
                        this.nextRoomDuelCase();
                        return;
                    }
                    this.closeModal(this.dom.resultModal);
                    this.nextRoomDuelCase();
                } else {
                    btnNextPractice.disabled = false;
                    btnNextPractice.style.opacity = '';
                    btnNextPractice.textContent = 'Sıradaki vaka';
                    this.closeModal(this.dom.resultModal);
                    this.setMode('practice');
                }
            };
        }

        if (this.activeDuelChallenge && this.activeDuelChallenge.isRoomDuel && typeof this.updateRoundLockButtons === 'function') {
            this.updateRoundLockButtons();
        } else if (btnNextPractice) {
            btnNextPractice.disabled = false;
            btnNextPractice.style.opacity = '';
            btnNextPractice.style.cursor = '';
            btnNextPractice.textContent = this.currentMode === 'daily' ? 'Pratiğe devam et' : 'Sıradaki vaka';
        }

        this.openModal(this.dom.resultModal);
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
        this.showToast(`🚀 Toplam ${merged.length} vakalık "cases.js" indirildi! GitHub'daki js/cases.js üzerine yükleyebilirsiniz!`);
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

        this.showToast("💾 Aktif vaka paketi JSON olarak indirildi!");
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
        this.showToast(`🎉 "${customName}" (${validCases.length} vaka) kütüphaneye kaydedildi ve başlatıldı!${skippedUnknownDx > 0 ? ` ${skippedUnknownDx} vaka tanısı güncel listede olmadığı için atlandı.` : ''}`);
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
                this.showToast("⚠️ Geçersiz JSON dosyası! " + (err.message || ""));
            }
        };
        reader.readAsText(file);
    }

    handleImportPastedJSON() {
        const textarea = document.getElementById('pasteJsonTextarea');
        if (!textarea || !textarea.value.trim()) {
            this.showToast("⚠️ Lütfen önce JSON metnini kutuya yapıştırın.");
            return;
        }
        try {
            const parsed = JSON.parse(textarea.value.trim());
            this.processAndSaveImportedCases(parsed, `Yapıştırılan Paket #${this.savedCustomPacks.length + 1}`);
            textarea.value = '';
        } catch (err) {
            this.showToast("⚠️ Yapıştırılan JSON formatı hatalı: " + (err.message || ""));
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
                this.showToast("⚔️ Düello linki kopyalandı! Arkadaşına gönder!");
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
                    this.dom.duelOpponentStatus.textContent = `🎯 ${duelData.challengerGuesses}/6 İpucu • ${duelData.challengerTimeSec || 30} sn`;
                } else {
                    this.dom.duelOpponentStatus.textContent = `⚔️ Meydan Okudu`;
                }
            }
        }
        this.startCase(caseObj, `⚔️ Düello: Vaka #${caseObj.caseNumber}`);
        this.showToast(`⚔️ ${duelData.challengerName || 'Arkadaşın'} sana bu vakayla meydan okudu!`);
    }

    // --- Global Automatic Matchmaking ("Canlı Rakip Ara") ---
    startMatchmaking() {
        this.saveDuelNicknameFromModal();
        this.cancelMatchmaking(false);

        const statusBox = document.getElementById('matchmakingStatusBox');
        const statusText = document.getElementById('matchmakingStatusText');
        const btnStart = document.getElementById('btnStartMatchmaking');

        if (statusBox) statusBox.hidden = false;
        if (btnStart) btnStart.disabled = true;
        if (statusText) statusText.textContent = '📡 Küresel Lobi Taranıyor... Aktif rakip aranıyor...';

        this.isMatchmaking = true;
        const myToken = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

        // 1. Local multi-tab instant matchmaking via BroadcastChannel
        if (typeof BroadcastChannel !== 'undefined') {
            this.mmChannel = new BroadcastChannel('psikovaka_global_matchmaking');
            this.mmChannel.onmessage = (ev) => {
                if (!this.isMatchmaking || !ev.data) return;
                const msg = ev.data;
                if (msg.type === 'MM_SEEK' && msg.token !== myToken) {
                    const roomCode = 'MM' + Math.floor(10 + Math.random() * 89);
                    this.mmChannel.postMessage({
                        type: 'MM_PAIR',
                        targetToken: msg.token,
                        roomCode,
                        hostNickname: this.duelMyNickname
                    });
                    this.finishMatchmakingAndLaunch(roomCode, true, msg.nickname || 'Rakip Klinisyen');
                } else if (msg.type === 'MM_PAIR' && msg.targetToken === myToken) {
                    this.finishMatchmakingAndLaunch(msg.roomCode, false, msg.hostNickname || 'Rakip Klinisyen');
                }
            };
            this.mmChannel.postMessage({ type: 'MM_SEEK', token: myToken, nickname: this.duelMyNickname });
        }

        // 2. Worldwide cross-device matchmaking via PeerJS public lobby slot
        if (typeof Peer !== 'undefined') {
            const lobbyId = 'psikovaka-global-mm-lobby-v2';
            try {
                const seekerPeer = new Peer();
                this.mmPeer = seekerPeer;
                let matchedOrClaimed = false;

                seekerPeer.on('open', () => {
                    const conn = seekerPeer.connect(lobbyId, { reliable: true });
                    const fallbackTimer = setTimeout(() => {
                        if (!matchedOrClaimed && this.isMatchmaking) {
                            matchedOrClaimed = true;
                            this.claimMatchmakingLobbyHost(lobbyId, statusText);
                        }
                    }, 2200);

                    conn.on('open', () => {
                        clearTimeout(fallbackTimer);
                        conn.send({ type: 'MM_JOIN_REQUEST', nickname: this.duelMyNickname });
                    });

                    conn.on('data', (data) => {
                        if (data && data.type === 'MM_MATCH_CONFIRMED' && data.roomCode) {
                            matchedOrClaimed = true;
                            clearTimeout(fallbackTimer);
                            this.finishMatchmakingAndLaunch(data.roomCode, false, data.hostNickname || 'Rakip Klinisyen');
                        }
                    });
                });

                seekerPeer.on('error', () => {
                    if (!matchedOrClaimed && this.isMatchmaking) {
                        matchedOrClaimed = true;
                        this.claimMatchmakingLobbyHost(lobbyId, statusText);
                    }
                });
            } catch (e) {
                console.warn("Matchmaking PeerJS hatası:", e);
            }
        }
    }

    claimMatchmakingLobbyHost(lobbyId, statusText) {
        if (!this.isMatchmaking) return;
        if (this.mmPeer) {
            try { this.mmPeer.destroy(); } catch (e) {}
            this.mmPeer = null;
        }
        try {
            const hostPeer = new Peer(lobbyId);
            this.mmPeer = hostPeer;
            hostPeer.on('open', () => {
                if (statusText) {
                    statusText.textContent = '🟢 Küresel Lobiye Bağlandı! Sitede "Rakip Ara" diyen ilk oyuncuyla otomatik eşleşeceksiniz...';
                }
            });
            hostPeer.on('connection', (conn) => {
                conn.on('data', (data) => {
                    if (data && data.type === 'MM_JOIN_REQUEST' && this.isMatchmaking) {
                        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                        const roomCode = 'M' + chars.charAt(Math.floor(Math.random() * chars.length)) +
                            chars.charAt(Math.floor(Math.random() * chars.length)) +
                            chars.charAt(Math.floor(Math.random() * chars.length));
                        conn.send({
                            type: 'MM_MATCH_CONFIRMED',
                            roomCode,
                            hostNickname: this.duelMyNickname
                        });
                        setTimeout(() => {
                            this.finishMatchmakingAndLaunch(roomCode, true, data.nickname || 'Rakip Klinisyen');
                        }, 250);
                    }
                });
            });
        } catch (e) {}
    }

    finishMatchmakingAndLaunch(roomCode, isHost, opponentNickname) {
        this.cancelMatchmaking(false);
        this.closeModal(this.dom.duelCenterModal);
        this.setupLiveRoomEngine(roomCode, isHost, null);
        if (this.activeDuelChallenge) {
            this.activeDuelChallenge.challengerName = opponentNickname;
        }
        if (this.dom.duelOpponentName) {
            this.dom.duelOpponentName.textContent = opponentNickname;
        }
        this.showToast(`🔥 Eşleşme Bulundu! Rakip: ${opponentNickname} (Oda: ${roomCode})`);
    }

    cancelMatchmaking(notify = true) {
        this.isMatchmaking = false;
        if (this.mmChannel) {
            try { this.mmChannel.close(); } catch (e) {}
            this.mmChannel = null;
        }
        if (this.mmPeer) {
            try { this.mmPeer.destroy(); } catch (e) {}
            this.mmPeer = null;
        }
        const statusBox = document.getElementById('matchmakingStatusBox');
        const btnStart = document.getElementById('btnStartMatchmaking');
        if (statusBox) statusBox.hidden = true;
        if (btnStart) btnStart.disabled = false;
        if (notify) {
            this.showToast("🔍 Otomatik rakip arama durduruldu.");
        }
    }

    // --- Live P2P Room Duel (PeerJS WebRTC + BroadcastChannel + Deterministic Room Seed) ---
    createLiveDuelRoom() {
        this.saveDuelNicknameFromModal();
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const roomBox = document.getElementById('liveRoomCreatedBox');
        const codeDisplay = document.getElementById('generatedRoomCodeDisplay');
        const statusEl = document.getElementById('liveRoomConnectionStatus');
        if (roomBox && codeDisplay) {
            roomBox.style.display = 'block';
            codeDisplay.textContent = code;
        }

        const roomInviteUrl = `${window.location.origin}${window.location.pathname}#room=${code}`;
        const btnCopyRoom = document.getElementById('btnCopyRoomInviteLink');
        if (btnCopyRoom) {
            btnCopyRoom.onclick = () => {
                navigator.clipboard.writeText(roomInviteUrl);
                this.showToast(`🔗 Oda davet linki (${code}) kopyalandı!`);
            };
        }
        const btnWaRoom = document.getElementById('btnWhatsappRoomInvite');
        if (btnWaRoom) {
            btnWaRoom.onclick = () => {
                const text = `⚔️ *PsikoVaka Canlı Düello Odası Kuruldu!*\n\n🔑 *Oda Kodu:* ${code}\n🧑‍⚕️ *Kurucu:* ${this.duelMyNickname}\n\nDoğrudan odaya katılmak için tıkla:\n${roomInviteUrl}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
            };
        }

        this.setupLiveRoomEngine(code, true, statusEl);
    }

    joinLiveDuelRoom(code) {
        this.saveDuelNicknameFromModal();
        const cleanCode = code.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 6);
        if (!cleanCode) return;
        this.closeModal(this.dom.duelCenterModal);
        this.setupLiveRoomEngine(cleanCode, false, null);
    }

    getDeterministicRoomCases(roomCode) {
        let hash = 2166136261;
        for (let i = 0; i < roomCode.length; i++) {
            hash ^= roomCode.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        const pool = [...this.allMasterCases];
        const selected = [];
        for (let round = 0; round < 5; round++) {
            const idx = Math.abs(hash + round * 9973) % pool.length;
            selected.push(pool[idx]);
        }
        return selected;
    }

    setupLiveRoomEngine(roomCode, isHost, statusEl) {
        const roomCases = this.getDeterministicRoomCases(roomCode);
        this.activeDuelChallenge = {
            isRoomDuel: true,
            roomCode,
            roomCases,
            roundIndex: 0,
            myWins: 0,
            opponentWins: 0,
            challengerName: 'Rakip Bekleniyor...'
        };

        // 1. Setup BroadcastChannel for instant same-device/tab sync
        if (typeof BroadcastChannel !== 'undefined') {
            if (this.broadcastChannel) this.broadcastChannel.close();
            this.broadcastChannel = new BroadcastChannel(`psikovaka_room_${roomCode}`);
            this.broadcastChannel.onmessage = (ev) => this.handleIncomingDuelMessage(ev.data);
            this.broadcastChannel.postMessage({ type: 'HELLO', nickname: this.duelMyNickname });
        }

        // 2. Setup PeerJS WebRTC for cross-device internet live sync
        if (typeof Peer !== 'undefined') {
            try {
                if (this.peer) this.peer.destroy();
                const hostPeerId = `psikovaka-duel-room-${roomCode.toLowerCase()}`;
                if (isHost) {
                    this.peer = new Peer(hostPeerId);
                    this.peer.on('connection', (conn) => {
                        this.peerConn = conn;
                        this.bindPeerConnection(conn, statusEl);
                    });
                } else {
                    this.peer = new Peer();
                    this.peer.on('open', () => {
                        const conn = this.peer.connect(hostPeerId);
                        this.peerConn = conn;
                        this.bindPeerConnection(conn, statusEl);
                    });
                }
            } catch (e) {
                console.warn("PeerJS P2P başlatılamadı, deterministik oda modu aktif:", e);
            }
        }

        if (this.dom.duelHudBanner) {
            this.dom.duelHudBanner.style.display = 'flex';
            if (this.dom.duelMyName) this.dom.duelMyName.textContent = `${this.duelMyNickname} (Oda: ${roomCode})`;
            if (this.dom.duelMyScoreBadge) this.dom.duelMyScoreBadge.textContent = `Tur 1/5`;
            if (this.dom.duelOpponentName) this.dom.duelOpponentName.textContent = isHost ? 'Arkadaşın Bekleniyor...' : 'Odaya Bağlandı';
            if (this.dom.duelOpponentStatus) this.dom.duelOpponentStatus.textContent = 'Canlı Senkron';
        }

        this.startCase(roomCases[0], `⚔️ Oda ${roomCode} • Tur 1/5`);
        this.showToast(`⚔️ Canlı Düello Odası (${roomCode}) Başladı! Tur 1/5`);
    }

    bindPeerConnection(conn, statusEl) {
        conn.on('open', () => {
            if (statusEl) statusEl.textContent = '🔥 Arkadaşın odaya canlı bağlandı! Düello başladı!';
            conn.send({ type: 'HELLO', nickname: this.duelMyNickname });
        });
        conn.on('data', (data) => {
            this.handleIncomingDuelMessage(data);
        });
    }

    sendDuelPacket(packet) {
        if (this.peerConn && this.peerConn.open) {
            try { this.peerConn.send(packet); } catch (e) {}
        }
        if (this.broadcastChannel) {
            try { this.broadcastChannel.postMessage(packet); } catch (e) {}
        }
    }

    broadcastDuelProgress(finished, won = false) {
        if (!this.activeDuelChallenge) return;
        this.sendDuelPacket({
            type: finished ? 'FINISHED' : 'PROGRESS',
            nickname: this.duelMyNickname,
            guessesCount: this.guesses.length,
            unlockedClues: this.unlockedClues,
            won,
            timeSec: this.elapsedSeconds
        });
    }

    handleIncomingDuelMessage(data) {
        if (!data || !this.activeDuelChallenge) return;
        if (data.nickname) {
            this.activeDuelChallenge.challengerName = data.nickname;
            if (this.dom.duelOpponentName) this.dom.duelOpponentName.textContent = data.nickname;
        }
        if (data.type === 'HELLO') {
            this.showToast(`⚔️ ${data.nickname} canlı düello odasına katıldı!`);
            if (this.dom.duelOpponentStatus) this.dom.duelOpponentStatus.textContent = '🟢 Canlı Bağlı';
        } else if (data.type === 'PROGRESS') {
            if (this.dom.duelOpponentStatus) {
                this.dom.duelOpponentStatus.textContent = `🔍 ${data.guessesCount}. Tahminde (${data.timeSec} sn)`;
            }
        } else if (data.type === 'FINISHED') {
            this.activeDuelChallenge.challengerGuesses = data.won ? data.guessesCount : 7;
            this.activeDuelChallenge.challengerTimeSec = data.timeSec;
            if (this.dom.duelOpponentStatus) {
                this.dom.duelOpponentStatus.textContent = data.won ?
                    `🎉 ${data.guessesCount}/6 İpucu (${data.timeSec} sn)` :
                    `❌ Çözemedi (${data.timeSec} sn)`;
            }
            this.showToast(data.won ?
                `⚡ ${data.nickname} vakayı ${data.guessesCount}. tahminde (${data.timeSec} sn) çözdü!` :
                `😮 ${data.nickname} bu vakada tüm haklarını doldurdu!`);
            if (this.isGameOver) {
                this.renderDuelPodium(this.gameWon);
            }
        }
    }

    nextRoomDuelCase() {
        if (!this.activeDuelChallenge || !this.activeDuelChallenge.isRoomDuel) return;
        this.activeDuelChallenge.roundIndex = (this.activeDuelChallenge.roundIndex + 1) % this.activeDuelChallenge.roomCases.length;
        const round = this.activeDuelChallenge.roundIndex + 1;
        const nextCase = this.activeDuelChallenge.roomCases[this.activeDuelChallenge.roundIndex];
        this.activeDuelChallenge.challengerGuesses = null;
        this.activeDuelChallenge.challengerTimeSec = null;
        if (this.dom.duelMyScoreBadge) this.dom.duelMyScoreBadge.textContent = `Tur ${round}/5`;
        if (this.dom.duelOpponentStatus) this.dom.duelOpponentStatus.textContent = `Tur ${round} Başladı`;
        this.startCase(nextCase, `⚔️ Oda ${this.activeDuelChallenge.roomCode} • Tur ${round}/5`);
    }

    exitDuelMode() {
        this.activeDuelChallenge = null;
        if (this.peer) { try { this.peer.destroy(); } catch (e) {} this.peer = null; }
        if (this.broadcastChannel) { try { this.broadcastChannel.close(); } catch (e) {} this.broadcastChannel = null; }
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

        let verdictHTML = `<span style="color: #fbbf24;">⏳ Rakibin vakayı tamamlaması bekleniyor veya skorunuzu gönderin!</span>`;
        if (oppGuesses) {
            if (myGuesses < oppGuesses || (myGuesses === oppGuesses && myTime < oppTime)) {
                verdictHTML = `<span style="color: #34d399; font-size: 1.05rem; font-weight: 800;">🏆 DÜELLOYU SEN KAZANDIN! (${oppName}'i geçtin!)</span>`;
            } else if (myGuesses > oppGuesses || (myGuesses === oppGuesses && myTime > oppTime)) {
                verdictHTML = `<span style="color: #fb7185; font-size: 1.05rem; font-weight: 800;">⚔️ Bu turu ${oppName} kazandı! Rövanş için sıradaki vakaya geç!</span>`;
            } else {
                verdictHTML = `<span style="color: #38bdf8; font-size: 1.05rem; font-weight: 800;">🤝 TAM BERABERLİK! İkiniz de aynı sürede ve ipucunda bildiniz!</span>`;
            }
        }

        podiumEl.innerHTML = `
            <div style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: #fda4af; letter-spacing: 0.8px;">⚔️ Klinik Düello Karşılaştırma Podyumu</div>
            <div style="margin-top: 0.35rem;">${verdictHTML}</div>
            <div class="duel-podium-grid">
                <div style="background: var(--bg-secondary); padding: 0.7rem; border-radius: 10px; border: 1px solid var(--accent-emerald);">
                    <div style="font-weight: 800; color: #34d399;">🧑‍⚕️ ${this.duelMyNickname} (Sen)</div>
                    <div style="font-size: 0.85rem; margin-top: 4px;">${won ? `${this.guesses.length}/6 İpucu` : 'Çözemedi'} • ⏱️ ${myTime} sn</div>
                </div>
                <div class="duel-vs-badge">VS</div>
                <div style="background: var(--bg-secondary); padding: 0.7rem; border-radius: 10px; border: 1px solid var(--accent-rose);">
                    <div style="font-weight: 800; color: #fda4af;">⚔️ ${oppName}</div>
                    <div style="font-size: 0.85rem; margin-top: 4px;">${oppGuesses ? (oppGuesses <= 6 ? `${oppGuesses}/6 İpucu • ⏱️ ${oppTime || '-'} sn` : 'Çözemedi') : 'Oynuyor...'}</div>
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

    generateShareString(won) {
        const caseNumber = this.currentCase.caseNumber || 1;
        const guessCount = won ? this.guesses.length : 'X';
        const modeLabels = {
            diagnosis: '🩺 PsikoVaka Tanı',
            therapy: '🛡️ PsikoTerapi',
            pharmacology: '💊 PsikoFarmakoloji',
            combo: '⚡ PsikoVaka Tam Konsültasyon'
        };
        const gameName = modeLabels[this.targetGameMode] || '🧠 PsikoVaka';
        let str = `${gameName} Vaka #${caseNumber} (${guessCount}/${this.maxClues}) • ⏱️ ${this.elapsedSeconds} sn\n\n`;

        this.guesses.forEach(g => {
            if (g.isCorrect) str += '🟩🟩🟩🟩\n';
            else if (g.categoryMatch) str += '🟨🟨⬛⬛\n';
            else str += '⬛⬛⬛⬛\n';
        });

        return str.trim();
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
            this.showToast("⚠️ Lütfen tüm 6 ipucunu ve vaka bilgilerini doldurun.");
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
                this.showToast("🔗 Özel vaka linki kopyalandı!");
            };

            document.getElementById('btnPlayStudioCase').onclick = () => {
                this.closeModal(this.dom.caseStudioModal);
                window.location.hash = `case=${encoded}`;
                this.loadCustomCase(customCase);
            };
        }
    }

    // --- Guides: DSM-5, Psychotherapy, and Psychopharmacology ---
    openDsmGuideModal() {
        const guideList = document.getElementById('dsmGuideList');
        if (!guideList) return;
        guideList.innerHTML = '';

        Object.keys(this.categories).forEach(catKey => {
            const cat = this.categories[catKey];
            const catDiags = this.diagnoses.filter(d => d.category === catKey);
            if (catDiags.length === 0) return;

            const section = document.createElement('details');
            section.className = 'guide-group';

            let html = `<summary class="guide-group-head"><span class="guide-group-title">${cat.name}</span><span class="guide-group-count">${catDiags.length}</span></summary>`;
            html += `<ul class="guide-items">`;
            catDiags.forEach(d => {
                html += `<li class="guide-item-simple"><span class="guide-item-name">${d.nameTr}</span> <span class="guide-item-en">${d.nameEn}</span></li>`;
            });
            html += `</ul>`;
            section.innerHTML = html;
            guideList.appendChild(section);
        });

        this.openModal(this.dom.dsmGuideModal);
    }

    openTherapyGuideModal() {
        const guideList = document.getElementById('therapyGuideList');
        if (!guideList) return;
        guideList.innerHTML = '';

        Object.keys(this.therapyFamilies).forEach(famKey => {
            const fam = this.therapyFamilies[famKey];
            const famTherapies = this.therapies.filter(t => t.family === famKey);
            if (famTherapies.length === 0) return;

            const section = document.createElement('details');
            section.className = 'guide-group';

            let html = `<summary class="guide-group-head"><span class="guide-group-title">${fam.name}</span><span class="guide-group-count">${famTherapies.length}</span></summary>`;
            html += `<div class="guide-cards">`;

            famTherapies.forEach(t => {
                let stepsHTML = '';
                if (t.protocolSteps && t.protocolSteps.length > 0) {
                    stepsHTML = `<div class="guide-card-steps"><span class="guide-card-label">Protokol adımları</span><ul>${t.protocolSteps.map(s => `<li>${s}</li>`).join('')}</ul></div>`;
                }
                html += `
                    <article class="guide-card">
                        <div class="guide-card-head">
                            <strong class="guide-item-name">${t.nameTr}</strong>
                            <span class="guide-item-en">${t.nameEn}</span>
                        </div>
                        <p class="guide-card-text">${t.shortDefinition}</p>
                        ${stepsHTML}
                        ${t.pitfalls ? `<div class="guide-card-warn"><strong>Klinik tuzak:</strong> ${t.pitfalls}</div>` : ''}
                    </article>
                `;
            });

            html += `</div>`;
            section.innerHTML = html;
            guideList.appendChild(section);
        });

        this.openModal(this.dom.therapyGuideModal);
    }

    openPharmaGuideModal() {
        const guideList = document.getElementById('pharmaGuideList');
        if (!guideList) return;
        guideList.innerHTML = '';

        Object.keys(this.pharmacologyFamilies).forEach(famKey => {
            const fam = this.pharmacologyFamilies[famKey];
            const famItems = this.pharmacology.filter(p => p.family === famKey);
            if (famItems.length === 0) return;

            const section = document.createElement('details');
            section.className = 'guide-group';

            let html = `<summary class="guide-group-head"><span class="guide-group-title">${fam.name}</span><span class="guide-group-count">${famItems.length}</span></summary>`;
            html += `<div class="guide-cards">`;

            famItems.forEach(p => {
                let stepsHTML = '';
                if (p.protocolSteps && p.protocolSteps.length > 0) {
                    stepsHTML = `<div class="guide-card-steps"><span class="guide-card-label">Uygulama ve endikasyon</span><ul>${p.protocolSteps.map(s => `<li>${s}</li>`).join('')}</ul></div>`;
                }
                html += `
                    <article class="guide-card">
                        <div class="guide-card-head">
                            <strong class="guide-item-name">${p.nameTr}</strong>
                            <span class="guide-item-en">${p.nameEn || ''}</span>
                        </div>
                        <p class="guide-card-text">${p.shortDefinition || ''}</p>
                        ${stepsHTML}
                        ${p.pitfalls ? `<div class="guide-card-warn"><strong>Kontrendikasyon ve yan etki:</strong> ${p.pitfalls}</div>` : ''}
                    </article>
                `;
            });

            html += `</div>`;
            section.innerHTML = html;
            guideList.appendChild(section);
        });

        this.openModal(this.dom.pharmaGuideModal);
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

    playTone(type) {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'win') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, ctx.currentTime);
                osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
                osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
                osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
                osc.start();
                osc.stop(ctx.currentTime + 0.6);
            } else if (type === 'warm') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, ctx.currentTime);
                osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
                osc.start();
                osc.stop(ctx.currentTime + 0.25);
            } else {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(250, ctx.currentTime);
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
                osc.start();
                osc.stop(ctx.currentTime + 0.2);
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
        const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#38bdf8', '#a855f7'];

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
        if (focusTarget) setTimeout(() => { try { focusTarget.focus({ preventScroll: true }); } catch (e) {} }, 30);
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

    showToast(message) {
        if (!this.dom || !this.dom.toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        this.dom.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px) scale(0.95)';
            setTimeout(() => {
                if (toast && typeof toast.remove === 'function') toast.remove();
            }, 350);
        }, 3000);
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
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f7f7fb' : '#0f1117');
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

    if (typeof attachOnlineArenaToGame === 'function') {
        attachOnlineArenaToGame(PsikoVakaGame);
    }
    window.game = new PsikoVakaGame();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PsikoVakaGame };
}
