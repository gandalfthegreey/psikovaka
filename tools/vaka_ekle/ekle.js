#!/usr/bin/env node
/**
 * Doğrulanmış yeni vakaları js/cases.js'in sonuna ekler (Claude ajan Y, 2026-11-20).
 *
 * Kullanım (proje kökünden):
 *   node tools/vaka_ekle/ekle.js tools/vaka_ekle/taslaklar/2026-11-20_3.json          # ekler
 *   node tools/vaka_ekle/ekle.js tools/vaka_ekle/taslaklar/2026-11-20_3.json --kuru   # yalnızca ne olacağını yazar
 *   --kok <dizin>   başka bir proje kopyasında çalışır (testler için)
 *
 * Sırayla:
 *  1. dogrula.js kurallarını uygular; TEK BİR HATA bile varsa hiçbir şey yazmaz (çıkış 1).
 *  2. id/caseNumber'ı sıradaki boş numaradan (aktif + arşivlenmiş vakaların en büyüğü + 1) sırayla atar,
 *     pharmacologyId yoksa resolvePharmacologyIdForCase ile çözer.
 *  3. js/cases.js'in yedeğini _arsiv/vaka_ekle_yedek/<zaman>/ altına alır.
 *  4. Yeni içeriği derleyiciyle (build_portable_single_file.js) birebir aynı biçimde geçici dosyaya yazar, require ile
 *     yükleyip sayıları ve alanları denetler, bu arada js/cases.js değişmişse durur, sonra geçici dosyayı yerine taşır.
 *  5. node tools/icerik/tani_temizligi/dogrula.js, node tools/icerik/vaka_aciklamalari/dogrula.js ve
 *     node build_portable_single_file.js çalıştırır. Biri hata verirse js/cases.js'i yedekten geri yükler (çıkış 1).
 * Aynı içerikli bir vaka zaten varsa (içerik özeti eşleşirse) eklemeyi reddeder: iki kez çalıştırmak çoğaltmaz.
 * Hiçbir dosya silinmez (geçici dosyalar da yedek klasörüne taşınır). Windows'ta da çalışır (yalnızca Node).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const o = require('./ortak.js');
const v = require('./dogrula.js');

const argv = process.argv.slice(2);
const DRY = argv.includes('--kuru');
const ROOT = o.rootFromArgs(argv);
const kokIdx = argv.indexOf('--kok');
const file = argv.find((a, i) => !a.startsWith('--') && !(kokIdx >= 0 && i === kokIdx + 1));
const CASES = path.join(ROOT, 'js', 'cases.js');
const BUILD_OUT = path.join(ROOT, 'PsikoVaka_Tam_Surum.html');

function die(lines, code = 1) {
    console.error('\n❌ ' + [].concat(lines).join('\n   '));
    process.exit(code);
}

function runNode(rel, label) {
    const r = spawnSync(process.execPath, [path.join(ROOT, rel)], { cwd: ROOT, encoding: 'utf8', windowsHide: true, maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
    const outText = `${r.stdout || ''}${r.stderr || ''}`;
    const tail = outText.trim().split('\n').slice(-12).join('\n');
    return { ok: !r.error && r.status === 0, status: r.error ? -1 : r.status, out: outText, tail, label };
}

if (!file) die('Kullanım: node tools/vaka_ekle/ekle.js <yeni_vakalar.json> [--kuru]', 2);

// 1. oku + doğrula
let list;
try { list = v.readBatchFile(path.resolve(file)); } catch (e) { die(`${file} okunamadı ya da geçerli JSON değil: ${e.message}`); }
const srcBefore = fs.readFileSync(CASES, 'utf8');
const data = o.loadData(ROOT);
const res = v.validateBatch(list, data);
v.printReport(res, { title: `Doğrulama: ${file}` });
if (res.errorCount) die([`${res.errorCount} hata var: HİÇBİR ŞEY EKLENMEDİ.`, `Hataları düzelt, sonra: node tools/vaka_ekle/dogrula.js ${file}`]);

// 2. numara ata
const newCases = list.map((c, i) => {
    const r = res.results[i];
    const full = { ...c, id: r.id, caseNumber: r.number, pharmacologyId: c.pharmacologyId || r.pharmacologyId };
    return o.orderFields(full);
});
const all = [...data.cases, ...newCases];
console.log(`\nEklenecek ${newCases.length} vaka (${newCases[0].id} … ${newCases[newCases.length - 1].id}):`);
newCases.forEach(c => console.log(`  + ${c.id}  ${c.diagnosisId}  [${c.course}, ${c.difficulty}]  "${c.patientSummary}"  ter=${c.therapyId} ilaç=${c.pharmacologyId}`));
console.log(`js/cases.js: ${data.cases.length} → ${all.length} vaka.`);

if (DRY) {
    console.log('\n--kuru: hiçbir dosya yazılmadı. Gerçek ekleme yapılsaydı sırayla:');
    console.log('  yedek → _arsiv/vaka_ekle_yedek/<zaman>/, js/cases.js atomik yazım, tani_temizligi/dogrula.js, vaka_aciklamalari/dogrula.js, build_portable_single_file.js');
    process.exit(0);
}

// 3. yedek
const backupDir = path.join(ROOT, '_arsiv', 'vaka_ekle_yedek', o.timestamp());
fs.mkdirSync(backupDir, { recursive: true });
fs.writeFileSync(path.join(backupDir, 'cases.js'), srcBefore, 'utf8');
if (fs.existsSync(BUILD_OUT)) fs.copyFileSync(BUILD_OUT, path.join(backupDir, 'PsikoVaka_Tam_Surum.html'));
fs.copyFileSync(path.resolve(file), path.join(backupDir, path.basename(file)));
console.log(`\nYedek: ${path.relative(ROOT, backupDir)}`);

function restore(reason) {
    const tmp = `${CASES}.geri-${process.pid}`;
    fs.writeFileSync(tmp, srcBefore, 'utf8');
    fs.renameSync(tmp, CASES);
    if (fs.existsSync(path.join(backupDir, 'PsikoVaka_Tam_Surum.html'))) fs.copyFileSync(path.join(backupDir, 'PsikoVaka_Tam_Surum.html'), BUILD_OUT);
    die([reason, 'js/cases.js (ve PsikoVaka_Tam_Surum.html) yedekten GERİ YÜKLENDİ; vakalar EKLENMEDİ.', `Yedek klasörü: ${path.relative(ROOT, backupDir)}`]);
}

// 4. geçici dosya → yükle → denetle → değişmedi mi → taşı
const out = o.renderCasesJs(srcBefore, data.courses, all);
const tmp = path.join(path.dirname(CASES), `cases.js.yeni-${process.pid}.js`);
fs.writeFileSync(tmp, out, 'utf8');
const park = why => { try { fs.renameSync(tmp, path.join(backupDir, 'cases.js.reddedilen')); } catch (e) { /* yoksay */ } die(why); };
let loaded;
try { loaded = o.freshRequire(tmp); } catch (e) { park(`Yeni js/cases.js yüklenemedi: ${e.message}. js/cases.js DEĞİŞTİRİLMEDİ.`); }
const problems = [];
if (!loaded || !Array.isArray(loaded.CLINICAL_CASES) || !loaded.COURSE_CATEGORIES) problems.push('dışa aktarımlar eksik');
else {
    if (loaded.CLINICAL_CASES.length !== all.length) problems.push(`vaka sayısı ${loaded.CLINICAL_CASES.length}, beklenen ${all.length}`);
    if (JSON.stringify(loaded.COURSE_CATEGORIES) !== JSON.stringify(data.courses)) problems.push('COURSE_CATEGORIES değişti');
    data.cases.forEach((c, i) => { if (JSON.stringify(loaded.CLINICAL_CASES[i]) !== JSON.stringify(c)) problems.push(`mevcut vaka değişti: ${c.id}`); });
    newCases.forEach((c, i) => { if (JSON.stringify(loaded.CLINICAL_CASES[data.cases.length + i]) !== JSON.stringify(c)) problems.push(`yeni vaka farklı yazıldı: ${c.id}`); });
}
if (problems.length) park(`Yeni js/cases.js denetimi başarısız: ${problems.slice(0, 5).join('; ')}. js/cases.js DEĞİŞTİRİLMEDİ.`);
if (fs.readFileSync(CASES, 'utf8') !== srcBefore) park('js/cases.js bu betik çalışırken başka biri tarafından değiştirildi. Hiçbir şey yazılmadı; AI_ISBIRLIGI.md tablosuna bak ve tekrar dene.');
try { fs.renameSync(tmp, CASES); } catch (e) { park(`js/cases.js yerine yazılamadı (${e.code || e.message}); dosya bir düzenleyicide açık/kilitli olabilir. js/cases.js DEĞİŞTİRİLMEDİ.`); }
console.log(`✓ js/cases.js yazıldı (${all.length} vaka).`);

// 5. proje doğrulayıcıları + derleme
const steps = [
    ['tools/icerik/tani_temizligi/dogrula.js', 'Tanı/vaka tutarlılığı'],
    ['tools/icerik/vaka_aciklamalari/dogrula.js', 'Vaka açıklamaları'],
    ['build_portable_single_file.js', 'Derleme (tek dosya + vaka doğrulaması)']
];
for (const [rel, label] of steps) {
    if (!fs.existsSync(path.join(ROOT, rel))) restore(`${rel} bulunamadı.`);
    const r = runNode(rel, label);
    let ok = r.ok;
    if (rel === 'build_portable_single_file.js') {
        const m = /Hata:\s*(\d+)/.exec(r.out);
        if (!m || Number(m[1]) > 0 || /UYARI/.test(r.out)) ok = false;
    }
    console.log(`${ok ? '✓' : '✗'} ${label}: ${r.tail.split('\n').slice(-1)[0]}`);
    if (!ok) { console.error(r.tail); restore(`${label} başarısız (${rel}).`); }
}
// derleyici js/cases.js'i yeniden yazar; yeni vakalar hâlâ yerinde mi?
const after = o.freshRequire(CASES).CLINICAL_CASES;
const lost = newCases.filter(c => !after.some(x => x.id === c.id && x.diagnosisId === c.diagnosisId));
if (after.length !== all.length || lost.length) restore(`Derlemeden sonra js/cases.js beklenmedik: ${after.length} vaka, kayıp: ${lost.map(c => c.id).join(',')}`);

console.log(`\n✅ ${newCases.length} vaka eklendi: ${newCases.map(c => c.id).join(', ')}`);
console.log('Sıradaki adım: AI_ISBIRLIGI.md günlüğü + satırını sil, sonra node tools/vaka_ekle/yayinla.js --mesaj "Yeni vakalar: …"');
