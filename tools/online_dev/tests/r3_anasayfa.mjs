// Ajan R3: ana sayfa "çalışma masası" — danışan özeti (sızıntısız, ek istek yok), Online kartı notu, bitmiş günlük,
// klasör sekmesi, Nöro + balon yerleşimi (390/1440), misafir/üye farkı.
import { browser, ctx, page, check, sleep } from './lib.mjs';
const IDX = process.env.IDX || 'http://localhost:8899/index.html';
const HAR = process.env.HAR || 'http://localhost:8899/tools/online_dev/harness.html?mock=1';
const b = await browser();
const box = (p, s) => p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, r: r.right, b: r.bottom, vis: !e.hidden && getComputedStyle(e).display !== 'none' }; }, s);
const leakCheck = (p) => p.evaluate(() => {
  const g = window.game, t = document.getElementById('dailyTeaser').textContent.toLocaleLowerCase('tr');
  const words = [];
  Object.values(g.categories).forEach(c => words.push(c.name));
  Object.values(g.courses || {}).forEach(c => c && c.name && words.push(c.name));
  g.diagnoses.forEach(d => { words.push(d.nameTr); if (d.nameEn) words.push(d.nameEn); });
  return words.filter(w => w && w.length > 4 && t.includes(String(w).toLocaleLowerCase('tr'))).slice(0, 3);
});
for (const vp of [{ w: 390, h: 844, mobile: true }, { w: 1440, h: 900 }]) for (const th of ['dark', 'light']) {
  const tag = `${vp.w} ${th}`;
  // ---- misafir
  let c = await ctx(b, { viewport: { width: vp.w, height: vp.h }, mobile: !!vp.mobile, theme: th, dark: th === 'dark' });
  await c.addInitScript(() => { if (!sessionStorage.getItem('__r3')) { sessionStorage.setItem('__r3', '1'); localStorage.clear(); localStorage.setItem('psikovaka_onboarded', '1'); } });
  await c.route(/supabase\.co/, (r) => r.abort()); // canlı sunucuya gidilmesin (belirlenimci: yerel günün vakası)
  let p = await page(c, 'g' + tag);
  await p.goto(IDX + '#/oyna'); await p.waitForFunction(() => window.game && window.game.myAvatar);
  await p.waitForFunction(() => document.getElementById('dailyTeaser').textContent.length > 0, null, { timeout: 8000 }).catch(() => {}); await sleep(300);
  const g1 = await p.evaluate(() => { const t = document.getElementById('dailyTeaser'); const lc = window.game.getLocalDailyCase(); return { text: t.textContent, hidden: t.hidden, exp: lc && lc.patientSummary, title: document.getElementById('homeTitle').textContent, sub: document.querySelector('.home-greeting-sub').textContent, eyebrow: !!document.querySelector('#screenHome .eyebrow'), rp: document.getElementById('homeRpMount').hidden }; });
  check(!g1.hidden && g1.text && g1.text === g1.exp, `${tag} misafir: dosyada günün danışan özeti (${g1.text})`);
  check((await leakCheck(p)).length === 0, `${tag} misafir: özette kategori/ders/tanı adı yok`);
  check(g1.title === 'Merhaba, Klinisyen.' && g1.sub === 'Bugünün dosyası masanda.' && !g1.eyebrow, `${tag}: doğal selam, etiket yok (${g1.title})`);
  check(g1.rp, `${tag} misafir: RP etiketi yok`);
  const tab = await p.evaluate(() => ({ wd: getComputedStyle(document.querySelector('.desk-date-wd')).display, txt: document.getElementById('dailyDateLabel').textContent }));
  check(vp.w < 600 ? tab.wd === 'none' : tab.wd !== 'none', `${tag}: klasör sekmesinde gün adı ${vp.w < 600 ? 'gizli' : 'görünür'} (${tab.txt})`);
  const nb = await box(p, '#homeNoroNudge'), av = await box(p, '#homeAvatarEdit'), fold = await box(p, '.desk-folder'), ftab = await box(p, '.desk-folder-tab');
  check(nb.vis && av.w >= 88, `${tag}: Nöro masada büyük (${Math.round(av.w)} px) ve balon görünür`);
  if (vp.w < 1024) check(nb.b <= fold.y + 1 && nb.r <= av.x + 12 && ftab.r <= av.x + 8, `${tag}: balon Nöro'nun solunda, klasörün üstünde; sekme Nöro'ya değmiyor`);
  else check(nb.x >= fold.r && av.x >= fold.r - 40 && nb.b <= av.y + 20, `${tag}: balon ve Nöro klasörün sağında, balon Nöro'nun üstünde`);
  check((await box(p, '#homeOnlineNote')).vis === false, `${tag} misafir: Online kartında not yok`);
  // özet, Başla'ya basınca açılan vakanın özetiyle aynı
  const shown = await p.evaluate(() => document.getElementById('dailyTeaser').textContent);
  await p.click('#btnStartDaily'); await p.waitForFunction(() => window.game.currentScreen === 'play', null, { timeout: 8000 });
  const played = await p.evaluate(() => window.game.currentCase && window.game.currentCase.patientSummary);
  check(shown === played, `${tag} misafir: özet açılan günün vakasıyla aynı`);
  await p.evaluate(() => { window.game.leavePlayScreen(); }); await sleep(200);
  // pratik fişi: filtre metni id'li span'de
  check(await p.evaluate(() => document.getElementById('practiceSummary').tagName === 'SPAN' && /Filtre:/.test(document.querySelector('.desk-cardbox .card-text').textContent)), `${tag}: fişte "Filtre: …"`);
  check(p._errors.length === 0, `${tag} misafir: konsol temiz ${p._errors.slice(0, 2)}`);
  await c.close();
  // ---- üye (sahte sunucu)
  c = await ctx(b, { viewport: { width: vp.w, height: vp.h }, mobile: !!vp.mobile, theme: th, dark: th === 'dark' });
  p = await page(c, 'm' + tag);
  await p.goto(HAR + '#/oyna');
  await p.waitForFunction(() => window.olMock && window.PsikoVakaOnline.daily && window.PsikoVakaAccount.state === 'ready', null, { timeout: 15000 });
  await p.evaluate(() => { window.olMock.set({ daily: 'on', streakBase: 3 }); window.olMock.resetDaily(); });
  // ek istek yok: bir kart tazelemesinde get_daily_challenge tam bir kez
  const calls = await p.evaluate(async () => { const api = window.PsikoVakaOnline.api; const o = api.getDailyChallenge; let n = 0; api.getDailyChallenge = function () { n++; return o.apply(this, arguments); }; window.PsikoVakaOnline.daily._reset(); await window.PsikoVakaOnline.daily.refreshCard(true); await new Promise(r => setTimeout(r, 300)); api.getDailyChallenge = o; return n; });
  check(calls === 1, `${tag} üye: kart tazelemesinde tek get_daily_challenge (${calls})`);
  const m1 = await p.evaluate(() => { const id = window.olMock.daily.diagnosis.case_id; const cs = window.game.allMasterCases.find(x => x.id === id); return { text: document.getElementById('dailyTeaser').textContent, exp: cs && cs.patientSummary }; });
  check(m1.text === m1.exp && m1.text, `${tag} üye: özet sunucunun günlük vakasından (${m1.text})`);
  check((await leakCheck(p)).length === 0, `${tag} üye: özette sızıntı yok`);
  await p.waitForFunction(() => !document.getElementById('homeOnlineNote').hidden, null, { timeout: 8000 }).catch(() => {});
  const note = await p.evaluate(() => document.getElementById('homeOnlineNote').textContent.replace(/\s+/g, ' ').trim());
  check(/ayse_klinik seni odasına çağırıyor · \d+ bekleyen bildirim/.test(note), `${tag} üye: Online kartında davet notu (${note})`);
  const sk = await p.evaluate(() => { const s = document.getElementById('dailyStreakChip'); return { vis: !s.hidden, txt: s.textContent, inFolder: !!s.closest('.desk-folder') }; });
  check(sk.vis && /3 günlük seri/.test(sk.txt) && sk.inFolder, `${tag} üye: seri etiketi klasörde`);
  // bitmiş günlük: sonuç + "Sıralamayı gör" birincil, Başla yok
  await p.evaluate(async () => { const d = window.olMock.daily.diagnosis; d.status = 'finished'; d.won = true; d.guesses = [{ stage: 1 }, { stage: 1 }]; d.points = 85; d.time_sec = 70; window.PsikoVakaOnline.daily._reset(); await window.PsikoVakaOnline.daily.refreshCard(true); });
  await sleep(300);
  const fin = await p.evaluate(() => ({ box: !document.getElementById('dailyResultBox').hidden, title: document.getElementById('dailyResultTitle').textContent, start: document.getElementById('btnStartDaily').hidden, board: !document.getElementById('btnDailyBoard').hidden && document.getElementById('btnDailyBoard').classList.contains('btn-primary'), teaser: !document.getElementById('dailyTeaser').hidden }));
  check(fin.box && /2\. tahminde bildin/.test(fin.title) && fin.start && fin.board && fin.teaser, `${tag} üye: bitmiş günlük sonucu + birincil "Sıralamayı gör" ${JSON.stringify(fin)}`);
  const bb = await box(p, '#btnDailyBoard');
  check(bb.h >= 44, `${tag}: "Sıralamayı gör" ≥44 px`);
  check(p._errors.length === 0, `${tag} üye: konsol temiz ${p._errors.slice(0, 2)}`);
  await c.close();
}
await b.close(); console.log(`SONUÇ ${check.oks || 0} ok / ${check.fails || 0} fail`);
