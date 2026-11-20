/* OTOMATİK ÜRETİLDİ — elle düzenleme. Kaynak: tools/isim_filtresi/liste.json + cekirdek.js
 * Yeniden üret: node tools/isim_filtresi/uret.js   (sunucu: --yeni-migration)
 * Kullanım: PsikoVakaIsimFiltresi.check(metin) -> { ok, reason: null | 'uygunsuz' | 'ayrilmis' }
 * Sunucu aynı kuralları uygular (public.isim_kontrol_ayrinti); burası yalnızca anında geri bildirim içindir.
 */
(function (global) {
    'use strict';
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

    var VERI = {"surum":1,"gorunmez":"­͏᠎​‌‍‎‏⁠⁡⁢⁣⁤﻿","benzer":{"ı":"i","ß":"ss","æ":"ae","Æ":"AE","œ":"oe","Œ":"OE","ø":"o","Ø":"O","đ":"d","Đ":"D","ł":"l","Ł":"L","ħ":"h","а":"a","А":"A","в":"b","В":"B","с":"c","С":"C","е":"e","Е":"E","ё":"e","Ё":"E","н":"h","Н":"H","і":"i","І":"I","ј":"j","Ј":"J","к":"k","К":"K","м":"m","М":"M","о":"o","О":"O","р":"p","Р":"P","ѕ":"s","Ѕ":"S","т":"t","Т":"T","у":"y","У":"Y","х":"x","Х":"X","α":"a","Α":"A","β":"b","Β":"B","ε":"e","Ε":"E","ι":"i","Ι":"I","κ":"k","Κ":"K","ο":"o","Ο":"O","ρ":"p","Ρ":"P","τ":"t","Τ":"T","υ":"u","Υ":"Y","χ":"x","Χ":"X","ν":"v","Ν":"N","μ":"m","Μ":"M"},"leet":{"0":"o","1":"i","3":"e","4":"a","5":"s","7":"t","8":"b","9":"g","@":"a","$":"s","!":"i","|":"i","€":"e"},"terimler":[{"tur":"tr","kip":"alt","desen":"o+r+o+s+p+u+","ek":""},{"tur":"tr","kip":"alt","desen":"o+r+s+p+u+","ek":""},{"tur":"tr","kip":"alt","desen":"o+r+u+s+p+u+","ek":""},{"tur":"tr","kip":"alt","desen":"o+r+o+s+b+u+","ek":""},{"tur":"tr","kip":"alt","desen":"o+r+s+b+u+","ek":""},{"tur":"tr","kip":"alt","desen":"o+r+u+s+b+u+","ek":""},{"tur":"tr","kip":"alt","desen":"o+r+o+z+b+u+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+t+i+r+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+t+r+","ek":""},{"tur":"tr","kip":"alt","desen":"s+k+t+i+r+","ek":""},{"tur":"tr","kip":"alt","desen":"s+k+t+r+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+t+i+g+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+t+i+m+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+t+i+n+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+e+r+i+m+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+e+y+i+m+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+i+y+i+m+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+e+y+i+n+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+e+r+l+e+r+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+e+c+e+m+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+e+c+e+g+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+i+c+e+m+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+i+s+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+i+k+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+i+m+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+i+n+i+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+i+n+e+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+m+e+k+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+m+i+s+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k+i+l+m+i+s+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+k{2,}o+","ek":""},{"tur":"tr","kip":"kelime","desen":"s+i+k+","ek":"i+m+|i+n+|i+|e+|l+e+r+|i+k+|e+r+|e+r+i+m+|e+y+i+m+|t+i+r+|t+i+m+|t+i+|i+c+i+|i+m+e+|i+m+i+|i+n+i+|i+n+e+|s+i+n+|m+e+k+|e+c+e+m+|i+c+e+m+|i+s+|i+s+i+|i+s+m+e+|l+e+r+i+m+|k+o+|k+a+f+a+"},{"tur":"tr","kip":"alt","desen":"a+m+c+i+k+","ek":""},{"tur":"tr","kip":"alt","desen":"a+m+c+u+k+","ek":""},{"tur":"tr","kip":"alt","desen":"a+m+c+i+g+","ek":""},{"tur":"tr","kip":"alt","desen":"a+m+i+n+a+k+o+","ek":""},{"tur":"tr","kip":"alt","desen":"a+m+i+n+i+k+o+","ek":""},{"tur":"tr","kip":"alt","desen":"a+m+i+n+a+g+o+y+","ek":""},{"tur":"tr","kip":"alt","desen":"a+m+i+n+a+k+o+y+","ek":""},{"tur":"tr","kip":"alt","desen":"a+m+n+a+k+o+","ek":""},{"tur":"tr","kip":"alt","desen":"a+m+i+n+i+s+i+k+","ek":""},{"tur":"tr","kip":"alt","desen":"a+m+i+n+a+s+i+k+","ek":""},{"tur":"tr","kip":"alt","desen":"a+m+i+n+i+y+a+l+a+","ek":""},{"tur":"tr","kip":"alt","desen":"a+m+y+a+l+a+","ek":""},{"tur":"tr","kip":"alt","desen":"a+m+y+a+l+a+r+","ek":""},{"tur":"tr","kip":"alt","desen":"a+m+l+i+g+o+t+","ek":""},{"tur":"tr","kip":"kelime","desen":"a+m+","ek":"c+i+k+|c+u+k+|i+n+a+|i+n+i+|i+n+|i+|l+a+r+|c+i+"},{"tur":"tr","kip":"kelime","desen":"a+m+k+","ek":""},{"tur":"tr","kip":"bas","desen":"a+m+k+","ek":""},{"tur":"tr","kip":"son","desen":"a+m+k+","ek":""},{"tur":"tr","kip":"kelime","desen":"a+m+q+","ek":""},{"tur":"tr","kip":"bas","desen":"a+m+q+","ek":""},{"tur":"tr","kip":"son","desen":"a+m+q+","ek":""},{"tur":"tr","kip":"kelime","desen":"a+q+","ek":""},{"tur":"tr","kip":"kelime","desen":"a+m+g+","ek":""},{"tur":"tr","kip":"kelime","desen":"s+k+m+","ek":""},{"tur":"tr","kip":"kelime","desen":"s+k+r+m+","ek":""},{"tur":"tr","kip":"alt","desen":"y+a+r{2,}a+k+","ek":""},{"tur":"tr","kip":"alt","desen":"y+a+r{2,}a+g+","ek":""},{"tur":"tr","kip":"alt","desen":"y+a+r{2,}a+m+","ek":""},{"tur":"tr","kip":"alt","desen":"y+a+r{2,}a+n+","ek":""},{"tur":"tr","kip":"alt","desen":"d+a+l+y+a+r+a+k+","ek":""},{"tur":"tr","kip":"bas","desen":"y+a+r+a+k+","ek":""},{"tur":"tr","kip":"kelime","desen":"y+a+r+a+k+","ek":"l+e+r+|l+a+r+|i+|u+|e+|a+|i+n+|u+n+|i+m+|u+m+|d+e+|d+a+|d+e+n+|d+a+n+|c+i+|c+u+|l+i+k+|l+u+k+|l+i+|l+u+|n+e+|n+a+|n+i+|n+u+|n+i+n+|n+u+n+|s+|e+s+|y+|i+e+|z+"},{"tur":"tr","kip":"alt","desen":"t+a+s+a+k+","ek":""},{"tur":"tr","kip":"alt","desen":"t+a+s{2,}a+k+","ek":""},{"tur":"tr","kip":"alt","desen":"t+a+s+a+g+","ek":""},{"tur":"tr","kip":"alt","desen":"d+a+l+t+a+s+a+k+","ek":""},{"tur":"tr","kip":"alt","desen":"g+o+t+v+e+r+e+n+","ek":""},{"tur":"tr","kip":"alt","desen":"g+o+t+l+e+k+","ek":""},{"tur":"tr","kip":"alt","desen":"g+o+t+o+s+","ek":""},{"tur":"tr","kip":"alt","desen":"g+o+t+u+n+u+","ek":""},{"tur":"tr","kip":"alt","desen":"g+o+t+u+n+e+","ek":""},{"tur":"tr","kip":"alt","desen":"g+o+t+u+n+d+e+n+","ek":""},{"tur":"tr","kip":"alt","desen":"g+o+t+u+m+","ek":""},{"tur":"tr","kip":"alt","desen":"g+o+t+v+e+r+i+c+i+","ek":""},{"tur":"tr","kip":"kelime","desen":"g+t+v+r+n+","ek":""},{"tur":"tr","kip":"kelime_ek","desen":"g+o+t+","ek":"u+|u+n+|u+n+e+|u+n+u+|u+n+d+e+n+|e+|t+e+|t+e+n+|l+e+r+|l+e+k+|o+s+|v+e+r+e+n+|l+u+|u+n+u+z+|u+m+e+"},{"tur":"tr","kip":"kelime","desen":"p+i+c+","ek":"l+e+r+|l+i+k+|i+|i+n+|e+|k+u+r+u+s+u+|l+a+r+"},{"tur":"tr","kip":"alt","desen":"p+i+c+k+u+r+u+s+u+","ek":""},{"tur":"tr","kip":"alt","desen":"p+i+c+l+i+k+","ek":""},{"tur":"tr","kip":"alt","desen":"i+b+n+e+","ek":""},{"tur":"tr","kip":"alt","desen":"i+p+n+e+","ek":""},{"tur":"tr","kip":"alt","desen":"i+b+i+n+e+","ek":""},{"tur":"tr","kip":"alt","desen":"p+e+z+e+v+e+n+k+","ek":""},{"tur":"tr","kip":"alt","desen":"p+e+z+e+v+e+k+","ek":""},{"tur":"tr","kip":"kelime","desen":"p+e+z+o+","ek":""},{"tur":"tr","kip":"alt","desen":"g+a+v+a+t+","ek":""},{"tur":"tr","kip":"alt","desen":"k+a+h+p+e+","ek":""},{"tur":"tr","kip":"alt","desen":"k+a+l+t+a+k+","ek":""},{"tur":"tr","kip":"alt","desen":"s+u+r+t+u+k+","ek":""},{"tur":"tr","kip":"alt","desen":"f+a+h+i+s+e+","ek":""},{"tur":"tr","kip":"alt","desen":"k+e+v+a+s+e+","ek":""},{"tur":"tr","kip":"alt","desen":"o+g+l+a+n+c+i+","ek":""},{"tur":"tr","kip":"alt","desen":"d+u+r+z+u+","ek":""},{"tur":"tr","kip":"alt","desen":"k+e+r+h+a+n+e+","ek":""},{"tur":"tr","kip":"alt","desen":"a+s+i+f+t+e+","ek":""},{"tur":"tr","kip":"alt","desen":"k+a+n+c+i+k+","ek":""},{"tur":"tr","kip":"alt","desen":"y+a+v+s+a+k+","ek":""},{"tur":"tr","kip":"alt","desen":"y+a+v+s+a+g+","ek":""},{"tur":"tr","kip":"kelime","desen":"p+u+s+t+","ek":"l+a+r+|l+u+k+|u+|u+n+|t+"},{"tur":"tr","kip":"alt","desen":"s+e+r+e+f+s+i+z+","ek":""},{"tur":"tr","kip":"alt","desen":"s+e+r+e+f+s+z+","ek":""},{"tur":"tr","kip":"alt","desen":"s+a+k+s+o+","ek":""},{"tur":"tr","kip":"alt","desen":"s+a+k+s+o+c+u+","ek":""},{"tur":"tr","kip":"kelime","desen":"o+c+","ek":""},{"tur":"tr","kip":"alt","desen":"o+r+o+s+p+u+c+o+c+u+g+u+","ek":""},{"tur":"tr","kip":"alt","desen":"o+r+o+s+p+u+e+v+l+a+d+i+","ek":""},{"tur":"tr","kip":"alt","desen":"o+t+u+z+b+i+r+c+i+","ek":""},{"tur":"tr","kip":"alt","desen":"o+t+u+z+b+i+r+c+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+c+m+a+k+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+c+t+i+g+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+c+a+r+i+m+","ek":""},{"tur":"tr","kip":"alt","desen":"s+i+c+a+y+i+m+","ek":""},{"tur":"tr","kip":"kelime","desen":"b+o+k+","ek":"u+|u+n+|l+u+|t+a+n+|c+u+|c+a+|k+a+f+a+|y+i+y+e+n+"},{"tur":"tr","kip":"alt","desen":"b+o+k+t+a+n+","ek":""},{"tur":"tr","kip":"alt","desen":"b+o+k{2,}a+f+a+","ek":""},{"tur":"tr","kip":"alt","desen":"a+v+r+a+d+i+n+i+","ek":""},{"tur":"tr","kip":"alt","desen":"b+a+c+i+n+i+","ek":""},{"tur":"tr","kip":"kelime","desen":"g+a+v+u+r+","ek":"l+e+r+|l+a+r+|i+|u+|e+|a+|i+n+|u+n+|i+m+|u+m+|d+e+|d+a+|d+e+n+|d+a+n+|c+i+|c+u+|l+i+k+|l+u+k+|l+i+|l+u+|n+e+|n+a+|n+i+|n+u+|n+i+n+|n+u+n+|s+|e+s+|y+|i+e+|z+"},{"tur":"tr","kip":"kelime","desen":"p+e+d+o+f+i+l+","ek":"l+e+r+|l+a+r+|i+|u+|e+|a+|i+n+|u+n+|i+m+|u+m+|d+e+|d+a+|d+e+n+|d+a+n+|c+i+|c+u+|l+i+k+|l+u+k+|l+i+|l+u+|n+e+|n+a+|n+i+|n+u+|n+i+n+|n+u+n+|s+|e+s+|y+|i+e+|z+"},{"tur":"tr","kip":"kelime","desen":"p+e+d+o+","ek":""},{"tur":"kalip","kip":"alt","desen":"a+n+a+s+i+n+i+s+i+k+","ek":""},{"tur":"kalip","kip":"alt","desen":"a+n+a+n+i+s+i+k+","ek":""},{"tur":"kalip","kip":"alt","desen":"a+n+a+n+i+s+k+m+","ek":""},{"tur":"kalip","kip":"alt","desen":"a+n+a+n+i+a+v+r+a+d+","ek":""},{"tur":"kalip","kip":"alt","desen":"b+a+c+i+n+i+s+i+k+","ek":""},{"tur":"kalip","kip":"alt","desen":"a+g+z+i+n+a+s+i+c+","ek":""},{"tur":"kalip","kip":"alt","desen":"a+g+z+i+n+i+s+i+k+","ek":""},{"tur":"kalip","kip":"alt","desen":"o+r+o+s+p+u+c+o+c+u+","ek":""},{"tur":"kalip","kip":"alt","desen":"o+r+o+s+b+u+c+o+c+u+","ek":""},{"tur":"kalip","kip":"alt","desen":"p+i+s+a+r+a+p+","ek":""},{"tur":"kalip","kip":"alt","desen":"p+i+s+e+r+m+e+n+i+","ek":""},{"tur":"kalip","kip":"alt","desen":"p+i+s+y+a+h+u+d+i+","ek":""},{"tur":"kalip","kip":"alt","desen":"p+i+s+k+u+r+t+","ek":""},{"tur":"kalip","kip":"alt","desen":"p+i+s+z+e+n+c+i+","ek":""},{"tur":"kalip","kip":"alt","desen":"e+r+m+e+n+i+d+o+l+u+","ek":""},{"tur":"kalip","kip":"alt","desen":"y+a+h+u+d+i+d+o+l+u+","ek":""},{"tur":"kalip","kip":"alt","desen":"k+u+r+t+d+o+l+u+","ek":""},{"tur":"kalip","kip":"alt","desen":"a+m+i+n+a+k+o+y+i+m+","ek":""},{"tur":"kalip","kip":"alt","desen":"a+m+i+n+a+k+o+d+u+m+","ek":""},{"tur":"kalip","kip":"alt","desen":"a+m+i+n+a+k+o+y+d+u+g+","ek":""},{"tur":"kalip","kip":"alt","desen":"s+u+c+k+m+y+d+i+c+k+","ek":""},{"tur":"kalip","kip":"alt","desen":"s+u+c+k+m+y+c+o+c+k+","ek":""},{"tur":"kalip","kip":"alt","desen":"e+a+t+m+y+a+s{2,}","ek":""},{"tur":"kalip","kip":"alt","desen":"k+i+l{2,}a+l{2,}j+","ek":""},{"tur":"kalip","kip":"alt","desen":"g+a+s+t+h+e+j+","ek":""},{"tur":"en","kip":"alt","desen":"f+u+c+k+","ek":""},{"tur":"en","kip":"kelime","desen":"f+u+k+","ek":"s+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+"},{"tur":"en","kip":"kelime","desen":"f+c+k+","ek":"s+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+"},{"tur":"en","kip":"alt","desen":"f+c+u+k+","ek":""},{"tur":"en","kip":"alt","desen":"p+h+u+c+k+","ek":""},{"tur":"en","kip":"kelime","desen":"p+h+u+k+","ek":""},{"tur":"en","kip":"alt","desen":"f+u+k{2,}","ek":""},{"tur":"en","kip":"alt","desen":"s+h+i+t+","ek":""},{"tur":"en","kip":"alt","desen":"c+u+n+t+","ek":""},{"tur":"en","kip":"alt","desen":"b+i+t+c+h+","ek":""},{"tur":"en","kip":"alt","desen":"b+i+a+t+c+h+","ek":""},{"tur":"en","kip":"alt","desen":"w+h+o+r+e+","ek":""},{"tur":"en","kip":"alt","desen":"s+l+u+t+","ek":""},{"tur":"en","kip":"alt","desen":"a+s{2,}h+o+l+e+","ek":""},{"tur":"en","kip":"alt","desen":"a+r+s+e+h+o+l+e+","ek":""},{"tur":"en","kip":"alt","desen":"d+u+m+b+a+s{2,}","ek":""},{"tur":"en","kip":"alt","desen":"f+a+t+a+s{2,}","ek":""},{"tur":"en","kip":"alt","desen":"j+a+c+k+a+s{2,}","ek":""},{"tur":"en","kip":"kelime","desen":"a+s{2,}","ek":"s+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+"},{"tur":"en","kip":"kelime","desen":"a+r+s+e+","ek":""},{"tur":"en","kip":"alt","desen":"d+i+c+k+h+e+a+d+","ek":""},{"tur":"en","kip":"kelime","desen":"d+i+c+k+","ek":"s+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+"},{"tur":"en","kip":"alt","desen":"c+o+c+k+s+u+c+k+e+r+","ek":""},{"tur":"en","kip":"kelime","desen":"c+o+c+k+","ek":"s+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+"},{"tur":"en","kip":"alt","desen":"b+a+s+t+a+r+d+","ek":""},{"tur":"en","kip":"alt","desen":"b+o+l{2,}o+c+k+s+","ek":""},{"tur":"en","kip":"alt","desen":"w+a+n+k+e+r+","ek":""},{"tur":"en","kip":"alt","desen":"w+a+n+k+","ek":""},{"tur":"en","kip":"alt","desen":"t+w+a+t+","ek":""},{"tur":"en","kip":"kelime","desen":"p+r+i+c+k+","ek":"s+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+"},{"tur":"en","kip":"alt","desen":"p+u+s{2,}y+","ek":""},{"tur":"en","kip":"alt","desen":"d+i+l+d+o+","ek":""},{"tur":"en","kip":"alt","desen":"b+l+o+w+j+o+b+","ek":""},{"tur":"en","kip":"alt","desen":"h+a+n+d+j+o+b+","ek":""},{"tur":"en","kip":"alt","desen":"r+i+m+j+o+b+","ek":""},{"tur":"en","kip":"alt","desen":"f+o{2,}t+j+o+b+","ek":""},{"tur":"en","kip":"alt","desen":"j+i+z{2,}","ek":""},{"tur":"en","kip":"alt","desen":"c+u+m+s+h+o+t+","ek":""},{"tur":"en","kip":"kelime","desen":"c+u+m+","ek":"s+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+"},{"tur":"en","kip":"alt","desen":"c+r+e+a+m+p+i+e+","ek":""},{"tur":"en","kip":"alt","desen":"g+a+n+g+b+a+n+g+","ek":""},{"tur":"en","kip":"alt","desen":"b+u+k{2,}a+k+e+","ek":""},{"tur":"en","kip":"alt","desen":"p+o+r+n+","ek":""},{"tur":"en","kip":"alt","desen":"h+e+n+t+a+i+","ek":""},{"tur":"en","kip":"alt","desen":"m+i+l+f+","ek":""},{"tur":"en","kip":"alt","desen":"t+i+t{2,}i+e+s+","ek":""},{"tur":"en","kip":"kelime","desen":"t+i+t+s+","ek":""},{"tur":"en","kip":"kelime","desen":"t+i+t{2,}y+","ek":""},{"tur":"en","kip":"kelime","desen":"b+o{2,}b+s+","ek":""},{"tur":"en","kip":"kelime","desen":"b+o{2,}b+","ek":""},{"tur":"en","kip":"kelime","desen":"h+o+r+n+y+","ek":""},{"tur":"en","kip":"kelime","desen":"r+a+p+e+","ek":"s+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+"},{"tur":"en","kip":"kelime","desen":"r+a+p+i+s+t+","ek":"s+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+"},{"tur":"en","kip":"kelime","desen":"r+a+p+i+n+g+","ek":""},{"tur":"en","kip":"alt","desen":"m+o+t+h+e+r+f+u+c+k+","ek":""},{"tur":"en","kip":"kelime","desen":"m+o+f+o+","ek":""},{"tur":"en","kip":"kelime","desen":"s+t+f+u+","ek":""},{"tur":"en","kip":"kelime","desen":"g+t+f+o+","ek":""},{"tur":"en","kip":"alt","desen":"n+i+g{2,}e+r+","ek":""},{"tur":"en","kip":"alt","desen":"n+i+g{2,}a+","ek":""},{"tur":"en","kip":"alt","desen":"n+i+g{2,}a+h+","ek":""},{"tur":"en","kip":"kelime","desen":"n+e+g+r+o+","ek":"s+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+"},{"tur":"en","kip":"alt","desen":"f+a+g{2,}o+t+","ek":""},{"tur":"en","kip":"kelime","desen":"f+a+g+","ek":"s+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+"},{"tur":"en","kip":"alt","desen":"r+e+t+a+r+d+","ek":""},{"tur":"en","kip":"alt","desen":"t+r+a+n{2,}y+","ek":""},{"tur":"en","kip":"alt","desen":"s+h+e+m+a+l+e+","ek":""},{"tur":"en","kip":"kelime","desen":"k+i+k+e+","ek":"s+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+"},{"tur":"en","kip":"kelime","desen":"s+p+i+c+","ek":"s+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+"},{"tur":"en","kip":"kelime","desen":"c+h+i+n+k+","ek":"s+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+"},{"tur":"en","kip":"kelime","desen":"g+o{2,}k+","ek":"s+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+"},{"tur":"en","kip":"kelime","desen":"c+o{2,}n+","ek":"s+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+"},{"tur":"en","kip":"alt","desen":"w+e+t+b+a+c+k+","ek":""},{"tur":"en","kip":"alt","desen":"b+e+a+n+e+r+","ek":""},{"tur":"en","kip":"alt","desen":"r+a+g+h+e+a+d+","ek":""},{"tur":"en","kip":"alt","desen":"t+o+w+e+l+h+e+a+d+","ek":""},{"tur":"en","kip":"alt","desen":"j+i+g+a+b+o{2,}","ek":""},{"tur":"en","kip":"alt","desen":"j+i+g{2,}a+b+o{2,}","ek":""},{"tur":"en","kip":"kelime","desen":"d+a+r+k+i+e+","ek":""},{"tur":"en","kip":"kelime","desen":"d+y+k+e+","ek":"s+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+"},{"tur":"en","kip":"kelime","desen":"p+a+k+i+","ek":"s+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+"},{"tur":"en","kip":"alt","desen":"s+l+a+n+t+e+y+e+","ek":""},{"tur":"en","kip":"alt","desen":"h+i+t+l+e+r+","ek":""},{"tur":"en","kip":"alt","desen":"n+e+o+n+a+z+i+","ek":""},{"tur":"en","kip":"kelime","desen":"n+a+z+i+","ek":"s+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+"},{"tur":"en","kip":"alt","desen":"s+i+e+g+h+e+i+l+","ek":""},{"tur":"en","kip":"alt","desen":"h+e+i+l+h+i+t+l+e+r+","ek":""},{"tur":"en","kip":"alt","desen":"w+h+i+t+e+p+o+w+e+r+","ek":""},{"tur":"en","kip":"alt","desen":"s+w+a+s+t+i+k+a+","ek":""},{"tur":"en","kip":"kelime","desen":"k{2,}","ek":""},{"tur":"en","kip":"alt","desen":"p+e+d+o+p+h+i+l+e+","ek":""},{"tur":"en","kip":"alt","desen":"p+a+e+d+o+p+h+i+l+e+","ek":""},{"tur":"ayrilmis","kip":"alt","desen":"a+d+m+i+n+","ek":""},{"tur":"ayrilmis","kip":"alt","desen":"a+d+m+i+n+i+s+t+r+a+t+o+r+","ek":""},{"tur":"ayrilmis","kip":"alt","desen":"m+o+d+e+r+a+t+o+r+","ek":""},{"tur":"ayrilmis","kip":"alt","desen":"y+o+n+e+t+i+c+i+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"y+o+n+e+t+i+m+","ek":""},{"tur":"ayrilmis","kip":"alt","desen":"y+e+t+k+i+l+i+","ek":""},{"tur":"ayrilmis","kip":"alt","desen":"p+s+i+k+o+v+a+k+a+","ek":""},{"tur":"ayrilmis","kip":"alt","desen":"a+n+t+h+r+o+p+i+c+","ek":""},{"tur":"ayrilmis","kip":"alt","desen":"s+u+p+a+b+a+s+e+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"m+o+d+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"m+o+d+s+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"d+e+s+t+e+k+","ek":""},{"tur":"ayrilmis","kip":"alt","desen":"d+e+s+t+e+k+e+k+i+b+i+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"s+u+p{2,}o+r+t+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"s+i+s+t+e+m+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"s+y+s+t+e+m+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"r+o{2,}t+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"s+t+a+f{2,}","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"c+l+a+u+d+e+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"o+f{2,}i+c+i+a+l+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"r+e+s+m+i+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"y+a+r+d+i+m+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"h+e+l+p+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"s+y+s+o+p+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"s+u+p+e+r+u+s+e+r+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"o+w+n+e+r+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"k+u+r+u+c+u+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"g+e+m+i+n+i+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"c+h+a+t+g+p+t+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"o+p+e+n+a+i+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"a+n+o+n+y+m+o+u+s+","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"n+u+l{2,}","ek":""},{"tur":"ayrilmis","kip":"tam","desen":"u+n+d+e+f+i+n+e+d+","ek":""}],"beyaz":["a+m+a+","a+m+a+c+","a+m+a+c+i+","a+m+a+t+e+u+r+","a+m+a+t+o+r+","a+m+a+z+e+","a+m+a+z+i+n+g+","a+m+a+z+o+n+","a+m+b+a+l+a+j+","a+m+b+a+r+","a+m+b+a+s{2,}a+d+o+r+","a+m+b+l+e+m+","a+m+b+u+l+a+n+s+","a+m+c+a+","a+m+c+a+l+a+r+","a+m+c+a+m+","a+m+c+a+n+","a+m+c+a+s+i+","a+m+c+a+z+a+d+e+","a+m+e+l+","a+m+e+l+e+","a+m+e+l+i+y+a+t+","a+m+e+r+i+c+a+n+","a+m+e+r+i+k+a+","a+m+f+i+","a+m+f+i+b+i+","a+m+i+g+o+","a+m+i+l+","a+m+i+n+","a+m+i+n+e+","a+m+i+n+o+","a+m+i+n+o+a+s+i+t+","a+m+i+r+","a+m+i+r+a+l+","a+m+l+a+","a+m+o+n+y+a+k+","a+m+p+e+r+","a+m+p+u+l+","a+m+s+t+e+r+d+a+m+","a+s{2,}a+m+","a+s{2,}a+s{2,}i+n+","a+s{2,}a+u+l+t+","a+s{2,}e+s{2,}","a+s{2,}e+t+","a+s{2,}i+s+t+","a+s{2,}i+s+t+a+n+t+","b+a+s{2,}","b+o+k+s+","b+o+k+s+e+r+","b+o+k+s+o+r+","b+o{2,}b+o{2,}k+","b+o+x+e+r+","c+a+s{2,}a+n+d+r+a+","c+l+a+s{2,}","c+l+a+s{2,}i+c+","c+o+c+k+a+t+o{2,}","c+o+c+k+p+i+t+","c+o+c+k+r+o+a+c+h+","c+o+c+k+t+a+i+l+","c+o+m+p+a+s{2,}","c+u+c+u+m+b+e+r+","c+u+m+a+","c+u+m+a+r+t+e+s+i+","c+u+m+h+u+r+","c+u+m+h+u+r+i+y+e+t+","c+u+m+u+l+u+s+","d+i+c+k+e+n+s+","d+i+c+k+i+n+s+o+n+","d+i+c+k+s+o+n+","d+o+c+u+m+e+n+t+","d+r+a+p+e+","e+m+b+a+s{2,}y+","g+l+a+s{2,}","g+o+t+a+n+","g+o+t+h+a+m+","g+o+t+i+k+","g+o+t+l+a+n+d+","g+o+t+u+r+","g+o+t+u+r+m+e+k+","g+o+t+u+r+u+","g+r+a+p+e+","g+r+a+s{2,}","h+a+n+c+o+c+k+","h+a+r+a+s{2,}","i+b+n+e+s+i+n+a+","i+b+n+h+a+l+d+u+n+","i+b+n+i+h+a+l+d+u+n+","i+b+n+i+s+i+n+a+","i+s+i+k+","k+a+n+c+i+k{2,}o+p+e+k+","k+a+s+i+m+","k+a+s+i+m+p+a+s+a+","k+i+s+k+i+r+t+","l+a+s{2,}o+","m+a+s+i+k+l+e+r+","m+a+s{2,}","m+a+t+s+u+s+h+i+t+a+","n+a+z+i+f+e+","n+a+z+i+k+","n+a+z+i+l{2,}i+","p+a+r+a+p+e+t+","p+a+s{2,}","p+a+s{2,}i+o+n+","p+e+a+c+o+c+k+","p+i+k+a+c+h+u+","p+i+k+n+i+k+","p+u+s{2,}y+c+a+t+","r+a+p+e+s+e{2,}d+","r+e+t+a+r+d+a+n+t+","s+a+k+s+o+f+o+n+","s+a+s{2,}y+","s+a+x+o+p+h+o+n+e+","s+c+r+a+p+e+","s+c+u+m+","s+c+u+n+t+h+o+r+p+e+","s+h+i{2,}t+a+k+e+","s+h+i+t+a+k+e+","s+i+k+c+a+","s+i+k+i+","s+i+k+i+c+i+","s+i+k+i+l+a+s+m+a+","s+i+k+i+l+d+i+m+","s+i+k+i+l+m+a+","s+i+k+i+l+m+a+k+","s+i+k+i+n+t+i+","s+i+k+i+n+t+i+l+i+","s+i+k+i+s+i+k+","s+i+k+i+s+m+a+","s+i+k+i+s+m+a+k+","s+i+k+i+s+t+i+r+","s+i+k+i+y+o+n+e+t+i+m+","s+i+k{2,}e+","s+i+k{2,}e+l+e+r+","s+i+k+l+e+t+","s+i+k+m+a+","s+i+k+m+a+k+","s+n+i+g{2,}e+r+","s+n+i+g{2,}e+r+i+n+g+","s+p+i+c+e+","s+p+i+c+y+","s+w+a+n+k+","t+e+r+a+p+i+s+t+","t+h+e+r+a+p+e+u+t+i+c+","t+h+e+r+a+p+i+s+t+","t+i+t+a+n+","t+i+t+a+n+i+c+","y+a+r+a+s+a+"]};
    var f = psikoVakaIsimFiltresiOlustur(VERI);
    var api = { check: f.check, surum: f.surum };
    if (typeof module !== 'undefined' && module.exports) module.exports = { check: f.check, kategori: f.kategori, varyantlar: f.varyantlar, surum: f.surum };
    if (global) global.PsikoVakaIsimFiltresi = api;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
