#!/usr/bin/env node
/**
 * goldForDiagnoses kimlik eşlemesi (Claude ajan P, 2026-11-16; ajan R'nin devri).
 * js/therapies.js ve js/pharmacology.js içindeki goldForDiagnoses listelerinde artık tahmin listesinde olmayan
 * tanı kimliklerini üst tanıya eşler (kaynak: alt_tip_veri.js KALDIR, karar.js REMOVE, liste_disi_kavramlar.json
 * karsilayanResmiTani); karşılığı olmayanları düşürür; tekrarları kaldırır. Hangi protokolün önerildiği değişmez.
 *   node tools/icerik/tani_temizligi/gold_remap.js          -> yazar (geçici dosya + node yükleme denetimi + rename)
 *   node tools/icerik/tani_temizligi/gold_remap.js --kuru   -> yalnızca rapor
 */
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const dry = process.argv.includes('--kuru');
const { DIAGNOSES_DATABASE } = require(path.join(root, 'js/diagnoses.js'));
const live = new Set(DIAGNOSES_DATABASE.map(d => d.id));
const K = require('./karar.js'), A = require('./alt_tip_veri.js'), Lx = require('./liste_disi_kavramlar.json');
function parentOf(id, seen = new Set()) {
  if (live.has(id)) return id;
  if (seen.has(id)) return null; seen.add(id);
  const p = (A.KALDIR[id] && A.KALDIR[id][0]) || (K.REMOVE[id] && K.REMOVE[id][2]) || (Lx[id] && Lx[id].karsilayanResmiTani) || null;
  return p ? parentOf(p, seen) : null;
}
let changed = 0; const report = {};
for (const rel of ['js/therapies.js', 'js/pharmacology.js']) {
  const file = path.join(root, rel);
  const src = fs.readFileSync(file, 'utf8');
  const out = src.replace(/("goldForDiagnoses":\s*)(\[[^\]]*\])/g, (m, head, arr) => {
    const ids = JSON.parse(arr);
    const next = [];
    ids.forEach(id => { const p = parentOf(id); if (p !== id) report[id] = p; if (p && !next.includes(p)) next.push(p); });
    if (JSON.stringify(next) === JSON.stringify(ids)) return m;
    changed++;
    const indent = (src.slice(0, src.indexOf(m)).split('\n').pop().match(/^\s*/) || [''])[0];
    return head + (next.length ? '[\n' + next.map(x => indent + '    ' + JSON.stringify(x)).join(',\n') + '\n' + indent + ']' : '[]');
  });
  if (!dry && out !== src) {
    const tmp = file + '.tmp';
    fs.writeFileSync(tmp, out);
    delete require.cache[require.resolve(tmp)];
    const a = require(file), b = require(tmp);
    const strip = (o) => JSON.stringify(o, (k, v) => (k === 'goldForDiagnoses' ? undefined : v));
    if (strip(a) !== strip(b)) { fs.unlinkSync(tmp); throw new Error(rel + ': goldForDiagnoses dışında fark çıktı, yazılmadı'); }
    fs.renameSync(tmp, file);
  }
}
const dropped = Object.entries(report).filter(([, p]) => !p).map(([id]) => id);
console.log(`${dry ? '(kuru) ' : ''}değişen liste: ${changed} | eşlenen: ${Object.entries(report).filter(([, p]) => p).length} | düşürülen (karşılığı yok): ${dropped.length}`);
console.log('düşürülenler:', dropped.join(', ') || '-');
