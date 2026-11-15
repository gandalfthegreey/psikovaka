#!/usr/bin/env node
/**
 * Vaka açıklamalarını doğrular (ajan O).
 * Kullanım: node tools/icerik/vaka_aciklamalari/dogrula.js [--kismi]
 *   --kismi : eksik kapsama hata sayılmaz (yalnızca uyarı); ara partiler için.
 * Çıkış kodu: hata varsa 1.
 * Modül olarak: require('./dogrula.js').dogrula({ cases, diagnoses, partial }) -> { errors, warnings, explanations, covered }
 */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const ROOT = path.join(DIR, '..', '..', '..');

function dogrula({ cases, diagnoses, partial = false, dir = DIR }) {
const CLINICAL_CASES = cases;
const DIAGNOSES_DATABASE = diagnoses;
const dxIds = new Set(DIAGNOSES_DATABASE.map(d => d.id));
const caseById = new Map(CLINICAL_CASES.map(c => [c.id, c]));

const errors = [];
const warnings = [];
const err = (id, msg) => errors.push(`${id}: ${msg}`);

const files = fs.readdirSync(dir).filter(f => /^aciklamalar_\d{3}_\d{3}\.json$/.test(f)).sort();
const seen = new Map(); // caseId -> file
const explanations = {};

const isNonEmptyStr = s => typeof s === 'string' && s.trim().length > 0;
const words = s => s.trim().split(/\s+/).filter(Boolean).length;

for (const f of files) {
    let data;
    try {
        data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    } catch (e) {
        errors.push(`${f}: geçersiz JSON (${e.message})`);
        continue;
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        errors.push(`${f}: kök nesne olmalı`);
        continue;
    }
    for (const [id, ex] of Object.entries(data)) {
        if (seen.has(id)) err(id, `birden fazla dosyada (${seen.get(id)}, ${f})`);
        seen.set(id, f);
        explanations[id] = ex;
        const c = caseById.get(id);
        if (!c) { err(id, `aktif vaka listesinde yok (${f})`); continue; }
        if (!ex || typeof ex !== 'object' || Array.isArray(ex)) { err(id, 'açıklama nesne değil'); continue; }

        const keys = Object.keys(ex).sort().join(',');
        if (keys !== 'teachingPoint,whyNot,whyThis') err(id, `anahtarlar tam olarak whyThis/whyNot/teachingPoint olmalı (bulunan: ${keys})`);

        const all = [];
        if (!Array.isArray(ex.whyThis) || ex.whyThis.length < 2 || ex.whyThis.length > 4) err(id, 'whyThis 2-4 maddelik dizi olmalı');
        else ex.whyThis.forEach((s, i) => { if (!isNonEmptyStr(s)) err(id, `whyThis[${i}] boş/metin değil`); else all.push(s); });

        if (!Array.isArray(ex.whyNot) || ex.whyNot.length < 2 || ex.whyNot.length > 3) err(id, 'whyNot 2-3 maddelik dizi olmalı');
        else {
            const used = new Set();
            ex.whyNot.forEach((w, i) => {
                if (!w || typeof w !== 'object' || Array.isArray(w)) { err(id, `whyNot[${i}] nesne değil`); return; }
                const k = Object.keys(w).sort().join(',');
                if (k !== 'diagnosisId,reason') err(id, `whyNot[${i}] anahtarları diagnosisId/reason olmalı (bulunan: ${k})`);
                if (!dxIds.has(w.diagnosisId)) err(id, `whyNot[${i}].diagnosisId DIAGNOSES_DATABASE'de yok: ${w.diagnosisId}`);
                if (w.diagnosisId === c.diagnosisId) err(id, `whyNot[${i}] vakanın kendi cevabı (${w.diagnosisId})`);
                if (used.has(w.diagnosisId)) err(id, `whyNot içinde tekrar: ${w.diagnosisId}`);
                used.add(w.diagnosisId);
                if (!isNonEmptyStr(w.reason)) err(id, `whyNot[${i}].reason boş`); else all.push(w.reason);
            });
        }
        if (!isNonEmptyStr(ex.teachingPoint)) err(id, 'teachingPoint boş'); else all.push(ex.teachingPoint);

        const n = words(all.join(' '));
        if (n < 40 || n > 200) err(id, `kelime sayısı aralık dışı: ${n} (40-200)`);
        else if (n > 160) warnings.push(`${id}: ${n} kelime (uzun)`);
    }
}

const missing = CLINICAL_CASES.filter(c => !seen.has(c.id)).map(c => c.id);
if (missing.length) {
    const msg = `kapsanmayan vakalar (${missing.length}): ${missing.join(' ')}`;
    if (partial) warnings.push(msg); else errors.push(msg);
}

return { errors, warnings, explanations, files, covered: CLINICAL_CASES.length - missing.length, total: CLINICAL_CASES.length };
}

module.exports = { dogrula };

if (require.main === module) {
    const partial = process.argv.includes('--kismi');
    const { CLINICAL_CASES } = require(path.join(ROOT, 'js', 'cases.js'));
    const { DIAGNOSES_DATABASE } = require(path.join(ROOT, 'js', 'diagnoses.js'));
    const r = dogrula({ cases: CLINICAL_CASES, diagnoses: DIAGNOSES_DATABASE, partial });
    r.warnings.forEach(w => console.warn('UYARI:', w));
    r.errors.forEach(e => console.error('HATA:', e));
    console.log(`Dosyalar: ${r.files.length} | Kapsama: ${r.covered}/${r.total} | Hata: ${r.errors.length} | Uyarı: ${r.warnings.length}`);
    process.exit(r.errors.length ? 1 : 0);
}
