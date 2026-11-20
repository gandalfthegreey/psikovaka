#!/usr/bin/env node
/**
 * PsikoVaka — isim filtresi üreticisi. Tek kaynak: tools/isim_filtresi/liste.json
 *
 *   node tools/isim_filtresi/uret.js                  js/isim_filtresi.js dosyasını yeniden yazar (istemci)
 *   node tools/isim_filtresi/uret.js --kontrol        js/isim_filtresi.js güncel mi? (değilse çıkış kodu 1)
 *   node tools/isim_filtresi/uret.js --yeni-migration supabase/migrations/ altına YALNIZCA VERİ içeren yeni
 *                                                     migration yazar (sıradaki numara; terimleri değiştirir,
 *                                                     kayıtlı profilleri yeniden tarar) + istemci dosyası
 *   node tools/isim_filtresi/uret.js --sql-veri       veri SQL'ini stdout'a yazar (0005 bu çıktıyı içerir)
 *
 * Kelimeler hiçbir zaman ekrana yazdırılmaz; yalnızca sayılar.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const KOK = path.resolve(__dirname, '..', '..');
const LISTE = path.join(__dirname, 'liste.json');
const CEKIRDEK = path.join(__dirname, 'cekirdek.js');
const ISTEMCI = path.join(KOK, 'js', 'isim_filtresi.js');
const MIG_DIR = path.join(KOK, 'supabase', 'migrations');

function cekirdekYukle() {
    const src = fs.readFileSync(CEKIRDEK, 'utf8');
    // eslint-disable-next-line no-new-func
    return { src, olustur: new Function(src + '\nreturn psikoVakaIsimFiltresiOlustur;')() };
}

/** Harf tekrarına izin veren desen: siktir -> s+i+k+t+i+r+, yarrak -> y+a+r{2,}a+k+ */
function desen(lit) {
    let out = '';
    for (let i = 0; i < lit.length;) {
        let j = i;
        while (j < lit.length && lit[j] === lit[i]) j++;
        out += lit[i] + (j - i >= 2 ? '{2,}' : '+');
        i = j;
    }
    return out;
}

function derle() {
    const L = JSON.parse(fs.readFileSync(LISTE, 'utf8'));
    const { olustur } = cekirdekYukle();
    const H = L.harita;
    const bos = olustur({ surum: 0, gorunmez: H.gorunmez, benzer: H.benzer, leet: H.leet, terimler: [], beyaz: [] });
    const hatalar = [];
    const norm = (k, yer) => {
        const n = bos.onIsle(String(k)).replace(/[^a-z]/g, '');
        if (!n) hatalar.push(`${yer}: normalleştirince boş kalan girdi`);
        if (/[0-9]/.test(String(k))) hatalar.push(`${yer}: rakam içeren girdi (harflerle yaz; leet zaten çevrilir)`);
        return n;
    };
    const ekDesen = {};
    for (const [ad, liste] of Object.entries(L.ek_takimlari)) {
        ekDesen[ad] = [...new Set(liste.map((e) => norm(e, `ek ${ad}`)).filter(Boolean))].map(desen).join('|');
    }
    const terimler = [];
    const gorulen = new Set();
    const KIPLER = ['alt', 'kelime', 'kelime_ek', 'bas', 'son', 'tam'];
    const bolumler = [['turkce', 'tr'], ['kaliplar', 'kalip'], ['ingilizce', 'en'], ['ayrilmis', 'ayrilmis']];
    for (const [bolum, tur] of bolumler) {
        (L[bolum] || []).forEach((g, i) => {
            const yer = `${bolum}[${i}]`;
            const kip = g.m || 'alt';
            if (!KIPLER.includes(kip)) { hatalar.push(`${yer}: bilinmeyen kip`); return; }
            if (kip === 'tam' && tur !== 'ayrilmis') hatalar.push(`${yer}: 'tam' yalnızca ayrılmış adlar için`);
            const terim = norm(g.k, yer);
            if (!terim) return;
            if (kip === 'alt' && terim.length < 4) hatalar.push(`${yer}: 'alt' kipinde en az 4 harf olmalı (kısa kökler kelime/bas/son ile)`);
            let ek = '';
            if (kip === 'kelime' || kip === 'kelime_ek') {
                if (g.ekler) {
                    if (!ekDesen[g.ekler]) hatalar.push(`${yer}: bilinmeyen ek takımı`);
                    ek = ekDesen[g.ekler] || '';
                }
                if (kip === 'kelime_ek' && !ek) hatalar.push(`${yer}: kelime_ek için ek takımı gerekli`);
            } else if (g.ekler) hatalar.push(`${yer}: ekler yalnızca kelime/kelime_ek kipinde`);
            const anahtar = [tur, kip, terim, ek].join('\u0001');
            if (gorulen.has(anahtar)) return;
            gorulen.add(anahtar);
            terimler.push({ tur, kip, terim, desen: desen(terim), ek });
        });
    }
    const beyazLit = [...new Set(L.beyaz_liste.map((w, i) => norm(w, `beyaz_liste[${i}]`)).filter(Boolean))].sort();
    const veri = {
        surum: L.surum,
        gorunmez: H.gorunmez,
        benzer: H.benzer,
        leet: H.leet,
        terimler,
        beyaz: beyazLit.map(desen),
        beyazTerim: beyazLit
    };
    return { veri, hatalar, L };
}

function istemciMetni(veri) {
    const { src } = cekirdekYukle();
    const kucuk = {
        surum: veri.surum, gorunmez: veri.gorunmez, benzer: veri.benzer, leet: veri.leet,
        terimler: veri.terimler.map((t) => ({ tur: t.tur, kip: t.kip, desen: t.desen, ek: t.ek })),
        beyaz: veri.beyaz
    };
    return `/* OTOMATİK ÜRETİLDİ — elle düzenleme. Kaynak: tools/isim_filtresi/liste.json + cekirdek.js
 * Yeniden üret: node tools/isim_filtresi/uret.js   (sunucu: --yeni-migration)
 * Kullanım: PsikoVakaIsimFiltresi.check(metin) -> { ok, reason: null | 'uygunsuz' | 'ayrilmis' }
 * Sunucu aynı kuralları uygular (public.isim_kontrol_ayrinti); burası yalnızca anında geri bildirim içindir.
 */
(function (global) {
    'use strict';
${src.replace(/^/gm, '    ').replace(/[ ]+$/gm, '')}
    var VERI = ${JSON.stringify(kucuk)};
    var f = psikoVakaIsimFiltresiOlustur(VERI);
    var api = { check: f.check, surum: f.surum };
    if (typeof module !== 'undefined' && module.exports) module.exports = { check: f.check, kategori: f.kategori, varyantlar: f.varyantlar, surum: f.surum };
    if (global) global.PsikoVakaIsimFiltresi = api;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
`;
}

const lit = (s) => (s == null ? 'null' : "'" + String(s).replace(/'/g, "''") + "'");

function sqlVeri(veri) {
    const satir = [];
    satir.push('-- <<isim_filtresi_veri>> (tools/isim_filtresi/uret.js üretti; elle düzenleme)');
    satir.push('delete from public.isim_filtresi_terimleri;');
    satir.push('delete from public.isim_filtresi_harita;');
    const terim = veri.terimler.map((t, i) => `  (${i + 1}, ${lit(t.tur)}, ${lit(t.kip)}, ${lit(t.terim)}, ${lit(t.desen)}, ${lit(t.ek)})`);
    veri.beyazTerim.forEach((b, i) => terim.push(`  (${veri.terimler.length + i + 1}, 'beyaz', 'alt', ${lit(b)}, ${lit(veri.beyaz[i])}, '')`));
    satir.push('insert into public.isim_filtresi_terimleri (sira, tur, kip, terim, desen, ek) values');
    satir.push(terim.join(',\n') + ';');
    const har = [];
    Array.from(veri.gorunmez).forEach((c) => har.push(`  ('gorunmez', chr(${c.codePointAt(0)}), '')`));
    Object.entries(veri.benzer).forEach(([k, v]) => har.push(`  ('benzer', chr(${k.codePointAt(0)}), ${lit(v)})`));
    Object.entries(veri.leet).forEach(([k, v]) => har.push(`  ('leet', chr(${k.codePointAt(0)}), ${lit(v)})`));
    satir.push('insert into public.isim_filtresi_harita (tur, kaynak, hedef) values');
    satir.push(har.join(',\n') + ';');
    satir.push(`update public.isim_filtresi_surum set surum = ${Number(veri.surum) || 0}, guncellendi = now() where id = 1;`);
    satir.push('-- <</isim_filtresi_veri>>');
    return satir.join('\n') + '\n';
}

function sayilar(veri) {
    const say = {};
    veri.terimler.forEach((t) => { say[t.tur] = (say[t.tur] || 0) + 1; });
    return `terim: tr ${say.tr || 0}, kalip ${say.kalip || 0}, en ${say.en || 0}, ayrilmis ${say.ayrilmis || 0}; beyaz liste ${veri.beyaz.length}`;
}

function main() {
    const arg = process.argv.slice(2);
    const { veri, hatalar } = derle();
    if (hatalar.length) {
        console.error('liste.json hataları:\n  ' + hatalar.join('\n  '));
        process.exit(1);
    }
    const metin = istemciMetni(veri);
    if (arg.includes('--sql-veri')) { process.stdout.write(sqlVeri(veri)); return; }
    if (arg.includes('--kontrol')) {
        const var_ = fs.existsSync(ISTEMCI) ? fs.readFileSync(ISTEMCI, 'utf8') : '';
        if (var_ !== metin) { console.error('js/isim_filtresi.js güncel değil: node tools/isim_filtresi/uret.js'); process.exit(1); }
        console.log('js/isim_filtresi.js güncel. ' + sayilar(veri));
        return;
    }
    fs.writeFileSync(ISTEMCI, metin);
    console.log('yazıldı: js/isim_filtresi.js — ' + sayilar(veri));
    if (arg.includes('--yeni-migration')) {
        const mevcut = fs.readdirSync(MIG_DIR).filter((f) => /^\d{4}_[A-Za-z0-9_]+\.sql$/.test(f)).sort();
        const son = mevcut.length ? parseInt(mevcut[mevcut.length - 1].slice(0, 4), 10) : 0;
        if (son < 5) { console.error('0005_isim_filtresi.sql yok; önce o uygulanmalı.'); process.exit(1); }
        const no = String(son + 1).padStart(4, '0');
        const ad = `${no}_isim_filtresi_veri.sql`;
        const govde = `-- PsikoVaka — ${no}: isim filtresi listesi güncellemesi (YALNIZCA VERİ; tools/isim_filtresi/uret.js --yeni-migration üretti)
-- Fonksiyonlar 0005_isim_filtresi.sql'de. Bu dosya terim tablosunu liste.json'a eşitler, sonra kayıtlı profilleri
-- yeniden tarar: yeni listeye takılan kullanıcı adı/görünen ad needs_rename = true olur (sıralamalarda gizlenir,
-- sonraki girişte yeni ad seçer). Tekrar çalıştırmak zararsızdır.
begin;
${sqlVeri(veri)}do $$
declare n integer;
begin
  perform public._isim_filtresi_derle();
  n := public._isim_filtresi_tara();
  raise notice 'isim filtresi: % profil yeniden ad seçmeye işaretlendi', n;
end $$;
commit;
`;
        fs.writeFileSync(path.join(MIG_DIR, ad), govde);
        console.log('yazıldı: supabase/migrations/' + ad + ' (yayınlanınca canlı veritabanına uygulanır)');
    }
}

if (require.main === module) main();
module.exports = { derle, desen, istemciMetni, sqlVeri, sayilar };
