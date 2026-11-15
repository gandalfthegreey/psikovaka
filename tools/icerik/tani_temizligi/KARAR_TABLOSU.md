# Tanı Listesi Temizliği — Karar Tablosu (2026-11-15, Claude ajan J)

**Kural (Emre kararı, 2026-11-15):** "Tanı olan kalır, tanı olmayan çıkar." Tahmin listesinde yalnızca resmî DSM-5-TR Bölüm II ruhsal bozukluk tanıları bulunur: resmî "belirlenmiş diğer" / "belirtilmemiş" kategoriler ve ayrı kodlanan görünümler (ör. zihinsel yetiyitimi düzeyleri, maddeye özgü kullanım/zehirlenme/yoksunluk, ayrı kodlu alt tipler) dahil. Çıkanlar: kültürel sıkıntı kavramları, Bölüm III önerileri, yalnızca belirleyici/örnek/belirti boyutu olanlar, DSM dışı kavramlar, yinelenen girdiler, Z/T/R kodlu "klinik ilginin odağı olabilecek diğer durumlar" ve (aynı gerekçeyle: kitapta var ama ruhsal bozukluk değil) ilaca bağlı hareket bozuklukları.

Bu tablo `uygula.js` tarafından `karar.js` ve `yeni_tanilar.js` verisinden üretilir; elle düzenlemeyin, kararı `karar.js` içinde değiştirip betiği yeniden çalıştırın.

## Özet

- Önce: 297 tanı, 22 kategori, 133 rehber girdisi (+ 164 birleştirilmemiş özet), 150 vaka.
- Sonra: 207 tanı, 21 kategori, 207 rehber girdisi, 138 aktif vaka, 12 arşivlenen vaka.
- Kaldırılan: 96 (BELIRLEYICI: 28, ORNEK: 16, KULTUREL: 2, BOLUM3: 2, DSM_DISI: 15, YINELEME: 7, Z_KODU: 20, ILAC: 6). Eklenen: 6. Düzeltilen: 57.
- Boşalan ve kaldırılan kategori: OTHER_CLINICAL (Klinik İlgi Odağı Olabilecek Diğer Durumlar).

### Neden kodları

- **BELIRLEYICI**: Başka bir tanının belirleyicisi / alt tipi / belirti boyutu; DSM-5-TR'de ayrı tanı ya da ayrı kod değil.
- **ORNEK**: Resmî "belirlenmiş diğer" kategorisinin örneği; tek başına tanı değil.
- **KULTUREL**: Kültürel sıkıntı kavramı (DSM-5-TR Bölüm III); tanı değil.
- **BOLUM3**: DSM-5-TR Bölüm III: ileri araştırma gerektiren durum; resmî tanı değil.
- **DSM_DISI**: DSM-5-TR'de yer almayan kavram / başka sistemin ya da eski baskının tanısı / tıbbi-nörolojik tablo.
- **YINELEME**: Listede aynı tanıyı karşılayan başka bir girdi var (yinelenen girdi).
- **Z_KODU**: Klinik ilginin odağı olabilecek diğer durumlar (Z/T/R kodları); ruhsal bozukluk değil.
- **ILAC**: İlaca bağlı hareket bozuklukları ve ilacın diğer olumsuz etkileri; Bölüm II'de listelenir ama ruhsal bozukluk değil.

## Tüm girdiler (eski sırayla; eklenenler en altta)

| # | id | ad | karar | gerekçe |
|---|---|---|---|---|
| 1 | `intellectual_disability_mild` | Zihinsel Yetiyitimi (Hafif Düzey) | KALIR + DÜZELT | DSM-5-TR adı; düzey uyumsal işleve göre belirlenir, IQ aralığı takma adı kaldırıldı. [nameEn: "Intellectual Disability (Mild)" → "Intellectual Developmental Disorder (Intellectual Disability), Mild"; takma ad çıkarıldı: IQ 50-69] |
| 2 | `intellectual_disability_moderate` | Zihinsel Yetiyitimi (Orta Düzey) | KALIR + DÜZELT | Aynı. [nameEn: "Intellectual Disability (Moderate)" → "Intellectual Developmental Disorder (Intellectual Disability), Moderate"; takma ad çıkarıldı: IQ 35-49] |
| 3 | `intellectual_disability_severe` | Zihinsel Yetiyitimi (Ağır Düzey) | KALIR + DÜZELT | Aynı. [nameEn: "Intellectual Disability (Severe)" → "Intellectual Developmental Disorder (Intellectual Disability), Severe"; takma ad çıkarıldı: IQ 20-34] |
| 4 | `intellectual_disability_profound` | Zihinsel Yetiyitimi (İleri Derecede Ağır) | KALIR + DÜZELT | Aynı. [nameEn: "Intellectual Disability (Profound)" → "Intellectual Developmental Disorder (Intellectual Disability), Profound"; takma ad çıkarıldı: IQ < 20] |
| 5 | `global_developmental_delay` | Küresel Gelişimsel Gecikme | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 6 | `unspecified_intellectual_disability` | Belirtilmemiş Zihinsel Yetiyitimi | KALIR + DÜZELT | DSM-5-TR adı. [nameEn: "Unspecified Intellectual Disability" → "Unspecified Intellectual Developmental Disorder (Intellectual Disability)"] |
| 7 | `language_disorder` | Dil Bozukluğu | KALIR + DÜZELT | Kod F80.9 → F80.2. [takma ad çıkarıldı: F80.9; takma ad eklendi: F80.2] |
| 8 | `speech_sound_disorder` | Konuşma Sesi Bozukluğu (Fonolojik Bozukluk) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 9 | `childhood_fluency_disorder` | Çocuklukta Başlayan Akıcılık Bozukluğu (Kekemelik) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 10 | `social_communication_disorder` | Toplumsal (Pragmatik) İletişim Bozukluğu | KALIR + DÜZELT | Kod F80.89 → F80.82 (DSM-5-TR). [takma ad çıkarıldı: F80.89; takma ad eklendi: F80.82] |
| 11 | `unspecified_communication_disorder` | Belirtilmemiş İletişim Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 12 | `asd` | Otizm Spektrum Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 13 | `adhd` | Dikkat Eksikliği ve Hiperaktivite Bozukluğu (DEHB - Bileşik Görünüm) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 14 | `adhd_inattentive` | DEHB (Dikkatsizliğin Baskın Olduğu Görünüm) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 15 | `adhd_hyperactive` | DEHB (Aşırı Hareketlilik/Dürtüsellik Baskın Görünüm) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 16 | `specific_learning_dyslexia` | Özgül Öğrenme Bozukluğu (Okuma Bozukluğu / Disleksi) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 17 | `specific_learning_dysgraphia` | Özgül Öğrenme Bozukluğu (Yazılı Anlatım Bozukluğu / Disgrafi) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 18 | `specific_learning_dyscalculia` | Özgül Öğrenme Bozukluğu (Matematik Bozukluğu / Diskalkuli) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 19 | `developmental_coordination_disorder` | Gelişimsel Eşgüdüm (Koordinasyon) Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 20 | `stereotypic_movement_disorder` | Stereotipik Hareket Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 21 | `tourette` | Tourette Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 22 | `chronic_motor_vocal_tic` | Süregen (Kronik) Motor ya da Vokal Tik Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 23 | `provisional_tic_disorder` | Geçici Tik Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 24 | `other_specified_neurodevelopmental` | Belirlenmiş Diğer Bir Nörogelişimsel Bozukluk (FAS Dahil) | KALIR + DÜZELT | Addaki "(FAS Dahil)" kaldırıldı; DSM-5-TR örneği ND-PAE (FAS tıbbi tanıdır). [nameTr: "Belirlenmiş Diğer Bir Nörogelişimsel Bozukluk (FAS Dahil)" → "Belirlenmiş Diğer Bir Nörogelişimsel Bozukluk"; takma ad çıkarıldı: Fetal Alkol Sendromu; takma ad eklendi: Doğum Öncesi Alkol Maruziyetiyle İlişkili Nörogelişimsel Bozukluk, ND-PAE] |
| 25 | `schizotypal_pd` | Şizotipal Kişilik Bozukluğu | KALIR + DÜZELT | Kategori PSYCHOTIC → PERSONALITY_A (ölçütleri kişilik bozuklukları bölümünde; yinelenen schizotypal_pd_cluster kaldırıldığı için Küme A'da tek girdi). Vaka 033 zaten PERSONALITY_A idi. [category: "PSYCHOTIC" → "PERSONALITY_A"; takma ad eklendi: Şizotipal KB, Şizofreni Spektrumu Kişilik Bozukluğu] |
| 26 | `delusional_disorder` | Sanrılı Bozukluk (Hezeyanlı Bozukluk) | KALIR + DÜZELT | Kaldırılan tip girdilerinin adları takma ad olarak eklendi. [takma ad eklendi: Erotomani, Clérambault Sendromu, Othello Sendromu, Kıskançlık Sanrısı, Delüzyonel Parazitoz, Kötülük Görme Sanrısı, Büyüklük Sanrısı] |
| 27 | `delusional_erotomanic` | Sanrılı Bozukluk (Erotomanik Tip / Clérambault) | ÇIKAR (BELIRLEYICI) | Sanrılı bozukluğun "erotomanik tip" belirleyicisi (F22 tek kod). → karşılığı: `delusional_disorder` |
| 28 | `delusional_grandiose` | Sanrılı Bozukluk (Büyüklük / Grandiyöz Tip) | ÇIKAR (BELIRLEYICI) | Sanrılı bozukluğun "büyüklük tipi" belirleyicisi. → karşılığı: `delusional_disorder` |
| 29 | `delusional_jealous` | Sanrılı Bozukluk (Kıskançlık Tipi / Othello) | ÇIKAR (BELIRLEYICI) | Sanrılı bozukluğun "kıskançlık tipi" belirleyicisi. → karşılığı: `delusional_disorder` |
| 30 | `delusional_persecutory` | Sanrılı Bozukluk (Kötülük Görme / Persekütuar Tip) | ÇIKAR (BELIRLEYICI) | Sanrılı bozukluğun "kötülük görme tipi" belirleyicisi. → karşılığı: `delusional_disorder` |
| 31 | `delusional_somatic` | Sanrılı Bozukluk (Somatik Tip / Ekbom Sendromu) | ÇIKAR (BELIRLEYICI) | Sanrılı bozukluğun "somatik tip" belirleyicisi. → karşılığı: `delusional_disorder` |
| 32 | `delusional_mixed` | Sanrılı Bozukluk (Karışık Tip) | ÇIKAR (BELIRLEYICI) | Sanrılı bozukluğun "karışık tip" belirleyicisi. → karşılığı: `delusional_disorder` |
| 33 | `brief_psychotic` | Kısa Psikotik Bozukluk | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 34 | `schizophreniform` | Şizofreniform Bozukluk | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 35 | `schizophrenia` | Şizofreni | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 36 | `schizoaffective` | Şizoaffektif Bozukluk | KALIR + DÜZELT | F25.9 DSM-5-TR kodu değil (kod tipe göre F25.0/F25.1). [takma ad çıkarıldı: F25.9] |
| 37 | `schizoaffective_bipolar` | Şizoaffektif Bozukluk (Bipolar Tip) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 38 | `schizoaffective_depressive` | Şizoaffektif Bozukluk (Depresif Tip) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 39 | `substance_induced_psychotic` | Maddenin/İlacın Yol Açtığı Psikotik Bozukluk | KALIR + DÜZELT | Kod maddeye göre değişir; F19.959 yalnızca "diğer madde" kodu olduğu için kaldırıldı. Maddeye özgü yinelenen girdilerin adları eklendi. [takma ad çıkarıldı: F19.959; takma ad eklendi: Esrarın Yol Açtığı Psikotik Bozukluk, Kokain Psikozu, Metamfetamin Psikozu] |
| 40 | `psychotic_due_to_medical` | Başka Bir Sağlık Durumuna Bağlı Psikotik Bozukluk | KALIR + DÜZELT | Kod: sanrılarla F06.2, varsanılarla F06.0. [takma ad eklendi: F06.0] |
| 41 | `catatonia_associated` | Başka Bir Ruhsal Bozuklukla İlişkili Katatoni | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 42 | `catatonia_medical` | Başka Bir Sağlık Durumuna Bağlı Katatoni | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 43 | `attenuated_psychosis_syndrome` | Hafifletilmiş Psikoz Sendromu (Prodromal Psikoz) | ÇIKAR (BOLUM3) | Bölüm III önerisi; klinikte belirlenmiş diğer psikotik bozukluk olarak kodlanır. → karşılığı: `other_specified_schizophrenia_spectrum` |
| 44 | `folie_a_deux` | Paylaşılmış Psikotik Bozukluk (Folie à Deux) | ÇIKAR (DSM_DISI) | DSM-IV tanısı (F24 ICD-10); DSM-5'te kaldırıldı. Sanrılı bozukluk ya da belirlenmiş diğer psikotik bozukluk olarak kodlanır. → karşılığı: `other_specified_schizophrenia_spectrum` |
| 45 | `capgras_syndrome` | Capgras Sanrısı (Dublör / Değiştirilme Hezeyanı) | ÇIKAR (DSM_DISI) | Bir sanrı içeriği (yanlış tanıma sanrısı); kendisi tanı değil. Sanrılı bozukluk, şizofreni, nörobilişsel bozukluk vb. içinde görülür. → karşılığı: `delusional_disorder` |
| 46 | `cotard_syndrome` | Cotard Sendromu (Yürüyen Ceset / Nihilistik Sanrı) | ÇIKAR (DSM_DISI) | Bir sanrı içeriği (nihilistik sanrı); kendisi tanı değil. Çoğunlukla psikotik özellikli depresyonda görülür. → karşılığı: `mdd_with_psychotic` |
| 47 | `bipolar_1` | Bipolar I Bozukluğu (Manik Epizodlu) | KALIR + DÜZELT | Kaldırılan belirleyici girdilerinin adları eklendi. [takma ad eklendi: Hızlı Döngülü Bipolar, Karışık Özellikli Bipolar, Disforik Mani] |
| 48 | `bipolar_1_depressed` | Bipolar I Bozukluğu (Şu Anki Epizod Depresif) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 49 | `bipolar_1_mixed` | Bipolar I Bozukluğu (Karışık Özellikli) | ÇIKAR (BELIRLEYICI) | "Karışık özellikli" belirleyicisi; DSM-5-TR kod vermez (F31.6 ICD-10 karışık epizod kodudur). → karşılığı: `bipolar_1` |
| 50 | `bipolar_1_rapid_cycling` | Bipolar I Bozukluğu (Hızlı Döngülü Tip / Rapid Cycling) | ÇIKAR (BELIRLEYICI) | "Hızlı döngülü" belirleyicisi; ayrı kod yok. → karşılığı: `bipolar_1` |
| 51 | `bipolar_2` | Bipolar II Bozukluğu (Hipomani ve Majör Depresyon) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 52 | `cyclothymia` | Siklotimik Bozukluk (Siklotimi) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 53 | `substance_induced_bipolar` | Maddenin/İlacın Yol Açtığı Bipolar Bozukluk | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 54 | `bipolar_due_to_medical` | Başka Bir Sağlık Durumuna Bağlı Bipolar Bozukluk | KALIR + DÜZELT | Kod F06.3 → F06.33 (manik özellik) / F06.34 (karışık özellik). [takma ad çıkarıldı: F06.3; takma ad eklendi: F06.33, F06.34] |
| 55 | `other_specified_bipolar` | Belirlenmiş Diğer Bir Bipolar ve İlişkili Bozukluk | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 56 | `unspecified_bipolar` | Belirtilmemiş Bipolar ve İlişkili Bozukluk | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 57 | `mdd` | Majör Depresif Bozukluk (Tek Epizod) | KALIR + DÜZELT | Kaldırılan belirleyici girdilerinin adları eklendi. [takma ad eklendi: Peripartum Başlangıçlı Depresyon, Postpartum Depresyon, Atipik Depresyon, Melankolik Depresyon, Melankoli] |
| 58 | `mdd_recurrent` | Majör Depresif Bozukluk (Yineleyici / Tekrarlayan) | KALIR + DÜZELT | Mevsimsel örüntü yalnızca yineleyici MDB'ye konur. [takma ad eklendi: Mevsimsel Örüntülü Depresyon, Kış Depresyonu] |
| 59 | `mdd_with_psychotic` | Psikotik Özellikli Majör Depresif Bozukluk | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 60 | `mdd_with_peripartum` | Peripartum (Doğum Sonrası / Postpartum) Başlangıçlı Depresyon | ÇIKAR (BELIRLEYICI) | "Peripartum başlangıçlı" belirleyicisi; DSM-5-TR MDB koduyla kodlanır (F53.0 kullanılmaz). → karşılığı: `mdd` |
| 61 | `mdd_with_seasonal` | Mevsimsel Özellik Gösteren Majör Depresyon (Kış Depresyonu) | ÇIKAR (BELIRLEYICI) | "Mevsimsel örüntülü" belirleyicisi (yalnızca yineleyici MDB). → karşılığı: `mdd_recurrent` |
| 62 | `mdd_with_atypical` | Atipik Özellikli Majör Depresif Bozukluk | ÇIKAR (BELIRLEYICI) | "Atipik özellikli" belirleyicisi; ayrı kod yok. → karşılığı: `mdd` |
| 63 | `mdd_with_melancholic` | Melankolik Özellikli Majör Depresif Bozukluk | ÇIKAR (BELIRLEYICI) | "Melankolik özellikli" belirleyicisi; ayrı kod yok. → karşılığı: `mdd` |
| 64 | `dysthymia` | Kalıcı Depresif Bozukluk (Distimi) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 65 | `dmdd` | Yıkıcı Duygudurumu Düzenleyememe Bozukluğu (DMDD) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 66 | `pmdd` | Premenstrüel Disforik Bozukluk (PMDD) | KALIR + DÜZELT | Kod N94.3 → F32.81 (DSM-5-TR). [takma ad çıkarıldı: N94.3; takma ad eklendi: F32.81] |
| 67 | `substance_induced_depressive` | Maddenin/İlacın Yol Açtığı Depresif Bozukluk | KALIR + DÜZELT | Yinelenen girdinin adı eklendi. [takma ad eklendi: Alkolün Yol Açtığı Depresif Bozukluk] |
| 68 | `depressive_due_to_medical` | Başka Bir Sağlık Durumuna Bağlı Depresif Bozukluk | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 69 | `recurrent_brief_depression` | Yineleyen Kısa Depresif Bozukluk | ÇIKAR (ORNEK) | Belirlenmiş diğer depresif bozukluk örneği (F38.1 ICD-10 kodudur). → karşılığı: `other_specified_depressive` |
| 70 | `short_duration_depressive` | Kısa Süreli Depresif Epizod (4-13 Gün) | ÇIKAR (ORNEK) | Belirlenmiş diğer depresif bozukluk örneği. → karşılığı: `other_specified_depressive` |
| 71 | `gad` | Yaygın Anksiyete Bozukluğu (YAB) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 72 | `panic_disorder` | Panik Bozukluk | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 73 | `agoraphobia` | Agorafobi | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 74 | `social_anxiety` | Toplumsal Kaygı Bozukluğu (Sosyal Anksiyete / Sosyal Fobi) | KALIR + DÜZELT | Kaldırılan belirleyici girdisinin adları eklendi. [takma ad eklendi: Sahne Korkusu, Performans Kaygısı] |
| 75 | `social_anxiety_performance` | Sosyal Anksiyete Bozukluğu (Yalnızca Performans Tipi) | ÇIKAR (BELIRLEYICI) | "Yalnızca performans" belirleyicisi (F40.10 tek kod). → karşılığı: `social_anxiety` |
| 76 | `specific_phobia` | Özgül Fobi | KALIR + DÜZELT | "Diğer tip" içindeki örnekler eklendi. [takma ad eklendi: Emetofobi, Kusma Korkusu, Fagofobi, Boğulma Korkusu] |
| 77 | `specific_phobia_animal` | Özgül Fobi (Hayvan Tipi: Örümcek, Yılan, Köpek) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 78 | `specific_phobia_natural` | Özgül Fobi (Doğal Çevre Tipi: Yükseklik, Fırtına, Su) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 79 | `specific_phobia_blood` | Özgül Fobi (Kan-Enjeksiyon-Yara Tipi / Vazovagal) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 80 | `specific_phobia_situational` | Özgül Fobi (Durumsal Tip: Klostrofobi, Uçak, Asansör) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 81 | `specific_phobia_emetophobia` | Özgül Fobi (Kusma Korkusu / Emetofobi) | ÇIKAR (BELIRLEYICI) | Ayrı fobi tipi değil; kusma korkusu "diğer tip" özgül fobi içinde (F40.298). → karşılığı: `specific_phobia` |
| 82 | `specific_phobia_phagophobia` | Özgül Fobi (Boğulma/Yutma Korkusu / Fagofobi) | ÇIKAR (BELIRLEYICI) | Ayrı fobi tipi değil; boğulma korkusu "diğer tip" özgül fobi içinde (F40.298). → karşılığı: `specific_phobia` |
| 83 | `separation_anxiety` | Ayrılma Kaygısı Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 84 | `selective_mutism` | Seçici Konuşmazlık (Selektif Mutizm) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 85 | `substance_induced_anxiety` | Maddenin/İlacın Yol Açtığı Anksiyete Bozukluğu | KALIR + DÜZELT | Yinelenen girdinin adı eklendi. [takma ad eklendi: Alkolün Yol Açtığı Anksiyete Bozukluğu] |
| 86 | `anxiety_due_to_medical` | Başka Bir Sağlık Durumuna Bağlı Anksiyete Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 87 | `ataque_de_nervios` | Kültüre Özgü Anksiyete Sendromu (Ataque de Nervios) | ÇIKAR (KULTUREL) | Kültürel sıkıntı kavramı. |
| 88 | `taijin_kyofusho` | Taijin Kyofusho (Başkalarını Rahatsız Etme / Bakış Fobisi) | ÇIKAR (KULTUREL) | Kültürel sıkıntı kavramı. |
| 89 | `ocd` | Obsesif-Kompulsif Bozukluk (OKB) | KALIR + DÜZELT | Kod F42 → F42.2; belirti boyutu adları takma ad olarak eklendi. [takma ad çıkarıldı: F42; takma ad eklendi: F42.2, Temizlik Takıntısı, Kontrol Takıntısı, Simetri Takıntısı, Dini Vesvese, İlişki Odaklı OKB, ROCD] |
| 90 | `ocd_contamination` | OKB (Bulaşma Obsesyonu ve Temizlik Kompulsiyonu) | ÇIKAR (BELIRLEYICI) | OKB belirti boyutu; DSM-5-TR'de alt tip değil. → karşılığı: `ocd` |
| 91 | `ocd_checking` | OKB (Kuşku Obsesyonu ve Kontrol Kompulsiyonu) | ÇIKAR (BELIRLEYICI) | OKB belirti boyutu; DSM-5-TR'de alt tip değil. → karşılığı: `ocd` |
| 92 | `ocd_symmetry` | OKB (Simetri, Düzen ve Sayma Kompulsiyonları) | ÇIKAR (BELIRLEYICI) | OKB belirti boyutu; DSM-5-TR'de alt tip değil. → karşılığı: `ocd` |
| 93 | `ocd_taboo_thoughts` | OKB (Tabu Düşünceler: Dini Vesvese / Cinsel / Saldırganlık) | ÇIKAR (BELIRLEYICI) | OKB belirti boyutu; DSM-5-TR'de alt tip değil. → karşılığı: `ocd` |
| 94 | `rocd` | İlişki Odaklı OKB (Relationship OCD / ROCD) | ÇIKAR (DSM_DISI) | Literatür terimi (ilişki odaklı OKB); DSM'de OKB'nin bir içeriğidir. → karşılığı: `ocd` |
| 95 | `bdd` | Beden Algısı Bozukluğu (Vücut Dismorfik Bozukluğu / BDD) | KALIR + DÜZELT | Belirleyici adı eklendi. [takma ad eklendi: Kas Dismorfisi, Bigoreksiya] |
| 96 | `muscle_dysmorphia` | Beden Algısı Bozukluğu (Kas Dismorfisi / Bigoreksiya) | ÇIKAR (BELIRLEYICI) | Beden algısı bozukluğunun "kas dismorfisiyle" belirleyicisi. → karşılığı: `bdd` |
| 97 | `hoarding_disorder` | Biriktiricilik Bozukluğu (İstifçilik / Hoarding) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 98 | `trichotillomania` | Trikotillomani (Saç / Kıl Yolma Bozukluğu) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 99 | `excoriation` | Deri Yolma Bozukluğu (Ekskoriyasyon) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 100 | `olfactory_reference` | Koku Referans Bozukluğu (Olfactory Reference Disorder) | ÇIKAR (ORNEK) | DSM-5-TR'de belirlenmiş diğer obsesif-kompulsif ve ilişkili bozukluk örneği (ICD-11'de ayrı tanı). F22 kodu yanlıştı. → karşılığı: `other_specified_ocd` |
| 101 | `body_focused_repetitive` | Beden Odaklı Yineleyici Davranış Bozukluğu (Tırnak Yeme vb.) | ÇIKAR (ORNEK) | Belirlenmiş diğer obsesif-kompulsif ve ilişkili bozukluk örneği. → karşılığı: `other_specified_ocd` |
| 102 | `pandas_syndrome` | PANDAS / PANS (Pediatrik Otoimmün Nöropsikiyatrik OKB) | ÇIKAR (DSM_DISI) | Tartışmalı etiyolojik sendrom; DSM-5-TR'de tıbbi neden kanıtlanırsa başka bir sağlık durumuna bağlı OKİB olarak kodlanır. → karşılığı: `ocd_due_to_medical` |
| 103 | `ptsd` | Travma Sonrası Stres Bozukluğu (TSSB / PTSD) | KALIR + DÜZELT | Kaldırılan belirleyici girdisinin adı eklendi. [takma ad eklendi: Dissosiyatif Belirtilerle TSSB, Dissosiyatif TSSB] |
| 104 | `ptsd_dissociative` | TSSB (Dissosiyatif Belirtilerle Giden / C-PTSD) | ÇIKAR (BELIRLEYICI) | TSSB'nin "dissosiyatif belirtilerle" belirleyicisi (F43.10 tek kod). Eski addaki "C-PTSD" yanlıştı: Karmaşık TSSB ICD-11 tanısıdır. → karşılığı: `ptsd` |
| 105 | `ptsd_preschool` | 6 Yaş ve Altı Çocuklarda Travma Sonrası Stres Bozukluğu | KALIR + DÜZELT | Ayrı ölçüt kümesi olduğu için ayrı girdi olarak tutuldu. [takma ad eklendi: F43.10] |
| 106 | `acute_stress_disorder` | Akut Stres Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 107 | `adjustment_disorder` | Uyum Bozuklukları | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 108 | `adjustment_disorder_depressed` | Uyum Bozukluğu (Çökkün Duygudurum ile) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 109 | `adjustment_disorder_anxious` | Uyum Bozukluğu (Kaygı ile) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 110 | `reactive_attachment_disorder` | Tepkisel Bağlanma Bozukluğu (RAD) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 111 | `disinhibited_social_engagement` | Sınırsız Toplumsal Katılım Bozukluğu (DSED) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 112 | `prolonged_grief_disorder` | Uzatılmış Yas Bozukluğu (Prolonged Grief Disorder) | KALIR + DÜZELT | Kod F43.8 → F43.81 (DSM-5-TR kodlama güncellemesi); DSM-5'teki "süregen karmaşık yas" adı buraya taşındı. [takma ad çıkarıldı: F43.8; takma ad eklendi: F43.81, Süregen Karmaşık Yas] |
| 113 | `did` | Dissosiyatif Kimlik Bozukluğu (Çoklu Kişilik) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 114 | `dissociative_amnesia` | Dissosiyatif Amnezi (Bellek Yitimi) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 115 | `dissociative_fugue` | Dissosiyatif Füg (Kaçış ve Kimlik Kaybı) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 116 | `depersonalization_derealization` | Depersonalizasyon / Derealizasyon Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 117 | `dissociative_trance` | Dissosiyatif Trans Bozukluğu | ÇIKAR (ORNEK) | Belirlenmiş diğer dissosiyatif bozukluk örneği (ICD-11'de ayrı tanı). → karşılığı: `other_specified_dissociative` |
| 118 | `ganser_syndrome` | Ganser Sendromu (Yaklaşık Yanıtlar / Cezaevi Psikozu) | ÇIKAR (DSM_DISI) | DSM-IV "başka türlü adlandırılamayan dissosiyatif bozukluk" örneği; DSM-5-TR'de ayrı tanı değil. → karşılığı: `other_specified_dissociative` |
| 119 | `possession_trance` | Ele Geçirilme Transı Bozukluğu (Cin/Ruh Çarpması İnancı) | ÇIKAR (ORNEK) | Ayrı tanı değil: ölçütleri karşılıyorsa dissosiyatif kimlik bozukluğu (ele geçirilme biçimi), karşılamıyorsa belirlenmiş diğer dissosiyatif bozukluk (dissosiyatif trans). → karşılığı: `other_specified_dissociative` |
| 120 | `coercive_persuasion_dissociation` | Yoğun Zorlayıcı İkna Sonrası Kimlik Bozulması (Tarikat Travması) | ÇIKAR (ORNEK) | Belirlenmiş diğer dissosiyatif bozukluk örneği. → karşılığı: `other_specified_dissociative` |
| 121 | `somatic_symptom_disorder` | Bedensel Belirti Bozukluğu (Somatik Semptom Bozukluğu) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 122 | `illness_anxiety_disorder` | Hastalık Kaygısı Bozukluğu (Hipokondriyazis) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 123 | `conversion_disorder` | Konversiyon Bozukluğu (İşlevsel Nörolojik Belirti Bozukluğu) | KALIR + DÜZELT | Kod belirti türüne göre verilir; genel girdiden F44.4 kaldırıldı. [takma ad çıkarıldı: F44.4; takma ad eklendi: İşlevsel Nörolojik Belirti Bozukluğu] |
| 124 | `conversion_motor` | Konversiyon Bozukluğu (Motor Belirtiler: Felç / Yürüme Bozukluğu) | KALIR + DÜZELT | Afoni DSM-5-TR'de "konuşma belirtisiyle" motor türdedir (F44.4). [takma ad eklendi: Psikojenik Afoni] |
| 125 | `conversion_seizures` | Konversiyon Bozukluğu (Psödonöbet / PNES) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 126 | `conversion_sensory` | Konversiyon Bozukluğu (Duyusal: Histerik Körlük / Afoni) | KALIR + DÜZELT | Addan ve takma addan "afoni" çıkarıldı (motor türdür). [nameTr: "Konversiyon Bozukluğu (Duyusal: Histerik Körlük / Afoni)" → "Konversiyon Bozukluğu (Duyusal Belirtiler: Duyu Kaybı / Histerik Körlük)"; nameEn: "Conversion Disorder (Sensory / Blindness / Aphonia)" → "Conversion Disorder (With Anesthesia or Sensory Loss / Special Sensory Symptom)"; takma ad çıkarıldı: Psikojenik Afoni] |
| 127 | `factitious_disorder` | Yapay Bozukluk (Kendine Yüklenen / Münchausen Sendromu) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 128 | `factitious_another` | Yapay Bozukluk (Başkasına Yüklenen / Münchausen by Proxy) | KALIR + DÜZELT | Kod T74.8 → F68.A (DSM-5-TR). [takma ad çıkarıldı: T74.8; takma ad eklendi: F68.A] |
| 129 | `pseudocyesis` | Yalancı Gebelik (Psödosiyezis) | ÇIKAR (ORNEK) | Belirlenmiş diğer bedensel belirti ve ilişkili bozukluk örneği. → karşılığı: `other_specified_somatic` |
| 130 | `psychological_factors_affecting_medical` | Başka Sağlık Durumunu Etkileyen Ruhsal Etkenler | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 131 | `anorexia_nervosa` | Anoreksiya Nervoza | KALIR + DÜZELT | Kod alt tipe göre verilir; genel girdiden F50.00 kaldırıldı. [takma ad çıkarıldı: F50.00] |
| 132 | `anorexia_restricting` | Anoreksiya Nervoza (Kısıtlayıcı Tip) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 133 | `anorexia_binge_purge` | Anoreksiya Nervoza (Tıkınma/Çıkarma Tipi) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 134 | `atypical_anorexia` | Atipik Anoreksiya Nervoza (Kilo Normal Sınırlarda) | ÇIKAR (ORNEK) | Belirlenmiş diğer beslenme ve yeme bozukluğu örneği. → karşılığı: `other_specified_feeding` |
| 135 | `bulimia_nervosa` | Bulimiya Nervoza | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 136 | `binge_eating` | Tıkınırcasına Yeme Bozukluğu (BED) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 137 | `purging_disorder` | Çıkarma Bozukluğu (Tıkınma Olmaksızın Kusma) | ÇIKAR (ORNEK) | Belirlenmiş diğer beslenme ve yeme bozukluğu örneği. → karşılığı: `other_specified_feeding` |
| 138 | `arfid` | Kaçıngan/Kısıtlı Yiyecek Alımı Bozukluğu (ARFID) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 139 | `pica` | Pika (Yenilmeyen Maddeleri Yeme: Toprak, Kireç, Kömür) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 140 | `rumination_disorder` | Geri Çıkarma (Geviş Getirme / Ruminasyon) Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 141 | `night_eating_syndrome` | Gece Yeme Sendromu | ÇIKAR (ORNEK) | Belirlenmiş diğer beslenme ve yeme bozukluğu örneği. → karşılığı: `other_specified_feeding` |
| 142 | `orthorexia_nervosa` | Ortoreksiya Nervoza (Sağlıklı ve Saf Beslenme Takıntısı) | ÇIKAR (DSM_DISI) | DSM'de yer almayan kavram; klinikte belirlenmiş diğer beslenme ve yeme bozukluğu olarak kodlanabilir. → karşılığı: `other_specified_feeding` |
| 143 | `enuresis` | Enürezis (İstemsiz İdrar Kaçırma / Alt Islatma) | KALIR + DÜZELT | Belirleyici adları eklendi. [takma ad eklendi: Enürezis Nokturna, Gece Altını Islatma, Enürezis Diürna] |
| 144 | `enuresis_nocturna` | Enürezis Nokturna (Gece Altını Islatma) | ÇIKAR (BELIRLEYICI) | Enürezisin "yalnızca gece" belirleyicisi (F98.0 tek kod). → karşılığı: `enuresis` |
| 145 | `enuresis_diurna` | Enürezis Diürna (Gündüz Altını Islatma) | ÇIKAR (BELIRLEYICI) | Enürezisin "yalnızca gündüz" belirleyicisi (F98.0 tek kod). → karşılığı: `enuresis` |
| 146 | `encopresis` | Enkoprezis (İstemsiz Kaka Kaçırma) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 147 | `insomnia_disorder` | Uykusuzluk Bozukluğu (Kronik İnsomni) | KALIR + DÜZELT | Kod G74.0 (geçersiz) → F51.01. [takma ad çıkarıldı: G74.0; takma ad eklendi: F51.01] |
| 148 | `hypersomnolence` | Aşırı Uykululuk Bozukluğu (Hipersomnolans) | KALIR + DÜZELT | Kod G47.10 → F51.11. [takma ad çıkarıldı: G47.10; takma ad eklendi: F51.11] |
| 149 | `narcolepsy` | Narkolepsi (Katapleksi ile Giden) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 150 | `narcolepsy_without_cataplexy` | Narkolepsi (Katapleksi Olmayan Tip) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 151 | `obstructive_sleep_apnea` | Tıkayıcı (Obstrüktif) Uyku Apnesi Hipopnesi | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 152 | `central_sleep_apnea` | Santral Uyku Apnesi (Cheyne-Stokes) | KALIR + DÜZELT | Cheyne-Stokes yalnızca bir alt tip; addan takma ada taşındı. [nameTr: "Santral Uyku Apnesi (Cheyne-Stokes)" → "Santral Uyku Apnesi"; takma ad eklendi: Cheyne-Stokes Solunumu] |
| 153 | `sleep_related_hypoventilation` | Uykuda Hipoventilasyon (Ondine Laneti Dahil) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 154 | `circadian_delayed_sleep` | Sirkadiyen Ritim Bozukluğu (Gecikmiş Uyku Evresi Tipi) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 155 | `circadian_advanced_sleep` | Sirkadiyen Ritim Bozukluğu (Erken Uyku Evresi Tipi) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 156 | `circadian_shift_work` | Sirkadiyen Ritim Bozukluğu (Vardiyalı Çalışma Tipi) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 157 | `circadian_non_24_hour` | Sirkadiyen Ritim Bozukluğu (24 Saate Uymayan Tip) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 158 | `sleepwalking_disorder` | NREM Uykusundan Uyanma (Uyurgezerlik / Somnambulizm) | KALIR + DÜZELT | Belirleyici adı eklendi. [takma ad eklendi: Seksomni, Uykuda Cinsel Davranış] |
| 159 | `sexsomnia` | Seksomni (Uykuda Cinsel Davranış / Uyurgezerlik Alt Tipi) | ÇIKAR (BELIRLEYICI) | Uyurgezerlik tipinin "uykuyla ilişkili cinsel davranışla (seksomni)" belirleyicisi. → karşılığı: `sleepwalking_disorder` |
| 160 | `sleep_terrors` | NREM Uykusundan Uyanma (Gece Terörü / Uyku Terörü) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 161 | `nightmare_disorder` | Kabus Bozukluğu (Nightmare Disorder) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 162 | `rem_sleep_behavior_disorder` | REM Uykusu Davranış Bozukluğu (RBD) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 163 | `restless_legs_syndrome` | Huzursuz Bacaklar Sendromu (Willis-Ekbom) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 164 | `kleine_levin_syndrome` | Kleine-Levin Sendromu (Uyuyan Güzel Sendromu) | ÇIKAR (DSM_DISI) | ICSD-3 uyku tıbbı tanısı (yineleyen hipersomni); DSM-5-TR'de ayrı tanı değil. |
| 165 | `erectile_disorder` | Sertleşme Bozukluğu (Erektil Bozukluk) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 166 | `premature_ejaculation` | Erken Boşalma (Prematür Ejakülasyon) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 167 | `delayed_ejaculation` | Geç Boşalma (Gecikmiş Ejakülasyon) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 168 | `male_hypoactive_desire` | Erkekte Düşük Cinsel İstek Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 169 | `female_sexual_interest_arousal` | Kadında Cinsel İlgi/Uyarılma Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 170 | `female_orgasmic_disorder` | Kadında Orgazm Bozukluğu (Anorgazmi) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 171 | `genito_pelvic_pain` | Genito-Pelvik Ağrı/Penetrasyon Bozukluğu (Vajinismus / Disparoni) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 172 | `substance_induced_sexual_dysfunction` | Maddenin/İlacın Yol Açtığı Cinsel İşlev Bozukluğu (SSRI Disfonksiyonu) | KALIR + DÜZELT | Addaki örnek parantezi kaldırıldı. [nameTr: "Maddenin/İlacın Yol Açtığı Cinsel İşlev Bozukluğu (SSRI Disfonksiyonu)" → "Maddenin/İlacın Yol Açtığı Cinsel İşlev Bozukluğu"] |
| 173 | `persistent_genital_arousal` | Kalıcı Genital Uyarılma Bozukluğu (PGAD) | ÇIKAR (DSM_DISI) | ISSWSH uzlaşı tanımı; DSM-5-TR tanısı değil. |
| 174 | `unspecified_sexual_dysfunction` | Belirtilmemiş Cinsel İşlev Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 175 | `gender_dysphoria_children` | Çocuklarda Cinsiyet Disforisi | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 176 | `gender_dysphoria_adolescents_adults` | Ergen ve Erişkinlerde Cinsiyet Disforisi | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 177 | `unspecified_gender_dysphoria` | Belirtilmemiş Cinsiyet Disforisi | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 178 | `odd` | Karşıt Olma Karşı Gelme Bozukluğu (KOKGB / ODD) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 179 | `intermittent_explosive` | Aralıklı Patlayıcı Bozukluk (IED) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 180 | `conduct_disorder` | Davranım Bozukluğu | KALIR + DÜZELT | Belirleyici adı eklendi. [takma ad eklendi: Sınırlı Prososyal Duygularla, Katı-Duygusuz Özellikler] |
| 181 | `conduct_childhood` | Davranım Bozukluğu (Çocuklukta Başlayan Tip) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 182 | `conduct_adolescent` | Davranım Bozukluğu (Ergenlikte Başlayan Tip) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 183 | `conduct_callous_unemotional` | Davranım Bozukluğu (Sınırlı Prososyal Duygularla / Katı-Duygusuz Mizaç) | ÇIKAR (BELIRLEYICI) | Davranım bozukluğunun "sınırlı prososyal duygularla" belirleyicisi; ayrı kod yok. → karşılığı: `conduct_disorder` |
| 184 | `pyromania` | Piromani (Yangın Çıkarma Hastalığı) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 185 | `kleptomania` | Kleptomani (Çalma Hastalığı) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 186 | `alcohol_use_disorder` | Alkol Kullanım Bozukluğu (Alkolizm) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 187 | `alcohol_intoxication` | Alkol Zehirlenmesi (İntoksikasyonu) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 188 | `alcohol_withdrawal` | Alkol Yoksunluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 189 | `alcohol_withdrawal_delirium` | Alkol Yoksunluğu Deliryumu (Delirium Tremens) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 190 | `alcohol_induced_mood` | Alkolün Yol Açtığı Depresif / Duygudurum Bozukluğu | ÇIKAR (YINELEME) | DSM-5-TR'de tek tanı "Maddenin/İlacın Yol Açtığı Depresif Bozukluk"; genel girdi listede. → karşılığı: `substance_induced_depressive` |
| 191 | `alcohol_induced_anxiety` | Alkolün Yol Açtığı Anksiyete Bozukluğu | ÇIKAR (YINELEME) | DSM-5-TR'de tek tanı "Maddenin/İlacın Yol Açtığı Anksiyete Bozukluğu"; genel girdi listede. → karşılığı: `substance_induced_anxiety` |
| 192 | `cannabis_use_disorder` | Esrar (Kannabis) Kullanım Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 193 | `cannabis_intoxication` | Esrar Zehirlenmesi (İntoksikasyonu) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 194 | `cannabis_withdrawal` | Esrar Yoksunluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 195 | `cannabis_induced_psychotic` | Esrarın Yol Açtığı Psikotik Bozukluk | ÇIKAR (YINELEME) | DSM-5-TR'de tek tanı "Maddenin/İlacın Yol Açtığı Psikotik Bozukluk"; madde kayıtta belirtilir. Genel girdi listede. → karşılığı: `substance_induced_psychotic` |
| 196 | `synthetic_cannabinoid_intoxication` | Sentetik Kannabinoid Zehirlenmesi (Bonzai / Spice) | ÇIKAR (DSM_DISI) | DSM-5-TR'de ayrı tanı değil (diğer ya da bilinmeyen madde entoksikasyonu olarak kodlanır). |
| 197 | `sedative_hypnotic_use_disorder` | Sedatif, Hipnotik ya da Anksiyolitik Kullanım Bozukluğu (Benzodiazepin) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 198 | `sedative_withdrawal` | Sedatif/Benzodiazepin Yoksunluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 199 | `opioid_use_disorder` | Opioid Kullanım Bozukluğu (Eroin / Morfin) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 200 | `opioid_intoxication` | Opioid Zehirlenmesi (Miyozis, Solunum Depresyonu) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 201 | `opioid_withdrawal` | Opioid Yoksunluğu (Kriz / Kas Ağrıları, Midriyazis) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 202 | `cocaine_use_disorder` | Kokain Kullanım Bozukluğu | KALIR + DÜZELT | DSM-5-TR adı (uyarıcı sınıfı, madde: kokain). [nameTr: "Kokain Kullanım Bozukluğu" → "Uyarıcı Kullanım Bozukluğu (Kokain)"; nameEn: "Cocaine Use Disorder" → "Stimulant Use Disorder (Cocaine)"; takma ad eklendi: Kokain Kullanım Bozukluğu] |
| 203 | `cocaine_intoxication` | Kokain Zehirlenmesi (Taşikardi, Midriyazis, Öfori) | KALIR + DÜZELT | DSM-5-TR adı. [nameTr: "Kokain Zehirlenmesi (Taşikardi, Midriyazis, Öfori)" → "Uyarıcı Zehirlenmesi (Kokain)"; nameEn: "Cocaine Intoxication" → "Stimulant Intoxication (Cocaine)"; takma ad eklendi: Kokain Zehirlenmesi] |
| 204 | `cocaine_withdrawal` | Kokain Yoksunluğu (Ağır Çöküş / Crash) | KALIR + DÜZELT | DSM-5-TR adı. [nameTr: "Kokain Yoksunluğu (Ağır Çöküş / Crash)" → "Uyarıcı Yoksunluğu (Kokain)"; nameEn: "Cocaine Withdrawal" → "Stimulant Withdrawal (Cocaine)"; takma ad eklendi: Kokain Yoksunluğu] |
| 205 | `cocaine_induced_psychosis` | Kokainin Yol Açtığı Psikotik Bozukluk (Paranoya) | ÇIKAR (YINELEME) | Ayrı bir tanı değil; "Maddenin/İlacın Yol Açtığı Psikotik Bozukluk" (madde: kokain). → karşılığı: `substance_induced_psychotic` |
| 206 | `amphetamine_use_disorder` | Amfetamin / Metamfetamin Kullanım Bozukluğu (Kristal Met) | KALIR + DÜZELT | DSM-5-TR adı. [nameTr: "Amfetamin / Metamfetamin Kullanım Bozukluğu (Kristal Met)" → "Uyarıcı Kullanım Bozukluğu (Amfetamin Türü Madde / Metamfetamin)"; nameEn: "Amphetamine-Type Substance Use Disorder" → "Stimulant Use Disorder (Amphetamine-Type Substance)"; takma ad eklendi: Amfetamin Kullanım Bozukluğu] |
| 207 | `amphetamine_withdrawal` | Amfetamin/Uyarıcı Yoksunluğu | KALIR + DÜZELT | DSM-5-TR adı. [nameTr: "Amfetamin/Uyarıcı Yoksunluğu" → "Uyarıcı Yoksunluğu (Amfetamin Türü Madde)"; nameEn: "Amphetamine Withdrawal" → "Stimulant Withdrawal (Amphetamine-Type Substance)"; takma ad eklendi: Amfetamin Yoksunluğu] |
| 208 | `methamphetamine_psychosis` | Metamfetaminin Yol Açtığı Psikotik Bozukluk (Met Böcekleri) | ÇIKAR (YINELEME) | Ayrı bir tanı değil; "Maddenin/İlacın Yol Açtığı Psikotik Bozukluk" (madde: amfetamin türü). → karşılığı: `substance_induced_psychotic` |
| 209 | `phencyclidine_use_disorder` | Fensiklidin (PCP) Kullanım Bozukluğu | KALIR + DÜZELT | Kod F19.20 → F16.20 (PCP hallüsinojen kodları altında). [takma ad çıkarıldı: F19.20; takma ad eklendi: F16.20] |
| 210 | `hallucinogen_use_disorder` | Hallusinojen Kullanım Bozukluğu (LSD / Mantar / MDMA) | KALIR + DÜZELT | DSM-5-TR adı. [nameEn: "Hallucinogen Use Disorder" → "Other Hallucinogen Use Disorder"] |
| 211 | `hallucinogen_persisting_perception` | Hallusinojen Kalıcı Algı Bozukluğu (HPPD / Flashback) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 212 | `inhalant_use_disorder` | Uçucu Madde Kullanım Bozukluğu (Tiner / Bali / Çakmak Gazı) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 213 | `tobacco_use_disorder` | Tütün (Nikotin) Kullanım Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 214 | `tobacco_withdrawal` | Tütün (Nikotin) Yoksunluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 215 | `caffeine_intoxication` | Kafein Zehirlenmesi (İntoksikasyonu) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 216 | `caffeine_withdrawal` | Kafein Yoksunluğu (Baş Ağrısı, Yorgunluk) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 217 | `gambling_disorder` | Kumar Oynama Bozukluğu (Patolojik Kumar) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 218 | `internet_gaming_disorder` | İnternet Oyun Oynama Bozukluğu (Gaming Disorder) | ÇIKAR (BOLUM3) | Bölüm III önerisi (ICD-11'de "oyun oynama bozukluğu"). |
| 219 | `compulsive_buying_disorder` | Kompulsif Satın Alma Bozukluğu (Oniomani / Alışveriş Bağımlılığı) | ÇIKAR (DSM_DISI) | DSM'de yer almayan kavram. |
| 220 | `delirium` | Deliryum (Akut Bilinç Bulanıklığı) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 221 | `delirium_hyperactive` | Deliryum (Aşırı Hareketli / Hiperaktif Tip) | ÇIKAR (BELIRLEYICI) | Deliryumun etkinlik düzeyi belirleyicisi; ayrı kod yok. → karşılığı: `delirium` |
| 222 | `delirium_hypoactive` | Deliryum (Durgun / Hipoaktif Tip) | ÇIKAR (BELIRLEYICI) | Deliryumun etkinlik düzeyi belirleyicisi; ayrı kod yok. → karşılığı: `delirium` |
| 223 | `major_neurocognitive_alzheimer` | Majör Nörobilişsel Bozukluk (Alzheimer Tipi Demans) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 224 | `mild_neurocognitive_alzheimer` | Hafif Nörobilişsel Bozukluk (Alzheimer Hastalığına Bağlı / MCI) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 225 | `major_neurocognitive_vascular` | Majör Nörobilişsel Bozukluk (Vasküler / Damarsal Demans) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 226 | `mild_neurocognitive_vascular` | Hafif Vasküler Nörobilişsel Bozukluk | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 227 | `major_neurocognitive_frontotemporal` | Majör Nörobilişsel Bozukluk (Frontotemporal / Pick Hastalığı) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 228 | `major_neurocognitive_lewy_body` | Majör Nörobilişsel Bozukluk (Lewy Cisimcikli Demans) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 229 | `major_neurocognitive_parkinson` | Majör Nörobilişsel Bozukluk (Parkinson Hastalığına Bağlı) | KALIR + DÜZELT | G31.83 Lewy cisimcikli hastalığın kodudur; doğrulanamayan kod eklenmedi. [takma ad çıkarıldı: G31.83] |
| 230 | `major_neurocognitive_tbi` | Majör Nörobilişsel Bozukluk (Travmatik Beyin Hasarına Bağlı / CTE) | KALIR + DÜZELT | F07.81 (sarsıntı sonrası sendrom) kaldırıldı; "CTE" addan takma ada taşındı (DSM tanısı değil). [nameTr: "Majör Nörobilişsel Bozukluk (Travmatik Beyin Hasarına Bağlı / CTE)" → "Majör Nörobilişsel Bozukluk (Travmatik Beyin Hasarına Bağlı)"; takma ad çıkarıldı: F07.81; takma ad eklendi: Kronik Travmatik Ensefalopati] |
| 231 | `major_neurocognitive_hiv` | Majör Nörobilişsel Bozukluk (HIV Enfeksiyonuna Bağlı) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 232 | `major_neurocognitive_prion` | Majör Nörobilişsel Bozukluk (Prion Hastalığı / Creutzfeldt-Jakob) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 233 | `major_neurocognitive_huntington` | Majör Nörobilişsel Bozukluk (Huntington Hastalığına Bağlı) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 234 | `wernicke_korsakoff_syndrome` | Maddenin Yol Açtığı Kalıcı Bellek Bozukluğu (Wernicke-Korsakoff) | KALIR + DÜZELT | Eski DSM-IV adı ("kalıcı amnestik bozukluk") DSM-5-TR adıyla değiştirildi; id korundu. [nameTr: "Maddenin Yol Açtığı Kalıcı Bellek Bozukluğu (Wernicke-Korsakoff)" → "Alkolün Yol Açtığı Majör Nörobilişsel Bozukluk (Amnestik-Konfabulatuvar Tip / Korsakoff)"; nameEn: "Substance-Induced Persisting Amnestic Disorder (Korsakoff)" → "Alcohol-Induced Major Neurocognitive Disorder, Amnestic-Confabulatory Type"; takma ad eklendi: Wernicke-Korsakoff, Maddenin Yol Açtığı Kalıcı Bellek Bozukluğu] |
| 235 | `major_neurocognitive_nph` | Majör Nörobilişsel Bozukluk (Normal Basınçlı Hidrosefali / Hakim-Adams) | ÇIKAR (YINELEME) | DSM-5-TR'de ayrı adlandırılmış alt tip değil; "Başka Bir Sağlık Durumuna Bağlı Majör Nörobilişsel Bozukluk" olarak kodlanır (genel girdi listeye eklendi). → karşılığı: `major_neurocognitive_another_medical` |
| 236 | `transient_global_amnesia` | Geçici Global Amnezi (TGA) | ÇIKAR (DSM_DISI) | Nörolojik tablo; ruhsal bozukluk değil. |
| 237 | `major_neurocognitive_multiple` | Birden Fazla Etiyolojiye Bağlı Majör Nörobilişsel Bozukluk (Miks Demans) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 238 | `unspecified_neurocognitive` | Belirtilmemiş Nörobilişsel Bozukluk | KALIR + DÜZELT | Kod F03.90 → R41.9. [takma ad çıkarıldı: F03.90; takma ad eklendi: R41.9] |
| 239 | `paranoid_pd` | Paranoid Kişilik Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 240 | `schizoid_pd` | Şizoid Kişilik Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 241 | `schizotypal_pd_cluster` | Şizotipal Kişilik Bozukluğu (Küme A) | ÇIKAR (YINELEME) | schizotypal_pd ile aynı tanı. → karşılığı: `schizotypal_pd` |
| 242 | `antisocial_pd` | Antisosyal Kişilik Bozukluğu (Sosyopati / Psikopati) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 243 | `borderline_pd` | Sınırda (Borderline) Kişilik Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 244 | `histrionic_pd` | Histriyonik Kişilik Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 245 | `narcissistic_pd` | Narsisistik Kişilik Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 246 | `avoidant_pd` | Çekingen (Kaçıngan / Avoidant) Kişilik Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 247 | `dependent_pd` | Bağımlı Kişilik Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 248 | `ocpd` | Obsesif-Kompulsif Kişilik Bozukluğu (OKKB / OCPD) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 249 | `personality_change_due_to_medical` | Başka Bir Sağlık Durumuna Bağlı Kişilik Değişikliği (Frontal Lob) | KALIR + DÜZELT | Addaki "(Frontal Lob)" kaldırıldı (takma ad olarak duruyor). Kategori PERSONALITY_B kaldı: DSM-5-TR'de kümelerin dışında, "diğer kişilik bozuklukları" altındadır; listede ayrı kategori yok. [nameTr: "Başka Bir Sağlık Durumuna Bağlı Kişilik Değişikliği (Frontal Lob)" → "Başka Bir Sağlık Durumuna Bağlı Kişilik Değişikliği"] |
| 250 | `passive_aggressive_pd` | Pasif-Agresif (Olumsuzlamacı) Kişilik Örüntüsü | ÇIKAR (DSM_DISI) | DSM-IV-TR Ek B önerisi; DSM-5-TR tanısı değil. |
| 251 | `voyeuristic` | Gözetlemecilik Bozukluğu (Voyörizm) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 252 | `exhibitionistic` | Göstermecilik Bozukluğu (Ekzibisyonizm) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 253 | `frotteuristic` | Sürtünmecilik Bozukluğu (Frotteurizm) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 254 | `sexual_masochism` | Cinsel Mazoşizm Bozukluğu (Asfiksi Tipi Dahil) | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 255 | `sexual_sadism` | Cinsel Sadizm Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 256 | `pedophilic_disorder` | Pedofili Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 257 | `fetishistic_disorder` | Fetişizm Bozukluğu | KALIR + DÜZELT | Belirleyici adı eklendi. [takma ad eklendi: Parsiyalizm, Kısmi Fetişizm] |
| 258 | `transvestic_disorder` | Karşıgiyim (Travestik) Bozukluğu | KALIR | Resmî DSM-5-TR tanısı / ayrı kodlu görünüm. |
| 259 | `necrophilia` | Nekrofili (Ölü Sevicilik) | ÇIKAR (ORNEK) | Belirlenmiş diğer parafilik bozukluk örneği. → karşılığı: `other_specified_paraphilic` |
| 260 | `zoophilia` | Zoofili (Hayvan Sevicilik / Bestialite) | ÇIKAR (ORNEK) | Belirlenmiş diğer parafilik bozukluk örneği. → karşılığı: `other_specified_paraphilic` |
| 261 | `coprophilia` | Koprofili (Dışkı Fetişizmi) | ÇIKAR (ORNEK) | Belirlenmiş diğer parafilik bozukluk örneği. → karşılığı: `other_specified_paraphilic` |
| 262 | `urophilia` | Urofili (İdrar Fetişizmi / Altın Yağmur) | ÇIKAR (ORNEK) | Belirlenmiş diğer parafilik bozukluk örneği. → karşılığı: `other_specified_paraphilic` |
| 263 | `telephone_scatologia` | Telefon Skatolojisi (Müstehcen Telefon Tacizi) | ÇIKAR (ORNEK) | Belirlenmiş diğer parafilik bozukluk örneği. → karşılığı: `other_specified_paraphilic` |
| 264 | `partialism` | Kısmi Fetişizm (Beden Parçası Fetişizmi / Ayak, Saç vb.) | ÇIKAR (BELIRLEYICI) | Fetişizm bozukluğunun "beden parçaları" belirleyicisi; ayrı tanı değil. → karşılığı: `fetishistic_disorder` |
| 265 | `malingering` | Temarruz (Malingering - Maddi/Yasal Kazanç Amaçlı Sahte Hastalık) | ÇIKAR (Z_KODU) | Z76.5; ruhsal bozukluk değil. |
| 266 | `neuroleptic_malignant_syndrome` | Nöroleptik Malign Sendrom (NMS - Antipsikotik Acili) | ÇIKAR (ILAC) | G21.0. |
| 267 | `serotonin_syndrome` | Serotonin Sendromu (Toksisitesi) | ÇIKAR (DSM_DISI) | Tıbbi ilaç toksisitesi; DSM-5-TR'de listelenmez. |
| 268 | `tardive_dyskinesia` | İlacın Yol Açtığı Tardif Diskinezi (İstemsiz Yüz/Dil Hareketleri) | ÇIKAR (ILAC) | G24.01. |
| 269 | `medication_induced_akathisia` | İlacın Yol Açtığı Akatizi (İçsel Yerinde Duramama) | ÇIKAR (ILAC) | G25.71. |
| 270 | `medication_induced_dystonia` | İlacın Yol Açtığı Akut Distoni (Tortikollis / Okülogirik Kriz) | ÇIKAR (ILAC) | G24.02. |
| 271 | `medication_induced_parkinsonism` | Nöroleptiklerin Yol Açtığı Parkinsonizm (Rijidite / Titreme) | ÇIKAR (ILAC) | G21.11. |
| 272 | `antidepressant_discontinuation` | Antidepresan Bırakma Sendromu (Kesilme Belirtileri) | ÇIKAR (ILAC) | T43.205x (eski kayıttaki F32.89 yanlıştı). |
| 273 | `borderline_intellectual_functioning` | Sınırda Zeka Düzeyi (IQ 70-84) | ÇIKAR (Z_KODU) | R41.83; ruhsal bozukluk değil. Eski addaki "IQ 70-84" DSM-5-TR'de yok. |
| 274 | `relational_problem_partner` | Eş/Partner İlişkisi Sorunu | ÇIKAR (Z_KODU) | Z63.0. |
| 275 | `parent_child_relational_problem` | Ebeveyn-Çocuk İlişkisi Sorunu | ÇIKAR (Z_KODU) | Z62.820. |
| 276 | `sibling_relational_problem` | Kardeş İlişkisi Sorunu (Kardeş Kıskançlığı) | ÇIKAR (Z_KODU) | Z62.891. |
| 277 | `burnout_syndrome` | Tükenmişlik Sendromu (Mesleki Yıpranma) | ÇIKAR (DSM_DISI) | ICD-11'de "mesleki fenomen"; DSM-5-TR tanısı değil. |
| 278 | `academic_or_educational_problem` | Eğitim veya Akademik Sorun | ÇIKAR (Z_KODU) | Z55.x. |
| 279 | `uncomplicated_bereavement` | Komplike Olmayan (Normal) Yas | ÇIKAR (Z_KODU) | Z63.4. |
| 280 | `phase_of_life_problem` | Yaşam Evresi Değişimi Sorunu (Emeklilik, Üniversiteye Başlama vb.) | ÇIKAR (Z_KODU) | Z60.0. |
| 281 | `nonadherence_to_medical_treatment` | Tıbbi Tedaviye Uyumsuzluk (İlaç Reddi) | ÇIKAR (Z_KODU) | Z91.1x. |
| 282 | `religious_or_spiritual_problem` | Dini veya Ruhsal Problem (İnanç Krizi) | ÇIKAR (Z_KODU) | Z65.8 (eski kayıttaki Z71.8 yanlıştı). |
| 283 | `child_physical_abuse` | Çocuk Fiziksel İstismarı (Doğrulanmış) | ÇIKAR (Z_KODU) | T74/T76 kodları. |
| 284 | `child_sexual_abuse` | Çocuk Cinsel İstismarı (Doğrulanmış) | ÇIKAR (Z_KODU) | T74/T76 kodları. |
| 285 | `child_neglect` | Çocuk İhmali (Doğrulanmış) | ÇIKAR (Z_KODU) | T74/T76 kodları. |
| 286 | `spouse_physical_violence` | Eş/Partner Fiziksel Şiddeti | ÇIKAR (Z_KODU) | T74/T76 kodları. |
| 287 | `spouse_psychological_abuse` | Eş/Partner Psikolojik İstismarı (Gaslighting) | ÇIKAR (Z_KODU) | T74/T76 kodları. |
| 288 | `homelessness` | Evsizlik ve Barınma Sorunu | ÇIKAR (Z_KODU) | Z59.0x. |
| 289 | `extreme_poverty` | Aşırı Yoksulluk ve Ekonomik Yetersizlik | ÇIKAR (Z_KODU) | Z59.5. |
| 290 | `social_exclusion_rejection` | Sosyal Dışlanma ve Reddedilme | ÇIKAR (Z_KODU) | Z60.4. |
| 291 | `target_of_discrimination` | Ayrımcılık veya Nefret Suçu Mağduriyeti | ÇIKAR (Z_KODU) | Z60.5. |
| 292 | `acculturation_difficulty` | Kültürleşme ve Göç Uyum Güçlüğü | ÇIKAR (Z_KODU) | Z60.3. |
| 293 | `other_specified_anxiety` | Belirlenmiş Diğer Bir Anksiyete Bozukluğu (Sınırlı Belirtili Panik vb.) | KALIR + DÜZELT | Addaki örnek parantezi takma ada taşındı. [nameTr: "Belirlenmiş Diğer Bir Anksiyete Bozukluğu (Sınırlı Belirtili Panik vb.)" → "Belirlenmiş Diğer Bir Anksiyete Bozukluğu"; takma ad eklendi: Sınırlı Belirtili Panik Atak] |
| 294 | `other_specified_ocd` | Belirlenmiş Diğer Bir OKB ve İlişkili Bozukluk (Obsesyonel Kıskançlık / Koro) | KALIR + DÜZELT | Addaki örnek parantezi kaldırıldı; örnekler takma ad. [nameTr: "Belirlenmiş Diğer Bir OKB ve İlişkili Bozukluk (Obsesyonel Kıskançlık / Koro)" → "Belirlenmiş Diğer Bir Obsesif-Kompulsif ve İlişkili Bozukluk"; takma ad eklendi: Koku Referans Bozukluğu, Beden Odaklı Yineleyici Davranış Bozukluğu, Tırnak Yeme] |
| 295 | `other_specified_trauma` | Belirlenmiş Diğer Bir Travma ve Stresörle İlişkili Bozukluk | KALIR + DÜZELT | "Süregen Karmaşık Yas" takma adı kaldırıldı (artık ayrı tanı: uzamış yas bozukluğu); kod F43.89. [takma ad çıkarıldı: Süregen Karmaşık Yas, F43.8; takma ad eklendi: F43.89] |
| 296 | `other_specified_somatic` | Belirlenmiş Diğer Bir Bedensel Belirti Bozukluğu | KALIR + DÜZELT | Örnek eklendi. [takma ad eklendi: Psödosiyezis, Yalancı Gebelik] |
| 297 | `other_specified_feeding` | Belirlenmiş Diğer Bir Beslenme ve Yeme Bozukluğu (Sınırlı Tıkınma) | KALIR + DÜZELT | Addaki örnek parantezi kaldırıldı; örnekler takma ad. [nameTr: "Belirlenmiş Diğer Bir Beslenme ve Yeme Bozukluğu (Sınırlı Tıkınma)" → "Belirlenmiş Diğer Bir Beslenme ve Yeme Bozukluğu"; takma ad eklendi: Atipik Anoreksiya, Çıkarma Bozukluğu, Gece Yeme Sendromu, Sınırlı Tıkınma, Ortoreksiya] |
| + | `other_specified_schizophrenia_spectrum` | Belirlenmiş Diğer Bir Şizofreni Açılımı ve Diğer Psikotik Bozukluk | EKLENDİ | Resmî DSM-5-TR kategorisi; listede yoktu. Rehber girdisi yeni_tanilar.js. |
| + | `other_specified_depressive` | Belirlenmiş Diğer Bir Depresif Bozukluk | EKLENDİ | Resmî DSM-5-TR kategorisi; listede yoktu. Rehber girdisi yeni_tanilar.js. |
| + | `ocd_due_to_medical` | Başka Bir Sağlık Durumuna Bağlı Obsesif-Kompulsif ve İlişkili Bozukluk | EKLENDİ | Resmî DSM-5-TR kategorisi; listede yoktu. Rehber girdisi yeni_tanilar.js. |
| + | `other_specified_dissociative` | Belirlenmiş Diğer Bir Dissosiyatif Bozukluk | EKLENDİ | Resmî DSM-5-TR kategorisi; listede yoktu. Rehber girdisi yeni_tanilar.js. |
| + | `major_neurocognitive_another_medical` | Başka Bir Sağlık Durumuna Bağlı Majör Nörobilişsel Bozukluk | EKLENDİ | Resmî DSM-5-TR kategorisi; listede yoktu. Rehber girdisi yeni_tanilar.js. |
| + | `other_specified_paraphilic` | Belirlenmiş Diğer Bir Parafilik Bozukluk | EKLENDİ | Resmî DSM-5-TR kategorisi; listede yoktu. Rehber girdisi yeni_tanilar.js. |

## Vaka eşlemeleri (eski → yeni diagnosisId)

| vaka | no | eski | yeni |
|---|---|---|---|
| case-081 | 81 | `pseudocyesis` | `other_specified_somatic` |
| case-082 | 82 | `olfactory_reference` | `other_specified_ocd` |
| case-090 | 90 | `capgras_syndrome` | `delusional_disorder` |
| case-091 | 91 | `cotard_syndrome` | `mdd_with_psychotic` |
| case-096 | 96 | `rocd` | `ocd` |
| case-099 | 99 | `major_neurocognitive_nph` | `major_neurocognitive_another_medical` |
| case-104 | 104 | `sexsomnia` | `sleepwalking_disorder` |
| case-107 | 107 | `ganser_syndrome` | `other_specified_dissociative` |
| case-110 | 110 | `delusional_erotomanic` | `delusional_disorder` |
| case-111 | 111 | `delusional_jealous` | `delusional_disorder` |
| case-112 | 112 | `delusional_somatic` | `delusional_disorder` |
| case-113 | 113 | `folie_a_deux` | `other_specified_schizophrenia_spectrum` |
| case-116 | 116 | `bipolar_1_rapid_cycling` | `bipolar_1` |
| case-117 | 117 | `mdd_with_peripartum` | `mdd` |
| case-118 | 118 | `mdd_with_atypical` | `mdd` |
| case-119 | 119 | `mdd_with_melancholic` | `mdd` |
| case-121 | 121 | `specific_phobia_emetophobia` | `specific_phobia` |
| case-122 | 122 | `social_anxiety_performance` | `social_anxiety` |
| case-123 | 123 | `muscle_dysmorphia` | `bdd` |
| case-124 | 124 | `pandas_syndrome` | `ocd_due_to_medical` |
| case-125 | 125 | `ocd_taboo_thoughts` | `ocd` |
| case-132 | 132 | `night_eating_syndrome` | `other_specified_feeding` |
| case-133 | 133 | `orthorexia_nervosa` | `other_specified_feeding` |
| case-134 | 134 | `enuresis_nocturna` | `enuresis` |

Eşlenen vakalarda 6. ipucu ve gerektiğinde `dsmCriteriaSummary` / `symptomHighlights` metni yeni cevapla tutarlı olacak şekilde en az düzeyde düzeltildi (`karar.js` → `CASE_EDITS`). `therapyId` ve `pharmacologyId` değişmedi.

## Arşivlenen vakalar (`arsivlenen_vakalar.json`)

| vaka | no | eski tanı | neden |
|---|---|---|---|
| case-084 | 84 | `internet_gaming_disorder` | İnternet oyun oynama bozukluğu Bölüm III önerisi; DSM-5-TR'de karşılayan resmî tanı yok. |
| case-092 | 92 | `neuroleptic_malignant_syndrome` | Nöroleptik malign sendrom ilaca bağlı tıbbi tablo; ruhsal bozukluk değil. |
| case-093 | 93 | `serotonin_syndrome` | Serotonin sendromu tıbbi ilaç toksisitesi; DSM-5-TR'de yok. |
| case-108 | 108 | `compulsive_buying_disorder` | Kompulsif satın alma DSM'de yok; dürüstçe bağlanabilecek resmî tanı listede yok. |
| case-109 | 109 | `tardive_dyskinesia` | Tardif diskinezi ilaca bağlı hareket bozukluğu; ruhsal bozukluk değil. |
| case-136 | 136 | `kleine_levin_syndrome` | Kleine-Levin sendromu epizodik; hipersomnolans bozukluğunun süre ölçütünü (≥ 3 ay, haftada ≥ 3) karşılamıyor. Belirlenmiş diğer hipersomnolans bozukluğu listede yok. |
| case-145 | 145 | `transient_global_amnesia` | Geçici global amnezi nörolojik tablo; ruhsal bozukluk değil. |
| case-146 | 146 | `malingering` | Temarruz Z76.5; ruhsal bozukluk değil. |
| case-147 | 147 | `medication_induced_akathisia` | Akatizi ilaca bağlı hareket bozukluğu; ruhsal bozukluk değil. |
| case-148 | 148 | `medication_induced_dystonia` | Akut distoni ilaca bağlı hareket bozukluğu; ruhsal bozukluk değil. |
| case-149 | 149 | `antidepressant_discontinuation` | Antidepresan bırakma sendromu ilacın olumsuz etkisi (T43.205x); ruhsal bozukluk değil. |
| case-150 | 150 | `burnout_syndrome` | Tükenmişlik ICD-11 mesleki fenomeni; DSM-5-TR tanısı değil. |

## Vaka `category` alanı düzeltmeleri (tanının kategorisine eşitlendi)

| vaka | eski | yeni |
|---|---|---|
| case-005 | MOOD | BIPOLAR |
| case-052 | MOOD | BIPOLAR |
| case-067 | MOOD | BIPOLAR |
| case-070 | SEXUAL | PARAPHILIC |
| case-071 | SEXUAL | PARAPHILIC |
| case-072 | SEXUAL | PARAPHILIC |
| case-091 | PSYCHOTIC | MOOD |

## Emin olunmayan noktalar

- İlaca bağlı hareket bozuklukları (NMS, tardif diskinezi, akatizi, distoni, parkinsonizm, antidepresan bırakma sendromu) DSM-5-TR Bölüm II'de listelenir ama ruhsal bozukluk değildir; kurala göre çıkarıldı ve 5 vaka arşivlendi. Emre bunları "tanı" sayarsa `karar.js` içinde REMOVE/ARCHIVE satırları silinip betik yeniden çalıştırılarak geri alınabilir.
- Madde zehirlenmesi/yoksunluğu kodları (F1x.x29, F12.288 vb.) DSM-5 kodlarıdır; DSM-5-TR bazılarını güncelledi ve kod eşlik eden kullanım bozukluğunun şiddetine göre değişir. Doğrulanamadığı için olduğu gibi bırakıldı; kitapla kontrol edilmeli.
- Koku alma referans bozukluğu DSM-5-TR'de belirlenmiş diğer OKİB örneği olarak ele alındı (DSM-5'teki jikoshu-kyofu örneğinin yerine). Kitapla doğrulanmalı.
- Kleine-Levin sendromu vakası (136) arşivlendi: hipersomnolans bozukluğunun süre ölçütü karşılanmıyor; "belirlenmiş diğer hipersomnolans bozukluğu" listede yok. İstenirse o kategori eklenip vaka geri alınabilir.
- Yeni 6 rehber girdisi ve birleştirilen 164 F_/G_ özeti kitaba erişimsiz yazıldı; `tani_ozetleri/F_GOZDEN_GECIR.md` ve `G_GOZDEN_GECIR.md` listeleri hâlâ geçerli.
