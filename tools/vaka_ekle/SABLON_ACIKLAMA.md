# `sablon.json` alan açıklamaları

`sablon.json`, `tools/vaka_ekle/dogrula.js`'ten hatasız geçen eksiksiz bir örnek yeni vakadır
(`mild_neurocognitive_vascular`, Hafif Vasküler Nörobilişsel Bozukluk; bu tanının vakası yoktu).
Yeni vaka dosyası her zaman bir **JSON dizisidir**: `[ {vaka}, {vaka}, ... ]`. JSON'da yorum, sonda virgül ve
kaçışsız çift tırnak olamaz; metin içinde tırnak gerekiyorsa tek tırnak (`'...'`) kullan.

Şablon bilerek tek bir uyarı verir: `pharmacologyId` tanı→protokol haritasından farklı seçildi
(hafif tabloda kolinesteraz inhibitörü birinci basamak değil). Uyarılar ekleme engellemez; gerekçeliyse kalabilir.

## Oyun ne zaman neyi gösterir

| Ne zaman | Görünen alanlar |
|---|---|
| **Vaka sırasında** (tahmin bitmeden) | `patientSummary` (başlık), `difficulty` (rozet), `clues` (1'den 6'ya, oyuncu istedikçe açılır; 6'sı da tahminden önce görülebilir), `course` adı (alan filtresi). Kategori, aynı kategoriden bir yanlış tahminde "sıcak" ipucu olarak sezilir. |
| **Vaka bittikten sonra** | `symptomHighlights` (ipucunda vurgulanan metin + `dsmMatch` etiketi), `dsmCriteriaSummary`, `differentialDiagnosis`, `treatmentModality`, `miniQuiz`, `explanation` ("Neden bu tanı / neden diğerleri değil"), terapi ve ilaç aşamalarının doğru cevapları (`therapyId`, `pharmacologyId`). |

Bu yüzden **başlıkta ve 1-5. ipuçlarında** tanının adı, takma adları, İngilizce adı, DSM kategori adı ya da alan (course)
adı geçemez (doğrulayıcı büyük/küçük harf, Türkçe İ/ı ve aksan farkı gözetmeden arar; Türkçe ekleri de yakalar).
6. ipucu belirleyici bulguyu vermeli; tanının adını söylemesi yalnızca uyarıdır ama son ipucunu bedava yapar, söyleme.
Tanı doğru sayılması **birebir `diagnosisId` eşleşmesiyle** olur: ipuçları listedeki komşu tanıları (alt tür, hafif/majör,
madde kaynaklı / tıbbi duruma bağlı vb.) açıkça dışlamalıdır, yoksa doğru düşünen oyuncu yanlış sayılır.

## Alanlar

| Alan | Tür | Kural | Görünür |
|---|---|---|---|
| `id`, `caseNumber` | metin, sayı | **Yazma.** `ekle.js` sıradaki boş numarayı atar (aktif + arşivlenmiş vakaların en büyüğü + 1; şu an 151 → `case-151`). Yazarsan tam bu değer olmalı. | — |
| `difficulty` | metin | Yalnızca `"Kolay"`, `"Orta"`, `"Zor"`, `"İleri Düzey"` (liste canlı veriden: `durum.js`). | önce |
| `course` | metin | `ADULT`, `CHILD`, `FORENSIC`, `NEURO_SOMATIC`, `IMPULSE`, `SUBSTANCE`. `ALL` ve `COMORBID` yeni vakada yasak. 18 yaş altı → çoğunlukla `CHILD`; madde → `SUBSTANCE`; nörobilişsel/bedensel belirti → `NEURO_SOMATIC`; parafili, antisosyal, adli bağlam → `FORENSIC`; dürtü denetimi/yıkıcı → `IMPULSE`; diğerleri `ADULT`. | önce (filtre) |
| `diagnosisId` | metin | `DIAGNOSES_DATABASE`'de olmalı (`durum.js` listeler). Bu vakanın tek doğru cevabıdır. | sonra |
| `category` | metin | O tanının `category` değeriyle aynı olmalı (`durum.js` tablosunda yazar). | ipucu olarak |
| `patientSummary` | metin | `"NN yaşında, cinsiyet, meslek/durum"` (mevcutlar 17-71 karakter). Tanı, kategori, alan etiketi yok. Parantez yalnızca nötr ölçü için: `(BKİ: 16.2 kg/m²)`. | önce |
| `clues` | 6 metin | Tam 6, hiçbiri boş değil. 1 = başvuru yakınması (geniş); 2-5 = giderek özgülleşen öykü, süre, dışlamalar, muayene/test (5. ipucu genelde `"Ruhsal Durum Muayenesinde: ..."`); 6 = belirleyici ayrıntı. Uzunluklar mevcut dağılıma yakın (çoğu 100-300 karakter). 1-5'te tanı/kategori/alan adı yasak. `<harf` biçiminde HTML benzeri metin yasak. | önce |
| `symptomHighlights` | 1-4 nesne | Her biri `{clueIndex, text, dsmMatch}`. `clueIndex` 0-5 (0 = 1. ipucu). `text` o ipucunda **birebir** geçen bir parça olmalı. `dsmMatch` `"Kriter A: ..."` biçiminde; `:` öncesi etiket olarak görünür. | sonra |
| `treatmentModality` | nesne | Tam olarak `goldStandardTherapy`, `therapyDetails`, `pharmacologyNote` (dolu metinler). | sonra |
| `miniQuiz` | nesne | Tam olarak `question`, `options` (tam 4 farklı seçenek), `correctIndex` (0-3), `explanation`. Oyun seçenekleri karıştırmaz: mevcut vakaların hepsinde doğru cevap A; yenilerde doğru cevabın yerini değiştir. | sonra |
| `differentialDiagnosis` | metin | Satırlar `"• Tanı Adı: neden değil"`, satırlar `\n` ile ayrılır (1-3 satır). Adlar mümkünse listedeki Türkçe adlar; id yazma. | sonra |
| `dsmCriteriaSummary` | metin | Tek satır `"DSM-5-TR: ölçüt + ölçüt + ..."`. | sonra |
| `therapyId` | metin | `THERAPIES_DATABASE`'de olmalı. Aynı/benzer tanının mevcut vakalarında ya da `goldForDiagnoses` listesinde ne varsa onu seç (`durum.js --tani <id>`). | sonra (cevap) |
| `pharmacologyId` | metin, isteğe bağlı | `PHARMACOLOGY_DATABASE`'de olmalı. Yazılmazsa `resolvePharmacologyIdForCase` (çoğunlukla tanı→protokol haritası) seçer. Haritadan farklıysa uyarı çıkar. | sonra (cevap) |
| `explanation` | nesne | Tam olarak `whyThis` (2-4 cümle: hangi bulgu hangi ölçütü karşılıyor), `whyNot` (2-3 `{diagnosisId, reason}`; id'ler listede olmalı, cevaptan farklı ve tekrarsız olmalı; en güçlü benzerleri seç), `teachingPoint` (tek akılda kalıcı ders). Toplam 40-200 kelime (160 üstü uyarı). | sonra |

Ek alan yok: `secondaryDiagnosisId` (çift tanılı vaka) bu hatla eklenmez.

## Doğrulayıcının uyarıları (eklemeyi engellemez)
- İpucu uzunluğu mevcut dağılımın çok dışında.
- Tanının zaten 3+ vakası var.
- 1. ipucunda tanıya özgü ölçüt kelimeleri çok (tanı ilk ipucunda belli olabilir) ya da bu kelimeler yalnızca 6. ipucunda.
- 6. ipucu tanının adını söylüyor.
- `differentialDiagnosis` içinde listede olmayan bir ad (tıbbi durumsa sorun değil) ya da id.
- `therapyId` / `pharmacologyId` aynı tanının mevcut vakalarından veya haritadan farklı.
