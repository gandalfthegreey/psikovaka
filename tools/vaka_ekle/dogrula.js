#!/usr/bin/env node
/**
 * Yeni vakaları canlı veriye karşı doğrular (Claude ajan Y, 2026-11-20). Gemini'nin vaka üretim hattının parçası.
 *
 * Kullanım (proje kökünden):
 *   node tools/vaka_ekle/dogrula.js tools/vaka_ekle/taslaklar/2026-11-20_3.json
 *       Yeni vakaların JSON dizisini doğrular. id/caseNumber yoksa sırayla atanmış gibi raporlar.
 *       Hata varsa çıkış kodu 1; yalnızca uyarı varsa 0.
 *   node tools/vaka_ekle/dogrula.js --mevcut
 *       js/cases.js içindeki TÜM vakalara yapısal kuralları uygular (alan/tip/id/şema/açıklama). Yayından önce
 *       deploy_to_github.js bunu çalıştırır. Sızıntı/benzerlik kuralları burada uygulanmaz (eski vakalar için).
 *   --kok <dizin>   başka bir proje kopyasına karşı çalışır (testler için)
 *   --sessiz        yalnızca hataları ve özet satırını yazar
 *
 * Modül olarak: const { validateBatch, validateExisting, buildContext } = require('./dogrula.js')
 */
'use strict';
const fs = require('fs');
const path = require('path');
const o = require('./ortak.js');
const { dogrulaAciklama } = require(path.join(__dirname, '..', 'icerik', 'vaka_aciklamalari', 'dogrula.js'));

// ------------------------------------------------------------------ eşikler (mevcut veriyle ayarlandı, 2026-11-20)
// Mevcut 150 vaka (138 aktif + 12 arşiv) arasında ipucu metinlerinin kelime-3gram Jaccard benzerliği en fazla 0.076;
// tek tek ipuçlarında (1-5) en fazla 0.33. Eşikler bunların belirgin üstünde: hiçbir mevcut çift işaretlenmez.
const SIM_SAME_DX = 0.15;     // aynı tanı + ipuçları bu kadar benzer -> kopya
const SIM_ANY_DX = 0.25;      // tanı farklı olsa da bu kadar benzer -> kopya
const SIM_CLUE = 0.5;         // tek ipucu (1-5) bu kadar benzer ...
const SIM_CLUE_COUNT = 2;     // ... ve böyle en az 2 ipucu varsa -> kopya
const KW_CLUE1_WARN = 4;      // ipucu 1'de bu kadar tanıya özgü ölçüt kelimesi -> "çok erken belli" uyarısı (mevcutların ~%4'ü)
const MANY_CASES_WARN = 3;    // tanının bu kadar vakası zaten varsa uyarı

const REQUIRED = ['difficulty', 'course', 'diagnosisId', 'category', 'patientSummary', 'clues', 'symptomHighlights',
    'treatmentModality', 'miniQuiz', 'differentialDiagnosis', 'dsmCriteriaSummary', 'therapyId', 'explanation'];
const OPTIONAL_NEW = ['id', 'caseNumber', 'pharmacologyId'];
const TREATMENT_KEYS = ['goldStandardTherapy', 'therapyDetails', 'pharmacologyNote'];
const HIGHLIGHT_KEYS = ['clueIndex', 'text', 'dsmMatch'];
// "bozukluğu", "tip" gibi tek başına bir şey söylemeyen kelimeler: yalnızca bunlardan oluşan terim sızıntı sayılmaz
const GENERIC = new Set(['bozuklugu', 'bozukluk', 'bozukluklar', 'bozukluklari', 'bozuklugun', 've', 'ile', 'iliskili', 'diger',
    'tip', 'tipi', 'duzey', 'duzeyi', 'hafif', 'orta', 'agir', 'cok', 'belirlenmis', 'belirlenmemis', 'disorder', 'disorders',
    'type', 'other', 'specified', 'unspecified', 'and', 'or', 'the', 'of', 'with', 'related', 'mild', 'moderate', 'severe',
    'sendromu', 'sendrom', 'hastaligi', 'durumu', 'kullanim', 'kullanimi', 'use', 'baslangicli', 'cocukluk', 'cocuklukta']);

// Takma ad / parantez içi olarak listede geçse de klinik anlatımda kaçınılmaz olan belirti ve madde adları: sızıntı sayılmaz.
// (Mevcut vakalarda birden çok farklı tanının ipuçlarında geçen kelimelerden seçildi, 2026-11-20.)
const DESCRIPTIVE = new Set(['kronik', 'panik', 'panik atak', 'korku', 'kaygi', 'beklenti kaygisi', 'travma', 'kabus', 'kabuslar',
    'sanri', 'flashback', 'uyumsuzluk', 'somatik', 'stereotipi', 'insomni', 'idrar kacirma', 'ofke patlamalari',
    'alkol', 'esrar', 'kannabis', 'marihuana', 'kokain', 'crack', 'amfetamin', 'metamfetamin', 'kristal', 'eroin', 'morfin', 'opioid',
    'benzodiazepin', 'xanax', 'kafein', 'kahve', 'tutun', 'nikotin', 'sigara', 'tiner', 'bali', 'lsd', 'mdma', 'psilosibin',
    'asit', 'mantar', 'pcp', 'fensiklidin', 'cocaine', 'cannabis', 'alcohol', 'tobacco', 'caffeine']);

const isObj = x => x && typeof x === 'object' && !Array.isArray(x);
const isStr = x => typeof x === 'string' && x.trim().length > 0;
const pct = (a, p) => a[Math.min(a.length - 1, Math.max(0, Math.floor(a.length * p)))];

/** Metinden sızıntı için aranacak terimler (normalleştirilmiş): ad, parantezsiz ad, parantez içi, takma adlar. */
function termsFor(label, text, out) {
    if (!text) return;
    const add = t => {
        const n = o.norm(t);
        if (n.length < 4) return;
        if (DESCRIPTIVE.has(n)) return;
        if (n.split(' ').every(w => GENERIC.has(w) || /^\d+$/.test(w))) return;
        out.push({ term: n, label: `${label} "${String(t).trim()}"` });
    };
    add(text);
    const noParen = String(text).replace(/\([^()]*\)/g, ' ');
    if (noParen !== text) add(noParen);
    // parantez içi: yalnızca tek terimse ("(Distimi)", "(Konversiyon)"); "(Kriz / Kas Ağrıları, Midriyazis)" gibi listeler değil
    for (const m of String(text).matchAll(/\(([^()]*)\)/g)) if (!/[,\/]/.test(m[1]) && m[1].trim().split(/\s+/).length <= 3) add(m[1]);
    // "A / B" biçimli adlar
    if (/\s\/\s/.test(text)) String(noParen).split(/\s\/\s/).forEach(add);
}

/** Tanı rehberinden tanıya özgü kelime kökleri (en fazla 3 tanının ölçütlerinde geçenler). */
function buildKeywordIndex(manual) {
    const txt = e => (e.criteriaList || []).map(c => [c.title, c.content, ...(c.items || [])].join(' ')).join(' ');
    const stemsOf = t => new Set(o.words(t).filter(w => w.length >= 5 && !/^\d/.test(w)).map(w => w.slice(0, 6)));
    const S = {}, df = {};
    for (const [id, e] of Object.entries(manual)) { S[id] = stemsOf(txt(e)); for (const s of S[id]) df[s] = (df[s] || 0) + 1; }
    const spec = {};
    for (const id of Object.keys(S)) spec[id] = new Set([...S[id]].filter(s => df[s] <= 3));
    return { spec, stemsOf };
}

/** Bütün denetimlerin ihtiyaç duyduğu, canlı veriden türetilen bağlam. */
function buildContext(data) {
    const dxById = new Map(data.diagnoses.map(d => [d.id, d]));
    const dxIds = new Set(dxById.keys());
    const courseIds = Object.keys(data.courses).filter(k => k !== 'ALL');
    const therapyIds = new Set(data.therapies.map(t => t.id));
    const pharmaIds = new Set(data.pharma.map(p => p.id));
    const difficulties = [...new Set(data.cases.map(c => c.difficulty))];
    // miniQuiz biçimi mevcut vakalardan: en sık seçenek sayısı ve anahtar kümesi
    const freq = {};
    data.cases.forEach(c => { const q = c.miniQuiz || {}; const k = `${(q.options || []).length}|${Object.keys(q).sort().join(',')}`; freq[k] = (freq[k] || 0) + 1; });
    const [optCount, quizKeys] = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0].split('|');
    const clueStats = [0, 1, 2, 3, 4, 5].map(i => {
        const a = data.cases.map(c => (c.clues[i] || '').length).sort((x, y) => x - y);
        return { lo: Math.round(pct(a, 0.05) * 0.75), hi: Math.round(pct(a, 0.95) * 1.25) };
    });
    const dxCount = {};
    data.cases.forEach(c => { dxCount[c.diagnosisId] = (dxCount[c.diagnosisId] || 0) + 1; });
    const therapyByDx = {}, pharmaByDx = {};
    data.cases.forEach(c => {
        (therapyByDx[c.diagnosisId] = therapyByDx[c.diagnosisId] || new Set()).add(c.therapyId);
        (pharmaByDx[c.diagnosisId] = pharmaByDx[c.diagnosisId] || new Set()).add(c.pharmacologyId);
    });
    const corpus = [...data.cases.map(c => ({ c, arsiv: false })), ...data.archived.map(c => ({ c, arsiv: true }))].map(({ c, arsiv }) => ({
        id: c.id, diagnosisId: c.diagnosisId, arsiv, hash: o.contentHash(c),
        all: o.trigrams((c.clues || []).join(' ')), each: (c.clues || []).slice(0, 5).map(x => o.trigrams(x))
    }));
    const kw = buildKeywordIndex(data.manual);
    // tüm tanı adları/takma adları (ayırıcı tanı metnindeki adları tanımak için)
    const allNames = [];
    data.diagnoses.forEach(d => [d.nameTr, d.nameEn, ...(d.aliases || [])].forEach(n => { const x = o.norm(String(n).replace(/\([^()]*\)/g, ' ')); if (x.length >= 3) allNames.push(x); }));
    return {
        data, dxById, dxIds, courseIds, therapyIds, pharmaIds, difficulties, optCount: Number(optCount), quizKeys,
        clueStats, dxCount, therapyByDx, pharmaByDx, corpus, kw, allNames, nextNumber: o.nextCaseNumber(data)
    };
}

function leakTerms(ctx, c) {
    const out = [];
    const d = ctx.dxById.get(c.diagnosisId);
    if (d) {
        termsFor('tanının Türkçe adı', d.nameTr, out);
        termsFor('tanının İngilizce adı', d.nameEn, out);
        (d.aliases || []).forEach(a => termsFor('tanının takma adı', a, out));
        const cat = ctx.data.dsmCategories[d.category];
        if (cat) termsFor('DSM kategori adı', cat.name, out);
    }
    const course = ctx.data.courses[c.course];
    if (course && c.course !== 'ALL') termsFor('alan (ders) adı', course.name, out);
    return out;
}

/** Bir parantez içi başlık notu nötr mü? (yaş, BKİ, ölçü gibi) */
function neutralParen(s, allowComorbid) {
    const t = s.trim();
    if (/^BK[İI](\s|:|$)/i.test(t)) return true;
    if (allowComorbid && t === 'Çift tanılı vaka') return true;
    return /\d/.test(t) && /^[\d\s.,:;\/%²+\-]*(kg|cm|m|kg\/m²|yaş|yaşında|ay|aylık|yıl|hafta)?[\s.]*$/i.test(t);
}

/** Tek vakayı doğrular. mode: 'yeni' (tüm kurallar) | 'mevcut' (yalnızca yapısal kurallar). */
function validateCase(c, ctx, { mode = 'yeni', expectedNumber = null, batchSoFar = [] } = {}) {
    const errors = [], warnings = [];
    const E = m => errors.push(m), W = m => warnings.push(m);
    if (!isObj(c)) { E('vaka bir JSON nesnesi değil'); return { errors, warnings }; }
    const isNew = mode === 'yeni';

    // --- alanlar
    const allowed = new Set([...REQUIRED, ...OPTIONAL_NEW, ...(isNew ? [] : ['secondaryDiagnosisId'])]);
    for (const k of REQUIRED) if (!Object.prototype.hasOwnProperty.call(c, k)) E(`eksik alan: ${k}`);
    for (const k of Object.keys(c)) if (!allowed.has(k)) {
        E(k === 'secondaryDiagnosisId' ? 'secondaryDiagnosisId kullanılamaz: çift tanılı vakalar bu hatla eklenmez' : `fazla/bilinmeyen alan: ${k}`);
    }
    if (!isNew) for (const k of ['id', 'caseNumber', 'pharmacologyId']) if (!Object.prototype.hasOwnProperty.call(c, k)) E(`eksik alan: ${k}`);

    // --- boş metin (her yerde)
    (function walk(x, p) {
        if (typeof x === 'string') {
            if (!x.trim()) E(`boş metin: ${p}`);
            // bazı alanlar oyunda innerHTML ile basılıyor: etiket benzeri metin sayfayı bozar
            if (/<[A-Za-z\/!?]/.test(x)) E(`HTML etiketi benzeri metin: ${p} ("<" harften önce kullanılamaz; "küçüktür" için "< 5" gibi boşluk bırak)`);
            return;
        }
        if (Array.isArray(x)) x.forEach((y, i) => walk(y, `${p}[${i}]`));
        else if (isObj(x)) Object.entries(x).forEach(([k, v]) => walk(v, p ? `${p}.${k}` : k));
    })(c, '');

    // --- id / caseNumber
    if (isNew && expectedNumber != null) {
        if (c.caseNumber !== undefined && c.caseNumber !== expectedNumber) E(`caseNumber ${JSON.stringify(c.caseNumber)} olamaz; sıradaki numara ${expectedNumber} (alanı hiç yazmamak en iyisi, ekle.js atar)`);
        if (c.id !== undefined && c.id !== o.caseIdFor(expectedNumber)) E(`id ${JSON.stringify(c.id)} olamaz; sıradaki id ${o.caseIdFor(expectedNumber)} (alanı hiç yazmamak en iyisi, ekle.js atar)`);
    }
    if (!isNew) {
        if (!Number.isInteger(c.caseNumber)) E('caseNumber tam sayı değil');
        else if (c.id !== o.caseIdFor(c.caseNumber)) E(`id (${c.id}) caseNumber ile uyuşmuyor (${o.caseIdFor(c.caseNumber)} olmalı)`);
    }

    // --- sabit listeler
    if (typeof c.difficulty !== 'string' || !ctx.difficulties.includes(c.difficulty)) E(`difficulty geçersiz: ${JSON.stringify(c.difficulty)} (izinli: ${ctx.difficulties.join(', ')})`);
    const courseOk = typeof c.course === 'string' && ctx.courseIds.includes(c.course) && !(isNew && c.course === 'COMORBID');
    if (!courseOk) E(`course geçersiz: ${JSON.stringify(c.course)} (izinli: ${ctx.courseIds.filter(k => !(isNew && k === 'COMORBID')).join(', ')})`);
    const dx = ctx.dxById.get(c.diagnosisId);
    if (!dx) E(`diagnosisId tanı listesinde yok: ${JSON.stringify(c.diagnosisId)} (node tools/vaka_ekle/durum.js listeyi gösterir)`);
    else if (c.category !== dx.category) E(`category "${c.category}" yanlış: ${c.diagnosisId} tanısının kategorisi "${dx.category}"`);
    if (dx && !ctx.data.manual[c.diagnosisId]) E(`DSM5_MANUAL'da ${c.diagnosisId} girdisi yok`);
    if (!isNew && c.secondaryDiagnosisId !== undefined && !ctx.dxIds.has(c.secondaryDiagnosisId)) E(`secondaryDiagnosisId listede yok: ${c.secondaryDiagnosisId}`);
    if (typeof c.therapyId !== 'string' || !ctx.therapyIds.has(c.therapyId)) E(`therapyId geçersiz: ${JSON.stringify(c.therapyId)}`);
    let pharmaId = c.pharmacologyId;
    if (pharmaId !== undefined) {
        if (typeof pharmaId !== 'string' || !ctx.pharmaIds.has(pharmaId)) E(`pharmacologyId geçersiz: ${JSON.stringify(pharmaId)}`);
    } else if (isNew) {
        pharmaId = ctx.data.resolvePharma({ ...c, pharmacologyId: undefined });
        if (!ctx.pharmaIds.has(pharmaId)) E(`pharmacologyId yazılmamış ve otomatik çözülemedi (${pharmaId})`);
    }

    // --- metin alanları
    for (const k of ['patientSummary', 'differentialDiagnosis', 'dsmCriteriaSummary']) if (c[k] !== undefined && typeof c[k] !== 'string') E(`${k} metin (string) olmalı`);
    const clues = c.clues;
    const cluesOk = Array.isArray(clues) && clues.length === 6 && clues.every(x => typeof x === 'string');
    if (clues !== undefined && !cluesOk) E(`clues tam olarak 6 metinlik dizi olmalı (bulunan: ${Array.isArray(clues) ? clues.length + ' öğe' : typeof clues})`);

    if (typeof c.patientSummary === 'string') {
        for (const m of c.patientSummary.matchAll(/\(([^()]*)\)/g)) {
            if (!neutralParen(m[1], !isNew)) E(`patientSummary içinde etiket var: "(${m[1]})" — başlıkta yalnızca yaş, cinsiyet, meslek; parantezde en çok BKİ gibi nötr ölçü olabilir`);
        }
        if (isNew) {
            if (c.patientSummary.length > 90) W(`patientSummary uzun (${c.patientSummary.length} karakter); mevcutlar 17-71 karakter`);
            if (!/^\d+([.,]\d+)? yaşında, /.test(c.patientSummary)) W('patientSummary "NN yaşında, cinsiyet, meslek" biçiminde değil');
        }
    }

    // --- symptomHighlights
    const sh = c.symptomHighlights;
    if (sh !== undefined) {
        if (!Array.isArray(sh) || sh.length < 1 || sh.length > 4) E('symptomHighlights 1-4 öğelik dizi olmalı');
        else sh.forEach((h, i) => {
            if (!isObj(h)) { E(`symptomHighlights[${i}] nesne değil`); return; }
            const k = Object.keys(h).sort().join(',');
            if (k !== [...HIGHLIGHT_KEYS].sort().join(',')) E(`symptomHighlights[${i}] anahtarları tam olarak ${HIGHLIGHT_KEYS.join('/')} olmalı (bulunan: ${k})`);
            if (!Number.isInteger(h.clueIndex) || h.clueIndex < 0 || h.clueIndex > 5) E(`symptomHighlights[${i}].clueIndex 0-5 arası tam sayı olmalı (0 = 1. ipucu)`);
            else if (cluesOk && typeof h.text === 'string' && !clues[h.clueIndex].includes(h.text)) E(`symptomHighlights[${i}].text, ${h.clueIndex + 1}. ipucunda birebir geçmiyor: "${h.text}"`);
            if (typeof h.dsmMatch !== 'string') E(`symptomHighlights[${i}].dsmMatch metin olmalı`);
        });
    }

    // --- treatmentModality
    const tm = c.treatmentModality;
    if (tm !== undefined) {
        if (!isObj(tm)) E('treatmentModality nesne olmalı');
        else {
            const k = Object.keys(tm).sort().join(',');
            if (k !== [...TREATMENT_KEYS].sort().join(',')) E(`treatmentModality anahtarları tam olarak ${TREATMENT_KEYS.join('/')} olmalı (bulunan: ${k})`);
            TREATMENT_KEYS.forEach(x => { if (tm[x] !== undefined && typeof tm[x] !== 'string') E(`treatmentModality.${x} metin olmalı`); });
        }
    }

    // --- miniQuiz (biçim mevcut vakalardan)
    const q = c.miniQuiz;
    if (q !== undefined) {
        if (!isObj(q)) E('miniQuiz nesne olmalı');
        else {
            const k = Object.keys(q).sort().join(',');
            if (k !== ctx.quizKeys) E(`miniQuiz anahtarları tam olarak ${ctx.quizKeys} olmalı (bulunan: ${k})`);
            if (typeof q.question !== 'string') E('miniQuiz.question metin olmalı');
            if (typeof q.explanation !== 'string') E('miniQuiz.explanation metin olmalı');
            if (!Array.isArray(q.options) || q.options.length !== ctx.optCount || !q.options.every(x => typeof x === 'string')) E(`miniQuiz.options tam olarak ${ctx.optCount} metinlik dizi olmalı`);
            else if (new Set(q.options.map(o.norm)).size !== q.options.length) E('miniQuiz.options içinde aynı seçenek iki kez var');
            if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex >= ctx.optCount) E(`miniQuiz.correctIndex 0-${ctx.optCount - 1} arası tam sayı olmalı`);
        }
    }

    // --- explanation (vaka_aciklamalari/dogrula.js ile aynı kurallar)
    if (c.explanation !== undefined) {
        const r = dogrulaAciklama('explanation', c.explanation, c.diagnosisId, ctx.dxIds);
        r.errors.forEach(E);
        r.warnings.forEach(W);
    }

    if (!isNew) return { errors, warnings, pharmacologyId: pharmaId };

    // ================= yalnızca yeni vakalar: sızıntı, kopya, kalite uyarıları
    if (cluesOk && typeof c.patientSummary === 'string') {
        const terms = leakTerms(ctx, c);
        const places = [['patientSummary', c.patientSummary], ...clues.slice(0, 5).map((x, i) => [`${i + 1}. ipucu`, x])];
        for (const [where, text] of places) {
            const nt = o.norm(text);
            const hit = new Set();
            for (const t of terms) if (!hit.has(t.term) && o.containsTerm(nt, t.term)) { hit.add(t.term); E(`SIZINTI: ${where} içinde ${t.label} geçiyor (oyun bitmeden görünür; yalnızca 6. ipucunda olabilir)`); }
            if (/\((?:\d\.\s*)?(?:Eşlik Eden\s*)?Tanı[\s)-]/i.test(text)) E(`SIZINTI: ${where} içinde "(… Tanı)" etiketi var`);
        }
        if (o.containsTerm(o.norm(clues[5]), o.norm(dx ? dx.nameTr.replace(/\([^()]*\)/g, ' ') : '§'))) W('6. ipucu tanının adını açıkça söylüyor; tanıyı söylemeden belirleyici bulguyu vermek daha iyi');

        // --- kopya
        const h = o.contentHash(c);
        const allT = o.trigrams(clues.join(' '));
        const eachT = clues.slice(0, 5).map(x => o.trigrams(x));
        for (const other of [...ctx.corpus, ...batchSoFar]) {
            const where = other.batch ? `bu dosyadaki ${other.id}` : `${other.arsiv ? 'arşivlenmiş' : 'mevcut'} vaka ${other.id}`;
            if (other.hash === h) { E(`KOPYA: ${where} ile birebir aynı (zaten eklenmiş olabilir; ikinci kez eklenmez)`); continue; }
            const s = o.jaccard(allT, other.all);
            const sameDx = other.diagnosisId === c.diagnosisId;
            let close = 0;
            for (const a of eachT) for (const b of other.each) if (o.jaccard(a, b) >= SIM_CLUE) close++;
            if ((sameDx && s > SIM_SAME_DX) || s > SIM_ANY_DX || close >= SIM_CLUE_COUNT) {
                E(`KOPYA: ${where} ile çok benzer (ipucu benzerliği ${s.toFixed(2)}, neredeyse aynı ipucu sayısı ${close}${sameDx ? ', aynı tanı' : ''}); farklı bir hasta ve öykü yaz`);
            }
        }

        // --- uyarılar
        clues.forEach((x, i) => {
            const st = ctx.clueStats[i];
            if (x.length < st.lo || x.length > st.hi) W(`${i + 1}. ipucu ${x.length} karakter; mevcut vakalarda bu ipucu genelde ${st.lo}-${st.hi} karakter`);
        });
        const spec = ctx.kw.spec[c.diagnosisId];
        if (spec) {
            const hits = t => [...ctx.kw.stemsOf(t)].filter(s => spec.has(s));
            const h1 = hits(clues[0]);
            if (h1.length >= KW_CLUE1_WARN) W(`1. ipucu tanıya özgü ölçüt kelimeleri içeriyor (${h1.join(', ')}); tanı ilk ipucunda belli olabilir — 1. ipucu geniş bir başvuru yakınması olmalı`);
            const h15 = hits(clues.slice(0, 5).join(' ')), h6 = hits(clues[5]);
            if (h15.length === 0 && h6.length > 0) W('tanıya özgü ölçüt kelimeleri yalnızca 6. ipucunda var; 2-5. ipuçları da ölçütlere yaklaşmalı');
        }
    }
    if (dx) {
        const n = (ctx.dxCount[c.diagnosisId] || 0) + batchSoFar.filter(b => b.diagnosisId === c.diagnosisId).length;
        if (n >= MANY_CASES_WARN) W(`${c.diagnosisId} tanısının zaten ${n} vakası var; az vakalı tanıları seç (node tools/vaka_ekle/durum.js)`);
        const th = ctx.therapyByDx[c.diagnosisId];
        if (th && typeof c.therapyId === 'string' && !th.has(c.therapyId)) W(`therapyId "${c.therapyId}": bu tanının mevcut vakalarında ${[...th].join(', ')} kullanılmış`);
        const mapped = ctx.data.pharmaMap[c.diagnosisId];
        if (mapped && pharmaId && pharmaId !== mapped) W(`pharmacologyId "${pharmaId}": tanı→protokol haritası "${mapped}" diyor (bilerek seçtiysen sorun yok)`);
    }
    if (typeof c.differentialDiagnosis === 'string') {
        for (const line of c.differentialDiagnosis.split('\n')) {
            const m = /^\s*[•\-*]?\s*([^:]{2,80}):/.exec(line);
            if (!m) continue;
            const names = m[1].split('/').map(x => o.norm(x.replace(/\([^()]*\)/g, ' '))).filter(Boolean);
            const known = names.some(n => ctx.allNames.some(a => a === n || (a.length >= 5 && n.includes(a)) || (n.length >= 5 && a.includes(n))));
            if (!known) W(`differentialDiagnosis: "${m[1].trim()}" tanı listesindeki bir ada benzemiyor (tıbbi durumsa sorun yok)`);
        }
        const ids = c.differentialDiagnosis.match(/\b[a-z]+(?:_[a-z0-9]+)+\b/g) || [];
        ids.forEach(id => W(`differentialDiagnosis içinde id gibi bir ifade var: ${id}${ctx.dxIds.has(id) ? '' : ' (listede de yok)'}; metinde tanının Türkçe adını yaz`));
    }
    return { errors, warnings, pharmacologyId: pharmaId };
}

/** Yeni vakalar dizisini doğrular. Döner: { results: [{ label, assigned, errors, warnings }], errorCount, warningCount, ctx } */
function validateBatch(list, data) {
    const ctx = buildContext(data);
    const results = [];
    if (!Array.isArray(list)) {
        return { results: [{ label: 'dosya', errors: ['dosya bir JSON DİZİSİ olmalı: [ {vaka}, {vaka} ]'], warnings: [] }], errorCount: 1, warningCount: 0, ctx };
    }
    if (!list.length) return { results: [{ label: 'dosya', errors: ['dosyada hiç vaka yok'], warnings: [] }], errorCount: 1, warningCount: 0, ctx };
    const batchSoFar = [];
    list.forEach((c, i) => {
        const n = ctx.nextNumber + i;
        const r = validateCase(c, ctx, { mode: 'yeni', expectedNumber: n, batchSoFar });
        const label = `${i + 1}. vaka → ${o.caseIdFor(n)}${isObj(c) && c.diagnosisId ? ` (${c.diagnosisId})` : ''}`;
        results.push({ label, number: n, id: o.caseIdFor(n), pharmacologyId: r.pharmacologyId, errors: r.errors, warnings: r.warnings });
        if (isObj(c) && Array.isArray(c.clues)) {
            batchSoFar.push({ id: o.caseIdFor(n), batch: true, diagnosisId: c.diagnosisId, hash: o.contentHash(c),
                all: o.trigrams(c.clues.join(' ')), each: c.clues.slice(0, 5).map(x => o.trigrams(String(x))) });
        }
    });
    return { results, errorCount: results.reduce((a, r) => a + r.errors.length, 0), warningCount: results.reduce((a, r) => a + r.warnings.length, 0), ctx };
}

/** js/cases.js içindeki tüm vakalara yapısal kurallar (yayın öncesi). */
function validateExisting(data) {
    const ctx = buildContext(data);
    const results = [];
    const ids = new Set(), nums = new Set();
    const archivedIds = new Set(data.archived.map(a => a.id)), archivedNums = new Set(data.archived.map(a => a.caseNumber));
    for (const c of data.cases) {
        const r = validateCase(c, ctx, { mode: 'mevcut' });
        if (ids.has(c.id)) r.errors.push(`yinelenen id ${c.id}`);
        if (nums.has(c.caseNumber)) r.errors.push(`yinelenen caseNumber ${c.caseNumber}`);
        if (archivedIds.has(c.id) || archivedNums.has(c.caseNumber)) r.errors.push('arşivlenmiş bir vakanın id/numarasını kullanıyor');
        ids.add(c.id); nums.add(c.caseNumber);
        results.push({ label: String(c.id), errors: r.errors, warnings: r.warnings });
    }
    return { results, errorCount: results.reduce((a, r) => a + r.errors.length, 0), warningCount: results.reduce((a, r) => a + r.warnings.length, 0), ctx };
}

function printReport(res, { quiet = false, title = '' } = {}) {
    if (title) console.log(title);
    for (const r of res.results) {
        if (quiet && !r.errors.length) continue;
        if (!r.errors.length && !r.warnings.length) { console.log(`✓ ${r.label}: sorun yok`); continue; }
        console.log(`${r.errors.length ? '✗' : '✓'} ${r.label}: ${r.errors.length} hata, ${r.warnings.length} uyarı`);
        r.errors.forEach(e => console.log(`    HATA:  ${e}`));
        if (!quiet) r.warnings.forEach(w => console.log(`    uyarı: ${w}`));
    }
    console.log(`Özet: ${res.results.length} vaka | Hata: ${res.errorCount} | Uyarı: ${res.warningCount}`);
}

function readBatchFile(file) {
    const raw = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
    return JSON.parse(raw);
}

module.exports = { leakTerms, buildContext, validateCase, validateBatch, validateExisting, printReport, readBatchFile,
    THRESHOLDS: { SIM_SAME_DX, SIM_ANY_DX, SIM_CLUE, SIM_CLUE_COUNT, KW_CLUE1_WARN, MANY_CASES_WARN } };

if (require.main === module) {
    const argv = process.argv.slice(2);
    const root = o.rootFromArgs(argv);
    const quiet = argv.includes('--sessiz');
    const data = o.loadData(root);
    if (argv.includes('--mevcut')) {
        const res = validateExisting(data);
        printReport(res, { quiet: true, title: `Mevcut vakaların yapısal denetimi (js/cases.js, ${data.cases.length} vaka)` });
        process.exit(res.errorCount ? 1 : 0);
    }
    const kokIdx = argv.indexOf('--kok');
    const file = argv.find((a, i) => !a.startsWith('--') && !(kokIdx >= 0 && i === kokIdx + 1));
    if (!file) {
        console.error('Kullanım: node tools/vaka_ekle/dogrula.js <yeni_vakalar.json>   |   node tools/vaka_ekle/dogrula.js --mevcut');
        process.exit(2);
    }
    let list;
    try { list = readBatchFile(path.resolve(file)); } catch (e) {
        console.error(`HATA: ${file} okunamadı ya da geçerli JSON değil: ${e.message}`);
        console.error('İpucu: JSON içinde yorum, sonda fazladan virgül ya da kaçışsız çift tırnak olamaz.');
        process.exit(1);
    }
    const res = validateBatch(list, data);
    printReport(res, { quiet, title: `Yeni vaka doğrulaması: ${file} (sıradaki numara ${res.ctx.nextNumber})` });
    if (res.errorCount) console.log('SONUÇ: HATA VAR — ekle.js bu dosyayı kabul etmez. Hataları düzeltip tekrar çalıştır.');
    else console.log(`SONUÇ: Hata yok${res.warningCount ? ' (uyarıları gözden geçir, gerekirse düzelt)' : ''}. Sıradaki adım: node tools/vaka_ekle/ekle.js ${file}`);
    process.exit(res.errorCount ? 1 : 0);
}
