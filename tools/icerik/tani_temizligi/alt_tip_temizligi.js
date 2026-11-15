#!/usr/bin/env node
// Alt tip / belirleyici temizliği, 2. tur (Claude ajan R, 2026-11-15).
// Kullanım (proje kökünden): node tools/icerik/tani_temizligi/alt_tip_temizligi.js [--kuru]
// Girdi: güncel js/*.js ve açıklama dosyaları (yedekten DEĞİL). Kararlar: alt_tip_veri.js, alt_tip_aciklama_duzeltmeleri.js.
// Her veri dosyası atomik yazılır (aynı klasörde geçici dosya → doğrulama → okunan sürüm değişmediyse rename).
// Tekrar çalıştırmak güvenlidir: kaldırılacak id kalmadıysa ilgili adımlar bir şey değiştirmez.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const J = (...p) => path.join(ROOT, ...p);
const KURU = process.argv.includes('--kuru');
const { KALDIR, AD, BLOK, YENI } = require('./alt_tip_veri.js');
const ACK = require('./alt_tip_aciklama_duzeltmeleri.js');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const GEC = path.join(path.resolve(__dirname, '..', '..', '..'), '_arsiv', '2026-11-15-sorunlu-vaka-oncesi', 'gecici');
const park = (t, suf) => { fs.mkdirSync(GEC, { recursive: true }); fs.renameSync(t, path.join(GEC, path.basename(t) + suf + '-' + Date.now())); };
const fail = (m) => { console.error('HATA: ' + m + '\nHiçbir dosya değiştirilmedi (bu adımda).'); process.exit(1); };
const norm = (s) => String(s).toLocaleLowerCase('tr').normalize('NFC').replace(/\s+/g, ' ').trim();
const clone = (o) => JSON.parse(JSON.stringify(o));
const hdr = (s) => /^\/\*\*[\s\S]*?\*\//.exec(s)[0];

const F = {
  diag: J('js', 'diagnoses.js'), man: J('js', 'dsm_manual.js'), cases: J('js', 'cases.js'), ph: J('js', 'pharmacology.js'),
  disi: J('tools', 'icerik', 'tani_temizligi', 'liste_disi_kavramlar.json'),
};
const ACK_DIR = J('tools', 'icerik', 'vaka_aciklamalari');
const ackFiles = fs.readdirSync(ACK_DIR).filter((f) => /^aciklamalar_\d{3}_\d{3}\.json$/.test(f)).sort();
const PAK_DIR = J('paketler');
const pakFiles = fs.readdirSync(PAK_DIR).filter((f) => /^vaka_paketi_\d+\.json$/.test(f)).sort();

const src = {}; const h0 = {};
const all = [...Object.values(F), ...ackFiles.map((f) => path.join(ACK_DIR, f)), ...pakFiles.map((f) => path.join(PAK_DIR, f))];
for (const f of all) { src[f] = fs.readFileSync(f, 'utf8'); h0[f] = sha(src[f]); }
const load = (f) => { const m = { exports: {} }; new Function('module', 'exports', src[f])(m, m.exports); return m.exports; };
const D0 = load(F.diag); const M0 = load(F.man).DSM5_MANUAL; const C0 = load(F.cases); const P0 = load(F.ph);
const CAT = D0.DSM_CATEGORIES;
const byId0 = new Map(D0.DIAGNOSES_DATABASE.map((d) => [d.id, d]));
const parentOf = (id) => (KALDIR[id] ? KALDIR[id][0] : id);
for (const [r, [p]] of Object.entries(KALDIR)) if (!YENI[p] && !byId0.has(p)) fail(`üst tanı yok: ${p}`);
const rmPresent = Object.keys(KALDIR).filter((r) => byId0.has(r));
console.log(`Listede bulunan kaldırılacak id: ${rmPresent.length}/${Object.keys(KALDIR).length}`);

// ---------- 1. diagnoses.js ----------
const D = [];
for (const d of D0.DIAGNOSES_DATABASE) {
  for (const [pid, y] of Object.entries(YENI)) if (y.once === d.id && !byId0.has(pid)) D.push({ id: pid, nameTr: y.nameTr, nameEn: y.nameEn, category: y.category, aliases: [...y.aliases] });
  if (KALDIR[d.id]) continue;
  const n = clone(d);
  if (AD[d.id]) {
    const a = AD[d.id];
    if (a.eskiAd) for (const old of [d.nameTr, d.nameEn]) n.aliases.push(old);
    if (a.nameTr) n.nameTr = a.nameTr; if (a.nameEn) n.nameEn = a.nameEn;
  }
  D.push(n);
}
const dById = new Map(D.map((d) => [d.id, d]));
for (const r of rmPresent) { const o = byId0.get(r); const p = dById.get(parentOf(r)); if (o.category !== p.category) fail(`kategori farklı ${r}→${p.id}`); p.aliases.push(o.nameTr, o.nameEn, ...o.aliases); }
for (const d of D) { // tekrarları ve adla aynı olan takma adları ayıkla
  const seen = new Set([norm(d.nameTr), norm(d.nameEn)]); const out = [];
  for (const a of d.aliases) { const k = norm(a); if (!a || seen.has(k)) continue; seen.add(k); out.push(a); }
  d.aliases = out;
}
const ids = new Set(D.map((d) => d.id));
// ---------- 2. dsm_manual.js ----------
const M = {};
for (const k of Object.keys(M0)) {
  for (const [pid, y] of Object.entries(YENI)) if (y.once === k && !M0[pid]) M[pid] = { id: pid, nameTr: y.nameTr, nameEn: y.nameEn, clinicalDescription: clone(y.clinicalDescription), criteriaList: clone(y.criteriaList) };
  if (KALDIR[k]) continue;
  const e = clone(M0[k]);
  if (AD[k] && AD[k].manualTr) { e.nameTr = AD[k].manualTr; e.nameEn = AD[k].manualEn; }
  if (BLOK[k] && !e.criteriaList.some((c) => c.code === 'Belirleyiciler / Alt tipler')) {
    const b = BLOK[k]; e.criteriaList.push({ code: 'Belirleyiciler / Alt tipler', title: b.title, content: b.content, items: [...b.items] });
  }
  M[k] = e;
}
for (const id of ids) if (!M[id]) fail(`rehber girdisi yok: ${id}`);
for (const id of Object.keys(M)) if (!ids.has(id)) fail(`rehberde fazla: ${id}`);
// ---------- 3. liste_disi_kavramlar.json ----------
const L = JSON.parse(src[F.disi]);
for (const r of rmPresent) {
  const o = byId0.get(r); const e = M0[r]; if (!e) fail(`kaldırılan ${r} için rehber girdisi yok`);
  L[r] = { id: r, nameTr: e.nameTr, nameEn: e.nameEn, clinicalDescription: e.clinicalDescription, criteriaList: e.criteriaList,
    neden: `Başka bir tanının belirleyicisi / alt tipi (2026-11-15, 2. tur). ${KALDIR[r][1]}`, nedenKodu: 'BELIRLEYICI', karsilayanResmiTani: parentOf(r),
    ozetKaynagi: 'js/dsm_manual.js', taniListesiKaydi: o, eskiKategori: CAT[o.category] };
}
for (const v of Object.values(L)) if (v.karsilayanResmiTani && KALDIR[v.karsilayanResmiTani]) v.karsilayanResmiTani = parentOf(v.karsilayanResmiTani);
// ---------- 4. cases.js ----------
const C = clone(C0.CLINICAL_CASES);
const caseLog = [];
const SUMMARY = {
  'case-113': '29 yaşında, kadın', 'case-114': '24 yaşında, erkek', 'case-116': '35 yaşında, kadın',
  'case-130': '31 yaşında, kadın, 4 yaşında bir çocuk annesi', 'case-144': '54 yaşında, erkek',
};
const ANSWER = { 'case-063': 'arfid', 'case-066': 'factitious_another' };
for (const c of C) {
  const old = c.diagnosisId; let nw = ANSWER[c.id] && c.diagnosisId === { 'case-063': 'pica', 'case-066': 'factitious_disorder' }[c.id] ? ANSWER[c.id] : parentOf(old);
  if (nw !== old) { c.diagnosisId = nw; caseLog.push(`${c.id}: diagnosisId ${old} → ${nw}`); }
  const d = dById.get(c.diagnosisId); if (!d) fail(`${c.id}: tanı yok ${c.diagnosisId}`);
  if (c.category !== d.category) { caseLog.push(`${c.id}: category ${c.category} → ${d.category}`); c.category = d.category; }
  // Oyun bitmeden görünen başlık (patientSummary): tanı/kategori/alan etiketi taşımamalı
  let s = c.patientSummary;
  if (SUMMARY[c.id] && s !== SUMMARY[c.id]) s = SUMMARY[c.id];
  else {
    const m = /\s*\(([^()]*)\)\s*$/.exec(s);
    if (m && !/^BKİ/.test(m[1]) && m[1] !== 'Çift tanılı vaka') s = s.slice(0, m.index) + (/Çift Tanılı|Komorbid/i.test(m[1]) ? ' (Çift tanılı vaka)' : '');
  }
  if (s !== c.patientSummary) { caseLog.push(`${c.id}: patientSummary "${c.patientSummary}" → "${s}"`); c.patientSummary = s; }
  // İpucu 1-2'deki tanı etiketleri
  for (let i = 0; i < 2; i++) {
    let t = c.clues[i];
    t = t.replace(/\s*\((?:\d\.\s*)?(?:Eşlik Eden\s*)?Tanı(?:\)|\s*-[^)]*\))/g, '');
    if (c.id === 'case-134') t = t.replace('(primer/birincil enürezis)', '(primer/birincil)');
    if (c.id === 'case-118') t = t.replace('Klasik depresyon hastalarının aksine,', 'Beklenenin aksine,');
    if (t !== c.clues[i]) { caseLog.push(`${c.id}: ipucu ${i + 1} "${c.clues[i]}" → "${t}"`); c.clues[i] = t; }
  }
  if (c.id === 'case-063' && !/Pika/.test(c.differentialDiagnosis)) { c.differentialDiagnosis += '\n• Pika: Besin değeri olmayan maddelerin (toprak, kâğıt, kireç) yenmesidir; bu çocuk normal yiyecekleri duyusal nedenlerle reddediyor.'; caseLog.push('case-063: differentialDiagnosis +Pika'); }
  for (const h of c.symptomHighlights || []) if (!c.clues[h.clueIndex].includes(h.text)) fail(`${c.id}: vurgu metni ipucunda kalmadı: ${h.text}`);
}
// ---------- 5. pharmacology.js (yalnızca harita anahtarları) ----------
let ph = src[F.ph];
const mStart = ph.indexOf('const DIAGNOSIS_TO_PHARMACOLOGY_MAP = {'); const mEnd = ph.indexOf('\n};', mStart);
if (mStart < 0 || mEnd < 0) fail('harita bloğu bulunamadı');
let block = ph.slice(mStart, mEnd);
const NEWMAP = { specific_learning_disorder: 'psychotherapy_first_no_drug', circadian_rhythm_sleep_wake: 'clonazepam_parasomnia', nrem_sleep_arousal: 'clonazepam_parasomnia' };
for (const [pid, val] of Object.entries(NEWMAP)) if (!new RegExp(`^\\s*"${pid}":`, 'm').test(block)) {
  const re = new RegExp(`^(\\s*)"${YENI[pid].once}":`, 'm'); const mm = re.exec(block); if (!mm) fail(`haritada ${YENI[pid].once} yok`);
  block = block.slice(0, mm.index) + `${mm[1]}"${pid}": "${val}",\n` + block.slice(mm.index);
}
for (const r of Object.keys(KALDIR)) block = block.replace(new RegExp(`^\\s*"${r}":\\s*"[^"]*",?[ \\t]*(//[^\\n]*)?\\n`, 'm'), '');
block = block.replace(/,(\s*)$/, '$1');
ph = ph.slice(0, mStart) + block + ph.slice(mEnd);
// ---------- 6. Açıklamalar ----------
const caseById = new Map(C.map((c) => [c.id, c]));
const ackOut = {}; const ackLog = [];
for (const f of ackFiles) {
  const p = path.join(ACK_DIR, f); const data = JSON.parse(src[p]);
  for (const [cid, ex] of Object.entries(data)) {
    const before = JSON.stringify(ex); const o = ACK[cid];
    if (o) {
      if (Array.isArray(o.whyThis)) ex.whyThis = [...o.whyThis]; else if (o.whyThis) for (const [i, t] of Object.entries(o.whyThis)) ex.whyThis[+i] = t;
      if (o.whyNot) ex.whyNot = clone(o.whyNot);
      if (o.teachingPoint) ex.teachingPoint = o.teachingPoint;
    }
    for (const w of ex.whyNot) w.diagnosisId = parentOf(w.diagnosisId);
    const c = caseById.get(cid); const used = new Set();
    for (const w of ex.whyNot) { if (w.diagnosisId === c.diagnosisId) fail(`${cid}: whyNot cevapla aynı (${w.diagnosisId}) — alt_tip_aciklama_duzeltmeleri.js'e ekleyin`); if (used.has(w.diagnosisId)) fail(`${cid}: whyNot tekrar ${w.diagnosisId}`); used.add(w.diagnosisId); if (!ids.has(w.diagnosisId)) fail(`${cid}: whyNot id yok ${w.diagnosisId}`); }
    if (ex.whyThis.some((t) => /^Not:/.test(t))) fail(`${cid}: 'Not:' maddesi kaldı`);
    if (JSON.stringify(ex) !== before) ackLog.push(cid);
  }
  ackOut[p] = JSON.stringify(data, null, 2);
}
// ---------- 7. paketler (aynı vaka listesi, güncel vaka nesnelerinden, eski dosyadaki alanlarla) ----------
const pakOut = {}; const pakLog = [];
for (const f of pakFiles) {
  const p = path.join(PAK_DIR, f); const arr = JSON.parse(src[p]); let n = 0, miss = 0;
  const out = arr.map((e) => { const c = caseById.get(e.id); if (!c) { miss++; return e; } const r = {}; for (const k of Object.keys(e)) if (k in c) r[k] = clone(c[k]); n++; return r; });
  pakOut[p] = JSON.stringify(out, null, 2); pakLog.push(`${f}: ${n} vaka güncellendi${miss ? `, ${miss} aktif olmayan vaka olduğu gibi` : ''}`);
}
// ---------- Yazım ----------
const outs = {};
outs[F.diag] = `${hdr(src[F.diag]).replace(/\d+ Resmî Tanı/, `${D.length} Resmî Tanı`)}\n\nconst DSM_CATEGORIES = ${JSON.stringify(CAT, null, 4)};\n\nconst DIAGNOSES_DATABASE = ${JSON.stringify(D, null, 4)};\n\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = { DSM_CATEGORIES, DIAGNOSES_DATABASE };\n}\n`;
outs[F.man] = `${hdr(src[F.man]).replace(/Girdi sayısı: \d+/, `Girdi sayısı: ${Object.keys(M).length}`)}\n\nconst DSM5_MANUAL = ${JSON.stringify(M, null, 4)};\n\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = { DSM5_MANUAL };\n}\n`;
outs[F.cases] = `${hdr(src[F.cases])}\n\nconst COURSE_CATEGORIES = ${JSON.stringify(C0.COURSE_CATEGORIES, null, 4)};\n\nconst CLINICAL_CASES = ${JSON.stringify(C, null, 4)};\n\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = { COURSE_CATEGORIES, CLINICAL_CASES };\n}\n`;
outs[F.ph] = ph; outs[F.disi] = JSON.stringify(L, null, 2);
Object.assign(outs, ackOut, pakOut);
// Doğrulama (geçici dosyalar)
const tmp = {};
for (const [f, s] of Object.entries(outs)) { if (s === src[f]) continue; const t = f.replace(/\.(js|json)$/, '.ajanR-tmp.$1'); fs.writeFileSync(t, s, 'utf8'); tmp[f] = t; }
try {
  for (const [f, t] of Object.entries(tmp)) if (f.endsWith('.js')) execFileSync(process.execPath, ['--check', t], { stdio: 'pipe' }); else JSON.parse(fs.readFileSync(t, 'utf8'));
  const chk = (f) => { const m = { exports: {} }; new Function('module', 'exports', fs.readFileSync(tmp[f] || f, 'utf8'))(m, m.exports); return m.exports; };
  const D2 = chk(F.diag).DIAGNOSES_DATABASE, M2 = chk(F.man).DSM5_MANUAL, C2 = chk(F.cases).CLINICAL_CASES, P2 = chk(F.ph);
  if (C2.length !== C0.CLINICAL_CASES.length) throw new Error('vaka sayısı değişti');
  const ids2 = new Set(D2.map((d) => d.id));
  if (Object.keys(M2).length !== D2.length || D2.some((d) => !M2[d.id])) throw new Error('rehber ↔ tanı birebir değil');
  const mk = Object.keys(P2.DIAGNOSIS_TO_PHARMACOLOGY_MAP); if (mk.length !== D2.length || mk.some((k) => !ids2.has(k))) throw new Error(`farmakoloji haritası ↔ tanı birebir değil (${mk.length}/${D2.length}: ${mk.filter((k) => !ids2.has(k))} | ${D2.filter((d) => !P2.DIAGNOSIS_TO_PHARMACOLOGY_MAP[d.id]).map((d) => d.id)})`);
  for (const c of C2) { if (!ids2.has(c.diagnosisId)) throw new Error(`${c.id} tanı yok`); const r = P2.resolvePharmacologyIdForCase(c); if (!P2.PHARMACOLOGY_DATABASE.some((p) => p.id === r)) throw new Error(`${c.id} farmakoloji çözülemedi`); }
  const tdir = fs.mkdtempSync(path.join(ROOT, '_arsiv', '2026-11-15-sorunlu-vaka-oncesi', 'gecici', 'dogrulama-')); try {
    for (const f of ackFiles) fs.writeFileSync(path.join(tdir, f), fs.readFileSync(tmp[path.join(ACK_DIR, f)] || path.join(ACK_DIR, f), 'utf8'));
    const r = require(path.join(ACK_DIR, 'dogrula.js')).dogrula({ cases: C2, diagnoses: D2, dir: tdir });
    if (r.errors.length) throw new Error('açıklama doğrulaması: ' + r.errors.join('; '));
  } finally { /* geçici doğrulama klasörü _arsiv altında kalır */ }
} catch (e) { for (const t of Object.values(tmp)) park(t, '.basarisiz'); fail(e.message); }
console.log(`Tanı: ${D0.DIAGNOSES_DATABASE.length} → ${D.length} | Rehber: ${Object.keys(M0).length} → ${Object.keys(M).length} | Vaka: ${C.length} | Liste dışı: ${Object.keys(L).length}`);
console.log('Vaka değişiklikleri:\n  ' + (caseLog.join('\n  ') || '(yok)'));
console.log(`Açıklaması değişen vakalar (${ackLog.length}): ${ackLog.join(', ')}`);
console.log(pakLog.join('\n'));
if (KURU) { for (const t of Object.values(tmp)) park(t, '.kuru'); console.log('(kuru) hiçbir dosya değiştirilmedi'); process.exit(0); }
for (const [f, t] of Object.entries(tmp)) {
  if (sha(fs.readFileSync(f, 'utf8')) !== h0[f]) { park(t, '.eskimis'); fail(`${path.relative(ROOT, f)} okunduktan sonra başka bir işlemce değişti; betiği yeniden çalıştırın`); }
  fs.renameSync(t, f); console.log('yazıldı: ' + path.relative(ROOT, f));
}
