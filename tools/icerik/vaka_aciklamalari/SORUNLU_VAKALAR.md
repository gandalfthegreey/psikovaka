# Sorunlu vakalar (Claude ajan O, 2026-11-15)

Açıklamalar yazılırken ipuçları ile kayıtlı `diagnosisId` karşılaştırıldı. **Hiçbir vaka değiştirilmedi.**
Önemli not: `js/app.js` (satır ~2280) tanıyı yalnızca **birebir id eşleşmesiyle** doğru sayıyor
(`chosenObj.id === currentCase.diagnosisId`; aynı kategori yalnızca "sıcak" sayılır). Bu yüzden veritabanında daha
özgül bir alt tip id'si varken genel id'nin cevap olması, en doğru tanıyı seçen öğrenciyi yanlış saymak anlamına gelir.

## A. Ciddi: ipuçları kayıtlı cevabı desteklemiyor

| Vaka | Kayıtlı | Sorun | Önerilen düzeltme |
|---|---|---|---|
| case-063 | `pica` | İpuçlarında yenmeyen madde yeme hiç yok; yalnızca beyaz/kuru yiyecekleri yeme, doku-koku-renk nedeniyle reddetme, kilo korkusu yok, büyüme geriliği. `patientSummary` bile "(ARFID …)" diyor. Tablo birebir ARFID (bkz. case-097). | `diagnosisId: "arfid"`; `therapyId`/`pharmacologyId`/`miniQuiz`/`differentialDiagnosis` ARFID'e göre gözden geçirilmeli. Açıklamada bu uyumsuzluk öğrenciye açıkça not edildi; düzeltilince `whyThis[0]` (Not: …) maddesi silinmeli. |
| case-066 | `factitious_disorder` (kendine yüklenen) | Anne belirtileri **çocuğunda** üretiyor (Münchausen by proxy); özet de "Başkasına Yüklenen" diyor. Aynı tablo case-130'da doğru olarak `factitious_another`. | `diagnosisId: "factitious_another"`. Açıklamadaki `whyThis[0]` (Not: …) maddesi düzeltmeden sonra silinmeli. |

## B. Aynı klinik tablo farklı vakalarda farklı id ile kodlanmış (tutarsızlık)

| Tablo | Vakalar | Öneri |
|---|---|---|
| PNES (psikojenik non-epileptik nöbet) | case-062 → `conversion_disorder`, case-129 → `conversion_seizures` | case-062 → `conversion_seizures`. |
| Füg ile giden dissosiyatif amnezi | case-045 → `dissociative_amnesia`, case-128 → `dissociative_fugue` | DSM-5-TR'de füg ayrı tanı değil, dissosiyatif amnezinin belirtecidir. İkisini aynı id'de birleştirin (tercihen `dissociative_amnesia`), ya da `dissociative_fugue`'u kabul edilen eşdeğer cevap yapın. Ayrıca case-045'te ipucu 3 ("travmatik olayla bağlantılı bellek") ile ipucu 1 (adını bile bilmiyor, genel amnezi) çelişiyor. |
| Kan-enjeksiyon-yaralanma fobisi | case-057 → `specific_phobia`, case-120 → `specific_phobia_blood` | case-057 → `specific_phobia_blood`. |

## C. Daha özgül bir alt tip id'si var ve ipuçları açıkça onu tarif ediyor

| Vaka | Kayıtlı | Önerilen | Gerekçe |
|---|---|---|---|
| case-012 | `conversion_disorder` | `conversion_motor` | Bacak felci, Hoover pozitif. |
| case-018 | `anorexia_nervosa` | `anorexia_restricting` | Yalnızca kısıtlama; tıkınma/çıkarma yok. |
| case-019 | `specific_phobia` | `specific_phobia_animal` | Köpek fobisi. |
| case-040 | `adjustment_disorder` | `adjustment_disorder_depressed` (tartışmalı) | Ağlama, karamsarlık öne çıkıyor; "durumsal anksiyete" de var, karma alt tip id'si yok. Genel id kalabilir ama alt tipi seçen öğrenci yanlış sayılıyor. |
| case-058 | `schizoaffective` | `schizoaffective_bipolar` | Manik epizodlar. |
| case-087 | `anorexia_nervosa` | `anorexia_binge_purge` | Tıkınma + kusma, Russell belirtisi; DD'nin kendisi de bunu vurguluyor. |

Alternatif genel çözüm: `app.js`'te alt tip ile üst tanıyı (ör. `specific_phobia` ↔ `specific_phobia_*`) doğru ya da "kısmen doğru" sayan bir eşdeğerlik tablosu.

## D. Küçük ipucu sorunları (tanı doğru, ifade düzeltilebilir)

- **case-036** (`paranoid_pd`): İpucu 1-2'deki casus yazılım iddiası, eşin telefonunu klonlama ve kanıtsız aldatma inancı sanrılı bozukluk (kıskançlık tipi) eşiğine çok yakın; ipucu 4 bunu "sabit sanrı yok" diyerek kapatıyor. İnançların sorgulanabilir/dalgalı olduğu bir ifade eklenmeli.
- **case-116** (`bipolar_1`, hızlı döngülü): İpucu 4 venlafaksin ve hipotiroidinin döngüyü "tetiklediğini" söylüyor; bu, `substance_induced_bipolar`'ı da savunulabilir kılıyor. "Hızlandırmış olabilir; ilaçtan önce de manik epizod öyküsü var" gibi bir ifade önerilir.
- **case-118** (`mdd`, atipik): DD hipotiroidiyi TSH ile dışlıyor ama ipuçlarında tiroid testi yok. İpucu 4'e "TSH normal" eklenmeli.
- **case-012, case-129** (konversiyon): "bilinçdışı çatışma", "birincil kazanç", "la belle indifférence" ifadeleri DSM-5-TR ile uyumsuz/eski; psikolojik etken artık tanı için şart değil ve aldırmazlık ayırt edici değil. Açıklamalar bunu doğru biçimde öğretiyor; ipuçları sadeleştirilebilir.
- **Genel:** Vakaların çoğunda 6. ipucu tanı ölçütlerini neredeyse tanının adıyla birlikte veriyor (ör. "DSM-5'e göre: … Sanrılı Bozukluk tablosudur"). Bu, son ipucunu öğretici değil cevap anahtarı yapıyor; kapsam dışı ama not edildi.

## Çözüm (Claude ajan R, 2026-11-15)

- **A:** case-063 → `arfid`, case-066 → `factitious_another` (bağlı alanlar zaten uyumluydu; 063'ün ayırıcı tanısına Pika eklendi). Açıklamalardaki "Not:" maddeleri silindi; eski yanlış cevap whyNot'a eklendi.
- **B ve C:** Emre'nin kuralı gereği belirleyici/alt tip girdileri listeden çıkarıldı ve üst tanıya eşlendi (31 id; bkz. `tani_temizligi/KARAR_TABLOSU.md` 2. tur). 062/129 → `conversion_disorder`, 045/128 → `dissociative_amnesia`, 057/120 → `specific_phobia`; 012, 018, 019, 040, 058, 087 genel id'de kaldı (alt tip id'leri artık yok). `app.js` eşdeğerlik tablosuna gerek kalmadı.
- **D:** dokunulmadı (036, 116, 118 ipucu ifadeleri; 012/129 eski terimler; 6. ipucunun tanıyı adlandırması). case-045 ipucu 1 ile 3 arasındaki çelişki de açık. Yalnızca 118 ipucu 2'deki "Klasik depresyon hastalarının aksine" etiketi "Beklenenin aksine" oldu (başlık sızıntısı temizliği).
