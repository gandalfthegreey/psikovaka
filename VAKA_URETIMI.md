# PsikoVaka — Yeni vaka üretimi (Gemini için yönerge)

Bu dosya kendi başına yeterlidir: önceki konuşmaları bilmen gerekmez. Emre yeni vaka istediğinde bu adımları
**sırayla ve eksiksiz** uygula. Emre geliştirici değildir; ona teknik soru sorma, kararları kendin ver.

## Emre'nin Gemini'ye yapıştıracağı komut

```
PsikoVaka için yeni klinik vakalar yazmanı istiyorum.
Proje klasöründeki VAKA_URETIMI.md dosyasını baştan sona oku ve adımlarını sırayla, eksiksiz uygula.
Bana yalnızca bir kez kaç vaka yazacağını (istersem alan ve zorluk da söyleyebilirim) sor; başka hiçbir şey sorma, diğer kararları kendin ver.
Vakaları yaz, doğrula, oyuna ekle ve yayınla; bitince bana kısa bir rapor ver.
```

## Bilmen gerekenler (kısa)
- Oyun: oyuncu hasta başlığını (`patientSummary`) ve ipuçlarını tek tek görüp DSM-5-TR tanısını tahmin eder; sonra terapi ve
  ilaç aşamaları, mini soru ve "neden bu tanı" açıklaması gelir. Tanı **birebir `diagnosisId` eşleşmesiyle** doğru sayılır.
- Vakalar `js/cases.js` içindedir. Bu dosyayı **elle düzenleme**: yeni vakaları bir JSON dosyasına yazarsın,
  `tools/vaka_ekle/ekle.js` ekler. Alanların tam açıklaması: `tools/vaka_ekle/SABLON_ACIKLAMA.md`; eksiksiz örnek:
  `tools/vaka_ekle/sablon.json`.
- Komutları proje kökünde (bu dosyanın bulunduğu klasör) çalıştır. Hepsi yalnızca Node kullanır; Windows'ta PowerShell ya da
  cmd fark etmez. Yollarda `/` kullanabilirsin.

## Adımlar

### 1. Okuma ve kilit
1. `GEMINI.md` ve `AI_ISBIRLIGI.md` dosyalarını baştan sona oku (kurallar + "Şu An Üzerinde Çalışılanlar" tablosu).
2. Tabloda **başka bir asistanın satırı varsa DUR**: Emre'ye "Şu an <asistan> projede çalışıyor (<görev>); o bitince yeni vakaları
   yazabilirim." de ve başka hiçbir şey yapma.
3. Tablo boşsa kendi satırını ekle (tablonun başlık ve `|---|` satırının hemen altına, tek satır):
   `| Gemini | Yeni vakalar (<n>) | js/cases.js, PsikoVaka_Tam_Surum.html, supabase/seed/0002_cases_answer_key.sql, tools/vaka_ekle/taslaklar/, AI_ISBIRLIGI.md | <YYYY-AA-GG> |`
   (`<n>`'yi 2. adımdan sonra yazabilirsin.)

### 2. Emre'ye TEK soru
Tek bir mesaj gönder, örneğin:
> Kaç yeni vaka yazayım? İstersen bir alan (Yetişkin, Çocuk-Ergen, Adli & Kişilik, Nörobilişsel & Somatik, Dürtü Denetimi,
> Bağımlılık) ve zorluk (Kolay, Orta, Zor, İleri Düzey) da söyleyebilirsin; söylemezsen karışık yazar, en az vakası olan tanıları doldururum.

Cevaptan sonra **başka soru sorma**. Sayı belirsizse 5 kabul et; 20'den fazla istenirse 20'şerlik partiler hâlinde, her parti
için 3-6. adımları tekrarla. Alan/zorluk söylenmediyse: karışık alanlar, zorluk dağılımı yaklaşık %20 Kolay, %45 Orta, %30 Zor,
%5 İleri Düzey.

### 3. Tanı seçimi
1. `node tools/vaka_ekle/durum.js` çalıştır (alan istendiyse `--alan <ADULT|CHILD|FORENSIC|NEURO_SOMATIC|IMPULSE|SUBSTANCE>`,
   zorluk istendiyse `--zorluk <Kolay|Orta|Zor|İleri Düzey>` ekle). Çıktıda izinli değerler ve tanı kapsama tablosu var
   (vakası 0 ya da 1 olan tanılar en üstte).
2. Seçim kuralları:
   - Önce **vakası olmayan**, sonra 1 vakası olan tanılar. Kategorilere yay (aynı partide bir kategoriden en çok 2-3 vaka).
   - Bir tanıya bir partide **en çok 2** yeni vaka (Emre özellikle istemediyse). 3+ vakası olan tanıyı seçme.
   - Tabloda "ÖNERİLMEZ" yazanları (belirlenmiş diğer / belirtilmemiş) seçme: oyunda tek doğru cevap olamazlar.
   - "YALNIZCA EMRE İSTERSE" yazanları (cinsiyet disforisi, pedofili) Emre açıkça istemedikçe seçme.
   - Komşusu çok olan tanılarda (ör. hafif/majör nörobilişsel, madde kaynaklı / tıbbi duruma bağlı / birincil) vakanın
     ipuçları komşuları açıkça ayırmalı; ayıramayacaksan o tanıyı seçme.
3. Seçtiğin her tanı için `node tools/vaka_ekle/durum.js --tani <diagnosisId>` çalıştır: DSM ölçütleri (`DSM5_MANUAL`),
   epidemiyoloji, yasak adlar (ad + takma adlar), aynı tanının mevcut vakaları ve terapi/ilaç eşlemesi görünür.
4. Üslubu görmek için 2-3 mevcut vakayı oku: `node tools/vaka_ekle/durum.js --ornek case-080` (ayrıca `case-012`, `case-101`)
   ve `tools/vaka_ekle/sablon.json`.

### 4. Her vakayı yaz
- **Ölçütleri gerçekten karşıla:** süre (ör. majör depresif epizod ≥2 hafta, yaygın anksiyete ≥6 ay, TSSB >1 ay, şizofreni ≥6 ay,
  şizofreniform 1-6 ay, kısa psikotik <1 ay), belirti sayısı (ör. "5/9"), dışlama ölçütleri (madde, tıbbi durum, başka bozukluk)
  ve işlev kaybı ipuçlarında açıkça bulunsun. Ölçüt "tıbbi durum/madde ile açıklanamaz" diyorsa ilgili tetkiki/öyküyü yaz.
- **İpucu sırası (dsmdle.com zorluk standardı — ilk ipucundan tanı asla ele verilmemeli):**
  - **1. İpucu (Geniş ve çok anlamlı başvuru):** En az **4–5 farklı tanıya** uyabilecek, özgül olmayan bir başvuru yakınması yaz (ör. genel yorgunluk, iş/okul performansında düşüş, uyku düzensizliği, yakınların getirmesi, belirsiz huzursuzluk veya bedensel gerginlik). Tanının patognomonik belirtisini, tipik ritüelini/fobisini veya ayırt edici süre eşiğini **ASLA 1. ipucunda verme**.
  - **2. İpucu (Hâlâ en az 2–3 ayırıcı tanıya açık):** Başlangıç bağlamı, işlevsellik etkisi veya genel seyir; ancak benzer tanılar (ör. depresyon vs. yas vs. bipolar depresyon; OKB vs. YAB vs. paranoid) hâlâ olası kalmalı.
  - **3–4. İpuçları (Daraltma ve tıbbi/madde dışlama):** Kategori netleşmeye başlar; tetkikler, madde/ilaç öyküsü ve ana ayırıcı tanıları eleyen bulgular gelir.
  - **5. İpucu (`Ruhsal Durum Muayenesinde: ...`):** Klinik gözlem, duygulanım, düşünce süreci/içeriği ve içgörü bulguları.
  - **6. İpucu (Belirleyici ayrıntı):** Tanıyı kesinleştiren ayırt edici kriter (yine tanının adını söylemeden).
- **Yasak:** başlıkta ve 1-5. ipuçlarında tanının Türkçe/İngilizce adı, takma adları (`durum.js --tani` listeler), DSM kategori adı,
  alan adı; başlıkta parantezli etiket (yalnızca `(BKİ: ...)` gibi nötr ölçü serbest). 6. ipucunda da tanının adını söyleme;
  belirleyici bulguyu ver. Metinlerde `<` işaretinden hemen sonra harf yazma.
- **Gerçekçilik:** Türkçe klinik dil, Türkiye'de inandırıcı ortam (aile hekimi, poliklinik, okul rehberlik servisi, acil, adli
  bilirkişi vb.), farklı yaş/cinsiyet/meslek/şehir. Gerçek kişi, ünlü, marka ya da tanınabilir olay yok. Damgalayıcı dil yok
  ("deli", "sapık" gibi); kişiyi tanıyla değil, "danışan/hasta" diye an. Her vakada farklı cümle kalıpları kullan.
- **Diğer alanlar** (biçim için `SABLON_ACIKLAMA.md`):
  `symptomHighlights` (1-4; `text` ipucundan birebir kopya), `treatmentModality`, `differentialDiagnosis` (1-3 satır, listedeki
  Türkçe adlarla), `dsmCriteriaSummary`, `miniQuiz` (4 farklı seçenek; doğru cevabın yerini vakadan vakaya değiştir: 0-3),
  `explanation` (whyThis 2-4, whyNot 2-3 gerçekten karışabilecek tanı, teachingPoint; toplam 40-200 kelime).
- **therapyId / pharmacologyId:** `durum.js --tani` çıktısındaki "mevcut vakalarda" / "goldForDiagnoses" / "harita" değerlerini
  kullan. Klinik olarak gerekçen varsa farklısını seçebilirsin (uyarı verir); `pharmacologyId`'yi boş bırakırsan harita seçer.
- **Öz denetim:** Yazdıktan sonra her ölçütü tek tek ipuçlarında bul. İpuçları başka bir tanıya da aynı ölçüde uyuyorsa
  (özellikle `whyNot`'a yazdıkların), ayırt edici bulgu ekle ya da vakayı değiştir. `id` ve `caseNumber` yazma.

### 5. Dosya, doğrulama, ekleme
1. Partiyi tek dosyaya yaz: `tools/vaka_ekle/taslaklar/<YYYY-AA-GG>_<n>.json` (ör. `2026-11-21_5.json`; dosya varsa sonuna `_b`
   ekle). İçerik bir JSON dizisidir: `[ {...}, {...} ]`. Dosyayı UTF-8 kaydet.
2. `node tools/vaka_ekle/dogrula.js tools/vaka_ekle/taslaklar/<dosya>.json`
   - **HATA** satırlarının hepsini düzelt ve tekrar çalıştır; hata kalmayana kadar sürdür. Bir vaka 3 denemede düzelmiyorsa onu
     partiden çıkar (raporda belirt). Kuralı aşmak için içeriği bozma (ör. sızıntıyı gidermek için adı başka sözcükle anlatmak doğru;
     belirtiyi silmek yanlış).
   - **uyarı** satırlarını oku; mantıklıysa düzelt (ipucu uzunluğu, 1. ipucunun fazla belirleyici olması, 6. ipucunda tanı adı).
3. `node tools/vaka_ekle/ekle.js tools/vaka_ekle/taslaklar/<dosya>.json`
   Bu komut yeniden doğrular, `case-151`'den itibaren numara verir, `js/cases.js`'i yedekleyip yazar, tüm proje doğrulayıcılarını
   ve derlemeyi çalıştırır. Son satır `✅ N vaka eklendi: ...` olmalı. Önce görmek istersen sonuna `--kuru` ekle (hiçbir şey yazmaz).

### 6. Günlük ve yayın
1. `AI_ISBIRLIGI.md` → "Değişiklik Günlüğü (en yeni en üstte)" başlığının hemen altına, mevcut kayıtların ÜSTÜNE ekle:
   ```
   ### YYYY-AA-GG SS:DD — Gemini — Yeni vakalar: <n> vaka (<ilk id> – <son id>)
   - **Dosyalar:** js/cases.js, PsikoVaka_Tam_Surum.html, supabase/seed/0002_cases_answer_key.sql, tools/vaka_ekle/taslaklar/<dosya>.json
   - **Ne değişti:** <id: diagnosisId (alan, zorluk)> listesi
   - **Neden:** Emre'nin isteği (<n> vaka<, alan/zorluk>); az vakalı tanılar dolduruldu.
   - **Doğrulama:** tools/vaka_ekle/dogrula.js hata 0 (uyarı <k>), ekle.js + derleme 0 hata; yayın: <sonuç>
   - **Açık kalan / dikkat:** İçerik yapay zekâ tarafından yazıldı; Emre/uzman gözden geçirmeli. <partiden çıkarılan vaka varsa>
   ```
   Eski kayıtları değiştirme. Sonra tablodaki **kendi satırını sil**.
2. `node tools/vaka_ekle/yayinla.js --mesaj "Yeni vakalar: <n> vaka (<ilk id> - <son id>)"`
   Mesajda yalnızca harf, rakam, boşluk ve `: - ( ) ,` kullan (`"`, `$`, `%` yok). Komut hiçbir şey sormaz; birkaç dakika sürebilir.
   Son satır `✅ YAYINLANDI.` olmalı. Çıktıda "vaka dışı değişen dosya" listesi varsa, raporda tek satırla belirt.
   Yayın başarısızsa günlük kaydının "Doğrulama" satırına `yayın: BAŞARISIZ — <neden>` yaz.

### 7. Emre'ye rapor (birkaç satır)
- Kaç vaka eklendi, hangi tanılar (Türkçe adlarıyla), id aralığı (ör. case-151 – case-155).
- Yayın sonucu; site: https://gandalfthegreey.github.io/psikovaka/ (1-2 dakikada yenilenir);
  GitHub Actions: https://github.com/gandalfthegreey/psikovaka/actions (yeşil tik = sunucu cevap anahtarı güncellendi).
- Oyunda vaka paketleri arasındaki "Yeni Vakalar" paketinde (No. 151 ve üstü) ve "Tüm Vakalar"da görünür.
- "Vakaları yapay zekâ yazdı; klinik doğruluğu makine denetleyemez. Lütfen birkaçını açıp kontrol et."

## Yapma
- `js/cases.js`'i elle düzenleme; **mevcut vakaları değiştirme, silme, yeniden numaralandırma**.
- `js/diagnoses.js`, `js/dsm_manual.js`, `js/therapies.js`, `js/pharmacology.js`, `index.html`, `css/`, `js/` altındaki kod
  dosyalarına ve `tools/vaka_ekle/` betiklerine dokunma. Değiştirdiğin tek dosyalar: taslak JSON'un ve `AI_ISBIRLIGI.md`
  (diğerlerini `ekle.js`/`yayinla.js` üretir).
- `tools/icerik/tani_temizligi/uygula.js` ÇALIŞTIRMA (eski yedekten kurar, veriyi bozar).
- `git push --force`, `git reset`, `git rebase`, `git merge`, `git checkout -- …`, `git stash` kullanma; commit/push'u yalnızca
  `yayinla.js` yapar. Hiçbir dosyayı silme (gerekirse `_arsiv/` altına taşı).
- Hiçbir yere şifre, token, `SUPABASE_DB_URL`, `supabase/tests/.test-credentials.json` içeriği yazma.
- Doğrulayıcının hatasını "geçmek" için kuralı ya da betiği değiştirme.

## Sorun çıkarsa
| Durum | Ne yap |
|---|---|
| `dogrula.js` HATA veriyor | Mesaj hangi vakada, hangi alanda, ne yanlış olduğunu Türkçe söyler. Düzelt, tekrar çalıştır. `KOPYA` → farklı hasta/öykü yaz. `SIZINTI` → o adı ipucundan çıkar, bulguyu tarif et. |
| JSON okunamıyor | Sonda virgül, yorum, kaçışsız `"` ya da dizi yerine nesne. Dosyayı düzelt. |
| `ekle.js` "başka biri tarafından değiştirildi" | Başka bir asistan dosyada çalışıyor olabilir: `AI_ISBIRLIGI.md` tablosuna bak; satır varsa DUR ve Emre'ye söyle; yoksa bir kez daha çalıştır. |
| `ekle.js` derleme/doğrulayıcı hatası ("GERİ YÜKLENDİ") | Vakalar eklenmedi, `js/cases.js` eski hâlinde. Hata yeni vakadaysa düzelt ve tekrar dene; vaka dışı bir dosyadaysa (ör. `index.html`) DUR, Emre'ye hatanın son satırlarını ilet. |
| `yayinla.js`: "çalışma tablosunda başka bir asistanın satırı var" | Yayınlama. Vakalar eklendi ve yerelde duruyor. Emre'ye: "Vakalar eklendi ama <asistan> çalıştığı için yayınlamadım; o bitince `GITHUBA_YUKLE.bat`'a çift tıklaman yeterli." |
| "GitHub'daki depoda bu bilgisayarda olmayan yeni değişiklikler var" | Bir kez `git pull --ff-only origin main` çalıştır. Başarılıysa `yayinla.js`'i tekrar çalıştır. Hata verirse (çakışma, "Not possible to fast-forward", yerel değişiklik uyarısı) başka hiçbir git komutu deneme; Emre'ye mesajı ilet ve Claude'a sormasını söyle. |
| "GitHub girişi / yetkisi reddedildi ya da giriş bilgisi sorulması gerekti" | Emre `GITHUBA_YUKLE.bat`'a çift tıklayıp açılan GitHub penceresinde giriş yapsın; bu işlem vakaları da yayınlar. Sen tekrar deneme. |
| "GitHub'a ulaşılamadı" / 5 dakikada yanıt yok | İnternet sorunu. 1 kez daha dene; yine olmazsa Emre'ye "internet gelince `GITHUBA_YUKLE.bat`" de. Commit yerelde kalmışsa sonraki yayın onu da gönderir. |
| `yayinla.js` doğrulayıcıda duruyor | Hata yeni vakalardaysa (id ≥ 151) düzelt: taslak JSON'u düzeltmek yetmez, çünkü vaka eklendi. Bu durumda DUR ve Emre'ye söyle (mevcut vakaları elle düzenleme). Hata eski vakalardaysa başka biri bozmuştur: DUR, Emre'ye söyle. |
| GitHub Actions kırmızı (Emre ya da tarayıcın görürse) | Site yine güncellenir ama çevrim içi maçlar yeni vakaları sunucuda henüz tanımayabilir. Emre'ye bildir; Claude'un bakması gerekir. Tekrar yayınlamayı deneme. |

## Kalite kontrol listesi (her vaka için işaretle)
- [ ] `diagnosisId` kapsama tablosunda az vakalı, "ÖNERİLMEZ" değil; bu partide aynı tanıdan en çok 2 vaka.
- [ ] DSM ölçütleri (süre, sayı, dışlama, işlev kaybı) ipuçlarında tek tek bulunuyor.
- [ ] 1. ipucu geniş; 2-5 özgülleşiyor ve `whyNot`'taki tanıları dışlıyor; 6 belirleyici, tanı adını söylemiyor.
- [ ] Başlık "NN yaşında, cinsiyet, meslek"; başlıkta ve 1-5. ipuçlarında tanı/takma ad/kategori/alan adı yok.
- [ ] Demografi, ortam ve dil bu partideki diğer vakalardan ve mevcut vakalardan farklı; gerçek kişi yok; damgalayıcı dil yok.
- [ ] `symptomHighlights.text` ipucundan birebir kopya; `dsmMatch` "Kriter X: ..." biçiminde.
- [ ] `miniQuiz`: 4 makul seçenek, tek doğru, doğru cevabın yeri değişiyor; açıklama neden doğru olduğunu söylüyor.
- [ ] `explanation`: whyThis ölçütleri bulgulara bağlıyor; whyNot gerçekten karışabilecek 2-3 tanı; teachingPoint tek net ders.
- [ ] `therapyId`/`pharmacologyId` aynı tanının mevcut vakaları/haritasıyla tutarlı (farklıysa gerekçen var).
- [ ] `dogrula.js` hata 0; uyarılar okundu.
