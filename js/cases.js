/**
 * PsikoVaka 2.0 - Zengin Klinik Vaka Veritabanı (158 DSM-5-TR Vakası)
 * Tanı, Psikoterapi, Psikofarmakoloji ve 3 Aşamalı Kombo Modu destekli.
 * 2026-11-15: resmî tanıya bağlanamayan 12 vaka tools/icerik/tani_temizligi/arsivlenen_vakalar.json dosyasına taşındı (caseNumber değerleri değişmedi).
 */

const COURSE_CATEGORIES = {
    "ALL": {
        "id": "ALL",
        "name": "Tüm Alanlar",
        "icon": "🌟"
    },
    "ADULT": {
        "id": "ADULT",
        "name": "Yetişkin Psikopatolojisi",
        "icon": "🧠"
    },
    "CHILD": {
        "id": "CHILD",
        "name": "Çocuk & Ergen Psikopatolojisi",
        "icon": "🧑‍🦱"
    },
    "FORENSIC": {
        "id": "FORENSIC",
        "name": "Adli Psikoloji & Kişilik",
        "icon": "⚖️"
    },
    "NEURO_SOMATIC": {
        "id": "NEURO_SOMATIC",
        "name": "Nörobilişsel & Somatik",
        "icon": "🩺"
    },
    "IMPULSE": {
        "id": "IMPULSE",
        "name": "Dürtü Denetimi & Yıkıcı Bozukluklar",
        "icon": "💥"
    },
    "SUBSTANCE": {
        "id": "SUBSTANCE",
        "name": "Bağımlılık & Madde Kullanımı",
        "icon": "🧪"
    },
    "COMORBID": {
        "id": "COMORBID",
        "name": "Komorbid (Çift Tanılı) Vakalar",
        "icon": "🔗"
    }
};

const CLINICAL_CASES = [
    {
        "id": "case-001",
        "caseNumber": 1,
        "difficulty": "Orta",
        "course": "FORENSIC",
        "diagnosisId": "borderline_pd",
        "category": "PERSONALITY_B",
        "patientSummary": "23 yaşında, kadın, üniversite öğrencisi",
        "clues": [
            "Danışan, sevgilisi şehir dışına çıktığında yoğun bir 'içsel boşluk' ve terk edilme dehşeti yaşadığını, onu arka arkaya 40 kez aradıktan sonra telefonuna bakmadığı için sol koluna jiletle yüzeysel çizikler attığını belirterek başvuruyor.",
            "Bu tür yoğun duygusal dalgalanmaların ve krizlerin ergenlik yıllarından (yaklaşık 16 yaşından) beri sürdüğü, haftalar değil saatler içinde aşırı neşeden derin bir umutsuzluğa veya öfkeye savrulduğu belirtiliyor.",
            "İlişkilerinde insanları ilk başta 'mükemmel, hayatımın kurtarıcısı' olarak idealleştirirken, en ufak bir gecikmede 'bencil, değersiz bir düşman' olarak yaftaladığı (bölme / splitting mekanizması) ve arkadaş çevresinin sürekli değiştiği görülüyor.",
            "Toksikoloji taraması ve tiroid fonksiyon testleri normaldir. Genel tıbbi bir duruma veya madde yoksunluğuna bağlı organik bir patoloji saptanmamıştır.",
            "Ruhsal Durum Muayenesinde (MSE): Duygulanım son derece labil (oynak), benlik algısı tutarsız ('Gerçekte kim olduğumu, ne istediğimi bilmiyorum' ifadesi). Dürtüsel harcamalar ve tehlikeli araç kullanma öyküsü mevcut.",
            "DSM-5'e göre: Terk edilmekten çılgınca kaçınma çabaları, kimlik karmaşası, kendine zarar verici yineleyici davranışlar ve belirgin duygulanımsal tepkisellik kriterlerini tam olarak karşılamaktadır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "terk edilme dehşeti",
                "dsmMatch": "DSM-5 Kriter 1: Gerçek/hayali ayrılıktan kaçınma çabaları"
            },
            {
                "clueIndex": 0,
                "text": "sol koluna jiletle yüzeysel çizikler",
                "dsmMatch": "DSM-5 Kriter 5: Yineleyen kendine zarar verici davranışlar"
            },
            {
                "clueIndex": 2,
                "text": "bölme / splitting mekanizması",
                "dsmMatch": "DSM-5 Kriter 2: İdealleştirme ve değersizleştirme uçları arasında giden dengesiz ilişkiler"
            },
            {
                "clueIndex": 4,
                "text": "benlik algısı tutarsız",
                "dsmMatch": "DSM-5 Kriter 3: Belirgin ve sürekli kararsız benlik algısı veya kimlik karmaşası"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Diyalektik Davranış Terapisi (DBT / Marsha Linehan)",
            "therapyDetails": "Duygu düzenleme, kişilerarası etkililik, sıkıntıya tolerans ve bilinçli farkındalık beceri eğitimi.",
            "pharmacologyNote": "Düşük doz duygudurum dengeleyiciler veya ikinci kuşak antipsikotikler kriz dönemlerinde eklenebilir."
        },
        "miniQuiz": {
            "question": "Bu vakada Bipolar II yerine Sınırda (Borderline) Kişilik Bozukluğu tanısı koymamızın en temel klinik gerekçesi nedir?",
            "options": [
                "Duygudurum dalgalanmalarının haftalar değil saatler içinde ve kişilerarası terk edilme tetikleyicisiyle oluşması",
                "Hastanın hiçbir zaman depresyon atağı yaşamamış olması",
                "Hastanın genel bilişsel zeka düzeyinin düşük olması",
                "Bipolar bozuklukta kendine zarar verme davranışlarının hiç görülmemesi"
            ],
            "correctIndex": 0,
            "explanation": "Bipolar dönemleri günler/haftalar sürer; Borderline'da ise affektif dalgalanmalar saatliktir ve kişilerarası terk edilme/reddedilme algısıyla tetiklenir."
        },
        "differentialDiagnosis": "• Bipolar II Bozukluğu: Bipolar duygudurum dönemleri günler veya haftalar sürer; oysa burada duygudurum dalgalanmaları saatliktir.\n• Histriyonik KB: Kronik boşluk hissi ve özkıyım/kendini yaralama tipik değildir.",
        "dsmCriteriaSummary": "DSM-5: Ayrılıktan kaçınma, dengesiz ilişkiler, kimlik karmaşası, dürtüsellik, özkıyım/kendini yaralama, duygulanımda kararsızlık, kronik boşluk, uygunsuz yoğun öfke.",
        "therapyId": "dbt",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Sevgilinin şehir dışına gitmesiyle tetiklenen terk edilme dehşeti ve art arda aramalar, gerçek ya da hayali terk edilmeden kaçınma çabasına karşılık gelir.",
                "Kişileri önce idealleştirip küçük bir hayal kırıklığında değersizleştirmesi, dengesiz ve yoğun ilişki örüntüsünü gösterir.",
                "Yineleyen kendine zarar verme, kronik boşluk, kimlik karmaşası ve dürtüsel harcama/araç kullanımı ergenlikten beri süren yaygın bir örüntü oluşturur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "bipolar_2",
                    "reason": "Duygudurum değişimleri günler süren hipomanik/depresif epizodlar değil, kişilerarası tetikleyicilerle saatler içinde oluşan dalgalanmalardır."
                },
                {
                    "diagnosisId": "histrionic_pd",
                    "reason": "İlgi arayışı ve yüzeysel duygusallık yerine terk edilme korkusu, kendine zarar verme ve kimlik karmaşası öndedir."
                },
                {
                    "diagnosisId": "mdd",
                    "reason": "Umutsuzluk anları sürekli iki haftalık bir çökkünlük dönemi oluşturmuyor; tablo epizodik değil, kişilik düzeyinde ve süreklidir."
                }
            ],
            "teachingPoint": "Duygudurum dalgalanmasının süresi ve tetikleyicisi belirleyicidir: saatler süren ve ilişkiyle tetiklenen değişkenlik borderline'ı, günler-haftalar süren epizodlar bipolar bozukluğu düşündürür."
        }
    },
    {
        "id": "case-002",
        "caseNumber": 2,
        "difficulty": "Kolay",
        "course": "ADULT",
        "diagnosisId": "panic_disorder",
        "category": "ANXIETY",
        "patientSummary": "34 yaşında, erkek, muhasebeci",
        "clues": [
            "Danışan son 2 aydır 'hiçbir sebep yokken aniden kalbinin göğsünden fırlayacak gibi çarptığını, nefesinin yetmediğini ve delirmekten ya da kalp krizinden öleceğinden korktuğunu' belirterek acil servise başvuruyor.",
            "Bu atakların ilki 8 hafta önce metroda giderken aniden ve beklenmedik şekilde (spontane) başlamış, yaklaşık 15-20 dakika içinde tepe noktasına ulaşarak yavaş yavaş yatışmıştır.",
            "İlk ataktan bu yana 'Acaba yine aynı nöbet gelecek mi?' endişesiyle sürekli nabzını ölçmekte, yanında tansiyon aleti taşımakta ve yalnız kalmaktan korkmaktadır.",
            "Kardiyolojik değerlendirmede EKG, Eko, Troponin ve Holter testleri tamamen temiz çıkmış; organik bir kalp-damar ya da solunum yolu rahatsızlığı saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Sürekli bir tetikte olma ve otonomik aşırı uyarılmışlık hali gözleniyor. Atak geleceğine dair yoğun beklenti anksiyetesi (anticipatory anxiety) belirgin.",
            "DSM-5'e göre: Beklenmedik tekrarlayan panik ataklar ve bu atakları takip eden en az 1 ay boyunca süren 'başka atak geçirme endişesi veya atakların sonuçlarına dair kaygı' mevcuttur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "aniden ve beklenmedik şekilde (spontane) başlamış",
                "dsmMatch": "DSM-5 Kriter A: Beklenmedik yineleyen panik ataklar"
            },
            {
                "clueIndex": 2,
                "text": "'Acaba yine aynı nöbet gelecek mi?' endişesiyle",
                "dsmMatch": "DSM-5 Kriter B1: En az 1 aydır süren başka panik ataklar geçirme kaygısı (Beklenti anksiyetesi)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi (BDT / Panik Protokolü)",
            "therapyDetails": "Bedensel duyumların felaketleştirici yorumlanmasını yeniden yapılandırma, interoseptif maruz bırakma ve güvenlik arama davranışlarını söndürme.",
            "pharmacologyNote": "SSRI/SNRI grubu antidepresanlar ilk sıra medikal tedavidir."
        },
        "miniQuiz": {
            "question": "Panik Bozukluk tanısı koyabilmek için sadece panik atak geçirmek neden yeterli değildir?",
            "options": [
                "Çünkü tek bir panik atak toplumda sık görülür; tanı için en az 1 ay süren beklenti anksiyetesi veya uyumsuz kaçınma şarttır.",
                "Çünkü panik bozuklukta hastanın mutlaka bayılması gerekir.",
                "Çünkü panik ataklar sadece uyku sırasında ortaya çıkar.",
                "Çünkü panik atak geçiren hastaların tamamında agorafobi gelişmek zorundadır."
            ],
            "correctIndex": 0,
            "explanation": "DSM-5'e göre tekrarlayan beklenmedik atakların ardından en az 1 ay boyunca süren 'beklenti anksiyetesi' veya uyumsuz davranış değişikliği şarttır."
        },
        "differentialDiagnosis": "• Yaygın Anksiyete Bozukluğu: YAB'de kaygı günün geneline yayılan evhamdır.\n• Organik Kalp Hastalığı: EKG ve enzimlerle dışlanmıştır.",
        "dsmCriteriaSummary": "DSM-5: Beklenmedik yineleyen panik ataklar + En az 1 ay süren 'başka atak olacağı kaygısı' veya uyumsuz davranış değişiklikleri.",
        "therapyId": "interoceptive_exposure",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Metroda hiçbir uyaran yokken başlayan ve dakikalar içinde tepe yapan çarpıntı, nefes darlığı ve ölüm korkusu beklenmedik panik atağını tanımlar.",
                "Ataklar tekrarlamış ve ardından bir aydan uzun süredir yeni atak endişesi, nabız ölçme ve tansiyon aleti taşıma gibi davranış değişiklikleri vardır.",
                "Kardiyolojik incelemelerin temiz olması belirtilerin organik bir kalp hastalığıyla açıklanmadığını gösterir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "gad",
                    "reason": "Kaygı birçok yaşam alanına yayılmış süreğen bir kuruntu değil; ani ataklar ve bu ataklara odaklı beklenti kaygısıdır."
                },
                {
                    "diagnosisId": "illness_anxiety_disorder",
                    "reason": "Sağlık kaygısı ani panik ataklarının ardından gelişmiş ve ataklara odaklıdır; ataklardan bağımsız bir hastalık uğraşı yoktur."
                },
                {
                    "diagnosisId": "agoraphobia",
                    "reason": "Yalnız kalma korkusu var ama birden çok ortamdan kaçınma örüntüsü tarif edilmiyor; kaçınma ortaya çıkarsa ek tanı olarak değerlendirilmelidir."
                }
            ],
            "teachingPoint": "Panik bozukluğun özü beklenmedik atağın kendisi değil, ataktan sonra en az bir ay süren yeni atak korkusu ve davranış değişikliğidir."
        }
    },
    {
        "id": "case-003",
        "caseNumber": 3,
        "difficulty": "Zor",
        "course": "ADULT",
        "diagnosisId": "ocpd",
        "category": "PERSONALITY_C",
        "patientSummary": "46 yaşında, erkek, kıdemli denetçi",
        "clues": [
            "Danışan, eşinin ve iş arkadaşlarının 'katı, inatçı ve aşırı kuralcı' olmasından şikayet etmesi üzerine eşinin zoruyla görüşmeye geliyor; kendisinde hiçbir sorun olmadığını, herkesin işini onun gibi kusursuz yapması gerektiğini savunuyor.",
            "Tüm hayatı boyunca ayrıntılara, listelere, kurallara ve programlara aşırı odaklandığı için projelerin ana amacını unuttuğu ve teslim tarihlerini sıklıkla kaçırdığı öğreniliyor.",
            "Eski ve hiçbir değeri olmayan eşyaları 'bir gün lazım olur' diye asla atamamakta, para harcamayı felaket durumları için sakınılması gereken bir şey olarak görüp aşırı cimri davranmaktadır.",
            "Madde kullanımı yoktur, rutin nörolojik ve biyokimyasal testler normaldir.",
            "Ruhsal Durum Muayenesinde: Düşünce yapısı aşırı formal, duygulanımı kısıtlı ve ahlaki/etik konularda aşırı katı (infleksibl). Görevleri tam istediği standartta yapmayacakları gerekçesiyle başkalarına asla delege edemiyor. Kendisini egosintonik görmektedir.",
            "DSM-5'e göre: Esneklik, açıklık ve verimlilik pahasına düzenlilik, mükemmeliyetçilik, zihinsel ve kişilerarası denetim üzerine aşırı kafa yorma örüntüsü mevcuttur; klasik intruzif takıntılar (obsesyonlar) ve bunları rahatlatıcı mantıksız ritüeller (kompulsiyonlar) yoktur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "kendisinde hiçbir sorun olmadığını",
                "dsmMatch": "Egosintonik Yapı: Kişi semptomları kişiliğinin doğru bir parçası olarak görür"
            },
            {
                "clueIndex": 1,
                "text": "ayrıntılara, listelere, kurallara ve programlara aşırı odaklandığı için",
                "dsmMatch": "DSM-5 Kriter 1: Ayrıntılar, kurallar, listelerle uğraşmaktan etkinliğin ana amacını kaçırma"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Şema Terapi & Bilişsel Davranışçı Terapi (BDT)",
            "therapyDetails": "'Yüksek Standartlar' ve 'Kusursuzluk' şemalarını esnetme; hata yapma toleransını artırma.",
            "pharmacologyNote": "Spesifik bir ilaç tedavisi yoktur; eşlik eden kaygı/depresyonda SSRI tercih edilebilir."
        },
        "miniQuiz": {
            "question": "Obsesif-Kompulsif Bozukluk (OKB) ile Obsesif-Kompulsif Kişilik Bozukluğu (OKKB) arasındaki en kritik fark nedir?",
            "options": [
                "OKB egodistoniktir (kişi takıntılarından rahatsızdır); OKKB ise egosintoniktir (kişi kurallarının ve mükemmeliyetçiliğinin doğru olduğuna inanır).",
                "OKKB sadece kadınlarda görülür, OKB ise erkeklerde.",
                "OKKB hastalarında el yıkama ritüelleri günde 10 saati geçer.",
                "OKB bir kişilik bozukluğudur, OKKB ise anksiyete bozukluğudur."
            ],
            "correctIndex": 0,
            "explanation": "OKB'de takıntılar egodistoniktir. OKKB'de ise mükemmeliyetçilik ve katılık kişinin benimsediği (egosintonik) karakter özelliğidir."
        },
        "differentialDiagnosis": "• OKB: Egodistoniktir, spesifik obsesyon-kompulsiyon döngüsü vardır.\n• Narsisistik KB: Narsist hayranlık ister; OKKB ise kurallara odaklanır.",
        "dsmCriteriaSummary": "DSM-5 (En az 4/8): Ayrıntılarla uğraşmaktan işin özünü kaçırma, mükemmeliyetçilik, aşırı işkoliklik, ahlaki katılık, eşya biriktirme, delege edememe, cimrilik, inatçılık.",
        "therapyId": "schema_therapy",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Ayrıntılara, listelere ve kurallara aşırı odaklanıp işin ana amacını kaçırması ve teslim tarihlerini geciktirmesi düzen ve mükemmeliyetçilik uğraşını gösterir.",
                "İşi devredememe, ahlaki konularda katılık, para harcamada aşırı cimrilik ve değersiz eşyaları atamama ayrı ayrı kişilik özelliği ölçütleridir.",
                "Örüntü yaşam boyu süreklidir ve kişi bunu sorun olarak görmez (egosintonik)."
            ],
            "whyNot": [
                {
                    "diagnosisId": "ocd",
                    "reason": "İstenmeyen, sıkıntı veren obsesyonlar ve onları yatıştıran ritüeller yoktur; katılık kişinin kendi değerleriyle uyumludur."
                },
                {
                    "diagnosisId": "hoarding_disorder",
                    "reason": "Eşya atamama tek başına öne çıkmıyor; yaşam alanını kullanılamaz hale getiren birikim değil, daha geniş bir kontrol ve mükemmeliyetçilik örüntüsünün parçasıdır."
                },
                {
                    "diagnosisId": "narcissistic_pd",
                    "reason": "Başkalarını eleştirmesi hayranlık ihtiyacından değil, işlerin doğru ve kurala uygun yapılması kaygısından kaynaklanır."
                }
            ],
            "teachingPoint": "OKKB'yi OKB'den ayıran şey içgörü ve yaşantının niteliğidir: OKKB'de katılık benimsenmiş bir kişilik tarzıdır, OKB'de ise istenmeyen obsesyonlar ve ritüeller vardır."
        }
    },
    {
        "id": "case-004",
        "caseNumber": 4,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "schizophrenia",
        "category": "PSYCHOTIC",
        "patientSummary": "21 yaşında, erkek, üniversiteyi terk etmiş",
        "clues": [
            "Ailesi tarafından getirilen genç, son 7 aydır odasından çıkmadığını, radyo ve televizyondaki haber spikerlerinin kendisine gizli kodlarla mesaj ilettiğini ve duvarların arkasından iki kişinin kendi hareketleri hakkında alaycı yorumlar yaptığını ifade ediyor.",
            "Belirtiler yaklaşık 1 yıl önce içe kapanma, kişisel hijyeni ihmal etme ve ders başarısında çöküş ile başlamış; son 6 aydır kesintisiz olarak aktif psikotik semptomlar devam etmektedir.",
            "Öğrenci, ailesinin yemeklerine zehir kattığına inandığı için sadece kapalı ambalajlı bisküvileri yemekte, günlerce yıkanmamakta ve göz temasından kaçınmaktadır.",
            "Beyin MRG ve EEG incelemeleri normaldir; idrar toksikoloji taramasında esrar, amfetamin veya diğer psikoaktif maddeler negatif çıkmıştır.",
            "Ruhsal Durum Muayenesinde: Künt duygulanım (duygusal tepkisizlik), düşünce içeriğinde referans ve perseküsyon (kötülük görme) sanrıları, işitsel varsanılar (üçüncü şahıs sesler), düşünce bloğu ve konuşmada fakirleşme (aloji) gözleniyor.",
            "DSM-5'e göre: En az 6 aydır süren bozukluk belirtileri içinde en az 1 ay süresince aktif hezeyan, halüsinasyon ve negatif belirtiler mevcuttur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "haber spikerlerinin kendisine gizli kodlarla mesaj ilettiğini",
                "dsmMatch": "DSM-5 Kriter A1: Alınma / Referans Sanrıları"
            },
            {
                "clueIndex": 0,
                "text": "duvarların arkasından iki kişinin kendi hareketleri hakkında alaycı yorumlar yaptığını",
                "dsmMatch": "DSM-5 Kriter A2: Üçüncü Şahıs İşitsel Varsanılar (Halüsinasyon)"
            },
            {
                "clueIndex": 4,
                "text": "Künt duygulanım",
                "dsmMatch": "DSM-5 Kriter A5: Negatif Belirtiler"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Psikososyal Beceri Eğitimi & CBTp (Psikoz için BDT)",
            "therapyDetails": "Sanrı ve varsanılara yüklenen anlamları esnetme, stresle başa çıkma ve sosyal beceri eğitimi.",
            "pharmacologyNote": "İkinci kuşak antipsikotikler (Risperidon, Olanzapin, Aripiprazol) temel biyolojik tedavidir."
        },
        "miniQuiz": {
            "question": "Belirtiler aynı kalsaydı ancak süre 6 ay yerine toplam 3 ay sürseydi doğru DSM-5 tanısı ne olurdu?",
            "options": [
                "Şizofreniform Bozukluk",
                "Kısa Psikotik Bozukluk",
                "Sanrılı Bozukluk",
                "Şizoaffektif Bozukluk"
            ],
            "correctIndex": 0,
            "explanation": "Şizofreni A kriterlerini karşılayan ancak 1-6 ay arası süren tablolar DSM-5'te 'Şizofreniform Bozukluk' olarak tanı alır."
        },
        "differentialDiagnosis": "• Kısa Psikotik Bozukluk: Süre < 1 ay.\n• Şizofreniform Bozukluk: 1-6 ay arası.\n• Şizoaffektif Bozukluk: Belirgin mani/depresyon dönemi psikozla eşzamanlı eşlik etmez.",
        "dsmCriteriaSummary": "DSM-5: Sanrılar, varsanılar, dezorganize konuşma, katatonik davranış, negatif belirtiler (en az 2/5). Süre ≥ 6 ay.",
        "therapyId": "cbtp",
        "pharmacologyId": "atypical_ap_secondgen",
        "explanation": {
            "whyThis": [
                "Referans ve kötülük görme sanrıları ile hakkında yorum yapan sesler, en az ikisi pozitif belirti olan aktif faz ölçütünü karşılar.",
                "Belirtiler bir yıl önce içe kapanma, hijyen ihmali ve ders başarısında düşüşle başlamış; prodrom dahil toplam süre altı ayı aşar.",
                "Künt duygulanım ve aloji gibi negatif belirtiler, toksikolojinin ve beyin görüntülemenin normal olması tabloyu tamamlar."
            ],
            "whyNot": [
                {
                    "diagnosisId": "schizophreniform",
                    "reason": "Toplam hastalık süresi altı ayı geçtiği için şizofreniform bozukluk için öngörülen 1-6 ay sınırının dışındadır."
                },
                {
                    "diagnosisId": "delusional_disorder",
                    "reason": "Belirgin işitsel varsanılar, düşünce bloğu, aloji ve işlevsellikte ağır çöküş sanrılı bozuklukla bağdaşmaz."
                },
                {
                    "diagnosisId": "substance_induced_psychotic",
                    "reason": "İdrar toksikolojisi esrar ve uyarıcılar dahil negatiftir ve psikoz madde kullanımıyla zamansal ilişki göstermiyor."
                }
            ],
            "teachingPoint": "Psikotik bozuklukları ayırırken önce toplam süreyi (prodrom ve kalıntı dahil) say: bir aydan kısa kısa psikotik, 1-6 ay şizofreniform, altı aydan uzun şizofreni."
        }
    },
    {
        "id": "case-005",
        "caseNumber": 5,
        "difficulty": "Kolay",
        "course": "ADULT",
        "diagnosisId": "bipolar_1",
        "category": "BIPOLAR",
        "patientSummary": "29 yaşında, erkek, borsa aracısı",
        "clues": [
            "Danışan son 6 gündür günde sadece 1.5 saat uyuduğu halde kendini 'nükleer bir enerjiyle dolu, dünyanın en dahi yatırımcısı' olarak hissettiğini ve 3 yeni şirket kurmak için tüm mal varlığını tek gecede kripto paralara yatırdığını anlatıyor.",
            "Konuşması o kadar hızlı ve basınçlıdır ki (baskılı konuşma) araya girmek imkansızdır; bir fikirden diğerine saniyeler içinde atlamakta (fikir uçuşması) ve kliniğin ortasında şarkı söylemeye başlamaktadır.",
            "İş yerindeki yöneticisine bağırıp masaları tekmelediği ve tanımadığı insanlara sokakta binlerce lira dağıttığı için ailesi tarafından zorla getirilmiştir.",
            "Madde toksikoloji taraması negatif; tiroid ve metabolik paneli normaldir.",
            "Ruhsal Durum Muayenesinde: Taşkın duygudurum, grandiyöz sanrılar, psikomotor ajitasyon ve riskli davranışlarda aşırı artış.",
            "DSM-5'e göre: En az 1 hafta süren kabarmış, taşkın veya irritabl duygudurum ile giden Manik Epizod mevcuttur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "günde sadece 1.5 saat uyuduğu halde",
                "dsmMatch": "DSM-5 Kriter B2: Uyku gereksiniminde azalma"
            },
            {
                "clueIndex": 0,
                "text": "dünyanın en dahi yatırımcısı",
                "dsmMatch": "DSM-5 Kriter B1: Büyüklük (grandiyözite)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Sosyal Ritim Terapisi (IPSRT) & Bilişsel Terapi",
            "therapyDetails": "Uyku-uyanıklık döngüsünü sabitleme, erken uyarı işaretlerini tanıma ve ilaç uyumu.",
            "pharmacologyNote": "Lityum, Valproat ve atipik antipsikotikler temel tedavidir."
        },
        "miniQuiz": {
            "question": "Bipolar I tanısı koyabilmek için kişinin geçmişinde mutlaka bir Majör Depresyon atağı geçirmiş olması şart mıdır?",
            "options": [
                "Hayır, tek bir Manik Epizod geçirilmiş olması Bipolar I tanısı koymak için yeterlidir.",
                "Evet, en az 3 majör depresyon atağı zorunludur.",
                "Evet, sadece depresyonu olanlara Bipolar I denir.",
                "Mani olmadan sadece hipomani varsa Bipolar I konur."
            ],
            "correctIndex": 0,
            "explanation": "Tek bir manik atak geçirilmiş olması Bipolar I tanısı için yeterlidir."
        },
        "differentialDiagnosis": "• Bipolar II: Sadece Hipomani ve Majör Depresyon vardır.\n• Madde Etkisi: Toksikoloji negatiftir.",
        "dsmCriteriaSummary": "DSM-5: En az 1 hafta süren kabarmış duygudurum + En az 3 manik belirti.",
        "therapyId": "ipsrt",
        "pharmacologyId": "lithium_gold",
        "explanation": {
            "whyThis": [
                "Günde 1,5 saat uykuyla enerjik hissetme, kendini dahi görme ve tüm mal varlığını yatırma; azalmış uyku ihtiyacı, büyüklenmecilik ve riskli davranışı gösterir.",
                "Baskılı konuşma ve fikir uçuşması ek manik belirtilerdir.",
                "İş yerinde saldırganlık, sokakta para dağıtma ve zorla getirilme işlevselliğin belirgin bozulduğunu, yani hipomaniyi aşan şiddette bir epizodu gösterir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "bipolar_2",
                    "reason": "Ağır işlev bozukluğu ve grandiyöz sanrılar epizodu manik yapar; tek bir manik epizod Bipolar II tanısını dışlar."
                },
                {
                    "diagnosisId": "substance_induced_bipolar",
                    "reason": "Toksikoloji negatiftir; ancak uyarıcı ya da antidepresan kullanımı öyküsü ayrıca sorgulanmalıdır."
                },
                {
                    "diagnosisId": "cyclothymia",
                    "reason": "Siklotimi tam manik epizod içermez; burada ölçütleri tam karşılayan bir mani vardır."
                }
            ],
            "teachingPoint": "Mani ile hipomaniyi belirtilerin listesi değil şiddet ayırır: belirgin işlev bozukluğu, hastaneye yatış gereği ya da psikotik özellik varsa epizod maniktir."
        }
    },
    {
        "id": "case-006",
        "caseNumber": 6,
        "difficulty": "Kolay",
        "course": "ADULT",
        "diagnosisId": "social_anxiety",
        "category": "ANXIETY",
        "patientSummary": "22 yaşında, kadın, üniversite öğrencisi",
        "clues": [
            "Danışan sınıfta sunum yapması gerektiğinde veya tanımadığı insanların bulunduğu bir ortamda yemek yerken 'herkesin ona baktığı, sesinin titreyeceği, yüzünün kızaracağı ve rezil olacağı' korkusuyla dehşete düştüğünü belirterek başvuruyor.",
            "Bu durum lise yıllarından beri sürmekte olup son 1 yıldır derslerde yoklama alınırken adını söylemekten bile kaçınmakta, sunum zorunluluğu olan dersleri bırakmaktadır.",
            "Korkulan ortamlarda kalp çarpıntısı, ellerde titreme, aşırı terleme ve midede düğümlenme hissi yaşamaktadır.",
            "Nörolojik muayene ve tiroid testleri tamamen normaldir.",
            "Ruhsal Durum Muayenesinde: Olumsuz değerlendirilme korkusu, performans anksiyetesi ve yoğun sosyal kaçınma örüntüsü mevcuttur.",
            "DSM-5'e göre: Başkalarınca değerlendirilebilecek bir ya da birden fazla toplumsal durumda belirgin bir korku ya da kaygı duyma (en az 6 ay) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "rezil olacağı",
                "dsmMatch": "DSM-5 Kriter B: Olumsuz değerlendirilecek biçimde davranmaktan korkma"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi (Kademeli Maruz Bırakma & Video Geribildirimi)",
            "therapyDetails": "Dikkati içsel sinyallerden dış dünyaya yöneltme ve sosyal ortamlarda maruz bırakma.",
            "pharmacologyNote": "SSRI'lar (Sertralin) ve performans anksiyetesinde beta-blokerler kullanılır."
        },
        "miniQuiz": {
            "question": "Sosyal Anksiyete Bozukluğunda temel bilişsel odak nedir?",
            "options": [
                "Başkaları tarafından rezil, aptal, yetersiz veya kaygılı olarak olumsuz değerlendirilme korkusu",
                "Açık alanda panik atak geçirip yardım bulamama korkusu",
                "Mikrop kapıp hastalanma korkusu",
                "Uçakta türbülansa girip düşme korkusu"
            ],
            "correctIndex": 0,
            "explanation": "Sosyal anksiyetenin özü, toplumsal performans veya etkileşim anında olumsuz değerlendirilme korkusudur."
        },
        "differentialDiagnosis": "• Agorafobi: Kaçamama korkusudur; Sosyal Anksiyete ise rezil olma korkusudur.\n• Kaçıngan KB: Daha derin bir yetersizlik inancıdır.",
        "dsmCriteriaSummary": "DSM-5: Başkalarınca değerlendirilebilecek durumlarda belirgin korku + Olumsuz değerlendirilme korkusu + Kaçınma. Süre ≥ 6 ay.",
        "therapyId": "invivo_exposure",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Sunum yapma ve başkalarının önünde yemek yeme gibi değerlendirilebileceği durumlarda rezil olma korkusu temel ölçüttür.",
                "Yoklamada adını söylemekten kaçınma ve sunumlu dersleri bırakma, korkulan durumlardan kaçınmayı ve işlev kaybını gösterir.",
                "Belirtiler liseden beri, yani altı aydan uzun süredir devam etmektedir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "agoraphobia",
                    "reason": "Korkunun odağı kaçamamak ya da yardım alamamak değil, başkalarınca olumsuz değerlendirilmektir."
                },
                {
                    "diagnosisId": "avoidant_pd",
                    "reason": "Korku belirli performans ve gözlenme durumlarıyla sınırlı görünüyor; genel yetersizlik inancı ve ilişkilerden yaygın kaçınma tarif edilmiyor."
                },
                {
                    "diagnosisId": "panic_disorder",
                    "reason": "Çarpıntı ve titreme yalnızca korkulan sosyal durumlarda ortaya çıkıyor; beklenmedik, nedensiz ataklar yoktur."
                }
            ],
            "teachingPoint": "Benzer bedensel kaygı belirtilerinde tanıyı belirleyen korkunun içeriğidir: toplumsal kaygıda odak başkalarının olumsuz değerlendirmesidir."
        }
    },
    {
        "id": "case-007",
        "caseNumber": 7,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "ptsd",
        "category": "TRAUMA",
        "patientSummary": "32 yaşında, erkek, depremzede",
        "clues": [
            "Danışan 14 ay önce yaşanan büyük depremde göçük altından 18 saat sonra çıkarılmış; o günden beri her korna sesinde veya kapı çarpmasında deprem oluyormuş gibi yerinden fırladığını ve geceleri aynı göçük anını kabus olarak gördüğünü anlatıyor.",
            "Depremle ilgili haberleri, yıkık binaların olduğu sokakları görmemek için yolunu 5 kilometre uzatmakta ve depremden bahseden akrabalarıyla görüşmeyi tamamen kesmiştir.",
            "Olaydan bu yana kendini duygusal olarak tamamen hissizleşmiş, kimseye sevgi duyamayan, geleceğe dair hiçbir plan yapamayan biri olarak tanımlamaktadır.",
            "Genel biyokimyasal ve nörolojik taramalar olağandır.",
            "Ruhsal Durum Muayenesinde: Aşırı irkilme tepkisi (hipervijilans), travmayı yeniden yaşantılama (flashbackler), intrüzif anılar ve duygusal küntleşme.",
            "DSM-5'e göre: Gerçek bir ölüm/ağır yaralanma tehdidine maruz kalma ve ardından 1 aydan uzun süren yeniden yaşantılama, kaçınma, bilişsel/duygudurum değişiklikleri ve uyarılmışlık belirtileri mevcuttur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "geceleri aynı göçük anını kabus olarak gördüğünü",
                "dsmMatch": "DSM-5 Kriter B: İstilacı (yeniden yaşantılama) belirtileri"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Travma Odaklı BDT & EMDR",
            "therapyDetails": "Travmatik anı ağlarını güvenli bir şekilde işleme, kaçınmaları söndürme.",
            "pharmacologyNote": "SSRI grubu antidepresanlar ve kabuslar için Prazosin etkilidir."
        },
        "miniQuiz": {
            "question": "Travma Sonrası Stres Bozukluğu (TSSB) ile Akut Stres Bozukluğu arasındaki en belirgin tanısal ayrım nedir?",
            "options": [
                "Belirtilerin süresi: Akut Stres Bozukluğu 3 gün ile 1 ay arası sürer; TSSB ise 1 aydan uzun sürer.",
                "TSSB sadece çocuklarda görülür.",
                "Akut stres bozukluğunda kabus görülmez.",
                "TSSB'de ilaç tedavisi yasaktır."
            ],
            "correctIndex": 0,
            "explanation": "Travmatik stresör sonrası ilk 1 ay Akut Stres; 1 ayı aşan tablo TSSB'dir."
        },
        "differentialDiagnosis": "• Akut Stres Bozukluğu: Süre < 1 aydır.\n• Uyum Bozukluğu: Yaşam stresörlerine yanıttır.",
        "dsmCriteriaSummary": "DSM-5: Travmaya maruz kalma + Yeniden yaşantılama + Kaçınma + Olumsuz duygudurum + Uyarılmışlık. Süre > 1 ay.",
        "therapyId": "emdr",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Göçük altında 18 saat kalmak, gerçek ölüm tehdidine doğrudan maruz kalma ölçütünü karşılar.",
                "Kabuslar ve ani seslerle yeniden yaşantılama, haber ve sokaklardan kaçınma, duygusal hissizlik ve aşırı irkilme dört belirti kümesinin hepsini kapsar.",
                "Belirtiler olaydan 14 ay sonra hâlâ sürmektedir, yani bir aydan uzundur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "acute_stress_disorder",
                    "reason": "Akut stres bozukluğu travmadan sonraki ilk ay ile sınırlıdır; burada belirtiler bir yılı aşmıştır."
                },
                {
                    "diagnosisId": "mdd",
                    "reason": "Hissizlik ve geleceğe dair plan yapamama var, ancak tablo travmaya bağlı yeniden yaşantılama ve kaçınma ile tanımlanır; ayrıca iki haftalık çökkünlük ölçütleri sorgulanmadan depresyon konamaz."
                },
                {
                    "diagnosisId": "adjustment_disorder",
                    "reason": "Stresör yaşamı tehdit eden bir travmadır ve belirtiler TSSB ölçütlerini tam karşılar; uyum bozukluğu bu durumda tercih edilmez."
                }
            ],
            "teachingPoint": "Travma sonrası tablolarda süre belirleyicidir: ilk bir ay akut stres bozukluğu, bir aydan sonra süren tablo TSSB'dir."
        }
    },
    {
        "id": "case-008",
        "caseNumber": 8,
        "difficulty": "Kolay",
        "course": "ADULT",
        "diagnosisId": "gad",
        "category": "ANXIETY",
        "patientSummary": "38 yaşında, kadın, öğretmen",
        "clues": [
            "Danışan son 1 yıldır çocuklarının sağlığı, evin bütçesi, okul müdürünün bir bakışı gibi hayatın her alanıyla ilgili 'sürekli en kötü felaketin gerçekleşeceği' yönünde aşırı ve kontrol edilemez bir evham yaşadığını anlatıyor.",
            "Bu sürekli endişe halini durduramadığını, gün boyu omuzlarında ve boynunda kronik kas gerginliği, çabuk yorulma, konsantrasyon güçlüğü ve huzursuzluk hissettiğini belirtiyor.",
            "Geceleri 'Ya yarın bir aksilik olursa' düşünceleri yüzünden uykuya dalmakta zorlanmakta ve sabahları dinlenmemiş olarak uyanmaktadır.",
            "Rutin kan sayımı, tiroid ve kardiyak değerlendirmeleri tamamen normaldir.",
            "Ruhsal Durum Muayenesinde: Yaygın beklenti kaygısı, motor gerginlik ve otonomik aşırı duyarlılık saptanmıştır.",
            "DSM-5'e göre: En az 6 aylık bir sürenin çoğu gününde, bir dizi etkinlik ya da olay hakkında aşırı bir kaygı ve kuruntu duyma ve bu kaygıyı denetlemekte güçlük çekme mevcuttur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "aşırı ve kontrol edilemez bir evham",
                "dsmMatch": "DSM-5 Kriter A & B: Aşırı kaygı ve kuruntu; denetlemekte güçlük çekme"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi (BDT)",
            "therapyDetails": "Belirsizliğe tahammül geliştirme, endişe erteleme saatleri ve progresif kas gevşetme.",
            "pharmacologyNote": "SSRI/SNRI antidepresanlar (Venlafaksin) birinci basamaktır."
        },
        "miniQuiz": {
            "question": "Yaygın Anksiyete Bozukluğu (YAB) için DSM-5'te belirtilen asgari süre kriteri nedir?",
            "options": [
                "En az 6 ay",
                "En az 1 ay",
                "En az 2 hafta",
                "En az 1 yıl"
            ],
            "correctIndex": 0,
            "explanation": "YAB tanısı için aşırı kuruntu ve kaygının en az 6 ay sürmesi gerekir."
        },
        "differentialDiagnosis": "• Panik Bozukluk: Panikte ani nöbetler vardır; YAB'de gün geneline yayılan evham vardır.",
        "dsmCriteriaSummary": "DSM-5: En az 6 ay süren aşırı kaygı + Kontrol güçlüğü + En az 3 somatik belirti.",
        "therapyId": "cbt_general",
        "pharmacologyId": "snri_dualex",
        "explanation": {
            "whyThis": [
                "Çocukların sağlığı, bütçe ve iş gibi birçok alana yayılan, denetlenemeyen ve en az altı aydır süren kaygı temel ölçüttür.",
                "Kas gerginliği, çabuk yorulma, konsantrasyon güçlüğü, huzursuzluk ve uyku sorunu gerekli bedensel/bilişsel belirtileri karşılar.",
                "Tiroid ve kardiyak değerlendirmenin normal olması kaygının tıbbi bir nedene bağlı olmadığını gösterir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "panic_disorder",
                    "reason": "Ani başlayıp dakikalar içinde tepe yapan ataklar yoktur; kaygı gün boyu süren bir kuruntudur."
                },
                {
                    "diagnosisId": "mdd",
                    "reason": "Uyku ve konsantrasyon sorunları ortak olsa da çökkün duygudurum veya anhedoni tarif edilmiyor; ana yaşantı gelecek kaygısıdır."
                },
                {
                    "diagnosisId": "illness_anxiety_disorder",
                    "reason": "Kaygı tek bir konuya, kendisinin ciddi bir hastalığa sahip olduğu inancına odaklı değil, birçok yaşam alanına yayılmıştır."
                }
            ],
            "teachingPoint": "YAB'nin ayırt edici özelliği kaygının tek bir nesneye değil, değişen birçok gündelik konuya yayılması ve kişinin onu durduramamasıdır."
        }
    },
    {
        "id": "case-009",
        "caseNumber": 9,
        "difficulty": "Orta",
        "course": "FORENSIC",
        "diagnosisId": "antisocial_pd",
        "category": "PERSONALITY_B",
        "patientSummary": "27 yaşında, erkek, cezaevi hükümlüsü",
        "clues": [
            "Danışan dolandırıcılık, gasp ve sahte evrak düzenleme suçlarından dolayı cezaevinde bulunmakta olup sevk edildiği adli heyet görüşmesinde 'İnsanlar bu kadar aptal olmasa onları dolandırmazdım, suç bende değil kanunlarda' diyerek mağdurlara karşı sıfır pişmanlık ve empati sergilemektedir.",
            "15 yaşından önce sokak kedilerine işkence ettiği, okulun camlarını kırdığı, çete kurup hırsızlık yaptığı ve ailesinden sürekli para çaldığı (çocuklukta Davranım Bozukluğu öyküsü) kayıtlardan doğrulanmıştır.",
            "Sık sık sahte kimlikler kullanmakta, insanları manipüle ederek çıkarları için yalan söylemekte ve fiziksel kavgalara karışmaktadır.",
            "Nörolojik muayene ve EEG tetkiklerinde organik bir patoloji saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Büyüleyici/sempatik görünümün (superficial charm) altında derin empati yoksunluğu, kural tanımazlık ve dürtüsellik.",
            "DSM-5'e göre: 15 yaşından beri süregelen, başkalarının haklarını hiçe sayma ve çiğneme örüntüsü ile en az 18 yaşında olma ve 15 yaşından önce Davranım Bozukluğu kanıtı bulunması kriterleri karşılanmaktadır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "mağdurlara karşı sıfır pişmanlık ve empati",
                "dsmMatch": "DSM-5 Kriter 7: Vicdan azabı/pişmanlık çekmeme"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Şema Terapi & Davranışçı Sınır Koyma Programları",
            "therapyDetails": "Empati geliştirme, kuralların sonuçlarıyla yüzleştirme.",
            "pharmacologyNote": "Saldırganlık için duygudurum dengeleyiciler kullanılabilir."
        },
        "miniQuiz": {
            "question": "Antisosyal Kişilik Bozukluğu tanısı koyabilmek için yaş sınırları ve çocukluk geçmişiyle ilgili hangi şart zorunludur?",
            "options": [
                "Kişinin en az 18 yaşında olması ve 15 yaşından önce Davranım Bozukluğu öyküsünün bulunması şarttır.",
                "Kişinin en az 40 yaşında olması gerekir.",
                "Çocuklukta hiçbir sorun yaşamamış olması gerekir.",
                "Tanı 12 yaşında kesinleştirilebilir."
            ],
            "correctIndex": 0,
            "explanation": "Antisosyal KB tanısı ancak 18 yaşından sonra konabilir ve 15 öncesi Davranım Bozukluğu kanıtı şarttır."
        },
        "differentialDiagnosis": "• Narsisistik KB: Suç ve şiddet zorunlu değildir; Narsistte statü ön plandadır.",
        "dsmCriteriaSummary": "DSM-5: Yasalara uymama, hilekarlık, dürtüsellik, saldırganlık, sorumsuzluk, pişmanlık duymama + Yaş ≥ 18.",
        "therapyId": "schema_therapy",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Dolandırıcılık, sahte kimlik kullanma, manipülatif yalanlar ve kavgalar başkalarının haklarını yaygın biçimde hiçe saymayı gösterir.",
                "Mağdurlara karşı pişmanlık ve empati yokluğu ile kuralları suçlama vicdan eksikliği ölçütüne karşılık gelir.",
                "15 yaşından önce hayvanlara işkence, hırsızlık ve vandalizm kayıtlarla doğrulanmıştır; bu, tanı için zorunlu olan çocukluk davranım bozukluğu kanıtıdır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "narcissistic_pd",
                    "reason": "Empati eksikliği ortak olsa da öndeki motivasyon hayranlık ve statü değil; suç, aldatma ve şiddet örüntüsü baskındır."
                },
                {
                    "diagnosisId": "conduct_disorder",
                    "reason": "Kişi 27 yaşındadır ve örüntü erişkinlikte sürmektedir; 18 yaş üstünde ölçütler karşılanıyorsa antisosyal kişilik bozukluğu konur."
                },
                {
                    "diagnosisId": "intermittent_explosive",
                    "reason": "Kavgalar planlı, çıkar amaçlı davranışların bir parçasıdır; tetikleyiciyle orantısız, plansız öfke patlamaları tablonun merkezinde değildir."
                }
            ],
            "teachingPoint": "Antisosyal kişilik bozukluğu için iki yaş koşulunu unutma: kişi en az 18 yaşında olmalı ve 15 yaşından önce davranım bozukluğu kanıtı bulunmalıdır."
        }
    },
    {
        "id": "case-010",
        "caseNumber": 10,
        "difficulty": "Kolay",
        "course": "ADULT",
        "diagnosisId": "mdd",
        "category": "MOOD",
        "patientSummary": "44 yaşında, kadın, banka müdürü",
        "clues": [
            "Danışan son 5 haftadır yataktan çıkmak istemediğini, en sevdiği hobisi olan resim yapmaktan bile hiçbir zevk alamadığını (anhedoni) ve kendini 'derin, karanlık bir çukurda' hissettiğini anlatıyor.",
            "İştahı tamamen kesilmiş ve bu sürede 6 kilo vermiştir; sabahları saat 04:00'te uyanıp tekrar uyuyamamakta (terminal insomni) ve gün boyu aşırı yorgun hissetmektedir.",
            "Sürekli olarak 'Ben başarısız bir anneyim, çocuklarımın hayatını mahvettim' şeklinde uygunsuz değersizlik ve suçluluk düşünceleri üretmektedir.",
            "Tıbbi tetkiklerde TSH, B12, D vitamini ve tam kan sayımı normal sınırlardadır.",
            "Ruhsal Durum Muayenesinde: Psikomotor yavaşlama, kederli duygulanım, konsantrasyon kaybı ve pasif özkıyım düşünceleri saptanmıştır.",
            "DSM-5'e göre: İki haftalık bir dönem boyunca çökkün duygudurum ya da ilgi/zevk kaybı belirtilerinden en az birini içeren en az 5 depresif semptom mevcuttur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "hiçbir zevk alamadığını (anhedoni)",
                "dsmMatch": "DSM-5 Kriter A2: Anhedoni (zevk alamama)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi (BDT) & Davranışsal Aktivasyon",
            "therapyDetails": "Beck'in bilişsel üçlüsünü yeniden yapılandırma ve günlük etkinlik çizelgesi.",
            "pharmacologyNote": "SSRI veya SNRI grubu antidepresanlar birinci sıra tedavidir."
        },
        "miniQuiz": {
            "question": "DSM-5'e göre Majör Depresif Bozukluk atağı tanısı için belirtilerin en az ne kadar sürmesi şarttır?",
            "options": [
                "En az 2 hafta kesintisiz sürmelidir",
                "En az 6 ay sürmelidir",
                "En az 3 gün sürmelidir",
                "En az 1 yıl sürmelidir"
            ],
            "correctIndex": 0,
            "explanation": "Majör Depresif Epizod için sürenin en az 2 hafta olması zorunludur."
        },
        "differentialDiagnosis": "• Distimi: En az 2 yıl sürer; epizodik değildir.",
        "dsmCriteriaSummary": "DSM-5: Çökkün duygudurum, anhedoni, kilo/uyku değişimi, değersizlik, yorgunluk (en az 5/9). Süre ≥ 2 hafta.",
        "therapyId": "behavioral_activation",
        "pharmacologyId": "ect_biological_acute",
        "explanation": {
            "whyThis": [
                "Beş haftadır süren çökkün duygudurum ve resim yapmaktan bile zevk alamama, gerekli iki çekirdek belirtiyi içerir.",
                "Kilo kaybı, erken uyanma, yorgunluk, değersizlik/suçluluk, psikomotor yavaşlama, konsantrasyon kaybı ve pasif özkıyım düşünceleri beş belirti eşiğini rahatça aşar.",
                "Daha önce bir epizod bildirilmiyor; şu anki bilgiyle tek epizod olarak kodlanır. Geçmişte ayrı bir epizod varsa tanı değişmez, yalnızca ‘yineleyici’ olarak kodlanır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "dysthymia",
                    "reason": "Belirtiler beş haftadır vardır; distimi en az iki yıl süren daha hafif ve süreğen bir tablo gerektirir."
                },
                {
                    "diagnosisId": "bipolar_1",
                    "reason": "Öyküde mani ya da hipomani tarif edilmiyor; bu dışlanmadan majör depresyon tanısı konmaz ve bipolar depresyon olasılığı mutlaka sorgulanmalıdır."
                },
                {
                    "diagnosisId": "depressive_due_to_medical",
                    "reason": "TSH, B12, D vitamini ve kan sayımı normaldir; depresyonu açıklayan tıbbi bir durum saptanmamıştır."
                }
            ],
            "teachingPoint": "Majör depresyon tanısından önce her zaman geçmiş mani/hipomani dönemlerini sor; bu yanıt tedaviyi ve tanıyı kökten değiştirir."
        }
    },
    {
        "id": "case-011",
        "caseNumber": 11,
        "difficulty": "Orta",
        "course": "FORENSIC",
        "diagnosisId": "narcissistic_pd",
        "category": "PERSONALITY_B",
        "patientSummary": "39 yaşında, erkek, şirket CEO'su",
        "clues": [
            "Danışan, yönetim kurulunun kendisini yeterince övmemesi ve fikirlerine itiraz etmesi üzerine öfke krizine girerek şirketi terk etmiş ve 'Bu vasat insanların benim dehamı takdir edememesi katlanılmaz' diyerek seansa geliyor.",
            "Tüm ilişkilerinde insanların sadece kendi başarılarına hayranlık duymasını beklemekte, başkalarının duygularını ve sorunlarını tamamen önemsiz görmektedir (empati yoksunluğu).",
            "Özel haklara sahip olduğuna (entitlement inancı) inanmakta, sıradan insanların uyduğu kuralların kendisi için geçerli olmadığını savunmaktadır.",
            "Tıbbi değerlendirmeler temizdir; madde kullanımı veya bipolar manik dönem saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Büyüklenmeci (grandiyöz) benlik algısı, sürekli hayranlık arayışı, eleştiriye karşı aşırı kırılganlık ve narsisistik öfke.",
            "DSM-5'e göre: Erken erişkinlikte başlayan, büyüklenmecilik (düşlemde ya da davranışta), beğenilme gereksinimi ve eşduyum (empati) yapamama ile giden yaygın bir örüntüdür."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "benim dehamı takdir edememesi katlanılmaz",
                "dsmMatch": "DSM-5 Kriter 1: Büyüklenmecilik ve üstünlük duygusu"
            },
            {
                "clueIndex": 1,
                "text": "empati yoksunluğu",
                "dsmMatch": "DSM-5 Kriter 7: Empati yoksunluğu"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Şema Terapi & Psikodinamik Terapi",
            "therapyDetails": "'Kusurluluk/Utanç' şemasının ardındaki kırılgan benliği onarma, sağlıklı sınırlar ve gerçekçi özdeğer inşa etme.",
            "pharmacologyNote": "Primer farmakoterapisi yoktur."
        },
        "miniQuiz": {
            "question": "Narsisistik Kişilik Bozukluğu ile Histriyonik Kişilik Bozukluğu arasındaki temel fark nedir?",
            "options": [
                "Narsist 'özel statü, üstünlük ve hayranlık' ister; Histriyonik ise sadece 'ilgi odağı' olmak ister.",
                "Histriyonik bireyler asla ağlamaz.",
                "Narsisistik bireyler her zaman suç işler.",
                "İki tanı arasında hiçbir fark yoktur."
            ],
            "correctIndex": 0,
            "explanation": "Narsist üstünlük ve hayranlık peşindedir; Histriyonik ise sadece dikkat çekmek ister."
        },
        "differentialDiagnosis": "• Antisosyal KB: Suç ve şiddet yaygındır.\n• Histriyonik KB: Sadece ilgi arar; Narsist hayranlık arar.",
        "dsmCriteriaSummary": "DSM-5: Büyüklenmecilik, başarı düşlemleri, özel olduğuna inanma, aşırı beğenilme gereksinimi, empati yokluğu (en az 5/9).",
        "therapyId": "schema_therapy",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Kendi dehasının takdir edilmemesine öfke ve sürekli hayranlık beklentisi büyüklenmecilik ile beğenilme gereksinimini gösterir.",
                "Başkalarının duygularını önemsememesi empati eksikliğine, kuralların kendisi için geçerli olmadığı inancı ayrıcalık beklentisine karşılık gelir.",
                "Örüntü tüm ilişkilerinde yaygındır ve manik dönem ya da madde kullanımı dışlanmıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "bipolar_1",
                    "reason": "Büyüklenmecilik epizodik değil süreklidir; azalmış uyku, baskılı konuşma gibi manik belirtiler yoktur ve manik dönem dışlanmıştır."
                },
                {
                    "diagnosisId": "antisocial_pd",
                    "reason": "Suç, aldatma, şiddet ya da çocukluk davranım bozukluğu öyküsü tarif edilmiyor; asıl ihtiyaç hayranlıktır."
                },
                {
                    "diagnosisId": "histrionic_pd",
                    "reason": "Kişi yalnızca ilgi odağı olmak değil, üstün biri olarak beğenilmek ister; duygusal teatrallik yerine büyüklenmecilik öndedir."
                }
            ],
            "teachingPoint": "B kümesinde motivasyona bak: narsisistik kişi hayranlık, histriyonik ilgi, antisosyal çıkar, borderline ise terk edilmemek ister."
        }
    },
    {
        "id": "case-012",
        "caseNumber": 12,
        "difficulty": "Zor",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "conversion_disorder",
        "category": "SOMATIC",
        "patientSummary": "19 yaşında, kadın, lise mezunu",
        "clues": [
            "Danışan, ailesinin istemediği biriyle zorla nişanlandırılacağı gece aniden bacaklarında tam bir felç (parapleji) geliştiği ve tekerlekli sandalyeye bağımlı hale geldiği gerekçesiyle nöroloji kliniğinden yönlendiriliyor.",
            "Nörolojik muayenede derin tendon refleksleri, Babinski refleksi ve EMG testleri normal bulunmuş; Hoover testi ile psikojenik bacak güçsüzlüğü pozitif saptanmıştır (organik nörolojik yolaklarla uyumsuzluk).",
            "Hasta felç kalmış olmasına rağmen durumuna karşı şaşırtıcı bir kayıtsızlık ve sakinlik ('la belle indifférence' / güzel aldırmazlık) sergilemektedir.",
            "Kranial ve spinal MRG tamamen temizdir; toksik veya metabolik bir bozukluk yoktur.",
            "Ruhsal Durum Muayenesinde: Bilinçdışı psikolojik çatışmanın somatik nörolojik bir defisite dönüştürülmesi örüntüsü.",
            "DSM-5'e göre: İstemli motor ya da duyusal işlevlerde değişme olduğunu gösteren belirti ve nörolojik bir hastalıkla bağdaşmadığına ilişkin klinik bulgulardır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "Hoover testi ile psikojenik bacak güçsüzlüğü pozitif",
                "dsmMatch": "DSM-5 Kriter B: Nörolojik durumla bağdaşmazlık kanıtı"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Psikodinamik Terapi & BDT (Fizik Tedavi ile)",
            "therapyDetails": "Bilinçdışı çatışmaları sözel ifade etme, ikincil kazançları sonlandırma ve kademeli motor aktivasyon.",
            "pharmacologyNote": "Primer ilaç yoktur; anksiyete/depresyon varsa semptomatik tedavi uygulanır."
        },
        "miniQuiz": {
            "question": "Dönüşüm (Konversiyon) Bozukluğu ile Yapay Bozukluk arasındaki fark nedir?",
            "options": [
                "Konversiyonda felç belirtisi bilinçdışıdır; Yapay bozuklukta ise belirtiler kasıtlı ve bilinçli olarak üretilir.",
                "Konversiyon sadece erkeklerde görülür.",
                "Yapay bozuklukta test yapılmaz.",
                "İki hastalık aynıdır."
            ],
            "correctIndex": 0,
            "explanation": "Konversiyonda hasta belirtiyi bilerek taklit etmez (bilinçdışıdır); yapay bozuklukta bilinçli üretilir."
        },
        "differentialDiagnosis": "• MS / İnme: Nörolojik testlerle dışlanmıştır.\n• Temarruz: Adli çıkar için bilinçli taklittir.",
        "dsmCriteriaSummary": "DSM-5: Motor veya duyusal işlevde değişme + Nörolojik hastalıkla bağdaşmazlık kanıtı.",
        "therapyId": "psychodynamic",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Ani gelişen bacak felci, istemli motor işlevde değişikliği gösterir.",
                "Hoover testinin pozitif olması ve refleks, EMG ile MRG'nin normal bulunması belirtinin bilinen nörolojik hastalıklarla uyumsuz olduğuna dair olumlu klinik kanıttır.",
                "Belirtinin bilinçli üretildiğine ya da bir çıkar sağlandığına dair veri yoktur; zorla nişan gibi bir stresörle zamansal ilişki tabloyu destekler ama tanı için zorunlu değildir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "factitious_disorder",
                    "reason": "Belirtiyi bilerek üretme ya da hasta rolünü arama davranışına dair kanıt yoktur."
                },
                {
                    "diagnosisId": "somatic_symptom_disorder",
                    "reason": "Belirtiye ilişkin aşırı düşünce, kaygı ve uğraş yoktur; tersine hasta belirtiyle ilgili sakindir ve tablo nörolojik bir işlev kaybıdır."
                },
                {
                    "diagnosisId": "dissociative_amnesia",
                    "reason": "Bellek kaybı ya da kimlik bozulması tarif edilmiyor; dissosiyasyon burada bedensel bir motor belirti biçimindedir."
                }
            ],
            "teachingPoint": "Konversiyon tanısı ‘tıbbi neden bulunamadı’ ile değil, Hoover gibi nörolojik hastalıkla uyumsuzluğu gösteren olumlu bulgularla konur; ‘güzel aldırmazlık’ ise ayırt edici değildir."
        }
    },
    {
        "id": "case-013",
        "caseNumber": 13,
        "difficulty": "Kolay",
        "course": "ADULT",
        "diagnosisId": "ocd",
        "category": "OCD_RELATED",
        "patientSummary": "25 yaşında, kadın, kimyager",
        "clues": [
            "Danışan günde 40 kez ellerini çamaşır suyuyla yıkadığını, kapı kollarına asla çıplak elle dokunamadığını ve 'mikrop kapıp anneme bulaştıracağım ve ölümüne sebep olacağım' takıntısını zihninden bir türlü atamadığını anlatıyor.",
            "Ellerini yıkama ritüelini (kompulsiyon) tam 5 kez art arda yapmadığında içindeki dehşetin geçmediğini ve bu takıntılar yüzünden günde 4-5 saatini banyoda harcadığını ifade ediyor.",
            "Bu düşüncelerin mantıksız ve aşırı olduğunu bildiğini (egodistonik yapı ve sağlam içgörü) ancak kaygıya dayanamadığı için kendini durduramadığını belirtiyor.",
            "Dermatolojik muayenede ellerde kimyasal yanıklar ve çatlaklar mevcuttur; nörolojik muayene olağandır.",
            "Ruhsal Durum Muayenesinde: Bulaşma obsesyonları, yıkama ve kontrol kompulsiyonları; belirgin anksiyete ve içsel direnç.",
            "DSM-5'e göre: Zaman alan (günde 1 saatten fazla) ya da klinik açıdan belirgin sıkıntıya/işlevsellik kaybına yol açan obsesyonlar ve kompulsiyonlar tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "mikrop kapıp anneme bulaştıracağım",
                "dsmMatch": "DSM-5 Obsesyon Kriteri"
            },
            {
                "clueIndex": 1,
                "text": "tam 5 kez art arda yapmadığında",
                "dsmMatch": "DSM-5 Kompulsiyon Kriteri"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Tepki Önleme ile Maruz Bırakma (ERP)",
            "therapyDetails": "Uyarana maruz kalma ve ardından yıkama kompulsiyonunu yapmama egzersizleri.",
            "pharmacologyNote": "Yüksek doz SSRI grubu antidepresanlar (Fluoksetin) ve Klomipramin altın standarttır."
        },
        "miniQuiz": {
            "question": "OKB tedavisinde kanıt düzeyi en yüksek olan psikoterapi yöntemi hangisidir?",
            "options": [
                "Tepki Önleme ile Maruz Bırakma (ERP)",
                "Hipnoterapi",
                "Psikanalitik Rüya Analizi",
                "Aile Dizimi"
            ],
            "correctIndex": 0,
            "explanation": "ERP (Maruz Bırakma ve Tepkiyi Önleme), OKB'deki altın standart BDT protokolüdür."
        },
        "differentialDiagnosis": "• OKKB: Egodistonik değildir; kişilik yapısıdır.\n• BDD: Sadece dış görünüşe odaklıdır.",
        "dsmCriteriaSummary": "DSM-5: Obsesyonlar ve/veya Kompulsiyonlar + Günde > 1 saat zaman alma.",
        "therapyId": "erp",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Annesine mikrop bulaştırıp ölümüne yol açacağı düşüncesi istenmeyen, zihne zorla giren ve kaygı yaratan bir bulaşma obsesyonudur.",
                "Günde 40 kez ve tam beş tekrar kuralıyla el yıkama, kaygıyı azaltmaya yönelik katı kurallı bir kompulsiyondur.",
                "Günde 4-5 saat kaybı ve ellerde kimyasal yanıklar, bir saati aşan zaman kaybı ve işlev bozukluğu ölçütünü karşılar; içgörü korunmuştur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "ocpd",
                    "reason": "Düşünceler kişiye yabancı ve sıkıntı vericidir (egodistonik); OKKB'deki benimsenmiş düzen ve kontrol tarzından farklı olarak belirgin obsesyon-kompulsiyon döngüsü vardır."
                },
                {
                    "diagnosisId": "illness_anxiety_disorder",
                    "reason": "Korku kendisinin hasta olduğu inancı değil, başkasına bulaştırma düşüncesidir ve ritüelle nötralize edilir."
                },
                {
                    "diagnosisId": "gad",
                    "reason": "Kaygı birçok alana yayılmış bir kuruntu değil, tek bir tema etrafında dönen ve kalıplaşmış eylemle yatıştırılan bir obsesyondur."
                }
            ],
            "teachingPoint": "OKB'yi diğer kaygı tablolarından ayıran şey, kaygıyı yatıştırmak için yapılan kurallı ve tekrarlayıcı davranışların (kompulsiyonların) varlığıdır."
        }
    },
    {
        "id": "case-014",
        "caseNumber": 14,
        "difficulty": "Kolay",
        "course": "ADULT",
        "diagnosisId": "bulimia_nervosa",
        "category": "EATING",
        "patientSummary": "20 yaşında, kadın, üniversite öğrencisi (BKİ: 21.5 kg/m² - Normal Kilo)",
        "clues": [
            "Danışan son 6 aydır haftada 3-4 kez kendini durduramayarak kısa sürede devasa porsiyonlarda pizza, pasta ve çikolatayı tıkınırcasına yediğini (binge eating); ardından kilo almaktan dehşetle korktuğu için tuvalete gidip parmağıyla kendini kusturduğunu anlatıyor.",
            "Kusmanın yanı sıra ertesi gün kilo almamak için müshil (laksatif) kullanmakta ve aç kalarak telafi etmeye çalışmaktadır.",
            "Kritik ayırt edici özellik: Hastanın beden kitle indeksi (BKİ) normal sınırlardadır (kilo kaybı zayıflık sınırında değildir).",
            "Kan tahlillerinde kusmaya bağlı hipokalemi (düşük potasyum) ve diş minesinde erozyonlar saptanmıştır.",
            "Ruhsal Durum Muayenesinde: Kendilik değerini tamamen beden ağırlığı ve vücut biçimine bağlama, yeme nöbetleri sonrası yoğun suçluluk ve utanç.",
            "DSM-5'e göre: Yineleyen tıkınırcasına yeme nöbetleri, kilo almaktan kaçınmak için yineleyen uygunsuz ödünleyici davranışlar (kusma vb.) ve bu davranışların en az 3 ay boyunca haftada en az bir kez olması tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "tıkınırcasına yediğini",
                "dsmMatch": "DSM-5: Tıkınma ve uygunsuz ödünleyici davranış"
            },
            {
                "clueIndex": 2,
                "text": "beden kitle indeksi (BKİ) normal sınırlardadır",
                "dsmMatch": "Anoreksiya'dan ayıran normal kilo kriteri"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi (CBT-E)",
            "therapyDetails": "Düzenli öğün planı oluşturma, beden tartılmasını sınırlandırma ve kusma döngüsünü kırma.",
            "pharmacologyNote": "Yüksek doz Fluoksetin (60 mg/gün) FDA onaylı tek SSRI'dır."
        },
        "miniQuiz": {
            "question": "Bulimiya Nervoza ile Anoreksiya Nervoza arasındaki en belirleyici tanısal fark nedir?",
            "options": [
                "Anoreksiyada kişinin kilosu belirgin derecede düşüktür (BKİ < 18.5); Bulimiyada ise hasta normal kilo aralığındadır.",
                "Bulimiyada hastalar hiç kusmaz.",
                "Anoreksiyada kilo alma korkusu yoktur.",
                "İki tanı aynıdır."
            ],
            "correctIndex": 0,
            "explanation": "Anoreksiya Nervoza'da belirgin düşük kilo şarttır. Bulimikler ise normal kilo sınırındadır."
        },
        "differentialDiagnosis": "• Anoreksiya: Belirgin düşük kilo vardır.\n• BED: Telafi edici kusma/laksatif yoktur.",
        "dsmCriteriaSummary": "DSM-5: Tıkınma nöbetleri + Uygunsuz telafi edici davranışlar (kusma vb.) + En az 3 ay haftada ≥ 1.",
        "therapyId": "cbt_e",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Kısa sürede kontrolsüzce büyük miktarda yeme nöbetleri haftada 3-4 kez, altı aydır tekrarlamaktadır.",
                "Kendini kusturma, laksatif kullanımı ve açlıkla telafi, kilo almayı önlemeye yönelik uygunsuz ödünleyici davranışlardır.",
                "Kendilik değerinin kilo ve beden biçimine bağlı olması ve BKİ'nin normal (21,5) olması tabloyu bulimiyaya yerleştirir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "binge_eating",
                    "reason": "Tıkınırcasına yeme bozukluğunda düzenli telafi davranışı yoktur; burada kusma ve laksatif kullanımı vardır."
                },
                {
                    "diagnosisId": "anorexia_nervosa",
                    "reason": "Tıkınma ve çıkarma ortak olsa da BKİ normaldir; anoreksiya belirgin düşük vücut ağırlığı gerektirir."
                },
                {
                    "diagnosisId": "mdd",
                    "reason": "Nöbet sonrası suçluluk ve utanç vardır, ancak süreğen çökkünlük ve diğer depresif belirtiler tarif edilmiyor; yeme döngüsü tablonun merkezidir."
                }
            ],
            "teachingPoint": "Tıkınma ve çıkarma görülen bir hastada önce kiloya bak: belirgin düşük kilo varsa anoreksiya (tıkınma/çıkarma tipi), yoksa bulimiya düşünülür."
        }
    },
    {
        "id": "case-015",
        "caseNumber": 15,
        "difficulty": "Kolay",
        "course": "CHILD",
        "diagnosisId": "adhd",
        "category": "NEURODEV",
        "patientSummary": "10 yaşında, erkek, 4. sınıf öğrencisi",
        "clues": [
            "Danışan, sınıfta ders sırasında yerinde oturamayıp sürekli sıraların üzerinde gezindiği, öğretmeninin sözünü kestiği, sınav sorularının yönergelerini okumadan aceleyle yanlış işaretlediği için okul rehberliği tarafından sevk ediliyor.",
            "Ödevlerini bitirmekte büyük güçlük çekmekte, kalem ve silgilerini sürekli kaybetmekte ve doğrudan kendisiyle konuşulduğunda bile dinlemiyormuş gibi görünmektedir.",
            "Bu belirtilerin hem evde hem okulda (birden fazla ortamda) 7 yaşından beri süregeldiği ve akademik başarısını ciddi şekilde düşürdüğü bildiriliyor.",
            "İşitme ve görme testleri ile nörolojik muayene tamamen normaldir.",
            "Ruhsal Durum Muayenesinde: Dikkat süresinde belirgin kısalık, motor huzursuzluk ve dürtüsellik.",
            "DSM-5'e göre: Gelişimsel düzeye uygun olmayan ve en az 6 aydır süren dikkatsizlik ve/veya hiperaktivite-dürtüsellik belirtilerinin 12 yaşından önce başlamış olması ve en az 2 farklı ortamda görülmesi tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "yerinde oturamayıp",
                "dsmMatch": "DSM-5 Hiperaktivite/Dürtüsellik Kriteri"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Davranışsal Ebeveyn & Öğretmen Eğitimi + Çocuk BDT",
            "therapyDetails": "Çalışma ortamını yapılandırma, ödül sistemleri ve dikkat organizasyon becerileri.",
            "pharmacologyNote": "Metilfenidat (stimülan) ve Atomoksetin birinci basamaktır."
        },
        "miniQuiz": {
            "question": "DSM-5'e göre DEHB belirtilerinin en geç hangi yaştan önce başlamış olması şarttır?",
            "options": [
                "12 yaşından önce",
                "18 yaşından önce",
                "3 yaşından önce",
                "6 yaşından önce"
            ],
            "correctIndex": 0,
            "explanation": "DSM-5 revizyonunda DEHB başlangıç yaşı 12 yaş öncesi olarak belirlenmiştir."
        },
        "differentialDiagnosis": "• Disleksi: Spesifik okuma defisiti vardır.\n• KOKGB: Kasıtlı meydan okuma ön plandadır.",
        "dsmCriteriaSummary": "DSM-5: En az 6 ay süren dikkatsizlik ve/veya hiperaktivite + 12 yaşından önce başlama + En az 2 ortamda görülme.",
        "therapyId": "pmt",
        "pharmacologyId": "methylphenidate_stimulant",
        "explanation": {
            "whyThis": [
                "Yerinde oturamama, söz kesme ve yönergeyi okumadan aceleyle yanıtlama hiperaktivite-dürtüsellik belirtileridir.",
                "Ödevi bitirememe, eşyaları kaybetme ve konuşulunca dinlemiyor görünme dikkatsizlik belirtileridir; iki küme birlikte bileşik görünüme işaret eder.",
                "Belirtiler 7 yaşından beri, 12 yaşından önce başlamış, ev ve okulda görülmekte ve akademik işlevi bozmaktadır; işitme ve görme normaldir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "odd",
                    "reason": "Kurallara uymama kasıtlı bir karşı gelme ya da öfkeli tutumdan değil, dikkat ve dürtü denetimi güçlüğünden kaynaklanır."
                },
                {
                    "diagnosisId": "specific_learning_disorder",
                    "reason": "Akademik düşüş tek bir beceri alanıyla sınırlı değil, dikkat ve davranış sorunlarına bağlı yaygın bir tablo; yine de okuma becerisi ayrıca değerlendirilmelidir."
                },
                {
                    "diagnosisId": "conduct_disorder",
                    "reason": "Söz kesme ve kural dışı davranışlar dürtüsellikten kaynaklanıyor; saldırganlık, hırsızlık ya da mala zarar verme gibi temel hak ihlalleri tarif edilmiyor."
                }
            ],
            "teachingPoint": "DEHB tanısında belirti listesinden çok bağlam önemlidir: 12 yaştan önce başlangıç ve en az iki ortamda görülme koşulu aranır."
        }
    },
    {
        "id": "case-016",
        "caseNumber": 16,
        "difficulty": "Orta",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "illness_anxiety_disorder",
        "category": "SOMATIC",
        "patientSummary": "36 yaşında, erkek, avukat",
        "clues": [
            "Danışan son 8 aydır beyninde ölümcül bir tümör olduğuna dair yoğun bir endişe yaşamakta; vücudunda belirgin hiçbir ağrı veya felç belirtisi OLMAMASINA rağmen her gün internette beyin tümörü semptomlarını araştırmaktadır (siberkondri).",
            "3 farklı hastanede 4 kez Kranial MRG, 2 kez BT çektirmiş ve tüm sonuçların tertemiz çıkmasına rağmen hekimlerin 'tümörü gözden kaçırdığına' inanarak yeni bir nöroloğa randevu almıştır.",
            "Günde onlarca kez kollarını havaya kaldırarak dengesini ve göz bebeklerini aynada kontrol etmektedir.",
            "Tüm nörolojik ve radyolojik testler tamamen normaldir.",
            "Ruhsal Durum Muayenesinde: Hastalık kapma/olma korkusuyla aşırı zihinsel uğraş, güvence arama kompulsiyonları ve hipokondriyak kaygı.",
            "DSM-5'e göre: Ağır bir hastalığı olduğunu ya da olacağını düşünme üzerine aşırı kafa yorma; bedensel belirtilerin bulunmaması ya da çok hafif olması tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "belirgin hiçbir ağrı veya felç belirtisi OLMAMASINA rağmen",
                "dsmMatch": "DSM-5: Bedensel belirtilerin olmaması/hafif olması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi (Sağlık Anksiyetesi)",
            "therapyDetails": "Doktor alışverişini ve güvence aramayı durdurma, belirsizliğe tahammül.",
            "pharmacologyNote": "SSRI grubu antidepresanlar etkilidir."
        },
        "miniQuiz": {
            "question": "Hastalık Kaygısı Bozukluğu ile Somatizasyon arasındaki fark nedir?",
            "options": [
                "Somatizasyonda hasta gerçekten şiddetli ağrı/fiziksel belirti yaşar; Hastalık Kaygısında ise belirgin bedensel semptom yoktur, sadece 'hasta olma düşüncesi' vardır.",
                "Hastalık kaygısı sadece yaşlılarda görülür.",
                "Somatizasyonda hasta doktora gitmez.",
                "İki hastalık aynıdır."
            ],
            "correctIndex": 0,
            "explanation": "Hastalık kaygısında odak düşüncedir (bedensel belirti yoktur/hafiftir); Somatizasyonda ise rahatsız edici ağrılar ön plandadır."
        },
        "differentialDiagnosis": "• Bedensel Belirti Bozukluğu: Somatik ağrılar vardır.\n• OKB: Takıntılar sağlıkla sınırlı değildir.",
        "dsmCriteriaSummary": "DSM-5: Ağır hastalık düşüncesiyle uğraş + Bedensel belirti olmaması/hafif olması + Aşırı sağlık davranışı. Süre ≥ 6 ay.",
        "therapyId": "cbt_general",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Belirgin bir bedensel belirti olmadan sekiz aydır ölümcül beyin tümörü olduğu düşüncesiyle uğraşmak hastalık kaygısının çekirdeğidir.",
                "Tekrarlanan MRG ve BT'lerin normal sonuçlarına rağmen güvencenin kalıcı olmaması ve yeni hekim araması aşırı sağlık davranışlarını gösterir.",
                "Aynada denge ve göz bebeklerini kontrol etme, internette belirti araştırma gibi tekrarlayıcı kontrol davranışları tabloyu destekler; süre altı ayı aşmıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "somatic_symptom_disorder",
                    "reason": "Rahatsız edici bedensel belirti yoktur; kaygı belirtinin kendisine değil, hasta olma ihtimaline yöneliktir."
                },
                {
                    "diagnosisId": "ocd",
                    "reason": "Kontrol davranışları yalnızca hastalık teması etrafında döner ve kaygı sağlıkla sınırlıdır; farklı temalarda obsesyonlar tarif edilmiyor."
                },
                {
                    "diagnosisId": "delusional_disorder",
                    "reason": "Kişi güvence arayışı içindedir ve inanç sanrısal bir kesinlikte değil kaygı düzeyindedir; tam kesinlik ve sarsılmazlık olsaydı somatik tip sanrı düşünülmeliydi."
                }
            ],
            "teachingPoint": "Bedensel belirti bozukluğunda belirgin belirti ve ona aşırı tepki vardır; hastalık kaygısında belirti yoktur ya da çok hafiftir, asıl sorun hasta olma korkusudur."
        }
    },
    {
        "id": "case-017",
        "caseNumber": 17,
        "difficulty": "Zor",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "did",
        "category": "DISSOCIATIVE",
        "patientSummary": "28 yaşında, kadın, ressam",
        "clues": [
            "Danışan, evinde daha önce hiç görmediği kıyafetler bulduğunu, gardırobunda tanımadığı bir el yazısıyla yazılmış tehditkar notlar olduğunu ve gün içinde saatlerce süren 'zaman kayıpları' (blackout) yaşadığını anlatıyor.",
            "Terapistle görüşürken ses tonu, mimikleri ve oturuşu aniden değişerek kendini 7 yaşında 'Cemre' adında küçük bir kız çocuğu olarak tanıtmış, 10 dakika sonra ise sert ve erkeksi bir ses tonuyla 'Kaan' adında koruyucu bir kimliğe bürünmüştür.",
            "Çocukluk öyküsünde 4-10 yaşları arasında ağır, kronik ve tekrarlayan fiziksel ve cinsel istismar geçmişi doğrulanmıştır.",
            "EEG ve kranial MRG temizdir; temporal lob epilepsisi ve madde kullanımı dışlanmıştır.",
            "Ruhsal Durum Muayenesinde: İki ya da daha fazla ayrı kişilik durumu (alter kimlikler), kimlikler arası amnezi ve dissosiyatif füg epizotları.",
            "DSM-5'e göre: İki ya da daha fazla ayrı kişilik durumuyla belirlenen kimlik bölünmesi ve önemli kişisel bilgileri anımsamada yineleyen boşluklar mevcuttur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "kendini 7 yaşında 'Cemre'",
                "dsmMatch": "DSM-5: İki veya daha fazla ayrı kişilik durumu"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Faz Odaklı Travma Terapisi (Klüft Modeli)",
            "therapyDetails": "1. Güvenlik, 2. Travma işleme, 3. Alter kimliklerin entegrasyonu (bütünleşme).",
            "pharmacologyNote": "Eşlik eden TSSB ve depresyon için SSRI kullanılır."
        },
        "miniQuiz": {
            "question": "Dissosiyatif Kimlik Bozukluğunun etiyolojisinde en sık rol oynayan faktör nedir?",
            "options": [
                "Erken çocukluk döneminde yaşanan ağır, süreğen fiziksel/cinsel istismar",
                "Sadece kromozom anomalisi",
                "Yetişkinlikte iş kaybı",
                "Vitamin eksikliği"
            ],
            "correctIndex": 0,
            "explanation": "DKB, ağır ve kaçılamaz travmalara karşı zihnin bölündüğü aşırı bir savunma mekanizmasıdır."
        },
        "differentialDiagnosis": "• Şizofreni: Şizofrenide sanrı/varsanı vardır; burada alter kimlikler vardır.\n• BPD: Alter kimlikler görülmez.",
        "dsmCriteriaSummary": "DSM-5: İki veya daha fazla ayrı kişilik durumu + Kişisel bilgileri hatırlamada amnezi boşlukları.",
        "therapyId": "phase_trauma_did",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Seans içinde ses, mimik ve tavrı değişerek ‘Cemre’ ve ‘Kaan’ olarak ortaya çıkan ayrı kişilik durumları kimlik bölünmesini doğrudan gösterir.",
                "Tanımadığı kıyafetler, kendisine ait olmayan notlar ve saatlerce süren zaman kayıpları gündelik olaylar için yineleyen bellek boşluklarıdır.",
                "Erken ve tekrarlayan çocukluk istismarı öyküsü tipiktir; epilepsi ve madde kullanımı dışlanmıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "schizophrenia",
                    "reason": "Sanrı, dezorganizasyon ya da negatif belirti tarif edilmiyor; ‘başka bir kişi’ deneyimi psikotik bir inanç değil, kimlik durumları arasında geçiştir."
                },
                {
                    "diagnosisId": "borderline_pd",
                    "reason": "Kimlik karmaşası kişilik içi bir dengesizliktir; ayrı adları ve davranış tarzları olan kimlikler ile aralarındaki amnezi borderline ile açıklanmaz."
                },
                {
                    "diagnosisId": "dissociative_amnesia",
                    "reason": "Bellek boşlukları var ama tablo bununla sınırlı değil; belirgin alter kimlikler ortaya çıktığında DKB tanısı önceliklidir."
                }
            ],
            "teachingPoint": "Dissosiyatif kimlik bozukluğunun iki ayağı vardır: gözlenen ya da bildirilen kimlik bölünmesi ve gündelik olaylar için yineleyen amnezi."
        }
    },
    {
        "id": "case-018",
        "caseNumber": 18,
        "difficulty": "Kolay",
        "course": "ADULT",
        "diagnosisId": "anorexia_nervosa",
        "category": "EATING",
        "patientSummary": "17 yaşında, kadın, lise öğrencisi (BKİ: 14.8 kg/m² - Ağır Düşük Kilo)",
        "clues": [
            "Danışan 1.68 boyunda ve 42 kilo olmasına rağmen aynaya baktığında 'kendisini aşırı şişman, göbeğini devasa ve bacaklarını kalın' gördüğünü söyleyerek daha fazla zayıflamak için günde sadece yarım elma ve su ile beslenmektedir.",
            "Son 8 ayda 20 kilo vermiş, kilo almaktan ve yağlanmaktan ölesiye korktuğunu ifade etmektedir.",
            "Aşırı kilo kaybına bağlı olarak 5 aydır adet görememekte (amenore), vücudunda ince tüylenmeler (lanugo) başlamış ve nabzı 48 bpm'ye (bradikardi) düşmüştür.",
            "Tıbbi değerlendirmede ağır malnütrisyon, hipotermi ve elektrolit dengesizliği nedeniyle acil servise sevk edilmiştir.",
            "Ruhsal Durum Muayenesinde: Beden imgesinde ağır çarpıtma, düşük kilonun getirdiği hayati tehlikeyi inkar etme ve katı yeme kısıtlamaları.",
            "DSM-5'e göre: Gereksinimlere göre enerji alımını kısıtlama sonucu belirgin derecede düşük bir vücut ağırlığına sahip olma; kilo almaktan aşırı korkma ve beden ağırlığını algılamada bozukluk mevcuttur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "42 kilo olmasına rağmen",
                "dsmMatch": "DSM-5: Beden ağırlığını algılamada bozukluk"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Aile Temelli Terapi (FBT / Maudsley) & BDT",
            "therapyDetails": "Önce kilo kazanımı ve medikal stabilizasyon; ardından yeme korkularını çalışma.",
            "pharmacologyNote": "Düşük doz Olanzapin kilo alımına ve dirençli anksiyeteyi azaltmaya yardımcı olabilir."
        },
        "miniQuiz": {
            "question": "Anoreksiya Nervoza'da hastanın vücudunda ortaya çıkan ince tüylenmeye ne ad verilir?",
            "options": [
                "Lanugo tüyleri",
                "Alopesi",
                "Eritem",
                "Koprolali"
            ],
            "correctIndex": 0,
            "explanation": "Ağır kilo kaybında vücut ısı dengesini korumak için 'lanugo' adı verilen ince tüyler geliştirir."
        },
        "differentialDiagnosis": "• Bulimiya: Kilo normaldir; Anoreksiyada belirgin düşük kilo şarttır.\n• Depresyon: Beden imge bozukluğu yoktur.",
        "dsmCriteriaSummary": "DSM-5: Enerji kısıtlaması ile belirgin düşük kilo (BKİ < 18.5) + Kilo almaktan aşırı korkma + Beden imgesi bozukluğu.",
        "therapyId": "fbt_maudsley",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Yarım elma ve suyla beslenerek enerji alımını kısıtlama ve BKİ 14,8 düzeyinde belirgin düşük vücut ağırlığı temel ölçüttür.",
                "Bu kiloda bile kilo almaktan aşırı korkma ve kendini şişman görme, korku ve beden algısı bozukluğu ölçütlerini karşılar.",
                "Amenore, lanugo, bradikardi ve hipotermi açlığın bedensel sonuçlarıdır; ağır düşük kiloya ve tıbbi riske işaret eder."
            ],
            "whyNot": [
                {
                    "diagnosisId": "bulimia_nervosa",
                    "reason": "Belirgin düşük kilo vardır ve tıkınma-kusma döngüsü tarif edilmiyor; bu iki özellik anoreksiyayı gösterir."
                },
                {
                    "diagnosisId": "arfid",
                    "reason": "ARFID'de kısıtlama duyusal özellikler ya da yeme korkusundan kaynaklanır; burada kilo korkusu ve beden algısı bozukluğu vardır."
                },
                {
                    "diagnosisId": "mdd",
                    "reason": "İştah ve kilo kaybı depresyonda görülebilir, ancak kilo almaktan korkma ve beden imgesi çarpıtması depresyonla açıklanmaz."
                }
            ],
            "teachingPoint": "Kilo kaybının nedenini sor: kilo alma korkusu ve beden algısı bozukluğu anoreksiyayı, bunlar olmadan kısıtlama ARFID ya da başka bir nedeni düşündürür."
        }
    },
    {
        "id": "case-019",
        "caseNumber": 19,
        "difficulty": "Kolay",
        "course": "ADULT",
        "diagnosisId": "specific_phobia",
        "category": "ANXIETY",
        "patientSummary": "27 yaşında, erkek, inşaat mühendisi",
        "clues": [
            "Danışan çocukluğundan beri köpek gördüğünde (en ufak bir süs köpeği dahil) kalbinin yerinden çıkacak gibi çarptığını, nefesinin kesildiğini ve dehşet içinde ağaçlara tırmandığını veya yola atladığını anlatıyor.",
            "Bu korku yüzünden sokakta yürüyememekte, arkadaşlarının evine gitmeden önce evde köpek olup olmadığını sorgulamakta ve parklardan tamamen kaçınmaktadır.",
            "Köpek dışındaki hiçbir nesne, ortam veya sosyal durumdan korkmamaktadır.",
            "Tıbbi değerlendirmeler tamamen temizdir.",
            "Ruhsal Durum Muayenesinde: Tek bir özgül uyarana karşı orantısız, aşırı ve akıldışı korku ve kaçınma reaksiyonu.",
            "DSM-5'e göre: Özgül bir nesne ya da durumla (hayvan, yükseklik vb.) ilgili olarak belirgin bir korku ya da kaygı duyma (en az 6 ay) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "köpek gördüğünde",
                "dsmMatch": "DSM-5 Özgül Fobi Kriteri (Hayvan Tipi)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Kademeli Canlı Maruz Bırakma (In-Vivo Exposure)",
            "therapyDetails": "Köpek fotoğrafları, videoları ve canlı temas hiyerarşisiyle duyarsızlaştırma.",
            "pharmacologyNote": "Genellikle ilaç tedavisi gerekmez."
        },
        "miniQuiz": {
            "question": "Özgül Fobilerin tedavisinde başarı oranı en yüksek yöntem hangisidir?",
            "options": [
                "Kademeli Canlı Maruz Bırakma (In-Vivo Exposure)",
                "Diyalektik Davranış Terapisi",
                "Serbest Çağrışım",
                "Elektroşok Tedavisi"
            ],
            "correctIndex": 0,
            "explanation": "Özgül fobilerde kademeli maruz bırakma en hızlı iyileşmeyi sağlayan altın standart yöntemdir."
        },
        "differentialDiagnosis": "• Agorafobi: En az iki farklı alanda kaçamama korkusudur.\n• Panik Bozukluk: Spontane ataklar vardır.",
        "dsmCriteriaSummary": "DSM-5: Özgül nesneye karşı orantısız korku ve kaçınma. Süre ≥ 6 ay.",
        "therapyId": "invivo_exposure",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Korku tek bir nesneye, köpeklere yöneliktir ve en küçük bir köpekte bile ortaya çıkması orantısız olduğunu gösterir.",
                "Sokakta yürüyememe, parklardan kaçınma ve ziyaret öncesi köpek olup olmadığını sorma belirgin kaçınma ve işlev bozukluğudur.",
                "Korku çocukluktan beri, yani altı aydan uzun süredir vardır ve başka durumlara yayılmamıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "panic_disorder",
                    "reason": "Ataklar yalnızca köpekle karşılaşınca ortaya çıkıyor; beklenmedik, tetikleyicisiz atak tarif edilmiyor."
                },
                {
                    "diagnosisId": "agoraphobia",
                    "reason": "Kaçınılan şey kaçışın zor olduğu yerler değil, köpek bulunabilecek yerlerdir; korkunun nesnesi tektir."
                },
                {
                    "diagnosisId": "ptsd",
                    "reason": "Bir köpek saldırısı gibi travmatik olay ve yeniden yaşantılama belirtileri bildirilmiyor; korku travmaya bağlı olsaydı TSSB değerlendirilmeliydi."
                }
            ],
            "teachingPoint": "Özgül fobide korku tek bir nesne ya da duruma bağlıdır; aynı panik belirtileri her yerde ve nedensiz geliyorsa panik bozukluk düşünülür."
        }
    },
    {
        "id": "case-020",
        "caseNumber": 20,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "avoidant_pd",
        "category": "PERSONALITY_C",
        "patientSummary": "32 yaşında, kadın, kütüphane görevlisi",
        "clues": [
            "Danışan, tüm hayatı boyunca insanlarla derin bağlar kurmayı ve arkadaş edinmeyi çok arzuladığını ancak 'yetersiz, çirkin ve sıkıcı' olduğuna inandığı için reddedilme ve alay edilme korkusuyla insanlardan tamamen uzak durduğunu anlatıyor.",
            "İş yerinde terfi teklif edildiğinde yeni insanlarla tanışması gerekeceği korkusuyla teklifi reddetmiş, yalnız çalışabileceği kütüphane arşivine geçmiştir.",
            "Kendisini eleştirilmekten korumak için sevilip kabul edileceğinden kesin emin olmadıkça kimseyle ilişki başlatamamaktadır.",
            "Genel biyokimyasal testler ve nörolojik muayene olağandır.",
            "Ruhsal Durum Muayenesinde: Yaygın toplumsal çekingenlik, yetersizlik duyguları ve olumsuz değerlendirilmeye karşı aşırı duyarlılık örüntüsü.",
            "DSM-5'e göre: Erken erişkinlikte başlayan toplumsal ketlenme, yetersizlik duyguları ve olumsuz değerlendirilmeye aşırı duyarlılık örüntüsüdür."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "arkadaş edinmeyi çok arzuladığını ancak",
                "dsmMatch": "DSM-5: Yakınlık arzulamasına rağmen reddedilme korkusuyla kaçınma"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi & Şema Terapi",
            "therapyDetails": "'Kusurluluk' ve 'Sosyal İzolasyon' şemalarını esnetme, sosyal beceri geliştirme.",
            "pharmacologyNote": "Yoğun sosyal anksiyete için SSRI eklenebilir."
        },
        "miniQuiz": {
            "question": "Kaçıngan Kişilik ile Şizoid Kişilik arasındaki temel fark nedir?",
            "options": [
                "Kaçıngan kişi ilişkiyi çok ister ama reddedilmekten korkar; Şizoid ise ilişki kurmayı hiç istemez.",
                "Şizoid hastalar sürekli ağlar.",
                "Kaçıngan hastalar insanlara saldırır.",
                "İki hastalık aynıdır."
            ],
            "correctIndex": 0,
            "explanation": "Şizoid yalnızlığı tercih eder ve ilişki istemez. Kaçıngan ise yakınlık ister ama reddedilme korkusuyla kaçınır."
        },
        "differentialDiagnosis": "• Şizoid KB: İlişki arzusu yoktur.\n• Sosyal Anksiyete: Kaçıngan KB daha yaygın ve derin bir kişilik yapısıdır.",
        "dsmCriteriaSummary": "DSM-5: Eleştirilme korkusuyla kaçınma, sevileceğinden emin olmadıkça ilişkiye girmeme, yetersizlik duygusu (en az 4/7).",
        "therapyId": "schema_therapy",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Yakın ilişki kurmayı istemesine rağmen yetersiz ve çekici olmadığı inancıyla insanlardan uzak durması toplumsal ketlenme ve yetersizlik duygusunu gösterir.",
                "Yeni insanlarla tanışmamak için terfiyi reddetmesi, kişilerarası temas gerektiren işlerden kaçınma ölçütüne uyar.",
                "Sevileceğinden emin olmadıkça ilişki başlatmaması ve eleştiriye aşırı duyarlılık yaşam boyu süren yaygın bir örüntüdür."
            ],
            "whyNot": [
                {
                    "diagnosisId": "schizoid_pd",
                    "reason": "Kişi yakınlık ve arkadaşlık istemektedir; şizoid kişilikte ilişkiye ilgi yoktur ve yalnızlık acı vermez."
                },
                {
                    "diagnosisId": "social_anxiety",
                    "reason": "Kaçınma belirli performans durumlarıyla sınırlı değil, temel bir yetersizlik benlik algısına dayanan yaygın bir kişilik örüntüsüdür; iki tanı sık birlikte görülebilir."
                },
                {
                    "diagnosisId": "dependent_pd",
                    "reason": "Kaygının odağı bakılma ihtiyacı ya da ayrılık değil, reddedilme ve alay edilmektir."
                }
            ],
            "teachingPoint": "Çekingen ile şizoid kişiliği ayırmak için ilişki arzusunu sor: çekingen kişi ister ama korkar, şizoid kişi istemez."
        }
    },
    {
        "id": "case-021",
        "caseNumber": 21,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "delusional_disorder",
        "category": "PSYCHOTIC",
        "patientSummary": "52 yaşında, kadın, emekli memur",
        "clues": [
            "Danışan son 1.5 yıldır üst komşusunun gece uyurken havalandırma boşluğundan evine kokusuz bir zehirli gaz sıktığını ve kendisini yavaş yavaş zehirlemeye çalıştığını iddia ederek polis ve savcılığa onlarca dilekçe vermiştir.",
            "Önemli klinik özellik: Bu sabit perseküsyon inancı dışında hastanın giyimi, konuşması, mantıksal muhakemesi, genel hijyeni ve günlük işlevselliği TAMAMEN KORUNMUŞTUR; Şizofrenideki gibi dezorganizasyon veya halüsinasyonlar yoktur.",
            "Evinin duvarlarına yalıtım süngerleri kaplatmış, gaz maskeleri satın almış ancak bunun dışındaki sosyal yaşamında gayet kibar ve düzenli bir profil çizmektedir.",
            "Beyin MRG ve toksikoloji testleri temizdir.",
            "Ruhsal Durum Muayenesinde: Mantıksal olarak kurgulanmış, sarsılmaz, kapsüllenmiş persekütuar sanrı. Negatif belirti veya düşünce dağınıklığı yoktur.",
            "DSM-5'e göre: En az 1 ay süren bir (ya da daha çok) sanrının varlığı ve Şizofreninin A ölçütünün hiçbir zaman karşılanmamış olması tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "günlük işlevselliği TAMAMEN KORUNMUŞTUR",
                "dsmMatch": "DSM-5: Sanrı dışındaki alanlarda işlevselliğin korunması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Destekleyici Psikoterapi & CBTp",
            "therapyDetails": "Sanrıyla doğrudan tartışmadan güven bağı kurma, hezeyanın yol açtığı stresi hafifletme.",
            "pharmacologyNote": "İkinci kuşak antipsikotikler (Aripiprazol, Risperidon) tercih edilir."
        },
        "miniQuiz": {
            "question": "Sanrılı Bozukluk ile Şizofreni arasındaki en temel ayırt edici özellik nedir?",
            "options": [
                "Sanrılı Bozuklukta sanrı dışında işlevsellik ve kişilik korunmuştur; belirgin halüsinasyon veya dezorganizasyon görülmez.",
                "Sanrılı bozukluk sadece 2 gün sürer.",
                "Şizofrenide sanrı görülmez.",
                "Sanrılı bozukluk hastaları konuşamaz."
            ],
            "correctIndex": 0,
            "explanation": "Sanrılı bozuklukta sanrı kapsüllenmiştir; kişinin sanrı konusu dışındaki düşünce akışı ve bakımı tamdır."
        },
        "differentialDiagnosis": "• Şizofreni: Varsanılar ve dezorganizasyon vardır.\n• Paranoid KB: Sabit tek bir sanrı yerine genel kuşkuculuk vardır.",
        "dsmCriteriaSummary": "DSM-5: En az 1 ay süren sanrılar + Şizofreni A ölçütünün olmaması + İşlevselliğin korunması.",
        "therapyId": "cbtp",
        "pharmacologyId": "pimozide_delusional",
        "explanation": {
            "whyThis": [
                "Komşunun havalandırmadan zehirli gaz sıktığı inancı bir buçuk yıldır süren, sarsılmaz bir kötülük görme sanrısıdır (en az bir ay ölçütü karşılanır).",
                "Sanrı dışında konuşma, hijyen, muhakeme ve günlük işlevsellik korunmuştur; davranışları yalnızca sanrının içeriğiyle ilgilidir.",
                "Varsanı, dezorganizasyon ve negatif belirti yoktur; beyin MRG ve toksikoloji temizdir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "schizophrenia",
                    "reason": "Şizofreni için ikinci bir aktif faz belirtisi (varsanı, dezorganizasyon, negatif belirti) gerekir; burada yalnızca sanrı vardır ve işlevsellik korunmuştur."
                },
                {
                    "diagnosisId": "paranoid_pd",
                    "reason": "Paranoid kişilikte yaygın bir kuşkuculuk vardır ama sanrı düzeyinde sabit bir inanç yoktur; burada belirli ve sarsılmaz bir sanrı vardır."
                },
                {
                    "diagnosisId": "major_neurocognitive_alzheimer",
                    "reason": "52 yaşında yeni başlayan sanrıda bilişsel yıkım akla gelir, ancak bellek ve muhakeme korunmuştur ve görüntüleme normaldir."
                }
            ],
            "teachingPoint": "Sanrılı bozukluğu şizofreniden ayıran, sanrının ‘kapsüllenmiş’ olmasıdır: sanrı dışında düşünce, davranış ve işlevsellik büyük ölçüde korunur."
        }
    },
    {
        "id": "case-022",
        "caseNumber": 22,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "schizoid_pd",
        "category": "PERSONALITY_A",
        "patientSummary": "41 yaşında, erkek, gece bekçisi",
        "clues": [
            "Danışan tüm hayatı boyunca tek bir yakın arkadaş edinmediğini, ailesiyle bile görüşmek istemediğini ve gece tek başına kimsenin olmadığı bir depoda bekçilik yapmaktan büyük bir huzur duyduğunu anlatıyor.",
            "Ne başkalarının övgülerinden ne de eleştirilerinden en ufak bir şekilde etkilenmemekte, yalnız olmaktan derin bir doyum aldığını ve cinsellikle veya romantik ilişkilerle hiçbir ilgisinin olmadığını belirtiyor.",
            "Konuşurken yüz ifadesi tamamen donuk, duygulanımı düzdür; ancak şizotipaldeki gibi tuhaf büyüsel düşünceleri veya hezeyanları KESİNLİKLE yoktur.",
            "Tıbbi ve nörolojik incelemeler olağandır.",
            "Ruhsal Durum Muayenesinde: Sosyal ilişkilerden tamamen kopma, kısıtlı duygusal dışavurum, anhedoni ve yalnızlığı aktif tercih etme.",
            "DSM-5'e göre: Erken erişkinlikte başlayan, toplumsal ilişkilerden kopma ve kişilerarası ortamlarda duyguların kısıtlı gösterilmesi örüntüsüdür."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "bekçilik yapmaktan büyük bir huzur duyduğunu",
                "dsmMatch": "DSM-5: Yakın ilişki istememe ve tekil etkinlikleri yeğleme"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Destekleyici Terapi",
            "therapyDetails": "Hastayı sosyalleşmeye zorlamadan yaşamını sürdürebileceği asgari iletişim becerilerini koruma.",
            "pharmacologyNote": "Genellikle ilaç tedavisi endike değildir."
        },
        "miniQuiz": {
            "question": "Şizoid Kişilik Bozukluğu olan bir bireyin temel özelliği nedir?",
            "options": [
                "Yalnızlığı içtenlikle tercih eder ve yakın ilişki arzulamaz.",
                "Sürekli parti düzenler.",
                "İnsanlara saldırır.",
                "Büyüsel güçlere inanır."
            ],
            "correctIndex": 0,
            "explanation": "Şizoid birey yalnızlıktan memnundur ve yakın ilişki kurma isteği duymaz."
        },
        "differentialDiagnosis": "• Kaçıngan KB: Yakınlık ister ama korkar.\n• Şizotipal KB: Büyüsel düşünceler vardır.",
        "dsmCriteriaSummary": "DSM-5: Yakın ilişki istememe, tekil etkinlikleri yeğleme, övgü/yergiye aldırmama, duygusal soğukluk (en az 4/7).",
        "therapyId": "psychodynamic",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Aile dahil yakın ilişki istememesi, yalnız etkinlikleri tercih etmesi ve yalnızlıktan doyum alması toplumsal ilişkilerden kopma örüntüsüdür.",
                "Övgü ve eleştiriye kayıtsızlık, cinsellik ve romantik ilişkiye ilgisizlik ile düz duygulanım kısıtlı duygusal ifadeyi gösterir.",
                "Büyüsel düşünce, tuhaf algılar ya da sanrı yoktur; örüntü yaşam boyu süreklidir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "avoidant_pd",
                    "reason": "Kişi yalnızlıktan sıkıntı duymuyor ve ilişki istemiyor; çekingen kişilikteki reddedilme korkusu ve yakınlık özlemi yoktur."
                },
                {
                    "diagnosisId": "schizotypal_pd",
                    "reason": "Büyüsel düşünce, alışılmadık algısal deneyimler ya da tuhaf konuşma yoktur; kopma tek başına öndedir."
                },
                {
                    "diagnosisId": "asd",
                    "reason": "Düz duygulanım ve ilişkisizlik otizmi düşündürebilir, ancak kısıtlı/tekrarlayıcı davranışlar ve erken çocukluk iletişim sorunları tarif edilmiyor; gelişim öyküsü bu ayrım için gereklidir."
                }
            ],
            "teachingPoint": "Şizoid kişilikte sorun beceri ya da korku değil ilgi eksikliğidir: kişi ilişki kurmayı istemez ve yalnızlıktan rahatsız olmaz."
        }
    },
    {
        "id": "case-023",
        "caseNumber": 23,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "dysthymia",
        "category": "MOOD",
        "patientSummary": "35 yaşında, kadın, memur",
        "clues": [
            "Danışan son 4 yıldır kendisini 'sürekli neşesiz, kronik olarak yorgun, özgüvensiz ve hayata karşı karamsar' hissettiğini, 'Ben kendimi bildim bileli böyle mutsuzum' dediğini anlatıyor.",
            "Bu 4 yıllık süre zarfında kendini iyi ve neşeli hissettiği aralıkların hiçbir zaman 2 ayı geçmediği belirtiliyor.",
            "İşine gidip gelmekte ancak hayatı sadece 'otomatik bir yük' gibi sürdürmektedir; ağır bir majör depresyondaki gibi yatalak kalma veya psikotik bir hezeyan tablosu yoktur.",
            "Tiroid ve anemi testleri normal sınırlardadır.",
            "Ruhsal Durum Muayenesinde: Kronik düşük duygudurum (distimi), düşük benlik saygısı ve enerji düşüklüğü.",
            "DSM-5'e göre: En az 2 yıl boyunca günün çoğunda çökkün duygudurum ve en az 2 ek depresif belirti bulunması tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "son 4 yıldır kendisini 'sürekli neşesiz",
                "dsmMatch": "DSM-5: En az 2 yıl boyunca süren çökkün duygudurum"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "CBASP & BDT",
            "therapyDetails": "Kişilerarası problem çözme, durumsal analiz ve davranışsal aktivasyon.",
            "pharmacologyNote": "SSRI grubu antidepresanlar etkilidir."
        },
        "miniQuiz": {
            "question": "Distimi tanısı için belirtilerin erişkinlerde en az kaç yıl sürmesi şarttır?",
            "options": [
                "En az 2 yıl",
                "En az 6 ay",
                "En az 1 ay",
                "En az 5 yıl"
            ],
            "correctIndex": 0,
            "explanation": "Erişkinlerde Distimi tanısı için sürenin en az 2 yıl olması şarttır."
        },
        "differentialDiagnosis": "• Majör Depresyon: Episodiktir ve en az 2 hafta sürer.\n• Uyum Bozukluğu: Stresörle sınırlıdır.",
        "dsmCriteriaSummary": "DSM-5: En az 2 yıl süren çökkün duygudurum + En az 2 belirti + 2 aydan uzun iyilik olmaması.",
        "therapyId": "cbasp",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Dört yıldır günün çoğunda süren neşesizlik, iki yıllık süre ölçütünü açıkça aşar.",
                "Yorgunluk, düşük benlik saygısı ve karamsarlık gereken en az iki ek depresif belirtiyi karşılar.",
                "Bu sürede iyi geçen dönemler hiçbir zaman iki ayı geçmemiş ve tablo süreğen ama işlevi büsbütün yıkmayan bir düzeyde seyretmiştir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "mdd",
                    "reason": "Belirgin, sınırları belli bir epizod tarif edilmiyor; tablo yıllara yayılmış ve daha hafif bir şiddettedir. Bu süreçte majör epizod ölçütleri karşılanırsa ikisi birlikte belirtilebilir."
                },
                {
                    "diagnosisId": "adjustment_disorder",
                    "reason": "Belirli bir stresöre bağlanmıyor ve ‘kendimi bildim bileli’ sürüyor; uyum bozukluğu stresörden sonra başlar ve sınırlı sürer."
                },
                {
                    "diagnosisId": "cyclothymia",
                    "reason": "Arada hipomanik dönemler tarif edilmiyor; yalnızca süreğen düşük duygudurum vardır."
                }
            ],
            "teachingPoint": "Kalıcı depresif bozuklukta anahtar süre ve süreğenliktir: erişkinde en az iki yıl, arada iki aydan uzun iyi dönem olmamalı."
        }
    },
    {
        "id": "case-024",
        "caseNumber": 24,
        "difficulty": "Zor",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "factitious_disorder",
        "category": "SOMATIC",
        "patientSummary": "31 yaşında, kadın, eski hemşire",
        "clues": [
            "Danışan son 2 yılda 18 farklı hastanede 'geçmeyen açıklanamayan yüksek ateş, kanlı idrar ve karın ağrısı' şikayetleriyle yatırılmış ve 3 kez gereksiz yere laparoskopi ameliyatına alınmıştır.",
            "Hemşire odasında gizlice kendi idrarına kan damlattığı ve ateşini yükseltmek için kendine bakteri kültürü enjekte ettiği hastane personeli tarafından fark edilmiştir.",
            "Kritik ayırıcı özellik: Hastanın bu eylemleri yaparken hiçbir 'maddi kazanç, tazminat, nafaka veya cezaevinden kaçma (dışsal ödül)' amacı YOKTUR; tek motivasyonu 'hasta rolü üstlenmek ve hekimlerin ilgisini çekmektir'.",
            "Toksikoloji ve laboratuvar incelemelerinde semptomların yapay olarak üretildiği kanıtlanmıştır.",
            "Ruhsal Durum Muayenesinde: Hasta rolünü benimseme, hastane bağımlılığı ve tıbbi manipülasyon (Münchausen tablosu).",
            "DSM-5'e göre: Belirlenebilir bir dış ödül olmaksızın, fiziksel ya da psikolojik belirti ve bulguları bilerek uydurma ya da yapay olarak ortaya çıkarma tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 2,
                "text": "hiçbir 'maddi kazanç, tazminat",
                "dsmMatch": "DSM-5: Belirgin bir dış ödülün olmaması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Destekleyici Psikoterapi",
            "therapyDetails": "Gereksiz invaziv tıbbi işlemleri durdurma, koordinasyon sağlama.",
            "pharmacologyNote": "Primer farmakoterapisi yoktur."
        },
        "miniQuiz": {
            "question": "Yapay Bozukluk (Münchausen) ile Temarruz arasındaki temel fark nedir?",
            "options": [
                "Temarruzda belirgin dışsal kazanç (para/tazminat) vardır; Yapay Bozuklukta dış kazanç yoktur, amaç 'hasta rolü' almaktır.",
                "Yapay bozukluk sadece çocuklarda görülür.",
                "Temarruzda hasta gerçekten felç kalır.",
                "İki durum aynıdır."
            ],
            "correctIndex": 0,
            "explanation": "Yapay bozuklukta maddi çıkar yoktur (amaç hasta rolüdür). Temarruzda ise maddi kazanç için numara yapılır."
        },
        "differentialDiagnosis": "• Temarruz: Maddi çıkar vardır.\n• Konversiyon: Belirtiler bilinçdışıdır.",
        "dsmCriteriaSummary": "DSM-5: Belirtileri bilerek uydurma + Kendini hasta gösterme + Dış ödül olmaması.",
        "therapyId": "psychodynamic",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "İdrara gizlice kan damlatma ve kendine bakteri enjekte etme, belirtileri bilerek ve yapay olarak üretmenin doğrudan kanıtıdır.",
                "Kişi kendini hasta olarak sunmakta, 18 hastanede yatmış ve gereksiz ameliyatlara girmiştir.",
                "Maddi kazanç ya da sorumluluktan kaçma gibi bir dış ödül yoktur; amaç hasta rolüdür."
            ],
            "whyNot": [
                {
                    "diagnosisId": "conversion_disorder",
                    "reason": "Konversiyonda belirtiler kasıtlı olarak üretilmez; burada aldatma eylemleri personel tarafından doğrudan görülmüştür."
                },
                {
                    "diagnosisId": "somatic_symptom_disorder",
                    "reason": "Bedensel belirti bozukluğunda belirtiler gerçek yaşanır ve kişi onları uydurmaz; burada laboratuvar bulguları yapay olarak oluşturulmuştur."
                },
                {
                    "diagnosisId": "factitious_another",
                    "reason": "Belirtiler başkasına değil kişinin kendisine yüklenmektedir."
                }
            ],
            "teachingPoint": "Belirti uydurmada iki soruyu sor: bilerek mi üretiliyor ve dış bir ödül var mı? Bilerek ve ödülsüz ise yapay bozukluk, dış ödül varsa temaruz söz konusudur."
        }
    },
    {
        "id": "case-025",
        "caseNumber": 25,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "bdd",
        "category": "OCD_RELATED",
        "patientSummary": "24 yaşında, erkek, model adayı",
        "clues": [
            "Danışan burnunun 'eğri, devasa ve ucube gibi' olduğuna inanarak son 3 yılda 4 farklı plastik cerraha burun ameliyatı (rinoplasti) olmuş; ancak hiçbir cerrahi sonucu beğenmeyerek 'Burnum yüzünden insan içine çıkamıyorum' demektedir.",
            "Objektif olarak bakıldığında burnunda başkaları tarafından neredeyse hiç fark edilmeyen milimetrik bir kıkırdak asimetrisi dışında hiçbir belirgin kusur yoktur.",
            "Günde 4 saatten fazla aynada burnunu incelemekte, burnunu kapatmak için sürekli maske ve güneş gözlüğü takmakta ve kameralardan kaçmaktadır.",
            "Genel biyokimyasal değerlendirme normaldir.",
            "Ruhsal Durum Muayenesinde: Beden algısında aşırı zihinsel uğraş, ayna kompulsiyonları ve kusur odaklı içgörü kaybı.",
            "DSM-5'e göre: Dış görünümünde başkalarınca gözle görülmeyen ya da önemsenmeyecek bir ya da birden fazla kusur algılama üzerine aşırı kafa yorma ve yineleyici davranışlar tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "başkaları tarafından neredeyse hiç fark edilmeyen",
                "dsmMatch": "DSM-5: Başkalarınca görülmeyen kusur algısı"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi (BDD)",
            "therapyDetails": "Ayna kontrolünü sınırlandırma, kusur inançlarını yeniden yapılandırma.",
            "pharmacologyNote": "Yüksek doz SSRI grubu antidepresanlar etkilidir."
        },
        "miniQuiz": {
            "question": "BDD hastalarına estetik ameliyat yapılması neden önerilmez?",
            "options": [
                "Sorun burunda değil beyindeki beden algısı işlemlenmesindedir; estetik ameliyat sonrası hastalar memnun kalmaz ve kaygıları artar.",
                "Estetik cerrahi BDD hastalarında yasaktır.",
                "Cerrahi sonrası hafıza silinir.",
                "BDD sadece göz ameliyatıyla düzelir."
            ],
            "correctIndex": 0,
            "explanation": "BDD algısal bir bozukluktur; ameliyatlar kusur algısını düzeltmez."
        },
        "differentialDiagnosis": "• Anoreksiya: Odak kilodur.\n• OKB: Takıntılar görünümle sınırlı değildir.",
        "dsmCriteriaSummary": "DSM-5: Görünümde hayali/küçük kusurlarla uğraş + Yineleyici davranışlar (ayna kontrolü).",
        "therapyId": "cbt_general",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Başkalarınca neredeyse fark edilmeyen milimetrik bir asimetriyi ‘ucube gibi’ bir kusur olarak algılaması temel ölçüttür.",
                "Günde dört saati aşan ayna kontrolü ve burnu maske ile gözlükle gizleme, görünüm kaygısına yanıt olarak yapılan yineleyici davranışlardır.",
                "Dört ameliyata rağmen memnun olmaması ve insan içine çıkamaması belirgin sıkıntı ve işlev kaybını gösterir; içgörü zayıftır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "social_anxiety",
                    "reason": "Kameralardan ve insanlardan kaçınma var, ancak korkunun kaynağı genel olarak değerlendirilmek değil, algılanan belirli bir beden kusurudur."
                },
                {
                    "diagnosisId": "anorexia_nervosa",
                    "reason": "Uğraşın konusu kilo ya da beden şekli değil, burun gibi belirli bir yüz özelliğidir ve yeme kısıtlaması yoktur."
                },
                {
                    "diagnosisId": "delusional_disorder",
                    "reason": "İçgörü zayıf olsa da tablo görünüm uğraşı ve yineleyici davranışlarla tanımlanır; içgörü tamamen yoksa bile BDD ‘içgörüsüz’ belirteciyle konur."
                }
            ],
            "teachingPoint": "BDD'de içgörü tamamen kaybolsa bile tanı sanrılı bozukluk değil, ‘içgörü yok/sanrısal inançlarla’ belirteçli BDD olarak kalır."
        }
    },
    {
        "id": "case-026",
        "caseNumber": 26,
        "difficulty": "Orta",
        "course": "CHILD",
        "diagnosisId": "odd",
        "category": "IMPULSE",
        "patientSummary": "9 yaşında, erkek, 3. sınıf öğrencisi",
        "clues": [
            "Danışan, ailesi ve sınıf öğretmeni tarafından 'otorite figürlerine karşı sürekli inatlaşan, en ufak kuralda öfke patlaması yaşayan ve arkadaşlarıyla kasıtlı olarak dalga geçip onları çileden çıkaran' davranışları nedeniyle getiriliyor.",
            "Bu öfkeli ve tartışmacı davranış örüntüsünün son 8 aydır haftada en az birkaç kez hem evde hem okulda sergilendiği belirtiliyor.",
            "Kendi yaptığı hataları veya kırıp döktüğü şeyleri asla kabul etmemekte, sürekli 'O başlattı, suçlu onlar' diyerek başkalarını suçlamaktadır.",
            "Önemli ayırıcı klinik bulgu: Çocuğun fiziksel şiddet uygulama, hayvanlara işkence etme, yangın çıkarma, hırsızlık yapma veya başkalarının temel haklarını gasp etme gibi ağır suç/saldırganlık davranışları KESİNLİKLE yoktur.",
            "Ruhsal Durum Muayenesinde: Alıngan, kolayca içerleyen ve kin tutucu tutum; kurallara direnme ve otoriteye karşı 'Bunu bana yaptıramazsınız' tarzı meydan okuyucu bilişsel şemalar.",
            "DSM-5'e göre: En az bir kardeşi dışındaki en az bir kişiyle etkileşiminde ortaya çıkan, en az 6 ay süren öfkeli/kolay kızan duygudurum, tartışmacı/meydan okuyan davranış veya kin besleme örüntüsü mevcuttur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "otorite figürlerine karşı sürekli inatlaşan",
                "dsmMatch": "DSM-5: Otoriteyle tartışmaya girme"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Ebeveyn Yönetim Eğitimi (PMT)",
            "therapyDetails": "Pozitif pekiştirme, tutarlı sınırlar koyma, problem çözme becerileri.",
            "pharmacologyNote": "Eşlik eden DEHB varsa uyarıcı medikasyon eklenebilir."
        },
        "miniQuiz": {
            "question": "KOKGB ile Davranım Bozukluğu arasındaki en kritik fark nedir?",
            "options": [
                "KOKGB'de sözel inatlaşma vardır; Davranım Bozukluğunda ise şiddet, hırsızlık, hayvanlara eziyet gibi ağır hak ihlalleri bulunur.",
                "KOKGB sadece yetişkinlerde görülür.",
                "Davranım bozukluğunda çocuk öfkelenmez.",
                "KOKGB'de zeka geriliği zorunludur."
            ],
            "correctIndex": 0,
            "explanation": "KOKGB inatçı bir tutumla sınırlıdır; Davranım Bozukluğunda ise yasal sınırları aşan ağır hak ihlalleri yer alır."
        },
        "differentialDiagnosis": "• Davranım Bozukluğu: Ağır suç ve hak ihlalleri vardır.\n• DEHB: Kural ihlali dikkatsizliktendir.",
        "dsmCriteriaSummary": "DSM-5: Öfkeli duygudurum + Tartışmacı davranış + Kin besleme örüntüsü (en az 4 belirti).",
        "therapyId": "pmt",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Sık öfke patlamaları, kolay içerleme ve kin tutma öfkeli/kolay kızan duygudurum boyutunu karşılar.",
                "Otoriteyle inatlaşma, kurallara karşı gelme, başkalarını kasıtlı kızdırma ve hatalarını başkalarına yükleme tartışmacı/meydan okuyan davranış boyutudur.",
                "Örüntü sekiz aydır, haftada birkaç kez, hem evde hem okulda görülmektedir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "conduct_disorder",
                    "reason": "Fiziksel saldırganlık, hayvanlara zarar, hırsızlık ya da yangın çıkarma gibi temel hak ihlalleri açıkça yoktur."
                },
                {
                    "diagnosisId": "adhd",
                    "reason": "Kural ihlalleri dikkatsizlik ya da dürtüsellikten değil, otoriteye karşı kasıtlı bir tutumdan kaynaklanır; yine de DEHB eşlik edebileceği için ayrıca taranmalıdır."
                },
                {
                    "diagnosisId": "dmdd",
                    "reason": "Öfke patlamaları ile karşı gelme davranışı öndedir; patlamalar arasında neredeyse her gün süren kalıcı bir öfkeli duygudurum tarif edilmiyor."
                }
            ],
            "teachingPoint": "KOKGB'yi davranım bozukluğundan ayıran, başkalarının temel haklarını ve toplumsal kuralları çiğneyen ağır davranışların yokluğudur."
        }
    },
    {
        "id": "case-027",
        "caseNumber": 27,
        "difficulty": "Orta",
        "course": "CHILD",
        "diagnosisId": "selective_mutism",
        "category": "ANXIETY",
        "patientSummary": "6 yaşında, kız, ilkokul 1. sınıf öğrencisi",
        "clues": [
            "Danışan, evinde ailesi ve kardeşleriyle gayet akıcı, neşeli ve kesintisiz konuşmasına rağmen; ilkokula başladığı günden beri sınıfta öğretmenine ve arkadaşlarına tek bir kelime dahi söylemediği için rehberlik servisi tarafından yönlendiriliyor.",
            "Okulda soru sorulduğunda başını öne eğmekte, donakalmakta veya sadece başını hafifçe sallayarak işaret diliyle iletişim kurmaya çalışmaktadır.",
            "Bu durumun okula başladığı ilk ayı geçip 5 aydır kesintisiz devam ettiği ve çocuğun derslerdeki akademik değerlendirmesini imkansız hale getirdiği bildiriliyor.",
            "İşitme testleri, KBB muayenesi ve gelişimsel dil/konuşma değerlendirmeleri tamamen normaldir; çocuğun anlama ve konuşma becerisi yaş düzeyine uygundur.",
            "Ruhsal Durum Muayenesinde: Ev videoları izlendiğinde şarkı söyleyen, espriler yapan bir çocuk görülürken; klinik ortamda terapistle tek kelime konuşamadığı, yoğun anksiyete ve sosyal kaygı yaşadığı tespit edilmiştir.",
            "DSM-5'e göre: Konuşmasının beklendiği özgül toplumsal durumlarda (örn. okulda) sürekli bir konuşamama hali ve bu durumun başka durumlarda konuşuyor olmasına rağmen var olması kriteri karşılanmaktadır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "evinde ailesi ve kardeşleriyle gayet akıcı",
                "dsmMatch": "DSM-5: Başka durumlarda konuşuyor olma"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Davranışçı Terapi (Uyaran Kaydırma / Stimulus Fading)",
            "therapyDetails": "Konuşulan kişiyle başlayıp ortama öğretmeni kademeli dahil etme.",
            "pharmacologyNote": "Ağır vakalarda SSRI grubu anksiyolitik eklenebilir."
        },
        "miniQuiz": {
            "question": "Seçici Konuşmazlık tanısı için okulun ilk ayında konuşamama neden yeterli değildir?",
            "options": [
                "Çünkü okula başlama dönemindeki ilk 1 ay normal oryantasyon sürecidir; süre en az 1 ayı aşmalıdır.",
                "Çocukların ilkokulda konuşması yasaktır.",
                "Bu bozukluk 18 yaşından sonra başlar.",
                "Çocuk evde de konuşmuyorsa tanı konur."
            ],
            "correctIndex": 0,
            "explanation": "Okulun ilk ayı normal çekingenlik olabileceğinden, süre en az 1 ayı (ilk ay hariç) aşmalıdır."
        },
        "differentialDiagnosis": "• Otizm: Otizmde genel sosyal iletişim bozukluğu vardır.\n• Dil Bozukluğu: Dil yetisi tamdır.",
        "dsmCriteriaSummary": "DSM-5: Beklenen durumlarda konuşamama + Başka ortamlarda konuşma + Süre ≥ 1 ay (ilk ay hariç).",
        "therapyId": "stimulus_fading",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Evde akıcı konuşurken okulda öğretmen ve arkadaşlarıyla hiç konuşmaması, konuşmanın beklendiği belirli toplumsal ortamlarda sürekli konuşamamadır.",
                "Durum okulun ilk ayıyla sınırlı kalmamış, beş aydır sürmekte ve akademik değerlendirmeyi engellemektedir.",
                "İşitme, dil ve konuşma becerileri yaşına uygundur; konuşamama bir dil eksikliğinden değil, kaygıdan kaynaklanır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "asd",
                    "reason": "Evde esprili, şarkı söyleyen ve karşılıklı iletişim kuran bir çocuk görülüyor; sosyal iletişim sorunu ortama özgüdür, yaygın değildir."
                },
                {
                    "diagnosisId": "language_disorder",
                    "reason": "Dil anlama ve ifade becerileri gelişim düzeyine uygundur; sorun beceri değil kullanım ortamıdır."
                },
                {
                    "diagnosisId": "social_anxiety",
                    "reason": "Sosyal kaygı eşlik ediyor, ancak tablonun merkezinde belirli ortamlarda tamamen konuşamama vardır; bu özgül tablo seçici konuşmazlık olarak adlandırılır."
                }
            ],
            "teachingPoint": "Seçici konuşmazlıkta konuşma becerisi sağlamdır; ayırt edici bulgu, çocuğun bazı ortamlarda rahatça konuşup bazılarında hiç konuşmamasıdır."
        }
    },
    {
        "id": "case-028",
        "caseNumber": 28,
        "difficulty": "Zor",
        "course": "FORENSIC",
        "diagnosisId": "kleptomania",
        "category": "IMPULSE",
        "patientSummary": "33 yaşında, kadın, varlıklı iş kadını",
        "clues": [
            "Danışan, lüks bir mağazadan değeri sadece 50 TL olan ucuz bir tokayı çantasının içine atarken güvenlik kameraları tarafından yakalanmış ve savcılık kararıyla adli psikiyatrik değerlendirmeye sevk edilmiştir.",
            "Banka hesabında milyonlarca lira bakiye bulunmasına ve çaldığı nesneye hiçbir kişisel kullanım ihtiyacı olmamasına rağmen, eşyayı almadan hemen önce içinde karşı konulamaz bir gerginlik hissettiğini ifade ediyor.",
            "Hırsızlık eylemini gerçekleştirdiği o saniyede yoğun bir haz, doyum ve rahatlama yaşadığını, ancak mağazadan çıkar çıkmaz derin bir suçluluk ve pişmanlık duyarak çaldığı eşyaları evinde bir kutuya kilitleyip hiç kullanmadığını anlatıyor.",
            "Eylemin intikam alma, öfke çıkarma veya bir hezeyanın gereği olarak yapılmadığı; organize bir suç çetesinin parçası olmadığı tespit edilmiştir.",
            "Ruhsal Durum Muayenesinde: Dürtü denetiminde epizodik çöküş, eylem öncesi artan gerginlik ve eylem anında rahatlama döngüsü; belirgin anksiyete ve utanç duygulanımı.",
            "DSM-5'e göre: Kişisel kullanım ya da parasal değeri için gereksinilmeyen nesneleri çalmaya yönelik dürtülere karşı koymada yineleyen bir başarısızlık tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "hiçbir kişisel kullanım ihtiyacı olmamasına rağmen",
                "dsmMatch": "DSM-5: Gereksinilmeyen nesneleri çalma dürtüsü"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi (Gizli Duyarsızlaştırma)",
            "therapyDetails": "Dürtü anında çalma eylemini olumsuz sonuçlarla eşleştirme, dürtü dalgalanmasını karşılama.",
            "pharmacologyNote": "Naltrekson dürtüsel hazzı bloke etmede etkilidir."
        },
        "miniQuiz": {
            "question": "Adli psikolojide Kleptomani ile Adi Hırsızlık arasındaki temel fark nedir?",
            "options": [
                "Adi hırsızlıkta maddi kazanç vardır; Kleptomanide ise nesnenin değeri önemsizdir, amaç gerginliği dindirmektir.",
                "Kleptomanide hasta sadece gece hırsızlık yapar.",
                "Adi hırsızlar asla ceza almaz.",
                "Kleptomani sadece çocuklukta görülür."
            ],
            "correctIndex": 0,
            "explanation": "Adi hırsızlık planlı ve maddi kazanç odaklıdır. Kleptomani ise gerginliği boşaltma odaklı dürtüsel bir bozukluktur."
        },
        "differentialDiagnosis": "• Adi Hırsızlık: Maddi kazanç vardır.\n• Antisosyal KB: Çalma genel kural tanımazlığın parçasıdır.",
        "dsmCriteriaSummary": "DSM-5: Gereksinilmeyen nesneleri çalma dürtüsü + Eylem öncesi gerginlik + Eylem anında haz/rahatlama.",
        "therapyId": "cbt_general",
        "pharmacologyId": "naltrexone_acamprosate",
        "explanation": {
            "whyThis": [
                "Maddi durumu çok iyiyken ihtiyaç duymadığı, değersiz bir tokayı çalması kişisel kullanım ya da para için olmayan çalma dürtüsünü gösterir.",
                "Eylemden önce artan gerginlik, eylem sırasında haz ve rahatlama, ardından suçluluk dürtü denetimi bozukluklarına özgü döngüdür.",
                "Çalınan eşyaların kullanılmadan saklanması ve eylemin öfke, intikam ya da sanrıyla ilişkili olmaması tabloyu destekler."
            ],
            "whyNot": [
                {
                    "diagnosisId": "antisocial_pd",
                    "reason": "Genel bir kural tanımazlık, aldatma ya da pişmanlık yokluğu yoktur; tersine eylem sonrası belirgin suçluluk vardır."
                },
                {
                    "diagnosisId": "bipolar_1",
                    "reason": "Dürtüsel davranışlar manik dönemde görülebilir, ancak burada epizodik yükselmiş duygudurum ya da azalmış uyku tarif edilmiyor; bu yine de sorgulanmalıdır."
                },
                {
                    "diagnosisId": "ocd",
                    "reason": "Eylem bir obsesyonu nötralize etmek için değil, gerginliği haz ve doyumla boşaltmak için yapılır; OKB kompulsiyonları haz vermez."
                }
            ],
            "teachingPoint": "Kleptomaniyi sıradan hırsızlıktan ayıran, nesneye ihtiyaç duyulmaması ve eylem öncesi gerginlik-eylem anında rahatlama döngüsüdür."
        }
    },
    {
        "id": "case-029",
        "caseNumber": 29,
        "difficulty": "İleri Düzey",
        "course": "COMORBID",
        "diagnosisId": "mdd",
        "secondaryDiagnosisId": "social_anxiety",
        "category": "MOOD",
        "patientSummary": "26 yaşında, erkek, yazılım test uzmanı (Çift tanılı vaka)",
        "clues": [
            "Danışan son 2 aydır derin bir mutsuzluk, yataktan çıkamama, 7 kilo verme ve 'hayatın hiçbir anlamı kalmadığı' düşünceleriyle başvuruyor; ancak ayrıntılı öyküde lise yıllarından beri insanların önünde konuşmaktan, yemek yemekten dehşetle kaçındığı öğreniliyor.",
            "Son 8 haftadır çökkün duygudurum neredeyse her gün sürmekte ve konsantrasyon kaybı nedeniyle işini kaybetme noktasına gelmiş durumdadır.",
            "Geçmiş öyküsünde ise yıllardır toplantılarda yüzü kızaracak diye terlediği, garsona sipariş veremediği ve sosyal ortamlardan dışlandığı için giderek yalnızlaşıp bu depresif döngüye girdiği anlatılıyor (2. Eşlik Eden Tanı).",
            "Tiroid ve rutin biyokimya testleri temizdir; organik bir etiyoloji saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Psikomotor yavaşlama ve derin kederin yanı sıra, terapistin gözlerine bakarken yoğun yüz kızarması ve rezil olma kaygısı (olumsuz değerlendirilme korkusu) eşzamanlı gözleniyor.",
            "DSM-5'e göre: Vaka hem Majör Depresif Bozukluk kriterlerini (en az 2 haftalık epizod) hem de altta yatan Sosyal Anksiyete Bozukluğu (Sosyal Fobi) kriterlerini tam olarak karşılamaktadır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "derin bir mutsuzluk, yataktan çıkamama, 7 kilo verme",
                "dsmMatch": "1. Tanı: Majör Depresif Bozukluk"
            },
            {
                "clueIndex": 2,
                "text": "yüzü kızaracak diye terlediği",
                "dsmMatch": "2. Tanı: Sosyal Anksiyete Bozukluğu"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Kombine BDT",
            "therapyDetails": "Önce Davranışsal Aktivasyon; ardından Sosyal Fobi için video geribildirimi ve maruz bırakma.",
            "pharmacologyNote": "SSRI grubu antidepresanlar her iki bozukluğu da hedefler."
        },
        "miniQuiz": {
            "question": "Majör Depresyon ile Sosyal Anksiyetenin komorbid görülmesinin en yaygın sebebi nedir?",
            "options": [
                "Sosyal kaygının yol açtığı izolasyonun zamanla pozitif pekiştireçleri yok ederek depresyonu tetiklemesi.",
                "Aynı beyin bölgesinde tümör oluşması.",
                "Sosyal anksiyetenin sadece manide olması.",
                "İkisinin birlikte olması imkansızdır."
            ],
            "correctIndex": 0,
            "explanation": "Sosyal fobi nedeniyle insanlardan kaçınan bireyler ödüllendirici yaşantılardan mahrum kalarak depresyona girerler."
        },
        "differentialDiagnosis": "• Tek Başına Depresyon: Sosyal çekilme sadece depresif dönemle sınırlıdır.",
        "dsmCriteriaSummary": "DSM-5: Majör Depresif Epizod + Sosyal Anksiyete Bozukluğu eşzamanlılığı.",
        "therapyId": "behavioral_activation",
        "pharmacologyId": "snri_dualex",
        "explanation": {
            "whyThis": [
                "Sekiz haftadır neredeyse her gün süren çökkün duygudurum, yataktan çıkamama, yedi kilo kaybı, konsantrasyon kaybı ve anlamsızlık düşünceleri majör depresif epizodu karşılar.",
                "Öyküde liseden beri, depresyondan çok önce başlayan konuşma ve yemek yeme gibi sosyal durumlarda rezil olma korkusu ve kaçınma vardır.",
                "Sosyal kaygının yalnızlaşmaya ve ardından depresyona yol açması, iki ayrı ama ilişkili tanıyı gösterir; ana başvuru nedeni depresyondur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "avoidant_pd",
                    "reason": "Kaçınma belirli performans ve yemek durumlarına odaklı tarif ediliyor; yaygın bir yetersizlik benlik algısı ve tüm ilişkilerden çekilme gösterilmemiştir."
                },
                {
                    "diagnosisId": "dysthymia",
                    "reason": "Çökkünlük iki yıldır değil, iki aydır vardır; uzun süren kısım depresyon değil sosyal kaygıdır."
                },
                {
                    "diagnosisId": "adjustment_disorder",
                    "reason": "Depresif belirtiler majör depresyon ölçütlerini tam karşılıyor; bu durumda uyum bozukluğu tanısı konmaz."
                }
            ],
            "teachingPoint": "Depresyonla gelen bir hastada sosyal çekilmenin depresyondan önce mi başladığını sor; önce başlamışsa altta yatan sosyal kaygı bozukluğu olabilir."
        }
    },
    {
        "id": "case-030",
        "caseNumber": 30,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "agoraphobia",
        "category": "ANXIETY",
        "patientSummary": "42 yaşında, kadın, ev hanımı",
        "clues": [
            "Danışan son 1 yıldır köprülerden geçemediğini, tünellere giremediğini, toplu taşıma araçlarına binemediğini ve kalabalık pazar yerlerinde 'buradan kaçamam ya da panik atak geçirirsem kimse bana yardım edemez' dehşeti yaşadığını belirterek başvuruyor.",
            "Bu korkular nedeniyle son 6 aydır evden yalnızca eşinin koluna girerek çıkabilmekte, tek başına bakkala dahi gidememektedir.",
            "Korkulan durumlar (açık alanlar, kapalı alanlar, toplu taşıma, kalabalık, sırada bekleme) neredeyse her zaman orantısız bir anksiyete doğurmakta ve hasta bu ortamlardan ısrarla kaçınmaktadır.",
            "Genel tıbbi muayene, kardiyolojik testler ve nörolojik değerlendirme normaldir.",
            "Ruhsal Durum Muayenesinde: Ev dışında yoğun kaçınma davranışları, refakatçi (güvenlik nesnesi) bağımlılığı ve belirgin beklenti kaygısı gözlenmektedir.",
            "DSM-5'e göre: 1. Toplu taşıma, 2. Açık alanlar, 3. Kapalı yerler, 4. Sırada bekleme/kalabalık, 5. Ev dışında tek başına olma durumlarından en az 2'sinde belirgin korku/kaçınma (≥ 6 ay) mevcuttur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "buradan kaçamam ya da panik atak geçirirsem kimse bana yardım edemez",
                "dsmMatch": "DSM-5 Kriter B: Kaçmanın güç olabileceği veya yardım sağlanamayacağı düşüncesiyle korkma"
            },
            {
                "clueIndex": 1,
                "text": "yalnızca eşinin koluna girerek çıkabilmekte",
                "dsmMatch": "DSM-5 Kriter C: Bir eşlikçiye gereksinim duyma ya da yoğun korkuyla katlanma"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi (Kademeli In-Vivo / Canlı Maruz Bırakma)",
            "therapyDetails": "Kaçınma hiyerarşisi oluşturma, güvenlik arama davranışlarını (yanında eşini götürme, su taşıma vb.) bırakma ve agorafobik ortamlarda kalma egzersizleri.",
            "pharmacologyNote": "SSRI grubu antidepresanlar (Sertralin, Paroksetin) anksiyolitik etkinliği artırmak için kombine edilebilir."
        },
        "miniQuiz": {
            "question": "Agorafobi tanısı için DSM-5'te belirtilen 5 durumdan (toplu taşıma, açık alanlar, kapalı alanlar, kalabalık/sıra, ev dışında yalnız olma) en az kaç tanesinde belirgin korku ve kaçınma şarttır?",
            "options": [
                "En az 2 durum",
                "Sadece 1 durum yeterlidir",
                "5 durumun tamamı zorunludur",
                "En az 4 durum"
            ],
            "correctIndex": 0,
            "explanation": "DSM-5'e göre Agorafobi tanısı koyabilmek için 5 tipik durumdan en az 2 veya daha fazlasında belirgin korku/kaygı ve kaçınma olması şarttır."
        },
        "differentialDiagnosis": "• Özgül Fobi (Durumsal): Sadece tek bir özgül nesne/ortamdan korkulur (örn: sadece uçak). Agorafobide ise kaçmanın zor olacağı en az 2 farklı alan korkusu vardır.\n• Sosyal Fobi: Odak noktası rezil olma/küçük düşme korkusudur; agorafobide ise kaçamama veya panik anında yardım bulamama korkusudur.",
        "dsmCriteriaSummary": "DSM-5: En az 2 alanda (toplu taşıma, açık alan, kapalı alan, kalabalık, ev dışı) kaçamama/yardım alamama korkusu ve kaçınma. Süre ≥ 6 ay.",
        "therapyId": "invivo_exposure",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Köprü, tünel, toplu taşıma ve kalabalık pazar gibi birden çok durumda korku vardır; ölçüt için en az iki durum yeterlidir.",
                "Korkunun içeriği ‘kaçamam ya da panik olursa yardım alamam’ düşüncesidir; bu agorafobinin özgül bilişidir.",
                "Altı aydır yalnızca eşiyle evden çıkabilmesi, refakatçiye bağımlılık ve kaçınma ile belirgin işlev kaybını gösterir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "specific_phobia",
                    "reason": "Korku tek bir durumla sınırlı değil; toplu taşıma, açık ve kapalı alanlar ile kalabalık gibi birçok alana yayılmıştır."
                },
                {
                    "diagnosisId": "social_anxiety",
                    "reason": "Korkunun odağı başkalarınca olumsuz değerlendirilmek değil, kaçış ya da yardımın zor olacağı durumda kalmaktır."
                },
                {
                    "diagnosisId": "panic_disorder",
                    "reason": "Panik atak korkusu var, ancak beklenmedik tekrarlayan ataklar tarif edilmiyor; varsa iki tanı birlikte konabilir."
                }
            ],
            "teachingPoint": "DSM-5 sonrası agorafobi panik bozukluktan bağımsız bir tanıdır; ayırt edici bilişi ‘kaçamam/yardım alamam’ korkusudur."
        }
    },
    {
        "id": "case-031",
        "caseNumber": 31,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "brief_psychotic",
        "category": "PSYCHOTIC",
        "patientSummary": "28 yaşında, kadın, mimar",
        "clues": [
            "Danışan, nişanlısının düğünden 3 gün önce aniden evi terk edip kayıplara karışması üzerine yaşanan ağır duygusal şokun ardından; uzaylıların kendisini kaçırmak için evin etrafında toplandığını ve radyodan kendisine gizli talimatlar verildiğini söyleyerek yakınları tarafından acile getiriliyor.",
            "Aktif hezeyanlar ve görsel-işitsel varsanılar (halüsinasyonlar) tam 12 gün boyunca kesintisiz sürmüş, hasta bu süre zarfında uykusuz ve aşırı ajite kalmıştır.",
            "14. günün sonunda belirtiler hızla gerilemiş ve hasta 3. haftada hiçbir psikotik semptom kalmaksızın tamamen hastalık öncesi sağlıklı işlevsellik düzeyine (tam remisyon) dönmüştür.",
            "Kranial MRG, EEG, kan tahlilleri ve idrar toksikoloji taraması tamamen temiz çıkmıştır.",
            "Ruhsal Durum Muayenesinde: Akut dönemde düşünce dezorganizasyonu ve paranoid sanrılar mevcutken, taburculuk muayenesinde düşünce yapısı ve içgörüsü tam olarak düzelmiştir.",
            "DSM-5'e göre: Sanrı, varsanı veya dezorganize konuşma belirtilerinden en az birinin bulunması; atağın en az 1 gün ancak 1 aydan kısa sürmesi ve kişinin hastalık öncesi işlevsellik düzeyine tam dönmesi mevcuttur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "tam 12 gün boyunca kesintisiz sürmüş",
                "dsmMatch": "DSM-5 Kriter B: Bozukluğun süresi en az 1 gün ancak 1 aydan kısadır"
            },
            {
                "clueIndex": 2,
                "text": "tamamen hastalık öncesi sağlıklı işlevsellik düzeyine (tam remisyon) dönmüştür",
                "dsmMatch": "DSM-5 Kriter B: Hastalık öncesi işlevsellik düzeyine tam bir dönüş gerçekleşir"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Kriz Müdahalesi & Destekleyici Psikoterapi",
            "therapyDetails": "Tetikleyici yaşam olayını işleme, güven duygusunu yeniden inşa etme ve psikoeğitim.",
            "pharmacologyNote": "Akut ajitasyon ve hezeyan döneminde kısa süreli düşük doz antipsikotik (örn: Olanzapin, Risperidon) uygulanır ve remisyon sonrası kademeli kesilir."
        },
        "miniQuiz": {
            "question": "Kısa Psikotik Bozukluk ile Şizofreniform Bozukluk arasındaki en temel tanısal ayrım kriteri nedir?",
            "options": [
                "Kısa Psikotik Bozukluk 1 günden uzun fakat 1 aydan kısa sürer ve tam düzelir; Şizofreniform ise 1 aydan uzun, 6 aydan kısa sürer.",
                "Kısa Psikotik Bozuklukta sanrı görülmez.",
                "Şizofreniform Bozukluk sadece çocuklarda görülür.",
                "Kısa psikotik bozuklukta antipsikotik ilaçlar etkisizdir."
            ],
            "correctIndex": 0,
            "explanation": "DSM-5'te süre sınırları çok nettir: Kısa Psikotik Bozukluk < 1 ay; Şizofreniform Bozukluk 1-6 ay arası; Şizofreni ise ≥ 6 aydır."
        },
        "differentialDiagnosis": "• Şizofreniform Bozukluk: Belirtiler 1 aydan uzun, 6 aydan kısa sürer.\n• Şizofreni: Toplam süre en az 6 aydır.\n• Maddeye Bağlı Psikotik Bozukluk: Toksikoloji negatiftir.",
        "dsmCriteriaSummary": "DSM-5: En az 1 psikotik belirti (sanrı, varsanı, dezorganize konuşma). Süre: 1 gün ile 1 ay arası + Hastalık öncesi düzeye tam dönüş.",
        "therapyId": "cbtp",
        "pharmacologyId": "atypical_ap_secondgen",
        "explanation": {
            "whyThis": [
                "Sanrılar, görsel-işitsel varsanılar ve dezorganizasyon gerekli psikotik belirtilerden birden fazlasını karşılar.",
                "Belirtiler on iki gün sürmüş, yani en az bir gün ve bir aydan kısa süre koşulunu sağlar.",
                "Üçüncü haftada hastalık öncesi işlevselliğe tam dönüş olmuş ve nişanlının kaybolması belirgin bir stresör olarak öne çıkar."
            ],
            "whyNot": [
                {
                    "diagnosisId": "schizophreniform",
                    "reason": "Belirtiler bir aydan kısa sürmüş ve tamamen gerilemiştir; şizofreniform için en az bir ay gerekir."
                },
                {
                    "diagnosisId": "acute_stress_disorder",
                    "reason": "Ağır bir stresör var ama tablo yeniden yaşantılama ve kaçınma değil, sanrı ve varsanılardır; ayrıca terk edilme ASB'nin aradığı türde bir travma değildir."
                },
                {
                    "diagnosisId": "substance_induced_psychotic",
                    "reason": "İdrar toksikolojisi ve kan tahlilleri temizdir."
                }
            ],
            "teachingPoint": "Kısa psikotik bozukluk geriye dönük konan bir tanıdır: bir aydan kısa süre ve tam iyileşme gerçekleşmeden kesinleşmez; belirgin stresör varsa belirteç olarak eklenir."
        }
    },
    {
        "id": "case-032",
        "caseNumber": 32,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "pmdd",
        "category": "MOOD",
        "patientSummary": "30 yaşında, kadın, insan kaynakları uzmanı",
        "clues": [
            "Danışan, son 1 yıldır hemen hemen her menstrüel döngüsünün kanamadan önceki son haftasında (luteal faz) 'dayanılmaz bir öfke, aşırı alınganlık, sebepsiz ağlama krizleri, çökkünlük ve eşiyle şiddetli kavgalar' yaşadığını anlatıyor.",
            "Bu belirtilerin adet kanamasının başlamasından birkaç gün sonra tamamen kaybolduğu ve menstrüasyon sonrası haftada kendini tamamen enerjik ve neşeli hissettiği (belirtisiz dönem) belirtiliyor.",
            "Dönem öncesi günlerde göğüslerde aşırı hassasiyet/şişkinlik, eklem ağrıları, tatlı krizleri ve dikkat toplamada belirgin güçlük eşlik etmektedir.",
            "Jinekolojik muayene ve hormon profili (östrojen, progesteron, prolaktin, tiroid) olağandır.",
            "Ruhsal Durum Muayenesinde: Premenstrüel dönemde belirgin afektif labilite, irritabilite ve anksiyete tespit edilmiş; döngü takviminde belirtilerin en az iki döngü boyunca ardışık olarak luteal fazda ortaya çıkıp foliküler fazda sıfırlandığı doğrulanmıştır.",
            "DSM-5'e göre: Menstrüel döngülerin çoğunda kanama öncesi son haftada belirgin duygulanımsal değişkenlik, kolay kızma, çökkünlük veya anksiyete belirtilerinden en az 5'inin bulunması ve kanama sonrası gerilemesi kriteri karşılanmaktadır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "kanamadan önceki son haftasında (luteal faz)",
                "dsmMatch": "DSM-5 Kriter A: Menstrüasyon başlamadan önceki son haftada belirtilerin başlaması"
            },
            {
                "clueIndex": 1,
                "text": "kanamasının başlamasından birkaç gün sonra tamamen kaybolduğu",
                "dsmMatch": "DSM-5 Kriter A: Kanamadan sonraki birkaç gün içinde gerilemesi ve menstrüasyon sonrası haftada belirtisiz hale gelmesi"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi (Döngü Takibi & Duygu Düzenleme)",
            "therapyDetails": "Belirti günlüğü tutma, stres yönetimi, uyku hijyeni, kafein/şeker kısıtlaması ve gevşeme egzersizleri.",
            "pharmacologyNote": "Luteal faza özgü kesikli (intermittent) veya sürekli SSRI (Fluoksetin, Sertralin) tedavisi altın standart farmakoterapidir."
        },
        "miniQuiz": {
            "question": "Premenstrüel Disforik Bozukluk (PMDD) ile olağan Premenstrüel Sendrom (PMS) arasındaki en temel fark nedir?",
            "options": [
                "PMDD'de duygudurum semptomları (belirgin disfori, yoğun öfke, çatışmalar) klinik açıdan ağır işlevsellik kaybına yol açacak şiddettedir.",
                "PMS sadece menopozdan sonra görülür.",
                "PMDD'de adet kanaması hiç gerçekleşmez.",
                "PMS'de bedensel belirti görülmez."
            ],
            "correctIndex": 0,
            "explanation": "PMS hafif bedensel ve duygusal dalgalanmalar içerirken, PMDD şiddetli afektif labilite, disfori ve ilişkisel/mesleki işlev kaybı yaratan psikiyatrik bir duygudurum bozukluğudur."
        },
        "differentialDiagnosis": "• Majör Depresif Bozukluk: Depresyonda çökkünlük menstrüel döngüden bağımsız olarak en az 2 hafta kesintisiz sürer; PMDD ise döngüseldir.\n• Bipolar Bozukluk: Bipolar ataklar hormonal döngüyle birebir kilitli değildir.",
        "dsmCriteriaSummary": "DSM-5: Luteal fazda en az 5 belirti (afektif labilite, öfke/çatışma, çökkünlük, anksiyete, iştah/uyku değişimi) + Kanamadan sonraki günlerde tam düzelme.",
        "therapyId": "cbt_general",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Öfke, alınganlık, ağlama krizleri ve çökkünlük döngülerin çoğunda kanamadan önceki haftada ortaya çıkar ve kanamadan birkaç gün sonra kaybolur.",
                "Göğüs hassasiyeti, eklem ağrısı, tatlı istekleri ve dikkat güçlüğü ek belirtilerdir; toplam belirti sayısı beşi aşar.",
                "Belirtilerin en az iki döngü boyunca ileriye dönük günlükle doğrulanması tanının kesinleşmesi için gereken koşuldur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "mdd",
                    "reason": "Çökkünlük iki hafta kesintisiz sürmüyor; foliküler fazda belirtisiz bir dönem vardır."
                },
                {
                    "diagnosisId": "bipolar_2",
                    "reason": "Belirtisiz haftalarda bildirilen enerji ve neşe hipomani değil, normal duygudurumdur; döngüye kilitlenen değişim PMDD lehinedir."
                },
                {
                    "diagnosisId": "borderline_pd",
                    "reason": "Duygusal değişkenlik ve kavgalar kişilerarası tetikleyicilere değil, adet döngüsünün belirli bir fazına bağlıdır."
                }
            ],
            "teachingPoint": "PMDD tanısı hatırlamaya değil, en az iki döngü boyunca tutulan günlük kayıtlarla gösterilen luteal faz-foliküler faz örüntüsüne dayanır."
        }
    },
    {
        "id": "case-033",
        "caseNumber": 33,
        "difficulty": "Zor",
        "course": "ADULT",
        "diagnosisId": "schizotypal_pd",
        "category": "PERSONALITY_A",
        "patientSummary": "37 yaşında, erkek, ikinci el kitap satıcısı",
        "clues": [
            "Danışan, 'insanların auralarını ve negatif enerjilerini renk dalgaları şeklinde görebildiğini', odasındaki kristallerin telepatik olarak kendisini felaketlerden koruduğunu ve sokakta yürürken insanların kendisine büyü yapmaya çalıştığını belirterek görüşmeye geliyor.",
            "Konuşma tarzı mecazi, aşırı ayrıntılı ve ağdalı (metaforik konuşma) olup, mevsim şartlarına tamamen aykırı tuhaf kıyafet kombinasyonları (yaz ortasında kat kat siyah pelerin ve eldiven) giymektedir.",
            "Birinci derece yakınları dışında hiç arkadaşı yoktur; insanların kendisine zarar vereceği yönündeki paranoid kuşkuları nedeniyle sosyal ortamlarda yoğun bir tedirginlik yaşamaktadır.",
            "Herhangi bir madde kullanımı veya nörolojik temporal lob patolojisi saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Büyüsel düşünceler (magical thinking), referans fikirleri (televizyondaki bazı kelimelerin kendisine özel işaretler olduğu inancı), garip/tuhaf davranışlar, kısıtlı duygulanım ve aşırı kuşkuculuk.",
            "DSM-5'e göre: Yakın ilişkilerde aniden rahatsızlık duyma ve ilişki kurma kapasitesinde azalma ile belirlenen toplumsal ve kişilerarası yetersizlikler; bilişsel veya algısal çarpıtmalar ve büyüsel inançlar örüntüsüdür."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "auralarını ve negatif enerjilerini renk dalgaları şeklinde görebildiğini",
                "dsmMatch": "DSM-5 Kriter 2: Büyüsel düşünme veya olağandışı algısal yaşantılar"
            },
            {
                "clueIndex": 1,
                "text": "Konuşma tarzı mecazi, aşırı ayrıntılı ve ağdalı",
                "dsmMatch": "DSM-5 Kriter 4: Garip düşünce ve konuşma (ör. mecazi, aşırı ayrıntılı)"
            },
            {
                "clueIndex": 1,
                "text": "mevsim şartlarına tamamen aykırı tuhaf kıyafet kombinasyonları",
                "dsmMatch": "DSM-5 Kriter 6: Garip, alışılagelmişin dışında ya da tuhaf davranış/görünüm"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Destekleyici Psikoterapi & Sosyal Beceri Eğitimi",
            "therapyDetails": "Tuhaf algıları yargılamadan gerçeklik testi yapma, sosyal ipuçlarını okuma becerilerini geliştirme ve anksiyeteyi yönetme.",
            "pharmacologyNote": "Belirgin kuşkuculuk ve bilişsel çarpıtmalar için düşük doz ikinci kuşak antipsikotikler fayda sağlayabilir."
        },
        "miniQuiz": {
            "question": "Şizotipal Kişilik Bozukluğu ile Şizoid Kişilik Bozukluğu arasındaki en temel fark nedir?",
            "options": [
                "Şizotipalde büyüsel düşünceler, referans fikirleri, tuhaf konuşma ve eksantrik davranışlar vardır; Şizoidde düşünce içeriği tuhaf değildir, sadece sosyal ilişkilerden kopukluk vardır.",
                "Şizoid hastalar telepatik güçlere inanır.",
                "Şizotipal kişilik bozukluğunda hasta hiç konuşmaz.",
                "İkisi tamamen aynı bozukluktur."
            ],
            "correctIndex": 0,
            "explanation": "Şizoid sadece ilişkisiz ve duygusal olarak düzdür; Şizotipal ise büyüsel inançlar, olağandışı algılar, tuhaf giyim ve eksantrik düşünce yapısıyla karakterizedir."
        },
        "differentialDiagnosis": "• Şizofreni: Şizotipalde sabit, yıkıcı hezeyanlar veya açık halüsinasyonlar yoktur; düşünceler daha çok büyüsel/eksantriktir.\n• Şizoid KB: Şizoidde büyüsel inanç ve tuhaf konuşma bulunmaz.",
        "dsmCriteriaSummary": "DSM-5 (En az 5/9): Alınma fikirleri, büyüsel düşünüş, olağandışı algılar, garip konuşma, kuşkuculuk, uygunsuz duygulanım, tuhaf görünüm, yakın arkadaş yokluğu, toplumsal anksiyete.",
        "therapyId": "cbtp",
        "pharmacologyId": "atypical_ap_secondgen",
        "explanation": {
            "whyThis": [
                "Aura görme, kristallerin telepatik koruması ve büyü yapıldığı inancı büyüsel düşünce ve alışılmadık algısal deneyimlerdir.",
                "Mecazi, aşırı ayrıntılı konuşma ve mevsime aykırı tuhaf giyim, garip konuşma ve davranış ölçütlerine uyar.",
                "Yakınlar dışında arkadaşı olmaması, kuşkuculuk ve tanıdıklığa rağmen azalmayan sosyal kaygı kişilerarası yetersizlik boyutunu gösterir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "schizophrenia",
                    "reason": "Belirgin varsanı, sabit sanrı, dezorganizasyon ya da işlevsel çöküş tarif edilmiyor; inançlar eksantrik düzeyde kalıyor. İnançların ne kadar sarsılmaz olduğu ayrıca sınanmalıdır."
                },
                {
                    "diagnosisId": "schizoid_pd",
                    "reason": "Şizoid kişilikte büyüsel inançlar, tuhaf konuşma ve paranoid kaygı bulunmaz."
                },
                {
                    "diagnosisId": "paranoid_pd",
                    "reason": "Kuşkuculuk var, ancak büyüsel düşünce, algısal tuhaflıklar ve eksantrik davranış paranoid kişiliği aşar."
                }
            ],
            "teachingPoint": "Şizotipal kişiliği öteki A kümesi bozukluklarından ayıran, büyüsel düşünce ve tuhaf algı/davranış gibi bilişsel-algısal çarpıklıklardır."
        }
    },
    {
        "id": "case-034",
        "caseNumber": 34,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "dependent_pd",
        "category": "PERSONALITY_C",
        "patientSummary": "29 yaşında, kadın, yönetici asistanı",
        "clues": [
            "Danışan, 'Hangi kıyafeti giyeceğimden hangi restorana gideceğime kadar anneme veya erkek arkadaşıma sormadan en ufak bir karar veremiyorum; onlar olmadan hayatımı idare edemem' diyerek başvuruyor.",
            "Terk edilme ve yalnız kalma korkusu yüzünden erkek arkadaşının kendisine yönelik aşağılayıcı ve küçümseyici davranışlarına ses çıkaramamakta, onun her istediğine kayıtsız şartsız boyun eğmektedir.",
            "Kendi başına bir proje başlatmakta felç edici bir özgüven eksikliği yaşamakta, bir ilişki bittiğinde bakım ve destek bulmak için hemen panik içinde yeni bir ilişki arayışına girmektedir.",
            "Tıbbi özgeçmişinde nörolojik veya bilişsel bir engel bulunmamaktadır.",
            "Ruhsal Durum Muayenesinde: Aşırı itaatkar (submissive), yapışkan tutum; sorumluluk almaktan aşırı kaçınma, kendini çaresiz ve yetersiz algılama.",
            "DSM-5'e göre: Kendisine bakılma gereksinimiyle giden, uysal ve yapışkan davranışa ve ayrılma korkusuna yol açan yaygın ve aşırı bir gereksinim örüntüsüdür."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "anneme veya erkek arkadaşıma sormadan en ufak bir karar veremiyorum",
                "dsmMatch": "DSM-5 Kriter 1: Başkalarından aşırı öğüt ve güvence almadıkça gündelik kararları vermede güçlük"
            },
            {
                "clueIndex": 1,
                "text": "onun her istediğine kayıtsız şartsız boyun eğmektedir",
                "dsmMatch": "DSM-5 Kriter 3: Destek ve kabulü kaybetme korkusuyla başkalarıyla aynı görüşte olmadığını söyleyememe"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi (Girişkenlik / Atılganlık Eğitimi & Şema Terapi)",
            "therapyDetails": "'Bağımlılık/Yetersizlik' ve 'Boyun Eğicilik' şemaları üzerinde çalışma; bağımsız karar alma ve 'hayır' diyebilme becerilerini geliştirme.",
            "pharmacologyNote": "Primer tedavi psikoterapidir; eşlik eden yoğun anksiyete durumunda SSRI tercih edilebilir."
        },
        "miniQuiz": {
            "question": "Bağımlı Kişilik Bozukluğu ile Sınırda (Borderline) Kişilik Bozukluğu arasındaki terk edilme tepkisi farkı nedir?",
            "options": [
                "Borderline terk edilme tehlikesine öfke patlaması ve krizlerle karşılık verirken; Bağımlı kişilik uysallaşır, boyun eğer ve derhal yerine geçecek yeni bir koruyucu arar.",
                "Bağımlı kişilikler asla terk edilmekten korkmaz.",
                "Borderline hastalar başkalarına hiç bağlanmaz.",
                "İki bozuklukta da hiçbir fark yoktur."
            ],
            "correctIndex": 0,
            "explanation": "Borderline terk edilme tehdidinde yoğun öfke, kendine zarar ve suçlama sergiler. Bağımlı birey ise tamamen itaatkarlaşır, boyun eğer ve hemen başka bir bakıcı ilişkiye sığınır."
        },
        "differentialDiagnosis": "• Sınırda (Borderline) KB: BPD'de öfke patlamaları ve duygusal dengesizlik baskındır; Bağımlı KB'de ise pasif boyun eğicilik vardır.\n• Çekingen (Kaçıngan) KB: Kaçıngan kişi reddedilme korkusuyla ilişkiden uzak durur; Bağımlı kişi ise ilişkiye yapışır.",
        "dsmCriteriaSummary": "DSM-5 (En az 5/8): Karar vermede aşırı güvence arama, sorumluluğu başkasına devretme, görüş ayrılığını ifade edememe, tek başına iş başlatamama, destek için hoş olmayan şeyleri yapma, tek başına çaresizlik, ilişki bitince hemen yenisini arama.",
        "therapyId": "schema_therapy",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Giyim gibi gündelik kararları bile anne ya da sevgilisine sormadan verememesi aşırı güvence ve öğüt ihtiyacını gösterir.",
                "Desteği yitirme korkusuyla aşağılayıcı davranışlara karşı çıkamaması, anlaşmazlık bildirmede güçlük ölçütüdür.",
                "Kendi başına iş başlatamama ve bir ilişki bitince hemen yeni bir bakım kaynağı araması bakılma gereksiniminin yaygın örüntüsüdür."
            ],
            "whyNot": [
                {
                    "diagnosisId": "borderline_pd",
                    "reason": "Terk edilme korkusu ortak, ancak burada öfke patlamaları, kendine zarar verme ve değişken duygudurum değil, pasif ve uysal bir bağlılık vardır."
                },
                {
                    "diagnosisId": "avoidant_pd",
                    "reason": "Çekingen kişi reddedilme korkusuyla ilişkiden uzak durur; bu kişi ise ilişkiye yapışır."
                },
                {
                    "diagnosisId": "mdd",
                    "reason": "Kendini çaresiz algılama var, ancak süreli bir çökkünlük epizodu değil, yaşam boyu süren bir bağımlılık örüntüsü tarif ediliyor."
                }
            ],
            "teachingPoint": "Bağımlı kişilikte terk edilme korkusu boyun eğme ve yapışma ile, borderline'da ise öfke ve dürtüsel çabalarla ifade edilir."
        }
    },
    {
        "id": "case-035",
        "caseNumber": 35,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "histrionic_pd",
        "category": "PERSONALITY_B",
        "patientSummary": "25 yaşında, kadın, dizi oyuncusu adayı",
        "clues": [
            "Danışan kliniğe son derece gösterişli kıyafetler, abartılı makyaj ve teatral bir yürüyüşle girip görüşme sırasında sürekli rol yapar gibi jestler kullanmakta ve 'İlgi görmediğim ortamlarda nefes alamıyorum, adeta yok oluyorum' demektedir.",
            "Terapistle olan profesyonel ilişkiyi henüz ilk 10 dakikada 'Siz benim ruh ikizimsiniz, hayatımın en özel insanısınız' şeklinde aşırı samimi ve cinsel açıdan kışkırtıcı bir üslupla tanımlamaya çalışmaktadır.",
            "Duygusal tepkileri son derece sığ ve oynaktır; bir saniye içinde kahkahalar atarken hemen ardından hıçkırarak ağlamaya başlamakta ancak bu duygulanım karşı tarafta yapay ve yüzeysel bir izlenim bırakmaktadır.",
            "Madde kullanımı veya manik dönem öyküsü yoktur.",
            "Ruhsal Durum Muayenesinde: Aşırı telkine yatkınlık (kolay etkilenme), dramatizasyon, ilgi odağı olma arzusu ve fiziksel çekiciliği sürekli bir silah olarak kullanma örüntüsü.",
            "DSM-5'e göre: Aşırı duygusallık ve dikkat çekme ile giden, erken erişkinlikte başlayan yaygın bir kişilik örüntüsüdür."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "İlgi görmediğim ortamlarda nefes alamıyorum",
                "dsmMatch": "DSM-5 Kriter 1: İlgi odağı olmadığı durumlarda rahatsız olma"
            },
            {
                "clueIndex": 1,
                "text": "cinsel açıdan kışkırtıcı bir üslupla",
                "dsmMatch": "DSM-5 Kriter 2: Uygunsuz biçimde cinsel yönden ayartıcı veya kışkırtıcı davranış"
            },
            {
                "clueIndex": 2,
                "text": "Duygusal tepkileri son derece sığ ve oynaktır",
                "dsmMatch": "DSM-5 Kriter 3: Hızlı değişen ve yüzeysel kalan duygular sergileme"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Psikodinamik Terapi & BDT",
            "therapyDetails": "Yüzeysel duyguların altındaki gerçek duygusal ihtiyaçları tanıma, sınır koyma, terapötik çerçeveyi koruma ve onay bağımlılığını azaltma.",
            "pharmacologyNote": "Duygulanımsal labilite çok yüksekse geçici düşük doz duygudurum dengeleyici veya anksiyolitik kullanılabilir."
        },
        "miniQuiz": {
            "question": "Histriyonik Kişilik Bozukluğu ile Narsisistik Kişilik Bozukluğu arasındaki ilgi arama farkı nedir?",
            "options": [
                "Narsist kişi 'üstünlük, hayranlık ve statü' ister; Histriyonik kişi ise sadece 'ilgi odağı' olmak ister (ilginin acınası veya aptalca görünmesi bile onun için yeterlidir).",
                "Histriyonik bireyler ilgi görmekten nefret eder.",
                "Narsisistik bireyler daima sessizdir.",
                "İki bozuklukta da hiçbir fark yoktur."
            ],
            "correctIndex": 0,
            "explanation": "Narsist hayranlık ve özel statü arar. Histriyonik ise hayranlık olmasa bile sadece dikkat çekmek, sevimli/kırılgan veya baştan çıkarıcı görünmekle yetinir."
        },
        "differentialDiagnosis": "• Narsisistik KB: Üstünlük ve hayranlık arar; Histriyonik ise sadece ilgi odağı olmak ister.\n• Sınırda KB: Histriyonikte kronik boşluk hissi ve kendine zarar verme tipik değildir.",
        "dsmCriteriaSummary": "DSM-5 (En az 5/8): İlgi odağı olamayınca rahatsızlık, cinsel ayartıcılık, sığ/oynak duygular, dış görünümü dikkat için kullanma, teatral/abartılı konuşma, telkine yatkınlık, ilişkileri olduğundan daha yakın sanma.",
        "therapyId": "psychodynamic",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "İlgi odağı olmadığında rahatsızlık duyması ve görünümünü dikkat çekmek için kullanması temel özelliklerdir.",
                "Terapistle ilk dakikalarda aşırı samimi ve cinsel açıdan kışkırtıcı davranması, ilişkileri olduğundan yakın algılama ve uygunsuz baştan çıkarıcılık ölçütleridir.",
                "Hızla değişen, yüzeysel duygular, teatrallik ve kolay etkilenme tabloyu tamamlar; manik dönem öyküsü yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "narcissistic_pd",
                    "reason": "Aradığı şey üstünlük ve hayranlık değil, ne pahasına olursa olsun ilgidir; büyüklenmecilik ve ayrıcalık beklentisi tarif edilmiyor."
                },
                {
                    "diagnosisId": "borderline_pd",
                    "reason": "Duygusal değişkenlik var, ancak kendine zarar verme, kronik boşluk ve terk edilme dehşeti yoktur; duygular derin değil yüzeyseldir."
                },
                {
                    "diagnosisId": "bipolar_1",
                    "reason": "Abartılı ve dışa dönük tavır epizodik değil, kişiliğin kalıcı bir özelliğidir ve manik dönem öyküsü yoktur."
                }
            ],
            "teachingPoint": "Histriyonik kişilikte duygular yoğun görünür ama yüzeyseldir ve hızla değişir; amaç ilgiyi kendinde tutmaktır."
        }
    },
    {
        "id": "case-036",
        "caseNumber": 36,
        "difficulty": "Orta",
        "course": "FORENSIC",
        "diagnosisId": "paranoid_pd",
        "category": "PERSONALITY_A",
        "patientSummary": "45 yaşında, erkek, güvenlik amiri",
        "clues": [
            "Danışan, iş yerindeki meslektaşlarının kendisinin arkasından gizli planlar yaptığını, bilgisayarına casus yazılım yüklediklerini ve komşularının arabasını bilerek çizdiğini iddia ederek sürekli savcılığa ve polise şikayet dilekçeleri yazmaktadır.",
            "Eşinin kendisini aldattığına dair hiçbir somut kanıt olmamasına rağmen, eşinin telefonunu gizlice klonlamış, çantasına ses kayıt cihazı yerleştirmiş ve sürekli sadakatini sorgulamaktadır.",
            "Yıllar önce bir arkadaşının yaptığı ufak bir şakayı asla unutmamış, 'Bana yapılan kötülüğü mezara kadar affetmem' diyerek derin kin beslemektedir.",
            "Madde kullanımı yoktur, nörolojik taramalar temizdir; sabit ve bizar bir şizofrenik hezeyan saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Aşırı tetikte (hipervijilant), kuşkucu, soğuk ve mesafeli tutum. Başkalarının masum sözlerinden kendisine yönelik gizli tehdit ve aşağılama anlamları çıkarma eğilimi.",
            "DSM-5'e göre: Başkalarının niyetlerini kötü niyetli olarak yorumlama, erken erişkinlikte başlayan yaygın bir güvensizlik ve kuşkuculuk örüntüsüdür."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "arkasından gizli planlar yaptığını",
                "dsmMatch": "DSM-5 Kriter 1: Yeterli bir temel olmaksızın başkalarının kendisini sömürdüğünden/aldattığından kuşkulanma"
            },
            {
                "clueIndex": 1,
                "text": "sürekli sadakatini sorgulamaktadır",
                "dsmMatch": "DSM-5 Kriter 7: Eşinin/partnerinin sadakati konusunda haksız yere yineleyen kuşkular duyma"
            },
            {
                "clueIndex": 2,
                "text": "asla unutmamış",
                "dsmMatch": "DSM-5 Kriter 5: Sürekli kin besleme; aşağılanma/kötülükleri bağışlamama"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Destekleyici Bilişsel Terapi",
            "therapyDetails": "Terapötik güveni dikkatle kurma (aşırı samimiyetten kaçınma), alternatif açıklamalar geliştirme ve tehdit algısını sorgulama.",
            "pharmacologyNote": "Aşırı ajitasyon veya kuşkuculuk ataklarında düşük doz antipsikotik yardımcı olabilir."
        },
        "miniQuiz": {
            "question": "Paranoid Kişilik Bozukluğu ile Sanrılı Bozukluk (Paranoid Tip) arasındaki fark nedir?",
            "options": [
                "Sanrılı bozuklukta sarsılmaz, sabit ve net bir hezeyan vardır; Paranoid Kişilik Bozukluğunda ise tüm hayata yayılmış genel bir kuşkuculuk ve güvensizlik karakter yapısı bulunur.",
                "Paranoid kişilik bozukluğunda hasta herkesi çok sever.",
                "Sanrılı bozukluk sadece 1 hafta sürer.",
                "İki hastalık tamamen aynıdır."
            ],
            "correctIndex": 0,
            "explanation": "Sanrılı bozuklukta spesifik ve sabit bir hezeyan (delüzyon) vardır. Paranoid KB'de ise spesifik tek bir sanrı yerine hayatın her alanına yayılmış genel bir güvensizlik ve alınganlık karakter özelliği hakimdir."
        },
        "differentialDiagnosis": "• Sanrılı Bozukluk: Sabit ve net sanrılar vardır. Paranoid KB'de ise genel kuşkuculuk vardır.\n• Şizotipal KB: Büyüsel düşünce ve tuhaflıklar Paranoid KB'de görülmez.",
        "dsmCriteriaSummary": "DSM-5 (En az 4/7): Zarar göreceğinden kuşkulanma, sadakatten şüphe duyma, sır vermekten korkma, masum sözlerden tehdit çıkarma, kin besleme, saldırılara öfkeyle karşılık verme, partner sadakatini haksız yere sorgulama.",
        "therapyId": "schema_therapy",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Meslektaşlarının gizli plan yaptığı ve komşularının arabasını bilerek çizdiği şüphesi, yeterli dayanak olmadan zarar görme beklentisidir.",
                "Eşinin sadakatini kanıt olmadan sürekli sorgulaması ve yıllar önceki bir şakayı affetmemesi kin tutma ve yinelenen haksız kuşkuculuk ölçütleridir.",
                "Masum sözlerden gizli aşağılama anlamı çıkarması, örüntünün yaygın ve uzun süreli olduğunu gösterir; sabit, bizar bir sanrı saptanmamıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "delusional_disorder",
                    "reason": "Kuşkular tek bir sabit sanrıya odaklanmak yerine birçok kişiye yayılıyor; ancak eşin aldattığı inancı sarsılmaz kesinliğe ulaşmışsa kıskançlık tipi sanrılı bozukluk ayrıca değerlendirilmelidir."
                },
                {
                    "diagnosisId": "schizophrenia",
                    "reason": "Varsanı, dezorganizasyon ve negatif belirti yoktur; işlevsellik korunmaktadır."
                },
                {
                    "diagnosisId": "schizotypal_pd",
                    "reason": "Büyüsel düşünce, tuhaf algısal deneyimler ve eksantrik davranış tarif edilmiyor."
                }
            ],
            "teachingPoint": "Paranoid kişilik ile sanrılı bozukluk arasındaki çizgi inancın kesinliğidir: kuşku sorgulanabiliyorsa kişilik, sarsılmaz kesinlikteyse sanrı düşünülür."
        }
    },
    {
        "id": "case-037",
        "caseNumber": 37,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "trichotillomania",
        "category": "OCD_RELATED",
        "patientSummary": "21 yaşında, kadın, üniversite öğrencisi",
        "clues": [
            "Danışan, ders çalışırken veya televizyon izlerken istemsizce sol şakağındaki saç telleriyle oynayıp kökünden kopardığını, kafasında bozuk para büyüklüğünde belirgin kellikler (alopesi) oluştuğu için sürekli peruk takmak zorunda kaldığını anlatıyor.",
            "Saçını çekip koparmadan hemen önce içinde yoğun bir gerilim ve karşı konulamaz bir kaşıntı/çekme hissi olduğunu; kopardığı o anda ise derin bir rahatlama duyduğunu ifade ediyor.",
            "Koparma davranışını durdurmak için defalarca eldiven takmayı, tırnaklarını kesmeyi denemiş ancak her seferinde başarısızlıkla sonuçlanmıştır.",
            "Dermatolojik muayenede alopesi areata veya mantar enfeksiyonu gibi organik saç dökülmesi patolojileri dışlanmıştır.",
            "Ruhsal Durum Muayenesinde: Beden odaklı tekrarlayıcı dürtüsel davranış, yoğun utanç ve saç kelliklerini gizleme çabaları saptanmıştır.",
            "DSM-5'e göre: Saç kaybıyla sonuçlanan, kişinin yineleyici biçimde saçını yolması ve saç yolmayı azaltma ya da durdurmaya yönelik yineleyen girişimlerin başarısız olması tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "kafasında bozuk para büyüklüğünde belirgin kellikler",
                "dsmMatch": "DSM-5 Kriter A: Saç kaybıyla sonuçlanan yineleyici saç yolma"
            },
            {
                "clueIndex": 2,
                "text": "durdurmak için defalarca",
                "dsmMatch": "DSM-5 Kriter B: Saç yolmayı azaltma ya da durdurma girişimlerinin başarısız olması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Alışkanlığı Tersine Çevirme Eğitimi (HRT / Habit Reversal Training)",
            "therapyDetails": "Farkındalık eğitimi (koparma dürtüsünü anlama), yarışan tepki geliştirme (elleri yumruk yapıp tutma, stres topu sıkma) ve uyaran kontrolü.",
            "pharmacologyNote": "N-Asetilsistein (NAC) glutamat modülasyonu ile dürtüyü azaltmada kanıtlıdır; SSRI'lar komorbid durumlarda eklenir."
        },
        "miniQuiz": {
            "question": "Trikotillomani tedavisinde en yüksek kanıt düzeyine sahip davranışçı psikoterapi tekniği hangisidir?",
            "options": [
                "Alışkanlığı Tersine Çevirme Eğitimi (Habit Reversal Training - HRT)",
                "EMDR Terapisi",
                "Psikanalitik Serbest Çağrışım",
                "Elektrokonvülsif Terapi (EKT)"
            ],
            "correctIndex": 0,
            "explanation": "Alışkanlığı Tersine Çevirme Eğitimi (HRT), beden odaklı tekrarlayıcı davranışlarda (saç yolma, deri yolma, tırnak yeme) altın standart davranışçı terapi protokolüdür."
        },
        "differentialDiagnosis": "• Alopesi Areata: Otoimmün saç dökülmesidir, yolma davranışı yoktur.\n• Beden Algısı Bozukluğu (BDD): Saç kusurlu bulunduğu için düzeltme amacıyla çekilir; Trikotillomanide ise amaç gerginliği dindirmektir.",
        "dsmCriteriaSummary": "DSM-5: Saç kaybına yol açan yineleyici saç yolma + Durdurmaya yönelik başarısız girişimler + Klinik belirgin sıkıntı/işlev kaybı.",
        "therapyId": "hrt",
        "pharmacologyId": "clomipramine_ocd",
        "explanation": {
            "whyThis": [
                "Şakaktaki saçları tekrar tekrar kökünden koparması belirgin saç kaybına (kellik alanları, peruk ihtiyacı) yol açmıştır.",
                "Eldiven ve tırnak kesme gibi yöntemlerle davranışı durdurma girişimleri defalarca başarısız olmuştur.",
                "Koparmadan önce gerilim, koparınca rahatlama ve ders çalışma, televizyon gibi pasif anlarda ortaya çıkması beden odaklı tekrarlayıcı davranışa uyar; alopesi areata ve mantar enfeksiyonu dışlanmıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "bdd",
                    "reason": "Saçı kusurlu bulup düzeltmek için değil, gerilimi boşaltmak için yoluyor; kellik onun için davranışın sonucudur, nedeni değil."
                },
                {
                    "diagnosisId": "ocd",
                    "reason": "Yolmayı başlatan bir obsesyon ya da korkulan bir sonuç yoktur; davranış hazza yakın bir rahatlamayla biter."
                },
                {
                    "diagnosisId": "excoriation",
                    "reason": "Hedef deri değil saçtır; aynı ailede yer alan iki tanıyı davranışın yöneldiği bölge ayırır."
                }
            ],
            "teachingPoint": "Trikotillomanide amaç görünümü düzeltmek değil gerilimi boşaltmaktır; amaç görünümü düzeltmekse BDD düşünülmelidir."
        }
    },
    {
        "id": "case-038",
        "caseNumber": 38,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "excoriation",
        "category": "OCD_RELATED",
        "patientSummary": "27 yaşında, kadın, halkla ilişkiler sorumlusu",
        "clues": [
            "Danışan, kollarındaki ve yüzündeki en ufak bir sivilceyi, kabuk bağlamış yarayı veya cilt pürüzünü tırnaklarıyla saatlerce kazıyıp yolduğunu, kanamasına ve derin izler kalmasına rağmen kendini durduramadığını belirterek başvuruyor.",
            "Aynanın karşısında günde ortalama 2-3 saatini cilt lezyonlarını sıkmak ve tırnaklamakla geçirmekte, oluşan açık yaralar nedeniyle yaz aylarında bile uzun kollu gömlekler giymektedir.",
            "Deri yolma eylemini azaltmak için tırnak protezi yaptırma, yara bandı yapıştırma gibi birçok girişimde bulunmuş ancak gerginlik anlarında tekrar başladığı öğreniliyor.",
            "Dermatolojik değerlendirmede primer bir pruritus (kaşıntı) veya uyuz/egzama saptanmamıştır; kokain/amfetamin gibi madde kullanımına bağlı kaşıntı dışlanmıştır.",
            "Ruhsal Durum Muayenesinde: Beden odaklı dürtü kontrol güçlüğü, anksiyete regülasyonunda çöküş ve derin suçluluk hissi.",
            "DSM-5'e göre: Deride lezyonlara yol açan, yineleyici biçimde derisini yolma ve bunu durdurmaya yönelik başarısız girişimler mevcuttur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "kanamasına ve derin izler kalmasına rağmen",
                "dsmMatch": "DSM-5 Kriter A: Deri lezyonlarıyla sonuçlanan yineleyici deri yolma"
            },
            {
                "clueIndex": 2,
                "text": "azaltmak için",
                "dsmMatch": "DSM-5 Kriter B: Deri yolmayı azaltma ya da durdurmaya yönelik yinelenen başarısız girişimler"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Alışkanlığı Tersine Çevirme Eğitimi (HRT) & Kabul ve Kararlılık Terapisi (ACT)",
            "therapyDetails": "Tetikleyici durumları (ayna karşısında kalma süresi) sınırlama, parmak uçlarına koruyucu takma ve dürtüye yer açma becerileri.",
            "pharmacologyNote": "N-Asetilsistein (NAC) ve SSRI grubu ilaçlar klinik pratikte etkilidir."
        },
        "miniQuiz": {
            "question": "Deri Yolma (Ekskoriasyon) Bozukluğu tanısı koyarken hangi tıbbi/madde durumu mutlaka dışlanmalıdır?",
            "options": [
                "Uyarıcı madde (kokain/amfetamin) intoksikasyonuna bağlı formikasyon (deride böcek yürüyor hissi) ve dermatolojik uyuz/egzama",
                "Katarakt ameliyatı öyküsü",
                "Hipertansiyon ilacı kullanımı",
                "B12 vitamini fazlalığı"
            ],
            "correctIndex": 0,
            "explanation": "Kokain/amfetamin kullanımı 'formikasyon' denen deride böcek geziniyor hissine ve ağır deri yolmaya yol açabilir; organik dışlama şarttır."
        },
        "differentialDiagnosis": "• Beden Algısı Bozukluğu (BDD): BDD'de amaç algılanan cilt kusurunu düzeltmektir; Ekskoriasyonda ise dürtüsel gerilim boşaltma hakimdir.\n• Maddeye Bağlı Kaşıntı: Toksikoloji temizdir.",
        "dsmCriteriaSummary": "DSM-5: Deri lezyonlarına yol açan yineleyici deri yolma + Durdurma girişimlerinde başarısızlık + Belirgin sıkıntı/işlevsellik kaybı.",
        "therapyId": "hrt",
        "pharmacologyId": "clomipramine_ocd",
        "explanation": {
            "whyThis": [
                "Sivilce, kabuk ve pürüzleri saatlerce tırnaklayarak kanama ve kalıcı izlere yol açması, deri lezyonlarıyla sonuçlanan yineleyici yolma davranışıdır.",
                "Tırnak protezi ve yara bandı gibi durdurma girişimleri başarısız olmuştur.",
                "Günde 2-3 saat kaybı ve yazın uzun kol giyme sıkıntı ve işlev kaybını gösterir; egzama, uyuz ve uyarıcı kullanımına bağlı kaşıntı dışlanmıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "bdd",
                    "reason": "Davranış algılanan bir görünüm kusurunu düzeltme isteğinden değil gerginlik anlarında dürtüsel olarak ortaya çıkar; yine de yolmanın amacı mutlaka sorulmalıdır."
                },
                {
                    "diagnosisId": "factitious_disorder",
                    "reason": "Yaralar hasta rolü kazanmak için bilerek üretilmiyor; kişi onları gizlemeye çalışıyor."
                },
                {
                    "diagnosisId": "trichotillomania",
                    "reason": "Davranış saç ya da kıla değil deriye yöneliktir."
                }
            ],
            "teachingPoint": "Beden odaklı tekrarlayıcı davranışlarda (saç ve deri yolma) tanı için hem fiziksel hasar hem de durdurma girişimlerinin başarısız olması aranır."
        }
    },
    {
        "id": "case-039",
        "caseNumber": 39,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "acute_stress_disorder",
        "category": "TRAUMA",
        "patientSummary": "35 yaşında, erkek, taksi şoförü",
        "clues": [
            "Danışan, 10 gün önce ölümcül bir zincirleme trafik kazasından sağ kurtulduktan sonra; gözlerini her kapattığında kaza anındaki çığlıkları ve patlayan cam seslerini duyduğunu (istilacı anılar), kalbinin çarptığını ve ellerinin titrediğini anlatıyor.",
            "Kazadan beri geçen 10 gün boyunca olayı sanki bir sis perdesinin arkasından veya bedeninin dışından izliyormuş gibi hissettiğini (dissosiyatif belirtiler) ve kazanın tam çarpışma anını bir türlü hatırlayamadığını (amnezi) ifade ediyor.",
            "Araba koltuğuna dahi oturamamakta, televizyondaki kaza haberlerini anında kapatmakta ve sürekli kapıyı kilitleyip aşırı tetikte (hipervijilans) beklemektedir.",
            "Olayın üzerinden henüz sadece 10 gün geçmiştir.",
            "Ruhsal Durum Muayenesinde: Akut uyarılmışlık, irkilme tepkisi, duygusal uyuşukluk ve intrüzif flashbackler.",
            "DSM-5'e göre: Ağır travmatik bir olaya maruz kaldıktan sonra 3 gün ile 1 ay arasında süren istilacı anılar, dissosiyasyon, kaçınma ve uyarılmışlık belirtileri mevcuttur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 3,
                "text": "Olayın üzerinden henüz sadece 10 gün geçmiştir",
                "dsmMatch": "DSM-5 Kriter B: Bozukluğun süresi travmadan sonra 3 gün ile 1 ay arasındadır"
            },
            {
                "clueIndex": 1,
                "text": "olayı sanki bir sis perdesinin arkasından",
                "dsmMatch": "DSM-5 Dissosiyatif Belirtiler: Çevrenin ya da kendisinin gerçekliğinin değiştiğine ilişkin duygular"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Travma Odaklı BDT & Erken Müdahale Psikoeğitimi",
            "therapyDetails": "Travmatik anıyı güvenli ortamda yapılandırma, normalleştirme, nefes kontrolü ve kaçınmaları önleme.",
            "pharmacologyNote": "Uykusuzluk ve aşırı uyarılmışlık için kısa süreli semptomatik destek; profilaktik benzodiazepin önerilmez (travma işlemlenmesini bozabilir)."
        },
        "miniQuiz": {
            "question": "Bu taksi şoförünün belirtileri kazadan sonraki 45. günde de aynı şiddette devam ederse tanı neye dönüşür?",
            "options": [
                "Travma Sonrası Stres Bozukluğu (TSSB / PTSD)",
                "Uyum Bozukluğu",
                "Panik Bozukluk",
                "Kısa Psikotik Bozukluk"
            ],
            "correctIndex": 0,
            "explanation": "Akut Stres Bozukluğu süresi travma sonrası 3 gün ile 1 ay arasındadır. Belirtiler 1 ayı aştığı anda tanı otomatik olarak Travma Sonrası Stres Bozukluğu (TSSB) olur."
        },
        "differentialDiagnosis": "• TSSB: Belirtiler 1 aydan uzun sürmelidir. Bu vakada henüz 10. gündür.\n• Uyum Bozukluğu: Travmatik ölüm tehlikesi yerine yaşam stresörlerine (boşanma, iflas) yanıttır.",
        "dsmCriteriaSummary": "DSM-5: Travmatik olaya maruz kalma + İstilacı anılar, olumsuz duygudurum, dissosiyasyon, kaçınma ve uyarılmışlık belirtilerinden en az 9'u. Süre: 3 gün - 1 ay.",
        "therapyId": "emdr",
        "pharmacologyId": "hydroxyzine_buspirone",
        "explanation": {
            "whyThis": [
                "Ölümcül zincirleme kazadan sağ kurtulmak gerçek ölüm tehdidine maruz kalmadır.",
                "İstemsiz anılar, kendini dışarıdan izleme ve çarpışma anını hatırlayamama, araçtan ve haberlerden kaçınma ile aşırı tetikte olma birçok belirti kümesini kapsar.",
                "Olayın üzerinden 10 gün geçmiştir; belirtiler üç gün ile bir ay arasındaki zaman penceresindedir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "ptsd",
                    "reason": "TSSB tanısı için belirtilerin bir aydan uzun sürmesi gerekir; burada yalnızca 10 gün geçmiştir. Bir ay sonra sürerse tanı TSSB'ye dönüşür."
                },
                {
                    "diagnosisId": "depersonalization_derealization",
                    "reason": "Yabancılaşma deneyimi travmanın hemen ardından ve yeniden yaşantılamayla birlikte ortaya çıkmıştır; bağımsız bir dissosiyatif bozukluk değildir."
                },
                {
                    "diagnosisId": "panic_disorder",
                    "reason": "Çarpıntı ve titreme beklenmedik ataklar değil, travma anılarıyla tetiklenen tepkilerdir."
                }
            ],
            "teachingPoint": "Akut stres bozukluğu ile TSSB'yi aynı belirtiler değil zaman ayırır: travmadan sonra 3 gün-1 ay ASB, bir aydan sonra TSSB."
        }
    },
    {
        "id": "case-040",
        "caseNumber": 40,
        "difficulty": "Kolay",
        "course": "ADULT",
        "diagnosisId": "adjustment_disorder",
        "category": "TRAUMA",
        "patientSummary": "31 yaşında, kadın, bankacı",
        "clues": [
            "Danışan, 2 ay önce 6 yıllık evliliğinin anlaşmalı boşanma ile sona ermesinin ardından; sürekli ağlama isteği, işe konsantre olamama, geleceğe dair karamsarlık ve hafif uyku bozuklukları yaşadığını belirterek başvuruyor.",
            "İş yerindeki performansının boşanma sonrası düştüğünü ancak yataktan çıkamayacak veya ağır intihar düşünceleri geliştirecek düzeyde tam bir majör depresyon tablosunun OLMADIĞINI belirtiyor.",
            "Belirtiler boşanma kararından tam 1 ay sonra başlamış olup, danışanın baş etme kapasitesini aşan bir uyum güçlüğü sergilediği gözleniyor.",
            "Tıbbi tetkikler ve tiroid testleri tamamen normaldir.",
            "Ruhsal Durum Muayenesinde: Reaktif hüzün, durumsal anksiyete; psikotik öğe, intihar planı veya anhedoni yoktur.",
            "DSM-5'e göre: Belirlenebilir bir ya da birden fazla stresöre (boşanma) yanıt olarak, stresörün başlamasından sonraki 3 ay içinde ortaya çıkan duygusal ya da davranışsal belirtiler mevcuttur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 2,
                "text": "boşanma kararından tam 1 ay sonra başlamış olup",
                "dsmMatch": "DSM-5 Kriter A: Stresörün ortaya çıkmasından sonraki 3 ay içinde gelişme"
            },
            {
                "clueIndex": 1,
                "text": "tam bir majör depresyon tablosunun OLMADIĞINI",
                "dsmMatch": "DSM-5 Kriter C: Başka bir ruhsal bozukluğun ölçütlerini tam karşılamaz"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Problem Çözme Terapisi & Destekleyici Psikoterapi",
            "therapyDetails": "Yeni yaşam koşullarına adaptasyon, başa çıkma stratejilerini güçlendirme ve sosyal destek kaynaklarını harekete geçirme.",
            "pharmacologyNote": "Genellikle ilaç tedavisi gerekmez; çok şiddetli durumsal uykusuzlukta kısa süreli destek verilebilir."
        },
        "miniQuiz": {
            "question": "Uyum Bozukluğu tanısı için stresörün (örn. boşanma, iflas) başlamasından sonra belirtilerin en geç ne kadar süre içinde ortaya çıkması şarttır?",
            "options": [
                "En geç 3 ay içinde",
                "En geç 1 yıl içinde",
                "Aynı gün içinde",
                "En az 6 ay sonra"
            ],
            "correctIndex": 0,
            "explanation": "DSM-5'e göre Uyum Bozukluğunda duygusal/davranışsal belirtiler stresörün ortaya çıkmasından sonraki ilk 3 ay içinde başlamalıdır."
        },
        "differentialDiagnosis": "• Majör Depresif Bozukluk: Majör depresyon kriterleri tam karşılanıyorsa öncelikli tanı MDD olur.\n• TSSB: Yaşamı tehdit eden ağır travma (ölüm tehdidi) gerektirir; boşanma yaşam stresörüdür.",
        "dsmCriteriaSummary": "DSM-5: Stresörden sonraki 3 ay içinde ortaya çıkan duygusal/davranışsal belirtiler + Stresörün ağırlığıyla orantısız sıkıntı veya işlev kaybı.",
        "therapyId": "ipt",
        "pharmacologyId": "hydroxyzine_buspirone",
        "explanation": {
            "whyThis": [
                "Belirtiler belirli bir stresörden, boşanmadan bir ay sonra, yani üç aylık pencerenin içinde başlamıştır.",
                "Ağlama isteği, karamsarlık, konsantrasyon güçlüğü ve iş performansında düşüş stresörün beklenen etkisinden fazla sıkıntı ve işlev kaybını gösterir.",
                "Anhedoni, ağır intihar düşüncesi ve psikotik öğe yoktur; tablo majör depresyon ölçütlerine ulaşmıyor."
            ],
            "whyNot": [
                {
                    "diagnosisId": "mdd",
                    "reason": "Anhedoni yoktur ve belirti sayısı ile şiddeti majör depresif epizod eşiğine ulaşmıyor; ulaşsaydı stresör olsa bile MDD tanısı konurdu."
                },
                {
                    "diagnosisId": "ptsd",
                    "reason": "Boşanma, yaşamı tehdit eden travmatik bir olay değildir ve yeniden yaşantılama ya da kaçınma belirtileri yoktur."
                },
                {
                    "diagnosisId": "prolonged_grief_disorder",
                    "reason": "Uzatılmış yas yakın birinin ölümünden sonra en az 12 ay süren bir yas tepkisidir; burada kayıp bir boşanmadır ve süre iki aydır."
                }
            ],
            "teachingPoint": "Uyum bozukluğu ‘artık’ bir tanıdır: stresöre yanıt olan tablo başka bir bozukluğun ölçütlerini karşılıyorsa o tanı öncelik kazanır."
        }
    },
    {
        "id": "case-041",
        "caseNumber": 41,
        "difficulty": "Kolay",
        "course": "ADULT",
        "diagnosisId": "binge_eating",
        "category": "EATING",
        "patientSummary": "33 yaşında, erkek, lojistik müdürü (BKİ: 32 kg/m² - Obez)",
        "clues": [
            "Danışan son 5 aydır haftada en az 2-3 kez gece yalnızken kontrolünü tamamen kaybederek, fiziki olarak aç olmadığı halde patlayacak kadar doyana kadar çok hızlı bir şekilde devasa miktarda yemek yediğini (tıkınma nöbetleri) anlatıyor.",
            "Yeme atağı sonrasında kendisinden tiksinme, derin bir depresif çöküş ve utanç duymakta, bu yüzden tüm paketleri kimse görmesin diye evin dışındaki çöp konteynerine atmaktadır.",
            "Önemli ve kritik ayırıcı özellik: Yediği binlerce kaloriden sonra kesinlikle parmağıyla kendini KUSTURMAMAKTA, laksatif/müshil KULLANMAMAKTA veya aşırı telafi edici egzersiz YAPMAMAKTADIR.",
            "Kan tahlillerinde insülin direnci ve hafif karaciğer yağlanması tespit edilmiştir.",
            "Ruhsal Durum Muayenesinde: Yeme dürtüsü üzerinde kontrol kaybı algısı, duygusal boşluğu yemekle doldurma şeması ve obeziteye bağlı beden memnuniyetsizliği.",
            "DSM-5'e göre: Yineleyen tıkınırcasına yeme nöbetleri bulunması ve bu nöbetlerin Bulimiya Nervoza'da olduğu gibi uygunsuz telafi edici davranışlarla (kusma vb.) birlikte gitmemesi tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "kontrolünü tamamen kaybederek",
                "dsmMatch": "DSM-5 Kriter A: Yineleyen tıkınırcasına yeme nöbetleri (yeme kontrolünü kaybetme hissi)"
            },
            {
                "clueIndex": 2,
                "text": "kesinlikle parmağıyla kendini KUSTURMAMAKTA, laksatif/müshil KULLANMAMAKTA",
                "dsmMatch": "DSM-5 Kriter D: Yineleyen uygunsuz ödünleyici (telafi edici) davranışların olmaması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi (Yeme Bozuklukları için CBT-E)",
            "therapyDetails": "Düzenli öğün planlama, duygusal tetikleyicileri (stres, yalnızlık) tanıma ve yeme dışı regülasyon mekanizmaları kurma.",
            "pharmacologyNote": "Lisdeksamfetamin (FDA onaylı) veya SSRI'lar tıkınma dürtülerini azaltmada etkilidir."
        },
        "miniQuiz": {
            "question": "Tıkınırcasına Yeme Bozukluğu (BED) ile Bulimiya Nervoza arasındaki en temel klinik ayrım nedir?",
            "options": [
                "Bulimiya'da tıkınma sonrası kusma, laksatif veya aşırı spor gibi telafi edici davranışlar vardır; BED'de ise bu telafi edici eylemler kesinlikle görülmez.",
                "BED sadece kadınlarda görülür.",
                "Bulimiyada hastalar hiçbir zaman tıkınmaz.",
                "BED hastalarında kilo kaybı görülür."
            ],
            "correctIndex": 0,
            "explanation": "BED hastaları tıpkı bulimikler gibi kontrolsüzce tıkınırlar ANCAK asla kusma, laksatif veya telafi edici aç kalma döngüsüne girmezler."
        },
        "differentialDiagnosis": "• Bulimiya Nervoza: Telafi edici kusma/laksatif vardır; BED'de yoktur.\n• Anoreksiya Nervoza: Anoreksiyada belirgin düşük kilo (BKİ < 18.5) zorunludur; BED'de hastalar genelde aşırı kilolu/obezdir.",
        "dsmCriteriaSummary": "DSM-5: Yineleyen tıkınma nöbetleri (en az 3 ay, haftada ≥ 1) + Hızlı yeme, patlayana kadar yeme, aç olmadan yeme, suçluluk + Telafi edici kusma/laksatif OLMAMASI.",
        "therapyId": "cbt_e",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Aç olmadan, hızlı ve rahatsız edecek kadar dolana kadar, gizlice yeme; kontrol kaybıyla giden tıkınma nöbetlerinin tipik özellikleridir.",
                "Nöbetler beş aydır haftada 2-3 kez tekrarlamakta, ardından tiksinme, utanç ve çökkünlük gelmektedir.",
                "Kusma, laksatif ya da aşırı egzersiz gibi düzenli telafi davranışı yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "bulimia_nervosa",
                    "reason": "Tıkınma nöbetlerinin ardından kusma, laksatif ya da aşırı egzersiz gibi telafi davranışları yoktur."
                },
                {
                    "diagnosisId": "mdd",
                    "reason": "Nöbet sonrası çökkünlük vardır, ancak iki hafta boyunca süren bir depresif epizod tarif edilmiyor; tablo yeme davranışı etrafında örgütlenmiştir."
                },
                {
                    "diagnosisId": "other_specified_feeding",
                    "reason": "Nöbet sıklığı ve süresi tam tanı eşiğini (en az üç ay, haftada en az bir) aştığı için ‘belirlenmiş diğer’ kategorisi gerekmez."
                }
            ],
            "teachingPoint": "Tıkınırcasına yeme bozukluğunu bulimiyadan ayıran tek temel ölçüt, düzenli telafi davranışının yokluğudur; obezite tanı ölçütü değildir."
        }
    },
    {
        "id": "case-042",
        "caseNumber": 42,
        "difficulty": "Orta",
        "course": "CHILD",
        "diagnosisId": "pica",
        "category": "EATING",
        "patientSummary": "7 yaşında, erkek, ilkokul öğrencisi",
        "clues": [
            "Danışan, son 4 aydır okul bahçesindeki kurumuş toprakları, tebeşirleri, duvar boyası döküntülerini ve kurşun kalem silgilerini gizlice ağzına atıp yediği sınıf öğretmeni tarafından fark edilerek ailesine bildirilmiştir.",
            "Bu davranışın gelişimsel olarak 2 yaş altındaki bebeklik dönemi oral keşif sürecinin çok ötesinde olduğu ve çocuğun kültürel veya dini bir ritüelin parçası olarak bunu yapmadığı saptanmıştır.",
            "Çocukta yapılan tam kan sayımında ağır demir eksikliği anemisi (Ferritin: 4 ng/mL) tespit edilmiştir.",
            "Zeka ve gelişim testleri yaş grubuna uygundur; otizm spektrum bulgusu yoktur.",
            "Ruhsal Durum Muayenesinde: Besin değeri olmayan maddelere karşı kompulsif aşerme, demir eksikliği tedavisiyle eşzamanlı davranışsal takip gerekliliği.",
            "DSM-5'e göre: En az 1 aylık bir süre boyunca, besin değeri olmayan, besin niteliğinde olmayan maddeleri sürekli olarak yeme davranışıdır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "kurumuş toprakları, tebeşirleri, duvar boyası döküntülerini",
                "dsmMatch": "DSM-5 Kriter A: En az 1 ay süreyle besin değeri olmayan maddeleri sürekli yeme"
            },
            {
                "clueIndex": 1,
                "text": "gelişimsel olarak 2 yaş altındaki bebeklik dönemi",
                "dsmMatch": "DSM-5 Kriter B: Bireyin gelişimsel düzeyiyle uyumlu değildir"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Uygulamalı Davranış Analizi (ABA) & Çevresel Düzenleme",
            "therapyDetails": "Yenmeyen maddelere erişimi kısıtlama, alternatif duyusal uyarım sağlama ve pekiştirme tarifeleri.",
            "pharmacologyNote": "Altta yatan demir veya çinko eksikliği biyokimyasal olarak hızla replase edilmelidir."
        },
        "miniQuiz": {
            "question": "Pika tanısı koyarken hangi yaş sınırı gelişimsel normallik açısından göz önünde bulundurulmalıdır?",
            "options": [
                "2 yaşın altındaki bebeklerde nesneleri ağıza alma normal bir oral keşif sürecidir; Pika tanısı 2 yaş sonrasında konur.",
                "Pika sadece 65 yaş üzerinde konabilir.",
                "Pika bebeklikte normal kabul edilmez, 6 aylıkken tanı konur.",
                "Yaş sınırının hiçbir önemi yoktur."
            ],
            "correctIndex": 0,
            "explanation": "Bebekler ilk 18-24 ayda dünyayı ağızlarıyla keşfederler. Pika tanısı için çocuğun gelişimsel olarak yenmeyen maddeleri ayırt edebileceği yaşta (genellikle > 2 yaş) olması gerekir."
        },
        "differentialDiagnosis": "• Otizm Spektrum Bozukluğu: OSB'de duyusal arayış sonucu pika görülebilir; ancak bu vakada otizm bulgusu yoktur.\n• Anoreksiya Nervoza: Kalori almamak için peçete yeme gibi durumlardan ayrılmalıdır.",
        "dsmCriteriaSummary": "DSM-5: En az 1 ay süren besin değeri olmayan maddeleri yeme + Gelişimsel düzeye uygun olmama + Kültürel/dini uygulamanın parçası olmama.",
        "therapyId": "pmt",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Toprak, tebeşir, boya ve silgi gibi besin değeri olmayan maddeleri dört aydır yemesi en az bir aylık süre ölçütünü karşılar.",
                "Yedi yaşında bu davranış gelişim düzeyine uygun değildir ve kültürel ya da dini bir uygulamanın parçası değildir.",
                "Ağır demir eksikliği anemisi pika ile sık birlikte görülen, tıbbi değerlendirme gerektiren bir bulgudur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "asd",
                    "reason": "Gelişim ve sosyal iletişim yaşına uygundur, otizm bulgusu yoktur; bu durumda pika ayrı bir tanı olarak konur."
                },
                {
                    "diagnosisId": "intellectual_disability_mild",
                    "reason": "Zeka ve gelişim testleri yaşına uygundur."
                },
                {
                    "diagnosisId": "arfid",
                    "reason": "Sorun normal yiyecekleri kısıtlamak değil, yiyecek olmayan maddeleri yemektir."
                }
            ],
            "teachingPoint": "Pika tanısında yaş ve bağlam kritiktir: davranış gelişim düzeyine uygun olmamalı ve kültürel olarak kabul görmüş bir uygulama olmamalıdır."
        }
    },
    {
        "id": "case-043",
        "caseNumber": 43,
        "difficulty": "Zor",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "somatic_symptom_disorder",
        "category": "SOMATIC",
        "patientSummary": "41 yaşında, kadın, terzi",
        "clues": [
            "Danışan son 3 yıldır şiddetli kronik sırt ağrısı, karında şişkinlik, bacaklarda yanma ve yutma güçlüğü gibi vücudunun farklı yerlerindeki fiziksel şikayetler nedeniyle 12 farklı branş hekimine başvurmuştur.",
            "Fiziksel semptomlar kişide dayanılmaz derecede sıkıntı yaratmakta ve gününün neredeyse tümünü 'Ağrım bugün nerede çıkacak, vücudum iflas mı ediyor?' endişesiyle geçirmektedir.",
            "Tüm dahiliye, romatoloji, gastroenteroloji ve nöroloji taramalarında semptomları tam açıklayacak organik bir doku hasarı bulunamamıştır.",
            "Önemli ayırıcı klinik özellik: Hasta Hastalık Kaygısı Bozukluğu'ndaki gibi 'hastalık kapmaktan' değil; bizzat 'vücudunda gerçekten hissettiği şiddetli bedensel acı ve ağrılardan' yakınmaktadır.",
            "Ruhsal Durum Muayenesinde: Bedensel duyumlara aşırı odaklanma (somatosensory amplification), felaketleştirme, aşırı zaman ve enerji harcama.",
            "DSM-5'e göre: Günlük yaşamı aksatacak düzeyde sıkıntı veren bir ya da daha fazla bedensel belirti ve bu belirtilere eşlik eden aşırı düşünce, kaygı ve davranış örüntüsüdür (≥ 6 ay)."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "şiddetli kronik sırt ağrısı, karında şişkinlik, bacaklarda yanma",
                "dsmMatch": "DSM-5 Kriter A: Sıkıntı veren ya da günlük yaşamı aksatan bir ya da daha fazla bedensel belirti"
            },
            {
                "clueIndex": 1,
                "text": "gününün neredeyse tümünü",
                "dsmMatch": "DSM-5 Kriter B: Bedensel belirtilerle ilişkili olarak aşırı zaman ve enerji harcama"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi (Somatizasyon Protokolü)",
            "therapyDetails": "Beden duyumlarını felaketleştirmeme, doktor alışverişini (doctor shopping) durdurma, işlevselliği ağrıya rağmen sürdürme ve duygusal çatışmaları ifade etme.",
            "pharmacologyNote": "Kronik ağrı komponenti için SNRI grubu (Duloksetin) veya düşük doz Trisiklik Antidepresanlar (Amitriptilin) oldukça etkilidir."
        },
        "miniQuiz": {
            "question": "Bedensel Belirti Bozukluğu ile Hastalık Kaygısı Bozukluğu (Hipokondriyazis) arasındaki en temel fark nedir?",
            "options": [
                "Bedensel Belirti Bozukluğunda hasta gerçekten belirgin fiziksel semptomlar (ağrı, yanma, şişkinlik) yaşar; Hastalık Kaygısında ise belirgin bedensel semptom yoktur, sadece 'hastalık kapma/olma düşüncesi' vardır.",
                "Hastalık kaygısı bozukluğunda hasta felç geçirir.",
                "Bedensel belirti bozukluğu sadece erkeklerde görülür.",
                "İki tanı arasında hiçbir klinik fark yoktur."
            ],
            "correctIndex": 0,
            "explanation": "Bedensel Belirti Bozukluğunda hasta gerçekten rahatsız edici fiziksel ağrılardan yakınır. Hastalık Kaygısında ise bedensel belirti ya hiç yoktur ya da çok hafiftir; kaygı soyut bir 'hasta olma korkusu'dur."
        },
        "differentialDiagnosis": "• Hastalık Kaygısı Bozukluğu: Bedensel semptom yoktur veya hafiftir.\n• Dönüşüm (Konversiyon) Bozukluğu: Spesifik nörolojik kayıp (felç, körlük, nöbet) ön plandadır.",
        "dsmCriteriaSummary": "DSM-5: Sıkıntı veren bedensel belirtiler + Belirtilere ilişkin aşırı düşünce, kaygı veya zaman/enerji harcama. Süre ≥ 6 ay.",
        "therapyId": "cbt_general",
        "pharmacologyId": "snri_dualex",
        "explanation": {
            "whyThis": [
                "Sırt ağrısı, karın şişkinliği, yanma ve yutma güçlüğü gibi gerçekten yaşanan ve sıkıntı veren bedensel belirtiler vardır.",
                "Gününün neredeyse tamamını belirtilere odaklanarak ve felaket senaryolarıyla geçirmesi, 12 hekime başvurması belirtilerle ilgili aşırı düşünce, kaygı ve davranışı gösterir.",
                "Tablo üç yıldır sürmektedir; tanı organik nedenin bulunamamasına değil, belirtilere verilen aşırı tepkiye dayanır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "illness_anxiety_disorder",
                    "reason": "Belirgin ve sıkıntı veren bedensel belirtiler vardır; hastalık kaygısında belirtiler yoktur ya da çok hafiftir."
                },
                {
                    "diagnosisId": "conversion_disorder",
                    "reason": "Felç, körlük ya da nöbet gibi nörolojik işlev kaybı değil, ağrı ve yanma gibi yaygın belirtiler vardır."
                },
                {
                    "diagnosisId": "mdd",
                    "reason": "Çoklu ağrılar depresyonla birlikte görülebilir, ancak çökkün duygudurum ve anhedoni tarif edilmiyor; bunlar ayrıca taranmalıdır."
                }
            ],
            "teachingPoint": "Bedensel belirti bozukluğu ‘açıklanamayan belirti’ tanısı değildir; belirti tıbbi olarak açıklansa bile ona verilen orantısız tepki tanıyı koydurur."
        }
    },
    {
        "id": "case-044",
        "caseNumber": 44,
        "difficulty": "Zor",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "depersonalization_derealization",
        "category": "DISSOCIATIVE",
        "patientSummary": "23 yaşında, erkek, üniversite son sınıf öğrencisi",
        "clues": [
            "Danışan, 'Aynaya baktığımda ellerim ve yüzüm bana ait değilmiş gibi geliyor; sanki bedenimin dışına çıkmışım da kendimi bir sinema filmi gibi yukarıdan izliyorum' diyerek dehşet içinde başvuruyor.",
            "Aynı zamanda dış dünyaya baktığında evlerin, sokakların ve insanların yapay, cansız, iki boyutlu bir tiyatro dekoru gibi (rüyadaymış hissi) algılandığını ifade ediyor.",
            "Önemli ve ayırt edici klinik kanıt: Bu yabancılaşma anlarında gerçeklik değerlendirmesi TAMAMEN SAĞLAMDIR ('Delirmediğimi, bunların sadece zihnimin yarattığı bir yabancılaşma hissi olduğunu biliyorum' demektedir).",
            "Kranial MRG, EEG, kan tahlilleri ve madde taraması temizdir; esrar veya sentetik kannabinoid kullanımı dışlanmıştır.",
            "Ruhsal Durum Muayenesinde: Duyarsızlaşma (depersonalizasyon) ve gerçekdışılık (derealizasyon) epizotları; otopsişik ve allopsişik oryantasyon hissi sarsılmış ancak gerçeği değerlendirme yetisi korunmuştur.",
            "DSM-5'e göre: Kendilikten kopma/yabancılaşma (depersonalizasyon) veya çevreye yabancılaşma (derealizasyon) yaşantılarının bulunması ve bu sırada gerçeklik testinin bozulmamış olması tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "kendimi bir sinema filmi gibi yukarıdan izliyorum",
                "dsmMatch": "DSM-5 Kriter 1 (Depersonalizasyon): Bedenine, duygularına veya düşüncelerine yabancılaşma/dışarıdan gözlemci olma"
            },
            {
                "clueIndex": 1,
                "text": "yapay, cansız, iki boyutlu bir tiyatro dekoru gibi",
                "dsmMatch": "DSM-5 Kriter 2 (Derealizasyon): Çevrenin gerçekdışı, rüya gibi, sisli veya cansız algılanması"
            },
            {
                "clueIndex": 2,
                "text": "gerçeklik değerlendirmesi TAMAMEN SAĞLAMDIR",
                "dsmMatch": "DSM-5 Kriter B: Bu yaşantılar sırasında gerçeği değerlendirme yetisi tam olarak korunur"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi & Topraklanma (Grounding) Teknikleri",
            "therapyDetails": "5-4-3-2-1 duyusal topraklanma egzersizleri, yabancılaşma anını felaketleştirmeyi durdurma ve bedensel duyumlara güvenli yeniden bağlanma.",
            "pharmacologyNote": "Spesifik bir ilacı yoktur; anksiyolitik amaçlı SSRI veya Lamotrijin denenebilir."
        },
        "miniQuiz": {
            "question": "Duyarsızlaşma/Yabancılaşma Bozukluğu ile Şizofreni arasındaki en kritik ayrım nedir?",
            "options": [
                "Bu bozuklukta hasta yabancılaşma hissederken gerçeği değerlendirme yetisi TAMAMEN KORUNMUŞTUR (durumun bir yanılsama olduğunu bilir); Şizofrenide ise gerçeklik testi çökmüştür.",
                "Şizofrenide hasta aynaya hiç bakamaz.",
                "Duyarsızlaşma sadece çocuklarda görülür.",
                "Bu bozuklukta işitsel varsanılar zorunludur."
            ],
            "correctIndex": 0,
            "explanation": "DSM-5 Kriter B gereğince Depersonalizasyon/Derealizasyon yaşantıları sırasında bireyin gerçeği değerlendirme yetisi (insight / reality testing) daima tam ve sağlam kalır."
        },
        "differentialDiagnosis": "• Şizofreni: Şizofrenide sanrılar ve gerçeklik kaybı vardır; burada içgörü tamdır.\n• Temporal Lob Epilepsisi: EEG ile dışlanmıştır.\n• Madde Etkisi: Toksikoloji temizdir.",
        "dsmCriteriaSummary": "DSM-5: Depersonalizasyon (kendine yabancılaşma) ve/veya Derealizasyon (çevreye yabancılaşma) + Gerçeği değerlendirme yetisinin sağlam olması.",
        "therapyId": "act",
        "pharmacologyId": "lamotrigine_bipolar2",
        "explanation": {
            "whyThis": [
                "Bedenini dışarıdan izliyormuş gibi hissetme ve ellerini kendine ait hissetmeme kendilikten kopma (depersonalizasyon) yaşantısıdır.",
                "Çevrenin yapay, cansız ve dekor gibi algılanması gerçekdışılık (derealizasyon) yaşantısıdır.",
                "Kişi bunların bir his olduğunu bilir; gerçeği değerlendirme sağlamdır. MRG, EEG ve madde taraması temizdir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "schizophrenia",
                    "reason": "Gerçeği değerlendirme sağlamdır; kişi yaşantının gerçek olmadığını bilir ve sanrı ya da varsanı yoktur."
                },
                {
                    "diagnosisId": "panic_disorder",
                    "reason": "Depersonalizasyon panik atakta da görülebilir, ancak burada dakikalar içinde tepe yapan ve bedensel belirtilerle giden ataklar tarif edilmiyor."
                },
                {
                    "diagnosisId": "substance_induced_anxiety",
                    "reason": "Esrar ve sentetik kannabinoid dahil madde kullanımı dışlanmıştır."
                }
            ],
            "teachingPoint": "Depersonalizasyon/derealizasyonda en önemli soru gerçeği değerlendirmenin korunup korunmadığıdır; korunmuyorsa psikotik bir süreç düşünülür."
        }
    },
    {
        "id": "case-045",
        "caseNumber": 45,
        "difficulty": "Zor",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "dissociative_amnesia",
        "category": "DISSOCIATIVE",
        "patientSummary": "38 yaşında, erkek, muhasebeci",
        "clues": [
            "Danışan, evinden 400 km uzaktaki bir sahil kasabasında bir park bankında polis tarafından kimliği belirsiz halde bulunmuş; cebinde kendi adına düzenlenmiş cüzdanı olmasına rağmen adını, mesleğini, evli olup olmadığını ve oraya nasıl geldiğini kesinlikle hatırlamamaktadır.",
            "Hastanede yapılan araştırmada, hastanın 1 hafta önce çalıştığı şirkette büyük bir zimmete para geçirme skandalının tanığı olduğu ve ağır bir tehdit/travma yaşadığı gün aniden ortadan kaybolduğu (amaçlı seyahat / füg) öğrenilmiştir.",
            "Hastanın genel zeka fonksiyonları, dil becerisi ve motor yetileri sağlamdır; ancak travmatik olayla bağlantılı otobiyografik bellek tamamen silinmiştir.",
            "Kranial MRG, BT ve video-EEG taramalarında kafa travması, inme veya epileptik amnezi saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Retrograd otobiyografik amnezi, şaşkınlık ve dissosiyatif füg tablosu.",
            "DSM-5'e göre: Genellikle travmatik ya da stresli nitelikte olan önemli otobiyografik bilgileri anımsayamama (olağan unutkanlıkla bağdaşmayan) ve amneziye amaçlı bir seyahatin (füg) eşlik etmesi mevcuttur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "adını, mesleğini, evli olup olmadığını",
                "dsmMatch": "DSM-5 Kriter A: Önemli kişisel/otobiyografik bilgileri anımsayamama"
            },
            {
                "clueIndex": 0,
                "text": "evinden 400 km uzaktaki bir sahil kasabasında",
                "dsmMatch": "DSM-5 Belirleyici: Dissosiyatif Füg ile Birlikte (Amaçlı seyahat veya şaşkın şaşkın gezinme)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Psikoterapi & Güvenli Bellek İyileştirme",
            "therapyDetails": "Güvenli çevre sağlama, anksiyeteyi düşürme ve dissosiye olmuş anıları kademeli olarak bilinç alanına geri entegre etme.",
            "pharmacologyNote": "Spesifik bir ilaç tedavisi yoktur; destekleyici psikoterapi ve güvenli ortam sağlanması esastır."
        },
        "miniQuiz": {
            "question": "Dissosiyatif Amnezi'ye amaçlı veya şaşkınlıkla yapılan bir seyahat / yer değiştirme eşlik ettiğinde DSM-5'e göre hangi ek belirleyici kullanılır?",
            "options": [
                "Dissosiyatif Füg ile birlikte (with Dissociative Fugue)",
                "Katatonik belirleyici",
                "Hızlı döngülü belirleyici",
                "Somatik belirleyici"
            ],
            "correctIndex": 0,
            "explanation": "Kişinin kimlik amnezisiyle birlikte evinden veya işinden uzakta amaçlı bir seyahate çıkması veya şaşkınca gezinmesi tablosu DSM-5'te 'Dissosiyatif Füg ile birlikte' belirleyicisi alır."
        },
        "differentialDiagnosis": "• Organik Amnezi (Demans/Kafa Travması): Organikte yeni bilgileri öğrenme bozulur (anterograd); dissosiyatif amnezide ise geçmiş otobiyografik anılar silinir.\n• Temarruz (Numara Yapma): Adli kazanç için taklit edilir.",
        "dsmCriteriaSummary": "DSM-5: Önemli otobiyografik bilgileri hatırlayamama + Olağan unutkanlıkla açıklanamama + Tıbbi/madde nedeni olmaması (± Füg belirleyicisi).",
        "therapyId": "emdr",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Adını, mesleğini ve medeni durumunu hatırlayamaması olağan unutkanlıkla açıklanamayacak düzeyde önemli otobiyografik bilgi kaybıdır.",
                "Kaybolma, ağır bir stresle aynı gün olmuş ve 400 km uzağa amaçlı bir yolculuk eşlik etmiştir; bu, dissosiyatif amnezide ‘füg ile’ belirtecine karşılık gelir.",
                "Dil, zeka ve motor işlevler sağlamdır; kafa travması, inme ve epilepsi dışlanmıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "major_neurocognitive_tbi",
                    "reason": "Görüntülemede travma bulgusu yoktur ve yeni bilgi öğrenme korunmuştur; organik amnezide genellikle yeni bilgi öğrenme bozulur."
                },
                {
                    "diagnosisId": "did",
                    "reason": "Belirgin ayrı kimlik durumları gözlenmemiştir; bellek kaybı tek başına tablonun merkezindedir."
                }
            ],
            "teachingPoint": "Dissosiyatif amneziyi organik amneziden ayıran, kişisel geçmişe ait (otobiyografik) bilginin seçici kaybı ve yeni bilgi öğrenmenin korunmasıdır; amaçlı yolculuk eşlik ediyorsa ayrı bir tanı değil, ‘dissosiyatif füg ile’ belirteci eklenir."
        }
    },
    {
        "id": "case-046",
        "caseNumber": 46,
        "difficulty": "Zor",
        "course": "ADULT",
        "diagnosisId": "asd",
        "category": "NEURODEV",
        "patientSummary": "26 yaşında, erkek, bilgisayar yazılımcısı",
        "clues": [
            "Danışan, iş yerinde arkadaşlarının esprilerini ve kinayeli sözlerini anlamadığı için her şeyi kelimesi kelimesine (harfi harfine) düz anlamıyla yorumladığını ve insanların gözlerinin içine bakmakta aşırı rahatsızlık duyduğunu anlatıyor.",
            "Çocukluğundan beri Türkiye'deki tüm tren ve metro hatlarının istasyon sıralarını, inşaat yıllarını ve vagon modellerini ezbere bilmekte ve saatlerce sadece bu tren şemalarını incelemektedir.",
            "Günlük rutinlerinde en ufak bir değişiklik olduğunda (örneğin işe giderken bindiği otobüsün güzergah değiştirmesi) yoğun bir anksiyete ve panik krizi yaşamaktadır.",
            "Dil gelişimi ve genel zeka düzeyi normalin üzerindedir; işitsel/motor testler olağandır.",
            "Ruhsal Durum Muayenesinde: Karşılıklı sosyal-duygusal etkileşimde (social-emotional reciprocity) kısıtlılık, ses tonunda monotonluk (prozodi eksikliği), beden dilini ve mecazları okuyamama, kısıtlı ve tekrarlayıcı ilgi alanları.",
            "DSM-5'e göre: Birden fazla ortamda toplumsal iletişim ve etkileşimde süregiden kısıtlılıklar ile sınırlı, yineleyici davranış, ilgi veya etkinlik örüntüleri mevcuttur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "kinayeli sözlerini anlamadığı için her şeyi kelimesi kelimesine",
                "dsmMatch": "DSM-5 Kriter A3: İlişkileri geliştirme, sürdürme ve anlamada güçlükler (mecaz/kinaye anlayamama)"
            },
            {
                "clueIndex": 1,
                "text": "tüm tren ve metro hatlarının istasyon sıralarını",
                "dsmMatch": "DSM-5 Kriter B3: Yoğunluğu ve odağı açısından olağandışı olan aşırı kısıtlı, sabit ilgi alanları"
            },
            {
                "clueIndex": 2,
                "text": "Günlük rutinlerinde en ufak bir değişiklik olduğunda",
                "dsmMatch": "DSM-5 Kriter B2: Aynılıkta ısrar etme, rutinlere esnek olmayan biçimde bağlı olma"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Sosyal Beceri Eğitimi & BDT (Bilişsel Davranışçı Terapi)",
            "therapyDetails": "Duyguları ve örtük sosyal kuralları anlama, yürütücü işlevleri destekleme ve esneklik egzersizleri.",
            "pharmacologyNote": "Primer bir medikal tedavisi yoktur; eşlik eden kaygı, DEHB veya irritabilite için semptomatik tedavi uygulanır."
        },
        "miniQuiz": {
            "question": "DSM-5 ile birlikte daha önce ayrı bir tanı olan 'Asperger Sendromu' hangi tanı şemsiyesi altına alınmıştır?",
            "options": [
                "Otizm Açılımı Kapsamında Bozukluk (Otizm Spektrum Bozukluğu - ASD)",
                "Sosyal Anksiyete Bozukluğu",
                "Şizotipal Kişilik Bozukluğu",
                "Dikkat Eksikliği ve Hiperaktivite Bozukluğu"
            ],
            "correctIndex": 0,
            "explanation": "DSM-5 revizyonunda Asperger Sendromu, Dezintegratif Bozukluk ve Yaygın Gelişimsel Bozukluk (YYB-BTA) birleştirilerek tek bir 'Otizm Spektrum Bozukluğu' çatısı altında toplanmıştır."
        },
        "differentialDiagnosis": "• Sosyal Anksiyete Bozukluğu: Sosyal fobide kişi sosyal ipuçlarını anlar ama olumsuz değerlendirilmekten korkar; ASD'de ise sosyal ipuçlarını çözümleme yetisi nörogelişimsel olarak kısıtlıdır.\n• Şizoid KB: Şizoidde kısıtlı ilgi alanı ve rutin ısrarı tipik değildir.",
        "dsmCriteriaSummary": "DSM-5: 1. Toplumsal iletişimde eksiklik (duygusal karşılıklılık, sözel olmayan iletişim), 2. Kısıtlı/yineleyici davranış ve ilgi alanları (en az 2/4), 3. Erken gelişim döneminde başlamış olması.",
        "therapyId": "pmt",
        "pharmacologyId": "atypical_ap_secondgen",
        "explanation": {
            "whyThis": [
                "Espri ve mecazları harfi harfine anlama, göz temasından rahatsızlık, tekdüze ses tonu ve beden dilini okuyamama sosyal iletişim ve karşılıklılıkta süregen kısıtlılıklardır.",
                "Çocukluktan beri tren ve metro hatlarına yoğun, dar ilgi ile rutin değişikliğine aşırı tepki kısıtlı ve yineleyici davranış boyutunu karşılar.",
                "Belirtiler erken gelişimden beri vardır ve iş ortamında işlevi etkilemektedir; dil ve zeka normalin üstündedir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "social_anxiety",
                    "reason": "Kişi sosyal ipuçlarını anlayıp olumsuz değerlendirilmekten korkmuyor; asıl sorun ipuçlarını anlamlandırmadaki gelişimsel güçlüktür."
                },
                {
                    "diagnosisId": "ocpd",
                    "reason": "Rutinlere bağlılık ve dar ilgiler var, ancak OKKB'de sosyal-duygusal karşılıklılıkta ve mecazları anlamada çocukluktan beri süren bir sorun yoktur."
                },
                {
                    "diagnosisId": "social_communication_disorder",
                    "reason": "Toplumsal iletişim bozukluğunda kısıtlı ve yineleyici ilgi/davranışlar yoktur; burada belirgin biçimde vardır."
                }
            ],
            "teachingPoint": "Otizm ile toplumsal (pragmatik) iletişim bozukluğunu ayıran, kısıtlı ve yineleyici ilgi/davranışların varlığıdır."
        }
    },
    {
        "id": "case-047",
        "caseNumber": 47,
        "difficulty": "Orta",
        "course": "CHILD",
        "diagnosisId": "tourette",
        "category": "NEURODEV",
        "patientSummary": "11 yaşında, erkek, 5. sınıf öğrencisi",
        "clues": [
            "Danışan, son 1.5 yıldır kontrol edemediği şekilde gözlerini kırpıştırdığını, başını omzuna doğru hızla silktiğini ve sınıfta ders sırasında aniden istemsizce boğazını temizleyip 'havlama' benzeri homurtular çıkardığını belirterek getiriliyor.",
            "Bu tiklerin gün içinde defalarca tekrarladığı, stres anlarında belirgin şekilde arttığı ancak bilgisayar oyunu oynarken hafiflediği öğreniliyor.",
            "Tikler ortaya çıkmadan hemen önce vücudunda karşı konulamaz bir gerilim ve dürtüsel baskı hissettiğini, hareketi yaptıktan sonra kısa süreliğine rahatladığını ifade ediyor.",
            "Nörolojik muayenede kranial sinirler ve beyin MRG normaldir; PANDAS (streptokok enfeksiyonu ilişkili tik) tablosu dışlanmıştır.",
            "Ruhsal Durum Muayenesinde: Hem çoklu motor tikler (göz kırpma, omuz silkme) hem de en az bir vokal tik (boğaz temizleme, ses çıkarma) saptanmış olup bu tikler 1 yıldan uzun süredir devam etmektedir.",
            "DSM-5'e göre: Hastalık sırasında aynı anda olması gerekmese de hem çoklu motor hem de bir ya da daha fazla vokal tikin 1 yıldan uzun süredir bulunması tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "gözlerini kırpıştırdığını",
                "dsmMatch": "DSM-5 Kriter A: Hem çoklu motor hem de bir ya da daha fazla vokal tikin varlığı"
            },
            {
                "clueIndex": 0,
                "text": "son 1.5 yıldır",
                "dsmMatch": "DSM-5 Kriter B: Tikler en az 1 yıldan uzun süredir devam etmektedir"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Tikler için Kapsamlı Davranışçı Müdahale (CBIT / Comprehensive Behavioral Intervention for Tics)",
            "therapyDetails": "Öncül uyarım farkındalığı eğitimi, yarışan tepki geliştirme ve tikleri tetikleyen çevresel stresörleri azaltma.",
            "pharmacologyNote": "Gerektiğinde Alfa-2 agonistler (Klonidin, Guanfasin) veya düşük doz Dopamin blokerleri (Aripiprazol) tercih edilir."
        },
        "miniQuiz": {
            "question": "Tourette Bozukluğu tanısı koyabilmek için Süreğen Motor veya Vokal Tik Bozukluğundan farklı olarak ne aranır?",
            "options": [
                "Hastalık süresince HEM motor tiklerin HEM DE en az bir vokal tikin birlikte bulunması ve sürenin 1 yılı aşması şarttır.",
                "Sadece el titremesi olması yeterlidir.",
                "Hastanın mutlaka küfür etmesi (koprolali) zorunludur.",
                "Tiklerin sadece uyku sırasında olması gerekir."
            ],
            "correctIndex": 0,
            "explanation": "Tourette tanısı için hem çoklu motor hem de en az bir ses/vokal tikin bulunması ve sürenin en az 1 yılı aşması şarttır (Koprolali/küfür tiki hastaların sadece %10-15'inde görülür, tanı için zorunlu değildir)."
        },
        "differentialDiagnosis": "• Süreğen Motor veya Vokal Tik Bozukluğu: Sadece motor YA DA sadece vokal tik vardır (ikisi birden olmaz).\n• Geçici Tik Bozukluğu: Süre 1 yıldan azdır.",
        "dsmCriteriaSummary": "DSM-5: Çoklu motor + En az 1 vokal tik + Süre > 1 yıl + 18 yaşından önce başlamış olması.",
        "therapyId": "cbit",
        "pharmacologyId": "alpha2_agonist_tic",
        "explanation": {
            "whyThis": [
                "Göz kırpma ve baş-omuz silkme çoklu motor tiklerdir; boğaz temizleme ve havlama benzeri sesler vokal tiklerdir.",
                "Tikler bir buçuk yıldır, yani bir yıldan uzun süredir devam etmektedir ve 18 yaşından önce başlamıştır.",
                "Tik öncesi dürtüsel baskı ve sonrasında rahatlama, stresle artma ve odaklanmayla azalma tiklerin tipik özelliğidir; MRG normaldir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "chronic_motor_vocal_tic",
                    "reason": "Süregen tik bozukluğunda yalnızca motor ya da yalnızca vokal tik vardır; burada ikisi birlikte bulunur."
                },
                {
                    "diagnosisId": "provisional_tic_disorder",
                    "reason": "Tikler bir yıldan uzun süredir devam ettiği için geçici tik bozukluğu tanımının dışındadır."
                },
                {
                    "diagnosisId": "ocd",
                    "reason": "Hareketten önce gelen şey bir düşünce ya da korku değil bedensel bir dürtü hissidir; ancak OKB Tourette'e sık eşlik ettiği için ayrıca taranmalıdır."
                }
            ],
            "teachingPoint": "Tik bozukluklarını iki soru ayırır: hem motor hem vokal tik var mı ve süre bir yılı aşıyor mu? İkisi de evetse Tourette."
        }
    },
    {
        "id": "case-048",
        "caseNumber": 48,
        "difficulty": "Orta",
        "course": "IMPULSE",
        "diagnosisId": "intermittent_explosive",
        "category": "IMPULSE",
        "patientSummary": "32 yaşında, erkek, fabrika ustabaşı",
        "clues": [
            "Danışan, trafikte önündeki aracın hafifçe yavaşlaması üzerine aniden çılgına dönüp arabasından levye ile inerek diğer aracın camlarını kırdığı ve adamı darp ettiği için savcılık yönlendirmesiyle öfke kontrol değerlendirmesine geliyor.",
            "Bu tür öfke patlamalarının ayda 2-3 kez en ufak bir önemsiz tartışmada aniden ortaya çıktığını, kendini tutamadığını ve etraftaki eşyaları parçaladığını anlatıyor.",
            "Öfke nöbeti yatıştıktan hemen sonra derin bir pişmanlık, utanç ve suçluluk duyduğunu ('Ben aslında sakin bir insanım ama o an gözüm kararıyor') ifade etmektedir.",
            "Beyin BT taraması ve toksikoloji testleri temizdir; patlamalar alkol/madde etkisiyle ortaya çıkmamaktadır.",
            "Ruhsal Durum Muayenesinde: Dürtü denetiminde epizodik kayıp; tetikleyici olayın ağırlığıyla tamamen orantısız ve planlanmamış (amaca yönelik olmayan) saldırganlık patlamaları.",
            "DSM-5'e göre: Saldırgan dürtüleri kontrol edememeyi gösteren yineleyici davranışsal patlamalar ve bu patlamaların ortaya çıkan psikososyal stresörle belirgin derecede orantısız olması tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "önündeki aracın hafifçe yavaşlaması üzerine aniden çılgına dönüp",
                "dsmMatch": "DSM-5 Kriter B: Saldırganlık derecesi kışkırtma veya psikososyal stresörün ağırlığıyla belirgin biçimde orantısızdır"
            },
            {
                "clueIndex": 2,
                "text": "nöbeti yatıştıktan hemen sonra derin bir pişmanlık, utanç ve suçluluk",
                "dsmMatch": "DSM-5 Kriter C: Patlamalar önceden tasarlanmamıştır (amaca yönelik değildir)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Öfke Yönetimi Terapisi",
            "therapyDetails": "Öfkenin bedensel erken uyarı işaretlerini tanıma, mola verme (time-out) tekniği, bilişsel yeniden yapılandırma ve problem çözme.",
            "pharmacologyNote": "SSRI'lar (dürtüsellik ve irritabilite kontrolü) veya duygudurum dengeleyiciler (Valproat, Lityum) etkilidir."
        },
        "miniQuiz": {
            "question": "Aralıklı Patlayıcı Bozukluk (IED) ile Antisosyal Kişilik Bozukluğundaki saldırganlık arasındaki en temel fark nedir?",
            "options": [
                "IED'de patlamalar dürtüseldir, planlanmamıştır ve ardından derin pişmanlık duyulur; Antisosyal KB'de ise saldırganlık genellikle çıkarcı/planlıdır ve pişmanlık duyulmaz.",
                "IED sadece çocuklarda görülür.",
                "Antisosyal hastalar hiçbir zaman kavga etmez.",
                "İki tabloda da hiçbir fark yoktur."
            ],
            "correctIndex": 0,
            "explanation": "Aralıklı Patlayıcı Bozuklukta öfke dürtüseldir, maddi çıkar amacı taşımaz ve sonrasında samimi bir suçluluk hissedilir. Antisosyal KB'de ise empati yoksunluğu ve pişmanlık duymama karakteristiktir."
        },
        "differentialDiagnosis": "• Antisosyal Kişilik Bozukluğu: Suçluluk/pişmanlık duyulmaz ve empati yoktur.\n• Bipolar Bozukluk (Mani): Manideki öfke kabarmış duygudurum ve grandiyözite eşliğindedir.\n• Davranım Bozukluğu: Çocuk/ergenlerde sinsi kuralları çiğneme vardır.",
        "dsmCriteriaSummary": "DSM-5: Saldırgan dürtüleri kontrol edememe patlamaları (mala zarar, yaralama) + Stresörle tamamen orantısız olması + Planlı olmaması + Süreklilik göstermesi.",
        "therapyId": "cbt_general",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Trafikteki küçük bir yavaşlamaya levyeyle araç camlarını kırma ve darp etme tepkisi, tetikleyiciyle belirgin biçimde orantısız bir saldırganlıktır.",
                "Patlamalar ayda 2-3 kez, önemsiz tartışmalarda, plansız ve kontrolsüzce ortaya çıkar ve mal ya da kişiye zarar verir.",
                "Sonrasında pişmanlık ve utanç duyması, madde etkisi ve beyin patolojisinin dışlanmış olması tabloyu destekler."
            ],
            "whyNot": [
                {
                    "diagnosisId": "antisocial_pd",
                    "reason": "Saldırganlık çıkar amaçlı ve planlı değildir; kişi sonrasında belirgin pişmanlık duyar ve genel bir hak ihlali örüntüsü tarif edilmiyor."
                },
                {
                    "diagnosisId": "bipolar_1",
                    "reason": "Öfke epizodik yükselmiş duygudurum, azalmış uyku ya da büyüklenmecilik eşliğinde değil, dakikalar süren patlamalar halindedir."
                },
                {
                    "diagnosisId": "borderline_pd",
                    "reason": "Yoğun öfke borderline'da da görülür, ancak terk edilme korkusu, kimlik karmaşası ve kendine zarar verme tarif edilmiyor."
                }
            ],
            "teachingPoint": "Aralıklı patlayıcı bozuklukta saldırganlık dürtüsel ve amaçsızdır, ardından pişmanlık gelir; planlı ve çıkar amaçlı saldırganlık başka tanıları düşündürür."
        }
    },
    {
        "id": "case-049",
        "caseNumber": 49,
        "difficulty": "Orta",
        "course": "SUBSTANCE",
        "diagnosisId": "gambling_disorder",
        "category": "SUBSTANCE",
        "patientSummary": "40 yaşında, erkek, mağaza müdürü",
        "clues": [
            "Danışan son 3 yıldır internetteki çevrimiçi bahis ve kumar sitelerinde maaşının tamamını kaybettiğini, ailesinden gizli 400.000 TL kredi çektiğini ve borçları kapatmak için daha yüksek meblağlarla bahis oynamaya devam ettiğini (kayıpları kovalama / chasing losses) anlatıyor.",
            "Aynı heyecanı ve coşkuyu yakalayabilmek için giderek daha büyük miktarlarda parayla kumar oynama ihtiyacı (tolerans benzeri tablo) geliştirdiği öğreniliyor.",
            "Kumar oynamayı bırakmayı veya azaltmayı defalarca denemiş ancak her denemesinde aşırı huzursuz, sinirli ve gergin olduğu belirtiliyor.",
            "Kumar borçlarını ödeyebilmek için şirket kasasından geçici para alma girişiminde bulunmuş ve işini kaybetme tehlikesiyle karşı karşıya kalmıştır.",
            "Ruhsal Durum Muayenesinde: Davranışsal bağımlılık örüntüsü, kumar oynama zihinsel uğraşı (preoküpasyon), inkar ve yalan söyleme savunma mekanizmaları.",
            "DSM-5'e göre: 12 aylık bir dönem içinde klinik açıdan belirgin bir bozulmaya yol açan, yineleyen ve sorunlu kumar oynama davranışıdır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "borçları kapatmak için daha yüksek meblağlarla bahis oynamaya devam ettiğini",
                "dsmMatch": "DSM-5 Kriter 6: Parayla kumar oynayıp kaybettikten sonra kaybettiklerini geri kazanmak için başka bir gün tekrar oynama (kayıpları kovalama)"
            },
            {
                "clueIndex": 1,
                "text": "Aynı heyecanı ve coşkuyu yakalayabilmek için giderek daha büyük miktarlarda parayla",
                "dsmMatch": "DSM-5 Kriter 1: İstenen heyecanı duymak için giderek artan miktarda parayla kumar oynama gereksinimi (Tolerans)"
            },
            {
                "clueIndex": 2,
                "text": "her denemesinde aşırı huzursuz, sinirli ve gergin olduğu",
                "dsmMatch": "DSM-5 Kriter 2: Kumarı bırakma/azaltma girişimlerinde huzursuz veya kolay kızan olma (Yoksunluk)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi & Motivasyonel Görüşme (12 Basamaklı Adsız Kumarbazlar - GA)",
            "therapyDetails": "Kumar bilişlerini ('kazanmak üzereyim' yanılsaması) yeniden yapılandırma, finansal kontrolü güvenilir bir yakına devretme ve tetikleyici siteleri engelleme.",
            "pharmacologyNote": "Naltrekson (ödül döngüsünü bloke etme) ve SSRI grubu ilaçlar dürtüsellik ve komorbid depresyonu yatıştırmada etkilidir."
        },
        "miniQuiz": {
            "question": "DSM-5'te Kumar Oynama Bozukluğu neden 'Maddeyle İlişkili ve Bağımlılık Bozuklukları' ana kategorisine dahil edilmiştir?",
            "options": [
                "Çünkü beyindeki dopaminerjik ödül yolağını tıpkı kimyasal maddeler (kokain, alkol gibi) gibi aktive ettiği, tolerans ve yoksunluk benzeri süreçler gösterdiği kanıtlanmıştır.",
                "Çünkü kumar oynayan herkes alkol de kullanır.",
                "Çünkü kumar oynamak bir dürtü değil sadece bir spordur.",
                "Çünkü bu bozukluk sadece kumarhanelerde ortaya çıkar."
            ],
            "correctIndex": 0,
            "explanation": "Nörobiyolojik araştırmalar, patolojik kumarın beyindeki ventral striatum ve dopaminerjik ödül devresini madde bağımlılığı ile tamamen aynı şekilde aktive ettiğini gösterdiği için DSM-5'te madde bağımlılığı kategorisine alınmıştır."
        },
        "differentialDiagnosis": "• Profesyonel/Sosyal Kumar: Riskler kontrol altındadır, tolerans veya işlev kaybı yoktur.\n• Bipolar Manik Epizod: Manideki kontrolsüz harcama genel grandiyözite ve taşkınlık döneminde ortaya çıkar.",
        "dsmCriteriaSummary": "DSM-5 (En az 4/9): Artan miktarda para gereksinimi (tolerans), bırakınca huzursuzluk (yoksunluk), kontrol çabalarında başarısızlık, zihinsel uğraş, kayıpları kovalama, yalan söyleme, ilişkileri tehlikeye atma.",
        "therapyId": "motivational_interviewing",
        "pharmacologyId": "naltrexone_acamprosate",
        "explanation": {
            "whyThis": [
                "Kayıpları geri kazanmak için daha yüksek bahis oynaması (kayıp kovalama) ve aynı heyecan için artan miktarlara ihtiyaç duyması kumar bozukluğunun çekirdek ölçütleridir.",
                "Bırakma girişimlerinin başarısız olması ve azaltınca huzursuzluk, sinirlilik yaşaması denetim kaybını gösterir.",
                "Aileden gizli kredi çekme, şirket kasasından para alma girişimi ve işini kaybetme riski kumarın yalan, başkalarının parasına başvurma ve ciddi işlev kaybıyla sürdüğünü gösterir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "bipolar_1",
                    "reason": "Kontrolsüz harcama epizodik bir taşkınlık, azalmış uyku ya da büyüklenmecilik döneminde değil, üç yıldır sürekli ve kumara özgü olarak ortaya çıkmaktadır."
                },
                {
                    "diagnosisId": "antisocial_pd",
                    "reason": "Kasa parasına yönelme kumar borçlarını kapatmaya yöneliktir; çocukluktan beri süren genel bir hak ihlali örüntüsü tarif edilmiyor."
                },
                {
                    "diagnosisId": "kleptomania",
                    "reason": "Para almanın amacı ihtiyaç duyulmayan nesneleri çalmak değil, kumar borcunu kapatmaktır."
                }
            ],
            "teachingPoint": "Kumar bozukluğu madde kullanım bozukluklarına benzer bir mantıkla değerlendirilir; ‘kayıp kovalama’ en ayırt edici davranışsal işarettir."
        }
    },
    {
        "id": "case-050",
        "caseNumber": 50,
        "difficulty": "Orta",
        "course": "SUBSTANCE",
        "diagnosisId": "alcohol_use_disorder",
        "category": "SUBSTANCE",
        "patientSummary": "44 yaşında, erkek, inşaat mühendisi",
        "clues": [
            "Danışan son 3 yıldır her akşam içtiği alkol miktarını giderek artırdığını, sabahları ellerinde titreme ve yoğun anksiyete ile uyandığı için titremeyi durdurmak amacıyla sabah uyanır uyanmaz ilk iş olarak bir kadeh viski içtiğini (yoksunluk belirtisi) anlatıyor.",
            "Aynı sarhoşluk ve rahatlama hissini yakalayabilmek için 2 dubleden 1 şişe viskiye çıktığı (tolerans gelişimi) belirtiliyor.",
            "Alkol yüzünden işe geç kalmakta, eşiyle boşanma aşamasına gelmiş olmasına ve doktorunun 'karaciğer enzimlerin çok yüksek, bırakmalısın' uyarısına rağmen içmeyi bırakmaya yönelik defalarca verdiği sözleri tutamamıştır.",
            "Kan tahlillerinde GGT: 180 U/L, ALT: 85 U/L ve AST: 110 U/L tespit edilmiştir; ultrason karaciğerde grade 2 yağlanma göstermektedir.",
            "Ruhsal Durum Muayenesinde: Aşerme (craving), kontrol kaybı, inkâr ve rasyonalizasyon savunma düzenekleri ile belirgin otonomik yoksunluk bulguları.",
            "DSM-5'e göre: 12 aylık bir dönem içinde klinik açıdan belirgin bir bozulmaya ya da sıkıntıya yol açan, tolerans ve yoksunluk içeren sorunlu bir alkol kullanım örüntüsüdür."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "sabahları ellerinde titreme",
                "dsmMatch": "DSM-5 Kriter 11: Yoksunluk belirtilerini gidermek ya da bundan kaçınmak için alkol alma"
            },
            {
                "clueIndex": 1,
                "text": "Aynı sarhoşluk",
                "dsmMatch": "DSM-5 Kriter 10: Belirgin bir tolerans gelişmesi (aynı etki için belirgin artan miktarlar)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Motivasyonel Görüşme (MI) & Nüks Önleme için BDT (Adsız Alkolikler - AA)",
            "therapyDetails": "Değişim aşamalarını ilerletme, tetikleyici ortamları yönetme ve alkolsüz başa çıkma stratejileri.",
            "pharmacologyNote": "Aşermeyi azaltmak için Akamprosat veya Naltrekson; caydırıcı olarak Disülfiram; akut detoksta Benzodiazepin protokolü."
        },
        "miniQuiz": {
            "question": "Alkol bağımlılığında kişinin aynı etkiyi elde etmek için tükettiği alkol miktarını sürekli artırmak zorunda kalmasına ne ad verilir?",
            "options": [
                "Tolerans",
                "Yoksunluk",
                "Aşerme (Craving)",
                "Delirium Tremens"
            ],
            "correctIndex": 0,
            "explanation": "İstenen intoksikasyon etkisini yakalamak için giderek daha fazla miktarda maddeye ihtiyaç duyulması 'tolerans' olarak tanımlanır."
        },
        "differentialDiagnosis": "• Sosyal İçicilik: Sosyal içicilikte tolerans, yoksunluk veya işlev kaybı yoktur.\n• Bipolar Manik Dönem: Manideki kontrolsüz içme dönemsel taşkınlığa ikincildir.",
        "dsmCriteriaSummary": "DSM-5 (En az 2/11): Amaçlanandan fazla içme, bırakma çabalarında başarısızlık, aşerme, sorumlulukları aksatma, tehlikeli ortamlarda içme, tolerans, yoksunluk.",
        "therapyId": "motivational_interviewing",
        "pharmacologyId": "naltrexone_acamprosate",
        "explanation": {
            "whyThis": [
                "Aynı etki için ikiden bir şişeye çıkan miktar toleransı, sabah titremesini içerek gidermesi yoksunluk ölçütünü gösterir.",
                "Defalarca bırakma sözü verip tutamaması kullanımı denetlemede başarısızlıktır.",
                "Karaciğer hasarı ve evlilik ile iş sorunlarına rağmen içmeyi sürdürmesi zarara rağmen kullanımdır; 12 ay içinde ikiden çok ölçüt karşılanır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "alcohol_withdrawal",
                    "reason": "Sabah titremesi yoksunluğu gösterir, ancak tablo tek başına yoksunlukla sınırlı değil; tolerans, kontrol kaybı ve zarara rağmen kullanımla giden süreğen bir kullanım örüntüsüdür."
                },
                {
                    "diagnosisId": "gad",
                    "reason": "Sabah anksiyetesi alkol yoksunluğuyla ortaya çıkıyor ve içince geçiyor; içmeden bağımsız süreğen bir kaygı tarif edilmiyor."
                },
                {
                    "diagnosisId": "substance_induced_depressive",
                    "reason": "Belirgin, süreğen bir depresif duygudurum tarif edilmiyor; öne çıkan tablo kullanım örüntüsünün kendisidir."
                }
            ],
            "teachingPoint": "Alkol kullanım bozukluğunun şiddeti 12 ayda karşılanan ölçüt sayısına göre belirlenir: 2-3 hafif, 4-5 orta, 6 ve üzeri ağır."
        }
    },
    {
        "id": "case-051",
        "caseNumber": 51,
        "difficulty": "Orta",
        "course": "CHILD",
        "diagnosisId": "dmdd",
        "category": "MOOD",
        "patientSummary": "9 yaşında, erkek, ilkokul 3. sınıf öğrencisi",
        "clues": [
            "Danışan, haftada en az 3-4 kez en ufak bir engellenmede (örneğin televizyonun kapatılması veya ödev yapmasının istenmesi) ortalığı birbirine katan, duvarlara tekmeler savuran, eşyaları parçalayan ve 45 dakika süren şiddetli öfke patlamaları yaşamaktadır.",
            "Önemli tanısal kilit nokta: Bu şiddetli öfke patlamaları OLMADIĞI zamanlarda bile (patlamalar arasında hemen hemen her gün) çocuğun duygudurumu sürekli olarak öfkeli, huysuz, alıngan ve kolay kızandır (kronik irritabilite).",
            "Bu belirtiler son 1.5 yıldır kesintisiz sürmekte olup hem evde hem okulda (birden fazla ortamda) devam etmektedir.",
            "Nörolojik tarama ve EEG normaldir; çocukta epizodik kabarmış mani dönemi veya grandiyözite saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Ağır kronik irritabilite, düşük engellenme eşiği ve durumsal stresörün ağırlığıyla tamamen orantısız sözel/davranışsal patlamalar.",
            "DSM-5'e göre: Gelişimsel düzeye uygun olmayan, haftada ortalama 3 ya da daha çok kez yineleyen ağır öfke patlamaları ve patlamalar arasındaki duygudurumun sürekli irritabl olmasıdır (Başlangıç < 10 yaş)."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "haftada en az 3-4 kez",
                "dsmMatch": "DSM-5 Kriter B: Öfke patlamaları haftada ortalama 3 ya da daha çok kez yineler"
            },
            {
                "clueIndex": 1,
                "text": "patlamalar arasında hemen hemen her gün",
                "dsmMatch": "DSM-5 Kriter D: Öfke patlamaları arasındaki duygudurum hemen her gün sürekli irritabldır"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Ebeveyn Yönetim Eğitimi (PMT) & Çocuk için BDT",
            "therapyDetails": "Engellenme toleransını artırma, erken duygu regülasyonu, tutarlı ebeveyn tepkileri ve sakinleşme becerileri.",
            "pharmacologyNote": "Ağır irritabilite ve agresyon için düşük doz atipik antipsikotikler (Risperidon) veya SSRI'lar kullanılabilir."
        },
        "miniQuiz": {
            "question": "DSM-5'te DMDD (Yıkıcı Duygudurumu Düzenleyememe Bozukluğu) tanısının getirilmesinin en temel amacı nedir?",
            "options": [
                "Kronik irritabl ve öfkeli çocuklara gereksiz yere 'Pediyatrik Bipolar Bozukluk' aşırı tanısı konulmasını ve lityum/antipsikotik yüklenmesini önlemek.",
                "Çocukların okuldan atılmasını kolaylaştırmak.",
                "DEHB tanısını tamamen ortadan kaldırmak.",
                "Sadece yetişkinlere tanı koyabilmek."
            ],
            "correctIndex": 0,
            "explanation": "DMDD, epizodik mani göstermeyen sadece kronik öfkeli çocukların yanlışlıkla 'Pediyatrik Bipolar' olarak etiketlenmesini engellemek için DSM-5 duygudurum kategorisine eklenmiştir."
        },
        "differentialDiagnosis": "• Pediyatrik Bipolar Bozukluk: Bipolarda epizodik mani (az uyku, grandiyözite) vardır; DMDD'de ise süreğen non-epizodik öfke vardır.\n• KOKGB: KOKGB'de öfke patlamaları arasındaki kronik irritabilite zorunlu değildir.",
        "dsmCriteriaSummary": "DSM-5: Haftada ≥ 3 ağır öfke patlaması + Patlamalar arasında sürekli irritabl duygudurum + En az 1 yıl sürmesi + Başlangıcın 10 yaşından önce olması.",
        "therapyId": "pmt",
        "pharmacologyId": "atypical_ap_secondgen",
        "explanation": {
            "whyThis": [
                "Televizyon kapatılması gibi küçük engellemelere haftada 3-4 kez verilen, eşya kıran ağır öfke patlamaları gelişim düzeyine uygun değildir.",
                "Patlamalar arasında da neredeyse her gün süren öfkeli ve kolay kızan duygudurum tanının kilit ölçütüdür.",
                "Tablo bir buçuk yıldır, ev ve okulda sürmektedir ve 10 yaşından önce başlamıştır; epizodik mani yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "odd",
                    "reason": "Öfke patlamaları ve kalıcı irritabilite KOKGB'nin şiddetini aşıyor; iki tablonun ölçütleri karşılanırsa yalnızca DMDD konur."
                },
                {
                    "diagnosisId": "bipolar_1",
                    "reason": "İrritabilite süreğen ve epizodik değildir; azalmış uyku ya da büyüklenmecilik içeren ayrı manik dönemler yoktur."
                },
                {
                    "diagnosisId": "intermittent_explosive",
                    "reason": "Patlamalar arasındaki sürekli öfkeli duygudurum aralıklı patlayıcı bozuklukta beklenmez; ayrıca bu yaşta ve bu tabloda DMDD önceliklidir."
                }
            ],
            "teachingPoint": "DMDD'yi KOKGB ve aralıklı patlayıcı bozukluktan ayıran şey, patlamalar arasında da neredeyse her gün süren öfkeli duygudurumdur."
        }
    },
    {
        "id": "case-052",
        "caseNumber": 52,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "cyclothymia",
        "category": "BIPOLAR",
        "patientSummary": "25 yaşında, kadın, moda tasarımcısı",
        "clues": [
            "Danışan son 3 yıldır duygudurumunun sürekli bir lunapark treni gibi olduğunu; birkaç gün boyunca aşırı enerjik, günde 4 saat uykuyla harika çizimler yapan biriyken, hemen ardından gelen 1 hafta boyunca kendini yorgun, özgüvensiz ve karamsar hissettiğini anlatıyor.",
            "Kritik tanısal ayrıntı: Enerjik olduğu dönemler hiçbir zaman tam bir 'Manik Epizod' şiddetine (hastaneye yatış veya psikoz) ulaşmamış; çökkün olduğu dönemler de hiçbir zaman tam bir 'Majör Depresif Epizod' ölçütlerini tam karşılamamıştır.",
            "Bu 3 yıllık süreçte duygudurumunun tamamen nötr ve dengeli olduğu aralıklar hiçbir zaman 2 aydan uzun sürmemiştir.",
            "Tıbbi tahliller ve hormon profili normaldir.",
            "Ruhsal Durum Muayenesinde: Subklinik hipomanik dönemler ile subklinik hafif depresif dönemler arasında dalgalanan kronik duygudurum labilitesi.",
            "DSM-5'e göre: En az 2 yıl boyunca, tam bir hipomani ölçütlerini karşılamayan hipomanik belirtiler ile tam bir majör depresyon ölçütlerini karşılamayan depresif belirtilerin bulunduğu çok sayıda dönemin olmasıdır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "son 3 yıldır duygudurumunun sürekli",
                "dsmMatch": "DSM-5 Kriter A: En az 2 yıl boyunca çok sayıda hipomanik ve depresif belirti dönemi"
            },
            {
                "clueIndex": 1,
                "text": "hiçbir zaman tam bir 'Manik Epizod'",
                "dsmMatch": "DSM-5 Kriter C: Majör depresif, manik ya da hipomanik bir epizodun ölçütleri hiçbir zaman karşılanmamıştır"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Duygudurum Günlüğü & Bilişsel Terapi (Sosyal Ritim Odaklı)",
            "therapyDetails": "Duygudurum dalgalanmalarını tanıma, uyku hijyenini koruma ve stresörleri kontrol etme.",
            "pharmacologyNote": "Gerektiğinde düşük doz duygudurum dengeleyiciler (Lityum, Lamotrijin) dalgalanmaları yatıştırmak için kullanılır."
        },
        "miniQuiz": {
            "question": "Siklotimik Bozukluk ile Bipolar II Bozukluğu arasındaki en temel fark nedir?",
            "options": [
                "Bipolar II'de en az bir kez tam 'Majör Depresif Epizod' yaşanmış olması şarttır; Siklotimide ise belirtiler hiçbir zaman tam bir majör depresyon atağı düzeyine ulaşmaz.",
                "Siklotimide hasta sadece 1 gün yaşar.",
                "Bipolar II sadece çocuklarda görülür.",
                "İki bozukluk tamamen aynıdır."
            ],
            "correctIndex": 0,
            "explanation": "Siklotimi, tam majör depresyon veya tam hipomani kriterlerini doldurmayan dalgalanmaların en az 2 yıl sürmesidir. Tam bir majör depresyon yaşandığı anda tanı Bipolar II olur."
        },
        "differentialDiagnosis": "• Bipolar II: Tam Majör Depresif Epizod vardır.\n• Sınırda Kişilik Bozukluğu: BPD'de dalgalanmalar saatliktir ve terk edilme tetikleyicilidir.",
        "dsmCriteriaSummary": "DSM-5: En az 2 yıl süren subklinik hipomani ve subklinik depresyon dönemleri + 2 aydan uzun belirtisiz aralık olmaması + Tam mani/majör depresyon atağı OLMAMASI.",
        "therapyId": "ipsrt",
        "pharmacologyId": "lithium_gold",
        "explanation": {
            "whyThis": [
                "Üç yıldır birkaç gün süren enerjik, az uykulu dönemlerle bir hafta süren karamsar dönemler arasında gidip gelme çok sayıda dalgalanma olduğunu gösterir.",
                "Yükselme dönemleri tam hipomani ya da mani, çökkün dönemler tam majör depresif epizod düzeyine hiç ulaşmamıştır.",
                "Erişkinde iki yıl ölçütü aşılmıştır ve dengeli aralıklar hiçbir zaman iki aydan uzun sürmemiştir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "bipolar_2",
                    "reason": "Bipolar II için en az bir tam hipomanik ve bir tam majör depresif epizod gerekir; burada hiçbiri ölçüt eşiğine ulaşmamıştır."
                },
                {
                    "diagnosisId": "borderline_pd",
                    "reason": "Dalgalanmalar saatler değil günler sürüyor ve terk edilme gibi kişilerarası tetikleyicilere bağlı tarif edilmiyor."
                },
                {
                    "diagnosisId": "dysthymia",
                    "reason": "Yalnızca süreğen düşük duygudurum değil, arada hipomanik belirtili dönemler de vardır."
                }
            ],
            "teachingPoint": "Siklotimide hiçbir dönem tam epizod ölçütüne ulaşmaz; bir kez tam hipomani ya da majör depresyon ortaya çıkarsa tanı değişir."
        }
    },
    {
        "id": "case-053",
        "caseNumber": 53,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "hoarding_disorder",
        "category": "OCD_RELATED",
        "patientSummary": "58 yaşında, erkek, emekli öğretmen",
        "clues": [
            "Danışan, evinde son 10 yıldır biriktirdiği eski gazeteler, kırık plastik kutular, bozuk elektronik parçalar ve naylon poşetler nedeniyle yatağına bile ulaşamadığı, evde sadece daracık patikalardan geçilebildiği ve yangın tehlikesi nedeniyle komşuların şikayetiyle belediye ekiplerinin müdahale etmesi üzerine getiriliyor.",
            "Bu eşyaların hiçbir maddi veya işlevsel değeri olmamasına rağmen, 'Bir gün mutlaka lazım olur, atarsam büyük hata yaparım' diyerek eşyaları elden çıkarmaya yönelik yoğun bir ıstırap ve direnç yaşamaktadır.",
            "Mutfak tezgahı ve banyo küveti dahi istiflenmiş kutularla dolu olduğundan evde yemek pişirememekte ve temizlenememektedir.",
            "Nörolojik taramada demans veya kafa travması dışlanmıştır.",
            "Ruhsal Durum Muayenesinde: Nesnelere aşırı duygusal bağlanma, karar verme güçlüğü (infleksibilite), eşyaları atma düşüncesine karşı dayanılmaz anksiyete.",
            "DSM-5'e göre: Gerçek değerleri ne olursa olsun, sahip olunan şeyleri elden çıkarma ya da onlardan ayrılmayla ilgili süregiden bir güçlük ve bu birikimin yaşam alanlarını kullanılamaz hale getirmesidir."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "eşyaları elden çıkarmaya yönelik yoğun bir ıstırap ve direnç",
                "dsmMatch": "DSM-5 Kriter B: Eşyaları elden çıkarma düşüncesiyle ilişkili belirgin bir sıkıntı duyma"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "İstifleme Bozukluğuna Özgü BDT (Steketee & Frost Modeli)",
            "therapyDetails": "Kademeli atma ve ayıklama egzersizleri, yeni eşya edinmeyi durdurma, karar verme ve kategorizasyon becerileri.",
            "pharmacologyNote": "Klasik OKB'ye göre ilaç yanıtı daha düşüktür; yüksek doz SSRI veya Venlafaksin denenebilir."
        },
        "miniQuiz": {
            "question": "İstifleme (Biriktiricilik) Bozukluğu ile normal Koleksiyonculuk (Hobiler) arasındaki en temel fark nedir?",
            "options": [
                "Koleksiyonculukta eşyalar düzenli, tematik ve yaşam alanlarını işgal etmeyecek şekildedir; İstiflemede ise değersiz nesneler dağınık birikir ve yaşam alanlarını yaşanamaz hale getirir.",
                "İstifçiler sadece altın biriktirir.",
                "Koleksiyoncular asla para harcamaz.",
                "İkisi arasında hiçbir fark yoktur."
            ],
            "correctIndex": 0,
            "explanation": "Koleksiyonculuk organize, planlı ve estetik bir hobidir. İstifleme bozukluğunda ise değersiz çöpler ve eşyalar evi kullanılamaz hale getirir ve atma düşüncesi yoğun ıstırap yaratır."
        },
        "differentialDiagnosis": "• OKB: OKB'deki biriktirme bulaşma veya büyüsel takıntı kompulsiyonu olarak yapılır; İstiflemede ise doğrudan eşyaya bağlanma vardır.\n• Demans: Bilişsel testlerle dışlanmıştır.",
        "dsmCriteriaSummary": "DSM-5: Eşyalardan ayrılmada sürekli güçlük + Elden çıkarma sıkıntısı + Yaşam alanlarının dağınıklıkla tıkanması + Belirgin işlevsellik kaybı.",
        "therapyId": "hoarding_cbt",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Değersiz gazete, kutu ve poşetleri elden çıkarmada süregen güçlük ve atmaya karşı yoğun sıkıntı temel ölçüttür.",
                "Birikimin yatağa ulaşmayı, mutfak ve banyoyu kullanmayı engellemesi yaşam alanlarının amacına uygun kullanılamaz hale gelmesidir.",
                "Yangın riski ve belediye müdahalesi belirgin işlev kaybı ve güvenlik sorununu gösterir; demans ve kafa travması dışlanmıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "ocd",
                    "reason": "Biriktirme bulaşma ya da büyüsel bir korkuyu yatıştırmak için değil, eşyaya bağlılık ve ‘lazım olur’ düşüncesiyle yapılıyor."
                },
                {
                    "diagnosisId": "ocpd",
                    "reason": "Değersiz eşyaları atamama OKKB'nin bir özelliği olabilir, ancak burada yaşam alanını kullanılamaz kılan bir birikim ve geniş bir kişilik örüntüsünün yokluğu vardır."
                },
                {
                    "diagnosisId": "major_neurocognitive_frontotemporal",
                    "reason": "58 yaşında ortaya çıkan biriktirmede frontotemporal demans akla gelir, ancak nörolojik değerlendirme demansı dışlamıştır."
                }
            ],
            "teachingPoint": "Biriktiricilik bozukluğunda temel sorun eşyayı edinmekten çok elden çıkaramamaktır; tanı için yaşam alanının kullanılamaz hale gelmesi gerekir."
        }
    },
    {
        "id": "case-054",
        "caseNumber": 54,
        "difficulty": "Orta",
        "course": "FORENSIC",
        "diagnosisId": "conduct_disorder",
        "category": "IMPULSE",
        "patientSummary": "15 yaşında, erkek, lise 1. sınıf öğrencisi",
        "clues": [
            "Danışan, mahalledeki sokak köpeklerini kasıtlı olarak sopalarla dövüp bacaklarını kırdığı, okul kantinindeki paraları tehditle gasp ettiği ve gece evden kaçarak sahte plakalı araç çaldığı için çocuk mahkemesi tarafından yönlendiriliyor.",
            "Yaptığı bu ağır eylemlerden dolayı en ufak bir suçluluk veya pişmanlık duymamakta ('Güçlü olan zayıfı ezer, onlar da bana bulaşmasaydı') diyerek mağdurlarla alay etmektedir.",
            "12 yaşından beri okuldan kaçma (bolos), yangın çıkarma ve insanlarla fiziksel kavga başlatma öyküsü bulunmaktadır.",
            "Nörolojik muayene ve EEG normaldir.",
            "Ruhsal Durum Muayenesinde: Kısıtlı prososyal duygular (empati yoksunluğu, vicdan azabı çekmeme), kuralları ve başkalarının temel haklarını acımasızca çiğneme örüntüsü.",
            "DSM-5'e göre: Başkalarının temel haklarının ya da yaşa uygun başlıca toplumsal değerlerin/kuralların çiğnendiği, yineleyici ve sürekli bir davranış örüntüsüdür (İnsanlara/hayvanlara saldırganlık, mala zarar verme, dolandırıcılık/hırsızlık, kuralları ağır ihlal)."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "sokak köpeklerini kasıtlı olarak sopalarla dövüp",
                "dsmMatch": "DSM-5 Kriter 1-7: İnsanlara ve hayvanlara saldırganlık (fiziksel acımasızlık ve gasp)"
            },
            {
                "clueIndex": 1,
                "text": "en ufak bir suçluluk veya pişmanlık duymamakta",
                "dsmMatch": "DSM-5 Belirleyici: Kısıtlı Prososyal Duygularla Birlikte (Pişmanlık/Suçluluk Duymama)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Çoklu Sistemik Terapi (MST / Multisystemic Therapy) & Aile Terapisi",
            "therapyDetails": "Akran grubunu değiştirme, aile denetimini artırma, sosyal beceri ve empati geliştirme protokolleri.",
            "pharmacologyNote": "Şiddetli dürtüsel saldırganlık durumlarında düşük doz atipik antipsikotik veya duygudurum dengeleyici eklenebilir."
        },
        "miniQuiz": {
            "question": "Bu çocuk 18 yaşını doldurduğunda bu suç ve hak ihlali örüntüsü aynı şekilde devam ederse DSM-5 tanısı neye dönüşür?",
            "options": [
                "Antisosyal Kişilik Bozukluğu (ASPD)",
                "Karşıt Olma Karşı Gelme Bozukluğu (KOKGB)",
                "Aralıklı Patlayıcı Bozukluk",
                "Sınırda Kişilik Bozukluğu"
            ],
            "correctIndex": 0,
            "explanation": "Davranım Bozukluğu çocukluk ve ergenlik tanısıdır; 18 yaşından sonra başkalarının haklarını çiğneme örüntüsü devam ederse tanı Antisosyal Kişilik Bozukluğu olur."
        },
        "differentialDiagnosis": "• KOKGB: KOKGB'de sözel inatlaşma vardır; hayvanlara eziyet, hırsızlık ve ağır şiddet KESİNLİKLE görülmez.\n• DEHB: DEHB'de saldırganlık kasıtlı hak ihlali değil dikkatsizlik ve dürtüselliktir.",
        "dsmCriteriaSummary": "DSM-5: İnsanlara/hayvanlara saldırganlık + Mala zarar verme + Hırsızlık/dolandırıcılık + Kuralları ağır ihlal (son 12 ayda en az 3 belirti) + Yaş < 18.",
        "therapyId": "mst",
        "pharmacologyId": "alpha2_agonist_tic",
        "explanation": {
            "whyThis": [
                "Köpeklere kasıtlı eziyet ve fiziksel kavga başlatma insanlara ve hayvanlara saldırganlık ölçütleridir.",
                "Tehditle para gasp etme ve araç çalma hırsızlık, yangın çıkarma mala zarar verme, gece evden kaçma ve okuldan kaçma kuralların ağır ihlalidir.",
                "Örüntü 12 yaşından beri süregen ve yineleyicidir; pişmanlık ve empati yokluğu kısıtlı prososyal duygular belirtecini düşündürür."
            ],
            "whyNot": [
                {
                    "diagnosisId": "odd",
                    "reason": "KOKGB sözel inatlaşma ve karşı gelmeyle sınırlıdır; hayvanlara eziyet, gasp ve hırsızlık gibi hak ihlalleri içermez."
                },
                {
                    "diagnosisId": "antisocial_pd",
                    "reason": "Kişi 15 yaşındadır; antisosyal kişilik bozukluğu 18 yaşından önce konamaz."
                },
                {
                    "diagnosisId": "adhd",
                    "reason": "Davranışlar dikkatsizlik ya da dürtüsellikten değil, kasıtlı ve amaçlı hak ihlallerinden oluşur."
                }
            ],
            "teachingPoint": "Davranım bozukluğunda başlangıç yaşı belirteçtir: 10 yaşından önce en az bir ölçüt varsa çocuklukta, yoksa ergenlikte başlayan tip olarak kodlanır."
        }
    },
    {
        "id": "case-055",
        "caseNumber": 55,
        "difficulty": "Zor",
        "course": "FORENSIC",
        "diagnosisId": "pyromania",
        "category": "IMPULSE",
        "patientSummary": "26 yaşında, erkek, benzinlik çalışanı",
        "clues": [
            "Danışan son 1 yılda ormanlık alanda ve terk edilmiş binalarda 5 farklı yerde kasıtlı olarak yangın çıkardığı ve ardından itfaiyeyi arayıp yangının büyümesini ve söndürülmesini büyük bir hayranlıkla izlediği güvenlik kameralarından tespit edilerek adli makamlarca sevk edilmiştir.",
            "Yangını çıkarmadan hemen önce içinde karşı konulamaz bir gerilim, sabırsızlık ve uyarılma hissettiğini; alevler yükseldiği anda ise derin bir haz, coşku ve rahatlama yaşadığını ifade ediyor.",
            "Kritik adli dışlama: Yangınları bir terör eylemi, sigorta parası alma (maddi çıkar), intikam alma ya da bir hezeyanın emriyle ÇIKARMADIĞI kesinleşmiştir.",
            "Toksikoloji ve kranial MRG temizdir.",
            "Ruhsal Durum Muayenesinde: Yangına, itfaiye araçlarına ve alev ekipmanlarına karşı aşırı çekim/büyülenme, dürtü denetim defisiti ve eylem sonrası rahatlama.",
            "DSM-5'e göre: Birden çok kez, kasıtlı ve amaca yönelik biçimde yangın çıkarma; eylemden önce gerginlik ve yangını çıkarırken/izlerken yoğun haz, doyum veya rahatlama yaşama tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "Yangını çıkarmadan hemen önce",
                "dsmMatch": "DSM-5 Kriter B & C: Eylemden önce gerginlik/duygusal uyarılma ve eylem sırasında haz/rahatlama"
            },
            {
                "clueIndex": 2,
                "text": "sigorta parası alma",
                "dsmMatch": "DSM-5 Kriter E: Yangın çıkarma parasal kazanç, intikam ya da suç örtbas etme amacıyla yapılmaz"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi & Yangın Güvenliği Farkındalık Eğitimi",
            "therapyDetails": "Gizli duyarsızlaştırma (yangının yıkıcı sonuçlarını zihinsel canlandırma), gevşeme egzersizleri ve alternatif heyecan arama kanalları.",
            "pharmacologyNote": "SSRI'lar veya duygudurum dengeleyiciler dürtü kontrolünü desteklemek için denenebilir."
        },
        "miniQuiz": {
            "question": "Adli psikolojide Kundakçılık (Arson) ile Piromani arasındaki en temel fark nedir?",
            "options": [
                "Kundakçılıkta maddi çıkar (sigorta parası), intikam veya siyasi bir amaç vardır; Piromanide ise tek amaç yangın öncesi gerginliği dindirmek ve alevlerden dürtüsel haz almaktır.",
                "Piromani sadece itfaiyecilerde görülür.",
                "Kundakçılar asla yakalanmaz.",
                "İki kavram tamamen aynıdır."
            ],
            "correctIndex": 0,
            "explanation": "Kundakçılık (Arson) maddi, intikam veya ideolojik amaçla yapılan bir suçtur. Piromani ise parasal/kişisel çıkar gütmeyen saf bir psikiyatrik dürtü kontrol bozukluğudur."
        },
        "differentialDiagnosis": "• Kundakçılık (Arson): Maddi kazanç veya intikam vardır.\n• Davranım Bozukluğu / Antisosyal KB: Yangın çıkarma genel kural tanımazlığın parçasıdır.",
        "dsmCriteriaSummary": "DSM-5: Birden çok kez kasıtlı yangın çıkarma + Eylem öncesi gerginlik + Eylem anında haz/rahatlama + Yangına büyülenme + Maddi/intikam çıkarının olmaması.",
        "therapyId": "cbt_general",
        "pharmacologyId": "naltrexone_acamprosate",
        "explanation": {
            "whyThis": [
                "Bir yıl içinde beş kez kasıtlı ve amaçlı yangın çıkarma, birden çok kez yangın çıkarma ölçütünü karşılar.",
                "Eylemden önce gerginlik ve uyarılma, yangını izlerken haz ve rahatlama ile yangına ve itfaiye ekipmanına büyülenme tanının özgül özellikleridir.",
                "Maddi çıkar, intikam, ideoloji ya da sanrı gibi bir amaç kesin olarak dışlanmıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "conduct_disorder",
                    "reason": "Kişi 26 yaşındadır ve yangın dışında hak ihlali içeren genel bir davranış örüntüsü tarif edilmiyor."
                },
                {
                    "diagnosisId": "antisocial_pd",
                    "reason": "Yangın genel bir kural tanımazlığın ya da çıkarın parçası değil, hazza yönelik tekil bir dürtüdür; çocukluk davranım öyküsü bildirilmiyor."
                },
                {
                    "diagnosisId": "bipolar_1",
                    "reason": "Yangınlar manik bir dönemin dürtüselliği sırasında değil, kendi başına yineleyen bir örüntü olarak ortaya çıkıyor; bu yine de sorgulanmalıdır."
                }
            ],
            "teachingPoint": "Piromani tanısı, çıkar, intikam, sanrı ya da başka bir bozukluk yangını açıklıyorsa konamaz; geriye haz ve gerilim boşaltma kalmalıdır."
        }
    },
    {
        "id": "case-056",
        "caseNumber": 56,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "separation_anxiety",
        "category": "ANXIETY",
        "patientSummary": "29 yaşında, kadın, finans analisti",
        "clues": [
            "Danışan, eşi iş seyahatine gittiğinde veya yanından 1 saatliğine ayrıldığında 'Eşimin başına trafik kazası gelecek, ölecek veya onu bir daha asla göremeyeceğim' dehşetiyle panikleyip eşini dakikada bir aradığını ve evde tek başına asla uyuyamadığını anlatıyor.",
            "Eşinin olmadığı gecelerde korkudan annesinin evine gidip onunla aynı yatakta yatmakta, eşinin ayrı seyahat gerektiren terfi tekliflerini reddetmesi için baskı yapmaktadır.",
            "Geceleri sürekli eşinin ya da kendisinin kaçırıldığı veya öldüğü temalı kabuslar görmektedir.",
            "Genel tıbbi değerlendirme temizdir; panik bozukluk veya agorafobi kriterlerini tam karşılamamaktadır.",
            "Ruhsal Durum Muayenesinde: Bağlanma figüründen ayrılmaya ilişkin gelişimsel olarak uygunsuz ve aşırı korku, ayrılık anlarında somatik belirtiler (mide bulantısı, çarpıntı).",
            "DSM-5'e göre: Bağlandığı kişilerden ayrılmayla ilgili, gelişimsel düzeye uygun olmayan ve en az 6 ay süren aşırı korku veya kaygı duyma örüntüsüdür."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "Eşimin başına trafik kazası gelecek, ölecek veya onu bir daha asla göremeyeceğim",
                "dsmMatch": "DSM-5 Kriter 1 & 2: Bağlanılan kişinin başına kötü bir şey geleceğine dair sürekli aşırı kaygı"
            },
            {
                "clueIndex": 1,
                "text": "annesinin evine gidip",
                "dsmMatch": "DSM-5 Kriter 5 & 6: Bağlanılan kişi yanında olmadan evde yalnız kalma veya uyuma korkusu"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi (Kademeli Ayrılık Maruz Bırakması & Şema Terapi)",
            "therapyDetails": "'Terk Edilme' ve 'Bağımlılık' şemalarını çalışma, tek başına kalma toleransı geliştirme ve felaketleştirici bilişleri yeniden yapılandırma.",
            "pharmacologyNote": "SSRI grubu antidepresanlar ayrılık anksiyetesini hafifletmede birinci basamaktır."
        },
        "miniQuiz": {
            "question": "DSM-5 ile birlikte Ayrılma Kaygısı Bozukluğu tanısında yapılan en önemli revizyon nedir?",
            "options": [
                "Daha önce sadece çocukluk/ergenlik dönemine ait bir tanı iken, yetişkinlikte de başlayabileceği kabul edilerek yetişkinler için de tanı ölçütü eklenmiştir (Süre yetişkinde ≥ 6 ay).",
                "Bu tanı tamamen kaldırılmıştır.",
                "Tanı sadece erkeklere özgü kılınmıştır.",
                "Sadece hayvanlardan ayrılma korkusu haline getirilmiştir."
            ],
            "correctIndex": 0,
            "explanation": "DSM-IV'te çocukluk çağı bozukluğu olan Ayrılma Kaygısı, DSM-5'te yetişkinleri de kapsayacak şekilde genel Anksiyete Bozuklukları kategorisine taşınmıştır."
        },
        "differentialDiagnosis": "• Bağımlı Kişilik Bozukluğu: Bağımlı kişi karar alma desteği arar; Ayrılma kaygısında ise figürün başına felaket gelmesi dehşeti vardır.\n• Agorafobi: Kaçamama korkusudur.",
        "dsmCriteriaSummary": "DSM-5 (En az 3/8): Bağlanma figürünün kaybı korkusu, ayrılma korkusuyla evden çıkamama, yalnız kalamama, yalnız uyuyamama, kabuslar, ayrılıkta bedensel belirtiler. Süre: Çocukta ≥ 4 hafta, Yetişkinde ≥ 6 ay.",
        "therapyId": "schema_therapy",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Eşinden ayrıldığında ona kaza gibi bir felaket geleceği korkusu, bağlanma figürüne zarar gelmesiyle ilgili aşırı kaygıdır.",
                "Evde yalnız uyuyamama, eşi yokken annesinin yanında yatma ve eşinin seyahatini engellemeye çalışma ayrılıktan kaçınma davranışlarıdır.",
                "Ayrılık temalı kabuslar ve ayrılık anında bedensel belirtiler ek ölçütlerdir; belirtiler erişkinde gelişim düzeyine uygun değildir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "dependent_pd",
                    "reason": "Kaygının odağı karar verme ve bakılma desteği değil, ayrılınca sevilen kişinin başına felaket geleceği korkusudur."
                },
                {
                    "diagnosisId": "agoraphobia",
                    "reason": "Korku kaçışın zor olduğu yerlerle değil, bağlanma figüründen ayrılmakla ilgilidir; agorafobi ölçütleri karşılanmıyor."
                },
                {
                    "diagnosisId": "gad",
                    "reason": "Kaygı birçok yaşam alanına yayılmamış, ayrılık temasıyla sınırlıdır."
                }
            ],
            "teachingPoint": "Ayrılma kaygısı bozukluğu yalnızca çocukluk tanısı değildir; erişkinde de ayrılığa odaklı felaket korkusu ve kaçınma ile konabilir (erişkinde en az 6 ay)."
        }
    },
    {
        "id": "case-057",
        "caseNumber": 57,
        "difficulty": "Kolay",
        "course": "ADULT",
        "diagnosisId": "specific_phobia",
        "category": "ANXIETY",
        "patientSummary": "24 yaşında, kadın, stajyer hemşire",
        "clues": [
            "Danışan kan gördüğünde, aşı/enjeksiyon yaptırırken veya bir yara pansumanına tanık olduğunda önce kısa bir kalp hızlanması yaşadığını, hemen ardından tansiyonunun ve nabzının aniden dibe vurarak bayıldığını (senkop geçirdiğini) anlatıyor.",
            "Önemli ve tipik fizyolojik özellik: Diğer tüm fobilerde (örneğin köpek veya yükseklik) sempatik sistem aktive olup tansiyon YÜKSELİRKEN; bu hastada bifazik vazovagal yanıtla parasempatik deşarj oluşmakta ve hasta bayılmaktadır.",
            "Bu bayılma korkusu yüzünden hastane stajlarını yapamaz hale gelmiş ve kan tahlili yaptırmaktan ısrarla kaçınmaktadır.",
            "Kardiyolojik ve nörolojik elektrofizyolojik testler (Tilt-table, EKG) vazovagal senkop paternini doğrulamıştır.",
            "Ruhsal Durum Muayenesinde: Kan, enjeksiyon ve yaralanma uyaranlarına karşı özgül kaçınma ve vazovagal fobi tablosu.",
            "DSM-5'e göre: Kan, enjeksiyon ya da yaralanma durumlarıyla ilgili belirgin ve orantısız korku/kaçınma (Kan-Enjeksiyon-Yaralanma Tipi Özgül Fobi) mevcuttur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "tansiyonunun ve nabzının aniden dibe vurarak bayıldığını",
                "dsmMatch": "DSM-5 Özgül Belirleyici: Kan-Enjeksiyon-Yaralanma Tipi (Bifazik vazovagal senkop yanıtı)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Uygulamalı Kas Gerdirme Tekniği (Applied Tension / Öst Protokolü)",
            "therapyDetails": "Kan görmeden hemen önce kol, bacak ve gövde kaslarını sıkarak kan basıncını yükseltme ve bayılmayı önleme egzersizleri.",
            "pharmacologyNote": "Genellikle ilaç tedavisi gerekmez; kas gerdirme ile başarı oranı %90'dır."
        },
        "miniQuiz": {
            "question": "Kan-Enjeksiyon-Yara Fobisini diğer tüm özgül fobilerden ayıran benzersiz fizyolojik özellik nedir?",
            "options": [
                "Diğer fobilerde tansiyon yükselirken, bu fobide bifazik vazovagal refleksle nabız ve tansiyonun aniden düşerek bayılmaya (senkopa) yol açması.",
                "Hastanın uçaktan korkması.",
                "Bu fobinin sadece uykuda ortaya çıkması.",
                "Hastanın hafızasını tamamen kaybetmesi."
            ],
            "correctIndex": 0,
            "explanation": "Kan-enjeksiyon-yara fobisi, sempatik aktivasyon sonrası ani parasempatik aşırı uyarılmayla bradikardi ve hipotansiyona yol açan tek fobik tablodur."
        },
        "differentialDiagnosis": "• Panik Bozukluk: Panik atakta taşikardi ve hipertansiyon olur, bayılma neredeyse hiç görülmez.\n• Epilepsi: EEG temizdir.",
        "dsmCriteriaSummary": "DSM-5: Kan, enjeksiyon ve yara durumlarına karşı orantısız korku ve kaçınma (Bifazik vazovagal yanıtla birlikte). Süre ≥ 6 ay.",
        "therapyId": "applied_tension",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Kan, enjeksiyon ve yara görmeye karşı korku ve kaçınma, korkunun özgül bir uyaran grubuna bağlı olduğunu gösterir.",
                "Önce kısa bir kalp hızlanması, ardından tansiyon ve nabız düşüşüyle bayılma, bu alt tipe özgü iki evreli vazovagal yanıttır.",
                "Staj yapamama ve kan tahlilinden kaçınma belirgin işlev kaybını gösterir; tilt testi vazovagal örüntüyü doğrulamıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "panic_disorder",
                    "reason": "Ataklar beklenmedik değil, kan ve enjeksiyon uyaranına bağlıdır; panik atakta bayılma değil, sürekli sempatik uyarılma beklenir."
                },
                {
                    "diagnosisId": "illness_anxiety_disorder",
                    "reason": "Kan tahlilinden kaçınma hasta olma korkusundan değil, kanı görme ve bayılma tepkisinden kaynaklanır."
                },
                {
                    "diagnosisId": "conversion_disorder",
                    "reason": "Bayılmalar tilt testiyle doğrulanan fizyolojik bir vazovagal yanıttır ve yalnızca belirli uyaranla ortaya çıkar."
                }
            ],
            "teachingPoint": "Kan-enjeksiyon-yaralanma tipi fobi, bayılmaya yol açan iki evreli vazovagal yanıtla diğer fobilerden ayrılan tek alt tiptir."
        }
    },
    {
        "id": "case-058",
        "caseNumber": 58,
        "difficulty": "Zor",
        "course": "ADULT",
        "diagnosisId": "schizoaffective",
        "category": "PSYCHOTIC",
        "patientSummary": "34 yaşında, erkek, müzisyen",
        "clues": [
            "Danışan son 2 yıldır hem taşkın manik dönemler yaşamakta hem de bu manik dönemlerin tamamen dışında; duygudurumu normalken tam 3 hafta boyunca aralıksız 'FBI'ın kendisini uydudan dinlediği sanrıları ve gaipten gelen emir veren sesler' yaşadığını anlatıyor.",
            "Kritik tanısal anahtar: Şizofreni kriterlerini karşılayan bu sanrı ve varsanılar, belirgin bir duygudurum atağı (mani veya depresyon) OLMADIĞI dönemde en az 2 hafta boyunca tek başına sürmüştür.",
            "Hastalık süresinin toplamında ise manik epizod ölçütleri aktif ve kalıcı dönemlerin önemli bir kısmında tabloya eşlik etmiştir.",
            "Beyin MRG ve toksikoloji taraması olağandır.",
            "Ruhsal Durum Muayenesinde: Psikotik hezeyanlar, işitsel varsanılar ile birlikte epizodik bipolar manik dalgalanmalar.",
            "DSM-5'e göre: Şizofreninin A ölçütünü karşılayan belirtilerle eşzamanlı olarak bir Majör Duygudurum Döneminin (Mani/Depresyon) bulunması VE yaşam boyu hastalık süresi içinde duygudurum belirtileri olmaksızın en az 2 hafta süren sanrı ya da varsanıların varlığıdır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "tamamen dışında",
                "dsmMatch": "DSM-5 Kriter B: Belirgin bir duygudurum dönemi olmaksızın en az 2 hafta süren sanrılar ya da varsanılar"
            },
            {
                "clueIndex": 2,
                "text": "manik epizod ölçütleri aktif",
                "dsmMatch": "DSM-5 Kriter C: Duygudurum dönemi ölçütlerini karşılayan belirtilerin hastalığın toplam süresinin çoğunda bulunması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Kombine BDT & Psikososyal Destek",
            "therapyDetails": "Psikotik belirtiler ve duygudurum dalgalanmalarını yönetme, erken uyarı işaretleri ve stres azaltma.",
            "pharmacologyNote": "Atipik antipsikotikler (Paliperidon FDA onaylı) + Duygudurum dengeleyiciler (Lityum/Valproat) kombine edilir."
        },
        "miniQuiz": {
            "question": "Şizoaffektif Bozukluk ile Psikotik Özellikli Bipolar I Bozukluk arasındaki en kritik ayrım nedir?",
            "options": [
                "Şizoaffektifte duygudurum atağı (mani/depresyon) TAMAMEN DÜZELDİĞİNDE BİLE en az 2 hafta boyunca tek başına devam eden psikotik sanrı/varsanılar vardır; Bipolar I'de ise psikoz SADECE manik/depresif dönem sırasında ortaya çıkar.",
                "Şizoaffektif bozuklukta hasta hiç konuşamaz.",
                "Bipolar I'de psikoz görülmesi imkansızdır.",
                "İki hastalık tamamen aynıdır."
            ],
            "correctIndex": 0,
            "explanation": "DSM-5 Kriter B gereğince, duygudurum dönemi yokken tek başına en az 2 hafta süren psikotik semptomların varlığı Şizoaffektif Bozukluğu bipolar psikozdan ayıran kilit ölçüttür."
        },
        "differentialDiagnosis": "• Psikotik Özellikli Bipolar: Psikoz sadece manik dönemde vardır; maniden bağımsız 2 hafta psikoz olmaz.\n• Şizofreni: Duygudurum dönemleri sürenin az bir kısmını kapsar.",
        "dsmCriteriaSummary": "DSM-5: Şizofreni A kriteri + Majör duygudurum dönemi eşzamanlılığı + Duygudurum atağı YOKKEN en az 2 hafta süren sanrı/varsanı varlığı.",
        "therapyId": "cbtp",
        "pharmacologyId": "atypical_ap_secondgen",
        "explanation": {
            "whyThis": [
                "FBI tarafından dinlendiği sanrısı ve emir veren sesler şizofreninin aktif faz ölçütünü karşılar.",
                "Bu psikotik belirtiler duygudurum normalken üç hafta boyunca tek başına sürmüştür; şizoaffektif bozukluk için gereken ‘en az iki hafta duygudurum epizodu olmadan psikoz’ koşulu sağlanır.",
                "Manik epizodlar hastalığın toplam süresinin büyük bölümünde tabloya eşlik etmiştir; bu da bipolar tip belirtecine işaret eder."
            ],
            "whyNot": [
                {
                    "diagnosisId": "bipolar_1",
                    "reason": "Psikotik özellikli bipolar bozuklukta sanrı ve varsanılar yalnızca duygudurum epizodu içinde görülür; burada maniden bağımsız üç haftalık psikoz vardır."
                },
                {
                    "diagnosisId": "schizophrenia",
                    "reason": "Şizofrenide duygudurum epizodları toplam sürenin yalnızca küçük bir kısmını kaplar; burada manik dönemler hastalığın önemli bölümüne eşlik ediyor."
                },
                {
                    "diagnosisId": "substance_induced_psychotic",
                    "reason": "Toksikoloji taraması olağandır."
                }
            ],
            "teachingPoint": "Şizoaffektif tanı için iki koşul birlikte gerekir: duygudurum epizodu olmadan en az iki hafta psikoz ve hastalık süresinin çoğunda duygudurum epizodlarının bulunması."
        }
    },
    {
        "id": "case-059",
        "caseNumber": 59,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "schizophreniform",
        "category": "PSYCHOTIC",
        "patientSummary": "23 yaşında, kadın, yeni mezun mühendis",
        "clues": [
            "Danışan son 2.5 aydır şirket yöneticilerinin bilgisayar ekranından kendisini izlediğini, düşüncelerinin çalındığını iddia etmekte ve odasında kendi kendine gülüp kimsenin duymadığı seslerle tartışmaktadır.",
            "Bu aktif hezeyan ve halüsinasyonlar tam 2.5 aydır kesintisiz devam etmekte olup ailesi tarafından kliniğe getirilmiştir.",
            "Kritik süre kuralı: Bozukluğun toplam süresi (öncül ve aktif dönemler dahil) 1 ayı geçmiş ANCAK HENÜZ 6 AYI DOLDURMAMIŞTIR (toplam 2.5 ay).",
            "Kranial MRG, EEG ve kan toksikolojisi negatiftir.",
            "Ruhsal Durum Muayenesinde: Düşünce içeriğinde persekütuar sanrılar, işitsel varsanılar, çağrışım dağınıklığı ve uygunsuz duygulanım.",
            "DSM-5'e göre: Şizofreninin A ölçütünü karşılayan (sanrı, varsanı, dezorganizasyon), en az 1 ay süren ancak 6 aydan daha kısa süren bir epizoddur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 2,
                "text": "1 ayı geçmiş ANCAK HENÜZ 6 AYI DOLDURMAMIŞTIR (toplam 2.5 ay)",
                "dsmMatch": "DSM-5 Kriter B: Bir atağın süresi en az 1 aydır ancak 6 aydan daha kısadır"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Erken Psikoz Müdahalesi & BDT (CBTp)",
            "therapyDetails": "İçgörüyü koruma, stres faktörlerini hafifletme ve sosyal işlevselliği destekleme.",
            "pharmacologyNote": "İkinci kuşak antipsikotik ilaçlar (Risperidon, Olanzapin, Aripiprazol) hızla başlanır."
        },
        "miniQuiz": {
            "question": "Bu genç kadının psikotik belirtileri düzelmeden devam eder ve 6. ayı doldurursa resmi DSM-5 tanısı neye dönüşür?",
            "options": [
                "Şizofreni",
                "Kısa Psikotik Bozukluk",
                "Sanrılı Bozukluk",
                "Şizoaffektif Bozukluk"
            ],
            "correctIndex": 0,
            "explanation": "Şizofreniform bozukluk 1-6 ay arası sürer; belirtiler 6 ayı geçtiği anda tanı otomatik olarak Şizofreni olur."
        },
        "differentialDiagnosis": "• Kısa Psikotik Bozukluk: Süre < 1 aydır.\n• Şizofreni: Toplam süre en az 6 aydır.",
        "dsmCriteriaSummary": "DSM-5: Şizofreni A ölçütleri (sanrı, varsanı vb.) + Sürenin en az 1 ay ile en fazla 6 ay arasında olması.",
        "therapyId": "cbtp",
        "pharmacologyId": "atypical_ap_secondgen",
        "explanation": {
            "whyThis": [
                "İzlendiği ve düşüncelerinin çalındığı sanrıları, işitsel varsanılar ve çağrışım dağınıklığı şizofreninin aktif faz ölçütünü karşılar.",
                "Prodrom dahil toplam süre iki buçuk aydır, yani bir ayı aşmış ama altı ayı doldurmamıştır.",
                "MRG, EEG ve toksikoloji negatiftir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "brief_psychotic",
                    "reason": "Belirtiler bir aydan uzun sürmektedir; kısa psikotik bozukluk bir aydan kısa ve tam düzelme ile sınırlıdır."
                },
                {
                    "diagnosisId": "schizophrenia",
                    "reason": "Toplam süre henüz altı aya ulaşmamıştır; belirtiler sürerse tanı şizofreniye dönüşebilir."
                },
                {
                    "diagnosisId": "delusional_disorder",
                    "reason": "Belirgin varsanılar, dezorganizasyon ve uygunsuz duygulanım sanrılı bozuklukla bağdaşmaz."
                }
            ],
            "teachingPoint": "Şizofreniform tanısı henüz iyileşme olmamışsa ‘geçici’ olarak konur; altı ay dolduğunda tablo sürüyorsa tanı şizofreni olarak değiştirilir."
        }
    },
    {
        "id": "case-060",
        "caseNumber": 60,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "delusional_disorder",
        "category": "PSYCHOTIC",
        "patientSummary": "31 yaşında, kadın, idari sekreter",
        "clues": [
            "Danışan son 8 aydır ünlü ve evli bir pop şarkıcısının televizyon konserlerinde söylediği şarkı sözleriyle ve giydiği ceket renkleriyle 'kendisine gizli aşk mesajları gönderdiğine ve aslında deliler gibi kendisine aşık olduğuna' sarsılmaz bir şekilde inanmaktadır.",
            "Şarkıcının menajerlik ofisine yüzlerce aşk mektubu ve hediye göndermiş; şarkıcının korumaları tarafından uzaklaştırıldığında ise 'Aşkımızı medyadan saklamak için böyle numara yapıyor' diyerek inancını korumuştur.",
            "Kritik ayırt edici özellik: Bu tekil aşk sanrısı dışında hastanın bilişsel muhakemesi, iş yerindeki performansı, giyim kuşamı ve günlük yaşamı TAMAMEN KUSURSUZ VE NORMALDİR; Şizofrenideki gibi genel bir yıkım yoktur.",
            "Nörolojik taramalar ve toksikoloji temizdir.",
            "Ruhsal Durum Muayenesinde: Erotomanik sanrı (yüksek statülü birinin kendisine gizlice aşık olduğu hezeyanı), içgörü yokluğu, kapsüllenmiş düşünce yapısı.",
            "DSM-5'e göre: En az 1 ay süren bir ya da daha çok sanrının varlığı ve sanrının alt tipinin 'Erotomanik Tip' olması tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "aslında deliler gibi kendisine aşık olduğuna' sarsılmaz bir şekilde inanmaktadır",
                "dsmMatch": "DSM-5 Belirleyici: Erotomanik Tip (Başka bir kişinin, genellikle daha üst konumdaki birinin kendisine aşık olduğu sanrısı)"
            },
            {
                "clueIndex": 2,
                "text": "günlük yaşamı TAMAMEN KUSURSUZ VE NORMALDİR",
                "dsmMatch": "DSM-5 Kriter C: Sanrının doğrudan etkisi dışında işlevsellik belirgin olarak bozulmamıştır"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Destekleyici Psikoterapi & Gerçeklik Testi",
            "therapyDetails": "Sanrıyı doğrudan aşağılamadan terapötik güven kurma, takip (stalking) davranışlarını engelleme ve yasal sınırları koruma.",
            "pharmacologyNote": "İkinci kuşak antipsikotikler (Pimozid, Risperidon, Aripiprazol) sanrı yoğunluğunu azaltmada kullanılır."
        },
        "miniQuiz": {
            "question": "Erotomanik tip sanrılı bozukluk klasik psikiyatride hangi sendrom ismiyle de bilinir?",
            "options": [
                "De Clérambault Sendromu",
                "Cotard Sendromu",
                "Capgras Sendromu",
                "Othello Sendromu"
            ],
            "correctIndex": 0,
            "explanation": "Üst konumdaki birinin kendisine aşık olduğuna inanılan erotomanik sanrı tablosu klasik literatürde 'De Clérambault Sendromu' olarak bilinir."
        },
        "differentialDiagnosis": "• Şizofreni: Şizofrenide varsanılar, künt duygulanım ve dezorganizasyon vardır; burada işlevsellik tamdır.\n• Narsisistik KB: Narsistte sanrı değil büyüklenme vardır.",
        "dsmCriteriaSummary": "DSM-5: En az 1 ay süren erotomanik sanrı + Şizofreni A ölçütünün olmaması + Sanrı dışındaki alanlarda işlevselliğin korunması.",
        "therapyId": "psychodynamic",
        "pharmacologyId": "pimozide_delusional",
        "explanation": {
            "whyThis": [
                "Ünlü ve evli bir şarkıcının kendisine gizlice âşık olduğu inancı sekiz aydır sarsılmaz biçimde sürer; bu, erotomanik tip sanrıdır.",
                "Korumalarca uzaklaştırılmayı bile ‘aşkı saklama’ olarak yorumlaması, inancın karşıt kanıtlara rağmen değişmediğini gösterir.",
                "Sanrı dışında muhakeme, iş performansı ve görünüm tamamen korunmuştur; varsanı ve dezorganizasyon yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "schizophrenia",
                    "reason": "İkinci bir aktif faz belirtisi (varsanı, dezorganizasyon, negatif belirti) yoktur ve işlevsellik korunmuştur."
                },
                {
                    "diagnosisId": "bipolar_1",
                    "reason": "Erotomanik inanç manide de görülebilir, ancak taşkın duygudurum, azalmış uyku gibi manik belirtiler tarif edilmiyor."
                },
                {
                    "diagnosisId": "narcissistic_pd",
                    "reason": "Büyüklenmeci bir benlik algısı değil, belirli ve sabit bir sanrı vardır."
                }
            ],
            "teachingPoint": "Sanrılı bozukluk sanrının içeriğine göre alt tiplere ayrılır (erotomanik, büyüklük, kıskançlık, kötülük görme, bedensel); tiplendirme ayırıcı tanıyı değiştirmez ama tabloyu tanımlar."
        }
    },
    {
        "id": "case-061",
        "caseNumber": 61,
        "difficulty": "Orta",
        "course": "FORENSIC",
        "diagnosisId": "delusional_disorder",
        "category": "PSYCHOTIC",
        "patientSummary": "48 yaşında, erkek, oto galeri sahibi",
        "clues": [
            "Danışan son 1 yıldır 25 yıllık eşinin kendisini mahalledeki bakkalla, komşularıyla ve hatta yoldan geçen yabancılarla aldattığına dair sarsılmaz bir hezeyan yaşamakta; eşinin yatak çarşaflarını mikroskopla incelemekte ve iç çamaşırlarına gizli kimyasal test kitleri sürmektedir.",
            "Eşinin telefonuna casus takip cihazları yerleştirmiş, perdeleri kapatıp evi hapishaneye çevirmiş ancak hiçbir kanıt bulamamasına rağmen 'Benden çok zekice saklıyorlar' diyerek inancından milim geri adım atmamaktadır.",
            "Önemli klinik nokta: Bu aldatılma hezeyanı dışında hastanın iş hayatı, muhasebe hesaplamaları, arkadaş ilişkileri ve genel entelektüel kapasitesi TAMAMEN KORUNMUŞTUR.",
            "Beyin BT taraması ve toksikoloji temizdir; alkol kullanımına bağlı organik kıskançlık dışlanmıştır.",
            "Ruhsal Durum Muayenesinde: Kıskançlık (jealous) sanrısı, kapsüllenmiş hezeyan ve potansiyel adli şiddet riski.",
            "DSM-5'e göre: En az 1 ay süren bir ya da daha çok sanrının bulunması ve alt tipin 'Kıskançlık Tipi' olması tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "eşinin kendisini",
                "dsmMatch": "DSM-5 Belirleyici: Kıskançlık Tipi (Eşinin ya da sevgilisinin sadakatsiz olduğu sanrısı - Othello Sendromu)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi & Güvenlik Yönetimi",
            "therapyDetails": "Eşe yönelik şiddet ve tehdit riskini değerlendirme, takip davranışlarını sınırlama ve şüpheleri sorgulama.",
            "pharmacologyNote": "Antipsikotik ilaç tedavisi (Paliperidon, Olanzapin) esastır; adli risk nedeniyle yakın izlem gerekir."
        },
        "miniQuiz": {
            "question": "Eşin sadakatsiz olduğuna dair sarsılmaz patolojik sanrılarla giden bu tablo klasik edebiyat ve psikiyatride hangi isimle anılır?",
            "options": [
                "Othello Sendromu",
                "Münchausen Sendromu",
                "Tourette Sendromu",
                "Ganser Sendromu"
            ],
            "correctIndex": 0,
            "explanation": "Shakespeare'in tragedyasından esinlenerek patolojik kıskançlık hezeyanlarına 'Othello Sendromu' adı verilir."
        },
        "differentialDiagnosis": "• Paranoid Kişilik Bozukluğu: Paranoid KB'de genel bir güvensizlik karakteri vardır; burada ise spesifik sarsılmaz bir aldatılma sanrısı vardır.\n• Şizofreni: Halüsinasyon ve genel yıkım yoktur.",
        "dsmCriteriaSummary": "DSM-5: En az 1 ay süren kıskançlık sanrısı + Şizofreni A ölçütünün olmaması + Sanrı konusu dışında işlevselliğin korunması.",
        "therapyId": "cbtp",
        "pharmacologyId": "pimozide_delusional",
        "explanation": {
            "whyThis": [
                "Eşinin birçok kişiyle aldattığına dair bir yıldır süren, hiçbir kanıt bulunamamasına rağmen sarsılmayan inanç kıskançlık tipi sanrıdır.",
                "Çarşafları incelemek, kimyasal test ve takip cihazı kullanmak davranışların sanrının içeriğiyle sınırlı olduğunu gösterir.",
                "İş, hesap yapma ve arkadaş ilişkileri korunmuştur; varsanı ya da dezorganizasyon yoktur ve alkol nedeni dışlanmıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "paranoid_pd",
                    "reason": "Genel bir kuşkuculuk değil, tek bir konuda karşıt kanıtlarla sarsılmayan sanrısal bir kesinlik vardır."
                },
                {
                    "diagnosisId": "schizophrenia",
                    "reason": "Varsanı, dezorganizasyon ya da negatif belirti yoktur; işlevsellik sanrı dışında korunmuştur."
                },
                {
                    "diagnosisId": "alcohol_use_disorder",
                    "reason": "Patolojik kıskançlık alkol kullanımıyla sık görülür, ancak burada alkol kullanımı ve buna bağlı organik neden dışlanmıştır."
                }
            ],
            "teachingPoint": "Kıskançlık sanrısında ilk dışlanacak nedenler alkol kullanımı ve beyin hastalığıdır; dışlanınca sanrının işlevselliği bozmayan ‘kapsüllü’ yapısı sanrılı bozukluğu destekler."
        }
    },
    {
        "id": "case-062",
        "caseNumber": 62,
        "difficulty": "Zor",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "conversion_disorder",
        "category": "SOMATIC",
        "patientSummary": "21 yaşında, kadın, üniversite öğrencisi",
        "clues": [
            "Danışan son 3 aydır final sınavları öncesinde ve aile içi şiddetli tartışmalar sırasında aniden yere düşüp tüm vücudunda titremeler, başını iki yana sallama (pelvik thrusting) ve kollarını savurma şeklinde günde 2-3 kez bayılma nöbetleri geçirdiği için epilepsi şüphesiyle getiriliyor.",
            "Video-EEG monitorizasyonunda: Hasta nöbet anında tüm vücuduyla şiddetli kasılmalar sergilerken, eşzamanlı beyin EEG kaydında HİÇBİR EİLEPTİK İKTAL DEŞARJ (epilepsi dalgası) SAPTANMAMIŞTIR.",
            "Nöbet sırasında gözlerini sıkıca kapalı tuttuğu ve göz kapakları açılmaya çalışıldığında aktif bir direnç gösterdiği; nöbet sonrası post-iktal konfüzyonun olmadığı saptanmıştır.",
            "Kranial MRG ve kan prolaktin düzeyleri normaldir (organik grand-mal nöbet dışlanmıştır).",
            "Ruhsal Durum Muayenesinde: Psikojenik non-epileptik nöbet (PNES / yalancı nöbet), stresörle tetiklenen dissosiyatif motor boşalım.",
            "DSM-5'e göre: İstemli motor işlevlerde değişme (nöbetler) ve belirtinin nörolojik bir hastalıkla (epilepsi) bağdaşmadığını gösteren klinik bulgular mevcuttur (Dönüşüm Bozukluğu - Nöbetler ya da Kasılmalarla Giden)."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "SAPTANMAMIŞTIR",
                "dsmMatch": "DSM-5 Kriter B: Nörolojik durumla (epilepsi) bağdaşmadığına ilişkin klinik/laboratuvar kanıtı"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi & Psikoeğitim",
            "therapyDetails": "Hastaya tanıyı şefkatle ve damgalamadan açıklama (beynin aşırı stres anında sigorta attırması metaforu), duygusal tetikleyicileri tanıma ve antiepileptik ilaçların gereksiz kullanımını sonlandırma.",
            "pharmacologyNote": "Antiepileptik ilaçlar etkisizdir; altta yatan anksiyete/depresyon için SSRI kullanılır."
        },
        "miniQuiz": {
            "question": "Psikojenik Non-Epileptik Nöbetleri (Dönüşüm Bozukluğu) gerçek epileptik nöbetlerden ayıran altın standart tanı aracı nedir?",
            "options": [
                "Eşzamanlı Video-EEG Monitorizasyonu (Nöbet anında beyin dalgalarında epileptik deşarj olmaması)",
                "Akciğer Grafisi",
                "Göz Muayenesi",
                "İdrar Tahlili"
            ],
            "correctIndex": 0,
            "explanation": "Video-EEG monitorizasyonunda nöbet anında epileptik dalgaların görülmemesi, PNES (psikojenik nöbet) tanısı koymada altın standarttır."
        },
        "differentialDiagnosis": "• Gerçek Epilepsi: EEG'de iktal epileptik deşarjlar vardır.\n• Temarruz: Adli kazanç için numara yapmadır.",
        "dsmCriteriaSummary": "DSM-5: Nöbet ya da kasılmalarla giden istemli motor işlev değişikliği + Nörolojik epilepsi ile bağdaşmazlık kanıtı.",
        "therapyId": "cbt_general",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Stresli durumlarda ortaya çıkan, yere düşme ve kasılmalarla giden nöbetler istemli motor işlevde değişikliği gösterir.",
                "Nöbet sırasında video-EEG'de epileptik deşarj olmaması, gözleri sıkıca kapalı tutma, göz açmaya direnç ve nöbet sonrası konfüzyon olmaması nörolojik hastalıkla uyumsuzluğun olumlu kanıtlarıdır.",
                "MRG ve prolaktin normaldir; belirtilerin bilerek üretildiğine dair veri yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "factitious_disorder",
                    "reason": "Nöbetleri bilerek üretme ya da hasta rolü arama davranışına dair bir kanıt yoktur."
                },
                {
                    "diagnosisId": "panic_disorder",
                    "reason": "Stres altında ortaya çıksa da tablo çarpıntı ve korku atakları değil, bilinç ve motor işlevi etkileyen nöbetlerdir."
                },
                {
                    "diagnosisId": "somatic_symptom_disorder",
                    "reason": "Öne çıkan, belirtiye ilişkin aşırı kaygı ve uğraş değil, nörolojik bir işlev belirtisinin kendisidir."
                }
            ],
            "teachingPoint": "Psikojenik non-epileptik nöbet tanısının altın standardı, tipik bir nöbetin video-EEG ile yakalanıp eşzamanlı epileptik aktivite olmadığının gösterilmesidir."
        }
    },
    {
        "id": "case-063",
        "caseNumber": 63,
        "difficulty": "Zor",
        "course": "CHILD",
        "diagnosisId": "arfid",
        "category": "EATING",
        "patientSummary": "8 yaşında, erkek, 2. sınıf öğrencisi",
        "clues": [
            "Danışan son 3 yıldır sadece beyaz renkli ve kuru gıdaları (sadece patates kızartması, kraker ve sade beyaz ekmek) yiyebilmekte; sebze, et, meyve veya soslu hiçbir yiyeceği dokusu, kokusu ve rengi nedeniyle ağzına dahi sürmemektedir.",
            "Kritik tanısal anahtar: Çocukta Anoreksiya veya Bulimiya'daki gibi 'şişmanlama korkusu, kilo takıntısı veya beden imgesi bozukluğu' KESİNLİKLE YOKTUR.",
            "Bu aşırı seçicilik ve kısıtlılık yüzünden büyüme ve gelişme geriliği yaşamakta, vitamin eksiklikleri nedeniyle besin takviyesi almakta ve okul gezilerindeki yemeklere katılamamaktadır.",
            "Genel gastroenterolojik ve alerji testleri temizdir.",
            "Ruhsal Durum Muayenesinde: Besinlerin duyusal özelliklerine karşı aşırı hassasiyet, kilo kaygısından bağımsız gıda kaçınması.",
            "DSM-5'e göre: Uygun beslenme gereksinimlerinin karşılanmasında sürekli bir başarısızlıkla giden; belirgin kilo kaybı, beslenme eksikliği ya da psikososyal işlevsellikte bozulmaya yol açan yeme ya da beslenme bozukluğudur (Beden imgesi bozukluğu olmaksızın)."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "şişmanlama korkusu, kilo takıntısı veya beden imgesi bozukluğu' KESİNLİKLE YOKTUR",
                "dsmMatch": "DSM-5 Kriter C: Vücut ağırlığı ya da biçiminin algılanmasında bir bozukluk olduğuna ilişkin bir kanıt yoktur"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Kaçıngan Yeme Bozukluğu için BDT (CBT-AR) & Duyusal Maruz Bırakma",
            "therapyDetails": "Yeni gıdalara kademeli duyusal temas (koklama, dokunma, tatma) ve gıda repertuvarını genişletme.",
            "pharmacologyNote": "Gerektiğinde iştah açıcı ve kaygı yatıştırıcı düşük doz Mirtazapin veya Siproheptadin kullanılabilir."
        },
        "miniQuiz": {
            "question": "Kaçıngan/Kısıtlı Yiyecek Alımı Bozukluğu (ARFID) ile Anoreksiya Nervoza arasındaki en temel fark nedir?",
            "options": [
                "ARFID'de hastalar kilo almaktan korkmazlar ve beden imgesi takıntıları yoktur; yiyecekleri duyusal özellikleri (koku, doku) veya boğulma/kusma korkusu yüzünden reddederler.",
                "ARFID sadece 60 yaş üstünde görülür.",
                "Anoreksiyada hastalar her şeyi yer.",
                "İki hastalık tamamen aynıdır."
            ],
            "correctIndex": 0,
            "explanation": "ARFID'i Anoreksiya'dan ayıran en kritik kriter, kilo alma korkusu veya şişmanlık hezeyanının kesinlikle bulunmamasıdır."
        },
        "differentialDiagnosis": "• Anoreksiya Nervoza: Kilo alma korkusu ve beden imge bozukluğu vardır.\n• Otizm Spektrum: Duyusal hassasiyet otizme eşlik edebilir.\n• Pika: Besin değeri olmayan maddelerin (toprak, kâğıt, kireç) yenmesidir; bu çocuk normal yiyecekleri duyusal nedenlerle reddediyor.",
        "dsmCriteriaSummary": "DSM-5: Kilo kaybı/besin yetersizliğine yol açan gıda kısıtlaması + Yiyeceğin duyusal özelliklerine hassasiyet + Beden imgesi bozukluğu OLMAMASI.",
        "therapyId": "cbt_ar",
        "pharmacologyId": "mirtazapine_nassa",
        "explanation": {
            "whyThis": [
                "Yalnızca beyaz ve kuru yiyecekleri yemesi ve diğerlerini doku, koku ve renk nedeniyle reddetmesi duyusal özelliklere bağlı bir yiyecek kısıtlamasıdır.",
                "Büyüme geriliği, vitamin takviyesi gereksinimi ve okul etkinliklerine katılamama, kilo korkusu olmadan gelişen beslenme yetersizliğini ve işlev kaybını gösterir.",
                "Gastroenterolojik ve alerji testlerinin temiz olması kısıtlamayı açıklayan tıbbi bir durum olmadığını gösterir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "anorexia_nervosa",
                    "reason": "Kilo alma korkusu, kilo uğraşı ya da beden algısı bozukluğu açıkça yoktur."
                },
                {
                    "diagnosisId": "pica",
                    "reason": "Pikada besin değeri olmayan maddeler (toprak, kâğıt, kireç) yenir; bu çocuk ise normal yiyecekleri duyusal özellikleri nedeniyle reddediyor."
                },
                {
                    "diagnosisId": "asd",
                    "reason": "Duyusal seçicilik otizme eşlik edebilir, ancak sosyal iletişim sorunları ya da başka yineleyici davranışlar tarif edilmiyor; yine de gelişimsel değerlendirme yapılmalıdır."
                }
            ],
            "teachingPoint": "Pika yiyecek olmayan maddeleri yemektir; normal yiyecekleri duyusal nedenlerle reddedip beslenme yetersizliğine giren bir çocukta ARFID düşünülmelidir."
        }
    },
    {
        "id": "case-064",
        "caseNumber": 64,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "bdd",
        "category": "OCD_RELATED",
        "patientSummary": "25 yaşında, erkek, fitness eğitmeni",
        "clues": [
            "Danışan 1.85 boyunda, 92 kilo ve son derece kaslı bir vücut geliştirici olmasına rağmen aynaya baktığında kendisini 'çelimsiz, sıska, kasları yetersiz ve zayıf' gördüğünü söyleyerek günde 5 saat ağırlık çalışmakta ve günde 400 gram protein tüketmektedir.",
            "Kaslarının küçüleceği dehşetiyle arkadaşlarıyla buluşmayı, dışarıda yemek yemeyi ve sosyal hayatını tamamen terk etmiş; kas kütlesini artırmak için sağlığını tehdit eden anabolik steroidler enjekte etmeye başlamıştır.",
            "Günde onlarca kez aynada kollarını ve göğüs kaslarını mezurayla ölçmekte ve yetersiz bulmaktadır.",
            "Kardiyolojik değerlendirmede steroid kullanımına bağlı sol ventrikül hipertrofisi saptanmıştır.",
            "Ruhsal Durum Muayenesinde: Beden Algısı Bozukluğu kapsamında 'Kas Dismorfisi' (Muscle Dysmorphia / Ters Anoreksiya) tablosu.",
            "DSM-5'e göre: Beden Algısı Bozukluğunun bir belirleyicisi olarak; bireyin vücut yapısının çok küçük ya da yeterince kaslı olmadığı düşüncesi üzerine aşırı kafa yormasıdır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "son derece kaslı",
                "dsmMatch": "DSM-5 Belirleyici: Kas Dismorfisi ile Birlikte (Vücudunun yeterince kaslı olmadığı inancı)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi (Kas Dismorfisi Protokolü)",
            "therapyDetails": "Ayna kontrolünü ve kas ölçmeyi bırakma, steroid kullanımını sonlandırma ve değerler odaklı yaşam inşası.",
            "pharmacologyNote": "Yüksek doz SSRI grubu antidepresanlar takıntılı algıyı esnetmede etkilidir."
        },
        "miniQuiz": {
            "question": "Kas Dismorfisi (Bigoreksiya) DSM-5 sınıflandırmasında hangi ana bozukluğun özel bir alt belirleyicisidir?",
            "options": [
                "Beden Algısı Bozukluğu (Beden Dismorfik Bozukluğu - BDD)",
                "Narsisistik Kişilik Bozukluğu",
                "Anoreksiya Nervoza",
                "Şizofreni"
            ],
            "correctIndex": 0,
            "explanation": "Kas Dismorfisi, DSM-5'te Beden Algısı Bozukluğu'nun (BDD) resmi bir tanısal alt belirleyicisidir."
        },
        "differentialDiagnosis": "• Sağlıklı Vücut Geliştirme: Sağlıklı sporcularda steroid kötüye kullanımı, sosyal izolasyon ve ağır beden çarpıtması görülmez.\n• Anoreksiya: Anoreksiyada amaç zayıflamaktır; burada amaç aşırı kaslanmaktır.",
        "dsmCriteriaSummary": "DSM-5: Beden Dismorfik Bozukluğu + 'Kas Dismorfisi ile Birlikte' belirleyicisi (Vücudunun yeterince iri ve kaslı olmadığı inancı).",
        "therapyId": "cbt_general",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "92 kiloluk ve belirgin kaslı biri olarak kendini çelimsiz ve yetersiz kaslı görmesi, başkalarınca fark edilmeyen bir kusurla aşırı uğraştır.",
                "Günde onlarca kez mezura ile ölçüm, beş saat ağırlık çalışması ve aşırı protein alımı bu kaygıya yanıt olarak yapılan yineleyici davranışlardır.",
                "Sosyal yaşamı terk etmesi ve sağlığına zarar veren steroid kullanımı, ‘kas dismorfisi ile’ belirtecine uyan ağır işlev kaybını gösterir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "anorexia_nervosa",
                    "reason": "Amaç zayıflamak değil kas kütlesini artırmaktır ve düşük vücut ağırlığı yoktur."
                },
                {
                    "diagnosisId": "ocd",
                    "reason": "Takıntı ve ritüeller yalnızca beden görünümüne odaklıdır; görünüm dışı obsesyonlar tarif edilmiyor."
                },
                {
                    "diagnosisId": "substance_induced_psychotic",
                    "reason": "Steroid kullanımı tablonun nedeni değil sonucudur; beden algısı uğraşı steroid kullanımından önce başlamıştır."
                }
            ],
            "teachingPoint": "Kas dismorfisi bir yeme bozukluğu değil, BDD'nin bir belirtecidir; ayırıcı nokta amacın zayıflamak değil daha kaslı görünmek olmasıdır."
        }
    },
    {
        "id": "case-065",
        "caseNumber": 65,
        "difficulty": "Kolay",
        "course": "ADULT",
        "diagnosisId": "social_anxiety",
        "category": "ANXIETY",
        "patientSummary": "28 yaşında, erkek, profesyonel konser piyanisti",
        "clues": [
            "Danışan günlük hayatında arkadaşlarıyla kafede otururken, tanımadığı insanlarla sohbet ederken veya alışveriş yaparken hiçbir kaygı YAŞAMAMASINA rağmen; sahneye çıkıp piyano çalması gerektiğinde ellerinde kontrol edilemez bir titreme, kalp çarpıntısı ve bayılacak gibi olma yaşamaktadır.",
            "Sahne korkusu nedeniyle son 6 aydır vereceği tüm solo konserleri iptal etmiş ve uluslararası yarışmalardan çekilmek zorunda kalmıştır.",
            "Sadece topluluk önünde performans sergileme durumuyla sınırlı bu anksiyete, mesleki kariyerini bitirme noktasına getirmiştir.",
            "Nörolojik muayenede esansiyel tremor veya Parkinson dışlanmıştır.",
            "Ruhsal Durum Muayenesinde: Sadece performans durumlarıyla kısıtlı şiddetli performans anksiyetesi.",
            "DSM-5'e göre: Korku ya da kaygı yalnızca topluluk önünde konuşma ya da sergileme/icra etme durumlarıyla sınırlıysa 'Yalnızca Performans' belirleyicisi kullanılır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "günlük hayatında",
                "dsmMatch": "DSM-5 Belirleyici: Yalnızca Performans (Korku sadece topluluk önünde icra etmeyle sınırlıdır)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "BDT (Sanal Gerçeklik & Sahne Maruz Bırakması) & Performans Psikolojisi",
            "therapyDetails": "Performans anında felaketleştirici düşünceleri durdurma, nefes kontrolü ve kademeli seyirci önünde prova.",
            "pharmacologyNote": "Performanstan 45 dakika önce alınan düşük doz Beta-bloker (Propranolol) sempatik taşikardi ve el titremesini bloke etmede altın standarttır."
        },
        "miniQuiz": {
            "question": "Sadece Performans Tipi Sosyal Anksiyete yaşayan sanatçı ve konuşmacılarda sahne öncesi otonomik el titremesi ve taşikardiyi bloke etmek için hangi ilaç grubu tercih edilir?",
            "options": [
                "Beta-blokerler (örn. Propranolol)",
                "Antipsikotikler",
                "Duygudurum Dengeleyiciler",
                "Antibiyotikler"
            ],
            "correctIndex": 0,
            "explanation": "Propranolol gibi beta-adrenerjik blokerler, sahne öncesi sempatik sistemin neden olduğu el titremesi ve çarpıntıyı bloke ederek performansı korur."
        },
        "differentialDiagnosis": "• Yaygın Sosyal Anksiyete: Yaygın tipte sohbet etme, yemek yeme gibi tüm sosyal etkileşimlerde kaygı vardır; burada sadece sahne performansıdır.\n• Panik Bozukluk: Beklenmedik spontane panik ataklar vardır.",
        "dsmCriteriaSummary": "DSM-5: Sosyal Anksiyete Bozukluğu + 'Yalnızca Performans' Belirleyicisi (Topluluk önünde konuşma/sergileme ile sınırlı).",
        "therapyId": "invivo_exposure",
        "pharmacologyId": "propranolol_beta",
        "explanation": {
            "whyThis": [
                "Sahnede çalarken titreme, çarpıntı ve bayılacak gibi olma, başkalarının izleyip değerlendirdiği bir durumda ortaya çıkan belirgin kaygıdır.",
                "Altı aydır solo konserleri iptal etmesi ve yarışmalardan çekilmesi kaçınma ve ciddi mesleki işlev kaybını gösterir.",
                "Sohbet, yemek ve alışveriş gibi diğer sosyal durumlarda kaygı olmaması ‘yalnızca performans’ belirtecine uyar; esansiyel tremor dışlanmıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "panic_disorder",
                    "reason": "Belirtiler yalnızca performans sırasında ortaya çıkıyor; beklenmedik ve tetikleyicisiz ataklar yoktur."
                },
                {
                    "diagnosisId": "specific_phobia",
                    "reason": "Korkunun özü bir ortamın kendisi değil, başkalarınca izlenip olumsuz değerlendirilme olasılığıdır."
                },
                {
                    "diagnosisId": "gad",
                    "reason": "Kaygı birçok yaşam alanına yayılmamış, tek bir sosyal-performans durumuyla sınırlıdır."
                }
            ],
            "teachingPoint": "Kaygı yalnızca topluluk önünde konuşma ya da sahne performansıyla sınırlıysa sosyal kaygı bozukluğuna ‘yalnızca performans’ belirteci eklenir."
        }
    },
    {
        "id": "case-066",
        "caseNumber": 66,
        "difficulty": "Zor",
        "course": "FORENSIC",
        "diagnosisId": "factitious_another",
        "category": "SOMATIC",
        "patientSummary": "32 yaşında, kadın, ev hanımı",
        "clues": [
            "Danışan, 4 yaşındaki öz kızını son 1 yılda 'sürekli açıklanamayan ishal, kusma ve havale nöbetleri' şikayetiyle 14 farklı çocuk hastanesine yatırmış; çocuk defalarca yoğun bakıma alınmıştır.",
            "Hastane güvenlik kamera kayıtları incelendiğinde; annenin hemşireler odadan çıktığı anda gizlice kızının damar yoluna çeşme suyu enjekte ettiği ve sütüne aşırı doz laksatif karıştırdığı tespit edilmiştir.",
            "Kritik adli özellik: Annenin bu korkunç eylemi yaparken hiçbir 'maddi sigorta tazminatı veya nafaka alma amacı' YOKTUR; tek motivasyonu 'hasta bir çocuğun fedakar, kahraman annesi rolünü oynamak ve doktorların övgüsünü almaktır'.",
            "Çocuk annesinden uzaklaştırıldığında tüm semptomlar anında ve tamamen düzelmiştir.",
            "Ruhsal Durum Muayenesinde: Başkasına yüklenen yapay bozukluk (Münchausen by Proxy), ağır patolojik ilgi arayışı ve çocuk istismarı.",
            "DSM-5'e göre: Belirlenebilir bir dış ödül olmaksızın, bir başkasında (genellikle çocuğunda) fiziksel ya da psikolojik belirti ve bulguları bilerek ortaya çıkarma ya da uydurma tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "annenin",
                "dsmMatch": "DSM-5 Kriter A: Bir başkasında fiziksel belirtileri bilerek ortaya çıkarma ya da hastalık uydurma"
            },
            {
                "clueIndex": 2,
                "text": "hiçbir 'maddi sigorta tazminatı",
                "dsmMatch": "DSM-5 Kriter C: Belirgin bir dış ödülün olmaması (Münchausen by Proxy)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Adli Koruma, Çocuğun Güvenliği & Yoğun Psikoterapi",
            "therapyDetails": "Öncelikli adım çocuğun velayetinin derhal alınması ve adli koruma sağlanmasıdır; fail için yoğun kişilik ve sınır terapisi.",
            "pharmacologyNote": "Primer bir medikal tedavisi yoktur; adli psikiyatrik vaka yönetimi gerektirir."
        },
        "miniQuiz": {
            "question": "Başkasına Yüklenen Yapay Bozukluk (Münchausen by Proxy) vakalarında klinik tablonun doğrulanmasında en belirleyici kanıt nedir?",
            "options": [
                "Mağdur çocuk fail olan ebeveynden uzaklaştırıldığında tüm tıbbi belirtilerin anında ortadan kalkması ve sağlıklı hale gelmesi.",
                "Çocuğun genetik testlerinin bozuk çıkması.",
                "Annenin çok zengin olması.",
                "Çocuğun hiç aşı olmamış olması."
            ],
            "correctIndex": 0,
            "explanation": "Münchausen by Proxy vakalarında çocuk fail ebeveynden ayrıldığı anda tıbbi semptomların tamamen kesilmesi tanıyı teyit eden en kritik klinik bulgudur."
        },
        "differentialDiagnosis": "• Temarruz (Numara Yapma): Maddi tazminat veya çıkar için yapılır.\n• Kendine Yüklenen Yapay Bozukluk: Hasta belirtileri kendi vücudunda üretir.",
        "dsmCriteriaSummary": "DSM-5: Başka birinde (çocukta) belirtileri kasten üretme + Bireyin kendini fedakar bakıcı olarak sunması + Belirgin bir dışsal kazancın olmaması.",
        "therapyId": "psychodynamic",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Kızının damar yoluna su enjekte etmesi ve sütüne laksatif katması belirtileri bir başkasında bilerek oluşturmanın kamera kaydıyla belgelenmiş kanıtıdır.",
                "Maddi bir amaç yoktur; motivasyon ‘hasta çocuğun fedakâr annesi’ rolüdür ve çocuk ayrılınca belirtiler düzelmiştir. Tanı failin, yani annenin kendisine konur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "factitious_disorder",
                    "reason": "Kendine yüklenen yapay bozuklukta kişi belirtileri kendi bedeninde üretir; burada anne belirtileri çocuğunun bedeninde oluşturmaktadır."
                },
                {
                    "diagnosisId": "somatic_symptom_disorder",
                    "reason": "Belirtiler gerçek yaşanan değil, bir başkası tarafından yapay olarak üretilmiştir."
                },
                {
                    "diagnosisId": "antisocial_pd",
                    "reason": "Çocuğa zarar verilmektedir, ancak eylemin amacı çıkar değil hasta rolü yoluyla ilgi ve övgüdür; genel bir hak ihlali örüntüsü tarif edilmiyor."
                }
            ],
            "teachingPoint": "Belirtiler bir başkasında, genellikle çocukta üretiliyorsa tanı ‘başkasına yüklenen yapay bozukluk’tur ve faile konur; mağdur çocuğa yapay bozukluk tanısı konmaz."
        }
    },
    {
        "id": "case-067",
        "caseNumber": 67,
        "difficulty": "İleri Düzey",
        "course": "COMORBID",
        "diagnosisId": "bipolar_1",
        "secondaryDiagnosisId": "alcohol_use_disorder",
        "category": "BIPOLAR",
        "patientSummary": "37 yaşında, erkek, mimar (Çift tanılı vaka)",
        "clues": [
            "Danışan son 10 gündür günde 1 saat uykuyla aralıksız konuşmakta, evdeki eşyaları balkondan aşağı atmakta ve 'Cumhurbaşkanının başdanışmanı olduğunu' iddia etmektedir.",
            "Aynı zamanda son 4 yıldır her gün 1 büyük şişe rakı içtiği, alkolü bıraktığı anda deliryum benzeri ağır titreme nöbetleri geçirdiği ve manik ataklarında alkol tüketiminin kontrolsüzce arttığı öğreniliyor.",
            "Manik dönemleri yatıştırmak için 'kendi kendini tedavi etme' (self-medication) amacıyla alkole başladığı ancak zamanla her iki bozukluğun da birbirini yıkarak ağır bir klinik tablo oluşturduğu saptanmıştır.",
            "Kranial MRG temizdir; kan tahlillerinde karaciğer enzimleri yüksektir.",
            "Ruhsal Durum Muayenesinde: Grandiyöz sanrılar, baskılı konuşma, psikomotor taşkınlık ve eşzamanlı ağır alkol aşermesi/yoksunluğu.",
            "DSM-5'e göre: Vaka hem Bipolar I Bozukluğu (Manik Epizod) hem de Alkol Kullanım Bozukluğu kriterlerini eşzamanlı olarak tam karşılamaktadır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "günde 1 saat uykuyla",
                "dsmMatch": "1. Tanı: Bipolar I Bozukluğu (Grandiyöz manik atak)"
            },
            {
                "clueIndex": 1,
                "text": "her gün 1 büyük şişe rakı",
                "dsmMatch": "2. Tanı: Alkol Kullanım Bozukluğu (Ağır yoksunluk ve tolerans)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Entegre Çift Tanı Terapisi (Integrated Dual Disorder Treatment - IDDT)",
            "therapyDetails": "Bipolar atakları kontrol altına alırken eşzamanlı nüks önleme ve bağımlılık motivasyonel görüşmesi.",
            "pharmacologyNote": "Valproat (alkol komorbiditesinde lityuma göre daha stabil) veya Atipik Antipsikotik + Naltrekson."
        },
        "miniQuiz": {
            "question": "Bipolar Bozukluğu olan bireylerde madde ve alkol kullanım bozukluklarının genel popülasyona göre çok daha yüksek oranda (komorbid) görülmesinin en yaygın psikolojik sebebi nedir?",
            "options": [
                "Hastaların manik taşkınlığı veya depresif acıyı yatıştırmak için 'kendi kendini tedavi etme' (Self-Medication Hipotezi) amacıyla maddeye yönelmesi.",
                "Bipolar hastaların karaciğerinin alkol üretememesi.",
                "Bipolar ilaçlarının alkol içmeyi zorunlu kılması.",
                "Bu iki durumun birlikte görülmesi tıbben imkansızdır."
            ],
            "correctIndex": 0,
            "explanation": "Self-Medication Hipotezine göre, bipolar hastalar manik ajitasyonu dindirmek veya depresyonun getirdiği derin kederi uyuşturmak için sıklıkla alkol ve maddelere sığınırlar."
        },
        "differentialDiagnosis": "• Sadece Maddeye Bağlı Psikoz: Madde kesildikten sonra manik atak devam ederse birincil Bipolar I tanısı doğrulanır.",
        "dsmCriteriaSummary": "DSM-5 Çift Tanı: Bipolar I Manik Epizod + Alkol Kullanım Bozukluğu (Tolerans ve Yoksunluk ile birlikte).",
        "therapyId": "motivational_interviewing",
        "pharmacologyId": "valproate_acute_mania",
        "explanation": {
            "whyThis": [
                "Son on günde günde bir saatlik uyku, durmaksızın konuşma, eşyaları balkondan atma ve cumhurbaşkanı danışmanı olduğu inancı psikotik özellikli manik epizodu gösterir.",
                "Dört yıldır her gün büyük şişe rakı, bırakınca ağır titreme ve kontrolsüz artan kullanım alkol kullanım bozukluğunun tolerans, yoksunluk ve denetim kaybı ölçütlerini karşılar.",
                "Mani ve alkol kullanımı birbirini ağırlaştırmaktadır; manik tablo kendi başına bipolar I tanısını koydurur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "substance_induced_bipolar",
                    "reason": "Maddeye bağlı tanı için manik belirtilerin alkol etkisi ya da yoksunluğuyla açıklanması gerekir; alkol manik dönemleri yatıştırmak için başlanmıştır ve mani alkolden bağımsız görünür. Kesin ayrım için ayıklık döneminde gözlem gerekir."
                },
                {
                    "diagnosisId": "alcohol_withdrawal_delirium",
                    "reason": "Bilinç bulanıklığı ve dikkat bozukluğu değil, büyüklenmecilik ve baskılı konuşmayla giden net bir manik tablo vardır."
                },
                {
                    "diagnosisId": "schizoaffective",
                    "reason": "Psikotik belirtilerin duygudurum epizodu dışında da en az iki hafta sürdüğüne dair veri yoktur."
                }
            ],
            "teachingPoint": "Madde kullanımı ile birlikte görülen manide birincil bipolar tanısı için manik belirtilerin maddeden önce başlaması ya da ayıklık dönemlerinde de sürmesi aranır."
        }
    },
    {
        "id": "case-068",
        "caseNumber": 68,
        "difficulty": "İleri Düzey",
        "course": "COMORBID",
        "diagnosisId": "adhd",
        "secondaryDiagnosisId": "odd",
        "category": "NEURODEV",
        "patientSummary": "8 yaşında, erkek, ilkokul 2. sınıf öğrencisi (Çift tanılı vaka)",
        "clues": [
            "Danışan sınıfta ders sırasında bir saniye bile yerinde duramamakta, pencereye tırmanmakta, dikkatini 2 dakika bile toparlayamamakta ve eşyalarını sürekli kaybetmektedir.",
            "Aynı zamanda öğretmeninin veya ebeveynlerinin verdiği en ufak bir yönergede (örneğin 'Kitabını aç') 'Açmıyorum, sen kimsin ki bana emir veriyorsun!' diyerek kasıtlı olarak otoriteye meydan okumakta ve arkadaşlarıyla kasıtlı dalga geçmektedir.",
            "Önemli klinik ayrım: Çocuk sadece dikkatsiz ve hareketli değil; aynı zamanda kurallara karşı bilinçli, öfkeli ve kinci bir karşı gelme sergilemektedir.",
            "İşitme, görme ve nörolojik muayene normaldir.",
            "Ruhsal Durum Muayenesinde: Ağır dikkat eksikliği ve motor hiperaktivite ile birlikte otorite figürlerine karşı süregiden meydan okuyucu bilişsel şemalar.",
            "DSM-5'e göre: Vaka hem Dikkat Eksikliği ve Hiperaktivite Bozukluğu (Bileşik Tip) hem de Karşıt Olma Karşı Gelme Bozukluğu ölçütlerini eşzamanlı olarak karşılamaktadır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "yerinde duramamakta",
                "dsmMatch": "1. Tanı: DEHB (Dikkatsizlik ve Hiperaktivite-Dürtüsellik)"
            },
            {
                "clueIndex": 1,
                "text": "sen kimsin ki bana emir veriyorsun!",
                "dsmMatch": "2. Tanı: KOKGB (Otoriteye karşı gelme ve tartışmacı tutum)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Kombine Ebeveyn Yönetim Eğitimi (PMT) + Okul Temelli Davranışsal Müdahale",
            "therapyDetails": "Pozitif pekiştirme sistemleri, yönergeleri basitleştirme ve öfke mola (time-out) protokolleri.",
            "pharmacologyNote": "Uyarıcı (Metilfenidat) tedavisi DEHB'yi yatıştırırken dolaylı olarak KOKGB semptomlarını da belirgin azaltır."
        },
        "miniQuiz": {
            "question": "DEHB olan çocukların yaklaşık %40-50'sinde Karşıt Olma Karşı Gelme Bozukluğunun (KOKGB) eşlik etmesinin en önemli klinik sonucu nedir?",
            "options": [
                "Tedavi edilmediği takdirde ergenlikte Davranım Bozukluğuna ve adli suç davranışlarına evrilme riskinin çok yüksek olması.",
                "Çocuğun aniden dilsiz kalması.",
                "Çocuğun boyunun uzamasının durması.",
                "Bu iki durumun birlikte olması iyiye işarettir."
            ],
            "correctIndex": 0,
            "explanation": "DEHB + KOKGB komorbiditesi erken yaşta tedavi edilmezse, ergenlikte Davranım Bozukluğu ve kriminal antisosyal davranışlara dönüşme riski çok yüksektir."
        },
        "differentialDiagnosis": "• Tek Başına DEHB: Kasıtlı karşı çıkma ve kin gütme yoktur.\n• Tek Başına KOKGB: Dikkat süresi ve hiperaktivite normaldir.",
        "dsmCriteriaSummary": "DSM-5 Çift Tanı: DEHB (Bileşik Görünüm) + Karşıt Olma Karşı Gelme Bozukluğu (Öfkeli/Tartışmacı Görünüm).",
        "therapyId": "pmt",
        "pharmacologyId": "methylphenidate_stimulant",
        "explanation": {
            "whyThis": [
                "Yerinde duramama, tırmanma, kısa dikkat süresi ve eşya kaybetme hem dikkatsizlik hem hiperaktivite-dürtüsellik belirtileridir; bu bileşik görünüm DEHB'ye işaret eder.",
                "Buna ek olarak otoriteye kasıtlı meydan okuma, başkalarını kasıtlı kızdırma ve kin tutma, dikkatsizlikle açıklanamayan ayrı bir karşı gelme örüntüsüdür.",
                "İki örüntü birlikte bulunduğu için DEHB ana tanı, KOKGB eşlik eden tanıdır; işitme ve görme normaldir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "conduct_disorder",
                    "reason": "Hayvanlara zarar, hırsızlık ya da mala zarar verme gibi temel hak ihlalleri tarif edilmiyor."
                },
                {
                    "diagnosisId": "dmdd",
                    "reason": "Patlamalar arasında neredeyse her gün süren kalıcı öfkeli duygudurum ve ağır öfke patlamaları tarif edilmiyor."
                },
                {
                    "diagnosisId": "intermittent_explosive",
                    "reason": "Öfke kısa, dürtüsel saldırganlık patlamaları biçiminde değil; yönergelere kasıtlı ve kinci karşı gelme biçimindedir."
                }
            ],
            "teachingPoint": "DEHB'li bir çocukta kural ihlalinin dikkatsizlikten mi yoksa kasıtlı karşı gelmeden mi kaynaklandığını sor; ikincisi varsa eşlik eden KOKGB düşünülür."
        }
    },
    {
        "id": "case-069",
        "caseNumber": 69,
        "difficulty": "İleri Düzey",
        "course": "COMORBID",
        "diagnosisId": "ocd",
        "secondaryDiagnosisId": "mdd",
        "category": "OCD_RELATED",
        "patientSummary": "30 yaşında, kadın, biyolog (Çift tanılı vaka)",
        "clues": [
            "Danışan son 6 yıldır günde 6 saat kapı kilitlerini, ocağı ve prizleri kontrol etme ritüelleriyle (kontrol kompulsiyonları) boğuştuğunu anlatıyor.",
            "Son 2 aydır ise bu takıntılardan tamamen tükenmiş halde yataktan hiç çıkamaz hale geldiğini, 8 kilo verdiğini, intihar planları yaptığını ve 'Bu takıntılar yüzünden hayatım bitti, artık yaşamak istemiyorum' dediğini anlatıyor.",
            "Klinik tablo incelendiğinde, yıllardır süren tedavi edilmemiş ağır OKB'nin yarattığı yıkıcı çaresizliğin ikincil olarak ağır bir Majör Depresif Epizod tetiklediği saptanmıştır.",
            "Tiroid ve metabolik taramalar temizdir.",
            "Ruhsal Durum Muayenesinde: Şiddetli kontrol takıntıları, derin çökkün duygudurum, anhedoni ve aktif özkıyım riski.",
            "DSM-5'e göre: Vaka hem Obsesif-Kompulsif Bozukluk (OKB) hem de Majör Depresif Bozukluk (MDD) tanı kriterlerini eşzamanlı olarak tam karşılamaktadır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "günde 6 saat kapı kilitlerini, ocağı ve prizleri kontrol etme ritüelleriyle",
                "dsmMatch": "1. Tanı: Obsesif-Kompulsif Bozukluk (Zaman alıcı kontrol kompulsiyonları)"
            },
            {
                "clueIndex": 1,
                "text": "yataktan hiç çıkamaz hale geldiğini, 8 kilo verdiğini, intihar planları yaptığını",
                "dsmMatch": "2. Tanı: Majör Depresif Bozukluk (Ağır depresif epizod ve özkıyım riski)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Kombine Terapi (Önce Davranışsal Aktivasyon & Kriz Yönetimi, ardından ERP)",
            "therapyDetails": "Önce hastayı depresif yataktan kaldırmak için davranışsal aktivasyon ve intihar güvenliği protokolü; enerji toparlandığında takıntılar için ERP (Maruz Bırakma).",
            "pharmacologyNote": "Yüksek doz SSRI (örn. Sertralin 200 mg veya Fluoksetin 80 mg) her iki bozukluğu da eşzamanlı hedefleyen altın standarttır."
        },
        "miniQuiz": {
            "question": "Ağır OKB ve ikincil Majör Depresyon komorbiditesinde psikoterapiye başlarken neden doğrudan ERP (Maruz Bırakma) yerine önce depresyona yönelik müdahale edilir?",
            "options": [
                "Çünkü ağır depresyon ve enerjisizlik içindeki bir danışan ERP'nin gerektirdiği yoğun kaygıya maruz kalma zorluğuna dayanamaz; önce depresyon hafifletilip enerji kazandırılmalıdır.",
                "Çünkü OKB asla tedavi edilemez.",
                "Çünkü depresyonlu hastalar takıntı yapamaz.",
                "İki bozukluk aynı anda tedavi edilemez."
            ],
            "correctIndex": 0,
            "explanation": "ERP yüksek motivasyon ve direnç gerektirir. Ağır depresyondaki hasta bu zorluğa katlanamayacağından, önce duygudurum toparlanıp intihar riski güvenceye alınır."
        },
        "differentialDiagnosis": "• Sadece Psikotik Depresyon: OKB'deki takıntılar egodistoniktir; psikotik depresyonda ise sarsılmaz melankolik sanrılar vardır.",
        "dsmCriteriaSummary": "DSM-5 Çift Tanı: Obsesif-Kompulsif Bozukluk (A kriterleri) + Majör Depresif Epizod (A kriterleri).",
        "therapyId": "erp",
        "pharmacologyId": "clomipramine_ocd",
        "explanation": {
            "whyThis": [
                "Altı yıldır günde altı saati bulan kilit, ocak ve priz kontrolleri, ciddi zaman kaybına yol açan kontrol kompulsiyonlarıdır.",
                "Son iki ayda yataktan çıkamama, sekiz kilo kaybı, anhedoni ve intihar planları ayrı bir majör depresif epizodu gösterir.",
                "Depresyon OKB'nin yıllar içinde yarattığı çaresizlikten sonra gelişmiştir; ana tanı OKB, depresyon eşlik eden tanıdır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "delusional_disorder",
                    "reason": "Takıntılar kişiye yabancı ve istenmeyen düşünceler olarak yaşanıyor ve kişi bunlarla savaşıyor; sabit ve sorgulanamayan bir sanrısal inanç tarif edilmiyor."
                },
                {
                    "diagnosisId": "ocpd",
                    "reason": "Kontroller kişinin benimsediği bir düzen tarzı değil, sıkıntı veren ve tüketen ritüellerdir."
                },
                {
                    "diagnosisId": "gad",
                    "reason": "Kaygı yaygın bir kuruntu değil, belirli bir korkuyu yatıştırmaya yönelik kurallı tekrarlayıcı davranışlarla ilişkilidir."
                }
            ],
            "teachingPoint": "Uzun süreli OKB'de depresyon sık eklenir ve intihar riskini artırır; OKB'li her hastada depresif belirtiler ve intihar düşüncesi ayrıca sorulmalıdır."
        }
    },
    {
        "id": "case-070",
        "caseNumber": 70,
        "difficulty": "Zor",
        "course": "FORENSIC",
        "diagnosisId": "frotteuristic",
        "therapyId": "cbt_general",
        "category": "PARAPHILIC",
        "patientSummary": "26 yaşında, erkek, muhasebe personeli",
        "clues": [
            "26 yaşındaki danışan, kalabalık metrobüs ve otobüslerde tanımadığı kadınlara rızaları olmaksızın sürtünme eylemlerini durduramadığını ve yoğun suçluluk yaşadığını belirterek kliniğe başvurdu.",
            "Bu dürtülerin 17 yaşlarında hayal olarak başladığı, son 2 yıldır ise haftada en az 2-3 kez kalabalık toplu taşıma araçlarında fiili sürtünme eylemlerine dönüştüğü öğrenildi.",
            "Eylemlerin ardından kendini aşağılık hissettiği, ancak kalabalık bir ortama girdiğinde karşı konulamaz bir gerilim ve ardından gelen cinsel uyarılma döngüsüne girdiği anlatılıyor.",
            "Genel fiziksel ve nörolojik muayenesi olağandır; toksikoloji taraması temizdir.",
            "Ruhsal Durum Muayenesinde: Cinsel uyarılmanın tamamen rıza dışı temas koşullanmasına kilitlendiği, dürtü denetiminde yetersizlik ve yoğun ego-distonik utanç duygulanımı gözlendi.",
            "DSM-5'e göre: En az 6 aylık bir süre boyunca, onay vermeyen bir kişiye dokunma ya da sürtünmeyle ilgili yineleyen, yoğun cinsel uyarılma dürtülerinin bulunması ve kişinin bu dürtüleri rızası olmayan kişilerle eyleme dökmüş olması kriterini tam karşılar."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "rızaları olmaksızın sürtünme eylemlerini",
                "dsmMatch": "DSM-5 Kriter A: Onay vermeyen kişiye dokunma veya sürtünme dürtüleri"
            },
            {
                "clueIndex": 1,
                "text": "son 2 yıldır",
                "dsmMatch": "DSM-5 Süre Eşiği: En az 6 aylık süre"
            },
            {
                "clueIndex": 5,
                "text": "bu dürtüleri rızası olmayan kişilerle eyleme dökmüş olması",
                "dsmMatch": "DSM-5 Kriter B: Eyleme dökme veya belirgin klinik sıkıntı"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi & Gizli Şartlandırma",
            "therapyDetails": "Dürtü yönetimi, gizli duyarsızlaştırma (covert sensitization), nüks önleme ve cinsel empati eğitimi.",
            "pharmacologyNote": "Ağır ve kontrolsüz adli vakalarda antiandrojenler veya yüksek doz SSRI grubu ajanlar dürtü baskılamada kullanılır."
        },
        "miniQuiz": {
            "question": "Frotteuristik Bozukluk ile Antisosyal Kişilik Bozukluğu arasındaki temel klinik fark nedir?",
            "options": [
                "Frotteurizmde eylem sonrası yoğun utanç, suçluluk ve ego-distonik sıkıntı vardır; Antisosyal KB'de ise vicdan azabı ve suçluluk yoktur.",
                "Frotteurizm sadece çocuklukta görülür.",
                "Antisosyal hastalar toplu taşımaya binmez.",
                "İkisi tamamen aynı bozukluktur."
            ],
            "correctIndex": 0,
            "explanation": "Frotteurizmde danışan eylemlerinden ötürü derin suçluluk ve utanç (ego-distonik) yaşar; Antisosyal KB'de ise kural ihlallerinde suçluluk ve empati bulunmaz."
        },
        "differentialDiagnosis": "• Ekzibisyonizm: Cinsel organı yabancıya gösterme hazzıdır; sürtünme ve fiziksel temas birincil amaç değildir.\n• Antisosyal KB: Genel suç davranışı ve vicdan azabı eksikliği hakimdir; suçluluk hissetmezler.\n• OKB (Cinsel Obsesyonlar): OKB'de düşünceler haz vermez ve eyleme dökülmez; parafilide ise eylem haz vericidir.",
        "dsmCriteriaSummary": "DSM-5: En az 6 ay süreyle onay vermeyen kişiye dokunma/sürtünme dürtüleri + Bu dürtülerin rıza dışı eyleme dökülmesi.",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Kalabalık toplu taşımada rızası olmayan kadınlara sürtünme, onay vermeyen kişiye dokunmaya yönelik cinsel uyarılmanın eyleme dökülmesidir.",
                "Dürtüler 17 yaşında fantezi olarak başlamış, son iki yıldır haftada birkaç kez eyleme dökülmektedir; altı ay ölçütü karşılanır.",
                "Kişi bu dürtüleri rıza vermeyen kişilerle eyleme döktüğü için, yaşadığı suçluluk tanı için ayrıca gerekli olmasa da tabloyu destekler."
            ],
            "whyNot": [
                {
                    "diagnosisId": "exhibitionistic",
                    "reason": "Uyarılmanın kaynağı cinsel organı göstermek değil, fiziksel temas ve sürtünmedir."
                },
                {
                    "diagnosisId": "antisocial_pd",
                    "reason": "Eylemler cinsel uyarılmaya özgüdür ve kişi belirgin suçluluk duyar; genel bir suç ve kural ihlali örüntüsü tarif edilmiyor."
                },
                {
                    "diagnosisId": "ocd",
                    "reason": "OKB'deki cinsel içerikli obsesyonlar haz vermez ve eyleme dökülmez; burada eylem cinsel uyarılmayla sonuçlanır."
                }
            ],
            "teachingPoint": "Parafilik bozukluk tanısı için ya kişinin sıkıntı yaşaması ya da dürtülerini rıza vermeyen kişilerle eyleme dökmüş olması yeterlidir."
        }
    },
    {
        "id": "case-071",
        "caseNumber": 71,
        "difficulty": "Zor",
        "course": "FORENSIC",
        "diagnosisId": "voyeuristic",
        "therapyId": "cbt_general",
        "category": "PARAPHILIC",
        "patientSummary": "24 yaşında, erkek, üniversite son sınıf öğrencisi",
        "clues": [
            "24 yaşındaki danışan, karşı apartmandaki komşusunun yatak odasını gizlice gözetlerken cep telefonu kamerasıyla yakalanması ve polise şikayet edilmesi üzerine adli psikiyatrik muayeneye getirildi.",
            "Son 1 yıldır haftanın 4-5 gecesi dürbün ve kamerayla habersiz kişilerin soyunmasını ve cinsel ilişkilerini gizlice izlediğini, bu anları izlerken mastürbasyon yaparak yoğun haz aldığını itiraf etti.",
            "Normal flört veya onaylı cinsel birlikteliklerin kendisine 'gizlice izleme heyecanı kadar tatmin vermediğini' ifade etmektedir.",
            "Madde veya alkol bağımlılığı saptanmamış, toksikoloji negatif çıkmıştır.",
            "Ruhsal Durum Muayenesinde: Yakalanma korkusu ve adli süreç nedeniyle yoğun anksiyete; cinsel uyarılmanın habersiz kişileri dikizleme koşullanmasına bağlandığı gözlendi.",
            "DSM-5'e göre: Kişi en az 18 yaşındadır ve en az 6 aylık süre boyunca, habersiz bir kişinin çıplaklığını, soyunmasını ya da cinsel etkinliğini gizlice gözetlemeyle ilgili yoğun dürtüleri eyleme dökmüştür."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "habersiz kişilerin soyunmasını ve cinsel ilişkilerini gizlice izlediğini",
                "dsmMatch": "DSM-5 Kriter A: Habersiz birinin çıplaklığını veya cinsel etkinliğini gözetleme"
            },
            {
                "clueIndex": 5,
                "text": "en az 18 yaşındadır",
                "dsmMatch": "DSM-5 Kriter B: Kişinin en az 18 yaşında olması gerekliliği"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi (Gizli Şartlandırma & Yeniden Çerçeveleme)",
            "therapyDetails": "Gözetleme tetikleyicilerini tanıma, gözetleme anında olumsuz adli sonuçları canlandırma, empati geliştirme.",
            "pharmacologyNote": "Dürtü yoğunluğunu azaltmak için SSRI grubu antidepresanlar reçete edilebilir."
        },
        "miniQuiz": {
            "question": "DSM-5'e göre Voyörizm (Gözetlemecilik Bozukluğu) tanısı koyabilmek için failin en az kaç yaşında olması şarttır?",
            "options": [
                "En az 18 yaşında olmalıdır.",
                "En az 12 yaşında olmalıdır.",
                "En az 21 yaşında olmalıdır.",
                "Yaş sınırı bulunmamaktadır."
            ],
            "correctIndex": 0,
            "explanation": "DSM-5 voyöristik bozukluk için failin en az 18 yaşında olmasını kesin tanı kriteri olarak zorunlu kılar."
        },
        "differentialDiagnosis": "• Normal Merak/İnternet Pornografisi: Pornografide izlenen kişinin haberi ve rızası vardır; voyörizmde mağdur habersizdir ve uyarılma habersiz olmasıyla doğrudan bağlantılıdır.\n• Ekzibisyonizm: Kendi organını gösterme eylemidir, gözetleme değildir.",
        "dsmCriteriaSummary": "DSM-5: ≥18 yaş + En az 6 ay habersiz kişileri çıplak/ilişki anında gözetleme dürtüleri + Eyleme dökme.",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Habersiz kişilerin soyunmasını ve cinsel ilişkisini gizlice izleyip bu sırada mastürbasyon yapması, uyarılmanın gözetleme davranışına bağlı olduğunu gösterir.",
                "Davranış bir yıldır haftada birkaç gece, yani altı aydan uzun süredir tekrarlamaktadır.",
                "Dürtüler rıza vermeyen kişilerle eyleme dökülmüştür ve kişi 18 yaşından büyüktür."
            ],
            "whyNot": [
                {
                    "diagnosisId": "exhibitionistic",
                    "reason": "Kişi kendini göstermiyor; uyarılma izlenen kişinin haberi olmamasına bağlıdır."
                },
                {
                    "diagnosisId": "antisocial_pd",
                    "reason": "Davranış cinsel uyarılmaya özgüdür; genel bir dolandırıcılık, saldırganlık ya da çocukluk davranım bozukluğu öyküsü tarif edilmiyor."
                },
                {
                    "diagnosisId": "other_specified_paraphilic",
                    "reason": "Tablo gözetlemecilik bozukluğunun tüm ölçütlerini karşıladığı için ‘belirlenmiş diğer’ kategorisine gerek yoktur."
                }
            ],
            "teachingPoint": "Gözetlemecilikte belirleyici öğe izlenen kişinin habersiz olmasıdır; rızayla izlenen pornografi bu tanıya girmez."
        }
    },
    {
        "id": "case-072",
        "caseNumber": 72,
        "difficulty": "Zor",
        "course": "FORENSIC",
        "diagnosisId": "exhibitionistic",
        "therapyId": "cbt_general",
        "category": "PARAPHILIC",
        "patientSummary": "29 yaşında, erkek, elektrik teknisyeni",
        "clues": [
            "29 yaşındaki danışan, parkta bankta oturan yabancı bir kadının önüne geçip trençkotunu aniden açarak genital organını teşhir ederken güvenlik görevlileri tarafından suçüstü yakalandı.",
            "Bu teşhir eylemlerini son 8 aydır haftada 1-2 kez tanımadığı yabancılara karşı tekrarladığını, kadının şaşkınlık ve korku dolu çığlığını gördüğü anda yoğun bir cinsel haz yaşadığını anlattı.",
            "Kurbanlara fiziksel temas, tecavüz veya saldırı niyeti olmadığını, amacının sadece 'karşı tarafın şok tepkisini görmek' olduğunu vurguladı.",
            "Genel tıbbi ve nörolojik taramalar temizdir; epilepsi veya frontal lob patolojisi saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Yetersizlik hislerini kurbanın şok tepkisiyle telafi etme çabası, dürtüsellik ve yakalanma sonrası utanç duyguları belirlendi.",
            "DSM-5'e göre: En az 6 aylık süre boyunca, hazırlıksız bir kişiye cinsel organını göstermeyle ilgili yineleyen yoğun cinsel uyarılma fantezileri/dürtüleri bulunması ve bu dürtüleri onay vermeyen kişiler üzerinde eyleme dökmüş olması tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "genital organını teşhir ederken",
                "dsmMatch": "DSM-5 Kriter A: Hazırlıksız bir kişiye genital organı gösterme dürtüleri"
            },
            {
                "clueIndex": 1,
                "text": "son 8 aydır",
                "dsmMatch": "DSM-5 Süre Kriteri: En az 6 ay"
            },
            {
                "clueIndex": 2,
                "text": "karşı tarafın şok tepkisini görmek",
                "dsmMatch": "Psikopatoloji: Mağdurun şok/korku tepkisinden cinsel doyum alma"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi & Dürtü Kontrolü",
            "therapyDetails": "Mağdur odaklı empati eğitimi, uyaran kontrolü, gizli duyarsızlaştırma ve öfke/yetersizlik şemalarıyla çalışma.",
            "pharmacologyNote": "SSRI grubu ilaçlar ve ağır olgularda antiandrojen hormon tedavisi."
        },
        "miniQuiz": {
            "question": "Göstermecilik Bozukluğunda faili en çok cinsel olarak uyaran ve tatmin eden temel psikolojik unsur nedir?",
            "options": [
                "Hazırlıksız kurbanın yüzündeki korku, şaşkınlık ve şok tepkisi",
                "Kurbanla fiziksel cinsel ilişkiye girmek",
                "Kurbandan para çalmak",
                "Kurbanın ona iltifat etmesi"
            ],
            "correctIndex": 0,
            "explanation": "Ekzibisyonizmde fail temas istemez; temel uyarılma kurbanın hazırlıksız yakalanması ve gösterdiği dehşet/şaşkınlık tepkisidir."
        },
        "differentialDiagnosis": "• Frotteurizm: Fiziksel temas ve sürtünme vardır; ekzibisyonizmde temas yoktur, sadece görsel teşhir vardır.\n• Bipolar Manik Epizod: Manide genel disinhibisyonla soyunma olabilir; ancak burada kronik ve spesifik parafilik odak vardır.",
        "dsmCriteriaSummary": "DSM-5: En az 6 ay hazırlıksız kişiye genital organını gösterme dürtüleri + Eyleme dökme veya belirgin klinik sıkıntı.",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Hazırlıksız yabancılara cinsel organını göstermesi ve onların şok tepkisiyle cinsel haz alması göstermecilik bozukluğunun çekirdeğidir.",
                "Davranış sekiz aydır haftada 1-2 kez tekrarlanmaktadır; altı ay ölçütü karşılanır.",
                "Dürtüler onay vermeyen kişiler üzerinde eyleme dökülmüştür; fiziksel temas amacı yoktur ve frontal lob patolojisi dışlanmıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "frotteuristic",
                    "reason": "Sürtünme ya da dokunma yoktur; uyarılma yalnızca görsel teşhir ve karşı tarafın tepkisine bağlıdır."
                },
                {
                    "diagnosisId": "bipolar_1",
                    "reason": "Manideki ketlenmesizlik epizodik ve geneldir; burada sekiz aydır süren, tek bir cinsel davranışa odaklı bir örüntü vardır."
                },
                {
                    "diagnosisId": "major_neurocognitive_frontotemporal",
                    "reason": "Ketlenmesizlikle giden cinsel davranışlarda frontotemporal demans akla gelir, ancak kişi 29 yaşındadır ve nörolojik taramalar temizdir."
                }
            ],
            "teachingPoint": "Cinsel ketlenmesizlik yeni başladıysa önce mani ve frontal lob hastalıklarını dışla; süreğen ve tek odaklı bir örüntü parafilik bozukluğu düşündürür."
        }
    },
    {
        "id": "case-073",
        "caseNumber": 73,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "nightmare_disorder",
        "therapyId": "irt",
        "category": "SLEEP",
        "patientSummary": "28 yaşında, kadın, mimar",
        "clues": [
            "28 yaşındaki danışan, neredeyse her gece uykunun ikinci yarısında (sabaha karşı) yüksekten düşme, canavarlar tarafından kovalanma veya sevdiklerinin öldürülmesini içeren dehşet verici canlı rüyalarla kan ter içinde uyandığını belirterek başvurdu.",
            "Rüyadan uyandığı anda bilincinin saniyeler içinde tamamen açıldığını, nerede olduğunu bildiğini (tam oryante) ve gördüğü kabusun tüm korkunç detaylarını çok net hatırladığını söyledi.",
            "Son 5 aydır haftada en az 3-4 gece tekrarlayan bu kabuslar nedeniyle uyumaktan korktuğunu ve gündüzleri derin bir yorgunluk ve kaygı yaşadığını belirtti.",
            "Polisomnografi (PSG) incelemesinde kabusların REM uykusu evresinde ortaya çıktığı; nörolojik muayenenin normal olduğu belirlendi.",
            "Ruhsal Durum Muayenesinde: Yatağa girerken yoğun beklenti anksiyetesi, uykusuzluk yorgunluğu ve REM uykusu korkusu saptandı. TSSB tablosu oluşturan travmatik bir olay öyküsü yoktur.",
            "DSM-5'e göre: Hayatta kalma veya güvenliğe yönelik tehditleri içeren, ayrıntılı olarak iyi hatırlanan korkutucu rüyaların yineleyen biçimde görülmesi ve uyanıldığında hızla tam çevreye yönelme (oryantasyon) olması kriterini karşılar."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "dehşet verici canlı rüyalarla kan ter içinde uyandığını",
                "dsmMatch": "DSM-5 Kriter A: İyi hatırlanan korkutucu rüyaların yinelemesi"
            },
            {
                "clueIndex": 1,
                "text": "uyandığı anda bilincinin saniyeler içinde tamamen açıldığını",
                "dsmMatch": "DSM-5 Kriter B: Uyanma anında hızlı oryantasyon (konfüzyon olmaması)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "İmgeleme Provası Terapisi (IRT / Imagery Rehearsal Therapy)",
            "therapyDetails": "Kabus senaryosunu uyanıkken kağıda yazma, sonunu olumlu ve güvenli bir şekilde yeniden yazıp zihinde prova etme.",
            "pharmacologyNote": "Prazosin (alfa-1 bloker) dirençli vakalarda sempatik uyarılmayı ve kabusları yatıştırmada etkilidir."
        },
        "miniQuiz": {
            "question": "Kabus Bozukluğu ile Gece Terörü (Uyku Terörü / NREM Parasomnisi) arasındaki en kritik tanısal fark nedir?",
            "options": [
                "Kabus Bozukluğunda uyanınca bilinç hemen açılır ve rüya net hatırlanır; Gece Teröründe ise konfüzyon vardır ve rüya hatırlanmaz.",
                "Kabus sadece gündüz uykusunda olur.",
                "Gece terörü sadece yaşlılarda görülür.",
                "Kabus bozukluğunda hasta yataktan fırlayıp koşar."
            ],
            "correctIndex": 0,
            "explanation": "Kabus REM uykusunda olur, uyanınca rüya çok net hatırlanır ve bilinç açıktır. Uyku Terörü NREM evresindedir, amnezi ve uyanma konfüzyonu ile seyreder."
        },
        "differentialDiagnosis": "• Gece Terörü (Sleep Terror): NREM evresindedir; hasta uyanmakta zorlanır, konfüzyon yaşar ve rüyayı hatırlamaz.\n• TSSB: Kabuslar doğrudan gerçek bir travmanın aynen yeniden yaşantılanmasıdır.\n• REM Uykusu Davranış Bozukluğu: Rüyayı eyleme dökme ve yataktan fırlama/vurma hareketleri vardır.",
        "dsmCriteriaSummary": "DSM-5: İyi hatırlanan korkutucu rüyalar + Uyanıldığında hızla tam yönelim (oryantasyon) + Belirgin gündüz sıkıntısı.",
        "pharmacologyId": "prazosin_nightmares",
        "explanation": {
            "whyThis": [
                "Düşme, kovalanma ve sevdiklerinin öldürülmesi gibi hayatta kalmayı tehdit eden, ayrıntılı hatırlanan korkutucu rüyalar tekrarlamaktadır.",
                "Uyanınca saniyeler içinde tamamen yönelimli olması ve kabuslar REM evresinde, gecenin ikinci yarısında ortaya çıkması tanıya özgüdür.",
                "Beş aydır haftada 3-4 gece süren kabuslar uyku korkusu ve gündüz yorgunluğu ile işlevi bozmaktadır; travma öyküsü yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "nrem_sleep_arousal",
                    "reason": "NREM uykusundan uyanma bozukluğunun uyku terörü tipinde olaylar gecenin ilk üçte birinde olur; kişi zor uyanır, konfüzedir ve rüyayı hatırlamaz."
                },
                {
                    "diagnosisId": "ptsd",
                    "reason": "Kabuslar yaşanmış bir travmanın yeniden yaşantılanması değildir ve travmatik olay öyküsü yoktur."
                },
                {
                    "diagnosisId": "rem_sleep_behavior_disorder",
                    "reason": "Rüyayı eyleme dökme, vurma ya da yataktan fırlama gibi hareketler tarif edilmiyor."
                }
            ],
            "teachingPoint": "Kabus ile gece terörünü üç soru ayırır: uyku evresi (REM/NREM), uyanınca yönelim ve rüyanın hatırlanıp hatırlanmadığı."
        }
    },
    {
        "id": "case-074",
        "caseNumber": 74,
        "difficulty": "Kolay",
        "course": "ADULT",
        "diagnosisId": "insomnia_disorder",
        "therapyId": "cbt_i",
        "category": "SLEEP",
        "patientSummary": "36 yaşında, kadın, banka şube müdürü",
        "clues": [
            "36 yaşındaki danışan, yatağa yattığında zihnini susturamadığını, uykuya dalmasının en az 2-3 saat sürdüğünü ve gece boyunca sık sık uyanıp tekrar uyuyamadığını belirterek başvurdu.",
            "Yeterli uyuma fırsatı ve sessiz bir yatak odası olmasına rağmen son 6 aydır haftada en az 4-5 gece bu uykusuzluk tablosunu yaşamaktadır.",
            "Gündüzleri yoğun konsantrasyon kaybı, işte hata yapma korkusu ve sürekli bir bitkinlik yaşadığını, akşam yaklaştığında 'Bu gece de uyuyamayacağım' korkusuyla paniklediğini söyledi.",
            "Tiroid paneli, demir düzeyleri ve polisomnografi normal çıkmış; uyku apnesi veya huzursuz bacaklar sendromu dışlanmıştır.",
            "Ruhsal Durum Muayenesinde: Yatak ile uyanıklık ve kaygı arasında güçlü bir negatif koşullanma (psikofizyolojik insomni), uykuya dair felaketleştirici otomatik düşünceler saptandı.",
            "DSM-5'e göre: Yeterli uyku fırsatına karşın uyku başlatma veya sürdürme güçlüğü, haftada en az 3 gece ortaya çıkma, en az 3 aydır sürme ve gündüz işlevsellik kaybına yol açma kriterlerini tam karşılar."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "uykuya dalmasının en az 2-3 saat sürdüğünü",
                "dsmMatch": "DSM-5 Kriter A: Uyku başlatma veya sürdürmede güçlük"
            },
            {
                "clueIndex": 1,
                "text": "son 6 aydır haftada en az 4-5 gece",
                "dsmMatch": "DSM-5 Kriter C & D: Haftada en az 3 gece ve en az 3 ay süre"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Uykusuzluk için Bilişsel Davranışçı Terapi (CBT-I / Morin Modeli)",
            "therapyDetails": "Uyaran kontrolü (yatak sadece uyku içindir), uyku kısıtlama terapisi, uyku hijyeni ve bilişsel yeniden yapılandırma.",
            "pharmacologyNote": "Kısa süreli kriz durumlarında non-benzodiazepin hipnotikler (Z-ilaçlar) verilebilir ancak CBT-I kalıcı altın standarttır."
        },
        "miniQuiz": {
            "question": "Uykusuzluk için BDT (CBT-I) protokolünde 'Uyaran Kontrolü' (Stimulus Control) kuralına göre yatakta 20 dakika uyuyamayan hastaya ne yapması önerilir?",
            "options": [
                "Yataktan kalkıp başka bir odaya geçmeli, loş ışıkta dinlendirici bir şey yapmalı ve sadece uykusu gelince yatağa dönmelidir.",
                "Yatakta kalıp zorla gözlerini kapatmalı ve uyumayı beklemelidir.",
                "Hemen telefondan sosyal medyaya bakmalıdır.",
                "Işıkları açıp yoğun egzersiz yapmalıdır."
            ],
            "correctIndex": 0,
            "explanation": "Uyaran kontrolünün özü; yatak ile kaygı/uyanıklık koşullanmasını kırmaktır. 20 dakikada uyuyamayan kişi yataktan ayrılmalıdır."
        },
        "differentialDiagnosis": "• Uyku Apnesi: Gece horlama, boğulma hissi ve solunum durması vardır.\n• Huzursuz Bacaklar Sendromu: Bacaklarda hareket ettirme dürtüsü ve paresteziler vardır.\n• Depresyona Bağlı İnsomni: Anhedoni ve derin çökkünlük primerdir.",
        "dsmCriteriaSummary": "DSM-5: Uyku başlatma/sürdürme güçlüğü + Haftada ≥3 gece + Süre ≥3 ay + Yeterli uyku fırsatına rağmen oluşma.",
        "pharmacologyId": "mirtazapine_nassa",
        "explanation": {
            "whyThis": [
                "Yeterli fırsata rağmen uykuya dalmada 2-3 saat güçlük ve gece uyanıp tekrar uyuyamama, uyku başlatma ve sürdürme yakınmalarıdır.",
                "Altı aydır haftada 4-5 gece sürmesi, haftada üç gece ve üç ay ölçütlerini aşar; gündüz konsantrasyon kaybı ve bitkinlik işlev bozukluğunu gösterir.",
                "Akşam ‘bu gece de uyuyamayacağım’ korkusu yatak ile uyarılmışlık arasındaki koşullanmayı yansıtır; apne, huzursuz bacaklar ve tiroid sorunu dışlanmıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "gad",
                    "reason": "Kaygı birçok yaşam alanına yayılmamış, uyku ve onun gündüz sonuçlarıyla sınırlıdır; başka konularda süreğen kuruntu tarif edilmiyor."
                },
                {
                    "diagnosisId": "mdd",
                    "reason": "Çökkün duygudurum ve anhedoni tarif edilmiyor; uykusuzluk depresyonun bir belirtisi gibi görünmüyor, yine de taranmalıdır."
                },
                {
                    "diagnosisId": "circadian_rhythm_sleep_wake",
                    "reason": "Kişi uykuya geç dalmakla kalmıyor, gece boyunca da sık uyanıyor; sirkadiyen ritim bozukluğunun gecikmiş uyku evresi tipinde uyku zamanı kaydırılınca uyku normaldir."
                }
            ],
            "teachingPoint": "Uykusuzluk bozukluğu, başka bir bozukluk eşlik etse bile uykusuzluk ayrı klinik dikkat gerektirecek kadar belirginse bağımsız tanı olarak konabilir."
        }
    },
    {
        "id": "case-075",
        "caseNumber": 75,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "hypersomnolence",
        "therapyId": "cbt_general",
        "category": "SLEEP",
        "patientSummary": "22 yaşında, erkek, üniversite öğrencisi",
        "clues": [
            "22 yaşındaki danışan, gece kesintisiz 9-10 saat uyumasına rağmen sabahları asla dinlenmiş uyanamadığını ve gün içinde derslerde istemsizce uyuyakaldığını belirterek başvurdu.",
            "Sabah çalar saat çaldığında saatlerce 'uyku sarhoşluğu' (sleep inertia) yaşadığını, uyanmakta aşırı zorlandığını ve gün içinde 2 saat uyusa dahi dinlenemediğini söyledi.",
            "Bu durumun son 7 aydır haftanın hemen her günü devam ettiği ve ders başarısının ciddi şekilde çöktüğü öğrenildi.",
            "Polisomnografi ve Çoklu Uyku Latansı Testinde (MSLT) narkolepsiye özgü SOREMP bulgusu saptanmamış; uyku apnesi görülmemiştir.",
            "Ruhsal Durum Muayenesinde: Katapleksi (gülmeyle gelen kas felci) öyküsü KESİNLİKLE yoktur; hipnagojik halüsinasyon veya uyku felci (karabasan) bildirilmemiştir.",
            "DSM-5'e göre: En az 7 saat süren bir ana uyku evresi geçirilmesine karşın gün içinde tekrarlayan uyku dönemleri, dinlendirmeyen 9 saatten uzun uyku ve uyanmakta güçlük çekme tablosunun haftada en az 3 gün ve en az 3 aydır sürmesi tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "gece kesintisiz 9-10 saat uyumasına rağmen",
                "dsmMatch": "DSM-5 Kriter A: Ana uykuya rağmen dinlendirmeyen aşırı uykululuk"
            },
            {
                "clueIndex": 4,
                "text": "Katapleksi",
                "dsmMatch": "Ayırıcı Tanı: Narkolepsi dışlaması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Davranışsal Uyku Planlaması & BDT",
            "therapyDetails": "Sabit uyanma saatleri, planlı kısa gündüz şekerlemeleri, parlak ışık terapisi ve uyku sarhoşluğunu yönetme.",
            "pharmacologyNote": "Gündüz uyanıklığını artırmak için Modafinil veya metilfenidat gibi psikostimülanlar reçete edilir."
        },
        "miniQuiz": {
            "question": "Hipersomnolans Bozukluğunu Narkolepsiden ayıran en belirleyici klinik özellik nedir?",
            "options": [
                "Narkolepside kısa uykular dinlendiricidir ve katapleksi görülür; Hipersomnolans'ta ise uzun uykular dahi dinlendirmez ve katapleksi yoktur.",
                "Hipersomnolans sadece yaşlılarda görülür.",
                "Narkolepside hasta hiç uyuyamaz.",
                "İkisi tamamen aynı bozukluktur."
            ],
            "correctIndex": 0,
            "explanation": "Narkolepside 15 dakikalık şekerleme hastayı yeniler ve katapleksi eşlik edebilir. Hipersomnolans'ta ise saatlerce uyunsa bile asla dinlenilmez."
        },
        "differentialDiagnosis": "• Narkolepsi: Katapleksi, uyku felci ve dinlendirici kısa şekerlemeler vardır.\n• Uyku Apnesi: Horlama ve gece solunum durmaları vardır.\n• Yetersiz Uyku Sendromu: Kişi fırsat bulamadığı için az uyumaktadır; fırsat verildiğinde düzelir.",
        "dsmCriteriaSummary": "DSM-5: En az 7 saatlik uykuya rağmen aşırı uyku ihtiyacı + Dinlendirmeyen uyku + Haftada ≥3 kez + Süre ≥3 ay.",
        "pharmacologyId": "modafinil_oxybate",
        "explanation": {
            "whyThis": [
                "Gece 9-10 saat uyumasına rağmen dinlenmemiş uyanması ve gün içinde uyuyakalması, yeterli ana uykuya karşın aşırı uykululuktur.",
                "Saatler süren uyku sarhoşluğu ve iki saatlik şekerlemelerin bile dinlendirmemesi tanının tipik özellikleridir.",
                "Yedi aydır neredeyse her gün sürmesi süre ölçütünü aşar; MSLT'de SOREMP ve PSG'de apne yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "narcolepsy",
                    "reason": "Katapleksi, uyku felci ve hipnagojik varsanı yoktur; MSLT'de narkolepsiye özgü bulgu saptanmamıştır."
                },
                {
                    "diagnosisId": "obstructive_sleep_apnea",
                    "reason": "Polisomnografide uyku apnesi görülmemiştir."
                },
                {
                    "diagnosisId": "mdd",
                    "reason": "Aşırı uyku atipik depresyonda görülebilir, ancak çökkün duygudurum ya da anhedoni tarif edilmiyor; bu yine de sorulmalıdır."
                }
            ],
            "teachingPoint": "Narkolepside kısa şekerlemeler dinlendirir; aşırı uykululuk bozukluğunda ise uzun uykular ve şekerlemeler bile dinlendirmez."
        }
    },
    {
        "id": "case-076",
        "caseNumber": 76,
        "difficulty": "Kolay",
        "course": "ADULT",
        "diagnosisId": "genito_pelvic_pain",
        "therapyId": "sensate_focus",
        "category": "SEXUAL",
        "patientSummary": "25 yaşında, kadın, yeni evli",
        "clues": [
            "25 yaşındaki kadın danışan, 1 yıllık evli olmasına rağmen eşiyle vajinal birleşmeyi hiçbir şekilde gerçekleştiremediklerini belirterek cinsel terapi kliniğine başvurdu.",
            "Cinsel ilişki denemelerinde vajina girişinde sanki 'etten bir duvar örülmüş gibi' hissettiğini, bacaklarını istemsizce kapattığını ve şiddetli bir yırtılma/acı korkusuyla eşini ittiğini anlattı.",
            "Tampon kullanamadığını ve bugüne kadar jinekolojik muayene masasına dahi oturamadığını ifade etti.",
            "Jinekolojik değerlendirmede anatomik veya enfeksiyöz hiçbir organik patoloji (himen anomalisi, enfeksiyon vb.) saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Cinsellik ve bekaretle ilgili katı tabular, ilk geceye dair felaketleştirici mitler, pelvik taban kaslarında istemsiz spazm şartlanması tespit edildi.",
            "DSM-5'e göre: Vajinal penetrasyon sırasında sürekli/yineleyici güçlük, belirgin vulvovajinal ağrı korkusu ve penetrasyon denemelerinde pelvik taban kaslarında belirgin istemsiz kasılma (en az 6 ay) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "bacaklarını istemsizce kapattığını ve şiddetli bir yırtılma/acı korkusuyla",
                "dsmMatch": "DSM-5 Kriter A: Pelvik taban kasılmaları ve ağrı korkusu"
            },
            {
                "clueIndex": 0,
                "text": "1 yıllık evli olmasına rağmen",
                "dsmMatch": "DSM-5: Penetrasyonun imkansız hale gelmesi ve süre"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Cinsel Terapi & Duyusal Odaklanma (Masters & Johnson)",
            "therapyDetails": "Cinsel eğitim (mitlerin çürütülmesi), gevşeme ve Kegel egzersizleri, kademeli dilatör çalışmaları ve Duyusal Odaklanma (Sensate Focus).",
            "pharmacologyNote": "Primer farmakoterapisi yoktur; gerekirse kas gevşemesi için lokal anestezikler veya anksiyolitikler destekleyici verilebilir."
        },
        "miniQuiz": {
            "question": "Vajinismus (Genito-Pelvik Ağrı Bozukluğu) tedavisinde Masters & Johnson'ın geliştirdiği en temel davranışçı egzersiz basamağı nedir?",
            "options": [
                "Duyusal Odaklanma (Sensate Focus) ve Kademeli Dilatör Egzersizleri",
                "Genel anestezi altında cinsel ilişki",
                "Cerrahi operasyonla kızlık zarının alınması",
                "Hipnozla tüm anıların silinmesi"
            ],
            "correctIndex": 0,
            "explanation": "Vajinismus tedavisinde performans baskısını kaldıran Duyusal Odaklanma ve pelvik kasları eğiten aşamalı dilatör egzersizleri başarı oranı %95+ olan altın standarttır."
        },
        "differentialDiagnosis": "• Disparoni (Organik Ağrı): Enfeksiyon veya endometriozise bağlı organik ağrıdır.\n• Cinsel İstek Azlığı: İstek vardır ancak istemsiz spazm nedeniyle penetrasyon gerçekleşemez.",
        "dsmCriteriaSummary": "DSM-5: Penetrasyonda belirgin güçlük + Ağrı korkusu + Pelvik taban kaslarında belirgin kasılma (Süre ≥ 6 ay).",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Bir yıllık evlilikte vajinal birleşmenin hiç gerçekleşememesi penetrasyonda süregen güçlüktür.",
                "Şiddetli acı ve yırtılma korkusu ile bacakları istemsizce kapatma, belirgin ağrı korkusu ve pelvik taban kaslarında istemsiz kasılmayı gösterir.",
                "Tampon kullanamama ve jinekolojik muayeneye girememe genellenmiş bir penetrasyon kaygısına işaret eder; organik neden saptanmamıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "female_sexual_interest_arousal",
                    "reason": "Sorunun merkezinde cinsel istek ya da uyarılma eksikliği değil, penetrasyona karşı korku ve istemsiz kasılma vardır."
                },
                {
                    "diagnosisId": "specific_phobia",
                    "reason": "Korku kan, iğne ya da yara gibi özgül bir nesneyle değil, penetrasyon ve ona eşlik eden ağrıyla ilgilidir ve tampon kullanımına da uzanır."
                },
                {
                    "diagnosisId": "female_orgasmic_disorder",
                    "reason": "Yakınma orgazma ulaşamamak değil, birleşmenin hiç gerçekleşememesidir."
                }
            ],
            "teachingPoint": "DSM-5'te vajinismus ve disparoni ‘genito-pelvik ağrı/penetrasyon bozukluğu’ adı altında birleştirilmiştir; ağrı korkusu ve pelvik kas kasılması merkezi özelliklerdir."
        }
    },
    {
        "id": "case-077",
        "caseNumber": 77,
        "difficulty": "Kolay",
        "course": "ADULT",
        "diagnosisId": "premature_ejaculation",
        "therapyId": "sensate_focus",
        "category": "SEXUAL",
        "patientSummary": "29 yaşında, erkek, yazılım mühendisi",
        "clues": [
            "29 yaşındaki erkek danışan, partneriyle cinsel ilişkilerinde vajinal penetrasyondan sonraki 20-30 saniye içinde ve kendi isteği dışında boşaldığını belirterek başvurdu.",
            "Bu durumun ilk cinsel deneyiminden beri (yaşam boyu tip) hemen her cinsel ilişkide (%90'ın üzerinde) yaşandığı bildirildi.",
            "Erken boşalma nedeniyle partnerine karşı derin bir yetersizlik ve suçluluk hissettiğini, ilişkiden kaçınmaya başladığını ifade etti.",
            "Ürolojik muayenede prostatit veya hormonal bir anomali saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Yoğun performans kaygısı, 'yine erken bitecek' felaketleştirmesi ve boşalma refleksini kontrol etme eşiğinde otonomik aşırı duyarlılık saptandı.",
            "DSM-5'e göre: Partnerle cinsel etkinlik sırasında, vajinal penetrasyonun ardından yaklaşık 1 dakika içinde ve kişinin arzusundan önce sürekli ya da yineleyici biçimde boşalma olması ve en az 6 aydır sürmesi tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "vajinal penetrasyondan sonraki 20-30 saniye içinde",
                "dsmMatch": "DSM-5 Kriter A: Penetrasyondan sonra yaklaşık 1 dakika içinde boşalma"
            },
            {
                "clueIndex": 1,
                "text": "hemen her cinsel ilişkide (%90'ın üzerinde)",
                "dsmMatch": "DSM-5 Kriter B: Cinsel etkinliğin neredeyse tamamında (%75-100) ortaya çıkma"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Cinsel Terapi (Dur-Başlat & Sıkma Teknikleri / Semans Modeli)",
            "therapyDetails": "Boşalma öncesi uyarılma platosunu tanıma eğitimi, Dur-Başlat (Stop-Start) ve Sıkma (Squeeze) egzersizleri.",
            "pharmacologyNote": "Gerektiğinde boşalmayı geciktirici Dapoksetin (kısa etkili SSRI) veya lokal geciktirici spreyler eklenebilir."
        },
        "miniQuiz": {
            "question": "DSM-5'e göre Yaşam Boyu Erken Boşalma tanısı için vajinal penetrasyondan sonraki süre eşiği yaklaşık ne kadardır?",
            "options": [
                "Yaklaşık 1 dakika içinde boşalma olması",
                "Yaklaşık 10 dakika içinde boşalma olması",
                "Yaklaşık 30 dakika içinde boşalma olması",
                "Süre eşiği yoktur, sadece partnerin isteği önemlidir"
            ],
            "correctIndex": 0,
            "explanation": "DSM-5 tanı kriterlerine göre erken boşalma için objektif süre eşiği penetrasyon sonrası yaklaşık 1 dakikadır."
        },
        "differentialDiagnosis": "• Erektil Bozukluk: Sertleşmeyi koruma güçlüğüdür.\n• Durumsal Erken Boşalma: Yeni partnerle ilk ilişkideki geçici heyecan durumudur.",
        "dsmCriteriaSummary": "DSM-5: Penetrasyondan sonraki yaklaşık 1 dakika içinde boşalma + Süre ≥ 6 ay + Neredeyse tüm ilişkilerde görülme.",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Vajinal penetrasyondan sonra 20-30 saniye içinde, istemeden boşalma yaklaşık bir dakikalık ölçütün altındadır.",
                "Durum ilk cinsel deneyiminden beri ve ilişkilerin neredeyse tamamında görülmektedir; bu yaşam boyu tipine uyar ve altı ay ölçütü karşılanır.",
                "Yetersizlik, suçluluk ve ilişkiden kaçınma belirgin sıkıntıyı gösterir; ürolojik ve hormonal neden yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "erectile_disorder",
                    "reason": "Sertleşmeyi sağlama ya da sürdürmede güçlük tarif edilmiyor; sorun boşalmanın zamanlamasıdır."
                },
                {
                    "diagnosisId": "social_anxiety",
                    "reason": "Performans kaygısı vardır, ancak yalnızca cinsel ilişkiyle ve onun sonucuyla sınırlıdır; diğer sosyal durumlarda değerlendirilme korkusu tarif edilmiyor."
                },
                {
                    "diagnosisId": "substance_induced_sexual_dysfunction",
                    "reason": "Durum ilk deneyimden beri vardır ve bir madde ya da ilaç başlangıcıyla ilişkili değildir."
                }
            ],
            "teachingPoint": "Erken boşalma tanısında ölçüt penetrasyondan sonra yaklaşık bir dakikadır; ‘yaşam boyu’ ve ‘sonradan başlayan’ tipler ayrımı nedene dair önemli ipucu verir."
        }
    },
    {
        "id": "case-078",
        "caseNumber": 78,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "erectile_disorder",
        "therapyId": "sensate_focus",
        "category": "SEXUAL",
        "patientSummary": "42 yaşında, erkek, şirket yöneticisi",
        "clues": [
            "42 yaşındaki erkek danışan, son 8 aydır eşiyle birlikte olmak istediğinde sertleşmeyi sağlamada ve ilişki sonuna dek sürdürmede belirgin güçlük yaşadığını belirterek başvurdu.",
            "Kritik ayırt edici klinik bulgu: Sabah uyandığında spontan sabah ereksiyonlarının (NPT) tamamen normal ve güçlü olduğunu, ancak eşiyle yatağa girdiğinde kalbinin çarptığını ve sertliğin hızla kaybolduğunu anlattı.",
            "İlişki anında 'Acaba yine sertleşmeyecek mi?' düşüncesine odaklandığını ve adeta kendi bedenini dışarıdan bir seyirci gibi izlediğini (seyirci kalma / spectatoring) söyledi.",
            "Kardiyovasküler, ürolojik ve hormonal testler (testosteron, prolaktin, şeker) tamamen normaldir; organik vasküler patoloji dışlanmıştır.",
            "Ruhsal Durum Muayenesinde: Başarısızlık korkusu, erkeklik rolüne dair bilişsel çarpıtmalar ve cinsel anksiyete saptandı.",
            "DSM-5'e göre: Cinsel etkinliklerin neredeyse tamamında sertliği elde etmede veya sürdürmede belirgin güçlük olması ve bu durumun en az 6 aydır sürmesi kriterini karşılar."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "sabah ereksiyonlarının",
                "dsmMatch": "Ayırıcı Tanı: Psikojenik kökeni kanıtlayan sabah ereksiyonu varlığı"
            },
            {
                "clueIndex": 2,
                "text": "kendi bedenini",
                "dsmMatch": "Psikopatoloji: Performans anksiyetesine bağlı seyirci kalma etkisi"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Duyusal Odaklanma Terapisi (Sensate Focus / Masters & Johnson)",
            "therapyDetails": "Penetrasyon yasağı konularak dokunma ve haz alma egzersizleri ile performans baskısını sıfırlama, bilişsel yeniden yapılandırma.",
            "pharmacologyNote": "Gerekirse başlangıçta güven oluşturmak için PDE-5 inhibitörleri (Sildenafil/Tadalafil) verilebilir."
        },
        "miniQuiz": {
            "question": "Psikojenik Sertleşme Bozukluğunu Organik (Damarsal/Hormonal) Sertleşme Bozukluğundan ayıran en kritik klinik öykü nedir?",
            "options": [
                "Sabah ve gece spontan ereksiyonlarının korunmuş olması ve mastürbasyonda sertleşebilme",
                "Hastanın 60 yaşından büyük olması",
                "Sertleşme sorununun sadece gündüzleri olması",
                "Hastanın hiç alkol kullanmaması"
            ],
            "correctIndex": 0,
            "explanation": "Organik bozuklukta gece/sabah ereksiyonu da kaybolur. Psikojenik vakalarda ise sabah ereksiyonları tamdır, sorun partnere karşı performans kaygısındadır."
        },
        "differentialDiagnosis": "• Organik Erektil Disfonksiyon: Diyabet, hipertansiyon veya vasküler yetmezliktedir; sabah ereksiyonları yoktur.\n• Cinsel İstek Bozukluğu: Cinsel arzu ve fanteziler tamamen yok olmuştur.",
        "dsmCriteriaSummary": "DSM-5: Cinsel etkinliklerin çoğunda sertliği elde edememe/sürdürememe + Süre ≥ 6 ay + Belirgin klinik sıkıntı.",
        "pharmacologyId": "bupropion_ndri",
        "explanation": {
            "whyThis": [
                "Sekiz aydır eşiyle cinsel etkinliklerin neredeyse tamamında sertleşmeyi sağlama ve sürdürmede güçlük, temel ölçütü ve altı ay süresini karşılar.",
                "Sabah ereksiyonlarının normal olması ve sorunun yalnızca ilişki sırasında ortaya çıkması fizyolojik kapasitenin korunduğunu gösterir.",
                "Başarısızlık beklentisi ve kendini dışarıdan izleme (seyircilik) psikojenik bir kaygı döngüsüne işaret eder; kardiyovasküler ve hormonal testler normaldir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "male_hypoactive_desire",
                    "reason": "Eşiyle birlikte olmak istemektedir; cinsel istek ve düşlemlerde azalma tarif edilmiyor."
                },
                {
                    "diagnosisId": "premature_ejaculation",
                    "reason": "Sorun boşalmanın zamanlaması değil, sertliğin kaybolmasıdır."
                },
                {
                    "diagnosisId": "substance_induced_sexual_dysfunction",
                    "reason": "Kullanılan ilaç ya da madde bildirilmiyor; ancak antihipertansif veya antidepresan kullanımı mutlaka sorulmalıdır."
                }
            ],
            "teachingPoint": "Sabah ve gece ereksiyonlarının korunması, sertleşme sorununda vasküler-organik nedenden çok psikojenik bir mekanizmayı düşündürür."
        }
    },
    {
        "id": "case-079",
        "caseNumber": 79,
        "difficulty": "Orta",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "delirium",
        "therapyId": "cbt_general",
        "category": "NEUROCOGNITIVE",
        "patientSummary": "74 yaşında, kadın, dahiliye servisinde yatan hasta",
        "clues": [
            "74 yaşındaki kadın hasta, idrar yolu enfeksiyonu nedeniyle yatırıldığı hastanede 2 gün içinde aniden ajite olmuş; hemşirelere 'Odamdaki tavandan böcekler yağıyor' diye bağırarak serumlarını sökmüştür.",
            "Kritik klinik seyir: Hastanın bilinci ve dikkati gün içinde aşırı dalgalanma (fluktuasyon) göstermekte; sabahları uykulu ve sessizken akşamları aşırı ajite ve yönelimsiz (oryantasyon bozuk) hale gelmektedir.",
            "Danışan nerede olduğunu ve hangi yılda olduğunu bilememekte, dikkatini birkaç saniyeden fazla toparlayamamaktadır.",
            "Tıbbi tetkiklerde idrar kültüründe ağır E. coli üremesi, yüksek CRP ve hafif lökositoz saptandı; beyin BT'sinde akut inme/kanama yoktur.",
            "Ruhsal Durum Muayenesinde: Dikkat ve farkındalıkta akut çöküş, görsel halüsinasyonlar, zaman-mekan oryantasyon kaybı ve dalgalı seyir gözlendi.",
            "DSM-5'e göre: Kısa bir süre içinde (saatler/günler) gelişen, dikkat ve farkındalıkta belirgin bozulma, gün içinde dalgalanma gösteren ek bilişsel bozulmalar ve genel bir tıbbi duruma doğrudan bağlı olma kriterlerini tam karşılar."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "gün içinde aşırı dalgalanma (fluktuasyon) göstermekte",
                "dsmMatch": "DSM-5 Kriter B: Hızlı başlangıç ve gün içi dalgalı seyir"
            },
            {
                "clueIndex": 0,
                "text": "tavandan böcekler yağıyor",
                "dsmMatch": "DSM-5 Kriter C: Görsel halüsinasyonlar ve algı bozukluğu"
            },
            {
                "clueIndex": 3,
                "text": "idrar kültüründe ağır E. coli üremesi",
                "dsmMatch": "DSM-5 Kriter D: Genel tıbbi duruma doğrudan bağlı fizyolojik kanıt"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Tıbbi Etiyolojiyi Tedavi & Çevresel Reoryantasyon",
            "therapyDetails": "Altta yatan enfeksiyonun hızla tedavisi, odada saat ve takvim bulundurma, tanıdık aile bireylerinin refakati ve loş gece lambası.",
            "pharmacologyNote": "Ağır ajitasyon ve halüsinasyonları kontrol etmek için düşük doz Haloperidol veya ketiapin kısa süreli kullanılır."
        },
        "miniQuiz": {
            "question": "Deliryum tablosunu Demans (Alzheimer) tablosundan ayıran en temel iki klinik özellik nedir?",
            "options": [
                "Deliryumun aniden (saatler/günler) başlaması ve gün içinde bilincin dalgalı (fluktuasyon) seyretmesi",
                "Deliryumun sadece gençlerde görülmesi",
                "Demans hastalarının hiç unutkan olmaması",
                "Deliryumda hiçbir halüsinasyon görülmemesi"
            ],
            "correctIndex": 0,
            "explanation": "Demans sinsi ve aylar/yıllar içinde ilerler; deliryum ise akut başlar, dikkat çöker ve gün içinde saatten saate şiddeti dalgalanır."
        },
        "differentialDiagnosis": "• Demans (Majör Nörobilişsel B.): Sinsi başlar, aylar/yıllar sürer, bilinç açıktır ve dikkat görece korunmuştur.\n• Şizofreni: Görsel değil işitsel halüsinasyonlar ön plandadır; genel tıbbi enfeksiyon doğrudan sebep değildir.",
        "dsmCriteriaSummary": "DSM-5: Dikkat ve farkındalıkta akut bozulma + Hızlı başlangıç ve gün içi dalgalanma + Tıbbi fizyolojik kanıt.",
        "pharmacologyId": "haloperidol_acute",
        "explanation": {
            "whyThis": [
                "Belirtiler idrar yolu enfeksiyonuyla iki gün içinde, yani saatler-günler içinde akut olarak gelişmiştir.",
                "Dikkatini birkaç saniyeden fazla toplayamama ve farkındalıkta bozulma deliryumun çekirdek ölçütüdür; yer ve zaman yönelimi de bozuktur.",
                "Sabah uykulu, akşam ajite olan dalgalı seyir ve görsel varsanılar tipiktir; ağır enfeksiyon bulguları doğrudan fizyolojik nedeni gösterir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "major_neurocognitive_alzheimer",
                    "reason": "Alzheimer aylar-yıllar içinde sinsi başlar ve bilinç ile dikkat erken dönemde korunur; burada iki günde gelişen dalgalı bir dikkat bozukluğu vardır."
                },
                {
                    "diagnosisId": "major_neurocognitive_lewy_body",
                    "reason": "Görsel varsanı ve dalgalanma Lewy cisimcikli demansı düşündürebilir, ancak tablo öncesinde ilerleyici bir bilişsel gerileme öyküsü yoktur ve enfeksiyonla akut başlamıştır."
                },
                {
                    "diagnosisId": "psychotic_due_to_medical",
                    "reason": "Varsanılar bilinç ve dikkat bozukluğu zemininde ortaya çıkıyor; bu durumda tanı deliryumdur."
                }
            ],
            "teachingPoint": "Yaşlı bir hastada ani başlayan, gün içinde dalgalanan dikkat bozukluğu görüldüğünde önce deliryumu ve altta yatan tıbbi nedeni ara."
        }
    },
    {
        "id": "case-080",
        "caseNumber": 80,
        "difficulty": "Kolay",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "major_neurocognitive_alzheimer",
        "therapyId": "cbt_general",
        "category": "NEUROCOGNITIVE",
        "patientSummary": "76 yaşında, erkek, emekli öğretmen",
        "clues": [
            "76 yaşındaki emekli öğretmen, son 2 yıldır cüzdanını nereye koyduğunu unutma, aynı soruları 10 dakika arayla tekrar tekrar sorma ve torunlarının isimlerini karıştırma şikayetleriyle ailesi tarafından getirildi.",
            "Son 6 aydır her gün gittiği mahalle bakkalından dönerken evinin yolunu kaybettiği, faturalarını ödeyemediği ve ilaçlarını kendi başına yönetemediği bildirildi.",
            "Eski çocukluk ve gençlik anılarını çok iyi hatırlamasına rağmen, sabah kahvaltısında ne yediğini veya 5 dakika önce söylenenleri tamamen unuttuğu (yakın bellek kusuru) görüldü.",
            "Kranial MR görüntülemesinde bilateral belirgin hipokampal atrofi ve temporal lobda hacim kaybı saptandı; kan biyokimyası ve B12/tiroid normaldir.",
            "Ruhsal Durum Muayenesinde: Mini Mental Test skoru 18/30 (orta evre gerileme), anomi (kelime bulma güçlüğü), içgörü kaybı ve yönetsel işlevlerde belirgin kayıp tespit edildi.",
            "DSM-5'e göre: Öğrenme ve bellek alanında sinsi başlayan, ilerleyici gerileme gösteren ve günlük yaşam aktivitelerinde tam bağımsızlığı engelleyen Majör Nörobilişsel Bozukluk tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "faturalarını ödeyemediği ve ilaçlarını kendi başına yönetemediği",
                "dsmMatch": "DSM-5 Kriter B: Günlük yaşam aktivitelerinde bağımsızlığın kaybedilmesi"
            },
            {
                "clueIndex": 3,
                "text": "bilateral belirgin hipokampal atrofi",
                "dsmMatch": "Nöropatoloji: Alzheimer'a özgü hipokampal atrofi"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Uyarım Terapisi & Bakıcı Psiko-eğitimi",
            "therapyDetails": "Hafıza albümleri, çevre güvenliği düzenlemeleri, rutin oluşturma ve bakıcı tükenmişliğini önleme desteği.",
            "pharmacologyNote": "Asetilkolinesteraz inhibitörleri (Donepezil, Rivastigmin) ve NMDA reseptör antagonisti Memantin."
        },
        "miniQuiz": {
            "question": "Alzheimer Tipi Demansta hastalığın erken ve orta evrelerinde ilk ve en belirgin çöken bilişsel alan hangisidir?",
            "options": [
                "Yeni bilgileri öğrenme ve yakın bellek (Epizodik Bellek)",
                "Eski çocukluk anıları",
                "Yürüme ve motor beceriler",
                "Görme yetisi"
            ],
            "correctIndex": 0,
            "explanation": "Alzheimer hipokampustan başladığı için ilk çöken alan yeni bilgileri kaydetme ve yakın bellektir; eski anılar uzun süre korunur."
        },
        "differentialDiagnosis": "• Deliryum: Hızlı başlar ve bilinç dalgalıdır; Alzheimer ise sinsi başlar ve bilinç uyanıktır.\n• Psödodemans (Depresif Yalancı Demans): Depresyon kaynaklıdır; hasta testlerde 'bilmiyorum' der ve çaba göstermez.",
        "dsmCriteriaSummary": "DSM-5: Bir veya daha fazla bilişsel alanda belirgin gerileme + Günlük yaşam bağımsızlığının kaybı + Sinsi başlangıç.",
        "pharmacologyId": "cholinesterase_donepezil",
        "explanation": {
            "whyThis": [
                "İki yıldır sinsi başlayan ve ilerleyen yakın bellek kaybı, yeni öğrenme ve bellek alanında belirgin gerilemedir.",
                "Yol kaybetme, fatura ödeyememe ve ilaçlarını yönetememe günlük yaşamda bağımsızlığın bozulduğunu, yani majör düzeyi gösterir.",
                "Eski anıların korunup yeni bilginin kaybolması, kelime bulma güçlüğü ve hipokampal atrofi Alzheimer tipini destekler; B12 ve tiroid normaldir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "delirium",
                    "reason": "Tablo günler içinde değil iki yılda gelişmiştir ve bilinçte dalgalanma tarif edilmiyor."
                },
                {
                    "diagnosisId": "mild_neurocognitive_alzheimer",
                    "reason": "Bilişsel kayıp faturalar ve ilaçlar gibi gündelik işlerde bağımsızlığı bozmuştur; hafif düzeyde bağımsızlık korunur."
                },
                {
                    "diagnosisId": "major_neurocognitive_vascular",
                    "reason": "Basamaklı kötüleşme, inme öyküsü ya da görüntülemede damarsal lezyon tarif edilmiyor; atrofi hipokampal ağırlıklıdır."
                }
            ],
            "teachingPoint": "Hafif ile majör nörobilişsel bozukluğu ayıran şey kaybın kendisi değil, günlük yaşam etkinliklerinde bağımsızlığın bozulup bozulmadığıdır."
        }
    },
    {
        "id": "case-081",
        "caseNumber": 81,
        "difficulty": "Zor",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "other_specified_somatic",
        "therapyId": "cbt_general",
        "category": "SOMATIC",
        "patientSummary": "34 yaşında, kadın, ev hanımı",
        "clues": [
            "34 yaşındaki danışan, 7 aydır adet görmediğini, karnının giderek büyüdüğünü, bebek tekmelerini bizzat hissettiğini ve doğumunun yaklaştığını belirterek kadın doğum kliniğine başvurdu.",
            "Fizik muayenede karnın hamile bir kadın gibi belirgin şişkin olduğu, meme uçlarından süt salgısı (galaktore) geldiği ve kilo aldığı objektif olarak gözlendi.",
            "Ancak yapılan acil transvajinal ultrasonografide rahim tamamen boş çıkmış ve serum Beta-hCG gebelik hormonu kesin olarak sıfır (<0.1 mIU/mL) bulunmuştur.",
            "Öyküde hastanın 8 yıldır kısırlık (infertilite) tedavisi gördüğü, 4 başarısız tüp bebek denemesi sonrası yoğun bir çocuk sahibi olma arzusu ve yas yaşadığı öğrenildi.",
            "Ruhsal Durum Muayenesinde: Ultrason sonuçlarına ilk başta inanmakta zorlanma; hezeyanlı bir psikoz tablosu olmaksızın yoğun psikosomatik inanç ve derin kayıp yası saptandı.",
            "DSM-5'e göre: Gebe olmadığı halde gebe olduğuna dair yanlış bir inançla birlikte karın büyümesi, amenore (adetten kesilme), süt salgısı ve fetal hareket algısı gibi objektif gebelik belirtilerinin bulunması tablosudur (psödosiyezis; DSM-5-TR'de 'Belirlenmiş Diğer Bir Bedensel Belirti ve İlişkili Bozukluk' örneği)."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "7 aydır adet görmediğini, karnının giderek büyüdüğünü, bebek tekmelerini bizzat hissettiğini",
                "dsmMatch": "DSM-5: Gebe olmadığı halde objektif gebelik belirtileri sergileme"
            },
            {
                "clueIndex": 2,
                "text": "ultrasonografide rahim tamamen boş",
                "dsmMatch": "Tanı Kriteri: Objektif gebelik yokluğunun kanıtlanması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Destekleyici Psikoterapi & İnfertilite Yas Terapisi",
            "therapyDetails": "Ultrason gerçeğinin şefkatle sunulması, infertilite yası ile çalışma ve somatizasyonun duygusal kökenlerini işleme.",
            "pharmacologyNote": "Hormonal hiperprolaktinemi varsa medikal tedavi ve eşlik eden depresyon için antidepresan."
        },
        "miniQuiz": {
            "question": "Yalancı Gebelik (Psödosiyezis) tablosunda kadında karın büyümesi ve memelerden süt gelmesi gibi fiziksel belirtilerin ortaya çıkmasının nöroendokrin mekanizması nedir?",
            "options": [
                "Yoğun psikolojik çocuk arzusunun hipotalamus-hipofiz aksını etkileyerek prolaktin ve LH salınımını değiştirmesi",
                "Hastanın karnına yastık koyması",
                "Gerçek bir virüs enfeksiyonu",
                "Zeka geriliği olması"
            ],
            "correctIndex": 0,
            "explanation": "Psödosiyeziste psikolojik arzu hipotalamo-hipofizer aksı etkileyerek prolaktin artışına, amenoreye ve karın distansiyonuna yol açan gerçek bir psikonöroendokrin tablodur."
        },
        "differentialDiagnosis": "• Somatizasyon Bozukluğu: Çoklu bedensel ağrılar vardır; spesifik gebelik tablosu yoktur.\n• Psikotik Bozukluk (Gebelik Hezeyanı): Bedensel değişiklikler olmadan sadece şizofrenik hezeyan vardır.",
        "dsmCriteriaSummary": "DSM-5-TR (belirlenmiş diğer bedensel belirti bozukluğu örneği): Gebe olunmadığı halde karın büyümesi, amenore ve galaktore ile giden yanlış gebelik inancı.",
        "pharmacologyId": "pimozide_delusional",
        "explanation": {
            "whyThis": [
                "Gebe olmadığı ultrason ve sıfır Beta-hCG ile kesinleşmişken gebe olduğuna inanması yanlış bir gebelik inancıdır.",
                "Amenore, karın büyümesi, süt salgısı ve bebek hareketi hissi gibi nesnel bedensel gebelik belirtileri eşlik etmektedir; bu tablo psödosiyezis olarak adlandırılır.",
                "DSM-5-TR psödosiyezisi ‘belirlenmiş diğer bedensel belirti ve ilişkili bozukluk’ örnekleri arasında sayar; uzun infertilite öyküsü tipik bir zemindir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "delusional_disorder",
                    "reason": "İnanç sonuçlarla sarsılabiliyor ve tabloda belirgin bedensel değişiklikler var; sanrısal gebelikte bedensel bulgular olmadan sabit bir inanç vardır."
                },
                {
                    "diagnosisId": "factitious_disorder",
                    "reason": "Belirtileri bilerek üretme ya da uydurma kanıtı yoktur; bedensel değişiklikler istemsizdir."
                },
                {
                    "diagnosisId": "somatic_symptom_disorder",
                    "reason": "Belirtilerle ilgili aşırı kaygı ve uğraştan çok, gebe olduğuna dair yanlış bir inanç ve özgül bir gebelik tablosu vardır."
                }
            ],
            "teachingPoint": "Psödosiyeziste gebelik inancına nesnel bedensel belirtiler eşlik eder; bedensel değişiklik olmadan yalnızca sabit bir inanç varsa sanrısal gebelik düşünülür."
        }
    },
    {
        "id": "case-082",
        "caseNumber": 82,
        "difficulty": "Zor",
        "course": "ADULT",
        "diagnosisId": "other_specified_ocd",
        "therapyId": "erp",
        "category": "OCD_RELATED",
        "patientSummary": "25 yaşında, erkek, yazılım mühendisi",
        "clues": [
            "25 yaşındaki danışan, vücudundan ve ağzından 'çürümüş et ve lağım gibi iğrenç bir koku' yayıldığına inanarak günde 6 kez duş aldığını, saat başı dişlerini fırçaladığını belirterek başvurdu.",
            "Ailesi, arkadaşları ve doktorlar hiçbir kötü koku almadıklarını defalarca söyleseler de danışan buna inanmamakta ve 'Beni kırmamak için yalan söylüyorsunuz' demektedir.",
            "Ofiste yanındaki arkadaşı pencereyi her açtığında veya burnuna dokunduğunda 'Benim kokumdan rahatsız oldu' diyerek (referans fikirleri) masasını terk etmekte ve son 2 aydır tamamen evden çalışmaktadır.",
            "KBB, diş hekimliği ve gastroenteroloji muayenelerinde halitozis veya organik hiçbir koku kaynağı saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Kötü koku yaydığına dair aşırı zihinsel uğraş, koku kontrol kompulsiyonları (sürekli koltuk altını koklama) ve belirgin referans düşünceleri tespit edildi.",
            "DSM-5 ve DSM-5-TR'ye göre: Başkalarınca algılanmayan ya da hafif olan kötü bir vücut kokusu yaydığına dair sürekli zihinsel uğraş ve buna eşlik eden kontrol etme/temizlik kompulsiyonları tablosudur (Koku Referans Bozukluğu; DSM-5-TR'de 'Belirlenmiş Diğer Bir Obsesif-Kompulsif ve İlişkili Bozukluk' örneği olarak kodlanır)."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "vücudundan ve ağzından 'çürümüş et ve lağım gibi iğrenç bir koku' yayıldığına inanarak",
                "dsmMatch": "Klinik özellik: Başkalarınca algılanmayan kötü vücut kokusu yayma inancı"
            },
            {
                "clueIndex": 2,
                "text": "pencereyi her açtığında",
                "dsmMatch": "Klinik özellik: Kokudan kaynaklı referans düşünceleri ve kaçınma"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Tepki Önleme ile Maruz Bırakma (ERP) & BDT",
            "therapyDetails": "Koku kontrol etme/duş alma ritüellerini kademeli durdurma, başkalarının davranışlarını kokuya yormama bilişsel yeniden yapılandırması.",
            "pharmacologyNote": "Yüksek doz SSRI grubu antidepresanlar ve dirençli vakalarda düşük doz antipsikotik güçlendirmesi."
        },
        "miniQuiz": {
            "question": "Koku Referans Bozukluğunda hastanın en sık sergilediği bilişsel çarpıtma ve davranışsal kompulsiyon nedir?",
            "options": [
                "Başkalarının burnunu tutmasını veya cam açmasını kendi kokusuna yorma (Referans) ve aşırı parfüm sıkma/yıkanma",
                "Hiç yıkanmama davranışı",
                "Sadece karanlıkta oturma",
                "Başkalarının kokusunu koklama"
            ],
            "correctIndex": 0,
            "explanation": "Koku referans bozukluğunda hasta etraftaki insanların her hareketini kendi kokusuna bağlar (referans) ve saatlerce yıkanarak ritüel yapar."
        },
        "differentialDiagnosis": "• Beden Algısı Bozukluğu (BDD): Odak koku değil, dış görünümdeki (burun, saç, cilt) estetik kusurlardır.\n• Şizofreni: Koku hezeyanı bizar bir uzaylı kontrolüyle ilişkilidir; referans bozukluğunda ise tablo kokuyla sınırlıdır.",
        "dsmCriteriaSummary": "DSM-5-TR (belirlenmiş diğer OKİB örneği): Başkalarınca algılanmayan kötü koku inancı + Yineleyici kontrol/temizlik davranışları + Sosyal izolasyon.",
        "pharmacologyId": "ssri_plus_antipsychotic",
        "explanation": {
            "whyThis": [
                "Başkalarınca alınmayan kötü bir beden ve ağız kokusu yaydığına dair süregen uğraş bu tablonun çekirdeğidir.",
                "Günde altı kez duş, saat başı diş fırçalama ve sürekli koltuk altını koklama bu uğraşa yanıt olarak yapılan yineleyici davranışlardır.",
                "Pencere açılmasını kendi kokusuna yorması ve evden çalışmaya başlaması işlev kaybını gösterir; DSM-5-TR bu tabloyu (koku referans bozukluğu) belirlenmiş diğer OKB-ilişkili bozukluklar arasında sayar."
            ],
            "whyNot": [
                {
                    "diagnosisId": "bdd",
                    "reason": "Uğraşın konusu görünümdeki bir kusur değil, algılanan bir kokudur."
                },
                {
                    "diagnosisId": "social_anxiety",
                    "reason": "Sosyal kaçınma vardır, ancak temelinde genel değerlendirilme korkusu değil, kötü koku yaydığı inancı yatar."
                },
                {
                    "diagnosisId": "delusional_disorder",
                    "reason": "İnanç güçlü olsa da kontrol ve temizlik ritüelleriyle giden bir tablo vardır; içgörü tamamen yoksa bile OKB-ilişkili tanı ‘içgörüsüz’ belirteciyle korunur."
                }
            ],
            "teachingPoint": "Koku referans bozukluğu BDD'nin ‘koku’ versiyonu gibi düşünülebilir: uğraş ve yineleyici davranışlar vardır, odak ise görünüm değil kokudur."
        }
    },
    {
        "id": "case-083",
        "caseNumber": 83,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "prolonged_grief_disorder",
        "therapyId": "ipt",
        "category": "TRAUMA",
        "patientSummary": "48 yaşında, kadın, öğretmen",
        "clues": [
            "48 yaşındaki kadın danışan, 18 ay önce eşini bir trafik kazasında kaybetmiş; aradan 1.5 yıl geçmesine rağmen acısının ilk günkü gibi taze ve dayanılmaz olduğunu belirterek başvurdu.",
            "Günün neredeyse tamamında ölen eşine karşı dinmeyen yoğun bir özlem duyduğunu, eşinin kıyafetlerini hiç yıkamadan yatağına serip her gece onlara sarılarak ağladığını anlattı.",
            "Eşinin ölümünden sonra 'Kendi benliğimin ve ruhumun da onunla birlikte öldüğünü' hissettiğini, geleceğe dair hiçbir anlam ve plan göremediğini ifade etti.",
            "Genel tıbbi ve laboratuvar testleri normaldir.",
            "Ruhsal Durum Muayenesinde: Kimlik karmaşası, ölümü kabullenmede derin kilitlenme, ölen kişiye karşı şiddetli hasret/özlem ve yaşamdan tamamen kopma duygulanımı gözlendi.",
            "DSM-5-TR'ye göre: Yakın birinin ölümünün ardından yetişkinlerde en az 12 ay geçmesine karşın dinmeyen yoğun özlem, kimlik karmaşası ve yaşama devam etmekte belirgin güçlük çekme tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "aradan 1.5 yıl geçmesine rağmen acısının ilk günkü gibi taze",
                "dsmMatch": "DSM-5-TR Süre Eşiği: Yetişkinlerde kaybın üzerinden en az 12 ay geçmiş olması"
            },
            {
                "clueIndex": 2,
                "text": "Kendi benliğimin ve ruhumun da onunla birlikte öldüğünü",
                "dsmMatch": "DSM-5-TR Kriter C: Kimliğin bir parçasının öldüğü hissi ve yalnızlık"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Uzatılmış Yas Terapisi (PGT / Shear Modeli) & Kişilerarası Terapi (IPT)",
            "therapyDetails": "Ölüm hikayesini işleme, kaybı hatırlatan kaçınmaları kırma ve ölen kişiyle kurulan bağı dönüştürerek yaşama yeniden bağlanma.",
            "pharmacologyNote": "Eşlik eden majör depresyon varsa antidepresan tedavi başlanır."
        },
        "miniQuiz": {
            "question": "DSM-5-TR'ye göre bir yas tablosuna 'Uzatılmış Yas Bozukluğu' tanısı koyabilmek için yetişkinlerde ölümün üzerinden minimum ne kadar süre geçmiş olmalıdır?",
            "options": [
                "En az 12 ay (1 yıl)",
                "En az 2 hafta",
                "En az 1 ay",
                "En az 6 ay (Bu süre sadece çocuklar içindir)"
            ],
            "correctIndex": 0,
            "explanation": "DSM-5-TR'de yetişkinler için süre eşiği en az 12 aydır (çocuk ve ergenlerde ise en az 6 aydır)."
        },
        "differentialDiagnosis": "• Normal Yas: Zamanla acının şiddeti azalır, kişi yeni ilişkilere ve hayata uyum sağlar.\n• Majör Depresyon: Genel değersizlik ve anhedoni vardır; uzatılmış yasta ise temel kilitlenme ölen kişiye duyulan yoğun hasrettir.",
        "dsmCriteriaSummary": "DSM-5-TR: Kaybın üzerinden ≥12 ay geçmesi + Yoğun hasret/özlem + Kimlik karmaşası ve yaşama devam edememe.",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Eşinin ölümünün üzerinden 18 ay geçmiştir; erişkinde en az 12 ay koşulu karşılanır.",
                "Günün çoğunda süren yoğun özlem ve eşin kıyafetlerine sarılarak ağlama, ölen kişiye odaklı süregen yas tepkisidir.",
                "Benliğinin de onunla öldüğünü hissetmesi kimlik bozulmasına, geleceği anlamsız görmesi ise yaşamı sürdürmede belirgin güçlüğe karşılık gelir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "mdd",
                    "reason": "Acının odağı genel değersizlik ya da her şeyde zevk kaybı değil, ölen kişiye duyulan özlemdir; yine de depresif epizod ölçütleri ayrıca değerlendirilmelidir."
                },
                {
                    "diagnosisId": "ptsd",
                    "reason": "Ölüm ani bir kazayla olmuş olsa da tablo yeniden yaşantılama ve kaçınma değil, özlem ve ölen kişiyle uğraştır."
                },
                {
                    "diagnosisId": "adjustment_disorder",
                    "reason": "Yas tepkisi uzatılmış yas ölçütlerini tam karşılamaktadır; bu durumda daha özgül tanı tercih edilir."
                }
            ],
            "teachingPoint": "Uzatılmış yası depresyondan ayıran ana özellik, acının ölen kişiye duyulan özlem ve onunla uğraş etrafında dönmesidir."
        }
    },
    {
        "id": "case-085",
        "caseNumber": 85,
        "difficulty": "Orta",
        "course": "COMORBID",
        "diagnosisId": "panic_disorder",
        "secondaryDiagnosisId": "agoraphobia",
        "therapyId": "interoceptive_exposure",
        "category": "ANXIETY",
        "patientSummary": "31 yaşında, kadın, mimar (Çift tanılı vaka)",
        "clues": [
            "31 yaşındaki danışan, tekrarlayan beklenmedik panik ataklar ve yardım alamama korkusuyla son 4 aydır evden dışarı tek başına adım atamadığını belirterek online terapiye başvurdu.",
            "İlk atağının metroda aniden başlayan kalp çarpıntısı, nefes darlığı ve delirme korkusuyla ortaya çıktığı, o günden beri metro, AVM, köprü ve kalabalık caddelerden tamamen kaçındığı öğrenildi.",
            "Evde tek başına kalamamakta, sadece eşi yanındayken ve hastaneye yakın güzergahlarda kısa süreliğine dışarı çıkabilmektedir.",
            "Kardiyolojik ve nörolojik tetkikler (Holter, EKG, Tiroid) tamamen temizdir.",
            "Ruhsal Durum Muayenesinde: Güvenlik arama davranışları (sürekli tansiyon aleti taşıma), interoseptif duyumlara karşı aşırı tetiktelik ve şiddetli agorafobik kaçınma saptandı.",
            "DSM-5'e göre: Vaka hem tekrarlayan beklenmedik Panik Bozukluk kriterlerini hem de kaçmanın zor olacağı ortamlardan kaçınma içeren Agorafobi kriterlerini tam olarak karşılamaktadır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "tekrarlayan beklenmedik panik ataklar",
                "dsmMatch": "1. Tanı: Panik Bozukluk"
            },
            {
                "clueIndex": 1,
                "text": "metro, AVM, köprü ve kalabalık caddelerden tamamen kaçındığı",
                "dsmMatch": "2. Tanı: Agorafobi"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "İnteroseptif Maruz Bırakma + In Vivo (Canlı) Maruz Bırakma",
            "therapyDetails": "Seans içinde bedensel duyumları kasten tetikleyip panikle baş etme (interoseptif) ve kademeli olarak korkulan mekanlara gitme (in vivo).",
            "pharmacologyNote": "SSRI grubu antidepresanlar (Sertralin/Essitalopram) birinci basamak tedavidir."
        },
        "miniQuiz": {
            "question": "Panik Bozukluk tedavisinde hastaya seans içinde kasten baş dönmesi ve kalp çarpıntısı yaşatılarak yapılan BDT tekniğine ne ad verilir?",
            "options": [
                "İnteroseptif (İçsel Duyumsal) Maruz Bırakma",
                "Sistematik Hipnoz",
                "EMDR Göz Hareketleri",
                "Diyalektik Beceri Eğitimi"
            ],
            "correctIndex": 0,
            "explanation": "İnteroseptif maruz bırakma; hastaya hiperventilasyon veya dönen sandalyeyle yapay panik duyumları yaşatarak duyarsızlaşmasını sağlar."
        },
        "differentialDiagnosis": "• Sosyal Fobi: Korku rezil olmaktır; Agorafobide ise panik anında kaçamama ve yardım bulamama korkusudur.\n• Klostrofobi: Sadece kapalı alanla sınırlıdır, spontan panik ataklar eşlik etmez.",
        "dsmCriteriaSummary": "DSM-5: Beklenmedik panik ataklar + Atak beklentisi kaygısı + Kaçışın zor olduğu ortamlardan kaçınma (Agorafobi).",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Metroda aniden başlayan çarpıntı, nefes darlığı ve delirme korkusuyla giden ataklar tekrarlayan ve beklenmedik panik ataklardır.",
                "Sürekli tansiyon aleti taşıma ve bedensel duyumlara aşırı dikkat, ataklardan sonra gelişen kaygı ve davranış değişikliğidir.",
                "Metro, AVM, köprü ve kalabalık caddelerden kaçınma ve evden yalnız çıkamama, ayrı bir agorafobi tanısının da karşılandığını gösterir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "specific_phobia",
                    "reason": "Kaçınma tek bir durumla sınırlı değil, birçok farklı alana yayılmıştır ve tetikleyicisiz ataklar vardır."
                },
                {
                    "diagnosisId": "social_anxiety",
                    "reason": "Korku başkalarınca olumsuz değerlendirilmek değil, atak sırasında kaçamamak ve yardım alamamaktır."
                },
                {
                    "diagnosisId": "anxiety_due_to_medical",
                    "reason": "EKG, Holter ve tiroid testleri temizdir; belirtileri açıklayan tıbbi bir durum yoktur."
                }
            ],
            "teachingPoint": "DSM-5'te panik bozukluk ve agorafobi ayrı tanılardır; ikisinin ölçütleri birlikte karşılanıyorsa her iki tanı da konur."
        }
    },
    {
        "id": "case-086",
        "caseNumber": 86,
        "difficulty": "Zor",
        "course": "COMORBID",
        "diagnosisId": "borderline_pd",
        "secondaryDiagnosisId": "ptsd",
        "therapyId": "dbt",
        "category": "PERSONALITY_B",
        "patientSummary": "27 yaşında, kadın, grafik tasarımcı (Çift tanılı vaka)",
        "clues": [
            "27 yaşındaki danışan, kollarındaki jilet kesikleri ve acil serviste dikilen yaralarıyla 'Beni kimse sevmiyor, terk edilmeye dayanamıyorum, acımı sadece kan görünce dindiriyorum' diyerek başvurdu.",
            "Çocukluk çağında 8 yıl boyunca birinci derece yakını tarafından ağır cinsel ve fiziksel istismara uğradığı; geceleri hala aynı kabuslarla ve flashbacklerle uyandığı öğrenildi.",
            "İlişkilerinde insanları bir anda göklere çıkarıp ardından en ufak gecikmede yerin dibine soktuğu (splitting), yoğun bir içsel boşluk ve kronik intihar düşünceleri yaşadığı belirlendi.",
            "Toksikoloji temizdir; organik patoloji saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Aşırı affektif labilite, öfke patlamaları, dissosiyatif kopmalar ve travmatik yeniden yaşantılama belirtileri eşzamanlı gözlendi.",
            "DSM-5'e göre: Vaka hem Sınırda (Borderline) Kişilik Bozukluğu kriterlerini hem de Travma Sonrası Stres Bozukluğu (TSSB) kriterlerini tam olarak karşılamaktadır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "terk edilmeye dayanamıyorum, acımı sadece kan görünce dindiriyorum",
                "dsmMatch": "1. Tanı: Borderline Kişilik Bozukluğu (NSSI ve Terk Edilme Korkusu)"
            },
            {
                "clueIndex": 1,
                "text": "ağır cinsel ve fiziksel istismara uğradığı",
                "dsmMatch": "2. Tanı: Travma Sonrası Stres Bozukluğu (TSSB)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Diyalektik Davranış Terapisi (DBT / Marsha Linehan) & DBT-PTSD",
            "therapyDetails": "Duygu düzenleme, sıkıntıya tolerans, bilinçli farkındalık ve aşamalı travma maruziyeti.",
            "pharmacologyNote": "Duygudurum dengeleyiciler (Lamotrijin) ve krizlerde düşük doz ikinci kuşak antipsikotikler."
        },
        "miniQuiz": {
            "question": "Borderline Kişilik Bozukluğu ve intihar/kendine zarar davranışları için geliştirilen kanıta dayalı altın standart terapi ekolü hangisidir?",
            "options": [
                "Diyalektik Davranış Terapisi (DBT / Marsha Linehan)",
                "Klasik Psikanaliz",
                "Gestalt Terapisi",
                "Sistemik Aile Dizimi"
            ],
            "correctIndex": 0,
            "explanation": "Marsha Linehan tarafından geliştirilen DBT, Borderline ve kendine zarar verici davranışlar için 1 numaralı altın standart terapidir."
        },
        "differentialDiagnosis": "• Bipolar II: Epizodlar haftalar sürer ve içseldir; BPD'de dalgalanmalar saatliktir ve kişilerarası tetiklenir.\n• Tek Başına TSSB: BPD'deki gibi yaygın kimlik karmaşası, splitting ve terk edilme dehşeti TSSB'ye özgü değildir.",
        "dsmCriteriaSummary": "DSM-5: Borderline Kişilik Örüntüsü (Terk edilme korkusu, kimlik karmaşası, NSSI) + Travmatik Yeniden Yaşantılama (TSSB).",
        "pharmacologyId": "ssri_plus_antipsychotic",
        "explanation": {
            "whyThis": [
                "Terk edilmeye dayanamama, yineleyen kendini kesme ve kronik intihar düşünceleri borderline kişiliğin çekirdek ölçütleridir.",
                "İnsanları idealleştirip hızla değersizleştirme, kronik boşluk, öfke patlamaları ve değişken duygulanım yaygın örüntüyü tamamlar.",
                "Çocuklukta yıllarca süren istismardan sonra hâlâ süren kabuslar ve flashbackler eşlik eden TSSB tanısını da gösterir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "bipolar_2",
                    "reason": "Duygu değişimleri günler süren epizodlar değil, kişilerarası tetikleyicilerle hızla değişen dalgalanmalardır."
                },
                {
                    "diagnosisId": "did",
                    "reason": "Dissosiyatif kopmalar var, ancak ayrı kimlik durumları ve gündelik olaylar için yineleyen amnezi tarif edilmiyor."
                },
                {
                    "diagnosisId": "mdd",
                    "reason": "İntihar düşünceleri ve boşluk süreklidir ve sınırları belli bir depresif epizod değil, kişilik düzeyinde bir örüntü içinde yer alır."
                }
            ],
            "teachingPoint": "Ağır çocukluk travması olan borderline hastalarda TSSB sık eşlik eder; iki tanı ayrı ayrı değerlendirilmeli, biri diğerini açıklamış sayılmamalıdır."
        }
    },
    {
        "id": "case-087",
        "caseNumber": 87,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "anorexia_nervosa",
        "therapyId": "cbt_e",
        "category": "EATING",
        "patientSummary": "19 yaşında, kadın, üniversite öğrencisi",
        "clues": [
            "19 yaşındaki genç kadın, bayılma nöbetleri ve aşırı zayıflık nedeniyle ailesi tarafından getirildi. Boyu 1.68 m, kilosu 43 kg (BKİ: 15.2 kg/m² - Şiddetli Zayıflık).",
            "Kemikleri sayılacak kadar zayıf olmasına rağmen aynaya baktığında 'Karnımın ve bacaklarımın yağ tulumu gibi olduğunu görüyorum' diyerek kilo almaktan dehşetle korktuğunu anlattı.",
            "Günlerce sadece marul ve maden suyu ile beslendikten sonra kontrolünü kaybedip tatlıları hızla yediğini ve hemen ardından parmağıyla kendini kusturduğunu (çıkarma atağı) söyledi.",
            "El sırtında kusmaya bağlı nasırlar (Russell belirtisi), diş minesinde asit erozyonu, hipotermi (35.4°C) ve son 6 aydır amenore (adetten kesilme) saptandı.",
            "Ruhsal Durum Muayenesinde: Beden imgesinde ağır algısal bozulma, kilo alma fobisi, mükemmeliyetçilik ve kısıtlayıcı/çıkarıcı yeme ritüelleri tespit edildi.",
            "DSM-5'e göre: Yaş ve boya göre belirgin derecede düşük vücut ağırlığı (BKİ < 18.5), kilo almaktan aşırı korku, beden imgesinde bozulma ve tekrarlayan tıkınma/çıkarma atakları tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "kilosu 43 kg (BKİ: 15.2 kg/m² - Şiddetli Zayıflık)",
                "dsmMatch": "DSM-5 Kriter A: Belirgin derecede düşük vücut ağırlığı"
            },
            {
                "clueIndex": 1,
                "text": "Karnımın ve bacaklarımın yağ tulumu gibi olduğunu görüyorum",
                "dsmMatch": "DSM-5 Kriter C: Beden ağırlığı ve biçimini algılamada bozulma"
            },
            {
                "clueIndex": 3,
                "text": "Russell belirtisi",
                "dsmMatch": "Klinik Belirteç: Kusmaya bağlı el sırtı nasırları"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Geliştirilmiş BDT (CBT-E / Fairburn) & Maudsley Aile Terapisi",
            "therapyDetails": "Kilo restorasyonu, yeme kural ve tabularını kırma, beden algısı çarpıtmalarını düzeltme ve tıkınma-çıkarma döngüsünü durdurma.",
            "pharmacologyNote": "Düşük doz Olanzapin kilo alımına ve zihinsel takıntılara yardımcı olabilir; SSRI'lar kilo düzeldikten sonra etkilidir."
        },
        "miniQuiz": {
            "question": "Tıkınma/Çıkarma Tipi Anoreksiya Nervoza ile Bulimiya Nervoza arasındaki en temel tanısal ayrım kriteri nedir?",
            "options": [
                "Hastanın vücut ağırlığının belirgin şekilde düşük (BKİ < 18.5) olması",
                "Bulimiyada hastanın hiç kusmaması",
                "Anoreksiyada hastanın kilo almayı istemesi",
                "Bulimiyanın sadece erkeklerde görülmesi"
            ],
            "correctIndex": 0,
            "explanation": "Bulimiya hastaları normal kiloda veya hafif kiloludur (BKİ >= 18.5). Kusan hasta eğer aşırı zayıfsa (BKİ < 18.5) tanı kesinlikle Anoreksiya Nervoza'dır."
        },
        "differentialDiagnosis": "• Bulimiya Nervoza: Kilo normal veya normalin üzerindedir (BKİ ≥ 18.5).\n• Tıkınırcasına Yeme Bozukluğu (BED): Kusma ve çıkarma davranışları yoktur.\n• Beden Algısı Bozukluğu (BDD): Odak kilo değil, burun veya yüz kusurlarıdır.",
        "dsmCriteriaSummary": "DSM-5: Düşük vücut ağırlığı (BKİ < 18.5) + Kilo alma korkusu + Beden algısı bozukluğu + Tıkınma/çıkarma alt tipi.",
        "pharmacologyId": "atypical_ap_secondgen",
        "explanation": {
            "whyThis": [
                "BKİ 15,2 ile yaşa ve boya göre belirgin düşük vücut ağırlığı vardır.",
                "Bu kiloda kendini yağlı görmesi ve kilo almaktan dehşetle korkması beden algısı bozukluğu ile kilo korkusu ölçütlerini karşılar.",
                "Kısıtlama dönemlerini izleyen tıkınma ve kendini kusturma, Russell belirtisi ve diş erozyonu tıkınma/çıkarma tipine işaret eder."
            ],
            "whyNot": [
                {
                    "diagnosisId": "bulimia_nervosa",
                    "reason": "Tıkınma ve kusma ortak olsa da kişi belirgin düşük kilodadır; bu durumda tanı anoreksiyadır."
                },
                {
                    "diagnosisId": "arfid",
                    "reason": "Yeme kısıtlaması duyusal özelliklerden ya da yeme korkusundan değil, kilo alma korkusu ve beden algısı bozukluğundan kaynaklanır."
                },
                {
                    "diagnosisId": "bdd",
                    "reason": "Uğraşın odağı belirli bir yüz ya da beden kusuru değil, kilo ve yağlanmadır."
                }
            ],
            "teachingPoint": "Anoreksiyanın alt tipi son üç aydaki davranışa göre belirlenir: düzenli tıkınma ya da çıkarma varsa tıkınma/çıkarma tipi, yoksa kısıtlayıcı tip."
        }
    },
    {
        "id": "case-088",
        "caseNumber": 88,
        "difficulty": "Orta",
        "course": "CHILD",
        "diagnosisId": "selective_mutism",
        "therapyId": "stimulus_fading",
        "category": "ANXIETY",
        "patientSummary": "8 yaşında, kız çocuğu, ilkokul 2. sınıf öğrencisi",
        "clues": [
            "8 yaşındaki kız çocuğunu öğretmeni ve ailesi getirdi. Öğretmeni: 'Sene başından beri 6 aydır sınıfta sesini hiç duymadık, parmak kaldırıp söz alsa bile sadece kafasını sallıyor' dedi.",
            "Annesi ev ortamında çocuğun son derece konuşkan, şarkılar söyleyen, espriler yapan ve dil gelişiminin yaşıtlarından ileri düzeyde olduğunu belirtti.",
            "Yabancı biri veya öğretmeni soru sorduğunda çocuğun yüzünün kaskatı kesildiği, göz temasını kestiği ve adeta donup kaldığı (freezing) gözlendi.",
            "İşitme testleri, KBB ve nörogelişimsel dil değerlendirmeleri tamamen normaldir; Türkçeyi anlama ve konuşma becerisinde organik bir eksiklik yoktur.",
            "Ruhsal Durum Muayenesinde: Ev videolarında son derece neşeli ve konuşkan olan çocuğun, klinik ortamda konuşma beklentisi karşısında yoğun kaygı ve seçici sessizlik yaşadığı tespit edildi.",
            "DSM-5'e göre: Konuşmanın beklendiği özgül toplumsal durumlarda (okulda) sürekli bir konuşamama hali ve bu durumun başka durumlarda (evde) akıcı konuşuyor olmasına karşın en az 1 aydır sürmesi tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "6 aydır sınıfta sesini hiç duymadık",
                "dsmMatch": "DSM-5 Kriter A: Beklenen durumlarda konuşamama"
            },
            {
                "clueIndex": 1,
                "text": "ev ortamında çocuğun son derece konuşkan",
                "dsmMatch": "DSM-5: Başka durumlarda konuşuyor olma kriteri"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Uyaran Kaydırma (Stimulus Fading) & Kademeli Maruziyet",
            "therapyDetails": "Çocuğun rahat konuştuğu ebeveynle başlayıp ortama kademeli olarak öğretmeni ve arkadaşları dahil etme, cesaretlendirme.",
            "pharmacologyNote": "Dirençli ve şiddetli vakalarda çocuk psikiyatrisi tarafından düşük doz SSRI (Fluoksetin) eklenebilir."
        },
        "miniQuiz": {
            "question": "DSM-5'e göre Seçici Konuşmazlık (Selective Mutism) tanısı için okulun ilk ayı hariç minimum ne kadar süre konuşamama gereklidir?",
            "options": [
                "En az 1 ay",
                "En az 3 ay",
                "En az 6 ay",
                "En az 1 yıl"
            ],
            "correctIndex": 0,
            "explanation": "Okula başlama çekingenliğini dışlamak için okulun ilk ayı hariç tutulur ve belirtilerin en az 1 ay sürmesi tanı için yeterlidir."
        },
        "differentialDiagnosis": "• Otizm Spektrum Bozukluğu: Genel sosyal iletişim defisiti vardır, çocuk evde de ilişki kuramaz.\n• İletişim/Dil Bozukluğu: Gramer ve dil kapasitesi yetersizdir, evde de konuşamaz.\n• Sosyal Anksiyete: Eşlik edebilir ancak selektif mutizmde tam konuşamama özgül tablosu vardır.",
        "dsmCriteriaSummary": "DSM-5: Beklenen durumlarda konuşamama + Başka ortamlarda konuşma + Süre ≥ 1 ay (ilk ay hariç) + Eğitim/sosyal başarıyı engelleme.",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Evde çok konuşkanken altı aydır sınıfta hiç konuşmaması, konuşmanın beklendiği belirli bir ortamda sürekli konuşamamadır.",
                "Yabancı ya da öğretmen soru sorduğunda donakalma ve göz temasını kesme, konuşamamanın kaygıya bağlı olduğunu gösterir.",
                "İşitme ve dil gelişimi normal, hatta ileri düzeydedir; sorun dil becerisi değildir ve süre bir ayı çoktan aşmıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "asd",
                    "reason": "Evde ilişki kuran, esprili ve konuşkan bir çocuk vardır; sosyal iletişim sorunu tüm ortamlara yayılmamıştır."
                },
                {
                    "diagnosisId": "language_disorder",
                    "reason": "Dil gelişimi yaşıtlarından ileridir; dil bozukluğunda sorun her ortamda görülür."
                },
                {
                    "diagnosisId": "social_anxiety",
                    "reason": "Kaygı eşlik ediyor, ancak tablonun merkezinde belirli ortamlarda tamamen konuşamama vardır."
                }
            ],
            "teachingPoint": "Seçici konuşmazlık tanısında konuşamamanın okulun ilk ayıyla sınırlı olmaması gerekir; ilk aydaki sessizlik uyum sürecinin parçası olabilir."
        }
    },
    {
        "id": "case-089",
        "caseNumber": 89,
        "difficulty": "Kolay",
        "course": "SUBSTANCE",
        "diagnosisId": "alcohol_use_disorder",
        "therapyId": "motivational_interviewing",
        "category": "SUBSTANCE",
        "patientSummary": "45 yaşında, erkek, eski muhasebe müdürü",
        "clues": [
            "45 yaşındaki danışan, eşinin boşanma davası açması, işten kovulması ve 3 kez alkollü araç kullanmaktan ehliyetini kaptırması sonrası 'Ben bağımlı değilim sadece stresimi yatıştırıyorum' diyerek başvurdu.",
            "Eskiden 2 kadeh rakı ile sarhoş olurken, son 2 yıldır aynı etkiyi alabilmek için her gün en az 1 büyük şişe (70'lik) rakı içtiğini (tolerans gelişimi) anlattı.",
            "Sabah uyandığında ellerinin zangır zangır titrediğini, terlediğini ve titremeyi durdurmak için sabah ilk iş olarak bir duble alkol içtiğini (göz açıcı / eye-opener yoksunluk) kabul etti.",
            "Karaciğer fonksiyon testlerinde GGT ve ALT değerleri normalin 4 katı yüksek çıkmış; hekimlerin uyarılarına rağmen içmeyi bırakamamıştır.",
            "Ruhsal Durum Muayenesinde: Ağır inkar mekanizması, aşırı alkol aşermesi (craving), kontrol kaybı ve yaşamın merkezine alkolü alma örüntüsü saptandı.",
            "DSM-5'e göre: Son 12 aylık bir dönem içinde tolerans, yoksunluk, kontrol kaybı, aşerme, zarara rağmen sürdürme ve mesleki/sosyal yıkım kriterlerinin 7 tanesini karşılamaktadır (Şiddetli Düzey)."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "aynı etkiyi alabilmek için her gün en az 1 büyük şişe",
                "dsmMatch": "DSM-5 Kriter 10: Belirgin tolerans gelişimi"
            },
            {
                "clueIndex": 2,
                "text": "duble alkol",
                "dsmMatch": "DSM-5 Kriter 11: Yoksunluk belirtilerini dindirmek için alkol alma"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Motivasyonel Görüşme & Nüks Önleme BDT (Marlatt Modeli)",
            "therapyDetails": "İnkarı kırma, değişim evrelerini ilerletme, tetikleyici ortamları tanıma ve baş etme becerileri eğitimi.",
            "pharmacologyNote": "Aşermeyi azaltmak için Akamprosat/Naltrekson; tiksindirici tedavi için Disülfiram; yoksunlukta benzodiazepin detoksu."
        },
        "miniQuiz": {
            "question": "DSM-5'e göre Alkol Kullanım Bozukluğunun 'Şiddetli' (Severe) düzeyde sınıflandırılabilmesi için 11 tanı ölçütünden en az kaç tanesinin karşılanması gerekir?",
            "options": [
                "En az 6 veya daha fazla ölçüt",
                "En az 2-3 ölçüt (Hafif düzey)",
                "En az 4-5 ölçüt (Orta düzey)",
                "11 ölçütün tamamı"
            ],
            "correctIndex": 0,
            "explanation": "DSM-5'te 2-3 belirti Hafif, 4-5 belirti Orta, 6 ve üzeri belirti Şiddetli (Severe) madde/alkol kullanım bozukluğu olarak derecelendirilir."
        },
        "differentialDiagnosis": "• Sosyal Alkol Tüketimi: Tolerans, sabah yoksunluğu ve sosyal yıkım yoktur.\n• Bipolar Manik Epizod: Manide epizodik aşırı kullanım olabilir; burada primer kimyasal bağımlılık vardır.",
        "dsmCriteriaSummary": "DSM-5: 12 aylık sürede tolerans, yoksunluk, kontrol kaybı, aşerme, zarara rağmen içme (≥6 belirti = Şiddetli).",
        "pharmacologyId": "naltrexone_acamprosate",
        "explanation": {
            "whyThis": [
                "İki kadehten günde bir şişe rakıya çıkma toleransı, sabah titremesini ‘göz açıcı’ ile giderme yoksunluğu gösterir.",
                "Alkollü araç kullanma nedeniyle üç kez ehliyet kaybı, işten çıkarılma ve boşanma davası, fiziksel tehlikeye ve toplumsal zarara rağmen kullanımı gösterir.",
                "Karaciğer bulgularına ve uyarılara rağmen bırakamaması kontrol kaybıdır; 12 ayda karşılanan yedi ölçüt ağır düzeye karşılık gelir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "alcohol_withdrawal",
                    "reason": "Sabah yoksunluğu tablonun yalnızca bir parçasıdır; asıl tanı tolerans, kontrol kaybı ve zarara rağmen süren kullanım örüntüsüdür."
                },
                {
                    "diagnosisId": "adjustment_disorder",
                    "reason": "Kişi stresi bahane etse de iş ve evlilik kayıpları alkolün nedeni değil sonucudur; kullanım ölçütleri tam karşılanıyor."
                },
                {
                    "diagnosisId": "bipolar_1",
                    "reason": "Epizodik taşkınlık, azalmış uyku ya da büyüklenmecilik tarif edilmiyor; kullanım süreklidir."
                }
            ],
            "teachingPoint": "Bağımlılıkta ‘stresimi atıyorum’ gibi inkâr ve rasyonalizasyon yaygındır; tanıyı kişinin yorumu değil, son 12 aydaki ölçüt sayısı belirler."
        }
    },
    {
        "id": "case-090",
        "caseNumber": 90,
        "difficulty": "Zor",
        "course": "ADULT",
        "diagnosisId": "delusional_disorder",
        "therapyId": "cbt_psychosis",
        "category": "PSYCHOTIC",
        "patientSummary": "52 yaşında, kadın, ev hanımı",
        "clues": [
            "52 yaşındaki danışan, 28 yıllık eşinin 'aslında öldüğünü ve şu an evde yaşayan adamın onun yerine geçen kusursuz bir dublör olduğunu' iddia ederek savcılığa başvurdu.",
            "Danışan adamın boyunun, ses tonunun ve yüz hatlarının eşine tıpatıp benzediğini kabul etmekte, ancak gözlerine baktığında 'Onun gerçek kocam olmadığını, sahte bir sahtekara ait olduğunu biliyorum' demektedir.",
            "Son 3 aydır eşiyle aynı yatakta yatmaktan korkarak kapısını arkadan kilitlediği ve eşinin hazırladığı yemekleri zehirli olabilir şüphesiyle yemediği öğrenildi.",
            "Kranial MR ve EEG tetkikleri yapılmış; sağ temporo-paryetal bölgede hafif hipoperfüzyon dışında akut nörolojik lezyon veya deliryum bulgusu saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Görsel yüz tanıma belleği korunmuş olmasına karşın, tanıdık yüze karşı duygusal aşinalık yanıtının kopmasına bağlı mono-semptomatik sanrı saptandı.",
            "DSM-5 ve psikopatolojiye göre: Kişinin birinci derece yakınının fiziksel olarak tıpatıp aynı görünen sahte bir dublörle değiştirildiğine dair sarsılmaz inançla, yani Capgras tipi yanlış tanıma sanrısıyla giden Sanrılı Bozukluk tablosudur (Capgras sanrısı DSM-5-TR'de ayrı bir tanı değil, sanrının içeriğidir)."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "kusursuz bir dublör olduğunu",
                "dsmMatch": "DSM-5 / Psikopatoloji: Yakın birinin dublörle değiştirildiği sanrısı (Capgras)"
            },
            {
                "clueIndex": 4,
                "text": "duygusal aşinalık yanıtının kopmasına bağlı",
                "dsmMatch": "Nöropsikiyatri: Ventral görsel yol ile dorsal limbik aşinalık kopukluğu"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Psikoz Terapisi (CBTp) & Atipik Antipsikotik",
            "therapyDetails": "Sanrıyı doğrudan tartışmadan duygusal yabancılaşma hissiyle çalışma, gerçeklik sınaması ve aile psiko-eğitimi.",
            "pharmacologyNote": "İkinci kuşak antipsikotikler (Risperidon, Olanzapin veya Aripiprazol) birinci basamak medikal tedavidir."
        },
        "miniQuiz": {
            "question": "Capgras Sendromunda hastanın 'Bu kişi eşime tıpatıp benziyor ama o değil, bir dublör' demesinin temel nörolojik mekanizması nedir?",
            "options": [
                "Görsel yüz tanımanın sağlam olması fakat tanıdık yüze verilen otonomik duygusal aşinalık yanıtının kopmuş olması",
                "Hastanın yüzleri hiç görememesi (Körlük)",
                "Hastanın eşinin adını unutması (Amnezi)",
                "Hastanın tamamen şakacı bir kişiliğe sahip olması"
            ],
            "correctIndex": 0,
            "explanation": "Capgras'ta ventral yüz tanıma çalışır (yüzü tanır), ancak dorsal otonomik/limbik yol çalışmaz (aşinalık hissi doğmaz). Beyin bu çelişkiyi 'tıpatıp benziyor ama bir sahtekar' sanrısıyla rasyonalize eder."
        },
        "differentialDiagnosis": "• Fregoli Sendromu: Yabancı birinin kılık değiştirmiş tanıdık bir kişi olduğu sanrısıdır (Capgras'ın tersidir).\n• Prosopagnozi (Yüz Körü): Hasta yüzü tanıyamaz ancak sanrı üretmez; sesinden tanıyınca rahatlar.\n• Paranoid Şizofreni: Çoklu bizar hezeyanlar ve halüsinasyonlar eşlik eder.",
        "dsmCriteriaSummary": "DSM-5-TR (Sanrılı Bozukluk): En az 1 aydır süren, tanıdık bir yakınının sahte bir kopya/dublörle değiştirildiğine dair sabit ve sarsılmaz sanrı; şizofreni A ölçütü karşılanmıyor, işlevsellik sanrı dışında görece korunmuş.",
        "pharmacologyId": "atypical_ap_secondgen",
        "explanation": {
            "whyThis": [
                "Eşinin yerine görünüşü tıpatıp aynı bir dublör geçtiğine dair inanç, kanıtlara rağmen sarsılmayan bir yanlış tanıma (Capgras) sanrısıdır.",
                "Kapıyı kilitleme ve yemekleri yememe davranışları sanrının içeriğiyle sınırlıdır; sanrı üç aydır, yani bir aydan uzun süredir vardır.",
                "Yüz tanıma korunmuştur ve deliryum bulgusu yoktur; Capgras ayrı bir tanı değil, sanrının içeriğidir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "schizophrenia",
                    "reason": "Tek bir sanrı vardır; varsanı, dezorganizasyon ya da negatif belirti tarif edilmiyor."
                },
                {
                    "diagnosisId": "major_neurocognitive_lewy_body",
                    "reason": "Yanlış tanıma sanrıları Lewy cisimcikli demansta sık görülür, ancak burada bilişsel gerileme, parkinsonizm ya da görsel varsanı tarif edilmiyor; sağ hemisfer bulgusu nedeniyle nörolojik izlem gerekir."
                },
                {
                    "diagnosisId": "psychotic_due_to_medical",
                    "reason": "Görüntülemede yalnızca hafif hipoperfüzyon vardır ve akut lezyon yoktur; tıbbi neden kanıtlanırsa tanı bu yöne değişir."
                }
            ],
            "teachingPoint": "Capgras gibi yanlış tanıma sanrıları ileri yaşta ilk kez çıktığında, sanrılı bozukluk demeden önce nörolojik bir hastalığı dışlamak gerekir."
        }
    },
    {
        "id": "case-091",
        "caseNumber": 91,
        "difficulty": "İleri Düzey",
        "course": "ADULT",
        "diagnosisId": "mdd",
        "therapyId": "ect_biological",
        "category": "MOOD",
        "patientSummary": "61 yaşında, erkek, emekli bankacı",
        "clues": [
            "61 yaşındaki danışan, ailesine 'Ben aslında 2 hafta önce öldüm, iç organlarım çürüdü, kalbim atmıyor ve midem olmadığı için artık yemek yiyemem' diyerek mutlak açlık grevine girdiği için acil servise getirildi.",
            "Ailesi stetoskopla kendi kalp atışını dinletmeye çalıştığında 'O duyduğunuz ses şeytanın mekanik hilesi, benim damarlarımda kan değil irin akıyor' diyerek hiçbir kanıtı kabul etmedi.",
            "Son 1 aydır banyo yapmayı ve hareket etmeyi reddetmekte, 'Cesetler yıkanmaz, beni hemen mezarlığa gömün' diye feryat etmektedir.",
            "Dahiliye muayenesinde ileri derecede dehidratasyon ve kilo kaybı saptanmış, biyokimya ve ultrason organların anatomik olarak sağlam olduğunu göstermiştir.",
            "Ruhsal Durum Muayenesinde: Ağır psikomotor retardasyon, nihilistik (varoluşu inkar eden) hezeyanlar, ölümsüz bir çürüme içinde lanetlendiği inancı ve derin psikotik çökkünlük gözlendi.",
            "DSM-5 psikotik depresyon spektrumuna göre: Kendi bedeninin, organlarının veya ruhunun tamamen yok olduğuna ya da öldüğüne dair aşırı nihilistik sanrılarla seyreden (Cotard sendromu olarak bilinen) Psikotik Özellikli Majör Depresif Bozukluk tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "Ben aslında 2 hafta önce öldüm, iç organlarım çürüdü",
                "dsmMatch": "Psikopatoloji: Aşırı nihilistik (yokluk) sanrısı (Cotard Sendromu)"
            },
            {
                "clueIndex": 4,
                "text": "nihilistik (varoluşu inkar eden) hezeyanlar",
                "dsmMatch": "DSM-5: Psikotik özellikli ağır majör depresyon tablosu"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Elektrokonvülsif Terapi (EKT) & Biyolojik Stabilizasyon",
            "therapyDetails": "Hayatı tehdit eden mutlak açlık ve ağır psikotik depresyonda en hızlı ve hayat kurtarıcı yöntem EKT'dir.",
            "pharmacologyNote": "Yüksek doz antidepresan (Venlafaksin/Sertralin) + Atipik Antipsikotik (Olanzapin/Ketiapin) kombinasyonu."
        },
        "miniQuiz": {
            "question": "Cotard Sendromunda hastanın 'Ben öldüm, kalbim ve midem yok' demesi psikopatolojide hangi sanrı (hezeyan) türünün en uç örneğidir?",
            "options": [
                "Nihilistik (Yokluk / Hiçlik) Sanrısı",
                "Erotomanik Sanrı",
                "Referans (Alınma) Sanrısı",
                "Büyüklük (Grandiyöz) Sanrısı"
            ],
            "correctIndex": 0,
            "explanation": "Cotard Sendromu, kişinin kendi varlığını, organlarını veya dünyanın varlığını inkar ettiği en ağır 'nihilistik' sanrıdır."
        },
        "differentialDiagnosis": "• Hipokondriyazis (Hastalık Kaygısı): Hasta hasta olduğunu düşünür ama yaşadığını bilir; organlarının yok olduğunu iddia etmez.\n• Şizofreni: Bizar hezeyanlar vardır ancak Cotard'daki melankolik/suçluluk temelli ölüm inancı psikotik depresyona özgüdür.",
        "dsmCriteriaSummary": "DSM-5: Kendi bedeninin/organlarının yok olduğu veya öldüğü şeklinde nihilistik sanrılarla giden psikotik depresyon.",
        "pharmacologyId": "ect_biological_acute",
        "explanation": {
            "whyThis": [
                "Bir aydır süren hareket ve banyo reddi, ağır psikomotor yavaşlama ve derin çökkünlük majör depresif epizodu gösterir.",
                "Öldüğüne, organlarının çürüdüğüne ve kalbinin atmadığına dair sarsılmaz inanç, duygudurumla uyumlu nihilistik bir sanrıdır (Cotard sendromu); bu, tanıya ‘psikotik özellikli’ belirtecinin eklenmesini gerektirir.",
                "Mutlak açlık, dehidratasyon ve kilo kaybı tablonun ağırlığını ve yaşamsal riskini gösterir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "schizophrenia",
                    "reason": "Sanrı ağır bir depresif epizod içinde ve onunla uyumlu içerikte ortaya çıkmıştır; depresyondan bağımsız psikoz tarif edilmiyor."
                },
                {
                    "diagnosisId": "illness_anxiety_disorder",
                    "reason": "Kişi hasta olmaktan korkmuyor; öldüğüne kesin olarak inanıyor ve kanıtı kabul etmiyor. Bu, kaygı değil sanrıdır."
                },
                {
                    "diagnosisId": "catatonia_associated",
                    "reason": "Hareketsizlik var, ancak donakalma, mutizm ya da kalıp duruş gibi katatoni belirtileri ayrıca tanımlanmamış; varsa depresyona eşlik eden katatoni olarak eklenir."
                }
            ],
            "teachingPoint": "Psikotik depresyonda sanrılar genellikle duygudurumla uyumludur (suçluluk, yıkım, ölüm); bu, şizofreniye karşı önemli bir ipucudur."
        }
    },
    {
        "id": "case-094",
        "caseNumber": 94,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "narcolepsy",
        "therapyId": "sleep_hygiene_stimulants",
        "category": "SLEEP",
        "patientSummary": "23 yaşında, erkek, üniversite öğrencisi",
        "clues": [
            "23 yaşındaki genç adam, arkadaşlarıyla komik bir fıkraya kahkahalarla gülerken aniden dizlerinin bağının çözüldüğünü, çenesinin düştüğünü ve bilinci tamamen açık olmasına rağmen yere yığılıp 1 dakika hareket edemediğini anlattı.",
            "Gündüzleri en heyecanlı derslerde veya araba sürerken bile önüne geçilemez bir ağırlıkla aniden uyuyakaldığını, 15-20 dakikalık bu uykulardan son derece dinlenmiş uyandığını belirtti.",
            "Gece yatağa girdiğinde uykuya dalarken odada yabancı gölgeler gördüğünü (hipnagojik halüsinasyon) ve sabahları uyandığında ses çıkaramayıp felç gibi kaldığını söyledi.",
            "Polisomnografi ve MSLT testinde ortalama uyku latansı 2.5 dakika çıkmış ve test aralıklarında erken REM başlangıcı (SOREMP) kaydedilmiştir.",
            "BOS incelemesinde Hipokretin-1 (Oreksin-A) düzeyi < 110 pg/mL (ağır eksiklik) saptandı.",
            "DSM-5'e göre: Karşı konulamaz gündüz uyku atakları ile birlikte duygusal tetiklenmeli katapleksi ve BOS hipokretin eksikliği kriterlerini tam karşılayan Tip 1 Narkolepsi tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "kahkahalarla gülerken aniden dizlerinin bağının çözüldüğünü",
                "dsmMatch": "DSM-5 Kriter B1: Duygusal tetiklenmeli katapleksi atağı"
            },
            {
                "clueIndex": 4,
                "text": "Hipokretin-1 (Oreksin-A) düzeyi < 110 pg/mL",
                "dsmMatch": "DSM-5 Kriter B2: Hipokretin/Oreksin eksikliği"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Davranışsal Uyku Yönetimi & Nörostimülan Protokolü",
            "therapyDetails": "Günde 2 kez 15 dakikalık planlı stratejik şekerlemeler, katapleksi tetikleyicilerini yönetme ve Modafinil/Sodyum Oksibat farmakoterapisi.",
            "pharmacologyNote": "Gündüz uykululuğu için Modafinil/Pitolisant; katapleksi için REM baskılayıcı antidepresanlar veya Sodyum Oksibat."
        },
        "miniQuiz": {
            "question": "Narkolepsi Tip 1 tablosunda gülme veya şaka gibi ani olumlu duygularla tetiklenen ve bilincin açık olduğu geçici kas tonusu kaybına ne ad verilir?",
            "options": [
                "Katapleksi",
                "Katalepsi",
                "Kataloni",
                "Katatoni"
            ],
            "correctIndex": 0,
            "explanation": "Katapleksi; narkolepsiye özgü, duyguyla (özellikle gülmeyle) tetiklenen ve bilinç kaybı olmaksızın aniden yere yığılmaya yol açan kas tonusu kaybıdır."
        },
        "differentialDiagnosis": "• İdiyopatik Hipersomni: Uykular dinlendirmez, katapleksi ve hipokretin eksikliği yoktur.\n• Senkop (Bayılma): Bilinç kaybı yaşanır; kataplekside ise hasta bilinci açıkken yere yığılır.\n• Epilepsi (Atonik Nöbet): EEG'de epileptik deşarjlar vardır ve gülmeyle tetiklenmez.",
        "dsmCriteriaSummary": "DSM-5: Karşı konulamaz uyku atakları (≥3 ay, ≥3 kez/hafta) + Katapleksi veya BOS Hipokretin eksikliği.",
        "pharmacologyId": "modafinil_oxybate",
        "explanation": {
            "whyThis": [
                "Kahkaha atarken bilinç açıkken dizlerin çözülmesi ve yere yığılma, duyguyla tetiklenen katapleksidir.",
                "Karşı konulamaz gündüz uyku atakları ve 15-20 dakikalık şekerlemelerden dinlenmiş uyanma narkolepsinin tipik özelliğidir; hipnagojik varsanı ve uyku felci eşlik eder.",
                "MSLT'de kısa uyku latansı ve SOREMP ile beyin omurilik sıvısında düşük hipokretin tanıyı nesnel olarak doğrular."
            ],
            "whyNot": [
                {
                    "diagnosisId": "hypersomnolence",
                    "reason": "Şekerlemeler dinlendiricidir, katapleksi vardır ve hipokretin düşüktür; aşırı uykululuk bozukluğunda bunlar görülmez."
                },
                {
                    "diagnosisId": "obstructive_sleep_apnea",
                    "reason": "Gündüz uykululuğu apnede de görülür, ancak horlama ya da solunum durması tarif edilmiyor; katapleksi ve erken REM başlangıcı narkolepsiye özgüdür."
                },
                {
                    "diagnosisId": "conversion_disorder",
                    "reason": "Yere yığılma sırasında bilinç açıktır ve atak duyguyla tetiklenir; nesnel uyku bulguları ve hipokretin eksikliği organik bir tabloyu gösterir."
                }
            ],
            "teachingPoint": "Narkolepsiyi diğer aşırı uykululuk nedenlerinden ayıran en özgül bulgu, güçlü bir duyguyla tetiklenen ve bilinç açıkken olan katapleksidir."
        }
    },
    {
        "id": "case-095",
        "caseNumber": 95,
        "difficulty": "Orta",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "rem_sleep_behavior_disorder",
        "therapyId": "safety_clonazepam",
        "category": "SLEEP",
        "patientSummary": "64 yaşında, erkek, emekli mühendis",
        "clues": [
            "64 yaşındaki danışan, gece rüyasında vahşi bir kurtla dövüştüğünü görürken yatakta yanındaki eşine yumruk atıp kaburgasını çatlatması ve yataktan halıya uçarak kafasını çarpması üzerine getirildi.",
            "Eşi, hastanın son 2 yıldır uykunun ikinci yarısında (sabaha karşı) uykusunda bağırdığını, küfür ettiğini, tekme savurduğunu ve rüyasını fiziksel olarak canlandırdığını anlattı.",
            "Uyandırıldığında konfüzyon yaşamamakta, gördüğü aksiyon ve kavga dolu rüyayı bütün detaylarıyla net olarak hatırlamaktadır.",
            "Polisomnografi kaydında REM uykusu sırasında normalde olması gereken kas felcinin (REM atonisi) tamamen kaybolduğu (RSWA) kanıtlandı.",
            "Ruhsal Durum Muayenesinde: Erken dönem koku alma kaybı eşlik etmekte olup, tablonun Parkinson veya Lewy Cisimcikli Demans riskini taşıdığı belirlendi.",
            "DSM-5'e göre: REM uykusu sırasında kas atonisinin kaybına bağlı olarak motor eylemler sergileme, uyanınca rüyayı tam hatırlama ve polisomnografik REM atonisizliği içeren RBD tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "rüyasını fiziksel olarak canlandırdığını",
                "dsmMatch": "DSM-5 Kriter A: REM uykusu sırasında motor rüya eylemleri"
            },
            {
                "clueIndex": 3,
                "text": "REM atonisi) tamamen kaybolduğu",
                "dsmMatch": "DSM-5 Kriter B: Polisomnografide REM atoni kaybı kanıtı"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Yatak Odası Güvenlik Protokolü & Klonazepam",
            "therapyDetails": "Yatak çevresindeki sivri eşyaların kaldırılması, yer minderi ve gece düşük doz Klonazepam/Melatonin.",
            "pharmacologyNote": "Klonazepam (0.5 - 2 mg) hastaların %90'ında rüya canlandırmayı durdurur; Melatonin güvenli alternatiftir."
        },
        "miniQuiz": {
            "question": "REM Uykusu Davranış Bozukluğu (RBD) teşhisi alan ileri yaştaki bir erkekte ilerleyen yıllarda en sık hangi nörodejeneratif hastalığın gelişme riski bulunur?",
            "options": [
                "Parkinson Hastalığı veya Lewy Cisimcikli Demans (Alfa-Sinükleinopati)",
                "Şizofreni",
                "Huntington Koresi",
                "Multipl Skleroz (MS)"
            ],
            "correctIndex": 0,
            "explanation": "RBD hastalarının %70-80'inde 10-15 yıl içinde Parkinson hastalığı veya Lewy cisimcikli demans (alfa-sinükleinopati) tablosu gelişir."
        },
        "differentialDiagnosis": "• Uyurgezerlik (Somnambulizm): NREM evresindedir, uyanınca amnezi vardır, rüya hatırlanmaz.\n• Gece Terörü: NREM evresindedir; çığlıkla uyanma ve konfüzyon vardır.\n• Kabus Bozukluğu: REM atonisi korunmuştur; hasta rüyasında hareket edemez, sadece uyanınca korkar.",
        "dsmCriteriaSummary": "DSM-5: REM uykusunda motor davranışlar + Uyanınca tam oryantasyon ve rüyayı hatırlama + PSG'de atoni kaybı.",
        "pharmacologyId": "clonazepam_parasomnia",
        "explanation": {
            "whyThis": [
                "Rüyada kurtla dövüşürken eşine yumruk atma ve yataktan düşme, rüya içeriğinin motor davranışla canlandırılmasıdır.",
                "Davranışlar uykunun ikinci yarısında (REM'in yoğun olduğu dönemde) olur; uyanınca konfüzyon yoktur ve rüya ayrıntılı hatırlanır.",
                "Polisomnografide REM atonisinin kaybı tanıyı doğrular; koku kaybı eşlik ettiği için sinükleinopati riski açısından izlem gerekir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "nrem_sleep_arousal",
                    "reason": "NREM uykusundan uyanma bozukluğunda (uyurgezerlik ya da uyku terörü) olaylar gecenin ilk bölümünde, NREM uykusunda olur; kişi konfüze uyanır ve rüyayı hatırlamaz."
                },
                {
                    "diagnosisId": "nightmare_disorder",
                    "reason": "Kabus bozukluğunda REM atonisi korunur ve kişi rüyasını eyleme dökmez."
                }
            ],
            "teachingPoint": "İleri yaşta başlayan REM uykusu davranış bozukluğu Parkinson ve Lewy cisimcikli demans için önemli bir erken işarettir."
        }
    },
    {
        "id": "case-096",
        "caseNumber": 96,
        "difficulty": "Zor",
        "course": "ADULT",
        "diagnosisId": "ocd",
        "therapyId": "erp",
        "category": "OCD_RELATED",
        "patientSummary": "27 yaşında, kadın, avukat",
        "clues": [
            "27 yaşındaki danışan, 3 yıldır birlikte olduğu nişanlısıyla ilgili 'Acaba onu gerçekten seviyor muyum? Ya doğru insan değilse? Ya başkasına aşık olursam?' düşüncelerini gün boyu zihninden atamadığını belirterek başvurdu.",
            "Günde 5-6 saatini internette 'Aşık olduğunuzu nasıl anlarsınız?' testlerini çözerek, arkadaşlarını arayıp 'Sizce biz mutlu muyuz?' diye güvence arayarak tükettiğini söyledi.",
            "Nişanlısının yüzündeki en ufak bir kusura odaklanıp 'Bak bu beni rahatsız etti, demek ki sevmiyorum' şeklinde sürekli içsel duygu kontrolü yapmaktadır.",
            "Tıbbi testleri olağandır; ilişkide aldatma, şiddet veya gerçek bir uyumsuzluk problemi bulunmamaktadır.",
            "Ruhsal Durum Muayenesinde: Belirsizliğe tahammülsüzlük, mükemmel partner mitleri, ilişkiye dair ego-distonik obsesyonlar ve yoğun zihinsel nötralizasyon ritüelleri saptandı.",
            "DSM-5 ve klinik literatüre göre: Partnerine olan sevgisini ve partnerinin uygunluğunu sürekli sorgulayan obsesyonlar ve aşırı güvence arama kompulsiyonlarıyla giden Obsesif-Kompulsif Bozukluk tablosudur (ilişki odaklı obsesyonlar; literatürdeki 'ROCD' DSM-5-TR'de ayrı bir tanı değildir)."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "Acaba onu gerçekten seviyor muyum? Ya doğru insan değilse?",
                "dsmMatch": "Klinik Özellik: İlişki odaklı ego-distonik obsesyonel şüpheler"
            },
            {
                "clueIndex": 1,
                "text": "güvence arayarak",
                "dsmMatch": "Kompulsiyon: Sürekli güvence arama ve ilişki test etme ritüelleri"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Tepki Önleme ile Maruz Bırakma (ERP) & BDT",
            "therapyDetails": "'Asla %100 emin olamayabilirsin' belirsizlik maruziyeti, test çözme/güvence isteme kompulsiyonlarını durdurma.",
            "pharmacologyNote": "Standart OKB protokolünde yüksek doz SSRI grubu antidepresanlar."
        },
        "miniQuiz": {
            "question": "İlişki Odaklı OKB'de (ROCD) danışanın sürekli internetten ilişki testleri çözmesi ve arkadaşlarına partnerini sorması hangi mekanizmadır?",
            "options": [
                "Kaygıyı geçici olarak dindirmeye çalışan kompulsif güvence arama davranışı",
                "Gerçek bir aldatma belirtisi",
                "Manik hezeyan",
                "Kişilik bölünmesi"
            ],
            "correctIndex": 0,
            "explanation": "ROCD hastaları zihinlerindeki 'Ya sevmiyorsam?' şüphesinin yarattığı dayanılmaz anksiyeteyi dindirmek için sürekli test çözer ve güvence arar (kompulsiyon)."
        },
        "differentialDiagnosis": "• Normal İlişki Kararsızlığı: Gerçek karakter çatışmaları vardır, günde saatlerce süren zihinsel ritüel ve acı veren obsesif döngü yoktur.\n• Yaygın Anksiyete: İlişki dışındaki tüm günlük konulara (sağlık, para, iş) dair genel kaygı hakimdir.",
        "dsmCriteriaSummary": "DSM-5: İlişki ve partnere dair günde >1 saat alan ego-distonik obsesyonlar + Güvence arama ve kıyaslama kompulsiyonları.",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Nişanlısını gerçekten sevip sevmediğine dair gün boyu süren, istenmeyen ve sıkıntı veren şüpheler obsesyondur.",
                "Testler çözme, arkadaşlardan güvence isteme ve kendi duygularını sürekli içsel olarak kontrol etme kaygıyı azaltmaya yönelik kompulsiyonlardır.",
                "Günde 5-6 saati bulan zaman kaybı ölçütü karşılar; ilişkide gerçek bir uyumsuzluk yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "gad",
                    "reason": "Kaygı birçok yaşam alanına yayılmamış, ilişki teması etrafında dönüyor ve ritüellerle yatıştırılıyor."
                },
                {
                    "diagnosisId": "adjustment_disorder",
                    "reason": "Belirli bir stresöre bağlı geçici bir tepki değil, saatler süren obsesyon-kompulsiyon döngüsü vardır."
                },
                {
                    "diagnosisId": "illness_anxiety_disorder",
                    "reason": "Güvence arama var, ancak konu sağlık değil ilişkidir."
                }
            ],
            "teachingPoint": "OKB'nin teması mikrop ya da kontrolle sınırlı değildir; ilişki şüpheleri gibi temalarda da istenmeyen düşünce ve zihinsel ritüeller tanıyı koydurur."
        }
    },
    {
        "id": "case-097",
        "caseNumber": 97,
        "difficulty": "Orta",
        "course": "CHILD",
        "diagnosisId": "arfid",
        "therapyId": "cbt_ar",
        "category": "EATING",
        "patientSummary": "11 yaşında, erkek çocuğu, ortaokul öğrencisi",
        "clues": [
            "11 yaşındaki erkek çocuğu, yalnızca belirli bir marka patates kızartması ve beyaz ekmek dışında hiçbir katı gıdayı ağzına koymaması, sebze/meyve gördüğünde öğürme krizi yaşaması nedeniyle getirildi.",
            "Çocuk tüm ıslak, pütürlü veya kokulu gıdaların dokusundan iğrendiğini, ağzına aldığında boğulacağını hissettiğini anlattı.",
            "Kilosu yaş ve boy persentiline göre 3. persentilin altına düşmüş, okul gezilerine ve arkadaş partilerine yemek korkusu yüzünden katılamaz hale gelmiştir.",
            "Kritik ayırt edici özellik: Çocuğun kilo almaktan korkma, şişman olduğunu düşünme veya beden imgesiyle ilgili KESİNLİKLE hiçbir çarpıtması ya da kusma davranışı yoktur.",
            "Ruhsal Durum Muayenesinde: Duyusal aşırı hassasiyet, gıdanın dokusal özelliklerine bağlı yoğun kaçınma ve beslenme yetersizliği tespit edildi.",
            "DSM-5'e göre: Kilo ve beden algısı bozukluğu olmaksızın, yiyeceğin duyusal özelliklerine bağlı olarak gelişen belirgin kilo kaybı ve beslenme yetersizliği (ARFID) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "gıdaların dokusundan iğrendiğini, ağzına aldığında boğulacağını",
                "dsmMatch": "DSM-5 Kriter A: Duyusal özelliklere veya olumsuz sonuçlara bağlı kaçınma"
            },
            {
                "clueIndex": 3,
                "text": "kilo almaktan korkma",
                "dsmMatch": "DSM-5 Kriter C: Anoreksiya/Bulimiya beden algısı bozukluğunun bulunmaması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Kaçıngan Yeme için BDT (CBT-AR) & Duyusal Maruziyet",
            "therapyDetails": "Besin hiyerarşisi oluşturma, dokunma/koklama ile başlayan kademeli duyarsızlaştırma ve öğürme refleksini yönetme.",
            "pharmacologyNote": "İştah artırıcı olarak düşük doz Siproheptadin veya anksiyete için düşük doz Mirtazapin eklenebilir."
        },
        "miniQuiz": {
            "question": "Kaçıngan/Kısıtlı Yiyecek Alımı Bozukluğu (ARFID) ile Anoreksiya Nervoza arasındaki en temel tanısal ayrım kriteri nedir?",
            "options": [
                "ARFID'de şişmanlama korkusu ve beden algısı bozukluğu kesinlikle yoktur; Anoreksiyada ise kilo alma dehşeti esastır.",
                "ARFID sadece yetişkinlerde görülür.",
                "Anoreksiyada hasta her türlü yemeği çok sever.",
                "ARFID hastaları sürekli kusarlar."
            ],
            "correctIndex": 0,
            "explanation": "Anoreksiya hastaları kilo almaktan korktukları için yemezler; ARFID hastaları ise yiyeceğin duyusal yapısından (dokusu/kokusu) veya boğulma korkusundan dolayı yemezler (beden algıları normaldir)."
        },
        "differentialDiagnosis": "• Anoreksiya Nervoza: Kilo alma korkusu ve kendini şişman görme düşüncesi vardır.\n• Obsesif-Kompulsif Bozukluk (OKB): Yiyecek zehirlidir veya mikropludur korkusuyla yenmez.\n• Normal Seçici Yeme: Gelişme geriliği, kilo kaybı ve sosyal yıkım yaratmaz.",
        "dsmCriteriaSummary": "DSM-5: Yiyeceklerin duyusal yapısından kaçınma + Kilo kaybı/beslenme yetersizliği + Beden imgesi bozukluğunun olmaması.",
        "pharmacologyId": "mirtazapine_nassa",
        "explanation": {
            "whyThis": [
                "Yalnızca belirli bir patates kızartması ve beyaz ekmek yemesi ve diğer yiyecekleri dokusu ve kokusu nedeniyle reddetmesi duyusal özelliklere bağlı kaçınmadır.",
                "Kilonun 3. persentilin altına düşmesi beslenme yetersizliğini, okul gezilerine ve partilere katılamaması psikososyal işlev kaybını gösterir.",
                "Kilo korkusu, beden algısı bozukluğu ve kusma yoktur; bu özellik ARFID'i yeme bozukluklarından ayırır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "anorexia_nervosa",
                    "reason": "Kilo alma korkusu ve kendini şişman görme açıkça yoktur."
                },
                {
                    "diagnosisId": "ocd",
                    "reason": "Kaçınma yiyeceğin mikroplu ya da zehirli olacağı korkusundan değil, dokusundan ve kokusundan kaynaklanır."
                },
                {
                    "diagnosisId": "asd",
                    "reason": "Duyusal seçicilik otizme eşlik edebilir, ancak sosyal iletişim sorunları ya da başka yineleyici davranışlar tarif edilmiyor; yine de taranmalıdır."
                }
            ],
            "teachingPoint": "ARFID'i ‘seçici yiyen çocuk’tan ayıran, kilo kaybı, beslenme eksikliği ya da işlev bozukluğu gibi somut sonuçların varlığıdır."
        }
    },
    {
        "id": "case-098",
        "caseNumber": 98,
        "difficulty": "Zor",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "major_neurocognitive_frontotemporal",
        "therapyId": "caregiver_behavioral",
        "category": "NEUROCOGNITIVE",
        "patientSummary": "56 yaşında, erkek, eski banka müfettişi",
        "clues": [
            "56 yaşındaki saygın bankacı, son 1.5 yılda aniden değişmiş; cenazelerde kahkahalar atmaya, sokakta yabancı kadınlara uygunsuz cinsel tekliflerde bulunmaya ve marketten para ödemeden çikolata alıp yemeye başlamıştır.",
            "Eskiden son derece nazik ve disiplinli bir insanken, ailesinin acılarına karşı tamamen duygusuzlaştığı (empati ve sempati kaybı), sürekli tatlı tükettiği bildirildi.",
            "Kritik ayırt edici özellik: Alzheimer hastalarının aksine dünkü olayları ve evinin yolunu çok iyi hatırlamakta, ancak ahlaki ve sosyal yargılama yetisi tamamen çökmüştür.",
            "Beyin MR incelemesinde bilateral frontal ve anterior temporal loblarda belirgin asimetrik atrofi saptandı; hipokampus hacmi korunmuştur.",
            "Ruhsal Durum Muayenesinde: Sosyal disinhibisyon, apati, stereotipik alkışlama hareketleri ve içgörü yokluğu gözlendi.",
            "DSM-5'e göre: Sinsi başlangıçlı erken dönem davranışsal disinhibisyon, empati kaybı, hiperoralite ve frontal/temporal atrofi ile seyreden Davranışsal Varyant Frontotemporal Nörobilişsel Bozukluk tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "cenazelerde kahkahalar atmaya",
                "dsmMatch": "DSM-5 Kriter A1: Erken davranışsal disinhibisyon (fren kaybı)"
            },
            {
                "clueIndex": 1,
                "text": "empati ve sempati kaybı",
                "dsmMatch": "DSM-5 Kriter A2: Erken apati ve empati kaybı"
            },
            {
                "clueIndex": 3,
                "text": "frontal ve anterior temporal loblarda belirgin asimetrik atrofi",
                "dsmMatch": "Nöropatoloji: Frontotemporal lob seçici atrofisi (Pick Hastalığı)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Davranışsal Çevre Yönetimi & Bakıcı Desteği",
            "therapyDetails": "Finansal erişimi kısıtlama, mutfak kilitleri ile hiperoraliteyi engelleme ve bakıcı psiko-eğitimi.",
            "pharmacologyNote": "SSRI'lar (kompulsiyon ve agresyon için); Asetilkolinesteraz inhibitörleri FTD'de etkisizdir hatta ajitasyonu artırabilir."
        },
        "miniQuiz": {
            "question": "Davranışsal Varyant Frontotemporal Demansı (bvFTD), Alzheimer Tipi Demanstan erken evrede ayıran en temel klinik profil nedir?",
            "options": [
                "FTD'de bellek korunmuşken kişilik/ahlak ve sosyal fren mekanizması çöker; Alzheimer'da ise ilk olarak yakın bellek çöker.",
                "FTD sadece 80 yaş üzerinde görülür.",
                "Alzheimer hastaları cenazede güler.",
                "FTD hastaları hiç konuşamaz."
            ],
            "correctIndex": 0,
            "explanation": "Alzheimer hipokampustan başlar (unutkanlık); Frontotemporal demans ise frontal lobdan başlar (kişilik bozulması, sosyal disinhibisyon, empati kaybı, tatlı takıntısı), bellek uzun süre sağlam kalır."
        },
        "differentialDiagnosis": "• Alzheimer Hastalığı: Erken dönemde epizodik bellek kaybı ve apraksi hakimdir, sosyal nezaket uzun süre korunur.\n• Bipolar Manik Epizod: Epizodiktir ve basınçlı konuşma vardır; FTD ise sinsi ve ilerleyici nörodejenerasyondur.",
        "dsmCriteriaSummary": "DSM-5: Erken davranışsal disinhibisyon + Empati kaybı + Hiperoralite/diyet değişimi + Frontal/temporal lob atrofisi.",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Cenazede gülme, yabancılara uygunsuz teklif ve parasını ödemeden yeme sosyal ketlenmesizliği; ailesinin acısına kayıtsızlık empati kaybını gösterir.",
                "Sürekli tatlı tüketme beslenme davranışında değişikliği, alkışlama hareketleri kalıplaşmış davranışları gösterir; bu belirtiler davranışsal varyantın tipik özellikleridir.",
                "Bellek ve yön bulma korunurken frontal ve ön temporal atrofi saptanması ve 56 yaşında sinsi başlangıç tabloyu destekler."
            ],
            "whyNot": [
                {
                    "diagnosisId": "major_neurocognitive_alzheimer",
                    "reason": "Erken dönemde bellek ve yön bulma korunmuştur, hipokampus hacmi normaldir; Alzheimer'da bellek kaybı öndedir."
                },
                {
                    "diagnosisId": "bipolar_1",
                    "reason": "Değişiklik epizodik değil, bir buçuk yılda sinsi ve ilerleyici biçimde gelişmiştir; görüntülemede atrofi vardır."
                },
                {
                    "diagnosisId": "antisocial_pd",
                    "reason": "Davranışlar yaşam boyu süren bir örüntü değil, daha önce nazik ve disiplinli olan birinde orta yaşta ortaya çıkmış bir değişikliktir."
                }
            ],
            "teachingPoint": "Orta yaşta yeni başlayan kişilik ve davranış değişikliği, bellek korunmuş olsa bile frontotemporal nörobilişsel bozukluğu düşündürmelidir."
        }
    },
    {
        "id": "case-099",
        "caseNumber": 99,
        "difficulty": "Zor",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "major_neurocognitive_another_medical",
        "therapyId": "surgical_shunt",
        "category": "NEUROCOGNITIVE",
        "patientSummary": "71 yaşında, erkek, emekli memur",
        "clues": [
            "71 yaşındaki danışan, son 8 ayda başlayan 'ayakları sanki yere mıknatısla yapışmış gibi' küçük adımlarla yürüme (manyetik yürüyüş), unutkanlık ve idrar kaçırma şikayetleriyle getirildi.",
            "Eşi, hastanın tuvalete yetişemeyip altına kaçırdığını ve düşüncelerinin çok yavaşladığını belirtti.",
            "Kranial MR görüntülemesinde BOS basıncı normal sınırlarda olmasına rağmen ventriküllerde ileri derecede genişleme (ventrikülomegali) saptandı.",
            "Yapılan tanısal lomber ponksiyon ile 40 ml BOS boşaltıldıktan 1 saat sonra hastanın yürümesinin ve dikkat süresinin dramatik olarak düzeldiği objektif olarak test edildi.",
            "Ruhsal Durum Muayenesinde: Klasik subkortikal bilişsel yavaşlama, apati ve yürütücü işlev gerilemesi gözlendi.",
            "Klinik nöropsikiyatriye göre: Yürüme apraksisi, üriner inkontinans ve demans klasik triadını (Hakim-Adams Triadı) eksiksiz karşılayan, cerrahi şantla tedavi edilebilir Normal Basınçlı Hidrosefali (NPH) tablosudur; DSM-5-TR'de 'Başka Bir Sağlık Durumuna Bağlı Majör Nörobilişsel Bozukluk' olarak kodlanır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "manyetik yürüyüş",
                "dsmMatch": "Klasik Triad 1: Yürüme apraksisi (manyetik adımlama)"
            },
            {
                "clueIndex": 1,
                "text": "tuvalete yetişemeyip altına kaçırdığını",
                "dsmMatch": "Klasik Triad 2: Üriner inkontinans (idrar kaçırma)"
            },
            {
                "clueIndex": 3,
                "text": "BOS boşaltıldıktan 1 saat sonra hastanın yürümesinin",
                "dsmMatch": "Tanı Testi: Pozitif LP Tap Testi (Geri dönüşümlü demans kanıtı)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Ventriküloperitoneal Şant Cerrahisi & Nörorehabilitasyon",
            "therapyDetails": "Beyin cerrahisi tarafından takılan VP Şant ile ventriküllerdeki aşırı BOS karın boşluğuna drene edilerek belirtiler geri döndürülür.",
            "pharmacologyNote": "Medikal tedavisi yoktur; şant cerrahisi tek kalıcı tedavidir."
        },
        "miniQuiz": {
            "question": "Normal Basınçlı Hidrosefali (NPH) tablosunu özetleyen klasik 'Hakim-Adams Triadı' hangi 3 semptomdan oluşur?",
            "options": [
                "Yürüme Bozukluğu (Manyetik Adım) + İdrar Kaçırma (İnkontinans) + Demans (Bilişsel Yavaşlama)",
                "Ateş + Baş Ağrısı + Ense Sertliği",
                "Tremor + Rijidite + Halüsinasyon",
                "Körlük + Sağırlık + Felç"
            ],
            "correctIndex": 0,
            "explanation": "Hakim-Adams Triadı: 1. Yürüme apraksisi (ayakların yere yapışması), 2. İdrar kaçırma, 3. Subkortikal demans şeklindedir."
        },
        "differentialDiagnosis": "• Alzheimer Hastalığı: İdrar kaçırma ve yürüme kaybı çok geç evrede gelir; LP tap testine yanıt vermez.\n• Parkinson Hastalığı: Dinlenme tremoru ve asimetrik rijidite vardır; NPH'de ise geniş tabanlı manyetik yürüyüş ön plandadır.",
        "dsmCriteriaSummary": "DSM-5-TR (başka bir sağlık durumuna bağlı majör NBB): Manyetik yürüme bozukluğu + Üriner inkontinans + Bilişsel yıkım + Ventrikülomegali (Geri dönüşümlü NPH).",
        "pharmacologyId": "vp_shunt_neurosurgery",
        "explanation": {
            "whyThis": [
                "Sekiz ayda gelişen unutkanlık, düşünce yavaşlaması ve yürütücü işlev gerilemesi bir nörobilişsel bozukluğu gösterir.",
                "Mıknatıslı yürüyüş, idrar kaçırma ve bilişsel yavaşlama normal basınçlı hidrosefalinin üçlüsüdür; ventriküller belirgin genişlemiştir.",
                "BOS boşaltıldıktan sonra yürüme ve dikkatin belirgin düzelmesi, tablonun tedavi edilebilir bir tıbbi duruma bağlı olduğunu gösterir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "major_neurocognitive_alzheimer",
                    "reason": "Yürüme bozukluğu ve idrar kaçırma Alzheimer'da çok geç evrede görülür ve BOS boşaltma testine yanıt beklenmez."
                },
                {
                    "diagnosisId": "major_neurocognitive_parkinson",
                    "reason": "Dinlenme tremoru ve rijidite tarif edilmiyor; yürüyüş Parkinson'a özgü değil, geniş tabanlı ve yapışkan niteliktedir."
                },
                {
                    "diagnosisId": "major_neurocognitive_vascular",
                    "reason": "Görüntülemede öne çıkan bulgu damarsal lezyon değil ventrikül genişlemesidir ve BOS boşaltma testine yanıt vardır."
                }
            ],
            "teachingPoint": "Demansla birlikte erken yürüme bozukluğu ve idrar kaçırma varsa, tedavi edilebilir bir neden olan normal basınçlı hidrosefaliyi araştır."
        }
    },
    {
        "id": "case-100",
        "caseNumber": 100,
        "difficulty": "Zor",
        "course": "SUBSTANCE",
        "diagnosisId": "hallucinogen_persisting_perception",
        "therapyId": "cbt_general",
        "category": "SUBSTANCE",
        "patientSummary": "21 yaşında, erkek, grafik öğrencisi",
        "clues": [
            "21 yaşındaki genç, 6 ay önce festivalde bir kez LSD kullandıktan aylar geçmesine rağmen görüş alanında sürekli televizyon karlanması (visual snow) ve hareket izleri (trailing) gördüğünü belirterek başvurdu.",
            "Göz doktorlarına ve nörologlara defalarca gittiğini, göz ve optik sinir muayenelerinin tamamen kusursuz çıktığını ancak görsel bozulmaların durmadığını söyledi.",
            "Özellikle karanlık ortamlarda ve yorgun olduğunda havadaki molekülleri saydam noktacıklar gibi gördüğünü, bunun panik yarattığını anlattı.",
            "Son 6 aydır kesinlikle hiçbir madde veya alkol kullanmamıştır; toksikoloji negatiftir.",
            "Ruhsal Durum Muayenesinde: Gördüğü şeylerin gerçek bir nesne olmadığını, görsel bir algı yanılsaması olduğunu tamamen bilen (içgörüsü tam) bir profil saptandı.",
            "DSM-5'e göre: Hallusinojen kullanımının sonlanmasından sonra maddenin yarattığı geometrik halüsinasyonlar, renk parlamaları ve görsel izler gibi algısal semptomların yeniden yaşanması (HPPD) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "televizyon karlanması (visual snow) ve hareket izleri (trailing)",
                "dsmMatch": "DSM-5 Kriter A: Hallusinojen kullanım sonrası algısal bozulmalar (HPPD)"
            },
            {
                "clueIndex": 4,
                "text": "algı yanılsaması olduğunu tamamen bilen (içgörüsü tam)",
                "dsmMatch": "DSM-5: Psikotik olmayan, içgörünün korunduğu algı bozukluğu"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi & Görsel Uyaran Duyarsızlaştırması",
            "therapyDetails": "Görsel karlanmaya odaklanmayı kesme, felaketleştirici delirme inançlarıyla çalışma ve anksiyete yönetimi.",
            "pharmacologyNote": "Lamotrijin (GABAerjik kortikal stabilizasyon) ve Klonazepam semptom şiddetini azaltmada etkilidir; antipsikotikler semptomları kötüleştirebilir."
        },
        "miniQuiz": {
            "question": "HPPD (Hallusinojen Kalıcı Algı Bozukluğu) tablosunda hastanın gördüğü 'görsel kar ve ışık izleri' ile Şizofrenideki halüsinasyonlar arasındaki en temel fark nedir?",
            "options": [
                "HPPD'de hasta gördüklerinin beynin yarattığı bir algı yanılgısı olduğunu bilir (içgörüsü tamdır); Şizofrenide ise hezeyani gerçeklik sanılır.",
                "HPPD sadece gece uyurken görülür.",
                "Şizofrenide göz testleri bozuk çıkar.",
                "İkisi tamamen aynı tablodur."
            ],
            "correctIndex": 0,
            "explanation": "HPPD hastalarının gerçeklik değerlendirmesi ve içgörüsü tamdır; gördükleri görsel bozulmalardan korkarlar ama bunların gerçek nesneler olmadığını bilirler."
        },
        "differentialDiagnosis": "• Psikotik Bozukluk: İçgörü yoktur, sesler ve bizar hezeyanlar eşlik eder.\n• Göz Hastalıkları (Retina Yırtığı): Oftalmolojik muayenede organik patoloji görülür.",
        "dsmCriteriaSummary": "DSM-5: Hallusinojen kesildikten sonra geometrik şekiller, renk parlamaları, görsel kar veya izlerin sürmesi.",
        "pharmacologyId": "lamotrigine_bipolar2",
        "explanation": {
            "whyThis": [
                "Tek bir LSD kullanımından altı ay sonra hâlâ süren görsel kar, hareket izleri ve noktacıklar, hallüsinojen etkisindeyken yaşanan algısal belirtilerin madde bırakıldıktan sonra yeniden yaşanmasıdır.",
                "Kişi gördüklerinin gerçek olmadığını bilir; içgörü tamdır.",
                "Belirtiler sıkıntı yaratmaktadır; göz ve optik sinir muayeneleri normal, toksikoloji negatiftir ve son altı ayda madde kullanımı yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "substance_induced_psychotic",
                    "reason": "İçgörü tamdır ve sanrı yoktur; algısal değişikliklerin gerçek olmadığını bilmek psikotik bir tabloyu dışlar."
                },
                {
                    "diagnosisId": "hallucinogen_use_disorder",
                    "reason": "Tek bir kullanım bildirilmiştir; tolerans, kontrol kaybı ya da zarara rağmen süren kullanım örüntüsü yoktur."
                },
                {
                    "diagnosisId": "panic_disorder",
                    "reason": "Panik, görsel belirtilere ikincil olarak ortaya çıkıyor; beklenmedik ataklar tablonun merkezinde değildir."
                }
            ],
            "teachingPoint": "HPPD'yi psikotik bozukluktan ayıran şey içgörünün korunmasıdır: kişi algıladığı değişikliklerin maddenin bıraktığı izler olduğunu bilir."
        }
    },
    {
        "id": "case-101",
        "caseNumber": 101,
        "difficulty": "Kolay",
        "course": "CHILD",
        "diagnosisId": "childhood_fluency_disorder",
        "therapyId": "speech_therapy",
        "category": "NEURODEV",
        "patientSummary": "7 yaşında, erkek çocuğu, ilkokul 1. sınıf öğrencisi",
        "clues": [
            "7 yaşındaki ilkokul öğrencisi, konuşurken bazı heceleri 'a-a-a-araba' şeklinde defalarca tekrar etmesi, sesleri 'ssss-su' şeklinde uzatması ve kelimelerin başında takılıp kalması (bloklar) nedeniyle getirildi.",
            "Konuşmakta zorlandığı anlarda yüzünü buruşturduğu, gözlerini sıkıca kırpıştırdığı ve ayağını yere vurduğu (mücadele davranışları) gözlendi.",
            "Bu konuşma güçlüğünün 4 yaşında başladığı, okulda sesli okuma yapması gerektiğinde kaygısının ve kekelemesinin tavan yaptığı bildirildi.",
            "Odyolojik ve KBB incelemeleri normaldir; işitme kaybı veya ses tellerinde organik bir defisit yoktur.",
            "Ruhsal Durum Muayenesinde: Çocuğun şarkı söylerken veya yalnız başına konuşurken HİÇ KEKEMEDİĞİ, akıcılık bozukluğunun sosyal konuşmada ortaya çıktığı tespit edildi.",
            "DSM-5'e göre: Yaşına uygun olmayan ses/hece yinelemeleri, uzatmalar, kırık sözcükler ve işitilebilir bloklarla seyreden Çocuklukta Başlayan Akıcılık Bozukluğu (Kekemelik) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "heceleri 'a-a-a-araba' şeklinde defalarca tekrar etmesi, sesleri 'ssss-su' şeklinde uzatması",
                "dsmMatch": "DSM-5 Kriter A: Ses/hece yinelemeleri ve ses uzatmaları"
            },
            {
                "clueIndex": 4,
                "text": "şarkı söylerken veya yalnız başına konuşurken HİÇ KEKEMEDİĞİ",
                "dsmMatch": "Klinik Özellik: Otomatik konuşma ve şarkıda akıcılığın korunması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Dil ve Konuşma Terapisi (Lidcombe Programı & Akıcılık Şekillendirme)",
            "therapyDetails": "Ebeveyn destekli akıcı konuşmaları pekiştirme, yumuşak ses başlangıçları (soft contacts) ve nefes senkronizasyonu.",
            "pharmacologyNote": "Primer farmakoterapisi yoktur; aşırı sosyal anksiyete eşlik ediyorsa destekleyici yaklaşım uygulanır."
        },
        "miniQuiz": {
            "question": "Gelişimsel Kekemelik (Akıcılık Bozukluğu) olan bir çocukta aşağıdaki durumlardan hangisinde kekemelik tipik olarak tamamen kaybolur veya belirgin şekilde azalır?",
            "options": [
                "Şarkı söylerken, koro halinde okurken veya fısıltıyla konuşurken",
                "Sınıfta tahtaya kalkıp öğretmenine konuşurken",
                "Telefonda tanımadığı birine adres tarif ederken",
                "Öfkelenip tartışırken"
            ],
            "correctIndex": 0,
            "explanation": "Şarkı söylerken ve koro halinde okurken sağ hemisfer ve işitsel geri bildirim devreye girdiğinden kekemelik geçici olarak tamamen kaybolur."
        },
        "differentialDiagnosis": "• Sosyal Anksiyete: Çocuk kekelemez, genel sosyal ortamlarda konuşmaktan utanır.\n• Tourette Sendromu: İstemsiz motor ve vokal tikler (küfür/homurtu) vardır; konuşma akıcılığı bozukluğu primer değildir.",
        "dsmCriteriaSummary": "DSM-5: Ses ve hece yinelemeleri + Ses uzatmaları + Kırık sözcükler ve bloklar + İletişim yetisini kısıtlama.",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Hece tekrarları, ses uzatmaları ve kelime başında takılmalar (bloklar) yaşına uygun olmayan akıcılık bozulmalarıdır.",
                "Konuşurken yüz buruşturma, göz kırpma ve ayağı yere vurma kekemelikle ilişkili mücadele davranışlarıdır.",
                "Belirtiler 4 yaşında, yani erken gelişim döneminde başlamıştır ve sesli okumada kaygıyla artar; işitme ve ses telleri normaldir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "tourette",
                    "reason": "Göz kırpma ve ayak vurma konuşma güçlüğü anında ortaya çıkan mücadele davranışlarıdır; konuşmadan bağımsız motor ve vokal tikler tarif edilmiyor."
                },
                {
                    "diagnosisId": "social_anxiety",
                    "reason": "Kaygı konuşma güçlüğünün sonucu olarak ortaya çıkıyor; birincil sorun konuşmanın akıcılığıdır."
                },
                {
                    "diagnosisId": "speech_sound_disorder",
                    "reason": "Sorun seslerin doğru üretilmesi değil, konuşmanın akışı ve zamanlamasıdır."
                }
            ],
            "teachingPoint": "Kekemelikte şarkı söylerken ya da yalnız konuşurken akıcılığın düzelmesi tipiktir ve organik bir konuşma sorununa karşı önemli bir ipucudur."
        }
    },
    {
        "id": "case-102",
        "caseNumber": 102,
        "difficulty": "Kolay",
        "course": "CHILD",
        "diagnosisId": "specific_learning_disorder",
        "therapyId": "special_education",
        "category": "NEURODEV",
        "patientSummary": "9 yaşında, kız çocuğu, 3. sınıf öğrencisi",
        "clues": [
            "9 yaşındaki kız çocuğu, normalin üzerinde zekaya (WISC-IV IQ: 118) sahip olmasına rağmen 3. sınıfta yaşıtları gibi akıcı okuyamadığı ve harfleri karıştırdığı için getirildi.",
            "Okuma yaparken 'b' ile 'd', 'p' ile 'q', '6' ile '9' harf ve rakamlarını ters algıladığını, hecelerken satır atladığını veya harf ekleyip çıkardığını anlattı.",
            "Öğretmeninin sözlü sorduğu tüm sorulara harika yanıtlar verirken, yazılı testlerde okuma yavaşlığı nedeniyle süre yetiremediği öğrenildi.",
            "Görme muayenesi ve nörolojik değerlendirme tamamen normaldir; duyusal görme kusuru dışlanmıştır.",
            "Ruhsal Durum Muayenesinde: Fonolojik farkındalık defisiti, okuma kaygısı ve 'ben aptal mıyım?' şeklinde gelişen ikincil özgüven eksikliği gözlendi.",
            "DSM-5'e göre: Normal zeka ve eğitime karşın sözcük okuma doğruluğu, okuma hızı ve akıcılığında en az 6 aydır süren belirgin kronik güçlükle seyreden Özgül Öğrenme Bozukluğu (Disleksi) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "'b' ile 'd', 'p' ile 'q', '6' ile '9' harf ve rakamlarını ters algıladığını",
                "dsmMatch": "DSM-5 Kriter A1: Yanlış, yavaş ve zahmetli sözcük okuma (Ayna harf algısı)"
            },
            {
                "clueIndex": 0,
                "text": "normalin üzerinde zekaya (WISC-IV IQ: 118) sahip olmasına rağmen",
                "dsmMatch": "DSM-5 Kriter B: Zihinsel yetiyitimi olmaksızın akademik güçlük"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Çok Duyulu Yapılandırılmış Özel Eğitim (Orton-Gillingham)",
            "therapyDetails": "Görsel, işitsel ve kinestetik kanalları eşzamanlı kullanan fonolojik farkındalık eğitimi ve bireyselleştirilmiş okuma programı.",
            "pharmacologyNote": "İlaç tedavisi yoktur; eşlik eden DEHB varsa metilfenidat dikkat süresini toparlamada kullanılır."
        },
        "miniQuiz": {
            "question": "Disleksi (Özgül Öğrenme Bozukluğu) tanısı konulan bir çocuk hakkında aşağıdaki ifadelerden hangisi bilimsel olarak DOĞRUDUR?",
            "options": [
                "Disleksili bireyler normal veya üstün zekaya sahiptir; sorun zekada değil beynin fonolojik (ses-harf) işleme merkezlerindedir.",
                "Disleksi bir zeka geriliğidir.",
                "Disleksi gözlük takılarak tamamen tedavi edilir.",
                "Disleksili çocuklar hiçbir zaman üniversite okuyamaz."
            ],
            "correctIndex": 0,
            "explanation": "Disleksi zeka geriliği değildir; zekası normal/üstün olan çocukların dili ve harf seslerini kodlama biçimindeki nörogelişimsel bir farklılıktır."
        },
        "differentialDiagnosis": "• Zihinsel Yetiyitimi: Tüm bilişsel alanlarda (sözlü, pratik, mantık) genel gerilik vardır.\n• Görme Kusurları: Gözlükle düzeltilen refraksiyon kusurlarıdır.",
        "dsmCriteriaSummary": "DSM-5: En az 6 aydır süren hatalı/yavaş sözcük okuma + Normal zekaya rağmen akademik başarının geride kalması.",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Üçüncü sınıfta akıcı okuyamama, harf karıştırma, satır atlama ve harf ekleyip çıkarma sözcük okuma doğruluğu ve hızında güçlüğü gösterir.",
                "Zeka 118 ile normalin üstündedir ve sözlü yanıtları çok iyidir; güçlük okuma becerisine özgüdür.",
                "Yazılı sınavlarda süre yetirememe akademik işlevi etkilemektedir; görme ve nörolojik değerlendirme normaldir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "intellectual_disability_mild",
                    "reason": "Zeka normalin üstündedir ve sözlü beceriler güçlüdür; güçlük tüm alanlara yayılmamıştır."
                },
                {
                    "diagnosisId": "adhd",
                    "reason": "Satır atlama dikkatsizlik gibi görünebilir, ancak sorun okumaya özgüdür ve diğer ortamlarda dikkat sorunları tarif edilmiyor."
                },
                {
                    "diagnosisId": "language_disorder",
                    "reason": "Sözlü yanıtları çok iyidir; güçlük konuşma dilini anlama ve kullanmada değil, yazılı sözcükleri çözmededir."
                }
            ],
            "teachingPoint": "Özgül öğrenme bozukluğunda güçlük zekayla açıklanamaz ve belirli becerilerle sınırlıdır; etkilenen alan (burada okuma, yani disleksi) belirteç olarak eklenir ve uygun müdahaleye rağmen en az altı ay sürmesi gerekir."
        }
    },
    {
        "id": "case-103",
        "caseNumber": 103,
        "difficulty": "Orta",
        "course": "CHILD",
        "diagnosisId": "developmental_coordination_disorder",
        "therapyId": "occupational_coop",
        "category": "NEURODEV",
        "patientSummary": "8 yaşında, erkek çocuğu",
        "clues": [
            "8 yaşındaki çocuk, ayakkabı bağcıklarını asla bağlayamaması, düğmelerini ilikleyememesi, makas kullanamaması ve düz yolda yürürken bile sürekli düşüp bir yerlerini morartması nedeniyle getirildi.",
            "Beden eğitimi derslerinde topu tutamadığı, bisiklete binmeyi öğrenemediği ve arkadaşları tarafından sakarlığı yüzünden oyunlara alınmadığı anlatıldı.",
            "Zeka düzeyi tamamen normaldir (IQ: 105); sözlü iletişimi ve hafızası çok kuvvetlidir.",
            "Pediatrik nörolojik muayenede serebral palsi veya müsküler distrofi gibi hiçbir organik kas/sinir hastalığı saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Motor planlama (praksis) yetersizliği, motor becerilerde kronik sakarlık ve ikincil özgüven eksikliği belirlendi.",
            "DSM-5'e göre: Motor becerilerin edinilmesi ve icrasının kronolojik yaşın belirgin biçimde gerisinde olması (sakarlık, yavaşlık, beceriksizlik) ve kas hastalığına bağlı olmaması ile giden Gelişimsel Koordinasyon Bozukluğu tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "ayakkabı bağcıklarını asla bağlayamaması, düğmelerini ilikleyememesi, makas kullanamaması",
                "dsmMatch": "DSM-5 Kriter A: Motor becerilerin koordinasyonunda belirgin gerilik"
            },
            {
                "clueIndex": 3,
                "text": "serebral palsi veya müsküler distrofi gibi hiçbir organik",
                "dsmMatch": "DSM-5 Kriter D: Nörolojik motor hastalıkların dışlanması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "CO-OP / Bilişsel Yönelimli Mesleki Terapi (Ergoterapi)",
            "therapyDetails": "'Hedef-Plan-Yap-Kontrol Et' metoduyla günlük motor görevleri aşamalandırarak öğretme ve duyu bütünleme terapisi.",
            "pharmacologyNote": "Spesifik ilaç tedavisi yoktur; ergoterapi ve motor fizyoterapi esastır."
        },
        "miniQuiz": {
            "question": "Gelişimsel Koordinasyon Bozukluğu (Dispraksi) olan bir çocuğun temel klinik problemi aşağıdakilerden hangisidir?",
            "options": [
                "Beynin karmaşık motor hareketleri planlama ve koordine etme (praksis) yetersizliği",
                "Kaslarının tamamen felç olması",
                "Gözlerinin hiç görmemesi",
                "Kasıtlı olarak eşyaları kırma arzusu"
            ],
            "correctIndex": 0,
            "explanation": "Disprakside kas gücü normaldir ancak beyin hareketin basamaklarını planlamakta ve sıraya koymakta (motor praksis) güçlük çeker."
        },
        "differentialDiagnosis": "• Serebral Palsi / Distrofi: Organik kas spastisitesi veya kas erimesi mevcuttur.\n• DEHB: Dürtüsellik ve acelecilikten kaynaklı sakarlık vardır; motor planlama testi tek başına normallik gösterebilir.",
        "dsmCriteriaSummary": "DSM-5: Motor koordinasyon becerilerinin yaşın belirgin gerisinde olması + Günlük yaşam aktivitelerini bozması.",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Bağcık bağlama, düğme ilikleme ve makas kullanmada güçlük, top tutamama ve bisiklete binememe motor becerilerin yaşının belirgin gerisinde olduğunu gösterir.",
                "Sakarlık nedeniyle oyunlardan dışlanma gündelik yaşam ve okul işlevini etkilemektedir.",
                "Zeka normaldir ve serebral palsi ya da kas hastalığı gibi nörolojik bir neden bulunmamıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "adhd",
                    "reason": "Sakarlık acelecilik ya da dikkatsizlikten değil, motor planlama güçlüğünden kaynaklanır; dikkatsizlik ve dürtüsellik tarif edilmiyor."
                },
                {
                    "diagnosisId": "intellectual_disability_mild",
                    "reason": "Zeka normal düzeydedir; güçlük motor alanla sınırlıdır."
                },
                {
                    "diagnosisId": "asd",
                    "reason": "Motor beceriksizlik otizmde görülebilir, ancak sosyal iletişim sorunları ve kısıtlı ilgiler tarif edilmiyor; arkadaşlardan dışlanma sakarlığın sonucudur."
                }
            ],
            "teachingPoint": "Gelişimsel eşgüdüm bozukluğu tanısı için motor güçlüğün zeka geriliği, görme sorunu ya da nörolojik bir hastalıkla açıklanmaması gerekir."
        }
    },
    {
        "id": "case-104",
        "caseNumber": 104,
        "difficulty": "Zor",
        "course": "FORENSIC",
        "diagnosisId": "nrem_sleep_arousal",
        "therapyId": "sleep_safety_cbt",
        "category": "SLEEP",
        "patientSummary": "33 yaşında, erkek, evli",
        "clues": [
            "33 yaşındaki evli erkek, gece derin uykudayken eşine agresif biçimde cinsel ilişki girişiminde bulunduğu, eşi kendisini ittiğinde dahi mekanik olarak mastürbasyon yapmayı sürdürdüğü ve sabah uyandığında hiçbir şey hatırlamadığı için başvurdu.",
            "Bu durumun son 1 yıldır ayda 2-3 kez uykunun ilk 3 saati içinde (derin NREM yavaş dalga uykusunda) tekrarlandığı ve evliliklerinde ağır bir güven krizine yol açtığı öğrenildi.",
            "Uyanıkken eşine karşı son derece nazik, saygılı ve cinsel taciz eğilimi olmayan biridir; eylemler uyanıkken asla tekrarlanmamaktadır.",
            "Video-Polisomnografi incelemesinde derin N3 NREM evresinden ani konfüzyonel uyanma ve bu sırada otomatik pelvik/mastürbatuar motor davranışlar EEG ile kaydedildi.",
            "Ruhsal Durum Muayenesinde: Sabah tam amnezi, yoğun adli suçluluk/korku ve parasomnik disinhibisyon tablosu tespit edildi.",
            "DSM-5-TR ve uyku tıbbı kriterlerine göre: Tam bilinç dışı otomatik cinsel davranışlar ve sonrasında amnezi ile seyreden NREM Uykusundan Uyanma Bozukluğu, Uyurgezerlik Tipi (uykuyla ilişkili cinsel davranış / seksomni belirleyicisiyle) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "derin uykudayken eşine agresif biçimde cinsel ilişki girişiminde bulunduğu",
                "dsmMatch": "DSM-5 / Uyku Tıbbı: NREM parasomnisi sırasında otomatik cinsel eylemler ve tam amnezi"
            },
            {
                "clueIndex": 3,
                "text": "derin N3 NREM evresinden ani konfüzyonel uyanma",
                "dsmMatch": "Polisomnografi: N3 yavaş dalga uykusunda parsiyel uyanma kanıtı"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Uyku Güvenliği, Klonazepam & Stres Azaltma Protokolü",
            "therapyDetails": "Yatak odası kapısına alarm takılması, eşin ayrı uyuması, uyku yoksunluğu ve alkolün sıfırlanması, Klonazepam tedavisi.",
            "pharmacologyNote": "Düşük doz Klonazepam (0.5 - 2 mg) NREM uyanma ataklarını baskılamada en etkili farmakoterapidir."
        },
        "miniQuiz": {
            "question": "Seksomni (Uykuda Cinsel Davranış) vakalarında eylemler uykunun hangi evresinde gerçekleşir ve sabah hatırlanır mı?",
            "options": [
                "Derin NREM (N3 / Yavaş Dalga) evresinde gerçekleşir ve sabah tam amnezi (hatırlamama) vardır.",
                "REM uykusunda gerçekleşir ve rüya çok net hatırlanır.",
                "Sadece uyanıkken gündüzleri olur.",
                "Her zaman uyanınca tam olarak hatırlanır."
            ],
            "correctIndex": 0,
            "explanation": "Seksomni bir NREM parasomnisidir; beynin korteksi uykudayken motor cinsel merkezler otomatik uyanır ve sabah tam amnezi görülür."
        },
        "differentialDiagnosis": "• Bilinçli Cinsel Saldırı (Adli Suç): Fail uyanıktır, eylemi planlar ve amnezi rolü yapar; PSG incelemesinde NREM disosiasyonu saptanmaz.\n• REM Uykusu Davranış Bozukluğu (RBD): REM evresindedir ve rüya net hatırlanır.",
        "dsmCriteriaSummary": "DSM-5: NREM yavaş dalga uykusunda otomatik cinsel davranışlar + Sabah tam bellek kaybı (Amnezi).",
        "pharmacologyId": "clonazepam_parasomnia",
        "explanation": {
            "whyThis": [
                "Davranışlar uykunun ilk saatlerinde, derin NREM evresinden tamamlanmamış uyanmalar sırasında ortaya çıkmaktadır.",
                "Eşinin tepkisine yanıt vermeme ve sabah tam amnezi, uyurgezerlik tipi NREM uyanma bozukluğunun özelliğidir; cinsel davranış ‘uykuyla ilişkili cinsel davranış’ belirtecine uyar.",
                "Video-polisomnografi N3 evresinden konfüzyonel uyanmayı ve eşzamanlı otomatik davranışları kaydetmiştir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "rem_sleep_behavior_disorder",
                    "reason": "Olaylar REM'de değil derin NREM'de, gecenin ilk bölümünde olmaktadır ve rüya hatırlanmaz."
                },
                {
                    "diagnosisId": "sexual_sadism",
                    "reason": "Davranışlar uyanıkken hiç görülmüyor ve partnerin acı çekmesine yönelik bir uyarılma örüntüsü tarif edilmiyor."
                },
                {
                    "diagnosisId": "dissociative_amnesia",
                    "reason": "Amnezi yalnızca uykudan kısmi uyanma sırasındaki olaylarla sınırlıdır; uyanıkken otobiyografik bilgi kaybı yoktur ve olay polisomnografide N3 evresinde kaydedilmiştir."
                }
            ],
            "teachingPoint": "NREM uyanma bozukluklarında olaylar gecenin ilk üçte birinde olur ve sabah amnezi vardır; REM davranış bozukluğunda ise rüya hatırlanır."
        }
    },
    {
        "id": "case-105",
        "caseNumber": 105,
        "difficulty": "Zor",
        "course": "FORENSIC",
        "diagnosisId": "sexual_masochism",
        "therapyId": "cbt_general",
        "category": "PARAPHILIC",
        "patientSummary": "26 yaşında, erkek, üniversite mezunu",
        "clues": [
            "26 yaşındaki genç, odasında tavana asılı bir kemerle boynunu sıkarak oksijensiz kaldığı ve mastürbasyon yaptığı sırada bayılması üzerine ailesi tarafından son anda kurtarılarak getirildi.",
            "Son 3 yıldır mastürbasyon yaparken boynunu iple sıkıp beynine giden oksijeni kısıtlamadan (hipoksi) ve boğulma tehlikesi hissetmeden orgazm olamadığını itiraf etti.",
            "Bu tehlikeli yöntemi son 1 yıldır haftada 2 kez denediğini, defalarca ölümden döndüğünü ve kendini durduramadığını anlattı.",
            "Toksikoloji taraması negatiftir; intihar etme arzusu KESİNLİKLE yoktur; amaç ölmek değil boğulma anındaki hipoksik cinsel hazdır.",
            "Ruhsal Durum Muayenesinde: İntihar depresyonu olmaksızın, cinsel uyarılmanın tamamen fiziksel acı çekme ve hipoksiye koşullandığı ölümcül bir parafili tablosu gözlendi.",
            "DSM-5'e göre: En az 6 ay süreyle bağlanma veya acı çekmeyle (özellikle asfiksiyofili kısıtlamasıyla) ilgili yineleyen cinsel uyarılma dürtüleri ve bunu eyleme dökme ile seyreden Cinsel Mazoşizm Bozukluğu tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "boynunu iple sıkıp beynine giden oksijeni kısıtlamadan (hipoksi)",
                "dsmMatch": "DSM-5 Belirteç: Asfiksiyofili (Otoerotik asfiksi) ile giden cinsel mazoşizm"
            },
            {
                "clueIndex": 3,
                "text": "intihar etme arzusu KESİNLİKLE yoktur",
                "dsmMatch": "Ayırıcı Tanı: İntihar girişiminden ayrım kriteri"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi & Gizli Şartlandırma",
            "therapyDetails": "Ölümcül asfiksi riskine karşı acil güvenlik planı, gizli duyarsızlaştırma ve cinsel fantezileri yeniden koşullandırma.",
            "pharmacologyNote": "Dürtü yoğunluğunu ve takıntılı kompulsif cinsel eylemleri baskılamak için yüksek doz SSRI veya antiandrojenler."
        },
        "miniQuiz": {
            "question": "Otoerotik Asfiksi (Boğularak cinsel haz alma) uygulayan bir bireyin kazara ölümünü intihardan ayıran en temel adli psikiyatrik kanıt nedir?",
            "options": [
                "Kişinin intihar notu bırakmaması, cinsel uyarılma materyalleri/pornografi varlığı ve kendini kurtarma mekanizması kurmuş olması",
                "Kişinin çok yaşlı olması",
                "Olayın gündüz olması",
                "Hastanın hiç okula gitmemiş olması"
            ],
            "correctIndex": 0,
            "explanation": "Otoerotik asfiksilerde intihar amacı yoktur; kişi cinsel doyum için hipoksi uygular, bir kurtarma düzeneği kurar ancak bayılınca mekanizma kilitlenip kazaen ölür."
        },
        "differentialDiagnosis": "• İntihar Girişimi: Kişi ölmek ister; cinsel uyarılma veya mastürbasyon amacı yoktur.\n• Cinsel Sadizm: Acıyı başkasına çektirir; mazoşizmde ise acıyı ve oksijensizliği bizzat kendisi çeker.",
        "dsmCriteriaSummary": "DSM-5: En az 6 ay bağlanma, dövülme veya oksijensiz bırakılma dürtüleri + Eyleme dökme (Asfiksiyofili).",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Üç yıldır boynunu sıkarak oksijensiz kalmadan orgazm olamaması, boğulma ve acı çekmeye bağlı yoğun cinsel uyarılmadır (asfiksiyofili).",
                "Davranış son bir yıldır haftada iki kez eyleme dökülmektedir; altı ay ölçütü karşılanır.",
                "Defalarca ölümden dönmesi ve kendini durduramaması belirgin sıkıntı ve ciddi tehlikeyi gösterir; intihar niyeti yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "mdd",
                    "reason": "İntihar etme isteği ve depresif duygudurum yoktur; amaç ölmek değil cinsel hazdır. Yine de risk ayrıca değerlendirilmelidir."
                },
                {
                    "diagnosisId": "sexual_sadism",
                    "reason": "Acı ve oksijensizlik bir başkasına değil, kişinin kendisine uygulanmaktadır."
                },
                {
                    "diagnosisId": "fetishistic_disorder",
                    "reason": "Uyarılma cansız bir nesneye ya da beden bölgesine değil, boğulma ve acı çekme deneyimine bağlıdır."
                }
            ],
            "teachingPoint": "Asfiksiyofili, cinsel mazoşizm bozukluğunun belirteci olarak kaydedilir ve kazara ölüm riski taşıdığı için intihar girişiminden dikkatle ayrılmalıdır."
        }
    },
    {
        "id": "case-106",
        "caseNumber": 106,
        "difficulty": "Zor",
        "course": "FORENSIC",
        "diagnosisId": "sexual_sadism",
        "therapyId": "cbt_general",
        "category": "PARAPHILIC",
        "patientSummary": "32 yaşında, erkek, güvenlik görevlisi",
        "clues": [
            "32 yaşındaki danışan, partnerlerini yatağa bağlayıp rızaları olmaksızın derilerini sigarayla yakarak, kemerle döverek ve acı içinde yalvarmalarını izleyerek cinsel doyum sağladığı için polise şikayet sonrası sevk edildi.",
            "Partnerlerinin fiziksel ve psikolojik acı çekmesini, korku dolu çığlıklarını görmeden hiçbir şekilde cinsel uyarılma ve ereksiyon yaşayamadığını açıkça ifade etti.",
            "Son 2 yıldır tüm cinsel ilişkilerinde bu şiddet eylemlerini giderek artan dozda uyguladığı ve partnerlerinde ciddi doku yaralanmalarına yol açtığı belirlendi.",
            "Madde intoksikasyonu veya organik nörolojik lezyon saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Mağdurun acı çekmesinden doğrudan erotik haz alma, sıfır empati ve dürtüsel sadistik fantezilerin eyleme dökülmesi gözlendi.",
            "DSM-5'e göre: En az 6 aylık süre boyunca başka bir kişinin fiziksel ya da ruhsal acı çekmesinden yineleyen yoğun cinsel uyarılma duyma ve bu dürtüleri onay vermeyen bir kişi üzerinde eyleme dökmüş olma (Cinsel Sadizm Bozukluğu) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "rızaları olmaksızın derilerini sigarayla yakarak, kemerle döverek ve acı içinde yalvarmalarını izleyerek",
                "dsmMatch": "DSM-5 Kriter A & B: Başkasına acı çektirmekten cinsel haz alma ve rızasız eyleme dökme"
            },
            {
                "clueIndex": 2,
                "text": "Son 2 yıldır",
                "dsmMatch": "DSM-5 Süre Eşiği: En az 6 aylık süre kriteri"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Adli Terapi & Nüks Önleme",
            "therapyDetails": "Mağdur odaklı empati eğitimi, suç döngüsünü kırma, gizli şartlandırma ve adli denetim takibi.",
            "pharmacologyNote": "Ağır ve kontrolsüz şiddet riski taşıyan vakalarda antiandrojen hormon tedavisi (GnRH agonistleri) ve SSRI."
        },
        "miniQuiz": {
            "question": "DSM-5'e göre rızaya dayalı BDSM pratikleri ile 'Cinsel Sadizm Bozukluğu' arasındaki en kritik adli ve tanısal ayrım nedir?",
            "options": [
                "Cinsel Sadizm Bozukluğunda eylemlerin onay vermeyen (rızasız) kişilere karşı uygulanması veya kişide kontrolsüz klinik/adli zarar yaratması",
                "Cinsel sadizmin sadece kadınlarda görülmesi",
                "BDSM yapanların hiç evlenmemesi",
                "İki kavramın birebir aynı olması"
            ],
            "correctIndex": 0,
            "explanation": "Parafili bozukluğu tanısı için eylemlerin onay vermeyen (rızasız) kişilere karşı yapılması veya ağır fiziksel hasar/adli zarar doğurması zorunludur."
        },
        "differentialDiagnosis": "• Antisosyal Kişilik Bozukluğu: Şiddet para, intikam veya güç içindir; sadizmde ise temel motivasyon doğrudan cinsel orgazm ve erotik hazdır.\n• Cinsel Mazoşizm: Kişi acıyı başkasına değil kendine çektirir.",
        "dsmCriteriaSummary": "DSM-5: En az 6 ay başkasına fiziksel/ruhsal acı çektirmekten cinsel haz alma + Onay vermeyen kişiye eyleme dökme.",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Partnerlerinin fiziksel ve psikolojik acı çekmesini görmeden cinsel uyarılma yaşayamaması, başkasının acısından yoğun cinsel uyarılma ölçütüdür.",
                "Bu dürtüler rıza vermeyen partnerler üzerinde, yakma ve dövme gibi zarar verici eylemlerle uygulanmıştır.",
                "Örüntü iki yıldır, giderek artan şiddette sürmektedir; madde etkisi ve nörolojik lezyon yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "antisocial_pd",
                    "reason": "Şiddetin motivasyonu para, güç ya da intikam değil doğrudan cinsel uyarılmadır; ancak genel bir hak ihlali örüntüsü varsa iki tanı birlikte bulunabilir."
                },
                {
                    "diagnosisId": "sexual_masochism",
                    "reason": "Acıyı kendisi çekmiyor, başkasına çektiriyor."
                },
                {
                    "diagnosisId": "intermittent_explosive",
                    "reason": "Şiddet ani öfke patlamaları değil, cinsel uyarılmaya yönelik amaçlı ve tekrarlayan davranışlardır."
                }
            ],
            "teachingPoint": "Cinsel sadizm bozukluğunda belirleyici olan, uyarılmanın başkasının acı çekmesine bağlı olmasıdır; rızaya dayalı uygulamalar sıkıntı ya da zarar yoksa tanı ölçütünü karşılamaz."
        }
    },
    {
        "id": "case-107",
        "caseNumber": 107,
        "difficulty": "Zor",
        "course": "FORENSIC",
        "diagnosisId": "other_specified_dissociative",
        "therapyId": "supportive_psychotherapy",
        "category": "DISSOCIATIVE",
        "patientSummary": "38 yaşında, erkek, cezaevinde tutuklu",
        "clues": [
            "Ağırlaştırılmış müebbet hapis istemiyle yargılanan 38 yaşındaki tutuklu, cezaevinde 'Atın kaç ayağı vardır?' sorusuna '3 ayağı vardır', '2 artı 2 kaç eder?' sorusuna '5 eder' şeklinde soruların doğru cevabını tam bilip hemen yanındaki yanlış cevabı (yaklaşık yanıtlar) verdiği için bilirkişiye sevk edildi.",
            "Haftanın hangi günü olduğu sorulduğunda dünün gününü söylemekte, ceketi pantolon gibi bacaklarına giymeye çalışmaktadır.",
            "Nörolojik tarama, EEG ve Beyin MR görüntülemeleri tamamen normal çıkmış; inme veya organik demans dışlanmıştır.",
            "Temarruzdan (malingering) farklı olarak hastada belirgin bir alacakaranlık bilinç durumu, dissosiyatif amnezi ve aşırı stres altında disosiyatif kopma mevcuttur.",
            "Ruhsal Durum Muayenesinde: Ağır hapis stresörüne karşı gelişen disosiyatif mekanizmalar, çocuksu davranışlar ve tipik saçma/yaklaşık yanıtlar (paralogia) tespit edildi.",
            "DSM-5 ve klinik psikiyatriye göre: Aşırı adli stresörler altında ortaya çıkan yaklaşık yanıtlar (vorbeireden), bilinç bulanıklığı ve dissosiyatif semptomlarla seyreden Ganser Sendromu tablosudur; DSM-5-TR'de ayrı bir tanı olmadığından 'Belirlenmiş Diğer Bir Dissosiyatif Bozukluk' olarak kodlanır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "soruların doğru cevabını tam bilip hemen yanındaki yanlış cevabı (yaklaşık yanıtlar)",
                "dsmMatch": "Psikopatoloji: Karakteristik 'Yaklaşık Saçma Yanıtlar' (Vorbeireden / Vorübergehen)"
            },
            {
                "clueIndex": 3,
                "text": "alacakaranlık bilinç durumu, dissosiyatif amnezi",
                "dsmMatch": "DSM-5: Dissosiyatif alacakaranlık durumu ve histerik kaçış"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Destekleyici Psikoterapi & Güvenli Çevre Yönetimi",
            "therapyDetails": "Hastayı yargılamadan dinleme, stresör baskısını hafifletme ve disosiyatif kopmayı güven telkiniyle çözme.",
            "pharmacologyNote": "Gerektiğinde eşlik eden yoğun anksiyete ve ajitasyon için kısa süreli düşük doz anksiyolitik veya antipsikotik."
        },
        "miniQuiz": {
            "question": "Ganser Sendromunda hastanın '2+2=5' veya 'Köpeğin 5 bacağı vardır' gibi basit sorulara verdiği tipik yanıtlara psikiyatride ne ad verilir?",
            "options": [
                "Yaklaşık Yanıtlar (Vorbeireden / Paralogia)",
                "Neolojizm (Yeni kelime uydurma)",
                "Ekolali (Yankılama)",
                "Koprolali (Küfür etme)"
            ],
            "correctIndex": 0,
            "explanation": "Ganser Sendromunun en belirleyici patognomonik belirtisi; hastanın sorulan sorunun mantığını tam anlayıp kasten değil disosiyatif bir savunmayla cevabın hemen yanındaki yanlış cevabı vermesidir (Yaklaşık Yanıtlar)."
        },
        "differentialDiagnosis": "• Temarruz (Malingering): Bilinçli ve kasıtlı bir sahtekarlıktır; alacakaranlık bilinç durumu ve gerçek dissosiasyon yoktur.\n• Şizofreni: Hezeyanlar ve formal düşünce dağınıklığı vardır, yaklaşık yanıtlar görülmez.",
        "dsmCriteriaSummary": "DSM-5: Ağır stresör zemininde yaklaşık yanıtlar (vorbeireden) + Bilinçte alacakaranlık hali + Dissosiyatif belirtiler.",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "‘Atın üç ayağı var’ ya da ‘2 artı 2 beş eder’ gibi doğruya çok yakın yanlış yanıtlar, yaklaşık yanıtlar (Ganser) belirtisidir.",
                "Ağır bir adli stresör altında ortaya çıkması, alacakaranlık bilinç durumu ve dissosiyatif amnezi tabloya eşlik eder.",
                "Ganser sendromu DSM-5-TR'de ayrı bir tanı değildir; tablo hiçbir özgül dissosiyatif bozukluğun ölçütlerini tam karşılamadığı için ‘belirlenmiş diğer’ olarak kodlanır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "major_neurocognitive_another_medical",
                    "reason": "Nörolojik tarama, EEG ve MRG normaldir; yaklaşık yanıtlar bilişsel yıkımla değil dissosiyatif bir süreçle uyumludur."
                },
                {
                    "diagnosisId": "schizophrenia",
                    "reason": "Sanrı, varsanı ya da düşünce dağınıklığı tarif edilmiyor; yaklaşık yanıtlar şizofreniye özgü değildir."
                },
                {
                    "diagnosisId": "factitious_disorder",
                    "reason": "Yapay bozuklukta dış ödül yoktur; burada ağır ceza gibi belirgin bir dış etken vardır. Bilerek üretim kanıtlanırsa tanı temaruz yönüne kayar."
                }
            ],
            "teachingPoint": "Adli bağlamda yaklaşık yanıtlar görüldüğünde temaruz mutlaka değerlendirilmelidir; Ganser tablosunu destekleyen bilinç bulanıklığı ve gerçek dissosiyatif belirtilerdir."
        }
    },
    {
        "id": "case-110",
        "caseNumber": 110,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "delusional_disorder",
        "therapyId": "cbt_psychosis",
        "category": "PSYCHOTIC",
        "patientSummary": "34 yaşında, kadın, arşiv memuru",
        "clues": [
            "34 yaşındaki danışan, ünlü bir televizyon haber spikerinin kendisine sırılsıklam aşık olduğunu ve her akşam ana haber bülteninde kravatının rengini değiştirerek kendisine gizli evlilik teklifi mesajları gönderdiğini iddia ederek stüdyoya girmeye çalışırken güvenlik tarafından durduruldu.",
            "Spikerle hayatında tek bir kez bile yüz yüze görüşmemiş olmasına rağmen, son 8 aydır ona yüzlerce aşk mektubu gönderdiği ve spikerin aldığı uzaklaştırma kararını 'Eşi şüphelenmesin diye beni korumak için yaptığı romantik bir numara' olarak yorumladığı öğrenildi.",
            "Bu erotik sanrı alanı dışında iş hayatında arşiv kayıtlarını düzenli tuttuğu, özbakımının tam olduğu ve sosyal kurallara uygun davrandığı belirlendi.",
            "Beyin MRG ve toksikoloji taraması normaldir; şizofreniye özgü işitsel varsanılar, dezorganize konuşma veya negatif belirtiler saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Düşünce içeriğinde yalnızca yüksek statülü bir kişinin kendisine aşık olduğuna dair sistematize erotomanik sanrılar mevcut; duygulanım sanrı içeriğiyle uyumlu ve bilişsel işlevler korunmuş.",
            "DSM-5'e göre: En az 1 ay süren, genellikle daha yüksek statüdeki bir başkasının kendisine aşık olduğuna dair sarsılmaz sanrıyla karakterize ve genel işlevselliğin görece korunduğu Sanrılı Bozukluk (Erotomanik Tip / Clérambault Sendromu) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "ünlü bir televizyon haber spikerinin kendisine sırılsıklam aşık olduğunu",
                "dsmMatch": "DSM-5 Belirteç: Yüksek statülü birinin kendisine aşık olduğu sanrısı (Erotomani)"
            },
            {
                "clueIndex": 2,
                "text": "iş hayatında arşiv kayıtlarını düzenli tuttuğu, özbakımının tam olduğu",
                "dsmMatch": "DSM-5 Kriter C: Sanrı alanı dışında işlevselliğin belirgin olarak bozulmaması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Psikoz için Bilişsel Davranışçı Terapi (CBTp)",
            "therapyDetails": "Sanrıyla doğrudan çatışmadan kanıtları nazikçe sınama, yasal sınırlar konusunda gerçeklik eğitimi ve sosyal yalnızlığı azaltma.",
            "pharmacologyNote": "İkinci kuşak antipsikotikler (Risperidon, Aripiprazol, Olanzapin) sanrısal yoğunluğu ve dürtüsel takip davranışlarını azaltmada ilk tercihtir."
        },
        "miniQuiz": {
            "question": "Clérambault Sendromu (Erotomanik Sanrılı Bozukluk) vakalarında hastanın karşı taraftan gelen açık reddedilme ve mahkeme uzaklaştırma kararlarını bile 'Beni ne kadar çok sevdiğinin gizli kanıtı' olarak yorumlamasına ne ad verilir?",
            "options": [
                "Paradoksal Kanıtlama / Sanrısal Rasyonalizasyon",
                "Fikir Uçuşması (Flight of Ideas)",
                "Konfabülasyon (Masallama)",
                "Ekolali"
            ],
            "correctIndex": 0,
            "explanation": "Erotomanik hastalar karşı tarafın her türlü reddedişini veya yasal engelini 'Aşkımızı gizlemek ve beni korumak için böyle yapıyor' şeklinde sanrısal sistemlerine entegre ederler."
        },
        "differentialDiagnosis": "• Şizofreni: Bizar sanrılar, varsanılar ve belirgin işlevsellik yıkımı vardır; erotomanide ise sanrı dışında işlevsellik korunur.\n• Bipolar Manik Epizod: Grandiyöz/erotik fikirler sadece manik atak sırasında görülür ve uyku azalması eşlik eder.",
        "dsmCriteriaSummary": "DSM-5: En az 1 ay süren bir başkasının kendisine aşık olduğu sanrısı + Şizofreni A ölçütünün karşılanmaması + Korunmuş genel işlevsellik.",
        "pharmacologyId": "pimozide_delusional",
        "explanation": {
            "whyThis": [
                "Hiç tanışmadığı ünlü bir spikerin kendisine âşık olduğu ve kravat rengiyle mesaj gönderdiği inancı sekiz aydır süren erotomanik bir sanrıdır.",
                "Uzaklaştırma kararını bile aşkın kanıtı olarak yorumlaması inancın karşıt kanıtlarla değişmediğini gösterir.",
                "Sanrı dışında iş düzeni ve özbakım korunmuştur; varsanı, dezorganizasyon ve negatif belirti yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "schizophrenia",
                    "reason": "Şizofreni için ikinci bir aktif faz belirtisi gerekir; burada yalnızca sanrı vardır ve işlevsellik korunmuştur."
                },
                {
                    "diagnosisId": "bipolar_1",
                    "reason": "Erotik içerikli inançlar manide görülebilir, ancak azalmış uyku, taşkın duygudurum ya da epizodik seyir tarif edilmiyor."
                },
                {
                    "diagnosisId": "borderline_pd",
                    "reason": "Yoğun bağlanma ve takip davranışı olsa da gerçek bir ilişki ya da terk edilme korkusu yoktur; inanç sanrısal kesinliktedir."
                }
            ],
            "teachingPoint": "Erotomanik sanrıda kişi genellikle yüksek statülü ve uzak biriyle gizli bir aşk ilişkisi olduğuna inanır; takip ve taciz davranışları adli risk oluşturabilir."
        }
    },
    {
        "id": "case-111",
        "caseNumber": 111,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "delusional_disorder",
        "therapyId": "cbt_psychosis",
        "category": "PSYCHOTIC",
        "patientSummary": "48 yaşında, erkek, mühendis",
        "clues": [
            "48 yaşındaki danışan, 20 yıllık eşinin kendisini apartman görevlisi, kargo kuryesi ve hatta balkondan geçen yabancılarla aldattığına dair sarsılmaz bir inanç nedeniyle eşinin iç çamaşırlarını büyüteçle incelediği ve eve gizli kameralar yerleştirdiği için eşi tarafından kliniğe getirildi.",
            "Son 6 aydır eşinin marketten 3 dakika geç dönmesini, perdenin 2 santim kaymış olmasını veya sokaktan geçen bir arabanın korna çalmasını 'sevgilisiyle gizli işaretleşmesi' olarak kanıt göstermektedir.",
            "İş yerinde projelerini başarıyla yönetmeye devam etmekte, arkadaşlarıyla normal sohbet edebilmekte ancak konu eşine geldiğinde yoğun bir şüphe ve öfke sergilemektedir.",
            "Alkol kullanım öyküsü, kranial patoloji veya demans bulgusu yoktur; işitsel/görsel halüsinasyon saptanmamıştır.",
            "Ruhsal Durum Muayenesinde: Düşünce içeriğinde yalnızca eşinin sadakatsizliğine odaklanmış sistematize kıskançlık sanrıları (Othello sendromu) mevcut; içgörü tam olarak kapalı.",
            "DSM-5'e göre: En az 1 aydır hiçbir nesnel kanıt olmaksızın eşinin veya cinsel partnerinin sadakatsiz olduğuna dair sabit sanrılarla seyreden Sanrılı Bozukluk (Kıskançlık Tipi / Othello Sendromu) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "eşinin iç çamaşırlarını büyüteçle incelediği ve eve gizli kameralar yerleştirdiği",
                "dsmMatch": "DSM-5 Belirteç: Sadakatsizlik sanrısına bağlı kanıt toplama davranışları"
            },
            {
                "clueIndex": 1,
                "text": "sokaktan geçen bir arabanın korna çalmasını 'sevgilisiyle gizli işaretleşmesi' olarak kanıt göstermektedir",
                "dsmMatch": "DSM-5 Kriter A: Küçük rastlantısal ipuçlarına dayalı kıskançlık sanrısı (Othello)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Psikoz Terapisi (CBTp) & Eş Güvenlik Planı",
            "therapyDetails": "Eşe yönelik fiziksel şiddet (homisid) riskinin titizlikle değerlendirilmesi, kontrol davranışlarının azaltılması ve şüphe döngüsünün esnetilmesi.",
            "pharmacologyNote": "Atipik antipsikotikler (Risperidon, Olanzapin) temel tedavidir; şiddet riski yüksekse yatarak tedavi planlanır."
        },
        "miniQuiz": {
            "question": "Adli psikiyatride Othello Sendromu (Kıskançlık Tipi Sanrılı Bozukluk) neden en tehlikeli klinik tablolardan biri olarak kabul edilir?",
            "options": [
                "Eşe yönelik ağır fiziksel şiddet ve eş cinayeti (homisid) riskinin çok yüksek olması nedeniyle",
                "Hastanın kısa sürede kör olmasına yol açtığı için",
                "Sadece bulaşıcı enfeksiyonlarla ortaya çıktığı için",
                "Hastanın tüm parasını kumarda kaybetmesine yol açtığı için"
            ],
            "correctIndex": 0,
            "explanation": "Othello sendromunda hasta sadakatsizlik sanrısına yüzde yüz inandığı için intikam veya namus dürtüsüyle eşine yönelik ölümcül şiddet uygulama riski çok yüksektir."
        },
        "differentialDiagnosis": "• Obsesif Kıskançlık / İlişki OKB: Kişi şüphenin abartılı olduğunu bilir (egodistonik); Othello sendromunda ise hasta aldatıldığından %100 emindir (sanrısaldır).\n• Paranoid Kişilik Bozukluğu: Genel bir güvensizlik vardır ancak spesifik ve sarsılmaz bir sanrı sistemi bulunmaz.",
        "dsmCriteriaSummary": "DSM-5: En az 1 ay süren eşinin/sevgilisinin sadakatsiz olduğu sanrısı + Halüsinasyon ve dezorganizasyon yokluğu.",
        "pharmacologyId": "pimozide_delusional",
        "explanation": {
            "whyThis": [
                "Eşinin birçok kişiyle aldattığına dair altı aydır süren, hiçbir nesnel kanıta dayanmayan sarsılmaz inanç kıskançlık tipi sanrıdır.",
                "Perdenin kayması ya da bir korna sesi gibi önemsiz ayrıntıları kanıt sayması sanrısal yorumlamayı gösterir.",
                "İş ve arkadaş ilişkileri korunmuştur; alkol, beyin hastalığı ve varsanı dışlanmıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "ocd",
                    "reason": "Kişi şüphesinin abartılı olduğunu bilmiyor, aldatıldığından kesin olarak emin; inanç kişiye yabancı bir obsesyon değil, benimsenmiş bir sanrıdır."
                },
                {
                    "diagnosisId": "paranoid_pd",
                    "reason": "Genel bir kuşkuculuk değil, tek bir konuda sistemleşmiş ve sarsılmaz bir sanrı vardır."
                },
                {
                    "diagnosisId": "alcohol_use_disorder",
                    "reason": "Alkol kullanım öyküsü yoktur; alkole bağlı patolojik kıskançlık bu nedenle olası değildir."
                }
            ],
            "teachingPoint": "Kıskançlıkta OKB ile sanrıyı içgörü ayırır: OKB'de kişi şüphenin aşırı olduğunu bilir ve sıkıntı duyar, sanrıda ise kesin olarak emindir."
        }
    },
    {
        "id": "case-112",
        "caseNumber": 112,
        "difficulty": "Zor",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "delusional_disorder",
        "therapyId": "cbt_psychosis",
        "category": "PSYCHOTIC",
        "patientSummary": "56 yaşında, kadın, emekli öğretmen",
        "clues": [
            "56 yaşındaki danışan, son 5 aydır derisinin altında binlerce mikroskobik böcek ve parazitin gezindiğini, kendisini içeriden ısırarak çoğaldıklarını iddia ederek 7 farklı dermatoloji uzmanına başvurduktan sonra psikiyatriye yönlendirildi.",
            "Muayeneye gelirken yanında getirdiği küçük bir kibrit kutusunun ve peçetenin içindeki deri kabuklarını, tüy ve toz parçalarını doktorun masasına koyarak 'İşte çıkardığım böceklerin kanıtı, mikroskopla bakın!' dedi (Kibrit Kutusu Belirtisi / Matchbox Sign).",
            "Böcekleri öldürmek için her gün cildini çamaşır suyu ve sert liflerle kazıdığı için kollarında ve bacaklarında derin ekskoriasyon yaraları oluştuğu görüldü.",
            "Dermatolojik biyopsi, mikroskobik inceleme, karaciğer/böbrek fonksiyonları, B12 düzeyi ve kokain/metamfetamin toksikoloji taraması tamamen negatif çıkmıştır.",
            "Ruhsal Durum Muayenesinde: Taktil (dokunsal) karıncalanma hissine eşlik eden sarsılmaz delüzyonel parazitoz (Ekbom sendromu) sanrısı; psikiyatrik tedaviyi reddetme ve sarsılmaz somatik hezeyan.",
            "DSM-5'e göre: En az 1 ay boyunca bedensel işlevler veya duyumlarla ilgili (deri altında parazit olması, kötü koku yayma vb.) sabit sanrılarla seyreden Sanrılı Bozukluk (Somatik Tip / Ekbom Sendromu) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "derisinin altında binlerce mikroskobik böcek ve parazitin gezindiğini",
                "dsmMatch": "DSM-5 Belirteç: Delüzyonel parazitoz / Ekbom Sendromu (Somatik sanrı)"
            },
            {
                "clueIndex": 1,
                "text": "Kibrit Kutusu Belirtisi / Matchbox Sign",
                "dsmMatch": "Patognomonik Bulgular: Deri döküntülerini kutuda parazit kanıtı olarak getirme"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Psikoz Terapisi (CBTp) & Dermatoloji-Psikiyatri İşbirliği",
            "therapyDetails": "Cilt yaralarının bakımı, kaşıma-kazıma döngüsünün durdurulması ve cildi tahriş eden kimyasalların uzaklaştırılması.",
            "pharmacologyNote": "İkinci kuşak antipsikotikler (Risperidon, Olanzapin) veya klasik olarak Pimozid somatik sanrılarda oldukça etkilidir."
        },
        "miniQuiz": {
            "question": "Ekbom Sendromu (Delüzyonel Parazitoz) hastalarının deri kabuklarını ve toz parçalarını bir kutu veya poşet içinde hekime 'böcek kanıtı' olarak getirmelerine literatürde ne ad verilir?",
            "options": [
                "Kibrit Kutusu Belirtisi (Matchbox Sign / Spesimen Belirtisi)",
                "Russell Belirtisi",
                "Hoover Belirtisi",
                "Babinski Belirtisi"
            ],
            "correctIndex": 0,
            "explanation": "Delüzyonel parazitoz hastalarının karakteristik olarak deri kırıntılarını kibrit kutusu veya peçetede hekime kanıt diye getirmesi 'Matchbox Sign' (Kibrit Kutusu Belirtisi) olarak bilinir."
        },
        "differentialDiagnosis": "• Kokain / Metamfetamin İntoksikasyonu (Formikasyon): Uyarıcı madde kullanıcılarında deri altında böcek yürümesi hissi olur; toksikoloji ile dışlanır.\n• Hastalık Kaygısı Bozukluğu: Hasta böcek olabileceğinden endişelenir ama negatif testlerle ikna olabilir; somatik sanrıda ise ikna imkansızdır.",
        "dsmCriteriaSummary": "DSM-5: En az 1 ay süren deri altında parazit, bedenden kötü koku yayılması veya organ bozukluğu şeklindeki somatik sanrı.",
        "pharmacologyId": "pimozide_delusional",
        "explanation": {
            "whyThis": [
                "Derisinin altında parazitlerin dolaştığına dair beş aydır süren ve negatif biyopsiye rağmen sarsılmayan inanç bedensel tip bir sanrıdır.",
                "Kibrit kutusunda deri parçaları getirmesi bu tablonun tipik işaretidir; karıncalanma hissi sanrının temasıyla uyumludur.",
                "Uyarıcı madde, karaciğer-böbrek hastalığı ve B12 eksikliği dışlanmıştır; sanrı dışında belirgin bir psikotik tablo tarif edilmiyor."
            ],
            "whyNot": [
                {
                    "diagnosisId": "illness_anxiety_disorder",
                    "reason": "Kişi hastalık olasılığından endişelenmiyor, parazit olduğundan kesin olarak emin ve hiçbir kanıtla ikna olmuyor."
                },
                {
                    "diagnosisId": "excoriation",
                    "reason": "Deriyi kazıma bir gerilimi boşaltmak için değil, sanrıdaki böcekleri çıkarmak için yapılıyor; yaralar sanrının sonucudur."
                },
                {
                    "diagnosisId": "substance_induced_psychotic",
                    "reason": "Kokain ve metamfetamin dahil toksikoloji negatiftir."
                }
            ],
            "teachingPoint": "Parazit sanrısında önce uyarıcı kullanımı, ilaçlar ve tıbbi nedenler dışlanmalıdır; dışlanınca tablo bedensel tip sanrılı bozukluk olarak değerlendirilir."
        }
    },
    {
        "id": "case-113",
        "caseNumber": 113,
        "difficulty": "Zor",
        "course": "ADULT",
        "diagnosisId": "other_specified_schizophrenia_spectrum",
        "therapyId": "cbt_psychosis",
        "category": "PSYCHOTIC",
        "patientSummary": "29 yaşında, kadın",
        "clues": [
            "29 yaşındaki danışan, 5 yıldır aynı evde dış dünyadan tamamen izole yaşadığı şizofreni hastası ablasıyla birlikte 'komşuların prizlerden evin içine görünmez radyasyon gazı pompaladığını' iddia ederek evin tüm duvarlarını alüminyum folyoyla kapladıkları için sosyal hizmetler tarafından getirildi.",
            "Öyküde ilk olarak baskın karakterli ablasının (primer/indükleyen vaka) 2 yıl önce bu radyasyon sanrısını geliştirdiği, ablasına aşırı bağımlı ve pasif yapıda olan danışanın ise (sekonder/alıcı vaka) zamanla ablasının bu sanrısını birebir benimsediği saptandı.",
            "İki kardeşin televizyon, telefon ve internet kullanmayı bıraktıkları, market alışverişlerini bile gaz maskesiyle yaptıkları ve kimseyle görüşmedikleri öğrenildi.",
            "Danışanın kranial MR ve kan tetkikleri normaldir; ablasından farklı olarak kendisinde işitsel varsanı veya formal düşünce bozukluğu bulunmamaktadır.",
            "Ruhsal Durum Muayenesinde: Hastanede ablasından ayrı bir servise yatırıldıktan ve 3 hafta boyunca ablasıyla görüşmesi engellendikten sonra, danışanın radyasyon sanrısının hızla zayıfladığı ve gerçeklik algısının geri döndüğü gözlendi.",
            "DSM-5-TR'ye göre: Yerleşik sanrısı olan baskın bir kişiyle yakın ve izole bir ilişki içinde bulunan ikinci bir kişide aynı sanrının gelişmesi tablosudur. Eskiden 'Paylaşılmış Psikotik Bozukluk (Folie à Deux)' adıyla ayrı tanıydı; DSM-5'ten bu yana 'Belirlenmiş Diğer Bir Şizofreni Açılımı ve Diğer Psikotik Bozukluk' (sanrılı bir bireyle yakın ilişkideki kişide sanrısal belirtiler) olarak kodlanır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "ablasına aşırı bağımlı ve pasif yapıda olan danışanın ise (sekonder/alıcı vaka) zamanla ablasının bu sanrısını birebir benimsediği",
                "dsmMatch": "DSM-5-TR (belirlenmiş diğer psikotik bozukluk örneği): Baskın psikotik bireyden pasif bireye sanrı aktarımı (Folie à Deux)"
            },
            {
                "clueIndex": 4,
                "text": "danışanın radyasyon sanrısının hızla zayıfladığı ve gerçeklik algısının geri döndüğü",
                "dsmMatch": "Klinik Özellik: İndükleyen kişiden ayrıldığında sanrının sönmesi"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Terapötik Ayrıştırma, CBTp & Aile Sistemleri Müdahalesi",
            "therapyDetails": "En kritik ilk adım sekonder hastayı baskın (primer) hastadan fiziksel ve duygusal olarak ayırmak, bağımsız kimlik becerilerini güçlendirmek ve sosyal izolasyonu kırmaktır.",
            "pharmacologyNote": "Primer vakaya tam doz antipsikotik başlanır; sekonder vakada ayrıştırma sonrası sanrı gerilemezse düşük doz atipik antipsikotik eklenir."
        },
        "miniQuiz": {
            "question": "Paylaşılmış Psikotik Bozukluk (Folie à Deux) tedavisinde sekonder (alıcı) hastada sanrıyı ortadan kaldıran en temel ve ilk basamak müdahale nedir?",
            "options": [
                "Sekonder hastayı sanrıyı indükleyen baskın (primer) kişiden fiziksel olarak ayırmak ve sosyal izolasyonu sonlandırmak",
                "Her iki hastayı aynı odada tutup tartışmalarını sağlamak",
                "Hemen elektroşok (EKT) uygulamak",
                "Sadece vitamin takviyesi vermek"
            ],
            "correctIndex": 0,
            "explanation": "Folie à Deux'da alıcı (sekonder) kişi baskın psikotik bireyden ayrıldığında ve dış gerçeklikle temas ettiğinde sanrılar çoğu zaman kendiliğinden veya düşük doz destekle hızla çözülür."
        },
        "differentialDiagnosis": "• Bağımsız Şizofreni: Kişi baskın vakadan ayrılsa bile psikotik semptomları ve halüsinasyonları hız kesmeden devam eder.\n• Bağımlı Kişilik Bozukluğu: Boyun eğicilik vardır ancak psikotik düzeyde sanrı paylaşımı görülmez.",
        "dsmCriteriaSummary": "DSM-5-TR (belirlenmiş diğer psikotik bozukluk örneği): Psikotik baskın bir kişiyle yakın ilişki sonucu aynı sanrı sisteminin sağlıklı/bağımlı bireye geçmesi.",
        "pharmacologyId": "atypical_ap_secondgen",
        "explanation": {
            "whyThis": [
                "Kişi, kendisi sanrısı olan ve baskın konumdaki ablasıyla izole ve yakın bir ilişki içinde aynı radyasyon sanrısını benimsemiştir.",
                "Sanrı önce ablada ortaya çıkmış, pasif ve bağımlı konumdaki danışan onu sonradan almıştır; danışanda varsanı ya da düşünce bozukluğu yoktur.",
                "Ablasından ayrıldıktan sonra üç hafta içinde sanrının hızla zayıflaması tabloyu destekler; DSM-5-TR bunu ‘belirlenmiş diğer psikotik bozukluk’ olarak kodlar."
            ],
            "whyNot": [
                {
                    "diagnosisId": "schizophrenia",
                    "reason": "Varsanı, dezorganizasyon ya da negatif belirti yoktur ve sanrı baskın kişiden ayrılınca hızla gerilemiştir."
                },
                {
                    "diagnosisId": "delusional_disorder",
                    "reason": "Sanrı kişinin kendi süreci olarak değil, sanrılı bir yakının etkisiyle ortaya çıkmış ve ayrılınca kaybolmuştur; sürmeye devam etseydi sanrılı bozukluk düşünülürdü."
                },
                {
                    "diagnosisId": "dependent_pd",
                    "reason": "Bağımlı kişilik yapısı zemini oluşturabilir, ancak bu tanı psikotik düzeyde bir sanrıyı açıklamaz."
                }
            ],
            "teachingPoint": "Paylaşılmış sanrıda en önemli tanısal ve tedavi adımı, ikincil kişiyi baskın kişiden ayırmak ve sanrının gerileyip gerilemediğini izlemektir."
        }
    },
    {
        "id": "case-114",
        "caseNumber": 114,
        "difficulty": "İleri Düzey",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "catatonia_associated",
        "therapyId": "ect_biological",
        "category": "PSYCHOTIC",
        "patientSummary": "24 yaşında, erkek",
        "clues": [
            "24 yaşındaki hasta, son 3 gündür odasının ortasında tek ayağı havada ve kolları yukarıda sanki donmuş bir heykel gibi saatlerce hiç kıpırdamadan durduğu, tek kelime bile konuşmadığı (mutizm) ve su dahi içmediği için ambulansla acile getirildi.",
            "Muayene sırasında hekim hastanın kolunu kaldırıp garip bir açıda bıraktığında, hasta kolunu indirmeden saatlerce o yeni pozisyonda tutmaya devam etti (Balmumu Esnekliği / Cerea Flexibilitas ve Katalepsi).",
            "Hastanın ağızdan beslenmeyi ve komutları tamamen reddettiği (negativizm), zaman zaman doktorun söylediği kelimeleri papağan gibi tekrarladığı (ekolali) ve hareketlerini kopyaladığı (ekopraksi) görüldü.",
            "Beyin MRG, BOS incelemesi ve anti-NMDA reseptör otoimmün ensefalit paneli normaldir; antipsikotik ilaç kullanımı yoktur, altta yatan ağır bipolar/şizofrenik süreç mevcuttur.",
            "Ruhsal Durum ve Nörolojik Muayenede: Damar yolundan uygulanan 2 mg IV Lorazepam (Benzodiazepin) testi sonrasında hastanın 15 dakika içinde kaslarının çözüldüğü, konuşmaya başladığı ve su içtiği doğrulandı (Pozitif Lorazepam Yanıtı).",
            "DSM-5'e göre: Stupor, katalepsi, balmumu esnekliği, mutizm, negativizm, postür alma, ekolali ve ekopraksi belirtilerinden en az 3'ünün bulunduğu Başka Bir Ruhsal Bozuklukla İlişkili Katatoni tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "Balmumu Esnekliği / Cerea Flexibilitas ve Katalepsi",
                "dsmMatch": "DSM-5 Kriter A2-A3: Katalepsi ve Balmumu Esnekliği"
            },
            {
                "clueIndex": 4,
                "text": "2 mg IV Lorazepam (Benzodiazepin) testi sonrasında hastanın 15 dakika içinde kaslarının çözüldüğü",
                "dsmMatch": "Klinik Tanı ve Tedavi: Karakteristik Lorazepam (GABA-A) yanıtı"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "IV Lorazepam Protokolü & Elektrokonvülsif Terapi (EKT)",
            "therapyDetails": "Dehidratasyon ve derin ven trombozu profilaksisi, yüksek doz Lorazepam (GABA-A agonisti) ve yanıt alınamayan/malign vakalarda acil bilateral EKT.",
            "pharmacologyNote": "İlk tercih Benzodiazepin (Lorazepam) ve EKT'dir; yüksek potensli tipik antipsikotikler (Haloperidol) katatoniyi Nöroleptik Malign Sendroma çevirebileceği için KONTRENDİKEDİR!"
        },
        "miniQuiz": {
            "question": "Akut Katatoni tablosunda (stupor, mutizm, balmumu esnekliği) tanı koymak ve semptomları dakikalar içinde çözmek için uygulanan ilk sıra ilaç testi ve kesin tedavi ikilisi hangisidir?",
            "options": [
                "Lorazepam (Benzodiazepin) Challenge Testi ve Elektrokonvülsif Terapi (EKT)",
                "Yüksek doz Haloperidol enjeksiyonu",
                "Sadece Bilişsel Davranışçı Terapi",
                "Metilfenidat (Uyarıcı) tedavisi"
            ],
            "correctIndex": 0,
            "explanation": "Katatonide GABA-A hipofonksiyonu vardır; IV Lorazepam hastayı dakikalar içinde açar. Dirençli veya malign katatonide ise EKT %85-90 başarıyla hayat kurtarıcı altın standarttır."
        },
        "differentialDiagnosis": "• Nöroleptik Malign Sendrom (NMS): Antipsikotik sonrası gelişir, 40°C ateş ve kurşun boru rijiditesi vardır.\n• Akinetik Mutizm / Locked-in Sendromu: Beyin sapı/frontal inme lezyonlarında görülür, MR ile ayrılır.",
        "dsmCriteriaSummary": "DSM-5 (En az 3/12): Stupor, katalepsi, balmumu esnekliği, mutizm, negativizm, postür alma, manyerizm, stereotipi, ajitasyon, grimas, ekolali, ekopraksi.",
        "pharmacologyId": "lorazepam_catatonia",
        "explanation": {
            "whyThis": [
                "Saatlerce heykel gibi donup kalma (stupor/postür alma), konuşmama (mutizm) ve verilen pozisyonu koruma (balmumu esnekliği, katalepsi) katatoni belirtileridir.",
                "Beslenme ve komutları reddetme (negativizm), ekolali ve ekopraksi ile belirti sayısı gerekli üç belirti eşiğini rahatça aşar.",
                "Altta bir ruhsal bozukluk süreci vardır, ensefalit ve ilaç nedeni dışlanmıştır; lorazepam testine hızlı yanıt tanıyı destekler."
            ],
            "whyNot": [
                {
                    "diagnosisId": "catatonia_medical",
                    "reason": "MRG, BOS ve anti-NMDA paneli normaldir; tabloyu açıklayan tıbbi bir durum bulunmamıştır."
                },
                {
                    "diagnosisId": "conversion_disorder",
                    "reason": "Balmumu esnekliği, ekolali-ekopraksi ve lorazepama hızlı yanıt işlevsel bir motor belirtiden çok katatoni sendromunu gösterir."
                },
                {
                    "diagnosisId": "mdd",
                    "reason": "Hareketsizlik ağır depresyonda da görülebilir, ancak burada tablo özgül katatoni belirtileriyle tanımlanır; altta yatan bozukluk ayrıca adlandırılmalıdır."
                }
            ],
            "teachingPoint": "Katatoni bağımsız bir sendromdur ve altta yatan bozukluk (duygudurum, psikotik ya da tıbbi) ayrıca belirtilir; benzodiazepin testine yanıt tanıyı güçlendirir."
        }
    },
    {
        "id": "case-115",
        "caseNumber": 115,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "bipolar_2",
        "therapyId": "ipsrt",
        "category": "BIPOLAR",
        "patientSummary": "27 yaşında, kadın, grafik tasarımcı",
        "clues": [
            "27 yaşındaki danışan, son 1 aydır yataktan çıkamadığı, işlerini teslim edemediği, günde 14 saat uyumasına rağmen bitkin olduğu ve yoğun değersizlik düşünceleri yaşadığı ağır bir depresyon tablosuyla başvurdu.",
            "Ayrıntılı öykü alındığında, bu çöküşten 2 ay önce yaklaşık 6 gün süren ve arkadaşlarının da fark ettiği çok farklı bir dönem yaşadığı; o günlerde sadece 4 saat uykuyla zımba gibi uyandığı, her zamankinden çok daha neşeli, konuşkan ve üretken olduğu öğrenildi.",
            "Bu 6 günlük enerjik dönemde (hipomani) 3 tasarım projesini tek başına bitirdiği, aşırı sosyalleştiği ancak işlevselliğinin bozulmadığı, psikotik bir sanrı yaşamadığı ve hastaneye yatış gerekmediği belirlendi.",
            "Tiroid fonksiyon testleri ve madde taraması normaldir; hastanın yaşamı boyunca hiçbir zaman tam bir Manik Epizod geçirmediği doğrulandı.",
            "Ruhsal Durum Muayenesinde: Şu anki muayenede çökkün duygulanım, anhedoni ve psikomotor yavaşlama mevcut; geçmiş öyküde net 6 günlük Hipomanik Epizod saptandı.",
            "DSM-5'e göre: En az bir Majör Depresif Epizod ve en az bir Hipomanik Epizod (en az 4 gün süren) öyküsü bulunan, hiçbir zaman tam Manik Epizod geçirmemiş Bipolar II Bozukluğu tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "sadece 4 saat uykuyla zımba gibi uyandığı, her zamankinden çok daha neşeli, konuşkan ve üretken olduğu",
                "dsmMatch": "DSM-5 Kriter A: En az 4 gün süren Hipomanik Epizod"
            },
            {
                "clueIndex": 2,
                "text": "işlevselliğinin bozulmadığı, psikotik bir sanrı yaşamadığı ve hastaneye yatış gerekmediği",
                "dsmMatch": "DSM-5 Hipomani Ölçütü: Mani'den farklı olarak ağır yıkım veya psikoz olmaması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Kişilerarası ve Sosyal Ritim Terapisi (IPSRT)",
            "therapyDetails": "Uyku-uyanıklık saatlerini sabitleme, hipomanik kaymaları erken fark etme ve depresif dönemlerde sirkadiyen ritmi koruma.",
            "pharmacologyNote": "Ketiapin, Lamotrijin (özellikle bipolar depresyon profilaksisinde) veya Lityum kullanılır; tek başına (monoterapi) antidepresan verilmesi kaymayı (switch) tetikleyebilir."
        },
        "miniQuiz": {
            "question": "DSM-5'e göre 'Hipomanik Epizod' ile 'Manik Epizod' arasındaki en belirleyici klinik farklar nelerdir?",
            "options": [
                "Hipomani en az 4 gün sürer, hastaneye yatış gerektirmez ve ASLA psikotik belirti içermez; Mani ise en az 1 hafta sürer, ağır yıkım/yatış veya psikoz içerir.",
                "Hipomanide hasta sürekli ağlar, manide ise güler.",
                "Hipomani sadece 60 yaş üstünde görülür.",
                "Manide uyku artar, hipomanide uyku azalır."
            ],
            "correctIndex": 0,
            "explanation": "Hipomani en az 4 ardışık gün sürer, işlevsellikte ağır yıkıma/yatışa yol açmaz ve psikotik belirti içermez (eğer psikoz veya yatış varsa süreye bakılmaksızın tanı Bipolar I / Mani olur)."
        },
        "differentialDiagnosis": "• Bipolar I Bozukluğu: En az 1 hafta süren veya yatış/psikoz gerektiren tam Manik Epizod vardır.\n• Ünipolar Majör Depresyon: Hastalar genellikle hipomaniyi 'normal mutlu halim' sanıp anlatmazlar; sorgulanmazsa yanlışlıkla ünipolar depresyon tanısı alırlar.",
        "dsmCriteriaSummary": "DSM-5: En az 1 Hipomanik Epizod (≥4 gün) + En az 1 Majör Depresif Epizod (≥2 hafta) + Hiçbir zaman Manik Epizod olmaması.",
        "pharmacologyId": "lamotrigine_bipolar2",
        "explanation": {
            "whyThis": [
                "Bir aydır yataktan çıkamama, aşırı uyku, bitkinlik, değersizlik ve anhedoni şu anki majör depresif epizodu gösterir.",
                "İki ay önce altı gün süren, arkadaşlarca fark edilen az uyku, neşe, konuşkanlık ve üretkenlik dönemi en az dört gün süren hipomanik epizoddur.",
                "O dönemde işlevsellik bozulmamış, psikoz ve yatış olmamıştır; yaşam boyu hiç tam manik epizod geçirilmemiştir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "mdd",
                    "reason": "Geçmişte ölçütleri karşılayan bir hipomanik epizod vardır; bu bulgu tek kutuplu depresyon tanısını dışlar."
                },
                {
                    "diagnosisId": "bipolar_1",
                    "reason": "Yükselme dönemi işlevi bozmamış, yatış ya da psikoz gerektirmemiştir; yani mani değil hipomanidir."
                },
                {
                    "diagnosisId": "cyclothymia",
                    "reason": "Siklotimide hiçbir dönem tam epizod düzeyine ulaşmaz; burada hem tam hipomanik hem tam majör depresif epizod vardır."
                }
            ],
            "teachingPoint": "Depresyonla başvuran her hastada geçmiş hipomani sorgulanmalıdır; hastalar bu dönemleri çoğu zaman sorun olarak görmez ve kendiliğinden anlatmaz."
        }
    },
    {
        "id": "case-116",
        "caseNumber": 116,
        "difficulty": "Zor",
        "course": "ADULT",
        "diagnosisId": "bipolar_1",
        "therapyId": "ipsrt",
        "category": "BIPOLAR",
        "patientSummary": "35 yaşında, kadın",
        "clues": [
            "35 yaşındaki danışan, son 12 ay içinde birbirinden bağımsız 3 ağır depresif atak ve 2 tam manik atak (toplam 5 duygudurum epizodu) geçirdiği için tedaviye dirençli duygudurum kliniğine sevk edildi.",
            "Ocak ve Mayıs aylarında haftalarca süren, 1 saat uykuyla durduğu, kendisini 'dünya ekonomisini yönetecek deha' ilan edip tüm birikimini dağıttığı manik ataklar nedeniyle iki kez servise yatırıldığı öğrenildi.",
            "Mart, Ağustos ve Kasım aylarında ise haftalarca yataktan çıkamadığı, intihar düşünceleriyle boğuştuğu ağır majör depresif dönemler yaşadığı; ataklar arasında ya kısa süreli düzelmeler olduğu ya da doğrudan karşı kutba (depresyondan maniye) geçiş yaptığı saptandı.",
            "Tetkiklerde daha önce reçete edilen yüksek doz Venlafaksin (SNRI) kullanımının ve gizli subklinik hipotiroidinin bu hızlı döngülülüğü tetiklediği tespit edildi.",
            "Ruhsal Durum Muayenesinde: Duygudurum grafik çizelgesinde (Life Chart) 1 yıl içinde DSM-5 süre kriterlerini tam karşılayan 4'ten fazla ayrı manik ve depresif epizod doğrulandı.",
            "DSM-5'e göre: Son 12 aylık süre içinde mani, hipomani ya da majör depresyon ölçütlerini karşılayan en az 4 ayrı duygudurum döneminin bulunmasıyla tanımlanan Bipolar I Bozukluğu (hızlı döngülü belirleyicisiyle) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "son 12 ay içinde birbirinden bağımsız 3 ağır depresif atak ve 2 tam manik atak (toplam 5 duygudurum epizodu)",
                "dsmMatch": "DSM-5 Hızlı Döngülü Belirteci: 12 ayda en az 4 duygudurum atağı"
            },
            {
                "clueIndex": 3,
                "text": "yüksek doz Venlafaksin (SNRI) kullanımının ve gizli subklinik hipotiroidinin",
                "dsmMatch": "Etiyolojik Tetikleyiciler: Antidepresanlar ve hipotiroidi hızlı döngüyü tetikler"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Kişilerarası ve Sosyal Ritim Terapisi (IPSRT) & Yaşam Çizelgesi İzlemi",
            "therapyDetails": "Antidepresanların derhal kesilmesi, tiroid hormon replasmanı, günlük duygudurum-uyku çizelgesi ve katı sirkadiyen hijyen.",
            "pharmacologyNote": "Hızlı döngülü bipolarda Valproat (Valproik Asit), Karbamazepin, Lamotrijin ve Ketiapin Lityuma göre daha üstün yanıt verebilir; tüm antidepresanlar kesilmelidir."
        },
        "miniQuiz": {
            "question": "DSM-5'e göre Bipolar Bozuklukta 'Hızlı Döngülü' (Rapid Cycling) belirtecinin konulabilmesi için 1 yıl (12 ay) içinde en az kaç duygudurum epizodu yaşanmış olmalıdır?",
            "options": [
                "Yılda en az 4 ayrı duygudurum atağı (Mani, Hipomani veya Majör Depresyon)",
                "Günde 4 kez duygudurum değişimi",
                "Yılda en az 20 atak",
                "Hayatı boyunca toplam 2 atak"
            ],
            "correctIndex": 0,
            "explanation": "DSM-5'e göre Hızlı Döngülü (Rapid Cycling) belirteci, son 12 ay içinde en az 4 ayrı duygudurum epizodunun (mani, hipomani veya majör depresyon) yaşanmasıdır."
        },
        "differentialDiagnosis": "• Borderline Kişilik Bozukluğu: Duygudurum saatler içinde terk edilme stresiyle değişir; hızlı döngülü bipolarda ise her bir atak DSM-5 süre kriterlerini (günler/haftalar) tam karşılar.\n• Maddeye Bağlı Duygudurum Bozukluğu: Kokain/amfetamin döngüleriyle karışabilir.",
        "dsmCriteriaSummary": "DSM-5: Bipolar I veya II + Son 12 ayda en az 4 ayrı duygudurum epizodu (arada en az 2 ay remisyon veya karşı kutba tam geçiş).",
        "pharmacologyId": "valproate_acute_mania",
        "explanation": {
            "whyThis": [
                "Haftalarca süren, bir saatlik uyku, büyüklenmecilik ve birikimini dağıtma ile giden ve iki kez yatış gerektiren ataklar tam manik epizodlardır; bir mani bile bipolar I tanısını koydurur.",
                "Haftalarca süren intihar düşünceli ağır depresif dönemler majör depresif epizodlardır.",
                "Son 12 ayda süre ölçütlerini karşılayan beş ayrı epizod vardır; en az dört epizod koşulu ‘hızlı döngülü’ belirtecini karşılar."
            ],
            "whyNot": [
                {
                    "diagnosisId": "borderline_pd",
                    "reason": "Her duygudurum dönemi haftalar sürer ve epizod ölçütlerini tam karşılar; saatlik, kişilerarası tetiklenen dalgalanmalar söz konusu değildir."
                },
                {
                    "diagnosisId": "bipolar_2",
                    "reason": "Yatış gerektiren tam manik epizodlar vardır; bu durumda tanı bipolar II olamaz."
                },
                {
                    "diagnosisId": "substance_induced_bipolar",
                    "reason": "Antidepresan ve hipotiroidi döngüyü hızlandırmış olabilir, ancak manik epizodlar bu etkenlerden bağımsız bir bipolar süreç içinde görünüyor; ilaç kesildikten sonra süren belirtiler birincil tanıyı destekler."
                }
            ],
            "teachingPoint": "Hızlı döngülülük ayrı bir tanı değil, son 12 ayda en az dört epizodu gösteren bir seyir belirtecidir; antidepresan kullanımı ve tiroid işlevi mutlaka gözden geçirilmelidir."
        }
    },
    {
        "id": "case-117",
        "caseNumber": 117,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "mdd",
        "therapyId": "ipt",
        "category": "MOOD",
        "patientSummary": "29 yaşında, kadın, 3 hafta önce doğum yapmış yeni anne",
        "clues": [
            "29 yaşındaki danışan, ilk bebeğini dünyaya getirdikten 10 gün sonra başlayan ve 3 haftadır giderek ağırlaşan durdurulamaz ağlama nöbetleri, derin çökkünlük ve 'Ben çok kötü, yetersiz bir anneyim, bebeğime bakamıyorum' suçluluk düşünceleriyle eşiyle birlikte başvurdu.",
            "Bebek uyuduğunda bile aşırı kaygı ve kederden uyuyamadığını (insomni), iştahının tamamen kesildiğini ve bebeğine karşı hiçbir sevgi ya da bağ hissedemediği için kendisinden nefret ettiğini ifade ediyor.",
            "Doğum sonrası ilk günlerde görülen hafif 'annelik hüznü'nün (baby blues) aksine, belirtilerin 10. günden sonra yatışmayıp tam bir çöküşe dönüştüğü ve annenin özbakımını dahi yapamadığı öğrenildi.",
            "Hastada bebeğin şeytan olduğuna dair psikotik sanrılar veya infatisid (bebeği öldürme) komutu veren varsanılar yoktur; tiroid ve hemoglobin değerleri normaldir.",
            "Ruhsal Durum Muayenesinde: Ağır depresif duygulanım, annelik rolüne ilişkin yoğun suçluluk ve değersizlik fikirleri, anhedoni ve psikomotor retardasyon saptandı (Edinburgh Doğum Sonrası Depresyon Ölçeği: 24/30).",
            "DSM-5'e göre: Gebelik sırasında ya da doğumdan sonraki ilk 4 hafta içinde başlayan majör depresif epizod kriterlerini karşılayan Majör Depresif Bozukluk (peripartum başlangıçlı belirleyicisiyle) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "ilk bebeğini dünyaya getirdikten 10 gün sonra başlayan ve 3 haftadır giderek ağırlaşan durdurulamaz ağlama nöbetleri",
                "dsmMatch": "DSM-5 Belirteç: Doğum sonrası ilk 4 hafta içinde başlayan Peripartum Depresyon"
            },
            {
                "clueIndex": 2,
                "text": "hafif 'annelik hüznü'nün (baby blues) aksine, belirtilerin 10. günden sonra yatışmayıp",
                "dsmMatch": "Ayırıcı Tanı: İlk 2 haftada kendiliğinden geçen Baby Blues'dan ayrımı"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Kişilerarası İlişkiler Terapisi (IPT - Rol Geçişi Odağı)",
            "therapyDetails": "Kadının 'annelik rolüne geçiş' sürecindeki kayıplarını ve beklenti çatışmalarını çalışma, eş ve aile destek ağını organize etme, anne-bebek bağlanmasını destekleme.",
            "pharmacologyNote": "Emzirme döneminde süte en az geçen ve en güvenli SSRI olan Sertralin birinci basamak ilaçtır; ağır vakalarda Breksanolon / Zuranolon (nörosteroid) onaylıdır."
        },
        "miniQuiz": {
            "question": "Doğum sonrası kadınların %70'inde görülen fizyolojik 'Annelik Hüznü' (Baby Blues) ile 'Peripartum (Postpartum) Depresyon' arasındaki en temel klinik fark nedir?",
            "options": [
                "Annelik hüznü hafif seyreder ve en geç 10-14 gün içinde kendiliğinden düzelir; Peripartum Depresyon ise 2 haftadan uzun sürer, işlevselliği çökertir ve tedavi gerektirir.",
                "Annelik hüznünde ağır halüsinasyonlar görülür.",
                "Peripartum depresyon sadece doğumdan 5 yıl sonra başlar.",
                "Annelik hüznü sadece erkeklerde görülür."
            ],
            "correctIndex": 0,
            "explanation": "Baby Blues (Annelik Hüznü) doğumdan sonraki 3-5. günlerde östrojen/progesteron düşüşüyle başlar ve 2 hafta içinde tedavisiz geçer. 2 haftayı aşan, anhedoni ve suçluluk içeren tablo Peripartum Majör Depresyondur."
        },
        "differentialDiagnosis": "• Annelik Hüznü (Baby Blues): İlk 10-14 günde kendiliğinden geçer, işlevselliği bozmaz.\n• Postpartum Psikoz: Doğum sonrası ilk 2 haftada başlar; bebeğin kusurlu/şeytan olduğu sanrıları ve infatisid (bebeğe zarar verme) riski taşıyan psikiyatrik acildir.",
        "dsmCriteriaSummary": "DSM-5: Gebelikte veya doğum sonrası ilk 4 haftada başlayan Majör Depresif Epizod (En az 2 hafta, ≥5 belirti).",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Üç haftadır süren derin çökkünlük, anhedoni, iştah kaybı, uykusuzluk, suçluluk ve psikomotor yavaşlama majör depresif epizod ölçütlerini karşılar.",
                "Belirtiler doğumdan sonraki ilk dört hafta içinde başlamıştır; bu, ‘peripartum başlangıçlı’ belirtecine uyar.",
                "Belirtilerin ilk günlerden sonra yatışmayıp özbakımı bozacak düzeye ulaşması annelik hüznünden farkı gösterir; psikotik özellik yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "adjustment_disorder",
                    "reason": "Doğum bir stresör olsa da belirtiler majör depresif epizod ölçütlerini tam karşılıyor; bu durumda uyum bozukluğu konmaz."
                },
                {
                    "diagnosisId": "brief_psychotic",
                    "reason": "Bebeğe ilişkin sanrı ya da zarar vermeyi emreden varsanılar açıkça yoktur; doğum sonrası başlayan kısa psikotik bozukluk için psikotik belirtiler gerekir."
                },
                {
                    "diagnosisId": "depressive_due_to_medical",
                    "reason": "Tiroid ve hemoglobin normaldir; doğum sonrası tiroidit ve anemi gibi tıbbi nedenler dışlanmıştır."
                }
            ],
            "teachingPoint": "Annelik hüznü ilk iki hafta içinde kendiliğinden geçer ve işlevi bozmaz; belirtiler sürüyor ya da ağırlaşıyorsa peripartum başlangıçlı depresyon düşünülmelidir."
        }
    },
    {
        "id": "case-118",
        "caseNumber": 118,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "mdd",
        "therapyId": "behavioral_activation",
        "category": "MOOD",
        "patientSummary": "26 yaşında, kadın, yüksek lisans öğrencisi",
        "clues": [
            "26 yaşındaki danışan, son 2 aydır devam eden çökkünlük, günde 12-14 saat uyumasına rağmen sabahları uyanamama (hipersomni) ve yoğun karbonhidrat/çikolata aşermesine bağlı 8 kilo alma yakınmalarıyla başvurdu.",
            "Beklenenin aksine, yakın bir arkadaşı sürpriz yapıp onu konsere götürdüğünde veya güzel bir haber aldığında neşesinin birkaç saatliğine tamamen yerine geldiğini (duygudurum tepkiselliği / mood reactivity), ancak yalnız kalınca tekrar çöktüğünü anlattı.",
            "Kollarının ve bacaklarının sanki 'içine tonlarca kurşun dökülmüş gibi ağırlaştığını' ve kolunu kaldıracak gücü bile bulamadığını (kurşun boru / kurşun felci - leaden paralysis) ifade etti.",
            "Ergenliğinden beri insanlardan gelen en ufak bir eleştiriye veya mesajına geç cevap verilmesine aşırı yıkıcı tepkiler verdiği (uzun süreli kişilerarası reddedilme duyarlılığı) öğrenildi.",
            "Ruhsal Durum Muayenesinde: Pozitif olaylarla geçici olarak açılan çökkün duygulanım, vejetatif ters (tersine) belirtiler (aşırı uyku ve aşırı yeme) ve ağır kurşun felci hissi saptandı.",
            "DSM-5'e göre: Duygudurum tepkiselliği (olumlu olaylarla neşelenebilme) ile birlikte kilo alımı/iştah artışı, hipersomni, kurşun felci ve reddedilme duyarlılığı kriterlerini karşılayan Majör Depresif Bozukluk (atipik özellikli belirleyicisiyle) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "güzel bir haber aldığında neşesinin birkaç saatliğine tamamen yerine geldiğini (duygudurum tepkiselliği",
                "dsmMatch": "DSM-5 Kriter A: Duygudurum tepkiselliği (Olumlu olaylarla neşelenebilme)"
            },
            {
                "clueIndex": 2,
                "text": "kurşun felci - leaden paralysis",
                "dsmMatch": "DSM-5 Kriter B3: Kollarda ve bacaklarda kurşun gibi ağırlık hissi (Leaden Paralysis)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Davranışsal Aktivasyon (BA) & Kişilerarası BDT",
            "therapyDetails": "Aşırı uyku ve yatakta kalma süresini kademeli kısıtlama, duygusal yeme/karbonhidrat ataklarını düzenleme ve reddedilme alınganlığını bilişsel olarak yeniden çerçeveleme.",
            "pharmacologyNote": "SSRI/SNRI veya Bupropion (hipersomni ve kilo alımını azaltmak için) tercih edilir; klasik psikofarmakolojide Atipik Depresyon MAO İnhibitörlerine (Moklobemid, Fenelzin) trisikliklerden çok daha iyi yanıt vermesiyle ünlüdür."
        },
        "miniQuiz": {
            "question": "Atipik Özellikli Majör Depresyonu klasik (melankolik) depresyondan ayıran en temel 4 karakteristik belirti kümesi hangisidir?",
            "options": [
                "Duygudurum tepkiselliği (iyi olayla neşelenme), aşırı uyuma (hipersomni), aşırı yeme/kilo alımı ve kollarda-bacaklarda kurşun felci (ağırlık) hissi",
                "Sabah erken uyanma, şiddetli iştahsızlık ve hiçbir şeye sevinememe",
                "Yüksek ateş, kas sertliği ve halüsinasyonlar",
                "Günde sadece 2 saat uyuma ve aşırı para harcama"
            ],
            "correctIndex": 0,
            "explanation": "Atipik depresyonda klasik depresyonun tam tersi vejetatif belirtiler (uyku ve iştah artışı), olumlu olaylarla geçici neşelenebilme (reaktivite), kurşun felci ve reddedilme duyarlılığı görülür."
        },
        "differentialDiagnosis": "• Melankolik Depresyon: Duygudurum tepkiselliği yoktur (hiçbir iyi haber neşelendirmez), sabah erken uyanma ve kilo kaybı vardır.\n• Hipotiroidi: Aşırı uyku ve kilo alımı yapar; TSH testi ile dışlanır.",
        "dsmCriteriaSummary": "DSM-5: Duygudurum tepkiselliği (zorunlu) + En az 2'si: Kilo alımı/iştah artışı, Hipersomni, Kurşun felci, Reddedilme duyarlılığı.",
        "pharmacologyId": "bupropion_ndri",
        "explanation": {
            "whyThis": [
                "İki aydır süren çökkünlük majör depresif epizodun zeminini oluşturur.",
                "Olumlu olaylarla saatlerce neşelenebilme (duygudurum tepkiselliği) atipik özellik belirtecinin zorunlu öğesidir.",
                "Aşırı uyku, karbonhidrat isteğiyle kilo alma, kollarda kurşun gibi ağırlık ve uzun süreli reddedilme duyarlılığı bu belirteç için gereken ek özelliklerdir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "bipolar_2",
                    "reason": "Olumlu olaylara verilen kısa süreli neşelenme hipomani değildir; günlerce süren yükselmiş duygudurum ve azalmış uyku tarif edilmiyor. Atipik depresyonda geçmiş hipomani yine de sorulmalıdır."
                },
                {
                    "diagnosisId": "borderline_pd",
                    "reason": "Reddedilme duyarlılığı ortak olsa da kendine zarar verme, kimlik karmaşası ve dürtüsellik tarif edilmiyor; tablo bir depresif epizod içinde tanımlanıyor."
                },
                {
                    "diagnosisId": "depressive_due_to_medical",
                    "reason": "Aşırı uyku ve kilo alma hipotiroidiyi düşündürür; tiroid testleri bu vakada bildirilmediği için mutlaka bakılmalıdır."
                }
            ],
            "teachingPoint": "Atipik özellikli depresyonun anahtarı duygudurum tepkiselliğidir: kişi olumlu olaylarla geçici olarak neşelenebilir, melankolide bu yetenek tamamen kaybolur."
        }
    },
    {
        "id": "case-119",
        "caseNumber": 119,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "mdd",
        "therapyId": "ect_biological",
        "category": "MOOD",
        "patientSummary": "59 yaşında, erkek, emekli müdür",
        "clues": [
            "59 yaşındaki danışan, son 6 haftadır yaşamdan aldığı tüm zevkin tamamen silindiğini, çok sevdiği ilk torununun doğumu haberini aldığında bile içinde en ufak bir sıcaklık veya sevinç kıpırtısı oluşmadığını (tam anhedoni ve reaktivite kaybı) belirterek getirildi.",
            "Her gece saat 03:30'da sanki bir alarm çalmış gibi kendiliğinden uyandığını (terminal insomni / sabah erken uyanma) ve bir daha uyuyamadığını; depresif kederinin özellikle sabah saatlerinde dayanılmaz düzeyde ağır olduğunu, akşama doğru ise nispeten hafiflediğini (diürnal varyasyon) anlattı.",
            "Yemeklerin kendisine saman gibi geldiğini ve son 1.5 ayda 9 kilo kaybettiğini, geçmişteki küçük hataları yüzünden ailesini felakete sürüklediğine dair aşırı ve uygunsuz suçluluk duyduğunu söyledi.",
            "Hareketlerinin ve konuşmasının dışarıdan herkesin fark edeceği derecede ağır çekime alınmış gibi yavaşladığı (belirgin psikomotor retardasyon) gözlendi.",
            "Ruhsal Durum Muayenesinde: Omega melankolik yüz ifadesi, tam duygudurum tepkisizliği, sabahları kötüleşen derin çökkünlük ve vejetatif çöküş saptandı.",
            "DSM-5'e göre: Tam anhedoni ve olumlu uyaranlara tepkisizlik ile birlikte sabahları kötüleşme, sabah erken uyanma (en az 2 saat önce), belirgin psikomotor retardasyon/ajitasyon, belirgin anoreksi/kilo kaybı ve aşırı suçluluk kriterlerini karşılayan Majör Depresif Bozukluk (melankolik özellikli belirleyicisiyle) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "çok sevdiği ilk torununun doğumu haberini aldığında bile içinde en ufak bir sıcaklık veya sevinç kıpırtısı oluşmadığını",
                "dsmMatch": "DSM-5 Kriter A: Tam anhedoni ve olumlu olaylara duygudurum tepkiselliğinin kaybı"
            },
            {
                "clueIndex": 1,
                "text": "depresif kederinin özellikle sabah saatlerinde dayanılmaz düzeyde ağır olduğunu",
                "dsmMatch": "DSM-5 Kriter B2-B3: Sabah erken uyanma ve sabahları depresyonun daha ağır olması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Biyolojik Tedavi (SNRI / Trisiklik / EKT) & Yapılandırılmış BDT",
            "therapyDetails": "Ağır biyolojik/endojen depresyonda öncelikle farmakoterapi veya EKT ile psikomotor enerjinin açılması, ardından bilişsel yeniden yapılandırma ve intihar takibi.",
            "pharmacologyNote": "Melankolik depresyon plaseboya ve tek başına psikoterapiye zayıf yanıt verir; çift etkili antidepresanlar (Venlafaksin, Duloksetin), Trisiklikler ve ağır vakalarda EKT altın standarttır."
        },
        "miniQuiz": {
            "question": "Melankolik Özellikli Majör Depresyonda hastanın kederinin günün hangi saatinde en şiddetli olması ve uyku bozukluğunun hangi tipte olması tipiktir?",
            "options": [
                "Sabah saatlerinde depresyonun en ağır olması ve normalden en az 2 saat erken uyanıp tekrar uyuyamama (Terminal İnsomni)",
                "Gece yarısı neşelenip günde 16 saat uyuma (Hipersomni)",
                "Sadece öğle yemeklerinden sonra uyuklama",
                "Uyurgezerlik atakları"
            ],
            "correctIndex": 0,
            "explanation": "Melankolik depresyonda kortizol ve sirkadiyen ritim bozulmasına bağlı olarak sabah erken uyanma (terminal insomni) ve sabah saatlerinde kederin en ağır olması (diürnal varyasyon) tipiktir."
        },
        "differentialDiagnosis": "• Atipik Depresyon: Olumlu olaylarla neşelenebilir, çok uyur ve kilo alır; melankolik depresyonun tam zıttıdır.\n• Normal Yas: Yasta acı dalgalar halindedir ve olumlu anılarla gülümseyebilir; melankolide ise reaktivite tamamen sönmüştür.",
        "dsmCriteriaSummary": "DSM-5: Tam anhedoni / Olumlu uyaranlara tepkisizlik + Sabah kötüleşmesi, sabah erken uyanma, psikomotor yavaşlama/ajitasyon, belirgin kilo kaybı, aşırı suçluluk.",
        "pharmacologyId": "ect_biological_acute",
        "explanation": {
            "whyThis": [
                "Altı haftadır süren çökkünlük, kilo kaybı, aşırı suçluluk ve psikomotor yavaşlama majör depresif epizod ölçütlerini karşılar.",
                "Torununun doğumu gibi olumlu bir olaya bile hiçbir tepki verememe, melankolik özelliğin zorunlu öğesi olan tam anhedoni ve tepkisizliktir.",
                "Sabah erken uyanma, sabahları kötüleşme, belirgin kilo kaybı, aşırı suçluluk ve gözlenebilir yavaşlama melankolik belirtecin ek ölçütleridir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "prolonged_grief_disorder",
                    "reason": "Bir yakının ölümü bildirilmiyor; tablo yas değil, genel bir zevk ve tepki kaybıdır."
                },
                {
                    "diagnosisId": "major_neurocognitive_alzheimer",
                    "reason": "Yavaşlama ileri yaşta demansı düşündürebilir, ancak belirtiler altı hafta içinde duygudurum değişikliğiyle başlamıştır; bellek değerlendirmesi depresyon düzeldikten sonra yinelenmelidir."
                },
                {
                    "diagnosisId": "dysthymia",
                    "reason": "Belirtiler altı haftadır vardır; kalıcı depresif bozukluk en az iki yıl süren daha hafif ve süreğen bir tablo gerektirir."
                }
            ],
            "teachingPoint": "Melankolik ile atipik özellikli depresyon ayrımında ilk soru duygudurum tepkiselliğidir; melankolide olumlu olaylar bile duyguyu kıpırdatmaz."
        }
    },
    {
        "id": "case-120",
        "caseNumber": 120,
        "difficulty": "Kolay",
        "course": "ADULT",
        "diagnosisId": "specific_phobia",
        "therapyId": "invivo_exposure",
        "category": "ANXIETY",
        "patientSummary": "25 yaşında, erkek, stajyer öğretmen",
        "clues": [
            "25 yaşındaki danışan, öğretmenlik ataması için zorunlu olan basit bir kan tahlilini yaptırmaktan dehşetle korktuğu ve 8 yıldır hiçbir hastane veya laboratuvara adım atamadığı için başvurdu.",
            "Geçmişte ne zaman bir enjektör görse veya parmağından bir damla kan çıksa önce kalbinin hızlandığını, ancak birkaç saniye içinde tansiyonunun ve nabzının aniden düşerek gözlerinin karardığını, soğuk ter döktüğünü ve tam bayılma (vazovagal senkop) yaşadığını anlattı.",
            "Televizyonda ameliyat sahnesi çıktığında bile başının döndüğünü, bu yüzden diş tedavisini 4 yıldır ertelediğini ve apse yapan dişini çektiremediğini belirtti.",
            "Kardiyolojik muayene, EKG ve Tilt testi sonucunda organik bir aritmi saptanmamış; yalnızca kan/iğne uyaranıyla tetiklenen nörokardiyojenik vazovagal refleks doğrulanmıştır.",
            "Ruhsal Durum Muayenesinde: Diğer tüm fobilerden farklı olarak sempatik deşarjı izleyen ani parasempatik (vagal) bradikardi/hipotansiyon (bifazik otonomik yanıt) ve yoğun kaçınma davranışı saptandı.",
            "DSM-5'e göre: En az 6 aydır süren, kan görme, iğne olma veya tıbbi işlemlere karşı aşırı korku, kaçınma ve karakteristik vazovagal bayılma yanıtıyla seyreden Özgül Fobi (Kan-Enjeksiyon-Yara Tipi) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "tansiyonunun ve nabzının aniden düşerek gözlerinin karardığını, soğuk ter döktüğünü ve tam bayılma (vazovagal senkop)",
                "dsmMatch": "Klinik Özellik: Kan-Enjeksiyon fobisine özgü bifazik vazovagal senkop yanıtı"
            },
            {
                "clueIndex": 0,
                "text": "8 yıldır hiçbir hastane veya laboratuvara adım atamadığı",
                "dsmMatch": "DSM-5 Kriter C & E: En az 6 aydır süren aktif kaçınma davranışı"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Uygulamalı Kas Gerdirme (Applied Tension - Öst Protokolü) & Kademeli Maruz Bırakma",
            "therapyDetails": "Kan/iğne maruziyeti sırasında kol, gövde ve bacak kaslarını 15-20 saniye boyunca sıkarak kan basıncını yükseltmek ve vazovagal bayılmayı fizyolojik olarak engellemek.",
            "pharmacologyNote": "İlaç tedavisi genellikle gerekmez; işlem öncesi gevşetici/tansiyon düşürücü ilaçlar senkopu artırabileceği için önerilmez."
        },
        "miniQuiz": {
            "question": "Diğer tüm anksiyete bozukluklarında 'gevşeme egzersizi' uygulanırken, Kan-Enjeksiyon-Yara fobisinde neden gevşeme YASAKLANIP yerine 'Uygulamalı Kas Gerdirme' (Applied Tension) tekniği kullanılır?",
            "options": [
                "Çünkü kan fobisinde vagal refleksle tansiyon düşüp bayılma olur; gevşeme tansiyonu daha da düşürür, kasları germek ise tansiyonu yükselterek bayılmayı önler.",
                "Çünkü hastanın kasları erimiştir.",
                "Çünkü gevşeme egzersizi iğnenin kırılmasına yol açar.",
                "Çünkü kan fobisinde tansiyon 300'e çıkar."
            ],
            "correctIndex": 0,
            "explanation": "Kan-Enjeksiyon-Yara fobisi bifazik yanıt (önce kısa taşikardi, ardından ani bradikardi ve hipotansiyonla bayılma) gösteren tek fobidir. Kasları sıkmak (Applied Tension) venöz dönüşü ve tansiyonu artırarak bayılmayı engeller."
        },
        "differentialDiagnosis": "• Panik Bozukluk: Hasta bayılacağından korkar ancak tansiyonu yükseldiği için ASLA bayılmaz; kan fobisinde ise gerçek fizyolojik bayılma (senkop) görülür.\n• Hastalık Kaygısı Bozukluğu: İğneden değil, tahlil sonucunda kanser çıkacağından korkar.",
        "dsmCriteriaSummary": "DSM-5: En az 6 ay süren kan/iğne/yaralanma korkusu + Aktif kaçınma + Karakteristik vazovagal bayılma (senkop) yanıtı.",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Kan, iğne ve tıbbi işlemlere karşı orantısız korku ve sekiz yıldır hastane ve laboratuvarlardan kaçınma özgül fobinin temel ölçütleridir.",
                "Önce kalp hızlanması, ardından tansiyon ve nabzın düşmesiyle bayılma, kan-enjeksiyon-yaralanma tipine özgü iki evreli vazovagal yanıttır.",
                "Zorunlu tahlili yaptıramama ve diş tedavisini erteleyip apse gelişmesi belirgin işlev kaybını gösterir; tilt testi refleksi doğrulamıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "panic_disorder",
                    "reason": "Ataklar beklenmedik değil, kan ve iğne uyaranına bağlıdır ve gerçek bayılmayla sonuçlanır; panik atakta bayılma beklenmez."
                },
                {
                    "diagnosisId": "illness_anxiety_disorder",
                    "reason": "Korku tahlil sonucunda hastalık çıkması değil, iğnenin ve kanın kendisidir."
                },
                {
                    "diagnosisId": "conversion_disorder",
                    "reason": "Bayılma, tilt testiyle doğrulanan fizyolojik bir vazovagal reflekstir; nörolojik hastalıkla uyumsuz işlevsel bir belirti değildir."
                }
            ],
            "teachingPoint": "Kan-enjeksiyon-yaralanma tipi özgül fobide gerçek bayılma görülür; bu nedenle gevşeme yerine tansiyonu yükselten ‘uygulamalı gerginlik’ tekniği bu tipe özgüdür."
        }
    },
    {
        "id": "case-121",
        "caseNumber": 121,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "specific_phobia",
        "therapyId": "invivo_exposure",
        "category": "ANXIETY",
        "patientSummary": "24 yaşında, kadın, diyetisyen",
        "clues": [
            "24 yaşındaki danışan, kendisinin kusmasından veya başkasının kustuğunu görmekten/duymaktan ölümcül düzeyde korktuğu için son 2 yıldır restoranlarda yemek yiyemediğini, toplu taşımaya binemediğini ve çantasından antiemetik (bulantı önleyici) ilaçları hiç çıkarmadığını belirterek başvurdu.",
            "Midesinde en ufak bir guruldama veya şişkinlik hissettiğinde 'Ya şimdi kusarsam, kontrolümü kaybedip boğulursam' diyerek panik atak geçirmekte ve günlerce sadece kraker ve suyla beslenmektedir.",
            "Bu kısıtlı beslenme nedeniyle 6 kilo kaybettiği, ancak zayıflama veya güzel görünme arzusunun kesinlikle olmadığı; tek amacının midesini boş tutarak kusma ihtimalini sıfırlamak olduğu saptandı.",
            "Gastroenterolojik endoskopi ve tetkikler tamamen normaldir; danışan son 12 yıldır tek bir kez bile kusmamıştır.",
            "Ruhsal Durum Muayenesinde: Mide duyumlarına aşırı hipervijilans (içsel tarama), güvenlik arama davranışları (son kullanma tarihlerini 10 kez okuma, naneli şeker çiğneme) ve kusma uyaranlarına fobik kaçınma gözlendi.",
            "DSM-5'e göre: En az 6 aydır devam eden, kusma eylemine karşı orantısız ve yoğun korku, içsel/dışsal tetikleyicilerden kaçınma ve belirgin işlevsellik kaybıyla seyreden Özgül Fobi (Diğer Tip: Kusma Korkusu / Emetofobi) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "kendisinin kusmasından veya başkasının kustuğunu görmekten/duymaktan ölümcül düzeyde korktuğu",
                "dsmMatch": "DSM-5 Kriter A: Özgül kusma korkusu (Emetofobi)"
            },
            {
                "clueIndex": 2,
                "text": "zayıflama veya güzel görünme arzusunun kesinlikle olmadığı; tek amacının midesini boş tutarak kusma ihtimalini sıfırlamak olduğu",
                "dsmMatch": "Ayırıcı Tanı: Anoreksiya Nervozadan ayrım kriteri"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Kademeli Canlı ve İnteroseptif Maruz Bırakma (BDT)",
            "therapyDetails": "Bulantı önleyici ilaç ve naneli şeker gibi güvenlik davranışlarını bırakma, kusma kelimesi/sesi/videolarına kademeli maruziyet ve mide doluluk hissine interoseptif alışma.",
            "pharmacologyNote": "Ağır kaçınma ve eşlik eden panik/anksiyete varlığında SSRI (Sertralin, Essitalopram) maruz bırakma terapisini kolaylaştırır."
        },
        "miniQuiz": {
            "question": "Kusma korkusu (Emetofobi) nedeniyle yemek yemeyi kısıtlayan ve kilo kaybeden bir hastayı Anoreksiya Nervozadan ayıran en temel klinik kriter nedir?",
            "options": [
                "Emetofobide hastanın kilo alma korkusu veya beden imajı bozukluğunun olmaması; yemeyi sadece mide bulantısı ve kusmayı önlemek için kısıtlaması",
                "Emetofobi hastalarının günde 10 kez bilerek kusması",
                "Anoreksiya hastalarının hiç kilo kaybetmemesi",
                "Emetofobinin sadece bebeklerde görülmesi"
            ],
            "correctIndex": 0,
            "explanation": "Emetofobi hastaları şişmanlamaktan korkmazlar, aksine zayıflamaktan üzüntü duyabilirler; gıda kısıtlamasının tek nedeni mideyi boş tutarak kusma riskini engellemektir."
        },
        "differentialDiagnosis": "• Anoreksiya Nervoza: Temel motivasyon zayıf olma arzusu ve kilo alma korkusudur.\n• OKB: Bulaşma/mikrop obsesyonuna ikincil hastalık korkusu olabilir; emetofobide ise odak doğrudan kusma eyleminin kendisidir.",
        "dsmCriteriaSummary": "DSM-5: En az 6 ay süren kusma veya başkalarının kusmasını görme korkusu + Güvenlik davranışları ve kaçınma.",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Kusma ya da kusan birini görme korkusu tek ve özgül bir uyarana yönelik orantısız bir korkudur; 12 yıldır kusmamış olması bunu gösterir.",
                "Restoranlardan ve toplu taşımadan kaçınma, sürekli ilaç taşıma ve son kullanma tarihlerini tekrar tekrar okuma kaçınma ve güvenlik davranışlarıdır.",
                "İki yıldır süren kısıtlı beslenme ve altı kilo kayıp belirgin işlev kaybıdır; zayıflama isteği yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "anorexia_nervosa",
                    "reason": "Kısıtlamanın amacı zayıflamak değil kusma olasılığını azaltmaktır; kilo alma korkusu ve beden algısı bozukluğu yoktur."
                },
                {
                    "diagnosisId": "arfid",
                    "reason": "Yemeden kaçınma ARFID'de de görülebilir, ancak burada korku yemekten çok kusmanın kendisine ve kusma uyaranlarına yöneliktir ve yemek dışındaki durumlara da yayılır."
                },
                {
                    "diagnosisId": "panic_disorder",
                    "reason": "Panik ataklar mide duyumları ve kusma korkusuyla tetiklenir; beklenmedik ve nedensiz ataklar tarif edilmiyor."
                }
            ],
            "teachingPoint": "Emetofobide kısıtlı beslenme anoreksiyayı taklit edebilir; ayırt etmek için yemekten kaçınmanın amacını sor: zayıflamak mı, kusmaktan korunmak mı?"
        }
    },
    {
        "id": "case-122",
        "caseNumber": 122,
        "difficulty": "Kolay",
        "course": "ADULT",
        "diagnosisId": "social_anxiety",
        "therapyId": "cbt_general",
        "category": "ANXIETY",
        "patientSummary": "31 yaşında, erkek, senfoni orkestrası keman sanatçısı",
        "clues": [
            "31 yaşındaki profesyonel keman sanatçısı, son 8 aydır sadece sahneye çıkıp izleyicilerin önünde solo performans sergileyeceği zaman başlayan şiddetli el titremesi, taşikardi ve 'Yay elimden kayacak, yanlış nota basıp tüm orkestraya rezil olacağım' korkusuyla başvurdu.",
            "İlginç bir şekilde, konser dışındaki sosyal hayatında son derece dışadönük olduğu; partilerde, restoranlarda, arkadaş toplantılarında veya tanımadığı insanlarla sohbet ederken hiçbir kaygı yaşamadığı öğrenildi.",
            "Yalnızca sahneye çıkma veya jüri önünde çalma durumlarında kilitlendiği, bu yüzden son 3 konser öncesinde 'kolum incindi' bahanesiyle rapor alarak sahneye çıkmaktan kaçındığı ve mesleğini kaybetme tehlikesi yaşadığı belirlendi.",
            "Tiroid fonksiyon testleri ve nörolojik muayenesi normaldir; evde tek başına prova yaparken ellerinde hiçbir titreme olmamaktadır.",
            "Ruhsal Durum Muayenesinde: Genel sosyal etkileşimlerde tam rahatlık, yalnızca topluluk önünde performans sergileme veya konuşma durumlarına sınırlı yoğun olumsuz değerlendirilme anksiyetesi saptandı.",
            "DSM-5'e göre: En az 6 aydır süren ve korkunun yalnızca topluluk önünde konuşma ya da performans gösterme (sahne, konser, sunum) ile sınırlı olduğu Sosyal Anksiyete Bozukluğu (yalnızca performans belirleyicisiyle) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "sadece sahneye çıkıp izleyicilerin önünde solo performans sergileyeceği zaman başlayan şiddetli el titremesi",
                "dsmMatch": "DSM-5 Belirteç: Yalnızca Performans Tipi (Sahne/Sunum anksiyetesi)"
            },
            {
                "clueIndex": 1,
                "text": "partilerde, restoranlarda, arkadaş toplantılarında veya tanımadığı insanlarla sohbet ederken hiçbir kaygı yaşamadığı",
                "dsmMatch": "DSM-5 Ayırıcı Kriter: Performans dışı sosyal etkileşimlerde korku olmaması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilişsel Davranışçı Terapi (BDT) & Sahne Maruziyeti",
            "therapyDetails": "Dikkati kendi el titremesinden (içsel odaklanma) müziğe ve dışarıya yönlendirme, video geri bildirimi ile felaketleştirici tahminleri çürütme ve kademeli seyircili provalar.",
            "pharmacologyNote": "Yalnızca Performans Tipi Sosyal Anksiyetede sahneye/sunuma çıkmadan 45-60 dakika önce alınan tek doz Beta-Bloker (Propranolol 10-40 mg) el titremesi ve çarpıntıyı hızla kesen altın standart medikal destektir."
        },
        "miniQuiz": {
            "question": "Sosyal Anksiyete Bozukluğunun 'Yalnızca Performans Tipi'nde (örneğin müzisyenlerde sahne korkusu veya önemli bir sunum öncesi) otonomik titreme ve çarpıntıyı önlemek için performanstan 1 saat önce kullanılan en etkili ilaç hangisidir?",
            "options": [
                "Beta-Bloker (Propranolol)",
                "Yüksek doz Haloperidol",
                "Lityum",
                "Disülfiram"
            ],
            "correctIndex": 0,
            "explanation": "Performans anksiyetesinde performanstan 30-60 dakika önce alınan Propranolol (non-selektif beta-bloker), sedasyon veya zihinsel uyuşukluk yapmadan periferik el titremesini ve taşikardiyi bloke eder."
        },
        "differentialDiagnosis": "• Yaygın Sosyal Anksiyete Bozukluğu: Kişi tanışmaktan, yemek yemekten ve günlük sohbetlerden de korkar.\n• Esansiyel Tremor: Kişi evde yalnızken çay içerken de eli titrer; performans anksiyetesinde ise yalnızken titreme yoktur.",
        "dsmCriteriaSummary": "DSM-5: En az 6 ay süren olumsuz değerlendirilme korkusu + Korkunun yalnızca topluluk önünde konuşma veya performans sergilemeyle sınırlı olması.",
        "pharmacologyId": "propranolol_beta",
        "explanation": {
            "whyThis": [
                "Yalnızca izleyici önünde solo çalarken ortaya çıkan titreme, çarpıntı ve ‘rezil olacağım’ korkusu başkalarınca değerlendirilme kaygısıdır.",
                "Rapor alarak son üç konserden kaçınması ve mesleğini kaybetme riski belirgin kaçınma ve işlev kaybını gösterir.",
                "Diğer tüm sosyal ortamlarda rahat olması ‘yalnızca performans’ belirtecine uyar; evde prova yaparken titreme olmaması ve normal tiroid testleri tıbbi nedeni dışlar."
            ],
            "whyNot": [
                {
                    "diagnosisId": "anxiety_due_to_medical",
                    "reason": "Tiroid ve nörolojik muayene normaldir ve titreme yalnızca performans sırasında görülür."
                },
                {
                    "diagnosisId": "panic_disorder",
                    "reason": "Belirtiler yalnızca sahne öncesi ve sırasında ortaya çıkar; beklenmedik ataklar yoktur."
                },
                {
                    "diagnosisId": "avoidant_pd",
                    "reason": "Sosyal yaşamında dışa dönüktür; yaygın bir yetersizlik inancı ya da ilişkilerden kaçınma yoktur."
                }
            ],
            "teachingPoint": "Performansa sınırlı kaygıda tremorun yalnızken kaybolması, esansiyel tremor gibi organik nedenlerden ayırmada en pratik ipucudur."
        }
    },
    {
        "id": "case-123",
        "caseNumber": 123,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "bdd",
        "therapyId": "erp",
        "category": "OCD_RELATED",
        "patientSummary": "24 yaşında, erkek, amatör vücut geliştirici",
        "clues": [
            "24 yaşındaki danışan, 1.82 boyunda, 98 kilo ağırlığında ve %8 vücut yağ oranıyla dışarıdan bakıldığında aşırı kaslı ve iri bir fiziğe sahip olmasına rağmen, kendisini 'kürdan gibi cılız, çelimsiz ve küçük' gördüğü için kliniğe başvurdu.",
            "Günde 4 saat ağırlık antrenmanı yaptığını, kaslarının küçüleceği korkusuyla 2 yıldır hiçbir aile yemeğine veya tatile gitmediğini ve sıcak yaz günlerinde bile vücudunun 'cılızlığını' gizlemek için üst üste iki kalın kapüşonlu sweatshirt giydiğini anlattı.",
            "Günde en az 30 kez aynada omuz ve kol ölçülerini kontrol ettiği, spor salonundaki diğer erkeklerle vücudunu kıyasladığı ve kas hacmini artırmak için yasadışı anabolik-androjenik steroid kürleri kullandığı öğrenildi.",
            "Omuz liflerinde yırtık olmasına rağmen antrenmanı 1 gün bile aksatırsa 'tüm kaslarının eriyip yok olacağı' düşüncesiyle yoğun panik ve öfke yaşamaktadır.",
            "Ruhsal Durum Muayenesinde: Beden yapısının yeterince kaslı olmadığına dair aşırı değerlenmiş/sanrısal boyutta zihinsel uğraş, kompulsif ayna kontrolü ve kamuflaj davranışları saptandı.",
            "DSM-5'e göre: Kişinin gerçekte normal ya da çok kaslı olmasına karşın bedeninin çok küçük ya da yeterince kaslı olmadığı düşüncesiyle aşırı uğraşıp yineleyici kontrol davranışları sergilediği Beden Algısı Bozukluğu (Kas Dismorfisi / Bigoreksiya) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "aşırı kaslı ve iri bir fiziğe sahip olmasına rağmen, kendisini 'kürdan gibi cılız, çelimsiz ve küçük' gördüğü",
                "dsmMatch": "DSM-5 Kas Dismorfisi Belirteci: Beden yapısının çok küçük veya yetersiz kaslı olduğu algısı"
            },
            {
                "clueIndex": 2,
                "text": "Günde en az 30 kez aynada omuz ve kol ölçülerini kontrol ettiği",
                "dsmMatch": "DSM-5 Kriter B: Yineleyici ayna kontrolü, kıyaslama ve tehlikeli steroid kullanımı"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Tepki Önleme ile Maruz Bırakma (ERP) & Beden Algısı BDT'si",
            "therapyDetails": "Ayna kontrolü ve mezura ile ölçüm ritüellerini durdurma, kalın kamuflaj kıyafetleri olmadan tişörtle sokağa çıkma maruziyeti ve egzersiz süresini sağlıklı sınıra çekme.",
            "pharmacologyNote": "Yüksek doz SSRI (Fluoksetin, Fluvoksamin, Sertralin) obsesif beden uğraşısını azaltır; anabolik steroidlerin endokrinolojik kontrolle kesilmesi şarttır."
        },
        "miniQuiz": {
            "question": "DSM-5'te 'Kas Dismorfisi' (Bigoreksiya / Ters Anoreksiya) hangi ana tanı başlığının bir alt belirteci olarak sınıflandırılmıştır?",
            "options": [
                "Obsesif-Kompulsif ve İlişkili Bozukluklar -> Beden Algısı Bozukluğu (Body Dysmorphic Disorder)",
                "Beslenme ve Yeme Bozuklukları -> Bulimiya Nervoza",
                "Şizofreni Spektrumu",
                "Uyku-Uyanıklık Bozuklukları"
            ],
            "correctIndex": 0,
            "explanation": "Kas Dismorfisi (Bigoreksiya), DSM-5'te Yeme Bozuklukları altında değil, Obsesif-Kompulsif ve İlişkili Bozukluklar kategorisindeki 'Beden Algısı Bozukluğu'nun (BDD) resmi bir belirteci olarak yer alır."
        },
        "differentialDiagnosis": "• Anoreksiya Nervoza: Kişi zayıf olmak ister ve şişman görünmekten korkar; Kas Dismorfisinde ise kişi iri/kaslı olmak ister ve cılız görünmekten korkar.\n• Sağlıklı Vücut Geliştirme: İşlevsellik bozulmaz, kamuflaj ve kompulsif ayna kontrolü yoktur.",
        "dsmCriteriaSummary": "DSM-5: Beden Algısı Bozukluğu kriterleri + Vücut yapısının çok küçük veya yeterince kaslı olmadığına dair aşırı zihinsel uğraş.",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "98 kilo ve yüzde 8 yağ oranıyla belirgin kaslı biri olarak kendini ‘kürdan gibi cılız’ görmesi, başkalarınca fark edilmeyen bir kusurla aşırı uğraştır.",
                "Günde 30 kez ayna ve ölçü kontrolü, başkalarıyla karşılaştırma ve kalın giysilerle bedeni gizleme yineleyici davranışlardır.",
                "Aile yemeklerinden ve tatilden kaçınma, yırtığa rağmen antrenmana devam ve steroid kullanımı ağır işlev kaybını gösterir; bu tablo ‘kas dismorfisi ile’ belirtecine uyar."
            ],
            "whyNot": [
                {
                    "diagnosisId": "anorexia_nervosa",
                    "reason": "Kişi zayıf değil iri ve kaslı olmak istemektedir; korkusu şişmanlık değil cılız görünmektir."
                },
                {
                    "diagnosisId": "ocd",
                    "reason": "Kontrol davranışları yalnızca beden görünümüne odaklıdır; görünümden bağımsız obsesyonlar tarif edilmiyor."
                },
                {
                    "diagnosisId": "delusional_disorder",
                    "reason": "İnanç sanrısal yoğunlukta olsa bile tablo görünüm uğraşı ve yineleyici davranışlarla tanımlanır; bu durumda BDD ‘içgörü yok’ belirteciyle konur."
                }
            ],
            "teachingPoint": "Kas dismorfisinde anabolik steroid kullanımı sık ve tehlikelidir; bu hastalarda madde kullanımı ve bedensel komplikasyonlar ayrıca sorgulanmalıdır."
        }
    },
    {
        "id": "case-124",
        "caseNumber": 124,
        "difficulty": "İleri Düzey",
        "course": "CHILD",
        "diagnosisId": "ocd_due_to_medical",
        "therapyId": "erp",
        "category": "OCD_RELATED",
        "patientSummary": "8 yaşında, erkek, ilkokul 3. sınıf öğrencisi",
        "clues": [
            "8 yaşındaki çocuk, 2 hafta önce geçirdiği ateşli bir boğaz enfeksiyonunun (tonsillit) ardından kelimenin tam anlamıyla 'bir gecede' başlayan şiddetli el yıkama kompulsiyonları, göz kırpma/omuz silkme tikleri ve annesinden ayrılamama krizleriyle çocuk psikiyatrisine getirildi.",
            "Annesi, çocuğun Çarşamba akşamı tamamen sağlıklı, neşeli ve takıntısız bir çocuk olarak uyuduğunu; Perşembe sabahı ise 'Ellerime zehirli mikrop bulaştı' diyerek çığlıklarla uyandığını ve elleri kanayana kadar musluk başından ayrılmadığını anlattı.",
            "Okul öğretmenleri, daha önce sınıfın en güzel el yazısına sahip olan çocuğun son 3 günde el yazısının okunaksız kargacık burgacık bir hale geldiğini (akut disgrafi) ve sık sık tuvalete koştuğunu (pollakiüri / enürezis) bildirdi.",
            "Laboratuvar tetkiklerinde Boğaz Kültüründe A Grubu Beta Hemolitik Streptokok (GAS) üremesi ve serum Anti-Streptolizin O (ASO) ile Anti-DNase B antikor titrelerinde 4 kat artış saptandı.",
            "Ruhsal Durum ve Nörolojik Muayenede: Bazal ganglionlara karşı gelişen otoimmün çapraz reaksiyona bağlı hiperakut (yıldırım) başlangıçlı OKB, koreiform parmak hareketleri ve motor tikler tespit edildi.",
            "Klinik ve DSM-5 (Diğer Tıbbi Duruma Bağlı OKB) kriterlerine göre: Streptokok enfeksiyonu sonrası bazal ganglion otoimmünitesiyle bir gecede başlayan OKB ve tiklerle karakterize PANDAS (Pediatrik Otoimmün Nöropsikiyatrik Bozukluk) tablosudur; DSM-5-TR'de 'Başka Bir Sağlık Durumuna Bağlı Obsesif-Kompulsif ve İlişkili Bozukluk' olarak kodlanır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "boğaz enfeksiyonunun (tonsillit) ardından kelimenin tam anlamıyla 'bir gecede' başlayan şiddetli el yıkama kompulsiyonları, göz kırpma/omuz silkme tikleri",
                "dsmMatch": "PANDAS Kriterleri: Streptokok sonrası yıldırım (overnight) başlangıçlı OKB ve tikler"
            },
            {
                "clueIndex": 2,
                "text": "el yazısının okunaksız kargacık burgacık bir hale geldiğini (akut disgrafi)",
                "dsmMatch": "Nörolojik Belirteç: Bazal ganglion tutulumuna bağlı akut el yazısı bozulması ve sık idrara çıkma"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Antibiyotik/İmmünoterapi + Tepki Önleme ile Maruz Bırakma (ERP)",
            "therapyDetails": "Streptokok eradikasyonu, anti-inflamatuar tedavi (NSAID / IVIG) ve eşzamanlı olarak çocuğa uyarlanmış oyun temelli ERP protokolü.",
            "pharmacologyNote": "Aktif streptokok enfeksiyonuna yönelik antibiyotik (Penisilin/Amoksisilin veya Azitromisin) ve çok düşük dozdan başlanan SSRI (otoimmün beyinde SSRI aktivasyon yan etkisine dikkat!)."
        },
        "miniQuiz": {
            "question": "PANDAS sendromunu klasik çocukluk çağı OKB'sinden ayıran en çarpıcı klinik başlangıç özelliği nedir?",
            "options": [
                "A Grubu Beta Hemolitik Streptokok (boğaz) enfeksiyonu sonrasında semptomların sinsi değil, 24-48 saat içinde 'yıldırım hızıyla / bir gecede' patlak vermesi",
                "Semptomların sadece 18 yaşından sonra başlaması",
                "Hastada hiçbir zaman el yıkama veya tik görülmemesi",
                "Bozukluğun sadece vitamin eksikliğinden kaynaklanması"
            ],
            "correctIndex": 0,
            "explanation": "Klasik OKB aylar içinde sinsi başlar; PANDAS'ta ise streptokok antikorlarının bazal ganglionlarla çapraz reaksiyona girmesi sonucu OKB, tikler, el yazısı bozulması ve ayrılık anksiyetesi bir gecede (dramatik akut başlangıç) ortaya çıkar."
        },
        "differentialDiagnosis": "• Klasik Çocukluk OKB'si: Sinsi başlangıçlıdır, streptokok enfeksiyonu, akut disgrafi ve koreiform hareketlerle ilişkisi yoktur.\n• Sydenham Koresi: Akut romatizmal ateşin nörolojik bulgusudur, belirgin dans benzeri kore hareketleri ön plandadır.",
        "dsmCriteriaSummary": "PANDAS Kriterleri: Prepüberal başlangıç + GAS (Streptokok) enfeksiyonu kanıtı + Bir gecede (akut) başlayan OKB ve/veya tik bozukluğu + Nörolojik bulgular (disgrafi, koreiform hareketler).",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Bulaşma korkusu ve elleri kanayana kadar yıkama obsesyon ve kompulsiyonlardır; göz kırpma ve omuz silkme tikleri eşlik eder.",
                "Belirtilerin bir streptokok boğaz enfeksiyonundan iki hafta sonra ‘bir gecede’ başlaması, el yazısının bozulması ve koreiform hareketler tıbbi bir nedenle zamansal ilişkiyi gösterir.",
                "Boğaz kültüründe A grubu streptokok ve antikor titrelerinde dört kat artış bu ilişkiyi laboratuvarla destekler; tablo başka bir sağlık durumuna bağlı OKB-ilişkili bozukluk olarak kodlanır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "ocd",
                    "reason": "Birincil OKB genellikle sinsi başlar; ani başlangıç, enfeksiyon kanıtı ve nörolojik bulgular tıbbi bir nedeni düşündürür."
                },
                {
                    "diagnosisId": "tourette",
                    "reason": "Tikler birkaç gündür vardır ve Tourette için gereken bir yıllık süre yoktur; ayrıca tablo enfeksiyonla birlikte ani başlamıştır."
                },
                {
                    "diagnosisId": "separation_anxiety",
                    "reason": "Annesinden ayrılamama ani başlayan nöropsikiyatrik tablonun bir parçasıdır; bağımsız ve en az dört hafta süren bir ayrılma kaygısı örüntüsü yoktur."
                }
            ],
            "teachingPoint": "Çocukta OKB ve tikler bir gecede, enfeksiyon sonrası ve nörolojik bulgularla başladıysa tıbbi bir neden araştırılmalıdır; PANDAS hâlâ tartışmalı bir kavramdır."
        }
    },
    {
        "id": "case-125",
        "caseNumber": 125,
        "difficulty": "Zor",
        "course": "ADULT",
        "diagnosisId": "ocd",
        "therapyId": "erp",
        "category": "OCD_RELATED",
        "patientSummary": "28 yaşında, erkek, yazılımcı",
        "clues": [
            "28 yaşındaki danışan, çok sevdiği yeni doğmuş bebeğini kucağına aldığında zihnine aniden 'Ya şimdi bebeği balkondan aşağı atarsam' veya mutfakta eşiyle yemek yaparken 'Ya elimdeki bıçağı eşime saplarsam' şeklinde dehşet verici görüntülerin hücum etmesi nedeniyle ağlayarak başvurdu.",
            "Ayrıca namaz kılarken veya dua ederken zihnine istemsizce küfürlü ve dine hakaret içeren sözcüklerin (dini obsesyon / vesvese) geldiğini, kendisini 'dünyanın en ahlaksız canavarı' gibi hissettiğini anlattı.",
            "Bu düşüncelerden o kadar korkmaktadır ki evdeki tüm bıçakları çöp kutusuna atmış, bebeğiyle yalnız kalmamak için odaya girmemeye başlamış ve zihnindeki küfürleri silmek için içinden günde 500 kez sessizce tövbe duası okuyup düşünceleri nötralize etmeye (zihinsel kompulsiyon) çalışmaktadır.",
            "Danışanın geçmişinde hiçbir şiddet eylemi, dürtü kontrol bozukluğu veya psikoz öyküsü yoktur; eşine ve bebeğine zarar verme arzusu KESİNLİKLE bulunmamaktadır (tam egodistonik yapı).",
            "Ruhsal Durum Muayenesinde: Dışarıdan gözlenen el yıkama gibi motor kompulsiyonları olmayan, ancak yoğun intruzif tabu obsesyonlar (zarar verme/dini) ve gizli zihinsel kompulsiyonlarla giden OKB tablosu saptandı.",
            "DSM-5'e göre: Kişinin değerlerine tamamen ters düşen (egodistonik) saldırganlık, dini veya cinsel içerikli intruzif obsesyonlar ve bunları bastırmak için yapılan kaçınma/zihinsel ritüellerle seyreden Obsesif-Kompulsif Bozukluk (Tabu Düşünceler) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "'Ya elimdeki bıçağı eşime saplarsam' şeklinde dehşet verici görüntülerin hücum etmesi",
                "dsmMatch": "DSM-5 Kriter A: Egodistonik saldırganlık/zarar verme obsesyonları (Tabu düşünceler)"
            },
            {
                "clueIndex": 2,
                "text": "içinden günde 500 kez sessizce tövbe duası okuyup düşünceleri nötralize etmeye (zihinsel kompulsiyon)",
                "dsmMatch": "DSM-5 Kriter B: Obsesyonu etkisizleştirmeye yönelik örtük zihinsel kompulsiyonlar"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Tepki Önleme ile Maruz Bırakma (ERP) & Düşünce-Eylem Kaynaşmasını Çözme",
            "therapyDetails": "Saklanan bıçakları mutfağa geri koyma, bebekle yalnız kalma maruziyeti, zihinsel dua/nötralizasyon ritüellerini durdurma ve 'Bir şeyi düşünmek onu yapmakla aynı şeydir' (Thought-Action Fusion) yanılgısını çürütme.",
            "pharmacologyNote": "Yüksek doz SSRI (Sertralin, Fluoksetin, Essitalopram) veya Klomipramin intruzif obsesyonların sıklığını ve yarattığı dehşeti belirgin şekilde azaltır."
        },
        "miniQuiz": {
            "question": "Saldırganlık veya zarar verme obsesyonu olan bir OKB hastasını ('Ya çocuğuma zarar verirsem diye ödüm kopuyor') gerçek bir antisosyal/psikopat saldırgandan ayıran en temel özellik nedir?",
            "options": [
                "OKB hastasında düşüncenin tamamen 'egodistonik' (değerlerine aykırı ve dehşet verici) olması ve kişinin bu düşünceden kaçmak için bıçakları saklaması; düşüncenin eyleme dökülme riskinin olmaması",
                "OKB hastalarının bu düşüncelerden büyük keyif alması",
                "OKB hastalarının hemen polis tarafından tutuklanması",
                "Antisosyal kişilerin günde 500 kez tövbe etmesi"
            ],
            "correctIndex": 0,
            "explanation": "OKB'deki tabu düşünceler kişinin en çok değer verdiği şeylere (bebeğine, inancına) saldırdığı için yoğun dehşet yaratır (egodistoniktir). Hasta düşünceden korktuğu için kaçınır ve bu düşünceleri asla eyleme dökmez."
        },
        "differentialDiagnosis": "• Psikotik Bozukluk / Komut Halüsinasyonları: Psikozda hasta dışarıdan ses duyar ve içgörüsü yoktur; OKB'de kişi düşüncenin kendi zihninden çıktığını ve saçma olduğunu bilir.\n• Antisosyal Kişilik: Zarar verme düşüncesi egosintoniktir, vicdan azabı veya korku yoktur.",
        "dsmCriteriaSummary": "DSM-5: İstenmeyen saldırganlık/dini/cinsel intruzif düşünceler (Obsesyon) + Zihinsel nötralizasyon, güvence arama ve kaçınma (Kompulsiyon).",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Bebeğini balkondan atma ya da eşini bıçaklama ile ilgili istemsiz ve dehşet verici imgeler, kişinin değerlerine ters düşen zarar verme obsesyonlarıdır.",
                "Dua sırasında gelen küfürlü düşünceler dini içerikli obsesyonlardır; günde yüzlerce kez tövbe duası okumak zihinsel bir kompulsiyondur.",
                "Bıçakları atma ve bebekle yalnız kalmama kaçınma davranışlarıdır; şiddet öyküsü ve zarar verme isteği yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "schizophrenia",
                    "reason": "Düşünceler dışarıdan gelen sesler değil, kişinin kendi zihninde fark ettiği ve saçma bulduğu düşüncelerdir; içgörü korunmuştur."
                },
                {
                    "diagnosisId": "antisocial_pd",
                    "reason": "Zarar verme düşüncesi kişiye yabancı ve korkutucudur; şiddet öyküsü ya da zarar verme isteği yoktur."
                },
                {
                    "diagnosisId": "mdd",
                    "reason": "Bebeğin doğumundan sonra ortaya çıkan zarar düşünceleri depresyonda da görülebilir, ancak burada çökkünlük ve anhedoni değil, obsesyon-ritüel döngüsü öndedir; depresif belirtiler yine de taranmalıdır."
                }
            ],
            "teachingPoint": "Zarar verme obsesyonları olan OKB hastalarında gerçek şiddet riski düşüktür; bu düşüncelerin kişiye yabancı olması ve kaçınmaya yol açması onları gerçek niyetten ayırır."
        }
    },
    {
        "id": "case-126",
        "caseNumber": 126,
        "difficulty": "Orta",
        "course": "CHILD",
        "diagnosisId": "reactive_attachment_disorder",
        "therapyId": "parent_training",
        "category": "TRAUMA",
        "patientSummary": "3.5 yaşında, erkek, ağır ihmal sonrası koruyucu aileye verilen çocuk",
        "clues": [
            "3.5 yaşındaki çocuk, ilk 3 yılını ağır duygusal ve fiziksel ihmal altında, sürekli değişen bakıcıların olduğu aşırı kalabalık bir yetiştirme kurumunda geçirdikten sonra kendisini evlat edinen koruyucu ailesi tarafından getirildi.",
            "Koruyucu annesi, çocuk düştüğünde ve dizini kanattığında bile sessizce köşede ağladığını, teselli edilmek veya kucağa alınmak için asla yetişkinlere yönelmediğini (avutulma arayışının olmaması) ve sarıldıklarında kaskatı kesilerek tepkisiz kaldığını anlattı.",
            "Evde oyun oynanırken hiçbir olumlu duygu (gülümseme, neşe) paylaşmadığı, çevreye karşı sürekli donuk, korkulu ve üzgün bir duygulanım sergilediği gözlemlendi.",
            "Çocukta Otizm Spektrum Bozukluğuna özgü basmakalıp (stereotipik) el çırpma hareketleri, ekolali veya dar ilgi alanları YOKTUR; sosyal bilişsel kapasitesi korunmuştur.",
            "Ruhsal Durum Muayenesinde: Ağır erken dönem bakım eksikliğine bağlı içe kapanık, duygusal olarak ketlenmiş bağlanma örüntüsü ve açıklanamayan korku/huzursuzluk dönemleri saptandı.",
            "DSM-5'e göre: Yetersiz/ihmalkar bakım öyküsü zemininde, 5 yaşından önce başlayan, sıkıntılı olduğunda avutulma arayışında olmama ve toplumsal/duygusal tepkisizlik ile karakterize Tepkisel Bağlanma Bozukluğu (RAD) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "teselli edilmek veya kucağa alınmak için asla yetişkinlere yönelmediğini (avutulma arayışının olmaması)",
                "dsmMatch": "DSM-5 Kriter A1 & A2: Sıkıntılı olduğunda avutulma aramama ve avutulmaya tepki vermeme"
            },
            {
                "clueIndex": 3,
                "text": "Otizm Spektrum Bozukluğuna özgü basmakalıp (stereotipik) el çırpma hareketleri, ekolali veya dar ilgi alanları YOKTUR",
                "dsmMatch": "DSM-5 Kriter D: Otizm Spektrum Bozukluğu ölçütlerinin karşılanmaması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bağlanma Odaklı Ebeveyn Eğitimi (ABC / Çember Güvenliği - Circle of Security)",
            "therapyDetails": "Sabit, sıcak, öngörülebilir ve duyarlı bir birincil bakımveren ortamı sağlama; çocuk istemese bile nazik ve istikrarlı duygusal mevcudiyet sunma.",
            "pharmacologyNote": "Tepkisel Bağlanma Bozukluğunun spesifik bir ilaç tedavisi yoktur; temel tedavi güvenli ve sevgi dolu bakım çevresinin inşasıdır."
        },
        "miniQuiz": {
            "question": "Tepkisel Bağlanma Bozukluğu (RAD) ile Sınırsız Toplumsal Katılım Bozukluğu (DSED) her ikisi de ağır çocukluk ihmali sonucu gelişmesine rağmen aralarındaki en temel davranışsal fark nedir?",
            "options": [
                "RAD'da çocuk içe kapanıktır ve kimseye (bakımverene bile) yakınlık/teselli aramaz; DSED'de ise çocuk hiç yabancılık çekmez ve ilk kez gördüğü yabancının bile kucağına atlar.",
                "RAD sadece ergenlikte başlar, DSED ise yaşlılıkta başlar.",
                "RAD'da çocuk aşırı konuşkandır.",
                "İkisi arasında hiçbir fark yoktur."
            ],
            "correctIndex": 0,
            "explanation": "Aynı ihmal etiyolojisinden iki farklı fenotip doğar: RAD (İnhibe/Ketlenmiş tip) kimseden teselli aramaz ve içe çekilir; DSED (Dezinhibe tip) ise sınır tanımadan her yabancıya sarılır ve yabancılarla çekinmeden gider."
        },
        "differentialDiagnosis": "• Otizm Spektrum Bozukluğu (OSB): OSB'de sıcak ve sevgi dolu aile ortamına rağmen sosyal kopukluk ve stereotipik hareketler vardır; RAD'da ise ağır ihmal öyküsü şarttır ve sıcak bakımla hızla düzelir.\n• Sınırsız Toplumsal Katılım Bozukluğu: Yabancılara aşırı sırnaşma vardır.",
        "dsmCriteriaSummary": "DSM-5: Ağır ihmal/kurum bakımı öyküsü + 9 ay-5 yaş arası başlangıç + Avutulma aramama/tepki vermeme + OSB dışlanması.",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Yaralandığında bile avutulmak için yetişkinlere yönelmemesi ve sarılınca kaskatı kesilmesi, sıkıntı anında bakım verene yönelme ve avutulmaya yanıt vermede belirgin eksikliktir.",
                "Olumlu duygu paylaşmaması, donuk ve korkulu duygulanım ile açıklanamayan huzursuzluk dönemleri toplumsal-duygusal tepkisizliği gösterir.",
                "İlk üç yıldaki ağır ihmal ve sürekli değişen bakıcılar zorunlu bakım eksikliği ölçütünü karşılar; tablo beş yaşından önce başlamıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "asd",
                    "reason": "Basmakalıp hareketler, ekolali ve dar ilgi alanları yoktur ve sosyal bilişsel kapasite korunmuştur; tablo ağır ihmal zemininde gelişmiştir."
                },
                {
                    "diagnosisId": "disinhibited_social_engagement",
                    "reason": "Çocuk yabancılara sınırsızca yaklaşmıyor; tersine içe kapanık ve tepkisizdir."
                },
                {
                    "diagnosisId": "ptsd_preschool",
                    "reason": "Belirli bir travmatik olaya bağlı yeniden yaşantılama ya da kaçınma tarif edilmiyor; sorun bağlanma davranışının yokluğudur."
                }
            ],
            "teachingPoint": "Tepkisel bağlanma bozukluğunda çocuk bağlanma kapasitesine sahiptir ama bunu geliştirme fırsatı bulamamıştır; ağır bakım eksikliği öyküsü tanı için zorunludur."
        }
    },
    {
        "id": "case-127",
        "caseNumber": 127,
        "difficulty": "Orta",
        "course": "CHILD",
        "diagnosisId": "disinhibited_social_engagement",
        "therapyId": "parent_training",
        "category": "TRAUMA",
        "patientSummary": "4 yaşında, kız, koruyucu ailedeki çocuk",
        "clues": [
            "4 yaşındaki kız çocuğu, yaşamının ilk 2.5 yılını ihmal nedeniyle çocuk esirgeme kurumunda geçirdikten sonra evlat edinildiği ailesi tarafından 'parkta gördüğü hiç tanımadığı yabancıların elini tutup onlarla gitmeye çalıştığı' için endişeyle kliniğe getirildi.",
            "Klinik bekleme salonuna girer girmez, hayatında ilk kez gördüğü erkek bir hastanın kucağına hiçbir çekingenlik göstermeden oturduğu, boynuna sarıldığı ve çantasını karıştırdığı gözlemlendi.",
            "Parkta veya alışveriş merkezinde koruyucu annesinden hızla uzaklaştığı, korkutucu veya yabancı ortamlarda bile ebeveynine dönüp bakmadığı (sosyal referans almama) ve herhangi bir yabancıyla kolayca uzaklaşabildiği öğrenildi.",
            "Çocukta DEHB'ye özgü dikkat süresi kısalığı veya akademik dürtüsellik olmadan da bu sosyal sınır kaybının sürdüğü doğrulandı.",
            "Ruhsal Durum Muayenesinde: Yaşa uygun yabancı kaygısının (stranger anxiety) tamamen yokluğu, tanımadığı yetişkinlerle aşırı tanıdıkmış gibi sözel ve fiziksel temas kurma (sınırsız sosyal katılım) saptandı.",
            "DSM-5'e göre: Erken çocukluk dönemindeki ağır bakım eksikliği/ihmal sonucunda gelişen, yabancı yetişkinlere yaklaşmada ve etkileşim kurmada kültürel açıdan uygunsuz, aşırı teklifsiz davranışlarla seyreden Sınırsız Toplumsal Katılım Bozukluğu (DSED) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "parkta gördüğü hiç tanımadığı yabancıların elini tutup onlarla gitmeye çalıştığı",
                "dsmMatch": "DSM-5 Kriter A4: Çok az tereddüt ederek ya da hiç tereddüt etmeden bir yabancıyla çekip gitme"
            },
            {
                "clueIndex": 1,
                "text": "hayatında ilk kez gördüğü erkek bir hastanın kucağına hiçbir çekingenlik göstermeden oturduğu",
                "dsmMatch": "DSM-5 Kriter A1-A2: Yabancı yetişkinlere yaklaşmada çekingenlik olmaması ve aşırı fiziksel yakınlık"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Sınır Eğitimi & Bağlanma Temelli Ebeveyn Müdahalesi",
            "therapyDetails": "Çocuğun kaçırılma/istismar riskine karşı yakın güvenlik gözetimi, 'Güvenli Çember' görselleriyle kimlere sarılınabileceği ve yabancılarla fiziksel mesafe kurallarının somut olarak öğretilmesi.",
            "pharmacologyNote": "Spesifik bir ilaç tedavisi yoktur; eşlik eden DEHB varsa tedavi edilir ancak temel müdahale davranışsal sınır ve bağlanma eğitimidir."
        },
        "miniQuiz": {
            "question": "Sınırsız Toplumsal Katılım Bozukluğu (DSED) olan bir çocuğu sadece 'çok sıcakkanlı ve sosyal' normal bir çocuktan veya DEHB'den ayıran en kritik özellik nedir?",
            "options": [
                "Erken dönemde ağır ihmal/bakıcı değişimi öyküsü olması ve çocuğun bakımvereninden onay almadan hiç tanımadığı bir yabancıyla çekinmeden çekip gidebilmesi",
                "Çocuğun hiç konuşamaması",
                "Çocuğun yabancılardan korkup ağlaması",
                "Sadece okulda ders çalışırken ortaya çıkması"
            ],
            "correctIndex": 0,
            "explanation": "Normal dışadönük çocuklar yabancı bir ortamda ebeveynine bakarak güvenlik kontrolü (social referencing) yapar ve yabancıyla gitmez; DSED'de ise ağır ihmal öyküsü vardır ve çocuk hiç tanımadığı biriyle tereddütsüz gider."
        },
        "differentialDiagnosis": "• Tepkisel Bağlanma Bozukluğu (RAD): Çocuk içine kapanıktır ve kimseye yaklaşmaz; DSED ise tam tersine her yabancıya aşırı yaklaşır.\n• DEHB: Genel motor hareketlilik ve dikkat dağınıklığı vardır, yabancılarla çekip gitme davranışı tipik değildir.",
        "dsmCriteriaSummary": "DSM-5: Ağır ihmal öyküsü + Yabancı yetişkinlere çekinmeden yaklaşma + Aşırı teklifsiz sözel/fiziksel temas + Yabancıyla gitmeye hazır olma (Gelişimsel yaş ≥ 9 ay).",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Parkta tanımadığı yabancılarla gitmeye çalışması ve ilk kez gördüğü bir yetişkinin kucağına oturması, yabancılara yaklaşmada ketlenmenin kaybolduğunu gösterir.",
                "Yabancı ortamlarda bile ebeveynine dönüp bakmaması ve kolayca uzaklaşabilmesi, bakım verene başvurmanın azaldığını gösterir.",
                "Yaşamın ilk iki buçuk yılındaki kurum bakımı ve ihmal zorunlu bakım eksikliği ölçütüdür; davranış dürtüsellikle sınırlı değildir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "reactive_attachment_disorder",
                    "reason": "Çocuk içe kapanık ve tepkisiz değil; tam tersine yabancılara aşırı ve teklifsizce yaklaşıyor."
                },
                {
                    "diagnosisId": "adhd",
                    "reason": "Davranış dikkat sorunu ve genel dürtüsellik olmadan da sürüyor; asıl sorun sosyal sınırların kaybıdır."
                },
                {
                    "diagnosisId": "asd",
                    "reason": "Sosyal ilgi azalmamış, aksine aşırı artmıştır; kısıtlı ilgiler ya da basmakalıp davranışlar tarif edilmiyor."
                }
            ],
            "teachingPoint": "İhmal sonrası iki bağlanma tablosu zıt kutuplardır: RAD'da çocuk kimseye yönelmez, DSED'de herkese ayrımsız yönelir."
        }
    },
    {
        "id": "case-128",
        "caseNumber": 128,
        "difficulty": "Zor",
        "course": "ADULT",
        "diagnosisId": "dissociative_amnesia",
        "therapyId": "phase_oriented_trauma",
        "category": "DISSOCIATIVE",
        "patientSummary": "41 yaşında, erkek, iflas eden iş insanı",
        "clues": [
            "41 yaşındaki erkek hasta, İstanbul'daki şirketinin ağır haciz ve iflas kararı aldığı gün evinden çıktıktan 4 gün sonra, 600 kilometre uzaktaki Antalya otogarında bir polis devriyesi tarafından kimliksiz ve şaşkın halde bulunarak acil servise getirildi.",
            "Hasta polislere ve hekimlere adının ne olduğunu, nerede yaşadığını, evli olup olmadığını ve İstanbul'dan Antalya'ya nasıl geldiğini kesinlikle hatırlamadığını (otobiyografik retrograd amnezi) söyledi.",
            "Otobüs bileti ve otel kayıtları incelendiğinde, hastanın bu 4 gün boyunca gayet sakin ve amaca yönelik bir şekilde bilet aldığı, küçük bir pansiyonda 'Ali Yılmaz' takma adıyla kayıt yaptırdığı ve dışarıdan bakıldığında hiçbir taşkınlık veya konfüzyon sergilemediği anlaşıldı.",
            "Kranial MRG, Difüzyon MR, elektroensefalografi (EEG) ve toksikoloji taramaları tamamen normaldir; temporal lob epilepsisi, kafa travması veya geçici global amnezi dışlanmıştır.",
            "Ruhsal Durum Muayenesinde: Genel dünya bilgisi, dil ve hesaplama becerileri (semantik bellek) sağlam olmasına karşın, ağır finansal yıkım stresöründen kaçışa bağlı tam kimlik amnezisi ve amaçlı seyahat (füg) saptandı.",
            "DSM-5'e göre: Otobiyografik bilgileri anımsayamama ile birlikte evinden veya işyerinden beklenmedik biçimde ayrılıp amaçlı yolculuk yapma ya da şaşkın dolaşma ile karakterize Dissosiyatif Füg ile Giden Dissosiyatif Amnezi tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "600 kilometre uzaktaki Antalya otogarında bir polis devriyesi tarafından kimliksiz ve şaşkın halde bulunarak",
                "dsmMatch": "DSM-5 Dissosiyatif Füg Belirteci: Evden uzakta amaçlı yolculuk veya şaşkın dolaşma"
            },
            {
                "clueIndex": 1,
                "text": "adının ne olduğunu, nerede yaşadığını, evli olup olmadığını ve İstanbul'dan Antalya'ya nasıl geldiğini kesinlikle hatırlamadığını",
                "dsmMatch": "DSM-5 Kriter A: Otobiyografik bellek ve kişisel kimlik amnezisi"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Faz Odaklı Travma Terapisi & Güvenli Kimlik Entegrasyonu",
            "therapyDetails": "Hastayı güvenli ve destekleyici bir ortamda stabilize etme, aile üyeleriyle kademeli temas, tetikleyici ağır stresörle (iflas/travma) baş etme becerileri ve psikodinamik/hipnoterapötik bellek entegrasyonu.",
            "pharmacologyNote": "Spesifik bir ilaç tedavisi yoktur; eşlik eden akut anksiyete ve uykusuzluk için kısa süreli düşük doz anksiyolitik destek verilebilir."
        },
        "miniQuiz": {
            "question": "Dissosiyatif Füg (Kaçış) ile organik 'Geçici Global Amnezi' (TGA) veya 'Demans' arasındaki en temel klinik ayrım nedir?",
            "options": [
                "Dissosiyatif Fügte ağır bir psikolojik travma/stresör sonrası kişi kendi adını ve kimliğini unutarak başka bir şehre düzenli yolculuk yapar; TGA ve demansta ise kişi kendi adını ASLA unutmaz, sadece yeni bilgileri kaydedemez.",
                "Dissosiyatif Füg sadece 80 yaş üstünde görülür.",
                "Geçici Global Amnezide hasta yeni bir kimlikle işe girer.",
                "Dissosiyatif Füg beyin tümöründen kaynaklanır."
            ],
            "correctIndex": 0,
            "explanation": "Nörolojik amnezilerde (TGA, Korsakoff, erken Alzheimer) kişi yeni olayları unutur (anterograd amnezi) ama kendi adını ve kimliğini bilir. Kişinin yeni olayları kaydedebildiği halde kendi adını/kimliğini unutup başka şehre gitmesi Dissosiyatif Fügtür."
        },
        "differentialDiagnosis": "• Geçici Global Amnezi (TGA): Hasta kendi adını bilir, yeni bilgileri kaydedemediği için sürekli 'Ben neredeyim?' diye aynı soruyu tekrarlar ve 24 saat içinde düzelir.\n• Kompleks Parsiyel Epilepsi (Postiktal Füg): Amaçsız otomatizmalar vardır, EEG'de epileptiform deşarj görülür.",
        "dsmCriteriaSummary": "DSM-5: Travmatik/stresli olay sonrası kişisel kimlik ve geçmiş amnezisi + Evden/işten uzaklaşarak amaçlı yolculuk yapma (Dissosiyatif Füg).",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Adını, adresini ve medeni durumunu hatırlayamaması olağan unutkanlığı aşan önemli otobiyografik bilgi kaybıdır.",
                "İflas günü evden çıkıp 600 km uzağa sakin ve amaçlı biçimde seyahat etmesi ve takma adla pansiyona kaydolması füg tablosunu gösterir; DSM-5-TR'de füg, dissosiyatif amnezinin bir belirtecidir.",
                "Genel bilgi, dil ve hesap becerileri sağlamdır; MRG, EEG ve toksikoloji normaldir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "did",
                    "reason": "‘Ali Yılmaz’ adı yeni bir kimlik gibi görünse de birbirinden ayrı, yineleyen kişilik durumları ve aralarında geçişler tarif edilmiyor."
                },
                {
                    "diagnosisId": "major_neurocognitive_tbi",
                    "reason": "Görüntülemede travma bulgusu yoktur ve yeni bilgi öğrenme korunmuştur; amnezi kişisel kimlikle sınırlıdır."
                },
                {
                    "diagnosisId": "factitious_disorder",
                    "reason": "Belirtileri bilerek ürettiğine ya da hasta rolü aradığına dair kanıt yoktur; ancak iflas gibi dış bir etken olduğundan temaruz da dikkatle değerlendirilmelidir."
                }
            ],
            "teachingPoint": "Füg ayrı bir tanı değil, dissosiyatif amnezinin ‘dissosiyatif füg ile’ belirtecidir: ağır bir stresörden kaçışla ilişkili amaçlı seyahat ve kimlik bilgisinin kaybı; genel bilgi ve beceriler korunurken kişisel geçmiş silinir."
        }
    },
    {
        "id": "case-129",
        "caseNumber": 129,
        "difficulty": "Zor",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "conversion_disorder",
        "therapyId": "cbt_general",
        "category": "SOMATIC",
        "patientSummary": "22 yaşında, kadın, üniversite öğrencisi",
        "clues": [
            "22 yaşındaki danışan, son 3 aydır ailesiyle tartıştığında veya sınav stresi yaşadığında insanların yanında yere yavaşça kayarak düştüğü ve 15-20 dakika boyunca kollarını-bacaklarını asenkron (birbiriyle uyumsuz) şekilde çırparak nöbet geçirdiği için nöroloji servisine yatırıldı.",
            "Nöbet sırasında başını sağa-sola 'hayır' der gibi salladığı, pelvik itme hareketleri yaptığı ve nöbet boyunca gözlerini sımsıkı kapalı tuttuğu; hekim göz kapaklarını açmaya çalıştığında ise aktif olarak direnç gösterdiği (Epilepside gözler açıktır!) saptandı.",
            "Nöbet esnasında dil ısırma, idrar kaçırma veya siyanoz (morarma) olmadığı; nöbet biter bitmez postiktal konfüzyon yaşamadan hemen ağlayarak konuşmaya başladığı görüldü.",
            "Altın standart tanı testi olan Eşzamanlı Video-EEG monitörizasyonunda, hasta tam nöbet geçirip sarsılırken beyin dalgalarının tamamen normal uyanıklık alfa ritminde olduğu (epileptik deşarj olmadığı) ve serum Prolaktin/CK düzeylerinin yükselmediği kanıtlandı.",
            "Ruhsal Durum Muayenesinde: Bastırılmış aile içi çatışma ve duygusal stresi bedensel nöbet üzerinden ifade etme (birincil kazanç); hastanın nöbetleri bilerek/numaradan yapmadığı (bilinçdışı konversiyon) doğrulandı.",
            "DSM-5'e göre: Nörolojik epilepsi ile bağdaşmayan, Video-EEG'de normal beyin aktivitesi gösteren ve psikolojik stresörlerle tetiklenen Konversiyon Bozukluğu (Ataklar ya da Nöbetlerle Giden / PNES) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "nöbet boyunca gözlerini sımsıkı kapalı tuttuğu; hekim göz kapaklarını açmaya çalıştığında ise aktif olarak direnç gösterdiği",
                "dsmMatch": "DSM-5 Kriter B: Gerçek epilepsiyle bağdaşmayan klinik bulgu (Zorlu göz kapatma)"
            },
            {
                "clueIndex": 3,
                "text": "Eşzamanlı Video-EEG monitörizasyonunda, hasta tam nöbet geçirip sarsılırken beyin dalgalarının tamamen normal uyanıklık alfa ritminde olduğu",
                "dsmMatch": "Altın Standart Tanı: Video-EEG'de nöbet anında epileptiform deşarj olmaması (PNES)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "PNES Odaklı Bilişsel Davranışçı Terapi (Codes / Goldstein Protokolü)",
            "therapyDetails": "Tanıyı yargılamadan 'Beynin aşırı stres altında donanım arızası değil, yazılımsal kilitlenme yaşıyor' şeklinde empatik açıklama, gereksiz antiepileptik ilaçları kademeli kesme ve duygusal çatışmaları sözel ifade etme eğitimi.",
            "pharmacologyNote": "Antiepileptik ilaçlar PNES'te etkisizdir ve kesilmelidir; eşlik eden depresyon veya anksiyete için SSRI başlanabilir."
        },
        "miniQuiz": {
            "question": "Gerçek bir Epilepsi (Grand Mal / Tonik-Klonik) nöbeti ile Konversiyon Bozukluğuna bağlı Psödonöbeti (PNES) birbirinden kesin olarak ayıran altın standart tanı yöntemi ve tipik fizik muayene bulgusu nedir?",
            "options": [
                "Video-EEG'de nöbet anında epileptik dalga olmaması ve hastanın nöbet sırasında gözlerini sımsıkı kapatıp açılmasına direnç göstermesi",
                "Hastanın nöbet sırasında dilini yan taraftan ısırması",
                "Nöbetin uykuda tek başınayken olması",
                "Nöbet sonrası 1 saat süren derin postiktal uyku"
            ],
            "correctIndex": 0,
            "explanation": "Gerçek tonik-klonik epilepsi nöbetinde gözler açıktır, EEG'de diken-dalga deşarjı vardır ve postiktal konfüzyon görülür. PNES'te ise gözler sımsıkı kapalıdır, baş sağa-sola sallanır ve Video-EEG'de normal uyanıklık alfa ritmi izlenir."
        },
        "differentialDiagnosis": "• Gerçek Epilepsi: Gözler açıktır, dil ısırılır, idrar kaçırılır, uykuda da olur ve Video-EEG'de epileptiform deşarj görülür.\n• Temarruz (Malingering): Kişi askerlikten/hapisten kaçmak için bilinçli rol yapar; PNES'te ise süreç bilinçdışıdır.",
        "dsmCriteriaSummary": "DSM-5: İstemsiz motor/duyusal nöbetler + Video-EEG ile epilepsi dışlanması + Nörolojik uyumsuzluk kanıtı.",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Aile tartışmaları ve sınav stresiyle ortaya çıkan, yere yavaşça kayma ve asenkron çırpınmalarla giden nöbetler istemli motor işlevde değişikliktir.",
                "Kapalı ve açılmaya direnen gözler, iki yana baş sallama, dil ısırma ve postiktal konfüzyon olmaması epilepsiyle uyumsuz olumlu bulgulardır.",
                "Nöbet sırasında video-EEG'nin normal kalması ve prolaktin ile CK'nin yükselmemesi tanıyı doğrular; nöbetler bilerek üretilmiyor."
            ],
            "whyNot": [
                {
                    "diagnosisId": "factitious_disorder",
                    "reason": "Nöbetleri bilerek ürettiğine ya da hasta rolü aradığına dair kanıt yoktur."
                },
                {
                    "diagnosisId": "panic_disorder",
                    "reason": "Stres altında ortaya çıksa da tablo korku ve otonom belirtilerle giden ataklar değil, motor nöbetlerdir."
                },
                {
                    "diagnosisId": "other_specified_dissociative",
                    "reason": "Belirtiler bilinç ya da kimlikte değil, motor işlevdedir; bu tablo DSM-5-TR'de işlevsel nörolojik belirti (konversiyon) bozukluğu içinde ‘atak ya da nöbetlerle’ belirteciyle sınıflanır."
                }
            ],
            "teachingPoint": "PNES'te gözlerin kapalı olması, asenkron hareketler ve nöbet sonrası konfüzyonun olmaması yararlı ipuçlarıdır; kesin tanı nöbetin video-EEG ile kaydedilmesiyle konur."
        }
    },
    {
        "id": "case-130",
        "caseNumber": 130,
        "difficulty": "İleri Düzey",
        "course": "FORENSIC",
        "diagnosisId": "factitious_another",
        "therapyId": "supportive_psychotherapy",
        "category": "SOMATIC",
        "patientSummary": "31 yaşında, kadın, 4 yaşında bir çocuk annesi",
        "clues": [
            "31 yaşındaki anne, 4 yaşındaki oğlunu son 1 yıl içinde tekrarlayan 'açıklanamayan kanlı ishal, hipoglisemi koması ve yüksek ateş' şikayetleriyle 6 farklı üniversite hastanesine yatırdı; hastane personeli anneyi 'çocuğunun başından bir saniye bile ayrılmayan, tıbbi terimleri çok iyi bilen fedakar ve melek gibi bir anne' olarak tanımlıyordu.",
            "Çocuğun tüm genetik, metabolik ve enfeksiyöz tetkikleri normal çıkmasına rağmen sadece annenin odada yalnız kaldığı saatlerde çocuğun kan şekerinin aniden 25 mg/dL'ye düştüğü ve bezinde kan görüldüğü fark edildi.",
            "Yoğun bakım odasındaki güvenlik kamerası incelendiğinde, annenin çantasından çıkardığı insülin kalemini gizlice çocuğun damar yoluna enjekte ettiği ve kendi parmağını iğneyle delip çocuğun dışkı kabına kendi kanını damlattığı şok edici bir şekilde görüntülendi.",
            "Annenin bu eylemden hiçbir maddi tazminat, miras veya dışsal kazanç elde etmediği; tek motivasyonunun doktorlardan ve çevreden 'kahraman, acılı anne' ilgisi ve şefkati toplamak olduğu saptandı.",
            "Anne odadan uzaklaştırılıp çocuk devlet korumasına alındığı andan itibaren çocuğun tüm hipoglisemi ve kanama atakları tamamen kesildi.",
            "DSM-5'e göre: Dışsal bir ödül olmaksızın bir başkasında (genellikle kendi çocuğunda) kasıtlı olarak hastalık belirtileri üretme ve onu hasta/mağdur olarak sunma ile karakterize Başkasına Yüklenen Yapay Bozukluk (Münchausen by Proxy) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 2,
                "text": "annenin çantasından çıkardığı insülin kalemini gizlice çocuğun damar yoluna enjekte ettiği",
                "dsmMatch": "DSM-5 Kriter A: Bir başkasında kasıtlı olarak fiziksel/ruhsal hastalık üretme ve sahtekarlık"
            },
            {
                "clueIndex": 3,
                "text": "hiçbir maddi tazminat, miras veya dışsal kazanç elde etmediği; tek motivasyonunun doktorlardan ve çevreden 'kahraman, acılı anne' ilgisi",
                "dsmMatch": "DSM-5 Kriter C: Dışsal kazanç yokluğunda psikolojik ilgi/bakım rolü arzusu"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Acil Çocuk Koruma Bildirimi (Adli Müdahale) & Uzun Süreli Psikoterapi",
            "therapyDetails": "İlk ve zorunlu adım çocuğun hayati tehlikesi nedeniyle derhal Sosyal Hizmetler / Adli makamlara bildirim yapılarak çocuğun anneden ayrılmasıdır; ardından anneye kişilik/travma odaklı psikoterapi uygulanır.",
            "pharmacologyNote": "DSM-5'e göre tanı kurban olan çocuğa değil, FAİL olan anneye/bakımverene ('Başkasına Yüklenen Yapay Bozukluk') konur; çocuk ise 'Fiziksel Çocuk İstismarı' koduyla korunur."
        },
        "miniQuiz": {
            "question": "DSM-5'e göre Münchausen by Proxy (Başkasına Yüklenen Yapay Bozukluk) vakasında psikiyatrik tanı kime konulur ve hekimin yapması gereken İLK ZORUNLU eylem nedir?",
            "options": [
                "Tanı çocuğa değil FAİL olan bakımverene (anneye) konur; ilk zorunlu adım ise ölümcül çocuk istismarı nedeniyle çocuğu korumaya alıp adli bildirim yapmaktır.",
                "Tanı sadece küçük çocuğa konur ve çocuk taburcu edilir.",
                "Anneye ödül verilip eve gönderilir.",
                "Hiçbir bildirim yapılmadan sadece çocuğa antidepresan başlanır."
            ],
            "correctIndex": 0,
            "explanation": "Münchausen by Proxy'de mortalite (çocuğun ölümü) oranı %6-10 gibi çok yüksek bir düzeydedir. DSM-5'te tanı fail olan ebeveyne konur ve hekimin ilk görevi çocuğu derhal koruma altına almaktır."
        },
        "differentialDiagnosis": "• Pediatrik Hastalık Kaygısı: Ebeveyn çocuğun hasta olduğundan gerçekten korkar ancak çocuğa gizlice ilaç/zehir vererek hastalık ÜRETMEZ.\n• Temarruz (Malingering): Çocuğu hasta göstererek devletten maaş veya tazminat alma (maddi çıkar) amacı vardır.",
        "dsmCriteriaSummary": "DSM-5: Başka birinde (çocukta) kasıtlı hastalık üretme + Onu hasta/yaralı olarak sunma + Dışsal maddi çıkar olmaması (Tanı faile konur).",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Annenin çocuğa gizlice insülin enjekte etmesi ve kendi kanını çocuğun dışkısına damlatması, belirtilerin bir başkasında bilerek üretildiğinin kamera kaydıyla gösterilmiş kanıtıdır.",
                "Çocuğu 6 hastanede yineleyen yatışlarla hasta olarak sunmuştur; belirtiler yalnızca anne yalnız kaldığında ortaya çıkmış ve ayrıldıktan sonra tamamen kesilmiştir.",
                "Maddi bir çıkar yoktur; amaç ‘kahraman anne’ olarak ilgi ve takdir görmektir. Tanı faile, yani anneye konur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "factitious_disorder",
                    "reason": "Belirtiler annenin kendi bedeninde değil çocuğun bedeninde üretilmektedir."
                },
                {
                    "diagnosisId": "illness_anxiety_disorder",
                    "reason": "Kaygılı ebeveyn çocuğunun hasta olmasından korkar ama hastalık üretmez; burada belirtiler bilerek yaratılmıştır."
                },
                {
                    "diagnosisId": "antisocial_pd",
                    "reason": "Ağır bir istismar söz konusudur, ancak amaç çıkar değil hasta rolü üzerinden ilgi görmektir ve genel bir hak ihlali örüntüsü tarif edilmiyor."
                }
            ],
            "teachingPoint": "Belirtilerin yalnızca belirli bir bakım verenin yanında ortaya çıkıp ondan ayrılınca kaybolması, başkasına yüklenen yapay bozukluğun en güçlü klinik işaretidir."
        }
    },
    {
        "id": "case-131",
        "caseNumber": 131,
        "difficulty": "Orta",
        "course": "CHILD",
        "diagnosisId": "rumination_disorder",
        "therapyId": "habit_reversal",
        "category": "EATING",
        "patientSummary": "9 yaşında, erkek, ilkokul öğrencisi",
        "clues": [
            "9 yaşındaki erkek çocuk, son 4 aydır her yemekten 15-20 dakika sonra yuttuğu yiyecekleri hiçbir mide bulantısı, öğürme veya iğrenme olmaksızın zahmetsizce ağzına geri getirdiği (regürjitasyon), ağzında tekrar çiğneyip yeniden yuttuğu için pediatri tarafından yönlendirildi.",
            "Diş hekimi muayenesinde mide asidinin sürekli ağza gelmesine bağlı diş minesinde erozyon ve kronik ağız kokusu (halitozis) saptanmış; sınıf arkadaşları bu kokudan dolayı çocukla alay etmeye başlamıştır.",
            "Çocuğun bu davranışı özellikle ders çalışırken, sıkıldığında veya stres altındayken karın kaslarını ritmik olarak kasarak kendini rahatlatmak için yaptığı gözlemlendi.",
            "Pediatrik gastroenteroloji tarafından yapılan özofagogastroduodenoskopi, pH-metri ve baryumlu grafide gastroözofageal reflü (GÖRH), akalazya veya pilor stenozu tamamen dışlanmıştır.",
            "Ruhsal Durum Muayenesinde: Kilo alma korkusu veya beden algısı bozukluğu olmaksızın, öğrenilmiş diyafram/karın kası kasılmasıyla giden alışkanlık niteliğinde regürjitasyon saptandı.",
            "DSM-5'e göre: En az 1 ay boyunca, tıbbi bir reflü hastalığı veya anoreksiya/bulimiya olmaksızın yutulan yiyeceklerin öğürme olmadan tekrarlı biçimde ağza geri getirilip yeniden çiğnenmesi/yutulması ile karakterize Geri Çıkarma (Ruminasyon) Bozukluğu tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "yuttuğu yiyecekleri hiçbir mide bulantısı, öğürme veya iğrenme olmaksızın zahmetsizce ağzına geri getirdiği (regürjitasyon), ağzında tekrar çiğneyip yeniden yuttuğu",
                "dsmMatch": "DSM-5 Kriter A: Yiyeceklerin öğürme olmadan ağza geri getirilip tekrar çiğnenmesi"
            },
            {
                "clueIndex": 3,
                "text": "gastroözofageal reflü (GÖRH), akalazya veya pilor stenozu tamamen dışlanmıştır",
                "dsmMatch": "DSM-5 Kriter B: Bağlantılı bir mide-bağırsak hastalığının dışlanması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Alışkanlığı Tersine Çevirme Eğitimi (HRT) & Diyafram Nefesi",
            "therapyDetails": "Yemeklerden hemen sonra karın kaslarını kasma dürtüsü geldiğinde, regürjitasyonla fiziksel olarak bağdaşmayan 'yarışan tepki' olarak yavaş ve derin diyafram (karın) nefesi alma egzersizi uygulama.",
            "pharmacologyNote": "İlaç tedavisi ilk basamak değildir; yemek sonrası sakız çiğneme ve diyafram nefesi biofeedback eğitimiyle %85 üzerinde tam düzelme sağlanır."
        },
        "miniQuiz": {
            "question": "Geri Çıkarma (Ruminasyon) Bozukluğunda yemek sonrası yiyeceğin ağza geri gelmesini engellemek için kullanılan en etkili kanıta dayalı davranışçı teknik (yarışan tepki) nedir?",
            "options": [
                "Diyafram Nefesi Eğitimi (Habit Reversal / Karın duvarı kasılmasını diyafram solunumuyla bloke etme)",
                "Çocuğa ceza verip odasına kilitleme",
                "Yüksek doz antipsikotik verme",
                "Mide küçültme ameliyatı"
            ],
            "correctIndex": 0,
            "explanation": "Ruminasyon karın duvarı kaslarının bilinçdışı kasılmasıyla oluşur. Yemekten sonra 30 dakika boyunca yapılan derin diyafram solunumu (Habit Reversal) bu kasılmayı fiziksel olarak imkansız kılar."
        },
        "differentialDiagnosis": "• Bulimiya Nervoza: Kişi kilo almamak için parmağını boğazına sokup öğürerek kusar; Ruminasyonda ise kilo kaygısı ve öğürme yoktur, yiyecek tekrar çiğnenip yutulur.\n• Gastroözofageal Reflü (GÖRH): İstemsiz asit kaçışıdır, pH-metri ile ayrılır.",
        "dsmCriteriaSummary": "DSM-5: En az 1 ay boyunca yiyeceklerin öğürme/bulantı olmadan ağza geri getirilmesi (yeniden çiğnenmesi/yutulması) + Reflü ve diğer yeme bozukluklarının dışlanması.",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Dört aydır her yemekten sonra yiyeceği öğürme ya da bulantı olmadan ağza getirip yeniden çiğneme ve yutma, tekrarlayan geri çıkarma davranışıdır ve bir ay ölçütünü aşar.",
                "Davranışın sıkılma ve stres anlarında, karın kaslarını kasarak rahatlamak için yapılması öğrenilmiş bir alışkanlık niteliğindedir.",
                "Reflü, akalazya ve pilor darlığı ayrıntılı incelemeyle dışlanmıştır; kilo kaygısı ve beden algısı bozukluğu yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "bulimia_nervosa",
                    "reason": "Kilo almamak için kusma yoktur; yiyecek öğürmeden ağza gelir ve yeniden yutulur, tıkınma nöbetleri de tarif edilmiyor."
                },
                {
                    "diagnosisId": "arfid",
                    "reason": "Belirli yiyeceklerden kaçınma ya da kısıtlama değil, yenen yiyeceğin tekrar ağza getirilmesi söz konusudur."
                },
                {
                    "diagnosisId": "anorexia_nervosa",
                    "reason": "Düşük kilo, kilo alma korkusu ve beden algısı bozukluğu yoktur."
                }
            ],
            "teachingPoint": "Ruminasyonu kusmadan ayıran, yiyeceğin zahmetsizce ve öğürmeden ağza gelmesi ve çoğunlukla yeniden çiğnenip yutulmasıdır."
        }
    },
    {
        "id": "case-132",
        "caseNumber": 132,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "other_specified_feeding",
        "therapyId": "cbt_e",
        "category": "EATING",
        "patientSummary": "37 yaşında, erkek, banka çalışanı",
        "clues": [
            "37 yaşındaki danışan, sabahları uyandığında midesinin tamamen kilitlendiğini ve öğleden sonra saat 14:00'e kadar tek lokma bile yiyemediğini (sabah anoreksisi); ancak akşam yemeğinden sonra ve gece uykusundan uyanarak günlük kalorisinin yarısından fazlasını tükettiğini belirterek başvurdu.",
            "Her gece saat 01:30 ve 04:00 civarında uykusundan tam bilinci açık olarak uyandığını ve mutfağa gidip ekmek arası kaşar, makarna veya tatlı yemeden kesinlikle tekrar uykuya dalamadığını ifade etti.",
            "Uyurgezerlikten (uykuyla ilişkili yeme bozukluğu) farklı olarak, gece mutfakta ne yediğinin tamamen farkında olduğunu ve sabah uyandığında yediği her şeyi net bir şekilde hatırladığını belirtti.",
            "Tıkınırcasına Yeme Bozukluğundan farklı olarak, gece yediği porsiyonların devasa boyutlarda olmadığı, ancak gece boyunca sık sık atıştırma şeklinde sürdüğü ve 'Yemezsem sabaha kadar uyuyamam' inancının hakim olduğu saptandı.",
            "Ruhsal Durum Muayenesinde: Yeme sirkadiyen ritminin geceye kayması, akşam saatlerinde kötüleşen duygudurum ve uyku-yeme şartlanması gözlendi.",
            "DSM-5 (Tanımlanmış Diğer Beslenme ve Yeme Bozukluğu) kriterlerine göre: Akşam yemeğinden sonra aşırı yeme (günlük gıdanın >%25'i) ve/veya gece uykudan uyanıp bilinçli olarak yeme ataklarıyla seyreden Gece Yeme Sendromu tablosudur; DSM-5-TR'de 'Belirlenmiş Diğer Bir Beslenme ve Yeme Bozukluğu' örneğidir."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "uykusundan tam bilinci açık olarak uyandığını ve mutfağa gidip ekmek arası kaşar, makarna veya tatlı yemeden kesinlikle tekrar uykuya dalamadığını",
                "dsmMatch": "DSM-5 Belirteç: Gece uykudan uyanıp yemek yeme ve yemeden uyuyamama inancı"
            },
            {
                "clueIndex": 2,
                "text": "gece mutfakta ne yediğinin tamamen farkında olduğunu ve sabah uyandığında yediği her şeyi net bir şekilde hatırladığını",
                "dsmMatch": "DSM-5 Farkındalık Kriteri: Gece yeme ataklarının bilincinde olma ve hatırlama"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Geliştirilmiş BDT (CBT-E) & Sirkadiyen Beslenme Düzenlemesi",
            "therapyDetails": "Sabah kahvaltısını kademeli olarak başlatma, kalori alımını gündüz saatlerine kaydırma, 'Yemezsem uyuyamam' bilişsel çarpıtmasını kırma ve mutfak uyaran kontrolü.",
            "pharmacologyNote": "Sertralin (SSRI) ve Melatonerjik ajanlar gece uyanıp yeme ataklarını azaltmada klinik çalışmalarda en güçlü kanıta sahip ilaçlardır."
        },
        "miniQuiz": {
            "question": "Gece Yeme Sendromunu (Night Eating Syndrome), NREM parasomnisi olan 'Uykuyla İlişkili Yeme Bozukluğu'ndan (SRED) ayıran en kritik kriter nedir?",
            "options": [
                "Gece Yeme Sendromunda kişinin bilinci tam açıktır ve sabah ne yediğini tamamen hatırlar; SRED'de ise kişi uyurgezer halde bilinçsizce (hatta çiğ et/sigara külü gibi tuhaf şeyleri) yer ve sabah hatırlamaz.",
                "Gece Yeme Sendromunda kişinin sabahları çok büyük kahvaltı yapması",
                "SRED hastalarının hiç uyumaması",
                "Gece Yeme Sendromunun sadece çocuklarda görülmesi"
            ],
            "correctIndex": 0,
            "explanation": "DSM-5'e göre Gece Yeme Sendromunda farkındalık ve anımsama tamdır (kişi uyanıp bilinçli yer). NREM parasomnisi olan SRED'de ise kişi uyurgezerdir ve sabah mutfağı dağılmış bulup ne yediğini hatırlamaz."
        },
        "differentialDiagnosis": "• Uykuyla İlişkili Yeme Bozukluğu (SRED): Uyurgezerlik (NREM) sırasında bilinçsiz yeme ve sabah amnezisi vardır.\n• Tıkınırcasına Yeme Bozukluğu (BED): Gündüz veya akşam tek oturuşta çok büyük miktarda gıda tüketilir, gece uykudan uyanma şart değildir.",
        "dsmCriteriaSummary": "DSM-5: Gece uykudan uyanıp yeme veya akşam yemeğinden sonra günlük kalorinin >%25'ini alma + Bilincin açık olması ve hatırlama + Sabah iştahsızlığı.",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Sabahları öğlene kadar hiç yiyememe ve günlük kalorinin yarısından fazlasını akşam yemeğinden sonra ve gece alması gece yeme sendromunun özelliğidir.",
                "Gece uykudan tam bilinçle uyanıp yemek yemeden tekrar uyuyamaması ve yediklerini sabah hatırlaması, yemenin bilinçli olduğunu gösterir.",
                "Porsiyonlar tıkınma düzeyinde değildir; tablo hiçbir özgül yeme bozukluğunun ölçütünü karşılamadığı için ‘belirlenmiş diğer’ olarak kodlanır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "binge_eating",
                    "reason": "Kısa sürede çok büyük miktarda yeme ve kontrol kaybı nöbetleri değil, gece boyu atıştırma şeklinde yeme vardır."
                },
                {
                    "diagnosisId": "nrem_sleep_arousal",
                    "reason": "Gece yeme sırasında bilinç tamamen açıktır ve sabah amnezi yoktur; uykuyla ilişkili yeme bozukluğunda ise kişi yediğini hatırlamaz."
                },
                {
                    "diagnosisId": "insomnia_disorder",
                    "reason": "Gece uyanmaları var, ancak tablo yemek yeme dürtüsü ve yemeden uyuyamama inancı etrafında örgütlenmiştir; uykusuzluk tek başına sorunun merkezinde değildir."
                }
            ],
            "teachingPoint": "Gece yemenin farkındalıkla mı yoksa uyku sırasında amnezi ile mi olduğunu sor: bilinçli ise gece yeme sendromu, amnezi varsa uykuyla ilişkili yeme bozukluğu düşünülür."
        }
    },
    {
        "id": "case-133",
        "caseNumber": 133,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "other_specified_feeding",
        "therapyId": "cbt_e",
        "category": "EATING",
        "patientSummary": "29 yaşında, kadın, pilates eğitmeni",
        "clues": [
            "29 yaşındaki danışan, son 1.5 yıldır yalnızca 'yüzde yüz saf, organik, çiğ ve işlenmemiş' gıdalar tüketme takıntısı nedeniyle besin çeşitliliğini sadece 6 sebze ve tohuma indirdiği, B12/demir eksikliği anemisi ve aşırı halsizlik geliştirdiği için başvurdu.",
            "Gününün 5 saatini gıdaların tarım ilacı (pestisit) oranlarını, pişirme derecelerini ve ambalaj materyallerini araştırmakla geçirmekte; plastik kaba değmiş veya 42 derecenin üzerinde ısınmış hiçbir besini 'toksik ve kirli' olduğu gerekçesiyle ağzına sürmemektedir.",
            "Arkadaşlarıyla ve ailesiyle dışarıda yemek yemeyi tamamen bıraktığı, annesinin pişirdiği çorbadan bir kaşık içtiğinde 'Bedenimi kirlettim, saflığımı bozdum' diyerek yoğun suçluluk ve panik yaşadığı, ardından 2 gün detoks açlığı yaptığı öğrenildi.",
            "Anoreksiya Nervozadan farklı olarak danışanın zayıflama, kalori sayma veya kilo verme gibi bir hedefinin OLMADIĞI; temel kaygısının bedensel ağırlık değil, yiyeceğin 'saflığı ve kusursuz sağlığı' olduğu saptandı.",
            "Ruhsal Durum Muayenesinde: Besinlerin saflığına dair katı ve obsesif kurallar, kurallara uymayanlara karşı ahlaki üstünlük hissi, diyet ihlalinde yoğun suçluluk ve sosyal izolasyon gözlendi.",
            "Klinik psikiyatri ve DSM-5 Yeme/OKB spektrumuna göre: Yiyeceğin miktarından ziyade 'kalitesi ve saflığı' üzerine patolojik saplantı, katı diyet kısıtlamaları, malnütrisyon ve sosyal işlev kaybıyla seyreden Ortoreksiya Nervoza tablosudur; ortoreksiya DSM-5-TR'de ayrı bir tanı olmadığından bu tablo 'Belirlenmiş Diğer Bir Beslenme ve Yeme Bozukluğu' olarak kodlanır."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "yalnızca 'yüzde yüz saf, organik, çiğ ve işlenmemiş' gıdalar tüketme takıntısı",
                "dsmMatch": "Klinik Tanım: Sağlıklı ve saf beslenme üzerine patolojik obsesyon (Ortoreksiya)"
            },
            {
                "clueIndex": 3,
                "text": "zayıflama, kalori sayma veya kilo verme gibi bir hedefinin OLMADIĞI; temel kaygısının bedensel ağırlık değil, yiyeceğin 'saflığı ve kusursuz sağlığı' olduğu",
                "dsmMatch": "Ayırıcı Tanı: Anoreksiyadaki nicelik (miktar/kilo) odaklılıktan nitelik (saflık) odaklılığıyla ayrımı"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Geliştirilmiş BDT (CBT-E) & Besin Maruziyeti (ERP)",
            "therapyDetails": "Yiyecekleri 'saf/kutsal' ve 'zehirli/kirli' olarak ikiye bölen bilişsel çarpıtmaları esnetme, 'yasaklı' gıdalara kademeli maruz bırakma ve öz-değeri diyet kurallarından ayrıştırma.",
            "pharmacologyNote": "Eşlik eden yoğun obsesif-kompulsif kaygı ve katılık varlığında SSRI grubu antidepresanlar (Fluoksetin, Sertralin) kullanılabilir."
        },
        "miniQuiz": {
            "question": "Ortoreksiya Nervoza ile Anoreksiya Nervoza arasındaki en temel bilişsel odak farkı nedir?",
            "options": [
                "Anoreksiyada odak yiyeceğin 'miktarı/kalorisi' ve zayıf kalmaktır; Ortoreksiyada ise odak yiyeceğin 'kalitesi/saflığı' ve bedeni toksinlerden koruma takıntısıdır.",
                "Ortoreksiyada hastalar sadece fast-food ve şeker tüketir.",
                "Anoreksiyada hastalar kilo almaya çalışır.",
                "Ortoreksiya sadece 70 yaş üstü erkeklerde görülür."
            ],
            "correctIndex": 0,
            "explanation": "Anoreksiya Nervoza nicelik (kalori, gramaj, zayıflık) odaklıdır; Steven Bratman'ın tanımladığı Ortoreksiya Nervoza ise nitelik (organiklik, saflık, temiz içerik) odaklı obsesif bir kısıtlamadır."
        },
        "differentialDiagnosis": "• Anoreksiya Nervoza: Çarpık beden algısı ve kilo alma korkusu vardır.\n• ARFID: Yiyeceğin dokusu/kokusuna duyusal hassasiyet veya boğulma korkusu vardır, ideolojik 'temiz beslenme' üstünlüğü yoktur.",
        "dsmCriteriaSummary": "Klinik Kriterler: Sağlıklı/saf besinlere patolojik saplantı + Diyet ihlalinde yoğun suçluluk + Besin gruplarını eleme sonucu malnütrisyon ve sosyal izolasyon.",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Yalnızca ‘saf ve işlenmemiş’ yiyecekleri yeme kuralıyla besin çeşitliliğini altı ürüne indirmesi ve B12/demir eksikliği geliştirmesi, beslenme davranışında belirgin bir bozulmadır.",
                "Günde beş saat besin araştırması, kural ihlalinde yoğun suçluluk ve ardından ‘detoks’ açlığı ile sosyal yemeklerden çekilme klinik önemde sıkıntı ve işlev kaybını gösterir.",
                "Zayıflama hedefi ve kilo korkusu yoktur; ortoreksiya ayrı bir tanı olmadığından tablo ‘belirlenmiş diğer’ olarak kodlanır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "anorexia_nervosa",
                    "reason": "Kısıtlamanın amacı kilo vermek değil yiyeceğin saflığıdır; kilo alma korkusu ve beden algısı bozukluğu yoktur."
                },
                {
                    "diagnosisId": "arfid",
                    "reason": "Kaçınma yiyeceğin dokusu, kokusu ya da boğulma korkusundan değil, ideolojik saflık ve sağlık kurallarından kaynaklanır."
                },
                {
                    "diagnosisId": "ocd",
                    "reason": "Katı kurallar ve suçluluk obsesif özellik taşır, ancak tüm uğraş beslenme etrafında döner ve kişi kurallarını benimsemektedir; farklı temalarda obsesyonlar varsa OKB ayrıca değerlendirilmelidir."
                }
            ],
            "teachingPoint": "Ortoreksiyada odak yiyeceğin miktarı ya da kilo değil kalitesi ve saflığıdır; ciddi beslenme eksikliği ve işlev kaybı varsa ‘belirlenmiş diğer beslenme ve yeme bozukluğu’ olarak kodlanır."
        }
    },
    {
        "id": "case-134",
        "caseNumber": 134,
        "difficulty": "Kolay",
        "course": "CHILD",
        "diagnosisId": "enuresis",
        "therapyId": "habit_reversal",
        "category": "ELIMINATION",
        "patientSummary": "7 yaşında, erkek, ilkokul 2. sınıf öğrencisi",
        "clues": [
            "7 yaşındaki erkek çocuk, bebekliğinden beri gece uykusunda altını ıslatmasının hiç kesilmemesi (primer/birincil) ve son 6 aydır haftada 4-5 gece yatağını sırılsıklam yapması nedeniyle ailesi tarafından getirildi.",
            "Gündüz okulda veya evde uyanıkken tuvalet kontrolünün tamamen normal olduğu, ancak gece uykusunun çok ağır olduğu ve mesanesi dolduğunda uyanamayıp uykusunda idrarını kaçırdığı öğrenildi.",
            "Okulun düzenlediği 3 günlük izcilik kampına 'Arkadaşlarım bez bağladığımı veya yatağı ıslattığımı görürse rezil olurum' diyerek gitmeyi reddettiği ve özgüveninin ciddi biçimde sarsıldığı belirtildi.",
            "Pediatrik nefroloji ve üroloji muayenesinde idrar yolu enfeksiyonu, diyabet (DM/DI), spina bifida veya anatomik mesane patolojisi saptanmamıştır; babasının da 9 yaşına kadar gece altını ıslattığı (güçlü genetik öykü) öğrenildi.",
            "Ruhsal Durum Muayenesinde: Kronolojik ve gelişimsel yaşı 5'in üzerinde olan çocukta, utanç duygulanımı ve derin uyku uyanma eşiği yüksekliğine bağlı yalnız gece (nokturnal) enürezis saptandı.",
            "DSM-5'e göre: En az 5 yaşındaki bir çocukta, en az 3 ay boyunca haftada en az 2 kez ortaya çıkan, tıbbi bir duruma bağlı olmayan istemsiz gece idrar kaçırma (Enürezis - Yalnızca Gece) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "son 6 aydır haftada 4-5 gece yatağını sırılsıklam yapması",
                "dsmMatch": "DSM-5 Kriter A, B & C: ≥5 yaş, en az 3 ay boyunca haftada ≥2 kez idrar kaçırma"
            },
            {
                "clueIndex": 1,
                "text": "Gündüz okulda veya evde uyanıkken tuvalet kontrolünün tamamen normal olduğu",
                "dsmMatch": "DSM-5 Belirteç: Yalnızca Gece (Monosemptomatik Enürezis Nokturna)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Enürezis Alarm Cihazı (Zil ve Ped / Klasik Koşullanma) & Takvim Yöntemi",
            "therapyDetails": "İlk damla idrar geldiğinde çalan nem sensörlü Enürezis Alarmı ile dolu mesane duyumunu uyanma refleksiyle şartlandırma, akşam sıvı kısıtlaması, gece uyandırıp tuvalete götürme ve Kuru Geceler (Güneş) ödül takvimi.",
            "pharmacologyNote": "En yüksek kalıcı başarı ve en düşük nüks oranı Enürezis Alarmındadır; kamp/yatılı misafirlik gibi acil durumlarda veya alarma dirençte oral Desmopressin (DDAVP - sentetik ADH) veya İmipramin kullanılır."
        },
        "miniQuiz": {
            "question": "DSM-5'e göre bir çocuğa 'Enürezis' (Altını Islatma) tanısı konulabilmesi için çocuğun takvim/gelişim yaşı EN AZ kaç olmalı ve altın standart, nüks oranı en düşük davranışçı tedavisi nedir?",
            "options": [
                "En az 5 yaş olmalı; altın standart ve en kalıcı tedavisi klasik koşullanmaya dayanan 'Enürezis Alarmı' (Zil ve Ped) yöntemidir.",
                "En az 2 yaş olmalı; tedavisi çocuğu azarlamaktır.",
                "En az 12 yaş olmalı; tedavisi elektroşoktur.",
                "En az 1 yaş olmalı; tedavisi ömür boyu antibiyotiktir."
            ],
            "correctIndex": 0,
            "explanation": "DSM-5'e göre Enürezis tanısı için alt yaş sınırı 5'tir (en az 3 ay boyunca haftada en az 2 kez). Klasik koşullanma prensibiyle çalışan Enürezis Alarmı en yüksek kür ve en düşük nüks oranına sahip birinci basamak tedavidir."
        },
        "differentialDiagnosis": "• Diyabetes Mellitus / İnsipidus ve İYE: Poliüri ve dizüri eşlik eder; tam idrar tetkiki ve kan şekeri ile dışlanır.\n• Epilepsi: Gece nöbetlerine bağlı idrar kaçırma olabilir ancak sabah dil ısırma ve kas ağrısı görülür.",
        "dsmCriteriaSummary": "DSM-5: Yaş ≥ 5 + En az 3 ay boyunca haftada ≥ 2 kez yatak/giysi ıslatma + Organik nedenlerin (İYE, diyabet) dışlanması.",
        "pharmacologyId": "desmopressin_enuresis",
        "explanation": {
            "whyThis": [
                "Yedi yaşında, son altı aydır haftada 4-5 gece yatağı ıslatması yaş, sıklık ve süre ölçütlerini (en az 5 yaş, üç ay boyunca haftada en az iki kez) karşılar.",
                "Gündüz kontrolü normaldir ve ıslatma yalnızca uykuda olur; bu ‘yalnızca gece’ tipine, bebeklikten beri hiç kuru dönem olmaması birincil enürezise uyar.",
                "Kamptan kaçınma ve özgüven kaybı belirgin sıkıntıyı gösterir; enfeksiyon, diyabet ve anatomik nedenler dışlanmıştır ve aile öyküsü güçlüdür."
            ],
            "whyNot": [
                {
                    "diagnosisId": "encopresis",
                    "reason": "Kaçırılan şey dışkı değil idrardır."
                },
                {
                    "diagnosisId": "social_anxiety",
                    "reason": "Kamp korkusu genel bir değerlendirilme kaygısından değil, gece ıslatmanın fark edilmesi korkusundan kaynaklanır; bu enürezisin bir sonucudur."
                },
                {
                    "diagnosisId": "nrem_sleep_arousal",
                    "reason": "Derin uyku ve uyanamama ortak olsa da yataktan kalkma ya da karmaşık davranışlar tarif edilmiyor; sorun mesane doluluğuna uyanamamaktır."
                }
            ],
            "teachingPoint": "Birincil enürezis (hiç kuru dönem olmaması) ile ikincil enürezis (en az birkaç ay kuru dönem sonrası başlama) ayrımı, olası nedenler ve stresörler açısından yön gösterir."
        }
    },
    {
        "id": "case-135",
        "caseNumber": 135,
        "difficulty": "Orta",
        "course": "CHILD",
        "diagnosisId": "encopresis",
        "therapyId": "parent_training",
        "category": "ELIMINATION",
        "patientSummary": "6.5 yaşında, erkek, ilkokul 1. sınıf öğrencisi",
        "clues": [
            "6.5 yaşındaki erkek çocuk, son 5 aydır haftada 3-4 kez okulda ve evde iç çamaşırına sıvı-çamur kıvamında dışkı kaçırdığı ve kirli çamaşırlarını utancından yatağının altına sakladığı için annesi tarafından getirildi.",
            "Annesi aslında çocuğun ishal olduğunu sanmaktadır; ancak ayrıntılı öyküde çocuğun 6 ay önce sert dışkılama sırasında makatında oluşan ağrılı bir çatlak (anal fissür) yüzünden tuvalete gitmekten korktuğu ve köşelere saklanıp bacaklarını çaprazlayarak kakasını günlerce tuttuğu öğrenildi.",
            "Batın grafisi ve pediatrik muayenede rektumun taşlaşmış dev bir dışkı kitlesiyle (fekalom) tamamen tıkandığı, yukarıdan gelen yeni sıvı dışkının ise bu sert tıkaç etrafından sızarak çocuğun haberi bile olmadan iç çamaşırına aktığı (Paradoksal İshal / Taşma İnkontinansı) tespit edildi.",
            "Kronik rektal genişleme nedeniyle çocuğun rektal doluluk hissini ve kaka kokusunu artık algılayamadığı (olfaktör/duyusal alışma); Hirschsprung hastalığı veya spina bifida olmadığı doğrulandı.",
            "Ruhsal Durum Muayenesinde: Ebeveynlerin 'Bilerek tembelliğinden altına yapıyor' diyerek çocuğu cezalandırmasına bağlı yoğun utanç, düşük benlik saygısı ve tuvalet fobisi saptandı.",
            "DSM-5'e göre: En az 4 yaşındaki bir çocukta, en az 3 ay boyunca ayda en az 1 kez uygunsuz yerlere dışkı kaçırma ile karakterize Enkoprezis (Kabızlık ve Taşma İnkontinansı ile Giden) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 2,
                "text": "rektumun taşlaşmış dev bir dışkı kitlesiyle (fekalom) tamamen tıkandığı",
                "dsmMatch": "DSM-5 Belirteç: Kabızlık ve Taşma İnkontinansı ile Giden Enkoprezis (%80-90 en sık tip)"
            },
            {
                "clueIndex": 4,
                "text": "Ebeveynlerin 'Bilerek tembelliğinden altına yapıyor' diyerek çocuğu cezalandırmasına bağlı yoğun utanç",
                "dsmMatch": "Klinik Psiko-eğitim: Sızıntının kasıtlı değil, fizyolojik taşma olduğunun aileye anlatılması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Davranışsal Tuvalet Eğitimi, Ebeveyn Psiko-eğitimi & Medikal Boşaltım",
            "therapyDetails": "Aileye çocuğun bunu bilerek yapmadığını (taşma mekanizmasını) çizerek anlatıp cezaları derhal durdurma; her ana yemekten 15 dakika sonra (gastrokolik refleks) çocuğu ayaklarının altına tabure koyarak 5-10 dakika tuvalete oturtma ve Yıldız Tablosu ile ödüllendirme.",
            "pharmacologyNote": "Önce lavman/polietilen glikol (PEG) ile taşlaşmış dışkı tıkacının (fekalom) boşaltılması ve rektum çapı normale dönene kadar dışkı yumuşatıcı idame tedavisi şarttır."
        },
        "miniQuiz": {
            "question": "Enkoprezis vakalarının %85'ini oluşturan 'Retansiyonlu (Kabızlık ve Taşma İnkontinansı ile Giden) Enkoprezis'te, çocuğun iç çamaşırına sürekli sıvı dışkı bulaşmasının (ailenin ishal sanmasının) gerçek mekanizması nedir?",
            "options": [
                "Rektumu tıkayan sertleşmiş dev dışkı kitlesinin (fekalom) etrafından üstteki sıvı dışkının istemsizce sızması (Taşma İnkontinansı / Overflow Incontinence)",
                "Çocuğun kolera enfeksiyonu geçirmesi",
                "Çocuğun annesinden intikam almak için bilerek su içmesi",
                "Bağırsakların normalden 10 kat hızlı çalışması"
            ],
            "correctIndex": 0,
            "explanation": "Enkopreziste çocuk ağrılı dışkılama korkusuyla kakasını tutar; rektumda taşlaşmış fekalom oluşur ve rektal duyu kaybolur. Üstten gelen sıvı dışkı bu tıkacın yanından sızar (paradoksal ishal / taşma inkontinansı)."
        },
        "differentialDiagnosis": "• Hirschsprung Hastalığı (Aganglionik Megakolon): Doğumdan itibaren mekonyum çıkaramama vardır, iç çamaşırına sızıntı/kirlenme olmaz; biyopsi ile ayrılır.\n• KOKGB: Nadir olan 'kabızlık olmayan' tipte kasıtlı dışkı sürme görülebilir.",
        "dsmCriteriaSummary": "DSM-5: Yaş ≥ 4 + En az 3 ay boyunca ayda ≥ 1 kez uygunsuz yerlere dışkılama (En sık: Kabızlık ve Taşma İnkontinansı ile giden tip).",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Altı buçuk yaşında, beş aydır haftada 3-4 kez iç çamaşırına dışkı kaçırması yaş (en az 4), sıklık (ayda en az bir) ve süre (en az üç ay) ölçütlerini karşılar.",
                "Ağrılı fissür sonrası dışkıyı tutma, rektumda fekalom ve tıkaç çevresinden sızan sıvı dışkı ‘kabızlık ve taşma inkontinansı ile’ alt tipini gösterir.",
                "Hirschsprung ve spina bifida dışlanmıştır; kaçırma kasıtlı değildir ve çocuk durumu utancından gizlemektedir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "odd",
                    "reason": "Kaçırma kasıtlı bir karşı gelme davranışı değil, kabızlığa bağlı istemsiz bir sızıntıdır; çocuk utanç duyup saklamaktadır."
                },
                {
                    "diagnosisId": "enuresis",
                    "reason": "Kaçırılan şey idrar değil dışkıdır."
                },
                {
                    "diagnosisId": "specific_phobia",
                    "reason": "Tuvalet korkusu ağrılı fissürden sonra gelişmiş ve dışkı tutmaya yol açmıştır; ancak tablonun tamamı enkoprezisi oluşturur, fobi ayrı bir tanı gerektirecek kadar bağımsız değildir."
                }
            ],
            "teachingPoint": "Enkopreziste ‘ishal’ yakınması çoğu zaman taşma inkontinansıdır; önce kabızlık ve fekalom araştırılmalı, ebeveynlere davranışın kasıtlı olmadığı anlatılmalıdır."
        }
    },
    {
        "id": "case-137",
        "caseNumber": 137,
        "difficulty": "Kolay",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "restless_legs_syndrome",
        "therapyId": "cbt_i",
        "category": "SLEEP",
        "patientSummary": "44 yaşında, kadın, muhasebeci",
        "clues": [
            "44 yaşındaki danışan, son 6 aydır her akşam koltuğa uzandığında veya gece yatağa girdiğinde baldırlarının derinliklerinde 'karıncalanma, çekilme, ürperme ve içsel bir kaşıntı' hissi başladığını ve bacaklarını hareket ettirmek için karşı konulamaz bir dürtü duyduğunu belirterek başvurdu.",
            "Bu rahatsız edici duyumların gündüz yürürken veya çalışırken hiç olmadığını, yalnızca dinlenme/hareketsizlik sırasında başladığını ve özellikle akşam/gece saatlerinde zirve yaptığını anlattı.",
            "Yataktan kalkıp odanın içinde yürüdüğünde veya bacaklarını gerdiğinde bu huzursuzluğun anında geçtiğini, ancak tekrar yatağa uzandığında birkaç dakika içinde yeniden başladığını ve bu yüzden saat 03:00'e kadar uyuyamadığını söyledi.",
            "Laboratuvar tetkiklerinde Serum Ferritin düzeyinin 11 ng/mL (ciddi demir deposu eksikliği) olduğu saptandı; ayrıca yakın zamanda başlanan Mirtazapin ve antihistaminik kullanımının tabloyu şiddetlendirdiği belirlendi.",
            "Ruhsal Durum ve Uyku Muayenesinde: Uykuya dalma güçlüğüne (initial insomni) ve gündüz tükenmişliğine yol açan sirkadiyen sensorimotor hareket bozukluğu (Willis-Ekbom hastalığı) doğrulandı.",
            "DSM-5'e göre: En az 3 aydır haftada en az 3 kez ortaya çıkan, dinlenmeyle başlayan, hareketle düzelen ve akşam/gece kötüleşen bacakları hareket ettirme dürtüsüyle karakterize Huzursuz Bacaklar Sendromu tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "yalnızca dinlenme/hareketsizlik sırasında başladığını ve özellikle akşam/gece saatlerinde zirve yaptığını",
                "dsmMatch": "DSM-5 Kriter A1 & A3: Dinlenmeyle başlama ve akşam/gece saatlerinde kötüleşme"
            },
            {
                "clueIndex": 2,
                "text": "Yataktan kalkıp odanın içinde yürüdüğünde veya bacaklarını gerdiğinde bu huzursuzluğun anında geçtiğini",
                "dsmMatch": "DSM-5 Kriter A2: Hareket ettirmeyle kısmen ya da tamamen rahatlama"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Demir Replasmanı, Tetikleyici İlaç Kesimi & BDT-I / Dopaminerjik Tedavi",
            "therapyDetails": "Kafein, alkol, antihistaminik ve serotonerjik/antidopaminerjik ilaçların kesilmesi, uyku hijyeni, akşam ılık bacak banyosu/masajı ve demir depolarının (Ferritin > 75 ng/mL) doldurulması.",
            "pharmacologyNote": "Ferritin < 75 ng/mL ise ilk basamak Demir + C vitamini replasmanıdır; medikal tedavide Alfa-2-delta ligandları (Pregabalin, Gabapentin) veya düşük doz Dopamin Agonistleri (Pramipeksol, Ropinirol) kullanılır."
        },
        "miniQuiz": {
            "question": "Huzursuz Bacaklar Sendromu (Willis-Ekbom) olan bir hastada ilk bakılması gereken laboratuvar parametresi hangisidir ve hangi psikiyatrik durumla en sık karıştırılır?",
            "options": [
                "Serum Ferritin (Demir deposu) düzeyi; en sık antipsikotik yan etkisi olan 'Akatizi' ile karıştırılır (Akatizi gece-gündüz sürer ve yürümekle tam geçmez).",
                "Sadece Kalsiyum düzeyi; şizofreni ile karıştırılır.",
                "Amilaz düzeyi; uyurgezerlikle karıştırılır.",
                "B12 düzeyi; narkolepsi ile karıştırılır."
            ],
            "correctIndex": 0,
            "explanation": "Beyinde dopamin sentezi yapan tirozin hidroksilaz enziminin kofaktörü demirdir; bu nedenle Ferritin düşüklüğü HBS'nin en önemli nedenidir. Akatiziden farkı; HBS'nin sadece akşam/dinlenmede olması ve yürüyünce anında geçmesidir."
        },
        "differentialDiagnosis": "• İlacın Yol Açtığı Akatizi: Antipsikotik/SSRI sonrası gelişir, akşam sirkadiyen ritmi yoktur (gündüz de aynıdır) ve yürümekle bacaklardaki his kaybolmaz.\n• Periferik Nöropati / Venöz Yetmezlik: Yürümekle anında rahatlama özelliği yoktur.",
        "dsmCriteriaSummary": "DSM-5 (URGE Kısaltması): U (Urge to move: Bacağı hareket ettirme dürtüsü) + R (Rest: Dinlenmede başlar) + G (Gets better with movement: Yürümekle geçer) + E (Evening: Akşam/gece kötüleşir).",
        "pharmacologyId": "pramipexole_gabapentin_rls",
        "explanation": {
            "whyThis": [
                "Baldırlarda karıncalanma ve çekilme ile bacakları hareket ettirmek için karşı konulamaz dürtü tanının çekirdek ölçütüdür.",
                "Duyumlar yalnızca dinlenme ve hareketsizlik sırasında başlar, yürümekle hemen geçer ve akşam-gece kötüleşir; bu üç özellik birlikte aranır.",
                "Altı aydır süren tablo uykuya dalma güçlüğü ve gündüz tükenmişliğine yol açmıştır; düşük ferritin ve mirtazapin ile antihistaminik kullanımı ağırlaştırıcı etkenlerdir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "insomnia_disorder",
                    "reason": "Uykuya dalma güçlüğü bacaklardaki dürtüden kaynaklanıyor; uykusuzluk başka bir uyku bozukluğuyla açıklandığı için ayrı tanı gerekmez."
                },
                {
                    "diagnosisId": "gad",
                    "reason": "Huzursuzluk zihinsel bir kuruntu değil, bacaklarda yerleşik bedensel bir dürtüdür ve hareketle anında geçer."
                },
                {
                    "diagnosisId": "substance_induced_anxiety",
                    "reason": "İlaçlar tabloyu ağırlaştırmış olsa da belirtiler akatizi ya da kaygı değil, akşam belirginleşen ve hareketle geçen tipik huzursuz bacak örüntüsüdür."
                }
            ],
            "teachingPoint": "Huzursuz bacaklar sendromunda ferritin düzeyine ve mirtazapin, antihistaminik, bazı antidepresanlar gibi ağırlaştırıcı ilaçlara mutlaka bakılmalıdır."
        }
    },
    {
        "id": "case-138",
        "caseNumber": 138,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "nrem_sleep_arousal",
        "therapyId": "safety_clonazepam",
        "category": "SLEEP",
        "patientSummary": "23 yaşında, erkek, mimarlık öğrencisi",
        "clues": [
            "23 yaşındaki danışan, son 4 aydır uykuya daldıktan yaklaşık 1-1.5 saat sonra (gecenin ilk üçte birlik diliminde) yatağından kalkıp evin içinde dolaştığı ve geçen gece dış kapıyı açıp apartman merdivenlerinden inerken ev arkadaşı tarafından yakalandığı için başvurdu.",
            "Ev arkadaşı, bu ataklar sırasında danışanın gözlerinin açık ancak cam gibi boş ve donuk bir ifadeye sahip olduğunu, kendisine seslenildiğinde cevap vermediğini ve uyandırılmasının neredeyse imkansız olduğunu anlattı.",
            "Sabah uyandığında gece yataktan kalktığına veya merdivenlere indiğine dair HİÇBİR ŞEY hatırlamadığı (tam amnezi) ve rüya da görmediği öğrenildi.",
            "Mimarlık jüri teslimleri nedeniyle yaşadığı ağır uyku yoksunluğunun atakları tetiklediği; polisomnografide (PSG) atakların REM uykusunda değil, NREM Evre 3 (derin yavaş dalga / delta uykusu) sırasında ortaya çıktığı doğrulandı.",
            "Ruhsal Durum Muayenesinde: Gündüz psikiyatrik muayenesi tamamen normal; NREM derin uykusundan kortikal tam uyanma olmadan motor aktivasyonla giden parasomni saptandı.",
            "DSM-5'e göre: Gecenin ilk üçte birinde NREM uykusundan uyanma, yataktan kalkıp yürüme, boş bakışlar, uyandırılma güçlüğü ve sabah tam amnezi ile karakterize NREM Uykusundan Uyanma Bozukluğu (Uyurgezerlik Tipi) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "uykuya daldıktan yaklaşık 1-1.5 saat sonra (gecenin ilk üçte birlik diliminde) yatağından kalkıp evin içinde dolaştığı",
                "dsmMatch": "DSM-5 Kriter A: Gecenin ilk üçte birinde NREM derin uykusunda yataktan kalkıp yürüme"
            },
            {
                "clueIndex": 1,
                "text": "gözlerinin açık ancak cam gibi boş ve donuk bir ifadeye sahip olduğunu",
                "dsmMatch": "DSM-5 Kriter A1: Boş ve dik gözlerle bakma, uyandırılma güçlüğü ve sabah amnezisi"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Yatak Odası/Ev Güvenlik Protokolü, Uyku Hijyeni & Düşük Doz Klonazepam",
            "therapyDetails": "Balkon ve dış kapıların kilitlenmesi, kapılara zil/alarm takılması, merdiven başlarına güvenlik kapısı konulması, uyku yoksunluğunun önlenmesi ve atak sırasında hastayı sarsarak uyandırmak yerine sakin bir sesle yatağına yönlendirme.",
            "pharmacologyNote": "Yaralanma riski taşıyan yetişkin uyurgezerliğinde NREM Evre 3 uyanma dalgalanmalarını baskılamak için gece yatmadan önce düşük doz Klonazepam birinci basamak medikal tedavidir."
        },
        "miniQuiz": {
            "question": "Uyurgezerlik (Somnambulizm) ile REM Uykusu Davranış Bozukluğu (RBD) arasındaki en temel polisomnografik ve klinik fark nedir?",
            "options": [
                "Uyurgezerlik gecenin ilk 1/3'ünde NREM Evre 3 (derin yavaş dalga) uykusunda olur, gözler açıktır ve sabah rüya hatırlanmaz; RBD ise gecenin son 1/3'ünde REM uykusunda olur, gözler kapalıdır ve hasta gördüğü kabusları hatırlar.",
                "Uyurgezerlik sadece 70 yaş üstü Parkinson hastalarında görülür.",
                "Uyurgezerlikte hasta sabah her adımı saniyesi saniyesine hatırlar.",
                "RBD'de hasta mutfağa gidip yemek pişirir."
            ],
            "correctIndex": 0,
            "explanation": "Uyurgezerlik bir NREM Evre 3 (delta uykusu) parasomnisidir; uykunun ilk 1-2 saatinde olur, gözler boş bakar ve sabah tam amnezi vardır. RBD ise sabaha karşı REM uykusunda olur ve hasta gördüğü aksiyon rüyasını hatırlar."
        },
        "differentialDiagnosis": "• REM Uykusu Davranış Bozukluğu (RBD): Sabaha karşı olur, yumruk/tekme atma vardır ve uyandırıldığında rüyasını anlatır.\n• Dissosiyatif Füg: Uyanıkken gerçekleşir ve günler sürebilir; uyurgezerlik ise uykuda dakikalar sürer.",
        "dsmCriteriaSummary": "DSM-5: Uyku döneminin ilk 1/3'ünde NREM'den uyanıp yürüme + Boş bakışlar ve uyandırılma güçlüğü + Sabah epizoda dair tam amnezi.",
        "pharmacologyId": "clonazepam_parasomnia",
        "explanation": {
            "whyThis": [
                "Uykuya daldıktan 1-1,5 saat sonra yataktan kalkıp evde dolaşması, gecenin ilk üçte birinde NREM uykusundan tamamlanmamış uyanma ile karmaşık davranıştır.",
                "Açık ama boş bakan gözler, seslenmeye yanıtsızlık ve uyandırılma güçlüğü uyurgezerlik epizodunun tipik özelliğidir.",
                "Sabah tam amnezi ve rüya görmeme ile polisomnografide olayların NREM evre 3'te kaydedilmesi tanıyı doğrular; uyku yoksunluğu tetikleyicidir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "rem_sleep_behavior_disorder",
                    "reason": "Olaylar REM'de ve sabaha karşı değil, derin NREM'de ve gecenin başında olmaktadır; rüya hatırlanmaz."
                },
                {
                    "diagnosisId": "dissociative_amnesia",
                    "reason": "Füg epizodları uyanıkken olur ve günler sürebilir; burada epizodlar uykudan çıkarken olur ve dakikalarla sınırlıdır, kimlik kaybı ve amaçlı uzun seyahat yoktur."
                },
                {
                    "diagnosisId": "nightmare_disorder",
                    "reason": "Kabus bozukluğunda kişi REM uykusundan tam uyanır, yönelimlidir ve rüyayı hatırlar; burada rüya hatırlanmaz ve kişi uyandırılamaz."
                }
            ],
            "teachingPoint": "Uyurgezerlik ve gece terörü aynı tanının (NREM uykusundan uyanma bozukluğu) iki tipidir; ikisinde de olaylar gecenin ilk üçte birinde olur ve sabah hatırlanmaz."
        }
    },
    {
        "id": "case-139",
        "caseNumber": 139,
        "difficulty": "Orta",
        "course": "CHILD",
        "diagnosisId": "nrem_sleep_arousal",
        "therapyId": "cbt_i",
        "category": "SLEEP",
        "patientSummary": "6 yaşında, erkek, anaokulu öğrencisi",
        "clues": [
            "6 yaşındaki erkek çocuk, son 3 aydır uykuya daldıktan yaklaşık 60-90 dakika sonra (gecenin ilk üçte birinde) aniden kulakları sağır eden dehşet verici bir çığlıkla yatağında doğrulduğu için korku içindeki anne-babası tarafından getirildi.",
            "Ebeveynleri odaya koştuklarında çocuğun gözlerinin kocaman açık olduğunu, kalbinin dakikada 150 atacak gibi çarptığını, sırılsıklam terlediğini, hızlı nefes aldığını ve pupillalarının genişlediğini (yoğun otonomik deşarj) anlattı.",
            "Anne-babası çocuğa sarılıp 'Korkma yavrum, biz buradayız' diyerek teselli etmeye çalıştığında çocuğun anne-babasını tanımadığı, onları iterek çırpındığı (avutulamama / inconsolability) ve 10 dakika sonra aniden derin uykuya geri daldığı öğrenildi.",
            "Ertesi sabah uyandığında neşesinin yerinde olduğu, gece çığlık attığını veya herhangi bir korkutucu rüya/kabus gördüğünü KESİNLİKLE hatırlamadığı (tam amnezi) saptandı.",
            "Ruhsal Durum ve Nörolojik Muayenede: EEG'de nokturnal frontal lob epilepsisi dışlanmış; NREM Evre 3 (yavaş dalga) uykusundan kısmi otonomik uyanmayla seyreden Pavor Nocturnus tespit edilmiştir.",
            "DSM-5'e göre: Gecenin ilk üçte birinde NREM uykusundan panik çığlığıyla uyanma, yoğun otonomik uyarılma, başkalarının avutma çabalarına yanıtsızlık ve sabah tam amnezi ile karakterize NREM Uykusundan Uyanma Bozukluğu (Uyku Terörü Tipi) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "uykuya daldıktan yaklaşık 60-90 dakika sonra (gecenin ilk üçte birinde) aniden kulakları sağır eden dehşet verici bir çığlıkla",
                "dsmMatch": "DSM-5 Kriter A: Gecenin ilk 1/3'ünde NREM uykusundan panik çığlığıyla uyanma"
            },
            {
                "clueIndex": 2,
                "text": "anne-babasını tanımadığı, onları iterek çırpındığı (avutulamama / inconsolability)",
                "dsmMatch": "DSM-5 Kriter A2 & B: Avutma çabalarına yanıtsızlık ve sabah rüya/olay amnezisi"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Planlı Uyandırma Tekniği (Scheduled Awakenings) & Aile Psiko-eğitimi",
            "therapyDetails": "Aileye atak sırasında çocuğu zorla uyandırmamaları (uyandırmaya çalışmak atağı uzatır ve ajitasyonu artırır) gerektiğini anlatma; atağın her gece geldiği saatten 15-20 dakika önce çocuğu nazikçe hafif uyandırıp NREM döngüsünü sıfırlama (Planlı Uyandırma).",
            "pharmacologyNote": "Çocukluk çağında gelişimsel olarak kendiliğinden geçtiği için ilaç nadiren gerekir; çok ağır vakalarda kısa süreli düşük doz benzodiazepin kullanılabilir."
        },
        "miniQuiz": {
            "question": "Çocuklarda sık karışan 'Uyku Terörü' (Pavor Nocturnus - NREM) ile 'Kabus Bozukluğu' (Nightmare - REM) arasındaki en temel klinik farklar nelerdir?",
            "options": [
                "Uyku Terörü gecenin ilk 1/3'ünde (NREM) çığlık ve terlemeyle olur, çocuk anne-babasını tanımaz (avutulamaz) ve sabah hiçbir şey hatırlamaz; Kabusta ise çocuk sabaha karşı (REM) uyanır, hemen bilinci açılır, rüyasını ayrıntılı anlatır ve annesine sarılarak sakinleşir.",
                "Uyku teröründe çocuk gördüğü rüyayı 2 sayfa resim çizerek anlatır.",
                "Kabusta çocuk uyurgezerlik yapar ve sabah hiçbir şey hatırlamaz.",
                "İkisi de tamamen aynı uyku evresinde olur."
            ],
            "correctIndex": 0,
            "explanation": "Uyku terörü (NREM Evre 3) gecenin ilk saatlerinde olur, otonomik fırtına vardır, çocuk avutulamaz ve sabah tam amnezi vardır. Kabus (REM) ise gecenin son üçte birinde olur, çocuk uyanınca oryantedir ve rüyasını hatırlar."
        },
        "differentialDiagnosis": "• Kabus Bozukluğu: Sabaha karşı (REM) olur, otonomik deşarj hafiftir, uyanınca bilinci tam açılır ve korkunç rüyayı hatırlar.\n• Nokturnal Epilepsi: Stereotipik tonik/distonik postürler vardır, gündüz de nöbet olabilir.",
        "dsmCriteriaSummary": "DSM-5: Gecenin ilk 1/3'ünde panik çığlığıyla uyanma + Taşikardi/terleme/midriyazis + Avutulamama + Sabah tam amnezi.",
        "pharmacologyId": "clonazepam_parasomnia",
        "explanation": {
            "whyThis": [
                "Uykuya daldıktan 60-90 dakika sonra dehşet çığlığıyla ani uyanma, gecenin ilk üçte birinde NREM uykusundan kısmi uyanmayı gösterir.",
                "Hızlı kalp atımı, terleme, hızlı soluma ve geniş göz bebekleri yoğun otonom uyarılmadır.",
                "Avutma çabalarına yanıt vermemesi, ebeveynlerini tanımaması ve sabah olayı ya da bir rüyayı hiç hatırlamaması tipiktir; EEG epilepsiyi dışlamıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "nightmare_disorder",
                    "reason": "Kabuslar REM uykusunda, gecenin ikinci yarısında olur; çocuk uyanınca tam yönelimlidir ve rüyayı hatırlar."
                },
                {
                    "diagnosisId": "separation_anxiety",
                    "reason": "Ebeveynlerine yönelmiyor, aksine onları tanımıyor ve itiyor; ayrılık korkusu ya da gündüz ayrılık belirtileri tarif edilmiyor."
                },
                {
                    "diagnosisId": "panic_disorder",
                    "reason": "Gece panik atağında kişi tamamen uyanır, olanı hatırlar ve avutulabilir; burada ise sabah tam amnezi vardır."
                }
            ],
            "teachingPoint": "Gece teröründe (NREM uyanma bozukluğunun uyku terörü tipi) çocuk uyanık görünür ama avutulamaz ve sabah hatırlamaz; kabusta ise uyanınca hemen yönelimlidir ve rüyayı anlatabilir."
        }
    },
    {
        "id": "case-140",
        "caseNumber": 140,
        "difficulty": "Kolay",
        "course": "ADULT",
        "diagnosisId": "substance_induced_sexual_dysfunction",
        "therapyId": "sensate_focus",
        "category": "SEXUAL",
        "patientSummary": "33 yaşında, erkek, evli mühendis",
        "clues": [
            "33 yaşındaki evli danışan, 3 ay önce Yaygın Anksiyete Bozukluğu nedeniyle başlanan Paroksetin (SSRI) 20 mg/gün tedavisinden sonra kaygılarının tamamen geçtiğini; ancak son 2.5 aydır cinsel birleşme sırasında ne kadar uğraşırsa uğraşsın boşalamadığını (gecikmiş ejakülasyon / anorgazmi) ve cinsel isteğinin belirgin azaldığını belirterek başvurdu.",
            "İlacı kullanmaya başlamadan önce eşiyle tamamen sağlıklı, istekli ve doyurucu bir cinsel yaşamı olduğu; daha önce hayatında hiçbir zaman sertleşme veya boşalma sorunu yaşamadığı öğrenildi.",
            "Cinsel isteksizlik ve boşalamama sorununun hem eşiyle olan ilişkide hem de yalnız başına mastürbasyon sırasında (her koşulda / yaygın) aynı şekilde devam ettiği saptandı.",
            "Ürolojik muayene, total/serbest testosteron, prolaktin ve tiroid hormon düzeyleri tamamen normaldir; evlilik ilişkisinde bir çatışma yoktur.",
            "Ruhsal Durum Muayenesinde: Anksiyete semptomları tam remisyonda; ancak sinaptik aralıkta artan serotoninin 5-HT2A ve 5-HT2C reseptörlerini uyararak dopamin ve nitrik oksit yolaklarını baskılamasına bağlı iyatrojenik cinsel disfonksiyon saptandı.",
            "DSM-5'e göre: Bir ilacın (SSRI/SNRI) başlanmasından kısa süre sonra gelişen ve ilacın doğrudan fizyolojik etkileriyle açıklanan Maddenin/İlacın Yol Açtığı Cinsel İşlev Bozukluğu tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "cinsel birleşme sırasında ne kadar uğraşırsa uğraşsın boşalamadığını (gecikmiş ejakülasyon / anorgazmi)",
                "dsmMatch": "DSM-5 Kriter A & B: SSRI kullanımıyla doğrudan zamansal ilişkili anorgazmi/gecikmiş ejakülasyon"
            },
            {
                "clueIndex": 4,
                "text": "sinaptik aralıkta artan serotoninin 5-HT2A ve 5-HT2C reseptörlerini uyararak dopamin ve nitrik oksit yolaklarını baskılamasına bağlı",
                "dsmMatch": "Nörofarmakoloji: 5-HT2 reseptör uyarımına bağlı cinsel disfonksiyon mekanizması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Farmakolojik Antidot/Geçiş Stratejisi (Bupropion) & Çift Cinsel Terapisi",
            "therapyDetails": "Hastanın ilacı kendi başına aniden kesmesini önlemek, performans baskısını azaltmak için Sensate Focus ilkelerini paylaşmak ve cinsel yan etkisi olmayan antidepresana geçiş/ekleme yapmak.",
            "pharmacologyNote": "SSRI kaynaklı cinsel işlev bozukluğunda altın standart yönetim; tedaviye Bupropion (NDRI - dopamin/noradrenalin artırıcı) eklemek/geçmek veya Mirtazapin, Vortioksetin, Agomelatin gibi 5-HT2'yi bloke eden ajanlara geçmektir (Erkeklerde PDE-5 inhibitörü Sildenafil/Tadalafil de eklenebilir)."
        },
        "miniQuiz": {
            "question": "SSRI (özellikle Paroksetin, Sertralin, Fluoksetin) kullanımına bağlı gelişen Cinsel İşlev Bozukluğunu (anorgazmi, libido kaybı) düzeltmek için kullanılan ve cinsel yan etkisi EN DÜŞÜK olan antidepresan hangisidir?",
            "options": [
                "Bupropion (NDRI - Noradrenalin/Dopamin Geri Alım İnhibitörü) veya Mirtazapin / Vortioksetin",
                "Daha yüksek doz Paroksetin",
                "Haloperidol",
                "Risperidon"
            ],
            "correctIndex": 0,
            "explanation": "SSRI'lar 5-HT2 reseptörlerini uyararak dopamini baskılar ve %40-60 oranında anorgazmi/istek kaybı yapar. Bupropion serotonerjik etkisi olmadığı ve dopamini artırdığı için cinsel yan etki yapmaz, aksine SSRI kaynaklı cinsel disfonksiyonun antidotu olarak kullanılır."
        },
        "differentialDiagnosis": "• Birincil Geç Boşalma / Düşük İstek Bozukluğu: İlaç başlanmadan önce de vardır; burada ise semptomlar Paroksetin başlandıktan hemen sonra ortaya çıkmıştır.\n• Depresyona Bağlı Libido Kaybı: Hastanın depresyon/anksiyetesi düzeldiği halde cinsel sorun devam etmektedir.",
        "dsmCriteriaSummary": "DSM-5: İlaç/madde (özellikle SSRI, SNRI, antipsikotik) maruziyeti sonrası gelişen belirgin cinsel istek, uyarılma veya orgazm bozukluğu.",
        "pharmacologyId": "bupropion_ndri",
        "explanation": {
            "whyThis": [
                "Boşalamama ve cinsel istekte azalma paroksetin başlandıktan kısa süre sonra ortaya çıkmıştır; zamansal ilişki açıktır.",
                "İlaçtan önce hiçbir cinsel işlev sorunu yoktur ve SSRI'ların cinsel yan etkileri iyi bilinmektedir.",
                "Sorun partnerle ve mastürbasyonda aynı şekilde görülür; hormon düzeyleri normaldir, ilişki çatışması yoktur ve kaygı düzelmiştir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "delayed_ejaculation",
                    "reason": "Boşalma güçlüğü ilaç başlamadan önce yoktu ve ilacın etkisiyle açıklanıyor; birincil cinsel işlev bozukluğu tanısı konmaz."
                },
                {
                    "diagnosisId": "male_hypoactive_desire",
                    "reason": "İstek azalması da ilaçla eşzamanlı başlamıştır; ilaçtan bağımsız bir istek sorunu yoktur."
                },
                {
                    "diagnosisId": "mdd",
                    "reason": "Depresif belirti tarif edilmiyor ve kaygı düzelmiş olmasına rağmen cinsel sorun sürüyor; sorun ruhsal hastalığın değil ilacın etkisidir."
                }
            ],
            "teachingPoint": "Cinsel işlev sorununda ilk soru ilaç öyküsüdür; belirtiler ilaçla başladıysa ve her koşulda görülüyorsa maddenin yol açtığı cinsel işlev bozukluğu düşünülür."
        }
    },
    {
        "id": "case-141",
        "caseNumber": 141,
        "difficulty": "Zor",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "major_neurocognitive_lewy_body",
        "therapyId": "caregiver_behavioral",
        "category": "NEUROCOGNITIVE",
        "patientSummary": "71 yaşında, erkek, emekli albay",
        "clues": [
            "71 yaşındaki hasta, son 1 yıldır bilişsel durumunda garip bir dalgalanma olması (bazı saatler son derece uyanık, mantıklı ve zeki iken, birkaç saat sonra tamamen konfüze, dalgın ve uykulu hale gelmesi) nedeniyle ailesi tarafından getirildi.",
            "Salonda koltukta hiç kimse yokken 'Şu köşede kırmızı şapkalı iki küçük çocuk ve yerde yürüyen tüylü bir kedi var' diyerek son derece canlı, renkli ve ayrıntılı görsel halüsinasyonlar tarif ettiği öğrenildi.",
            "Son 6 aydır yürüyüşünün küçük adımlarla yavaşladığı, yüz ifadesinin donuklaştığı (spontan parkinsonizm) ve özgeçmişinde 5 yıldır uykusunda rüyalarını yumruk atarak canlandırdığı (REM Uykusu Davranış Bozukluğu - RBD) saptandı.",
            "Acil serviste halüsinasyonları için verilen 1 ampul Haloperidol (antipsikotik) sonrasında hastanın saatler içinde kaskatı kesildiği, yatağa bağımlı hale geldiği ve ağır bilinç bulanıklığı (şiddetli nöroleptik duyarlılığı) geliştirdiği görüldü.",
            "Ruhsal Durum ve Nörolojik Muayenede: Erken dönemde bellekten ziyade görsel-mekansal (saat çizme) ve yürütücü işlevlerde bozulma; DaTscan görüntülemede bazal ganglionlarda azalmış dopamin taşıyıcı tutulumu doğrulandı.",
            "DSM-5'e göre: Dalgalanan bilişsel işlevler, yineleyen ayrıntılı görsel varsanılar, spontan parkinsonizm, REM uykusu davranış bozukluğu ve ağır antipsikotik duyarlılığı ile karakterize Lewy Cisimcikli Majör Nörobilişsel Bozukluk tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "bilişsel durumunda garip bir dalgalanma olması",
                "dsmMatch": "DSM-5 Çekirdek Kriter 1: Dikkat ve uyanıklıkta belirgin dalgalanmalar (Fluktuasyon)"
            },
            {
                "clueIndex": 1,
                "text": "canlı, renkli ve ayrıntılı görsel halüsinasyonlar",
                "dsmMatch": "DSM-5 Çekirdek Kriter 2 & 3: Ayrıntılı görsel varsanılar ve spontan Parkinsonizm"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bakıcı Eğitimi, Çevresel Aydınlatma & Kolinesteraz İnhibitörü (Rivastigmin)",
            "therapyDetails": "Görsel halüsinasyonlarla tartışmak yerine dikkati dağıtma, akşam gölgelerini azaltmak için ev içi iyi aydınlatma, düşme önlemleri ve bakıcı desteği.",
            "pharmacologyNote": "Hem bilişsel dalgalanmaları hem de görsel halüsinasyonları düzeltmede ilk tercih Rivastigmin / Donepezil'dir. Tipik antipsikotikler (Haloperidol) ölümcül rijidite yaptığı için KESİNLİKLE KONTRENDİKEDİR (Gerekirse sadece çok düşük doz Ketiapin, Klozapin veya Pimavanserin verilir)."
        },
        "miniQuiz": {
            "question": "Lewy Cisimcikli Demans (DLB) tanı kriterlerinde yer alan 3 çekirdek klinik özellik ve bu hastalarda kullanımı ÖLÜMCÜL reaksiyonlara yol açabilen kontrendike ilaç grubu hangisidir?",
            "options": [
                "1) Bilişsel dalgalanma, 2) Canlı görsel halüsinasyonlar (küçük insan/hayvan), 3) Spontan Parkinsonizm; Tipik Antipsikotikler (Haloperidol) ağır nöroleptik duyarlılık yaptığı için kontrendikedir.",
                "Sadece yakın bellek kaybı; B12 vitamini kontrendikedir.",
                "Aşırı tatlı yeme ve küfür etme; Antidepresanlar kontrendikedir.",
                "Sadece yürüme apraksisi ve idrar kaçırma; Şant ameliyatı kontrendikedir."
            ],
            "correctIndex": 0,
            "explanation": "Lewy Cisimcikli Demansın 3 temel çekirdek bulgusu: Bilişsel dalgalanma, canlı görsel halüsinasyonlar ve parkinsonizmdir (RBD de eşlik eder). Bu hastalarda D2 reseptör blokajı yapan antipsikotikler (özellikle Haloperidol) ağır, geri dönüşsüz rijidite ve ölüme yol açabilir."
        },
        "differentialDiagnosis": "• Alzheimer Hastalığı: İlk bulgu yakın bellek kaybıdır; görsel halüsinasyon ve parkinsonizm ancak çok ileri (son) evrede görülür.\n• Parkinson Hastalığı Demansı (1 Yıl Kuralı): Önce Parkinson başlar, demans en az 1 yıl (çoğunlukla yıllar) sonra eklenirse Parkinson Demansı; demans ve parkinsonizm 1 yıl içinde birlikte başlarsa Lewy Cisimcikli Demans denir.",
        "dsmCriteriaSummary": "DSM-5: İlerleyici nörobilişsel yıkım + Çekirdek özellikler (Bilişsel dalgalanma, Canlı görsel halüsinasyonlar, Spontan Parkinsonizm) + Destekleyici özellikler (RBD, Ağır antipsikotik duyarlılığı).",
        "pharmacologyId": "cholinesterase_donepezil",
        "explanation": {
            "whyThis": [
                "Saatler içinde uyanıklık ve konfüzyon arasında gidip gelme, belirgin bilişsel dalgalanmadır.",
                "Yineleyen, canlı ve ayrıntılı görsel varsanılar, kendiliğinden gelişen parkinsonizm ve yıllar önce başlayan REM uykusu davranış bozukluğu tanının temel özellikleridir.",
                "Haloperidol sonrası ağır katılık ve bilinç bulanıklığı (nöroleptik duyarlılığı) ile DaTscan'de azalmış dopamin taşıyıcı tutulumu tanıyı destekler; erken bozulma bellekte değil görsel-mekânsal ve yürütücü işlevlerdedir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "major_neurocognitive_alzheimer",
                    "reason": "İlk ve baskın bozukluk yakın bellekte değil, görsel-mekânsal ve yürütücü işlevlerdedir; varsanı ve parkinsonizm erken dönemde ortaya çıkmıştır."
                },
                {
                    "diagnosisId": "major_neurocognitive_parkinson",
                    "reason": "Parkinsonizm bilişsel bozulmadan yıllar önce başlamamıştır; ikisi yaklaşık aynı dönemde ortaya çıktığı için Lewy cisimcikli tanı uygundur."
                },
                {
                    "diagnosisId": "delirium",
                    "reason": "Dalgalanma bir yıldır sürmektedir ve akut bir tıbbi neden bulunmamıştır; ancak haloperidol sonrası ağırlaşma deliryumu tetiklemiş olabilir."
                }
            ],
            "teachingPoint": "Dalgalanan biliş, görsel varsanılar ve parkinsonizmi olan yaşlı hastada antipsikotik duyarlılığı yüksektir; tipik antipsikotiklerden kaçınmak hayati önemdedir."
        }
    },
    {
        "id": "case-142",
        "caseNumber": 142,
        "difficulty": "İleri Düzey",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "major_neurocognitive_prion",
        "therapyId": "caregiver_behavioral",
        "category": "NEUROCOGNITIVE",
        "patientSummary": "62 yaşında, kadın, emekli memur",
        "clues": [
            "62 yaşındaki hasta, sadece 6 hafta öncesine kadar tamamen sağlıklı, araba kullanan ve hesap işlerini yürüten biriyken; son 1.5 ay içinde korkutucu bir hızla ilerleyen unutkanlık, kişilik değişimi, konuşma kaybı ve yürüme dengesizliği (ataksi) ile nöroloji-psikiyatri konseyine getirildi.",
            "Muayene sırasında odanın kapısı kapandığında veya el çırpıldığında hastanın tüm vücudunda ve kollarında ani, şimşek çakar tarzda istemsiz kas sıçramaları (irkilme miyoklonusu / startle myoclonus) olduğu gözlendi.",
            "Alzheimer gibi yıllar içinde değil, haftalar ve günler içinde gözlerinin önünde eriyen bu yıkıma görsel bozukluklar, paranoya ve ağır dezoryantasyonun eşlik ettiği öğrenildi.",
            "Kranial Difüzyon MRG'de bazal ganglionlarda (kaudat ve putamen) ve serebral kortekste karakteristik 'kortikal şeritlenme' (cortical ribboning / hokey sopası belirtisi) hiperintensitesi saptandı.",
            "Nörolojik ve Laboratuvar İncelemede: EEG'de saniyede 1 kez tekrarlayan karakteristik 'Periyodik Keskin Dalga Kompleksleri' (PSWC) ve BOS incelemesinde 14-3-3 proteini ile RT-QuIC testinin pozitif olduğu doğrulandı.",
            "DSM-5'e göre: Anormal katlanmış prion proteininin (PrPSc) beyinde süngerimsi (spongiform) yıkım yapması sonucu çok hızlı (haftalar/aylar içinde) ilerleyen demans, miyoklonus ve ataksi ile seyreden Prion Hastalığına Bağlı Majör Nörobilişsel Bozukluk (Creutzfeldt-Jakob) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "son 1.5 ay içinde korkutucu bir hızla ilerleyen unutkanlık, kişilik değişimi, konuşma kaybı ve yürüme dengesizliği (ataksi)",
                "dsmMatch": "DSM-5 Kriter A & B: Haftalar/aylar içinde çok hızlı ilerleyen yıkıcı demans"
            },
            {
                "clueIndex": 1,
                "text": "ani, şimşek çakar tarzda istemsiz kas sıçramaları (irkilme miyoklonusu / startle myoclonus)",
                "dsmMatch": "DSM-5 Kriter B: Prion hastalığının motor özellikleri (Miyoklonus ve ataksi)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Palyatif Bakım, Semptomatik Miyoklonus Kontrolü & Aile Desteği",
            "therapyDetails": "Hastalığın hızlı ve ölümcül seyri hakkında aileye şefkatli bilgilendirme, aşırı ses/ışık uyaranlarını azaltarak irkilme miyoklonuslarını önleme ve konfor odaklı palyatif bakım.",
            "pharmacologyNote": "Hastalığı durduran bir tedavi yoktur (genellikle 6-12 ay içinde ölümle sonuçlanır); ağrılı miyoklonik sıçramaları yatıştırmak için Klonazepam veya Levetirasetam/Valproat kullanılır."
        },
        "miniQuiz": {
            "question": "Yıllar içinde sinsi ilerleyen Alzheimer'dan farklı olarak, birkaç hafta/ay içinde hızla yıkıma götüren Creutzfeldt-Jakob Hastalığının (Prion Demansı) en karakteristik motor bulgusu ve BOS/EEG belirteci nedir?",
            "options": [
                "İrkilme Miyoklonusu (Startle Myoclonus) + EEG'de Periyodik Keskin Dalga Kompleksleri ve BOS'ta 14-3-3 proteini pozitifliği",
                "Sadece istirahat tremoru + Normal EEG",
                "Yıllar süren yavaş unutkanlık + Yüksek B12 düzeyi",
                "Sadece uyurgezerlik + BOS'ta hipokretin düşüklüğü"
            ],
            "correctIndex": 0,
            "explanation": "Creutzfeldt-Jakob Hastalığı (CJD), psikiyatride ve nörolojide en hızlı ilerleyen demanstır. Hızlı kognitif yıkım + Miyoklonus (özellikle sese karşı irkilme miyoklonusu) + Serebellar ataksi + EEG'de trifazik/periyodik keskin dalgalar ve BOS 14-3-3 proteini tanı koydurur."
        },
        "differentialDiagnosis": "• Otoimmün / Paraneoplastik Ensefalit (Anti-NMDA vb.): Hızlı ilerler ve miyoklonus yapabilir; tedavi edilebilir olduğu için mutlaka antikor paneli ile dışlanmalıdır.\n• Alzheimer / Lewy Cisimcikli Demans: Yıllar içinde yavaş ilerler.",
        "dsmCriteriaSummary": "DSM-5: Çok hızlı (haftalar-aylar içinde) ilerleyen nörobilişsel yıkım + Miyoklonus, ataksi veya kore + MRG (kortikal şeritlenme), EEG ve BOS (14-3-3 / RT-QuIC) kanıtı.",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Altı hafta içinde unutkanlık, kişilik değişikliği, konuşma kaybı ve ataksiyle gelişen çöküş, hızlı ilerleyen bir majör nörobilişsel bozukluktur.",
                "Ses ve dokunmayla tetiklenen irkilme miyoklonusu prion hastalığının tipik bulgusudur.",
                "Difüzyon MRG'de kortikal şeritlenme ve bazal ganglion sinyali, EEG'de periyodik keskin dalgalar ve BOS'ta 14-3-3 ile RT-QuIC pozitifliği tanıyı destekler."
            ],
            "whyNot": [
                {
                    "diagnosisId": "major_neurocognitive_alzheimer",
                    "reason": "Alzheimer yıllar içinde yavaş ilerler; haftalar içinde miyoklonus ve ataksiyle çöküş beklenmez."
                },
                {
                    "diagnosisId": "delirium",
                    "reason": "Hızlı bir bozulma var, ancak tablo dalgalanan bir dikkat bozukluğu değil, sürekli ilerleyen bir yıkımdır ve özgül prion bulguları vardır."
                },
                {
                    "diagnosisId": "major_neurocognitive_another_medical",
                    "reason": "Otoimmün ensefalit hızlı ilerleyen demansın tedavi edilebilir bir nedenidir; ancak RT-QuIC pozitifliği prion hastalığına özgüdür. Antikor paneli yine de dışlama için gereklidir."
                }
            ],
            "teachingPoint": "Haftalar-aylar içinde ilerleyen demans ve miyoklonusta prion hastalığını düşün, ama önce tedavi edilebilir otoimmün ve metabolik nedenleri dışla."
        }
    },
    {
        "id": "case-143",
        "caseNumber": 143,
        "difficulty": "Zor",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "major_neurocognitive_huntington",
        "therapyId": "caregiver_behavioral",
        "category": "NEUROCOGNITIVE",
        "patientSummary": "41 yaşında, erkek, öğretmen",
        "clues": [
            "41 yaşındaki erkek hasta, son 2 yıldır giderek artan aşırı sinirlilik, dürtüsel öfke patlamaları, okulda ders planlarını organize edememe (yürütücü işlev kaybı) ve ellerinde-yüzünde durduramadığı istemsiz kıvrılma/sıçrama hareketleri nedeniyle getirildi.",
            "Muayenede hastanın parmaklarında piyano çalar gibi, omuzlarında ve gövdesinde ise sanki dans ediyormuş gibi akan, düzensiz, istemsiz ve ani koreoatetoid hareketler (kore) olduğu; yürürken kollarını ve bacaklarını savurduğu gözlendi.",
            "Soygeçmişinde (aile öyküsünde) babasının ve halasının da 40'lı yaşlarda benzer istemsiz sıçrama hareketleri, ağır depresyon ve bunama geliştirerek 55 yaşında vefat ettikleri öğrenildi.",
            "Kranial MRG'de bazal ganglionlarda bilateral kaudat çekirdek başı atrofisinin yan ventriküllerin ön boynuzlarında 'kutu benzeri' genişlemeye (boxcar ventricles) yol açtığı; genetik testte 4. kromozomdaki HTT geninde 46 adet CAG trinükleotid tekrarı saptandı.",
            "Ruhsal Durum Muayenesinde: Bellekten önce işlem hızı ve yürütücü işlevlerin bozulduğu subkortikal demans, apati, irritabilite ve yüksek intihar riski tespit edildi.",
            "DSM-5'e göre: Otozomal dominant CAG trinükleotid tekrar artışına (Huntington gen mutasyonu) bağlı gelişen, ilerleyici yürütücü bilişsel yıkım, koreiform hareket bozukluğu ve psikiyatrik semptomlarla karakterize Huntington Hastalığına Bağlı Majör Nörobilişsel Bozukluk tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "sanki dans ediyormuş gibi akan, düzensiz, istemsiz ve ani koreoatetoid hareketler (kore)",
                "dsmMatch": "DSM-5 Kriter B: Huntington hastalığının karakteristik motor bulgusu (Kore)"
            },
            {
                "clueIndex": 3,
                "text": "4. kromozomdaki HTT geninde 46 adet CAG trinükleotid tekrarı saptandı",
                "dsmMatch": "DSM-5 Genetik ve Nörogörüntüleme Kriteri: Otozomal dominant HTT (CAG ≥36) mutasyonu ve kaudat atrofi"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Multidisipliner Bakım, Genetik Danışmanlık & VMAT2 İnhibitörü Tedavisi",
            "therapyDetails": "Yutma güçlüğü (disfaji) ve aspirasyon önlemleri, düşmeye karşı güvenli ev ortamı, öfke/depresyon yönetimi, intihar riski takibi ve aileye genetik danışmanlık.",
            "pharmacologyNote": "Koreiform hareketleri azaltmak için VMAT2 inhibitörleri (Tetrabenazin, Dötetrabenazin) veya atipik antipsikotikler (Olanzapin, Risperidon) kullanılır; depresyon ve irritabilite için SSRI eklenir."
        },
        "miniQuiz": {
            "question": "Otozomal dominant geçişli Huntington Hastalığının klasik klinik triadı (3'lüsü) ve beyin MR'ında atrofiye (küçülmeye) uğrayan karakteristik anatomik yapı hangisidir?",
            "options": [
                "Kore (dans benzeri istemsiz hareketler) + Yürütücü işlev kaybı/Demans + Psikiyatrik belirtiler (depresyon/psikoz/öfke); MR'da 'Kaudat Çekirdek' (Striatum) atrofisi görülür.",
                "Sadece görme kaybı + İşitme kaybı; MR'da oksipital lob büyümesi görülür.",
                "Sabah erken uyanma + Kilo alımı; MR tamamen normaldir.",
                "El yıkama takıntısı + Boğaz enfeksiyonu; MR'da hipofiz adenomu görülür."
            ],
            "correctIndex": 0,
            "explanation": "Huntington hastalığı 4. kromozomdaki CAG tekrar artışıyla (≥36 tekrar) oluşur; striatumdaki (özellikle kaudat çekirdek) GABAerjik orta boy dikenli nöronların yıkımı sonucu Kore, Subkortikal Demans ve ağır Psikiyatrik semptomlar (yüksek intihar oranı) gelişir."
        },
        "differentialDiagnosis": "• Tardif Diskinezi: Uzun süreli antipsikotik kullanım öyküsü vardır, ailevi otozomal dominant geçiş ve ilerleyici demans yoktur.\n• Wilson Hastalığı: Genç yaşta kore/distoni ve psikiyatrik belirti yapar; gözde Kayser-Fleischer halkası ve düşük seruloplazmin ile ayrılır.",
        "dsmCriteriaSummary": "DSM-5: Yürütücü işlevlerde ve işlem hızında ilerleyici yıkım + Koreiform motor bozukluk + Otozomal dominant aile öyküsü veya HTT (CAG) gen mutasyonu.",
        "pharmacologyId": "valbenazine_vmat2",
        "explanation": {
            "whyThis": [
                "İki yıldır ilerleyen yürütücü işlev kaybı ve işlem hızında yavaşlama, bellekten önce bozulan subkortikal tipte bir nörobilişsel bozukluktur.",
                "Parmaklarda, omuzlarda ve gövdede düzensiz akan istemsiz hareketler kore; irritabilite ve öfke patlamaları sık eşlik eden psikiyatrik belirtilerdir.",
                "Babada ve halada benzer tablo (otozomal baskın geçiş), kaudat atrofisi ve HTT geninde 46 CAG tekrarı tanıyı kesinleştirir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "intermittent_explosive",
                    "reason": "Öfke patlamaları kore, yürütücü işlev kaybı ve genetik bir nörodejeneratif hastalık zemininde ortaya çıkmıştır; bağımsız bir dürtü denetim bozukluğuyla açıklanmaz."
                },
                {
                    "diagnosisId": "major_neurocognitive_frontotemporal",
                    "reason": "Davranış değişikliği ve yürütücü bozulma ortak olsa da belirgin kore, kaudat atrofisi ve genetik test Huntington'ı gösterir."
                },
                {
                    "diagnosisId": "personality_change_due_to_medical",
                    "reason": "Kişilik değişikliği var, ancak ilerleyici bilişsel yıkım günlük işlevi bozduğu için tablo majör nörobilişsel bozukluk düzeyindedir."
                }
            ],
            "teachingPoint": "Orta yaşta irritabilite, yürütücü bozulma ve kore birlikte görülürse aile öyküsü sorulmalı; Huntington'da intihar riski yüksektir ve izlenmelidir."
        }
    },
    {
        "id": "case-144",
        "caseNumber": 144,
        "difficulty": "Zor",
        "course": "SUBSTANCE",
        "diagnosisId": "wernicke_korsakoff_syndrome",
        "therapyId": "motivational_interviewing",
        "category": "NEUROCOGNITIVE",
        "patientSummary": "54 yaşında, erkek",
        "clues": [
            "54 yaşındaki hasta, 20 yıldır her gün 1 şişe ağır alkol tüketmekte ve yemek yemeden sadece alkolle beslenmekteyken; 3 hafta önce acil servise 'göz kaslarında felç ve çift görme (oftalmopleji/nistagmus), geniş tabanlı dengesiz yürüyüş (ataksi) ve konfüzyon' (Akut Wernicke Ensefalopatisi) tablosuyla getirilip yatırıldı.",
            "Yoğun bakımdan servise çıktığında bilincinin açıldığı, ancak 5 dakika önce odaya giren doktorunu hiç tanımadığı ve az önce ne yemek yediğini kesinlikle hatırlayamadığı (ağır anterograd amnezi) tespit edildi.",
            "Doktor kendisine 'Dün akşam neredeydiniz?' diye sorduğunda, hasta 3 haftadır hastanede yatıyor olmasına rağmen son derece kendinden emin ve ciddi bir ifadeyle 'Dün akşam bakanla Boğaz'da balık yedik, oradan uçağa binip Ankara'daki toplantıya katıldım' diyerek boşlukları hayali anılarla doldurdu (Konfabülasyon / Masallama).",
            "Kranial MRG'de hipotalamustaki mamiller cisimciklerde (corpora mamillaria) ve dorsomedial talamik çekirdeklerde bilateral atrofi ve sinyal artışı; kanda ağır Tiamin (B1 vitamini) eksikliği saptandı.",
            "Ruhsal Durum Muayenesinde: Anlık bellek (sayı menzili) ve genel zeka korunmuş olmasına karşın, kısa süreli belleği uzun süreli belleğe aktarma yetisinin tamamen yıkıldığı ve samimi konfabülasyonların eşlik ettiği Korsakoff amnestik sendromu doğrulandı.",
            "DSM-5'e göre: Kronik alkol kullanımına ve Tiamin (B1) eksikliğine bağlı gelişen, alkol kesildikten sonra da kalıcı olarak süren ağır yeni bilgi öğrenememe ve konfabülasyonla karakterize Alkolün Yol Açtığı Kalıcı Majör Nörobilişsel Bozukluk (Amnestik-Konfabulatuar Tip / Wernicke-Korsakoff) tablosudur."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "oftalmopleji/nistagmus), geniş tabanlı dengesiz yürüyüş (ataksi) ve konfüzyon' (Akut Wernicke Ensefalopatisi)",
                "dsmMatch": "Wernicke Triadı: Konfüzyon + Oftalmopleji (6. kraniyal sinir felci/nistagmus) + Serebellar Ataksi"
            },
            {
                "clueIndex": 2,
                "text": "boşlukları hayali anılarla doldurdu (Konfabülasyon / Masallama)",
                "dsmMatch": "Korsakoff Belirteci: Ağır anterograd amnezi ve bellek boşluklarını konfabülasyonla doldurma"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Acil Parenteral Yüksek Doz Tiamin (B1) Replasmanı, Tam Alkol Bırakma & Bellek Rehabilitasyonu",
            "therapyDetails": "Alkolün kesin olarak kesilmesi, harici bellek yardımcıları (günlük defteri, telefon alarmları, oda içi yönlendirici etiketler) kullanımı ve yapılandırılmış bakım desteği.",
            "pharmacologyNote": "ALTIN KURAL: Acile gelen alkol bağımlısı veya malnütrisyonlu hastaya DAMARDAN DEKSTROZ (GLUKOZ) VERİLMEDEN ÖNCE mutlaka yüksek doz IV/IM TİAMİN (B1 Vitamini) verilmelidir! Önce glukoz verilirse kalan son tiamin de tükenir ve Wernicke-Korsakoff koması/kalıcı beyin hasarı tetiklenir."
        },
        "miniQuiz": {
            "question": "Acil servise getirilen kronik alkol kullanım bozukluğu olan bir hastada 'Wernicke-Korsakoff Sendromu'nu önlemek için uygulanması gereken hayati tıbbi kural nedir?",
            "options": [
                "Damar yolundan Glukoz (Dekstroz) içeren sıvı verilmeden ÖNCE mutlaka yüksek doz parenteral Tiamin (B1 vitamini) uygulanmalıdır.",
                "Önce 2 litre şekerli su (dekstroz) verilip 3 gün sonra B12 vitamini yapılmalıdır.",
                "Hastaya hemen Haloperidol ve Lityum başlanmalıdır.",
                "Hastanın konfabülasyonlarıyla sertçe tartışılmalıdır."
            ],
            "correctIndex": 0,
            "explanation": "Tiamin (B1), glukoz metabolizmasının kofaktörüdür. Tiamin eksikliği olan alkol bağımlısına önce glukoz/dekstroz yüklenirse beyindeki son tiamin rezervi de harcanır ve mamiller cisimciklerde kanama/nekroz gelişerek geri dönüşsüz Korsakoff amnezisi oluşur."
        },
        "differentialDiagnosis": "• Alzheimer Hastalığı: Kortikal demanstır; afazi, apraksi, agnozi eşlik eder. Korsakoff'ta ise genel zeka ve dil korunmuşken izole mamillo-talamik bellek yıkımı vardır.\n• Temarruz / Yalan Söyleme: Korsakoff hastası çıkar için bilerek yalan söylemez; bellek boşluğunu farkında olmadan samimi konfabülasyonla doldurur.",
        "dsmCriteriaSummary": "DSM-5: Kronik alkol/tiamin eksikliği + Wernicke triadı (Konfüzyon, Oftalmopleji, Ataksi) sonrası kalıcı Korsakoff tablosu (Ağır anterograd amnezi + Konfabülasyon).",
        "pharmacologyId": "thiamine_iv_wernicke",
        "explanation": {
            "whyThis": [
                "Yirmi yıllık ağır alkol kullanımı ve yetersiz beslenmenin ardından göz kası felci, ataksi ve konfüzyonla gelen Wernicke ensefalopatisi tablonun başlangıcıdır.",
                "Bilinç açıldıktan sonra beş dakika önceki olayları hatırlayamama ağır anterograd amnezi; boşlukları kendinden emin hayali anılarla doldurma konfabülasyondur.",
                "Anlık bellek ve genel zeka korunmuştur; mamiller cisim ve talamus bulguları ile tiamin eksikliği alkolün yol açtığı amnestik-konfabülatuvar tipi destekler."
            ],
            "whyNot": [
                {
                    "diagnosisId": "major_neurocognitive_alzheimer",
                    "reason": "Dil ve genel zeka korunmuştur, bozukluk yeni bilgi öğrenmeye sınırlıdır ve alkol-tiamin eksikliğiyle akut başlamıştır."
                },
                {
                    "diagnosisId": "alcohol_withdrawal_delirium",
                    "reason": "Bilinç açıktır ve dikkat korunmuştur; sorun dalgalanan bir bilinç bozukluğu değil, kalıcı bir bellek kaybıdır."
                },
                {
                    "diagnosisId": "factitious_disorder",
                    "reason": "Konfabülasyon bilerek ve bir amaçla yapılan uydurma değildir; kişi anlattıklarının doğru olduğuna inanır."
                }
            ],
            "teachingPoint": "Korsakoff sendromunda konfabülasyon yalan değil, bellek boşluğunun farkında olmadan doldurulmasıdır; Wernicke tablosunda erken tiamin verilmesi kalıcı hasarı önleyebilir."
        }
    },
    {
        "id": "case-151",
        "caseNumber": 151,
        "difficulty": "Kolay",
        "course": "CHILD",
        "diagnosisId": "language_disorder",
        "category": "NEURODEV",
        "patientSummary": "5 yaşında, erkek çocuğu, anaokulu öğrencisi",
        "clues": [
            "5 yaşındaki anaokulu öğrencisi, öğretmeninin 'yaşıtlarına göre çok az sözcük kullandığı ve kısa iki sözcüklü ifadelerle konuştuğu' yönündeki gözlemi üzerine ailesi tarafından getirildi.",
            "Annesi, oğlunun ilk sözcüklerini 2 yaşından sonra söylediğini, halen zaman ve durum eklerini sıkça atladığını ('anne park gitti' gibi) ve kreşte yaşadıklarını sırayla anlatmakta zorlandığını aktarıyor.",
            "Çok aşamalı yönergeleri ('kalemi kutuya koyup kapıyı kapat') sık sık karıştırdığı, buna karşın göz teması kurduğu, arkadaşlarıyla kovalamaca ve evcilik oyunlarına hevesle katıldığı, yineleyici bir uğraşının olmadığı öğreniliyor.",
            "Odyoloji incelemesinde işitme eşikleri her iki kulakta olağan saptanıyor. Çocuk nörolojisi muayenesi doğal; sözel olmayan zekâ değerlendirmesi yaşıyla uyumlu bulunuyor.",
            "Ruhsal Durum Muayenesinde: Güleryüzlü, işbirliğine açık ve jest-mimik kullanımı zengin. Resimli hikâye kartlarını anlatırken sözcük dağarcığı yaşına göre dar kalıyor, dilbilgisi eklerini kuramadan kopuk ve kısa ifadeler kullanıyor.",
            "Standart değerlendirme testinde hem alıcı hem ifade edici sözel beceriler yaş normlarının 2 standart sapma altında; sesletim hataları değil, sözcük dağarcığı, sözdizimi ve söylem kurma yetersizliği ön planda."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "zaman ve durum eklerini sıkça atladığını",
                "dsmMatch": "Kriter A2: Cümle yapısının ve biçimbilgisi kullanımının sınırlı olması"
            },
            {
                "clueIndex": 1,
                "text": "kreşte yaşadıklarını sırayla anlatmakta zorlandığını",
                "dsmMatch": "Kriter A3: Söylem becerilerinde yetersizlik"
            },
            {
                "clueIndex": 3,
                "text": "işitme eşikleri her iki kulakta olağan",
                "dsmMatch": "Kriter D: Duyu yetersizliğinin ve nörolojik nedenin dışlanması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bireyselleştirilmiş Dil ve Konuşma Terapisi & Aile Eğitimi",
            "therapyDetails": "Sözcük dağarcığını genişletme, ek ve cümle yapısı modelleme, etkileşimli kitap okuma ve anaokulu öğretmeniyle ortak iletişim stratejileri.",
            "pharmacologyNote": "Birincil ilaç tedavisi yoktur; eşlik eden başka bir bozukluk yoksa yalnızca konuşma terapisi ve eğitsel destek uygulanır."
        },
        "miniQuiz": {
            "question": "Aşağıdaki bulgulardan hangisi alıcı-ifade edici iletişim yetersizliğini zihinsel yetiyitimi veya işitme kaybından ayırt etmede temel önem taşır?",
            "options": [
                "Çocuğun çok konuşkan olması",
                "İşitme testinin ve sözel olmayan bilişsel becerilerin yaşıyla uyumlu olması",
                "Belirtilerin ergenlikte aniden başlaması",
                "Sadece okulda konuşup evde hiç konuşmaması"
            ],
            "correctIndex": 1,
            "explanation": "Tanı için güçlüğün işitme kaybı, nörolojik hastalık veya genel bilişsel gerilikle açıklanamaması gerekir; normal odyoloji ve sözel olmayan zekâ bu ayrımı sağlar."
        },
        "differentialDiagnosis": "• Otizm Spektrum Bozukluğu: Karşılıklı toplumsal etkileşim bozulmuştur ve sınırlı-yineleyici davranışlar görülür; burada oyun ve jest kullanımı doğaldır.\n• Konuşma Sesi Bozukluğu (Fonolojik Bozukluk): Sorun yalnızca seslerin doğru çıkarılmasındadır; sözcük dağarcığı ve cümle yapısı yaşa uygundur.\n• Zihinsel Yetiyitimi (Hafif Düzey): Sözel olmayan bilişsel beceriler ve uyumsal işlevler de geri kalır.",
        "dsmCriteriaSummary": "DSM-5-TR: Kısıtlı sözcük dağarcığı + Sınırlı cümle yapısı + Söylem güçlüğü + Erken başlangıç + İşitme/nörolojik/bilişsel nedenlerin dışlanması.",
        "therapyId": "speech_therapy",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Kısıtlı sözcük dağarcığı, ekleri atlayarak basit cümle kurma ve olayları sırayla aktaramama Kriter A'nın üç bileşenini karşılar.",
                "Belirtiler erken gelişim döneminde başlamış ve standart testlerde yaş normlarının belirgin biçimde altında kalarak okul uyumunu etkilemiştir.",
                "Normal işitme, doğal nörolojik muayene ve yaşıyla uyumlu sözel olmayan zekâ dışlama ölçütlerini sağlar."
            ],
            "whyNot": [
                {
                    "diagnosisId": "asd",
                    "reason": "Göz teması, jest kullanımı ve akranlarla hayali oyun becerisi doğaldır; yineleyici davranış yoktur."
                },
                {
                    "diagnosisId": "speech_sound_disorder",
                    "reason": "Temel sorun seslerin telaffuzu değil, sözcük dağarcığı, dilbilgisi ve söylem kurma yetersizliğidir."
                },
                {
                    "diagnosisId": "intellectual_disability_mild",
                    "reason": "Sözel olmayan zekâ değerlendirmesi yaşıyla uyumludur; genel bilişsel gerilik yoktur."
                }
            ],
            "teachingPoint": "Erken yaşta sözcük dağarcığı, dilbilgisi ve anlatım becerileri geri kalmış bir çocukta işitme ve sözel olmayan zekâ normalse birincil dil bozukluğu düşünülmelidir."
        }
    },
    {
        "id": "case-152",
        "caseNumber": 152,
        "difficulty": "Kolay",
        "course": "CHILD",
        "diagnosisId": "provisional_tic_disorder",
        "category": "NEURODEV",
        "patientSummary": "8 yaşında, erkek çocuğu, ilkokul 2. sınıf öğrencisi",
        "clues": [
            "8 yaşındaki ilkokul öğrencisi, son 4 aydır sık sık gözlerini sertçe kırpıştırması ve zaman zaman omuz silkmesi nedeniyle annesi tarafından polikliniğe getirildi.",
            "Annesi, hareketlerin yeni okula başlama döneminin ardından ortaya çıktığını, çocuğun özellikle yorgunken ya da heyecanlandığında arttığını, uykuda ise tamamen kaybolduğunu belirtiyor.",
            "Çocuk, gözlerini kırpmadan önce göz kapaklarında 'kaşınma ve sıkışma gibi bir his' oluştuğunu, kırptıktan sonra rahatladığını; kendini zorlarsa birkaç dakika tutabildiğini ancak ardından daha sık yapmak zorunda kaldığını anlatıyor.",
            "Göz hastalıkları muayenesinde alerji ya da kuruluk saptanmıyor. Öyküde uyarıcı ilaç kullanımı, kafa travması veya streptokok enfeksiyonu yok; daha önceki yıllarda benzer hiçbir istemsiz hareket ya da ses çıkarma olmamış.",
            "Ruhsal Durum Muayenesinde: Yaşıyla uyumlu, neşeli ve iletişim kurmaya istekli. Görüşme boyunca birkaç kez hızlı, ani, yineleyici göz kırpma ve tek taraflı omuz silkme gözleniyor; eşlik eden herhangi bir ses çıkarma saptanmıyor.",
            "İlk belirtinin başlamasının üzerinden yalnızca 4 ay geçtiği, daha önce 1 yılı aşan hiçbir istemsiz hareket ya da ses öyküsü bulunmadığı kesinleştiriliyor."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "son 4 aydır sık sık gözlerini sertçe kırpıştırması ve zaman zaman omuz silkmesi",
                "dsmMatch": "Kriter A & B: Motor hareketlerin 1 yıldan kısa süredir bulunması"
            },
            {
                "clueIndex": 2,
                "text": "göz kapaklarında 'kaşınma ve sıkışma gibi bir his' oluştuğunu, kırptıktan sonra rahatladığını",
                "dsmMatch": "Klinik Özellik: Öncül duyusal dürtü ve geçici bastırılabilirlik"
            },
            {
                "clueIndex": 3,
                "text": "daha önceki yıllarda benzer hiçbir istemsiz hareket ya da ses çıkarma olmamış",
                "dsmMatch": "Kriter E: Daha önce süregen ya da Tourette ölçütlerinin karşılanmamış olması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Aile Psikoeğitimi & İzlem (Gerekirse CBIT)",
            "therapyDetails": "Aileye ve öğretmene belirtilere aşırı dikkat çekmemeleri ve çocuğu uyarmamaları öğretilir; stres düzenlenir, işlevselliği bozarsa davranışçı müdahale planlanır.",
            "pharmacologyNote": "İlk basamakta ilaç başlanmaz; çoğu olgu birkaç ay içinde kendiliğinden geriler. Ağır ve işlev bozucu süregenleşmede alfa-2 agonistler değerlendirilir."
        },
        "miniQuiz": {
            "question": "Bu tablonun süregen (kronik) motor tik bozukluğundan ya da Tourette bozukluğundan ayrılmasını sağlayan temel ölçüt hangisidir?",
            "options": [
                "Belirtilerin yalnızca uykuda görülmesi",
                "İlk belirtinin başlangıcından bu yana 1 yıldan kısa süre geçmiş olması",
                "Belirtilerin 18 yaşından sonra başlamış olması",
                "Çocuğun hareketleri hiçbir şekilde hissedememesi"
            ],
            "correctIndex": 1,
            "explanation": "18 yaşından önce başlayan tikler ilk başlangıçtan itibaren 1 yıldan kısa süredir mevcutsa geçici tanı konur; süre 1 yılı aşarsa süregen tik ya da Tourette tanısı değerlendirilir."
        },
        "differentialDiagnosis": "• Tourette Bozukluğu: Hem çoklu motor hem en az bir vokal tik bulunmalı ve süre 1 yılı aşmalıdır.\n• Süregen (Kronik) Motor ya da Vokal Tik Bozukluğu: Belirtiler ilk başlangıçtan itibaren 1 yıldan uzun sürmelidir.\n• Stereotipik Hareket Bozukluğu: Genellikle daha erken başlar, ritmik-amaçsızdır ve öncül duyusal dürtü eşlik etmez.",
        "dsmCriteriaSummary": "DSM-5-TR: 18 yaş öncesi başlayan motor ve/veya vokal tik + Süre 1 yıldan kısa + Madde/tıbbi neden yok + Önceden Tourette/süregen tik ölçütü yok.",
        "therapyId": "cbit",
        "pharmacologyId": "alpha2_agonist_tic",
        "explanation": {
            "whyThis": [
                "8 yaşında başlayan, öncül duyusal dürtü ve kısa süreli bastırılabilirlikle seyreden ani, hızlı göz kırpma ve omuz silkme tipik motor tiklerdir.",
                "İlk başlangıçtan bu yana yalnızca 4 ay geçmiş olması (<1 yıl) ve geçmişte hiç tik öyküsü bulunmaması zaman ve dışlama ölçütlerini karşılar.",
                "Göz muayenesi normaldir ve uyarıcı ilaç ya da nörolojik hastalık öyküsü yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "tourette",
                    "reason": "Süre 1 yıldan kısadır ve eşlik eden vokal tik bulunmamaktadır."
                },
                {
                    "diagnosisId": "chronic_motor_vocal_tic",
                    "reason": "Belirtiler henüz 4 aydır sürmektedir; süregen tanı için en az 1 yıl gerekir."
                },
                {
                    "diagnosisId": "stereotypic_movement_disorder",
                    "reason": "Hareketler ritmik el çırpma ya da sallanma şeklinde değil, ani-hızlı ve öncül duyusal dürtülüdür."
                }
            ],
            "teachingPoint": "Okul çağında yeni başlayan tiklerde ilk 1 yıl dolmadan Tourette ya da süregen tik tanısı konmaz; doğru tanı geçici tik bozukluğudur."
        }
    },
    {
        "id": "case-153",
        "caseNumber": 153,
        "difficulty": "Zor",
        "course": "CHILD",
        "diagnosisId": "social_communication_disorder",
        "category": "NEURODEV",
        "patientSummary": "10 yaşında, kız çocuğu, ilkokul 4. sınıf öğrencisi",
        "clues": [
            "10 yaşındaki ilkokul öğrencisi, sınıf arkadaşlarıyla sık sık yanlış anlaşılma yaşaması ve grup oyunlarından dışlanması üzerine okul rehberlik servisinin yönlendirmesiyle getirildi.",
            "Annesi, kızının sözcük dağarcığının çok zengin olduğunu ve dilbilgisi kurallarına kusursuz uyduğunu; ancak misafirlere 'hoş geldiniz' demeden doğrudan okulda okuduğu bir kitabı anlatmaya başladığını, karşısındakinin dinleyip dinlemediğine bakmadan uzun süre konuştuğunu anlatıyor.",
            "Öğretmeni, çocuğun müdürle konuşurken de teneffüste arkadaşıyla şakalaşırken de aynı aşırı resmî tonda konuştuğunu; 'gözünden düşmek' ya da 'havadan sudan konuşmak' gibi deyimleri ve ince esprileri hep düz anlamıyla anladığını bildiriyor.",
            "Ayrıntılı gelişim öyküsünde erken çocukluktan bu yana dar ve takıntılı ilgi alanı, nesneleri sıraya dizme, rutin değişikliğinde şiddetli tepki, duyusal aşırı hassasiyet ya da yineleyici el-beden hareketi hiç gözlenmemiş.",
            "Ruhsal Durum Muayenesinde: Göz teması doğal, duygusal karşılıklılık çabası mevcut. Zekâ testi ortalama üstü; ancak hikâye tamamlama görevinde karakterin ima ettiği niyeti çıkaramıyor, söz sırası almada ve yanlış anlaşıldığında cümlesini yeniden açıklamakta güçlük çekiyor.",
            "Standart değerlendirmede sözcük bilgisi ve sözdizimi yaşının üzerinde çıkarken, konuşmayı ortama ve dinleyiciye göre ayarlama, söz sırası kuralları ve örtük anlamı kavrama alanlarının dördünde de belirgin yetersizlik saptanıyor."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 2,
                "text": "müdürle konuşurken de teneffüste arkadaşıyla şakalaşırken de aynı aşırı resmî tonda konuştuğunu",
                "dsmMatch": "Kriter A2: İletişimi bağlama ve dinleyiciye göre ayarlayamama"
            },
            {
                "clueIndex": 2,
                "text": "deyimleri ve ince esprileri hep düz anlamıyla anladığını",
                "dsmMatch": "Kriter A4: Örtük anlam, deyim ve mecazı anlamada güçlük"
            },
            {
                "clueIndex": 3,
                "text": "dar ve takıntılı ilgi alanı, nesneleri sıraya dizme, rutin değişikliğinde şiddetli tepki, duyusal aşırı hassasiyet ya da yineleyici el-beden hareketi hiç gözlenmemiş",
                "dsmMatch": "Kriter D: Otizm spektrum bozukluğunun (Kriter B) dışlanması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Sosyal İletişim Odaklı Dil-Konuşma Terapisi & Sosyal Beceri Eğitimi",
            "therapyDetails": "Söz sırası alma, dinleyici bakış açısını gözetme, deyim-ima çözümleme ve akran gruplarında rol canlandırma çalışmaları; okul ve aile işbirliği.",
            "pharmacologyNote": "Birincil farmakoterapisi yoktur; eşlik eden anksiyete ya da dikkat sorunu gelişirse ayrıca değerlendirilir."
        },
        "miniQuiz": {
            "question": "Bu tanıyı Otizm Spektrum Bozukluğundan ayıran en temel klinik fark aşağıdakilerden hangisidir?",
            "options": [
                "Sözcük dağarcığının mutlaka çok geri olması",
                "Yaşam boyu sınırlı, yineleyici davranış, ilgi ve etkinlik örüntüsünün bulunmaması",
                "Belirtilerin yalnızca erişkinlikte başlaması",
                "İşitme kaybının eşlik etmesi"
            ],
            "correctIndex": 1,
            "explanation": "Her iki tabloda da toplumsal iletişim güçlüğü görülür; ancak sınırlı-yineleyici davranış, ilgi veya duyusal örüntüler (OSB Kriter B) ne şimdi ne de geçmişte yoksa bu tanı konur."
        },
        "differentialDiagnosis": "• Otizm Spektrum Bozukluğu: Toplumsal iletişim güçlüğüne ek olarak şimdi ya da geçmişte sınırlı, yineleyici davranış, ilgi veya etkinlikler bulunur.\n• Dil Bozukluğu: Sözcük dağarcığı ve dilbilgisi (biçimbilgisi/sözdizimi) becerileri de belirgin biçimde geridir.\n• Dikkat Eksikliği ve Hiperaktivite Bozukluğu (DEHB): Söz kesme dürtüselliğe bağlıdır; deyim ve örtük anlamı kavramada temel yetersizlik görülmez.",
        "dsmCriteriaSummary": "DSM-5-TR: Toplumsal amaçlı iletişim, bağlama uyarlama, konuşma kuralları ve örtük anlamı anlamanın tümünde güçlük + İşlev kaybı + Erken başlangıç + OSB ve dil/bilişsel bozuklukların dışlanması.",
        "therapyId": "speech_therapy",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Selamlaşmadan konuya girme, dinleyiciye göre üslup değiştirememe, söz sırası güçlüğü ve deyimleri düz anlamıyla kavrama Kriter A'nın dört alt alanını da karşılar.",
                "Sözcük bilgisi, dilbilgisi ve zekâ testlerinin normalin üzerinde olması birincil dil bozukluğu ve zihinsel yetiyitimini dışlar.",
                "Gelişim öyküsünde ve muayenede hiçbir sınırlı, yineleyici davranış ya da duyusal örüntü olmaması OSB'den net ayrımı sağlar."
            ],
            "whyNot": [
                {
                    "diagnosisId": "asd",
                    "reason": "Ne şimdi ne de erken çocuklukta sınırlı-yineleyici davranış, takıntılı ilgi ya da duyusal hassasiyet öyküsü yoktur."
                },
                {
                    "diagnosisId": "language_disorder",
                    "reason": "Sözcük dağarcığı zengin ve sözdizimi kusursuzdur; sorun yapısal değil toplumsal kullanımdadır."
                },
                {
                    "diagnosisId": "adhd",
                    "reason": "Güçlük yalnızca dürtüsel söz kesmeyle sınırlı değildir; örtük anlam, deyim ve bağlama uyarlama bozuktur."
                }
            ],
            "teachingPoint": "Yapısal dil becerileri sağlam, toplumsal dil kullanımı bozuk ve yaşam boyu sınırlı-yineleyici davranış örüntüsü olmayan çocukta otizm yerine toplumsal iletişim bozukluğu düşünülmelidir."
        }
    },
    {
        "id": "case-154",
        "caseNumber": 154,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "substance_induced_psychotic",
        "category": "PSYCHOTIC",
        "patientSummary": "23 yaşında, erkek, üniversite öğrencisi",
        "clues": [
            "23 yaşındaki üniversite öğrencisi, son 3 gündür yurt odasındaki prizlerin içine gizli kameralar yerleştirildiğini ve koridordaki öğrencilerin kendisini takip ettiğini söyleyerek kapıyı içeriden kilitlemesi üzerine acil servise getirildi.",
            "Arkadaşları, öğrencinin daha önce hiçbir ruhsal yakınması olmadığını, son 1 haftadır final sınavlarına hazırlanmak için yüksek dozda kristal formda uyarıcı kullandığını ve 4 gecedir neredeyse hiç uyumadığını bildiriyor.",
            "Hasta, duvarların arkasından kendisine 'yakalandın, seni teslim edeceğiz' diyen erkek sesleri duyduğunu ve kollarının altında küçük böceklerin yürüdüğünü hissederek derisini kanattığını anlatıyor; bu yaşantıların gerçekliğine tam olarak inanıyor.",
            "Acil idrar toksikoloji taramasında amfetamin/metamfetamin pozitif saptanıyor; kan şekeri, elektrolitler, enfeksiyon belirteçleri ve beyin BT olağan. Vital bulgularda hafif taşikardi dışında ateş ya da otonom çöküş yok.",
            "Ruhsal Durum Muayenesinde: Bilinç açık, yer ve zaman yönelimi tam, dikkatini görüşmeye verebiliyor ancak aşırı kuşkucu ve gergin. Kötülük görme sanrıları, işitsel ve dokunsal varsanılar aktif; içgörü yok.",
            "Maddenin kesilmesi ve kısa süreli yatışla izlemde, 6. günün sonunda tüm sanrı ve varsanılar tamamen siliniyor; hastanın daha önce madde kullanmadığı dönemlerde benzer hiçbir atağı olmadığı doğrulanıyor."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 2,
                "text": "duvarların arkasından kendisine 'yakalandın, seni teslim edeceğiz' diyen erkek sesleri duyduğunu",
                "dsmMatch": "Kriter A: Varsanı ve sanrıların varlığı (gerçeği değerlendirme kaybıyla)"
            },
            {
                "clueIndex": 3,
                "text": "idrar toksikoloji taramasında amfetamin/metamfetamin pozitif",
                "dsmMatch": "Kriter B: Belirtilerin etken madde maruziyetiyle zamansal ve laboratuvar ilişkisi"
            },
            {
                "clueIndex": 5,
                "text": "Maddenin kesilmesi ve kısa süreli yatışla izlemde, 6. günün sonunda tüm sanrı ve varsanılar tamamen siliniyor",
                "dsmMatch": "Kriter C: Bağımsız birincil psikotik bozukluğun dışlanması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Motivasyonel Görüşme & Nüks Önleme Terapisi",
            "therapyDetails": "Akut tablo yatıştıktan sonra madde kullanımını bırakmaya yönelik motivasyonel görüşme, tetikleyici analizi ve ileride birincil psikoz gelişimi açısından düzenli izlem.",
            "pharmacologyNote": "Akut dönemde kısa süreli ikinci kuşak antipsikotik ve gerekirse ajitasyon için benzodiazepin kullanılır; belirtiler kalıcı biçimde düzelince ilaç azaltılarak izlenir."
        },
        "miniQuiz": {
            "question": "Aşağıdaki durumlardan hangisi bu tablo yerine maddeye bağlı olmayan birincil bir psikotik bozukluğu düşündürür?",
            "options": [
                "Belirtilerin yoğun uyarıcı kullanımından hemen sonra başlaması",
                "Sanrı ve varsanıların madde tamamen kesildikten sonra 1 aydan uzun süre devam etmesi",
                "İdrar toksikolojisinin pozitif çıkması",
                "İşitsel varsanılara dokunsal varsanıların eşlik etmesi"
            ],
            "correctIndex": 1,
            "explanation": "DSM-5-TR'ye göre belirtilerin madde kullanımından önce başlaması, akut yoksunluk/zehirlenme bittikten sonra yaklaşık 1 aydan uzun sürmesi ya da madde dışı yineleyen ataklar birincil psikotik bozukluğa işaret eder."
        },
        "differentialDiagnosis": "• Kısa Psikotik Bozukluk: Belirtiler bir maddenin ya da ilacın doğrudan fizyolojik etkisine bağlanamaz.\n• Uyarıcı Kullanım Bozukluğu (Amfetamin Türü Madde / Metamfetamin): Tek başına gerçeği değerlendirmenin bozulduğu sanrı ve varsanıları açıklamaz; ek tanı olarak değerlendirilebilir.\n• Deliryum (Akut Bilinç Bulanıklığı): Bilinç ve dikkatte gün içi dalgalanma ile yönelim bozukluğu ön plandadır; burada bilinç açık ve yönelim tamdır.",
        "dsmCriteriaSummary": "DSM-5-TR: Sanrı/varsanı + Madde intoksikasyonu/yoksunluğu ile zamansal ve nedensel ilişki + Bağımsız psikoz ve deliryum dışlaması + Klinik sıkıntı/işlev kaybı.",
        "therapyId": "motivational_interviewing",
        "pharmacologyId": "atypical_ap_secondgen",
        "explanation": {
            "whyThis": [
                "Gerçeği değerlendirmenin bozulduğu kötülük görme sanrıları ile işitsel ve dokunsal varsanılar Kriter A'yı karşılar.",
                "Belirtiler yoğun uyarıcı kullanımı sırasında gelişmiş, idrar toksikolojisi pozitif saptanmış ve maddenin kesilmesiyle 6 günde tamamen gerilemiştir.",
                "Bilinç açık ve yönelim tam olduğu için deliryum, öncesinde madde dışı atak olmadığı için birincil psikoz dışlanmıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "brief_psychotic",
                    "reason": "Belirtiler pozitif toksikolojiyle doğrulanan yoğun uyarıcı maruziyetinin doğrudan fizyolojik sonucudur."
                },
                {
                    "diagnosisId": "delirium",
                    "reason": "Bilinç açık, yer-zaman yönelimi tamdır ve dikkatte dalgalanma yoktur."
                },
                {
                    "diagnosisId": "schizophrenia",
                    "reason": "Toplam süre 6 aydan çok kısadır ve belirtiler madde kesilince hızla düzelmiştir."
                }
            ],
            "teachingPoint": "Madde maruziyeti sırasında gerçeği değerlendirmenin kaybolduğu sanrı/varsanı gelişir ve kesilme sonrası hızla düzelirse birincil psikoz yerine madde kaynaklı psikotik bozukluk tanınır."
        }
    },
    {
        "id": "case-155",
        "caseNumber": 155,
        "difficulty": "İleri Düzey",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "catatonia_medical",
        "category": "PSYCHOTIC",
        "patientSummary": "24 yaşında, kadın, diyetisyen",
        "clues": [
            "24 yaşındaki diyetisyen, son 10 gündür giderek azalan konuşma, yataktan çıkmama ve son 3 gündür hiç yemek yememe nedeniyle ailesi tarafından acil servise getirildi.",
            "Öyküde hiçbir ruhsal hastalık ya da antipsikotik ilaç kullanımı yok. Ailesi, iki hafta önce hafif ateş ve baş ağrısıyla başlayan grip benzeri bir dönemin ardından davranışlarının değiştiğini, birkaç kez yüzünde istemsiz çiğneme hareketleri gördüklerini aktarıyor.",
            "Muayenede hasta gözleri açık yatıyor ancak sorulan hiçbir soruya yanıt vermiyor, yemek ve su uzatıldığında dudaklarını sımsıkı kapatıyor ve yatağın kenarını tutarak muayene girişimlerine karşı direnç gösteriyor.",
            "Kolunu havaya kaldıran hekim kolu bıraktığında hasta kolunu dakikalarca aynı konumda tutuyor ve yer çekimine karşı indirmeden sabit kalıyor; arada anlamsızca yüzünü buruşturuyor.",
            "Ruhsal Durum Muayenesinde: Uyanık ancak tepkisiz (stupor), konuşma yok (mutizm), aktif direnç (negativizm), yerçekimine karşı konum koruma ve yüz buruşturma mevcut; dalgalı konfüzyon yok. Damar içi 2 mg lorazepam sonrası 20 dakikada kısa süreli konuşma gözleniyor.",
            "Beyin omurilik sıvısında lenfositik pleositoz ve anti-NMDA reseptör antikoru pozitif saptanıyor; pelvik ultrasonografide sağ overde matür kistik teratom görülüyor."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 4,
                "text": "tepkisiz (stupor), konuşma yok (mutizm), aktif direnç (negativizm), yerçekimine karşı konum koruma ve yüz buruşturma",
                "dsmMatch": "Kriter A: 12 belirtiden en az 3'ünün (burada 5 belirti) varlığı"
            },
            {
                "clueIndex": 5,
                "text": "anti-NMDA reseptör antikoru pozitif",
                "dsmMatch": "Kriter B: Tablonun tıbbi hastalığın doğrudan patofizyolojik sonucu olduğuna dair kanıt"
            },
            {
                "clueIndex": 1,
                "text": "hiçbir ruhsal hastalık ya da antipsikotik ilaç kullanımı yok",
                "dsmMatch": "Kriter C: Ruhsal bozukluk ve nöroleptik malign sendromun dışlanması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Altta Yatan Tıbbi Hastalığın Tedavisi & İmmünoterapi / Destek Bakımı",
            "therapyDetails": "Otoimmün ensefalite yönelik steroid, IVIG veya plazmaferez ve teratomun cerrahi çıkarılması; hareketsizliğe bağlı tromboemboli, dehidratasyon ve beslenme yetersizliğinin önlenmesi.",
            "pharmacologyNote": "Belirtilerin hızlı çözülmesi için parenteral lorazepam (benzodiazepin) ilk basamaktır; yanıtsız veya malign seyirde EKT uygulanır."
        },
        "miniQuiz": {
            "question": "Genç bir kadında ruhsal öykü olmadan yeni başlayan stupor, mutizm, postür alma ve yüz hareketleri karşısında hangi tıbbi neden öncelikle dışlanmalıdır?",
            "options": [
                "Anti-NMDA reseptör ensefaliti",
                "Esansiyel tremor",
                "Migren aurası",
                "Benign paroksismal pozisyonel vertigo"
            ],
            "correctIndex": 0,
            "explanation": "Anti-NMDA reseptör ensefaliti, özellikle genç kadınlarda over teratomuyla ilişkili olabilen, prodromal grip benzeri belirtiler, orofasiyal diskinezi ve ağır motor-konuşma donukluğu ile seyreden önemli bir tıbbi nedendir."
        },
        "differentialDiagnosis": "• Başka Bir Ruhsal Bozuklukla İlişkili Katatoni: Altta yatan şizofreni, bipolar ya da majör depresif bozukluk vardır; burada doğrudan otoimmün ensefalit kanıtlanmıştır.\n• Deliryum (Akut Bilinç Bulanıklığı): Bilinç ve dikkatte dalgalı bozulma esastır; burada sabit motor-davranışsal belirtiler baskındır ve lorazepam testi pozitiftir.\n• Şizofreni: 6 aylık seyir ve birincil psikotik öykü yoktur; tabloyu BOS'taki anti-NMDA antikoru açıklamaktadır.",
        "dsmCriteriaSummary": "DSM-5-TR: 12 motor-davranışsal belirtiden en az 3'ü + Tıbbi hastalığın doğrudan fizyolojik sonucu kanıtı + Ruhsal bozukluk ve deliryum dışlaması.",
        "therapyId": "medical_stabilization",
        "pharmacologyId": "lorazepam_catatonia",
        "explanation": {
            "whyThis": [
                "Stupor, mutizm, negativizm, katalepsi (postür koruma) ve yüz buruşturma ile Kriter A'nın 3 belirti eşiği fazlasıyla karşılanmıştır.",
                "BOS'ta anti-NMDA reseptör antikoru ve over teratomu saptanması, tablonun tıbbi bir hastalığın doğrudan patofizyolojik sonucu olduğunu (Kriter B) kanıtlar.",
                "Geçmişte psikiyatrik bozukluk ya da antipsikotik kullanımı olmaması birincil psikiyatrik nedenleri ve nöroleptik malign sendromu dışlar."
            ],
            "whyNot": [
                {
                    "diagnosisId": "catatonia_associated",
                    "reason": "Tablo birincil bir ruhsal bozukluğa değil, kanıtlanmış otoimmün ensefalite ikincildir."
                },
                {
                    "diagnosisId": "delirium",
                    "reason": "Gün içi dalgalı bilinç bulanıklığı yerine belirgin stupor, katalepsi ve lorazepam yanıtı tabloya egemendir."
                },
                {
                    "diagnosisId": "schizophrenia",
                    "reason": "Önceden ruhsal hastalık öyküsü yoktur ve etiyoloji BOS antikorlarıyla tıbbi olarak gösterilmiştir."
                }
            ],
            "teachingPoint": "Psikiyatrik öyküsü olmayan genç hastada akut stupor, mutizm ve orofasiyal hareketler görüldüğünde otoimmün ensefalit gibi tıbbi nedenler mutlaka araştırılmalıdır."
        }
    },
    {
        "id": "case-156",
        "caseNumber": 156,
        "difficulty": "Zor",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "bipolar_due_to_medical",
        "category": "BIPOLAR",
        "patientSummary": "58 yaşında, erkek, mali müşavir",
        "clues": [
            "58 yaşındaki mali müşavir, son 3 haftadır günde yalnızca 2 saat uyuyarak gece yarısı yeni iş projeleri çizmesi, sürekli yüksek sesle ve durmaksızın konuşması, ailesine karşı aşırı öfkeli ve coşkulu davranması üzerine yakınlarınca getirildi.",
            "Eşi, hastanın yaşamı boyunca sakin ve ölçülü biri olduğunu, kendisinde ya da ailesinde hiçbir ruhsal hastalık öyküsü bulunmadığını; ancak 2 ay önce geçirdiği ani sol kol güçsüzlüğü nedeniyle hastanede yatıp taburcu olduğunu anlatıyor.",
            "Son iki haftada birikimlerinin büyük kısmıyla gereksiz lüks saatler sipariş ettiği, kendini 'ülkenin en büyük finans dehası' ilan ettiği ve ofiste çalışanlara hakaret ettiği için işten uzaklaştırıldığı öğreniliyor.",
            "İlaç listesinde steroid, antidepresan ya da uyarıcı bulunmuyor; toksikoloji taraması ve tiroid testleri olağan. Beyin MR'ında sağ frontal ve sağ temporal korteksi etkileyen 2 aylık subakut iskemik enfarkt alanı izleniyor.",
            "Ruhsal Durum Muayenesinde: Bilinç açık, yer-zaman yönelimi tam. Duygudurum taşkın ve çabuk parlayan nitelikte, konuşma basınçlı, düşünce akışında fikir uçuşması ve büyüklük düşünceleri mevcut; dikkat çeldirilebilir ancak dalgalı konfüzyon yok.",
            "İleri yaşta ilk kez ortaya çıkan bu taşkınlık döneminin, nörolojik olayın hemen ardından geliştiği ve sağ ön-şakak beyin hasarıyla doğrudan zamansal ve anatomik ilişki taşıdığı saptanıyor."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "son 3 haftadır günde yalnızca 2 saat uyuyarak gece yarısı yeni iş projeleri çizmesi, sürekli yüksek sesle ve durmaksızın konuşması",
                "dsmMatch": "Kriter A: Anormal taşkın/irritabl duygudurum ve artmış enerji"
            },
            {
                "clueIndex": 3,
                "text": "sağ frontal ve sağ temporal korteksi etkileyen 2 aylık subakut iskemik enfarkt",
                "dsmMatch": "Kriter B: Tıbbi hastalığın doğrudan patofizyolojik sonucu olduğuna dair kanıt"
            },
            {
                "clueIndex": 1,
                "text": "kendisinde ya da ailesinde hiçbir ruhsal hastalık öyküsü bulunmadığını",
                "dsmMatch": "Kriter C: Birincil duygudurum bozukluğunun dışlanması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Nörolojik İzlem, Aile Psikoeğitimi & Davranışsal Güvenlik Planı",
            "therapyDetails": "İkincil inme önlemi, uyku-uyanıklık düzeninin korunması, finansal koruma önlemleri ve ailenin belirtileri yönetmesine yönelik destek.",
            "pharmacologyNote": "Taşkınlık ve irritabiliteyi kontrol etmek için valproik asit veya ikinci kuşak antipsikotikler kullanılır; inme sonrası nörolojik ilaçlarla etkileşim gözetilir."
        },
        "miniQuiz": {
            "question": "İleri yaşta, kişisel ve ailesel psikiyatrik öykü olmaksızın ilk kez gelişen taşkınlık (mani) tablosunda aşağıdaki beyin bölgelerinden hangisinin lezyonu en sık ilişkilendirilir?",
            "options": [
                "Serebellum",
                "Sol oksipital lob",
                "Sağ frontal ve sağ temporal loblar",
                "Medulla oblongata"
            ],
            "correctIndex": 2,
            "explanation": "İnme sonrası ikincil mani tabloları literatürde en sık sağ hemisfer, özellikle sağ frontal, temporal ve limbik bağlantılı lezyonlarla ilişkilendirilmiştir."
        },
        "differentialDiagnosis": "• Bipolar I Bozukluğu: Tipik olarak genç erişkinlikte başlar ve altta yatan doğrudan bir beyin lezyonu ya da tıbbi hastalıkla açıklanmaz.\n• Maddenin/İlacın Yol Açtığı Bipolar Bozukluk: Kortikosteroid, uyarıcı ya da başka bir etken madde maruziyeti yoktur.\n• Deliryum (Akut Bilinç Bulanıklığı): Bilinç açık, yer-zaman yönelimi tamdır ve gün içi dalgalanma yoktur.",
        "dsmCriteriaSummary": "DSM-5-TR: Süregen taşkın/irritabl duygudurum ve artmış enerji + Tıbbi durumun doğrudan patofizyolojik sonucu kanıtı + Başka ruhsal bozukluk ve deliryum dışlaması.",
        "therapyId": "supportive_psychotherapy",
        "pharmacologyId": "valproate_acute_mania",
        "explanation": {
            "whyThis": [
                "Üç haftadır süren taşkın-irritabl duygudurum, uyku gereksiniminde azalma, basınçlı konuşma, fikir uçuşması ve dürtüsel harcama Kriter A ve E'yi karşılar.",
                "58 yaşında, kişisel ve ailesel öykü olmadan ilk kez ortaya çıkması ve 2 ay önceki sağ frontal-temporal inme ile zamansal ilişkisi doğrudan tıbbi etiyolojiyi (Kriter B) gösterir.",
                "İlaç/madde maruziyeti yoktur, bilinç açık ve yönelim tam olduğu için deliryum dışlanmıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "bipolar_1",
                    "reason": "Geç yaşta ilk atak olması, aile öyküsünün yokluğu ve sağ frontotemporal inme ile zamansal bağ birincil bozukluğu dışlar."
                },
                {
                    "diagnosisId": "substance_induced_bipolar",
                    "reason": "Steroid, uyarıcı ya da başka etken ilaç/madde kullanımı yoktur."
                },
                {
                    "diagnosisId": "delirium",
                    "reason": "Bilinç açık, yönelim tamdır ve gün içinde dalgalanan konfüzyon yoktur."
                }
            ],
            "teachingPoint": "50 yaş üzerinde psikiyatrik öykü olmadan ilk kez ortaya çıkan mani tablosunda mutlaka sağ hemisfer inmesi, tümör veya endokrin hastalıklar araştırılmalıdır."
        }
    },
    {
        "id": "case-157",
        "caseNumber": 157,
        "difficulty": "Orta",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "depressive_due_to_medical",
        "category": "MOOD",
        "patientSummary": "46 yaşında, kadın, tekstil atölyesi ustabaşısı",
        "clues": [
            "46 yaşındaki tekstil atölyesi ustabaşısı, son 4 aydır neredeyse her gün süren yoğun isteksizlik, halsizlik, önceden severek yaptığı el işlerinden hiç keyif almama ve sık sık ağlama yakınmalarıyla aile hekimine başvurdu.",
            "Hasta, işinde ya da ailesinde yakın dönemde herhangi bir kayıp veya stres verici olay yaşamadığını; buna karşın sabahları yataktan kalkamadığını, belirgin unutkanlık ve düşünce yavaşlığı nedeniyle atölyedeki siparişleri karıştırdığını anlatıyor.",
            "Ek sorgulamada son 5 aydır iştahı azalmasına rağmen 6 kilo aldığı, kalın hırkalarla dolaşmasına karşın sürekli üşüdüğü, cildinin kuruduğu, sesinin kalınlaştığı ve inatçı kabızlık yaşadığı öğreniliyor.",
            "Fizik muayenede nabız 54/dk, derin tendon reflekslerinin gevşeme evresi belirgin uzamış. Kan tahlillerinde TSH 44 mIU/L (normal <4.5), serbest T4 belirgin düşük, anti-TPO antikorları yüksek saptanıyor; B12 ve hemogram olağan.",
            "Ruhsal Durum Muayenesinde: Bilinç açık ve yönelim tam. Psikomotor yavaşlama belirgin, duygudurum belirgin çökkün, anhedoni ve odaklanma güçlüğü ön planda; sanrı, varsanı ya da intihar planı yok.",
            "Endokrinoloji tarafından başlanan levotiroksin yerine koyma tedavisiyle tiroid hormonları normale döndükten 8 hafta sonra çökkün duygudurum ve isteksizlik ek psikotrop gerekmeden belirgin biçimde geriliyor."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "son 4 aydır neredeyse her gün süren yoğun isteksizlik, halsizlik, önceden severek yaptığı el işlerinden hiç keyif almama",
                "dsmMatch": "Kriter A: Süregen çökkün duygudurum ve belirgin zevk/ilgi kaybı"
            },
            {
                "clueIndex": 3,
                "text": "TSH 44 mIU/L (normal <4.5), serbest T4 belirgin düşük",
                "dsmMatch": "Kriter B: Tıbbi hastalığın doğrudan patofizyolojik sonucu olduğuna dair laboratuvar kanıtı"
            },
            {
                "clueIndex": 5,
                "text": "levotiroksin yerine koyma tedavisiyle tiroid hormonları normale döndükten 8 hafta sonra çökkün duygudurum ve isteksizlik ek psikotrop gerekmeden belirgin biçimde geriliyor",
                "dsmMatch": "Kriter B & C: Nedensel bağın tedavi yanıtıyla doğrulanması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Altta Yatan Endokrin Hastalığın Tedavisi & Destekleyici Psikoterapi",
            "therapyDetails": "Tiroid hormon yerine koyma tedavisinin düzenli izlemi, hastalık ve ruhsal belirti ilişkisi hakkında psikoeğitim ve kalıntı belirtiler için destekleyici/bilişsel yaklaşım.",
            "pharmacologyNote": "Temel tedavi levotiroksindir; ötiroidi sağlandıktan sonra çökkün belirtiler sürerse SSRI grubu antidepresan eklenebilir."
        },
        "miniQuiz": {
            "question": "Çökkün duygudurum ve isteksizlikle başvuran bir hastada aşağıdaki bulgulardan hangisi altta yatan endokrin bir nedeni en güçlü biçimde düşündürür?",
            "options": [
                "İştah azalmasına rağmen kilo artışı, soğuğa tahammülsüzlük, bradikardi ve yüksek TSH",
                "Hafta sonları geç uyanma",
                "Sadece iş yerinde moral bozukluğu yaşama",
                "Kafein tüketiminin artması"
            ],
            "correctIndex": 0,
            "explanation": "Kilo artışı, soğuk intoleransı, kuru cilt, bradikardi, refleks gevşemesinde uzama ve belirgin yüksek TSH ile düşük serbest T4 ağır hipotiroidiye işaret eder."
        },
        "differentialDiagnosis": "• Majör Depresif Bozukluk: Belirtiler bir sağlık durumunun doğrudan fizyolojik etkisine bağlanamaz; burada ağır hipotiroidi saptanmış ve yerine koyma tedavisiyle tablo düzelmiştir.\n• Uyum Bozuklukları: Belirli bir psikososyal stresöre ya da hastalık tanısına verilen psikolojik tepkidir; burada ruhsal belirtiler tanı konmadan önce doğrudan hormonal etkiyle gelişmiştir.\n• Kalıcı Depresif Bozukluk (Distimi): En az 2 yıl süren birincil çökkünlük gerekir.",
        "dsmCriteriaSummary": "DSM-5-TR: Süregen çökkün duygudurum/anhedoni + Tıbbi durumun doğrudan patofizyolojik sonucu kanıtı + Başka ruhsal bozukluk ve deliryum dışlaması.",
        "therapyId": "supportive_psychotherapy",
        "pharmacologyId": "ssri_firstline",
        "explanation": {
            "whyThis": [
                "Dört aydır süren çökkün duygudurum, anhedoni, psikomotor yavaşlama ve işlev kaybı Kriter A ve E'yi karşılar.",
                "TSH'nin 44 mIU/L ve serbest T4'ün düşük çıkması, fiziksel bulgularla uyumlu ağır hipotiroidiyi ve belirtilerin doğrudan fizyolojik kökenini (Kriter B) kanıtlar.",
                "Levotiroksin ile ötiroidi sağlanınca ruhsal belirtilerin gerilemesi nedensel ilişkiyi doğrular; deliryum ya da tetikleyici stresör yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "mdd",
                    "reason": "Majör depresif bozukluk tanısı için belirtilerin tıbbi bir durumun doğrudan fizyolojik etkisine bağlanamaması gerekir."
                },
                {
                    "diagnosisId": "adjustment_disorder",
                    "reason": "Yakın dönemde stresör yoktur ve ruhsal belirtiler tanı haberine tepki değil, doğrudan hormon eksikliğinin sonucudur."
                },
                {
                    "diagnosisId": "dysthymia",
                    "reason": "Süre 4 aydır (2 yıl değil) ve altta yatan doğrudan tıbbi neden kanıtlanmıştır."
                }
            ],
            "teachingPoint": "Yeni başlayan çökkünlük ve enerji kaybı değerlendirilirken mutlaka TSH ve temel tıbbi tetkikler istenmelidir; hipotiroidi doğrudan depresif tabloyu taklit eder."
        }
    },
    {
        "id": "case-158",
        "caseNumber": 158,
        "difficulty": "Orta",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "anxiety_due_to_medical",
        "category": "ANXIETY",
        "patientSummary": "44 yaşında, kadın, eczane teknisyeni",
        "clues": [
            "44 yaşındaki eczane teknisyeni, son 5 aydır hiçbir tetikleyici yokken aniden bastıran şiddetli çarpıntı, göğüste sıkışma, terleme, titreme ve 'ölecekmiş gibi olma' atakları nedeniyle psikiyatri polikliniğine yönlendirildi.",
            "Hasta, daha önce hayatında hiç kaygı sorunu yaşamadığını, atakların kalabalık ya da kapalı alanlarla ilişkili olmadığını ve yeni bir atak korkusuyla dışarı çıkmaktan kaçınmadığını belirtiyor; ancak ataklara her seferinde şiddetli zonklayıcı baş ağrısı ve yüzünde solukluk eşlik ediyor.",
            "Acil servis kayıtlarında atak sırasında kan basıncının 210/120 mmHg'ye, nabzının 138/dk'ya çıktığı, iki farklı tansiyon ilacına karşın dalgalı tansiyon yükselmelerinin sürdüğü görülüyor.",
            "Kafein ve uyarıcı madde kullanımı yok; tiroid testleri olağan. 24 saatlik idrarda fraksiyone metanefrin ve normetanefrin düzeyleri üst sınırın 5 katı yüksek bulunuyor; batın MR'ında sol böbreküstü bezinde 3.5 cm'lik kitle saptanıyor.",
            "Ruhsal Durum Muayenesinde: Bilinç açık, yönelim tam. Ataklar dışında olağan, endişe verici felaketleştirici bilişler ya da agorafobik kaçınma yok; yalnızca ani fiziksel atakların neden olduğu yoğun sıkıntı ve iş gücü kaybı mevcut.",
            "Endokrin cerrahisi tarafından kitlenin çıkarılmasının ardından ani çarpıntı, baş ağrısı ve yoğun kaygı atakları tamamen ortadan kalkıyor."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 0,
                "text": "aniden bastıran şiddetli çarpıntı, göğüste sıkışma, terleme, titreme ve 'ölecekmiş gibi olma' atakları",
                "dsmMatch": "Kriter A: Klinik tabloya egemen panik benzeri kaygı atakları"
            },
            {
                "clueIndex": 3,
                "text": "24 saatlik idrarda fraksiyone metanefrin ve normetanefrin düzeyleri üst sınırın 5 katı yüksek",
                "dsmMatch": "Kriter B: Tıbbi hastalığın doğrudan patofizyolojik sonucu kanıtı"
            },
            {
                "clueIndex": 1,
                "text": "yeni bir atak korkusuyla dışarı çıkmaktan kaçınmadığını",
                "dsmMatch": "Kriter C: Birincil panik bozukluk ve agorafobiden ayrım"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Altta Yatan Tıbbi Hastalığın Tedavisi & Destekleyici Danışmanlık",
            "therapyDetails": "Katekolamin salgılayan kitlenin endokrinoloji-cerrahi eşliğinde kesin tedavisi; ameliyat öncesi ve sonrası döneme yönelik bilgilendirme ve stres yönetimi.",
            "pharmacologyNote": "Kesin tedavi alfa-blokaj hazırlığı sonrası cerrahidir. Cerrahi öncesi kalıntı kaygıda tıbbi ekiple uyumlu güvenli semptomatik destek (ör. hidroksizin) düşünülebilir; beta-blokör tek başına verilmez."
        },
        "miniQuiz": {
            "question": "Aşağıdaki özelliklerden hangisi ani çarpıntı ve korku ataklarının birincil panik bozukluk yerine böbreküstü bezi kaynaklı tıbbi bir duruma bağlı olduğunu düşündürür?",
            "options": [
                "Atakların 40 yaş üstünde ilk kez başlaması, belirgin paroksismal hipertansiyon ve zonklayıcı baş ağrısının eşlik etmesi",
                "Atakların yalnızca topluluk önünde konuşurken olması",
                "Hastanın 18 yaşında ilk atağını geçirmesi",
                "Tansiyonun her zaman 110/70 mmHg ölçülmesi"
            ],
            "correctIndex": 0,
            "explanation": "Geç yaşta başlayan, kaçınma davranışının eşlik etmediği, 210/120 mmHg gibi paroksismal tansiyon sıçramaları, solukluk ve zonklayıcı baş ağrısıyla giden ataklar katekolamin deşarjını (feokromositoma) düşündürür."
        },
        "differentialDiagnosis": "• Panik Bozukluk: Fizyolojik bir tıbbi neden yoktur; beklenti kaygısı ve kaçınma davranışı belirgindir, paroksismal 210/120 mmHg hipertansiyon ve metanefrin yüksekliği görülmez.\n• Hastalık Kaygısı Bozukluğu (Hipokondriyazis): Odak ciddi bir hastalığa yakalanma korkusudur; altta yatan doğrudan katekolamin artışı yoktur.\n• Maddenin/İlacın Yol Açtığı Anksiyete Bozukluğu: Kafein, uyarıcı ya da başka etken madde maruziyeti yoktur.",
        "dsmCriteriaSummary": "DSM-5-TR: Tabloya egemen panik/kaygı atakları + Tıbbi durumun doğrudan patofizyolojik sonucu kanıtı + Başka ruhsal bozukluk ve deliryum dışlaması.",
        "therapyId": "supportive_psychotherapy",
        "pharmacologyId": "hydroxyzine_buspirone",
        "explanation": {
            "whyThis": [
                "Beş aydır süren ani çarpıntı, terleme, titreme ve ölüm korkusu atakları Kriter A'yı karşılar.",
                "Paroksismal hipertansiyon, idrarda 5 kat yüksek metanefrinler ve sol sürrenal kitle (feokromositoma), belirtilerin doğrudan katekolamin deşarjına bağlı olduğunu (Kriter B) kanıtlar.",
                "Cerrahi sonrası atakların tamamen sonlanması nedensel bağı kesinleştirir; agorafobik kaçınma ve madde kullanımı yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "panic_disorder",
                    "reason": "Belirtiler kanıtlanmış sürrenal kitle ve katekolamin fazlalığının doğrudan fizyolojik sonucudur; birincil panik bozukluk dışlanır."
                },
                {
                    "diagnosisId": "illness_anxiety_disorder",
                    "reason": "Temel sorun hastalık kapma uğraşı değil, nesnel hipertansif ve otonomik ataklardır."
                },
                {
                    "diagnosisId": "substance_induced_anxiety",
                    "reason": "Kafein, uyarıcı veya başka bir etken madde/ilaç kullanımı yoktur."
                }
            ],
            "teachingPoint": "Geç yaşta başlayan, dirençli paroksismal hipertansiyon ve zonklayıcı baş ağrısıyla giden panik benzeri ataklarda feokromositoma gibi tıbbi nedenler dışlanmalıdır."
        }
    },
    {
        "id": "case-159",
        "caseNumber": 159,
        "difficulty": "Orta",
        "course": "CHILD",
        "diagnosisId": "ptsd_preschool",
        "category": "TRAUMA",
        "patientSummary": "5 yaşında, kız çocuğu, anaokulu öğrencisi",
        "clues": [
            "5 yaşındaki anaokulu öğrencisi, 3 ay önce evlerinin mutfağında çıkan ve annesiyle birlikte yoğun duman içinden itfaiye tarafından kurtarıldıkları yangının ardından başlayan korkular ve davranış değişiklikleri nedeniyle getirildi.",
            "Annesi, kızının o günden beri geceleri çığlık atarak uyandığını, rüyasında ne gördüğünü tam anlatamasa da çok korktuğunu ve oyuncak bebeklerini her gün aynı şekilde 'dumanların içinden kurtarma' oyunu oynayarak tekrar tekrar canlandırdığını anlatıyor.",
            "Çocuğun mutfağa girmeyi ve ocak yakılmasını reddettiği, siren sesi duyduğunda annesinin bacağına yapışıp ağladığı, daha önce severek gittiği kreşte diğer çocuklarla oynamaktan çekilip köşede sessizce oturduğu öğreniliyor.",
            "Son iki aydır en ufak seste yerinden sıçradığı, uykuya dalmakta saatlerce zorlandığı, gün içinde beklenmedik şiddetli öfke nöbetleri geçirdiği ve 3 yaşından beri kazanılmış olan gece tuvalet kontrolünü kaybettiği bildiriliyor.",
            "Ruhsal Durum Muayenesinde: Muayene odasında annesinin yanından ayrılmıyor, oyun hamuruyla sürekli 'ateş ve itfaiye' yapıyor; yüz ifadesi gergin ve olumlu duygulanım belirgin azalmış. Fiziksel muayene ve nörolojik değerlendirme doğal.",
            "Yaşanan ağır tehdit olayının üzerinden 3 ay geçmiş olmasına karşın oyun içi yeniden canlandırma, hatırlatıcılardan kaçınma, sosyal geri çekilme, abartılı irkilme, öfke nöbetleri ve uyku bozukluğu aile ve kreş işlevselliğini belirgin biçimde bozuyor."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "oyuncak bebeklerini her gün aynı şekilde 'dumanların içinden kurtarma' oyunu oynayarak tekrar tekrar canlandırdığını",
                "dsmMatch": "Kriter B: İstenmeden gelen anıların oyunda yeniden canlandırılması"
            },
            {
                "clueIndex": 2,
                "text": "mutfağa girmeyi ve ocak yakılmasını reddettiği, siren sesi duyduğunda annesinin bacağına yapışıp ağladığı",
                "dsmMatch": "Kriter C: Hatırlatıcı yer ve uyaranlardan kaçınma / sosyal geri çekilme"
            },
            {
                "clueIndex": 3,
                "text": "en ufak seste yerinden sıçradığı, uykuya dalmakta saatlerce zorlandığı, gün içinde beklenmedik şiddetli öfke nöbetleri",
                "dsmMatch": "Kriter D: Abartılı irkilme, uyku bozukluğu ve öfke patlamaları (≥2 uyarılmışlık)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Çocuk-Ebeveyn Psikoterapisi (CPP) & Gelişime Uyarlanmış Travma Odaklı BDT",
            "therapyDetails": "Bakım verenin düzenleyici rolünü güçlendirme, güvenli oyun ortamında korku işlemleme, uyku ve ayrılık rutinlerini yapılandırma ve kreş öğretmeniyle işbirliği.",
            "pharmacologyNote": "6 yaş ve altında birinci basamak kesinlikle ebeveyn katılımlı psikoterapidir; ilaç tedavisi yalnızca ağır, dirençli uyarılmışlıkta uzman değerlendirmesiyle düşünülür."
        },
        "miniQuiz": {
            "question": "6 yaş ve altındaki küçük çocuklarda ağır korkutucu olay sonrası yeniden yaşantılama belirtisi en sık hangi biçimde gözlenir?",
            "options": [
                "Olayı kronolojik ve ayrıntılı sözel öykü olarak anlatma",
                "Olayın temalarını içeren tekrarlayıcı ve katı oyun canlandırmaları (travmatik oyun)",
                "Soyut felsefi suçluluk düşünceleri",
                "Yalnızca yazılı günlük tutma"
            ],
            "correctIndex": 1,
            "explanation": "Küçük çocuklar iç yaşantılarını yetişkinler gibi sözel ifade edemediğinden yeniden yaşantılama sıklıkla oyunda tekrarlayıcı canlandırma ve içeriği net anlatılamayan kâbuslar şeklinde görülür."
        },
        "differentialDiagnosis": "• Akut Stres Bozukluğu: Belirtiler olaydan sonraki 3 gün ile 1 ay arasında sürer; burada süre 3 aya ulaşmıştır.\n• Ayrılma Kaygısı Bozukluğu: Tek başına travmatik oyun, sirenle fizyolojik tetiklenme ve abartılı irkilmeyi açıklamaz.\n• Uyum Bozuklukları: Yaşamı tehdit eden olay sonrası özgül yeniden yaşantılama, kaçınma ve uyarılmışlık ölçütleri tam karşılandığında uyum bozukluğu konmaz.",
        "dsmCriteriaSummary": "DSM-5-TR: ≤6 yaş + Yaşam tehdidine maruziyet + ≥1 yeniden yaşantılama (travmatik oyun/kâbus) + ≥1 kaçınma/olumsuz değişiklik + ≥2 uyarılmışlık + >1 ay süre.",
        "therapyId": "parent_training",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "5 yaşındaki çocuk yangın tehlikesine doğrudan maruz kalmış (Kriter A); bunu oyunda tekrarlayıcı canlandırma ve korkulu rüyalarla yeniden yaşantılamaktadır (Kriter B).",
                "Mutfaktan kaçınma, sosyal geri çekilme ve olumlu duygu azalması Kriter C'yi; abartılı irkilme, öfke nöbetleri ve uyku güçlüğü Kriter D'yi karşılar.",
                "Sürenin 3 ay olması (>1 ay) ve kreş-aile işlevselliğinde belirgin bozulma gelişime uyarlanmış ölçütleri tamamlar."
            ],
            "whyNot": [
                {
                    "diagnosisId": "acute_stress_disorder",
                    "reason": "Belirtiler 1 aydan uzun süredir (3 aydır) devam etmektedir."
                },
                {
                    "diagnosisId": "separation_anxiety",
                    "reason": "Anneye yapışma yangın sonrasında başlamıştır ve travmatik oyun ile abartılı irkilmeyi tek başına açıklamaz."
                },
                {
                    "diagnosisId": "ptsd",
                    "reason": "Hasta 5 yaşındadır; DSM-5-TR'de 6 yaş ve altı için ayrı, davranışsal ağırlıklı ölçüt kümesi kullanılır."
                }
            ],
            "teachingPoint": "6 yaş ve altındaki çocuklarda travma tepkisi tekrarlayıcı oyun, içeriği belirsiz kâbuslar, öfke nöbetleri ve beceri gerilemesiyle ortaya çıkar; ayrı DSM-5-TR ölçütleriyle değerlendirilir."
        }
    },
    {
        "id": "case-160",
        "caseNumber": 160,
        "difficulty": "Zor",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "psychological_factors_affecting_medical",
        "category": "SOMATIC",
        "patientSummary": "53 yaşında, erkek, nakliye şirketi sahibi",
        "clues": [
            "53 yaşındaki nakliye şirketi sahibi, son 1 yılda üçüncü kez kontrolsüz hipertansif kriz ve göğüs ağrısı nedeniyle acil servise yatırılmasının ardından kardiyoloji servisi tarafından konsülte edildi.",
            "Kardiyoloji dosyasında hastada kanıtlanmış koroner arter hastalığı ve evre 2 hipertansiyon bulunduğu, önerilen üçlü ilaç tedavisinin tansiyonu hastane yatışlarında hızla kontrol altına aldığı belirtiliyor.",
            "Ancak hasta taburcu olduktan birkaç gün sonra 'ben güçlü adamım, günde beş hap içen hasta gibi yaşayamam' diyerek tansiyon ve kan sulandırıcı ilaçlarını kestiğini, göğsünde sıkışma olduğunda bile işi aksatmamak için saatlerce hastaneye gitmediğini söylüyor.",
            "Ayrıntılı görüşmede çökkün duygudurum, zevk kaybı, panik atak, yaygın kaygı ya da sanrı saptanmıyor; hastanın ilaçlarını kesme nedeni maddi sıkıntı ya da yan etki değil, hastalık tanısını inkar etmesi ve kırılgan görünmekten kaçınması.",
            "Ruhsal Durum Muayenesinde: Bilinç açık, bilişsel işlevler tam, düşünce akışı düzenli. Tıbbi riskler anlatıldığında 'bana bir şey olmaz, doktorlar abartıyor' şeklinde savunmacı ve küçümseyici tutum sergiliyor.",
            "Hastalığı inkar etme ve tedaviye sistematik uyumsuzluk davranışlarının doğrudan tekrarlayan acil yatışlara ve miyokard enfarktüsü riskinde ağır artışa yol açtığı, ancak bunların başka bir ruhsal bozuklukla açıklanamadığı değerlendiriliyor."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "kanıtlanmış koroner arter hastalığı ve evre 2 hipertansiyon",
                "dsmMatch": "Kriter A: Ruhsal bozukluk dışında kanıtlanmış tıbbi hastalık"
            },
            {
                "clueIndex": 2,
                "text": "tansiyon ve kan sulandırıcı ilaçlarını kestiğini, göğsünde sıkışma olduğunda bile işi aksatmamak için saatlerce hastaneye gitmediğini",
                "dsmMatch": "Kriter B: İnkar ve tedavi uyumsuzluğunun tıbbi gidişi ağırlaştırması"
            },
            {
                "clueIndex": 3,
                "text": "çökkün duygudurum, zevk kaybı, panik atak, yaygın kaygı ya da sanrı saptanmıyor",
                "dsmMatch": "Kriter C: Başka bir ruhsal bozuklukla daha iyi açıklanamama"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Motivasyonel Görüşme & Konsültasyon-Liyezon Psikoterapisi",
            "therapyDetails": "Yargılamadan inkarı ve kontrol ihtiyacını ele alma, sağlık inançlarını yeniden çerçeveleme, tedavi uyum planı oluşturma ve kardiyoloji ekibiyle eşgüdümlü izlem.",
            "pharmacologyNote": "Eşlik eden birincil depresyon veya anksiyete yoksa ek psikotrop ilaç gerekmez; odak kardiyolojik tedaviye uyumu sağlamaktır."
        },
        "miniQuiz": {
            "question": "Bu tanının Bedensel Belirti Bozukluğundan (Somatik Semptom Bozukluğu) temel farkı nedir?",
            "options": [
                "Burada altta yatan kanıtlanmış bir tıbbi hastalık vardır ve odak, psikolojik/davranışsal etkenlerin o hastalığın gidişini olumsuz etkilemesidir",
                "Hastada mutlaka felç veya körlük bulunmalıdır",
                "Belirtiler hasta tarafından bilinçli olarak taklit edilir",
                "Yalnızca çocukluk çağında tanı konur"
            ],
            "correctIndex": 0,
            "explanation": "Bedensel belirti bozukluğunda hasta belirtileri hakkında aşırı kaygı ve uğraş içindedir; bu tabloda ise inkar, tedavi uyumsuzluğu ya da stres gibi psikolojik etkenler mevcut tıbbi hastalığı kötüleştirir."
        },
        "differentialDiagnosis": "• Bedensel Belirti Bozukluğu (Somatik Semptom Bozukluğu): Belirtiler hakkında aşırı kaygı ve yoğun sağlık başvurusu vardır; burada tam tersine inkar ve tıbbi bakımdan kaçınma görülür.\n• Hastalık Kaygısı Bozukluğu (Hipokondriyazis): Kişi ciddi bir hastalığı olduğuna dair yoğun korku yaşar; burada kanıtlanmış hastalığı küçümseme vardır.\n• Yapay Bozukluk (Kendine Yüklenen / Münchausen Sendromu): Hasta rolünü benimsemek için bilinçli belirti üretimi vardır; burada hasta rolü reddedilmektedir.",
        "dsmCriteriaSummary": "DSM-5-TR: Kanıtlanmış tıbbi hastalık + Psikolojik/davranışsal etkenlerin seyre, tedaviye uyuma veya risklere olumsuz etkisi + Başka ruhsal bozuklukla açıklanamama.",
        "therapyId": "motivational_interviewing",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Hastada kanıtlanmış koroner arter hastalığı ve hipertansiyon bulunmaktadır (Kriter A).",
                "Hastalığı inkar etme, ilaçları bilinçli olarak kesme ve göğüs ağrısını görmezden gelme davranışları doğrudan tekrarlayan hipertansif krizlere ve yatışlara yol açmaktadır (Kriter B, ağır şiddet).",
                "Depresyon, anksiyete ya da psikotik bozukluk bulunmadığı için Kriter C karşılanır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "somatic_symptom_disorder",
                    "reason": "Hasta bedensel belirtileri hakkında aşırı kaygılı değildir; aksine ciddi hastalığını küçümsemekte ve tedaviyi reddetmektedir."
                },
                {
                    "diagnosisId": "illness_anxiety_disorder",
                    "reason": "Ciddi hastalık kapma korkusu yoktur; kanıtlanmış tıbbi hastalığını inkar etmektedir."
                },
                {
                    "diagnosisId": "factitious_disorder",
                    "reason": "Hasta rolünü aramak için belirti üretmiyor; tam tersine hasta kimliğini reddediyor."
                }
            ],
            "teachingPoint": "Psikolojik etkenler yalnızca aşırı kaygı yoluyla değil, hastalığı inkar ve tedavi uyumsuzluğu yoluyla da tıbbi tabloyu ağırlaştırabilir."
        }
    },
    {
        "id": "case-161",
        "caseNumber": 161,
        "difficulty": "Kolay",
        "course": "ADULT",
        "diagnosisId": "obstructive_sleep_apnea",
        "category": "SLEEP",
        "patientSummary": "51 yaşında, erkek, uzun yol tır şoförü (BKİ: 34.8 kg/m²)",
        "clues": [
            "51 yaşındaki tır şoförü, son 2 yıldır her gece 8 saat yatakta kalmasına rağmen sabahları baş ağrısı ve dinlenmemiş hissiyle uyanması, gündüz direksiyon başında sık sık gözlerinin kapanması nedeniyle başvurdu.",
            "Eşi, hastanın geceleri yan odadan duyulacak kadar yüksek sesle nefes aldığını, sık sık 15-20 saniye boyunca nefesinin tamamen durduğunu ve ardından boğulur gibi hırıltıyla sıçrayarak yeniden soluk aldığını anlatıyor.",
            "Hastada ani duygusal tetiklenmeyle kas gücü kaybı, uykuya dalarken felç ya da canlı düşler yok; hafta içi ve hafta sonu uyku saatleri düzenli ve alkol/sedatif kullanımı bulunmuyor.",
            "Fizik muayenede boyun çevresi 45 cm, hipertansiyon eşlik ediyor; boğaz muayenesinde yumuşak damak kalın ve hava yolu daralmış. Tiroid ve kan sayımı olağan.",
            "Ruhsal Durum Muayenesinde: Bilinç açık, duygudurum hafif sinirli ancak belirgin çökkünlük ya da anhedoni yok; dikkatini sürdürmede zorlandığı ve görüşme sırasında sıkça esnediği gözleniyor.",
            "Tüm gece polisomnografi incelemesinde göğüs ve karın solunum çabası sürerken hava akımının kesildiği olaylar saptanıyor; saat başına olay sayısı 38 (ağır düzey) ve en düşük oksijen satürasyonu %79 ölçülüyor."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "sık sık 15-20 saniye boyunca nefesinin tamamen durduğunu ve ardından boğulur gibi hırıltıyla sıçrayarak yeniden soluk aldığını",
                "dsmMatch": "Kriter A1: Tanık olunan gece solunum duraklamaları ve nefes nefese uyanma"
            },
            {
                "clueIndex": 0,
                "text": "sabahları baş ağrısı ve dinlenmemiş hissiyle uyanması, gündüz direksiyon başında sık sık gözlerinin kapanması",
                "dsmMatch": "Kriter A1: Yeterli uyku fırsatına karşın gündüz aşırı uykululuk ve dinlendirmeyen uyku"
            },
            {
                "clueIndex": 5,
                "text": "göğüs ve karın solunum çabası sürerken hava akımının kesildiği olaylar saptanıyor; saat başına olay sayısı 38",
                "dsmMatch": "Kriter A: Polisomnografide saatte ≥15 tıkayıcı solunum olayı (ağır düzey)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "CPAP (Sürekli Pozitif Hava Yolu Basıncı) & Yaşam Tarzı Düzenlemesi",
            "therapyDetails": "Gece CPAP cihazına uyum eğitimi, kilo verme programı, sırtüstü yatmaktan kaçınma, akşam alkol/sedatiften uzak durma ve trafik güvenliği danışmanlığı.",
            "pharmacologyNote": "Temel tedavi mekanik hava yolu desteğidir (CPAP); birincil psikotrop ilaç kullanılmaz, eşlik eden hipertansiyon düzenlenir."
        },
        "miniQuiz": {
            "question": "Polisomnografide bu tabloyu Santral Uyku Apnesinden ayıran temel fizyolojik bulgu hangisidir?",
            "options": [
                "Hava akımı durduğunda göğüs ve karın solunum çabasının devam etmesi",
                "Hava akımıyla birlikte solunum çabasının tamamen yok olması",
                "Sadece REM uykusunda kas felci görülmesi",
                "Uyku süresinin 3 saatten kısa olması"
            ],
            "correctIndex": 0,
            "explanation": "Üst solunum yolu fiziksel olarak tıkandığı için beyinden gelen solunum dürtüsü ve göğüs-karın hareketleri sürer; santral tipte ise solunum çabası da durur."
        },
        "differentialDiagnosis": "• Santral Uyku Apnesi: Hava akımı durduğunda göğüs-karın solunum çabası da yoktur; burada solunum çabası sürmektedir.\n• Narkolepsi: Katapleksi (duyguyla ani kas gevşemesi), uyku felci ve hipnagojik varsanılar görülür; burada yoktur.\n• Aşırı Uykululuk Bozukluğu (Hipersomnolans): Solunumla ilişkili uyku bozukluğu dışlanmadan konamaz; burada polisomnografide saatte 38 tıkayıcı olay saptanmıştır.",
        "dsmCriteriaSummary": "DSM-5-TR: Polisomnografide saatte ≥5 tıkayıcı apne/hipopne + gece solunum belirtileri/gündüz uykululuk (veya belirtisiz ≥15/saat).",
        "therapyId": "cbt_i",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "Tanık olunan gece solunum duraklamaları, hırıltılı uyanma, sabah baş ağrısı ve gündüz aşırı uykululuk klinik ölçütleri karşılar.",
                "Polisomnografide solunum çabası sürerken saatte 38 tıkayıcı olay ve %79'a düşen desatürasyon saptanması ağır düzeyde tanıyı kesinleştirir.",
                "Obezite, kalın boyun çevresi ve dar faringeal hava yolu tipik risk etmenleridir; katapleksi veya santral çaba yokluğu yoktur."
            ],
            "whyNot": [
                {
                    "diagnosisId": "central_sleep_apnea",
                    "reason": "Solunum duraklamaları sırasında göğüs ve karın solunum çabası devam etmektedir; mekanizma üst hava yolu tıkanmasıdır."
                },
                {
                    "diagnosisId": "narcolepsy",
                    "reason": "Katapleksi, uyku felci veya hipnagojik varsanı yoktur; uykululuk polisomnografideki solunum tıkanmalarına bağlıdır."
                },
                {
                    "diagnosisId": "hypersomnolence",
                    "reason": "Aşırı uykululuk tanısı solunumla ilişkili uyku bozukluğu varsa konmaz."
                }
            ],
            "teachingPoint": "Gündüz aşırı uykululuk, sabah baş ağrısı ve tanık olunan solunum duraklamalarında polisomnografide solunum çabası sürüyorsa tıkayıcı tip tanı konur."
        }
    },
    {
        "id": "case-162",
        "caseNumber": 162,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "circadian_rhythm_sleep_wake",
        "category": "SLEEP",
        "patientSummary": "21 yaşında, erkek, mimarlık öğrencisi",
        "clues": [
            "21 yaşındaki mimarlık öğrencisi, son 1.5 yıldır sabah 09.00 derslerine yetişemediği, geceleri saatlerce yatağında dönüp uyuyamadığı ve gündüz derslerde uyukladığı için başvurdu.",
            "Ayrıntılı uyku öyküsünde gece 23.30'da yatağa girmesine karşın neredeyse hiçbir gece 03.30-04.00'ten önce uykuya dalamadığı, sabah 07.30'da üç farklı alarmla güçlükle uyandığı ve devamsızlıktan iki dersten kaldığı öğreniliyor.",
            "Buna karşın yaz tatillerinde ve yarıyıl aralarında kendi istediği saatte (04.00 civarı) yatıp 12.00'de uyandığında uykuya hemen daldığını, gece hiç uyanmadığını ve gün boyu tamamen dinç, enerjik hissettiğini belirtiyor.",
            "Akşam saatlerinde kafein, enerji içeceği ya da uyarıcı madde tüketmiyor; gece horlama, solunum durması veya bacaklarda huzursuzluk hissi yok. Tıbbi tetkikleri olağan.",
            "Ruhsal Durum Muayenesinde: Duygudurum ötimik, depresif çökkünlük ya da yatakta felaketleştirici kaygı düşünceleri yok; yalnızca toplumsal takvime uyamamanın yarattığı bezginlik mevcut.",
            "İki haftalık uyku günlüğü ve bilek aktigrafisinde uyku başlangıcı ve uyanma zamanlarının istenen saatlerden tutarlı biçimde 3-4 saat ileri kaydığı, ancak toplam uyku süresi ve kalitesinin kendi düzeninde tamamen normal olduğu doğrulanıyor."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "neredeyse hiçbir gece 03.30-04.00'ten önce uykuya dalamadığı, sabah 07.30'da üç farklı alarmla güçlükle uyandığı",
                "dsmMatch": "Kriter A & B: İçsel zamanlama ile toplumsal program uyumsuzluğuna bağlı uykusuzluk ve gündüz uykululuk"
            },
            {
                "clueIndex": 2,
                "text": "kendi istediği saatte (04.00 civarı) yatıp 12.00'de uyandığında uykuya hemen daldığını, gece hiç uyanmadığını ve gün boyu tamamen dinç",
                "dsmMatch": "Ayırıcı Özellik: Kendi programına bırakıldığında uyku kalitesinin tamamen normal olması"
            },
            {
                "clueIndex": 5,
                "text": "aktigrafisinde uyku başlangıcı ve uyanma zamanlarının istenen saatlerden tutarlı biçimde 3-4 saat ileri kaydığı",
                "dsmMatch": "Belirleyici: Gecikmiş uyku evresi tipi (2 saatten fazla kayma)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Zamanlanmış Parlak Işık Terapisi & Kronoterapi / Uyku Hijyeni",
            "therapyDetails": "Uyanma sonrası sabah parlak ışık maruziyeti, akşam saatlerinde mavi ışıktan kaçınma, uyku-uyanma saatlerinin kademeli öne çekilmesi ve düzenli hafta sonu takvimi.",
            "pharmacologyNote": "Akşam hedeflenen uyku saatinden birkaç saat önce düşük doz melatonin (kronobiyotik etki) eklenebilir; klasik hipnotikler birinci basamak değildir."
        },
        "miniQuiz": {
            "question": "Bu tabloyu Kronik Uykusuzluk Bozukluğundan (İnsomni) ayıran en belirgin klinik bulgu nedir?",
            "options": [
                "Kişi kendi içsel saatine uygun saatlerde uyuduğunda uyku süresi ve kalitesinin tamamen normal olması",
                "Hastanın hiçbir zaman 3 saatten fazla uyuyamaması",
                "Gece boyunca sık sık kâbus görmesi",
                "Yalnızca 65 yaş üstünde görülmesi"
            ],
            "correctIndex": 0,
            "explanation": "Kronik insomnide kişi istediği saatte yatsa bile uykuya dalma/sürdürme güçlüğü sürer; bu bozuklukta ise uyku mekanizması sağlamdır, sorun yalnızca zamanlamanın çevreyle uyumsuzluğudur."
        },
        "differentialDiagnosis": "• Uykusuzluk Bozukluğu (Kronik İnsomni): Kişi kendi programına bırakıldığında da uykuya dalmakta ya da sürdürmekte zorlanır.\n• Aşırı Uykululuk Bozukluğu (Hipersomnolans): Yeterli ve düzenli uykuya karşın gündüz uykululuk sürer; burada tatilde uyku normaldir.\n• Majör Depresif Bozukluk: Çökkün duygudurum ve anhedoni eşlik eder; burada duygudurum ötimiktir.",
        "dsmCriteriaSummary": "DSM-5-TR: İçsel uyku-uyanıklık zamanlaması ile çevre/program arasında süregen uyumsuzluk + Uykusuzluk/gündüz uykululuk + İşlev kaybı (gecikmiş uyku evresi tipi).",
        "therapyId": "cbt_i",
        "pharmacologyId": "psychotherapy_first_no_drug",
        "explanation": {
            "whyThis": [
                "1.5 yıldır süren, 03.30-04.00'ten önce uyuyamama ve sabah uyanamama durumu ders başarısını bozmuştur (Kriter A-C).",
                "Tatillerde 04.00-12.00 arasında dinlendirici ve kesintisiz uyuyabilmesi, sorunun uyku üretimi değil zamanlama kayması olduğunu gösterir.",
                "Aktigrafi ve uyku günlüğü 3-4 saatlik tutarlı gecikmiş uyku evresini doğrulamıştır; madde, apne ve depresyon dışlanmıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "insomnia_disorder",
                    "reason": "Kendi istediği saatlerde uyuduğunda uykuya dalma ve sürdürme tamamen normaldir."
                },
                {
                    "diagnosisId": "hypersomnolence",
                    "reason": "Gündüz uykululuk yalnızca erken kalkmak zorunda kaldığı günlerdeki uyku borcuna bağlıdır; 8 saat uyuduğunda tamamen dinçtir."
                },
                {
                    "diagnosisId": "mdd",
                    "reason": "Duygudurum ötimiktir; çökkünlük veya zevk kaybı bulunmamaktadır."
                }
            ],
            "teachingPoint": "Kendi uyku saatlerine bırakıldığında tamamen normal ve dinlendirici uyuyan ama okul/iş takvimine uyamayan gençte insomni değil sirkadiyen zamanlama kayması düşünülmelidir."
        }
    },
    {
        "id": "case-163",
        "caseNumber": 163,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "delayed_ejaculation",
        "category": "SEXUAL",
        "patientSummary": "37 yaşında, erkek, yazılım mimarı",
        "clues": [
            "37 yaşındaki evli yazılım mimarı, son 10 aydır eşiyle cinsel birlikteliklerinde tam sertleşme sağlamasına ve yüksek istek duymasına karşın doruğa ulaşmakta çok zorlandığı için üroloji değerlendirmesinin ardından psikiyatriye başvurdu.",
            "Hasta, cinsel birleşmenin 40-50 dakika sürmesine rağmen çoğu kez boşalamadan yorulup durmak zorunda kaldıklarını, bu durumun eşiyle son 10 aydaki karşılaşmaların neredeyse tamamında (%90'ında) istemediği hâlde yaşandığını anlatıyor.",
            "Eşinin bu durum nedeniyle kendini çekici bulmadığını düşünüp üzüldüğünü, kendisinin de artık cinsel yakınlaşma öncesinde yoğun gerginlik ve başarısızlık sıkıntısı yaşadığını aktarıyor; çiftin evlilik iletişiminde şiddet ya da ağır çatışma yok.",
            "Ürolojik muayene, serum testosteron, prolaktin, TSH ve açlık kan şekeri olağan. Hasta SSRI, antipsikotik, tansiyon ilacı ya da düzenli alkol kullanmıyor; pelvik cerrahi öyküsü yok.",
            "Ruhsal Durum Muayenesinde: Duygudurum ötimik, depresif belirti yok. Cinsel öyküde yıllardır çok hızlı ve yüksek basınçlı özgün bir mastürbasyon alışkanlığı geliştirdiği, yalnızken 5 dakikada sonuca ulaşabildiği ancak partnerle aynı uyarımı alamadığı öğreniliyor.",
            "Belirtilerin 6 aydan uzun süredir hemen her partnerli ilişkide istemsiz biçimde sürdüğü, belirgin kişisel sıkıntıya yol açtığı ve hiçbir ilaç ya da tıbbi durumla açıklanamadığı netleşiyor."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "cinsel birleşmenin 40-50 dakika sürmesine rağmen çoğu kez boşalamadan yorulup durmak zorunda kaldıklarını, bu durumun eşiyle son 10 aydaki karşılaşmaların neredeyse tamamında (%90'ında) istemediği hâlde yaşandığını",
                "dsmMatch": "Kriter A & B: Partnerli etkinliğin %75-100'ünde ≥6 ay süren istemsiz gecikme/yokluk"
            },
            {
                "clueIndex": 2,
                "text": "cinsel yakınlaşma öncesinde yoğun gerginlik ve başarısızlık sıkıntısı yaşadığını",
                "dsmMatch": "Kriter C: Klinik açıdan belirgin sıkıntı"
            },
            {
                "clueIndex": 3,
                "text": "SSRI, antipsikotik, tansiyon ilacı ya da düzenli alkol kullanmıyor",
                "dsmMatch": "Kriter D: İlaç/madde ve tıbbi nedenlerin dışlanması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Cinsel Terapi (Duyusal Odaklanma & Uyarım Yeniden Koşullandırma)",
            "therapyDetails": "Performans baskısını azaltan duyusal odaklanma egzersizleri, alışkanlık hâline gelmiş yüksek basınçlı solo uyarım biçiminin değiştirilmesi ve çift iletişiminin güçlendirilmesi.",
            "pharmacologyNote": "Onaylı özgül bir ilacı yoktur; temel tedavi cinsel terapidir. Seçilmiş olgularda dopaminerjik destek (ör. bupropion) değerlendirilebilir."
        },
        "miniQuiz": {
            "question": "Bu cinsel işlev bozukluğunda tanı koymadan önce dışlanması gereken en sık iatrojenik (ilaç kaynaklı) etken grubu hangisidir?",
            "options": [
                "SSRI grubu antidepresanlar",
                "Vitamin D takviyeleri",
                "Mide koruyucu antasitler",
                "Lokal göz damlaları"
            ],
            "correctIndex": 0,
            "explanation": "SSRI'lar (serotonin geri alım inhibitörleri) serotonerjik etkiyle boşalma refleksini belirgin biçimde geciktirebilir; tanı için ilaç kaynaklı neden mutlaka dışlanmalıdır."
        },
        "differentialDiagnosis": "• Maddenin/İlacın Yol Açtığı Cinsel İşlev Bozukluğu: SSRI, antipsikotik ya da alkol kullanımına bağlıdır; burada hiçbir etken madde yoktur.\n• Sertleşme Bozukluğu (Erektil Bozukluk): Sorun sertleşmenin sağlanması veya sürdürülmesindedir; burada sertleşme tamdır.\n• Erkekte Düşük Cinsel İstek Bozukluğu: Cinsel istek ve fanteziler belirgin azalmıştır; burada istek yüksektir.",
        "dsmCriteriaSummary": "DSM-5-TR: Partnerli etkinliğin ~%75-100'ünde istemsiz belirgin gecikme/yokluk + ≥6 ay süre + Belirgin sıkıntı + İlaç/tıbbi/ilişki dışı açıklama.",
        "therapyId": "sensate_focus",
        "pharmacologyId": "bupropion_ndri",
        "explanation": {
            "whyThis": [
                "10 aydır partnerle karşılaşmaların %90'ında kişi istemediği hâlde sürenin aşırı uzaması veya doruğa ulaşılamaması Kriter A ve B'yi karşılar.",
                "Durum hem hastada hem ilişkide belirgin sıkıntıya yol açmaktadır (Kriter C).",
                "Normal hormon/nörolojik değerlendirme, ilaç/madde yokluğu ve sertleşme ile isteğin korunması diğer nedenleri dışlar."
            ],
            "whyNot": [
                {
                    "diagnosisId": "substance_induced_sexual_dysfunction",
                    "reason": "Hasta SSRI, antipsikotik, tansiyon ilacı ya da düzenli alkol kullanmamaktadır."
                },
                {
                    "diagnosisId": "erectile_disorder",
                    "reason": "Sertleşme tam olarak sağlanmakta ve sürdürülmektedir."
                },
                {
                    "diagnosisId": "male_hypoactive_desire",
                    "reason": "Cinsel istek yüksek düzeydedir; sorun istek fazında değil orgazm/boşalma fazındadır."
                }
            ],
            "teachingPoint": "Sertleşme ve cinsel isteğin korunduğu, ilaç/tıbbi nedenlerin dışlandığı 6 ayı aşan partnerli boşalma güçlüğünde özgün mastürbasyon alışkanlıkları önemli bir ipucudur."
        }
    },
    {
        "id": "case-164",
        "caseNumber": 164,
        "difficulty": "Orta",
        "course": "ADULT",
        "diagnosisId": "female_sexual_interest_arousal",
        "category": "SEXUAL",
        "patientSummary": "34 yaşında, kadın, veteriner hekim",
        "clues": [
            "34 yaşındaki evli veteriner hekim, son 9 aydır cinselliğe karşı neredeyse hiç ilgi duymadığı ve eşinin yakınlaşmalarından kaçındığı için kendi isteğiyle polikliniğe başvurdu.",
            "Hasta, aklına hiç erotik düşünce ya da fantezi gelmediğini, son dokuz aydır hiçbir zaman ilk adımı atmadığını ve eşinin girişimlerine çoğunlukla kapalı kaldığını anlatıyor.",
            "Yakınlaşma gerçekleştiğinde ise karşılaşmaların neredeyse tamamında bedensel bir heyecan, haz ya da genital bölgede duyusal yanıt hissedemediğini; romantik film ya da dokunma gibi uyaranların da eskisi gibi tepki oluşturmadığını belirtiyor.",
            "Jinekoloji muayenesi, tiroid, prolaktin, östrojen ve demir düzeyleri olağan. Doğum kontrol hapı ya da antidepresan kullanmıyor; cinsel birleşme sırasında ağrı ya da kasılma yaşamıyor.",
            "Ruhsal Durum Muayenesinde: Duygudurum ötimik, uyku ve iştah düzenli, günlük işinden ve hobilerinden keyif alıyor. Eşini sevdiğini, evliliklerinde şiddet ya da ağır çatışma olmadığını, ancak bu durumun kendisinde yoğun suçluluk ve üzüntü yarattığını ifade ediyor.",
            "Belirtilerin 9 aydır sürdüğü, altı temel alandan beşinde belirgin azalma bulunduğu, hastanın kendisini aseksüel olarak tanımlamadığı ve durumun belirgin kişisel sıkıntı oluşturduğu doğrulanıyor."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "aklına hiç erotik düşünce ya da fantezi gelmediğini, son dokuz aydır hiçbir zaman ilk adımı atmadığını ve eşinin girişimlerine çoğunlukla kapalı kaldığını",
                "dsmMatch": "Kriter A2 & A3: Cinsel fantezilerde azalma ve başlatmama/kapalı olma"
            },
            {
                "clueIndex": 2,
                "text": "karşılaşmaların neredeyse tamamında bedensel bir heyecan, haz ya da genital bölgede duyusal yanıt hissedemediğini",
                "dsmMatch": "Kriter A4 & A6: Heyecan/haz ve genital duyumlarda azalma (%75-100)"
            },
            {
                "clueIndex": 4,
                "text": "kendisinde yoğun suçluluk ve üzüntü yarattığını",
                "dsmMatch": "Kriter C: Klinik açıdan belirgin sıkıntı"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bilinçli Farkındalık Temelli Cinsel Terapi & Duyusal Odaklanma",
            "therapyDetails": "Beden farkındalığını artırma, performans baskısı olmadan duyusal odaklanma egzersizleri, yanıtsal istek modelinin psikoeğitimi ve çift iletişiminin desteklenmesi.",
            "pharmacologyNote": "Birincil yaklaşım cinsel terapidir; seçilmiş premenopozal ve dirençli olgularda dopaminerjik ajanlar (ör. bupropion) veya santral etkili seçenekler uzman değerlendirmesiyle düşünülebilir."
        },
        "miniQuiz": {
            "question": "DSM-5-TR'ye göre bu tanının konulabilmesi için aşağıdaki koşullardan hangisi zorunludur?",
            "options": [
                "Belirtilerin en az 6 ay sürmesi, 6 alandan en az 3'ünde belirgin azalma olması ve kişide belirgin sıkıntı yaratması",
                "Kişinin yaşam boyu kendisini aseksüel olarak tanımlaması",
                "Cinsel birleşme sırasında mutlaka şiddetli pelvik ağrı bulunması",
                "Belirtilerin yalnızca 2 haftadır sürmesi"
            ],
            "correctIndex": 0,
            "explanation": "Tanı için 6 alandan en az 3'ünde yaklaşık 6 ay süren azalma ve kişinin kendisinde belirgin sıkıntı şarttır; kendini aseksüel olarak tanımlayan ve bundan sıkıntı duymayan kişiye tanı konmaz."
        },
        "differentialDiagnosis": "• Genito-Pelvik Ağrı/Penetrasyon Bozukluğu (Vajinismus / Disparoni): Temel sorun birleşme sırasında ağrı veya pelvik kasılmadır; burada ağrı yoktur.\n• Majör Depresif Bozukluk: Genel anhedoni ve çökkün duygudurum bulunur; burada hasta işinden ve hobilerinden keyif almaktadır.\n• Kadında Orgazm Bozukluğu (Anorgazmi): Cinsel ilgi ve uyarılma normaldir, sorun yalnızca orgazma ulaşamamadır.",
        "dsmCriteriaSummary": "DSM-5-TR: 6 cinsel ilgi/uyarılma alanından ≥3'ünde azalma + ≥6 ay süre + Kişide belirgin sıkıntı + Tıbbi/ilaç/ruhsal/ilişki dışı açıklama.",
        "therapyId": "sensate_focus",
        "pharmacologyId": "bupropion_ndri",
        "explanation": {
            "whyThis": [
                "Erotik düşünce yokluğu, başlatmama, uyaranlara tepkisizlik, haz/heyecan ve genital duyum kaybı ile Kriter A'nın 6 maddesinden 5'i karşılanmıştır (eşik ≥3).",
                "Süre 9 aydır (≥6 ay) ve hastada belirgin kişisel sıkıntıya yol açmaktadır.",
                "Normal jinekolojik/hormonal tetkikler, ilaçsızlık, ağrı olmaması ve depresyon ya da ağır ilişki çatışmasının dışlanması tanıyı netleştirir."
            ],
            "whyNot": [
                {
                    "diagnosisId": "female_orgasmic_disorder",
                    "reason": "Sorun yalnızca orgazma ulaşamamakla sınırlı değildir; başlangıçtaki ilgi, fantezi ve uyarılma fazları da belirgin azalmıştır."
                },
                {
                    "diagnosisId": "genito_pelvic_pain",
                    "reason": "Cinsel birleşme sırasında ağrı ya da pelvik kas kasılması bulunmamaktadır."
                },
                {
                    "diagnosisId": "mdd",
                    "reason": "Duygudurum ötimiktir ve cinsellik dışındaki yaşam alanlarında zevk alma korunmuştur."
                }
            ],
            "teachingPoint": "DSM-5-TR kadınlarda cinsel istek ve uyarılmayı tek tanıda birleştirir; tanı için en az 6 ay süre, 6 alandan 3'ü ve kişinin kendi sıkıntısı şarttır."
        }
    },
    {
        "id": "case-165",
        "caseNumber": 165,
        "difficulty": "Kolay",
        "course": "SUBSTANCE",
        "diagnosisId": "alcohol_withdrawal_delirium",
        "category": "SUBSTANCE",
        "patientSummary": "55 yaşında, erkek, marangoz ustası",
        "clues": [
            "55 yaşındaki marangoz ustası, merdivenden düşüp uyluk kemiği kırıldığı için yatırıldığı ortopedi servisinde, yatışının 3. gecesinde aniden gelişen şiddetli huzursuzluk, bağırıp çağırma ve yataktan kalkmaya çalışma nedeniyle acil konsülte edildi.",
            "Ailesinden alınan öyküde hastanın son 20 yıldır her gün yaklaşık bir büyük şişe rakı içtiği, hastaneye yattığı günden beri (72 saattir) hiç içki almadığı ve 2 yıl önce de benzer bir kesilme döneminde hastanelik olduğu öğreniliyor.",
            "Hasta çarşafının üzerinde yüzlerce küçük siyah böcek yürüdüğünü söyleyerek elleriyle onları silkeliyor, hemşireyi eski komşusu sanıyor ve gece yarısı atölyede olduğunu iddia ediyor; bir saat sonra kısa süreli sakinleşip ardından yeniden ajite oluyor.",
            "Fizik muayenede ateş 38.7 °C, nabız 134/dk, kan basıncı 178/106 mmHg, yaygın terleme ve ellerde kaba titreme saptanıyor. Kan şekeri, akciğer grafisi ve beyin BT olağan; göz hareketlerinde felç ya da belirgin ataksi yok.",
            "Ruhsal Durum Muayenesinde: Bilinç bulanık ve gün içinde dalgalı, dikkat sürdürülemiyor, yer-zaman yönelimi tamamen bozuk. Canlı görsel ve dokunsal varsanılar, belirgin korku ve psikomotor ajitasyon tabloya egemen.",
            "Ağır uzun süreli içki kullanımının ani kesilmesinden 72 saat sonra gelişen bu otonom fırtına, kaba titreme, canlı görsel varsanı ve dalgalı bilinç bulanıklığı tablosu yoğun bakım izlemine alınıyor."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "son 20 yıldır her gün yaklaşık bir büyük şişe rakı içtiği, hastaneye yattığı günden beri (72 saattir) hiç içki almadığı",
                "dsmMatch": "Etiyoloji: Ağır uzun süreli alkol kullanımının kesilmesinden 2-3 gün sonra başlangıç"
            },
            {
                "clueIndex": 4,
                "text": "Bilinç bulanık ve gün içinde dalgalı, dikkat sürdürülemiyor, yer-zaman yönelimi tamamen bozuk",
                "dsmMatch": "Deliryum Ölçütü: Dikkat, farkındalık ve yönelimde akut dalgalı bozulma"
            },
            {
                "clueIndex": 3,
                "text": "ateş 38.7 °C, nabız 134/dk, kan basıncı 178/106 mmHg, yaygın terleme ve ellerde kaba titreme",
                "dsmMatch": "Klinik Bulgu: Ağır otonom hiperaktivite ve kaba tremor"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Acil Tıbbi Stabilizasyon, Yoğun Bakım İzlemi & Sonrasında Bırakma Desteği",
            "therapyDetails": "Sıvı-elektrolit dengesi (özellikle magnezyum, potasyum), glukoz öncesi parenteral tiamin profilaksisi, güvenli ortam ve tablo yatışınca bağımlılık tedavisi.",
            "pharmacologyNote": "Temel tedavi belirti güdümlü damar içi benzodiazepinlerdir (lorazepam/diazepam) ve mutlaka yüksek doz parenteral tiamin eşlik eder."
        },
        "miniQuiz": {
            "question": "Ağır alkol kesilmesi sonrası gelişen bu acil tablo tipik olarak son içkiden kaç saat sonra ortaya çıkar ve birinci basamak tedavisi nedir?",
            "options": [
                "İlk 2 saat içinde; yüksek doz haloperidol",
                "48-72 saat sonra; belirti güdümlü benzodiazepinler, sıvı-elektrolit ve parenteral tiamin",
                "3 hafta sonra; tek başına SSRI",
                "6 saat sonra; beta-blokör monoterapisi"
            ],
            "correctIndex": 1,
            "explanation": "Tablo tipik olarak son içkiden 48-72 saat sonra başlar; mortaliteyi düşüren temel tedavi benzodiazepinler, sıvı-elektrolit desteği ve Wernicke profilaksisi için parenteral tiamindir."
        },
        "differentialDiagnosis": "• Alkol Yoksunluğu: Bilinç açık ve yer-zaman yönelimi korunmuştur; burada dalgalı bilinç bulanıklığı ve yönelim kaybı baskındır.\n• Deliryum (Akut Bilinç Bulanıklığı): Genel tıbbi nedenlere (enfeksiyon, hipoglisemi, subdural hematom) bağlıdır; burada doğrudan 72 saatlik alkol kesilmesi etiyolojisi kanıtlanmıştır.\n• Alkolün Yol Açtığı Majör Nörobilişsel Bozukluk (Amnestik-Konfabulatuvar Tip / Korsakoff): Bilinç açıktır, kronik anterograd amnezi ve konfabulasyon ön plandadır.",
        "dsmCriteriaSummary": "DSM-5-TR: Dalgalı dikkat/farkındalık ve yönelim bozukluğu (deliryum) + Ağır alkol kesilmesiyle zamansal bağ + Otonom hiperaktivite ve canlı varsanılar.",
        "therapyId": "medical_stabilization",
        "pharmacologyId": "lorazepam_catatonia",
        "explanation": {
            "whyThis": [
                "Yirmi yıllık ağır içki kullanımının kırık yatışı nedeniyle ani kesilmesinden 72 saat sonra akut ve dalgalı bilinç-dikkat bozukluğu gelişmiştir.",
                "Yönelim kaybı, çarşafta böcek görme (canlı görsel/dokunsal varsanı), ateş, taşikardi, hipertansiyon ve kaba titreme klasik ağır yoksunluk deliryumu tablosudur.",
                "Beyin BT, kan şekeri ve enfeksiyon taraması olağan olduğu için diğer deliryum nedenleri dışlanmıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "alcohol_withdrawal",
                    "reason": "Komplike olmayan yoksunlukta bilinç açık ve yönelim tamdır; deliryum geliştiğinde bu tanı onun yerini alır."
                },
                {
                    "diagnosisId": "delirium",
                    "reason": "Etiyoloji genel bir tıbbi durum değil, doğrudan 72 saatlik ağır alkol kesilmesidir."
                },
                {
                    "diagnosisId": "wernicke_korsakoff_syndrome",
                    "reason": "Oftalmopleji veya kronik konfabulatuvar amnezi yerine akut otonom fırtına ve dalgalı bilinç ön plandadır."
                }
            ],
            "teachingPoint": "Ağır alkol kesilmesinden 48-72 saat sonra ateş, taşikardi, kaba titreme ve canlı varsanılarla dalgalı bilinç bulanıklığı geliştiğinde acil benzodiazepin ve tiamin gerekir."
        }
    },
    {
        "id": "case-166",
        "caseNumber": 166,
        "difficulty": "Orta",
        "course": "SUBSTANCE",
        "diagnosisId": "opioid_withdrawal",
        "category": "SUBSTANCE",
        "patientSummary": "28 yaşında, erkek, oto yıkama çalışanı",
        "clues": [
            "28 yaşındaki oto yıkama çalışanı, son 24 saattir dayanılmaz yaygın kas ve kemik ağrıları, şiddetli bulantı, sulu ishal ve yoğun huzursuzluk yakınmalarıyla gece yarısı acil servise başvurdu.",
            "Hasta, son 2 yıldır her gün damar yoluyla ya da burundan yasa dışı ağrı kesici-uyuşturucu madde kullandığını, parasız kaldığı için son 36 saattir maddeye ulaşamadığını ve 'vücudum mengenede sıkılıyor gibi' hissettiğini anlatıyor.",
            "Muayene sırasında sürekli esnediği, gözlerinden yaş ve burnundan berrak akıntı geldiği, iki gecedir hiç uyuyamadığı ve yoğun karamsarlık içinde acil rahatlama talep ettiği gözleniyor.",
            "Fizik muayenede her iki göz bebeği belirgin genişlemiş (midriyazis, 6 mm), kollarında tüylerin dikleşmesi (piloereksiyon), terleme, hafif ateş (37.8 °C) ve artmış bağırsak sesleri saptanıyor. Kan basıncı 135/85 mmHg, bilinç tamamen açık.",
            "Ruhsal Durum Muayenesinde: Yer, zaman ve kişi yönelimi tam; sanrı, varsanı ya da nöbet yok. Duygudurum belirgin disforik ve gergin, maddeye yönelik yoğun aşerme mevcut.",
            "Klinik tablo, yoğun ve uzun süreli madde kullanımının ani kesilmesinden saatler sonra gelişen 9 ölçüt belirtisinin tamamını karşılıyor; sağlıklı erişkinde çok ıstıraplı olmakla birlikte yaşamı tehdit eden otonom çöküş izlenmiyor."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "son 2 yıldır her gün damar yoluyla ya da burundan yasa dışı ağrı kesici-uyuşturucu madde kullandığını, parasız kaldığı için son 36 saattir maddeye ulaşamadığını",
                "dsmMatch": "Kriter A1: Yoğun ve uzun süreli opioid kullanımının bırakılması/azaltılması"
            },
            {
                "clueIndex": 2,
                "text": "sürekli esnediği, gözlerinden yaş ve burnundan berrak akıntı geldiği, iki gecedir hiç uyuyamadığı",
                "dsmMatch": "Kriter B: Esneme, lakrimasyon/rinore ve uykusuzluk"
            },
            {
                "clueIndex": 3,
                "text": "her iki göz bebeği belirgin genişlemiş (midriyazis, 6 mm), kollarında tüylerin dikleşmesi (piloereksiyon), terleme",
                "dsmMatch": "Kriter B5: Midriyazis, piloereksiyon ve terleme (≥3/9 ölçütü aşılır)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Motivasyonel Görüşme & AMATEM Sürdürüm Programı",
            "therapyDetails": "Akut tablo yatıştıktan sonra motivasyonel görüşme, nüks önleme, tolerans kaybına bağlı doz aşımı riskinin anlatılması ve uzun dönem tedaviye yönlendirme.",
            "pharmacologyNote": "Klinik değerlendirmeye göre parsiyel agonist (buprenorfin/nalokson) veya semptomatik klonidin, bulantı-ishal ve kas ağrısı desteği uygulanır."
        },
        "miniQuiz": {
            "question": "Aşağıdaki fizik muayene bulgusu çiftlerinden hangisi bu kesilme tablosunu, aynı maddenin zehirlenmesinden (intoksikasyon) kesin biçimde ayırır?",
            "options": [
                "Göz bebeklerinde genişleme (midriyazis) ve tüylerin dikleşmesi (piloereksiyon)",
                "Toplu iğne başı göz bebekleri (miyozis) ve solunum baskılanması",
                "Yalnızca kan şekeri yüksekliği",
                "Tek taraflı yüz felci"
            ],
            "correctIndex": 0,
            "explanation": "Opioid zehirlenmesinde toplu iğne başı göz bebekleri (miyozis) ve solunum depresyonu görülürken; kesilme sendromunda noradrenerjik artışla midriyazis, piloereksiyon, lakrimasyon, ishal ve kas ağrıları gelişir."
        },
        "differentialDiagnosis": "• Opioid Zehirlenmesi (Miyozis, Solunum Depresyonu): Göz bebekleri daralmıştır (miyozis), solunum yavaşlar ve uyuklama vardır; burada midriyazis ve uykusuzluk vardır.\n• Alkol Yoksunluğu: Kaba titreme, nöbet ve deliryum riski taşır; burun/göz akıntısı, esneme ve piloereksiyon tipik değildir.\n• Sedatif/Benzodiazepin Yoksunluğu: Ağır otonom dengesizlik ve nöbet riski ön plandadır; opioid kullanım öyküsü ve grip benzeri lakrimasyon/piloereksiyon yoktur.",
        "dsmCriteriaSummary": "DSM-5-TR: Uzun süreli opioid kesilmesi/antagonist + ≥3/9 belirti (disfori, bulantı/kusma, kas ağrısı, lakrimasyon/rinore, midriyazis/piloereksiyon/terleme, ishal, esneme, ateş, uykusuzluk).",
        "therapyId": "motivational_interviewing",
        "pharmacologyId": "buprenorphine_naloxone",
        "explanation": {
            "whyThis": [
                "İki yıllık günlük kullanımın 36 saat önce kesilmesiyle (Kriter A) disfori, bulantı, kas ağrısı, gözyaşı/burun akıntısı, midriyazis, piloereksiyon, ishal, esneme, hafif ateş ve uykusuzluk gelişmiştir (Kriter B: 9/9).",
                "Bilinç açık ve yönelim tamdır; deliryum veya başka bir tıbbi enfeksiyon tablosu saptanmamıştır.",
                "Belirtiler belirgin sıkıntı yaratmış ve acil başvuru gerektirmiştir (Kriter C)."
            ],
            "whyNot": [
                {
                    "diagnosisId": "opioid_intoxication",
                    "reason": "Zehirlenmede miyozis, uyuklama ve solunum depresyonu görülür; burada midriyazis, ajitasyon ve ishal vardır."
                },
                {
                    "diagnosisId": "alcohol_withdrawal",
                    "reason": "Öykü alkol değil opioid kesilmesidir; lakrimasyon, rinore, esneme ve piloereksiyon opioid kesilmesine özgüdür."
                },
                {
                    "diagnosisId": "sedative_withdrawal",
                    "reason": "Sedatif kesilmesinde nöbet ve deliryum riski öne çıkar; burada tipik opioid yoksunluk belirtileri mevcuttur."
                }
            ],
            "teachingPoint": "Opioid kesilmesi 'ağır grip' benzeri midriyazis, piloereksiyon, esneme, lakrimasyon, kas ağrısı ve ishalle seyreder; zehirlenmedeki miyozis ve solunum baskılanmasının tam tersidir."
        }
    },
    {
        "id": "case-167",
        "caseNumber": 167,
        "difficulty": "Orta",
        "course": "SUBSTANCE",
        "diagnosisId": "cannabis_use_disorder",
        "category": "SUBSTANCE",
        "patientSummary": "24 yaşında, erkek, serbest grafik tasarımcı",
        "clues": [
            "24 yaşındaki serbest grafik tasarımcı, son 1.5 yıldır iş teslim tarihlerini sürekli kaçırması, ailesiyle artan tartışmaları ve 'bırakmak istediği hâlde akşamları elinin yine sarma sigaraya gitmesi' nedeniyle başvurdu.",
            "Hasta, 19 yaşında hafta sonları başladığı bitkisel maddeyi son 2 yıldır her gün, günde 3-4 kez tükettiğini; eskiden tek bir kullanımın verdiği gevşemeyi artık ancak çok daha yüksek miktarda ve daha güçlü ürünlerle alabildiğini anlatıyor.",
            "Son bir yılda üç kez tamamen bırakmaya çalıştığını ancak her seferinde 2 gün içinde yoğun sinirlilik, uykusuzluk, iştah kaybı ve şiddetli içme isteği yüzünden yeniden başladığını söylüyor.",
            "Madde etkisi altındayken iki kez otomobil kullandığı ve birinde kaldırıma çıktığı, önceden severek yaptığı basketbol ve arkadaş buluşmalarını tamamen bırakıp günün büyük kısmını madde temini ve kullanımına ayırdığı öğreniliyor.",
            "Ruhsal Durum Muayenesinde: Bilinç açık, gözlerde hafif kızarıklık yok (görüşme öncesi kullanmamış), sanrı ya da varsanı yok. Duygudurum hafif kaygılı, motivasyon kaybı ve 'aslında doğal bir bitki, zararı yok sanıyordum' şeklinde küçümseme mevcut.",
            "Son 12 ayda denetim kaybı, başarısız bırakma çabaları, aşerme, iş yükümlülüklerinin aksaması, riskli araç kullanımı, sosyal etkinliklerin terk edilmesi, tolerans ve kesilme belirtileriyle 11 ölçütten 8'i karşılanıyor."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "eskiden tek bir kullanımın verdiği gevşemeyi artık ancak çok daha yüksek miktarda ve daha güçlü ürünlerle alabildiğini",
                "dsmMatch": "Kriter A10: Tolerans gelişimi"
            },
            {
                "clueIndex": 2,
                "text": "üç kez tamamen bırakmaya çalıştığını ancak her seferinde 2 gün içinde yoğun sinirlilik, uykusuzluk, iştah kaybı ve şiddetli içme isteği",
                "dsmMatch": "Kriter A2, A4 & A11: Başarısız bırakma çabaları, aşerme ve yoksunluk"
            },
            {
                "clueIndex": 3,
                "text": "Madde etkisi altındayken iki kez otomobil kullandığı",
                "dsmMatch": "Kriter A8: Fiziksel açıdan tehlikeli durumlarda yineleyici kullanım"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Motivasyonel Görüşme & BDT / Olumsallık Yönetimi",
            "therapyDetails": "Kullanıma ilişkin ikircikliği çözme, tetikleyici ve aşerme yönetimi, alternatif baş etme becerileri ve sağlıklı gündüz rutinlerinin yeniden inşası.",
            "pharmacologyNote": "Onaylı özgül bir ilaç tedavisi yoktur; bırakma dönemindeki şiddetli kaygı veya uyku güçlüğünde kısa süreli destekleyici semptomatik tedavi düşünülebilir."
        },
        "miniQuiz": {
            "question": "Bu kullanım bozukluğunun 12 aylık DSM-5-TR şiddet derecelendirmesinde 'Ağır' düzey için 11 ölçütten en az kaçı karşılanmalıdır?",
            "options": [
                "En az 2 ölçüt",
                "En az 4 ölçüt",
                "En az 6 ölçüt",
                "11 ölçütün tamamı"
            ],
            "correctIndex": 2,
            "explanation": "DSM-5-TR madde kullanım bozukluklarında 12 ayda 2-3 ölçüt hafif, 4-5 ölçüt orta, 6 ve üzeri ölçüt ağır şiddet olarak sınıflandırılır."
        },
        "differentialDiagnosis": "• Esrar Zehirlenmesi (İntoksikasyonu): Kısa süreli akut etki tablosudur (konjonktival kızarıklık, ağız kuruluğu, taşikardi); 12 aylık sorunlu kullanım örüntüsünü açıklamaz.\n• Esrar Yoksunluğu: Yalnızca bırakma sonrası ortaya çıkan geçici kesilme sendromudur; burada 2 yıllık ağır kullanım örüntüsü esastır.\n• Maddenin/İlacın Yol Açtığı Psikotik Bozukluk: Sanrı veya varsanı bulunmamaktadır.",
        "dsmCriteriaSummary": "DSM-5-TR: 12 ayda ≥2/11 sorunlu kullanım ölçütü (denetim kaybı, toplumsal bozulma, riskli kullanım, tolerans/yoksunluk) + Klinik sıkıntı/işlev kaybı.",
        "therapyId": "motivational_interviewing",
        "pharmacologyId": "hydroxyzine_buspirone",
        "explanation": {
            "whyThis": [
                "Son 12 ayda artan miktar ve tolerans, üç başarısız bırakma girişimi, aşerme, yoksunluk belirtileri, iş teslimlerini aksatma, riskli araç kullanımı ve sosyal etkinlikleri bırakma ile 8/11 ölçüt (ağır düzey) karşılanmıştır.",
                "Görüşme sırasında akut zehirlenme ya da psikotik belirti bulunmamaktadır.",
                "Bırakma dönemindeki sinirlilik ve uykusuzluk, bağımlılık örüntüsünün bir parçası olan yoksunluk ölçütünü destekler."
            ],
            "whyNot": [
                {
                    "diagnosisId": "cannabis_intoxication",
                    "reason": "Hasta görüşme anında akut etki altında değildir; klinik sorun 2 yıllık kronik kullanım örüntüsüdür."
                },
                {
                    "diagnosisId": "cannabis_withdrawal",
                    "reason": "Hasta şu an aktif kullanımını sürdürmektedir; yalnızca bırakma anındaki geçici kesilme tablosu değildir."
                },
                {
                    "diagnosisId": "substance_induced_psychotic",
                    "reason": "Sanrı, varsanı ya da gerçeği değerlendirme bozukluğu yoktur."
                }
            ],
            "teachingPoint": "Esrar kullanımında tolerans, kesilme belirtileri ve işlev kaybı geliştiğinde 'bağımlılık yapmaz' algısına karşın ağır düzeyde kullanım bozukluğu tanısı konur."
        }
    },
    {
        "id": "case-168",
        "caseNumber": 168,
        "difficulty": "Zor",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "major_neurocognitive_vascular",
        "category": "NEUROCOGNITIVE",
        "patientSummary": "73 yaşında, erkek, emekli makinist",
        "clues": [
            "73 yaşındaki emekli makinist, son 1.5 yıldır giderek belirginleşen düşünce yavaşlığı, kendi başına faturalarını ödeyememe, ev içi işleri planlayamama ve giyinirken düğmeleri yanlış ilikleme yakınmalarıyla kızı tarafından getirildi.",
            "Tıbbi öyküsünde 20 yıllık hipertansiyon, atriyal fibrilasyon ve tip 2 diyabet var. Kızı, babasının 18 ay önce geçirdiği sol taraf güçsüzlüğünün ardından ilk kez 'bir kademe gerilediğini', 6 ay önce geçirdiği ikinci ani konuşma bozukluğu atağından sonra ise tek başına yaşayamaz hâle geldiğini anlatıyor.",
            "Yakınları, hastanın adım adım yürümede küçük adımlar attığını ve sık idrara yetişememe yaşadığını, ayrıca son aylarda aniden ağlayıp dakikalar sonra gülme şeklinde duygusal iniş çıkışları olduğunu; ancak geçmiş ve yakın aile ziyaretlerini ipucu verildiğinde hatırlayabildiğini aktarıyor.",
            "Kan sayımı, B12, folat ve TSH olağan. Beyin MR'ında bilateral derin beyaz cevherde yaygın iskemik değişiklikler, sağ frontal ve sol talamik bölgede çok sayıda eski enfarkt alanları görülüyor; hipokampus hacmi yaşıyla uyumlu.",
            "Ruhsal Durum Muayenesinde: Bilinç açık, gün içi dalgalanma yok. MoCA 15/30; özellikle iz sürme, saat çizimi, sözel akıcılık ve karmaşık dikkatte ağır puan kaybı, gecikmeli hatırlamada ise ipucuyla belirgin düzelme saptanıyor.",
            "İlaçlarını düzenli alamadığı, para hesabını yapamadığı ve temel ev işlerinde kızının günlük gözetimine bağımlı hâle geldiği; bilişsel kaybın damarsal olaylarla basamaklı ilişkili olduğu netleşiyor."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "18 ay önce geçirdiği sol taraf güçsüzlüğünün ardından ilk kez 'bir kademe gerilediğini', 6 ay önce geçirdiği ikinci ani konuşma bozukluğu atağından sonra ise tek başına yaşayamaz hâle geldiğini",
                "dsmMatch": "Kriter B1: Serebrovasküler olaylarla zamansal ve basamaklı kötüleşme"
            },
            {
                "clueIndex": 3,
                "text": "bilateral derin beyaz cevherde yaygın iskemik değişiklikler, sağ frontal ve sol talamik bölgede çok sayıda eski enfarkt",
                "dsmMatch": "Kriter C: Nörogörüntülemede yeterli serebrovasküler hastalık kanıtı"
            },
            {
                "clueIndex": 5,
                "text": "temel ev işlerinde kızının günlük gözetimine bağımlı hâle geldiği",
                "dsmMatch": "Kriter A: Günlük yaşam etkinliklerinde bağımsızlığın bozulması (majör düzey)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Vasküler Risk Kontrolü, Bilişsel Rehabilitasyon & Bakım Veren Desteği",
            "therapyDetails": "Tansiyon, şeker ve ritim kontrolüyle yeni inme önlemi, ev içi güvenlik düzenlemeleri, rutin oluşturma ve bakım veren yükünü azaltmaya yönelik psikoeğitim.",
            "pharmacologyNote": "İkincil inme profilaksisi (antikoagülan/antiagregan, statin, antihipertansif) temeldir; seçilmiş olgularda kolinesteraz inhibitörleri veya memantin bilişsel destek amacıyla değerlendirilir."
        },
        "miniQuiz": {
            "question": "Bu tabloyu Hafif Vasküler Nörobilişsel Bozukluktan ayıran belirleyici ölçüt hangisidir?",
            "options": [
                "Hipertansiyon öyküsünün bulunması",
                "Bilişsel kaybın fatura ödeme, ilaç yönetimi ve giyinme gibi günlük yaşam etkinliklerinde bağımsızlığı bozması",
                "MR'da beyaz cevher değişikliklerinin görülmesi",
                "Hastanın 65 yaşından büyük olması"
            ],
            "correctIndex": 1,
            "explanation": "Hafif ve majör düzey arasındaki temel sınır, günlük yaşam etkinliklerinde bağımsızlığın korunup korunmadığıdır; burada hasta günlük gözetim olmadan yaşayamamaktadır."
        },
        "differentialDiagnosis": "• Hafif Vasküler Nörobilişsel Bozukluk: Bağımsızlık korunmuştur (liste ve ek çabayla sürdürülür); burada hasta tek başına yaşayamaz hâldedir.\n• Majör Nörobilişsel Bozukluk (Alzheimer Tipi Demans): Sinsi başlar, hipokampal atrofi ve ipucuyla düzelmeyen yeni öğrenme kaybı baskındır.\n• Deliryum (Akut Bilinç Bulanıklığı): Bilinç açık ve gün içi dalgalanma yoktur; süreç 18 aya yayılan basamaklı seyirdedir.",
        "dsmCriteriaSummary": "DSM-5-TR: Belirgin bilişsel gerileme + Günlük bağımsızlık kaybı + Serebrovasküler olayla zamansal bağ/yönetsel ağırlık + Görüntüleme kanıtı.",
        "therapyId": "caregiver_behavioral",
        "pharmacologyId": "cholinesterase_donepezil",
        "explanation": {
            "whyThis": [
                "Karmaşık dikkat ve yönetsel işlevlerde ağır gerileme (MoCA 15/30) ile fatura, ilaç ve giyinmede bağımsızlık kaybı majör düzeyi (Kriter A) karşılar.",
                "İki ayrı inme atağını izleyen basamaklı kötüleşme (Kriter B) ve MR'daki çoklu enfarktlar ile beyaz cevher hastalığı (Kriter C) damarsal etiyolojiyi kanıtlar.",
                "Hipokampusun korunmuş olması ve ipucuyla hatırlamanın düzelmesi Alzheimer tipinden ayırır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "mild_neurocognitive_vascular",
                    "reason": "Hasta fatura, ilaç ve ev işlerinde bağımsızlığını kaybetmiş, kızının günlük gözetimine muhtaç hâle gelmiştir."
                },
                {
                    "diagnosisId": "major_neurocognitive_alzheimer",
                    "reason": "Seyir sinsi değil inme sonrası basamaklıdır; hipokampus hacmi korunmuştur ve yönetsel işlev kaybı baskındır."
                },
                {
                    "diagnosisId": "delirium",
                    "reason": "Bilinç açık, dalgalanma yok ve süreç 18 aylık kronik gidişlidir."
                }
            ],
            "teachingPoint": "İnme sonrası basamaklı kötüleşme, yönetsel işlev kaybı, çoklu enfarktlar ve günlük yaşam bağımsızlığının yitimi majör vasküler nörobilişsel bozukluğu tanımlar."
        }
    },
    {
        "id": "case-169",
        "caseNumber": 169,
        "difficulty": "Zor",
        "course": "NEURO_SOMATIC",
        "diagnosisId": "major_neurocognitive_parkinson",
        "category": "NEUROCOGNITIVE",
        "patientSummary": "71 yaşında, erkek, emekli terzi",
        "clues": [
            "71 yaşındaki emekli terzi, son 1.5 yıldır artan unutkanlık, konuşurken cümleleri toparlamada yavaşlık, akşamları evin salonunda 'sessizce oturan tanımadığı çocuklar gördüğünü' söylemesi ve artık kendi ilaçlarını düzenleyememesi nedeniyle getirildi.",
            "Tıbbi öyküsünde 8 yıl önce sağ elde istirahat titremesi, hareketlerde yavaşlama ve kas katılığıyla başlayan, nöroloji tarafından düzenli levodopa/karbidopa ile izlenen yerleşmiş bir hareket bozukluğu olduğu öğreniliyor.",
            "Eşi, hastanın motor hastalığının ilk 6 yılında zihninin tamamen berrak olduğunu, ancak son 1.5 yılda sinsi biçimde planlama yapamaz, evdeki saatleri ve para üstünü hesaplayamaz hâle geldiğini, geceleri de rüyalarını bağırıp kollarını savurarak yaşadığını anlatıyor.",
            "Kan testleri, B12, folat ve tiroid olağan; beyin MR'ında belirgin inme ya da tümör yok. Levodopa dozunun azaltılması varsanıları hafifletiyor ancak bilişsel gerileme sürüyor.",
            "Ruhsal Durum Muayenesinde: Yüz ifadesi donuk (hipomimi), öne eğik duruş ve küçük adımlı yürüyüş mevcut; bilinç açık. MoCA 16/30; saat çizimi, küp kopyalama, yönetsel işlevler ve düşünce hızında (bradifreni) ağır bozulma, bellekte ipucuyla kısmi düzelme saptanıyor.",
            "Motor hastalığın başlangıcından yıllarca (6.5 yıl) sonra sinsi başlayan ve günlük yaşam bağımsızlığını bozan bu ilerleyici bilişsel yıkım tablosu, 'bir yıl kuralı' gereği özgül etiyolojiyle netleştiriliyor."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "8 yıl önce sağ elde istirahat titremesi, hareketlerde yavaşlama ve kas katılığıyla başlayan, nöroloji tarafından düzenli levodopa/karbidopa ile izlenen",
                "dsmMatch": "Kriter B: Yerleşmiş Parkinson hastalığı zemininde gelişim"
            },
            {
                "clueIndex": 2,
                "text": "motor hastalığının ilk 6 yılında zihninin tamamen berrak olduğunu, ancak son 1.5 yılda sinsi biçimde planlama yapamaz",
                "dsmMatch": "Kriter C & Ayırıcı Kural: Motor belirtilerden yıllar sonra sinsi başlangıç"
            },
            {
                "clueIndex": 0,
                "text": "artık kendi ilaçlarını düzenleyememesi",
                "dsmMatch": "Kriter A: Günlük yaşamda bağımsızlığın bozulması (majör düzey)"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Bakım Veren Eğitimi, Güvenlik Düzenlemeleri & Nöroloji İşbirliği",
            "therapyDetails": "Düşme önleme, ilaç saatlerinin bakım veren tarafından düzenlenmesi, görsel varsanılarla tartışmadan yatıştırıcı yaklaşım ve uyku güvenliği.",
            "pharmacologyNote": "Bilişsel belirtiler için kolinesteraz inhibitörü (özellikle rivastigmin/donepezil) kullanılır; tipik antipsikotikler motor tabloyu ağırlaştırdığı için kaçınılır."
        },
        "miniQuiz": {
            "question": "Bu tabloyu Lewy Cisimcikli Demanstan ayırmak için klinik uzlaşıda kullanılan 'bir yıl kuralı' neyi ifade eder?",
            "options": [
                "Bilişsel gerileme motor belirtilerden yıllarca sonra başlıyorsa Parkinson hastalığına bağlı demans; motor belirtilerden önce ya da ilk 1 yıl içinde başlıyorsa Lewy cisimcikli demans düşünülür",
                "Her iki hastalık da yalnızca 1 yıl sürer",
                "Levodopa tedavisi en fazla 1 yıl kullanılır",
                "Görsel varsanılar 1 yıldan önce hiç görülmez"
            ],
            "correctIndex": 0,
            "explanation": "Aynı alfa-sinüklein patolojisini paylaşan bu iki tabloyu ayıran temel klinik kural zamansal sıradır: motor belirtiler bilişsel yıkımdan yıllarca önce başlamışsa Parkinson hastalığına bağlı nörobilişsel bozukluk tanınır."
        },
        "differentialDiagnosis": "• Majör Nörobilişsel Bozukluk (Lewy Cisimcikli Demans): Bilişsel gerileme motor belirtilerden önce ya da motor başlangıçtan sonraki ilk 1 yıl içinde başlar; burada motor hastalık 6.5 yıl önce başlamıştır.\n• Majör Nörobilişsel Bozukluk (Alzheimer Tipi Demans): İpucuyla düzelmeyen birincil bellek kaybı baskındır; uzun süreli parkinsonizm zemini yoktur.\n• Deliryum (Akut Bilinç Bulanıklığı): Akut başlangıçlıdır; burada 1.5 yıllık sinsi ve ilerleyici bir seyir vardır.",
        "dsmCriteriaSummary": "DSM-5-TR: Majör bilişsel gerileme ve bağımsızlık kaybı + Yerleşmiş Parkinson hastalığı seyrinde motor başlangıçtan yıllar sonra sinsi gelişim + Dışlama.",
        "therapyId": "caregiver_behavioral",
        "pharmacologyId": "cholinesterase_donepezil",
        "explanation": {
            "whyThis": [
                "Yönetsel işlevler, görsel-uzamsal beceriler ve düşünce hızında ağır gerileme (MoCA 16/30) ile ilaç ve para yönetiminde bağımsızlık kaybı Kriter A'yı karşılar.",
                "Bilişsel yıkım, 8 yıldır tanısı yerleşmiş motor hastalığın seyrinde ve başlangıçtan 6.5 yıl sonra sinsi biçimde gelişmiştir (Kriter B & C).",
                "Kan testleri ve MR diğer tıbbi ya da damarsal nedenleri dışlamıştır."
            ],
            "whyNot": [
                {
                    "diagnosisId": "major_neurocognitive_lewy_body",
                    "reason": "Motor belirtiler bilişsel gerilemeden 6.5 yıl önce başlamıştır (1 yıl kuralı gereği Lewy cisimcikli demanstan ayrılır)."
                },
                {
                    "diagnosisId": "major_neurocognitive_alzheimer",
                    "reason": "Yerleşmiş uzun süreli parkinsonizm, bradifreni, görsel varsanılar ve görsel-uzamsal ağırlık belirgindir."
                },
                {
                    "diagnosisId": "delirium",
                    "reason": "Tablo günler içinde değil 1.5 yılda sinsi biçimde ilerlemiştir ve bilinç açıktır."
                }
            ],
            "teachingPoint": "Parkinsonizm ve demans birlikteliğinde '1 yıl kuralı' belirleyicidir: motor hastalık yıllarca önce başlamışsa Parkinson hastalığına bağlı majör nörobilişsel bozukluk tanısı konur."
        }
    },
    {
        "id": "case-170",
        "caseNumber": 170,
        "difficulty": "Zor",
        "course": "FORENSIC",
        "diagnosisId": "personality_change_due_to_medical",
        "category": "PERSONALITY_B",
        "patientSummary": "41 yaşında, erkek, inşaat mühendisi",
        "clues": [
            "41 yaşındaki inşaat mühendisi, son 1 yıldır iş yerinde çalışma arkadaşlarına karşı uygunsuz cinsel şakalar yapması, ani öfke patlamaları sergilemesi ve şantiyede bir müteahhitle kavga etmesi üzerine adli değerlendirme ve iş yeri yönlendirmesiyle getirildi.",
            "Eşi ve 15 yıllık iş arkadaşları, hastanın 16 ay öncesine kadar son derece kibar, ölçülü, kuralcı ve sabırlı biri olduğunu; gençliğinde ya da erişkinliğinde hiçbir adli olaya, dürtüsel davranışa ya da ruhsal hastalığa rastlanmadığını anlatıyor.",
            "Tıbbi kayıtlarda hastanın 16 ay önce geçirdiği yüksek hızlı trafik kazasında kafa travması yaşadığı, yoğun bakımda izlendiği ve beyin MR'ında bilateral orbitofrontal kortekste belirgin ensefalomalazi (eski doku hasarı) geliştiği görülüyor.",
            "Kazadan iyileşip eve döndüğünden beri sabırsız, nezaket kurallarını hiçe sayan, tanımadığı kişilere kaba yorumlar yapan ve düşüncesizce pahalı harcamalar yapan bambaşka birine dönüştüğü; bu nedenle işten çıkarıldığı ve evliliğinin bitme noktasına geldiği bildiriliyor.",
            "Ruhsal Durum Muayenesinde: Bilinç açık, yer-zaman yönelimi, bellek ve dil becerileri tamamen sağlam (MMSE 29/30). Ancak görüşme sırasında hekime senli benli hitap ediyor, sınırları zorlayan uygunsuz espriler yapıyor ve sonuçlara kayıtsız; mani ya da sanrı yok.",
            "Önceki karakteristik örüntüsünden keskin biçimde ayrılan bu süreğen ketlenmemiş ve dürtüsel davranış tablosunun, doğrudan orbitofrontal beyin hasarının fizyolojik sonucu olduğu belirleniyor."
        ],
        "symptomHighlights": [
            {
                "clueIndex": 1,
                "text": "16 ay öncesine kadar son derece kibar, ölçülü, kuralcı ve sabırlı biri olduğunu",
                "dsmMatch": "Kriter A: Önceki karakteristik kişilik örüntüsünden belirgin değişim"
            },
            {
                "clueIndex": 2,
                "text": "beyin MR'ında bilateral orbitofrontal kortekste belirgin ensefalomalazi",
                "dsmMatch": "Kriter B: Tıbbi durumun doğrudan fizyolojik sonucu kanıtı"
            },
            {
                "clueIndex": 4,
                "text": "bellek ve dil becerileri tamamen sağlam (MMSE 29/30). Ancak görüşme sırasında hekime senli benli hitap ediyor, sınırları zorlayan uygunsuz espriler yapıyor",
                "dsmMatch": "Alt Tip & Dışlama: Ketlenmemiş tip; deliryum ve demansın dışlanması"
            }
        ],
        "treatmentModality": {
            "goldStandardTherapy": "Davranışsal Yönetim, Aile Psikoeğitimi & Çevresel Yapılandırma",
            "therapyDetails": "Dürtüsel tetikleyicileri azaltma, aileye davranışların kasıtlı değil hasara bağlı olduğunu öğretme, finansal ve hukuki koruma planlaması ve nörorehabilitasyon.",
            "pharmacologyNote": "Ağır dürtüsellik, saldırganlık veya ketlenme kaybında düşük doz ikinci kuşak antipsikotikler, duygudurum dengeleyiciler veya SSRI'lar belirtiye yönelik kullanılabilir."
        },
        "miniQuiz": {
            "question": "Kafa travması sonrası toplumsal kuralları hiçe sayma, uygunsuz şakalar ve dürtüsel davranışlarla giden ketlenmemiş tip en sık hangi beyin bölgesinin hasarıyla ilişkilidir?",
            "options": [
                "Orbitofrontal korteks",
                "Oksipital görsel korteks",
                "Serebellar vermis",
                "Birincil işitme korteksi"
            ],
            "correctIndex": 0,
            "explanation": "Orbitofrontal korteks toplumsal frenleme, empati ve dürtü denetiminden sorumludur; hasarında ketlenme kaybı, uygunsuz davranışlar ve sonuçlara kayıtsızlık gelişir."
        },
        "differentialDiagnosis": "• Antisosyal Kişilik Bozukluğu (Sosyopati / Psikopati): 15 yaşından önce başlayan davranım bozukluğu öyküsü gerektirir; burada 40 yaşına dek sorunsuz bir yaşam vardır.\n• Majör Nörobilişsel Bozukluk (Travmatik Beyin Hasarına Bağlı): Bellek, dikkat ve genel bilişsel alanlarda bağımsızlığı bozan yıkım vardır; burada MMSE 29/30 olup baskın tablo kişilik değişimidir.\n• Başka Bir Sağlık Durumuna Bağlı Bipolar Bozukluk: Dönemsel taşkın duygudurum ve uyku gereksiniminde azalma vardır; burada 1 yıldır süren sabit ketlenme kaybı mevcuttur.",
        "dsmCriteriaSummary": "DSM-5-TR: Önceki kişilikten belirgin süreğen değişim + Tıbbi durumun doğrudan fizyolojik sonucu (orbitofrontal hasar) + Deliryum/başka bozukluk dışlaması + İşlev kaybı.",
        "therapyId": "caregiver_behavioral",
        "pharmacologyId": "atypical_ap_secondgen",
        "explanation": {
            "whyThis": [
                "40 yaşına dek sakin ve kuralcı olan hastanın kaza sonrası 1 yıldır uygunsuz, dürtüsel ve saldırgan bir örüntü sergilemesi Kriter A'yı karşılar.",
                "Trafik kazası sonrası MR'da saptanan bilateral orbitofrontal ensefalomalazi, değişimin doğrudan tıbbi hasara bağlı olduğunu (Kriter B) kanıtlar.",
                "Bilişsel testler (MMSE 29/30) korunmuş, deliryum ya da epizodik mani yoktur; iş kaybı ve adli süreç Kriter E'yi sağlar."
            ],
            "whyNot": [
                {
                    "diagnosisId": "antisocial_pd",
                    "reason": "15 yaş öncesi davranım bozukluğu öyküsü yoktur; değişim 40 yaşında kafa travması sonrası başlamıştır."
                },
                {
                    "diagnosisId": "major_neurocognitive_tbi",
                    "reason": "Bellek, yönelim ve genel bilişsel testler (MMSE 29/30) tamamen sağlamdır; baskın sorun ketlenme kaybıdır."
                },
                {
                    "diagnosisId": "bipolar_due_to_medical",
                    "reason": "Uyku gereksiniminde azalma, fikir uçuşması ya da epizodik taşkınlık yoktur; süreğen kişilik değişimi egemendir."
                }
            ],
            "teachingPoint": "Erişkinlikte kafa travması ya da frontal lezyon sonrası bilişsel testler normalken ortaya çıkan kalıcı dürtüsellik ve nezaket kaybı tıbbi duruma bağlı kişilik değişikliğidir."
        }
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { COURSE_CATEGORIES, CLINICAL_CASES };
}
