// Alt tip / belirleyici temizliği (2. tur) — karar verisi (Claude ajan R, 2026-11-15).
// Kural (Emre, kesin): tahmin listesinde yalnızca resmî DSM-5-TR tanıları; belirleyiciler/alt tipler ayrı girdi değildir.
// Uygulayan betik: alt_tip_temizligi.js
'use strict';

// Kaldırılan id → üst tanı ve gerekçe
const KALDIR = {
  adhd_inattentive: ['adhd', 'DEHB "dikkatsizliğin baskın olduğu görünüm" belirleyicisi (F90.0); ayrı ölçüt kümesi yok. Önceki tabloda "ayrı kodlu görünüm" diye tutulmuştu: kural gereği geri alındı.'],
  adhd_hyperactive: ['adhd', 'DEHB "aşırı hareketlilik/dürtüselliğin baskın olduğu görünüm" belirleyicisi (F90.1); ayrı ölçüt kümesi yok. Önceki karar geri alındı.'],
  specific_learning_dyslexia: ['specific_learning_disorder', 'Özgül öğrenme bozukluğunun "okumada bozulma ile" belirleyicisi (F81.0); tek ölçüt kümesi. Üst tanı listede yoktu, `specific_learning_disorder` olarak eklendi.'],
  specific_learning_dysgraphia: ['specific_learning_disorder', 'Özgül öğrenme bozukluğunun "yazılı anlatımda bozulma ile" belirleyicisi (F81.81).'],
  specific_learning_dyscalculia: ['specific_learning_disorder', 'Özgül öğrenme bozukluğunun "matematikte bozulma ile" belirleyicisi (F81.2).'],
  schizoaffective_bipolar: ['schizoaffective', 'Şizoaffektif bozukluğun "bipolar tip" belirleyicisi (F25.0); ölçütler aynı. Önceki karar geri alındı.'],
  schizoaffective_depressive: ['schizoaffective', 'Şizoaffektif bozukluğun "depresif tip" belirleyicisi (F25.1). Önceki karar geri alındı.'],
  bipolar_1_depressed: ['bipolar_1', 'Bipolar I bozukluğunda "şu anki ya da en son epizod depresif" kodlama ayrıntısı (F31.3x); ayrı tanı değil. Önceki karar geri alındı.'],
  mdd_recurrent: ['mdd', 'Majör depresif bozukluğun "yineleyici epizod" kodlaması (F33.x); ölçütler aynı, tek tanı. Listede kullanılmıyordu ve "tek epizod" girdisiyle çatışıyordu. Önceki karar geri alındı.'],
  mdd_with_psychotic: ['mdd', 'Majör depresif bozukluğun "psikotik özellikli" belirleyicisi (F32.3/F33.3); ayrı ölçüt kümesi yok. Önceki karar geri alındı.'],
  specific_phobia_animal: ['specific_phobia', 'Özgül fobinin "hayvan" tipi belirleyicisi (F40.218). Önceki karar geri alındı.'],
  specific_phobia_natural: ['specific_phobia', 'Özgül fobinin "doğal çevre" tipi belirleyicisi (F40.228). Önceki karar geri alındı.'],
  specific_phobia_blood: ['specific_phobia', 'Özgül fobinin "kan-enjeksiyon-yaralanma" tipi belirleyicisi (F40.23x). Önceki karar geri alındı.'],
  specific_phobia_situational: ['specific_phobia', 'Özgül fobinin "durumsal" tipi belirleyicisi (F40.248). Önceki karar geri alındı.'],
  adjustment_disorder_depressed: ['adjustment_disorder', 'Uyum bozukluğunun "çökkün duygudurumla" alt tipi (F43.21). Önceki karar geri alındı.'],
  adjustment_disorder_anxious: ['adjustment_disorder', 'Uyum bozukluğunun "kaygıyla" alt tipi (F43.22). Önceki karar geri alındı.'],
  conversion_motor: ['conversion_disorder', 'Konversiyon bozukluğunun belirti türü belirleyicisi (güçsüzlük/felç, anormal hareket, yutma, konuşma; F44.4). Önceki karar geri alındı.'],
  conversion_seizures: ['conversion_disorder', 'Konversiyon bozukluğunun "atak ya da nöbetlerle" belirti türü (F44.5). Önceki karar geri alındı.'],
  conversion_sensory: ['conversion_disorder', 'Konversiyon bozukluğunun "anestezi/duyu kaybı" ya da "özel duyu belirtisiyle" belirti türü (F44.6). Önceki karar geri alındı.'],
  anorexia_restricting: ['anorexia_nervosa', 'Anoreksiya nervozanın "kısıtlayıcı tip" belirleyicisi. Önceki karar geri alındı.'],
  anorexia_binge_purge: ['anorexia_nervosa', 'Anoreksiya nervozanın "tıkınırcasına yeme/çıkarma tipi" belirleyicisi. Önceki karar geri alındı.'],
  dissociative_fugue: ['dissociative_amnesia', 'DSM-5-TR\'de füg ayrı tanı değil; dissosiyatif amnezinin "dissosiyatif füg ile" belirleyicisi (F44.1). Önceki karar geri alındı.'],
  narcolepsy_without_cataplexy: ['narcolepsy', 'Narkolepsinin alt tip belirleyicisi (katapleksisiz, hipokretin eksikliği olmadan; G47.419). Önceki karar geri alındı.'],
  circadian_delayed_sleep: ['circadian_rhythm_sleep_wake', 'Sirkadiyen ritim uyku-uyanıklık bozukluğunun "gecikmiş uyku evresi tipi" (G47.21); tek ölçüt kümesi. Üst tanı `circadian_rhythm_sleep_wake` olarak eklendi.'],
  circadian_advanced_sleep: ['circadian_rhythm_sleep_wake', 'Sirkadiyen ritim uyku-uyanıklık bozukluğunun "erken uyku evresi tipi" (G47.22).'],
  circadian_shift_work: ['circadian_rhythm_sleep_wake', 'Sirkadiyen ritim uyku-uyanıklık bozukluğunun "vardiyalı çalışma tipi" (G47.26).'],
  circadian_non_24_hour: ['circadian_rhythm_sleep_wake', 'Sirkadiyen ritim uyku-uyanıklık bozukluğunun "24 saate uymayan tip" (G47.24).'],
  sleepwalking_disorder: ['nrem_sleep_arousal', 'NREM uykusundan uyanma bozukluğunun "uyurgezerlik tipi" (F51.3); tek ölçüt kümesi. Üst tanı `nrem_sleep_arousal` olarak eklendi.'],
  sleep_terrors: ['nrem_sleep_arousal', 'NREM uykusundan uyanma bozukluğunun "uyku terörü tipi" (F51.4).'],
  conduct_childhood: ['conduct_disorder', 'Davranım bozukluğunun "çocuklukta başlayan tip" belirleyicisi (F91.1). Önceki karar geri alındı.'],
  conduct_adolescent: ['conduct_disorder', 'Davranım bozukluğunun "ergenlikte başlayan tip" belirleyicisi (F91.2). Önceki karar geri alındı.'],
};

// Ad düzeltmeleri (üst tanının adı artık bir alt tipi anlatmamalı)
const AD = {
  adhd: { nameTr: 'Dikkat Eksikliği ve Hiperaktivite Bozukluğu (DEHB)', nameEn: 'Attention-Deficit/Hyperactivity Disorder', eskiAd: true },
  bipolar_1: { nameTr: 'Bipolar I Bozukluğu', eskiAd: true },
  mdd: { nameTr: 'Majör Depresif Bozukluk', nameEn: 'Major Depressive Disorder', eskiAd: true },
  narcolepsy: { nameTr: 'Narkolepsi', nameEn: 'Narcolepsy', eskiAd: true, manualTr: 'Narkolepsi', manualEn: 'Narcolepsy' },
};

const B = (content, items) => (items ? { code: 'Belirleyiciler / Alt tipler', title: '', content, items } : { code: 'Belirleyiciler / Alt tipler', title: '', content });

// Üst tanıların rehberine eklenen "Belirleyiciler / Alt tipler" bloğu (title betikte doldurulur)
const BLOK = {
  adhd: { title: 'Görünüm Belirleyicileri (son 6 aya göre)', content: 'DEHB tek tanıdır; görünüm ayrı tanı değil, belirleyicidir ve zamanla değişebilir.', items: [
    'Bileşik görünüm (F90.2): son 6 ayda hem A1 (dikkatsizlik) hem A2 (aşırı hareketlilik-dürtüsellik) ölçütü karşılanır.',
    'Dikkatsizliğin baskın olduğu görünüm (F90.0): A1 karşılanır, A2 karşılanmaz.',
    'Aşırı hareketlilik/dürtüselliğin baskın olduğu görünüm (F90.1): A2 karşılanır, A1 karşılanmaz.',
    'Ayrıca: kısmi yatışma; şu anki şiddet hafif, orta ya da ağır.'] },
  schizoaffective: { title: 'Tip Belirleyicileri', content: 'Şizoaffektif bozukluk tek tanıdır; tip, tabloda yer alan duygudurum epizodlarına göre belirtilir.', items: [
    'Bipolar tip (F25.0): tablonun bir parçası olarak manik epizod vardır; majör depresif epizodlar da olabilir.',
    'Depresif tip (F25.1): yalnızca majör depresif epizodlar vardır, manik epizod hiç olmamıştır.',
    'Psikotik belirtiler yalnızca duygudurum epizodları sırasında görülüyorsa tanı psikotik özellikli duygudurum bozukluğudur (B ölçütü: duygudurum epizodu olmadan en az 2 hafta psikoz).',
    'Ek belirleyiciler: katatoniyle; seyir (ilk epizod / çoğul epizod, akut / kısmi / tam yatışmada, süregen).'] },
  bipolar_1: { title: 'Epizod Kodlaması ve Belirleyiciler', content: 'Bipolar I bozukluğu, yaşam boyu en az bir manik epizodla konan tek tanıdır; şu anki ya da en son epizod tanının kodlamasında belirtilir.', items: [
    'Şu anki / en son epizod: manik, hipomanik, depresif ya da belirtilmemiş; ardından şiddet (hafif, orta, ağır), psikotik özellikler ve yatışma durumu.',
    'Şu anki epizod depresifse de tanı bipolar I bozukluğudur: majör depresif epizod ölçütleri karşılanır ve öyküde manik epizod vardır.',
    'Ek belirleyiciler: kaygılı sıkıntıyla, karışık özelliklerle, hızlı döngülü (12 ayda en az 4 epizod), melankolik, atipik, duygudurumla uyumlu/uyumsuz psikotik özelliklerle, katatoniyle, doğum dönemi başlangıçlı, mevsimsel örüntülü.'] },
  mdd: { title: 'Epizod Kodlaması ve Belirleyiciler', content: 'Majör depresif bozukluk tek tanıdır; tek ya da yineleyici epizod, şiddet ve özellikler belirleyici olarak eklenir.', items: [
    'Tek epizod (F32.x) ya da yineleyici epizod (F33.x): epizodların ayrı sayılması için aralarında ölçütlerin karşılanmadığı en az 2 ardışık ay olmalıdır.',
    'Şiddet: hafif, orta, ağır. Psikotik özelliklerle: epizod sırasında sanrı ve/veya varsanı; duygudurumla uyumlu (suçluluk, hastalık, ölüm, nihilizm, hak edilmiş ceza temaları) ya da uyumsuz olarak belirtilir.',
    'Diğer belirleyiciler: kaygılı sıkıntıyla, karışık özelliklerle, melankolik özelliklerle (olumlu olaylara tepkisizlik, sabah kötüleşme, erken uyanma), atipik özelliklerle (duygudurum tepkiselliği, aşırı uyku/yeme, kurşun felci), katatoniyle, doğum dönemi başlangıçlı (gebelikte ya da doğumdan sonraki 4 hafta içinde), mevsimsel örüntülü (yalnızca yineleyici epizodda).',
    'Yatışma: kısmi ya da tam yatışmada.'] },
  adjustment_disorder: { title: 'Alt Tipler ve Süre Belirleyicisi', content: 'Uyum bozukluğu tek tanıdır; baskın belirtilere göre alt tip belirtilir.', items: [
    'Çökkün duygudurumla (F43.21): çökkün duygudurum, ağlamaklılık ya da umutsuzluk baskındır.',
    'Kaygıyla (F43.22): sinirlilik, endişe, gerginlik ya da ayrılma kaygısı baskındır.',
    'Karışık kaygı ve çökkün duygudurumla (F43.23); davranım bozukluğuyla (F43.24); karışık duygu ve davranım bozukluğuyla (F43.25); belirtilmemiş (F43.20).',
    'Süre: akut (belirtiler 6 aydan kısa) ya da süregen (6 ay veya daha uzun; süregen bir stres etkenine ya da kalıcı sonuçları olan bir etkene yanıt olarak).',
    'Majör depresif epizod, TSSB ya da akut stres bozukluğu ölçütleri karşılanıyorsa stres etkeni olsa bile o tanı konur.'] },
  conversion_disorder: { title: 'Belirti Türü ve Seyir Belirleyicileri', content: 'Konversiyon (işlevsel nörolojik belirti) bozukluğu tek tanıdır; belirti türü kodlamada belirtilir.', items: [
    'Güçsüzlük ya da felçle; anormal hareketle (titreme, distoni, miyoklonus, yürüme bozukluğu); yutma belirtileriyle; konuşma belirtisiyle (afoni, peltek konuşma) — F44.4.',
    'Atak ya da nöbetlerle (psikojenik non-epileptik nöbet, PNES) — F44.5. Kesin tanı tipik bir atağın video-EEG ile kaydedilip eşzamanlı epileptik etkinlik olmadığının gösterilmesiyle konur.',
    'Anestezi ya da duyu kaybıyla; özel duyu belirtisiyle (görme, koku alma, işitme) — F44.6. Karışık belirtilerle — F44.7.',
    'Seyir: akut epizod (6 aydan kısa) ya da süregen (6 ay veya daha uzun); psikolojik stres etkeniyle ya da olmaksızın. Psikolojik etken ya da "aldırmazlık" tanı için gerekmez.'] },
  narcolepsy: { title: 'Doğrulayıcı Bulgu ve Alt Tipler', content: 'Narkolepsi tek tanıdır. Katapleksi yoksa B ölçütü için BOS hipokretin-1 eksikliği (≤ 110 pg/mL ya da sağlıklı değerlerin üçte biri) veya polisomnografide REM latansı ≤ 15 dakika ya da MSLT\'de ortalama uyku latansı ≤ 8 dakika ve en az 2 SOREMP gerekir.', items: [
    'Katapleksili ya da hipokretin eksikliğiyle (tip 1) — G47.411.',
    'Katapleksisiz ve hipokretin eksikliği olmadan ya da ölçülmeden (tip 2) — G47.419.',
    'Diğer alt tipler: otozomal dominant serebellar ataksi, sağırlık ve narkolepsiyle; otozomal dominant narkolepsi, obezite ve tip 2 diyabetle; başka bir sağlık durumuna ikincil narkolepsi.',
    'Şiddet: hafif, orta, ağır.'] },
  conduct_disorder: { title: 'Başlangıç Tipi ve Şiddet', content: 'Davranım bozukluğu tek tanıdır; başlangıç yaşı tip olarak belirtilir.', items: [
    'Çocuklukta başlayan tip (F91.1): 10 yaşından önce en az bir davranım bozukluğu ölçütüne özgü belirti vardır.',
    'Ergenlikte başlayan tip (F91.2): 10 yaşından önce hiçbir belirti yoktur.',
    'Başlangıcı belirtilmemiş (F91.9): başlangıç yaşını belirlemek için yeterli bilgi yoktur.',
    'Şiddet: hafif, orta, ağır. "Sınırlı prososyal duygularla" belirleyicisi ayrıca eklenebilir.'] },
};

// Yeni üst tanılar (listede yoktu; alt tipleri ayrı girdi olarak duruyordu)
const YENI = {
  specific_learning_disorder: {
    once: 'specific_learning_dyslexia', category: 'NEURODEV',
    nameTr: 'Özgül Öğrenme Bozukluğu', nameEn: 'Specific Learning Disorder',
    aliases: ['ÖÖB', 'Öğrenme Güçlüğü', 'Learning Disability'],
    clinicalDescription: {
      overview: 'Zihinsel yetiyitimi, duyusal sorun ya da yetersiz eğitimle açıklanamayan, okul çağında başlayan ve temel akademik becerilerin (sözcük okuma, okuduğunu anlama, yazım, yazılı anlatım, sayı duyusu, hesaplama, matematiksel akıl yürütme) öğrenilip kullanılmasında süregen güçlükle giden nörogelişimsel bozukluktur. Tek tanıdır; etkilenen alan (okuma, yazılı anlatım, matematik) ve alt beceriler belirleyici olarak eklenir. "Disleksi" okumada, "diskalkuli" matematikte bozulmanın alternatif adlarıdır.',
      epidemiology: 'Okul çağı çocuklarında tüm alanlar için yaygınlık farklı dil ve kültürlerde yaklaşık %5-15\'tir; erişkinlerde yaklaşık %4. En sık okumada bozulma görülür; alanların birlikteliği ve DEHB eşlik etmesi sıktır. Erkeklerde daha sık tanı konur.',
      etiology: 'Güçlü genetik yatkınlık; okumada sol temporoparyetal fonolojik işlemleme ağlarındaki, matematikte paryetal (intraparyetal oluk) sayısal büyüklük ağlarındaki farklılıklar; çalışma belleği, işlemleme hızı ve yürütücü işlev zayıflıkları. Prematürite ve doğum öncesi maruziyetler risk etkenleridir.',
      prognosis: 'Erken, açık ve sistematik, çok duyulu ve alana özgü eğitim (ör. fonolojik farkındalık ve harf-ses eğitimi, somuttan soyuta matematik öğretimi) ve sınav düzenlemeleri işlevselliği belirgin artırır. Güçlükler yaşam boyu sürebilir; ikincil kaygı ve özgüven sorunları izlenmelidir.' },
    criteriaList: [
      { code: 'Kriter A', title: 'Akademik Becerilerde Süregen Güçlük (En az 6 ay, müdahaleye rağmen)', content: 'Bu güçlükleri hedefleyen müdahalelere karşın en az 6 aydır süren, aşağıdakilerden en az birinin bulunduğu öğrenme ve akademik beceri kullanma güçlüğü:', items: [
        '1. Yanlış ya da yavaş ve zahmetli sözcük okuma.',
        '2. Okuduğunun anlamını kavramada güçlük.',
        '3. Yazımda (heceleme/imla) güçlük.',
        '4. Yazılı anlatımda güçlük (dilbilgisi ve noktalama hataları, paragraf düzenlemede yetersizlik, düşünceleri yazıda açıkça ifade edememe).',
        '5. Sayı duyusu, aritmetik bilgiler ya da hesaplamada ustalaşmada güçlük.',
        '6. Matematiksel akıl yürütmede güçlük.'] },
      { code: 'Kriter B, C & D', title: 'Ölçülebilir Düşüklük, Okul Çağında Başlangıç ve Dışlama', content: 'Etkilenen beceriler yaşa göre beklenenin belirgin ve ölçülebilir biçimde altındadır ve okul, iş ya da günlük yaşamı belirgin biçimde etkiler; bireysel standart başarı testleri ve kapsamlı klinik değerlendirmeyle doğrulanır (B). Güçlükler okul çağında başlar, ancak talepler kapasiteyi aşana dek tam ortaya çıkmayabilir (C). Zihinsel yetiyitimi, düzeltilmemiş görme/işitme sorunları, başka ruhsal ya da nörolojik bozukluklar, psikososyal güçlükler, öğretim dilinde yetersizlik ya da yetersiz eğitimle daha iyi açıklanamaz (D).' },
      { code: 'Belirleyiciler / Alt tipler', title: 'Etkilenen Alanlar ve Şiddet', content: 'Etkilenen tüm alan ve alt beceriler ayrı ayrı belirtilir:', items: [
        'Okumada bozulma ile (F81.0): sözcük okuma doğruluğu, okuma hızı ya da akıcılığı, okuduğunu anlama. Disleksi bu örüntünün alternatif adıdır.',
        'Yazılı anlatımda bozulma ile (F81.81): yazım doğruluğu, dilbilgisi ve noktalama doğruluğu, yazılı anlatımın açıklığı ya da düzenlenmesi. Salt el yazısının motor olarak kötü olması bu belirleyicinin özü değildir (gelişimsel eşgüdüm bozukluğu açısından değerlendirilir).',
        'Matematikte bozulma ile (F81.2): sayı duyusu, aritmetik bilgilerin belleğe alınması, doğru ya da akıcı hesaplama, matematiksel akıl yürütme. Diskalkuli bu örüntünün alternatif adıdır.',
        'Şiddet: hafif, orta, ağır.'] } ] },
  circadian_rhythm_sleep_wake: {
    once: 'circadian_delayed_sleep', category: 'SLEEP',
    nameTr: 'Sirkadiyen Ritim Uyku-Uyanıklık Bozukluğu', nameEn: 'Circadian Rhythm Sleep-Wake Disorder',
    aliases: ['Sirkadiyen Ritim Bozukluğu', 'Biyolojik Saat Bozukluğu', 'G47.20'],
    clinicalDescription: {
      overview: 'Başlıca sirkadiyen sistemdeki bir değişikliğe ya da kişinin içsel ritmi ile fiziksel çevrenin veya toplumsal/mesleki programın gerektirdiği uyku-uyanıklık takvimi arasındaki uyumsuzluğa bağlı süregen ya da yineleyen uyku bölünmesidir. Sonuç uykusuzluk, aşırı uykululuk ya da ikisidir. Kendi programına bırakıldığında uykunun süresi ve niteliği çoğunlukla normaldir. Tek tanıdır; tip (gecikmiş, erken, düzensiz, 24 saate uymayan, vardiyalı çalışma) belirleyici olarak eklenir.',
      epidemiology: 'Gecikmiş uyku evresi tipi ergen ve genç erişkinlerde en sık görülen tiptir; erken uyku evresi tipi yaşla artar; 24 saate uymayan tip tam görme kaybı olanların yaklaşık yarısında görülür; vardiyalı çalışma tipi gece çalışanların bir bölümünde bozukluk düzeyine ulaşır. Ailesel biçimler bildirilmiştir.',
      etiology: 'Biyolojik saatin geç ya da erken ayarlı olması, saat genlerinde (CRY1, PER2 vb.) çeşitlemeler, ışığın saati ayarlayamaması (görme kaybı), ışık ve toplumsal ipuçlarına maruziyetin azlığı ya da uygunsuz zamanlaması, dayatılan iş programı.',
      prognosis: 'Uygun zamanlanmış ışık tedavisi, melatonin ya da melatonin reseptör agonistleri, düzenli uyku programı ve (vardiyalı çalışmada) planlı şekerleme ile uyku ortamı düzenlemesi etkilidir. Tedavi bırakıldığında yineleme sıktır; depresyon ve uykusuzluk bozukluğu ayırıcı tanıda değerlendirilmelidir.' },
    criteriaList: [
      { code: 'Kriter A-C', title: 'Sirkadiyen Ritim Uyku-Uyanıklık Bozukluğu Ölçütleri', content: 'Başlıca sirkadiyen sistemdeki değişikliğe ya da içsel ritim ile fiziksel çevre veya toplumsal/mesleki programın gerektirdiği uyku-uyanıklık takvimi arasındaki uyumsuzluğa bağlı süregen ya da yineleyen uyku bölünmesi (A); bunun aşırı uykululuk, uykusuzluk ya da her ikisine yol açması (B); belirgin sıkıntı ya da işlev bozulması (C). Tanıda uyku günlüğü ve aktigrafi kullanılır.' },
      { code: 'Belirleyiciler / Alt tipler', title: 'Tipler', content: 'Tip belirtilir:', items: [
        'Gecikmiş uyku evresi tipi (G47.21): uykuya dalma ve uyanma saatleri istenenden belirgin (çoğunlukla 2 saatten fazla) geç; kendi programında uyku normal. Ailesel ya da 24 saate uymayan tiple örtüşen biçimler belirtilebilir.',
        'Erken uyku evresi tipi (G47.22): uykuya dalma ve uyanma istenenden birkaç saat erken; akşam aşırı uykululuk, sabah çok erken uyanma.',
        'Düzensiz uyku-uyanıklık tipi (G47.23): 24 saate dağılmış, belirgin ana uyku dönemi olmayan parçalı uyku (çoğunlukla nörobilişsel bozukluklarda).',
        '24 saate uymayan tip (G47.24): uyku-uyanıklık döngüsü 24 saatlik çevreyle eşlenmez, her gün tutarlı biçimde (çoğunlukla daha geç saate) kayar.',
        'Vardiyalı çalışma tipi (G47.26): olağan gündüz saatleri dışında, özellikle gece düzenli çalışmaya bağlı ana uyku döneminde uykusuzluk ve/veya uyanıklıkta aşırı uykululuk.',
        'Belirtilmemiş tip (G47.20). Seyir: epizodik, süregen, yineleyen.'] } ] },
  nrem_sleep_arousal: {
    once: 'sleepwalking_disorder', category: 'SLEEP',
    nameTr: 'NREM Uykusundan Uyanma Bozukluğu', nameEn: 'Non-Rapid Eye Movement Sleep Arousal Disorder',
    aliases: ['NREM Parasomnisi', 'NREM Uyanma Bozukluğu', 'Non-REM Sleep Arousal Disorder'],
    clinicalDescription: {
      overview: 'Çoğunlukla ana uyku döneminin ilk üçte birinde, derin NREM (evre 3, yavaş dalga) uykusundan tamamlanmamış uyanma epizodlarıyla giden parasomnidir. Epizodlar uyurgezerlik (yataktan kalkıp dolaşma, boş bakış, uyandırılma güçlüğü) ya da uyku terörü (dehşet çığlığıyla ani uyanma, yoğun otonom uyarılma, avutulamama) biçimindedir; rüya çok az ya da hiç hatırlanmaz ve sabah epizoda amnezi vardır. Tek tanıdır; uyurgezerlik ve uyku terörü bu tanının tipleridir.',
      epidemiology: 'Uyurgezerlik epizodları çocukların %10-30\'unda en az bir kez, yineleyen biçimde %2-3\'ünde; erişkinlerde yaklaşık %1-4\'ünde görülür. Uyku terörü 4-12 yaş çocuklarda sıktır ve ergenlikte çoğunlukla kendiliğinden kaybolur. Aile öyküsü güçlüdür.',
      etiology: 'Derin yavaş dalga uykusundan motor ve otonom sistemler uyanırken korteksin kısmen uykuda kalması (ayrışmış uyanma). Uyku yoksunluğu, ateş, stres, alkol, bazı ilaçlar ve uyku apnesi gibi uykuyu bölen durumlar tetikler.',
      prognosis: 'Çocuklarda genellikle kendiliğinden geçer. Ev güvenliği (kapı/pencere kilidi, alarm), uyku yoksunluğu ve tetikleyicilerden kaçınma, aile eğitimi (atak sırasında zorla uyandırmama) ve planlı uyandırma yararlıdır; yaralanma riski olan erişkinlerde düşük doz klonazepam kullanılabilir.' },
    criteriaList: [
      { code: 'Kriter A', title: 'Tamamlanmamış Uyanma Epizodları', content: 'Çoğunlukla ana uyku döneminin ilk üçte birinde ortaya çıkan, uykudan tamamlanmamış uyanma epizodları; aşağıdakilerden biri eşlik eder:', items: [
        'Uyurgezerlik: uyku sırasında yataktan kalkıp dolaşma; boş, dik bakış, başkalarının iletişim çabalarına görece tepkisizlik ve güç uyandırılma.',
        'Uyku terörü: çoğunlukla dehşet çığlığıyla başlayan ani korkulu uyanmalar; yoğun korku ve otonom uyarılma belirtileri (midriyazis, taşikardi, hızlı soluma, terleme) ve epizod sırasında avutma çabalarına görece tepkisizlik.'] },
      { code: 'Kriter B-F', title: 'Rüya Hatırlamama, Amnezi ve Dışlama', content: 'Rüya imgesi hiç ya da çok az (tek bir görsel sahne) hatırlanır (B). Epizodlara amnezi vardır (C). Epizodlar belirgin sıkıntıya ya da işlev bozulmasına yol açar (D). Bir maddenin ya da ilacın fizyolojik etkilerine bağlanamaz (E). Eşlik eden ruhsal ve tıbbi bozukluklar epizodları açıklamaz (F).' },
      { code: 'Belirleyiciler / Alt tipler', title: 'Tipler', content: 'Tip belirtilir:', items: [
        'Uyurgezerlik tipi (F51.3); ek belirleyiciler: uykuyla ilişkili yeme ile, uykuyla ilişkili cinsel davranışla (seksomni).',
        'Uyku terörü tipi (F51.4).',
        'Ayırıcı tanı: REM uykusu davranış bozukluğu ve kabus bozukluğu REM uykusunda, gecenin ikinci yarısında olur; kişi uyanınca yönelimlidir ve rüyayı hatırlar.'] } ] },
};

module.exports = { KALDIR, AD, BLOK, YENI };
