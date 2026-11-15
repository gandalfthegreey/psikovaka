# PsikoVaka 3.0 — Proje Mimarisi ve Geliştirici Özeti

Bu doküman, projeyi inceleyecek yapay zeka asistanları (Claude vb.) veya geliştiriciler için mimari özet sunar.

## Canlı Yayın ve Depo
- **GitHub Deposu:** `https://github.com/gandalfthegreey/psikovaka`
- **Canlı Site (GitHub Pages):** `https://gandalfthegreey.github.io/psikovaka/`
- **Teknoloji Yığını:** İstemci taraflı Vanilla HTML / CSS / JavaScript (GitHub Pages, derleme adımı yok). İsteğe bağlı arka uç: Supabase (Auth + Postgres; hesaplar, profil, sıralama). Supabase erişilemezse site misafir modunda tamamen çalışır. Tarayıcıya yalnızca publishable anahtar konur (`js/supabase_config.js`).

## Dosya Yapısı
- `index.html` — Uygulama kabuğu: SVG simge seti (`#i-…`), üst çubuk + masaüstü menü, 5 ekran (`#screenHome` Oyna, `#screenOnline`, `#screenLibrary` Kütüphane, `#screenProfile`, `#screenPlay` vaka ekranı), telefon alt sekme çubuğu ve pencereler (pratik ayarları, vaka raporu, online arena merkezi, paketler, çözülen vakalar, istatistik, kılavuzlar, vaka stüdyosu, yardım, giriş/kayıt, kullanıcı adı, yeni şifre, profili düzenle, gizlilik). Satır içi stil yok; gizleme `hidden` niteliğiyle.
- `css/tokens.css` — Tasarım değişkenleri (renk, boşluk, köşe, yazı, gölge; koyu/açık tema `data-theme`). online_arena.js için eski değişken adlarına takma adlar da burada.
- `css/style.css` — Yerleşim, bileşenler, ekranlar, oyun ekranı, pencereler, duyarlı düzen.
- `css/arena.css` — Online arena merkezinin geçici stilleri (online_arena.js yeniden yazılınca sadeleşecek).
- `js/app.js` — `PsikoVakaGame` ana oyun sınıfı (günlük/pratik/özel vaka motoru, ipucu açma, kategori ağacı, JSON paket yükleme/birleştirme, çözülen vakalar arşivi, istatistikler). Hesap arayüzü (`initAccountUI`, giriş/kayıt/kullanıcı adı/yeni şifre/profil pencereleri). Arayüz kısmı: hash yönlendirici (`initRouter`, `showRoute`, `showScreen`, `enterPlayScreen`; rotalar `#/oyna`, `#/online`, `#/kutuphane`, `#/profil`; `#room=`, `#duel=`, `#id=`, `#case=` linkleri ayrıca işlenir) ve simge yardımcısı `icon(ad)`.
- `js/supabase_config.js` — Supabase adresi + publishable anahtar ve bayraklar (`accountsEnabled`, `passwordMinLength`).
- `js/avatar.js` — `window.PsikoVakaAvatar`: özgün "Nöro" avatar ailesi (yuvarlak, ucu parlayan dendrit tüylü yaratık). Satır içi SVG üretir (id/defs yok): `render(cfg, {size, framed, animated, title, emote})`, `normalize(cfg)` (eski v1 `{bg,skin,hat,eye,mouth,prop}` biçimini de v2'ye eşler), `randomConfig(seed?)`, `PARTS`, `SLOTS`, `EMOTES`. Yapılandırma v2: `{v:2, body, color, tufts, eyes, mouth, pattern, headwear, accessory, background}`. Animasyon/stüdyo stilleri `css/style.css` sonunda.
- `js/leagues.js` — `window.PsikoVakaLeagues`: tek lig tablosu (Bronz/Gümüş/Altın/Platin/Elmas 1-3, Uzman, Kahin; 17 kademe), `tierFor(rp)`, `progressText(rp)`, `badge(rp, size)` (SVG amblem).
- `js/account.js` — `window.PsikoVakaAccount`: Supabase Auth (PKCE) + `profiles` katmanı. Durumlar `guest | signed_in_no_username | ready`; giriş/kayıt/şifre sıfırlama, `set_username`, profil kaydetme, bir kerelik `import_local_progress`, `leaderboard` okuma; hataları Türkçe mesajlara çevirir, asla hata fırlatmaz. supabase-js `index.html`'de jsDelivr'dan (`#supabaseLib`, `async`) yüklenir. Yalnızca e-posta + şifre (Google girişi yok). "Oturumumu açık tut": özel `auth.storage` (tercih `psikovaka_auth_remember`; açık = localStorage, kapalı = sessionStorage; PKCE doğrulayıcısı her zaman localStorage). Arayüz bağlantısı `js/app.js` içinde `initAccountUI()` ve devamı.
- `js/online_arena.js` — `attachOnlineArenaToGame(PsikoVakaGame)` ile bağlanan çevrimiçi katman:
  - 3 mod: 1v1 Canlı Düello, Free-For-All (Herkes Tek), Elemeli Turnuva.
  - 3 katmanlı gerçek zamanlı senkronizasyon: `wss://ntfy.sh` WebSocket/HTTP relay, `BroadcastChannel` ve PeerJS WebRTC (`stun.l.google.com:19302`, `global.stun.twilio.com:3478`) + 2.5 sn kalp atışı (`ROOM_STATE_SYNC`).
  - Senkron tur kilidi (`areAllActivePlayersFinished`), tahmin sırasına göre puanlama (`calculateCasePoints`), RP (Ranked Points; lig adları `js/leagues.js`'ten), sıralama sekmesi (yalnızca sunucudaki `leaderboard`; giriş gerektirir, bot yok), Nöro avatar stüdyosu (`renderAvatarStudioTab`; `renderFunnyAvatarSVG` artık `PsikoVakaAvatar.render` için ince sarmalayıcı), `DR-XXXX` arkadaş kodu ve canlı davet sistemi.
- `js/cases.js` — 138 aktif klinik vaka (`CLINICAL_CASES`; `caseNumber` 1–150, 12 numara arşivde: `tools/icerik/tani_temizligi/arsivlenen_vakalar.json`) ve ders kategorileri (`COURSE_CATEGORIES`).
- `js/diagnoses.js` — 207 resmî DSM-5-TR tanısı (`DIAGNOSES_DATABASE`) ve 21 tanı kategorisi (`DSM_CATEGORIES`). Tahmin listesinde yalnızca resmî DSM-5-TR Bölüm II tanıları bulunur (Emre kararı, 2026-11-15); kararlar `tools/icerik/tani_temizligi/KARAR_TABLOSU.md`, listeden çıkan kavramların özetleri `tools/icerik/tani_temizligi/liste_disi_kavramlar.json`.
- `js/dsm_manual.js` — Tanılara ait detaylı klinik özetler ve DSM-5 kriter listeleri (`DSM5_MANUAL`; 207 girdi, `DIAGNOSES_DATABASE` ile birebir). Tutarlılık denetimi: `node tools/icerik/tani_temizligi/dogrula.js`.
- `js/therapies.js` — Psikoterapi protokolleri (`THERAPIES_DATABASE`) ve ekol aileleri (`THERAPY_FAMILIES`).
- `js/pharmacology.js` — Psikofarmakoloji/biyolojik tedavi protokolleri (`PHARMACOLOGY_DATABASE`, `PHARMACOLOGY_FAMILIES`), `DIAGNOSIS_TO_PHARMACOLOGY_MAP` (her tanı için bir anahtar; `DIAGNOSES_DATABASE` ile birebir) ve `resolvePharmacologyIdForCase`.
- `build_portable_single_file.js` — Tüm vakaları doğrulayan ve tek dosyalık taşınabilir `PsikoVaka_Tam_Surum.html` dosyasını üreten Node.js derleyicisi. CSS dosyalarını (`CSS_FILES`) ve yerel `<script src>` satırlarını (`JS_FILES`, 11 dosya) birebir eşleştirip satır içine alır; dış CDN etiketleri (PeerJS, supabase-js) dışarıda kalır. Doğrulama hatası varsa çıkış kodu 1 ve hiçbir dosya yazılmaz. Yeni CSS/JS dosyası eklenirse listeler güncellenmeli.
- `manifest.json` — PWA manifest dosyası (açıklamada sayı yok).
- `paketler/vaka_paketi_{20,40,60,80,150}.json` — İndirilebilir vaka paketleri; `js/cases.js`'ten üretilir (aktif vakalar; aralıklar: 30–49, 50–69, 70–89, 90–109, 110–150 `caseNumber`). Eski sürümler `_arsiv/eski-paketler/`.

## Önemli Kurallar ve Veri Şeması
1. Her klinik vaka 6 ipucu (`clues` dizisi, uzunluk 6), `diagnosisId`, `therapyId`, `pharmacologyId`, `category`, `differentialDiagnosis`, `dsmCriteriaSummary`, `symptomHighlights` ve `miniQuiz` alanlarını içerir.
2. Veri dosyaları (`js/cases.js`, `js/diagnoses.js`, `js/dsm_manual.js`, `js/therapies.js`, `js/pharmacology.js`) oldukça büyüktür; kod incelemelerinde önce `index.html`, `js/app.js`, `js/online_arena.js` ve `css/` dosyalarına odaklanılmalıdır.
3. Arayüzde ve derleme çıktısında sabit sayı yazılmaz; vaka/tanı sayıları çalışma anında `CLINICAL_CASES.length` vb. değerlerden hesaplanır. Yerleşik paketler (`getBuiltInPacksDefinition`) `caseNumber` aralıklarıyla tanımlıdır (1–29, 30–49, 50–69, 70–89, 90–109, 110–150); 150 üstü ya da numarasız vakalar otomatik "Yeni Vakalar" paketine girer, boş paket gizlenir, kayıtlı paket kimliği artık yoksa "Tüm Vakalar"a dönülür. İçe aktarılan pakette tanısı `DIAGNOSES_DATABASE`'de olmayan vakalar atlanır ve kullanıcıya bildirilir.
4. Yayın tek adımdır: `GITHUBA_YUKLE.bat` (→ `node deploy_to_github.js`) sırayla `node build_portable_single_file.js` (vaka doğrulama + tek dosya paketleme; hata varsa durur), `node supabase/seed/generate_answer_key.js` (sunucu cevap anahtarı SQL'i) çalıştırır, sonra commit + `git push origin main` yapar (`--force` yok). Push sonrası `.github/workflows/supabase-cevap-anahtari.yml` cevap anahtarını yeniden üretip `SUPABASE_DB_URL` secret'ı ile Supabase'e uygular. `supabase/migrations/*` otomatik uygulanmaz (elle, gözden geçirilerek). Git'e yazmadan denemek için: `node deploy_to_github.js --dry-run [--skip-build]`. Ayrıntı: `supabase/README.md`.

## Çoklu Asistan Çalışması
Bu klasörde Gemini de çalışıyor. Her işe başlamadan önce `AI_ISBIRLIGI.md` dosyasını oku; değişikliklerini oradaki
"Değişiklik Günlüğü"ne yaz ve "Şu An Üzerinde Çalışılanlar" tablosunu güncel tut. Dosya silme, `_arsiv/` altına taşı.
