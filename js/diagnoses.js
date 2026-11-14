/**
 * PsikoVaka - DSM-5 & DSM-5-TR Tam Kapsamlı 297 Tanı Kütüphanesi
 * 22 Ana Kategori ve Tüm Resmi DSM-5 Tanı Listesi
 */

const DSM_CATEGORIES = {
    "NEURODEV": {
        "id": "NEURODEV",
        "name": "Nörogelişimsel Bozukluklar",
        "icon": "🌱",
        "color": "#84cc16"
    },
    "PSYCHOTIC": {
        "id": "PSYCHOTIC",
        "name": "Şizofreni Açılımı ve Diğer Psikotik Bozukluklar",
        "icon": "🌀",
        "color": "#06b6d4"
    },
    "BIPOLAR": {
        "id": "BIPOLAR",
        "name": "Bipolar ve İlişkili Bozukluklar",
        "icon": "⚡",
        "color": "#f59e0b"
    },
    "MOOD": {
        "id": "MOOD",
        "name": "Depresif Bozukluklar",
        "icon": "🎭",
        "color": "#6366f1"
    },
    "ANXIETY": {
        "id": "ANXIETY",
        "name": "Anksiyete (Kaygı) Bozuklukları",
        "icon": "🌩️",
        "color": "#eab308"
    },
    "OCD_RELATED": {
        "id": "OCD_RELATED",
        "name": "Obsesif-Kompulsif ve İlişkili Bozukluklar",
        "icon": "🔄",
        "color": "#10b981"
    },
    "TRAUMA": {
        "id": "TRAUMA",
        "name": "Travma ve Stresörle İlişkili Bozukluklar",
        "icon": "⛈️",
        "color": "#64748b"
    },
    "DISSOCIATIVE": {
        "id": "DISSOCIATIVE",
        "name": "Dissosiyatif (Ayrışma) Bozukluklar",
        "icon": "🪞",
        "color": "#a855f7"
    },
    "SOMATIC": {
        "id": "SOMATIC",
        "name": "Bedensel Belirti (Somatik) ve İlişkili Bozukluklar",
        "icon": "🩺",
        "color": "#14b8a6"
    },
    "EATING": {
        "id": "EATING",
        "name": "Beslenme ve Yeme Bozuklukları",
        "icon": "⚖️",
        "color": "#f97316"
    },
    "ELIMINATION": {
        "id": "ELIMINATION",
        "name": "Dışa Atım Bozuklukları",
        "icon": "🚼",
        "color": "#3b82f6"
    },
    "SLEEP": {
        "id": "SLEEP",
        "name": "Uyku-Uyanıklık Bozuklukları",
        "icon": "🌙",
        "color": "#38bdf8"
    },
    "SEXUAL": {
        "id": "SEXUAL",
        "name": "Cinsel İşlev Bozuklukları",
        "icon": "❤️",
        "color": "#ec4899"
    },
    "GENDER": {
        "id": "GENDER",
        "name": "Cinsiyet Disforisi",
        "icon": "⚧️",
        "color": "#8b5cf6"
    },
    "IMPULSE": {
        "id": "IMPULSE",
        "name": "Yıkıcı Bozukluklar, Dürtü Denetimi ve Davranım",
        "icon": "💥",
        "color": "#e11d48"
    },
    "SUBSTANCE": {
        "id": "SUBSTANCE",
        "name": "Maddeyle İlişkili ve Bağımlılık Bozuklukları",
        "icon": "🧪",
        "color": "#d97706"
    },
    "NEUROCOGNITIVE": {
        "id": "NEUROCOGNITIVE",
        "name": "Nörobilişsel Bozukluklar (Demans & Deliryum)",
        "icon": "🧠",
        "color": "#0ea5e9"
    },
    "PERSONALITY_A": {
        "id": "PERSONALITY_A",
        "name": "Kişilik Bozuklukları (Küme A - Tuhaf/Eksantrik)",
        "icon": "🧩",
        "color": "#c084fc"
    },
    "PERSONALITY_B": {
        "id": "PERSONALITY_B",
        "name": "Kişilik Bozuklukları (Küme B - Dramatik/Dürtüsel)",
        "icon": "🔥",
        "color": "#ef4444"
    },
    "PERSONALITY_C": {
        "id": "PERSONALITY_C",
        "name": "Kişilik Bozuklukları (Küme C - Kaygılı/Korkulu)",
        "icon": "🛡️",
        "color": "#a78bfa"
    },
    "PARAPHILIC": {
        "id": "PARAPHILIC",
        "name": "Parafili (Cinsel Sapma) Bozuklukları",
        "icon": "🔞",
        "color": "#f43f5e"
    },
    "OTHER_CLINICAL": {
        "id": "OTHER_CLINICAL",
        "name": "Klinik İlgi Odağı Olabilecek Diğer Durumlar",
        "icon": "📑",
        "color": "#94a3b8"
    }
};

const DIAGNOSES_DATABASE = [
    {
        "id": "intellectual_disability_mild",
        "nameTr": "Zihinsel Yetiyitimi (Hafif Düzey)",
        "nameEn": "Intellectual Disability (Mild)",
        "category": "NEURODEV",
        "aliases": [
            "Hafif Zeka Geriliği",
            "IQ 50-69",
            "F70"
        ]
    },
    {
        "id": "intellectual_disability_moderate",
        "nameTr": "Zihinsel Yetiyitimi (Orta Düzey)",
        "nameEn": "Intellectual Disability (Moderate)",
        "category": "NEURODEV",
        "aliases": [
            "Orta Zeka Geriliği",
            "IQ 35-49",
            "F71"
        ]
    },
    {
        "id": "intellectual_disability_severe",
        "nameTr": "Zihinsel Yetiyitimi (Ağır Düzey)",
        "nameEn": "Intellectual Disability (Severe)",
        "category": "NEURODEV",
        "aliases": [
            "Ağır Zeka Geriliği",
            "IQ 20-34",
            "F72"
        ]
    },
    {
        "id": "intellectual_disability_profound",
        "nameTr": "Zihinsel Yetiyitimi (İleri Derecede Ağır)",
        "nameEn": "Intellectual Disability (Profound)",
        "category": "NEURODEV",
        "aliases": [
            "Çok Ağır Zeka Geriliği",
            "IQ < 20",
            "F73"
        ]
    },
    {
        "id": "global_developmental_delay",
        "nameTr": "Küresel Gelişimsel Gecikme",
        "nameEn": "Global Developmental Delay",
        "category": "NEURODEV",
        "aliases": [
            "Genel Gelişim Geriliği",
            "GDD",
            "F88"
        ]
    },
    {
        "id": "unspecified_intellectual_disability",
        "nameTr": "Belirtilmemiş Zihinsel Yetiyitimi",
        "nameEn": "Unspecified Intellectual Disability",
        "category": "NEURODEV",
        "aliases": [
            "F79"
        ]
    },
    {
        "id": "language_disorder",
        "nameTr": "Dil Bozukluğu",
        "nameEn": "Language Disorder",
        "category": "NEURODEV",
        "aliases": [
            "Gelişimsel Dil Bozukluğu",
            "Ekspresif Dil Bozukluğu",
            "F80.9"
        ]
    },
    {
        "id": "speech_sound_disorder",
        "nameTr": "Konuşma Sesi Bozukluğu (Fonolojik Bozukluk)",
        "nameEn": "Speech Sound Disorder",
        "category": "NEURODEV",
        "aliases": [
            "Fonolojik Bozukluk",
            "Artikülasyon Bozukluğu",
            "F80.0"
        ]
    },
    {
        "id": "childhood_fluency_disorder",
        "nameTr": "Çocuklukta Başlayan Akıcılık Bozukluğu (Kekemelik)",
        "nameEn": "Childhood-Onset Fluency Disorder (Stuttering)",
        "category": "NEURODEV",
        "aliases": [
            "Kekemelik",
            "Stuttering",
            "F80.81"
        ]
    },
    {
        "id": "social_communication_disorder",
        "nameTr": "Toplumsal (Pragmatik) İletişim Bozukluğu",
        "nameEn": "Social (Pragmatic) Communication Disorder",
        "category": "NEURODEV",
        "aliases": [
            "Pragmatik Dil Bozukluğu",
            "SPCD",
            "F80.89"
        ]
    },
    {
        "id": "unspecified_communication_disorder",
        "nameTr": "Belirtilmemiş İletişim Bozukluğu",
        "nameEn": "Unspecified Communication Disorder",
        "category": "NEURODEV",
        "aliases": [
            "F80.9"
        ]
    },
    {
        "id": "asd",
        "nameTr": "Otizm Spektrum Bozukluğu",
        "nameEn": "Autism Spectrum Disorder",
        "category": "NEURODEV",
        "aliases": [
            "Otizm",
            "ASD",
            "Asperger Sendromu",
            "Atipik Otizm",
            "F84.0"
        ]
    },
    {
        "id": "adhd",
        "nameTr": "Dikkat Eksikliği ve Hiperaktivite Bozukluğu (DEHB - Bileşik Görünüm)",
        "nameEn": "Attention-Deficit/Hyperactivity Disorder (ADHD Combined)",
        "category": "NEURODEV",
        "aliases": [
            "DEHB",
            "ADHD",
            "Hiperaktivite",
            "Dikkat Eksikliği",
            "F90.2"
        ]
    },
    {
        "id": "adhd_inattentive",
        "nameTr": "DEHB (Dikkatsizliğin Baskın Olduğu Görünüm)",
        "nameEn": "ADHD (Predominantly Inattentive Presentation)",
        "category": "NEURODEV",
        "aliases": [
            "ADD",
            "Dikkat Dağınıklığı",
            "F90.0"
        ]
    },
    {
        "id": "adhd_hyperactive",
        "nameTr": "DEHB (Aşırı Hareketlilik/Dürtüsellik Baskın Görünüm)",
        "nameEn": "ADHD (Predominantly Hyperactive/Impulsive Presentation)",
        "category": "NEURODEV",
        "aliases": [
            "Hiperaktivite Baskın Tip",
            "F90.1"
        ]
    },
    {
        "id": "specific_learning_dyslexia",
        "nameTr": "Özgül Öğrenme Bozukluğu (Okuma Bozukluğu / Disleksi)",
        "nameEn": "Specific Learning Disorder with Impairment in Reading (Dyslexia)",
        "category": "NEURODEV",
        "aliases": [
            "Disleksi",
            "Okuma Güçlüğü",
            "Dyslexia",
            "F81.0"
        ]
    },
    {
        "id": "specific_learning_dysgraphia",
        "nameTr": "Özgül Öğrenme Bozukluğu (Yazılı Anlatım Bozukluğu / Disgrafi)",
        "nameEn": "Specific Learning Disorder with Impairment in Written Expression",
        "category": "NEURODEV",
        "aliases": [
            "Disgrafi",
            "Yazma Güçlüğü",
            "Dysgraphia",
            "F81.81"
        ]
    },
    {
        "id": "specific_learning_dyscalculia",
        "nameTr": "Özgül Öğrenme Bozukluğu (Matematik Bozukluğu / Diskalkuli)",
        "nameEn": "Specific Learning Disorder with Impairment in Mathematics (Dyscalculia)",
        "category": "NEURODEV",
        "aliases": [
            "Diskalkuli",
            "Aritmetik Güçlüğü",
            "Dyscalculia",
            "F81.2"
        ]
    },
    {
        "id": "developmental_coordination_disorder",
        "nameTr": "Gelişimsel Eşgüdüm (Koordinasyon) Bozukluğu",
        "nameEn": "Developmental Coordination Disorder",
        "category": "NEURODEV",
        "aliases": [
            "Dispraksi",
            "Motor Beceriksizlik",
            "F82"
        ]
    },
    {
        "id": "stereotypic_movement_disorder",
        "nameTr": "Stereotipik Hareket Bozukluğu",
        "nameEn": "Stereotypic Movement Disorder",
        "category": "NEURODEV",
        "aliases": [
            "Stereotipi",
            "Kalıpyargısal Hareket",
            "F98.4"
        ]
    },
    {
        "id": "tourette",
        "nameTr": "Tourette Bozukluğu",
        "nameEn": "Tourette's Disorder",
        "category": "NEURODEV",
        "aliases": [
            "Tourette Sendromu",
            "Motor ve Vokal Tik",
            "F95.2"
        ]
    },
    {
        "id": "chronic_motor_vocal_tic",
        "nameTr": "Süregen (Kronik) Motor ya da Vokal Tik Bozukluğu",
        "nameEn": "Persistent (Chronic) Motor or Vocal Tic Disorder",
        "category": "NEURODEV",
        "aliases": [
            "Kronik Tik Bozukluğu",
            "F95.1"
        ]
    },
    {
        "id": "provisional_tic_disorder",
        "nameTr": "Geçici Tik Bozukluğu",
        "nameEn": "Provisional Tic Disorder",
        "category": "NEURODEV",
        "aliases": [
            "Geçici Tik",
            "F95.0"
        ]
    },
    {
        "id": "other_specified_neurodevelopmental",
        "nameTr": "Belirlenmiş Diğer Bir Nörogelişimsel Bozukluk (FAS Dahil)",
        "nameEn": "Other Specified Neurodevelopmental Disorder",
        "category": "NEURODEV",
        "aliases": [
            "Fetal Alkol Sendromu",
            "F88"
        ]
    },
    {
        "id": "schizotypal_pd",
        "nameTr": "Şizotipal Kişilik Bozukluğu",
        "nameEn": "Schizotypal Personality Disorder",
        "category": "PSYCHOTIC",
        "aliases": [
            "Şizotipal Bozukluk",
            "Büyüsel Düşünce",
            "F21"
        ]
    },
    {
        "id": "delusional_disorder",
        "nameTr": "Sanrılı Bozukluk (Hezeyanlı Bozukluk)",
        "nameEn": "Delusional Disorder",
        "category": "PSYCHOTIC",
        "aliases": [
            "Paranoya",
            "Hezeyanlı Bozukluk",
            "Sanrı",
            "F22"
        ]
    },
    {
        "id": "delusional_erotomanic",
        "nameTr": "Sanrılı Bozukluk (Erotomanik Tip / Clérambault)",
        "nameEn": "Delusional Disorder (Erotomanic Type)",
        "category": "PSYCHOTIC",
        "aliases": [
            "Erotomani",
            "Clerambault Sendromu",
            "Aşk Sanrısı",
            "F22"
        ]
    },
    {
        "id": "delusional_grandiose",
        "nameTr": "Sanrılı Bozukluk (Büyüklük / Grandiyöz Tip)",
        "nameEn": "Delusional Disorder (Grandiose Type)",
        "category": "PSYCHOTIC",
        "aliases": [
            "Megaloman Sanrı",
            "Peygamberlik/Zenginlik Sanrısı",
            "F22"
        ]
    },
    {
        "id": "delusional_jealous",
        "nameTr": "Sanrılı Bozukluk (Kıskançlık Tipi / Othello)",
        "nameEn": "Delusional Disorder (Jealous Type)",
        "category": "PSYCHOTIC",
        "aliases": [
            "Othello Sendromu",
            "Aldatılma Hezeyanı",
            "Patolojik Kıskançlık",
            "F22"
        ]
    },
    {
        "id": "delusional_persecutory",
        "nameTr": "Sanrılı Bozukluk (Kötülük Görme / Persekütuar Tip)",
        "nameEn": "Delusional Disorder (Persecutory Type)",
        "category": "PSYCHOTIC",
        "aliases": [
            "Takip Edilme Sanrısı",
            "Perseküsyon Hezeyanı",
            "F22"
        ]
    },
    {
        "id": "delusional_somatic",
        "nameTr": "Sanrılı Bozukluk (Somatik Tip / Ekbom Sendromu)",
        "nameEn": "Delusional Disorder (Somatic Type)",
        "category": "PSYCHOTIC",
        "aliases": [
            "Ekbom Sendromu",
            "Deri Altı Parazit Sanrısı",
            "F22"
        ]
    },
    {
        "id": "delusional_mixed",
        "nameTr": "Sanrılı Bozukluk (Karışık Tip)",
        "nameEn": "Delusional Disorder (Mixed Type)",
        "category": "PSYCHOTIC",
        "aliases": [
            "Karışık Sanrı",
            "F22"
        ]
    },
    {
        "id": "brief_psychotic",
        "nameTr": "Kısa Psikotik Bozukluk",
        "nameEn": "Brief Psychotic Disorder",
        "category": "PSYCHOTIC",
        "aliases": [
            "Akut Psikoz",
            "Reaktif Psikoz",
            "1 Aydan Kısa Psikoz",
            "F23"
        ]
    },
    {
        "id": "schizophreniform",
        "nameTr": "Şizofreniform Bozukluk",
        "nameEn": "Schizophreniform Disorder",
        "category": "PSYCHOTIC",
        "aliases": [
            "1-6 Ay Arası Şizofreni",
            "Geçici Şizofreni",
            "F20.81"
        ]
    },
    {
        "id": "schizophrenia",
        "nameTr": "Şizofreni",
        "nameEn": "Schizophrenia",
        "category": "PSYCHOTIC",
        "aliases": [
            "Dementia Praecox",
            "Kronik Psikoz",
            "Paranoid Şizofreni",
            "F20.9"
        ]
    },
    {
        "id": "schizoaffective",
        "nameTr": "Şizoaffektif Bozukluk",
        "nameEn": "Schizoaffective Disorder",
        "category": "PSYCHOTIC",
        "aliases": [
            "Şizoafektif Bozukluk",
            "F25.9"
        ]
    },
    {
        "id": "schizoaffective_bipolar",
        "nameTr": "Şizoaffektif Bozukluk (Bipolar Tip)",
        "nameEn": "Schizoaffective Disorder (Bipolar Type)",
        "category": "PSYCHOTIC",
        "aliases": [
            "Şizoaffektif Mani",
            "F25.0"
        ]
    },
    {
        "id": "schizoaffective_depressive",
        "nameTr": "Şizoaffektif Bozukluk (Depresif Tip)",
        "nameEn": "Schizoaffective Disorder (Depressive Type)",
        "category": "PSYCHOTIC",
        "aliases": [
            "Şizoaffektif Depresyon",
            "F25.1"
        ]
    },
    {
        "id": "substance_induced_psychotic",
        "nameTr": "Maddenin/İlacın Yol Açtığı Psikotik Bozukluk",
        "nameEn": "Substance/Medication-Induced Psychotic Disorder",
        "category": "PSYCHOTIC",
        "aliases": [
            "Maddeye Bağlı Psikoz",
            "Esrar/Met Psikozu",
            "F19.959"
        ]
    },
    {
        "id": "psychotic_due_to_medical",
        "nameTr": "Başka Bir Sağlık Durumuna Bağlı Psikotik Bozukluk",
        "nameEn": "Psychotic Disorder Due to Another Medical Condition",
        "category": "PSYCHOTIC",
        "aliases": [
            "Organik Psikoz",
            "Tümöre Bağlı Psikoz",
            "F06.2"
        ]
    },
    {
        "id": "catatonia_associated",
        "nameTr": "Başka Bir Ruhsal Bozuklukla İlişkili Katatoni",
        "nameEn": "Catatonia Associated with Another Mental Disorder",
        "category": "PSYCHOTIC",
        "aliases": [
            "Katatoni",
            "Katalepsi",
            "Balmumu Esnekliği",
            "F06.1"
        ]
    },
    {
        "id": "catatonia_medical",
        "nameTr": "Başka Bir Sağlık Durumuna Bağlı Katatoni",
        "nameEn": "Catatonic Disorder Due to Another Medical Condition",
        "category": "PSYCHOTIC",
        "aliases": [
            "Organik Katatoni",
            "F06.1"
        ]
    },
    {
        "id": "attenuated_psychosis_syndrome",
        "nameTr": "Hafifletilmiş Psikoz Sendromu (Prodromal Psikoz)",
        "nameEn": "Attenuated Psychosis Syndrome",
        "category": "PSYCHOTIC",
        "aliases": [
            "Psikoz Riski",
            "Prodrom"
        ]
    },
    {
        "id": "folie_a_deux",
        "nameTr": "Paylaşılmış Psikotik Bozukluk (Folie à Deux)",
        "nameEn": "Shared Psychotic Disorder (Folie à Deux)",
        "category": "PSYCHOTIC",
        "aliases": [
            "İkili Delilik",
            "Paylaşılmış Sanrı",
            "F24"
        ]
    },
    {
        "id": "capgras_syndrome",
        "nameTr": "Capgras Sanrısı (Dublör / Değiştirilme Hezeyanı)",
        "nameEn": "Capgras Delusion / Misidentification",
        "category": "PSYCHOTIC",
        "aliases": [
            "Capgras Sendromu",
            "Sahtesiyle Değiştirilme"
        ]
    },
    {
        "id": "cotard_syndrome",
        "nameTr": "Cotard Sendromu (Yürüyen Ceset / Nihilistik Sanrı)",
        "nameEn": "Cotard's Syndrome (Walking Corpse Delusion)",
        "category": "PSYCHOTIC",
        "aliases": [
            "Cotard Sanrısı",
            "Ölü Olduğu Hezeyanı"
        ]
    },
    {
        "id": "bipolar_1",
        "nameTr": "Bipolar I Bozukluğu (Manik Epizodlu)",
        "nameEn": "Bipolar I Disorder",
        "category": "BIPOLAR",
        "aliases": [
            "Bipolar 1",
            "Mani",
            "Manik Depresif",
            "F31.9"
        ]
    },
    {
        "id": "bipolar_1_depressed",
        "nameTr": "Bipolar I Bozukluğu (Şu Anki Epizod Depresif)",
        "nameEn": "Bipolar I Disorder, Current Episode Depressed",
        "category": "BIPOLAR",
        "aliases": [
            "Bipolar Depresyon",
            "F31.3"
        ]
    },
    {
        "id": "bipolar_1_mixed",
        "nameTr": "Bipolar I Bozukluğu (Karışık Özellikli)",
        "nameEn": "Bipolar I Disorder with Mixed Features",
        "category": "BIPOLAR",
        "aliases": [
            "Karışık Mani",
            "Disforik Mani",
            "F31.6"
        ]
    },
    {
        "id": "bipolar_1_rapid_cycling",
        "nameTr": "Bipolar I Bozukluğu (Hızlı Döngülü Tip / Rapid Cycling)",
        "nameEn": "Bipolar I Disorder with Rapid Cycling",
        "category": "BIPOLAR",
        "aliases": [
            "Hızlı Döngülü Bipolar",
            "Yılda 4+ Epizod"
        ]
    },
    {
        "id": "bipolar_2",
        "nameTr": "Bipolar II Bozukluğu (Hipomani ve Majör Depresyon)",
        "nameEn": "Bipolar II Disorder",
        "category": "BIPOLAR",
        "aliases": [
            "Bipolar 2",
            "Hipomanik Bipolar",
            "F31.81"
        ]
    },
    {
        "id": "cyclothymia",
        "nameTr": "Siklotimik Bozukluk (Siklotimi)",
        "nameEn": "Cyclothymic Disorder",
        "category": "BIPOLAR",
        "aliases": [
            "Siklotimi",
            "Dalgalı Duygudurum",
            "F34.0"
        ]
    },
    {
        "id": "substance_induced_bipolar",
        "nameTr": "Maddenin/İlacın Yol Açtığı Bipolar Bozukluk",
        "nameEn": "Substance/Medication-Induced Bipolar Disorder",
        "category": "BIPOLAR",
        "aliases": [
            "Maddeye Bağlı Mani",
            "Kortizon Manisi",
            "Antidepresan Manisi"
        ]
    },
    {
        "id": "bipolar_due_to_medical",
        "nameTr": "Başka Bir Sağlık Durumuna Bağlı Bipolar Bozukluk",
        "nameEn": "Bipolar Disorder Due to Another Medical Condition",
        "category": "BIPOLAR",
        "aliases": [
            "Organik Bipolar",
            "Hipertiroidi Manisi",
            "F06.3"
        ]
    },
    {
        "id": "other_specified_bipolar",
        "nameTr": "Belirlenmiş Diğer Bir Bipolar ve İlişkili Bozukluk",
        "nameEn": "Other Specified Bipolar Disorder",
        "category": "BIPOLAR",
        "aliases": [
            "Kısa Süreli Hipomani",
            "F31.89"
        ]
    },
    {
        "id": "unspecified_bipolar",
        "nameTr": "Belirtilmemiş Bipolar ve İlişkili Bozukluk",
        "nameEn": "Unspecified Bipolar Disorder",
        "category": "BIPOLAR",
        "aliases": [
            "F31.9"
        ]
    },
    {
        "id": "mdd",
        "nameTr": "Majör Depresif Bozukluk (Tek Epizod)",
        "nameEn": "Major Depressive Disorder (Single Episode)",
        "category": "MOOD",
        "aliases": [
            "Depresyon",
            "Klinik Depresyon",
            "Tek Atak Depresyon",
            "F32.9"
        ]
    },
    {
        "id": "mdd_recurrent",
        "nameTr": "Majör Depresif Bozukluk (Yineleyici / Tekrarlayan)",
        "nameEn": "Major Depressive Disorder (Recurrent)",
        "category": "MOOD",
        "aliases": [
            "Tekrarlayan Depresyon",
            "Kronik Depresyon",
            "F33.9"
        ]
    },
    {
        "id": "mdd_with_psychotic",
        "nameTr": "Psikotik Özellikli Majör Depresif Bozukluk",
        "nameEn": "Major Depressive Disorder with Psychotic Features",
        "category": "MOOD",
        "aliases": [
            "Psikotik Depresyon",
            "Hezeyanlı Depresyon",
            "F32.3"
        ]
    },
    {
        "id": "mdd_with_peripartum",
        "nameTr": "Peripartum (Doğum Sonrası / Postpartum) Başlangıçlı Depresyon",
        "nameEn": "Major Depressive Disorder with Peripartum Onset",
        "category": "MOOD",
        "aliases": [
            "Postpartum Depresyon",
            "Lohusalık Depresyonu",
            "F53.0"
        ]
    },
    {
        "id": "mdd_with_seasonal",
        "nameTr": "Mevsimsel Özellik Gösteren Majör Depresyon (Kış Depresyonu)",
        "nameEn": "Major Depressive Disorder with Seasonal Pattern",
        "category": "MOOD",
        "aliases": [
            "Mevsimsel Depresyon",
            "SAD",
            "Kış Depresyonu"
        ]
    },
    {
        "id": "mdd_with_atypical",
        "nameTr": "Atipik Özellikli Majör Depresif Bozukluk",
        "nameEn": "Major Depressive Disorder with Atypical Features",
        "category": "MOOD",
        "aliases": [
            "Atipik Depresyon",
            "Kurşun Felci",
            "Aşırı Uyku ve İştah"
        ]
    },
    {
        "id": "mdd_with_melancholic",
        "nameTr": "Melankolik Özellikli Majör Depresif Bozukluk",
        "nameEn": "Major Depressive Disorder with Melancholic Features",
        "category": "MOOD",
        "aliases": [
            "Melankoli",
            "Melankolik Depresyon",
            "Sabah Erken Uyanma"
        ]
    },
    {
        "id": "dysthymia",
        "nameTr": "Kalıcı Depresif Bozukluk (Distimi)",
        "nameEn": "Persistent Depressive Disorder (Dysthymia)",
        "category": "MOOD",
        "aliases": [
            "Distimi",
            "Kronik Hafif Depresyon",
            "Dysthymia",
            "F34.1"
        ]
    },
    {
        "id": "dmdd",
        "nameTr": "Yıkıcı Duygudurumu Düzenleyememe Bozukluğu (DMDD)",
        "nameEn": "Disruptive Mood Dysregulation Disorder",
        "category": "MOOD",
        "aliases": [
            "DMDD",
            "Çocuklukta Öfke Nöbetleri",
            "F34.81"
        ]
    },
    {
        "id": "pmdd",
        "nameTr": "Premenstrüel Disforik Bozukluk (PMDD)",
        "nameEn": "Premenstrual Dysphoric Disorder",
        "category": "MOOD",
        "aliases": [
            "PMDD",
            "Adet Öncesi Disfori",
            "Şiddetli PMS",
            "N94.3"
        ]
    },
    {
        "id": "substance_induced_depressive",
        "nameTr": "Maddenin/İlacın Yol Açtığı Depresif Bozukluk",
        "nameEn": "Substance/Medication-Induced Depressive Disorder",
        "category": "MOOD",
        "aliases": [
            "Maddeye Bağlı Depresyon",
            "Alkol Çöküşü Depresyonu"
        ]
    },
    {
        "id": "depressive_due_to_medical",
        "nameTr": "Başka Bir Sağlık Durumuna Bağlı Depresif Bozukluk",
        "nameEn": "Depressive Disorder Due to Another Medical Condition",
        "category": "MOOD",
        "aliases": [
            "Organik Depresyon",
            "Hipotiroidi Depresyonu",
            "F06.32"
        ]
    },
    {
        "id": "recurrent_brief_depression",
        "nameTr": "Yineleyen Kısa Depresif Bozukluk",
        "nameEn": "Recurrent Brief Depression",
        "category": "MOOD",
        "aliases": [
            "Aylık Kısa Depresyon Atakları",
            "F38.1"
        ]
    },
    {
        "id": "short_duration_depressive",
        "nameTr": "Kısa Süreli Depresif Epizod (4-13 Gün)",
        "nameEn": "Short-Duration Depressive Episode",
        "category": "MOOD",
        "aliases": [
            "Kısa Süreli Depresyon"
        ]
    },
    {
        "id": "gad",
        "nameTr": "Yaygın Anksiyete Bozukluğu (YAB)",
        "nameEn": "Generalized Anxiety Disorder",
        "category": "ANXIETY",
        "aliases": [
            "YAB",
            "GAD",
            "Genel Kaygı Bozukluğu",
            "Kronik Evham",
            "F41.1"
        ]
    },
    {
        "id": "panic_disorder",
        "nameTr": "Panik Bozukluk",
        "nameEn": "Panic Disorder",
        "category": "ANXIETY",
        "aliases": [
            "Panik Atak",
            "Panik",
            "Beklenti Kaygısı",
            "F41.0"
        ]
    },
    {
        "id": "agoraphobia",
        "nameTr": "Agorafobi",
        "nameEn": "Agoraphobia",
        "category": "ANXIETY",
        "aliases": [
            "Açık Alan Korkusu",
            "Eve Kapanma",
            "Kaçışın Zor Olduğu Ortam Korkusu",
            "F40.00"
        ]
    },
    {
        "id": "social_anxiety",
        "nameTr": "Toplumsal Kaygı Bozukluğu (Sosyal Anksiyete / Sosyal Fobi)",
        "nameEn": "Social Anxiety Disorder (Social Phobia)",
        "category": "ANXIETY",
        "aliases": [
            "Sosyal Fobi",
            "Rezil Olma Korkusu",
            "Topluluk Önünde Konuşma Korkusu",
            "F40.10"
        ]
    },
    {
        "id": "social_anxiety_performance",
        "nameTr": "Sosyal Anksiyete Bozukluğu (Yalnızca Performans Tipi)",
        "nameEn": "Social Anxiety Disorder (Performance Only)",
        "category": "ANXIETY",
        "aliases": [
            "Sahne Korkusu",
            "Performans Kaygısı"
        ]
    },
    {
        "id": "specific_phobia",
        "nameTr": "Özgül Fobi",
        "nameEn": "Specific Phobia",
        "category": "ANXIETY",
        "aliases": [
            "Fobi",
            "Korku",
            "F40.298"
        ]
    },
    {
        "id": "specific_phobia_animal",
        "nameTr": "Özgül Fobi (Hayvan Tipi: Örümcek, Yılan, Köpek)",
        "nameEn": "Specific Phobia (Animal Type)",
        "category": "ANXIETY",
        "aliases": [
            "Araknofobi",
            "Kinofobi",
            "Ofidiyofobi",
            "F40.218"
        ]
    },
    {
        "id": "specific_phobia_natural",
        "nameTr": "Özgül Fobi (Doğal Çevre Tipi: Yükseklik, Fırtına, Su)",
        "nameEn": "Specific Phobia (Natural Environment Type)",
        "category": "ANXIETY",
        "aliases": [
            "Akrofobi",
            "Yükseklik Korkusu",
            "Hidrofobi",
            "F40.228"
        ]
    },
    {
        "id": "specific_phobia_blood",
        "nameTr": "Özgül Fobi (Kan-Enjeksiyon-Yara Tipi / Vazovagal)",
        "nameEn": "Specific Phobia (Blood-Injection-Injury Type)",
        "category": "ANXIETY",
        "aliases": [
            "Kan Fobisi",
            "İğne Fobisi",
            "Vazovagal Bayılma Fobisi",
            "F40.230"
        ]
    },
    {
        "id": "specific_phobia_situational",
        "nameTr": "Özgül Fobi (Durumsal Tip: Klostrofobi, Uçak, Asansör)",
        "nameEn": "Specific Phobia (Situational Type)",
        "category": "ANXIETY",
        "aliases": [
            "Klostrofobi",
            "Uçak Korkusu",
            "Asansör Fobisi",
            "F40.248"
        ]
    },
    {
        "id": "specific_phobia_emetophobia",
        "nameTr": "Özgül Fobi (Kusma Korkusu / Emetofobi)",
        "nameEn": "Specific Phobia (Emetophobia)",
        "category": "ANXIETY",
        "aliases": [
            "Emetofobi",
            "Kusma Fobisi"
        ]
    },
    {
        "id": "specific_phobia_phagophobia",
        "nameTr": "Özgül Fobi (Boğulma/Yutma Korkusu / Fagofobi)",
        "nameEn": "Specific Phobia (Phagophobia)",
        "category": "ANXIETY",
        "aliases": [
            "Fagofobi",
            "Yutkunamama Korkusu"
        ]
    },
    {
        "id": "separation_anxiety",
        "nameTr": "Ayrılma Kaygısı Bozukluğu",
        "nameEn": "Separation Anxiety Disorder",
        "category": "ANXIETY",
        "aliases": [
            "Ayrılık Anksiyetesi",
            "F93.0"
        ]
    },
    {
        "id": "selective_mutism",
        "nameTr": "Seçici Konuşmazlık (Selektif Mutizm)",
        "nameEn": "Selective Mutism",
        "category": "ANXIETY",
        "aliases": [
            "Selektif Mutizm",
            "Okulda Sessizlik",
            "F94.0"
        ]
    },
    {
        "id": "substance_induced_anxiety",
        "nameTr": "Maddenin/İlacın Yol Açtığı Anksiyete Bozukluğu",
        "nameEn": "Substance/Medication-Induced Anxiety Disorder",
        "category": "ANXIETY",
        "aliases": [
            "Maddeye Bağlı Kaygı",
            "Kafein Anksiyetesi"
        ]
    },
    {
        "id": "anxiety_due_to_medical",
        "nameTr": "Başka Bir Sağlık Durumuna Bağlı Anksiyete Bozukluğu",
        "nameEn": "Anxiety Disorder Due to Another Medical Condition",
        "category": "ANXIETY",
        "aliases": [
            "Feokromositoma Kaygısı",
            "Hipertiroidi Anksiyetesi",
            "F06.4"
        ]
    },
    {
        "id": "ataque_de_nervios",
        "nameTr": "Kültüre Özgü Anksiyete Sendromu (Ataque de Nervios)",
        "nameEn": "Ataque de Nervios",
        "category": "ANXIETY",
        "aliases": [
            "Sinir Krizi Sendromu"
        ]
    },
    {
        "id": "taijin_kyofusho",
        "nameTr": "Taijin Kyofusho (Başkalarını Rahatsız Etme / Bakış Fobisi)",
        "nameEn": "Taijin Kyofusho",
        "category": "ANXIETY",
        "aliases": [
            "Bakış Fobisi",
            "Japonya Kültürel Fobisi"
        ]
    },
    {
        "id": "ocd",
        "nameTr": "Obsesif-Kompulsif Bozukluk (OKB)",
        "nameEn": "Obsessive-Compulsive Disorder (OCD)",
        "category": "OCD_RELATED",
        "aliases": [
            "OKB",
            "OCD",
            "Takıntı Hastalığı",
            "Saplantı ve Zorlantı",
            "F42"
        ]
    },
    {
        "id": "ocd_contamination",
        "nameTr": "OKB (Bulaşma Obsesyonu ve Temizlik Kompulsiyonu)",
        "nameEn": "OCD (Contamination/Cleaning)",
        "category": "OCD_RELATED",
        "aliases": [
            "Temizlik Takıntısı",
            "Mikrop Obsesyonu",
            "El Yıkama"
        ]
    },
    {
        "id": "ocd_checking",
        "nameTr": "OKB (Kuşku Obsesyonu ve Kontrol Kompulsiyonu)",
        "nameEn": "OCD (Doubt/Checking)",
        "category": "OCD_RELATED",
        "aliases": [
            "Kontrol Takıntısı",
            "Kapı/Ocak Kontrolü"
        ]
    },
    {
        "id": "ocd_symmetry",
        "nameTr": "OKB (Simetri, Düzen ve Sayma Kompulsiyonları)",
        "nameEn": "OCD (Symmetry/Ordering)",
        "category": "OCD_RELATED",
        "aliases": [
            "Simetri Takıntısı",
            "Düzenleme Kompulsiyonu"
        ]
    },
    {
        "id": "ocd_taboo_thoughts",
        "nameTr": "OKB (Tabu Düşünceler: Dini Vesvese / Cinsel / Saldırganlık)",
        "nameEn": "OCD (Taboo / Intrusive Thoughts)",
        "category": "OCD_RELATED",
        "aliases": [
            "Dini Vesvese",
            "Kötü Düşünce Takıntısı",
            "Zarar Verme Korkusu"
        ]
    },
    {
        "id": "rocd",
        "nameTr": "İlişki Odaklı OKB (Relationship OCD / ROCD)",
        "nameEn": "Relationship Obsessive-Compulsive Disorder (ROCD)",
        "category": "OCD_RELATED",
        "aliases": [
            "ROCD",
            "Partnerine Aşkından Sürekli Şüphe Etme"
        ]
    },
    {
        "id": "bdd",
        "nameTr": "Beden Algısı Bozukluğu (Vücut Dismorfik Bozukluğu / BDD)",
        "nameEn": "Body Dysmorphic Disorder (BDD)",
        "category": "OCD_RELATED",
        "aliases": [
            "Dismorfofobi",
            "BDD",
            "Kusur Takıntısı",
            "Estetik Takıntısı",
            "F45.22"
        ]
    },
    {
        "id": "muscle_dysmorphia",
        "nameTr": "Beden Algısı Bozukluğu (Kas Dismorfisi / Bigoreksiya)",
        "nameEn": "Muscle Dysmorphia (Bigorexia)",
        "category": "OCD_RELATED",
        "aliases": [
            "Bigoreksiya",
            "Kas Yetersizliği Takıntısı",
            "Ters Anoreksiya"
        ]
    },
    {
        "id": "hoarding_disorder",
        "nameTr": "Biriktiricilik Bozukluğu (İstifçilik / Hoarding)",
        "nameEn": "Hoarding Disorder",
        "category": "OCD_RELATED",
        "aliases": [
            "İstifçilik",
            "Kompulsif Biriktirme",
            "Çöp Ev",
            "F42.3"
        ]
    },
    {
        "id": "trichotillomania",
        "nameTr": "Trikotillomani (Saç / Kıl Yolma Bozukluğu)",
        "nameEn": "Trichotillomania (Hair-Pulling Disorder)",
        "category": "OCD_RELATED",
        "aliases": [
            "Saç Yolma",
            "Kıl Koparma",
            "F63.3"
        ]
    },
    {
        "id": "excoriation",
        "nameTr": "Deri Yolma Bozukluğu (Ekskoriyasyon)",
        "nameEn": "Excoriation (Skin-Picking) Disorder",
        "category": "OCD_RELATED",
        "aliases": [
            "Deri Yolma",
            "Dermatilomani",
            "Cilt Koparma",
            "L98.1"
        ]
    },
    {
        "id": "olfactory_reference",
        "nameTr": "Koku Referans Bozukluğu (Olfactory Reference Disorder)",
        "nameEn": "Olfactory Reference Disorder",
        "category": "OCD_RELATED",
        "aliases": [
            "Kötü Koku Takıntısı",
            "Vücut Kokusu Referansı",
            "ORBD",
            "F22"
        ]
    },
    {
        "id": "body_focused_repetitive",
        "nameTr": "Beden Odaklı Yineleyici Davranış Bozukluğu (Tırnak Yeme vb.)",
        "nameEn": "Body-Focused Repetitive Behavior Disorder",
        "category": "OCD_RELATED",
        "aliases": [
            "Onikofaji",
            "Tırnak Yeme",
            "Dudak Isırma",
            "F42.8"
        ]
    },
    {
        "id": "pandas_syndrome",
        "nameTr": "PANDAS / PANS (Pediatrik Otoimmün Nöropsikiyatrik OKB)",
        "nameEn": "PANDAS (Pediatric Autoimmune Neuropsychiatric Disorder Associated with Strep)",
        "category": "OCD_RELATED",
        "aliases": [
            "PANDAS",
            "PANS",
            "Streptokok Sonrası Ani Başlayan OKB"
        ]
    },
    {
        "id": "ptsd",
        "nameTr": "Travma Sonrası Stres Bozukluğu (TSSB / PTSD)",
        "nameEn": "Posttraumatic Stress Disorder (PTSD)",
        "category": "TRAUMA",
        "aliases": [
            "TSSB",
            "PTSD",
            "Travma",
            "Flashback",
            "Kabuslar",
            "F43.10"
        ]
    },
    {
        "id": "ptsd_dissociative",
        "nameTr": "TSSB (Dissosiyatif Belirtilerle Giden / C-PTSD)",
        "nameEn": "PTSD with Dissociative Symptoms",
        "category": "TRAUMA",
        "aliases": [
            "Dissosiyatif TSSB",
            "Karmaşık Travma",
            "C-PTSD",
            "F43.12"
        ]
    },
    {
        "id": "ptsd_preschool",
        "nameTr": "6 Yaş ve Altı Çocuklarda Travma Sonrası Stres Bozukluğu",
        "nameEn": "PTSD for Children 6 Years and Younger",
        "category": "TRAUMA",
        "aliases": [
            "Okul Öncesi Travma"
        ]
    },
    {
        "id": "acute_stress_disorder",
        "nameTr": "Akut Stres Bozukluğu",
        "nameEn": "Acute Stress Disorder",
        "category": "TRAUMA",
        "aliases": [
            "İlk 1 Aydaki Travma",
            "Akut Travma Şoku",
            "F43.0"
        ]
    },
    {
        "id": "adjustment_disorder",
        "nameTr": "Uyum Bozuklukları",
        "nameEn": "Adjustment Disorders",
        "category": "TRAUMA",
        "aliases": [
            "Uyumsuzluk",
            "Strese Bağlı Uyum Bozukluğu",
            "F43.20"
        ]
    },
    {
        "id": "adjustment_disorder_depressed",
        "nameTr": "Uyum Bozukluğu (Çökkün Duygudurum ile)",
        "nameEn": "Adjustment Disorder with Depressed Mood",
        "category": "TRAUMA",
        "aliases": [
            "F43.21"
        ]
    },
    {
        "id": "adjustment_disorder_anxious",
        "nameTr": "Uyum Bozukluğu (Kaygı ile)",
        "nameEn": "Adjustment Disorder with Anxiety",
        "category": "TRAUMA",
        "aliases": [
            "F43.22"
        ]
    },
    {
        "id": "reactive_attachment_disorder",
        "nameTr": "Tepkisel Bağlanma Bozukluğu (RAD)",
        "nameEn": "Reactive Attachment Disorder",
        "category": "TRAUMA",
        "aliases": [
            "RAD",
            "Bağlanma Travması",
            "F94.1"
        ]
    },
    {
        "id": "disinhibited_social_engagement",
        "nameTr": "Sınırsız Toplumsal Katılım Bozukluğu (DSED)",
        "nameEn": "Disinhibited Social Engagement Disorder",
        "category": "TRAUMA",
        "aliases": [
            "DSED",
            "Yabancılara Aşırı Yakınlık",
            "F94.2"
        ]
    },
    {
        "id": "prolonged_grief_disorder",
        "nameTr": "Uzatılmış Yas Bozukluğu (Prolonged Grief Disorder)",
        "nameEn": "Prolonged Grief Disorder",
        "category": "TRAUMA",
        "aliases": [
            "Komplike Yas",
            "Kronik Yas",
            "PGD",
            "F43.8"
        ]
    },
    {
        "id": "did",
        "nameTr": "Dissosiyatif Kimlik Bozukluğu (Çoklu Kişilik)",
        "nameEn": "Dissociative Identity Disorder",
        "category": "DISSOCIATIVE",
        "aliases": [
            "Çoklu Kişilik",
            "Alter Kişilikler",
            "DID",
            "MPD",
            "F44.81"
        ]
    },
    {
        "id": "dissociative_amnesia",
        "nameTr": "Dissosiyatif Amnezi (Bellek Yitimi)",
        "nameEn": "Dissociative Amnesia",
        "category": "DISSOCIATIVE",
        "aliases": [
            "Psikojenik Bellek Kaybı",
            "Travmatik Unutma",
            "F44.0"
        ]
    },
    {
        "id": "dissociative_fugue",
        "nameTr": "Dissosiyatif Füg (Kaçış ve Kimlik Kaybı)",
        "nameEn": "Dissociative Amnesia with Dissociative Fugue",
        "category": "DISSOCIATIVE",
        "aliases": [
            "Füg Durumu",
            "Kaçış Amnezisi",
            "F44.1"
        ]
    },
    {
        "id": "depersonalization_derealization",
        "nameTr": "Depersonalizasyon / Derealizasyon Bozukluğu",
        "nameEn": "Depersonalization/Derealization Disorder",
        "category": "DISSOCIATIVE",
        "aliases": [
            "Kendine Yabancılaşma",
            "Gerçekdışılık",
            "Sis Perdesi",
            "DPDR",
            "F48.1"
        ]
    },
    {
        "id": "dissociative_trance",
        "nameTr": "Dissosiyatif Trans Bozukluğu",
        "nameEn": "Dissociative Trance Disorder",
        "category": "DISSOCIATIVE",
        "aliases": [
            "Trans Durumu",
            "Ele Geçirilme Transı"
        ]
    },
    {
        "id": "ganser_syndrome",
        "nameTr": "Ganser Sendromu (Yaklaşık Yanıtlar / Cezaevi Psikozu)",
        "nameEn": "Ganser Syndrome",
        "category": "DISSOCIATIVE",
        "aliases": [
            "Ganser Sendromu",
            "Saçma Yanıtlar Sendromu",
            "F44.89"
        ]
    },
    {
        "id": "possession_trance",
        "nameTr": "Ele Geçirilme Transı Bozukluğu (Cin/Ruh Çarpması İnancı)",
        "nameEn": "Possession Trance Disorder",
        "category": "DISSOCIATIVE",
        "aliases": [
            "Cin Çarpması Transı",
            "Ele Geçirilme"
        ]
    },
    {
        "id": "coercive_persuasion_dissociation",
        "nameTr": "Yoğun Zorlayıcı İkna Sonrası Kimlik Bozulması (Tarikat Travması)",
        "nameEn": "Identity Disturbance Due to Prolonged Coercive Persuasion",
        "category": "DISSOCIATIVE",
        "aliases": [
            "Beyin Yıkama",
            "Kült/Tarikat Travması"
        ]
    },
    {
        "id": "somatic_symptom_disorder",
        "nameTr": "Bedensel Belirti Bozukluğu (Somatik Semptom Bozukluğu)",
        "nameEn": "Somatic Symptom Disorder",
        "category": "SOMATIC",
        "aliases": [
            "Somatizasyon",
            "Bedenselleştirme",
            "Kronik Ağrı Bozukluğu",
            "F45.1"
        ]
    },
    {
        "id": "illness_anxiety_disorder",
        "nameTr": "Hastalık Kaygısı Bozukluğu (Hipokondriyazis)",
        "nameEn": "Illness Anxiety Disorder",
        "category": "SOMATIC",
        "aliases": [
            "Hipokondri",
            "Hastalık Hastalığı",
            "Sağlık Kaygısı",
            "F45.21"
        ]
    },
    {
        "id": "conversion_disorder",
        "nameTr": "Konversiyon Bozukluğu (İşlevsel Nörolojik Belirti Bozukluğu)",
        "nameEn": "Conversion Disorder (Functional Neurological Symptom Disorder)",
        "category": "SOMATIC",
        "aliases": [
            "Konversiyon",
            "Histeri",
            "Psikojenik Felç/Körlük/Bayılma",
            "F44.4"
        ]
    },
    {
        "id": "conversion_motor",
        "nameTr": "Konversiyon Bozukluğu (Motor Belirtiler: Felç / Yürüme Bozukluğu)",
        "nameEn": "Conversion Disorder (Motor Symptoms)",
        "category": "SOMATIC",
        "aliases": [
            "Psikojenik Felç",
            "Histerik Paralizi",
            "F44.4"
        ]
    },
    {
        "id": "conversion_seizures",
        "nameTr": "Konversiyon Bozukluğu (Psödonöbet / PNES)",
        "nameEn": "Conversion Disorder (Attacks or Seizures / PNES)",
        "category": "SOMATIC",
        "aliases": [
            "Psödonöbet",
            "PNES",
            "Yalancı Epileptik Nöbet",
            "F44.5"
        ]
    },
    {
        "id": "conversion_sensory",
        "nameTr": "Konversiyon Bozukluğu (Duyusal: Histerik Körlük / Afoni)",
        "nameEn": "Conversion Disorder (Sensory / Blindness / Aphonia)",
        "category": "SOMATIC",
        "aliases": [
            "Histerik Körlük",
            "Psikojenik Afoni",
            "F44.6"
        ]
    },
    {
        "id": "factitious_disorder",
        "nameTr": "Yapay Bozukluk (Kendine Yüklenen / Münchausen Sendromu)",
        "nameEn": "Factitious Disorder Imposed on Self (Münchausen)",
        "category": "SOMATIC",
        "aliases": [
            "Münchausen Sendromu",
            "Yapay Hastalık",
            "F68.10"
        ]
    },
    {
        "id": "factitious_another",
        "nameTr": "Yapay Bozukluk (Başkasına Yüklenen / Münchausen by Proxy)",
        "nameEn": "Factitious Disorder Imposed on Another (Münchausen by Proxy)",
        "category": "SOMATIC",
        "aliases": [
            "Münchausen by Proxy",
            "Vekaleten Yapay Bozukluk",
            "T74.8"
        ]
    },
    {
        "id": "pseudocyesis",
        "nameTr": "Yalancı Gebelik (Psödosiyezis)",
        "nameEn": "Pseudocyesis",
        "category": "SOMATIC",
        "aliases": [
            "Psödosiyezis",
            "Hayali Hamilelik",
            "F45.8"
        ]
    },
    {
        "id": "psychological_factors_affecting_medical",
        "nameTr": "Başka Sağlık Durumunu Etkileyen Ruhsal Etkenler",
        "nameEn": "Psychological Factors Affecting Other Medical Conditions",
        "category": "SOMATIC",
        "aliases": [
            "Psikosomatik Etki",
            "F54"
        ]
    },
    {
        "id": "anorexia_nervosa",
        "nameTr": "Anoreksiya Nervoza",
        "nameEn": "Anorexia Nervosa",
        "category": "EATING",
        "aliases": [
            "Anoreksiya",
            "Yememe Hastalığı",
            "Aşırı Zayıflık",
            "F50.00"
        ]
    },
    {
        "id": "anorexia_restricting",
        "nameTr": "Anoreksiya Nervoza (Kısıtlayıcı Tip)",
        "nameEn": "Anorexia Nervosa (Restricting Type)",
        "category": "EATING",
        "aliases": [
            "Kısıtlayıcı Anoreksiya",
            "F50.01"
        ]
    },
    {
        "id": "anorexia_binge_purge",
        "nameTr": "Anoreksiya Nervoza (Tıkınma/Çıkarma Tipi)",
        "nameEn": "Anorexia Nervosa (Binge-Eating/Purging Type)",
        "category": "EATING",
        "aliases": [
            "Kusan Anoreksiya",
            "Düşük Kilolu Bulimik Anoreksiya",
            "F50.02"
        ]
    },
    {
        "id": "atypical_anorexia",
        "nameTr": "Atipik Anoreksiya Nervoza (Kilo Normal Sınırlarda)",
        "nameEn": "Atypical Anorexia Nervosa",
        "category": "EATING",
        "aliases": [
            "Normal Kilolu Anoreksiya",
            "F50.89"
        ]
    },
    {
        "id": "bulimia_nervosa",
        "nameTr": "Bulimiya Nervoza",
        "nameEn": "Bulimia Nervosa",
        "category": "EATING",
        "aliases": [
            "Bulimiya",
            "Yiyip Kusma Hastalığı",
            "Normal Kilolu Tıkınma/Çıkarma",
            "F50.2"
        ]
    },
    {
        "id": "binge_eating",
        "nameTr": "Tıkınırcasına Yeme Bozukluğu (BED)",
        "nameEn": "Binge-Eating Disorder",
        "category": "EATING",
        "aliases": [
            "BED",
            "Kusmasız Aşırı Tıkınma",
            "F50.81"
        ]
    },
    {
        "id": "purging_disorder",
        "nameTr": "Çıkarma Bozukluğu (Tıkınma Olmaksızın Kusma)",
        "nameEn": "Purging Disorder",
        "category": "EATING",
        "aliases": [
            "Sadece Kusma",
            "F50.89"
        ]
    },
    {
        "id": "arfid",
        "nameTr": "Kaçıngan/Kısıtlı Yiyecek Alımı Bozukluğu (ARFID)",
        "nameEn": "Avoidant/Restrictive Food Intake Disorder (ARFID)",
        "category": "EATING",
        "aliases": [
            "ARFID",
            "Duyusal Seçici Yeme",
            "Yemekten Boğulma Korkusu",
            "F50.82"
        ]
    },
    {
        "id": "pica",
        "nameTr": "Pika (Yenilmeyen Maddeleri Yeme: Toprak, Kireç, Kömür)",
        "nameEn": "Pica",
        "category": "EATING",
        "aliases": [
            "Pika",
            "Toprak Yeme",
            "Kireç Yeme",
            "F98.3"
        ]
    },
    {
        "id": "rumination_disorder",
        "nameTr": "Geri Çıkarma (Geviş Getirme / Ruminasyon) Bozukluğu",
        "nameEn": "Rumination Disorder",
        "category": "EATING",
        "aliases": [
            "Ruminasyon",
            "Yiyeceği Ağza Getirip Çiğneme",
            "F98.21"
        ]
    },
    {
        "id": "night_eating_syndrome",
        "nameTr": "Gece Yeme Sendromu",
        "nameEn": "Night Eating Syndrome",
        "category": "EATING",
        "aliases": [
            "Gece Uykudan Kalkıp Yeme",
            "F50.89"
        ]
    },
    {
        "id": "orthorexia_nervosa",
        "nameTr": "Ortoreksiya Nervoza (Sağlıklı ve Saf Beslenme Takıntısı)",
        "nameEn": "Orthorexia Nervosa",
        "category": "EATING",
        "aliases": [
            "Ortoreksiya",
            "Temiz Beslenme Takıntısı"
        ]
    },
    {
        "id": "enuresis",
        "nameTr": "Enürezis (İstemsiz İdrar Kaçırma / Alt Islatma)",
        "nameEn": "Enuresis",
        "category": "ELIMINATION",
        "aliases": [
            "Alt Islatma",
            "İdrar Kaçırma",
            "F98.0"
        ]
    },
    {
        "id": "enuresis_nocturna",
        "nameTr": "Enürezis Nokturna (Gece Altını Islatma)",
        "nameEn": "Enuresis (Nocturnal only)",
        "category": "ELIMINATION",
        "aliases": [
            "Gece İdrar Kaçırma",
            "Noktüri",
            "F98.0"
        ]
    },
    {
        "id": "enuresis_diurna",
        "nameTr": "Enürezis Diürna (Gündüz Altını Islatma)",
        "nameEn": "Enuresis (Diurnal only)",
        "category": "ELIMINATION",
        "aliases": [
            "Gündüz İdrar Kaçırma",
            "F98.0"
        ]
    },
    {
        "id": "encopresis",
        "nameTr": "Enkoprezis (İstemsiz Kaka Kaçırma)",
        "nameEn": "Encopresis",
        "category": "ELIMINATION",
        "aliases": [
            "Kaka Kaçırma",
            "Dışkı Kaçırma",
            "F98.1"
        ]
    },
    {
        "id": "insomnia_disorder",
        "nameTr": "Uykusuzluk Bozukluğu (Kronik İnsomni)",
        "nameEn": "Insomnia Disorder",
        "category": "SLEEP",
        "aliases": [
            "İnsomni",
            "Uykuya Dalamama",
            "Uykuyu Sürdürememe",
            "G74.0"
        ]
    },
    {
        "id": "hypersomnolence",
        "nameTr": "Aşırı Uykululuk Bozukluğu (Hipersomnolans)",
        "nameEn": "Hypersomnolence Disorder",
        "category": "SLEEP",
        "aliases": [
            "Hipersomni",
            "Dinlendirmeyen Uzun Uyku",
            "G47.10"
        ]
    },
    {
        "id": "narcolepsy",
        "nameTr": "Narkolepsi (Katapleksi ile Giden)",
        "nameEn": "Narcolepsy with Cataplexy",
        "category": "SLEEP",
        "aliases": [
            "Narkolepsi",
            "Gülmeyle Kas Felci",
            "Uyku Nöbetleri",
            "G47.411"
        ]
    },
    {
        "id": "narcolepsy_without_cataplexy",
        "nameTr": "Narkolepsi (Katapleksi Olmayan Tip)",
        "nameEn": "Narcolepsy without Cataplexy",
        "category": "SLEEP",
        "aliases": [
            "Katapleksisiz Narkolepsi",
            "G47.419"
        ]
    },
    {
        "id": "obstructive_sleep_apnea",
        "nameTr": "Tıkayıcı (Obstrüktif) Uyku Apnesi Hipopnesi",
        "nameEn": "Obstructive Sleep Apnea Hypopnea",
        "category": "SLEEP",
        "aliases": [
            "Uyku Apnesi",
            "OSAS",
            "Gece Horlama",
            "G47.33"
        ]
    },
    {
        "id": "central_sleep_apnea",
        "nameTr": "Santral Uyku Apnesi (Cheyne-Stokes)",
        "nameEn": "Central Sleep Apnea",
        "category": "SLEEP",
        "aliases": [
            "Merkezi Uyku Apnesi",
            "G47.31"
        ]
    },
    {
        "id": "sleep_related_hypoventilation",
        "nameTr": "Uykuda Hipoventilasyon (Ondine Laneti Dahil)",
        "nameEn": "Sleep-Related Hypoventilation",
        "category": "SLEEP",
        "aliases": [
            "Ondine Sendromu",
            "G47.36"
        ]
    },
    {
        "id": "circadian_delayed_sleep",
        "nameTr": "Sirkadiyen Ritim Bozukluğu (Gecikmiş Uyku Evresi Tipi)",
        "nameEn": "Circadian Rhythm Sleep Disorder (Delayed Sleep Phase Type)",
        "category": "SLEEP",
        "aliases": [
            "Gece Kuşu Sendromu",
            "G47.21"
        ]
    },
    {
        "id": "circadian_advanced_sleep",
        "nameTr": "Sirkadiyen Ritim Bozukluğu (Erken Uyku Evresi Tipi)",
        "nameEn": "Circadian Rhythm Sleep Disorder (Advanced Sleep Phase Type)",
        "category": "SLEEP",
        "aliases": [
            "Erken Uyuma Sendromu",
            "G47.22"
        ]
    },
    {
        "id": "circadian_shift_work",
        "nameTr": "Sirkadiyen Ritim Bozukluğu (Vardiyalı Çalışma Tipi)",
        "nameEn": "Circadian Rhythm Sleep Disorder (Shift Work Type)",
        "category": "SLEEP",
        "aliases": [
            "Vardiyalı İş Uyku Bozukluğu",
            "G47.26"
        ]
    },
    {
        "id": "circadian_non_24_hour",
        "nameTr": "Sirkadiyen Ritim Bozukluğu (24 Saate Uymayan Tip)",
        "nameEn": "Circadian Rhythm Sleep Disorder (Non-24-Hour Type)",
        "category": "SLEEP",
        "aliases": [
            "Serbest Döngülü Uyku",
            "G47.24"
        ]
    },
    {
        "id": "sleepwalking_disorder",
        "nameTr": "NREM Uykusundan Uyanma (Uyurgezerlik / Somnambulizm)",
        "nameEn": "Non-REM Sleep Arousal Disorder (Sleepwalking type)",
        "category": "SLEEP",
        "aliases": [
            "Uyurgezerlik",
            "Somnambulizm",
            "F51.3"
        ]
    },
    {
        "id": "sexsomnia",
        "nameTr": "Seksomni (Uykuda Cinsel Davranış / Uyurgezerlik Alt Tipi)",
        "nameEn": "Sexsomnia (Sleep Sex)",
        "category": "SLEEP",
        "aliases": [
            "Seksomni",
            "Uykuda Cinsel İlişkiye Girme"
        ]
    },
    {
        "id": "sleep_terrors",
        "nameTr": "NREM Uykusundan Uyanma (Gece Terörü / Uyku Terörü)",
        "nameEn": "Non-REM Sleep Arousal Disorder (Sleep Terror type)",
        "category": "SLEEP",
        "aliases": [
            "Gece Terörü",
            "Çığlıkla Uyanma",
            "F51.4"
        ]
    },
    {
        "id": "nightmare_disorder",
        "nameTr": "Kabus Bozukluğu (Nightmare Disorder)",
        "nameEn": "Nightmare Disorder",
        "category": "SLEEP",
        "aliases": [
            "Korkulu Rüya Bozukluğu",
            "Kabus Görme",
            "F51.5"
        ]
    },
    {
        "id": "rem_sleep_behavior_disorder",
        "nameTr": "REM Uykusu Davranış Bozukluğu (RBD)",
        "nameEn": "REM Sleep Behavior Disorder",
        "category": "SLEEP",
        "aliases": [
            "RBD",
            "Rüyayı Eyleme Dökme",
            "Uykuda Vurma/Tekmeleme",
            "G47.52"
        ]
    },
    {
        "id": "restless_legs_syndrome",
        "nameTr": "Huzursuz Bacaklar Sendromu (Willis-Ekbom)",
        "nameEn": "Restless Legs Syndrome",
        "category": "SLEEP",
        "aliases": [
            "HBS",
            "RLS",
            "Bacaklarda Gece Karıncalanma",
            "G25.81"
        ]
    },
    {
        "id": "kleine_levin_syndrome",
        "nameTr": "Kleine-Levin Sendromu (Uyuyan Güzel Sendromu)",
        "nameEn": "Kleine-Levin Syndrome",
        "category": "SLEEP",
        "aliases": [
            "Uyuyan Güzel Sendromu",
            "Dönemlik Aşırı Uyku ve Hiperfaji",
            "G47.13"
        ]
    },
    {
        "id": "erectile_disorder",
        "nameTr": "Sertleşme Bozukluğu (Erektil Bozukluk)",
        "nameEn": "Erectile Disorder",
        "category": "SEXUAL",
        "aliases": [
            "Erektil Disfonksiyon",
            "İmpotans",
            "Sertleşememe",
            "F52.21"
        ]
    },
    {
        "id": "premature_ejaculation",
        "nameTr": "Erken Boşalma (Prematür Ejakülasyon)",
        "nameEn": "Premature (Early) Ejaculation",
        "category": "SEXUAL",
        "aliases": [
            "Erken Boşalma",
            "Denetimsiz Boşalma",
            "PE",
            "F52.4"
        ]
    },
    {
        "id": "delayed_ejaculation",
        "nameTr": "Geç Boşalma (Gecikmiş Ejakülasyon)",
        "nameEn": "Delayed Ejaculation",
        "category": "SEXUAL",
        "aliases": [
            "Boşalamama",
            "Gecikmiş Boşalma",
            "Anejakülasyon",
            "F52.32"
        ]
    },
    {
        "id": "male_hypoactive_desire",
        "nameTr": "Erkekte Düşük Cinsel İstek Bozukluğu",
        "nameEn": "Male Hypoactive Sexual Desire Disorder",
        "category": "SEXUAL",
        "aliases": [
            "Erkekte Cinsel İsteksizlik",
            "HSDD",
            "F52.0"
        ]
    },
    {
        "id": "female_sexual_interest_arousal",
        "nameTr": "Kadında Cinsel İlgi/Uyarılma Bozukluğu",
        "nameEn": "Female Sexual Interest/Arousal Disorder",
        "category": "SEXUAL",
        "aliases": [
            "Kadında Cinsel İsteksizlik",
            "FSIAD",
            "F52.22"
        ]
    },
    {
        "id": "female_orgasmic_disorder",
        "nameTr": "Kadında Orgazm Bozukluğu (Anorgazmi)",
        "nameEn": "Female Orgasmic Disorder",
        "category": "SEXUAL",
        "aliases": [
            "Anorgazmi",
            "Orgazm Olamama",
            "F52.31"
        ]
    },
    {
        "id": "genito_pelvic_pain",
        "nameTr": "Genito-Pelvik Ağrı/Penetrasyon Bozukluğu (Vajinismus / Disparoni)",
        "nameEn": "Genito-Pelvic Pain/Penetration Disorder",
        "category": "SEXUAL",
        "aliases": [
            "Vajinismus",
            "Disparoni",
            "Ağrılı İlişki",
            "İlişkiye Girememe",
            "F52.6"
        ]
    },
    {
        "id": "substance_induced_sexual_dysfunction",
        "nameTr": "Maddenin/İlacın Yol Açtığı Cinsel İşlev Bozukluğu (SSRI Disfonksiyonu)",
        "nameEn": "Substance/Medication-Induced Sexual Dysfunction",
        "category": "SEXUAL",
        "aliases": [
            "SSRI Cinsel Yan Etkisi",
            "Antidepresan Cinsel İsteksizliği"
        ]
    },
    {
        "id": "persistent_genital_arousal",
        "nameTr": "Kalıcı Genital Uyarılma Bozukluğu (PGAD)",
        "nameEn": "Persistent Genital Arousal Disorder (PGAD)",
        "category": "SEXUAL",
        "aliases": [
            "PGAD",
            "İstemsiz Sürekli Genital Uyarılma"
        ]
    },
    {
        "id": "unspecified_sexual_dysfunction",
        "nameTr": "Belirtilmemiş Cinsel İşlev Bozukluğu",
        "nameEn": "Unspecified Sexual Dysfunction",
        "category": "SEXUAL",
        "aliases": [
            "F52.9"
        ]
    },
    {
        "id": "gender_dysphoria_children",
        "nameTr": "Çocuklarda Cinsiyet Disforisi",
        "nameEn": "Gender Dysphoria in Children",
        "category": "GENDER",
        "aliases": [
            "Çocukluk Cinsiyet Uyumsuzluğu",
            "F64.2"
        ]
    },
    {
        "id": "gender_dysphoria_adolescents_adults",
        "nameTr": "Ergen ve Erişkinlerde Cinsiyet Disforisi",
        "nameEn": "Gender Dysphoria in Adolescents and Adults",
        "category": "GENDER",
        "aliases": [
            "Cinsiyet Uyumsuzluğu",
            "Transgender Disforisi",
            "F64.0"
        ]
    },
    {
        "id": "unspecified_gender_dysphoria",
        "nameTr": "Belirtilmemiş Cinsiyet Disforisi",
        "nameEn": "Unspecified Gender Dysphoria",
        "category": "GENDER",
        "aliases": [
            "F64.9"
        ]
    },
    {
        "id": "odd",
        "nameTr": "Karşıt Olma Karşı Gelme Bozukluğu (KOKGB / ODD)",
        "nameEn": "Oppositional Defiant Disorder (ODD)",
        "category": "IMPULSE",
        "aliases": [
            "KOKGB",
            "ODD",
            "İnatlaşma",
            "Otoriteye Karşı Gelme",
            "F91.3"
        ]
    },
    {
        "id": "intermittent_explosive",
        "nameTr": "Aralıklı Patlayıcı Bozukluk (IED)",
        "nameEn": "Intermittent Explosive Disorder",
        "category": "IMPULSE",
        "aliases": [
            "Öfke Patlamaları",
            "Kontrolsüz Saldırganlık",
            "IED",
            "F63.81"
        ]
    },
    {
        "id": "conduct_disorder",
        "nameTr": "Davranım Bozukluğu",
        "nameEn": "Conduct Disorder",
        "category": "IMPULSE",
        "aliases": [
            "Davranış Bozukluğu",
            "Kural Tanımazlık",
            "Çocukluk Suç Örüntüsü",
            "F91.9"
        ]
    },
    {
        "id": "conduct_childhood",
        "nameTr": "Davranım Bozukluğu (Çocuklukta Başlayan Tip)",
        "nameEn": "Conduct Disorder (Childhood-Onset Type)",
        "category": "IMPULSE",
        "aliases": [
            "Erken Başlangıçlı Davranım",
            "F91.1"
        ]
    },
    {
        "id": "conduct_adolescent",
        "nameTr": "Davranım Bozukluğu (Ergenlikte Başlayan Tip)",
        "nameEn": "Conduct Disorder (Adolescent-Onset Type)",
        "category": "IMPULSE",
        "aliases": [
            "Ergenlik Tipi Davranım",
            "F91.2"
        ]
    },
    {
        "id": "conduct_callous_unemotional",
        "nameTr": "Davranım Bozukluğu (Sınırlı Prososyal Duygularla / Katı-Duygusuz Mizaç)",
        "nameEn": "Conduct Disorder with Limited Prosocial Emotions",
        "category": "IMPULSE",
        "aliases": [
            "Katı Duygusuz Tip",
            "Erken Psikopati"
        ]
    },
    {
        "id": "pyromania",
        "nameTr": "Piromani (Yangın Çıkarma Hastalığı)",
        "nameEn": "Pyromania",
        "category": "IMPULSE",
        "aliases": [
            "Yangın Çıkarma Dürtüsü",
            "Ateş Tutkusu",
            "F63.1"
        ]
    },
    {
        "id": "kleptomania",
        "nameTr": "Kleptomani (Çalma Hastalığı)",
        "nameEn": "Kleptomania",
        "category": "IMPULSE",
        "aliases": [
            "Çalma Dürtüsü",
            "Gereksiz Eşya Çalma",
            "F63.2"
        ]
    },
    {
        "id": "alcohol_use_disorder",
        "nameTr": "Alkol Kullanım Bozukluğu (Alkolizm)",
        "nameEn": "Alcohol Use Disorder",
        "category": "SUBSTANCE",
        "aliases": [
            "Alkolizm",
            "Alkol Bağımlılığı",
            "F10.20"
        ]
    },
    {
        "id": "alcohol_intoxication",
        "nameTr": "Alkol Zehirlenmesi (İntoksikasyonu)",
        "nameEn": "Alcohol Intoxication",
        "category": "SUBSTANCE",
        "aliases": [
            "Sarhoşluk",
            "Akut Alkol Zehirlenmesi",
            "F10.129"
        ]
    },
    {
        "id": "alcohol_withdrawal",
        "nameTr": "Alkol Yoksunluğu",
        "nameEn": "Alcohol Withdrawal",
        "category": "SUBSTANCE",
        "aliases": [
            "Alkol Bırakma Titremeleri",
            "F10.239"
        ]
    },
    {
        "id": "alcohol_withdrawal_delirium",
        "nameTr": "Alkol Yoksunluğu Deliryumu (Delirium Tremens)",
        "nameEn": "Alcohol Withdrawal Delirium (Delirium Tremens)",
        "category": "SUBSTANCE",
        "aliases": [
            "Delirium Tremens",
            "DT",
            "F10.231"
        ]
    },
    {
        "id": "alcohol_induced_mood",
        "nameTr": "Alkolün Yol Açtığı Depresif / Duygudurum Bozukluğu",
        "nameEn": "Alcohol-Induced Depressive Disorder",
        "category": "SUBSTANCE",
        "aliases": [
            "Alkole Bağlı Depresyon",
            "F10.24"
        ]
    },
    {
        "id": "alcohol_induced_anxiety",
        "nameTr": "Alkolün Yol Açtığı Anksiyete Bozukluğu",
        "nameEn": "Alcohol-Induced Anxiety Disorder",
        "category": "SUBSTANCE",
        "aliases": [
            "Alkol Sonrası Kaygı",
            "F10.280"
        ]
    },
    {
        "id": "cannabis_use_disorder",
        "nameTr": "Esrar (Kannabis) Kullanım Bozukluğu",
        "nameEn": "Cannabis Use Disorder",
        "category": "SUBSTANCE",
        "aliases": [
            "Esrar Bağımlılığı",
            "Marihuana Bağımlılığı",
            "F12.20"
        ]
    },
    {
        "id": "cannabis_intoxication",
        "nameTr": "Esrar Zehirlenmesi (İntoksikasyonu)",
        "nameEn": "Cannabis Intoxication",
        "category": "SUBSTANCE",
        "aliases": [
            "Esrar Kafası",
            "F12.129"
        ]
    },
    {
        "id": "cannabis_withdrawal",
        "nameTr": "Esrar Yoksunluğu",
        "nameEn": "Cannabis Withdrawal",
        "category": "SUBSTANCE",
        "aliases": [
            "Esrar Bırakma Sendromu",
            "F12.288"
        ]
    },
    {
        "id": "cannabis_induced_psychotic",
        "nameTr": "Esrarın Yol Açtığı Psikotik Bozukluk",
        "nameEn": "Cannabis-Induced Psychotic Disorder",
        "category": "SUBSTANCE",
        "aliases": [
            "Esrar Psikozu",
            "F12.259"
        ]
    },
    {
        "id": "synthetic_cannabinoid_intoxication",
        "nameTr": "Sentetik Kannabinoid Zehirlenmesi (Bonzai / Spice)",
        "nameEn": "Synthetic Cannabinoid Intoxication",
        "category": "SUBSTANCE",
        "aliases": [
            "Bonzai Zehirlenmesi",
            "Spice"
        ]
    },
    {
        "id": "sedative_hypnotic_use_disorder",
        "nameTr": "Sedatif, Hipnotik ya da Anksiyolitik Kullanım Bozukluğu (Benzodiazepin)",
        "nameEn": "Sedative, Hypnotic, or Anxiolytic Use Disorder",
        "category": "SUBSTANCE",
        "aliases": [
            "Benzodiazepin Bağımlılığı",
            "Xanax Bağımlılığı",
            "F13.20"
        ]
    },
    {
        "id": "sedative_withdrawal",
        "nameTr": "Sedatif/Benzodiazepin Yoksunluğu",
        "nameEn": "Sedative, Hypnotic, or Anxiolytic Withdrawal",
        "category": "SUBSTANCE",
        "aliases": [
            "Benzodiazepin Kesilme Krizleri",
            "F13.239"
        ]
    },
    {
        "id": "opioid_use_disorder",
        "nameTr": "Opioid Kullanım Bozukluğu (Eroin / Morfin)",
        "nameEn": "Opioid Use Disorder",
        "category": "SUBSTANCE",
        "aliases": [
            "Eroin Bağımlılığı",
            "Opioid Bağımlılığı",
            "F11.20"
        ]
    },
    {
        "id": "opioid_intoxication",
        "nameTr": "Opioid Zehirlenmesi (Miyozis, Solunum Depresyonu)",
        "nameEn": "Opioid Intoxication",
        "category": "SUBSTANCE",
        "aliases": [
            "Altın Vuruş",
            "Eroin Doz Aşımı",
            "F11.129"
        ]
    },
    {
        "id": "opioid_withdrawal",
        "nameTr": "Opioid Yoksunluğu (Kriz / Kas Ağrıları, Midriyazis)",
        "nameEn": "Opioid Withdrawal",
        "category": "SUBSTANCE",
        "aliases": [
            "Eroin Krizi",
            "Yoksunluk Ağrıları",
            "F11.23"
        ]
    },
    {
        "id": "cocaine_use_disorder",
        "nameTr": "Kokain Kullanım Bozukluğu",
        "nameEn": "Cocaine Use Disorder",
        "category": "SUBSTANCE",
        "aliases": [
            "Kokain Bağımlılığı",
            "Crack Bağımlılığı",
            "F14.20"
        ]
    },
    {
        "id": "cocaine_intoxication",
        "nameTr": "Kokain Zehirlenmesi (Taşikardi, Midriyazis, Öfori)",
        "nameEn": "Cocaine Intoxication",
        "category": "SUBSTANCE",
        "aliases": [
            "Kokain Doz Aşımı",
            "F14.129"
        ]
    },
    {
        "id": "cocaine_withdrawal",
        "nameTr": "Kokain Yoksunluğu (Ağır Çöküş / Crash)",
        "nameEn": "Cocaine Withdrawal",
        "category": "SUBSTANCE",
        "aliases": [
            "Kokain Çöküşü",
            "F14.23"
        ]
    },
    {
        "id": "cocaine_induced_psychosis",
        "nameTr": "Kokainin Yol Açtığı Psikotik Bozukluk (Paranoya)",
        "nameEn": "Cocaine-Induced Psychotic Disorder",
        "category": "SUBSTANCE",
        "aliases": [
            "Kokain Paranoyası",
            "F14.259"
        ]
    },
    {
        "id": "amphetamine_use_disorder",
        "nameTr": "Amfetamin / Metamfetamin Kullanım Bozukluğu (Kristal Met)",
        "nameEn": "Amphetamine-Type Substance Use Disorder",
        "category": "SUBSTANCE",
        "aliases": [
            "Met Bağımlılığı",
            "Metamfetamin",
            "Kristal",
            "F15.20"
        ]
    },
    {
        "id": "amphetamine_withdrawal",
        "nameTr": "Amfetamin/Uyarıcı Yoksunluğu",
        "nameEn": "Amphetamine Withdrawal",
        "category": "SUBSTANCE",
        "aliases": [
            "Met Yoksunluğu",
            "F15.23"
        ]
    },
    {
        "id": "methamphetamine_psychosis",
        "nameTr": "Metamfetaminin Yol Açtığı Psikotik Bozukluk (Met Böcekleri)",
        "nameEn": "Methamphetamine-Induced Psychotic Disorder",
        "category": "SUBSTANCE",
        "aliases": [
            "Met Psikozu",
            "Formikasyon",
            "Deri Altı Böcek Sanrısı"
        ]
    },
    {
        "id": "phencyclidine_use_disorder",
        "nameTr": "Fensiklidin (PCP) Kullanım Bozukluğu",
        "nameEn": "Phencyclidine Use Disorder",
        "category": "SUBSTANCE",
        "aliases": [
            "PCP Bağımlılığı",
            "Melek Tozu",
            "F19.20"
        ]
    },
    {
        "id": "hallucinogen_use_disorder",
        "nameTr": "Hallusinojen Kullanım Bozukluğu (LSD / Mantar / MDMA)",
        "nameEn": "Hallucinogen Use Disorder",
        "category": "SUBSTANCE",
        "aliases": [
            "LSD Bağımlılığı",
            "Psilosibin",
            "Asit",
            "F16.20"
        ]
    },
    {
        "id": "hallucinogen_persisting_perception",
        "nameTr": "Hallusinojen Kalıcı Algı Bozukluğu (HPPD / Flashback)",
        "nameEn": "Hallucinogen Persisting Perception Disorder (HPPD)",
        "category": "SUBSTANCE",
        "aliases": [
            "HPPD",
            "Flashback Sendromu",
            "Görsel Kar Yağması",
            "F16.983"
        ]
    },
    {
        "id": "inhalant_use_disorder",
        "nameTr": "Uçucu Madde Kullanım Bozukluğu (Tiner / Bali / Çakmak Gazı)",
        "nameEn": "Inhalant Use Disorder",
        "category": "SUBSTANCE",
        "aliases": [
            "Tiner Bağımlılığı",
            "Uçucu Çekme",
            "F18.20"
        ]
    },
    {
        "id": "tobacco_use_disorder",
        "nameTr": "Tütün (Nikotin) Kullanım Bozukluğu",
        "nameEn": "Tobacco Use Disorder",
        "category": "SUBSTANCE",
        "aliases": [
            "Sigara Bağımlılığı",
            "Nikotin Bağımlılığı",
            "F17.200"
        ]
    },
    {
        "id": "tobacco_withdrawal",
        "nameTr": "Tütün (Nikotin) Yoksunluğu",
        "nameEn": "Tobacco Withdrawal",
        "category": "SUBSTANCE",
        "aliases": [
            "Sigara Bırakma Gerginliği",
            "F17.203"
        ]
    },
    {
        "id": "caffeine_intoxication",
        "nameTr": "Kafein Zehirlenmesi (İntoksikasyonu)",
        "nameEn": "Caffeine Intoxication",
        "category": "SUBSTANCE",
        "aliases": [
            "Aşırı Kahve Çarpıntısı",
            "Kafeinizm",
            "F15.929"
        ]
    },
    {
        "id": "caffeine_withdrawal",
        "nameTr": "Kafein Yoksunluğu (Baş Ağrısı, Yorgunluk)",
        "nameEn": "Caffeine Withdrawal",
        "category": "SUBSTANCE",
        "aliases": [
            "Kahve Yoksunluğu",
            "F15.93"
        ]
    },
    {
        "id": "gambling_disorder",
        "nameTr": "Kumar Oynama Bozukluğu (Patolojik Kumar)",
        "nameEn": "Gambling Disorder",
        "category": "SUBSTANCE",
        "aliases": [
            "Patolojik Kumar",
            "Kumar Bağımlılığı",
            "Bahis Bağımlılığı",
            "F63.0"
        ]
    },
    {
        "id": "internet_gaming_disorder",
        "nameTr": "İnternet Oyun Oynama Bozukluğu (Gaming Disorder)",
        "nameEn": "Internet Gaming Disorder",
        "category": "SUBSTANCE",
        "aliases": [
            "Oyun Bağımlılığı",
            "Video Oyunu Bağımlılığı",
            "Dijital Bağımlılık"
        ]
    },
    {
        "id": "compulsive_buying_disorder",
        "nameTr": "Kompulsif Satın Alma Bozukluğu (Oniomani / Alışveriş Bağımlılığı)",
        "nameEn": "Compulsive Buying Disorder (Oniomania)",
        "category": "SUBSTANCE",
        "aliases": [
            "Oniomani",
            "Alışveriş Bağımlılığı"
        ]
    },
    {
        "id": "delirium",
        "nameTr": "Deliryum (Akut Bilinç Bulanıklığı)",
        "nameEn": "Delirium",
        "category": "NEUROCOGNITIVE",
        "aliases": [
            "Akut Konfüzyon",
            "Bilinç Bulanıklığı",
            "Enfeksiyona Bağlı Deliryum",
            "F05"
        ]
    },
    {
        "id": "delirium_hyperactive",
        "nameTr": "Deliryum (Aşırı Hareketli / Hiperaktif Tip)",
        "nameEn": "Delirium (Hyperactive Type)",
        "category": "NEUROCOGNITIVE",
        "aliases": [
            "Ajite Deliryum",
            "F05"
        ]
    },
    {
        "id": "delirium_hypoactive",
        "nameTr": "Deliryum (Durgun / Hipoaktif Tip)",
        "nameEn": "Delirium (Hypoactive Type)",
        "category": "NEUROCOGNITIVE",
        "aliases": [
            "Sessiz Deliryum",
            "Uykulu Deliryum",
            "F05"
        ]
    },
    {
        "id": "major_neurocognitive_alzheimer",
        "nameTr": "Majör Nörobilişsel Bozukluk (Alzheimer Tipi Demans)",
        "nameEn": "Major Neurocognitive Disorder Due to Alzheimer's Disease",
        "category": "NEUROCOGNITIVE",
        "aliases": [
            "Alzheimer",
            "Alzheimer Demansı",
            "Bunama",
            "Yakın Bellek Kaybı",
            "G30.9"
        ]
    },
    {
        "id": "mild_neurocognitive_alzheimer",
        "nameTr": "Hafif Nörobilişsel Bozukluk (Alzheimer Hastalığına Bağlı / MCI)",
        "nameEn": "Mild Neurocognitive Disorder Due to Alzheimer's Disease",
        "category": "NEUROCOGNITIVE",
        "aliases": [
            "Hafif Kognitif Bozukluk",
            "MCI",
            "Erken Bellek Bozukluğu",
            "G31.84"
        ]
    },
    {
        "id": "major_neurocognitive_vascular",
        "nameTr": "Majör Nörobilişsel Bozukluk (Vasküler / Damarsal Demans)",
        "nameEn": "Major Vascular Neurocognitive Disorder",
        "category": "NEUROCOGNITIVE",
        "aliases": [
            "Vasküler Demans",
            "Damarsal Demans",
            "İnme Sonrası Demans",
            "F01.50"
        ]
    },
    {
        "id": "mild_neurocognitive_vascular",
        "nameTr": "Hafif Vasküler Nörobilişsel Bozukluk",
        "nameEn": "Mild Vascular Neurocognitive Disorder",
        "category": "NEUROCOGNITIVE",
        "aliases": [
            "Hafif Damarsal Demans"
        ]
    },
    {
        "id": "major_neurocognitive_frontotemporal",
        "nameTr": "Majör Nörobilişsel Bozukluk (Frontotemporal / Pick Hastalığı)",
        "nameEn": "Major Frontotemporal Neurocognitive Disorder",
        "category": "NEUROCOGNITIVE",
        "aliases": [
            "Frontotemporal Demans",
            "FTD",
            "Pick Hastalığı",
            "G31.09"
        ]
    },
    {
        "id": "major_neurocognitive_lewy_body",
        "nameTr": "Majör Nörobilişsel Bozukluk (Lewy Cisimcikli Demans)",
        "nameEn": "Major Neurocognitive Disorder with Lewy Bodies",
        "category": "NEUROCOGNITIVE",
        "aliases": [
            "Lewy Cisimcikli Demans",
            "DLB",
            "G31.83"
        ]
    },
    {
        "id": "major_neurocognitive_parkinson",
        "nameTr": "Majör Nörobilişsel Bozukluk (Parkinson Hastalığına Bağlı)",
        "nameEn": "Major Neurocognitive Disorder Due to Parkinson's Disease",
        "category": "NEUROCOGNITIVE",
        "aliases": [
            "Parkinson Demansı",
            "G31.83"
        ]
    },
    {
        "id": "major_neurocognitive_tbi",
        "nameTr": "Majör Nörobilişsel Bozukluk (Travmatik Beyin Hasarına Bağlı / CTE)",
        "nameEn": "Major Neurocognitive Disorder Due to Traumatic Brain Injury",
        "category": "NEUROCOGNITIVE",
        "aliases": [
            "TBI Demansı",
            "Boksör Demansı",
            "F07.81"
        ]
    },
    {
        "id": "major_neurocognitive_hiv",
        "nameTr": "Majör Nörobilişsel Bozukluk (HIV Enfeksiyonuna Bağlı)",
        "nameEn": "Major Neurocognitive Disorder Due to HIV Infection",
        "category": "NEUROCOGNITIVE",
        "aliases": [
            "HIV Demansı",
            "AIDS Demans Kompleksi",
            "B20"
        ]
    },
    {
        "id": "major_neurocognitive_prion",
        "nameTr": "Majör Nörobilişsel Bozukluk (Prion Hastalığı / Creutzfeldt-Jakob)",
        "nameEn": "Major Neurocognitive Disorder Due to Prion Disease",
        "category": "NEUROCOGNITIVE",
        "aliases": [
            "Creutzfeldt-Jakob",
            "CJD",
            "Deli Dana",
            "A81.00"
        ]
    },
    {
        "id": "major_neurocognitive_huntington",
        "nameTr": "Majör Nörobilişsel Bozukluk (Huntington Hastalığına Bağlı)",
        "nameEn": "Major Neurocognitive Disorder Due to Huntington's Disease",
        "category": "NEUROCOGNITIVE",
        "aliases": [
            "Huntington Koresi",
            "Genetik Demans",
            "G10"
        ]
    },
    {
        "id": "wernicke_korsakoff_syndrome",
        "nameTr": "Maddenin Yol Açtığı Kalıcı Bellek Bozukluğu (Wernicke-Korsakoff)",
        "nameEn": "Substance-Induced Persisting Amnestic Disorder (Korsakoff)",
        "category": "NEUROCOGNITIVE",
        "aliases": [
            "Korsakoff Sendromu",
            "Alkolik Amnezi",
            "Konfabulasyon (Masallama)",
            "F10.26"
        ]
    },
    {
        "id": "major_neurocognitive_nph",
        "nameTr": "Majör Nörobilişsel Bozukluk (Normal Basınçlı Hidrosefali / Hakim-Adams)",
        "nameEn": "Major Neurocognitive Disorder Due to Normal Pressure Hydrocephalus",
        "category": "NEUROCOGNITIVE",
        "aliases": [
            "NPH",
            "Hakim Adams Sendromu",
            "Yürüme Bozukluğu, İdrar Kaçırma, Demans Triadı"
        ]
    },
    {
        "id": "transient_global_amnesia",
        "nameTr": "Geçici Global Amnezi (TGA)",
        "nameEn": "Transient Global Amnesia (TGA)",
        "category": "NEUROCOGNITIVE",
        "aliases": [
            "TGA",
            "24 Saatlik Akut Bellek Kaybı",
            "G45.4"
        ]
    },
    {
        "id": "major_neurocognitive_multiple",
        "nameTr": "Birden Fazla Etiyolojiye Bağlı Majör Nörobilişsel Bozukluk (Miks Demans)",
        "nameEn": "Major Neurocognitive Disorder Due to Multiple Etiologies",
        "category": "NEUROCOGNITIVE",
        "aliases": [
            "Miks Demans",
            "Alzheimer + Vasküler Demans"
        ]
    },
    {
        "id": "unspecified_neurocognitive",
        "nameTr": "Belirtilmemiş Nörobilişsel Bozukluk",
        "nameEn": "Unspecified Neurocognitive Disorder",
        "category": "NEUROCOGNITIVE",
        "aliases": [
            "F03.90"
        ]
    },
    {
        "id": "paranoid_pd",
        "nameTr": "Paranoid Kişilik Bozukluğu",
        "nameEn": "Paranoid Personality Disorder",
        "category": "PERSONALITY_A",
        "aliases": [
            "Paranoid KB",
            "Aşırı Kuşkuculuk",
            "Komplo Arama",
            "Alınganlık",
            "F60.0"
        ]
    },
    {
        "id": "schizoid_pd",
        "nameTr": "Şizoid Kişilik Bozukluğu",
        "nameEn": "Schizoid Personality Disorder",
        "category": "PERSONALITY_A",
        "aliases": [
            "Şizoid KB",
            "Sosyal Soğukluk",
            "Yalnızlığı Tercih Etme",
            "Duygusal Küntlük",
            "F60.1"
        ]
    },
    {
        "id": "schizotypal_pd_cluster",
        "nameTr": "Şizotipal Kişilik Bozukluğu (Küme A)",
        "nameEn": "Schizotypal Personality Disorder",
        "category": "PERSONALITY_A",
        "aliases": [
            "Şizotipal KB",
            "Büyüsel Düşünce",
            "Garip Davranışlar",
            "F21"
        ]
    },
    {
        "id": "antisocial_pd",
        "nameTr": "Antisosyal Kişilik Bozukluğu (Sosyopati / Psikopati)",
        "nameEn": "Antisocial Personality Disorder",
        "category": "PERSONALITY_B",
        "aliases": [
            "Sosyopati",
            "Psikopati",
            "Kural Tanımazlık",
            "Vicdansızlık",
            "ASPD",
            "F60.2"
        ]
    },
    {
        "id": "borderline_pd",
        "nameTr": "Sınırda (Borderline) Kişilik Bozukluğu",
        "nameEn": "Borderline Personality Disorder",
        "category": "PERSONALITY_B",
        "aliases": [
            "Borderline",
            "BPD",
            "Terk Edilme Korkusu",
            "Splitting",
            "Kendine Zarar Verme",
            "F60.3"
        ]
    },
    {
        "id": "histrionic_pd",
        "nameTr": "Histriyonik Kişilik Bozukluğu",
        "nameEn": "Histrionic Personality Disorder",
        "category": "PERSONALITY_B",
        "aliases": [
            "Histriyonik KB",
            "İlgi Odağı Olma",
            "Dramatiklik",
            "Baştan Çıkarıcılık",
            "F60.4"
        ]
    },
    {
        "id": "narcissistic_pd",
        "nameTr": "Narsisistik Kişilik Bozukluğu",
        "nameEn": "Narcissistic Personality Disorder",
        "category": "PERSONALITY_B",
        "aliases": [
            "Narsisizm",
            "NPD",
            "Büyüklenme",
            "Özel Muamele Beklentisi",
            "Empati Eksikliği",
            "F60.81"
        ]
    },
    {
        "id": "avoidant_pd",
        "nameTr": "Çekingen (Kaçıngan / Avoidant) Kişilik Bozukluğu",
        "nameEn": "Avoidant Personality Disorder",
        "category": "PERSONALITY_C",
        "aliases": [
            "Kaçıngan KB",
            "Yetersizlik Duygusu",
            "Aşağılanma Korkusu",
            "Çekingenlik",
            "F60.6"
        ]
    },
    {
        "id": "dependent_pd",
        "nameTr": "Bağımlı Kişilik Bozukluğu",
        "nameEn": "Dependent Personality Disorder",
        "category": "PERSONALITY_C",
        "aliases": [
            "Bağımlı KB",
            "Yalnız Karar Verememe",
            "Ayrılık Korkusu",
            "F60.7"
        ]
    },
    {
        "id": "ocpd",
        "nameTr": "Obsesif-Kompulsif Kişilik Bozukluğu (OKKB / OCPD)",
        "nameEn": "Obsessive-Compulsive Personality Disorder",
        "category": "PERSONALITY_C",
        "aliases": [
            "OKKB",
            "OCPD",
            "Mükemmeliyetçilik",
            "Kuralcılık",
            "Katı Ahlakçılık",
            "F60.5"
        ]
    },
    {
        "id": "personality_change_due_to_medical",
        "nameTr": "Başka Bir Sağlık Durumuna Bağlı Kişilik Değişikliği (Frontal Lob)",
        "nameEn": "Personality Change Due to Another Medical Condition",
        "category": "PERSONALITY_B",
        "aliases": [
            "Phineas Gage",
            "Frontal Lob Sendromu",
            "F07.0"
        ]
    },
    {
        "id": "passive_aggressive_pd",
        "nameTr": "Pasif-Agresif (Olumsuzlamacı) Kişilik Örüntüsü",
        "nameEn": "Passive-Aggressive Personality Traits",
        "category": "PERSONALITY_C",
        "aliases": [
            "Pasif Agresyon",
            "Gizli İnatlaşma",
            "Erteleme"
        ]
    },
    {
        "id": "voyeuristic",
        "nameTr": "Gözetlemecilik Bozukluğu (Voyörizm)",
        "nameEn": "Voyeuristic Disorder",
        "category": "PARAPHILIC",
        "aliases": [
            "Voyörizm",
            "Röntgencilik",
            "Habersiz Kişiyi Dikizleme",
            "F65.3"
        ]
    },
    {
        "id": "exhibitionistic",
        "nameTr": "Göstermecilik Bozukluğu (Ekzibisyonizm)",
        "nameEn": "Exhibitionistic Disorder",
        "category": "PARAPHILIC",
        "aliases": [
            "Ekzibisyonizm",
            "Genital Teşhir",
            "Teşhircilik",
            "F65.2"
        ]
    },
    {
        "id": "frotteuristic",
        "nameTr": "Sürtünmecilik Bozukluğu (Frotteurizm)",
        "nameEn": "Frotteuristic Disorder",
        "category": "PARAPHILIC",
        "aliases": [
            "Frotteurizm",
            "Toplu Taşımada Rıza Dışı Sürtünme",
            "F65.81"
        ]
    },
    {
        "id": "sexual_masochism",
        "nameTr": "Cinsel Mazoşizm Bozukluğu (Asfiksi Tipi Dahil)",
        "nameEn": "Sexual Masochism Disorder",
        "category": "PARAPHILIC",
        "aliases": [
            "Mazoşizm",
            "Aşağılanma ve Acıdan Cinsel Haz",
            "Otoerotik Asfiksi",
            "F65.51"
        ]
    },
    {
        "id": "sexual_sadism",
        "nameTr": "Cinsel Sadizm Bozukluğu",
        "nameEn": "Sexual Sadism Disorder",
        "category": "PARAPHILIC",
        "aliases": [
            "Sadizm",
            "Başkasına Acı Çektirerek Cinsel Doyum",
            "F65.52"
        ]
    },
    {
        "id": "pedophilic_disorder",
        "nameTr": "Pedofili Bozukluğu",
        "nameEn": "Pedophilic Disorder",
        "category": "PARAPHILIC",
        "aliases": [
            "Pedofili",
            "Sübyancılık",
            "F65.4"
        ]
    },
    {
        "id": "fetishistic_disorder",
        "nameTr": "Fetişizm Bozukluğu",
        "nameEn": "Fetishistic Disorder",
        "category": "PARAPHILIC",
        "aliases": [
            "Fetişizm",
            "Cansız Nesnelere Cinsel İlgi",
            "Ayak Fetişizmi",
            "F65.0"
        ]
    },
    {
        "id": "transvestic_disorder",
        "nameTr": "Karşıgiyim (Travestik) Bozukluğu",
        "nameEn": "Transvestic Disorder",
        "category": "PARAPHILIC",
        "aliases": [
            "Travestik Fetişizm",
            "Karşı Cins Giysisiyle Uyarılma",
            "F65.1"
        ]
    },
    {
        "id": "necrophilia",
        "nameTr": "Nekrofili (Ölü Sevicilik)",
        "nameEn": "Necrophilic Disorder",
        "category": "PARAPHILIC",
        "aliases": [
            "Nekrofili",
            "Ölü Bedenlere Cinsel Çekim",
            "F65.89"
        ]
    },
    {
        "id": "zoophilia",
        "nameTr": "Zoofili (Hayvan Sevicilik / Bestialite)",
        "nameEn": "Zoophilic Disorder",
        "category": "PARAPHILIC",
        "aliases": [
            "Zoofili",
            "Bestialite",
            "F65.89"
        ]
    },
    {
        "id": "coprophilia",
        "nameTr": "Koprofili (Dışkı Fetişizmi)",
        "nameEn": "Coprophilic Disorder",
        "category": "PARAPHILIC",
        "aliases": [
            "Koprofili",
            "Dışkıdan Cinsel Haz",
            "F65.89"
        ]
    },
    {
        "id": "urophilia",
        "nameTr": "Urofili (İdrar Fetişizmi / Altın Yağmur)",
        "nameEn": "Urophilic Disorder",
        "category": "PARAPHILIC",
        "aliases": [
            "Urofili",
            "Altın Yağmur",
            "F65.89"
        ]
    },
    {
        "id": "telephone_scatologia",
        "nameTr": "Telefon Skatolojisi (Müstehcen Telefon Tacizi)",
        "nameEn": "Telephone Scatologia",
        "category": "PARAPHILIC",
        "aliases": [
            "Telefonda Müstehcen Konuşma"
        ]
    },
    {
        "id": "partialism",
        "nameTr": "Kısmi Fetişizm (Beden Parçası Fetişizmi / Ayak, Saç vb.)",
        "nameEn": "Partialism",
        "category": "PARAPHILIC",
        "aliases": [
            "Ayak Fetişi",
            "Podofili"
        ]
    },
    {
        "id": "malingering",
        "nameTr": "Temarruz (Malingering - Maddi/Yasal Kazanç Amaçlı Sahte Hastalık)",
        "nameEn": "Malingering",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Temarruz",
            "Numara Yapma",
            "Askerlikten/Hapisten Kaçma Sahtekarlığı",
            "Z76.5"
        ]
    },
    {
        "id": "neuroleptic_malignant_syndrome",
        "nameTr": "Nöroleptik Malign Sendrom (NMS - Antipsikotik Acili)",
        "nameEn": "Neuroleptic Malignant Syndrome",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "NMS",
            "Kurşun Boru Rijiditesi",
            "Yüksek Ateş ve CK",
            "G21.0"
        ]
    },
    {
        "id": "serotonin_syndrome",
        "nameTr": "Serotonin Sendromu (Toksisitesi)",
        "nameEn": "Serotonin Syndrome",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Serotonerjik Kriz",
            "Klonus, Terleme, Hipertermi",
            "T43.205A"
        ]
    },
    {
        "id": "tardive_dyskinesia",
        "nameTr": "İlacın Yol Açtığı Tardif Diskinezi (İstemsiz Yüz/Dil Hareketleri)",
        "nameEn": "Medication-Induced Tardive Dyskinesia",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Tardif Diskinezi",
            "Orofasial Diskinezi",
            "G24.01"
        ]
    },
    {
        "id": "medication_induced_akathisia",
        "nameTr": "İlacın Yol Açtığı Akatizi (İçsel Yerinde Duramama)",
        "nameEn": "Medication-Induced Acute Akathisia",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Akatizi",
            "Yerinde Duramama",
            "G21.4"
        ]
    },
    {
        "id": "medication_induced_dystonia",
        "nameTr": "İlacın Yol Açtığı Akut Distoni (Tortikollis / Okülogirik Kriz)",
        "nameEn": "Medication-Induced Acute Dystonia",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Akut Distoni",
            "Göz Kayması",
            "Boyun Tutulması",
            "G24.02"
        ]
    },
    {
        "id": "medication_induced_parkinsonism",
        "nameTr": "Nöroleptiklerin Yol Açtığı Parkinsonizm (Rijidite / Titreme)",
        "nameEn": "Neuroleptic-Induced Parkinsonism",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "İlaç Parkinsonizmi",
            "Maske Yüz",
            "G21.11"
        ]
    },
    {
        "id": "antidepressant_discontinuation",
        "nameTr": "Antidepresan Bırakma Sendromu (Kesilme Belirtileri)",
        "nameEn": "Antidepressant Discontinuation Syndrome",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Antidepresan Kesilmesi",
            "Elektrik Çarpması Hissi",
            "F32.89"
        ]
    },
    {
        "id": "borderline_intellectual_functioning",
        "nameTr": "Sınırda Zeka Düzeyi (IQ 70-84)",
        "nameEn": "Borderline Intellectual Functioning",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Sınır Zeka",
            "Donuk Zeka",
            "BIF",
            "IQ 70-84",
            "R41.83"
        ]
    },
    {
        "id": "relational_problem_partner",
        "nameTr": "Eş/Partner İlişkisi Sorunu",
        "nameEn": "Relationship Distress With Spouse or Intimate Partner",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Evlilik Çatışması",
            "Boşanma Krizi",
            "Z63.0"
        ]
    },
    {
        "id": "parent_child_relational_problem",
        "nameTr": "Ebeveyn-Çocuk İlişkisi Sorunu",
        "nameEn": "Parent-Child Relational Problem",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Kuşak Çatışması",
            "Ergen İletişimsizliği",
            "Z62.820"
        ]
    },
    {
        "id": "sibling_relational_problem",
        "nameTr": "Kardeş İlişkisi Sorunu (Kardeş Kıskançlığı)",
        "nameEn": "Sibling Relational Problem",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Kardeş Kıskançlığı",
            "Z62.891"
        ]
    },
    {
        "id": "burnout_syndrome",
        "nameTr": "Tükenmişlik Sendromu (Mesleki Yıpranma)",
        "nameEn": "Burnout Syndrome / Occupational Problem",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Tükenmişlik",
            "Burnout",
            "İş Stresi",
            "Z73.0"
        ]
    },
    {
        "id": "academic_or_educational_problem",
        "nameTr": "Eğitim veya Akademik Sorun",
        "nameEn": "Academic or Educational Problem",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Okul Başarısızlığı",
            "Sınav Kaygısı Yıkımı",
            "Z55.9"
        ]
    },
    {
        "id": "uncomplicated_bereavement",
        "nameTr": "Komplike Olmayan (Normal) Yas",
        "nameEn": "Uncomplicated Bereavement",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Normal Yas",
            "Kayıp Tepkisi",
            "Z63.4"
        ]
    },
    {
        "id": "phase_of_life_problem",
        "nameTr": "Yaşam Evresi Değişimi Sorunu (Emeklilik, Üniversiteye Başlama vb.)",
        "nameEn": "Phase of Life Problem",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Yaşam Dönemi Krizi",
            "Z60.0"
        ]
    },
    {
        "id": "nonadherence_to_medical_treatment",
        "nameTr": "Tıbbi Tedaviye Uyumsuzluk (İlaç Reddi)",
        "nameEn": "Nonadherence to Medical Treatment",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "İlaçları İhmal Etme",
            "Tedavi Reddi",
            "Z91.19"
        ]
    },
    {
        "id": "religious_or_spiritual_problem",
        "nameTr": "Dini veya Ruhsal Problem (İnanç Krizi)",
        "nameEn": "Religious or Spiritual Problem",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "İnanç Krizi",
            "Varoluşsal Kriz",
            "Z71.8"
        ]
    },
    {
        "id": "child_physical_abuse",
        "nameTr": "Çocuk Fiziksel İstismarı (Doğrulanmış)",
        "nameEn": "Child Physical Abuse (Confirmed)",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Çocuk Dayak",
            "T74.12XA"
        ]
    },
    {
        "id": "child_sexual_abuse",
        "nameTr": "Çocuk Cinsel İstismarı (Doğrulanmış)",
        "nameEn": "Child Sexual Abuse (Confirmed)",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Pedofilik İstismar Mağduru",
            "T74.22XA"
        ]
    },
    {
        "id": "child_neglect",
        "nameTr": "Çocuk İhmali (Doğrulanmış)",
        "nameEn": "Child Neglect (Confirmed)",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Çocuk Bakımsızlığı",
            "T74.02XA"
        ]
    },
    {
        "id": "spouse_physical_violence",
        "nameTr": "Eş/Partner Fiziksel Şiddeti",
        "nameEn": "Spouse or Partner Violence, Physical",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Aile İçi Şiddet",
            "T74.11XA"
        ]
    },
    {
        "id": "spouse_psychological_abuse",
        "nameTr": "Eş/Partner Psikolojik İstismarı (Gaslighting)",
        "nameEn": "Spouse or Partner Psychological Abuse",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Psikolojik Şiddet",
            "Gaslighting",
            "T74.31XA"
        ]
    },
    {
        "id": "homelessness",
        "nameTr": "Evsizlik ve Barınma Sorunu",
        "nameEn": "Homelessness",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Evsizlik",
            "Z59.0"
        ]
    },
    {
        "id": "extreme_poverty",
        "nameTr": "Aşırı Yoksulluk ve Ekonomik Yetersizlik",
        "nameEn": "Extreme Poverty",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Maddi Yıkım",
            "Z59.5"
        ]
    },
    {
        "id": "social_exclusion_rejection",
        "nameTr": "Sosyal Dışlanma ve Reddedilme",
        "nameEn": "Social Exclusion or Rejection",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Sosyal İzolasyon",
            "Z60.4"
        ]
    },
    {
        "id": "target_of_discrimination",
        "nameTr": "Ayrımcılık veya Nefret Suçu Mağduriyeti",
        "nameEn": "Target of (Perceived) Discrimination or Persecution",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Ayrımcılık",
            "Z60.5"
        ]
    },
    {
        "id": "acculturation_difficulty",
        "nameTr": "Kültürleşme ve Göç Uyum Güçlüğü",
        "nameEn": "Acculturation Difficulty",
        "category": "OTHER_CLINICAL",
        "aliases": [
            "Göçmen Uyumsuzluğu",
            "Z60.3"
        ]
    },
    {
        "id": "other_specified_anxiety",
        "nameTr": "Belirlenmiş Diğer Bir Anksiyete Bozukluğu (Sınırlı Belirtili Panik vb.)",
        "nameEn": "Other Specified Anxiety Disorder",
        "category": "ANXIETY",
        "aliases": [
            "Kısa Süreli Anksiyete",
            "F41.8"
        ]
    },
    {
        "id": "other_specified_ocd",
        "nameTr": "Belirlenmiş Diğer Bir OKB ve İlişkili Bozukluk (Obsesyonel Kıskançlık / Koro)",
        "nameEn": "Other Specified Obsessive-Compulsive and Related Disorder",
        "category": "OCD_RELATED",
        "aliases": [
            "Koro Sendromu",
            "Obsesyonel Kıskançlık",
            "F42.8"
        ]
    },
    {
        "id": "other_specified_trauma",
        "nameTr": "Belirlenmiş Diğer Bir Travma ve Stresörle İlişkili Bozukluk",
        "nameEn": "Other Specified Trauma- and Stressor-Related Disorder",
        "category": "TRAUMA",
        "aliases": [
            "Süregen Karmaşık Yas",
            "F43.8"
        ]
    },
    {
        "id": "other_specified_somatic",
        "nameTr": "Belirlenmiş Diğer Bir Bedensel Belirti Bozukluğu",
        "nameEn": "Other Specified Somatic Symptom and Related Disorder",
        "category": "SOMATIC",
        "aliases": [
            "Kısa Süreli Somatizasyon",
            "F45.8"
        ]
    },
    {
        "id": "other_specified_feeding",
        "nameTr": "Belirlenmiş Diğer Bir Beslenme ve Yeme Bozukluğu (Sınırlı Tıkınma)",
        "nameEn": "Other Specified Feeding or Eating Disorder",
        "category": "EATING",
        "aliases": [
            "OSFED",
            "EDNOS",
            "F50.89"
        ]
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DSM_CATEGORIES, DIAGNOSES_DATABASE };
}
