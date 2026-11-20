# Ajan W (hata düzeltme) — çalışma durumu

Başlangıç: 2026-11-20. Yöntem: tüm düzenleme/test Claude ortamındaki kopyada (`/home/claude/w`); cihaza yalnızca en sonda, mtime/md5 doğrulanarak kopyalanır.
Cihaza kopyalandı (2026-11-20); iş bitti. Önceki not: cihazdaki dosyalara kopyalamadan önce dokunulmamıştı (yalnızca bu not ve `tools/online_dev/.w_md5_stage.txt` = hazırlık anındaki md5 listesi).

- [x] 1. Maç sonrası RP/lig tazeleme (`js/online/online.js`: `refreshRpViews`, final + hub'a dönüş) — kopyada yapıldı, `tests/p_w.mjs` bölüm 1
- [x] 2. Hızlı oda zaman aşımı iki olay (`online.js`: imza `close_reason` + `isQuickTimeout`) — kopyada yapıldı, `p_w.mjs` bölüm 2
- [x] 3. Ayrılma uyarısı (`online.js`: `leaveRoundsLeft`, 0 → düz metin) — kopyada yapıldı, `p_w.mjs` bölüm 3
- [x] 4. Arkadaş listesi (`friends.js`: doğrulama okuması + `refreshOnShow`; `online.js`: 'online' ekran kancası, görünürlük/online olayı) — kopyada yapıldı, `p_w.mjs` bölüm 4
- [x] 5. Veri notu: circadian ilaç bağlantıları kaldırıldı
- [x] Ek: ajan X'in 0004 kural değişiklikleri (erken ayrılma bayrağı, günlük sıralama metni) — bütçe kalırsa
Testler: `p_w.mjs` düzeltmeden önce 20 ok / 15 fail, sonra 35/0 (sahte sunucu). Mock: `tools/online_dev/mock.js` genişletildi (emitRoomChange, emitFriendship, emitResync, setRp, refreshCalls).
