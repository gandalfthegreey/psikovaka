/**
 * PsikoVaka - Kapsamlı DSM-5 Tanı Kriterleri ve Klinik El Kitabı
 * Her tanı için ayrı ayrı:
 * 1. Detaylı Klinik Tanım & Psikopatoloji
 * 2. Resmi DSM-5 Tanı Kriterleri
 * Girdi sayısı: 179 (DIAGNOSES_DATABASE ile birebir; 2026-11-15 tanı temizliği)
 */

const DSM5_MANUAL = {
    "mdd": {
        "id": "mdd",
        "nameTr": "Majör Depresif Bozukluk",
        "nameEn": "Major Depressive Disorder",
        "clinicalDescription": {
            "overview": "Majör Depresif Bozukluk (MDB), kişinin duygudurumunu, bilişsel süreçlerini ve vejetatif/bedensel işlevlerini derinden etkileyen, yineleyici ataklarla seyredebilen ağır bir psikiyatrik tablodur. Kişi kendisini derin bir keder, çaresizlik ve boşluk içinde hissederken yaşamdan keyif alma yetisini (anhedoni) tamamen kaybeder.",
            "epidemiology": "Yaşam boyu yaygınlığı yaklaşık %15-20'dir. Kadınlarda erkeklere oranla 1.5 - 2 kat daha sık görülür. Her yaşta başlayabilir ancak ortalama başlangıç yaşı 20'li yaşların sonları ve 30'lu yaşların başıdır.",
            "etiology": "Biyolojik faktörler (serotonin, noradrenalin, dopaminerjik disfonksiyon; HPA ekseni aşırı duyarlılığı), genetik yatkınlık (%40 kalıtılabilirlik), Aaron Beck'in bilişsel üçlüsü (kendisi, dünya ve gelecek hakkında olumsuz otomatik şemalar) ve öğrenilmiş çaresizlik modeli etiyolojide temel rol oynar.",
            "prognosis": "Tedavi edilmeyen bir epizod ortalama 6-9 ay sürer. Uygun farmakoterapi ve psikoterapi (BDT) ile %70-80 oranında remisyon sağlanır. Ancak bir atak geçiren bireyde ikinci atak riski %50, iki atak geçiren bireyde üçüncü atak riski %70-80'dir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Temel Belirti Ölçütleri (En az 5/9 belirti, en az biri 1 veya 2 olmalı)",
                "content": "İki haftalık bir dönem boyunca aşağıdaki belirtilerden en az beşinin bulunması ve önceki işlevsellik düzeyinde bir değişimin olması (en az biri çökkün duygudurum ya da ilgi/zevk kaybı olmalıdır):",
                "items": [
                    "A1. Hemen her gün, günün büyük bölümünde çökkün duygudurum (üzgün, boşlukta, umutsuz hissetme).",
                    "A2. Hemen her gün, günün büyük bölümünde tüm ya da çoğu etkinliğe karşı ilgi ve zevk almada belirgin azalma (Anhedoni).",
                    "A3. Diyet yapmaksızın belirgin kilo kaybı ya da kilo alımı veya hemen her gün iştahın azalması/artması.",
                    "A4. Hemen her gün uykusuzluk (insomni) ya da aşırı uyuma (hipersomni).",
                    "A5. Hemen her gün psikomotor ajitasyon ya da retardasyon (başkalarınca gözlenebilir yavaşlama).",
                    "A6. Hemen her gün yorgunluk, bitkinlik ya da enerji kaybı.",
                    "A7. Hemen her gün değersizlik ya da aşırı/uygunsuz suçluluk duyguları.",
                    "A8. Hemen her gün düşünme ya da odaklanma yetisinde azalma, kararsızlık.",
                    "A9. Yineleyen ölüm düşünceleri, özgül bir tasarı olmaksızın yineleyen intihar düşünceleri veya intihar girişimi/planı."
                ]
            },
            {
                "code": "Kriter B",
                "title": "Klinik Sıkıntı ve İşlevsellik Kaybı",
                "content": "Belirtiler klinik açıdan belirgin bir sıkıntıya ya da toplumsal, işle ilgili veya diğer önemli alanlarda işlevsellikte düşmeye yol açar."
            },
            {
                "code": "Kriter C",
                "title": "Fizyolojik/Madde Dışlaması",
                "content": "Atak bir maddenin (kötüye kullanılan ilaç/uyuşturucu) ya da başka bir genel sağlık durumunun (örn. hipotiroidi) fizyolojik etkilerine bağlanamaz."
            },
            {
                "code": "Kriter D",
                "title": "Psikotik Bozukluk Dışlaması",
                "content": "Majör depresif atağın ortaya çıkışı şizoaffektif bozukluk, şizofreni, şizofreniform bozukluk veya diğer psikotik bozukluklarla daha iyi açıklanamaz."
            },
            {
                "code": "Kriter E",
                "title": "Mani/Hipomani Dışlaması",
                "content": "Kişi hiçbir zaman bir Manik Epizod ya da Hipomanik Epizod geçirmemiştir (Geçirmişse tanı Bipolar Bozukluk olur)."
            },
            {
                "code": "Belirleyiciler / Alt tipler",
                "title": "Epizod Kodlaması ve Belirleyiciler",
                "content": "Majör depresif bozukluk tek tanıdır; tek ya da yineleyici epizod, şiddet ve özellikler belirleyici olarak eklenir.",
                "items": [
                    "Tek epizod (F32.x) ya da yineleyici epizod (F33.x): epizodların ayrı sayılması için aralarında ölçütlerin karşılanmadığı en az 2 ardışık ay olmalıdır.",
                    "Şiddet: hafif, orta, ağır. Psikotik özelliklerle: epizod sırasında sanrı ve/veya varsanı; duygudurumla uyumlu (suçluluk, hastalık, ölüm, nihilizm, hak edilmiş ceza temaları) ya da uyumsuz olarak belirtilir.",
                    "Diğer belirleyiciler: kaygılı sıkıntıyla, karışık özelliklerle, melankolik özelliklerle (olumlu olaylara tepkisizlik, sabah kötüleşme, erken uyanma), atipik özelliklerle (duygudurum tepkiselliği, aşırı uyku/yeme, kurşun felci), katatoniyle, doğum dönemi başlangıçlı (gebelikte ya da doğumdan sonraki 4 hafta içinde), mevsimsel örüntülü (yalnızca yineleyici epizodda).",
                    "Yatışma: kısmi ya da tam yatışmada."
                ]
            }
        ]
    },
    "bipolar_1": {
        "id": "bipolar_1",
        "nameTr": "Bipolar I Bozukluğu",
        "nameEn": "Bipolar I Disorder",
        "clinicalDescription": {
            "overview": "Bipolar I Bozukluğu, en az bir kez tam bir 'Manik Epizod' yaşanmasıyla tanımlanan, aşırı kabarmış duygudurum, enerji patlaması, grandiyözite ve riskli davranışlarla seyreden kronik bir duygudurum bozukluğudur. Çoğu hastada manik atakların yanı sıra majör depresif ataklar da eşlik eder.",
            "epidemiology": "Yaşam boyu yaygınlığı yaklaşık %1'dir. Kadın ve erkeklerde eşit sıklıkta görülür. Ortalama başlangıç yaşı 18-20'dir.",
            "etiology": "Psikiyatrideki en yüksek genetik geçişe sahip bozukluklardan biridir (%70-85 kalıtılabilirlik). Dopaminerjik hiperaktivite, sirkadiyen ritim disfonksiyonu ve hücresel sinyal iletim anomalileri rol oynar.",
            "prognosis": "Epizodik ve tekrarlayıcıdır. Yaşam boyu lityum veya duygudurum dengeleyici profilaksisi nüksleri önlemede hayati öneme sahiptir. İntihar riski genel popülasyondan 15 kat yüksektir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Manik Epizod Süre ve Duygudurum Ölçütü",
                "content": "En az 1 hafta boyunca (hastaneye yatırılmayı gerektiriyorsa herhangi bir süre) hemen her gün, günün büyük bölümünde kabarmış, taşkın ya da kolay kızan (irritabl) olağandışı ve sürekli bir duygudurum ile amaca yönelik etkinlikte/enerjide anormal ve sürekli bir artış döneminin olması."
            },
            {
                "code": "Kriter B",
                "title": "Manik Belirtiler (En az 3 belirti, duygudurum sadece irritabl ise en az 4)",
                "content": "Duygudurum bozukluğu döneminde aşağıdaki belirtilerden en az üçü (duygudurum yalnızca irritabl ise en az dördü) belirgin olarak bulunur:",
                "items": [
                    "B1. Benlik saygısında aşırı artış ya da büyüklük (grandiyözite) fikirleri/sanrıları.",
                    "B2. Uyku gereksiniminde azalma (örn. sadece 2-3 saatlik uykuyla kendini dinlenmiş hissetme).",
                    "B3. Her zamankinden daha konuşkan olma ya da konuşmaya tutulma (baskılı konuşma).",
                    "B4. Fikir uçuşması (düşüncelerin birbiri ardına yarışması hissi).",
                    "B5. Dikkat dağınıklığı (dikkatin önemsiz dış uyaranlara kolayca kayması).",
                    "B6. Amaca yönelik etkinlikte artış (toplumsal, iş, okul veya cinsel) ya da psikomotor ajitasyon.",
                    "B7. Kötü sonuçlar doğurma olasılığı yüksek etkinliklere aşırı katılma (kontrolsüz para harcama, düşüncesiz cinsel girişimler, riskli yatırımlar)."
                ]
            },
            {
                "code": "Kriter C",
                "title": "Ağır İşlev Bozukluğu veya Yatış Gereksinimi",
                "content": "Duygudurum bozukluğu toplumsal ya da mesleki işlevsellikte belirgin bir bozulmaya yol açacak, kendine ya da başkalarına zarar vermesini önlemek için hastaneye yatırılmayı gerektirecek denli ağırdır ya da psikotik özellikler (sanrı/varsanı) gösterir."
            },
            {
                "code": "Kriter D",
                "title": "Madde/Sağlık Durumu Dışlaması",
                "content": "Epizod bir maddenin (madde kötüye kullanımı, ilaç) ya da başka bir genel sağlık durumunun doğrudan fizyolojik etkilerine bağlanamaz."
            },
            {
                "code": "Belirleyiciler / Alt tipler",
                "title": "Epizod Kodlaması ve Belirleyiciler",
                "content": "Bipolar I bozukluğu, yaşam boyu en az bir manik epizodla konan tek tanıdır; şu anki ya da en son epizod tanının kodlamasında belirtilir.",
                "items": [
                    "Şu anki / en son epizod: manik, hipomanik, depresif ya da belirtilmemiş; ardından şiddet (hafif, orta, ağır), psikotik özellikler ve yatışma durumu.",
                    "Şu anki epizod depresifse de tanı bipolar I bozukluğudur: majör depresif epizod ölçütleri karşılanır ve öyküde manik epizod vardır.",
                    "Ek belirleyiciler: kaygılı sıkıntıyla, karışık özelliklerle, hızlı döngülü (12 ayda en az 4 epizod), melankolik, atipik, duygudurumla uyumlu/uyumsuz psikotik özelliklerle, katatoniyle, doğum dönemi başlangıçlı, mevsimsel örüntülü."
                ]
            }
        ]
    },
    "bipolar_2": {
        "id": "bipolar_2",
        "nameTr": "Bipolar II Bozukluğu (Hipomani ve Majör Depresyon)",
        "nameEn": "Bipolar II Disorder",
        "clinicalDescription": {
            "overview": "Yaşam boyu en az bir kez Hipomanik Epizod (en az 4 gün süren kabarmış duygudurum ve enerji artışı) ve en az bir kez Majör Depresif Epizod (en az 2 hafta) geçirilmesiyle tanımlanan bozukluktur. Bipolar I'den temel farkı, hiçbir zaman tam bir Manik Epizod yaşanmamış olmasıdır.",
            "epidemiology": "Yaşam boyu yaygınlığı %0.5 - %1.5 arasındadır; kadınlarda daha sık görülür.",
            "etiology": "Güçlü genetik yatkınlık, sirkadiyen ritim disregülasyonu ve monoaminerjik dalgalanmalar.",
            "prognosis": "Hastalar yaşamlarının büyük bölümünü ağır depresif fazda geçirirler; IPSRT ve Lamotrijin/Ketiapin/Lityum ile stabilize edilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Hipomanik ve Majör Depresif Epizod Varlığı",
                "content": "En az bir Hipomanik Epizod (≥4 gün, yatış ve psikoz içermeyen) ve en az bir Majör Depresif Epizod (≥2 hafta) ölçütlerinin karşılanmış olması."
            },
            {
                "code": "Kriter B",
                "title": "Manik Epizod Dışlaması",
                "content": "Kişi yaşamı boyunca HİÇBİR ZAMAN tam bir Manik Epizod geçirmemiştir."
            }
        ]
    },
    "dysthymia": {
        "id": "dysthymia",
        "nameTr": "Kalıcı Depresif Bozukluk (Distimi)",
        "nameEn": "Persistent Depressive Disorder (Dysthymia)",
        "clinicalDescription": {
            "overview": "Distimi, en az 2 yıl boyunca hemen her gün süren, majör depresyondan daha hafif şiddette ancak süreğen ve kronik bir çökkünlük tablosudur. Birey durumu 'Ben kendimi bildim bileli mutsuzum' şeklinde tanımlar.",
            "epidemiology": "Yaşam boyu yaygınlığı yaklaşık %3-5'tir. Sinsi başlangıçlıdır ve genellikle erken erişkinlikte veya çocuklukta başlar.",
            "etiology": "Kronik kişilerarası stresörler, erken çocukluk ihmalleri ve nörotransmitter disregülasyonu etkilidir.",
            "prognosis": "Kronik seyreder; hastaların yaklaşık %75'inde üzerine tam bir majör depresyon atağı eklenebilir (Çift Depresyon / Double Depression)."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Süre Ölçütü (En az 2 yıl)",
                "content": "En az 2 yıl boyunca (çocuk ve ergenlerde en az 1 yıl), günün büyük bölümünde, hemen her gün çökkün duygudurumun bulunması."
            },
            {
                "code": "Kriter B",
                "title": "Belirti Listesi (En az 2/6 belirti)",
                "content": "Çökkün durumdayken aşağıdaki belirtilerden en az ikisinin bulunması:",
                "items": [
                    "B1. İştahsızlık ya da aşırı yeme.",
                    "B2. Uykusuzluk (insomni) ya da aşırı uyuma (hipersomni).",
                    "B3. Düşük enerji ya da yorgunluk.",
                    "B4. Düşük benlik saygısı.",
                    "B5. Odaklanma güçlüğü ya da karar vermede zorlanma.",
                    "B6. Umutsuzluk duyguları."
                ]
            },
            {
                "code": "Kriter C",
                "title": "Belirtisiz Aralık Kuralı",
                "content": "Bu 2 yıllık süre içinde kişi bir seferde 2 aydan daha uzun süre Kriter A ve B belirtilerinden uzak kalmamıştır."
            }
        ]
    },
    "cyclothymia": {
        "id": "cyclothymia",
        "nameTr": "Siklotimik Bozukluk",
        "nameEn": "Cyclothymic Disorder",
        "clinicalDescription": {
            "overview": "En az 2 yıl boyunca süren, tam bir hipomani ölçütünü doldurmayan hafif hipomanik dönemler ile tam bir majör depresyon ölçütünü doldurmayan hafif depresif dalgalanmaların kronik birlikteliğidir.",
            "epidemiology": "Yaygınlığı yaklaşık %0.4 - 1'dir. Başlangıç genellikle ergenlik veya erken yetişkinliktedir.",
            "etiology": "Bipolar bozukluk spektrumunda yer alır; güçlü genetik zemin mevcuttur.",
            "prognosis": "Kronik dalgalı seyreder; yaklaşık üçte biri ilerleyen yıllarda Bipolar I veya II'ye evrilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "2 Yıllık Dalgalanma Ölçütü",
                "content": "En az 2 yıl boyunca (çocuk/ergende 1 yıl), hipomani kriterlerini tam doldurmayan hipomanik belirti dönemleri ile majör depresyonu tam doldurmayan depresif belirti dönemlerinin çok sayıda bulunması."
            },
            {
                "code": "Kriter B",
                "title": "Belirtisiz Süre Kuralı",
                "content": "Bu 2 yıllık süre boyunca belirtisiz geçen dönemler hiçbir zaman 2 aydan uzun sürmemiştir."
            },
            {
                "code": "Kriter C",
                "title": "Majör Atak Dışlaması",
                "content": "Majör depresif, manik ya da hipomanik bir epizodun ölçütleri hiçbir zaman karşılanmamıştır."
            }
        ]
    },
    "pmdd": {
        "id": "pmdd",
        "nameTr": "Premenstrüel Disforik Bozukluk",
        "nameEn": "Premenstrual Dysphoric Disorder",
        "clinicalDescription": {
            "overview": "Menstrüel döngünün luteal fazında (kanamadan önceki hafta) başlayan, belirgin öfke, disfori, anksiyete ve labil duygulanımla seyreden, kanamanın başlamasından birkaç gün sonra tamamen düzelen ağır bir duygudurum tablosudur.",
            "epidemiology": "Doğurganlık çağındaki kadınların yaklaşık %2-6'sında görülür.",
            "etiology": "Östrojen ve progesteron dalgalanmalarına karşı merkezi serotoninerjik sistemin ve GABA-A reseptörlerinin anormal nörobiyolojik aşırı duyarlılığı.",
            "prognosis": "Döngüsel olarak tekrarlar; menopozla birlikte sona erer. Luteal fazda düşük doz SSRI tedavisine son derece dramatik yanıt verir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Döngüsel Zamanlama Ölçütü",
                "content": "Çoğu menstrüel döngüde, kanamadan önceki son haftada en az 5 belirti başlamalı, kanama başladıktan sonraki birkaç gün içinde düzelmeli ve kanamayı izleyen haftada neredeyse yok olmalıdır."
            },
            {
                "code": "Kriter B",
                "title": "Duygusal Belirtiler (En az 1 tane)",
                "content": "B1. Belirgin duygulanımsal değişkenlik (ani ağlama nöbetleri, aşırı alınganlık), B2. Belirgin irritabilite/öfke, B3. Belirgin çökkün duygudurum/umutsuzluk, B4. Belirgin anksiyete/gerginlik."
            },
            {
                "code": "Kriter C",
                "title": "Davranışsal/Bedensel Belirtiler",
                "content": "İlgi azalması, odaklanma güçlüğü, uyuşukluk/enerji kaybı, iştah değişiklikleri, uykusuzluk/aşırı uyuma, göğüslerde hassasiyet veya şişkinlik hissi."
            }
        ]
    },
    "dmdd": {
        "id": "dmdd",
        "nameTr": "Yıkıcı Duygudurumu Düzenleyememe Bozukluğu",
        "nameEn": "Disruptive Mood Dysregulation Disorder",
        "clinicalDescription": {
            "overview": "Çocuklarda haftada ortalama 3 veya daha fazla kez yineleyen ağır, orantısız öfke patlamaları ve bu patlamalar arasında hemen her gün süregiden kronik irritabl duygudurumla karakterize tablodur. Pediyatrik bipolar aşırı tanısını engellemek için DSM-5'e eklenmiştir.",
            "epidemiology": "Okul çağı çocuklarında %2-5 civarındadır. Erkek çocuklarda daha sıktır. Tanı 6-18 yaş arasında konur; başlangıç 10 yaşından önce olmalıdır.",
            "etiology": "Duygu regülasyonunda prefrontal korteks-amigdala devresindeki defisitler ve düşük engellenme eşiği.",
            "prognosis": "Ergenlik ve yetişkinlikte Bipolar'dan ziyade Majör Depresyon ve Anksiyete Bozukluklarına dönüşme riski çok yüksektir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Öfke Patlamaları Şiddeti",
                "content": "Durumla ya da kışkırtmayla tamamen orantısız, sözel ya da davranışsal (insanlara/eşyalara saldırganlık) yineleyen ağır öfke patlamaları."
            },
            {
                "code": "Kriter B & C",
                "title": "Sıklık ve Gelişimsel Uyumsuzluk",
                "content": "Öfke patlamaları haftada ortalama 3 ya da daha çok kez yineler ve çocuğun gelişimsel düzeyiyle bağdaşmaz."
            },
            {
                "code": "Kriter D",
                "title": "Patlamalar Arası Sürekli İrritabilite",
                "content": "Öfke patlamaları arasındaki duygudurum hemen her gün, günün büyük bölümünde sürekli olarak öfkeli, kolay kızan ya da huysuzdur ve başkalarınca gözlenebilir."
            },
            {
                "code": "Kriter E & F",
                "title": "Süre ve Ortam Kriteri",
                "content": "Belirtiler en az 12 aydır sürmektedir ve en az 2 ortamda (ev, okul, akran ortamı) belirgindir. İlk tanı 6 yaşından önce ya da 18 yaşından sonra konamaz (başlangıç < 10 yaş)."
            }
        ]
    },
    "panic_disorder": {
        "id": "panic_disorder",
        "nameTr": "Panik Bozukluk",
        "nameEn": "Panic Disorder",
        "clinicalDescription": {
            "overview": "Panik Bozukluk, hiçbir tetikleyici olmadan aniden (spontane) başlayan, dakikalar içinde zirveye ulaşan şiddetli dehşet, ölüm veya delirme korkusuyla giden yineleyen panik ataklar ve bu atakların ardından en az 1 ay süren 'yeni bir atak geçirme beklenti anksiyetesi' ile tanımlanır.",
            "epidemiology": "Yaşam boyu yaygınlığı %2-3'tür. Kadınlarda erkeklerden 2 kat daha sıktır. Genellikle 20-24 yaşlarında başlar.",
            "etiology": "Locus coeruleus ve amigdala aşırı uyarılabilirliği; bedensel duyumların (çarpıntı, baş dönmesi) felaketleştirici bilişsel yorumlanması (Clark'ın Bilişsel Modeli).",
            "prognosis": "BDT (İnteroseptif Maruz Bırakma) ve SSRI tedavisine çok iyi yanıt verir. Tedavi edilmezse agorafobiye ve acil servis bağımlılığına yol açar."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Yineleyen Beklenmedik Panik Ataklar",
                "content": "Dakikalar içinde tepe noktasına ulaşan, aniden yoğun bir korku ya da yoğun bir içsel sıkıntının bastırdığı yineleyen beklenmedik panik ataklar (Aşağıdaki 13 belirtiden en az 4'ü):",
                "items": [
                    "1. Çarpıntı, kalbin küt küt atması ya da kalp hızının artması.",
                    "2. Terleme.",
                    "3. Titreme ya da sarsılma.",
                    "4. Nefes darlığı ya da boğuluyor gibi olma duyumu.",
                    "5. Soluğun tıkanması duyumu.",
                    "6. Göğüs ağrısı ya da göğüste sıkışma.",
                    "7. Bulantı ya da karın ağrısı.",
                    "8. Baş dönmesi, ayakta duramama, sersemlik ya da bayılacak gibi olma.",
                    "9. Titreme, üşüme ya da ateş basması duyumları.",
                    "10. Uyuşma ya da karıncalanma duyumları (paresteziler).",
                    "11. Derealizasyon (gerçekdışılık) ya da Depersonalizasyon (kendine yabancılaşma).",
                    "12. Denetimini yitirme ya da çıldırma/delirme korkusu.",
                    "13. Ölüm korkusu."
                ]
            },
            {
                "code": "Kriter B",
                "title": "En az 1 Ay Süren Beklenti Anksiyetesi veya Kaçınma",
                "content": "Ataklardan en az birini, 1 ay (ya da daha uzun) süreyle aşağıdakilerden biri ya da her ikisi izler:",
                "items": [
                    "B1. Başka panik atakların olacağına ya da bunların sonuçlarına (kalp krizi geçirme, delirme) ilişkin sürekli bir kaygı ya da kuruntu duyma.",
                    "B2. Ataklarla ilişkili olarak uyumsuz davranış değişiklikleri gösterme (örn. egzersizden kaçınma, tanıdık olmayan ortamlardan kaçınma)."
                ]
            },
            {
                "code": "Kriter C & D",
                "title": "Dışlama Ölçütleri",
                "content": "Belirtiler bir maddenin (kafein, amfetamin) ya da tıbbi durumun (hipertiroidi, feokromositoma) doğrudan etkilerine bağlanamaz ve başka bir ruhsal bozuklukla açıklanamaz."
            }
        ]
    },
    "agoraphobia": {
        "id": "agoraphobia",
        "nameTr": "Agorafobi",
        "nameEn": "Agoraphobia",
        "clinicalDescription": {
            "overview": "Agorafobi, panik benzeri ya da utanç verici belirtiler geliştiğinde oradan kaçmanın güç olabileceği ya da yardım sağlanamayabileceği düşüncesiyle toplu taşıma, açık alanlar, kapalı mekanlar, sıralar veya ev dışında tek başına kalma durumlarına karşı duyulan belirgin ve orantısız korku/kaçınmadır.",
            "epidemiology": "Yıllık yaygınlığı yaklaşık %1.7'dir. Kadınlarda erkeklere göre 2 kat fazladır. Erken erişkinlikte zirve yapar.",
            "etiology": "Panik ataklara ikincil gelişebileceği gibi bağımsız olarak da başlayabilir. Güvenli alan inancı ve felaketleştirici kaçınma şemaları temeldir.",
            "prognosis": "İn-vivo (canlı) kademeli maruz bırakma terapisiyle başarıyla tedavi edilir; tedavi edilmezse kişiyi tamamen eve hapsedebilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "5 Alandan En Az 2'sinde Belirgin Korku",
                "content": "Aşağıdaki 5 durumdan ikisi (ya da daha çoğu) hakkında belirgin korku ya da kaygı duyma:",
                "items": [
                    "1. Toplu taşıma araçlarını kullanma (otobüs, tren, vapur, uçak).",
                    "2. Açık alanlarda bulunma (otoparklar, pazar yerleri, köprüler).",
                    "3. Kapalı yerlerde bulunma (mağazalar, sinemalar, tiyatrolar).",
                    "4. Sırada bekleme ya da kalabalık bir ortamda bulunma.",
                    "5. Evin dışında tek başına olma."
                ]
            },
            {
                "code": "Kriter B",
                "title": "Kaçış Güçlüğü Bilişi",
                "content": "Birey panik benzeri belirtiler ya da yetersizleştiren/utanç verici belirtiler (örn. düşme korkusu, altına kaçırma korkusu) geliştiğinde kaçmanın güç olabileceği ya da yardım alamayacağı düşüncesiyle bu durumlardan korkar ya da kaçınır."
            },
            {
                "code": "Kriter C & D & E",
                "title": "Kaçınma, Orantısızlık ve Süre (≥ 6 ay)",
                "content": "Agorafobi durumları neredeyse her zaman korku/kaygı doğurur; bu durumlardan aktif kaçınılır ya da bir refakatçi eşliğinde katlanılır. Korku gerçek tehlikeyle orantısızdır ve en az 6 ay sürer."
            }
        ]
    },
    "gad": {
        "id": "gad",
        "nameTr": "Yaygın Anksiyete Bozukluğu",
        "nameEn": "Generalized Anxiety Disorder",
        "clinicalDescription": {
            "overview": "Günün büyük bölümünde, en az 6 ay boyunca yaşamın hemen hemen tüm alanlarıyla ilgili (sağlık, para, aile, iş) aşırı, kontrol edilemez ve orantısız bir evham (serbest yüzen kaygı) ile birlikte kas gerginliği ve otonomik uyarılmışlıkla seyreden bozukluktur.",
            "epidemiology": "Yaşam boyu yaygınlığı %5-9 arasındadır. Kadınlarda 2 kat daha sıktır. Yaş ilerledikçe sıklığı artar.",
            "etiology": "Belirsizliğe tahammülsüzlük (Intolerance of Uncertainty), endişeyi bir başa çıkma stratejisi olarak görme (Pozitif/Negatif Metabilişsel İnançlar - Wells Modeli).",
            "prognosis": "Dalgalı ve kronik bir gidişat gösterir. BDT ve SNRI/SSRI tedavileri etkilidir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Aşırı Kaygı ve Süre (≥ 6 ay)",
                "content": "En az 6 aylık bir sürenin çoğu gününde, bir dizi etkinlik ya da olay hakkında (iş, okul, sağlık vb.) aşırı bir kaygı ve kuruntu (endişeli beklenti) duyma."
            },
            {
                "code": "Kriter B",
                "title": "Denetim Güçlüğü",
                "content": "Birey bu kaygı ve kuruntuyu denetim altına almakta güçlük çeker."
            },
            {
                "code": "Kriter C",
                "title": "Fiziksel Belirtiler (En az 3/6 belirti)",
                "content": "Aşağıdaki altı belirtiden en az üçü (çocuklarda yalnızca bir belirti) kaygıya eşlik eder:",
                "items": [
                    "1. Huzursuzluk, aşırı heyecan duyma ya da diken üstünde/tetikte olma.",
                    "2. Kolay yorulma.",
                    "3. Odaklanmada güçlük çekme ya da zihnin boşalması hissi.",
                    "4. Kolay kızma / irritabilite.",
                    "5. Kas gerginliği (özellikle boyun, omuz ve sırtta kronik ağrılar).",
                    "6. Uyku bozukluğu (uykuya dalmakta/sürdürmekte güçlük ya da dinlendirmeyen uyku)."
                ]
            },
            {
                "code": "Kriter D & E",
                "title": "İşlevsellik ve Dışlama",
                "content": "Belirtiler belirgin sıkıntı ve işlevsellik kaybı yaratır; madde kullanımına ya da hipertiroidi gibi tıbbi durumlara bağlanamaz."
            }
        ]
    },
    "social_anxiety": {
        "id": "social_anxiety",
        "nameTr": "Sosyal Anksiyete Bozukluğu (Sosyal Fobi)",
        "nameEn": "Social Anxiety Disorder (Social Phobia)",
        "clinicalDescription": {
            "overview": "Kişinin başkalarınca değerlendirilebileceği toplumsal ortamlarda (konuşma yapma, yemek yeme, tanımadığı biriyle sohbet etme) küçük düşeceği, rezil olacağı ya da kaygı belirtilerini dışarıya belli edeceği korkusuyla yoğun anksiyete yaşaması ve bu ortamlardan kaçınmasıdır.",
            "epidemiology": "Yaşam boyu yaygınlığı %7-12 ile en sık görülen anksiyete bozukluklarından biridir. Tipik olarak erken ergenlikte (13 yaş) başlar.",
            "etiology": "Aşırı eleştirel ebeveyn tutumu, akran zorbalığı, dikkatin içsel bedensel sinyallere ve olumsuz benlik imgelerine odaklanması (Clark & Wells Bilişsel Modeli).",
            "prognosis": "Tedavi edilmediğinde ömür boyu sürer; kariyer ve sosyal izolasyona yol açar. BDT (Video geribildirimi ve maruz bırakma) altın standarttır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Toplumsal Durumlarda Korku",
                "content": "Bireyin başkalarınca değerlendirilebilecek olduğu bir ya da birden fazla toplumsal durumda (toplumsal etkileşimler, gözlenme durumları, başkalarının önünde eylemde bulunma) belirgin korku ya da kaygı duyması."
            },
            {
                "code": "Kriter B",
                "title": "Olumsuz Değerlendirilme Korkusu",
                "content": "Birey olumsuz değerlendirilecek biçimde davranmaktan (küçük düşeceği, rezil olacağı, reddedileceği ya da başkalarını rahatsız edeceği biçimde kaygı belirtileri göstereceğinden) korkar."
            },
            {
                "code": "Kriter C & D & E",
                "title": "Kaçınma, Orantısızlık ve Süre (≥ 6 ay)",
                "content": "Toplumsal durumlar neredeyse her zaman korku/kaygı doğurur ve bunlardan aktif kaçınılır. Korku durumsal tehlikeyle orantısızdır ve en az 6 ay sürer."
            },
            {
                "code": "Belirleyici",
                "title": "Yalnızca Performans Belirleyicisi",
                "content": "Korku yalnızca topluluk önünde konuşma ya da sergileme/icra etme durumlarıyla sınırlıysa bu belirleyici eklenir."
            }
        ]
    },
    "specific_phobia": {
        "id": "specific_phobia",
        "nameTr": "Özgül Fobi",
        "nameEn": "Specific Phobia",
        "clinicalDescription": {
            "overview": "Belirli bir nesneye ya da duruma (hayvanlar, yükseklik, fırtına, uçak, kan-enjeksiyon-yara) karşı duyulan, gerçek riskle tamamen orantısız, aşırı ve sürekli korku ve kaçınma reaksiyonudur.",
            "epidemiology": "Yaygınlığı %7-9 civarındadır. Çocukluk çağında başlar.",
            "etiology": "Klasik koşullanma, evrimsel hazırlıklılık (Preparedness teorisi) ve model alma.",
            "prognosis": "Kademeli in-vivo (canlı) maruz bırakma ile seanslar içinde %90'ın üzerinde tam kür sağlanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Özgül Nesne/Durum Korkusu",
                "content": "Özgül bir nesne ya da durumla ilgili olarak belirgin korku ya da kaygı duyma (uçma, yükseklikler, hayvanlar, iğne yaptırma, kan görme)."
            },
            {
                "code": "Kriter B & C & D",
                "title": "Kaçınma, Orantısızlık ve Süre (≥ 6 ay)",
                "content": "Fobik nesne neredeyse her zaman ani anksiyete doğurur ve bundan aktif olarak kaçınılır. Korku nesnenin yarattığı gerçek tehlikeyle orantısızdır ve en az 6 ay sürer."
            },
            {
                "code": "Alt Tipler",
                "title": "DSM-5 Belirleyicileri",
                "content": "1. Hayvan (köpek, yılan, böcek), 2. Doğal Çevre (fırtına, su, yükseklik), 3. Kan-Enjeksiyon-Yara (Vazovagal senkopla giden), 4. Durumsal (uçak, asansör, kapalı yerler), 5. Diğer (boğulma, kusma)."
            }
        ]
    },
    "separation_anxiety": {
        "id": "separation_anxiety",
        "nameTr": "Ayrılma Kaygısı Bozukluğu",
        "nameEn": "Separation Anxiety Disorder",
        "clinicalDescription": {
            "overview": "Bireyin bağlandığı kişilerden (ebeveyn, eş) ayrılmayla ilgili olarak gelişimsel düzeye uygunsuz ve aşırı korku/kaygı duymasıdır. DSM-5 ile yetişkinlikte de tanı alabileceği kabul edilmiştir.",
            "epidemiology": "Çocuklarda %4, yetişkinlerde %1-2 civarındadır.",
            "etiology": "Kaygılı-kararsız bağlanma stili, aşırı korumacı ebeveynlik ve kayıp travmaları.",
            "prognosis": "BDT ve kademeli ayrılık maruziyeti ile başarılı tedavi edilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Ayrılmayla İlgili Aşırı Korku (En az 3/8 belirti)",
                "content": "Bağlandığı kişilerden ayrılmayla ilgili en az üç belirtinin bulunması:",
                "items": [
                    "1. Bağlanılan kişiden ayrılma anında yineleyen aşırı sıkıntı.",
                    "2. Bağlanılan kişinin başına ölüm/kaza/hastalık geleceğine dair sürekli aşırı kuruntu.",
                    "3. Kendisinin kaçırılma/kaybolma gibi istenmeyen bir olayla ayrılacağına dair kuruntu.",
                    "4. Ayrılma korkusuyla evden dışarıya (okula/işe) gitmeyi sürekli istememe ya da reddetme.",
                    "5. Evde ya da başka ortamlarda bağlanılan kişi olmadan tek başına kalmaktan aşırı korkma.",
                    "6. Bağlanılan kişi yanında olmadan uyumayı sürekli istememe ya da reddetme.",
                    "7. Ayrılma temalı yineleyen kabuslar görme.",
                    "8. Ayrılık söz konusu olduğunda yineleyen bedensel belirtiler (baş ağrısı, mide bulantısı)."
                ]
            },
            {
                "code": "Kriter B",
                "title": "Süre Kriteri",
                "content": "Korku, kaygı ya da kaçınma çocuk ve ergenlerde en az 4 hafta, erişkinlerde ise en az 6 ay sürer."
            }
        ]
    },
    "selective_mutism": {
        "id": "selective_mutism",
        "nameTr": "Seçici Konuşmazlık (Selektif Mutizm)",
        "nameEn": "Selective Mutism",
        "clinicalDescription": {
            "overview": "Çocuğun evinde ve ailesiyle akıcı ve rahat bir şekilde konuşmasına karşın, konuşmasının beklendiği özgül toplumsal durumlarda (özellikle okulda) sürekli olarak konuşamaması tablosudur.",
            "epidemiology": "Nadir görülür (%0.03 - 1). Genellikle 5 yaşından önce başlar ancak okula başlandığında fark edilir.",
            "etiology": "Aşırı sosyal kaygı ve çekingen mizaç ile konuşma anındaki yoğun donakalma tepkisi.",
            "prognosis": "Uyaran kaydırma (stimulus fading) ve kademeli davranışsal pekiştirme ile başarıyla tedavi edilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Durumsal Konuşamama Ölçütü",
                "content": "Başka durumlarda konuşuyor olmasına karşın, konuşmasının beklendiği özgül toplumsal durumlarda (örn. okulda) sürekli bir konuşamama hali."
            },
            {
                "code": "Kriter B & C",
                "title": "İşlevsellik ve Süre",
                "content": "Eğitimsel ya da toplumsal iletişimi bozar. Süre en az 1 aydır (okulun ilk ayı ile sınırlı değildir)."
            },
            {
                "code": "Kriter D & E",
                "title": "Dil Yetersizliği ve Bozukluk Dışlaması",
                "content": "Konuşamama durumu toplumsal durumda konuşulan dili bilmeme ya da rahat konuşamama ile ilişkili değildir ve Otizm ya da Psikoz ile açıklanamaz."
            }
        ]
    },
    "ocd": {
        "id": "ocd",
        "nameTr": "Obsesif-Kompulsif Bozukluk (OKB)",
        "nameEn": "Obsessive-Compulsive Disorder (OCD)",
        "clinicalDescription": {
            "overview": "İstemsizce zihne gelen, yoğun anksiyete ve sıkıntı yaratan ısrarcı düşünceler/dürtüler (obsesyonlar) ve kişinin bu kaygıyı nötralize etmek için sergilediği katı, yineleyici davranışlar ya da zihinsel eylemlerle (kompulsiyonlar) seyreden nöropsikiyatrik bozukluktur.",
            "epidemiology": "Yaşam boyu yaygınlığı %2-3'tür. Erkeklerde çocuklukta, kadınlarda 20'li yaşlarda daha sık başlar.",
            "etiology": "Kortiko-striato-talamo-kortikal (CSTC) döngü hiperaktivitesi, aşırı sorumluluk şemaları ve düşünce-eylem kaynaşması (Thought-Action Fusion).",
            "prognosis": "Tepki Önleme ile Maruz Bırakma (ERP) ve yüksek doz SSRI birinci basamaktır. Tedavi edilmezse kronikleşir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Obsesyonlar ve/veya Kompulsiyonlar",
                "content": "Obsesyonların, kompulsiyonların ya da her ikisinin varlığı:",
                "items": [
                    "Obsesyonlar: 1. Yineleyen, istemsizce gelen, belirgin kaygı ya da sıkıntıya neden olan düşünce, dürtü ya da imgeler. 2. Birey bunları görmezden gelmeye, bastırmaya ya da başka bir düşünce/eylemle (kompulsiyonla) etkisizleştirmeye çalışır.",
                    "Kompulsiyonlar: 1. Bireyin bir obsesyona tepki olarak ya da katı kurallara göre yapmaktan kendini alıkoyamadığı yineleyici davranışlar (el yıkama, kontrol etme, sıralama) ya da zihinsel eylemler (dua etme, sayı sayma). 2. Bu davranışlar kaygıyı azaltmak amacıyla yapılır ancak önlenmek istenen durumla gerçekçi bir bağıntısı yoktur ya da aşırıdır."
                ]
            },
            {
                "code": "Kriter B",
                "title": "Zaman Alma Ölçütü",
                "content": "Obsesyonlar ya da kompulsiyonlar zaman alır (günde 1 saatten çok) ya da klinik açıdan belirgin bir sıkıntıya/işlevsellik kaybına yol açar."
            },
            {
                "code": "İçgörü Belirleyicisi",
                "title": "DSM-5 İçgörü Düzeyleri",
                "content": "1. İçgörüsü iyi ya da yeterli (inançların doğru olmadığının farkında), 2. İçgörüsü az (inançların muhtemelen doğru olduğuna inanır), 3. İçgörüsü yok / Sanrısal inançlar (inançların kesin doğru olduğuna inanır)."
            }
        ]
    },
    "bdd": {
        "id": "bdd",
        "nameTr": "Beden Algısı Bozukluğu (Beden Dismorfik Bozukluğu)",
        "nameEn": "Body Dysmorphic Disorder",
        "clinicalDescription": {
            "overview": "Kişinin dış görünümünde başkaları tarafından görülmeyen ya da çok hafif olan hayali/milimetrik kusurlarla (burun, cilt, saç, asimetri) aşırı zihinsel uğraş içinde olması ve bu kusuru kamufle etmek için günde saatlerce ayna kontrolü veya cerrahi ameliyat arayışına girmesidir.",
            "epidemiology": "Genel popülasyonda %2, estetik cerrahi ve dermatoloji kliniklerine başvuranlarda %10-15 civarındadır.",
            "etiology": "Görsel bilgiyi detay odaklı işleme anomalileri ve aşırı estetik mükemmeliyetçilik.",
            "prognosis": "Estetik operasyonlar BDD'yi düzeltmez, aksine kötüleştirir. BDT ve yüksek doz SSRI etkilidir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Görünüm Kusurlarıyla Uğraş",
                "content": "Dış görünümünde başkalarınca gözle görülmeyen ya da önemsenmeyecek bir ya da birden fazla kusur ya da özür algılama üzerine aşırı kafa yorma."
            },
            {
                "code": "Kriter B",
                "title": "Yineleyici Davranışlar / Zihinsel Eylemler",
                "content": "Görünüm kaygılarına tepki olarak yineleyen davranışlarda (ayna kontrolü, aşırı taranma, derisini yolma, güvence arama) ya da zihinsel eylemlerde (kendi görünümünü başkalarıyla karşılaştırma) bulunma."
            },
            {
                "code": "Belirleyici",
                "title": "Kas Dismorfisi Belirleyicisi (Bigoreksiya)",
                "content": "Birey vücut yapısının çok küçük ya da yeterince kaslı olmadığı inancıyla aşırı uğraşıyorsa bu belirleyici eklenir."
            }
        ]
    },
    "hoarding_disorder": {
        "id": "hoarding_disorder",
        "nameTr": "Biriktiricilik (İstifleme) Bozukluğu",
        "nameEn": "Hoarding Disorder",
        "clinicalDescription": {
            "overview": "Gerçek maddi veya kullanım değerleri ne olursa olsun, sahip olunan eşyaları elden çıkarma veya onlardan ayrılmayla ilgili sürekli bir güçlük yaşama ve bu eşyaların yaşam alanlarını doldurarak kullanılamaz hale getirmesidir.",
            "epidemiology": "Yaygınlığı %2-6 arasındadır. Yaşlandıkça şiddeti artar.",
            "etiology": "Nesnelere aşırı duygusal bağlanma, karar verme ve kategorizasyon güçlükleri.",
            "prognosis": "İstifleme BDT protokolü ile tedavi edilir; klasik OKB'ye göre tedavi direnci daha yüksektir."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B",
                "title": "Elden Çıkarma Güçlüğü ve Sıkıntı",
                "content": "Gerçek değerleri ne olursa olsun eşyaları elden çıkarma güçlüğü ve eşyaları saklama gereksinimi algısından kaynaklanan atma sıkıntısı."
            },
            {
                "code": "Kriter C",
                "title": "Yaşam Alanlarının Tıkanması",
                "content": "Eşyaların birikmesi sonucu aktif yaşam alanlarının (yatak odası, mutfak) tıkanması ve amaçlanan kullanımlarının engellenmesi."
            }
        ]
    },
    "trichotillomania": {
        "id": "trichotillomania",
        "nameTr": "Trikotillomani (Saç Yolma Bozukluğu)",
        "nameEn": "Trichotillomania",
        "clinicalDescription": {
            "overview": "Kişinin saç kaybıyla sonuçlanacak biçimde saçlarını, kaşlarını veya kirpiklerini yineleyici biçimde yolması ve bunu durdurmaya yönelik başarısız girişimlerde bulunmasıdır.",
            "epidemiology": "Yıllık yaygınlığı %1-2'dir. Kadınlarda 10 kat daha sık görülür.",
            "etiology": "Beden odaklı yineleyici davranış (BFRB); duygu düzenleme ve gerginlik boşaltma mekanizması.",
            "prognosis": "Alışkanlığı Tersine Çevirme Eğitimi (Habit Reversal Training - HRT) en etkili yöntemdir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Saç/Kıl Yolma",
                "content": "Saç/kıl yitimiyle sonuçlanacak biçimde kişinin yineleyici olarak saçını/kılını yolması."
            },
            {
                "code": "Kriter B & C",
                "title": "Durdurma Çabaları ve Sıkıntı",
                "content": "Saç yolmayı azaltmaya ya da durdurmaya yönelik yineleyen başarısız girişimler ve klinik belirgin sıkıntı/işlev kaybı."
            }
        ]
    },
    "excoriation": {
        "id": "excoriation",
        "nameTr": "Deri Yolma (Ekskoriasyon) Bozukluğu",
        "nameEn": "Excoriation (Skin-Picking) Disorder",
        "clinicalDescription": {
            "overview": "Deri lezyonlarıyla sonuçlanacak biçimde cildi, sivilceleri veya kabukları yineleyici biçimde kazıma/yolma ve bunu bırakmaya yönelik başarısız çabalardır.",
            "epidemiology": "Yaygınlığı %1.4'tür. Kadınlarda belirgin olarak sıktır.",
            "etiology": "Dürtü kontrol güçlüğü ve stres yatıştırma amacıyla tetiklenen otomatik/odaklanmış yolma.",
            "prognosis": "HRT ve kabul ve kararlılık terapisi (ACT) ile başarılı sonuçlar alınır."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B",
                "title": "Deri Yolma ve Durdurma Çabaları",
                "content": "Deri lezyonlarıyla sonuçlanan yineleyici deri yolma ve bunu durdurmaya yönelik yineleyen başarısız girişimler."
            }
        ]
    },
    "ptsd": {
        "id": "ptsd",
        "nameTr": "Travma Sonrası Stres Bozukluğu (TSSB)",
        "nameEn": "Post-Traumatic Stress Disorder (PTSD)",
        "clinicalDescription": {
            "overview": "Ölüm, ağır yaralanma veya cinsel şiddet tehdidine doğrudan maruz kalma ya da tanık olma sonrası gelişen; travmayı yeniden yaşantılama (flashbackler, kabuslar), kaçınma, olumsuz bilişler/duygudurum ve aşırı uyarılmışlıkla 1 aydan uzun süren tablodur.",
            "epidemiology": "Yaşam boyu yaygınlığı yaklaşık %7-8'dir. Travmanın şiddetine göre (savaş, tecavüz vb.) %30-50'lere çıkar.",
            "etiology": "Korku koşullanması, hipokampus hacim azalması, amigdala aşırı aktivasyonu ve travmatik anının zamansal olarak bütünleşememesi.",
            "prognosis": "EMDR ve Travma Odaklı BDT altın standarttır. Tedavi edilmezse kronikleşir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Travmatik Olay Maruziyeti",
                "content": "Gerçek ya da ölüm tehdidi, ağır yaralanma ya da cinsel şiddete maruz kalma (doğrudan yaşama, tanık olma, yakınının başına geldiğini öğrenme)."
            },
            {
                "code": "Kriter B",
                "title": "Yeniden Yaşantılama (İntrüzyon - En az 1 belirti)",
                "content": "B1. İstilacı istemsiz anılar, B2. Yineleyen travmatik kabuslar, B3. Dissosiyatif tepkiler (Flashbackler), B4. Travmayı hatırlatan uyaranlarla yoğun psikolojik sıkıntı, B5. Fizyolojik tepkisellik."
            },
            {
                "code": "Kriter C",
                "title": "Kaçınma Belirtileri (En az 1 belirti)",
                "content": "Travmayla ilgili anı, düşünce veya duygulardan VE/VEYA bunları hatırlatan dışsal uyaranlardan (insanlar, yerler, nesneler) kaçınma çabaları."
            },
            {
                "code": "Kriter D",
                "title": "Biliş ve Duygudurumda Olumsuz Değişmeler (En az 2 belirti)",
                "content": "Travmanın önemli kısmını anımsayamama, aşırı olumsuz inançlar ('Ben kötüyüm', 'Dünya tehlikeli'), kendini suçlama, kalıcı olumsuz duygular, ilgi azalması, yabancılaşma hissi, olumlu duyguları hissedememe."
            },
            {
                "code": "Kriter E & F",
                "title": "Uyarılmışlık Belirtileri ve Süre (≥ 1 ay)",
                "content": "İrritabilite/öfke patlamaları, pervasızca davranışlar, aşırı tetikte olma (hipervijilans), abartılı irkilme tepkisi, odaklanma güçlüğü, uyku bozukluğu. Süre > 1 ay."
            }
        ]
    },
    "acute_stress_disorder": {
        "id": "acute_stress_disorder",
        "nameTr": "Akut Stres Bozukluğu",
        "nameEn": "Acute Stress Disorder",
        "clinicalDescription": {
            "overview": "Travmatik bir olaydan hemen sonra başlayan ve 3 gün ile 1 ay arasında süren; dissosiyasyon, intrüzyon, kaçınma ve uyarılmışlık belirtileriyle giden tablodur. 1 ayı aşarsa tanı TSSB olur.",
            "epidemiology": "Ağır travmalara maruz kalanların %20-50'sinde ilk ayda görülür.",
            "etiology": "Akut otonomik aşırı uyarılma ve dissosiyatif şok mekanizması.",
            "prognosis": "Erken kriz müdahalesi ve psikolojik ilk yardım ile vakaların çoğunda TSSB'ye gidiş önlenir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Travmatik Maruziyet",
                "content": "Ölüm tehdidi, ağır yaralanma ya da cinsel şiddete maruz kalma."
            },
            {
                "code": "Kriter B & C",
                "title": "Belirti Listesi (En az 9/14) ve Süre (3 gün - 1 ay)",
                "content": "Yeniden yaşantılama, olumsuz duygudurum, dissosiyasyon (çevreyi sisli algılama), kaçınma ve uyarılmışlık alanlarından en az 9 belirtinin varlığı. Süre travmadan sonra 3 gün ile 1 ay arasındadır."
            }
        ]
    },
    "adjustment_disorder": {
        "id": "adjustment_disorder",
        "nameTr": "Uyum Bozukluğu",
        "nameEn": "Adjustment Disorder",
        "clinicalDescription": {
            "overview": "Tanımlanabilir bir yaşam stresörünün (boşanma, iş kaybı, iflas, taşınma) ortaya çıkmasından sonraki 3 ay içinde gelişen, stresörün ağırlığıyla orantısız duygusal ya da davranışsal belirtiler tablosudur.",
            "epidemiology": "Psikiyatri konsültasyonlarında en sık (%50) konulan tanılardan biridir.",
            "etiology": "Başa çıkma becerilerinin stresör karşısında yetersiz kalması.",
            "prognosis": "Stresör ortadan kalktıktan sonra belirtiler en geç 6 ay içinde tamamen düzelir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "3 Ay İçinde Başlama",
                "content": "Belirlenebilir bir ya da birden fazla stresöre tepki olarak, stresörün başlamasından sonraki 3 ay içinde ortaya çıkan duygusal ya da davranışsal belirtiler."
            },
            {
                "code": "Kriter B & E",
                "title": "Orantısız Sıkıntı ve Süre Kuralı",
                "content": "Stresörün ağırlığıyla orantısız sıkıntı ya da işlevsellik kaybı. Stresör sonlandıktan sonra belirtiler 6 aydan daha uzun sürmez."
            },
            {
                "code": "Belirleyiciler / Alt tipler",
                "title": "Alt Tipler ve Süre Belirleyicisi",
                "content": "Uyum bozukluğu tek tanıdır; baskın belirtilere göre alt tip belirtilir.",
                "items": [
                    "Çökkün duygudurumla (F43.21): çökkün duygudurum, ağlamaklılık ya da umutsuzluk baskındır.",
                    "Kaygıyla (F43.22): sinirlilik, endişe, gerginlik ya da ayrılma kaygısı baskındır.",
                    "Karışık kaygı ve çökkün duygudurumla (F43.23); davranım bozukluğuyla (F43.24); karışık duygu ve davranım bozukluğuyla (F43.25); belirtilmemiş (F43.20).",
                    "Süre: akut (belirtiler 6 aydan kısa) ya da süregen (6 ay veya daha uzun; süregen bir stres etkenine ya da kalıcı sonuçları olan bir etkene yanıt olarak).",
                    "Majör depresif epizod, TSSB ya da akut stres bozukluğu ölçütleri karşılanıyorsa stres etkeni olsa bile o tanı konur."
                ]
            }
        ]
    },
    "schizophrenia": {
        "id": "schizophrenia",
        "nameTr": "Şizofreni",
        "nameEn": "Schizophrenia",
        "clinicalDescription": {
            "overview": "Düşünce içeriği (sanrılar), algı (varsanılar), düşünce akışı (dezorganizasyon) ve duygulanım/isteklilik (negatif belirtiler) alanlarında derin bozulmalarla seyreden, en az 6 ay süren kronik psikiyatrik bozukluktur.",
            "epidemiology": "Yaşam boyu yaygınlığı dünya genelinde %0.7 - 1'dir. Erkeklerde 18-25, kadınlarda 25-35 yaşlarında başlar.",
            "etiology": "Dopamin hipotezi (mezolimbik hiperaktivite -> pozitif belirtiler; mezokortikal hipoaktivite -> negatif belirtiler), glutamat/NMDA hipotezi ve yüksek genetik kalıtılabilirlik (%80).",
            "prognosis": "Erken antipsikotik tedavisi, psikososyal beceri eğitimi ve aile desteği remisyon için kritiktir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Aktif Evre Belirtileri (En az 2/5 belirti, en az biri 1, 2 veya 3 olmalı)",
                "content": "Bir aylık bir süre boyunca aşağıdaki belirtilerden en az ikisinin bulunması (en az biri 1, 2 ya da 3 olmalıdır):",
                "items": [
                    "A1. Sanrılar (Hezeyanlar - perseküsyon, referans, grandiyözite vb.).",
                    "A2. Varsanılar (Halüsinasyonlar - özellikle işitsel üçüncü şahıs sesler).",
                    "A3. Dezorganize (darmadağın) konuşma (çağrışımlarda dağınıklık, teğetsellik, enkoherans).",
                    "A4. İleri derecede dezorganize ya da katatonik davranış.",
                    "A5. Negatif belirtiler (duygusal dışavurumda azalma, künt duygulanım, avolisyon/isteksizlik, aloji/konuşma fakirliği, anhedoni, asosyallik)."
                ]
            },
            {
                "code": "Kriter B",
                "title": "İşlevsellik Düzeyinde Düşme",
                "content": "İş, kişilerarası ilişkiler ya da kendine bakım gibi başlıca alanlarda işlevsellik düzeyinin belirgin olarak düşmesi."
            },
            {
                "code": "Kriter C",
                "title": "Süre Kuralı (En az 6 ay)",
                "content": "Bozukluğun süregiden belirtileri en az 6 ay sürer (bu 6 ay en az 1 aylık aktif evre belirtilerini içermelidir)."
            },
            {
                "code": "Kriter D",
                "title": "Şizoaffektif ve Duygudurum Dışlaması",
                "content": "Şizoaffektif bozukluk ve psikotik özellikli duygudurum bozuklukları dışlanmıştır."
            }
        ]
    },
    "schizoaffective": {
        "id": "schizoaffective",
        "nameTr": "Şizoaffektif Bozukluk",
        "nameEn": "Schizoaffective Disorder",
        "clinicalDescription": {
            "overview": "Şizofreni A ölçütünü karşılayan psikotik belirtilerle eşzamanlı olarak majör duygudurum ataklarının (Mani veya Majör Depresyon) bulunduğu VE hastalığın bir döneminde duygudurum atağı OLMADAN en az 2 hafta tek başına süren sanrı/varsanıların varlığıyla tanımlanan tablodur.",
            "epidemiology": "Yaygınlığı yaklaşık %0.3'tür. Kadınlarda daha sıktır.",
            "etiology": "Şizofreni ve Bipolar bozukluk genetik özelliklerinin ortak örtüşmesi.",
            "prognosis": "Şizofreniden daha iyi, Bipolar bozukluktan daha dirençli bir klinik seyir gösterir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Eşzamanlı Psikotik ve Duygudurum Atağı",
                "content": "Şizofreninin A ölçütünü karşılayan belirtilerle eşzamanlı olarak bir Majör Duygudurum Döneminin (Manik ya da Majör Depresif) bulunması."
            },
            {
                "code": "Kriter B",
                "title": "Duygudurum Olmaksızın 2 Hafta Psikoz (Kilit Ayrım)",
                "content": "Yaşam boyu hastalık süresi içinde, belirgin bir duygudurum dönemi OLMADAN en az 2 hafta süren sanrılar ya da varsanıların bulunması."
            },
            {
                "code": "Kriter C",
                "title": "Duygudurum Belirtilerinin Baskınlığı",
                "content": "Duygudurum dönemi ölçütlerini karşılayan belirtiler hastalığın aktif ve kalıcı dönemlerinin toplam süresinin çoğunda bulunur."
            },
            {
                "code": "Belirleyiciler / Alt tipler",
                "title": "Tip Belirleyicileri",
                "content": "Şizoaffektif bozukluk tek tanıdır; tip, tabloda yer alan duygudurum epizodlarına göre belirtilir.",
                "items": [
                    "Bipolar tip (F25.0): tablonun bir parçası olarak manik epizod vardır; majör depresif epizodlar da olabilir.",
                    "Depresif tip (F25.1): yalnızca majör depresif epizodlar vardır, manik epizod hiç olmamıştır.",
                    "Psikotik belirtiler yalnızca duygudurum epizodları sırasında görülüyorsa tanı psikotik özellikli duygudurum bozukluğudur (B ölçütü: duygudurum epizodu olmadan en az 2 hafta psikoz).",
                    "Ek belirleyiciler: katatoniyle; seyir (ilk epizod / çoğul epizod, akut / kısmi / tam yatışmada, süregen)."
                ]
            }
        ]
    },
    "schizophreniform": {
        "id": "schizophreniform",
        "nameTr": "Şizofreniform Bozukluk",
        "nameEn": "Schizophreniform Disorder",
        "clinicalDescription": {
            "overview": "Şizofreninin A ölçütlerini karşılayan ancak toplam süresi (öncül, aktif ve kalıntı dönemler dahil) 1 aydan uzun ve 6 aydan KISA süren tablodur. Belirtiler 6 ayı geçerse tanı Şizofreni olur.",
            "epidemiology": "Yaygınlığı şizofreniden düşüktür; hastaların üçte ikisi 6 ayı doldurarak şizofreniye dönüşür.",
            "etiology": "Erken psikoz patofizyolojisi.",
            "prognosis": "Hızlı antipsikotik müdahalesi ile tam remisyon sağlanan vakalarda prognoz mükemmeldir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Şizofreni A Belirtileri",
                "content": "Sanrı, varsanı, dezorganize konuşma, katatoni, negatif belirtilerden en az ikisinin bulunması."
            },
            {
                "code": "Kriter B",
                "title": "Süre Ölçütü (1 ay - 6 ay arası)",
                "content": "Bir atağın süresi en az 1 aydır ancak 6 aydan daha kısadır."
            }
        ]
    },
    "brief_psychotic": {
        "id": "brief_psychotic",
        "nameTr": "Kısa Psikotik Bozukluk",
        "nameEn": "Brief Psychotic Disorder",
        "clinicalDescription": {
            "overview": "Genellikle ağır bir psikososyal stresör (şok, kayıp, afet) sonrası aniden başlayan, sanrı, varsanı veya dezorganizasyon içeren, en az 1 gün sürüp en geç 1 ay içinde TAM REMİSYONLA düzelen tablodur.",
            "epidemiology": "İlk psikotik atakların yaklaşık %9'unu oluşturur. Kadınlarda 2 kat sıktır.",
            "etiology": "Ağır travmatik stres ve kırılgan kişilik yapısı.",
            "prognosis": "1 ay içinde tam düzelme ile sonuçlanır; prognozu en iyi psikotik tablodur."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Psikotik Belirtiler (En az 1 belirti)",
                "content": "A1. Sanrılar, A2. Varsanılar, A3. Dezorganize konuşma, A4. İleri derecede dezorganize ya da katatonik davranış (En az biri bulunmalıdır)."
            },
            {
                "code": "Kriter B",
                "title": "Süre ve Tam Düzelme (1 gün - 1 ay)",
                "content": "Bir atağın süresi en az 1 gündür ancak 1 aydan kısadır ve kişi hastalık öncesi işlevsellik düzeyine tam olarak geri döner."
            }
        ]
    },
    "delusional_disorder": {
        "id": "delusional_disorder",
        "nameTr": "Sanrılı Bozukluk (Paranoya)",
        "nameEn": "Delusional Disorder",
        "clinicalDescription": {
            "overview": "En az 1 ay süren, mantıksal olarak kurgulanmış sarsılmaz bir ya da daha çok sanrının (perseküsyon, kıskançlık, erotomanik, grandiyöz, somatik) varlığıyla karakterize; sanrı konusu dışında kişinin işlevselliğinin, muhakemesinin ve kişiliğinin KORUNDUĞU tablodur.",
            "epidemiology": "Yaygınlığı %0.2 civarındadır. İleri yaşlarda (40 yaş üstü) daha sık başlar.",
            "etiology": "İzole düşünce çarpıtmaları ve yansıtma (projeksiyon) savunma mekanizması.",
            "prognosis": "Sanrı kapsüllenmiştir; antipsikotik tedaviye dirençli olabilir ancak destekleyici terapiyle hasta stabilize edilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Sanrıların Varlığı (≥ 1 ay)",
                "content": "En az 1 ay süren bir (ya da daha çok) sanrının varlığı."
            },
            {
                "code": "Kriter B",
                "title": "Şizofreni A Dışlaması",
                "content": "Şizofreninin A ölçütü hiçbir zaman karşılanmamıştır (belirgin halüsinasyon, dezorganize konuşma ve negatif belirtiler yoktur)."
            },
            {
                "code": "Kriter C",
                "title": "İşlevselliğin Korunması",
                "content": "Sanrının ya da dallanıp budaklanmalarının doğrudan etkisi bir yana bırakılırsa işlevsellik belirgin olarak bozulmamıştır ve davranışlar açıkça tuhaf ya da alışılmadık değildir."
            },
            {
                "code": "Alt Tipler",
                "title": "DSM-5 Sanrı Tipleri",
                "content": "1. Erotomanik Tip (birinin kendine aşık olduğu inancı), 2. Büyüklük (Grandiyöz) Tipi, 3. Kıskançlık Tipi (eşin aldattığı inancı - Othello Sendromu), 4. Kötülük Görme (Persekütuar) Tipi, 5. Somatik Tip (vücutta böcek/koku sanrısı), 6. Karışık Tip."
            }
        ]
    },
    "paranoid_pd": {
        "id": "paranoid_pd",
        "nameTr": "Paranoid Kişilik Bozukluğu",
        "nameEn": "Paranoid Personality Disorder",
        "clinicalDescription": {
            "overview": "Erken erişkinlikte başlayan, başkalarının niyetlerini kötü niyetli olarak yorumlayan, yeterli bir temele dayanmaksızın insanlara karşı yaygın güvensizlik, kin gütme ve kuşkuculuk örüntüsüdür.",
            "epidemiology": "Genel popülasyonda %2-4 civarındadır. Erkeklerde daha sıktır.",
            "etiology": "Yansıtma mekanizması ve erken çocuklukta soğuk/tehditkar ebeveyn tutumları.",
            "prognosis": "Katı ve süreğendir; terapötik güven oluşturmak zordur."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Yaygın Kuşkuculuk (En az 4/7 belirti)",
                "content": "Aşağıdakilerden en az dördüyle belirlenen yaygın güvensizlik ve kuşkuculuk:",
                "items": [
                    "1. Yeterli bir dayanağı olmaksızın başkalarının kendisini sömürdüğünden, aldattığından ya da zarar verdiğinden kuşkulanma.",
                    "2. Dostlarının ya da iş arkadaşlarının bağlılığı/güvenilirliği konusunda yersiz kuşkular duyma.",
                    "3. Söylediklerinin aleyhine kullanılacağı korkusuyla başkalarına sır vermede isteksizlik.",
                    "4. Sıradan sözlerden ya da olaylardan aşağılayıcı ya da gözdağı veren anlamlar çıkarma.",
                    "5. Sürekli kin besleme (aşağılanmaları, haksızlıkları asla bağışlamama).",
                    "6. Karakterine ya da saygınlığına saldırıldığı algısıyla aniden öfkeyle karşılık verme.",
                    "7. Eşinin ya da cinsel partnerinin sadakatsizliğiyle ilgili yersiz yineleyen kuşkular duyma."
                ]
            }
        ]
    },
    "schizoid_pd": {
        "id": "schizoid_pd",
        "nameTr": "Şizoid Kişilik Bozukluğu",
        "nameEn": "Schizoid Personality Disorder",
        "clinicalDescription": {
            "overview": "Toplumsal ilişkilerden tamamen kopma, yakın ilişki kurmayı içtenlikle istememe ve kişilerarası ortamlarda kısıtlı duygusal dışavurumla (soğukluk/küntlük) seyreden kişilik yapısıdır.",
            "epidemiology": "Yaygınlığı %3-5 civarındadır. Erkeklerde daha sık görülür.",
            "etiology": "Sosyal ödül devresi hipoaktivitesi ve aşırı içedönüklük mizacı.",
            "prognosis": "Hasta yalnız yaşamaktan memnundur; genellikle çevre baskısı olmadıkça tedaviye başvurmaz."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Toplumsal Kopukluk (En az 4/7 belirti)",
                "content": "Aşağıdakilerden en az dördüyle belirlenen toplumsal ilişkilerden kopma ve kısıtlı duygulanım:",
                "items": [
                    "1. Ailenin bir parçası olmak dahil yakın ilişkileri istememe ve bunlardan zevk almama.",
                    "2. Neredeyse her zaman tekil (yalnız yapılan) etkinlikleri yeğleme.",
                    "3. Başka biriyle cinsel deneyim yaşamaya karşı çok az ilgi duyma ya da hiç duymama.",
                    "4. Çok az etkinlikten zevk alma ya da hiçbirinden zevk almama.",
                    "5. Birinci derece akrabaları dışında yakın arkadaşının ya da sırdaşının olmaması.",
                    "6. Başkalarının övgülerine ya da yergilerine karşı kayıtsız/aldırmaz görünme.",
                    "7. Duygusal soğukluk, kopukluk ya da tekdüze bir duygulanım gösterme."
                ]
            }
        ]
    },
    "schizotypal_pd": {
        "id": "schizotypal_pd",
        "nameTr": "Şizotipal Kişilik Bozukluğu",
        "nameEn": "Schizotypal Personality Disorder",
        "clinicalDescription": {
            "overview": "Düşünce ve algıda tuhaflıklar (büyüsel düşünüş, altıncı his inancı, olağandışı algısal yaşantılar), tuhaf giyim/konuşma ve yakın ilişkilerde yoğun toplumsal kaygıyla seyreden tablodur.",
            "epidemiology": "Yaygınlığı %3-4 civarındadır. Şizofreni hastalarının birinci derece yakınlarında sıktır.",
            "etiology": "Şizofreni genetik spektrumunda yer alır.",
            "prognosis": "Düşük doz antipsikotik ve sosyal beceri eğitimi yaşam kalitesini artırır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Bilişsel/Algısal Tuhaflıklar (En az 5/9 belirti)",
                "content": "Aşağıdakilerden en az beşiyle belirlenen toplumsal ve kişilerarası yetersizlik örüntüsü:",
                "items": [
                    "1. Alınma (referans) fikirleri (sanrı boyutunda olmayan).",
                    "2. Altkültürel değerlerle bağdaşmayan büyüsel düşünüş ya da tuhaf inançlar (telepati, basiret).",
                    "3. Olağandışı algısal yaşantılar (bedensel yanılsamalar).",
                    "4. Tuhaf düşünme ve konuşma biçimi (belirsiz, dolambaçlı, mecazi).",
                    "5. Kuşkuculuk ya da paranoid düşünceler.",
                    "6. Uygunsuz ya da kısıtlı duygulanım.",
                    "7. Tuhaf, alışılagelmişin dışında davranış ya da görünüm.",
                    "8. Birinci derece yakınlar dışında yakın arkadaşın olmaması.",
                    "9. Aşırı toplumsal kaygı (tanışıklıkla azalmayan paranoid korkular)."
                ]
            }
        ]
    },
    "borderline_pd": {
        "id": "borderline_pd",
        "nameTr": "Sınırda (Borderline) Kişilik Bozukluğu",
        "nameEn": "Borderline Personality Disorder",
        "clinicalDescription": {
            "overview": "Kişilerarası ilişkilerde, benlik algısında ve duygulanımda belirgin kararsızlık (oynaklık), saatlik duygudurum krizleri, terk edilme dehşeti, kronik boşluk hissi, dürtüsellik ve yineleyen kendine zarar verme/özkıyım davranışları ile karakterizedir.",
            "epidemiology": "Genel popülasyonda %1.6 - 2, psikiyatri kliniklerinde %20 civarındadır. Kadınlarda %75 sıklıkta görülür.",
            "etiology": "Biyososyal Teori (Linehan): Duygusal aşırı duyarlılık + Geçersiz kılıcı (invalidating) erken çevre; erken çocukluk travmaları.",
            "prognosis": "Diyalektik Davranış Terapisi (DBT) ile intihar ve kendine zarar verme davranışlarında %80'in üzerinde azalma sağlanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Yaygın Kararsızlık ve Dürtüsellik (En az 5/9 belirti)",
                "content": "Aşağıdakilerden en az beşiyle belirlenen kararsızlık ve dürtüsellik örüntüsü:",
                "items": [
                    "1. Gerçek ya da imgesel bir ayrılma/terk edilmeden çılgınca kaçınma çabaları.",
                    "2. Gözünde aşırı büyütme (idealleştirme) ve yerin dibine sokma (değersizleştirme) uçları arasında giden kararsız ilişkiler (Bölme / Splitting).",
                    "3. Kimlik karmaşası: Belirgin ve sürekli kararsız benlik algısı.",
                    "4. Kendine zarar verme potansiyeli yüksek en az iki alanda dürtüsellik (para harcama, riskli cinsellik, madde, tıkınırcasına yeme, hızlı araç sürme).",
                    "5. Yineleyen özkıyım davranışları, girişimleri, gözdağı vermeleri ya da kendine kıyım (jilet atma, kendini yakma) davranışları.",
                    "6. Duygulanımda belirgin tepkiselliğe bağlı duygudurum kararsızlığı (saatler süren yoğun disfori, irritabilite ya da anksiyete).",
                    "7. Süreğen bir boşluk duygusu.",
                    "8. Uygunsuz yoğun öfke ya da öfkesini denetlemekte güçlük çekme.",
                    "9. Stresle tetiklenen geçici paranoid düşünceler ya da ağır dissosiyatif belirtiler."
                ]
            }
        ]
    },
    "antisocial_pd": {
        "id": "antisocial_pd",
        "nameTr": "Antisosyal Kişilik Bozukluğu",
        "nameEn": "Antisocial Personality Disorder",
        "clinicalDescription": {
            "overview": "15 yaşından beri süregelen, başkalarının temel haklarını hiçe sayma ve çiğneme, yasalara uymama, dolandırıcılık, dürtüsellik, saldırganlık, vicdan azabı/pişmanlık duymama ve empati yoksunluğu örüntüsüdür.",
            "epidemiology": "Toplumda %3 (erkeklerde %3-5, kadınlarda %1). Cezaevlerinde %50-70 civarındadır.",
            "etiology": "Düşük otonomik uyarılabilirlik (korkusuzluk hipotezi), prefrontal korteks gri cevher hacim düşüklüğü ve çocuklukta Davranım Bozukluğu öyküsü.",
            "prognosis": "Yaşlandıkça (40 yaş sonrası) kriminal dürtüsellik azalabilir ancak empati yoksunluğu kalıcıdır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Hak İhlali Örüntüsü (En az 3/7 belirti)",
                "content": "15 yaşından beri süregelen, aşağıdakilerden en az üçüyle belirlenen başkalarının haklarını çiğneme örüntüsü:",
                "items": [
                    "1. Tutuklanmasına yol açacak yineleyen eylemlerde bulunma (yasalara uymama).",
                    "2. Sürekli yalan söyleme, takma adlar kullanma ya da çıkarları/zevk için başkalarını dolandırma.",
                    "3. Dürtüsellik ya da geleceğini tasarlamama.",
                    "4. Yineleyen kavgalar ya da saldırılarla belirlenen kolay kızma ve saldırganlık.",
                    "5. Kendisinin ya da başkalarının güvenliğini pervasızca tehlikeye atma.",
                    "6. Sürekli bir işi sürdürememe ya da mali yükümlülüklerini yerine getirmeme (sorumsuzluk).",
                    "7. Başkasına zarar verme, kötü davranma ya da hırsızlık yapma durumunda vicdan azabı çekmeme / aldırmama."
                ]
            },
            {
                "code": "Kriter B & C",
                "title": "Yaş Sınırı ve Davranım Bozukluğu Kanıtı",
                "content": "Birey en az 18 yaşındadır ve 15 yaşından önce başlayan bir Davranım Bozukluğunun kanıtları bulunmaktadır."
            }
        ]
    },
    "narcissistic_pd": {
        "id": "narcissistic_pd",
        "nameTr": "Narsisistik Kişilik Bozukluğu",
        "nameEn": "Narcissistic Personality Disorder",
        "clinicalDescription": {
            "overview": "Büyüklenmecilik (düşlemde ya da davranışta üstünlük hissi), sürekli aşırı hayranlık ve övgü gereksinimi, empati yoksunluğu ve başkalarını kendi çıkarları için kullanma örüntüsüdür.",
            "epidemiology": "Yaygınlığı %1-6 arasındadır. Erkeklerde %50-75 oranında daha sıktır.",
            "etiology": "Kırılgan özdeğer savunması; aşırı şımartıcı veya aşırı soğuk/koşullu ebeveyn tutumları.",
            "prognosis": "Şema Terapi ile kırılgan çocuk moduyla çalışılarak empati kapasitesi geliştirilebilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Büyüklenmecilik ve Hayranlık Arayışı (En az 5/9 belirti)",
                "content": "Aşağıdakilerden en az beşiyle belirlenen büyüklenmecilik ve empati yoksunluğu:",
                "items": [
                    "1. Kendisinin çok önemli olduğu duygusunu taşıma (büyüklenmecilik).",
                    "2. Sınırsız başarı, güç, zeka, güzellik ya da kusursuz sevgi düşlemleriyle kafa yorma.",
                    "3. Özel ve eşi bulunmaz biri olduğuna ve sadece üstün konumdaki kişilerce anlaşılabileceğine inanma.",
                    "4. Çok beğenilmek/övgü almak isteme.",
                    "5. Hak kazanmışlık duygusu (özel ayrıcalıklı bir muamele bekleme).",
                    "6. Kendi amaçlarına ulaşmak için başkalarını kullanma (sömürme).",
                    "7. Empati yapamama: Başkalarının duygularını ve gereksinimlerini tanımada isteksizlik.",
                    "8. Sıklıkla başkalarını kıskanma ya da başkalarının kendisini kıskandığına inanma.",
                    "9. Başkalarına saygısız, kibirli ve küstahça davranma."
                ]
            }
        ]
    },
    "histrionic_pd": {
        "id": "histrionic_pd",
        "nameTr": "Histriyonik Kişilik Bozukluğu",
        "nameEn": "Histrionic Personality Disorder",
        "clinicalDescription": {
            "overview": "Aşırı duygusallık, ilgi odağı olma arzusu, baştan çıkarıcı/ayartıcı davranışlar, teatral ve dramatik anlatım ile ilişkileri olduğundan daha yakın görme örüntüsüdür.",
            "epidemiology": "Yaygınlığı %1.8 civarındadır. Kadınlarda daha sık tanı alır.",
            "etiology": "Dikkat çekme yoluyla terk edilmeyi engelleme bilişsel şemaları.",
            "prognosis": "Psikodinamik ve BDT ile derin duygusal ihtiyaçları sözel ifade etme becerisi kazandırılır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Aşırı Duygusallık ve İlgi Arayışı (En az 5/8 belirti)",
                "content": "Aşağıdakilerden en az beşiyle belirlenen ilgi odağı olma örüntüsü:",
                "items": [
                    "1. İlgi odağı olmadığı durumlarda rahatsız olma.",
                    "2. Başkalarıyla etkileşimde uygunsuz biçimde cinsel yönden ayartıcı ya da kışkırtıcı davranışlar sergileme.",
                    "3. Hızlı değişen ve yüzeysel kalan duygular sergileme.",
                    "4. İlgiyi üzerine çekmek için sürekli fiziksel görünümünü kullanma.",
                    "5. Aşırı düzeyde etkilemeye yönelik ve ayrıntıdan yoksun bir konuşma biçimi.",
                    "6. Yapmacık davranma, teatrallik ve duygularını abartılı gösterme.",
                    "7. Kolay telkin edilebilme (başkalarından kolay etkilenme).",
                    "8. İlişkilerin olduğundan daha yakın olduğunu düşünme."
                ]
            }
        ]
    },
    "avoidant_pd": {
        "id": "avoidant_pd",
        "nameTr": "Çekingen (Kaçıngan) Kişilik Bozukluğu",
        "nameEn": "Avoidant Personality Disorder",
        "clinicalDescription": {
            "overview": "Toplumsal ketlenme, yetersizlik duyguları ve olumsuz değerlendirilmeye aşırı duyarlılık nedeniyle; yakın ilişkileri çok arzulamasına rağmen reddedilme ve eleştirilme korkusuyla insanlardan kaçınma örüntüsüdür.",
            "epidemiology": "Yaygınlığı %2.4'tür. Kadın ve erkeklerde eşit görülür.",
            "etiology": "Erken çocuklukta yoğun utanç, reddedilme ve 'Ben kusurluyum' şeması.",
            "prognosis": "Şema Terapi ve BDT ile sosyal etkileşimlerde kademeli maruziyet sağlanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Toplumsal Ketlenme ve Yetersizlik (En az 4/7 belirti)",
                "content": "Aşağıdakilerden en az dördüyle belirlenen kaçınma örüntüsü:",
                "items": [
                    "1. Eleştirilme, onaylanmama ya da reddedilme korkusuyla önemli derecede kişilerarası ilişki gerektiren mesleki etkinliklerden kaçınma.",
                    "2. Sevileceğinden kesin emin olmadıkça insanlarla ilişkiye girmekten kaçınma.",
                    "3. Mahcup düşeceği ya da alay edileceği korkusuyla yakın ilişkilerde tutukluk gösterme.",
                    "4. Toplumsal durumlarda eleştirilme ya da dışlanma düşüncesiyle kafa yorma.",
                    "5. Yetersizlik duyguları yüzünden yeni kişilerarası ortamlarda ketlenme.",
                    "6. Kendisini toplumsal yönden beceriksiz, çekici olmayan ya da aşağı görme.",
                    "7. Mahcup olabileceği gerekçesiyle kişisel riskler alma ya da yeni etkinliklere katılmada isteksizlik."
                ]
            }
        ]
    },
    "dependent_pd": {
        "id": "dependent_pd",
        "nameTr": "Bağımlı Kişilik Bozukluğu",
        "nameEn": "Dependent Personality Disorder",
        "clinicalDescription": {
            "overview": "Başkalarının bakımına ve onayına duyulan aşırı ve yaygın gereksinim nedeniyle boyun eğici, yapışkan davranışlar sergileme ve ayrılmaktan/tek başına karar almaktan dehşetle korkma örüntüsüdür.",
            "epidemiology": "Yaygınlığı %0.5 - 1 arasındadır. Kadınlarda daha sıktır.",
            "etiology": "Aşırı koruyucu-kısıtlayıcı ebeveynlik ve 'Ben tek başıma yetersizim' temel inancı.",
            "prognosis": "BDT ile özerklik (otonomi) ve girişkenlik becerileri kazandırılır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Boyun Eğici ve Yapışkan Tutum (En az 5/8 belirti)",
                "content": "Aşağıdakilerden en az beşiyle belirlenen aşırı bakım gereksinimi:",
                "items": [
                    "1. Başkalarından bolca öğüt ve güvence almadıkça günlük kararlarını vermekte güçlük çekme.",
                    "2. Yaşamının çoğu önemli alanında sorumluluk almak için başkalarına gereksinim duyma.",
                    "3. Desteğini ya da onayını yitireceği korkusuyla başkalarıyla aynı görüşte olmadığını söylemekte zorlanma.",
                    "4. Kendine güven düşüklüğü yüzünden tasarıları başlatmakta güçlük çekme.",
                    "5. Başkalarının bakım ve desteğini sağlamak için hoş olmayan şeyleri yapmaya gönüllü olma.",
                    "6. Kendine bakamayacağı korkusu yüzünden tek başına kaldığında çaresiz hissetme.",
                    "7. Yakın bir ilişkisi sonlandığında bakım ve destek kaynağı olarak derhal yeni bir ilişki arayışına girme.",
                    "8. Kendi kendine bakma durumunda bırakılacağı korkusu üzerine gerçekçi olmayan kuruntular duyma."
                ]
            }
        ]
    },
    "ocpd": {
        "id": "ocpd",
        "nameTr": "Obsesif-Kompulsif Kişilik Bozukluğu (OKKB)",
        "nameEn": "Obsessive-Compulsive Personality Disorder (OCPD)",
        "clinicalDescription": {
            "overview": "Esneklik, açıklık ve verimlilik pahasına düzenlilik, mükemmeliyetçilik, zihinsel ve kişilerarası denetim üzerine aşırı kafa yorma örüntüsüdür. OKB'den farkı EGOSİNTONİK olmasıdır (kişi kurallarının doğruluğuna inanır).",
            "epidemiology": "En sık görülen kişilik bozukluklarından biridir (%2-8). Erkeklerde 2 kat fazladır.",
            "etiology": "Aşırı kontrolcü, katı ahlaki kuralları olan aile ortamı.",
            "prognosis": "Şema Terapi ile hata yapma toleransı ve duygusal esneklik geliştirilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Düzenlilik ve Denetim Örüntüsü (En az 4/8 belirti)",
                "content": "Aşağıdakilerden en az dördüyle belirlenen mükemmeliyetçilik ve katılık:",
                "items": [
                    "1. Etkinliğin ana amacını unutturacak derecede ayrıntılar, kurallar, listeler, sıralama ve programla uğraşma.",
                    "2. İşin tamamlanmasını engelleyen mükemmeliyetçilik gösterme (kendi katı standartları karşılanmadığı için projeyi bitirememe).",
                    "3. Boş zaman etkinliklerini ve arkadaşlıkları dışlayacak derecede kendini işe ve üretkenliğe adama.",
                    "4. Ahlak, doğruluk ve değerler konusunda aşırı vicdanlı ve esneklikten yoksun olma.",
                    "5. Özel bir değeri olmasa bile eskimiş ya da değersiz şeyleri elden çıkaramama.",
                    "6. Görevleri tam istediği gibi yapmayacakları gerekçesiyle başkalarına iş delege edememe.",
                    "7. Kendisi ve başkaları için para harcamada aşırı cimrilik gösterme (parayı felaket durumları için saklama).",
                    "8. Katılık ve inatçılık sergileme."
                ]
            }
        ]
    },
    "anorexia_nervosa": {
        "id": "anorexia_nervosa",
        "nameTr": "Anoreksiya Nervoza",
        "nameEn": "Anorexia Nervosa",
        "clinicalDescription": {
            "overview": "Kişinin belirgin derecede düşük vücut ağırlığına (BKİ < 18.5) sahip olmasına karşın kilo almaktan veya şişmanlamaktan aşırı korkması ve vücut ağırlığını/biçimini algılamada ağır bozulma yaşamasıdır.",
            "epidemiology": "Genç kadınlarda %0.5 - 1. Psikiyatride mortalite (ölüm) oranı en yüksek bozukluktur (%5-10 kardiyak arrest ve intihar).",
            "etiology": "Aşırı mükemmeliyetçilik, kontrol arayışı, batı kültürü zayıflık ideali ve genetik yatkınlık.",
            "prognosis": "Aile Temelli Terapi (FBT / Maudsley Modeli) ve medikal stabilizasyon esastır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Belirgin Düşük Vücut Ağırlığı",
                "content": "Gereksinimlere göre enerji alımını kısıtlama sonucu yaş, cinsiyet ve gelişimsel yolağa göre belirgin derecede düşük vücut ağırlığına (BKİ < 18.5) sahip olma."
            },
            {
                "code": "Kriter B",
                "title": "Kilo Alma Korkusu",
                "content": "Belirgin derecede düşük vücut ağırlığında olmasına karşın kilo almaktan ya da şişmanlamaktan aşırı korkma ya da kilo almayı engelleyen süregiden davranışlar sergileme."
            },
            {
                "code": "Kriter C",
                "title": "Beden Algısında Bozulma",
                "content": "Bireyin vücut ağırlığını ya da biçimini algılama biçiminde bozukluk, vücut ağırlığının özdeğerlendirmede yersiz bir etki yaratması ya da düşük kilonun getirdiği tehlikeyi inkar etme."
            },
            {
                "code": "Alt Tipler",
                "title": "DSM-5 Tipleri",
                "content": "1. Kısıtlayıcı Tip (sadece diyet, oruç, aşırı egzersiz), 2. Tıkınırcasına Yeme / Çıkarma Tipi (düzenli kusma, laksatif kullanma)."
            }
        ]
    },
    "bulimia_nervosa": {
        "id": "bulimia_nervosa",
        "nameTr": "Bulimiya Nervoza",
        "nameEn": "Bulimia Nervosa",
        "clinicalDescription": {
            "overview": "Yineleyen tıkınırcasına yeme nöbetleri ve ardından kilo almayı engellemek için parmakla kusma, laksatif kullanma veya aşırı egzersiz gibi telafi edici davranışların olmasıdır. Kişi NORMAL kilo aralığındadır.",
            "epidemiology": "Genç kadınlarda %1-1.5 civarındadır.",
            "etiology": "Katı diyet kurallarının kırılmasıyla tetiklenen tıkınma ve ardından gelen arınma döngüsü (Fairburn Modeli).",
            "prognosis": "CBT-E (Yeme Bozuklukları BDT) ve yüksek doz Fluoksetin (60 mg) ile yüksek iyileşme sağlanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Tıkınırcasına Yeme Nöbetleri",
                "content": "1. Benzer koşullarda çoğu insanın yiyebileceğinden çok daha fazla yiyeceği kısa sürede tüketme. 2. Yeme üzerinde denetimi yitirme hissi."
            },
            {
                "code": "Kriter B & C",
                "title": "Telafi Edici Davranışlar ve Sıklık (Haftada ≥ 1, en az 3 ay)",
                "content": "Kilo almaktan kaçınmak için kendini kusturma, laksatif/diüretik kötüye kullanımı, aç kalma veya aşırı egzersiz yapma. En az 3 ay boyunca haftada en az bir kez ortaya çıkar."
            },
            {
                "code": "Kriter D & E",
                "title": "Özdeğerlendirme ve Anoreksiya Dışlaması",
                "content": "Kendilik değeri vücut biçimi ve kilosundan aşırı etkilenir. Tablo yalnızca Anoreksiya epizodu sırasında ortaya çıkmaz (kilo normaldir)."
            }
        ]
    },
    "binge_eating": {
        "id": "binge_eating",
        "nameTr": "Tıkınırcasına Yeme Bozukluğu",
        "nameEn": "Binge-Eating Disorder",
        "clinicalDescription": {
            "overview": "Kişinin kendini durduramayarak devasa miktarda yemeği tıkınırcasına yemesi ve ardından yoğun suçluluk duymasıdır. Bulimiya'dan farkı KUSMA/LAKSATİF gibi telafi edici eylemlerin KESİNLİKLE OLMAMASIDIR.",
            "epidemiology": "En sık görülen yeme bozukluğudur (%2-3.5). Obez bireylerde sıktır.",
            "etiology": "Olumsuz duyguları yeme yoluyla düzenleme (duygusal yeme).",
            "prognosis": "BDT ve Lisdeksamfetamin/SSRI ile kontrol altına alınır."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B",
                "title": "Tıkınma Nöbetleri ve Özellikleri (En az 3/5)",
                "content": "Olağandan çok daha hızlı yeme, rahatsız edici tokluğa kadar yeme, aç hissetmiyorken yeme, utandığı için yalnız yeme, sonrasında kendinden iğrenme/suçluluk duyma."
            },
            {
                "code": "Kriter C & D",
                "title": "Telafi Edici Eylemlerin Olmaması",
                "content": "Haftada en az bir kez 3 ay boyunca sürer ve Bulimiyadaki gibi uygunsuz ödünleyici (kusma vb.) davranışlar YOKTUR."
            }
        ]
    },
    "pica": {
        "id": "pica",
        "nameTr": "Pika (Yenmeyen Maddeleri Yeme)",
        "nameEn": "Pica",
        "clinicalDescription": {
            "overview": "Gelişimsel düzeye uygunsuz olarak, en az 1 ay boyunca besin değeri olmayan ve yenmeyen maddeleri (toprak, tebeşir, kil, kireç, saç, sabun) sürekli yemedir.",
            "epidemiology": "Çocuklarda, hamilelerde ve zihinsel engelli bireylerde daha sıktır.",
            "etiology": "Ağır demir/çinko eksikliği veya duyusal uyarılma arayışı.",
            "prognosis": "Mineral takviyesi ve davranışsal müdahale ile düzelir."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B",
                "title": "Yenmeyen Maddeleri Yeme ve Süre (≥ 1 ay)",
                "content": "En az 1 ay boyunca besin değeri olmayan, yenilebilir olmayan maddeleri sürekli olarak yeme ve gelişimsel düzeye uygunsuz olması."
            }
        ]
    },
    "somatic_symptom_disorder": {
        "id": "somatic_symptom_disorder",
        "nameTr": "Bedensel Belirti Bozukluğu (Somatizasyon)",
        "nameEn": "Somatic Symptom Disorder",
        "clinicalDescription": {
            "overview": "Kişinin günlük yaşamını bozan rahatsız edici bir ya da birden fazla bedensel belirti (kronik ağrı, yanma, uyuşma) yaşaması ve bu belirtilerin ciddiyetine ilişkin aşırı ve orantısız düşünce, kaygı ve zaman harcamasıdır.",
            "epidemiology": "Yaygınlığı %5-7 civarındadır. Kadınlarda daha sıktır.",
            "etiology": "Duygusal sıkıntıların bedensel duyumlar olarak somatize edilmesi ve aşırı bedensel odaklanma.",
            "prognosis": "Düzenli tek bir hekim takibi ve BDT ile doktor alışverişi ve tetkik bağımlılığı azaltılır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Sıkıntı Verici Bedensel Belirtiler",
                "content": "Günlük yaşamı bozan bir ya da birden fazla bedensel belirtinin varlığı."
            },
            {
                "code": "Kriter B",
                "title": "Belirtilerle İlgili Aşırı Düşünce/Kaygı (En az 1/3)",
                "content": "1. Belirtilerin ciddiyetiyle orantısız ve sürekli düşünceler. 2. Sağlık ya da belirtilerle ilgili sürekli yüksek kaygı. 3. Belirtilere aşırı zaman ve enerji harcama."
            },
            {
                "code": "Kriter C",
                "title": "Süre Kriteri (≥ 6 ay)",
                "content": "Herhangi bir belirti sürekli olmasa da belirtili olma durumu 6 aydan uzun sürer."
            }
        ]
    },
    "illness_anxiety_disorder": {
        "id": "illness_anxiety_disorder",
        "nameTr": "Hastalık Kaygısı Bozukluğu (Hipokondriyazis)",
        "nameEn": "Illness Anxiety Disorder",
        "clinicalDescription": {
            "overview": "Belirgin bedensel belirti OLMAMASINA veya çok hafif olmasına karşın, kişinin ölümcül/ağır bir hastalığı (kanser, tümör) olduğuna dair aşırı kafa yorması ve sürekli tıbbi tetkik/araştırma yapmasıdır.",
            "epidemiology": "Yaygınlığı %1.3 - 10 arasındadır. Kadın ve erkeklerde eşit görülür.",
            "etiology": "Sağlık anksiyetesi ve belirsizliğe tahammülsüzlük.",
            "prognosis": "BDT ile güvence arama davranışları söndürülür."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B",
                "title": "Ağır Hastalık Düşüncesi ve Belirti Yokluğu",
                "content": "Ağır bir hastalığı olduğunu ya da olacağını düşünme üzerine kafa yorma. Bedensel belirti yoktur ya da çok hafiftir."
            },
            {
                "code": "Kriter C & D & E",
                "title": "Aşırı Sağlık Davranışları ve Süre (≥ 6 ay)",
                "content": "Yüksek kaygı ve aşırı sağlık davranışları (vücudunu kontrol etme, doktora gitme ya da kaçınma). Süre en az 6 aydır."
            }
        ]
    },
    "conversion_disorder": {
        "id": "conversion_disorder",
        "nameTr": "Dönüşüm (Konversiyon) Bozukluğu",
        "nameEn": "Conversion Disorder (Functional Neurological)",
        "clinicalDescription": {
            "overview": "İstemli motor ya da duyusal işlevlerde (felç, körlük, afoni, nöbet benzeri kasılmalar) değişme olması ve bu belirtilerin bilinen nörolojik hastalıklarla (inme, epilepsi) bağdaşmadığına ilişkin klinik kanıtların bulunmasıdır.",
            "epidemiology": "Nöroloji kliniklerine başvuranların %5'ini oluşturur. Kadınlarda 2-3 kat fazladır.",
            "etiology": "Bilinçdışı psikolojik çatışmaların bedensel nörolojik semptoma dönüştürülmesi (Freudyen primer kazanç).",
            "prognosis": "Akut başlangıçlı vakalarda psikoeğitim ve fizik tedaviyle hızlı düzelme sağlanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Motor/Duyusal İşlev Değişikliği",
                "content": "İstemli motor ya da duyusal işlevlerde değişme olduğunu gösteren bir ya da birden fazla belirti (güçsüzlük, felç, yutma güçlüğü, nöbetler, duyu yitimi)."
            },
            {
                "code": "Kriter B",
                "title": "Nörolojik Bağdaşmazlık Kanıtı",
                "content": "Belirti ile tanınan nörolojik ya da tıbbi durumlar arasında bağdaşmazlık olduğunu gösteren klinik bulgular (örn. Hoover testi pozitifliği, Video-EEG'de epileptik deşarj olmaması)."
            },
            {
                "code": "Belirleyiciler / Alt tipler",
                "title": "Belirti Türü ve Seyir Belirleyicileri",
                "content": "Konversiyon (işlevsel nörolojik belirti) bozukluğu tek tanıdır; belirti türü kodlamada belirtilir.",
                "items": [
                    "Güçsüzlük ya da felçle; anormal hareketle (titreme, distoni, miyoklonus, yürüme bozukluğu); yutma belirtileriyle; konuşma belirtisiyle (afoni, peltek konuşma) — F44.4.",
                    "Atak ya da nöbetlerle (psikojenik non-epileptik nöbet, PNES) — F44.5. Kesin tanı tipik bir atağın video-EEG ile kaydedilip eşzamanlı epileptik etkinlik olmadığının gösterilmesiyle konur.",
                    "Anestezi ya da duyu kaybıyla; özel duyu belirtisiyle (görme, koku alma, işitme) — F44.6. Karışık belirtilerle — F44.7.",
                    "Seyir: akut epizod (6 aydan kısa) ya da süregen (6 ay veya daha uzun); psikolojik stres etkeniyle ya da olmaksızın. Psikolojik etken ya da \"aldırmazlık\" tanı için gerekmez."
                ]
            }
        ]
    },
    "factitious_disorder": {
        "id": "factitious_disorder",
        "nameTr": "Yapay Bozukluk (Münchausen Sendromu)",
        "nameEn": "Factitious Disorder (Munchausen Syndrome)",
        "clinicalDescription": {
            "overview": "Belirlenebilir hiçbir dışsal ödül (para, nafaka, ceza muafiyeti) olmaksızın, kişinin kendisinde ya da başkasında (çocuğunda) bilerek ve kasten hastalık belirtileri üretmesi ya da hastalık uydurmasıdır.",
            "epidemiology": "Hastanede yatanların %1'ini oluşturur. Sağlık çalışanlarında sıktır.",
            "etiology": "Hasta rolü üstlenerek ilgi ve şefkat görme ihtiyacı.",
            "prognosis": "Adli ve klinik yönetim gerektirir; çocuk istismarı (Münchausen by Proxy) durumunda acil koruma şarttır."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B",
                "title": "Belirtileri Kasten Üretme",
                "content": "Kendisinde ya da bir başkasında fiziksel ya da psikolojik belirti ve bulguları bilerek ortaya çıkarma ya da hastalık uydurma."
            },
            {
                "code": "Kriter C",
                "title": "Dışsal Kazancın Olmaması",
                "content": "Belirlenebilir bir dış ödül (maddi kazanç, yasal sorumluluktan kaçma) olmaksızın hasta rolü sergilenir."
            }
        ]
    },
    "did": {
        "id": "did",
        "nameTr": "Dissosiyatif Kimlik Bozukluğu",
        "nameEn": "Dissociative Identity Disorder",
        "clinicalDescription": {
            "overview": "İki ya da daha fazla ayrı kişilik durumu (alter kimlikler) ile belirlenen kimlik bölünmesi ve önemli kişisel bilgileri, travmatik olayları anımsamada günlük unutkanlıkla açıklanamayacak yineleyen amnezi boşluklarıdır.",
            "epidemiology": "Yaygınlığı yaklaşık %1-1.5'tir. Kadınlarda daha sık tanı alır.",
            "etiology": "Erken çocuklukta (özellikle 6 yaş öncesi) yaşanan ağır, süreğen ve kaçılamaz fiziksel/cinsel travmalar.",
            "prognosis": "Faz Odaklı Travma Terapisi (Güvenlik -> Travma İşleme -> Alterlerin Entegrasyonu) ile bütünleşme hedeflenir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "İki veya Daha Fazla Ayrı Kişilik Durumu",
                "content": "İki ya da daha fazla ayrı kişilik durumuyla belirlenen kimlik bölünmesi (kendilik duyumu ve eylemlilikte belirgin süreksizlik)."
            },
            {
                "code": "Kriter B",
                "title": "Amnezi Boşlukları",
                "content": "Günlük olayları, önemli kişisel bilgileri ya da travmatik olayları anımsamada sıradan unutkanlıkla bağdaşmayan yineleyen boşluklar."
            }
        ]
    },
    "depersonalization_derealization": {
        "id": "depersonalization_derealization",
        "nameTr": "Duyarsızlaşma / Yabancılaşma",
        "nameEn": "Depersonalization/Derealization Disorder",
        "clinicalDescription": {
            "overview": "Kişinin kendi bedenine, zihnine veya duygularına dışarıdan bir gözlemci gibi yabancılaşması (depersonalizasyon) ya da çevresindeki dünyayı rüya gibi, sisli ve cansız algılamasıdır (derealizasyon). Gerçeklik testi TAMDIR.",
            "epidemiology": "Yaşam boyu geçici yaşama %50 iken bozukluk boyutu %1-2'dir.",
            "etiology": "Aşırı anksiyete ve panik anında beynin geliştirdiği dissosiyatif savunma.",
            "prognosis": "Topraklanma (grounding) teknikleri ve BDT ile remisyon sağlanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B",
                "title": "Yabancılaşma Yaşantısı ve Gerçeklik Testinin Korunması",
                "content": "Süregiden depersonalizasyon (kendi bedenine yabancılaşma) ya da derealizasyon (çevreye yabancılaşma) deneyimleri. Bu sırada gerçekliği değerlendirme yetisi tam olarak korunur (psikoz değildir)."
            }
        ]
    },
    "dissociative_amnesia": {
        "id": "dissociative_amnesia",
        "nameTr": "Dissosiyatif Amnezi (Füg ile Birlikte)",
        "nameEn": "Dissociative Amnesia",
        "clinicalDescription": {
            "overview": "Genellikle travmatik ya da aşırı stresli nitelikteki önemli kişisel bilgileri (otobiyografik anıları) sıradan unutkanlıkla açıklanamayacak biçimde anımsayamama tablosudur. Füg eşlik ederse amaçsız bir seyahat ve yeni kimlik edinme görülür.",
            "epidemiology": "Yaygınlığı %1.8'dir.",
            "etiology": "Ağır travmatik yaşantılar karşısında anı ağlarının dissosiyatif olarak bloke olması.",
            "prognosis": "Güvenli terapi ortamında anılar kademeli olarak geri gelir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Otobiyografik Bellek Yitimi",
                "content": "Genellikle travmatik ya da stresli nitelikteki önemli kişisel bilgileri anımsayamama hali (sıradan unutkanlıkla açıklanamaz)."
            },
            {
                "code": "Belirleyici",
                "title": "Dissosiyatif Füg ile Birlikte",
                "content": "Amneziye kimlik karmaşası ve amaçlı ya da şaşkın bir biçimde yapılan yolculuk/seyahat eşlik ediyorsa bu belirleyici kullanılır."
            }
        ]
    },
    "adhd": {
        "id": "adhd",
        "nameTr": "Dikkat Eksikliği ve Hiperaktivite Bozukluğu (DEHB)",
        "nameEn": "Attention-Deficit/Hyperactivity Disorder (ADHD)",
        "clinicalDescription": {
            "overview": "Gelişimsel düzeye uygunsuz düzeyde dikkatsizlik, aşırı hareketlilik (hiperaktivite) ve dürtüsellik ile seyreden, belirtileri 12 yaşından önce başlayan ve birden fazla ortamda işlevselliği bozan nörogelişimsel bozukluktur.",
            "epidemiology": "Çocuklarda %5-7, yetişkinlerde %2.5-4 civarındadır. Erkeklerde 2-3 kat sıktır.",
            "etiology": "Prefrontal korteks ve bazal ganglionlarda dopamin/noradrenalin taşıyıcı disfonksiyonu; %75-80 kalıtılabilirlik.",
            "prognosis": "Metilfenidat/Atomoksetin ve Davranışçı Terapi kombinasyonu ile akademik ve sosyal başarı belirgin artar."
        },
        "criteriaList": [
            {
                "code": "Kriter A1",
                "title": "Dikkatsizlik Belirtileri (En az 6/9, yetişkinde en az 5/9)",
                "content": "En az 6 ay süren dikkatsizlik belirtileri:",
                "items": [
                    "1. Ayrıntılara dikkat etmekte zorlanma, dikkatsizce hatalar yapma.",
                    "2. Görevlerde ya da oyunlarda dikkatini sürdürmekte güçlük çekme.",
                    "3. Doğrudan kendisiyle konuşulurken dinlemiyormuş gibi görünme.",
                    "4. Yönergeleri izlememek ve ödevleri/görevleri tamamlayamamak.",
                    "5. Görevleri ve etkinlikleri düzenlemekte (organize etmekte) güçlük çekme.",
                    "6. Sürekli zihinsel çaba gerektiren görevlerden kaçınma ya da isteksizlik.",
                    "7. Görevler için gerekli araç-gereçleri (kalem, kitap vb.) sık sık kaybetme.",
                    "8. Dikkatin dış uyaranlarla kolayca dağılması.",
                    "9. Günlük etkinliklerde unutkanlık."
                ]
            },
            {
                "code": "Kriter A2",
                "title": "Hiperaktivite ve Dürtüsellik (En az 6/9, yetişkinde en az 5/9)",
                "content": "En az 6 ay süren aşırı hareketlilik ve acelecilik:",
                "items": [
                    "1. Elleri ayakları kıpır kıpır etme ya da oturduğu yerde kıpırdanma.",
                    "2. Oturması beklenen durumlarda oturduğu yerden kalkma.",
                    "3. Uygunsuz ortamlarda koşuşturma ya da tırmanma.",
                    "4. Sakince oyun oynamakta güçlük çekme.",
                    "5. Sürekli hareket halinde olma ('motor takılmış gibi').",
                    "6. Aşırı konuşma.",
                    "7. Soru tamamlanmadan yanıtını yapıştırma.",
                    "8. Sırasını beklemekte güçlük çekme.",
                    "9. Başkalarının sözünü kesme ya da araya girme."
                ]
            },
            {
                "code": "Kriter B & C",
                "title": "Başlangıç Yaşı (< 12 yaş) ve Çoklu Ortam",
                "content": "Belirtiler 12 yaşından önce mevcuttur ve en az 2 farklı ortamda (ev, okul, iş) kendini gösterir."
            },
            {
                "code": "Belirleyiciler / Alt tipler",
                "title": "Görünüm Belirleyicileri (son 6 aya göre)",
                "content": "DEHB tek tanıdır; görünüm ayrı tanı değil, belirleyicidir ve zamanla değişebilir.",
                "items": [
                    "Bileşik görünüm (F90.2): son 6 ayda hem A1 (dikkatsizlik) hem A2 (aşırı hareketlilik-dürtüsellik) ölçütü karşılanır.",
                    "Dikkatsizliğin baskın olduğu görünüm (F90.0): A1 karşılanır, A2 karşılanmaz.",
                    "Aşırı hareketlilik/dürtüselliğin baskın olduğu görünüm (F90.1): A2 karşılanır, A1 karşılanmaz.",
                    "Ayrıca: kısmi yatışma; şu anki şiddet hafif, orta ya da ağır."
                ]
            }
        ]
    },
    "asd": {
        "id": "asd",
        "nameTr": "Otizm Açılımı Kapsamında Bozukluk",
        "nameEn": "Autism Spectrum Disorder",
        "clinicalDescription": {
            "overview": "Erken gelişim evresinde başlayan; toplumsal iletişim ve etkileşimde süregiden yetersizlikler ile sınırlı, yineleyici davranışlar, ilgi alanları ve duyusal hassasiyetlerle karakterize nörogelişimsel tablodur.",
            "epidemiology": "Yaygınlığı yaklaşık 1/54 çocuktur. Erkeklerde 4 kat daha sıktır.",
            "etiology": "Karmaşık çok genli genetik mimari (%80 kalıtılabilirlik) ve sinaptik budanma anomalileri.",
            "prognosis": "Erken Yoğun Davranışsal Müdahale (ABA) ve Özel Eğitim ile bağımsız yaşam becerileri kazandırılır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Toplumsal İletişim ve Etkileşimde Yetersizlik (Tümü bulunmalı)",
                "content": "1. Toplumsal-duygusal karşılıklılıkta yetersizlik (sohbet başlatamama/sürdürememe). 2. Sözel olmayan iletişimde yetersizlik (göz teması azlığı, mimik yoksunluğu). 3. İlişkileri geliştirme ve sürdürmede güçlük."
            },
            {
                "code": "Kriter B",
                "title": "Sınırlı ve Yineleyici Davranış Örüntüleri (En az 2/4)",
                "content": "1. Basmakalıp motor hareketler, nesneleri sıraya dizme ya da ekolali. 2. Aynılıkta ısrar etme, rutinlere katı bağlılık. 3. Aşırı kısıtlı ve yoğun ilgi alanları. 4. Duyusal uyaranlara aşırı ya da az duyarlılık (ses, doku hassasiyeti)."
            }
        ]
    },
    "odd": {
        "id": "odd",
        "nameTr": "Karşıt Olma Karşı Gelme Bozukluğu (KOKGB)",
        "nameEn": "Oppositional Defiant Disorder (ODD)",
        "clinicalDescription": {
            "overview": "Çocuklarda otorite figürlerine karşı en az 6 ay süren öfkeli/kolay kızan duygudurum, tartışmacı/meydan okuyan davranış ve kin besleme örüntüsüdür. Davranım Bozukluğundan farkı ŞİDDET, HIRSIZLIK ve AĞIR HAK İHLALLERİNİN OLMAMASIDIR.",
            "epidemiology": "Çocuklarda %3-5 civarındadır.",
            "etiology": "Mizaçsal zorluklar ve tutarsız-sert ebeveyn tutumları.",
            "prognosis": "Ebeveyn Yönetim Eğitimi (PMT) ile Davranım Bozukluğuna evrilmesi önlenir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Öfkeli ve Tartışmacı Tutum (En az 4/8 belirti, en az 6 ay)",
                "content": "Aşağıdakilerden en az dördüyle belirlenen davranış örüntüsü:",
                "items": [
                    "1. Sık sık öfkelenme / tepesi atma.",
                    "2. Sık sık alınganlık gösterme ya da kolayca içerleme.",
                    "3. Sık sık kızgın ve kırgın olma.",
                    "4. Yetke (otorite) sahipleriyle sık sık tartışmaya girme.",
                    "5. Otorite kurallarına uymaya karşı sık sık etkin olarak direnme ya da reddetme.",
                    "6. Başkalarını kasıtlı olarak kızdırma.",
                    "7. Kendi yanlışları ya da yaramazlıkları için başkalarını suçlama.",
                    "8. Son altı ayda en az iki kez kin besleme ya da intikamcı olma."
                ]
            }
        ]
    },
    "conduct_disorder": {
        "id": "conduct_disorder",
        "nameTr": "Davranım Bozukluğu",
        "nameEn": "Conduct Disorder",
        "clinicalDescription": {
            "overview": "18 yaşından küçük bireylerde başkalarının temel haklarının ya da yaşa uygun toplumsal kuralların çiğnendiği; insanlara/hayvanlara fiziksel saldırganlık, mala zarar verme (kundakçılık), hırsızlık ve ağır kural ihlalleriyle seyreden adli tablodur.",
            "epidemiology": "Ergenlerde %4 civarındadır. Erkeklerde belirgin olarak sıktır.",
            "etiology": "Kısıtlı prososyal duygular (empati yoksunluğu) ve çevresel risk faktörleri.",
            "prognosis": "Tedavi edilmezse 18 yaşından sonra Antisosyal Kişilik Bozukluğuna dönüşür."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Ağır Hak İhlalleri (Son 12 ayda en az 3 belirti)",
                "content": "1. İnsanlara ve hayvanlara saldırganlık (gözdağı verme, kavga başlatma, fiziksel acımasızlık, gasp). 2. Mala zarar verme (kasıtlı yangın çıkarma). 3. Dolandırıcılık ya da hırsızlık (ev/araba soyma). 4. Kuralları ağır biçimde çiğneme (gece evden kaçma, okuldan kaçma)."
            },
            {
                "code": "Belirleyici",
                "title": "Kısıtlı Prososyal Duygularla Birlikte",
                "content": "Pişmanlık/suçluluk duymama, eşduyum (empati) yoksunluğu, başarıyı umursamama ve yüzeysel duygulanım."
            },
            {
                "code": "Belirleyiciler / Alt tipler",
                "title": "Başlangıç Tipi ve Şiddet",
                "content": "Davranım bozukluğu tek tanıdır; başlangıç yaşı tip olarak belirtilir.",
                "items": [
                    "Çocuklukta başlayan tip (F91.1): 10 yaşından önce en az bir davranım bozukluğu ölçütüne özgü belirti vardır.",
                    "Ergenlikte başlayan tip (F91.2): 10 yaşından önce hiçbir belirti yoktur.",
                    "Başlangıcı belirtilmemiş (F91.9): başlangıç yaşını belirlemek için yeterli bilgi yoktur.",
                    "Şiddet: hafif, orta, ağır. \"Sınırlı prososyal duygularla\" belirleyicisi ayrıca eklenebilir."
                ]
            }
        ]
    },
    "tourette": {
        "id": "tourette",
        "nameTr": "Tourette Bozukluğu",
        "nameEn": "Tourette's Disorder",
        "clinicalDescription": {
            "overview": "Hastalık sırasında aynı anda olması gerekmese de hem ÇOK SAYIDA MOTOR TİK hem de EN AZ BİR VOKAL (sesil) TİKİN 1 yıldan uzun sürmesiyle karakterize nörogelişimsel tik bozukluğudur.",
            "epidemiology": "Çocuklarda %0.5 - 1 arasındadır. Erkeklerde 3-4 kat sıktır.",
            "etiology": "Bazal ganglionlar ve dopaminerjik regülasyon bozukluğu; yüksek kalıtılabilirlik.",
            "prognosis": "CBIT (Tikler için Kapsamlı Davranışsal Müdahale) ve alfa-2 agonistleri (Klonidin) veya antipsikotikler etkilidir."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B",
                "title": "Çoklu Motor ve Sesil Tikler",
                "content": "Hastalık sırasında hem çok sayıda motor tik hem de bir ya da birden fazla sesil (vokal) tik bulunmuştur (aynı anda ortaya çıkması gerekmez)."
            },
            {
                "code": "Kriter C & D",
                "title": "Süre (≥ 1 yıl) ve Başlangıç (< 18 yaş)",
                "content": "Tikler ilk başladığından bu yana 1 yıldan uzun sürmüştür ve başlangıç 18 yaşından öncedir."
            }
        ]
    },
    "kleptomania": {
        "id": "kleptomania",
        "nameTr": "Kleptomani (Çalma Hastalığı)",
        "nameEn": "Kleptomania",
        "clinicalDescription": {
            "overview": "Kişisel kullanım ya da parasal değeri için gereksinilmeyen nesneleri çalmaya yönelik dürtülere karşı koyamama, eylem öncesi artan gerginlik ve eylem anında yoğun haz/rahatlama yaşamadır.",
            "epidemiology": "Mağaza hırsızlarının yaklaşık %4-5'ini oluşturur. Kadınlarda 3 kat sıktır.",
            "etiology": "Dürtü denetim defisiti ve opioid/dopamin ödül sistemi disregülasyonu.",
            "prognosis": "BDT (Gizli duyarsızlaştırma) ve Naltrekson ile başarılı tedavi edilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B & C",
                "title": "Gereksinilmeyen Nesneleri Çalma ve Rahatlama",
                "content": "Parasal değeri için gereksinilmeyen nesneleri çalma dürtüsüne karşı koyamama + Hırsızlıktan hemen önce artan gerginlik + Çalma eylemi anında haz, doyum ya da rahatlama duyma."
            },
            {
                "code": "Kriter D & E",
                "title": "Öfke/İntikam Dışlaması",
                "content": "Çalma eylemi öfke göstermek ya da intikam almak amacıyla yapılmaz ve bir sanrıya bağlı değildir."
            }
        ]
    },
    "intermittent_explosive": {
        "id": "intermittent_explosive",
        "nameTr": "Aralıklı Patlayıcı Bozukluk",
        "nameEn": "Intermittent Explosive Disorder",
        "clinicalDescription": {
            "overview": "Saldırgan dürtüleri denetleyememeyle giden yineleyen davranışsal öfke patlamaları ve durumun yarattığı kışkırtmayla tamamen orantısız sözel/fiziksel saldırganlık tablosudur.",
            "epidemiology": "Yaşam boyu yaygınlığı %5-7 civarındadır. Erkeklerde ve gençlerde sıktır.",
            "etiology": "Serotoninerjik iletim defisiti ve amigdala aşırı reaktivitesi.",
            "prognosis": "BDT (Öfke yönetimi) ve duygudurum dengeleyiciler/SSRI ile saldırganlık azaltılır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Yineleyen Davranışsal Patlamalar",
                "content": "1. 3 ay boyunca haftada en az 2 kez fiziksel hasar vermeyen sözel/fiziksel agresyon VEYA 2. 12 ay içinde mala zarar veren ya da fiziksel yaralanmayla sonuçlanan 3 patlama."
            },
            {
                "code": "Kriter B & C",
                "title": "Orantısızlık ve Dürtüsellik",
                "content": "Saldırganlığın derecesi tetikleyici olayla tamamen orantısızdır; patlamalar planlı değildir, dürtüseldir ve maddi çıkar gütmez. Yaş ≥ 6."
            }
        ]
    },
    "pyromania": {
        "id": "pyromania",
        "nameTr": "Piromani (Yangın Çıkarma Hastalığı)",
        "nameEn": "Pyromania",
        "clinicalDescription": {
            "overview": "Maddi çıkar, intikam ya da ideolojik amaç gütmeksizin birden çok kez kasıtlı yangın çıkarma; eylem öncesi gerginlik ve yangını çıkarırken/izlerken yoğun haz, doyum ve rahatlama yaşamadır.",
            "epidemiology": "Çok nadir bir dürtü kontrol bozukluğudur. Erkeklerde belirgin olarak sıktır.",
            "etiology": "Yangına büyülenme ve dürtü denetim defisiti.",
            "prognosis": "BDT ve yangın güvenliği farkındalık eğitimi uygulanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B & C",
                "title": "Yangın Çıkarma, Gerginlik ve Haz",
                "content": "Birden çok kez kasıtlı yangın çıkarma + Eylem öncesi gerginlik/duygusal uyarılma + Yangına, ekipmanlara ve sonuçlarına karşı büyülenme/çekim + Yangını çıkarırken haz/rahatlama."
            },
            {
                "code": "Kriter D",
                "title": "Maddi/İntikam Dışlaması",
                "content": "Yangın çıkarma parasal kazanç, intikam ya da cezadan kaçma amacıyla yapılmaz."
            }
        ]
    },
    "gambling_disorder": {
        "id": "gambling_disorder",
        "nameTr": "Kumar Oynama Bozukluğu",
        "nameEn": "Gambling Disorder",
        "clinicalDescription": {
            "overview": "Kişinin yaşamında belirgin işlev kaybına yol açan; tolerans (artan miktarlarda parayla oynama), yoksunluk (bırakınca huzursuzluk) ve kayıpları kovalamayla seyreden davranışsal bağımlılıktır.",
            "epidemiology": "Yetişkinlerde %0.5 - 1 arasındadır. Erkeklerde daha sıktır.",
            "etiology": "Madde bağımlılıklarıyla tamamen aynı dopaminerjik ventral striatum ödül devresi anomalisi.",
            "prognosis": "Motivasyonel Görüşme, BDT (Adsız Kumarbazlar - GA) ve Naltrekson etkilidir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Kumar Bağımlılığı Ölçütleri (12 ayda en az 4/9)",
                "content": "Aşağıdakilerden en az dördüyle belirlenen sorunlu kumar davranışı:",
                "items": [
                    "1. İstenen coşkuyu elde etmek için giderek artan miktarlarda parayla kumar oynama gereksinimi (Tolerans).",
                    "2. Kumar oynamayı azaltma ya da bırakma girişimleri sırasında huzursuz olma ya da kolay kızma (Yoksunluk).",
                    "3. Kumar oynamayı denetim altına alma çabalarında yineleyen başarısızlıklar.",
                    "4. Sürekli kumar oynamakla zihinsel olarak meşgul olma.",
                    "5. Sıklıkla sıkıntılı hissederken (çaresiz, suçlu, kaygılı) kumar oynama.",
                    "6. Kumarda para kaybettikten sonra kaybettiklerini geri kazanmak için başka bir gün geri dönme (Kayıpları kovalama).",
                    "7. Kumar oynadığını gizlemek için yalan söyleme.",
                    "8. Kumar yüzünden önemli bir ilişkiyi, işi ya da kariyeri tehlikeye atma ya da kaybetme.",
                    "9. Kumar yüzünden düştüğü çaresiz parasal durumdan kurtulmak için başkalarından para sağlama."
                ]
            }
        ]
    },
    "alcohol_use_disorder": {
        "id": "alcohol_use_disorder",
        "nameTr": "Alkol Kullanım Bozukluğu",
        "nameEn": "Alcohol Use Disorder",
        "clinicalDescription": {
            "overview": "Kişinin belirgin sıkıntıya ve işlevsellik kaybına yol açacak şekilde kontrolsüzce alkol tüketmesi; tolerans, yoksunluk belirtileri (titreme, terleme), aşerme ve bırakma çabalarında başarısızlıkla karakterizedir.",
            "epidemiology": "Yaşam boyu yaygınlığı erkeklerde %20, kadınlarda %8-10 civarındadır.",
            "etiology": "GABAerjik ve glutamaterjik sistemlerde nöroadaptasyon, mezolimbik dopaminerjik ödül yolu aktivasyonu ve genetik yatkınlık.",
            "prognosis": "Detoksifikasyon protokolü + Akamprosat/Naltrekson/Disülfiram + BDT ve Adsız Alkolikler (AA)."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Alkol Kullanım Örüntüsü (12 ayda en az 2/11)",
                "content": "12 aylık bir dönem içinde aşağıdaki belirtilerden en az ikisinin bulunması:",
                "items": [
                    "1. Amaçlandığından daha büyük miktarlarda ya da daha uzun süreli alkol alma.",
                    "2. Alkol kullanımını bırakmak ya da denetim altına almak için sürekli bir istek ya da başarısız çabalar.",
                    "3. Alkol elde etmek, alkol kullanmak ya da etkilerinden kurtulmak için çok zaman harcama.",
                    "4. Alkol kullanmak için yoğun bir istek ya da aşerme (craving) duyma.",
                    "5. İşte, okulda ya da evdeki başlıca rol yükümlülüklerini yerine getirememe.",
                    "6. Alkolün yol açtığı toplumsal ya da kişilerarası sorunlara karşın kullanmayı sürdürme.",
                    "7. Alkol kullanımı yüzünden önemli etkinlikleri bırakma ya da azaltma.",
                    "8. Fiziksel olarak tehlikeli durumlarda yineleyici biçimde alkol kullanma (örn. araç sürme).",
                    "9. Alkolün neden olduğu fiziksel/psikolojik sorunun bilinmesine karşın kullanmayı sürdürme.",
                    "10. Belirgin tolerans gelişimi (aynı etki için belirgin artan miktarlar gerekmesi).",
                    "11. Yoksunluk belirtileri gösterme ya da yoksunluktan kaçınmak için alkol alma."
                ]
            },
            {
                "code": "Şiddet Belirleyicisi",
                "title": "DSM-5 Şiddet Düzeyleri",
                "content": "Hafif: 2-3 belirti, Orta: 4-5 belirti, Ağır: 6 ya da daha çok belirti."
            }
        ]
    },
    "frotteuristic": {
        "id": "frotteuristic",
        "nameTr": "Frotteuristik Bozukluk (Sürtünmecilik)",
        "nameEn": "Frotteuristic Disorder",
        "clinicalDescription": {
            "overview": "Frotteuristik Bozukluk, rızası olmayan bir kişiye fiziksel olarak dokunma veya sürtünme içeren yoğun, tekrarlayıcı cinsel fanteziler ve dürtülerle karakterize bir parafilik bozukluktur. Genellikle kalabalık toplu taşıma araçları veya dar geçitlerde gerçekleşir.",
            "epidemiology": "Neredeyse sadece erkeklerde görülür. Ergenlik döneminde başlar ve 15-25 yaş arasında zirve yapar; yaşla birlikte sıklığı azalır.",
            "etiology": "Sosyal beceri ve cinsel iletişim yetersizliği, onay almadan temas kurma hazzına şartlanma ve dürtü denetim mekanizmalarındaki yetersizlikler etkilidir.",
            "prognosis": "Adli riskler (hapis, cezai yaptırım) yüksektir. BDT ve nüks önleme programları ile dürtü kontrolü sağlanabilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Süre ve Dürtü Kriteri",
                "content": "En az 6 aylık bir süre boyunca, onay vermeyen bir kişiye dokunma ya da sürtünmeyle ilgili yineleyen, yoğun cinsel uyarılma fantezileri, dürtüleri ya da davranışları."
            },
            {
                "code": "Kriter B",
                "title": "Eyleme Dökme veya Klinik Sıkıntı",
                "content": "Kişi bu cinsel dürtüleri onay vermeyen bir kişiyle eyleme dökmüştür YA DA bu cinsel dürtüler/fanteziler klinik açıdan belirgin sıkıntıya veya işlevsellikte düşmeye yol açmaktadır."
            }
        ]
    },
    "voyeuristic": {
        "id": "voyeuristic",
        "nameTr": "Gözetlemecilik Bozukluğu (Voyörizm)",
        "nameEn": "Voyeuristic Disorder",
        "clinicalDescription": {
            "overview": "Habersiz bir kişinin çıplaklığını, soyunmasını veya cinsel etkinliğini gizlice gözetleme içeren yoğun cinsel dürtüler ve bu dürtülerin eyleme dökülmesidir. Uyarılma kurbanın habersiz olmasıyla doğrudan ilişkilidir.",
            "epidemiology": "Erkeklerde çok daha yaygındır; ergenlik döneminde başlama eğilimindedir.",
            "etiology": "Yasak olanı gizlice izleme hazzı, nesneleştirme ve risk alma heyecanıyla pekişen bir cinsel uyarılma örüntüsüdür.",
            "prognosis": "Kişi yakalanana kadar durumu inkar edebilir; adli süreçler ve BDT odaklı gizli şartlandırma ile remisyon sağlanabilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Süre ve Gözetleme Kriteri",
                "content": "En az 6 aylık bir süre boyunca, habersiz bir kişinin çıplaklığını, soyunmasını ya da cinsel etkinliğini gözetlemeyle ilgili yineleyen, yoğun cinsel uyarılma fantezileri veya dürtüleri."
            },
            {
                "code": "Kriter B",
                "title": "Yaş Sınırı ve Eyleme Dökme",
                "content": "Kişi en az 18 yaşındadır VE bu cinsel dürtüleri onay vermeyen bir kişi üzerinde eyleme dökmüştür ya da belirgin klinik sıkıntı yaşamaktadır."
            }
        ]
    },
    "exhibitionistic": {
        "id": "exhibitionistic",
        "nameTr": "Göstermecilik Bozukluğu (Ekzibisyonizm)",
        "nameEn": "Exhibitionistic Disorder",
        "clinicalDescription": {
            "overview": "Beklenmedik bir yabancıya cinsel organını aniden teşhir etme içeren yoğun cinsel dürtülerdir. Fail genellikle temas veya tecavüz amacı gütmez; temel doyum kurbanın şaşkınlık, korku veya dehşet tepkisinden kaynaklanır.",
            "epidemiology": "Hemen hemen tamamen erkeklerde görülür; adli vakalar arasında en sık rastlanan parafililerden biridir.",
            "etiology": "Yetersizlik duygularını kurbanın şok tepkisiyle telafi etme, gücü hissetme ve disinhibisyon etkilidir.",
            "prognosis": "Yaşla birlikte azalma eğilimindedir; empati geliştirme ve dürtü kontrol BDT'si ile olumlu yanıt alınır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Süre ve Teşhir Dürtüsü",
                "content": "En az 6 aylık bir süre boyunca, hazırlıksız bir kişiye cinsel organını göstermeyle ilgili yineleyen, yoğun cinsel uyarılma fantezileri, dürtüleri ya da davranışları."
            },
            {
                "code": "Kriter B",
                "title": "Eyleme Dökme / Sıkıntı",
                "content": "Kişi bu cinsel dürtüleri onay vermeyen bir kişiyle eyleme dökmüştür ya da klinik açıdan belirgin sıkıntı yaşamaktadır."
            }
        ]
    },
    "nightmare_disorder": {
        "id": "nightmare_disorder",
        "nameTr": "Kabus Bozukluğu (Nightmare Disorder)",
        "nameEn": "Nightmare Disorder",
        "clinicalDescription": {
            "overview": "Kişinin uykusundan canlı ve ayrıntılı olarak hatırlanan, genellikle hayatta kalma veya güvenliği tehdit eden dehşet verici rüyalarla uyanmasıdır. Uyanma anında bilinç hemen açılır ve tam oryantasyon mevcuttur.",
            "epidemiology": "Çocuklukta sık olmakla birlikte yetişkinlerin %2-8'inde klinik düzeyde kabus bozukluğu görülür.",
            "etiology": "REM uykusu regülasyon bozukluğu, yüksek sempatik uyarılma, travmatik yaşam olayları ve genetik yatkınlık rol oynar.",
            "prognosis": "İmgeleme Provası Terapisi (IRT) ile kabus sıklığı ve şiddeti çok hızlı geriler."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Tekrarlayan Korkutucu Rüyalar",
                "content": "Hayatta kalma, güvenlik ya da fiziksel bütünlüğe yönelik tehditleri içeren, ayrıntılı olarak iyi hatırlanan korkutucu rüyaların yineleyen biçimde görülmesi."
            },
            {
                "code": "Kriter B",
                "title": "Uyanma Anında Hızlı Oryantasyon",
                "content": "Korkutucu rüyadan uyandığında kişi hızla kendine gelir, uyanık ve tam olarak çevreye yönelmiş (oryante) durumdadır (konfüzyon yoktur)."
            },
            {
                "code": "Kriter C",
                "title": "İşlevsellik Kaybı",
                "content": "Uyku bozukluğu klinik açıdan belirgin sıkıntıya ya da toplumsal, işle ilgili alanlarda işlevsellikte düşmeye yol açar."
            }
        ]
    },
    "insomnia_disorder": {
        "id": "insomnia_disorder",
        "nameTr": "Uykusuzluk Bozukluğu (İnsomni)",
        "nameEn": "Insomnia Disorder",
        "clinicalDescription": {
            "overview": "Yeterli uyku fırsatı ve uygun çevre koşullarına rağmen uykuya dalma, uykuyu sürdürme veya sabah erken uyanma güçlüğü ile karakterize kronik uyku bozukluğudur.",
            "epidemiology": "Genel nüfusun yaklaşık %10-15'inde kronik insomni mevcuttur; kadınlarda ve yaşlılarda daha sıktır.",
            "etiology": "Spielman'ın 3P Modeli (Predisposing/Yatkınlaştırıcı, Precipitating/Tetikleyici, Perpetuating/Sürdürücü faktörler). Yatak-uyanıklık koşullanması ve felaketleştirici düşünceler sürdürücü ana motordur.",
            "prognosis": "CBT-I (Uykusuzluk için BDT) ile %80+ hastada kalıcı iyileşme sağlanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Temel Uyku Güçlüğü",
                "content": "Uyku miktarı ya da kalitesinden belirgin bir hoşnutsuzluk duyulması (uyku başlatma güçlüğü, uykuyu sürdürme güçlüğü veya erken uyanıp tekrar uyuyamama)."
            },
            {
                "code": "Kriter B",
                "title": "Gündüz İşlevsellik Bozulması",
                "content": "Uyku bozukluğu gündüz yorgunluk, dikkat dağınıklığı veya iş/sosyal alanda belirgin sıkıntıya yol açar."
            },
            {
                "code": "Kriter C & D",
                "title": "Sıklık ve Süre Eşiği",
                "content": "Uyku güçlüğü haftada en az 3 gece ortaya çıkar VE en az 3 aydır sürmektedir."
            },
            {
                "code": "Kriter E",
                "title": "Yeterli Fırsat Varlığı",
                "content": "Uyku güçlüğü yeterli uyuma fırsatı olmasına karşın gerçekleşir."
            }
        ]
    },
    "hypersomnolence": {
        "id": "hypersomnolence",
        "nameTr": "Aşırı Uykululuk Bozukluğu (Hipersomnolans)",
        "nameEn": "Hypersomnolence Disorder",
        "clinicalDescription": {
            "overview": "En az 7 saatlik ana uyku evresi geçirilmesine rağmen aşırı uyku ihtiyacı, dinlendirmeyen gündüz uykuları ve sabah uyanırken belirgin uyku sarhoşluğu (sleep inertia) tablosudur.",
            "epidemiology": "Genel popülasyonun yaklaşık %1'inde görülür; tipik olarak 17-24 yaşları arasında başlar.",
            "etiology": "Santral sinir sistemi uyanıklık mekanizmalarında hipofonksiyon ve sirkadiyen ritim regülasyon bozukluğu düşünülmektedir.",
            "prognosis": "Kronik seyirli olabilir; uyanıklık artırıcı ajanlar ve davranışsal uyku planlaması ile kontrol altına alınır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Aşırı Uykululuk Belirtileri",
                "content": "En az 7 saat süren bir ana uyku evresi olmasına karşın bildirilen aşırı uykululuk (aynı gün içinde yineleyen uyku dönemleri, 9 saatten uzun dinlendirmeyen uyku veya uyanmakta güçlük çekme)."
            },
            {
                "code": "Kriter B & C",
                "title": "Sıklık, Süre ve Sıkıntı",
                "content": "Hipersomnolans haftada en az 3 kez ortaya çıkar ve en az 3 aydır sürmektedir; belirgin klinik sıkıntıya yol açar."
            },
            {
                "code": "Kriter D",
                "title": "Narkolepsi ve Apne Dışlaması",
                "content": "Narkolepsi, obstrüktif uyku apnesi veya sirkadiyen ritim bozukluğu ile daha iyi açıklanamaz."
            }
        ]
    },
    "genito_pelvic_pain": {
        "id": "genito_pelvic_pain",
        "nameTr": "Genito-Pelvik Ağrı/Penetrasyon Bozukluğu (Vajinismus)",
        "nameEn": "Genito-Pelvic Pain/Penetration Disorder (Vaginismus)",
        "clinicalDescription": {
            "overview": "Vajinal birleşme, tampon kullanımı veya jinekolojik muayene sırasında pelvik taban kaslarının istemsiz kasılması, şiddetli ağrı korkusu ve penetrasyonun imkansız hale gelmesidir.",
            "epidemiology": "Kültürel faktörlere göre değişmekle birlikte kadınların %5-15'inde görülebilir; Türkiye'de en sık başvurulan cinsel işlev bozukluğudur.",
            "etiology": "Cinsellikle ilgili katı tabular, bekaret ve ilk geceye dair felaketleştirici korkular, olumsuz koşullanma ve pelvik kas spazmı.",
            "prognosis": "Bilişsel Davranışçı Cinsel Terapi ve dilatör egzersizleri ile başarı oranı %95'in üzerindedir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Temel Penetrasyon Güçlüğü (En az 1 belirti)",
                "content": "İlişki sırasında sürekli ya da yineleyici biçimde aşağıdakilerden birinin (ya da daha fazlasının) olması: 1. Vajinal penetrasyonda belirgin güçlük. 2. Penetrasyon sırasında belirgin vulvovajinal ağrı. 3. Ağrıya dair belirgin korku/kaygı. 4. Penetrasyon denemelerinde pelvik taban kaslarında belirgin gerilme/kasılma."
            },
            {
                "code": "Kriter B & C",
                "title": "Süre ve Sıkıntı",
                "content": "Belirtiler en az 6 aydır sürmektedir ve belirgin kişisel/ilişkisel sıkıntıya yol açar."
            }
        ]
    },
    "premature_ejaculation": {
        "id": "premature_ejaculation",
        "nameTr": "Erken Boşalma (Prematür Ejakülasyon)",
        "nameEn": "Premature (Early) Ejaculation",
        "clinicalDescription": {
            "overview": "Partnerle cinsel ilişki sırasında vajinal penetrasyondan sonraki yaklaşık 1 dakika içinde ve kişinin arzusundan önce sürekli ya da tekrarlayan biçimde boşalma olması tablosudur.",
            "epidemiology": "Erkekler arasında en sık görülen cinsel işlev bozukluğudur (%20-30).",
            "etiology": "Sempatik uyarılma eşiğinin düşüklüğü, performans kaygısı, hızlı mastürbasyon şartlanması ve serotoninerjik reseptör duyarlılıkları.",
            "prognosis": "Dur-Başlat ve Sıkma tekniklerini içeren cinsel terapi ile çok yüksek oranda kontrol sağlanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "1 Dakika Kuralı ve Kontrolsüzlük",
                "content": "Partnerle cinsel etkinlik sırasında, vajinal penetrasyonun ardından yaklaşık 1 dakika içinde ve bireyin arzusundan önce sürekli ya da yineleyici biçimde boşalma olması."
            },
            {
                "code": "Kriter B & C",
                "title": "Süre ve Yaygınlık",
                "content": "Belirti en az 6 aydır sürmekte ve cinsel etkinliğin neredeyse tamamında (%75-100) ortaya çıkmaktadır."
            }
        ]
    },
    "erectile_disorder": {
        "id": "erectile_disorder",
        "nameTr": "Sertleşme Bozukluğu (Erektil Bozukluk)",
        "nameEn": "Erectile Disorder",
        "clinicalDescription": {
            "overview": "Cinsel etkinlik sırasında sertliği elde etmede, sürdürmede veya sertliğin derecesinde belirgin azalma olmasıdır. Sabah ereksiyonlarının korunmuş olması psikojenik kökeni destekler.",
            "epidemiology": "40 yaş üzerinde sıklığı artar; genç erişkinlerde çoğunlukla performans anksiyetesine bağlıdır.",
            "etiology": "Performans kaygısı ('seyirci kalma' etkisi), ilişki çatışmaları, depresyon veya vasküler/diyabetik organik nedenler.",
            "prognosis": "Duyusal Odaklanma (Sensate Focus) terapisi ve gerekirse medikal destekle mükemmel düzelme gösterir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Temel Sertleşme Belirtileri (En az 1)",
                "content": "Cinsel etkinliklerin neredeyse tamamında (%75-100): 1. Sertliği sağlamada belirgin güçlük. 2. Cinsel etkinlik tamamlanana dek sertliği sürdürmede güçlük. 3. Sertliğin sertlik derecesinde belirgin azalma."
            },
            {
                "code": "Kriter B",
                "title": "Süre Kriteri",
                "content": "Belirtiler en az 6 aydır sürmektedir ve belirgin klinik sıkıntıya yol açar."
            }
        ]
    },
    "delirium": {
        "id": "delirium",
        "nameTr": "Deliryum (Akut Bilinç Bulanıklığı)",
        "nameEn": "Delirium",
        "clinicalDescription": {
            "overview": "Kısa bir süre içinde (saatler/günler) gelişen, dikkat ve farkındalıkta bozulma, bilişte ek gerilemeler ve gün içinde dalgalı seyir gösteren akut nöropsikiyatrik tablodur.",
            "epidemiology": "Hastanede yatan yaşlıların %15-30'unda, yoğun bakım hastalarının %70-80'inde görülür.",
            "etiology": "Enfeksiyonlar (özellikle İYE), elektrolit dengesizlikleri, ilaç toksisitesi, hipoksi veya kafa travması gibi altta yatan organik tıbbi durumlar.",
            "prognosis": "Altta yatan tıbbi neden hızla tedavi edilirse tamamen geri dönüşümlüdür; gecikilirse mortalite riski yüksektir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Dikkat ve Farkındalıkta Bozulma",
                "content": "Dikkati odaklama, sürdürme ve kaydırma yetisinde azalma ile birlikte çevreye ilişkin farkındalıkta azalma."
            },
            {
                "code": "Kriter B",
                "title": "Hızlı Başlangıç ve Dalgalı Seyir",
                "content": "Bozukluk kısa bir süre içinde (saatler ya da birkaç gün) gelişir, önceki işlevsellikten bir değişimi temsil eder ve gün içinde şiddetinde dalgalanma gösterir."
            },
            {
                "code": "Kriter C",
                "title": "Ek Bilişsel Bozulma",
                "content": "Bilişte ek bir bozulma (bellek kusuru, yönelim bozukluğu, dil, görsel-uzamsal yeti veya görsel halüsinasyon gibi algı bozukluğu)."
            },
            {
                "code": "Kriter D & E",
                "title": "Fizyolojik Etiyoloji Kanıtı",
                "content": "Öykü, muayene veya laboratuvardan bozukluğun genel bir sağlık durumunun doğrudan fizyolojik bir sonucu olduğuna dair kanıt bulunması."
            }
        ]
    },
    "major_neurocognitive_alzheimer": {
        "id": "major_neurocognitive_alzheimer",
        "nameTr": "Majör Nörobilişsel Bozukluk (Alzheimer Tipi Demans)",
        "nameEn": "Major Neurocognitive Disorder (Alzheimer's Disease)",
        "clinicalDescription": {
            "overview": "Özellikle öğrenme ve bellek alanında sinsi başlayan ve tedrici ilerleyen bilişsel gerileme ile günlük yaşam aktivitelerinde tam bağımsızlığın kaybedilmesidir.",
            "epidemiology": "65 yaş üstünde %5-10, 85 yaş üstünde %30-40 civarındadır. Demans vakalarının %60-70'ini oluşturur.",
            "etiology": "Amiloid-beta plakları ve nörofibriler yumaklar, kolinerjik nöron kaybı, hipokampal atrofi ve genetik mutasyonlar (APOE e4, APP, PSEN1).",
            "prognosis": "İlerleyici ve geri dönüşsüzdür; kolinesteraz inhibitörleri ve bilişsel uyarım ile semptom ilerlemesi yavaşlatılır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Bilişsel Alanda Belirgin Gerileme",
                "content": "Bir ya da daha fazla bilişsel alanda (öğrenme ve bellek, dil, yönetsel işlev, karmaşık dikkat) önceki işlevsellik düzeyine göre belirgin bilişsel gerileme kanıtı."
            },
            {
                "code": "Kriter B",
                "title": "Günlük Yaşam Bağımsızlığının Kaybı",
                "content": "Bilişsel eksiklikler günlük yaşam aktivitelerinde (faturaları ödeme, ilaç yönetimi, yemek yapma) bağımsızlığı engeller (başkasına bağımlılık gerektirir)."
            },
            {
                "code": "Kriter C & D",
                "title": "Sinsi Başlangıç ve Deliryum Dışlaması",
                "content": "Sinsi bir başlangıç ve tedrici bir ilerleme gösterir; yalnızca deliryum gidişi sırasında ortaya çıkmaz."
            }
        ]
    },
    "prolonged_grief_disorder": {
        "id": "prolonged_grief_disorder",
        "nameTr": "Uzatılmış Yas Bozukluğu (Prolonged Grief Disorder)",
        "nameEn": "Prolonged Grief Disorder",
        "clinicalDescription": {
            "overview": "Sevilen birinin ölümünden sonra yetişkinlerde en az 12 ay boyunca ölene karşı dinmeyen yoğun özlem, derin duygusal acı, kimlik kaybı hissi ve hayata devam edememe tablosudur.",
            "epidemiology": "Kayıp yaşayan bireylerin yaklaşık %10'unda uzatılmış yas tablosu gelişir.",
            "etiology": "Travmatik kayıp deneyimleri, kayıpla ilgili suçluluk ve öfke kilitlenmeleri, güvenli bağlanma figürünün ani kaybı.",
            "prognosis": "Uzatılmış Yas Terapisi (PGT) ile travmatik blokaj çözülerek normal yas sürecine geçiş sağlanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Kayıp ve Süre Eşiği",
                "content": "Kişiyle yakın bir ilişkisi olan birinin ölümü üzerinden yetişkinlerde en az 12 ay (çocuk ve ergenlerde en az 6 ay) geçmiş olması."
            },
            {
                "code": "Kriter B",
                "title": "Sürekli Özlem ve Zihinsel Meşguliyet",
                "content": "Ölen kişiye karşı yoğun bir özlem/hasret duyulması veya günün büyük bölümünde ölen kişiyle ilgili anılarla aşırı zihinsel uğraş."
            },
            {
                "code": "Kriter C",
                "title": "Duygusal ve Kimlik Belirtileri (En az 3)",
                "content": "1. Kimlik karmaşası (kendinin bir parçasının öldüğünü hissetme). 2. Ölümü kabullenmede belirgin güçlük. 3. Kaybı hatırlatan şeylerden kaçınma. 4. Yoğun duygusal acı (öfke, acılık). 5. Yaşama devam etmekte zorlanma. 6. Duygusal hissizlik. 7. Hayatın anlamsız olduğu hissi. 8. Yoğun yalnızlık."
            }
        ]
    },
    "narcolepsy": {
        "id": "narcolepsy",
        "nameTr": "Narkolepsi",
        "nameEn": "Narcolepsy",
        "clinicalDescription": {
            "overview": "Gündüz önüne geçilemez ani uyku atakları, gülmeyle tetiklenen ani kas felci (katapleksi), hipnagojik halüsinasyonlar ve uyku felci ile seyreden kronik nörolojik uyku bozukluğudur.",
            "epidemiology": "Toplumda 2000 kişide 1 görülür. Başlangıç genellikle ergenlik veya genç erişkinliktedir.",
            "etiology": "Hipotalamustaki hipokretin/oreksin üreten nöronların otoimmün yıkımı (HLA-DQB1*06:02 ilişkili).",
            "prognosis": "Kroniktir; Modafinil, sodyum oksibat ve davranışsal uyku planlaması ile kontrol altına alınır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Karşı Konulamaz Uyku Atakları",
                "content": "Günün uygunsuz zamanlarında en az 3 aydır haftada en az 3 kez ortaya çıkan uyku atakları."
            },
            {
                "code": "Kriter B",
                "title": "Katapleksi veya BOS Hipokretin Eksikliği",
                "content": "Duygusal tetiklenmeli kısa süreli kas tonusu kaybı veya BOS hipokretin-1 < 110 pg/mL olması."
            },
            {
                "code": "Belirleyiciler / Alt tipler",
                "title": "Doğrulayıcı Bulgu ve Alt Tipler",
                "content": "Narkolepsi tek tanıdır. Katapleksi yoksa B ölçütü için BOS hipokretin-1 eksikliği (≤ 110 pg/mL ya da sağlıklı değerlerin üçte biri) veya polisomnografide REM latansı ≤ 15 dakika ya da MSLT'de ortalama uyku latansı ≤ 8 dakika ve en az 2 SOREMP gerekir.",
                "items": [
                    "Katapleksili ya da hipokretin eksikliğiyle (tip 1) — G47.411.",
                    "Katapleksisiz ve hipokretin eksikliği olmadan ya da ölçülmeden (tip 2) — G47.419.",
                    "Diğer alt tipler: otozomal dominant serebellar ataksi, sağırlık ve narkolepsiyle; otozomal dominant narkolepsi, obezite ve tip 2 diyabetle; başka bir sağlık durumuna ikincil narkolepsi.",
                    "Şiddet: hafif, orta, ağır."
                ]
            }
        ]
    },
    "rem_sleep_behavior_disorder": {
        "id": "rem_sleep_behavior_disorder",
        "nameTr": "REM Uykusu Davranış Bozukluğu (RBD)",
        "nameEn": "REM Sleep Behavior Disorder",
        "clinicalDescription": {
            "overview": "REM uykusundaki fizyolojik kas felcinin (atoni) kaybolması sonucu rüyaları fiziksel olarak yaşama, yumruk atma, tekmeleme ve yataktan fırlama tablosudur.",
            "epidemiology": "Genellikle 50 yaş üzeri erkeklerde görülür; Parkinson ve Lewy Cisimcikli Demansın en güçlü erken belirtecidir.",
            "etiology": "Beyin sapında sublaterodorsal çekirdek ve magnoselüler retiküler formasyon disfonksiyonu (alfa-sinükleinopati).",
            "prognosis": "Yatak odası güvenliği ve düşük doz Klonazepam/Melatonin ile rüya canlandırma kontrol edilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Rüya Eyleme Dökme",
                "content": "REM uykusu sırasında konuşma, vurma, dövüşme gibi karmaşık motor davranışlar."
            },
            {
                "code": "Kriter B",
                "title": "Polisomnografide REM Atonisinin Yokluğu",
                "content": "PSG kaydında REM uykusunda elektromiyografik kas tonusunun korunmuş olması."
            }
        ]
    },
    "arfid": {
        "id": "arfid",
        "nameTr": "Kaçıngan/Kısıtlı Yiyecek Alımı Bozukluğu (ARFID)",
        "nameEn": "Avoidant/Restrictive Food Intake Disorder",
        "clinicalDescription": {
            "overview": "Beden algısı bozukluğu olmaksızın, yiyeceğin duyusal özelliklerine (koku, doku, renk) veya boğulma/kusma korkusuna bağlı olarak gelişen yetersiz beslenme tablosudur.",
            "epidemiology": "Çocukluk ve ergenlikte sıktır; Otizm ve DEHB ile sık komorbidite gösterir.",
            "etiology": "Duyusal işlemleme hassasiyeti ve geçmiş boğulma/öğürme travmaları.",
            "prognosis": "Kademeli gıda maruziyeti ve CBT-AR ile yeni besin kabulü artırılır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Kalıcı Yiyecek Kısıtlaması",
                "content": "Besin ihtiyacını karşılayamama, belirgin kilo kaybı ve besin takviyelerine bağımlılık."
            },
            {
                "code": "Kriter B",
                "title": "Beden İmajı Bozukluğu Yokluğu",
                "content": "Kilo alma korkusu veya beden ağırlığını yanlış algılama kanıtı bulunmaması."
            }
        ]
    },
    "major_neurocognitive_frontotemporal": {
        "id": "major_neurocognitive_frontotemporal",
        "nameTr": "Majör Nörobilişsel Bozukluk (Frontotemporal / Pick Hastalığı)",
        "nameEn": "Major Frontotemporal Neurocognitive Disorder",
        "clinicalDescription": {
            "overview": "Erken yaşta başlayan, belirgin sosyal disinhibisyon, empati kaybı, hiperoralite ve kişilik değişimiyle karakterize nörodejeneratif demans tablosudur.",
            "epidemiology": "65 yaş altındaki en sık ikinci demans türüdür. Başlangıç genellikle 50-60 yaş arasıdır.",
            "etiology": "Frontal ve temporal loblarda Tau proteini (Pick cisimcikleri) veya TDP-43 birikimi.",
            "prognosis": "İlerleyicidir; semptomatik davranış yönetimi ve bakıcı desteği temeldir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Davranışsal Disinhibisyon ve Apati",
                "content": "Erken dönemde sosyal kuralları çiğneme, uygunsuz davranışlar ve empati kaybı."
            },
            {
                "code": "Kriter B",
                "title": "Hiperoralite ve Yürütücü İşlev Kaybı",
                "content": "Aşırı tatlı yeme, stereotipik hareketler ve frontal/temporal beyin atrofisi."
            }
        ]
    },
    "hallucinogen_persisting_perception": {
        "id": "hallucinogen_persisting_perception",
        "nameTr": "Hallusinojen Kalıcı Algı Bozukluğu (HPPD)",
        "nameEn": "Hallucinogen Persisting Perception Disorder",
        "clinicalDescription": {
            "overview": "Hallusinojen (LSD vb.) kullanımından aylar/yıllar sonra bile görsel karlanma, ışık izleri ve geometrik halüsinasyonların kişinin içgörüsü tamken sürmesidir.",
            "epidemiology": "LSD ve sentetik hallusinojen kullanıcılarında ortaya çıkabilir.",
            "etiology": "Görsel korteksteki inhibitör GABAerjik internöronların işlev kaybı ve talamokortikal disritmi.",
            "prognosis": "Lamotrijin, Klonazepam ve anksiyete yönetimi ile semptomlar hafifletilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Görsel Flashback Belirtileri",
                "content": "Geometrik halüsinasyonlar, görsel kar (visual snow), nesnelerin arkasında iz kalması (trailing)."
            },
            {
                "code": "Kriter B",
                "title": "İçgörünün Korunmuş Olması",
                "content": "Görsel algıların gerçek olmadığının bilinmesi ve belirgin sıkıntıya yol açması."
            }
        ]
    },
    "childhood_fluency_disorder": {
        "id": "childhood_fluency_disorder",
        "nameTr": "Çocuklukta Başlayan Akıcılık Bozukluğu (Kekemelik)",
        "nameEn": "Childhood-Onset Fluency Disorder (Stuttering)",
        "clinicalDescription": {
            "overview": "Konuşmanın akıcılığında ve zamanlama düzeninde ses/hece yinelemeleri, uzatmalar ve bloklarla karakterize gelişimsel nöromotor bozukluktur.",
            "epidemiology": "Çocukların yaklaşık %5'inde görülür; %80'i ergenliğe kadar kendiliğinden veya terapiyle düzelir. Erkeklerde 3-4 kat sıktır.",
            "etiology": "Sol hemisfer konuşma motor devrelerinde işlevsel asimetri ve genetik yatkınlık.",
            "prognosis": "Erken dönem konuşma terapisi (Lidcombe Programı) ile başarı oranı çok yüksektir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Akıcılık Bozulması",
                "content": "Sık ses/hece yinelemeleri, ses uzatmaları, kırık sözcükler ve konuşma blokları."
            },
            {
                "code": "Kriter B",
                "title": "İletişim ve Okul Başarısını Engelleme",
                "content": "Konuşma güçlüğünün toplumsal katılımı ve okul başarısını sınırlandırması."
            }
        ]
    },
    "specific_learning_disorder": {
        "id": "specific_learning_disorder",
        "nameTr": "Özgül Öğrenme Bozukluğu",
        "nameEn": "Specific Learning Disorder",
        "clinicalDescription": {
            "overview": "Zihinsel yetiyitimi, duyusal sorun ya da yetersiz eğitimle açıklanamayan, okul çağında başlayan ve temel akademik becerilerin (sözcük okuma, okuduğunu anlama, yazım, yazılı anlatım, sayı duyusu, hesaplama, matematiksel akıl yürütme) öğrenilip kullanılmasında süregen güçlükle giden nörogelişimsel bozukluktur. Tek tanıdır; etkilenen alan (okuma, yazılı anlatım, matematik) ve alt beceriler belirleyici olarak eklenir. \"Disleksi\" okumada, \"diskalkuli\" matematikte bozulmanın alternatif adlarıdır.",
            "epidemiology": "Okul çağı çocuklarında tüm alanlar için yaygınlık farklı dil ve kültürlerde yaklaşık %5-15'tir; erişkinlerde yaklaşık %4. En sık okumada bozulma görülür; alanların birlikteliği ve DEHB eşlik etmesi sıktır. Erkeklerde daha sık tanı konur.",
            "etiology": "Güçlü genetik yatkınlık; okumada sol temporoparyetal fonolojik işlemleme ağlarındaki, matematikte paryetal (intraparyetal oluk) sayısal büyüklük ağlarındaki farklılıklar; çalışma belleği, işlemleme hızı ve yürütücü işlev zayıflıkları. Prematürite ve doğum öncesi maruziyetler risk etkenleridir.",
            "prognosis": "Erken, açık ve sistematik, çok duyulu ve alana özgü eğitim (ör. fonolojik farkındalık ve harf-ses eğitimi, somuttan soyuta matematik öğretimi) ve sınav düzenlemeleri işlevselliği belirgin artırır. Güçlükler yaşam boyu sürebilir; ikincil kaygı ve özgüven sorunları izlenmelidir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Akademik Becerilerde Süregen Güçlük (En az 6 ay, müdahaleye rağmen)",
                "content": "Bu güçlükleri hedefleyen müdahalelere karşın en az 6 aydır süren, aşağıdakilerden en az birinin bulunduğu öğrenme ve akademik beceri kullanma güçlüğü:",
                "items": [
                    "1. Yanlış ya da yavaş ve zahmetli sözcük okuma.",
                    "2. Okuduğunun anlamını kavramada güçlük.",
                    "3. Yazımda (heceleme/imla) güçlük.",
                    "4. Yazılı anlatımda güçlük (dilbilgisi ve noktalama hataları, paragraf düzenlemede yetersizlik, düşünceleri yazıda açıkça ifade edememe).",
                    "5. Sayı duyusu, aritmetik bilgiler ya da hesaplamada ustalaşmada güçlük.",
                    "6. Matematiksel akıl yürütmede güçlük."
                ]
            },
            {
                "code": "Kriter B, C & D",
                "title": "Ölçülebilir Düşüklük, Okul Çağında Başlangıç ve Dışlama",
                "content": "Etkilenen beceriler yaşa göre beklenenin belirgin ve ölçülebilir biçimde altındadır ve okul, iş ya da günlük yaşamı belirgin biçimde etkiler; bireysel standart başarı testleri ve kapsamlı klinik değerlendirmeyle doğrulanır (B). Güçlükler okul çağında başlar, ancak talepler kapasiteyi aşana dek tam ortaya çıkmayabilir (C). Zihinsel yetiyitimi, düzeltilmemiş görme/işitme sorunları, başka ruhsal ya da nörolojik bozukluklar, psikososyal güçlükler, öğretim dilinde yetersizlik ya da yetersiz eğitimle daha iyi açıklanamaz (D)."
            },
            {
                "code": "Belirleyiciler / Alt tipler",
                "title": "Etkilenen Alanlar ve Şiddet",
                "content": "Etkilenen tüm alan ve alt beceriler ayrı ayrı belirtilir:",
                "items": [
                    "Okumada bozulma ile (F81.0): sözcük okuma doğruluğu, okuma hızı ya da akıcılığı, okuduğunu anlama. Disleksi bu örüntünün alternatif adıdır.",
                    "Yazılı anlatımda bozulma ile (F81.81): yazım doğruluğu, dilbilgisi ve noktalama doğruluğu, yazılı anlatımın açıklığı ya da düzenlenmesi. Salt el yazısının motor olarak kötü olması bu belirleyicinin özü değildir (gelişimsel eşgüdüm bozukluğu açısından değerlendirilir).",
                    "Matematikte bozulma ile (F81.2): sayı duyusu, aritmetik bilgilerin belleğe alınması, doğru ya da akıcı hesaplama, matematiksel akıl yürütme. Diskalkuli bu örüntünün alternatif adıdır.",
                    "Şiddet: hafif, orta, ağır."
                ]
            }
        ]
    },
    "developmental_coordination_disorder": {
        "id": "developmental_coordination_disorder",
        "nameTr": "Gelişimsel Eşgüdüm (Koordinasyon) Bozukluğu (Dispraksi)",
        "nameEn": "Developmental Coordination Disorder",
        "clinicalDescription": {
            "overview": "Motor becerilerin edinilmesinde ve koordinasyonunda kronolojik yaşa göre belirgin yetersizlik (sakarlık, denge bozukluğu, alet kullanma güçlüğü) tablosudur.",
            "epidemiology": "Okul çağı çocuklarının %5-6'sında görülür; erkeklerde daha yaygındır.",
            "etiology": "Serebellar-paryetal motor planlama ve duyu-motor entegrasyon defisitleri.",
            "prognosis": "Ergoterapi ve CO-OP (Bilişsel Yönelimli Mesleki Terapi) ile motor beceriler geliştirilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Motor Becerilerde Gecikme",
                "content": "Sakar hareketler, nesneleri düşürme, makas/bağcık kullanmada belirgin beceriksizlik."
            },
            {
                "code": "Kriter B",
                "title": "Organik Nörolojik Hastalık Yokluğu",
                "content": "Serebral palsi veya kas distrofisi gibi bir tıbbi durumun bulunmaması."
            }
        ]
    },
    "sexual_masochism": {
        "id": "sexual_masochism",
        "nameTr": "Cinsel Mazoşizm Bozukluğu (Asfiksi Tipi Dahil)",
        "nameEn": "Sexual Masochism Disorder",
        "clinicalDescription": {
            "overview": "Aşağılanma, bağlanma, dövülme veya oksijensiz bırakılma (asfiksi) eylemleriyle yoğun cinsel uyarılma duyma ve bunu eyleme dökme tablosudur.",
            "epidemiology": "Erkeklerde daha sıktır; otoerotik asfiksi formu yüksek ölüm riski taşır.",
            "etiology": "Erken çocukluk şartlanmaları, acı ile haz merkezleri arasındaki dopaminerjik çapraz bağlantılar.",
            "prognosis": "BDT, dürtü yönetimi ve yüksek riskli ölümcül ritüellerin engellenmesi esastır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Acı ve Aşağılanma Dürtüleri",
                "content": "En az 6 ay süreyle bağlanma, dövülme veya acı çekmeyle ilgili cinsel uyarılma fantezileri."
            },
            {
                "code": "Kriter B",
                "title": "Eyleme Dökme veya Belirgin Sıkıntı",
                "content": "Dürtülerin eyleme dökülmesi (özellikle asfiksiyofili) veya klinik sıkıntı yaratması."
            }
        ]
    },
    "sexual_sadism": {
        "id": "sexual_sadism",
        "nameTr": "Cinsel Sadizm Bozukluğu",
        "nameEn": "Sexual Sadism Disorder",
        "clinicalDescription": {
            "overview": "Başka bir insanın fiziksel veya psikolojik acı çekmesinden, korku ve çığlıklarından yoğun cinsel haz alma ve bu dürtüleri rızasız kişiler üzerinde eyleme dökme tablosudur.",
            "epidemiology": "Adli psikiyatride ağır suç faillerinde görülür; erkeklerde belirgin derecede sıktır.",
            "etiology": "Empati yoksunluğu, güç/kontrol arzusu ve sadistik cinsel koşullanma.",
            "prognosis": "Zorlu adli tedavi gerektirir; BDT, antiandrojenler ve yüksek güvenlikli takip uygulanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Başkasına Acı Çektirme Dürtüleri",
                "content": "En az 6 ay boyunca bir başkasına acı çektirmekten cinsel haz alma fantezileri."
            },
            {
                "code": "Kriter B",
                "title": "Rızasız Kişiler Üzerinde Eyleme Dökme",
                "content": "Bu dürtülerin onay vermeyen kişiler üzerinde fiziksel yaralamayla eyleme dökülmesi."
            }
        ]
    },
    "catatonia_associated": {
        "id": "catatonia_associated",
        "nameTr": "Başka Bir Ruhsal Bozuklukla İlişkili Katatoni",
        "nameEn": "Catatonia Associated with Another Mental Disorder",
        "clinicalDescription": {
            "overview": "Psikomotor aktivitede aşırı ketlenme (stupor, mutizm, katalepsi, balmumu esnekliği, negativizm) ya da amaçsız aşırı uyarılma ve ekofenomenlerle (ekolali, ekopraksi) karakterize akut nöropsikiyatrik sendromdur.",
            "epidemiology": "Yatan psikiyatri hastalarının %5-10'unda görülür; en sık Bipolar Bozukluk ve Majör Depresyonda, ikinci sıklıkta Şizofrenide ortaya çıkar.",
            "etiology": "Fronto-striato-talamik motor devrelerde ağır GABA-A reseptör hipofonksiyonu ve glutamat hiperaktivitesi.",
            "prognosis": "IV Lorazepam (Benzodiazepin) testi ve Elektrokonvülsif Terapi (EKT) ile %85-90 oranında dramatik ve hayat kurtarıcı düzelme sağlanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Psikomotor Katatoni Bulguları (En az 3/12 belirti)",
                "content": "Stupor, katalepsi, balmumu esnekliği (cerea flexibilitas), mutizm, negativizm, postür alma, manyerizm, stereotipi, ajitasyon, grimas, ekolali veya ekopraksi belirtilerinden en az 3'ünün varlığı."
            },
            {
                "code": "Kriter B",
                "title": "Klinik Önem ve Komplikasyon Riski",
                "content": "Dehidratasyon, malnütrisyon, pulmoner emboli veya otonomik instabilite (malign katatoni) riski nedeniyle acil müdahale gerektirir."
            }
        ]
    },
    "reactive_attachment_disorder": {
        "id": "reactive_attachment_disorder",
        "nameTr": "Tepkisel Bağlanma Bozukluğu (RAD)",
        "nameEn": "Reactive Attachment Disorder",
        "clinicalDescription": {
            "overview": "Yaşamın ilk yıllarında ağır duygusal ihmal veya sık değişen kurum bakımı yaşayan çocuklarda gelişen; yetişkin bakımverenlere karşı içe kapanık, duygusal olarak ketlenmiş davranma ve canı yandığında/korktuğunda bile kimseden teselli (avutulma) aramama tablosudur.",
            "epidemiology": "Ağır ihmal görmüş ve kurum bakımındaki çocukların bile %10'undan azında görülür.",
            "etiology": "Yaşamın ilk 2 yılında temel güven ve bağlanma figürünün yokluğu (patojenik bakım).",
            "prognosis": "Duyarlı, sıcak ve kalıcı bir koruyucu aile/bakım çevresi sağlandığında çocukta güvenli bağlanma hızla yeniden inşa edilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Ketlenmiş Bağlanma ve Avutulma Aramama",
                "content": "Sıkıntılı olduğunda nadiren avutulma arayışında olma ve avutulmaya tepki vermeme; olumlu duygulanım azlığı ve korku/üzüntü nöbetleri."
            },
            {
                "code": "Kriter B",
                "title": "Ağır İhmal Öyküsü ve OSB Dışlaması",
                "content": "Temel duygusal gereksinimlerin sürekli karşılanmadığı ağır ihmal öyküsü vardır; Otizm Spektrum Bozukluğu ölçütleri karşılanmaz (5 yaş öncesi başlar)."
            }
        ]
    },
    "disinhibited_social_engagement": {
        "id": "disinhibited_social_engagement",
        "nameTr": "Sınırsız Toplumsal Katılım Bozukluğu (DSED)",
        "nameEn": "Disinhibited Social Engagement Disorder",
        "clinicalDescription": {
            "overview": "Erken çocukluk dönemindeki ağır ihmal ve bakım eksikliği sonucunda gelişen; çocuğun hiç yabancılık çekmeden ilk kez gördüğü yabancı yetişkinlerin kucağına oturması, sarılması ve bakımverenine bakmadan yabancılarla çekip gitmeye hazır olması tablosudur.",
            "epidemiology": "Kurum bakımında büyüyen çocukların yaklaşık %20'sinde görülür.",
            "etiology": "İlk 2 yıldaki sosyal ihmal ve sık bakıcı değişiminin amigdala tabanlı yabancı korkusu (stranger anxiety) gelişimini bozması.",
            "prognosis": "Kalıcı aile bakımı, sosyal sınır eğitimi ve ebeveyn rehberliği ile yabancılarla güvenli mesafe kuralları öğretilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Yabancılara Sınırsız Yaklaşma",
                "content": "Yabancı yetişkinlere yaklaşmada çekingenlik olmaması, aşırı teklifsiz sözel/fiziksel yakınlık ve yabancıyla tereddütsüz çekip gitme."
            },
            {
                "code": "Kriter B",
                "title": "Patojenik Bakım Öyküsü",
                "content": "Ağır sosyal ihmal, yoksunluk veya sürekli değişen bakıcı öyküsü (Gelişimsel yaş en az 9 ay olmalıdır)."
            }
        ]
    },
    "factitious_another": {
        "id": "factitious_another",
        "nameTr": "Yapay Bozukluk (Başkasına Yüklenen / Münchausen by Proxy)",
        "nameEn": "Factitious Disorder Imposed on Another (Münchausen by Proxy)",
        "clinicalDescription": {
            "overview": "Bir bakımverenin (neredeyse her zaman annenin), dışsal maddi bir çıkar olmaksızın sadece doktorlardan ilgi görmek ve 'fedakar, kahraman anne' rolünü oynamak için kendi çocuğunda gizlice hastalık üretmesi (kan/dışkı bulaştırma, insülin/ilaç enjekte etme, boğma) tablosudur.",
            "epidemiology": "Pediatri servislerinde açıklanamayan tekrarlayıcı tablolarda görülür; çocukta ölüm (mortalite) oranı %6-10'dur.",
            "etiology": "Bakımverende ağır erken dönem terk edilme travmaları, sınırda/narsisistik kişilik patolojisi ve hastane ortamından beslenme ihtiyacı.",
            "prognosis": "Adli olarak ağır bir çocuk istismarıdır; ilk adım çocuğun derhal devlet korumasına alınması ve adli bildirimdir (DSM-5 tanısı faile konur)."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Başkasında Kasıtlı Hastalık Üretme",
                "content": "Başka bir bireyde (çocukta) fiziksel ya da ruhsal belirtileri kasıtlı olarak üretme, laboratuvar örneklerini bozma ve onu hasta olarak sunma."
            },
            {
                "code": "Kriter B",
                "title": "Dışsal Kazanç Yokluğu",
                "content": "Maddi kazanç veya tazminat gibi dışsal bir ödül olmaksızın aldatma davranışının sürdürülmesi (Tanı mağdura değil, faile konur)."
            }
        ]
    },
    "rumination_disorder": {
        "id": "rumination_disorder",
        "nameTr": "Geri Çıkarma (Geviş Getirme / Ruminasyon) Bozukluğu",
        "nameEn": "Rumination Disorder",
        "clinicalDescription": {
            "overview": "Yutulan yiyeceklerin yemekten kısa süre sonra hiçbir mide bulantısı, öğürme veya iğrenme olmaksızın zahmetsizce ağza geri getirilmesi (regürjitasyon), ağzın içinde tekrar çiğnenmesi ve yeniden yutulması ya da tükürülmesi tablosudur.",
            "epidemiology": "Bebeklerde, okul çağı çocuklarında ve zihinsel yetiyitimi olan bireylerde daha sık görülür.",
            "etiology": "Stres altında kendini yatıştırma amacıyla öğrenilmiş bilinçdışı diyafram ve karın duvarı kası kasılması.",
            "prognosis": "Yemek sonrası derin diyafram nefesi eğitimi (Alışkanlığı Tersine Çevirme / HRT) ile %85 üzerinde tam iyileşme sağlanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Öğürmesiz Yiyecek Geri Getirme (En az 1 ay)",
                "content": "En az 1 ay boyunca yutulan yiyeceklerin bulantı veya öğürme olmadan ağza geri getirilip yeniden çiğnenmesi veya yutulması."
            },
            {
                "code": "Kriter B",
                "title": "Gastrointestinal ve Yeme Bozukluğu Dışlaması",
                "content": "Gastroözofageal reflü (GÖRH) veya pilor stenozuna bağlı değildir; yalnızca anoreksiya/bulimiya seyri sırasında ortaya çıkmaz."
            }
        ]
    },
    "encopresis": {
        "id": "encopresis",
        "nameTr": "Enkoprezis (İstemsiz Kaka Kaçırma)",
        "nameEn": "Encopresis",
        "clinicalDescription": {
            "overview": "Takvim yaşı en az 4 olan bir çocukta uygunsuz yerlere (iç çamaşırına, yere) tekrarlayıcı dışkı kaçırma tablosudur. Vakaların %85'i kronik kabızlık ve rektumdaki taşlaşmış dışkı tıkacının (fekalom) etrafından sıvı dışkının istemsiz sızmasıyla giden 'Taşma İnkontinansı' (Retansiyonlu) tipidir.",
            "epidemiology": "Okul çağı çocuklarının %1-3'ünde görülür; erkek çocuklarda 3-4 kat daha sıktır.",
            "etiology": "Ağrılı dışkılama (anal fissür) korkusuyla çocuğun kakasını tutması, rektal duvarın genişleyip duyusunu kaybetmesi ve taşma sızıntısı.",
            "prognosis": "Cezalandırmanın durdurulması, fekalomun PEG/lavmanla temizlenmesi ve yemek sonrası düzenli tuvalet oturuş eğitimiyle tam düzelir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Yaş ve Sıklık Ölçütü (≥4 Yaş)",
                "content": "En az 4 yaşındaki çocukta, en az 3 ay boyunca ayda en az 1 kez uygunsuz yerlere istemsiz (veya kasıtlı) dışkı kaçırma."
            },
            {
                "code": "Kriter B",
                "title": "Kabızlık ve Taşma İnkontinansı Belirteci",
                "content": "Fizik muayene veya grafide fekal retansiyon (kabızlık) ve taşma sızıntısının gösterilmesi; Hirschsprung hastalığının dışlanması."
            }
        ]
    },
    "restless_legs_syndrome": {
        "id": "restless_legs_syndrome",
        "nameTr": "Huzursuz Bacaklar Sendromu (Willis-Ekbom)",
        "nameEn": "Restless Legs Syndrome (Willis-Ekbom Disease)",
        "clinicalDescription": {
            "overview": "Bacakların derinliklerinde hissedilen karıncalanma, çekilme veya ürperme gibi rahatsız edici duyumlar eşliğinde bacakları hareket ettirme dürtüsüdür. Dinlenmeyle başlar, akşam/gece saatlerinde zirve yapar ve yürümekle anında rahatlar (URGE kriterleri).",
            "epidemiology": "Toplumda %2-7 oranında görülür; kadınlarda, gebelerde ve demir eksikliği olanlarda 2 kat sıktır.",
            "etiology": "Merkezi sinir sisteminde demir eksikliği (Ferritin düşüklüğü) ve buna bağlı nigrostriatal/spinal dopaminerjik disfonksiyon.",
            "prognosis": "Demir (Ferritin >75 ng/mL) replasmanı, tetikleyici ilaçların (antihistaminik, SSRI, mirtazapin) kesilmesi ve Pregabalin/Pramipeksol ile hızla düzelir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "URGE Tanı Ölçütleri",
                "content": "1) Bacakları hareket ettirme dürtüsü (Urge), 2) Dinlenmede başlama (Rest), 3) Hareketle/yürümekle geçme (Gets better), 4) Akşam/gece kötüleşme (Evening)."
            },
            {
                "code": "Kriter B",
                "title": "Süre ve Sıklık Kriteri",
                "content": "Belirtilerin en az 3 aydır haftada en az 3 kez ortaya çıkması ve ağır uykuya dalma güçlüğü yaratması."
            }
        ]
    },
    "nrem_sleep_arousal": {
        "id": "nrem_sleep_arousal",
        "nameTr": "NREM Uykusundan Uyanma Bozukluğu",
        "nameEn": "Non-Rapid Eye Movement Sleep Arousal Disorder",
        "clinicalDescription": {
            "overview": "Çoğunlukla ana uyku döneminin ilk üçte birinde, derin NREM (evre 3, yavaş dalga) uykusundan tamamlanmamış uyanma epizodlarıyla giden parasomnidir. Epizodlar uyurgezerlik (yataktan kalkıp dolaşma, boş bakış, uyandırılma güçlüğü) ya da uyku terörü (dehşet çığlığıyla ani uyanma, yoğun otonom uyarılma, avutulamama) biçimindedir; rüya çok az ya da hiç hatırlanmaz ve sabah epizoda amnezi vardır. Tek tanıdır; uyurgezerlik ve uyku terörü bu tanının tipleridir.",
            "epidemiology": "Uyurgezerlik epizodları çocukların %10-30'unda en az bir kez, yineleyen biçimde %2-3'ünde; erişkinlerde yaklaşık %1-4'ünde görülür. Uyku terörü 4-12 yaş çocuklarda sıktır ve ergenlikte çoğunlukla kendiliğinden kaybolur. Aile öyküsü güçlüdür.",
            "etiology": "Derin yavaş dalga uykusundan motor ve otonom sistemler uyanırken korteksin kısmen uykuda kalması (ayrışmış uyanma). Uyku yoksunluğu, ateş, stres, alkol, bazı ilaçlar ve uyku apnesi gibi uykuyu bölen durumlar tetikler.",
            "prognosis": "Çocuklarda genellikle kendiliğinden geçer. Ev güvenliği (kapı/pencere kilidi, alarm), uyku yoksunluğu ve tetikleyicilerden kaçınma, aile eğitimi (atak sırasında zorla uyandırmama) ve planlı uyandırma yararlıdır; yaralanma riski olan erişkinlerde düşük doz klonazepam kullanılabilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Tamamlanmamış Uyanma Epizodları",
                "content": "Çoğunlukla ana uyku döneminin ilk üçte birinde ortaya çıkan, uykudan tamamlanmamış uyanma epizodları; aşağıdakilerden biri eşlik eder:",
                "items": [
                    "Uyurgezerlik: uyku sırasında yataktan kalkıp dolaşma; boş, dik bakış, başkalarının iletişim çabalarına görece tepkisizlik ve güç uyandırılma.",
                    "Uyku terörü: çoğunlukla dehşet çığlığıyla başlayan ani korkulu uyanmalar; yoğun korku ve otonom uyarılma belirtileri (midriyazis, taşikardi, hızlı soluma, terleme) ve epizod sırasında avutma çabalarına görece tepkisizlik."
                ]
            },
            {
                "code": "Kriter B-F",
                "title": "Rüya Hatırlamama, Amnezi ve Dışlama",
                "content": "Rüya imgesi hiç ya da çok az (tek bir görsel sahne) hatırlanır (B). Epizodlara amnezi vardır (C). Epizodlar belirgin sıkıntıya ya da işlev bozulmasına yol açar (D). Bir maddenin ya da ilacın fizyolojik etkilerine bağlanamaz (E). Eşlik eden ruhsal ve tıbbi bozukluklar epizodları açıklamaz (F)."
            },
            {
                "code": "Belirleyiciler / Alt tipler",
                "title": "Tipler",
                "content": "Tip belirtilir:",
                "items": [
                    "Uyurgezerlik tipi (F51.3); ek belirleyiciler: uykuyla ilişkili yeme ile, uykuyla ilişkili cinsel davranışla (seksomni).",
                    "Uyku terörü tipi (F51.4).",
                    "Ayırıcı tanı: REM uykusu davranış bozukluğu ve kabus bozukluğu REM uykusunda, gecenin ikinci yarısında olur; kişi uyanınca yönelimlidir ve rüyayı hatırlar."
                ]
            }
        ]
    },
    "substance_induced_sexual_dysfunction": {
        "id": "substance_induced_sexual_dysfunction",
        "nameTr": "Maddenin/İlacın Yol Açtığı Cinsel İşlev Bozukluğu",
        "nameEn": "Substance/Medication-Induced Sexual Dysfunction",
        "clinicalDescription": {
            "overview": "Bir ilacın (en sık SSRI ve SNRI grubu antidepresanlar, antipsikotikler, beta-blokerler) başlanmasından veya doz artışından sonra ortaya çıkan belirgin cinsel istek azalması, sertleşme/uyarılma güçlüğü veya orgazm olamama (anorgazmi / gecikmiş ejakülasyon) tablosudur.",
            "epidemiology": "SSRI (özellikle Paroksetin, Sertralin, Fluoksetin) ve Venlafaksin kullanan hastaların %40-65'inde görülür ve ilaç bırakmanın en sık nedenidir.",
            "etiology": "Artan serotoninin postsinaptik 5-HT2A ve 5-HT2C reseptörlerini uyararak mezolimbik dopamini ve spinal ejakülasyon/nitrik oksit refleksini baskılaması.",
            "prognosis": "Bupropion (NDRI) eklenmesi/geçişi, Mirtazapin/Vortioksetin'e geçiş veya PDE-5 inhibitörü (Sildenafil) desteği ile tam olarak düzelir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "İlaç Kullanımıyla Zamansal İlişki",
                "content": "Cinsel istek, uyarılma veya orgazm bozukluğunun ilaç başlandıktan/doz artırıldıktan sonraki ilk haftalar içinde gelişmesi."
            },
            {
                "code": "Kriter B",
                "title": "Birincil Cinsel Bozukluk Dışlaması",
                "content": "Semptomların ilaç öncesinde bulunmaması ve ilacın doğrudan farmakolojik etkisiyle açıklanması."
            }
        ]
    },
    "major_neurocognitive_lewy_body": {
        "id": "major_neurocognitive_lewy_body",
        "nameTr": "Majör Nörobilişsel Bozukluk (Lewy Cisimcikli Demans)",
        "nameEn": "Major Neurocognitive Disorder with Lewy Bodies",
        "clinicalDescription": {
            "overview": "Alzheimer'dan sonra en sık ikinci dejeneratif demans olup; 1) Dikkat ve uyanıklıkta belirgin dalgalanmalar, 2) Yineleyen canlı ve ayrıntılı görsel halüsinasyonlar, 3) Spontan parkinsonizm ve 4) REM Uykusu Davranış Bozukluğu ile karakterizedir.",
            "epidemiology": "Tüm demansların %10-15'ini oluşturur; yaşlı erkeklerde daha sık görülür.",
            "etiology": "Serebral korteks ve beyin sapı nöronlarında Alfa-Sinüklein proteininden oluşan 'Lewy Cisimciklerinin' birikimi ve ağır kolinerjik yıkım.",
            "prognosis": "Rivastigmin (kolinesteraz inhibitörü) görsel halüsinasyonlara çok iyi gelir; tipik antipsikotikler (Haloperidol) ölümcül nöroleptik duyarlılık yaptığı için KESİNLİKLE KONTRENDİKEDİR!"
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "3 Çekirdek Klinik Özellik",
                "content": "1) Bilişsel dalgalanma (fluktuasyon), 2) Ayrıntılı ve canlı görsel varsanılar, 3) Demansla eşzamanlı (1 yıl içinde) başlayan spontan Parkinsonizm."
            },
            {
                "code": "Kriter B",
                "title": "REM Uykusu Davranış Bozukluğu ve Nöroleptik Duyarlılığı",
                "content": "RBD öyküsü ve antipsikotik ilaçlara karşı aşırı/hayatı tehdit edici duyarlılık."
            }
        ]
    },
    "major_neurocognitive_prion": {
        "id": "major_neurocognitive_prion",
        "nameTr": "Majör Nörobilişsel Bozukluk (Prion Hastalığı / Creutzfeldt-Jakob)",
        "nameEn": "Major Neurocognitive Disorder Due to Prion Disease",
        "clinicalDescription": {
            "overview": "Anormal katlanmış enfeksiyöz prion proteinlerinin (PrPSc) beyinde süngerimsi (spongiform) boşluklar oluşturarak nöronları hızla yok ettiği; haftalar/aylar içinde çöküşe götüren çok hızlı demans, irkilme miyoklonusu (startle myoclonus) ve ataksi tablosudur.",
            "epidemiology": "Yılda milyonda 1 görülür; %85'i sporadik Creutzfeldt-Jakob Hastalığı (sCJD) formundadır.",
            "etiology": "Normal hücresel PrPC proteininin patolojik beta-tabakalı PrPSc formuna dönüşerek zincirleme nöronal yıkım başlatması.",
            "prognosis": "Ne yazık ki küratif tedavisi yoktur ve genellikle 6-12 ay içinde ölümle sonuçlanır; miyoklonus için Klonazepam/Levetirasetam kullanılır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Çok Hızlı İlerleyen Demans ve Miyoklonus",
                "content": "Haftalar ve birkaç ay içinde hızla ilerleyen bilişsel yıkım + Sese/uyarana karşı ani kas sıçramaları (irkilme miyoklonusu) ve serebellar ataksi."
            },
            {
                "code": "Kriter B",
                "title": "Karakteristik MRG, EEG ve BOS Bulguları",
                "content": "Difüzyon MRG'de kortikal şeritlenme/bazal ganglion hiperintensitesi, EEG'de periyodik keskin dalga kompleksleri ve BOS'ta 14-3-3 proteini / RT-QuIC pozitifliği."
            }
        ]
    },
    "major_neurocognitive_huntington": {
        "id": "major_neurocognitive_huntington",
        "nameTr": "Majör Nörobilişsel Bozukluk (Huntington Hastalığına Bağlı)",
        "nameEn": "Major Neurocognitive Disorder Due to Huntington's Disease",
        "clinicalDescription": {
            "overview": "4. kromozomdaki otozomal dominant CAG trinükleotid tekrar artışına bağlı gelişen; 30-40'lı yaşlarda başlayan istemsiz dans benzeri kıvrılma/sıçrama hareketleri (kore), yürütücü işlev kaybı (subkortikal demans) ve ağır depresyon/irritabilite/psikoz triadıdır.",
            "epidemiology": "Batı toplumlarında 100.000'de 5-10 görülür; otozomal dominant olduğu için hasta ebeveynin çocuklarında risk %50'dir.",
            "etiology": "HTT geninde ≥36 CAG tekrarı sonucu mutant huntingtin proteininin striatumda (kaudat çekirdek ve putamen) GABAerjik nöronları yıkması.",
            "prognosis": "İlerleyicidir; kore için VMAT2 inhibitörleri (Tetrabenazin, Dötetrabenazin) kullanılır; intihar riski çok yüksek olduğu için yakın takip şarttır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Subkortikal Demans ve Koreiform Hareketler",
                "content": "Yürütücü işlevlerde ve işlem hızında ilerleyici bozulma ile birlikte yüz, gövde ve ekstremitelerde istemsiz kore hareketleri."
            },
            {
                "code": "Kriter B",
                "title": "Genetik Mutasyon ve Kaudat Atrofi",
                "content": "Ailede otozomal dominant Huntington öyküsü, HTT geninde CAG tekrar artışı ve MRG'de kaudat çekirdek başı atrofisi (kutu ventriküller)."
            }
        ]
    },
    "wernicke_korsakoff_syndrome": {
        "id": "wernicke_korsakoff_syndrome",
        "nameTr": "Alkolün Yol Açtığı Majör Nörobilişsel Bozukluk (Amnestik-Konfabulatuvar Tip / Korsakoff)",
        "nameEn": "Alcohol-Induced Major Neurocognitive Disorder, Amnestic-Confabulatory Type",
        "clinicalDescription": {
            "overview": "DSM-5-TR'de bu tablo 'Alkolün Yol Açtığı Majör Nörobilişsel Bozukluk, amnestik-konfabulatuvar tip' olarak kodlanır (DSM-IV'teki 'maddenin yol açtığı kalıcı amnestik bozukluk' adı artık kullanılmaz). Kronik alkol bağımlılığı ve ağır Tiamin (B1 vitamini) eksikliği sonucu önce akut Wernicke Ensefalopatisi (Konfüzyon + Oftalmopleji/Nistagmus + Ataksi triadı), tedavi gecikirse ardından kalıcı Korsakoff Sendromu (ağır anterograd amnezi ve bellek boşluklarını hayali anılarla doldurma / konfabülasyon) gelişmesidir.",
            "epidemiology": "Tedavi edilmeyen Wernicke hastalarının %80'i kalıcı Korsakoff amnestik bozukluğuna ilerler.",
            "etiology": "Tiamin eksikliğine bağlı mamiller cisimcikler (corpora mamillaria) ve dorsomedial talamik çekirdeklerde peteşiyal kanama ve nekroz.",
            "prognosis": "Wernicke evresinde glukozdan ÖNCE yüksek doz IV Tiamin verilirse tam düzelir; Korsakoff evresine geçtikten sonra ise kalıcı bellek yıkımı oluşur."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Ağır Anterograd Amnezi ve Konfabülasyon",
                "content": "Genel zeka ve anlık bellek korunmuşken, yeni bilgileri öğrenememe (5 dakika öncesini unutma) ve boşlukları masallama (konfabülasyon) ile doldurma."
            },
            {
                "code": "Kriter B",
                "title": "Kronik Alkol ve Tiamin Eksikliği Öyküsü",
                "content": "Wernicke triadı (oftalmopleji, ataksi, konfüzyon) ve mamillo-talamik lezyon kanıtı."
            }
        ]
    },
    "intellectual_disability_mild": {
        "id": "intellectual_disability_mild",
        "nameTr": "Zihinsel Yetiyitimi (Hafif Düzey)",
        "nameEn": "Intellectual Developmental Disorder (Intellectual Disability), Mild",
        "clinicalDescription": {
            "overview": "Gelişim döneminde başlayan, hem zihinsel (entelektüel) işlevlerde hem de kavramsal, toplumsal ve uygulamaya dönük (pratik) alanlarda uyumsal işlevsellikte yetersizlikle giden tablonun en hafif düzeyidir. Okul öncesinde çoğu zaman fark edilmez; okul çağında okuma, yazma, aritmetik, zaman ve para kavramlarında güçlük belirginleşir. Toplumsal ilişkilerde yaşıtlarına göre daha 'çocuksu' kalabilir, sosyal ipuçlarını okumakta ve risk değerlendirmekte zorlanır, bu nedenle istismar ve kandırılmaya açıktır. Öz bakımda çoğunlukla bağımsızdır; yetişkinlikte kavramsal beceri gerektirmeyen işlerde çalışabilir ancak para yönetimi, sağlık ve hukuki kararlar gibi karmaşık konularda desteğe ihtiyaç duyar. DSM-5'te düzey IQ puanına göre değil, uyumsal işlevselliğe göre belirlenir.",
            "epidemiology": "Zihinsel yetiyitiminin genel toplumdaki yaygınlığı yaklaşık %1'dir. Olguların büyük çoğunluğu (geleneksel olarak yaklaşık %85) hafif düzeydedir. Erkeklerde biraz daha sık görülür.",
            "etiology": "Hafif düzeyde çoğu zaman belirli bir organik neden saptanamaz; poligenik kalıtım ile yoksulluk, yetersiz uyaran ve eğitim olanaklarının kısıtlılığı gibi psikososyal etkenler birlikte rol oynar. Bir kısmında genetik sendromlar (örn. frajil X), doğum öncesi alkol maruziyeti veya doğum çevresi komplikasyonlar bulunur.",
            "prognosis": "Erken tanı, bireyselleştirilmiş eğitim programı (özel eğitim/kaynaştırma), sosyal beceri eğitimi ve mesleki rehabilitasyon ile birçok kişi yarı bağımsız ya da bağımsız yaşam sürdürebilir. Eşlik eden DEHB, anksiyete ve depresyon sık görülür ve gözden kaçırılmamalıdır."
        },
        "criteriaList": [
            {
                "code": "Kriter A, B & C",
                "title": "Üç Temel Ölçüt (Zihinsel İşlev + Uyumsal İşlev + Gelişimsel Başlangıç)",
                "content": "A: Akıl yürütme, sorun çözme, planlama, soyut düşünme, yargılama, akademik öğrenme ve deneyimden öğrenme gibi zihinsel işlevlerde, klinik değerlendirme ve bireysel uygulanan standart zekâ testleriyle doğrulanan yetersizlik (genellikle ortalamanın yaklaşık 2 standart sapma altı; ölçüm hatası payıyla IQ yaklaşık 65-75 ve altı). B: Kişisel bağımsızlık ve toplumsal sorumluluk açısından gelişimsel ve sosyokültürel standartları karşılayamayan, desteğe gereksinim doğuran uyumsal işlevsellik yetersizliği. C: Her ikisinin de gelişim döneminde başlaması."
            },
            {
                "code": "Şiddet Belirleyicisi",
                "title": "Hafif Düzeyi Belirleyen Özellikler",
                "content": "Kavramsal alanda akademik becerilerde ve yürütücü işlevlerde güçlük; toplumsal alanda yaşıtlara göre olgunlaşmamış iletişim ve yargı; pratik alanda öz bakımda yaşa uygun işlev, ancak alışveriş, ulaşım, ev düzeni, para ve sağlık kararları gibi karmaşık günlük işlerde desteğe gereksinim. Geleneksel (ICD-10) sınıflamada karşılık gelen IQ aralığı yaklaşık 50-69'dur; DSM-5'te düzey belirlenirken IQ değil uyumsal işlevsellik esas alınır."
            }
        ]
    },
    "intellectual_disability_moderate": {
        "id": "intellectual_disability_moderate",
        "nameTr": "Zihinsel Yetiyitimi (Orta Düzey)",
        "nameEn": "Intellectual Developmental Disorder (Intellectual Disability), Moderate",
        "clinicalDescription": {
            "overview": "Zihinsel yetiyitiminin, gelişim boyunca kavramsal becerilerin yaşıtlardan belirgin biçimde geride kaldığı orta düzeyidir. Okul öncesi dönemde dil ve okul öncesi beceriler yavaş gelişir; akademik beceriler çoğunlukla ilkokul düzeyinde kalır. Konuşma dili toplumsal iletişimde başlıca araçtır ancak yaşıtlarına göre çok daha basittir. Uzun süreli öğretim ve destekle yemek yeme, giyinme, tuvalet ve temizlik gibi öz bakım becerilerinde bağımsızlık kazanılabilir; yetişkinlikte kavramsal ve iletişim gereksinimi az olan işlerde, belirgin destekle çalışabilir.",
            "epidemiology": "Zihinsel yetiyitimi olan bireylerin yaklaşık %10'u orta düzeydedir (geleneksel tahmin).",
            "etiology": "Hafif düzeye göre belirli bir biyolojik nedenin saptanma olasılığı daha yüksektir: Down sendromu (trizomi 21), frajil X sendromu, diğer kromozom anomalileri, doğum öncesi enfeksiyonlar, fetal alkol maruziyeti, doğum çevresi hipoksi ve erken çocukluk dönemi merkezi sinir sistemi enfeksiyonları ya da travmaları sayılabilir.",
            "prognosis": "Yaşam boyu değişen yoğunlukta desteğe gereksinim sürer. Erken müdahale, yapılandırılmış özel eğitim, iletişim desteği ve korumalı/destekli istihdam ile öz bakım ve topluma katılım belirgin artar. Davranış sorunlarına uygulamalı davranış analizi temelli yaklaşımlar kullanılır."
        },
        "criteriaList": [
            {
                "code": "Kriter A, B & C",
                "title": "Ortak Tanı Ölçütleri",
                "content": "Standart testler ve klinik değerlendirmeyle doğrulanan zihinsel işlev yetersizliği (A), kişisel bağımsızlık ve toplumsal sorumluluğu sınırlayan uyumsal işlevsellik yetersizliği (B) ve bunların gelişim döneminde başlaması (C). Düzey uyumsal işlevselliğe göre belirlenir."
            },
            {
                "code": "Şiddet Belirleyicisi",
                "title": "Orta Düzeyi Belirleyen Özellikler",
                "content": "Kavramsal alanda okuma-yazma ve sayı becerileri temel düzeyde kalır, iş ve günlük yaşamdaki kavramsal görevler için sürekli destek gerekir; toplumsal alanda arkadaşlık kurulabilse de sosyal ipuçlarını yorumlamada ve kararlarda bakım verenlerin yardımına gereksinim vardır; pratik alanda öz bakım uzun bir öğretim süreciyle kazanılır, bağımsız yaşam ve iş için kalıcı destek gerekir. Geleneksel (ICD-10) karşılığı yaklaşık IQ 35-49'dur."
            }
        ]
    },
    "intellectual_disability_severe": {
        "id": "intellectual_disability_severe",
        "nameTr": "Zihinsel Yetiyitimi (Ağır Düzey)",
        "nameEn": "Intellectual Developmental Disorder (Intellectual Disability), Severe",
        "clinicalDescription": {
            "overview": "Kavramsal becerilerin çok sınırlı kaldığı ağır düzeyde kişi, yazılı dil ve sayı, nicelik, zaman ve para kavramlarını çok az anlar. Konuşma sözcük ve kısa ifadelerle sınırlıdır, çoğunlukla 'şimdi ve burada' olan olaylara yöneliktir; basit konuşmayı ve jestleri anlayabilir. Yemek, giyinme, banyo ve tuvalet dahil tüm günlük yaşam etkinliklerinde desteğe ve sürekli gözetime gereksinim duyar; kendisi ve başkalarının iyiliği için sorumluluk gerektiren kararlar alamaz. Bir azınlıkta kendine zarar verme gibi uyumsuz davranışlar görülür.",
            "epidemiology": "Zihinsel yetiyitimi olan bireylerin yaklaşık %3-4'ü ağır düzeydedir (geleneksel tahmin). Ağır zihinsel yetiyitiminin toplumdaki yaygınlığı binde 6 civarında bildirilmektedir.",
            "etiology": "Olguların çoğunda belirlenebilir bir organik neden vardır: kromozom ve tek gen bozuklukları, metabolik hastalıklar, beyin gelişim anomalileri, ağır doğum öncesi/doğum çevresi beyin hasarı. Epilepsi, serebral palsi ve duyusal yetersizlikler sık eşlik eder.",
            "prognosis": "Yaşam boyu yoğun destek gerekir. Erken dönemden itibaren yapılandırılmış öğretim, alternatif ve destekleyici iletişim yöntemleri, eşlik eden tıbbi sorunların (epilepsi, beslenme, motor sorunlar) yönetimi ve aile desteği yaşam kalitesini artırır."
        },
        "criteriaList": [
            {
                "code": "Kriter A, B & C",
                "title": "Ortak Tanı Ölçütleri",
                "content": "Zihinsel işlev yetersizliği (A), gündelik yaşamın birden fazla alanında desteğe gereksinim doğuran uyumsal işlevsellik yetersizliği (B) ve gelişim döneminde başlangıç (C). Ağır düzeyde standart zekâ testleri çoğu zaman güvenilir biçimde uygulanamaz; değerlendirme uyumsal işlevsellik ölçeklerine ve klinik gözleme dayanır."
            },
            {
                "code": "Şiddet Belirleyicisi",
                "title": "Ağır Düzeyi Belirleyen Özellikler",
                "content": "Kavramsal alanda sembolik kavramların çok sınırlı kavranması; toplumsal alanda sözcük/kısa ifade düzeyinde konuşma ve aile ile tanıdıklarla kurulan ilişkilerden haz alma; pratik alanda tüm günlük etkinliklerde sürekli destek ve gözetime gereksinim. Geleneksel (ICD-10) karşılığı yaklaşık IQ 20-34'tür."
            }
        ]
    },
    "intellectual_disability_profound": {
        "id": "intellectual_disability_profound",
        "nameTr": "Zihinsel Yetiyitimi (İleri Derecede Ağır)",
        "nameEn": "Intellectual Developmental Disorder (Intellectual Disability), Profound",
        "clinicalDescription": {
            "overview": "Zihinsel yetiyitiminin en ağır düzeyidir. Kavramsal beceriler sembolik süreçlerden çok fiziksel dünyaya ilişkindir; kişi nesneleri amaca yönelik olarak (örn. eşleştirme, sıralama gibi basit görsel-uzamsal becerilerle) kullanabilir. Konuşma ve jestlerin sembolik iletişimini anlaması çok sınırlıdır; isteklerini ve duygularını büyük ölçüde sözel olmayan yollarla ifade eder. Eşlik eden motor ve duyusal yetersizlikler sıktır. Bedensel bakım, sağlık ve güvenliğin tüm yönlerinde başkalarına bağımlıdır.",
            "epidemiology": "Zihinsel yetiyitimi olan bireylerin yaklaşık %1-2'si ileri derecede ağır düzeydedir (geleneksel tahmin).",
            "etiology": "Hemen her zaman belirgin bir nörolojik/biyolojik neden vardır: ağır kromozom anomalileri, metabolik ve nörodejeneratif hastalıklar, yaygın beyin malformasyonları, ağır hipoksik-iskemik hasar. Tedaviye dirençli epilepsi, serebral palsi, görme ve işitme kayıpları sık eşlik eder.",
            "prognosis": "Yaşam boyu tam bakım gerekir. Tıbbi sorunların özenli yönetimi, duyusal uyaran ve basit iletişim yöntemlerine dayalı programlar ve bakım verenlerin desteklenmesi yaşam kalitesini korumada temeldir. Eşlik eden tıbbi durumlar nedeniyle yaşam beklentisi kısalabilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A, B & C",
                "title": "Ortak Tanı Ölçütleri",
                "content": "Zihinsel işlev yetersizliği (A), uyumsal işlevselliğin tüm alanlarında belirgin yetersizlik (B) ve gelişim döneminde başlangıç (C). Bu düzeyde değerlendirme ağırlıklı olarak uyumsal işlevselliğe ve gözleme dayanır."
            },
            {
                "code": "Şiddet Belirleyicisi",
                "title": "İleri Derecede Ağır Düzeyi Belirleyen Özellikler",
                "content": "Kavramsal alanda sembolik değil somut/fiziksel düzeyde beceriler; toplumsal alanda basit yönerge ve jestleri sınırlı anlama, iletişimin büyük ölçüde sözel olmayan yollarla kurulması; pratik alanda bedensel bakım, sağlık ve güvenliğin her yönünde başkalarına bağımlılık (bazı basit ev işlerine destekle katılabilir). Geleneksel (ICD-10) karşılığı IQ yaklaşık 20'nin altıdır."
            }
        ]
    },
    "global_developmental_delay": {
        "id": "global_developmental_delay",
        "nameTr": "Küresel Gelişimsel Gecikme",
        "nameEn": "Global Developmental Delay",
        "clinicalDescription": {
            "overview": "5 yaşından küçük bir çocukta, zihinsel işlevselliğin birden fazla alanında beklenen gelişim basamaklarına ulaşılamadığı, ancak klinik şiddetin henüz güvenilir biçimde değerlendirilemediği durumlarda konulan tanıdır. Çocuk standart zekâ testlerine katılamayacak kadar küçük olduğu için zihinsel yetiyitimi tanısı ve düzeyi kesinleştirilemez. Geçici bir tanı niteliği taşır ve belirli bir süre sonra yeniden değerlendirme gerektirir.",
            "epidemiology": "5 yaş altı çocuklarda yaklaşık %1-3 oranında bildirilmektedir.",
            "etiology": "Genetik (kromozom anomalileri, tek gen bozuklukları), doğum öncesi (enfeksiyon, alkol/madde maruziyeti), doğum çevresi (prematürite, hipoksi) ve doğum sonrası (merkezi sinir sistemi enfeksiyonu, travma, ağır ihmal) nedenler araştırılmalıdır. Genetik testler, metabolik tarama, işitme-görme değerlendirmesi ve gerektiğinde nörogörüntüleme önerilir.",
            "prognosis": "Bir kısmı izlemde zihinsel yetiyitimi tanısı alırken bir kısmı yaşıtlarını büyük ölçüde yakalar. Erken müdahale programları (özel eğitim, dil-konuşma ve fizyoterapi) sonuçları belirgin biçimde iyileştirir."
        },
        "criteriaList": [
            {
                "code": "Tanım",
                "title": "Kullanım Koşulları (5 Yaş Altı)",
                "content": "5 yaşından küçük bireylerde, zihinsel işlevselliğin birkaç alanında beklenen gelişim basamaklarına ulaşamama durumunda kullanılır. Çocuğun yaşı nedeniyle sistematik zekâ ve uyumsal işlev değerlendirmeleri yapılamadığında, klinik şiddet güvenilir biçimde belirlenemediğinde konur."
            },
            {
                "code": "Yeniden Değerlendirme",
                "title": "Geçici Tanı Niteliği",
                "content": "Tanı belirli bir süre sonra yeniden değerlendirilmeyi gerektirir; değerlendirme yapılabilir hale geldiğinde zihinsel yetiyitimi (ve düzeyi), başka bir nörogelişimsel bozukluk ya da tanı gerektirmeyen bir gelişim örüntüsü açısından karar verilir."
            }
        ]
    },
    "unspecified_intellectual_disability": {
        "id": "unspecified_intellectual_disability",
        "nameTr": "Belirtilmemiş Zihinsel Yetiyitimi",
        "nameEn": "Unspecified Intellectual Developmental Disorder (Intellectual Disability)",
        "clinicalDescription": {
            "overview": "5 yaşından büyük bireylerde, zihinsel yetiyitimi bulunduğu düşünülmekle birlikte eşlik eden duyusal ya da bedensel yetersizlikler (körlük, dil öncesi dönemde başlayan sağırlık), hareket yetersizliği, ağır davranış sorunları veya eşlik eden bir ruhsal bozukluk nedeniyle yerel olarak uygulanabilir yöntemlerle düzeyin belirlenmesinin güç ya da olanaksız olduğu durumlarda kullanılan tanıdır.",
            "epidemiology": "Yalnızca istisnai durumlarda kullanılması öngörülen bir kategoridir; ayrı yaygınlık verisi yoktur.",
            "etiology": "Altta yatan nedenler zihinsel yetiyitiminin genel nedenleriyle aynıdır; değerlendirmeyi zorlaştıran ek yetersizlikler (ör. ağır serebral palsi, çoğul duyusal kayıp) bu grupta özellikle sıktır.",
            "prognosis": "Bireye uyarlanmış değerlendirme araçları (sözel olmayan testler, duyusal yetersizliğe uygun ölçekler) kullanılabilir hale geldiğinde tanı ve düzey yeniden değerlendirilmelidir."
        },
        "criteriaList": [
            {
                "code": "Tanım",
                "title": "Kullanım Koşulları (5 Yaş ve Üzeri)",
                "content": "5 yaş ve üzerindeki bireylerde, zihinsel yetiyitiminin düzeyini belirlemenin duyusal/bedensel yetersizlik, hareket yetersizliği, ağır sorun davranışlar veya eşlik eden ruhsal bozukluk nedeniyle güç ya da olanaksız olduğu durumlarda konur."
            },
            {
                "code": "Not",
                "title": "İstisnai Kullanım ve Yeniden Değerlendirme",
                "content": "Bu kategori yalnızca istisnai durumlarda kullanılmalı ve belirli aralıklarla yeniden değerlendirme yapılmalıdır. 5 yaş altındaki çocuklarda aynı durumda Küresel Gelişimsel Gecikme tanısı tercih edilir."
            }
        ]
    },
    "language_disorder": {
        "id": "language_disorder",
        "nameTr": "Dil Bozukluğu",
        "nameEn": "Language Disorder",
        "clinicalDescription": {
            "overview": "Dili anlama ya da üretmedeki yetersizlikler nedeniyle konuşma, yazı veya işaret dili gibi farklı kipliklerde dilin edinilmesi ve kullanılmasında süregen güçlüklerle tanımlanan iletişim bozukluğudur. Sözcük dağarcığı dardır, cümle yapıları yaşa göre basit kalır ve kişi olayları anlatırken ya da bir konuyu açıklarken düşüncelerini birbirine bağlamakta zorlanır. Alıcı (anlama) güçlükleri olan çocuklarda prognoz, yalnızca ifade edici güçlüğü olanlara göre daha kötüdür.",
            "epidemiology": "Okul öncesi çocuklarda sık görülür; okula başlama yaşında yaklaşık %7 civarında bildirilmektedir. Ailede dil bozukluğu öyküsü önemli bir risk etkenidir.",
            "etiology": "Güçlü genetik katkısı vardır (ikiz ve aile çalışmalarında yüksek kalıtılabilirlik). İşitme kaybı, zihinsel yetiyitimi ve otizm spektrum bozukluğu ayırıcı tanıda mutlaka dışlanmalı ya da eşlik eden tanı olarak değerlendirilmelidir.",
            "prognosis": "4 yaşından sonra belirgin olan dil güçlükleri genellikle zaman içinde kalıcıdır ve okuma bozukluğu (özgül öğrenme bozukluğu), sosyal ve duygusal sorunlar için risk oluşturur. Erken dil ve konuşma terapisi en etkili yaklaşımdır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Dil Edinimi ve Kullanımında Süregen Güçlük",
                "content": "Anlama ya da üretme yetersizliğine bağlı, farklı kipliklerde (konuşma, yazı, işaret dili) dilin edinilmesi ve kullanılmasında süregen güçlük:",
                "items": [
                    "1. Sözcük dağarcığının kısıtlı olması (sözcük bilgisi ve kullanımı).",
                    "2. Cümle yapısının sınırlı olması (dilbilgisi ve biçimbilgisi kurallarına göre sözcükleri birleştirme).",
                    "3. Söylem becerilerinde yetersizlik (bir konuyu, olayı açıklamak ya da konuşmayı sürdürmek için cümleleri birbirine bağlamada güçlük)."
                ]
            },
            {
                "code": "Kriter B, C & D",
                "title": "Belirgin Yetersizlik, Erken Başlangıç ve Dışlama",
                "content": "Dil becerileri yaşa göre beklenenin belirgin ve ölçülebilir biçimde altındadır ve iletişim, toplumsal katılım, akademik ya da mesleki başarıda işlevsel kısıtlılığa yol açar (B). Belirtiler erken gelişim döneminde başlar (C). Güçlükler işitme ya da başka bir duyu yetersizliğine, motor işlev bozukluğuna veya başka bir tıbbi/nörolojik duruma bağlanamaz; zihinsel yetiyitimi ya da küresel gelişimsel gecikmeyle daha iyi açıklanamaz (D)."
            }
        ]
    },
    "speech_sound_disorder": {
        "id": "speech_sound_disorder",
        "nameTr": "Konuşma Sesi Bozukluğu (Fonolojik Bozukluk)",
        "nameEn": "Speech Sound Disorder",
        "clinicalDescription": {
            "overview": "Çocuğun yaşına ve gelişim düzeyine göre beklenen konuşma seslerini üretmede süregen güçlük çektiği, bunun konuşmanın anlaşılırlığını bozduğu ya da sözel iletişimi engellediği bozukluktur. Ses atlama (örn. 'top' yerine 'to'), ses değiştirme (örn. 'r' yerine 'y') veya ses bozulmaları görülür. Güçlük, seslerin dil sistemindeki kurallarının (fonoloji) ya da seslerin motor olarak üretiminin (artikülasyon) bilgisi ve becerisiyle ilişkili olabilir.",
            "epidemiology": "Okul öncesi ve erken okul çağında sık görülen bir iletişim bozukluğudur; erkek çocuklarda daha sıktır. Tipik gelişen çocukların çoğu 4 yaşına kadar büyük ölçüde anlaşılır konuşur.",
            "etiology": "Genetik yatkınlık ve aile öyküsü önemlidir. Dil bozukluğu ve okuma güçlükleriyle sık birliktelik gösterir. Ayırıcı tanıda işitme kaybı, yarık damak, serebral palsi gibi yapısal/nörolojik nedenler ve dizartri dışlanmalıdır.",
            "prognosis": "Dil ve konuşma terapisine iyi yanıt verir; çocukların çoğunda belirgin düzelme sağlanır. Eşlik eden dil bozukluğu varsa prognoz daha sınırlıdır ve okuma-yazma güçlükleri açısından izlem gerekir."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B",
                "title": "Ses Üretiminde Süregen Güçlük ve İşlevsel Etki",
                "content": "Konuşmanın anlaşılırlığını bozan ya da sözel iletişimi engelleyen, konuşma seslerini üretmede süregen güçlük (A). Bu güçlük etkili iletişimi kısıtlar ve toplumsal katılım, akademik ya da mesleki başarıyı tek başına ya da birlikte olumsuz etkiler (B)."
            },
            {
                "code": "Kriter C & D",
                "title": "Erken Başlangıç ve Dışlama",
                "content": "Belirtiler erken gelişim döneminde başlar (C). Güçlükler serebral palsi, yarık damak, sağırlık/işitme kaybı, kafa travması gibi doğuştan ya da edinilmiş durumlara veya başka tıbbi/nörolojik durumlara bağlanamaz (D)."
            }
        ]
    },
    "social_communication_disorder": {
        "id": "social_communication_disorder",
        "nameTr": "Toplumsal (Pragmatik) İletişim Bozukluğu",
        "nameEn": "Social (Pragmatic) Communication Disorder",
        "clinicalDescription": {
            "overview": "Sözcük ve dilbilgisi becerileri görece korunmuş olmasına karşın, dilin toplumsal amaçlarla kullanımında (pragmatik) süregen güçlüklerle tanımlanan bozukluktur. Kişi selamlaşma ve bilgi paylaşma gibi iletişimi bağlama uygun kullanmakta, konuştuğu kişiye ve ortama göre konuşma biçimini değiştirmekte, söz sırasına uymakta ve açıkça söylenmeyeni (çıkarım, ima, mecaz, şaka) anlamakta zorlanır. Otizm spektrum bozukluğundan temel farkı, sınırlı ve yineleyici davranış, ilgi ve etkinliklerin bulunmamasıdır.",
            "epidemiology": "Yaygınlığı kesin olarak bilinmemektedir. Dil gelişiminin yeterli düzeye ulaşması gerektiğinden 4 yaşından önce nadiren konulur; hafif biçimleri ergenliğe kadar fark edilmeyebilir.",
            "etiology": "Ailede otizm spektrum bozukluğu, iletişim bozukluğu ya da özgül öğrenme bozukluğu öyküsü riski artırır. DEHB, dil bozukluğu ve öğrenme bozukluklarıyla sık birlikte görülür.",
            "prognosis": "Sosyal iletişim becerilerine yönelik dil-konuşma terapisi ve sosyal beceri eğitimleri yararlıdır. Pek çok çocukta zamanla iyileşme görülür; ancak erken dönemdeki güçlükler ilişkilerde ve akademik alanda kalıcı sorunlara yol açabilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Sözel ve Sözel Olmayan İletişimin Toplumsal Kullanımında Süregen Güçlük (4 alanın tümü)",
                "content": "Aşağıdaki alanların tümünde kendini gösteren güçlük:",
                "items": [
                    "1. İletişimi selamlaşma, bilgi paylaşma gibi toplumsal amaçlarla ve bağlama uygun biçimde kullanmada yetersizlik.",
                    "2. İletişimi bağlama ya da dinleyicinin gereksinimlerine göre ayarlayamama (örn. sınıfta ve oyun alanında, çocukla ve yetişkinle farklı konuşamama; aşırı resmi dilden kaçınamama).",
                    "3. Konuşma ve öykü anlatma kurallarına uymada güçlük (söz sırası, yanlış anlaşıldığında yeniden ifade etme, etkileşimi düzenleyen sözel ve sözel olmayan işaretleri kullanma).",
                    "4. Açıkça söylenmeyeni (çıkarımlar) ve düz anlamı dışındaki ya da belirsiz dili (deyimler, mizah, mecaz, bağlama göre değişen anlamlar) anlamada güçlük."
                ]
            },
            {
                "code": "Kriter B, C & D",
                "title": "İşlevsel Etki, Başlangıç ve Dışlama",
                "content": "Güçlükler etkili iletişim, toplumsal katılım, ilişkiler, akademik ya da mesleki başarıda işlevsel kısıtlılığa yol açar (B). Belirtiler erken gelişim döneminde başlar, ancak toplumsal iletişim talepleri kapasiteyi aşana dek tam olarak ortaya çıkmayabilir (C). Başka bir tıbbi/nörolojik duruma ya da sözcük yapısı ve dilbilgisindeki düşük becerilere bağlanamaz; otizm spektrum bozukluğu, zihinsel yetiyitimi, küresel gelişimsel gecikme veya başka bir ruhsal bozuklukla daha iyi açıklanamaz (D)."
            }
        ]
    },
    "unspecified_communication_disorder": {
        "id": "unspecified_communication_disorder",
        "nameTr": "Belirtilmemiş İletişim Bozukluğu",
        "nameEn": "Unspecified Communication Disorder",
        "clinicalDescription": {
            "overview": "İletişim bozukluğunun karakteristik belirtilerinin klinik açıdan belirgin sıkıntı ya da işlevsellikte bozulmaya yol açtığı, ancak iletişim bozuklukları ya da diğer nörogelişimsel bozukluklar sınıfındaki herhangi bir tanının ölçütlerini tam olarak karşılamadığı durumlarda kullanılır. Genellikle bilgi yetersiz olduğunda veya klinisyen tam ölçütlerin neden karşılanmadığını belirtmemeyi seçtiğinde konur.",
            "epidemiology": "Artık (rezidüel) bir kategori olduğundan ayrı yaygınlık verisi bulunmamaktadır.",
            "etiology": "Altta yatan nedenler dil bozukluğu, konuşma sesi bozukluğu, çocuklukta başlayan akıcılık bozukluğu ve toplumsal (pragmatik) iletişim bozukluğuyla benzerdir.",
            "prognosis": "Ayrıntılı dil-konuşma değerlendirmesi sonrasında tanı çoğu zaman özgül bir iletişim bozukluğuna dönüştürülür ya da tanı gerektirmediği anlaşılır; bu nedenle izlem ve yeniden değerlendirme önemlidir."
        },
        "criteriaList": [
            {
                "code": "Tanım",
                "title": "Ölçütleri Tam Karşılamayan İletişim Bozukluğu",
                "content": "İletişim bozukluğuna özgü belirtiler baskındır ve klinik açıdan belirgin sıkıntı ya da toplumsal, mesleki veya diğer önemli işlevsellik alanlarında bozulmaya yol açar; ancak iletişim bozukluklarından ya da nörogelişimsel bozukluklardan herhangi birinin ölçütleri tam olarak karşılanmaz."
            },
            {
                "code": "Not",
                "title": "Kullanım Biçimi",
                "content": "Klinisyenin ölçütlerin neden karşılanmadığını belirtmemeyi seçtiği ve özgül tanı koymak için yeterli bilginin bulunmadığı durumlarda kullanılır. DSM-5'te iletişim bozuklukları için ayrı bir 'belirlenmiş diğer' kategorisi yoktur."
            }
        ]
    },
    "stereotypic_movement_disorder": {
        "id": "stereotypic_movement_disorder",
        "nameTr": "Stereotipik Hareket Bozukluğu",
        "nameEn": "Stereotypic Movement Disorder",
        "clinicalDescription": {
            "overview": "Erken gelişim döneminde başlayan; el sallama, el çırpma, gövdeyi öne arkaya sallama, başı vurma, kendini ısırma ya da vurma gibi yineleyici, içten gelen bir zorlantıyla yapılıyormuş gibi görünen ve görünürde amacı olmayan motor davranışlarla tanımlanan bozukluktur. Davranışlar toplumsal, akademik ya da diğer etkinliklere engel olur ve kendine zarar vermeye yol açabilir. Tiklerden farklı olarak daha erken yaşta başlar, daha ritmik ve kalıplaşmıştır, uğraş ya da heyecan anlarında artar ve dikkat başka yöne çekildiğinde çoğu zaman durur.",
            "epidemiology": "Basit stereotipik hareketler (sallanma gibi) tipik gelişen küçük çocuklarda oldukça yaygındır ve çoğu zaman bozukluk düzeyine ulaşmaz. Kendine zarar veren ağır stereotipiler zihinsel yetiyitimi olan bireylerde, özellikle kurum bakımında yaşayanlarda daha sık görülür. Genellikle yaşamın ilk 3 yılında başlar.",
            "etiology": "Duyusal ve toplumsal uyaran yoksunluğu, zihinsel yetiyitimi ve bazı genetik sendromlar (örn. Lesch-Nyhan sendromu, Rett sendromu) ile ilişkilidir. Doğum öncesi alkol maruziyeti gibi çevresel etkenler de bildirilmektedir.",
            "prognosis": "Basit stereotipiler çoğu zaman yaşla azalır. Kendine zarar veren biçimlerde koruyucu önlemler, işlevsel davranış analizi, alışkanlığı tersine çevirme ve rekabet eden yanıt eğitimi gibi davranışçı yöntemler temel yaklaşımdır; altta yatan nörogelişimsel ve tıbbi durumlar ele alınmalıdır."
        },
        "criteriaList": [
            {
                "code": "Kriter A-D",
                "title": "Tanı Ölçütleri",
                "content": "Yineleyici, içten zorlanıyormuş gibi ve görünürde amaçsız motor davranış (A). Davranış toplumsal, akademik ya da diğer etkinlikleri bozar ve kendine zarar vermeye yol açabilir (B). Erken gelişim döneminde başlar (C). Bir maddenin fizyolojik etkilerine ya da nörolojik bir duruma bağlanamaz; başka bir nörogelişimsel ya da ruhsal bozuklukla (örn. trikotilomani, OKB) daha iyi açıklanamaz (D)."
            },
            {
                "code": "Belirleyiciler",
                "title": "Kendine Zarar Verme, Eşlik Eden Durum ve Şiddet",
                "content": "Kendine zarar verme davranışıyla ya da olmaksızın; bilinen bir genetik ya da tıbbi durum, nörogelişimsel bozukluk veya çevresel etkenle ilişkili olup olmadığı. Şiddet: hafif (duyusal uyaranla ya da dikkat başka yöne çekilerek kolayca bastırılabilir), orta (açık koruyucu önlemler ve davranış değişikliği gerekir), ağır (ciddi yaralanmayı önlemek için sürekli izlem ve koruyucu önlem gerekir). Otizm spektrum bozukluğunda stereotipiler ancak kendine zarar veriyorsa ya da tedavinin odağı olacak denli ağırsa ayrıca tanılanır."
            }
        ]
    },
    "chronic_motor_vocal_tic": {
        "id": "chronic_motor_vocal_tic",
        "nameTr": "Süregen (Kronik) Motor ya da Vokal Tik Bozukluğu",
        "nameEn": "Persistent (Chronic) Motor or Vocal Tic Disorder",
        "clinicalDescription": {
            "overview": "18 yaşından önce başlayan ve 1 yıldan uzun süren, tek ya da çok sayıda motor tik VEYA vokal tikin bulunduğu, ancak her iki tik türünün birlikte görülmediği tik bozukluğudur. Göz kırpma, yüz buruşturma, omuz silkme gibi motor tikler ya da boğaz temizleme, burun çekme, homurdanma gibi vokal tikler görülür. Tikler ani, hızlı, yineleyici ve ritmik olmayan hareket ya da seslerdir; sıklıkları zaman içinde artıp azalır ve çoğunlukla öncesinde bir 'dürtü' hissi (premonitör dürtü) bulunur.",
            "epidemiology": "Tourette bozukluğundan daha sık görülür; erkeklerde daha yaygındır. Başlangıç genellikle 4-6 yaşları arasındadır.",
            "etiology": "Kortiko-striato-talamo-kortikal devrelerde işlev bozukluğu ve dopaminerjik sistem aşırı duyarlılığı düşünülmektedir. Tourette bozukluğu ile aynı genetik yatkınlık spektrumunda yer alır; OKB ve DEHB ile birliktelik sıktır. Stres, yorgunluk ve heyecan tikleri artırır.",
            "prognosis": "Tikler genellikle 10-12 yaşlarında en yoğun düzeye ulaşır ve ergenlik sonrası çoğu kişide belirgin azalır. Psikoeğitim, Tikler İçin Kapsamlı Davranışçı Müdahale (CBIT) ve alışkanlığı tersine çevirme eğitimi ilk basamak yaklaşımlardır; ağır olgularda ilaç tedavisi eklenebilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A-E",
                "title": "Tanı Ölçütleri (Süre > 1 yıl, Başlangıç < 18 yaş)",
                "content": "Tek ya da çok sayıda motor tik veya vokal tik bulunur, ancak hastalık süresince ikisi birlikte bulunmaz (A). Tiklerin sıklığı artıp azalabilir, ancak ilk tikin başlangıcından bu yana 1 yıldan uzun süredir devam eder (B). Başlangıç 18 yaşından öncedir (C). Bir maddenin (örn. kokain) fizyolojik etkilerine ya da başka bir sağlık durumuna (örn. Huntington hastalığı, viral ensefalit sonrası) bağlanamaz (D). Tourette bozukluğu ölçütleri hiçbir zaman karşılanmamıştır (E)."
            },
            {
                "code": "Belirleyici",
                "title": "Tik Türü",
                "content": "Yalnızca motor tiklerle ya da yalnızca vokal tiklerle belirtilir. Hem motor hem vokal tikler 1 yıldan uzun süre bulunuyorsa tanı Tourette bozukluğudur; toplam süre 1 yıldan kısaysa geçici tik bozukluğu düşünülür."
            }
        ]
    },
    "provisional_tic_disorder": {
        "id": "provisional_tic_disorder",
        "nameTr": "Geçici Tik Bozukluğu",
        "nameEn": "Provisional Tic Disorder",
        "clinicalDescription": {
            "overview": "18 yaşından önce başlayan, tek ya da çok sayıda motor ve/veya vokal tikin bulunduğu ve ilk tikin başlangıcından bu yana 1 yıldan kısa süredir devam eden tik bozukluğudur. Çoğunlukla göz kırpma, yüz buruşturma gibi basit motor tiklerle başlar. Zaman ölçütü nedeniyle 'geçici' adını taşır: tikler 1 yılı aşarsa tanı süregen tik bozukluğu ya da Tourette bozukluğu olarak değiştirilir.",
            "epidemiology": "Okul çağı çocuklarında tikler oldukça yaygındır ve tik bozuklukları içinde en sık görülendir; erkek çocuklarda daha sıktır.",
            "etiology": "Diğer tik bozukluklarıyla ortak nörobiyolojik ve genetik temel; stres, yorgunluk, heyecan ve uyarıcı maddeler tikleri artırabilir.",
            "prognosis": "Çoğu çocukta tikler birkaç hafta ile birkaç ay içinde kendiliğinden geçer; bir kısmında süregen tik bozukluğuna ya da Tourette bozukluğuna ilerler. Ailenin psikoeğitimi ve tiklere aşırı dikkat çekilmemesi temel yaklaşımdır; işlevselliği bozan tiklerde davranışçı müdahaleler uygulanabilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A-C",
                "title": "Tik Varlığı, Süre (< 1 yıl) ve Başlangıç (< 18 yaş)",
                "content": "Tek ya da çok sayıda motor ve/veya vokal tik (A). Tikler ilk başlangıçtan bu yana 1 yıldan kısa süredir bulunmaktadır (B). Başlangıç 18 yaşından öncedir (C)."
            },
            {
                "code": "Kriter D & E",
                "title": "Dışlama Ölçütleri",
                "content": "Bir maddenin fizyolojik etkilerine ya da başka bir sağlık durumuna bağlanamaz (D). Tourette bozukluğu ya da süregen (kronik) motor veya vokal tik bozukluğu ölçütleri hiçbir zaman karşılanmamıştır (E)."
            }
        ]
    },
    "other_specified_neurodevelopmental": {
        "id": "other_specified_neurodevelopmental",
        "nameTr": "Belirlenmiş Diğer Bir Nörogelişimsel Bozukluk",
        "nameEn": "Other Specified Neurodevelopmental Disorder",
        "clinicalDescription": {
            "overview": "Bir nörogelişimsel bozukluğun karakteristik belirtilerinin işlevsellikte bozulmaya yol açtığı ancak bu sınıftaki herhangi bir bozukluğun ölçütlerini tam karşılamadığı, klinisyenin bunun nedenini belirtmeyi seçtiği durumlarda kullanılır (örn. 'doğum öncesi alkol maruziyetiyle ilişkili nörogelişimsel bozukluk'). DSM-5'in verdiği başlıca örnek, Doğum Öncesi Alkol Maruziyetiyle İlişkili Nörogelişimsel Bozukluktur (ND-PAE): rahim içinde alkole maruz kalma sonrasında ortaya çıkan, nörobilişsel işlevlerde, öz-düzenlemede ve uyumsal işlevsellikte yetersizliklerle giden tablo. Fetal Alkol Sendromu (FAS) bu spektrumun, tipik yüz bulguları (düz filtrum, ince üst dudak, kısa palpebral aralıklar), büyüme geriliği ve merkezi sinir sistemi anomalileriyle tanımlanan uç biçimidir; ancak ND-PAE tanısı için yüz dismorfolojisi gerekmez.",
            "epidemiology": "Fetal alkol spektrum bozukluklarının okul çağı çocuklarındaki yaygınlığı bazı Batı ülkeleri çalışmalarında %1-5 arasında tahmin edilmektedir; yaygın biçimde tanı almadığı düşünülmektedir.",
            "etiology": "Alkolün gelişmekte olan beyin üzerindeki doğrudan nörotoksik etkisi (nöron göçü ve sinaptogenezde bozulma). Gebelikte güvenli bir alkol miktarı tanımlanmamıştır; risk alınan miktar, süre ve gebelik dönemine göre değişir.",
            "prognosis": "Yaşam boyu süren bir durumdur. Erken tanı, özel eğitim, yürütücü işlev ve öz-düzenleme becerilerine yönelik müdahaleler, aile desteği ve yapılandırılmış çevre ikincil sorunları (okul başarısızlığı, madde kullanımı, adli sorunlar) azaltır. Eşlik eden DEHB sık görülür."
        },
        "criteriaList": [
            {
                "code": "Tanım",
                "title": "Belirlenmiş Diğer Kategorisinin Kullanımı",
                "content": "Nörogelişimsel bozukluk belirtileri klinik açıdan belirgin sıkıntı ya da işlevsellikte bozulmaya yol açar ancak bu sınıftaki herhangi bir bozukluğun ölçütleri tam karşılanmaz; klinisyen tanının yanına özgül nedeni yazar."
            },
            {
                "code": "Örnek: ND-PAE",
                "title": "Doğum Öncesi Alkol Maruziyetiyle İlişkili Nörogelişimsel Bozukluk (Önerilen ölçütler)",
                "content": "DSM-5 'Daha Fazla Araştırma Gerektiren Durumlar' bölümünde önerilen ölçütlerin özeti:",
                "items": [
                    "1. Gebelikte en az asgari düzeyin üzerinde alkol maruziyeti (öykü, kayıt ya da klinik gözlemle).",
                    "2. Nörobilişsel işlevlerde bozulma (genel zihinsel işlev, yürütücü işlev, öğrenme, bellek ya da görsel-uzamsal akıl yürütme).",
                    "3. Öz-düzenlemede bozulma (duygudurum/davranış düzenleme, dikkat ya da dürtü denetimi).",
                    "4. Uyumsal işlevsellikte en az iki alanda bozulma; bunlardan biri iletişim ya da toplumsal etkileşim alanı olmalıdır.",
                    "5. Başlangıcın çocuklukta olması, belirgin sıkıntı/işlev bozulması ve başka bir nedenle daha iyi açıklanamaması."
                ]
            }
        ]
    },
    "substance_induced_psychotic": {
        "id": "substance_induced_psychotic",
        "nameTr": "Maddenin/İlacın Yol Açtığı Psikotik Bozukluk",
        "nameEn": "Substance/Medication-Induced Psychotic Disorder",
        "clinicalDescription": {
            "overview": "Sanrı ve/veya varsanıların bir maddenin zehirlenmesi (intoksikasyonu) ya da yoksunluğu sırasında veya hemen sonrasında ya da bir ilaca maruziyet sonrasında ortaya çıktığı psikotik bozukluktur. Esrar (özellikle yüksek THC içerikli ürünler ve sentetik kannabinoidler), amfetamin/metamfetamin, kokain, halüsinojenler, alkol (özellikle yoksunluk ve ağır kullanım), sedatifler ve kortikosteroid, levodopa gibi ilaçlar en sık nedenlerdir. Kişinin varsanıların maddeye bağlı olduğunun farkında olduğu, gerçeği değerlendirmenin korunduğu durumlar bu tanıya değil madde intoksikasyonu/yoksunluğuna girer.",
            "epidemiology": "Yaygınlık kullanılan maddeye ve topluma göre büyük farklılık gösterir. Acil servis başvurularında ilk psikotik epizodların önemli bir bölümü madde kullanımıyla ilişkilidir.",
            "etiology": "Mezolimbik dopamin artışı (uyarıcılar), kannabinoid CB1 reseptör etkileri, NMDA reseptör antagonizması (fensiklidin, ketamin), serotonin 5-HT2A agonizması (halüsinojenler). Genetik psikoz yatkınlığı ve erken ergenlikte yoğun esrar kullanımı riski artırır.",
            "prognosis": "Madde kesildikten sonra belirtiler genellikle günler ile haftalar içinde düzelir. Ancak özellikle esrar ve amfetaminle ilişkili psikozlarda olguların önemli bir kısmı izlemde şizofreni ya da bipolar bozukluk tanısı alabilir; bu nedenle izlem ve madde kullanımı tedavisi gereklidir."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B",
                "title": "Psikotik Belirti ve Maddeyle Zamansal-Nedensel İlişki",
                "content": "Sanrı ve/veya varsanıların bulunması (A). Öykü, fizik muayene ya da laboratuvar bulgularında her ikisine dair kanıt: (1) belirtiler madde intoksikasyonu ya da yoksunluğu sırasında veya hemen sonrasında ya da bir ilaca maruziyet sonrasında gelişmiştir, (2) söz konusu madde bu belirtilere yol açabilecek niteliktedir (B)."
            },
            {
                "code": "Kriter C, D & E",
                "title": "Bağımsız Psikozun Dışlanması, Deliryum Dışlaması ve İşlev Bozulması",
                "content": "Tablo maddeye bağlı olmayan bir psikotik bozuklukla daha iyi açıklanamaz; bağımsız bozukluğu düşündüren durumlar: belirtilerin madde kullanımından önce başlaması, akut yoksunluk ya da ağır intoksikasyon bittikten sonra belirgin bir süre (örn. yaklaşık 1 ay) sürmesi ya da maddeyle ilişkisiz yineleyen epizod öyküsü (C). Yalnızca deliryum sırasında ortaya çıkmaz (D). Klinik açıdan belirgin sıkıntı ya da işlev bozulmasına yol açar (E). Başlangıç belirleyicisi: intoksikasyon sırasında, yoksunluk sırasında ya da ilaç kullanımı sonrasında."
            }
        ]
    },
    "psychotic_due_to_medical": {
        "id": "psychotic_due_to_medical",
        "nameTr": "Başka Bir Sağlık Durumuna Bağlı Psikotik Bozukluk",
        "nameEn": "Psychotic Disorder Due to Another Medical Condition",
        "clinicalDescription": {
            "overview": "Belirgin varsanı ya da sanrıların, bir tıbbi hastalığın doğrudan patofizyolojik sonucu olduğunun öykü, fizik muayene ve laboratuvar bulgularıyla gösterildiği psikotik bozukluktur. Geç yaşta (özellikle 35-40 yaş sonrası) ilk kez başlayan psikoz, aile öyküsünün olmaması, görsel, koku ya da dokunma varsanıları, bilinç ve bilişte dalgalanma ve nörolojik bulgular tıbbi bir nedeni düşündürmelidir.",
            "epidemiology": "Yaygınlık altta yatan hastalığa göre değişir; temporal lob epilepsisi, Huntington hastalığı ve bazı otoimmün ensefalitlerde psikotik belirtiler sıktır.",
            "etiology": "Nörolojik (temporal lob epilepsisi, beyin tümörleri, inme, multipl skleroz, Huntington ve Parkinson hastalığı, migren), endokrin (hiper/hipotiroidi, Cushing sendromu), metabolik (B12 eksikliği, hepatik ensefalopati, porfiri), enfeksiyöz (HIV, nörosifiliz, herpes ensefaliti) ve otoimmün (sistemik lupus eritematozus, anti-NMDA reseptör ensefaliti) nedenler.",
            "prognosis": "Seyir altta yatan hastalığın tedavisine bağlıdır; neden tedavi edildiğinde psikoz çoğu zaman düzelir. Belirtilerin denetimi için antipsikotikler gerekebilir ancak bu hastalar yan etkilere daha duyarlıdır."
        },
        "criteriaList": [
            {
                "code": "Kriter A-E",
                "title": "Tanı Ölçütleri",
                "content": "Belirgin varsanı ya da sanrılar (A). Öykü, muayene ya da laboratuvar bulgularında tablonun başka bir sağlık durumunun doğrudan patofizyolojik sonucu olduğuna dair kanıt (B). Başka bir ruhsal bozuklukla daha iyi açıklanamaz (C). Yalnızca deliryum sırasında ortaya çıkmaz (D). Klinik açıdan belirgin sıkıntı ya da işlev bozulmasına yol açar (E)."
            },
            {
                "code": "Belirleyici",
                "title": "Baskın Belirtiye Göre",
                "content": "Sanrılarla (sanrılar baskın) ya da varsanılarla (varsanılar baskın) belirtilir. Tanı adında ilgili sağlık durumu da yazılır (örn. 'temporal lob epilepsisine bağlı psikotik bozukluk, varsanılarla')."
            }
        ]
    },
    "catatonia_medical": {
        "id": "catatonia_medical",
        "nameTr": "Başka Bir Sağlık Durumuna Bağlı Katatoni",
        "nameEn": "Catatonic Disorder Due to Another Medical Condition",
        "clinicalDescription": {
            "overview": "Katatoni belirtilerinin (stupor, katalepsi, mumsu esneklik, mutizm, negativizm, postür alma, manyerizm, stereotipi, dış uyarandan etkilenmeyen ajitasyon, yüz buruşturma, ekolali, ekopraksi) bir tıbbi hastalığın doğrudan fizyolojik sonucu olarak ortaya çıktığı tablodur. Psikiyatrik bir bozukluğa eşlik eden katatoniden ayrımı için ayrıntılı tıbbi ve nörolojik inceleme gerekir.",
            "epidemiology": "Katatoninin tıbbi nedenlere bağlı olgu oranı, genel hastane ve yoğun bakım örneklemlerinde psikiyatri servislerine göre daha yüksektir; kesin oranlar çalışmalara göre değişir.",
            "etiology": "Nörolojik (ensefalit, özellikle anti-NMDA reseptör ensefaliti; beyin tümörleri, kafa travması, serebrovasküler hastalık, epileptik durumlar), metabolik (hepatik ensefalopati, hiperkalsemi, diyabetik ketoasidoz, homosistinüri) ve otoimmün (SLE) nedenler başlıcalarıdır. Antipsikotik kullanımıyla ilişkili nöroleptik malign sendrom ile ayrım önemlidir.",
            "prognosis": "Tedavinin temeli altta yatan hastalığın tedavisidir; katatoni belirtilerine benzodiazepinler ve dirençli olgularda EKT uygulanır. Hareketsizliğe bağlı tromboemboli, dehidratasyon, beslenme yetersizliği ve bası yaraları önlenmelidir; malign katatoni hayatı tehdit edebilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Katatoni Belirtileri (12 belirtiden en az 3'ü)",
                "content": "Klinik tabloya aşağıdakilerden üç ya da daha fazlası egemendir: stupor, katalepsi, mumsu esneklik, mutizm, negativizm, postür alma, manyerizm, stereotipi, dış uyarandan etkilenmeyen ajitasyon, yüz buruşturma, ekolali, ekopraksi."
            },
            {
                "code": "Kriter B-E",
                "title": "Tıbbi Neden Kanıtı ve Dışlamalar",
                "content": "Tablonun başka bir sağlık durumunun doğrudan patofizyolojik sonucu olduğuna dair kanıt (B); başka bir ruhsal bozuklukla (örn. manik epizod) daha iyi açıklanamaz (C); yalnızca deliryum sırasında ortaya çıkmaz (D); klinik açıdan belirgin sıkıntı ya da işlev bozulmasına yol açar (E)."
            }
        ]
    },
    "other_specified_schizophrenia_spectrum": {
        "id": "other_specified_schizophrenia_spectrum",
        "nameTr": "Belirlenmiş Diğer Bir Şizofreni Açılımı ve Diğer Psikotik Bozukluk",
        "nameEn": "Other Specified Schizophrenia Spectrum and Other Psychotic Disorder",
        "clinicalDescription": {
            "overview": "Şizofreni açılımı ve diğer psikotik bozukluklara özgü belirtilerin (sanrı, varsanı, dağınık konuşma ya da davranış vb.) klinik açıdan belirgin sıkıntı ya da işlevsellik kaybına yol açtığı, ancak bu gruptaki hiçbir bozukluğun ölçütlerinin tümüyle karşılanmadığı ve klinisyenin nedenini belirttiği durumlarda kullanılır (ör. \"belirlenmiş diğer psikotik bozukluk, süregen işitsel varsanılar\"). DSM-IV'teki Paylaşılmış Psikotik Bozukluk (folie à deux) DSM-5'te ayrı tanı olmaktan çıkarılmıştır: ikinci kişi sanrılı bozukluk ölçütlerini karşılıyorsa o tanı konur, karşılamıyorsa bu kategori kullanılır. DSM-5-TR Bölüm III'te önerilen Hafifletilmiş Psikoz Sendromu da klinik kullanımda bu kategoriyle kodlanır.",
            "epidemiology": "Kategori için ayrı bir yaygınlık verisi yoktur. Psikoz açısından yüksek riskli (prodromal) gençler ve tek bir kalıcı belirti (ör. yalnızca işitsel varsanı) gösteren kişiler klinik örneklemlerde azımsanmayacak bir grup oluşturur. Paylaşılmış sanrılar seyrek bildirilir; çoğunlukla toplumdan yalıtılmış, yakın ilişkideki kişilerde (kardeşler, eşler, ebeveyn-çocuk) görülür.",
            "etiology": "Nedenler örneğe göre değişir. Paylaşılmış sanrılarda baskın (birincil) kişinin sanrısı, toplumsal yalıtılmışlık ve ikincil kişinin bağımlı, edilgen ilişki örüntüsü belirleyicidir. Hafifletilmiş psikoz belirtilerinde şizofreniyle ortak genetik yatkınlık ile gelişimsel ve çevresel etkenler (esrar kullanımı, travma, kentsel yaşam) rol oynar.",
            "prognosis": "Gidiş örneğe bağlıdır. Paylaşılmış sanrılarda ikincil kişi baskın kişiden ayrıldığında sanrılar çoğu zaman hızla geriler; birincil kişi kendi tanısına göre tedavi edilir. Hafifletilmiş psikoz belirtileri olanların bir bölümü birkaç yıl içinde tam psikotik bozukluğa geçer, önemli bir bölümünde ise belirtiler geriler; düzenli izlem, psikososyal destek ve psikoza yönelik bilişsel davranışçı yaklaşımlar önerilir."
        },
        "criteriaList": [
            {
                "code": "Tanımlama",
                "title": "Belirlenmiş Diğer Bir Şizofreni Açılımı ve Diğer Psikotik Bozukluk",
                "content": "Şizofreni açılımı ve diğer psikotik bozukluklara özgü belirtilerin baskın olduğu ve klinik açıdan belirgin sıkıntıya ya da toplumsal, mesleki veya diğer önemli işlevsellik alanlarında bozulmaya yol açtığı, ancak bu tanı grubundaki hiçbir bozukluğun ölçütlerinin tümüyle karşılanmadığı durumlarda kullanılır. Klinisyen ölçütlerin neden karşılanmadığını belirtir; kayıtta kategori adından sonra neden yazılır."
            },
            {
                "code": "Örnekler",
                "title": "DSM-5-TR'de Verilen Örnek Tablolar",
                "content": "Bu kategoriyle belirtilebilecek tablolara örnekler:",
                "items": [
                    "1. Süregen işitsel varsanılar: başka hiçbir belirti olmaksızın süregen olarak bulunan işitsel varsanılar.",
                    "2. Duygudurum epizodlarıyla belirgin olarak örtüşen sanrılar: duygudurum epizodu olmayan dönemlerde de bulunan, ancak sürenin önemli bir bölümünde duygudurum epizoduyla örtüşen süregen sanrılar (sanrılı bozukluğun \"kısa duygudurum epizodları\" koşuluna uymayan tablo).",
                    "3. Hafifletilmiş psikoz sendromu: gerçeklik değerlendirmesinin görece korunduğu, eşik altı ve psikoz benzeri belirtiler.",
                    "4. Sanrılı bireyin partnerinde sanrısal belirtiler: yakın ilişkide baskın kişinin sanrısal içeriğinin, sanrılı bozukluk ölçütlerini tam karşılamayan ikinci kişide sanrısal inanca dönüşmesi (eski adıyla folie à deux)."
                ]
            },
            {
                "code": "Belirtilmemiş ile Farkı",
                "title": "Nedenin Belirtilmesi",
                "content": "Klinisyen ölçütlerin neden karşılanmadığını belirtmeyi seçmezse ya da bilgi yetersizse (ör. acil servis) 'Belirtilmemiş Şizofreni Açılımı ve Diğer Psikotik Bozukluk' kategorisi kullanılır."
            }
        ]
    },
    "substance_induced_bipolar": {
        "id": "substance_induced_bipolar",
        "nameTr": "Maddenin/İlacın Yol Açtığı Bipolar Bozukluk",
        "nameEn": "Substance/Medication-Induced Bipolar Disorder",
        "clinicalDescription": {
            "overview": "Kabarmış, taşkın ya da irritabl duygudurum ile anormal artmış etkinlik veya enerjiden oluşan belirgin ve süregen duygudurum bozukluğunun bir maddenin intoksikasyonu/yoksunluğu sırasında ya da hemen sonrasında veya bir ilaca maruziyet sonrasında ortaya çıktığı tablodur. Sık nedenler arasında kortikosteroidler, amfetamin ve kokain gibi uyarıcılar, levodopa ve dopamin agonistleri, bazı halüsinojenler ve antidepresanlar sayılabilir. Önemli bir istisna: antidepresan tedavisi (ilaç ya da EKT) sırasında ortaya çıkan ve tedavinin fizyolojik etkisinin ötesinde tam sendrom düzeyinde süren manik ya da hipomanik epizod, maddeye bağlı değil bipolar I ya da II tanısı için yeterli kanıt sayılır.",
            "epidemiology": "Kesin yaygınlık bilinmemektedir; yüksek doz kortikosteroid tedavisi alan hastalarda duygudurum belirtileri sık görülür.",
            "etiology": "Dopaminerjik ve noradrenerjik etkinliğin artışı, HPA ekseni ve glukokortikoid reseptör etkileri. Kişide altta yatan bipolar yatkınlık bulunabilir.",
            "prognosis": "Maddenin kesilmesi ya da dozunun azaltılmasıyla belirtiler genellikle düzelir; gerektiğinde kısa süreli duygudurum dengeleyici ya da antipsikotik kullanılır. Madde kesildikten sonra belirtilerin sürmesi bağımsız bir bipolar bozukluğu düşündürür."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B",
                "title": "Duygudurum Bozukluğu ve Maddeyle İlişki",
                "content": "Klinik tabloya egemen, kabarmış, taşkın ya da irritabl duygudurum (depresif duygudurum ya da ilgi kaybıyla birlikte veya olmaksızın) ve anormal artmış etkinlik ya da enerji ile giden belirgin ve süregen bir dönem (A). Öykü, muayene ya da laboratuvar bulgularında belirtilerin intoksikasyon/yoksunluk sırasında veya hemen sonrasında ya da ilaç maruziyeti sonrasında geliştiğine ve maddenin bu belirtilere yol açabileceğine dair kanıt (B)."
            },
            {
                "code": "Kriter C, D & E",
                "title": "Bağımsız Bipolar Bozukluğun Dışlanması",
                "content": "Maddeye bağlı olmayan bir bipolar bozuklukla daha iyi açıklanamaz; bağımsız bozukluğu düşündüren durumlar: belirtilerin madde kullanımından önce başlaması, akut yoksunluk ya da ağır intoksikasyon sona erdikten sonra belirgin süre (örn. yaklaşık 1 ay) devam etmesi ya da maddeyle ilişkisiz yineleyen epizod öyküsü (C). Yalnızca deliryum sırasında ortaya çıkmaz (D). Belirgin sıkıntı ya da işlev bozulmasına yol açar (E)."
            }
        ]
    },
    "bipolar_due_to_medical": {
        "id": "bipolar_due_to_medical",
        "nameTr": "Başka Bir Sağlık Durumuna Bağlı Bipolar Bozukluk",
        "nameEn": "Bipolar Disorder Due to Another Medical Condition",
        "clinicalDescription": {
            "overview": "Anormal kabarmış, taşkın ya da irritabl duygudurum ve artmış etkinlik ya da enerjinin bir tıbbi hastalığın doğrudan patofizyolojik sonucu olarak ortaya çıktığı tablodur ('ikincil mani'). İleri yaşta, kişisel ya da ailesel duygudurum bozukluğu öyküsü olmadan ilk kez ortaya çıkan mani, nörolojik bulgular ve bilişsel bozulma tıbbi bir nedeni düşündürmelidir.",
            "epidemiology": "Yaygınlık altta yatan hastalığa göre değişir; özellikle inme, travmatik beyin hasarı, multipl skleroz ve Cushing sendromu sonrasında bildirilmektedir.",
            "etiology": "Nörolojik (sağ hemisfer ağırlıklı inme, travmatik beyin hasarı, multipl skleroz, Huntington hastalığı, beyin tümörleri, frontal ve temporal lob lezyonları), endokrin (hipertiroidi, Cushing sendromu), enfeksiyöz (HIV, nörosifiliz) ve otoimmün nedenler.",
            "prognosis": "Altta yatan hastalığın tedavisi esastır; duygudurum belirtileri için duygudurum dengeleyiciler ya da antipsikotikler kullanılabilir. Seyir tıbbi tabloya bağlıdır."
        },
        "criteriaList": [
            {
                "code": "Kriter A-E",
                "title": "Tanı Ölçütleri",
                "content": "Klinik tabloya egemen, anormal kabarmış, taşkın ya da irritabl duygudurum ve anormal artmış etkinlik ya da enerji ile giden belirgin ve süregen bir dönem (A). Tablonun başka bir sağlık durumunun doğrudan patofizyolojik sonucu olduğuna dair kanıt (B). Başka bir ruhsal bozuklukla daha iyi açıklanamaz (C). Yalnızca deliryum sırasında ortaya çıkmaz (D). Belirgin sıkıntı ya da işlev bozulmasına yol açar, kendine/başkalarına zararı önlemek için yatış gerektirir ya da psikotik özellikler vardır (E)."
            },
            {
                "code": "Belirleyiciler",
                "title": "Tablonun Niteliği",
                "content": "Manik özelliklerle (manik ya da hipomanik epizod ölçütlerinin tamamı karşılanmıyor), manik ya da hipomanik benzeri epizodla (tıbbi neden ölçütü dışındaki tüm ölçütler karşılanıyor) veya karışık özelliklerle (depresif belirtiler de var ancak baskın değil) belirtilir."
            }
        ]
    },
    "other_specified_bipolar": {
        "id": "other_specified_bipolar",
        "nameTr": "Belirlenmiş Diğer Bir Bipolar ve İlişkili Bozukluk",
        "nameEn": "Other Specified Bipolar Disorder",
        "clinicalDescription": {
            "overview": "Bipolar ve ilişkili bozukluklara özgü belirtilerin belirgin sıkıntı ya da işlev bozulmasına yol açtığı, ancak bu sınıftaki tanılardan hiçbirinin ölçütlerini tam karşılamadığı ve klinisyenin bunun nedenini belirttiği durumlarda kullanılır. En sık örneği, majör depresif epizodlarla birlikte yalnızca 2-3 gün süren kısa hipomanik dönemlerdir. Bu tablolar tek kutuplu depresyon gibi görünse de bipolar spektrumda yer aldığından antidepresan tedavi kararında önemlidir.",
            "epidemiology": "Toplum çalışmalarında eşik altı bipolar tabloların tam ölçütlü bipolar bozukluklardan daha yaygın olduğu bildirilmektedir; kesin oranlar kullanılan tanıma göre değişir.",
            "etiology": "Bipolar bozuklukla ortak genetik ve nörobiyolojik yatkınlık; aile öyküsünde bipolar bozukluk sık olarak bulunur.",
            "prognosis": "Bir kısmı zaman içinde bipolar I ya da II bozukluğa ilerler; bu nedenle düzenli izlem, uyku ve sosyal ritim düzenlemesi, antidepresan kullanımında dikkat önerilir."
        },
        "criteriaList": [
            {
                "code": "Örnekler",
                "title": "DSM-5'te Verilen Başlıca Örnekler",
                "content": "Klinisyen 'belirlenmiş diğer' tanısının yanına özgül nedeni yazar:",
                "items": [
                    "1. Kısa süreli hipomanik epizodlar (2-3 gün) ve majör depresif epizodlar: hipomani ölçütlerini karşılayan ancak 4 günden kısa süren dönemler ile en az bir majör depresif epizod öyküsü.",
                    "2. Yetersiz belirtili hipomanik epizodlar ve majör depresif epizodlar: en az 4 gün süren ancak hipomani belirti sayısını karşılamayan dönemler ile majör depresif epizod öyküsü.",
                    "3. Daha önce majör depresif epizod olmaksızın hipomanik epizod.",
                    "4. Kısa süreli siklotimi: hipomanik ve depresif belirtilerin siklotimik bozukluk için gereken süreden (yetişkinde 24 ay, çocuk ve ergende 12 ay) kısa sürdüğü, ancak ölçütleri başka yönden karşıladığı tablolar."
                ]
            },
            {
                "code": "Not",
                "title": "Dışlamalar",
                "content": "Bu örneklerde kişinin tablosu hiçbir zaman majör depresif, manik ya da hipomanik epizod ölçütlerini daha uygun bir tanıyı gerektirecek biçimde karşılamamış olmalıdır (örn. kısa hipomani örneklerinde tam hipomanik epizod öyküsü yoktur) ve belirtiler bir psikotik bozuklukla, maddeyle ya da tıbbi durumla daha iyi açıklanmamalıdır."
            }
        ]
    },
    "unspecified_bipolar": {
        "id": "unspecified_bipolar",
        "nameTr": "Belirtilmemiş Bipolar ve İlişkili Bozukluk",
        "nameEn": "Unspecified Bipolar Disorder",
        "clinicalDescription": {
            "overview": "Bipolar ve ilişkili bozukluklara özgü belirtilerin belirgin sıkıntı ya da işlev bozulmasına yol açtığı, ancak bu sınıftaki tanılardan hiçbirinin ölçütlerinin tam karşılanmadığı ve klinisyenin nedenini belirtmemeyi seçtiği durumlarda kullanılır. Özellikle daha özgül bir tanı koymak için yeterli bilginin bulunmadığı acil servis koşullarında sık kullanılır.",
            "epidemiology": "Artık (rezidüel) bir kategori olduğundan ayrı yaygınlık verisi yoktur.",
            "etiology": "Bipolar ve ilişkili bozukluklarla ortak etiyolojik etkenler. Madde ve tıbbi nedenler değerlendirilmeli; bilgi toplandıkça tanı gözden geçirilmelidir.",
            "prognosis": "Ek öykü, yakın bilgisi ve izlemle tanı çoğu zaman özgül bir bipolar bozukluğa ya da başka bir tanıya dönüştürülür."
        },
        "criteriaList": [
            {
                "code": "Tanım",
                "title": "Ölçütleri Tam Karşılamayan Bipolar Tablo",
                "content": "Bipolar ve ilişkili bozukluk belirtileri baskındır, klinik açıdan belirgin sıkıntıya ya da işlevsellikte bozulmaya yol açar; ancak bu tanı sınıfındaki herhangi bir bozukluğun ölçütleri tam karşılanmaz."
            },
            {
                "code": "Not",
                "title": "Belirlenmiş Diğer Kategorisinden Farkı",
                "content": "Klinisyen ölçütlerin neden karşılanmadığını belirtmez; özgül bir neden yazılabiliyorsa 'belirlenmiş diğer bipolar ve ilişkili bozukluk' tercih edilir."
            }
        ]
    },
    "substance_induced_depressive": {
        "id": "substance_induced_depressive",
        "nameTr": "Maddenin/İlacın Yol Açtığı Depresif Bozukluk",
        "nameEn": "Substance/Medication-Induced Depressive Disorder",
        "clinicalDescription": {
            "overview": "Çökkün duygudurum ya da tüm veya hemen tüm etkinliklere karşı belirgin ilgi/zevk kaybıyla giden belirgin ve süregen duygudurum bozukluğunun bir maddenin intoksikasyonu ya da yoksunluğu sırasında veya hemen sonrasında ya da bir ilaca maruziyet sonrasında ortaya çıktığı tablodur. Alkol, opioidler, sedatif-hipnotikler, uyarıcıların yoksunluğu ('kokain/amfetamin çöküşü') ve kortikosteroid, interferon, bazı antikonvülzanlar ve hormonal ilaçlar gibi tedaviler sık nedenlerdir.",
            "epidemiology": "Madde kullanım bozukluğu olan kişilerde sık görülür; özellikle alkol kullanım bozukluğunda depresif belirtilerin önemli bir bölümü maddeye bağlıdır.",
            "etiology": "Maddenin monoaminerjik sistemler, HPA ekseni ve ödül devreleri üzerindeki akut ve süregen etkileri; yoksunlukta dopaminerjik etkinliğin düşmesi.",
            "prognosis": "Maddenin kesilmesiyle belirtiler çoğunlukla birkaç hafta içinde belirgin olarak düzelir; bu nedenle mümkünse antidepresan başlamadan önce bir süre ayıklık döneminde izlem önerilir. İntihar riski yüksek olabilir ve mutlaka değerlendirilmelidir. Belirtiler ayıklıkta sürerse bağımsız depresif bozukluk düşünülür."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B",
                "title": "Depresif Duygudurum ve Maddeyle İlişki",
                "content": "Klinik tabloya egemen, çökkün duygudurum ya da tüm/hemen tüm etkinliklerde belirgin ilgi veya zevk kaybıyla giden belirgin ve süregen duygudurum bozukluğu (A). Öykü, muayene ya da laboratuvar bulgularında belirtilerin intoksikasyon/yoksunluk sırasında veya hemen sonrasında ya da ilaç maruziyeti sonrasında geliştiğine ve maddenin bu belirtilere yol açabileceğine dair kanıt (B)."
            },
            {
                "code": "Kriter C, D & E",
                "title": "Bağımsız Depresif Bozukluğun Dışlanması",
                "content": "Maddeye bağlı olmayan bir depresif bozuklukla daha iyi açıklanamaz; bağımsız bozukluğu düşündüren durumlar: belirtilerin madde kullanımından önce başlaması, akut yoksunluk ya da ağır intoksikasyon sona erdikten sonra belirgin süre (örn. yaklaşık 1 ay) devam etmesi ya da maddeyle ilişkisiz yineleyen epizod öyküsü (C). Yalnızca deliryum sırasında ortaya çıkmaz (D). Belirgin sıkıntı ya da işlev bozulmasına yol açar (E)."
            }
        ]
    },
    "depressive_due_to_medical": {
        "id": "depressive_due_to_medical",
        "nameTr": "Başka Bir Sağlık Durumuna Bağlı Depresif Bozukluk",
        "nameEn": "Depressive Disorder Due to Another Medical Condition",
        "clinicalDescription": {
            "overview": "Çökkün duygudurum ya da belirgin ilgi/zevk kaybının bir tıbbi hastalığın doğrudan patofizyolojik sonucu olarak ortaya çıktığı tablodur. Burada belirleyici olan, depresyonun hastalığa verilen psikolojik bir tepki olmaması, hastalığın beyin işlevi üzerindeki doğrudan etkisiyle açıklanmasıdır. Ciddi bir hastalık tanısının yarattığı stres sonrası gelişen tepki ise çoğu zaman uyum bozukluğu ya da majör depresif bozukluk olarak değerlendirilir.",
            "epidemiology": "İnme, Parkinson hastalığı, Huntington hastalığı, travmatik beyin hasarı ve hipotiroidi gibi durumlarda depresif belirtiler genel topluma göre belirgin biçimde daha sıktır.",
            "etiology": "Nörolojik (inme, Parkinson, Huntington, multipl skleroz, travmatik beyin hasarı), endokrin (hipotiroidi, Cushing sendromu, Addison hastalığı), metabolik (B12 eksikliği), enfeksiyöz ve otoimmün hastalıklar ile bazı kanserler (örn. pankreas kanseri) başlıca nedenlerdir. Ortak mekanizmalar arasında monoaminerjik devrelerin hasarı, inflamatuvar sitokinler ve hormonal dengesizlikler sayılabilir.",
            "prognosis": "Altta yatan hastalığın tedavisi (örn. tiroid hormon replasmanı) belirtileri düzeltebilir. Kalıcı nörolojik hastalıklarda antidepresan tedavi ve psikoterapi gerekir; depresyonun tedavisi tıbbi hastalığın seyrini ve rehabilitasyonu da olumlu etkiler."
        },
        "criteriaList": [
            {
                "code": "Kriter A-E",
                "title": "Tanı Ölçütleri",
                "content": "Klinik tabloya egemen, çökkün duygudurum ya da tüm/hemen tüm etkinliklerde belirgin ilgi veya zevk kaybıyla giden belirgin ve süregen bir dönem (A). Tablonun başka bir sağlık durumunun doğrudan patofizyolojik sonucu olduğuna dair kanıt (B). Başka bir ruhsal bozuklukla (örn. stres etkeninin ciddi bir tıbbi hastalık olduğu çökkün duygudurumlu uyum bozukluğu) daha iyi açıklanamaz (C). Yalnızca deliryum sırasında ortaya çıkmaz (D). Belirgin sıkıntı ya da işlev bozulmasına yol açar (E)."
            },
            {
                "code": "Belirleyiciler",
                "title": "Tablonun Niteliği",
                "content": "Depresif özelliklerle (majör depresif epizod ölçütleri tam karşılanmıyor), majör depresif benzeri epizodla (tıbbi neden dışlaması dışında tüm epizod ölçütleri karşılanıyor) ya da karışık özelliklerle (manik/hipomanik belirtiler de var ancak baskın değil) belirtilir."
            }
        ]
    },
    "other_specified_depressive": {
        "id": "other_specified_depressive",
        "nameTr": "Belirlenmiş Diğer Bir Depresif Bozukluk",
        "nameEn": "Other Specified Depressive Disorder",
        "clinicalDescription": {
            "overview": "Depresif bozukluklara özgü belirtilerin klinik açıdan belirgin sıkıntı ya da işlevsellik kaybına yol açtığı, ancak bu gruptaki hiçbir bozukluğun ölçütlerinin tümüyle karşılanmadığı ve klinisyenin nedenini belirttiği durumlarda kullanılır. DSM-5-TR'nin verdiği örnekler arasında yineleyen kısa depresyon, kısa süreli depresif epizod (4-13 gün) ve yetersiz belirtili depresif epizod bulunur. Bu tablolar tek başına ayrı tanı değildir; kayıtta kategori adından sonra örnek belirtilir (ör. \"belirlenmiş diğer depresif bozukluk, yineleyen kısa depresyon\").",
            "epidemiology": "Kategori için ayrı bir yaygınlık verisi yoktur. Eşik altı depresif tablolar toplumda tam ölçütlü majör depresif bozukluktan daha sık görülür ve birinci basamakta önemli bir başvuru nedenidir.",
            "etiology": "Majör depresif bozuklukla ortak biyolojik, psikolojik ve toplumsal etkenler (kalıtsal yatkınlık, stres, olumsuz bilişsel şemalar, kişilerarası sorunlar) düşünülür. Ayırıcı tanıda bipolar bozukluklar, siklotimi, adet öncesi disforik bozukluk, uyum bozukluğu ve sınırda kişilik bozukluğundaki duygusal dalgalanmalar değerlendirilmelidir.",
            "prognosis": "Eşik altı depresif tablolar ileride majör depresif epizod gelişimi için risk taşır; işlev kaybı ve intihar düşünceleriyle ilişkili olabilir. Psikoeğitim, psikoterapi (bilişsel davranışçı terapi, kişilerarası terapi, davranışsal aktivasyon) ve yakın izlem önerilir; ilaç tedavisi belirti yükü ve öyküye göre değerlendirilir."
        },
        "criteriaList": [
            {
                "code": "Tanımlama",
                "title": "Belirlenmiş Diğer Bir Depresif Bozukluk",
                "content": "Depresif bozukluklara özgü belirtilerin baskın olduğu ve klinik açıdan belirgin sıkıntıya ya da toplumsal, mesleki veya diğer önemli işlevsellik alanlarında bozulmaya yol açtığı, ancak bu tanı grubundaki hiçbir bozukluğun ölçütlerinin tümüyle karşılanmadığı durumlarda kullanılır. Klinisyen ölçütlerin neden karşılanmadığını belirtir; kayıtta kategori adından sonra neden yazılır."
            },
            {
                "code": "Örnekler",
                "title": "DSM-5-TR'de Verilen Örnek Tablolar",
                "content": "Bu kategoriyle belirtilebilecek tablolara örnekler:",
                "items": [
                    "1. Yineleyen kısa depresyon: çökkün duygudurum ve en az dört diğer depresif belirtinin 2-13 gün sürdüğü dönemlerin, en az ardışık 12 ay boyunca ayda en az bir kez görülmesi (adet döngüsüyle ilişkisiz); kişi başka bir depresif ya da bipolar bozukluğun ölçütlerini hiç karşılamamıştır ve şu anda psikotik bozukluk ölçütlerini karşılamamaktadır.",
                    "2. Kısa süreli depresif epizod (4-13 gün): çökkün duygudurum ve diğer sekiz majör depresif epizod belirtisinden en az dördünün, belirgin sıkıntı ya da işlev bozulmasıyla birlikte en az 4 gün ancak 14 günden kısa sürmesi; tablo başka bir depresif ya da bipolar bozukluğu ve yineleyen kısa depresyon ölçütlerini karşılamaz.",
                    "3. Yetersiz belirtili depresif epizod: çökkün duygudurum ve diğer sekiz majör depresif epizod belirtisinden en az birinin, en az 2 hafta boyunca belirgin sıkıntı ya da işlev bozulmasıyla bulunması; başka bir depresif ya da bipolar bozukluğun ölçütleri karşılanmaz."
                ]
            },
            {
                "code": "Belirtilmemiş ile Farkı",
                "title": "Nedenin Belirtilmesi",
                "content": "Klinisyen ölçütlerin neden karşılanmadığını belirtmeyi seçmezse ya da bilgi yetersizse (ör. acil servis) 'Belirtilmemiş Depresif Bozukluk' kategorisi kullanılır."
            }
        ]
    },
    "substance_induced_anxiety": {
        "id": "substance_induced_anxiety",
        "nameTr": "Maddenin/İlacın Yol Açtığı Anksiyete Bozukluğu",
        "nameEn": "Substance/Medication-Induced Anxiety Disorder",
        "clinicalDescription": {
            "overview": "Panik atakların ya da kaygının klinik tabloya egemen olduğu ve bunun bir maddenin intoksikasyonu veya yoksunluğu sırasında ya da hemen sonrasında veya bir ilaca maruziyet sonrasında ortaya çıktığı anksiyete bozukluğudur. Kafein, uyarıcılar (amfetamin, kokain), esrar ve halüsinojenler intoksikasyonla; alkol, benzodiazepin ve diğer sedatiflerin bırakılması yoksunlukla kaygıya yol açabilir. İlaçlar arasında bronkodilatörler, kortikosteroidler, tiroid hormonu, dekonjestanlar ve bazı antidepresanların başlangıç dönemi sayılabilir.",
            "epidemiology": "Genel toplumda nadir bir tanıdır; ancak klinik örneklemlerde, özellikle madde kullanım bozukluğu olanlarda daha sık görülür.",
            "etiology": "Noradrenerjik ve glutamaterjik etkinlik artışı, adenozin reseptör blokajı (kafein), yoksunlukta GABA-erjik ketlenmenin azalması.",
            "prognosis": "Maddenin azaltılması ya da kesilmesiyle belirtiler genellikle düzelir. Benzodiazepin ya da alkol yoksunluğu tıbbi açıdan tehlikeli olabileceğinden kontrollü detoksifikasyon gerekir. Ayıklıkta süren kaygı bağımsız bir anksiyete bozukluğunu düşündürür."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B",
                "title": "Kaygı/Panik ve Maddeyle İlişki",
                "content": "Panik ataklar ya da kaygı klinik tabloya egemendir (A). Öykü, muayene ya da laboratuvar bulgularında belirtilerin intoksikasyon/yoksunluk sırasında veya hemen sonrasında ya da ilaç maruziyeti sonrasında geliştiğine ve maddenin bu belirtilere yol açabileceğine dair kanıt vardır (B)."
            },
            {
                "code": "Kriter C, D & E",
                "title": "Bağımsız Anksiyete Bozukluğunun Dışlanması",
                "content": "Maddeye bağlı olmayan bir anksiyete bozukluğuyla daha iyi açıklanamaz (belirtilerin madde kullanımından önce başlaması ya da akut yoksunluk/ağır intoksikasyon sonrasında belirgin süre, örn. yaklaşık 1 ay, sürmesi bağımsız bozukluğu düşündürür) (C). Yalnızca deliryum sırasında ortaya çıkmaz (D). Belirgin sıkıntı ya da işlev bozulmasına yol açar (E). Belirtiler olağan intoksikasyon/yoksunluk tablosunu aşıp klinik ilgi gerektirecek denli ağırsa bu tanı konur."
            }
        ]
    },
    "anxiety_due_to_medical": {
        "id": "anxiety_due_to_medical",
        "nameTr": "Başka Bir Sağlık Durumuna Bağlı Anksiyete Bozukluğu",
        "nameEn": "Anxiety Disorder Due to Another Medical Condition",
        "clinicalDescription": {
            "overview": "Klinik tabloya egemen olan kaygı ya da panik atakların bir tıbbi hastalığın doğrudan patofizyolojik sonucu olduğu anksiyete bozukluğudur. Hastalık tanısının yarattığı psikolojik kaygıdan farklı olarak, kaygı hastalığın vücut üzerindeki doğrudan etkisiyle açıklanır. Geç yaşta (ör. 35 yaşından sonra) başlayan ilk kaygı ya da panik belirtileri, kişisel/ailesel öykünün olmaması, kaçınma davranışının belirgin olmaması ve tıbbi bulgular tıbbi bir nedeni düşündürmelidir.",
            "epidemiology": "Yaygınlık altta yatan hastalığa göre değişir; tiroid, kalp ve solunum hastalıklarında kaygı belirtileri sıktır.",
            "etiology": "Endokrin (hipertiroidi, feokromositoma, hipoglisemi, hiperkortizolizm), kalp-damar (aritmiler, kalp yetmezliği, pulmoner emboli), solunum (KOAH, astım, pnömoni), metabolik (B12 eksikliği, porfiri) ve nörolojik (tümörler, vestibüler bozukluk, ensefalit, nöbet bozuklukları) nedenler.",
            "prognosis": "Altta yatan hastalığın tedavisi kaygıyı belirgin biçimde azaltır (örn. hipertiroidinin tedavisi, feokromositomanın cerrahi tedavisi). Kalıcı tıbbi durumlarda kaygıya yönelik psikoterapi ve uygun ilaç tedavisi eklenir."
        },
        "criteriaList": [
            {
                "code": "Kriter A-E",
                "title": "Tanı Ölçütleri",
                "content": "Panik ataklar ya da kaygı klinik tabloya egemendir (A). Tablonun başka bir sağlık durumunun doğrudan patofizyolojik sonucu olduğuna dair kanıt vardır (B). Başka bir ruhsal bozuklukla daha iyi açıklanamaz (C). Yalnızca deliryum sırasında ortaya çıkmaz (D). Belirgin sıkıntı ya da işlev bozulmasına yol açar (E)."
            },
            {
                "code": "Ayırıcı Tanı",
                "title": "Hastalığa Verilen Psikolojik Tepkiden Ayrım",
                "content": "Ciddi bir tıbbi hastalık tanısına verilen kaygı tepkisi bu tanıya değil, uyum bozukluğuna (kaygı ile) ya da başka bir anksiyete bozukluğuna işaret eder. Hastalık kaygısı bozukluğunda ise kaygının odağı hastalığın kendisidir; doğrudan fizyolojik bir neden yoktur."
            }
        ]
    },
    "ocd_due_to_medical": {
        "id": "ocd_due_to_medical",
        "nameTr": "Başka Bir Sağlık Durumuna Bağlı Obsesif-Kompulsif ve İlişkili Bozukluk",
        "nameEn": "Obsessive-Compulsive and Related Disorder Due to Another Medical Condition",
        "clinicalDescription": {
            "overview": "Obsesyonların, kompulsiyonların, dış görünümle uğraşların, biriktirmenin, deri ya da saç yolmanın veya bedene yönelik diğer yineleyici davranışların klinik tabloda öne çıktığı ve öykü, fizik muayene ya da laboratuvar bulgularıyla bunların başka bir sağlık durumunun doğrudan patofizyolojik sonucu olduğunun gösterildiği durumdur. Bazal gangliyonları etkileyen durumlar (ör. Sydenham koresi, inme, ensefalit, travmatik beyin hasarı, frontotemporal dejenerasyon) başlıca örneklerdir. Streptokok enfeksiyonu sonrası ani başlayan OKB ve tiklerle tanımlanan PANDAS/PANS tablosu, tıbbi neden kanıtlandığında bu kategoriyle kodlanır; ancak PANDAS'ın ayrı bir hastalık olarak geçerliliği ve tedavisi tartışmalıdır.",
            "epidemiology": "Ayrı bir yaygınlık verisi yoktur. Sydenham koresi olan çocukların önemli bir bölümünde obsesif-kompulsif belirtiler bildirilmiştir; PANDAS/PANS sıklığı tanım ölçütlerindeki farklılıklar nedeniyle belirsizdir.",
            "etiology": "Kortiko-striato-talamo-kortikal devreleri etkileyen yapısal, enfeksiyöz, otoimmün ya da dejeneratif süreçler sorumlu tutulur. Otoimmün varsayımda streptokoka karşı oluşan antikorların bazal gangliyonlarla çapraz tepkimeye girdiği öne sürülür.",
            "prognosis": "Gidiş altta yatan sağlık durumuna bağlıdır; tıbbi neden tedavi edildiğinde belirtiler azalabilir. Belirtilere yönelik maruz bırakma ve tepki önleme ile SSRI kullanılabilir; enfeksiyon ya da bağışıklık tedavileri ilgili uzmanlık alanının kararıyla planlanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Baskın Obsesif-Kompulsif ve İlişkili Belirtiler",
                "content": "Klinik tabloda obsesyonlar, kompulsiyonlar, dış görünümle uğraşlar, biriktirme, deri yolma, saç yolma, bedene yönelik diğer yineleyici davranışlar ya da obsesif-kompulsif ve ilişkili bozukluğa özgü diğer belirtiler öne çıkar."
            },
            {
                "code": "Kriter B",
                "title": "Tıbbi Nedenin Kanıtı",
                "content": "Öykü, fizik muayene ya da laboratuvar bulgularından, bozukluğun başka bir sağlık durumunun doğrudan patofizyolojik sonucu olduğuna ilişkin kanıt vardır."
            },
            {
                "code": "Kriter C-E",
                "title": "Dışlamalar ve Klinik Önem",
                "content": "Bozukluk başka bir ruhsal bozuklukla daha iyi açıklanamaz (C); yalnızca deliryum sırasında ortaya çıkmaz (D); klinik açıdan belirgin sıkıntıya ya da toplumsal, mesleki veya diğer önemli alanlarda işlevsellik kaybına yol açar (E)."
            },
            {
                "code": "Belirleyiciler",
                "title": "Baskın Belirti Türü",
                "content": "Obsesif-kompulsif bozukluk benzeri belirtilerle; dış görünümle uğraşlarla; biriktirme belirtileriyle; saç yolma belirtileriyle; deri yolma belirtileriyle."
            }
        ]
    },
    "ptsd_preschool": {
        "id": "ptsd_preschool",
        "nameTr": "6 Yaş ve Altı Çocuklarda Travma Sonrası Stres Bozukluğu",
        "nameEn": "PTSD for Children 6 Years and Younger",
        "clinicalDescription": {
            "overview": "Küçük çocukların gelişim düzeyine uyarlanmış TSSB ölçütleridir. Küçük çocuklar iç yaşantılarını sözel olarak anlatamadığından ölçütler daha davranışsal ve gözlemlenebilir belirtilere dayanır ve gereken belirti sayısı daha azdır. Yeniden yaşantılama çoğu zaman travma temalı tekrarlayıcı oyunla (travmatik oyun) ortaya çıkar; anılar her zaman sıkıntılı görünmeyebilir, kabusların içeriği travmayla açıkça ilişkili olmayabilir. Kaçınma ve olumsuz bilişler tek bir ölçütte birleştirilmiştir. Öfke nöbetleri, yapışkanlık, kazanılmış becerilerde gerileme (örn. tuvalet eğitimi, konuşma) sık görülür.",
            "epidemiology": "Travmaya maruz kalan okul öncesi çocuklarda yetişkin ölçütleri TSSB'yi olduğundan az saptar; gelişime uyarlanmış ölçütlerle daha fazla çocuk tanı alır.",
            "etiology": "Travmanın türü ve şiddeti, bakım verenin travmaya verdiği tepki ve kendi ruh sağlığı, bağlanma güvenliği ve aile içi şiddet küçük çocuklarda en önemli belirleyicilerdir.",
            "prognosis": "Ebeveyn katılımı tedavinin merkezindedir: Çocuk-Ebeveyn Psikoterapisi (CPP) ve Travma Odaklı BDT'nin küçük yaşlara uyarlanmış biçimleri etkilidir. Tedavi edilmezse belirtiler süregenleşebilir ve gelişimi olumsuz etkileyebilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B",
                "title": "Travma Maruziyeti ve Yeniden Yaşantılama (En az 1)",
                "content": "Gerçek ya da ölüm tehdidi, ağır yaralanma veya cinsel şiddete doğrudan maruz kalma, başkasının (özellikle birincil bakım verenlerin) başına geldiğine yüz yüze tanık olma ya da bir ebeveynin/bakım verenin başına geldiğini öğrenme; yalnızca elektronik medya ve görüntülerle tanık olma bu kapsama girmez (A). Yeniden yaşantılama belirtilerinden en az biri: istenmeden gelen anılar (oyunda yeniden canlandırma olarak görülebilir), sıkıntılı rüyalar, dissosiyatif tepkiler, hatırlatıcılarla yoğun psikolojik sıkıntı ya da belirgin fizyolojik tepkiler (B)."
            },
            {
                "code": "Kriter C & D",
                "title": "Kaçınma veya Olumsuz Değişiklikler (En az 1) ve Uyarılmışlık (En az 2)",
                "content": "Kaçınma ya da biliş/duygudurumda olumsuz değişiklik belirtilerinden en az biri: hatırlatıcı etkinlik, yer ve nesnelerden kaçınma; hatırlatıcı kişi, konuşma ve durumlardan kaçınma; olumsuz duygu durumlarında (korku, suçluluk, üzüntü, utanç, kafa karışıklığı) belirgin artış; oyunun kısıtlanması dahil ilgi azalması; toplumsal geri çekilme; olumlu duygu ifadesinde süregen azalma (C). Uyarılmışlık belirtilerinden en az ikisi: öfke patlamaları/ağır öfke nöbetleri dahil irritabl davranış, aşırı tetikte olma, abartılı irkilme, odaklanma güçlüğü, uyku bozukluğu (D)."
            },
            {
                "code": "Kriter E-G",
                "title": "Süre, İşlevsellik ve Dışlama",
                "content": "Belirtiler 1 aydan uzun sürer (E); ebeveynler, kardeşler, yaşıtlar ya da diğer bakım verenlerle ilişkilerde veya okul davranışında belirgin sıkıntı ya da bozulmaya yol açar (F); madde ya da tıbbi duruma bağlanamaz (G). 'Dissosiyatif belirtilerle' ve 'gecikmeli başlangıçlı' belirleyicileri kullanılabilir."
            }
        ]
    },
    "other_specified_dissociative": {
        "id": "other_specified_dissociative",
        "nameTr": "Belirlenmiş Diğer Bir Dissosiyatif Bozukluk",
        "nameEn": "Other Specified Dissociative Disorder",
        "clinicalDescription": {
            "overview": "Dissosiyatif bozukluklara özgü belirtilerin klinik açıdan belirgin sıkıntı ya da işlevsellik kaybına yol açtığı, ancak bu gruptaki hiçbir bozukluğun ölçütlerinin tümüyle karşılanmadığı ve klinisyenin nedenini belirttiği durumlarda kullanılır. DSM-5-TR'nin örnekleri: süregen ve yineleyen karışık dissosiyatif belirtiler, uzun süreli ve yoğun zorlayıcı ikna sonrası kimlik bozulması, stresli olaylara akut dissosiyatif tepkiler ve dissosiyatif trans. DSM-IV'te \"başka türlü adlandırılamayan dissosiyatif bozukluk\" örneği olan Ganser sendromu (yaklaşık yanıtlar) DSM-5-TR'de ayrı bir tanı değildir; klinik uygulamada bu kategoriyle kodlanır. Ele geçirilme biçimindeki kimlik değişiklikleri dissosiyatif kimlik bozukluğu ölçütlerini karşılıyorsa o tanı konur.",
            "epidemiology": "Ayrı bir yaygınlık verisi yoktur. Klinik örneklemlerde dissosiyatif tanılar içinde sık kullanılan kategorilerden biridir; trans ve ele geçirilme tabloları bazı kültürlerde daha sık bildirilir. Ganser sendromu seyrektir ve çoğunlukla tutukluluk gibi ağır stres ortamlarında bildirilmiştir.",
            "etiology": "Erken ve süregen travma, ağır akut stresörler, uzun süreli zorlayıcı ikna (ör. işkence, tarikat telkini, uzun süreli siyasi tutukluluk), dissosiyatif yatkınlık ve kültürel bağlam rol oynar.",
            "prognosis": "Gidiş örneğe göre değişir. Akut dissosiyatif tepkiler ve Ganser tablosu stresör azaldığında çoğu zaman günler-haftalar içinde geriler; süregen karışık dissosiyatif belirtiler daha uzun, travma odaklı ve aşamalı psikoterapi gerektirir. Ayırıcı tanıda temarruz, yapay bozukluk, psikotik bozukluklar ve nörolojik durumlar dışlanmalıdır."
        },
        "criteriaList": [
            {
                "code": "Tanımlama",
                "title": "Belirlenmiş Diğer Bir Dissosiyatif Bozukluk",
                "content": "Dissosiyatif bozukluklara özgü belirtilerin baskın olduğu ve klinik açıdan belirgin sıkıntıya ya da toplumsal, mesleki veya diğer önemli işlevsellik alanlarında bozulmaya yol açtığı, ancak bu tanı grubundaki hiçbir bozukluğun ölçütlerinin tümüyle karşılanmadığı durumlarda kullanılır. Klinisyen ölçütlerin neden karşılanmadığını belirtir; kayıtta kategori adından sonra neden yazılır."
            },
            {
                "code": "Örnekler",
                "title": "DSM-5-TR'de Verilen Örnek Tablolar",
                "content": "Bu kategoriyle belirtilebilecek tablolara örnekler:",
                "items": [
                    "1. Süregen ve yineleyen karışık dissosiyatif belirtiler: dissosiyatif kimlik bozukluğu ölçütlerini tam karşılamayan kimlik bozulmaları ve kimlik değişimi yaşantılarıyla giden tablolar.",
                    "2. Uzun süreli ve yoğun zorlayıcı ikna sonrası kimlik bozulması: beyin yıkama, düşünce reformu, uzun süreli siyasi tutukluluk, işkence ya da tarikat telkini sonrası kimlikte kalıcı değişiklikler ya da kimliğin bilinçli olarak sorgulanması.",
                    "3. Stresli olaylara akut dissosiyatif tepkiler: genellikle 1 aydan kısa, bazen yalnızca birkaç saat ya da gün süren; bilinç daralması, depersonalizasyon, derealizasyon, algı bozuklukları, mikroamneziler, geçici stupor ve/veya duyusal-motor işlev değişiklikleriyle giden tablolar.",
                    "4. Dissosiyatif trans: yakın çevrenin farkındalığının ileri derecede daralması ya da tümüyle yitirilmesi, çevresel uyaranlara belirgin tepkisizlik; kabul gören kolektif kültürel ya da dinsel bir uygulamanın olağan parçası değildir."
                ]
            },
            {
                "code": "Klinik Not",
                "title": "Ganser Sendromu (Yaklaşık Yanıtlar)",
                "content": "Basit sorulara doğrunun hemen yanındaki yanlış yanıtların verilmesi (vorbeireden), bilinç bulanıklığı, dissosiyatif amnezi ve sıklıkla konversiyon belirtileriyle giden, çoğunlukla ağır stres altında (ör. tutukluluk) ortaya çıkan tablodur. DSM-5-TR'de ayrı tanı değildir; temarruz ve yapay bozukluktan ayrımı dikkatle yapılmalıdır."
            },
            {
                "code": "Belirtilmemiş ile Farkı",
                "title": "Nedenin Belirtilmesi",
                "content": "Klinisyen ölçütlerin neden karşılanmadığını belirtmeyi seçmezse ya da bilgi yetersizse (ör. acil servis) 'Belirtilmemiş Dissosiyatif Bozukluk' kategorisi kullanılır."
            }
        ]
    },
    "psychological_factors_affecting_medical": {
        "id": "psychological_factors_affecting_medical",
        "nameTr": "Başka Sağlık Durumunu Etkileyen Ruhsal Etkenler",
        "nameEn": "Psychological Factors Affecting Other Medical Conditions",
        "clinicalDescription": {
            "overview": "Bir ruhsal bozukluk dışındaki tıbbi bir hastalığın ya da belirtinin bulunduğu ve psikolojik ya da davranışsal etkenlerin bu tıbbi durumu olumsuz etkilediği tablodur. Örnekler: kaygının astım ataklarını ağırlaştırması, göğüs ağrısına rağmen tedavi gereksinimini inkar etme, kilo vermek isteyen diyabetli bir kişinin insülin dozunu bilerek azaltması, stresin hipertansiyon ya da irritabl bağırsak sendromunu kötüleştirmesi, ilaç önerilerine uyumsuzluk. Burada odak, ruhsal belirtilerin kendisi değil, bunların tıbbi hastalığın seyri üzerindeki etkisidir.",
            "epidemiology": "Yaygınlığı net değildir; birinci basamak ve hastane ortamlarında sık karşılaşılan bir durum olduğu düşünülmektedir. Her yaşta görülebilir.",
            "etiology": "Stres hormonlarının (kortizol, katekolaminler) ve otonom sinir sisteminin bağışıklık, kalp-damar ve sindirim sistemleri üzerindeki etkileri; olumsuz sağlık davranışları (sigara, hareketsizlik, beslenme), tedavi uyumsuzluğu, inkar ve kaçınma gibi baş etme biçimleri; kişilik özellikleri.",
            "prognosis": "Tıbbi ve psikolojik tedavinin birlikte yürütüldüğü bütüncül (konsültasyon-liyezon) yaklaşım, stres yönetimi, tedavi uyumunu artırmaya yönelik görüşmeler (motivasyonel görüşme) ve BDT tıbbi sonuçları iyileştirebilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A-C",
                "title": "Tanı Ölçütleri",
                "content": "Ruhsal bozukluk dışında bir tıbbi belirti ya da hastalık bulunur (A). Psikolojik ya da davranışsal etkenler tıbbi durumu şu yollardan biriyle olumsuz etkiler: tıbbi durumun gelişimi, alevlenmesi ya da iyileşmenin gecikmesiyle yakın zamansal ilişki içinde seyrin etkilenmesi; tedaviye engel olma (örn. kötü uyum); bilinen ek sağlık riskleri oluşturma; altta yatan patofizyolojiyi etkileyerek belirtileri tetikleme, ağırlaştırma ya da tıbbi ilgi gerektirme (B). Etkenler başka bir ruhsal bozuklukla (örn. panik bozukluğu, majör depresif bozukluk, TSSB) daha iyi açıklanamaz (C)."
            },
            {
                "code": "Şiddet Belirleyicisi",
                "title": "Hafif, Orta, Ağır, Aşırı",
                "content": "Hafif: tıbbi riski artırır (örn. antihipertansif tedaviye düzensiz uyum). Orta: altta yatan tıbbi durumu ağırlaştırır (örn. kaygının astımı kötüleştirmesi). Ağır: hastaneye yatış ya da acil başvuruya yol açar. Aşırı: ağır, yaşamı tehdit eden riskle sonuçlanır (örn. kalp krizi belirtilerini görmezden gelme)."
            }
        ]
    },
    "enuresis": {
        "id": "enuresis",
        "nameTr": "Enürezis (İstemsiz İdrar Kaçırma / Alt Islatma)",
        "nameEn": "Enuresis",
        "clinicalDescription": {
            "overview": "Takvim yaşı en az 5 (ya da buna eşdeğer gelişim düzeyinde) olan bir çocukta yatağa ya da giysilere yineleyen biçimde idrar kaçırmadır; kaçırma çoğunlukla istemsizdir, nadiren istemli olabilir. Alt türleri: yalnızca gece (en sık), yalnızca gündüz ve gece-gündüz birlikte. Çocuğun hiç kuru kalmadığı biçim birincil (primer), bir kuru kalma döneminden sonra başlayan biçim ikincil (sekonder) enürezis olarak adlandırılır; ikincil biçim sıklıkla stres etkenleriyle (kardeş doğumu, taşınma, boşanma) ilişkilidir.",
            "epidemiology": "5 yaşındaki çocukların yaklaşık %5-10'unda, 10 yaşındakilerin %3-5'inde, 15 yaş ve üzerinde yaklaşık %1'inde görülür. Gece enürezisi erkeklerde, gündüz enürezisi kızlarda daha sıktır.",
            "etiology": "Güçlü ailesel geçiş, gece vazopressin salınımında yetersizlik, işlevsel mesane kapasitesinin küçüklüğü, uykudan uyanma eşiğinin yüksekliği, kabızlık ve gelişimsel gecikme. Psikososyal stres özellikle ikincil enüreziste rol oynar.",
            "prognosis": "Her yıl çocukların bir kısmında kendiliğinden düzelir. Enürezis alarmı, davranışsal yöntemler ve gerektiğinde desmopressin etkilidir; çocuğun suçlanmaması ve cezalandırılmaması önemlidir. İdrar yolu enfeksiyonu, diyabet ve nörolojik nedenler dışlanmalıdır."
        },
        "criteriaList": [
            {
                "code": "Kriter A-C",
                "title": "İdrar Kaçırma, Sıklık ve Yaş (≥ 5 yaş)",
                "content": "Yatağa ya da giysilere yineleyen idrar kaçırma (istemsiz ya da istemli) (A). Klinik açıdan belirgindir: art arda en az 3 ay süreyle haftada en az 2 kez ya da belirgin sıkıntı veya toplumsal, okul ve diğer alanlarda işlev bozulması (B). Takvim yaşı en az 5'tir ya da buna eşdeğer gelişim düzeyindedir (C)."
            },
            {
                "code": "Kriter D & Alt Tipler",
                "title": "Dışlama ve Alt Tipler",
                "content": "Bir maddenin (örn. diüretik, antipsikotik) fizyolojik etkisine ya da başka bir sağlık durumuna (örn. diyabet, spina bifida, nöbet bozukluğu) bağlanamaz (D). Alt tipler: yalnızca gece, yalnızca gündüz, gece ve gündüz birlikte."
            }
        ]
    },
    "obstructive_sleep_apnea": {
        "id": "obstructive_sleep_apnea",
        "nameTr": "Tıkayıcı (Obstrüktif) Uyku Apnesi Hipopnesi",
        "nameEn": "Obstructive Sleep Apnea Hypopnea",
        "clinicalDescription": {
            "overview": "Uyku sırasında üst solunum yolunun yineleyen biçimde tamamen (apne) ya da kısmen (hipopne) tıkanmasıyla giden solunumla ilişkili uyku bozukluğudur. Gece horlama, horultu, soluk kesilmesi ve nefes nefese uyanma; gündüz aşırı uykululuk, yorgunluk, sabah baş ağrısı ve dinlendirmeyen uyku tipiktir. Dikkat ve bellek güçlükleri, irritabilite ve depresif belirtiler eşlik edebileceğinden psikiyatrik yakınmalarla başvurabilir.",
            "epidemiology": "Çocuklarda yaklaşık %1-2, orta yaşlı erişkinlerde %2-15 civarında, ileri yaşlarda daha da yüksek oranlarda görülür. Erkeklerde daha sıktır; kadınlarda menopoz sonrası risk artar.",
            "etiology": "Obezite (en önemli risk etkeni), boyun çevresinin kalınlığı, kraniyofasiyal yapı özellikleri, büyük bademcik/geniz eti (çocuklarda), ileri yaş, erkek cinsiyet, alkol ve sedatif kullanımı.",
            "prognosis": "Tedavi edilmezse hipertansiyon, kalp-damar hastalığı, inme, metabolik bozukluklar ve trafik kazası riskini artırır. Sürekli pozitif hava yolu basıncı (CPAP) ilk basamak tedavidir; kilo verme, ağız içi aygıtlar ve uygun olgularda cerrahi seçeneklerdir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Polisomnografi Bulgusu (AHİ ölçütleri)",
                "content": "1 ya da 2: (1) Polisomnografide uyku saati başına en az 5 tıkayıcı apne ya da hipopne ve şu belirtilerden biri: gece solunum bozuklukları (horlama, horultu/nefes nefese kalma, solunum duraklamaları) veya yeterli uyku fırsatına karşın gündüz uykululuk, yorgunluk ya da dinlendirmeyen uyku (başka bir ruhsal bozukluk ya da tıbbi durumla daha iyi açıklanamayan). (2) Eşlik eden belirtilerden bağımsız olarak uyku saati başına 15 ya da daha fazla tıkayıcı apne ve/veya hipopne."
            },
            {
                "code": "Şiddet Belirleyicisi",
                "title": "Apne-Hipopne İndeksine (AHİ) Göre",
                "content": "Hafif: AHİ 15'ten az; orta: AHİ 15-30; ağır: AHİ 30'dan fazla."
            }
        ]
    },
    "central_sleep_apnea": {
        "id": "central_sleep_apnea",
        "nameTr": "Santral Uyku Apnesi",
        "nameEn": "Central Sleep Apnea",
        "clinicalDescription": {
            "overview": "Solunum yolu tıkanıklığı olmaksızın, beyin sapındaki solunum denetiminin değişkenliğine bağlı olarak uykuda solunum çabasının durduğu ya da azaldığı (santral apne ve hipopneler) solunumla ilişkili uyku bozukluğudur. Gece sık uyanmalar, uykusuzluk, dinlendirmeyen uyku ve gündüz uykululuk görülür. Cheyne-Stokes solunumu bu bozukluğun bir alt tipidir: soluk hacminin periyodik olarak artıp azaldığı (kreşendo-dekreşendo) bir örüntüdür ve sıklıkla kalp yetmezliği ya da inmeyle ilişkilidir.",
            "epidemiology": "Genel toplumda seyrektir; kalp yetmezliği, inme sonrası ve uzun süreli opioid kullanan hastalarda belirgin olarak sıktır. İleri yaş ve erkek cinsiyette daha yaygındır.",
            "etiology": "Kalp yetmezliğinde dolaşım süresinin uzaması ve karbondioksite aşırı duyarlılık, nörolojik hastalıklar (inme, beyin sapı lezyonları), opioidlerin solunum merkezini baskılaması; idiyopatik biçimde belirgin bir neden saptanmaz.",
            "prognosis": "Altta yatan hastalığın (kalp yetmezliği) en uygun tedavisi, opioid dozunun gözden geçirilmesi ve uygun olgularda pozitif hava yolu basıncı tedavileri uygulanır. Prognoz büyük ölçüde altta yatan hastalığa bağlıdır."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B",
                "title": "Polisomnografi Bulgusu ve Dışlama",
                "content": "Polisomnografide uyku saati başına 5 ya da daha fazla santral apne (A). Bozukluk başka bir güncel uyku bozukluğuyla daha iyi açıklanamaz (B)."
            },
            {
                "code": "Alt Tipler",
                "title": "İdiyopatik, Cheyne-Stokes, Opioid Kullanımıyla Birlikte",
                "content": "İdiyopatik santral uyku apnesi (solunum çabasının değişkenliğine bağlı, yol tıkanıklığı olmayan yineleyen apne ve hipopneler); Cheyne-Stokes solunumu (saatte en az 5 olay sıklığında santral apne ve hipopnelere yol açan periyodik kreşendo-dekreşendo örüntüsü ve sık uyanmalar); opioid kullanımıyla birlikte santral uyku apnesi. Şiddet, solunum bozukluklarının sıklığı, oksijen desatürasyonu ve uyku bölünmesine göre değerlendirilir."
            }
        ]
    },
    "sleep_related_hypoventilation": {
        "id": "sleep_related_hypoventilation",
        "nameTr": "Uykuda Hipoventilasyon (Ondine Laneti Dahil)",
        "nameEn": "Sleep-Related Hypoventilation",
        "clinicalDescription": {
            "overview": "Uykuda solunumun azalmasına bağlı olarak kanda karbondioksit düzeyinin yükseldiği (hiperkapni) solunumla ilişkili uyku bozukluğudur. Sabah baş ağrısı, dinlendirmeyen uyku, gündüz uykululuk ve ilerleyen olgularda sağ kalp yetmezliği bulguları görülebilir. Doğuştan santral alveoler hipoventilasyon sendromu ('Ondine laneti') bu grubun nadir bir alt tipidir: yenidoğan döneminde başlayan, özellikle uykuda otomatik solunum denetiminin yetersizliğiyle giden genetik bir durumdur.",
            "epidemiology": "İdiyopatik ve doğuştan biçimler çok nadirdir. Eşlik eden (komorbid) biçim çok daha sıktır; özellikle obezite hipoventilasyon sendromu, KOAH ve nöromüsküler hastalıklarda görülür.",
            "etiology": "Doğuştan biçimde PHOX2B gen mutasyonu; eşlik eden biçimde akciğer hastalıkları (interstisyel akciğer hastalığı, KOAH), nöromüsküler ve göğüs duvarı hastalıkları, ağır obezite ve solunumu baskılayan ilaçlar (benzodiazepinler, opioidler).",
            "prognosis": "Noninvaziv mekanik ventilasyon temel tedavidir; doğuştan biçimde çoğu zaman yaşam boyu solunum desteği gerekir. Solunumu baskılayan ilaçlardan kaçınılmalıdır."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B",
                "title": "Polisomnografi Bulgusu ve Dışlama",
                "content": "Polisomnografide artmış karbondioksit düzeyiyle ilişkili azalmış solunum dönemleri; nesnel karbondioksit ölçümü yoksa apne/hipopne olaylarıyla ilişkili olmayan süregen düşük oksijen satürasyonu hipoventilasyonu düşündürebilir (A). Başka bir güncel uyku bozukluğuyla daha iyi açıklanamaz (B)."
            },
            {
                "code": "Alt Tipler",
                "title": "İdiyopatik, Doğuştan Santral Alveoler, Eşlik Eden",
                "content": "İdiyopatik hipoventilasyon (belirli bir nedene bağlanamaz); doğuştan santral alveoler hipoventilasyon (Ondine laneti; doğumda ya da erken dönemde başlayan, uykuda ağırlaşan yüzeyel solunum); eşlik eden uykuya bağlı hipoventilasyon (akciğer, nöromüsküler ya da göğüs duvarı hastalığı, ilaç kullanımı gibi bir tıbbi durumun sonucu)."
            }
        ]
    },
    "circadian_rhythm_sleep_wake": {
        "id": "circadian_rhythm_sleep_wake",
        "nameTr": "Sirkadiyen Ritim Uyku-Uyanıklık Bozukluğu",
        "nameEn": "Circadian Rhythm Sleep-Wake Disorder",
        "clinicalDescription": {
            "overview": "Başlıca sirkadiyen sistemdeki bir değişikliğe ya da kişinin içsel ritmi ile fiziksel çevrenin veya toplumsal/mesleki programın gerektirdiği uyku-uyanıklık takvimi arasındaki uyumsuzluğa bağlı süregen ya da yineleyen uyku bölünmesidir. Sonuç uykusuzluk, aşırı uykululuk ya da ikisidir. Kendi programına bırakıldığında uykunun süresi ve niteliği çoğunlukla normaldir. Tek tanıdır; tip (gecikmiş, erken, düzensiz, 24 saate uymayan, vardiyalı çalışma) belirleyici olarak eklenir.",
            "epidemiology": "Gecikmiş uyku evresi tipi ergen ve genç erişkinlerde en sık görülen tiptir; erken uyku evresi tipi yaşla artar; 24 saate uymayan tip tam görme kaybı olanların yaklaşık yarısında görülür; vardiyalı çalışma tipi gece çalışanların bir bölümünde bozukluk düzeyine ulaşır. Ailesel biçimler bildirilmiştir.",
            "etiology": "Biyolojik saatin geç ya da erken ayarlı olması, saat genlerinde (CRY1, PER2 vb.) çeşitlemeler, ışığın saati ayarlayamaması (görme kaybı), ışık ve toplumsal ipuçlarına maruziyetin azlığı ya da uygunsuz zamanlaması, dayatılan iş programı.",
            "prognosis": "Uygun zamanlanmış ışık tedavisi, melatonin ya da melatonin reseptör agonistleri, düzenli uyku programı ve (vardiyalı çalışmada) planlı şekerleme ile uyku ortamı düzenlemesi etkilidir. Tedavi bırakıldığında yineleme sıktır; depresyon ve uykusuzluk bozukluğu ayırıcı tanıda değerlendirilmelidir."
        },
        "criteriaList": [
            {
                "code": "Kriter A-C",
                "title": "Sirkadiyen Ritim Uyku-Uyanıklık Bozukluğu Ölçütleri",
                "content": "Başlıca sirkadiyen sistemdeki değişikliğe ya da içsel ritim ile fiziksel çevre veya toplumsal/mesleki programın gerektirdiği uyku-uyanıklık takvimi arasındaki uyumsuzluğa bağlı süregen ya da yineleyen uyku bölünmesi (A); bunun aşırı uykululuk, uykusuzluk ya da her ikisine yol açması (B); belirgin sıkıntı ya da işlev bozulması (C). Tanıda uyku günlüğü ve aktigrafi kullanılır."
            },
            {
                "code": "Belirleyiciler / Alt tipler",
                "title": "Tipler",
                "content": "Tip belirtilir:",
                "items": [
                    "Gecikmiş uyku evresi tipi (G47.21): uykuya dalma ve uyanma saatleri istenenden belirgin (çoğunlukla 2 saatten fazla) geç; kendi programında uyku normal. Ailesel ya da 24 saate uymayan tiple örtüşen biçimler belirtilebilir.",
                    "Erken uyku evresi tipi (G47.22): uykuya dalma ve uyanma istenenden birkaç saat erken; akşam aşırı uykululuk, sabah çok erken uyanma.",
                    "Düzensiz uyku-uyanıklık tipi (G47.23): 24 saate dağılmış, belirgin ana uyku dönemi olmayan parçalı uyku (çoğunlukla nörobilişsel bozukluklarda).",
                    "24 saate uymayan tip (G47.24): uyku-uyanıklık döngüsü 24 saatlik çevreyle eşlenmez, her gün tutarlı biçimde (çoğunlukla daha geç saate) kayar.",
                    "Vardiyalı çalışma tipi (G47.26): olağan gündüz saatleri dışında, özellikle gece düzenli çalışmaya bağlı ana uyku döneminde uykusuzluk ve/veya uyanıklıkta aşırı uykululuk.",
                    "Belirtilmemiş tip (G47.20). Seyir: epizodik, süregen, yineleyen."
                ]
            }
        ]
    },
    "delayed_ejaculation": {
        "id": "delayed_ejaculation",
        "nameTr": "Geç Boşalma (Gecikmiş Ejakülasyon)",
        "nameEn": "Delayed Ejaculation",
        "clinicalDescription": {
            "overview": "Partnerle cinsel etkinliğin hemen her durumunda, kişi istemediği halde boşalmanın belirgin biçimde gecikmesi ya da belirgin seyrekliği veya hiç olmaması ile tanımlanan cinsel işlev bozukluğudur. DSM-5 'gecikme' için kesin bir süre eşiği vermez; değerlendirme kişinin ve partnerinin deneyimine ve klinik yargıya dayanır. Uzayan cinsel birleşme yorgunluk, ağrı ve partnerde kendini çekici bulmama duygularına yol açabilir; bazı erkekler boşalmaktan kaçınmak için cinsel etkinliği sonlandırır.",
            "epidemiology": "Erkek cinsel yakınmaları içinde en seyrek görülenlerdendir. Yaşla birlikte sıklığı artar.",
            "etiology": "İlaçlar (özellikle SSRI'lar, antipsikotikler, bazı tansiyon ilaçları), alkol, diyabetik nöropati, pelvik cerrahi, androjen düzeyinde azalma; psikolojik olarak performans kaygısı, alışkanlık haline gelmiş özgün mastürbasyon biçimi (partnerle sağlanamayan yoğun ya da özel uyarım), partnerle ilişki sorunları ve dinsel/kültürel suçluluk.",
            "prognosis": "Neden olan ilacın gözden geçirilmesi, tıbbi nedenlerin tedavisi, cinsel terapi (duyusal odaklanma, mastürbasyon alışkanlıklarının değiştirilmesi) ve çift terapisi uygulanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Boşalmada Gecikme ya da Yokluk (Partnerli etkinliğin ~%75-100'ünde)",
                "content": "Partnerle cinsel etkinliğin hemen her ya da her durumunda (yaklaşık %75-100), kişi gecikme istemediği halde şunlardan biri: (1) boşalmada belirgin gecikme, (2) boşalmanın belirgin seyrekliği ya da hiç olmaması."
            },
            {
                "code": "Kriter B-D & Belirleyiciler",
                "title": "Süre (~6 ay), Sıkıntı ve Dışlama",
                "content": "Belirtiler en az yaklaşık 6 aydır sürer (B), kişide belirgin sıkıntıya yol açar (C) ve cinsel olmayan bir ruhsal bozuklukla, ağır ilişki sıkıntısıyla (örn. eş şiddeti) ya da diğer önemli stres etkenleriyle daha iyi açıklanamaz; bir madde/ilaç ya da tıbbi duruma bağlanamaz (D). Belirleyiciler: yaşam boyu ya da edinilmiş; genel ya da duruma özgü; şiddet hafif, orta ya da ağır."
            }
        ]
    },
    "male_hypoactive_desire": {
        "id": "male_hypoactive_desire",
        "nameTr": "Erkekte Düşük Cinsel İstek Bozukluğu",
        "nameEn": "Male Hypoactive Sexual Desire Disorder",
        "clinicalDescription": {
            "overview": "Erkekte cinsel ya da erotik düşünce ve fantezilerin ve cinsel etkinlik isteğinin süregen ya da yineleyen biçimde yetersiz olması veya hiç olmamasıdır. Yetersizlik yargısı klinisyen tarafından yaş ile genel ve sosyokültürel bağlam göz önüne alınarak verilir. Çiftler arasındaki istek farkı tek başına bu tanı için yeterli değildir; kişinin isteği kendi yaşamı ve bağlamı açısından düşük olmalı ve sıkıntı yaratmalıdır.",
            "epidemiology": "Cinsel istek sorunu bildiren erkeklerin oranı yaşla belirgin biçimde artar; 6 ay ya da daha uzun süren ve sıkıntı veren düşük istek ise daha az sıktır.",
            "etiology": "Depresyon ve anksiyete, ilişki sorunları, stres, erektil işlev bozukluğu ya da erken boşalmanın ikincil etkisi; düşük testosteron, hiperprolaktinemi, hipotiroidi, kronik hastalıklar ve ilaçlar (SSRI'lar, antiandrojenler, opioidler) değerlendirilmelidir.",
            "prognosis": "Altta yatan tıbbi ve psikiyatrik nedenlerin tedavisi, cinsel terapi ve çift terapisi uygulanır; hipogonadizm gösterilirse hormon tedavisi düşünülebilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Cinsel Düşünce/Fantezi ve İstekte Yetersizlik",
                "content": "Cinsel/erotik düşünce ya da fantezilerin ve cinsel etkinlik isteğinin süregen ya da yineleyen biçimde yetersiz olması veya hiç olmaması. Yetersizlik yargısı yaş, genel ve sosyokültürel bağlam gibi cinsel işlevi etkileyen etkenler göz önüne alınarak klinisyence verilir."
            },
            {
                "code": "Kriter B-D & Belirleyiciler",
                "title": "Süre (~6 ay), Sıkıntı ve Dışlama",
                "content": "En az yaklaşık 6 ay süre (B); kişide belirgin sıkıntı (C); cinsel olmayan bir ruhsal bozukluk, ağır ilişki sıkıntısı ya da diğer stres etkenleriyle daha iyi açıklanamama ve madde/ilaç ya da tıbbi duruma bağlanamama (D). Belirleyiciler: yaşam boyu ya da edinilmiş; genel ya da duruma özgü; şiddet hafif, orta ya da ağır."
            }
        ]
    },
    "female_sexual_interest_arousal": {
        "id": "female_sexual_interest_arousal",
        "nameTr": "Kadında Cinsel İlgi/Uyarılma Bozukluğu",
        "nameEn": "Female Sexual Interest/Arousal Disorder",
        "clinicalDescription": {
            "overview": "DSM-5'te kadında düşük cinsel istek ve cinsel uyarılma bozuklukları, kadın cinselliğinde bu iki sürecin iç içe olduğu bulgularından hareketle tek bir tanıda birleştirilmiştir. Cinsel ilgi ya da uyarılmanın belirgin biçimde azalması veya yokluğu; cinsel düşünce ve fantezilerde azalma, cinsel etkinliği başlatmama ve partnerin girişimlerine kapalı olma, cinsel etkinlik sırasında heyecan ve haz ile genital ya da genital olmayan duyumlarda azalma şeklinde görülür. Kadınlarda isteğin çoğu zaman kendiliğinden değil cinsel uyarana yanıt olarak ortaya çıktığı ('yanıtsal istek', Basson modeli) göz önüne alınmalıdır. Yaşam boyu cinsel istek eksikliği kişinin kendini aseksüel olarak tanımlamasıyla açıklanıyorsa tanı konmaz.",
            "epidemiology": "Düşük cinsel istek, kadınlarda en sık bildirilen cinsel yakınmalardandır; ancak sıkıntı veren ve 6 ay süren düşük istek/uyarılma daha az sıktır. Oranlar yaş, kültür ve kullanılan tanıma göre büyük farklılık gösterir.",
            "etiology": "İlişki sorunları ve partnerin cinsel işlev bozukluğu, depresyon, anksiyete, beden imajı sorunları, cinsel istismar öyküsü, stres ve yorgunluk; tıbbi olarak menopoz, doğum sonrası dönem, hormonal ilaçlar, SSRI'lar ve kronik hastalıklar.",
            "prognosis": "Cinsel terapi, bilinçli farkındalık temelli yaklaşımlar, BDT ve çift terapisi etkilidir. Tıbbi ve ilaçla ilişkili nedenler gözden geçirilmelidir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Cinsel İlgi/Uyarılmada Azalma (6 belirtiden en az 3'ü)",
                "content": "Cinsel ilgi ya da uyarılmanın yokluğu veya belirgin azalması; aşağıdakilerden en az üçü ile kendini gösterir:",
                "items": [
                    "1. Cinsel etkinliğe karşı ilginin yokluğu ya da azalması.",
                    "2. Cinsel/erotik düşünce ya da fantezilerin yokluğu ya da azalması.",
                    "3. Cinsel etkinliği başlatmama ya da az başlatma ve genellikle partnerin girişimlerine kapalı olma.",
                    "4. Cinsel karşılaşmaların hemen hepsinde ya da hepsinde (yaklaşık %75-100) cinsel etkinlik sırasında heyecan ya da hazzın yokluğu veya azalması.",
                    "5. Herhangi bir iç ya da dış cinsel/erotik uyarana (yazılı, sözel, görsel) yanıt olarak cinsel ilgi/uyarılmanın yokluğu veya azalması.",
                    "6. Cinsel karşılaşmaların hemen hepsinde ya da hepsinde (yaklaşık %75-100) cinsel etkinlik sırasında genital ya da genital olmayan duyumların yokluğu veya azalması."
                ]
            },
            {
                "code": "Kriter B-D & Belirleyiciler",
                "title": "Süre (~6 ay), Sıkıntı ve Dışlama",
                "content": "En az yaklaşık 6 ay süre (B); kişide belirgin sıkıntı (C); cinsel olmayan ruhsal bozukluk, ağır ilişki sıkıntısı (örn. eş şiddeti) ya da diğer stres etkenleriyle daha iyi açıklanamama, madde/ilaç ya da tıbbi duruma bağlanamama (D). Belirleyiciler: yaşam boyu ya da edinilmiş; genel ya da duruma özgü; şiddet hafif, orta ya da ağır."
            }
        ]
    },
    "female_orgasmic_disorder": {
        "id": "female_orgasmic_disorder",
        "nameTr": "Kadında Orgazm Bozukluğu (Anorgazmi)",
        "nameEn": "Female Orgasmic Disorder",
        "clinicalDescription": {
            "overview": "Cinsel etkinliğin hemen her durumunda orgazmın belirgin biçimde gecikmesi, seyrekleşmesi ya da hiç olmaması veya orgazm duyumlarının yoğunluğunun belirgin biçimde azalmasıyla tanımlanan cinsel işlev bozukluğudur. Kadınlar orgazm için gereken uyarım türü ve yoğunluğu açısından büyük farklılık gösterir; örneğin yalnızca vajinal birleşmeyle orgazm olamayıp klitoral uyarıma gereksinim duymak olağan bir çeşitliliktir ve tek başına bozukluk değildir.",
            "epidemiology": "Kadınlarda orgazm sorunlarının bildirilen oranı çalışmalar arasında geniş bir aralıkta değişir (yaş, kültür, süre ve sıkıntı ölçütüne göre); ancak bu kadınların yalnızca bir kısmı belirgin sıkıntı bildirir. Kadınların küçük bir bölümü yaşamı boyunca hiç orgazm deneyimlememiştir.",
            "etiology": "Cinsel bilgi ve deneyim eksikliği, kaygı, beden imajı sorunları, ilişki sorunları, kültürel/dinsel tutumlar ve cinsel istismar öyküsü; tıbbi olarak SSRI'lar, nörolojik hastalıklar (multipl skleroz, nöropati), pelvik cerrahi ve menopoz.",
            "prognosis": "Yönlendirilmiş mastürbasyon gibi davranışçı cinsel terapi yöntemleri, duyusal odaklanma egzersizleri, psikoeğitim ve çift terapisi etkilidir; özellikle yaşam boyu biçimde yönlendirilmiş mastürbasyonun başarısı yüksektir. İlaçla ilişkili olgularda ilacın gözden geçirilmesi gerekir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Orgazmda Gecikme, Yokluk ya da Yoğunlukta Azalma (~%75-100)",
                "content": "Cinsel etkinliğin hemen her ya da her durumunda (yaklaşık %75-100) şunlardan biri: (1) orgazmda belirgin gecikme, belirgin seyreklik ya da orgazmın olmaması, (2) orgazm duyumlarının yoğunluğunda belirgin azalma."
            },
            {
                "code": "Kriter B-D & Belirleyiciler",
                "title": "Süre (~6 ay), Sıkıntı ve Dışlama",
                "content": "En az yaklaşık 6 ay süre (B); kişide belirgin sıkıntı (C); cinsel olmayan ruhsal bozukluk, ağır ilişki sıkıntısı ya da diğer stres etkenleriyle daha iyi açıklanamama, madde/ilaç ya da tıbbi duruma bağlanamama (D). Belirleyiciler: yaşam boyu ya da edinilmiş; genel ya da duruma özgü; hiçbir durumda orgazm deneyimlememiş olma; şiddet hafif, orta ya da ağır."
            }
        ]
    },
    "unspecified_sexual_dysfunction": {
        "id": "unspecified_sexual_dysfunction",
        "nameTr": "Belirtilmemiş Cinsel İşlev Bozukluğu",
        "nameEn": "Unspecified Sexual Dysfunction",
        "clinicalDescription": {
            "overview": "Cinsel işlev bozukluğuna özgü belirtilerin kişide klinik açıdan belirgin sıkıntıya yol açtığı ancak cinsel işlev bozuklukları sınıfındaki herhangi bir tanının ölçütlerini tam olarak karşılamadığı ve klinisyenin bunun nedenini belirtmemeyi seçtiği durumlarda kullanılır; özgül tanı için yeterli bilginin bulunmadığı durumları da kapsar.",
            "epidemiology": "Artık (rezidüel) bir kategori olduğundan ayrı yaygınlık verisi yoktur.",
            "etiology": "Cinsel işlev bozukluklarıyla ortak tıbbi, ilaçla ilişkili, psikolojik ve ilişkisel etkenler.",
            "prognosis": "Ayrıntılı cinsel öykü, tıbbi değerlendirme ve gerekirse partnerle görüşme sonrasında tanı çoğu zaman özgül bir cinsel işlev bozukluğuna dönüştürülür."
        },
        "criteriaList": [
            {
                "code": "Tanım",
                "title": "Ölçütleri Tam Karşılamayan Cinsel İşlev Bozukluğu",
                "content": "Cinsel işlev bozukluğu belirtileri baskındır ve kişide belirgin sıkıntıya yol açar; ancak cinsel işlev bozuklukları sınıfındaki tanılardan herhangi birinin ölçütleri tam karşılanmaz."
            },
            {
                "code": "Not",
                "title": "Belirlenmiş Diğer Kategorisinden Farkı",
                "content": "Klinisyen ölçütlerin neden karşılanmadığını belirtmez ya da yeterli bilgi yoktur; özgül bir neden yazılabiliyorsa (örn. cinsel tiksinti) 'belirlenmiş diğer cinsel işlev bozukluğu' tercih edilir."
            }
        ]
    },
    "gender_dysphoria_children": {
        "id": "gender_dysphoria_children",
        "nameTr": "Çocuklarda Cinsiyet Disforisi",
        "nameEn": "Gender Dysphoria in Children",
        "clinicalDescription": {
            "overview": "Çocuklarda Cinsiyet Disforisi, çocuğun yaşadığı/ifade ettiği cinsiyet ile doğumda atanan cinsiyeti arasındaki belirgin uyumsuzluğun en az 6 ay sürmesi ve buna klinik açıdan belirgin sıkıntı ya da işlevsellik kaybının eşlik etmesidir. DSM-5-TR'de klinik odak kimliğin kendisi değil, uyumsuzluğa eşlik eden sıkıntıdır (disfori). Tanı, oyun, giysi, oyuncak ve arkadaş tercihleri gibi gözlenebilir davranışların yanı sıra çocuğun karşı (ya da başka bir) cinsiyetten olma isteğini ısrarla dile getirmesine dayanır.",
            "epidemiology": "Kesin yaygınlık bilinmemektedir; klinik başvuru verileri gerçek sıklığı yansıtmaz. Klinik örneklemlerde atanmış erkek çocuklar daha sık başvururken son yıllarda bu oran değişmektedir. Çocuklukta başlayan disforinin ergenlik ve erişkinliğe sürme oranı çalışmalar arasında büyük farklılık gösterir ve tartışmalıdır.",
            "etiology": "Kesin bir neden tanımlanmamıştır. İkiz ve aile çalışmaları bir miktar kalıtsal katkıya işaret eder; doğum öncesi hormonal etkiler (ör. konjenital adrenal hiperplazi gibi cinsiyet gelişimi farklılıklarında) incelenmiştir. Psikososyal etmenler disforinin ortaya çıkışından çok eşlik eden sıkıntının şiddetini (damgalanma, akran zorbalığı, aile kabulü) etkiler.",
            "prognosis": "Seyir bireyden bireye değişir; disforinin bir kısmı ergenlikte azalırken bir kısmında ergenlik değişimleriyle belirginleşir. Aile desteği ve kabul edici okul ortamı anksiyete, depresyon ve okul sorunlarını azaltır. Yaklaşım genellikle değerlendirme, aileye danışmanlık ve çocuğun izlenmesidir; ergenlik öncesinde tıbbi müdahale yapılmaz."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Belirgin Cinsiyet Uyumsuzluğu (En az 6 ay; en az 6/8 belirti, A1 zorunlu)",
                "content": "Yaşanan/ifade edilen cinsiyet ile atanan cinsiyet arasında en az 6 ay süren belirgin uyumsuzluk; aşağıdakilerden en az altısı bulunmalı ve bunlardan biri mutlaka A1 olmalıdır:",
                "items": [
                    "A1. Karşı cinsiyetten (ya da atanandan farklı başka bir cinsiyetten) olmayı güçlü biçimde isteme veya öyle olduğunda ısrar etme.",
                    "A2. Atanan cinsiyete göre karşı cinsiyete özgü kabul edilen giysileri giymeyi güçlü biçimde tercih etme ve kendi cinsiyetine özgü giysilere güçlü direnç gösterme.",
                    "A3. Hayali/rol oyunlarında karşı cinsiyet rollerini güçlü biçimde tercih etme.",
                    "A4. Karşı cinsiyete özgü sayılan oyuncak, oyun ve etkinlikleri güçlü biçimde tercih etme.",
                    "A5. Karşı cinsiyetten oyun arkadaşlarını güçlü biçimde tercih etme.",
                    "A6. Atanan cinsiyete özgü sayılan oyuncak, oyun ve etkinlikleri güçlü biçimde reddetme (ör. atanmış erkeklerde boğuşmalı oyunlardan kaçınma).",
                    "A7. Kendi cinsel anatomisinden güçlü biçimde hoşlanmama.",
                    "A8. Yaşadığı cinsiyete uyan birincil ve/veya ikincil cinsiyet özelliklerine sahip olmayı güçlü biçimde isteme."
                ]
            },
            {
                "code": "Kriter B",
                "title": "Klinik Sıkıntı ve İşlevsellik Kaybı",
                "content": "Durum klinik açıdan belirgin sıkıntıya ya da toplumsal, okul veya diğer önemli işlevsellik alanlarında bozulmaya yol açar."
            },
            {
                "code": "Belirleyici",
                "title": "Cinsiyet Gelişimi Farklılığı ile Birlikte",
                "content": "Bir cinsiyet gelişimi farklılığı/bozukluğu (ör. konjenital adrenal hiperplazi, androjen duyarsızlık sendromu) eşlik ediyorsa belirtilir ve o durum ayrıca kodlanır."
            },
            {
                "code": "Ayırıcı Tanı",
                "title": "Cinsiyet Rolüne Uymama ile Karışıklık",
                "content": "Kalıp yargılara uymayan oyun ve giysi tercihleri tek başına tanı koydurmaz; belirleyici olan, güçlü ve ısrarlı karşı cinsiyetten olma isteği ile eşlik eden sıkıntıdır."
            }
        ]
    },
    "gender_dysphoria_adolescents_adults": {
        "id": "gender_dysphoria_adolescents_adults",
        "nameTr": "Ergen ve Erişkinlerde Cinsiyet Disforisi",
        "nameEn": "Gender Dysphoria in Adolescents and Adults",
        "clinicalDescription": {
            "overview": "Ergen ve Erişkinlerde Cinsiyet Disforisi, kişinin yaşadığı/ifade ettiği cinsiyet ile atanan cinsiyeti (ve buna bağlı bedensel cinsiyet özellikleri) arasındaki belirgin uyumsuzluğun en az 6 ay sürmesi ve buna klinik açıdan belirgin sıkıntı veya işlevsellik kaybının eşlik etmesidir. Transgender ya da cinsiyet çeşitliliği gösteren kimlik tek başına bir bozukluk değildir; tanı, uyumsuzluğa eşlik eden disforinin klinik ilgi gerektirdiği durumlar için kullanılır. ICD-11'de bu tablo ruhsal bozukluklar bölümünden çıkarılarak 'cinsiyet uyumsuzluğu' adıyla cinsel sağlık bölümüne taşınmıştır.",
            "epidemiology": "Klinik başvurulara dayanan eski DSM tahminleri çok düşük oranlar verirken nüfus temelli güncel anketler transgender kimlik bildiren kişilerin oranını çok daha yüksek bulmaktadır; bu nedenle kesin yaygınlık belirsizdir. Son yıllarda özellikle ergen başvurularında belirgin artış ve atanmış kız ergenlerin oranında yükselme bildirilmiştir.",
            "etiology": "Çok etmenlidir; kalıtsal ve doğum öncesi biyolojik etkilerin rol oynadığı düşünülmektedir. Sıkıntının şiddetini damgalanma, ayrımcılık, aile ve toplum desteğinin yokluğu gibi 'azınlık stresi' etmenleri belirgin biçimde artırır.",
            "prognosis": "Disfori genellikle kalıcıdır. Depresyon, anksiyete, kendine zarar verme ve intihar riski genel topluma göre yüksektir; sosyal destek ve uygun, kapsamlı değerlendirmeye dayalı bakım (psikososyal destek; uygun durumlarda tıbbi/cerrahi geçiş süreçleri) ile sıkıntının azaldığı bildirilmektedir. Ergenlerde tıbbi müdahalelerin kanıt düzeyi güncel olarak tartışmalıdır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Belirgin Cinsiyet Uyumsuzluğu (En az 6 ay; en az 2/6 belirti)",
                "content": "Yaşanan/ifade edilen cinsiyet ile atanan cinsiyet arasında en az 6 ay süren belirgin uyumsuzluk; aşağıdakilerden en az ikisi:",
                "items": [
                    "1. Yaşanan cinsiyet ile birincil/ikincil cinsiyet özellikleri (genç ergenlerde beklenen ikincil özellikler) arasında belirgin uyumsuzluk.",
                    "2. Bu uyumsuzluk nedeniyle kendi birincil/ikincil cinsiyet özelliklerinden kurtulma (genç ergenlerde gelişmelerini önleme) yönünde güçlü istek.",
                    "3. Karşı cinsiyetin birincil/ikincil cinsiyet özelliklerine sahip olma yönünde güçlü istek.",
                    "4. Karşı cinsiyetten (ya da başka bir cinsiyetten) olma yönünde güçlü istek.",
                    "5. Karşı cinsiyetten (ya da başka bir cinsiyetten) biri olarak görülme ve davranılma yönünde güçlü istek.",
                    "6. Karşı cinsiyetin (ya da başka bir cinsiyetin) tipik duygu ve tepkilerine sahip olduğuna dair güçlü inanç."
                ]
            },
            {
                "code": "Kriter B",
                "title": "Klinik Sıkıntı ve İşlevsellik Kaybı",
                "content": "Durum klinik açıdan belirgin sıkıntıya ya da toplumsal, mesleki veya diğer önemli alanlarda işlevsellikte bozulmaya yol açar."
            },
            {
                "code": "Belirleyiciler",
                "title": "Cinsiyet Gelişimi Farklılığı ile Birlikte / Geçiş Sonrası",
                "content": "'Cinsiyet gelişimi farklılığı ile birlikte' (o durum ayrıca kodlanır) ve 'Geçiş sonrası' (kişi istediği cinsiyette tam zamanlı yaşamaya geçmiş ve en az bir tıbbi geçiş işlemi ya da tedavi rejimi geçirmiş/hazırlanıyor) belirleyicileri kullanılabilir."
            },
            {
                "code": "Ayırıcı Tanı",
                "title": "Ayırt Edilmesi Gereken Durumlar",
                "content": "Cinsiyet rolüne uymama, karşıgiyim (travestik) bozukluğu (kimlik değil cinsel uyarılma odaklı), beden algısı bozukluğu (belirli bir beden bölümüne odaklı) ve psikotik bozukluklarda görülen cinsiyetle ilgili sanrılar ayırt edilmelidir."
            }
        ]
    },
    "unspecified_gender_dysphoria": {
        "id": "unspecified_gender_dysphoria",
        "nameTr": "Belirtilmemiş Cinsiyet Disforisi",
        "nameEn": "Unspecified Gender Dysphoria",
        "clinicalDescription": {
            "overview": "Belirtilmemiş Cinsiyet Disforisi, cinsiyet disforisine özgü belirtilerin baskın olduğu ve klinik açıdan belirgin sıkıntı ya da işlevsellik kaybına yol açtığı, ancak cinsiyet disforisi tanı ölçütlerinin tümüyle karşılanmadığı ve klinisyenin bunun nedenini belirtmemeyi seçtiği durumlarda kullanılır. Acil servis gibi ayrıntılı değerlendirmenin yapılamadığı ortamlarda da kullanılabilir.",
            "epidemiology": "Ayrı bir yaygınlık verisi yoktur; yetersiz bilgiyle yapılan ilk değerlendirmelerde ve geçiş dönemindeki tanılarda kullanılan artık bir kategoridir.",
            "etiology": "Cinsiyet disforisiyle aynı etmenler geçerlidir; kategori bir etiyolojiyi değil, tanısal bilginin eksikliğini ya da belirtilerin eşik altında kalmasını yansıtır.",
            "prognosis": "Ek bilgi toplandıkça tanı genellikle cinsiyet disforisi ya da belirlenmiş diğer bir cinsiyet disforisi olarak netleştirilir. Klinik yaklaşım, kapsamlı değerlendirme ve eşlik eden sıkıntıya yönelik destektir."
        },
        "criteriaList": [
            {
                "code": "Tanımlama",
                "title": "Tam Ölçütleri Karşılamayan Cinsiyet Disforisi",
                "content": "Cinsiyet disforisine özgü belirtiler baskındır ve klinik açıdan belirgin sıkıntı ya da işlevsellik kaybına yol açar; ancak cinsiyet disforisi ölçütlerinin tümü karşılanmaz."
            },
            {
                "code": "Belirlenmiş Diğer ile Farkı",
                "title": "Nedenin Belirtilmemesi",
                "content": "Klinisyen ölçütlerin neden karşılanmadığını belirtmek istediğinde 'Belirlenmiş Diğer Bir Cinsiyet Disforisi' (ör. 6 aydan kısa süren uyumsuzluk) kullanılır; neden belirtilmeyecekse ya da bilgi yetersizse bu kategori kullanılır."
            }
        ]
    },
    "alcohol_intoxication": {
        "id": "alcohol_intoxication",
        "nameTr": "Alkol Zehirlenmesi (İntoksikasyonu)",
        "nameEn": "Alcohol Intoxication",
        "clinicalDescription": {
            "overview": "Alkol Entoksikasyonu, yakın zamanda alkol alınmasının ardından ortaya çıkan, klinik açıdan anlamlı sorunlu davranışsal ya da psikolojik değişikliklerin (uygunsuz cinsel ya da saldırgan davranış, duygudurum dalgalanmaları, yargılama bozukluğu) nörolojik bulgularla (dizartri, koordinasyon bozukluğu, nistagmus) birlikte görüldüğü akut ve geri dönüşümlü bir tablodur. Ağır olgularda solunum depresyonu, bilinç kaybı ve kusmuk aspirasyonu yaşamı tehdit eder.",
            "epidemiology": "Alkol kullanan erişkinlerin büyük çoğunluğu yaşamları boyunca en az bir kez entoksikasyon yaşar. Gençlerde ve kısa sürede çok miktarda içmede (binge içme) sıktır. Trafik kazaları, şiddet olayları, düşmeler ve intihar girişimlerinin önemli bir kısmında alkol entoksikasyonu bulunur.",
            "etiology": "Alkol GABA-A reseptörlerinde etkiyi artırır, NMDA (glutamat) reseptörlerini baskılar; beyincik, prefrontal korteks ve retiküler aktive edici sistem etkilenir. Kan alkol düzeyi; alınan miktar, içme hızı, vücut ağırlığı, cinsiyet, mide doluluğu ve toleransa göre değişir.",
            "prognosis": "Genellikle saatler içinde kendiliğinden düzelir. Ağır entoksikasyonda hava yolu güvenliği, hipoglisemi, hipotermi ve kafa travmasının dışlanması önemlidir; kronik kullanıcılarda tiamin eksikliği (Wernicke) riski akılda tutulmalıdır. Bilinç değişikliğinin yalnızca alkole bağlanması başka nedenlerin gözden kaçmasına yol açabilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Yakın Zamanda Alkol Alımı",
                "content": "Yakın zamanda alkol alınmış olması."
            },
            {
                "code": "Kriter B",
                "title": "Sorunlu Davranışsal / Psikolojik Değişiklikler",
                "content": "Alım sırasında ya da kısa süre sonra gelişen, klinik açıdan anlamlı sorunlu davranışsal ya da psikolojik değişiklikler (ör. uygunsuz cinsel ya da saldırgan davranış, duygudurum değişkenliği, yargılama bozukluğu)."
            },
            {
                "code": "Kriter C",
                "title": "Nörolojik Bulgular (En az 1/6)",
                "content": "Alım sırasında ya da kısa süre sonra aşağıdakilerden en az birinin gelişmesi:",
                "items": [
                    "1. Peltek/bulanık konuşma (dizartri).",
                    "2. Koordinasyon bozukluğu.",
                    "3. Dengesiz yürüme.",
                    "4. Nistagmus.",
                    "5. Dikkat ya da bellekte bozulma.",
                    "6. Stupor ya da koma."
                ]
            },
            {
                "code": "Kriter D",
                "title": "Dışlama",
                "content": "Belirti ve bulgular başka bir sağlık durumuna bağlanamaz ve başka bir maddeyle entoksikasyon dahil başka bir ruhsal bozuklukla daha iyi açıklanamaz."
            }
        ]
    },
    "alcohol_withdrawal": {
        "id": "alcohol_withdrawal",
        "nameTr": "Alkol Yoksunluğu",
        "nameEn": "Alcohol Withdrawal",
        "clinicalDescription": {
            "overview": "Alkol Yoksunluğu, uzun süreli ve yoğun alkol kullanımının bırakılması ya da azaltılmasından sonraki birkaç saat ile birkaç gün içinde ortaya çıkan, otonom aşırı etkinlik (terleme, taşikardi), el titremesi, uykusuzluk, bulantı, anksiyete ve ajitasyonla seyreden bir sendromdur. Ağır biçimde jeneralize tonik-klonik nöbetler ve yoksunluk deliryumu (delirium tremens) gelişebilir; bu nedenle tıbbi açıdan tehlikeli olabilen bir yoksunluk tablosudur.",
            "epidemiology": "Alkol kullanım bozukluğu olan bireylerin önemli bir kısmı yaşamları boyunca yoksunluk yaşar; oran hastanede yatan ve evsiz alkol bağımlılarında çok daha yüksektir. Nöbet ve deliryum gibi ağır komplikasyonlar yoksunluk yaşayanların küçük bir bölümünde görülür.",
            "etiology": "Süreğen alkol maruziyeti GABA-A reseptörlerinde duyarlılık azalmasına ve NMDA reseptörlerinde artışa (yukarı düzenleme) yol açar. Alkol ani kesildiğinde baskılanmamış glutamaterjik ve noradrenerjik aşırı etkinlik ortaya çıkar. Önceki yoksunluk atakları sonrakileri ağırlaştırır (tutuşma / kindling).",
            "prognosis": "Belirtiler genellikle son içkiden sonraki ilk gün içinde başlar, ikinci-üçüncü günlerde zirve yapar ve çoğu hastada birkaç gün ile bir hafta içinde geriler; uyku ve duygudurum değişiklikleri haftalarca sürebilir. Tedavide benzodiazepinlerle denetimli detoksifikasyon ve tiamin desteği temel yaklaşımdır; nöbet ya da deliryum öyküsü olanlar yatarak izlenmelidir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Yoğun ve Uzun Süreli Kullanımın Kesilmesi",
                "content": "Yoğun ve uzun süreli alkol kullanımının bırakılması ya da azaltılması."
            },
            {
                "code": "Kriter B",
                "title": "Yoksunluk Belirtileri (En az 2/8)",
                "content": "Kesilmeden sonraki birkaç saat ile birkaç gün içinde aşağıdakilerden en az ikisinin gelişmesi:",
                "items": [
                    "1. Otonom aşırı etkinlik (ör. terleme ya da 100/dk üzerinde nabız).",
                    "2. El titremesinde artma.",
                    "3. Uykusuzluk.",
                    "4. Bulantı ya da kusma.",
                    "5. Geçici görsel, dokunsal ya da işitsel varsanılar veya yanılsamalar.",
                    "6. Psikomotor ajitasyon.",
                    "7. Anksiyete.",
                    "8. Jeneralize tonik-klonik nöbetler."
                ]
            },
            {
                "code": "Kriter C & D",
                "title": "Klinik Önem ve Dışlama",
                "content": "Belirtiler klinik açıdan belirgin sıkıntıya ya da işlevsellik kaybına yol açar; başka bir sağlık durumuna bağlanamaz ve başka bir maddeyle entoksikasyon ya da yoksunluk dahil başka bir ruhsal bozuklukla daha iyi açıklanamaz."
            },
            {
                "code": "Belirleyici",
                "title": "Algı Bozukluklarıyla Birlikte",
                "content": "Gerçeği değerlendirme korunmuşken varsanılar (çoğunlukla görsel ya da dokunsal) ya da deliryum olmaksızın işitsel, görsel veya dokunsal yanılsamalar varsa belirtilir."
            }
        ]
    },
    "alcohol_withdrawal_delirium": {
        "id": "alcohol_withdrawal_delirium",
        "nameTr": "Alkol Yoksunluğu Deliryumu (Delirium Tremens)",
        "nameEn": "Alcohol Withdrawal Delirium (Delirium Tremens)",
        "clinicalDescription": {
            "overview": "Alkol Yoksunluğu Deliryumu (Delirium Tremens), alkol yoksunluğu sırasında ya da hemen sonrasında gelişen; dikkat ve bilinçte dalgalı bozulma, yönelim bozukluğu, canlı görsel/dokunsal varsanılar, belirgin ajitasyon, ağır titreme ve otonom dengesizlikle (ateş, taşikardi, hipertansiyon, terleme) seyreden tıbbi bir acil durumdur. Hemen her zaman yıllarca süren ağır alkol kullanımı zemininde ortaya çıkar.",
            "epidemiology": "Alkol yoksunluğu yaşayan bireylerin küçük bir bölümünde gelişir. Risk etmenleri arasında daha önce yoksunluk deliryumu ya da nöbet geçirmiş olmak, ileri yaş, eşlik eden tıbbi hastalıklar (enfeksiyon, karaciğer hastalığı, elektrolit bozukluğu) ve son içkiden sonra yüksek kan alkol düzeyi bulunur.",
            "etiology": "Yoksunluk sırasındaki glutamaterjik ve noradrenerjik aşırı etkinlik, GABAerjik baskılamanın yetersizliği ile birleşir; eşlik eden enfeksiyon, hipoglisemi, elektrolit bozukluğu, kafa travması ve tiamin eksikliği tabloyu ağırlaştırır.",
            "prognosis": "Genellikle son içkiden 2-3 gün sonra başlar ve birkaç gün sürer. Tedavi edilmezse ölüm oranı yüksektir; yoğun destek tedavisi (sıvı-elektrolit, tiamin, benzodiazepinler, eşlik eden hastalıkların tedavisi) ile ölüm oranı belirgin biçimde düşer. Çoğunlukla yoğun bakım ya da yakın izlem gerektirir."
        },
        "criteriaList": [
            {
                "code": "Deliryum Ölçütleri",
                "title": "Dikkat / Farkındalık Bozukluğu, Hızlı Başlangıç, Ek Bilişsel Bozulma",
                "content": "Deliryum ölçütleri karşılanır: dikkat ve farkındalıkta bozulma; kısa sürede (saatler-günler) gelişen ve gün içinde dalgalanan seyir; bellek, yönelim, dil, görsel-uzamsal yeti ya da algıda ek bozulma; bu bozukluklar önceden var olan bir nörobilişsel bozuklukla açıklanamaz ve koma gibi ağır uyarılmışlık azalması bağlamında ortaya çıkmaz."
            },
            {
                "code": "Etiyolojik Kanıt",
                "title": "Alkol Yoksunluğuyla İlişki",
                "content": "Öykü, muayene ya da laboratuvar bulguları, deliryum belirtilerinin alkol yoksunluk sendromu sırasında ya da kısa süre sonra geliştiğini gösterir."
            },
            {
                "code": "Tanı Kuralı",
                "title": "Yoksunluk Tanısı Yerine Konması",
                "content": "Bu tanı, alkol yoksunluğu tanısı yerine, deliryum belirtileri klinik tabloya baskın olduğunda ve kendi başına klinik ilgi gerektirdiğinde konur. Akut (saatler-günler) ya da süreğen (haftalar-aylar) ve hiperaktif / hipoaktif / karışık etkinlik düzeyi belirtilebilir."
            },
            {
                "code": "Ayırıcı Tanı",
                "title": "Ayırt Edilmesi Gerekenler",
                "content": "Wernicke ensefalopatisi (oftalmopleji, ataksi, konfüzyon), hepatik ensefalopati, kafa travması (subdural hematom), enfeksiyon (menenjit, pnömoni) ve başka madde yoksunlukları ayırt edilmelidir."
            }
        ]
    },
    "cannabis_use_disorder": {
        "id": "cannabis_use_disorder",
        "nameTr": "Esrar (Kannabis) Kullanım Bozukluğu",
        "nameEn": "Cannabis Use Disorder",
        "clinicalDescription": {
            "overview": "Esrar (Kannabis) Kullanım Bozukluğu, esrar kullanımının denetim kaybı, toplumsal bozulma, riskli kullanım ve farmakolojik ölçütlerle (tolerans, yoksunluk) tanımlanan, klinik açıdan belirgin sıkıntı ya da işlevsellik kaybına yol açan sorunlu bir örüntü göstermesidir. Kullanıcılar sıklıkla esrarın 'bağımlılık yapmadığı' inancıyla sorunu küçümser; motivasyon kaybı, okul/iş başarısında düşme ve aile çatışmaları başvuru nedenleri arasındadır.",
            "epidemiology": "Dünyada en yaygın kullanılan yasa dışı maddedir. Yıllık kannabis kullanım bozukluğu yaygınlığı ergenlerde erişkinlere göre daha yüksektir ve genç erişkin erkeklerde en sıktır. Yüksek THC içerikli ürünlerin yaygınlaşmasıyla risk artmaktadır.",
            "etiology": "THC, CB1 reseptörleri üzerinden mezolimbik dopaminerjik ödül sistemini etkiler. Erken ergenlikte başlama, sık (günlük) kullanım, yüksek potensli ürünler, eşlik eden davranım bozukluğu/DEHB, anksiyete ve depresyon ile aile ve akranlarda madde kullanımı risk etmenleridir.",
            "prognosis": "Ergenlikte başlayan yoğun kullanım dikkat, bellek ve eğitim başarısında olumsuz etkiler ile psikotik bozukluk riskinde artışla ilişkilidir. Motivasyonel görüşme, BDT ve olumsallık yönetimi kanıta dayalı yaklaşımlardır; onaylanmış özgül bir ilaç tedavisi yoktur."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Sorunlu Kullanım Örüntüsü (12 ayda en az 2/11)",
                "content": "12 aylık bir dönemde aşağıdaki 11 ölçütten en az ikisinin bulunması:",
                "items": [
                    "1. Esrar çoğu zaman amaçlanandan daha fazla miktarda ya da daha uzun süre kullanılır.",
                    "2. Kullanımı bırakma ya da azaltma yönünde süreğen bir istek ya da başarısız çabalar vardır.",
                    "3. Maddeyi elde etmek, kullanmak ya da etkilerinden kurtulmak için çok zaman harcanır.",
                    "4. Kullanma yönünde yoğun istek ya da aşerme (craving) duyulur.",
                    "5. Yineleyici kullanım nedeniyle iş, okul ya da evdeki temel yükümlülükler yerine getirilemez.",
                    "6. Kullanımın yol açtığı ya da alevlendirdiği süreğen toplumsal/kişilerarası sorunlara karşın kullanım sürer.",
                    "7. Kullanım nedeniyle önemli toplumsal, mesleki ya da eğlenceye yönelik etkinlikler bırakılır ya da azaltılır.",
                    "8. Fiziksel açıdan tehlikeli durumlarda yineleyici kullanım (ör. araç kullanırken).",
                    "9. Maddenin yol açtığı ya da alevlendirdiği süreğen bedensel/ruhsal bir sorun bilindiği hâlde kullanım sürer.",
                    "10. Tolerans: aynı etki için belirgin olarak artan miktarlar gerekmesi ya da aynı miktarla belirgin olarak azalan etki.",
                    "11. Yoksunluk: maddeye özgü yoksunluk sendromu ya da yoksunluktan kaçınmak veya kurtulmak için aynı (ya da yakın) maddeyi alma."
                ]
            },
            {
                "code": "Şiddet ve Seyir Belirleyicileri",
                "title": "Hafif / Orta / Ağır; Erken / Süreğen Düzelme",
                "content": "Hafif: 2-3 ölçüt, Orta: 4-5 ölçüt, Ağır: 6 ya da daha çok ölçüt. Erken düzelme: en az 3 ay ama 12 aydan kısa süre (aşerme dışında) hiçbir ölçüt yok; süreğen düzelme: 12 ay ya da daha uzun süre. 'Denetimli bir ortamda' belirleyicisi de kullanılabilir."
            }
        ]
    },
    "cannabis_intoxication": {
        "id": "cannabis_intoxication",
        "nameTr": "Esrar Zehirlenmesi (İntoksikasyonu)",
        "nameEn": "Cannabis Intoxication",
        "clinicalDescription": {
            "overview": "Esrar Entoksikasyonu, yakın zamanda esrar kullanımının ardından gelişen klinik açıdan anlamlı sorunlu davranışsal/psikolojik değişiklikler (motor koordinasyon bozukluğu, öfori, anksiyete, zamanın yavaşladığı duygusu, yargılama bozukluğu, toplumsal geri çekilme) ile konjonktival kızarıklık, iştah artışı, ağız kuruluğu ve taşikardi gibi bedensel bulgularla tanımlanır. Bazı kişilerde, özellikle deneyimsiz kullanıcılarda ya da yüksek dozda, panik atak benzeri yoğun anksiyete ve paranoid düşünceler görülür.",
            "epidemiology": "Esrar kullanan herkeste entoksikasyon gelişebilir; tanı ancak belirgin sorunlu değişiklikler olduğunda konur. Yenilebilir ürünlerde etkinin geç başlaması nedeniyle fazla doz alma ve acil başvurular daha sıktır.",
            "etiology": "THC'nin CB1 reseptörleri üzerinden hipokampus, beyincik, bazal ganglionlar ve prefrontal korteksteki etkileri bellek, koordinasyon ve zaman algısını bozar. Etki içilen/buharlaştırılan ürünlerde dakikalar içinde, yenilebilir ürünlerde saatler içinde başlar.",
            "prognosis": "Belirtiler genellikle birkaç saat içinde geriler; yenilebilir ürünlerde daha uzun sürebilir. Araç kullanma ve kaza riski artar. Yoğun anksiyete ya da psikotik belirtilerde sakin bir ortam ve destek yeterli olabilir; belirtiler sürüyorsa esrarın yol açtığı psikotik ya da anksiyete bozukluğu düşünülmelidir."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B",
                "title": "Yakın Kullanım ve Sorunlu Değişiklikler",
                "content": "Yakın zamanda esrar kullanımı ve bunun sırasında ya da kısa süre sonra gelişen, klinik açıdan anlamlı sorunlu davranışsal/psikolojik değişiklikler (ör. motor koordinasyon bozukluğu, öfori, anksiyete, zamanın yavaşladığı duygusu, yargılama bozukluğu, toplumsal geri çekilme)."
            },
            {
                "code": "Kriter C",
                "title": "Bedensel Bulgular (2 saat içinde, en az 2/4)",
                "content": "Kullanımdan sonraki 2 saat içinde aşağıdakilerden en az ikisinin gelişmesi:",
                "items": [
                    "1. Konjonktival kızarıklık (kanlanmış gözler).",
                    "2. İştah artışı.",
                    "3. Ağız kuruluğu.",
                    "4. Taşikardi."
                ]
            },
            {
                "code": "Kriter D",
                "title": "Dışlama",
                "content": "Belirtiler başka bir sağlık durumuna bağlanamaz ve başka bir maddeyle entoksikasyon dahil başka bir ruhsal bozuklukla daha iyi açıklanamaz."
            },
            {
                "code": "Belirleyici",
                "title": "Algı Bozukluklarıyla Birlikte",
                "content": "Gerçeği değerlendirme korunmuşken varsanılar ya da deliryum olmaksızın işitsel, görsel veya dokunsal yanılsamalar varsa belirtilir."
            }
        ]
    },
    "cannabis_withdrawal": {
        "id": "cannabis_withdrawal",
        "nameTr": "Esrar Yoksunluğu",
        "nameEn": "Cannabis Withdrawal",
        "clinicalDescription": {
            "overview": "Esrar Yoksunluğu, uzun süreli ve yoğun (genellikle aylarca, günlük ya da neredeyse günlük) esrar kullanımının bırakılmasından sonraki yaklaşık bir hafta içinde ortaya çıkan; irritabilite, sinirlilik, uyku güçlüğü ve rahatsız edici rüyalar, iştah azalması, huzursuzluk, çökkün duygudurum ve bedensel rahatsızlıklarla seyreden sendromdur. DSM-5 ile resmî tanı olarak tanımlanmıştır; belirtilerin yatıştırılması için yeniden kullanım nüksün önemli bir nedenidir.",
            "epidemiology": "Düzenli esrar kullanıcılarının önemli bir kısmında, tedaviye başvuran yoğun kullanıcıların ise çoğunluğunda bildirilir.",
            "etiology": "Süreğen THC maruziyeti CB1 reseptörlerinde duyarlılık azalmasına yol açar; madde kesilince endokannabinoid sistemin yeniden dengelenmesi sırasında duygusal ve bedensel belirtiler ortaya çıkar.",
            "prognosis": "Belirtiler genellikle ilk hafta içinde başlar, ilk haftalarda zirve yapar ve çoğunlukla birkaç hafta içinde geriler; uyku sorunları daha uzun sürebilir. Yaşamı tehdit edici değildir. Destekleyici yaklaşım, uyku hijyeni ve nüks önleme çalışmaları kullanılır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Yoğun ve Uzun Süreli Kullanımın Kesilmesi",
                "content": "Yoğun ve uzun süreli (genellikle en az birkaç ay boyunca günlük ya da neredeyse günlük) esrar kullanımının bırakılması."
            },
            {
                "code": "Kriter B",
                "title": "Yoksunluk Belirtileri (Yaklaşık 1 hafta içinde, en az 3/7)",
                "content": "Kesilmeden sonraki yaklaşık bir hafta içinde aşağıdakilerden en az üçünün gelişmesi:",
                "items": [
                    "1. İrritabilite, öfke ya da saldırganlık.",
                    "2. Sinirlilik ya da anksiyete.",
                    "3. Uyku güçlüğü (uykusuzluk, rahatsız edici rüyalar).",
                    "4. İştah azalması ya da kilo kaybı.",
                    "5. Huzursuzluk.",
                    "6. Çökkün duygudurum.",
                    "7. Belirgin rahatsızlık veren en az bir bedensel belirti: karın ağrısı, titreme, terleme, ateş, üşüme ya da baş ağrısı."
                ]
            },
            {
                "code": "Kriter C & D",
                "title": "Klinik Önem ve Dışlama",
                "content": "Belirtiler klinik açıdan belirgin sıkıntıya ya da işlevsellik kaybına yol açar; başka bir sağlık durumuna bağlanamaz ve başka bir ruhsal bozuklukla daha iyi açıklanamaz."
            }
        ]
    },
    "sedative_hypnotic_use_disorder": {
        "id": "sedative_hypnotic_use_disorder",
        "nameTr": "Sedatif, Hipnotik ya da Anksiyolitik Kullanım Bozukluğu (Benzodiazepin)",
        "nameEn": "Sedative, Hypnotic, or Anxiolytic Use Disorder",
        "clinicalDescription": {
            "overview": "Sedatif, Hipnotik ya da Anksiyolitik Kullanım Bozukluğu, benzodiazepinler (alprazolam, diazepam, klonazepam vb.), benzodiazepin benzeri uyku ilaçları (zolpidem gibi 'Z-ilaçları') ve barbitüratlar gibi maddelerin denetimsiz ve sorunlu kullanımıdır. İki tipik yol vardır: reçeteyle başlayıp doz artırma ve birden çok hekimden ilaç toplama ile süren kullanım ve keyif amaçlı/diğer maddelerle birlikte (ör. opioid, alkol) yasa dışı kullanım.",
            "epidemiology": "Yıllık yaygınlığı erişkinlerde düşük (binde birkaç düzeyinde) olarak bildirilir; ancak uzun süreli reçeteli kullanım çok daha yaygındır. Yaşlılarda ve kadınlarda reçete yoluyla, genç erişkinlerde ise keyif amaçlı kullanım daha sıktır.",
            "etiology": "Bu maddeler GABA-A reseptörünü olumlu yönde düzenler; süreğen kullanım tolerans ve fizyolojik bağımlılık oluşturur. Anksiyete ve uyku bozuklukları, alkol ya da opioid kullanım bozukluğu, kolay erişim ve uzun süreli reçeteleme risk etmenleridir.",
            "prognosis": "Opioid ve alkolle birlikte kullanımda ölümcül solunum depresyonu riski belirgin olarak artar. Ani bırakma tehlikeli yoksunluk (nöbet, deliryum) yaratabileceğinden ilacın hekim denetiminde ve kademeli olarak azaltılması gerekir; BDT ve altta yatan anksiyete/uykusuzluğun tedavisi azaltmanın başarısını artırır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Sorunlu Kullanım Örüntüsü (12 ayda en az 2/11)",
                "content": "12 aylık bir dönemde aşağıdaki 11 ölçütten en az ikisinin bulunması:",
                "items": [
                    "1. Sedatif, hipnotik ya da anksiyolitik madde çoğu zaman amaçlanandan daha fazla miktarda ya da daha uzun süre kullanılır.",
                    "2. Kullanımı bırakma ya da azaltma yönünde süreğen bir istek ya da başarısız çabalar vardır.",
                    "3. Maddeyi elde etmek, kullanmak ya da etkilerinden kurtulmak için çok zaman harcanır.",
                    "4. Kullanma yönünde yoğun istek ya da aşerme (craving) duyulur.",
                    "5. Yineleyici kullanım nedeniyle iş, okul ya da evdeki temel yükümlülükler yerine getirilemez.",
                    "6. Kullanımın yol açtığı ya da alevlendirdiği süreğen toplumsal/kişilerarası sorunlara karşın kullanım sürer.",
                    "7. Kullanım nedeniyle önemli toplumsal, mesleki ya da eğlenceye yönelik etkinlikler bırakılır ya da azaltılır.",
                    "8. Fiziksel açıdan tehlikeli durumlarda yineleyici kullanım (ör. araç kullanırken).",
                    "9. Maddenin yol açtığı ya da alevlendirdiği süreğen bedensel/ruhsal bir sorun bilindiği hâlde kullanım sürer.",
                    "10. Tolerans: aynı etki için belirgin olarak artan miktarlar gerekmesi ya da aynı miktarla belirgin olarak azalan etki.",
                    "11. Yoksunluk: maddeye özgü yoksunluk sendromu ya da yoksunluktan kaçınmak veya kurtulmak için aynı (ya da yakın) maddeyi alma."
                ]
            },
            {
                "code": "Not",
                "title": "Tıbbi Gözetim Altında Kullanım",
                "content": "Madde yalnızca uygun tıbbi gözetim altında reçeteyle kullanılıyorsa tolerans ve yoksunluk ölçütleri tek başına sayılmaz; bu kişiler yalnızca bu iki ölçüte dayanarak tanı almaz."
            },
            {
                "code": "Şiddet ve Seyir Belirleyicileri",
                "title": "Hafif / Orta / Ağır; Erken / Süreğen Düzelme",
                "content": "Hafif: 2-3 ölçüt, Orta: 4-5 ölçüt, Ağır: 6 ya da daha çok ölçüt. Erken düzelme: en az 3 ay ama 12 aydan kısa süre (aşerme dışında) hiçbir ölçüt yok; süreğen düzelme: 12 ay ya da daha uzun süre. 'Denetimli bir ortamda' belirleyicisi de kullanılabilir."
            }
        ]
    },
    "sedative_withdrawal": {
        "id": "sedative_withdrawal",
        "nameTr": "Sedatif/Benzodiazepin Yoksunluğu",
        "nameEn": "Sedative, Hypnotic, or Anxiolytic Withdrawal",
        "clinicalDescription": {
            "overview": "Sedatif, Hipnotik ya da Anksiyolitik Yoksunluğu, bu maddelerin uzun süreli kullanımının bırakılması ya da azaltılmasından sonraki birkaç saat ile birkaç gün içinde gelişen; otonom aşırı etkinlik, titreme, uykusuzluk, anksiyete, ajitasyon, algı bozuklukları ve jeneralize nöbetlerle seyreden sendromdur. Klinik görünüm alkol yoksunluğuna çok benzer; alkol yoksunluğu gibi yaşamı tehdit edebilir. Yoksunluk deliryumu da gelişebilir.",
            "epidemiology": "Reçeteyle uzun süre (aylarca) düzenli benzodiazepin kullanan bireylerin önemli bir kısmında ilaç birden kesildiğinde yoksunluk belirtileri görülür. Yüksek doz ve uzun süreli kullanım riski artırır.",
            "etiology": "Süreğen kullanım GABA-A reseptör duyarlılığını azaltır; madde çekilince baskılanmamış uyarıcı etkinlik ortaya çıkar. Kısa yarı ömürlü maddelerde (ör. alprazolam) belirtiler daha erken ve daha şiddetli başlar; uzun yarı ömürlülerde (ör. diazepam) başlangıç birkaç gün gecikebilir ve daha uzun sürer.",
            "prognosis": "Ani kesilmede nöbet ve deliryum riski nedeniyle doz genellikle haftalar-aylar içinde kademeli olarak azaltılır. Azaltma sonrası bazı hastalarda anksiyete ve uykusuzluk haftalar-aylar sürebilir; altta yatan bozukluğun nüksü ile yoksunluk belirtileri ayırt edilmelidir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Uzun Süreli Kullanımın Kesilmesi",
                "content": "Uzun süreli sedatif, hipnotik ya da anksiyolitik kullanımının bırakılması ya da azaltılması."
            },
            {
                "code": "Kriter B",
                "title": "Yoksunluk Belirtileri (En az 2/8)",
                "content": "Kesilmeden sonraki birkaç saat ile birkaç gün içinde aşağıdakilerden en az ikisinin gelişmesi:",
                "items": [
                    "1. Otonom aşırı etkinlik (ör. terleme ya da 100/dk üzerinde nabız).",
                    "2. El titremesi.",
                    "3. Uykusuzluk.",
                    "4. Bulantı ya da kusma.",
                    "5. Geçici görsel, dokunsal ya da işitsel varsanılar veya yanılsamalar.",
                    "6. Psikomotor ajitasyon.",
                    "7. Anksiyete.",
                    "8. Jeneralize tonik-klonik (grand mal) nöbetler."
                ]
            },
            {
                "code": "Kriter C & D",
                "title": "Klinik Önem ve Dışlama",
                "content": "Belirtiler klinik açıdan belirgin sıkıntıya ya da işlevsellik kaybına yol açar; başka bir sağlık durumuna bağlanamaz ve başka bir maddeyle entoksikasyon ya da yoksunluk dahil başka bir ruhsal bozuklukla daha iyi açıklanamaz."
            },
            {
                "code": "Belirleyici",
                "title": "Algı Bozukluklarıyla Birlikte",
                "content": "Gerçeği değerlendirme korunmuşken varsanılar ya da deliryum olmaksızın işitsel, görsel veya dokunsal yanılsamalar varsa belirtilir."
            }
        ]
    },
    "opioid_use_disorder": {
        "id": "opioid_use_disorder",
        "nameTr": "Opioid Kullanım Bozukluğu (Eroin / Morfin)",
        "nameEn": "Opioid Use Disorder",
        "clinicalDescription": {
            "overview": "Opioid Kullanım Bozukluğu, eroin gibi yasa dışı opioidlerin ya da morfin, oksikodon, tramadol, fentanil gibi reçeteli opioidlerin denetimsiz, zorlantılı ve zarar verici kullanımıdır. Belirgin tolerans ve fizyolojik bağımlılık, aşerme, maddeyi elde etmek için yasa dışı yollara başvurma ve doz aşımı ölümleri tablonun belirleyici özellikleridir. Damar içi kullanımda HIV, hepatit B/C ve endokardit riski yüksektir.",
            "epidemiology": "Yıllık yaygınlığı erişkinlerde yaklaşık %0,4 düzeyinde bildirilmiştir; ABD'de reçeteli opioid ve fentanil kaynaklı bir salgın yaşanmaktadır. Erkeklerde daha sıktır. Türkiye'de eroin kullanımına bağlı tedavi başvuruları özellikle genç erişkinlerde önemli bir yer tutar.",
            "etiology": "Opioidler mü-opioid reseptörleri üzerinden ödül sistemini güçlü biçimde etkinleştirir ve hızla tolerans ile bağımlılık oluşturur. Kalıtsal yatkınlık, erken madde kullanımı, travma öyküsü, eşlik eden ruhsal bozukluklar, süreğen ağrı ve kolay erişim risk etmenleridir.",
            "prognosis": "Doz aşımına bağlı ölüm riski özellikle tolerans kaybından sonra (detoks ya da cezaevi çıkışı) yüksektir. Opioid agonist idame tedavisi (metadon, buprenorfin) ölüm, nüks ve suç oranlarını belirgin olarak azaltan kanıta dayalı tedavidir; nalokson doz aşımında hayat kurtarır. Psikososyal destek ve zarar azaltma programları tedavinin parçasıdır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Sorunlu Kullanım Örüntüsü (12 ayda en az 2/11)",
                "content": "12 aylık bir dönemde aşağıdaki 11 ölçütten en az ikisinin bulunması:",
                "items": [
                    "1. Opioid çoğu zaman amaçlanandan daha fazla miktarda ya da daha uzun süre kullanılır.",
                    "2. Kullanımı bırakma ya da azaltma yönünde süreğen bir istek ya da başarısız çabalar vardır.",
                    "3. Maddeyi elde etmek, kullanmak ya da etkilerinden kurtulmak için çok zaman harcanır.",
                    "4. Kullanma yönünde yoğun istek ya da aşerme (craving) duyulur.",
                    "5. Yineleyici kullanım nedeniyle iş, okul ya da evdeki temel yükümlülükler yerine getirilemez.",
                    "6. Kullanımın yol açtığı ya da alevlendirdiği süreğen toplumsal/kişilerarası sorunlara karşın kullanım sürer.",
                    "7. Kullanım nedeniyle önemli toplumsal, mesleki ya da eğlenceye yönelik etkinlikler bırakılır ya da azaltılır.",
                    "8. Fiziksel açıdan tehlikeli durumlarda yineleyici kullanım (ör. araç kullanırken).",
                    "9. Maddenin yol açtığı ya da alevlendirdiği süreğen bedensel/ruhsal bir sorun bilindiği hâlde kullanım sürer.",
                    "10. Tolerans: aynı etki için belirgin olarak artan miktarlar gerekmesi ya da aynı miktarla belirgin olarak azalan etki.",
                    "11. Yoksunluk: maddeye özgü yoksunluk sendromu ya da yoksunluktan kaçınmak veya kurtulmak için aynı (ya da yakın) maddeyi alma."
                ]
            },
            {
                "code": "Not",
                "title": "Tıbbi Gözetim Altında Kullanım",
                "content": "Madde yalnızca uygun tıbbi gözetim altında reçeteyle kullanılıyorsa tolerans ve yoksunluk ölçütleri tek başına sayılmaz; bu kişiler yalnızca bu iki ölçüte dayanarak tanı almaz."
            },
            {
                "code": "Şiddet ve Seyir Belirleyicileri",
                "title": "Hafif / Orta / Ağır; Erken / Süreğen Düzelme",
                "content": "Hafif: 2-3 ölçüt, Orta: 4-5 ölçüt, Ağır: 6 ya da daha çok ölçüt. Erken düzelme: en az 3 ay ama 12 aydan kısa süre (aşerme dışında) hiçbir ölçüt yok; süreğen düzelme: 12 ay ya da daha uzun süre. 'Denetimli bir ortamda' belirleyicisi de kullanılabilir. Ayrıca 'idame tedavisi altında' belirleyicisi (metadon, buprenorfin gibi bir agonist ya da antagonist tedavi alırken başka ölçüt kalmaması) kullanılır."
            }
        ]
    },
    "opioid_intoxication": {
        "id": "opioid_intoxication",
        "nameTr": "Opioid Zehirlenmesi (Miyozis, Solunum Depresyonu)",
        "nameEn": "Opioid Intoxication",
        "clinicalDescription": {
            "overview": "Opioid Entoksikasyonu, yakın zamanda opioid kullanımının ardından başlangıçtaki öforiyi izleyen apati, disfori, psikomotor değişiklikler ve yargılama bozukluğu ile birlikte göz bebeklerinde küçülme (miyozis), uyuklama, peltek konuşma ve dikkat/bellek bozulmasıyla seyreden tablodur. Ağır entoksikasyonda koma, toplu iğne başı göz bebekleri ve solunum depresyonu (opioid doz aşımı üçlüsü) görülür ve tablo ölümcül olabilir.",
            "epidemiology": "Opioid kullanan herkeste gelişebilir; ölümcül doz aşımları özellikle fentanil ve türevlerinin yaygınlaştığı bölgelerde ve opioidin benzodiazepin ya da alkolle birlikte kullanıldığı durumlarda artmıştır.",
            "etiology": "Opioidlerin beyin sapındaki mü reseptörleri üzerindeki etkisi solunum merkezini baskılar; okülomotor çekirdek üzerinden miyozis oluşur. Tolerans kaybı, saflığı bilinmeyen ürünler ve diğer santral sinir sistemi baskılayıcılarıyla birlikte kullanım riski artırır.",
            "prognosis": "Hafif entoksikasyon saatler içinde geçer. Solunum depresyonu acil durumdur: hava yolu ve solunum desteği ile opioid antagonisti nalokson uygulanır; uzun etkili opioidlerde naloksonun etkisi geçtikten sonra solunum depresyonu yinelenebileceğinden izlem sürdürülmelidir."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B",
                "title": "Yakın Kullanım ve Sorunlu Değişiklikler",
                "content": "Yakın zamanda opioid kullanımı ve bunun sırasında ya da kısa süre sonra gelişen klinik açıdan anlamlı sorunlu davranışsal/psikolojik değişiklikler (ör. başlangıçtaki öforiyi izleyen apati ve disfori, psikomotor ajitasyon ya da yavaşlama, yargılama bozukluğu)."
            },
            {
                "code": "Kriter C",
                "title": "Miyozis + En az 1 Bulgu",
                "content": "Göz bebeklerinde küçülme (ağır doz aşımına bağlı anoksi varsa büyüme görülebilir) ve buna ek olarak aşağıdakilerden en az birinin gelişmesi:",
                "items": [
                    "1. Uyuklama ya da koma.",
                    "2. Peltek konuşma.",
                    "3. Dikkat ya da bellekte bozulma."
                ]
            },
            {
                "code": "Kriter D",
                "title": "Dışlama",
                "content": "Belirtiler başka bir sağlık durumuna bağlanamaz ve başka bir maddeyle entoksikasyon dahil başka bir ruhsal bozuklukla daha iyi açıklanamaz."
            },
            {
                "code": "Belirleyici",
                "title": "Algı Bozukluklarıyla Birlikte",
                "content": "Gerçeği değerlendirme korunmuşken varsanılar ya da deliryum olmaksızın yanılsamalar varsa belirtilir (nadir)."
            }
        ]
    },
    "opioid_withdrawal": {
        "id": "opioid_withdrawal",
        "nameTr": "Opioid Yoksunluğu (Kriz / Kas Ağrıları, Midriyazis)",
        "nameEn": "Opioid Withdrawal",
        "clinicalDescription": {
            "overview": "Opioid Yoksunluğu, yoğun ve uzun süreli opioid kullanımının bırakılması ya da azaltılmasından veya kullanım sürerken bir opioid antagonistinin (nalokson, naltrekson) verilmesinden sonra gelişen; disforik duygudurum, bulantı-kusma, kas ağrıları, gözyaşı ve burun akıntısı, göz bebeklerinde büyüme, tüylerin dikleşmesi, terleme, ishal, esneme, ateş ve uykusuzlukla seyreden sendromdur. Belirtiler 'ağır bir grip' tablosunu andırır; çok rahatsız edicidir ancak sağlıklı erişkinlerde genellikle yaşamı tehdit etmez.",
            "epidemiology": "Opioid kullanım bozukluğu olan bireylerin büyük çoğunluğu yoksunluk yaşar; uzun süre opioid ağrı kesici kullanan hastalarda da ilacın ani kesilmesiyle görülebilir.",
            "etiology": "Süreğen opioid maruziyeti mü reseptörlerinde uyumsal değişikliklere ve locus coeruleus'ta noradrenerjik etkinliğin yukarı düzenlenmesine yol açar; opioid çekilince ortaya çıkan noradrenerjik aşırı etkinlik birçok belirtiden sorumludur.",
            "prognosis": "Kısa etkili opioidlerde (eroin) belirtiler son dozdan sonraki saatler içinde başlar, 1-3 gün içinde zirve yapar ve 5-7 gün içinde geriler; uzun etkililerde (metadon) başlangıç ve seyir daha geç ve uzundur. Disfori, uykusuzluk ve aşerme haftalar-aylar sürebilir (uzamış yoksunluk). Tolerans kaybı nedeniyle detoks sonrası doz aşımı riski yüksektir; tedavide agonist idamesi ya da denetimli azaltma ve belirtiye yönelik ilaçlar kullanılır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Kesilme ya da Antagonist Verilmesi",
                "content": "Aşağıdakilerden biri: (1) yoğun ve uzun süreli (birkaç hafta ya da daha uzun) opioid kullanımının bırakılması ya da azaltılması; (2) bir opioid kullanımı döneminden sonra opioid antagonisti verilmesi."
            },
            {
                "code": "Kriter B",
                "title": "Yoksunluk Belirtileri (En az 3/9)",
                "content": "Ölçüt A'dan sonraki dakikalar ile birkaç gün içinde aşağıdakilerden en az üçünün gelişmesi:",
                "items": [
                    "1. Disforik duygudurum.",
                    "2. Bulantı ya da kusma.",
                    "3. Kas ağrıları.",
                    "4. Gözyaşı akması ya da burun akıntısı.",
                    "5. Göz bebeklerinde büyüme, tüylerin dikleşmesi (piloereksiyon) ya da terleme.",
                    "6. İshal.",
                    "7. Esneme.",
                    "8. Ateş.",
                    "9. Uykusuzluk."
                ]
            },
            {
                "code": "Kriter C & D",
                "title": "Klinik Önem ve Dışlama",
                "content": "Belirtiler klinik açıdan belirgin sıkıntıya ya da işlevsellik kaybına yol açar; başka bir sağlık durumuna bağlanamaz ve başka bir maddeyle entoksikasyon ya da yoksunluk dahil başka bir ruhsal bozuklukla daha iyi açıklanamaz."
            }
        ]
    },
    "cocaine_use_disorder": {
        "id": "cocaine_use_disorder",
        "nameTr": "Uyarıcı Kullanım Bozukluğu (Kokain)",
        "nameEn": "Stimulant Use Disorder (Cocaine)",
        "clinicalDescription": {
            "overview": "Kokain Kullanım Bozukluğu, DSM-5-TR'de 'Uyarıcı Kullanım Bozukluğu' başlığı altında etken maddenin kokain olarak belirtildiği tablodur. Kokain burundan çekme, damar içi ya da 'crack' biçiminde içilerek kullanılır; özellikle içilen ve damar içi formlarda kısa süreli yoğun öforiyi hızla 'çöküş' izler ve bu döngü kısa sürede çok sık ve yüksek dozda tekrarlayan kullanıma (binge) yol açar. Maddi kayıplar, kardiyovasküler komplikasyonlar ve paranoya sık görülür.",
            "epidemiology": "Yıllık kokain kullanım bozukluğu yaygınlığı erişkinlerde düşük (binde birkaç düzeyinde) bildirilir; yaygınlık ülkeler arasında belirgin farklılık gösterir ve Avrupa'da son yıllarda kokain kullanımında artış rapor edilmektedir. 18-29 yaş grubunda ve erkeklerde daha sıktır.",
            "etiology": "Kokain dopamin (ve noradrenalin, serotonin) geri alımını engelleyerek ödül devresinde hızlı ve yoğun dopamin artışı yaratır. Kalıtsal yatkınlık, DEHB, davranım bozukluğu, travma öyküsü ve madde kullanan akran ortamı risk etmenleridir.",
            "prognosis": "Kokaine özgü onaylanmış bir ilaç tedavisi yoktur. Olumsallık yönetimi, BDT ve topluluk pekiştirme yaklaşımı kanıta dayalı psikososyal tedavilerdir. Miyokard enfarktüsü, inme, aritmi ve ani ölüm riski vardır; alkolle birlikte kullanımda toksik kokaetilen oluşur."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Sorunlu Kullanım Örüntüsü (12 ayda en az 2/11)",
                "content": "12 aylık bir dönemde aşağıdaki 11 ölçütten en az ikisinin bulunması:",
                "items": [
                    "1. Kokain çoğu zaman amaçlanandan daha fazla miktarda ya da daha uzun süre kullanılır.",
                    "2. Kullanımı bırakma ya da azaltma yönünde süreğen bir istek ya da başarısız çabalar vardır.",
                    "3. Maddeyi elde etmek, kullanmak ya da etkilerinden kurtulmak için çok zaman harcanır.",
                    "4. Kullanma yönünde yoğun istek ya da aşerme (craving) duyulur.",
                    "5. Yineleyici kullanım nedeniyle iş, okul ya da evdeki temel yükümlülükler yerine getirilemez.",
                    "6. Kullanımın yol açtığı ya da alevlendirdiği süreğen toplumsal/kişilerarası sorunlara karşın kullanım sürer.",
                    "7. Kullanım nedeniyle önemli toplumsal, mesleki ya da eğlenceye yönelik etkinlikler bırakılır ya da azaltılır.",
                    "8. Fiziksel açıdan tehlikeli durumlarda yineleyici kullanım (ör. araç kullanırken).",
                    "9. Maddenin yol açtığı ya da alevlendirdiği süreğen bedensel/ruhsal bir sorun bilindiği hâlde kullanım sürer.",
                    "10. Tolerans: aynı etki için belirgin olarak artan miktarlar gerekmesi ya da aynı miktarla belirgin olarak azalan etki.",
                    "11. Yoksunluk: maddeye özgü yoksunluk sendromu ya da yoksunluktan kaçınmak veya kurtulmak için aynı (ya da yakın) maddeyi alma."
                ]
            },
            {
                "code": "Not",
                "title": "Tıbbi Gözetim Altında Kullanım",
                "content": "Madde yalnızca uygun tıbbi gözetim altında reçeteyle kullanılıyorsa tolerans ve yoksunluk ölçütleri tek başına sayılmaz; bu kişiler yalnızca bu iki ölçüte dayanarak tanı almaz."
            },
            {
                "code": "Şiddet ve Seyir Belirleyicileri",
                "title": "Hafif / Orta / Ağır; Erken / Süreğen Düzelme",
                "content": "Hafif: 2-3 ölçüt, Orta: 4-5 ölçüt, Ağır: 6 ya da daha çok ölçüt. Erken düzelme: en az 3 ay ama 12 aydan kısa süre (aşerme dışında) hiçbir ölçüt yok; süreğen düzelme: 12 ay ya da daha uzun süre. 'Denetimli bir ortamda' belirleyicisi de kullanılabilir. Etken madde (kokain / amfetamin türü / diğer) ayrıca belirtilir."
            }
        ]
    },
    "cocaine_intoxication": {
        "id": "cocaine_intoxication",
        "nameTr": "Uyarıcı Zehirlenmesi (Kokain)",
        "nameEn": "Stimulant Intoxication (Cocaine)",
        "clinicalDescription": {
            "overview": "Kokain Entoksikasyonu, DSM-5-TR'de 'Uyarıcı Entoksikasyonu' başlığı altında etken maddenin kokain olarak belirtildiği tablodur. Öfori, enerji artışı, konuşkanlık ve aşırı uyanıklığın yanında taşikardi, midriyazis, hipertansiyon ve terleme görülür; yüksek dozda anksiyete, paranoya, saldırganlık, basmakalıp davranışlar, göğüs ağrısı, aritmi, nöbet ve hipertermi gelişebilir. Etki kısa sürer (özellikle içilen ve damar içi formda dakikalar düzeyinde).",
            "epidemiology": "Kokain kullananların çoğunda entoksikasyon belirtileri görülür; acil servis başvurularında göğüs ağrısı, anksiyete ve ajitasyon sık nedenlerdir.",
            "etiology": "Dopamin, noradrenalin ve serotonin geri alımının engellenmesi santral uyarılmaya ve sempatik aşırı etkinliğe yol açar; kokain ayrıca sodyum kanallarını bloke eder (lokal anestezik etki) ve aritmiye zemin hazırlar.",
            "prognosis": "Hafif entoksikasyon saatler içinde geçer. Ağır olgularda ajitasyonun güvenli biçimde yatıştırılması, hipertermi, kardiyak iskemi ve nöbetlerin tedavisi gerekir. Entoksikasyonu genellikle disforik bir 'çöküş' izler."
        },
        "criteriaList": [
            {
                "code": "Kriter A & B",
                "title": "Yakın Kullanım ve Sorunlu Değişiklikler",
                "content": "Yakın zamanda uyarıcı kullanımı ve bunun sırasında ya da kısa süre sonra gelişen klinik açıdan anlamlı sorunlu davranışsal/psikolojik değişiklikler (ör. öfori ya da duygulanımda küntleşme, toplumsallıkta değişme, aşırı uyanıklık, kişilerarası aşırı duyarlılık, anksiyete-gerginlik-öfke, basmakalıp davranışlar, yargılama bozukluğu)."
            },
            {
                "code": "Kriter C",
                "title": "Bedensel Bulgular (En az 2/9)",
                "content": "Kullanım sırasında ya da kısa süre sonra aşağıdakilerden en az ikisinin gelişmesi:",
                "items": [
                    "1. Taşikardi ya da bradikardi.",
                    "2. Midriyazis (göz bebeklerinde büyüme).",
                    "3. Kan basıncında yükselme ya da düşme.",
                    "4. Terleme ya da üşüme.",
                    "5. Bulantı ya da kusma.",
                    "6. Kilo kaybı kanıtı.",
                    "7. Psikomotor ajitasyon ya da yavaşlama.",
                    "8. Kas güçsüzlüğü, solunum depresyonu, göğüs ağrısı ya da kardiyak aritmi.",
                    "9. Konfüzyon, nöbet, diskinezi, distoni ya da koma."
                ]
            },
            {
                "code": "Kriter D",
                "title": "Dışlama",
                "content": "Belirtiler başka bir sağlık durumuna bağlanamaz ve başka bir maddeyle entoksikasyon dahil başka bir ruhsal bozuklukla daha iyi açıklanamaz."
            },
            {
                "code": "Belirleyici",
                "title": "Madde Türü ve Algı Bozuklukları",
                "content": "Etken madde (amfetamin türü, kokain, diğer uyarıcı) belirtilir; gerçeği değerlendirme korunmuşken varsanılar ya da deliryum olmaksızın yanılsamalar varsa 'algı bozukluklarıyla birlikte' eklenir."
            }
        ]
    },
    "cocaine_withdrawal": {
        "id": "cocaine_withdrawal",
        "nameTr": "Uyarıcı Yoksunluğu (Kokain)",
        "nameEn": "Stimulant Withdrawal (Cocaine)",
        "clinicalDescription": {
            "overview": "Kokain Yoksunluğu, DSM-5-TR'de 'Uyarıcı Yoksunluğu' başlığı altında etken maddenin kokain olarak belirtildiği tablodur. Yoğun kullanımın (özellikle günlerce süren binge dönemlerinin) ardından gelişen 'çöküş' (crash) evresinde belirgin disforik duygudurum, aşırı yorgunluk, uyku artışı ya da uykusuzluk, canlı ve hoş olmayan rüyalar, iştah artışı ve psikomotor yavaşlama görülür. Belirgin bedensel tehlike oluşturmaz, ancak ağır depresif belirtiler ve intihar düşünceleri ortaya çıkabilir.",
            "epidemiology": "Düzenli ya da binge tarzı kokain kullanıcılarının çoğunda kullanımın bırakılmasından sonra yoksunluk belirtileri görülür.",
            "etiology": "Süreğen uyarıcı kullanımının ödül devresinde yarattığı dopamin tükenmesi ve reseptör düzeyindeki uyumsal değişiklikler anhedoni ve disforiye yol açar.",
            "prognosis": "Akut belirtiler genellikle birkaç gün içinde azalır; anhedoni ve aşerme haftalarca sürebilir ve nüksün başlıca nedenidir. Tedavi destekleyicidir; ağır depresif belirtiler ve intihar riski izlenmelidir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Uzun Süreli Kullanımın Kesilmesi",
                "content": "Uzun süreli uyarıcı (amfetamin türü madde, kokain ya da diğer uyarıcı) kullanımının bırakılması ya da azaltılması."
            },
            {
                "code": "Kriter B",
                "title": "Disforik Duygudurum + Fizyolojik Değişiklikler (En az 2/5)",
                "content": "Kesilmeden sonraki birkaç saat ile birkaç gün içinde disforik duygudurum ve buna ek olarak aşağıdakilerden en az ikisinin gelişmesi:",
                "items": [
                    "1. Yorgunluk.",
                    "2. Canlı, hoş olmayan rüyalar.",
                    "3. Uykusuzluk ya da aşırı uyuma.",
                    "4. İştah artışı.",
                    "5. Psikomotor yavaşlama ya da ajitasyon."
                ]
            },
            {
                "code": "Kriter C & D",
                "title": "Klinik Önem ve Dışlama",
                "content": "Belirtiler klinik açıdan belirgin sıkıntıya ya da işlevsellik kaybına yol açar; başka bir sağlık durumuna bağlanamaz ve başka bir ruhsal bozuklukla daha iyi açıklanamaz."
            }
        ]
    },
    "amphetamine_use_disorder": {
        "id": "amphetamine_use_disorder",
        "nameTr": "Uyarıcı Kullanım Bozukluğu (Amfetamin Türü Madde / Metamfetamin)",
        "nameEn": "Stimulant Use Disorder (Amphetamine-Type Substance)",
        "clinicalDescription": {
            "overview": "Amfetamin Türü Madde Kullanım Bozukluğu, DSM-5-TR'de 'Uyarıcı Kullanım Bozukluğu' başlığı altında etken maddenin amfetamin türü bir madde (amfetamin, metamfetamin/kristal met, metilfenidat gibi uyarıcılar) olduğu tablodur. Metamfetamin uzun etkili ve güçlü bir uyarıcıdır; günlerce uykusuz süren yoğun kullanım dönemleri, kilo kaybı, diş çürümeleri ('met ağzı'), deri lezyonları, paranoya ve saldırganlık görülebilir. Reçeteli uyarıcıların (DEHB ilaçları) kötüye kullanımı da bu tanı kapsamındadır.",
            "epidemiology": "Yıllık yaygınlığı erişkinlerde düşüktür (binde birkaç düzeyinde) ancak bölgesel farklar çok büyüktür; Doğu ve Güneydoğu Asya, Okyanusya ve Kuzey Amerika'nın bazı bölgelerinde metamfetamin kullanımı ciddi bir halk sağlığı sorunudur. Türkiye'de de son yıllarda metamfetamin ele geçirme ve tedavi başvurularının arttığı bildirilmektedir.",
            "etiology": "Amfetaminler dopamin ve noradrenalinin salınımını artırır ve geri alımını engeller; metamfetamin ayrıca dopaminerjik nöronlarda nörotoksik hasar oluşturabilir. Kalıtsal yatkınlık, DEHB, davranım bozukluğu ve çevresel etmenler risk oluşturur.",
            "prognosis": "Onaylanmış özgül bir ilaç tedavisi yoktur; olumsallık yönetimi ve BDT kanıta dayalı yaklaşımlardır. Uzun süreli metamfetamin kullanımı bilişsel bozulma, psikotik bozukluk ve kardiyovasküler hastalık riskiyle ilişkilidir; bir kısmı uzun süreli ayıklıkla kısmen düzelir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Sorunlu Kullanım Örüntüsü (12 ayda en az 2/11)",
                "content": "12 aylık bir dönemde aşağıdaki 11 ölçütten en az ikisinin bulunması:",
                "items": [
                    "1. Amfetamin türü madde çoğu zaman amaçlanandan daha fazla miktarda ya da daha uzun süre kullanılır.",
                    "2. Kullanımı bırakma ya da azaltma yönünde süreğen bir istek ya da başarısız çabalar vardır.",
                    "3. Maddeyi elde etmek, kullanmak ya da etkilerinden kurtulmak için çok zaman harcanır.",
                    "4. Kullanma yönünde yoğun istek ya da aşerme (craving) duyulur.",
                    "5. Yineleyici kullanım nedeniyle iş, okul ya da evdeki temel yükümlülükler yerine getirilemez.",
                    "6. Kullanımın yol açtığı ya da alevlendirdiği süreğen toplumsal/kişilerarası sorunlara karşın kullanım sürer.",
                    "7. Kullanım nedeniyle önemli toplumsal, mesleki ya da eğlenceye yönelik etkinlikler bırakılır ya da azaltılır.",
                    "8. Fiziksel açıdan tehlikeli durumlarda yineleyici kullanım (ör. araç kullanırken).",
                    "9. Maddenin yol açtığı ya da alevlendirdiği süreğen bedensel/ruhsal bir sorun bilindiği hâlde kullanım sürer.",
                    "10. Tolerans: aynı etki için belirgin olarak artan miktarlar gerekmesi ya da aynı miktarla belirgin olarak azalan etki.",
                    "11. Yoksunluk: maddeye özgü yoksunluk sendromu ya da yoksunluktan kaçınmak veya kurtulmak için aynı (ya da yakın) maddeyi alma."
                ]
            },
            {
                "code": "Not",
                "title": "Tıbbi Gözetim Altında Kullanım",
                "content": "Madde yalnızca uygun tıbbi gözetim altında reçeteyle kullanılıyorsa tolerans ve yoksunluk ölçütleri tek başına sayılmaz; bu kişiler yalnızca bu iki ölçüte dayanarak tanı almaz."
            },
            {
                "code": "Şiddet ve Seyir Belirleyicileri",
                "title": "Hafif / Orta / Ağır; Erken / Süreğen Düzelme",
                "content": "Hafif: 2-3 ölçüt, Orta: 4-5 ölçüt, Ağır: 6 ya da daha çok ölçüt. Erken düzelme: en az 3 ay ama 12 aydan kısa süre (aşerme dışında) hiçbir ölçüt yok; süreğen düzelme: 12 ay ya da daha uzun süre. 'Denetimli bir ortamda' belirleyicisi de kullanılabilir. Etken madde (amfetamin türü / kokain / diğer) ayrıca belirtilir."
            }
        ]
    },
    "amphetamine_withdrawal": {
        "id": "amphetamine_withdrawal",
        "nameTr": "Uyarıcı Yoksunluğu (Amfetamin Türü Madde)",
        "nameEn": "Stimulant Withdrawal (Amphetamine-Type Substance)",
        "clinicalDescription": {
            "overview": "Amfetamin Yoksunluğu, DSM-5-TR'de 'Uyarıcı Yoksunluğu' başlığı altında etken maddenin amfetamin türü bir madde olduğu tablodur. Uzun süreli kullanımın bırakılmasının ardından belirgin disforik duygudurum, aşırı yorgunluk, uyku artışı ya da uykusuzluk, canlı kâbuslar, iştah artışı ve psikomotor yavaşlama görülür. Metamfetaminde belirtiler kokaine göre genellikle daha uzun sürer.",
            "epidemiology": "Düzenli metamfetamin/amfetamin kullanıcılarının çoğunda kullanım bırakıldıktan sonra yoksunluk belirtileri görülür.",
            "etiology": "Süreğen uyarıcı kullanımına bağlı dopaminerjik tükenme ve reseptör uyumu anhedoni ve disforiye yol açar.",
            "prognosis": "Akut evre genellikle birkaç gün ile bir-iki hafta sürer; anhedoni, depresif belirtiler ve aşerme haftalarca sürebilir. Ağır depresif belirtilerde intihar riski izlenmelidir; tedavi destekleyicidir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Uzun Süreli Kullanımın Kesilmesi",
                "content": "Uzun süreli uyarıcı (amfetamin türü madde, kokain ya da diğer uyarıcı) kullanımının bırakılması ya da azaltılması."
            },
            {
                "code": "Kriter B",
                "title": "Disforik Duygudurum + Fizyolojik Değişiklikler (En az 2/5)",
                "content": "Kesilmeden sonraki birkaç saat ile birkaç gün içinde disforik duygudurum ve buna ek olarak aşağıdakilerden en az ikisinin gelişmesi:",
                "items": [
                    "1. Yorgunluk.",
                    "2. Canlı, hoş olmayan rüyalar.",
                    "3. Uykusuzluk ya da aşırı uyuma.",
                    "4. İştah artışı.",
                    "5. Psikomotor yavaşlama ya da ajitasyon."
                ]
            },
            {
                "code": "Kriter C & D",
                "title": "Klinik Önem ve Dışlama",
                "content": "Belirtiler klinik açıdan belirgin sıkıntıya ya da işlevsellik kaybına yol açar; başka bir sağlık durumuna bağlanamaz ve başka bir ruhsal bozuklukla daha iyi açıklanamaz."
            }
        ]
    },
    "phencyclidine_use_disorder": {
        "id": "phencyclidine_use_disorder",
        "nameTr": "Fensiklidin (PCP) Kullanım Bozukluğu",
        "nameEn": "Phencyclidine Use Disorder",
        "clinicalDescription": {
            "overview": "Fensiklidin (PCP) Kullanım Bozukluğu, PCP ('melek tozu') ve ketamin gibi benzer etkili disosiyatif anestezik maddelerin sorunlu kullanımıdır. Bu maddeler bedenden ayrılma, gerçekdışılık, uyuşukluk ve yüksek dozda saldırganlık, psikoz ve öngörülemeyen davranışlara yol açar. DSM-5-TR'de hallüsinojenle ilişkili bozukluklar bölümünde yer alır; yoksunluk sendromu insanlarda net olarak tanımlanmadığından yoksunluk ölçütü içermez.",
            "epidemiology": "PCP kullanımı günümüzde nadirdir ve coğrafi olarak belirli bölgelerde yoğunlaşır; ketaminin keyif amaçlı kullanımı ise bazı ülkelerde artmaktadır. Genç erişkin erkeklerde daha sıktır.",
            "etiology": "PCP ve ketamin NMDA tipi glutamat reseptörlerini bloke eder (kanal blokajı) ve dopaminerjik etkinliği dolaylı olarak artırır; bu mekanizma şizofreninin glutamat hipotezine de temel oluşturmuştur.",
            "prognosis": "Uzun süreli kullanımda bellek ve bilişsel bozulma, tekrarlayan psikotik dönemler ve (ketaminde) ağır mesane hasarı (ketamin sistiti) görülebilir. Özgül bir ilaç tedavisi yoktur; psikososyal yaklaşımlar kullanılır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Sorunlu Kullanım Örüntüsü (12 ayda en az 2/10)",
                "content": "12 aylık bir dönemde aşağıdaki 10 ölçütten en az ikisinin bulunması (bu madde grubu için yoksunluk ölçütü tanımlanmamıştır):",
                "items": [
                    "1. Fensiklidin (ya da benzeri madde) çoğu zaman amaçlanandan daha fazla miktarda ya da daha uzun süre kullanılır.",
                    "2. Kullanımı bırakma ya da azaltma yönünde süreğen bir istek ya da başarısız çabalar vardır.",
                    "3. Maddeyi elde etmek, kullanmak ya da etkilerinden kurtulmak için çok zaman harcanır.",
                    "4. Kullanma yönünde yoğun istek ya da aşerme (craving) duyulur.",
                    "5. Yineleyici kullanım nedeniyle iş, okul ya da evdeki temel yükümlülükler yerine getirilemez.",
                    "6. Kullanımın yol açtığı ya da alevlendirdiği süreğen toplumsal/kişilerarası sorunlara karşın kullanım sürer.",
                    "7. Kullanım nedeniyle önemli toplumsal, mesleki ya da eğlenceye yönelik etkinlikler bırakılır ya da azaltılır.",
                    "8. Fiziksel açıdan tehlikeli durumlarda yineleyici kullanım (ör. araç kullanırken).",
                    "9. Maddenin yol açtığı ya da alevlendirdiği süreğen bedensel/ruhsal bir sorun bilindiği hâlde kullanım sürer.",
                    "10. Tolerans: aynı etki için belirgin olarak artan miktarlar gerekmesi ya da aynı miktarla belirgin olarak azalan etki."
                ]
            },
            {
                "code": "Şiddet ve Seyir Belirleyicileri",
                "title": "Hafif / Orta / Ağır; Erken / Süreğen Düzelme",
                "content": "Hafif: 2-3 ölçüt, Orta: 4-5 ölçüt, Ağır: 6 ya da daha çok ölçüt. Erken düzelme: en az 3 ay ama 12 aydan kısa süre (aşerme dışında) hiçbir ölçüt yok; süreğen düzelme: 12 ay ya da daha uzun süre. 'Denetimli bir ortamda' belirleyicisi de kullanılabilir."
            }
        ]
    },
    "hallucinogen_use_disorder": {
        "id": "hallucinogen_use_disorder",
        "nameTr": "Hallusinojen Kullanım Bozukluğu (LSD / Mantar / MDMA)",
        "nameEn": "Other Hallucinogen Use Disorder",
        "clinicalDescription": {
            "overview": "Hallüsinojen Kullanım Bozukluğu (DSM-5-TR'de 'Diğer Hallüsinojen Kullanım Bozukluğu'), LSD, psilosibin içeren mantarlar, meskalin, DMT ve MDMA gibi hallüsinojenlerin klinik açıdan belirgin sıkıntı ya da işlevsellik kaybına yol açan sorunlu kullanımıdır. Bu maddeler ile fiziksel bağımlılık ve belirgin yoksunluk görülmediğinden yoksunluk ölçütü yoktur; sorun daha çok denetim kaybı, riskli durumlarda kullanım ve psikolojik zararlar etrafında gelişir. PCP ayrı bir başlıkta yer alır.",
            "epidemiology": "Hallüsinojen kullanım bozukluğu nadir olup yıllık yaygınlığı ergenlerde erişkinlere göre daha yüksektir; erkeklerde daha sıktır. Deneme amaçlı kullanım bozukluk düzeyindeki kullanımdan çok daha yaygındır.",
            "etiology": "Klasik hallüsinojenler (LSD, psilosibin, meskalin, DMT) esas olarak serotonin 5-HT2A reseptör agonistleridir; MDMA ise serotonin (ve dopamin, noradrenalin) salınımını artırır. Toleransın çok hızlı gelişmesi günlük kullanımı sınırlar.",
            "prognosis": "Başlıca riskler 'kötü yolculuk' (yoğun panik, paranoya), yargılama bozukluğuna bağlı kazalar, psikoz yatkınlığı olanlarda psikotik bozukluğun ortaya çıkması ve hallüsinojen kalıcı algı bozukluğudur. MDMA'da hipertermi, hiponatremi ve serotonin sendromu riski vardır. Tedavi psikososyaldir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Sorunlu Kullanım Örüntüsü (12 ayda en az 2/10)",
                "content": "12 aylık bir dönemde aşağıdaki 10 ölçütten en az ikisinin bulunması (bu madde grubu için yoksunluk ölçütü tanımlanmamıştır):",
                "items": [
                    "1. Hallüsinojen çoğu zaman amaçlanandan daha fazla miktarda ya da daha uzun süre kullanılır.",
                    "2. Kullanımı bırakma ya da azaltma yönünde süreğen bir istek ya da başarısız çabalar vardır.",
                    "3. Maddeyi elde etmek, kullanmak ya da etkilerinden kurtulmak için çok zaman harcanır.",
                    "4. Kullanma yönünde yoğun istek ya da aşerme (craving) duyulur.",
                    "5. Yineleyici kullanım nedeniyle iş, okul ya da evdeki temel yükümlülükler yerine getirilemez.",
                    "6. Kullanımın yol açtığı ya da alevlendirdiği süreğen toplumsal/kişilerarası sorunlara karşın kullanım sürer.",
                    "7. Kullanım nedeniyle önemli toplumsal, mesleki ya da eğlenceye yönelik etkinlikler bırakılır ya da azaltılır.",
                    "8. Fiziksel açıdan tehlikeli durumlarda yineleyici kullanım (ör. araç kullanırken).",
                    "9. Maddenin yol açtığı ya da alevlendirdiği süreğen bedensel/ruhsal bir sorun bilindiği hâlde kullanım sürer.",
                    "10. Tolerans: aynı etki için belirgin olarak artan miktarlar gerekmesi ya da aynı miktarla belirgin olarak azalan etki."
                ]
            },
            {
                "code": "Şiddet ve Seyir Belirleyicileri",
                "title": "Hafif / Orta / Ağır; Erken / Süreğen Düzelme",
                "content": "Hafif: 2-3 ölçüt, Orta: 4-5 ölçüt, Ağır: 6 ya da daha çok ölçüt. Erken düzelme: en az 3 ay ama 12 aydan kısa süre (aşerme dışında) hiçbir ölçüt yok; süreğen düzelme: 12 ay ya da daha uzun süre. 'Denetimli bir ortamda' belirleyicisi de kullanılabilir. Etken hallüsinojen belirtilir."
            }
        ]
    },
    "inhalant_use_disorder": {
        "id": "inhalant_use_disorder",
        "nameTr": "Uçucu Madde Kullanım Bozukluğu (Tiner / Bali / Çakmak Gazı)",
        "nameEn": "Inhalant Use Disorder",
        "clinicalDescription": {
            "overview": "Uçucu Madde Kullanım Bozukluğu, tiner, yapıştırıcı ('bali'), çakmak gazı, boya, benzin ve aerosol gibi hidrokarbon bazlı uçucu maddelerin solunarak sarhoşluk amacıyla sorunlu kullanımıdır. Ucuz ve kolay erişilebilir olduğundan özellikle çocuk ve genç ergenlerde, sokakta yaşayan ya da çalışan çocuklarda görülür. Nitritler ve nitröz oksit (gülme gazı) farklı etkileri nedeniyle bu tanının dışında tutulur ve 'diğer madde' olarak ele alınır. Belirgin bir yoksunluk sendromu tanımlanmadığından yoksunluk ölçütü yoktur.",
            "epidemiology": "Uçucu madde deneme kullanımı erken ergenlikte (12-14 yaş) en sıktır; kullanım bozukluğu ergenlerde binde birkaç, erişkinlerde çok daha düşük düzeyde bildirilir. Sosyoekonomik yoksunluk, sokakta yaşama ve davranım bozukluğu ile güçlü ilişkilidir.",
            "etiology": "Uçucu hidrokarbonlar yağda çözünür olup hızla beyne geçer ve GABA-A ve NMDA reseptörleri üzerinden alkol ve sedatiflere benzer baskılayıcı etki gösterir. Erken madde kullanımı, aile içi sorunlar, istismar, davranım bozukluğu ve diğer maddelere erişimin kısıtlı olması risk etmenleridir.",
            "prognosis": "Kardiyak aritmiye bağlı ani ölüm ('ani koklama ölümü') ilk kullanımda bile görülebilir. Uzun süreli kullanım beyaz cevher hasarı (lökoensefalopati), bilişsel bozulma, periferik nöropati, işitme kaybı, karaciğer ve böbrek hasarına yol açar. Sosyal hizmetleri de içeren kapsamlı psikososyal müdahale gerekir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Sorunlu Kullanım Örüntüsü (12 ayda en az 2/10)",
                "content": "12 aylık bir dönemde aşağıdaki 10 ölçütten en az ikisinin bulunması (bu madde grubu için yoksunluk ölçütü tanımlanmamıştır):",
                "items": [
                    "1. Uçucu madde çoğu zaman amaçlanandan daha fazla miktarda ya da daha uzun süre kullanılır.",
                    "2. Kullanımı bırakma ya da azaltma yönünde süreğen bir istek ya da başarısız çabalar vardır.",
                    "3. Maddeyi elde etmek, kullanmak ya da etkilerinden kurtulmak için çok zaman harcanır.",
                    "4. Kullanma yönünde yoğun istek ya da aşerme (craving) duyulur.",
                    "5. Yineleyici kullanım nedeniyle iş, okul ya da evdeki temel yükümlülükler yerine getirilemez.",
                    "6. Kullanımın yol açtığı ya da alevlendirdiği süreğen toplumsal/kişilerarası sorunlara karşın kullanım sürer.",
                    "7. Kullanım nedeniyle önemli toplumsal, mesleki ya da eğlenceye yönelik etkinlikler bırakılır ya da azaltılır.",
                    "8. Fiziksel açıdan tehlikeli durumlarda yineleyici kullanım (ör. araç kullanırken).",
                    "9. Maddenin yol açtığı ya da alevlendirdiği süreğen bedensel/ruhsal bir sorun bilindiği hâlde kullanım sürer.",
                    "10. Tolerans: aynı etki için belirgin olarak artan miktarlar gerekmesi ya da aynı miktarla belirgin olarak azalan etki."
                ]
            },
            {
                "code": "Şiddet ve Seyir Belirleyicileri",
                "title": "Hafif / Orta / Ağır; Erken / Süreğen Düzelme",
                "content": "Hafif: 2-3 ölçüt, Orta: 4-5 ölçüt, Ağır: 6 ya da daha çok ölçüt. Erken düzelme: en az 3 ay ama 12 aydan kısa süre (aşerme dışında) hiçbir ölçüt yok; süreğen düzelme: 12 ay ya da daha uzun süre. 'Denetimli bir ortamda' belirleyicisi de kullanılabilir. Kullanılan madde belirtilir (ör. tiner, yapıştırıcı, çakmak gazı)."
            }
        ]
    },
    "tobacco_use_disorder": {
        "id": "tobacco_use_disorder",
        "nameTr": "Tütün (Nikotin) Kullanım Bozukluğu",
        "nameEn": "Tobacco Use Disorder",
        "clinicalDescription": {
            "overview": "Tütün Kullanım Bozukluğu, sigara, nargile, puro, çiğneme tütünü ve elektronik sigara gibi nikotin içeren ürünlerin denetimsiz ve zarar verici kullanımıdır. Kullanıcıların çoğu bırakmak istemesine karşın başaramaz; kalkıştan sonraki ilk dakikalar içinde sigara içme, tolerans, yoksunluk ve güçlü aşerme tipiktir. Önlenebilir ölümlerin dünyadaki başlıca nedenidir.",
            "epidemiology": "Dünyada en yaygın madde kullanım bozukluklarından biridir; günlük sigara içenlerin büyük çoğunluğu tanı ölçütlerini karşılar. Türkiye, erişkin sigara içme oranının yüksek olduğu ülkeler arasındadır. Ruhsal bozukluğu olan bireylerde (şizofreni, bipolar bozukluk, diğer madde kullanım bozuklukları) oran çok daha yüksektir.",
            "etiology": "Nikotin, nikotinik asetilkolin reseptörleri (özellikle α4β2) üzerinden mezolimbik dopamin salınımını artırır. Kalıtsal katkı belirgindir (nikotin metabolizması ve reseptör genleri); ergenlikte başlama, çevrede sigara içilmesi ve koşullanmış ipuçları kullanımı sürdürür.",
            "prognosis": "Kendi başına bırakma girişimlerinin uzun dönem başarısı düşüktür. Davranışsal destek ile ilaç tedavisinin (nikotin replasmanı, vareniklin, bupropion) birlikte kullanılması başarıyı belirgin olarak artırır. Bırakmak her yaşta sağlık yararı sağlar."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Sorunlu Kullanım Örüntüsü (12 ayda en az 2/11)",
                "content": "12 aylık bir dönemde aşağıdaki 11 ölçütten en az ikisinin bulunması:",
                "items": [
                    "1. Tütün çoğu zaman amaçlanandan daha fazla miktarda ya da daha uzun süre kullanılır.",
                    "2. Kullanımı bırakma ya da azaltma yönünde süreğen bir istek ya da başarısız çabalar vardır.",
                    "3. Maddeyi elde etmek, kullanmak ya da etkilerinden kurtulmak için çok zaman harcanır.",
                    "4. Kullanma yönünde yoğun istek ya da aşerme (craving) duyulur.",
                    "5. Yineleyici kullanım nedeniyle iş, okul ya da evdeki temel yükümlülükler yerine getirilemez.",
                    "6. Kullanımın yol açtığı ya da alevlendirdiği süreğen toplumsal/kişilerarası sorunlara karşın kullanım sürer.",
                    "7. Kullanım nedeniyle önemli toplumsal, mesleki ya da eğlenceye yönelik etkinlikler bırakılır ya da azaltılır.",
                    "8. Fiziksel açıdan tehlikeli durumlarda yineleyici kullanım (ör. araç kullanırken).",
                    "9. Maddenin yol açtığı ya da alevlendirdiği süreğen bedensel/ruhsal bir sorun bilindiği hâlde kullanım sürer.",
                    "10. Tolerans: aynı etki için belirgin olarak artan miktarlar gerekmesi ya da aynı miktarla belirgin olarak azalan etki.",
                    "11. Yoksunluk: maddeye özgü yoksunluk sendromu ya da yoksunluktan kaçınmak veya kurtulmak için aynı (ya da yakın) maddeyi alma."
                ]
            },
            {
                "code": "Şiddet ve Seyir Belirleyicileri",
                "title": "Hafif / Orta / Ağır; Erken / Süreğen Düzelme",
                "content": "Hafif: 2-3 ölçüt, Orta: 4-5 ölçüt, Ağır: 6 ya da daha çok ölçüt. Erken düzelme: en az 3 ay ama 12 aydan kısa süre (aşerme dışında) hiçbir ölçüt yok; süreğen düzelme: 12 ay ya da daha uzun süre. 'Denetimli bir ortamda' belirleyicisi de kullanılabilir. Ayrıca 'idame tedavisi altında' (ör. nikotin replasmanı, vareniklin kullanırken başka ölçüt kalmaması) belirleyicisi kullanılabilir."
            },
            {
                "code": "Not",
                "title": "Tütüne Özgü Örnekler",
                "content": "Tütünde rol yükümlülüklerini aksatma ve toplumsal sorunlar diğer maddelere göre daha az belirgindir; tanıda daha çok denetim kaybı (bırakamama), aşerme, tolerans, yoksunluk ve sağlık sorunlarına karşın sürdürme ölçütleri öne çıkar."
            }
        ]
    },
    "tobacco_withdrawal": {
        "id": "tobacco_withdrawal",
        "nameTr": "Tütün (Nikotin) Yoksunluğu",
        "nameEn": "Tobacco Withdrawal",
        "clinicalDescription": {
            "overview": "Tütün Yoksunluğu, en az birkaç hafta günlük tütün kullanımından sonra kullanımın ani bırakılması ya da azaltılmasını izleyen 24 saat içinde başlayan; irritabilite, anksiyete, odaklanma güçlüğü, iştah artışı, huzursuzluk, çökkün duygudurum ve uykusuzlukla seyreden sendromdur. Belirtiler bırakma girişimlerinin başarısız olmasının en önemli nedenlerindendir.",
            "epidemiology": "Sigarayı bırakmaya çalışan günlük içicilerin yaklaşık yarısı ya da daha fazlasında yoksunluk belirtileri görülür.",
            "etiology": "Süreğen nikotin maruziyeti nikotinik reseptörlerin sayısını ve duyarlılığını değiştirir; nikotin kesilince dopaminerjik ve noradrenerjik iletimdeki düşüş belirtilere yol açar.",
            "prognosis": "Belirtiler genellikle ilk günlerde (ilk hafta) zirve yapar ve 2-4 hafta içinde geriler; iştah artışı ve aşerme daha uzun sürebilir. Bırakma sonrası kilo alımı sıktır. Nikotin replasmanı ve diğer ilaç tedavileri yoksunluk belirtilerini hafifletir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Günlük Kullanım",
                "content": "En az birkaç hafta süren günlük tütün kullanımı."
            },
            {
                "code": "Kriter B",
                "title": "Yoksunluk Belirtileri (24 saat içinde, en az 4/7)",
                "content": "Kullanımın ani bırakılması ya da azaltılmasından sonraki 24 saat içinde aşağıdakilerden en az dördünün gelişmesi:",
                "items": [
                    "1. İrritabilite, engellenmişlik duygusu ya da öfke.",
                    "2. Anksiyete.",
                    "3. Odaklanma güçlüğü.",
                    "4. İştah artışı.",
                    "5. Huzursuzluk.",
                    "6. Çökkün duygudurum.",
                    "7. Uykusuzluk."
                ]
            },
            {
                "code": "Kriter C & D",
                "title": "Klinik Önem ve Dışlama",
                "content": "Belirtiler klinik açıdan belirgin sıkıntıya ya da işlevsellik kaybına yol açar; başka bir sağlık durumuna bağlanamaz ve başka bir maddeyle entoksikasyon ya da yoksunluk dahil başka bir ruhsal bozuklukla daha iyi açıklanamaz."
            }
        ]
    },
    "caffeine_intoxication": {
        "id": "caffeine_intoxication",
        "nameTr": "Kafein Zehirlenmesi (İntoksikasyonu)",
        "nameEn": "Caffeine Intoxication",
        "clinicalDescription": {
            "overview": "Kafein Entoksikasyonu, yakın zamanda yüksek miktarda kafein alınmasının (çoğunlukla günlük 250 mg'ın belirgin olarak üzerinde; kahve, enerji içeceği, kafein tableti) ardından gelişen huzursuzluk, sinirlilik, heyecan, uykusuzluk, yüzde kızarma, sık idrara çıkma, sindirim yakınmaları, kas seğirmeleri, düşünce ve konuşmada dağınıklık, taşikardi/aritmi, yorulmazlık dönemleri ve psikomotor ajitasyonla seyreden tablodur. Çok yüksek dozlarda nöbet, ağır aritmi ve ölüm bildirilmiştir.",
            "epidemiology": "Kesin yaygınlık bilinmemektedir. Kafein toleransı olmayan kişilerde, enerji içeceği ve kafein takviyesi tüketen gençlerde ve yüksek dozda saf kafein tozu/tablet kullanımında risk artar.",
            "etiology": "Kafein adenozin reseptör antagonistidir; adenozinin baskılayıcı etkisini engelleyerek santral uyarılma ve sempatik etkinlik yaratır. Kafein metabolizmasını yavaşlatan durumlar (gebelik, bazı ilaçlar ör. fluvoksamin, karaciğer hastalığı) duyarlılığı artırır.",
            "prognosis": "Kafeinin yarı ömrü birkaç saat olduğundan belirtiler genellikle bir gün içinde geçer. Panik bozukluk ve anksiyete bozukluklarıyla karışabilir; tekrarlayan başvurularda kafein tüketimi mutlaka sorgulanmalıdır. Ağır toksisite acil tıbbi tedavi gerektirir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Yüksek Doz Kafein Alımı",
                "content": "Yakın zamanda yüksek miktarda kafein alınmış olması (tipik olarak 250 mg'ın belirgin olarak üzerinde)."
            },
            {
                "code": "Kriter B",
                "title": "Entoksikasyon Belirtileri (En az 5/12)",
                "content": "Alım sırasında ya da kısa süre sonra aşağıdakilerden en az beşinin gelişmesi:",
                "items": [
                    "1. Huzursuzluk.",
                    "2. Sinirlilik.",
                    "3. Heyecan / aşırı uyarılmışlık.",
                    "4. Uykusuzluk.",
                    "5. Yüzde kızarma.",
                    "6. Sık idrara çıkma (diürez).",
                    "7. Sindirim sistemi yakınmaları.",
                    "8. Kas seğirmeleri.",
                    "9. Düşünce ve konuşma akışında dağınıklık.",
                    "10. Taşikardi ya da kardiyak aritmi.",
                    "11. Yorulmazlık dönemleri.",
                    "12. Psikomotor ajitasyon."
                ]
            },
            {
                "code": "Kriter C & D",
                "title": "Klinik Önem ve Dışlama",
                "content": "Belirtiler klinik açıdan belirgin sıkıntıya ya da işlevsellik kaybına yol açar; başka bir sağlık durumuna bağlanamaz ve başka bir maddeyle entoksikasyon dahil başka bir ruhsal bozuklukla (ör. anksiyete bozukluğu) daha iyi açıklanamaz."
            }
        ]
    },
    "caffeine_withdrawal": {
        "id": "caffeine_withdrawal",
        "nameTr": "Kafein Yoksunluğu (Baş Ağrısı, Yorgunluk)",
        "nameEn": "Caffeine Withdrawal",
        "clinicalDescription": {
            "overview": "Kafein Yoksunluğu, uzun süreli günlük kafein kullanımının ani bırakılması ya da azaltılmasından sonraki 24 saat içinde başlayan baş ağrısı, belirgin yorgunluk ya da uyuklama, disforik/çökkün duygudurum ya da irritabilite, odaklanma güçlüğü ve grip benzeri bedensel belirtilerle (bulantı, kusma, kas ağrısı/sertliği) seyreden sendromdur. Hafta sonu ya da tatilde kahve içmemeye bağlı baş ağrıları ve ameliyat öncesi açlık döneminde görülen baş ağrıları tipik örneklerdir.",
            "epidemiology": "Düzenli kafein tüketenlerin önemli bir kısmında kafein kesildiğinde yoksunluk belirtileri görülür; görece düşük günlük dozlarda bile ortaya çıkabilir.",
            "etiology": "Süreğen kafein kullanımı adenozin reseptörlerinin sayısında artışa yol açar; kafein kesilince artan adenozin etkisi serebral damarlarda genişleme (baş ağrısı) ve uyuklamaya neden olur.",
            "prognosis": "Belirtiler genellikle 12-24 saat içinde başlar, 1-2 gün içinde zirve yapar ve 2-9 gün içinde geriler. Yaşamı tehdit etmez; kafein alımının kademeli olarak azaltılması belirtileri önler."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Uzun Süreli Günlük Kullanım",
                "content": "Uzun süreli günlük kafein kullanımı."
            },
            {
                "code": "Kriter B",
                "title": "Yoksunluk Belirtileri (24 saat içinde, en az 3/5)",
                "content": "Kafein kullanımının ani bırakılması ya da azaltılmasından sonraki 24 saat içinde aşağıdakilerden en az üçünün gelişmesi:",
                "items": [
                    "1. Baş ağrısı.",
                    "2. Belirgin yorgunluk ya da uyuklama.",
                    "3. Disforik ya da çökkün duygudurum veya irritabilite.",
                    "4. Odaklanma güçlüğü.",
                    "5. Grip benzeri belirtiler (bulantı, kusma ya da kas ağrısı/sertliği)."
                ]
            },
            {
                "code": "Kriter C & D",
                "title": "Klinik Önem ve Dışlama",
                "content": "Belirtiler klinik açıdan belirgin sıkıntıya ya da işlevsellik kaybına yol açar; başka bir sağlık durumunun (ör. migren, viral hastalık) fizyolojik etkilerine bağlanamaz ve başka bir ruhsal bozuklukla daha iyi açıklanamaz."
            }
        ]
    },
    "mild_neurocognitive_alzheimer": {
        "id": "mild_neurocognitive_alzheimer",
        "nameTr": "Hafif Nörobilişsel Bozukluk (Alzheimer Hastalığına Bağlı / MCI)",
        "nameEn": "Mild Neurocognitive Disorder Due to Alzheimer's Disease",
        "clinicalDescription": {
            "overview": "Alzheimer Hastalığına Bağlı Hafif Nörobilişsel Bozukluk, Alzheimer patolojisine bağlı olarak başta öğrenme ve bellek olmak üzere bilişsel işlevlerde ölçülebilir ama günlük yaşamda bağımsızlığı bozmayan ılımlı gerilemedir. Kişi ve yakınları unutkanlıkta artış fark eder; testlerde yaşa ve eğitime göre beklenenin altında performans görülür, ancak kişi daha fazla çaba ve hatırlatıcılarla işlerini sürdürür. Klinik literatürdeki 'hafif bilişsel bozukluk' (MCI) kavramıyla büyük ölçüde örtüşür.",
            "epidemiology": "65 yaş üstünde hafif bilişsel bozukluk yaygınlığı çalışmalara göre yaklaşık %10-20 arasında bildirilir; bunların önemli bir kısmının nedeni Alzheimer hastalığıdır. Klinik örneklemlerde her yıl hastaların bir bölümü demansa ilerler; toplum örneklemlerinde bu oran daha düşüktür.",
            "etiology": "Amiloid-beta birikimi ve tau patolojisi (nörofibriler yumaklar) belirtiler başlamadan yıllar önce başlar; hipokampus ve entorinal korteks erken etkilenir. APOE ε4 taşıyıcılığı en önemli kalıtsal risk etmenidir; nadir ailesel formlarda APP, PSEN1, PSEN2 mutasyonları bulunur.",
            "prognosis": "Seyir ilerleyicidir; bir kısmı yıllar içinde majör nörobilişsel bozukluğa geçer, bir kısmı ise uzun süre durağan kalır (özellikle biyobelirteç kanıtı olmayanlarda). Vasküler risk etmenlerinin denetimi, fiziksel ve bilişsel etkinlik ve düzenli izlem önerilir. Yeni amiloid hedefli tedaviler bu erken evre için geliştirilmiştir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Hafif Nörobilişsel Bozukluk",
                "content": "Hafif nörobilişsel bozukluk ölçütleri karşılanır: bir ya da daha fazla bilişsel alanda önceki düzeye göre ılımlı gerileme (kaygı + test ile belgelenmiş ılımlı bozulma); eksiklikler günlük etkinliklerde bağımsızlığı bozmaz (daha fazla çaba, telafi stratejileri ya da uyum gerekebilir); yalnızca deliryum sırasında ortaya çıkmaz ve başka bir ruhsal bozuklukla daha iyi açıklanamaz."
            },
            {
                "code": "Kriter B & C",
                "title": "Sinsi Başlangıç ve Tedrici İlerleme",
                "content": "Bir ya da daha fazla bilişsel alanda sinsi başlangıç ve tedrici ilerleme vardır."
            },
            {
                "code": "Olası / Muhtemel Ayrımı",
                "title": "Alzheimer Etiyolojisinin Kesinlik Düzeyi",
                "content": "Hafif NBB'de 'muhtemel' Alzheimer hastalığı ancak genetik test ya da aile öyküsünden Alzheimer'a yol açan bir gen mutasyonu kanıtı varsa söylenir. Bu kanıt yoksa ve şu üç özelliğin tümü varsa 'olası' Alzheimer hastalığı denir: (1) bellek ve öğrenmede gerilemenin açık kanıtı, (2) uzun duraklama dönemleri olmaksızın süregiden tedrici gerileme, (3) karışık etiyoloji kanıtı olmaması (başka nörodejeneratif ya da serebrovasküler hastalık, başka nörolojik/ruhsal ya da sistemik hastalık yok)."
            },
            {
                "code": "Kriter D",
                "title": "Dışlama",
                "content": "Bozukluk serebrovasküler hastalık, başka bir nörodejeneratif hastalık, madde etkisi ya da başka bir ruhsal, nörolojik veya sistemik bozuklukla daha iyi açıklanamaz."
            }
        ]
    },
    "major_neurocognitive_vascular": {
        "id": "major_neurocognitive_vascular",
        "nameTr": "Majör Nörobilişsel Bozukluk (Vasküler / Damarsal Demans)",
        "nameEn": "Major Vascular Neurocognitive Disorder",
        "clinicalDescription": {
            "overview": "Majör Vasküler Nörobilişsel Bozukluk (vasküler demans), serebrovasküler hastalığa (büyük damar inmeleri, çok sayıda küçük enfarkt, yaygın küçük damar hastalığı/beyaz cevher lezyonları) bağlı olarak gelişen ve günlük yaşamda bağımsızlığı bozan bilişsel gerilemedir. Bellekten çok karmaşık dikkat, işlem hızı ve yönetsel işlevlerde bozulma öne çıkar; inme sonrası ani ya da basamaklı kötüleşme, yürüme bozukluğu, idrar sıkışması, duygusal değişkenlik, apati ve depresyon sık görülür.",
            "epidemiology": "Alzheimer hastalığından sonra en sık ikinci demans nedenidir. Yaşla birlikte artar; hipertansiyon, diyabet, sigara, hiperlipidemi, atriyal fibrilasyon ve inme öyküsü olanlarda daha sıktır. Alzheimer patolojisiyle birlikteliği (karışık demans) çok yaygındır.",
            "etiology": "İskemik ya da hemorajik inmeler, kortikal-subkortikal bağlantıları kesen lakün enfarktlar, beyaz cevher hiperintensiteleri ve mikrokanamalar başlıca patolojilerdir. CADASIL gibi kalıtsal küçük damar hastalıkları nadir nedenlerdir.",
            "prognosis": "Seyir değişkendir: inmelerle basamaklı kötüleşme, küçük damar hastalığında yavaş ilerleme ya da dönemsel duraklama görülebilir. Vasküler risk etmenlerinin sıkı denetimi ve ikincil inme önlemi ilerlemeyi yavaşlatabilir; rehabilitasyon ve bakım veren desteği önemlidir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Majör Nörobilişsel Bozukluk",
                "content": "Majör nörobilişsel bozukluk ölçütleri karşılanır: bir ya da daha fazla bilişsel alanda (karmaşık dikkat, yönetsel işlev, öğrenme ve bellek, dil, algısal-motor, toplumsal biliş) önceki düzeye göre belirgin gerileme (kişinin, yakınının ya da klinisyenin kaygısı ve tercihen standart testlerle belgelenmiş belirgin bozulma) ve bu eksikliklerin günlük yaşam etkinliklerinde bağımsızlığı bozması; yalnızca deliryum sırasında ortaya çıkmaması ve başka bir ruhsal bozuklukla daha iyi açıklanmaması."
            },
            {
                "code": "Kriter B",
                "title": "Vasküler Etiyolojiyle Uyumlu Klinik Özellikler",
                "content": "Aşağıdakilerden biri: (1) bilişsel eksikliklerin başlangıcının bir ya da daha fazla serebrovasküler olayla zamansal ilişkili olması; (2) gerilemenin özellikle karmaşık dikkat (işlem hızı dahil) ve ön-yönetsel işlevlerde belirgin olması."
            },
            {
                "code": "Kriter C & D",
                "title": "Serebrovasküler Hastalık Kanıtı ve Dışlama",
                "content": "Öykü, fizik muayene ve/veya nörogörüntülemede bilişsel eksiklikleri açıklamaya yetecek serebrovasküler hastalık kanıtı bulunur; belirtiler başka bir beyin hastalığı ya da sistemik bozuklukla daha iyi açıklanamaz."
            },
            {
                "code": "Muhtemel / Olası",
                "title": "Kesinlik Düzeyi",
                "content": "Klinik ölçütler nörogörüntülemede belirgin parankim hasarıyla destekleniyorsa, bilişsel bozulma belgelenmiş serebrovasküler olay(lar)la zamansal ilişkiliyse ya da hem klinik hem genetik (ör. CADASIL) kanıt varsa 'muhtemel'; klinik ölçütler karşılanıp nörogörüntüleme yapılamamışsa ya da zamansal ilişki kurulamıyorsa 'olası' denir."
            },
            {
                "code": "Belirleyiciler",
                "title": "Davranış Bozukluğu ve Şiddet",
                "content": "Davranışsal bozukluk eşlik edip etmediği (psikotik belirtiler, duygudurum belirtileri, ajitasyon, apati vb.) belirtilir. Majör NBB'de şiddet: Hafif (araçsal günlük etkinliklerde, ör. ev işi, para yönetimi, güçlük), Orta (temel günlük etkinliklerde, ör. yemek yeme, giyinme, güçlük), Ağır (tamamen bağımlı)."
            }
        ]
    },
    "mild_neurocognitive_vascular": {
        "id": "mild_neurocognitive_vascular",
        "nameTr": "Hafif Vasküler Nörobilişsel Bozukluk",
        "nameEn": "Mild Vascular Neurocognitive Disorder",
        "clinicalDescription": {
            "overview": "Hafif Vasküler Nörobilişsel Bozukluk, serebrovasküler hastalığa bağlı olarak özellikle dikkat, işlem hızı ve yönetsel işlevlerde ılımlı gerileme bulunması, ancak günlük yaşamda bağımsızlığın korunmasıdır. Kişi işlerini yavaş, daha çok çabayla ya da listeler/hatırlatıcılar gibi telafi yöntemleriyle sürdürür. İnme sonrası bilişsel bozulmanın ve 'vasküler hafif bilişsel bozukluk' tablolarının önemli bir kısmı bu tanıyla karşılanır.",
            "epidemiology": "İnme geçiren hastaların önemli bir kısmında sonraki aylarda bir düzeyde bilişsel bozulma saptanır. Vasküler risk etmenleri yüksek yaşlılarda küçük damar hastalığına bağlı hafif tablolar yaygındır.",
            "etiology": "Majör vasküler nörobilişsel bozuklukla aynıdır: inmeler, lakün enfarktlar ve yaygın beyaz cevher hastalığı ile ön-subkortikal devrelerin bozulması.",
            "prognosis": "Bir kısmı majör vasküler nörobilişsel bozukluğa ilerler, bir kısmı (özellikle tek inme sonrası) durağan kalır ya da kısmen düzelir. Risk etmenlerinin (hipertansiyon, diyabet, sigara, atriyal fibrilasyon) sıkı denetimi ilerlemeyi önlemede temel yaklaşımdır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Hafif Nörobilişsel Bozukluk",
                "content": "Hafif nörobilişsel bozukluk ölçütleri karşılanır: bir ya da daha fazla bilişsel alanda önceki düzeye göre ılımlı gerileme (kaygı + test ile belgelenmiş ılımlı bozulma); eksiklikler günlük etkinliklerde bağımsızlığı bozmaz (daha fazla çaba, telafi stratejileri ya da uyum gerekebilir); yalnızca deliryum sırasında ortaya çıkmaz ve başka bir ruhsal bozuklukla daha iyi açıklanamaz."
            },
            {
                "code": "Kriter B",
                "title": "Vasküler Etiyolojiyle Uyumlu Klinik Özellikler",
                "content": "Bilişsel eksikliklerin başlangıcının serebrovasküler olay(lar)la zamansal ilişkili olması ya da gerilemenin özellikle karmaşık dikkat (işlem hızı dahil) ve ön-yönetsel işlevlerde belirgin olması."
            },
            {
                "code": "Kriter C & D",
                "title": "Serebrovasküler Hastalık Kanıtı ve Dışlama",
                "content": "Öykü, muayene ve/veya nörogörüntülemede eksiklikleri açıklamaya yetecek serebrovasküler hastalık kanıtı bulunur; tablo başka bir beyin hastalığı ya da sistemik bozuklukla daha iyi açıklanamaz. 'Muhtemel' ve 'olası' ayrımı majör vasküler NBB'deki ile aynıdır."
            },
            {
                "code": "Majör Tipten Farkı",
                "title": "Bağımsızlığın Korunması",
                "content": "Majör tipten tek ayırıcı özellik, eksikliklerin günlük yaşam etkinliklerinde bağımsızlığı bozmaması ve test performansındaki düşüşün daha ılımlı olmasıdır."
            }
        ]
    },
    "major_neurocognitive_parkinson": {
        "id": "major_neurocognitive_parkinson",
        "nameTr": "Majör Nörobilişsel Bozukluk (Parkinson Hastalığına Bağlı)",
        "nameEn": "Major Neurocognitive Disorder Due to Parkinson's Disease",
        "clinicalDescription": {
            "overview": "Parkinson Hastalığına Bağlı Majör Nörobilişsel Bozukluk, tanısı yerleşmiş Parkinson hastalığı seyrinde, motor belirtilerden yıllar sonra sinsi başlayan ve tedrici ilerleyen bilişsel gerilemedir. Yönetsel işlev bozukluğu, dikkatte dalgalanma, düşünce yavaşlığı (bradifreni), görsel-uzamsal güçlükler ve bellekte geri çağırma sorunları öne çıkar; apati, depresyon, anksiyete, görsel varsanılar ve REM uykusu davranış bozukluğu sık eşlik eder.",
            "epidemiology": "Parkinson hastalarında demans görülme oranı yüksektir ve hastalık süresi uzadıkça artar; uzun izlem çalışmalarında hastaların çoğunluğunun zamanla demans geliştirdiği bildirilmiştir. İleri yaş, ağır motor tablo (özellikle postüral instabilite-yürüme bozukluğu baskın tip) ve erken görsel varsanılar risk etmenleridir.",
            "etiology": "Alfa-sinüklein patolojisinin (Lewy cisimcikleri) beyin sapından kortikal ve limbik bölgelere yayılması; kolinerjik (Meynert çekirdeği), dopaminerjik ve noradrenerjik sistemlerde kayıp. Eşlik eden Alzheimer patolojisi sık görülür.",
            "prognosis": "İlerleyicidir; demansın gelişmesi düşme, bakım evine yerleşme ve ölüm riskini artırır. Kolinesteraz inhibitörleri bazı hastalarda yarar sağlar. Antipsikotiklere aşırı duyarlılık nedeniyle varsanılarda ilaç seçimi dikkatle yapılmalıdır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Majör Nörobilişsel Bozukluk",
                "content": "Majör nörobilişsel bozukluk ölçütleri karşılanır: bir ya da daha fazla bilişsel alanda (karmaşık dikkat, yönetsel işlev, öğrenme ve bellek, dil, algısal-motor, toplumsal biliş) önceki düzeye göre belirgin gerileme (kişinin, yakınının ya da klinisyenin kaygısı ve tercihen standart testlerle belgelenmiş belirgin bozulma) ve bu eksikliklerin günlük yaşam etkinliklerinde bağımsızlığı bozması; yalnızca deliryum sırasında ortaya çıkmaması ve başka bir ruhsal bozuklukla daha iyi açıklanmaması."
            },
            {
                "code": "Kriter B & C",
                "title": "Parkinson Hastalığı Zemini, Sinsi Başlangıç",
                "content": "Bozukluk tanısı yerleşmiş Parkinson hastalığı seyrinde ortaya çıkar; sinsi başlangıç ve tedrici ilerleme gösterir."
            },
            {
                "code": "Kriter D",
                "title": "Dışlama",
                "content": "Bilişsel bozukluk başka bir sağlık durumuna bağlanamaz ve başka bir ruhsal bozuklukla daha iyi açıklanamaz."
            },
            {
                "code": "Muhtemel / Olası",
                "title": "Kesinlik Düzeyi",
                "content": "Hem (1) karışık etiyoloji kanıtı olmaması hem de (2) Parkinson hastalığının bilişsel gerilemenin başlangıcından açıkça önce başlamış olması durumunda 'muhtemel'; bunlardan yalnızca biri karşılanıyorsa 'olası' denir."
            },
            {
                "code": "Ayırıcı Tanı",
                "title": "Lewy Cisimcikli Nörobilişsel Bozukluktan Ayrım",
                "content": "Bilişsel gerileme motor belirtilerden önce ya da yaklaşık aynı dönemde (klinik uzlaşıda kullanılan kural: motor belirtilerden sonraki ilk bir yıl içinde) başlıyorsa Lewy cisimcikli demans düşünülür; motor belirtiler yıllarca önce başlamışsa Parkinson hastalığına bağlı demans tanısı konur."
            }
        ]
    },
    "major_neurocognitive_tbi": {
        "id": "major_neurocognitive_tbi",
        "nameTr": "Majör Nörobilişsel Bozukluk (Travmatik Beyin Hasarına Bağlı)",
        "nameEn": "Major Neurocognitive Disorder Due to Traumatic Brain Injury",
        "clinicalDescription": {
            "overview": "Travmatik Beyin Hasarına Bağlı Majör Nörobilişsel Bozukluk, kafaya çarpma ya da beynin kafatası içinde hızla yer değiştirmesine yol açan bir travmanın ardından hemen (ya da bilinç geri geldikten hemen sonra) ortaya çıkan ve akut dönemin ötesinde süren, günlük yaşamda bağımsızlığı bozan bilişsel bozulmadır. Karmaşık dikkat, işlem hızı, yönetsel işlevler ve bellek sık etkilenir; irritabilite, dürtüsellik, duygudurum değişkenliği, apati, kişilik değişiklikleri, baş ağrısı ve uyku sorunları eşlik edebilir. Tekrarlayan kafa darbelerine bağlı kronik travmatik ensefalopati (KTE; boksörler, Amerikan futbolcuları) DSM'de ayrı bir tanı değildir, ancak bu bağlamda tartışılır.",
            "epidemiology": "Travmatik beyin hasarı gençlerde (trafik kazaları, spor, şiddet) ve yaşlılarda (düşmeler) en sıktır; erkeklerde daha yaygındır. Hafif travmaların çoğunda kalıcı nörobilişsel bozukluk gelişmez; majör tablo genellikle orta-ağır travma sonrasında görülür.",
            "etiology": "Fokal kontüzyonlar ve kanamalar ile yaygın aksonal hasar (özellikle frontal ve temporal loblar ile beyaz cevher yolları) başlıca mekanizmalardır. KTE'de tau proteini birikimi tanımlanmıştır.",
            "prognosis": "Tek bir travma sonrasında bozulma genellikle ilk aylarda en belirgindir ve zamanla kısmen düzelebilir; ağır travma, ileri yaş ve tekrarlayan travmalar kalıcı bozulma riskini artırır. Bilişsel rehabilitasyon, davranışsal belirtilerin tedavisi ve aileye destek temel yaklaşımlardır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Majör Nörobilişsel Bozukluk",
                "content": "Majör nörobilişsel bozukluk ölçütleri karşılanır: bir ya da daha fazla bilişsel alanda (karmaşık dikkat, yönetsel işlev, öğrenme ve bellek, dil, algısal-motor, toplumsal biliş) önceki düzeye göre belirgin gerileme (kişinin, yakınının ya da klinisyenin kaygısı ve tercihen standart testlerle belgelenmiş belirgin bozulma) ve bu eksikliklerin günlük yaşam etkinliklerinde bağımsızlığı bozması; yalnızca deliryum sırasında ortaya çıkmaması ve başka bir ruhsal bozuklukla daha iyi açıklanmaması."
            },
            {
                "code": "Kriter B",
                "title": "Travmatik Beyin Hasarı Kanıtı",
                "content": "Kafaya çarpma ya da beynin kafatası içinde hızla yer değiştirmesine yol açan başka bir mekanizmayla oluşmuş travmatik beyin hasarı ve buna ek olarak aşağıdakilerden en az biri:",
                "items": [
                    "1. Bilinç kaybı.",
                    "2. Travma sonrası bellek yitimi (amnezi).",
                    "3. Yönelim bozukluğu ve konfüzyon.",
                    "4. Nörolojik bulgular (ör. nörogörüntülemede hasar, yeni başlayan nöbetler ya da var olan nöbet bozukluğunun belirgin kötüleşmesi, görme alanı kaybı, koku kaybı, hemiparezi)."
                ]
            },
            {
                "code": "Kriter C",
                "title": "Zamansal İlişki ve Süreklilik",
                "content": "Nörobilişsel bozukluk travmadan hemen sonra ya da bilinç geri geldikten hemen sonra ortaya çıkar ve akut travma sonrası dönemin ötesinde sürer."
            },
            {
                "code": "Ayırıcı Not",
                "title": "Travma Sonrası Stres Bozukluğu ve Madde Kullanımı",
                "content": "TSSB'ye bağlı dikkat/bellek yakınmaları, eşlik eden madde kullanımı ve özellikle adli ya da tazminat süreçlerinde semptom abartması (geçerlilik testleri) ayırıcı tanıda değerlendirilmelidir."
            }
        ]
    },
    "major_neurocognitive_hiv": {
        "id": "major_neurocognitive_hiv",
        "nameTr": "Majör Nörobilişsel Bozukluk (HIV Enfeksiyonuna Bağlı)",
        "nameEn": "Major Neurocognitive Disorder Due to HIV Infection",
        "clinicalDescription": {
            "overview": "HIV Enfeksiyonuna Bağlı Majör Nörobilişsel Bozukluk, belgelenmiş HIV enfeksiyonu olan bir kişide virüsün beyin üzerindeki etkilerine bağlanan ve günlük yaşamda bağımsızlığı bozan bilişsel gerilemedir. Tipik olarak 'subkortikal' bir örüntü görülür: düşünce ve hareketlerde yavaşlama, dikkat ve yönetsel işlevlerde bozulma, yeni bilgiyi öğrenme ve geri çağırma güçlüğü, apati ve motor yavaşlık. Klinik literatürde HIV ile ilişkili nörobilişsel bozukluklar (HAND) asemptomatik, hafif ve demans düzeyinde sınıflandırılır; bu tanı en ağır uçta (HIV ilişkili demans) yer alır.",
            "epidemiology": "Etkili antiretroviral tedavinin (ART) yaygınlaşmasıyla HIV ilişkili demans belirgin olarak azalmıştır; ancak daha hafif nörobilişsel bozulmalar HIV ile yaşayan bireylerde hâlâ sık görülür. Tedavisiz, ileri evre (düşük CD4) enfeksiyonda risk yüksektir.",
            "etiology": "HIV beyne enfekte monosit/makrofajlar aracılığıyla erken dönemde girer; mikroglia etkinleşmesi, inflamatuvar sitokinler ve viral proteinlerin nörotoksik etkileri özellikle bazal ganglionlar ve beyaz cevheri etkiler.",
            "prognosis": "ART ile bilişsel işlevlerde durağanlaşma ya da düzelme görülebilir. Fırsatçı enfeksiyonlar (PML, kriptokok menenjiti, toksoplazmoz), lenfoma, madde kullanımı ve depresyon gibi geri döndürülebilir nedenler mutlaka dışlanmalıdır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Majör Nörobilişsel Bozukluk",
                "content": "Majör nörobilişsel bozukluk ölçütleri karşılanır: bir ya da daha fazla bilişsel alanda (karmaşık dikkat, yönetsel işlev, öğrenme ve bellek, dil, algısal-motor, toplumsal biliş) önceki düzeye göre belirgin gerileme (kişinin, yakınının ya da klinisyenin kaygısı ve tercihen standart testlerle belgelenmiş belirgin bozulma) ve bu eksikliklerin günlük yaşam etkinliklerinde bağımsızlığı bozması; yalnızca deliryum sırasında ortaya çıkmaması ve başka bir ruhsal bozuklukla daha iyi açıklanmaması."
            },
            {
                "code": "Kriter B",
                "title": "Belgelenmiş HIV Enfeksiyonu",
                "content": "İnsan bağışıklık yetmezliği virüsü (HIV) enfeksiyonu belgelenmiştir."
            },
            {
                "code": "Kriter C & D",
                "title": "Dışlama",
                "content": "Nörobilişsel bozukluk, HIV dışı durumlarla (ilerleyici multifokal lökoensefalopati, kriptokok menenjiti gibi ikincil beyin hastalıkları dahil) daha iyi açıklanamaz; başka bir sağlık durumuna bağlanamaz ve başka bir ruhsal bozuklukla daha iyi açıklanamaz."
            },
            {
                "code": "Belirleyiciler",
                "title": "Davranış Bozukluğu ve Şiddet",
                "content": "Davranışsal bozukluk eşlik edip etmediği (psikotik belirtiler, duygudurum belirtileri, ajitasyon, apati vb.) belirtilir. Majör NBB'de şiddet: Hafif (araçsal günlük etkinliklerde, ör. ev işi, para yönetimi, güçlük), Orta (temel günlük etkinliklerde, ör. yemek yeme, giyinme, güçlük), Ağır (tamamen bağımlı)."
            }
        ]
    },
    "major_neurocognitive_another_medical": {
        "id": "major_neurocognitive_another_medical",
        "nameTr": "Başka Bir Sağlık Durumuna Bağlı Majör Nörobilişsel Bozukluk",
        "nameEn": "Major Neurocognitive Disorder Due to Another Medical Condition",
        "clinicalDescription": {
            "overview": "Majör nörobilişsel bozukluk ölçütlerinin karşılandığı ve öykü, fizik muayene ya da laboratuvar bulgularıyla bilişsel gerilemenin, DSM-5-TR'de ayrıca adlandırılan nedenler (Alzheimer hastalığı, vasküler hastalık, Lewy cisimcikleri, frontotemporal dejenerasyon, travmatik beyin hasarı, HIV, prion, Parkinson ve Huntington hastalıkları, madde/ilaç) dışında başka bir sağlık durumunun patofizyolojik sonucu olduğunun gösterildiği durumdur. Örnekler: normal basınçlı hidrosefali, beyin tümörü, subdural hematom, multipl skleroz, hipotiroidi, B12 eksikliği, nörosifiliz ve diğer enfeksiyonlar, sistemik lupus. Normal basınçlı hidrosefali; yürüme bozukluğu, idrar kaçırma ve bilişsel yavaşlama üçlüsü (Hakim-Adams) ve şant cerrahisiyle düzelebilmesiyle bu grubun en bilinen örneğidir.",
            "epidemiology": "Nedenlere göre değişir; ayrı bir yaygınlık verisi yoktur. Normal basınçlı hidrosefali çoğunlukla 60 yaş üstünde görülür ve demans tablolarının küçük ama tedavi edilebilir bir bölümünü oluşturur.",
            "etiology": "Altta yatan sağlık durumu (yapısal, metabolik, endokrin, enfeksiyöz, otoimmün) beyin işlevini doğrudan bozar. Normal basınçlı hidrosefalide beyin omurilik sıvısının emiliminin bozulmasıyla ventriküller genişler ve periventriküler beyaz cevher etkilenir; bu nedenle subkortikal tipte (yavaşlık, dikkat ve yürütücü işlev bozukluğu) bilişsel gerileme görülür.",
            "prognosis": "Gidiş nedene bağlıdır; bir bölümü (normal basınçlı hidrosefali, hipotiroidi, B12 eksikliği, bazı tümörler ve enfeksiyonlar) tedaviyle kısmen ya da tamamen geri dönebilir. Normal basınçlı hidrosefalide lomber ponksiyonla beyin omurilik sıvısı boşaltımına (tap testi) yanıt, şant cerrahisinden yarar görecek hastaları seçmeye yardımcı olur; erken müdahalede sonuç daha iyidir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Majör Nörobilişsel Bozukluk Ölçütleri",
                "content": "Bir ya da daha çok bilişsel alanda (karmaşık dikkat, yürütücü işlev, öğrenme ve bellek, dil, algısal-motor işlev, toplumsal biliş) önceki düzeye göre belirgin gerileme vardır; gerileme günlük etkinliklerde bağımsızlığı bozar, yalnızca deliryum sırasında ortaya çıkmaz ve başka bir ruhsal bozuklukla daha iyi açıklanamaz."
            },
            {
                "code": "Kriter B",
                "title": "Tıbbi Nedenin Kanıtı",
                "content": "Öykü, fizik muayene ya da laboratuvar bulgularından, nörobilişsel bozukluğun başka bir sağlık durumunun patofizyolojik sonucu olduğuna ilişkin kanıt vardır."
            },
            {
                "code": "Kriter C",
                "title": "Daha İyi Açıklanamama",
                "content": "Bilişsel bozukluk başka bir ruhsal bozuklukla ya da özgül olarak adlandırılmış başka bir nörobilişsel bozuklukla (madde/ilaç kaynaklı olanlar dahil) daha iyi açıklanamaz."
            },
            {
                "code": "Klinik Not",
                "title": "Normal Basınçlı Hidrosefali",
                "content": "Klasik üçlü: \"mıknatıs\" yürüyüşü (yürüme apraksisi), idrar kaçırma ve bilişsel yavaşlama; görüntülemede kortikal atrofiyle orantısız ventrikülomegali. Kayıtta önce tıbbi durum, ardından nörobilişsel bozukluk yazılır."
            }
        ]
    },
    "major_neurocognitive_multiple": {
        "id": "major_neurocognitive_multiple",
        "nameTr": "Birden Fazla Etiyolojiye Bağlı Majör Nörobilişsel Bozukluk (Miks Demans)",
        "nameEn": "Major Neurocognitive Disorder Due to Multiple Etiologies",
        "clinicalDescription": {
            "overview": "Birden Fazla Etiyolojiye Bağlı Majör Nörobilişsel Bozukluk, bilişsel gerilemenin tek bir nedenle değil, birden çok patolojik sürecin (en sık Alzheimer hastalığı + serebrovasküler hastalık; ayrıca Alzheimer + Lewy cisimcikli hastalık vb.) birlikte etkisiyle açıklandığı tablodur. Klinik görünümde her iki sürecin özellikleri (ör. bellek baskın sinsi gerileme ile inmelere bağlı basamaklı kötüleşme) birlikte görülebilir.",
            "epidemiology": "Özellikle ileri yaşlarda çok yaygındır; otopsi çalışmalarında demanslı yaşlıların önemli bir kısmında birden çok nörodejeneratif ve/veya vasküler patoloji birlikte saptanmaktadır.",
            "etiology": "Amiloid ve tau patolojisi, serebrovasküler hasar, alfa-sinüklein, TDP-43 ve diğer patolojiler birbirinin etkisini artırır; tek başına eşik altında kalacak patolojiler birlikte belirgin demansa yol açabilir.",
            "prognosis": "Gidiş katkıda bulunan etiyolojilere göre değişir; genellikle tek etiyolojiliye göre daha hızlı ilerler. Her bir etiyolojiye yönelik önlemler (ör. vasküler risk denetimi) birlikte uygulanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Majör Nörobilişsel Bozukluk",
                "content": "Majör nörobilişsel bozukluk ölçütleri karşılanır: bir ya da daha fazla bilişsel alanda (karmaşık dikkat, yönetsel işlev, öğrenme ve bellek, dil, algısal-motor, toplumsal biliş) önceki düzeye göre belirgin gerileme (kişinin, yakınının ya da klinisyenin kaygısı ve tercihen standart testlerle belgelenmiş belirgin bozulma) ve bu eksikliklerin günlük yaşam etkinliklerinde bağımsızlığı bozması; yalnızca deliryum sırasında ortaya çıkmaması ve başka bir ruhsal bozuklukla daha iyi açıklanmaması."
            },
            {
                "code": "Kriter B",
                "title": "Birden Çok Etiyolojik Süreç Kanıtı",
                "content": "Öykü, fizik muayene ya da laboratuvar bulguları, bozukluğun madde kullanımı dışındaki birden çok etiyolojik sürecin fizyolojik sonucu olduğunu gösterir (ör. Alzheimer hastalığına bağlı NBB ve ardından gelişen vasküler NBB)."
            },
            {
                "code": "Kriter C",
                "title": "Dışlama",
                "content": "Bilişsel eksiklikler başka bir ruhsal bozuklukla daha iyi açıklanamaz ve yalnızca bir deliryum sırasında ortaya çıkmaz."
            },
            {
                "code": "Kodlama Notu",
                "title": "Her Etiyolojinin Ayrıca Kodlanması",
                "content": "Katkıda bulunan her etiyolojik durum (ör. Alzheimer hastalığı, serebrovasküler hastalık) ayrıca kodlanır. Maddenin katkısı varsa ilgili maddenin yol açtığı NBB ayrıca belirtilir."
            }
        ]
    },
    "unspecified_neurocognitive": {
        "id": "unspecified_neurocognitive",
        "nameTr": "Belirtilmemiş Nörobilişsel Bozukluk",
        "nameEn": "Unspecified Neurocognitive Disorder",
        "clinicalDescription": {
            "overview": "Belirtilmemiş Nörobilişsel Bozukluk, nörobilişsel bozukluğa özgü belirtilerin klinik açıdan belirgin sıkıntı ya da işlevsellik kaybına yol açtığı, ancak nörobilişsel bozukluklar bölümündeki herhangi bir tanının ölçütlerinin tümüyle karşılanmadığı ya da kesin etiyolojinin bir nedene bağlanabilecek kesinlikte belirlenemediği durumlarda kullanılır.",
            "epidemiology": "Ayrı bir yaygınlık verisi yoktur. Ayrıntılı değerlendirmenin henüz yapılmadığı ya da yapılamadığı durumlarda (ör. ilk başvuru, ileri evrede başvuran hasta) sık kullanılır.",
            "etiology": "Kategori belirli bir etiyolojiyi değil, etiyolojik belirsizliği ya da tanısal bilginin yetersizliğini yansıtır.",
            "prognosis": "Nörogörüntüleme, laboratuvar ve nöropsikolojik değerlendirme ile tanı çoğunlukla belirli bir etiyolojiye bağlanabilir; özellikle geri döndürülebilir nedenler (B12 eksikliği, hipotiroidi, normal basınçlı hidrosefali, depresyon, ilaç yan etkileri) araştırılmalıdır."
        },
        "criteriaList": [
            {
                "code": "Tanımlama",
                "title": "Etiyolojisi Belirlenemeyen Nörobilişsel Tablo",
                "content": "Nörobilişsel bozukluğa özgü belirtiler klinik açıdan belirgin sıkıntıya ya da işlevsellik kaybına yol açar; ancak nörobilişsel bozukluklar bölümündeki tanılardan hiçbirinin ölçütleri tümüyle karşılanmaz ya da etiyoloji yeterli kesinlikle belirlenemez."
            },
            {
                "code": "Ayırıcı Not",
                "title": "Deliryum ve Diğer Tanılarla İlişki",
                "content": "Tablo bir deliryumu düşündürüyorsa 'belirlenmiş diğer / belirtilmemiş deliryum' kategorileri kullanılır. Etiyoloji netleştiğinde tanı ilgili özgül nörobilişsel bozukluk olarak değiştirilir."
            }
        ]
    },
    "personality_change_due_to_medical": {
        "id": "personality_change_due_to_medical",
        "nameTr": "Başka Bir Sağlık Durumuna Bağlı Kişilik Değişikliği",
        "nameEn": "Personality Change Due to Another Medical Condition",
        "clinicalDescription": {
            "overview": "Başka Bir Sağlık Durumuna Bağlı Kişilik Değişikliği, kişinin önceki karakteristik kişilik örüntüsünden belirgin bir değişimi temsil eden ve bir tıbbi durumun (en sık frontal ya da temporal lob hasarı) doğrudan fizyolojik sonucu olan süreğen kişilik bozulmasıdır. Klasik örnek, frontal lobu demir çubukla hasar gören ve sonrasında dürtüsel, saygısız ve plansız birine dönüşen Phineas Gage'dir. Duygusal değişkenlik, ketlenme kaybı (uygunsuz cinsel ya da toplumsal davranış), saldırganlık, apati ya da paranoid düşünceler görülebilir.",
            "epidemiology": "Kesin yaygınlık bilinmez. Orta-ağır kafa travması, inme, beyin tümörü, epilepsi (özellikle temporal lob), merkezi sinir sistemi enfeksiyonları, multipl skleroz, Huntington hastalığı ve endokrin bozukluklar sonrasında sık görülür.",
            "etiology": "Orbitofrontal hasar ketlenme kaybı ve dürtüselliğe, dorsolateral prefrontal hasar planlama bozukluğuna, medial frontal/ön singulat hasar apati ve isteksizliğe yol açar. Altta yatan tıbbi durumun lokalizasyonu ve yaygınlığı klinik alt tipi belirler.",
            "prognosis": "Gidiş altta yatan duruma bağlıdır: ilerleyici hastalıklarda kötüleşir, travma ya da inme sonrasında kısmen düzelebilir ya da kalıcı olabilir. Davranışsal yönetim, aile eğitimi ve çevresel düzenlemeler temel yaklaşımlardır; belirli belirtilere yönelik ilaç tedavisi uygulanabilir. Adli ve toplumsal sorunlar sık görülür."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Önceki Kişilikten Belirgin Değişim",
                "content": "Kişinin önceki karakteristik kişilik örüntüsünden bir değişimi temsil eden süreğen kişilik bozulması. (Çocuklarda bu, olağan gelişimden belirgin sapma ya da olağan davranış örüntülerinde en az 1 yıl süren belirgin değişiklik olarak görülür.)"
            },
            {
                "code": "Kriter B",
                "title": "Tıbbi Duruma Bağlılık Kanıtı",
                "content": "Öykü, fizik muayene ya da laboratuvar bulguları, bozulmanın başka bir sağlık durumunun doğrudan fizyolojik sonucu olduğunu gösterir."
            },
            {
                "code": "Kriter C & D",
                "title": "Dışlama",
                "content": "Bozulma başka bir ruhsal bozuklukla (başka bir sağlık durumuna bağlı diğer ruhsal bozukluklar dahil) daha iyi açıklanamaz ve yalnızca bir deliryum sırasında ortaya çıkmaz."
            },
            {
                "code": "Kriter E",
                "title": "Klinik Önem",
                "content": "Bozulma klinik açıdan belirgin sıkıntıya ya da toplumsal, mesleki veya diğer önemli alanlarda işlevsellikte düşmeye yol açar."
            },
            {
                "code": "Alt Tipler",
                "title": "Baskın Özelliğe Göre",
                "content": "Değişken (duygusal değişkenlik), Ketlenmemiş (dürtü denetimi kaybı, uygunsuz cinsel davranış), Saldırgan, Apatik (belirgin ilgisizlik), Paranoid, Diğer, Birleşik ya da Belirtilmemiş tip."
            }
        ]
    },
    "pedophilic_disorder": {
        "id": "pedophilic_disorder",
        "nameTr": "Pedofili Bozukluğu",
        "nameEn": "Pedophilic Disorder",
        "clinicalDescription": {
            "overview": "Pedofilik Bozukluk, ergenlik öncesi (genellikle 13 yaş ve altı) bir çocuk ya da çocuklarla cinsel etkinliğe yönelik en az 6 ay süren, yineleyici ve yoğun cinsel uyarılma (fantezi, dürtü ya da davranış) bulunması ve kişinin bu dürtüleri eyleme dökmüş olması ya da dürtülerin belirgin sıkıntı veya kişilerarası güçlüğe yol açmasıdır. Pedofilik ilgi ile çocuğa yönelik cinsel istismar eşanlamlı değildir: istismar edenlerin bir kısmı pedofilik değildir, pedofilik ilgisi olan kişilerin bir kısmı ise hiç eyleme dökmez. Türkiye'de çocuğa yönelik her türlü cinsel davranış ağır bir suçtur; bu tanının konması kendiliğinden cezai sorumluluğu ortadan kaldırmaz.",
            "epidemiology": "Kesin yaygınlık bilinmemektedir; erkeklerde en yüksek olası yaygınlığın birkaç yüzde düzeyinde olduğu tahmin edilir, kadınlarda çok daha düşüktür. İlgi genellikle ergenlik döneminde fark edilir.",
            "etiology": "Nörogelişimsel etmenler (erken kafa travması, daha düşük ortalama zekâ ve boy, solak olma oranında artış gibi bulgular), çocuklukta cinsel istismara uğrama, antisosyal özellikler ve kalıtsal etmenler incelenmiştir; tek başına belirleyici bir neden yoktur. Pedofilik cinsel ilginin yaşam boyu süreğen olduğu düşünülmektedir.",
            "prognosis": "Cinsel ilginin kendisi genellikle süreğendir; ancak eyleme dökme davranışı yaş, antisosyallik ve tedaviyle değişebilir. Tedavide amaç zararı önlemektir: BDT temelli nüks önleme, ilgiyi fark eden ama eyleme dökmemiş kişilere yönelik önleyici programlar (ör. Almanya'daki 'Dunkelfeld' projesi) ve uygun durumlarda cinsel dürtüyü azaltan ilaç tedavisi uygulanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "En Az 6 Ay Süren Pedofilik Cinsel Uyarılma",
                "content": "En az 6 ay boyunca, ergenlik öncesi bir çocuk ya da çocuklarla (genellikle 13 yaş ya da daha küçük) cinsel etkinliğe ilişkin yineleyici ve yoğun cinsel uyarılma yaratan fanteziler, cinsel dürtüler ya da davranışlar."
            },
            {
                "code": "Kriter B",
                "title": "Eyleme Dökme ya da Sıkıntı",
                "content": "Kişi bu cinsel dürtüleri eyleme dökmüştür ya da bu dürtüler veya fanteziler belirgin sıkıntıya ya da kişilerarası güçlüğe yol açar."
            },
            {
                "code": "Kriter C",
                "title": "Yaş Koşulu",
                "content": "Kişi en az 16 yaşındadır ve Kriter A'daki çocuk(lar)dan en az 5 yaş büyüktür. Not: Ergenliğin sonlarında olup 12-13 yaşındaki biriyle süregiden bir ilişkisi olan kişi bu tanıya dahil edilmez."
            },
            {
                "code": "Belirleyiciler",
                "title": "Tip ve Hedef",
                "content": "Özel tip (yalnızca çocuklara ilgi) ya da özel olmayan tip; erkeklere, kadınlara ya da her ikisine cinsel ilgi; yalnızca ensestle sınırlı olup olmadığı belirtilir."
            }
        ]
    },
    "fetishistic_disorder": {
        "id": "fetishistic_disorder",
        "nameTr": "Fetişizm Bozukluğu",
        "nameEn": "Fetishistic Disorder",
        "clinicalDescription": {
            "overview": "Fetişizm Bozukluğu, cansız nesnelerin (ör. iç çamaşırı, ayakkabı, lateks/deri ürünler) kullanımından ya da genital olmayan belirli bir beden bölümüne (ör. ayak, saç) yönelik oldukça özgül bir odaktan kaynaklanan, en az 6 ay süren yineleyici ve yoğun cinsel uyarılmanın belirgin sıkıntı ya da işlevsellik kaybına yol açmasıdır. DSM-5 ile beden bölümüne yönelik ilgi (eskiden 'parsiyalizm') bu tanının içine alınmıştır. Fetiş nesnesi cinsel uyarılma için gerekli ya da çok tercih edilen hâle gelebilir ve ilişkilerde soruna yol açabilir.",
            "epidemiology": "Kesin yaygınlık bilinmemektedir; fetişistik ilgiler genel toplumda nispeten yaygın olmakla birlikte bozukluk düzeyine ulaşanlar azdır. Klinik olguların neredeyse tamamı erkektir.",
            "etiology": "Cinsel uyarılmanın nesneyle tekrarlanan eşleşmesi yoluyla klasik koşullanma, mastürbasyonla pekiştirme ve erken cinsel deneyimler öne sürülmüştür. Eşlik eden diğer parafiliker ve hiperseksüellik görülebilir.",
            "prognosis": "Fetişistik ilgi genellikle süreğendir ancak yoğunluğu ve yarattığı sıkıntı dalgalanabilir. Sıkıntı yoksa tedavi gerekmez; sorunlu olgularda BDT, çift terapisi ve cinsel terapi kullanılır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "En Az 6 Ay Süren Fetişistik Uyarılma",
                "content": "En az 6 ay boyunca, cansız nesnelerin kullanımından ya da genital olmayan beden bölüm(ler)ine yönelik çok özgül bir odaktan kaynaklanan, fantezi, dürtü ya da davranış biçiminde yineleyici ve yoğun cinsel uyarılma."
            },
            {
                "code": "Kriter B",
                "title": "Klinik Önem",
                "content": "Bu fanteziler, dürtüler ya da davranışlar klinik açıdan belirgin sıkıntıya ya da toplumsal, mesleki veya diğer önemli alanlarda işlevsellikte bozulmaya yol açar."
            },
            {
                "code": "Kriter C",
                "title": "Dışlama",
                "content": "Fetiş nesneleri karşıgiyimde kullanılan giysilerle (karşıgiyim bozukluğu) ya da genital uyarım için özel olarak tasarlanmış araçlarla (ör. vibratör) sınırlı değildir."
            },
            {
                "code": "Belirleyiciler",
                "title": "Odak Türü",
                "content": "Beden bölüm(ler)i, cansız nesne(ler) ya da diğer; ayrıca 'denetimli bir ortamda' ve 'tam düzelmede' (denetimsiz ortamda en az 5 yıl sorun olmaması) belirtilebilir."
            }
        ]
    },
    "transvestic_disorder": {
        "id": "transvestic_disorder",
        "nameTr": "Karşıgiyim (Travestik) Bozukluğu",
        "nameEn": "Transvestic Disorder",
        "clinicalDescription": {
            "overview": "Karşıgiyim (Travestik) Bozukluğu, karşı cinsiyetin giysilerini giymekten (karşıgiyim) kaynaklanan, en az 6 ay süren yineleyici ve yoğun cinsel uyarılmanın belirgin sıkıntı ya da işlevsellik kaybına yol açmasıdır. Tanının özü kimlik değil cinsel uyarılmadır; bu yönüyle cinsiyet disforisinden ayrılır. Karşıgiyim keyif amaçlı yapılan bir eylem (drag performansı gibi) ya da transgender bireylerin kendi cinsiyet ifadesi ise bu tanı konmaz.",
            "epidemiology": "Neredeyse tamamı heteroseksüel erkeklerde bildirilir. Erkeklerin küçük bir bölümü yaşamlarında karşıgiyimle cinsel uyarılma yaşadığını bildirir; bozukluk düzeyindeki oran daha düşüktür.",
            "etiology": "Ergenlikte ya da öncesinde karşıgiyim ile cinsel uyarılmanın eşleşmesi (koşullanma) öne sürülmüştür. 'Otojinefili' (kendini kadın olarak düşünmekten uyarılma) bazı olgularda tabloya eşlik eder; bu olguların bir kısmında ileri yaşta cinsiyet disforisi gelişebilir.",
            "prognosis": "Karşıgiyimin cinsel uyarıcı etkisi yaşla azalabilir, ancak karşıgiyimin kendisi rahatlatıcı bir işlev kazanarak sürebilir. Sıkıntı ve çift sorunlarına yönelik psikoterapi ve çift terapisi kullanılır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "En Az 6 Ay Süren Karşıgiyimle Uyarılma",
                "content": "En az 6 ay boyunca, karşıgiyimden kaynaklanan, fantezi, dürtü ya da davranış biçiminde yineleyici ve yoğun cinsel uyarılma."
            },
            {
                "code": "Kriter B",
                "title": "Klinik Önem",
                "content": "Bu fanteziler, dürtüler ya da davranışlar klinik açıdan belirgin sıkıntıya ya da toplumsal, mesleki veya diğer önemli alanlarda işlevsellikte bozulmaya yol açar."
            },
            {
                "code": "Belirleyiciler",
                "title": "Fetişizmle / Otojinefiliyle Birlikte",
                "content": "'Fetişizmle birlikte' (kumaş, malzeme ya da giysiden cinsel uyarılma) ve 'otojinefiliyle birlikte' (kendini kadın olarak düşünmekten ya da hayal etmekten cinsel uyarılma) belirtilebilir."
            },
            {
                "code": "Belirleyiciler",
                "title": "Denetimli Ortamda / Tam Düzelmede",
                "content": "'Denetimli bir ortamda' (ör. kurum ya da cezaevinde, eyleme dökme olanağının kısıtlı olduğu durumlarda) ve 'tam düzelmede' (denetimsiz bir ortamda en az 5 yıl boyunca ilgili sıkıntı, işlevsellik bozulması ya da davranış olmaması) belirleyicileri kullanılabilir."
            }
        ]
    },
    "other_specified_paraphilic": {
        "id": "other_specified_paraphilic",
        "nameTr": "Belirlenmiş Diğer Bir Parafilik Bozukluk",
        "nameEn": "Other Specified Paraphilic Disorder",
        "clinicalDescription": {
            "overview": "Parafilik bozukluklara özgü belirtilerin klinik açıdan belirgin sıkıntıya ya da işlevsellik kaybına yol açtığı, ancak bu gruptaki hiçbir bozukluğun ölçütlerinin tümüyle karşılanmadığı ve klinisyenin nedenini belirttiği durumlarda kullanılır. DSM-5-TR'nin örnekleri, en az 6 ay süren ve belirgin sıkıntı ya da işlev bozulmasına yol açan, telefon skatolojisi (müstehcen telefon aramaları), nekrofili (cesetler), zoofili (hayvanlar), koprofili (dışkı), klismafili (lavman) ya da ürofili (idrar) içeren yoğun ve yineleyen cinsel uyarılmadır. Kayıtta kategori adından sonra parafilinin türü yazılır (ör. \"belirlenmiş diğer parafilik bozukluk, zoofili\"). Bozukluk tanısı için cinsel ilginin kendisi yetmez; kişide sıkıntı ya da işlev bozulması yaratması veya başkalarına zarar vermesi gerekir.",
            "epidemiology": "Bu parafililerin çoğu seyrektir ve güvenilir yaygınlık verisi yoktur; bilgilerin büyük bölümü klinik ve adli olgu bildirimlerine dayanır. Parafilik bozukluklar erkeklerde belirgin olarak daha sık görülür.",
            "etiology": "Erken öğrenme ve koşullanma, cinsel gelişimdeki farklılıklar, dürtü denetimi güçlükleri ve eşlik eden ruhsal bozukluklar (kişilik bozuklukları, madde kullanımı, zihinsel yetiyitimi) birlikte rol oynar; tek bir neden saptanmamıştır.",
            "prognosis": "Parafilik ilgiler genellikle süreklidir; tedavinin amacı ilginin denetimini ve zarar verici davranışların önlenmesini sağlamaktır. Bilişsel davranışçı yaklaşımlar, yineleme önleme ve gerektiğinde ilaç tedavisi uzman değerlendirmesiyle uygulanır. Bazı davranışlar (hayvanlara ya da cesetlere yönelik eylemler, rızasız telefon tacizi) yasal sonuçlar doğurur."
        },
        "criteriaList": [
            {
                "code": "Tanımlama",
                "title": "Belirlenmiş Diğer Bir Parafilik Bozukluk",
                "content": "Parafilik bozukluklara özgü belirtilerin baskın olduğu ve klinik açıdan belirgin sıkıntıya ya da toplumsal, mesleki veya diğer önemli işlevsellik alanlarında bozulmaya yol açtığı, ancak bu tanı grubundaki hiçbir bozukluğun ölçütlerinin tümüyle karşılanmadığı durumlarda kullanılır. Klinisyen ölçütlerin neden karşılanmadığını belirtir; kayıtta kategori adından sonra neden yazılır."
            },
            {
                "code": "Örnekler",
                "title": "DSM-5-TR'de Verilen Örnek Tablolar",
                "content": "En az 6 ay süren, belirgin sıkıntıya ya da işlev bozulmasına yol açan yoğun ve yineleyen cinsel uyarılma içeren örnekler:",
                "items": [
                    "1. Telefon skatolojisi (müstehcen telefon aramaları).",
                    "2. Nekrofili (cesetler).",
                    "3. Zoofili (hayvanlar).",
                    "4. Koprofili (dışkı).",
                    "5. Klismafili (lavman).",
                    "6. Ürofili (idrar)."
                ]
            },
            {
                "code": "Belirtilmemiş ile Farkı",
                "title": "Nedenin Belirtilmesi",
                "content": "Klinisyen ölçütlerin neden karşılanmadığını belirtmeyi seçmezse ya da bilgi yetersizse (ör. acil servis) 'Belirtilmemiş Parafilik Bozukluk' kategorisi kullanılır."
            }
        ]
    },
    "other_specified_anxiety": {
        "id": "other_specified_anxiety",
        "nameTr": "Belirlenmiş Diğer Bir Anksiyete Bozukluğu",
        "nameEn": "Other Specified Anxiety Disorder",
        "clinicalDescription": {
            "overview": "Belirlenmiş Diğer Bir Anksiyete Bozukluğu, anksiyete bozukluklarına özgü belirtilerin klinik açıdan belirgin sıkıntı ya da işlevsellik kaybına yol açtığı, ancak panik bozukluğu, yaygın anksiyete bozukluğu, sosyal anksiyete bozukluğu gibi özgül bir anksiyete bozukluğunun ölçütlerinin tümüyle karşılanmadığı ve klinisyenin bunun nedenini belirttiği durumlarda kullanılır. Örneğin tam panik atak için gereken belirti sayısına ulaşmayan sınırlı belirtili ataklar ya da belirtilerin süre ölçütünü karşılamadığı yaygın anksiyete.",
            "epidemiology": "Eşik altı anksiyete tabloları toplumda tam ölçütlü bozukluklar kadar ya da daha yaygındır ve birinci basamakta sık görülür; ayrı bir yaygınlık verisi bulunmaz.",
            "etiology": "Etmenler özgül anksiyete bozukluklarıyla benzerdir: kalıtsal yatkınlık, davranışsal ketlenme mizacı, stresli yaşam olayları ve bilişsel yatkınlıklar. Kültüre bağlı tablolar (ataque de nervios, khyâl cap) kültürel açıklama modelleriyle birlikte değerlendirilir.",
            "prognosis": "Bir kısmı zamanla tam ölçütlü bir anksiyete ya da depresif bozukluğa dönüşebilir. Tedavi ilkeleri özgül bozukluklardaki gibidir (BDT, psikoeğitim); kültürel tablolarda kültüre duyarlı yaklaşım önemlidir."
        },
        "criteriaList": [
            {
                "code": "Tanımlama",
                "title": "Belirlenmiş Diğer Bir Anksiyete Bozukluğu",
                "content": "Anksiyete Bozukluğu grubuna özgü belirtilerin baskın olduğu ve klinik açıdan belirgin sıkıntıya ya da işlevsellik kaybına yol açtığı, ancak bu gruptaki hiçbir bozukluğun ölçütlerinin tümüyle karşılanmadığı durumlarda kullanılır. Klinisyen ölçütlerin neden karşılanmadığını belirtir (ör. 'sınırlı belirtili ataklar')."
            },
            {
                "code": "Örnekler",
                "title": "DSM-5-TR'de Verilen Örnek Tablolar",
                "content": "Bu kategoriyle belirtilebilecek tablolara örnekler:",
                "items": [
                    "1. Sınırlı belirtili ataklar (panik atak ölçütündeki belirti sayısına ulaşmayan ataklar).",
                    "2. Belirtilerin 'çoğu günde' bulunmadığı yaygın anksiyete.",
                    "3. Khyâl cap ('rüzgâr atakları'; Kamboçya kültürüne özgü).",
                    "4. Ataque de nervios ('sinir krizi'; Latin Amerika kültürüne özgü)."
                ]
            },
            {
                "code": "Belirtilmemiş ile Farkı",
                "title": "Nedenin Belirtilmesi",
                "content": "Klinisyen ölçütlerin neden karşılanmadığını belirtmeyi seçmezse ya da bilgi yetersizse (ör. acil servis) 'Belirtilmemiş' kategori kullanılır."
            }
        ]
    },
    "other_specified_ocd": {
        "id": "other_specified_ocd",
        "nameTr": "Belirlenmiş Diğer Bir Obsesif-Kompulsif ve İlişkili Bozukluk",
        "nameEn": "Other Specified Obsessive-Compulsive and Related Disorder",
        "clinicalDescription": {
            "overview": "Belirlenmiş Diğer Bir Obsesif-Kompulsif ve İlişkili Bozukluk, OKB ve ilişkili bozukluklara özgü belirtilerin klinik açıdan belirgin sıkıntı ya da işlevsellik kaybına yol açtığı, ancak bu gruptaki hiçbir bozukluğun ölçütlerinin tümüyle karşılanmadığı ve klinisyenin bunun nedenini belirttiği durumlarda kullanılır. Obsesyonel kıskançlık (partnerin sadakatsizliğine ilişkin sanrı düzeyinde olmayan, tekrarlayıcı kontrol davranışlarıyla giden uğraş), dudak ısırma veya yanak çiğneme gibi bedene yönelik yineleyici davranışlar ve penisin karna doğru çekilip kaybolacağı korkusuyla seyreden Koro sendromu bu kategoriye örnektir.",
            "epidemiology": "Ayrı bir yaygınlık verisi yoktur; bedene yönelik yineleyici davranışlar (tırnak yeme, dudak ısırma) toplumda sık görülür, bozukluk düzeyine ulaşanlar daha azdır. Koro Güney ve Doğu Asya'da salgınlar biçiminde bildirilmiştir.",
            "etiology": "OKB spektrumuyla ortak nörobiyolojik (kortiko-striato-talamo-kortikal devreler) ve kalıtsal etmenler ile kültürel inanç sistemleri rol oynar.",
            "prognosis": "Tedavi en yakın özgül bozukluğun ilkelerine göre planlanır: obsesyonel kıskançlıkta maruz bırakma ve tepki önleme ile çift çalışmaları, bedene yönelik yineleyici davranışlarda alışkanlık tersine çevirme eğitimi, kültüre bağlı tablolarda psikoeğitim ve güvence."
        },
        "criteriaList": [
            {
                "code": "Tanımlama",
                "title": "Belirlenmiş Diğer Bir Obsesif-Kompulsif ve İlişkili Bozukluk",
                "content": "Obsesif-Kompulsif ve İlişkili Bozukluk grubuna özgü belirtilerin baskın olduğu ve klinik açıdan belirgin sıkıntıya ya da işlevsellik kaybına yol açtığı, ancak bu gruptaki hiçbir bozukluğun ölçütlerinin tümüyle karşılanmadığı durumlarda kullanılır. Klinisyen ölçütlerin neden karşılanmadığını belirtir (ör. 'obsesyonel kıskançlık')."
            },
            {
                "code": "Örnekler",
                "title": "DSM-5-TR'de Verilen Örnek Tablolar",
                "content": "Bu kategoriyle belirtilebilecek tablolara örnekler:",
                "items": [
                    "1. Gerçek kusurlarla birlikte beden algısı bozukluğu benzeri bozukluk (kusur gerçek ama uğraş açıkça aşırı).",
                    "2. Yineleyici davranışlar olmaksızın beden algısı bozukluğu benzeri bozukluk.",
                    "3. Bedene yönelik yineleyici davranış bozukluğu (dudak ısırma, yanak çiğneme, tırnak yeme vb.).",
                    "4. Obsesyonel kıskançlık (partnerin algılanan sadakatsizliğiyle sanrı düzeyinde olmayan uğraş).",
                    "5. Shubo-kyofu (aşırı beden kusuru korkusu; Japonya).",
                    "6. Koro (penisin ya da kadınlarda meme başı/vulvanın bedene çekilip kaybolacağı ve ölüme yol açacağı yönünde ani, yoğun anksiyete).",
                    "7. Koku alma referans bozukluğu (koku alma referans sendromu): başkalarınca fark edilmeyen ya da hafif olan bir beden kokusu yaydığı inancıyla aşırı uğraş, yineleyici kontrol ve kaçınma (DSM-5'teki jikoshu-kyofu örneğinin yerini almıştır)."
                ]
            },
            {
                "code": "Belirtilmemiş ile Farkı",
                "title": "Nedenin Belirtilmesi",
                "content": "Klinisyen ölçütlerin neden karşılanmadığını belirtmeyi seçmezse ya da bilgi yetersizse (ör. acil servis) 'Belirtilmemiş' kategori kullanılır."
            }
        ]
    },
    "other_specified_trauma": {
        "id": "other_specified_trauma",
        "nameTr": "Belirlenmiş Diğer Bir Travma ve Stresörle İlişkili Bozukluk",
        "nameEn": "Other Specified Trauma- and Stressor-Related Disorder",
        "clinicalDescription": {
            "overview": "Belirlenmiş Diğer Bir Travma ve Stresörle İlişkili Bozukluk, travma ve stresörle ilişkili bozukluklara özgü belirtilerin klinik açıdan belirgin sıkıntı ya da işlevsellik kaybına yol açtığı, ancak TSSB, akut stres bozukluğu, uyum bozukluğu, uzamış yas bozukluğu gibi bu gruptaki bir bozukluğun ölçütlerinin tümüyle karşılanmadığı ve klinisyenin nedenini belirttiği durumlarda kullanılır. Örneğin belirtilerin stresörden 3 aydan daha uzun süre sonra başladığı uyum bozukluğu benzeri tablolar. Not: DSM-5'te bu kategorinin örneği olan süregen karmaşık yas, DSM-5-TR'de Uzamış Yas Bozukluğu adıyla ayrı bir tanı olmuştur ve artık bu kategorinin örneği değildir.",
            "epidemiology": "Ayrı bir yaygınlık verisi yoktur. Travma sonrası eşik altı tablolar (TSSB ölçütlerini tam karşılamayan) toplumda tam TSSB'den daha sıktır.",
            "etiology": "Stresör ya da travmatik olaya maruz kalma, bireysel yatkınlık (önceki travmalar, ruhsal bozukluk öyküsü) ve sosyal destek eksikliği etkileşir; kültüre özgü sıkıntı ifadeleri (ataque de nervios) tabloyu biçimlendirir.",
            "prognosis": "Gidiş stresörün niteliğine ve sürmesine bağlıdır; bir kısmı kendiliğinden düzelir, bir kısmı tam ölçütlü bir bozukluğa dönüşebilir. Travma odaklı psikoterapiler ve destekleyici yaklaşımlar kullanılır."
        },
        "criteriaList": [
            {
                "code": "Tanımlama",
                "title": "Belirlenmiş Diğer Bir Travma ve Stresörle İlişkili Bozukluk",
                "content": "Travma ve Stresörle İlişkili Bozukluk grubuna özgü belirtilerin baskın olduğu ve klinik açıdan belirgin sıkıntıya ya da işlevsellik kaybına yol açtığı, ancak bu gruptaki hiçbir bozukluğun ölçütlerinin tümüyle karşılanmadığı durumlarda kullanılır. Klinisyen ölçütlerin neden karşılanmadığını belirtir (ör. 'stresörden 3 aydan uzun süre sonra başlayan uyum bozukluğu benzeri tablo')."
            },
            {
                "code": "Örnekler",
                "title": "DSM-5-TR'de Verilen Örnek Tablolar",
                "content": "Bu kategoriyle belirtilebilecek tablolara örnekler:",
                "items": [
                    "1. Belirtilerin stresörden 3 aydan daha uzun süre sonra başladığı uyum bozukluğu benzeri bozukluklar (gecikmiş başlangıçlı).",
                    "2. Stresör uzun sürmediği hâlde 6 aydan uzun süren uyum bozukluğu benzeri bozukluklar.",
                    "3. Ataque de nervios.",
                    "4. Diğer kültürel sendromlar."
                ]
            },
            {
                "code": "Belirtilmemiş ile Farkı",
                "title": "Nedenin Belirtilmesi",
                "content": "Klinisyen ölçütlerin neden karşılanmadığını belirtmeyi seçmezse ya da bilgi yetersizse (ör. acil servis) 'Belirtilmemiş' kategori kullanılır."
            }
        ]
    },
    "other_specified_somatic": {
        "id": "other_specified_somatic",
        "nameTr": "Belirlenmiş Diğer Bir Bedensel Belirti Bozukluğu",
        "nameEn": "Other Specified Somatic Symptom and Related Disorder",
        "clinicalDescription": {
            "overview": "Belirlenmiş Diğer Bir Bedensel Belirti ve İlişkili Bozukluk, bedensel belirti bozukluklarına özgü belirtilerin klinik açıdan belirgin sıkıntı ya da işlevsellik kaybına yol açtığı, ancak bedensel belirti bozukluğu, hastalık kaygısı bozukluğu, işlevsel nörolojik belirti bozukluğu gibi bu gruptaki bir bozukluğun ölçütlerinin tümüyle karşılanmadığı ve klinisyenin nedenini belirttiği durumlarda kullanılır. Örnek olarak belirtilerin 6 aydan kısa sürdüğü kısa süreli bedensel belirti bozukluğu ve kişinin gebe olmadığı hâlde gebe olduğuna inandığı ve gebelik bulgularının görüldüğü yalancı gebelik (psödosiyezis) sayılabilir.",
            "epidemiology": "Ayrı bir yaygınlık verisi yoktur; kısa süreli ve eşik altı bedensel belirti tabloları birinci basamakta yaygındır. Psödosiyezis nadirdir.",
            "etiology": "Bedensel duyumlara aşırı dikkat, felaketleştirici yorumlama, sağlık kaygısı, stres ve öğrenilmiş hastalık davranışı rol oynar; psödosiyeziste nöroendokrin değişiklikler ve gebelik ile ilgili güçlü istek ya da korku tanımlanmıştır.",
            "prognosis": "Kısa süreli tablolar çoğunlukla geriler; bir kısmı süreğenleşebilir. Düzenli ve planlı hekim görüşmeleri, gereksiz tetkiklerden kaçınma ve BDT temel yaklaşımlardır."
        },
        "criteriaList": [
            {
                "code": "Tanımlama",
                "title": "Belirlenmiş Diğer Bir Bedensel Belirti ve İlişkili Bozukluk",
                "content": "Bedensel Belirti ve İlişkili Bozukluk grubuna özgü belirtilerin baskın olduğu ve klinik açıdan belirgin sıkıntıya ya da işlevsellik kaybına yol açtığı, ancak bu gruptaki hiçbir bozukluğun ölçütlerinin tümüyle karşılanmadığı durumlarda kullanılır. Klinisyen ölçütlerin neden karşılanmadığını belirtir (ör. 'kısa süreli bedensel belirti bozukluğu')."
            },
            {
                "code": "Örnekler",
                "title": "DSM-5-TR'de Verilen Örnek Tablolar",
                "content": "Bu kategoriyle belirtilebilecek tablolara örnekler:",
                "items": [
                    "1. Kısa süreli bedensel belirti bozukluğu (belirtiler 6 aydan kısa sürer).",
                    "2. Kısa süreli hastalık kaygısı bozukluğu (belirtiler 6 aydan kısa sürer).",
                    "3. Aşırı sağlıkla ilgili davranışlar olmaksızın hastalık kaygısı bozukluğu.",
                    "4. Yalancı gebelik (psödosiyezis): gebe olunduğuna dair yanlış inanç ile birlikte nesnel gebelik belirti ve bulguları."
                ]
            },
            {
                "code": "Belirtilmemiş ile Farkı",
                "title": "Nedenin Belirtilmesi",
                "content": "Klinisyen ölçütlerin neden karşılanmadığını belirtmeyi seçmezse ya da bilgi yetersizse (ör. acil servis) 'Belirtilmemiş' kategori kullanılır."
            }
        ]
    },
    "other_specified_feeding": {
        "id": "other_specified_feeding",
        "nameTr": "Belirlenmiş Diğer Bir Beslenme ve Yeme Bozukluğu",
        "nameEn": "Other Specified Feeding or Eating Disorder",
        "clinicalDescription": {
            "overview": "Belirlenmiş Diğer Bir Beslenme ya da Yeme Bozukluğu (OSFED), beslenme ve yeme bozukluklarına özgü belirtilerin klinik açıdan belirgin sıkıntı ya da işlevsellik kaybına yol açtığı, ancak anoreksiya nervoza, bulimiya nervoza, tıkınırcasına yeme bozukluğu, ARFID, pika ya da geviş getirme bozukluğunun ölçütlerinin tümüyle karşılanmadığı ve klinisyenin nedenini belirttiği durumlarda kullanılır. DSM-IV'teki 'başka türlü adlandırılamayan yeme bozukluğu' (EDNOS) kategorisinin yerini almıştır. Bu kategori 'hafif' bir yeme bozukluğu anlamına gelmez; tıbbi riskler tam ölçütlü bozukluklar kadar ağır olabilir.",
            "epidemiology": "Klinik örneklemlerde yeme bozukluğu tanısı alanların önemli bir bölümü bu kategoriye girer; özellikle atipik anoreksiya nervoza ergen ve genç kadınlarda sık görülür.",
            "etiology": "Etiyoloji özgül yeme bozukluklarıyla ortaktır: kalıtsal yatkınlık, mükemmeliyetçilik, beden memnuniyetsizliği, diyet yapma, zayıflık idealinin içselleştirilmesi ve duygudurum düzenleme güçlükleri.",
            "prognosis": "Gidiş ve tıbbi riskler özgül bozukluklara benzer; atipik anoreksiyada kilo normal aralıkta olsa bile elektrolit bozukluğu ve bradikardi gibi ağır komplikasyonlar görülebilir. Tedavi en yakın özgül bozukluğun ilkelerine (ör. yeme bozukluklarına yönelik BDT, aile temelli tedavi) göre planlanır."
        },
        "criteriaList": [
            {
                "code": "Tanımlama",
                "title": "Belirlenmiş Diğer Bir Beslenme ya da Yeme Bozukluğu",
                "content": "Beslenme ya da Yeme Bozukluğu grubuna özgü belirtilerin baskın olduğu ve klinik açıdan belirgin sıkıntıya ya da işlevsellik kaybına yol açtığı, ancak bu gruptaki hiçbir bozukluğun ölçütlerinin tümüyle karşılanmadığı durumlarda kullanılır. Klinisyen ölçütlerin neden karşılanmadığını belirtir (ör. 'düşük sıklıkta tıkınırcasına yeme bozukluğu')."
            },
            {
                "code": "Örnekler",
                "title": "DSM-5-TR'de Verilen Örnek Tablolar",
                "content": "Bu kategoriyle belirtilebilecek tablolara örnekler:",
                "items": [
                    "1. Atipik anoreksiya nervoza: anoreksiya ölçütleri karşılanır, ancak belirgin kilo kaybına karşın kilo normal aralıkta ya da üzerindedir.",
                    "2. Düşük sıklıkta ve/veya kısa süreli bulimiya nervoza: tıkınma ve uygunsuz telafi davranışları ortalama haftada birden az ve/veya 3 aydan kısa süredir.",
                    "3. Düşük sıklıkta ve/veya kısa süreli tıkınırcasına yeme bozukluğu: tıkınma atakları ortalama haftada birden az ve/veya 3 aydan kısa süredir.",
                    "4. Çıkarma bozukluğu (purging disorder): tıkınma olmaksızın kilo ya da beden şeklini etkilemek için yineleyici çıkarma davranışları (kendini kusturma, laksatif, diüretik).",
                    "5. Gece yeme sendromu: uykudan uyanıp yeme ya da akşam yemeğinden sonra aşırı yiyecek tüketme; kişi bunun farkındadır ve hatırlar."
                ]
            },
            {
                "code": "Belirtilmemiş ile Farkı",
                "title": "Nedenin Belirtilmesi",
                "content": "Klinisyen ölçütlerin neden karşılanmadığını belirtmeyi seçmezse ya da bilgi yetersizse (ör. acil servis) 'Belirtilmemiş' kategori kullanılır."
            }
        ]
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DSM5_MANUAL };
}
