// Zorluk ayarları (ajan Z1): pratik, günün vakası, özel oda (ayarlar + sunucu kuralları + Elo bonusu), sınıf modu,
// kategori/grup sızıntısı (DOM + yükler) ve "RP" → "Elo" metinleri. Sahte sunucu (mock.js, sinif_mock.js).
//   python3 -m http.server 8899 (proje kökü) → node tools/online_dev/tests/z1_zorluk.mjs
//   SHOTS=/klasor ile ekran görüntüleri o klasöre yazılır.
import { browser, ctx, page, check, sleep } from './lib.mjs';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const require = createRequire(import.meta.url);
const BASE = process.env.BASE || 'http://localhost:8899/tools/online_dev/harness.html';
const HAR = BASE + '?mock=1';
const SHOTS = process.env.SHOTS || '/tmp/z1shots';
fs.mkdirSync(SHOTS, { recursive: true });
async function shot(p, name, o) {
  // sahte sunucunun örnek davet afişi/hapı görüntüyü örtmesin
  await p.evaluate(() => { try { const NS = window.PsikoVakaOnline; if (NS && NS.ui) NS.ui.closeBanner('inv-inv1'); const pill = document.getElementById('playInvitePill'); if (pill) pill.hidden = true; document.querySelectorAll('.ol-banner').forEach(x => x.remove()); } catch (e) { /* yok */ } });
  await sleep(150);
  return p.screenshot(Object.assign({ path: `${SHOTS}/${name}.png` }, o || {}));
}
const visibleRP = (t) => /(^|[^A-Za-z_])RP([^A-Za-z_C]|$)/.test(t);   // "RPC" değil

const b = await browser();
async function open(label, o = {}) {
  const c = await ctx(b, { viewport: o.vp || { width: 390, height: 844 }, mobile: !!o.mobile, theme: o.theme || 'dark', dark: o.theme !== 'light' });
  await c.addInitScript((opt) => {
    try {
      localStorage.setItem('psikovaka_onboarded', '1'); localStorage.setItem('psikovaka_hint_list', '1');
      if (opt) { sessionStorage.setItem('olMockPersist', '1'); if (!sessionStorage.getItem('olMockState')) sessionStorage.setItem('olMockState', JSON.stringify({ state: null, opt, daily: {} })); }
    } catch (e) { /* yok */ }
  }, o.mockOpt || null);
  const p = await page(c, label);
  p._ctx = c;
  return p;
}
const ready = (p) => p.waitForFunction(() => window.olMock && window.game && window.PsikoVakaZorluk && window.PsikoVakaOnline && window.PsikoVakaOnline.leaguesView, null, { timeout: 20000 });
const playText = (p) => p.evaluate(() => document.getElementById('screenPlay').innerText);
/** Vakanın doğru tanısı, aynı gruptan bir yanlış ve başka gruptan bir yanlış (yerel veri). */
const pick = (p) => p.evaluate(() => {
  const g = window.game, c = g.currentCase, d = g.diagnoses.find(x => x.id === c.diagnosisId);
  const same = g.diagnoses.find(x => x.category === d.category && x.id !== d.id);
  const other = g.diagnoses.find(x => x.category !== d.category);
  const catName = (g.categories[c.category] || {}).name || '', dCat = (g.categories[d.category] || {}).name || '';
  return { right: d.nameTr, rightId: d.id, same: same && same.nameTr, sameId: same && same.id, other: other.nameTr, catName, dCat };
});
async function guess(p, name) {
  await p.fill('#diagnosisInput', name);
  await p.evaluate(() => { const el = document.getElementById('autocompleteDropdown'); if (el) el.classList.remove('open'); });
  await p.click('#btnSubmit');
  await sleep(350);
}

// ================================================================ 1. Sınırsız pratik
console.log('== 1) Pratik');
{
  const p = await open('pratik', { vp: { width: 390, height: 844 } });
  await p.goto(HAR + '#/oyna'); await ready(p);
  await p.evaluate(() => { localStorage.removeItem('psikovaka_zorluk'); });
  await p.reload(); await ready(p);
  await p.evaluate(() => window.game.openPracticeSettings()); await sleep(300);
  check(await p.locator('#practiceZor-tekHak').isVisible() && await p.locator('#practiceZor-kategoriGizli').isVisible(), 'pratik ayarlarında iki zorluk anahtarı');
  check(/Tek tahmin hakkı/.test(await p.locator('#practiceZorlukMount').innerText()) && /Kategori gizli/.test(await p.locator('#practiceZorlukMount').innerText()), 'Türkçe başlık ve açıklamalar');
  check((await p.getAttribute('#practiceZor-tekHak', 'aria-checked')) === 'false', 'varsayılan kapalı');
  await p.click('#practiceZor-tekHak'); await p.click('#practiceZor-kategoriGizli');
  const saved = await p.evaluate(() => JSON.parse(localStorage.getItem('psikovaka_zorluk') || '{}'));
  check(saved.tekHak === true && saved.kategoriGizli === true, 'seçim localStorage psikovaka_zorluk ' + JSON.stringify(saved));
  await p.locator('#practiceZorlukMount').scrollIntoViewIfNeeded();
  await shot(p, '01_pratik_ayarlar_zorluk_390');
  await p.reload(); await ready(p);
  await p.evaluate(() => window.game.openPracticeSettings()); await sleep(300);
  check((await p.getAttribute('#practiceZor-tekHak', 'aria-checked')) === 'true' && (await p.getAttribute('#practiceZor-kategoriGizli', 'aria-checked')) === 'true', 'yeniden yüklemede son seçim hatırlandı');
  check(/Zor: tek tahmin hakkı \+ kategori gizli/.test(await p.evaluate(() => document.getElementById('practiceSummary') ? document.getElementById('practiceSummary').textContent : '')), 'pratik özeti "Zor: …"');
  await p.click('#btnPracticeSheetStart'); await sleep(500);
  check(await p.locator('#playZorBadge .zor-badge').isVisible(), 'vaka başlığında "Zor" rozeti');
  check(/Zor/.test(await p.locator('#playZorBadge').innerText()) && (await p.locator('#playZorBadge .zor-badge-i').count()) === 2, 'rozette iki ayarın simgesi');
  check(/^Tek hak$/.test(await p.locator('#remainingGuessesText').innerText()) && (await p.locator('#guessDots .guess-dot').count()) === 1, 'kalan hak: "Tek hak" + tek nokta');
  check(await p.locator('#btnNextClue').isVisible(), '"Sonraki ipucu" düğmesi görünür');
  const k = await pick(p);
  const pt0 = await playText(p);
  check(!pt0.includes(k.catName) && !pt0.includes(k.dCat), `oyun sırasında vakanın grubu ekranda yok (${k.dCat})`);
  await p.click('#btnNextClue'); await sleep(250);
  check(await p.evaluate(() => window.game.unlockedClues === 2 && window.game.guesses.length === 0 && !window.game.isGameOver), 'Sonraki ipucu: 2. ipucu tahminsiz açıldı');
  check(/Sonraki ipucu ile açılır/.test(await p.locator('#cluesContainer').innerText()), 'kilitli ipucu notu "Sonraki ipucu ile açılır"');
  await p.evaluate(() => { const t = document.querySelector('.play-bar'); if (t) t.scrollIntoView(); });
  await shot(p, '03_pratik_tur_zor_rozet_390');
  await guess(p, k.same);
  check(await p.evaluate(() => window.game.isGameOver && !window.game.gameWon), 'tek hak: yanlış (aynı gruptan) tahmin vakayı bitirdi');
  const feed = await p.locator('#guessesFeed').innerText();
  check(/Yanlış/.test(feed) && !/Grup doğru/.test(feed), 'kategori gizli: "aynı grup" değil yalnızca "Yanlış"');
  check(await p.locator('#playResultZor .zor-badge').isVisible(), 'sonuç kartında "Zor" rozeti');
  const share = await p.evaluate(() => window.game.generateShareString(false));
  check(/Zor: tek hak \+ kategori gizli/.test(share) && /tek hak/.test(share), 'paylaşım metninde "Zor: tek hak + kategori gizli"');
  await p.evaluate(() => window.game.openResultModal(false)); await sleep(300);
  check(await p.locator('#resultZor .zor-badge').isVisible(), 'raporda "Zor" rozeti');
  check((await p.locator('#resultModal').innerText()).includes(k.right), 'raporda doğru cevap normal gösterilir');
  await p.evaluate(() => window.game.closeModal(document.getElementById('resultModal')));
  // yalnızca tek hak: 3. ipucunda doğru
  await p.evaluate(() => { window.game.practiceZorluk = { tekHak: true, kategoriGizli: false }; window.game.setMode('practice'); }); await sleep(400);
  const k2 = await pick(p);
  await p.click('#btnNextClue'); await sleep(150); await p.click('#btnNextClue'); await sleep(150);
  await guess(p, k2.right);
  check(/Tek hakla bildin · 3\. ipucunda/.test(await p.locator('#playResultTitle').innerText()), 'tek hak kazanç: "Tek hakla bildin · 3. ipucunda"');
  // yalnızca kategori gizli: 6 hak, aynı gruptan yanlış → "Yanlış", ipucu açılır
  await p.evaluate(() => { window.game.practiceZorluk = { tekHak: false, kategoriGizli: true }; window.game.setMode('practice'); }); await sleep(400);
  const k3 = await pick(p);
  check(!(await p.locator('#btnNextClue').isVisible()), 'tek hak kapalı: "Sonraki ipucu" yok');
  await guess(p, k3.same);
  const strip = await p.locator('#guessStrip').innerText();
  const pt3 = await playText(p);
  check(await p.evaluate(() => !window.game.isGameOver && window.game.unlockedClues === 2), 'kategori gizli (6 hak): yanlışta ipucu açıldı, oyun sürüyor');
  check(!/grup doğru/i.test(strip) && !pt3.includes(k3.dCat) && !(await p.locator('.guess-chip.is-close').count()), 'tahmin şeridinde grup bilgisi/adı yok');
  // normal (ayarsız): aynı grup bilgisi görünür (karşılaştırma)
  await p.evaluate(() => { window.game.practiceZorluk = { tekHak: false, kategoriGizli: false }; window.game.setMode('practice'); }); await sleep(400);
  const k4 = await pick(p);
  await guess(p, k4.same);
  check((await p.locator('.guess-chip.is-close').count()) === 1 && !(await p.locator('#playZorBadge .zor-badge').count()), 'ayarsız pratik: grup doğru görünür, rozet yok');
  check(p._errors.length === 0, 'pratik: konsol temiz ' + p._errors.slice(0, 2).join('|'));
  await p._ctx.close();
}

// ================================================================ 2. Günün vakası (üye, sahte sunucu)
console.log('== 2) Günün vakası');
{
  const p = await open('gunluk', { vp: { width: 390, height: 844 }, mockOpt: {} });
  await p.goto(HAR + '#/oyna'); await ready(p);
  await p.evaluate(() => { window.olMock.resetDaily(); window.game.setTargetGameMode('diagnosis', false); window.game.setMode('daily'); });
  await p.waitForFunction(() => window.game.currentMode === 'daily' && window.PsikoVakaOnline.daily.isServerDaily(), null, { timeout: 10000 });
  await sleep(300);
  check(await p.locator('#playZorlukPanel').isVisible(), 'günlük: ilk tahminden önce "Zorluk" paneli');
  check(!(await p.locator('#playZorBadge .zor-badge').count()), 'günlük: varsayılan ayarsız');
  await p.click('#dailyZor-tekHak'); await sleep(300);
  check(await p.evaluate(() => window.olMock.setZorCalls >= 1 && window.olMock.daily.diagnosis.tek_hak === true), 'tek hak sunucuya yazıldı (daily_begin p_tek_hak)');
  await p.click('#dailyZor-kategoriGizli'); await sleep(300);
  check(await p.evaluate(() => window.olMock.daily.diagnosis.kategori_gizli === true && window.game.zorluk.tekHak && window.game.zorluk.kategoriGizli), 'iki ayar açık (sunucu + oyun)');
  await shot(p, '04_gunluk_zorluk_paneli_390');
  await p.click('#btnNextClue'); await sleep(350);
  check(await p.evaluate(() => window.olMock.revealCalls === 1 && window.game.unlockedClues === 2), 'Sonraki ipucu sunucuda (daily_reveal_clue)');
  check(!(await p.locator('#playZorlukPanel').isVisible()) && await p.locator('#playZorBadge .zor-badge').isVisible(), 'ilk ek ipucundan sonra panel kilitli (gizli), rozet görünür');
  const lockTry = await p.evaluate(async () => { const r = await window.PsikoVakaOnline.api.dailySetZorluk('diagnosis', { tekHak: false, kategoriGizli: false }); return r.ok && r.data.tek_hak === true && r.data.zorluk_kilitli === true; });
  check(lockTry, 'kilitliyken sunucu ayarı değiştirmez');
  const k = await pick(p);
  await guess(p, k.same);
  check(await p.evaluate(() => window.game.isGameOver && !window.game.gameWon), 'günlük tek hak: yanlış tahmin bitirdi');
  const pl = await p.evaluate(() => window.olMock.payloads.filter(x => x[0] === 'daily_submit_guess').map(x => x[1]));
  check(pl.length === 1 && pl[0].same_group === false && pl[0].finished === true && !/"category"|group_id/.test(JSON.stringify(pl)), 'yük: same_group false, grup alanı yok');
  const second = await p.evaluate(async (id) => (await window.PsikoVakaOnline.api.dailySubmitGuess('diagnosis', id)).error, k.rightId);
  check(second && second.code === 'DAILY_ALREADY_FINISHED', 'sunucu: ikinci tahmin reddedildi (DAILY_ALREADY_FINISHED)');
  check(/Yanlış/.test(await p.locator('#guessesFeed').innerText()) && !/Grup doğru/.test(await p.locator('#guessesFeed').innerText()), 'günlük: grup geri bildirimi yok');
  check(/Zor: tek hak \+ kategori gizli/.test(await p.evaluate(() => window.game.generateShareString(false))), 'günlük paylaşım metninde "Zor"');
  // sıralama: "Zor" rozeti
  await p.evaluate(() => { location.hash = '#/gunluk'; }); await p.waitForSelector('.dl-list', { timeout: 10000 }); await sleep(300);
  const nz = await p.locator('.dl-list .dl-zor').count();
  check(nz >= 5, `günlük sıralamada "Zor" rozetleri (${nz})`);
  check(await p.locator('.dl-row.is-me .dl-zor, .dl-row.is-pinned .dl-zor').count() >= 1, 'kendi satırımda "Zor" rozeti');
  const lbl = await p.locator('.dl-row').nth(1).getAttribute('aria-label');
  check(/zor/.test(lbl || ''), 'erişilebilir ad "zor" içerir: ' + lbl);
  // ana sayfa kartı
  await p.evaluate(() => { location.hash = '#/oyna'; }); await sleep(600);
  check(await p.locator('#dailyResultTitle .zor-badge').count() === 1, 'ana sayfa günlük sonucunda "Zor" rozeti');
  // 0007 yok: ayar sunulmaz
  await p.evaluate(() => { window.olMock.set({ zorluk: 'unsupported' }); window.olMock.resetDaily(); window.PsikoVakaOnline.daily._reset(); window.game.setMode('daily'); });
  await p.waitForFunction(() => window.PsikoVakaOnline.daily.isServerDaily(), null, { timeout: 10000 }); await sleep(300);
  check(!(await p.locator('#playZorlukPanel').isVisible()) && !(await p.locator('#btnNextClue').isVisible()), 'sunucu zorluğu bilmiyorsa (0007 yok) panel ve düğme yok');
  check(p._errors.length === 0, 'günlük: konsol temiz ' + p._errors.slice(0, 2).join('|'));
  await p._ctx.close();
  // misafir (yerel günlük)
  const gq = await open('gunluk-misafir', { mockOpt: { guest: true } });
  await gq.goto(HAR + '#/oyna'); await ready(gq);
  await gq.evaluate(() => { localStorage.removeItem('psikovaka_daily_done'); window.game.setMode('daily'); });
  await gq.waitForFunction(() => window.game.currentMode === 'daily' && window.game.currentCase, null, { timeout: 15000 }); await sleep(300);
  check(await gq.locator('#playZorlukPanel').isVisible(), 'misafir günlük: panel var');
  await gq.click('#dailyZor-tekHak'); await sleep(150);
  const kg = await pick(gq);
  await gq.click('#btnNextClue'); await sleep(150);
  check(!(await gq.locator('#playZorlukPanel').isVisible()), 'misafir: ek ipucundan sonra kilit');
  await guess(gq, kg.right);
  const rec = await gq.evaluate(() => { const o = JSON.parse(localStorage.getItem('psikovaka_daily_done') || '{}'); return Object.values(o)[0]; });
  check(rec && rec.zorluk && rec.zorluk.tekHak === true && rec.cluesUsed === 2 && rec.won, 'misafir: yerel kayıtta zorluk ve ipucu sayısı');
  check(/Tek hakla bildin · 2\. ipucunda/.test(await gq.locator('#playResultTitle').innerText()), 'misafir: sonuç "Tek hakla bildin · 2. ipucunda"');
  await gq._ctx.close();
}

// ================================================================ 3. Özel oda: ayarlar, lobi, maç (sunucu kuralları), Elo bonusu
console.log('== 3) Online özel oda');
{
  const p = await open('oda', { vp: { width: 1440, height: 900 }, mockOpt: {} });
  await p.goto(HAR + '#/online'); await ready(p);
  await p.evaluate(() => window.PsikoVakaOnline.leaguesView.loadConfig()); await sleep(400);
  check(await p.evaluate(() => window.PsikoVakaOnline.leaguesView.zorlukSupported()), 'sunucu ayarlarında rp_zorluk_carpan_* var');
  await p.evaluate(() => window.PsikoVakaOnline.hub.openCreateSheet()); await p.waitForSelector('[data-ol-zorluk]');
  check(/Bir ayar açıkken kazandığın Elo ×1,25, ikisi açıkken ×1,5/.test(await p.locator('[data-ol-zorluk]').innerText()), 'oda kurma: Zorluk bölümü + bonus açıklaması');
  await p.click('#roomZor-tekHak');
  check(/Zorluk bonusu ×1,25/.test(await p.locator('[data-ol-zorluk]').innerText()), 'bir ayar: ×1,25');
  await p.click('#roomZor-kategoriGizli');
  check(/Zorluk bonusu ×1,5/.test(await p.locator('[data-ol-zorluk]').innerText()), 'iki ayar: ×1,5');
  await p.locator('[data-ol-zorluk]').scrollIntoViewIfNeeded();
  await shot(p, '02_oda_ayarlari_zorluk_bonus_1440');
  await p.click('[data-ol-action="create"]'); await sleep(800);
  check(await p.evaluate(() => { const o = window.olMock.lastCreate; return o.tekHak === true && o.kategoriGizli === true; }), 'create_room p_tek_hak + p_kategori_gizli gönderildi');
  await p.waitForSelector('#olLobbyChips'); await sleep(400);
  const chips = await p.locator('#olLobbyChips').innerText();
  check(/Tek hak/.test(chips) && /Kategori gizli/.test(chips) && /Elo ×1,5/.test(chips), 'lobi başlığı çipleri: Tek hak · Kategori gizli · Elo ×1,5 — ' + chips.replace(/\n/g, ' '));
  await shot(p, '06_lobi_cipleri_1440');
  // lobi ayarları
  await p.evaluate(() => window.olMock.set({ roomSettings: true }));
  await p.click('#olLobbySettingsBtn'); await p.waitForSelector('.ol-sheet [data-ol-zorluk]');
  check((await p.getAttribute('.ol-sheet #roomZor-tekHak', 'aria-checked')) === 'true' && (await p.getAttribute('.ol-sheet #roomZor-kategoriGizli', 'aria-checked')) === 'true', 'lobi ayarlarında mevcut zorluk işaretli');
  await p.click('.ol-sheet #roomZor-kategoriGizli');
  await p.click('.ol-sheet [data-ol-action="save"]'); await sleep(600);
  check(await p.evaluate(() => { const s = window.olMock.lastSettings; return s.tekHak === true && s.kategoriGizli === false; }), 'update_room_settings p_kategori_gizli=false');
  check(/Elo ×1,25/.test(await p.locator('#olLobbyChips').innerText()), 'lobi çipi güncellendi: Elo ×1,25');
  // maç: tek hak + kategori gizli; sunucu kuralları
  await p.evaluate(() => { window.olMock.set({ play: true }); const s = window.olMock.state; s.room.kategori_gizli = true; window.olMock.addPlayer(1); window.olMock.startRoom(); s.round.starts_at = new Date(Date.now() - 5000).toISOString(); window.olMock.clearPayloads(); window.PsikoVakaOnline.rooms.refresh(); });
  await p.waitForFunction(() => window.PsikoVakaOnline.app.view === 'play' && !document.getElementById('diagnosisInput').disabled, null, { timeout: 15000 });
  await sleep(400);
  check(await p.locator('#olHud .zor-badge').isVisible() && await p.locator('#playZorBadge .zor-badge').isVisible(), 'maç: HUD ve başlıkta "Zor" rozeti');
  const k = await pick(p);
  const pt = await playText(p);
  check(!pt.includes(k.dCat) && !pt.includes(k.catName), 'maç: vakanın tanı grubu ekranda yok');
  await p.click('#btnNextClue'); await sleep(400);
  check(await p.evaluate(() => window.olMock.revealCalls === 1 && window.game.unlockedClues === 2), 'maç: Sonraki ipucu → reveal_clue');
  await p.evaluate(() => window.scrollTo(0, 0)); await sleep(2600);   // bildirim kaybolsun
  await shot(p, '05_mac_tek_hak_kategori_gizli_1440');
  await guess(p, k.same); await sleep(300);
  const pl = await p.evaluate(() => window.olMock.payloads);
  const sg = pl.filter(x => x[0] === 'submit_guess').map(x => x[1]);
  check(sg.length === 1 && sg[0].same_group === false && sg[0].finished === true && sg[0].guesses_left === 0, 'sunucu: tek tahmin → bitti, same_group false');
  check(!/"category"|"group_id"|"course"/.test(JSON.stringify(pl)) && !JSON.stringify(pl).includes(k.dCat), 'yüklerde kategori/grup yok');
  const again = await p.evaluate(async (id) => { const s = window.PsikoVakaOnline.rooms.state; return (await window.PsikoVakaOnline.api.submitGuess(s.room.id, s.round.round_no, id)).error; }, k.rightId);
  check(again && again.code === 'ALREADY_FINISHED', 'sunucu: ikinci tahmin ALREADY_FINISHED');
  const st = await p.evaluate(() => JSON.stringify(window.olMock.state.my_guesses));   // get_room_state.my_guesses (sahte sunucu)
  check(/"same_group":false/.test(st), 'durumdaki tahminlerde same_group false');
  check(!/Grup doğru/.test(await playText(p)), 'maç: "Grup doğru" yazısı yok');
  // Elo bonusu: sunucu formülü (sahte, SQL testiyle aynı sayılar)
  const bd = await p.evaluate(() => [window.olMock.eloBreakdown([{ outcome: 'g3' }, { outcome: 'g6' }, { outcome: 'g1' }, { outcome: 'fail' }], { tekHak: true, placement: 10 }),
    window.olMock.eloBreakdown([{ outcome: 'g1' }, { outcome: 'g4' }, { outcome: 'fail' }, { outcome: 'g5' }], { tekHak: true, kategoriGizli: true, placement: 15 }),
    window.olMock.eloBreakdown([{ outcome: 'g1' }], { tekHak: true, kategoriGizli: true, quick: true })]);
  check(JSON.stringify(bd[0].rounds.map(r => r.delta)) === '[8,1,13,-10]' && bd[0].total === 22 && bd[0].zorluk_carpani === 1.25, 'bonus ×1,25: 6→8, 1→1, 10→13, −10 aynı; prim 10 çarpılmaz (toplam 22)');
  check(JSON.stringify(bd[1].rounds.map(r => r.delta)) === '[15,6,-10,3]' && bd[1].total === 29, 'bonus ×1,5: 10→15, 4→6, 2→3, −10 aynı; prim 15 (toplam 29)');
  check(bd[2].zorluk_carpani === 1 && bd[2].rounds[0].delta === 10, 'hızlı oda: çarpan 1');
  // maç sonu dökümü
  await p.evaluate((b0) => {
    window.olMock.scenario('final', { n: 2 });
    const s = window.olMock.state; s.room.tek_hak = true; s.room.kategori_gizli = true;
    s.results.forEach(r => { r.rp_breakdown = b0; r.rp_delta = b0.total; });
    s.results[0].rp_after = 790;
    window.PsikoVakaOnline.rooms.refresh();
  }, bd[1]);
  await p.waitForSelector('.ol-final-view'); await sleep(400);
  await p.locator('.ol-rpbd summary').click(); await sleep(200);
  const fin = await p.locator('.ol-rpbd').innerText();
  check(/Zorluk bonusu ×1,5/.test(fin) && /\(\+10 ×1,5\)/.test(fin) && /Tek hakla, 1\. ipucunda çözdün/.test(fin), 'maç sonu dökümü: "Zorluk bonusu ×1,5", "(+10 ×1,5)", tek hak sonucu');
  check(/Bu maçın Elo dökümü/.test(fin) && !visibleRP(await p.locator('.ol-final-view').innerText()), 'maç sonu: "Elo", görünür "RP" yok');
  await p.locator('.ol-rpbd').scrollIntoViewIfNeeded();
  await shot(p, '07_mac_sonu_zorluk_bonusu_1440');
  // 0007 yok: bölüm yok, normal oda
  await p.evaluate(() => { window.olMock.set({ zorluk: 'unsupported', play: false }); window.PsikoVakaOnline.leaguesView.invalidate(); window.PsikoVakaOnline.app.exitToHub(); });
  await p.evaluate(() => window.PsikoVakaOnline.leaguesView.loadConfig()); await sleep(300);
  await p.evaluate(() => window.PsikoVakaOnline.hub.openCreateSheet()); await sleep(500);
  check(!(await p.locator('.ol-sheet [data-ol-zorluk]').count()), '0007 yok: oda kurmada Zorluk bölümü yok');
  await p.click('.ol-sheet [data-ol-action="create"]'); await sleep(600);
  check(await p.evaluate(() => { const o = window.olMock.lastCreate; return !o.tekHak && !o.kategoriGizli; }) && await p.evaluate(() => !!window.olMock.state), '0007 yok: oda normal kurallarla kuruldu');
  check(p._errors.length === 0, 'oda: konsol temiz ' + p._errors.slice(0, 2).join('|'));
  await p._ctx.close();
}

// ================================================================ 4. Elo metinleri (görünür "RP" kalmadı)
console.log('== 4) Elo metinleri');
{
  const p = await open('elo', { vp: { width: 1440, height: 900 }, mockOpt: {} });
  await p.goto(HAR + '#/ligler'); await ready(p);
  await p.waitForSelector('.lg-head-rp', { timeout: 10000 }); await sleep(800);
  const t = await p.evaluate(() => document.getElementById('leaguesMount').textContent.replace(/\s+/g, ' '));
  if (process.env.DEBUG) console.log(t.slice(0, 1500));
  check(/760 Elo/.test(t) && /Ligler|Ligin/.test(t) && !visibleRP(t), 'lig sayfası: "760 Elo", görünür RP yok');
  check(/Zorluk bonusu \(yalnızca özel odalar\)/.test(t) && /×1,25/.test(t) && /×1,5/.test(t), 'lig sayfası: zorluk bonusu kuralları');
  await shot(p, '08_lig_sayfasi_elo_1440', { fullPage: true });
  for (const h of ['#/oyna', '#/profil', '#/online']) {
    await p.evaluate((x) => { location.hash = x; }, h); await sleep(900);
    const body = await p.evaluate(() => document.body.innerText);
    check(!visibleRP(body), `${h}: görünür "RP" yok`);
  }
  check(/\d+ Elo/.test(await p.evaluate(() => document.body.innerText)), 'online merkezi / üst çubuk Elo yazar');
  await p.evaluate(() => window.game.openModal(document.getElementById('helpModal'))); await sleep(300);
  const help = await p.locator('#helpModal').innerText();
  check(/Elo/.test(help) && /Tek tahmin hakkı/.test(help) && /Kategori gizli/.test(help) && !visibleRP(help), '"Nasıl oynanır": Elo + Zorluk anlatımı');
  // kaynak taraması: arayüz metinlerinde " RP" kalmadı (yorumlar ve kimlikler hariç)
  const files = ['index.html', 'js/app.js', 'js/leagues.js', 'js/zorluk.js', ...fs.readdirSync(path.join(ROOT, 'js/online')).map(f => 'js/online/' + f)];
  const bad = [];
  for (const f of files) fs.readFileSync(path.join(ROOT, f), 'utf8').split('\n').forEach((ln, i) => { const s = ln.trim(); if (s.startsWith('//') || s.startsWith('*') || s.startsWith('/*') || s.startsWith('<!--')) return; if (/(^|[^A-Za-z_])RP([^A-Za-z_C0-9]|$)/.test(ln.replace(/\/\/.*$/, ''))) bad.push(`${f}:${i + 1}`); });
  check(!bad.length, 'kaynakta arayüz metni olarak "RP" yok ' + bad.slice(0, 5).join(', '));
  await p._ctx.close();
}

// ================================================================ 5. Sınıf modu (Node'da tek sahte sunucu)
console.log('== 5) Sınıf modu');
{
  const vctx = {}; vm.createContext(vctx);
  for (const f of ['diagnoses', 'cases']) vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', f + '.js'), 'utf8').replace(/^const /mg, 'var '), vctx);
  const DX = vctx.DIAGNOSES_DATABASE;
  const FILTRE = require(path.join(ROOT, 'js', 'isim_filtresi.js'));
  const SM = require(path.join(ROOT, 'tools', 'online_dev', 'sinif_mock.js'));
  let skew = 0;
  const E = SM.create({ cases: vctx.CLINICAL_CASES, diagnoses: DX, isimUygun: (n) => FILTRE.check(n).ok, now: () => Date.now() + skew, kod: 'Z1Q2MX', seed: 3 });
  const subs = [];
  E.on(ev => subs.forEach(s => { if ((ev.new.oturum_id || ev.new.id) !== s.oturum) return; if (!s.host && ev.table !== 'sinif_oturumlari') return; if (!E.canSee(s.uid, ev)) return; s.page.evaluate(e => window.__sinifPush && window.__sinifPush(e), ev).catch(() => {}); }));
  const wire = async (c) => {
    await c.exposeBinding('__sinifRpc', (src, id, fn, args) => { if (id) E.users[id.uid] = { username: id.username || null, display_name: id.display_name || null, avatar: id.avatar || {}, anonymous: !!id.anonymous }; return E.call(id && id.uid, fn, args); });
    await c.exposeBinding('__sinifSelect', (src, id, table, q) => (table === 'profiles' ? { data: [], error: null } : { data: E.select(id.uid, table, q).data, error: null }));
    await c.exposeBinding('__sinifSub', (src, uid, oturum, host) => { subs.push({ page: src.page, uid, oturum, host }); });
    await c.exposeBinding('__sinifUnsub', () => {});
  };
  const mk = async (label, vp, mockOpt, mobile) => {
    const c = await ctx(b, { viewport: vp, mobile, theme: 'dark' }); await wire(c);
    await c.addInitScript((opt) => { try { sessionStorage.setItem('olMockPersist', '1'); if (!sessionStorage.getItem('olMockState')) sessionStorage.setItem('olMockState', JSON.stringify({ state: null, opt, daily: {} })); } catch (e) { /* yok */ } }, mockOpt);
    const p = await page(c, label); p._ctx = c; return p;
  };
  const P = await mk('proj', { width: 1920, height: 1080 }, {}, false);
  await P.goto(HAR + '#/online');
  await P.waitForSelector('#olSinifSlot:not([hidden]) [data-sn-hub="setup"]', { timeout: 15000 });
  await P.evaluate(() => window.PsikoVakaOnline.leaguesView.loadConfig()); await sleep(300);
  await P.click('[data-sn-hub="setup"]'); await P.waitForSelector('.sinif-setup [data-sn-zorluk]');
  check(await P.locator('.sinif-setup input[name="tahmin_hakki"][value="3"]').isChecked(), 'sınıf kurulumu: tahmin hakkı 3, zorluk anahtarları var');
  await P.click('#snZor-tekHak'); await sleep(200);
  check(await P.locator('.sinif-setup input[name="tahmin_hakki"][value="1"]').isChecked() && await P.locator('.sinif-setup input[name="tahmin_hakki"][value="3"]').isDisabled(), 'tek hak: tahmin hakkı 1 ve alan kilitli');
  await P.click('#snZor-kategoriGizli'); await sleep(200);
  await P.click('.ol-chip:has(input[name="vaka_sayisi"][value="3"])');
  await P.locator('[data-sn-zorluk]').scrollIntoViewIfNeeded();
  await shot(P, '09_sinif_kurulum_zorluk_1920');
  await P.click('#snZor-tekHak'); await sleep(150);
  check(!(await P.locator('.sinif-setup input[name="tahmin_hakki"][value="3"]').isDisabled()), 'tek hak kapanınca alan açılır');
  await P.click('#snZor-tekHak'); await sleep(150);
  await P.click('[data-ol-action="start"]'); await P.waitForSelector('.sp-code', { timeout: 10000 });
  const SID = await P.evaluate(() => window.PsikoVakaOnline.sinif.state.id);
  const ses = E.ic(SID);
  check(ses.ayarlar.tek_hak === true && ses.ayarlar.kategori_gizli === true && ses.ayarlar.tahmin_hakki === 1, 'sinif_olustur: tek_hak + kategori_gizli, tahmin hakkı 1');
  check(/Tek tahmin hakkı/.test(await P.locator('.sp-settings').innerText()) && /Kategori gizli/.test(await P.locator('.sp-settings').innerText()), 'projeksiyon lobisinde ayarlar');
  const T = await mk('tel', { width: 390, height: 844 }, { guest: true }, true);
  await T.goto(HAR + '#/katil/' + ses.kod); await T.waitForSelector('[data-sn-join]', { timeout: 15000 });
  await T.fill('#snName', 'Ada'); await T.click('.sinif-join-btn'); await sleep(1200);
  const host = Object.keys(E.users).find(u => !E.users[u].anonymous);
  E.users['00000000-0000-4000-a000-0000000000c2'] = { anonymous: true };   // ikinci öğrenci: tur açık kalsın
  E.call('00000000-0000-4000-a000-0000000000c2', 'sinif_katil', { p_kod: ses.kod, p_takma_ad: 'Can' });
  E.call(host, 'sinif_basla', { p_oturum: SID });
  skew += 4000;
  for (const x of [P, T]) await x.evaluate(() => window.PsikoVakaOnline.sinifApi.ozet(window.PsikoVakaOnline.sinif.state.id)).catch(() => {});
  await sleep(1500);
  await T.waitForSelector('#snGuess', { timeout: 10000 });
  const ans = E.ic(SID).vakalar[0].diagnosisId;
  const cat = DX.find(d => d.id === ans).category;
  const same = DX.find(d => d.category === cat && d.id !== ans);
  const projTxt = await P.locator('#sinifLayer').innerText();
  const catName = vctx.DSM_CATEGORIES ? '' : '';
  void catName;
  check(await P.locator('.sp-head .zor-badge').isVisible() && await T.locator('.st-zor').isVisible(), 'projeksiyon ve telefon başlığında "Zor" rozeti');
  check(!/Aynı grup|aynı tanı grubu/i.test(projTxt), 'projeksiyon: tur sırasında grup bilgisi yok');
  check(/1/.test(await T.locator('[data-sn-dock]').innerText()), 'telefon: tek hak göstergesi');
  await shot(T, '10_telefon_tek_hak_390');
  await T.fill('#snGuess', same.nameTr);
  const pk = T.locator(`[data-sn-pick="${same.id}"]`);
  if (await pk.count()) await pk.first().click(); else await T.press('#snGuess', 'Enter');
  await sleep(700);
  const fb = await T.locator('#sinifLayer').innerText();
  if (process.env.DEBUG) console.log('FB', fb.slice(0, 800));
  check(!/aynı tanı grubunda|Aynı grup/i.test(fb) && /Hakların bitti|değil|Yanlış\. 0 hak|bilemedin/.test(fb), 'telefon: aynı gruptan yanlış → yalnızca "değil", "aynı grup" yok; tek hak bitti');
  const r = E.ic(SID).tahminler[0];
  check(r && r.ayni_grup === false, 'sunucu: ayni_grup false yazıldı');
  await shot(T, '11_telefon_tek_hak_bitti_390');
  check(P._errors.length === 0 && T._errors.length === 0, 'sınıf: konsol temiz ' + P._errors.concat(T._errors).slice(0, 2).join('|'));
  await P._ctx.close(); await T._ctx.close();
}

await b.close();
console.log(`SONUÇ ${check.oks || 0} ok / ${check.fails || 0} fail`);
process.exit(check.fails ? 1 : 0);
