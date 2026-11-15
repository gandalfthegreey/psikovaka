// Vaka açıklamalarındaki (tools/icerik/vaka_aciklamalari) elle yazılmış düzeltmeler (Claude ajan R, 2026-11-15).
// whyNot içinde kaldırılan id'ler betikte otomatik olarak üst tanıya eşlenir; burada yalnızca eşleme sonrası
// cevapla çakışan / yinelenen ya da metni değişmesi gereken girdiler var.
// Biçim: { whyThis?: {index: metin} | [tam liste], whyNot?: [tam liste], teachingPoint?: metin }
'use strict';
module.exports = {
  'case-010': {
    whyThis: { 2: "Daha önce bir epizod bildirilmiyor; şu anki bilgiyle tek epizod olarak kodlanır. Geçmişte ayrı bir epizod varsa tanı değişmez, yalnızca ‘yineleyici’ olarak kodlanır." },
    whyNot: [
      { diagnosisId: 'dysthymia', reason: 'Belirtiler beş haftadır vardır; distimi en az iki yıl süren daha hafif ve süreğen bir tablo gerektirir.' },
      { diagnosisId: 'bipolar_1', reason: 'Öyküde mani ya da hipomani tarif edilmiyor; bu dışlanmadan majör depresyon tanısı konmaz ve bipolar depresyon olasılığı mutlaka sorgulanmalıdır.' },
      { diagnosisId: 'depressive_due_to_medical', reason: 'TSH, B12, D vitamini ve kan sayımı normaldir; depresyonu açıklayan tıbbi bir durum saptanmamıştır.' } ] },
  'case-015': {
    whyNot: [
      { diagnosisId: 'odd', reason: 'Kurallara uymama kasıtlı bir karşı gelme ya da öfkeli tutumdan değil, dikkat ve dürtü denetimi güçlüğünden kaynaklanır.' },
      { diagnosisId: 'specific_learning_disorder', reason: 'Akademik düşüş tek bir beceri alanıyla sınırlı değil, dikkat ve davranış sorunlarına bağlı yaygın bir tablo; yine de okuma becerisi ayrıca değerlendirilmelidir.' },
      { diagnosisId: 'conduct_disorder', reason: 'Söz kesme ve kural dışı davranışlar dürtüsellikten kaynaklanıyor; saldırganlık, hırsızlık ya da mala zarar verme gibi temel hak ihlalleri tarif edilmiyor.' } ] },
  'case-045': {
    whyNot: [
      { diagnosisId: 'major_neurocognitive_tbi', reason: 'Görüntülemede travma bulgusu yoktur ve yeni bilgi öğrenme korunmuştur; organik amnezide genellikle yeni bilgi öğrenme bozulur.' },
      { diagnosisId: 'did', reason: 'Belirgin ayrı kimlik durumları gözlenmemiştir; bellek kaybı tek başına tablonun merkezindedir.' } ],
    teachingPoint: 'Dissosiyatif amneziyi organik amneziden ayıran, kişisel geçmişe ait (otobiyografik) bilginin seçici kaybı ve yeni bilgi öğrenmenin korunmasıdır; amaçlı yolculuk eşlik ediyorsa ayrı bir tanı değil, ‘dissosiyatif füg ile’ belirteci eklenir.' },
  'case-063': {
    whyThis: [
      'Yalnızca beyaz ve kuru yiyecekleri yemesi ve diğerlerini doku, koku ve renk nedeniyle reddetmesi duyusal özelliklere bağlı bir yiyecek kısıtlamasıdır.',
      'Büyüme geriliği, vitamin takviyesi gereksinimi ve okul etkinliklerine katılamama, kilo korkusu olmadan gelişen beslenme yetersizliğini ve işlev kaybını gösterir.',
      'Gastroenterolojik ve alerji testlerinin temiz olması kısıtlamayı açıklayan tıbbi bir durum olmadığını gösterir.' ],
    whyNot: [
      { diagnosisId: 'anorexia_nervosa', reason: 'Kilo alma korkusu, kilo uğraşı ya da beden algısı bozukluğu açıkça yoktur.' },
      { diagnosisId: 'pica', reason: 'Pikada besin değeri olmayan maddeler (toprak, kâğıt, kireç) yenir; bu çocuk ise normal yiyecekleri duyusal özellikleri nedeniyle reddediyor.' },
      { diagnosisId: 'asd', reason: 'Duyusal seçicilik otizme eşlik edebilir, ancak sosyal iletişim sorunları ya da başka yineleyici davranışlar tarif edilmiyor; yine de gelişimsel değerlendirme yapılmalıdır.' } ] },
  'case-066': {
    whyThis: [
      'Kızının damar yoluna su enjekte etmesi ve sütüne laksatif katması belirtileri bir başkasında bilerek oluşturmanın kamera kaydıyla belgelenmiş kanıtıdır.',
      'Maddi bir amaç yoktur; motivasyon ‘hasta çocuğun fedakâr annesi’ rolüdür ve çocuk ayrılınca belirtiler düzelmiştir. Tanı failin, yani annenin kendisine konur.' ],
    whyNot: [
      { diagnosisId: 'factitious_disorder', reason: 'Kendine yüklenen yapay bozuklukta kişi belirtileri kendi bedeninde üretir; burada anne belirtileri çocuğunun bedeninde oluşturmaktadır.' },
      { diagnosisId: 'somatic_symptom_disorder', reason: 'Belirtiler gerçek yaşanan değil, bir başkası tarafından yapay olarak üretilmiştir.' },
      { diagnosisId: 'antisocial_pd', reason: 'Çocuğa zarar verilmektedir, ancak eylemin amacı çıkar değil hasta rolü yoluyla ilgi ve övgüdür; genel bir hak ihlali örüntüsü tarif edilmiyor.' } ] },
  'case-068': {
    whyNot: [
      { diagnosisId: 'conduct_disorder', reason: 'Hayvanlara zarar, hırsızlık ya da mala zarar verme gibi temel hak ihlalleri tarif edilmiyor.' },
      { diagnosisId: 'dmdd', reason: 'Patlamalar arasında neredeyse her gün süren kalıcı öfkeli duygudurum ve ağır öfke patlamaları tarif edilmiyor.' },
      { diagnosisId: 'intermittent_explosive', reason: 'Öfke kısa, dürtüsel saldırganlık patlamaları biçiminde değil; yönergelere kasıtlı ve kinci karşı gelme biçimindedir.' } ] },
  'case-069': {
    whyNot: [
      { diagnosisId: 'delusional_disorder', reason: 'Takıntılar kişiye yabancı ve istenmeyen düşünceler olarak yaşanıyor ve kişi bunlarla savaşıyor; sabit ve sorgulanamayan bir sanrısal inanç tarif edilmiyor.' },
      { diagnosisId: 'ocpd', reason: 'Kontroller kişinin benimsediği bir düzen tarzı değil, sıkıntı veren ve tüketen ritüellerdir.' },
      { diagnosisId: 'gad', reason: 'Kaygı yaygın bir kuruntu değil, belirli bir korkuyu yatıştırmaya yönelik kurallı tekrarlayıcı davranışlarla ilişkilidir.' } ] },
  'case-073': {
    whyNot: [
      { diagnosisId: 'nrem_sleep_arousal', reason: 'NREM uykusundan uyanma bozukluğunun uyku terörü tipinde olaylar gecenin ilk üçte birinde olur; kişi zor uyanır, konfüzedir ve rüyayı hatırlamaz.' },
      { diagnosisId: 'ptsd', reason: 'Kabuslar yaşanmış bir travmanın yeniden yaşantılanması değildir ve travmatik olay öyküsü yoktur.' },
      { diagnosisId: 'rem_sleep_behavior_disorder', reason: 'Rüyayı eyleme dökme, vurma ya da yataktan fırlama gibi hareketler tarif edilmiyor.' } ] },
  'case-074': {
    whyNot: [
      { diagnosisId: 'gad', reason: 'Kaygı birçok yaşam alanına yayılmamış, uyku ve onun gündüz sonuçlarıyla sınırlıdır; başka konularda süreğen kuruntu tarif edilmiyor.' },
      { diagnosisId: 'mdd', reason: 'Çökkün duygudurum ve anhedoni tarif edilmiyor; uykusuzluk depresyonun bir belirtisi gibi görünmüyor, yine de taranmalıdır.' },
      { diagnosisId: 'circadian_rhythm_sleep_wake', reason: 'Kişi uykuya geç dalmakla kalmıyor, gece boyunca da sık uyanıyor; sirkadiyen ritim bozukluğunun gecikmiş uyku evresi tipinde uyku zamanı kaydırılınca uyku normaldir.' } ] },
  'case-076': {
    whyNot: [
      { diagnosisId: 'female_sexual_interest_arousal', reason: 'Sorunun merkezinde cinsel istek ya da uyarılma eksikliği değil, penetrasyona karşı korku ve istemsiz kasılma vardır.' },
      { diagnosisId: 'specific_phobia', reason: 'Korku kan, iğne ya da yara gibi özgül bir nesneyle değil, penetrasyon ve ona eşlik eden ağrıyla ilgilidir ve tampon kullanımına da uzanır.' },
      { diagnosisId: 'female_orgasmic_disorder', reason: 'Yakınma orgazma ulaşamamak değil, birleşmenin hiç gerçekleşememesidir.' } ] },
  'case-087': {
    whyNot: [
      { diagnosisId: 'bulimia_nervosa', reason: 'Tıkınma ve kusma ortak olsa da kişi belirgin düşük kilodadır; bu durumda tanı anoreksiyadır.' },
      { diagnosisId: 'arfid', reason: 'Yeme kısıtlaması duyusal özelliklerden ya da yeme korkusundan değil, kilo alma korkusu ve beden algısı bozukluğundan kaynaklanır.' },
      { diagnosisId: 'bdd', reason: 'Uğraşın odağı belirli bir yüz ya da beden kusuru değil, kilo ve yağlanmadır.' } ] },
  'case-091': {
    whyThis: { 1: 'Öldüğüne, organlarının çürüdüğüne ve kalbinin atmadığına dair sarsılmaz inanç, duygudurumla uyumlu nihilistik bir sanrıdır (Cotard sendromu); bu, tanıya ‘psikotik özellikli’ belirtecinin eklenmesini gerektirir.' } },
  'case-094': {
    whyNot: [
      { diagnosisId: 'hypersomnolence', reason: 'Şekerlemeler dinlendiricidir, katapleksi vardır ve hipokretin düşüktür; aşırı uykululuk bozukluğunda bunlar görülmez.' },
      { diagnosisId: 'obstructive_sleep_apnea', reason: 'Gündüz uykululuğu apnede de görülür, ancak horlama ya da solunum durması tarif edilmiyor; katapleksi ve erken REM başlangıcı narkolepsiye özgüdür.' },
      { diagnosisId: 'conversion_disorder', reason: 'Yere yığılma sırasında bilinç açıktır ve atak duyguyla tetiklenir; nesnel uyku bulguları ve hipokretin eksikliği organik bir tabloyu gösterir.' } ] },
  'case-095': {
    whyNot: [
      { diagnosisId: 'nrem_sleep_arousal', reason: 'NREM uykusundan uyanma bozukluğunda (uyurgezerlik ya da uyku terörü) olaylar gecenin ilk bölümünde, NREM uykusunda olur; kişi konfüze uyanır ve rüyayı hatırlamaz.' },
      { diagnosisId: 'nightmare_disorder', reason: 'Kabus bozukluğunda REM atonisi korunur ve kişi rüyasını eyleme dökmez.' } ] },
  'case-102': {
    whyNot: [
      { diagnosisId: 'intellectual_disability_mild', reason: 'Zeka normalin üstündedir ve sözlü beceriler güçlüdür; güçlük tüm alanlara yayılmamıştır.' },
      { diagnosisId: 'adhd', reason: 'Satır atlama dikkatsizlik gibi görünebilir, ancak sorun okumaya özgüdür ve diğer ortamlarda dikkat sorunları tarif edilmiyor.' },
      { diagnosisId: 'language_disorder', reason: 'Sözlü yanıtları çok iyidir; güçlük konuşma dilini anlama ve kullanmada değil, yazılı sözcükleri çözmededir.' } ],
    teachingPoint: 'Özgül öğrenme bozukluğunda güçlük zekayla açıklanamaz ve belirli becerilerle sınırlıdır; etkilenen alan (burada okuma, yani disleksi) belirteç olarak eklenir ve uygun müdahaleye rağmen en az altı ay sürmesi gerekir.' },
  'case-104': {
    whyNot: [
      { diagnosisId: 'rem_sleep_behavior_disorder', reason: 'Olaylar REM\'de değil derin NREM\'de, gecenin ilk bölümünde olmaktadır ve rüya hatırlanmaz.' },
      { diagnosisId: 'sexual_sadism', reason: 'Davranışlar uyanıkken hiç görülmüyor ve partnerin acı çekmesine yönelik bir uyarılma örüntüsü tarif edilmiyor.' },
      { diagnosisId: 'dissociative_amnesia', reason: 'Amnezi yalnızca uykudan kısmi uyanma sırasındaki olaylarla sınırlıdır; uyanıkken otobiyografik bilgi kaybı yoktur ve olay polisomnografide N3 evresinde kaydedilmiştir.' } ] },
  'case-117': {
    whyNot: [
      { diagnosisId: 'adjustment_disorder', reason: 'Doğum bir stresör olsa da belirtiler majör depresif epizod ölçütlerini tam karşılıyor; bu durumda uyum bozukluğu konmaz.' },
      { diagnosisId: 'brief_psychotic', reason: 'Bebeğe ilişkin sanrı ya da zarar vermeyi emreden varsanılar açıkça yoktur; doğum sonrası başlayan kısa psikotik bozukluk için psikotik belirtiler gerekir.' },
      { diagnosisId: 'depressive_due_to_medical', reason: 'Tiroid ve hemoglobin normaldir; doğum sonrası tiroidit ve anemi gibi tıbbi nedenler dışlanmıştır.' } ] },
  'case-119': {
    whyNot: [
      { diagnosisId: 'prolonged_grief_disorder', reason: 'Bir yakının ölümü bildirilmiyor; tablo yas değil, genel bir zevk ve tepki kaybıdır.' },
      { diagnosisId: 'major_neurocognitive_alzheimer', reason: 'Yavaşlama ileri yaşta demansı düşündürebilir, ancak belirtiler altı hafta içinde duygudurum değişikliğiyle başlamıştır; bellek değerlendirmesi depresyon düzeldikten sonra yinelenmelidir.' },
      { diagnosisId: 'dysthymia', reason: 'Belirtiler altı haftadır vardır; kalıcı depresif bozukluk en az iki yıl süren daha hafif ve süreğen bir tablo gerektirir.' } ] },
  'case-120': {
    whyThis: { 1: 'Önce kalp hızlanması, ardından tansiyon ve nabzın düşmesiyle bayılma, kan-enjeksiyon-yaralanma tipine özgü iki evreli vazovagal yanıttır.' },
    whyNot: [
      { diagnosisId: 'panic_disorder', reason: 'Ataklar beklenmedik değil, kan ve iğne uyaranına bağlıdır ve gerçek bayılmayla sonuçlanır; panik atakta bayılma beklenmez.' },
      { diagnosisId: 'illness_anxiety_disorder', reason: 'Korku tahlil sonucunda hastalık çıkması değil, iğnenin ve kanın kendisidir.' },
      { diagnosisId: 'conversion_disorder', reason: 'Bayılma, tilt testiyle doğrulanan fizyolojik bir vazovagal reflekstir; nörolojik hastalıkla uyumsuz işlevsel bir belirti değildir.' } ],
    teachingPoint: 'Kan-enjeksiyon-yaralanma tipi özgül fobide gerçek bayılma görülür; bu nedenle gevşeme yerine tansiyonu yükselten ‘uygulamalı gerginlik’ tekniği bu tipe özgüdür.' },
  'case-128': {
    teachingPoint: 'Füg ayrı bir tanı değil, dissosiyatif amnezinin ‘dissosiyatif füg ile’ belirtecidir: ağır bir stresörden kaçışla ilişkili amaçlı seyahat ve kimlik bilgisinin kaybı; genel bilgi ve beceriler korunurken kişisel geçmiş silinir.' },
  'case-129': {
    whyNot: [
      { diagnosisId: 'factitious_disorder', reason: 'Nöbetleri bilerek ürettiğine ya da hasta rolü aradığına dair kanıt yoktur.' },
      { diagnosisId: 'panic_disorder', reason: 'Stres altında ortaya çıksa da tablo korku ve otonom belirtilerle giden ataklar değil, motor nöbetlerdir.' },
      { diagnosisId: 'other_specified_dissociative', reason: 'Belirtiler bilinç ya da kimlikte değil, motor işlevdedir; bu tablo DSM-5-TR\'de işlevsel nörolojik belirti (konversiyon) bozukluğu içinde ‘atak ya da nöbetlerle’ belirteciyle sınıflanır.' } ] },
  'case-138': {
    whyNot: [
      { diagnosisId: 'rem_sleep_behavior_disorder', reason: 'Olaylar REM\'de ve sabaha karşı değil, derin NREM\'de ve gecenin başında olmaktadır; rüya hatırlanmaz.' },
      { diagnosisId: 'dissociative_amnesia', reason: 'Füg epizodları uyanıkken olur ve günler sürebilir; burada epizodlar uykudan çıkarken olur ve dakikalarla sınırlıdır, kimlik kaybı ve amaçlı uzun seyahat yoktur.' },
      { diagnosisId: 'nightmare_disorder', reason: 'Kabus bozukluğunda kişi REM uykusundan tam uyanır, yönelimlidir ve rüyayı hatırlar; burada rüya hatırlanmaz ve kişi uyandırılamaz.' } ] },
  'case-139': {
    teachingPoint: 'Gece teröründe (NREM uyanma bozukluğunun uyku terörü tipi) çocuk uyanık görünür ama avutulamaz ve sabah hatırlamaz; kabusta ise uyanınca hemen yönelimlidir ve rüyayı anlatabilir.' },
};
