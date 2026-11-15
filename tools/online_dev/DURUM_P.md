# Ajan P (istemci) — çalışma durumu

Son güncelleme: 2026-11-15. Yöntem: dosyalar Claude ortamında kopyada düzenlenip test edilir, sonra cihaza
birebir kopyalanır (önce cihazdaki md5'in değişmediği kontrol edilir). Yedek: `_arsiv/2026-11-15-ozellikler-oncesi/`.

## Sıra (her adım siteyi tutarlı bırakır)
- [x] 1. Vaka sonrası açıklama UI (`js/explain.js`, rapor penceresi `#resultExplainBox`, oyun ekranı `#playResultTakeaway`, online tur sonucu `roundExplain`) — tek kişilik test 60/60
- [x] 2. Lig tablosu (yeni eşikler) + Lig bilgisi ekranı `#/ligler` (`js/online/ligler.js`) — sınır 59/59, ekran 68/68 (sahte)
- [x] 3. Arkadaşı düelloya çağırma + davet afişinin lobi üst çubuğunu örtmemesi — 45/45 (sahte)
- [x] 4. Hızlı eşleşme (`js/online/quick.js`, lobi "is-quick" görünümü) — 73/73 (sahte)
- [x] 5. Günlük vaka sıralaması + seri (`js/online/daily.js`, `#/gunluk`) — 152/152 (sahte)
- [x] 6. RP v2 gösterimi (final dökümü, lig değişimi, ayrılma/pes uyarısında gerçek RP) — 42/42 (sahte)
- [x] 8. Kategori sızıntısı denetimi (`tests/p_leak.mjs`, her modda 20 vaka): arayüzde sızıntı YOK; yalnızca hasta özeti VERİSİNDE takma adlar (ajan R'ye bildirildi)
- [x] 7. Açıklamalar birleştirildi (138/138), ajan R devirleri (gold_remap.js, ölü dallar, takma ad testi 13/13), derleme Hata 0, günlük kaydı + DEVAM_PLANI yazıldı. TAMAM.

## Canlı
- Misafir canlı testi (`tests/p_live_guest.mjs`) 9/9: 0003 yokken girişler gizli/"yakında", yerel günlük çalışıyor.
- 2026-11-16: `.test-credentials.json`'daki 8 test hesabının şifresi canlıda REDDEDİLİYOR (invalid_credentials) → üye canlı testleri (düello vb.) yapılamadı.

## Testler (Claude ortamı; `lib.mjs` yolları oraya göre)
- Sahte: p_explain, p_explain_real, p_leagues, p_leagues_unit.js, p_challenge, p_quick, p_daily, p_rpv2, p_leak, p_alias, p_file (FILE=...), mock_ui
- Canlı misafir: p_live_guest

## Devam etmek için
- Testler: `tools/online_dev/tests/p_*.mjs` (lib.mjs yolları Claude ortamına göre).
