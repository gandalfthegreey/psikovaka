# Ajan G — Gözden Geçirme Listesi (DSM rehberi eksik tanı özetleri, 2. yarı)

Dosyalar: `tools/icerik/tani_ozetleri/G_*.json` (82 tanı). **Henüz `js/dsm_manual.js` içine birleştirilmedi.** Doğrulama: `node tools/icerik/tani_ozetleri/dogrula.js`.

## Genel sınırlar

- Tüm metinler el kitabına erişim olmadan, modelin bilgisinden **kendi cümlelerimle** yazıldı; DSM-5-TR metni birebir aktarılmadı. Ölçüt yapısı, eşikler, süreler ve belirleyiciler özetlendi. Öğrencilerin bu metinlere güvenmesinden önce sahibi (ya da danışman bir klinisyen) tarafından el kitabıyla karşılaştırılmalıdır.
- Epidemiyoloji cümlelerinde emin olmadığım sayılar bilinçli olarak sayısız genel ifadelerle yazıldı ("küçük bir bölüm", "önemli bir kısmı"); verilen sayılar yaklaşık ve kaynağa göre değişkendir.
- Madde ile ilgili girdilerde ortak ölçütler (11 maddelik kullanım bozukluğu listesi, madde kaynaklı bozukluk şablonu, uyarıcı entoksikasyon/yoksunluk ölçütleri) her varyantta yinelenir; şablondaki bir hata hepsine yansır.
- Bazı kimlikler DSM-5-TR'de ayrı tanı değildir (sentetik kannabinoid entoksikasyonu, metamfetamin/kokain psikozu, kokain/amfetamin ayrı tanıları, nekrofili, zoofili, koprofili, urofili, telefon skatolojisi, parsiyalizm, pasif-agresif kişilik, çocuklukta/ergenlikte başlayan ve katı-duygusuz davranım bozukluğu alt tipleri). Girdiler bunu açıkça belirtir; ölçüt bölümleri DSM'deki üst tanıya ya da belirleyiciye göre yazıldı.
- Z/T kodlu "klinik ilginin odağı olabilecek durumlar" ruhsal bozukluk değildir; girdilerde bu vurgulandı. Kodlar ve Türk hukukuna ilişkin bilgiler (TCK m. 280, 6284 sayılı Kanun, ALO 183, ŞÖNİM, ÇİM) ayrıca kontrol edilmelidir.
- Tedavi dozu verilmedi; tedavi yalnızca yaklaşım düzeyinde anıldı.

## Kontrol edilmesi gerekenler (53 girdi)

| id | Ad | Ne kontrol edilmeli |
|---|---|---|
| `gender_dysphoria_children` | Çocuklarda Cinsiyet Disforisi | Epidemiyolojide sayı verilmedi (veriler tartışmalı); çocukluk disforisinin ergenliğe sürme oranları bilerek sayısız bırakıldı. "Cinsiyet gelişimi farklılığı" belirleyicisinin DSM-5-TR'deki tam adı kontrol edilmeli. |
| `gender_dysphoria_adolescents_adults` | Ergen ve Erişkinlerde Cinsiyet Disforisi | "Geçiş sonrası" belirleyicisinin tanımı (tam zamanlı yaşam + en az bir tıbbi işlem) ve ergenlerde tıbbi müdahalelere ilişkin cümle güncel kılavuzlara göre gözden geçirilmeli; hassas konu. |
| `conduct_childhood` | Davranım Bozukluğu (Çocuklukta Başlayan Tip) | 15 ölçüt dört grup hâlinde özetlendi; "13 yaşından önce" (gece dışarıda kalma, okul kaçamağı) ve "en az iki kez evden kaçma" ayrıntıları ile şiddet belirleyicisi tanımları el kitabıyla karşılaştırılmalı. Yaygınlık (%2–10+, ortanca ~%4) kontrol edilmeli. |
| `conduct_callous_unemotional` | Davranım Bozukluğu (Sınırlı Prososyal Duygularla) | "En az 12 ay, en az 2/4 özellik, birden çok ilişki/ortam" eşiği ve "azınlıkta görülür" ifadesi kontrol edilmeli. |
| `alcohol_withdrawal` | Alkol Yoksunluğu | Ağır komplikasyonların (nöbet, deliryum) sıklığı sayısız ("küçük bir bölüm") bırakıldı; zaman seyri (ilk gün başlama, 2–3. gün zirve) kontrol edilmeli. |
| `alcohol_withdrawal_delirium` | Alkol Yoksunluğu Deliryumu | Başlangıç zamanı (son içkiden 2–3 gün sonra) ve tedavili/tedavisiz ölüm oranları bilerek sayısız yazıldı; kaynakla doğrulanıp istenirse sayı eklenmeli. Kriter yapısı (deliryum ölçütleri + yoksunlukla ilişki kanıtı) DSM-5-TR ile karşılaştırılmalı. |
| `alcohol_induced_mood` | Alkolün Yol Açtığı Depresif Bozukluk | Madde kaynaklı bozukluk şablonu (A–E) ve "yaklaşık 1 ay" süresi kontrol edilmeli. ID duygudurum diyor, içerik DSM-5-TR adına (depresif) göre yazıldı. |
| `alcohol_induced_anxiety` | Alkolün Yol Açtığı Anksiyete Bozukluğu | Madde kaynaklı bozukluk şablonu ile aynı; DSM-5-TR'deki özgül ifade kontrol edilmeli. |
| `cannabis_withdrawal` | Esrar Yoksunluğu | "Yaklaşık 1 hafta içinde en az 3/7" eşiği ve "birkaç ay günlük ya da neredeyse günlük kullanım" ifadesi kontrol edilmeli; yaygınlık sayısız. |
| `cannabis_induced_psychotic` | Esrarın Yol Açtığı Psikotik Bozukluk | Şizofreni/bipolar bozukluğa geçiş oranı bilerek sayısız yazıldı (kaynaklarda yaklaşık üçte bir–yarı arası verilir); doğrulanıp eklenebilir. |
| `synthetic_cannabinoid_intoxication` | Sentetik Kannabinoid Entoksikasyonu | DSM-5-TR'de ayrı tanı değildir; ölçütler tarafımdan klinik tabloya göre "diğer (ya da bilinmeyen) madde entoksikasyonu" mantığıyla düzenlendi, DSM metni değildir. Kodlama ve Türkiye'deki yaygınlık cümlesi kontrol edilmeli. |
| `opioid_use_disorder` | Opioid Kullanım Bozukluğu | Yaygınlık (~%0,4 yıllık, ABD verisi) ve Türkiye'ye ilişkin genel cümle kaynakla doğrulanmalı. "İdame tedavisi altında" belirleyicisinin tanımı kontrol edilmeli. |
| `opioid_withdrawal` | Opioid Yoksunluğu | Kısa etkili opioidlerde zaman seyri (saatler içinde başlama, 1–3 gün zirve, 5–7 gün) kontrol edilmeli. |
| `cocaine_use_disorder` | Kokain Kullanım Bozukluğu | DSM-5-TR'de ayrı tanı değil, "uyarıcı kullanım bozukluğu, kokain"; ölçütler ortak. Avrupa'daki artış cümlesi ve yaygınlık genel ifadeyle yazıldı. |
| `amphetamine_use_disorder` | Amfetamin Türü Madde Kullanım Bozukluğu | Türkiye'de metamfetamin başvurularındaki artış cümlesi (genel ifade) güncel EMCDDA/TUBİM raporlarıyla doğrulanmalı. |
| `methamphetamine_psychosis` | Metamfetaminin Yol Açtığı Psikotik Bozukluk | Kullanıcılarda psikoz sıklığı sayısız ("önemli bir kısmı") bırakıldı; DSM-5-TR'de ayrı tanı değil (uyarıcının yol açtığı psikotik bozukluk). |
| `cocaine_induced_psychosis` | Kokainin Yol Açtığı Psikotik Bozukluk | "Amfetamin psikozundan daha hızlı geriler" genellemesi kontrol edilmeli. |
| `sedative_withdrawal` | Sedatif/Benzodiazepin Yoksunluğu | Kısa/uzun yarı ömürlü ilaçlarda başlangıç zamanları genel ifadeyle yazıldı; yoksunluk ölçüt listesi alkolle aynı olduğu varsayıldı, kontrol edilmeli. |
| `phencyclidine_use_disorder` | Fensiklidin (PCP) Kullanım Bozukluğu | Ölçüt sayısı 10 (yoksunluk yok) olarak yazıldı. diagnoses.js'deki takma ad "F19.20"; DSM-5-TR ICD-10-CM kodlamasında PCP F16.x altında yer alır, kod kontrol edilmeli (veri dosyası, bu girdi değil). |
| `inhalant_use_disorder` | Uçucu Madde Kullanım Bozukluğu | Ergen yaygınlığı genel ifadeyle ("binde birkaç") yazıldı; nitrit/nitröz oksidin dışlanması kontrol edilmeli. |
| `tobacco_use_disorder` | Tütün Kullanım Bozukluğu | Türkiye'ye ilişkin cümle sayısız yazıldı (TÜİK verisiyle desteklenebilir). |
| `caffeine_withdrawal` | Kafein Yoksunluğu | Zaman seyri (12–24 saatte başlama, 1–2 günde zirve, 2–9 gün) DSM metniyle karşılaştırılmalı. |
| `delirium_hyperactive` | Deliryum (Hiperaktif Tip) | Alt tiplerin sıklık sıralaması (hipoaktif/karışık en sık) genel ifadeyle yazıldı; deliryum ölçütleri tek madde hâlinde özetlendi. |
| `delirium_hypoactive` | Deliryum (Hipoaktif Tip) | Daha yüksek ölüm oranı ile ilişki cümlesi literatürle kontrol edilmeli. |
| `mild_neurocognitive_alzheimer` | Hafif NBB (Alzheimer) | 65 yaş üstü MCI yaygınlığı (%10–20) ve "muhtemel yalnızca genetik kanıtla" kuralı kontrol edilmeli. Amiloid hedefli tedavi cümlesi güncelliği açısından gözden geçirilmeli. |
| `major_neurocognitive_vascular` | Majör Vasküler NBB | "Muhtemel / olası" koşulları özetlendi; DSM-5-TR'deki tam ifadeyle karşılaştırılmalı. |
| `major_neurocognitive_parkinson` | Majör NBB (Parkinson) | "Muhtemel / olası" koşulları ve Lewy cisimcikli demansla ayrımdaki "bir yıl kuralı" (DSM değil, klinik uzlaşı) kontrol edilmeli; demans gelişme oranı sayısız yazıldı. |
| `major_neurocognitive_tbi` | Majör NBB (TBH) | Kriter B'deki nörolojik bulgu örnekleri ve KTE'nin DSM'de ayrı tanı olmadığı notu kontrol edilmeli. |
| `major_neurocognitive_hiv` | Majör NBB (HIV) | HAND sınıflaması (Frascati) ve ART sonrası sıklık cümleleri sayısız; kontrol edilmeli. |
| `unspecified_neurocognitive` | Belirtilmemiş NBB | DSM-5-TR'de NBB için "belirlenmiş diğer" kategorisi olmadığı varsayıldı; kontrol edilmeli. |
| `schizotypal_pd_cluster` | Şizotipal Kişilik Bozukluğu (Küme A) | Mevcut "schizotypal_pd" girdisiyle aynı tanı (yinelenen kimlik). Bu girdi Küme A bağlamına ağırlık verdi; iki girdinin birleştirilmesi ya da birinin diğerine yönlendirilmesi düşünülmeli. Yaygınlık aralığı (%0,6–4,6) mevcut girdideki "%3–4" ile farklı; uyumlaştırılmalı. |
| `personality_change_due_to_medical` | Başka Bir Sağlık Durumuna Bağlı Kişilik Değişikliği | Kategori PERSONALITY_B olarak işaretli, oysa DSM-5-TR'de genel kişilik bozuklukları içinde ama kümelerin dışında yer alır. Çocuklarda "en az 1 yıl" koşulu kontrol edilmeli. |
| `passive_aggressive_pd` | Pasif-Agresif Kişilik Örüntüsü | DSM-5-TR'de resmî tanı değil; DSM-IV-TR ek bölüm (Ek B) öneri ölçütleri özetlendi. 7 madde ve "en az 4" eşiği kontrol edilmeli. Oyunda "tanı" olarak sunulması öğrencileri yanıltabilir. |
| `pedophilic_disorder` | Pedofilik Bozukluk | Erkeklerde "birkaç yüzde" en yüksek olası yaygınlık ifadesi ve Türk hukukuna ilişkin cümle (cezai sorumluluk) hukuki açıdan kontrol edilmeli. |
| `fetishistic_disorder` | Fetişizm Bozukluğu | "Tam düzelme" için denetimsiz ortamda en az 5 yıl koşulu (tüm parafilik bozukluklar için) kontrol edilmeli. |
| `transvestic_disorder` | Karşıgiyim Bozukluğu | Belirleyiciler (fetişizmle / otojinefiliyle) ve "tam düzelme 5 yıl" kontrol edilmeli; otojinefili ile ileri yaşta cinsiyet disforisi ilişkisine dair cümle tartışmalı bir literatüre dayanır. |
| `necrophilia` | Nekrofili | DSM-5-TR'de ayrı tanı değil; "belirlenmiş diğer parafilik bozukluk" örneği. Ortak şablondaki "en az 6 ay" süresi DSM-5-TR'deki örnek ifadesiyle karşılaştırılmalı (aynı not zoofili, koprofili, urofili, telefon skatolojisi için de geçerli). |
| `zoophilia` | Zoofili | Yukarıdaki nota bakınız; epidemiyoloji cümlesi (kırsal kesim anketleri) eski Kinsey verilerine dayanır. |
| `partialism` | Parsiyalizm | DSM-5'te fetişizm bozukluğuna dahil edildiği bilgisi kontrol edilmeli. |
| `medication_induced_parkinsonism` | Nöroleptiklerin Yol Açtığı Parkinsonizm | "Birkaç hafta içinde" başlangıç ve D2 doluluğu "%80'in üzerinde" eşiği kontrol edilmeli. |
| `borderline_intellectual_functioning` | Sınırda Zeka Düzeyi | diagnoses.js'deki ad "IQ 70-84" diyor; DSM-IV-TR aralığı 71–84 idi, DSM-5/5-TR sabit aralık vermez. Girdi bunu açıklıyor ama veri dosyasındaki ad/takma ad düzeltilebilir. Toplumdaki oran (%10–15) normal dağılımdan hesaplanmış yaklaşık değerdir. |
| `academic_or_educational_problem` | Eğitim veya Akademik Sorun | DSM-5-TR'deki Z55 alt kodlarının listesi bellekten özetlendi; kontrol edilmeli. |
| `nonadherence_to_medical_treatment` | Tıbbi Tedaviye Uyumsuzluk | DSM-5-TR'de uyumsuzluk türüne göre ayrı ICD-10-CM kodları olduğu bilgisi ve diagnoses.js'deki Z91.19 kodu kontrol edilmeli. |
| `religious_or_spiritual_problem` | Dini veya Ruhsal Problem | diagnoses.js'deki takma ad Z71.8; DSM-5'te bu kategorinin ICD-10-CM kodu Z65.8'dir. Kod kontrol edilmeli (veri dosyası). |
| `child_physical_abuse` | Çocuk Fiziksel İstismarı | T74/T76 kod ekleri ve TCK m. 280 bildirim yükümlülüğü cümlesi (çocuk istismarı girdilerinin üçünde ortak) hukuken kontrol edilmeli. "Makul fiziksel disiplin" dışlaması hassas; bilinçli olarak çocuk hakları notu eklendi. |
| `spouse_physical_violence` | Eş/Partner Fiziksel Şiddeti | 6284 sayılı Kanun, ALO 183, ŞÖNİM bilgileri ve "son bir yıl" koşulu kontrol edilmeli. |
| `homelessness` | Evsizlik | DSM-5-TR'de korunaklı/korunaksız evsizlik için ayrı kodlar (Z59.01/Z59.02) olduğu varsayıldı; diagnoses.js'deki Z59.0 eski kod olabilir. |
| `acculturation_difficulty` | Kültürleşme Güçlüğü | Türkiye'nin mülteci sayısına dair genel cümle güncellik açısından kontrol edilmeli. |
| `other_specified_anxiety` | Belirlenmiş Diğer Anksiyete Bozukluğu | DSM-5-TR örnek listesi (4 madde) bellekten; kontrol edilmeli. |
| `other_specified_ocd` | Belirlenmiş Diğer OKB ve İlişkili Bozukluk | Örnek listesi ve jikoshu-kyofu'nun DSM-5-TR'deki yeri (koku alma referans bozukluğu ile ilişkisi) kontrol edilmeli. |
| `other_specified_trauma` | Belirlenmiş Diğer Travma ve Stresörle İlişkili Bozukluk | diagnoses.js'deki "Süregen Karmaşık Yas" takma adı DSM-5-TR'de geçersiz (uzamış yas bozukluğu ayrı tanı oldu); takma ad güncellenmeli. Örnek listesi kontrol edilmeli. |
| `other_specified_somatic` | Belirlenmiş Diğer Bedensel Belirti Bozukluğu | Örnek listesi (4 madde) kontrol edilmeli. Not: mevcut "pseudocyesis" girdisiyle kısmen örtüşür. |
| `other_specified_feeding` | Belirlenmiş Diğer Beslenme ve Yeme Bozukluğu | Örnek listesi (5 madde) ve eşikler (haftada birden az / 3 aydan kısa) kontrol edilmeli; mevcut night_eating_syndrome girdisiyle örtüşür. |

Listede olmayan girdiler de genel sınırlar kapsamında el kitabıyla bir kez karşılaştırılmalıdır.
