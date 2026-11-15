// Tanı listesine eklenen resmî DSM-5-TR tanıları ve rehber girdileri (Claude ajan J, 2026-11-15).
// Metinler el kitabına erişim olmadan, model bilgisiyle kendi cümlelerle yazıldı; Emre tarafından kitapla karşılaştırılmalı.
'use strict';
const belirtilmemis = (ad) => ({ code: 'Belirtilmemiş ile Farkı', title: 'Nedenin Belirtilmesi', content: `Klinisyen ölçütlerin neden karşılanmadığını belirtmeyi seçmezse ya da bilgi yetersizse (ör. acil servis) '${ad}' kategorisi kullanılır.` });
const tanimlama = (ad, grup) => ({ code: 'Tanımlama', title: ad, content: `${grup} özgü belirtilerin baskın olduğu ve klinik açıdan belirgin sıkıntıya ya da toplumsal, mesleki veya diğer önemli işlevsellik alanlarında bozulmaya yol açtığı, ancak bu tanı grubundaki hiçbir bozukluğun ölçütlerinin tümüyle karşılanmadığı durumlarda kullanılır. Klinisyen ölçütlerin neden karşılanmadığını belirtir; kayıtta kategori adından sonra neden yazılır.` });

const DIAG = {
  other_specified_schizophrenia_spectrum: { id: 'other_specified_schizophrenia_spectrum', nameTr: 'Belirlenmiş Diğer Bir Şizofreni Açılımı ve Diğer Psikotik Bozukluk', nameEn: 'Other Specified Schizophrenia Spectrum and Other Psychotic Disorder', category: 'PSYCHOTIC', aliases: ['Paylaşılmış Psikotik Bozukluk', 'Folie à Deux', 'İkili Delilik', 'İndüklenmiş Sanrı', 'Hafifletilmiş Psikoz Sendromu', 'Süregen İşitsel Varsanılar', 'F28'] },
  other_specified_depressive: { id: 'other_specified_depressive', nameTr: 'Belirlenmiş Diğer Bir Depresif Bozukluk', nameEn: 'Other Specified Depressive Disorder', category: 'MOOD', aliases: ['Yineleyen Kısa Depresyon', 'Kısa Süreli Depresif Epizod', 'Yetersiz Belirtili Depresif Epizod', 'F32.89'] },
  ocd_due_to_medical: { id: 'ocd_due_to_medical', nameTr: 'Başka Bir Sağlık Durumuna Bağlı Obsesif-Kompulsif ve İlişkili Bozukluk', nameEn: 'Obsessive-Compulsive and Related Disorder Due to Another Medical Condition', category: 'OCD_RELATED', aliases: ['Organik OKB', 'PANDAS', 'PANS', 'Streptokok Sonrası OKB', 'F06.8'] },
  other_specified_dissociative: { id: 'other_specified_dissociative', nameTr: 'Belirlenmiş Diğer Bir Dissosiyatif Bozukluk', nameEn: 'Other Specified Dissociative Disorder', category: 'DISSOCIATIVE', aliases: ['Ganser Sendromu', 'Dissosiyatif Trans', 'Ele Geçirilme Transı', 'Zorlayıcı İkna Sonrası Kimlik Bozulması', 'Akut Dissosiyatif Tepki', 'F44.89'] },
  major_neurocognitive_another_medical: { id: 'major_neurocognitive_another_medical', nameTr: 'Başka Bir Sağlık Durumuna Bağlı Majör Nörobilişsel Bozukluk', nameEn: 'Major Neurocognitive Disorder Due to Another Medical Condition', category: 'NEUROCOGNITIVE', aliases: ['Normal Basınçlı Hidrosefali', 'NPH', 'Hakim-Adams Sendromu', 'Geri Dönüşümlü Demans'] },
  other_specified_paraphilic: { id: 'other_specified_paraphilic', nameTr: 'Belirlenmiş Diğer Bir Parafilik Bozukluk', nameEn: 'Other Specified Paraphilic Disorder', category: 'PARAPHILIC', aliases: ['Nekrofili', 'Zoofili', 'Koprofili', 'Klismafili', 'Ürofili', 'Telefon Skatolojisi', 'F65.89'] },
};

const MANUAL = {};

MANUAL.other_specified_schizophrenia_spectrum = {
  clinicalDescription: {
    overview: 'Şizofreni açılımı ve diğer psikotik bozukluklara özgü belirtilerin (sanrı, varsanı, dağınık konuşma ya da davranış vb.) klinik açıdan belirgin sıkıntı ya da işlevsellik kaybına yol açtığı, ancak bu gruptaki hiçbir bozukluğun ölçütlerinin tümüyle karşılanmadığı ve klinisyenin nedenini belirttiği durumlarda kullanılır (ör. "belirlenmiş diğer psikotik bozukluk, süregen işitsel varsanılar"). DSM-IV\'teki Paylaşılmış Psikotik Bozukluk (folie à deux) DSM-5\'te ayrı tanı olmaktan çıkarılmıştır: ikinci kişi sanrılı bozukluk ölçütlerini karşılıyorsa o tanı konur, karşılamıyorsa bu kategori kullanılır. DSM-5-TR Bölüm III\'te önerilen Hafifletilmiş Psikoz Sendromu da klinik kullanımda bu kategoriyle kodlanır.',
    epidemiology: 'Kategori için ayrı bir yaygınlık verisi yoktur. Psikoz açısından yüksek riskli (prodromal) gençler ve tek bir kalıcı belirti (ör. yalnızca işitsel varsanı) gösteren kişiler klinik örneklemlerde azımsanmayacak bir grup oluşturur. Paylaşılmış sanrılar seyrek bildirilir; çoğunlukla toplumdan yalıtılmış, yakın ilişkideki kişilerde (kardeşler, eşler, ebeveyn-çocuk) görülür.',
    etiology: 'Nedenler örneğe göre değişir. Paylaşılmış sanrılarda baskın (birincil) kişinin sanrısı, toplumsal yalıtılmışlık ve ikincil kişinin bağımlı, edilgen ilişki örüntüsü belirleyicidir. Hafifletilmiş psikoz belirtilerinde şizofreniyle ortak genetik yatkınlık ile gelişimsel ve çevresel etkenler (esrar kullanımı, travma, kentsel yaşam) rol oynar.',
    prognosis: 'Gidiş örneğe bağlıdır. Paylaşılmış sanrılarda ikincil kişi baskın kişiden ayrıldığında sanrılar çoğu zaman hızla geriler; birincil kişi kendi tanısına göre tedavi edilir. Hafifletilmiş psikoz belirtileri olanların bir bölümü birkaç yıl içinde tam psikotik bozukluğa geçer, önemli bir bölümünde ise belirtiler geriler; düzenli izlem, psikososyal destek ve psikoza yönelik bilişsel davranışçı yaklaşımlar önerilir.'
  },
  criteriaList: [
    tanimlama('Belirlenmiş Diğer Bir Şizofreni Açılımı ve Diğer Psikotik Bozukluk', 'Şizofreni açılımı ve diğer psikotik bozukluklara'),
    { code: 'Örnekler', title: 'DSM-5-TR\'de Verilen Örnek Tablolar', content: 'Bu kategoriyle belirtilebilecek tablolara örnekler:', items: [
      '1. Süregen işitsel varsanılar: başka hiçbir belirti olmaksızın süregen olarak bulunan işitsel varsanılar.',
      '2. Duygudurum epizodlarıyla belirgin olarak örtüşen sanrılar: duygudurum epizodu olmayan dönemlerde de bulunan, ancak sürenin önemli bir bölümünde duygudurum epizoduyla örtüşen süregen sanrılar (sanrılı bozukluğun "kısa duygudurum epizodları" koşuluna uymayan tablo).',
      '3. Hafifletilmiş psikoz sendromu: gerçeklik değerlendirmesinin görece korunduğu, eşik altı ve psikoz benzeri belirtiler.',
      '4. Sanrılı bireyin partnerinde sanrısal belirtiler: yakın ilişkide baskın kişinin sanrısal içeriğinin, sanrılı bozukluk ölçütlerini tam karşılamayan ikinci kişide sanrısal inanca dönüşmesi (eski adıyla folie à deux).'
    ] },
    belirtilmemis('Belirtilmemiş Şizofreni Açılımı ve Diğer Psikotik Bozukluk')
  ]
};

MANUAL.other_specified_depressive = {
  clinicalDescription: {
    overview: 'Depresif bozukluklara özgü belirtilerin klinik açıdan belirgin sıkıntı ya da işlevsellik kaybına yol açtığı, ancak bu gruptaki hiçbir bozukluğun ölçütlerinin tümüyle karşılanmadığı ve klinisyenin nedenini belirttiği durumlarda kullanılır. DSM-5-TR\'nin verdiği örnekler arasında yineleyen kısa depresyon, kısa süreli depresif epizod (4-13 gün) ve yetersiz belirtili depresif epizod bulunur. Bu tablolar tek başına ayrı tanı değildir; kayıtta kategori adından sonra örnek belirtilir (ör. "belirlenmiş diğer depresif bozukluk, yineleyen kısa depresyon").',
    epidemiology: 'Kategori için ayrı bir yaygınlık verisi yoktur. Eşik altı depresif tablolar toplumda tam ölçütlü majör depresif bozukluktan daha sık görülür ve birinci basamakta önemli bir başvuru nedenidir.',
    etiology: 'Majör depresif bozuklukla ortak biyolojik, psikolojik ve toplumsal etkenler (kalıtsal yatkınlık, stres, olumsuz bilişsel şemalar, kişilerarası sorunlar) düşünülür. Ayırıcı tanıda bipolar bozukluklar, siklotimi, adet öncesi disforik bozukluk, uyum bozukluğu ve sınırda kişilik bozukluğundaki duygusal dalgalanmalar değerlendirilmelidir.',
    prognosis: 'Eşik altı depresif tablolar ileride majör depresif epizod gelişimi için risk taşır; işlev kaybı ve intihar düşünceleriyle ilişkili olabilir. Psikoeğitim, psikoterapi (bilişsel davranışçı terapi, kişilerarası terapi, davranışsal aktivasyon) ve yakın izlem önerilir; ilaç tedavisi belirti yükü ve öyküye göre değerlendirilir.'
  },
  criteriaList: [
    tanimlama('Belirlenmiş Diğer Bir Depresif Bozukluk', 'Depresif bozukluklara'),
    { code: 'Örnekler', title: 'DSM-5-TR\'de Verilen Örnek Tablolar', content: 'Bu kategoriyle belirtilebilecek tablolara örnekler:', items: [
      '1. Yineleyen kısa depresyon: çökkün duygudurum ve en az dört diğer depresif belirtinin 2-13 gün sürdüğü dönemlerin, en az ardışık 12 ay boyunca ayda en az bir kez görülmesi (adet döngüsüyle ilişkisiz); kişi başka bir depresif ya da bipolar bozukluğun ölçütlerini hiç karşılamamıştır ve şu anda psikotik bozukluk ölçütlerini karşılamamaktadır.',
      '2. Kısa süreli depresif epizod (4-13 gün): çökkün duygudurum ve diğer sekiz majör depresif epizod belirtisinden en az dördünün, belirgin sıkıntı ya da işlev bozulmasıyla birlikte en az 4 gün ancak 14 günden kısa sürmesi; tablo başka bir depresif ya da bipolar bozukluğu ve yineleyen kısa depresyon ölçütlerini karşılamaz.',
      '3. Yetersiz belirtili depresif epizod: çökkün duygudurum ve diğer sekiz majör depresif epizod belirtisinden en az birinin, en az 2 hafta boyunca belirgin sıkıntı ya da işlev bozulmasıyla bulunması; başka bir depresif ya da bipolar bozukluğun ölçütleri karşılanmaz.'
    ] },
    belirtilmemis('Belirtilmemiş Depresif Bozukluk')
  ]
};

MANUAL.ocd_due_to_medical = {
  clinicalDescription: {
    overview: 'Obsesyonların, kompulsiyonların, dış görünümle uğraşların, biriktirmenin, deri ya da saç yolmanın veya bedene yönelik diğer yineleyici davranışların klinik tabloda öne çıktığı ve öykü, fizik muayene ya da laboratuvar bulgularıyla bunların başka bir sağlık durumunun doğrudan patofizyolojik sonucu olduğunun gösterildiği durumdur. Bazal gangliyonları etkileyen durumlar (ör. Sydenham koresi, inme, ensefalit, travmatik beyin hasarı, frontotemporal dejenerasyon) başlıca örneklerdir. Streptokok enfeksiyonu sonrası ani başlayan OKB ve tiklerle tanımlanan PANDAS/PANS tablosu, tıbbi neden kanıtlandığında bu kategoriyle kodlanır; ancak PANDAS\'ın ayrı bir hastalık olarak geçerliliği ve tedavisi tartışmalıdır.',
    epidemiology: 'Ayrı bir yaygınlık verisi yoktur. Sydenham koresi olan çocukların önemli bir bölümünde obsesif-kompulsif belirtiler bildirilmiştir; PANDAS/PANS sıklığı tanım ölçütlerindeki farklılıklar nedeniyle belirsizdir.',
    etiology: 'Kortiko-striato-talamo-kortikal devreleri etkileyen yapısal, enfeksiyöz, otoimmün ya da dejeneratif süreçler sorumlu tutulur. Otoimmün varsayımda streptokoka karşı oluşan antikorların bazal gangliyonlarla çapraz tepkimeye girdiği öne sürülür.',
    prognosis: 'Gidiş altta yatan sağlık durumuna bağlıdır; tıbbi neden tedavi edildiğinde belirtiler azalabilir. Belirtilere yönelik maruz bırakma ve tepki önleme ile SSRI kullanılabilir; enfeksiyon ya da bağışıklık tedavileri ilgili uzmanlık alanının kararıyla planlanır.'
  },
  criteriaList: [
    { code: 'Kriter A', title: 'Baskın Obsesif-Kompulsif ve İlişkili Belirtiler', content: 'Klinik tabloda obsesyonlar, kompulsiyonlar, dış görünümle uğraşlar, biriktirme, deri yolma, saç yolma, bedene yönelik diğer yineleyici davranışlar ya da obsesif-kompulsif ve ilişkili bozukluğa özgü diğer belirtiler öne çıkar.' },
    { code: 'Kriter B', title: 'Tıbbi Nedenin Kanıtı', content: 'Öykü, fizik muayene ya da laboratuvar bulgularından, bozukluğun başka bir sağlık durumunun doğrudan patofizyolojik sonucu olduğuna ilişkin kanıt vardır.' },
    { code: 'Kriter C-E', title: 'Dışlamalar ve Klinik Önem', content: 'Bozukluk başka bir ruhsal bozuklukla daha iyi açıklanamaz (C); yalnızca deliryum sırasında ortaya çıkmaz (D); klinik açıdan belirgin sıkıntıya ya da toplumsal, mesleki veya diğer önemli alanlarda işlevsellik kaybına yol açar (E).' },
    { code: 'Belirleyiciler', title: 'Baskın Belirti Türü', content: 'Obsesif-kompulsif bozukluk benzeri belirtilerle; dış görünümle uğraşlarla; biriktirme belirtileriyle; saç yolma belirtileriyle; deri yolma belirtileriyle.' }
  ]
};

MANUAL.other_specified_dissociative = {
  clinicalDescription: {
    overview: 'Dissosiyatif bozukluklara özgü belirtilerin klinik açıdan belirgin sıkıntı ya da işlevsellik kaybına yol açtığı, ancak bu gruptaki hiçbir bozukluğun ölçütlerinin tümüyle karşılanmadığı ve klinisyenin nedenini belirttiği durumlarda kullanılır. DSM-5-TR\'nin örnekleri: süregen ve yineleyen karışık dissosiyatif belirtiler, uzun süreli ve yoğun zorlayıcı ikna sonrası kimlik bozulması, stresli olaylara akut dissosiyatif tepkiler ve dissosiyatif trans. DSM-IV\'te "başka türlü adlandırılamayan dissosiyatif bozukluk" örneği olan Ganser sendromu (yaklaşık yanıtlar) DSM-5-TR\'de ayrı bir tanı değildir; klinik uygulamada bu kategoriyle kodlanır. Ele geçirilme biçimindeki kimlik değişiklikleri dissosiyatif kimlik bozukluğu ölçütlerini karşılıyorsa o tanı konur.',
    epidemiology: 'Ayrı bir yaygınlık verisi yoktur. Klinik örneklemlerde dissosiyatif tanılar içinde sık kullanılan kategorilerden biridir; trans ve ele geçirilme tabloları bazı kültürlerde daha sık bildirilir. Ganser sendromu seyrektir ve çoğunlukla tutukluluk gibi ağır stres ortamlarında bildirilmiştir.',
    etiology: 'Erken ve süregen travma, ağır akut stresörler, uzun süreli zorlayıcı ikna (ör. işkence, tarikat telkini, uzun süreli siyasi tutukluluk), dissosiyatif yatkınlık ve kültürel bağlam rol oynar.',
    prognosis: 'Gidiş örneğe göre değişir. Akut dissosiyatif tepkiler ve Ganser tablosu stresör azaldığında çoğu zaman günler-haftalar içinde geriler; süregen karışık dissosiyatif belirtiler daha uzun, travma odaklı ve aşamalı psikoterapi gerektirir. Ayırıcı tanıda temarruz, yapay bozukluk, psikotik bozukluklar ve nörolojik durumlar dışlanmalıdır.'
  },
  criteriaList: [
    tanimlama('Belirlenmiş Diğer Bir Dissosiyatif Bozukluk', 'Dissosiyatif bozukluklara'),
    { code: 'Örnekler', title: 'DSM-5-TR\'de Verilen Örnek Tablolar', content: 'Bu kategoriyle belirtilebilecek tablolara örnekler:', items: [
      '1. Süregen ve yineleyen karışık dissosiyatif belirtiler: dissosiyatif kimlik bozukluğu ölçütlerini tam karşılamayan kimlik bozulmaları ve kimlik değişimi yaşantılarıyla giden tablolar.',
      '2. Uzun süreli ve yoğun zorlayıcı ikna sonrası kimlik bozulması: beyin yıkama, düşünce reformu, uzun süreli siyasi tutukluluk, işkence ya da tarikat telkini sonrası kimlikte kalıcı değişiklikler ya da kimliğin bilinçli olarak sorgulanması.',
      '3. Stresli olaylara akut dissosiyatif tepkiler: genellikle 1 aydan kısa, bazen yalnızca birkaç saat ya da gün süren; bilinç daralması, depersonalizasyon, derealizasyon, algı bozuklukları, mikroamneziler, geçici stupor ve/veya duyusal-motor işlev değişiklikleriyle giden tablolar.',
      '4. Dissosiyatif trans: yakın çevrenin farkındalığının ileri derecede daralması ya da tümüyle yitirilmesi, çevresel uyaranlara belirgin tepkisizlik; kabul gören kolektif kültürel ya da dinsel bir uygulamanın olağan parçası değildir.'
    ] },
    { code: 'Klinik Not', title: 'Ganser Sendromu (Yaklaşık Yanıtlar)', content: 'Basit sorulara doğrunun hemen yanındaki yanlış yanıtların verilmesi (vorbeireden), bilinç bulanıklığı, dissosiyatif amnezi ve sıklıkla konversiyon belirtileriyle giden, çoğunlukla ağır stres altında (ör. tutukluluk) ortaya çıkan tablodur. DSM-5-TR\'de ayrı tanı değildir; temarruz ve yapay bozukluktan ayrımı dikkatle yapılmalıdır.' },
    belirtilmemis('Belirtilmemiş Dissosiyatif Bozukluk')
  ]
};

MANUAL.major_neurocognitive_another_medical = {
  clinicalDescription: {
    overview: 'Majör nörobilişsel bozukluk ölçütlerinin karşılandığı ve öykü, fizik muayene ya da laboratuvar bulgularıyla bilişsel gerilemenin, DSM-5-TR\'de ayrıca adlandırılan nedenler (Alzheimer hastalığı, vasküler hastalık, Lewy cisimcikleri, frontotemporal dejenerasyon, travmatik beyin hasarı, HIV, prion, Parkinson ve Huntington hastalıkları, madde/ilaç) dışında başka bir sağlık durumunun patofizyolojik sonucu olduğunun gösterildiği durumdur. Örnekler: normal basınçlı hidrosefali, beyin tümörü, subdural hematom, multipl skleroz, hipotiroidi, B12 eksikliği, nörosifiliz ve diğer enfeksiyonlar, sistemik lupus. Normal basınçlı hidrosefali; yürüme bozukluğu, idrar kaçırma ve bilişsel yavaşlama üçlüsü (Hakim-Adams) ve şant cerrahisiyle düzelebilmesiyle bu grubun en bilinen örneğidir.',
    epidemiology: 'Nedenlere göre değişir; ayrı bir yaygınlık verisi yoktur. Normal basınçlı hidrosefali çoğunlukla 60 yaş üstünde görülür ve demans tablolarının küçük ama tedavi edilebilir bir bölümünü oluşturur.',
    etiology: 'Altta yatan sağlık durumu (yapısal, metabolik, endokrin, enfeksiyöz, otoimmün) beyin işlevini doğrudan bozar. Normal basınçlı hidrosefalide beyin omurilik sıvısının emiliminin bozulmasıyla ventriküller genişler ve periventriküler beyaz cevher etkilenir; bu nedenle subkortikal tipte (yavaşlık, dikkat ve yürütücü işlev bozukluğu) bilişsel gerileme görülür.',
    prognosis: 'Gidiş nedene bağlıdır; bir bölümü (normal basınçlı hidrosefali, hipotiroidi, B12 eksikliği, bazı tümörler ve enfeksiyonlar) tedaviyle kısmen ya da tamamen geri dönebilir. Normal basınçlı hidrosefalide lomber ponksiyonla beyin omurilik sıvısı boşaltımına (tap testi) yanıt, şant cerrahisinden yarar görecek hastaları seçmeye yardımcı olur; erken müdahalede sonuç daha iyidir.'
  },
  criteriaList: [
    { code: 'Kriter A', title: 'Majör Nörobilişsel Bozukluk Ölçütleri', content: 'Bir ya da daha çok bilişsel alanda (karmaşık dikkat, yürütücü işlev, öğrenme ve bellek, dil, algısal-motor işlev, toplumsal biliş) önceki düzeye göre belirgin gerileme vardır; gerileme günlük etkinliklerde bağımsızlığı bozar, yalnızca deliryum sırasında ortaya çıkmaz ve başka bir ruhsal bozuklukla daha iyi açıklanamaz.' },
    { code: 'Kriter B', title: 'Tıbbi Nedenin Kanıtı', content: 'Öykü, fizik muayene ya da laboratuvar bulgularından, nörobilişsel bozukluğun başka bir sağlık durumunun patofizyolojik sonucu olduğuna ilişkin kanıt vardır.' },
    { code: 'Kriter C', title: 'Daha İyi Açıklanamama', content: 'Bilişsel bozukluk başka bir ruhsal bozuklukla ya da özgül olarak adlandırılmış başka bir nörobilişsel bozuklukla (madde/ilaç kaynaklı olanlar dahil) daha iyi açıklanamaz.' },
    { code: 'Klinik Not', title: 'Normal Basınçlı Hidrosefali', content: 'Klasik üçlü: "mıknatıs" yürüyüşü (yürüme apraksisi), idrar kaçırma ve bilişsel yavaşlama; görüntülemede kortikal atrofiyle orantısız ventrikülomegali. Kayıtta önce tıbbi durum, ardından nörobilişsel bozukluk yazılır.' }
  ]
};

MANUAL.other_specified_paraphilic = {
  clinicalDescription: {
    overview: 'Parafilik bozukluklara özgü belirtilerin klinik açıdan belirgin sıkıntıya ya da işlevsellik kaybına yol açtığı, ancak bu gruptaki hiçbir bozukluğun ölçütlerinin tümüyle karşılanmadığı ve klinisyenin nedenini belirttiği durumlarda kullanılır. DSM-5-TR\'nin örnekleri, en az 6 ay süren ve belirgin sıkıntı ya da işlev bozulmasına yol açan, telefon skatolojisi (müstehcen telefon aramaları), nekrofili (cesetler), zoofili (hayvanlar), koprofili (dışkı), klismafili (lavman) ya da ürofili (idrar) içeren yoğun ve yineleyen cinsel uyarılmadır. Kayıtta kategori adından sonra parafilinin türü yazılır (ör. "belirlenmiş diğer parafilik bozukluk, zoofili"). Bozukluk tanısı için cinsel ilginin kendisi yetmez; kişide sıkıntı ya da işlev bozulması yaratması veya başkalarına zarar vermesi gerekir.',
    epidemiology: 'Bu parafililerin çoğu seyrektir ve güvenilir yaygınlık verisi yoktur; bilgilerin büyük bölümü klinik ve adli olgu bildirimlerine dayanır. Parafilik bozukluklar erkeklerde belirgin olarak daha sık görülür.',
    etiology: 'Erken öğrenme ve koşullanma, cinsel gelişimdeki farklılıklar, dürtü denetimi güçlükleri ve eşlik eden ruhsal bozukluklar (kişilik bozuklukları, madde kullanımı, zihinsel yetiyitimi) birlikte rol oynar; tek bir neden saptanmamıştır.',
    prognosis: 'Parafilik ilgiler genellikle süreklidir; tedavinin amacı ilginin denetimini ve zarar verici davranışların önlenmesini sağlamaktır. Bilişsel davranışçı yaklaşımlar, yineleme önleme ve gerektiğinde ilaç tedavisi uzman değerlendirmesiyle uygulanır. Bazı davranışlar (hayvanlara ya da cesetlere yönelik eylemler, rızasız telefon tacizi) yasal sonuçlar doğurur.'
  },
  criteriaList: [
    tanimlama('Belirlenmiş Diğer Bir Parafilik Bozukluk', 'Parafilik bozukluklara'),
    { code: 'Örnekler', title: 'DSM-5-TR\'de Verilen Örnek Tablolar', content: 'En az 6 ay süren, belirgin sıkıntıya ya da işlev bozulmasına yol açan yoğun ve yineleyen cinsel uyarılma içeren örnekler:', items: [
      '1. Telefon skatolojisi (müstehcen telefon aramaları).',
      '2. Nekrofili (cesetler).',
      '3. Zoofili (hayvanlar).',
      '4. Koprofili (dışkı).',
      '5. Klismafili (lavman).',
      '6. Ürofili (idrar).'
    ] },
    belirtilmemis('Belirtilmemiş Parafilik Bozukluk')
  ]
};

for (const id of Object.keys(DIAG)) {
  MANUAL[id] = { id, nameTr: DIAG[id].nameTr, nameEn: DIAG[id].nameEn, ...MANUAL[id] };
}
module.exports = { DIAG, MANUAL };
