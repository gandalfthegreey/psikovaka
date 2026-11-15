const fs = require('fs');
const path = require('path');

const manualPath = path.join(__dirname, 'js', 'dsm_manual.js');
const currentManual = require(manualPath).DSM5_MANUAL;

const newManualEntries110to150 = {
    "delusional_erotomanic": {
        id: "delusional_erotomanic",
        nameTr: "Sanrılı Bozukluk (Erotomanik Tip / Clérambault Sendromu)",
        nameEn: "Delusional Disorder (Erotomanic Type)",
        clinicalDescription: {
            overview: "Kişinin genellikle kendisinden daha yüksek toplumsal, mesleki veya ünlü statüdeki bir başkasının kendisine sırılsıklam aşık olduğuna dair sarsılmaz ve sistematize bir sanrı taşıdığı klinik tablodur (De Clérambault Sendromu). Sanrı alanı dışında genel işlevsellik ve davranışlar görece korunmuştur.",
            epidemiology: "Sanrılı bozuklukların yaşam boyu yaygınlığı yaklaşık %0.2'dir. Erotomanik alt tip kadınlarda daha sık görülürken, adli takip (stalking) vakalarında erkeklerin oranı yüksektir.",
            etiology: "Sosyal izolasyon, narsisistik yaralanmalara karşı geliştirilen yansıtma ve inkar savunmaları ile mezolimbik dopaminerjik aşırı aktivite rol oynar.",
            prognosis: "Kronik seyirlidir; CBTp, sınır koyma ve ikinci kuşak antipsikotiklerle sanrısal uğraş ve takip davranışları kontrol altına alınabilir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Erotomanik Sanrı Ölçütü (En az 1 ay)", content: "En az 1 ay ya da daha uzun süren, genellikle daha yüksek statüdeki başka bir kişinin kendisine aşık olduğuna ilişkin sarsılmaz sanrının varlığı." },
            { code: "Kriter B", title: "Şizofreni Dışlaması ve Korunmuş İşlevsellik", content: "Şizofreni A ölçütü hiçbir zaman karşılanmamıştır; sanrının doğrudan etkileri dışında işlevsellik belirgin olarak bozulmamıştır ve davranışlar garip/acayip değildir." }
        ]
    },
    "delusional_jealous": {
        id: "delusional_jealous",
        nameTr: "Sanrılı Bozukluk (Kıskançlık Tipi / Othello Sendromu)",
        nameEn: "Delusional Disorder (Jealous Type)",
        clinicalDescription: {
            overview: "Kişinin hiçbir nesnel kanıt olmaksızın eşinin veya cinsel partnerinin kendisini aldattığına (sadakatsiz olduğuna) kesin olarak inandığı sanrılı bozukluk alt tipidir (Othello Sendromu). Hasta rastlantısal küçük olayları 'ihanet kanıtı' olarak toplar ve eşini sürekli takip eder.",
            epidemiology: "Erkeklerde kadınlara oranla daha sık görülür. Ortalama başlangıç yaşı orta-ileri erişkinlik dönemidir.",
            etiology: "Yetersizlik ve cinsel güçsüzlük duygularının eşe yansıtılması (projeksiyon), sağ frontal lob işlev bozuklukları ve dopaminerjik disregülasyon etkilidir.",
            prognosis: "Adli psikiyatride eşe yönelik ağır şiddet ve eş cinayeti (homisid) riski en yüksek tablolardan biridir; antipsikotik tedavi ve eş güvenliği hayati önem taşır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Sadakatsizlik Sanrısı (En az 1 ay)", content: "En az 1 ay boyunca, eşinin ya da sevgilisinin sadakatsiz olduğuna ilişkin sarsılmaz ve kanıtsız sanrının bulunması." },
            { code: "Kriter B", title: "İzole Sanrı Sistemi", content: "Belirgin halüsinasyonlar veya dezorganize konuşma yoktur; sanrı alanı dışında bilişsel ve mesleki yetiler korunmuştur." }
        ]
    },
    "delusional_somatic": {
        id: "delusional_somatic",
        nameTr: "Sanrılı Bozukluk (Somatik Tip / Ekbom Sendromu)",
        nameEn: "Delusional Disorder (Somatic Type / Delusional Parasitosis)",
        clinicalDescription: {
            overview: "Sanrının temel içeriğinin bedensel işlevler veya duyumlarla ilgili olduğu tablodur. En sık görülen formu kişinin derisinin altında böceklerin, kurtçukların veya parazitlerin gezindiğine inandığı 'Delüzyonel Parazitoz' (Ekbom Sendromu) olup, hastalar deri döküntülerini kibrit kutusunda hekime kanıt diye getirirler (Matchbox Sign).",
            epidemiology: "Genellikle 50 yaş üzeri bireylerde ve kadınlarda daha sık görülür; hastalar psikiyatri yerine dermatoloji ve enfeksiyon kliniklerine başvurur.",
            etiology: "Taktil (dokunsal) duyusal parestezilerin striatal dopaminerjik disfonksiyon nedeniyle sanrısal düzeyde yanlış yorumlanması.",
            prognosis: "Antipsikotik tedaviye (Risperidon, Olanzapin, Pimozid) ve dermatoloji-psikiyatri işbirliğine iyi yanıt verir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Bedensel / Paraziter Sanrı (En az 1 ay)", content: "En az 1 ay süren; deri altında böcek/parazit bulunması, vücuttan kötü koku yayılması veya organların çalışmadığına dair sabit somatik sanrı." },
            { code: "Kriter B", title: "Tıbbi ve Madde Dışlaması", content: "Gerçek bir dermatolojik enfestasyon veya kokain/amfetamin intoksikasyonuna (formikasyon) bağlı değildir." }
        ]
    },
    "folie_a_deux": {
        id: "folie_a_deux",
        nameTr: "Paylaşılmış Psikotik Bozukluk (Folie à Deux)",
        nameEn: "Shared Psychotic Disorder (Folie à Deux)",
        clinicalDescription: {
            overview: "Yerleşik bir sanrısı olan baskın (primer/indükleyen) bir bireyle çok yakın, kapalı ve dış dünyadan izole bir ilişki içinde yaşayan daha pasif/bağımlı (sekonder/alıcı) bir kişide de birebir aynı sanrı sisteminin gelişmesi tablosudur.",
            epidemiology: "Nadir görülür; vakaların %90'ı aynı çekirdek aile içindedir (en sık iki kız kardeş, anne-çocuk veya karı-koca).",
            etiology: "Sosyal izolasyon, patolojik bağımlılık, özdeşim kurma ve baskın ortağın otoritesine boyun eğme dinamikleri rol oynar.",
            prognosis: "Sekonder (alıcı) hasta baskın psikotik kişiden fiziksel olarak ayrıldığında sanrıları hızla zayıflar ve çözülür."
        },
        criteriaList: [
            { code: "Kriter A", title: "Sanrı Aktarımı (İndüksiyon)", content: "Halihazırda yerleşik sanrısı olan baskın bir kişiyle yakın ve izole bir ilişki bağlamında ikinci kişide de aynı sanrının gelişmesi." },
            { code: "Kriter B", title: "Birincil Psikoz Dışlaması", content: "Bozukluk şizofreni veya psikotik özellikli duygudurum bozukluğu ile daha iyi açıklanamaz ve ayrıştırma ile geriler." }
        ]
    },
    "catatonia_associated": {
        id: "catatonia_associated",
        nameTr: "Başka Bir Ruhsal Bozuklukla İlişkili Katatoni",
        nameEn: "Catatonia Associated with Another Mental Disorder",
        clinicalDescription: {
            overview: "Psikomotor aktivitede aşırı ketlenme (stupor, mutizm, katalepsi, balmumu esnekliği, negativizm) ya da amaçsız aşırı uyarılma ve ekofenomenlerle (ekolali, ekopraksi) karakterize akut nöropsikiyatrik sendromdur.",
            epidemiology: "Yatan psikiyatri hastalarının %5-10'unda görülür; en sık Bipolar Bozukluk ve Majör Depresyonda, ikinci sıklıkta Şizofrenide ortaya çıkar.",
            etiology: "Fronto-striato-talamik motor devrelerde ağır GABA-A reseptör hipofonksiyonu ve glutamat hiperaktivitesi.",
            prognosis: "IV Lorazepam (Benzodiazepin) testi ve Elektrokonvülsif Terapi (EKT) ile %85-90 oranında dramatik ve hayat kurtarıcı düzelme sağlanır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Psikomotor Katatoni Bulguları (En az 3/12 belirti)", content: "Stupor, katalepsi, balmumu esnekliği (cerea flexibilitas), mutizm, negativizm, postür alma, manyerizm, stereotipi, ajitasyon, grimas, ekolali veya ekopraksi belirtilerinden en az 3'ünün varlığı." },
            { code: "Kriter B", title: "Klinik Önem ve Komplikasyon Riski", content: "Dehidratasyon, malnütrisyon, pulmoner emboli veya otonomik instabilite (malign katatoni) riski nedeniyle acil müdahale gerektirir." }
        ]
    },
    "bipolar_2": {
        id: "bipolar_2",
        nameTr: "Bipolar II Bozukluğu (Hipomani ve Majör Depresyon)",
        nameEn: "Bipolar II Disorder",
        clinicalDescription: {
            overview: "Yaşam boyu en az bir kez Hipomanik Epizod (en az 4 gün süren kabarmış duygudurum ve enerji artışı) ve en az bir kez Majör Depresif Epizod (en az 2 hafta) geçirilmesiyle tanımlanan bozukluktur. Bipolar I'den temel farkı, hiçbir zaman tam bir Manik Epizod yaşanmamış olmasıdır.",
            epidemiology: "Yaşam boyu yaygınlığı %0.5 - %1.5 arasındadır; kadınlarda daha sık görülür.",
            etiology: "Güçlü genetik yatkınlık, sirkadiyen ritim disregülasyonu ve monoaminerjik dalgalanmalar.",
            prognosis: "Hastalar yaşamlarının büyük bölümünü ağır depresif fazda geçirirler; IPSRT ve Lamotrijin/Ketiapin/Lityum ile stabilize edilir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Hipomanik ve Majör Depresif Epizod Varlığı", content: "En az bir Hipomanik Epizod (≥4 gün, yatış ve psikoz içermeyen) ve en az bir Majör Depresif Epizod (≥2 hafta) ölçütlerinin karşılanmış olması." },
            { code: "Kriter B", title: "Manik Epizod Dışlaması", content: "Kişi yaşamı boyunca HİÇBİR ZAMAN tam bir Manik Epizod geçirmemiştir." }
        ]
    },
    "bipolar_1_rapid_cycling": {
        id: "bipolar_1_rapid_cycling",
        nameTr: "Bipolar I Bozukluğu (Hızlı Döngülü Tip / Rapid Cycling)",
        nameEn: "Bipolar I Disorder with Rapid Cycling",
        clinicalDescription: {
            overview: "Son 12 ay (1 yıl) içinde mani, hipomani ya da majör depresyon tanı ölçütlerini tam karşılayan en az 4 ayrı duygudurum epizodunun yaşanmasıyla tanımlanan, tedaviye dirençli seyreden bipolar seyir belirtecidir.",
            epidemiology: "Bipolar hastaların yaklaşık %10-20'sinde gelişir; kadınlarda, Bipolar II'de ve hipotiroidisi olanlarda çok daha sıktır.",
            etiology: "Uygunsuz ve aşırı antidepresan (SSRI/SNRI/Trisiklik) kullanımı, hipotiroidi, uyku-uyanıklık düzensizliği ve biyolojik saat gen polimorfizmleri.",
            prognosis: "Antidepresanların derhal kesilmesi, tiroid tedavisi ve Valproat/Lamotrijin/Ketiapin ile döngü hızı yavaşlatılır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Yılda En Az 4 Epizod Ölçütü", content: "Son 12 ay içinde mani, hipomani veya majör depresyon kriterlerini karşılayan en az 4 ayrı duygudurum döneminin bulunması." },
            { code: "Kriter B", title: "Remisyon veya Kutup Değişimi", content: "Dönemler birbirinden en az 2 ay süren kısmi/tam yatışma ile ayrılır ya da doğrudan karşıt kutba (örn. depresyondan maniye) geçiş olur." }
        ]
    },
    "mdd_with_peripartum": {
        id: "mdd_with_peripartum",
        nameTr: "Peripartum (Doğum Sonrası / Postpartum) Başlangıçlı Depresyon",
        nameEn: "Major Depressive Disorder with Peripartum Onset",
        clinicalDescription: {
            overview: "Gebelik sırasında ya da doğumdan sonraki ilk 4 hafta içinde başlayan majör depresif epizod tablosudur. Ağır keder, bebeğe bağlanamama, 'Ben kötü bir anneyim' suçluluğu, aşırı kaygı ve uykusuzlukla seyreder.",
            epidemiology: "Doğum yapan kadınların yaklaşık %10-15'inde görülür; vakaların yarısı aslında gebelik sırasında başlar.",
            etiology: "Doğum sonrası östrojen, progesteron ve allopregnanolon (GABAerjik nörosteroid) düzeylerindeki ani çöküş ve rol geçişi stresi.",
            prognosis: "Kişilerarası İlişkiler Terapisi (IPT), Sertralin ve Breksanolon/Zuranolon ile anne ve bebek sağlığı hızla korunur."
        },
        criteriaList: [
            { code: "Kriter A", title: "Gebelik veya Doğum Sonrası İlk 4 Hafta Başlangıcı", content: "Majör depresyon belirtilerinin gebelik sırasında ya da doğumdan sonraki ilk 4 hafta içinde başlaması." },
            { code: "Kriter B", title: "Annelik Hüznünden (Baby Blues) Ayrım", content: "İlk 10-14 günde kendiliğinden geçen hafif annelik hüznünden farklı olarak en az 2 hafta sürer ve ağır işlev kaybı yaratır." }
        ]
    },
    "mdd_with_atypical": {
        id: "mdd_with_atypical",
        nameTr: "Atipik Özellikli Majör Depresif Bozukluk",
        nameEn: "Major Depressive Disorder with Atypical Features",
        clinicalDescription: {
            overview: "Olumlu olaylar karşısında neşelenebilme (duygudurum tepkiselliği) ile birlikte klasik depresyonun tersine aşırı uyuma (hipersomni), aşırı yeme/kilo alımı (karbonhidrat aşermesi), kol ve bacaklarda kurşun gibi ağırlık hissi (kurşun felci) ve reddedilme duyarlılığı ile seyreden depresyon tipidir.",
            epidemiology: "Depresyon vakalarının %15-30'unu oluşturur; genç kadınlarda ve Bipolar II depresyonunda oldukça sıktır.",
            etiology: "Klasik depresyondaki CRH/kortizol yüksekliğinin aksine HPA ekseni hipoaktivitesi ve serotonerjik/dopaminerjik düşüş.",
            prognosis: "Davranışsal Aktivasyon, SSRI, Bupropion ve klasik olarak MAO İnhibitörlerine (Moklobemid) çok iyi yanıt verir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Duygudurum Tepkiselliği (Zorunlu Kriter)", content: "Olumlu gerçek ya da potansiyel olaylar karşısında duygudurumun açılması ve neşelenebilmesi." },
            { code: "Kriter B", title: "Eşlik Eden Vejetatif ve Kişilerarası Bulgular (En az 2/4)", content: "1) Belirgin kilo alımı veya iştah artışı, 2) Hipersomni (günde ≥10 saat uyku), 3) Kurşun felci (kollarda/bacaklarda ağırlık), 4) Kişilerarası reddedilme duyarlılığı." }
        ]
    },
    "mdd_with_melancholic": {
        id: "mdd_with_melancholic",
        nameTr: "Melankolik Özellikli Majör Depresif Bozukluk",
        nameEn: "Major Depressive Disorder with Melancholic Features",
        clinicalDescription: {
            overview: "Tüm etkinliklerden zevk alma yetisinin tamamen kaybolması (tam anhedoni) ve en sevindirici haberlere bile tepki verememe ile karakterize, biyolojik/endojen yönü en ağır depresyon alt tipidir. Sabahları erken uyanma, sabah saatlerinde depresyonun en ağır olması, psikomotor retardasyon ve ciddi kilo kaybı tipiktir.",
            epidemiology: "İleri yaşta, yatan hastalarda ve psikotik depresyon sınırındaki ağır vakalarda sık görülür.",
            etiology: "HPA ekseni hiperaktivitesi (deksametazon baskılama testi bozukluğu), REM latansı kısalması ve ağır noradrenerjik/serotonerjik çöküş.",
            prognosis: "Plaseboya yanıt vermez; SNRI, Trisiklik antidepresanlar ve EKT (Elektrokonvülsif Terapi) ile yüksek remisyon sağlanır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Tam Anhedoni ve Tepkisizlik", content: "Hemen tüm etkinliklere karşı zevkin kaybolması VE normalde iyi hissettirecek uyaranlara karşı duygudurum tepkiselliğinin tamamen yitirilmesi." },
            { code: "Kriter B", title: "Karakteristik Melankolik Bulgular (En az 3/6)", content: "Boşluk/umutsuzluk niteliğinde keder, sabahları düzenli olarak daha kötü olma, sabah erken uyanma (≥2 saat önce), belirgin psikomotor yavaşlama/ajitasyon, belirgin anoreksi/kilo kaybı, aşırı suçluluk." }
        ]
    },
    "specific_phobia_blood": {
        id: "specific_phobia_blood",
        nameTr: "Özgül Fobi (Kan-Enjeksiyon-Yara Tipi / Vazovagal)",
        nameEn: "Specific Phobia (Blood-Injection-Injury Type)",
        clinicalDescription: {
            overview: "Kan görme, iğne/enjeksiyon yaptırma veya invaziv tıbbi işlemlere karşı duyulan aşırı korku ve kaçınma tablosudur. Diğer tüm fobilerden farklı olarak 'bifazik otonomik yanıt' (önce kısa taşikardi, ardından ani vagal bradikardi ve tansiyon düşüşüyle bayılma/senkop) görülür.",
            epidemiology: "Toplumda yaygınlığı %3-4'tür ve tüm özgül fobiler içinde ailesel/genetik geçişi en güçlü olandır (%60-70).",
            etiology: "Evrimsel aşırı gelişmiş vazovagal refleks ve travmatik tıbbi işlem koşullanmaları.",
            prognosis: "Gevşeme değil, 'Uygulamalı Kas Gerdirme' (Applied Tension - Öst protokolü) ve kademeli maruz bırakma ile birkaç seansta tam düzelir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Kan ve İğne Korkusu (En az 6 ay)", content: "En az 6 aydır süren, kan, enjeksiyon veya yaralanma uyaranlarıyla karşılaşıldığında ortaya çıkan yoğun korku ve vazovagal senkop eğilimi." },
            { code: "Kriter B", title: "Tıbbi İşlemlerden Kaçınma", content: "Korku nedeniyle hastaneye gitmekten ve kan tahlili yaptırmaktan aktif olarak kaçınma." }
        ]
    },
    "specific_phobia_emetophobia": {
        id: "specific_phobia_emetophobia",
        nameTr: "Özgül Fobi (Kusma Korkusu / Emetofobi)",
        nameEn: "Specific Phobia (Emetophobia)",
        clinicalDescription: {
            overview: "Kişinin kendisinin kusmasından ya da bir başkasının kustuğunu görmekten/duymaktan aşırı ve mantıksız düzeyde korkmasıdır. Hastalar kusma ihtimalini sıfırlamak için dışarıda yemek yemez, porsiyonlarını aşırı kısıtlar ve sürekli bulantı ilacı taşır.",
            epidemiology: "Kadınlarda erkeklere oranla 4 kat daha sık görülür; genellikle çocukluk veya erken ergenlikte başlar.",
            etiology: "Çocuklukta yaşanan travmatik ve kontrolsüz kusma/gastroenterit deneyimleri ile interoseptif aşırı duyarlılık.",
            prognosis: "İnteroseptif ve canlı maruz bırakma BDT'si ile güvenlik arama davranışlarının söndürülmesiyle yüksek başarı sağlanır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Kusma Eylemine Özgü Fobik Kaygı", content: "En az 6 aydır devam eden, kusma veya bulantı duyumlarına karşı orantısız ve yoğun korku." },
            { code: "Kriter B", title: "Beden İmajı Bozukluğu Olmadan Gıda Kısıtlaması", content: "Zayıflama amacı olmaksızın sadece kusmayı önlemek için yiyecek kısıtlama, sosyal ortamlardan kaçınma ve işlev kaybı." }
        ]
    },
    "social_anxiety_performance": {
        id: "social_anxiety_performance",
        nameTr: "Sosyal Anksiyete Bozukluğu (Yalnızca Performans Tipi)",
        nameEn: "Social Anxiety Disorder (Performance Only)",
        clinicalDescription: {
            overview: "Korkunun yalnızca topluluk önünde konuşma, sunum yapma veya sahnede performans sergileme (müzisyenler, sporcular, akademisyenler) durumlarıyla sınırlı olduğu sosyal fobi alt tipidir. Kişi günlük sosyal sohbetlerde ve tanışmalarda hiçbir kaygı yaşamaz.",
            epidemiology: "Profesyonel sahne sanatçıları, müzisyenler ve konuşmacılar arasında yaygınlığı %15-25'e kadar çıkar.",
            etiology: "Performans sırasında el titremesi veya ses titremesinin izleyiciler tarafından fark edilip rezil olacağına dair felaketleştirici bilişler ve sempatik deşarj.",
            prognosis: "BDT (dikkat eğitimi ve maruz bırakma) ve performanstan 1 saat önce alınan tek doz Propranolol (Beta-bloker) ile tam kontrol sağlanır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Sadece Sahne ve Sunum Korkusu (En az 6 ay)", content: "Olumsuz değerlendirilme korkusunun yalnızca topluluk önünde konuşma ya da performans gösterme ile sınırlı olması." },
            { code: "Kriter B", title: "Genel Sosyal Etkileşimlerin Korunması", content: "Performans dışı sosyal ortamlarda (partiler, birebir sohbet, yemek yeme) kişinin hiçbir korku veya kaçınma yaşamaması." }
        ]
    },
    "muscle_dysmorphia": {
        id: "muscle_dysmorphia",
        nameTr: "Beden Algısı Bozukluğu (Kas Dismorfisi / Bigoreksiya)",
        nameEn: "Muscle Dysmorphia (Bigorexia)",
        clinicalDescription: {
            overview: "DSM-5'te Beden Algısı Bozukluğunun bir alt belirteci olan Kas Dismorfisinde, kişi gerçekte normal ya da aşırı kaslı bir vücuda sahip olmasına rağmen bedeninin 'çok küçük, cılız ve yetersiz kaslı' olduğu saplantısıyla yaşar.",
            epidemiology: "Neredeyse tamamen erkeklerde ve özellikle vücut geliştirme/ağırlık sporlarıyla uğraşan genç erkeklerde görülür.",
            etiology: "Mükemmeliyetçi erkeklik/güç şemaları, görsel beden işleme devrelerinde bozukluk ve OKB spektrumu genetik yatkınlığı.",
            prognosis: "ERP (ayna kontrolü ve kamuflajı bırakma), BDT ve yüksek doz SSRI ile tedavi edilir; anabolik steroid kötüye kullanımı mutlaka durdurulmalıdır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Yetersiz Kaslılık Saplantısı", content: "Kişinin objektif olarak kaslı olmasına karşın vücut yapısının çok küçük ya da yeterince kaslı olmadığı düşüncesiyle aşırı zihinsel uğraşı." },
            { code: "Kriter B", title: "Kompulsif Antrenman ve Kontrol Ritüelleri", content: "Sürekli ayna kontrolü, bol kıyafetlerle kamuflaj, sosyal yaşamı feda edecek düzeyde ağırlık çalışma ve tehlikeli steroid kullanımı." }
        ]
    },
    "pandas_syndrome": {
        id: "pandas_syndrome",
        nameTr: "PANDAS / PANS (Pediatrik Otoimmün Nöropsikiyatrik OKB)",
        nameEn: "PANDAS (Pediatric Autoimmune Neuropsychiatric Disorder Associated with Strep)",
        clinicalDescription: {
            overview: "Çocuklarda A Grubu Beta Hemolitik Streptokok (boğaz enfeksiyonu/kızıl) sonrasında bazal ganglionlara karşı gelişen otoimmün antikorlar nedeniyle 'bir gecede / yıldırım hızıyla' başlayan şiddetli OKB, tikler, ayrılık anksiyetesi ve el yazısı bozulması (disgrafi) sendromudur.",
            epidemiology: "3 yaş ile ergenlik (puberte) arasındaki çocuklarda görülür; erkek çocuklarda daha sıktır.",
            etiology: "Moleküler benzerlik (molecular mimicry): Streptokok bakterisine karşı üretilen antikorların kaudat ve putamen nöronlarıyla çapraz reaksiyona girmesi.",
            prognosis: "Erken antibiyotik tedavisi, anti-inflamatuar/immünomodülatör destek ve ERP terapisi ile tam iyileşme sağlanır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Streptokok Sonrası Yıldırım Başlangıç", content: "Prepüberal dönemde GAS (Streptokok) enfeksiyonu sonrasında 24-48 saat içinde dramatik ve akut olarak başlayan OKB ve/veya tik bozukluğu." },
            { code: "Kriter B", title: "Eşlik Eden Nöropsikiyatrik Bulgular", content: "Akut el yazısı bozulması (disgrafi), koreiform parmak hareketleri, sık idrara çıkma (enürezis) ve şiddetli ayrılık anksiyetesi." }
        ]
    },
    "ocd_taboo_thoughts": {
        id: "ocd_taboo_thoughts",
        nameTr: "OKB (Tabu Düşünceler: Dini Vesvese / Cinsel / Saldırganlık)",
        nameEn: "OCD (Taboo / Unacceptable Intrusive Thoughts)",
        clinicalDescription: {
            overview: "Kişinin ahlaki ve insani değerlerine tamamen zıt (egodistonik) olan; sevdiklerine zarar verme (bıçaklama, balkondan atma), dini kutsallara küfretme (dini vesvese) veya uygunsuz cinsel imgeler içeren istenmeyen intruzif düşünceler ve bunları silmek için yapılan zihinsel ritüellerle seyreden OKB formudur.",
            epidemiology: "OKB hastalarının yaklaşık %25-30'unda birincil tema kabul edilemez tabu düşüncelerdir.",
            etiology: "Düşünce-Eylem Kaynaşması (Thought-Action Fusion: 'Aklıma geldiyse demek ki yapmak istiyorum veya günahkarım' yanılgısı) ve aşırı sorumluluk şeması.",
            prognosis: "İmajinal ve canlı ERP (kaçınmaları ve zihinsel nötralizasyonu bırakma) ile yüksek doz SSRI tedavisine mükemmel yanıt verir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Egodistonik Tabu Obsesyonlar", content: "Kişide yoğun dehşet ve suçluluk yaratan saldırganlık, dini küfür veya cinsel içerikli istenmeyen intruzif düşünceler/imgeler." },
            { code: "Kriter B", title: "Örtük Zihinsel Kompulsiyonlar ve Kaçınma", content: "Dışarıdan görünmeyen sessiz dua/sayma/nötralizasyon ritüelleri, bıçakları saklama, sevdikleriyle yalnız kalmaktan kaçınma ve sürekli güvence arama." }
        ]
    },
    "reactive_attachment_disorder": {
        id: "reactive_attachment_disorder",
        nameTr: "Tepkisel Bağlanma Bozukluğu (RAD)",
        nameEn: "Reactive Attachment Disorder",
        clinicalDescription: {
            overview: "Yaşamın ilk yıllarında ağır duygusal ihmal veya sık değişen kurum bakımı yaşayan çocuklarda gelişen; yetişkin bakımverenlere karşı içe kapanık, duygusal olarak ketlenmiş davranma ve canı yandığında/korktuğunda bile kimseden teselli (avutulma) aramama tablosudur.",
            epidemiology: "Ağır ihmal görmüş ve kurum bakımındaki çocukların bile %10'undan azında görülür.",
            etiology: "Yaşamın ilk 2 yılında temel güven ve bağlanma figürünün yokluğu (patojenik bakım).",
            prognosis: "Duyarlı, sıcak ve kalıcı bir koruyucu aile/bakım çevresi sağlandığında çocukta güvenli bağlanma hızla yeniden inşa edilir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Ketlenmiş Bağlanma ve Avutulma Aramama", content: "Sıkıntılı olduğunda nadiren avutulma arayışında olma ve avutulmaya tepki vermeme; olumlu duygulanım azlığı ve korku/üzüntü nöbetleri." },
            { code: "Kriter B", title: "Ağır İhmal Öyküsü ve OSB Dışlaması", content: "Temel duygusal gereksinimlerin sürekli karşılanmadığı ağır ihmal öyküsü vardır; Otizm Spektrum Bozukluğu ölçütleri karşılanmaz (5 yaş öncesi başlar)." }
        ]
    },
    "disinhibited_social_engagement": {
        id: "disinhibited_social_engagement",
        nameTr: "Sınırsız Toplumsal Katılım Bozukluğu (DSED)",
        nameEn: "Disinhibited Social Engagement Disorder",
        clinicalDescription: {
            overview: "Erken çocukluk dönemindeki ağır ihmal ve bakım eksikliği sonucunda gelişen; çocuğun hiç yabancılık çekmeden ilk kez gördüğü yabancı yetişkinlerin kucağına oturması, sarılması ve bakımverenine bakmadan yabancılarla çekip gitmeye hazır olması tablosudur.",
            epidemiology: "Kurum bakımında büyüyen çocukların yaklaşık %20'sinde görülür.",
            etiology: "İlk 2 yıldaki sosyal ihmal ve sık bakıcı değişiminin amigdala tabanlı yabancı korkusu (stranger anxiety) gelişimini bozması.",
            prognosis: "Kalıcı aile bakımı, sosyal sınır eğitimi ve ebeveyn rehberliği ile yabancılarla güvenli mesafe kuralları öğretilir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Yabancılara Sınırsız Yaklaşma", content: "Yabancı yetişkinlere yaklaşmada çekingenlik olmaması, aşırı teklifsiz sözel/fiziksel yakınlık ve yabancıyla tereddütsüz çekip gitme." },
            { code: "Kriter B", title: "Patojenik Bakım Öyküsü", content: "Ağır sosyal ihmal, yoksunluk veya sürekli değişen bakıcı öyküsü (Gelişimsel yaş en az 9 ay olmalıdır)." }
        ]
    },
    "dissociative_fugue": {
        id: "dissociative_fugue",
        nameTr: "Dissosiyatif Füg (Kaçış ve Kimlik Kaybı)",
        nameEn: "Dissociative Amnesia with Dissociative Fugue",
        clinicalDescription: {
            overview: "Ağır bir travmatik veya yıkıcı stresör sonrasında kişinin kendi adını, kimliğini ve geçmişini tamamen unutarak (otobiyografik amnezi) evinden ve şehrinden ayrılması, başka bir şehre amaçlı yolculuk yapması veya bazen yeni bir kimlik benimsemesi tablosudur.",
            epidemiology: "Dissosiyatif amnezinin en dramatik ve nadir alt tipidir; savaş, doğal afet, ağır finansal iflas veya evlilik yıkımlarında görülür.",
            etiology: "Dayanılmaz suçluluk, utanç veya travmadan hem zihinsel (amnezi) hem fiziksel (yolculuk) olarak radikal dissosiyatif kaçış.",
            prognosis: "Çoğu füg birkaç gün veya hafta içinde kendiliğinden çözülür; Faz Odaklı Travma Terapisi ile anılar bütünleştirilir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Kişisel Kimlik Amnezisi", content: "Kişinin kendi adını, ailesini ve kişisel geçmişini anımsayamaması (semantik/genel dünya bilgisi korunmuştur)." },
            { code: "Kriter B", title: "Amaçlı Yolculuk (Füg)", content: "Evden veya işyerinden beklenmedik biçimde ayrılıp başka bir yere amaçlı yolculuk yapma ya da şaşkın bir biçimde dolaşma." }
        ]
    },
    "conversion_seizures": {
        id: "conversion_seizures",
        nameTr: "Konversiyon Bozukluğu (Psödonöbet / PNES)",
        nameEn: "Conversion Disorder (Attacks or Seizures / PNES)",
        clinicalDescription: {
            overview: "Epileptik nöbete benzeyen ancak beyinde hiçbir anormal elektriksel deşarj olmadan, tamamen bilinçdışı psikolojik stres ve çatışmaların bedensel kasılma/sarsılma nöbetine dönüştürülmesiyle oluşan tablodur (Psikojenik Non-Epileptik Nöbet - PNES).",
            epidemiology: "Epilepsi merkezlerine 'ilaca dirençli epilepsi' diye sevk edilen hastaların %20-30'u gerçekte PNES'tir; genç kadınlarda 3 kat sıktır.",
            etiology: "Bilinçdışı duygusal çatışma veya travmanın sözel ifade edilemeyip motor-dissosiyatif deşarjla dışavurulması (birincil kazanç).",
            prognosis: "Tanının empatik açıklanması, gereksiz antiepileptiklerin kesilmesi ve PNES odaklı BDT ile nöbetler kontrol altına alınır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Epilepsi Benzeri Nöbetler ve Klinik Uyumsuzluk", content: "Nöbet sırasında gözlerin sımsıkı kapalı olması ve açmaya direnç, başı sağa-sola sallama, asenkron ekstremite hareketleri ve postiktal konfüzyon olmaması." },
            { code: "Kriter B", title: "Video-EEG'de Normal Alfa Ritmi (Altın Standart)", content: "Eşzamanlı Video-EEG kaydında hasta nöbet geçirirken epileptiform deşarj olmaması ve normal uyanıklık dalgalarının görülmesi." }
        ]
    },
    "factitious_another": {
        id: "factitious_another",
        nameTr: "Yapay Bozukluk (Başkasına Yüklenen / Münchausen by Proxy)",
        nameEn: "Factitious Disorder Imposed on Another (Münchausen by Proxy)",
        clinicalDescription: {
            overview: "Bir bakımverenin (neredeyse her zaman annenin), dışsal maddi bir çıkar olmaksızın sadece doktorlardan ilgi görmek ve 'fedakar, kahraman anne' rolünü oynamak için kendi çocuğunda gizlice hastalık üretmesi (kan/dışkı bulaştırma, insülin/ilaç enjekte etme, boğma) tablosudur.",
            epidemiology: "Pediatri servislerinde açıklanamayan tekrarlayıcı tablolarda görülür; çocukta ölüm (mortalite) oranı %6-10'dur.",
            etiology: "Bakımverende ağır erken dönem terk edilme travmaları, sınırda/narsisistik kişilik patolojisi ve hastane ortamından beslenme ihtiyacı.",
            prognosis: "Adli olarak ağır bir çocuk istismarıdır; ilk adım çocuğun derhal devlet korumasına alınması ve adli bildirimdir (DSM-5 tanısı faile konur)."
        },
        criteriaList: [
            { code: "Kriter A", title: "Başkasında Kasıtlı Hastalık Üretme", content: "Başka bir bireyde (çocukta) fiziksel ya da ruhsal belirtileri kasıtlı olarak üretme, laboratuvar örneklerini bozma ve onu hasta olarak sunma." },
            { code: "Kriter B", title: "Dışsal Kazanç Yokluğu", content: "Maddi kazanç veya tazminat gibi dışsal bir ödül olmaksızın aldatma davranışının sürdürülmesi (Tanı mağdura değil, faile konur)." }
        ]
    },
    "rumination_disorder": {
        id: "rumination_disorder",
        nameTr: "Geri Çıkarma (Geviş Getirme / Ruminasyon) Bozukluğu",
        nameEn: "Rumination Disorder",
        clinicalDescription: {
            overview: "Yutulan yiyeceklerin yemekten kısa süre sonra hiçbir mide bulantısı, öğürme veya iğrenme olmaksızın zahmetsizce ağza geri getirilmesi (regürjitasyon), ağzın içinde tekrar çiğnenmesi ve yeniden yutulması ya da tükürülmesi tablosudur.",
            epidemiology: "Bebeklerde, okul çağı çocuklarında ve zihinsel yetiyitimi olan bireylerde daha sık görülür.",
            etiology: "Stres altında kendini yatıştırma amacıyla öğrenilmiş bilinçdışı diyafram ve karın duvarı kası kasılması.",
            prognosis: "Yemek sonrası derin diyafram nefesi eğitimi (Alışkanlığı Tersine Çevirme / HRT) ile %85 üzerinde tam iyileşme sağlanır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Öğürmesiz Yiyecek Geri Getirme (En az 1 ay)", content: "En az 1 ay boyunca yutulan yiyeceklerin bulantı veya öğürme olmadan ağza geri getirilip yeniden çiğnenmesi veya yutulması." },
            { code: "Kriter B", title: "Gastrointestinal ve Yeme Bozukluğu Dışlaması", content: "Gastroözofageal reflü (GÖRH) veya pilor stenozuna bağlı değildir; yalnızca anoreksiya/bulimiya seyri sırasında ortaya çıkmaz." }
        ]
    },
    "night_eating_syndrome": {
        id: "night_eating_syndrome",
        nameTr: "Gece Yeme Sendromu",
        nameEn: "Night Eating Syndrome",
        clinicalDescription: {
            overview: "Sirkadiyen yeme ritminin geceye kayması sonucu; sabahları belirgin iştahsızlık (sabah anoreksisi), akşam yemeğinden sonra günlük kalorinin %25'inden fazlasını tüketme ve gece uykudan tam bilinçli olarak uyanıp yemek yemeden tekrar uyuyamama sendromudur.",
            epidemiology: "Genel toplumda %1.5, obezite kliniklerinde ise %10-15 oranında görülür.",
            etiology: "Gece melatonin ve leptin yükselişinin körelmesi, kortizol yüksekliği ve 'yemezsem uyuyamam' bilişsel şartlanması.",
            prognosis: "CBT-E, gündüz öğün planlaması ve Sertralin (SSRI) tedavisi ile gece uyanıp yeme döngüsü başarıyla kırılır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Gece Uyanıp Yeme ve Akşam Hiperfajisi", content: "Uykudan uyanarak yemek yeme ya da akşam yemeğinden sonra aşırı gıda tüketimi ile birlikte sabah iştahsızlığı." },
            { code: "Kriter B", title: "Tam Farkındalık ve Hatırlama", content: "Uyurgezerlikten (SRED) farklı olarak kişi gece yeme atağı sırasında tamamen uyanıktır ve sabah ne yediğini net olarak hatırlar." }
        ]
    },
    "orthorexia_nervosa": {
        id: "orthorexia_nervosa",
        nameTr: "Ortoreksiya Nervoza (Sağlıklı ve Saf Beslenme Takıntısı)",
        nameEn: "Orthorexia Nervosa",
        clinicalDescription: {
            overview: "Yiyeceklerin miktarından (kalori/kilo) ziyade 'saflığı, temizliği ve sağlıklılığı' üzerine patolojik düzeyde obsesif kafa yorma tablosudur. Kişi katkılı, pişmiş veya organik olmayan tüm gıdaları 'kirli/zehirli' diyerek hayatından çıkarır ve ağır beslenme eksiklikleri ile sosyal izolasyon yaşar.",
            epidemiology: "Sağlık çalışanları, diyetisyenler, sporcular ve sosyal medya sağlıklı yaşam takipçilerinde sıklığı hızla artmaktadır.",
            etiology: "OKB spektrumu mükemmeliyetçiliği, kontrol ihtiyacı ve bedensel saflık üzerinden ahlaki üstünlük kurma şemaları.",
            prognosis: "CBT-E ve ERP (yasaklı besinlere kademeli maruz bırakma) ile katı gıda kuralları esnetilir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Besin Saflığına Patolojik Saplantı", content: "Günün saatlerini gıda içeriği ve saflığını incelemeye harcama; 'saf olmayan' gıda tüketildiğinde yoğun suçluluk ve cezalandırıcı detoks uygulama." },
            { code: "Kriter B", title: "Kilo Kaygısı Olmadan Malnütrisyon ve İzolasyon", content: "Zayıflama amacı olmaksızın besin gruplarının elenmesine bağlı vitamin/mineral eksiklikleri ve başkalarının yaptığı yemekleri yiyememe." }
        ]
    },
    "enuresis_nocturna": {
        id: "enuresis_nocturna",
        nameTr: "Enürezis Nokturna (Gece Altını Islatma)",
        nameEn: "Enuresis (Nocturnal Only)",
        clinicalDescription: {
            overview: "Takvim ve gelişim yaşı en az 5 olan bir çocukta, gece uykusu sırasında istemsiz olarak yatağa idrar kaçırma tablosudur. Çocuğun hiç kuru kalmadığı tipe 'Primer (Birincil)', en az 6 ay kuru kaldıktan sonra stresle tekrar başlayan tipe 'Sekonder (İkincil)' Enürezis denir.",
            epidemiology: "5 yaşındaki çocukların %15-20'sinde, 7 yaşındakilerin %10'unda görülür; erkek çocuklarda 2 kat daha sıktır.",
            etiology: "Güçlü genetik geçiş (%70), gece ADH (vazopressin) salınım düşüklüğü, fonksiyonel mesane kapasitesi küçüklüğü ve derin uykudan uyanma eşiği yüksekliği.",
            prognosis: "Her yıl %15 kendiliğinden düzelir; Enürezis Alarmı (Zil ve Ped) en kalıcı kür sağlayan altın standart tedavidir; medikal olarak Desmopressin (DDAVP) kullanılır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Yaş ve Sıklık Ölçütü (≥5 Yaş)", content: "En az 5 yaşındaki çocukta, ardışık en az 3 ay boyunca haftada en az 2 kez yatağa ya da giysilere idrar kaçırma." },
            { code: "Kriter B", title: "Organik Hastalık Dışlaması", content: "Durum diyabet (DM/DI), idrar yolu enfeksiyonu, spina bifida veya diüretik ilaç kullanımına bağlı değildir." }
        ]
    },
    "encopresis": {
        id: "encopresis",
        nameTr: "Enkoprezis (İstemsiz Kaka Kaçırma)",
        nameEn: "Encopresis",
        clinicalDescription: {
            overview: "Takvim yaşı en az 4 olan bir çocukta uygunsuz yerlere (iç çamaşırına, yere) tekrarlayıcı dışkı kaçırma tablosudur. Vakaların %85'i kronik kabızlık ve rektumdaki taşlaşmış dışkı tıkacının (fekalom) etrafından sıvı dışkının istemsiz sızmasıyla giden 'Taşma İnkontinansı' (Retansiyonlu) tipidir.",
            epidemiology: "Okul çağı çocuklarının %1-3'ünde görülür; erkek çocuklarda 3-4 kat daha sıktır.",
            etiology: "Ağrılı dışkılama (anal fissür) korkusuyla çocuğun kakasını tutması, rektal duvarın genişleyip duyusunu kaybetmesi ve taşma sızıntısı.",
            prognosis: "Cezalandırmanın durdurulması, fekalomun PEG/lavmanla temizlenmesi ve yemek sonrası düzenli tuvalet oturuş eğitimiyle tam düzelir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Yaş ve Sıklık Ölçütü (≥4 Yaş)", content: "En az 4 yaşındaki çocukta, en az 3 ay boyunca ayda en az 1 kez uygunsuz yerlere istemsiz (veya kasıtlı) dışkı kaçırma." },
            { code: "Kriter B", title: "Kabızlık ve Taşma İnkontinansı Belirteci", content: "Fizik muayene veya grafide fekal retansiyon (kabızlık) ve taşma sızıntısının gösterilmesi; Hirschsprung hastalığının dışlanması." }
        ]
    },
    "kleine_levin_syndrome": {
        id: "kleine_levin_syndrome",
        nameTr: "Kleine-Levin Sendromu (Uyuyan Güzel Sendromu)",
        nameEn: "Kleine-Levin Syndrome",
        clinicalDescription: {
            overview: "Genellikle ergen erkeklerde görülen; yılda birkaç kez tekrarlayan ve 1-3 hafta boyunca hastanın günde 18-22 saat uyuduğu (epizodik hipersomni), uyandığında oburca ne bulursa yediği (megafaji), cinsel disinhibisyon (hiperseksüalite) ve rüyada gibi olma (derealizasyon) sergilediği nadir nöropsikiyatrik sendromdur.",
            epidemiology: "Milyonda 1-5 görülen nadir bir tablodur; hastaların %70-80'i ergen erkeklerdir.",
            etiology: "Viral enfeksiyon sonrası tetiklenen otoimmün/inflamatuar hipotalamik ve talamik disfonksiyon.",
            prognosis: "Ataklar arasında hasta %100 sağlıklıdır; 8-12 yıl içinde kendiliğinden sönümlenir; atak profilaksisinde Lityum en etkili ajandır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Yineleyen Hipersomni Atakları", content: "En az 2 gün ile 5 hafta arasında süren, yılda en az bir kez tekrarlayan aşırı uyku (18-20 saat/gün) dönemleri ve ataklar arası tam normallik." },
            { code: "Kriter B", title: "Eşlik Eden Megafaji, Hiperseksüalite ve Derealizasyon", content: "Atak sırasında bilişsel yavaşlama, derealizasyon, kompulsif aşırı yeme (megafaji) ve hiperseksüalite/irritabilite bulguları." }
        ]
    },
    "restless_legs_syndrome": {
        id: "restless_legs_syndrome",
        nameTr: "Huzursuz Bacaklar Sendromu (Willis-Ekbom)",
        nameEn: "Restless Legs Syndrome (Willis-Ekbom Disease)",
        clinicalDescription: {
            overview: "Bacakların derinliklerinde hissedilen karıncalanma, çekilme veya ürperme gibi rahatsız edici duyumlar eşliğinde bacakları hareket ettirme dürtüsüdür. Dinlenmeyle başlar, akşam/gece saatlerinde zirve yapar ve yürümekle anında rahatlar (URGE kriterleri).",
            epidemiology: "Toplumda %2-7 oranında görülür; kadınlarda, gebelerde ve demir eksikliği olanlarda 2 kat sıktır.",
            etiology: "Merkezi sinir sisteminde demir eksikliği (Ferritin düşüklüğü) ve buna bağlı nigrostriatal/spinal dopaminerjik disfonksiyon.",
            prognosis: "Demir (Ferritin >75 ng/mL) replasmanı, tetikleyici ilaçların (antihistaminik, SSRI, mirtazapin) kesilmesi ve Pregabalin/Pramipeksol ile hızla düzelir."
        },
        criteriaList: [
            { code: "Kriter A", title: "URGE Tanı Ölçütleri", content: "1) Bacakları hareket ettirme dürtüsü (Urge), 2) Dinlenmede başlama (Rest), 3) Hareketle/yürümekle geçme (Gets better), 4) Akşam/gece kötüleşme (Evening)." },
            { code: "Kriter B", title: "Süre ve Sıklık Kriteri", content: "Belirtilerin en az 3 aydır haftada en az 3 kez ortaya çıkması ve ağır uykuya dalma güçlüğü yaratması." }
        ]
    },
    "sleepwalking_disorder": {
        id: "sleepwalking_disorder",
        nameTr: "NREM Uykusundan Uyanma (Uyurgezerlik / Somnambulizm)",
        nameEn: "Non-REM Sleep Arousal Disorder (Sleepwalking Type)",
        clinicalDescription: {
            overview: "Gecenin ilk üçte birlik diliminde (NREM Evre 3 derin yavaş dalga uykusunda) yataktan kalkıp yürüme, boş ve donuk gözlerle bakma, dışarıdan uyandırılma güçlüğü ve sabah uyandığında olanları hiç hatırlamama (tam amnezi) ile seyreden NREM parasomnisidir.",
            epidemiology: "Çocukların %10-15'inde, yetişkinlerin %1-4'ünde görülür; güçlü genetik geçiş (%80 aile öyküsü) gösterir.",
            etiology: "Derin delta uykusundan motor merkezlerin uyanırken bilinç korteksinin uykuda kalması (uyku yoksunluğu, ateş ve stresle tetiklenir).",
            prognosis: "Ev güvenlik önlemleri (kapı/pencere kilitleme), uyku hijyeni ve yetişkinlerde düşük doz Klonazepam ile yaralanmalar önlenir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Gecenin İlk 1/3'ünde NREM'den Kalkıp Yürüme", content: "Uyku döneminin ilk üçte birinde yataktan kalkıp dolaşma; boş bakışlar, başkalarının iletişim çabalarına tepkisizlik ve güç uyandırılma." },
            { code: "Kriter B", title: "Sabah Tam Amnezi", content: "Uyandıktan sonra rüya hatırlamama ve uyurgezerlik atağına dair tam bellek yitimi (amnezi)." }
        ]
    },
    "sleep_terrors": {
        id: "sleep_terrors",
        nameTr: "NREM Uykusundan Uyanma (Gece Terörü / Uyku Terörü)",
        nameEn: "Non-REM Sleep Arousal Disorder (Sleep Terror Type)",
        clinicalDescription: {
            overview: "Gecenin ilk üçte birinde (NREM Evre 3 derin uykuda) panik dolu tiz bir çığlıkla yatakta doğrulma, taşikardi, hızlı soluma, terleme (otonomik fırtına), ebeveynlerin avutma çabalarına yanıtsızlık ve sabah tam amnezi ile karakterize parasomnidir (Pavor Nocturnus).",
            epidemiology: "4-12 yaş arası çocuklarda (%3-6) sık görülür ve ergenlikte çoğunlukla kendiliğinden kaybolur.",
            etiology: "Derin yavaş dalga (delta) uykusunda otonomik ve limbik sistemin ani deşarjı.",
            prognosis: "Aile eğitimi (atak anında zorla uyandırmama) ve Planlı Uyandırma (Scheduled Awakenings) tekniği ile kolayca yatışır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Panik Çığlığı ve Otonomik Deşarj", content: "Gecenin ilk üçte birinde panik çığlığıyla uyanma; yoğun korku, midriyazis, taşikardi, takipne ve terleme." },
            { code: "Kriter B", title: "Avutulamama ve Sabah Amnezisi", content: "Başkalarının avutma/sakinleştirme çabalarına yanıtsızlık, rüya hatırlamama ve sabah olaya dair tam amnezi." }
        ]
    },
    "substance_induced_sexual_dysfunction": {
        id: "substance_induced_sexual_dysfunction",
        nameTr: "Maddenin/İlacın Yol Açtığı Cinsel İşlev Bozukluğu (SSRI Disfonksiyonu)",
        nameEn: "Substance/Medication-Induced Sexual Dysfunction",
        clinicalDescription: {
            overview: "Bir ilacın (en sık SSRI ve SNRI grubu antidepresanlar, antipsikotikler, beta-blokerler) başlanmasından veya doz artışından sonra ortaya çıkan belirgin cinsel istek azalması, sertleşme/uyarılma güçlüğü veya orgazm olamama (anorgazmi / gecikmiş ejakülasyon) tablosudur.",
            epidemiology: "SSRI (özellikle Paroksetin, Sertralin, Fluoksetin) ve Venlafaksin kullanan hastaların %40-65'inde görülür ve ilaç bırakmanın en sık nedenidir.",
            etiology: "Artan serotoninin postsinaptik 5-HT2A ve 5-HT2C reseptörlerini uyararak mezolimbik dopamini ve spinal ejakülasyon/nitrik oksit refleksini baskılaması.",
            prognosis: "Bupropion (NDRI) eklenmesi/geçişi, Mirtazapin/Vortioksetin'e geçiş veya PDE-5 inhibitörü (Sildenafil) desteği ile tam olarak düzelir."
        },
        criteriaList: [
            { code: "Kriter A", title: "İlaç Kullanımıyla Zamansal İlişki", content: "Cinsel istek, uyarılma veya orgazm bozukluğunun ilaç başlandıktan/doz artırıldıktan sonraki ilk haftalar içinde gelişmesi." },
            { code: "Kriter B", title: "Birincil Cinsel Bozukluk Dışlaması", content: "Semptomların ilaç öncesinde bulunmaması ve ilacın doğrudan farmakolojik etkisiyle açıklanması." }
        ]
    },
    "major_neurocognitive_lewy_body": {
        id: "major_neurocognitive_lewy_body",
        nameTr: "Majör Nörobilişsel Bozukluk (Lewy Cisimcikli Demans)",
        nameEn: "Major Neurocognitive Disorder with Lewy Bodies",
        clinicalDescription: {
            overview: "Alzheimer'dan sonra en sık ikinci dejeneratif demans olup; 1) Dikkat ve uyanıklıkta belirgin dalgalanmalar, 2) Yineleyen canlı ve ayrıntılı görsel halüsinasyonlar, 3) Spontan parkinsonizm ve 4) REM Uykusu Davranış Bozukluğu ile karakterizedir.",
            epidemiology: "Tüm demansların %10-15'ini oluşturur; yaşlı erkeklerde daha sık görülür.",
            etiology: "Serebral korteks ve beyin sapı nöronlarında Alfa-Sinüklein proteininden oluşan 'Lewy Cisimciklerinin' birikimi ve ağır kolinerjik yıkım.",
            prognosis: "Rivastigmin (kolinesteraz inhibitörü) görsel halüsinasyonlara çok iyi gelir; tipik antipsikotikler (Haloperidol) ölümcül nöroleptik duyarlılık yaptığı için KESİNLİKLE KONTRENDİKEDİR!"
        },
        criteriaList: [
            { code: "Kriter A", title: "3 Çekirdek Klinik Özellik", content: "1) Bilişsel dalgalanma (fluktuasyon), 2) Ayrıntılı ve canlı görsel varsanılar, 3) Demansla eşzamanlı (1 yıl içinde) başlayan spontan Parkinsonizm." },
            { code: "Kriter B", title: "REM Uykusu Davranış Bozukluğu ve Nöroleptik Duyarlılığı", content: "RBD öyküsü ve antipsikotik ilaçlara karşı aşırı/hayatı tehdit edici duyarlılık." }
        ]
    },
    "major_neurocognitive_prion": {
        id: "major_neurocognitive_prion",
        nameTr: "Majör Nörobilişsel Bozukluk (Prion Hastalığı / Creutzfeldt-Jakob)",
        nameEn: "Major Neurocognitive Disorder Due to Prion Disease",
        clinicalDescription: {
            overview: "Anormal katlanmış enfeksiyöz prion proteinlerinin (PrPSc) beyinde süngerimsi (spongiform) boşluklar oluşturarak nöronları hızla yok ettiği; haftalar/aylar içinde çöküşe götüren çok hızlı demans, irkilme miyoklonusu (startle myoclonus) ve ataksi tablosudur.",
            epidemiology: "Yılda milyonda 1 görülür; %85'i sporadik Creutzfeldt-Jakob Hastalığı (sCJD) formundadır.",
            etiology: "Normal hücresel PrPC proteininin patolojik beta-tabakalı PrPSc formuna dönüşerek zincirleme nöronal yıkım başlatması.",
            prognosis: "Ne yazık ki küratif tedavisi yoktur ve genellikle 6-12 ay içinde ölümle sonuçlanır; miyoklonus için Klonazepam/Levetirasetam kullanılır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Çok Hızlı İlerleyen Demans ve Miyoklonus", content: "Haftalar ve birkaç ay içinde hızla ilerleyen bilişsel yıkım + Sese/uyarana karşı ani kas sıçramaları (irkilme miyoklonusu) ve serebellar ataksi." },
            { code: "Kriter B", title: "Karakteristik MRG, EEG ve BOS Bulguları", content: "Difüzyon MRG'de kortikal şeritlenme/bazal ganglion hiperintensitesi, EEG'de periyodik keskin dalga kompleksleri ve BOS'ta 14-3-3 proteini / RT-QuIC pozitifliği." }
        ]
    },
    "major_neurocognitive_huntington": {
        id: "major_neurocognitive_huntington",
        nameTr: "Majör Nörobilişsel Bozukluk (Huntington Hastalığına Bağlı)",
        nameEn: "Major Neurocognitive Disorder Due to Huntington's Disease",
        clinicalDescription: {
            overview: "4. kromozomdaki otozomal dominant CAG trinükleotid tekrar artışına bağlı gelişen; 30-40'lı yaşlarda başlayan istemsiz dans benzeri kıvrılma/sıçrama hareketleri (kore), yürütücü işlev kaybı (subkortikal demans) ve ağır depresyon/irritabilite/psikoz triadıdır.",
            epidemiology: "Batı toplumlarında 100.000'de 5-10 görülür; otozomal dominant olduğu için hasta ebeveynin çocuklarında risk %50'dir.",
            etiology: "HTT geninde ≥36 CAG tekrarı sonucu mutant huntingtin proteininin striatumda (kaudat çekirdek ve putamen) GABAerjik nöronları yıkması.",
            prognosis: "İlerleyicidir; kore için VMAT2 inhibitörleri (Tetrabenazin, Dötetrabenazin) kullanılır; intihar riski çok yüksek olduğu için yakın takip şarttır."
        },
        criteriaList: [
            { code: "Kriter A", title: "Subkortikal Demans ve Koreiform Hareketler", content: "Yürütücü işlevlerde ve işlem hızında ilerleyici bozulma ile birlikte yüz, gövde ve ekstremitelerde istemsiz kore hareketleri." },
            { code: "Kriter B", title: "Genetik Mutasyon ve Kaudat Atrofi", content: "Ailede otozomal dominant Huntington öyküsü, HTT geninde CAG tekrar artışı ve MRG'de kaudat çekirdek başı atrofisi (kutu ventriküller)." }
        ]
    },
    "wernicke_korsakoff_syndrome": {
        id: "wernicke_korsakoff_syndrome",
        nameTr: "Maddenin Yol Açtığı Kalıcı Bellek Bozukluğu (Wernicke-Korsakoff)",
        nameEn: "Substance-Induced Persisting Amnestic Disorder (Wernicke-Korsakoff)",
        clinicalDescription: {
            overview: "Kronik alkol bağımlılığı ve ağır Tiamin (B1 vitamini) eksikliği sonucu önce akut Wernicke Ensefalopatisi (Konfüzyon + Oftalmopleji/Nistagmus + Ataksi triadı), tedavi gecikirse ardından kalıcı Korsakoff Sendromu (ağır anterograd amnezi ve bellek boşluklarını hayali anılarla doldurma / konfabülasyon) gelişmesidir.",
            epidemiology: "Tedavi edilmeyen Wernicke hastalarının %80'i kalıcı Korsakoff amnestik bozukluğuna ilerler.",
            etiology: "Tiamin eksikliğine bağlı mamiller cisimcikler (corpora mamillaria) ve dorsomedial talamik çekirdeklerde peteşiyal kanama ve nekroz.",
            prognosis: "Wernicke evresinde glukozdan ÖNCE yüksek doz IV Tiamin verilirse tam düzelir; Korsakoff evresine geçtikten sonra ise kalıcı bellek yıkımı oluşur."
        },
        criteriaList: [
            { code: "Kriter A", title: "Ağır Anterograd Amnezi ve Konfabülasyon", content: "Genel zeka ve anlık bellek korunmuşken, yeni bilgileri öğrenememe (5 dakika öncesini unutma) ve boşlukları masallama (konfabülasyon) ile doldurma." },
            { code: "Kriter B", title: "Kronik Alkol ve Tiamin Eksikliği Öyküsü", content: "Wernicke triadı (oftalmopleji, ataksi, konfüzyon) ve mamillo-talamik lezyon kanıtı." }
        ]
    },
    "transient_global_amnesia": {
        id: "transient_global_amnesia",
        nameTr: "Geçici Global Amnezi (TGA)",
        nameEn: "Transient Global Amnesia (TGA)",
        clinicalDescription: {
            overview: "Genellikle 50-70 yaş arası bireylerde soğuk suya girme, ağır egzersiz veya yoğun stres sonrasında aniden başlayan; kişinin kendi adını ve kimliğini tam olarak bildiği, ancak yeni hiçbir bilgiyi kaydedemediği için 30 saniyede bir 'Ben neredeyim? Buraya nasıl geldik?' diye aynı soruyu tekrarladığı ve 24 saat içinde tam düzelen iyi huylu tablodur.",
            epidemiology: "50 yaş üstünde yılda 100.000'de 20-30 oranında görülür.",
            etiology: "Hipokampüsün CA1 bölgesinde geçici venöz konjesyon, migrenöz yayılan depresyon veya geçici metabolik stres.",
            prognosis: "Mükemmeldir; 6-24 saat içinde hiçbir nörolojik sekel bırakmadan kendiliğinden %100 düzelir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Akut Anterograd Amnezi ve Tekrarlayıcı Sorular", content: "Yeni bilgi kaydedememe nedeniyle sürekli aynı soruları tekrarlama; ancak KİŞİSEL KİMLİK BELLEĞİNİN (adını, soyadını bilme) TAM KORUNMASI." },
            { code: "Kriter B", title: "24 Saatte Tam Düzelme ve Fokal Defisit Yokluğu", content: "Afazi, felç veya bilinç kaybının olmaması ve tablonun 24 saat içinde tamamen normale dönmesi." }
        ]
    },
    "malingering": {
        id: "malingering",
        nameTr: "Temarruz (Malingering - Maddi/Yasal Kazanç Amaçlı Sahte Hastalık)",
        nameEn: "Malingering",
        clinicalDescription: {
            overview: "Kişinin hapisten/cezai sorumluluktan kurtulmak, askerlikten muaf olmak, yüklü maddi tazminat/malulen emeklilik almak veya narkotik ilaç temin etmek gibi somut bir dışsal çıkar (ikincil kazanç) amacıyla kasıtlı ve bilinçli olarak sahte hastalık belirtileri uydurmasıdır.",
            epidemiology: "Adli psikiyatri, askeri psikiyatri ve tazminat davalarında başvuruların %10-20'sinde saptanır.",
            etiology: "Bir ruhsal bozukluk değildir (DSM-5 V/Z kodudur); antisosyal kişilik özellikleri ve dışsal çıkar motivasyonu belirleyicidir.",
            prognosis: "İzlenmediğini sandığı anda (kamera/tek yönlü ayna) semptomlar kaybolur; Semptom Geçerlilik Testleri (TOMM, MMPI-2 F-K) ile kanıtlanır ve adli rapor düzenlenir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Bilinçli ve Kasıtlı Sahte Semptom Üretimi", content: "Fiziksel ya da ruhsal belirtilerin bilinçli olarak uydurulması veya aşırı abartılması; izlenmediğinde semptomların kesilmesi." },
            { code: "Kriter B", title: "Somut Dışsal Çıkar (İkincil Kazanç)", content: "Davranışın cezaevinden kaçma, para/tazminat alma veya askerlikten kurtulma gibi açık bir dışsal ödülle güdülenmiş olması." }
        ]
    },
    "medication_induced_akathisia": {
        id: "medication_induced_akathisia",
        nameTr: "İlacın Yol Açtığı Akatizi (İçsel Yerinde Duramama)",
        nameEn: "Medication-Induced Acute Akathisia",
        clinicalDescription: {
            overview: "Antipsikotik (nöroleptik) veya SSRI başlanmasından ya da doz artışından sonraki günler içinde gelişen; hastanın içinde dayanılmaz bir elektriklenme/sıkışma hissettiği (subjektif huzursuzluk) ve bir saniye bile oturamayıp sürekli volta attığı, bacaklarını salladığı (objektif yerinde duramama) tablodur.",
            epidemiology: "Yüksek potensli antipsikotik (Haloperidol, Risperidon, Aripiprazol) kullananların %20-25'inde görülür.",
            etiology: "Mezokortikal ve nigrostriatal dopamin D2 reseptör blokajı ve noradrenerjik hiperaktivite.",
            prognosis: "Psikotik ajitasyon sanılıp doz artırılırsa intihara sürükleyebilir! Doz azaltımı ve 1. basamak Propranolol (Beta-bloker) veya Mirtazapin/Benzodiazepin ile hızla düzelir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Subjektif İçsel Huzursuzluk", content: "Antipsikotik/SSRI sonrası gelişen, tüm gün süren dayanılmaz içsel kıvranma ve oturamama işkencesi." },
            { code: "Kriter B", title: "Objektif Motor Yerinde Duramama", content: "Sürekli volta atma, ayakta dururken bir ayağından diğerine ağırlık verme (yerinde sayma) ve bacak sallama." }
        ]
    },
    "medication_induced_dystonia": {
        id: "medication_induced_dystonia",
        nameTr: "İlacın Yol Açtığı Akut Distoni (Tortikollis / Okülogirik Kriz)",
        nameEn: "Medication-Induced Acute Dystonia",
        clinicalDescription: {
            overview: "Antipsikotik (özellikle IM Haloperidol) veya antiemetik (Metoklopramid) uygulamasından sonraki ilk saatler/günler içinde aniden gelişen; gözlerin tavana dikili kalması (okülogirik kriz), boynun yana/arkaya kilitlenmesi (tortikollis), çene kilitlenmesi (trismus) ve dil şişmesiyle seyreden ağrılı kas spazmıdır.",
            epidemiology: "En yüksek risk grubu GENÇ ERKEKLERDİR; vakaların %90'ı ilacın ilk 3-4 günü içinde ortaya çıkar.",
            etiology: "Nigrostriatal yolakta akut dopamin D2 blokajı sonucu oluşan aşırı asetilkolin (kolinerjik) baskınlığı.",
            prognosis: "IM veya IV Biperiden (Akineton 5 mg) enjeksiyonu ile 10-15 dakika içinde dramatik ve tam olarak düzelir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Akut Kraniyal, Oküler ve Servikal Spazmlar", content: "İlaç alımından sonraki ilk saatler/günlerde başlayan okülogirik kriz (göz kayması), tortikollis (boyun tutulması) veya laringospazm." },
            { code: "Kriter B", title: "Parenteral Antikolinerjik Yanıtı", content: "Kas içi veya damar içi Biperiden (Akineton) / Difenhidramin uygulamasıyla dakikalar içinde tam çözülme." }
        ]
    },
    "antidepressant_discontinuation": {
        id: "antidepressant_discontinuation",
        nameTr: "Antidepresan Bırakma Sendromu (Kesilme Belirtileri)",
        nameEn: "Antidepressant Discontinuation Syndrome",
        clinicalDescription: {
            overview: "En az 4-6 hafta düzenli kullanılan bir antidepresanın (özellikle yarı ömrü çok kısa olan Venlafaksin ve Paroksetin'in) aniden kesilmesi sonucunda 2-4 gün içinde başlayan; baş ve göz hareketleriyle tetiklenen 'beyinde elektrik çarpması' (Brain Zaps), baş dönmesi, bulantı, canlı kabuslar ve grip benzeri belirtilerle seyreden sendromdur.",
            epidemiology: "Antidepresanı aniden bırakan hastaların %20-40'ında görülür; en sık Venlafaksin ve Paroksetin'de, en az Fluoksetin'de görülür.",
            etiology: "Sinaptik aralıkta serotonin ve noradrenalin düzeyinin aniden düşmesiyle postsinaptik reseptörlerin geçici adaptasyon krizi yaşaması.",
            prognosis: "İlacın tekrar başlanıp haftalar içinde yavaşça azaltılması (tapering) veya Fluoksetin köprülemesi ile hızla ve tamamen düzelir."
        },
        criteriaList: [
            { code: "Kriter A", title: "FINSH Kesilme Belirtileri ve Brain Zaps", content: "İlaç kesildikten 2-4 gün sonra başlayan; Beyinde elektrik çarpması (Brain Zaps), baş dönmesi, bulantı, grip benzeri halsizlik ve canlı kabuslar." },
            { code: "Kriter B", title: "Depresyon Nüksünden Ayrım", content: "Haftalar sonra başlayan depresyon nüksünden farklı olarak akut duyusal belirtilerle başlar ve tek doz ilaç alımıyla saatler içinde kaybolur." }
        ]
    },
    "burnout_syndrome": {
        id: "burnout_syndrome",
        nameTr: "Tükenmişlik Sendromu (Mesleki Yıpranma)",
        nameEn: "Burnout Syndrome / Occupational Problem",
        clinicalDescription: {
            overview: "Başarıyla yönetilemeyen kronik işyeri stresinden kaynaklanan ve Christina Maslach'ın tanımladığı 3 boyutla karakterize sendromdur: 1) Duygusal Tükenme (enerji bitimi), 2) Duyarsızlaşma/Sinisizm (hizmet verilen insanlara nesne gibi soğuk ve alaycı yaklaşma), 3) Düşük Kişisel Başarı Hissi.",
            epidemiology: "Hekimler, hemşireler, öğretmenler ve yoğun insan ilişkisi gerektiren mesleklerde %30-50 oranında görülür.",
            etiology: "Aşırı iş yükü, nöbetler, kontrol eksikliği, ödül/takdir yetersizliği ve kurumsal adaletsizlik.",
            prognosis: "Majör depresyondan farklı olarak belirtiler yalnızca iş bağlamıyla sınırlıdır (tatilde zevk alabilir); sınır koyma, çalışma koşullarının düzenlenmesi ve BDT ile düzelir."
        },
        criteriaList: [
            { code: "Kriter A", title: "Maslach Tükenmişlik Triadı", content: "1) Duygusal ve fiziksel enerji tükenmesi, 2) İşe ve hizmet verilen kişilere karşı zihinsel mesafe/sinisizm (duyarsızlaşma), 3) Mesleki yeterlilik algısında düşme." },
            { code: "Kriter B", title: "Yalnızca İş Bağlamıyla Sınırlı Olma", content: "Yaşamın tüm alanlarını çökerten Majör Depresyondan farklı olarak, kişinin iş dışındaki tatil ve hobi alanlarında zevk alma kapasitesinin korunmuş olması." }
        ]
    }
};

Object.assign(currentManual, newManualEntries110to150);

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
console.log('Successfully updated js/dsm_manual.js! Total manual entries:', Object.keys(currentManual).length);

// Also ensure js/therapies.js has parent_training, phase_oriented_trauma, supportive_psychotherapy, habit_reversal
const therPath = path.join(__dirname, 'js', 'therapies.js');
const therModule = require(therPath);
const thers = therModule.THERAPIES_DATABASE;
const fams = therModule.THERAPY_FAMILIES;

const extraTherapies = [
    {
        id: "parent_training",
        nameTr: "Bağlanma & Davranış Odaklı Ebeveyn Eğitimi (PMT / ABC)",
        nameEn: "Parent Management & Attachment-Based Training",
        family: "SYSTEMIC_FAMILY",
        aliases: ["Ebeveyn Eğitimi", "Bağlanma Odaklı Aile Terapisi", "Parent Training"],
        goldForDiagnoses: ["reactive_attachment_disorder", "disinhibited_social_engagement", "encopresis", "odd"],
        shortDefinition: "Çocukluk çağı bağlanma, dışa atım ve davranış bozukluklarında bakımverenin duyarlılığını, sınır koyma becerilerini ve pozitif pekiştirme sistemini yapılandıran kanıta dayalı müdahaledir.",
        protocolSteps: [
            "1. Güvenli, sıcak ve öngörülebilir ebeveyn-çocuk etkileşimi kurma",
            "2. Cezalandırıcı ve utandırıcı tutumları tamamen sonlandırma",
            "3. Somut sosyal sınırlar ve rutin tuvalet/davranış çizelgeleri oluşturma",
            "4. Olumlu davranışları anında ödüllendirme (Yıldız/Jeton Ekonomisi)."
        ],
        pitfalls: "Çocuğu suçlamak veya soğuk/cezalandırıcı disiplin uygulamak bağlanma ve dışa atım sorunlarını daha da derinleştirir.",
        targetMechanism: "Güvenli bağlanma inşası ve operant pozitif pekiştirme."
    },
    {
        id: "phase_oriented_trauma",
        nameTr: "Faz Odaklı Travma & Dissosiyasyon Terapisi",
        nameEn: "Phase-Oriented Trauma and Dissociation Therapy",
        family: "TRAUMA_DISSOCIATION",
        aliases: ["Faz Odaklı Travma Terapisi", "Dissosiyatif Füg Terapisi", "Pierre Janet Modeli"],
        goldForDiagnoses: ["dissociative_fugue", "dissociative_amnesia", "did"],
        shortDefinition: "Dissosiyatif füg ve amnezide önce güvenliği ve stabilizasyonu sağlayan, ardından kopmuş otobiyografik anıları ve kimliği bütünleştiren 3 aşamalı terapidir.",
        protocolSteps: [
            "1. Faz: Güvenlik, fiziksel/duygusal stabilizasyon ve stresör kontrolü",
            "2. Faz: Dissosiyatif kopmaya yol açan travmatik/stresli olayın kademeli işlenmesi ve bellek geri kazanımı",
            "3. Faz: Otobiyografik kimlik bütünleşmesi ve nüks önleme."
        ],
        pitfalls: "Hasta kendini güvende hissetmeden kimlik ve travma anılarını zorla hatırlatmaya çalışmak yeni bir dissosiyatif kaçışı tetikler.",
        targetMechanism: "Bölünmüş otobiyografik bellek ağlarının kortikal entegrasyonu."
    },
    {
        id: "supportive_psychotherapy",
        nameTr: "Destekleyici Psikoterapi & Kriz Müdahalesi",
        nameEn: "Supportive Psychotherapy & Clinical Crisis Management",
        family: "SCHEMA_DYNAMIC",
        aliases: ["Destekleyici Psikoterapi", "Kriz Yönetimi", "Adli/Tıbbi Gözlem"],
        goldForDiagnoses: ["ganser_syndrome", "transient_global_amnesia", "factitious_another", "malingering"],
        shortDefinition: "Akut nöropsikiyatrik krizler, geçici amneziler ve adli/yapay tablolarda ego işlevlerini destekleyen, gerçeklik sınamasını koruyan ve güvenli sınırlar çizen klinik yaklaşımdır.",
        protocolSteps: [
            "1. Empatik, sakin ve yargılayıcı olmayan terapötik çerçeve ve güvenlik sağlama",
            "2. Akut stresörü yatıştırma ve hasta/aileye net tıbbi güvence verme",
            "3. Adli ve çocuk koruma gerektiren durumlarda çatışmasız sınır koyma ve resmi bildirim",
            "4. Sağlıklı başa çıkma savunmalarını güçlendirme."
        ],
        pitfalls: "Yapay bozukluk veya temarruzda öfkeli münakaşaya girmek ya da çocuk koruma bildirimini geciktirmek ağır zararlara yol açar.",
        targetMechanism: "Ego stabilizasyonu, anksiyete yatıştırma ve güvenli klinik sınırlar."
    },
    {
        id: "habit_reversal",
        nameTr: "Alışkanlığı Tersine Çevirme & Koşullanma Eğitimi (HRT / Alarm)",
        nameEn: "Habit Reversal Training & Behavioral Conditioning",
        family: "BEHAVIORAL_HABIT",
        aliases: ["HRT", "Diyafram Nefesi", "Enürezis Alarm Eğitimi"],
        goldForDiagnoses: ["rumination_disorder", "enuresis_nocturna", "trichotillomania", "excoriation"],
        shortDefinition: "Ruminasyon bozukluğu ve enürezis gibi öğrenilmiş/otomatik bedensel döngülerde farkındalık ve yarışan fizyolojik tepki (diyafram nefesi veya zil-ped şartlanması) oluşturan davranışçı tedavidir.",
        protocolSteps: [
            "1. Bedensel öncül duyumu (karın kasılması veya mesane doluluğu) fark etme eğitimi",
            "2. Ruminasyonda yemek sonrası derin diyafram nefesi; Enüreziste nem sensörlü zil-ped alarmı uygulama",
            "3. Olumlu ve kuru/başarılı günleri takvimle ödüllendirme",
            "4. Davranış otomatikleşene kadar düzenli takip."
        ],
        pitfalls: "Davranışçı egzersizleri düzensiz uygulamak veya çocuğu utandırmak şartlanmayı bozar.",
        targetMechanism: "Yarışan motor yanıt ve klasik/operant yeniden koşullanma."
    }
];

extraTherapies.forEach(et => {
    if (!thers.some(t => t.id === et.id)) {
        thers.push(et);
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
console.log('Successfully updated js/therapies.js! Total therapies:', thers.length);
