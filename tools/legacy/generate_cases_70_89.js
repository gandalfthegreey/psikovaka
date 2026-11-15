const fs = require('fs');
const path = require('path');

const newCases = [
    // 70. Frotteuristik Bozukluk
    {
        id: "case-070",
        diagnosisId: "frotteuristic",
        therapyId: "cbt_general",
        difficulty: 3,
        age: 26,
        gender: "Erkek",
        occupation: "Muhasebe Çalışanı",
        chiefComplaint: "Metrobüs ve kalabalık otobüslerde tanımadığı kadınlara sürtünme dürtülerini durduramama ve yakalanma korkusu.",
        clues: [
            {
                order: 1,
                title: "İlk Başvuru & Gizlenen Gerginlik",
                text: "26 yaşındaki danışan, yoğun suçluluk ve utanç duygularıyla başvurdu. 'Toplu taşımaya bindiğimde beynimde bir şalter iniyor, kendimi kontrol edemiyorum' ifadesini kullanıyor.",
                highlightTags: ["suçluluk ve utanç", "kendimi kontrol edemiyorum"]
            },
            {
                order: 2,
                title: "Gelişim Öyküsü & Başlangıç",
                text: "17 yaşından beri kalabalık ortamlarda kadınların kalçasına veya bacaklarına temas etme hayalleri kurduğunu, son 2 yıldır bunu fiilen haftada en az 2-3 kez uyguladığını anlatıyor.",
                highlightTags: ["17 yaşından beri", "haftada en az 2-3 kez"]
            },
            {
                order: 3,
                title: "Rıza Dışı Cinsel Uyarılma Örüntüsü",
                text: "Cinsel uyarılmanın ve orgazmın sadece rızası olmayan, durumu fark etmeyen veya kalabalıktan kaçamayan yabancı kadınlara sürtünme eylemi sırasında ve sonrasındaki mastürbasyon fantezilerinde zirveye ulaştığını belirtiyor.",
                highlightTags: ["rızası olmayan", "yabancı kadınlara sürtünme"]
            },
            {
                order: 4,
                title: "Sosyal ve Hukuki Riskler",
                text: "Geçen ay metrobüste bir yolcunun durumu fark edip bağırması üzerine son anda kaçtığını, sürekli polis tarafından yakalanma ve hapse girme korkusuyla yaşadığını ancak dürtünün önüne geçemediğini söylüyor.",
                highlightTags: ["yakalanma ve hapse girme korkusu", "dürtünün önüne geçemediğini"]
            },
            {
                order: 5,
                title: "Kişilerarası İlişkiler & Normal Cinsellik",
                text: "Romantik bir ilişkisi olmadığını, rızaya dayalı normal cinsel deneyimlerin kendisine hiçbir heyecan vermediğini, uyarılmanın tamamen 'yasak temas ve kaçış' temasına şartlandığını ifade ediyor.",
                highlightTags: ["rızaya dayalı normal cinsel deneyimlerin kendisine hiçbir heyecan vermediğini"]
            },
            {
                order: 6,
                title: "DSM-5 Tanı Kriteri Karşılaştırması",
                text: "Danışan en az [[6 aydır rızası olmayan bir kişiye dokunma veya sürtünme içeren yoğun cinsel dürtüler ve fanteziler]] yaşamakta olup, bu eylemleri fiilen gerçekleştirmiş ve ağır klinik sıkıntı yaşamaktadır.",
                highlightTags: ["6 aydır rızası olmayan bir kişiye dokunma veya sürtünme içeren yoğun cinsel dürtüler ve fanteziler"]
            }
        ],
        patientSummary: "26 yaşında erkek danışan, kalabalık toplu taşıma araçlarında tanımadığı kadınlara rızaları olmaksızın sürtünme eylemlerini en az 6 aydır tekrarlamakta; yoğun suçluluk ve adli risk yaşamaktadır.",
        dsmAnalysis: "DSM-5 Frotteuristik Bozukluk kriterlerine göre; en az 6 aylık süre boyunca rızası olmayan birine dokunma/sürtünme ile ilgili tekrarlayan yoğun cinsel dürtülerin olması ve bu dürtülerin kişinin onay vermeyen bir kişiyle eyleme dökülmesi tanı için tam uyuşmaktadır.",
        differentialDiagnosis: [
            { diagnosis: "Göstermecilik Bozukluğu (Ekzibisyonizm)", reason: "Ekzibisyonizmde genital organı teşhir etme hazzı vardır, fiziksel temas ve sürtünme birincil odak değildir." },
            { diagnosis: "Antisosyal Kişilik Bozukluğu", reason: "Danışanda genel kriminal yaşam tarzı, vicdan azabı eksikliği ve saldırganlık yoktur; yoğun suçluluk ve ego-distonik sıkıntı mevcuttur." },
            { diagnosis: "Obsesif Kompulsif Bozukluk", reason: "OKB'de cinsel obsesyonlar haz vermez ve asla eyleme dökülmek istenmez; frotteurizmde eylem cinsel doyum ve haz kaynağıdır." }
        ],
        treatmentModality: {
            goldStandardTherapy: "Bilişsel Davranışçı Terapi (Gizli Duyarsızlaştırma, Dürtü Denetimi ve Nüks Önleme)",
            therapyDetails: "Cinsel dürtü tetikleyicilerini fark etme, toplu taşımada kaçınma ve alternatif davranış geliştirme, fantezi yeniden yapılandırması (Covert Sensitization / Gizli Şartlandırma) uygulanır.",
            pharmacologyNote: "Şiddetli cinsel dürtü ve kompulsif eylemleri baskılamak için SSRI'lar veya antiandrojenik ajanlar (GnRH agonistleri) eklenebilir."
        },
        miniQuiz: {
            question: "DSM-5'e göre Frotteuristik Bozukluk tanısı konulabilmesi için temel süre kriteri nedir?",
            options: ["En az 1 ay", "En az 3 ay", "En az 6 ay", "En az 12 ay"],
            correctIndex: 2,
            explanation: "DSM-5 Parafilik Bozukluklar bölümünde Frotteuristik Bozukluk tanısı için rıza dışı temas dürtülerinin en az 6 ay sürmesi şarttır."
        }
    },

    // 71. Gözetlemecilik Bozukluğu (Voyörizm)
    {
        id: "case-071",
        diagnosisId: "voyeuristic",
        therapyId: "cbt_general",
        difficulty: 3,
        age: 29,
        gender: "Erkek",
        occupation: "Bilgisayar Mühendisi",
        chiefComplaint: "Komşularının pencerelerinden soyunmalarını gizlice gözetleme takıntısı ve yakalanma eşiğindeki adli kriz.",
        clues: [
            {
                order: 1,
                title: "İlk Başvuru",
                text: "29 yaşındaki danışan, 'Bir gün yakalanıp rezil olacağım ama gece olunca dürbünü elime almaktan kendimi alıkoyamıyorum' diyerek başvurdu.",
                highlightTags: ["yakalanıp rezil olacağım", "dürbünü elime almaktan kendimi alıkoyamıyorum"]
            },
            {
                order: 2,
                title: "Gözetleme Ritüeli",
                text: "Son 1 yıldır her gece evinin ışıklarını kapatıp karşı binadaki kadınların perdelerinin kapanmadığı anları saatlerce beklediğini ve gizlice izlediğini anlatıyor.",
                highlightTags: ["Son 1 yıldır her gece", "gizlice izlediğini"]
            },
            {
                order: 3,
                title: "Cinsel Uyarılmanın Niteliği",
                text: "Kişinin soyunurken veya cinsel birliktelik yaşarken gözetlendiğinden habersiz olması cinsel heyecanını tetikleyen yegane unsurdur. Pornografi izlemek veya rızalı partnerle olmak aynı hazzı vermemektedir.",
                highlightTags: ["gözetlendiğinden habersiz olması", "aynı hazzı vermemektedir"]
            },
            {
                order: 4,
                title: "Eşlik Eden Cinsel Eylem",
                text: "Gizlice gözetlerken veya hemen ardından o görüntüleri zihninde canlandırarak mastürbasyon yaptığını belirtmektedir.",
                highlightTags: ["gözetlerken", "mastürbasyon yaptığını"]
            },
            {
                order: 5,
                title: "İşlevsellik Kaybı & Uyku Bozulması",
                text: "Geceleri saat 03:00'e kadar pencere başında beklemesi sebebiyle sabahları işe geç kalmakta, uykusuzluk ve yoğun anksiyete yaşamaktadır.",
                highlightTags: ["işe geç kalmakta", "yoğun anksiyete"]
            },
            {
                order: 6,
                title: "DSM-5 Tanı Kriteri",
                text: "Danışan en az [[6 aydır habersiz bir kişinin çıplaklığını, soyunmasını veya cinsel etkinliğini gözetleme içeren yoğun cinsel dürtüler]] yaşamakta ve bu eylemleri onay vermeyen kişiler üzerinde uygulamaktadır.",
                highlightTags: ["6 aydır habersiz bir kişinin çıplaklığını, soyunmasını veya cinsel etkinliğini gözetleme içeren yoğun cinsel dürtüler"]
            }
        ],
        patientSummary: "29 yaşında erkek danışan, en az 1 yıldır karşı binadaki habersiz kişileri gizlice gözetleyerek cinsel doyum sağlamakta, eylemi durduramamakta ve iş kaybı riski yaşamaktadır.",
        dsmAnalysis: "DSM-5 Gözetlemecilik (Voyörizm) Bozukluğu tanı kriteri: En az 6 aydır habersiz bir kişinin soyunmasını/cinselliğini gözetleme dürtüleri ve kişinin bu dürtüleri onay vermeyen bir kişiyle eyleme dökmesidir.",
        differentialDiagnosis: [
            { diagnosis: "Frotteuristik Bozukluk", reason: "Frotteurizmde yabancıya fiziksel sürtünme vardır; voyörizmde temas yoktur, uzaktan gizli izleme esastır." },
            { diagnosis: "Normal Cinsel Merak", reason: "Normal cinsel merakta onay vermeyen kişilerin gizliliğini ihlal eden kompulsif, kronik ve işlevselliği bozan bir eylem yoktur." },
            { diagnosis: "Ekzibisyonistik Bozukluk", reason: "Ekzibisyonizmde kişi kendini başkalarına gösterir; voyörizmde ise başkalarını gizlice izler." }
        ],
        treatmentModality: {
            goldStandardTherapy: "Bilişsel Davranışçı Terapi (Dürtü Kontrolü, Gizli Şartlandırma ve Alternatif Baş Etme)",
            therapyDetails: "Dürbün/kamera gibi tetikleyici araçların yok edilmesi, gece ritüellerinin yeniden yapılandırılması ve cinsel uyarılma kalıplarının dönüştürülmesi hedeflenir.",
            pharmacologyNote: "Kompulsif cinsel dürtülerin yoğunluğunu kırmak için yüksek doz SSRI (örn: Fluoksetin, Sertralin) reçete edilebilir."
        },
        miniQuiz: {
            question: "Voyörizm (Gözetlemecilik) bozukluğunda cinsel hazzın temel kaynağı nedir?",
            options: ["Gözetlenen kişinin gözetlendiğini bilip onaylaması", "Gözetlenen kişinin tamamen habersiz ve savunmasız olması", "Kişinin kendi bedenini kalabalığa sergilemesi", "Fiziksel temas ve sürtünme"],
            correctIndex: 1,
            explanation: "Voyörizmde cinsel uyarılmanın en kritik bileşeni izlenen kurbanın izlendiğinden tamamen habersiz olmasıdır."
        }
    },

    // 72. Göstermecilik Bozukluğu (Ekzibisyonizm)
    {
        id: "case-072",
        diagnosisId: "exhibitionistic",
        therapyId: "cbt_general",
        difficulty: 3,
        age: 33,
        gender: "Erkek",
        occupation: "Banka Görevlisi",
        chiefComplaint: "Tenhada yürüyen kadınlara aniden cinsel organını gösterme dürtüsü ve şok tepkisi alma arzusu.",
        clues: [
            {
                order: 1,
                title: "İlk Başvuru",
                text: "33 yaşındaki evli erkek danışan, 'Eşimi seviyorum ama içimdeki bu canavarı durduramıyorum, parklarda kadınların karşısına çıkıp üzerimi açıyorum' diyerek ağlayarak başvurdu.",
                highlightTags: ["içimdeki bu canavarı durduramıyorum", "üzerimi açıyorum"]
            },
            {
                order: 2,
                title: "Eylemin Senaryosu",
                text: "Pardösü veya bol eşofman giyerek tenha sokaklarda veya parklarda beklediğini, yalnız bir kadın yaklaştığında aniden cinsel organını teşhir ettiğini anlatıyor.",
                highlightTags: ["aniden cinsel organını teşhir ettiğini"]
            },
            {
                order: 3,
                title: "Kurbanın Tepkisi ve Haz",
                text: "Cinsel hazzının kurbanın yaşadığı 'şaşkınlık, korku ve çığlık atma' tepkisiyle doğrudan ilişkili olduğunu, kurban tepkisiz kalırsa hayal kırıklığı yaşadığını belirtiyor.",
                highlightTags: ["şaşkınlık, korku ve çığlık atma", "kurban tepkisiz kalırsa hayal kırıklığı"]
            },
            {
                order: 4,
                title: "Fiziksel Temas Arzusu Yokluğu",
                text: "Kadınlara asla dokunmak veya tecavüz etmek istemediğini, tek amacının teşhir anındaki şok tepkisini görmek ve sonrasında mastürbasyon yapmak olduğunu vurguluyor.",
                highlightTags: ["asla dokunmak istemediğini", "şok tepkisini görmek"]
            },
            {
                order: 5,
                title: "Süre ve Yoğunluk",
                text: "Bu eylemleri son 8 aydır haftada ortalama 1-2 kez gerçekleştirdiğini, yakalanma korkusuyla yoğun panik ve depresif duygulanım yaşadığını ifade ediyor.",
                highlightTags: ["son 8 aydır", "haftada ortalama 1-2 kez"]
            },
            {
                order: 6,
                title: "DSM-5 Tanı Kriteri",
                text: "Danışan en az [[6 aydır beklenmedik bir yabancıya cinsel organını teşhir etme içeren yoğun dürtü ve fanteziler]] yaşamakta ve bu dürtüleri onay vermeyen kişiler üzerinde eyleme dökmüştür.",
                highlightTags: ["6 aydır beklenmedik bir yabancıya cinsel organını teşhir etme içeren yoğun dürtü ve fanteziler"]
            }
        ],
        patientSummary: "33 yaşında erkek danışan, 8 aydır habersiz yabancı kadınlara cinsel organını teşhir ederek şok tepkisiyle uyarılmakta ve yoğun suçluluk yaşamaktadır.",
        dsmAnalysis: "DSM-5 Göstermecilik (Ekzibisyonistik) Bozukluk kriterlerine göre; en az 6 ay boyunca habersiz kişilere cinsel organını sergileme dürtülerinin olması ve bu dürtülerin onay vermeyen kişiler üzerinde uygulanmasıdır.",
        differentialDiagnosis: [
            { diagnosis: "Frotteuristik Bozukluk", reason: "Frotteurizmde amaç fiziksel sürtünmedir, ekzibisyonizmde ise uzaktan görsel şok yaratma esastır." },
            { diagnosis: "Bipolar I Bozukluk (Mani)", reason: "Manide disinhibisyon ve hiperseksüalite olabilir ancak bu epizodiktir; ekzibisyonizmde epizodik duygudurum dalgalanması olmadan kronik özgül parafilik örüntü vardır." },
            { diagnosis: "Kişilik Bozukluğu (Histriyonik)", reason: "Histriyonik KB'de ilgi çekme davranışı cinsel organ teşhiri ve parafilik dürtü şeklinde değildir." }
        ],
        treatmentModality: {
            goldStandardTherapy: "Bilişsel Davranışçı Terapi (Dürtü Yönetimi, Gizli Şartlandırma ve Empati Geliştirme)",
            therapyDetails: "Kurbanın yaşadığı travmayı anlama (mağdur empatisi), erken uyarı işaretlerinde mola verme ve cinsel uyarılma odağını sağlıklı alanlara kaydırma çalışmaları yapılır.",
            pharmacologyNote: "Dürtüsel kompulsiyonları azaltmak amacıyla SSRI antidepresanlar kullanılabilir."
        },
        miniQuiz: {
            question: "Ekzibisyonizmde (Göstermecilik) cinsel uyarılmayı en çok tetikleyen kurban tepkisi hangisidir?",
            options: ["Kurbanın gülümsemesi ve yaklaşması", "Kurbanın korkması, şok olması ve çığlık atması", "Kurbanın görmezden gelmesi", "Kurbanın polisi araması"],
            correctIndex: 1,
            explanation: "Ekzibisyonizmde mağdurun korku, şaşkınlık ve dehşet tepkisi göstermesi failin cinsel uyarılmasını doruğa çıkaran temel mekanizmadır."
        }
    },

    // 73. Kabus Bozukluğu (Nightmare Disorder)
    {
        id: "case-073",
        diagnosisId: "nightmare_disorder",
        therapyId: "irt",
        difficulty: 2,
        age: 24,
        gender: "Kadın",
        occupation: "Üniversite Öğrencisi",
        chiefComplaint: "Hemen her gece canavar ve saldırganlar tarafından kovalanıp öldürüldüğü dehşet verici rüyalarla uyanma ve uyku korkusu.",
        clues: [
            {
                order: 1,
                title: "İlk Başvuru",
                text: "24 yaşındaki danışan, 'Gece olunca yatağa girmekten ödüm kopuyor. Uyuduğum an aynı kabus başlıyor, kan ter içinde uyanıyorum' şikayetiyle başvurdu.",
                highlightTags: ["yatağa girmekten ödüm kopuyor", "aynı kabus başlıyor"]
            },
            {
                order: 2,
                title: "Rüyanın İçeriği ve Ayrıntılı Hatırlama",
                text: "Rüyalarında yüksek bir uçurumun kenarında maskeli adamlar tarafından bıçakla kovalandığını, düştüğünü veya parçalandığını en ince ayrıntısına kadar ve çok canlı bir şekilde hatırladığını söylüyor.",
                highlightTags: ["en ince ayrıntısına kadar", "çok canlı bir şekilde hatırladığını"]
            },
            {
                order: 3,
                title: "Uyanma Anındaki Bilinç Durumu",
                text: "Uykudan uyandığı anda tamamen uyanık, bilinci açık ve oryante olduğunu; konfüzyon veya kafa karışıklığı yaşamadığını, hemen kalbinin çarptığını ve titrediğini anlatıyor.",
                highlightTags: ["tamamen uyanık", "bilinci açık ve oryante olduğunu"]
            },
            {
                order: 4,
                title: "Gecenin İkinci Yarısında Oluşum",
                text: "Kabusların genellikle sabah karşı saat 04:00 - 06:00 civarında (REM uykusunun yoğun olduğu dönemde) ortaya çıktığını belirtiyor.",
                highlightTags: ["sabah karşı saat 04:00 - 06:00 civarında", "REM uykusunun"]
            },
            {
                order: 5,
                title: "Günlük Hayata Etkisi",
                text: "Kabuslar yüzünden tekrar uyuyamadığını, gündüz derslerde uyukladığını, kronik yorgunluk ve çökkünlük geliştirdiğini ifade ediyor.",
                highlightTags: ["tekrar uyuyamadığını", "kronik yorgunluk"]
            },
            {
                order: 6,
                title: "DSM-5 Tanı Kriteri",
                text: "Danışan [[tekrarlayan, canlı hatırlanan ve hayatta kalmaya yönelik tehditler içeren korkutucu rüyalar]] görmekte; uyandığında hızla oryante olmakta ve klinik sıkıntı yaşamaktadır.",
                highlightTags: ["tekrarlayan, canlı hatırlanan ve hayatta kalmaya yönelik tehditler içeren korkutucu rüyalar"]
            }
        ],
        patientSummary: "24 yaşında kadın danışan, aylardır REM evresinde tekrarlayan, canlı hatırlanan ölümcül kabuslar görmekte; uyandığında tam oryante olmakta ve uyku fobisi yaşamaktadır.",
        dsmAnalysis: "DSM-5 Kabus Bozukluğu (Nightmare Disorder): Yaşamı, güvenliği tehdit eden iyi hatırlanan korkutucu rüyaların tekrarlaması, uyanır uyanmaz tam oryantasyonun olması ve belirgin işlevsellik kaybıdır.",
        differentialDiagnosis: [
            { diagnosis: "Uyku Terörü (Sleep Terror)", reason: "Uyku teröründe NREM uykusundan çığlıkla uyanılır, hasta konfüzyon içindedir ve rüya içeriğini hatırlamaz. Kabus bozukluğunda ise rüya canlı hatırlanır ve uyanınca bilinç açıktır." },
            { diagnosis: "Travma Sonrası Stres Bozukluğu (TSSB)", reason: "TSSB kabusları gerçek bir travmatik olayın tekrarıdır ve gündüz flashbackleri eşlik eder. Burada bağımsız bir kabus bozukluğu mevcuttur." },
            { diagnosis: "Panik Bozukluk (Gece Panik Atakları)", reason: "Gece panik atağında rüya olmadan aniden fiziksel çarpıntı ve ölüm korkusuyla uyanılır." }
        ],
        treatmentModality: {
            goldStandardTherapy: "İmgeleme Provası Terapisi (Imagery Rehearsal Therapy - IRT / Krakow Modeli)",
            therapyDetails: "Danışan kabusun senaryosunu gündüz güvenli bir sonla yeniden yazar ve zihninde her gün 15-20 dakika prova ederek bellekteki kabus izini yeniden yapılandırır.",
            pharmacologyNote: "TSSB bağlantılı kabuslarda Prazosin (alfa-1 blokör) etkiliyken, primer kabus bozukluğunda psikoterapi birinci basamaktır."
        },
        miniQuiz: {
            question: "Kabus Bozukluğunu (Nightmare Disorder) Uyku Teröründen (Sleep Terror) ayıran en temel klinik fark nedir?",
            options: ["Kabus bozukluğunda uyanınca rüyanın canlı hatırlanması ve oryantasyonun tam olması", "Uyku terörünün sadece gündüzleri olması", "Kabus bozukluğunda hiç kalp çarpıntısı olmaması", "Uyku teröründe rüyaların sabaha karşı görülmesi"],
            correctIndex: 0,
            explanation: "Kabus bozukluğunda hasta REM'den uyanır, rüyayı canlı hatırlar ve bilinci hemen açılır. Uyku teröründe ise NREM'den uyanılır, kafa karışıklığı vardır ve rüya hatırlanmaz."
        }
    },

    // 74. Uykusuzluk Bozukluğu (İnsomni)
    {
        id: "case-074",
        diagnosisId: "insomnia_disorder",
        therapyId: "cbt_i",
        difficulty: 1,
        age: 41,
        gender: "Erkek",
        occupation: "Finans Danışmanı",
        chiefComplaint: "Aylardır yatağa yattığında saatlerce dönememe, gece sık uyanma ve gündüz tükenmişlik hissi.",
        clues: [
            {
                order: 1,
                title: "İlk Başvuru",
                text: "41 yaşındaki danışan, 'Her gece yatağa yatınca kalbim küt küt atmaya başlıyor, uyumak için debelenirken sabah oluyor' yakınmasıyla geldi.",
                highlightTags: ["yatağa yatınca kalbim küt küt atmaya başlıyor", "uyumak için debelenirken"]
            },
            {
                order: 2,
                title: "Uykuya Dalma Süresi ve Sıklık",
                text: "Yatağa girdikten sonra uykuya dalmasının en az 90 dakika ile 2 saat sürdüğünü, haftada en az 4-5 gece bu sorunu yaşadığını belirtiyor.",
                highlightTags: ["en az 90 dakika ile 2 saat", "haftada en az 4-5 gece"]
            },
            {
                order: 3,
                title: "Süre Kriteri",
                text: "Bu durumun iş değiştirdiği dönemde başlayıp son 5 aydır kesintisiz devam ettiğini anlatıyor.",
                highlightTags: ["son 5 aydır kesintisiz"]
            },
            {
                order: 4,
                title: "Yeterli Uyku Fırsatı Varlığı",
                text: "Sessiz, karanlık ve konforlu bir yatak odasına sahip olmasına ve yatakta 9 saat kalmasına rağmen uyuyamadığını vurguluyor.",
                highlightTags: ["konforlu bir yatak odasına sahip olmasına", "yeterli uyku fırsatı"]
            },
            {
                order: 5,
                title: "Koşullanmış Uyarılma (Conditioned Arousal)",
                text: "Salondaki koltukta TV izlerken uykusunun geldiğini ancak yatak odasına geçip yatağa girdiği anda beyninin uyarılıp 'alarm moduna' geçtiğini söylüyor.",
                highlightTags: ["yatağa girdiği anda beyninin uyarılıp alarm moduna"]
            },
            {
                order: 6,
                title: "DSM-5 Tanı Kriteri",
                text: "Danışan en az [[3 aydır haftada en az 3 gece uykuya dalma veya sürdürme güçlüğü]] yaşamakta olup, yeterli uyuma fırsatına rağmen belirgin gündüz işlevsellik kaybı mevcuttur.",
                highlightTags: ["3 aydır haftada en az 3 gece uykuya dalma veya sürdürme güçlüğü"]
            }
        ],
        patientSummary: "41 yaşında erkek danışan, 5 aydır haftada 4-5 gece uykuya dalamama ve gece uyanma sorunu yaşamakta; yatakla uyanıklık arasında olumsuz koşullanma geliştirmiştir.",
        dsmAnalysis: "DSM-5 Uykusuzluk Bozukluğu (Insomnia Disorder): Uyku başlatma, sürdürme veya erken uyanma güçlüğünün haftada en az 3 gece ve en az 3 ay sürmesi, uygun uyku koşullarına rağmen ortaya çıkmasıdır.",
        differentialDiagnosis: [
            { diagnosis: "Uyku Apnesi (Obstrüktif)", reason: "Uyku apnesinde horlama, nefes durması ve gündüz aşırı uyku atakları vardır; insomnide ise uyku başlatma güçlüğü ve hiperarousal hakimdir." },
            { diagnosis: "Majör Depresif Bozukluk", reason: "Depresyonda tipik olarak sabah çok erken uyanma ve derin anhedoni/çökkünlük vardır; burada birincil sorun uykuya dalma koşullanmasıdır." },
            { diagnosis: "Huzursuz Bacaklar Sendromu", reason: "Huzursuz bacaklarda bacaklarda dayanılmaz hareket ettirme dürtüsü ve paresteziler vardır." }
        ],
        treatmentModality: {
            goldStandardTherapy: "Uykusuzluk için Bilişsel Davranışçı Terapi (CBT-I / Morin Modeli)",
            therapyDetails: "Uyaran kontrolü (yatakta sadece uyuma, 20 dk uyunamazsa kalkma), uyku kısıtlama terapisi ve 'uyuyamazsam ölürüm' felaketleştirmelerini yeniden yapılandırma uygulanır.",
            pharmacologyNote: "Kısa süreli melatonin reseptör agonistleri veya non-benzodiazepin hipnotikler (Z-ilaçlar) verilebilir ancak CBT-I farmakoterapiden daha kalıcıdır."
        },
        miniQuiz: {
            question: "DSM-5'e göre Kronik İnsomni (Uykusuzluk Bozukluğu) tanısı için haftalık sıklık ve minimum süre eşiği nedir?",
            options: ["Haftada en az 1 gece, en az 1 ay", "Haftada en az 3 gece, en az 3 ay", "Haftada en az 5 gece, en az 6 ay", "Haftada her gece, en az 2 hafta"],
            correctIndex: 1,
            explanation: "DSM-5 kriterlerine göre uykusuzluk bozukluğu haftada en az 3 gece ve en az 3 ay boyunca devam etmelidir."
        }
    },

    // 75. Aşırı Uykululuk Bozukluğu (Hipersomnolans)
    {
        id: "case-075",
        diagnosisId: "hypersomnolence",
        therapyId: "cbt_general",
        difficulty: 2,
        age: 28,
        gender: "Erkek",
        occupation: "Yazılımcı",
        chiefComplaint: "Geceleri 10-11 saat deliksiz uyumasına rağmen sabah uyanamama ve gündüz karşı konulmaz uyuma ihtiyacı.",
        clues: [
            {
                order: 1,
                title: "İlk Başvuru",
                text: "28 yaşındaki danışan, 'Günde 11 saat uyuyorum ama sabah sanki hiç uyumamış gibi sarhoş gibi kalkıyorum' diyerek başvurdu.",
                highlightTags: ["Günde 11 saat uyuyorum", "sarhoş gibi kalkıyorum"]
            },
            {
                order: 2,
                title: "Uyku Süresi ve Gece Kalitesi",
                text: "Gece saat 23:00'te yatıp sabah 10:00'da zorla uyandığını, gece hiç uyanmadığını ve polisomnografi testinde uyku apnesi saptanmadığını belirtiyor.",
                highlightTags: ["gece hiç uyanmadığını", "uyku apnesi saptanmadığını"]
            },
            {
                order: 3,
                title: "Uyku Sarhoşluğu (Sleep Inertia)",
                text: "Sabah alarm çaldığında 1 saat boyunca nerede olduğunu anlayamadığını, konuşmakta ve yataktan çıkmakta aşırı zorlandığını anlatıyor.",
                highlightTags: ["1 saat boyunca nerede olduğunu anlayamadığını", "uyku sarhoşluğu"]
            },
            {
                order: 4,
                title: "Gündüz Şekerlemelerinin Dinlendirmemesi",
                text: "Gündüzleri öğleden sonra 2 saatlik uzun şekerlemeler yaptığını ancak uyandığında hala kendini yorgun ve uykulu hissettiğini söylüyor.",
                highlightTags: ["2 saatlik uzun şekerlemeler", "hala kendini yorgun"]
            },
            {
                order: 5,
                title: "Katapleksi Yokluğu",
                text: "Gülerken veya heyecanlandığında ani kas boşalması (katapleksi) yaşamadığını ve uyku felci (karabasan) tarif etmediğini belirtiyor.",
                highlightTags: ["ani kas boşalması yaşamadığını", "katapleksi yokluğu"]
            },
            {
                order: 6,
                title: "DSM-5 Tanı Kriteri",
                text: "Danışan en az [[9 saatlik ana uyku dönemine rağmen aşırı uykululuk]] ve dinlendirmeyen uzun gündüz uykuları yaşamakta olup, bu tablo en az 3 aydır haftada en az 3 kez sürmektedir.",
                highlightTags: ["9 saatlik ana uyku dönemine rağmen aşırı uykululuk"]
            }
        ],
        patientSummary: "28 yaşında erkek danışan, geceleri 10-11 saat uyumasına rağmen uyku sarhoşluğu ve dinlendirmeyen aşırı gündüz uykululuğu yaşamaktadır; katapleksi yoktur.",
        dsmAnalysis: "DSM-5 Hipersomnolans Bozukluğu: En az 7 (genellikle 9+) saatlik ana uyku evresine rağmen aşırı uykululuk, dinlendirici olmayan uzun uyku epizodları ve belirgin uyku ataleti (sleep inertia) ile karakterizedir.",
        differentialDiagnosis: [
            { diagnosis: "Narkolepsi", reason: "Narkolepside kısa (15-20 dk) ferahlatıcı uyku atakları, katapleksi (kas felci) ve hipnagojik halüsinasyonlar vardır; hipersomnolansda ise uzun ve dinlendirmeyen uykular vardır." },
            { diagnosis: "Obstrüktif Uyku Apnesi", reason: "Uyku apnesinde gece solunum durmaları ve desatürasyon vardır; polisomnografide dışlanmıştır." },
            { diagnosis: "Majör Depresyon (Atipik Özellikli)", reason: "Atipik depresyonda aşırı uyku olabilir ancak burada depresif duygudurum ve anhedoni birincil tablo değildir." }
        ],
        treatmentModality: {
            goldStandardTherapy: "Davranışsal Uyku Planlaması & Bilişsel Terapi",
            therapyDetails: "Katı sirkadiyen ritim oluşturma, sabah parlak ışık terapisi ve uyku sarhoşluğuyla başa çıkma stratejileri öğretilir.",
            pharmacologyNote: "Gündüz uyanıklığını sürdürmek için Modafinil veya Armodafinil gibi uyanıklık artırıcı ajanlar kullanılır."
        },
        miniQuiz: {
            question: "Hipersomnolans Bozukluğunu Narkolepsiden ayıran en belirgin klinik özellik nedir?",
            options: ["Hipersomnolansda gündüz uykularının uzun ve dinlendirici olmaması, katapleksi görülmemesi", "Hipersomnolansın sadece çocuklarda görülmesi", "Narkolepside hastanın hiç uyuyamaması", "Hipersomnolansda gece uykusunun 3 saatle sınırlı olması"],
            correctIndex: 0,
            explanation: "Narkolepside gündüz kısa şekerlemeler dinlendiricidir ve sıklıkla katapleksi eşlik eder. Hipersomnolansda ise uykular çok uzundur, dinlendirmez ve katapleksi yoktur."
        }
    },

    // 76. Genito-Pelvik Ağrı / Penetrasyon Bozukluğu (Vajinismus)
    {
        id: "case-076",
        diagnosisId: "genito_pelvic_pain",
        therapyId: "sensate_focus",
        difficulty: 1,
        age: 26,
        gender: "Kadın",
        occupation: "Öğretmen",
        chiefComplaint: "1 yıllık evli olmasına rağmen cinsel birleşmeyi gerçekleştirememe, bacaklarda kasılma ve jinekolojik muayene korkusu.",
        clues: [
            {
                order: 1,
                title: "İlk Başvuru",
                text: "26 yaşındaki danışan eşiyle birlikte başvurdu. 'Eşimi çok seviyorum, arzuluyorum ama ilişki anı gelince bedenim kilitleniyor, duvara çarpıyormuş gibi hissediyoruz' dedi.",
                highlightTags: ["ilişki anı gelince bedenim kilitleniyor", "duvara çarpıyormuş gibi"]
            },
            {
                order: 2,
                title: "Pelvik Taban Kas Kasılması",
                text: "Penetrasyon denendiğinde istemsiz olarak bacaklarını kapattığını, pelvis kaslarını kastığını ve eşini elleriyle ittiğini belirtiyor.",
                highlightTags: ["istemsiz olarak bacaklarını kapattığını", "pelvis kaslarını kastığını"]
            },
            {
                order: 3,
                title: "Ağrı Beklentisi ve Korku",
                text: "Bekaretin bozulmasıyla ilgili 'yırtılma, parçalanma, aşırı kanama ve dayanılamaz acı' şeklinde yoğun felaketleştirici inançları olduğunu söylüyor.",
                highlightTags: ["yırtılma, parçalanma, aşırı kanama", "felaketleştirici inançları"]
            },
            {
                order: 4,
                title: "Tampon ve Jinekolojik Muayene Kaçınması",
                text: "Hayatı boyunca hiç tampon kullanamadığını, jinekolog muayene masasına yattığında da bacaklarını kilitlediğini ve muayenenin tamamlanamadığını ifade ediyor.",
                highlightTags: ["tampon kullanamadığını", "jinekolojik muayene masasına yattığında da bacaklarını kilitlediğini"]
            },
            {
                order: 5,
                title: "Cinsel İstek ve Uyarılmanın Korunmuş Olması",
                text: "Ön sevişmede cinsel uyarılma, ıslanma ve klitoral orgazm yaşayabildiğini, sorunun tamamen vajinal penetrasyon aşamasında ortaya çıktığını belirtiyor.",
                highlightTags: ["cinsel uyarılma, ıslanma ve klitoral orgazm yaşayabildiğini", "tamamen vajinal penetrasyon aşamasında"]
            },
            {
                order: 6,
                title: "DSM-5 Tanı Kriteri",
                text: "Danışan en az [[6 aydır vajinal penetrasyon sırasında belirgin güçlük, ağrı korkusu ve pelvik taban kaslarında istemsiz kasılma]] yaşamaktadır.",
                highlightTags: ["6 aydır vajinal penetrasyon sırasında belirgin güçlük, ağrı korkusu ve pelvik taban kaslarında istemsiz kasılma"]
            }
        ],
        patientSummary: "26 yaşında kadın danışan, 1 yıldır vajinal penetrasyon denemelerinde istemsiz pelvik kasılma ve yoğun acı beklentisi yaşamakta; birleşme gerçekleşememektedir.",
        dsmAnalysis: "DSM-5 Genito-Pelvik Ağrı/Penetrasyon Bozukluğu (Vajinismus / Disparoni): Vajinal ilişki sırasında belirgin penetrasyon güçlüğü, vulvovajinal ağrı korkusu ve pelvik kaslarda istemsiz kasılma birlikteliğidir.",
        differentialDiagnosis: [
            { diagnosis: "Cinsel İlgi/Uyarılma Bozukluğu", reason: "Bu tabloda cinsel istek ve uyarılma tamamen kayıptır; danışanda ise cinsel arzu ve ıslanma mevcuttur." },
            { diagnosis: "Organik Pelvik Patolojiler (Endometriozis, Vajinit)", reason: "Organik patolojiler jinekolojik muayenede saptanır ve fiziksel doku lezyonu vardır." },
            { diagnosis: "Panik Bozukluk", reason: "Panik atakta bedensel kaygı geneldir; burada kaygı penetrasyon durumuna özgü şartlanmıştır." }
        ],
        treatmentModality: {
            goldStandardTherapy: "Duyusal Odaklanma (Sensate Focus) & Kademeli Dilatör Egzersizleri (Masters & Johnson)",
            therapyDetails: "Psikoeğitim (kadın anatomisi), pelvik taban gevşeme eğitimi (Kegel), cinsel birleşme yasağı altında Duyusal Odaklanma masajları ve kademeli vajinal dilatör egzersizleri uygulanır.",
            pharmacologyNote: "Psikoterapi tek başına %95+ başarı oranına sahiptir; anksiyete çok yüksekse seans öncesi kısa süreli anksiyolitik düşünülebilir."
        },
        miniQuiz: {
            question: "DSM-5'te önceki DSM-IV tanıları olan Vajinismus ve Disparoni hangi tanı başlığı altında birleştirilmiştir?",
            options: ["Genito-Pelvik Ağrı / Penetrasyon Bozukluğu", "Kadın Orgazm Bozukluğu", "Cinsel Tiksinti Bozukluğu", "Pelvik Somatizasyon Sendromu"],
            correctIndex: 0,
            explanation: "DSM-5'te vajinismus (istemsiz kasılma) ve disparoni (ağrılı ilişki) 'Genito-Pelvik Ağrı/Penetrasyon Bozukluğu' adı altında tek bir tanıda birleştirilmiştir."
        }
    },

    // 77. Erken Boşalma (Prematür Ejakülasyon)
    {
        id: "case-077",
        diagnosisId: "premature_ejaculation",
        therapyId: "sensate_focus",
        difficulty: 1,
        age: 30,
        gender: "Erkek",
        occupation: "Mühendis",
        chiefComplaint: "Vajinal penetrasyondan hemen sonra (yaklaşık 30-40 saniye içinde) istemsiz boşalma ve ilişkide yetersizlik hissi.",
        clues: [
            {
                order: 1,
                title: "İlk Başvuru",
                text: "30 yaşındaki danışan, 'Evlendiğimizden beri ilişkiye girdiğim an kontrolümü kaybediyorum, eşimi tatmin edemeden 30 saniyede bitiyor' şikayetiyle başvurdu.",
                highlightTags: ["ilişkiye girdiğim an kontrolümü kaybediyorum", "30 saniyede bitiyor"]
            },
            {
                order: 2,
                title: "Boşalma Süresi (IELT)",
                text: "İntravajinal boşalma gecikme süresinin (IELT) neredeyse tüm cinsel ilişkilerde 1 dakikanın (ortalama 30-45 saniye) altında olduğunu belirtiyor.",
                highlightTags: ["1 dakikanın altında", "30-45 saniye"]
            },
            {
                order: 3,
                title: "Boşalma Üzerinde Kontrolsüzlük",
                text: "Boşalma refleksinin geldiğini hissettiğinde bunu geciktirmek için hiçbir kas kontrolü sağlayamadığını ifade ediyor.",
                highlightTags: ["geciktirmek için hiçbir kas kontrolü sağlayamadığını"]
            },
            {
                order: 4,
                title: "Süre ve Yaygınlık",
                text: "İlk cinsel deneyiminden bu yana (yaşam boyu tip) ve cinsel ilişkilerin %90'ından fazlasında bu tablonun yaşandığını anlatıyor.",
                highlightTags: ["İlk cinsel deneyiminden bu yana", "ilişkilerin %90'ından fazlasında"]
            },
            {
                order: 5,
                title: "Kişilerarası Sıkıntı",
                text: "Eşine karşı yoğun mahcubiyet duyduğunu, cinsel ilişkiden kaçınmaya başladığını ve performans kaygısının giderek tırmandığını söylüyor.",
                highlightTags: ["cinsel ilişkiden kaçınmaya başladığını", "performans kaygısının"]
            },
            {
                order: 6,
                title: "DSM-5 Tanı Kriteri",
                text: "Danışan en az [[6 aydır vajinal penetrasyondan sonraki yaklaşık 1 dakika içinde ve kişinin isteğinden önce boşalma]] örüntüsü sergilemektedir.",
                highlightTags: ["6 aydır vajinal penetrasyon sonraki yaklaşık 1 dakika içinde ve kişinin isteğinden önce boşalma"]
            }
        ],
        patientSummary: "30 yaşında erkek danışan, yaşam boyu hemen tüm ilişkilerinde 1 dakikanın altında istemsiz boşalma yaşamakta ve yoğun performans anksiyetesi duymaktadır.",
        dsmAnalysis: "DSM-5 Erken Boşalma (Premature Ejaculation): Partnerle cinsel etkinlik sırasında vajinal penetrasyonun ardından yaklaşık 1 dakika içinde ve bireyin arzusundan önce sürekli ya da tekrarlayıcı biçimde boşalma olmasıdır.",
        differentialDiagnosis: [
            { diagnosis: "Erektil Bozukluk", reason: "Erektil bozuklukta sertleşmeyi sağlayamama/sürdürememe vardır; danışanda ereksiyon tamdır ancak boşalma süresi çok kısadır." },
            { diagnosis: "Normal Değişken Cinsel Yanıt", reason: "Uzun süre cinsel perhiz sonrası veya yeni partnerle ara sıra erken boşalma normaldir; burada kronik ve süreğendir." },
            { diagnosis: "Madde/İlaç Kullanımına Bağlı Bozukluk", reason: "Madde yoksunluğu veya uyarıcı kullanımı dışlanmıştır." }
        ],
        treatmentModality: {
            goldStandardTherapy: "Cinsel Terapi (Dur-Başlat / Sıkma Teknikleri - Semans & Masters-Johnson)",
            therapyDetails: "Duyusal odaklanma egzersizleri, Semans'ın 'Dur-Başlat' (Stop-Start) tekniği ve Masters-Johnson'ın 'Sıkma' (Squeeze) yöntemiyle boşalma eşiği duyusal kontrolü kazandırılır.",
            pharmacologyNote: "Gerektiğinde ilişki öncesi kısa etkili Dapoksetin (SSRI) veya topikal anestezik kremler eklenebilir."
        },
        miniQuiz: {
            question: "DSM-5'e göre Yaşam Boyu Erken Boşalma tanısı için intravajinal boşalma süresi (IELT) eşik değeri yaklaşık ne kadardır?",
            options: ["Yaklaşık 1 dakika içinde", "Yaklaşık 3 dakika içinde", "Yaklaşık 5 dakika içinde", "Yaklaşık 10 dakika içinde"],
            correctIndex: 0,
            explanation: "DSM-5'te erken boşalma için penetrasyondan sonraki yaklaşık 1 dakika içinde boşalma kriteri getirilmiştir."
        }
    },

    // 78. Sertleşme Bozukluğu (Erektil Bozukluk)
    {
        id: "case-078",
        diagnosisId: "erectile_disorder",
        therapyId: "sensate_focus",
        difficulty: 1,
        age: 38,
        gender: "Erkek",
        occupation: "Pazarlama Müdürü",
        chiefComplaint: "Cinsel ilişki sırasında ereksiyonu kaybetme, sertleşmeyi sürdürememe ve performans endişesi.",
        clues: [
            {
                order: 1,
                title: "İlk Başvuru",
                text: "38 yaşındaki danışan, 'Eşimle yakınlaşırken sertleşme başlıyor ama prezervatifi takarken veya birleşme anında sönüyor' diyerek başvurdu.",
                highlightTags: ["yakınlaşırken sertleşme başlıyor", "birleşme anında sönüyor"]
            },
            {
                order: 2,
                title: "Sertliği Sürdürememe Sıklığı",
                text: "Son 7 aydır denedikleri cinsel birlikteliklerin yaklaşık %80'inde cinsel etkinliği tamamlayamadan sertliğin kaybolduğunu anlatıyor.",
                highlightTags: ["Son 7 aydır", "yaklaşık %80'inde sertliğin kaybolduğunu"]
            },
            {
                order: 3,
                title: "Gece / Sabah Ereksiyonlarının Varlığı",
                text: "Sabahları uyandığında veya kendi kendine mastürbasyon yaparken tam sertleşme yaşayabildiğini, sorunun sadece partnerle ilişkide ortaya çıktığını söylüyor.",
                highlightTags: ["Sabahları uyandığında tam sertleşme yaşayabildiğini", "sadece partnerle ilişkide"]
            },
            {
                order: 4,
                title: "Seyirci Kalma (Spectatoring) Kaygısı",
                text: "İlişki sırasında zihninin sürekli 'Acaba sertleşecek mi? Sönecek mi?' sorularıyla meşgul olduğunu, kendi bedenini dışarıdan bir seyirci gibi izlediğini belirtiyor.",
                highlightTags: ["kendi bedenini dışarıdan bir seyirci gibi izlediğini", "seyirci kalma"]
            },
            {
                order: 5,
                title: "Tıbbi Muayene Sonuçları",
                text: "Üroloji ve endokrinoloji konsültasyonlarında testosteron, damarsal akım (Doppler) ve kan şekeri düzeylerinin tamamen normal olduğu saptandı.",
                highlightTags: ["tamamen normal olduğu saptandı", "organik neden yok"]
            },
            {
                order: 6,
                title: "DSM-5 Tanı Kriteri",
                text: "Danışan en az [[6 aydır cinsel etkinlik sırasında sertleşmeyi sağlayamama veya cinsel etkinlik tamamlanana dek sürdürememe]] güçlüğü yaşamaktadır.",
                highlightTags: ["6 aydır cinsel etkinlik sırasında sertleşmeyi sağlayamama veya cinsel etkinlik tamamlanana dek sürdürememe"]
            }
        ],
        patientSummary: "38 yaşında erkek danışan, 7 aydır partnerli ilişkilerde sertliği sürdürememe ve seyirci kalma kaygısı yaşamakta; sabah ereksiyonları korunmuştur (psikojenik).",
        dsmAnalysis: "DSM-5 Sertleşme Bozukluğu (Erectile Disorder): Cinsel etkinlik sırasında sertliği elde etmede, sürdürmede veya sertliğin derecesinde en az 6 ay süren belirgin azalmadır. Sabah ereksiyonlarının olması psikojenik kökeni destekler.",
        differentialDiagnosis: [
            { diagnosis: "Organik Erektil Disfonksiyon (Vasküler/Nörolojik)", reason: "Organik kökende sabah/gece ereksiyonları ve mastürbasyonda da sertleşme olmaz. Danışanda sabah ereksiyonları tamdır." },
            { diagnosis: "Erken Boşalma", reason: "Erken boşalmada ereksiyon tamdır ama süre çok kısadır; sertleşme kaybı birincil sorun değildir." },
            { diagnosis: "Erkek Hipoaktif Cinsel İstek Bozukluğu", reason: "Bu tabloda cinsel arzu ve fanteziler tamamen kayıptır; danışan ise ilişkiyi güçlü bir şekilde arzulamaktadır." }
        ],
        treatmentModality: {
            goldStandardTherapy: "Duyusal Odaklanma & BDT (Sensate Focus / Masters & Johnson)",
            therapyDetails: "Penetrasyon yasağı altında kademeli duyusal odaklanma egzersizleri, 'seyirci kalma' anksiyetesini söndürme ve performans bilişlerini yeniden yapılandırma yapılır.",
            pharmacologyNote: "Gerektiğinde anksiyete döngüsünü kırmak için geçici olarak PDE5 inhibitörleri (Sildenafil, Tadalafil) seanslara entegre edilebilir."
        },
        miniQuiz: {
            question: "Erektil Bozukluğun psikojenik (psikolojik) mi yoksa organik (damarsal/nörolojik) mi olduğunu ayırt etmede en değerli klinik ipucu nedir?",
            options: ["Sabah uyanma ereksiyonlarının ve mastürbasyondaki sertleşmenin korunmuş olması", "Danışanın yaşının 60'ın üzerinde olması", "Erektil sorunun her gün aynı saatte olması", "Danışanın hiç spor yapmaması"],
            correctIndex: 0,
            explanation: "Sabah ereksiyonlarının ve yalnızken mastürbasyondaki sertleşmenin normal olması, sinir ve damar sisteminin sağlam olduğunu; sorunun performans kaygısına bağlı psikojenik olduğunu gösterir."
        }
    },

    // 79. Deliryum (Akut Konfüzyonel Durum)
    {
        id: "case-079",
        diagnosisId: "delirium",
        therapyId: "cbt_general",
        difficulty: 2,
        age: 74,
        gender: "Kadın",
        occupation: "Emekli Öğretmen",
        chiefComplaint: "İdrar yolu enfeksiyonu sonrası 2 gün içinde başlayan ani bilinç bulanıklığı, halüsinasyonlar ve zaman-mekan yönelim kaybı.",
        clues: [
            {
                order: 1,
                title: "İlk Başvuru & Yakınlarının Bildirimi",
                text: "74 yaşındaki hastanın kızı, 'Annem 2 gün öncesine kadar gayet aklı başındaydı, dün geceden beri odada böcekler gördüğünü söylüyor ve bizi tanımakta zorlanıyor' dedi.",
                highlightTags: ["2 gün öncesine kadar gayet aklı başındaydı", "odada böcekler gördüğünü"]
            },
            {
                order: 2,
                title: "Akut Başlangıç ve Dalgalı Seyir",
                text: "Belirtilerin 48 saat içinde aniden başladığını; gündüzleri nispeten sakinleşip geceleri aşırı ajite olduğunu (dalgalı seyir - fluctuating course) belirtiyorlar.",
                highlightTags: ["48 saat içinde aniden başladığını", "dalgalı seyir"]
            },
            {
                order: 3,
                title: "Dikkat ve Farkındalıkta Bozulma",
                text: "Muayene sırasında hastanın basit bir soruya dahi dikkatini odaklayamadığı, dikkatinin saniyeler içinde dağıldığı ve çevreyle temasının koptuğu gözlendi.",
                highlightTags: ["dikkatini odaklayamadığı", "farkındalıkta bozulma"]
            },
            {
                order: 4,
                title: "Görsel Varsanılar ve Dezorganizasyon",
                text: "Hastanın yatak çarşafından hayali iplikler topladığı, duvarda adamların yürüdüğünü iddia ettiği ve anlamsız kelimeler mırıldandığı kaydedildi.",
                highlightTags: ["çarşafından hayali iplikler topladığı", "görsel varsanılar"]
            },
            {
                order: 5,
                title: "Tıbbi Etiyoloji",
                text: "Laboratuvar tetkiklerinde şiddetli idrar yolu enfeksiyonu (lökositoz, yüksek CRP) ve dehidrasyon tespit edildi.",
                highlightTags: ["idrar yolu enfeksiyonu", "tıbbi etiyoloji"]
            },
            {
                order: 6,
                title: "DSM-5 Tanı Kriteri",
                text: "Hastada [[kısa bir süre içinde gelişen dikkat ve farkındalıkta bozulma, bilişte ek bozulmalar ve gün içinde dalgalanma]] sergileyen akut tablo mevcuttur.",
                highlightTags: ["kısa bir süre içinde gelişen dikkat ve farkındalıkta bozulma, bilişte ek bozulmalar ve gün içinde dalgalanma"]
            }
        ],
        patientSummary: "74 yaşında kadın hasta, idrar yolu enfeksiyonu zemininde 2 günde gelişen dikkat dağınıklığı, görsel halüsinasyonlar ve gece kötüleşen dalgalı bilinç bulanıklığı yaşamaktadır.",
        dsmAnalysis: "DSM-5 Deliryum Tanı Kriterleri: Dikkati odaklama ve sürdürme yetisinde bozulma, farkındalıkta azalma, saatler/günler içinde hızlı gelişim, gün içinde dalgalanma ve genel tıbbi bir duruma bağlı olmadır.",
        differentialDiagnosis: [
            { diagnosis: "Majör Nörobilişsel Bozukluk (Demans / Alzheimer)", reason: "Demans aylar/yıllar içinde sinsi ve ilerleyici gelişir; bilinç düzeyi korunur. Deliryum ise saatler/günler içinde akut başlar ve dalgalı bilinç bulanıklığı vardır." },
            { diagnosis: "Geç Başlangıçlı Şizofreni", reason: "Şizofrenide dikkat ve bilinç açıkken işitsel hezeyanlar hakimdir; tıbbi enfeksiyona bağlı ani başlangıç ve görsel böcek varsanıları deliryum için tipiktir." },
            { diagnosis: "Psikotik Özellikli Depresyon", reason: "Depresyonda akut dikkat çökmesi ve dalgalı konfüzyonel tablo beklenmez." }
        ],
        treatmentModality: {
            goldStandardTherapy: "Altta Yatan Tıbbi Nedenin Tedavisi & Çevresel Reoryantasyon",
            therapyDetails: "Enfeksiyonun hızla antibiyotikle tedavisi, odanın aydınlatılması, saate/takvime bakmasını sağlama, tanıdık aile bireylerinin yanında kalması (Reoryantasyon).",
            pharmacologyNote: "Ağır ajitasyon ve halüsinasyonları yatıştırmak için düşük doz Haloperidol veya Ketiyapin kısa süreli kullanılabilir."
        },
        miniQuiz: {
            question: "Deliryumu Alzheimer tipi Demanstan ayıran en kritik iki klinik özellik hangisidir?",
            options: ["Akut (saatler-günler içinde) başlangıç ve gün içinde dalgalanan dikkat/bilinç bulanıklığı", "Hastanın yaşının genç olması", "Demansın sadece erkeklerde görülmesi", "Deliryumda hiçbir tıbbi nedenin bulunamaması"],
            correctIndex: 0,
            explanation: "Deliryum saatler-günler içinde çok hızlı başlar ve gün içinde dalgalı bir bilinç/dikkat bozulması gösterir. Demans ise sinsi ve aylar-yıllar içinde ilerler."
        }
    },

    // 80. Majör Nörobilişsel Bozukluk (Alzheimer Tipi Demans)
    {
        id: "case-080",
        diagnosisId: "major_neurocognitive_alzheimer",
        therapyId: "cbt_general",
        difficulty: 1,
        age: 78,
        gender: "Erkek",
        occupation: "Emekli Banka Müdürü",
        chiefComplaint: "Son 2 yıldır sinsi şekilde ilerleyen yakın bellek kaybı, faturaları ödeyememe, yolunu kaybetme ve isimleri unutma.",
        clues: [
            {
                order: 1,
                title: "İlk Başvuru",
                text: "78 yaşındaki hastayı çocukları getirdi. 'Babam 40 yıllık bankacıydı ama son 1 yıldır evinin yolunu karıştırıyor ve torunlarının isimlerini unutuyor' dediler.",
                highlightTags: ["evinin yolunu karıştırıyor", "torunlarının isimlerini unutuyor"]
            },
            {
                order: 2,
                title: "Sinsi Başlangıç ve İlerleyici Seyir",
                text: "Belirtilerin yaklaşık 2-3 yıl önce anahtar ve cüzdan kaybetmeyle başladığı, zamanla giderek kötüleştiği (sinsi başlangıç ve tedrici kötüleşme) kaydedildi.",
                highlightTags: ["2-3 yıl önce", "sinsi başlangıç ve tedrici kötüleşme"]
            },
            {
                order: 3,
                title: "Yakın Bellek Bozulması (Retrograd Korunmuş)",
                text: "50 yıl önceki askerlik anılarını ve çocukluğunu çok net anlatırken, sabah ne kahvaltı yaptığını veya 5 dakika önce sorduğu soruyu tekrar sorduğu saptandı.",
                highlightTags: ["50 yıl önceki anıları net", "sabah ne kahvaltı yaptığını unuttuğu"]
            },
            {
                order: 4,
                title: "Yönetsel İşlev ve Günlük Yaşam Bağımsızlığı Kaybı",
                text: "Bankadaki parasını yönetemediği, ilaçlarını karıştırıp yanlış aldığı ve tek başına dışarı çıkamadığı (enstrümental günlük yaşam aktivitelerinde bağımlılık) bildirildi.",
                highlightTags: ["parasını yönetemediği", "günlük yaşam aktivitelerinde bağımlılık"]
            },
            {
                order: 5,
                title: "Nörogörüntüleme & Bilinç Açıklığı",
                text: "Beyin MR'ında bilateral belirgin hipokampal atrofi saptandı; hastanın uyanıklık ve bilinç düzeyi tamamen berraktır.",
                highlightTags: ["hipokampal atrofi", "bilinç düzeyi tamamen berrak"]
            },
            {
                order: 6,
                title: "DSM-5 Tanı Kriteri",
                text: "Hastada [[öğrenme ve bellek alanında belirgin bilişsel gerileme ve günlük yaşam aktivitelerinde bağımsızlığın yitirilmesi]] ile seyreden sinsi ilerleyici tablo mevcuttur.",
                highlightTags: ["öğrenme ve bellek alanında belirgin bilişsel gerileme ve günlük yaşam aktivitelerinde bağımsızlığın yitirilmesi"]
            }
        ],
        patientSummary: "78 yaşında erkek hasta, 2 yıldır ilerleyen yakın bellek kaybı, yönetsel işlev bozukluğu ve hipokampal atrofi sergilemekte; günlük yaşam aktivitelerinde bağımsızlığını yitirmiştir.",
        dsmAnalysis: "DSM-5 Majör Nörobilişsel Bozukluk (Alzheimer Tipi): Bir veya daha fazla bilişsel alanda (özellikle öğrenme ve bellek) önceki işlevsellik düzeyine göre belirgin gerileme olması ve bu gerilemenin günlük yaşam aktivitelerinde bağımsızlığı engellemesidir.",
        differentialDiagnosis: [
            { diagnosis: "Deliryum", reason: "Deliryumda bilinç bulanıklığı, ani başlangıç ve dalgalı seyir vardır; Alzheimer'da bilinç açıktır ve süreç sinsi-kroniktir." },
            { diagnosis: "Hafif Nörobilişsel Bozukluk (MCI)", reason: "Hafif NBB'de hasta günlük yaşam aktivitelerini bağımsız yürütebilir; Majör NBB'de bağımsızlık kaybedilmiştir." },
            { diagnosis: "Psödotetriyum / Depresif Yalancı Demans", reason: "Yalancı demansta hasta 'bilmiyorum' der ve çaba göstermez; antidepresanla bellek düzelir. Alzheimer'da ise hasta konfabulasyon yapar ve beyin atrofisi vardır." }
        ],
        treatmentModality: {
            goldStandardTherapy: "Bilişsel Uyarım Terapisi & Bakıcı Psiko-eğitimi",
            therapyDetails: "Anımsama terapisi (Reminiscence therapy), güvenli ev ortamı düzenlemeleri, günlük rutinlerin sabitlenmesi ve bakıcı tükenmişliğini önleme desteği verilir.",
            pharmacologyNote: "Asetilkolinesteraz inhibitörleri (Donepezil, Rivastigmin) ve NMDA reseptör antagonisti (Memantin) semptomatik ilerlemeyi yavaşlatmak için kullanılır."
        },
        miniQuiz: {
            question: "Majör Nörobilişsel Bozukluğu (Demans) Hafif Nörobilişsel Bozukluktan (MCI) ayıran en temel DSM-5 kriteri nedir?",
            options: ["Bilişsel kayıpların günlük yaşam aktivitelerinde bağımsızlığı engellemesi ve başkasına bağımlı kılması", "Hastanın 70 yaşın üzerinde olması", "MR'da hiçbir şey görülmemesi", "Hastanın sadece rüya görmesi"],
            correctIndex: 0,
            explanation: "Hafif NBB'de kişi günlük işlerini (para hesabı, yemek, ilaç) bağımsız yapabilir; Majör NBB'de ise günlük yaşam bağımsızlığı yitirilmiştir."
        }
    },

    // 81. Yalancı Gebelik (Psödosiyezis)
    {
        id: "case-081",
        diagnosisId: "pseudocyesis",
        therapyId: "cbt_general",
        difficulty: 3,
        age: 35,
        gender: "Kadın",
        occupation: "Ev Hanımı",
        chiefComplaint: "Hamile olmadığı halde karnının büyümesi, adetten kesilme, memelerden süt gelmesi ve bebek tekmeleri hissettiği inancı.",
        clues: [
            {
                order: 1,
                title: "İlk Başvuru",
                text: "35 yaşındaki danışan, '7 aylık hamileyim, bebeğim karnımda tekmeliyor ama doktorlar bebeğimi benden saklıyor' diyerek doğum kliniğine başvurdu.",
                highlightTags: ["7 aylık hamileyim", "bebeğim karnımda tekmeliyor"]
            },
            {
                order: 2,
                title: "Fiziksel Gebelik Belirtileri",
                text: "Karnında belirgin distansiyon (büyüme), 6 aydır amenore (adet görememe), memelerde büyüme, koyulaşma ve galaktore (süt salgısı) olduğu saptandı.",
                highlightTags: ["Karnında belirgin distansiyon", "amenore", "memelerden süt salgısı"]
            },
            {
                order: 3,
                title: "Tıbbi ve Ultrason Muayenesi",
                text: "Yapılan 3 farklı kanda beta-hCG gebelik testinin negatif olduğu ve pelvik ultrasonda uterusun tamamen boş olduğu görüldü.",
                highlightTags: ["beta-hCG testinin negatif olduğu", "ultrasonda uterusun tamamen boş"]
            },
            {
                order: 4,
                title: "Geçmiş Öykü & Travmatik Kısırlık",
                text: "Danışanın 8 yıldır çocuk sahibi olmak istediği, 4 başarısız tüp bebek denemesi geçirdiği ve eşinin ailesi tarafından yoğun baskı gördüğü öğrenildi.",
                highlightTags: ["4 başarısız tüp bebek denemesi", "yoğun baskı gördüğü"]
            },
            {
                order: 5,
                title: "Somatik ve Endokrin Değişiklikler",
                text: "Yoğun çocuk arzusu ve stresin hipotalamo-hipofizer aksı etkileyerek prolaktin ve LH dalgalanmalarıyla sahte fiziksel gebelik tablosu ürettiği değerlendirildi.",
                highlightTags: ["sahte fiziksel gebelik tablosu"]
            },
            {
                order: 6,
                title: "DSM-5 Tanı Kriteri",
                text: "Danışan gebe olmadığı halde [[gebe olduğuna dair yanlış bir inançla birlikte amenore, karın büyümesi ve fetal hareket algısı]] gibi objektif gebelik belirtileri sergilemektedir.",
                highlightTags: ["gebe olduğuna dair yanlış bir inançla birlikte amenore, karın büyümesi ve fetal hareket algısı"]
            }
        ],
        patientSummary: "35 yaşında kadın danışan, tekrarlayan başarısız tüp bebek öyküsü sonrası kanda ve ultrasonda gebelik olmamasına rağmen amenore, karın büyümesi ve laktasyonla seyreden psödosiyezis tablosundadır.",
        dsmAnalysis: "DSM-5 Bedensel Belirti ve İlişkili Bozukluklar - Başka Türlü Adlandırılmamış Somatik Bozukluk: Psödosiyezis (Yalancı Gebelik), gebe olunmadığı halde gebe olunduğuna dair yanlış inanç ve karın büyümesi, amenore, süt gelmesi gibi fiziksel belirtilerin eşlik etmesidir.",
        differentialDiagnosis: [
            { diagnosis: "Sanrısal Bozukluk (Somatik Tip)", reason: "Sanrısal bozuklukta sadece izole bir inanç vardır, prolaktin artışı, karın büyümesi ve memeden süt gelmesi gibi objektif fiziksel/endokrin belirtiler görülmez." },
            { diagnosis: "Yapay Bozukluk (Munchausen)", reason: "Yapay bozuklukta hasta bilerek ve isteyerek sahte belirti üretir; psödosiyeziste fiziksel ve hormonal belirtiler bilinçdışı ve istemsizdir." },
            { diagnosis: "Gerçek Gebelik", reason: "Beta-hCG ve ultrason ile kesin olarak dışlanmıştır." }
        ],
        treatmentModality: {
            goldStandardTherapy: "Bilişsel Davranışçı Terapi & Psikodinamik Yas Terapisi",
            therapyDetails: "Ultrason sonuçlarının nazikçe gösterilmesi, kısırlık ve çocuk sahibi olamama travmasının yasının çalışılması, aile baskısının azaltılması hedeflenir.",
            pharmacologyNote: "Ağır depresif belirtiler ve prolaktin yüksekliği için uygun medikal ve psikiyatrik düzenleme yapılır."
        },
        miniQuiz: {
            question: "Psödosiyezisi (Yalancı Gebelik) Somatik Tip Sanrısal Bozukluktan ayıran en temel klinik fark nedir?",
            options: ["Psödosiyeziste amenore, karın büyümesi ve süt salgısı gibi gerçek bedensel/hormonal değişikliklerin de eşlik etmesi", "Psödosiyezisin sadece erkeklerde görülmesi", "Sanrısal bozuklukta ultrasonda bebek görülmesi", "Psödosiyezisin 1 günde kendiliğinden geçmesi"],
            correctIndex: 0,
            explanation: "Psödosiyeziste sadece psikolojik bir inanç değil, aynı zamanda karın büyümesi, adetten kesilme ve süt gelmesi gibi nöroendokrin kaynaklı somatik değişimler de mevcuttur."
        }
    },

    // 82. Koku Referans Bozukluğu (Olfactory Reference Disorder)
    {
        id: "case-082",
        diagnosisId: "olfactory_reference",
        therapyId: "erp",
        difficulty: 2,
        age: 23,
        gender: "Erkek",
        occupation: "Üniversite Öğrencisi",
        chiefComplaint: "Vücudundan dayanılmaz bir çürük soğan/lağım kokusu yayıldığı takıntısı, sürekli duş alma ve insanlardan kaçınma.",
        clues: [
            {
                order: 1,
                title: "İlk Başvuru",
                text: "23 yaşındaki danışan, 'Hocam benden öyle iğrenç bir koku yayılıyor ki otobüsteki herkes burnunu kapatıyor, kokumu bastıramıyorum' diyerek başvurdu.",
                highlightTags: ["benden öyle iğrenç bir koku yayılıyor ki", "kokumu bastıramıyorum"]
            },
            {
                order: 2,
                title: "Çevresel Değerlendirme & Koku Yokluğu",
                text: "Terapist, ailesi ve arkadaşları tarafından yapılan değerlendirmede danışandan hiçbir kötü koku yayılmadığı, hijyeninin kusursuz olduğu teyit edildi.",
                highlightTags: ["hiçbir kötü koku yayılmadığı", "hijyeninin kusursuz olduğu"]
            },
            {
                order: 3,
                title: "Referans Fikirleri (Alınganlık)",
                text: "Biri burnuna dokunduğunda, pencereyi açtığında veya öksürdüğünde bunu 'benim pis kokumdan rahatsız oldular' şeklinde yorumladığını anlatıyor.",
                highlightTags: ["biri burnuna dokunduğunda", "benim pis kokumdan rahatsız oldular"]
            },
            {
                order: 4,
                title: "Kompulsif Güvenlik ve Temizlik Davranışları",
                text: "Günde 5 kez duş aldığını, yanından 3 farklı deodorant ve parfüm şişesini ayırmadığını, günde 10 kez kıyafet değiştirdiğini belirtiyor.",
                highlightTags: ["Günde 5 kez duş aldığını", "yanından 3 farklı deodorant"]
            },
            {
                order: 5,
                title: "Sosyal İzolasyon ve Eve Kapanma",
                text: "Koku yayma utancıyla üniversitedeki derslere gitmeyi bıraktığını ve son 3 aydır odasından nadiren çıktığını söylüyor.",
                highlightTags: ["derslere gitmeyi bıraktığını", "odasından nadiren çıktığını"]
            },
            {
                order: 6,
                title: "DSM-5-TR / ICD-11 Tanı Kriteri",
                text: "Danışan [[başkalarınca algılanmayan kötü bir vücut kokusu yaydığına dair sürekli bir zihinsel uğraş]] ve buna eşlik eden aşırı temizlik kompulsiyonları sergilemektedir.",
                highlightTags: ["başkalarınca algılanmayan kötü bir vücut kokusu yaydığına dair sürekli bir zihinsel uğraş"]
            }
        ],
        patientSummary: "23 yaşında erkek danışan, gerçekte olmadığı halde etrafa iğrenç bir koku yaydığına inanmakta; günde 5 kez duş almakta ve referans düşünceleriyle eve kapanmaktadır.",
        dsmAnalysis: "DSM-5-TR / ICD-11 Koku Referans Bozukluğu (Obsesif-Kompulsif ve İlişkili Bozukluklar): Başkalarınca algılanamayan kötü bir vücut kokusu (ter, ağız, anüs vb.) yaydığına dair aşırı uğraş, başkalarının hareketlerini referans alma ve tekrarlayıcı koklama/yıkama eylemleridir.",
        differentialDiagnosis: [
            { diagnosis: "Beden Algısı Bozukluğu (Dismorfofobi)", reason: "Dismorfofobide odak görünüşteki (burun, saç, deri) kusurlardır; Koku Referans Bozukluğunda odak yaydığı düşünülen kokudur." },
            { diagnosis: "Şizofreni / Sanrısal Bozukluk", reason: "Burada içgörü değişken veya zayıf olabilir ancak disorganize düşünce, negatif belirtiler veya bizar sanrılar yoktur; tablo OKB spektrumundadır." },
            { diagnosis: "Sosyal Anksiyete Bozukluğu", reason: "Sosyal fobide rezil olma korkusu konuşma ve performans odaklıdır; koku takıntısı ve kompulsif yıkama birincil değildir." }
        ],
        treatmentModality: {
            goldStandardTherapy: "Tepki Önleme ile Maruz Bırakma (ERP) & Bilişsel Terapi",
            therapyDetails: "Parfüm/deodorant sıkmadan ve duş sayısını 1'e indirerek insan içine çıkma maruziyeti, başkalarının davranışlarını tarafsız test etme davranışsal deneyleri.",
            pharmacologyNote: "Yüksek doz SSRI (Sertralin, Fluoksetin) ve gerekirse düşük doz atipik antipsikotik güçlendirmesi (Aripiprazol) uygulanır."
        },
        miniQuiz: {
            question: "Koku Referans Bozukluğu (Olfactory Reference Disorder) DSM-5 ve ICD-11'de hangi ana tanı kategorisi altında sınıflandırılır?",
            options: ["Obsesif-Kompulsif ve İlişkili Bozukluklar", "Şizofreni Spektrumu", "Madde Bağımlılığı", "Yeme Bozuklukları"],
            correctIndex: 0,
            explanation: "Koku referans bozukluğu, Beden Dismorfik Bozukluğuna benzer mekanizması nedeniyle Obsesif-Kompulsif ve İlişkili Bozukluklar spektrumunda yer alır."
        }
    },

    // 83. Uzatılmış Yas Bozukluğu (Prolonged Grief Disorder - DSM-5-TR)
    {
        id: "case-083",
        diagnosisId: "prolonged_grief_disorder",
        therapyId: "ipt",
        difficulty: 2,
        age: 52,
        gender: "Kadın",
        occupation: "Ev Hanımı",
        chiefComplaint: "18 ay önce eşini kaybettikten sonra hayatın anlamını tamamen yitirme, yoğun hasret ve mezardan ayrılamama.",
        clues: [
            {
                order: 1,
                title: "İlk Başvuru",
                text: "52 yaşındaki danışan, 'Eşim öleli 1.5 yıl oldu ama benim için zaman o gün durdu. Bir parçam onunla birlikte gömüldü, nefes aldığım için suçluluk duyuyorum' dedi.",
                highlightTags: ["benim için zaman o gün durdu", "nefes aldığım için suçluluk duyuyorum"]
            },
            {
                order: 2,
                title: "Yoğun Özlem ve Zihinsel Uğraş",
                text: "Günün neredeyse her saatinde ölen eşine karşı dayanılmaz bir hasret duyduğunu, eşinin kıyafetlerine sarılarak ağladığını ve eşyalarını tek bir milim dahi oynatmadığını anlatıyor.",
                highlightTags: ["dayanılmaz bir hasret duyduğunu", "eşyalarını tek bir milim dahi oynatmadığını"]
            },
            {
                order: 3,
                title: "Kimlik Bozulması ve Anlamsızlık",
                text: "'O olmadan ben kimim bilmiyorum, kendimi bir ceset gibi hissediyorum' diyerek geleceğe dair hiçbir plan yapamadığını ifade ediyor.",
                highlightTags: ["O olmadan ben kimim bilmiyorum", "kendimi bir ceset gibi"]
            },
            {
                order: 4,
                title: "Ölümü Kabul Etmekte Yoğun Güçlük",
                text: "Hala kapı çaldığında eşinin geleceğini sandığını, ölüm gerçeğini zihnen kabul edemediğini ve derin bir duygusal uyuşukluk içinde olduğunu belirtiyor.",
                highlightTags: ["ölüm gerçeğini zihnen kabul edemediğini", "duygusal uyuşukluk"]
            },
            {
                order: 5,
                title: "Süre Kriteri (Yetişkinde >12 Ay)",
                text: "Kayıp olayının üzerinden tam 18 ay geçmiş olmasına rağmen acının şiddetinde hiçbir azalma olmadığını, aksine giderek yalnızlaştığını vurguluyor.",
                highlightTags: ["tam 18 ay geçmiş olmasına rağmen", "acının şiddetinde hiçbir azalma olmadığını"]
            },
            {
                order: 6,
                title: "DSM-5-TR Tanı Kriteri",
                text: "Danışanda [[sevilen birinin ölümünden en az 12 ay sonra devam eden yoğun özlem, kimlik karmaşası, derin duygusal acı ve kabullenememe]] tablosu mevcuttur.",
                highlightTags: ["sevilen birinin ölümünden en az 12 ay sonra devam eden yoğun özlem, kimlik karmaşası, derin duygusal acı ve kabullenememe"]
            }
        ],
        patientSummary: "52 yaşında kadın danışan, eşinin vefatından 18 ay geçmesine rağmen kronik yoğun özlem, kimliğin bir parçasının yitimi ve ölüm gerçeğini kabul edememe yaşamaktadır.",
        dsmAnalysis: "DSM-5-TR Uzatılmış Yas Bozukluğu (Prolonged Grief Disorder): Sevilen birinin ölümünden sonra yetişkinlerde en az 12 ay (çocuk/ergende 6 ay) boyunca ölene karşı yoğun özlem/hasret, kimlik bozulması, öfke, derin uyuşukluk ve yaşama devam edememedir.",
        differentialDiagnosis: [
            { diagnosis: "Normal Yas (Uncomplicated Bereavement)", reason: "Normal yasta dalgalar halinde üzüntü gelir ancak kişi zamanla hayata adapte olur ve benlik değeri korunur; Uzatılmış Yasta 12 ay sonra patolojik kilitlenme vardır." },
            { diagnosis: "Majör Depresif Bozukluk", reason: "Depresyonda genel değersizlik, evrensel anhedoni ve yetersizlik vardır; Uzatılmış Yasta acının odağı tamamen ölen kişiye duyulan hasrettir." },
            { diagnosis: "Travma Sonrası Stres Bozukluğu", reason: "TSSB'de dehşet verici travmatik anının yeniden yaşantılanması ve kaçınma hakimdir; yas bozukluğunda ise hasret ve kayıp duygusu esastır." }
        ],
        treatmentModality: {
            goldStandardTherapy: "Uzatılmış Yas Terapisi (Prolonged Grief Therapy - PGT / Shear Modeli)",
            therapyDetails: "Ölüm hikayesinin yeniden anlatımı ile travmatik blokajın çözülmesi, ölen kişiyle zihinsel anıların entegrasyonu ve yeni yaşam hedeflerinin inşası çalışılır.",
            pharmacologyNote: "Eşlik eden şiddetli depresif semptomlar ve uykusuzluk için SSRI/SNRI antidepresanlar kullanılabilir."
        },
        miniQuiz: {
            question: "DSM-5-TR'ye göre yetişkinlerde 'Uzatılmış Yas Bozukluğu' tanısı konulabilmesi için kaybın üzerinden en az ne kadar süre geçmiş olmalıdır?",
            options: ["En az 1 ay", "En az 3 ay", "En az 6 ay", "En az 12 ay"],
            correctIndex: 3,
            explanation: "DSM-5-TR kriterlerine göre yetişkinlerde Uzatılmış Yas Bozukluğu tanısı için sevilen birinin vefatından sonra en az 12 ay geçmiş olması gerekir."
        }
    },

    // 84. İnternet Oyun Oynama Bozukluğu
    {
        id: "case-084",
        diagnosisId: "internet_gaming_disorder",
        therapyId: "motivational_interviewing",
        difficulty: 1,
        age: 20,
        gender: "Erkek",
        occupation: "Üniversite Öğrencisi",
        chiefComplaint: "Günde 14 saat online rekabetçi oyun oynama, üniversiteden atılma eşiğine gelme ve oyun oynamayınca aşırı öfke patlamaları.",
        clues: [
            {
                order: 1,
                title: "İlk Başvuru",
                text: "20 yaşındaki genç, ailesinin zoruyla getirildi. 'Bilgisayar başından kalkmıyor, yemek yemeyi bile unutuyor, interneti kapatınca evi birbirine katıyor' denildi.",
                highlightTags: ["Bilgisayar başından kalkmıyor", "interneti kapatınca evi birbirine katıyor"]
            },
            {
                order: 2,
                title: "Tolerans ve Süre Artışı",
                text: "Başlangıçta günde 2 saat oynarken, son 1 yıldır aynı tatmini almak için süreyi günde 12-14 saate çıkardığını anlatıyor.",
                highlightTags: ["süreyi günde 12-14 saate çıkardığını", "tolerans"]
            },
            {
                order: 3,
                title: "Yoksunluk Belirtileri",
                text: "Oyundan uzak kaldığında yoğun huzursuzluk, kaygı, sinirlilik ve sürekli oyundaki stratejileri düşünme (craving) yaşadığını kabul ediyor.",
                highlightTags: ["yoğun huzursuzluk, kaygı, sinirlilik", "yoksunluk"]
            },
            {
                order: 4,
                title: "Kontrolü Kaybetme ve Başarısız Bırakma Girişimleri",
                text: "Defalarca oyunu silip tekrar yüklediğini, 'bu gece sadece 1 maç atacağım' deyip sabahladığını söylüyor.",
                highlightTags: ["Defalarca oyunu silip tekrar yüklediğini", "kontrolü kaybetme"]
            },
            {
                order: 5,
                title: "Önemli Fırsatların Kaybı ve Yalan Söyleme",
                text: "Üniversitedeki tüm vizelere girmediği için sınıfta kaldığını, ailesine ise 'dersler çok iyi gidiyor' şeklinde yalan söylediğini belirtiyor.",
                highlightTags: ["sınıfta kaldığını", "ailesine yalan söylediğini"]
            },
            {
                order: 6,
                title: "DSM-5 Bölüm III Kriteri",
                text: "Danışanda [[son 12 aydır internet üzerinden oyun oynamaya yönelik tekrarlayan, kontrol edilemeyen ve işlevselliği bozan aşırı düşkünlük]] mevcuttur.",
                highlightTags: ["son 12 aydır internet üzerinden oyun oynamaya yönelik tekrarlayan, kontrol edilemeyen ve işlevselliği bozan aşırı düşkünlük"]
            }
        ],
        patientSummary: "20 yaşında erkek danışan, 1 yıldır günde 14 saat online oyun oynamakta; yoksunluk, tolerans, kontrol kaybı yaşamakta ve okulu terk etme noktasına gelmiştir.",
        dsmAnalysis: "DSM-5 İnternet Oyun Oynama Bozukluğu (Internet Gaming Disorder): 12 aylık sürede oyunla aşırı zihinsel meşguliyet, yoksunluk, tolerans, başarısız bırakma girişimleri, diğer ilgilerin kaybı ve yalan söyleme kriterlerinden en az 5'inin bulunmasıdır.",
        differentialDiagnosis: [
            { diagnosis: "Kumar Oynama Bozukluğu", reason: "Kumar bozukluğunda maddi kazanç/kayıp ve para bahisleri esastır; burada dijital video oyunu oynama davranışı vardır." },
            { diagnosis: "DEHB (Dikkat Eksikliği ve Hiperaktivite)", reason: "DEHB'li bireyler video oyunlarının hızlı dopamin döngüsüne sığınabilir; ancak burada bağımlılık döngüsü ve yoksunluk tablosu birincildir." },
            { diagnosis: "Normal Rekreasyonel Oyun Oynama", reason: "Normal oyunda okul/iş kaybı, yalan söyleme ve yoksunluk öfkesi yaşanmaz." }
        ],
        treatmentModality: {
            goldStandardTherapy: "Motivasyonel Görüşme (MI) & Bilişsel Davranışçı Terapi (CBT-IA)",
            therapyDetails: "Değişim ambivalansını çözme, ekran süresi kısıtlama planı, alternatif yüz yüze sosyal aktivitelerin inşası ve tetikleyici duyguların BDT ile regülasyonu.",
            pharmacologyNote: "Eşlik eden anksiyete ve dürtüsellik için SSRI veya Bupropion düşünülebilir."
        },
        miniQuiz: {
            question: "İnternet Oyun Oynama Bozukluğunda danışanın oyundan uzaklaştırıldığında yaşadığı huzursuzluk ve öfke hangi bağımlılık fenomenidir?",
            options: ["Yoksunluk (Withdrawal)", "Tolerans", "Konfabulasyon", "Transfersans"],
            correctIndex: 0,
            explanation: "Oyun kısıtlandığında veya erişim kesildiğinde ortaya çıkan irritabilite, anksiyete ve öfke tipik bir yoksunluk (withdrawal) belirtisidir."
        }
    },

    // 85. Komorbid Panik Bozukluk ve Şiddetli Agorafobi
    {
        id: "case-085",
        diagnosisId: "panic_disorder",
        therapyId: "interoceptive_exposure",
        difficulty: 2,
        age: 31,
        gender: "Kadın",
        occupation: "Grafik Tasarımcı",
        chiefComplaint: "Aniden gelen kalp çarpıntısı, boğulma hissi ve panik ataklar nedeniyle son 4 aydır evden dışarı adım atamama.",
        clues: [
            {
                order: 1,
                title: "İlk Başvuru",
                text: "31 yaşındaki danışan evine online terapi talebiyle ulaştı: 'Kapının eşiğinden adım attığım an kalbim fırlayacak gibi oluyor, bayılıp rezil olacağımdan korkuyorum' dedi.",
                highlightTags: ["Kapının eşiğinden adım attığım an", "bayılıp rezil olacağımdan korkuyorum"]
            },
            {
                order: 2,
                title: "Beklenmedik Panik Ataklar",
                text: "Hiçbir görünür tetikleyici yokken aniden göğüste sıkışma, nefes darlığı, terleme, titreme ve 'çıldırıyorum / ölüyorum' dehşetinin dakikalar içinde zirveye çıktığını anlatıyor.",
                highlightTags: ["Beklenmedik panik ataklar", "dakikalar içinde zirveye çıktığını"]
            },
            {
                order: 3,
                title: "Beklenti Anksiyetesi (Anticipatory Anxiety)",
                text: "İlk ataktan sonra 'Acaba bir daha ne zaman atak gelecek?' endişesiyle sürekli nabzını ölçtüğünü ve acil servis kapılarına yakın yerlerde durduğunu belirtiyor.",
                highlightTags: ["Acaba bir daha ne zaman atak gelecek", "sürekli nabzını ölçtüğünü"]
            },
            {
                order: 4,
                title: "Şiddetli Agorafobik Kaçınma",
                text: "Toplu taşıma, marketler, köprüler ve açık alanlardan tamamen kaçındığını; son 4 aydır sadece eşinin refakatinde balkona çıkabildiğini söylüyor.",
                highlightTags: ["son 4 aydır evden dışarı adım atamama", "açık alanlardan tamamen kaçındığını"]
            },
            {
                order: 5,
                title: "Bedensel Duyumlara Aşırı Duyarlılık",
                text: "Merdiven çıkınca kalbi hızlandığında veya kahve içince sıcak bastığında hemen panik atağın başladığını zannedip paniklediğini ifade ediyor.",
                highlightTags: ["kalbi hızlandığında", "hemen panik atağın başladığını zannedip"]
            },
            {
                order: 6,
                title: "DSM-5 Tanı Kriteri",
                text: "Danışanda [[tekrarlayan beklenmedik panik ataklar, atakların geleceğine dair en az 1 aydır süren kaygı ve kaçışın zor olacağı ortamlardan şiddetli kaçınma]] mevcuttur.",
                highlightTags: ["tekrarlayan beklenmedik panik ataklar, atakların geleceğine dair en az 1 aydır süren kaygı ve kaçışın zor olacağı ortamlardan şiddetli kaçınma"]
            }
        ],
        patientSummary: "31 yaşında kadın danışan, tekrarlayan beklenmedik panik ataklar ve yardım alamama korkusuyla 4 aydır evden çıkamayacak düzeyde agorafobik kaçınma sergilemektedir.",
        dsmAnalysis: "DSM-5 Panik Bozukluk ve Agorafobi: Beklenmedik panik atakların tekrarlaması, beklenti anksiyetesi ve panik belirtisi geliştiğinde kaçmanın zor olacağı durumlardan (toplu taşıma, açık alanlar, sıra bekleme) aktif kaçınmadır.",
        differentialDiagnosis: [
            { diagnosis: "Sosyal Anksiyete Bozukluğu", reason: "Sosyal fobide korku başkaları tarafından yargılanmaktır; agorafobide ise panik atağın gelmesi ve kaçamama/yardım alamama korkusudur." },
            { diagnosis: "Özgül Fobi (Kl 검ostrofobi)", reason: "Kl 검ostrofobide sadece kapalı alan korkusu vardır, beklenmedik spontan panik ataklar ve geniş spektrumlu agorafobi yoktur." },
            { diagnosis: "Yaygın Anksiyete Bozukluğu", reason: "YAB'da günlük yaşam olaylarına dair yaygın endişe vardır; ani panik atak dorukları ve agorafobik eve kapanma birincil değildir." }
        ],
        treatmentModality: {
            goldStandardTherapy: "İnteroseptif Maruz Bırakma (Interoceptive Exposure) + In Vivo Canlı Maruz Bırakma",
            therapyDetails: "Seans içinde dönme/hiperventilasyon ile bedensel duyumlara duyarsızlaşma (interoseptif), ardından korkulan açık alanlara kademeli adımlarla çıkma (in vivo) uygulanır.",
            pharmacologyNote: "Akut kaygıyı kırmak için SSRI (Sertralin/Sitalopram) başlanır; kriz anlarında sınırlı benzodiazepin desteği düşünülebilir."
        },
        miniQuiz: {
            question: "Panik Bozukluk tedavisinde hastaya seans içinde kasten baş dönmesi ve kalp çarpıntısı yaşatılarak yapılan BDT tekniğine ne ad verilir?",
            options: ["İnteroseptif (İçsel Duyumsal) Maruz Bırakma", "Sistematik Hipnoz", "EMDR Göz Hareketleri", "Diyalektik Beceri Eğitimi"],
            correctIndex: 0,
            explanation: "İnteroseptif maruz bırakma (Interoceptive Exposure), hastanın korktuğu bedensel hisleri (çarpıntı, baş dönmesi, nefes daralması) kontrollüce üreterek felaketleştirmeyi söndürme tekniğidir."
        }
    },

    // 86. Komorbid Borderline KB ve Karmaşık TSSB (C-PTSD)
    {
        id: "case-086",
        diagnosisId: "borderline_pd",
        therapyId: "dbt",
        difficulty: 3,
        age: 27,
        gender: "Kadın",
        occupation: "Hemşire",
        chiefComplaint: "Tekrarlayan kendine zarar verme kesikleri, kronik boşluk hissi, çocukluk istismarı anıları ve öfke patlamaları.",
        clues: [
            {
                order: 1,
                title: "İlk Başvuru & Kriz",
                text: "27 yaşındaki danışan, kollarındaki jilet kesikleri ve acil serviste dikilen yaralarıyla 'Beni kimse sevmiyor, terk edilmeye dayanamıyorum, acımı sadece kan görünce dindiriyorum' diyerek başvurdu.",
                highlightTags: ["kollarındaki jilet kesikleri", "terk edilmeye dayanamıyorum"]
            },
            {
                order: 2,
                title: "Terk Edilmeye Karşı Aşırı Çaba ve Bölme (Splitting)",
                text: "Erkek arkadaşı mesajına 10 dakika geç cevap verdiğinde onu 'dünyanın en berbat insanı' ilan ettiğini, 1 saat sonra ise 'hayatımın tek aşkı' diyerek yalvardığını anlatıyor.",
                highlightTags: ["Terk edilmeye karşı aşırı çaba", "dünyanın en berbat insanı / hayatımın tek aşkı"]
            },
            {
                order: 3,
                title: "Kronik Çocukluk Çağı Travması & İntrüzyonlar",
                text: "Çocukluk boyunca aile içi fiziksel ve cinsel istismara maruz kaldığını, geceleri istismar kabusları ve flashbacklerle uyandığını belirtiyor.",
                highlightTags: ["aile içi fiziksel ve cinsel istismara", "flashbacklerle uyandığını"]
            },
            {
                order: 4,
                title: "Kimlik Karmaşası ve Boşluk Hissi",
                text: "Sık sık mesleğini, saç rengini ve cinsel yönelimini değiştirdiğini, içinde 'asla dolmayan kara bir delik ve derin bir boşluk' olduğunu söylüyor.",
                highlightTags: ["Kimlik karmaşası", "asla dolmayan kara bir delik ve derin bir boşluk"]
            },
            {
                order: 5,
                title: "Dürtüsellik ve Dissosiyasyon",
                text: "Yoğun stres anlarında aşırı para harcama, kontrolsüz cinsel eylemler ve sanki bedeninin dışına çıkıp kendini izliyormuş gibi dissosiyatif kopmalar yaşadığını ifade ediyor.",
                highlightTags: ["Dürtüsellik", "bedeninin dışına çıkıp kendini izliyormuş gibi dissosiyatif"]
            },
            {
                order: 6,
                title: "DSM-5 Tanı Kriteri",
                text: "Danışanda [[terk edilmekten çılgınca kaçınma, tutarsız ilişkiler, kimlik karmaşası, kendine zarar verme ve duygulanımda aşırı tepkisellik]] ile giden yaygın örüntü mevcuttur.",
                highlightTags: ["terk edilmekten çılgınca kaçınma, tutarsız ilişkiler, kimlik karmaşası, kendine zarar verme ve duygulanımda aşırı tepkisellik"]
            }
        ],
        patientSummary: "27 yaşında kadın danışan, kronik istismar travması zemininde terk edilme korkusu, kendine zarar verme (NSSI), splitting ve duygusal regülasyon bozukluğu sergilemektedir.",
        dsmAnalysis: "DSM-5 Borderline Kişilik Bozukluğu (BPD) ve TSSB komorbiditesi: Erken erişkinlikte başlayan kişilerarası ilişkilerde, benlik imgesinde ve duygulanımda yaygın kararsızlık ve belirgin dürtüsellik örüntüsüdür.",
        differentialDiagnosis: [
            { diagnosis: "Bipolar II Bozukluk", reason: "Bipolarda duygudurum epizodları haftalar/aylar sürer ve içsel sirkadiyendir; BPD'de ise duygusal dalgalanmalar saatler içinde ve kişilerarası tetikleyicilerle olur." },
            { diagnosis: "Yalnızca TSSB", reason: "Sadece TSSB'de travma belirtileri vardır ancak yaygın splitting, terk edilme dehşeti ve kendine zarar verici kronik kişilik organizasyonu BPD'yi gösterir." },
            { diagnosis: "Histriyonik Kişilik Bozukluğu", reason: "Histriyonikte dikkat çekme arayışı vardır ancak kronik boşluk, intihar girişimleri ve ağır dissosiyatif yarılmalar görülmez." }
        ],
        treatmentModality: {
            goldStandardTherapy: "Diyalektik Davranış Terapisi (DBT / Marsha Linehan Modeli) & DBT-PTSD",
            therapyDetails: "Bireysel terapi + haftalık beceri eğitimi grubu (Bilinçli Farkındalık, Duygu Düzenleme, Yüce Duygusal Dayanıklılık, Kişilerarası Etkililik) ve telefon koçluğu.",
            pharmacologyNote: "Dürtüsellik ve afektif instabiliteyi yatıştırmak için duygudurum dengeleyiciler (Lamotrijin) veya düşük doz atipik antipsikotikler (Ketiyapin, Aripiprazol) destek olabilir."
        },
        miniQuiz: {
            question: "Marsha Linehan tarafından özellikle Borderline Kişilik Bozukluğu ve intihar/kendine zarar davranışları için geliştirilen altın standart terapi ekolü hangisidir?",
            options: ["Diyalektik Davranış Terapisi (DBT)", "Psikoanaliz", "Gestalt Terapisi", "Sistemik Aile Dizimi"],
            correctIndex: 0,
            explanation: "Diyalektik Davranış Terapisi (DBT), BPD'de duygusal regülasyon ve kriz toleransı kazandırmada en güçlü kanıt düzeyine sahip altın standart terapidir."
        }
    },

    // 87. Anoreksiya Nervoza (Tıkınma/Çıkarma Tipi)
    {
        id: "case-087",
        diagnosisId: "anorexia_nervosa",
        therapyId: "cbt_e",
        difficulty: 2,
        age: 19,
        gender: "Kadın",
        occupation: "Üniversite Öğrencisi",
        chiefComplaint: "Aşırı kilo kaybı (BMI: 15.2), kilo almaktan panik derecesinde korkma ve haftada 3-4 kez tıkınıp ardından kusma eylemleri.",
        clues: [
            {
                order: 1,
                title: "İlk Başvuru",
                text: "19 yaşındaki genç kadın, bayılma nöbetleri ve aşırı zayıflık nedeniyle ailesi tarafından getirildi. Boyu 1.68 m, kilosu 43 kg (BKİ: 15.2 kg/m² - Şiddetli Zayıflık).",
                highlightTags: ["kilosu 43 kg", "BKİ: 15.2 kg/m²", "Şiddetli Zayıflık"]
            },
            {
                order: 2,
                title: "Kilo Alma Korkusu ve Beden Algısı",
                text: "Kemikleri sayılacak kadar zayıf olmasına rağmen aynaya baktığında 'karnımın ve bacaklarımın yağ tulumu gibi olduğunu görüyorum' diyerek dehşete düştüğünü anlatıyor.",
                highlightTags: ["yağ tulumu gibi olduğunu görüyorum", "Kilo alma korkusu"]
            },
            {
                order: 3,
                title: "Tıkınma ve Çıkarma Epizodları",
                text: "Günlerce sadece marul ve maden suyu ile beslendikten sonra kontrolünü kaybedip tatlıları hızla yediğini ve hemen ardından parmağıyla kendini kusturduğunu söylüyor.",
                highlightTags: ["parmağıyla kendini kusturduğunu", "tıkınma ve çıkarma"]
            },
            {
                order: 4,
                title: "Fiziksel Bulgular & Russell İşareti",
                text: "El sırtında dişlerin sürtünmesine bağlı nasırlar (Russell belirtisi), diş minesinde erozyon ve parotis bezlerinde şişme saptandı.",
                highlightTags: ["Russell belirtisi", "diş minesinde erozyon"]
            },
            {
                order: 5,
                title: "Adetten Kesilme ve Hipotermi",
                text: "Son 6 aydır hiç adet görmediğini, vücut ısısının 35.4°C olduğunu ve sürekli üşüdüğü için kat kat giyindiğini ifade ediyor.",
                highlightTags: ["Son 6 aydır hiç adet görmediğini", "sürekli üşüdüğü"]
            },
            {
                order: 6,
                title: "DSM-5 Tanı Kriteri",
                text: "Danışanda [[yaş ve boya göre belirgin derecede düşük vücut ağırlığı, kilo almaktan aşırı korku, beden imgesinde bozulma ve tekrarlayan tıkınma/çıkarma atakları]] mevcuttur.",
                highlightTags: ["belirgin derecede düşük vücut ağırlığı, kilo almaktan aşırı korku, beden imgesinde bozulma ve tekrarlayan tıkınma/çıkarma atakları"]
            }
        ],
        patientSummary: "19 yaşında kadın danışan, BMI: 15.2 düzeyinde aşırı zayıf olmasına rağmen şişman olduğunu iddia etmekte ve haftada 3-4 kez kusma (tıkınma/çıkarma tipi anoreksiya) yapmaktadır.",
        dsmAnalysis: "DSM-5 Anoreksiya Nervoza (Tıkınma/Çıkarma Tipi): Enerji alımının kısıtlanması sonucu belirgin düşük vücut ağırlığı (BMI < 18.5), kilo almaktan yoğun korku ve son 3 ayda tekrarlayan tıkınma veya çıkarma (kusma, laksatif) davranışlarının bulunmasıdır.",
        differentialDiagnosis: [
            { diagnosis: "Bulimiya Nervoza", reason: "Bulimiya Nervozada hastanın kilosu normal veya hafif kiloludur (BMI >= 18.5); Anoreksiya tıkınma/çıkarma tipinde ise vücut ağırlığı ölümcül derecede düşüktür (BMI < 18.5)." },
            { diagnosis: "Tıkınırcasına Yeme Bozukluğu (BED)", reason: "BED'de tıkınma atakları vardır ancak kusma/laksatif gibi telafi edici çıkarma davranışları ve aşırı zayıflık yoktur." },
            { diagnosis: "Beden Algısı Bozukluğu (BDD)", reason: "BDD'de kusur algısı burun, saç gibi bölgeseldir; kilo ve genel beden ağırlığına odaklı düşük kilo kısıtlaması Anoreksiya'ya özgüdür." }
        ],
        treatmentModality: {
            goldStandardTherapy: "Geliştirilmiş Bilişsel Davranışçı Terapi (CBT-E / Fairburn) & Aile Temelli Terapi (Maudsley)",
            therapyDetails: "Önce kilo restorasyonu ve medikal stabilizasyon sağlanır; ardından kilo/şekil aşırı değerlendirmesi, katı diyet kuralları ve çıkarma döngüsü kırılır.",
            pharmacologyNote: "Anoreksiyada birincil ilaç yoktur; kaygı ve takıntıları azaltmak için düşük doz Olanzapin kilo alımına destek olarak kullanılabilir."
        },
        miniQuiz: {
            question: "Tıkınma/Çıkarma Tipi Anoreksiya Nervoza ile Bulimiya Nervoza arasındaki en temel tanısal ayrım kriteri nedir?",
            options: ["Hastanın vücut ağırlığının belirgin şekilde düşük (BMI < 18.5) olması", "Bulimiyada hiç kusma olmaması", "Anoreksiyada hastanın yemek yemeyi çok sevmesi", "Bulimiyanın sadece erkeklerde görülmesi"],
            correctIndex: 0,
            explanation: "Eğer bir hasta tıkınıp kusuyor ama vücut ağırlığı belirgin olarak düşükse (BMI < 18.5), tanı Bulimiya değil 'Anoreksiya Nervoza - Tıkınma/Çıkarma Tipi'dir."
        }
    },

    // 88. Seçici Konuşmazlık (Selektif Mutizm - Yetişkin/Ergen)
    {
        id: "case-088",
        diagnosisId: "selective_mutism",
        therapyId: "stimulus_fading",
        difficulty: 2,
        age: 8,
        gender: "Kız",
        occupation: "İlkokul Öğrencisi",
        chiefComplaint: "Evde ailesiyle çok akıcı ve neşeli konuşmasına rağmen okulda öğretmenine ve arkadaşlarına tek bir kelime dahi konuşmama.",
        clues: [
            {
                order: 1,
                title: "İlk Başvuru",
                text: "8 yaşındaki kız çocuğunu öğretmeni ve ailesi getirdi. Öğretmeni: 'Sene başından beri 6 aydır sınıfta sesini hiç duymadık, parmak kaldırıp söz alsa bile sadece kafasını sallıyor' dedi.",
                highlightTags: ["6 aydır sınıfta sesini hiç duymadık", "sadece kafasını sallıyor"]
            },
            {
                order: 2,
                title: "Ev Ortamındaki Akıcılık",
                text: "Annesi evde çocuğun son derece konuşkan, şarkılar söyleyen, espriler yapan ve dil gelişiminin yaşıtlarından ileri düzeyde olduğunu belirtiyor.",
                highlightTags: ["evde çocuğun son derece konuşkan", "dil gelişiminin yaşıtlarından ileri"]
            },
            {
                order: 3,
                title: "Konuşma Baskısında Donakalma",
                text: "Yabancı biri veya öğretmeni soru sorduğunda çocuğun yüzünün kaskatı kesildiği, göz temasını kestiği ve adeta donup kaldığı (freezing) gözleniyor.",
                highlightTags: ["yüzünün kaskatı kesildiği", "adeta donup kaldığı"]
            },
            {
                order: 4,
                title: "Akademik ve Sosyal Etkilenme",
                text: "Okuma yazmayı bildiği halde sesli okuma yapamadığı için ders değerlendirmesinde güçlük yaşandığı ve arkadaş oyunlarına sessizce katıldığı anlatılıyor.",
                highlightTags: ["sesli okuma yapamadığı", "sessizce katıldığı"]
            },
            {
                order: 5,
                title: "İletişim ve Dil Bozukluğu Yokluğu",
                text: "Çocuğun işitme testlerinin tam normal olduğu, Türkçeyi anlama ve ifade etme becerisinde hiçbir organik defisit bulunmadığı raporlandı.",
                highlightTags: ["işitme testlerinin tam normal olduğu", "hiçbir organik defisit bulunmadığı"]
            },
            {
                order: 6,
                title: "DSM-5 Tanı Kriteri",
                text: "Çocukta [[konuşmanın beklendiği özgül toplumsal durumlarda (okulda) sürekli bir konuşamama, buna karşın diğer durumlarda konuşuyor olma]] tablosu en az 1 aydır sürmektedir.",
                highlightTags: ["konuşmanın beklendiği özgül toplumsal durumlarda sürekli bir konuşamama, buna karşın diğer durumlarda konuşuyor olma"]
            }
        ],
        patientSummary: "8 yaşında kız çocuğu, evde çok akıcı konuşmasına rağmen okulda 6 aydır öğretmen ve arkadaşlarına tek kelime konuşmamakta ve donakalma kaygısı yaşamaktadır.",
        dsmAnalysis: "DSM-5 Seçici Konuşmazlık (Selective Mutism): Başka durumlarda konuşuyor olmasına karşın, konuşmanın beklendiği özgül sosyal durumlarda (örn. okul) sürekli bir biçimde konuşamama ve bu durumun eğitimi/iletişimi engellemesidir (en az 1 ay).",
        differentialDiagnosis: [
            { diagnosis: "Otizm Spektrum Bozukluğu (OSB)", reason: "Otizmde genel sosyal iletişim eksikliği ve tekrarlayıcı stereotipiler vardır; Selektif Mutizmde çocuk evde ailesiyle çok sıcak ve normal ilişki kurar." },
            { diagnosis: "Sosyal Anksiyete Bozukluğu", reason: "Selektif mutizm sıklıkla sosyal anksiyetenin uç bir manifestasyonudur ancak 'tam konuşmama' özgül semptomuyla ayrışır." },
            { diagnosis: "İletişim/Dil Bozukluğu", reason: "Dil bozukluğunda çocuk evde de konuşamaz ve gramer/kelime dağarcığı eksiktir." }
        ],
        treatmentModality: {
            goldStandardTherapy: "Uyaran Kaydırma (Stimulus Fading) & Kademeli Maruz Bırakma",
            therapyDetails: "Önce boş sınıfta anneyle konuşurken öğretmenin kademeli olarak odaya girmesi, mikrofona ses kaydetme ve mikro temaslarla konuşma davranışının genellenmesi sağlanır.",
            pharmacologyNote: "Ağır ve dirençli vakalarda anksiyeteyi düşürmek için düşük doz Fluoksetin gibi SSRI'lar güvenle kullanılabilir."
        },
        miniQuiz: {
            question: "DSM-5'e göre Seçici Konuşmazlık (Selective Mutism) tanısı için okulun ilk ayı hariç minimum ne kadar süre konuşamama gereklidir?",
            options: ["En az 1 ay", "En az 3 ay", "En az 6 ay", "En az 1 yıl"],
            correctIndex: 0,
            explanation: "DSM-5'e göre seçici konuşmazlık süresi en az 1 ay olmalıdır (okula yeni başlanan ilk ayki utangaçlık dönemi hariç)."
        }
    },

    // 89. Alkol Kullanım Bozukluğu (Şiddetli)
    {
        id: "case-089",
        diagnosisId: "alcohol_use_disorder",
        therapyId: "motivational_interviewing",
        difficulty: 1,
        age: 45,
        gender: "Erkek",
        occupation: "Taksi Şoförü",
        chiefComplaint: "Her gün sabah saatlerinden itibaren içme, alkolü bırakınca ellerde titreme ve alkollü araç kullanmaktan ehliyetine el konulması.",
        clues: [
            {
                order: 1,
                title: "İlk Başvuru",
                text: "45 yaşındaki danışan, eşinin boşanma davası açması ve ehliyetini kaptırması sonrası 'Ben bağımlı değilim sadece stresimi yatıştırıyorum' diyerek geldi.",
                highlightTags: ["ehliyetini kaptırması", "Ben bağımlı değilim"]
            },
            {
                order: 2,
                title: "Tolerans Gelişimi",
                text: "Eskiden 2 kadeh rakı ile sarhoş olurken, son 2 yıldır aynı etkiyi alabilmek için her gün en az 1 büyük şişe (70'lik) rakı içtiğini anlatıyor.",
                highlightTags: ["aynı etkiyi alabilmek için her gün en az 1 büyük şişe", "tolerans"]
            },
            {
                order: 3,
                title: "Yoksunluk Belirtileri & Göz Açıcı (Eye-Opener)",
                text: "Sabah uyandığında ellerinin zangır zangır titrediğini, terlediğini ve titremeyi durdurmak için sabah ilk iş olarak bir duble alkol içtiğini kabul ediyor.",
                highlightTags: ["ellerinin zangır zangır titrediğini", "sabah ilk iş olarak bir duble alkol içtiğini"]
            },
            {
                order: 4,
                title: "Zaman ve Enerjinin Alkole Harcanması",
                text: "Gününün çoğunu alkol temin etmek, içmek ve sonrasında akşamdan kalmalığın etkisinden kurtulmakla geçirdiğini belirtiyor.",
                highlightTags: ["alkol temin etmek, içmek ve sonrasında etkisinden kurtulmakla"]
            },
            {
                order: 5,
                title: "Tehlikeli Durumlarda Kullanım & Sosyal Kayıp",
                text: "Alkol etkisindeyken defalarca direksiyon başına geçtiğini, karaciğer enzimlerinin (GGT, ALT) 4 katına çıktığını bilmesine rağmen içmeyi sürdürdüğünü söylüyor.",
                highlightTags: ["direksiyon başına geçtiğini", "karaciğer enzimlerinin yüksek olmasına rağmen içmeyi sürdürdüğünü"]
            },
            {
                order: 6,
                title: "DSM-5 Tanı Kriteri",
                text: "Danışan [[son 12 aydır tolerans, yoksunluk, kontrol kaybı, aşırı istek (craving) ve zararlarına rağmen içmeyi sürdürme]] kriterlerinin 7 tanesini karşılamaktadır (Şiddetli Düzey).",
                highlightTags: ["son 12 aydır tolerans, yoksunluk, kontrol kaybı, aşırı istek ve zararlarına rağmen içmeyi sürdürme"]
            }
        ],
        patientSummary: "45 yaşında erkek danışan, her gün yüksek doz alkol tüketmekte, sabah titremelerini alkolle bastırmakta, tolerans ve yoksunluk sergilemektedir.",
        dsmAnalysis: "DSM-5 Alkol Kullanım Bozukluğu (Şiddetli): 12 aylık bir dönem içinde tolerans, yoksunluk, amaçlanandan fazla içme, bırakma çabalarının başarısızlığı, tehlikeli ortamlarda içme ve tıbbi zararlara rağmen sürdürme (6+ kriter = Şiddetli).",
        differentialDiagnosis: [
            { diagnosis: "Sosyal Alkol Tüketimi", reason: "Sosyal kullanımda tolerans, sabah yoksunluk titremesi, mesleki yıkım ve tehlikeli kullanım yoktur." },
            { diagnosis: "Bipolar Bozukluk (Manik Epizod)", reason: "Manide dönemlik aşırı alkol tüketilebilir; ancak burada epizodik duygudurum yükselmesi olmadan primer kronik kimyasal bağımlılık vardır." },
            { diagnosis: "Majör Depresif Bozukluk", reason: "Depresyon alkol kullanımına ikincil gelişmiştir (alkole bağlı duygudurum bozukluğu)." }
        ],
        treatmentModality: {
            goldStandardTherapy: "Motivasyonel Görüşme (MI) & Nüks Önleme BDT + Adsız Alkolikler (AA)",
            therapyDetails: "Danışanın ambivalansını çözümleme, yüksek riskli durumları tespit etme, alkol reddetme becerileri ve 12 basamaklı grup desteği.",
            pharmacologyNote: "Detoksifikasyon için Diazepam (yoksunluk nöbetlerini önleme); idame için Akamprosat veya Naltrekson (aşermeyi azaltma) verilir."
        },
        miniQuiz: {
            question: "DSM-5'e göre Alkol Kullanım Bozukluğunun 'Şiddetli' (Severe) düzeyde sınıflandırılabilmesi için 11 kriterden en az kaç tanesinin karşılanması gerekir?",
            options: ["En az 2-3 kriter", "En az 4-5 kriter", "En az 6 veya daha fazla kriter", "11 kriterin tamamı"],
            correctIndex: 2,
            explanation: "DSM-5'te Madde Kullanım Bozukluklarında 2-3 kriter Hafif, 4-5 kriter Orta, 6 ve üzeri kriter Şiddetli (Severe) olarak derecelendirilir."
        }
    }
];

fs.writeFileSync(path.join(__dirname, 'vaka_paketi_60.json'), JSON.stringify(newCases, null, 2), 'utf8');
console.log(`Generated ${newCases.length} new cases successfully to vaka_paketi_60.json!`);
