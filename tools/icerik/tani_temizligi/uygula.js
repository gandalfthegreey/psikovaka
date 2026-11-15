#!/usr/bin/env node
// Tanı listesi temizliğini uygular (Claude ajan J, 2026-11-15).
// Kaynak: _arsiv/2026-11-15-tani-temizligi-oncesi/ içindeki yedekler + tools/icerik/tani_ozetleri/F_*.json, G_*.json
// Karar verisi: karar.js, yeni girdiler: yeni_tanilar.js
// Çıktı: js/diagnoses.js, js/dsm_manual.js, js/cases.js (geçici dosyaya yazılıp doğrulanır, sonra mv ile yerine konur),
//        tools/icerik/tani_temizligi/{liste_disi_kavramlar.json, arsivlenen_vakalar.json, KARAR_TABLOSU.md}
// Kullanım: node tools/icerik/tani_temizligi/uygula.js [--dry-run]
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const BACKUP = path.join(ROOT, '_arsiv', '2026-11-15-tani-temizligi-oncesi');
const OUT = __dirname;
const DRY = process.argv.includes('--dry-run');
const K = require('./karar.js');
const Y = require('./yeni_tanilar.js');

const errors = [];
const fail = (m) => errors.push(m);
const clone = (o) => JSON.parse(JSON.stringify(o));

const oldD = require(path.join(BACKUP, 'diagnoses.js'));
const oldM = require(path.join(BACKUP, 'dsm_manual.js')).DSM5_MANUAL;
const oldC = require(path.join(BACKUP, 'cases.js'));

// F_/G_ özetleri
const SUM_DIR = path.join(ROOT, 'tools', 'icerik', 'tani_ozetleri');
const FG = {};
for (const f of fs.readdirSync(SUM_DIR).filter((f) => /^[FG]_.*\.json$/.test(f)).sort()) {
  const j = JSON.parse(fs.readFileSync(path.join(SUM_DIR, f), 'utf8'));
  for (const [id, e] of Object.entries(j)) {
    if (FG[id]) fail(`Özet iki kez var: ${id}`);
    FG[id] = { entry: e, file: f };
  }
}

const oldById = Object.fromEntries(oldD.DIAGNOSES_DATABASE.map((d) => [d.id, d]));
for (const id of Object.keys(K.REMOVE)) if (!oldById[id]) fail(`REMOVE: bilinmeyen id ${id}`);
for (const id of Object.keys(K.FIX)) { if (!oldById[id]) fail(`FIX: bilinmeyen id ${id}`); if (K.REMOVE[id]) fail(`FIX ve REMOVE birlikte: ${id}`); }
for (const id of Object.keys(Y.DIAG)) { if (oldById[id]) fail(`ADD: id zaten var ${id}`); if (!K.ADD_AFTER[id]) fail(`ADD_AFTER yok: ${id}`); }

// ---- 1. Tanı listesi ----
const addAfter = {};
for (const [id, anchor] of Object.entries(K.ADD_AFTER)) {
  if (!oldById[anchor]) fail(`ADD_AFTER çapası yok: ${anchor}`);
  (addAfter[anchor] = addAfter[anchor] || []).push(id);
}
const fixLog = {};
const newDiag = [];
for (const d of oldD.DIAGNOSES_DATABASE) {
  if (!K.REMOVE[d.id]) {
    const n = clone(d);
    const fx = K.FIX[d.id];
    if (fx) {
      const changes = [];
      for (const k of ['nameTr', 'nameEn', 'category']) if (fx[k] && fx[k] !== n[k]) { changes.push(`${k}: "${n[k]}" → "${fx[k]}"`); n[k] = fx[k]; }
      let al = n.aliases || [];
      for (const a of fx.aliasesDrop || []) { if (!al.includes(a)) fail(`FIX ${d.id}: çıkarılacak takma ad yok: ${a}`); }
      if ((fx.aliasesDrop || []).length) changes.push(`takma ad çıkarıldı: ${fx.aliasesDrop.join(', ')}`);
      al = al.filter((a) => !(fx.aliasesDrop || []).includes(a));
      const added = [];
      for (const a of fx.aliasesAdd || []) if (!al.includes(a)) { al.push(a); added.push(a); }
      if (added.length) changes.push(`takma ad eklendi: ${added.join(', ')}`);
      n.aliases = al;
      fixLog[d.id] = changes;
    }
    newDiag.push(n);
  }
  for (const addId of addAfter[d.id] || []) newDiag.push(clone(Y.DIAG[addId]));
}
// Kategori değiştiren girdiyi yeni grubunun içine taşı (liste düzeni; ağaç görünümü zaten kategoriye göre gruplar)
const MOVE_AFTER = { schizotypal_pd: 'schizoid_pd' };
for (const [id, after] of Object.entries(MOVE_AFTER)) {
  const i = newDiag.findIndex((d) => d.id === id);
  const [item] = newDiag.splice(i, 1);
  newDiag.splice(newDiag.findIndex((d) => d.id === after) + 1, 0, item);
}
const newCats = clone(oldD.DSM_CATEGORIES);
const usedCats = new Set(newDiag.map((d) => d.category));
const removedCats = [];
for (const c of Object.keys(newCats)) if (!usedCats.has(c)) { removedCats.push(clone(newCats[c])); delete newCats[c]; }
for (const d of newDiag) if (!newCats[d.category]) fail(`Kategori yok: ${d.id} → ${d.category}`);
const newById = Object.fromEntries(newDiag.map((d) => [d.id, d]));

// ---- 2. Rehber (DSM5_MANUAL) ----
function getPath(obj, p) { return p.split('.').reduce((o, k) => (o == null ? o : o[k]), obj); }
function setPath(obj, p, v) { const ks = p.split('.'); const last = ks.pop(); const o = ks.reduce((x, k) => x[k], obj); o[last] = v; }
function replaceOnce(obj, p, from, to, label) {
  const cur = getPath(obj, p);
  if (typeof cur !== 'string') { fail(`${label}: ${p} metin değil`); return; }
  const n = cur.split(from).length - 1;
  if (n !== 1) { fail(`${label}: "${from.slice(0, 50)}…" ${p} içinde ${n} kez geçiyor (1 olmalı)`); return; }
  setPath(obj, p, cur.replace(from, to));
}
const newManual = {};
const manualSource = {};
for (const id of Object.keys(oldM)) if (newById[id]) { newManual[id] = clone(oldM[id]); manualSource[id] = 'DSM5_MANUAL (mevcut)'; }
for (const d of newDiag) {
  if (newManual[d.id]) continue;
  if (FG[d.id]) { newManual[d.id] = clone(FG[d.id].entry); manualSource[d.id] = FG[d.id].file; newManual[d.id].nameTr = d.nameTr; newManual[d.id].nameEn = d.nameEn; }
  else if (Y.MANUAL[d.id]) { newManual[d.id] = clone(Y.MANUAL[d.id]); manualSource[d.id] = 'yeni_tanilar.js (yeni)'; }
  else fail(`Rehber girdisi bulunamadı: ${d.id}`);
}
for (const id of Object.keys(K.FIX)) {
  const fx = K.FIX[id];
  if (newManual[id] && (fx.nameTr || fx.nameEn)) { if (fx.nameTr) newManual[id].nameTr = fx.nameTr; if (fx.nameEn) newManual[id].nameEn = fx.nameEn; }
}
for (const [id, p, from, to] of K.SUMMARY_EDITS) {
  if (!newManual[id]) { fail(`SUMMARY_EDITS: rehberde yok ${id}`); continue; }
  replaceOnce(newManual[id], p, from, to, `Özet ${id}`);
}

// ---- 3. Liste dışı kavramlar (kaldırılan tanıların özetleri) ----
const NAME_FIX_REMOVED = {
  ptsd_dissociative: { nameTr: 'TSSB (Dissosiyatif Belirtilerle)' },
  borderline_intellectual_functioning: { nameTr: 'Sınırda Entelektüel İşlevsellik' },
};
const disi = {};
for (const [id, [code, aciklama, hedef]] of Object.entries(K.REMOVE)) {
  const src = oldM[id] ? clone(oldM[id]) : FG[id] ? clone(FG[id].entry) : null;
  if (!src) { fail(`Kaldırılan girdinin özeti yok: ${id}`); continue; }
  if (NAME_FIX_REMOVED[id]) Object.assign(src, NAME_FIX_REMOVED[id]);
  if (hedef && !newById[hedef]) fail(`REMOVE ${id}: karşılayan tanı listede yok: ${hedef}`);
  disi[id] = {
    ...src,
    neden: `${K.NEDEN[code]}. ${aciklama}`,
    nedenKodu: code,
    karsilayanResmiTani: hedef || null,
    ozetKaynagi: oldM[id] ? 'js/dsm_manual.js' : `tools/icerik/tani_ozetleri/${FG[id].file}`,
    taniListesiKaydi: clone(oldById[id]),
    eskiKategori: clone(oldD.DSM_CATEGORIES[oldById[id].category]),
  };
}

// ---- 4. Vakalar ----
for (const id of [...Object.keys(K.REMAP), ...Object.keys(K.ARCHIVE)]) if (!oldC.CLINICAL_CASES.find((c) => c.id === id)) fail(`Vaka yok: ${id}`);
const newCases = [];
const archived = [];
const caseLog = [];
const catLog = [];
for (const c0 of oldC.CLINICAL_CASES) {
  if (K.ARCHIVE[c0.id]) { archived.push({ arsivNedeni: K.ARCHIVE[c0.id], eskiTaniId: c0.diagnosisId, vaka: clone(c0) }); continue; }
  const c = clone(c0);
  if (K.REMAP[c.id]) { caseLog.push([c.id, c.caseNumber, c.diagnosisId, K.REMAP[c.id]]); c.diagnosisId = K.REMAP[c.id]; }
  for (const [cid, p, from, to] of K.CASE_EDITS) if (cid === c.id) replaceOnce(c, p, from, to, `Vaka ${cid}`);
  const d = newById[c.diagnosisId];
  if (!d) { fail(`Vaka ${c.id}: diagnosisId listede yok (${c.diagnosisId}) ve eşleme/arşiv kararı yok`); newCases.push(c); continue; }
  if (c.category !== d.category) { catLog.push([c.id, c.category, d.category]); c.category = d.category; }
  if (c.secondaryDiagnosisId && !newById[c.secondaryDiagnosisId]) fail(`Vaka ${c.id}: secondaryDiagnosisId listede yok`);
  newCases.push(c);
}
for (const [cid] of K.CASE_EDITS) if (!newCases.find((c) => c.id === cid)) fail(`CASE_EDITS: vaka aktif listede yok ${cid}`);

// ---- 5. Dosya metinleri ----
function render(srcFile, header, consts) {
  const src = fs.readFileSync(srcFile, 'utf8');
  const firstConst = src.indexOf('const ' + consts[0][0]);
  const tail = src.slice(src.indexOf('\nif (typeof module'));
  return header + src.slice(src.indexOf('*/') + 2, firstConst) + consts.map(([n, v]) => `const ${n} = ${JSON.stringify(v, null, 4)};`).join('\n\n') + '\n' + tail;
}
const nCat = Object.keys(newCats).length;
const diagHeader = `/**\n * PsikoVaka - DSM-5-TR Tanı Listesi: ${newDiag.length} Resmî Tanı, ${nCat} Ana Kategori\n * Yalnızca resmî DSM-5-TR Bölüm II ruhsal bozukluk tanıları (resmî "belirlenmiş diğer/belirtilmemiş" kategoriler ve ayrı kodlanan görünümler dahil).\n * 2026-11-15 tanı temizliği: kararlar tools/icerik/tani_temizligi/KARAR_TABLOSU.md, listeden çıkan kavramlar liste_disi_kavramlar.json.\n */`;
const manHeader = `/**\n * PsikoVaka - Kapsamlı DSM-5 Tanı Kriterleri ve Klinik El Kitabı\n * Her tanı için ayrı ayrı:\n * 1. Detaylı Klinik Tanım & Psikopatoloji\n * 2. Resmi DSM-5 Tanı Kriterleri\n * Girdi sayısı: ${Object.keys(newManual).length} (DIAGNOSES_DATABASE ile birebir; 2026-11-15 tanı temizliği)\n */`;
const caseHeader = `/**\n * PsikoVaka 2.0 - Zengin Klinik Vaka Veritabanı (${newCases.length} DSM-5-TR Vakası)\n * Tanı, Psikoterapi, Psikofarmakoloji ve 3 Aşamalı Kombo Modu destekli.\n * 2026-11-15: resmî tanıya bağlanamayan ${archived.length} vaka tools/icerik/tani_temizligi/arsivlenen_vakalar.json dosyasına taşındı (caseNumber değerleri değişmedi).\n */`;
const files = {
  'js/diagnoses.js': render(path.join(BACKUP, 'diagnoses.js'), diagHeader, [['DSM_CATEGORIES', newCats], ['DIAGNOSES_DATABASE', newDiag]]),
  'js/dsm_manual.js': render(path.join(BACKUP, 'dsm_manual.js'), manHeader, [['DSM5_MANUAL', newManual]]),
  'js/cases.js': render(path.join(BACKUP, 'cases.js'), caseHeader, [['COURSE_CATEGORIES', oldC.COURSE_CATEGORIES], ['CLINICAL_CASES', newCases]]),
};

module.exports = { newDiag, newCats, newManual, newCases, archived, disi, removedCats, fixLog, caseLog, catLog, manualSource, oldD, oldC, oldM, FG, files, errors };
if (require.main !== module) return;

if (errors.length) { console.error('HATA:\n- ' + errors.join('\n- ')); process.exit(1); }

// ---- 6. Karar tablosu ----
function tablo() {
  const esc = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
  const L = [];
  L.push('# Tanı Listesi Temizliği — Karar Tablosu (2026-11-15, Claude ajan J)', '');
  L.push('**Kural (Emre kararı, 2026-11-15):** "Tanı olan kalır, tanı olmayan çıkar." Tahmin listesinde yalnızca resmî DSM-5-TR Bölüm II ruhsal bozukluk tanıları bulunur: resmî "belirlenmiş diğer" / "belirtilmemiş" kategoriler ve ayrı kodlanan görünümler (ör. zihinsel yetiyitimi düzeyleri, maddeye özgü kullanım/zehirlenme/yoksunluk, ayrı kodlu alt tipler) dahil. Çıkanlar: kültürel sıkıntı kavramları, Bölüm III önerileri, yalnızca belirleyici/örnek/belirti boyutu olanlar, DSM dışı kavramlar, yinelenen girdiler, Z/T/R kodlu "klinik ilginin odağı olabilecek diğer durumlar" ve (aynı gerekçeyle: kitapta var ama ruhsal bozukluk değil) ilaca bağlı hareket bozuklukları.', '');
  L.push('Bu tablo `uygula.js` tarafından `karar.js` ve `yeni_tanilar.js` verisinden üretilir; elle düzenlemeyin, kararı `karar.js` içinde değiştirip betiği yeniden çalıştırın.', '');
  const cnt = {}; for (const [, [c]] of Object.entries(K.REMOVE)) cnt[c] = (cnt[c] || 0) + 1;
  L.push('## Özet', '');
  L.push(`- Önce: ${oldD.DIAGNOSES_DATABASE.length} tanı, ${Object.keys(oldD.DSM_CATEGORIES).length} kategori, ${Object.keys(oldM).length} rehber girdisi (+ ${Object.keys(FG).length} birleştirilmemiş özet), ${oldC.CLINICAL_CASES.length} vaka.`);
  L.push(`- Sonra: ${newDiag.length} tanı, ${Object.keys(newCats).length} kategori, ${Object.keys(newManual).length} rehber girdisi, ${newCases.length} aktif vaka, ${archived.length} arşivlenen vaka.`);
  L.push(`- Kaldırılan: ${Object.keys(K.REMOVE).length} (` + Object.entries(cnt).map(([c, n]) => `${c}: ${n}`).join(', ') + `). Eklenen: ${Object.keys(Y.DIAG).length}. Düzeltilen: ${Object.keys(fixLog).length}.`);
  if (removedCats.length) L.push(`- Boşalan ve kaldırılan kategori: ${removedCats.map((c) => `${c.id} (${c.name})`).join(', ')}.`);
  L.push('', '### Neden kodları', '');
  for (const [c, t] of Object.entries(K.NEDEN)) L.push(`- **${c}**: ${t}.`);
  L.push('', '## Tüm girdiler (eski sırayla; eklenenler en altta)', '');
  L.push('| # | id | ad | karar | gerekçe |', '|---|---|---|---|---|');
  oldD.DIAGNOSES_DATABASE.forEach((d, i) => {
    let karar, ger;
    if (K.REMOVE[d.id]) { const [c, a, h] = K.REMOVE[d.id]; karar = `ÇIKAR (${c})`; ger = a + (h ? ` → karşılığı: \`${h}\`` : ''); }
    else if (K.FIX[d.id]) { karar = 'KALIR + DÜZELT'; ger = K.FIX[d.id].not + (fixLog[d.id] && fixLog[d.id].length ? ' [' + fixLog[d.id].join('; ') + ']' : ''); }
    else { karar = 'KALIR'; ger = 'Resmî DSM-5-TR tanısı / ayrı kodlu görünüm.'; }
    L.push(`| ${i + 1} | \`${d.id}\` | ${esc(d.nameTr)} | ${karar} | ${esc(ger)} |`);
  });
  for (const id of Object.keys(Y.DIAG)) L.push(`| + | \`${id}\` | ${esc(Y.DIAG[id].nameTr)} | EKLENDİ | Resmî DSM-5-TR kategorisi; listede yoktu. Rehber girdisi yeni_tanilar.js. |`);
  L.push('', '## Vaka eşlemeleri (eski → yeni diagnosisId)', '', '| vaka | no | eski | yeni |', '|---|---|---|---|');
  for (const [id, no, a, b] of caseLog) L.push(`| ${id} | ${no} | \`${a}\` | \`${b}\` |`);
  L.push('', 'Eşlenen vakalarda 6. ipucu ve gerektiğinde `dsmCriteriaSummary` / `symptomHighlights` metni yeni cevapla tutarlı olacak şekilde en az düzeyde düzeltildi (`karar.js` → `CASE_EDITS`). `therapyId` ve `pharmacologyId` değişmedi.', '');
  L.push('## Arşivlenen vakalar (`arsivlenen_vakalar.json`)', '', '| vaka | no | eski tanı | neden |', '|---|---|---|---|');
  for (const a of archived) L.push(`| ${a.vaka.id} | ${a.vaka.caseNumber} | \`${a.eskiTaniId}\` | ${esc(a.arsivNedeni)} |`);
  if (catLog.length) { L.push('', '## Vaka `category` alanı düzeltmeleri (tanının kategorisine eşitlendi)', '', '| vaka | eski | yeni |', '|---|---|---|'); for (const [id, a, b] of catLog) L.push(`| ${id} | ${a} | ${b} |`); }
  L.push('', '## Emin olunmayan noktalar', '');
  L.push('- İlaca bağlı hareket bozuklukları (NMS, tardif diskinezi, akatizi, distoni, parkinsonizm, antidepresan bırakma sendromu) DSM-5-TR Bölüm II\'de listelenir ama ruhsal bozukluk değildir; kurala göre çıkarıldı ve 5 vaka arşivlendi. Emre bunları "tanı" sayarsa `karar.js` içinde REMOVE/ARCHIVE satırları silinip betik yeniden çalıştırılarak geri alınabilir.');
  L.push('- Madde zehirlenmesi/yoksunluğu kodları (F1x.x29, F12.288 vb.) DSM-5 kodlarıdır; DSM-5-TR bazılarını güncelledi ve kod eşlik eden kullanım bozukluğunun şiddetine göre değişir. Doğrulanamadığı için olduğu gibi bırakıldı; kitapla kontrol edilmeli.');
  L.push('- Koku alma referans bozukluğu DSM-5-TR\'de belirlenmiş diğer OKİB örneği olarak ele alındı (DSM-5\'teki jikoshu-kyofu örneğinin yerine). Kitapla doğrulanmalı.');
  L.push('- Kleine-Levin sendromu vakası (136) arşivlendi: hipersomnolans bozukluğunun süre ölçütü karşılanmıyor; "belirlenmiş diğer hipersomnolans bozukluğu" listede yok. İstenirse o kategori eklenip vaka geri alınabilir.');
  L.push('- Yeni 6 rehber girdisi ve birleştirilen 164 F_/G_ özeti kitaba erişimsiz yazıldı; `tani_ozetleri/F_GOZDEN_GECIR.md` ve `G_GOZDEN_GECIR.md` listeleri hâlâ geçerli.');
  return L.join('\n') + '\n';
}

// ---- 7. Yaz ----
const crypto = require('crypto');
const md5 = (p) => crypto.createHash('md5').update(fs.readFileSync(p)).digest('hex');
for (const rel of Object.keys(files)) {
  const cur = path.join(ROOT, rel);
  const bak = path.join(BACKUP, path.basename(rel));
  const curTxt = fs.readFileSync(cur, 'utf8');
  // Yedekle aynıysa ya da bu betiğin önceki çıktısıysa (başlık işareti) üzerine yazılabilir.
  const same = md5(cur) === md5(bak) || curTxt === files[rel] || /2026-11-15(:| tanı temizliği)/.test(curTxt.slice(0, 700));
  if (!same) { console.error(`DUR: ${rel} yedekten sonra başka biri tarafından değiştirilmiş. Önce farkı inceleyin.`); process.exit(1); }
}
const extra = {
  'liste_disi_kavramlar.json': JSON.stringify(disi, null, 2) + '\n',
  'arsivlenen_vakalar.json': JSON.stringify({ aciklama: 'DSM-5-TR resmî tanısına dürüstçe bağlanamadığı için 2026-11-15 tanı temizliğinde CLINICAL_CASES dışına alınan vakalar. "vaka" alanı js/cases.js şemasıyla birebir aynıdır; geri almak için karar.js ARCHIVE satırını silip uygula.js çalıştırın.', vakalar: archived }, null, 2) + '\n',
  'KARAR_TABLOSU.md': tablo(),
};
if (DRY) { console.log('Kuru çalıştırma: hata yok.', { tani: newDiag.length, rehber: Object.keys(newManual).length, vaka: newCases.length, arsiv: archived.length }); process.exit(0); }
for (const [f, txt] of Object.entries(extra)) { const tmp = path.join(OUT, f + '.tmp'); fs.writeFileSync(tmp, txt); fs.renameSync(tmp, path.join(OUT, f)); }
const tmps = {};
for (const [rel, txt] of Object.entries(files)) {
  const tmp = path.join(ROOT, rel.replace(/\.js$/, '.tmp-j.js'));
  fs.writeFileSync(tmp, txt);
  execFileSync(process.execPath, ['--check', tmp]);
  tmps[rel] = tmp;
}
const chk = `const a=require(${JSON.stringify(tmps['js/diagnoses.js'])}),b=require(${JSON.stringify(tmps['js/dsm_manual.js'])}),c=require(${JSON.stringify(tmps['js/cases.js'])});
if(!a.DSM_CATEGORIES||a.DIAGNOSES_DATABASE.length!==${newDiag.length})throw 1;if(Object.keys(b.DSM5_MANUAL).length!==${Object.keys(newManual).length})throw 2;if(!c.COURSE_CATEGORIES||c.CLINICAL_CASES.length!==${newCases.length})throw 3;console.log('require ok');`;
execFileSync(process.execPath, ['-e', chk], { stdio: 'inherit' });
for (const [rel, tmp] of Object.entries(tmps)) fs.renameSync(tmp, path.join(ROOT, rel));
console.log('Yazıldı.', { tani: newDiag.length, kategori: Object.keys(newCats).length, rehber: Object.keys(newManual).length, aktifVaka: newCases.length, arsivVaka: archived.length, listeDisi: Object.keys(disi).length });
