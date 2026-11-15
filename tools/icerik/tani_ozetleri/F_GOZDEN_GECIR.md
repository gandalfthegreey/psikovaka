# F_ tanı özetleri — gözden geçirme listesi (Claude ajan F, 2026-11-15)

## Genel sınırlar (önce bunu okuyun)
- 82 girdinin tümü DSM-5-TR kitabına erişim olmadan, modelin bilgisinden yazıldı. Ölçütler kendi cümlelerimle özetlendi; kitapla satır satır karşılaştırılmadı.
- Yaygınlık oranları yuvarlanmış genel değerlerdir; kaynak gösterilmedi. Sınava ya da derse girmeden önce sahibi (Emre) tarafından kontrol edilmeli.
- Tanı kodları (F.., G..) girdilerin metnine bilerek yazılmadı. `js/diagnoses.js` içindeki `aliases` alanlarındaki bazı kodlar ICD-10 ya da ICD-10-CM'den geliyor ve DSM-5-TR koduyla aynı olmayabilir (aşağıda belirtildi). O dosyaya dokunulmadı.
- Birkaç girdi DSM-5-TR'de ayrı bir tanı değil (kültürel kavram, "belirlenmiş diğer" örneği, ICD-11 tanısı ya da DSM dışı uzlaşı tanımı). Metinde bu açıkça yazıldı; oyunda "DSM tanısı" gibi sunulup sunulmayacağına karar verilmeli.

## Girdi bazında kontrol edilecekler

| id | Ad | Kontrol edilecek |
|---|---|---|
| intellectual_disability_mild / _moderate / _severe / _profound | Zihinsel Yetiyitimi (düzeyler) | Düzey oranları (~%85 / %10 / %3-4 / %1-2) geleneksel tahmin; ağır düzey için "binde 6" rakamı. IQ aralıkları ICD-10 karşılığı olarak verildi, DSM düzeyi uyumsal işleve göre. |
| global_developmental_delay | Küresel Gelişimsel Gecikme | %1-3 yaygınlık oranı. |
| language_disorder | Dil Bozukluğu | Okula başlarken ~%7 oranı. Alias kodu F80.9 (belirtilmemiş); DSM-5'te dil bozukluğu kodu F80.2 olmalı. |
| speech_sound_disorder | Konuşma Sesi Bozukluğu | "4 yaşına kadar büyük ölçüde anlaşılır konuşma" ifadesi. |
| social_communication_disorder | Toplumsal (Pragmatik) İletişim Bozukluğu | Alias kodu F80.89; DSM-5-TR'de F80.82 olarak güncellenmiş olabilir. |
| unspecified_communication_disorder | Belirtilmemiş İletişim Bozukluğu | "DSM-5'te iletişim bozuklukları için 'belirlenmiş diğer' kategorisi yok" ifadesi. |
| specific_learning_dysgraphia | ÖÖB Yazılı Anlatım | Disgrafi = el yazısı ayrımı (DSM'de motor yazı güçlüğü GKB'ye ait) doğru mu; %5-15 oranı. |
| specific_learning_dyscalculia | ÖÖB Matematik | Matematik alanı için %3-7 oranı; Turner sendromu örneği. |
| stereotypic_movement_disorder | Stereotipik Hareket Bozukluğu | Şiddet düzeylerinin tanımı; "ilk 3 yıl" başlangıç. |
| chronic_motor_vocal_tic / provisional_tic_disorder | Tik bozuklukları | Başlangıç yaşı 4-6, en yoğun dönem 10-12 yaş. |
| other_specified_neurodevelopmental | Belirlenmiş Diğer Nörogelişimsel (FAS) | ND-PAE önerilen ölçüt maddeleri (özellikle uyumsal işlevde "en az iki alan, biri iletişim ya da toplumsal"); FASD %1-5 oranı. |
| delusional_grandiose | Sanrılı Bozukluk, Büyüklük Tipi | "Kötülük görme ve kıskançlık tiplerinden seyrek" sıralaması. |
| attenuated_psychosis_syndrome | Hafifletilmiş Psikoz Sendromu | DSM-5-TR'de resmi tanı değil (Bölüm III). Önerilen ölçütlerin harf sırası (A-F) ve psikoza geçiş oranı (2-3 yılda ~%20-30). |
| bipolar_1_depressed | Bipolar I, Şu Anki Epizod Depresif | "Kriter 1" etiketi bizim yapımız, DSM harflendirmesi değil. |
| bipolar_1_mixed | Bipolar I, Karışık Özellikli | Alias kodu F31.6 ICD-10 "karışık epizod" kodu; DSM-5'te kod şu anki epizoda göre verilir. |
| bipolar_due_to_medical | Sağlık Durumuna Bağlı Bipolar | Belirleyici adlarının çevirisi. |
| other_specified_bipolar | Belirlenmiş Diğer Bipolar | 4 örnek yazıldı. DSM-5-TR'nin 5. bir örnek ekleyip eklemediğini (şizofreni spektrumu üzerine binen manik epizod) kontrol edin. |
| mdd_recurrent | MDB, Yineleyici | %50 / %70 / %80-90 yineleme oranları (klasik ders kitabı rakamları). |
| mdd_with_psychotic | Psikotik Özellikli MDB | Psikotik özellik belirleyicisinin şiddetten bağımsız kodlanması (DSM-5 kodlama kuralı). |
| recurrent_brief_depression | Yineleyen Kısa Depresyon | "Belirlenmiş diğer depresif bozukluk" örneği; alias F38.1 ICD-10 kodu (DSM-5-TR: F32.89). Yaygınlık "birkaç yüzde" belirsiz bırakıldı. |
| short_duration_depressive | Kısa Süreli Depresif Epizod | Süre sınırı "en az 4 gün, 14 günden kısa" ifadesinin kitapla birebir uyumu. |
| specific_phobia_phagophobia | Özgül Fobi, Fagofobi | DSM'de ayrı alt tip değil, "diğer" tip içinde. ARFID ilişkisi. |
| ataque_de_nervios | Ataque de Nervios | DSM tanısı değil (Kültürel Sıkıntı Kavramları). İlişkili DSM tanıları listesi. |
| taijin_kyofusho | Taijin Kyofusho | DSM tanısı değil; DSM-5 sosyal kaygı ölçütündeki "başkalarını rahatsız etme" ifadesi. |
| ocd_contamination / ocd_checking / ocd_symmetry | OKB belirti boyutları | DSM'de alt tip değil, belirti boyutu; boyutlara ilişkin cinsiyet/başlangıç bilgileri genel literatürden. |
| body_focused_repetitive | Beden Odaklı Yineleyici Davranış Bozukluğu | "Belirlenmiş diğer OKİB" örneği; ComB modeli adı. |
| ptsd_dissociative | TSSB, Dissosiyatif | Başlık ve alias "C-PTSD" yanıltıcı: Karmaşık TSSB ICD-11 tanısı, DSM'deki dissosiyatif alt tip değil (metinde belirtildi). Ad değiştirilmesi düşünülmeli. %15-30 oranı. Alias F43.12 kronik TSSB kodu; DSM-5-TR TSSB kodu F43.10. |
| ptsd_preschool | 6 Yaş ve Altı TSSB | C ölçütü madde listesi (6 madde) ve "yalnızca elektronik medya" dışlaması. |
| adjustment_disorder_depressed / _anxious | Uyum Bozukluğu | %5-20 ayaktan başvuru oranı; D ölçütündeki "uzamış yas bozukluğu" eklemesi DSM-5-TR'ye özgü. |
| dissociative_trance | Dissosiyatif Trans | DSM-5-TR'de ayrı tanı değil (belirlenmiş diğer dissosiyatif bozukluk örneği); ICD-11'de "Trans bozukluğu" ayrı tanı. |
| possession_trance | Ele Geçirilme Transı | DSM-5-TR'de ayrı tanı değil; DİB ölçütlerindeki "ele geçirilme" ifadesi. Kültürel hassasiyet açısından metni okuyun. |
| coercive_persuasion_dissociation | Zorlayıcı İkna Sonrası Kimlik Bozulması | Belirlenmiş diğer dissosiyatif bozukluk örneği; örnek listesi. |
| conversion_motor / conversion_sensory | Konversiyon (İşlevsel Nörolojik Belirti) | conversion_sensory başlığında "Afoni" var; DSM-5'te ses/konuşma belirtisi duyusal değil "konuşma belirtisiyle" motor alt türde (F44.4). Ad düzeltilmesi düşünülmeli. |
| psychological_factors_affecting_medical | Sağlık Durumunu Etkileyen Ruhsal Etkenler | Şiddet düzeyi örnekleri. |
| anorexia_restricting / anorexia_binge_purge | Anoreksiya Nervoza alt tipleri | %0.4 12 aylık oran; ~10/1 kadın/erkek oranı; BKİ şiddet eşikleri. |
| atypical_anorexia / purging_disorder | BDOYB örnekleri | DSM'nin sayısal kilo kaybı/sıklık eşiği vermediği ifadesi. |
| enuresis / enuresis_diurna | Enürezis | %5-10 / %3-5 / %1 oranları; gündüz tipi için "9 yaşından sonra nadir". |
| narcolepsy_without_cataplexy | Narkolepsi, Katapleksisiz | DSM-5 alt tipi "katapleksisiz ama hipokretin eksikliğiyle" ile ICSD-3 Tip 2 ayrımı; hipokretin eşiği (≤ 110 pg/mL ya da üçte bir); MSLT eşikleri; yaygınlık on binde 2-5. |
| obstructive_sleep_apnea | Tıkayıcı Uyku Apnesi | AHİ eşikleri (5 + belirti / 15) ve şiddet sınırları; yaş gruplarına göre oranlar. |
| central_sleep_apnea | Santral Uyku Apnesi | Başlıkta Cheyne-Stokes yazıyor ama bu yalnızca bir alt tip; alt tip adları. |
| sleep_related_hypoventilation | Uykuda Hipoventilasyon | Alt tip adları; PHOX2B. |
| circadian_delayed_sleep / _advanced_sleep / _shift_work / _non_24_hour | Sirkadiyen ritim alt tipleri | Ortak A-C ölçütleri; vardiya tanımındaki 08.00-18.00 aralığı; körlerde 24 saate uymayan tip oranı (~yarısı); CRY1/PER2 gen örnekleri. |
| delayed_ejaculation / male_hypoactive_desire / female_orgasmic_disorder | Cinsel işlev bozuklukları | %75-100 ve ~6 ay eşikleri; yaygınlık rakamı bilerek verilmedi. |
| female_sexual_interest_arousal | Kadında Cinsel İlgi/Uyarılma | 6 maddeden en az 3; aseksüel kimlik dışlaması (DSM metnindeki not). |
| persistent_genital_arousal | PGAD | DSM-5-TR tanısı değil; ISSWSH uzlaşı tanımı (PGAD/GPD). Uzlaşıdaki süre ölçütü (≥ 3 ay olabilir) bilerek yazılmadı, kontrol edin. Kodlama önerisi ("belirlenmiş diğer"). |
