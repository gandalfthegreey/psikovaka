const fs = require('fs');
const path = require('path');

const manualAdditions = {
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
    }
};

const dsmManualPath = path.join(__dirname, 'js', 'dsm_manual.js');
let dsmContent = fs.readFileSync(dsmManualPath, 'utf8');

// Insert additions before `if (typeof module !== 'undefined' && module.exports)`
const exportIndex = dsmContent.lastIndexOf('if (typeof module !== \'undefined\'');
if (exportIndex !== -1) {
    let additionsStr = '';
    Object.keys(manualAdditions).forEach(key => {
        additionsStr += `,\n    "${key}": ${JSON.stringify(manualAdditions[key], null, 8)}`;
    });
    
    // Find the last closing brace before the export
    const lastBraceIndex = dsmContent.lastIndexOf('};', exportIndex);
    if (lastBraceIndex !== -1) {
        const before = dsmContent.slice(0, lastBraceIndex);
        const after = dsmContent.slice(lastBraceIndex);
        const newDsmContent = before + additionsStr + '\n' + after;
        fs.writeFileSync(dsmManualPath, newDsmContent, 'utf8');
        console.log('Successfully updated dsm_manual.js with all 15 new manual entries!');
    }
}
