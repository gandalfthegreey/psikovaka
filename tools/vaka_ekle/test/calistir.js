#!/usr/bin/env node
/**
 * tools/vaka_ekle testleri (Claude ajan Y, 2026-11-20). Gerçek proje dosyalarına DOKUNMAZ:
 * gerekli dosyaları işletim sisteminin geçici klasörüne kopyalar ve her şeyi orada çalıştırır.
 *
 * Kullanım (proje kökünden):
 *   node tools/vaka_ekle/test/calistir.js          # veri/doğrulayıcı/ekle testleri
 *   node tools/vaka_ekle/test/calistir.js --git    # + .git kopyasıyla yayinla.js --kuru (ağ gerekir: git ls-remote)
 * Çıkış kodu: tüm testler geçerse 0.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const REAL = path.resolve(__dirname, '..', '..', '..');
const TOOLS = path.join(REAL, 'tools', 'vaka_ekle');
const WITH_GIT = process.argv.includes('--git');
let pass = 0, fail = 0;
const failures = [];
function ok(cond, name, extra) {
    if (cond) { pass++; console.log(`  ✓ ${name}`); }
    else { fail++; failures.push(name); console.log(`  ✗ ${name}${extra ? `\n      ${String(extra).split('\n').slice(0, 8).join('\n      ')}` : ''}`); }
}
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const clone = x => JSON.parse(JSON.stringify(x));

const COPY = ['index.html', 'build_portable_single_file.js', 'deploy_to_github.js', 'AI_ISBIRLIGI.md', 'js', 'css',
    path.join('tools', 'icerik', 'tani_temizligi'), path.join('tools', 'icerik', 'vaka_aciklamalari'),
    path.join('supabase', 'seed', 'generate_answer_key.js')];
function makeCopy(label, extra = []) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), `psikovaka-${label}-`));
    for (const rel of [...COPY, ...extra]) {
        const src = path.join(REAL, rel);
        if (!fs.existsSync(src)) continue;
        fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
        fs.cpSync(src, path.join(dir, rel), { recursive: true });
    }
    // çalışma tablosunu boşalt (testte başka asistan yok sayılır)
    const ai = path.join(dir, 'AI_ISBIRLIGI.md');
    if (fs.existsSync(ai)) fs.writeFileSync(ai, setTableRows(fs.readFileSync(ai, 'utf8'), []), 'utf8');
    return dir;
}
function setTableRows(md, rows) {
    const hdr = '| Asistan | Görev | Dokunulan dosyalar | Başlangıç |\n|---|---|---|---|\n';
    const i = md.indexOf(hdr);
    if (i < 0) throw new Error('tablo başlığı yok');
    const after = md.slice(i + hdr.length);
    const rest = after.slice(after.search(/^(?!\|)/m));
    return md.slice(0, i) + hdr + rows.map(r => r + '\n').join('') + rest;
}
function node(args, cwd, opts = {}) {
    const r = spawnSync(process.execPath, args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'], timeout: opts.timeout || 180000, env: { ...process.env, ...(opts.env || {}) } });
    return { status: r.error ? -1 : r.status, out: `${r.stdout || ''}${r.stderr || ''}`, error: r.error };
}
function writeJson(dir, name, data) { const p = path.join(dir, name); fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8'); return p; }

const o = require(path.join(TOOLS, 'ortak.js'));
const v = require(path.join(TOOLS, 'dogrula.js'));
const TEMPLATE = JSON.parse(fs.readFileSync(path.join(TOOLS, 'sablon.json'), 'utf8'))[0];

// ---------------------------------------------------------------------------------------------
console.log('\n[1] Şablon ve kalibrasyon');
const W = makeCopy('dogrula');
const data = o.loadData(W);
{
    const r = v.validateBatch([clone(TEMPLATE)], data);
    ok(r.errorCount === 0, 'sablon.json hatasız geçiyor', r.results[0].errors.join('\n'));
    ok(r.results[0].id === 'case-151', `sıradaki id case-151 (arşivdeki 145-150 atlanır), bulunan ${r.results[0].id}`);
    const ex = v.validateExisting(data);
    ok(ex.errorCount === 0, `--mevcut: ${data.cases.length} mevcut vakanın hepsi yapısal kurallardan geçiyor`, ex.results.filter(x => x.errors.length).map(x => x.label + ': ' + x.errors[0]).join('\n'));
    // hiçbir mevcut vaka çifti kopya sayılmamalı
    const ctx = v.buildContext(data);
    let flagged = 0;
    for (const c0 of data.cases) {
        const { id, caseNumber, secondaryDiagnosisId, ...c } = c0;
        const ctx2 = { ...ctx, corpus: ctx.corpus.filter(x => x.id !== id) };
        const rr = v.validateCase(c, ctx2, { mode: 'yeni' });
        if (rr.errors.some(e => e.startsWith('KOPYA'))) flagged++;
    }
    ok(flagged === 0, `kopya eşiği: mevcut ${data.cases.length} vakadan hiçbiri diğerlerinin kopyası sayılmıyor (işaretlenen ${flagged})`);
}

// ---------------------------------------------------------------------------------------------
console.log('\n[2] Her hata sınıfı yakalanıyor (bir bozuk örnek / kural)');
const BROKEN = [
    ['eksik alan', c => { delete c.dsmCriteriaSummary; }, /eksik alan: dsmCriteriaSummary/],
    ['fazla alan', c => { c.ekAlan = 'x'; }, /fazla\/bilinmeyen alan: ekAlan/],
    ['çift tanı alanı', c => { c.secondaryDiagnosisId = 'mdd'; }, /secondaryDiagnosisId kullanılamaz/],
    ['yanlış tip (patientSummary sayı)', c => { c.patientSummary = 67; }, /patientSummary metin/],
    ['yanlış tip (clues metin)', c => { c.clues = 'tek metin'; }, /clues tam olarak 6/],
    ['6 değil 5 ipucu', c => { c.clues.pop(); }, /clues tam olarak 6/],
    ['boş metin', c => { c.treatmentModality.therapyDetails = '  '; }, /boş metin: treatmentModality\.therapyDetails/],
    ['HTML etiketi', c => { c.dsmCriteriaSummary += ' <b>kalın</b>'; }, /HTML etiketi benzeri metin: dsmCriteriaSummary/],
    ['bilinmeyen diagnosisId', c => { c.diagnosisId = 'vascular_mci'; }, /diagnosisId tanı listesinde yok/],
    ['category tanıyla uyuşmuyor', c => { c.category = 'SOMATIC'; }, /category "SOMATIC" yanlış/],
    ['course listede yok', c => { c.course = 'GERIATRI'; }, /course geçersiz/],
    ['course COMORBID yasak', c => { c.course = 'COMORBID'; }, /course geçersiz/],
    ['difficulty listede yok', c => { c.difficulty = 'Çok Zor'; }, /difficulty geçersiz/],
    ['therapyId yok', c => { c.therapyId = 'cognitive_rehab'; }, /therapyId geçersiz/],
    ['pharmacologyId yok', c => { c.pharmacologyId = 'aspirin'; }, /pharmacologyId geçersiz/],
    ['id elle yanlış', c => { c.id = 'case-145'; }, /id "case-145" olamaz/],
    ['caseNumber arşivdeki numara', c => { c.caseNumber = 145; }, /caseNumber 145 olamaz/],
    ['explanation: whyThis 1 madde', c => { c.explanation.whyThis = [c.explanation.whyThis[0]]; }, /whyThis 2-4/],
    ['explanation: whyNot kendi cevabı', c => { c.explanation.whyNot[0].diagnosisId = c.diagnosisId; }, /vakanın kendi cevabı/],
    ['explanation: whyNot tekrar', c => { c.explanation.whyNot[1].diagnosisId = c.explanation.whyNot[0].diagnosisId; }, /whyNot içinde tekrar/],
    ['explanation: whyNot bilinmeyen id', c => { c.explanation.whyNot[0].diagnosisId = 'alzheimer'; }, /DIAGNOSES_DATABASE'de yok/],
    ['explanation: fazla anahtar', c => { c.explanation.kaynak = 'x'; }, /anahtarlar tam olarak whyThis/],
    ['explanation: 40 kelimeden az', c => { c.explanation = { whyThis: ['Kısa.', 'Kısa.'], whyNot: c.explanation.whyNot.slice(0, 2).map(w => ({ ...w, reason: 'Yok.' })), teachingPoint: 'Kısa.' }; }, /kelime sayısı aralık dışı/],
    ['miniQuiz 3 seçenek', c => { c.miniQuiz.options.pop(); }, /miniQuiz\.options tam olarak 4/],
    ['miniQuiz correctIndex aralık dışı', c => { c.miniQuiz.correctIndex = 4; }, /correctIndex 0-3/],
    ['miniQuiz aynı seçenek iki kez', c => { c.miniQuiz.options[3] = c.miniQuiz.options[2]; }, /aynı seçenek/],
    ['miniQuiz eksik anahtar', c => { delete c.miniQuiz.explanation; }, /miniQuiz anahtarları/],
    ['symptomHighlights metni ipucunda yok', c => { c.symptomHighlights[0].text = 'olmayan bir cümle'; }, /birebir geçmiyor/],
    ['symptomHighlights clueIndex 6', c => { c.symptomHighlights[0].clueIndex = 6; }, /clueIndex 0-5/],
    ['treatmentModality eksik anahtar', c => { delete c.treatmentModality.pharmacologyNote; }, /treatmentModality anahtarları/],
    ['başlıkta etiket', c => { c.patientSummary = '67 yaşında, erkek, emekli tapu memuru (Damarsal tablo)'; }, /patientSummary içinde etiket var/],
    ['SIZINTI 2. ipucunda takma ad', c => { c.clues[1] += ' Hafif damarsal demans düşünülüyor.'; }, /SIZINTI: 2\. ipucu içinde tanının takma adı/],
    ['SIZINTI büyük harf + Türkçe İ (3. ipucu)', c => { c.clues[2] += ' HAFİF VASKÜLER NÖROBİLİŞSEL BOZUKLUK.'; }, /SIZINTI: 3\. ipucu içinde tanının Türkçe adı/],
    ['SIZINTI aksansız yazım (4. ipucu)', c => { c.clues[3] += ' hafif vaskuler norobilissel bozuklugu'; }, /SIZINTI: 4\. ipucu/],
    ['SIZINTI İngilizce ad (1. ipucu)', c => { c.clues[0] += ' (mild vascular neurocognitive disorder?)'; }, /SIZINTI: 1\. ipucu içinde tanının İngilizce adı/],
    ['SIZINTI kategori adı (5. ipucu)', c => { c.clues[4] += ' Nörobilişsel bozukluklar açısından değerlendirildi.'; }, /SIZINTI: 5\. ipucu içinde DSM kategori adı/],
    ['SIZINTI alan adı (başlık)', c => { c.patientSummary = '67 yaşında, erkek, nörobilişsel & somatik poliklinik hastası'; }, /SIZINTI: patientSummary içinde alan/],
    ['SIZINTI "(… Tanı)" etiketi', c => { c.clues[2] += ' (2. Tanı)'; }, /etiketi var/]
];
for (const [name, mutate, re] of BROKEN) {
    const c = clone(TEMPLATE);
    mutate(c);
    const r = v.validateBatch([c], data);
    const errs = r.results[0].errors.join('\n');
    ok(r.errorCount > 0 && re.test(errs), name, errs || '(hata çıkmadı)');
}
{
    const r = v.validateBatch({ vaka: TEMPLATE }, data);
    ok(r.errorCount === 1 && /JSON DİZİSİ/.test(r.results[0].errors[0]), 'dosya dizi değilse hata');
    const r2 = v.validateBatch([], data);
    ok(r2.errorCount === 1, 'boş dizi hata');
}
{
    // izin verilenler: BKİ parantezi, pharmacologyId yazılmaması, 6. ipucunda tanı adı (yalnızca uyarı)
    const c = clone(TEMPLATE); c.patientSummary = '67 yaşında, erkek, emekli tapu memuru (BKİ: 27.1 kg/m²)';
    ok(v.validateBatch([c], data).errorCount === 0, 'başlıkta "(BKİ: …)" serbest');
    const c2 = clone(TEMPLATE); delete c2.pharmacologyId;
    const r2 = v.validateBatch([c2], data);
    ok(r2.errorCount === 0 && r2.results[0].pharmacologyId === data.resolvePharma(c2), `pharmacologyId yazılmazsa çözülür (${r2.results[0].pharmacologyId})`);
    const c3 = clone(TEMPLATE); c3.clues[5] += ' Hafif vasküler nörobilişsel bozukluk tablosudur.';
    const r3 = v.validateBatch([c3], data);
    ok(r3.errorCount === 0 && r3.results[0].warnings.some(w => /6\. ipucu tanının adını/.test(w)), '6. ipucunda tanı adı yalnızca uyarı');
    const c4 = clone(TEMPLATE); c4.clues[3] = 'MR normal.';
    ok(v.validateBatch([c4], data).results[0].warnings.some(w => /4\. ipucu \d+ karakter/.test(w)), 'çok kısa ipucu uyarısı');
    const c5 = clone(TEMPLATE); c5.differentialDiagnosis += '\n• Uydurma Sendromu: yok.';
    ok(v.validateBatch([c5], data).results[0].warnings.some(w => /Uydurma Sendromu/.test(w)), 'ayırıcı tanıda listede olmayan ad uyarısı');
    const c6 = clone(TEMPLATE); c6.diagnosisId = 'delusional_disorder'; c6.category = 'PSYCHOTIC';
    ok(v.validateBatch([c6], data).results[0].warnings.some(w => /zaten \d+ vakası var/.test(w)), 'çok vakalı tanı uyarısı (delusional_disorder)');
    const c7 = clone(TEMPLATE); c7.clues[0] = c7.clues[0] + ' Nörogörüntülemede vasküler lezyonlar, işlem hızında ılımlı gerileme var; telafi stratejileriyle bağımsız.';
    ok(v.validateBatch([c7], data).results[0].warnings.some(w => /1\. ipucu tanıya özgü/.test(w)), '1. ipucu çok belirleyici uyarısı');
}

// ---------------------------------------------------------------------------------------------
console.log('\n[3] Kopya yakalama');
{
    const ex = data.cases.find(c => c.id === 'case-080');
    const { id, caseNumber, ...exact } = clone(ex);
    let r = v.validateBatch([exact], data);
    ok(r.results[0].errors.some(e => /KOPYA: mevcut vaka case-080 ile birebir aynı/.test(e)), 'mevcut vakanın birebir kopyası');
    const near = clone(exact);
    near.patientSummary = '74 yaşında, erkek, emekli öğretmen';
    near.clues = near.clues.map(s => s.replace('76 yaşındaki', '74 yaşındaki').replace('2 yıldır', '3 yıldır').replace('cüzdanını', 'anahtarlarını').replace('18/30', '19/30'));
    r = v.validateBatch([near], data);
    ok(r.results[0].errors.some(e => /KOPYA: mevcut vaka case-080 ile çok benzer/.test(e)), 'mevcut vakanın birkaç kelimesi değiştirilmiş hâli', r.results[0].errors.join('\n'));
    const arch = data.archived[0];
    if (arch) {
        const { id: _i, caseNumber: _n, ...ac } = clone(arch);
        r = v.validateBatch([ac], data);
        ok(r.results[0].errors.some(e => /arşivlenmiş vaka/.test(e)), 'arşivlenmiş vakanın kopyası da yakalanıyor');
    }
    r = v.validateBatch([clone(TEMPLATE), clone(TEMPLATE)], data);
    ok(r.results[0].errors.length === 0 && r.results[1].errors.some(e => /bu dosyadaki case-151/.test(e)), 'aynı dosyada iki kez aynı vaka');
    ok(r.results[1].id === 'case-152', 'aynı dosyadaki 2. vakaya case-152 atanır');
}

// ---------------------------------------------------------------------------------------------
console.log('\n[4] ekle.js (geçici kopyada)');
const E = makeCopy('ekle');
{
    const casesPath = path.join(E, 'js', 'cases.js');
    const before = sha(casesPath);
    const batch = writeJson(E, 'yeni.json', [clone(TEMPLATE)]);
    let r = node([path.join(TOOLS, 'ekle.js'), batch, '--kuru', '--kok', E], E);
    ok(r.status === 0 && sha(casesPath) === before && /--kuru: hiçbir dosya yazılmadı/.test(r.out), '--kuru hiçbir şey yazmıyor', r.out.slice(-600));
    const bad = clone(TEMPLATE); bad.diagnosisId = 'yok_boyle';
    r = node([path.join(TOOLS, 'ekle.js'), writeJson(E, 'bozuk.json', [bad]), '--kok', E], E);
    ok(r.status === 1 && sha(casesPath) === before, 'hatalı dosyada ekle.js reddediyor, js/cases.js değişmiyor');

    r = node([path.join(TOOLS, 'ekle.js'), batch, '--kok', E], E);
    ok(r.status === 0, 'ekle.js başarıyla ekliyor', r.out.slice(-1500));
    const after = o.freshRequire(casesPath).CLINICAL_CASES;
    ok(after.length === data.cases.length + 1, `vaka sayısı ${data.cases.length} → ${after.length}`);
    const last = after[after.length - 1];
    ok(last.id === 'case-151' && last.caseNumber === 151, `numara sırayı sürdürüyor (en yüksek aktif 144, arşiv 150 → ${last.id})`);
    ok(Object.keys(last).join(',') === o.FIELD_ORDER.join(','), 'alan sırası mevcut vakalarla aynı', Object.keys(last).join(','));
    ok(JSON.stringify(after.slice(0, -1)) === JSON.stringify(data.cases), 'mevcut vakalar birebir korunuyor');
    const src = fs.readFileSync(casesPath, 'utf8');
    ok(/Zengin Klinik Vaka Veritabanı \(139 DSM-5-TR Vakası\)/.test(src) && /2026-11-15: resmî tanıya/.test(src), 'başlık yorumu derleyici biçiminde (sayı güncel, tarihli notlar korunmuş)');
    const b1 = sha(casesPath);
    r = node(['build_portable_single_file.js'], E);
    ok(r.status === 0 && /Hata: 0/.test(r.out), 'derleme 0 hata', r.out.slice(-400));
    ok(sha(casesPath) === b1, 'derleyici yeniden yazınca js/cases.js bayt bayt aynı (biçim birebir)');
    r = node([path.join('tools', 'icerik', 'tani_temizligi', 'dogrula.js')], E);
    ok(r.status === 0, 'tani_temizligi/dogrula.js geçiyor', r.out.slice(-600));
    r = node([path.join('tools', 'icerik', 'vaka_aciklamalari', 'dogrula.js')], E);
    ok(r.status === 0 && /139\/139/.test(r.out) && /1 vaka açıklamasını js\/cases\.js'ten aldı/.test(r.out), 'vaka_aciklamalari/dogrula.js yeni vakayı js/cases.js\'ten doğruluyor (139/139)', r.out.slice(-400));
    r = node([path.join(TOOLS, 'dogrula.js'), '--mevcut', '--kok', E], E);
    ok(r.status === 0, 'dogrula.js --mevcut eklemeden sonra da geçiyor', r.out.slice(-400));
    r = node([path.join('supabase', 'seed', 'generate_answer_key.js')], E);
    const sqlPath = path.join(E, 'supabase', 'seed', '0002_cases_answer_key.sql');
    const sql = fs.existsSync(sqlPath) ? fs.readFileSync(sqlPath, 'utf8') : '';
    ok(r.status === 0 && sql.includes("('case-151', 151, 'mild_neurocognitive_vascular', 'caregiver_behavioral', 'psychotherapy_first_no_drug', 'NEUROCOGNITIVE', 'Zor', 'NEURO_SOMATIC')"), 'cevap anahtarı üreticisi yeni vakayı içeriyor', r.out.slice(-400));

    // "Yeni Vakalar" paketi: app.js'teki gerçek getBuiltInPacksDefinition ile
    const app = fs.readFileSync(path.join(E, 'js', 'app.js'), 'utf8');
    const startIdx = app.indexOf('getBuiltInPacksDefinition() {');
    let depth = 0, j = app.indexOf('{', startIdx), endIdx = -1;
    for (; j < app.length; j++) { if (app[j] === '{') depth++; else if (app[j] === '}') { depth--; if (depth === 0) { endIdx = j; break; } } }
    const fn = new Function(app.slice(app.indexOf('{', startIdx) + 1, endIdx));
    const packs = fn.call({ allMasterCases: after });
    const flat = [];
    (function walk(x) { if (Array.isArray(x)) x.forEach(walk); else if (x && typeof x === 'object') { if (x.filterFn) flat.push(x); Object.values(x).forEach(y => { if (Array.isArray(y)) walk(y); }); } })(packs);
    const yeni = flat.find(p => p.id === 'pack_yeni');
    ok(yeni && yeni.filterFn(last) && yeni.count === 1, `"Yeni Vakalar" paketi case-151'i içeriyor (${yeni ? yeni.count : 0} vaka)`);
    const fake145 = { ...last, caseNumber: 145 };
    const p6 = flat.find(p => p.id === 'pack6');
    ok(p6 && p6.filterFn(fake145) && yeni && !yeni.filterFn(fake145), 'bilgi: numara 145-150 olsaydı "Yeni Vakalar"a değil Paket 6\'ya girerdi (bu yüzden 151\'den başlanıyor)');

    const b2 = sha(casesPath);
    r = node([path.join(TOOLS, 'ekle.js'), batch, '--kok', E], E);
    ok(r.status === 1 && /KOPYA/.test(r.out) && sha(casesPath) === b2, 'aynı dosyayı ikinci kez eklemek reddediliyor');
    const yedekler = fs.readdirSync(path.join(E, '_arsiv', 'vaka_ekle_yedek'));
    ok(yedekler.length === 1 && fs.existsSync(path.join(E, '_arsiv', 'vaka_ekle_yedek', yedekler[0], 'cases.js')), 'yedek _arsiv/vaka_ekle_yedek/<zaman>/cases.js altında');
}

console.log('\n[5] ekle.js derleme başarısız olursa geri yükler');
{
    const F = makeCopy('geri');
    const casesPath = path.join(F, 'js', 'cases.js');
    const before = sha(casesPath);
    const idx = path.join(F, 'index.html');
    fs.writeFileSync(idx, fs.readFileSync(idx, 'utf8').replace('<script src="js/explain.js"></script>', ''), 'utf8');
    const r = node([path.join(TOOLS, 'ekle.js'), writeJson(F, 'yeni.json', [clone(TEMPLATE)]), '--kok', F], F);
    ok(r.status === 1 && /GERİ YÜKLENDİ/.test(r.out) && sha(casesPath) === before, 'derleme hatasında js/cases.js eski hâline döndü', r.out.slice(-600));
}

console.log('\n[6] vaka_aciklamalari/dogrula.js eski davranışı korunuyor');
{
    const G = makeCopy('aciklama');
    const dir = path.join(G, 'tools', 'icerik', 'vaka_aciklamalari');
    let r = node([path.join(dir, 'dogrula.js')], G);
    ok(r.status === 0 && /138\/138/.test(r.out) && !/js\/cases\.js'ten/.test(r.out), 'mevcut veride çıktı aynı (138/138, hata 0)', r.out);
    const f = fs.readdirSync(dir).filter(x => /^aciklamalar_/.test(x)).sort()[0];
    const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const k = Object.keys(j)[0]; j[k].whyThis = [j[k].whyThis[0]];
    fs.writeFileSync(path.join(dir, f), JSON.stringify(j, null, 2), 'utf8');
    r = node([path.join(dir, 'dogrula.js')], G);
    ok(r.status === 1 && /whyThis 2-4/.test(r.out), 'toplu dosyadaki bozuk açıklama hâlâ hata');
}

// ---------------------------------------------------------------------------------------------
console.log('\n[7] yayinla.js çalışma tablosu denetimi');
{
    const H = makeCopy('tablo');
    const ai = path.join(H, 'AI_ISBIRLIGI.md');
    const md = fs.readFileSync(ai, 'utf8');
    fs.writeFileSync(ai, setTableRows(md, ['| Claude ajan W | hata düzeltme | js/app.js | 2026-11-20 |']), 'utf8');
    let r = node([path.join(TOOLS, 'yayinla.js'), '--mesaj', 'test', '--kuru', '--kok', H], H);
    ok(r.status === 1 && /başka bir asistanın satırı var/.test(r.out) && /Claude ajan W/.test(r.out), 'başka asistanın satırı varsa duruyor');
    fs.writeFileSync(ai, setTableRows(md, ['| Gemini | yeni vakalar | js/cases.js | 2026-11-20 |']), 'utf8');
    r = node([path.join(TOOLS, 'yayinla.js'), '--mesaj', 'test', '--kuru', '--kok', H], H);
    ok(!/başka bir asistanın satırı var/.test(r.out) && /Çalışma tablosu: başka asistan yok/.test(r.out), 'yalnızca Gemini satırı varsa devam ediyor');
}

if (WITH_GIT) {
    console.log('\n[8] yayinla.js --kuru (.git kopyasıyla; git\'e yazılmamalı)');
    const K = makeCopy('git', ['.git', '.github', 'GITHUBA_YUKLE.bat', 'manifest.json', '404.html', 'assets', 'paketler', 'supabase', 'tools', 'CLAUDE.md', 'GEMINI.md', 'PsikoVaka_Tam_Surum.html', '.gitignore']);
    const git = args => spawnSync('git', args, { cwd: K, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' } });
    const head0 = git(['rev-parse', 'HEAD']).stdout.trim();
    const idx0 = sha(path.join(K, '.git', 'index'));
    const refs0 = git(['for-each-ref']).stdout;
    const t0 = Date.now();
    const r = node([path.join('tools', 'vaka_ekle', 'yayinla.js'), '--mesaj', 'Yeni vakalar: test (kuru)', '--kuru'], K, { timeout: 600000 });
    const secs = Math.round((Date.now() - t0) / 1000);
    ok(r.status === 0 && /DENEME BAŞARILI/.test(r.out), `yayinla.js --kuru başarılı (${secs} sn)`, r.out.slice(-1500));
    ok(/\[deneme\] çalıştırılmadı: git add/.test(r.out) && /\[deneme\] çalıştırılmadı: git commit -m "Yeni vakalar: test \(kuru\)"/.test(r.out) && /\[deneme\] çalıştırılmadı: git push/.test(r.out), 'add/commit/push yalnızca yazdırıldı (mesaj iletildi)');
    ok(/Etkileşimsiz kip/.test(r.out), 'deploy etkileşimsiz kipte çalıştı');
    ok(git(['rev-parse', 'HEAD']).stdout.trim() === head0 && sha(path.join(K, '.git', 'index')) === idx0 && git(['for-each-ref']).stdout === refs0, 'HEAD, index ve ref\'ler değişmedi');
    console.log(r.out.split('\n').filter(l => /^\[|✓|✅|❌|deneme|ℹ️/.test(l)).map(l => '      | ' + l).join('\n'));

    // Giriş bilgisi gerektiren uzak depo: etkileşimsiz kipte soru sormadan, açık bir mesajla durmalı
    const cfg = path.join(K, '.git', 'config');
    fs.writeFileSync(cfg, fs.readFileSync(cfg, 'utf8').replace(/url = .*/, 'url = https://github.com/gandalfthegreey/psikovaka-olmayan-ozel-depo-test.git'), 'utf8');
    const t1 = Date.now();
    const r2 = node(['deploy_to_github.js', '--message=test', '--dry-run'], K, { timeout: 120000 });
    ok(r2.status === 1 && /GitHub girişi \/ yetkisi reddedildi ya da giriş bilgisi sorulması gerekti/.test(r2.out), `giriş gerekince soru sormadan duruyor (${Math.round((Date.now() - t1) / 1000)} sn)`, r2.out.slice(-800));
}

console.log(`\nSonuç: ${pass} geçti, ${fail} kaldı${fail ? ` → ${failures.join(' | ')}` : ''}`);
process.exit(fail ? 1 : 0);
