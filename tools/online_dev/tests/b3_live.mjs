// Ajan B3: canlı doğrulama (yeni kod, canlı Supabase, dg1 hesabı). Bitmiş günün her giriş yolu salt okunur; daily_submit_guess tekrar çağrılmaz.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { check, sleep } from './lib.mjs';
const HAR = process.env.HAR || 'http://localhost:8899/tools/online_dev/harness.html';
const EMAIL = process.env.EMAIL || 'dg1@psikovaka.test', PWDG = process.env.PWD_DG; // şifre ortam değişkeninden (dosyada tutulmaz)
const TARGET = process.env.TARGET || 'therapy';
const SUPA = fs.readFileSync('/home/claude/rt/node_modules/@supabase/supabase-js/dist/umd/supabase.js');
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const c = await b.newContext({ viewport: { width: 390, height: 844 } });
await c.route('**/*', async (route) => { const u = route.request().url();
  if (u.includes('cdn.jsdelivr.net/npm/@supabase/supabase-js')) { await sleep(1000); return route.fulfill({ status: 200, contentType: 'application/javascript', body: SUPA, headers: { 'access-control-allow-origin': '*' } }); }
  if (/fonts\.(googleapis|gstatic)|unpkg\.com/.test(u)) return route.abort(); return route.continue(); });
const p = await c.newPage();
const calls = []; p.on('request', r => { const m = /rest\/v1\/rpc\/([a-z_]+)/.exec(r.url()); if (m) calls.push(m[1]); });
const errs = []; p.on('pageerror', e => errs.push(e.message));
const ready = async () => { await p.waitForFunction(() => window.PsikoVakaAccount && window.PsikoVakaAccount.state === 'ready' && window.PsikoVakaOnline && window.PsikoVakaOnline.daily, null, { timeout: 30000 }); await sleep(1500); };
await p.goto(HAR + '#/oyna');
await p.waitForFunction(() => window.PsikoVakaAccount && window.PsikoVakaAccount.availability !== 'pending', null, { timeout: 30000 });
if (await p.evaluate(() => window.PsikoVakaAccount.state) !== 'ready') await p.evaluate(async ([e, pw]) => window.PsikoVakaAccount.signIn(e, pw, { remember: true }), [EMAIL, PWDG]);
await ready();
const S = () => p.evaluate(() => { const g = window.game, $ = (id) => document.getElementById(id); return { btn: !$('btnStartDaily').hidden, res: !$('dailyResultBox').hidden, title: $('dailyResultTitle').textContent, screen: g.currentScreen, over: !!g.isGameOver, ro: !!g.dailyReadOnly, input: !g.dom.mainInputSection.hidden, n: g.guesses.length, label: g.currentDisplayTitle, resume: !$('homeResume').hidden, target: g.targetGameMode }; });
const home = async () => { await p.evaluate(() => { const g = window.game; if (g.currentScreen === 'play') g.leavePlayScreen(); location.hash = '#/oyna'; g.showRoute('oyna'); }); await sleep(1500); };
const setT = async (t) => { await p.click(`.target-mode-btn[data-target="${t}"]`); await sleep(1500); };
const answer = () => p.evaluate(() => { const g = window.game, c = g.currentCase, k = g.getEffectiveTargetType(); return k === 'therapy' ? (c.therapyId || 'cbt_general') : k === 'pharmacology' ? (c.pharmacologyId || g.getFallbackPharmacologyId(c)) : c.diagnosisId; });
const wrong = async () => p.evaluate(async (a) => { const g = window.game, k = g.getEffectiveTargetType(); const l = k === 'therapy' ? g.therapies : k === 'pharmacology' ? g.pharmacology : g.diagnoses; return l.find(x => x.id !== a).id; }, await answer());
const guess = async (id) => { await p.evaluate((id) => { const g = window.game, k = g.getEffectiveTargetType(); const l = k === 'therapy' ? g.therapies : k === 'pharmacology' ? g.pharmacology : g.diagnoses; const x = l.find(i => i.id === id); g.dom.diagnosisInput.value = x.nameTr; g.dom.diagnosisInput.dataset.selectedId = id; g.submitGuess(); }, id); await sleep(2000); };
const ro = (s, m) => check(s.screen === 'play' && s.over && s.ro && !s.input, m + ' ' + JSON.stringify(s));

// tanı: önceden bitirildi (yeniden üretimde)
let s = await S();
check(s.target === 'diagnosis' && !s.btn && s.res, 'canlı tanı: kart bitti ' + JSON.stringify(s));
await setT(TARGET); s = await S();
if (s.btn) {
  await p.evaluate(() => window.game.setMode('daily')); await sleep(2500);
  const w = await wrong(); await guess(w);
  check((await S()).n === 1, `canlı ${TARGET}: 1 yanlış`);
  await p.reload(); await ready(); await setT(TARGET);
  s = await S(); check(s.btn && !s.res, `canlı ${TARGET} yarıda yenileme: "Devam et"/Başla görünür`);
  await p.evaluate(() => window.game.setMode('daily')); await sleep(2500);
  check((await S()).n === 1 && !(await S()).over, `canlı ${TARGET}: kaldığı yerden`);
  await guess(await answer());
  s = await S(); check(s.over && !s.ro, `canlı ${TARGET}: kazandı`);
}
await p.reload(); await ready(); await setT(TARGET);
calls.length = 0;
s = await S(); check(!s.btn && s.res && /tahminde bildin|olmadı/.test(s.title), `canlı ${TARGET} yenileme: kart sonucu ` + s.title);
await p.click('#dailyResultBox'); await sleep(2500); s = await S(); ro(s, 'canlı: karta dokun → salt okunur');
await guess(await answer()); await p.evaluate(() => window.game.giveUp()); await sleep(800);
await p.goBack(); await sleep(1200); s = await S(); check(s.screen === 'oyna' && !s.btn && !s.resume, 'canlı: geri → ana sayfa, kart bitti, afiş yok');
await p.goForward(); await sleep(1200); s = await S(); check(s.screen !== 'play' || s.ro, 'canlı: ileri oynanabilir açmaz');
await home();
await p.evaluate(() => window.game.setMode('daily')); await sleep(2500); ro(await S(), 'canlı: setMode(daily) → salt okunur');
await home();
await setT('diagnosis'); await setT(TARGET); s = await S(); check(!s.btn && s.res, 'canlı: hedef değiştir-geri → hâlâ bitti');
await p.goto(HAR + '#/gunluk'); await sleep(2500);
check(await p.locator('.dl-cta').count() === 0, 'canlı #/gunluk: "Başla" çağrısı yok');
await p.goto(HAR + '#/oyna'); await ready(); await setT(TARGET);
s = await S(); check(!s.btn && s.res, 'canlı: bağlantılardan sonra kart bitti');
check(!calls.includes('daily_submit_guess') && !calls.includes('daily_give_up'), 'canlı: bitişten sonra daily_submit_guess / daily_give_up hiç çağrılmadı: ' + [...new Set(calls)].join(','));
const second = await p.evaluate(async (t) => window.PsikoVakaOnline.api.dailySubmitGuess(t, 'cbt_general'), TARGET);
check(!second.ok && second.error.code === 'DAILY_ALREADY_FINISHED', 'canlı sunucu: ikinci deneme DAILY_ALREADY_FINISHED');
check(errs.length === 0, 'canlı konsol temiz ' + errs.join('|'));
await b.close();
console.log(`SONUÇ ${check.oks || 0} ok / ${check.fails || 0} fail`);
