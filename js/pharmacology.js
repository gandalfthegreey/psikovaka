/**
 * PsikoVaka - Klinik Psikofarmakoloji ve Biyolojik Tedaviler Kütüphanesi
 * DSM-5-TR, Stahl's Essential Psychopharmacology ve Maudsley Prescribing Guidelines
 * rehberliğinde 8 ilaç/müdahale ailesi, 34 altın standart protokol ve vaka eşleştirici.
 */

const PHARMACOLOGY_FAMILIES = {
    "ANTIDEPRESSANTS": {
        "id": "ANTIDEPRESSANTS",
        "name": "Antidepresanlar (SSRI, SNRI, TAD, Atipik)",
        "icon": "💊",
        "color": "#6366f1"
    },
    "ANTIPSYCHOTICS": {
        "id": "ANTIPSYCHOTICS",
        "name": "Antipsikotikler (Tipik, Atipik & Klozapin)",
        "icon": "🧪",
        "color": "#ec4899"
    },
    "MOOD_STABILIZERS": {
        "id": "MOOD_STABILIZERS",
        "name": "Duygudurum Dengeleyiciler & Antiepileptikler",
        "icon": "⚖️",
        "color": "#f59e0b"
    },
    "ANXIOLYTICS_HYPNOTICS": {
        "id": "ANXIOLYTICS_HYPNOTICS",
        "name": "Anksiyolitikler, Hipnotikler & Sempatolitikler",
        "icon": "🌙",
        "color": "#06b6d4"
    },
    "STIMULANTS_WAKEFULNESS": {
        "id": "STIMULANTS_WAKEFULNESS",
        "name": "Nörostimülanlar & Dikkat/Uyku Ajanları",
        "icon": "⚡",
        "color": "#10b981"
    },
    "ADDICTION_ANTIDOTES": {
        "id": "ADDICTION_ANTIDOTES",
        "name": "Bağımlılık Farmakoterapisi & Acil Antidotlar",
        "icon": "🚑",
        "color": "#ef4444"
    },
    "NEURO_MOVEMENT": {
        "id": "NEURO_MOVEMENT",
        "name": "EPS, Hareket Bozukluğu & Demans İlaçları",
        "icon": "🧠",
        "color": "#8b5cf6"
    },
    "SOMATIC_BIOLOGICAL": {
        "id": "SOMATIC_BIOLOGICAL",
        "name": "Somatik/Cerrahi Müdahaleler & İlaçsız Protokol",
        "icon": "🏥",
        "color": "#14b8a6"
    }
};

const PHARMACOLOGY_DATABASE = [
    {
        "id": "ssri_firstline",
        "nameTr": "SSRI (Seçici Serotonin Geri Alım İnhibitörü - Sertralin / Essitalopram / Fluoksetin)",
        "nameEn": "Selective Serotonin Reuptake Inhibitors (SSRIs - Sertraline / Escitalopram / Fluoxetine)",
        "family": "ANTIDEPRESSANTS",
        "aliases": [
            "SSRI",
            "Sertralin",
            "Essitalopram",
            "Fluoksetin",
            "Paroksetin",
            "Fluvoksamin",
            "Seçici Serotonin Geri Alım İnhibitörü"
        ],
        "goldForDiagnoses": [
            "mdd",
            "dysthymia",
            "panic_disorder",
            "agoraphobia",
            "social_anxiety",
            "ocd",
            "bdd",
            "ptsd",
            "bulimia_nervosa",
            "pmdd",
            "selective_mutism",
            "separation_anxiety",
            "illness_anxiety_disorder",
            "premature_ejaculation",
            "hoarding_disorder"
        ],
        "shortDefinition": "Majör depresyon, anksiyete bozuklukları, OKB, TSSB, PMDD ve Bulimiya Nervozada güvenlik profili ve kanıt düzeyi nedeniyle birinci basamak altın standart farmakoterapidir.",
        "mechanism": "Presinaptik serotonin taşıyıcısını (SERT) seçici olarak bloke ederek sinaptik aralıkta 5-HT düzeyini artırır; 3-6 hafta içinde otoreseptör (5-HT1A) duyarsızlaşması ve BDNF aracılı nöroplastisite sağlar.",
        "targetMechanism": "SERT blokajı, 5-HT1A otoreseptör down-regülasyonu ve BDNF ekspresyonu artışı.",
        "protocolSteps": [
            "1. Endikasyona Göre Başlangıç: Panik ve anksiyetede başlangıç ajitasyonunu (jitteriness) önlemek için düşük dozla başlama (örn. Sertralin 25 mg/gün veya Essitalopram 5 mg/gün).",
            "2. Hedef Doz Titrasyonu: Depresyon ve anksiyetede standart terapötik doza; OKB, BDD ve Bulimiya Nervozada (Fluoksetin 60 mg/gün) yüksek serotonerjik dozlara çıkma.",
            "3. Yan Etki ve Elektrolit İzlemi: İlk 2 hafta gastrointestinal bulantı, cinsel işlev bozukluğu (anorgazmi/gecikmiş ejakülasyon) ve yaşlılarda hiponatremi (SIADH) takibi.",
            "4. İdame ve Kademeli Kesim: İlk epizodda remisyon sonrası en az 6-12 ay sürdürme; Paroksetin/Sertralin kesilirken elektrik çarpması hissi (brain zaps) oluşmaması için kademeli azaltma."
        ],
        "pitfalls": "DİKKAT (Black-Box): 24 yaş altı gençlerde ilk haftalarda intihar düşüncesini ve aktivasyonu artırabilir. Örtük Bipolar bozuklukta duygudurum dengeleyici olmadan tek başına SSRI verilmesi manik kaymaya (switch) yol açar; MAOİ veya triptanlarla kombinasyonu ölümcül Serotonin Sendromu tetikler."
    },
    {
        "id": "snri_dualex",
        "nameTr": "SNRI (Serotonin-Noradrenalin Geri Alım İnhibitörü - Venlafaksin / Duloksetin)",
        "nameEn": "Serotonin-Norepinephrine Reuptake Inhibitors (SNRIs - Venlafaxine XR / Duloxetine)",
        "family": "ANTIDEPRESSANTS",
        "aliases": [
            "SNRI",
            "Venlafaksin",
            "Duloksetin",
            "Milnasipran",
            "Desvenlafaksin",
            "İkili Etkili Antidepresan"
        ],
        "goldForDiagnoses": [
            "gad",
            "somatic_symptom_disorder",
            "mdd",
            "other_specified_somatic"
        ],
        "shortDefinition": "Yaygın Anksiyete Bozukluğu (YAB), kronik ağrının eşlik ettiği Somatik Belirti Bozukluğu, fibromiyalji ve melankolik/dirençli depresyonda hem serotonerjik hem noradrenerjik etki sunan birinci basamak ajandır.",
        "mechanism": "SERT ve Noradrenalin Taşıyıcısını (NET) eşzamanlı inhibe eder; prefrontal kortekste noradrenalin ve dopamini artırırken inen spinal ağrı yolaklarında ağrı kapısını kapatır.",
        "targetMechanism": "Çift yönlü SERT ve NET inhibisyonu ile inen antinosiseptif ağrı yolaklarının güçlendirilmesi.",
        "protocolSteps": [
            "1. Klinik Seçim: Kronik kas-iskelet/nöropatik ağrısı olan Somatik Belirti Bozukluğu ve YAB'de Duloksetin (30-60 mg/gün); ağır anksiyeteli depresyonda Venlafaksin XR (75-225 mg/gün) başlanması.",
            "2. Doza Bağımlı Kademeli Artış: Venlafaksin düşük dozda (75 mg) ağırlıklı SSRI gibi çalışırken, 150 mg ve üzerinde güçlü noradrenerjik (NET) etkinin devreye girmesi.",
            "3. Kardiyovasküler ve Karaciğer Takibi: Venlafaksin kullanımında doza bağımlı diyastolik hipertansiyon açısından düzenli tansiyon ölçümü; Duloksetinde karaciğer enzim (ALT/AST) kontrolü.",
            "4. Kesilme Sendromundan Korunma: Kısa yarı ömür nedeniyle tek doz atlandığında bile şiddetli baş dönmesi ve parestezi gelişebileceğinden çok yavaş azaltma veya Fluoksetin köprülemesi."
        ],
        "pitfalls": "Kontrolsüz hipertansiyon hastalarında yüksek doz Venlafaksin kan basıncını tehlikeli düzeyde yükseltebilir. Duloksetin kronik karaciğer hastalığında ve ağır böbrek yetmezliğinde kontrendikedir."
    },
    {
        "id": "clomipramine_ocd",
        "nameTr": "Klomipramin (Serotonerjik Trisiklik Antidepresan)",
        "nameEn": "Clomipramine (Serotonergic Tricyclic Antidepressant - TCA)",
        "family": "ANTIDEPRESSANTS",
        "aliases": [
            "Klomipramin",
            "Anafranil",
            "Trisiklik Antidepresan",
            "TAD",
            "TCA"
        ],
        "goldForDiagnoses": [
            "ocd",
            "trichotillomania",
            "excoriation",
            "other_specified_ocd"
        ],
        "shortDefinition": "SSRI tedavisine dirençli ağır Obsesif-Kompulsif Bozukluk (OKB) ile Trikotillomani ve Deri Yolma Bozukluğunda (N-Asetilsistein ile birlikte) en güçlü serotonerjik etkinliğe sahip referans trisiklik ajandır.",
        "mechanism": "Ana bileşik güçlü SERT inhibisyonu yaparken, aktif metaboliti desmetilklomipramin güçlü NET inhibisyonu sağlar; ek olarak H1, M1 ve Alfa-1 reseptör blokajı gösterir.",
        "targetMechanism": "Potent SERT/NET blokajı ile kortiko-striato-talamo-kortikal (CSTC) obsesyon döngüsünün baskılanması.",
        "protocolSteps": [
            "1. Bazal Kardiyak Tarama: Tedavi öncesi mutlaka EKG çekilerek QTc mesafesinin ve ileti bozukluklarının (dal bloğu) dışlanması.",
            "2. Düşük Doz Başlangıç ve Yavaş Titrasyon: Gece 25 mg ile başlanıp ortostatik hipotansiyon ve sedasyon toleransına göre 100-250 mg/gün aralığına çıkılması.",
            "3. Antikolinerjik Yan Etki Yönetimi: Ağız kuruluğu, kabızlık, bulanık görme ve idrar retansiyonu açısından hastanın bilgilendirilmesi.",
            "4. Nöbet Eşiği ve İlaç Düzeyi: 250 mg/gün üzerindeki dozlarda konvülsiyon riski arttığından maksimum doz sınırına ve CYP2D6/1A2 etkileşimlerine dikkat edilmesi."
        ],
        "pitfalls": "HAYATİ RİSK: Doz aşımında (intihar girişimi) sodyum kanalı blokajına bağlı ölümcül ventriküler aritmi (QRS genişlemesi, Torsades de Pointes) ve status epileptikus yapar; aktif suisidal hastaya kutuyla reçete edilmemeli, yakın mesafeli EKG ile izlenmelidir."
    },
    {
        "id": "bupropion_ndri",
        "nameTr": "Bupropion (NDRI - Dopamin/Noradrenalin Geri Alım İnhibitörü)",
        "nameEn": "Bupropion XL/SR (Norepinephrine-Dopamine Reuptake Inhibitor - NDRI)",
        "family": "ANTIDEPRESSANTS",
        "aliases": [
            "Bupropion",
            "Wellbutrin",
            "Zyban",
            "NDRI",
            "Dopaminerjik Antidepresan"
        ],
        "goldForDiagnoses": [
            "mdd",
            "tobacco_use_disorder",
            "substance_induced_sexual_dysfunction",
            "erectile_disorder",
            "cocaine_withdrawal",
            "amphetamine_withdrawal"
        ],
        "shortDefinition": "Mevsimsel Depresyon (Kış Depresyonu), hipersomni ve anhedoni baskın Atipik Depresyon, Nikotin/Tütün Bağımlılığı ve SSRI kaynaklı cinsel işlev bozukluğunda serotonerjik yan etki yapmayan aktive edici antidepresandır.",
        "mechanism": "Serotonin sistemi üzerinde etki göstermeksizin Dopamin (DAT) ve Noradrenalin (NET) taşıyıcılarını bloke eder; ayrıca nikotinik asetilkolin reseptörlerinde (nAChR) non-kompetitif antagonizma yaparak sigara aşermesini keser.",
        "targetMechanism": "Prefrontal ve nukleus akumbens DAT/NET blokajı + nikotinik reseptör antagonizması.",
        "protocolSteps": [
            "1. Sabah Dozlaması: İnsomni yapmaması için Bupropion XL 150 mg sabah tek doz başlanması, gerekirse 300 mg/gün hedef doza çıkılması.",
            "2. Sigara Bırakma Protokolü: Tütün kullanım bozukluğunda hedef bırakma tarihinden 1-2 hafta önce başlanıp Nikotin Replasman Tedavisi (NRT) ile kombine edilmesi.",
            "3. SSRI Cinsel Disfonksiyon Antidotu: SSRI nedeniyle anorgazmi veya erektil kayıp yaşayan hastalarda geçiş ajanı veya ekleme (augmentasyon) olarak kullanılması.",
            "4. Kilo ve Metabolik Avantaj: İştah artışı ve sedasyon yapmadığından obezite ve hipersomni eşlikli depresyonda önceliklendirilmesi."
        ],
        "pitfalls": "KESİN KONTRENDİKASYON: Nöbet eşiğini düşürdüğü için epilepsi öyküsü olanlarda, Bulimiya Nervoza / Anoreksiya Nervoza hastalarında (elektrolit dengesizliği + nöbet riski) ve ani alkol/benzodiazepin kesilmesinde KESİNLİKLE KULLANILMAZ!"
    },
    {
        "id": "mirtazapine_nassa",
        "nameTr": "Mirtazapin (NaSSA - Alfa-2 Antagonisti Atipik Antidepresan)",
        "nameEn": "Mirtazapine (Noradrenergic and Specific Serotonergic Antidepressant - NaSSA)",
        "family": "ANTIDEPRESSANTS",
        "aliases": [
            "Mirtazapin",
            "Remeron",
            "NaSSA",
            "Trazodon",
            "Gece Antidepresanı"
        ],
        "goldForDiagnoses": [
            "insomnia_disorder",
            "arfid",
            "mdd"
        ],
        "shortDefinition": "Şiddetli uykusuzluk (insomni), kilo kaybı, iştahsızlık ve bulantının ön planda olduğu depresif tablolarda ve ARFID'de uyku mimarisini koruyarak iştah ve derin uyku sağlayan atipik antidepresandır.",
        "mechanism": "Presinaptik Alfa-2 otoreseptör ve heteroreseptörleri bloke ederek hem noradrenalin hem serotonin salınımını artırır; 5-HT2A, 5-HT2C (iştah artışı), 5-HT3 (antiemetik etki) ve H1 (güçlü sedasyon) reseptörlerini bloke eder.",
        "targetMechanism": "Alfa-2 antagonizması + 5-HT2A/2C/3 ve H1 reseptör blokajı.",
        "protocolSteps": [
            "1. Gece Yatmadan Önce Uygulama: Güçlü H1 antihistaminik sedasyon etkisi nedeniyle gece 15 mg olarak başlanması (Paradoksal olarak 7.5-15 mg düşük dozlar, yüksek dozlardan daha sedatiftir).",
            "2. Antiemetik ve İştah Desteği: 5-HT3 blokajı (Ondansetron benzeri etki) sayesinde kusma korkusu, mide bulantısı ve ARFID/kaşeksi kaynaklı beslenme reddini kırma.",
            "3. Venlafaksin + Mirtazapin (California Rocket Fuel): Ağır dirençli depresyonda SNRI ile kombine edilerek sinerjik monoaminerjik güçlendirme.",
            "4. Metabolik İzlem: Kilo alımı, lipid profili (trigliserid) ve sabah sersemliği (hangover) açısından takip."
        ],
        "pitfalls": "Obezite, metabolik sendrom ve Huzursuz Bacaklar Sendromu (RLS) olan hastalarda dikkatli olunmalıdır (Mirtazapin Huzursuz Bacaklar Sendromunu şiddetlendirebilir)."
    },
    {
        "id": "ssri_plus_antipsychotic",
        "nameTr": "Antidepresan (SSRI/SNRI) + Atipik Antipsikotik Kombinasyonu",
        "nameEn": "Antidepressant (SSRI/SNRI) + Second-Generation Antipsychotic Augmentation",
        "family": "ANTIDEPRESSANTS",
        "aliases": [
            "SSRI + Atipik Antipsikotik",
            "Antidepresan Güçlendirme",
            "Fluoksetin + Olanzapin",
            "Sertralin + Aripiprazol",
            "Sertralin + Risperidon"
        ],
        "goldForDiagnoses": [
            "mdd",
            "other_specified_ocd",
            "schizoaffective",
            "borderline_pd"
        ],
        "shortDefinition": "Psikotik Özellikli Majör Depresyon, sanrısal boyuta ulaşan içgörüsüz OKB/Koku Referans Bozukluğu ve ağır dürtüsel/mikro-psikotik krizlerle seyreden komorbid Sınırda (Borderline) Kişilik Bozukluğunda uygulanan kombine protokoldür.",
        "mechanism": "SSRI/SNRI ile serotonerjik/noradrenerjik tonus artırılırken, düşük doz atipik antipsikotik (Aripiprazol, Risperidon, Olanzapin veya Ketiapin) ile mezolimbik D2 ve 5-HT2A reseptörleri modüle edilerek sanrısal suçluluk/referans fikirleri ve afektif fırtına kontrol altına alınır.",
        "targetMechanism": "SERT/NET inhibisyonu + 5-HT2A/D2 reseptör antagonizması/parsiyel agonizması sinerjisi.",
        "protocolSteps": [
            "1. Psikotik Depresyonda Zorunlu Kombinasyon: Psikotik özellikli depresyonda tek başına antidepresan etkisiz olduğundan baştan itibaren SSRI/SNRI + Olanzapin/Ketiapin/Risperidon kombinasyonu başlanması.",
            "2. İçgörüsüz OKB ve Referans Sanrıları: Koku Referans Bozukluğu veya dirençli OKB'de yüksek doz SSRI tedavisine düşük doz Risperidon (0.5-2 mg) veya Aripiprazol (2.5-10 mg) eklenmesi.",
            "3. Semptom Hedefli Kriz Kontrolü: Ağır komorbid Borderline tablolarda kendine zarar verme ve dissosiyatif/paranoid kırılmaları yatıştırmak için DBT eşliğinde düşük doz atipik antipsikotik + SSRI stabilizasyonu.",
            "4. Metabolik ve EPS İzlemi: Kilo, açlık kan şekeri, prolaktin ve akatizi takibi."
        ],
        "pitfalls": "Psikotik depresyon hastasına antipsikotik eklemeden YALNIZCA antidepresan vermek ajitasyonu ve sanrısal intihar riskini alevlendirir. Borderline kişilikte ise çoklu yüksek doz polifarmasi ve benzodiazepinlerden kaçınılmalıdır."
    },
    {
        "id": "atypical_ap_secondgen",
        "nameTr": "İkinci Kuşak (Atipik) Antipsikotik (Risperidon / Aripiprazol / Olanzapin)",
        "nameEn": "Second-Generation (Atypical) Antipsychotics (Risperidone / Aripiprazole / Olanzapine)",
        "family": "ANTIPSYCHOTICS",
        "aliases": [
            "Atipik Antipsikotik",
            "İkinci Kuşak Antipsikotik",
            "Risperidon",
            "Aripiprazol",
            "Olanzapin",
            "Ketiapin",
            "Paliperidon"
        ],
        "goldForDiagnoses": [
            "schizophrenia",
            "schizophreniform",
            "brief_psychotic",
            "schizoaffective",
            "schizotypal_pd",
            "delusional_disorder",
            "asd",
            "dmdd",
            "other_specified_schizophrenia_spectrum",
            "substance_induced_psychotic"
        ],
        "shortDefinition": "Şizofreni spektrumu bozuklukları, akut psikotik epizodlar, Capgras sendromu, Otizm Spektrum Bozukluğunda şiddetli irritabilite/öfke krizleri ve Anoreksiya Nervozada beden algısı katılığında birinci basamak antipsikotik grubudur.",
        "mechanism": "Mezolimbik yolakta Dopamin D2 reseptörlerini bloke ederek (veya Aripiprazolde D2 parsiyel agonizması yaparak) pozitif psikotik semptomları (sanrı, varsanı) susturur; eşzamanlı 5-HT2A kortikal antagonizması ile nigrostriatal ve mezokortikal dopamini koruyarak EPS riskini azaltır.",
        "targetMechanism": "Mezolimbik D2 antagonizması/parsiyel agonizması ve serotonerjik 5-HT2A blokajı.",
        "protocolSteps": [
            "1. Bireyselleştirilmiş Ajan Seçimi: İlk atak psikoz ve ajitasyonda Risperidon (2-6 mg) veya Olanzapin (10-20 mg); metabolik ve prolaktin koruyucu profil gerektiğinde Aripiprazol (10-30 mg) seçimi.",
            "2. Pediatrik ve Nörogelişimsel Onay: Otizm (OSB) ve DMDD'de kendine zarar verme ve yıkıcı öfke nöbetlerinde FDA onaylı düşük doz Risperidon (0.5-2 mg) veya Aripiprazol.",
            "3. Uzun Etkili Enjektabl (LAI / Depo) Planı: İçgörüsü zayıf ve ilaç uyumsuzluğu olan şizofreni hastalarında Paliperidon palmitat veya Aripiprazol maintena depo formlarına geçiş.",
            "4. Metabolik ve Endokrin Takip: Bel çevresi, açlık glukozu, HbA1c, lipid paneli (özellikle Olanzapin/Klozapinde) ve hiperprolaktinemi/jinekomasti (özellikle Risperidonda) izlemi."
        ],
        "pitfalls": "Demans ilişkili psikozu olan yaşlı hastalarda tüm antipsikotikler serebrovasküler olay (inme) ve ölüm riskini artırır (Black-Box). Risperidon prolaktini en çok yükselten atipik iken, Olanzapin en fazla kilo alımı ve diyabet riski taşıyanlardan biridir."
    },
    {
        "id": "clozapine_resistant",
        "nameTr": "Klozapin (Tedaviye Dirençli Şizofreni & Tardif Diskinezi Geçişi)",
        "nameEn": "Clozapine (Treatment-Resistant Schizophrenia & Suicidality Gold Standard)",
        "family": "ANTIPSYCHOTICS",
        "aliases": [
            "Klozapin",
            "Leponex",
            "Dirençli Şizofreni Protokolü",
            "Clozapine"
        ],
        "goldForDiagnoses": [
            "schizophrenia"
        ],
        "shortDefinition": "En az 2 farklı antipsikotiğin yeterli doz ve sürede (6'şar hafta) kullanılmasına rağmen yanıt alınamayan Tedaviye Dirençli Şizofrenide, kronik intihar riskinde ve ağır Tardif Diskinezi gelişen psikoz hastalarında tek altın standart ajandır.",
        "mechanism": "D2 reseptörlerine zayıf ve hızlı ayrışan (fast-off) bağlanma gösterirken; D4, 5-HT2A, 5-HT1A, M1-M4 ve alfa reseptörleri üzerinden benzersiz multimodal etki sağlar; EPS ve hiperprolaktinemi yapmaz.",
        "targetMechanism": "Düşük D2 afinitesi (Hızlı ayrışma) + güçlü 5-HT2A/D4 blokajı ve glutamaterjik modülasyon.",
        "protocolSteps": [
            "1. Zorunlu Hematolojik İzlem (ANC Protokolü): Agranülositoz riskine karşı başlangıçta lökosit (WBC) ve mutlak nötrofil sayısı (ANC >= 1500/mm³) kontrolü; ilk 6 ay haftalık, sonraki 6 ay 2 haftada bir, ardından aylık hemogram.",
            "2. Yavaş Titrasyon: Ortostatik hipotansiyon, miyokardit ve nöbet riskini önlemek için 12.5 mg/gün ile başlanıp 2-3 haftada hedef 300-450 mg/gün (plazma düzeyi >350 ng/mL) dozuna çıkılması.",
            "3. Kardiyak ve GİS Takibi: İlk ayda ateş ve göğüs ağrısı gelişirse Troponin ve CRP ile Klozapin miyokarditinin dışlanması; ölümcül paralitik ileusa karşı profilaktik laksatif başlanması.",
            "4. Siyalora (Gece Salya Akması) Yönetimi: Yastığı ıslatan aşırı salivasyon için gece dil altı atropin damla veya ipratropium sprey uygulanması."
        ],
        "pitfalls": "KARA KUTU UYARISI (5 Büyük Risk): 1) Ölümcül Agranülositoz (ANC <1000 ise derhal kesilir!), 2) Miyokardit/Kardiyomiyopati, 3) Doza bağımlı Grand Mal Nöbetler (>600 mg/gün), 4) Ağır Gastrointestinal Hipomotilite (İleus), 5) Metabolik Sendrom. Karbamazepin ile birlikte kemik iliği baskılanması nedeniyle KESİNLİKLE KULLANILMAZ!"
    },
    {
        "id": "haloperidol_acute",
        "nameTr": "Tipik Antipsikotik (Haloperidol / Klorpromazin) & Düşük Doz Nöroleptik",
        "nameEn": "First-Generation Antipsychotics (Haloperidol) & Delirium Agitation Protocol",
        "family": "ANTIPSYCHOTICS",
        "aliases": [
            "Haloperidol",
            "Nörodol",
            "Tipik Antipsikotik",
            "Birinci Kuşak Antipsikotik",
            "Klorpromazin",
            "Deliryum Protokolü"
        ],
        "goldForDiagnoses": [
            "delirium",
            "phencyclidine_use_disorder"
        ],
        "shortDefinition": "Akut Hiperaktif Deliryumda (antikolinerjik yükü sıfıra yakın olduğu için) ve acil servis ağır psikomotor ajitasyonlarında altta yatan organik neden tedavi edilirken kullanılan yüksek potensli D2 antagonistidir.",
        "mechanism": "Mezolimbik ve nigrostriatal yolaklarda postsinaptik Dopamin D2 reseptörlerini güçlü biçimde bloke eder; muskarinik (M1) antikolinerjik etkisi minimaldir.",
        "targetMechanism": "Yüksek potensli seçici Dopamin D2 reseptör blokajı.",
        "protocolSteps": [
            "1. Deliryumda Altta Yatan Nedenin Çözümü: İdrar yolu enfeksiyonu, pnömoni, hipoksi, elektrolit bozukluğu veya antikolinerjik ilaç toksisitesinin derhal düzeltilmesi.",
            "2. Non-Farmakolojik Oryantasyon: Odanın aydınlatılması, saat/takvim konulması, gözlük ve işitme cihazının takılması, aile bireyinin refakati.",
            "3. Düşük Doz Haloperidol: Şiddetli ajitasyon ve kateter çekme riskinde antikolinerjik deliryumu derinleştirmeyen düşük doz Haloperidol (0.5 - 1 mg PO/IM) uygulanması.",
            "4. EKG ve EPS Monitörizasyonu: Özellikle IV kullanımda QTc uzaması (Torsades de Pointes) ve akut distoni/parkinsonizm açısından yakın izlem."
        ],
        "pitfalls": "KRİTİK TUZAK: Alkol/sedatif yoksunluğu dışındaki tüm Deliryum vakalarında Benzodiazepinler (Lorazepam, Diazepam) ve Antikolinerjikler bilinç bulanıklığını daha da KÖTÜLEŞTİRİR! Ayrıca Lewy Cisimcikli Demans ve Parkinson hastalarında Haloperidol ağır nöroleptik duyarlılık ve ölümcül rijidite yaptığı için KONTRENDİKEDİR!"
    },
    {
        "id": "pimozide_delusional",
        "nameTr": "Pimozid / Risperidon (Monosemptomatik Sanrılı Bozukluk Protokolü)",
        "nameEn": "Low-Dose Risperidone / Pimozide / Aripiprazole (Delusional Disorder Protocol)",
        "family": "ANTIPSYCHOTICS",
        "aliases": [
            "Pimozid",
            "Sanrılı Bozukluk Farmakoterapisi",
            "Düşük Doz Risperidon",
            "Othello / Clérambault Protokolü",
            "Ekbom Protokolü"
        ],
        "goldForDiagnoses": [
            "delusional_disorder",
            "other_specified_somatic"
        ],
        "shortDefinition": "Kıskançlık (Othello), Erotomanik (Clérambault), Persekütuar ve Somatik (Ekbom / Delüzyonel Parazitoz) tip Sanrılı Bozukluklarda ve Psödosiyeziste terapötik ittifak kurularak uygulanan düşük doz antipsikotik protokoldür.",
        "mechanism": "Kapsüllü monosemptomatik sanrı ağını besleyen mezolimbik hiperdopaminerjik aktiviteyi D2/5-HT2A antagonizması ile kademeli olarak zayıflatır; sanrıya eşlik eden afektif gerilimi düşürür.",
        "targetMechanism": "Hedefli mezolimbik D2/5-HT2A blokajı ile kapsüllü sanrı yatırımının (salience) azaltılması.",
        "protocolSteps": [
            "1. İttifak Odaklı İlaç Sunumu: İçgörüsü olmayan hastaya 'Sen hayal görüyorsun' demeden, 'Bu durumun yarattığı yoğun stres, uykusuzluk ve gerginliği azaltmak için' diyerek düşük doz Risperidon (1-3 mg) veya Aripiprazol başlanması.",
            "2. Somatik Tip (Ekbom) ve Pimozid: Klasik literatürde somatik sanrılarda (delüzyonel parazitoz) tarihsel referans olan Pimozid yerine güncel pratikte kardiyak açıdan daha güvenli olan Risperidon/Olanzapin tercih edilmesi.",
            "3. Psödosiyezis (Yalancı Gebelik) Yönetimi: Dopamin antagonizması/prolaktin dengesinin düzenlenmesi, pelvik ultrason kanıtının empatik sunumu ve altta yatan depresyonun tedavisi.",
            "4. Adli Risk Yönetimi: Othello (kıskançlık) ve Erotomanik tiplerde eşe/hedef kişiye yönelik şiddet veya ısrarlı takip (stalking) riskinin yakından izlenmesi."
        ],
        "pitfalls": "Pimozid yüksek QTc uzaması ve ventriküler aritmi riski taşır; makrolid antibiyotikler, azol antifungaller ve SSRI'larla (CYP2D6/3A4 inhibisyonu) birlikte kullanılması ölümcül Torsades de Pointes başlatabilir."
    },
    {
        "id": "lithium_gold",
        "nameTr": "Lityum Karbonat (Altın Standart Duygudurum Dengeleyici & Anti-Suisidal)",
        "nameEn": "Lithium Carbonate (Gold Standard Mood Stabilizer & Anti-Suicidal Agent)",
        "family": "MOOD_STABILIZERS",
        "aliases": [
            "Lityum",
            "Lithuril",
            "Lityum Karbonat",
            "Duygudurum Dengeleyici",
            "Lithium"
        ],
        "goldForDiagnoses": [
            "bipolar_1",
            "cyclothymia",
            "other_specified_bipolar",
            "unspecified_bipolar"
        ],
        "shortDefinition": "Bipolar I Bozuklukta klasik öforik manik atak tedavisi, uzun dönem atak profilaksisi, Siklotimi ve Kleine-Levin Sendromunda altın standart olan; psikiyatride doğrudan kanıtlanmış anti-suisidal etkiye sahip tek duygudurum dengeleyicidir.",
        "mechanism": "İnositol monofosfatazı (IMPase) inhibe ederek aşırı aktif ikincil mesajcı (IP3/DAG) kaskadını yavaşlatır; GSK-3β (Glikojen Sentaz Kinaz-3) inhibisyonu ve BDNF/Bcl-2 artışı ile nöroprotektif etki gösterir.",
        "targetMechanism": "İnositol tükenmesi (IMPase inhibisyonu), GSK-3β inhibisyonu ve nöroproteksiyon.",
        "protocolSteps": [
            "1. Tedavi Öncesi Bazal Tarama: Böbrek fonksiyonları (Üre, Kreatinin, eGFR), Tiroid paneli (TSH, sT4), Elektrolitler (Na, Ca), EKG ve doğurganlık çağındaki kadınlarda Beta-hCG gebelik testi.",
            "2. Terapötik Kan Düzeyi Titrasyonu (TDM): Son dozdan tam 12 saat sonra alınan kanda Akut Manide 0.8 - 1.2 mEq/L; İdame Profilakside 0.6 - 0.8 mEq/L düzeyinin hedeflenmesi.",
            "3. Yan Etki Yönetimi: İnce el tremoru (Propranolol ile düzelir), polidipsi/poliüri (nefrojenik diabetes insipidus), hipotiroidi ve lökositoz takibi.",
            "4. Sıvı ve Tuz Dengesi Eğitimi: Aşırı terleme, ishal, kusma veya tuzsuz diyetin lityum zehirlenmesine yol açacağı konusunda hasta ve aile eğitimi."
        ],
        "pitfalls": "DAR TERAPÖTİK İNDEKS (>1.5 mEq/L Toksisite!): Kaba tremor, dizartri, ataksi, konfüzyon ve nöbet gelişir (>2.5 mEq/L acil hemodiyaliz gerektirir!). NSAİİ ağrı kesiciler (İbuprofen, Naproksen), ACE inhibitörleri ve Tiyazid diüretikler lityum düzeyini hızla toksik sınıra çıkarır! İlk trimester gebelikte Ebstein anomalisi (kalp kapak kusuru) riski taşır."
    },
    {
        "id": "valproate_acute_mania",
        "nameTr": "Valproik Asit / Sodyum Valproat (Hızlı Döngülü & Karışık Mani)",
        "nameEn": "Valproate / Divalproex Sodium (Mixed & Rapid-Cycling Mania Stabilizer)",
        "family": "MOOD_STABILIZERS",
        "aliases": [
            "Valproat",
            "Valproik Asit",
            "Depakin",
            "Sodyum Valproat",
            "Karbamazepin"
        ],
        "goldForDiagnoses": [
            "bipolar_1",
            "substance_induced_bipolar",
            "bipolar_due_to_medical"
        ],
        "shortDefinition": "Bipolar I Bozukluğun Karışık (Miks) özellikli ataklarında, Hızlı Döngülü (yılda >=4 atak) formunda ve madde/alkol bağımlılığı komorbiditeli disforik manide Lityuma kıyasla daha üstün etkinlik gösteren antiepileptik duygudurum dengeleyicidir.",
        "mechanism": "Voltaj kapılı sodyum ve kalsiyum kanallarını bloke eder, GABA transaminazı inhibe ederek santral inhibitör GABA düzeyini artırır ve histon deasetilaz (HDAC) inhibisyonu ile gen ekspresyonunu düzenler.",
        "targetMechanism": "GABAerjik inhibisyonun güçlendirilmesi ve voltaj kapılı Na+/Ca2+ kanalı blokajı.",
        "protocolSteps": [
            "1. Akut Mani Yükleme Protokolü: Akut taşkın/disforik manide 20-30 mg/kg/gün oral yükleme ile hızlı terapötik kan düzeyine (50 - 125 mcg/mL) ulaşılması.",
            "2. Komorbid Madde/Alkol Manisi: Eşlik eden alkol/madde kullanım bozukluğu ve dürtüsel agresyonu olan Bipolar I vakalarında (örn. Vaka 67) Valproat + Atipik Antipsikotik kombinasyonu.",
            "3. Karaciğer, Pankreas ve Trombosit İzlemi: Tedavi öncesi ve takipte ALT/AST, amilaz/lipaz, tam kan sayımı (trombositopeni) ve olası hiperamonemik ensefalopati için amonyak kontrolü.",
            "4. Lamotrijin Etkileşim Ayarı: Valproat, Lamotrijinin glukuronidasyonunu inhibe ederek kan düzeyini 2 katına çıkardığından birlikte kullanımda Lamotrijin dozu yarıya indirilmelidir."
        ],
        "pitfalls": "KESİN TERATOJENİTE UYARISI: Doğurganlık çağındaki kadınlarda ve gebelikte nöral tüp defekti (Spina Bifida %1-5), kraniyofasiyal anomaliler ve Polikistik Over Sendromu (PKOS) yaptığı için KONTRENDİKEDİR! Ayrıca akut pankreatit ve hepatotoksisite açısından karın ağrısı/kusma gelişirse derhal kesilmelidir."
    },
    {
        "id": "lamotrigine_bipolar2",
        "nameTr": "Lamotrijin (Bipolar II Depresyon & HPPD/Depersonalizasyon Stabilizatörü)",
        "nameEn": "Lamotrigine (Bipolar II Depression & Glutamatergic Stabilizer)",
        "family": "MOOD_STABILIZERS",
        "aliases": [
            "Lamotrijin",
            "Lamictal",
            "Bipolar Depresyon Dengeleyicisi",
            "Glutamat Modülatörü"
        ],
        "goldForDiagnoses": [
            "bipolar_2",
            "depersonalization_derealization",
            "hallucinogen_persisting_perception"
        ],
        "shortDefinition": "Bipolar II Bozuklukta tekrarlayan depresif epizodların önlenmesinde, Hallusinojen Kalıcı Algı Bozukluğunda (HPPD / Flashback) ve kronik Depersonalizasyon/Derealizasyon Bozukluğunda glutamaterjik hiperaktiviteyi dengeleyen birinci tercih ajandır.",
        "mechanism": "Presinaptik voltaj kapılı sodyum kanallarını stabilize ederek kortikal aşırı uyarılmışlığı ve patolojik eksitatör Glutamat salınımını baskılar.",
        "targetMechanism": "Presinaptik Na+ kanal stabilizasyonu ve aşırı kortikal Glutamat salınımının inhibisyonu.",
        "protocolSteps": [
            "1. Zorunlu Çok Yavaş Titrasyon: İlk 2 hafta 25 mg/gün, 3. ve 4. hafta 50 mg/gün, 5. hafta 100 mg/gün ve ardından hedef 200 mg/gün dozuna 6 haftada kademeli çıkış.",
            "2. Bipolar II Depresyon Yönetimi: Tek başına antidepresanların hipomanik kayma ve hızlı döngülülük yaratma riskine karşı Lamotrijin (veya Ketiapin/Lurasidon) ile güvenli depresif profilaksi.",
            "3. HPPD ve Depersonalizasyon Protokolü: LSD/MDMA sonrası görsel karlanma (visual snow) ve yabancılaşma yaşayan hastalarda görsel korteks hiperaktivitesini Lamotrijin ile yatıştırma.",
            "4. Dermatolojik Acil Eğitimi: Tedavinin ilk 8 haftasında herhangi bir cilt döküntüsü, ateş veya mukozal yara gelişirse ilacın derhal kesilip acile başvurulması."
        ],
        "pitfalls": "HAYATİ KARA KUTU UYARISI (Stevens-Johnson Sendromu / Toksik Epidermal Nekroliz - TEN): Hızlı doz artışı veya Valproat ile dikkatsiz kombinasyon ölümcül deri soyulmasına (SJS/TEN) yol açar! Ayrıca Lamotrijin akut taşkın maniyi yatıştırmada etkisizdir ('aşağıdan yukarıya' korur). HPPD vakalarında Risperidon ve SSRI'lar görsel flashback'leri KÖTÜLEŞTİRİR."
    },
    {
        "id": "lorazepam_catatonia",
        "nameTr": "Parenteral Lorazepam (Katatoni & Akut Ajitasyon Protokolü)",
        "nameEn": "Parenteral Lorazepam Challenge (Catatonia & Alcohol/Sedative Withdrawal Protocol)",
        "family": "ANXIOLYTICS_HYPNOTICS",
        "aliases": [
            "Lorazepam",
            "Ativan",
            "Diazepam",
            "Katatoni Lorazepam Testi",
            "Benzodiazepin Yoksunluk Protokolü"
        ],
        "goldForDiagnoses": [
            "catatonia_associated",
            "catatonia_medical",
            "alcohol_withdrawal",
            "alcohol_withdrawal_delirium",
            "sedative_withdrawal",
            "cocaine_intoxication"
        ],
        "shortDefinition": "Balmumu esnekliği, mutizm, stupor ve ekolali ile giden Katatonide hem tanısal test (Lorazepam Challenge) hem birinci basamak tedavi olan; ayrıca Delirium Tremens (Alkol Yoksunluğu) ve Kokain İntoksikasyonunda hayat kurtaran GABA-A agonistidir.",
        "mechanism": "GABA-A reseptör kompleksine allosterik olarak bağlanıp klorür (Cl-) kanallarının açılma frekansını artırır; katatonide bazal gangliyon ve motor korteksteki GABAerjik hipofonksiyonu hızla çözer.",
        "targetMechanism": "Pozitif allosterik GABA-A reseptör modülasyonu ile motor ve otonomik inhibisyonun restorasyonu.",
        "protocolSteps": [
            "1. Tanısal Lorazepam Challenge Testi: Katatoni şüphesinde Bush-Francis Katatoni Ölçeği puanlanarak 1-2 mg IV/IM Lorazepam uygulanması; 10-30 dakika içinde mutizm ve rijiditenin dramatik olarak açılması.",
            "2. Katatoni İdamesi ve EKT Geçişi: Yanıt alınan hastada günde 6-16 mg yüksek doz Lorazepam sürdürülmesi; 48-72 saatte yanıt yoksa veya Malign Katatoni varsa acil Bilateral EKT'ye geçilmesi.",
            "3. Alkol Yoksunluğu ve Delirium Tremens (CIWA-Ar): CIWA-Ar skoruna göre semptom tetiklemeli Lorazepam (karaciğer yetmezliğinde güvenli; aktif metaboliti yoktur) veya Diazepam + zorunlu IV Tiamin verilmesi.",
            "4. Kokain/Amfetamin Toksisitesi: Sempatomimetik hipertansiyon, taşikardi ve nöbetleri durdurmak için IV Benzodiazepin uygulanması."
        ],
        "pitfalls": "HAYATİ TUZAK: Katatonik hastaya yüksek potensli antipsikotik (Haloperidol vb.) verilmesi tabloyu hızla ölümcül Nöroleptik Malign Sendroma (NMS) dönüştürür! Kokain intoksikasyonunda ise saf Beta-Bloker (Propranolol) verilmesi 'karşılanmamış alfa-1 vazokonstriksiyonu' ile koroner spazm ve ölüme yol açar; ilk tercih daima Benzodiazepindir!"
    },
    {
        "id": "clonazepam_parasomnia",
        "nameTr": "Düşük Doz Klonazepam & Melatonin (REM/NREM Parasomni Protokolü)",
        "nameEn": "Low-Dose Clonazepam & Melatonin (REM Behavior Disorder & NREM Parasomnia Protocol)",
        "family": "ANXIOLYTICS_HYPNOTICS",
        "aliases": [
            "Klonazepam",
            "Rivotril",
            "Melatonin",
            "RBD Protokolü",
            "Parasomni Tedavisi"
        ],
        "goldForDiagnoses": [
            "rem_sleep_behavior_disorder",
            "nrem_sleep_arousal"
        ],
        "shortDefinition": "REM Uykusu Davranış Bozukluğu (RBD - rüyaları yaşama) ve tehlikeli/adli NREM parasomnilerinde (Seksomni, travmatik Uyurgezerlik) yatak odası güvenlik önlemleriyle birlikte motor disinhibisyonu baskılayan spesifik gece protokolüdür.",
        "mechanism": "Klonazepam uzun etkili GABA-A agonizması ile beyin sapı lokomotor merkezlerini ve фаzik REM motor deşarjlarını baskılar, NREM derin uykusundan patolojik kısmi uyanma (arousal) eşiğini stabilize eder; Melatonin ise MT1/MT2 reseptörleri üzerinden REM kas atonisini restore eder.",
        "targetMechanism": "Beyin sapı REM/NREM motor jeneratörlerinin GABAerjik ve melatonerjik stabilizasyonu.",
        "protocolSteps": [
            "1. Çevresel Güvenlik Zorunluluğu: Kesici/delici eşyaların kaldırılması, yatak kenarlarının desteklenmesi, pencerelerin/kapıların alarmlı kilitlenmesi ve yaralanma riski yüksekse partnerin ayrı yatakta uyuması.",
            "2. RBD Farmakoterapisi: Gece yatmadan 30 dk önce düşük doz Klonazepam (0.25 - 1 mg) veya yaşlı/apneli/demans riskli hastalarda yüksek doz Melatonin (3 - 12 mg) başlanması.",
            "3. Seksomni ve Ağır Uyurgezerlik Yönetimi: Alkol, uyku yoksunluğu ve obstrüktif uyku apnesi gibi NREM parçalanması yapan tetikleyicilerin sıfırlanması ve gece Klonazepam desteği.",
            "4. Alfa-Sinükleinopati İzlemi: RBD hastalarının %70-80'inde 10-15 yıl içinde Parkinson Hastalığı veya Lewy Cisimcikli Demans gelişebileceğinden uzun dönem nörolojik takip."
        ],
        "pitfalls": "SSRI, SNRI, Trisiklik Antidepresanlar ve Mirtazapin hem REM Uykusu Davranış Bozukluğunu (RBD) hem de uyurgezerliği tetikleyebilir veya ŞİDDETLENDİREBİLİR! Obstrüktif uyku apnesi (OSAS) olan hastalarda Klonazepam solunum depresyonu yapabileceği için önce Melatonin tercih edilmelidir."
    },
    {
        "id": "propranolol_beta",
        "nameTr": "Propranolol (Beta-Bloker - Performans Anksiyetesi & Akatizi İlk Basamak)",
        "nameEn": "Propranolol (Non-Selective Beta-Blocker for Performance Anxiety & Akathisia)",
        "family": "ANXIOLYTICS_HYPNOTICS",
        "aliases": [
            "Propranolol",
            "Dideral",
            "Beta-Bloker",
            "Sahne Korkusu İlacı",
            "Akatizi Tedavisi"
        ],
        "goldForDiagnoses": [
            "social_anxiety"
        ],
        "shortDefinition": "Yalnızca Performans Tipi Sosyal Anksiyete Bozukluğunda (konser piyanisti, cerrah, sunum yapacak konuşmacı) sedasyon yapmadan el titremesi ve çarpıntıyı kesen; ayrıca Antipsikotik Kaynaklı Akatizide 1. basamak altın standart olan lipofilik beta-blokerdir.",
        "mechanism": "Periferik ve santral Beta-1 ve Beta-2 adrenerjik reseptörleri yarışmalı olarak bloke eder; otonomik taşikardi, ses titremesi, terleme ve ince postural tremoru durdurarak 'bedensel duyum -> felaketleştirme -> panik' kısır döngüsünü kırar.",
        "targetMechanism": "Beta-1/Beta-2 adrenerjik reseptör blokajı ile otonomik sempatik hiperaktivitenin susturulması.",
        "protocolSteps": [
            "1. Performans Anksiyetesi (PRN) Protokolü: Sahneye, sınava veya sunuma çıkmadan 45-60 dakika önce 10 - 40 mg tek doz Propranolol alınması (ilk doz mutlaka performans öncesi bir gün evde test edilmelidir).",
            "2. İlacın Yol Açtığı Akatizi Yönetimi: Antipsikotik sonrası gelişen dayanılmaz içsel huzursuzluk ve yerinde duramamada antipsikotik dozunun düşürülmesi ve Propranolol 30-80 mg/gün (2-3 bölünmüş dozda) başlanması.",
            "3. Bilişsel Performansın Korunması: Benzodiazepinlerin aksine dikkat, bellek ve ince motor koordinasyonu bozmadığından müzisyen ve konuşmacılarda ideal seçim olması.",
            "4. Nabız ve Tansiyon Kontrolü: Bradikardi (<55/dk) ve hipotansiyon açısından vital bulgu takibi."
        ],
        "pitfalls": "KESİN KONTRENDİKASYON: Bronşiyal Astım ve KOAH hastalarında Beta-2 blokajına bağlı ölümcül bronkospazm tetikler! Ayrıca sinüs bradikardisi, 2./3. derece AV blok ve diyabet (hipoglisemi belirtilerini maskeler) varlığında dikkatli olunmalıdır. Yaygın (jeneralize) sosyal fobide tek başına yeterli değildir (orada SSRI + BDT gerekir)."
    },
    {
        "id": "prazosin_nightmares",
        "nameTr": "Prazosin (Alfa-1 Bloker - Travmatik Kabus & Otonomik Hiperaktivite)",
        "nameEn": "Prazosin (Central Alpha-1 Adrenergic Antagonist for Trauma Nightmares)",
        "family": "ANXIOLYTICS_HYPNOTICS",
        "aliases": [
            "Prazosin",
            "Minipress",
            "Alfa-1 Bloker",
            "Travmatik Kabus Protokolü",
            "IRT + Prazosin"
        ],
        "goldForDiagnoses": [
            "nightmare_disorder",
            "ptsd"
        ],
        "shortDefinition": "Kabus Bozukluğu (Nightmare Disorder) ve TSSB'ye bağlı gece ter, çarpıntı ve dehşet içinde uyandıran tekrarlayıcı travmatik kabuslarda İmajinatif Yeniden Senaryolaştırma Terapisi (IRT) ile birlikte kullanılan santral etkili Alfa-1 adrenerjik blokördür.",
        "mechanism": "Kan-beyin bariyerini geçerek santral sinir sisteminde postsinaptik Alfa-1 noradrenerjik reseptörleri bloke eder; REM uykusu sırasındaki locus coeruleus kaynaklı noradrenerjik fırtınayı ve amigdala hiperaktivitesini susturur.",
        "targetMechanism": "Santral Alfa-1 adrenerjik reseptör blokajı ile REM uykusundaki noradrenerjik aşırı uyarılmanın baskılanması.",
        "protocolSteps": [
            "1. İlk Doz Senkop Önlemi: İlk doz ortostatik hipotansiyon ve bayılma (first-dose syncope) yapabileceğinden gece tam yatağa girerken 1 mg ile başlanması.",
            "2. Kademeli Gece Titrasyonu: Kabusların sıklığı ve şiddetine göre her 3-7 günde bir artırılarak 2 - 10 mg gece dozuna çıkılması.",
            "3. IRT (Imagery Rehearsal Therapy) Entegrasyonu: Farmakoterapi ile gece otonomik uyanma bastırılırken, gündüz seanslarında kabusun sonunun güvenli bir senaryoyla yeniden yazılıp prova edilmesi.",
            "4. Ortostatik Tansiyon Takibi: Sabah yataktan kalkarken baş dönmesi olmaması için önce yatak kenarında oturup sonra ayağa kalkma eğitimi."
        ],
        "pitfalls": "PDE5 inhibitörleri (Sildenafil, Tadalafil) veya diğer antihipertansiflerle birlikte alındığında şiddetli hipotansiyon ve senkop gelişebilir. Katarakt cerrahisi geçirecek hastalarda İntraoperatif Gevşek İris Sendromu (IFIS) riski nedeniyle oftalmoloğa bilgi verilmelidir."
    },
    {
        "id": "hydroxyzine_buspirone",
        "nameTr": "Buspiron / Hidroksizin (Bağımlılık Yapmayan Anksiyolitik Protokolü)",
        "nameEn": "Buspirone & Hydroxyzine (Non-Benzodiazepine Anxiolytic Protocol)",
        "family": "ANXIOLYTICS_HYPNOTICS",
        "aliases": [
            "Buspiron",
            "Hidroksizin",
            "Atarax",
            "Buspon",
            "Bağımlılık Yapmayan Anksiyolitik"
        ],
        "goldForDiagnoses": [
            "acute_stress_disorder",
            "adjustment_disorder",
            "other_specified_trauma",
            "sedative_hypnotic_use_disorder",
            "cannabis_withdrawal",
            "caffeine_intoxication"
        ],
        "shortDefinition": "Akut Stres Bozukluğu, Uyum Bozuklukları ve madde/alkol bağımlılığı öyküsü olan anksiyete hastalarında benzodiazepinlerin yarattığı bağımlılık, amnezi ve travma bellek konsolidasyonu bozulmasına yol açmadan kullanılan güvenli anksiyolitik protokoldür.",
        "mechanism": "Buspiron presinaptik ve postsinaptik 5-HT1A reseptörlerinde parsiyel agonizma yaparak serotonerjik denge sağlar (GABA üzerinden çalışmaz); Hidroksizin ise santral H1 reseptör antagonizması ve hafif 5-HT2A blokajı ile hızlı anksiyoliz ve uyku desteği sunar.",
        "targetMechanism": "5-HT1A parsiyel agonizması (Buspiron) ve santral H1 reseptör blokajı (Hidroksizin).",
        "protocolSteps": [
            "1. Akut Travma ve Uyum Sürecinde Güvenli Semptom Kontrolü: Travma sonrası ilk 1 ayda (Akut Stres Bozukluğu) şiddetli uykusuzluk ve somatik anksiyete için kısa süreli Hidroksizin (25-50 mg) desteği.",
            "2. Kronik Endişede Buspiron Protokolü: Bilişsel bulanıklık, sedasyon ve bağımlılık istenmeyen kaygı tablolarında Buspiron 2x7.5 mg başlanıp 30-60 mg/gün doza çıkılması.",
            "3. Etki Başlangıç Eğitimi: Hidroksizin 30-60 dakikada akut rahatlama sağlarken, Buspironun etkisinin SSRI'lar gibi 2-4 haftada ortaya çıktığının (PRN kullanılmayacağının) hastaya açıklanması.",
            "4. Psikoterapi Önceliği: Travma Odaklı BDT / EMDR veya Kişilerarası Terapi (IPT) sürecinin ilaçla sedatize edilmeden aktif yürütülmesi."
        ],
        "pitfalls": "KLİNİK TUZAK: Akut travma sonrası (Akut Stres Bozukluğu) hastalara rutin Benzodiazepin (Xanax, Diazem vb.) başlanması korku sönmesini (fear extinction) ve travmanın doğal işlenmesini bozarak kronik TSSB gelişme riskini ARTIRIR! Hidroksizin yaşlılarda antikolinerjik yük ve QTc uzaması yapabileceğinden dikkatli kullanılmalıdır."
    },
    {
        "id": "methylphenidate_stimulant",
        "nameTr": "Metilfenidat / Amfetamin Türevleri (DEHB Santral Stimülanı)",
        "nameEn": "Methylphenidate OROS/IR & Amphetamine Psychostimulants (First-Line ADHD)",
        "family": "STIMULANTS_WAKEFULNESS",
        "aliases": [
            "Metilfenidat",
            "Concerta",
            "Ritalin",
            "Medikinet",
            "Atomoksetin",
            "DEHB Stimülanı"
        ],
        "goldForDiagnoses": [
            "adhd"
        ],
        "shortDefinition": "Çocuk, ergen ve erişkin Dikkat Eksikliği ve Hiperaktivite Bozukluğunda (DEHB) prefrontal korteksin yürütücü işlevlerini, sürdürülebilir dikkati ve dürtü kontrolünü en yüksek etki büyüklüğüyle (Effect Size ~0.8-1.0) düzelten birinci basamak altın standart tedavidir.",
        "mechanism": "Prefrontal korteks ve striatumda Dopamin Taşıyıcısı (DAT) ve Noradrenalin Taşıyıcısını (NET) bloke ederek sinaptik katekolamin düzeyini artırır; D1 ve Alfa-2A reseptör uyarımı üzerinden sinyal/gürültü oranını optimize eder.",
        "targetMechanism": "Prefrontal korteks ve striatal DAT / NET blokajı ile yürütücü kontrol ağının aktivasyonu.",
        "protocolSteps": [
            "1. Tedavi Öncesi Kardiyak ve Büyüme Taraması: Boy, kilo, tansiyon, nabız ölçümü; ailede genç yaşta ani kardiyak ölüm veya yapısal kalp hastalığı öyküsü varsa EKG ve pediatrik kardiyoloji konsültasyonu.",
            "2. Uzun Etkili Sabah Formülasyonu: Okul/iş günü boyunca dalgalanmasız etki için sabah kahvaltı sonrası OROS Metilfenidat (18 - 54 mg) veya modifiye salımlı kapsül başlanması.",
            "3. İştah ve Uyku Yönetimi: Öğle saatlerinde oluşabilecek iştahsızlık için sabah kuvvetli kahvaltı ve akşam yüksek kalorili öğün planlaması; insomniyi önlemek için geç saatte doz verilmemesi.",
            "4. Ebeveyn Yönetim Eğitimi (PMT) ve BDT Kombini: Eşlik eden Karşıt Olma Karşı Gelme Bozukluğu (KOKGB) varsa PMT ile davranışsal sınırların eşzamanlı kurulması."
        ],
        "pitfalls": "Yapısal kalp anomalisi, kardiyomiyopati, ağır hipertansiyon, hipertiroidi ve glokomda kontrendikedir. Örtük Bipolar bozukluğu veya aktif psikozu olan bireylerde manik/psikotik atağı tetikleyebilir. Aktif madde kötüye kullanım riski veya ağır tik bozukluğu varsa non-stimülan Atomoksetin veya Guanfasin tercih edilir."
    },
    {
        "id": "alpha2_agonist_tic",
        "nameTr": "Alfa-2 Adrenerjik Agonist (Klonidin / Guanfasin - Tik & DEHB Protokolü)",
        "nameEn": "Alpha-2A Adrenergic Agonists (Guanfacine XR / Clonidine) & Aripiprazole for Tic Disorders",
        "family": "STIMULANTS_WAKEFULNESS",
        "aliases": [
            "Guanfasin",
            "Klonidin",
            "Intuniv",
            "Alfa-2 Agonist",
            "Tourette Farmakoterapisi"
        ],
        "goldForDiagnoses": [
            "tourette",
            "chronic_motor_vocal_tic",
            "provisional_tic_disorder",
            "conduct_disorder",
            "ptsd_preschool"
        ],
        "shortDefinition": "Tourette Bozukluğu, Kronik Motor/Vokal Tik Bozukluğu (özellikle DEHB komorbiditesinde) ve çocuk/ergen yıkıcı dürtüsellik-agresyon tablolarında CBIT terapisiyle birlikte hem tikleri hem dürtüselliği azaltan birinci basamak güvenli protokoldür.",
        "mechanism": "Prefrontal kortekste postsinaptik Alfa-2A adrenerjik reseptörleri doğrudan uyararak cAMP kanallarını kapatır; kortiko-striato-talamo-kortikal (CSTC) devreler üzerindeki yukarıdan-aşağıya (top-down) inhibitör kontrolü güçlendirir ve sempatik tonusu düşürür.",
        "targetMechanism": "Postsinaptik Alfa-2A reseptör agonizması ile prefrontal inhibitör denetimin güçlendirilmesi.",
        "protocolSteps": [
            "1. CBIT + İlk Basamak Alfa-2 Agonisti: Hafif-orta Tourette ve DEHB birlikteliğinde antipsikotik yan etkilerinden kaçınmak için Guanfasin XR (1-4 mg/gün) veya Klonidin başlanması.",
            "2. Ağır Tiklerde Dopamin Modülasyonu: İşlevselliği ağır bozan motor/vokal tiklerde ve koprolalide FDA onaylı düşük doz Aripiprazol (2-10 mg) veya Risperidon (0.5-2 mg) geçişi.",
            "3. Yıkıcı Davranım ve Agresyon Kontrolü: Davranım bozukluğu ve çocukluk çağı aşırı uyarılmışlığında dürtüsel patlamaları yatıştırmak için системik aile terapisi (MST) yanında Alfa-2 agonist desteği.",
            "4. Hemodinamik Takip: Sedasyon, bradikardi ve ortostatik hipotansiyon açısından başlangıç ve doz artışlarında tansiyon/nabız kontrolü."
        ],
        "pitfalls": "KRİTİK UYARI: Klonidin ve Guanfasin ANİDEN KESİLMEMELİDİR; ani kesilmesi tehlikeli Rebound Hipertansiyon, taşikardi ve tiklerde şiddetli alevlenme yapar! Her zaman 3-7 günde bir kademeli azaltılarak kesilmelidir."
    },
    {
        "id": "modafinil_oxybate",
        "nameTr": "Modafinil / Pitolisant & Sodyum Oksibat (Narkolepsi & Hipersomni)",
        "nameEn": "Modafinil / Pitolisant & Sodium Oxybate (Narcolepsy & Hypersomnolence Protocol)",
        "family": "STIMULANTS_WAKEFULNESS",
        "aliases": [
            "Modafinil",
            "Modiwake",
            "Armodafinil",
            "Pitolisant",
            "Sodyum Oksibat",
            "Narkolepsi Protokolü"
        ],
        "goldForDiagnoses": [
            "narcolepsy",
            "hypersomnolence"
        ],
        "shortDefinition": "Narkolepsi (Tip 1 Katapleksili ve Tip 2), İdiyopatik Hipersomnolans ve Vardiyalı Çalışma Uyku Bozukluğunda karşı konulamaz gündüz uyku ataklarını ve ani kas tonusu kaybını (katapleksi) önleyen uyanıklık destekleyici protokoldür.",
        "mechanism": "Modafinil zayıf/seçici DAT blokajı üzerinden hipotalamik histaminerjik (TMN) ve oreksinerjik (hipokretin) uyanıklık yolaklarını aktive eder; Pitolisant H3 otoreseptör ters agonizmasıyla histamin ve noradrenalin salınımını artırarak hem uyanıklığı sağlar hem katapleksiyi önler; Sodyum Oksibat gece GABA-B agonizmasıyla derin yavaş dalga uykusunu konsolide eder.",
        "targetMechanism": "DAT inhibisyonu + Hipotalamik Oreksin/Histamin (H3) aktivasyonu ve gece GABA-B konsolidasyonu.",
        "protocolSteps": [
            "1. Gündüz Uyanıklık Ajanı: Sabah erken saatte (veya sabah + öğle) Modafinil (100 - 400 mg/gün) başlanarak gündüz uyku ataklarının önlenmesi.",
            "2. Katapleksi Spesifik Müdahale: Gülme/heyecanla tetiklenen katapleksi atakları için Sodyum Oksibat, Pitolisant veya düşük doz Venlafaksin/Klomipramin (REM baskılayıcı etki) eklenmesi.",
            "3. Stratejik Planlı Şekerleme: İlaç tedavisine ek olarak gün içinde saat 12:30 ve 16:30 gibi sabit saatlerde 15-20 dakikalık planlı kısa şekerlemeler (power nap) uygulanması.",
            "4. Kontrasepsiyon ve Kardiyak Bilgilendirme: Modafinil CYP3A4 enzimini indükleyerek doğum kontrol haplarının etkinliğini azalttığından ek bariyer/RİA yöntemi önerilmesi."
        ],
        "pitfalls": "Sodyum Oksibat (GHB tuzu) merkezi sinir sistemi depresanıdır; alkol veya sedatif hipnotiklerle birlikte alınması ÖLÜMCÜL solunum depresyonu ve koma yapar! Modafinil nadiren Stevens-Johnson Sendromu ve anksiyete/taşikardi tetikleyebilir."
    },
    {
        "id": "naltrexone_acamprosate",
        "nameTr": "Naltrekson / Akamprosat / Disülfiram (Alkol & Dürtü Blokajı)",
        "nameEn": "Naltrexone, Acamprosate & Disulfiram (Alcohol Use & Impulse-Control Pharmacotherapy)",
        "family": "ADDICTION_ANTIDOTES",
        "aliases": [
            "Naltrekson",
            "Akamprosat",
            "Disülfiram",
            "Ethylex",
            "Campral",
            "Antabus",
            "Ödül Blokajı"
        ],
        "goldForDiagnoses": [
            "alcohol_use_disorder",
            "gambling_disorder",
            "kleptomania",
            "pyromania"
        ],
        "shortDefinition": "Alkol Kullanım Bozukluğunda aşerme (craving) ve nüksü önleyen; ayrıca Kumar Oynama Bozukluğu, Kleptomani ve Kompulsif Satın Alma gibi davranışsal/dürtü bağımlılıklarında mezolimbik ödül hazzını bloke eden kanıta dayalı farmakoterapidir.",
        "mechanism": "Naltrekson mü-opioid reseptörlerini yarışmalı bloke ederek alkol veya dürtüsel davranış (kumar, çalma) sırasında ventral tegmental alandan nukleus akumbense endorfin/dopamin salınımını keser; Akamprosat kronik alkolün bozduğu NMDA/GABA dengesini (glutamaterjik hiperaktiviteyi) restore eder; Disülfiram ise aldehit dehidrogenazı inhibe ederek asetaldehit birikimiyle caydırıcı toksik reaksiyon yaratır.",
        "targetMechanism": "Mü-opioid reseptör antagonizması (Mezolimbik dopamin/ödül blokajı) ve NMDA/GABA homeostazı.",
        "protocolSteps": [
            "1. Detoksifikasyon Sonrası İdame Seçimi: Alkol aşermesini ve 'bir kadeh içince duramama' (heavy drinking) döngüsünü kırmak için Naltrekson 50 mg/gün (veya aylık depo) başlanması.",
            "2. Tam Ayıklık ve Karaciğer Güvenliği: Karaciğer rezervi bozuk olan ve tam ayıklık hedefleyen hastalarda karaciğerden metabolize olmayan Akamprosat (3x666 mg) tercih edilmesi.",
            "3. Davranışsal Bağımlılık ve Kleptomani Protokolü: Patolojik kumar ve kleptomanide yoğun dürtü ve haz döngüsünü söndürmek için Naltrekson (50-100 mg/gün) + Motivasyonel Görüşme / BDT.",
            "4. Gözetimli Disülfiram (Seçilmiş Vakalar): Yüksek motivasyonlu ve eş/aile gözetimi olan hastalarda alkolden en az 48 saat temiz kaldıktan sonra Disülfiram uygulanması."
        ],
        "pitfalls": "HAYATİ KURAL: Naltrekson başlanmadan önce hastanın son 7-10 gündür hiçbir opioid (ağrı kesici, eroin, kodein, tramadol) kullanmadığından emin olunmalıdır; aksi halde şiddetli Presipite Opioid Yoksunluğu tetikler! Akut hepatit ve karaciğer yetmezliğinde Naltrekson kontrendikedir. Disülfiram kullanan hasta kolonya, sirke veya alkollü gargara dahi kullansa hipotansif şok geçirebilir."
    },
    {
        "id": "buprenorphine_naloxone",
        "nameTr": "Buprenorfin/Nalokson (Suboxone) & Metadon (Opioid Replasman)",
        "nameEn": "Buprenorphine/Naloxone (Suboxone) & Parenteral Naloxone (Opioid Use & Overdose Protocol)",
        "family": "ADDICTION_ANTIDOTES",
        "aliases": [
            "Suboxone",
            "Buprenorfin",
            "Nalokson",
            "Metadon",
            "Opioid Replasman Tedavisi"
        ],
        "goldForDiagnoses": [
            "opioid_use_disorder",
            "opioid_withdrawal",
            "opioid_intoxication"
        ],
        "shortDefinition": "Opioid Kullanım Bozukluğunda (Eroin, Fentanil, Oksikodon) yoksunluk krizini, aşermeyi ve aşırı doz ölümlerini önleyen dil altı parsiyel agonist idame tedavisi; akut doz aşımında ise hayat kurtarıcı IV/İntranazal Nalokson antidot protokolüdür.",
        "mechanism": "Buprenorfin mü-opioid reseptörlerine çok yüksek afiniteyle bağlanan bir parsiyel agonisttir (tavan etkisi/ceiling effect sayesinde solunum depresyonu riski düşüktür); içindeki Nalokson ise dil altı alındığında emilmez ancak tablet ezilip damardan (IV) enjekte edilirse derhal yoksunluk yaratarak kötüye kullanımı engeller.",
        "targetMechanism": "Yüksek afiniteli parsiyel mü-opioid agonizması ve kappa-opioid antagonizması.",
        "protocolSteps": [
            "1. Akut Doz Aşımı Acili (Miyozis + Solunum Depresyonu + Koma): Solunum sayısı <12/dk ve toplu iğne başı pupil varlığında derhal hava yolu desteği ve 0.4 - 2 mg IV/IM/İntranazal Nalokson uygulanması.",
            "2. İndüksiyon Zamanlaması (COWS Ölçeği): Buprenorfin/Nalokson ilk dozu yalnızca hasta hafif-orta yoksunluk belirtileri göstermeye başladığında (COWS skoru >8-12; son eroinden en az 12-16 saat sonra) dil altı verilir.",
            "3. İdame ve Rehabilitasyon: Günlük 8/2 mg - 16/4 mg dil altı dozda stabilize edilerek yasadışı madde arayışının kesilmesi ve psikososyal rehabilitasyon.",
            "4. Enfeksiyon ve Komorbidite Taraması: Damar içi madde kullananlarda HIV, Hepatit B, Hepatit C ve enfektif endokardit taraması."
        ],
        "pitfalls": "KRİTİK TUZAK (Presipite Yoksunluk): Kanında hala tam agonist opioid (eroin, metadon, morfin) varken hastaya çok erken Buprenorfin verilirse, yüksek afiniteli Buprenorfin eroini reseptörden söküp atar ve dakikalar içinde çok şiddetli bir yoksunluk krizi başlatır! Ayrıca Naloksonun yarı ömrü (30-90 dk) çoğu opioidden kısa olduğu için doz aşımı hastası uyandıktan sonra tekrar komaya girebilir (en az 6-12 saat acilde izlenmelidir)."
    },
    {
        "id": "dantrolene_bromocriptine",
        "nameTr": "Acil İlaç Kesimi + Dantrolen & Bromokriptin (NMS Antidot Protokolü)",
        "nameEn": "Immediate Neuroleptic Cessation + IV Dantrolene & Bromocriptine (NMS Protocol)",
        "family": "ADDICTION_ANTIDOTES",
        "aliases": [
            "Dantrolen",
            "Bromokriptin",
            "NMS Tedavisi",
            "Nöroleptik Malign Sendrom Antidotu",
            "Amantadin"
        ],
        "goldForDiagnoses": [],
        "shortDefinition": "Antipsikotik kullanımı sonrası gelişen kurşun boru rijiditesi, >39-40°C hipertermi, otonomik instabilite ve rabdomiyoliz (CK >10.000 U/L) ile karakterize ölümcül Nöroleptik Malign Sendromun (NMS) yoğun bakım spesifik antidot protokolüdür.",
        "mechanism": "Dantrolen iskelet kası sarkoplazmik retikulumundaki Riyanodin (RyR1) kalsiyum kanallarını bloke ederek periferal kas kasılmasını, ısı üretimini ve rabdomiyolizi durdurur; Bromokriptin ise santral postsinaptik D2 reseptör agonizması yaparak hipotalamik ve nigrostriatal dopamin blokajını kırar.",
        "targetMechanism": "İskelet kası Riyanodin (RyR1) Ca2+ kanal blokajı (Dantrolen) + Santral D2 agonizması (Bromokriptin).",
        "protocolSteps": [
            "1. Derhal İlaç Kesimi ve Yoğun Bakım: Tetikleyici antipsikotiğin (veya kesilmiş olan dopaminerjik Parkinson ilacının yeniden başlanmasının) saniye kaybetmeden stoplanması.",
            "2. Agresif IV Hidrasyon ve Soğutma: Miyoglobinürik Akut Böbrek Yetmezliğini önlemek için yüksek volümlü kristaloid sıvı, idrar alkalinizasyonu ve harici soğutma battaniyeleri.",
            "3. Spesifik Antidot Kombinasyonu: Kas rijiditesi ve hipertermi için IV Dantrolen (1 - 2.5 mg/kg, maksimum 10 mg/kg/gün) + Santral dopamin restorasyonu için oral/NG tüpten Bromokriptin (2.5 - 5 mg 3x1).",
            "4. Dirençli Vakada Lorazepam ve EKT: İlaç tedavisine 48 saatte yanıt vermeyen ağır NMS/Malign Katatoni tablosunda hayat kurtarıcı Bilateral EKT uygulanması."
        ],
        "pitfalls": "HAYATİ AYIRICI TANI: NMS'de kaslarda 'kurşun boru' rijiditesi ve hiporefleksi vardır; Serotonin Sendromunda ise alt ekstremitede hiperrefleksi ve miyoklonus/klonus görülür. NMS'de ateş düşürücü (Parasetamol/NSAİİ) ilaçlar işe yaramaz çünkü ateş hipotalamik prostaglandin artışına değil, masif kas kasılmasına bağlıdır. İyileşme sonrası en az 2 hafta antipsikotik başlanmaz; başlanacaksa düşük potensli atipik (Ketiapin/Klozapin) seçilir."
    },
    {
        "id": "cyproheptadine_serotonin",
        "nameTr": "Acil İlaç Kesimi + Siproheptadin (Serotonin Sendromu 5-HT2A Antidotu)",
        "nameEn": "Serotonergic Cessation + Cyproheptadine & Benzodiazepines (Serotonin Toxicity Protocol)",
        "family": "ADDICTION_ANTIDOTES",
        "aliases": [
            "Siproheptadin",
            "Prakten",
            "Serotonin Sendromu Antidotu",
            "5-HT2A Antagonisti"
        ],
        "goldForDiagnoses": [],
        "shortDefinition": "SSRI/SNRI ile MAOİ, Tramadol, Triptan, Linezolid veya Sarı Kantaron (St. John's Wort) kombinasyonu sonucu saatler içinde gelişen klonus, hiperrefleksi, ajitasyon, diyare ve hipertermi tablosunun (Serotonin Sendromu) spesifik antidot protokolüdür.",
        "mechanism": "Siproheptadin santral ve periferik 5-HT2A ve 5-HT1A serotonin reseptörlerini güçlü biçimde bloke ederek yaşamı tehdit eden hipertermi ve otonomik fırtınayı durdurur; Benzodiazepinler ise miyoklonus, tremor ve sempatik hiperaktiviteyi baskılar.",
        "targetMechanism": "Potent 5-HT2A / 5-HT1A reseptör antagonizması ve GABAerjik motor sedasyon.",
        "protocolSteps": [
            "1. Tüm Serotonerjik Ajanların Derhal Kesilmesi: Antidepresanlar, triptanlar, tramadol, dekstrometorfan, meperidin ve bitkisel takviyelerin anında stoplanması.",
            "2. Benzodiazepin ve Destek Tedavisi: Ajitasyon, taşikardi, hipertansiyon ve kas sarsıntılarını (klonus) kontrol etmek için IV Lorazepam/Diazepam ve IV sıvı replasmanı.",
            "3. Spesifik Antidot Siproheptadin: Orta-ağır vakalarda oral veya nazogastrik tüpten Siproheptadin 12 mg yükleme dozu, ardından semptomlar devam ederse her 2 saatte bir 2 mg (günlük 24-32 mg'a kadar).",
            "4. Kritik Hipertermi (>41.1°C) Yönetimi: Ağır olgularda endotrakeal entübasyon, non-depolarizan nöromüsküler blokaj (Roküronyum/Veküronyum) ve mekanik ventilasyon."
        ],
        "pitfalls": "KESİN KONTRENDİKASYONLAR: 1) Hipertermide Süksinilkolin (depolarizan kas gevşetici) rabdomiyoliz ve ölümcül hiperkalemi yaptığı için KULLANILMAZ! 2) Bromokriptin (dopamin/serotonin etkileri nedeniyle) ve Haloperidol (termoregülasyonu bozar) Serotonin Sendromunu KÖTÜLEŞTİRİR! 3) Propranolol hipotansiyon ve şoku maskeleyebilir."
    },
    {
        "id": "thiamine_iv_wernicke",
        "nameTr": "Yüksek Doz Parenteral (IV) Tiamin (B1 Vitamini - Wernicke-Korsakoff Acili)",
        "nameEn": "High-Dose Parenteral Thiamine (Vitamin B1 Before Glucose - Wernicke-Korsakoff Protocol)",
        "family": "ADDICTION_ANTIDOTES",
        "aliases": [
            "Parenteral Tiamin",
            "IV B1 Vitamini",
            "Wernicke-Korsakoff Protokolü",
            "Tiamin Replasmanı"
        ],
        "goldForDiagnoses": [
            "wernicke_korsakoff_syndrome",
            "alcohol_intoxication"
        ],
        "shortDefinition": "Kronik alkolizm, ağır malnütrisyon veya hiperemezis gravidarum zemininde konfüzyon, oftalmopleji (6. kraniyal sinir felci/nistagmus) ve ataksi ile başlayan Wernicke Ensefalopatisinin kalıcı Korsakoff Amnezisine dönüşmesini önleyen acil nörometabolik protokoldür.",
        "mechanism": "Tiamin pirofosfat (TPP), beyin glukoz metabolizmasındaki üç kritik enzimin (Pirüvat dehidrogenaz, Alfa-ketoglutarat dehidrogenaz ve Transketolaz) zorunlu kofaktörüdür; parenteral replasman mamiller cisimcik ve talamustaki hemorajik nekrozu ve ATP çöküşünü durdurur.",
        "targetMechanism": "Krebs döngüsü ve pentoz fosfat yolu enzim kofaktör (Tiamin Pirofosfat) restorasyonu.",
        "protocolSteps": [
            "1. ALTIN KURAL (Önce Tiamin, Sonra Glukoz!): Acil servise bilinç bulanıklığı veya hipoglisemi ile gelen her alkol kullanım bozukluğu hastasına dekstrozlu sıvı verilmeden ÖNCE (veya eşzamanlı) parenteral Tiamin uygulanması.",
            "2. Yüksek Doz IV Protokol: Günde 3 kez 200 - 500 mg IV Tiamin (100 ml SF içinde 30 dakikada infüzyon) 3-5 gün boyunca uygulanması, ardından 250 mg/gün IM/IV ile devam edilmesi.",
            "3. Magnezyum Kofaktör Replasmanı: Tiaminin aktif formuna (TPP) dönüşebilmesi için Magnezyum zorunlu kofaktör olduğundan eşlik eden hipomagnezeminin mutlaka IV Magnezyum Sülfat ile düzeltilmesi.",
            "4. Korsakoff Rehabilitasyonu: Kronik anterograd amnezi ve konfabülasyon gelişmiş vakalarda tam alkol kesimi, oral B1 idamesi ve harici bellek yardımcılarıyla (ajanda, alarm) bilişsel rehabilitasyon."
        ],
        "pitfalls": "ÖLÜMCÜL İATROJENİK HATA: Tiamin depoları tükenmiş bir hastaya önce IV Dekstroz (%5-%10 glukoz) vermek, kalan son tiamin kırıntılarını da hızla tüketerek dakikalar içinde akut Wernicke koması ve mamiller cisimcik kanaması başlatır! Ayrıca kronik alkoliklerde bağırsak tiamin emilimi bozulduğu için akut tabloda ağızdan (oral) B1 vitamini hapı vermek ETKİSİZDİR; mutlaka IV/IM verilmelidir!"
    },
    {
        "id": "biperiden_anticholinergic",
        "nameTr": "Biperiden (Akineton) / Difenhidramin (Akut Distoni & İlaç Parkinsonizmi)",
        "nameEn": "Parenteral/Oral Biperiden & Diphenhydramine (Acute Dystonia & Drug-Induced Parkinsonism)",
        "family": "NEURO_MOVEMENT",
        "aliases": [
            "Biperiden",
            "Akineton",
            "Difenhidramin",
            "Bornaprin",
            "Amantadin",
            "Antikolinerjik EPS Tedavisi"
        ],
        "goldForDiagnoses": [],
        "shortDefinition": "Antipsikotik (özellikle yüksek potensli D2 bloker) başlanmasından saatler-günler sonra gelişen Akut Distoni (okülogirik kriz, tortikollis, laringospazm) ve haftalar sonra gelişen İlacın Yol Açtığı Parkinsonizmde nigrostriatal asetilkolin-dopamin dengesini hızla düzelten antidot tedavisidir.",
        "mechanism": "Striatumda Dopamin D2 reseptörlerinin antipsikotikle bloke edilmesi sonucu oluşan 'göreceli kolinerjik hiperaktiviteyi', santral Muskarinik M1 asetilkolin reseptörlerini bloke ederek dengeler.",
        "targetMechanism": "Nigrostriatal yolakta santral Muskarinik M1 reseptör antagonizması (DA/ACh dengesi).",
        "protocolSteps": [
            "1. Akut Distoni Acili (Dakikalar İçinde Yanıt): Gözlerin yukarı kayması (okülogirik kriz), boyun kasılması (tortikollis) veya dil/boğaz spazmında derhal 5 mg IM veya yavaş IV Biperiden (Akineton) ya da 25-50 mg IM/IV Difenhidramin uygulanması.",
            "2. Nüks Önleme: Enjeksiyon sonrası semptomlar 15-30 dakikada tamamen çözülse de antipsikotiğin yarı ömrü uzun olduğundan 1-2 hafta oral Biperiden (2x2 mg) devam edilmesi.",
            "3. İlaç Kaynaklı Parkinsonizm Yönetimi: Bradikinezi, maske yüz ve dişli çark rijiditesinde antipsikotik dozunun azaltılması, atipik antipsikotiğe (Ketiapin/Aripiprazol) geçiş veya oral Biperiden/Amantadin eklenmesi.",
            "4. Uzun Dönem Deprescribing (İlaç Azaltma): Antikolinerjiklerin 3 aydan uzun süre rutin profilakside tutulmaması, kademeli olarak kesilmesi."
        ],
        "pitfalls": "KRİTİK TUZAK: Biperiden (Akineton) Akut Distoni ve Parkinsonizmi düzeltir ANCAK Tardif Diskineziyi ŞİDDETLENDİRİR ve Akatizide çoğunlukla etkisizdir! Ayrıca yaşlılarda deliryum, dar açılı glokom krizi, paralitik ileus ve prostat hipertrofisinde akut idrar retansiyonu yapar; öforizan etkisi nedeniyle kötüye kullanım potansiyeli vardır."
    },
    {
        "id": "valbenazine_vmat2",
        "nameTr": "VMAT2 İnhibitörü (Valbenazin / Tetrabenazin - Tardif Diskinezi & Kore)",
        "nameEn": "VMAT2 Inhibitors (Valbenazine / Deutetrabenazine / Tetrabenazine for Tardive Dyskinesia & Chorea)",
        "family": "NEURO_MOVEMENT",
        "aliases": [
            "Valbenazin",
            "Dötetrabenazin",
            "Tetrabenazin",
            "VMAT2 İnhibitörü",
            "Ingrezza",
            "Austedo"
        ],
        "goldForDiagnoses": [
            "major_neurocognitive_huntington"
        ],
        "shortDefinition": "Uzun süreli dopamin reseptör blokajı sonucu dilde, dudaklarda, çenede ve ekstremitelerde gelişen istemsiz koreoatetoid hareketlerde (Tardif Diskinezi) ve Huntington Koresinde FDA onaylı birinci basamak spesifik tedavidir.",
        "mechanism": "Presinaptik nöronlarda monoaminleri sinaptik veziküllere paketleyen Veziküler Monoamin Taşıyıcı-2'yi (VMAT2) tersinir olarak inhibe eder; böylece yukarı-regüle (up-regulated) ve aşırı duyarlı (süpersensitif) hale gelmiş postsinaptik D2 reseptörlerine çarpan dopamin miktarını azaltır.",
        "targetMechanism": "Presinaptik Veziküler Monoamin Taşıyıcı-2 (VMAT2) inhibisyonu ile striatal dopamin deşarjının azaltılması.",
        "protocolSteps": [
            "1. İatrojenik Kötüleştiricilerin Kesilmesi: Hastanın kullanmakta olduğu tüm antikolinerjik ilaçların (Biperiden/Akineton vb.) derhal kademeli olarak kesilmesi.",
            "2. Antipsikotik Revizyonu: Klinik tablo izin veriyorsa mevcut tipik antipsikotiğin kesilip Tardif Diskinezi riski en düşük olan Klozapin veya Ketiapine geçiş yapılması.",
            "3. Spesifik VMAT2 İnhibitörü Başlanması: Valbenazin (40 - 80 mg/gün tek doz) veya Dötetrabenazin (12 - 48 mg/gün) başlanması.",
            "4. AIMS Ölçeği ile İzlem: Anormal İstemsiz Hareketler Ölçeği (AIMS) ile her 3-6 ayda bir orofasiyal ve ekstremite diskinezilerinin puanlanması."
        ],
        "pitfalls": "KLASİK SINAV TUZAĞI: Tardif Diskinezisi olan hastada 'hareketler dursun' diye antipsikotik dozunu artırmak hareketleri geçici olarak maskeler (masking effect) fakat altta yatan reseptör aşırı duyarlılığını daha da ağırlaştırır! Biperiden (Akineton) vermek ise Tardif Diskineziyi derhal KÖTÜLEŞTİRİR! Tetrabenazin/Dötetrabenazin kullanımında depresyon ve intihar düşüncesi (Black-Box) yakından izlenmelidir."
    },
    {
        "id": "cholinesterase_donepezil",
        "nameTr": "Asetilkolinesteraz İnhibitörü (Donepezil / Rivastigmin) & Memantin",
        "nameEn": "Acetylcholinesterase Inhibitors (Donepezil / Rivastigmine) & NMDA Antagonist Memantine",
        "family": "NEURO_MOVEMENT",
        "aliases": [
            "Donepezil",
            "Rivastigmin",
            "Galantamin",
            "Memantin",
            "Aricept",
            "Exelon",
            "Ebixa",
            "Demans Farmakoterapisi"
        ],
        "goldForDiagnoses": [
            "major_neurocognitive_alzheimer",
            "mild_neurocognitive_alzheimer",
            "major_neurocognitive_lewy_body",
            "major_neurocognitive_parkinson",
            "major_neurocognitive_vascular",
            "mild_neurocognitive_vascular",
            "major_neurocognitive_multiple",
            "major_neurocognitive_tbi",
            "unspecified_neurocognitive"
        ],
        "shortDefinition": "Alzheimer Hastalığı, Lewy Cisimcikli Demans, Parkinson Demansı ve Miks Demansta bazal ön beyin (Meynert bazal nukleusu) kolinerjik kaybını telafi eden ve glutamaterjik eksitotoksisiteyi yavaşlatan standart nörobilişsel protokoldür.",
        "mechanism": "Donepezil ve Rivastigmin asetilkolinesteraz (AChE) enzimini tersinir inhibe ederek hipokampus ve neokortekste sinaptik asetilkolin ömrünü uzatır; Memantin ise NMDA glutamat reseptörlerinde voltaj bağımlı, düşük-orta afiniteli yarışmasız antagonizma yaparak kalsiyum kaynaklı nöronal apoptozu önler.",
        "targetMechanism": "Sinaptik Asetilkolinesteraz (AChE) inhibisyonu + NMDA reseptör eksitotoksisite blokajı.",
        "protocolSteps": [
            "1. Evreye Göre Başlangıç: Hafif-orta evre Alzheimer demansında Donepezil (5 mg -> 10 mg/gün) başlanması; görsel varsanılarla giden Lewy Cisimcikli ve Parkinson Demansında transdermal Rivastigmin flaster tercih edilmesi.",
            "2. Orta-İleri Evrede Memantin Kombinasyonu: MMSE skoru düştükçe (<14-18) bilişsel yıkımı ve ajitasyonu yavaşlatmak için tedaviye Memantin (5 mg'dan 20 mg/gün'e titrasyon) eklenmesi.",
            "3. Antikolinerjik İlaç Temizliği (Beers Kriterleri): Demans hastasının kullandığı difenhidramin, hidroksizin, oksibutinin, trisiklik antidepresan gibi kolinerjik tedaviyi sıfırlayan tüm ilaçların kesilmesi.",
            "4. Kardiyak ve GİS İzlemi: Kolinesteraz inhibitörlerinin vagotonik etkisi nedeniyle bradikardi, senkop, AV blok ve bulantı/diyare açısından takip."
        ],
        "pitfalls": "ÖNEMLİ FARK: Frontotemporal Demansta (Pick Hastalığı) kolinerjik sistem sağlam olduğu için Donepezil/Rivastigmin kognisyona fayda sağlamaz, aksine disinhibisyonu ve ajitasyonu KÖTÜLEŞTİRİR! Ayrıca Lewy Cisimcikli Demansta görsel varsanılar için tipik antipsikotik (Haloperidol) verilmesi ölümcül nöroleptik duyarlılık reaksiyonu tetikler."
    },
    {
        "id": "pramipexole_gabapentin_rls",
        "nameTr": "Alfa-2-Delta Ligandı (Pregabalin/Gabapentin) veya Dopamin Agonisti (RLS)",
        "nameEn": "Alpha-2-Delta Ligands (Pregabalin/Gabapentin) & Dopamine Agonists (Pramipexole) + Iron Protocol",
        "family": "NEURO_MOVEMENT",
        "aliases": [
            "Pregabalin",
            "Gabapentin",
            "Pramipeksol",
            "Ropinirol",
            "Demir Replasmanı",
            "RLS Protokolü"
        ],
        "goldForDiagnoses": [
            "restless_legs_syndrome"
        ],
        "shortDefinition": "Huzursuz Bacaklar Sendromunda (Willis-Ekbom) akşamları ortaya çıkan bacakları hareket ettirme dürtüsünü kesen; güncel kılavuzlarda augmentasyon riskini önlemek için Alfa-2-Delta ligandları, D2/D3 agonistleri ve demir replasmanını birleştiren protokoldür.",
        "mechanism": "Pregabalin ve Gabapentin voltaj kapılı kalsiyum kanallarının Alfa-2-Delta alt birimine bağlanarak spinal ve talamokortikal aşırı duyarlılığı yatıştırır; Pramipeksol striatal D3/D2 reseptörlerini uyarır; Demir ise tirozin hidroksilaz enziminin zorunlu kofaktörü olarak nigrostriatal dopamin sentezini sağlar.",
        "targetMechanism": "Spinal/talamik Alfa-2-Delta Ca2+ kanal modülasyonu + Dopamin D3/D2 agonizması ve Demir kofaktör desteği.",
        "protocolSteps": [
            "1. Zorunlu Ferritin ve Demir Taraması: Serum ferritin düzeyi normal laboratuvar sınırında olsa bile <75 ng/mL (veya transferrin satürasyonu <%20) ise C vitamini eşliğinde demir replasmanı (veya IV ferrik karboksimaltoz) başlanması.",
            "2. Güncel 1. Basamak Farmakoterapi: Uzun dönemde semptomların günün erken saatlerine kaymasını (augmentasyon) önlemek için akşam saatlerinde Gabapentin (300-900 mg) veya Pregabalin (75-150 mg) tercih edilmesi.",
            "3. Dopamin Agonisti Seçeneği: Düşük doz Pramipeksol (0.125 - 0.5 mg) veya Ropinirolün semptom başlangıcından 2 saat önce verilmesi.",
            "4. Tetikleyici Eliminasyonu: Akşam kafein, alkol ile RLS'yi şiddetlendiren antihistaminik, SSRI, Mirtazapin ve antipsikotik ilaçların gözden geçirilmesi."
        ],
        "pitfalls": "KLİNİK TUZAK: Dopamin agonistleri (Pramipeksol, Ropinirol) yüksek dozlarda uzun süre kullanıldığında: 1) 'Augmentasyon' (semptomların öğleden sonraya ve kollara yayılması), 2) Patolojik Kumar Oynama, Kompulsif Alışveriş ve Hipersensüalite gibi ağır Dürtü Kontrol Bozuklukları tetikler!"
    },
    {
        "id": "ect_biological_acute",
        "nameTr": "Elektrokonvülsif Terapi (EKT - Ağır Psikotik/Melankolik/Cotard/Katatoni)",
        "nameEn": "Electroconvulsive Therapy (ECT - Gold Standard for Cotard Syndrome, Malignant Catatonia & Severe Psychotic MDD)",
        "family": "SOMATIC_BIOLOGICAL",
        "aliases": [
            "EKT",
            "Elektrokonvülsif Terapi",
            "Electroconvulsive Therapy",
            "Nöromodülasyon",
            "Acil EKT Protokolü"
        ],
        "goldForDiagnoses": [
            "mdd"
        ],
        "shortDefinition": "Organlarının çürüdüğüne veya öldüğüne inanan Cotard Sendromunda, yemeden-içmeden kesilmiş ağır Melankolik/Psikotik Depresyonda, Lorazepama yanıtsız Katatonide ve akut yüksek intihar riskinde %80-90 yanıt oranıyla hayat kurtaran en güçlü biyolojik tedavidir.",
        "mechanism": "Genel anestezi ve kas gevşetici altında kontrollü, kısa süreli (30-60 sn) jeneralize serebral nöbet oluşturarak; hipokampal nörogenezi, BDNF salınımını, kan-beyin bariyeri geçirgenliğini ve tüm monoaminerjik/GABAerjik/glutamaterjik reseptör duyarlılığını hızla yeniden başlatır (resetler).",
        "targetMechanism": "Yaygın nörotrofik faktör (BDNF) deşarjı, hipokampal nörogenez ve monoaminerjik/GABAerjik reseptör resensitizasyonu.",
        "protocolSteps": [
            "1. Anestezi ve Hazırlık: Kısa etkili anestezik (Propofol/Metoheksital) ve kas kırıklarını önlemek için kas gevşetici (Süksinilkolin; NMS/katatonide Roküronyum!) eşliğinde %100 oksijenizasyon.",
            "2. Elektrot Yerleşimi ve Seans Planı: Bilişsel yan etkiyi azaltmak için Sağ Ünilateral (RUL) veya acil Cotard/Katatoni/Suisidal vakalarda maksimum hız için Bitemporal (Bilateral) yerleşim; haftada 3 kez toplam 6-12 seans.",
            "3. Eşlik Eden İlaçların Düzenlenmesi: Nöbet eşiğini yükselterek EKT'yi engelleyen Benzodiazepin ve Antiepileptiklerin seans öncesi azaltılması; Lityumun akut deliryum riski nedeniyle EKT günlerinde kesilmesi.",
            "4. Relaps Önleyici İdame: EKT sonrası nüks oranı yüksek olduğundan remisyon sağlanır sağlanmaz Antidepresan + Lityum veya Antipsikotik idamesine (veya idame EKT'ye) geçilmesi."
        ],
        "pitfalls": "EKT'nin mutlak kontrendikasyonu yoktur; ancak Kafa İçi Basınç Artışı (KİBAS / beyin tümörü), son 3 ayda geçirilmiş Miyokard İnfarktüsü, kararsız aort anevrizması ve feokromositoma çok yüksek risk oluşturur. En sık yan etkisi seans günlerine ait geçici retrograd/anterograd amnezidir."
    },
    {
        "id": "vp_shunt_neurosurgery",
        "nameTr": "Ventriküloperitoneal (VP) Şant Cerrahisi (Normal Basınçlı Hidrosefali)",
        "nameEn": "Ventriculoperitoneal (VP) Shunt Neurosurgery & CSF Tap Test (Normal Pressure Hydrocephalus)",
        "family": "SOMATIC_BIOLOGICAL",
        "aliases": [
            "VP Şant",
            "Ventriküloperitoneal Şant",
            "NPH Cerrahisi",
            "BOS Tap Testi",
            "Hakim-Adams Tedavisi"
        ],
        "goldForDiagnoses": [
            "major_neurocognitive_another_medical"
        ],
        "shortDefinition": "Hakim-Adams üçlüsü (mıknatıs/apraksik yürüme bozukluğu, üriner inkontinans ve frontal-subkortikal demans) ile karakterize Normal Basınçlı Hidrosefalide (NPH) ventriküllerdeki fazla BOS'u peritona drene ederek demansı geri döndüren nöroşirürjikal tedavidir.",
        "mechanism": "Serebral ventriküllerin genişleyerek (Evans indeksi >0.3) periventriküler beyaz cevherdeki korona radiata (bacak motor lifleri ve mesane kontrol yolakları) ve prefrontal traktuslara yaptığı mekanik gerilme/iskemi basısını kalıcı olarak ortadan kaldırır.",
        "targetMechanism": "Ventriküloperitoneal BOS drenajı ile periventriküler korona radiata traktus basısının dekompresyonu.",
        "protocolSteps": [
            "1. Nörogörüntüleme (MRG): Kortikal sulkuslarda atrofi olmamasına rağmen lateral ve 3. ventriküllerde orantısız genişleme (DESH bulgusu ve transependimal BOS sızıntısı) saptanması.",
            "2. Tanısal Yüksek Volümlü LP (Miller-Fisher Tap Testi): Lomber ponksiyonla 30 - 50 ml BOS boşaltılması; işlem öncesi ve 2-4 saat sonrası 10 metre yürüme testi ile adım hızında belirgin düzelmenin kanıtlanması.",
            "3. Ayarlanabilir Valfli VP Şant Cerrahisi: Beyin cerrahisi tarafından lateral ventrikülden periton boşluğuna uzanan basınç ayarlı şant kateterinin yerleştirilmesi.",
            "4. Postoperatif Nörorehabilitasyon: Yürüme dengesi, düşme önleme ve kognitif egzersizlerle tam fonksiyonel kazanım."
        ],
        "pitfalls": "KRİTİK TUZAK: NPH'yi 'Alzheimer veya Parkinson' sanarak yıllarca sadece Donepezil/Levodopa ile izlemek, geri döndürülebilir bir demansın kalıcı aksonal hasarla geri dönüşsüz hale gelmesine neden olur! Cerrahi sonrası aşırı drenaja bağlı subdural hematom ve şant enfeksiyonu takip edilmelidir."
    },
    {
        "id": "desmopressin_enuresis",
        "nameTr": "Desmopressin (DDAVP) & Enürezis Alarm Tedavisi",
        "nameEn": "Enuresis Alarm Conditioning & Oral Desmopressin (DDAVP) Protocol",
        "family": "SOMATIC_BIOLOGICAL",
        "aliases": [
            "Desmopressin",
            "DDAVP",
            "Minirin",
            "Enürezis Alarmı",
            "Oksibutinin"
        ],
        "goldForDiagnoses": [
            "enuresis"
        ],
        "shortDefinition": "Çocukluk çağı Enürezis Nokturna (Gece Alt Islatma) tedavisinde en düşük nüks oranına sahip klasik koşullanma temelli Enürezis Alarmı ile hızlı sosyal/kamp kontrolü sağlayan sentetik antidiüretik hormon analoğu Desmopressin (DDAVP) protokolüdür.",
        "mechanism": "Desmopressin (DDAVP) böbrek toplayıcı kanallarındaki V2 vazopressin reseptörlerine seçici agonizma yaparak su geri emilimini artırır ve gece idrar üretimini (nokturnal poliüriyi) fizyolojik mesane kapasitesinin altına düşürür.",
        "targetMechanism": "Renal toplayıcı tübül V2 reseptör agonizması ile gece diürezinin azaltılması + uyanma refleksi koşullanması.",
        "protocolSteps": [
            "1. Organik ve Ürolojik Tarama: İdrar tetkiki (İYE), diyabet (glukozüri), kabızlık (rektumun mesaneye basısı) ve spina bifida oculta'nın dışlanması.",
            "2. Davranışsal ve Alarm İlk Basamağı: Akşam saatlerinden itibaren sıvı kısıtlaması, yatmadan önce tam işeme, kuru geceler için yıldız tablosu ve altın standart Enürezis Zil/Alarm pedi kullanımı.",
            "3. Desmopressin (DDAVP) Farmakoterapisi: Alarmın yetersiz kaldığı, nokturnal poliürisi olan veya okul kampı/misafirlik gibi hızlı sonuç gereken durumlarda yatmadan 1 saat önce oral/sublingual Desmopressin (120-240 mcg MELT) verilmesi.",
            "4. Gündüz Semptomlarında Antikolinerjik: Eğer gündüz ani sıkışma ve idrar kaçırma (aşırı aktif detrusor / Enürezis Diürna) varsa ürodinami/üroloji eşliğinde Oksibutinin eklenmesi."
        ],
        "pitfalls": "HAYATİ SU ZEHİRLENMESİ RİSKİ: Desmopressin (DDAVP) içildikten sonra çocuğun gece çok miktarda su içmesi Dilüsyonel Hiponatremi, beyin ödemi ve hiponatremik konvülsiyona (nöbet) yol açar! İlaçtan 1 saat önce ve sabaha kadar sıvı alımı kesinlikle sınırlandırılmalıdır. Eski bir ajan olan İmipramin (TAD) ise çocuklarda ölümcül kardiyak aritmi riski nedeniyle artık son basamak dışına çıkarılmıştır."
    },
    {
        "id": "psychotherapy_first_no_drug",
        "nameTr": "Birinci Basamakta İlaçsız İzlem (Psikoterapi & Davranışsal Müdahale Öncelikli)",
        "nameEn": "Psychotherapy-First / Non-Pharmacological Primary Protocol (Deprescribing & Behavioral Priority)",
        "family": "SOMATIC_BIOLOGICAL",
        "aliases": [
            "İlaçsız İzlem",
            "Psikoterapi Öncelikli Yaklaşım",
            "Birinci Basamakta İlaç Endikasyonu Yok",
            "Davranışsal & Özel Eğitim Önceliği",
            "Gereksiz Polifarmasiden Kaçınma"
        ],
        "goldForDiagnoses": [
            "specific_phobia",
            "conversion_disorder",
            "factitious_disorder",
            "factitious_another",
            "did",
            "dissociative_amnesia",
            "other_specified_dissociative",
            "childhood_fluency_disorder",
            "specific_learning_disorder",
            "developmental_coordination_disorder",
            "genito_pelvic_pain",
            "pica",
            "encopresis",
            "odd",
            "major_neurocognitive_frontotemporal",
            "borderline_pd",
            "narcissistic_pd",
            "antisocial_pd",
            "histrionic_pd",
            "paranoid_pd",
            "schizoid_pd",
            "ocpd",
            "avoidant_pd",
            "dependent_pd"
        ],
        "shortDefinition": "Özgül Fobiler, Konversiyon (PNES), Dissosiyatif Kimlik/Amnezi, Yapay Bozukluk, Disleksi/Kekemelik/Dispraksi, Vajinismus ve saf Kişilik Bozuklukları gibi rutin psikotrop ilacın endike olmadığı veya tedaviyi bozduğu durumlarda uygulanan kanıta dayalı ilaçsız izlem protokolüdür.",
        "mechanism": "İatrojenik ilaç yan etkilerinden, sedasyona bağlı maruziyet/öğrenme blokajından (örn. fobide benzodiazepinin habituasyonu engellemesi) ve ikincil kazanç pekiştirmesinden kaçınarak; doğrudan korku sönmesi, şema yeniden yapılandırması, konuşma/özel eğitim nöroplastisitesi ve ebeveyn/çevre düzenlemesi üzerinden iyileşme sağlar.",
        "targetMechanism": "İatrojenik polifarmasiden kaçınma ve psikoterapötik/davranışsal nöroplastisitenin korunması.",
        "protocolSteps": [
            "1. Gereksiz ve Zararlı İlaçlardan Kaçınma (Deprescribing): Özgül fobide benzodiazepinlerin (alışmayı bozar), PNES/Konversiyonda antiepileptiklerin, Frontotemporal demansta Donepezilin (ajitasyonu artırır) ve Yapay Bozuklukta invaziv ilaçların kesilmesi.",
            "2. Organik / Nutrisyonel Eksikliklerin Düzeltilmesi: Pika vakalarında demir/çinko eksikliğinin (anemi) giderilmesi, Enkopreziste polietilen glikol (PEG) ile fekal impaksiyonun boşaltılıp davranışsal tuvalet rutini kurulması.",
            "3. Spesifik Kanıta Dayalı Terapi / Rehabilitasyon: Fobide In-Vivo Maruziyet / Applied Tension; Dislekside Orton-Gillingham; Kekemelikte Lidcombe; Disprakside CO-OP Ergoterapi; Vajinismusta Sensate Focus + Dilatatör; Kişilik bozukluklarında DBT / Şema Terapi.",
            "4. Yalnızca Komorbidite Varsa Hedefli Farmakoterapi: Takip sürecinde tabloya Majör Depresyon, ağır Anksiyete veya dürtüsel kriz eklenirse yalnızca o hedef semptoma yönelik ilaç başlanması."
        ],
        "pitfalls": "KLİNİK TUZAK: Özgül fobi hastasına maruz bırakma seansı öncesi Benzodiazepin vermek, amigdalanın korku sönmesi (habituation) öğrenmesini tamamen bloke eder ve ilacı 'güvenlik nesnesi' haline getirir! PNES (Psödonöbet) hastasına gerçek epilepsi gibi çoklu antiepileptik yüklemek ise hastalık rolünü pekiştirir ve toksisite yaratır."
    }
];

/**
 * Tüm DSM-5-TR tanılarını (DIAGNOSES_DATABASE ile birebir) en uygun altın standart farmakoloji/biyolojik protokole eşleştiren tablo
 */
const DIAGNOSIS_TO_PHARMACOLOGY_MAP = {
    // 1. NÖROGELİŞİMSEL BOZUKLUKLAR
    "intellectual_disability_mild": "psychotherapy_first_no_drug",
    "intellectual_disability_moderate": "psychotherapy_first_no_drug",
    "intellectual_disability_severe": "atypical_ap_secondgen",
    "intellectual_disability_profound": "atypical_ap_secondgen",
    "global_developmental_delay": "psychotherapy_first_no_drug",
    "unspecified_intellectual_disability": "psychotherapy_first_no_drug",
    "language_disorder": "psychotherapy_first_no_drug",
    "speech_sound_disorder": "psychotherapy_first_no_drug",
    "childhood_fluency_disorder": "psychotherapy_first_no_drug",
    "social_communication_disorder": "psychotherapy_first_no_drug",
    "unspecified_communication_disorder": "psychotherapy_first_no_drug",
    "asd": "atypical_ap_secondgen",
    "adhd": "methylphenidate_stimulant",
    "specific_learning_disorder": "psychotherapy_first_no_drug",
    "developmental_coordination_disorder": "psychotherapy_first_no_drug",
    "stereotypic_movement_disorder": "atypical_ap_secondgen",
    "tourette": "alpha2_agonist_tic",
    "chronic_motor_vocal_tic": "alpha2_agonist_tic",
    "provisional_tic_disorder": "alpha2_agonist_tic",
    "other_specified_neurodevelopmental": "psychotherapy_first_no_drug",

    // 2. ŞİZOFRENİ SPEKTRUMU VE DİĞER PSİKOTİK BOZUKLUKLAR
    "schizotypal_pd": "atypical_ap_secondgen",
    "delusional_disorder": "pimozide_delusional",
    "brief_psychotic": "atypical_ap_secondgen",
    "schizophreniform": "atypical_ap_secondgen",
    "schizophrenia": "atypical_ap_secondgen",
    "schizoaffective": "atypical_ap_secondgen",
    "substance_induced_psychotic": "atypical_ap_secondgen",
    "psychotic_due_to_medical": "atypical_ap_secondgen",
    "catatonia_associated": "lorazepam_catatonia",
    "catatonia_medical": "lorazepam_catatonia",
    "other_specified_schizophrenia_spectrum": "atypical_ap_secondgen",

    // 3. BİPOLAR VE İLİŞKİLİ BOZUKLUKLAR
    "bipolar_1": "lithium_gold",
    "bipolar_2": "lamotrigine_bipolar2",
    "cyclothymia": "lithium_gold",
    "substance_induced_bipolar": "valproate_acute_mania",
    "bipolar_due_to_medical": "valproate_acute_mania",
    "other_specified_bipolar": "lithium_gold",
    "unspecified_bipolar": "lithium_gold",

    // 4. DEPRESİF BOZUKLUKLAR
    "mdd": "ssri_firstline",
    "dysthymia": "ssri_firstline",
    "dmdd": "atypical_ap_secondgen",
    "pmdd": "ssri_firstline",
    "substance_induced_depressive": "ssri_firstline",
    "depressive_due_to_medical": "ssri_firstline",
    "other_specified_depressive": "ssri_firstline",

    // 5. ANKSİYETE BOZUKLUKLARI
    "gad": "snri_dualex",
    "panic_disorder": "ssri_firstline",
    "agoraphobia": "ssri_firstline",
    "social_anxiety": "ssri_firstline",
    "specific_phobia": "psychotherapy_first_no_drug",
    "separation_anxiety": "ssri_firstline",
    "selective_mutism": "ssri_firstline",
    "substance_induced_anxiety": "hydroxyzine_buspirone",
    "anxiety_due_to_medical": "hydroxyzine_buspirone",
    "other_specified_anxiety": "ssri_firstline",

    // 6. OKB VE İLİŞKİLİ BOZUKLUKLAR
    "ocd": "ssri_firstline",
    "bdd": "ssri_firstline",
    "hoarding_disorder": "ssri_firstline",
    "trichotillomania": "clomipramine_ocd",
    "excoriation": "clomipramine_ocd",
    "other_specified_ocd": "ssri_firstline",
    "ocd_due_to_medical": "ssri_firstline",

    // 7. TRAVMA VE STRESÖRLE İLİŞKİLİ BOZUKLUKLAR
    "ptsd": "ssri_firstline",
    "ptsd_preschool": "alpha2_agonist_tic",
    "acute_stress_disorder": "hydroxyzine_buspirone",
    "adjustment_disorder": "hydroxyzine_buspirone",
    "reactive_attachment_disorder": "psychotherapy_first_no_drug",
    "disinhibited_social_engagement": "psychotherapy_first_no_drug",
    "prolonged_grief_disorder": "ssri_firstline",
    "other_specified_trauma": "hydroxyzine_buspirone",

    // 8. DİSSOSİYATİF BOZUKLUKLAR
    "did": "psychotherapy_first_no_drug",
    "dissociative_amnesia": "psychotherapy_first_no_drug",
    "depersonalization_derealization": "lamotrigine_bipolar2",
    "other_specified_dissociative": "psychotherapy_first_no_drug",

    // 9. BEDENSEL BELİRTİ VE İLİŞKİLİ BOZUKLUKLAR
    "somatic_symptom_disorder": "snri_dualex",
    "illness_anxiety_disorder": "ssri_firstline",
    "conversion_disorder": "psychotherapy_first_no_drug",
    "factitious_disorder": "psychotherapy_first_no_drug",
    "factitious_another": "psychotherapy_first_no_drug",
    "psychological_factors_affecting_medical": "snri_dualex",
    "other_specified_somatic": "snri_dualex",

    // 10. BESLENME VE YEME BOZUKLUKLARI
    "anorexia_nervosa": "psychotherapy_first_no_drug",
    "bulimia_nervosa": "ssri_firstline",
    "binge_eating": "ssri_firstline",
    "arfid": "mirtazapine_nassa",
    "pica": "psychotherapy_first_no_drug",
    "rumination_disorder": "psychotherapy_first_no_drug",
    "other_specified_feeding": "ssri_firstline",

    // 11. DIŞA ATIM BOZUKLUKLARI
    "enuresis": "desmopressin_enuresis",
    "encopresis": "psychotherapy_first_no_drug",

    // 12. UYKU-UYANIKLIK BOZUKLUKLARI
    "insomnia_disorder": "mirtazapine_nassa",
    "hypersomnolence": "modafinil_oxybate",
    "narcolepsy": "modafinil_oxybate",
    "obstructive_sleep_apnea": "psychotherapy_first_no_drug",
    "central_sleep_apnea": "psychotherapy_first_no_drug",
    "sleep_related_hypoventilation": "psychotherapy_first_no_drug",
    "nrem_sleep_arousal": "clonazepam_parasomnia",
    "nightmare_disorder": "prazosin_nightmares",
    "rem_sleep_behavior_disorder": "clonazepam_parasomnia",
    "restless_legs_syndrome": "pramipexole_gabapentin_rls",

    // 13. CİNSEL İŞLEV BOZUKLUKLARI VE CİNSİYET DİSFORİSİ
    "erectile_disorder": "bupropion_ndri",
    "premature_ejaculation": "ssri_firstline",
    "delayed_ejaculation": "bupropion_ndri",
    "male_hypoactive_desire": "bupropion_ndri",
    "female_sexual_interest_arousal": "bupropion_ndri",
    "female_orgasmic_disorder": "bupropion_ndri",
    "genito_pelvic_pain": "psychotherapy_first_no_drug",
    "substance_induced_sexual_dysfunction": "bupropion_ndri",
    "unspecified_sexual_dysfunction": "psychotherapy_first_no_drug",
    "gender_dysphoria_children": "psychotherapy_first_no_drug",
    "gender_dysphoria_adolescents_adults": "psychotherapy_first_no_drug",
    "unspecified_gender_dysphoria": "psychotherapy_first_no_drug",

    // 14. YIKICI, DÜRTÜ DENETİMİ VE DAVRANIM BOZUKLUKLARI
    "odd": "psychotherapy_first_no_drug",
    "intermittent_explosive": "ssri_firstline",
    "conduct_disorder": "alpha2_agonist_tic",
    "pyromania": "naltrexone_acamprosate",
    "kleptomania": "naltrexone_acamprosate",

    // 15. MADDE İLE İLİŞKİLİ VE BAĞIMLILIK BOZUKLUKLARI
    "alcohol_use_disorder": "naltrexone_acamprosate",
    "alcohol_intoxication": "thiamine_iv_wernicke",
    "alcohol_withdrawal": "lorazepam_catatonia",
    "alcohol_withdrawal_delirium": "lorazepam_catatonia",
    "cannabis_use_disorder": "hydroxyzine_buspirone",
    "cannabis_intoxication": "hydroxyzine_buspirone",
    "cannabis_withdrawal": "hydroxyzine_buspirone",
    "sedative_hypnotic_use_disorder": "hydroxyzine_buspirone",
    "sedative_withdrawal": "lorazepam_catatonia",
    "opioid_use_disorder": "buprenorphine_naloxone",
    "opioid_intoxication": "buprenorphine_naloxone",
    "opioid_withdrawal": "buprenorphine_naloxone",
    "cocaine_use_disorder": "bupropion_ndri",
    "cocaine_intoxication": "lorazepam_catatonia",
    "cocaine_withdrawal": "bupropion_ndri",
    "amphetamine_use_disorder": "bupropion_ndri",
    "amphetamine_withdrawal": "bupropion_ndri",
    "phencyclidine_use_disorder": "haloperidol_acute",
    "hallucinogen_use_disorder": "lorazepam_catatonia",
    "hallucinogen_persisting_perception": "lamotrigine_bipolar2",
    "inhalant_use_disorder": "psychotherapy_first_no_drug",
    "tobacco_use_disorder": "bupropion_ndri",
    "tobacco_withdrawal": "bupropion_ndri",
    "caffeine_intoxication": "hydroxyzine_buspirone",
    "caffeine_withdrawal": "psychotherapy_first_no_drug",
    "gambling_disorder": "naltrexone_acamprosate",

    // 16. NÖROBİLİŞSEL BOZUKLUKLAR
    "delirium": "haloperidol_acute",
    "major_neurocognitive_alzheimer": "cholinesterase_donepezil",
    "mild_neurocognitive_alzheimer": "cholinesterase_donepezil",
    "major_neurocognitive_vascular": "cholinesterase_donepezil",
    "mild_neurocognitive_vascular": "cholinesterase_donepezil",
    "major_neurocognitive_frontotemporal": "psychotherapy_first_no_drug",
    "major_neurocognitive_lewy_body": "cholinesterase_donepezil",
    "major_neurocognitive_parkinson": "cholinesterase_donepezil",
    "major_neurocognitive_tbi": "cholinesterase_donepezil",
    "major_neurocognitive_hiv": "psychotherapy_first_no_drug",
    "major_neurocognitive_prion": "psychotherapy_first_no_drug",
    "major_neurocognitive_huntington": "valbenazine_vmat2",
    "major_neurocognitive_another_medical": "cholinesterase_donepezil",
    "wernicke_korsakoff_syndrome": "thiamine_iv_wernicke",
    "major_neurocognitive_multiple": "cholinesterase_donepezil",
    "unspecified_neurocognitive": "cholinesterase_donepezil",

    // 17. KİŞİLİK BOZUKLUKLARI (KÜME A, B, C)
    "paranoid_pd": "psychotherapy_first_no_drug",
    "schizoid_pd": "psychotherapy_first_no_drug",
    "antisocial_pd": "psychotherapy_first_no_drug",
    "borderline_pd": "psychotherapy_first_no_drug",
    "histrionic_pd": "psychotherapy_first_no_drug",
    "narcissistic_pd": "psychotherapy_first_no_drug",
    "avoidant_pd": "psychotherapy_first_no_drug",
    "dependent_pd": "psychotherapy_first_no_drug",
    "ocpd": "psychotherapy_first_no_drug",
    "personality_change_due_to_medical": "atypical_ap_secondgen",

    // 18. PARAFİLİK BOZUKLUKLAR
    "voyeuristic": "ssri_firstline",
    "exhibitionistic": "ssri_firstline",
    "frotteuristic": "ssri_firstline",
    "sexual_masochism": "ssri_firstline",
    "sexual_sadism": "ssri_firstline",
    "pedophilic_disorder": "ssri_firstline",
    "fetishistic_disorder": "ssri_firstline",
    "transvestic_disorder": "ssri_firstline",
    "other_specified_paraphilic": "ssri_firstline"

};

/**
 * Her klinik vaka (tüm numaralar) için en doğru altın standart pharmacologyId'yi çözer.
 * Vakanın doğrudan pharmacologyId alanı varsa onu kullanır; yoksa vaka ID'si, klinik ipuçları,
 * diagnosisId, therapyId ve kategori bilgilerini birlikte değerlendirerek nokta atışı eşleştirir.
 *
 * @param {Object} caseObj - Klinik vaka nesnesi ({ id, diagnosisId, category, therapyId, patientSummary, clues })
 * @returns {string} 34 altın standart pharmacologyId'den biri
 */
function resolvePharmacologyIdForCase(caseObj) {
    if (!caseObj) return "psychotherapy_first_no_drug";

    const validIds = new Set(PHARMACOLOGY_DATABASE.map(p => p.id));

    // 1. Eğer vaka nesnesinde zaten geçerli bir pharmacologyId tanımlanmışsa doğrudan döndür
    if (caseObj.pharmacologyId && validIds.has(caseObj.pharmacologyId)) {
        return caseObj.pharmacologyId;
    }

    const caseId = String(caseObj.id || "").toLowerCase();
    const diagId = String(caseObj.diagnosisId || "").toLowerCase();
    const therapyId = String(caseObj.therapyId || "").toLowerCase();
    const cat = String(caseObj.category || "").toUpperCase();
    const summaryText = String(caseObj.patientSummary || "").toLowerCase();
    const cluesText = Array.isArray(caseObj.clues) ? caseObj.clues.join(" ").toLowerCase() : "";
    const fullText = `${summaryText} ${cluesText}`;

    // 2. Özel Vaka ID ve Klinik Alt-Tip Nüansları (Aynı tanı koduna sahip farklı klinik tablolar)
    if (caseId === "case-065" || (diagId === "social_anxiety" && (fullText.includes("performans tipi") || fullText.includes("konser piyanisti") || fullText.includes("sadece performans")))) {
        return "propranolol_beta";
    }
    if (caseId === "case-067" || (diagId === "bipolar_1" && (fullText.includes("hızlı döngü") || fullText.includes("karışık") || fullText.includes("alkol bağımlılığı komorbid") || fullText.includes("valproat")))) {
        return "valproate_acute_mania";
    }
    if (caseId === "case-069" || (diagId === "ocd" && (fullText.includes("ağır okb") || fullText.includes("klomipramin") || fullText.includes("dirençli okb")))) {
        return "clomipramine_ocd";
    }
    if (caseId === "case-029" || (diagId === "mdd" && fullText.includes("çift tanılı"))) {
        return "snri_dualex";
    }
    if (caseId === "case-086" || (diagId === "borderline_pd" && fullText.includes("komorbid"))) {
        return "ssri_plus_antipsychotic";
    }
    if (caseId === "case-087" || (diagId === "anorexia_nervosa" && (fullText.includes("olanzapin") || fullText.includes("bayılma")))) {
        return "atypical_ap_secondgen";
    }
    if (caseId === "case-063" || (diagId === "pica" && fullText.includes("arfid"))) {
        return "mirtazapine_nassa";
    }

    // Şizofreni içinde tedaviye dirençli / Klozapin vakası kontrolü
    if (diagId === "schizophrenia" && (fullText.includes("klozapin") || fullText.includes("tedaviye dirençli") || fullText.includes("agranülositoz") || fullText.includes("iki farklı antipsikotik"))) {
        return "clozapine_resistant";
    }

    // Majör Depresyon alt tipleri (eğer genel 'mdd' koduyla girilmişse metinden yakala)
    if (diagId === "mdd") {
        if (fullText.includes("psikotik özellik") || fullText.includes("nihilistik") || fullText.includes("suçluluk sanrı")) {
            return "ssri_plus_antipsychotic";
        }
        if (fullText.includes("ekt") || fullText.includes("elektrokonvülsif") || fullText.includes("melankolik") || fullText.includes("katatoni")) {
            return "ect_biological_acute";
        }
        if (fullText.includes("mevsimsel") || fullText.includes("kış depresyonu") || fullText.includes("bupropion") || fullText.includes("atipik özellik")) {
            return "bupropion_ndri";
        }
    }

    // 3. Doğrudan DSM-5-TR Tanı Haritasından Eşleştirme
    if (DIAGNOSIS_TO_PHARMACOLOGY_MAP[diagId]) {
        return DIAGNOSIS_TO_PHARMACOLOGY_MAP[diagId];
    }

    // 4. Terapi ID Tabanlı Yedek Eşleştirme
    if (therapyId === "emergency_detox") {
        if (fullText.includes("serotonin") || fullText.includes("siproheptadin")) return "cyproheptadine_serotonin";
        return "dantrolene_bromocriptine";
    }
    if (therapyId === "vmat2_inhibitor") return "valbenazine_vmat2";
    if (therapyId === "surgical_shunt") return "vp_shunt_neurosurgery";
    if (therapyId === "sleep_hygiene_stimulants") return "modafinil_oxybate";
    if (therapyId === "safety_clonazepam" || therapyId === "sleep_safety_cbt") return "clonazepam_parasomnia";
    if (therapyId === "irt") return "prazosin_nightmares";
    if (therapyId === "cbt_i") return "mirtazapine_nassa";

    // 5. Kategori Tabanlı Son Yedek Eşleştirme
    switch (cat) {
        case "PSYCHOTIC":
            return "atypical_ap_secondgen";
        case "BIPOLAR":
            return "lithium_gold";
        case "MOOD":
            return "ssri_firstline";
        case "ANXIETY":
        case "OCD_RELATED":
        case "TRAUMA":
        case "PARAPHILIC":
            return "ssri_firstline";
        case "SUBSTANCE":
            return "naltrexone_acamprosate";
        case "NEUROCOGNITIVE":
            return "cholinesterase_donepezil";
        default:
            return "psychotherapy_first_no_drug";
    }
}

if (typeof window !== "undefined") {
    window.PHARMACOLOGY_FAMILIES = PHARMACOLOGY_FAMILIES;
    window.PHARMACOLOGY_DATABASE = PHARMACOLOGY_DATABASE;
    window.DIAGNOSIS_TO_PHARMACOLOGY_MAP = DIAGNOSIS_TO_PHARMACOLOGY_MAP;
    window.resolvePharmacologyIdForCase = resolvePharmacologyIdForCase;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        PHARMACOLOGY_FAMILIES,
        PHARMACOLOGY_DATABASE,
        DIAGNOSIS_TO_PHARMACOLOGY_MAP,
        resolvePharmacologyIdForCase
    };
}
