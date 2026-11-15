const fs = require('fs');
const path = require('path');

const cases1to4 = [
    {
        id: "case-001",
        caseNumber: 1,
        difficulty: "Orta",
        course: "FORENSIC",
        diagnosisId: "borderline_pd",
        category: "PERSONALITY_B",
        patientSummary: "23 yaşında, kadın, üniversite öğrencisi",
        clues: [
            "Danışan, sevgilisi şehir dışına çıktığında yoğun bir 'içsel boşluk' ve terk edilme dehşeti yaşadığını, onu arka arkaya 40 kez aradıktan sonra telefonuna bakmadığı için sol koluna jiletle yüzeysel çizikler attığını belirterek başvuruyor.",
            "Bu tür yoğun duygusal dalgalanmaların ve krizlerin ergenlik yıllarından (yaklaşık 16 yaşından) beri sürdüğü, haftalar değil saatler içinde aşırı neşeden derin bir umutsuzluğa veya öfkeye savrulduğu belirtiliyor.",
            "İlişkilerinde insanları ilk başta 'mükemmel, hayatımın kurtarıcısı' olarak idealleştirirken, en ufak bir gecikmede 'bencil, değersiz bir düşman' olarak yaftaladığı (bölme / splitting mekanizması) ve arkadaş çevresinin sürekli değiştiği görülüyor.",
            "Toksikoloji taraması ve tiroid fonksiyon testleri normaldir. Genel tıbbi bir duruma veya madde yoksunluğuna bağlı organik bir patoloji saptanmamıştır.",
            "Ruhsal Durum Muayenesinde (MSE): Duygulanım son derece labil (oynak), benlik algısı tutarsız ('Gerçekte kim olduğumu, ne istediğimi bilmiyorum' ifadesi). Dürtüsel harcamalar ve tehlikeli araç kullanma öyküsü mevcut.",
            "DSM-5'e göre: Terk edilmekten çılgınca kaçınma çabaları, kimlik karmaşası, kendine zarar verici yineleyici davranışlar ve belirgin duygulanımsal tepkisellik kriterlerini tam olarak karşılamaktadır."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "terk edilme dehşeti", dsmMatch: "DSM-5 Kriter 1: Gerçek/hayali ayrılıktan kaçınma çabaları" },
            { clueIndex: 0, text: "sol koluna jiletle yüzeysel çizikler", dsmMatch: "DSM-5 Kriter 5: Yineleyen kendine zarar verici davranışlar" },
            { clueIndex: 2, text: "bölme / splitting mekanizması", dsmMatch: "DSM-5 Kriter 2: İdealleştirme ve değersizleştirme uçları arasında giden dengesiz ilişkiler" },
            { clueIndex: 4, text: "benlik algısı tutarsız", dsmMatch: "DSM-5 Kriter 3: Belirgin ve sürekli kararsız benlik algısı veya kimlik karmaşası" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Diyalektik Davranış Terapisi (DBT / Marsha Linehan)",
            therapyDetails: "Duygu düzenleme, kişilerarası etkililik, sıkıntıya tolerans ve bilinçli farkındalık beceri eğitimi.",
            pharmacologyNote: "Düşük doz duygudurum dengeleyiciler veya ikinci kuşak antipsikotikler kriz dönemlerinde eklenebilir."
        },
        miniQuiz: {
            question: "Bu vakada Bipolar II yerine Sınırda (Borderline) Kişilik Bozukluğu tanısı koymamızın en temel klinik gerekçesi nedir?",
            options: [
                "Duygudurum dalgalanmalarının haftalar değil saatler içinde ve kişilerarası terk edilme tetikleyicisiyle oluşması",
                "Hastanın hiçbir zaman depresyon atağı yaşamamış olması",
                "Hastanın genel bilişsel zeka düzeyinin düşük olması",
                "Bipolar bozuklukta kendine zarar verme davranışlarının hiç görülmemesi"
            ],
            correctIndex: 0,
            explanation: "Bipolar dönemleri günler/haftalar sürer; Borderline'da ise affektif dalgalanmalar saatliktir ve kişilerarası terk edilme/reddedilme algısıyla tetiklenir."
        },
        differentialDiagnosis: "• Bipolar II Bozukluğu: Bipolar duygudurum dönemleri günler veya haftalar sürer; oysa burada duygudurum dalgalanmaları saatliktir.\n• Histriyonik KB: Kronik boşluk hissi ve özkıyım/kendini yaralama tipik değildir.",
        dsmCriteriaSummary: "DSM-5: Ayrılıktan kaçınma, dengesiz ilişkiler, kimlik karmaşası, dürtüsellik, özkıyım/kendini yaralama, duygulanımda kararsızlık, kronik boşluk, uygunsuz yoğun öfke."
    },
    {
        id: "case-002",
        caseNumber: 2,
        difficulty: "Kolay",
        course: "ADULT",
        diagnosisId: "panic_disorder",
        category: "ANXIETY",
        patientSummary: "34 yaşında, erkek, muhasebeci",
        clues: [
            "Danışan son 2 aydır 'hiçbir sebep yokken aniden kalbinin göğsünden fırlayacak gibi çarptığını, nefesinin yetmediğini ve delirmekten ya da kalp krizinden öleceğinden korktuğunu' belirterek acil servise başvuruyor.",
            "Bu atakların ilki 8 hafta önce metroda giderken aniden ve beklenmedik şekilde (spontane) başlamış, yaklaşık 15-20 dakika içinde tepe noktasına ulaşarak yavaş yavaş yatışmıştır.",
            "İlk ataktan bu yana 'Acaba yine aynı nöbet gelecek mi?' endişesiyle sürekli nabzını ölçmekte, yanında tansiyon aleti taşımakta ve yalnız kalmaktan korkmaktadır.",
            "Kardiyolojik değerlendirmede EKG, Eko, Troponin ve Holter testleri tamamen temiz çıkmış; organik bir kalp-damar ya da solunum yolu rahatsızlığı saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Sürekli bir tetikte olma ve otonomik aşırı uyarılmışlık hali gözleniyor. Atak geleceğine dair yoğun beklenti anksiyetesi (anticipatory anxiety) belirgin.",
            "DSM-5'e göre: Beklenmedik tekrarlayan panik ataklar ve bu atakları takip eden en az 1 ay boyunca süren 'başka atak geçirme endişesi veya atakların sonuçlarına dair kaygı' mevcuttur."
        ],
        symptomHighlights: [
            { clueIndex: 1, text: "aniden ve beklenmedik şekilde (spontane) başlamış", dsmMatch: "DSM-5 Kriter A: Beklenmedik yineleyen panik ataklar" },
            { clueIndex: 2, text: "'Acaba yine aynı nöbet gelecek mi?' endişesiyle", dsmMatch: "DSM-5 Kriter B1: En az 1 aydır süren başka panik ataklar geçirme kaygısı (Beklenti anksiyetesi)" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Bilişsel Davranışçı Terapi (BDT / Panik Protokolü)",
            therapyDetails: "Bedensel duyumların felaketleştirici yorumlanmasını yeniden yapılandırma, interoseptif maruz bırakma ve güvenlik arama davranışlarını söndürme.",
            pharmacologyNote: "SSRI/SNRI grubu antidepresanlar ilk sıra medikal tedavidir."
        },
        miniQuiz: {
            question: "Panik Bozukluk tanısı koyabilmek için sadece panik atak geçirmek neden yeterli değildir?",
            options: [
                "Çünkü tek bir panik atak toplumda sık görülür; tanı için en az 1 ay süren beklenti anksiyetesi veya uyumsuz kaçınma şarttır.",
                "Çünkü panik bozuklukta hastanın mutlaka bayılması gerekir.",
                "Çünkü panik ataklar sadece uyku sırasında ortaya çıkar.",
                "Çünkü panik atak geçiren hastaların tamamında agorafobi gelişmek zorundadır."
            ],
            correctIndex: 0,
            explanation: "DSM-5'e göre tekrarlayan beklenmedik atakların ardından en az 1 ay boyunca süren 'beklenti anksiyetesi' veya uyumsuz davranış değişikliği şarttır."
        },
        differentialDiagnosis: "• Yaygın Anksiyete Bozukluğu: YAB'de kaygı günün geneline yayılan evhamdır.\n• Organik Kalp Hastalığı: EKG ve enzimlerle dışlanmıştır.",
        dsmCriteriaSummary: "DSM-5: Beklenmedik yineleyen panik ataklar + En az 1 ay süren 'başka atak olacağı kaygısı' veya uyumsuz davranış değişiklikleri."
    },
    {
        id: "case-003",
        caseNumber: 3,
        difficulty: "Zor",
        course: "ADULT",
        diagnosisId: "ocpd",
        category: "PERSONALITY_C",
        patientSummary: "46 yaşında, erkek, kıdemli denetçi",
        clues: [
            "Danışan, eşinin ve iş arkadaşlarının 'katı, inatçı ve aşırı kuralcı' olmasından şikayet etmesi üzerine eşinin zoruyla görüşmeye geliyor; kendisinde hiçbir sorun olmadığını, herkesin işini onun gibi kusursuz yapması gerektiğini savunuyor.",
            "Tüm hayatı boyunca ayrıntılara, listelere, kurallara ve programlara aşırı odaklandığı için projelerin ana amacını unuttuğu ve teslim tarihlerini sıklıkla kaçırdığı öğreniliyor.",
            "Eski ve hiçbir değeri olmayan eşyaları 'bir gün lazım olur' diye asla atamamakta, para harcamayı felaket durumları için sakınılması gereken bir şey olarak görüp aşırı cimri davranmaktadır.",
            "Madde kullanımı yoktur, rutin nörolojik ve biyokimyasal testler normaldir.",
            "Ruhsal Durum Muayenesinde: Düşünce yapısı aşırı formal, duygulanımı kısıtlı ve ahlaki/etik konularda aşırı katı (infleksibl). Görevleri tam istediği standartta yapmayacakları gerekçesiyle başkalarına asla delege edemiyor. Kendisini egosintonik görmektedir.",
            "DSM-5'e göre: Esneklik, açıklık ve verimlilik pahasına düzenlilik, mükemmeliyetçilik, zihinsel ve kişilerarası denetim üzerine aşırı kafa yorma örüntüsü mevcuttur; klasik intruzif takıntılar (obsesyonlar) ve bunları rahatlatıcı mantıksız ritüeller (kompulsiyonlar) yoktur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "kendisinde hiçbir sorun olmadığını", dsmMatch: "Egosintonik Yapı: Kişi semptomları kişiliğinin doğru bir parçası olarak görür" },
            { clueIndex: 1, text: "ayrıntılara, listelere, kurallara ve programlara aşırı odaklandığı için", dsmMatch: "DSM-5 Kriter 1: Ayrıntılar, kurallar, listelerle uğraşmaktan etkinliğin ana amacını kaçırma" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Şema Terapi & Bilişsel Davranışçı Terapi (BDT)",
            therapyDetails: "'Yüksek Standartlar' ve 'Kusursuzluk' şemalarını esnetme; hata yapma toleransını artırma.",
            pharmacologyNote: "Spesifik bir ilaç tedavisi yoktur; eşlik eden kaygı/depresyonda SSRI tercih edilebilir."
        },
        miniQuiz: {
            question: "Obsesif-Kompulsif Bozukluk (OKB) ile Obsesif-Kompulsif Kişilik Bozukluğu (OKKB) arasındaki en kritik fark nedir?",
            options: [
                "OKB egodistoniktir (kişi takıntılarından rahatsızdır); OKKB ise egosintoniktir (kişi kurallarının ve mükemmeliyetçiliğinin doğru olduğuna inanır).",
                "OKKB sadece kadınlarda görülür, OKB ise erkeklerde.",
                "OKKB hastalarında el yıkama ritüelleri günde 10 saati geçer.",
                "OKB bir kişilik bozukluğudur, OKKB ise anksiyete bozukluğudur."
            ],
            correctIndex: 0,
            explanation: "OKB'de takıntılar egodistoniktir. OKKB'de ise mükemmeliyetçilik ve katılık kişinin benimsediği (egosintonik) karakter özelliğidir."
        },
        differentialDiagnosis: "• OKB: Egodistoniktir, spesifik obsesyon-kompulsiyon döngüsü vardır.\n• Narsisistik KB: Narsist hayranlık ister; OKKB ise kurallara odaklanır.",
        dsmCriteriaSummary: "DSM-5 (En az 4/8): Ayrıntılarla uğraşmaktan işin özünü kaçırma, mükemmeliyetçilik, aşırı işkoliklik, ahlaki katılık, eşya biriktirme, delege edememe, cimrilik, inatçılık."
    },
    {
        id: "case-004",
        caseNumber: 4,
        difficulty: "Orta",
        course: "ADULT",
        diagnosisId: "schizophrenia",
        category: "PSYCHOTIC",
        patientSummary: "21 yaşında, erkek, üniversiteyi terk etmiş",
        clues: [
            "Ailesi tarafından getirilen genç, son 7 aydır odasından çıkmadığını, radyo ve televizyondaki haber spikerlerinin kendisine gizli kodlarla mesaj ilettiğini ve duvarların arkasından iki kişinin kendi hareketleri hakkında alaycı yorumlar yaptığını ifade ediyor.",
            "Belirtiler yaklaşık 1 yıl önce içe kapanma, kişisel hijyeni ihmal etme ve ders başarısında çöküş ile başlamış; son 6 aydır kesintisiz olarak aktif psikotik semptomlar devam etmektedir.",
            "Öğrenci, ailesinin yemeklerine zehir kattığına inandığı için sadece kapalı ambalajlı bisküvileri yemekte, günlerce yıkanmamakta ve göz temasından kaçınmaktadır.",
            "Beyin MRG ve EEG incelemeleri normaldir; idrar toksikoloji taramasında esrar, amfetamin veya diğer psikoaktif maddeler negatif çıkmıştır.",
            "Ruhsal Durum Muayenesinde: Künt duygulanım (duygusal tepkisizlik), düşünce içeriğinde referans ve perseküsyon (kötülük görme) sanrıları, işitsel varsanılar (üçüncü şahıs sesler), düşünce bloğu ve konuşmada fakirleşme (aloji) gözleniyor.",
            "DSM-5'e göre: En az 6 aydır süren bozukluk belirtileri içinde en az 1 ay süresince aktif hezeyan, halüsinasyon ve negatif belirtiler mevcuttur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "haber spikerlerinin kendisine gizli kodlarla mesaj ilettiğini", dsmMatch: "DSM-5 Kriter A1: Alınma / Referans Sanrıları" },
            { clueIndex: 0, text: "duvarların arkasından iki kişinin kendi hareketleri hakkında alaycı yorumlar yaptığını", dsmMatch: "DSM-5 Kriter A2: Üçüncü Şahıs İşitsel Varsanılar (Halüsinasyon)" },
            { clueIndex: 4, text: "Künt duygulanım ... konuşmada fakirleşme (aloji)", dsmMatch: "DSM-5 Kriter A5: Negatif Belirtiler" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Psikososyal Beceri Eğitimi & CBTp (Psikoz için BDT)",
            therapyDetails: "Sanrı ve varsanılara yüklenen anlamları esnetme, stresle başa çıkma ve sosyal beceri eğitimi.",
            pharmacologyNote: "İkinci kuşak antipsikotikler (Risperidon, Olanzapin, Aripiprazol) temel biyolojik tedavidir."
        },
        miniQuiz: {
            question: "Belirtiler aynı kalsaydı ancak süre 6 ay yerine toplam 3 ay sürseydi doğru DSM-5 tanısı ne olurdu?",
            options: [
                "Şizofreniform Bozukluk",
                "Kısa Psikotik Bozukluk",
                "Sanrılı Bozukluk",
                "Şizoaffektif Bozukluk"
            ],
            correctIndex: 0,
            explanation: "Şizofreni A kriterlerini karşılayan ancak 1-6 ay arası süren tablolar DSM-5'te 'Şizofreniform Bozukluk' olarak tanı alır."
        },
        differentialDiagnosis: "• Kısa Psikotik Bozukluk: Süre < 1 ay.\n• Şizofreniform Bozukluk: 1-6 ay arası.\n• Şizoaffektif Bozukluk: Belirgin mani/depresyon dönemi psikozla eşzamanlı eşlik etmez.",
        dsmCriteriaSummary: "DSM-5: Sanrılar, varsanılar, dezorganize konuşma, katatonik davranış, negatif belirtiler (en az 2/5). Süre ≥ 6 ay."
    }
];

const cases5to10 = [
    {
        id: "case-005",
        caseNumber: 5,
        difficulty: "Kolay",
        course: "ADULT",
        diagnosisId: "bipolar_1",
        category: "MOOD",
        patientSummary: "29 yaşında, erkek, borsa aracısı",
        clues: [
            "Danışan son 6 gündür günde sadece 1.5 saat uyuduğu halde kendini 'nükleer bir enerjiyle dolu, dünyanın en dahi yatırımcısı' olarak hissettiğini ve 3 yeni şirket kurmak için tüm mal varlığını tek gecede kripto paralara yatırdığını anlatıyor.",
            "Konuşması o kadar hızlı ve basınçlıdır ki (baskılı konuşma) araya girmek imkansızdır; bir fikirden diğerine saniyeler içinde atlamakta (fikir uçuşması) ve kliniğin ortasında şarkı söylemeye başlamaktadır.",
            "İş yerindeki yöneticisine bağırıp masaları tekmelediği ve tanımadığı insanlara sokakta binlerce lira dağıttığı için ailesi tarafından zorla getirilmiştir.",
            "Madde toksikoloji taraması negatif; tiroid ve metabolik paneli normaldir.",
            "Ruhsal Durum Muayenesinde: Taşkın duygudurum, grandiyöz sanrılar, psikomotor ajitasyon ve riskli davranışlarda aşırı artış.",
            "DSM-5'e göre: En az 1 hafta süren kabarmış, taşkın veya irritabl duygudurum ile giden Manik Epizod mevcuttur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "günde sadece 1.5 saat uyuduğu halde", dsmMatch: "DSM-5 Kriter B2: Uyku gereksiniminde azalma" },
            { clueIndex: 0, text: "dünyanın en dahi yatırımcısı", dsmMatch: "DSM-5 Kriter B1: Büyüklük (grandiyözite)" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Sosyal Ritim Terapisi (IPSRT) & Bilişsel Terapi",
            therapyDetails: "Uyku-uyanıklık döngüsünü sabitleme, erken uyarı işaretlerini tanıma ve ilaç uyumu.",
            pharmacologyNote: "Lityum, Valproat ve atipik antipsikotikler temel tedavidir."
        },
        miniQuiz: {
            question: "Bipolar I tanısı koyabilmek için kişinin geçmişinde mutlaka bir Majör Depresyon atağı geçirmiş olması şart mıdır?",
            options: [
                "Hayır, tek bir Manik Epizod geçirilmiş olması Bipolar I tanısı koymak için yeterlidir.",
                "Evet, en az 3 majör depresyon atağı zorunludur.",
                "Evet, sadece depresyonu olanlara Bipolar I denir.",
                "Mani olmadan sadece hipomani varsa Bipolar I konur."
            ],
            correctIndex: 0,
            explanation: "Tek bir manik atak geçirilmiş olması Bipolar I tanısı için yeterlidir."
        },
        differentialDiagnosis: "• Bipolar II: Sadece Hipomani ve Majör Depresyon vardır.\n• Madde Etkisi: Toksikoloji negatiftir.",
        dsmCriteriaSummary: "DSM-5: En az 1 hafta süren kabarmış duygudurum + En az 3 manik belirti."
    },
    {
        id: "case-006",
        caseNumber: 6,
        difficulty: "Kolay",
        course: "ADULT",
        diagnosisId: "social_anxiety",
        category: "ANXIETY",
        patientSummary: "22 yaşında, kadın, üniversite öğrencisi",
        clues: [
            "Danışan sınıfta sunum yapması gerektiğinde veya tanımadığı insanların bulunduğu bir ortamda yemek yerken 'herkesin ona baktığı, sesinin titreyeceği, yüzünün kızaracağı ve rezil olacağı' korkusuyla dehşete düştüğünü belirterek başvuruyor.",
            "Bu durum lise yıllarından beri sürmekte olup son 1 yıldır derslerde yoklama alınırken adını söylemekten bile kaçınmakta, sunum zorunluluğu olan dersleri bırakmaktadır.",
            "Korkulan ortamlarda kalp çarpıntısı, ellerde titreme, aşırı terleme ve midede düğümlenme hissi yaşamaktadır.",
            "Nörolojik muayene ve tiroid testleri tamamen normaldir.",
            "Ruhsal Durum Muayenesinde: Olumsuz değerlendirilme korkusu, performans anksiyetesi ve yoğun sosyal kaçınma örüntüsü mevcuttur.",
            "DSM-5'e göre: Başkalarınca değerlendirilebilecek bir ya da birden fazla toplumsal durumda belirgin bir korku ya da kaygı duyma (en az 6 ay) tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "rezil olacağı korkusuyla", dsmMatch: "DSM-5 Kriter B: Olumsuz değerlendirilecek biçimde davranmaktan korkma" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Bilişsel Davranışçı Terapi (Kademeli Maruz Bırakma & Video Geribildirimi)",
            therapyDetails: "Dikkati içsel sinyallerden dış dünyaya yöneltme ve sosyal ortamlarda maruz bırakma.",
            pharmacologyNote: "SSRI'lar (Sertralin) ve performans anksiyetesinde beta-blokerler kullanılır."
        },
        miniQuiz: {
            question: "Sosyal Anksiyete Bozukluğunda temel bilişsel odak nedir?",
            options: [
                "Başkaları tarafından rezil, aptal, yetersiz veya kaygılı olarak olumsuz değerlendirilme korkusu",
                "Açık alanda panik atak geçirip yardım bulamama korkusu",
                "Mikrop kapıp hastalanma korkusu",
                "Uçakta türbülansa girip düşme korkusu"
            ],
            correctIndex: 0,
            explanation: "Sosyal anksiyetenin özü, toplumsal performans veya etkileşim anında olumsuz değerlendirilme korkusudur."
        },
        differentialDiagnosis: "• Agorafobi: Kaçamama korkusudur; Sosyal Anksiyete ise rezil olma korkusudur.\n• Kaçıngan KB: Daha derin bir yetersizlik inancıdır.",
        dsmCriteriaSummary: "DSM-5: Başkalarınca değerlendirilebilecek durumlarda belirgin korku + Olumsuz değerlendirilme korkusu + Kaçınma. Süre ≥ 6 ay."
    },
    {
        id: "case-007",
        caseNumber: 7,
        difficulty: "Orta",
        course: "ADULT",
        diagnosisId: "ptsd",
        category: "TRAUMA",
        patientSummary: "32 yaşında, erkek, depremzede",
        clues: [
            "Danışan 14 ay önce yaşanan büyük depremde göçük altından 18 saat sonra çıkarılmış; o günden beri her korna sesinde veya kapı çarpmasında deprem oluyormuş gibi yerinden fırladığını ve geceleri aynı göçük anını kabus olarak gördüğünü anlatıyor.",
            "Depremle ilgili haberleri, yıkık binaların olduğu sokakları görmemek için yolunu 5 kilometre uzatmakta ve depremden bahseden akrabalarıyla görüşmeyi tamamen kesmiştir.",
            "Olaydan bu yana kendini duygusal olarak tamamen hissizleşmiş, kimseye sevgi duyamayan, geleceğe dair hiçbir plan yapamayan biri olarak tanımlamaktadır.",
            "Genel biyokimyasal ve nörolojik taramalar olağandır.",
            "Ruhsal Durum Muayenesinde: Aşırı irkilme tepkisi (hipervijilans), travmayı yeniden yaşantılama (flashbackler), intrüzif anılar ve duygusal küntleşme.",
            "DSM-5'e göre: Gerçek bir ölüm/ağır yaralanma tehdidine maruz kalma ve ardından 1 aydan uzun süren yeniden yaşantılama, kaçınma, bilişsel/duygudurum değişiklikleri ve uyarılmışlık belirtileri mevcuttur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "geceleri aynı göçük anını kabus olarak gördüğünü", dsmMatch: "DSM-5 Kriter B: İstilacı (yeniden yaşantılama) belirtileri" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Travma Odaklı BDT & EMDR",
            therapyDetails: "Travmatik anı ağlarını güvenli bir şekilde işleme, kaçınmaları söndürme.",
            pharmacologyNote: "SSRI grubu antidepresanlar ve kabuslar için Prazosin etkilidir."
        },
        miniQuiz: {
            question: "Travma Sonrası Stres Bozukluğu (TSSB) ile Akut Stres Bozukluğu arasındaki en belirgin tanısal ayrım nedir?",
            options: [
                "Belirtilerin süresi: Akut Stres Bozukluğu 3 gün ile 1 ay arası sürer; TSSB ise 1 aydan uzun sürer.",
                "TSSB sadece çocuklarda görülür.",
                "Akut stres bozukluğunda kabus görülmez.",
                "TSSB'de ilaç tedavisi yasaktır."
            ],
            correctIndex: 0,
            explanation: "Travmatik stresör sonrası ilk 1 ay Akut Stres; 1 ayı aşan tablo TSSB'dir."
        },
        differentialDiagnosis: "• Akut Stres Bozukluğu: Süre < 1 aydır.\n• Uyum Bozukluğu: Yaşam stresörlerine yanıttır.",
        dsmCriteriaSummary: "DSM-5: Travmaya maruz kalma + Yeniden yaşantılama + Kaçınma + Olumsuz duygudurum + Uyarılmışlık. Süre > 1 ay."
    },
    {
        id: "case-008",
        caseNumber: 8,
        difficulty: "Kolay",
        course: "ADULT",
        diagnosisId: "gad",
        category: "ANXIETY",
        patientSummary: "38 yaşında, kadın, öğretmen",
        clues: [
            "Danışan son 1 yıldır çocuklarının sağlığı, evin bütçesi, okul müdürünün bir bakışı gibi hayatın her alanıyla ilgili 'sürekli en kötü felaketin gerçekleşeceği' yönünde aşırı ve kontrol edilemez bir evham yaşadığını anlatıyor.",
            "Bu sürekli endişe halini durduramadığını, gün boyu omuzlarında ve boynunda kronik kas gerginliği, çabuk yorulma, konsantrasyon güçlüğü ve huzursuzluk hissettiğini belirtiyor.",
            "Geceleri 'Ya yarın bir aksilik olursa' düşünceleri yüzünden uykuya dalmakta zorlanmakta ve sabahları dinlenmemiş olarak uyanmaktadır.",
            "Rutin kan sayımı, tiroid ve kardiyak değerlendirmeleri tamamen normaldir.",
            "Ruhsal Durum Muayenesinde: Yaygın beklenti kaygısı, motor gerginlik ve otonomik aşırı duyarlılık saptanmıştır.",
            "DSM-5'e göre: En az 6 aylık bir sürenin çoğu gününde, bir dizi etkinlik ya da olay hakkında aşırı bir kaygı ve kuruntu duyma ve bu kaygıyı denetlemekte güçlük çekme mevcuttur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "aşırı ve kontrol edilemez bir evham", dsmMatch: "DSM-5 Kriter A & B: Aşırı kaygı ve kuruntu; denetlemekte güçlük çekme" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Bilişsel Davranışçı Terapi (BDT)",
            therapyDetails: "Belirsizliğe tahammül geliştirme, endişe erteleme saatleri ve progresif kas gevşetme.",
            pharmacologyNote: "SSRI/SNRI antidepresanlar (Venlafaksin) birinci basamaktır."
        },
        miniQuiz: {
            question: "Yaygın Anksiyete Bozukluğu (YAB) için DSM-5'te belirtilen asgari süre kriteri nedir?",
            options: [
                "En az 6 ay",
                "En az 1 ay",
                "En az 2 hafta",
                "En az 1 yıl"
            ],
            correctIndex: 0,
            explanation: "YAB tanısı için aşırı kuruntu ve kaygının en az 6 ay sürmesi gerekir."
        },
        differentialDiagnosis: "• Panik Bozukluk: Panikte ani nöbetler vardır; YAB'de gün geneline yayılan evham vardır.",
        dsmCriteriaSummary: "DSM-5: En az 6 ay süren aşırı kaygı + Kontrol güçlüğü + En az 3 somatik belirti."
    },
    {
        id: "case-009",
        caseNumber: 9,
        difficulty: "Orta",
        course: "FORENSIC",
        diagnosisId: "antisocial_pd",
        category: "PERSONALITY_B",
        patientSummary: "27 yaşında, erkek, cezaevi hükümlüsü",
        clues: [
            "Danışan dolandırıcılık, gasp ve sahte evrak düzenleme suçlarından dolayı cezaevinde bulunmakta olup sevk edildiği adli heyet görüşmesinde 'İnsanlar bu kadar aptal olmasa onları dolandırmazdım, suç bende değil kanunlarda' diyerek mağdurlara karşı sıfır pişmanlık ve empati sergilemektedir.",
            "15 yaşından önce sokak kedilerine işkence ettiği, okulun camlarını kırdığı, çete kurup hırsızlık yaptığı ve ailesinden sürekli para çaldığı (çocuklukta Davranım Bozukluğu öyküsü) kayıtlardan doğrulanmıştır.",
            "Sık sık sahte kimlikler kullanmakta, insanları manipüle ederek çıkarları için yalan söylemekte ve fiziksel kavgalara karışmaktadır.",
            "Nörolojik muayene ve EEG tetkiklerinde organik bir patoloji saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Büyüleyici/sempatik görünümün (superficial charm) altında derin empati yoksunluğu, kural tanımazlık ve dürtüsellik.",
            "DSM-5'e göre: 15 yaşından beri süregelen, başkalarının haklarını hiçe sayma ve çiğneme örüntüsü ile en az 18 yaşında olma ve 15 yaşından önce Davranım Bozukluğu kanıtı bulunması kriterleri karşılanmaktadır."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "mağdurlara karşı sıfır pişmanlık ve empati", dsmMatch: "DSM-5 Kriter 7: Vicdan azabı/pişmanlık çekmeme" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Şema Terapi & Davranışçı Sınır Koyma Programları",
            therapyDetails: "Empati geliştirme, kuralların sonuçlarıyla yüzleştirme.",
            pharmacologyNote: "Saldırganlık için duygudurum dengeleyiciler kullanılabilir."
        },
        miniQuiz: {
            question: "Antisosyal Kişilik Bozukluğu tanısı koyabilmek için yaş sınırları ve çocukluk geçmişiyle ilgili hangi şart zorunludur?",
            options: [
                "Kişinin en az 18 yaşında olması ve 15 yaşından önce Davranım Bozukluğu öyküsünün bulunması şarttır.",
                "Kişinin en az 40 yaşında olması gerekir.",
                "Çocuklukta hiçbir sorun yaşamamış olması gerekir.",
                "Tanı 12 yaşında kesinleştirilebilir."
            ],
            correctIndex: 0,
            explanation: "Antisosyal KB tanısı ancak 18 yaşından sonra konabilir ve 15 öncesi Davranım Bozukluğu kanıtı şarttır."
        },
        differentialDiagnosis: "• Narsisistik KB: Suç ve şiddet zorunlu değildir; Narsistte statü ön plandadır.",
        dsmCriteriaSummary: "DSM-5: Yasalara uymama, hilekarlık, dürtüsellik, saldırganlık, sorumsuzluk, pişmanlık duymama + Yaş ≥ 18."
    },
    {
        id: "case-010",
        caseNumber: 10,
        difficulty: "Kolay",
        course: "ADULT",
        diagnosisId: "mdd",
        category: "MOOD",
        patientSummary: "44 yaşında, kadın, banka müdürü",
        clues: [
            "Danışan son 5 haftadır yataktan çıkmak istemediğini, en sevdiği hobisi olan resim yapmaktan bile hiçbir zevk alamadığını (anhedoni) ve kendini 'derin, karanlık bir çukurda' hissettiğini anlatıyor.",
            "İştahı tamamen kesilmiş ve bu sürede 6 kilo vermiştir; sabahları saat 04:00'te uyanıp tekrar uyuyamamakta (terminal insomni) ve gün boyu aşırı yorgun hissetmektedir.",
            "Sürekli olarak 'Ben başarısız bir anneyim, çocuklarımın hayatını mahvettim' şeklinde uygunsuz değersizlik ve suçluluk düşünceleri üretmektedir.",
            "Tıbbi tetkiklerde TSH, B12, D vitamini ve tam kan sayımı normal sınırlardadır.",
            "Ruhsal Durum Muayenesinde: Psikomotor yavaşlama, kederli duygulanım, konsantrasyon kaybı ve pasif özkıyım düşünceleri saptanmıştır.",
            "DSM-5'e göre: İki haftalık bir dönem boyunca çökkün duygudurum ya da ilgi/zevk kaybı belirtilerinden en az birini içeren en az 5 depresif semptom mevcuttur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "hiçbir zevk alamadığını (anhedoni)", dsmMatch: "DSM-5 Kriter A2: Anhedoni (zevk alamama)" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Bilişsel Davranışçı Terapi (BDT) & Davranışsal Aktivasyon",
            therapyDetails: "Beck'in bilişsel üçlüsünü yeniden yapılandırma ve günlük etkinlik çizelgesi.",
            pharmacologyNote: "SSRI veya SNRI grubu antidepresanlar birinci sıra tedavidir."
        },
        miniQuiz: {
            question: "DSM-5'e göre Majör Depresif Bozukluk atağı tanısı için belirtilerin en az ne kadar sürmesi şarttır?",
            options: [
                "En az 2 hafta kesintisiz sürmelidir",
                "En az 6 ay sürmelidir",
                "En az 3 gün sürmelidir",
                "En az 1 yıl sürmelidir"
            ],
            correctIndex: 0,
            explanation: "Majör Depresif Epizod için sürenin en az 2 hafta olması zorunludur."
        },
        differentialDiagnosis: "• Distimi: En az 2 yıl sürer; epizodik değildir.",
        dsmCriteriaSummary: "DSM-5: Çökkün duygudurum, anhedoni, kilo/uyku değişimi, değersizlik, yorgunluk (en az 5/9). Süre ≥ 2 hafta."
    }
];

const cases11to25 = [
    {
        id: "case-011",
        caseNumber: 11,
        difficulty: "Orta",
        course: "FORENSIC",
        diagnosisId: "narcissistic_pd",
        category: "PERSONALITY_B",
        patientSummary: "39 yaşında, erkek, şirket CEO'su",
        clues: [
            "Danışan, yönetim kurulunun kendisini yeterince övmemesi ve fikirlerine itiraz etmesi üzerine öfke krizine girerek şirketi terk etmiş ve 'Bu vasat insanların benim dehamı takdir edememesi katlanılmaz' diyerek seansa geliyor.",
            "Tüm ilişkilerinde insanların sadece kendi başarılarına hayranlık duymasını beklemekte, başkalarının duygularını ve sorunlarını tamamen önemsiz görmektedir (empati yoksunluğu).",
            "Özel haklara sahip olduğuna (entitlement inancı) inanmakta, sıradan insanların uyduğu kuralların kendisi için geçerli olmadığını savunmaktadır.",
            "Tıbbi değerlendirmeler temizdir; madde kullanımı veya bipolar manik dönem saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Büyüklenmeci (grandiyöz) benlik algısı, sürekli hayranlık arayışı, eleştiriye karşı aşırı kırılganlık ve narsisistik öfke.",
            "DSM-5'e göre: Erken erişkinlikte başlayan, büyüklenmecilik (düşlemde ya da davranışta), beğenilme gereksinimi ve eşduyum (empati) yapamama ile giden yaygın bir örüntüdür."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "benim dehamı takdir edememesi katlanılmaz", dsmMatch: "DSM-5 Kriter 1: Büyüklenmecilik ve üstünlük duygusu" },
            { clueIndex: 1, text: "empati yoksunluğu", dsmMatch: "DSM-5 Kriter 7: Empati yoksunluğu" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Şema Terapi & Psikodinamik Terapi",
            therapyDetails: "'Kusurluluk/Utanç' şemasının ardındaki kırılgan benliği onarma, sağlıklı sınırlar ve gerçekçi özdeğer inşa etme.",
            pharmacologyNote: "Primer farmakoterapisi yoktur."
        },
        miniQuiz: {
            question: "Narsisistik Kişilik Bozukluğu ile Histriyonik Kişilik Bozukluğu arasındaki temel fark nedir?",
            options: [
                "Narsist 'özel statü, üstünlük ve hayranlık' ister; Histriyonik ise sadece 'ilgi odağı' olmak ister.",
                "Histriyonik bireyler asla ağlamaz.",
                "Narsisistik bireyler her zaman suç işler.",
                "İki tanı arasında hiçbir fark yoktur."
            ],
            correctIndex: 0,
            explanation: "Narsist üstünlük ve hayranlık peşindedir; Histriyonik ise sadece dikkat çekmek ister."
        },
        differentialDiagnosis: "• Antisosyal KB: Suç ve şiddet yaygındır.\n• Histriyonik KB: Sadece ilgi arar; Narsist hayranlık arar.",
        dsmCriteriaSummary: "DSM-5: Büyüklenmecilik, başarı düşlemleri, özel olduğuna inanma, aşırı beğenilme gereksinimi, empati yokluğu (en az 5/9)."
    },
    {
        id: "case-012",
        caseNumber: 12,
        difficulty: "Zor",
        course: "NEURO_SOMATIC",
        diagnosisId: "conversion_disorder",
        category: "SOMATIC",
        patientSummary: "19 yaşında, kadın, lise mezunu",
        clues: [
            "Danışan, ailesinin istemediği biriyle zorla nişanlandırılacağı gece aniden bacaklarında tam bir felç (parapleji) geliştiği ve tekerlekli sandalyeye bağımlı hale geldiği gerekçesiyle nöroloji kliniğinden yönlendiriliyor.",
            "Nörolojik muayenede derin tendon refleksleri, Babinski refleksi ve EMG testleri normal bulunmuş; Hoover testi ile psikojenik bacak güçsüzlüğü pozitif saptanmıştır (organik nörolojik yolaklarla uyumsuzluk).",
            "Hasta felç kalmış olmasına rağmen durumuna karşı şaşırtıcı bir kayıtsızlık ve sakinlik ('la belle indifférence' / güzel aldırmazlık) sergilemektedir.",
            "Kranial ve spinal MRG tamamen temizdir; toksik veya metabolik bir bozukluk yoktur.",
            "Ruhsal Durum Muayenesinde: Bilinçdışı psikolojik çatışmanın somatik nörolojik bir defisite dönüştürülmesi örüntüsü.",
            "DSM-5'e göre: İstemli motor ya da duyusal işlevlerde değişme olduğunu gösteren belirti ve nörolojik bir hastalıkla bağdaşmadığına ilişkin klinik bulgulardır."
        ],
        symptomHighlights: [
            { clueIndex: 1, text: "Hoover testi ile psikojenik bacak güçsüzlüğü pozitif", dsmMatch: "DSM-5 Kriter B: Nörolojik durumla bağdaşmazlık kanıtı" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Psikodinamik Terapi & BDT (Fizik Tedavi ile)",
            therapyDetails: "Bilinçdışı çatışmaları sözel ifade etme, ikincil kazançları sonlandırma ve kademeli motor aktivasyon.",
            pharmacologyNote: "Primer ilaç yoktur; anksiyete/depresyon varsa semptomatik tedavi uygulanır."
        },
        miniQuiz: {
            question: "Dönüşüm (Konversiyon) Bozukluğu ile Yapay Bozukluk arasındaki fark nedir?",
            options: [
                "Konversiyonda felç belirtisi bilinçdışıdır; Yapay bozuklukta ise belirtiler kasıtlı ve bilinçli olarak üretilir.",
                "Konversiyon sadece erkeklerde görülür.",
                "Yapay bozuklukta test yapılmaz.",
                "İki hastalık aynıdır."
            ],
            correctIndex: 0,
            explanation: "Konversiyonda hasta belirtiyi bilerek taklit etmez (bilinçdışıdır); yapay bozuklukta bilinçli üretilir."
        },
        differentialDiagnosis: "• MS / İnme: Nörolojik testlerle dışlanmıştır.\n• Temarruz: Adli çıkar için bilinçli taklittir.",
        dsmCriteriaSummary: "DSM-5: Motor veya duyusal işlevde değişme + Nörolojik hastalıkla bağdaşmazlık kanıtı."
    },
    {
        id: "case-013",
        caseNumber: 13,
        difficulty: "Kolay",
        course: "ADULT",
        diagnosisId: "ocd",
        category: "OCD_RELATED",
        patientSummary: "25 yaşında, kadın, kimyager",
        clues: [
            "Danışan günde 40 kez ellerini çamaşır suyuyla yıkadığını, kapı kollarına asla çıplak elle dokunamadığını ve 'mikrop kapıp anneme bulaştıracağım ve ölümüne sebep olacağım' takıntısını zihninden bir türlü atamadığını anlatıyor.",
            "Ellerini yıkama ritüelini (kompulsiyon) tam 5 kez art arda yapmadığında içindeki dehşetin geçmediğini ve bu takıntılar yüzünden günde 4-5 saatini banyoda harcadığını ifade ediyor.",
            "Bu düşüncelerin mantıksız ve aşırı olduğunu bildiğini (egodistonik yapı ve sağlam içgörü) ancak kaygıya dayanamadığı için kendini durduramadığını belirtiyor.",
            "Dermatolojik muayenede ellerde kimyasal yanıklar ve çatlaklar mevcuttur; nörolojik muayene olağandır.",
            "Ruhsal Durum Muayenesinde: Bulaşma obsesyonları, yıkama ve kontrol kompulsiyonları; belirgin anksiyete ve içsel direnç.",
            "DSM-5'e göre: Zaman alan (günde 1 saatten fazla) ya da klinik açıdan belirgin sıkıntıya/işlevsellik kaybına yol açan obsesyonlar ve kompulsiyonlar tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "mikrop kapıp anneme bulaştıracağım ... takıntısını", dsmMatch: "DSM-5 Obsesyon Kriteri" },
            { clueIndex: 1, text: "tam 5 kez art arda yapmadığında ... ritüelini", dsmMatch: "DSM-5 Kompulsiyon Kriteri" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Tepki Önleme ile Maruz Bırakma (ERP)",
            therapyDetails: "Uyarana maruz kalma ve ardından yıkama kompulsiyonunu yapmama egzersizleri.",
            pharmacologyNote: "Yüksek doz SSRI grubu antidepresanlar (Fluoksetin) ve Klomipramin altın standarttır."
        },
        miniQuiz: {
            question: "OKB tedavisinde kanıt düzeyi en yüksek olan psikoterapi yöntemi hangisidir?",
            options: [
                "Tepki Önleme ile Maruz Bırakma (ERP)",
                "Hipnoterapi",
                "Psikanalitik Rüya Analizi",
                "Aile Dizimi"
            ],
            correctIndex: 0,
            explanation: "ERP (Maruz Bırakma ve Tepkiyi Önleme), OKB'deki altın standart BDT protokolüdür."
        },
        differentialDiagnosis: "• OKKB: Egodistonik değildir; kişilik yapısıdır.\n• BDD: Sadece dış görünüşe odaklıdır.",
        dsmCriteriaSummary: "DSM-5: Obsesyonlar ve/veya Kompulsiyonlar + Günde > 1 saat zaman alma."
    },
    {
        id: "case-014",
        caseNumber: 14,
        difficulty: "Kolay",
        course: "ADULT",
        diagnosisId: "bulimia_nervosa",
        category: "EATING",
        patientSummary: "20 yaşında, kadın, üniversite öğrencisi (BKİ: 21.5 kg/m² - Normal Kilo)",
        clues: [
            "Danışan son 6 aydır haftada 3-4 kez kendini durduramayarak kısa sürede devasa porsiyonlarda pizza, pasta ve çikolatayı tıkınırcasına yediğini (binge eating); ardından kilo almaktan dehşetle korktuğu için tuvalete gidip parmağıyla kendini kusturduğunu anlatıyor.",
            "Kusmanın yanı sıra ertesi gün kilo almamak için müshil (laksatif) kullanmakta ve aç kalarak telafi etmeye çalışmaktadır.",
            "Kritik ayırt edici özellik: Hastanın beden kitle indeksi (BKİ) normal sınırlardadır (kilo kaybı zayıflık sınırında değildir).",
            "Kan tahlillerinde kusmaya bağlı hipokalemi (düşük potasyum) ve diş minesinde erozyonlar saptanmıştır.",
            "Ruhsal Durum Muayenesinde: Kendilik değerini tamamen beden ağırlığı ve vücut biçimine bağlama, yeme nöbetleri sonrası yoğun suçluluk ve utanç.",
            "DSM-5'e göre: Yineleyen tıkınırcasına yeme nöbetleri, kilo almaktan kaçınmak için yineleyen uygunsuz ödünleyici davranışlar (kusma vb.) ve bu davranışların en az 3 ay boyunca haftada en az bir kez olması tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "tıkınırcasına yediğini ... parmağıyla kendini kusturduğunu", dsmMatch: "DSM-5: Tıkınma ve uygunsuz ödünleyici davranış" },
            { clueIndex: 2, text: "beden kitle indeksi (BKİ) normal sınırlardadır", dsmMatch: "Anoreksiya'dan ayıran normal kilo kriteri" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Bilişsel Davranışçı Terapi (CBT-E)",
            therapyDetails: "Düzenli öğün planı oluşturma, beden tartılmasını sınırlandırma ve kusma döngüsünü kırma.",
            pharmacologyNote: "Yüksek doz Fluoksetin (60 mg/gün) FDA onaylı tek SSRI'dır."
        },
        miniQuiz: {
            question: "Bulimiya Nervoza ile Anoreksiya Nervoza arasındaki en belirleyici tanısal fark nedir?",
            options: [
                "Anoreksiyada kişinin kilosu belirgin derecede düşüktür (BKİ < 18.5); Bulimiyada ise hasta normal kilo aralığındadır.",
                "Bulimiyada hastalar hiç kusmaz.",
                "Anoreksiyada kilo alma korkusu yoktur.",
                "İki tanı aynıdır."
            ],
            correctIndex: 0,
            explanation: "Anoreksiya Nervoza'da belirgin düşük kilo şarttır. Bulimikler ise normal kilo sınırındadır."
        },
        differentialDiagnosis: "• Anoreksiya: Belirgin düşük kilo vardır.\n• BED: Telafi edici kusma/laksatif yoktur.",
        dsmCriteriaSummary: "DSM-5: Tıkınma nöbetleri + Uygunsuz telafi edici davranışlar (kusma vb.) + En az 3 ay haftada ≥ 1."
    },
    {
        id: "case-015",
        caseNumber: 15,
        difficulty: "Kolay",
        course: "CHILD",
        diagnosisId: "adhd",
        category: "NEURODEV",
        patientSummary: "10 yaşında, erkek, 4. sınıf öğrencisi",
        clues: [
            "Danışan, sınıfta ders sırasında yerinde oturamayıp sürekli sıraların üzerinde gezindiği, öğretmeninin sözünü kestiği, sınav sorularının yönergelerini okumadan aceleyle yanlış işaretlediği için okul rehberliği tarafından sevk ediliyor.",
            "Ödevlerini bitirmekte büyük güçlük çekmekte, kalem ve silgilerini sürekli kaybetmekte ve doğrudan kendisiyle konuşulduğunda bile dinlemiyormuş gibi görünmektedir.",
            "Bu belirtilerin hem evde hem okulda (birden fazla ortamda) 7 yaşından beri süregeldiği ve akademik başarısını ciddi şekilde düşürdüğü bildiriliyor.",
            "İşitme ve görme testleri ile nörolojik muayene tamamen normaldir.",
            "Ruhsal Durum Muayenesinde: Dikkat süresinde belirgin kısalık, motor huzursuzluk ve dürtüsellik.",
            "DSM-5'e göre: Gelişimsel düzeye uygun olmayan ve en az 6 aydır süren dikkatsizlik ve/veya hiperaktivite-dürtüsellik belirtilerinin 12 yaşından önce başlamış olması ve en az 2 farklı ortamda görülmesi tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "yerinde oturamayıp ... sözünü kestiği", dsmMatch: "DSM-5 Hiperaktivite/Dürtüsellik Kriteri" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Davranışsal Ebeveyn & Öğretmen Eğitimi + Çocuk BDT",
            therapyDetails: "Çalışma ortamını yapılandırma, ödül sistemleri ve dikkat organizasyon becerileri.",
            pharmacologyNote: "Metilfenidat (stimülan) ve Atomoksetin birinci basamaktır."
        },
        miniQuiz: {
            question: "DSM-5'e göre DEHB belirtilerinin en geç hangi yaştan önce başlamış olması şarttır?",
            options: [
                "12 yaşından önce",
                "18 yaşından önce",
                "3 yaşından önce",
                "6 yaşından önce"
            ],
            correctIndex: 0,
            explanation: "DSM-5 revizyonunda DEHB başlangıç yaşı 12 yaş öncesi olarak belirlenmiştir."
        },
        differentialDiagnosis: "• Disleksi: Spesifik okuma defisiti vardır.\n• KOKGB: Kasıtlı meydan okuma ön plandadır.",
        dsmCriteriaSummary: "DSM-5: En az 6 ay süren dikkatsizlik ve/veya hiperaktivite + 12 yaşından önce başlama + En az 2 ortamda görülme."
    },
    {
        id: "case-016",
        caseNumber: 16,
        difficulty: "Orta",
        course: "NEURO_SOMATIC",
        diagnosisId: "illness_anxiety_disorder",
        category: "SOMATIC",
        patientSummary: "36 yaşında, erkek, avukat",
        clues: [
            "Danışan son 8 aydır beyninde ölümcül bir tümör olduğuna dair yoğun bir endişe yaşamakta; vücudunda belirgin hiçbir ağrı veya felç belirtisi OLMAMASINA rağmen her gün internette beyin tümörü semptomlarını araştırmaktadır (siberkondri).",
            "3 farklı hastanede 4 kez Kranial MRG, 2 kez BT çektirmiş ve tüm sonuçların tertemiz çıkmasına rağmen hekimlerin 'tümörü gözden kaçırdığına' inanarak yeni bir nöroloğa randevu almıştır.",
            "Günde onlarca kez kollarını havaya kaldırarak dengesini ve göz bebeklerini aynada kontrol etmektedir.",
            "Tüm nörolojik ve radyolojik testler tamamen normaldir.",
            "Ruhsal Durum Muayenesinde: Hastalık kapma/olma korkusuyla aşırı zihinsel uğraş, güvence arama kompulsiyonları ve hipokondriyak kaygı.",
            "DSM-5'e göre: Ağır bir hastalığı olduğunu ya da olacağını düşünme üzerine aşırı kafa yorma; bedensel belirtilerin bulunmaması ya da çok hafif olması tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "belirgin hiçbir ağrı veya felç belirtisi OLMAMASINA rağmen", dsmMatch: "DSM-5: Bedensel belirtilerin olmaması/hafif olması" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Bilişsel Davranışçı Terapi (Sağlık Anksiyetesi)",
            therapyDetails: "Doktor alışverişini ve güvence aramayı durdurma, belirsizliğe tahammül.",
            pharmacologyNote: "SSRI grubu antidepresanlar etkilidir."
        },
        miniQuiz: {
            question: "Hastalık Kaygısı Bozukluğu ile Somatizasyon arasındaki fark nedir?",
            options: [
                "Somatizasyonda hasta gerçekten şiddetli ağrı/fiziksel belirti yaşar; Hastalık Kaygısında ise belirgin bedensel semptom yoktur, sadece 'hasta olma düşüncesi' vardır.",
                "Hastalık kaygısı sadece yaşlılarda görülür.",
                "Somatizasyonda hasta doktora gitmez.",
                "İki hastalık aynıdır."
            ],
            correctIndex: 0,
            explanation: "Hastalık kaygısında odak düşüncedir (bedensel belirti yoktur/hafiftir); Somatizasyonda ise rahatsız edici ağrılar ön plandadır."
        },
        differentialDiagnosis: "• Bedensel Belirti Bozukluğu: Somatik ağrılar vardır.\n• OKB: Takıntılar sağlıkla sınırlı değildir.",
        dsmCriteriaSummary: "DSM-5: Ağır hastalık düşüncesiyle uğraş + Bedensel belirti olmaması/hafif olması + Aşırı sağlık davranışı. Süre ≥ 6 ay."
    },
    {
        id: "case-017",
        caseNumber: 17,
        difficulty: "Zor",
        course: "NEURO_SOMATIC",
        diagnosisId: "did",
        category: "DISSOCIATIVE",
        patientSummary: "28 yaşında, kadın, ressam",
        clues: [
            "Danışan, evinde daha önce hiç görmediği kıyafetler bulduğunu, gardırobunda tanımadığı bir el yazısıyla yazılmış tehditkar notlar olduğunu ve gün içinde saatlerce süren 'zaman kayıpları' (blackout) yaşadığını anlatıyor.",
            "Terapistle görüşürken ses tonu, mimikleri ve oturuşu aniden değişerek kendini 7 yaşında 'Cemre' adında küçük bir kız çocuğu olarak tanıtmış, 10 dakika sonra ise sert ve erkeksi bir ses tonuyla 'Kaan' adında koruyucu bir kimliğe bürünmüştür.",
            "Çocukluk öyküsünde 4-10 yaşları arasında ağır, kronik ve tekrarlayan fiziksel ve cinsel istismar geçmişi doğrulanmıştır.",
            "EEG ve kranial MRG temizdir; temporal lob epilepsisi ve madde kullanımı dışlanmıştır.",
            "Ruhsal Durum Muayenesinde: İki ya da daha fazla ayrı kişilik durumu (alter kimlikler), kimlikler arası amnezi ve dissosiyatif füg epizotları.",
            "DSM-5'e göre: İki ya da daha fazla ayrı kişilik durumuyla belirlenen kimlik bölünmesi ve önemli kişisel bilgileri anımsamada yineleyen boşluklar mevcuttur."
        ],
        symptomHighlights: [
            { clueIndex: 1, text: "kendini 7 yaşında 'Cemre' ... 'Kaan' adında koruyucu bir kimliğe", dsmMatch: "DSM-5: İki veya daha fazla ayrı kişilik durumu" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Faz Odaklı Travma Terapisi (Klüft Modeli)",
            therapyDetails: "1. Güvenlik, 2. Travma işleme, 3. Alter kimliklerin entegrasyonu (bütünleşme).",
            pharmacologyNote: "Eşlik eden TSSB ve depresyon için SSRI kullanılır."
        },
        miniQuiz: {
            question: "Dissosiyatif Kimlik Bozukluğunun etiyolojisinde en sık rol oynayan faktör nedir?",
            options: [
                "Erken çocukluk döneminde yaşanan ağır, süreğen fiziksel/cinsel istismar",
                "Sadece kromozom anomalisi",
                "Yetişkinlikte iş kaybı",
                "Vitamin eksikliği"
            ],
            correctIndex: 0,
            explanation: "DKB, ağır ve kaçılamaz travmalara karşı zihnin bölündüğü aşırı bir savunma mekanizmasıdır."
        },
        differentialDiagnosis: "• Şizofreni: Şizofrenide sanrı/varsanı vardır; burada alter kimlikler vardır.\n• BPD: Alter kimlikler görülmez.",
        dsmCriteriaSummary: "DSM-5: İki veya daha fazla ayrı kişilik durumu + Kişisel bilgileri hatırlamada amnezi boşlukları."
    },
    {
        id: "case-018",
        caseNumber: 18,
        difficulty: "Kolay",
        course: "ADULT",
        diagnosisId: "anorexia_nervosa",
        category: "EATING",
        patientSummary: "17 yaşında, kadın, lise öğrencisi (BKİ: 14.8 kg/m² - Ağır Düşük Kilo)",
        clues: [
            "Danışan 1.68 boyunda ve 42 kilo olmasına rağmen aynaya baktığında 'kendisini aşırı şişman, göbeğini devasa ve bacaklarını kalın' gördüğünü söyleyerek daha fazla zayıflamak için günde sadece yarım elma ve su ile beslenmektedir.",
            "Son 8 ayda 20 kilo vermiş, kilo almaktan ve yağlanmaktan ölesiye korktuğunu ifade etmektedir.",
            "Aşırı kilo kaybına bağlı olarak 5 aydır adet görememekte (amenore), vücudunda ince tüylenmeler (lanugo) başlamış ve nabzı 48 bpm'ye (bradikardi) düşmüştür.",
            "Tıbbi değerlendirmede ağır malnütrisyon, hipotermi ve elektrolit dengesizliği nedeniyle acil servise sevk edilmiştir.",
            "Ruhsal Durum Muayenesinde: Beden imgesinde ağır çarpıtma, düşük kilonun getirdiği hayati tehlikeyi inkar etme ve katı yeme kısıtlamaları.",
            "DSM-5'e göre: Gereksinimlere göre enerji alımını kısıtlama sonucu belirgin derecede düşük bir vücut ağırlığına sahip olma; kilo almaktan aşırı korkma ve beden ağırlığını algılamada bozukluk mevcuttur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "42 kilo olmasına rağmen ... kendisini aşırı şişman ... gördüğünü", dsmMatch: "DSM-5: Beden ağırlığını algılamada bozukluk" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Aile Temelli Terapi (FBT / Maudsley) & BDT",
            therapyDetails: "Önce kilo kazanımı ve medikal stabilizasyon; ardından yeme korkularını çalışma.",
            pharmacologyNote: "Düşük doz Olanzapin kilo alımına ve dirençli anksiyeteyi azaltmaya yardımcı olabilir."
        },
        miniQuiz: {
            question: "Anoreksiya Nervoza'da hastanın vücudunda ortaya çıkan ince tüylenmeye ne ad verilir?",
            options: [
                "Lanugo tüyleri",
                "Alopesi",
                "Eritem",
                "Koprolali"
            ],
            correctIndex: 0,
            explanation: "Ağır kilo kaybında vücut ısı dengesini korumak için 'lanugo' adı verilen ince tüyler geliştirir."
        },
        differentialDiagnosis: "• Bulimiya: Kilo normaldir; Anoreksiyada belirgin düşük kilo şarttır.\n• Depresyon: Beden imge bozukluğu yoktur.",
        dsmCriteriaSummary: "DSM-5: Enerji kısıtlaması ile belirgin düşük kilo (BKİ < 18.5) + Kilo almaktan aşırı korkma + Beden imgesi bozukluğu."
    },
    {
        id: "case-019",
        caseNumber: 19,
        difficulty: "Kolay",
        course: "ADULT",
        diagnosisId: "specific_phobia",
        category: "ANXIETY",
        patientSummary: "27 yaşında, erkek, inşaat mühendisi",
        clues: [
            "Danışan çocukluğundan beri köpek gördüğünde (en ufak bir süs köpeği dahil) kalbinin yerinden çıkacak gibi çarptığını, nefesinin kesildiğini ve dehşet içinde ağaçlara tırmandığını veya yola atladığını anlatıyor.",
            "Bu korku yüzünden sokakta yürüyememekte, arkadaşlarının evine gitmeden önce evde köpek olup olmadığını sorgulamakta ve parklardan tamamen kaçınmaktadır.",
            "Köpek dışındaki hiçbir nesne, ortam veya sosyal durumdan korkmamaktadır.",
            "Tıbbi değerlendirmeler tamamen temizdir.",
            "Ruhsal Durum Muayenesinde: Tek bir özgül uyarana karşı orantısız, aşırı ve akıldışı korku ve kaçınma reaksiyonu.",
            "DSM-5'e göre: Özgül bir nesne ya da durumla (hayvan, yükseklik vb.) ilgili olarak belirgin bir korku ya da kaygı duyma (en az 6 ay) tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "köpek gördüğünde ... dehşet içinde", dsmMatch: "DSM-5 Özgül Fobi Kriteri (Hayvan Tipi)" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Kademeli Canlı Maruz Bırakma (In-Vivo Exposure)",
            therapyDetails: "Köpek fotoğrafları, videoları ve canlı temas hiyerarşisiyle duyarsızlaştırma.",
            pharmacologyNote: "Genellikle ilaç tedavisi gerekmez."
        },
        miniQuiz: {
            question: "Özgül Fobilerin tedavisinde başarı oranı en yüksek yöntem hangisidir?",
            options: [
                "Kademeli Canlı Maruz Bırakma (In-Vivo Exposure)",
                "Diyalektik Davranış Terapisi",
                "Serbest Çağrışım",
                "Elektroşok Tedavisi"
            ],
            correctIndex: 0,
            explanation: "Özgül fobilerde kademeli maruz bırakma en hızlı iyileşmeyi sağlayan altın standart yöntemdir."
        },
        differentialDiagnosis: "• Agorafobi: En az iki farklı alanda kaçamama korkusudur.\n• Panik Bozukluk: Spontane ataklar vardır.",
        dsmCriteriaSummary: "DSM-5: Özgül nesneye karşı orantısız korku ve kaçınma. Süre ≥ 6 ay."
    },
    {
        id: "case-020",
        caseNumber: 20,
        difficulty: "Orta",
        course: "ADULT",
        diagnosisId: "avoidant_pd",
        category: "PERSONALITY_C",
        patientSummary: "32 yaşında, kadın, kütüphane görevlisi",
        clues: [
            "Danışan, tüm hayatı boyunca insanlarla derin bağlar kurmayı ve arkadaş edinmeyi çok arzuladığını ancak 'yetersiz, çirkin ve sıkıcı' olduğuna inandığı için reddedilme ve alay edilme korkusuyla insanlardan tamamen uzak durduğunu anlatıyor.",
            "İş yerinde terfi teklif edildiğinde yeni insanlarla tanışması gerekeceği korkusuyla teklifi reddetmiş, yalnız çalışabileceği kütüphane arşivine geçmiştir.",
            "Kendisini eleştirilmekten korumak için sevilip kabul edileceğinden kesin emin olmadıkça kimseyle ilişki başlatamamaktadır.",
            "Genel biyokimyasal testler ve nörolojik muayene olağandır.",
            "Ruhsal Durum Muayenesinde: Yaygın toplumsal çekingenlik, yetersizlik duyguları ve olumsuz değerlendirilmeye karşı aşırı duyarlılık örüntüsü.",
            "DSM-5'e göre: Erken erişkinlikte başlayan toplumsal ketlenme, yetersizlik duyguları ve olumsuz değerlendirilmeye aşırı duyarlılık örüntüsüdür."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "arkadaş edinmeyi çok arzuladığını ancak ... uzak durduğunu", dsmMatch: "DSM-5: Yakınlık arzulamasına rağmen reddedilme korkusuyla kaçınma" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Bilişsel Davranışçı Terapi & Şema Terapi",
            therapyDetails: "'Kusurluluk' ve 'Sosyal İzolasyon' şemalarını esnetme, sosyal beceri geliştirme.",
            pharmacologyNote: "Yoğun sosyal anksiyete için SSRI eklenebilir."
        },
        miniQuiz: {
            question: "Kaçıngan Kişilik ile Şizoid Kişilik arasındaki temel fark nedir?",
            options: [
                "Kaçıngan kişi ilişkiyi çok ister ama reddedilmekten korkar; Şizoid ise ilişki kurmayı hiç istemez.",
                "Şizoid hastalar sürekli ağlar.",
                "Kaçıngan hastalar insanlara saldırır.",
                "İki hastalık aynıdır."
            ],
            correctIndex: 0,
            explanation: "Şizoid yalnızlığı tercih eder ve ilişki istemez. Kaçıngan ise yakınlık ister ama reddedilme korkusuyla kaçınır."
        },
        differentialDiagnosis: "• Şizoid KB: İlişki arzusu yoktur.\n• Sosyal Anksiyete: Kaçıngan KB daha yaygın ve derin bir kişilik yapısıdır.",
        dsmCriteriaSummary: "DSM-5: Eleştirilme korkusuyla kaçınma, sevileceğinden emin olmadıkça ilişkiye girmeme, yetersizlik duygusu (en az 4/7)."
    },
    {
        id: "case-021",
        caseNumber: 21,
        difficulty: "Orta",
        course: "ADULT",
        diagnosisId: "delusional_disorder",
        category: "PSYCHOTIC",
        patientSummary: "52 yaşında, kadın, emekli memur",
        clues: [
            "Danışan son 1.5 yıldır üst komşusunun gece uyurken havalandırma boşluğundan evine kokusuz bir zehirli gaz sıktığını ve kendisini yavaş yavaş zehirlemeye çalıştığını iddia ederek polis ve savcılığa onlarca dilekçe vermiştir.",
            "Önemli klinik özellik: Bu sabit perseküsyon inancı dışında hastanın giyimi, konuşması, mantıksal muhakemesi, genel hijyeni ve günlük işlevselliği TAMAMEN KORUNMUŞTUR; Şizofrenideki gibi dezorganizasyon veya halüsinasyonlar yoktur.",
            "Evinin duvarlarına yalıtım süngerleri kaplatmış, gaz maskeleri satın almış ancak bunun dışındaki sosyal yaşamında gayet kibar ve düzenli bir profil çizmektedir.",
            "Beyin MRG ve toksikoloji testleri temizdir.",
            "Ruhsal Durum Muayenesinde: Mantıksal olarak kurgulanmış, sarsılmaz, kapsüllenmiş persekütuar sanrı. Negatif belirti veya düşünce dağınıklığı yoktur.",
            "DSM-5'e göre: En az 1 ay süren bir (ya da daha çok) sanrının varlığı ve Şizofreninin A ölçütünün hiçbir zaman karşılanmamış olması tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 1, text: "günlük işlevselliği TAMAMEN KORUNMUŞTUR", dsmMatch: "DSM-5: Sanrı dışındaki alanlarda işlevselliğin korunması" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Destekleyici Psikoterapi & CBTp",
            therapyDetails: "Sanrıyla doğrudan tartışmadan güven bağı kurma, hezeyanın yol açtığı stresi hafifletme.",
            pharmacologyNote: "İkinci kuşak antipsikotikler (Aripiprazol, Risperidon) tercih edilir."
        },
        miniQuiz: {
            question: "Sanrılı Bozukluk ile Şizofreni arasındaki en temel ayırt edici özellik nedir?",
            options: [
                "Sanrılı Bozuklukta sanrı dışında işlevsellik ve kişilik korunmuştur; belirgin halüsinasyon veya dezorganizasyon görülmez.",
                "Sanrılı bozukluk sadece 2 gün sürer.",
                "Şizofrenide sanrı görülmez.",
                "Sanrılı bozukluk hastaları konuşamaz."
            ],
            correctIndex: 0,
            explanation: "Sanrılı bozuklukta sanrı kapsüllenmiştir; kişinin sanrı konusu dışındaki düşünce akışı ve bakımı tamdır."
        },
        differentialDiagnosis: "• Şizofreni: Varsanılar ve dezorganizasyon vardır.\n• Paranoid KB: Sabit tek bir sanrı yerine genel kuşkuculuk vardır.",
        dsmCriteriaSummary: "DSM-5: En az 1 ay süren sanrılar + Şizofreni A ölçütünün olmaması + İşlevselliğin korunması."
    },
    {
        id: "case-022",
        caseNumber: 22,
        difficulty: "Orta",
        course: "ADULT",
        diagnosisId: "schizoid_pd",
        category: "PERSONALITY_A",
        patientSummary: "41 yaşında, erkek, gece bekçisi",
        clues: [
            "Danışan tüm hayatı boyunca tek bir yakın arkadaş edinmediğini, ailesiyle bile görüşmek istemediğini ve gece tek başına kimsenin olmadığı bir depoda bekçilik yapmaktan büyük bir huzur duyduğunu anlatıyor.",
            "Ne başkalarının övgülerinden ne de eleştirilerinden en ufak bir şekilde etkilenmemekte, yalnız olmaktan derin bir doyum aldığını ve cinsellikle veya romantik ilişkilerle hiçbir ilgisinin olmadığını belirtiyor.",
            "Konuşurken yüz ifadesi tamamen donuk, duygulanımı düzdür; ancak şizotipaldeki gibi tuhaf büyüsel düşünceleri veya hezeyanları KESİNLİKLE yoktur.",
            "Tıbbi ve nörolojik incelemeler olağandır.",
            "Ruhsal Durum Muayenesinde: Sosyal ilişkilerden tamamen kopma, kısıtlı duygusal dışavurum, anhedoni ve yalnızlığı aktif tercih etme.",
            "DSM-5'e göre: Erken erişkinlikte başlayan, toplumsal ilişkilerden kopma ve kişilerarası ortamlarda duyguların kısıtlı gösterilmesi örüntüsüdür."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "bekçilik yapmaktan büyük bir huzur duyduğunu", dsmMatch: "DSM-5: Yakın ilişki istememe ve tekil etkinlikleri yeğleme" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Destekleyici Terapi",
            therapyDetails: "Hastayı sosyalleşmeye zorlamadan yaşamını sürdürebileceği asgari iletişim becerilerini koruma.",
            pharmacologyNote: "Genellikle ilaç tedavisi endike değildir."
        },
        miniQuiz: {
            question: "Şizoid Kişilik Bozukluğu olan bir bireyin temel özelliği nedir?",
            options: [
                "Yalnızlığı içtenlikle tercih eder ve yakın ilişki arzulamaz.",
                "Sürekli parti düzenler.",
                "İnsanlara saldırır.",
                "Büyüsel güçlere inanır."
            ],
            correctIndex: 0,
            explanation: "Şizoid birey yalnızlıktan memnundur ve yakın ilişki kurma isteği duymaz."
        },
        differentialDiagnosis: "• Kaçıngan KB: Yakınlık ister ama korkar.\n• Şizotipal KB: Büyüsel düşünceler vardır.",
        dsmCriteriaSummary: "DSM-5: Yakın ilişki istememe, tekil etkinlikleri yeğleme, övgü/yergiye aldırmama, duygusal soğukluk (en az 4/7)."
    },
    {
        id: "case-023",
        caseNumber: 23,
        difficulty: "Orta",
        course: "ADULT",
        diagnosisId: "dysthymia",
        category: "MOOD",
        patientSummary: "35 yaşında, kadın, memur",
        clues: [
            "Danışan son 4 yıldır kendisini 'sürekli neşesiz, kronik olarak yorgun, özgüvensiz ve hayata karşı karamsar' hissettiğini, 'Ben kendimi bildim bileli böyle mutsuzum' dediğini anlatıyor.",
            "Bu 4 yıllık süre zarfında kendini iyi ve neşeli hissettiği aralıkların hiçbir zaman 2 ayı geçmediği belirtiliyor.",
            "İşine gidip gelmekte ancak hayatı sadece 'otomatik bir yük' gibi sürdürmektedir; ağır bir majör depresyondaki gibi yatalak kalma veya psikotik bir hezeyan tablosu yoktur.",
            "Tiroid ve anemi testleri normal sınırlardadır.",
            "Ruhsal Durum Muayenesinde: Kronik düşük duygudurum (distimi), düşük benlik saygısı ve enerji düşüklüğü.",
            "DSM-5'e göre: En az 2 yıl boyunca günün çoğunda çökkün duygudurum ve en az 2 ek depresif belirti bulunması tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "son 4 yıldır kendisini 'sürekli neşesiz", dsmMatch: "DSM-5: En az 2 yıl boyunca süren çökkün duygudurum" }
        ],
        treatmentModality: {
            goldStandardTherapy: "CBASP & BDT",
            therapyDetails: "Kişilerarası problem çözme, durumsal analiz ve davranışsal aktivasyon.",
            pharmacologyNote: "SSRI grubu antidepresanlar etkilidir."
        },
        miniQuiz: {
            question: "Distimi tanısı için belirtilerin erişkinlerde en az kaç yıl sürmesi şarttır?",
            options: [
                "En az 2 yıl",
                "En az 6 ay",
                "En az 1 ay",
                "En az 5 yıl"
            ],
            correctIndex: 0,
            explanation: "Erişkinlerde Distimi tanısı için sürenin en az 2 yıl olması şarttır."
        },
        differentialDiagnosis: "• Majör Depresyon: Episodiktir ve en az 2 hafta sürer.\n• Uyum Bozukluğu: Stresörle sınırlıdır.",
        dsmCriteriaSummary: "DSM-5: En az 2 yıl süren çökkün duygudurum + En az 2 belirti + 2 aydan uzun iyilik olmaması."
    },
    {
        id: "case-024",
        caseNumber: 24,
        difficulty: "Zor",
        course: "NEURO_SOMATIC",
        diagnosisId: "factitious_disorder",
        category: "SOMATIC",
        patientSummary: "31 yaşında, kadın, eski hemşire",
        clues: [
            "Danışan son 2 yılda 18 farklı hastanede 'geçmeyen açıklanamayan yüksek ateş, kanlı idrar ve karın ağrısı' şikayetleriyle yatırılmış ve 3 kez gereksiz yere laparoskopi ameliyatına alınmıştır.",
            "Hemşire odasında gizlice kendi idrarına kan damlattığı ve ateşini yükseltmek için kendine bakteri kültürü enjekte ettiği hastane personeli tarafından fark edilmiştir.",
            "Kritik ayırıcı özellik: Hastanın bu eylemleri yaparken hiçbir 'maddi kazanç, tazminat, nafaka veya cezaevinden kaçma (dışsal ödül)' amacı YOKTUR; tek motivasyonu 'hasta rolü üstlenmek ve hekimlerin ilgisini çekmektir'.",
            "Toksikoloji ve laboratuvar incelemelerinde semptomların yapay olarak üretildiği kanıtlanmıştır.",
            "Ruhsal Durum Muayenesinde: Hasta rolünü benimseme, hastane bağımlılığı ve tıbbi manipülasyon (Münchausen tablosu).",
            "DSM-5'e göre: Belirlenebilir bir dış ödül olmaksızın, fiziksel ya da psikolojik belirti ve bulguları bilerek uydurma ya da yapay olarak ortaya çıkarma tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 2, text: "hiçbir 'maddi kazanç, tazminat ... amacı YOKTUR", dsmMatch: "DSM-5: Belirgin bir dış ödülün olmaması" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Destekleyici Psikoterapi",
            therapyDetails: "Gereksiz invaziv tıbbi işlemleri durdurma, koordinasyon sağlama.",
            pharmacologyNote: "Primer farmakoterapisi yoktur."
        },
        miniQuiz: {
            question: "Yapay Bozukluk (Münchausen) ile Temarruz arasındaki temel fark nedir?",
            options: [
                "Temarruzda belirgin dışsal kazanç (para/tazminat) vardır; Yapay Bozuklukta dış kazanç yoktur, amaç 'hasta rolü' almaktır.",
                "Yapay bozukluk sadece çocuklarda görülür.",
                "Temarruzda hasta gerçekten felç kalır.",
                "İki durum aynıdır."
            ],
            correctIndex: 0,
            explanation: "Yapay bozuklukta maddi çıkar yoktur (amaç hasta rolüdür). Temarruzda ise maddi kazanç için numara yapılır."
        },
        differentialDiagnosis: "• Temarruz: Maddi çıkar vardır.\n• Konversiyon: Belirtiler bilinçdışıdır.",
        dsmCriteriaSummary: "DSM-5: Belirtileri bilerek uydurma + Kendini hasta gösterme + Dış ödül olmaması."
    },
    {
        id: "case-025",
        caseNumber: 25,
        difficulty: "Orta",
        course: "ADULT",
        diagnosisId: "bdd",
        category: "OCD_RELATED",
        patientSummary: "24 yaşında, erkek, model adayı",
        clues: [
            "Danışan burnunun 'eğri, devasa ve ucube gibi' olduğuna inanarak son 3 yılda 4 farklı plastik cerraha burun ameliyatı (rinoplasti) olmuş; ancak hiçbir cerrahi sonucu beğenmeyerek 'Burnum yüzünden insan içine çıkamıyorum' demektedir.",
            "Objektif olarak bakıldığında burnunda başkaları tarafından neredeyse hiç fark edilmeyen milimetrik bir kıkırdak asimetrisi dışında hiçbir belirgin kusur yoktur.",
            "Günde 4 saatten fazla aynada burnunu incelemekte, burnunu kapatmak için sürekli maske ve güneş gözlüğü takmakta ve kameralardan kaçmaktadır.",
            "Genel biyokimyasal değerlendirme normaldir.",
            "Ruhsal Durum Muayenesinde: Beden algısında aşırı zihinsel uğraş, ayna kompulsiyonları ve kusur odaklı içgörü kaybı.",
            "DSM-5'e göre: Dış görünümünde başkalarınca gözle görülmeyen ya da önemsenmeyecek bir ya da birden fazla kusur algılama üzerine aşırı kafa yorma ve yineleyici davranışlar tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 1, text: "başkaları tarafından neredeyse hiç fark edilmeyen", dsmMatch: "DSM-5: Başkalarınca görülmeyen kusur algısı" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Bilişsel Davranışçı Terapi (BDD)",
            therapyDetails: "Ayna kontrolünü sınırlandırma, kusur inançlarını yeniden yapılandırma.",
            pharmacologyNote: "Yüksek doz SSRI grubu antidepresanlar etkilidir."
        },
        miniQuiz: {
            question: "BDD hastalarına estetik ameliyat yapılması neden önerilmez?",
            options: [
                "Sorun burunda değil beyindeki beden algısı işlemlenmesindedir; estetik ameliyat sonrası hastalar memnun kalmaz ve kaygıları artar.",
                "Estetik cerrahi BDD hastalarında yasaktır.",
                "Cerrahi sonrası hafıza silinir.",
                "BDD sadece göz ameliyatıyla düzelir."
            ],
            correctIndex: 0,
            explanation: "BDD algısal bir bozukluktur; ameliyatlar kusur algısını düzeltmez."
        },
        differentialDiagnosis: "• Anoreksiya: Odak kilodur.\n• OKB: Takıntılar görünümle sınırlı değildir.",
        dsmCriteriaSummary: "DSM-5: Görünümde hayali/küçük kusurlarla uğraş + Yineleyici davranışlar (ayna kontrolü)."
    }
];

const cases26to29 = [
    {
        id: "case-026",
        caseNumber: 26,
        difficulty: "Orta",
        course: "CHILD",
        diagnosisId: "odd",
        category: "IMPULSE",
        patientSummary: "9 yaşında, erkek, 3. sınıf öğrencisi",
        clues: [
            "Danışan, ailesi ve sınıf öğretmeni tarafından 'otorite figürlerine karşı sürekli inatlaşan, en ufak kuralda öfke patlaması yaşayan ve arkadaşlarıyla kasıtlı olarak dalga geçip onları çileden çıkaran' davranışları nedeniyle getiriliyor.",
            "Bu öfkeli ve tartışmacı davranış örüntüsünün son 8 aydır haftada en az birkaç kez hem evde hem okulda sergilendiği belirtiliyor.",
            "Kendi yaptığı hataları veya kırıp döktüğü şeyleri asla kabul etmemekte, sürekli 'O başlattı, suçlu onlar' diyerek başkalarını suçlamaktadır.",
            "Önemli ayırıcı klinik bulgu: Çocuğun fiziksel şiddet uygulama, hayvanlara işkence etme, yangın çıkarma, hırsızlık yapma veya başkalarının temel haklarını gasp etme gibi ağır suç/saldırganlık davranışları KESİNLİKLE yoktur.",
            "Ruhsal Durum Muayenesinde: Alıngan, kolayca içerleyen ve kin tutucu tutum; kurallara direnme ve otoriteye karşı 'Bunu bana yaptıramazsınız' tarzı meydan okuyucu bilişsel şemalar.",
            "DSM-5'e göre: En az bir kardeşi dışındaki en az bir kişiyle etkileşiminde ortaya çıkan, en az 6 ay süren öfkeli/kolay kızan duygudurum, tartışmacı/meydan okuyan davranış veya kin besleme örüntüsü mevcuttur."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "otorite figürlerine karşı sürekli inatlaşan", dsmMatch: "DSM-5: Otoriteyle tartışmaya girme" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Ebeveyn Yönetim Eğitimi (PMT)",
            therapyDetails: "Pozitif pekiştirme, tutarlı sınırlar koyma, problem çözme becerileri.",
            pharmacologyNote: "Eşlik eden DEHB varsa uyarıcı medikasyon eklenebilir."
        },
        miniQuiz: {
            question: "KOKGB ile Davranım Bozukluğu arasındaki en kritik fark nedir?",
            options: [
                "KOKGB'de sözel inatlaşma vardır; Davranım Bozukluğunda ise şiddet, hırsızlık, hayvanlara eziyet gibi ağır hak ihlalleri bulunur.",
                "KOKGB sadece yetişkinlerde görülür.",
                "Davranım bozukluğunda çocuk öfkelenmez.",
                "KOKGB'de zeka geriliği zorunludur."
            ],
            correctIndex: 0,
            explanation: "KOKGB inatçı bir tutumla sınırlıdır; Davranım Bozukluğunda ise yasal sınırları aşan ağır hak ihlalleri yer alır."
        },
        differentialDiagnosis: "• Davranım Bozukluğu: Ağır suç ve hak ihlalleri vardır.\n• DEHB: Kural ihlali dikkatsizliktendir.",
        dsmCriteriaSummary: "DSM-5: Öfkeli duygudurum + Tartışmacı davranış + Kin besleme örüntüsü (en az 4 belirti)."
    },
    {
        id: "case-027",
        caseNumber: 27,
        difficulty: "Orta",
        course: "CHILD",
        diagnosisId: "selective_mutism",
        category: "ANXIETY",
        patientSummary: "6 yaşında, kız, ilkokul 1. sınıf öğrencisi",
        clues: [
            "Danışan, evinde ailesi ve kardeşleriyle gayet akıcı, neşeli ve kesintisiz konuşmasına rağmen; ilkokula başladığı günden beri sınıfta öğretmenine ve arkadaşlarına tek bir kelime dahi söylemediği için rehberlik servisi tarafından yönlendiriliyor.",
            "Okulda soru sorulduğunda başını öne eğmekte, donakalmakta veya sadece başını hafifçe sallayarak işaret diliyle iletişim kurmaya çalışmaktadır.",
            "Bu durumun okula başladığı ilk ayı geçip 5 aydır kesintisiz devam ettiği ve çocuğun derslerdeki akademik değerlendirmesini imkansız hale getirdiği bildiriliyor.",
            "İşitme testleri, KBB muayenesi ve gelişimsel dil/konuşma değerlendirmeleri tamamen normaldir; çocuğun anlama ve konuşma becerisi yaş düzeyine uygundur.",
            "Ruhsal Durum Muayenesinde: Ev videoları izlendiğinde şarkı söyleyen, espriler yapan bir çocuk görülürken; klinik ortamda terapistle tek kelime konuşamadığı, yoğun anksiyete ve sosyal kaygı yaşadığı tespit edilmiştir.",
            "DSM-5'e göre: Konuşmasının beklendiği özgül toplumsal durumlarda (örn. okulda) sürekli bir konuşamama hali ve bu durumun başka durumlarda konuşuyor olmasına rağmen var olması kriteri karşılanmaktadır."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "evinde ailesi ve kardeşleriyle gayet akıcı ... konuşmasına rağmen", dsmMatch: "DSM-5: Başka durumlarda konuşuyor olma" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Davranışçı Terapi (Uyaran Kaydırma / Stimulus Fading)",
            therapyDetails: "Konuşulan kişiyle başlayıp ortama öğretmeni kademeli dahil etme.",
            pharmacologyNote: "Ağır vakalarda SSRI grubu anksiyolitik eklenebilir."
        },
        miniQuiz: {
            question: "Seçici Konuşmazlık tanısı için okulun ilk ayında konuşamama neden yeterli değildir?",
            options: [
                "Çünkü okula başlama dönemindeki ilk 1 ay normal oryantasyon sürecidir; süre en az 1 ayı aşmalıdır.",
                "Çocukların ilkokulda konuşması yasaktır.",
                "Bu bozukluk 18 yaşından sonra başlar.",
                "Çocuk evde de konuşmuyorsa tanı konur."
            ],
            correctIndex: 0,
            explanation: "Okulun ilk ayı normal çekingenlik olabileceğinden, süre en az 1 ayı (ilk ay hariç) aşmalıdır."
        },
        differentialDiagnosis: "• Otizm: Otizmde genel sosyal iletişim bozukluğu vardır.\n• Dil Bozukluğu: Dil yetisi tamdır.",
        dsmCriteriaSummary: "DSM-5: Beklenen durumlarda konuşamama + Başka ortamlarda konuşma + Süre ≥ 1 ay (ilk ay hariç)."
    },
    {
        id: "case-028",
        caseNumber: 28,
        difficulty: "Zor",
        course: "FORENSIC",
        diagnosisId: "kleptomania",
        category: "IMPULSE",
        patientSummary: "33 yaşında, kadın, varlıklı iş kadını",
        clues: [
            "Danışan, lüks bir mağazadan değeri sadece 50 TL olan ucuz bir tokayı çantasının içine atarken güvenlik kameraları tarafından yakalanmış ve savcılık kararıyla adli psikiyatrik değerlendirmeye sevk edilmiştir.",
            "Banka hesabında milyonlarca lira bakiye bulunmasına ve çaldığı nesneye hiçbir kişisel kullanım ihtiyacı olmamasına rağmen, eşyayı almadan hemen önce içinde karşı konulamaz bir gerginlik hissettiğini ifade ediyor.",
            "Hırsızlık eylemini gerçekleştirdiği o saniyede yoğun bir haz, doyum ve rahatlama yaşadığını, ancak mağazadan çıkar çıkmaz derin bir suçluluk ve pişmanlık duyarak çaldığı eşyaları evinde bir kutuya kilitleyip hiç kullanmadığını anlatıyor.",
            "Eylemin intikam alma, öfke çıkarma veya bir hezeyanın gereği olarak yapılmadığı; organize bir suç çetesinin parçası olmadığı tespit edilmiştir.",
            "Ruhsal Durum Muayenesinde: Dürtü denetiminde epizodik çöküş, eylem öncesi artan gerginlik ve eylem anında rahatlama döngüsü; belirgin anksiyete ve utanç duygulanımı.",
            "DSM-5'e göre: Kişisel kullanım ya da parasal değeri için gereksinilmeyen nesneleri çalmaya yönelik dürtülere karşı koymada yineleyen bir başarısızlık tablosudur."
        ],
        symptomHighlights: [
            { clueIndex: 1, text: "parasal değeri için gereksinilmeyen ... hiçbir kişisel kullanım ihtiyacı olmamasına rağmen", dsmMatch: "DSM-5: Gereksinilmeyen nesneleri çalma dürtüsü" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Bilişsel Davranışçı Terapi (Gizli Duyarsızlaştırma)",
            therapyDetails: "Dürtü anında çalma eylemini olumsuz sonuçlarla eşleştirme, dürtü dalgalanmasını karşılama.",
            pharmacologyNote: "Naltrekson dürtüsel hazzı bloke etmede etkilidir."
        },
        miniQuiz: {
            question: "Adli psikolojide Kleptomani ile Adi Hırsızlık arasındaki temel fark nedir?",
            options: [
                "Adi hırsızlıkta maddi kazanç vardır; Kleptomanide ise nesnenin değeri önemsizdir, amaç gerginliği dindirmektir.",
                "Kleptomanide hasta sadece gece hırsızlık yapar.",
                "Adi hırsızlar asla ceza almaz.",
                "Kleptomani sadece çocuklukta görülür."
            ],
            correctIndex: 0,
            explanation: "Adi hırsızlık planlı ve maddi kazanç odaklıdır. Kleptomani ise gerginliği boşaltma odaklı dürtüsel bir bozukluktur."
        },
        differentialDiagnosis: "• Adi Hırsızlık: Maddi kazanç vardır.\n• Antisosyal KB: Çalma genel kural tanımazlığın parçasıdır.",
        dsmCriteriaSummary: "DSM-5: Gereksinilmeyen nesneleri çalma dürtüsü + Eylem öncesi gerginlik + Eylem anında haz/rahatlama."
    },
    {
        id: "case-029",
        caseNumber: 29,
        difficulty: "İleri Düzey",
        course: "COMORBID",
        diagnosisId: "mdd",
        secondaryDiagnosisId: "social_anxiety",
        category: "MOOD",
        patientSummary: "26 yaşında, erkek, yazılım test uzmanı (Çift Tanılı / Komorbid Vaka 🔗)",
        clues: [
            "Danışan son 2 aydır derin bir mutsuzluk, yataktan çıkamama, 7 kilo verme ve 'hayatın hiçbir anlamı kalmadığı' düşünceleriyle başvuruyor; ancak ayrıntılı öyküde lise yıllarından beri insanların önünde konuşmaktan, yemek yemekten dehşetle kaçındığı öğreniliyor.",
            "Son 8 haftadır çökkün duygudurum neredeyse her gün sürmekte ve konsantrasyon kaybı nedeniyle işini kaybetme noktasına gelmiş durumdadır (1. Tanı).",
            "Geçmiş öyküsünde ise yıllardır toplantılarda yüzü kızaracak diye terlediği, garsona sipariş veremediği ve sosyal ortamlardan dışlandığı için giderek yalnızlaşıp bu depresif döngüye girdiği anlatılıyor (2. Eşlik Eden Tanı).",
            "Tiroid ve rutin biyokimya testleri temizdir; organik bir etiyoloji saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Psikomotor yavaşlama ve derin kederin yanı sıra, terapistin gözlerine bakarken yoğun yüz kızarması ve rezil olma kaygısı (olumsuz değerlendirilme korkusu) eşzamanlı gözleniyor.",
            "DSM-5'e göre: Vaka hem Majör Depresif Bozukluk kriterlerini (en az 2 haftalık epizod) hem de altta yatan Sosyal Anksiyete Bozukluğu (Sosyal Fobi) kriterlerini tam olarak karşılamaktadır."
        ],
        symptomHighlights: [
            { clueIndex: 0, text: "derin bir mutsuzluk, yataktan çıkamama, 7 kilo verme", dsmMatch: "1. Tanı: Majör Depresif Bozukluk" },
            { clueIndex: 2, text: "yüzü kızaracak diye terlediği ... sosyal ortamlardan kaçındığı", dsmMatch: "2. Tanı: Sosyal Anksiyete Bozukluğu" }
        ],
        treatmentModality: {
            goldStandardTherapy: "Kombine BDT",
            therapyDetails: "Önce Davranışsal Aktivasyon; ardından Sosyal Fobi için video geribildirimi ve maruz bırakma.",
            pharmacologyNote: "SSRI grubu antidepresanlar her iki bozukluğu da hedefler."
        },
        miniQuiz: {
            question: "Majör Depresyon ile Sosyal Anksiyetenin komorbid görülmesinin en yaygın sebebi nedir?",
            options: [
                "Sosyal kaygının yol açtığı izolasyonun zamanla pozitif pekiştireçleri yok ederek depresyonu tetiklemesi.",
                "Aynı beyin bölgesinde tümör oluşması.",
                "Sosyal anksiyetenin sadece manide olması.",
                "İkisinin birlikte olması imkansızdır."
            ],
            correctIndex: 0,
            explanation: "Sosyal fobi nedeniyle insanlardan kaçınan bireyler ödüllendirici yaşantılardan mahrum kalarak depresyona girerler."
        },
        differentialDiagnosis: "• Tek Başına Depresyon: Sosyal çekilme sadece depresif dönemle sınırlıdır.",
        dsmCriteriaSummary: "DSM-5: Majör Depresif Epizod + Sosyal Anksiyete Bozukluğu eşzamanlılığı."
    }
];

// Load vaka_paketi_20.json (cases 30 to 49), vaka_paketi_40.json (cases 50 to 69), vaka_paketi_60.json (cases 70 to 89), vaka_paketi_80.json (cases 90 to 109), vaka_paketi_150.json (cases 110 to 150)
const new20CasesPart1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'vaka_paketi_20.json'), 'utf8'));
const new20CasesPart2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'vaka_paketi_40.json'), 'utf8'));
const new20CasesPart3 = JSON.parse(fs.readFileSync(path.join(__dirname, 'vaka_paketi_60.json'), 'utf8'));
const new20CasesPart4 = JSON.parse(fs.readFileSync(path.join(__dirname, 'vaka_paketi_80.json'), 'utf8'));
const new41CasesPart5 = JSON.parse(fs.readFileSync(path.join(__dirname, 'vaka_paketi_150.json'), 'utf8'));

// Combine all 150 cases
const allCases = [];
allCases.push(...cases1to4);
allCases.push(...cases5to10);
allCases.push(...cases11to25);
allCases.push(...cases26to29);
allCases.push(...new20CasesPart1);
allCases.push(...new20CasesPart2);
allCases.push(...new20CasesPart3);
allCases.push(...new20CasesPart4);
allCases.push(...new41CasesPart5);

const caseTherapyMap = {
    "case-001": "dbt",
    "case-002": "interoceptive_exposure",
    "case-003": "schema_therapy",
    "case-004": "cbtp",
    "case-005": "ipsrt",
    "case-006": "invivo_exposure",
    "case-007": "emdr",
    "case-008": "cbt_general",
    "case-009": "schema_therapy",
    "case-010": "behavioral_activation",
    "case-011": "schema_therapy",
    "case-012": "psychodynamic",
    "case-013": "erp",
    "case-014": "cbt_e",
    "case-015": "pmt",
    "case-016": "cbt_general",
    "case-017": "phase_trauma_did",
    "case-018": "fbt_maudsley",
    "case-019": "invivo_exposure",
    "case-020": "schema_therapy",
    "case-021": "cbtp",
    "case-022": "psychodynamic",
    "case-023": "cbasp",
    "case-024": "psychodynamic",
    "case-025": "cbt_general",
    "case-026": "pmt",
    "case-027": "stimulus_fading",
    "case-028": "cbt_general",
    "case-029": "behavioral_activation",
    "case-030": "invivo_exposure",
    "case-031": "cbtp",
    "case-032": "cbt_general",
    "case-033": "cbtp",
    "case-034": "schema_therapy",
    "case-035": "psychodynamic",
    "case-036": "schema_therapy",
    "case-037": "hrt",
    "case-038": "hrt",
    "case-039": "emdr",
    "case-040": "ipt",
    "case-041": "cbt_e",
    "case-042": "pmt",
    "case-043": "cbt_general",
    "case-044": "act",
    "case-045": "emdr",
    "case-046": "pmt",
    "case-047": "cbit",
    "case-048": "cbt_general",
    "case-049": "motivational_interviewing",
    "case-050": "motivational_interviewing",
    "case-051": "pmt",
    "case-052": "ipsrt",
    "case-053": "hoarding_cbt",
    "case-054": "mst",
    "case-055": "cbt_general",
    "case-056": "schema_therapy",
    "case-057": "applied_tension",
    "case-058": "cbtp",
    "case-059": "cbtp",
    "case-060": "psychodynamic",
    "case-061": "cbtp",
    "case-062": "cbt_general",
    "case-063": "cbt_ar",
    "case-064": "cbt_general",
    "case-065": "invivo_exposure",
    "case-066": "psychodynamic",
    "case-067": "motivational_interviewing",
    "case-068": "pmt",
    "case-069": "erp",
    "case-070": "cbt_general",
    "case-071": "cbt_general",
    "case-072": "cbt_general",
    "case-073": "irt",
    "case-074": "cbt_i",
    "case-075": "cbt_general",
    "case-076": "sensate_focus",
    "case-077": "sensate_focus",
    "case-078": "sensate_focus",
    "case-079": "cbt_general",
    "case-080": "cbt_general",
    "case-081": "cbt_general",
    "case-082": "erp",
    "case-083": "ipt",
    "case-084": "motivational_interviewing",
    "case-085": "interoceptive_exposure",
    "case-086": "dbt",
    "case-087": "cbt_e",
    "case-088": "stimulus_fading",
    "case-089": "motivational_interviewing"
};

// Renumber caseNumber cleanly from 1 to 150 and assign therapyId & clean symptomHighlights
allCases.forEach((c, idx) => {
    c.caseNumber = idx + 1;
    c.id = `case-${String(idx + 1).padStart(3, '0')}`;
    c.therapyId = c.therapyId || caseTherapyMap[c.id] || "cbt_general";

    if (c.symptomHighlights && Array.isArray(c.symptomHighlights)) {
        const validHighlights = [];
        c.symptomHighlights.forEach(hl => {
            const clueText = c.clues[hl.clueIndex];
            if (!clueText) return;

            if (clueText.includes(hl.text)) {
                validHighlights.push(hl);
            } else if (hl.text.includes('...')) {
                const parts = hl.text.split('...').map(p => p.trim()).filter(p => p.length >= 4);
                const matchingPart = parts.find(p => clueText.includes(p));
                if (matchingPart) {
                    validHighlights.push({
                        clueIndex: hl.clueIndex,
                        text: matchingPart,
                        dsmMatch: hl.dsmMatch
                    });
                }
            } else {
                const words = hl.text.split(' ').filter(w => w.length >= 4);
                for (let i = 0; i < words.length - 1; i++) {
                    const phrase = words[i] + ' ' + words[i+1];
                    if (clueText.includes(phrase)) {
                        validHighlights.push({
                            clueIndex: hl.clueIndex,
                            text: phrase,
                            dsmMatch: hl.dsmMatch
                        });
                        break;
                    }
                }
            }
        });
        c.symptomHighlights = validHighlights;
    }
});

const fileHeader = `/**
 * PsikoVaka - Zengin Klinik Vaka Veritabanı (DSM-5 Vakaları)
 * Her vaka 6 kademeli ipucu, ayırıcı tanı analizi, DSM-5 kriter eşleştirmeleri,
 * ders/alan etiketi, kanıta dayalı terapi yöntemi ve ayırıcı tanı mini-quiz'i içerir.
 * Toplam 150 benzersiz klinik vaka.
 */

const COURSE_CATEGORIES = {
    ALL: { id: "ALL", name: "Tüm Alanlar", icon: "🌟" },
    ADULT: { id: "ADULT", name: "Yetişkin Psikopatolojisi", icon: "🧠" },
    CHILD: { id: "CHILD", name: "Çocuk & Ergen Psikopatolojisi", icon: "🧑‍🦱" },
    FORENSIC: { id: "FORENSIC", name: "Adli Psikoloji & Kişilik", icon: "⚖️" },
    NEURO_SOMATIC: { id: "NEURO_SOMATIC", name: "Nörobilişsel & Somatik", icon: "🩺" },
    IMPULSE: { id: "IMPULSE", name: "Dürtü Denetimi & Yıkıcı Bozukluklar", icon: "💥" },
    SUBSTANCE: { id: "SUBSTANCE", name: "Bağımlılık & Madde Kullanımı", icon: "🧪" },
    COMORBID: { id: "COMORBID", name: "Komorbid (Çift Tanılı) Vakalar", icon: "🔗" }
};

const CLINICAL_CASES = `;

const fileFooter = `;

// Mevcut tüm vakalara varsayılan ders ve terapi alanlarını ekleyelim
CLINICAL_CASES.forEach((c, idx) => {
    if (!c.course) {
        if (["case-001", "case-003", "case-009", "case-011", "case-020", "case-022", "case-036", "case-054", "case-055", "case-061", "case-066"].includes(c.id)) {
            c.course = "FORENSIC";
        } else if (["case-012", "case-016", "case-017", "case-024", "case-043", "case-044", "case-045", "case-062"].includes(c.id)) {
            c.course = "NEURO_SOMATIC";
        } else if (["case-015", "case-026", "case-027", "case-042", "case-047", "case-051", "case-063"].includes(c.id)) {
            c.course = "CHILD";
        } else if (["case-028", "case-048"].includes(c.id)) {
            c.course = "IMPULSE";
        } else if (["case-049", "case-050"].includes(c.id)) {
            c.course = "SUBSTANCE";
        } else if (c.isComorbid || c.secondaryDiagnosisId) {
            c.course = "COMORBID";
        } else {
            c.course = "ADULT";
        }
    }

    if (!c.treatmentModality) {
        c.treatmentModality = {
            goldStandardTherapy: "Bilişsel Davranışçı Terapi (BDT)",
            therapyDetails: "Bozukluğa özgü otomatik düşünceleri yeniden yapılandırma ve davranışsal deneyler.",
            pharmacologyNote: "Klinik kılavuzlara uygun birinci basamak psikofarmakolojik tedavi."
        };
    }

    if (!c.miniQuiz) {
        c.miniQuiz = {
            question: \`Bu hastaya (\${c.patientSummary}) kesin tanı koyarken en kritik ayırt edici semptom neydi?\`,
            options: [
                c.clues[5] || "DSM-5 kilit tanı kriterinin karşılanması",
                "Hastanın sadece fiziksel yorgunluk hissetmesi",
                "Belirtilerin sadece 1 gün sürmüş olması",
                "Hiçbir işlevsellik kaybı olmaması"
            ],
            correctIndex: 0,
            explanation: c.differentialDiagnosis || "DSM-5 tanı kriterleri ve klinik seyir tanıyı doğrulamaktadır."
        };
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CLINICAL_CASES, COURSE_CATEGORIES };
}
`;

const finalContent = fileHeader + JSON.stringify(allCases, null, 4) + fileFooter;
fs.writeFileSync(path.join(__dirname, 'js', 'cases.js'), finalContent, 'utf8');
console.log('Successfully written cases.js with total cases:', allCases.length);
