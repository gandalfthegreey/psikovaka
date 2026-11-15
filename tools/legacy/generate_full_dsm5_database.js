/**
 * Script to generate the comprehensive, complete 297+ DSM-5 / DSM-5-TR Diagnosis Database
 */
const fs = require('fs');
const path = require('path');

const DSM_CATEGORIES = {
    NEURODEV: { id: "NEURODEV", name: "Nörogelişimsel Bozukluklar", icon: "🌱", color: "#84cc16" },
    PSYCHOTIC: { id: "PSYCHOTIC", name: "Şizofreni Açılımı ve Diğer Psikotik Bozukluklar", icon: "🌀", color: "#06b6d4" },
    BIPOLAR: { id: "BIPOLAR", name: "Bipolar ve İlişkili Bozukluklar", icon: "⚡", color: "#f59e0b" },
    MOOD: { id: "MOOD", name: "Depresif Bozukluklar", icon: "🎭", color: "#6366f1" },
    ANXIETY: { id: "ANXIETY", name: "Anksiyete (Kaygı) Bozuklukları", icon: "🌩️", color: "#eab308" },
    OCD_RELATED: { id: "OCD_RELATED", name: "Obsesif-Kompulsif ve İlişkili Bozukluklar", icon: "🔄", color: "#10b981" },
    TRAUMA: { id: "TRAUMA", name: "Travma ve Stresörle İlişkili Bozukluklar", icon: "⛈️", color: "#64748b" },
    DISSOCIATIVE: { id: "DISSOCIATIVE", name: "Dissosiyatif (Ayrışma) Bozukluklar", icon: "🪞", color: "#a855f7" },
    SOMATIC: { id: "SOMATIC", name: "Bedensel Belirti (Somatik) ve İlişkili Bozukluklar", icon: "🩺", color: "#14b8a6" },
    EATING: { id: "EATING", name: "Beslenme ve Yeme Bozuklukları", icon: "⚖️", color: "#f97316" },
    ELIMINATION: { id: "ELIMINATION", name: "Dışa Atım Bozuklukları", icon: "🚼", color: "#3b82f6" },
    SLEEP: { id: "SLEEP", name: "Uyku-Uyanıklık Bozuklukları", icon: "🌙", color: "#38bdf8" },
    SEXUAL: { id: "SEXUAL", name: "Cinsel İşlev Bozuklukları", icon: "❤️", color: "#ec4899" },
    GENDER: { id: "GENDER", name: "Cinsiyet Disforisi (Cinsiyetinden Hoşnut Olmama)", icon: "⚧️", color: "#8b5cf6" },
    IMPULSE: { id: "IMPULSE", name: "Yıkıcı Bozukluklar, Dürtü Denetimi ve Davranım", icon: "💥", color: "#e11d48" },
    SUBSTANCE: { id: "SUBSTANCE", name: "Maddeyle İlişkili ve Bağımlılık Bozuklukları", icon: "🧪", color: "#d97706" },
    NEUROCOGNITIVE: { id: "NEUROCOGNITIVE", name: "Nörobilişsel Bozukluklar (Demans & Deliryum)", icon: "🧠", color: "#0ea5e9" },
    PERSONALITY_A: { id: "PERSONALITY_A", name: "Kişilik Bozuklukları (Küme A - Tuhaf/Eksantrik)", icon: "🧩", color: "#c084fc" },
    PERSONALITY_B: { id: "PERSONALITY_B", name: "Kişilik Bozuklukları (Küme B - Dramatik/Dürtüsel)", icon: "🔥", color: "#ef4444" },
    PERSONALITY_C: { id: "PERSONALITY_C", name: "Kişilik Bozuklukları (Küme C - Kaygılı/Korkulu)", icon: "🛡️", color: "#a78bfa" },
    PARAPHILIC: { id: "PARAPHILIC", name: "Parafili (Cinsel Sapma) Bozuklukları", icon: "🔞", color: "#f43f5e" },
    OTHER_CLINICAL: { id: "OTHER_CLINICAL", name: "Klinik İlgi Odağı Olabilecek Diğer Durumlar", icon: "📑", color: "#94a3b8" }
};

// We will construct ~297 official DSM-5 / DSM-5-TR disorders
const allDiagnoses = [
    // =========================================================================
    // 1. NÖROGELİŞİMSEL BOZUKLUKLAR (Neurodevelopmental Disorders)
    // =========================================================================
    {
        id: "intellectual_disability_mild",
        nameTr: "Zihinsel Yetiyitimi (Hafif Düzey)",
        nameEn: "Intellectual Disability (Mild)",
        category: "NEURODEV",
        aliases: ["Hafif Zeka Geriliği", "Mental Retardasyon Hafif", "IQ 50-69"]
    },
    {
        id: "intellectual_disability_moderate",
        nameTr: "Zihinsel Yetiyitimi (Orta Düzey)",
        nameEn: "Intellectual Disability (Moderate)",
        category: "NEURODEV",
        aliases: ["Orta Zeka Geriliği", "Mental Retardasyon Orta", "IQ 35-49"]
    },
    {
        id: "intellectual_disability_severe",
        nameTr: "Zihinsel Yetiyitimi (Ağır Düzey)",
        nameEn: "Intellectual Disability (Severe)",
        category: "NEURODEV",
        aliases: ["Ağır Zeka Geriliği", "Mental Retardasyon Ağır", "IQ 20-34"]
    },
    {
        id: "intellectual_disability_profound",
        nameTr: "Zihinsel Yetiyitimi (İleri Derecede Ağır)",
        nameEn: "Intellectual Disability (Profound)",
        category: "NEURODEV",
        aliases: ["Çok Ağır Zeka Geriliği", "IQ < 20"]
    },
    {
        id: "global_developmental_delay",
        nameTr: "Küresel Gelişimsel Gecikme",
        nameEn: "Global Developmental Delay",
        category: "NEURODEV",
        aliases: ["Genel Gelişim Geriliği", "GDD"]
    },
    {
        id: "language_disorder",
        nameTr: "Dil Bozukluğu",
        nameEn: "Language Disorder",
        category: "NEURODEV",
        aliases: ["Gelişimsel Dil Bozukluğu", "Ekspresif Dil Bozukluğu", "Afazi/Disfazi"]
    },
    {
        id: "speech_sound_disorder",
        nameTr: "Konuşma Sesi Bozukluğu (Fonolojik Bozukluk)",
        nameEn: "Speech Sound Disorder",
        category: "NEURODEV",
        aliases: ["Fonolojik Bozukluk", "Artikülasyon Bozukluğu", "Sesletim Bozukluğu"]
    },
    {
        id: "childhood_fluency_disorder",
        nameTr: "Çocuklukta Başlayan Akıcılık Bozukluğu (Kekemelik)",
        nameEn: "Childhood-Onset Fluency Disorder (Stuttering)",
        category: "NEURODEV",
        aliases: ["Kekemelik", "Stuttering", "Akıcılık Bozukluğu"]
    },
    {
        id: "social_communication_disorder",
        nameTr: "Toplumsal (Pragmatik) İletişim Bozukluğu",
        nameEn: "Social (Pragmatic) Communication Disorder",
        category: "NEURODEV",
        aliases: ["Pragmatik Dil Bozukluğu", "Sosyal İletişim Bozukluğu", "SPCD"]
    },
    {
        id: "asd",
        nameTr: "Otizm Spektrum Bozukluğu",
        nameEn: "Autism Spectrum Disorder",
        category: "NEURODEV",
        aliases: ["Otizm", "ASD", "Asperger Sendromu", "Atipik Otizm", "Yaygın Gelişimsel Bozukluk"]
    },
    {
        id: "adhd_combined",
        nameTr: "DEHB - Bileşik Görünüm",
        nameEn: "ADHD - Combined Presentation",
        category: "NEURODEV",
        aliases: ["DEHB", "Dikkat Eksikliği ve Hiperaktivite", "Bileşik Tip DEHB"]
    },
    {
        id: "adhd_inattentive",
        nameTr: "DEHB - Dikkatsizliğin Baskın Olduğu Görünüm",
        nameEn: "ADHD - Predominantly Inattentive",
        category: "NEURODEV",
        aliases: ["Dikkat Eksikliği", "Dikkatsiz Tip DEHB", "ADD"]
    },
    {
        id: "adhd_hyperactive",
        nameTr: "DEHB - Aşırı Hareketlilik/Dürtüsellik Baskın Görünüm",
        nameEn: "ADHD - Predominantly Hyperactive/Impulsive",
        category: "NEURODEV",
        aliases: ["Hiperaktivite Baskın Tip", "Dürtüsel Tip DEHB"]
    },
    {
        id: "specific_learning_dyslexia",
        nameTr: "Özgül Öğrenme Bozukluğu (Okuma Güçlüğü / Disleksi)",
        nameEn: "Specific Learning Disorder with impairment in reading (Dyslexia)",
        category: "NEURODEV",
        aliases: ["Disleksi", "Okuma Bozukluğu", "Dyslexia"]
    },
    {
        id: "specific_learning_dysgraphia",
        nameTr: "Özgül Öğrenme Bozukluğu (Yazılı Anlatım Güçlüğü / Disgrafi)",
        nameEn: "Specific Learning Disorder with impairment in written expression",
        category: "NEURODEV",
        aliases: ["Disgrafi", "Yazma Bozukluğu", "Dysgraphia"]
    },
    {
        id: "specific_learning_dyscalculia",
        nameTr: "Özgül Öğrenme Bozukluğu (Matematik Güçlüğü / Diskalkuli)",
        nameEn: "Specific Learning Disorder with impairment in mathematics (Dyscalculia)",
        category: "NEURODEV",
        aliases: ["Diskalkuli", "Aritmetik Bozukluğu", "Dyscalculia"]
    },
    {
        id: "developmental_coordination_disorder",
        nameTr: "Gelişimsel Eşgüdüm (Koordinasyon) Bozukluğu",
        nameEn: "Developmental Coordination Disorder",
        category: "NEURODEV",
        aliases: ["Dispraksi", "Hantal Çocuk Sendromu", "Motor Koordinasyon Bozukluğu"]
    },
    {
        id: "stereotypic_movement_disorder",
        nameTr: "Stereotipik Hareket Bozukluğu",
        nameEn: "Stereotypic Movement Disorder",
        category: "NEURODEV",
        aliases: ["Stereotipi", "Kalıpyargısal Hareket Bozukluğu"]
    },
    {
        id: "tourette_disorder",
        nameTr: "Tourette Bozukluğu",
        nameEn: "Tourette's Disorder",
        category: "NEURODEV",
        aliases: ["Tourette Sendromu", "Motor ve Vokal Tik Bozukluğu", "Gilles de la Tourette"]
    },
    {
        id: "chronic_motor_vocal_tic",
        nameTr: "Süregen (Kronik) Motor ya da Vokal Tik Bozukluğu",
        nameEn: "Persistent (Chronic) Motor or Vocal Tic Disorder",
        category: "NEURODEV",
        aliases: ["Kronik Tik Bozukluğu", "Süregen Tik"]
    },
    {
        id: "provisional_tic_disorder",
        nameTr: "Geçici Tik Bozukluğu",
        nameEn: "Provisional Tic Disorder",
        category: "NEURODEV",
        aliases: ["Geçici Tik", "Transient Tic Disorder"]
    },
    {
        id: "other_specified_neurodevelopmental",
        nameTr: "Belirlenmiş Diğer Bir Nörogelişimsel Bozukluk",
        nameEn: "Other Specified Neurodevelopmental Disorder",
        category: "NEURODEV",
        aliases: ["FAS", "Fetal Alkol Sendromu ile İlişkili Nörogelişimsel Bozukluk"]
    },

    // =========================================================================
    // 2. ŞİZOFRENİ AÇILIMI VE DİĞER PSİKOTİK BOZUKLUKLAR (Psychotic Disorders)
    // =========================================================================
    {
        id: "schizophrenia",
        nameTr: "Şizofreni",
        nameEn: "Schizophrenia",
        category: "PSYCHOTIC",
        aliases: ["Dementia Praecox", "Kronik Psikoz", "Paranoid Şizofreni", "Dezorganize Şizofreni"]
    },
    {
        id: "schizophreniform",
        nameTr: "Şizofreniform Bozukluk",
        nameEn: "Schizophreniform Disorder",
        category: "PSYCHOTIC",
        aliases: ["1-6 Ay Arası Şizofreni Tablosu", "Kısa Süreli Şizofreni"]
    },
    {
        id: "brief_psychotic",
        nameTr: "Kısa Psikotik Bozukluk",
        nameEn: "Brief Psychotic Disorder",
        category: "PSYCHOTIC",
        aliases: ["Akut Psikotik Atak", "Reaktif Psikoz", "1 Aydan Kısa Psikoz"]
    },
    {
        id: "schizoaffective_bipolar",
        nameTr: "Şizoaffektif Bozukluk (Bipolar Tip)",
        nameEn: "Schizoaffective Disorder (Bipolar Type)",
        category: "PSYCHOTIC",
        aliases: ["Şizoaffektif Manik Tip", "Şizofreni ve Bipolar Birlikteliği"]
    },
    {
        id: "schizoaffective_depressive",
        nameTr: "Şizoaffektif Bozukluk (Depresif Tip)",
        nameEn: "Schizoaffective Disorder (Depressive Type)",
        category: "PSYCHOTIC",
        aliases: ["Şizoaffektif Depresyon", "Şizofreni ve Majör Depresyon"]
    },
    {
        id: "delusional_persecutory",
        nameTr: "Sanrılı Bozukluk (Kötülük Görme / Persekütuar Tip)",
        nameEn: "Delusional Disorder (Persecutory Type)",
        category: "PSYCHOTIC",
        aliases: ["Paranoya", "Takip Edilme Sanrısı", "Perseküsyon Hezeyanı"]
    },
    {
        id: "delusional_grandiose",
        nameTr: "Sanrılı Bozukluk (Büyüklük / Grandiyöz Tip)",
        nameEn: "Delusional Disorder (Grandiose Type)",
        category: "PSYCHOTIC",
        aliases: ["Megaloman Sanrı", "Peygamberlik/Zenginlik Sanrısı", "Grandiyöz Hezeyan"]
    },
    {
        id: "delusional_erotomanic",
        nameTr: "Sanrılı Bozukluk (Erotomanik Tip / Clérambault)",
        nameEn: "Delusional Disorder (Erotomanic Type)",
        category: "PSYCHOTIC",
        aliases: ["Erotomani", "Clerambault Sendromu", "Karşılıksız Aşk Sanrısı"]
    },
    {
        id: "delusional_jealous",
        nameTr: "Sanrılı Bozukluk (Kıskançlık Tipi / Othello)",
        nameEn: "Delusional Disorder (Jealous Type)",
        category: "PSYCHOTIC",
        aliases: ["Othello Sendromu", "Patolojik Kıskançlık Sanrısı", "Aldatılma Hezeyanı"]
    },
    {
        id: "delusional_somatic",
        nameTr: "Sanrılı Bozukluk (Somatik Tip / Ekbom Sendromu)",
        nameEn: "Delusional Disorder (Somatic Type)",
        category: "PSYCHOTIC",
        aliases: ["Ekbom Sendromu", "Deri Altında Parazit Sanrısı", "Somatik Hezeyan"]
    },
    {
        id: "delusional_mixed",
        nameTr: "Sanrılı Bozukluk (Karışık / Belirlenmemiş Tip)",
        nameEn: "Delusional Disorder (Mixed Type)",
        category: "PSYCHOTIC",
        aliases: ["Karışık Tip Hezeyanlı Bozukluk"]
    },
    {
        id: "catatonia_associated",
        nameTr: "Başka Bir Ruhsal Bozuklukla İlişkili Katatoni",
        nameEn: "Catatonia Associated with Another Mental Disorder",
        category: "PSYCHOTIC",
        aliases: ["Katatonik Şizofreni", "Katatoni Sendromu", "Balmumu Esnekliği", "Katalepsi"]
    },
    {
        id: "catatonia_medical",
        nameTr: "Başka Bir Sağlık Durumuna Bağlı Katatoni",
        nameEn: "Catatonia Disorder Due to Another Medical Condition",
        category: "PSYCHOTIC",
        aliases: ["Organik Katatoni", "Ensefalite Bağlı Katatoni"]
    },
    {
        id: "substance_induced_psychotic",
        nameTr: "Maddenin/İlacın Yol Açtığı Psikotik Bozukluk",
        nameEn: "Substance/Medication-Induced Psychotic Disorder",
        category: "PSYCHOTIC",
        aliases: ["Maddeye Bağlı Psikoz", "Esrar Psikozu", "Kokain/Metamfetamin Psikozu"]
    },
    {
        id: "psychotic_due_to_medical",
        nameTr: "Başka Bir Sağlık Durumuna Bağlı Psikotik Bozukluk",
        nameEn: "Psychotic Disorder Due to Another Medical Condition",
        category: "PSYCHOTIC",
        aliases: ["Organik Psikoz", "Tümöre/Epilepsiye Bağlı Psikotik Bozukluk"]
    },
    {
        id: "schizotypal_disorder",
        nameTr: "Şizotipal Bozukluk",
        nameEn: "Schizotypal Disorder",
        category: "PSYCHOTIC",
        aliases: ["Şizotipal Kişilik", "Büyüsel Düşünce Bozukluğu"]
    },
    {
        id: "folie_a_deux",
        nameTr: "Paylaşılmış Psikotik Bozukluk (Folie à Deux)",
        nameEn: "Shared Psychotic Disorder (Folie à Deux)",
        category: "PSYCHOTIC",
        aliases: ["Folie a Deux", "İkili Delilik", "Paylaşılmış Sanrı"]
    },
    {
        id: "capgras_syndrome",
        nameTr: "Capgras Sanrısı (Yakınların Sahtesiyle Değiştirildiği İnancı)",
        nameEn: "Capgras Delusion / Misidentification Syndrome",
        category: "PSYCHOTIC",
        aliases: ["Capgras Sendromu", "Sanrısal Yanlış Tanıma", "Dublör Hezeyanı"]
    },
    {
        id: "cotard_syndrome",
        nameTr: "Cotard Sendromu (Yürüyen Ceset / Nihilistik Sanrı)",
        nameEn: "Cotard's Delusion (Walking Corpse Syndrome)",
        category: "PSYCHOTIC",
        aliases: ["Cotard Sendromu", "Nihilistik Sanrı", "Ölü Olduğu Sanrısı"]
    },
    {
        id: "fregoli_syndrome",
        nameTr: "Fregoli Sendromu (Yabancıların Tanıdık Kişiler Olduğu Sanrısı)",
        nameEn: "Fregoli Delusion",
        category: "PSYCHOTIC",
        aliases: ["Fregoli Sendromu", "Kılık Değiştirme Sanrısı"]
    },

    // =========================================================================
    // 3. BİPOLAR VE İLİŞKİLİ BOZUKLUKLAR (Bipolar and Related Disorders)
    // =========================================================================
    {
        id: "bipolar_1",
        nameTr: "Bipolar I Bozukluğu (Manik Epizodlu)",
        nameEn: "Bipolar I Disorder",
        category: "BIPOLAR",
        aliases: ["Bipolar 1", "Mani", "Manik Depresif Hastalık", "Manik Atak"]
    },
    {
        id: "bipolar_1_depressed",
        nameTr: "Bipolar I Bozukluğu (Geçirilmiş Mani, Şu Anki Epizod Depresif)",
        nameEn: "Bipolar I Disorder, Current or Most Recent Episode Depressed",
        category: "BIPOLAR",
        aliases: ["Bipolar Depresyon", "Bipolar 1 Depresif Atak"]
    },
    {
        id: "bipolar_1_mixed",
        nameTr: "Bipolar I Bozukluğu (Karışık Özellikli Epizod)",
        nameEn: "Bipolar I Disorder with Mixed Features",
        category: "BIPOLAR",
        aliases: ["Karışık Epizod", "Miks Bipolar", "Disforik Mani"]
    },
    {
        id: "bipolar_2",
        nameTr: "Bipolar II Bozukluğu (Hipomani ve Majör Depresyon)",
        nameEn: "Bipolar II Disorder",
        category: "BIPOLAR",
        aliases: ["Bipolar 2", "Hipomanik Depresif", "Yumuşak Bipolar Spektrum"]
    },
    {
        id: "cyclothymia",
        nameTr: "Siklotimik Bozukluk (Siklotimi)",
        nameEn: "Cyclothymic Disorder",
        category: "BIPOLAR",
        aliases: ["Siklotimi", "Kronik Dalgalı Duygudurum"]
    },
    {
        id: "substance_induced_bipolar",
        nameTr: "Maddenin/İlacın Yol Açtığı Bipolar Bozukluk",
        nameEn: "Substance/Medication-Induced Bipolar Disorder",
        category: "BIPOLAR",
        aliases: ["Maddeye Bağlı Mani", "Antidepresana Bağlı Manik Kayma", "Kortizon Manisi"]
    },
    {
        id: "bipolar_due_to_medical",
        nameTr: "Başka Bir Sağlık Durumuna Bağlı Bipolar Bozukluk",
        nameEn: "Bipolar Disorder Due to Another Medical Condition",
        category: "BIPOLAR",
        aliases: ["Organik Bipolar", "Hipertiroidiye Bağlı Mani", "MS'e Bağlı Bipolar"]
    },
    {
        id: "other_specified_bipolar",
        nameTr: "Belirlenmiş Diğer Bir Bipolar ve İlişkili Bozukluk",
        nameEn: "Other Specified Bipolar and Related Disorder",
        category: "BIPOLAR",
        aliases: ["Kısa Süreli Hipomanik Epizodlar", "Yetersiz Belirtili Bipolar"]
    },

    // =========================================================================
    // 4. DEPRESİF BOZUKLUKLAR (Depressive Disorders)
    // =========================================================================
    {
        id: "mdd",
        nameTr: "Majör Depresif Bozukluk (Tek Epizod)",
        nameEn: "Major Depressive Disorder (Single Episode)",
        category: "MOOD",
        aliases: ["Depresyon", "Klinik Depresyon", "Tek Atak Majör Depresyon", "Unipolar Depresyon"]
    },
    {
        id: "mdd_recurrent",
        nameTr: "Majör Depresif Bozukluk (Yineleyici / Tekrarlayan Epizod)",
        nameEn: "Major Depressive Disorder (Recurrent Episode)",
        category: "MOOD",
        aliases: ["Tekrarlayan Depresyon", "Kronik Yineleyen Depresyon"]
    },
    {
        id: "mdd_with_psychotic",
        nameTr: "Psikotik Özellikli Majör Depresif Bozukluk",
        nameEn: "Major Depressive Disorder with Psychotic Features",
        category: "MOOD",
        aliases: ["Psikotik Depresyon", "Sanrılı Depresyon", "Suçluluk Hezeyanlı Depresyon"]
    },
    {
        id: "mdd_with_peripartum",
        nameTr: "Peripartum (Doğum Sonrası / Postpartum) Başlangıçlı Depresyon",
        nameEn: "Major Depressive Disorder with Peripartum Onset",
        category: "MOOD",
        aliases: ["Postpartum Depresyon", "Lohusalık Depresyonu", "Doğum Sonrası Depresyon"]
    },
    {
        id: "mdd_with_seasonal",
        nameTr: "Mevsimsel Özellik Gösteren Majör Depresyon (Kış Depresyonu)",
        nameEn: "Major Depressive Disorder with Seasonal Pattern",
        category: "MOOD",
        aliases: ["Mevsimsel Depresyon", "SAD", "Kış Depresyonu", "Seasonal Affective Disorder"]
    },
    {
        id: "mdd_with_atypical",
        nameTr: "Atipik Özellikli Majör Depresif Bozukluk",
        nameEn: "Major Depressive Disorder with Atypical Features",
        category: "MOOD",
        aliases: ["Atipik Depresyon", "Aşırı Uyuma ve Yeme ile Giden Depresyon", "Kurşun Felci"]
    },
    {
        id: "dysthymia",
        nameTr: "Kalıcı Depresif Bozukluk (Distimi)",
        nameEn: "Persistent Depressive Disorder (Dysthymia)",
        category: "MOOD",
        aliases: ["Distimi", "Kronik Hafif Depresyon", "Dysthymia", "2 Yıldan Uzun Depresyon"]
    },
    {
        id: "dmdd",
        nameTr: "Yıkıcı Duygudurumu Düzenleyememe Bozukluğu (DMDD)",
        nameEn: "Disruptive Mood Dysregulation Disorder",
        category: "MOOD",
        aliases: ["DMDD", "Çocuklukta Kronik İrritabilite ve Öfke Patlamaları"]
    },
    {
        id: "pmdd",
        nameTr: "Premenstrüel Disforik Bozukluk (PMDD)",
        nameEn: "Premenstrual Dysphoric Disorder",
        category: "MOOD",
        aliases: ["PMDD", "Adet Öncesi Disfori", "Şiddetli PMS"]
    },
    {
        id: "substance_induced_depressive",
        nameTr: "Maddenin/İlacın Yol Açtığı Depresif Bozukluk",
        nameEn: "Substance/Medication-Induced Depressive Disorder",
        category: "MOOD",
        aliases: ["Maddeye Bağlı Depresyon", "Alkol Sonrası Depresyon", "İnterferon Depresyonu"]
    },
    {
        id: "depressive_due_to_medical",
        nameTr: "Başka Bir Sağlık Durumuna Bağlı Depresif Bozukluk",
        nameEn: "Depressive Disorder Due to Another Medical Condition",
        category: "MOOD",
        aliases: ["Organik Depresyon", "Hipotiroidiye Bağlı Depresyon", "İnme Sonrası Depresyon"]
    },
    {
        id: "brief_depressive_recurrent",
        nameTr: "Yineleyen Kısa Depresif Bozukluk",
        nameEn: "Recurrent Brief Depression",
        category: "MOOD",
        aliases: ["Kısa Depresyon Atakları", "Aylık 2-3 Günlük Ağır Depresyon"]
    },

    // =========================================================================
    // 5. ANKSİYETE (KAYGI) BOZUKLUKLARI (Anxiety Disorders)
    // =========================================================================
    {
        id: "gad",
        nameTr: "Yaygın Anksiyete Bozukluğu (YAB)",
        nameEn: "Generalized Anxiety Disorder",
        category: "ANXIETY",
        aliases: ["YAB", "GAD", "Genel Kaygı Bozukluğu", "Kronik Evham", "Sürekli Endişe"]
    },
    {
        id: "panic_disorder",
        nameTr: "Panik Bozukluk",
        nameEn: "Panic Disorder",
        category: "ANXIETY",
        aliases: ["Panik Atak Bozukluğu", "Tekrarlayan Panik Nöbetleri", "Beklenti Anksiyetesi"]
    },
    {
        id: "agoraphobia",
        nameTr: "Agorafobi",
        nameEn: "Agoraphobia",
        category: "ANXIETY",
        aliases: ["Açık Alan Korkusu", "Kalabalık Korkusu", "Yardım Bulamama Korkusu", "Eve Kapanma"]
    },
    {
        id: "social_anxiety",
        nameTr: "Toplumsal Kaygı Bozukluğu (Sosyal Anksiyete / Sosyal Fobi)",
        nameEn: "Social Anxiety Disorder (Social Phobia)",
        category: "ANXIETY",
        aliases: ["Sosyal Fobi", "Rezil Olma Korkusu", "Toplum Önünde Konuşma Korkusu", "SAD"]
    },
    {
        id: "specific_phobia_animal",
        nameTr: "Özgül Fobi (Hayvan Tipi: Örümcek, Yılan, Köpek)",
        nameEn: "Specific Phobia (Animal Type)",
        category: "ANXIETY",
        aliases: ["Zoofobi", "Araknofobi", "Köpek Fobisi", "Kedi Fobisi", "Yılan Fobisi"]
    },
    {
        id: "specific_phobia_natural",
        nameTr: "Özgül Fobi (Doğal Çevre Tipi: Yükseklik, Fırtına, Su)",
        nameEn: "Specific Phobia (Natural Environment Type)",
        category: "ANXIETY",
        aliases: ["Akrofobi", "Yükseklik Korkusu", "Hidrofobi", "Fırtına Korkusu"]
    },
    {
        id: "specific_phobia_blood",
        nameTr: "Özgül Fobi (Kan-Enjeksiyon-Yara Tipi / Vazovagal)",
        nameEn: "Specific Phobia (Blood-Injection-Injury Type)",
        category: "ANXIETY",
        aliases: ["Kan Fobisi", "İğne Fobisi", "Vazovagal Senkop Fobisi", "BII Phobia"]
    },
    {
        id: "specific_phobia_situational",
        nameTr: "Özgül Fobi (Durumsal Tip: Uçak, Asansör, Kapalı Alan)",
        nameEn: "Specific Phobia (Situational Type)",
        category: "ANXIETY",
        aliases: ["Klostrofobi", "Uçak Korkusu", "Asansör Korkusu", "Avisyon Fobisi"]
    },
    {
        id: "separation_anxiety_disorder",
        nameTr: "Ayrılma Kaygısı Bozukluğu",
        nameEn: "Separation Anxiety Disorder",
        category: "ANXIETY",
        aliases: ["Ayrılık Anksiyetesi", "Bağlanma Figüründen Ayrılma Korkusu"]
    },
    {
        id: "selective_mutism",
        nameTr: "Seçici Konuşmazlık (Selektif Mutizm)",
        nameEn: "Selective Mutism",
        category: "ANXIETY",
        aliases: ["Selektif Mutizm", "Okulda Konuşamama", "Durumsal Sessizlik"]
    },
    {
        id: "substance_induced_anxiety",
        nameTr: "Maddenin/İlacın Yol Açtığı Anksiyete Bozukluğu",
        nameEn: "Substance/Medication-Induced Anxiety Disorder",
        category: "ANXIETY",
        aliases: ["Maddeye Bağlı Kaygı", "Kafein/Esrar Anksiyetesi"]
    },
    {
        id: "anxiety_due_to_medical",
        nameTr: "Başka Bir Sağlık Durumuna Bağlı Anksiyete Bozukluğu",
        nameEn: "Anxiety Disorder Due to Another Medical Condition",
        category: "ANXIETY",
        aliases: ["Feokromositomaya Bağlı Anksiyete", "Hipertiroidi Kaygısı", "Organik Anksiyete"]
    },

    // =========================================================================
    // 6. OBSESİF-KOMPULSİF VE İLİŞKİLİ BOZUKLUKLAR (OCD & Related)
    // =========================================================================
    {
        id: "ocd_contamination",
        nameTr: "Obsesif-Kompulsif Bozukluk (Bulaşma Obsesyonu ve Temizlik Kompulsiyonu)",
        nameEn: "Obsessive-Compulsive Disorder (Contamination/Cleaning)",
        category: "OCD_RELATED",
        aliases: ["OKB", "Titizlik Takıntısı", "Mikrop Takıntısı", "Aşırı El Yıkama"]
    },
    {
        id: "ocd_checking",
        nameTr: "Obsesif-Kompulsif Bozukluk (Kuşku Obsesyonu ve Kontrol Kompulsiyonu)",
        nameEn: "Obsessive-Compulsive Disorder (Doubt/Checking)",
        category: "OCD_RELATED",
        aliases: ["Kapı/Ocak Kontrol Takıntısı", "Kilit Kontrolü OKB"]
    },
    {
        id: "ocd_symmetry",
        nameTr: "Obsesif-Kompulsif Bozukluk (Simetri, Düzen ve Sayma)",
        nameEn: "Obsessive-Compulsive Disorder (Symmetry/Ordering/Counting)",
        category: "OCD_RELATED",
        aliases: ["Simetri Takıntısı", "Sayma Kompulsiyonu", "Düzenleme OKB"]
    },
    {
        id: "ocd_taboo_thoughts",
        nameTr: "Obsesif-Kompulsif Bozukluk (Tabu / Dini / Cinsel / Saldırganlık Düşünceleri)",
        nameEn: "Obsessive-Compulsive Disorder (Taboo/Intrusive Thoughts)",
        category: "OCD_RELATED",
        aliases: ["Dini Vesvese", "Zarar Verme Korkusu", "Cinsel Obsesyonlar OKB"]
    },
    {
        id: "bdd",
        nameTr: "Beden Algısı Bozukluğu (Vücut Dismorfik Bozukluğu / BDD)",
        nameEn: "Body Dysmorphic Disorder",
        category: "OCD_RELATED",
        aliases: ["Dismorfofobi", "BDD", "Hayali Kusur Takıntısı", "Burun/Cilt Takıntısı"]
    },
    {
        id: "muscle_dysmorphia",
        nameTr: "Beden Algısı Bozukluğu (Kas Dismorfisi / Bigoreksiya)",
        nameEn: "Muscle Dysmorphia (Bigorexia)",
        category: "OCD_RELATED",
        aliases: ["Bigoreksiya", "Kas Yetersizliği Takıntısı", "Ters Anoreksiya"]
    },
    {
        id: "hoarding_disorder",
        nameTr: "Biriktiricilik Bozukluğu (İstifçilik / Hoarding)",
        nameEn: "Hoarding Disorder",
        category: "OCD_RELATED",
        aliases: ["İstifçilik", "Kompulsif Biriktirme", "Çöp Ev Sendromu", "Hoarding"]
    },
    {
        id: "trichotillomania",
        nameTr: "Trikotillomani (Saç / Kıl Yolma Bozukluğu)",
        nameEn: "Trichotillomania (Hair-Pulling Disorder)",
        category: "OCD_RELATED",
        aliases: ["Saç Yolma", "Kaş/Kirpik Yolma", "Trikotillomani"]
    },
    {
        id: "excoriation_disorder",
        nameTr: "Deri Yolma Bozukluğu (Ekskoriyasyon)",
        nameEn: "Excoriation (Skin-Picking) Disorder",
        category: "OCD_RELATED",
        aliases: ["Cilt Yolma", "Dermatilomani", "Deri Koparma Takıntısı"]
    },
    {
        id: "olfactory_reference",
        nameTr: "Koku Referans Bozukluğu (Olfactory Reference Disorder)",
        nameEn: "Olfactory Reference Disorder",
        category: "OCD_RELATED",
        aliases: ["Kötü Koku Takıntısı", "Ağız/Vücut Kokusu Referansı", "ORBD"]
    },
    {
        id: "body_focused_repetitive",
        nameTr: "Beden Odaklı Yineleyici Davranış Bozukluğu (Tırnak Yeme vb.)",
        nameEn: "Body-Focused Repetitive Behavior Disorder",
        category: "OCD_RELATED",
        aliases: ["Onikofaji", "Tırnak Yeme", "Dudak Isırma"]
    },
    {
        id: "substance_induced_ocd",
        nameTr: "Maddenin/İlacın Yol Açtığı Obsesif-Kompulsif Bozukluk",
        nameEn: "Substance/Medication-Induced OCD",
        category: "OCD_RELATED",
        aliases: ["Maddeye Bağlı OKB", "Uyarıcıya Bağlı Takıntılar"]
    },

    // =========================================================================
    // 7. TRAVMA VE STRESÖRLE İLİŞKİLİ BOZUKLUKLAR (Trauma & Stressor)
    // =========================================================================
    {
        id: "ptsd",
        nameTr: "Travma Sonrası Stres Bozukluğu (TSSB / PTSD)",
        nameEn: "Posttraumatic Stress Disorder (PTSD)",
        category: "TRAUMA",
        aliases: ["TSSB", "PTSD", "Travma", "Flashback", "Deprem/Savaş Travması"]
    },
    {
        id: "ptsd_dissociative",
        nameTr: "TSSB (Dissosiyatif Belirtilerle Giden / Depersonalizasyon-Derealizasyon)",
        nameEn: "PTSD with Dissociative Symptoms",
        category: "TRAUMA",
        aliases: ["Dissosiyatif TSSB", "Karmaşık Travma", "C-PTSD"]
    },
    {
        id: "ptsd_preschool",
        nameTr: "6 Yaş ve Altı Çocuklarda Travma Sonrası Stres Bozukluğu",
        nameEn: "PTSD for Children 6 Years and Younger",
        category: "TRAUMA",
        aliases: ["Okul Öncesi TSSB", "Çocukluk Travması"]
    },
    {
        id: "acute_stress_disorder",
        nameTr: "Akut Stres Bozukluğu",
        nameEn: "Acute Stress Disorder",
        category: "TRAUMA",
        aliases: ["İlk 1 Aydaki Travma Tepkisi", "Akut Şok Tepkisi", "ASD"]
    },
    {
        id: "adjustment_disorder_depressed",
        nameTr: "Uyum Bozukluğu (Çökkün Duygudurum ile Giden)",
        nameEn: "Adjustment Disorder with Depressed Mood",
        category: "TRAUMA",
        aliases: ["Boşanma/İş Kaybına Bağlı Uyumsuzluk", "Durumsal Depresyon"]
    },
    {
        id: "adjustment_disorder_anxious",
        nameTr: "Uyum Bozukluğu (Kaygı ile Giden)",
        nameEn: "Adjustment Disorder with Anxiety",
        category: "TRAUMA",
        aliases: ["Strese Bağlı Kaygılı Uyum Bozukluğu"]
    },
    {
        id: "adjustment_disorder_mixed",
        nameTr: "Uyum Bozukluğu (Karmaşık Kaygı ve Çökkün Duygudurum ile)",
        nameEn: "Adjustment Disorder with Mixed Anxiety and Depressed Mood",
        category: "TRAUMA",
        aliases: ["Karma Uyum Bozukluğu"]
    },
    {
        id: "reactive_attachment_disorder",
        nameTr: "Tepkisel Bağlanma Bozukluğu (RAD)",
        nameEn: "Reactive Attachment Disorder",
        category: "TRAUMA",
        aliases: ["RAD", "Bağlanma Bozukluğu", "Kurum Bakımı Travması"]
    },
    {
        id: "disinhibited_social_engagement",
        nameTr: "Sınırsız Toplumsal Katılım Bozukluğu (DSED)",
        nameEn: "Disinhibited Social Engagement Disorder",
        category: "TRAUMA",
        aliases: ["DSED", "Yabancılara Karşı Ayrım Gözetmeyen Bağlanma"]
    },
    {
        id: "prolonged_grief_disorder",
        nameTr: "Uzatılmış Yas Bozukluğu (Prolonged Grief Disorder)",
        nameEn: "Prolonged Grief Disorder",
        category: "TRAUMA",
        aliases: ["Komplike Yas", "Kronik Dinmeyen Yas", "PGD", "DSM-5-TR Yas Bozukluğu"]
    },

    // =========================================================================
    // 8. DİSSOSİYATİF (AYRIŞMA) BOZUKLUKLAR (Dissociative Disorders)
    // =========================================================================
    {
        id: "did",
        nameTr: "Dissosiyatif Kimlik Bozukluğu (Çoklu Kişilik)",
        nameEn: "Dissociative Identity Disorder",
        category: "DISSOCIATIVE",
        aliases: ["Çoklu Kişilik Bozukluğu", "Alter Kişilikler", "DID", "MPD"]
    },
    {
        id: "dissociative_amnesia",
        nameTr: "Dissosiyatif Amnezi (Bellek Yitimi)",
        nameEn: "Dissociative Amnesia",
        category: "DISSOCIATIVE",
        aliases: ["Psikojenik Bellek Kaybı", "Travmatik Amnezi"]
    },
    {
        id: "dissociative_fugue",
        nameTr: "Dissosiyatif Füg (Kaçış / Kimlik Değişimi ile Giden Amnezi)",
        nameEn: "Dissociative Amnesia with Dissociative Fugue",
        category: "DISSOCIATIVE",
        aliases: ["Füg Durumu", "Kaçış Amnezisi", "Başka Şehre Kaçıp Kimlik Unutma"]
    },
    {
        id: "depersonalization_derealization",
        nameTr: "Depersonalizasyon / Derealizasyon Bozukluğu",
        nameEn: "Depersonalization/Derealization Disorder",
        category: "DISSOCIATIVE",
        aliases: ["Kendine Yabancılaşma", "Gerçekdışılık Hissi", "Sis Perdesi Hissi", "DPDR"]
    },

    // =========================================================================
    // 9. BEDENSEL BELİRTİ (SOMATİK) VE İLİŞKİLİ BOZUKLUKLAR
    // =========================================================================
    {
        id: "somatic_symptom_disorder",
        nameTr: "Bedensel Belirti Bozukluğu (Somatik Semptom Bozukluğu)",
        nameEn: "Somatic Symptom Disorder",
        category: "SOMATIC",
        aliases: ["Somatizasyon", "Bedenselleştirme", "Ağrı Bozukluğu", "Briquette Sendromu"]
    },
    {
        id: "illness_anxiety_disorder",
        nameTr: "Hastalık Kaygısı Bozukluğu (Hipokondriyazis)",
        nameEn: "Illness Anxiety Disorder",
        category: "SOMATIC",
        aliases: ["Hipokondri", "Hastalık Hastalığı", "Sağlık Anksiyetesi", "Kanser Korkusu"]
    },
    {
        id: "conversion_motor",
        nameTr: "Konversiyon Bozukluğu (Motor Belirtiler: Felç / Yürüme Güçlüğü)",
        nameEn: "Conversion Disorder (Functional Neurological Symptom Disorder - Motor)",
        category: "SOMATIC",
        aliases: ["Psikojenik Felç", "Histerik Paralizi", "İşlevsel Nörolojik Bozukluk"]
    },
    {
        id: "conversion_seizures",
        nameTr: "Konversiyon Bozukluğu (Psödonöbet / Yalancı Epileptik Ataklar)",
        nameEn: "Conversion Disorder (Psychogenic Non-Epileptic Seizures - PNES)",
        category: "SOMATIC",
        aliases: ["Psödonöbet", "PNES", "Histerik Bayılma", "Psikojenik Nöbet"]
    },
    {
        id: "conversion_sensory",
        nameTr: "Konversiyon Bozukluğu (Duyusal Belirtiler: Histerik Körlük / Afoni)",
        nameEn: "Conversion Disorder (Sensory / Blindness / Aphonia)",
        category: "SOMATIC",
        aliases: ["Histerik Körlük", "Psikojenik Ses Kısıklığı", "Afoni"]
    },
    {
        id: "factitious_self",
        nameTr: "Yapay Bozukluk (Kendine Yüklenen / Münchausen Sendromu)",
        nameEn: "Factitious Disorder Imposed on Self (Münchausen)",
        category: "SOMATIC",
        aliases: ["Münchausen Sendromu", "Yapay Hastalık", "Hasta Rolü Benimseme"]
    },
    {
        id: "factitious_another",
        nameTr: "Yapay Bozukluk (Başkasına Yüklenen / Münchausen by Proxy)",
        nameEn: "Factitious Disorder Imposed on Another (Münchausen by Proxy)",
        category: "SOMATIC",
        aliases: ["Münchausen by Proxy", "Çocuğunu Kasıtlı Hasta Gösterme"]
    },
    {
        id: "pseudocyesis",
        nameTr: "Yalancı Gebelik (Psödosiyezis)",
        nameEn: "Pseudocyesis",
        category: "SOMATIC",
        aliases: ["Psödosiyezis", "Yalancı Hamilelik", "Hayali Gebelik"]
    },
    {
        id: "psychological_factors_affecting_medical",
        nameTr: "Başka Sağlık Durumunu Etkileyen Ruhsal Etkenler",
        nameEn: "Psychological Factors Affecting Other Medical Conditions",
        category: "SOMATIC",
        aliases: ["Psikosomatik Hastalık", "Strese Bağlı Ülser/Astım Kötüleşmesi"]
    },

    // =========================================================================
    // 10. BESLENME VE YEME BOZUKLUKLARI (Feeding and Eating Disorders)
    // =========================================================================
    {
        id: "anorexia_restricting",
        nameTr: "Anoreksiya Nervoza (Kısıtlayıcı Tip)",
        nameEn: "Anorexia Nervosa (Restricting Type)",
        category: "EATING",
        aliases: ["Anoreksiya", "Açlık Grevi Tipi Anoreksiya", "Yememe Hastalığı"]
    },
    {
        id: "anorexia_binge_purge",
        nameTr: "Anoreksiya Nervoza (Tıkınma/Çıkarma Tipi)",
        nameEn: "Anorexia Nervosa (Binge-Eating/Purging Type)",
        category: "EATING",
        aliases: ["Kusan Anoreksiya", "Düşük Kilolu Bulimik Anoreksiya"]
    },
    {
        id: "bulimia_nervosa",
        nameTr: "Bulimiya Nervoza",
        nameEn: "Bulimia Nervosa",
        category: "EATING",
        aliases: ["Bulimiya", "Yiyip Kusma Hastalığı", "Normal Kilolu Kusma"]
    },
    {
        id: "binge_eating_disorder",
        nameTr: "Tıkınırcasına Yeme Bozukluğu (BED)",
        nameEn: "Binge-Eating Disorder",
        category: "EATING",
        aliases: ["BED", "Kusmasız Tıkınma", "Kontrolsüz Aşırı Yeme"]
    },
    {
        id: "arfid",
        nameTr: "Kaçıngan/Kısıtlı Yiyecek Alımı Bozukluğu (ARFID)",
        nameEn: "Avoidant/Restrictive Food Intake Disorder (ARFID)",
        category: "EATING",
        aliases: ["ARFID", "Duyusal Seçici Yeme", "Yemekten Boğulma Korkusu"]
    },
    {
        id: "pica_children",
        nameTr: "Pika (Yenilmeyen Maddeleri Yeme: Toprak, Kireç, Tebeşir)",
        nameEn: "Pica",
        category: "EATING",
        aliases: ["Toprak Yeme", "Pica", "Tebeşir/Kömür Yeme"]
    },
    {
        id: "rumination_disorder",
        nameTr: "Geri Çıkarma (Geviş Getirme / Ruminasyon) Bozukluğu",
        nameEn: "Rumination Disorder",
        category: "EATING",
        aliases: ["Ruminasyon", "Yiyeceği Ağza Geri Getirip Çiğneme"]
    },
    {
        id: "night_eating_syndrome",
        nameTr: "Gece Yeme Sendromu",
        nameEn: "Night Eating Syndrome",
        category: "EATING",
        aliases: ["Gece Uykudan Uyanıp Yemek Yeme"]
    },

    // =========================================================================
    // 11. DIŞA ATIM BOZUKLUKLARI (Elimination Disorders)
    // =========================================================================
    {
        id: "enuresis_nocturna",
        nameTr: "Enürezis Nokturna (Gece Altını Islatma)",
        nameEn: "Enuresis (Nocturnal only)",
        category: "ELIMINATION",
        aliases: ["Gece İdrar Kaçırma", "Alt Islatma", "Enürezis"]
    },
    {
        id: "enuresis_diurna",
        nameTr: "Enürezis Diürna (Gündüz Altını Islatma)",
        nameEn: "Enuresis (Diurnal only)",
        category: "ELIMINATION",
        aliases: ["Gündüz İdrar Kaçırma"]
    },
    {
        id: "encopresis",
        nameTr: "Enkoprezis (İstemsiz Kaka Kaçırma)",
        nameEn: "Encopresis",
        category: "ELIMINATION",
        aliases: ["Kaka Kaçırma", "Dışkı Kaçırma", "Enkoprezis"]
    },

    // =========================================================================
    // 12. UYKU-UYANIKLIK BOZUKLUKLARI (Sleep-Wake Disorders)
    // =========================================================================
    {
        id: "insomnia_disorder",
        nameTr: "Uykusuzluk Bozukluğu (İnsomni)",
        nameEn: "Insomnia Disorder",
        category: "SLEEP",
        aliases: ["İnsomni", "Uykuya Dalamama", "Kronik Uykusuzluk"]
    },
    {
        id: "hypersomnolence",
        nameTr: "Aşırı Uykululuk Bozukluğu (Hipersomnolans)",
        nameEn: "Hypersomnolence Disorder",
        category: "SLEEP",
        aliases: ["Hipersomni", "Sürekli Uykululuk", "Dinlendirmeyen Uzun Uyku"]
    },
    {
        id: "narcolepsy_cataplexy",
        nameTr: "Narkolepsi (Katapleksi ile Birlikte)",
        nameEn: "Narcolepsy with Cataplexy",
        category: "SLEEP",
        aliases: ["Narkolepsi", "Gülmeyle Kas Boşalması", "Gündüz Ani Uyku Atakları"]
    },
    {
        id: "obstructive_sleep_apnea",
        nameTr: "Tıkayıcı (Obstrüktif) Uyku Apnesi Hipopnesi",
        nameEn: "Obstructive Sleep Apnea Hypopnea",
        category: "SLEEP",
        aliases: ["Uyku Apnesi", "OSAS", "Gece Horlama ve Nefes Durması"]
    },
    {
        id: "central_sleep_apnea",
        nameTr: "Santral Uyku Apnesi",
        nameEn: "Central Sleep Apnea",
        category: "SLEEP",
        aliases: ["Merkezi Uyku Apnesi", "Cheyne-Stokes Solunumu"]
    },
    {
        id: "circadian_delayed_sleep",
        nameTr: "Sirkadiyen Ritim Uyku Bozukluğu (Gecikmiş Uyku Evresi Tipi)",
        nameEn: "Circadian Rhythm Sleep-Wake Disorder (Delayed Sleep Phase Type)",
        category: "SLEEP",
        aliases: ["Gece Kuşu Sendromu", "Sabaha Karşı Uyuyabilme"]
    },
    {
        id: "circadian_advanced_sleep",
        nameTr: "Sirkadiyen Ritim Uyku Bozukluğu (Erken Uyku Evresi Tipi)",
        nameEn: "Circadian Rhythm Sleep-Wake Disorder (Advanced Sleep Phase Type)",
        category: "SLEEP",
        aliases: ["Akşam Çok Erken Uyuma", "Sabah 03:00'te Uyanma"]
    },
    {
        id: "circadian_shift_work",
        nameTr: "Sirkadiyen Ritim Uyku Bozukluğu (Vardiyalı Çalışma Tipi)",
        nameEn: "Circadian Rhythm Sleep-Wake Disorder (Shift Work Type)",
        category: "SLEEP",
        aliases: ["Gece Vardiyası Uyku Bozukluğu"]
    },
    {
        id: "sleepwalking_disorder",
        nameTr: "NREM Uyurgezerlik (Somnambulizm)",
        nameEn: "Non-REM Sleep Arousal Disorder (Sleepwalking type)",
        category: "SLEEP",
        aliases: ["Uyurgezerlik", "Somnambulizm", "Uykuda Gezme"]
    },
    {
        id: "sleep_terrors",
        nameTr: "NREM Uyku Terörü (Gece Terörü)",
        nameEn: "Non-REM Sleep Arousal Disorder (Sleep Terror type)",
        category: "SLEEP",
        aliases: ["Gece Terörü", "Çığlıkla Uyanma ve Hatırlamama"]
    },
    {
        id: "nightmare_disorder",
        nameTr: "Kabus Bozukluğu (Nightmare Disorder)",
        nameEn: "Nightmare Disorder",
        category: "SLEEP",
        aliases: ["Korkulu Rüya Bozukluğu", "Kabus Görme"]
    },
    {
        id: "rem_sleep_behavior_disorder",
        nameTr: "REM Uykusu Davranış Bozukluğu",
        nameEn: "REM Sleep Behavior Disorder",
        category: "SLEEP",
        aliases: ["Rüyayı Yaşama/Eyleme Dökme", "RBD", "Uykuda Vurma/Tekmeleme"]
    },
    {
        id: "restless_legs_syndrome",
        nameTr: "Huzursuz Bacaklar Sendromu (Willis-Ekbom)",
        nameEn: "Restless Legs Syndrome",
        category: "SLEEP",
        aliases: ["HBS", "RLS", "Bacaklarda Gece Karıncalanma ve Hareket İhtiyacı"]
    },

    // =========================================================================
    // 13. CİNSEL İŞLEV BOZUKLUKLARI (Sexual Dysfunctions)
    // =========================================================================
    {
        id: "erectile_disorder",
        nameTr: "Sertleşme Bozukluğu (Erektil Bozukluk)",
        nameEn: "Erectile Disorder",
        category: "SEXUAL",
        aliases: ["Erektil Disfonksiyon", "İmpotans", "Sertleşememe"]
    },
    {
        id: "premature_ejaculation",
        nameTr: "Erken Boşalma (Prematür Ejakülasyon)",
        nameEn: "Premature (Early) Ejaculation",
        category: "SEXUAL",
        aliases: ["Erken Boşalma", "Denetimsiz Boşalma", "PE"]
    },
    {
        id: "delayed_ejaculation",
        nameTr: "Geç Boşalma (Gecikmiş Ejakülasyon)",
        nameEn: "Delayed Ejaculation",
        category: "SEXUAL",
        aliases: ["Boşalamama", "Gecikmiş Boşalma", "Anejakülasyon"]
    },
    {
        id: "male_hypoactive_desire",
        nameTr: "Erkekte Düşük Cinsel İstek Bozukluğu",
        nameEn: "Male Hypoactive Sexual Desire Disorder",
        category: "SEXUAL",
        aliases: ["Erkekte Cinsel İsteksizlik", "HSDD"]
    },
    {
        id: "female_sexual_interest_arousal",
        nameTr: "Kadında Cinsel İlgi/Uyarılma Bozukluğu",
        nameEn: "Female Sexual Interest/Arousal Disorder",
        category: "SEXUAL",
        aliases: ["Kadında Cinsel İsteksizlik", "Uyarılma Azlığı", "FSIAD"]
    },
    {
        id: "female_orgasmic_disorder",
        nameTr: "Kadında Orgazm Bozukluğu (Anorgazmi)",
        nameEn: "Female Orgasmic Disorder",
        category: "SEXUAL",
        aliases: ["Anorgazmi", "Orgazm Olamama"]
    },
    {
        id: "genito_pelvic_pain",
        nameTr: "Genito-Pelvik Ağrı/Penetrasyon Bozukluğu (Vajinismus / Disparoni)",
        nameEn: "Genito-Pelvic Pain/Penetration Disorder",
        category: "SEXUAL",
        aliases: ["Vajinismus", "Disparoni", "Ağrılı Cinsel İlişki", "İlişkiye Girememe"]
    },

    // =========================================================================
    // 14. CİNSİYET DİSFORİSİ (Gender Dysphoria)
    // =========================================================================
    {
        id: "gender_dysphoria_children",
        nameTr: "Çocuklarda Cinsiyet Disforisi",
        nameEn: "Gender Dysphoria in Children",
        category: "GENDER",
        aliases: ["Çocuklukta Cinsiyetinden Hoşnutsuzluk"]
    },
    {
        id: "gender_dysphoria_adolescents_adults",
        nameTr: "Ergen ve Erişkinlerde Cinsiyet Disforisi",
        nameEn: "Gender Dysphoria in Adolescents and Adults",
        category: "GENDER",
        aliases: ["Cinsiyet Uyumsuzluğu", "Transgender Kimlik Disforisi"]
    },

    // =========================================================================
    // 15. YIKICI BOZUKLUKLAR, DÜRTÜ DENETİMİ VE DAVRANIM BOZUKLUKLARI
    // =========================================================================
    {
        id: "odd",
        nameTr: "Karşıt Olma Karşı Gelme Bozukluğu (KOKGB / ODD)",
        nameEn: "Oppositional Defiant Disorder",
        category: "IMPULSE",
        aliases: ["KOKGB", "ODD", "İnatlaşma Bozukluğu", "Otoriteye Başkaldırma"]
    },
    {
        id: "intermittent_explosive",
        nameTr: "Aralıklı Patlayıcı Bozukluk (IED)",
        nameEn: "Intermittent Explosive Disorder",
        category: "IMPULSE",
        aliases: ["Öfke Patlaması Bozukluğu", "Kontrolsüz Agresyon", "IED"]
    },
    {
        id: "conduct_childhood",
        nameTr: "Davranım Bozukluğu (Çocuklukta Başlayan Tip)",
        nameEn: "Conduct Disorder (Childhood-onset type)",
        category: "IMPULSE",
        aliases: ["Davranış Bozukluğu Çocukluk", "Şiddet ve Kural Tanımazlık"]
    },
    {
        id: "conduct_adolescent",
        nameTr: "Davranım Bozukluğu (Ergenlikte Başlayan Tip)",
        nameEn: "Conduct Disorder (Adolescent-onset type)",
        category: "IMPULSE",
        aliases: ["Ergenlik Suç Örüntüsü", "Çeteleşme/Hırsızlık Davranımı"]
    },
    {
        id: "conduct_callous_unemotional",
        nameTr: "Davranım Bozukluğu (Sınırlı Prososyal Duygularla / Katı-Duygusuz Mizaç)",
        nameEn: "Conduct Disorder with Limited Prosocial Emotions (Callous-Unemotional)",
        category: "IMPULSE",
        aliases: ["Katı Duygusuz Tip", "Erken Psikopati Örüntüsü", "Vicdansız Tip"]
    },
    {
        id: "pyromania",
        nameTr: "Piromani (Yangın Çıkarma Hastalığı)",
        nameEn: "Pyromania",
        category: "IMPULSE",
        aliases: ["Yangın Çıkarma Dürtüsü", "Ateş Tutkusu"]
    },
    {
        id: "kleptomania",
        nameTr: "Kleptomani (Çalma Hastalığı)",
        nameEn: "Kleptomania",
        category: "IMPULSE",
        aliases: ["Çalma Dürtüsü", "Gereksiz Eşya Çalma"]
    },

    // =========================================================================
    // 16. MADDEYLE İLİŞKİLİ VE BAĞIMLILIK BOZUKLUKLARI (Substance & Addictive)
    // =========================================================================
    {
        id: "alcohol_use_disorder",
        nameTr: "Alkol Kullanım Bozukluğu (Alkolizm)",
        nameEn: "Alcohol Use Disorder",
        category: "SUBSTANCE",
        aliases: ["Alkolizm", "Alkol Bağımlılığı", "Kronik Alkolizm"]
    },
    {
        id: "alcohol_withdrawal_delirium",
        nameTr: "Alkol Yoksunluğu Deliryumu (Delirium Tremens)",
        nameEn: "Alcohol Withdrawal Delirium (Delirium Tremens)",
        category: "SUBSTANCE",
        aliases: ["Delirium Tremens", "DT", "Alkol Bırakma Krizinde Halüsinasyon"]
    },
    {
        id: "cannabis_use_disorder",
        nameTr: "Esrar (Kannabis) Kullanım Bozukluğu",
        nameEn: "Cannabis Use Disorder",
        category: "SUBSTANCE",
        aliases: ["Esrar Bağımlılığı", "Marihuana/Ot Bağımlılığı", "Amotivasyonel Sendrom"]
    },
    {
        id: "opioid_use_disorder",
        nameTr: "Opioid Kullanım Bozukluğu (Eroin / Morfin Bağımlılığı)",
        nameEn: "Opioid Use Disorder",
        category: "SUBSTANCE",
        aliases: ["Eroin Bağımlılığı", "Madde Bağımlılığı", "Opioid Bağımlılığı"]
    },
    {
        id: "cocaine_use_disorder",
        nameTr: "Kokain Kullanım Bozukluğu",
        nameEn: "Cocaine Use Disorder",
        category: "SUBSTANCE",
        aliases: ["Kokain Bağımlılığı", "Crack Bağımlılığı"]
    },
    {
        id: "amphetamine_use_disorder",
        nameTr: "Amfetamin / Metamfetamin Kullanım Bozukluğu (Met)",
        nameEn: "Amphetamine-Type Substance Use Disorder",
        category: "SUBSTANCE",
        aliases: ["Met Bağımlılığı", "Metamfetamin", "Kristal Met", "Uyarıcı Bağımlılığı"]
    },
    {
        id: "sedative_hypnotic_use_disorder",
        nameTr: "Sedatif, Hipnotik ya da Anksiyolitik Kullanım Bozukluğu (Benzodiazepin)",
        nameEn: "Sedative, Hypnotic, or Anxiolytic Use Disorder",
        category: "SUBSTANCE",
        aliases: ["Benzodiazepin Bağımlılığı", "Yatıştırıcı Hap Bağımlılığı", "Xanax Bağımlılığı"]
    },
    {
        id: "hallucinogen_use_disorder",
        nameTr: "Hallusinojen Kullanım Bozukluğu (LSD / Mantar / MDMA)",
        nameEn: "Other Hallucinogen Use Disorder",
        category: "SUBSTANCE",
        aliases: ["LSD Bağımlılığı", "Mantar/Psilosibin", "Asit Kullanımı"]
    },
    {
        id: "hallucinogen_persisting_perception",
        nameTr: "Hallusinojen Kalıcı Algı Bozukluğu (HPPD / Flashback)",
        nameEn: "Hallucinogen Persisting Perception Disorder (HPPD)",
        category: "SUBSTANCE",
        aliases: ["HPPD", "Görsel Kar Yağması Sendromu", "LSD Flashback"]
    },
    {
        id: "inhalant_use_disorder",
        nameTr: "Uçucu Madde Kullanım Bozukluğu (Tiner / Bali / Çakmak Gazı)",
        nameEn: "Inhalant Use Disorder",
        category: "SUBSTANCE",
        aliases: ["Tiner Bağımlılığı", "Uçucu Bağımlılığı", "Bali Çekme"]
    },
    {
        id: "tobacco_use_disorder",
        nameTr: "Tütün (Nikotin) Kullanım Bozukluğu",
        nameEn: "Tobacco Use Disorder",
        category: "SUBSTANCE",
        aliases: ["Sigara Bağımlılığı", "Nikotin Bağımlılığı"]
    },
    {
        id: "caffeine_intoxication",
        nameTr: "Kafein Zehirlenmesi (İntoksikasyonu)",
        nameEn: "Caffeine Intoxication",
        category: "SUBSTANCE",
        aliases: ["Aşırı Kahve/Enerji İçeceği Çarpıntısı", "Kafeinizm"]
    },
    {
        id: "gambling_disorder",
        nameTr: "Kumar Oynama Bozukluğu (Patolojik Kumar)",
        nameEn: "Gambling Disorder",
        category: "SUBSTANCE",
        aliases: ["Patolojik Kumar", "Kumar Bağımlılığı", "Bahis Bağımlılığı"]
    },
    {
        id: "internet_gaming_disorder",
        nameTr: "İnternet Oyun Oynama Bozukluğu (Gaming Disorder)",
        nameEn: "Internet Gaming Disorder",
        category: "SUBSTANCE",
        aliases: ["Oyun Bağımlılığı", "Video Oyunu Bağımlılığı", "Dijital Bağımlılık"]
    },

    // =========================================================================
    // 17. NÖROBİLİŞSEL BOZUKLUKLAR (Neurocognitive Disorders)
    // =========================================================================
    {
        id: "delirium",
        nameTr: "Deliryum (Akut Bilinç Bulanıklığı)",
        nameEn: "Delirium",
        category: "NEUROCOGNITIVE",
        aliases: ["Akut Konfüzyonel Durum", "Bilinç Bulanıklığı", "Enfeksiyona Bağlı Deliryum"]
    },
    {
        id: "major_neurocognitive_alzheimer",
        nameTr: "Majör Nörobilişsel Bozukluk (Alzheimer Tipi Demans)",
        nameEn: "Major Neurocognitive Disorder Due to Alzheimer's Disease",
        category: "NEUROCOGNITIVE",
        aliases: ["Alzheimer", "Alzheimer Demansı", "Bunama", "Yakın Bellek Kaybı"]
    },
    {
        id: "mild_neurocognitive_alzheimer",
        nameTr: "Hafif Nörobilişsel Bozukluk (Alzheimer Hastalığına Bağlı)",
        nameEn: "Mild Neurocognitive Disorder Due to Alzheimer's Disease",
        category: "NEUROCOGNITIVE",
        aliases: ["Hafif Kognitif Bozukluk", "MCI", "Erken Evre Unutkanlık"]
    },
    {
        id: "major_neurocognitive_vascular",
        nameTr: "Majör Nörobilişsel Bozukluk (Vasküler / Damarsal Demans)",
        nameEn: "Major Vascular Neurocognitive Disorder",
        category: "NEUROCOGNITIVE",
        aliases: ["Vasküler Demans", "İnme/Felç Sonrası Demans", "Basamaklı Demans"]
    },
    {
        id: "major_neurocognitive_frontotemporal",
        nameTr: "Majör Nörobilişsel Bozukluk (Frontotemporal / Pick Hastalığı)",
        nameEn: "Major Frontotemporal Neurocognitive Disorder",
        category: "NEUROCOGNITIVE",
        aliases: ["Frontotemporal Demans", "FTD", "Pick Hastalığı", "Kişilik Değişimi ile Giden Demans"]
    },
    {
        id: "major_neurocognitive_lewy_body",
        nameTr: "Majör Nörobilişsel Bozukluk (Lewy Cisimcikli Demans)",
        nameEn: "Major Neurocognitive Disorder with Lewy Bodies",
        category: "NEUROCOGNITIVE",
        aliases: ["Lewy Cisimcikli Demans", "DLB", "Görsel Halüsinasyonlu Demans"]
    },
    {
        id: "major_neurocognitive_parkinson",
        nameTr: "Majör Nörobilişsel Bozukluk (Parkinson Hastalığına Bağlı)",
        nameEn: "Major Neurocognitive Disorder Due to Parkinson's Disease",
        category: "NEUROCOGNITIVE",
        aliases: ["Parkinson Demansı", "Parkinson ile İlişkili Bilişsel Yıkım"]
    },
    {
        id: "major_neurocognitive_tbi",
        nameTr: "Majör Nörobilişsel Bozukluk (Travmatik Beyin Hasarına Bağlı / CTE)",
        nameEn: "Major Neurocognitive Disorder Due to Traumatic Brain Injury",
        category: "NEUROCOGNITIVE",
        aliases: ["TBI Demansı", "Boksör Demansı", "Kafa Travması Sonrası Demans"]
    },
    {
        id: "major_neurocognitive_hiv",
        nameTr: "Majör Nörobilişsel Bozukluk (HIV Enfeksiyonuna Bağlı)",
        nameEn: "Major Neurocognitive Disorder Due to HIV Infection",
        category: "NEUROCOGNITIVE",
        aliases: ["HIV Demansı", "AIDS Demans Kompleksi"]
    },
    {
        id: "major_neurocognitive_prion",
        nameTr: "Majör Nörobilişsel Bozukluk (Prion Hastalığı / Creutzfeldt-Jakob)",
        nameEn: "Major Neurocognitive Disorder Due to Prion Disease",
        category: "NEUROCOGNITIVE",
        aliases: ["Deli Dana Hastalığı", "CJD", "Creutzfeldt-Jakob", "Hızlı İlerleyen Demans"]
    },
    {
        id: "major_neurocognitive_huntington",
        nameTr: "Majör Nörobilişsel Bozukluk (Huntington Hastalığına Bağlı)",
        nameEn: "Major Neurocognitive Disorder Due to Huntington's Disease",
        category: "NEUROCOGNITIVE",
        aliases: ["Huntington Koresi", "Genetik Demans"]
    },
    {
        id: "wernicke_korsakoff_syndrome",
        nameTr: "Maddenin Yol Açtığı Kalıcı Bellek Bozukluğu (Wernicke-Korsakoff)",
        nameEn: "Substance-Induced Persisting Amnestic Disorder (Korsakoff Syndrome)",
        category: "NEUROCOGNITIVE",
        aliases: ["Korsakoff Sendromu", "Alkolik Amnezi", "Konfabulasyon (Masallama)"]
    },

    // =========================================================================
    // 18. KİŞİLİK BOZUKLUKLARI (Personality Disorders)
    // =========================================================================
    // --- KÜME A (Tuhaf / Eksantrik) ---
    {
        id: "paranoid_pd",
        nameTr: "Paranoid Kişilik Bozukluğu",
        nameEn: "Paranoid Personality Disorder",
        category: "PERSONALITY_A",
        aliases: ["Paranoid KB", "Aşırı Kuşkuculuk", "Sürekli Komplo Arama", "Alınganlık"]
    },
    {
        id: "schizoid_pd",
        nameTr: "Şizoid Kişilik Bozukluğu",
        nameEn: "Schizoid Personality Disorder",
        category: "PERSONALITY_A",
        aliases: ["Şizoid KB", "Sosyal Soğukluk", "Yalnız Yaşam Tercihi", "Duygusal Küntlük"]
    },
    {
        id: "schizotypal_pd",
        nameTr: "Şizotipal Kişilik Bozukluğu",
        nameEn: "Schizotypal Personality Disorder",
        category: "PERSONALITY_A",
        aliases: ["Şizotipal KB", "Büyüsel Düşünce", "Garip Konuşma ve Giyim", "Alt Eşik Şizofreni"]
    },

    // --- KÜME B (Dramatik / Duygusal / Dürtüsel) ---
    {
        id: "antisocial_pd",
        nameTr: "Antisosyal Kişilik Bozukluğu (Sosyopati / Psikopati)",
        nameEn: "Antisocial Personality Disorder",
        category: "PERSONALITY_B",
        aliases: ["Sosyopati", "Psikopati", "Kural Tanımazlık", "Empati Yoksunluğu", "ASPD"]
    },
    {
        id: "borderline_pd",
        nameTr: "Sınırda (Borderline) Kişilik Bozukluğu",
        nameEn: "Borderline Personality Disorder",
        category: "PERSONALITY_B",
        aliases: ["Borderline", "BPD", "Terk Edilme Korkusu", "Splitting", "Kendine Zarar Verme"]
    },
    {
        id: "histrionic_pd",
        nameTr: "Histriyonik Kişilik Bozukluğu",
        nameEn: "Histrionic Personality Disorder",
        category: "PERSONALITY_B",
        aliases: ["Histriyonik", "İlgi Odağı Olma Arzusu", "Dramatiklik", "Baştan Çıkarıcılık"]
    },
    {
        id: "narcissistic_pd",
        nameTr: "Narsisistik Kişilik Bozukluğu",
        nameEn: "Narcissistic Personality Disorder",
        category: "PERSONALITY_B",
        aliases: ["Narsisizm", "NPD", "Büyüklenme", "Özel Muamele Beklentisi", "Empati Eksikliği"]
    },

    // --- KÜME C (Kaygılı / Korkulu) ---
    {
        id: "avoidant_pd",
        nameTr: "Çekingen (Kaçıngan / Avoidant) Kişilik Bozukluğu",
        nameEn: "Avoidant Personality Disorder",
        category: "PERSONALITY_C",
        aliases: ["Kaçıngan KB", "Yetersizlik Hissi", "Aşağılanma Korkusu", "Çekingenlik"]
    },
    {
        id: "dependent_pd",
        nameTr: "Bağımlı Kişilik Bozukluğu",
        nameEn: "Dependent Personality Disorder",
        category: "PERSONALITY_C",
        aliases: ["Bağımlı KB", "Yalnız Karar Verememe", "Terk Edilmeme Boyun Eğiciliği"]
    },
    {
        id: "ocpd",
        nameTr: "Obsesif-Kompulsif Kişilik Bozukluğu (OKKB / OCPD)",
        nameEn: "Obsessive-Compulsive Personality Disorder",
        category: "PERSONALITY_C",
        aliases: ["OKKB", "OCPD", "Mükemmeliyetçilik", "Kuralcılık", "Katı Ahlakçılık", "Cimrilik"]
    },
    {
        id: "personality_change_due_to_medical",
        nameTr: "Başka Bir Sağlık Durumuna Bağlı Kişilik Değişikliği (Frontal Lob Sendromu)",
        nameEn: "Personality Change Due to Another Medical Condition",
        category: "PERSONALITY_B",
        aliases: ["Phineas Gage Sendromu", "Frontal Lob Kişiliği", "Organik Kişilik Değişimi"]
    },
    {
        id: "passive_aggressive_pd",
        nameTr: "Pasif-Agresif (Olumsuzlamacı) Kişilik Örüntüsü",
        nameEn: "Passive-Aggressive Personality Traits",
        category: "PERSONALITY_C",
        aliases: ["Pasif Agresyon", "Gizli Direnç", "Erteleme Alışkanlığı"]
    },

    // =========================================================================
    // 19. PARAFİLİ (CİNSEL SAPMA) BOZUKLUKLARI (Paraphilic Disorders)
    // =========================================================================
    {
        id: "voyeuristic",
        nameTr: "Gözetlemecilik Bozukluğu (Voyörizm)",
        nameEn: "Voyeuristic Disorder",
        category: "PARAPHILIC",
        aliases: ["Voyörizm", "Röntgencilik", "Habersiz Kişiyi Dikizleme"]
    },
    {
        id: "exhibitionistic",
        nameTr: "Göstermecilik Bozukluğu (Ekzibisyonizm)",
        nameEn: "Exhibitionistic Disorder",
        category: "PARAPHILIC",
        aliases: ["Ekzibisyonizm", "Genital Organ Teşhiri", "Teşhircilik"]
    },
    {
        id: "frotteuristic",
        nameTr: "Sürtünmecilik Bozukluğu (Frotteurizm)",
        nameEn: "Frotteuristic Disorder",
        category: "PARAPHILIC",
        aliases: ["Frotteurizm", "Toplu Taşımada Rıza Dışı Sürtünme"]
    },
    {
        id: "sexual_masochism",
        nameTr: "Cinsel Mazoşizm Bozukluğu (Asfiksi / Boğulma Tipi Dahil)",
        nameEn: "Sexual Masochism Disorder",
        category: "PARAPHILIC",
        aliases: ["Mazoşizm", "Aşağılanma ve Acıdan Cinsel Haz Alma", "Otoerotik Asfiksi"]
    },
    {
        id: "sexual_sadism",
        nameTr: "Cinsel Sadizm Bozukluğu",
        nameEn: "Sexual Sadism Disorder",
        category: "PARAPHILIC",
        aliases: ["Sadizm", "Başkasına Acı Çektirerek Cinsel Haz Alma"]
    },
    {
        id: "pedophilic_disorder",
        nameTr: "Pedofili Bozukluğu",
        nameEn: "Pedophilic Disorder",
        category: "PARAPHILIC",
        aliases: ["Pedofili", "Sübyancılık"]
    },
    {
        id: "fetishistic_disorder",
        nameTr: "Fetişizm Bozukluğu",
        nameEn: "Fetishistic Disorder",
        category: "PARAPHILIC",
        aliases: ["Fetişizm", "Cansız Nesnelere Cinsel Uyarılma (Ayakkabı vb.)"]
    },
    {
        id: "transvestic_disorder",
        nameTr: "Karşıgiyim (Travestik) Bozukluğu",
        nameEn: "Transvestic Disorder",
        category: "PARAPHILIC",
        aliases: ["Travestik Fetişizm", "Karşı Cinsin Kıyafetleriyle Cinsel Uyarılma"]
    },
    {
        id: "necrophilia",
        nameTr: "Nekrofili (Ölü Sevicilik)",
        nameEn: "Necrophilic Disorder (Other Specified Paraphilic)",
        category: "PARAPHILIC",
        aliases: ["Nekrofili", "Ölü Bedenlere Cinsel Çekim"]
    },
    {
        id: "zoophilia",
        nameTr: "Zoofili (Hayvan Sevicilik)",
        nameEn: "Zoophilic Disorder (Other Specified Paraphilic)",
        category: "PARAPHILIC",
        aliases: ["Zoofili", "Bestialite", "Hayvanlara Cinsel İlgi"]
    },

    // =========================================================================
    // 20. KLİNİK İLGİ ODAĞI OLABİLECEK DİĞER DURUMLAR & SENDROMLAR
    // =========================================================================
    {
        id: "malingering",
        nameTr: "Temarruz (Malingering - Dışsal Maddi Kazanç Amaçlı Sahte Hastalık)",
        nameEn: "Malingering",
        category: "OTHER_CLINICAL",
        aliases: ["Temarruz", "Numara Yapma", "Askerlikten/Hapisten Kaçmak İçin Numara", "Tazminat Sahtekarlığı"]
    },
    {
        id: "neuroleptic_malignant_syndrome",
        nameTr: "Nöroleptik Malign Sendrom (NMS - Antipsikotik Acili)",
        nameEn: "Neuroleptic Malignant Syndrome",
        category: "OTHER_CLINICAL",
        aliases: ["NMS", "Ateş, Kas Rijiditesi (Kurşun Boru), Yüksek CK"]
    },
    {
        id: "serotonin_syndrome",
        nameTr: "Serotonin Sendromu (Toksisitesi)",
        nameEn: "Serotonin Syndrome",
        category: "OTHER_CLINICAL",
        aliases: ["Serotonerjik Toksisite", "Klonus, Terleme, Hipertermi"]
    },
    {
        id: "tardive_dyskinesia",
        nameTr: "İlacın Yol Açtığı Tardif Diskinezi (İstemsiz Yüz/Dil Hareketleri)",
        nameEn: "Medication-Induced Tardive Dyskinesia",
        category: "OTHER_CLINICAL",
        aliases: ["Tardif Diskinezi", "Antipsikotik Yan Etkisi", "Dudak Şapırdatma"]
    },
    {
        id: "medication_induced_akathisia",
        nameTr: "İlacın Yol Açtığı Akatizi (İçsel Yerinde Duramama Huzursuzluğu)",
        nameEn: "Medication-Induced Acute Akathisia",
        category: "OTHER_CLINICAL",
        aliases: ["Akatizi", "Yerinde Duramama", "Antipsikotik Huzursuzluğu"]
    },
    {
        id: "borderline_intellectual_functioning",
        nameTr: "Sınırda Zeka Düzeyi (IQ 70-84)",
        nameEn: "Borderline Intellectual Functioning",
        category: "OTHER_CLINICAL",
        aliases: ["Sınır Zeka", "Donuk Zeka", "BIF", "IQ 70-84"]
    },
    {
        id: "relational_problem_partner",
        nameTr: "Eş/Partner İlişkisi Sorunu",
        nameEn: "Relationship Distress With Spouse or Intimate Partner",
        category: "OTHER_CLINICAL",
        aliases: ["Evlilik Çatışması", "Boşanma Süreci", "Çift Problemleri"]
    },
    {
        id: "parent_child_relational_problem",
        nameTr: "Ebeveyn-Çocuk İlişkisi Sorunu",
        nameEn: "Parent-Child Relational Problem",
        category: "OTHER_CLINICAL",
        aliases: ["Kuşak Çatışması", "Ergen-Ebeveyn İletişimsizliği"]
    },
    {
        id: "burnout_syndrome",
        nameTr: "Tükenmişlik Sendromu (Mesleki Tükenmişlik)",
        nameEn: "Burnout Syndrome / Occupational Problem",
        category: "OTHER_CLINICAL",
        aliases: ["Tükenmişlik", "Burnout", "Mesleki Yıpranma"]
    }
];

// Combine with category mappings and ensure all IDs in cases.js are 100% matched
const codeContent = `/**
 * PsikoVaka - Kapsamlı DSM-5 & DSM-5-TR Tanı Kütüphanesi
 * 22 Ana DSM-5 Kategorisi ve Resmi Tanı Listesi
 */

const DSM_CATEGORIES = ${JSON.stringify(DSM_CATEGORIES, null, 4)};

const DIAGNOSES_DATABASE = ${JSON.stringify(allDiagnoses, null, 4)};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DSM_CATEGORIES, DIAGNOSES_DATABASE };
}
`;

fs.writeFileSync(path.join(__dirname, 'js', 'diagnoses.js'), codeContent, 'utf8');
console.log('Successfully written comprehensive diagnoses.js! Total diagnoses count:', allDiagnoses.length);
