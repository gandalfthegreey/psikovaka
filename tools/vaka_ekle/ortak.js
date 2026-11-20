'use strict';
/**
 * tools/vaka_ekle ortak yardımcıları (Claude ajan Y, 2026-11-20).
 * Veri yükleme, Türkçe duyarlı metin normalleştirme, benzerlik, js/cases.js'i derleyiciyle aynı biçimde yazma.
 * Yalnızca Node yerleşik modülleri; Windows ve Linux'ta aynı çalışır.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DEFAULT_ROOT = path.resolve(__dirname, '..', '..');

/** Bir projenin kök klasörünü seçer: --kok <dizin> verilmişse o (testler için), yoksa bu deponun kökü. */
function rootFromArgs(argv) {
    const i = argv.indexOf('--kok');
    if (i >= 0 && argv[i + 1]) return path.resolve(argv[i + 1]);
    return DEFAULT_ROOT;
}

function freshRequire(p) {
    const r = require.resolve(p);
    delete require.cache[r];
    return require(r);
}

/** Canlı veriyi diskteki dosyalardan yükler (önbelleksiz). */
function loadData(root = DEFAULT_ROOT) {
    const J = (...p) => path.join(root, ...p);
    const { CLINICAL_CASES, COURSE_CATEGORIES } = freshRequire(J('js', 'cases.js'));
    const { DIAGNOSES_DATABASE, DSM_CATEGORIES } = freshRequire(J('js', 'diagnoses.js'));
    const { DSM5_MANUAL } = freshRequire(J('js', 'dsm_manual.js'));
    const { THERAPIES_DATABASE, THERAPY_FAMILIES } = freshRequire(J('js', 'therapies.js'));
    const { PHARMACOLOGY_DATABASE, DIAGNOSIS_TO_PHARMACOLOGY_MAP, resolvePharmacologyIdForCase } = freshRequire(J('js', 'pharmacology.js'));
    let archived = [];
    const arsivPath = J('tools', 'icerik', 'tani_temizligi', 'arsivlenen_vakalar.json');
    if (fs.existsSync(arsivPath)) {
        try { archived = (JSON.parse(fs.readFileSync(arsivPath, 'utf8')).vakalar || []).map(a => a.vaka).filter(Boolean); } catch (e) { archived = []; }
    }
    return {
        root, cases: CLINICAL_CASES, courses: COURSE_CATEGORIES, diagnoses: DIAGNOSES_DATABASE, dsmCategories: DSM_CATEGORIES,
        manual: DSM5_MANUAL, therapies: THERAPIES_DATABASE, therapyFamilies: THERAPY_FAMILIES || {},
        pharma: PHARMACOLOGY_DATABASE, pharmaMap: DIAGNOSIS_TO_PHARMACOLOGY_MAP || {}, resolvePharma: resolvePharmacologyIdForCase,
        archived
    };
}

// ---------------------------------------------------------------- metin
const FOLD = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'â': 'a', 'î': 'i', 'û': 'u' };
/** Türkçe duyarlı küçük harf (İ→i, I→ı), aksan/şapka katlama, harf-rakam dışı her şey boşluk. */
function norm(s) {
    return String(s == null ? '' : s)
        .toLocaleLowerCase('tr')
        .replace(/[çğıöşüâîû]/g, ch => FOLD[ch])
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}
const words = s => norm(s).split(' ').filter(Boolean);
const wordCount = s => String(s).trim().split(/\s+/).filter(Boolean).length;

/** Kelime 3-gramları kümesi (benzerlik için). */
function trigrams(text) {
    const w = words(text);
    const out = new Set();
    for (let i = 0; i + 2 < w.length; i++) out.add(w[i] + ' ' + w[i + 1] + ' ' + w[i + 2]);
    return out;
}
function jaccard(a, b) {
    if (!a.size || !b.size) return 0;
    let inter = 0;
    const [small, big] = a.size <= b.size ? [a, b] : [b, a];
    for (const x of small) if (big.has(x)) inter++;
    return inter / (a.size + b.size - inter);
}
const caseText = c => [c.patientSummary || '', ...(Array.isArray(c.clues) ? c.clues : [])].join(' ');

/** İçerik özeti: başlık + ipuçlarının normalleştirilmiş hâli. Aynı vakanın tekrar eklenmesini yakalar. */
function contentHash(c) {
    return crypto.createHash('sha256').update(norm(caseText(c))).digest('hex').slice(0, 16);
}

/**
 * Terim metinde geçiyor mu? Terim bir kelime başında başlamalı. 6+ harfli terimlerde Türkçe ek serbest
 * ("kekemelik" → "kekemeliği"); daha kısa terimlerde kelime sonunda da bitmeli ("mani" → "manikür" sayılmaz).
 */
function containsTerm(normText, normTerm) {
    if (!normTerm) return false;
    // Türkçe ünsüz yumuşaması: "bozukluk" → "bozukluğu", "kitap" → "kitabı", "dert" → "derdi"
    const soft = { k: 'g', p: 'b', t: 'd' }[normTerm.slice(-1)];
    if (soft && normTerm.length >= 6 && containsTerm(normText, normTerm.slice(0, -1) + soft)) return true;
    const t = ' ' + normText + ' ';
    let from = 0;
    for (;;) {
        const i = t.indexOf(' ' + normTerm, from);
        if (i < 0) return false;
        const after = t[i + 1 + normTerm.length];
        if (normTerm.length >= 6 || after === ' ') return true;
        from = i + 1;
    }
}

// ---------------------------------------------------------------- numaralar
const pad3 = n => String(n).padStart(3, '0');
const caseIdFor = n => `case-${pad3(n)}`;
/** Sıradaki boş numara: aktif VE arşivlenmiş vakaların en büyüğünden sonra (arşiv numaraları yeniden kullanılmaz). */
function nextCaseNumber(data) {
    const nums = [...data.cases, ...data.archived].map(c => Number(c.caseNumber)).filter(Number.isFinite);
    return (nums.length ? Math.max(...nums) : 0) + 1;
}

// ---------------------------------------------------------------- yazım
/** Yeni vakadaki alanların yazılış sırası (mevcut vakaların çoğunluğuyla aynı). */
const FIELD_ORDER = ['id', 'caseNumber', 'difficulty', 'course', 'diagnosisId', 'category', 'patientSummary', 'clues',
    'symptomHighlights', 'treatmentModality', 'miniQuiz', 'differentialDiagnosis', 'dsmCriteriaSummary', 'therapyId',
    'pharmacologyId', 'explanation'];
function orderFields(c) {
    const o = {};
    for (const k of FIELD_ORDER) if (Object.prototype.hasOwnProperty.call(c, k)) o[k] = c[k];
    for (const k of Object.keys(c)) if (!(k in o)) o[k] = c[k];
    return o;
}

/** js/cases.js içeriğini build_portable_single_file.js ile birebir aynı biçimde üretir. */
function renderCasesJs(existingSrc, courses, cases) {
    const headerNotes = (/^\/\*\*[\s\S]*?\*\//.exec(existingSrc) || [''])[0]
        .split('\n').filter(l => /^ \* \d{4}-\d{2}-\d{2}:/.test(l)).join('\n');
    return `/**
 * PsikoVaka 2.0 - Zengin Klinik Vaka Veritabanı (${cases.length} DSM-5-TR Vakası)
 * Tanı, Psikoterapi, Psikofarmakoloji ve 3 Aşamalı Kombo Modu destekli.${headerNotes ? '\n' + headerNotes : ''}
 */

const COURSE_CATEGORIES = ${JSON.stringify(courses, null, 4)};

const CLINICAL_CASES = ${JSON.stringify(cases, null, 4)};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { COURSE_CATEGORIES, CLINICAL_CASES };
}
`;
}

function timestamp() {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

module.exports = {
    DEFAULT_ROOT, rootFromArgs, freshRequire, loadData, norm, words, wordCount, trigrams, jaccard, caseText, contentHash,
    containsTerm, pad3, caseIdFor, nextCaseNumber, FIELD_ORDER, orderFields, renderCasesJs, timestamp
};
