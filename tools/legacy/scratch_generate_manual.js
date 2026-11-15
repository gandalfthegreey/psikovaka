const fs = require('fs');
const path = require('path');

const DSM5_MANUAL = {
    // 1. MDD
    mdd: {
        id: "mdd",
        nameTr: "Majör Depresif Bozukluk",
        nameEn: "Major Depressive Disorder",
        clinicalDescription: {
            overview: "Majör Depresif Bozukluk (MDB), kişinin duygudurumunu, bilişsel süreçlerini ve vejetatif/bedensel işlevlerini derinden etkileyen, yineleyici ataklarla seyredebilen ağır bir psikiyatrik tablodur. Kişi kendisini derin bir keder, çaresizlik ve boşluk içinde hissederken yaşamdan keyif alma yetisini (anhedoni) tamamen kaybeder.",
            epidemiology: "Yaşam boyu yaygınlığı yaklaşık %15-20'dir. Kadınlarda erkeklere oranla 1.5 - 2 kat daha sık görülür. Her yaşta başlayabilir ancak ortalama başlangıç yaşı 20'li yaşların sonları ve 30'lu yaşların başıdır.",
            etiology: "Biyolojik faktörler (serotonin, noradrenalin, dopaminerjik disfonksiyon; HPA ekseni aşırı duyarlılığı), genetik yatkınlık (%40 kalıtılabilirlik), Aaron Beck'in bilişsel üçlüsü (kendisi, dünya ve gelecek hakkında olumsuz otomatik şemalar) ve öğrenilmiş çaresizlik modeli etiyolojide temel rol oynar.",
            prognosis: "Tedavi edilmeyen bir epizod ortalama 6-9 ay sürer. Uygun farmakoterapi ve psikoterapi (BDT) ile %70-80 oranında remisyon sağlanır. Ancak bir atak geçiren bireyde ikinci atak riski %50, iki atak geçiren bireyde üçüncü atak riski %70-80'dir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Temel Belirti Ölçütleri (En az 5/9 belirti, en az biri 1 veya 2 olmalı)",
                content: "İki haftalık bir dönem boyunca aşağıdaki belirtilerden en az beşinin bulunması ve önceki işlevsellik düzeyinde bir değişimin olması (en az biri çökkün duygudurum ya da ilgi/zevk kaybı olmalıdır):",
                items: [
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
                code: "Kriter B",
                title: "Klinik Sıkıntı ve İşlevsellik Kaybı",
                content: "Belirtiler klinik açıdan belirgin bir sıkıntıya ya da toplumsal, işle ilgili veya diğer önemli alanlarda işlevsellikte düşmeye yol açar."
            },
            {
                code: "Kriter C",
                title: "Fizyolojik/Madde Dışlaması",
                content: "Atak bir maddenin (kötüye kullanılan ilaç/uyuşturucu) ya da başka bir genel sağlık durumunun (örn. hipotiroidi) fizyolojik etkilerine bağlanamaz."
            },
            {
                code: "Kriter D",
                title: "Psikotik Bozukluk Dışlaması",
                content: "Majör depresif atağın ortaya çıkışı şizoaffektif bozukluk, şizofreni, şizofreniform bozukluk veya diğer psikotik bozukluklarla daha iyi açıklanamaz."
            },
            {
                code: "Kriter E",
                title: "Mani/Hipomani Dışlaması",
                content: "Kişi hiçbir zaman bir Manik Epizod ya da Hipomanik Epizod geçirmemiştir (Geçirmişse tanı Bipolar Bozukluk olur)."
            }
        ]
    },

    // 2. Bipolar I
    bipolar_1: {
        id: "bipolar_1",
        nameTr: "Bipolar I Bozukluğu",
        nameEn: "Bipolar I Disorder",
        clinicalDescription: {
            overview: "Bipolar I Bozukluğu, en az bir kez tam bir 'Manik Epizod' yaşanmasıyla tanımlanan, aşırı kabarmış duygudurum, enerji patlaması, grandiyözite ve riskli davranışlarla seyreden kronik bir duygudurum bozukluğudur. Çoğu hastada manik atakların yanı sıra majör depresif ataklar da eşlik eder.",
            epidemiology: "Yaşam boyu yaygınlığı yaklaşık %1'dir. Kadın ve erkeklerde eşit sıklıkta görülür. Ortalama başlangıç yaşı 18-20'dir.",
            etiology: "Psikiyatrideki en yüksek genetik geçişe sahip bozukluklardan biridir (%70-85 kalıtılabilirlik). Dopaminerjik hiperaktivite, sirkadiyen ritim disfonksiyonu ve hücresel sinyal iletim anomalileri rol oynar.",
            prognosis: "Epizodik ve tekrarlayıcıdır. Yaşam boyu lityum veya duygudurum dengeleyici profilaksisi nüksleri önlemede hayati öneme sahiptir. İntihar riski genel popülasyondan 15 kat yüksektir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Manik Epizod Süre ve Duygudurum Ölçütü",
                content: "En az 1 hafta boyunca (hastaneye yatırılmayı gerektiriyorsa herhangi bir süre) hemen her gün, günün büyük bölümünde kabarmış, taşkın ya da kolay kızan (irritabl) olağandışı ve sürekli bir duygudurum ile amaca yönelik etkinlikte/enerjide anormal ve sürekli bir artış döneminin olması."
            },
            {
                code: "Kriter B",
                title: "Manik Belirtiler (En az 3 belirti, duygudurum sadece irritabl ise en az 4)",
                content: "Duygudurum bozukluğu döneminde aşağıdaki belirtilerden en az üçü (duygudurum yalnızca irritabl ise en az dördü) belirgin olarak bulunur:",
                items: [
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
                code: "Kriter C",
                title: "Ağır İşlev Bozukluğu veya Yatış Gereksinimi",
                content: "Duygudurum bozukluğu toplumsal ya da mesleki işlevsellikte belirgin bir bozulmaya yol açacak, kendine ya da başkalarına zarar vermesini önlemek için hastaneye yatırılmayı gerektirecek denli ağırdır ya da psikotik özellikler (sanrı/varsanı) gösterir."
            },
            {
                code: "Kriter D",
                title: "Madde/Sağlık Durumu Dışlaması",
                content: "Epizod bir maddenin (madde kötüye kullanımı, ilaç) ya da başka bir genel sağlık durumunun doğrudan fizyolojik etkilerine bağlanamaz."
            }
        ]
    },

    // 3. Bipolar II
    bipolar_2: {
        id: "bipolar_2",
        nameTr: "Bipolar II Bozukluğu",
        nameEn: "Bipolar II Disorder",
        clinicalDescription: {
            overview: "Bipolar II Bozukluğu, bireyin yaşamı boyunca en az bir kez 'Hipomanik Epizod' ve en az bir kez 'Majör Depresif Epizod' geçirmesiyle tanımlanır. Bipolar I'den farkı, HİÇBİR ZAMAN tam bir Manik Epizod yaşanmamış olmasıdır.",
            epidemiology: "Yaygınlığı yaklaşık %0.5 - 1.5 civarındadır. Kadınlarda erkeklere kıyasla biraz daha sık bildirilmektedir.",
            etiology: "Güçlü genetik altyapı ve duygudurum düzenleme devrelerindeki dengesizlikler söz konusudur.",
            prognosis: "Hastalar zamanlarının çoğunu depresif fazda geçirirler; bu nedenle intihar riski ve yeti yitimi en az Bipolar I kadar ciddidir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Hipomanik Epizod Ölçütü (En az 4 gün)",
                content: "En az 4 gün boyunca süren, kabarmış, taşkın ya da irritabl duygudurum ve artmış enerji (işlevselliği tamamen çökertmeyen ve hastaneye yatış gerektirmeyen hafif mani hali)."
            },
            {
                code: "Kriter B",
                title: "Majör Depresif Epizod Ölçütü (En az 2 hafta)",
                content: "En az 2 hafta süren, en az 5 belirti içeren tam bir Majör Depresif Epizod yaşanmış olması şarttır."
            },
            {
                code: "Kriter C",
                title: "Mani Dışlaması",
                content: "Hiçbir zaman tam bir Manik Epizod geçirilmemiştir (Geçirilirse tanı Bipolar I olur)."
            },
            {
                code: "Kriter D",
                title: "İşlevsellik ve Sıkıntı",
                content: "Depresif belirtiler ya da hipomani-depresyon dalgalanmaları belirgin klinik sıkıntıya yol açar."
            }
        ]
    },

    // 4. Distimi (Kalıcı Depresif Bozukluk)
    dysthymia: {
        id: "dysthymia",
        nameTr: "Kalıcı Depresif Bozukluk (Distimi)",
        nameEn: "Persistent Depressive Disorder (Dysthymia)",
        clinicalDescription: {
            overview: "Distimi, en az 2 yıl boyunca hemen her gün süren, majör depresyondan daha hafif şiddette ancak süreğen ve kronik bir çökkünlük tablosudur. Birey durumu 'Ben kendimi bildim bileli mutsuzum' şeklinde tanımlar.",
            epidemiology: "Yaşam boyu yaygınlığı yaklaşık %3-5'tir. Sinsi başlangıçlıdır ve genellikle erken erişkinlikte veya çocuklukta başlar.",
            etiology: "Kronik kişilerarası stresörler, erken çocukluk ihmalleri ve nörotransmitter disregülasyonu etkilidir.",
            prognosis: "Kronik seyreder; hastaların yaklaşık %75'inde üzerine tam bir majör depresyon atağı eklenebilir (Çift Depresyon / Double Depression)."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Süre Ölçütü (En az 2 yıl)",
                content: "En az 2 yıl boyunca (çocuk ve ergenlerde en az 1 yıl), günün büyük bölümünde, hemen her gün çökkün duygudurumun bulunması."
            },
            {
                code: "Kriter B",
                title: "Belirti Listesi (En az 2/6 belirti)",
                content: "Çökkün durumdayken aşağıdaki belirtilerden en az ikisinin bulunması:",
                items: [
                    "B1. İştahsızlık ya da aşırı yeme.",
                    "B2. Uykusuzluk (insomni) ya da aşırı uyuma (hipersomni).",
                    "B3. Düşük enerji ya da yorgunluk.",
                    "B4. Düşük benlik saygısı.",
                    "B5. Odaklanma güçlüğü ya da karar vermede zorlanma.",
                    "B6. Umutsuzluk duyguları."
                ]
            },
            {
                code: "Kriter C",
                title: "Belirtisiz Aralık Kuralı",
                content: "Bu 2 yıllık süre içinde kişi bir seferde 2 aydan daha uzun süre Kriter A ve B belirtilerinden uzak kalmamıştır."
            }
        ]
    },

    // 5. Siklotimik Bozukluk
    cyclothymia: {
        id: "cyclothymia",
        nameTr: "Siklotimik Bozukluk",
        nameEn: "Cyclothymic Disorder",
        clinicalDescription: {
            overview: "En az 2 yıl boyunca süren, tam bir hipomani ölçütünü doldurmayan hafif hipomanik dönemler ile tam bir majör depresyon ölçütünü doldurmayan hafif depresif dalgalanmaların kronik birlikteliğidir.",
            epidemiology: "Yaygınlığı yaklaşık %0.4 - 1'dir. Başlangıç genellikle ergenlik veya erken yetişkinliktedir.",
            etiology: "Bipolar bozukluk spektrumunda yer alır; güçlü genetik zemin mevcuttur.",
            prognosis: "Kronik dalgalı seyreder; yaklaşık üçte biri ilerleyen yıllarda Bipolar I veya II'ye evrilir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "2 Yıllık Dalgalanma Ölçütü",
                content: "En az 2 yıl boyunca (çocuk/ergende 1 yıl), hipomani kriterlerini tam doldurmayan hipomanik belirti dönemleri ile majör depresyonu tam doldurmayan depresif belirti dönemlerinin çok sayıda bulunması."
            },
            {
                code: "Kriter B",
                title: "Belirtisiz Süre Kuralı",
                content: "Bu 2 yıllık süre boyunca belirtisiz geçen dönemler hiçbir zaman 2 aydan uzun sürmemiştir."
            },
            {
                code: "Kriter C",
                title: "Majör Atak Dışlaması",
                content: "Majör depresif, manik ya da hipomanik bir epizodun ölçütleri hiçbir zaman karşılanmamıştır."
            }
        ]
    },

    // 6. PMDD
    pmdd: {
        id: "pmdd",
        nameTr: "Premenstrüel Disforik Bozukluk",
        nameEn: "Premenstrual Dysphoric Disorder",
        clinicalDescription: {
            overview: "Menstrüel döngünün luteal fazında (kanamadan önceki hafta) başlayan, belirgin öfke, disfori, anksiyete ve labil duygulanımla seyreden, kanamanın başlamasından birkaç gün sonra tamamen düzelen ağır bir duygudurum tablosudur.",
            epidemiology: "Doğurganlık çağındaki kadınların yaklaşık %2-6'sında görülür.",
            etiology: "Östrojen ve progesteron dalgalanmalarına karşı merkezi serotoninerjik sistemin ve GABA-A reseptörlerinin anormal nörobiyolojik aşırı duyarlılığı.",
            prognosis: "Döngüsel olarak tekrarlar; menopozla birlikte sona erer. Luteal fazda düşük doz SSRI tedavisine son derece dramatik yanıt verir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Döngüsel Zamanlama Ölçütü",
                content: "Çoğu menstrüel döngüde, kanamadan önceki son haftada en az 5 belirti başlamalı, kanama başladıktan sonraki birkaç gün içinde düzelmeli ve kanamayı izleyen haftada neredeyse yok olmalıdır."
            },
            {
                code: "Kriter B",
                title: "Duygusal Belirtiler (En az 1 tane)",
                content: "B1. Belirgin duygulanımsal değişkenlik (ani ağlama nöbetleri, aşırı alınganlık), B2. Belirgin irritabilite/öfke, B3. Belirgin çökkün duygudurum/umutsuzluk, B4. Belirgin anksiyete/gerginlik."
            },
            {
                code: "Kriter C",
                title: "Davranışsal/Bedensel Belirtiler",
                content: "İlgi azalması, odaklanma güçlüğü, uyuşukluk/enerji kaybı, iştah değişiklikleri, uykusuzluk/aşırı uyuma, göğüslerde hassasiyet veya şişkinlik hissi."
            }
        ]
    },

    // 7. DMDD
    dmdd: {
        id: "dmdd",
        nameTr: "Yıkıcı Duygudurumu Düzenleyememe Bozukluğu",
        nameEn: "Disruptive Mood Dysregulation Disorder",
        clinicalDescription: {
            overview: "Çocuklarda haftada ortalama 3 veya daha fazla kez yineleyen ağır, orantısız öfke patlamaları ve bu patlamalar arasında hemen her gün süregiden kronik irritabl duygudurumla karakterize tablodur. Pediyatrik bipolar aşırı tanısını engellemek için DSM-5'e eklenmiştir.",
            epidemiology: "Okul çağı çocuklarında %2-5 civarındadır. Erkek çocuklarda daha sıktır. Tanı 6-18 yaş arasında konur; başlangıç 10 yaşından önce olmalıdır.",
            etiology: "Duygu regülasyonunda prefrontal korteks-amigdala devresindeki defisitler ve düşük engellenme eşiği.",
            prognosis: "Ergenlik ve yetişkinlikte Bipolar'dan ziyade Majör Depresyon ve Anksiyete Bozukluklarına dönüşme riski çok yüksektir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Öfke Patlamaları Şiddeti",
                content: "Durumla ya da kışkırtmayla tamamen orantısız, sözel ya da davranışsal (insanlara/eşyalara saldırganlık) yineleyen ağır öfke patlamaları."
            },
            {
                code: "Kriter B & C",
                title: "Sıklık ve Gelişimsel Uyumsuzluk",
                content: "Öfke patlamaları haftada ortalama 3 ya da daha çok kez yineler ve çocuğun gelişimsel düzeyiyle bağdaşmaz."
            },
            {
                code: "Kriter D",
                title: "Patlamalar Arası Sürekli İrritabilite",
                content: "Öfke patlamaları arasındaki duygudurum hemen her gün, günün büyük bölümünde sürekli olarak öfkeli, kolay kızan ya da huysuzdur ve başkalarınca gözlenebilir."
            },
            {
                code: "Kriter E & F",
                title: "Süre ve Ortam Kriteri",
                content: "Belirtiler en az 12 aydır sürmektedir ve en az 2 ortamda (ev, okul, akran ortamı) belirgindir. İlk tanı 6 yaşından önce ya da 18 yaşından sonra konamaz (başlangıç < 10 yaş)."
            }
        ]
    },

    // 8. Panik Bozukluk
    panic_disorder: {
        id: "panic_disorder",
        nameTr: "Panik Bozukluk",
        nameEn: "Panic Disorder",
        clinicalDescription: {
            overview: "Panik Bozukluk, hiçbir tetikleyici olmadan aniden (spontane) başlayan, dakikalar içinde zirveye ulaşan şiddetli dehşet, ölüm veya delirme korkusuyla giden yineleyen panik ataklar ve bu atakların ardından en az 1 ay süren 'yeni bir atak geçirme beklenti anksiyetesi' ile tanımlanır.",
            epidemiology: "Yaşam boyu yaygınlığı %2-3'tür. Kadınlarda erkeklerden 2 kat daha sıktır. Genellikle 20-24 yaşlarında başlar.",
            etiology: "Locus coeruleus ve amigdala aşırı uyarılabilirliği; bedensel duyumların (çarpıntı, baş dönmesi) felaketleştirici bilişsel yorumlanması (Clark'ın Bilişsel Modeli).",
            prognosis: "BDT (İnteroseptif Maruz Bırakma) ve SSRI tedavisine çok iyi yanıt verir. Tedavi edilmezse agorafobiye ve acil servis bağımlılığına yol açar."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Yineleyen Beklenmedik Panik Ataklar",
                content: "Dakikalar içinde tepe noktasına ulaşan, aniden yoğun bir korku ya da yoğun bir içsel sıkıntının bastırdığı yineleyen beklenmedik panik ataklar (Aşağıdaki 13 belirtiden en az 4'ü):",
                items: [
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
                code: "Kriter B",
                title: "En az 1 Ay Süren Beklenti Anksiyetesi veya Kaçınma",
                content: "Ataklardan en az birini, 1 ay (ya da daha uzun) süreyle aşağıdakilerden biri ya da her ikisi izler:",
                items: [
                    "B1. Başka panik atakların olacağına ya da bunların sonuçlarına (kalp krizi geçirme, delirme) ilişkin sürekli bir kaygı ya da kuruntu duyma.",
                    "B2. Ataklarla ilişkili olarak uyumsuz davranış değişiklikleri gösterme (örn. egzersizden kaçınma, tanıdık olmayan ortamlardan kaçınma)."
                ]
            },
            {
                code: "Kriter C & D",
                title: "Dışlama Ölçütleri",
                content: "Belirtiler bir maddenin (kafein, amfetamin) ya da tıbbi durumun (hipertiroidi, feokromositoma) doğrudan etkilerine bağlanamaz ve başka bir ruhsal bozuklukla açıklanamaz."
            }
        ]
    },

    // 9. Agorafobi
    agoraphobia: {
        id: "agoraphobia",
        nameTr: "Agorafobi",
        nameEn: "Agoraphobia",
        clinicalDescription: {
            overview: "Agorafobi, panik benzeri ya da utanç verici belirtiler geliştiğinde oradan kaçmanın güç olabileceği ya da yardım sağlanamayabileceği düşüncesiyle toplu taşıma, açık alanlar, kapalı mekanlar, sıralar veya ev dışında tek başına kalma durumlarına karşı duyulan belirgin ve orantısız korku/kaçınmadır.",
            epidemiology: "Yıllık yaygınlığı yaklaşık %1.7'dir. Kadınlarda erkeklere göre 2 kat fazladır. Erken erişkinlikte zirve yapar.",
            etiology: "Panik ataklara ikincil gelişebileceği gibi bağımsız olarak da başlayabilir. Güvenli alan inancı ve felaketleştirici kaçınma şemaları temeldir.",
            prognosis: "İn-vivo (canlı) kademeli maruz bırakma terapisiyle başarıyla tedavi edilir; tedavi edilmezse kişiyi tamamen eve hapsedebilir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "5 Alandan En Az 2'sinde Belirgin Korku",
                content: "Aşağıdaki 5 durumdan ikisi (ya da daha çoğu) hakkında belirgin korku ya da kaygı duyma:",
                items: [
                    "1. Toplu taşıma araçlarını kullanma (otobüs, tren, vapur, uçak).",
                    "2. Açık alanlarda bulunma (otoparklar, pazar yerleri, köprüler).",
                    "3. Kapalı yerlerde bulunma (mağazalar, sinemalar, tiyatrolar).",
                    "4. Sırada bekleme ya da kalabalık bir ortamda bulunma.",
                    "5. Evin dışında tek başına olma."
                ]
            },
            {
                code: "Kriter B",
                title: "Kaçış Güçlüğü Bilişi",
                content: "Birey panik benzeri belirtiler ya da yetersizleştiren/utanç verici belirtiler (örn. düşme korkusu, altına kaçırma korkusu) geliştiğinde kaçmanın güç olabileceği ya da yardım alamayacağı düşüncesiyle bu durumlardan korkar ya da kaçınır."
            },
            {
                code: "Kriter C & D & E",
                title: "Kaçınma, Orantısızlık ve Süre (≥ 6 ay)",
                content: "Agorafobi durumları neredeyse her zaman korku/kaygı doğurur; bu durumlardan aktif kaçınılır ya da bir refakatçi eşliğinde katlanılır. Korku gerçek tehlikeyle orantısızdır ve en az 6 ay sürer."
            }
        ]
    },

    // 10. Yaygın Anksiyete Bozukluğu (GAD)
    gad: {
        id: "gad",
        nameTr: "Yaygın Anksiyete Bozukluğu",
        nameEn: "Generalized Anxiety Disorder",
        clinicalDescription: {
            overview: "Günün büyük bölümünde, en az 6 ay boyunca yaşamın hemen hemen tüm alanlarıyla ilgili (sağlık, para, aile, iş) aşırı, kontrol edilemez ve orantısız bir evham (serbest yüzen kaygı) ile birlikte kas gerginliği ve otonomik uyarılmışlıkla seyreden bozukluktur.",
            epidemiology: "Yaşam boyu yaygınlığı %5-9 arasındadır. Kadınlarda 2 kat daha sıktır. Yaş ilerledikçe sıklığı artar.",
            etiology: "Belirsizliğe tahammülsüzlük (Intolerance of Uncertainty), endişeyi bir başa çıkma stratejisi olarak görme (Pozitif/Negatif Metabilişsel İnançlar - Wells Modeli).",
            prognosis: "Dalgalı ve kronik bir gidişat gösterir. BDT ve SNRI/SSRI tedavileri etkilidir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Aşırı Kaygı ve Süre (≥ 6 ay)",
                content: "En az 6 aylık bir sürenin çoğu gününde, bir dizi etkinlik ya da olay hakkında (iş, okul, sağlık vb.) aşırı bir kaygı ve kuruntu (endişeli beklenti) duyma."
            },
            {
                code: "Kriter B",
                title: "Denetim Güçlüğü",
                content: "Birey bu kaygı ve kuruntuyu denetim altına almakta güçlük çeker."
            },
            {
                code: "Kriter C",
                title: "Fiziksel Belirtiler (En az 3/6 belirti)",
                content: "Aşağıdaki altı belirtiden en az üçü (çocuklarda yalnızca bir belirti) kaygıya eşlik eder:",
                items: [
                    "1. Huzursuzluk, aşırı heyecan duyma ya da diken üstünde/tetikte olma.",
                    "2. Kolay yorulma.",
                    "3. Odaklanmada güçlük çekme ya da zihnin boşalması hissi.",
                    "4. Kolay kızma / irritabilite.",
                    "5. Kas gerginliği (özellikle boyun, omuz ve sırtta kronik ağrılar).",
                    "6. Uyku bozukluğu (uykuya dalmakta/sürdürmekte güçlük ya da dinlendirmeyen uyku)."
                ]
            },
            {
                code: "Kriter D & E",
                title: "İşlevsellik ve Dışlama",
                content: "Belirtiler belirgin sıkıntı ve işlevsellik kaybı yaratır; madde kullanımına ya da hipertiroidi gibi tıbbi durumlara bağlanamaz."
            }
        ]
    },

    // 11. Sosyal Anksiyete Bozukluğu
    social_anxiety: {
        id: "social_anxiety",
        nameTr: "Sosyal Anksiyete Bozukluğu (Sosyal Fobi)",
        nameEn: "Social Anxiety Disorder (Social Phobia)",
        clinicalDescription: {
            overview: "Kişinin başkalarınca değerlendirilebileceği toplumsal ortamlarda (konuşma yapma, yemek yeme, tanımadığı biriyle sohbet etme) küçük düşeceği, rezil olacağı ya da kaygı belirtilerini dışarıya belli edeceği korkusuyla yoğun anksiyete yaşaması ve bu ortamlardan kaçınmasıdır.",
            epidemiology: "Yaşam boyu yaygınlığı %7-12 ile en sık görülen anksiyete bozukluklarından biridir. Tipik olarak erken ergenlikte (13 yaş) başlar.",
            etiology: "Aşırı eleştirel ebeveyn tutumu, akran zorbalığı, dikkatin içsel bedensel sinyallere ve olumsuz benlik imgelerine odaklanması (Clark & Wells Bilişsel Modeli).",
            prognosis: "Tedavi edilmediğinde ömür boyu sürer; kariyer ve sosyal izolasyona yol açar. BDT (Video geribildirimi ve maruz bırakma) altın standarttır."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Toplumsal Durumlarda Korku",
                content: "Bireyin başkalarınca değerlendirilebilecek olduğu bir ya da birden fazla toplumsal durumda (toplumsal etkileşimler, gözlenme durumları, başkalarının önünde eylemde bulunma) belirgin korku ya da kaygı duyması."
            },
            {
                code: "Kriter B",
                title: "Olumsuz Değerlendirilme Korkusu",
                content: "Birey olumsuz değerlendirilecek biçimde davranmaktan (küçük düşeceği, rezil olacağı, reddedileceği ya da başkalarını rahatsız edeceği biçimde kaygı belirtileri göstereceğinden) korkar."
            },
            {
                code: "Kriter C & D & E",
                title: "Kaçınma, Orantısızlık ve Süre (≥ 6 ay)",
                content: "Toplumsal durumlar neredeyse her zaman korku/kaygı doğurur ve bunlardan aktif kaçınılır. Korku durumsal tehlikeyle orantısızdır ve en az 6 ay sürer."
            },
            {
                code: "Belirleyici",
                title: "Yalnızca Performans Belirleyicisi",
                content: "Korku yalnızca topluluk önünde konuşma ya da sergileme/icra etme durumlarıyla sınırlıysa bu belirleyici eklenir."
            }
        ]
    },

    // 12. Özgül Fobi
    specific_phobia: {
        id: "specific_phobia",
        nameTr: "Özgül Fobi",
        nameEn: "Specific Phobia",
        clinicalDescription: {
            overview: "Belirli bir nesneye ya da duruma (hayvanlar, yükseklik, fırtına, uçak, kan-enjeksiyon-yara) karşı duyulan, gerçek riskle tamamen orantısız, aşırı ve sürekli korku ve kaçınma reaksiyonudur.",
            epidemiology: "Yaygınlığı %7-9 civarındadır. Çocukluk çağında başlar.",
            etiology: "Klasik koşullanma, evrimsel hazırlıklılık (Preparedness teorisi) ve model alma.",
            prognosis: "Kademeli in-vivo (canlı) maruz bırakma ile seanslar içinde %90'ın üzerinde tam kür sağlanır."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Özgül Nesne/Durum Korkusu",
                content: "Özgül bir nesne ya da durumla ilgili olarak belirgin korku ya da kaygı duyma (uçma, yükseklikler, hayvanlar, iğne yaptırma, kan görme)."
            },
            {
                code: "Kriter B & C & D",
                title: "Kaçınma, Orantısızlık ve Süre (≥ 6 ay)",
                content: "Fobik nesne neredeyse her zaman ani anksiyete doğurur ve bundan aktif olarak kaçınılır. Korku nesnenin yarattığı gerçek tehlikeyle orantısızdır ve en az 6 ay sürer."
            },
            {
                code: "Alt Tipler",
                title: "DSM-5 Belirleyicileri",
                content: "1. Hayvan (köpek, yılan, böcek), 2. Doğal Çevre (fırtına, su, yükseklik), 3. Kan-Enjeksiyon-Yara (Vazovagal senkopla giden), 4. Durumsal (uçak, asansör, kapalı yerler), 5. Diğer (boğulma, kusma)."
            }
        ]
    },

    // 13. Ayrılma Kaygısı Bozukluğu
    separation_anxiety: {
        id: "separation_anxiety",
        nameTr: "Ayrılma Kaygısı Bozukluğu",
        nameEn: "Separation Anxiety Disorder",
        clinicalDescription: {
            overview: "Bireyin bağlandığı kişilerden (ebeveyn, eş) ayrılmayla ilgili olarak gelişimsel düzeye uygunsuz ve aşırı korku/kaygı duymasıdır. DSM-5 ile yetişkinlikte de tanı alabileceği kabul edilmiştir.",
            epidemiology: "Çocuklarda %4, yetişkinlerde %1-2 civarındadır.",
            etiology: "Kaygılı-kararsız bağlanma stili, aşırı korumacı ebeveynlik ve kayıp travmaları.",
            prognosis: "BDT ve kademeli ayrılık maruziyeti ile başarılı tedavi edilir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Ayrılmayla İlgili Aşırı Korku (En az 3/8 belirti)",
                content: "Bağlandığı kişilerden ayrılmayla ilgili en az üç belirtinin bulunması:",
                items: [
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
                code: "Kriter B",
                title: "Süre Kriteri",
                content: "Korku, kaygı ya da kaçınma çocuk ve ergenlerde en az 4 hafta, erişkinlerde ise en az 6 ay sürer."
            }
        ]
    },

    // 14. Seçici Konuşmazlık
    selective_mutism: {
        id: "selective_mutism",
        nameTr: "Seçici Konuşmazlık (Selektif Mutizm)",
        nameEn: "Selective Mutism",
        clinicalDescription: {
            overview: "Çocuğun evinde ve ailesiyle akıcı ve rahat bir şekilde konuşmasına karşın, konuşmasının beklendiği özgül toplumsal durumlarda (özellikle okulda) sürekli olarak konuşamaması tablosudur.",
            epidemiology: "Nadir görülür (%0.03 - 1). Genellikle 5 yaşından önce başlar ancak okula başlandığında fark edilir.",
            etiology: "Aşırı sosyal kaygı ve çekingen mizaç ile konuşma anındaki yoğun donakalma tepkisi.",
            prognosis: "Uyaran kaydırma (stimulus fading) ve kademeli davranışsal pekiştirme ile başarıyla tedavi edilir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Durumsal Konuşamama Ölçütü",
                content: "Başka durumlarda konuşuyor olmasına karşın, konuşmasının beklendiği özgül toplumsal durumlarda (örn. okulda) sürekli bir konuşamama hali."
            },
            {
                code: "Kriter B & C",
                title: "İşlevsellik ve Süre",
                content: "Eğitimsel ya da toplumsal iletişimi bozar. Süre en az 1 aydır (okulun ilk ayı ile sınırlı değildir)."
            },
            {
                code: "Kriter D & E",
                title: "Dil Yetersizliği ve Bozukluk Dışlaması",
                content: "Konuşamama durumu toplumsal durumda konuşulan dili bilmeme ya da rahat konuşamama ile ilişkili değildir ve Otizm ya da Psikoz ile açıklanamaz."
            }
        ]
    },

    // 15. OKB
    ocd: {
        id: "ocd",
        nameTr: "Obsesif-Kompulsif Bozukluk (OKB)",
        nameEn: "Obsessive-Compulsive Disorder (OCD)",
        clinicalDescription: {
            overview: "İstemsizce zihne gelen, yoğun anksiyete ve sıkıntı yaratan ısrarcı düşünceler/dürtüler (obsesyonlar) ve kişinin bu kaygıyı nötralize etmek için sergilediği katı, yineleyici davranışlar ya da zihinsel eylemlerle (kompulsiyonlar) seyreden nöropsikiyatrik bozukluktur.",
            epidemiology: "Yaşam boyu yaygınlığı %2-3'tür. Erkeklerde çocuklukta, kadınlarda 20'li yaşlarda daha sık başlar.",
            etiology: "Kortiko-striato-talamo-kortikal (CSTC) döngü hiperaktivitesi, aşırı sorumluluk şemaları ve düşünce-eylem kaynaşması (Thought-Action Fusion).",
            prognosis: "Tepki Önleme ile Maruz Bırakma (ERP) ve yüksek doz SSRI birinci basamaktır. Tedavi edilmezse kronikleşir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Obsesyonlar ve/veya Kompulsiyonlar",
                content: "Obsesyonların, kompulsiyonların ya da her ikisinin varlığı:",
                items: [
                    "Obsesyonlar: 1. Yineleyen, istemsizce gelen, belirgin kaygı ya da sıkıntıya neden olan düşünce, dürtü ya da imgeler. 2. Birey bunları görmezden gelmeye, bastırmaya ya da başka bir düşünce/eylemle (kompulsiyonla) etkisizleştirmeye çalışır.",
                    "Kompulsiyonlar: 1. Bireyin bir obsesyona tepki olarak ya da katı kurallara göre yapmaktan kendini alıkoyamadığı yineleyici davranışlar (el yıkama, kontrol etme, sıralama) ya da zihinsel eylemler (dua etme, sayı sayma). 2. Bu davranışlar kaygıyı azaltmak amacıyla yapılır ancak önlenmek istenen durumla gerçekçi bir bağıntısı yoktur ya da aşırıdır."
                ]
            },
            {
                code: "Kriter B",
                title: "Zaman Alma Ölçütü",
                content: "Obsesyonlar ya da kompulsiyonlar zaman alır (günde 1 saatten çok) ya da klinik açıdan belirgin bir sıkıntıya/işlevsellik kaybına yol açar."
            },
            {
                code: "İçgörü Belirleyicisi",
                title: "DSM-5 İçgörü Düzeyleri",
                content: "1. İçgörüsü iyi ya da yeterli (inançların doğru olmadığının farkında), 2. İçgörüsü az (inançların muhtemelen doğru olduğuna inanır), 3. İçgörüsü yok / Sanrısal inançlar (inançların kesin doğru olduğuna inanır)."
            }
        ]
    },

    // 16. BDD
    bdd: {
        id: "bdd",
        nameTr: "Beden Algısı Bozukluğu (Beden Dismorfik Bozukluğu)",
        nameEn: "Body Dysmorphic Disorder",
        clinicalDescription: {
            overview: "Kişinin dış görünümünde başkaları tarafından görülmeyen ya da çok hafif olan hayali/milimetrik kusurlarla (burun, cilt, saç, asimetri) aşırı zihinsel uğraş içinde olması ve bu kusuru kamufle etmek için günde saatlerce ayna kontrolü veya cerrahi ameliyat arayışına girmesidir.",
            epidemiology: "Genel popülasyonda %2, estetik cerrahi ve dermatoloji kliniklerine başvuranlarda %10-15 civarındadır.",
            etiology: "Görsel bilgiyi detay odaklı işleme anomalileri ve aşırı estetik mükemmeliyetçilik.",
            prognosis: "Estetik operasyonlar BDD'yi düzeltmez, aksine kötüleştirir. BDT ve yüksek doz SSRI etkilidir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Görünüm Kusurlarıyla Uğraş",
                content: "Dış görünümünde başkalarınca gözle görülmeyen ya da önemsenmeyecek bir ya da birden fazla kusur ya da özür algılama üzerine aşırı kafa yorma."
            },
            {
                code: "Kriter B",
                title: "Yineleyici Davranışlar / Zihinsel Eylemler",
                content: "Görünüm kaygılarına tepki olarak yineleyen davranışlarda (ayna kontrolü, aşırı taranma, derisini yolma, güvence arama) ya da zihinsel eylemlerde (kendi görünümünü başkalarıyla karşılaştırma) bulunma."
            },
            {
                code: "Belirleyici",
                title: "Kas Dismorfisi Belirleyicisi (Bigoreksiya)",
                content: "Birey vücut yapısının çok küçük ya da yeterince kaslı olmadığı inancıyla aşırı uğraşıyorsa bu belirleyici eklenir."
            }
        ]
    },

    // 17. İstifleme (Hoarding)
    hoarding_disorder: {
        id: "hoarding_disorder",
        nameTr: "Biriktiricilik (İstifleme) Bozukluğu",
        nameEn: "Hoarding Disorder",
        clinicalDescription: {
            overview: "Gerçek maddi veya kullanım değerleri ne olursa olsun, sahip olunan eşyaları elden çıkarma veya onlardan ayrılmayla ilgili sürekli bir güçlük yaşama ve bu eşyaların yaşam alanlarını doldurarak kullanılamaz hale getirmesidir.",
            epidemiology: "Yaygınlığı %2-6 arasındadır. Yaşlandıkça şiddeti artar.",
            etiology: "Nesnelere aşırı duygusal bağlanma, karar verme ve kategorizasyon güçlükleri.",
            prognosis: "İstifleme BDT protokolü ile tedavi edilir; klasik OKB'ye göre tedavi direnci daha yüksektir."
        },
        criteriaList: [
            {
                code: "Kriter A & B",
                title: "Elden Çıkarma Güçlüğü ve Sıkıntı",
                content: "Gerçek değerleri ne olursa olsun eşyaları elden çıkarma güçlüğü ve eşyaları saklama gereksinimi algısından kaynaklanan atma sıkıntısı."
            },
            {
                code: "Kriter C",
                title: "Yaşam Alanlarının Tıkanması",
                content: "Eşyaların birikmesi sonucu aktif yaşam alanlarının (yatak odası, mutfak) tıkanması ve amaçlanan kullanımlarının engellenmesi."
            }
        ]
    },

    // 18. Trikotillomani
    trichotillomania: {
        id: "trichotillomania",
        nameTr: "Trikotillomani (Saç Yolma Bozukluğu)",
        nameEn: "Trichotillomania",
        clinicalDescription: {
            overview: "Kişinin saç kaybıyla sonuçlanacak biçimde saçlarını, kaşlarını veya kirpiklerini yineleyici biçimde yolması ve bunu durdurmaya yönelik başarısız girişimlerde bulunmasıdır.",
            epidemiology: "Yıllık yaygınlığı %1-2'dir. Kadınlarda 10 kat daha sık görülür.",
            etiology: "Beden odaklı yineleyici davranış (BFRB); duygu düzenleme ve gerginlik boşaltma mekanizması.",
            prognosis: "Alışkanlığı Tersine Çevirme Eğitimi (Habit Reversal Training - HRT) en etkili yöntemdir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Saç/Kıl Yolma",
                content: "Saç/kıl yitimiyle sonuçlanacak biçimde kişinin yineleyici olarak saçını/kılını yolması."
            },
            {
                code: "Kriter B & C",
                title: "Durdurma Çabaları ve Sıkıntı",
                content: "Saç yolmayı azaltmaya ya da durdurmaya yönelik yineleyen başarısız girişimler ve klinik belirgin sıkıntı/işlev kaybı."
            }
        ]
    },

    // 19. Ekskoriasyon
    excoriation: {
        id: "excoriation",
        nameTr: "Deri Yolma (Ekskoriasyon) Bozukluğu",
        nameEn: "Excoriation (Skin-Picking) Disorder",
        clinicalDescription: {
            overview: "Deri lezyonlarıyla sonuçlanacak biçimde cildi, sivilceleri veya kabukları yineleyici biçimde kazıma/yolma ve bunu bırakmaya yönelik başarısız çabalardır.",
            epidemiology: "Yaygınlığı %1.4'tür. Kadınlarda belirgin olarak sıktır.",
            etiology: "Dürtü kontrol güçlüğü ve stres yatıştırma amacıyla tetiklenen otomatik/odaklanmış yolma.",
            prognosis: "HRT ve kabul ve kararlılık terapisi (ACT) ile başarılı sonuçlar alınır."
        },
        criteriaList: [
            {
                code: "Kriter A & B",
                title: "Deri Yolma ve Durdurma Çabaları",
                content: "Deri lezyonlarıyla sonuçlanan yineleyici deri yolma ve bunu durdurmaya yönelik yineleyen başarısız girişimler."
            }
        ]
    },

    // 20. TSSB (PTSD)
    ptsd: {
        id: "ptsd",
        nameTr: "Travma Sonrası Stres Bozukluğu (TSSB)",
        nameEn: "Post-Traumatic Stress Disorder (PTSD)",
        clinicalDescription: {
            overview: "Ölüm, ağır yaralanma veya cinsel şiddet tehdidine doğrudan maruz kalma ya da tanık olma sonrası gelişen; travmayı yeniden yaşantılama (flashbackler, kabuslar), kaçınma, olumsuz bilişler/duygudurum ve aşırı uyarılmışlıkla 1 aydan uzun süren tablodur.",
            epidemiology: "Yaşam boyu yaygınlığı yaklaşık %7-8'dir. Travmanın şiddetine göre (savaş, tecavüz vb.) %30-50'lere çıkar.",
            etiology: "Korku koşullanması, hipokampus hacim azalması, amigdala aşırı aktivasyonu ve travmatik anının zamansal olarak bütünleşememesi.",
            prognosis: "EMDR ve Travma Odaklı BDT altın standarttır. Tedavi edilmezse kronikleşir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Travmatik Olay Maruziyeti",
                content: "Gerçek ya da ölüm tehdidi, ağır yaralanma ya da cinsel şiddete maruz kalma (doğrudan yaşama, tanık olma, yakınının başına geldiğini öğrenme)."
            },
            {
                code: "Kriter B",
                title: "Yeniden Yaşantılama (İntrüzyon - En az 1 belirti)",
                content: "B1. İstilacı istemsiz anılar, B2. Yineleyen travmatik kabuslar, B3. Dissosiyatif tepkiler (Flashbackler), B4. Travmayı hatırlatan uyaranlarla yoğun psikolojik sıkıntı, B5. Fizyolojik tepkisellik."
            },
            {
                code: "Kriter C",
                title: "Kaçınma Belirtileri (En az 1 belirti)",
                content: "Travmayla ilgili anı, düşünce veya duygulardan VE/VEYA bunları hatırlatan dışsal uyaranlardan (insanlar, yerler, nesneler) kaçınma çabaları."
            },
            {
                code: "Kriter D",
                title: "Biliş ve Duygudurumda Olumsuz Değişmeler (En az 2 belirti)",
                content: "Travmanın önemli kısmını anımsayamama, aşırı olumsuz inançlar ('Ben kötüyüm', 'Dünya tehlikeli'), kendini suçlama, kalıcı olumsuz duygular, ilgi azalması, yabancılaşma hissi, olumlu duyguları hissedememe."
            },
            {
                code: "Kriter E & F",
                title: "Uyarılmışlık Belirtileri ve Süre (≥ 1 ay)",
                content: "İrritabilite/öfke patlamaları, pervasızca davranışlar, aşırı tetikte olma (hipervijilans), abartılı irkilme tepkisi, odaklanma güçlüğü, uyku bozukluğu. Süre > 1 ay."
            }
        ]
    },

    // 21. Akut Stres Bozukluğu
    acute_stress_disorder: {
        id: "acute_stress_disorder",
        nameTr: "Akut Stres Bozukluğu",
        nameEn: "Acute Stress Disorder",
        clinicalDescription: {
            overview: "Travmatik bir olaydan hemen sonra başlayan ve 3 gün ile 1 ay arasında süren; dissosiyasyon, intrüzyon, kaçınma ve uyarılmışlık belirtileriyle giden tablodur. 1 ayı aşarsa tanı TSSB olur.",
            epidemiology: "Ağır travmalara maruz kalanların %20-50'sinde ilk ayda görülür.",
            etiology: "Akut otonomik aşırı uyarılma ve dissosiyatif şok mekanizması.",
            prognosis: "Erken kriz müdahalesi ve psikolojik ilk yardım ile vakaların çoğunda TSSB'ye gidiş önlenir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Travmatik Maruziyet",
                content: "Ölüm tehdidi, ağır yaralanma ya da cinsel şiddete maruz kalma."
            },
            {
                code: "Kriter B & C",
                title: "Belirti Listesi (En az 9/14) ve Süre (3 gün - 1 ay)",
                content: "Yeniden yaşantılama, olumsuz duygudurum, dissosiyasyon (çevreyi sisli algılama), kaçınma ve uyarılmışlık alanlarından en az 9 belirtinin varlığı. Süre travmadan sonra 3 gün ile 1 ay arasındadır."
            }
        ]
    },

    // 22. Uyum Bozukluğu
    adjustment_disorder: {
        id: "adjustment_disorder",
        nameTr: "Uyum Bozukluğu",
        nameEn: "Adjustment Disorder",
        clinicalDescription: {
            overview: "Tanımlanabilir bir yaşam stresörünün (boşanma, iş kaybı, iflas, taşınma) ortaya çıkmasından sonraki 3 ay içinde gelişen, stresörün ağırlığıyla orantısız duygusal ya da davranışsal belirtiler tablosudur.",
            epidemiology: "Psikiyatri konsültasyonlarında en sık (%50) konulan tanılardan biridir.",
            etiology: "Başa çıkma becerilerinin stresör karşısında yetersiz kalması.",
            prognosis: "Stresör ortadan kalktıktan sonra belirtiler en geç 6 ay içinde tamamen düzelir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "3 Ay İçinde Başlama",
                content: "Belirlenebilir bir ya da birden fazla stresöre tepki olarak, stresörün başlamasından sonraki 3 ay içinde ortaya çıkan duygusal ya da davranışsal belirtiler."
            },
            {
                code: "Kriter B & E",
                title: "Orantısız Sıkıntı ve Süre Kuralı",
                content: "Stresörün ağırlığıyla orantısız sıkıntı ya da işlevsellik kaybı. Stresör sonlandıktan sonra belirtiler 6 aydan daha uzun sürmez."
            }
        ]
    },

    // 23. Şizofreni
    schizophrenia: {
        id: "schizophrenia",
        nameTr: "Şizofreni",
        nameEn: "Schizophrenia",
        clinicalDescription: {
            overview: "Düşünce içeriği (sanrılar), algı (varsanılar), düşünce akışı (dezorganizasyon) ve duygulanım/isteklilik (negatif belirtiler) alanlarında derin bozulmalarla seyreden, en az 6 ay süren kronik psikiyatrik bozukluktur.",
            epidemiology: "Yaşam boyu yaygınlığı dünya genelinde %0.7 - 1'dir. Erkeklerde 18-25, kadınlarda 25-35 yaşlarında başlar.",
            etiology: "Dopamin hipotezi (mezolimbik hiperaktivite -> pozitif belirtiler; mezokortikal hipoaktivite -> negatif belirtiler), glutamat/NMDA hipotezi ve yüksek genetik kalıtılabilirlik (%80).",
            prognosis: "Erken antipsikotik tedavisi, psikososyal beceri eğitimi ve aile desteği remisyon için kritiktir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Aktif Evre Belirtileri (En az 2/5 belirti, en az biri 1, 2 veya 3 olmalı)",
                content: "Bir aylık bir süre boyunca aşağıdaki belirtilerden en az ikisinin bulunması (en az biri 1, 2 ya da 3 olmalıdır):",
                items: [
                    "A1. Sanrılar (Hezeyanlar - perseküsyon, referans, grandiyözite vb.).",
                    "A2. Varsanılar (Halüsinasyonlar - özellikle işitsel üçüncü şahıs sesler).",
                    "A3. Dezorganize (darmadağın) konuşma (çağrışımlarda dağınıklık, teğetsellik, enkoherans).",
                    "A4. İleri derecede dezorganize ya da katatonik davranış.",
                    "A5. Negatif belirtiler (duygusal dışavurumda azalma, künt duygulanım, avolisyon/isteksizlik, aloji/konuşma fakirliği, anhedoni, asosyallik)."
                ]
            },
            {
                code: "Kriter B",
                title: "İşlevsellik Düzeyinde Düşme",
                content: "İş, kişilerarası ilişkiler ya da kendine bakım gibi başlıca alanlarda işlevsellik düzeyinin belirgin olarak düşmesi."
            },
            {
                code: "Kriter C",
                title: "Süre Kuralı (En az 6 ay)",
                content: "Bozukluğun süregiden belirtileri en az 6 ay sürer (bu 6 ay en az 1 aylık aktif evre belirtilerini içermelidir)."
            },
            {
                code: "Kriter D",
                title: "Şizoaffektif ve Duygudurum Dışlaması",
                content: "Şizoaffektif bozukluk ve psikotik özellikli duygudurum bozuklukları dışlanmıştır."
            }
        ]
    },

    // 24. Şizoaffektif Bozukluk
    schizoaffective: {
        id: "schizoaffective",
        nameTr: "Şizoaffektif Bozukluk",
        nameEn: "Schizoaffective Disorder",
        clinicalDescription: {
            overview: "Şizofreni A ölçütünü karşılayan psikotik belirtilerle eşzamanlı olarak majör duygudurum ataklarının (Mani veya Majör Depresyon) bulunduğu VE hastalığın bir döneminde duygudurum atağı OLMADAN en az 2 hafta tek başına süren sanrı/varsanıların varlığıyla tanımlanan tablodur.",
            epidemiology: "Yaygınlığı yaklaşık %0.3'tür. Kadınlarda daha sıktır.",
            etiology: "Şizofreni ve Bipolar bozukluk genetik özelliklerinin ortak örtüşmesi.",
            prognosis: "Şizofreniden daha iyi, Bipolar bozukluktan daha dirençli bir klinik seyir gösterir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Eşzamanlı Psikotik ve Duygudurum Atağı",
                content: "Şizofreninin A ölçütünü karşılayan belirtilerle eşzamanlı olarak bir Majör Duygudurum Döneminin (Manik ya da Majör Depresif) bulunması."
            },
            {
                code: "Kriter B",
                title: "Duygudurum Olmaksızın 2 Hafta Psikoz (Kilit Ayrım)",
                content: "Yaşam boyu hastalık süresi içinde, belirgin bir duygudurum dönemi OLMADAN en az 2 hafta süren sanrılar ya da varsanıların bulunması."
            },
            {
                code: "Kriter C",
                title: "Duygudurum Belirtilerinin Baskınlığı",
                content: "Duygudurum dönemi ölçütlerini karşılayan belirtiler hastalığın aktif ve kalıcı dönemlerinin toplam süresinin çoğunda bulunur."
            }
        ]
    },

    // 25. Şizofreniform Bozukluk
    schizophreniform: {
        id: "schizophreniform",
        nameTr: "Şizofreniform Bozukluk",
        nameEn: "Schizophreniform Disorder",
        clinicalDescription: {
            overview: "Şizofreninin A ölçütlerini karşılayan ancak toplam süresi (öncül, aktif ve kalıntı dönemler dahil) 1 aydan uzun ve 6 aydan KISA süren tablodur. Belirtiler 6 ayı geçerse tanı Şizofreni olur.",
            epidemiology: "Yaygınlığı şizofreniden düşüktür; hastaların üçte ikisi 6 ayı doldurarak şizofreniye dönüşür.",
            etiology: "Erken psikoz patofizyolojisi.",
            prognosis: "Hızlı antipsikotik müdahalesi ile tam remisyon sağlanan vakalarda prognoz mükemmeldir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Şizofreni A Belirtileri",
                content: "Sanrı, varsanı, dezorganize konuşma, katatoni, negatif belirtilerden en az ikisinin bulunması."
            },
            {
                code: "Kriter B",
                title: "Süre Ölçütü (1 ay - 6 ay arası)",
                content: "Bir atağın süresi en az 1 aydır ancak 6 aydan daha kısadır."
            }
        ]
    },

    // 26. Kısa Psikotik Bozukluk
    brief_psychotic: {
        id: "brief_psychotic",
        nameTr: "Kısa Psikotik Bozukluk",
        nameEn: "Brief Psychotic Disorder",
        clinicalDescription: {
            overview: "Genellikle ağır bir psikososyal stresör (şok, kayıp, afet) sonrası aniden başlayan, sanrı, varsanı veya dezorganizasyon içeren, en az 1 gün sürüp en geç 1 ay içinde TAM REMİSYONLA düzelen tablodur.",
            epidemiology: "İlk psikotik atakların yaklaşık %9'unu oluşturur. Kadınlarda 2 kat sıktır.",
            etiology: "Ağır travmatik stres ve kırılgan kişilik yapısı.",
            prognosis: "1 ay içinde tam düzelme ile sonuçlanır; prognozu en iyi psikotik tablodur."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Psikotik Belirtiler (En az 1 belirti)",
                content: "A1. Sanrılar, A2. Varsanılar, A3. Dezorganize konuşma, A4. İleri derecede dezorganize ya da katatonik davranış (En az biri bulunmalıdır)."
            },
            {
                code: "Kriter B",
                title: "Süre ve Tam Düzelme (1 gün - 1 ay)",
                content: "Bir atağın süresi en az 1 gündür ancak 1 aydan kısadır ve kişi hastalık öncesi işlevsellik düzeyine tam olarak geri döner."
            }
        ]
    },

    // 27. Sanrılı Bozukluk
    delusional_disorder: {
        id: "delusional_disorder",
        nameTr: "Sanrılı Bozukluk (Paranoya)",
        nameEn: "Delusional Disorder",
        clinicalDescription: {
            overview: "En az 1 ay süren, mantıksal olarak kurgulanmış sarsılmaz bir ya da daha çok sanrının (perseküsyon, kıskançlık, erotomanik, grandiyöz, somatik) varlığıyla karakterize; sanrı konusu dışında kişinin işlevselliğinin, muhakemesinin ve kişiliğinin KORUNDUĞU tablodur.",
            epidemiology: "Yaygınlığı %0.2 civarındadır. İleri yaşlarda (40 yaş üstü) daha sık başlar.",
            etiology: "İzole düşünce çarpıtmaları ve yansıtma (projeksiyon) savunma mekanizması.",
            prognosis: "Sanrı kapsüllenmiştir; antipsikotik tedaviye dirençli olabilir ancak destekleyici terapiyle hasta stabilize edilir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Sanrıların Varlığı (≥ 1 ay)",
                content: "En az 1 ay süren bir (ya da daha çok) sanrının varlığı."
            },
            {
                code: "Kriter B",
                title: "Şizofreni A Dışlaması",
                content: "Şizofreninin A ölçütü hiçbir zaman karşılanmamıştır (belirgin halüsinasyon, dezorganize konuşma ve negatif belirtiler yoktur)."
            },
            {
                code: "Kriter C",
                title: "İşlevselliğin Korunması",
                content: "Sanrının ya da dallanıp budaklanmalarının doğrudan etkisi bir yana bırakılırsa işlevsellik belirgin olarak bozulmamıştır ve davranışlar açıkça tuhaf ya da alışılmadık değildir."
            },
            {
                code: "Alt Tipler",
                title: "DSM-5 Sanrı Tipleri",
                content: "1. Erotomanik Tip (birinin kendine aşık olduğu inancı), 2. Büyüklük (Grandiyöz) Tipi, 3. Kıskançlık Tipi (eşin aldattığı inancı - Othello Sendromu), 4. Kötülük Görme (Persekütuar) Tipi, 5. Somatik Tip (vücutta böcek/koku sanrısı), 6. Karışık Tip."
            }
        ]
    },

    // 28. Paranoid KB
    paranoid_pd: {
        id: "paranoid_pd",
        nameTr: "Paranoid Kişilik Bozukluğu",
        nameEn: "Paranoid Personality Disorder",
        clinicalDescription: {
            overview: "Erken erişkinlikte başlayan, başkalarının niyetlerini kötü niyetli olarak yorumlayan, yeterli bir temele dayanmaksızın insanlara karşı yaygın güvensizlik, kin gütme ve kuşkuculuk örüntüsüdür.",
            epidemiology: "Genel popülasyonda %2-4 civarındadır. Erkeklerde daha sıktır.",
            etiology: "Yansıtma mekanizması ve erken çocuklukta soğuk/tehditkar ebeveyn tutumları.",
            prognosis: "Katı ve süreğendir; terapötik güven oluşturmak zordur."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Yaygın Kuşkuculuk (En az 4/7 belirti)",
                content: "Aşağıdakilerden en az dördüyle belirlenen yaygın güvensizlik ve kuşkuculuk:",
                items: [
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

    // 29. Şizoid KB
    schizoid_pd: {
        id: "schizoid_pd",
        nameTr: "Şizoid Kişilik Bozukluğu",
        nameEn: "Schizoid Personality Disorder",
        clinicalDescription: {
            overview: "Toplumsal ilişkilerden tamamen kopma, yakın ilişki kurmayı içtenlikle istememe ve kişilerarası ortamlarda kısıtlı duygusal dışavurumla (soğukluk/küntlük) seyreden kişilik yapısıdır.",
            epidemiology: "Yaygınlığı %3-5 civarındadır. Erkeklerde daha sık görülür.",
            etiology: "Sosyal ödül devresi hipoaktivitesi ve aşırı içedönüklük mizacı.",
            prognosis: "Hasta yalnız yaşamaktan memnundur; genellikle çevre baskısı olmadıkça tedaviye başvurmaz."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Toplumsal Kopukluk (En az 4/7 belirti)",
                content: "Aşağıdakilerden en az dördüyle belirlenen toplumsal ilişkilerden kopma ve kısıtlı duygulanım:",
                items: [
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

    // 30. Şizotipal KB
    schizotypal_pd: {
        id: "schizotypal_pd",
        nameTr: "Şizotipal Kişilik Bozukluğu",
        nameEn: "Schizotypal Personality Disorder",
        clinicalDescription: {
            overview: "Düşünce ve algıda tuhaflıklar (büyüsel düşünüş, altıncı his inancı, olağandışı algısal yaşantılar), tuhaf giyim/konuşma ve yakın ilişkilerde yoğun toplumsal kaygıyla seyreden tablodur.",
            epidemiology: "Yaygınlığı %3-4 civarındadır. Şizofreni hastalarının birinci derece yakınlarında sıktır.",
            etiology: "Şizofreni genetik spektrumunda yer alır.",
            prognosis: "Düşük doz antipsikotik ve sosyal beceri eğitimi yaşam kalitesini artırır."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Bilişsel/Algısal Tuhaflıklar (En az 5/9 belirti)",
                content: "Aşağıdakilerden en az beşiyle belirlenen toplumsal ve kişilerarası yetersizlik örüntüsü:",
                items: [
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

    // 31. Borderline KB
    borderline_pd: {
        id: "borderline_pd",
        nameTr: "Sınırda (Borderline) Kişilik Bozukluğu",
        nameEn: "Borderline Personality Disorder",
        clinicalDescription: {
            overview: "Kişilerarası ilişkilerde, benlik algısında ve duygulanımda belirgin kararsızlık (oynaklık), saatlik duygudurum krizleri, terk edilme dehşeti, kronik boşluk hissi, dürtüsellik ve yineleyen kendine zarar verme/özkıyım davranışları ile karakterizedir.",
            epidemiology: "Genel popülasyonda %1.6 - 2, psikiyatri kliniklerinde %20 civarındadır. Kadınlarda %75 sıklıkta görülür.",
            etiology: "Biyososyal Teori (Linehan): Duygusal aşırı duyarlılık + Geçersiz kılıcı (invalidating) erken çevre; erken çocukluk travmaları.",
            prognosis: "Diyalektik Davranış Terapisi (DBT) ile intihar ve kendine zarar verme davranışlarında %80'in üzerinde azalma sağlanır."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Yaygın Kararsızlık ve Dürtüsellik (En az 5/9 belirti)",
                content: "Aşağıdakilerden en az beşiyle belirlenen kararsızlık ve dürtüsellik örüntüsü:",
                items: [
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

    // 32. Antisosyal KB
    antisocial_pd: {
        id: "antisocial_pd",
        nameTr: "Antisosyal Kişilik Bozukluğu",
        nameEn: "Antisocial Personality Disorder",
        clinicalDescription: {
            overview: "15 yaşından beri süregelen, başkalarının temel haklarını hiçe sayma ve çiğneme, yasalara uymama, dolandırıcılık, dürtüsellik, saldırganlık, vicdan azabı/pişmanlık duymama ve empati yoksunluğu örüntüsüdür.",
            epidemiology: "Toplumda %3 (erkeklerde %3-5, kadınlarda %1). Cezaevlerinde %50-70 civarındadır.",
            etiology: "Düşük otonomik uyarılabilirlik (korkusuzluk hipotezi), prefrontal korteks gri cevher hacim düşüklüğü ve çocuklukta Davranım Bozukluğu öyküsü.",
            prognosis: "Yaşlandıkça (40 yaş sonrası) kriminal dürtüsellik azalabilir ancak empati yoksunluğu kalıcıdır."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Hak İhlali Örüntüsü (En az 3/7 belirti)",
                content: "15 yaşından beri süregelen, aşağıdakilerden en az üçüyle belirlenen başkalarının haklarını çiğneme örüntüsü:",
                items: [
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
                code: "Kriter B & C",
                title: "Yaş Sınırı ve Davranım Bozukluğu Kanıtı",
                content: "Birey en az 18 yaşındadır ve 15 yaşından önce başlayan bir Davranım Bozukluğunun kanıtları bulunmaktadır."
            }
        ]
    },

    // 33. Narsisistik KB
    narcissistic_pd: {
        id: "narcissistic_pd",
        nameTr: "Narsisistik Kişilik Bozukluğu",
        nameEn: "Narcissistic Personality Disorder",
        clinicalDescription: {
            overview: "Büyüklenmecilik (düşlemde ya da davranışta üstünlük hissi), sürekli aşırı hayranlık ve övgü gereksinimi, empati yoksunluğu ve başkalarını kendi çıkarları için kullanma örüntüsüdür.",
            epidemiology: "Yaygınlığı %1-6 arasındadır. Erkeklerde %50-75 oranında daha sıktır.",
            etiology: "Kırılgan özdeğer savunması; aşırı şımartıcı veya aşırı soğuk/koşullu ebeveyn tutumları.",
            prognosis: "Şema Terapi ile kırılgan çocuk moduyla çalışılarak empati kapasitesi geliştirilebilir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Büyüklenmecilik ve Hayranlık Arayışı (En az 5/9 belirti)",
                content: "Aşağıdakilerden en az beşiyle belirlenen büyüklenmecilik ve empati yoksunluğu:",
                items: [
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

    // 34. Histriyonik KB
    histrionic_pd: {
        id: "histrionic_pd",
        nameTr: "Histriyonik Kişilik Bozukluğu",
        nameEn: "Histrionic Personality Disorder",
        clinicalDescription: {
            overview: "Aşırı duygusallık, ilgi odağı olma arzusu, baştan çıkarıcı/ayartıcı davranışlar, teatral ve dramatik anlatım ile ilişkileri olduğundan daha yakın görme örüntüsüdür.",
            epidemiology: "Yaygınlığı %1.8 civarındadır. Kadınlarda daha sık tanı alır.",
            etiology: "Dikkat çekme yoluyla terk edilmeyi engelleme bilişsel şemaları.",
            prognosis: "Psikodinamik ve BDT ile derin duygusal ihtiyaçları sözel ifade etme becerisi kazandırılır."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Aşırı Duygusallık ve İlgi Arayışı (En az 5/8 belirti)",
                content: "Aşağıdakilerden en az beşiyle belirlenen ilgi odağı olma örüntüsü:",
                items: [
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

    // 35. Kaçıngan (Çekingen) KB
    avoidant_pd: {
        id: "avoidant_pd",
        nameTr: "Çekingen (Kaçıngan) Kişilik Bozukluğu",
        nameEn: "Avoidant Personality Disorder",
        clinicalDescription: {
            overview: "Toplumsal ketlenme, yetersizlik duyguları ve olumsuz değerlendirilmeye aşırı duyarlılık nedeniyle; yakın ilişkileri çok arzulamasına rağmen reddedilme ve eleştirilme korkusuyla insanlardan kaçınma örüntüsüdür.",
            epidemiology: "Yaygınlığı %2.4'tür. Kadın ve erkeklerde eşit görülür.",
            etiology: "Erken çocuklukta yoğun utanç, reddedilme ve 'Ben kusurluyum' şeması.",
            prognosis: "Şema Terapi ve BDT ile sosyal etkileşimlerde kademeli maruziyet sağlanır."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Toplumsal Ketlenme ve Yetersizlik (En az 4/7 belirti)",
                content: "Aşağıdakilerden en az dördüyle belirlenen kaçınma örüntüsü:",
                items: [
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

    // 36. Bağımlı KB
    dependent_pd: {
        id: "dependent_pd",
        nameTr: "Bağımlı Kişilik Bozukluğu",
        nameEn: "Dependent Personality Disorder",
        clinicalDescription: {
            overview: "Başkalarının bakımına ve onayına duyulan aşırı ve yaygın gereksinim nedeniyle boyun eğici, yapışkan davranışlar sergileme ve ayrılmaktan/tek başına karar almaktan dehşetle korkma örüntüsüdür.",
            epidemiology: "Yaygınlığı %0.5 - 1 arasındadır. Kadınlarda daha sıktır.",
            etiology: "Aşırı koruyucu-kısıtlayıcı ebeveynlik ve 'Ben tek başıma yetersizim' temel inancı.",
            prognosis: "BDT ile özerklik (otonomi) ve girişkenlik becerileri kazandırılır."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Boyun Eğici ve Yapışkan Tutum (En az 5/8 belirti)",
                content: "Aşağıdakilerden en az beşiyle belirlenen aşırı bakım gereksinimi:",
                items: [
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

    // 37. OKKB (Obsesif-Kompulsif Kişilik Bozukluğu)
    ocpd: {
        id: "ocpd",
        nameTr: "Obsesif-Kompulsif Kişilik Bozukluğu (OKKB)",
        nameEn: "Obsessive-Compulsive Personality Disorder (OCPD)",
        clinicalDescription: {
            overview: "Esneklik, açıklık ve verimlilik pahasına düzenlilik, mükemmeliyetçilik, zihinsel ve kişilerarası denetim üzerine aşırı kafa yorma örüntüsüdür. OKB'den farkı EGOSİNTONİK olmasıdır (kişi kurallarının doğruluğuna inanır).",
            epidemiology: "En sık görülen kişilik bozukluklarından biridir (%2-8). Erkeklerde 2 kat fazladır.",
            etiology: "Aşırı kontrolcü, katı ahlaki kuralları olan aile ortamı.",
            prognosis: "Şema Terapi ile hata yapma toleransı ve duygusal esneklik geliştirilir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Düzenlilik ve Denetim Örüntüsü (En az 4/8 belirti)",
                content: "Aşağıdakilerden en az dördüyle belirlenen mükemmeliyetçilik ve katılık:",
                items: [
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

    // 38. Anoreksiya Nervoza
    anorexia_nervosa: {
        id: "anorexia_nervosa",
        nameTr: "Anoreksiya Nervoza",
        nameEn: "Anorexia Nervosa",
        clinicalDescription: {
            overview: "Kişinin belirgin derecede düşük vücut ağırlığına (BKİ < 18.5) sahip olmasına karşın kilo almaktan veya şişmanlamaktan aşırı korkması ve vücut ağırlığını/biçimini algılamada ağır bozulma yaşamasıdır.",
            epidemiology: "Genç kadınlarda %0.5 - 1. Psikiyatride mortalite (ölüm) oranı en yüksek bozukluktur (%5-10 kardiyak arrest ve intihar).",
            etiology: "Aşırı mükemmeliyetçilik, kontrol arayışı, batı kültürü zayıflık ideali ve genetik yatkınlık.",
            prognosis: "Aile Temelli Terapi (FBT / Maudsley Modeli) ve medikal stabilizasyon esastır."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Belirgin Düşük Vücut Ağırlığı",
                content: "Gereksinimlere göre enerji alımını kısıtlama sonucu yaş, cinsiyet ve gelişimsel yolağa göre belirgin derecede düşük vücut ağırlığına (BKİ < 18.5) sahip olma."
            },
            {
                code: "Kriter B",
                title: "Kilo Alma Korkusu",
                content: "Belirgin derecede düşük vücut ağırlığında olmasına karşın kilo almaktan ya da şişmanlamaktan aşırı korkma ya da kilo almayı engelleyen süregiden davranışlar sergileme."
            },
            {
                code: "Kriter C",
                title: "Beden Algısında Bozulma",
                content: "Bireyin vücut ağırlığını ya da biçimini algılama biçiminde bozukluk, vücut ağırlığının özdeğerlendirmede yersiz bir etki yaratması ya da düşük kilonun getirdiği tehlikeyi inkar etme."
            },
            {
                code: "Alt Tipler",
                title: "DSM-5 Tipleri",
                content: "1. Kısıtlayıcı Tip (sadece diyet, oruç, aşırı egzersiz), 2. Tıkınırcasına Yeme / Çıkarma Tipi (düzenli kusma, laksatif kullanma)."
            }
        ]
    },

    // 39. Bulimiya Nervoza
    bulimia_nervosa: {
        id: "bulimia_nervosa",
        nameTr: "Bulimiya Nervoza",
        nameEn: "Bulimia Nervosa",
        clinicalDescription: {
            overview: "Yineleyen tıkınırcasına yeme nöbetleri ve ardından kilo almayı engellemek için parmakla kusma, laksatif kullanma veya aşırı egzersiz gibi telafi edici davranışların olmasıdır. Kişi NORMAL kilo aralığındadır.",
            epidemiology: "Genç kadınlarda %1-1.5 civarındadır.",
            etiology: "Katı diyet kurallarının kırılmasıyla tetiklenen tıkınma ve ardından gelen arınma döngüsü (Fairburn Modeli).",
            prognosis: "CBT-E (Yeme Bozuklukları BDT) ve yüksek doz Fluoksetin (60 mg) ile yüksek iyileşme sağlanır."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Tıkınırcasına Yeme Nöbetleri",
                content: "1. Benzer koşullarda çoğu insanın yiyebileceğinden çok daha fazla yiyeceği kısa sürede tüketme. 2. Yeme üzerinde denetimi yitirme hissi."
            },
            {
                code: "Kriter B & C",
                title: "Telafi Edici Davranışlar ve Sıklık (Haftada ≥ 1, en az 3 ay)",
                content: "Kilo almaktan kaçınmak için kendini kusturma, laksatif/diüretik kötüye kullanımı, aç kalma veya aşırı egzersiz yapma. En az 3 ay boyunca haftada en az bir kez ortaya çıkar."
            },
            {
                code: "Kriter D & E",
                title: "Özdeğerlendirme ve Anoreksiya Dışlaması",
                content: "Kendilik değeri vücut biçimi ve kilosundan aşırı etkilenir. Tablo yalnızca Anoreksiya epizodu sırasında ortaya çıkmaz (kilo normaldir)."
            }
        ]
    },

    // 40. BED (Tıkınırcasına Yeme)
    binge_eating: {
        id: "binge_eating",
        nameTr: "Tıkınırcasına Yeme Bozukluğu",
        nameEn: "Binge-Eating Disorder",
        clinicalDescription: {
            overview: "Kişinin kendini durduramayarak devasa miktarda yemeği tıkınırcasına yemesi ve ardından yoğun suçluluk duymasıdır. Bulimiya'dan farkı KUSMA/LAKSATİF gibi telafi edici eylemlerin KESİNLİKLE OLMAMASIDIR.",
            epidemiology: "En sık görülen yeme bozukluğudur (%2-3.5). Obez bireylerde sıktır.",
            etiology: "Olumsuz duyguları yeme yoluyla düzenleme (duygusal yeme).",
            prognosis: "BDT ve Lisdeksamfetamin/SSRI ile kontrol altına alınır."
        },
        criteriaList: [
            {
                code: "Kriter A & B",
                title: "Tıkınma Nöbetleri ve Özellikleri (En az 3/5)",
                content: "Olağandan çok daha hızlı yeme, rahatsız edici tokluğa kadar yeme, aç hissetmiyorken yeme, utandığı için yalnız yeme, sonrasında kendinden iğrenme/suçluluk duyma."
            },
            {
                code: "Kriter C & D",
                title: "Telafi Edici Eylemlerin Olmaması",
                content: "Haftada en az bir kez 3 ay boyunca sürer ve Bulimiyadaki gibi uygunsuz ödünleyici (kusma vb.) davranışlar YOKTUR."
            }
        ]
    },

    // 41. Pika
    pica: {
        id: "pica",
        nameTr: "Pika (Yenmeyen Maddeleri Yeme)",
        nameEn: "Pica",
        clinicalDescription: {
            overview: "Gelişimsel düzeye uygunsuz olarak, en az 1 ay boyunca besin değeri olmayan ve yenmeyen maddeleri (toprak, tebeşir, kil, kireç, saç, sabun) sürekli yemedir.",
            epidemiology: "Çocuklarda, hamilelerde ve zihinsel engelli bireylerde daha sıktır.",
            etiology: "Ağır demir/çinko eksikliği veya duyusal uyarılma arayışı.",
            prognosis: "Mineral takviyesi ve davranışsal müdahale ile düzelir."
        },
        criteriaList: [
            {
                code: "Kriter A & B",
                title: "Yenmeyen Maddeleri Yeme ve Süre (≥ 1 ay)",
                content: "En az 1 ay boyunca besin değeri olmayan, yenilebilir olmayan maddeleri sürekli olarak yeme ve gelişimsel düzeye uygunsuz olması."
            }
        ]
    },

    // 42. Somatizasyon (Bedensel Belirti Bozukluğu)
    somatic_symptom_disorder: {
        id: "somatic_symptom_disorder",
        nameTr: "Bedensel Belirti Bozukluğu (Somatizasyon)",
        nameEn: "Somatic Symptom Disorder",
        clinicalDescription: {
            overview: "Kişinin günlük yaşamını bozan rahatsız edici bir ya da birden fazla bedensel belirti (kronik ağrı, yanma, uyuşma) yaşaması ve bu belirtilerin ciddiyetine ilişkin aşırı ve orantısız düşünce, kaygı ve zaman harcamasıdır.",
            epidemiology: "Yaygınlığı %5-7 civarındadır. Kadınlarda daha sıktır.",
            etiology: "Duygusal sıkıntıların bedensel duyumlar olarak somatize edilmesi ve aşırı bedensel odaklanma.",
            prognosis: "Düzenli tek bir hekim takibi ve BDT ile doktor alışverişi ve tetkik bağımlılığı azaltılır."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Sıkıntı Verici Bedensel Belirtiler",
                content: "Günlük yaşamı bozan bir ya da birden fazla bedensel belirtinin varlığı."
            },
            {
                code: "Kriter B",
                title: "Belirtilerle İlgili Aşırı Düşünce/Kaygı (En az 1/3)",
                content: "1. Belirtilerin ciddiyetiyle orantısız ve sürekli düşünceler. 2. Sağlık ya da belirtilerle ilgili sürekli yüksek kaygı. 3. Belirtilere aşırı zaman ve enerji harcama."
            },
            {
                code: "Kriter C",
                title: "Süre Kriteri (≥ 6 ay)",
                content: "Herhangi bir belirti sürekli olmasa da belirtili olma durumu 6 aydan uzun sürer."
            }
        ]
    },

    // 43. Hastalık Kaygısı Bozukluğu (Hipokondriyazis)
    illness_anxiety_disorder: {
        id: "illness_anxiety_disorder",
        nameTr: "Hastalık Kaygısı Bozukluğu (Hipokondriyazis)",
        nameEn: "Illness Anxiety Disorder",
        clinicalDescription: {
            overview: "Belirgin bedensel belirti OLMAMASINA veya çok hafif olmasına karşın, kişinin ölümcül/ağır bir hastalığı (kanser, tümör) olduğuna dair aşırı kafa yorması ve sürekli tıbbi tetkik/araştırma yapmasıdır.",
            epidemiology: "Yaygınlığı %1.3 - 10 arasındadır. Kadın ve erkeklerde eşit görülür.",
            etiology: "Sağlık anksiyetesi ve belirsizliğe tahammülsüzlük.",
            prognosis: "BDT ile güvence arama davranışları söndürülür."
        },
        criteriaList: [
            {
                code: "Kriter A & B",
                title: "Ağır Hastalık Düşüncesi ve Belirti Yokluğu",
                content: "Ağır bir hastalığı olduğunu ya da olacağını düşünme üzerine kafa yorma. Bedensel belirti yoktur ya da çok hafiftir."
            },
            {
                code: "Kriter C & D & E",
                title: "Aşırı Sağlık Davranışları ve Süre (≥ 6 ay)",
                content: "Yüksek kaygı ve aşırı sağlık davranışları (vücudunu kontrol etme, doktora gitme ya da kaçınma). Süre en az 6 aydır."
            }
        ]
    },

    // 44. Konversiyon (Dönüşüm)
    conversion_disorder: {
        id: "conversion_disorder",
        nameTr: "Dönüşüm (Konversiyon) Bozukluğu",
        nameEn: "Conversion Disorder (Functional Neurological)",
        clinicalDescription: {
            overview: "İstemli motor ya da duyusal işlevlerde (felç, körlük, afoni, nöbet benzeri kasılmalar) değişme olması ve bu belirtilerin bilinen nörolojik hastalıklarla (inme, epilepsi) bağdaşmadığına ilişkin klinik kanıtların bulunmasıdır.",
            epidemiology: "Nöroloji kliniklerine başvuranların %5'ini oluşturur. Kadınlarda 2-3 kat fazladır.",
            etiology: "Bilinçdışı psikolojik çatışmaların bedensel nörolojik semptoma dönüştürülmesi (Freudyen primer kazanç).",
            prognosis: "Akut başlangıçlı vakalarda psikoeğitim ve fizik tedaviyle hızlı düzelme sağlanır."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Motor/Duyusal İşlev Değişikliği",
                content: "İstemli motor ya da duyusal işlevlerde değişme olduğunu gösteren bir ya da birden fazla belirti (güçsüzlük, felç, yutma güçlüğü, nöbetler, duyu yitimi)."
            },
            {
                code: "Kriter B",
                title: "Nörolojik Bağdaşmazlık Kanıtı",
                content: "Belirti ile tanınan nörolojik ya da tıbbi durumlar arasında bağdaşmazlık olduğunu gösteren klinik bulgular (örn. Hoover testi pozitifliği, Video-EEG'de epileptik deşarj olmaması)."
            }
        ]
    },

    // 45. Yapay Bozukluk (Münchausen)
    factitious_disorder: {
        id: "factitious_disorder",
        nameTr: "Yapay Bozukluk (Münchausen Sendromu)",
        nameEn: "Factitious Disorder (Munchausen Syndrome)",
        clinicalDescription: {
            overview: "Belirlenebilir hiçbir dışsal ödül (para, nafaka, ceza muafiyeti) olmaksızın, kişinin kendisinde ya da başkasında (çocuğunda) bilerek ve kasten hastalık belirtileri üretmesi ya da hastalık uydurmasıdır.",
            epidemiology: "Hastanede yatanların %1'ini oluşturur. Sağlık çalışanlarında sıktır.",
            etiology: "Hasta rolü üstlenerek ilgi ve şefkat görme ihtiyacı.",
            prognosis: "Adli ve klinik yönetim gerektirir; çocuk istismarı (Münchausen by Proxy) durumunda acil koruma şarttır."
        },
        criteriaList: [
            {
                code: "Kriter A & B",
                title: "Belirtileri Kasten Üretme",
                content: "Kendisinde ya da bir başkasında fiziksel ya da psikolojik belirti ve bulguları bilerek ortaya çıkarma ya da hastalık uydurma."
            },
            {
                code: "Kriter C",
                title: "Dışsal Kazancın Olmaması",
                content: "Belirlenebilir bir dış ödül (maddi kazanç, yasal sorumluluktan kaçma) olmaksızın hasta rolü sergilenir."
            }
        ]
    },

    // 46. Dissosiyatif Kimlik Bozukluğu (DKB)
    did: {
        id: "did",
        nameTr: "Dissosiyatif Kimlik Bozukluğu",
        nameEn: "Dissociative Identity Disorder",
        clinicalDescription: {
            overview: "İki ya da daha fazla ayrı kişilik durumu (alter kimlikler) ile belirlenen kimlik bölünmesi ve önemli kişisel bilgileri, travmatik olayları anımsamada günlük unutkanlıkla açıklanamayacak yineleyen amnezi boşluklarıdır.",
            epidemiology: "Yaygınlığı yaklaşık %1-1.5'tir. Kadınlarda daha sık tanı alır.",
            etiology: "Erken çocuklukta (özellikle 6 yaş öncesi) yaşanan ağır, süreğen ve kaçılamaz fiziksel/cinsel travmalar.",
            prognosis: "Faz Odaklı Travma Terapisi (Güvenlik -> Travma İşleme -> Alterlerin Entegrasyonu) ile bütünleşme hedeflenir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "İki veya Daha Fazla Ayrı Kişilik Durumu",
                content: "İki ya da daha fazla ayrı kişilik durumuyla belirlenen kimlik bölünmesi (kendilik duyumu ve eylemlilikte belirgin süreksizlik)."
            },
            {
                code: "Kriter B",
                title: "Amnezi Boşlukları",
                content: "Günlük olayları, önemli kişisel bilgileri ya da travmatik olayları anımsamada sıradan unutkanlıkla bağdaşmayan yineleyen boşluklar."
            }
        ]
    },

    // 47. Depersonalizasyon / Derealizasyon
    depersonalization_derealization: {
        id: "depersonalization_derealization",
        nameTr: "Duyarsızlaşma / Yabancılaşma",
        nameEn: "Depersonalization/Derealization Disorder",
        clinicalDescription: {
            overview: "Kişinin kendi bedenine, zihnine veya duygularına dışarıdan bir gözlemci gibi yabancılaşması (depersonalizasyon) ya da çevresindeki dünyayı rüya gibi, sisli ve cansız algılamasıdır (derealizasyon). Gerçeklik testi TAMDIR.",
            epidemiology: "Yaşam boyu geçici yaşama %50 iken bozukluk boyutu %1-2'dir.",
            etiology: "Aşırı anksiyete ve panik anında beynin geliştirdiği dissosiyatif savunma.",
            prognosis: "Topraklanma (grounding) teknikleri ve BDT ile remisyon sağlanır."
        },
        criteriaList: [
            {
                code: "Kriter A & B",
                title: "Yabancılaşma Yaşantısı ve Gerçeklik Testinin Korunması",
                content: "Süregiden depersonalizasyon (kendi bedenine yabancılaşma) ya da derealizasyon (çevreye yabancılaşma) deneyimleri. Bu sırada gerçekliği değerlendirme yetisi tam olarak korunur (psikoz değildir)."
            }
        ]
    },

    // 48. Dissosiyatif Amnezi
    dissociative_amnesia: {
        id: "dissociative_amnesia",
        nameTr: "Dissosiyatif Amnezi (Füg ile Birlikte)",
        nameEn: "Dissociative Amnesia",
        clinicalDescription: {
            overview: "Genellikle travmatik ya da aşırı stresli nitelikteki önemli kişisel bilgileri (otobiyografik anıları) sıradan unutkanlıkla açıklanamayacak biçimde anımsayamama tablosudur. Füg eşlik ederse amaçsız bir seyahat ve yeni kimlik edinme görülür.",
            epidemiology: "Yaygınlığı %1.8'dir.",
            etiology: "Ağır travmatik yaşantılar karşısında anı ağlarının dissosiyatif olarak bloke olması.",
            prognosis: "Güvenli terapi ortamında anılar kademeli olarak geri gelir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Otobiyografik Bellek Yitimi",
                content: "Genellikle travmatik ya da stresli nitelikteki önemli kişisel bilgileri anımsayamama hali (sıradan unutkanlıkla açıklanamaz)."
            },
            {
                code: "Belirleyici",
                title: "Dissosiyatif Füg ile Birlikte",
                content: "Amneziye kimlik karmaşası ve amaçlı ya da şaşkın bir biçimde yapılan yolculuk/seyahat eşlik ediyorsa bu belirleyici kullanılır."
            }
        ]
    },

    // 49. DEHB (ADHD)
    adhd: {
        id: "adhd",
        nameTr: "Dikkat Eksikliği ve Hiperaktivite Bozukluğu (DEHB)",
        nameEn: "Attention-Deficit/Hyperactivity Disorder (ADHD)",
        clinicalDescription: {
            overview: "Gelişimsel düzeye uygunsuz düzeyde dikkatsizlik, aşırı hareketlilik (hiperaktivite) ve dürtüsellik ile seyreden, belirtileri 12 yaşından önce başlayan ve birden fazla ortamda işlevselliği bozan nörogelişimsel bozukluktur.",
            epidemiology: "Çocuklarda %5-7, yetişkinlerde %2.5-4 civarındadır. Erkeklerde 2-3 kat sıktır.",
            etiology: "Prefrontal korteks ve bazal ganglionlarda dopamin/noradrenalin taşıyıcı disfonksiyonu; %75-80 kalıtılabilirlik.",
            prognosis: "Metilfenidat/Atomoksetin ve Davranışçı Terapi kombinasyonu ile akademik ve sosyal başarı belirgin artar."
        },
        criteriaList: [
            {
                code: "Kriter A1",
                title: "Dikkatsizlik Belirtileri (En az 6/9, yetişkinde en az 5/9)",
                content: "En az 6 ay süren dikkatsizlik belirtileri:",
                items: [
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
                code: "Kriter A2",
                title: "Hiperaktivite ve Dürtüsellik (En az 6/9, yetişkinde en az 5/9)",
                content: "En az 6 ay süren aşırı hareketlilik ve acelecilik:",
                items: [
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
                code: "Kriter B & C",
                title: "Başlangıç Yaşı (< 12 yaş) ve Çoklu Ortam",
                content: "Belirtiler 12 yaşından önce mevcuttur ve en az 2 farklı ortamda (ev, okul, iş) kendini gösterir."
            }
        ]
    },

    // 50. Otizm Spektrum (ASD)
    asd: {
        id: "asd",
        nameTr: "Otizm Açılımı Kapsamında Bozukluk",
        nameEn: "Autism Spectrum Disorder",
        clinicalDescription: {
            overview: "Erken gelişim evresinde başlayan; toplumsal iletişim ve etkileşimde süregiden yetersizlikler ile sınırlı, yineleyici davranışlar, ilgi alanları ve duyusal hassasiyetlerle karakterize nörogelişimsel tablodur.",
            epidemiology: "Yaygınlığı yaklaşık 1/54 çocuktur. Erkeklerde 4 kat daha sıktır.",
            etiology: "Karmaşık çok genli genetik mimari (%80 kalıtılabilirlik) ve sinaptik budanma anomalileri.",
            prognosis: "Erken Yoğun Davranışsal Müdahale (ABA) ve Özel Eğitim ile bağımsız yaşam becerileri kazandırılır."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Toplumsal İletişim ve Etkileşimde Yetersizlik (Tümü bulunmalı)",
                content: "1. Toplumsal-duygusal karşılıklılıkta yetersizlik (sohbet başlatamama/sürdürememe). 2. Sözel olmayan iletişimde yetersizlik (göz teması azlığı, mimik yoksunluğu). 3. İlişkileri geliştirme ve sürdürmede güçlük."
            },
            {
                code: "Kriter B",
                title: "Sınırlı ve Yineleyici Davranış Örüntüleri (En az 2/4)",
                content: "1. Basmakalıp motor hareketler, nesneleri sıraya dizme ya da ekolali. 2. Aynılıkta ısrar etme, rutinlere katı bağlılık. 3. Aşırı kısıtlı ve yoğun ilgi alanları. 4. Duyusal uyaranlara aşırı ya da az duyarlılık (ses, doku hassasiyeti)."
            }
        ]
    },

    // 51. KOKGB (ODD)
    odd: {
        id: "odd",
        nameTr: "Karşıt Olma Karşı Gelme Bozukluğu (KOKGB)",
        nameEn: "Oppositional Defiant Disorder (ODD)",
        clinicalDescription: {
            overview: "Çocuklarda otorite figürlerine karşı en az 6 ay süren öfkeli/kolay kızan duygudurum, tartışmacı/meydan okuyan davranış ve kin besleme örüntüsüdür. Davranım Bozukluğundan farkı ŞİDDET, HIRSIZLIK ve AĞIR HAK İHLALLERİNİN OLMAMASIDIR.",
            epidemiology: "Çocuklarda %3-5 civarındadır.",
            etiology: "Mizaçsal zorluklar ve tutarsız-sert ebeveyn tutumları.",
            prognosis: "Ebeveyn Yönetim Eğitimi (PMT) ile Davranım Bozukluğuna evrilmesi önlenir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Öfkeli ve Tartışmacı Tutum (En az 4/8 belirti, en az 6 ay)",
                content: "Aşağıdakilerden en az dördüyle belirlenen davranış örüntüsü:",
                items: [
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

    // 52. Davranım Bozukluğu
    conduct_disorder: {
        id: "conduct_disorder",
        nameTr: "Davranım Bozukluğu",
        nameEn: "Conduct Disorder",
        clinicalDescription: {
            overview: "18 yaşından küçük bireylerde başkalarının temel haklarının ya da yaşa uygun toplumsal kuralların çiğnendiği; insanlara/hayvanlara fiziksel saldırganlık, mala zarar verme (kundakçılık), hırsızlık ve ağır kural ihlalleriyle seyreden adli tablodur.",
            epidemiology: "Ergenlerde %4 civarındadır. Erkeklerde belirgin olarak sıktır.",
            etiology: "Kısıtlı prososyal duygular (empati yoksunluğu) ve çevresel risk faktörleri.",
            prognosis: "Tedavi edilmezse 18 yaşından sonra Antisosyal Kişilik Bozukluğuna dönüşür."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Ağır Hak İhlalleri (Son 12 ayda en az 3 belirti)",
                content: "1. İnsanlara ve hayvanlara saldırganlık (gözdağı verme, kavga başlatma, fiziksel acımasızlık, gasp). 2. Mala zarar verme (kasıtlı yangın çıkarma). 3. Dolandırıcılık ya da hırsızlık (ev/araba soyma). 4. Kuralları ağır biçimde çiğneme (gece evden kaçma, okuldan kaçma)."
            },
            {
                code: "Belirleyici",
                title: "Kısıtlı Prososyal Duygularla Birlikte",
                content: "Pişmanlık/suçluluk duymama, eşduyum (empati) yoksunluğu, başarıyı umursamama ve yüzeysel duygulanım."
            }
        ]
    },

    // 53. Tourette
    tourette: {
        id: "tourette",
        nameTr: "Tourette Bozukluğu",
        nameEn: "Tourette's Disorder",
        clinicalDescription: {
            overview: "Hastalık sırasında aynı anda olması gerekmese de hem ÇOK SAYIDA MOTOR TİK hem de EN AZ BİR VOKAL (sesil) TİKİN 1 yıldan uzun sürmesiyle karakterize nörogelişimsel tik bozukluğudur.",
            epidemiology: "Çocuklarda %0.5 - 1 arasındadır. Erkeklerde 3-4 kat sıktır.",
            etiology: "Bazal ganglionlar ve dopaminerjik regülasyon bozukluğu; yüksek kalıtılabilirlik.",
            prognosis: "CBIT (Tikler için Kapsamlı Davranışsal Müdahale) ve alfa-2 agonistleri (Klonidin) veya antipsikotikler etkilidir."
        },
        criteriaList: [
            {
                code: "Kriter A & B",
                title: "Çoklu Motor ve Sesil Tikler",
                content: "Hastalık sırasında hem çok sayıda motor tik hem de bir ya da birden fazla sesil (vokal) tik bulunmuştur (aynı anda ortaya çıkması gerekmez)."
            },
            {
                code: "Kriter C & D",
                title: "Süre (≥ 1 yıl) ve Başlangıç (< 18 yaş)",
                content: "Tikler ilk başladığından bu yana 1 yıldan uzun sürmüştür ve başlangıç 18 yaşından öncedir."
            }
        ]
    },

    // 54. Kleptomani
    kleptomania: {
        id: "kleptomania",
        nameTr: "Kleptomani (Çalma Hastalığı)",
        nameEn: "Kleptomania",
        clinicalDescription: {
            overview: "Kişisel kullanım ya da parasal değeri için gereksinilmeyen nesneleri çalmaya yönelik dürtülere karşı koyamama, eylem öncesi artan gerginlik ve eylem anında yoğun haz/rahatlama yaşamadır.",
            epidemiology: "Mağaza hırsızlarının yaklaşık %4-5'ini oluşturur. Kadınlarda 3 kat sıktır.",
            etiology: "Dürtü denetim defisiti ve opioid/dopamin ödül sistemi disregülasyonu.",
            prognosis: "BDT (Gizli duyarsızlaştırma) ve Naltrekson ile başarılı tedavi edilir."
        },
        criteriaList: [
            {
                code: "Kriter A & B & C",
                title: "Gereksinilmeyen Nesneleri Çalma ve Rahatlama",
                content: "Parasal değeri için gereksinilmeyen nesneleri çalma dürtüsüne karşı koyamama + Hırsızlıktan hemen önce artan gerginlik + Çalma eylemi anında haz, doyum ya da rahatlama duyma."
            },
            {
                code: "Kriter D & E",
                title: "Öfke/İntikam Dışlaması",
                content: "Çalma eylemi öfke göstermek ya da intikam almak amacıyla yapılmaz ve bir sanrıya bağlı değildir."
            }
        ]
    },

    // 55. Aralıklı Patlayıcı Bozukluk
    intermittent_explosive: {
        id: "intermittent_explosive",
        nameTr: "Aralıklı Patlayıcı Bozukluk",
        nameEn: "Intermittent Explosive Disorder",
        clinicalDescription: {
            overview: "Saldırgan dürtüleri denetleyememeyle giden yineleyen davranışsal öfke patlamaları ve durumun yarattığı kışkırtmayla tamamen orantısız sözel/fiziksel saldırganlık tablosudur.",
            epidemiology: "Yaşam boyu yaygınlığı %5-7 civarındadır. Erkeklerde ve gençlerde sıktır.",
            etiology: "Serotoninerjik iletim defisiti ve amigdala aşırı reaktivitesi.",
            prognosis: "BDT (Öfke yönetimi) ve duygudurum dengeleyiciler/SSRI ile saldırganlık azaltılır."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Yineleyen Davranışsal Patlamalar",
                content: "1. 3 ay boyunca haftada en az 2 kez fiziksel hasar vermeyen sözel/fiziksel agresyon VEYA 2. 12 ay içinde mala zarar veren ya da fiziksel yaralanmayla sonuçlanan 3 patlama."
            },
            {
                code: "Kriter B & C",
                title: "Orantısızlık ve Dürtüsellik",
                content: "Saldırganlığın derecesi tetikleyici olayla tamamen orantısızdır; patlamalar planlı değildir, dürtüseldir ve maddi çıkar gütmez. Yaş ≥ 6."
            }
        ]
    },

    // 56. Piromani
    pyromania: {
        id: "pyromania",
        nameTr: "Piromani (Yangın Çıkarma Hastalığı)",
        nameEn: "Pyromania",
        clinicalDescription: {
            overview: "Maddi çıkar, intikam ya da ideolojik amaç gütmeksizin birden çok kez kasıtlı yangın çıkarma; eylem öncesi gerginlik ve yangını çıkarırken/izlerken yoğun haz, doyum ve rahatlama yaşamadır.",
            epidemiology: "Çok nadir bir dürtü kontrol bozukluğudur. Erkeklerde belirgin olarak sıktır.",
            etiology: "Yangına büyülenme ve dürtü denetim defisiti.",
            prognosis: "BDT ve yangın güvenliği farkındalık eğitimi uygulanır."
        },
        criteriaList: [
            {
                code: "Kriter A & B & C",
                title: "Yangın Çıkarma, Gerginlik ve Haz",
                content: "Birden çok kez kasıtlı yangın çıkarma + Eylem öncesi gerginlik/duygusal uyarılma + Yangına, ekipmanlara ve sonuçlarına karşı büyülenme/çekim + Yangını çıkarırken haz/rahatlama."
            },
            {
                code: "Kriter D",
                title: "Maddi/İntikam Dışlaması",
                content: "Yangın çıkarma parasal kazanç, intikam ya da cezadan kaçma amacıyla yapılmaz."
            }
        ]
    },

    // 57. Kumar Oynama Bozukluğu
    gambling_disorder: {
        id: "gambling_disorder",
        nameTr: "Kumar Oynama Bozukluğu",
        nameEn: "Gambling Disorder",
        clinicalDescription: {
            overview: "Kişinin yaşamında belirgin işlev kaybına yol açan; tolerans (artan miktarlarda parayla oynama), yoksunluk (bırakınca huzursuzluk) ve kayıpları kovalamayla seyreden davranışsal bağımlılıktır.",
            epidemiology: "Yetişkinlerde %0.5 - 1 arasındadır. Erkeklerde daha sıktır.",
            etiology: "Madde bağımlılıklarıyla tamamen aynı dopaminerjik ventral striatum ödül devresi anomalisi.",
            prognosis: "Motivasyonel Görüşme, BDT (Adsız Kumarbazlar - GA) ve Naltrekson etkilidir."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Kumar Bağımlılığı Ölçütleri (12 ayda en az 4/9)",
                content: "Aşağıdakilerden en az dördüyle belirlenen sorunlu kumar davranışı:",
                items: [
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

    // 58. Alkol Kullanım Bozukluğu
    alcohol_use_disorder: {
        id: "alcohol_use_disorder",
        nameTr: "Alkol Kullanım Bozukluğu",
        nameEn: "Alcohol Use Disorder",
        clinicalDescription: {
            overview: "Kişinin belirgin sıkıntıya ve işlevsellik kaybına yol açacak şekilde kontrolsüzce alkol tüketmesi; tolerans, yoksunluk belirtileri (titreme, terleme), aşerme ve bırakma çabalarında başarısızlıkla karakterizedir.",
            epidemiology: "Yaşam boyu yaygınlığı erkeklerde %20, kadınlarda %8-10 civarındadır.",
            etiology: "GABAerjik ve glutamaterjik sistemlerde nöroadaptasyon, mezolimbik dopaminerjik ödül yolu aktivasyonu ve genetik yatkınlık.",
            prognosis: "Detoksifikasyon protokolü + Akamprosat/Naltrekson/Disülfiram + BDT ve Adsız Alkolikler (AA)."
        },
        criteriaList: [
            {
                code: "Kriter A",
                title: "Alkol Kullanım Örüntüsü (12 ayda en az 2/11)",
                content: "12 aylık bir dönem içinde aşağıdaki belirtilerden en az ikisinin bulunması:",
                items: [
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
                code: "Şiddet Belirleyicisi",
                title: "DSM-5 Şiddet Düzeyleri",
                content: "Hafif: 2-3 belirti, Orta: 4-5 belirti, Ağır: 6 ya da daha çok belirti."
            }
        ]
    }
};

const fileContent = `/**
 * PsikoVaka - Kapsamlı DSM-5 Tanı Kriterleri ve Klinik El Kitabı
 * Her tanı için ayrı ayrı:
 * 1. Detaylı Klinik Tanım & Psikopatoloji (Genel Bakış, Epidemiyoloji, Etiyoloji, Prognoz)
 * 2. Resmi DSM-5 Tanı Kriterleri (Kriter A, B, C, D, E ve Alt Maddeler ayrı kartlar halinde)
 */

const DSM5_MANUAL = ${JSON.stringify(DSM5_MANUAL, null, 4)};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DSM5_MANUAL };
}
`;

fs.writeFileSync(path.join(__dirname, 'js', 'dsm_manual.js'), fileContent, 'utf8');
console.log('Successfully generated js/dsm_manual.js with total entries:', Object.keys(DSM5_MANUAL).length);
