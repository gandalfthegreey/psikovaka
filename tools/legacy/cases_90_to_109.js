const fs = require('fs');
const path = require('path');

const newCases90to109 = [
    // 90. Capgras Sanrısı (Capgras Delusion)
    {
        id: "case-090",
        caseNumber: 90,
        difficulty: "Zor",
        course: "ADULT",
        diagnosisId: "capgras_syndrome",
        therapyId: "cbt_psychosis",
        category: "PSYCHOTIC",
        patientSummary: "52 yaşında, kadın, ev hanımı (Sanrısal Yanlış Tanıma Sendromu)",
        clues: [
            "52 yaşındaki danışan, 28 yıllık eşinin 'aslında öldüğünü ve şu an evde yaşayan adamın onun yerine geçen kusursuz bir dublör olduğunu' iddia ederek savcılığa başvurdu.",
            "Danışan adamın boyunun, ses tonunun ve yüz hatlarının eşine tıpatıp benzediğini kabul etmekte, ancak gözlerine baktığında 'Onun gerçek kocam olmadığını, sahte bir sahtekara ait olduğunu biliyorum' demektedir.",
            "Son 3 aydır eşiyle aynı yatakta yatmaktan korkarak kapısını arkadan kilitlediği ve eşinin hazırladığı yemekleri zehirli olabilir şüphesiyle yemediği öğrenildi.",
            "Kranial MR ve EEG tetkikleri yapılmış; sağ temporo-paryetal bölgede hafif hipoperfüzyon dışında akut nörolojik lezyon veya deliryum bulgusu saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Görsel yüz tanıma belleği korunmuş olmasına karşın, tanıdık yüze karşı duygusal aşinalık yanıtının kopmasına bağlı mono-semptomatik sanrı saptandı.",
            "DSM-5 ve psikopatolojiye göre: Kişinin birinci derece yakınının fiziksel olarak tıpatıp aynı görünen sahte bir dublörle değiştirildiğine dair sarsılmaz inançla giden Capgras Sanrısı tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "kusursuz bir dublör olduğunu", dsmMatch: "DSM-5 / Psikopatoloji: Yakın birinin dublörle değiştirildiği sanrısı (Capgras)" },
            { clueIndex: 4, text: "duygusal aşinalık yanıtının kopmasına bağlı", dsmMatch: "Nöropsikiyatri: Ventral görsel yol ile dorsal limbik aşinalık kopukluğu" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Bilişsel Davranışçı Psikoz Terapisi (CBTp) & Atipik Antipsikotik",
            therapyDetails: "Sanrıyı doğrudan tartışmadan duygusal yabancılaşma hissiyle çalışma, gerçeklik sınaması ve aile psiko-eğitimi.",
            pharmacologyNote: "İkinci kuşak antipsikotikler (Risperidon, Olanzapin veya Aripiprazol) birinci basamak medikal tedavidir."
        },
        miniQuiz: {
            question: "Capgras Sendromunda hastanın 'Bu kişi eşime tıpatıp benziyor ama o değil, bir dublör' demesinin temel nörolojik mekanizması nedir?",
            options: [
                "Görsel yüz tanımanın sağlam olması fakat tanıdık yüze verilen otonomik duygusal aşinalık yanıtının kopmuş olması",
                "Hastanın yüzleri hiç görememesi (Körlük)",
                "Hastanın eşinin adını unutması (Amnezi)",
                "Hastanın tamamen şakacı bir kişiliğe sahip olması"
            ],
            correctIndex: 0,
            explanation: "Capgras'ta ventral yüz tanıma çalışır (yüzü tanır), ancak dorsal otonomik/limbik yol çalışmaz (aşinalık hissi doğmaz). Beyin bu çelişkiyi 'tıpatıp benziyor ama bir sahtekar' sanrısıyla rasyonalize eder."
        },
        differentialDiagnosis: "• Fregoli Sendromu: Yabancı birinin kılık değiştirmiş tanıdık bir kişi olduğu sanrısıdır (Capgras'ın tersidir).\n• Prosopagnozi (Yüz Körü): Hasta yüzü tanıyamaz ancak sanrı üretmez; sesinden tanıyınca rahatlar.\n• Paranoid Şizofreni: Çoklu bizar hezeyanlar ve halüsinasyonlar eşlik eder.",
        dsmCriteriaSummary: "DSM-5: Tanıdık bir yakınının sahte bir kopya/dublörle değiştirildiğine dair sabit ve sarsılmaz sanrı."
    },

    // 91. Cotard Sendromu (Yürüyen Ceset / Nihilistik Sanrı)
    {
        id: "case-091",
        caseNumber: 91,
        difficulty: "İleri Düzey",
        course: "ADULT",
        diagnosisId: "cotard_syndrome",
        therapyId: "ect_biological",
        category: "PSYCHOTIC",
        patientSummary: "61 yaşında, erkek, emekli bankacı (Ağır Psikotik Depresyon Zemininde Nihilistik Sanrı)",
        clues: [
            "61 yaşındaki danışan, ailesine 'Ben aslında 2 hafta önce öldüm, iç organlarım çürüdü, kalbim atmıyor ve midem olmadığı için artık yemek yiyemem' diyerek mutlak açlık grevine girdiği için acil servise getirildi.",
            "Ailesi stetoskopla kendi kalp atışını dinletmeye çalıştığında 'O duyduğunuz ses şeytanın mekanik hilesi, benim damarlarımda kan değil irin akıyor' diyerek hiçbir kanıtı kabul etmedi.",
            "Son 1 aydır banyo yapmayı ve hareket etmeyi reddetmekte, 'Cesetler yıkanmaz, beni hemen mezarlığa gömün' diye feryat etmektedir.",
            "Dahiliye muayenesinde ileri derecede dehidratasyon ve kilo kaybı saptanmış, biyokimya ve ultrason organların anatomik olarak sağlam olduğunu göstermiştir.",
            "Ruhsal Durum Muayenesinde: Ağır psikomotor retardasyon, nihilistik (varoluşu inkar eden) hezeyanlar, ölümsüz bir çürüme içinde lanetlendiği inancı ve derin psikotik çökkünlük gözlendi.",
            "DSM-5 psikotik depresyon spektrumuna göre: Kendi bedeninin, organlarının veya ruhunun tamamen yok olduğuna ya da öldüğüne dair aşırı nihilistik sanrılarla seyreden klasik Cotard Sendromu tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "Ben aslında 2 hafta önce öldüm, iç organlarım çürüdü", dsmMatch: "Psikopatoloji: Aşırı nihilistik (yokluk) sanrısı (Cotard Sendromu)" },
            { clueIndex: 4, text: "nihilistik (varoluşu inkar eden) hezeyanlar", dsmMatch: "DSM-5: Psikotik özellikli ağır majör depresyon tablosu" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Elektrokonvülsif Terapi (EKT) & Biyolojik Stabilizasyon",
            therapyDetails: "Hayatı tehdit eden mutlak açlık ve ağır psikotik depresyonda en hızlı ve hayat kurtarıcı yöntem EKT'dir.",
            pharmacologyNote: "Yüksek doz antidepresan (Venlafaksin/Sertralin) + Atipik Antipsikotik (Olanzapin/Ketiapin) kombinasyonu."
        },
        miniQuiz: {
            question: "Cotard Sendromunda hastanın 'Ben öldüm, kalbim ve midem yok' demesi psikopatolojide hangi sanrı (hezeyan) türünün en uç örneğidir?",
            options: [
                "Nihilistik (Yokluk / Hiçlik) Sanrısı",
                "Erotomanik Sanrı",
                "Referans (Alınma) Sanrısı",
                "Büyüklük (Grandiyöz) Sanrısı"
            ],
            correctIndex: 0,
            explanation: "Cotard Sendromu, kişinin kendi varlığını, organlarını veya dünyanın varlığını inkar ettiği en ağır 'nihilistik' sanrıdır."
        },
        differentialDiagnosis: "• Hipokondriyazis (Hastalık Kaygısı): Hasta hasta olduğunu düşünür ama yaşadığını bilir; organlarının yok olduğunu iddia etmez.\n• Şizofreni: Bizar hezeyanlar vardır ancak Cotard'daki melankolik/suçluluk temelli ölüm inancı psikotik depresyona özgüdür.",
        dsmCriteriaSummary: "DSM-5: Kendi bedeninin/organlarının yok olduğu veya öldüğü şeklinde nihilistik sanrılarla giden psikotik depresyon."
    },

    // 92. Nöroleptik Malign Sendrom (NMS - Antipsikotik Acili)
    {
        id: "case-092",
        caseNumber: 92,
        difficulty: "Zor",
        course: "NEURO_SOMATIC",
        diagnosisId: "neuroleptic_malignant_syndrome",
        therapyId: "medical_stabilization",
        category: "OTHER_CLINICAL",
        patientSummary: "28 yaşında, erkek, psikiyatri servisinde yatan şizofreni hastası (Acil Klinik Tablo)",
        clues: [
            "28 yaşındaki hasta, ajitasyon nedeniyle yüksek doz kas içi Haloperidol uygulamasının 3. gününde aniden 40.2°C'ye fırlayan yüksek ateş, yoğun terleme ve bilinç bulanıklığı geliştirdi.",
            "Fizik muayenede kollarında ve bacaklarında bükülmeye karşı aşırı sertlik ve direnç (kurşun boru rijiditesi) tespit edildi; hasta konuşamamakta ve yutkunamamaktadır.",
            "Otonomik instabilite bulguları olarak tansiyonu dakikalar içinde 180/110 mmHg ile 90/60 mmHg arasında dalgalanmakta, nabzı 135/dk seyretmektedir.",
            "Laboratuvar tetkiklerinde Serum Kreatin Kinaz (CK) düzeyi 28.000 U/L (aşırı yüksek), lökositoz ve miyoglobinüri saptandı; enfeksiyon kaynağı veya menenjit dışlandı.",
            "Ruhsal Durum Muayenesinde: Stupor düzeyinde bilinç baskılanması, mutizm, santral dopamin D2 blokajına bağlı termoregülasyon çöküşü ve rabdomiyoliz tablosu belirlendi.",
            "DSM-5 ve tıbbi acil kriterlerine göre: Antipsikotik kullanımı zemininde gelişen hipertermi, kurşun boru rijiditesi, aşırı CK yüksekliği ve otonomik dengesizlikle seyreden Nöroleptik Malign Sendrom (NMS) tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 1, text: "kurşun boru rijiditesi", dsmMatch: "Klinik Belirteç: Nöromüsküler kurşun boru (lead-pipe) sertliği" },
            { clueIndex: 3, text: "Serum Kreatin Kinaz (CK) düzeyi 28.000 U/L", dsmMatch: "Laboratuvar Kriteri: Masif rabdomiyoliz ve CK yüksekliği" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Acil Tıbbi Stabilizasyon & Antidot Protokolü",
            therapyDetails: "Tüm antipsikotiklerin derhal stoplanması, yoğun bakımda aktif soğutma, hidrasyon ve kas gevşetici Dantrolen / dopamin agonisti Bromokriptin.",
            pharmacologyNote: "Dantrolen (kalsiyum salınım inhibitörü) ve Bromokriptin (dopamin agonisti) hayat kurtarıcı antidotlardır."
        },
        miniQuiz: {
            question: "Nöroleptik Malign Sendrom (NMS) ile Serotonin Sendromunu nörolojik muayenede birbirinden ayıran en kritik kas tonusu bulgusu nedir?",
            options: [
                "NMS'de 'kurşun boru' şeklinde yaygın rijidite görülürken, Serotonin Sendromunda 'klonus ve hiperrefleksi' ön plandadır.",
                "NMS'de hastanın kasları tamamen gevşektir (felç).",
                "Serotonin sendromunda ateş hiç yükselmez.",
                "İkisinde de kas muayenesi tamamen normaldir."
            ],
            correctIndex: 0,
            explanation: "NMS dopamin blokajına bağlı plastik kurşun boru rijiditesi yapar. Serotonin sendromu ise hiperrefleksi ve ayak bileği klonusu (spontan/indüklenebilir klonus) ile karakterizedir."
        },
        differentialDiagnosis: "• Serotonin Sendromu: Klonus, hiperrefleksi ve ishal vardır; rijidite yerine aşırı refleks artışı belirgindir.\n• Malign Hipertermi: İnhalasyon anestezikleri ve süksinilkolin sonrası ameliyathanede gelişir.\n• Santral Sinir Sistemi Enfeksiyonu (Menenjit): Nöroleptik ilişkisi ve masif CK yüksekliği yoktur.",
        dsmCriteriaSummary: "DSM-5: Nöroleptik kullanımı + Hipertermi (>38°C) + Kurşun boru rijiditesi + Otonomik labilite + CK yüksekliği."
    },

    // 93. Serotonin Sendromu (Serotonin Toksisitesi)
    {
        id: "case-093",
        caseNumber: 93,
        difficulty: "Zor",
        course: "NEURO_SOMATIC",
        diagnosisId: "serotonin_syndrome",
        therapyId: "medical_stabilization",
        category: "OTHER_CLINICAL",
        patientSummary: "35 yaşında, kadın, ofis çalışanı (Polifarmasi Toksisitesi Acili)",
        clues: [
            "35 yaşındaki danışan, kullandığı yüksek doz Essitalopram (SSRI) ilacına ek olarak migren atağı için triptan ve aktardan aldığı Sarı Kantaron çayını aynı gün içtikten 4 saat sonra acile getirildi.",
            "Acil serviste hastanın yerinde duramadığı (aşırı ajitasyon), ellerinde şiddetli titreme, terleme, ishal ve göz bebeklerinde aşırı büyüme (midriyazis) olduğu görüldü.",
            "Nörolojik muayenede kritik ayırt edici bulgu: Ayak bileklerine vurulduğunda kendiliğinden durmayan klonus, bacaklarda belirgin hiperrefleksi ve titreme saptandı.",
            "Vücut sıcaklığı 38.8°C ölçüldü; kurşun boru rijiditesi YOKTUR (kaslar spastik değil hiperreflektif ve kloniktir).",
            "Ruhsal Durum Muayenesinde: Hızlı başlangıçlı konfüzyon, hipomani benzeri basınçlı konuşma, aşırı irkilme ve santral serotonerjik aşırı uyarılma tablosu gözlendi.",
            "Hunter kriterlerine göre: Birden fazla serotonerjik ajanın eşzamanlı kullanımıyla tetiklenen, spontan klonus, ajitasyon, hipertermi, terleme ve otonomik hiperaktivite ile giden Serotonin Sendromu tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 2, text: "kendiliğinden durmayan klonus, bacaklarda belirgin hiperrefleksi", dsmMatch: "Hunter Kriteri: Nöromüsküler eksitasyon (spontan klonus ve hiperrefleksi)" },
            { clueIndex: 0, text: "Essitalopram (SSRI) ilacına ek olarak migren atağı için triptan ve ... Sarı Kantaron", dsmMatch: "Etiyoloji: Çoklu serotonerjik ajan polifarmasisi" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Serotonerjik Ajan Kesimi & Siproheptadin Protokolü",
            therapyDetails: "Tüm serotonerjik ilaçların kesilmesi, Benzodiazepin (sedasyon ve ajitasyon için) ve 5-HT2A antagonisti Siproheptadin verilmesi.",
            pharmacologyNote: "Siproheptadin spesifik serotonin reseptör antagonistidir; soğutma ve hidrasyon esastır."
        },
        miniQuiz: {
            question: "Serotonin Sendromu tanısında Hunter Kriterlerine göre en spesifik ve tanı koydurucu tek nörolojik bulgu nedir?",
            options: [
                "Spontan veya indüklenebilir Klonus (Ayak bileği vurularında sürekli atım)",
                "Kurşun boru rijiditesi",
                "Koku alma kaybı",
                "Deri döküntüsü"
            ],
            correctIndex: 0,
            explanation: "Hunter Toksisite Kriterlerine göre serotonerjik ilaç öyküsü olan bir hastada spontan klonus varlığı Serotonin Sendromu için tek başına kesin tanı koydurucudur."
        },
        differentialDiagnosis: "• Nöroleptik Malign Sendrom (NMS): Dopamin blokajında olur; klonus yerine kurşun boru rijiditesi vardır.\n• Antikolinerjik Toksisite: Cilt kuru ve kırmızıyken Serotonin sendromunda bol terleme ve ishal vardır.",
        dsmCriteriaSummary: "DSM-5 / Hunter: Serotonerjik ajan kullanımı + Spontan klonus / ajitasyon / terleme / hiperrefleksi / hipertermi."
    },

    // 94. Narkolepsi (Katapleksi ile Birlikte)
    {
        id: "case-094",
        caseNumber: 94,
        difficulty: "Orta",
        course: "ADULT",
        diagnosisId: "narcolepsy",
        therapyId: "sleep_hygiene_stimulants",
        category: "SLEEP",
        patientSummary: "23 yaşında, erkek, üniversite öğrencisi",
        clues: [
            "23 yaşındaki genç adam, arkadaşlarıyla komik bir fıkraya kahkahalarla gülerken aniden dizlerinin bağının çözüldüğünü, çenesinin düştüğünü ve bilinci tamamen açık olmasına rağmen yere yığılıp 1 dakika hareket edemediğini anlattı.",
            "Gündüzleri en heyecanlı derslerde veya araba sürerken bile önüne geçilemez bir ağırlıkla aniden uyuyakaldığını, 15-20 dakikalık bu uykulardan son derece dinlenmiş uyandığını belirtti.",
            "Gece yatağa girdiğinde uykuya dalarken odada yabancı gölgeler gördüğünü (hipnagojik halüsinasyon) ve sabahları uyandığında ses çıkaramayıp felç gibi kaldığını söyledi.",
            "Polisomnografi ve MSLT testinde ortalama uyku latansı 2.5 dakika çıkmış ve test aralıklarında erken REM başlangıcı (SOREMP) kaydedilmiştir.",
            "BOS incelemesinde Hipokretin-1 (Oreksin-A) düzeyi < 110 pg/mL (ağır eksiklik) saptandı.",
            "DSM-5'e göre: Karşı konulamaz gündüz uyku atakları ile birlikte duygusal tetiklenmeli katapleksi ve BOS hipokretin eksikliği kriterlerini tam karşılayan Tip 1 Narkolepsi tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "kahkahalarla gülerken aniden dizlerinin bağının çözüldüğünü ... bilinci tamamen açık", dsmMatch: "DSM-5 Kriter B1: Duygusal tetiklenmeli katapleksi atağı" },
            { clueIndex: 4, text: "Hipokretin-1 (Oreksin-A) düzeyi < 110 pg/mL", dsmMatch: "DSM-5 Kriter B2: Hipokretin/Oreksin eksikliği" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Davranışsal Uyku Yönetimi & Nörostimülan Protokolü",
            therapyDetails: "Günde 2 kez 15 dakikalık planlı stratejik şekerlemeler, katapleksi tetikleyicilerini yönetme ve Modafinil/Sodyum Oksibat farmakoterapisi.",
            pharmacologyNote: "Gündüz uykululuğu için Modafinil/Pitolisant; katapleksi için REM baskılayıcı antidepresanlar veya Sodyum Oksibat."
        },
        miniQuiz: {
            question: "Narkolepsi Tip 1 tablosunda gülme veya şaka gibi ani olumlu duygularla tetiklenen ve bilincin açık olduğu geçici kas tonusu kaybına ne ad verilir?",
            options: [
                "Katapleksi",
                "Katalepsi",
                "Kataloni",
                "Katatoni"
            ],
            correctIndex: 0,
            explanation: "Katapleksi; narkolepsiye özgü, duyguyla (özellikle gülmeyle) tetiklenen ve bilinç kaybı olmaksızın aniden yere yığılmaya yol açan kas tonusu kaybıdır."
        },
        differentialDiagnosis: "• İdiyopatik Hipersomni: Uykular dinlendirmez, katapleksi ve hipokretin eksikliği yoktur.\n• Senkop (Bayılma): Bilinç kaybı yaşanır; kataplekside ise hasta bilinci açıkken yere yığılır.\n• Epilepsi (Atonik Nöbet): EEG'de epileptik deşarjlar vardır ve gülmeyle tetiklenmez.",
        dsmCriteriaSummary: "DSM-5: Karşı konulamaz uyku atakları (≥3 ay, ≥3 kez/hafta) + Katapleksi veya BOS Hipokretin eksikliği."
    },

    // 95. REM Uykusu Davranış Bozukluğu (RBD)
    {
        id: "case-095",
        caseNumber: 95,
        difficulty: "Orta",
        course: "NEURO_SOMATIC",
        diagnosisId: "rem_sleep_behavior_disorder",
        therapyId: "safety_clonazepam",
        category: "SLEEP",
        patientSummary: "64 yaşında, erkek, emekli mühendis (Prodromal Sinükleinopati Riski)",
        clues: [
            "64 yaşındaki danışan, gece rüyasında vahşi bir kurtla dövüştüğünü görürken yatakta yanındaki eşine yumruk atıp kaburgasını çatlatması ve yataktan halıya uçarak kafasını çarpması üzerine getirildi.",
            "Eşi, hastanın son 2 yıldır uykunun ikinci yarısında (sabaha karşı) uykusunda bağırdığını, küfür ettiğini, tekme savurduğunu ve rüyasını fiziksel olarak canlandırdığını anlattı.",
            "Uyandırıldığında konfüzyon yaşamamakta, gördüğü aksiyon ve kavga dolu rüyayı bütün detaylarıyla net olarak hatırlamaktadır.",
            "Polisomnografi kaydında REM uykusu sırasında normalde olması gereken kas felcinin (REM atonisi) tamamen kaybolduğu (RSWA) kanıtlandı.",
            "Ruhsal Durum Muayenesinde: Erken dönem koku alma kaybı eşlik etmekte olup, tablonun Parkinson veya Lewy Cisimcikli Demans riskini taşıdığı belirlendi.",
            "DSM-5'e göre: REM uykusu sırasında kas atonisinin kaybına bağlı olarak motor eylemler sergileme, uyanınca rüyayı tam hatırlama ve polisomnografik REM atonisizliği içeren RBD tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 1, text: "rüyasını fiziksel olarak canlandırdığını", dsmMatch: "DSM-5 Kriter A: REM uykusu sırasında motor rüya eylemleri" },
            { clueIndex: 3, text: "REM atonisi) tamamen kaybolduğu", dsmMatch: "DSM-5 Kriter B: Polisomnografide REM atoni kaybı kanıtı" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Yatak Odası Güvenlik Protokolü & Klonazepam",
            therapyDetails: "Yatak çevresindeki sivri eşyaların kaldırılması, yer minderi ve gece düşük doz Klonazepam/Melatonin.",
            pharmacologyNote: "Klonazepam (0.5 - 2 mg) hastaların %90'ında rüya canlandırmayı durdurur; Melatonin güvenli alternatiftir."
        },
        miniQuiz: {
            question: "REM Uykusu Davranış Bozukluğu (RBD) teşhisi alan ileri yaştaki bir erkekte ilerleyen yıllarda en sık hangi nörodejeneratif hastalığın gelişme riski bulunur?",
            options: [
                "Parkinson Hastalığı veya Lewy Cisimcikli Demans (Alfa-Sinükleinopati)",
                "Şizofreni",
                "Huntington Koresi",
                "Multipl Skleroz (MS)"
            ],
            correctIndex: 0,
            explanation: "RBD hastalarının %70-80'inde 10-15 yıl içinde Parkinson hastalığı veya Lewy cisimcikli demans (alfa-sinükleinopati) tablosu gelişir."
        },
        differentialDiagnosis: "• Uyurgezerlik (Somnambulizm): NREM evresindedir, uyanınca amnezi vardır, rüya hatırlanmaz.\n• Gece Terörü: NREM evresindedir; çığlıkla uyanma ve konfüzyon vardır.\n• Kabus Bozukluğu: REM atonisi korunmuştur; hasta rüyasında hareket edemez, sadece uyanınca korkar.",
        dsmCriteriaSummary: "DSM-5: REM uykusunda motor davranışlar + Uyanınca tam oryantasyon ve rüyayı hatırlama + PSG'de atoni kaybı."
    },

    // 96. İlişki Odaklı OKB (Relationship OCD / ROCD)
    {
        id: "case-096",
        caseNumber: 96,
        difficulty: "Zor",
        course: "ADULT",
        diagnosisId: "rocd",
        therapyId: "erp",
        category: "OCD_RELATED",
        patientSummary: "27 yaşında, kadın, avukat",
        clues: [
            "27 yaşındaki danışan, 3 yıldır birlikte olduğu nişanlısıyla ilgili 'Acaba onu gerçekten seviyor muyum? Ya doğru insan değilse? Ya başkasına aşık olursam?' düşüncelerini gün boyu zihninden atamadığını belirterek başvurdu.",
            "Günde 5-6 saatini internette 'Aşık olduğunuzu nasıl anlarsınız?' testlerini çözerek, arkadaşlarını arayıp 'Sizce biz mutlu muyuz?' diye güvence arayarak tükettiğini söyledi.",
            "Nişanlısının yüzündeki en ufak bir kusura odaklanıp 'Bak bu beni rahatsız etti, demek ki sevmiyorum' şeklinde sürekli içsel duygu kontrolü yapmaktadır.",
            "Tıbbi testleri olağandır; ilişkide aldatma, şiddet veya gerçek bir uyumsuzluk problemi bulunmamaktadır.",
            "Ruhsal Durum Muayenesinde: Belirsizliğe tahammülsüzlük, mükemmel partner mitleri, ilişkiye dair ego-distonik obsesyonlar ve yoğun zihinsel nötralizasyon ritüelleri saptandı.",
            "DSM-5 ve klinik literatüre göre: Partnerine olan sevgisini ve partnerinin uygunluğunu sürekli sorgulayan obsesyonlar ve aşırı güvence arama kompulsiyonlarıyla giden İlişki Odaklı OKB (ROCD) tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "Acaba onu gerçekten seviyor muyum? Ya doğru insan değilse?", dsmMatch: "Klinik Özellik: İlişki odaklı ego-distonik obsesyonel şüpheler" },
            { clueIndex: 1, text: "güvence arayarak", dsmMatch: "Kompulsiyon: Sürekli güvence arama ve ilişki test etme ritüelleri" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Tepki Önleme ile Maruz Bırakma (ERP) & BDT",
            therapyDetails: "'Asla %100 emin olamayabilirsin' belirsizlik maruziyeti, test çözme/güvence isteme kompulsiyonlarını durdurma.",
            pharmacologyNote: "Standart OKB protokolünde yüksek doz SSRI grubu antidepresanlar."
        },
        miniQuiz: {
            question: "İlişki Odaklı OKB'de (ROCD) danışanın sürekli internetten ilişki testleri çözmesi ve arkadaşlarına partnerini sorması hangi mekanizmadır?",
            options: [
                "Kaygıyı geçici olarak dindirmeye çalışan kompulsif güvence arama davranışı",
                "Gerçek bir aldatma belirtisi",
                "Manik hezeyan",
                "Kişilik bölünmesi"
            ],
            correctIndex: 0,
            explanation: "ROCD hastaları zihinlerindeki 'Ya sevmiyorsam?' şüphesinin yarattığı dayanılmaz anksiyeteyi dindirmek için sürekli test çözer ve güvence arar (kompulsiyon)."
        },
        differentialDiagnosis: "• Normal İlişki Kararsızlığı: Gerçek karakter çatışmaları vardır, günde saatlerce süren zihinsel ritüel ve acı veren obsesif döngü yoktur.\n• Yaygın Anksiyete: İlişki dışındaki tüm günlük konulara (sağlık, para, iş) dair genel kaygı hakimdir.",
        dsmCriteriaSummary: "DSM-5: İlişki ve partnere dair günde >1 saat alan ego-distonik obsesyonlar + Güvence arama ve kıyaslama kompulsiyonları."
    },

    // 97. Kaçıngan/Kısıtlı Yiyecek Alımı Bozukluğu (ARFID)
    {
        id: "case-097",
        caseNumber: 97,
        difficulty: "Orta",
        course: "CHILD",
        diagnosisId: "arfid",
        therapyId: "cbt_ar",
        category: "EATING",
        patientSummary: "11 yaşında, erkek çocuğu, ortaokul öğrencisi",
        clues: [
            "11 yaşındaki erkek çocuğu, yalnızca belirli bir marka patates kızartması ve beyaz ekmek dışında hiçbir katı gıdayı ağzına koymaması, sebze/meyve gördüğünde öğürme krizi yaşaması nedeniyle getirildi.",
            "Çocuk tüm ıslak, pütürlü veya kokulu gıdaların dokusundan iğrendiğini, ağzına aldığında boğulacağını hissettiğini anlattı.",
            "Kilosu yaş ve boy persentiline göre 3. persentilin altına düşmüş, okul gezilerine ve arkadaş partilerine yemek korkusu yüzünden katılamaz hale gelmiştir.",
            "Kritik ayırt edici özellik: Çocuğun kilo almaktan korkma, şişman olduğunu düşünme veya beden imgesiyle ilgili KESİNLİKLE hiçbir çarpıtması ya da kusma davranışı yoktur.",
            "Ruhsal Durum Muayenesinde: Duyusal aşırı hassasiyet, gıdanın dokusal özelliklerine bağlı yoğun kaçınma ve beslenme yetersizliği tespit edildi.",
            "DSM-5'e göre: Kilo ve beden algısı bozukluğu olmaksızın, yiyeceğin duyusal özelliklerine bağlı olarak gelişen belirgin kilo kaybı ve beslenme yetersizliği (ARFID) tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 1, text: "gıdaların dokusundan iğrendiğini, ağzına aldığında boğulacağını", dsmMatch: "DSM-5 Kriter A: Duyusal özelliklere veya olumsuz sonuçlara bağlı kaçınma" },
            { clueIndex: 3, text: "kilo almaktan korkma ... KESİNLİKLE hiçbir çarpıtması ... yoktur", dsmMatch: "DSM-5 Kriter C: Anoreksiya/Bulimiya beden algısı bozukluğunun bulunmaması" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Kaçıngan Yeme için BDT (CBT-AR) & Duyusal Maruziyet",
            therapyDetails: "Besin hiyerarşisi oluşturma, dokunma/koklama ile başlayan kademeli duyarsızlaştırma ve öğürme refleksini yönetme.",
            pharmacologyNote: "İştah artırıcı olarak düşük doz Siproheptadin veya anksiyete için düşük doz Mirtazapin eklenebilir."
        },
        miniQuiz: {
            question: "Kaçıngan/Kısıtlı Yiyecek Alımı Bozukluğu (ARFID) ile Anoreksiya Nervoza arasındaki en temel tanısal ayrım kriteri nedir?",
            options: [
                "ARFID'de şişmanlama korkusu ve beden algısı bozukluğu kesinlikle yoktur; Anoreksiyada ise kilo alma dehşeti esastır.",
                "ARFID sadece yetişkinlerde görülür.",
                "Anoreksiyada hasta her türlü yemeği çok sever.",
                "ARFID hastaları sürekli kusarlar."
            ],
            correctIndex: 0,
            explanation: "Anoreksiya hastaları kilo almaktan korktukları için yemezler; ARFID hastaları ise yiyeceğin duyusal yapısından (dokusu/kokusu) veya boğulma korkusundan dolayı yemezler (beden algıları normaldir)."
        },
        differentialDiagnosis: "• Anoreksiya Nervoza: Kilo alma korkusu ve kendini şişman görme düşüncesi vardır.\n• Obsesif-Kompulsif Bozukluk (OKB): Yiyecek zehirlidir veya mikropludur korkusuyla yenmez.\n• Normal Seçici Yeme: Gelişme geriliği, kilo kaybı ve sosyal yıkım yaratmaz.",
        dsmCriteriaSummary: "DSM-5: Yiyeceklerin duyusal yapısından kaçınma + Kilo kaybı/beslenme yetersizliği + Beden imgesi bozukluğunun olmaması."
    },

    // 98. Frontotemporal Demans (Pick Hastalığı - Davranışsal Varyant)
    {
        id: "case-098",
        caseNumber: 98,
        difficulty: "Zor",
        course: "NEURO_SOMATIC",
        diagnosisId: "major_neurocognitive_frontotemporal",
        therapyId: "caregiver_behavioral",
        category: "NEUROCOGNITIVE",
        patientSummary: "56 yaşında, erkek, eski banka müfettişi (Genç Başlangıçlı Demans)",
        clues: [
            "56 yaşındaki saygın bankacı, son 1.5 yılda aniden değişmiş; cenazelerde kahkahalar atmaya, sokakta yabancı kadınlara uygunsuz cinsel tekliflerde bulunmaya ve marketten para ödemeden çikolata alıp yemeye başlamıştır.",
            "Eskiden son derece nazik ve disiplinli bir insanken, ailesinin acılarına karşı tamamen duygusuzlaştığı (empati ve sempati kaybı), sürekli tatlı tükettiği bildirildi.",
            "Kritik ayırt edici özellik: Alzheimer hastalarının aksine dünkü olayları ve evinin yolunu çok iyi hatırlamakta, ancak ahlaki ve sosyal yargılama yetisi tamamen çökmüştür.",
            "Beyin MR incelemesinde bilateral frontal ve anterior temporal loblarda belirgin asimetrik atrofi saptandı; hipokampus hacmi korunmuştur.",
            "Ruhsal Durum Muayenesinde: Sosyal disinhibisyon, apati, stereotipik alkışlama hareketleri ve içgörü yokluğu gözlendi.",
            "DSM-5'e göre: Sinsi başlangıçlı erken dönem davranışsal disinhibisyon, empati kaybı, hiperoralite ve frontal/temporal atrofi ile seyreden Davranışsal Varyant Frontotemporal Nörobilişsel Bozukluk tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "cenazelerde kahkahalar atmaya ... uygunsuz cinsel tekliflerde bulunmaya", dsmMatch: "DSM-5 Kriter A1: Erken davranışsal disinhibisyon (fren kaybı)" },
            { clueIndex: 1, text: "empati ve sempati kaybı", dsmMatch: "DSM-5 Kriter A2: Erken apati ve empati kaybı" },
            { clueIndex: 3, text: "frontal ve anterior temporal loblarda belirgin asimetrik atrofi", dsmMatch: "Nöropatoloji: Frontotemporal lob seçici atrofisi (Pick Hastalığı)" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Davranışsal Çevre Yönetimi & Bakıcı Desteği",
            therapyDetails: "Finansal erişimi kısıtlama, mutfak kilitleri ile hiperoraliteyi engelleme ve bakıcı psiko-eğitimi.",
            pharmacologyNote: "SSRI'lar (kompulsiyon ve agresyon için); Asetilkolinesteraz inhibitörleri FTD'de etkisizdir hatta ajitasyonu artırabilir."
        },
        miniQuiz: {
            question: "Davranışsal Varyant Frontotemporal Demansı (bvFTD), Alzheimer Tipi Demanstan erken evrede ayıran en temel klinik profil nedir?",
            options: [
                "FTD'de bellek korunmuşken kişilik/ahlak ve sosyal fren mekanizması çöker; Alzheimer'da ise ilk olarak yakın bellek çöker.",
                "FTD sadece 80 yaş üzerinde görülür.",
                "Alzheimer hastaları cenazede güler.",
                "FTD hastaları hiç konuşamaz."
            ],
            correctIndex: 0,
            explanation: "Alzheimer hipokampustan başlar (unutkanlık); Frontotemporal demans ise frontal lobdan başlar (kişilik bozulması, sosyal disinhibisyon, empati kaybı, tatlı takıntısı), bellek uzun süre sağlam kalır."
        },
        differentialDiagnosis: "• Alzheimer Hastalığı: Erken dönemde epizodik bellek kaybı ve apraksi hakimdir, sosyal nezaket uzun süre korunur.\n• Bipolar Manik Epizod: Epizodiktir ve basınçlı konuşma vardır; FTD ise sinsi ve ilerleyici nörodejenerasyondur.",
        dsmCriteriaSummary: "DSM-5: Erken davranışsal disinhibisyon + Empati kaybı + Hiperoralite/diyet değişimi + Frontal/temporal lob atrofisi."
    },

    // 99. Normal Basınçlı Hidrosefali (Hakim-Adams Sendromu)
    {
        id: "case-099",
        caseNumber: 99,
        difficulty: "Zor",
        course: "NEURO_SOMATIC",
        diagnosisId: "major_neurocognitive_nph",
        therapyId: "surgical_shunt",
        category: "NEUROCOGNITIVE",
        patientSummary: "71 yaşında, erkek, emekli memur (Geri Dönüşümlü Demans Tablosu)",
        clues: [
            "71 yaşındaki danışan, son 8 ayda başlayan 'ayakları sanki yere mıknatısla yapışmış gibi' küçük adımlarla yürüme (manyetik yürüyüş), unutkanlık ve idrar kaçırma şikayetleriyle getirildi.",
            "Eşi, hastanın tuvalete yetişemeyip altına kaçırdığını ve düşüncelerinin çok yavaşladığını belirtti.",
            "Kranial MR görüntülemesinde BOS basıncı normal sınırlarda olmasına rağmen ventriküllerde ileri derecede genişleme (ventrikülomegali) saptandı.",
            "Yapılan tanısal lomber ponksiyon ile 40 ml BOS boşaltıldıktan 1 saat sonra hastanın yürümesinin ve dikkat süresinin dramatik olarak düzeldiği objektif olarak test edildi.",
            "Ruhsal Durum Muayenesinde: Klasik subkortikal bilişsel yavaşlama, apati ve yürütücü işlev gerilemesi gözlendi.",
            "Klinik nöropsikiyatriye göre: Yürüme apraksisi, üriner inkontinans ve demans klasik triadını (Hakim-Adams Triadı) eksiksiz karşılayan, cerrahi şantla tedavi edilebilir Normal Basınçlı Hidrosefali (NPH) tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "manyetik yürüyüş", dsmMatch: "Klasik Triad 1: Yürüme apraksisi (manyetik adımlama)" },
            { clueIndex: 1, text: "tuvalete yetişemeyip altına kaçırdığını", dsmMatch: "Klasik Triad 2: Üriner inkontinans (idrar kaçırma)" },
            { clueIndex: 3, text: "BOS boşaltıldıktan 1 saat sonra hastanın yürümesinin ... dramatik olarak düzeldiği", dsmMatch: "Tanı Testi: Pozitif LP Tap Testi (Geri dönüşümlü demans kanıtı)" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Ventriküloperitoneal Şant Cerrahisi & Nörorehabilitasyon",
            therapyDetails: "Beyin cerrahisi tarafından takılan VP Şant ile ventriküllerdeki aşırı BOS karın boşluğuna drene edilerek belirtiler geri döndürülür.",
            pharmacologyNote: "Medikal tedavisi yoktur; şant cerrahisi tek kalıcı tedavidir."
        },
        miniQuiz: {
            question: "Normal Basınçlı Hidrosefali (NPH) tablosunu özetleyen klasik 'Hakim-Adams Triadı' hangi 3 semptomdan oluşur?",
            options: [
                "Yürüme Bozukluğu (Manyetik Adım) + İdrar Kaçırma (İnkontinans) + Demans (Bilişsel Yavaşlama)",
                "Ateş + Baş Ağrısı + Ense Sertliği",
                "Tremor + Rijidite + Halüsinasyon",
                "Körlük + Sağırlık + Felç"
            ],
            correctIndex: 0,
            explanation: "Hakim-Adams Triadı: 1. Yürüme apraksisi (ayakların yere yapışması), 2. İdrar kaçırma, 3. Subkortikal demans şeklindedir."
        },
        differentialDiagnosis: "• Alzheimer Hastalığı: İdrar kaçırma ve yürüme kaybı çok geç evrede gelir; LP tap testine yanıt vermez.\n• Parkinson Hastalığı: Dinlenme tremoru ve asimetrik rijidite vardır; NPH'de ise geniş tabanlı manyetik yürüyüş ön plandadır.",
        dsmCriteriaSummary: "DSM-5: Manyetik yürüme bozukluğu + Üriner inkontinans + Bilişsel yıkım + Ventrikülomegali (Geri dönüşümlü NPH)."
    },

    // 100. Hallusinojen Kalıcı Algı Bozukluğu (HPPD / Visual Snow)
    {
        id: "case-100",
        caseNumber: 100,
        difficulty: "Zor",
        course: "SUBSTANCE",
        diagnosisId: "hallucinogen_persisting_perception",
        therapyId: "cbt_general",
        category: "SUBSTANCE",
        patientSummary: "21 yaşında, erkek, grafik öğrencisi",
        clues: [
            "21 yaşındaki genç, 6 ay önce festivalde bir kez LSD kullandıktan aylar geçmesine rağmen görüş alanında sürekli televizyon karlanması (visual snow) ve hareket izleri (trailing) gördüğünü belirterek başvurdu.",
            "Göz doktorlarına ve nörologlara defalarca gittiğini, göz ve optik sinir muayenelerinin tamamen kusursuz çıktığını ancak görsel bozulmaların durmadığını söyledi.",
            "Özellikle karanlık ortamlarda ve yorgun olduğunda havadaki molekülleri saydam noktacıklar gibi gördüğünü, bunun panik yarattığını anlattı.",
            "Son 6 aydır kesinlikle hiçbir madde veya alkol kullanmamıştır; toksikoloji negatiftir.",
            "Ruhsal Durum Muayenesinde: Gördüğü şeylerin gerçek bir nesne olmadığını, görsel bir algı yanılsaması olduğunu tamamen bilen (içgörüsü tam) bir profil saptandı.",
            "DSM-5'e göre: Hallusinojen kullanımının sonlanmasından sonra maddenin yarattığı geometrik halüsinasyonlar, renk parlamaları ve görsel izler gibi algısal semptomların yeniden yaşanması (HPPD) tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "televizyon karlanması (visual snow) ve hareket izleri (trailing)", dsmMatch: "DSM-5 Kriter A: Hallusinojen kullanım sonrası algısal bozulmalar (HPPD)" },
            { clueIndex: 4, text: "algı yanılsaması olduğunu tamamen bilen (içgörüsü tam)", dsmMatch: "DSM-5: Psikotik olmayan, içgörünün korunduğu algı bozukluğu" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Bilişsel Davranışçı Terapi & Görsel Uyaran Duyarsızlaştırması",
            therapyDetails: "Görsel karlanmaya odaklanmayı kesme, felaketleştirici delirme inançlarıyla çalışma ve anksiyete yönetimi.",
            pharmacologyNote: "Lamotrijin (GABAerjik kortikal stabilizasyon) ve Klonazepam semptom şiddetini azaltmada etkilidir; antipsikotikler semptomları kötüleştirebilir."
        },
        miniQuiz: {
            question: "HPPD (Hallusinojen Kalıcı Algı Bozukluğu) tablosunda hastanın gördüğü 'görsel kar ve ışık izleri' ile Şizofrenideki halüsinasyonlar arasındaki en temel fark nedir?",
            options: [
                "HPPD'de hasta gördüklerinin beynin yarattığı bir algı yanılgısı olduğunu bilir (içgörüsü tamdır); Şizofrenide ise hezeyani gerçeklik sanılır.",
                "HPPD sadece gece uyurken görülür.",
                "Şizofrenide göz testleri bozuk çıkar.",
                "İkisi tamamen aynı tablodur."
            ],
            correctIndex: 0,
            explanation: "HPPD hastalarının gerçeklik değerlendirmesi ve içgörüsü tamdır; gördükleri görsel bozulmalardan korkarlar ama bunların gerçek nesneler olmadığını bilirler."
        },
        differentialDiagnosis: "• Psikotik Bozukluk: İçgörü yoktur, sesler ve bizar hezeyanlar eşlik eder.\n• Göz Hastalıkları (Retina Yırtığı): Oftalmolojik muayenede organik patoloji görülür.",
        dsmCriteriaSummary: "DSM-5: Hallusinojen kesildikten sonra geometrik şekiller, renk parlamaları, görsel kar veya izlerin sürmesi."
    },

    // 101. Çocuklukta Başlayan Akıcılık Bozukluğu (Kekemelik)
    {
        id: "case-101",
        caseNumber: 101,
        difficulty: "Kolay",
        course: "CHILD",
        diagnosisId: "childhood_fluency_disorder",
        therapyId: "speech_therapy",
        category: "NEURODEV",
        patientSummary: "7 yaşında, erkek çocuğu, ilkokul 1. sınıf öğrencisi",
        clues: [
            "7 yaşındaki ilkokul öğrencisi, konuşurken bazı heceleri 'a-a-a-araba' şeklinde defalarca tekrar etmesi, sesleri 'ssss-su' şeklinde uzatması ve kelimelerin başında takılıp kalması (bloklar) nedeniyle getirildi.",
            "Konuşmakta zorlandığı anlarda yüzünü buruşturduğu, gözlerini sıkıca kırpıştırdığı ve ayağını yere vurduğu (mücadele davranışları) gözlendi.",
            "Bu konuşma güçlüğünün 4 yaşında başladığı, okulda sesli okuma yapması gerektiğinde kaygısının ve kekelemesinin tavan yaptığı bildirildi.",
            "Odyolojik ve KBB incelemeleri normaldir; işitme kaybı veya ses tellerinde organik bir defisit yoktur.",
            "Ruhsal Durum Muayenesinde: Çocuğun şarkı söylerken veya yalnız başına konuşurken HİÇ KEKEMEDİĞİ, akıcılık bozukluğunun sosyal konuşmada ortaya çıktığı tespit edildi.",
            "DSM-5'e göre: Yaşına uygun olmayan ses/hece yinelemeleri, uzatmalar, kırık sözcükler ve işitilebilir bloklarla seyreden Çocuklukta Başlayan Akıcılık Bozukluğu (Kekemelik) tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "heceleri 'a-a-a-araba' şeklinde defalarca tekrar etmesi, sesleri 'ssss-su' şeklinde uzatması", dsmMatch: "DSM-5 Kriter A: Ses/hece yinelemeleri ve ses uzatmaları" },
            { clueIndex: 4, text: "şarkı söylerken veya yalnız başına konuşurken HİÇ KEKEMEDİĞİ", dsmMatch: "Klinik Özellik: Otomatik konuşma ve şarkıda akıcılığın korunması" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Dil ve Konuşma Terapisi (Lidcombe Programı & Akıcılık Şekillendirme)",
            therapyDetails: "Ebeveyn destekli akıcı konuşmaları pekiştirme, yumuşak ses başlangıçları (soft contacts) ve nefes senkronizasyonu.",
            pharmacologyNote: "Primer farmakoterapisi yoktur; aşırı sosyal anksiyete eşlik ediyorsa destekleyici yaklaşım uygulanır."
        },
        miniQuiz: {
            question: "Gelişimsel Kekemelik (Akıcılık Bozukluğu) olan bir çocukta aşağıdaki durumlardan hangisinde kekemelik tipik olarak tamamen kaybolur veya belirgin şekilde azalır?",
            options: [
                "Şarkı söylerken, koro halinde okurken veya fısıltıyla konuşurken",
                "Sınıfta tahtaya kalkıp öğretmenine konuşurken",
                "Telefonda tanımadığı birine adres tarif ederken",
                "Öfkelenip tartışırken"
            ],
            correctIndex: 0,
            explanation: "Şarkı söylerken ve koro halinde okurken sağ hemisfer ve işitsel geri bildirim devreye girdiğinden kekemelik geçici olarak tamamen kaybolur."
        },
        differentialDiagnosis: "• Sosyal Anksiyete: Çocuk kekelemez, genel sosyal ortamlarda konuşmaktan utanır.\n• Tourette Sendromu: İstemsiz motor ve vokal tikler (küfür/homurtu) vardır; konuşma akıcılığı bozukluğu primer değildir.",
        dsmCriteriaSummary: "DSM-5: Ses ve hece yinelemeleri + Ses uzatmaları + Kırık sözcükler ve bloklar + İletişim yetisini kısıtlama."
    },

    // 102. Özgül Öğrenme Bozukluğu (Okuma Güçlüğü / Disleksi)
    {
        id: "case-102",
        caseNumber: 102,
        difficulty: "Kolay",
        course: "CHILD",
        diagnosisId: "specific_learning_dyslexia",
        therapyId: "special_education",
        category: "NEURODEV",
        patientSummary: "9 yaşında, kız çocuğu, 3. sınıf öğrencisi",
        clues: [
            "9 yaşındaki kız çocuğu, normalin üzerinde zekaya (WISC-IV IQ: 118) sahip olmasına rağmen 3. sınıfta yaşıtları gibi akıcı okuyamadığı ve harfleri karıştırdığı için getirildi.",
            "Okuma yaparken 'b' ile 'd', 'p' ile 'q', '6' ile '9' harf ve rakamlarını ters algıladığını, hecelerken satır atladığını veya harf ekleyip çıkardığını anlattı.",
            "Öğretmeninin sözlü sorduğu tüm sorulara harika yanıtlar verirken, yazılı testlerde okuma yavaşlığı nedeniyle süre yetiremediği öğrenildi.",
            "Görme muayenesi ve nörolojik değerlendirme tamamen normaldir; duyusal görme kusuru dışlanmıştır.",
            "Ruhsal Durum Muayenesinde: Fonolojik farkındalık defisiti, okuma kaygısı ve 'ben aptal mıyım?' şeklinde gelişen ikincil özgüven eksikliği gözlendi.",
            "DSM-5'e göre: Normal zeka ve eğitime karşın sözcük okuma doğruluğu, okuma hızı ve akıcılığında en az 6 aydır süren belirgin kronik güçlükle seyreden Özgül Öğrenme Bozukluğu (Disleksi) tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 1, text: "'b' ile 'd', 'p' ile 'q', '6' ile '9' harf ve rakamlarını ters algıladığını", dsmMatch: "DSM-5 Kriter A1: Yanlış, yavaş ve zahmetli sözcük okuma (Ayna harf algısı)" },
            { clueIndex: 0, text: "normalin üzerinde zekaya (WISC-IV IQ: 118) sahip olmasına rağmen", dsmMatch: "DSM-5 Kriter B: Zihinsel yetiyitimi olmaksızın akademik güçlük" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Çok Duyulu Yapılandırılmış Özel Eğitim (Orton-Gillingham)",
            therapyDetails: "Görsel, işitsel ve kinestetik kanalları eşzamanlı kullanan fonolojik farkındalık eğitimi ve bireyselleştirilmiş okuma programı.",
            pharmacologyNote: "İlaç tedavisi yoktur; eşlik eden DEHB varsa metilfenidat dikkat süresini toparlamada kullanılır."
        },
        miniQuiz: {
            question: "Disleksi (Özgül Öğrenme Bozukluğu) tanısı konulan bir çocuk hakkında aşağıdaki ifadelerden hangisi bilimsel olarak DOĞRUDUR?",
            options: [
                "Disleksili bireyler normal veya üstün zekaya sahiptir; sorun zekada değil beynin fonolojik (ses-harf) işleme merkezlerindedir.",
                "Disleksi bir zeka geriliğidir.",
                "Disleksi gözlük takılarak tamamen tedavi edilir.",
                "Disleksili çocuklar hiçbir zaman üniversite okuyamaz."
            ],
            correctIndex: 0,
            explanation: "Disleksi zeka geriliği değildir; zekası normal/üstün olan çocukların dili ve harf seslerini kodlama biçimindeki nörogelişimsel bir farklılıktır."
        },
        differentialDiagnosis: "• Zihinsel Yetiyitimi: Tüm bilişsel alanlarda (sözlü, pratik, mantık) genel gerilik vardır.\n• Görme Kusurları: Gözlükle düzeltilen refraksiyon kusurlarıdır.",
        dsmCriteriaSummary: "DSM-5: En az 6 aydır süren hatalı/yavaş sözcük okuma + Normal zekaya rağmen akademik başarının geride kalması."
    },

    // 103. Gelişimsel Eşgüdüm (Koordinasyon) Bozukluğu (Dispraksi)
    {
        id: "case-103",
        caseNumber: 103,
        difficulty: "Orta",
        course: "CHILD",
        diagnosisId: "developmental_coordination_disorder",
        therapyId: "occupational_coop",
        category: "NEURODEV",
        patientSummary: "8 yaşında, erkek çocuğu (Sakar / Beceriksiz Çocuk Sendromu)",
        clues: [
            "8 yaşındaki çocuk, ayakkabı bağcıklarını asla bağlayamaması, düğmelerini ilikleyememesi, makas kullanamaması ve düz yolda yürürken bile sürekli düşüp bir yerlerini morartması nedeniyle getirildi.",
            "Beden eğitimi derslerinde topu tutamadığı, bisiklete binmeyi öğrenemediği ve arkadaşları tarafından sakarlığı yüzünden oyunlara alınmadığı anlatıldı.",
            "Zeka düzeyi tamamen normaldir (IQ: 105); sözlü iletişimi ve hafızası çok kuvvetlidir.",
            "Pediatrik nörolojik muayenede serebral palsi veya müsküler distrofi gibi hiçbir organik kas/sinir hastalığı saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Motor planlama (praksis) yetersizliği, motor becerilerde kronik sakarlık ve ikincil özgüven eksikliği belirlendi.",
            "DSM-5'e göre: Motor becerilerin edinilmesi ve icrasının kronolojik yaşın belirgin biçimde gerisinde olması (sakarlık, yavaşlık, beceriksizlik) ve kas hastalığına bağlı olmaması ile giden Gelişimsel Koordinasyon Bozukluğu tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "ayakkabı bağcıklarını asla bağlayamaması, düğmelerini ilikleyememesi, makas kullanamaması", dsmMatch: "DSM-5 Kriter A: Motor becerilerin koordinasyonunda belirgin gerilik" },
            { clueIndex: 3, text: "serebral palsi veya müsküler distrofi gibi hiçbir organik ... saptanmamıştır", dsmMatch: "DSM-5 Kriter D: Nörolojik motor hastalıkların dışlanması" }
        ],
        treatmentModality: {
            goldStandardTherapy: "CO-OP / Bilişsel Yönelimli Mesleki Terapi (Ergoterapi)",
            therapyDetails: "'Hedef-Plan-Yap-Kontrol Et' metoduyla günlük motor görevleri aşamalandırarak öğretme ve duyu bütünleme terapisi.",
            pharmacologyNote: "Spesifik ilaç tedavisi yoktur; ergoterapi ve motor fizyoterapi esastır."
        },
        miniQuiz: {
            question: "Gelişimsel Koordinasyon Bozukluğu (Dispraksi) olan bir çocuğun temel klinik problemi aşağıdakilerden hangisidir?",
            options: [
                "Beynin karmaşık motor hareketleri planlama ve koordine etme (praksis) yetersizliği",
                "Kaslarının tamamen felç olması",
                "Gözlerinin hiç görmemesi",
                "Kasıtlı olarak eşyaları kırma arzusu"
            ],
            correctIndex: 0,
            explanation: "Disprakside kas gücü normaldir ancak beyin hareketin basamaklarını planlamakta ve sıraya koymakta (motor praksis) güçlük çeker."
        },
        differentialDiagnosis: "• Serebral Palsi / Distrofi: Organik kas spastisitesi veya kas erimesi mevcuttur.\n• DEHB: Dürtüsellik ve acelecilikten kaynaklı sakarlık vardır; motor planlama testi tek başına normallik gösterebilir.",
        dsmCriteriaSummary: "DSM-5: Motor koordinasyon becerilerinin yaşın belirgin gerisinde olması + Günlük yaşam aktivitelerini bozması."
    },

    // 104. Seksomni (Uykuda Cinsel Davranış / NREM Parasomnisi)
    {
        id: "case-104",
        caseNumber: 104,
        difficulty: "Zor",
        course: "FORENSIC",
        diagnosisId: "sexsomnia",
        therapyId: "sleep_safety_cbt",
        category: "SLEEP",
        patientSummary: "33 yaşında, erkek, evli (Adli Nitelikli NREM Parasomnisi)",
        clues: [
            "33 yaşındaki evli erkek, gece derin uykudayken eşine agresif biçimde cinsel ilişki girişiminde bulunduğu, eşi kendisini ittiğinde dahi mekanik olarak mastürbasyon yapmayı sürdürdüğü ve sabah uyandığında hiçbir şey hatırlamadığı için başvurdu.",
            "Bu durumun son 1 yıldır ayda 2-3 kez uykunun ilk 3 saati içinde (derin NREM yavaş dalga uykusunda) tekrarlandığı ve evliliklerinde ağır bir güven krizine yol açtığı öğrenildi.",
            "Uyanıkken eşine karşı son derece nazik, saygılı ve cinsel taciz eğilimi olmayan biridir; eylemler uyanıkken asla tekrarlanmamaktadır.",
            "Video-Polisomnografi incelemesinde derin N3 NREM evresinden ani konfüzyonel uyanma ve bu sırada otomatik pelvik/mastürbatuar motor davranışlar EEG ile kaydedildi.",
            "Ruhsal Durum Muayenesinde: Sabah tam amnezi, yoğun adli suçluluk/korku ve parasomnik disinhibisyon tablosu tespit edildi.",
            "DSM-5 ve uyku tıbbı kriterlerine göre: NREM uykusundan uyanma bozukluklarının bir varyantı olan, tam bilinç dışı otomatik cinsel davranışlar sergileme ve amnezi ile seyreden Seksomni (Sleep Sex) tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "derin uykudayken eşine agresif biçimde cinsel ilişki girişiminde bulunduğu ... sabah uyandığında hiçbir şey hatırlamadığı", dsmMatch: "DSM-5 / Uyku Tıbbı: NREM parasomnisi sırasında otomatik cinsel eylemler ve tam amnezi" },
            { clueIndex: 3, text: "derin N3 NREM evresinden ani konfüzyonel uyanma", dsmMatch: "Polisomnografi: N3 yavaş dalga uykusunda parsiyel uyanma kanıtı" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Uyku Güvenliği, Klonazepam & Stres Azaltma Protokolü",
            therapyDetails: "Yatak odası kapısına alarm takılması, eşin ayrı uyuması, uyku yoksunluğu ve alkolün sıfırlanması, Klonazepam tedavisi.",
            pharmacologyNote: "Düşük doz Klonazepam (0.5 - 2 mg) NREM uyanma ataklarını baskılamada en etkili farmakoterapidir."
        },
        miniQuiz: {
            question: "Seksomni (Uykuda Cinsel Davranış) vakalarında eylemler uykunun hangi evresinde gerçekleşir ve sabah hatırlanır mı?",
            options: [
                "Derin NREM (N3 / Yavaş Dalga) evresinde gerçekleşir ve sabah tam amnezi (hatırlamama) vardır.",
                "REM uykusunda gerçekleşir ve rüya çok net hatırlanır.",
                "Sadece uyanıkken gündüzleri olur.",
                "Her zaman uyanınca tam olarak hatırlanır."
            ],
            correctIndex: 0,
            explanation: "Seksomni bir NREM parasomnisidir; beynin korteksi uykudayken motor cinsel merkezler otomatik uyanır ve sabah tam amnezi görülür."
        },
        differentialDiagnosis: "• Bilinçli Cinsel Saldırı (Adli Suç): Fail uyanıktır, eylemi planlar ve amnezi rolü yapar; PSG incelemesinde NREM disosiasyonu saptanmaz.\n• REM Uykusu Davranış Bozukluğu (RBD): REM evresindedir ve rüya net hatırlanır.",
        dsmCriteriaSummary: "DSM-5: NREM yavaş dalga uykusunda otomatik cinsel davranışlar + Sabah tam bellek kaybı (Amnezi)."
    },

    // 105. Cinsel Mazoşizm Bozukluğu (Otoerotik Asfiksi Tipi)
    {
        id: "case-105",
        caseNumber: 105,
        difficulty: "Zor",
        course: "FORENSIC",
        diagnosisId: "sexual_masochism",
        therapyId: "cbt_general",
        category: "PARAPHILIC",
        patientSummary: "26 yaşında, erkek, üniversite mezunu (Ölümcül Risk Taşıyan Parafili)",
        clues: [
            "26 yaşındaki genç, odasında tavana asılı bir kemerle boynunu sıkarak oksijensiz kaldığı ve mastürbasyon yaptığı sırada bayılması üzerine ailesi tarafından son anda kurtarılarak getirildi.",
            "Son 3 yıldır mastürbasyon yaparken boynunu iple sıkıp beynine giden oksijeni kısıtlamadan (hipoksi) ve boğulma tehlikesi hissetmeden orgazm olamadığını itiraf etti.",
            "Bu tehlikeli yöntemi son 1 yıldır haftada 2 kez denediğini, defalarca ölümden döndüğünü ve kendini durduramadığını anlattı.",
            "Toksikoloji taraması negatiftir; intihar etme arzusu KESİNLİKLE yoktur; amaç ölmek değil boğulma anındaki hipoksik cinsel hazdır.",
            "Ruhsal Durum Muayenesinde: İntihar depresyonu olmaksızın, cinsel uyarılmanın tamamen fiziksel acı çekme ve hipoksiye koşullandığı ölümcül bir parafili tablosu gözlendi.",
            "DSM-5'e göre: En az 6 ay süreyle bağlanma veya acı çekmeyle (özellikle asfiksiyofili kısıtlamasıyla) ilgili yineleyen cinsel uyarılma dürtüleri ve bunu eyleme dökme ile seyreden Cinsel Mazoşizm Bozukluğu tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 1, text: "boynunu iple sıkıp beynine giden oksijeni kısıtlamadan (hipoksi) ... orgazm olamadığını", dsmMatch: "DSM-5 Belirteç: Asfiksiyofili (Otoerotik asfiksi) ile giden cinsel mazoşizm" },
            { clueIndex: 3, text: "intihar etme arzusu KESİNLİKLE yoktur", dsmMatch: "Ayırıcı Tanı: İntihar girişiminden ayrım kriteri" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Bilişsel Davranışçı Terapi & Gizli Şartlandırma",
            therapyDetails: "Ölümcül asfiksi riskine karşı acil güvenlik planı, gizli duyarsızlaştırma ve cinsel fantezileri yeniden koşullandırma.",
            pharmacologyNote: "Dürtü yoğunluğunu ve takıntılı kompulsif cinsel eylemleri baskılamak için yüksek doz SSRI veya antiandrojenler."
        },
        miniQuiz: {
            question: "Otoerotik Asfiksi (Boğularak cinsel haz alma) uygulayan bir bireyin kazara ölümünü intihardan ayıran en temel adli psikiyatrik kanıt nedir?",
            options: [
                "Kişinin intihar notu bırakmaması, cinsel uyarılma materyalleri/pornografi varlığı ve kendini kurtarma mekanizması kurmuş olması",
                "Kişinin çok yaşlı olması",
                "Olayın gündüz olması",
                "Hastanın hiç okula gitmemiş olması"
            ],
            correctIndex: 0,
            explanation: "Otoerotik asfiksilerde intihar amacı yoktur; kişi cinsel doyum için hipoksi uygular, bir kurtarma düzeneği kurar ancak bayılınca mekanizma kilitlenip kazaen ölür."
        },
        differentialDiagnosis: "• İntihar Girişimi: Kişi ölmek ister; cinsel uyarılma veya mastürbasyon amacı yoktur.\n• Cinsel Sadizm: Acıyı başkasına çektirir; mazoşizmde ise acıyı ve oksijensizliği bizzat kendisi çeker.",
        dsmCriteriaSummary: "DSM-5: En az 6 ay bağlanma, dövülme veya oksijensiz bırakılma dürtüleri + Eyleme dökme (Asfiksiyofili)."
    },

    // 106. Cinsel Sadizm Bozukluğu
    {
        id: "case-106",
        caseNumber: 106,
        difficulty: "Zor",
        course: "FORENSIC",
        diagnosisId: "sexual_sadism",
        therapyId: "cbt_general",
        category: "PARAPHILIC",
        patientSummary: "32 yaşında, erkek, güvenlik görevlisi (Adli Vaka)",
        clues: [
            "32 yaşındaki danışan, partnerlerini yatağa bağlayıp rızaları olmaksızın derilerini sigarayla yakarak, kemerle döverek ve acı içinde yalvarmalarını izleyerek cinsel doyum sağladığı için polise şikayet sonrası sevk edildi.",
            "Partnerlerinin fiziksel ve psikolojik acı çekmesini, korku dolu çığlıklarını görmeden hiçbir şekilde cinsel uyarılma ve ereksiyon yaşayamadığını açıkça ifade etti.",
            "Son 2 yıldır tüm cinsel ilişkilerinde bu şiddet eylemlerini giderek artan dozda uyguladığı ve partnerlerinde ciddi doku yaralanmalarına yol açtığı belirlendi.",
            "Madde intoksikasyonu veya organik nörolojik lezyon saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Mağdurun acı çekmesinden doğrudan erotik haz alma, sıfır empati ve dürtüsel sadistik fantezilerin eyleme dökülmesi gözlendi.",
            "DSM-5'e göre: En az 6 aylık süre boyunca başka bir kişinin fiziksel ya da ruhsal acı çekmesinden yineleyen yoğun cinsel uyarılma duyma ve bu dürtüleri onay vermeyen bir kişi üzerinde eyleme dökmüş olma (Cinsel Sadizm Bozukluğu) tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "rızaları olmaksızın derilerini sigarayla yakarak, kemerle döverek ve acı içinde yalvarmalarını izleyerek", dsmMatch: "DSM-5 Kriter A & B: Başkasına acı çektirmekten cinsel haz alma ve rızasız eyleme dökme" },
            { clueIndex: 2, text: "Son 2 yıldır", dsmMatch: "DSM-5 Süre Eşiği: En az 6 aylık süre kriteri" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Bilişsel Davranışçı Adli Terapi & Nüks Önleme",
            therapyDetails: "Mağdur odaklı empati eğitimi, suç döngüsünü kırma, gizli şartlandırma ve adli denetim takibi.",
            pharmacologyNote: "Ağır ve kontrolsüz şiddet riski taşıyan vakalarda antiandrojen hormon tedavisi (GnRH agonistleri) ve SSRI."
        },
        miniQuiz: {
            question: "DSM-5'e göre rızaya dayalı BDSM pratikleri ile 'Cinsel Sadizm Bozukluğu' arasındaki en kritik adli ve tanısal ayrım nedir?",
            options: [
                "Cinsel Sadizm Bozukluğunda eylemlerin onay vermeyen (rızasız) kişilere karşı uygulanması veya kişide kontrolsüz klinik/adli zarar yaratması",
                "Cinsel sadizmin sadece kadınlarda görülmesi",
                "BDSM yapanların hiç evlenmemesi",
                "İki kavramın birebir aynı olması"
            ],
            correctIndex: 0,
            explanation: "Parafili bozukluğu tanısı için eylemlerin onay vermeyen (rızasız) kişilere karşı yapılması veya ağır fiziksel hasar/adli zarar doğurması zorunludur."
        },
        differentialDiagnosis: "• Antisosyal Kişilik Bozukluğu: Şiddet para, intikam veya güç içindir; sadizmde ise temel motivasyon doğrudan cinsel orgazm ve erotik hazdır.\n• Cinsel Mazoşizm: Kişi acıyı başkasına değil kendine çektirir.",
        dsmCriteriaSummary: "DSM-5: En az 6 ay başkasına fiziksel/ruhsal acı çektirmekten cinsel haz alma + Onay vermeyen kişiye eyleme dökme."
    },

    // 107. Ganser Sendromu (Yaklaşık Yanıtlar / Cezaevi Histerisi)
    {
        id: "case-107",
        caseNumber: 107,
        difficulty: "Zor",
        course: "FORENSIC",
        diagnosisId: "ganser_syndrome",
        therapyId: "supportive_psychotherapy",
        category: "DISSOCIATIVE",
        patientSummary: "38 yaşında, erkek, cezaevinde tutuklu (Adli Dissosiyatif Tablo)",
        clues: [
            "Ağırlaştırılmış müebbet hapis istemiyle yargılanan 38 yaşındaki tutuklu, cezaevinde 'Atın kaç ayağı vardır?' sorusuna '3 ayağı vardır', '2 artı 2 kaç eder?' sorusuna '5 eder' şeklinde soruların doğru cevabını tam bilip hemen yanındaki yanlış cevabı (yaklaşık yanıtlar) verdiği için bilirkişiye sevk edildi.",
            "Haftanın hangi günü olduğu sorulduğunda dünün gününü söylemekte, ceketi pantolon gibi bacaklarına giymeye çalışmaktadır.",
            "Nörolojik tarama, EEG ve Beyin MR görüntülemeleri tamamen normal çıkmış; inme veya organik demans dışlanmıştır.",
            "Temarruzdan (malingering) farklı olarak hastada belirgin bir alacakaranlık bilinç durumu, dissosiyatif amnezi ve aşırı stres altında disosiyatif kopma mevcuttur.",
            "Ruhsal Durum Muayenesinde: Ağır hapis stresörüne karşı gelişen disosiyatif mekanizmalar, çocuksu davranışlar ve tipik saçma/yaklaşık yanıtlar (paralogia) tespit edildi.",
            "DSM-5 ve klinik psikiyatriye göre: Aşırı adli stresörler altında ortaya çıkan yaklaşık yanıtlar (vorbeireden), bilinç bulanıklığı ve dissosiyatif semptomlarla seyreden klasik Ganser Sendromu tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "soruların doğru cevabını tam bilip hemen yanındaki yanlış cevabı (yaklaşık yanıtlar)", dsmMatch: "Psikopatoloji: Karakteristik 'Yaklaşık Saçma Yanıtlar' (Vorbeireden / Vorübergehen)" },
            { clueIndex: 3, text: "alacakaranlık bilinç durumu, dissosiyatif amnezi", dsmMatch: "DSM-5: Dissosiyatif alacakaranlık durumu ve histerik kaçış" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Destekleyici Psikoterapi & Güvenli Çevre Yönetimi",
            therapyDetails: "Hastayı yargılamadan dinleme, stresör baskısını hafifletme ve disosiyatif kopmayı güven telkiniyle çözme.",
            pharmacologyNote: "Gerektiğinde eşlik eden yoğun anksiyete ve ajitasyon için kısa süreli düşük doz anksiyolitik veya antipsikotik."
        },
        miniQuiz: {
            question: "Ganser Sendromunda hastanın '2+2=5' veya 'Köpeğin 5 bacağı vardır' gibi basit sorulara verdiği tipik yanıtlara psikiyatride ne ad verilir?",
            options: [
                "Yaklaşık Yanıtlar (Vorbeireden / Paralogia)",
                "Neolojizm (Yeni kelime uydurma)",
                "Ekolali (Yankılama)",
                "Koprolali (Küfür etme)"
            ],
            correctIndex: 0,
            explanation: "Ganser Sendromunun en belirleyici patognomonik belirtisi; hastanın sorulan sorunun mantığını tam anlayıp kasten değil disosiyatif bir savunmayla cevabın hemen yanındaki yanlış cevabı vermesidir (Yaklaşık Yanıtlar)."
        },
        differentialDiagnosis: "• Temarruz (Malingering): Bilinçli ve kasıtlı bir sahtekarlıktır; alacakaranlık bilinç durumu ve gerçek dissosiasyon yoktur.\n• Şizofreni: Hezeyanlar ve formal düşünce dağınıklığı vardır, yaklaşık yanıtlar görülmez.",
        dsmCriteriaSummary: "DSM-5: Ağır stresör zemininde yaklaşık yanıtlar (vorbeireden) + Bilinçte alacakaranlık hali + Dissosiyatif belirtiler."
    },

    // 108. Kompulsif Satın Alma Bozukluğu (Oniomani / Alışveriş Bağımlılığı)
    {
        id: "case-108",
        caseNumber: 108,
        difficulty: "Orta",
        course: "IMPULSE",
        diagnosisId: "compulsive_buying_disorder",
        therapyId: "cbt_general",
        category: "SUBSTANCE",
        patientSummary: "36 yaşında, kadın, şirket yöneticisi",
        clues: [
            "36 yaşındaki danışan, 14 adet kredi kartını tamamen doldurup 800.000 TL borç batağına saplanmasına rağmen her gün internetten ihtiyacı olmayan yüzlerce ayakkabı ve kıyafeti almayı durduramadığını belirterek başvurdu.",
            "Alışveriş yapmadan hemen önce içinde karşı konulamaz bir gerilim hissettiğini; 'Satın Al' butonuna bastığı an derin bir öfori yaşadığını, ancak 10 dakika sonra paketleri açmadan dolaba tıkıp derin bir suçluluk duyduğunu anlattı.",
            "Evinde etiketleri dahi sökülmemiş, kutuları hiç açılmamış 80 çift ayakkabı ve onlarca aynı model ceket bulunduğu görüldü.",
            "Bipolar Bozukluk öyküsü KESİNLİKLE yoktur; hastada uyku azalması, grandiyöz sanrılar veya manik epizod kriterleri bulunmamaktadır.",
            "Ruhsal Durum Muayenesinde: Negatif duygulanımı bastırmak için dopaminerjik satın alma döngüsüne sığınma, tolerans ve kontrol kaybı saptandı.",
            "Klinik psikiyatri ve DSM-5 davranışsal bağımlılık spektrumuna göre: Dayanılmaz satın alma dürtüleri, gereksiz harcamalar, geçici rahatlama ve ardından gelen ağır borçla seyreden Kompulsif Satın Alma Bozukluğu (Oniomani) tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 1, text: "Satın Al' butonuna bastığı an derin bir öfori yaşadığını, ancak 10 dakika sonra paketleri açmadan dolaba tıkıp", dsmMatch: "Klinik Fenomen: Satın alma anında haz/rahatlama ve ardından gelen suçluluk" },
            { clueIndex: 3, text: "Bipolar Bozukluk öyküsü KESİNLİKLE yoktur", dsmMatch: "Ayırıcı Tanı: Manik aşırı harcama periyodunun dışlanması" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Kompulsif Alışveriş için BDT & Mali Uyaran Kontrolü",
            therapyDetails: "Kredi kartlarını iptal etme, 48 saatlik satın almayı erteleme kuralı, tetikleyici e-ticaret uygulamalarını silme ve bütçe yönetimi.",
            pharmacologyNote: "Dürtüsellik ve eşlik eden depresyon/anksiyete için SSRI grubu ilaçlar veya Naltrekson (dürtü blokajı)."
        },
        miniQuiz: {
            question: "Kompulsif Satın Alma Bozukluğunda (Oniomani) kişiyi alışveriş yapmaya iten temel psikolojik pekiştireç nedir?",
            options: [
                "Eşyayı kullanma ihtiyacı değil, satın alma anında yaşanan gerilim azalması ve dopaminerjik haz dalgası",
                "Eşyaları yüksek fiyata satıp zengin olma arzusu",
                "Evini müzeye çevirme planı",
                "Açlıktan ölme korkusu"
            ],
            correctIndex: 0,
            explanation: "Oniomanide eşyanın kendisine ihtiyaç yoktur (kutusu bile açılmaz); temel amaç satın alma eyleminin yarattığı kısa süreli haz ve içsel sıkıntıyı bastırmaktır."
        },
        differentialDiagnosis: "• Bipolar Manik Epizod: Aşırı harcama sadece manik dönemdedir, grandiyöz fikirler ve uyku azalması eşlik eder.\n• İstifçilik (Hoarding): Eşyaları atmakta zorlanırlar ve ev çöp eve döner; oniomanide ise temel sorun satın alma dürtüsüdür.",
        dsmCriteriaSummary: "DSM-5 / ICD-11: Dayanılmaz satın alma dürtüleri + Kontrol kaybı + Ağır finansal zarar + Eşyaları kullanmama."
    },

    // 109. İlacın Yol Açtığı Tardif Diskinezi (Orofasial Diskinezi)
    {
        id: "case-109",
        caseNumber: 109,
        difficulty: "Orta",
        course: "NEURO_SOMATIC",
        diagnosisId: "tardive_dyskinesia",
        therapyId: "vmat2_inhibitor",
        category: "OTHER_CLINICAL",
        patientSummary: "58 yaşında, kadın, 12 yıldır antipsikotik kullanan danışan",
        clues: [
            "58 yaşındaki danışan, son 6 aydır ağzında, dilinde ve dudaklarında kendi kontrolü dışında istemsiz çiğneme, dudak şapırdatma ve dilini sürekli dışarı çıkarma hareketleri başladığı için getirildi.",
            "Hasta bu hareketleri durdurmak istediğinde durduramadığını, dişlerini sürekli sıktığı için protezlerinin kırıldığını ve utancından ağzını eliyle kapatmak zorunda kaldığını söyledi.",
            "Öyküde 12 yıldır kronik olarak Tipik/Birinci Kuşak Antipsikotik (Haloperidol) kullandığı öğrenildi.",
            "Nörolojik muayenede koreoatetoid orofasial istemsiz hareketler objektif olarak görüldü; Parkinson tremorundan farklı olarak hareketler ritmik değil hızlı ve kıvrılma şeklindedir.",
            "Ruhsal Durum Muayenesinde: Yıllarca süren dopamin D2 blokajına bağlı bazal ganglionlarda gelişen postsinaptik dopamin reseptör aşırı duyarlılığı tablosu tespit edildi.",
            "DSM-5'e göre: En az birkaç aydır nöroleptik kullanımı zemininde gelişen, dil, dudak, çene ve ekstremitelerde istemsiz hareketlerle seyreden İlacın Yol Açtığı Tardif Diskinezi tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "istemsiz çiğneme, dudak şapırdatma ve dilini sürekli dışarı çıkarma", dsmMatch: "DSM-5 Kriter A: Orofasial ve lingual istemsiz koreoatetoid hareketler" },
            { clueIndex: 2, text: "12 yıldır kronik olarak Tipik/Birinci Kuşak Antipsikotik (Haloperidol) kullandığı", dsmMatch: "DSM-5 Kriter B: En az birkaç aylık nöroleptik maruziyeti öyküsü" }
        ],
        treatmentModality: {
            goldStandardTherapy: "VMAT2 İnhibitörü Tedavisi & Antipsikotik Optimizasyonu",
            therapyDetails: "Valbenazin veya Dötetrabenazin başlanması, mevcut tipik antipsikotiğin azaltılarak atipik ajana (Klozapin) geçilmesi.",
            pharmacologyNote: "Valbenazin ve Dötetrabenazin FDA onaylı VMAT2 inhibitörleridir; Antikolinerjikler (Biperiden/Akineton) durumu daha da KÖTÜLEŞTİRİR."
        },
        miniQuiz: {
            question: "Tardif Diskinezi tedavisinde aşağıdaki ilaç gruplarından hangisi istemsiz dil-dudak hareketlerini DAHA DA KÖTÜLEŞTİRDİĞİ için kesinlikle KONTRENDİKEDİR?",
            options: [
                "Antikolinerjik İlaçlar (Biperiden / Akineton / Triheksifenidil)",
                "VMAT2 İnhibitörleri (Valbenazin)",
                "Klozapin",
                "Melatonin"
            ],
            correctIndex: 0,
            explanation: "Antikolinerjikler (Akineton) akut distoniyi düzeltir ancak Tardif Diskinezide dopamin aşırı duyarlılığını daha da artırarak istemsiz hareketleri şiddetlendirir!"
        },
        differentialDiagnosis: "• Akut Distoni: İlacın ilk günlerinde başlar ve göz kayması/boyun tutulması yapar; tardif diskinezi ise yıllar sonra gelişir.\n• Parkinsonizm: Hareketlerde yavaşlama (bradikinezi) ve istirahat tremoru vardır; TD'de ise istemsiz kıvrılma hareketleri mevcuttur.",
        dsmCriteriaSummary: "DSM-5: Uzun süreli nöroleptik kullanımı + Yüz, dil, çene veya gövdede istemsiz koreoatetoid hareketler."
    }
];

// Write to vaka_paketi_80.json
fs.writeFileSync(path.join(__dirname, 'vaka_paketi_80.json'), JSON.stringify(newCases90to109, null, 2), 'utf8');
console.log('Successfully written vaka_paketi_80.json with 20 new cases!');

// Now let's assemble all cases into js/cases.js using scratch_assemble_109.js
