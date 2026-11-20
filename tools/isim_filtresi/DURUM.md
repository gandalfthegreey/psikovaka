# İsim filtresi — çalışma durumu (Claude ajan K2)

Geçici ilerleme notu; iş bitince günlük kaydı `AI_ISBIRLIGI.md`'de olacak.

## Kilometre taşları
- [x] 1. Liste + üretici: `liste.json`, `cekirdek.js` (normalleştirme + eşleştirme), `uret.js` (istemci dosyası, SQL verisi, veri migration'ı)
- [x] 2. Normalleştirici + derlem testi (`test/izinli.txt`, `test/engellenmeli.txt`, `test/calistir.mjs`)
- [x] 3. Migration 0005 + senaryo testleri (Claude ortamında; cihaza yalnızca en sonda)
- [x] 4. İstemci (`js/isim_filtresi.js`, `js/account.js`, `index.html` script etiketi, derleyici listesi) + Playwright
- [x] 5. Belgeler, migration'ın yerine konması, günlük

## Notlar
- 4. adım: `js/account.js` (filtre, 3 hata kodu, needs_rename -> zorunlu adım + açıklama satırı, 0005 öncesi sunucuda sütunsuz geri düşüş), script etiketi + derleyici listesi. `test/istemci.mjs` 39/39 (sahte supabase istemcisi, gerçek account.js/app.js).
- 3. adım: 0005 taslağı `supabase/tools/0005_isim_filtresi.sql.taslak` (Actions okumaz). Testler: isim_filtresi.test.mjs 21/21, scenario 46/46, daily_quick 51/51 (PGlite) / 53/53 (PG 16.15), apply_migrations.sh 0001-0004 üstüne yalnızca 0005, ikinci çalıştırma 0. Veri güncelleme akışı (--yeni-migration -> 0006) denendi. scenario/daily_quick/package.json değişiklikleri (0005 yükleme) en sonda cihaza gelecek.
- 2. adım sonucu: engellenmeli 185 satır / 2567 türev %100 engellendi; izinli 597 ad, 0 yanlış pozitif; SQL (PGlite) ile JS 3151 girdide 0 fark.
- BİTTİ (2026-11-20): 0005 `supabase/migrations/`da; günlük kaydı AI_ISBIRLIGI.md'de.
