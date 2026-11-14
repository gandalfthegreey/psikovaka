/**
 * PsikoVaka - Kapsamlı DSM-5 Tanı Kriterleri ve Klinik El Kitabı
 * Her tanı için ayrı ayrı:
 * 1. Detaylı Klinik Tanım & Psikopatoloji
 * 2. Resmi DSM-5 Tanı Kriterleri
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
    "pseudocyesis": {
        "id": "pseudocyesis",
        "nameTr": "Yalancı Gebelik (Psödosiyezis)",
        "nameEn": "Pseudocyesis",
        "clinicalDescription": {
            "overview": "Gebe olunmadığı halde gebe olunduğuna dair yanlış inanç ve bu inanca eşlik eden karın büyümesi, adetten kesilme, memelerde süt salgısı gibi objektif bedensel değişikliklerdir.",
            "epidemiology": "Nadir görülür; çocuk sahibi olma arzusu yüksek olan ve kısırlık yaşayan kadınlarda daha sıktır.",
            "etiology": "Yoğun psikolojik stres ve çocuk arzusunun hipotalamus-hipofiz aksını etkileyerek prolaktin ve gonadotropin salınımını değiştirmesi.",
            "prognosis": "Ultrason ve negatif testlerin şefkatle sunulması ve yas terapisi ile fiziksel belirtiler hızla geriler."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Yalancı Gebelik İnancı ve Fiziksel Belirtiler",
                "content": "Gebe olmadığı halde gebe olduğuna dair yanlış bir inançla birlikte karın büyümesi, adet kanamasının kesilmesi (amenore), fetal hareket algısı, laktasyon (süt gelmesi) ve doğum sancısı hissi gibi objektif gebelik belirtilerinin bulunması."
            }
        ]
    },
    "olfactory_reference": {
        "id": "olfactory_reference",
        "nameTr": "Koku Referans Bozukluğu",
        "nameEn": "Olfactory Reference Disorder",
        "clinicalDescription": {
            "overview": "Başkaları tarafından algılanmayan veya önemsiz olan kötü/itici bir vücut kokusu (ter, ağız, anüs vb.) yaydığına dair sürekli bir zihinsel uğraş ve buna eşlik eden aşırı temizlik/kaçınma kompulsiyonlarıdır.",
            "epidemiology": "Erkeklerde biraz daha sık görülür; başlangıç genellikle ergenlik veya genç erişkinliktir.",
            "etiology": "OKB spektrum mekanizmaları, referans düşünceleri ve aşırı duyarlı koku algılama bilişsel çarpıtmaları.",
            "prognosis": "Tepki Önleme ile Maruz Bırakma (ERP) ve yüksek doz SSRI tedavisi ile belirgin iyileşme sağlanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Kötü Koku Takıntısı",
                "content": "Başkalarınca algılanmayan ya da hafif olan kötü veya rahatsız edici bir vücut kokusu yaydığına dair sürekli ve müdahaleci bir zihinsel uğraş."
            },
            {
                "code": "Kriter B",
                "title": "Yineleyici Davranışlar ve Referans Fikirleri",
                "content": "Kokuyu kontrol etme (sürekli koklama), aşırı yıkanma, parfüm sıkma, kıyafet değiştirme veya başkalarının hareketlerini (burnunu tutma, pencere açma) kokuya yorma."
            },
            {
                "code": "Kriter C",
                "title": "İşlevsellik Kaybı",
                "content": "Belirtiler belirgin sosyal izolasyona, iş/okul terkine veya ağır klinik sıkıntıya yol açar."
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
    "internet_gaming_disorder": {
        "id": "internet_gaming_disorder",
        "nameTr": "İnternet Oyun Oynama Bozukluğu",
        "nameEn": "Internet Gaming Disorder",
        "clinicalDescription": {
            "overview": "İnternet üzerinden diğer oyuncularla veya tek başına video oyunu oynamaya yönelik tekrarlayan, kontrol edilemeyen, iş ve okul hayatını felce uğratan aşırı düşkünlüktür.",
            "epidemiology": "Özellikle 12-25 yaş arası erkeklerde sıktır (%1-5).",
            "etiology": "Oyunların değişken pekiştirme ödül mekanizmaları, hızlı dopaminerjik tatmin, sosyal izolasyondan kaçış ve dürtüsellik.",
            "prognosis": "Motivasyonel Görüşme ve BDT ile oyun süresi kısıtlanarak sağlıklı aktivitelere yönlendirme yapılır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "12 Aylık Sürede En Az 5/9 Ölçüt",
                "content": "1. Oyunla aşırı zihinsel uğraş. 2. Oyun bırakıldığında yoksunluk belirtileri (irritabilite, anksiyete). 3. Tolerans (oyunda geçirilen süreyi artırma ihtiyacı). 4. Oyunu kontrol etmede başarısız girişimler. 5. Önceki hobilere ilginin kaybolması. 6. Sorunlara rağmen aşırı oynamayı sürdürme. 7. Aileye/terapiste oynama süresi hakkında yalan söyleme. 8. Olumsuz duygulardan kaçmak için oyunu kullanma. 9. Oyun yüzünden önemli bir ilişkiyi, işi veya eğitim fırsatını tehlikeye atma/kaybetme."
            }
        ]
    },
    "capgras_syndrome": {
        "id": "capgras_syndrome",
        "nameTr": "Capgras Sanrısı (Dublör / Değiştirilme Hezeyanı)",
        "nameEn": "Capgras Delusion / Misidentification Syndrome",
        "clinicalDescription": {
            "overview": "Kişinin özellikle eşi, anne-babası veya çocukları gibi yakın birinin fiziksel olarak tıpatıp aynı görünen bir dublör veya sahtekarla değiştirildiğine inandığı nadir bir sanrısal yanlış tanıma sendromudur.",
            "epidemiology": "Şizofreni, şizoaffektif bozukluk, ağır psikotik depresyon veya sağ hemisfer parietal/temporal lezyonlarında ortaya çıkabilir.",
            "etiology": "Görsel yüz tanıma merkezi (fusiform gyrus) ile duygusal aşinalık üreten limbik sistem arasındaki bağlantının kopması sonucu 'Görüyorum ama aynı duyguyu hissetmiyorum, demek ki sahtesi' çıkarımı yapılır.",
            "prognosis": "Altta yatan psikotik tablonun antipsikotik tedavisiyle gerileyebilir; organik lezyonlarda kronikleşebilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Tanıdık Kişinin Dublör Olduğu İnancı",
                "content": "Kişinin yakın çevresindeki bir veya daha fazla kişinin fiziksel benzerliği kabul edilmekle birlikte sahte bir kopyayla değiştirildiği sanrısı."
            },
            {
                "code": "Kriter B",
                "title": "Sarsılmazlık ve İkna Edilemezlik",
                "content": "Mantıklı kanıtlar ve kimlik belgelerine rağmen inancın değiştirilememesi."
            }
        ]
    },
    "cotard_syndrome": {
        "id": "cotard_syndrome",
        "nameTr": "Cotard Sendromu (Yürüyen Ceset / Nihilistik Sanrı)",
        "nameEn": "Cotard's Syndrome (Walking Corpse Delusion)",
        "clinicalDescription": {
            "overview": "Kişinin öldüğüne, iç organlarının çürüdüğüne, kanının akmadığına veya tüm dünyanın yok olduğuna inandığı aşırı nihilistik bir psikoz tablosudur.",
            "epidemiology": "En sık yaşlılıkta görülen ağır psikotik depresyonda, bipolar depresif atakta veya ileri evre ensefalopati/demansta görülür.",
            "etiology": "Duygusal tepkisizliğin en uç boyuta ulaşması sonucu kişinin kendi varlığını inkar etmesi (ağır prefrontal ve parietal disfonksiyon).",
            "prognosis": "EKT (Elektrokonvülsif Terapi) ve antipsikotik/antidepresan kombinasyonuna yanıtı oldukça yüz güldürücüdür."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Nihilistik Sanrılar",
                "content": "Kendi bedeninin, organlarının, ruhunun veya dünyanın var olmadığını/çürüdüğünü iddia etme."
            },
            {
                "code": "Kriter B",
                "title": "Ölüm ve Çürüme Odaklılık",
                "content": "Ölü olduğu gerekçesiyle yemek yemeyi, bakımı ve hareketi tamamen reddetme."
            }
        ]
    },
    "neuroleptic_malignant_syndrome": {
        "id": "neuroleptic_malignant_syndrome",
        "nameTr": "Nöroleptik Malign Sendrom (NMS)",
        "nameEn": "Neuroleptic Malignant Syndrome",
        "clinicalDescription": {
            "overview": "Antipsikotik (nöroleptik) ilaç kullanımına bağlı gelişen, yüksek ateş, kurşun boru rijiditesi ve otonomik instabiliteyle seyreden hayatı tehdit edici bir tıbbi acildir.",
            "epidemiology": "Antipsikotik kullanan hastaların %0.02 - %0.04'ünde görülür; erkeklerde ve yüksek potensli tipik antipsikotiklerde daha sıktır.",
            "etiology": "Hipotalamus ve bazal ganglionlarda masif dopamin D2 reseptör blokajı.",
            "prognosis": "Erken tanı, ilacın derhal kesilmesi, Dantrolen/Bromokriptin ve yoğun bakım desteği ile mortalite %10'un altına iner."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Hipertermi ve Rijidite",
                "content": "Nöroleptik kullanımıyla ilişkili olarak şiddetli kas sertliği (kurşun boru) ve yüksek ateş (>38°C)."
            },
            {
                "code": "Kriter B",
                "title": "Otonomik Bulgular ve CK Yüksekliği",
                "content": "Taşikardi, terleme, tansiyon dalgalanması ve masif Serum Kreatin Kinaz (CK) artışı."
            }
        ]
    },
    "serotonin_syndrome": {
        "id": "serotonin_syndrome",
        "nameTr": "Serotonin Sendromu (Toksisitesi)",
        "nameEn": "Serotonin Syndrome",
        "clinicalDescription": {
            "overview": "Serotonerjik ilaçların birlikte kullanımı veya aşırı dozu sonucu gelişen, nöromüsküler uyarılabilirlik (klonus, hiperrefleksi), ajitasyon ve otonomik dengesizlik tablosudur.",
            "epidemiology": "SSRI + MAOI, SSRI + Tramadol/Triptan/Sarı Kantaron gibi kombinasyonlarda hızla tetiklenir.",
            "etiology": "Santral 5-HT2A ve 5-HT1A reseptörlerinin aşırı stimülasyonu.",
            "prognosis": "İlaç kesimi, Siproheptadin (antiserotonerjik) ve destek tedavisi ile vakaların %70'i 24 saat içinde düzelir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Serotonerjik Ajan Kullanımı",
                "content": "Serotonin düzeyini artıran bir veya daha fazla ilacın kullanımı."
            },
            {
                "code": "Kriter B",
                "title": "Spontan Klonus ve Hiperrefleksi",
                "content": "Ayak bileği klonusu, titreme, hiperrefleksi, terleme ve ajitasyon mevcudiyeti (Hunter Kriterleri)."
            }
        ]
    },
    "narcolepsy": {
        "id": "narcolepsy",
        "nameTr": "Narkolepsi (Tip 1 / Katapleksili)",
        "nameEn": "Narcolepsy with Cataplexy",
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
    "rocd": {
        "id": "rocd",
        "nameTr": "İlişki Odaklı OKB (Relationship OCD / ROCD)",
        "nameEn": "Relationship Obsessive-Compulsive Disorder",
        "clinicalDescription": {
            "overview": "Kişinin partnerine olan sevgisini, partnerinin fiziksel/zihinsel uygunluğunu sürekli sorgulayan ego-distonik obsesyonlar ve kompulsif güvence arayışlarıdır.",
            "epidemiology": "OKB hastalarının yaklaşık %15-20'sinde ilişki odaklı temalar görülür.",
            "etiology": "Mükemmeliyetçilik şemaları, belirsizliğe tahammülsüzlük ve 'mükemmel aşk' mitleri.",
            "prognosis": "İlişki temalı Maruz Bırakma ve Tepki Önleme (ERP) ve BDT ile yüksek başarı sağlanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "İlişki Takıntıları",
                "content": "Partnerin sevgisine veya uygunluğuna dair yineleyici, müdahaleci şüphe düşünceleri."
            },
            {
                "code": "Kriter B",
                "title": "Kompulsif Güvence ve Kıyaslama",
                "content": "Sürekli başkalarıyla kıyaslama, partneri test etme ve arkadaşlarından güvence isteme ritüelleri."
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
    "major_neurocognitive_nph": {
        "id": "major_neurocognitive_nph",
        "nameTr": "Majör Nörobilişsel Bozukluk (Normal Basınçlı Hidrosefali / Hakim-Adams)",
        "nameEn": "Major Neurocognitive Disorder Due to Normal Pressure Hydrocephalus",
        "clinicalDescription": {
            "overview": "Genişlemiş ventriküllere rağmen normal BOS basıncı ile seyreden, yürüme bozukluğu, idrar kaçırma ve bilişsel gerileme (Hakim-Adams Triadı) ile karakterize geri dönüşümlü demans tablosudur.",
            "epidemiology": "Genellikle 65 yaş üzerinde sinsi başlar.",
            "etiology": "BOS emilim yollarında direnç artışı ve ventrikülomegali.",
            "prognosis": "Erken evrede Ventriküloperitoneal Şant Cerrahisi ile dramatik düzelme sağlanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Hakim-Adams Triadı",
                "content": "Yürüme apraksisi (manyetik yürüyüş), üriner inkontinans ve subkortikal bilişsel yavaşlama."
            },
            {
                "code": "Kriter B",
                "title": "Ventrikülomegali ve LP Yanıtı",
                "content": "Genişlemiş ventriküller ve BOS boşaltma testi (Tap Test) sonrası klinik düzelme."
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
    "specific_learning_dyslexia": {
        "id": "specific_learning_dyslexia",
        "nameTr": "Özgül Öğrenme Bozukluğu (Okuma Güçlüğü / Disleksi)",
        "nameEn": "Specific Learning Disorder with Impairment in Reading",
        "clinicalDescription": {
            "overview": "Normal zeka ve yeterli eğitime rağmen sözcükleri doğru ve akıcı okumada, harf-ses eşleştirmede yaşanan nörogelişimsel öğrenme güçlüğüdür.",
            "epidemiology": "Okul çağı çocuklarının %5-15'inde görülür. En sık rastlanan öğrenme bozukluğudur.",
            "etiology": "Sol temporal-paryetal bölgedeki fonolojik işleme devrelerinde nöronal göç ve bağlantı farklılıkları.",
            "prognosis": "Çok duyulu yapılandırılmış özel eğitim (Orton-Gillingham) ile okuma becerileri telafi edilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Okuma Güçlüğü",
                "content": "Sözcük okuma doğruluğunda, okuma hızında ve okuduğunu anlamada en az 6 aydır süren güçlük."
            },
            {
                "code": "Kriter B",
                "title": "Zeka Düzeyinin Üstünde Olması",
                "content": "Okuma becerilerinin kronolojik yaş ve zeka kapasitesinin belirgin gerisinde kalması."
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
    "sexsomnia": {
        "id": "sexsomnia",
        "nameTr": "Seksomni (Uykuda Cinsel Davranış)",
        "nameEn": "Sexsomnia (Sleep Sex / NREM Parasomnia)",
        "clinicalDescription": {
            "overview": "Derin NREM uykusundayken kişinin tam bilinç dışı olarak partnerine cinsel girişimde bulunması veya mastürbasyon yapması ve sabah hiçbir şey hatırlamamasıdır.",
            "epidemiology": "Nadir bir NREM parasomnisidir; adli tıpta cinsel saldırı iddialarında önemli yer tutar.",
            "etiology": "Derin yavaş dalga uykusundan korteksin uyanamaması, sadece motor ve cinsel merkezlerin disinhibe olması.",
            "prognosis": "Klonazepam, uyku hijyeni ve yatak odası güvenlik önlemleriyle tam kontrol sağlanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Uykuda Cinsel Eylemler",
                "content": "NREM uykusu sırasında istemsiz ve otomatik cinsel motor davranışlar."
            },
            {
                "code": "Kriter B",
                "title": "Sabah Tam Amnezi",
                "content": "Uyanıldığında sergilenen cinsel eylemlere dair tam bellek yitimi."
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
    "ganser_syndrome": {
        "id": "ganser_syndrome",
        "nameTr": "Ganser Sendromu (Yaklaşık Yanıtlar / Cezaevi Histerisi)",
        "nameEn": "Ganser Syndrome",
        "clinicalDescription": {
            "overview": "Ağır cezaevi veya adli stresörler altında basit sorulara kasıtlı gibi görünen ancak disosiyatif kökenli 'yaklaşık saçma yanıtlar' (vorbeireden) verme tablosudur.",
            "epidemiology": "Cezaevindeki tutuklularda ve ağır travma yaşayanlarda görülür.",
            "etiology": "Dayanılmaz suçluluk veya hapis tehdidine karşı ilkel disosiyatif kaçış savunması.",
            "prognosis": "Stresörün kalkması ve destekleyici psikoterapiyle hızla kendiliğinden düzelir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Yaklaşık Saçma Yanıtlar",
                "content": "Basit soruların mantığını anlayıp hemen yanındaki yanlış cevabı verme (örn: 2+2=5)."
            },
            {
                "code": "Kriter B",
                "title": "Bilinç Bulanıklığı ve Disosiasyon",
                "content": "Alacakaranlık bilinç durumu ve organik bir demansın bulunmaması."
            }
        ]
    },
    "compulsive_buying_disorder": {
        "id": "compulsive_buying_disorder",
        "nameTr": "Kompulsif Satın Alma Bozukluğu (Oniomani / Alışveriş Bağımlılığı)",
        "nameEn": "Compulsive Buying Disorder (Oniomania)",
        "clinicalDescription": {
            "overview": "Kişinin ihtiyacı olmayan şeyleri karşı konulamaz bir dürtüyle satın alması, satın alma anında öfori yaşayıp sonrasında ağır borç ve suçluluk içine düşmesidir.",
            "epidemiology": "Toplumda %5-8 oranında görülür; kadınlarda daha sık bildirilmektedir.",
            "etiology": "Dopaminerjik ödül eksikliği, düşük benlik saygısını eşyalarla telafi etme ve dürtüsellik.",
            "prognosis": "Finansal uyaran kontrolü ve BDT (CBT-IA) ile harcama döngüsü kontrol altına alınır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Dürtüsel Satın Alma",
                "content": "Gereksiz eşyaları satın alma dürtüsüyle aşırı zihinsel meşguliyet ve kontrol kaybı."
            },
            {
                "code": "Kriter B",
                "title": "Finansal ve Sosyal Yıkım",
                "content": "Ağır borçlanma, aile çatışmaları ve satın alınan eşyaları kullanmadan gizleme."
            }
        ]
    },
    "tardive_dyskinesia": {
        "id": "tardive_dyskinesia",
        "nameTr": "İlacın Yol Açtığı Tardif Diskinezi (TD)",
        "nameEn": "Medication-Induced Tardive Dyskinesia",
        "clinicalDescription": {
            "overview": "Uzun süreli antipsikotik kullanımı sonucu gelişen, dil, dudak, çene ve yüz kaslarında istemsiz koreoatetoid hareketlerle seyreden hareket bozukluğudur.",
            "epidemiology": "Tipik antipsikotik kullananların %20-30'unda yıllar içinde gelişir; yaşlılarda risk yüksektir.",
            "etiology": "Kronik D2 blokajına bağlı striatumda dopamin reseptörlerinin aşırı duyarlılaşması (up-regulation).",
            "prognosis": "VMAT2 inhibitörleri (Valbenazin, Dötetrabenazin) ve atipik antipsikotiğe (Klozapin) geçişle tedavi edilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "İstemsiz Orofasial Hareketler",
                "content": "Dudak şapırdatma, dil çıkarma, çiğneme benzeri istemsiz ritmik olmayan hareketler."
            },
            {
                "code": "Kriter B",
                "title": "Nöroleptik İlaç Kullanım Öyküsü",
                "content": "En az birkaç aydır devam eden antipsikotik/dopamin bloker ilaç kullanımı."
            }
        ]
    },
    "delusional_erotomanic": {
        "id": "delusional_erotomanic",
        "nameTr": "Sanrılı Bozukluk (Erotomanik Tip / Clérambault Sendromu)",
        "nameEn": "Delusional Disorder (Erotomanic Type)",
        "clinicalDescription": {
            "overview": "Kişinin genellikle kendisinden daha yüksek toplumsal, mesleki veya ünlü statüdeki bir başkasının kendisine sırılsıklam aşık olduğuna dair sarsılmaz ve sistematize bir sanrı taşıdığı klinik tablodur (De Clérambault Sendromu). Sanrı alanı dışında genel işlevsellik ve davranışlar görece korunmuştur.",
            "epidemiology": "Sanrılı bozuklukların yaşam boyu yaygınlığı yaklaşık %0.2'dir. Erotomanik alt tip kadınlarda daha sık görülürken, adli takip (stalking) vakalarında erkeklerin oranı yüksektir.",
            "etiology": "Sosyal izolasyon, narsisistik yaralanmalara karşı geliştirilen yansıtma ve inkar savunmaları ile mezolimbik dopaminerjik aşırı aktivite rol oynar.",
            "prognosis": "Kronik seyirlidir; CBTp, sınır koyma ve ikinci kuşak antipsikotiklerle sanrısal uğraş ve takip davranışları kontrol altına alınabilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Erotomanik Sanrı Ölçütü (En az 1 ay)",
                "content": "En az 1 ay ya da daha uzun süren, genellikle daha yüksek statüdeki başka bir kişinin kendisine aşık olduğuna ilişkin sarsılmaz sanrının varlığı."
            },
            {
                "code": "Kriter B",
                "title": "Şizofreni Dışlaması ve Korunmuş İşlevsellik",
                "content": "Şizofreni A ölçütü hiçbir zaman karşılanmamıştır; sanrının doğrudan etkileri dışında işlevsellik belirgin olarak bozulmamıştır ve davranışlar garip/acayip değildir."
            }
        ]
    },
    "delusional_jealous": {
        "id": "delusional_jealous",
        "nameTr": "Sanrılı Bozukluk (Kıskançlık Tipi / Othello Sendromu)",
        "nameEn": "Delusional Disorder (Jealous Type)",
        "clinicalDescription": {
            "overview": "Kişinin hiçbir nesnel kanıt olmaksızın eşinin veya cinsel partnerinin kendisini aldattığına (sadakatsiz olduğuna) kesin olarak inandığı sanrılı bozukluk alt tipidir (Othello Sendromu). Hasta rastlantısal küçük olayları 'ihanet kanıtı' olarak toplar ve eşini sürekli takip eder.",
            "epidemiology": "Erkeklerde kadınlara oranla daha sık görülür. Ortalama başlangıç yaşı orta-ileri erişkinlik dönemidir.",
            "etiology": "Yetersizlik ve cinsel güçsüzlük duygularının eşe yansıtılması (projeksiyon), sağ frontal lob işlev bozuklukları ve dopaminerjik disregülasyon etkilidir.",
            "prognosis": "Adli psikiyatride eşe yönelik ağır şiddet ve eş cinayeti (homisid) riski en yüksek tablolardan biridir; antipsikotik tedavi ve eş güvenliği hayati önem taşır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Sadakatsizlik Sanrısı (En az 1 ay)",
                "content": "En az 1 ay boyunca, eşinin ya da sevgilisinin sadakatsiz olduğuna ilişkin sarsılmaz ve kanıtsız sanrının bulunması."
            },
            {
                "code": "Kriter B",
                "title": "İzole Sanrı Sistemi",
                "content": "Belirgin halüsinasyonlar veya dezorganize konuşma yoktur; sanrı alanı dışında bilişsel ve mesleki yetiler korunmuştur."
            }
        ]
    },
    "delusional_somatic": {
        "id": "delusional_somatic",
        "nameTr": "Sanrılı Bozukluk (Somatik Tip / Ekbom Sendromu)",
        "nameEn": "Delusional Disorder (Somatic Type / Delusional Parasitosis)",
        "clinicalDescription": {
            "overview": "Sanrının temel içeriğinin bedensel işlevler veya duyumlarla ilgili olduğu tablodur. En sık görülen formu kişinin derisinin altında böceklerin, kurtçukların veya parazitlerin gezindiğine inandığı 'Delüzyonel Parazitoz' (Ekbom Sendromu) olup, hastalar deri döküntülerini kibrit kutusunda hekime kanıt diye getirirler (Matchbox Sign).",
            "epidemiology": "Genellikle 50 yaş üzeri bireylerde ve kadınlarda daha sık görülür; hastalar psikiyatri yerine dermatoloji ve enfeksiyon kliniklerine başvurur.",
            "etiology": "Taktil (dokunsal) duyusal parestezilerin striatal dopaminerjik disfonksiyon nedeniyle sanrısal düzeyde yanlış yorumlanması.",
            "prognosis": "Antipsikotik tedaviye (Risperidon, Olanzapin, Pimozid) ve dermatoloji-psikiyatri işbirliğine iyi yanıt verir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Bedensel / Paraziter Sanrı (En az 1 ay)",
                "content": "En az 1 ay süren; deri altında böcek/parazit bulunması, vücuttan kötü koku yayılması veya organların çalışmadığına dair sabit somatik sanrı."
            },
            {
                "code": "Kriter B",
                "title": "Tıbbi ve Madde Dışlaması",
                "content": "Gerçek bir dermatolojik enfestasyon veya kokain/amfetamin intoksikasyonuna (formikasyon) bağlı değildir."
            }
        ]
    },
    "folie_a_deux": {
        "id": "folie_a_deux",
        "nameTr": "Paylaşılmış Psikotik Bozukluk (Folie à Deux)",
        "nameEn": "Shared Psychotic Disorder (Folie à Deux)",
        "clinicalDescription": {
            "overview": "Yerleşik bir sanrısı olan baskın (primer/indükleyen) bir bireyle çok yakın, kapalı ve dış dünyadan izole bir ilişki içinde yaşayan daha pasif/bağımlı (sekonder/alıcı) bir kişide de birebir aynı sanrı sisteminin gelişmesi tablosudur.",
            "epidemiology": "Nadir görülür; vakaların %90'ı aynı çekirdek aile içindedir (en sık iki kız kardeş, anne-çocuk veya karı-koca).",
            "etiology": "Sosyal izolasyon, patolojik bağımlılık, özdeşim kurma ve baskın ortağın otoritesine boyun eğme dinamikleri rol oynar.",
            "prognosis": "Sekonder (alıcı) hasta baskın psikotik kişiden fiziksel olarak ayrıldığında sanrıları hızla zayıflar ve çözülür."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Sanrı Aktarımı (İndüksiyon)",
                "content": "Halihazırda yerleşik sanrısı olan baskın bir kişiyle yakın ve izole bir ilişki bağlamında ikinci kişide de aynı sanrının gelişmesi."
            },
            {
                "code": "Kriter B",
                "title": "Birincil Psikoz Dışlaması",
                "content": "Bozukluk şizofreni veya psikotik özellikli duygudurum bozukluğu ile daha iyi açıklanamaz ve ayrıştırma ile geriler."
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
    "bipolar_1_rapid_cycling": {
        "id": "bipolar_1_rapid_cycling",
        "nameTr": "Bipolar I Bozukluğu (Hızlı Döngülü Tip / Rapid Cycling)",
        "nameEn": "Bipolar I Disorder with Rapid Cycling",
        "clinicalDescription": {
            "overview": "Son 12 ay (1 yıl) içinde mani, hipomani ya da majör depresyon tanı ölçütlerini tam karşılayan en az 4 ayrı duygudurum epizodunun yaşanmasıyla tanımlanan, tedaviye dirençli seyreden bipolar seyir belirtecidir.",
            "epidemiology": "Bipolar hastaların yaklaşık %10-20'sinde gelişir; kadınlarda, Bipolar II'de ve hipotiroidisi olanlarda çok daha sıktır.",
            "etiology": "Uygunsuz ve aşırı antidepresan (SSRI/SNRI/Trisiklik) kullanımı, hipotiroidi, uyku-uyanıklık düzensizliği ve biyolojik saat gen polimorfizmleri.",
            "prognosis": "Antidepresanların derhal kesilmesi, tiroid tedavisi ve Valproat/Lamotrijin/Ketiapin ile döngü hızı yavaşlatılır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Yılda En Az 4 Epizod Ölçütü",
                "content": "Son 12 ay içinde mani, hipomani veya majör depresyon kriterlerini karşılayan en az 4 ayrı duygudurum döneminin bulunması."
            },
            {
                "code": "Kriter B",
                "title": "Remisyon veya Kutup Değişimi",
                "content": "Dönemler birbirinden en az 2 ay süren kısmi/tam yatışma ile ayrılır ya da doğrudan karşıt kutba (örn. depresyondan maniye) geçiş olur."
            }
        ]
    },
    "mdd_with_peripartum": {
        "id": "mdd_with_peripartum",
        "nameTr": "Peripartum (Doğum Sonrası / Postpartum) Başlangıçlı Depresyon",
        "nameEn": "Major Depressive Disorder with Peripartum Onset",
        "clinicalDescription": {
            "overview": "Gebelik sırasında ya da doğumdan sonraki ilk 4 hafta içinde başlayan majör depresif epizod tablosudur. Ağır keder, bebeğe bağlanamama, 'Ben kötü bir anneyim' suçluluğu, aşırı kaygı ve uykusuzlukla seyreder.",
            "epidemiology": "Doğum yapan kadınların yaklaşık %10-15'inde görülür; vakaların yarısı aslında gebelik sırasında başlar.",
            "etiology": "Doğum sonrası östrojen, progesteron ve allopregnanolon (GABAerjik nörosteroid) düzeylerindeki ani çöküş ve rol geçişi stresi.",
            "prognosis": "Kişilerarası İlişkiler Terapisi (IPT), Sertralin ve Breksanolon/Zuranolon ile anne ve bebek sağlığı hızla korunur."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Gebelik veya Doğum Sonrası İlk 4 Hafta Başlangıcı",
                "content": "Majör depresyon belirtilerinin gebelik sırasında ya da doğumdan sonraki ilk 4 hafta içinde başlaması."
            },
            {
                "code": "Kriter B",
                "title": "Annelik Hüznünden (Baby Blues) Ayrım",
                "content": "İlk 10-14 günde kendiliğinden geçen hafif annelik hüznünden farklı olarak en az 2 hafta sürer ve ağır işlev kaybı yaratır."
            }
        ]
    },
    "mdd_with_atypical": {
        "id": "mdd_with_atypical",
        "nameTr": "Atipik Özellikli Majör Depresif Bozukluk",
        "nameEn": "Major Depressive Disorder with Atypical Features",
        "clinicalDescription": {
            "overview": "Olumlu olaylar karşısında neşelenebilme (duygudurum tepkiselliği) ile birlikte klasik depresyonun tersine aşırı uyuma (hipersomni), aşırı yeme/kilo alımı (karbonhidrat aşermesi), kol ve bacaklarda kurşun gibi ağırlık hissi (kurşun felci) ve reddedilme duyarlılığı ile seyreden depresyon tipidir.",
            "epidemiology": "Depresyon vakalarının %15-30'unu oluşturur; genç kadınlarda ve Bipolar II depresyonunda oldukça sıktır.",
            "etiology": "Klasik depresyondaki CRH/kortizol yüksekliğinin aksine HPA ekseni hipoaktivitesi ve serotonerjik/dopaminerjik düşüş.",
            "prognosis": "Davranışsal Aktivasyon, SSRI, Bupropion ve klasik olarak MAO İnhibitörlerine (Moklobemid) çok iyi yanıt verir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Duygudurum Tepkiselliği (Zorunlu Kriter)",
                "content": "Olumlu gerçek ya da potansiyel olaylar karşısında duygudurumun açılması ve neşelenebilmesi."
            },
            {
                "code": "Kriter B",
                "title": "Eşlik Eden Vejetatif ve Kişilerarası Bulgular (En az 2/4)",
                "content": "1) Belirgin kilo alımı veya iştah artışı, 2) Hipersomni (günde ≥10 saat uyku), 3) Kurşun felci (kollarda/bacaklarda ağırlık), 4) Kişilerarası reddedilme duyarlılığı."
            }
        ]
    },
    "mdd_with_melancholic": {
        "id": "mdd_with_melancholic",
        "nameTr": "Melankolik Özellikli Majör Depresif Bozukluk",
        "nameEn": "Major Depressive Disorder with Melancholic Features",
        "clinicalDescription": {
            "overview": "Tüm etkinliklerden zevk alma yetisinin tamamen kaybolması (tam anhedoni) ve en sevindirici haberlere bile tepki verememe ile karakterize, biyolojik/endojen yönü en ağır depresyon alt tipidir. Sabahları erken uyanma, sabah saatlerinde depresyonun en ağır olması, psikomotor retardasyon ve ciddi kilo kaybı tipiktir.",
            "epidemiology": "İleri yaşta, yatan hastalarda ve psikotik depresyon sınırındaki ağır vakalarda sık görülür.",
            "etiology": "HPA ekseni hiperaktivitesi (deksametazon baskılama testi bozukluğu), REM latansı kısalması ve ağır noradrenerjik/serotonerjik çöküş.",
            "prognosis": "Plaseboya yanıt vermez; SNRI, Trisiklik antidepresanlar ve EKT (Elektrokonvülsif Terapi) ile yüksek remisyon sağlanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Tam Anhedoni ve Tepkisizlik",
                "content": "Hemen tüm etkinliklere karşı zevkin kaybolması VE normalde iyi hissettirecek uyaranlara karşı duygudurum tepkiselliğinin tamamen yitirilmesi."
            },
            {
                "code": "Kriter B",
                "title": "Karakteristik Melankolik Bulgular (En az 3/6)",
                "content": "Boşluk/umutsuzluk niteliğinde keder, sabahları düzenli olarak daha kötü olma, sabah erken uyanma (≥2 saat önce), belirgin psikomotor yavaşlama/ajitasyon, belirgin anoreksi/kilo kaybı, aşırı suçluluk."
            }
        ]
    },
    "specific_phobia_blood": {
        "id": "specific_phobia_blood",
        "nameTr": "Özgül Fobi (Kan-Enjeksiyon-Yara Tipi / Vazovagal)",
        "nameEn": "Specific Phobia (Blood-Injection-Injury Type)",
        "clinicalDescription": {
            "overview": "Kan görme, iğne/enjeksiyon yaptırma veya invaziv tıbbi işlemlere karşı duyulan aşırı korku ve kaçınma tablosudur. Diğer tüm fobilerden farklı olarak 'bifazik otonomik yanıt' (önce kısa taşikardi, ardından ani vagal bradikardi ve tansiyon düşüşüyle bayılma/senkop) görülür.",
            "epidemiology": "Toplumda yaygınlığı %3-4'tür ve tüm özgül fobiler içinde ailesel/genetik geçişi en güçlü olandır (%60-70).",
            "etiology": "Evrimsel aşırı gelişmiş vazovagal refleks ve travmatik tıbbi işlem koşullanmaları.",
            "prognosis": "Gevşeme değil, 'Uygulamalı Kas Gerdirme' (Applied Tension - Öst protokolü) ve kademeli maruz bırakma ile birkaç seansta tam düzelir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Kan ve İğne Korkusu (En az 6 ay)",
                "content": "En az 6 aydır süren, kan, enjeksiyon veya yaralanma uyaranlarıyla karşılaşıldığında ortaya çıkan yoğun korku ve vazovagal senkop eğilimi."
            },
            {
                "code": "Kriter B",
                "title": "Tıbbi İşlemlerden Kaçınma",
                "content": "Korku nedeniyle hastaneye gitmekten ve kan tahlili yaptırmaktan aktif olarak kaçınma."
            }
        ]
    },
    "specific_phobia_emetophobia": {
        "id": "specific_phobia_emetophobia",
        "nameTr": "Özgül Fobi (Kusma Korkusu / Emetofobi)",
        "nameEn": "Specific Phobia (Emetophobia)",
        "clinicalDescription": {
            "overview": "Kişinin kendisinin kusmasından ya da bir başkasının kustuğunu görmekten/duymaktan aşırı ve mantıksız düzeyde korkmasıdır. Hastalar kusma ihtimalini sıfırlamak için dışarıda yemek yemez, porsiyonlarını aşırı kısıtlar ve sürekli bulantı ilacı taşır.",
            "epidemiology": "Kadınlarda erkeklere oranla 4 kat daha sık görülür; genellikle çocukluk veya erken ergenlikte başlar.",
            "etiology": "Çocuklukta yaşanan travmatik ve kontrolsüz kusma/gastroenterit deneyimleri ile interoseptif aşırı duyarlılık.",
            "prognosis": "İnteroseptif ve canlı maruz bırakma BDT'si ile güvenlik arama davranışlarının söndürülmesiyle yüksek başarı sağlanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Kusma Eylemine Özgü Fobik Kaygı",
                "content": "En az 6 aydır devam eden, kusma veya bulantı duyumlarına karşı orantısız ve yoğun korku."
            },
            {
                "code": "Kriter B",
                "title": "Beden İmajı Bozukluğu Olmadan Gıda Kısıtlaması",
                "content": "Zayıflama amacı olmaksızın sadece kusmayı önlemek için yiyecek kısıtlama, sosyal ortamlardan kaçınma ve işlev kaybı."
            }
        ]
    },
    "social_anxiety_performance": {
        "id": "social_anxiety_performance",
        "nameTr": "Sosyal Anksiyete Bozukluğu (Yalnızca Performans Tipi)",
        "nameEn": "Social Anxiety Disorder (Performance Only)",
        "clinicalDescription": {
            "overview": "Korkunun yalnızca topluluk önünde konuşma, sunum yapma veya sahnede performans sergileme (müzisyenler, sporcular, akademisyenler) durumlarıyla sınırlı olduğu sosyal fobi alt tipidir. Kişi günlük sosyal sohbetlerde ve tanışmalarda hiçbir kaygı yaşamaz.",
            "epidemiology": "Profesyonel sahne sanatçıları, müzisyenler ve konuşmacılar arasında yaygınlığı %15-25'e kadar çıkar.",
            "etiology": "Performans sırasında el titremesi veya ses titremesinin izleyiciler tarafından fark edilip rezil olacağına dair felaketleştirici bilişler ve sempatik deşarj.",
            "prognosis": "BDT (dikkat eğitimi ve maruz bırakma) ve performanstan 1 saat önce alınan tek doz Propranolol (Beta-bloker) ile tam kontrol sağlanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Sadece Sahne ve Sunum Korkusu (En az 6 ay)",
                "content": "Olumsuz değerlendirilme korkusunun yalnızca topluluk önünde konuşma ya da performans gösterme ile sınırlı olması."
            },
            {
                "code": "Kriter B",
                "title": "Genel Sosyal Etkileşimlerin Korunması",
                "content": "Performans dışı sosyal ortamlarda (partiler, birebir sohbet, yemek yeme) kişinin hiçbir korku veya kaçınma yaşamaması."
            }
        ]
    },
    "muscle_dysmorphia": {
        "id": "muscle_dysmorphia",
        "nameTr": "Beden Algısı Bozukluğu (Kas Dismorfisi / Bigoreksiya)",
        "nameEn": "Muscle Dysmorphia (Bigorexia)",
        "clinicalDescription": {
            "overview": "DSM-5'te Beden Algısı Bozukluğunun bir alt belirteci olan Kas Dismorfisinde, kişi gerçekte normal ya da aşırı kaslı bir vücuda sahip olmasına rağmen bedeninin 'çok küçük, cılız ve yetersiz kaslı' olduğu saplantısıyla yaşar.",
            "epidemiology": "Neredeyse tamamen erkeklerde ve özellikle vücut geliştirme/ağırlık sporlarıyla uğraşan genç erkeklerde görülür.",
            "etiology": "Mükemmeliyetçi erkeklik/güç şemaları, görsel beden işleme devrelerinde bozukluk ve OKB spektrumu genetik yatkınlığı.",
            "prognosis": "ERP (ayna kontrolü ve kamuflajı bırakma), BDT ve yüksek doz SSRI ile tedavi edilir; anabolik steroid kötüye kullanımı mutlaka durdurulmalıdır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Yetersiz Kaslılık Saplantısı",
                "content": "Kişinin objektif olarak kaslı olmasına karşın vücut yapısının çok küçük ya da yeterince kaslı olmadığı düşüncesiyle aşırı zihinsel uğraşı."
            },
            {
                "code": "Kriter B",
                "title": "Kompulsif Antrenman ve Kontrol Ritüelleri",
                "content": "Sürekli ayna kontrolü, bol kıyafetlerle kamuflaj, sosyal yaşamı feda edecek düzeyde ağırlık çalışma ve tehlikeli steroid kullanımı."
            }
        ]
    },
    "pandas_syndrome": {
        "id": "pandas_syndrome",
        "nameTr": "PANDAS / PANS (Pediatrik Otoimmün Nöropsikiyatrik OKB)",
        "nameEn": "PANDAS (Pediatric Autoimmune Neuropsychiatric Disorder Associated with Strep)",
        "clinicalDescription": {
            "overview": "Çocuklarda A Grubu Beta Hemolitik Streptokok (boğaz enfeksiyonu/kızıl) sonrasında bazal ganglionlara karşı gelişen otoimmün antikorlar nedeniyle 'bir gecede / yıldırım hızıyla' başlayan şiddetli OKB, tikler, ayrılık anksiyetesi ve el yazısı bozulması (disgrafi) sendromudur.",
            "epidemiology": "3 yaş ile ergenlik (puberte) arasındaki çocuklarda görülür; erkek çocuklarda daha sıktır.",
            "etiology": "Moleküler benzerlik (molecular mimicry): Streptokok bakterisine karşı üretilen antikorların kaudat ve putamen nöronlarıyla çapraz reaksiyona girmesi.",
            "prognosis": "Erken antibiyotik tedavisi, anti-inflamatuar/immünomodülatör destek ve ERP terapisi ile tam iyileşme sağlanır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Streptokok Sonrası Yıldırım Başlangıç",
                "content": "Prepüberal dönemde GAS (Streptokok) enfeksiyonu sonrasında 24-48 saat içinde dramatik ve akut olarak başlayan OKB ve/veya tik bozukluğu."
            },
            {
                "code": "Kriter B",
                "title": "Eşlik Eden Nöropsikiyatrik Bulgular",
                "content": "Akut el yazısı bozulması (disgrafi), koreiform parmak hareketleri, sık idrara çıkma (enürezis) ve şiddetli ayrılık anksiyetesi."
            }
        ]
    },
    "ocd_taboo_thoughts": {
        "id": "ocd_taboo_thoughts",
        "nameTr": "OKB (Tabu Düşünceler: Dini Vesvese / Cinsel / Saldırganlık)",
        "nameEn": "OCD (Taboo / Unacceptable Intrusive Thoughts)",
        "clinicalDescription": {
            "overview": "Kişinin ahlaki ve insani değerlerine tamamen zıt (egodistonik) olan; sevdiklerine zarar verme (bıçaklama, balkondan atma), dini kutsallara küfretme (dini vesvese) veya uygunsuz cinsel imgeler içeren istenmeyen intruzif düşünceler ve bunları silmek için yapılan zihinsel ritüellerle seyreden OKB formudur.",
            "epidemiology": "OKB hastalarının yaklaşık %25-30'unda birincil tema kabul edilemez tabu düşüncelerdir.",
            "etiology": "Düşünce-Eylem Kaynaşması (Thought-Action Fusion: 'Aklıma geldiyse demek ki yapmak istiyorum veya günahkarım' yanılgısı) ve aşırı sorumluluk şeması.",
            "prognosis": "İmajinal ve canlı ERP (kaçınmaları ve zihinsel nötralizasyonu bırakma) ile yüksek doz SSRI tedavisine mükemmel yanıt verir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Egodistonik Tabu Obsesyonlar",
                "content": "Kişide yoğun dehşet ve suçluluk yaratan saldırganlık, dini küfür veya cinsel içerikli istenmeyen intruzif düşünceler/imgeler."
            },
            {
                "code": "Kriter B",
                "title": "Örtük Zihinsel Kompulsiyonlar ve Kaçınma",
                "content": "Dışarıdan görünmeyen sessiz dua/sayma/nötralizasyon ritüelleri, bıçakları saklama, sevdikleriyle yalnız kalmaktan kaçınma ve sürekli güvence arama."
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
    "dissociative_fugue": {
        "id": "dissociative_fugue",
        "nameTr": "Dissosiyatif Füg (Kaçış ve Kimlik Kaybı)",
        "nameEn": "Dissociative Amnesia with Dissociative Fugue",
        "clinicalDescription": {
            "overview": "Ağır bir travmatik veya yıkıcı stresör sonrasında kişinin kendi adını, kimliğini ve geçmişini tamamen unutarak (otobiyografik amnezi) evinden ve şehrinden ayrılması, başka bir şehre amaçlı yolculuk yapması veya bazen yeni bir kimlik benimsemesi tablosudur.",
            "epidemiology": "Dissosiyatif amnezinin en dramatik ve nadir alt tipidir; savaş, doğal afet, ağır finansal iflas veya evlilik yıkımlarında görülür.",
            "etiology": "Dayanılmaz suçluluk, utanç veya travmadan hem zihinsel (amnezi) hem fiziksel (yolculuk) olarak radikal dissosiyatif kaçış.",
            "prognosis": "Çoğu füg birkaç gün veya hafta içinde kendiliğinden çözülür; Faz Odaklı Travma Terapisi ile anılar bütünleştirilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Kişisel Kimlik Amnezisi",
                "content": "Kişinin kendi adını, ailesini ve kişisel geçmişini anımsayamaması (semantik/genel dünya bilgisi korunmuştur)."
            },
            {
                "code": "Kriter B",
                "title": "Amaçlı Yolculuk (Füg)",
                "content": "Evden veya işyerinden beklenmedik biçimde ayrılıp başka bir yere amaçlı yolculuk yapma ya da şaşkın bir biçimde dolaşma."
            }
        ]
    },
    "conversion_seizures": {
        "id": "conversion_seizures",
        "nameTr": "Konversiyon Bozukluğu (Psödonöbet / PNES)",
        "nameEn": "Conversion Disorder (Attacks or Seizures / PNES)",
        "clinicalDescription": {
            "overview": "Epileptik nöbete benzeyen ancak beyinde hiçbir anormal elektriksel deşarj olmadan, tamamen bilinçdışı psikolojik stres ve çatışmaların bedensel kasılma/sarsılma nöbetine dönüştürülmesiyle oluşan tablodur (Psikojenik Non-Epileptik Nöbet - PNES).",
            "epidemiology": "Epilepsi merkezlerine 'ilaca dirençli epilepsi' diye sevk edilen hastaların %20-30'u gerçekte PNES'tir; genç kadınlarda 3 kat sıktır.",
            "etiology": "Bilinçdışı duygusal çatışma veya travmanın sözel ifade edilemeyip motor-dissosiyatif deşarjla dışavurulması (birincil kazanç).",
            "prognosis": "Tanının empatik açıklanması, gereksiz antiepileptiklerin kesilmesi ve PNES odaklı BDT ile nöbetler kontrol altına alınır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Epilepsi Benzeri Nöbetler ve Klinik Uyumsuzluk",
                "content": "Nöbet sırasında gözlerin sımsıkı kapalı olması ve açmaya direnç, başı sağa-sola sallama, asenkron ekstremite hareketleri ve postiktal konfüzyon olmaması."
            },
            {
                "code": "Kriter B",
                "title": "Video-EEG'de Normal Alfa Ritmi (Altın Standart)",
                "content": "Eşzamanlı Video-EEG kaydında hasta nöbet geçirirken epileptiform deşarj olmaması ve normal uyanıklık dalgalarının görülmesi."
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
    "night_eating_syndrome": {
        "id": "night_eating_syndrome",
        "nameTr": "Gece Yeme Sendromu",
        "nameEn": "Night Eating Syndrome",
        "clinicalDescription": {
            "overview": "Sirkadiyen yeme ritminin geceye kayması sonucu; sabahları belirgin iştahsızlık (sabah anoreksisi), akşam yemeğinden sonra günlük kalorinin %25'inden fazlasını tüketme ve gece uykudan tam bilinçli olarak uyanıp yemek yemeden tekrar uyuyamama sendromudur.",
            "epidemiology": "Genel toplumda %1.5, obezite kliniklerinde ise %10-15 oranında görülür.",
            "etiology": "Gece melatonin ve leptin yükselişinin körelmesi, kortizol yüksekliği ve 'yemezsem uyuyamam' bilişsel şartlanması.",
            "prognosis": "CBT-E, gündüz öğün planlaması ve Sertralin (SSRI) tedavisi ile gece uyanıp yeme döngüsü başarıyla kırılır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Gece Uyanıp Yeme ve Akşam Hiperfajisi",
                "content": "Uykudan uyanarak yemek yeme ya da akşam yemeğinden sonra aşırı gıda tüketimi ile birlikte sabah iştahsızlığı."
            },
            {
                "code": "Kriter B",
                "title": "Tam Farkındalık ve Hatırlama",
                "content": "Uyurgezerlikten (SRED) farklı olarak kişi gece yeme atağı sırasında tamamen uyanıktır ve sabah ne yediğini net olarak hatırlar."
            }
        ]
    },
    "orthorexia_nervosa": {
        "id": "orthorexia_nervosa",
        "nameTr": "Ortoreksiya Nervoza (Sağlıklı ve Saf Beslenme Takıntısı)",
        "nameEn": "Orthorexia Nervosa",
        "clinicalDescription": {
            "overview": "Yiyeceklerin miktarından (kalori/kilo) ziyade 'saflığı, temizliği ve sağlıklılığı' üzerine patolojik düzeyde obsesif kafa yorma tablosudur. Kişi katkılı, pişmiş veya organik olmayan tüm gıdaları 'kirli/zehirli' diyerek hayatından çıkarır ve ağır beslenme eksiklikleri ile sosyal izolasyon yaşar.",
            "epidemiology": "Sağlık çalışanları, diyetisyenler, sporcular ve sosyal medya sağlıklı yaşam takipçilerinde sıklığı hızla artmaktadır.",
            "etiology": "OKB spektrumu mükemmeliyetçiliği, kontrol ihtiyacı ve bedensel saflık üzerinden ahlaki üstünlük kurma şemaları.",
            "prognosis": "CBT-E ve ERP (yasaklı besinlere kademeli maruz bırakma) ile katı gıda kuralları esnetilir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Besin Saflığına Patolojik Saplantı",
                "content": "Günün saatlerini gıda içeriği ve saflığını incelemeye harcama; 'saf olmayan' gıda tüketildiğinde yoğun suçluluk ve cezalandırıcı detoks uygulama."
            },
            {
                "code": "Kriter B",
                "title": "Kilo Kaygısı Olmadan Malnütrisyon ve İzolasyon",
                "content": "Zayıflama amacı olmaksızın besin gruplarının elenmesine bağlı vitamin/mineral eksiklikleri ve başkalarının yaptığı yemekleri yiyememe."
            }
        ]
    },
    "enuresis_nocturna": {
        "id": "enuresis_nocturna",
        "nameTr": "Enürezis Nokturna (Gece Altını Islatma)",
        "nameEn": "Enuresis (Nocturnal Only)",
        "clinicalDescription": {
            "overview": "Takvim ve gelişim yaşı en az 5 olan bir çocukta, gece uykusu sırasında istemsiz olarak yatağa idrar kaçırma tablosudur. Çocuğun hiç kuru kalmadığı tipe 'Primer (Birincil)', en az 6 ay kuru kaldıktan sonra stresle tekrar başlayan tipe 'Sekonder (İkincil)' Enürezis denir.",
            "epidemiology": "5 yaşındaki çocukların %15-20'sinde, 7 yaşındakilerin %10'unda görülür; erkek çocuklarda 2 kat daha sıktır.",
            "etiology": "Güçlü genetik geçiş (%70), gece ADH (vazopressin) salınım düşüklüğü, fonksiyonel mesane kapasitesi küçüklüğü ve derin uykudan uyanma eşiği yüksekliği.",
            "prognosis": "Her yıl %15 kendiliğinden düzelir; Enürezis Alarmı (Zil ve Ped) en kalıcı kür sağlayan altın standart tedavidir; medikal olarak Desmopressin (DDAVP) kullanılır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Yaş ve Sıklık Ölçütü (≥5 Yaş)",
                "content": "En az 5 yaşındaki çocukta, ardışık en az 3 ay boyunca haftada en az 2 kez yatağa ya da giysilere idrar kaçırma."
            },
            {
                "code": "Kriter B",
                "title": "Organik Hastalık Dışlaması",
                "content": "Durum diyabet (DM/DI), idrar yolu enfeksiyonu, spina bifida veya diüretik ilaç kullanımına bağlı değildir."
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
    "kleine_levin_syndrome": {
        "id": "kleine_levin_syndrome",
        "nameTr": "Kleine-Levin Sendromu (Uyuyan Güzel Sendromu)",
        "nameEn": "Kleine-Levin Syndrome",
        "clinicalDescription": {
            "overview": "Genellikle ergen erkeklerde görülen; yılda birkaç kez tekrarlayan ve 1-3 hafta boyunca hastanın günde 18-22 saat uyuduğu (epizodik hipersomni), uyandığında oburca ne bulursa yediği (megafaji), cinsel disinhibisyon (hiperseksüalite) ve rüyada gibi olma (derealizasyon) sergilediği nadir nöropsikiyatrik sendromdur.",
            "epidemiology": "Milyonda 1-5 görülen nadir bir tablodur; hastaların %70-80'i ergen erkeklerdir.",
            "etiology": "Viral enfeksiyon sonrası tetiklenen otoimmün/inflamatuar hipotalamik ve talamik disfonksiyon.",
            "prognosis": "Ataklar arasında hasta %100 sağlıklıdır; 8-12 yıl içinde kendiliğinden sönümlenir; atak profilaksisinde Lityum en etkili ajandır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Yineleyen Hipersomni Atakları",
                "content": "En az 2 gün ile 5 hafta arasında süren, yılda en az bir kez tekrarlayan aşırı uyku (18-20 saat/gün) dönemleri ve ataklar arası tam normallik."
            },
            {
                "code": "Kriter B",
                "title": "Eşlik Eden Megafaji, Hiperseksüalite ve Derealizasyon",
                "content": "Atak sırasında bilişsel yavaşlama, derealizasyon, kompulsif aşırı yeme (megafaji) ve hiperseksüalite/irritabilite bulguları."
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
    "sleepwalking_disorder": {
        "id": "sleepwalking_disorder",
        "nameTr": "NREM Uykusundan Uyanma (Uyurgezerlik / Somnambulizm)",
        "nameEn": "Non-REM Sleep Arousal Disorder (Sleepwalking Type)",
        "clinicalDescription": {
            "overview": "Gecenin ilk üçte birlik diliminde (NREM Evre 3 derin yavaş dalga uykusunda) yataktan kalkıp yürüme, boş ve donuk gözlerle bakma, dışarıdan uyandırılma güçlüğü ve sabah uyandığında olanları hiç hatırlamama (tam amnezi) ile seyreden NREM parasomnisidir.",
            "epidemiology": "Çocukların %10-15'inde, yetişkinlerin %1-4'ünde görülür; güçlü genetik geçiş (%80 aile öyküsü) gösterir.",
            "etiology": "Derin delta uykusundan motor merkezlerin uyanırken bilinç korteksinin uykuda kalması (uyku yoksunluğu, ateş ve stresle tetiklenir).",
            "prognosis": "Ev güvenlik önlemleri (kapı/pencere kilitleme), uyku hijyeni ve yetişkinlerde düşük doz Klonazepam ile yaralanmalar önlenir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Gecenin İlk 1/3'ünde NREM'den Kalkıp Yürüme",
                "content": "Uyku döneminin ilk üçte birinde yataktan kalkıp dolaşma; boş bakışlar, başkalarının iletişim çabalarına tepkisizlik ve güç uyandırılma."
            },
            {
                "code": "Kriter B",
                "title": "Sabah Tam Amnezi",
                "content": "Uyandıktan sonra rüya hatırlamama ve uyurgezerlik atağına dair tam bellek yitimi (amnezi)."
            }
        ]
    },
    "sleep_terrors": {
        "id": "sleep_terrors",
        "nameTr": "NREM Uykusundan Uyanma (Gece Terörü / Uyku Terörü)",
        "nameEn": "Non-REM Sleep Arousal Disorder (Sleep Terror Type)",
        "clinicalDescription": {
            "overview": "Gecenin ilk üçte birinde (NREM Evre 3 derin uykuda) panik dolu tiz bir çığlıkla yatakta doğrulma, taşikardi, hızlı soluma, terleme (otonomik fırtına), ebeveynlerin avutma çabalarına yanıtsızlık ve sabah tam amnezi ile karakterize parasomnidir (Pavor Nocturnus).",
            "epidemiology": "4-12 yaş arası çocuklarda (%3-6) sık görülür ve ergenlikte çoğunlukla kendiliğinden kaybolur.",
            "etiology": "Derin yavaş dalga (delta) uykusunda otonomik ve limbik sistemin ani deşarjı.",
            "prognosis": "Aile eğitimi (atak anında zorla uyandırmama) ve Planlı Uyandırma (Scheduled Awakenings) tekniği ile kolayca yatışır."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Panik Çığlığı ve Otonomik Deşarj",
                "content": "Gecenin ilk üçte birinde panik çığlığıyla uyanma; yoğun korku, midriyazis, taşikardi, takipne ve terleme."
            },
            {
                "code": "Kriter B",
                "title": "Avutulamama ve Sabah Amnezisi",
                "content": "Başkalarının avutma/sakinleştirme çabalarına yanıtsızlık, rüya hatırlamama ve sabah olaya dair tam amnezi."
            }
        ]
    },
    "substance_induced_sexual_dysfunction": {
        "id": "substance_induced_sexual_dysfunction",
        "nameTr": "Maddenin/İlacın Yol Açtığı Cinsel İşlev Bozukluğu (SSRI Disfonksiyonu)",
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
        "nameTr": "Maddenin Yol Açtığı Kalıcı Bellek Bozukluğu (Wernicke-Korsakoff)",
        "nameEn": "Substance-Induced Persisting Amnestic Disorder (Wernicke-Korsakoff)",
        "clinicalDescription": {
            "overview": "Kronik alkol bağımlılığı ve ağır Tiamin (B1 vitamini) eksikliği sonucu önce akut Wernicke Ensefalopatisi (Konfüzyon + Oftalmopleji/Nistagmus + Ataksi triadı), tedavi gecikirse ardından kalıcı Korsakoff Sendromu (ağır anterograd amnezi ve bellek boşluklarını hayali anılarla doldurma / konfabülasyon) gelişmesidir.",
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
    "transient_global_amnesia": {
        "id": "transient_global_amnesia",
        "nameTr": "Geçici Global Amnezi (TGA)",
        "nameEn": "Transient Global Amnesia (TGA)",
        "clinicalDescription": {
            "overview": "Genellikle 50-70 yaş arası bireylerde soğuk suya girme, ağır egzersiz veya yoğun stres sonrasında aniden başlayan; kişinin kendi adını ve kimliğini tam olarak bildiği, ancak yeni hiçbir bilgiyi kaydedemediği için 30 saniyede bir 'Ben neredeyim? Buraya nasıl geldik?' diye aynı soruyu tekrarladığı ve 24 saat içinde tam düzelen iyi huylu tablodur.",
            "epidemiology": "50 yaş üstünde yılda 100.000'de 20-30 oranında görülür.",
            "etiology": "Hipokampüsün CA1 bölgesinde geçici venöz konjesyon, migrenöz yayılan depresyon veya geçici metabolik stres.",
            "prognosis": "Mükemmeldir; 6-24 saat içinde hiçbir nörolojik sekel bırakmadan kendiliğinden %100 düzelir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Akut Anterograd Amnezi ve Tekrarlayıcı Sorular",
                "content": "Yeni bilgi kaydedememe nedeniyle sürekli aynı soruları tekrarlama; ancak KİŞİSEL KİMLİK BELLEĞİNİN (adını, soyadını bilme) TAM KORUNMASI."
            },
            {
                "code": "Kriter B",
                "title": "24 Saatte Tam Düzelme ve Fokal Defisit Yokluğu",
                "content": "Afazi, felç veya bilinç kaybının olmaması ve tablonun 24 saat içinde tamamen normale dönmesi."
            }
        ]
    },
    "malingering": {
        "id": "malingering",
        "nameTr": "Temarruz (Malingering - Maddi/Yasal Kazanç Amaçlı Sahte Hastalık)",
        "nameEn": "Malingering",
        "clinicalDescription": {
            "overview": "Kişinin hapisten/cezai sorumluluktan kurtulmak, askerlikten muaf olmak, yüklü maddi tazminat/malulen emeklilik almak veya narkotik ilaç temin etmek gibi somut bir dışsal çıkar (ikincil kazanç) amacıyla kasıtlı ve bilinçli olarak sahte hastalık belirtileri uydurmasıdır.",
            "epidemiology": "Adli psikiyatri, askeri psikiyatri ve tazminat davalarında başvuruların %10-20'sinde saptanır.",
            "etiology": "Bir ruhsal bozukluk değildir (DSM-5 V/Z kodudur); antisosyal kişilik özellikleri ve dışsal çıkar motivasyonu belirleyicidir.",
            "prognosis": "İzlenmediğini sandığı anda (kamera/tek yönlü ayna) semptomlar kaybolur; Semptom Geçerlilik Testleri (TOMM, MMPI-2 F-K) ile kanıtlanır ve adli rapor düzenlenir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Bilinçli ve Kasıtlı Sahte Semptom Üretimi",
                "content": "Fiziksel ya da ruhsal belirtilerin bilinçli olarak uydurulması veya aşırı abartılması; izlenmediğinde semptomların kesilmesi."
            },
            {
                "code": "Kriter B",
                "title": "Somut Dışsal Çıkar (İkincil Kazanç)",
                "content": "Davranışın cezaevinden kaçma, para/tazminat alma veya askerlikten kurtulma gibi açık bir dışsal ödülle güdülenmiş olması."
            }
        ]
    },
    "medication_induced_akathisia": {
        "id": "medication_induced_akathisia",
        "nameTr": "İlacın Yol Açtığı Akatizi (İçsel Yerinde Duramama)",
        "nameEn": "Medication-Induced Acute Akathisia",
        "clinicalDescription": {
            "overview": "Antipsikotik (nöroleptik) veya SSRI başlanmasından ya da doz artışından sonraki günler içinde gelişen; hastanın içinde dayanılmaz bir elektriklenme/sıkışma hissettiği (subjektif huzursuzluk) ve bir saniye bile oturamayıp sürekli volta attığı, bacaklarını salladığı (objektif yerinde duramama) tablodur.",
            "epidemiology": "Yüksek potensli antipsikotik (Haloperidol, Risperidon, Aripiprazol) kullananların %20-25'inde görülür.",
            "etiology": "Mezokortikal ve nigrostriatal dopamin D2 reseptör blokajı ve noradrenerjik hiperaktivite.",
            "prognosis": "Psikotik ajitasyon sanılıp doz artırılırsa intihara sürükleyebilir! Doz azaltımı ve 1. basamak Propranolol (Beta-bloker) veya Mirtazapin/Benzodiazepin ile hızla düzelir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Subjektif İçsel Huzursuzluk",
                "content": "Antipsikotik/SSRI sonrası gelişen, tüm gün süren dayanılmaz içsel kıvranma ve oturamama işkencesi."
            },
            {
                "code": "Kriter B",
                "title": "Objektif Motor Yerinde Duramama",
                "content": "Sürekli volta atma, ayakta dururken bir ayağından diğerine ağırlık verme (yerinde sayma) ve bacak sallama."
            }
        ]
    },
    "medication_induced_dystonia": {
        "id": "medication_induced_dystonia",
        "nameTr": "İlacın Yol Açtığı Akut Distoni (Tortikollis / Okülogirik Kriz)",
        "nameEn": "Medication-Induced Acute Dystonia",
        "clinicalDescription": {
            "overview": "Antipsikotik (özellikle IM Haloperidol) veya antiemetik (Metoklopramid) uygulamasından sonraki ilk saatler/günler içinde aniden gelişen; gözlerin tavana dikili kalması (okülogirik kriz), boynun yana/arkaya kilitlenmesi (tortikollis), çene kilitlenmesi (trismus) ve dil şişmesiyle seyreden ağrılı kas spazmıdır.",
            "epidemiology": "En yüksek risk grubu GENÇ ERKEKLERDİR; vakaların %90'ı ilacın ilk 3-4 günü içinde ortaya çıkar.",
            "etiology": "Nigrostriatal yolakta akut dopamin D2 blokajı sonucu oluşan aşırı asetilkolin (kolinerjik) baskınlığı.",
            "prognosis": "IM veya IV Biperiden (Akineton 5 mg) enjeksiyonu ile 10-15 dakika içinde dramatik ve tam olarak düzelir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Akut Kraniyal, Oküler ve Servikal Spazmlar",
                "content": "İlaç alımından sonraki ilk saatler/günlerde başlayan okülogirik kriz (göz kayması), tortikollis (boyun tutulması) veya laringospazm."
            },
            {
                "code": "Kriter B",
                "title": "Parenteral Antikolinerjik Yanıtı",
                "content": "Kas içi veya damar içi Biperiden (Akineton) / Difenhidramin uygulamasıyla dakikalar içinde tam çözülme."
            }
        ]
    },
    "antidepressant_discontinuation": {
        "id": "antidepressant_discontinuation",
        "nameTr": "Antidepresan Bırakma Sendromu (Kesilme Belirtileri)",
        "nameEn": "Antidepressant Discontinuation Syndrome",
        "clinicalDescription": {
            "overview": "En az 4-6 hafta düzenli kullanılan bir antidepresanın (özellikle yarı ömrü çok kısa olan Venlafaksin ve Paroksetin'in) aniden kesilmesi sonucunda 2-4 gün içinde başlayan; baş ve göz hareketleriyle tetiklenen 'beyinde elektrik çarpması' (Brain Zaps), baş dönmesi, bulantı, canlı kabuslar ve grip benzeri belirtilerle seyreden sendromdur.",
            "epidemiology": "Antidepresanı aniden bırakan hastaların %20-40'ında görülür; en sık Venlafaksin ve Paroksetin'de, en az Fluoksetin'de görülür.",
            "etiology": "Sinaptik aralıkta serotonin ve noradrenalin düzeyinin aniden düşmesiyle postsinaptik reseptörlerin geçici adaptasyon krizi yaşaması.",
            "prognosis": "İlacın tekrar başlanıp haftalar içinde yavaşça azaltılması (tapering) veya Fluoksetin köprülemesi ile hızla ve tamamen düzelir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "FINSH Kesilme Belirtileri ve Brain Zaps",
                "content": "İlaç kesildikten 2-4 gün sonra başlayan; Beyinde elektrik çarpması (Brain Zaps), baş dönmesi, bulantı, grip benzeri halsizlik ve canlı kabuslar."
            },
            {
                "code": "Kriter B",
                "title": "Depresyon Nüksünden Ayrım",
                "content": "Haftalar sonra başlayan depresyon nüksünden farklı olarak akut duyusal belirtilerle başlar ve tek doz ilaç alımıyla saatler içinde kaybolur."
            }
        ]
    },
    "burnout_syndrome": {
        "id": "burnout_syndrome",
        "nameTr": "Tükenmişlik Sendromu (Mesleki Yıpranma)",
        "nameEn": "Burnout Syndrome / Occupational Problem",
        "clinicalDescription": {
            "overview": "Başarıyla yönetilemeyen kronik işyeri stresinden kaynaklanan ve Christina Maslach'ın tanımladığı 3 boyutla karakterize sendromdur: 1) Duygusal Tükenme (enerji bitimi), 2) Duyarsızlaşma/Sinisizm (hizmet verilen insanlara nesne gibi soğuk ve alaycı yaklaşma), 3) Düşük Kişisel Başarı Hissi.",
            "epidemiology": "Hekimler, hemşireler, öğretmenler ve yoğun insan ilişkisi gerektiren mesleklerde %30-50 oranında görülür.",
            "etiology": "Aşırı iş yükü, nöbetler, kontrol eksikliği, ödül/takdir yetersizliği ve kurumsal adaletsizlik.",
            "prognosis": "Majör depresyondan farklı olarak belirtiler yalnızca iş bağlamıyla sınırlıdır (tatilde zevk alabilir); sınır koyma, çalışma koşullarının düzenlenmesi ve BDT ile düzelir."
        },
        "criteriaList": [
            {
                "code": "Kriter A",
                "title": "Maslach Tükenmişlik Triadı",
                "content": "1) Duygusal ve fiziksel enerji tükenmesi, 2) İşe ve hizmet verilen kişilere karşı zihinsel mesafe/sinisizm (duyarsızlaşma), 3) Mesleki yeterlilik algısında düşme."
            },
            {
                "code": "Kriter B",
                "title": "Yalnızca İş Bağlamıyla Sınırlı Olma",
                "content": "Yaşamın tüm alanlarını çökerten Majör Depresyondan farklı olarak, kişinin iş dışındaki tatil ve hobi alanlarında zevk alma kapasitesinin korunmuş olması."
            }
        ]
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DSM5_MANUAL };
}
