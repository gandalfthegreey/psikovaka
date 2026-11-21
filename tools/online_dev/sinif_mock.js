/**
 * YALNIZCA GELİŞTİRME: Sınıf (projeksiyon) modu sahte sunucusu — supabase/TASARIM.md §15 sözleşmesinin JS kopyası.
 * Tarayıcıda (harness.html?mock=1 → mock.js bağlar) ve Node'da (Playwright testleri: tek sunucu, birden çok tarayıcı bağlamı)
 * aynı kod çalışır. Saat dışarıdan verilir (sahte saat): create({ now: () => ms }).
 *   const S = PsikoVakaSinifMock.create({ cases, diagnoses, isimUygun, now })
 *   S.call(uid, 'sinif_katil', { p_kod, p_takma_ad }) -> { data } | { error: { message, details } }
 *   S.select(uid, 'sinif_tur_sonuclari', { oturum_id, tur_no }) -> { data } (RLS'e göre)
 *   S.on(fn) -> fn({ table, eventType, new }) (Realtime postgres_changes karşılığı; RLS süzgecini çağıran yapar: S.canSee(uid, ev))
 *   S.users[uid] = { username, display_name, avatar, anonymous }
 */
(function (root, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    if (root) root.PsikoVakaSinifMock = api;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this), function () {
    'use strict';
    const TABAN = { 1: 1000, 2: 850, 3: 700, 4: 550, 5: 400, 6: 250 };
    const KOD_ALFABE = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const AD_RE = /^[\p{L}0-9 _.\-]+$/u;
    const ACIK = ['lobi', 'tur', 'cevap', 'skor'];

    function create(opts) {
        const o = opts || {};
        const now = o.now || (() => Date.now());
        const cases = (o.cases || []).filter(c => c && c.id && c.diagnosisId);
        const diag = new Map((o.diagnoses || []).map(d => [d.id, d]));
        const isimUygun = o.isimUygun || (() => true);
        const geriSayimMs = o.geriSayimMs != null ? o.geriSayimMs : 3000;
        let seed = o.seed || 12345;
        const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
        const users = {};
        const oturumlar = new Map();   // id -> oturum
        const listeners = new Set();
        const katilimLog = [];         // { uid, oturum, t }
        let seq = 0;
        const uuid = () => { seq++; return `5100000${String(seq).padStart(5, '0')}`.slice(0, 8) + '-0000-4000-8000-' + String(seq).padStart(12, '0'); };
        const iso = (ms) => (ms == null ? null : new Date(ms).toISOString());
        const err = (message, details) => ({ error: { message, details: details == null ? null : String(details) } });
        const okd = (data) => ({ data: Object.assign({ ok: true, server_now: iso(now()) }, data) });

        function emit(table, eventType, row) {
            const ev = { table, eventType, new: JSON.parse(JSON.stringify(row)) };
            listeners.forEach(fn => { try { fn(ev); } catch (e) { /* yok */ } });
        }
        function rowOturum(s) {
            return { id: s.id, kod: s.kod, host_id: s.host_id, durum: s.durum, surum: s.surum, tur_no: s.tur_no, vaka_sayisi: s.ayarlar.vaka_sayisi,
                ipucu_araligi_sn: s.ayarlar.ipucu_araligi_sn, tahmin_hakki: s.ayarlar.tahmin_hakki, kapasite: s.ayarlar.kapasite, gec_katilim: s.ayarlar.gec_katilim,
                tur_baslangic: iso(s.tur_baslangic), tur_son: iso(s.tur_son), tur_kapandi: iso(s.tur_kapandi), olusturma: iso(s.olusturma), durum_degisti: iso(s.durum_degisti), bitis: iso(s.bitis), bitis_nedeni: s.bitis_nedeni };
        }
        function rowKat(k) { return { id: k.id, oturum_id: k.oturum_id, user_id: k.user_id, takma_ad: k.takma_ad, puan: k.puan, dogru_sayisi: k.dogru_sayisi, toplam_sure_ms: k.toplam_sure_ms, katildigi_tur: k.katildigi_tur, katilma: iso(k.katilma), ayrildi: k.ayrildi, atildi: k.atildi }; }
        function rowSonuc(s, r) { return { oturum_id: s.id, tur_no: r.tur_no, katilimci_id: r.katilimci_id, tahmin_sayisi: r.tahmin_sayisi, bitti: r.bitti, cozdu: r.cozdu, ipucu_no: r.ipucu_no, puan: r.puan, sure_ms: r.sure_ms }; }

        function degisti(s) { s.surum++; s.durum_degisti = now(); emit('sinif_oturumlari', 'UPDATE', rowOturum(s)); }

        function aktif(s, k) { return !k.ayrildi && !k.atildi && k.katildigi_tur <= s.tur_no; }
        function aktifler(s) { return s.katilimcilar.filter(k => aktif(s, k)); }
        function sonuc(s, tur, kid) { return s.sonuclar.find(r => r.tur_no === tur && r.katilimci_id === kid) || null; }
        function ipucuNo(s, t) {
            if (s.tur_baslangic == null) return 0;
            const g = (t - s.tur_baslangic) / 1000;
            return g < 0 ? 0 : Math.min(6, 1 + Math.floor(g / s.ayarlar.ipucu_araligi_sn));
        }

        function zamanAsimi(s) {
            if (!ACIK.includes(s.durum)) return;
            const t = now();
            if (t - s.durum_degisti > 2 * 3600e3 || t - s.olusturma > 24 * 3600e3) bitir(s, 'zaman_asimi');
        }
        /** Tembel geçiş: tur süresi dolduysa kapat. */
        function denetle(s) {
            zamanAsimi(s);
            if (s.durum === 'tur' && s.tur_son != null && now() >= s.tur_son) turuKapat(s, 'sure');
        }
        function turuKapat(s, neden) {
            if (s.durum !== 'tur') return;
            const tur = s.tur_no;
            s.tur_kapandi = now();
            s.tur_kapanma_nedeni = neden;
            aktifler(s).forEach(k => {
                const r = sonuc(s, tur, k.id);
                if (r && r.cozdu) { k.puan += r.puan; k.dogru_sayisi++; k.toplam_sure_ms += r.sure_ms || 0; }
                emit('sinif_katilimcilar', 'UPDATE', rowKat(k));
            });
            const c = s.vakalar[tur - 1];
            s.turSonuclari.push({ tur_no: tur, case_id: c.id, cevap: cevap(c), cozen_sayisi: s.sonuclar.filter(r => r.tur_no === tur && r.cozdu).length, katilan_sayisi: aktifler(s).length });
            s.durum = 'cevap';
            degisti(s);
        }
        function cevap(c) { return { diagnosis_id: c.diagnosisId, therapy_id: c.therapyId || null, pharmacology_id: c.pharmacologyId || null }; }
        function turAc(s, n) {
            s.tur_no = n;
            s.tur_baslangic = now() + geriSayimMs;
            s.tur_son = s.tur_baslangic + 6 * s.ayarlar.ipucu_araligi_sn * 1000;
            s.tur_kapandi = null; s.tur_kapanma_nedeni = null;
            s.durum = 'tur';
            s.turlar.push({ tur_no: n, case_id: s.vakalar[n - 1].id, baslangic: s.tur_baslangic, son: s.tur_son });
            degisti(s);
        }
        function bitir(s, neden) {
            if (!ACIK.includes(s.durum)) return;
            if (s.durum === 'lobi') { s.durum = 'iptal'; s.bitis = now(); s.bitis_nedeni = neden || 'sunucu'; degisti(s); return; }
            if (s.durum === 'tur') turuKapat(s, 'oturum_bitti');
            s.durum = 'bitti'; s.bitis = now(); s.bitis_nedeni = neden || 'sunucu';
            degisti(s);
        }
        function sirali(s) {
            const list = s.katilimcilar.filter(k => !k.atildi).slice();
            list.sort((a, b) => b.puan - a.puan || b.dogru_sayisi - a.dogru_sayisi || a.toplam_sure_ms - b.toplam_sure_ms || a.takma_ad.localeCompare(b.takma_ad, 'tr'));
            let lastP = null, lastR = 0;
            list.forEach((k, i) => { if (k.puan !== lastP) { lastR = i + 1; lastP = k.puan; } k._sira = lastR; });
            return list;
        }
        function bul(uid, id) {
            const s = oturumlar.get(id);
            if (!s) return { e: err('SINIF_YOK', 'Oturum bulunamadı.') };
            denetle(s);
            if (s.host_id === uid) return { s, rol: 'sunucu' };
            const k = s.katilimcilar.find(x => x.user_id === uid);
            if (!k) return { e: err('SINIF_YOK', 'Oturum bulunamadı.') };
            if (k.atildi) return { e: err('ATILDIN', 'Bu oturumdan çıkarıldın.') };
            return { s, rol: 'katilimci', k };
        }
        function durum(s, rol, k) {
            const t = now();
            const sira = sirali(s);
            const turAcik = s.durum === 'tur';
            const kapandi = s.tur_no > 0 && !turAcik && s.tur_kapandi != null;
            const tr = s.tur_no > 0 ? s.turlar[s.tur_no - 1] : null;
            const ak = aktifler(s);
            const tur = tr ? {
                tur_no: tr.tur_no, case_id: tr.case_id, baslangic: iso(tr.baslangic), son: iso(tr.son), ipucu_no: turAcik ? ipucuNo(s, t) : 6,
                kapandi: iso(s.tur_kapandi), kapanma_nedeni: s.tur_kapanma_nedeni || null,
                aktif_sayisi: ak.length, biten_sayisi: ak.filter(x => { const r = sonuc(s, s.tur_no, x.id); return r && r.bitti; }).length,
                cozen_sayisi: kapandi ? s.sonuclar.filter(r => r.tur_no === s.tur_no && r.cozdu).length : null,
                cevap: ['cevap', 'skor', 'bitti'].includes(s.durum) ? cevap(s.vakalar[tr.tur_no - 1]) : null
            } : null;
            let ben = null;
            if (rol === 'katilimci') {
                const r = s.tur_no > 0 ? sonuc(s, s.tur_no, k.id) : null;
                ben = { katilimci_id: k.id, takma_ad: k.takma_ad, puan: k.puan, sira: k._sira, katildigi_tur: k.katildigi_tur, aktif: aktif(s, k),
                    tur: s.tur_no > 0 ? { tahmin_sayisi: r ? r.tahmin_sayisi : 0, kalan: s.ayarlar.tahmin_hakki - (r ? r.tahmin_sayisi : 0), bitti: !!(r && r.bitti), cozdu: !!(r && r.cozdu), puan: r ? r.puan : 0 } : null,
                    tahminlerim: s.tahminler.filter(g => g.katilimci_id === k.id && g.tur_no === s.tur_no).map(g => ({ tahmin_no: g.tahmin_no, item_id: g.item_id, dogru: g.dogru, ayni_grup: g.ayni_grup, ipucu_no: g.ipucu_no })) };
            }
            const host = users[s.host_id] || {};
            return Object.assign({ ok: true, server_now: iso(t) }, {
                rol,
                oturum: { id: s.id, kod: s.kod, durum: s.durum, surum: s.surum, tur_no: s.tur_no, vaka_sayisi: s.ayarlar.vaka_sayisi, ayarlar: Object.assign({}, s.ayarlar),
                    sunucu: { username: host.username || null, display_name: host.display_name || null, avatar: host.avatar || {} },
                    katilimci_sayisi: s.katilimcilar.filter(x => !x.ayrildi && !x.atildi).length, olusturma: iso(s.olusturma), bitis: iso(s.bitis), bitis_nedeni: s.bitis_nedeni },
                tur, ben,
                katilimcilar: sira.map(x => {
                    const r = s.tur_no > 0 ? sonuc(s, s.tur_no, x.id) : null;
                    return { katilimci_id: x.id, takma_ad: x.takma_ad, puan: x.puan, sira: x._sira, dogru_sayisi: x.dogru_sayisi, ayrildi: x.ayrildi, katildigi_tur: x.katildigi_tur,
                        bitti: !!(r && r.bitti), tur_puan: kapandi ? (r ? r.puan : 0) : null, cozdu: kapandi ? !!(r && r.cozdu) : null, ipucu_no: kapandi ? (r && r.cozdu ? r.ipucu_no : null) : null };
                }),
                tur_sonuclari: s.turSonuclari.slice(-15).map(x => Object.assign({}, x)),
                podyum: s.durum === 'bitti' ? sira.filter(x => x._sira <= 3).map(x => ({ sira: x._sira, katilimci_id: x.id, takma_ad: x.takma_ad, puan: x.puan })) : null
            });
        }
        function arr(v) { return v == null ? null : (Array.isArray(v) ? v : [v]).map(String); }

        const RPC = {
            sinif_olustur(uid, a) {
                const u = users[uid];
                if (!u) return err('NOT_AUTHENTICATED');
                if (u.anonymous) return err('ANON_IZINSIZ', 'Anonim hesap oturum açamaz.');
                if (!u.username) return err('USERNAME_REQUIRED');
                const p = a.p_ayarlar || {};
                const ay = { vaka_sayisi: 5, hedef: 'diagnosis', kurslar: null, kategoriler: null, ipucu_araligi_sn: 15, tahmin_hakki: 3, kapasite: 100, gec_katilim: true };
                const intIn = (k, lo, hi) => { if (p[k] == null) return true; const v = Number(p[k]); if (!Number.isInteger(v) || v < lo || v > hi) return false; ay[k] = v; return true; };
                if (!intIn('vaka_sayisi', 3, 15)) return err('INVALID_SETTINGS', 'vaka_sayisi');
                if (!intIn('ipucu_araligi_sn', 8, 60)) return err('INVALID_SETTINGS', 'ipucu_araligi_sn');
                if (!intIn('tahmin_hakki', 1, 6)) return err('INVALID_SETTINGS', 'tahmin_hakki');
                if (!intIn('kapasite', 2, 100)) return err('INVALID_SETTINGS', 'kapasite');
                if (p.hedef != null && p.hedef !== 'diagnosis') return err('INVALID_SETTINGS', 'hedef');
                if (p.gec_katilim != null) ay.gec_katilim = !!p.gec_katilim;
                ay.kurslar = arr(p.kurslar); ay.kategoriler = arr(p.kategoriler);
                const uygun = cases.filter(c => (!ay.kurslar || ay.kurslar.includes(c.course)) && (!ay.kategoriler || ay.kategoriler.includes(c.category)));
                if (uygun.length < ay.vaka_sayisi) return err('NOT_ENOUGH_CASES', uygun.length);
                const acik = [...oturumlar.values()].filter(s => { zamanAsimi(s); return s.host_id === uid && ACIK.includes(s.durum); });
                if (acik.length >= 3) return err('COK_FAZLA_OTURUM');
                const pool = uygun.slice();
                for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
                let kod;
                do { kod = Array.from({ length: 6 }, () => KOD_ALFABE[Math.floor(rnd() * KOD_ALFABE.length)]).join(''); } while ([...oturumlar.values()].some(s => s.kod === kod && ACIK.includes(s.durum)));
                if (o.kod && ![...oturumlar.values()].some(s => s.kod === o.kod && ACIK.includes(s.durum))) kod = o.kod;
                const s = { id: uuid(), kod, host_id: uid, durum: 'lobi', surum: 1, tur_no: 0, ayarlar: ay, vakalar: pool.slice(0, ay.vaka_sayisi), katilimcilar: [], sonuclar: [], tahminler: [], turlar: [], turSonuclari: [],
                    tur_baslangic: null, tur_son: null, tur_kapandi: null, tur_kapanma_nedeni: null, olusturma: now(), durum_degisti: now(), bitis: null, bitis_nedeni: null };
                oturumlar.set(s.id, s);
                return okd({ oturum_id: s.id, kod: s.kod, ayarlar: Object.assign({}, ay) });
            },
            sinif_oturumlarim(uid) {
                const u = users[uid];
                if (!u) return err('NOT_AUTHENTICATED');
                if (u.anonymous) return err('ANON_IZINSIZ');
                const list = [...oturumlar.values()].filter(s => { zamanAsimi(s); return s.host_id === uid && ACIK.includes(s.durum); })
                    .map(s => ({ oturum_id: s.id, kod: s.kod, durum: s.durum, tur_no: s.tur_no, vaka_sayisi: s.ayarlar.vaka_sayisi, katilimci_sayisi: s.katilimcilar.filter(x => !x.ayrildi && !x.atildi).length, olusturma: iso(s.olusturma) }));
                return okd({ oturumlar: list });
            },
            sinif_katil(uid, a) {
                const u = users[uid];
                if (!u) return err('NOT_AUTHENTICATED');
                const kod = String(a.p_kod || '').replace(/\s+/g, '').toUpperCase();
                const s = [...oturumlar.values()].find(x => x.kod === kod && (zamanAsimi(x), denetle(x), ACIK.includes(x.durum)));
                if (!s) return err('SINIF_YOK', 'Bu kodla açık bir oturum yok.');
                if (s.host_id === uid) return err('SUNUCU_KATILAMAZ');
                const aktifSay = () => s.katilimcilar.filter(x => !x.ayrildi && !x.atildi).length;
                const var_ = s.katilimcilar.find(x => x.user_id === uid);
                if (var_) {
                    if (var_.atildi) return err('ATILDIN', 'Bu oturumdan çıkarıldın.');
                    if (var_.ayrildi && aktifSay() >= s.ayarlar.kapasite) return err('SINIF_DOLU');
                    if (var_.ayrildi) { var_.ayrildi = false; emit('sinif_katilimcilar', 'UPDATE', rowKat(var_)); }
                    return okd({ oturum_id: s.id, katilimci_id: var_.id, takma_ad: var_.takma_ad, yeniden: true, katildigi_tur: var_.katildigi_tur, durum: s.durum, tur_no: s.tur_no });
                }
                const t = now();
                if (katilimLog.filter(x => x.uid === uid && t - x.t < 3600e3 && x.oturum !== s.id).length >= 10) return err('COK_FAZLA_ISTEK');
                if (s.durum !== 'lobi' && !s.ayarlar.gec_katilim) return err('SINIF_BASLADI');
                let ad = a.p_takma_ad == null ? (u.anonymous ? null : u.username) : String(a.p_takma_ad);
                if (ad == null) return err('TAKMA_AD_GECERSIZ');
                ad = ad.trim().replace(/\s+/g, ' ');
                if (ad.length < 2 || ad.length > 16 || !AD_RE.test(ad)) return err('TAKMA_AD_GECERSIZ', 'Takma ad 2–16 karakter olmalı.');
                if (!isimUygun(ad)) return err('TAKMA_AD_UYGUNSUZ');
                if (s.katilimcilar.some(x => x.takma_ad.toLocaleLowerCase('tr') === ad.toLocaleLowerCase('tr'))) return err('TAKMA_AD_ALINMIS');
                if (aktifSay() >= s.ayarlar.kapasite) return err('SINIF_DOLU');
                const katildigi = s.durum === 'lobi' ? 1 : s.tur_no + 1;
                const k = { id: uuid(), oturum_id: s.id, user_id: uid, takma_ad: ad, puan: 0, dogru_sayisi: 0, toplam_sure_ms: 0, katildigi_tur: katildigi, katilma: t, ayrildi: false, atildi: false, hatali: {} };
                s.katilimcilar.push(k);
                katilimLog.push({ uid, oturum: s.id, t });
                emit('sinif_katilimcilar', 'INSERT', rowKat(k));
                return okd({ oturum_id: s.id, katilimci_id: k.id, takma_ad: ad, yeniden: false, katildigi_tur: katildigi, durum: s.durum, tur_no: s.tur_no });
            },
            sinif_ayril(uid, a) {
                const f = bul(uid, a.p_oturum); if (f.e) return f.e.error.message === 'ATILDIN' ? okd({}) : f.e;
                if (f.rol !== 'katilimci') return err('SINIF_YOK');
                if (!f.k.ayrildi) { f.k.ayrildi = true; emit('sinif_katilimcilar', 'UPDATE', rowKat(f.k)); herkesBittiMi(f.s); }
                return okd({});
            },
            sinif_at(uid, a) {
                const f = bul(uid, a.p_oturum); if (f.e) return f.e;
                if (f.rol !== 'sunucu') return err('SADECE_SUNUCU');
                const k = f.s.katilimcilar.find(x => x.id === a.p_katilimci);
                if (!k) return err('KATILIMCI_YOK');
                if (!k.atildi) { k.atildi = true; emit('sinif_katilimcilar', 'UPDATE', rowKat(k)); herkesBittiMi(f.s); }
                return okd({});
            },
            sinif_basla(uid, a) {
                const f = bul(uid, a.p_oturum); if (f.e) return f.e;
                const s = f.s;
                if (f.rol !== 'sunucu') return err('SADECE_SUNUCU');
                if (!ACIK.includes(s.durum)) return err('SINIF_BITTI');
                if (s.durum !== 'lobi') return err('SINIF_BASLADI');
                if (!s.katilimcilar.some(x => !x.ayrildi && !x.atildi)) return err('KIMSE_YOK');
                turAc(s, 1);
                return { data: durum(s, 'sunucu') };
            },
            sinif_tahmin(uid, a) {
                const f = bul(uid, a.p_oturum); if (f.e) return f.e;
                const s = f.s;
                if (f.rol !== 'katilimci') return err('SINIF_YOK');
                const k = f.k;
                if (s.durum !== 'tur' || (a.p_tur_no != null && a.p_tur_no !== s.tur_no)) return err('TUR_KAPALI');
                const t = now();
                if (t < s.tur_baslangic) return err('TUR_BASLAMADI');
                if (k.ayrildi) return err('SINIF_YOK', 'Oturumdan ayrıldın.');   // §15.9 (1)
                if (k.katildigi_tur > s.tur_no) return err('TUR_DISI');
                let r = sonuc(s, s.tur_no, k.id);
                if (r && r.cozdu) return err('ZATEN_COZDUN');
                if (r && r.bitti) return err('HAK_BITTI');
                const hk = k.hatali[s.tur_no] || 0;
                const item = String(a.p_item_id || '');
                if (!diag.has(item)) { if (hk >= 30) return err('COK_FAZLA_ISTEK'); k.hatali[s.tur_no] = hk + 1; return err('UNKNOWN_ITEM'); }
                if (s.tahminler.some(g => g.katilimci_id === k.id && g.tur_no === s.tur_no && g.item_id === item)) { if (hk >= 30) return err('COK_FAZLA_ISTEK'); k.hatali[s.tur_no] = hk + 1; return err('DUPLICATE_GUESS'); }
                const c = s.vakalar[s.tur_no - 1];
                const ip = ipucuNo(s, t);
                const dogru = item === c.diagnosisId;
                const d1 = diag.get(item), d2 = diag.get(c.diagnosisId);
                const ayni = !dogru && !!(d1 && d2 && d1.category === d2.category);
                const yeni = !r;
                if (!r) { r = { tur_no: s.tur_no, katilimci_id: k.id, tahmin_sayisi: 0, bitti: false, cozdu: false, ipucu_no: null, puan: 0, sure_ms: null }; s.sonuclar.push(r); }
                r.tahmin_sayisi++;
                s.tahminler.push({ katilimci_id: k.id, tur_no: s.tur_no, tahmin_no: r.tahmin_sayisi, item_id: item, dogru, ayni_grup: ayni, ipucu_no: ip });
                if (dogru) {
                    const gecen = (t - s.tur_baslangic) / 1000, ar = s.ayarlar.ipucu_araligi_sn;
                    const tt = gecen - (ip - 1) * ar;
                    const bonus = Math.max(0, Math.min(100, Math.round(100 * (1 - tt / ar))));
                    r.cozdu = true; r.bitti = true; r.ipucu_no = ip; r.puan = TABAN[ip] + bonus; r.sure_ms = Math.round(t - s.tur_baslangic);
                } else if (r.tahmin_sayisi >= s.ayarlar.tahmin_hakki) r.bitti = true;
                emit('sinif_tur_sonuclari', yeni ? 'INSERT' : 'UPDATE', rowSonuc(s, r));
                const out = { tur_no: s.tur_no, item_id: item, correct: dogru, same_group: ayni, guess_no: r.tahmin_sayisi, guesses_left: s.ayarlar.tahmin_hakki - r.tahmin_sayisi, done: r.bitti, points: r.cozdu ? r.puan : 0, clue_index: ip };
                herkesBittiMi(s);
                return okd(out);
            },
            sinif_turu_bitir(uid, a) {
                const f = bul(uid, a.p_oturum); if (f.e) return f.e;
                if (f.rol !== 'sunucu') return err('SADECE_SUNUCU');
                if (!ACIK.includes(f.s.durum)) return err('SINIF_BITTI');
                const d = f.s.durum === 'tur';
                if (d) turuKapat(f.s, 'sunucu');
                return { data: Object.assign(durum(f.s, 'sunucu'), { degisti: d }) };
            },
            sinif_sonraki(uid, a) {
                const f = bul(uid, a.p_oturum); if (f.e) return f.e;
                const s = f.s;
                if (f.rol !== 'sunucu') return err('SADECE_SUNUCU');
                if (!ACIK.includes(s.durum)) return err('SINIF_BITTI');
                if (a.p_beklenen != null && a.p_beklenen !== s.durum) return { data: Object.assign(durum(s, 'sunucu'), { degisti: false }) };
                if (s.durum === 'lobi' || s.durum === 'tur') return err('ASAMA_UYGUN_DEGIL');
                if (s.durum === 'cevap') { s.durum = 'skor'; degisti(s); }
                else if (s.durum === 'skor') { if (s.tur_no < s.ayarlar.vaka_sayisi) turAc(s, s.tur_no + 1); else bitir(s, 'tamamlandi'); }
                return { data: Object.assign(durum(s, 'sunucu'), { degisti: true }) };
            },
            sinif_bitir(uid, a) {
                const f = bul(uid, a.p_oturum); if (f.e) return f.e;
                if (f.rol !== 'sunucu') return err('SADECE_SUNUCU');
                bitir(f.s, 'sunucu');
                return { data: durum(f.s, 'sunucu') };
            },
            sinif_durum(uid, a) {
                const f = bul(uid, a.p_oturum); if (f.e) return f.e;
                return { data: durum(f.s, f.rol, f.k) };
            },
            sinif_ozet(uid, a) {
                const f = bul(uid, a.p_oturum); if (f.e) return f.e;
                const s = f.s;
                return okd({ durum: s.durum, surum: s.surum, tur_no: s.tur_no, vaka_sayisi: s.ayarlar.vaka_sayisi, katilimci_sayisi: s.katilimcilar.filter(x => !x.ayrildi && !x.atildi).length,
                    tur_baslangic: iso(s.tur_baslangic), tur_son: iso(s.tur_son), ipucu_araligi_sn: s.ayarlar.ipucu_araligi_sn });
            }
        };
        function herkesBittiMi(s) {
            if (s.durum !== 'tur') return;
            const ak = aktifler(s);
            if (ak.length && ak.every(k => { const r = sonuc(s, s.tur_no, k.id); return r && r.bitti; })) turuKapat(s, 'herkes_bitti');
        }

        const S = {
            users,
            oturumlar,
            fail: null,   // { fn: 'sinif_ozet', code: 'NETWORK' } -> o RPC ağ hatası verir (testler)
            call(uid, fn, args) {
                if (S.fail && (S.fail.fn === '*' || S.fail.fn === fn)) return { error: { message: S.fail.code || 'NETWORK', details: null, network: true } };
                const f = RPC[fn];
                if (!f) return { error: { code: 'PGRST202', message: 'Could not find the function public.' + fn } };
                if (!uid || !users[uid]) return err('NOT_AUTHENTICATED');
                try { return f(uid, args || {}); } catch (e) { return err('MOCK_HATA', e && e.message); }
            },
            select(uid, table, q) {
                const s = oturumlar.get(q && q.oturum_id);
                if (!s) return { data: [] };
                const host = s.host_id === uid;
                const uye = host || s.katilimcilar.some(k => k.user_id === uid && !k.atildi);
                if (!uye) return { data: [] };
                if (table === 'sinif_katilimcilar') return { data: s.katilimcilar.map(rowKat) };
                if (table === 'sinif_tur_sonuclari') {
                    const me = s.katilimcilar.find(k => k.user_id === uid);
                    return { data: s.sonuclar.filter(r => (q.tur_no == null || r.tur_no === q.tur_no) && (host || (me && r.katilimci_id === me.id) || s.turlar[r.tur_no - 1] && (r.tur_no < s.tur_no || s.durum !== 'tur'))).map(r => rowSonuc(s, r)) };
                }
                return { data: [] };
            },
            /** Realtime RLS: bu olayı bu kullanıcı görür mü? */
            canSee(uid, ev) {
                const id = ev.new.oturum_id || ev.new.id;
                const s = oturumlar.get(id);
                if (!s) return false;
                if (s.host_id === uid) return true;
                const me = s.katilimcilar.find(k => k.user_id === uid && !k.atildi);
                if (!me) return false;
                if (ev.table === 'sinif_tur_sonuclari') return ev.new.katilimci_id === me.id || s.durum !== 'tur' || ev.new.tur_no < s.tur_no;
                return true;
            },
            on(fn) { listeners.add(fn); return () => listeners.delete(fn); },
            /** Test yardımcısı: oturumun iç durumu (cevap dahil). */
            ic(id) { return oturumlar.get(id) || null; },
            ipucuNo(id) { const s = oturumlar.get(id); return s ? ipucuNo(s, now()) : 0; }
        };
        return S;
    }
    return { create, TABAN };
});
