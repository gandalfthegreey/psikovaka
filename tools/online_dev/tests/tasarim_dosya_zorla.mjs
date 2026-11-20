// Tasarım pilotu "Danışan dosyası" (ajan D2): mevcut Playwright paketlerini bayrak AÇIK çalıştırmak için ön yükleme.
// Kullanım (proje kökünde, sunucu 8899'da):  node --import ./tools/online_dev/tests/tasarim_dosya_zorla.mjs tools/online_dev/tests/p_leak.mjs
// Her yeni bağlamda localStorage 'psikovaka_tasarim' okuması 'dosya' döner (testin kendi localStorage.clear() çağrısından etkilenmez);
// böylece index.html'deki küçük betik <html class="tasarim-dosya"> koyar. Test dosyalarına dokunmaz.
import { chromium } from 'playwright';

const FORCE = () => {
    try {
        const orig = Storage.prototype.getItem;
        Storage.prototype.getItem = function (k) { return k === 'psikovaka_tasarim' ? 'dosya' : orig.call(this, k); };
    } catch (e) { /* yok */ }
};
const origLaunch = chromium.launch.bind(chromium);
chromium.launch = async (...args) => {
    const b = await origLaunch(...args);
    const origNewContext = b.newContext.bind(b);
    b.newContext = async (...a) => { const c = await origNewContext(...a); await c.addInitScript(FORCE); return c; };
    const origNewPage = b.newPage.bind(b);
    b.newPage = async (...a) => { const p = await origNewPage(...a); await p.addInitScript(FORCE); return p; };
    return b;
};
if (process.env.TASARIM_DOSYA_SESSIZ !== '1') console.log('[tasarim_dosya_zorla] bayrak AÇIK: html.tasarim-dosya');
