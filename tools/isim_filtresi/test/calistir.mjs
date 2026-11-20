// PsikoVaka — isim filtresi testi
//   node tools/isim_filtresi/test/calistir.mjs           JS: derlem (engellenmeli %100, izinli 0 yanlış pozitif)
//   node tools/isim_filtresi/test/calistir.mjs --sql     + aynı derlemi SQL fonksiyonundan geçirip JS ile karşılaştırır
//                                                        (PGlite; supabase/tests içinde `npm install` gerekli; DATABASE_URL
//                                                        verilirse o boş test veritabanı kullanılır — ASLA canlı proje değil)
// Eşleşen sözcükler yazdırılmaz; başarısız girdiler yalnızca satır numarası/türev türüyle bildirilir
// (--goster ile girdinin kendisi de yazılır, yalnızca yerel hata ayıklama için).
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const KOK = path.resolve(here, '..', '..', '..');
const require = createRequire(import.meta.url);
const uret = require('../uret.js');
const GOSTER = process.argv.includes('--goster');

let gecti = 0, kaldi = 0;
const ok = (c, ad) => { if (c) gecti++; else { kaldi++; console.log('  FAIL ' + ad); } };

// 0. istemci dosyası güncel mi
const { veri, hatalar } = uret.derle();
ok(hatalar.length === 0, 'liste.json hatasız');
ok(readFileSync(path.join(KOK, 'js/isim_filtresi.js'), 'utf8') === uret.istemciMetni(veri), 'js/isim_filtresi.js güncel (node tools/isim_filtresi/uret.js)');
const F = require(path.join(KOK, 'js/isim_filtresi.js'));
console.log('Liste: ' + uret.sayilar(veri));

// 1. derlem
const satirlar = (f) => readFileSync(path.join(here, f), 'utf8').split('\n').map((s) => s.replace(/\r$/, '')).filter((s) => s.trim() && !s.startsWith('#'));
const LEET = { a: '4', e: '3', i: '1', o: '0', s: '5', t: '7' };
const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1);
function turevler(satir) {
    if (satir.startsWith('=')) return [['aynen', satir.slice(1)]];
    const kelime = satir.startsWith('k:');
    const w = kelime ? satir.slice(2) : satir;
    const leet = [...w].map((c) => LEET[c] || c).join('');
    const ilkSesli = w.replace(/[aeio]/, (c) => LEET[c]);
    const tekrar = w.length > 2 ? w.slice(0, 2) + w[2].repeat(3) + w.slice(3) : w + w.slice(-1).repeat(3);
    const ikiz = [...w].map((c) => c + c).join('');
    const t = [
        ['aynen', w], ['Bas', cap(w)], ['BUYUK', w.toUpperCase()], ['leet', leet], ['leet-kismi', ilkSesli],
        ['tekrar', tekrar], ['ikiz', ikiz], ['nokta', [...w].join('.')], ['tire', [...w].join('-')], ['bosluk', [...w].join(' ')],
        ['GomuCamel', 'Ali' + cap(w) + '34'], ['GomuCamel2', cap(w) + 'Kral'], ['GomuAlt', 'ali_' + w], ['GomuAlt2', w + '_34'],
        ['GomuBosluk', 'Dr ' + cap(w)], ['GomuLeet', kelime ? 'Ali_' + leet : 'Ali' + cap(leet)], ['BUYUK_alt', 'ALI_' + w.toUpperCase()]
    ];
    if (!kelime) {
        t.push(['GomuBitisik', 'ali' + w + '34'], ['GomuBitisik2', 'xx' + w + 'xx'], ['ek-ler', w + 'ler'], ['ek-ci', w + 'cı'],
            ['ek-lik', w + 'lık'], ['ek-im', w + 'im'], ['Turkce', w.replace(/s/g, 'ş').replace(/i/g, 'ı')]);
    }
    return t;
}
const engel = satirlar('engellenmeli.txt');
let engelSay = 0;
const tumGirdiler = [];
engel.forEach((s, i) => {
    for (const [tur, g] of turevler(s)) {
        engelSay++;
        tumGirdiler.push(g);
        const r = F.check(g);
        if (r.ok) { kaldi++; console.log(`  FAIL engellenmedi: engellenmeli.txt satır-sırası ${i + 1}, türev ${tur}${GOSTER ? ' — ' + g : ''}`); }
        else gecti++;
    }
});
const izin = satirlar('izinli.txt');
let yp = 0;
izin.forEach((s, i) => {
    tumGirdiler.push(s);
    const r = F.check(s);
    if (!r.ok) { yp++; kaldi++; console.log(`  FAIL yanlış pozitif: izinli.txt satır-sırası ${i + 1} (${r.reason})${GOSTER ? ' — ' + s : ''}`); }
    else gecti++;
});
console.log(`Derlem: engellenmeli ${engel.length} satır / ${engelSay} türev; izinli ${izin.length} ad; yanlış pozitif ${yp}`);
ok(F.check('Klinisyen').ok && F.check('Oyuncu').ok, "varsayılan adlar ('Klinisyen', 'Oyuncu') geçer");
ok(F.check('Admin').reason === 'ayrilmis' && F.check('Siktir').reason === 'uygunsuz', 'reason kodları');
ok(!('kategori' in (globalThis.PsikoVakaIsimFiltresi || {})), 'tarayıcı API yalnızca check/surum verir');

// 2. SQL eşliği
if (process.argv.includes('--sql')) {
    // ek rastgele girdiler: normalleştirme kenarları
    let tohum = 12345;
    const rnd = (n) => { tohum = (tohum * 1103515245 + 12345) & 0x7fffffff; return tohum % n; };
    const parca = ['a', 'm', 'k', 's', 'i', 'ı', 'İ', 'ş', 'Ş', 'ğ', 'ç', 'ö', 'ü', 'A', 'M', 'K', '1', '3', '4', '0', '5', '@', '$', '!', '_', '.', ' ', '-',
        'о', 'а', 'е', '​', 'ﬁ', 'Ａ', 'é', 'ß', 'ama', 'amca', 'sik', 'ke', 'got', 'ür', 'or', 'os', 'pu', 'yar', 'rak', 'fu', 'ck', 'ass', 'Cl', 'ass', 'ali', 'Veli', '31'];
    for (let n = 0; n < 1500; n++) {
        let s = ''; const L = 1 + rnd(8);
        for (let j = 0; j < L; j++) s += parca[rnd(parca.length)];
        tumGirdiler.push(s);
    }
    const db = await baglan();
    const read = (p) => readFileSync(path.join(KOK, 'supabase', p), 'utf8');
    await db.exec(read('tests/00_supabase_stubs.sql'));
    const migs = readdirSync(path.join(KOK, 'supabase/migrations')).filter((f) => /^\d{4}_.*\.sql$/.test(f)).sort();
    for (const m of migs) await db.exec(read('migrations/' + m));
    // tablo = liste.json
    const tab = (await db.query(`select tur, kip, terim, desen, ek from public.isim_filtresi_terimleri where tur <> 'beyaz' order by sira`)).rows;
    const bek = veri.terimler.map((t) => ({ tur: t.tur, kip: t.kip, terim: t.terim, desen: t.desen, ek: t.ek }));
    ok(JSON.stringify(tab) === JSON.stringify(bek), 'sunucu terim tablosu = liste.json (yeni veri migration\'ı gerekebilir: uret.js --yeni-migration)');
    const bey = (await db.query(`select desen from public.isim_filtresi_terimleri where tur = 'beyaz' order by sira`)).rows.map((r) => r.desen);
    ok(JSON.stringify(bey) === JSON.stringify(veri.beyaz), 'sunucu beyaz listesi = liste.json');
    let fark = 0;
    const t0 = Date.now();
    const benzersiz = [...new Set(tumGirdiler)];
    for (let i = 0; i < benzersiz.length; i += 200) {
        const dilim = benzersiz.slice(i, i + 200);
        const r = (await db.query(`select x, public.isim_kontrol_ayrinti(x) as k from unnest($1::text[]) x`, [dilim])).rows;
        r.forEach((row) => {
            const js = F.kategori(row.x);
            if ((js || null) !== (row.k || null)) { fark++; if (fark <= 20) console.log(`  FAIL SQL≠JS: ${GOSTER ? JSON.stringify(row.x) : '(girdi gizli)'} js=${js} sql=${row.k}`); }
        });
    }
    console.log(`SQL eşliği: ${benzersiz.length} girdi, ${fark} fark, ${Date.now() - t0} ms`);
    ok(fark === 0, 'SQL ve JS her girdide aynı kategoriyi veriyor');
    await db.close();
}

console.log(`\nSonuç: ${gecti} geçti, ${kaldi} kaldı`);
process.exit(kaldi ? 1 : 0);

async function baglan() {
    const req = createRequire(path.join(KOK, 'supabase/tests/package.json'));
    if (process.env.DATABASE_URL) {
        const pg = req('pg');
        const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
        await c.connect();
        return { exec: (s) => c.query(s), query: (s, p) => c.query(s, p), close: () => c.end() };
    }
    const { PGlite } = await import(req.resolve('@electric-sql/pglite'));
    const d = new PGlite();
    return { exec: (s) => d.exec(s), query: (s, p) => d.query(s, p), close: () => d.close() };
}
