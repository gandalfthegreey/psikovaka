/**
 * PsikoVaka 2.0 - Tüm 150 Vakaya pharmacologyId Ekleme, Doğrulama & Tek Dosyalık Taşınabilir HTML Derleyicisi
 */
const fs = require('fs');
const path = require('path');

const { CLINICAL_CASES, COURSE_CATEGORIES } = require('./js/cases.js');
const { DIAGNOSES_DATABASE } = require('./js/diagnoses.js');
const { DSM5_MANUAL } = require('./js/dsm_manual.js');
const { THERAPIES_DATABASE } = require('./js/therapies.js');
const { PHARMACOLOGY_DATABASE, resolvePharmacologyIdForCase } = require('./js/pharmacology.js');

// 1. Stamp pharmacologyId onto all 150 cases and validate
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

const updatedCasesContent = `/**
 * PsikoVaka 2.0 - Zengin Klinik Vaka Veritabanı (150 DSM-5-TR Vakası)
 * Tanı, Psikoterapi, Psikofarmakoloji ve 3 Aşamalı Kombo Modu destekli.
 */

const COURSE_CATEGORIES = ${JSON.stringify(COURSE_CATEGORIES, null, 4)};

const CLINICAL_CASES = ${JSON.stringify(CLINICAL_CASES, null, 4)};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { COURSE_CATEGORIES, CLINICAL_CASES };
}
`;

fs.writeFileSync(path.join(__dirname, 'js', 'cases.js'), updatedCasesContent, 'utf8');
console.log(`✅ 150 Vaka doğrulandı (Hata: ${errors}). Tanı: ${DIAGNOSES_DATABASE.length}, Terapi: ${THERAPIES_DATABASE.length}, Farmakoterapi: ${PHARMACOLOGY_DATABASE.length}`);

// 2. Build Portable Single-File HTML
const htmlRaw = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const cssRaw = fs.readFileSync(path.join(__dirname, 'css', 'style.css'), 'utf8');
const diagnosesRaw = fs.readFileSync(path.join(__dirname, 'js', 'diagnoses.js'), 'utf8');
const manualRaw = fs.readFileSync(path.join(__dirname, 'js', 'dsm_manual.js'), 'utf8');
const therapiesRaw = fs.readFileSync(path.join(__dirname, 'js', 'therapies.js'), 'utf8');
const pharmaRaw = fs.readFileSync(path.join(__dirname, 'js', 'pharmacology.js'), 'utf8');
const casesRaw = fs.readFileSync(path.join(__dirname, 'js', 'cases.js'), 'utf8');
const arenaRaw = fs.readFileSync(path.join(__dirname, 'js', 'online_arena.js'), 'utf8');
const appRaw = fs.readFileSync(path.join(__dirname, 'js', 'app.js'), 'utf8');

let bundled = htmlRaw;

bundled = bundled.replace(
    '<link rel="stylesheet" href="css/style.css">',
    `<style>\n${cssRaw}\n</style>`
);

bundled = bundled.replace('<link rel="manifest" href="manifest.json">', '');

const scriptsTarget = `    <script src="js/diagnoses.js"></script>
    <script src="js/dsm_manual.js"></script>
    <script src="js/therapies.js"></script>
    <script src="js/pharmacology.js"></script>
    <script src="js/cases.js"></script>
    <script src="js/online_arena.js"></script>
    <script src="js/app.js"></script>`;

const inlineScripts = `<script>\n${diagnosesRaw}\n</script>
<script>\n${manualRaw}\n</script>
<script>\n${therapiesRaw}\n</script>
<script>\n${pharmaRaw}\n</script>
<script>\n${casesRaw}\n</script>
<script>\n${arenaRaw}\n</script>
<script>\n${appRaw}\n</script>`;

bundled = bundled.replace(scriptsTarget, inlineScripts);

const outPath = path.join(__dirname, 'PsikoVaka_Tam_Surum.html');
fs.writeFileSync(outPath, bundled, 'utf8');
console.log('✅ Taşınabilir tek dosyalık sürüm oluşturuldu:', outPath, 'Boyut:', Math.round(fs.statSync(outPath).size / 1024), 'KB');
