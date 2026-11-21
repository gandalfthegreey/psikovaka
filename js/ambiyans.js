/**
 * PsikoVaka — Ambiyans (ajan B4, 2026-11-21). Yalnızca süs: hiçbir oyun bilgisi okumaz/göstermez.
 *
 * Renk bulutu arka planı: <body>'nin başına .amb-bg (4 yumuşak radyal gradyan; css/ambiyans.css'te yavaş kayar,
 * hareket azaltmada duruk). Sekme gizliyken <html>.amb-hidden → animasyon durur.
 *
 * Not: kenar boşluğu Nöro'ları Emre isteğiyle (2026-11-21, "kenar nöroları hiçbir yerde istemiyorum") kaldırıldı;
 * eski kod _arsiv/2026-11-21-b4-kenar-norolari/ambiyans_kenar_norolari.js içinde.
 */
(function () {
    'use strict';
    const doc = document;
    const root = doc.documentElement;

    function mountBg() {
        if (doc.querySelector('.amb-bg')) return;
        const bg = doc.createElement('div');
        bg.className = 'amb-bg';
        bg.setAttribute('aria-hidden', 'true');
        bg.innerHTML = '<span class="amb-blob amb-b1"></span><span class="amb-blob amb-b2"></span><span class="amb-blob amb-b3"></span><span class="amb-blob amb-b4"></span>';
        doc.body.insertBefore(bg, doc.body.firstChild);
    }

    function onVisibility() { root.classList.toggle('amb-hidden', !!doc.hidden); }

    function init() {
        mountBg();
        onVisibility();
        doc.addEventListener('visibilitychange', onVisibility);
    }

    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
    else init();
})();
