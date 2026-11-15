/**
 * PsikoVaka — vaka sonrası açıklama ("Neden bu tanı, neden diğerleri değil?").
 * window.PsikoVakaExplain. Bağımlılık yok; tanı adları için game.diagnoses (yoksa DIAGNOSES_DATABASE).
 *
 * Vaka alanı (isteğe bağlı, js/cases.js):
 *   explanation: { whyThis: string[2..4], whyNot: [{ diagnosisId, reason }] (2..3), teachingPoint: string }
 *
 * Kural: yalnızca vaka BİTTİKTEN sonra çağrılır (çağıran taraf denetler). Alan yoksa '' döner:
 * çağıran yer bugünkü gibi çizilir.
 *
 * render(caseObj, opts) -> HTML
 *   opts.wrongIds   oyuncunun yanlış TANI tahminleri (id dizisi): eşleşen satır "Senin tahminin" ile en üstte
 *   opts.links      true ise tanı adları kütüphane sayfasına bağlanır (#/kutuphane/tani/<id>)
 *   opts.collapsed  true ise ayrıntılar "Açıklamayı gör" açılır alanında kapalı başlar (öğretici nokta hep görünür)
 *   opts.idPrefix   aynı sayfada birden çok kopya için başlık kimliği öneki
 */
(function (global) {
    'use strict';

    const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, c => ESC[c]);
    const icon = (n) => `<svg class="icon" aria-hidden="true"><use href="#i-${n}"/></svg>`;

    function diagnoses() {
        const g = global.game;
        if (g && Array.isArray(g.diagnoses)) return g.diagnoses;
        return (typeof DIAGNOSES_DATABASE !== 'undefined' && Array.isArray(DIAGNOSES_DATABASE)) ? DIAGNOSES_DATABASE : [];
    }
    function diagName(id) {
        const d = diagnoses().find(x => x.id === id);
        return d ? d.nameTr : null;
    }

    /** Alan geçerli mi? (bozuk/yarım veri sessizce yok sayılır) */
    function get(caseObj) {
        const x = caseObj && caseObj.explanation;
        if (!x || typeof x !== 'object') return null;
        const whyThis = Array.isArray(x.whyThis) ? x.whyThis.filter(s => typeof s === 'string' && s.trim()) : [];
        const whyNot = Array.isArray(x.whyNot) ? x.whyNot.filter(r => r && typeof r.reason === 'string' && r.reason.trim() && typeof r.diagnosisId === 'string') : [];
        const teachingPoint = typeof x.teachingPoint === 'string' ? x.teachingPoint.trim() : '';
        if (!whyThis.length && !whyNot.length && !teachingPoint) return null;
        return { whyThis, whyNot, teachingPoint };
    }
    function has(caseObj) { return !!get(caseObj); }

    /** "Senin tahminin" önce; diğerleri veri sırasında. */
    function orderedWhyNot(x, wrongIds) {
        const mine = new Set(wrongIds || []);
        const rows = x.whyNot.map((r, i) => ({ r, i, mine: mine.has(r.diagnosisId) }));
        rows.sort((a, b) => (b.mine - a.mine) || (a.i - b.i));
        return rows;
    }

    let seq = 0;
    function render(caseObj, opts) {
        const x = get(caseObj);
        if (!x) return '';
        const o = opts || {};
        const id = (o.idPrefix || 'xp') + (++seq);
        const rows = orderedWhyNot(x, o.wrongIds);
        const mineCount = rows.filter(r => r.mine).length;

        const takeaway = x.teachingPoint ? `
            <p class="xp-takeaway">${icon('zap')}<span><span class="xp-takeaway-label">Akılda kalsın:</span> ${esc(x.teachingPoint)}</span></p>` : '';

        const why = x.whyThis.length ? `
            <section class="xp-block" aria-labelledby="${id}a">
                <h3 class="xp-h" id="${id}a">Neden bu tanı?</h3>
                <ul class="xp-list">${x.whyThis.map(s => `<li>${icon('check')}<span>${esc(s)}</span></li>`).join('')}</ul>
            </section>` : '';

        const not = rows.length ? `
            <section class="xp-block" aria-labelledby="${id}b">
                <h3 class="xp-h" id="${id}b">Neden diğerleri değil?</h3>
                <ul class="xp-alts">${rows.map(({ r, mine }) => {
                    const name = diagName(r.diagnosisId);
                    const label = esc(name || r.diagnosisId);
                    const nameHtml = (o.links && name)
                        ? `<a class="xp-alt-name" href="#/kutuphane/tani/${encodeURIComponent(r.diagnosisId)}">${label}</a>`
                        : `<span class="xp-alt-name">${label}</span>`;
                    return `<li class="xp-alt${mine ? ' is-mine' : ''}">
                        <span class="xp-alt-head">${nameHtml}${mine ? '<span class="xp-mine-tag">Senin tahminin</span>' : ''}</span>
                        <span class="xp-alt-reason">${esc(r.reason)}</span>
                    </li>`;
                }).join('')}</ul>
            </section>` : '';

        const body = `<div class="xp-body">${why}${not}</div>`;
        const title = 'Neden bu tanı, neden diğerleri değil?';
        if (o.collapsed) {
            return `<section class="xp" aria-label="${esc(title)}">
                ${takeaway}
                <details class="xp-more">
                    <summary class="xp-summary"><span>Açıklamayı gör</span>${mineCount ? '<span class="xp-mine-tag">Senin tahminin de var</span>' : ''}</summary>
                    ${body}
                </details>
            </section>`;
        }
        return `<section class="xp" aria-label="${esc(title)}">${takeaway}${body}</section>`;
    }

    global.PsikoVakaExplain = { has, get, render, orderedWhyNot };
})(typeof window !== 'undefined' ? window : globalThis);
