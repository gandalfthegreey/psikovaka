/**
 * PsikoVaka — Tasarım pilotu "Danışan dosyası" (ajan D2, 2026-11-20)
 *
 * Yalnızca <html class="tasarim-dosya"> iken çalışır. Sınıfı index.html <head>'deki küçük betik koyar:
 *   ?tasarim=dosya  -> açar ve localStorage 'psikovaka_tasarim' = 'dosya' olarak hatırlar
 *   ?tasarim=eski   -> kapatır (anahtar silinir)
 * Bayrak kapalıyken bu dosya hiçbir şey yapmaz: DOM ve görünüm bugünküyle birebir aynıdır.
 *
 * Açıkken oyun ekranında (#screenPlay) yalnızca YERLEŞİM değişir:
 *   - .dosya-folder > .dosya-tabs (klasör sekmesi: vaka no + zorluk, kombo aşama sekmeleri, ipucu sayacı)
 *                   > .dosya-sheet (tek kâğıt: tahmin şeridi, hasta özeti, ipuçları, tahmin listesi, vaka sonu)
 *   - vaka sonunda #finishedActions'ın başına mühür (.dosya-stamp, aria-hidden; aynı bilgi #playResultAnswer'da)
 * Hiçbir kimlik (id) değişmez, öğeler yalnızca taşınır; oyun motoru öğeleri kimlikle bulduğu için etkilenmez.
 * Görünüm: css/dosya.css (tüm kurallar .tasarim-dosya altında).
 */
(function () {
    'use strict';
    var root = document.documentElement;
    if (!root.classList.contains('tasarim-dosya')) return;

    var scr = document.getElementById('screenPlay');
    if (!scr || scr.querySelector('.dosya-folder')) return;
    var $ = function (id) { return document.getElementById(id); };

    // ---- Yapı: klasör (sekmeler + kâğıt) ----
    var folder = document.createElement('div');
    folder.className = 'dosya-folder';
    var tabs = document.createElement('div');
    tabs.className = 'dosya-tabs';
    var mainTab = document.createElement('div');
    mainTab.className = 'dosya-tab dosya-tab-main';
    mainTab.innerHTML = '<span class="dosya-tab-case" id="dosyaTabCase">Vaka</span><span class="dosya-tab-diff" id="dosyaTabDiff"></span>';
    tabs.appendChild(mainTab);
    var sheet = document.createElement('div');
    sheet.className = 'dosya-sheet';
    folder.appendChild(tabs);
    folder.appendChild(sheet);

    var patient = scr.querySelector('.patient-card');
    var progress = scr.querySelector('.play-progress');
    var combo = $('comboStepperBar');
    var strip = $('guessStrip');
    var clues = $('cluesContainer');
    var feed = $('guessesFeed');
    var finished = $('finishedActions');
    if (!patient || !clues || !feed || !finished) return;

    patient.parentNode.insertBefore(folder, patient);
    if (combo) tabs.appendChild(combo);
    if (progress) tabs.appendChild(progress);
    [strip, patient, clues, feed, finished].forEach(function (el) { if (el) sheet.appendChild(el); });

    // ---- Mühür ----
    var stamp = document.createElement('div');
    stamp.className = 'dosya-stamp';
    stamp.setAttribute('aria-hidden', 'true');
    stamp.hidden = true;
    finished.insertBefore(stamp, finished.firstChild);

    function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function upTr(t) { try { return String(t).toLocaleUpperCase('tr-TR'); } catch (e) { return String(t).toUpperCase(); } }

    function answers(g) {
        var c = g.currentCase || {};
        var d = (g.diagnoses || []).find(function (x) { return x.id === c.diagnosisId; });
        var tId = c.therapyId || 'cbt_general';
        var t = (g.therapies || []).find(function (x) { return x.id === tId; });
        var pId = c.pharmacologyId || (typeof g.getFallbackPharmacologyId === 'function' ? g.getFallbackPharmacologyId(c) : '');
        var p = (g.pharmacology || []).find(function (x) { return x.id === pId; });
        return { d: d && d.nameTr, t: t && t.nameTr, p: p && p.nameTr };
    }

    function renderStamp(g) {
        if (!g || !g.isGameOver || finished.hidden || !g.currentCase) { stamp.hidden = true; stamp.innerHTML = ''; return; }
        var won = !!g.gameWon;
        var mode = g.targetGameMode || 'diagnosis';
        var a = answers(g);
        var rows;
        var label = { diagnosis: 'Tanı', therapy: 'Terapi', pharmacology: 'İlaç' };
        if (mode === 'combo') {
            rows = [['Tanı', a.d], ['Terapi', a.t], ['İlaç', a.p]].filter(function (r) { return r[1]; });
        } else {
            rows = [[label[mode] || 'Tanı', mode === 'therapy' ? a.t : mode === 'pharmacology' ? a.p : a.d]];
        }
        if (!rows.length || !rows[0][1]) { stamp.hidden = true; return; }
        var head = mode === 'combo'
            ? (won ? 'Hepsi doğru' : 'Doğru cevap')
            : (won ? rows[0][0] : 'Doğru ' + rows[0][0].toLocaleLowerCase('tr-TR'));
        var mark = won
            ? '<svg viewBox="0 0 24 24" class="dosya-stamp-mark" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
            : '<svg viewBox="0 0 24 24" class="dosya-stamp-mark" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>';
        var body = mode === 'combo'
            ? rows.map(function (r) { return '<span class="dosya-stamp-row"><span class="dosya-stamp-k">' + esc(upTr(r[0])) + ':</span> ' + esc(r[1]) + '</span>'; }).join('')
            : '<span class="dosya-stamp-name">' + esc(rows[0][1]) + '</span>';
        var d = new Date();
        var date = String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear();
        var n = (g.guesses || []).length;
        var foot = won ? (n + '. tahmin · ' + date) : ('Kapatıldı · ' + date);
        stamp.className = 'dosya-stamp ' + (won ? 'is-win' : 'is-loss') + (mode === 'combo' ? ' is-combo' : '');
        stamp.innerHTML = '<span class="dosya-stamp-ink">'
            + '<span class="dosya-stamp-head">' + mark + '<span>' + esc(upTr(head)) + (mode === 'combo' ? '' : ':') + '</span></span>'
            + body
            + '<span class="dosya-stamp-foot">' + esc(foot) + '</span>'
            + '</span>';
        stamp.hidden = false;
    }

    function renderTab(g) {
        var c = g && g.currentCase;
        var caseEl = $('dosyaTabCase'), diffEl = $('dosyaTabDiff');
        if (!c || !caseEl) return;
        var pid = $('patientId');
        caseEl.textContent = c.caseNumber ? ('Vaka #' + c.caseNumber) : (pid ? pid.textContent : 'Vaka');
        var db = $('difficultyBadge');
        var diff = db ? db.textContent.trim() : '';
        diffEl.textContent = diff;
        diffEl.hidden = !diff;
        diffEl.className = 'dosya-tab-diff is-' + diff.toLocaleLowerCase('tr-TR').replace(/[^a-zçğıöşü]/g, '');
    }

    function sync() {
        var g = window.game;
        if (!g) return;
        renderTab(g);
        renderStamp(g);
        scr.classList.toggle('dosya-over', !!g.isGameOver);
    }
    document.addEventListener('psikovaka:playstate', sync);
    // İlk çizim: oyun nesnesi DOMContentLoaded'da kurulur
    if (window.game) sync(); else document.addEventListener('DOMContentLoaded', function () { setTimeout(sync, 0); });
})();
