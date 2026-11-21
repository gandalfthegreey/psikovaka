/**
 * PsikoVaka Online — Sınıf (projeksiyon) modu: sunucu sözleşmesi sarmalayıcısı (supabase/TASARIM.md §15).
 * Hiçbir yöntem hata fırlatmaz: { ok, data } | { ok:false, error:{ code, message, detail } } (api.js ile aynı).
 * Ağ katmanı `transport` içindedir; geliştirme sahte sunucusu (tools/online_dev/mock.js) yalnızca onu değiştirir.
 * Saat: her yanıttaki `server_now` ile ayrı bir saat farkı tutulur (büyük sıçramalar hemen kabul edilir).
 */
(function (global) {
    'use strict';
    const NS = global.PsikoVakaOnline;

    const MSG = {
        UNSUPPORTED: 'Sınıf modu sunucuda henüz açık değil.',
        NOT_AUTHENTICATED: 'Bağlantı kurulamadı. Sayfayı yenileyip tekrar dene.',
        SINIF_YOK: 'Bu kodla açık bir oturum yok. Kodu kontrol et.',
        SINIF_DOLU: 'Oturum dolu.',
        SINIF_BASLADI: 'Oyun başladı; bu oturuma sonradan katılınamıyor.',
        TAKMA_AD_GECERSIZ: 'Takma ad 2–16 karakter olmalı: harf, rakam, boşluk ya da _ - .',
        TAKMA_AD_UYGUNSUZ: 'Bu ad kullanılamıyor. Lütfen başka bir ad seç.',
        TAKMA_AD_ALINMIS: 'Bu takma ad bu oturumda alınmış. Başka bir ad seç.',
        ATILDIN: 'Oturumu açan kişi seni oturumdan çıkardı.',
        SUNUCU_KATILAMAZ: 'Bu oturumu sen açtın. Katılımcı olarak başka bir cihazdan katıl.',
        COK_FAZLA_ISTEK: 'Çok fazla deneme yaptın. Biraz bekleyip tekrar dene.',
        SINIF_BITTI: 'Oturum bitti.',
        ANON_IZINSIZ: 'Oturum açmak için hesabınla giriş yapmalısın.',
        USERNAME_REQUIRED: 'Önce bir kullanıcı adı seç.',
        INVALID_SETTINGS: 'Ayarlar geçersiz.',
        NOT_ENOUGH_CASES: 'Bu süzgece uyan yeterli vaka yok. Vaka sayısını azalt ya da süzgeci kaldır.',
        COK_FAZLA_OTURUM: 'En fazla 3 açık oturumun olabilir. Önce birini bitir.',
        CODE_GENERATION_FAILED: 'Kod üretilemedi. Tekrar dene.',
        SADECE_SUNUCU: 'Bunu yalnızca oturumu açan kişi yapabilir.',
        KATILIMCI_YOK: 'Katılımcı bulunamadı.',
        KIMSE_YOK: 'Başlatmak için en az bir katılımcı gerekli.',
        TUR_KAPALI: 'Bu tur kapandı.',
        TUR_BASLAMADI: 'Tur henüz başlamadı.',
        TUR_DISI: 'Bu tura sonradan katıldın; sonraki turdan oynarsın.',
        ZATEN_COZDUN: 'Bu turu zaten çözdün.',
        HAK_BITTI: 'Bu turda tahmin hakkın bitti.',
        UNKNOWN_ITEM: 'Listede yok; öneriden seç.',
        DUPLICATE_GUESS: 'Bunu zaten tahmin ettin.',
        ASAMA_UYGUN_DEGIL: 'Şu an bu adım yapılamaz.',
        ANON_KAPALI: 'Takma adla katılım şu an kapalı. Oturumu açan kişiye haber ver.',
        NO_CLIENT: 'Sunucuya ulaşılamıyor.'
    };

    // ------------------------------------------------------------ saat (server_now)
    const clock = {
        offset: 0, rtt: Infinity, samples: 0,
        sample(serverIso, t0, t1) {
            const s = Date.parse(serverIso);
            if (!isFinite(s)) return;
            const rtt = Math.max(0, t1 - t0);
            const off = s - (t0 + t1) / 2;
            this.rtt = this.rtt * 1.05 + 5;
            // en kısa gidiş-dönüş kazanır; 2 sn'den büyük sıçrama (uyku, saat değişimi) hemen kabul edilir
            if (rtt <= this.rtt || this.samples < 3 || Math.abs(off - this.offset) > 2000 + rtt) { this.offset = off; this.rtt = rtt; }
            this.samples++;
        },
        now() { return Date.now() + this.offset; }
    };

    function account() { return global.PsikoVakaAccount || null; }
    function client() { return NS.api && NS.api.client ? NS.api.client() : null; }

    // ------------------------------------------------------------ taşıma (gerçek: supabase-js)
    const realTransport = {
        async rpc(fn, args) {
            const c = client();
            if (!c) return { data: null, error: { message: 'NO_CLIENT' } };
            return c.rpc(fn, args || {});
        },
        async select(table, q) {
            const c = client();
            if (!c) return { data: null, error: { message: 'NO_CLIENT' } };
            if (table === 'sinif_tur_sonuclari') {
                let b = c.from('sinif_tur_sonuclari').select('katilimci_id,tur_no,tahmin_sayisi,bitti,cozdu,ipucu_no,puan,sure_ms').eq('oturum_id', q.oturum_id);
                if (q.tur_no != null) b = b.eq('tur_no', q.tur_no);
                return b;
            }
            if (table === 'sinif_katilimcilar') return c.from('sinif_katilimcilar').select('id,user_id').eq('oturum_id', q.oturum_id);
            if (table === 'profiles') return c.from('profiles').select('id,avatar').in('id', q.ids || []);
            return { data: [], error: null };
        },
        /** handlers: { onChange(table, payload), onStatus('live'|'down'), onResync() } */
        subscribe(oturumId, opts, handlers) {
            if (!NS.realtime || !NS.realtime.joinSinif) return null;
            return NS.realtime.joinSinif(oturumId, opts, handlers);
        },
        async signInAnonymously() {
            const A = account();
            if (!A || typeof A.signInAnonymously !== 'function') return { ok: false, error: { code: 'NO_CLIENT' } };
            return A.signInAnonymously();
        }
    };

    function mapError(e) {
        if (!e) return { code: 'UNKNOWN', message: 'Bir şeyler ters gitti.' };
        const m = String(e.message || '');
        if (e.code === 'PGRST202' || /Could not find the function/i.test(m)) return { code: 'UNSUPPORTED', message: MSG.UNSUPPORTED };
        if (MSG[m]) { const out = { code: m, message: MSG[m] }; if (e.details != null) out.detail = e.details; return out; }
        const base = NS.api && NS.api.mapError ? NS.api.mapError(e) : { code: 'UNKNOWN', message: m || 'Bir şeyler ters gitti.' };
        if (e.details != null) base.detail = e.details;
        return base;
    }

    async function call(fn, args) {
        const t0 = Date.now();
        try {
            const r = await api.transport.rpc(fn, args);
            const t1 = Date.now();
            if (!r) return { ok: false, error: mapError(null) };
            if (r.error) return { ok: false, error: mapError(r.error) };
            const d = r.data;
            if (d && d.server_now) clock.sample(d.server_now, t0, t1);
            return { ok: true, data: d };
        } catch (e) { return { ok: false, error: mapError(e) }; }
    }
    async function select(table, q) {
        try {
            const r = await api.transport.select(table, q);
            if (!r || r.error) return { ok: false, error: mapError(r && r.error) };
            return { ok: true, data: r.data || [] };
        } catch (e) { return { ok: false, error: mapError(e) }; }
    }

    // ------------------------------------------------------------ özellik algılama
    let support = null, probing = null;
    const PROBE_ID = '00000000-0000-0000-0000-000000000000';
    /** §15 RPC'leri sunucuda var mı? file:// ya da hesap hizmeti yoksa hayır. Sonuç sayfa ömrü boyunca saklanır (olumsuz sonuç 60 sn). */
    function probe() {
        if (support === true) return Promise.resolve(true);
        if (support === false && api._probedAt && Date.now() - api._probedAt < 60000) return Promise.resolve(false);
        if (probing) return probing;
        probing = (async () => {
            if (typeof location !== 'undefined' && location.protocol === 'file:') { support = false; api._probedAt = Date.now(); return false; }
            const A = account();
            if (!A || A.availability !== 'ready') { probing = null; return false; }   // hizmet hazır değil: henüz karar verme
            const r = await call('sinif_ozet', { p_oturum: PROBE_ID });
            // fonksiyon varsa: SINIF_YOK / NOT_AUTHENTICATED / yetki hatası; yoksa PGRST202
            if (!r.ok && ['OFFLINE', 'NETWORK', 'NO_CLIENT'].includes(r.error.code)) { probing = null; return false; }
            support = r.ok || r.error.code !== 'UNSUPPORTED';
            api._probedAt = Date.now();
            probing = null;
            return support;
        })();
        return probing;
    }

    const api = {
        transport: realTransport,
        realTransport,
        clock,
        MSG,
        mapError,
        call,
        select,
        probe,
        get supported() { return support; },
        _reset() { support = null; probing = null; },

        olustur: (ayarlar) => call('sinif_olustur', { p_ayarlar: ayarlar || {} }),
        oturumlarim: () => call('sinif_oturumlarim', {}),
        katil: (kod, ad) => call('sinif_katil', { p_kod: String(kod || '').replace(/\s+/g, '').toUpperCase(), p_takma_ad: ad == null ? null : String(ad) }),
        ayril: (id) => call('sinif_ayril', { p_oturum: id }),
        at: (id, kid) => call('sinif_at', { p_oturum: id, p_katilimci: kid }),
        basla: (id) => call('sinif_basla', { p_oturum: id }),
        tahmin: (id, item, tur) => call('sinif_tahmin', { p_oturum: id, p_item_id: item, p_tur_no: tur == null ? null : tur }),
        turuBitir: (id) => call('sinif_turu_bitir', { p_oturum: id }),
        sonraki: (id, beklenen) => call('sinif_sonraki', { p_oturum: id, p_beklenen: beklenen || null }),
        bitir: (id) => call('sinif_bitir', { p_oturum: id }),
        durum: (id) => call('sinif_durum', { p_oturum: id }),
        ozet: (id) => call('sinif_ozet', { p_oturum: id }),
        /** Sunucu: bu turun sonuç satırları (çözen sayısı için; §15.5 sunucu hepsini okur). */
        turSonuclari: (id, tur) => select('sinif_tur_sonuclari', { oturum_id: id, tur_no: tur }),
        /** Sunucu: katılımcı → auth kullanıcısı (hesaplı katılımcıların gerçek Nöro'su için). */
        katilimciKullanicilari: (id) => select('sinif_katilimcilar', { oturum_id: id }),
        profilAvatarlari: (ids) => (ids && ids.length ? select('profiles', { ids }) : Promise.resolve({ ok: true, data: [] })),
        subscribe(id, opts, handlers) { try { return api.transport.subscribe(id, opts, handlers); } catch (e) { return null; } },
        /** Yalnızca sınıf katılımı için: oturum yoksa anonim giriş (hesaplı ya da zaten anonim kullanıcıda bir şey yapmaz). */
        async ensureSession() {
            const A = account();
            const s = A && A.snapshot ? A.snapshot() : null;
            if (s && (s.user || s.anonymous)) return { ok: true, data: { anonymous: !s.user } };
            try {
                const r = await api.transport.signInAnonymously();
                if (r && r.ok) return { ok: true, data: { anonymous: true } };
                const code = (r && r.error && r.error.code) || 'UNKNOWN';
                return { ok: false, error: { code, message: MSG[code] || (r && r.error && r.error.message) || MSG.NOT_AUTHENTICATED } };
            } catch (e) { return { ok: false, error: mapError(e) }; }
        }
    };

    NS.sinifApi = api;
})(typeof window !== 'undefined' ? window : globalThis);
