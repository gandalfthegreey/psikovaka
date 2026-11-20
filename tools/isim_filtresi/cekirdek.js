/**
 * PsikoVaka — isim filtresi çekirdeği (kullanıcı adı ve görünen ad).
 *
 * Bu dosya TEK normalleştirme/eşleştirme uygulamasıdır. `tools/isim_filtresi/uret.js` bunu derlenmiş
 * veriyle birlikte `js/isim_filtresi.js` içine yazar; sunucudaki SQL (`public.isim_kontrol_ayrinti`)
 * aynı adımları aynı sırayla uygular ve `tools/isim_filtresi/test/calistir.mjs` ikisini aynı derlemle
 * karşılaştırır. Bir adımı burada değiştirirsen SQL'de de değiştir (0005 migration'ı, §2) ve testi çalıştır.
 *
 * Adımlar (her iki tarafta aynı):
 *  1. ilk 64 karakter; görünmez karakterler silinir
 *  2. benzer harf tablosu (Kiril/Yunan benzerleri, ı -> i, ß -> ss ...)
 *  3. Unicode NFKD + birleşen işaretlerin (U+0300–U+036F) silinmesi (ş -> s, ğ -> g, ç -> c, ö -> o, ü -> u, İ -> I)
 *  4. sözcük sınırı: "AMYalamak" -> "AM Yalamak", "AliVeli" -> "Ali Veli"
 *  5. ASCII küçük harf
 *  6. iki varyant: 'leet' (0->o 1->i 3->e 4->a 5->s 7->t 8->b 9->g @->a $->s !->i |->i €->e) ve
 *     'rakamsiz' (rakam/işaretler ayraç)
 *  7. [a-z] dışı her şey ayraç; sözcükler = ayraçlar arası parçalar; bütün = sözcüklerin birleşimi
 * Eşleştirme: her terim, harf tekrarlarını kabul eden bir desendir (siktir -> s+i+k+t+i+r+; kökte çift
 * harf varsa o harf en az iki kez: yarrak -> y+a+r{2,}a+k+). 'alt' terimler bütünün herhangi bir yerinde,
 * 'kelime'/'kelime_ek'/'tam' bir sözcüğün (ya da bütünün) tamamında, 'bas'/'son' başında/sonunda aranır.
 * Bir eşleşme, aynı dizgedeki bir beyaz liste eşleşmesinin TAMAMEN içindeyse yok sayılır.
 */
function psikoVakaIsimFiltresiOlustur(V) {
    'use strict';
    var KATEGORI_SIRASI = ['tr', 'kalip', 'en', 'ayrilmis'];

    function harfDizisi(s) { return Array.from(String(s)); }
    var gorunmez = {};
    harfDizisi(V.gorunmez).forEach(function (c) { gorunmez[c] = true; });

    function onIsle(girdi) {
        var s = harfDizisi(girdi == null ? '' : girdi).slice(0, 64);
        var out = '';
        for (var i = 0; i < s.length; i++) {
            var c = s[i];
            if (gorunmez[c]) continue;
            out += Object.prototype.hasOwnProperty.call(V.benzer, c) ? V.benzer[c] : c;
        }
        out = out.normalize('NFKD').replace(/[̀-ͯ]/g, '');
        out = out.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2').replace(/([a-z])([A-Z])/g, '$1 $2');
        return out.replace(/[A-Z]/g, function (c) { return c.toLowerCase(); });
    }

    /** -> [{varyant, butun, sozcukler[]}] (boş varyant atlanır) */
    function varyantlar(girdi) {
        var on = onIsle(girdi);
        var sonuc = [];
        ['leet', 'rakamsiz'].forEach(function (v) {
            var t = on;
            if (v === 'leet') {
                var x = '';
                harfDizisi(t).forEach(function (c) { x += Object.prototype.hasOwnProperty.call(V.leet, c) ? V.leet[c] : c; });
                t = x;
            }
            var soz = t.split(/[^a-z]+/).filter(Boolean);
            var butun = soz.join('');
            if (butun) sonuc.push({ varyant: v, butun: butun, sozcukler: soz });
        });
        return sonuc;
    }

    function derle(d) { return { bas: new RegExp('^(?:' + d + ')'), tam: new RegExp('^(?:' + d + ')$') }; }
    var terimler = V.terimler.map(function (t) {
        var r = { tur: t.tur, kip: t.kip, re: derle(t.desen) };
        if (t.kip === 'kelime') r.kelime = new RegExp(t.ek ? '^(?:' + t.desen + ')(?:' + t.ek + '){0,2}$' : '^(?:' + t.desen + ')$');
        if (t.kip === 'kelime_ek') r.kelime = new RegExp('^(?:' + t.desen + ')(?:' + t.ek + '){1,2}$');
        return r;
    });
    var beyaz = V.beyaz.map(function (d) { return new RegExp('^(?:' + d + ')'); });

    /** dizgedeki bütün beyaz liste aralıkları [baş, son) */
    function beyazAraliklar(s) {
        var a = [];
        for (var i = 0; i < s.length; i++) {
            var k = s.slice(i);
            for (var j = 0; j < beyaz.length; j++) {
                var m = beyaz[j].exec(k);
                if (m) a.push([i, i + m[0].length]);
            }
        }
        return a;
    }
    function kapsanmis(araliklar, bas, son) {
        for (var i = 0; i < araliklar.length; i++) if (araliklar[i][0] <= bas && son <= araliklar[i][1]) return true;
        return false;
    }
    /** terimin s içindeki eşleşme aralıkları */
    function eslesmeler(t, s, butunMu) {
        var a = [], i, m;
        if (t.kip === 'alt') {
            if (!butunMu) return a;
            for (i = 0; i < s.length; i++) { m = t.re.bas.exec(s.slice(i)); if (m) a.push([i, i + m[0].length]); }
        } else if (t.kip === 'kelime' || t.kip === 'kelime_ek') {
            if (t.kelime.test(s)) a.push([0, s.length]);
        } else if (t.kip === 'tam') {
            if (t.re.tam.test(s)) a.push([0, s.length]);
        } else if (t.kip === 'bas') {
            m = t.re.bas.exec(s); if (m) a.push([0, m[0].length]);
        } else if (t.kip === 'son') {
            for (i = 0; i < s.length; i++) { if (t.re.tam.test(s.slice(i))) { a.push([i, s.length]); break; } }
        }
        return a;
    }

    /** -> null (uygun) ya da kategori: 'tr' | 'kalip' | 'en' | 'ayrilmis' */
    function kategori(girdi) {
        var vs = varyantlar(girdi);
        if (!vs.length) return null;
        var dizgeler = [];
        vs.forEach(function (v) {
            var gorulen = {};
            [v.butun].concat(v.sozcukler).forEach(function (s, idx) {
                if (gorulen[s] && idx > 0) return;
                gorulen[s] = true;
                dizgeler.push({ s: s, butun: idx === 0 });
            });
        });
        var beyazOnbellek = {};
        for (var k = 0; k < KATEGORI_SIRASI.length; k++) {
            var kat = KATEGORI_SIRASI[k];
            for (var ti = 0; ti < terimler.length; ti++) {
                var t = terimler[ti];
                if (t.tur !== kat) continue;
                for (var di = 0; di < dizgeler.length; di++) {
                    var d = dizgeler[di];
                    var es = eslesmeler(t, d.s, d.butun);
                    if (!es.length) continue;
                    var ar = beyazOnbellek[d.s] || (beyazOnbellek[d.s] = beyazAraliklar(d.s));
                    for (var e = 0; e < es.length; e++) if (!kapsanmis(ar, es[e][0], es[e][1])) return kat;
                }
            }
        }
        return null;
    }

    /** { ok, reason }  reason: 'uygunsuz' | 'ayrilmis' | null. Eşleşen sözcük hiçbir zaman döndürülmez. */
    function check(girdi) {
        var k = kategori(girdi);
        if (!k) return { ok: true, reason: null };
        return { ok: false, reason: k === 'ayrilmis' ? 'ayrilmis' : 'uygunsuz' };
    }

    return { check: check, kategori: kategori, varyantlar: varyantlar, onIsle: onIsle, surum: V.surum };
}
