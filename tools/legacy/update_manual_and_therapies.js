const fs = require('fs');
const path = require('path');

// 1. UPDATE DSM5_MANUAL
const manualPath = path.join(__dirname, 'js', 'dsm_manual.js');
let manualContent = fs.readFileSync(manualPath, 'utf8');

const newManualEntries = {
    "capgras_syndrome": {
        id: "capgras_syndrome",
        nameTr: "Capgras Sanrısı (Dublör / Değiştirilme Hezeyanı)",
        nameEn: "Capgras Delusion / Misidentification Syndrome",
        clinicalDescription: {
            overview: "Kişinin özellikle eşi, anne-babası veya çocukları gibi yakın birinin fiziksel olarak tıpatıp aynı görünen bir dublör veya sahtekarla değiştirildiğine inandığı nadir bir sanrısal yanlış tanıma sendromudur.",
            epidemiology: "Şizofreni, şizoaffektif bozukluk, ağır psikotik depresyon veya sağ hemisfer parietal/temporal lezyonlarında ortaya çıkabilir.",
            etiology: "Görsel yüz tanıma merkezi (fusiform gyrus) ile duygusal aşinalık üreten limbik sistem arasındaki bağlantının kopması sonucu 'Görüyorum ama aynı duyguyu hissetmiyorum, demek ki sahtesi' çıkarımı yapılır.",
            prognosis: "Altta yatan psikotik tablonun antipsikotik tedavisiyle gerileyebilir; organik lezyonlarda kronikleşebilir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Tanıdık Kişinin Dublör Olduğu İnancı", content: "Kişinin yakın çevresindeki bir veya daha fazla kişinin fiziksel benzerliği kabul edilmekle birlikte sahte bir kopyayla değiştirildiği sanrısı." },
            { code: "Kriter B", title: "Sarsılmazlık ve İkna Edilemezlik", content: "Mantıklı kanıtlar ve kimlik belgelerine rağmen inancın değiştirilememesi." }
        ]
    },
    "cotard_syndrome": {
        id: "cotard_syndrome",
        nameTr: "Cotard Sendromu (Yürüyen Ceset / Nihilistik Sanrı)",
        nameEn: "Cotard's Syndrome (Walking Corpse Delusion)",
        clinicalDescription: {
            overview: "Kişinin öldüğüne, iç organlarının çürüdüğüne, kanının akmadığına veya tüm dünyanın yok olduğuna inandığı aşırı nihilistik bir psikoz tablosudur.",
            epidemiology: "En sık yaşlılıkta görülen ağır psikotik depresyonda, bipolar depresif atakta veya ileri evre ensefalopati/demansta görülür.",
            etiology: "Duygusal tepkisizliğin en uç boyuta ulaşması sonucu kişinin kendi varlığını inkar etmesi (ağır prefrontal ve parietal disfonksiyon).",
            prognosis: "EKT (Elektrokonvülsif Terapi) ve antipsikotik/antidepresan kombinasyonuna yanıtı oldukça yüz güldürücüdür."
        },
        criteriaList: [
            { code: "Kriter A", title: "Nihilistik Sanrılar", content: "Kendi bedeninin, organlarının, ruhunun veya dünyanın var olmadığını/çürüdüğünü iddia etme." },
            { code: "Kriter B", title: "Ölüm ve Çürüme Odaklılık", content: "Ölü olduğu gerekçesiyle yemek yemeyi, bakımı ve hareketi tamamen reddetme." }
        ]
    },
    "neuroleptic_malignant_syndrome": {
        id: "neuroleptic_malignant_syndrome",
        nameTr: "Nöroleptik Malign Sendrom (NMS)",
        nameEn: "Neuroleptic Malignant Syndrome",
        clinicalDescription: {
            overview: "Antipsikotik (nöroleptik) ilaç kullanımına bağlı gelişen, yüksek ateş, kurşun boru rijiditesi ve otonomik instabiliteyle seyreden hayatı tehdit edici bir tıbbi acildir.",
            epidemiology: "Antipsikotik kullanan hastaların %0.02 - %0.04'ünde görülür; erkeklerde ve yüksek potensli tipik antipsikotiklerde daha sıktır.",
            etiology: "Hipotalamus ve bazal ganglionlarda masif dopamin D2 reseptör blokajı.",
            prognosis: "Erken tanı, ilacın derhal kesilmesi, Dantrolen/Bromokriptin ve yoğun bakım desteği ile mortalite %10'un altına iner."
        },
        criteriaList: [
            { code: "Kriter A", title: "Hipertermi ve Rijidite", content: "Nöroleptik kullanımıyla ilişkili olarak şiddetli kas sertliği (kurşun boru) ve yüksek ateş (>38°C)." },
            { code: "Kriter B", title: "Otonomik Bulgular ve CK Yüksekliği", content: "Taşikardi, terleme, tansiyon dalgalanması ve masif Serum Kreatin Kinaz (CK) artışı." }
        ]
    },
    "serotonin_syndrome": {
        id: "serotonin_syndrome",
        nameTr: "Serotonin Sendromu (Toksisitesi)",
        nameEn: "Serotonin Syndrome",
        clinicalDescription: {
            overview: "Serotonerjik ilaçların birlikte kullanımı veya aşırı dozu sonucu gelişen, nöromüsküler uyarılabilirlik (klonus, hiperrefleksi), ajitasyon ve otonomik dengesizlik tablosudur.",
            epidemiology: "SSRI + MAOI, SSRI + Tramadol/Triptan/Sarı Kantaron gibi kombinasyonlarda hızla tetiklenir.",
            etiology: "Santral 5-HT2A ve 5-HT1A reseptörlerinin aşırı stimülasyonu.",
            prognosis: "İlaç kesimi, Siproheptadin (antiserotonerjik) ve destek tedavisi ile vakaların %70'i 24 saat içinde düzelir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Serotonerjik Ajan Kullanımı", content: "Serotonin düzeyini artıran bir veya daha fazla ilacın kullanımı." },
            { code: "Kriter B", title: "Spontan Klonus ve Hiperrefleksi", content: "Ayak bileği klonusu, titreme, hiperrefleksi, terleme ve ajitasyon mevcudiyeti (Hunter Kriterleri)." }
        ]
    },
    "narcolepsy": {
        id: "narcolepsy",
        nameTr: "Narkolepsi (Tip 1 / Katapleksili)",
        nameEn: "Narcolepsy with Cataplexy",
        clinicalDescription: {
            overview: "Gündüz önüne geçilemez ani uyku atakları, gülmeyle tetiklenen ani kas felci (katapleksi), hipnagojik halüsinasyonlar ve uyku felci ile seyreden kronik nörolojik uyku bozukluğudur.",
            epidemiology: "Toplumda 2000 kişide 1 görülür. Başlangıç genellikle ergenlik veya genç erişkinliktedir.",
            etiology: "Hipotalamustaki hipokretin/oreksin üreten nöronların otoimmün yıkımı (HLA-DQB1*06:02 ilişkili).",
            prognosis: "Kroniktir; Modafinil, sodyum oksibat ve davranışsal uyku planlaması ile kontrol altına alınır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Karşı Konulamaz Uyku Atakları", content: "Günün uygunsuz zamanlarında en az 3 aydır haftada en az 3 kez ortaya çıkan uyku atakları." },
            { code: "Kriter B", title: "Katapleksi veya BOS Hipokretin Eksikliği", content: "Duygusal tetiklenmeli kısa süreli kas tonusu kaybı veya BOS hipokretin-1 < 110 pg/mL olması." }
        ]
    },
    "rem_sleep_behavior_disorder": {
        id: "rem_sleep_behavior_disorder",
        nameTr: "REM Uykusu Davranış Bozukluğu (RBD)",
        nameEn: "REM Sleep Behavior Disorder",
        clinicalDescription: {
            overview: "REM uykusundaki fizyolojik kas felcinin (atoni) kaybolması sonucu rüyaları fiziksel olarak yaşama, yumruk atma, tekmeleme ve yataktan fırlama tablosudur.",
            epidemiology: "Genellikle 50 yaş üzeri erkeklerde görülür; Parkinson ve Lewy Cisimcikli Demansın en güçlü erken belirtecidir.",
            etiology: "Beyin sapında sublaterodorsal çekirdek ve magnoselüler retiküler formasyon disfonksiyonu (alfa-sinükleinopati).",
            prognosis: "Yatak odası güvenliği ve düşük doz Klonazepam/Melatonin ile rüya canlandırma kontrol edilir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Rüya Eyleme Dökme", content: "REM uykusu sırasında konuşma, vurma, dövüşme gibi karmaşık motor davranışlar." },
            { code: "Kriter B", title: "Polisomnografide REM Atonisinin Yokluğu", content: "PSG kaydında REM uykusunda elektromiyografik kas tonusunun korunmuş olması." }
        ]
    },
    "rocd": {
        id: "rocd",
        nameTr: "İlişki Odaklı OKB (Relationship OCD / ROCD)",
        nameEn: "Relationship Obsessive-Compulsive Disorder",
        clinicalDescription: {
            overview: "Kişinin partnerine olan sevgisini, partnerinin fiziksel/zihinsel uygunluğunu sürekli sorgulayan ego-distonik obsesyonlar ve kompulsif güvence arayışlarıdır.",
            epidemiology: "OKB hastalarının yaklaşık %15-20'sinde ilişki odaklı temalar görülür.",
            etiology: "Mükemmeliyetçilik şemaları, belirsizliğe tahammülsüzlük ve 'mükemmel aşk' mitleri.",
            prognosis: "İlişki temalı Maruz Bırakma ve Tepki Önleme (ERP) ve BDT ile yüksek başarı sağlanır."
        },
        criteriaList: [
            { code: "Kriter A", title: "İlişki Takıntıları", content: "Partnerin sevgisine veya uygunluğuna dair yineleyici, müdahaleci şüphe düşünceleri." },
            { code: "Kriter B", title: "Kompulsif Güvence ve Kıyaslama", content: "Sürekli başkalarıyla kıyaslama, partneri test etme ve arkadaşlarından güvence isteme ritüelleri." }
        ]
    },
    "arfid": {
        id: "arfid",
        nameTr: "Kaçıngan/Kısıtlı Yiyecek Alımı Bozukluğu (ARFID)",
        nameEn: "Avoidant/Restrictive Food Intake Disorder",
        clinicalDescription: {
            overview: "Beden algısı bozukluğu olmaksızın, yiyeceğin duyusal özelliklerine (koku, doku, renk) veya boğulma/kusma korkusuna bağlı olarak gelişen yetersiz beslenme tablosudur.",
            epidemiology: "Çocukluk ve ergenlikte sıktır; Otizm ve DEHB ile sık komorbidite gösterir.",
            etiology: "Duyusal işlemleme hassasiyeti ve geçmiş boğulma/öğürme travmaları.",
            prognosis: "Kademeli gıda maruziyeti ve CBT-AR ile yeni besin kabulü artırılır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Kalıcı Yiyecek Kısıtlaması", content: "Besin ihtiyacını karşılayamama, belirgin kilo kaybı ve besin takviyelerine bağımlılık." },
            { code: "Kriter B", title: "Beden İmajı Bozukluğu Yokluğu", content: "Kilo alma korkusu veya beden ağırlığını yanlış algılama kanıtı bulunmaması." }
        ]
    },
    "major_neurocognitive_frontotemporal": {
        id: "major_neurocognitive_frontotemporal",
        nameTr: "Majör Nörobilişsel Bozukluk (Frontotemporal / Pick Hastalığı)",
        nameEn: "Major Frontotemporal Neurocognitive Disorder",
        clinicalDescription: {
            overview: "Erken yaşta başlayan, belirgin sosyal disinhibisyon, empati kaybı, hiperoralite ve kişilik değişimiyle karakterize nörodejeneratif demans tablosudur.",
            epidemiology: "65 yaş altındaki en sık ikinci demans türüdür. Başlangıç genellikle 50-60 yaş arasıdır.",
            etiology: "Frontal ve temporal loblarda Tau proteini (Pick cisimcikleri) veya TDP-43 birikimi.",
            prognosis: "İlerleyicidir; semptomatik davranış yönetimi ve bakıcı desteği temeldir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Davranışsal Disinhibisyon ve Apati", content: "Erken dönemde sosyal kuralları çiğneme, uygunsuz davranışlar ve empati kaybı." },
            { code: "Kriter B", title: "Hiperoralite ve Yürütücü İşlev Kaybı", content: "Aşırı tatlı yeme, stereotipik hareketler ve frontal/temporal beyin atrofisi." }
        ]
    },
    "major_neurocognitive_nph": {
        id: "major_neurocognitive_nph",
        nameTr: "Majör Nörobilişsel Bozukluk (Normal Basınçlı Hidrosefali / Hakim-Adams)",
        nameEn: "Major Neurocognitive Disorder Due to Normal Pressure Hydrocephalus",
        clinicalDescription: {
            overview: "Genişlemiş ventriküllere rağmen normal BOS basıncı ile seyreden, yürüme bozukluğu, idrar kaçırma ve bilişsel gerileme (Hakim-Adams Triadı) ile karakterize geri dönüşümlü demans tablosudur.",
            epidemiology: "Genellikle 65 yaş üzerinde sinsi başlar.",
            etiology: "BOS emilim yollarında direnç artışı ve ventrikülomegali.",
            prognosis: "Erken evrede Ventriküloperitoneal Şant Cerrahisi ile dramatik düzelme sağlanır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Hakim-Adams Triadı", content: "Yürüme apraksisi (manyetik yürüyüş), üriner inkontinans ve subkortikal bilişsel yavaşlama." },
            { code: "Kriter B", title: "Ventrikülomegali ve LP Yanıtı", content: "Genişlemiş ventriküller ve BOS boşaltma testi (Tap Test) sonrası klinik düzelme." }
        ]
    },
    "hallucinogen_persisting_perception": {
        id: "hallucinogen_persisting_perception",
        nameTr: "Hallusinojen Kalıcı Algı Bozukluğu (HPPD)",
        nameEn: "Hallucinogen Persisting Perception Disorder",
        clinicalDescription: {
            overview: "Hallusinojen (LSD vb.) kullanımından aylar/yıllar sonra bile görsel karlanma, ışık izleri ve geometrik halüsinasyonların kişinin içgörüsü tamken sürmesidir.",
            epidemiology: "LSD ve sentetik hallusinojen kullanıcılarında ortaya çıkabilir.",
            etiology: "Görsel korteksteki inhibitör GABAerjik internöronların işlev kaybı ve talamokortikal disritmi.",
            prognosis: "Lamotrijin, Klonazepam ve anksiyete yönetimi ile semptomlar hafifletilir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Görsel Flashback Belirtileri", content: "Geometrik halüsinasyonlar, görsel kar (visual snow), nesnelerin arkasında iz kalması (trailing)." },
            { code: "Kriter B", title: "İçgörünün Korunmuş Olması", content: "Görsel algıların gerçek olmadığının bilinmesi ve belirgin sıkıntıya yol açması." }
        ]
    },
    "childhood_fluency_disorder": {
        id: "childhood_fluency_disorder",
        nameTr: "Çocuklukta Başlayan Akıcılık Bozukluğu (Kekemelik)",
        nameEn: "Childhood-Onset Fluency Disorder (Stuttering)",
        clinicalDescription: {
            overview: "Konuşmanın akıcılığında ve zamanlama düzeninde ses/hece yinelemeleri, uzatmalar ve bloklarla karakterize gelişimsel nöromotor bozukluktur.",
            epidemiology: "Çocukların yaklaşık %5'inde görülür; %80'i ergenliğe kadar kendiliğinden veya terapiyle düzelir. Erkeklerde 3-4 kat sıktır.",
            etiology: "Sol hemisfer konuşma motor devrelerinde işlevsel asimetri ve genetik yatkınlık.",
            prognosis: "Erken dönem konuşma terapisi (Lidcombe Programı) ile başarı oranı çok yüksektir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Akıcılık Bozulması", content: "Sık ses/hece yinelemeleri, ses uzatmaları, kırık sözcükler ve konuşma blokları." },
            { code: "Kriter B", title: "İletişim ve Okul Başarısını Engelleme", content: "Konuşma güçlüğünün toplumsal katılımı ve okul başarısını sınırlandırması." }
        ]
    },
    "specific_learning_dyslexia": {
        id: "specific_learning_dyslexia",
        nameTr: "Özgül Öğrenme Bozukluğu (Okuma Güçlüğü / Disleksi)",
        nameEn: "Specific Learning Disorder with Impairment in Reading",
        clinicalDescription: {
            overview: "Normal zeka ve yeterli eğitime rağmen sözcükleri doğru ve akıcı okumada, harf-ses eşleştirmede yaşanan nörogelişimsel öğrenme güçlüğüdür.",
            epidemiology: "Okul çağı çocuklarının %5-15'inde görülür. En sık rastlanan öğrenme bozukluğudur.",
            etiology: "Sol temporal-paryetal bölgedeki fonolojik işleme devrelerinde nöronal göç ve bağlantı farklılıkları.",
            prognosis: "Çok duyulu yapılandırılmış özel eğitim (Orton-Gillingham) ile okuma becerileri telafi edilir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Okuma Güçlüğü", content: "Sözcük okuma doğruluğunda, okuma hızında ve okuduğunu anlamada en az 6 aydır süren güçlük." },
            { code: "Kriter B", title: "Zeka Düzeyinin Üstünde Olması", content: "Okuma becerilerinin kronolojik yaş ve zeka kapasitesinin belirgin gerisinde kalması." }
        ]
    },
    "developmental_coordination_disorder": {
        id: "developmental_coordination_disorder",
        nameTr: "Gelişimsel Eşgüdüm (Koordinasyon) Bozukluğu (Dispraksi)",
        nameEn: "Developmental Coordination Disorder",
        clinicalDescription: {
            overview: "Motor becerilerin edinilmesinde ve koordinasyonunda kronolojik yaşa göre belirgin yetersizlik (sakarlık, denge bozukluğu, alet kullanma güçlüğü) tablosudur.",
            epidemiology: "Okul çağı çocuklarının %5-6'sında görülür; erkeklerde daha yaygındır.",
            etiology: "Serebellar-paryetal motor planlama ve duyu-motor entegrasyon defisitleri.",
            prognosis: "Ergoterapi ve CO-OP (Bilişsel Yönelimli Mesleki Terapi) ile motor beceriler geliştirilir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Motor Becerilerde Gecikme", content: "Sakar hareketler, nesneleri düşürme, makas/bağcık kullanmada belirgin beceriksizlik." },
            { code: "Kriter B", title: "Organik Nörolojik Hastalık Yokluğu", content: "Serebral palsi veya kas distrofisi gibi bir tıbbi durumun bulunmaması." }
        ]
    },
    "sexsomnia": {
        id: "sexsomnia",
        nameTr: "Seksomni (Uykuda Cinsel Davranış)",
        nameEn: "Sexsomnia (Sleep Sex / NREM Parasomnia)",
        clinicalDescription: {
            overview: "Derin NREM uykusundayken kişinin tam bilinç dışı olarak partnerine cinsel girişimde bulunması veya mastürbasyon yapması ve sabah hiçbir şey hatırlamamasıdır.",
            epidemiology: "Nadir bir NREM parasomnisidir; adli tıpta cinsel saldırı iddialarında önemli yer tutar.",
            etiology: "Derin yavaş dalga uykusundan korteksin uyanamaması, sadece motor ve cinsel merkezlerin disinhibe olması.",
            prognosis: "Klonazepam, uyku hijyeni ve yatak odası güvenlik önlemleriyle tam kontrol sağlanır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Uykuda Cinsel Eylemler", content: "NREM uykusu sırasında istemsiz ve otomatik cinsel motor davranışlar." },
            { code: "Kriter B", title: "Sabah Tam Amnezi", content: "Uyanıldığında sergilenen cinsel eylemlere dair tam bellek yitimi." }
        ]
    },
    "sexual_masochism": {
        id: "sexual_masochism",
        nameTr: "Cinsel Mazoşizm Bozukluğu (Asfiksi Tipi Dahil)",
        nameEn: "Sexual Masochism Disorder",
        clinicalDescription: {
            overview: "Aşağılanma, bağlanma, dövülme veya oksijensiz bırakılma (asfiksi) eylemleriyle yoğun cinsel uyarılma duyma ve bunu eyleme dökme tablosudur.",
            epidemiology: "Erkeklerde daha sıktır; otoerotik asfiksi formu yüksek ölüm riski taşır.",
            etiology: "Erken çocukluk şartlanmaları, acı ile haz merkezleri arasındaki dopaminerjik çapraz bağlantılar.",
            prognosis: "BDT, dürtü yönetimi ve yüksek riskli ölümcül ritüellerin engellenmesi esastır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Acı ve Aşağılanma Dürtüleri", content: "En az 6 ay süreyle bağlanma, dövülme veya acı çekmeyle ilgili cinsel uyarılma fantezileri." },
            { code: "Kriter B", title: "Eyleme Dökme veya Belirgin Sıkıntı", content: "Dürtülerin eyleme dökülmesi (özellikle asfiksiyofili) veya klinik sıkıntı yaratması." }
        ]
    },
    "sexual_sadism": {
        id: "sexual_sadism",
        nameTr: "Cinsel Sadizm Bozukluğu",
        nameEn: "Sexual Sadism Disorder",
        clinicalDescription: {
            overview: "Başka bir insanın fiziksel veya psikolojik acı çekmesinden, korku ve çığlıklarından yoğun cinsel haz alma ve bu dürtüleri rızasız kişiler üzerinde eyleme dökme tablosudur.",
            epidemiology: "Adli psikiyatride ağır suç faillerinde görülür; erkeklerde belirgin derecede sıktır.",
            etiology: "Empati yoksunluğu, güç/kontrol arzusu ve sadistik cinsel koşullanma.",
            prognosis: "Zorlu adli tedavi gerektirir; BDT, antiandrojenler ve yüksek güvenlikli takip uygulanır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Başkasına Acı Çektirme Dürtüleri", content: "En az 6 ay boyunca bir başkasına acı çektirmekten cinsel haz alma fantezileri." },
            { code: "Kriter B", title: "Rızasız Kişiler Üzerinde Eyleme Dökme", content: "Bu dürtülerin onay vermeyen kişiler üzerinde fiziksel yaralamayla eyleme dökülmesi." }
        ]
    },
    "ganser_syndrome": {
        id: "ganser_syndrome",
        nameTr: "Ganser Sendromu (Yaklaşık Yanıtlar / Cezaevi Histerisi)",
        nameEn: "Ganser Syndrome",
        clinicalDescription: {
            overview: "Ağır cezaevi veya adli stresörler altında basit sorulara kasıtlı gibi görünen ancak disosiyatif kökenli 'yaklaşık saçma yanıtlar' (vorbeireden) verme tablosudur.",
            epidemiology: "Cezaevindeki tutuklularda ve ağır travma yaşayanlarda görülür.",
            etiology: "Dayanılmaz suçluluk veya hapis tehdidine karşı ilkel disosiyatif kaçış savunması.",
            prognosis: "Stresörün kalkması ve destekleyici psikoterapiyle hızla kendiliğinden düzelir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Yaklaşık Saçma Yanıtlar", content: "Basit soruların mantığını anlayıp hemen yanındaki yanlış cevabı verme (örn: 2+2=5)." },
            { code: "Kriter B", title: "Bilinç Bulanıklığı ve Disosiasyon", content: "Alacakaranlık bilinç durumu ve organik bir demansın bulunmaması." }
        ]
    },
    "compulsive_buying_disorder": {
        id: "compulsive_buying_disorder",
        nameTr: "Kompulsif Satın Alma Bozukluğu (Oniomani / Alışveriş Bağımlılığı)",
        nameEn: "Compulsive Buying Disorder (Oniomania)",
        clinicalDescription: {
            overview: "Kişinin ihtiyacı olmayan şeyleri karşı konulamaz bir dürtüyle satın alması, satın alma anında öfori yaşayıp sonrasında ağır borç ve suçluluk içine düşmesidir.",
            epidemiology: "Toplumda %5-8 oranında görülür; kadınlarda daha sık bildirilmektedir.",
            etiology: "Dopaminerjik ödül eksikliği, düşük benlik saygısını eşyalarla telafi etme ve dürtüsellik.",
            prognosis: "Finansal uyaran kontrolü ve BDT (CBT-IA) ile harcama döngüsü kontrol altına alınır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Dürtüsel Satın Alma", content: "Gereksiz eşyaları satın alma dürtüsüyle aşırı zihinsel meşguliyet ve kontrol kaybı." },
            { code: "Kriter B", title: "Finansal ve Sosyal Yıkım", content: "Ağır borçlanma, aile çatışmaları ve satın alınan eşyaları kullanmadan gizleme." }
        ]
    },
    "tardive_dyskinesia": {
        id: "tardive_dyskinesia",
        nameTr: "İlacın Yol Açtığı Tardif Diskinezi (TD)",
        nameEn: "Medication-Induced Tardive Dyskinesia",
        clinicalDescription: {
            overview: "Uzun süreli antipsikotik kullanımı sonucu gelişen, dil, dudak, çene ve yüz kaslarında istemsiz koreoatetoid hareketlerle seyreden hareket bozukluğudur.",
            epidemiology: "Tipik antipsikotik kullananların %20-30'unda yıllar içinde gelişir; yaşlılarda risk yüksektir.",
            etiology: "Kronik D2 blokajına bağlı striatumda dopamin reseptörlerinin aşırı duyarlılaşması (up-regulation).",
            prognosis: "VMAT2 inhibitörleri (Valbenazin, Dötetrabenazin) ve atipik antipsikotiğe (Klozapin) geçişle tedavi edilir."
        },
        criteriaList: [
            { code: "Kriter A", title: "İstemsiz Orofasial Hareketler", content: "Dudak şapırdatma, dil çıkarma, çiğneme benzeri istemsiz ritmik olmayan hareketler." },
            { code: "Kriter B", title: "Nöroleptik İlaç Kullanım Öyküsü", content: "En az birkaç aydır devam eden antipsikotik/dopamin bloker ilaç kullanımı." }
        ]
    }
};

// Merge into DSM5_MANUAL
const currentManual = require(manualPath).DSM5_MANUAL;
Object.assign(currentManual, newManualEntries);

fs.writeFileSync(manualPath, `/**
 * PsikoVaka - Kapsamlı DSM-5 Tanı Kriterleri ve Klinik El Kitabı
 * Her tanı için ayrı ayrı:
 * 1. Detaylı Klinik Tanım & Psikopatoloji
 * 2. Resmi DSM-5 Tanı Kriterleri
 */

const DSM5_MANUAL = ${JSON.stringify(currentManual, null, 4)};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DSM5_MANUAL };
}
`, 'utf8');
console.log('Successfully updated DSM5_MANUAL with all 20 new entries!');

// 2. UPDATE THERAPIES_DATABASE
const therPath = path.join(__dirname, 'js', 'therapies.js');
const therModule = require(therPath);
const thers = therModule.THERAPIES_DATABASE;
const fams = therModule.THERAPY_FAMILIES;

const newTherapies = [
    {
        id: "cbt_psychosis",
        nameTr: "Bilişsel Davranışçı Psikoz Terapisi (CBTp)",
        nameEn: "Cognitive Behavioral Therapy for Psychosis (CBTp)",
        family: "CBT_COGNITIVE",
        aliases: ["CBTp", "Psikoz BDT'si", "Sanrılar için Gerçeklik Sınaması"],
        goldForDiagnoses: ["capgras_syndrome", "delusional_disorder", "schizophrenia"],
        shortDefinition: "Sanrılar ve halüsinasyonların yarattığı sıkıntıyı azaltmak ve alternatif rasyonel açıklamalar geliştirmek için uygulanan kanıta dayalı terapidir.",
        protocolSteps: [
            "1. Güvenli terapötik işbirliği ve empati kurma",
            "2. Sanrılı inancı doğrudan yargılamadan kanıtları sorgulama (Sokratik Sorgulama)",
            "3. Stres ve duyusal kopuklukla baş etme becerileri",
            "4. Nüks önleme ve içgörü geliştirme."
        ],
        pitfalls: "Terapistin sanrıyla doğrudan tartışmaya girmesi danışanın direnç göstermesine yol açar.",
        targetMechanism: "Bilişsel esneklik ve alternatif hipotez üretimi."
    },
    {
        id: "ect_biological",
        nameTr: "Biyolojik Tedavi & EKT (Elektrokonvülsif Terapi)",
        nameEn: "Electroconvulsive Therapy & Biological Stabilization",
        family: "THIRD_WAVE",
        aliases: ["EKT", "Elektroşok", "Biyolojik Tedavi"],
        goldForDiagnoses: ["cotard_syndrome", "mdd_with_psychotic", "catatonia_associated"],
        shortDefinition: "Ağır psikotik depresyon, Cotard sendromu ve katatonide hayat kurtarıcı en hızlı etkili biyolojik yöntemdir.",
        protocolSteps: [
            "1. Anestezi ve kas gevşetici altında bilateral/unilateral seans planı",
            "2. Haftada 2-3 seans toplam 6-12 seans uygulama",
            "3. Bilişsel takip ve antipsikotik/antidepresan idamesi."
        ],
        pitfalls: "Geçici yakın bellek bulanıklığı olabilir, hasta ve aileye önceden anlatılmalıdır.",
        targetMechanism: "Yaygın nörotransmitter sıfırlaması ve nöroplastisite artışı."
    },
    {
        id: "medical_stabilization",
        nameTr: "Acil Tıbbi Stabilizasyon & Antidot Protokolü",
        nameEn: "Emergency Medical Stabilization & Antidote Protocol",
        family: "BEHAVIORAL_HABIT",
        aliases: ["Acil Tıbbi Müdahale", "Dantrolen/Bromokriptin", "Siproheptadin"],
        goldForDiagnoses: ["neuroleptic_malignant_syndrome", "serotonin_syndrome"],
        shortDefinition: "Nöroleptik Malign Sendrom veya Serotonin Sendromu gibi ölümcül toksisitelerde tetikleyici ilacın derhal kesilmesi ve spesifik antidotların verilmesidir.",
        protocolSteps: [
            "1. Şüpheli tüm psikotrop ilaçların derhal stoplanması",
            "2. Yoğun bakımda hidrasyon, soğutma ve hemodinamik monitörizasyon",
            "3. NMS için Dantrolen/Bromokriptin; Serotonin Sendromu için Siproheptadin uygulaması."
        ],
        pitfalls: "Tablonun enfeksiyon veya basit anksiyete sanılarak geciktirilmesi hayati risk yaratır.",
        targetMechanism: "Dopamin/Serotonin dengesinin ve otonomik sistemin kurtarılması."
    },
    {
        id: "sleep_hygiene_stimulants",
        nameTr: "Davranışsal Uyku Yönetimi & Nörostimülan Protokolü",
        nameEn: "Behavioral Sleep Management & Neurostimulants",
        family: "MOTIVATIONAL_RHYTHM",
        aliases: ["Narkolepsi Yönetimi", "Planlı Şekerleme", "Modafinil Protokolü"],
        goldForDiagnoses: ["narcolepsy"],
        shortDefinition: "Narkolepside gündüz uyku ataklarını kontrol etmek için planlı kısa şekerlemeler ve uyanıklık artırıcı farmakoterapi kombinasyonudur.",
        protocolSteps: [
            "1. Günde 2 kez 15'er dakikalık planlı stratejik gündüz şekerlemeleri",
            "2. Sabit gece uyku saati ve katapleksi tetikleyicileriyle çalışma",
            "3. Modafinil/Sodyum Oksibat medikal desteği."
        ],
        pitfalls: "Ağır yemekler ve düzensiz uyku saatleri atakları tetikler.",
        targetMechanism: "Uyanıklık regülasyonu ve oreksin eksikliğini kompanse etme."
    },
    {
        id: "safety_clonazepam",
        nameTr: "Yatak Odası Güvenlik Protokolü & Klonazepam",
        nameEn: "Bedroom Safety Protocol & Pharmacotherapy",
        family: "BEHAVIORAL_HABIT",
        aliases: ["RBD Güvenlik Protokolü", "Yatak Güvenliği"],
        goldForDiagnoses: ["rem_sleep_behavior_disorder", "sleepwalking_disorder"],
        shortDefinition: "RBD hastalarında yaralanmaları önlemek için çevresel güvenlik önlemleri ve REM kas atonisini restore eden tedavidir.",
        protocolSteps: [
            "1. Yatak çevresindeki sivri komodinlerin kaldırılması, yere yatak serilmesi",
            "2. Pencerelerin kilitlenmesi ve partnerin ayrı yatakta yatması önlemi",
            "3. Gece düşük doz Klonazepam veya yüksek doz Melatonin."
        ],
        pitfalls: "Önlem alınmadığında ağır kafa travmaları ve partner yaralanmaları kaçınılmazdır.",
        targetMechanism: "Motor disinhibisyonun baskılanması ve çevre güvenliği."
    },
    {
        id: "cbt_ar",
        nameTr: "Kaçıngan Yeme için BDT (CBT-AR)",
        nameEn: "Cognitive-Behavioral Therapy for ARFID (CBT-AR)",
        family: "CBT_EXPOSURE",
        aliases: ["CBT-AR", "ARFID Terapisi", "Duyusal Yeme Eğitimi"],
        goldForDiagnoses: ["arfid"],
        shortDefinition: "ARFID tanılı bireylerde gıdaların duyusal özelliklerine karşı kademeli duyarsızlaştırma ve yeni besinler ekleme protokolüdür.",
        protocolSteps: [
            "1. Kilo stabilizasyonu ve beslenme eksikliklerinin kapatılması",
            "2. Korkulan/kaçınılan yiyecekler hiyerarşisi oluşturma",
            "3. Seans içi kademeli duyusal temas (koklama, dokunma, dudak değdirme, çiğneme)",
            "4. Yeni yiyecekleri günlük rutine dahil etme."
        ],
        pitfalls: "Çocuğu zorla yedirmeye çalışmak öğürme refleksini ve kaçınmayı artırır.",
        targetMechanism: "Duyusal alışma ve gıda neofobisini kırma."
    },
    {
        id: "caregiver_behavioral",
        nameTr: "Davranışsal Çevre Yönetimi & Bakıcı Desteği",
        nameEn: "Behavioral Environmental Management & Caregiver Support",
        family: "SYSTEMIC_FAMILY",
        aliases: ["Demans Çevre Yönetimi", "Frontotemporal Bakıcı Psiko-eğitimi"],
        goldForDiagnoses: ["major_neurocognitive_frontotemporal"],
        shortDefinition: "Frontotemporal demansta kontrolsüz dürtüleri ve hiperoraliteyi engellemek için ortamı güvenli hale getirme protokolüdür.",
        protocolSteps: [
            "1. Evdeki para, anahtar ve tehlikeli maddelere erişimin kilitlenmesi",
            "2. Mutfakta kilitli dolaplar ve porsiyon kontrollü beslenme",
            "3. Çatışmasız dikkat yönlendirme ve bakıcı tükenmişliğini önleme."
        ],
        pitfalls: "Hastayla mantık tartışmasına girmek ajitasyonu tırmandırır.",
        targetMechanism: "Dürtüsel davranışların zararlarını çevresel olarak sınırlandırma."
    },
    {
        id: "surgical_shunt",
        nameTr: "Ventriküloperitoneal Şant Cerrahisi & Nörorehabilitasyon",
        nameEn: "Ventriculoperitoneal Shunt Surgery & Neurorehabilitation",
        family: "THIRD_WAVE",
        aliases: ["Şant Ameliyatı", "NPH Tedavisi", "VP Şant"],
        goldForDiagnoses: ["major_neurocognitive_nph"],
        shortDefinition: "Normal Basınçlı Hidrosefalide (NPH) ventriküllerdeki aşırı BOS'u karın boşluğuna boşaltarak demansı ve yürüme bozukluğunu geri döndüren cerrahi yöntemdir.",
        protocolSteps: [
            "1. Tanısal LP Tap Testi ile düzelmenin kanıtlanması",
            "2. Ventriküloperitoneal Şant takılması",
            "3. Ameliyat sonrası yürüme ve mesane fizyoterapisi."
        ],
        pitfalls: "Geç kalındığında ventrikül basısı kalıcı nöronal hasara yol açar.",
        targetMechanism: "İntrakraniyal BOS dinamiğinin mekanik restorasyonu."
    },
    {
        id: "speech_therapy",
        nameTr: "Konuşma Terapisi (Lidcombe & Akıcılık Şekillendirme)",
        nameEn: "Speech Therapy (Lidcombe Program & Fluency Shaping)",
        family: "BEHAVIORAL_HABIT",
        aliases: ["Kekemelik Terapisi", "Dil ve Konuşma Terapisi", "Lidcombe Programı"],
        goldForDiagnoses: ["childhood_fluency_disorder", "language_disorder"],
        shortDefinition: "Kekemelikte akıcı konuşmayı pekiştiren, yumuşak sesletim ve nefes kontrolü sağlayan kanıta dayalı yöntemdir.",
        protocolSteps: [
            "1. Ebeveyn rehberliğinde akıcı konuşmaların sevecen geri bildirimle pekiştirilmesi",
            "2. Yumuşak başlangıç (soft articulatory contact) teknikleri",
            "3. Nefes ve konuşma hızını senkronize etme",
            "4. Sosyal ortamlara akıcılığı genelleştirme."
        ],
        pitfalls: "Çocuğa sürekli 'Sakin ol, yavaş konuş' diyerek baskı yapmak stresi ve blokları artırır.",
        targetMechanism: "Konuşma motor çıktısının yeniden koşullanması."
    },
    {
        id: "special_education",
        nameTr: "Çok Duyulu Yapılandırılmış Özel Eğitim (Orton-Gillingham)",
        nameEn: "Multisensory Structured Literacy (Orton-Gillingham)",
        family: "CBT_COGNITIVE",
        aliases: ["Disleksi Eğitimi", "Orton-Gillingham", "Yapılandırılmış Okuma"],
        goldForDiagnoses: ["specific_learning_dyslexia", "specific_learning_dysgraphia"],
        shortDefinition: "Disleksili bireylerde harf ve sesleri görsel, işitsel ve kinestetik kanallarla eşzamanlı öğreten altın standart okuma eğitimidir.",
        protocolSteps: [
            "1. Fonolojik farkındalık ve ses ayrıştırma egzersizleri",
            "2. Harfleri kuma yazma, sesini söyleme ve görme (VAK / Görsel-İşitsel-Kinestetik)",
            "3. Kural temelli heceleme ve sözcük çözümleme",
            "4. Akıcı okuma çalışmaları ve özgüven desteği."
        ],
        pitfalls: "Ezbere dayalı klasik okuma tekrarları disleksili çocukta çaresizlik yaratır.",
        targetMechanism: "Alternatif nöral okuma yollarının (sağ hemisfer ve frontal telafi) inşası."
    },
    {
        id: "occupational_coop",
        nameTr: "CO-OP / Bilişsel Yönelimli Mesleki Terapi (Ergoterapi)",
        nameEn: "Cognitive Orientation to daily Occupational Performance (CO-OP)",
        family: "BEHAVIORAL_HABIT",
        aliases: ["Ergoterapi", "CO-OP Yaklaşımı", "Dispraksi Terapisi"],
        goldForDiagnoses: ["developmental_coordination_disorder"],
        shortDefinition: "Koordinasyon bozukluğu olan çocuklara 'Hedef-Plan-Yap-Kontrol Et' stratejisiyle günlük motor görevleri öğreten ergoterapi modelidir.",
        protocolSteps: [
            "1. Çocuğun öğrenmek istediği 3 hedef belirleme (ayakkabı bağlama, bisiklet sürme)",
            "2. Hareketin aşamalarını bilişsel olarak analiz etme",
            "3. Dinamik performans analizi ile ipuçları verme",
            "4. Başarılı performansı prova ederek otomatikleştirme."
        ],
        pitfalls: "Çocuğun yerine işleri ebeveynin yapması motor öğrenmeyi engeller.",
        targetMechanism: "Üstbilişsel stratejilerle motor planlama açığını kapatma."
    },
    {
        id: "sleep_safety_cbt",
        nameTr: "Uyku Güvenliği, Klonazepam & Stres Azaltma Protokolü",
        nameEn: "Sleep Safety, Pharmacotherapy & Stress Reduction",
        family: "BEHAVIORAL_HABIT",
        aliases: ["Seksomni Yönetimi", "NREM Güvenlik Protokolü"],
        goldForDiagnoses: ["sexsomnia"],
        shortDefinition: "Seksomni ve uyurgezerlik vakalarında adli riskleri ve yaralanmaları sıfırlamak için çevre güvenliği ve NREM derinliğini düzenleme protokolüdür.",
        protocolSteps: [
            "1. Yatak odası kapısına alarm/zil takılması ve ayrı uyuma düzeni",
            "2. Uyku yoksunluğu ve alkol gibi tetikleyicilerin sıfırlanması",
            "3. Klonazepam tedavisi ile NREM uyanma eşiğinin dengelenmesi."
        ],
        pitfalls: "Tetikleyiciler devam ederken sadece psikoterapi yetersiz kalır.",
        targetMechanism: "NREM uyanma kararsızlığının giderilmesi."
    },
    {
        id: "vmat2_inhibitor",
        nameTr: "VMAT2 İnhibitörü Tedavisi & Antipsikotik Optimizasyonu",
        nameEn: "VMAT2 Inhibitors (Valbenazine/Deutetrabenazine) & Dose Optimization",
        family: "BEHAVIORAL_HABIT",
        aliases: ["Valbenazin", "Tardif Diskinezi Tedavisi", "VMAT2 İnhibitörü"],
        goldForDiagnoses: ["tardive_dyskinesia"],
        shortDefinition: "Tardif diskinezide istemsiz yüz ve dil hareketlerini durdurmak için presinaptik veziküler monoamin taşıyıcıyı (VMAT2) bloke eden onaylı tedavidir.",
        protocolSteps: [
            "1. Antipsikotik dozunun gözden geçirilmesi ve mümkünse atipik ilaca (Klozapin) geçiş",
            "2. Valbenazin veya Dötetrabenazin başlanması",
            "3. AIMS (Anormal İstemsiz Hareketler Ölçeği) ile düzenli takip."
        ],
        pitfalls: "Antikolinerjik ilaçlar (Akineton vb.) tardif diskineziyi daha da KÖTÜLEŞTİRİR, kesinlikle kesilmelidir.",
        targetMechanism: "Presinaptik dopamin salınımını azaltarak aşırı duyarlı reseptörleri rahatlatma."
    }
];

newTherapies.forEach(nt => {
    if (!thers.some(t => t.id === nt.id)) {
        thers.push(nt);
    }
});

fs.writeFileSync(therPath, `/**
 * PsikoVaka - Psikoterapi Ekolleri ve Müdahale Teknikleri Kütüphanesi
 * Kanıta dayalı psikoterapi yöntemleri, terapi aileleri, seans protokolleri ve terapist tuzakları
 */

const THERAPY_FAMILIES = ${JSON.stringify(fams, null, 4)};

const THERAPIES_DATABASE = ${JSON.stringify(thers, null, 4)};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { THERAPY_FAMILIES, THERAPIES_DATABASE };
}
`, 'utf8');
console.log('Successfully updated THERAPIES_DATABASE with new therapies!');
