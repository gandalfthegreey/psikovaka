/**
 * PsikoVaka - Psikoterapi Ekolleri ve Müdahale Teknikleri Kütüphanesi
 * Kanıta dayalı psikoterapi yöntemleri, terapi aileleri, seans protokolleri ve terapist tuzakları
 */

const THERAPY_FAMILIES = {
    "CBT_EXPOSURE": {
        "id": "CBT_EXPOSURE",
        "name": "Klasik Davranışçı & Maruz Bırakma",
        "icon": "⚡",
        "color": "#f59e0b"
    },
    "CBT_COGNITIVE": {
        "id": "CBT_COGNITIVE",
        "name": "Bilişsel & BDT Ekolleri",
        "icon": "🧠",
        "color": "#6366f1"
    },
    "THIRD_WAVE": {
        "id": "THIRD_WAVE",
        "name": "Üçüncü Dalga, Kabul & Duygu Regülasyonu",
        "icon": "🌊",
        "color": "#06b6d4"
    },
    "TRAUMA_DISSOCIATION": {
        "id": "TRAUMA_DISSOCIATION",
        "name": "Travma & Dissosiyasyon Odaklı",
        "icon": "🛡️",
        "color": "#ec4899"
    },
    "SCHEMA_DYNAMIC": {
        "id": "SCHEMA_DYNAMIC",
        "name": "Şema & Psikodinamik Ekoller",
        "icon": "🧩",
        "color": "#8b5cf6"
    },
    "SYSTEMIC_FAMILY": {
        "id": "SYSTEMIC_FAMILY",
        "name": "Aile Temelli & Ebeveyn Yönetimi",
        "icon": "👨‍👩‍👧",
        "color": "#10b981"
    },
    "BEHAVIORAL_HABIT": {
        "id": "BEHAVIORAL_HABIT",
        "name": "Alışkanlık & Beden Odaklı Müdahaleler",
        "icon": "🎯",
        "color": "#f97316"
    },
    "MOTIVATIONAL_RHYTHM": {
        "id": "MOTIVATIONAL_RHYTHM",
        "name": "Motivasyonel & Sosyal Ritim Ekolleri",
        "icon": "🔄",
        "color": "#d97706"
    }
};

const THERAPIES_DATABASE = [
    {
        "id": "erp",
        "nameTr": "Tepki Önleme ile Maruz Bırakma (ERP)",
        "nameEn": "Exposure and Response Prevention (ERP)",
        "family": "CBT_EXPOSURE",
        "aliases": [
            "ERP",
            "Maruz Bırakma ve Tepki Engelleme",
            "Exposure and Response Prevention",
            "Maruz Bırakma"
        ],
        "goldForDiagnoses": [
            "ocd"
        ],
        "shortDefinition": "Obsesif-Kompulsif Bozuklukta (OKB) anksiyete doğuran düşünce/nesneye maruz kalıp kompulsif rahatlama ritüelini bilinçli olarak yapmama protokolüdür.",
        "protocolSteps": [
            "1. Kaygı Hiyerarşisi Oluşturma (0-100 SUD Skalası ile tetikleyicileri sıralama)",
            "2. Kademeli Maruz Bırakma (Tetikleyiciye temas etme)",
            "3. Tepki Önleme (El yıkama, kontrol etme gibi kompulsiyonları kesinlikle engelleme)",
            "4. Alışma (Habituation) Süreci: Kaygının ritüel yapmadan da kendiliğinden söndüğünü yaşantısal öğrenme."
        ],
        "pitfalls": "Terapistin danışana 'Merak etme mikrop bulaşmadı' diyerek güvence (reassurance) vermesi kompulsiyon yerine geçer ve tedaviyi bozar.",
        "targetMechanism": "Korku devresi sönmesi ve alışma (Habituation)."
    },
    {
        "id": "invivo_exposure",
        "nameTr": "Kademeli Canlı Maruz Bırakma (In-Vivo Exposure)",
        "nameEn": "Graded In-Vivo Exposure",
        "family": "CBT_EXPOSURE",
        "aliases": [
            "In-Vivo Maruz Bırakma",
            "Canlı Maruziyet",
            "Korku Hiyerarşisi",
            "Duyarsızlaştırma"
        ],
        "goldForDiagnoses": [
            "specific_phobia",
            "agoraphobia",
            "social_anxiety"
        ],
        "shortDefinition": "Özgül fobiler ve agorafobide korkulan gerçek nesne veya ortamla (köpek, yükseklik, açık alan, sahne) kademeli olarak yüzleşme yöntemidir.",
        "protocolSteps": [
            "1. Kaçınma hiyerarşisi çıkarma (en kolaydan en zora)",
            "2. Güvenlik arama davranışlarını bırakarak ortama girme",
            "3. Anksiyete %50 azalana kadar ortamda kalma",
            "4. Başarıları pekiştirerek bir üst basamağa geçme."
        ],
        "pitfalls": "Danışan kaygı zirveye ulaştığında ortamdan kaçarsa fobi daha da pekişir; kaygı düşene kadar ortamda kalınmalıdır.",
        "targetMechanism": "Kaçınma döngüsünün kırılması ve amigdala duyarsızlaşması."
    },
    {
        "id": "interoceptive_exposure",
        "nameTr": "İnteroseptif (Bedensel Duyum) Maruz Bırakması",
        "nameEn": "Interoceptive Exposure",
        "family": "CBT_EXPOSURE",
        "aliases": [
            "İnteroseptif Maruz Bırakma",
            "Bedensel Maruziyet",
            "Panik BDT",
            "Duyum Alıştırması"
        ],
        "goldForDiagnoses": [
            "panic_disorder"
        ],
        "shortDefinition": "Panik Bozuklukta çarpıntı, baş dönmesi, nefes darlığı gibi bedensel duyumların yapay olarak seans içinde üretilerek felaketleştirici yorumların kırılmasıdır.",
        "protocolSteps": [
            "1. Seans içi semptom üretme: Pipetle hızlı nefes alma, dönen sandalyede dönme, yerinde koşma",
            "2. Ortaya çıkan bedensel duyumun kalp krizi/delirme OLMADIĞINI deneyimleme",
            "3. Felaketleştirici otomatik düşünceleri sorgulama ('Kalbim hızlandı ama ölmedim')",
            "4. Güvenlik arama (nabız ölçme, acile koşma) davranışlarını sonlandırma."
        ],
        "pitfalls": "Danışanın nefes egzersizlerini bir 'güvenlik aracı' olarak kullanmasına izin verilmemelidir.",
        "targetMechanism": "İç algısal koşullanmanın sönmesi ve bilişsel yeniden çerçeveleme."
    },
    {
        "id": "applied_tension",
        "nameTr": "Uygulamalı Kas Gerdirme Tekniği (Applied Tension)",
        "nameEn": "Applied Tension (Öst Protocol)",
        "family": "CBT_EXPOSURE",
        "aliases": [
            "Applied Tension",
            "Kas Gerdirme",
            "Öst Protokolü",
            "Vazovagal Kasılma"
        ],
        "goldForDiagnoses": [
            "specific_phobia"
        ],
        "shortDefinition": "Kan-Enjeksiyon-Yara fobisinde kan görünce tansiyonun aniden düşerek bayılmasını (vazovagal senkop) önlemek için kasları sıkarak kan basıncını yükseltme yöntemidir.",
        "protocolSteps": [
            "1. Kol, gövde ve bacak kaslarını 15-20 saniye boyunca kuvvetlice sıkma",
            "2. Yüzde sıcaklık hissedilene kadar tansiyonu yükseltme, ardından 20 saniye normale dönme",
            "3. Bu gerdirme tekniğini kan/enjeksiyon uyaranına maruz kalırken eşzamanlı uygulama",
            "4. Bayılma olmadan kan tahlili yaptırabilme başarısı."
        ],
        "pitfalls": "Diğer fobilerde gevşeme (relaxation) gerekirken, kan fobisinde gevşeme BAYILMAYA yol açar; mutlaka KAS GERDİRME uygulanmalıdır.",
        "targetMechanism": "Kan basıncını yükselterek serebral hipoperfüzyonu ve senkopu engelleme."
    },
    {
        "id": "behavioral_activation",
        "nameTr": "Davranışsal Aktivasyon (Behavioral Activation)",
        "nameEn": "Behavioral Activation (BA)",
        "family": "CBT_EXPOSURE",
        "aliases": [
            "Davranışsal Aktivasyon",
            "BA",
            "Etkinlik Çizelgesi",
            "Aktivasyon Terapisi"
        ],
        "goldForDiagnoses": [
            "mdd",
            "dysthymia"
        ],
        "shortDefinition": "Majör Depresyonda pasif geri çekilme ve anhedoni döngüsünü kırmak için 'motivasyonu beklemeden' değer odaklı ve ödüllendirici günlük aktiviteleri planlama yöntemidir.",
        "protocolSteps": [
            "1. Günlük etkinlik ve duygu izleme çizelgesi tutma",
            "2. Başarı (Mastery) ve Zevk (Pleasure) veren küçük aktiviteleri belirleme",
            "3. 'Dıştan İçe' (Inside-Out yerine Outside-In) eyleme geçme prensibi",
            "4. Sosyal izolasyonu kırıp çevreyle pozitif pekiştireç temasını artırma."
        ],
        "pitfalls": "Danışana baştan çok büyük ve ulaşılamaz hedefler verilirse yetersizlik hissi pekişir; mikro adımlarla başlanmalıdır.",
        "targetMechanism": "Çevresel pozitif pekiştireçlerin yeniden devreye sokulması."
    },
    {
        "id": "dbt",
        "nameTr": "Diyalektik Davranış Terapisi (DBT)",
        "nameEn": "Dialectical Behavior Therapy (DBT)",
        "family": "THIRD_WAVE",
        "aliases": [
            "DBT",
            "Diyalektik Terapi",
            "Marsha Linehan",
            "Duygu Regülasyonu Terapisi"
        ],
        "goldForDiagnoses": [
            "borderline_pd"
        ],
        "shortDefinition": "Borderline Kişilik Bozukluğu, kendine zarar verme ve intihar krizlerinde radikal kabul ile değişimi sentezleyen 4 modüllü altın standart terapidir.",
        "protocolSteps": [
            "1. Bireysel Terapi & İntihar / Kendine Zarar Verme Davranış Analizi (Chain Analysis)",
            "2. 4 Beceri Grubu Eğitimi: Bilinçli Farkındalık (Mindfulness), Sıkıntıya Dayanma (Distress Tolerance), Duygu Düzenleme (Emotion Regulation), Kişilerarası Etkililik (Interpersonal Effectiveness)",
            "3. Telefon Koçluğu (Kriz anında beceriyi hayata geçirme)",
            "4. Terapist Konsültasyon Ekibi."
        ],
        "pitfalls": "Terapistin yargılayıcı veya geçersiz kılıcı (invalidating) bir tutum takınması krizleri tırmandırır; 'Radikal Kabul' esastır.",
        "targetMechanism": "Duygusal aşırı duyarlılığı düzenleme ve krizde tolerans geliştirme."
    },
    {
        "id": "emdr",
        "nameTr": "EMDR (Göz Hareketleriyle Duyarsızlaştırma ve Yeniden İşleme)",
        "nameEn": "Eye Movement Desensitization and Reprocessing (EMDR)",
        "family": "TRAUMA_DISSOCIATION",
        "aliases": [
            "EMDR",
            "Göz Hareketleri Terapisi",
            "İki Yönlü Uyarım",
            "Travma Yeniden İşleme"
        ],
        "goldForDiagnoses": [
            "ptsd",
            "acute_stress_disorder",
            "dissociative_amnesia"
        ],
        "shortDefinition": "TSSB ve travmatik yaşantılarda beynin kilitlenmiş travma anı ağlarını bilateral (iki yönlü) göz hareketleri/dokunsal uyarımla yeniden işleyen 8 aşamalı terapidir.",
        "protocolSteps": [
            "1. Danışan Geçmişi ve Tedavi Planı",
            "2. Hazırlık (Güvenli Yer Egzersizi ve Kaynak Yükleme)",
            "3. Değerlendirme (Hedef anı, Olumsuz İnanç 'NC', Olumlu İnanç 'PC', SUD ve VoC skoru)",
            "4. Duyarsızlaştırma (İki yönlü uyarım BLS eşliğinde anının yeniden işlenmesi)",
            "5. Yerleştirme (Olumlu inancın anıya bağlanması)",
            "6. Beden Taraması & Kapanış."
        ],
        "pitfalls": "Yeterli kaynak yüklemesi ve güvenli yer egzersizi yapılmadan doğrudan ağır travmatik anıya girilirse danışan dekompanse olabilir.",
        "targetMechanism": "Uyarlanabilir Bilgi İşleme (AIP) modeline göre donmuş travmatik anının zamansal olarak entegre edilmesi."
    },
    {
        "id": "cbt_e",
        "nameTr": "Geliştirilmiş BDT (CBT-E / Fairburn Modeli)",
        "nameEn": "Enhanced Cognitive Behavior Therapy (CBT-E)",
        "family": "CBT_COGNITIVE",
        "aliases": [
            "CBT-E",
            "Fairburn Modeli",
            "Yeme Bozukluğu BDT",
            "Enhanced CBT"
        ],
        "goldForDiagnoses": [
            "bulimia_nervosa",
            "binge_eating"
        ],
        "shortDefinition": "Bulimiya Nervoza ve Tıkınırcasına Yeme Bozukluğunda katı diyet kurallarını, tartılma takıntılarını ve tıkınma-çıkarma döngüsünü kıran özgül BDT protokolüdür.",
        "protocolSteps": [
            "1. Düzenli Yemek Yeme Planı (3 ana öğün + 2 ara öğün, en fazla 4 saat aç kalma)",
            "2. Haftalık Açık Tartılma (Haftada sadece 1 kez seans içinde tartılma, evde tartılmayı yasaklama)",
            "3. Yeme Nöbeti Öncesi Olay Analizi (Tetikleyici duyguları yakalama)",
            "4. Beden Biçimi ve Kilonun Kendilik Değerini Belirlemedeki Aşırı Etkisini Yeniden Yapılandırma."
        ],
        "pitfalls": "Danışanın 'diyet yaparak zayıflama' çabalarını sürdürmesine izin vermek tıkınma nöbetlerini tetikler; öncelik düzenli yemektir.",
        "targetMechanism": "Bilişsel kısıtlama (diyet) döngüsünü sonlandırarak nörobiyolojik ve duygusal tıkınma dürtüsünü yok etme."
    },
    {
        "id": "fbt_maudsley",
        "nameTr": "Aile Temelli Terapi (FBT / Maudsley Modeli)",
        "nameEn": "Family-Based Treatment (FBT / Maudsley)",
        "family": "SYSTEMIC_FAMILY",
        "aliases": [
            "FBT",
            "Maudsley Modeli",
            "Aile Temelli Yeme Terapisi",
            "Maudsley"
        ],
        "goldForDiagnoses": [
            "anorexia_nervosa"
        ],
        "shortDefinition": "Çocuk ve ergen Anoreksiya Nervoza vakalarında aileyi suçlamadan 'iyileşmenin ana kaynağı' olarak konumlandıran ve kilo alımını ebeveyn denetimine veren altın standart terapidir.",
        "protocolSteps": [
            "1. Evre: Ebeveynlerin tam yetkiyle çocuğun kilo alımını ve öğünlerini yönetmesi (Hastalığı çocuktan ayrıştırma - Dışsallaştırma)",
            "2. Evre: Kilo güvenli sınıra (BKİ > 18.5) ulaştığında yeme kontrolünün kademeli olarak gence geri devredilmesi",
            "3. Evre: Sağlıklı ergen kimlik gelişimi ve aile sınırlarının yeniden yapılandırılması."
        ],
        "pitfalls": "Ergen belirgin düşük kilodayken (açlık çeken beyinle) bireysel içgörü terapisi yapmak etkisizdir; önce beslenme ve kilo kazanımı sağlanmalıdır.",
        "targetMechanism": "Ebeveyn güçlendirmesi yoluyla anorektik direnci kırma ve hızlı fiziksel restorasyon."
    },
    {
        "id": "schema_therapy",
        "nameTr": "Şema Terapi (Jeffrey Young Modeli)",
        "nameEn": "Schema Therapy",
        "family": "SCHEMA_DYNAMIC",
        "aliases": [
            "Şema Terapi",
            "Jeffrey Young",
            "Erken Uyumsuz Şemalar",
            "Mod Modeli"
        ],
        "goldForDiagnoses": [
            "narcissistic_pd",
            "avoidant_pd",
            "dependent_pd",
            "paranoid_pd",
            "ocpd",
            "antisocial_pd"
        ],
        "shortDefinition": "Kişilik bozuklukları ve kronik dirençli tablolarda çocukluk çağı karşılanmamış temel ihtiyaçlarını, erken dönem uyumsuz şemaları ve modları çalışan bütüncül terapidir.",
        "protocolSteps": [
            "1. Şemaların ve Şema Modlarının Belirlenmesi (İncinmiş Çocuk, Cezalandırıcı Ebeveyn, Kopuk Koruyan Mod vb.)",
            "2. Yaşantısal Teknikler: İmgeleme ile Yeniden Senaryolaştırma (Imagery Rescripting) ve Sandalye Diyalogları",
            "3. Terapötik Sınırlı Yeniden Ebeveynlik (Limited Reparenting)",
            "4. Sağlıklı Yetişkin Modunu güçlendirme ve Davranışsal Örüntü Kırma."
        ],
        "pitfalls": "Sadece bilişsel sorgulamayla sınırlı kalınırsa kişilik şemaları değişmez; yaşantısal imgeleme ve duygu odaklı yeniden ebeveynlik şarttır.",
        "targetMechanism": "Duygusal çekirdek anıların yeniden işlenmesi ve Sağlıklı Yetişkin benliğinin inşası."
    },
    {
        "id": "cbtp",
        "nameTr": "Psikoz için Bilişsel Davranışçı Terapi (CBTp)",
        "nameEn": "Cognitive Behavior Therapy for Psychosis (CBTp)",
        "family": "CBT_COGNITIVE",
        "aliases": [
            "CBTp",
            "Psikoz BDT",
            "Şizofreni BDT",
            "Sanrı Terapisi"
        ],
        "goldForDiagnoses": [
            "schizophrenia",
            "schizoaffective",
            "schizophreniform",
            "delusional_disorder",
            "brief_psychotic"
        ],
        "shortDefinition": "Şizofreni ve psikotik bozukluklarda sanrı ve varsanılarla doğrudan çatışmadan, hastanın bu yaşantılara yüklediği tehdit edici anlamları ve sıkıntıyı azaltan terapidir.",
        "protocolSteps": [
            "1. Terapötik Güven ve Normalleştirme (Varsanıların uykusuzluk ve aşırı streste herkesin başına gelebileceğini anlatma)",
            "2. Seslerle İlişkiyi Değiştirme (Sesin her şeye kadir olmadığını, sadece beynin bir algı hatası olduğunu keşfetme)",
            "3. Sanrısal İnançları Esnetme (Kademeli Sokratik sorgulama ve alternatif açıklamalar üretme)",
            "4. Erken Uyarı İşaretleri ve Nüks Önleme Eylem Planı."
        ],
        "pitfalls": "Hastanın sanrısıyla doğrudan tartışmaya girmek ('Bunlar saçmalık, hepsi hayal') terapötik bağı tamamen koparır.",
        "targetMechanism": "Varsanı ve sanrıların yarattığı ikincil anksiyete ve dezorganizasyonun yatıştırılması."
    },
    {
        "id": "cbasp",
        "nameTr": "CBASP (Kişilerarası Analiz Sistemi Terapisi)",
        "nameEn": "Cognitive Behavioral Analysis System of Psychotherapy (CBASP)",
        "family": "CBT_COGNITIVE",
        "aliases": [
            "CBASP",
            "McCullough Modeli",
            "Kronik Depresyon Terapisi",
            "Kişilerarası Analiz"
        ],
        "goldForDiagnoses": [
            "dysthymia"
        ],
        "shortDefinition": "Kalıcı Depresif Bozukluk (Distimi) ve kronik depresyonda bireyin 'Ben ne yaparsam yapayım hiçbir şey değişmez' şeklindeki kopukluğunu gideren durum analizi yöntemidir.",
        "protocolSteps": [
            "1. Durumsal Analiz (Kişinin yaşadığı somut bir kişilerarası olayı adım adım inceleme)",
            "2. 'Ne istedin?' ve 'Gerçekte ne oldu?' karşılaştırması (İstenen Sonuç vs Gerçek Sonuç)",
            "3. Kişinin kendi davranışının sonucu nasıl doğrudan etkilediğini fark ettirme (Öz-etkililik)",
            "4. Terapistle seans içi aktarım odaklı kişilerarası yüzleştirmeler."
        ],
        "pitfalls": "Genel soyut konuşmalara kaymak kronik depresif hastayı pasifleştirir; her seans tek bir spesifik 'Durumsal Analiz' yapılmalıdır.",
        "targetMechanism": "Piaget'nin işlem öncesi düşünüş evresinden biçimsel işlem evresine geçişi sağlama."
    },
    {
        "id": "pmt",
        "nameTr": "Ebeveyn Yönetim Eğitimi (PMT)",
        "nameEn": "Parent Management Training (PMT / Kazdin Method)",
        "family": "SYSTEMIC_FAMILY",
        "aliases": [
            "PMT",
            "Ebeveyn Eğitimi",
            "Kazdin Metodu",
            "Davranışsal Aile Eğitimi"
        ],
        "goldForDiagnoses": [
            "odd",
            "adhd",
            "dmdd",
            "pica"
        ],
        "shortDefinition": "KOKGB, DEHB ve çocukluk çağı öfke/karşı gelme sorunlarında ebeveynlere pozitif pekiştirme, tutarlı sınırlar ve etkili yönerge verme becerisi kazandıran programdır.",
        "protocolSteps": [
            "1. İstenen Olumlu Davranışı Yakalama ve Anında Övgü (Praise & Positive Reinforcement)",
            "2. Puan / Jeton Ekonomisi (Token Economy) kurma",
            "3. Net, sakin ve tek seferde tek yönerge verme kuralları",
            "4. Tutarlı ve öfkesiz Mola (Time-Out) ve ayrıcalık kısıtlama protokolleri."
        ],
        "pitfalls": "Ebeveynlerin sadece çocuk yaramazlık yaptığında ceza vermesi olumsuz davranışı pekiştirir; olumlu davranışlar mutlaka anında ödüllendirilmelidir.",
        "targetMechanism": "Operant koşullanma ve ev ortamındaki pekiştireç dengesini dönüştürme."
    },
    {
        "id": "hrt",
        "nameTr": "Alışkanlığı Tersine Çevirme Eğitimi (HRT)",
        "nameEn": "Habit Reversal Training (HRT)",
        "family": "BEHAVIORAL_HABIT",
        "aliases": [
            "HRT",
            "Alışkanlığı Tersine Çevirme",
            "BFRB Terapisi",
            "Yolma Terapisi"
        ],
        "goldForDiagnoses": [
            "trichotillomania",
            "excoriation"
        ],
        "shortDefinition": "Saç yolma (Trikotillomani) ve Deri yolma (Ekskoriasyon) bozukluklarında erken uyarı işaretlerini fark edip yerine 'yarışan bir motor tepki' koyma yöntemidir.",
        "protocolSteps": [
            "1. Farkındalık Eğitimi (Elin saça/deriye gittiği ilk anı ve tetikleyici ortamları tespit etme)",
            "2. Yarışan Tepki Geliştirme (Dürtü geldiğinde elleri yumruk yapıp 1 dakika boyunca sıkma veya stres topu tutma)",
            "3. Uyaran Kontrolü (Aynaları örtme, cımbızları kaldırma, parmak uçlarına bant sarma)",
            "4. Sosyal Destek ve Motivasyon."
        ],
        "pitfalls": "Yarışan tepkinin dışarıdan fark edilmeyecek ve yolma eylemiyle fiziksel olarak bağdaşmayacak bir eylem olması gerekir.",
        "targetMechanism": "Otomatik motor döngünün kırılması ve dürtü dalgasının güvenle atlatılması."
    },
    {
        "id": "cbit",
        "nameTr": "Tikler için Kapsamlı Davranışsal Müdahale (CBIT)",
        "nameEn": "Comprehensive Behavioral Intervention for Tics (CBIT)",
        "family": "BEHAVIORAL_HABIT",
        "aliases": [
            "CBIT",
            "Tik Terapisi",
            "Tourette Davranışsal Müdahale",
            "Tik Tedavisi"
        ],
        "goldForDiagnoses": [
            "tourette"
        ],
        "shortDefinition": "Tourette Bozukluğu ve kronik tiklerde öncül dürtüyü (premonitory urge) tanıyıp tiki engelleyen karşıt fiziksel kas hareketi uygulama yöntemidir.",
        "protocolSteps": [
            "1. Tik Hiyerarşisi ve Öncül Dürtü (Tik öncesi boyun/boğazdaki kaşıntı/gerilimi) Fark Etme",
            "2. Karşıt Tepki (Competing Response) Eğitimi: Boyun tiki için boyun kaslarını sabit tutarak çeneyi hafif göğse yaklaştırma; vokal tik için burundan ritmik derin nefes alma",
            "3. Fonksiyonel Analiz: Tiki artıran stres faktörlerini ve çevresel tetikleyicileri düzenleme",
            "4. Günlük Hayatta Uygulama ve Özgüven İnşası."
        ],
        "pitfalls": "Çocuğa 'tiklerini tut' baskısı yapmak gerilimi tırmandırır; CBIT tiki bastırmak değil, öncül dürtüyü yarışan kasla zararsızca boşaltmaktır.",
        "targetMechanism": "Nöral tik döngüsünü yarışan kas aktivasyonuyla kesintiye uğratma."
    },
    {
        "id": "motivational_interviewing",
        "nameTr": "Motivasyonel Görüşme (Motivational Interviewing - MI)",
        "nameEn": "Motivational Interviewing (MI / Miller & Rollnick)",
        "family": "MOTIVATIONAL_RHYTHM",
        "aliases": [
            "Motivasyonel Görüşme",
            "MI",
            "Değişim Aşamaları",
            "Bağımlılık Terapisi"
        ],
        "goldForDiagnoses": [
            "alcohol_use_disorder",
            "gambling_disorder"
        ],
        "shortDefinition": "Alkol, kumar ve madde bağımlılıklarında danışanın kararsızlığını (ambivalans) çözerek kendi içsel değişim motivasyonunu ortaya çıkaran danışan merkezli yöntemdir.",
        "protocolSteps": [
            "1. OARS İlkeleri: Açık uçlu sorular, Onaylama (Affirmation), Yansıtmalı Dinleme (Reflective Listening), Özetleme",
            "2. Değişim Konuşmasını (Change Talk) tetikleme ve pekiştirme",
            "3. Dirençle Dans Etme (Hastayla asla münakaşaya/tartışmaya girmeme)",
            "4. Değişim Planı oluşturma ve Nüks Önleme (Relapse Prevention) stratejileri."
        ],
        "pitfalls": "Terapistin otoriter bir tavırla 'İçmeyi hemen bırakmalısın, yoksa ölürsün' şeklinde öğüt vermesi direnci tırmandırır.",
        "targetMechanism": "Ambivalansı çözümleyerek içsel motivasyonu ve öz-yeterliği harekete geçirme."
    },
    {
        "id": "ipsrt",
        "nameTr": "Kişilerarası ve Sosyal Ritim Terapisi (IPSRT)",
        "nameEn": "Interpersonal and Social Rhythm Therapy (IPSRT)",
        "family": "MOTIVATIONAL_RHYTHM",
        "aliases": [
            "IPSRT",
            "Sosyal Ritim Terapisi",
            "Bipolar Terapi",
            "Sirkadiyen Ritim Terapisi"
        ],
        "goldForDiagnoses": [
            "bipolar_1",
            "bipolar_2",
            "cyclothymia"
        ],
        "shortDefinition": "Bipolar Bozuklukta manik ve depresif atakları tetikleyen biyolojik sirkadiyen saat bozulmalarını sabitlemek için uyku, yemek ve sosyal rutinleri sabitleyen terapidir.",
        "protocolSteps": [
            "1. Sosyal Ritim Metresi (SRM) ile günlük uyku, uyanma, ilk yemek ve ilk sosyal temas saatlerini kaydetme",
            "2. Uyku-Uyanıklık ritmini katı bir şekilde sabitleme (hafta sonu dahil aynı saatte yatıp kalkma)",
            "3. Manik/Depresif erken uyarı işaretlerini tespit etme (prodromal belirti planı)",
            "4. Kişilerarası stresörleri çözerek biyolojik ritmin bozulmasını önleme."
        ],
        "pitfalls": "Hasta kendisini çok enerjik hissettiğinde gece geç saatlere kadar çalışmasına izin verilirse mani atağı kaçınılmaz olur; uyku süresi korunmalıdır.",
        "targetMechanism": "Biyolojik saat genleri ve sirkadiyen ritim stabilizasyonu."
    },
    {
        "id": "cbt_ar",
        "nameTr": "Kaçıngan/Kısıtlı Yeme için BDT (CBT-AR)",
        "nameEn": "CBT for Avoidant/Restrictive Food Intake Disorder (CBT-AR)",
        "family": "CBT_COGNITIVE",
        "aliases": [
            "CBT-AR",
            "ARFID Terapisi",
            "Kaçıngan Yeme BDT",
            "Duyusal Yeme Terapisi"
        ],
        "goldForDiagnoses": [
            "pica"
        ],
        "shortDefinition": "ARFID tanılı çocuk ve yetişkinlerde kilo kaygısı olmaksızın yiyeceğin duyusal özelliklerine (koku, doku, renk) karşı duyulan kaçınmayı kademeli maruziyetle kıran terapidir.",
        "protocolSteps": [
            "1. Psikoeğitim ve Besin Eksikliklerinin Tespiti",
            "2. Duyusal Maruz Bırakma Basamakları: Yeni gıdayı önce masaya koyma, koklama, dokunma, dudak değdirme, çiğneyip çıkarma ve yutma",
            "3. Güvenli gıdalar listesinden yeni besin gruplarına köprü kurma (Food Chaining)",
            "4. Korkulan sonuçlarla (boğulma, kusma korkusu) davranışsal deneylerle yüzleşme."
        ],
        "pitfalls": "Danışanı zorla büyük porsiyonlar yemeye zorlamak travmatik kaçınmayı artırır; mikro temas adımları izlenmelidir.",
        "targetMechanism": "Oral duyusal duyarsızlaşma ve neofobi (yeni gıda korkusu) sönmesi."
    },
    {
        "id": "act",
        "nameTr": "Kabul ve Kararlılık Terapisi (ACT)",
        "nameEn": "Acceptance and Commitment Therapy (ACT / Steven Hayes)",
        "family": "THIRD_WAVE",
        "aliases": [
            "ACT",
            "Kabul ve Kararlılık",
            "Psikolojik Esneklik",
            "Hexaflex"
        ],
        "goldForDiagnoses": [
            "depersonalization_derealization",
            "excoriation"
        ],
        "shortDefinition": "Zorlayıcı düşünce ve bedensel duyumları yok etmeye çalışmak yerine onları yargısızca kabul edip değerler doğrultusunda anlamlı eylemlere odaklanmayı sağlayan terapidir.",
        "protocolSteps": [
            "1. Yaratıcı Umutsuzluk (Düşünceleri kontrol etme çabalarının işe yaramadığını fark etme)",
            "2. Bilişsel Ayrışma (Cognitive Defusion: Düşüncelerin sadece kelimelerden ibaret olduğunu görme)",
            "3. Kabul ve Anda Kalma (Grounding / Topraklanma egzersizleri ile bedene dönme)",
            "4. Değerler Hiyerarşisi ve Değer Odaklı Kararlı Eylemler."
        ],
        "pitfalls": "Depersonalizasyon yaşayan danışanın 'Ben gerçek miyim?' düşünceleriyle tartışmaya girmek yabancılaşmayı artırır; bilişsel ayrışma ve topraklanma uygulanmalıdır.",
        "targetMechanism": "Psikolojik esneklik (Psychological Flexibility) geliştirme."
    },
    {
        "id": "phase_trauma_did",
        "nameTr": "Faz Odaklı Travma & Dissosiyasyon Terapisi (Klüft Modeli)",
        "nameEn": "Phase-Oriented Trauma Therapy for DID",
        "family": "TRAUMA_DISSOCIATION",
        "aliases": [
            "Faz Odaklı Terapi",
            "DKB Terapisi",
            "Klüft Modeli",
            "Dissosiyasyon Terapisi"
        ],
        "goldForDiagnoses": [
            "did"
        ],
        "shortDefinition": "Dissosiyatif Kimlik Bozukluğunda alter kimlikler arasında işbirliği kurarak travmatik anıları işleyen ve kimlik entegrasyonunu hedefleyen 3 aşamalı terapidir.",
        "protocolSteps": [
            "1. Faz: Güvenlik, Stabilizasyon ve Semptom Azaltma (Alter kimlikleri tanıma ve içsel işbirliği)",
            "2. Faz: Travmatik Anıların Tedrici Olarak İşlenmesi ve Sentezi",
            "3. Faz: Kimliklerin Entegrasyonu / Birleşmesi ve Yeni Yaşama Uyum."
        ],
        "pitfalls": "Hasta stabil hale gelmeden ve alterler arası iletişim kurulmadan erken travma açılması ağır dissosiyatif krizlere yol açar.",
        "targetMechanism": "Bölünmüş kimlik durumlarının bütünsel bir kendilik altında entegrasyonu."
    },
    {
        "id": "stimulus_fading",
        "nameTr": "Uyaran Kaydırma & Kademeli İletişim (Stimulus Fading)",
        "nameEn": "Stimulus Fading Technique",
        "family": "CBT_EXPOSURE",
        "aliases": [
            "Uyaran Kaydırma",
            "Stimulus Fading",
            "Selektif Mutizm Terapisi",
            "Kademeli Konuşma"
        ],
        "goldForDiagnoses": [
            "selective_mutism"
        ],
        "shortDefinition": "Seçici Konuşmazlıkta çocuğun rahat konuştuğu ebeveyninden başlayarak ortama öğretmeni ve arkadaşlarını milimetrik adımlarla dahil eden davranışçı tekniktir.",
        "protocolSteps": [
            "1. Çocuk boş bir sınıfta sadece annesiyle konuşurken oyun oynar",
            "2. Öğretmen sınıfın kapısının dışında durur, çocuk konuşmaya devam ettikçe içeri birkaç adım atar",
            "3. Öğretmen göz teması kurmadan masaya oturur ve anneyle birlikte oyuna katılır",
            "4. Anne ortamdan yavaşça çekilirken çocuk öğretmenle doğrudan konuşur hale gelir."
        ],
        "pitfalls": "Çocuğa doğrudan 'Hadi öğretmenine bir merhaba de' şeklinde doğrudan baskı yapmak anksiyeteyi tırmandırır ve konuşmayı kilitler.",
        "targetMechanism": "Konuşma davranışının kademeli olarak yeni sosyal uyaranlara genellenmesi."
    },
    {
        "id": "mst",
        "nameTr": "Çoklu Sistemik Terapi (Multisystemic Therapy - MST)",
        "nameEn": "Multisystemic Therapy (MST)",
        "family": "SYSTEMIC_FAMILY",
        "aliases": [
            "MST",
            "Çoklu Sistemik Terapi",
            "Adli Ergen Terapisi",
            "Çete ve Davranım Terapisi"
        ],
        "goldForDiagnoses": [
            "conduct_disorder"
        ],
        "shortDefinition": "Ağır Davranım Bozukluğu ve kriminal suç riski olan ergenlerde aile, okul, mahalle ve akran sistemlerini eşzamanlı hedefleyen 7/24 yoğun müdahale programıdır.",
        "protocolSteps": [
            "1. Suça karışan olumsuz akran grubundan ergenin tamamen koparılması",
            "2. Aile denetiminin ve disiplin takibinin 7/24 yapılandırılması",
            "3. Okul devamlılığının ve pozitif sosyal etkinliklerin (spor, sanat) inşası",
            "4. Aile içi çatışmaları çözme ve ebeveyn otoritesini güçlendirme."
        ],
        "pitfalls": "Sadece genci bireysel terapi odasına almak suç ortamı devam ettiği sürece etkisizdir; tüm çevresel sistemler dönüştürülmelidir.",
        "targetMechanism": "Ekolojik risk faktörlerinin ortadan kaldırılması ve prososyal çevrenin inşası."
    },
    {
        "id": "hoarding_cbt",
        "nameTr": "İstifleme Bozukluğuna Özgü BDT (Steketee & Frost Modeli)",
        "nameEn": "CBT for Hoarding Disorder (Steketee & Frost)",
        "family": "CBT_COGNITIVE",
        "aliases": [
            "İstifleme BDT",
            "Steketee Modeli",
            "Hoarding CBT",
            "Eşya Ayıklama Terapisi"
        ],
        "goldForDiagnoses": [
            "hoarding_disorder"
        ],
        "shortDefinition": "Biriktiricilik bozukluğunda yeni eşya edinmeyi durdurma, karar verme becerilerini geliştirme ve evde kademeli eşya atma egzersizleri uygulayan özgül BDT modelidir.",
        "protocolSteps": [
            "1. Yeni Eşya Edinmeme Kuralları (Mağaza ve hurdacı ziyaretlerini durdurma)",
            "2. Ev Ziyaretleri ve Yaşam Alanlarını Kategorilere Ayırma",
            "3. Kademeli Atma ve Geri Dönüşüme Verme Egzersizleri (Atma sıkıntısına tahammül geliştirme)",
            "4. Nesnelere yüklenen 'ileride lazım olur' ve duygusal bağ şemalarını sorgulama."
        ],
        "pitfalls": "Hastanın rızası olmadan ailesinin evi gizlice temizlemesi hastada ağır travmaya ve daha agresif biriktirmeye yol açar.",
        "targetMechanism": "Karar verme infleksibilitesini kırma ve nesne ayrılık anksiyetesini duyarsızlaştırma."
    },
    {
        "id": "ipt",
        "nameTr": "Kişilerarası İlişkiler Terapisi (IPT)",
        "nameEn": "Interpersonal Psychotherapy (IPT / Klerman & Weissman)",
        "family": "SCHEMA_DYNAMIC",
        "aliases": [
            "IPT",
            "Kişilerarası Terapi",
            "Klerman Modeli",
            "İlişki Odaklı Terapi"
        ],
        "goldForDiagnoses": [
            "adjustment_disorder",
            "mdd"
        ],
        "shortDefinition": "Depresyon ve uyum bozukluklarında belirtileri 4 temel kişilerarası odak alanı (Yas, Rol Geçişleri, Kişilerarası Anlaşmazlıklar, İletişim Eksiklikleri) üzerinden çözen yapılandırılmış terapidir.",
        "protocolSteps": [
            "1. Kişilerarası Envanter Çıkarma ve 4 Odak Alanından Birini Seçme",
            "2. Rol Geçişi / Kayıp Üzerinde Çalışma (Eski rolün kaybının yasını tutma, yeni role uyum sağlama)",
            "3. İletişim Analizi ve Girişkenlik Eğitimi",
            "4. Gelecekteki ilişki krizleri için başa çıkma stratejileri."
        ],
        "pitfalls": "Bilişsel şemalara odaklanmak yerine doğrudan güncel kişilerarası ilişki dinamiklerine odaklanılmalıdır.",
        "targetMechanism": "Sosyal destek sistemlerini güçlendirerek duygudurum iyileşmesi sağlama."
    },
    {
        "id": "cbt_general",
        "nameTr": "Bilişsel Davranışçı Terapi (BDT / Beck Modeli)",
        "nameEn": "Cognitive Behavior Therapy (CBT / Aaron Beck)",
        "family": "CBT_COGNITIVE",
        "aliases": [
            "BDT",
            "CBT",
            "Bilişsel Terapi",
            "Beck Terapisi",
            "Otomatik Düşünceler"
        ],
        "goldForDiagnoses": [
            "gad",
            "pmdd",
            "bdd",
            "kleptomania",
            "pyromania",
            "intermittent_explosive",
            "somatic_symptom_disorder",
            "illness_anxiety_disorder",
            "conversion_disorder"
        ],
        "shortDefinition": "Düşünce, duygu ve davranış arasındaki döngüyü inceleyerek olumsuz otomatik düşünceleri, bilişsel çarpıtmaları (felaketleştirme, ya hep ya hiç) Sokratik sorgulama ve davranışsal deneylerle esneten temel terapidir.",
        "protocolSteps": [
            "1. Bilişsel Kavramsallaştırma (Tetikleyici Olay -> Otomatik Düşünce -> Duygu -> Davranış)",
            "2. Düşünce Kaydı Tutma ve Bilişsel Çarpıtmaları Yakalama",
            "3. Kanıt İnceleme ve Sokratik Sorgulama ('Bunun böyle olduğuna dair kanıtın ne?')",
            "4. Davranışsal Deneyler (Behavioral Experiments) ile yeni inançları test etme."
        ],
        "pitfalls": "Terapistin danışana 'Pozitif düşünmelisin' şeklinde telkinde bulunması BDT değildir; amaç pozitif değil GERÇEKÇİ ve İŞLEVSEL düşünmektir.",
        "targetMechanism": "Bilişsel yeniden yapılandırma ve inanç esnekliği."
    },
    {
        "id": "psychodynamic",
        "nameTr": "Psikodinamik & Destekleyici Psikoterapi",
        "nameEn": "Psychodynamic and Supportive Psychotherapy",
        "family": "SCHEMA_DYNAMIC",
        "aliases": [
            "Psikodinamik Terapi",
            "Destekleyici Terapi",
            "Psikanalitik Terapi",
            "Dinamik Terapi"
        ],
        "goldForDiagnoses": [
            "histrionic_pd",
            "schizoid_pd",
            "conversion_disorder",
            "factitious_disorder"
        ],
        "shortDefinition": "Bilinçdışı savunma düzeneklerini, içsel çatışmaları ve aktarım-karşı aktarım dinamiklerini keşfederek egoyu güçlendiren ve içgörü kazandıran psikoterapi ekolüdür.",
        "protocolSteps": [
            "1. Terapötik İttifak ve Güvenli Çerçeve Oluşturma",
            "2. Savunma Mekanizmalarının (Bastırma, Bölme, Yansıtma, İnkar) Analizi",
            "3. Aktarım (Transference) ve Karşı-Aktarımın Seans İçi Yorumlanması",
            "4. Katarsis ve İçgörü Yoluyla Ego Bütünleşmesi Sağlama."
        ],
        "pitfalls": "Ağır krizdeki veya psikotik kırılganlığı olan hastada aşırı yüzleştirme yapılmamalı; destekleyici ve ego güçlendirici tutum korunmalıdır.",
        "targetMechanism": "Bilinçdışı çatışmaların bilince getirilmesi ve olgun savunma mekanizmalarının gelişimi."
    },
    {
        "id": "cbt_i",
        "nameTr": "Uykusuzluk için BDT (CBT-I / Morin Protokolü)",
        "nameEn": "Cognitive Behavior Therapy for Insomnia (CBT-I)",
        "family": "CBT_COGNITIVE",
        "aliases": [
            "CBT-I",
            "İnsomni BDT",
            "Uyaran Kontrolü",
            "Uyku Kısıtlama"
        ],
        "goldForDiagnoses": [
            "insomnia_disorder"
        ],
        "shortDefinition": "Kronik uykusuzlukta (İnsomni) yatak-uyku şartlanmasını onaran, uyaran kontrolü ve uyku kısıtlama protokollerini uygulayan altın standart birinci basamak terapidir.",
        "protocolSteps": [
            "1. Uyaran Kontrolü (Yatakta sadece uyuma, 20 dakikada uyunamazsa yataktan kalkma)",
            "2. Uyku Kısıtlama Terapisi (Uyku verimliliğini %85 üzerine çıkarmak için yatakta kalış süresini kısıtlama)",
            "3. Uyku Hijyeni ve Bilişsel Yeniden Yapılandırma ('Bu gece uyuyamazsam yarın mahvolurum' felaketleştirmesini esnetme)",
            "4. Gevşeme Egzersizleri ve Uyku Günlüğü Analizi."
        ],
        "pitfalls": "Danışanın 'uyuyamadım' diyerek gündüz şekerleme yapmasına izin vermek gece uyku baskısını sıfırlar; gündüz uyumak kesinlikle yasaklanmalıdır.",
        "targetMechanism": "Homeostatik uyku baskısını artırma ve yatakla uyanıklık arasındaki koşullanmayı kırma."
    },
    {
        "id": "irt",
        "nameTr": "İmgeleme Provası Terapisi (IRT / Krakow Modeli)",
        "nameEn": "Imagery Rehearsal Therapy for Nightmares (IRT)",
        "family": "CBT_COGNITIVE",
        "aliases": [
            "IRT",
            "Kabus Terapisi",
            "İmgeleme Provası",
            "Imagery Rehearsal"
        ],
        "goldForDiagnoses": [
            "nightmare_disorder"
        ],
        "shortDefinition": "Tekrarlayan travmatik kabuslarda kabusun senaryosunu gündüz uyanıkken olumlu ve kontrol edilebilir bir sonla yeniden yazıp zihinde prova etme yöntemidir.",
        "protocolSteps": [
            "1. Tekrarlayan kabusun ayrıntılı olarak yazılması",
            "2. Kabusun korkutucu sonunun danışan tarafından güvenli, olumlu ve tatmin edici bir sonla değiştirilmesi",
            "3. Yeni olumlu senaryonun günde en az 15-20 dakika zihinde canlı olarak provasının yapılması",
            "4. Gece uykuya dalarken yeni senaryonun hatırlanması."
        ],
        "pitfalls": "Yeni senaryo oluşturulurken danışanın yine çaresiz hissedeceği bir detay bırakılmamalı; tam kontrol hissi pekiştirilmelidir.",
        "targetMechanism": "Kabus hafıza izinin yeni nöral bağlantılarla yeniden konsolide edilmesi."
    },
    {
        "id": "sensate_focus",
        "nameTr": "Duyusal Odaklanma & Cinsel Terapi (Masters & Johnson)",
        "nameEn": "Sensate Focus and Psychosexual Therapy",
        "family": "CBT_EXPOSURE",
        "aliases": [
            "Sensate Focus",
            "Cinsel Terapi",
            "Duyusal Odaklanma",
            "Masters Johnson"
        ],
        "goldForDiagnoses": [
            "genito_pelvic_pain",
            "premature_ejaculation",
            "erectile_disorder"
        ],
        "shortDefinition": "Cinsel işlev bozukluklarında penetrasyon ve performans hedefini geçici olarak yasaklayarak bedensel dokunma duyumlarına ve hazza odaklanmayı sağlayan kademeli egzersizlerdir.",
        "protocolSteps": [
            "1. Evre: Cinsel birleşme ve genital dokunmanın kesinlikle yasaklandığı non-genital masaj ve temas",
            "2. Evre: Genital dokunmanın dahil edildiği ancak orgazm ve birleşme baskısının olmadığı aşama",
            "3. Evre: Kademeli penetrasyon, Dur-Başlat / Sıkma teknikleri veya vajinismus için pelvik dilatör maruziyeti",
            "4. Performans Anksiyetesini Bilişsel Olarak Çürütme."
        ],
        "pitfalls": "Ev ödevlerinde çiftin acele edip yasaklanan cinsel birleşmeyi denemesi performans kaygısını hortlatır; basamaklar disiplinle takip edilmelidir.",
        "targetMechanism": "Seyirci kalma (spectatoring) anksiyetesini söndürerek parasempatik uyarılmayı sağlama."
    },
    {
        "id": "cbt_psychosis",
        "nameTr": "Bilişsel Davranışçı Psikoz Terapisi (CBTp)",
        "nameEn": "Cognitive Behavioral Therapy for Psychosis (CBTp)",
        "family": "CBT_COGNITIVE",
        "aliases": [
            "CBTp",
            "Psikoz BDT'si",
            "Sanrılar için Gerçeklik Sınaması"
        ],
        "goldForDiagnoses": [
            "capgras_syndrome",
            "delusional_disorder",
            "schizophrenia"
        ],
        "shortDefinition": "Sanrılar ve halüsinasyonların yarattığı sıkıntıyı azaltmak ve alternatif rasyonel açıklamalar geliştirmek için uygulanan kanıta dayalı terapidir.",
        "protocolSteps": [
            "1. Güvenli terapötik işbirliği ve empati kurma",
            "2. Sanrılı inancı doğrudan yargılamadan kanıtları sorgulama (Sokratik Sorgulama)",
            "3. Stres ve duyusal kopuklukla baş etme becerileri",
            "4. Nüks önleme ve içgörü geliştirme."
        ],
        "pitfalls": "Terapistin sanrıyla doğrudan tartışmaya girmesi danışanın direnç göstermesine yol açar.",
        "targetMechanism": "Bilişsel esneklik ve alternatif hipotez üretimi."
    },
    {
        "id": "ect_biological",
        "nameTr": "Biyolojik Tedavi & EKT (Elektrokonvülsif Terapi)",
        "nameEn": "Electroconvulsive Therapy & Biological Stabilization",
        "family": "THIRD_WAVE",
        "aliases": [
            "EKT",
            "Elektroşok",
            "Biyolojik Tedavi"
        ],
        "goldForDiagnoses": [
            "cotard_syndrome",
            "mdd_with_psychotic",
            "catatonia_associated"
        ],
        "shortDefinition": "Ağır psikotik depresyon, Cotard sendromu ve katatonide hayat kurtarıcı en hızlı etkili biyolojik yöntemdir.",
        "protocolSteps": [
            "1. Anestezi ve kas gevşetici altında bilateral/unilateral seans planı",
            "2. Haftada 2-3 seans toplam 6-12 seans uygulama",
            "3. Bilişsel takip ve antipsikotik/antidepresan idamesi."
        ],
        "pitfalls": "Geçici yakın bellek bulanıklığı olabilir, hasta ve aileye önceden anlatılmalıdır.",
        "targetMechanism": "Yaygın nörotransmitter sıfırlaması ve nöroplastisite artışı."
    },
    {
        "id": "medical_stabilization",
        "nameTr": "Acil Tıbbi Stabilizasyon & Antidot Protokolü",
        "nameEn": "Emergency Medical Stabilization & Antidote Protocol",
        "family": "BEHAVIORAL_HABIT",
        "aliases": [
            "Acil Tıbbi Müdahale",
            "Dantrolen/Bromokriptin",
            "Siproheptadin"
        ],
        "goldForDiagnoses": [
            "neuroleptic_malignant_syndrome",
            "serotonin_syndrome"
        ],
        "shortDefinition": "Nöroleptik Malign Sendrom veya Serotonin Sendromu gibi ölümcül toksisitelerde tetikleyici ilacın derhal kesilmesi ve spesifik antidotların verilmesidir.",
        "protocolSteps": [
            "1. Şüpheli tüm psikotrop ilaçların derhal stoplanması",
            "2. Yoğun bakımda hidrasyon, soğutma ve hemodinamik monitörizasyon",
            "3. NMS için Dantrolen/Bromokriptin; Serotonin Sendromu için Siproheptadin uygulaması."
        ],
        "pitfalls": "Tablonun enfeksiyon veya basit anksiyete sanılarak geciktirilmesi hayati risk yaratır.",
        "targetMechanism": "Dopamin/Serotonin dengesinin ve otonomik sistemin kurtarılması."
    },
    {
        "id": "sleep_hygiene_stimulants",
        "nameTr": "Davranışsal Uyku Yönetimi & Nörostimülan Protokolü",
        "nameEn": "Behavioral Sleep Management & Neurostimulants",
        "family": "MOTIVATIONAL_RHYTHM",
        "aliases": [
            "Narkolepsi Yönetimi",
            "Planlı Şekerleme",
            "Modafinil Protokolü"
        ],
        "goldForDiagnoses": [
            "narcolepsy"
        ],
        "shortDefinition": "Narkolepside gündüz uyku ataklarını kontrol etmek için planlı kısa şekerlemeler ve uyanıklık artırıcı farmakoterapi kombinasyonudur.",
        "protocolSteps": [
            "1. Günde 2 kez 15'er dakikalık planlı stratejik gündüz şekerlemeleri",
            "2. Sabit gece uyku saati ve katapleksi tetikleyicileriyle çalışma",
            "3. Modafinil/Sodyum Oksibat medikal desteği."
        ],
        "pitfalls": "Ağır yemekler ve düzensiz uyku saatleri atakları tetikler.",
        "targetMechanism": "Uyanıklık regülasyonu ve oreksin eksikliğini kompanse etme."
    },
    {
        "id": "safety_clonazepam",
        "nameTr": "Yatak Odası Güvenlik Protokolü & Klonazepam",
        "nameEn": "Bedroom Safety Protocol & Pharmacotherapy",
        "family": "BEHAVIORAL_HABIT",
        "aliases": [
            "RBD Güvenlik Protokolü",
            "Yatak Güvenliği"
        ],
        "goldForDiagnoses": [
            "rem_sleep_behavior_disorder",
            "sleepwalking_disorder"
        ],
        "shortDefinition": "RBD hastalarında yaralanmaları önlemek için çevresel güvenlik önlemleri ve REM kas atonisini restore eden tedavidir.",
        "protocolSteps": [
            "1. Yatak çevresindeki sivri komodinlerin kaldırılması, yere yatak serilmesi",
            "2. Pencerelerin kilitlenmesi ve partnerin ayrı yatakta yatması önlemi",
            "3. Gece düşük doz Klonazepam veya yüksek doz Melatonin."
        ],
        "pitfalls": "Önlem alınmadığında ağır kafa travmaları ve partner yaralanmaları kaçınılmazdır.",
        "targetMechanism": "Motor disinhibisyonun baskılanması ve çevre güvenliği."
    },
    {
        "id": "caregiver_behavioral",
        "nameTr": "Davranışsal Çevre Yönetimi & Bakıcı Desteği",
        "nameEn": "Behavioral Environmental Management & Caregiver Support",
        "family": "SYSTEMIC_FAMILY",
        "aliases": [
            "Demans Çevre Yönetimi",
            "Frontotemporal Bakıcı Psiko-eğitimi"
        ],
        "goldForDiagnoses": [
            "major_neurocognitive_frontotemporal"
        ],
        "shortDefinition": "Frontotemporal demansta kontrolsüz dürtüleri ve hiperoraliteyi engellemek için ortamı güvenli hale getirme protokolüdür.",
        "protocolSteps": [
            "1. Evdeki para, anahtar ve tehlikeli maddelere erişimin kilitlenmesi",
            "2. Mutfakta kilitli dolaplar ve porsiyon kontrollü beslenme",
            "3. Çatışmasız dikkat yönlendirme ve bakıcı tükenmişliğini önleme."
        ],
        "pitfalls": "Hastayla mantık tartışmasına girmek ajitasyonu tırmandırır.",
        "targetMechanism": "Dürtüsel davranışların zararlarını çevresel olarak sınırlandırma."
    },
    {
        "id": "surgical_shunt",
        "nameTr": "Ventriküloperitoneal Şant Cerrahisi & Nörorehabilitasyon",
        "nameEn": "Ventriculoperitoneal Shunt Surgery & Neurorehabilitation",
        "family": "THIRD_WAVE",
        "aliases": [
            "Şant Ameliyatı",
            "NPH Tedavisi",
            "VP Şant"
        ],
        "goldForDiagnoses": [
            "major_neurocognitive_nph"
        ],
        "shortDefinition": "Normal Basınçlı Hidrosefalide (NPH) ventriküllerdeki aşırı BOS'u karın boşluğuna boşaltarak demansı ve yürüme bozukluğunu geri döndüren cerrahi yöntemdir.",
        "protocolSteps": [
            "1. Tanısal LP Tap Testi ile düzelmenin kanıtlanması",
            "2. Ventriküloperitoneal Şant takılması",
            "3. Ameliyat sonrası yürüme ve mesane fizyoterapisi."
        ],
        "pitfalls": "Geç kalındığında ventrikül basısı kalıcı nöronal hasara yol açar.",
        "targetMechanism": "İntrakraniyal BOS dinamiğinin mekanik restorasyonu."
    },
    {
        "id": "speech_therapy",
        "nameTr": "Konuşma Terapisi (Lidcombe & Akıcılık Şekillendirme)",
        "nameEn": "Speech Therapy (Lidcombe Program & Fluency Shaping)",
        "family": "BEHAVIORAL_HABIT",
        "aliases": [
            "Kekemelik Terapisi",
            "Dil ve Konuşma Terapisi",
            "Lidcombe Programı"
        ],
        "goldForDiagnoses": [
            "childhood_fluency_disorder",
            "language_disorder"
        ],
        "shortDefinition": "Kekemelikte akıcı konuşmayı pekiştiren, yumuşak sesletim ve nefes kontrolü sağlayan kanıta dayalı yöntemdir.",
        "protocolSteps": [
            "1. Ebeveyn rehberliğinde akıcı konuşmaların sevecen geri bildirimle pekiştirilmesi",
            "2. Yumuşak başlangıç (soft articulatory contact) teknikleri",
            "3. Nefes ve konuşma hızını senkronize etme",
            "4. Sosyal ortamlara akıcılığı genelleştirme."
        ],
        "pitfalls": "Çocuğa sürekli 'Sakin ol, yavaş konuş' diyerek baskı yapmak stresi ve blokları artırır.",
        "targetMechanism": "Konuşma motor çıktısının yeniden koşullanması."
    },
    {
        "id": "special_education",
        "nameTr": "Çok Duyulu Yapılandırılmış Özel Eğitim (Orton-Gillingham)",
        "nameEn": "Multisensory Structured Literacy (Orton-Gillingham)",
        "family": "CBT_COGNITIVE",
        "aliases": [
            "Disleksi Eğitimi",
            "Orton-Gillingham",
            "Yapılandırılmış Okuma"
        ],
        "goldForDiagnoses": [
            "specific_learning_dyslexia",
            "specific_learning_dysgraphia"
        ],
        "shortDefinition": "Disleksili bireylerde harf ve sesleri görsel, işitsel ve kinestetik kanallarla eşzamanlı öğreten altın standart okuma eğitimidir.",
        "protocolSteps": [
            "1. Fonolojik farkındalık ve ses ayrıştırma egzersizleri",
            "2. Harfleri kuma yazma, sesini söyleme ve görme (VAK / Görsel-İşitsel-Kinestetik)",
            "3. Kural temelli heceleme ve sözcük çözümleme",
            "4. Akıcı okuma çalışmaları ve özgüven desteği."
        ],
        "pitfalls": "Ezbere dayalı klasik okuma tekrarları disleksili çocukta çaresizlik yaratır.",
        "targetMechanism": "Alternatif nöral okuma yollarının (sağ hemisfer ve frontal telafi) inşası."
    },
    {
        "id": "occupational_coop",
        "nameTr": "CO-OP / Bilişsel Yönelimli Mesleki Terapi (Ergoterapi)",
        "nameEn": "Cognitive Orientation to daily Occupational Performance (CO-OP)",
        "family": "BEHAVIORAL_HABIT",
        "aliases": [
            "Ergoterapi",
            "CO-OP Yaklaşımı",
            "Dispraksi Terapisi"
        ],
        "goldForDiagnoses": [
            "developmental_coordination_disorder"
        ],
        "shortDefinition": "Koordinasyon bozukluğu olan çocuklara 'Hedef-Plan-Yap-Kontrol Et' stratejisiyle günlük motor görevleri öğreten ergoterapi modelidir.",
        "protocolSteps": [
            "1. Çocuğun öğrenmek istediği 3 hedef belirleme (ayakkabı bağlama, bisiklet sürme)",
            "2. Hareketin aşamalarını bilişsel olarak analiz etme",
            "3. Dinamik performans analizi ile ipuçları verme",
            "4. Başarılı performansı prova ederek otomatikleştirme."
        ],
        "pitfalls": "Çocuğun yerine işleri ebeveynin yapması motor öğrenmeyi engeller.",
        "targetMechanism": "Üstbilişsel stratejilerle motor planlama açığını kapatma."
    },
    {
        "id": "sleep_safety_cbt",
        "nameTr": "Uyku Güvenliği, Klonazepam & Stres Azaltma Protokolü",
        "nameEn": "Sleep Safety, Pharmacotherapy & Stress Reduction",
        "family": "BEHAVIORAL_HABIT",
        "aliases": [
            "Seksomni Yönetimi",
            "NREM Güvenlik Protokolü"
        ],
        "goldForDiagnoses": [
            "sexsomnia"
        ],
        "shortDefinition": "Seksomni ve uyurgezerlik vakalarında adli riskleri ve yaralanmaları sıfırlamak için çevre güvenliği ve NREM derinliğini düzenleme protokolüdür.",
        "protocolSteps": [
            "1. Yatak odası kapısına alarm/zil takılması ve ayrı uyuma düzeni",
            "2. Uyku yoksunluğu ve alkol gibi tetikleyicilerin sıfırlanması",
            "3. Klonazepam tedavisi ile NREM uyanma eşiğinin dengelenmesi."
        ],
        "pitfalls": "Tetikleyiciler devam ederken sadece psikoterapi yetersiz kalır.",
        "targetMechanism": "NREM uyanma kararsızlığının giderilmesi."
    },
    {
        "id": "vmat2_inhibitor",
        "nameTr": "VMAT2 İnhibitörü Tedavisi & Antipsikotik Optimizasyonu",
        "nameEn": "VMAT2 Inhibitors (Valbenazine/Deutetrabenazine) & Dose Optimization",
        "family": "BEHAVIORAL_HABIT",
        "aliases": [
            "Valbenazin",
            "Tardif Diskinezi Tedavisi",
            "VMAT2 İnhibitörü"
        ],
        "goldForDiagnoses": [
            "tardive_dyskinesia"
        ],
        "shortDefinition": "Tardif diskinezide istemsiz yüz ve dil hareketlerini durdurmak için presinaptik veziküler monoamin taşıyıcıyı (VMAT2) bloke eden onaylı tedavidir.",
        "protocolSteps": [
            "1. Antipsikotik dozunun gözden geçirilmesi ve mümkünse atipik ilaca (Klozapin) geçiş",
            "2. Valbenazin veya Dötetrabenazin başlanması",
            "3. AIMS (Anormal İstemsiz Hareketler Ölçeği) ile düzenli takip."
        ],
        "pitfalls": "Antikolinerjik ilaçlar (Akineton vb.) tardif diskineziyi daha da KÖTÜLEŞTİRİR, kesinlikle kesilmelidir.",
        "targetMechanism": "Presinaptik dopamin salınımını azaltarak aşırı duyarlı reseptörleri rahatlatma."
    },
    {
        "id": "parent_training",
        "nameTr": "Bağlanma & Davranış Odaklı Ebeveyn Eğitimi (PMT / ABC)",
        "nameEn": "Parent Management & Attachment-Based Training",
        "family": "SYSTEMIC_FAMILY",
        "aliases": [
            "Ebeveyn Eğitimi",
            "Bağlanma Odaklı Aile Terapisi",
            "Parent Training"
        ],
        "goldForDiagnoses": [
            "reactive_attachment_disorder",
            "disinhibited_social_engagement",
            "encopresis",
            "odd"
        ],
        "shortDefinition": "Çocukluk çağı bağlanma, dışa atım ve davranış bozukluklarında bakımverenin duyarlılığını, sınır koyma becerilerini ve pozitif pekiştirme sistemini yapılandıran kanıta dayalı müdahaledir.",
        "protocolSteps": [
            "1. Güvenli, sıcak ve öngörülebilir ebeveyn-çocuk etkileşimi kurma",
            "2. Cezalandırıcı ve utandırıcı tutumları tamamen sonlandırma",
            "3. Somut sosyal sınırlar ve rutin tuvalet/davranış çizelgeleri oluşturma",
            "4. Olumlu davranışları anında ödüllendirme (Yıldız/Jeton Ekonomisi)."
        ],
        "pitfalls": "Çocuğu suçlamak veya soğuk/cezalandırıcı disiplin uygulamak bağlanma ve dışa atım sorunlarını daha da derinleştirir.",
        "targetMechanism": "Güvenli bağlanma inşası ve operant pozitif pekiştirme."
    },
    {
        "id": "phase_oriented_trauma",
        "nameTr": "Faz Odaklı Travma & Dissosiyasyon Terapisi",
        "nameEn": "Phase-Oriented Trauma and Dissociation Therapy",
        "family": "TRAUMA_DISSOCIATION",
        "aliases": [
            "Faz Odaklı Travma Terapisi",
            "Dissosiyatif Füg Terapisi",
            "Pierre Janet Modeli"
        ],
        "goldForDiagnoses": [
            "dissociative_fugue",
            "dissociative_amnesia",
            "did"
        ],
        "shortDefinition": "Dissosiyatif füg ve amnezide önce güvenliği ve stabilizasyonu sağlayan, ardından kopmuş otobiyografik anıları ve kimliği bütünleştiren 3 aşamalı terapidir.",
        "protocolSteps": [
            "1. Faz: Güvenlik, fiziksel/duygusal stabilizasyon ve stresör kontrolü",
            "2. Faz: Dissosiyatif kopmaya yol açan travmatik/stresli olayın kademeli işlenmesi ve bellek geri kazanımı",
            "3. Faz: Otobiyografik kimlik bütünleşmesi ve nüks önleme."
        ],
        "pitfalls": "Hasta kendini güvende hissetmeden kimlik ve travma anılarını zorla hatırlatmaya çalışmak yeni bir dissosiyatif kaçışı tetikler.",
        "targetMechanism": "Bölünmüş otobiyografik bellek ağlarının kortikal entegrasyonu."
    },
    {
        "id": "supportive_psychotherapy",
        "nameTr": "Destekleyici Psikoterapi & Kriz Müdahalesi",
        "nameEn": "Supportive Psychotherapy & Clinical Crisis Management",
        "family": "SCHEMA_DYNAMIC",
        "aliases": [
            "Destekleyici Psikoterapi",
            "Kriz Yönetimi",
            "Adli/Tıbbi Gözlem"
        ],
        "goldForDiagnoses": [
            "ganser_syndrome",
            "transient_global_amnesia",
            "factitious_another",
            "malingering"
        ],
        "shortDefinition": "Akut nöropsikiyatrik krizler, geçici amneziler ve adli/yapay tablolarda ego işlevlerini destekleyen, gerçeklik sınamasını koruyan ve güvenli sınırlar çizen klinik yaklaşımdır.",
        "protocolSteps": [
            "1. Empatik, sakin ve yargılayıcı olmayan terapötik çerçeve ve güvenlik sağlama",
            "2. Akut stresörü yatıştırma ve hasta/aileye net tıbbi güvence verme",
            "3. Adli ve çocuk koruma gerektiren durumlarda çatışmasız sınır koyma ve resmi bildirim",
            "4. Sağlıklı başa çıkma savunmalarını güçlendirme."
        ],
        "pitfalls": "Yapay bozukluk veya temarruzda öfkeli münakaşaya girmek ya da çocuk koruma bildirimini geciktirmek ağır zararlara yol açar.",
        "targetMechanism": "Ego stabilizasyonu, anksiyete yatıştırma ve güvenli klinik sınırlar."
    },
    {
        "id": "habit_reversal",
        "nameTr": "Alışkanlığı Tersine Çevirme & Koşullanma Eğitimi (HRT / Alarm)",
        "nameEn": "Habit Reversal Training & Behavioral Conditioning",
        "family": "BEHAVIORAL_HABIT",
        "aliases": [
            "HRT",
            "Diyafram Nefesi",
            "Enürezis Alarm Eğitimi"
        ],
        "goldForDiagnoses": [
            "rumination_disorder",
            "enuresis_nocturna",
            "trichotillomania",
            "excoriation"
        ],
        "shortDefinition": "Ruminasyon bozukluğu ve enürezis gibi öğrenilmiş/otomatik bedensel döngülerde farkındalık ve yarışan fizyolojik tepki (diyafram nefesi veya zil-ped şartlanması) oluşturan davranışçı tedavidir.",
        "protocolSteps": [
            "1. Bedensel öncül duyumu (karın kasılması veya mesane doluluğu) fark etme eğitimi",
            "2. Ruminasyonda yemek sonrası derin diyafram nefesi; Enüreziste nem sensörlü zil-ped alarmı uygulama",
            "3. Olumlu ve kuru/başarılı günleri takvimle ödüllendirme",
            "4. Davranış otomatikleşene kadar düzenli takip."
        ],
        "pitfalls": "Davranışçı egzersizleri düzensiz uygulamak veya çocuğu utandırmak şartlanmayı bozar.",
        "targetMechanism": "Yarışan motor yanıt ve klasik/operant yeniden koşullanma."
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { THERAPY_FAMILIES, THERAPIES_DATABASE };
}
