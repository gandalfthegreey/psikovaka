#!/usr/bin/env node
// DSM rehberi eksik tanı özetlerini doğrular (F_*.json ve G_*.json).
// Kullanım: node tools/icerik/tani_ozetleri/dogrula.js
// Çıkış kodu: hata yoksa 0, varsa 1.
'use strict';
// NOT (2026-11-15, Claude ajan J): Bu özetler js/dsm_manual.js içine birleştirildi (listede kalan tanılar) ya da
// tools/icerik/tani_temizligi/liste_disi_kavramlar.json dosyasına taşındı (listeden çıkanlar). Bu betik birleştirme ÖNCESİ
// durumu doğrular, artık hata verir. Güncel doğrulama: node tools/icerik/tani_temizligi/dogrula.js
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..');
const { DIAGNOSES_DATABASE: D } = require(path.join(ROOT, 'js', 'diagnoses.js'));
const { DSM5_MANUAL: M } = require(path.join(ROOT, 'js', 'dsm_manual.js'));

const errors = [];
const err = (f, id, msg) => errors.push(`${f}${id ? ' [' + id + ']' : ''}: ${msg}`);
const byId = new Map(D.map(d => [d.id, d]));
const missing = D.filter(d => !(d.id in M)).map(d => d.id);
// İş bölümü: F = eksik listenin ilk yarısı, G = ikinci yarısı (dizi sırasıyla).
const half = Math.ceil(missing.length / 2);
const share = { F: missing.slice(0, half), G: missing.slice(half) };

// Referans anahtar kümeleri mevcut girdilerden çıkarılır.
const sig = a => JSON.stringify([...a].sort());
const refEntry = new Set(Object.values(M).map(e => sig(Object.keys(e))));
const refDesc = new Set(Object.values(M).map(e => sig(Object.keys(e.clinicalDescription || {}))));
const refCrit = new Set();
Object.values(M).forEach(e => (e.criteriaList || []).forEach(c => refCrit.add(sig(Object.keys(c)))));

function checkStrings(f, id, v, where) {
  if (typeof v === 'string') { if (!v.trim()) err(f, id, `boş metin: ${where}`); }
  else if (Array.isArray(v)) { if (!v.length) err(f, id, `boş dizi: ${where}`); v.forEach((x, i) => checkStrings(f, id, x, `${where}[${i}]`)); }
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => checkStrings(f, id, x, `${where}.${k}`));
  else err(f, id, `beklenmeyen değer türü (${typeof v}): ${where}`);
}

const seen = new Map();
const files = fs.readdirSync(__dirname).filter(n => /^[FG]_.+\.json$/.test(n)).sort();
for (const f of files) {
  let data;
  try { data = JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8')); }
  catch (e) { err(f, null, 'JSON ayrıştırılamadı: ' + e.message); continue; }
  if (!data || typeof data !== 'object' || Array.isArray(data)) { err(f, null, 'kök nesne değil'); continue; }
  const prefix = f[0];
  for (const [id, e] of Object.entries(data)) {
    if (seen.has(id)) err(f, id, `kimlik birden çok dosyada: ${seen.get(id)}`); else seen.set(id, f);
    const d = byId.get(id);
    if (!d) { err(f, id, 'DIAGNOSES_DATABASE içinde yok'); continue; }
    if (id in M) err(f, id, 'zaten DSM5_MANUAL içinde var');
    if (!share[prefix].includes(id)) err(f, id, `${prefix} payında değil`);
    if (f !== `${prefix}_${d.category}.json`) err(f, id, `kategori dosyası uyuşmuyor (beklenen ${prefix}_${d.category}.json)`);
    if (!e || typeof e !== 'object') { err(f, id, 'girdi nesne değil'); continue; }
    if (e.id !== id) err(f, id, 'id alanı anahtarla aynı değil');
    if (e.nameTr !== d.nameTr) err(f, id, 'nameTr uyuşmuyor');
    if (e.nameEn !== d.nameEn) err(f, id, 'nameEn uyuşmuyor');
    if (!refEntry.has(sig(Object.keys(e)))) err(f, id, 'girdi anahtarları referansla aynı değil: ' + Object.keys(e));
    if (!e.clinicalDescription || typeof e.clinicalDescription !== 'object' || Array.isArray(e.clinicalDescription)) err(f, id, 'clinicalDescription nesne değil');
    else if (!refDesc.has(sig(Object.keys(e.clinicalDescription)))) err(f, id, 'clinicalDescription anahtarları farklı');
    if (!Array.isArray(e.criteriaList) || !e.criteriaList.length) err(f, id, 'criteriaList boş ya da dizi değil');
    else e.criteriaList.forEach((c, i) => {
      if (!c || typeof c !== 'object' || !refCrit.has(sig(Object.keys(c)))) err(f, id, `criteriaList[${i}] anahtarları farklı`);
      else if ('items' in c && !Array.isArray(c.items)) err(f, id, `criteriaList[${i}].items dizi değil`);
    });
    checkStrings(f, id, e, 'girdi');
  }
}

console.log(`Eksik tanı sayısı: ${missing.length} (F: ${share.F.length}, G: ${share.G.length})`);
for (const p of ['F', 'G']) {
  const done = share[p].filter(id => seen.has(id) && seen.get(id)[0] === p);
  const left = share[p].filter(id => !done.includes(id));
  console.log(`${p}: ${done.length}/${share[p].length}` + (left.length ? `  eksik: ${left.join(', ')}` : ''));
}
if (errors.length) { console.log(`\nHATA (${errors.length}):`); errors.forEach(x => console.log(' - ' + x)); process.exit(1); }
console.log('Hata yok.');
