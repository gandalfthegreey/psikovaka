#!/usr/bin/env node
/**
 * Vaka sonrası açıklamaları (explanation) js/cases.js içindeki her vakaya ekler (ajan O).
 *
 * Kullanım (proje kökünden):
 *   node tools/icerik/vaka_aciklamalari/birlestir.js                 # js/cases.js'e uygular
 *   node tools/icerik/vaka_aciklamalari/birlestir.js --kuru          # yazmadan özet verir
 *   node tools/icerik/vaka_aciklamalari/birlestir.js --hedef <dir>   # <dir>/js/cases.js ve <dir>/js/diagnoses.js (test için)
 *
 * Davranış:
 *  - Önce dogrula.js mantığıyla tüm açıklama dosyalarını doğrular (tam kapsama şart); hata varsa hiçbir şey yazmaz.
 *  - Her vakaya `explanation` alanını atar; alan zaten varsa DEĞİŞTİRİR (idempotent, tekrar çalıştırmak çoğaltmaz).
 *  - Çıktıyı build_portable_single_file.js ile aynı biçimde üretir (aynı başlık yorumu korunur, JSON.stringify 4 boşluk,
 *    aynı module.exports bloğu). Böylece sonraki `node build_portable_single_file.js` alanı korur.
 *  - Atomik yazım: geçici dosyaya yazar -> require ile yükler -> sayıları ve explanation dışındaki tüm alanların
 *    değişmediğini doğrular -> mv (rename). Doğrulama başarısızsa gerçek dosyaya dokunulmaz.
 */
const fs = require('fs');
const path = require('path');
const { dogrula } = require('./dogrula.js');

const args = process.argv.slice(2);
const dry = args.includes('--kuru');
const hedefIdx = args.indexOf('--hedef');
const ROOT = hedefIdx >= 0 ? path.resolve(args[hedefIdx + 1]) : path.join(__dirname, '..', '..', '..');
const CASES_PATH = path.join(ROOT, 'js', 'cases.js');
const DIAG_PATH = path.join(ROOT, 'js', 'diagnoses.js');

function fail(msg) {
    console.error('❌ ' + msg);
    console.error('js/cases.js DEĞİŞTİRİLMEDİ.');
    process.exit(1);
}

function freshRequire(p) {
    delete require.cache[require.resolve(p)];
    return require(p);
}

const stripExplanation = c => { const { explanation, ...rest } = c; return rest; };

// 1. Kaynak dosyayı yükle
const src = fs.readFileSync(CASES_PATH, 'utf8');
const original = freshRequire(CASES_PATH);
const { CLINICAL_CASES, COURSE_CATEGORIES } = original;
if (!Array.isArray(CLINICAL_CASES) || !COURSE_CATEGORIES) fail('cases.js beklenen dışa aktarımları içermiyor.');
const { DIAGNOSES_DATABASE } = freshRequire(DIAG_PATH);

// 2. Açıklamaları doğrula
const r = dogrula({ cases: CLINICAL_CASES, diagnoses: DIAGNOSES_DATABASE, partial: false });
r.warnings.forEach(w => console.warn('UYARI:', w));
if (r.errors.length) {
    r.errors.forEach(e => console.error('HATA:', e));
    fail(`Açıklama doğrulaması başarısız (${r.errors.length} hata).`);
}

// 3. Birleştir (derin kopya üzerinde)
const merged = JSON.parse(JSON.stringify(CLINICAL_CASES));
let replaced = 0, added = 0;
merged.forEach(c => {
    if (Object.prototype.hasOwnProperty.call(c, 'explanation')) replaced++; else added++;
    c.explanation = JSON.parse(JSON.stringify(r.explanations[c.id]));
});

// 4. Build betiğiyle aynı biçimde yaz; mevcut başlık yorumu aynen korunur
const headerMatch = /^\/\*\*[\s\S]*?\*\//.exec(src);
if (!headerMatch) fail('cases.js başında /** ... */ başlık yorumu bulunamadı.');
const header = headerMatch[0];

const out = `${header}

const COURSE_CATEGORIES = ${JSON.stringify(COURSE_CATEGORIES, null, 4)};

const CLINICAL_CASES = ${JSON.stringify(merged, null, 4)};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { COURSE_CATEGORIES, CLINICAL_CASES };
}
`;

if (dry) {
    console.log(`(kuru) ${merged.length} vaka | yeni: ${added} | değiştirilecek: ${replaced} | boyut: ${src.length} -> ${out.length} karakter`);
    process.exit(0);
}

// 5. Geçici dosyaya yaz ve doğrula
const tmp = path.join(path.dirname(CASES_PATH), `.cases.birlestir.${process.pid}.tmp.js`);
fs.writeFileSync(tmp, out, 'utf8');
try {
    const check = freshRequire(tmp);
    if (check.CLINICAL_CASES.length !== CLINICAL_CASES.length) throw new Error('vaka sayısı değişti');
    if (JSON.stringify(check.COURSE_CATEGORIES) !== JSON.stringify(COURSE_CATEGORIES)) throw new Error('COURSE_CATEGORIES değişti');
    check.CLINICAL_CASES.forEach((c, i) => {
        const o = CLINICAL_CASES[i];
        if (c.id !== o.id) throw new Error(`sıra değişti: ${i}`);
        if (JSON.stringify(stripExplanation(c)) !== JSON.stringify(stripExplanation(o))) throw new Error(`explanation dışı alan değişti: ${c.id}`);
        if (JSON.stringify(c.explanation) !== JSON.stringify(r.explanations[c.id])) throw new Error(`explanation hatalı: ${c.id}`);
    });
    // Dosya aynı anda başka biri tarafından değiştirildiyse üzerine yazma
    if (fs.readFileSync(CASES_PATH, 'utf8') !== src) throw new Error('cases.js birleştirme sırasında başka bir işlem tarafından değiştirildi; yeniden çalıştırın');
} catch (e) {
    try { fs.renameSync(tmp, tmp + '.hatali'); } catch (_) { /* yoksay */ }
    fail('Geçici çıktı doğrulanamadı: ' + e.message + ` (geçici dosya: ${tmp}.hatali)`);
}
fs.renameSync(tmp, CASES_PATH);
console.log(`✅ ${merged.length} vakaya explanation yazıldı (yeni: ${added}, değiştirilen: ${replaced}). Dosya: ${CASES_PATH}`);
