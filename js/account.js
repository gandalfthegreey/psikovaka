/**
 * PsikoVaka — Hesap katmanı (Supabase Auth + profiles).
 *
 * Misafir modu kalıcıdır: bu dosya yalnızca EK özellik sağlar. Supabase kütüphanesi yüklenemezse,
 * ağ yoksa ya da sayfa file:// ile açıldıysa her şey misafir olarak çalışmaya devam eder.
 * Hiçbir hata dışarı fırlatılmaz; bütün eylemler { ok, error } döner.
 * Erişim/yenileme belirteçleri (token) hiçbir zaman konsola yazılmaz.
 *
 * Durumlar (state):
 *   'guest'                  oturum yok (veya hesap hizmeti kullanılamıyor)
 *   'signed_in_no_username'  oturum var, profil okundu ama kullanıcı adı seçilmemiş
 *   'ready'                  oturum var, kullanıcı adı var (profil null olabilir: okunamadıysa profileError dolu)
 * Hizmet durumu (availability): 'pending' | 'ready' | 'unavailable' | 'disabled' | 'unsupported'
 *
 * Kullanım:
 *   PsikoVakaAccount.onChange((snapshot, event) => { ... });
 *   PsikoVakaAccount.init();
 * event.type: 'state' | 'password_recovery' | 'redirect' | 'import' | 'profile_saved'
 *
 * Oturum kalıcılığı ("Oturumumu açık tut"): createClient'a özel bir auth.storage verilir. Tercih
 * localStorage'da `psikovaka_auth_remember` ('1' / '0'; yoksa '1') ve giriş/kayıt çağrısından ÖNCE yazılır.
 *   '1' -> oturum belirteci localStorage'da (tarayıcı kapanınca da sürer)
 *   '0' -> sessionStorage'da (yalnızca bu sekme/oturum; tarayıcı kapanınca biter)
 * PKCE doğrulayıcısı (`...-code-verifier`) her iki modda da localStorage'da tutulur; böylece e-posta
 * bağlantısı yeni bir sekmede açılsa da kod takası çalışır. Çıkışta iki depodaki oturum anahtarları silinir.
 * Sözleşme: supabase/TASARIM.md §7 (set_username, import_local_progress, profiles, leaderboard).
 */
(function (global) {
    'use strict';

    // Sunucudaki sütun varsayılanı hâlâ eski (v1) biçimdir; istemci her avatarı Nöro v2'ye normalize eder (js/avatar.js).
    const LEGACY_DEFAULT_AVATAR = Object.freeze({ bg: 'bg_indigo', skin: 'skin_warm', hat: 'hat_einstein', eye: 'eye_hypno', mouth: 'mouth_tongue', prop: 'prop_steth' });
    const AV = () => (typeof global.PsikoVakaAvatar !== 'undefined' ? global.PsikoVakaAvatar : null);
    const DEFAULT_AVATAR = Object.freeze(AV() ? Object.assign({}, AV().DEFAULT) : Object.assign({}, LEGACY_DEFAULT_AVATAR));
    const REMEMBER_KEY = 'psikovaka_auth_remember';
    const DEFAULT_DISPLAY_NAME = 'Klinisyen';
    const USERNAME_RE = /^[A-Za-z0-9_]{3,20}$/;
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PROFILE_COLUMNS = 'id,username,display_name,avatar,ranked_points,matches_played,matches_won';
    const IMPORT_FLAG_PREFIX = 'psikovaka_progress_imported_';
    const LIB_TIMEOUT_MS = 10000;
    const AUTH_URL_PARAMS = ['code', 'error', 'error_code', 'error_description', 'type'];

    const listeners = new Set();
    const st = {
        state: 'guest',
        availability: 'pending',
        client: null,
        user: null,
        profile: null,
        profileError: null,
        recovery: false,
        redirect: null,
        _loading: false,
        syncedUserId: null,
        importedThisSession: false,
        loadSeq: 0
    };
    let initPromise = null;

    // ---------------------------------------------------------------- yardımcılar
    function cfg() {
        try { return (typeof PSIKOVAKA_SUPABASE !== 'undefined') ? PSIKOVAKA_SUPABASE : null; } catch (e) { return null; }
    }
    function passwordMinLength() {
        const c = cfg();
        const n = c && Number(c.passwordMinLength);
        return Number.isFinite(n) && n >= 6 ? n : 8;
    }
    // ---------------------------------------------------------------- oturum deposu ("Oturumumu açık tut")
    function store(kind) {
        try { return kind === 'local' ? global.localStorage : global.sessionStorage; } catch (e) { return null; }
    }
    function getRemember() {
        try { return global.localStorage.getItem(REMEMBER_KEY) !== '0'; } catch (e) { return true; }
    }
    function setRemember(on) {
        try { global.localStorage.setItem(REMEMBER_KEY, on ? '1' : '0'); } catch (e) {}
    }
    const isVerifierKey = (k) => /-code-verifier$/.test(String(k));
    const authStorage = {
        getItem(key) {
            try {
                if (isVerifierKey(key)) return store('local').getItem(key);
                const s = store(getRemember() ? 'local' : 'session');
                return s ? s.getItem(key) : null;
            } catch (e) { return null; }
        },
        setItem(key, value) {
            try {
                if (isVerifierKey(key)) { store('local').setItem(key, value); return; }
                const remember = getRemember();
                const primary = store(remember ? 'local' : 'session');
                const other = store(remember ? 'session' : 'local');
                if (primary) primary.setItem(key, value);
                if (other) other.removeItem(key);
            } catch (e) {}
        },
        removeItem(key) {
            try { const a = store('local'); if (a) a.removeItem(key); } catch (e) {}
            try { const b = store('session'); if (b) b.removeItem(key); } catch (e) {}
        }
    };
    function clearStoredSessions() {
        let ref = '';
        try { ref = new URL(cfg().url).hostname.split('.')[0]; } catch (e) {}
        if (!ref) return;
        const prefix = `sb-${ref}-auth-token`;
        ['local', 'session'].forEach(kind => {
            const s = store(kind);
            if (!s) return;
            try {
                const keys = [];
                for (let i = 0; i < s.length; i++) { const k = s.key(i); if (k && k.startsWith(prefix)) keys.push(k); }
                keys.forEach(k => s.removeItem(k));
            } catch (e) {}
        });
    }
    function redirectUrl() {
        return global.location.origin + global.location.pathname;
    }
    function readLocalJSON(key, fallback) {
        try {
            const raw = global.localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) { return fallback; }
    }
    function safeLocalGet(key) {
        try { return global.localStorage.getItem(key); } catch (e) { return null; }
    }
    function safeLocalSet(key, val) {
        try { global.localStorage.setItem(key, val); } catch (e) {}
    }
    function toInt(v) {
        const n = Math.floor(Number(v));
        return Number.isFinite(n) && n > 0 ? n : 0;
    }
    /** Her girdiyi (eski v1 dahil) geçerli Nöro v2 yapılandırmasına çevirir; nesne değilse null. */
    function sanitizeAvatar(a) {
        if (!a || typeof a !== 'object' || Array.isArray(a)) return null;
        const A = AV();
        return A ? A.normalize(a) : null;
    }
    function sameAvatar(a, b) {
        if (!a || !b) return false;
        const A = AV();
        return A ? A.equals(a, b) : JSON.stringify(a) === JSON.stringify(b);
    }
    /** Sunucu profili hâlâ varsayılan avatarda mı (eski sütun varsayılanı ya da yeni varsayılan)? */
    function isDefaultAvatar(a) {
        return sameAvatar(a, LEGACY_DEFAULT_AVATAR) || sameAvatar(a, DEFAULT_AVATAR);
    }
    function isNetworkError(err) {
        if (global.navigator && global.navigator.onLine === false) return true;
        if (!err) return false;
        const name = err.name || '';
        const msg = String(err.message || '');
        return name === 'AuthRetryableFetchError' || name === 'TypeError' && /fetch/i.test(msg) ||
            /Failed to fetch|NetworkError|Load failed|network request failed/i.test(msg) || err.status === 0;
    }

    // ---------------------------------------------------------------- hata eşleme
    const MESSAGES = {
        OFFLINE: 'Bağlantı kurulamadı. İnternetini kontrol edip tekrar dene.',
        UNAVAILABLE: 'Hesap hizmetine şu an ulaşılamıyor. Misafir olarak oynamaya devam edebilirsin.',
        UNKNOWN: 'Bir şeyler ters gitti. Biraz sonra tekrar dene.',
        EMAIL_INVALID: 'Geçerli bir e-posta adresi gir.',
        PASSWORD_SHORT: () => `Şifre en az ${passwordMinLength()} karakter olmalı.`,

        // Supabase Auth (error.code)
        invalid_credentials: 'E-posta ya da şifre hatalı.',
        email_not_confirmed: 'E-postanı henüz onaylamadın. Gelen kutundaki bağlantıya tıkla.',
        weak_password: () => `Şifre çok zayıf. En az ${passwordMinLength()} karakter kullan; harf ve rakam karıştır.`,
        user_already_exists: 'Bu e-postayla zaten bir hesap var. Giriş yapmayı dene.',
        email_exists: 'Bu e-postayla zaten bir hesap var. Giriş yapmayı dene.',
        over_email_send_rate_limit: 'Çok fazla e-posta istendi. Biraz bekleyip tekrar dene.',
        over_request_rate_limit: 'Çok fazla deneme yapıldı. Birkaç dakika sonra tekrar dene.',
        email_address_invalid: 'Geçerli bir e-posta adresi gir.',
        email_address_not_authorized: 'Bu e-posta adresine şu an e-posta gönderilemiyor.',
        same_password: 'Yeni şifre eskisiyle aynı olamaz.',
        signup_disabled: 'Şu an yeni kayıt alınmıyor.',
        email_provider_disabled: 'E-postayla giriş şu an kapalı.',
        otp_expired: 'Bağlantının süresi dolmuş ya da daha önce kullanılmış. Yeni bir bağlantı iste.',
        flow_state_not_found: 'Bağlantı bu tarayıcıda tamamlanamadı. İsteği yaptığın tarayıcıda aç ya da giriş yap.',
        flow_state_expired: 'Bağlantının süresi dolmuş. Yeni bir bağlantı iste.',
        bad_code_verifier: 'Bağlantı bu tarayıcıda tamamlanamadı. İsteği yaptığın tarayıcıda aç ya da giriş yap.',
        session_not_found: 'Oturumun sona erdi. Tekrar giriş yap.',
        session_expired: 'Oturumun sona erdi. Tekrar giriş yap.',
        refresh_token_not_found: 'Oturumun sona erdi. Tekrar giriş yap.',
        refresh_token_already_used: 'Oturumun sona erdi. Tekrar giriş yap.',
        bad_jwt: 'Oturumun sona erdi. Tekrar giriş yap.',
        reauthentication_needed: 'Bu işlem için yeniden giriş yapman gerekiyor.',
        user_banned: 'Bu hesap kullanıma kapatılmış.',
        captcha_failed: 'Güvenlik doğrulaması başarısız oldu. Tekrar dene.',
        access_denied: 'Bağlantı geçersiz ya da süresi dolmuş. Yeni bir bağlantı iste.',

        // Sunucu sözleşmesi (RPC error.message = sabit kod)
        NOT_AUTHENTICATED: 'Bunun için giriş yapmalısın.',
        USERNAME_INVALID: 'Kullanıcı adı 3-20 karakter olmalı; yalnızca harf, rakam ve _ kullanılabilir.',
        USERNAME_TAKEN: 'Bu kullanıcı adı alınmış. Başka bir ad dene.',
        USERNAME_REQUIRED: 'Önce bir kullanıcı adı seçmelisin.',
        ALREADY_IMPORTED: 'Bu cihazdaki ilerleme daha önce hesaba aktarılmış.',
        INVALID_PROGRESS: 'Yerel ilerleme aktarılamadı (geçersiz vaka listesi).',
        INVALID_STATS: 'Yerel istatistikler aktarılamadı (geçersiz biçim).',
        USER_NOT_FOUND: 'Bu kullanıcı adıyla biri bulunamadı.',
        CANNOT_FRIEND_SELF: 'Kendini arkadaş olarak ekleyemezsin.',
        ALREADY_FRIENDS: 'Zaten arkadaşsınız.',
        TOO_MANY_REQUESTS: 'Çok fazla bekleyen isteğin var.',
        REQUEST_NOT_FOUND: 'İstek bulunamadı.',
        FRIEND_LIMIT: 'Arkadaş sınırına ulaşıldı.',
        NOT_FRIENDS: 'Bu kişiyle arkadaş değilsiniz.',
        INVALID_SETTINGS: 'Oda ayarları geçersiz.',
        NOT_ENOUGH_CASES: 'Bu ayarlarla yeterli vaka yok.',
        CODE_GENERATION_FAILED: 'Oda kodu üretilemedi. Tekrar dene.',
        ROOM_NOT_FOUND: 'Oda bulunamadı.',
        ALREADY_STARTED: 'Maç zaten başladı.',
        ROOM_FULL: 'Oda dolu.',
        NOT_MEMBER: 'Bu odada değilsin.',
        NOT_HOST: 'Bunu yalnızca oda sahibi yapabilir.',
        ROOM_NOT_FULL: 'Oda dolmadan maç başlamaz.',
        NOT_ALL_READY: 'Herkes hazır olmadan maç başlamaz.',
        NOT_STARTED: 'Maç henüz başlamadı.',
        ROUND_CLOSED: 'Bu tur kapandı.',
        ROUND_NOT_STARTED: 'Tur henüz başlamadı.',
        NOT_IN_ROUND: 'Bu turda oynamıyorsun.',
        ALREADY_FINISHED: 'Bu turu zaten bitirdin.',
        GUESS_LIMIT: 'Tahmin hakkın kalmadı.',
        UNKNOWN_ITEM: 'Bu seçenek listede yok.',
        DUPLICATE_GUESS: 'Bunu zaten tahmin ettin.',
        ALREADY_IN_ROOM: 'Bu kişi zaten odada.',
        INVITE_NOT_FOUND: 'Davet bulunamadı.',
        INVITE_EXPIRED: 'Davetin süresi dolmuş.',
        CONFIG_MISSING: 'Sunucu ayarı eksik.'
    };
    function msg(key) {
        const m = MESSAGES[key];
        return typeof m === 'function' ? m() : m;
    }

    /** Herhangi bir Supabase/ağ hatasını { code, message } biçimine çevirir (Türkçe kısa mesaj). */
    function describeError(err) {
        if (!err) return { code: 'UNKNOWN', message: msg('UNKNOWN') };
        if (typeof err === 'string') return { code: err, message: msg(err) || msg('UNKNOWN') };
        if (err.code === 'OFFLINE' || isNetworkError(err)) return { code: 'OFFLINE', message: msg('OFFLINE') };

        const authCode = err.code || (err.details && err.details.code) || '';
        if (authCode && MESSAGES[authCode]) return { code: authCode, message: msg(authCode) };

        // PostgREST / RPC: message alanı sözleşme kodudur
        const m = String(err.message || '');
        if (MESSAGES[m] && /^[A-Z_]+$/.test(m)) return { code: m, message: msg(m) };
        if (err.code === '42501') return { code: 'FORBIDDEN', message: 'Bu işlem için yetkin yok.' };
        if (err.code === '23514' || err.code === '22P02') return { code: 'INVALID_INPUT', message: 'Girilen bilgi geçersiz.' };
        if (err.code === 'PGRST301' || /JWT expired/i.test(m)) return { code: 'session_expired', message: msg('session_expired') };
        if (err.status === 429) return { code: 'over_request_rate_limit', message: msg('over_request_rate_limit') };
        // Eski API sürümü yanıtlarında error.code boş gelebilir: bilinen İngilizce mesajlardan eşle
        const byText = [
            [/Invalid login credentials/i, 'invalid_credentials'],
            [/Email not confirmed/i, 'email_not_confirmed'],
            [/User already registered/i, 'user_already_exists'],
            [/should be different from the old password/i, 'same_password'],
            [/only request this after|Email rate limit exceeded/i, 'over_email_send_rate_limit'],
            [/Signups not allowed/i, 'signup_disabled'],
            [/provider is not enabled/i, 'provider_disabled']
        ].find(([re]) => re.test(m));
        if (byText) return { code: byText[1], message: msg(byText[1]) };
        if (/email.*invalid|invalid.*email|Unable to validate email/i.test(m)) return { code: 'email_address_invalid', message: msg('email_address_invalid') };
        if (/Password should be at least/i.test(m)) return { code: 'weak_password', message: msg('weak_password') };
        if (/rate limit/i.test(m)) return { code: 'over_request_rate_limit', message: msg('over_request_rate_limit') };
        return { code: authCode || 'UNKNOWN', message: msg('UNKNOWN') };
    }
    function fail(errOrCode) {
        const e = describeError(errOrCode);
        return { ok: false, error: e };
    }

    // ---------------------------------------------------------------- doğrulama (sunucuyla aynı kurallar)
    function validateUsername(name) {
        const v = String(name || '').trim();
        if (!USERNAME_RE.test(v)) return msg('USERNAME_INVALID');
        return null;
    }
    function validateEmail(email) {
        const v = String(email || '').trim();
        return EMAIL_RE.test(v) && v.length <= 254 ? null : msg('EMAIL_INVALID');
    }
    function validatePassword(pw) {
        return String(pw || '').length >= passwordMinLength() ? null : msg('PASSWORD_SHORT');
    }
    function validateDisplayName(name) {
        const v = String(name || '').trim();
        return v.length >= 1 && v.length <= 30 ? null : 'Görünen ad 1-30 karakter olmalı.';
    }

    // ---------------------------------------------------------------- olaylar
    function snapshot() {
        return {
            state: st.state,
            availability: st.availability,
            user: st.user ? { id: st.user.id, email: st.user.email || '' } : null,
            profile: st.profile ? JSON.parse(JSON.stringify(st.profile)) : null,
            profileError: st.profileError,
            recovery: st.recovery,
            remember: getRemember(),
            passwordMinLength: passwordMinLength()
        };
    }
    function emit(event) {
        const snap = snapshot();
        const ev = event || { type: 'state' };
        listeners.forEach(fn => {
            try { fn(snap, ev); } catch (e) { try { console.warn('[PsikoVakaAccount] dinleyici hatası:', e && e.message); } catch (_) {} }
        });
    }
    function onChange(fn) {
        if (typeof fn !== 'function') return () => {};
        listeners.add(fn);
        return () => listeners.delete(fn);
    }
    function setAvailability(a) {
        st.availability = a;
    }

    // ---------------------------------------------------------------- kütüphane yükleme
    function waitForLibrary() {
        return new Promise(resolve => {
            const ok = () => !!(global.supabase && typeof global.supabase.createClient === 'function');
            if (ok()) return resolve(global.supabase);
            if (global.__psikovakaSupabaseFailed) return resolve(null);
            let done = false;
            const finish = (v) => {
                if (done) return;
                done = true;
                clearTimeout(timer);
                clearInterval(poll);
                resolve(v);
            };
            const poll = setInterval(() => {
                if (ok()) finish(global.supabase);
                else if (global.__psikovakaSupabaseFailed) finish(null);
            }, 150);
            const timer = setTimeout(() => finish(ok() ? global.supabase : null), LIB_TIMEOUT_MS);
        });
    }

    // ---------------------------------------------------------------- yönlendirme (?code=, ?error=)
    function readAuthParamsFromUrl() {
        const info = { hasCode: false, error: null, authHash: false };
        try {
            const q = new URLSearchParams(global.location.search || '');
            info.hasCode = q.has('code');
            const h = String(global.location.hash || '');
            let hp = null;
            if (h && !h.startsWith('#/') && /(^#|&)(error|error_code|error_description|access_token)=/.test(h)) {
                hp = new URLSearchParams(h.slice(1));
                info.authHash = true;
            }
            const errCode = q.get('error_code') || (hp && hp.get('error_code')) || q.get('error') || (hp && hp.get('error'));
            if (errCode) {
                info.error = { code: errCode, description: q.get('error_description') || (hp && hp.get('error_description')) || '' };
            }
        } catch (e) {}
        return info;
    }
    function cleanAuthParams(info) {
        try {
            const url = new URL(global.location.href);
            let changed = false;
            AUTH_URL_PARAMS.forEach(p => {
                if (url.searchParams.has(p)) { url.searchParams.delete(p); changed = true; }
            });
            if (info && info.authHash) { url.hash = ''; changed = true; }
            if (changed) {
                const s = url.searchParams.toString();
                global.history.replaceState(global.history.state, '', url.pathname + (s ? '?' + s : '') + url.hash);
            }
        } catch (e) {}
    }
    function finishRedirect(info, initError) {
        if (!info || (!info.hasCode && !info.error)) return;
        cleanAuthParams(info);
        let result;
        if (info.error) {
            const d = describeError({ code: info.error.code });
            result = { ok: false, message: d.code === 'UNKNOWN' ? 'Bağlantı geçersiz ya da süresi dolmuş. Yeni bir bağlantı iste.' : d.message };
        } else if (st.user) {
            result = { ok: true, recovery: st.recovery };
        } else if (initError) {
            result = { ok: false, message: describeError(initError).message };
        } else if (st.availability !== 'ready') {
            result = { ok: false, message: msg('UNAVAILABLE') };
        } else {
            // Kod var ama bu tarayıcıda doğrulayıcı (PKCE code verifier) yok: bağlantı başka tarayıcıda açılmış.
            result = { ok: false, message: 'E-postan onaylandıysa artık giriş yapabilirsin. (Bağlantıyı kayıt olduğun tarayıcıda açarsan otomatik giriş yapılır.)', info: true };
        }
        st.redirect = result;
        emit({ type: 'redirect', result });
    }

    // ---------------------------------------------------------------- oturum ve profil
    function computeState() {
        if (!st.user) return 'guest';
        if (st.profile && !st.profile.username) return 'signed_in_no_username';
        return 'ready';
    }
    function setState() {
        st.state = computeState();
        emit({ type: 'state' });
    }

    async function handleAuthEvent(event, session) {
        if (event === 'PASSWORD_RECOVERY') {
            st.recovery = true;
            await applySession(session);
            emit({ type: 'password_recovery' });
            return;
        }
        if (event === 'SIGNED_OUT') {
            clearSession();
            return;
        }
        await applySession(session);
    }

    function clearSession() {
        const hadUser = !!st.user;
        st.user = null;
        st.profile = null;
        st.profileError = null;
        st.recovery = false;
        st.syncedUserId = null;
        st.importedThisSession = false;
        st.loadSeq++;
        st._loading = false;
        if (hadUser || st.state !== 'guest') setState();
    }

    async function applySession(session) {
        const user = session && session.user ? session.user : null;
        if (!user) { clearSession(); return; }
        const sameUser = st.user && st.user.id === user.id;
        st.user = user;
        if (sameUser && (st.profile || st._loading)) {
            if (!st._loading) emit({ type: 'state' });
            return;
        }
        await loadProfile();
    }

    async function loadProfile() {
        if (!st.client || !st.user) return;
        const seq = ++st.loadSeq;
        st._loading = true;
        try {
            const { data, error } = await st.client.from('profiles').select(PROFILE_COLUMNS).eq('id', st.user.id).maybeSingle();
            if (seq !== st.loadSeq) return;
            if (error) throw error;
            // Tetikleyici profili açmamışsa (olmamalı) kullanıcı adı adımı set_username ile satırı oluşturur.
            st.profile = data || { id: st.user.id, username: null, display_name: DEFAULT_DISPLAY_NAME, avatar: { ...DEFAULT_AVATAR }, ranked_points: 250, matches_played: 0, matches_won: 0 };
            st.profileError = null;
            if (st.profile.username) await afterReady();
        } catch (e) {
            if (seq !== st.loadSeq) return;
            st.profile = null;
            st.profileError = describeError(e);
        } finally {
            if (seq === st.loadSeq) st._loading = false;
        }
        if (seq === st.loadSeq) setState();
    }

    /** Kullanıcı adı olan oturum ilk kez hazır olduğunda: yerel avatar/ad itme (gerekirse) ve bir kerelik aktarım. */
    async function afterReady() {
        if (!st.user || st.syncedUserId === st.user.id) return;
        st.syncedUserId = st.user.id;
        try { await pushLocalIdentityIfDefault(); } catch (e) {}
        // Aktarım arayüzü bekletmesin
        setTimeout(() => { importLocalProgressOnce().catch(() => {}); }, 0);
    }

    async function pushLocalIdentityIfDefault() {
        if (!st.profile) return;
        const patch = {};
        const localAvatar = sanitizeAvatar(readLocalJSON('psikovaka_funny_avatar', null));
        if (localAvatar && isDefaultAvatar(st.profile.avatar) && !isDefaultAvatar(localAvatar)) {
            patch.avatar = localAvatar;
        }
        const localNick = String(safeLocalGet('psikovaka_nickname') || '').trim().slice(0, 30);
        if (localNick && localNick !== DEFAULT_DISPLAY_NAME && st.profile.display_name === DEFAULT_DISPLAY_NAME) {
            patch.displayName = localNick;
        }
        if (Object.keys(patch).length) await saveProfile(patch, { silent: true });
    }

    // ---------------------------------------------------------------- başlatma
    function init() {
        if (initPromise) return initPromise;
        initPromise = (async () => {
            const urlInfo = readAuthParamsFromUrl();
            let initError = null;
            try {
                const c = cfg();
                if (!c || c.accountsEnabled === false || !c.url || !c.publishableKey) {
                    setAvailability('disabled');
                    cleanAuthParams(urlInfo);
                    setState();
                    return snapshot();
                }
                if (!/^https?:$/.test(global.location.protocol) || typeof global.fetch !== 'function') {
                    setAvailability('unsupported');
                    cleanAuthParams(urlInfo);
                    setState();
                    return snapshot();
                }
                const lib = await waitForLibrary();
                if (!lib) {
                    setAvailability('unavailable');
                    setState();
                    finishRedirect(urlInfo, null);
                    return snapshot();
                }
                st.client = lib.createClient(c.url, c.publishableKey, {
                    auth: {
                        flowType: 'pkce',
                        detectSessionInUrl: true,
                        persistSession: true,
                        autoRefreshToken: true,
                        storage: authStorage
                    }
                });
                // Geri çağrıda supabase çağrısı beklemek kilitlenmeye yol açabilir: sıradaki görev döngüsüne ertele.
                st.client.auth.onAuthStateChange((event, session) => {
                    setTimeout(() => { handleAuthEvent(event, session).catch(() => {}); }, 0);
                });
                const res = await st.client.auth.initialize();
                initError = res && res.error ? res.error : null;
                const { data } = await st.client.auth.getSession();
                setAvailability('ready');
                await applySession(data && data.session);
                if (!st.user) setState();
            } catch (e) {
                initError = e;
                if (!st.client) setAvailability('unavailable');
                else setAvailability('ready');
                try { setState(); } catch (_) {}
            }
            finishRedirect(urlInfo, initError);
            return snapshot();
        })();
        return initPromise;
    }

    function requireClient() {
        if (!st.client || st.availability !== 'ready') {
            if (global.navigator && global.navigator.onLine === false) return fail('OFFLINE');
            return { ok: false, error: { code: 'UNAVAILABLE', message: msg('UNAVAILABLE') } };
        }
        return null;
    }

    // ---------------------------------------------------------------- eylemler
    /** opts.remember: "Oturumumu açık tut" (varsayılan true). Tercih istekten ÖNCE yazılır. */
    async function signUp(email, password, opts = {}) {
        const e1 = validateEmail(email); if (e1) return { ok: false, error: { code: 'EMAIL_INVALID', message: e1 } };
        const e2 = validatePassword(password); if (e2) return { ok: false, error: { code: 'PASSWORD_SHORT', message: e2 } };
        const nc = requireClient(); if (nc) return nc;
        setRemember(opts.remember !== false);
        try {
            const { data, error } = await st.client.auth.signUp({
                email: String(email).trim(),
                password: String(password),
                options: { emailRedirectTo: redirectUrl() }
            });
            if (error) return fail(error);
            // E-posta onayı kapalıysa (mailer_autoconfirm) kayıt hemen oturum döndürür: doğrudan kullanıcı adı adımı.
            if (data && data.session) {
                await applySession(data.session);
                return { ok: true, needsConfirmation: false, state: st.state };
            }
            // Onay açıkken kayıtlı bir e-posta için Supabase sahte kullanıcı döner (identities boş): e-posta gitmez.
            const maybeExisting = !!(data && data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0);
            return { ok: true, needsConfirmation: true, email: String(email).trim(), maybeExisting };
        } catch (e) { return fail(e); }
    }

    async function resendConfirmation(email) {
        const e1 = validateEmail(email); if (e1) return { ok: false, error: { code: 'EMAIL_INVALID', message: e1 } };
        const nc = requireClient(); if (nc) return nc;
        try {
            const { error } = await st.client.auth.resend({ type: 'signup', email: String(email).trim(), options: { emailRedirectTo: redirectUrl() } });
            return error ? fail(error) : { ok: true };
        } catch (e) { return fail(e); }
    }

    async function signIn(email, password, opts = {}) {
        const e1 = validateEmail(email); if (e1) return { ok: false, error: { code: 'EMAIL_INVALID', message: e1 } };
        if (!password) return { ok: false, error: { code: 'PASSWORD_REQUIRED', message: 'Şifreni gir.' } };
        const nc = requireClient(); if (nc) return nc;
        setRemember(opts.remember !== false);
        try {
            const { data, error } = await st.client.auth.signInWithPassword({ email: String(email).trim(), password: String(password) });
            if (error) return fail(error);
            await applySession(data && data.session);
            return { ok: true, state: st.state };
        } catch (e) { return fail(e); }
    }

    async function sendPasswordReset(email) {
        const e1 = validateEmail(email); if (e1) return { ok: false, error: { code: 'EMAIL_INVALID', message: e1 } };
        const nc = requireClient(); if (nc) return nc;
        try {
            const { error } = await st.client.auth.resetPasswordForEmail(String(email).trim(), { redirectTo: redirectUrl() });
            return error ? fail(error) : { ok: true };
        } catch (e) { return fail(e); }
    }

    async function updatePassword(newPw) {
        const e2 = validatePassword(newPw); if (e2) return { ok: false, error: { code: 'PASSWORD_SHORT', message: e2 } };
        const nc = requireClient(); if (nc) return nc;
        if (!st.user) return fail('session_not_found');
        try {
            const { error } = await st.client.auth.updateUser({ password: String(newPw) });
            if (error) return fail(error);
            st.recovery = false;
            emit({ type: 'state' });
            return { ok: true };
        } catch (e) { return fail(e); }
    }

    async function signOut() {
        try {
            if (st.client) await st.client.auth.signOut({ scope: 'local' });
        } catch (e) {}
        clearStoredSessions();
        clearSession();
        return { ok: true };
    }

    async function setUsername(name) {
        const v = String(name || '').trim();
        const e1 = validateUsername(v); if (e1) return { ok: false, error: { code: 'USERNAME_INVALID', message: e1 } };
        const nc = requireClient(); if (nc) return nc;
        if (!st.user) return fail('NOT_AUTHENTICATED');
        try {
            const { data, error } = await st.client.rpc('set_username', { p_username: v });
            if (error) return fail(error);
            st.profile = Object.assign({}, st.profile || {}, data || {}, { username: (data && data.username) || v });
            st.profileError = null;
            await afterReady();
            setState();
            return { ok: true, profile: snapshot().profile };
        } catch (e) { return fail(e); }
    }

    /** { displayName?, avatar? } -> profiles satırını günceller (yalnızca bu iki sütun yazılabilir). */
    async function saveProfile(fields, opts = {}) {
        const patch = {};
        if (fields && fields.displayName !== undefined) {
            const e = validateDisplayName(fields.displayName);
            if (e) return { ok: false, error: { code: 'DISPLAY_NAME_INVALID', message: e } };
            patch.display_name = String(fields.displayName).trim();
        }
        if (fields && fields.avatar !== undefined) {
            const a = sanitizeAvatar(fields.avatar);
            if (!a) return { ok: false, error: { code: 'AVATAR_INVALID', message: 'Avatar kaydedilemedi (geçersiz biçim).' } };
            patch.avatar = a;
        }
        if (!Object.keys(patch).length) return { ok: true, profile: snapshot().profile };
        const nc = requireClient(); if (nc) return nc;
        if (!st.user) return fail('NOT_AUTHENTICATED');
        try {
            const { data, error } = await st.client.from('profiles').update(patch).eq('id', st.user.id).select(PROFILE_COLUMNS).maybeSingle();
            if (error) return fail(error);
            if (!data) return fail('UNKNOWN');
            st.profile = data;
            if (!opts.silent) emit({ type: 'profile_saved' });
            return { ok: true, profile: snapshot().profile };
        } catch (e) { return fail(e); }
    }

    function getProfile() {
        return st.profile ? JSON.parse(JSON.stringify(st.profile)) : null;
    }

    async function refreshProfile() {
        if (!st.user) return { ok: false, error: describeError('NOT_AUTHENTICATED') };
        await loadProfile();
        return st.profileError ? { ok: false, error: st.profileError } : { ok: true, profile: getProfile() };
    }

    /** Yerel istatistikleri sunucu kurallarına uyduran temizleyici (TASARIM.md §7). */
    function buildLocalProgress() {
        const solvedRaw = readLocalJSON('psikovaka_solved_cases', []);
        const solved = Array.isArray(solvedRaw)
            ? [...new Set(solvedRaw.filter(x => typeof x === 'string' && x.length > 0 && x.length <= 100))].slice(0, 2000)
            : [];
        const s = readLocalJSON('psikovaka_stats', null) || {};
        const dist = {};
        let distSum = 0;
        for (let i = 1; i <= 6; i++) {
            const d = toInt(s.distribution && s.distribution[i]);
            dist[String(i)] = d;
            distSum += d;
        }
        let won = Math.max(toInt(s.won), distSum);
        let played = Math.min(100000, Math.max(toInt(s.played), won));
        won = Math.min(won, played);
        if (distSum > won) {
            // Çok uç durum: dağılımı sınıra çek
            for (let i = 6; i >= 1 && distSum > won; i--) {
                const cut = Math.min(dist[String(i)], distSum - won);
                dist[String(i)] -= cut;
                distSum -= cut;
            }
        }
        const maxStreak = Math.min(toInt(s.maxStreak), won);
        const currentStreak = Math.min(toInt(s.currentStreak), maxStreak);
        return { solved, stats: { played, won, currentStreak, maxStreak, distribution: dist } };
    }

    /**
     * Bu cihazdaki ilerlemeyi hesaba bir kez aktarır. RP aktarılmaz.
     * Dönüş: { ok, status: 'imported' | 'already_imported' | 'nothing_to_import' | 'done_on_device' | 'error', ... }
     * Boş ilerleme gönderilmez (hesabın tek aktarım hakkı boşa harcanmasın).
     */
    async function importLocalProgressOnce() {
        if (!st.user || !st.client) return { ok: false, status: 'error', error: describeError('NOT_AUTHENTICATED') };
        const flagKey = IMPORT_FLAG_PREFIX + st.user.id;
        if (safeLocalGet(flagKey)) return { ok: true, status: 'done_on_device' };
        if (st.importedThisSession) return { ok: true, status: 'done_on_device' };
        const { solved, stats } = buildLocalProgress();
        if (!solved.length && stats.played === 0) return { ok: true, status: 'nothing_to_import' };
        st.importedThisSession = true;
        try {
            const { data, error } = await st.client.rpc('import_local_progress', { p_solved_case_ids: solved, p_stats: stats });
            if (error) {
                const d = describeError(error);
                if (d.code === 'ALREADY_IMPORTED') {
                    safeLocalSet(flagKey, 'already');
                    const r = { ok: true, status: 'already_imported' };
                    emit({ type: 'import', result: r });
                    return r;
                }
                st.importedThisSession = false;
                const r = { ok: false, status: 'error', error: d };
                emit({ type: 'import', result: r });
                return r;
            }
            safeLocalSet(flagKey, new Date().toISOString());
            const r = { ok: true, status: 'imported', importedCaseCount: data && data.imported_case_count, ignoredCaseCount: data && data.ignored_case_count };
            emit({ type: 'import', result: r });
            return r;
        } catch (e) {
            st.importedThisSession = false;
            return { ok: false, status: 'error', error: describeError(e) };
        }
    }

    /** Sıralama: { ok, rows: [...ilk N], me: satır | null }. Yalnızca giriş yapmış kullanıcı okuyabilir. */
    async function getLeaderboard(limit = 10) {
        const nc = requireClient(); if (nc) return nc;
        if (!st.user) return fail('NOT_AUTHENTICATED');
        try {
            const cols = 'user_id,username,display_name,avatar,ranked_points,matches_played,matches_won,position';
            const top = await st.client.from('leaderboard').select(cols).order('ranked_points', { ascending: false }).order('username', { ascending: true }).limit(limit);
            if (top.error) return fail(top.error);
            const rows = top.data || [];
            let me = rows.find(r => r.user_id === st.user.id) || null;
            if (!me && st.profile && st.profile.username) {
                const mine = await st.client.from('leaderboard').select(cols).eq('user_id', st.user.id).maybeSingle();
                if (!mine.error) me = mine.data || null;
            }
            return { ok: true, rows, me };
        } catch (e) { return fail(e); }
    }

    global.PsikoVakaAccount = {
        init,
        onChange,
        get state() { return st.state; },
        get availability() { return st.availability; },
        get lastRedirect() { return st.redirect; },
        snapshot,
        signUp,
        resendConfirmation,
        signIn,
        getRemember,
        sendPasswordReset,
        updatePassword,
        signOut,
        setUsername,
        saveProfile,
        getProfile,
        refreshProfile,
        importLocalProgressOnce,
        getLeaderboard,
        describeError,
        validateUsername,
        validateEmail,
        validatePassword,
        validateDisplayName,
        DEFAULT_AVATAR
    };
})(typeof window !== 'undefined' ? window : globalThis);
