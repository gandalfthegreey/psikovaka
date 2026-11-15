#!/usr/bin/env node
// Tanı listesi / rehber / vaka verisinin tutarlılığını doğrular (Claude ajan J, 2026-11-15).
// Kullanım: node tools/icerik/tani_temizligi/dogrula.js   — hata yoksa çıkış 0, varsa 1.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const J = (...p) => path.join(ROOT, ...p);
const errors = [];
const warns = [];
const err = (m) => errors.push(m);

for (const f of ['diagnoses.js', 'dsm_manual.js', 'cases.js', 'therapies.js', 'pharmacology.js']) {
  try { execFileSync(process.execPath, ['--check', J('js', f)], { stdio: 'pipe' }); } catch (e) { err(`node --check başarısız: js/${f}`); }
}
const { DSM_CATEGORIES: CAT, DIAGNOSES_DATABASE: D } = require(J('js', 'diagnoses.js'));
const { DSM5_MANUAL: M } = require(J('js', 'dsm_manual.js'));
const { COURSE_CATEGORIES: COURSES, CLINICAL_CASES: C } = require(J('js', 'cases.js'));
const { THERAPIES_DATABASE: T } = require(J('js', 'therapies.js'));
const { PHARMACOLOGY_DATABASE: P, resolvePharmacologyIdForCase } = require(J('js', 'pharmacology.js'));
if (!CAT || !Array.isArray(D) || !M || !COURSES || !Array.isArray(C)) err('Beklenen dışa aktarımlar eksik');

const norm = (s) => String(s).toLocaleLowerCase('tr').normalize('NFC').replace(/\s+/g, ' ').trim();
// Tanılar
const ids = new Map();
const namesTr = new Map();
const namesEn = new Map();
for (const d of D) {
  if (ids.has(d.id)) err(`Yinelenen tanı id: ${d.id}`); ids.set(d.id, d);
  for (const k of ['id', 'nameTr', 'nameEn', 'category']) if (!d[k] || typeof d[k] !== 'string') err(`Tanı ${d.id}: ${k} eksik`);
  if (!Array.isArray(d.aliases)) err(`Tanı ${d.id}: aliases dizi değil`);
  const nt = norm(d.nameTr); if (namesTr.has(nt)) err(`Yinelenen nameTr: ${d.nameTr} (${namesTr.get(nt)}, ${d.id})`); namesTr.set(nt, d.id);
  const ne = norm(d.nameEn); if (namesEn.has(ne)) err(`Yinelenen nameEn: ${d.nameEn} (${namesEn.get(ne)}, ${d.id})`); namesEn.set(ne, d.id);
  if (!CAT[d.category]) err(`Tanı ${d.id}: kategori yok ${d.category}`);
}
// Takma ad çakışmaları (uyarı): bir takma ad başka bir tanının adı ya da takma adıyla aynıysa
const aliasOwner = new Map();
for (const d of D) for (const a of d.aliases || []) {
  const k = norm(a);
  if (namesTr.has(k) && namesTr.get(k) !== d.id) warns.push(`Takma ad "${a}" (${d.id}) başka tanının adıyla aynı (${namesTr.get(k)})`);
  if (aliasOwner.has(k) && aliasOwner.get(k) !== d.id) warns.push(`Takma ad "${a}" iki tanıda: ${aliasOwner.get(k)}, ${d.id}`);
  aliasOwner.set(k, d.id);
}
// Kategoriler
for (const c of Object.keys(CAT)) if (!D.some((d) => d.category === c)) err(`Boş kategori: ${c}`);
// Rehber ↔ tanı birebir
for (const d of D) if (!M[d.id]) err(`Rehber girdisi yok: ${d.id}`);
for (const [id, e] of Object.entries(M)) {
  if (!ids.has(id)) err(`Rehberde listede olmayan id: ${id}`);
  if (e.id !== id) err(`Rehber ${id}: iç id farklı (${e.id})`);
  const keys = Object.keys(e).join(',');
  if (keys !== 'id,nameTr,nameEn,clinicalDescription,criteriaList') err(`Rehber ${id}: anahtar kümesi farklı (${keys})`);
  const cd = e.clinicalDescription || {};
  for (const k of ['overview', 'epidemiology', 'etiology', 'prognosis']) if (!cd[k] || typeof cd[k] !== 'string') err(`Rehber ${id}: clinicalDescription.${k} boş`);
  if (!Array.isArray(e.criteriaList) || !e.criteriaList.length) err(`Rehber ${id}: criteriaList boş`);
  else for (const cr of e.criteriaList) { if (!cr.code || !cr.title || !cr.content) err(`Rehber ${id}: kriter alanı eksik`); if (cr.items && (!Array.isArray(cr.items) || !cr.items.length)) err(`Rehber ${id}: items boş`); }
}
// Vakalar
const therapyIds = new Set(T.map((t) => t.id));
const pharmaIds = new Set(P.map((p) => p.id));
const caseIds = new Set();
const caseNums = new Set();
for (const c of C) {
  if (caseIds.has(c.id)) err(`Yinelenen vaka id: ${c.id}`); caseIds.add(c.id);
  if (caseNums.has(c.caseNumber)) err(`Yinelenen caseNumber: ${c.caseNumber}`); caseNums.add(c.caseNumber);
  const d = ids.get(c.diagnosisId);
  if (!d) err(`Vaka ${c.id}: diagnosisId listede yok (${c.diagnosisId})`);
  else if (c.category !== d.category) err(`Vaka ${c.id}: category (${c.category}) tanı kategorisinden (${d.category}) farklı`);
  if (c.secondaryDiagnosisId && !ids.has(c.secondaryDiagnosisId)) err(`Vaka ${c.id}: secondaryDiagnosisId listede yok`);
  if (!Array.isArray(c.clues) || c.clues.length !== 6 || c.clues.some((x) => !x || typeof x !== 'string')) err(`Vaka ${c.id}: 6 dolu ipucu yok`);
  if (!therapyIds.has(c.therapyId)) err(`Vaka ${c.id}: therapyId geçersiz (${c.therapyId})`);
  if (!pharmaIds.has(c.pharmacologyId)) err(`Vaka ${c.id}: pharmacologyId geçersiz (${c.pharmacologyId})`);
  const r = resolvePharmacologyIdForCase(c); if (!pharmaIds.has(r)) err(`Vaka ${c.id}: resolvePharmacologyIdForCase geçersiz döndü (${r})`);
  if (!COURSES[c.course]) err(`Vaka ${c.id}: course geçersiz (${c.course})`);
  for (const k of ['patientSummary', 'differentialDiagnosis', 'dsmCriteriaSummary']) if (!c[k]) err(`Vaka ${c.id}: ${k} boş`);
  for (const h of c.symptomHighlights || []) if (!(h.clueIndex >= 0 && h.clueIndex < 6) || !c.clues[h.clueIndex].includes(h.text)) err(`Vaka ${c.id}: symptomHighlights metni ipucunda yok ("${h.text}")`);
  const q = c.miniQuiz; if (!q || !Array.isArray(q.options) || !(q.correctIndex >= 0 && q.correctIndex < q.options.length)) err(`Vaka ${c.id}: miniQuiz geçersiz`);
}
// Arşivler
const arsiv = JSON.parse(fs.readFileSync(path.join(__dirname, 'arsivlenen_vakalar.json'), 'utf8')).vakalar;
for (const a of arsiv) { if (caseIds.has(a.vaka.id)) err(`Arşivlenen vaka hâlâ aktif: ${a.vaka.id}`); if (caseNums.has(a.vaka.caseNumber)) err(`Arşivlenen vakanın numarası aktif listede: ${a.vaka.caseNumber}`); }
const disi = JSON.parse(fs.readFileSync(path.join(__dirname, 'liste_disi_kavramlar.json'), 'utf8'));
for (const id of Object.keys(disi)) { if (ids.has(id)) err(`Liste dışı kavram listede: ${id}`); if (M[id]) err(`Liste dışı kavram rehberde: ${id}`); if (!disi[id].neden) err(`Liste dışı ${id}: neden yok`); }
// Önceki 150 vaka: aktif + arşiv = hepsi
const yedek = J('_arsiv', '2026-11-15-tani-temizligi-oncesi', 'cases.js');
if (fs.existsSync(yedek)) {
  const eski = require(yedek).CLINICAL_CASES.map((c) => c.id);
  const simdi = new Set([...caseIds, ...arsiv.map((a) => a.vaka.id)]);
  for (const id of eski) if (!simdi.has(id)) err(`Vaka kayboldu: ${id}`);
}

// 2. tur (ajan R, 2026-11-15): belirleyici/alt tip girdileri listeye geri dönmemeli; harita ve vaka başlıkları
const altTip = path.join(__dirname, 'alt_tip_veri.js');
if (fs.existsSync(altTip)) {
  const { KALDIR, YENI } = require(altTip);
  for (const id of Object.keys(KALDIR)) { if (ids.has(id)) err(`Belirleyici/alt tip girdisi listede: ${id} (üst tanı: ${KALDIR[id][0]})`); if (!disi[id]) err(`Kaldırılan alt tip liste dışı kavramlarda yok: ${id}`); }
  for (const id of Object.keys(YENI)) if (!ids.has(id)) err(`Üst tanı listede yok: ${id}`);
}
for (const [id, v] of Object.entries(disi)) if (v.karsilayanResmiTani && !ids.has(v.karsilayanResmiTani)) err(`Liste dışı ${id}: karşılayan tanı listede yok (${v.karsilayanResmiTani})`);
{ const { DIAGNOSIS_TO_PHARMACOLOGY_MAP: MAP } = require(J('js', 'pharmacology.js'));
  for (const k of Object.keys(MAP)) { if (!ids.has(k)) err(`Farmakoloji haritasında listede olmayan id: ${k}`); else if (!pharmaIds.has(MAP[k])) err(`Farmakoloji haritası ${k}: protokol yok (${MAP[k]})`); }
  for (const d of D) if (!MAP[d.id]) err(`Farmakoloji haritasında yok: ${d.id}`); }
// goldForDiagnoses (terapi + ilaç protokolleri) yalnızca listedeki tanılara işaret etmeli (ajan P; eşleme: gold_remap.js)
for (const x of T.concat(P)) for (const g of (x.goldForDiagnoses || [])) if (!ids.has(g)) err(`goldForDiagnoses ${x.id}: listede olmayan tanı ${g} (node tools/icerik/tani_temizligi/gold_remap.js)`);
// Oyun bitmeden görünen başlık (patientSummary) tanı/kategori etiketi taşımamalı: sondaki parantez yalnızca BKİ ya da "Çift tanılı vaka" olabilir
for (const c of C) { const m = /\(([^()]*)\)\s*$/.exec(c.patientSummary || ''); if (m && !/^BKİ/.test(m[1]) && m[1] !== 'Çift tanılı vaka') warns.push(`Vaka ${c.id}: başlıkta etiket olabilir: "${m[1]}"`);
  for (let i = 0; i < 2; i++) if (/\((?:\d\.\s*)?(?:Eşlik Eden\s*)?Tanı[\s)-]/.test(c.clues[i])) warns.push(`Vaka ${c.id}: ipucu ${i + 1} tanı etiketi içeriyor`); }

console.log(`Tanı: ${D.length} | Kategori: ${Object.keys(CAT).length} | Rehber girdisi: ${Object.keys(M).length} | Aktif vaka: ${C.length} | Arşivlenen vaka: ${arsiv.length} | Liste dışı kavram: ${Object.keys(disi).length}`);
if (warns.length) console.log(`Uyarı (${warns.length}):\n  - ` + warns.join('\n  - '));
if (errors.length) { console.error(`HATA (${errors.length}):\n  - ` + errors.join('\n  - ')); process.exit(1); }
console.log('Doğrulama: hata yok.');
