// Canlı çok oyunculu mod testleri. MODE=hp|ffa|battle|bracket
import { browser, ctx, page, signIn, sleep, check } from './lib.mjs';
import { resetUser, answers, guess, waitPhase, state, myProfile, keyIssues } from './helpers.mjs';
const MODE = process.env.MODE || 'ffa';
const CFG = {
  hp: { users: [1, 2], create: { mode: 'duel', format: 'hp', target: 'diagnosis' } },
  ffa: { users: [3, 4, 5], create: { mode: 'ffa', format: 'rounds', target: 'diagnosis', capacity: 3, rounds: 3 } },
  battle: { users: [5, 6, 7, 8], create: { mode: 'tournament', format: 'battle', target: 'diagnosis', capacity: 4 } },
  bracket: { users: [1, 2, 3, 4], create: { mode: 'tournament', format: 'bracket', target: 'diagnosis', capacity: 4 } },
  combo: { users: [6, 7], create: { mode: 'duel', format: 'rounds', target: 'combo', rounds: 2 } }
}[MODE];
const VPS = [{ width: 390, height: 844, mobile: true }, { width: 1440, height: 900 }, { width: 360, height: 740, mobile: true }, { width: 412, height: 915, mobile: true }];
const b = await browser();
const P = [];
for (let i = 0; i < CFG.users.length; i++) {
  const v = VPS[i % VPS.length];
  const c = await ctx(b, { viewport: { width: v.width, height: v.height }, mobile: v.mobile });
  const p = await page(c, 'u' + CFG.users[i]); p._ctx = c; p._n = CFG.users[i];
  P.push(p);
}
await Promise.all(P.map(p => signIn(p, `test${p._n}@psikovaka.test`)));
await Promise.all(P.map(p => resetUser(p)));
const ids = await Promise.all(P.map(p => p.evaluate(() => window.PsikoVakaOnline.api.myId())));
const before = await Promise.all(P.map(myProfile));
const anomalies = [];

console.log(`[${MODE}] oda kur`);
const created = await P[0].evaluate(async (o) => (await window.PsikoVakaOnline.app.createRoom(o)), CFG.create);
check(created.ok, 'oda kuruldu ' + (created.ok ? created.data.code : JSON.stringify(created.error)));
const code = created.data.code;
for (let i = 1; i < P.length; i++) {
  if (MODE === 'ffa' && i === 2) {
    // davet bağlantısıyla katılım (#room=KOD)
    await P[i].goto(`http://localhost:8899/tools/online_dev/harness.html#room=${code}`);
    await P[i].waitForSelector('.ol-lobby .ol-p.is-me', { timeout: 20000 });
    check(true, 'u' + P[i]._n + ' #room= bağlantısıyla lobiye geldi');
  } else {
    const r = await P[i].evaluate(async (c) => (await window.PsikoVakaOnline.app.joinByCode(c)), code);
    check(r.ok, 'u' + P[i]._n + ' koda katıldı');
  }
}
await Promise.all(P.map(p => p.waitForFunction((n) => document.querySelectorAll('.ol-lobby .ol-p').length === n, P.length, { timeout: 20000 })));
check(true, 'herkes lobide birbirini görüyor');

if (MODE === 'battle') {
  console.log('[host lobide ayrılır]');
  await P[0].click('[data-ol-l="leave"]');
  await P[1].waitForFunction((id) => { const s = window.PsikoVakaOnline.rooms.state; return s && s.room.host_id === id; }, ids[1], { timeout: 15000 });
  await P[1].waitForSelector('[data-ol-l="start"]', { timeout: 10000 });
  const crown = await P[2].waitForFunction((id) => { const n = document.querySelector(`.ol-p[data-uid="${id}"] .ol-p-crown`); return n && !n.hidden; }, ids[1], { timeout: 15000 }).then(() => true).catch(() => false);
  check(crown, 'host devri: u' + P[1]._n + ' tacı taşıyor (başkalarının ekranında)');
  const rj = await P[0].evaluate(async (c) => (await window.PsikoVakaOnline.app.joinByCode(c)), code);
  check(rj.ok, 'eski host koda yeniden katıldı');
  await P[0].waitForSelector('.ol-lobby .ol-p.is-me', { timeout: 15000 });
  P.push(P.shift()); ids.push(ids.shift()); before.push(before.shift());   // yeni host P[0]
}
if (MODE === 'ffa') {
  console.log('[lobide yenileme]');
  await P[2].reload();
  await P[2].waitForSelector('.ol-lobby .ol-p.is-me', { timeout: 25000 });
  check(true, 'lobide yenilenen oyuncu lobiye döndü');
}
// lobi etkileşimi (ilk iki oyuncu)
if (P.length >= 2) {
  await P[1].click('[data-ol-emote="cheer"]');
  await P[0].waitForFunction((id) => { const n = document.querySelector(`.ol-p[data-uid="${id}"] .ol-p-bubble`); return n && !n.hidden; }, ids[1], { timeout: 8000 }).then(() => check(true, 'tepki diğer istemcide göründü')).catch(() => check(false, 'tepki diğer istemcide göründü'));
}
await sleep(500);
await P[0].screenshot({ path: `/tmp/shots/lobby_${MODE}_${P.length}.png` });
await P[1].screenshot({ path: `/tmp/shots/lobby_${MODE}_${P.length}_b.png` });
for (let i = 1; i < P.length; i++) { await P[i].click('[data-ol-l="ready"]'); }
await P[0].waitForFunction(() => { const b = document.querySelector('[data-ol-l="start"]'); return b && !b.disabled; }, null, { timeout: 15000 });
await P[0].click('[data-ol-l="start"]');
await Promise.all(P.map(p => waitPhase(p, ['countdown', 'playing'], 20000)));
check(true, 'maç başladı');

if (MODE === 'ffa') {
  const late = await (async () => { const c = await ctx(b); const p = await page(c, 'late'); await signIn(p, 'test8@psikovaka.test'); await resetUser(p); const r = await p.evaluate(async (cd) => (await window.PsikoVakaOnline.api.joinRoom(cd)), code); await c.close(); return r; })();
  check(!late.ok && late.error.code === 'ALREADY_STARTED', 'geç katılım reddedildi: ' + (late.error && late.error.code));
}

// ---- strateji: [tur][oyuncu] -> yanlış sayısı | 'fail' | 'giveup' | 'leave' | 'close' | 'reload'
function plan(round, i) {
  if (MODE === 'hp') return i === 0 ? 0 : 'fail';
  if (MODE === 'combo') return [[1, 0], [0, 'giveup']][round - 1][i];
  if (MODE === 'ffa') return [[1, 'reload', 0], [0, 2, 'giveup'], [3, 0, 1]][round - 1][i];
  if (MODE === 'battle') return [0, 1, 2, 3][(i + round) % 4];
  if (MODE === 'bracket') return round === 1 ? [0, 'leave', 1, 2][i] : [1, 'x', 0, 'close'][i];
  return 0;
}
const shotTaken = {};
async function playerLoop(p, i) {
  let last = 0;
  for (let guard = 0; guard < 2000; guard++) {
    if (p.isClosed()) return 'closed';
    let st;
    try {
      st = await p.evaluate(() => {
        const NS = window.PsikoVakaOnline; const s = NS.rooms.state;
        if (!s) return { ph: 'none' };
        const ph = NS.rooms.phase();
        const mine = NS.rooms.myRound();
        return { ph, round: s.round && s.round.round_no, view: NS.app.view, missing: NS.match.isMissingCase(), mineFinished: mine && mine.finished, inRound: !!mine, dis: document.getElementById('diagnosisInput').disabled, left: !!(NS.rooms.me() && NS.rooms.me().left_at) };
      });
    } catch (e) { return 'err:' + e.message; }
    if (st.ph === 'finished' || st.ph === 'none' || st.left) return st.ph;
    if (st.ph === 'playing' && st.round && st.round > last && st.inRound) {
      if (st.missing) { anomalies.push({ round: st.round, kind: 'missing_case', who: p._n }); await p.click('[data-ol-x="forfeit"]').catch(() => {}); last = st.round; continue; }
      if (st.view !== 'play' || st.dis || st.mineFinished) { await sleep(250); if (st.mineFinished) last = st.round; continue; }
      last = st.round;
      const how = plan(st.round, i);
      if (!shotTaken[MODE + st.round] && i === 0) { shotTaken[MODE + st.round] = 1; await sleep(400); await p.screenshot({ path: `/tmp/shots/hud_${MODE}_r${st.round}.png` }); }
      const a = await answers(p);
      if (how === 'leave') { await p.click('#btnPlayBack'); await p.click('.ol-sheet [data-ol-action="yes"]'); return 'left'; }
      if (how === 'close') { await sleep(1500); await p._ctx.close(); return 'closed'; }
      if (how === 'reload') {
        await guess(p, a.wrong[0]);
        await p.reload();
        await p.waitForFunction(() => { const NS = window.PsikoVakaOnline; return NS && NS.rooms && NS.rooms.state && NS.app.view === 'play' && !document.getElementById('diagnosisInput').disabled; }, null, { timeout: 30000 });
        const g = await p.evaluate(() => ({ n: window.game.guesses.length, clues: window.game.unlockedClues, hud: !!document.getElementById('olHud') }));
        check(g.n === 1 && g.clues === 2 && g.hud, `oyun ortasında yenileme: tahmin ${g.n}, ipucu ${g.clues}, şerit ${g.hud}`);
        await guess(p, a.right);
        continue;
      }
      if (how === 'fail') { for (const w of a.wrong.slice(0, 6)) await guess(p, w); continue; }
      if (how === 'giveup') { await p.click('#btnGiveUp'); await p.click('.ol-sheet [data-ol-action="yes"]'); continue; }
      if (typeof how === 'number') {
        for (const w of a.wrong.slice(0, how)) await guess(p, w);
        await guess(p, a.right);
        // kombo: sonraki aşamalar (her biri ilk tahminde)
        for (let k = 0; k < 2; k++) {
          const more = await p.evaluate(() => { const m = window.PsikoVakaOnline.rooms.myRound(); return m && !m.finished && window.PsikoVakaOnline.rooms.state.room.target_type === 'combo'; });
          if (!more) break;
          const b2 = await answers(p); await guess(p, b2.right);
        }
      }
      continue;
    }
    if ((st.ph === 'playing' && !st.inRound) && !shotTaken['spec' + st.round]) { shotTaken['spec' + st.round] = 1; await sleep(500); await p.screenshot({ path: `/tmp/shots/spectate_${MODE}_r${st.round}.png` }); }
    if (st.ph === 'result' && !shotTaken['res' + st.round] && i === 0) { shotTaken['res' + st.round] = 1; await sleep(900); await p.screenshot({ path: `/tmp/shots/result_${MODE}_r${st.round}.png` }); }
    if (st.ph === 'playing' && st.view === 'pairing' && !shotTaken['pair' + st.round]) { shotTaken['pair' + st.round] = 1; await p.screenshot({ path: `/tmp/shots/pairing_${MODE}_r${st.round}.png` }); }
    await sleep(300);
  }
}
const outs = await Promise.all(P.map((p, i) => playerLoop(p, i)));
console.log('   döngüler:', JSON.stringify(outs));
const alive = P.filter(p => !p.isClosed() && outs[P.indexOf(p)] !== 'left');
await Promise.all(alive.map(p => waitPhase(p, 'finished', 120000)));
await sleep(1500);
const s = await state(alive[0]);
await alive[0].screenshot({ path: `/tmp/shots/final_${MODE}.png` });
if (alive[1]) await alive[1].screenshot({ path: `/tmp/shots/final_${MODE}_b.png` });
const res = s.results.slice().sort((a, b) => a.final_rank - b.final_rank);
const nameOf = (id) => (s.players.find(p => p.user_id === id) || {}).username;
console.log('   sonuç:', JSON.stringify(res.map(r => [r.final_rank, nameOf(r.user_id), r.total_score, r.eliminated_round, r.final_hp, r.left_early, r.rp_delta, r.rp_after])), 'ended_early', s.room.ended_early);
const after = await Promise.all(alive.map(myProfile));
alive.forEach((p, k) => {
  const idx = P.indexOf(p);
  const r = res.find(x => x.user_id === ids[idx]);
  check(r && after[k].ranked_points - before[idx].ranked_points === r.rp_delta, `u${p._n}: RP farkı = rp_delta (${r && r.rp_delta})`);
});
const winRp = { hp: 35, combo: 35, ffa: 50, battle: 75, bracket: 75 }[MODE];
check(res[0].rp_delta === (s.room.ended_early ? res[0].rp_delta : winRp), `birinci +${winRp}`);
if (P.length > 2) check(res[1].rp_delta === 20 || res[1].left_early || s.room.ended_early, 'ikinci +20');
if (MODE === 'hp') check(res[1].final_hp === 0 && res[0].final_hp > 0, `HP: kaybeden 0 can (${res[1].final_hp}), kazanan ${res[0].final_hp}`);
if (MODE === 'battle') {
  check(res.filter(r => r.eliminated_round == null).length === 2 && res[2].eliminated_round === 2 && res[3].eliminated_round === 1, 'battle: elenme sırası 1,2 ve iki finalist');
}
if (MODE === 'bracket') {
  const pr = s.pairings;
  check(pr.length === 3 && pr.filter(x => x.decided_reason === 'forfeit').length >= 1, 'bracket: 3 eşleşme, en az bir hükmen: ' + JSON.stringify(pr.map(x => [x.bracket_round, x.slot, nameOf(x.winner_id), x.decided_reason])));
  check(res.find(r => r.left_early) && res.find(r => r.left_early).rp_delta === 0, 'ayrılan oyuncu 0 RP');
}
const ki = [];
for (const p of alive) ki.push(...await keyIssues(p));
console.log('   ANOMALİLER', JSON.stringify(anomalies), 'anahtar', JSON.stringify(ki.map(k => k.kind + ':' + JSON.stringify(k.detail))));
for (const p of alive) { await p.click('.ol-view-foot [data-ol-v="exit"]').catch(() => {}); }
const errs = P.flatMap(p => p._errors.map(e => p._n + ': ' + e));
check(!errs.length, 'konsol hatası yok ' + JSON.stringify(errs.slice(0, 4)));
console.log(`SONUÇ ${check.oks || 0} ok, ${check.fails || 0} fail`);
await b.close();
