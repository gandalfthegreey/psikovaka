#!/usr/bin/env node
/**
 * Geliştirme sayfası üretir: tools/online_dev/harness.html
 * index.html'in birebir kopyası + js/online/*.js + css/online.css; Online ekranının içeriği
 * yeni merkezle (#onlineHubMount) değiştirilir. Yayınlanan site bu dosyayı kullanmaz.
 *   node tools/online_dev/make_harness.js          -> harness.html (canlı Supabase)
 *   harness.html?mock=1                              -> mock.js ile sahte sunucu (çevrimdışı arayüz testleri)
 */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const ONLINE_JS = ['core', 'api', 'realtime', 'views', 'friends', 'rooms', 'lobby_room', 'lobby', 'match', 'online'];

html = html.replace(/(src|href)="(js|css)\//g, '$1="../../$2/').replace('href="manifest.json"', 'href="../../manifest.json"');
if (!html.includes('../../css/online.css')) {
  html = html.replace('<link rel="stylesheet" href="../../css/arena.css">', '<link rel="stylesheet" href="../../css/arena.css">\n    <link rel="stylesheet" href="../../css/online.css">');
}
// Online ekranı: yeni merkez
const start = html.indexOf('<section class="screen" id="screenOnline"');
const end = html.indexOf('</section>', start) + '</section>'.length;
if (start < 0) throw new Error('screenOnline bulunamadı');
const onlineScreen = `<section class="screen" id="screenOnline" data-screen="online" aria-labelledby="onlineTitle" hidden>
            <header class="screen-head">
                <h1 class="screen-title" id="onlineTitle">Online</h1>
                <p class="screen-sub">Arkadaşlarınla ya da başka oyuncularla aynı vakaları aynı anda çöz.</p>
            </header>
            <div id="onlineHubMount" class="ol-hub-mount"></div>
        </section>`;
html = html.slice(0, start) + onlineScreen + html.slice(end);
const tags = ONLINE_JS.map(n => `    <script src="../../js/online/${n}.js"></script>`).join('\n');
const mock = `    <script>if (/[?&]mock=1/.test(location.search)) document.write('<script src="sinif_mock.js"><\\/script><script src="mock.js"><\\/script>');</script>`;
if (html.includes('../../js/online/online.js')) {
  // index.html modülleri zaten içeriyor (aşama 9 sonrası): yalnızca sahte sunucu kancası
  html = html.replace('    <script src="../../js/online/online.js"></script>', '    <script src="../../js/online/online.js"></script>\n' + mock);
} else {
  html = html.replace('    <script src="../../js/app.js"></script>', '    <script src="../../js/app.js"></script>\n' + tags + '\n' + mock);
}
html = html.replace('<title>', '<title>[GELİŞTİRME] ');
fs.writeFileSync(path.join(__dirname, 'harness.html'), html);
console.log('harness.html yazıldı (' + html.length + ' bayt)');
