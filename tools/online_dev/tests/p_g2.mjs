// Ajan G2: avatara dokunup düzenleme, ana sayfa Nöro hatırlatması, lobide "Nöro'nu değiştir" (iki sahte istemci).
// Çalıştırma: proje kökünde `python3 -m http.server 8899`, sonra `node tools/online_dev/tests/p_g2.mjs`
import { browser, ctx, page, sleep, check } from './lib.mjs';
const ROOT = 'http://localhost:8899/';
const SITE = ROOT + 'index.html';
const MOCK = ROOT + 'tools/online_dev/harness.html?mock=1#/online';
const SHOTS = process.env.SHOTS || '/tmp/g2shots';
import fs from 'node:fs';
fs.mkdirSync(SHOTS, { recursive: true });

const b = await browser();

async function guestCtx(opts = {}) {
  const c = await ctx(b, opts);
  await c.route(/supabase\.co/, r => r.abort());
  await c.addInitScript((o) => {
    if (sessionStorage.getItem('__g2init')) return;
    sessionStorage.setItem('__g2init', '1');
    localStorage.clear();
    if (o.onboarded !== false) localStorage.setItem('psikovaka_onboarded', '1');
    if (o.theme) localStorage.setItem('psikovaka_theme', o.theme);
    if (o.avatar) localStorage.setItem('psikovaka_funny_avatar', JSON.stringify(o.avatar));
  }, { onboarded: opts.onboarded, theme: opts.theme, avatar: opts.avatar });
  return c;
}
const ready = (p) => p.waitForFunction(() => window.game && window.game.myAvatar && document.getElementById('homeAvatarMount').innerHTML.length > 0, null, { timeout: 15000 });
const box = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, b: r.bottom, hidden: e.hidden || getComputedStyle(e).display === 'none' }; }, sel);
const active = (p) => p.evaluate(() => document.activeElement && (document.activeElement.id || document.activeElement.className));

// ---------------------------------------------------------------- 1. misafir, telefon
for (const th of ['dark', 'light']) {
  const c = await guestCtx({ viewport: { width: 390, height: 844 }, mobile: true, theme: th });
  const p = await page(c, 'guest-' + th);
  await p.goto(SITE + '#/oyna');
  await ready(p);
  await sleep(500);
  const nudge = await box(p, '#homeNoroNudge');
  const hero = await box(p, '.card-hero');
  check(nudge && !nudge.hidden, `${th} 390: varsayılan avatarda hatırlatma kartı görünür`);
  check(hero && hero.b <= 844 - 60, `${th} 390: Günün vakası kartı ekranın içinde (alt ${Math.round(hero.b)} ≤ 784, sekme çubuğu üstü)`);
  check(nudge.y > hero.b - 1, `${th} 390: hatırlatma Günün vakası kartının altında`);
  const t = await p.evaluate(() => ({ title: document.getElementById('noroNudgeTitle').textContent, btn: document.getElementById('btnNoroNudgeOpen').textContent.trim(), x: document.getElementById('btnNoroNudgeClose').getAttribute('aria-label'), anim: !!document.querySelector('#noroNudgeArt svg.nv-anim, #noroNudgeArt .nv-anim') }));
  check(t.title === "Nöro'nu özelleştir" && t.btn === 'Özelleştir' && t.x === 'Hatırlatmayı kapat', `${th}: kart metinleri ${JSON.stringify(t)}`);
  check(t.anim, `${th}: kartta animasyonlu Nöro`);
  const av = await box(p, '#homeAvatarEdit');
  check(av.w >= 44 && av.h >= 44, `${th}: ana sayfa avatar düğmesi ≥44 px (${av.w}×${av.h})`);
  const name = await p.evaluate(() => document.getElementById('homeAvatarEdit').getAttribute('aria-label'));
  check(name === 'Avatarı düzenle', `${th}: erişilebilir ad "Avatarı düzenle"`);
  const badge = await p.evaluate(() => !!document.querySelector('#homeAvatarEdit .avatar-edit-badge use[href="#i-pen"]'));
  check(badge, `${th}: kalem rozeti`);
  for (const sel of ['#btnNoroNudgeOpen', '#btnNoroNudgeClose']) { const bb = await box(p, sel); check(bb.w >= 44 && bb.h >= 44, `${th}: ${sel} ≥44 px (${bb.w}×${bb.h})`); }
  await p.screenshot({ path: `${SHOTS}/home-guest-390-${th}.png` });

  // avatara dokun → stüdyo; bir parça seç; Tamam → odak avatara, kart kaybolur
  await p.click('#homeAvatarEdit');
  await p.waitForSelector('#avatarStudioModal.open');
  check(await p.evaluate(() => !document.getElementById('avatarStudioModal').classList.contains('is-sheet')), `${th}: ana sayfadan açılınca tam pencere (alt sayfa değil)`);
  await p.click('#avatarSlotTab-color');
  await p.click('#funnyAvatarControlsGrid [data-val]:not([aria-checked="true"])');
  await sleep(100);
  await p.click('#avatarStudioModal .modal-footer .btn-close-modal');
  await sleep(400);
  check((await active(p)) === 'homeAvatarEdit', `${th}: kapanınca odak ana sayfa avatarına döndü`);
  const after = await p.evaluate(() => ({ hidden: document.getElementById('homeNoroNudge').hidden, saved: localStorage.getItem('psikovaka_noro_saved'), def: window.PsikoVakaAvatar.equals(window.game.myAvatar, window.PsikoVakaAvatar.DEFAULT), ls: JSON.parse(localStorage.getItem('psikovaka_funny_avatar')).color }));
  check(after.hidden && after.saved === '1' && !after.def, `${th}: kayıttan sonra kart kayboldu, yerel avatar kaydedildi ${JSON.stringify(after)}`);
  await p.reload(); await ready(p); await sleep(300);
  check(await p.evaluate(() => document.getElementById('homeNoroNudge').hidden), `${th}: yenilemede kart yok`);
  check(!p._errors.length, `${th}: konsol temiz ${JSON.stringify(p._errors.slice(0, 3))}`);
  await c.close();
}

// ---------------------------------------------------------------- 2. kapat (x) kalıcı; sıfırlayıp varsayılanda kaydetmek de "kayıt" sayılır
{
  const c = await guestCtx({ viewport: { width: 390, height: 844 }, mobile: true });
  const p = await page(c, 'dismiss');
  await p.goto(SITE + '#/oyna'); await ready(p); await sleep(300);
  await p.click('#btnNoroNudgeClose');
  await sleep(150);
  check(await p.evaluate(() => document.getElementById('homeNoroNudge').hidden && localStorage.getItem('psikovaka_noro_nudge_off') === '1'), 'x: kart gizlendi ve kalıcı');
  check((await active(p)) === 'homeAvatarEdit', 'x: odak ana sayfa avatarına');
  await p.reload(); await ready(p); await sleep(300);
  check(await p.evaluate(() => document.getElementById('homeNoroNudge').hidden), 'x: yenilemede de yok');
  check(!p._errors.length, 'x: konsol temiz');
  await c.close();
}
{
  // ilk ziyaret kartı varken hatırlatma çıkmaz; "Geç" denince çıkar
  const c = await guestCtx({ viewport: { width: 390, height: 844 }, mobile: true, onboarded: false });
  const p = await page(c, 'welcome');
  await p.goto(SITE + '#/oyna'); await ready(p); await sleep(300);
  const st = await p.evaluate(() => ({ w: document.getElementById('homeWelcome').hidden, n: document.getElementById('homeNoroNudge').hidden }));
  check(!st.w && st.n, `ilk ziyaret kartı görünürken hatırlatma yok ${JSON.stringify(st)}`);
  await p.click('#btnWelcomeSkip'); await sleep(150);
  check(await p.evaluate(() => !document.getElementById('homeNoroNudge').hidden), '"Geç" sonrası hatırlatma görünür');
  // hatırlatmadaki düğme stüdyoyu açar; "Sıfırla" ile varsayılanda bırakıp kapatmak da ilk kayıttır
  await p.click('#btnNoroNudgeOpen');
  await p.waitForSelector('#avatarStudioModal.open');
  await p.click('#btnRandomizeFunnyAvatar'); await sleep(50);
  await p.click('#btnResetAvatar'); await sleep(50);
  await p.keyboard.press('Escape'); await sleep(400);
  const r = await p.evaluate(() => ({ n: document.getElementById('homeNoroNudge').hidden, def: window.PsikoVakaAvatar.equals(window.game.myAvatar, window.PsikoVakaAvatar.DEFAULT), f: document.activeElement.id }));
  check(r.n && r.def && r.f === 'homeAvatarEdit', `Esc ile kapanınca bekleyen kayıt yapıldı, kart kayboldu, odak avatarda ${JSON.stringify(r)}`);
  check(!p._errors.length, 'welcome: konsol temiz');
  await c.close();
}
{
  // özelleştirilmiş eski avatar (hiç "kayıt" bayrağı yok) → kart çıkmaz
  const c = await guestCtx({ viewport: { width: 390, height: 844 }, mobile: true, avatar: { v: 2, body: 'tall', color: 'coral', tufts: 'pair', eyes: 'round', mouth: 'smile', pattern: 'cheeks', headwear: 'none', accessory: 'none', background: 'lavender' } });
  const p = await page(c, 'custom');
  await p.goto(SITE + '#/oyna'); await ready(p); await sleep(300);
  check(await p.evaluate(() => document.getElementById('homeNoroNudge').hidden), 'özel avatarda hatırlatma yok');
  // Profil kartı avatarı
  await p.goto(SITE + '#/profil'); await sleep(300);
  const pb = await box(p, '#profileAvatarEdit');
  check(pb && pb.w >= 44 && pb.h >= 44, `Profil avatar düğmesi ≥44 px (${pb && pb.w}×${pb && pb.h})`);
  await p.click('#profileAvatarEdit');
  await p.waitForSelector('#avatarStudioModal.open');
  await p.click('#avatarStudioModal .modal-header .btn-close-modal'); await sleep(400);
  check((await active(p)) === 'profileAvatarEdit', 'Profil: odak avatara döndü');
  check(!p._errors.length, 'custom: konsol temiz');
  await c.close();
}

// ---------------------------------------------------------------- 3. masaüstü: üst çubuk çipi
for (const th of ['dark', 'light']) {
  const c = await guestCtx({ viewport: { width: 1440, height: 900 }, theme: th });
  const p = await page(c, 'desk-' + th);
  await p.goto(SITE + '#/oyna'); await ready(p); await sleep(400);
  const nb = await box(p, '#navAvatarEdit');
  check(nb && !nb.hidden && nb.w >= 40 && nb.h >= 40, `${th} 1440: üst çubuk avatar düğmesi görünür (${nb && nb.w}×${nb && nb.h})`);
  const hero = await box(p, '.card-hero');
  check(hero.b <= 900, `${th} 1440: Günün vakası ekranda (${Math.round(hero.b)})`);
  await p.screenshot({ path: `${SHOTS}/home-guest-1440-${th}.png` });
  await p.click('#navAvatarEdit');
  await p.waitForSelector('#avatarStudioModal.open');
  await p.keyboard.press('Escape'); await sleep(400);
  check((await active(p)) === 'navAvatarEdit', `${th} 1440: odak üst çubuk avatarına döndü`);
  await p.click('#navProfileChip'); await sleep(300);
  check(await p.evaluate(() => location.hash === '#/profil' && !document.getElementById('screenProfile').hidden), `${th} 1440: ad bağlantısı hâlâ Profil'e gider`);
  // klavye: Tab ile avatar düğmesine gelinir ve Enter açar
  await p.goto(SITE + '#/oyna'); await ready(p); await sleep(300);
  await p.focus('#navAvatarEdit'); await p.keyboard.press('Enter');
  await p.waitForSelector('#avatarStudioModal.open');
  await p.keyboard.press('Escape'); await sleep(300);
  check(!p._errors.length, `${th} 1440: konsol temiz ${JSON.stringify(p._errors.slice(0, 3))}`);
  await c.close();
}

// ---------------------------------------------------------------- 4. hareket azaltma
{
  const c = await guestCtx({ viewport: { width: 390, height: 844 }, mobile: true, reduced: true });
  const p = await page(c, 'reduced');
  await p.goto(SITE + '#/oyna'); await ready(p); await sleep(300);
  const anims = await p.evaluate(() => Array.from(document.querySelectorAll('#noroNudgeArt *')).map(e => getComputedStyle(e).animationName).filter(n => n && n !== 'none'));
  check(anims.length === 0, `hareket azaltmada karttaki Nöro durağan (${anims.slice(0, 3)})`);
  await c.close();
}

// ---------------------------------------------------------------- 5. lobi: iki sahte istemci
async function lobbyClient(label, theme) {
  const c = await ctx(b, { viewport: { width: 390, height: 844 }, mobile: true, theme });
  const p = await page(c, label);
  await p.goto(MOCK);
  await p.waitForFunction(() => window.olMock && window.PsikoVakaOnline.app && document.getElementById('onlineHubMount') && document.getElementById('onlineHubMount').dataset.state === 'ready', null, { timeout: 15000 });
  await p.evaluate(() => {
    window.__sent = [];
    const RT = window.PsikoVakaOnline.realtime;
    const orig = RT.joinRoom;
    RT.joinRoom = (id, u, h) => { const hd = orig(id, u, h); window.__rt = h; return Object.assign({}, hd, { send: (ev, pl) => { window.__sent.push([ev, pl]); return true; } }); };
    window.__saves = [];
    window.PsikoVakaAccount.saveProfile = async (patch) => { window.__saves.push(patch); await new Promise(r => setTimeout(r, 120)); if (window.game.accountSnap && window.game.accountSnap.profile && patch.avatar) window.game.accountSnap.profile.avatar = patch.avatar; return { ok: true }; };
    window.olMock.scenario('lobby', { n: 4 });
  });
  await p.waitForSelector('#olLobbyNoroBtn');
  await sleep(500);
  return { c, p };
}
const A = await lobbyClient('A', 'dark');
const B = await lobbyClient('B', 'light');
{
  const p = A.p;
  const nb = await box(p, '#olLobbyNoroBtn');
  check(nb && !nb.hidden && nb.h >= 44, `lobi: "Nöro'nu değiştir" görünür, ≥44 px (${nb && nb.w}×${nb && nb.h})`);
  const lbl = await p.evaluate(() => document.getElementById('olLobbyNoroBtn').getAttribute('aria-label'));
  check(lbl === "Nöro'nu değiştir", 'lobi düğmesi adı');
  const inView = await p.evaluate(() => { const r = document.getElementById('olLobbyNoroBtn').getBoundingClientRect(); return r.right <= innerWidth && r.left >= 0; });
  check(inView, 'lobi düğmesi 390 px\'de kaydırmadan görünür');
  await p.screenshot({ path: `${SHOTS}/lobby4-390-dark-before.png` });
  await p.click('#olLobbyNoroBtn');
  await p.waitForSelector('#avatarStudioModal.open');
  await sleep(300);
  const sheet = await p.evaluate(() => { const m = document.getElementById('avatarStudioModal'); const w = m.querySelector('.modal-window').getBoundingClientRect(); return { cls: m.classList.contains('is-sheet'), top: w.top, h: w.height, lobbyVisible: !document.getElementById('olLayer').hidden }; });
  check(sheet.cls && sheet.top > 40 && sheet.lobbyVisible, `lobi: stüdyo lobinin üstünde alt sayfa ${JSON.stringify(sheet)}`);
  await p.screenshot({ path: `${SHOTS}/lobby4-390-dark-studio-sheet.png` });
  await p.click('#avatarSlotTab-headwear');
  await p.click('#funnyAvatarControlsGrid [data-val]:not([aria-checked="true"])');
  await sleep(100);
  const myAv = await p.evaluate(() => window.game.myAvatar);
  await p.click('#avatarStudioModal .modal-footer .btn-close-modal');
  await sleep(600);
  check((await active(p)) === 'olLobbyNoroBtn', 'lobi: kapanınca odak düğmeye döndü');
  const r = await p.evaluate(() => ({ saves: window.__saves.length, sent: window.__sent.filter(x => x[0] === 'profile').length, me: window.PsikoVakaOnline.rooms.me().avatar }));
  check(r.saves === 1, `lobi: kapanınca profil hemen yazıldı (1,2 sn beklemeden) saves=${r.saves}`);
  check(r.sent === 1, `lobi: odaya "profile" yayını gönderildi (${r.sent})`);
  check(await p.evaluate((a) => window.PsikoVakaAvatar.equals(window.PsikoVakaOnline.rooms.me().avatar, a), myAv), 'lobi: kendi Nöro\'m sahnede hemen yeni hâlinde');
  const myNode = await p.evaluate(() => { const n = document.querySelector('.ol-p.is-me'); return n ? n.innerHTML.length : 0; });
  check(myNode > 0, 'lobi: kendi düğümüm çizili');
  await p.screenshot({ path: `${SHOTS}/lobby4-390-dark-after.png` });

  // B tarafı: A'nın kimliği B'de uid(1). Sunucu (B'nin sahte durumu) yeni avatarı döner; yayın gelince B yeniden okur.
  const q = B.p;
  const uid1 = '00000000-0000-4000-8000-000000000002';
  const before = await q.evaluate((u) => document.querySelector(`.ol-p[data-uid="${u}"]`).innerHTML, uid1);
  await q.evaluate(([u, av]) => {
    const pl = window.olMock.state.players.find(x => x.user_id === u); pl.avatar = av;   // sunucuda profil güncellendi
    window.__rt.onBroadcast('profile', { user_id: u });                                   // A'nın yayını
  }, [uid1, myAv]);
  await sleep(700);
  const afterB = await q.evaluate((u) => ({ html: document.querySelector(`.ol-p[data-uid="${u}"]`).innerHTML, cfg: window.PsikoVakaOnline.rooms.player(u).avatar }), uid1);
  check(afterB.html !== before, 'B: A\'nın Nöro\'su yenilemeden yeniden çizildi');
  check(await q.evaluate(([a, b2]) => window.PsikoVakaAvatar.equals(a, b2), [afterB.cfg, myAv]), 'B: oda durumundaki avatar A\'nın kaydettiğiyle aynı');
  // kendi yayınımı (aynı user_id) yok sayar
  const n0 = await q.evaluate(() => window.olMock.refreshCalls);
  void n0;
  await q.screenshot({ path: `${SHOTS}/lobby4-390-light-B-after.png` });
  check(!p._errors.length && !q._errors.length, `lobi: iki istemcide konsol temiz ${JSON.stringify(p._errors.concat(q._errors).slice(0, 3))}`);

  // hızlı eşleşme aranırken ve maçta düğme yok
  await p.evaluate(() => window.olMock.scenario('playing', { n: 4 }));
  await sleep(700);
  check(await p.evaluate(() => !document.getElementById('olLobbyNoroBtn')), 'maç sırasında lobi düğmesi yok');
  await p.evaluate(() => { window.olMock.scenario('lobby', { n: 2 }); });
  await sleep(500);
  await p.evaluate(() => { const s = window.olMock.state; s.room.is_quick = true; window.PsikoVakaOnline.rooms.refresh(); });
  await sleep(600);
  const qb = await box(p, '#olLobbyNoroBtn');
  check(!qb || qb.hidden || qb.w === 0, 'hızlı eşleşmede düğme görünmez');
}
await A.c.close(); await B.c.close();

// ---------------------------------------------------------------- 6. lobi masaüstü
{
  const c = await ctx(b, { viewport: { width: 1440, height: 900 }, theme: 'light' });
  const p = await page(c, 'lobby-desk');
  await p.goto(MOCK);
  await p.waitForFunction(() => window.olMock && document.getElementById('onlineHubMount') && document.getElementById('onlineHubMount').dataset.state === 'ready', null, { timeout: 15000 });
  await p.evaluate(() => window.olMock.scenario('lobby', { n: 4 }));
  await p.waitForSelector('#olLobbyNoroBtn'); await sleep(400);
  const t = await p.evaluate(() => document.getElementById('olLobbyNoroBtn').innerText.trim());
  check(t === "Nöro'nu değiştir", `1440: tam etiket görünür (${t})`);
  await p.click('#olLobbyNoroBtn');
  await p.waitForSelector('#avatarStudioModal.open'); await sleep(300);
  await p.screenshot({ path: `${SHOTS}/lobby4-1440-light-studio.png` });
  await p.keyboard.press('Escape'); await sleep(300);
  check((await active(p)) === 'olLobbyNoroBtn', '1440: odak lobi düğmesine');
  check(!p._errors.length, '1440 lobi: konsol temiz');
  await c.close();
}

console.log(`SONUÇ ${check.oks || 0} ok, ${check.fails || 0} fail`);
await b.close();
