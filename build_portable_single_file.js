/**
 * PsikoVaka 2.0 - Tüm vakalara pharmacologyId Ekleme, Doğrulama & Tek Dosyalık Taşınabilir HTML Derleyicisi
 */
const fs = require('fs');
const path = require('path');

const { CLINICAL_CASES, COURSE_CATEGORIES } = require('./js/cases.js');
const { DIAGNOSES_DATABASE } = require('./js/diagnoses.js');
const { DSM5_MANUAL } = require('./js/dsm_manual.js');
const { THERAPIES_DATABASE } = require('./js/therapies.js');
const { PHARMACOLOGY_DATABASE, resolvePharmacologyIdForCase } = require('./js/pharmacology.js');

// 1. Stamp pharmacologyId onto all cases and validate
let errors = 0;
CLINICAL_CASES.forEach((c, idx) => {
    c.pharmacologyId = resolvePharmacologyIdForCase(c);
    if (!DIAGNOSES_DATABASE.some(d => d.id === c.diagnosisId)) {
        console.error('Missing diagnosisId:', c.id, c.diagnosisId);
        errors++;
    }
    if (!DSM5_MANUAL[c.diagnosisId]) {
        console.error('Missing DSM5_MANUAL entry:', c.id, c.diagnosisId);
        errors++;
    }
    if (!THERAPIES_DATABASE.some(t => t.id === c.therapyId)) {
        console.error('Missing therapyId:', c.id, c.therapyId);
        errors++;
    }
    if (!PHARMACOLOGY_DATABASE.some(p => p.id === c.pharmacologyId)) {
        console.error('Missing pharmacologyId:', c.id, c.pharmacologyId);
        errors++;
    }
    if (!Array.isArray(c.clues) || c.clues.length !== 6) {
        console.error('Invalid clues count:', c.id);
        errors++;
    }
});

// Başlıktaki tarihli notlar (" * 2026-11-15: ...") korunur; vaka sayısı her seferinde gerçek sayıdan yazılır.
const existingCasesSrc = fs.readFileSync(path.join(__dirname, 'js', 'cases.js'), 'utf8');
const headerNotes = (/^\/\*\*[\s\S]*?\*\//.exec(existingCasesSrc) || [''])[0]
    .split('\n').filter(l => /^ \* \d{4}-\d{2}-\d{2}:/.test(l)).join('\n');

const updatedCasesContent = `/**
 * PsikoVaka 2.0 - Zengin Klinik Vaka Veritabanı (${CLINICAL_CASES.length} DSM-5-TR Vakası)
 * Tanı, Psikoterapi, Psikofarmakoloji ve 3 Aşamalı Kombo Modu destekli.${headerNotes ? '\n' + headerNotes : ''}
 */

const COURSE_CATEGORIES = ${JSON.stringify(COURSE_CATEGORIES, null, 4)};

const CLINICAL_CASES = ${JSON.stringify(CLINICAL_CASES, null, 4)};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { COURSE_CATEGORIES, CLINICAL_CASES };
}
`;

// 2. Tek dosyalık taşınabilir HTML'i bellekte kur (doğrulama hatası varsa hiçbir dosya yazılmaz)
const htmlRaw = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
// CSS dosyaları index.html'deki sırayla satır içine alınır (tokens -> style -> arena -> online)
const CSS_FILES = ['tokens.css', 'style.css', 'arena.css', 'online.css', 'dosya.css'];
const cssRawByFile = Object.fromEntries(CSS_FILES.map(f => [f, fs.readFileSync(path.join(__dirname, 'css', f), 'utf8')]));
// index.html'deki yerel script sırası. Yeni bir js/ dosyası eklenirse buraya da eklenmeli.
// js/cases.js diskten değil, yukarıda pharmacologyId damgalanmış içerikten alınır.
const JS_FILES = ['diagnoses.js', 'dsm_manual.js', 'therapies.js', 'pharmacology.js', 'cases.js', 'avatar.js', 'leagues.js', 'explain.js', 'avatar_studio.js', 'supabase_config.js', 'isim_filtresi.js', 'account.js', 'app.js', 'online/core.js', 'online/api.js', 'online/realtime.js', 'online/views.js', 'online/friends.js', 'online/rooms.js', 'online/lobby.js', 'online/match.js', 'online/ligler.js', 'online/quick.js', 'online/daily.js', 'online/online.js', 'tasarim_dosya.js'];
const jsRawByFile = Object.fromEntries(JS_FILES.map(f => [f, f === 'cases.js' ? updatedCasesContent : fs.readFileSync(path.join(__dirname, 'js', f), 'utf8')]));

let bundled = htmlRaw;

CSS_FILES.forEach(f => {
    const tag = `<link rel="stylesheet" href="css/${f}">`;
    if (!bundled.includes(tag)) {
        console.error('UYARI: index.html içinde bulunamadı:', tag);
        errors++;
    }
    // Fonksiyonlu replace: CSS içindeki "$" karakterleri özel desen sayılmasın
    bundled = bundled.replace(tag, () => `<style>\n${cssRawByFile[f]}\n</style>`);
});

bundled = bundled.replace('<link rel="manifest" href="manifest.json">', '');
// Tek dosyada göreli ikon yolu çalışmaz (file://); bağlantı önizlemesi etiketleri mutlak adres olduğu için kalır
bundled = bundled.replace('<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">', '');

// Script etiketleri birebir eşleştirilir (dış CDN etiketleri — PeerJS, supabase-js — dışarıda kalır)
const scriptsTarget = JS_FILES.map(f => `    <script src="js/${f}"></script>`).join('\n');
const inlineScripts = JS_FILES.map(f => `<script>\n${jsRawByFile[f]}\n</script>`).join('\n');

if (!bundled.includes(scriptsTarget)) {
    console.error("UYARI: script etiketleri index.html içinde bulunamadı (JS_FILES listesi index.html ile aynı sırada olmalı)");
    errors++;
}
bundled = bundled.replace(scriptsTarget, () => inlineScripts);

if (/src="js\//.test(bundled) || /href="css\//.test(bundled)) {
    console.error('UYARI: tek dosyalık çıktıda hâlâ yerel dosya bağlantısı var (src="js/ veya href="css/).');
    errors++;
}

// Özet satırı: deploy_to_github.js bu satırdaki "Hata: N" değerini okur; biçimi değiştirmeyin.
console.log(`✅ ${CLINICAL_CASES.length} Vaka doğrulandı (Hata: ${errors}). Tanı: ${DIAGNOSES_DATABASE.length}, Terapi: ${THERAPIES_DATABASE.length}, Farmakoterapi: ${PHARMACOLOGY_DATABASE.length}`);

if (errors > 0) {
    console.error(`❌ ${errors} hata var: js/cases.js ve PsikoVaka_Tam_Surum.html YAZILMADI.`);
    process.exit(1);
}

// 3. Dosyaları yaz
fs.writeFileSync(path.join(__dirname, 'js', 'cases.js'), updatedCasesContent, 'utf8');
const outPath = path.join(__dirname, 'PsikoVaka_Tam_Surum.html');
fs.writeFileSync(outPath, bundled, 'utf8');
console.log('✅ Taşınabilir tek dosyalık sürüm oluşturuldu:', outPath, 'Boyut:', Math.round(fs.statSync(outPath).size / 1024), 'KB');
