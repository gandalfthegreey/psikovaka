# Online katman (ajan M) — çalışma durumu

Son güncelleme: 2026-11-15. Bütün aşamalar tamam; yayın sayfası (index.html) yeni katmanı kullanıyor, eski arena söküldü.

## Aşamalar
- [x] 1. api.js + realtime.js + geliştirme sayfası; canlı duman testi
- [x] 2. Arkadaşlar + merkez (canlı: istek → kabul → çevrimiçi noktası → davet → katılma)
- [x] 3. Odalar + lobi sahnesi + başlatma kuralı + geri sayım (canlı)
- [x] 4. Düello / herkes tek `rounds`, sonuç, podyum, RP (canlı)
- [x] 5. Lobi etkileşimi (konum/duygu/mesaj), yeniden yükleme (lobi + tur ortası), hükmen, host devri (canlı)
- [x] 6. `hp` düello (canlı)  - [x] 7. `battle` 4 kişi (canlı)  - [x] 8. `bracket` 4 kişi + ağaç, ayrılma + kopma (canlı)
- [x] 9. index.html/app.js bağlantısı, eski arenanın kaldırılması (`js/online_arena.js` → `_arsiv/2026-11-15-online-oncesi/`), derleme, regresyon

## Bilinen açıklar
- CANLI CEVAP ANAHTARI ESKİ: sunucu arşivlenmiş vakaları (ör. case-146) seçebiliyor ve yeniden bağlanan vakalarda eski
  tanı kimliklerini doğru sayıyor (ör. case-122 → `social_anxiety_performance`). `supabase/seed/0002_cases_answer_key.sql`
  canlı projeye uygulanmalı (GitHub Action ya da SQL Editor). İstemci bunu algılar ve gösterir; geçici çözüm yazılmadı.
- `supabase/migrations/0002_online_ek.sql` (update_room_settings) canlıda yok: lobi "Ayarlar" sayfası salt okunur + "yakında".

## Dosyalar
- `js/online/` core, api, realtime, views (sheet/afiş/merkez/oda kurma), friends, rooms, lobby, match, online (giriş noktası)
- `css/online.css`, `js/avatar_studio.js` (eski arenadan kalan tek parça: avatar stüdyosu)
- `supabase/migrations/0002_online_ek.sql` + `supabase/tests/scenario.test.mjs` (46 test)
- `tools/online_dev/make_harness.js` → `harness.html` (git dışı); `?mock=1` → `mock.js` sahte sunucu (`olMock.scenario('lobby',{n:8,long:true})`)
- `tools/online_dev/stage9_patch.py` (aşama 9 yamasının kaydı; tekrar çalıştırmak güvenli)
- `tools/online_dev/tests/` Playwright betikleri (Claude ortamında yazıldı; `lib.mjs` içindeki Chrome/supabase-js yolları o ortama göre)

## Test komutları
- Statik sunucu: `python3 -m http.server 8899` (proje kökünde)
- `node tools/online_dev/tests/e2e_duel.mjs` (arkadaşlık+davet+düello), `MODE=hp|ffa|battle|bracket|combo node .../e2e_modes.mjs`,
  `node .../mock_ui.mjs` (360/390/1440 × koyu/açık, taşma + konsol), `node .../regress.mjs` (tek kişilik regresyon + tek dosya)
- Senaryo: `cd supabase/tests && npm install && npm test`
- Derleme: `node build_portable_single_file.js`
