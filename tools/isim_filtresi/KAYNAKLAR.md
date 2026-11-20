# İsim filtresi — kaynaklar ve seçim ilkeleri

`liste.json` aşağıdaki açık listelerden **seçilerek** ve elle genişletilerek hazırlandı (2026-11-20, Claude ajan K2).
Listeler kelimesi kelimesine kopyalanmadı; kökler, yaygın yazım kaçamakları ve birleşik biçimler PsikoVaka'nın
kullanıcı adı/görünen ad ihtiyacına göre yeniden yazıldı.

| Kaynak | Lisans | Ne alındı |
|---|---|---|
| [LDNOOBW — "List of Dirty, Naughty, Obscene and Otherwise Bad Words"](https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words) (Shutterstock kökenli), `en` ve `tr` dosyaları | CC BY 4.0 | İngilizce küfür, cinsel argo, ırkçı/nefret ifadeleri; Türkçe kökler (am, amcık, göt, götveren, kaltak, orospu, sik, siktir, taşak, yarak, saksocu…) |
| [terlik.js](https://github.com/badursun/terlik.js) 2.6.0 (npm) | MIT | Türkçe kökler ve varyantları (amk/aq, orospu çocuğu yazımları, yavşak, pezevenk, gavat, ibne…), Türkçe ek listesi fikri, Kiril benzer harf tablosu, leet tablosu, Türkçe beyaz liste örnekleri (sıkıntı, sikke, ambulans…) |
| [turkish-profanity-filter](https://github.com/derdogant/turkish-profanity-filter) 1.0.7 (npm) | MIT | Karşılaştırma için incelendi |

Atıf (CC BY 4.0): LDNOOBW katkıcıları, "List of Dirty, Naughty, Obscene and Otherwise Bad Words", değiştirilerek kullanıldı.

## Seçim ilkeleri
- **Alınanlar:** cinsel küfür ve argo, ağır hakaretler (orospu, şerefsiz, yavşak…), etnik/dinî/cinsel yönelim aşağılamaları ve nefret
  ifadeleri (Türkçe birleşik kalıplar dahil: "pis…", "…dölü"), Nazi/KKK sembolleri, pedofili adları, ayrılmış adlar (yönetici,
  destek, PsikoVaka, Claude…).
- **Bilerek alınmayanlar:** hafif hakaretler (salak, aptal, mal, eşek…: "malzeme", "maliye" gibi masum sözcükleri de vururdu),
  tehditler/cümleler, nötr anatomi ve klinik terimler (penis, vajina, anal evre, seks, cinsel işlev bozukluğu, voyörizm,
  fetişizm, sadizm, mazoşizm…: oyun bunları vaka ve tanı olarak kullanıyor), etnik/dinî grup adlarının kendisi (çingene, Kürt,
  Ermeni, Yahudi, Arap: tek başına değil, yalnızca aşağılayıcı birleşik kalıpta).
- **Kısa kökler** (am, sik, göt, piç, oç, amk, aq, bok, ass, dick, cum…) serbest alt dizge olarak aranmaz; yalnızca ayrı sözcük
  (ayraç ya da BüyükHarf geçişiyle) + izinli ekler olarak, `amk` ayrıca sözcük başında/sonunda. "Göt" tek başına (İngilizce "got"
  ile çakışır) serbest; ekli biçimleri (götü, götün, götveren…) yasak.
- **Beyaz liste** Scunthorpe sorununu çözer: bir eşleşme tamamen beyaz listedeki bir sözcüğün içinde kalıyorsa yok sayılır
  (Scunthorpe, assistant, classic, therapist, amca, sikke, sıkıcı, Kasımpaşa, Beşiktaş…).

## Bilinen ödünleşimler
- ı -> i katlaması yüzünden "sık/sıkı" ailesi ile küfür kökü ASCII'de ayırt edilemez; sık kullanılan masum biçimler beyaz listede,
  "Sık" tek başına ve "Işıktır" gibi nadir biçimler engellenir.
- "Amina" (ad) engellenir (Türkçe hakaret kalıbıyla aynı yazım); "Amine", "Amin", "Emine" serbest.
- Kararlı biri yeni yazımlar bulabilir (ör. harf yerine benzer başka işaret, v/u değiş tokuşu, ünlü atma). Liste veridir: yeni
  sözcük eklemek için `supabase/README.md` "İsim filtresi" paragrafı.
