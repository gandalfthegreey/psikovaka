#!/usr/bin/env node
/**
 * Yeni vakalardan sonra TEK yayın komutu (Gemini bunu çalıştırır). Claude ajan Y, 2026-11-20.
 *
 * Kullanım (proje kökünden):
 *   node tools/vaka_ekle/yayinla.js --mesaj "Yeni vakalar: 3 vaka (case-151 - case-153)"
 *   node tools/vaka_ekle/yayinla.js --mesaj "..." --kuru     # deneme: deploy_to_github.js --dry-run (git'e hiçbir şey yazılmaz)
 *
 * Sırayla:
 *  1. AI_ISBIRLIGI.md "Şu An Üzerinde Çalışılanlar" tablosunda Gemini dışında bir satır varsa DURUR
 *     (başka bir asistan dosyalarda çalışıyor; yarım işi yayınlamamak için).
 *  2. Doğrulayıcılar: tools/vaka_ekle/dogrula.js --mevcut, tools/icerik/tani_temizligi/dogrula.js,
 *     tools/icerik/vaka_aciklamalari/dogrula.js. Biri hata verirse DURUR.
 *  3. Bu yayına vakalar dışında hangi değişen dosyaların gireceğini listeler (bilgi için).
 *  4. node deploy_to_github.js --message="<mesaj>" --non-interactive  (derleme + cevap anahtarı + commit + push).
 *     Hiçbir soru sormaz; giriş bilgisi gerekirse, GitHub'da yeni commit varsa ya da ağ yanıt vermezse hata verir.
 *  5. Sonucu ve kontrol edilecek adresleri yazar. Çıkış kodu: başarı 0, aksi 1.
 * Yalnızca Node kullanır; komutlar argüman dizisiyle çalışır (Windows'ta tırnak sorunu olmaz).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const o = require('./ortak.js');

const argv = process.argv.slice(2);
const ROOT = o.rootFromArgs(argv);
const KURU = argv.includes('--kuru');
const SITE_URL = 'https://gandalfthegreey.github.io/psikovaka/';
const ACTIONS_URL = 'https://github.com/gandalfthegreey/psikovaka/actions';

function getArg(name) {
    const eq = argv.find(a => a.startsWith(`${name}=`));
    if (eq) return eq.slice(name.length + 1);
    const i = argv.indexOf(name);
    return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : '';
}
const MESAJ = (getArg('--mesaj') || 'Yeni vakalar').replace(/[\r\n]+/g, ' ').trim().slice(0, 200);

function stop(lines) {
    console.error('\n❌ YAYIN YAPILMADI.\n   ' + [].concat(lines).join('\n   '));
    process.exit(1);
}

// 1. çalışma tablosu
function otherRows() {
    const p = path.join(ROOT, 'AI_ISBIRLIGI.md');
    if (!fs.existsSync(p)) return { missing: true, rows: [] };
    const s = fs.readFileSync(p, 'utf8');
    const start = s.indexOf('## Şu An Üzerinde Çalışılanlar');
    if (start < 0) return { missing: true, rows: [] };
    const rest = s.slice(start + 5);
    const end = rest.search(/\n## /);
    const section = end >= 0 ? rest.slice(0, end) : rest;
    const rows = section.split('\n').map(l => l.trim()).filter(l => l.startsWith('|'))
        .filter(l => !/^\|\s*-{3,}/.test(l) && !/^\|\s*Asistan\s*\|/i.test(l))
        .filter(l => l.replace(/[|\s]/g, '').length > 0);
    return { missing: false, rows: rows.filter(l => !/^\|\s*[^|]*gemini/i.test(l)) };
}

function runNode(args, label) {
    const r = spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8', windowsHide: true, maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
    const out = `${r.stdout || ''}${r.stderr || ''}`.trim();
    const ok = !r.error && r.status === 0;
    console.log(`${ok ? '✓' : '✗'} ${label}: ${out.split('\n').pop()}`);
    if (!ok) console.log(out.split('\n').slice(-25).join('\n'));
    return ok;
}

console.log('==============================================================');
console.log(`PsikoVaka yayın (vaka hattı)${KURU ? ' — DENEME (--kuru): git\'e hiçbir şey yazılmaz' : ''}`);
console.log(`Commit mesajı: ${MESAJ}`);
console.log('==============================================================');

const t = otherRows();
if (t.missing) stop('AI_ISBIRLIGI.md ya da içindeki "Şu An Üzerinde Çalışılanlar" tablosu bulunamadı. Emre\'ye haber ver.');
if (t.rows.length) {
    stop(['AI_ISBIRLIGI.md çalışma tablosunda başka bir asistanın satırı var:', ...t.rows.map(r => '  ' + r),
        'Başka bir asistan şu an dosyalarda çalışıyor; yayınlamak onun yarım işini de canlıya gönderebilir.',
        'Ne yapmalı: Emre\'ye bunu söyle ve o asistan bitip satırını silince bu komutu tekrar çalıştır.',
        'Vakaların js/cases.js içinde duruyor; bir şey kaybolmadı.']);
}
console.log('✓ Çalışma tablosu: başka asistan yok.');

const checks = [
    [[path.join('tools', 'vaka_ekle', 'dogrula.js'), '--mevcut'], 'Vaka yapı denetimi'],
    [[path.join('tools', 'icerik', 'tani_temizligi', 'dogrula.js')], 'Tanı/vaka tutarlılığı'],
    [[path.join('tools', 'icerik', 'vaka_aciklamalari', 'dogrula.js')], 'Vaka açıklamaları']
];
for (const [args, label] of checks) {
    if (!fs.existsSync(path.join(ROOT, args[0]))) stop(`${args[0]} bulunamadı.`);
    if (!runNode(args, label)) stop([`${label} başarısız. Ayrıntı yukarıda. Hiçbir şey gönderilmedi.`, 'VAKA_URETIMI.md "Sorun çıkarsa" bölümüne bak.']);
}

// 3. bu yayına girecek diğer değişiklikler (bilgi)
const st = spawnSync('git', ['status', '--porcelain', '--untracked-files=all'], { cwd: ROOT, encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' } });
if (!st.error && st.status === 0) {
    const mine = /^(js\/cases\.js|PsikoVaka_Tam_Surum\.html|supabase\/seed\/0002_cases_answer_key\.sql|AI_ISBIRLIGI\.md|tools\/vaka_ekle\/taslaklar\/.*)$/;
    const files = st.stdout.split('\n').map(l => l.slice(3).trim().replace(/^"|"$/g, '')).filter(Boolean);
    const others = files.filter(f => !mine.test(f) && !f.startsWith('_arsiv/'));
    if (others.length) {
        console.log(`ℹ️  Bu yayına vaka dışı ${others.length} değişen dosya da girecek (başka asistanların bitmiş işi olabilir):`);
        others.slice(0, 30).forEach(f => console.log('     ' + f));
        if (others.length > 30) console.log(`     … ve ${others.length - 30} dosya daha`);
        console.log('   Bunları Emre\'ye verdiğin raporda tek satırla belirt.');
    }
}

// 4. yayın
const deployArgs = ['deploy_to_github.js', `--message=${MESAJ}`, '--non-interactive', ...(KURU ? ['--dry-run'] : [])];
console.log(`\n→ node ${deployArgs.map(a => (/\s/.test(a) ? JSON.stringify(a) : a)).join(' ')}\n`);
const d = spawnSync(process.execPath, deployArgs, { cwd: ROOT, stdio: ['ignore', 'inherit', 'inherit'], windowsHide: true, timeout: 20 * 60 * 1000 });
if (d.error || d.status !== 0) {
    stop([`deploy_to_github.js başarısız oldu (çıkış ${d.error ? d.error.code || d.error.message : d.status}). Nedeni yukarıdaki ❌ satırında.`,
        'Sık nedenler: GitHub\'da bu bilgisayarda olmayan commit var · GitHub girişi gerekiyor · internet yok.',
        'Ne yapılacağı VAKA_URETIMI.md "Sorun çıkarsa" bölümünde. Vakalar js/cases.js içinde duruyor; kaybolmadı.']);
}
if (KURU) {
    console.log('\n✅ DENEME BAŞARILI: doğrulama, derleme ve cevap anahtarı adımları çalıştı; git\'e hiçbir şey yazılmadı.');
} else {
    console.log('\n✅ YAYINLANDI.');
    console.log(`   Site (1-2 dakika içinde yenilenir): ${SITE_URL}`);
    console.log(`   GitHub Actions (yeşil tik = cevap anahtarı/migration Supabase'e uygulandı): ${ACTIONS_URL}`);
}
