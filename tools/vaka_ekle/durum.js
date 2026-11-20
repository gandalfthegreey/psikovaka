#!/usr/bin/env node
/**
 * Vaka yazarı için durum özeti (salt okur; hiçbir dosyaya yazmaz). Claude ajan Y, 2026-11-20.
 *
 * Kullanım (proje kökünden):
 *   node tools/vaka_ekle/durum.js                    # sayılar, izinli değerler, tanı kapsama tablosu (az vakalı önce)
 *   node tools/vaka_ekle/durum.js --alan CHILD       # yalnızca o alanın (course) mevcut vakalarında görülen kategoriler
 *   node tools/vaka_ekle/durum.js --zorluk Zor       # tablo o zorluktaki vaka sayısını da gösterir
 *   node tools/vaka_ekle/durum.js --tani <diagnosisId>  # tek tanının DSM ölçütleri, mevcut vakaları, terapi/ilaç eşlemesi
 *   node tools/vaka_ekle/durum.js --ornek case-080     # mevcut bir vakanın tamamını JSON olarak yazar (üslup örneği)
 *   --kok <dizin>  başka bir proje kopyasına karşı (testler için)
 */
'use strict';
const o = require('./ortak.js');

const argv = process.argv.slice(2);
const opt = k => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
const data = o.loadData(o.rootFromArgs(argv));
const { cases, courses, diagnoses, dsmCategories, therapies, pharma, pharmaMap, archived, manual } = data;
const alan = opt('--alan'), zorluk = opt('--zorluk'), tani = opt('--tani');
const out = [];
const P = s => out.push(s);

const cnt = (arr, f) => arr.reduce((m, x) => { const k = f(x); m[k] = (m[k] || 0) + 1; return m; }, {});
const byDx = cnt(cases, c => c.diagnosisId);
const next = o.nextCaseNumber(data);
const difficulties = [...new Set(cases.map(c => c.difficulty))];
const short = s => String(s).replace(/\s*\([^()]*\)/g, '').trim();
const goldTher = id => therapies.filter(t => (t.goldForDiagnoses || []).includes(id)).map(t => t.id);
const usedTher = id => [...new Set(cases.filter(c => c.diagnosisId === id).map(c => c.therapyId))];

const ornek = opt('--ornek');
if (ornek) {
    const c = cases.find(x => x.id === ornek);
    if (!c) { console.error(`Vaka bulunamadı: ${ornek} (ör. case-080)`); process.exit(1); }
    console.log(JSON.stringify(c, null, 2));
    process.exit(0);
}

if (tani) {
    const d = diagnoses.find(x => x.id === tani);
    if (!d) { console.error(`Tanı bulunamadı: ${tani}. Tam liste için: node tools/vaka_ekle/durum.js`); process.exit(1); }
    const m = manual[tani] || {};
    P(`# ${d.id} — ${d.nameTr} / ${d.nameEn}`);
    P(`Kategori: ${d.category} (${(dsmCategories[d.category] || {}).name}) | Takma adlar (ipucu 1-5'te ve başlıkta YASAK): ${(d.aliases || []).join('; ') || '-'}`);
    const cd = m.clinicalDescription || {};
    for (const k of ['overview', 'epidemiology', 'etiology', 'prognosis']) if (cd[k]) P(`${k}: ${cd[k]}`);
    P('Ölçütler:');
    for (const cr of m.criteriaList || []) {
        P(`- ${cr.code} — ${cr.title}: ${cr.content}`);
        for (const it of cr.items || []) P(`    • ${it}`);
    }
    const mine = cases.filter(c => c.diagnosisId === tani);
    P(`Mevcut vakalar (${mine.length}): ${mine.map(c => `${c.id} [${c.course}, ${c.difficulty}] "${c.patientSummary}"`).join(' | ') || 'yok'}`);
    P(`therapyId — mevcut vakalarda: ${usedTher(tani).join(', ') || '-'} | goldForDiagnoses: ${goldTher(tani).join(', ') || '-'}`);
    P(`pharmacologyId — tanı→protokol haritası: ${pharmaMap[tani] || '-'} | mevcut vakalarda: ${[...new Set(mine.map(c => c.pharmacologyId))].join(', ') || '-'}`);
    console.log(out.join('\n'));
    process.exit(0);
}

P(`# PsikoVaka vaka durumu`);
P(`Aktif vaka: ${cases.length} | Arşivlenmiş: ${archived.length} (numaraları ${archived.map(a => a.caseNumber).join(',')}; yeniden KULLANILMAZ) | Sıradaki: ${o.caseIdFor(next)} (caseNumber ${next})`);
P(`Not: No. 151 ve üstü oyunda otomatik "Yeni Vakalar" paketine girer.`);
const dc = cnt(cases, c => c.difficulty);
P(`difficulty (izinli): ${difficulties.map(x => `"${x}" (${dc[x]})`).join(', ')}`);
const cc = cnt(cases, c => c.course);
P(`course (izinli; ALL ve COMORBID yeni vakada kullanılmaz): ${Object.keys(courses).filter(k => k !== 'ALL').map(k => `${k}="${courses[k].name}" (${cc[k] || 0}${zorluk ? `, ${zorluk}: ${cases.filter(c => c.course === k && c.difficulty === zorluk).length}` : ''})`).join('; ')}`);
P(`therapyId (${therapies.length}): ${therapies.map(t => `${t.id}=${short(t.nameTr)}`).join('; ')}`);
P(`pharmacologyId (${pharma.length}; yazılmazsa otomatik çözülür): ${pharma.map(p => `${p.id}=${short(p.nameTr)}`).join('; ')}`);

let cats = Object.keys(dsmCategories);
if (alan) {
    if (!courses[alan] || alan === 'ALL') { console.error(`Bilinmeyen alan: ${alan}. İzinli: ${Object.keys(courses).filter(k => k !== 'ALL').join(', ')}`); process.exit(1); }
    const used = new Set(cases.filter(c => c.course === alan).map(c => c.category));
    cats = cats.filter(k => used.has(k));
    P(`Filtre --alan ${alan}: bu alandaki mevcut vakaların kategorileri: ${cats.join(', ')}`);
}
P('');
P('## Kategori özeti: kategori | tanı sayısı | vakasız tanı | vaka');
for (const k of cats) {
    const ds = diagnoses.filter(d => d.category === k);
    P(`${k} (${dsmCategories[k].name}) | ${ds.length} | ${ds.filter(d => !byDx[d.id]).length} | ${ds.reduce((a, d) => a + (byDx[d.id] || 0), 0)}`);
}
P('');
P(`## Tanı kapsama (az vakalı önce). Sütunlar: vaka sayısı${zorluk ? ` | ${zorluk}` : ''} | diagnosisId | Türkçe ad | kategori | önerilen therapyId | pharmacologyId haritası`);
const weak = d => (/^(other_specified|unspecified)_|^gender_dysphoria|^pedophilic/.test(d.id) ? 1 : 0);
const rows = diagnoses.filter(d => cats.includes(d.category))
    .sort((a, b) => (byDx[a.id] || 0) - (byDx[b.id] || 0) || weak(a) - weak(b) || cats.indexOf(a.category) - cats.indexOf(b.category) || a.id.localeCompare(b.id));
for (const d of rows) {
    const n = byDx[d.id] || 0;
    const th = usedTher(d.id).concat(goldTher(d.id).filter(x => !usedTher(d.id).includes(x))).slice(0, 3);
    const z = zorluk ? ` | ${cases.filter(c => c.diagnosisId === d.id && c.difficulty === zorluk).length}` : '';
    const not = /^(other_specified|unspecified)_/.test(d.id) ? ' | ÖNERİLMEZ (belirtilmemiş/diğer: oyunda tek doğru cevap olarak zayıf)'
        : (/^gender_dysphoria|^pedophilic/.test(d.id) ? ' | YALNIZCA EMRE İSTERSE (hassas konu)' : '');
    P(`${n}${z} | ${d.id} | ${d.nameTr} | ${d.category} | ${th.join(',') || '-'} | ${pharmaMap[d.id] || '-'}${not}`);
}
P('');
P(`Toplam tanı: ${rows.length} | vakasız: ${rows.filter(d => !byDx[d.id]).length} | 1 vakalı: ${rows.filter(d => byDx[d.id] === 1).length} | 3+ vakalı: ${rows.filter(d => (byDx[d.id] || 0) >= 3).length}`);
P('Ayrıntı için: node tools/vaka_ekle/durum.js --tani <diagnosisId>');
console.log(out.join('\n'));
