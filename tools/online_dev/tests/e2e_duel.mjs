// Arkadaşlık → davet → katılma → düello (rounds, 3 tur) uçtan uca, canlı sunucu
import { browser, ctx, page, signIn, sleep, check } from './lib.mjs';
import { resetUser, removeFriendship, answers, guess, waitPhase, waitPlaying, state, myProfile, keyIssues } from './helpers.mjs';
const b = await browser();
const c1 = await ctx(b, { viewport: { width: 390, height: 844 }, mobile: true });
const c2 = await ctx(b, { viewport: { width: 1440, height: 900 } });
const p1 = await page(c1, 'bir'), p2 = await page(c2, 'iki');
await Promise.all([signIn(p1, 'test1@psikovaka.test'), signIn(p2, 'test2@psikovaka.test')]);
await Promise.all([resetUser(p1), resetUser(p2)]);
await removeFriendship(p1, 'test_iki'); await removeFriendship(p2, 'test_bir');
await sleep(800);
await Promise.all([p1.reload(), p2.reload()]);
await Promise.all([signIn(p1, 'test1@psikovaka.test'), signIn(p2, 'test2@psikovaka.test')]);
await p1.waitForSelector('#olFriendInput'); await p2.waitForSelector('#olFriendInput');

console.log('[arkadaşlık]');
await p1.fill('#olFriendInput', 'test_iki');
await p1.click('[data-ol-fadd] button[type="submit"]');
await p1.waitForSelector('.ol-friend.is-outgoing', { timeout: 10000 });
check(true, 'u1: giden istek listede');
await p2.waitForSelector('.ol-friend.is-request [data-ol-f="accept"]', { timeout: 15000 });
const badge = await p2.evaluate(() => { const b = document.querySelector('[data-route="online"] .ol-nav-badge'); return b ? b.textContent : null; });
check(badge === '1', 'u2: menü rozeti 1 (' + badge + ')');
await p2.click('.ol-friend.is-request [data-ol-f="accept"]');
await p1.waitForSelector('.ol-friend:not(.is-outgoing):not(.is-request) .ol-friend-name', { timeout: 15000 });
await p2.waitForSelector('.ol-friend:not(.is-outgoing):not(.is-request) .ol-friend-name', { timeout: 15000 });
await p1.waitForSelector('.ol-friend .ol-dot-on', { timeout: 20000 }).then(() => check(true, 'u1: u2 çevrimiçi görünüyor')).catch(() => check(false, 'u1: u2 çevrimiçi görünüyor'));
await p2.waitForSelector('.ol-friend .ol-dot-on', { timeout: 20000 }).then(() => check(true, 'u2: u1 çevrimiçi görünüyor')).catch(() => check(false, 'u2: u1 çevrimiçi görünüyor'));
await p1.screenshot({ path: '/tmp/shots/hub_friends_390.png', fullPage: true });

console.log('[oda kur + davet]');
const rp1Before = await myProfile(p1), rp2Before = await myProfile(p2);
await p1.click('[data-ol-hub="create"]');
await p1.waitForSelector('.ol-sheet [data-ol-create]');
await p1.click('.ol-chip:has(input[name="rounds"][value="3"])');
await p1.screenshot({ path: '/tmp/shots/create_sheet_390.png' });
await p1.click('.ol-sheet [data-ol-action="create"]');
await p1.waitForSelector('.ol-lobby .ol-p.is-me', { timeout: 15000 });
await sleep(600);
let st = await state(p1);
check(st.room.mode === 'duel' && st.room.format === 'rounds' && st.room.round_count === 3, 'oda: düello/rounds/3 tur');
check(await p1.$eval('[data-ol-l="start"]', b => b.disabled), 'başlat kapalı (1/2)');
const gateTxt = await p1.$eval('#olGateLine', e => e.textContent);
check(/1\/2/.test(gateTxt), 'gerekçe: ' + gateTxt.trim());
await p1.click('[data-ol-l="invite"]');
await p1.waitForSelector('.ol-sheet [data-ol-f="invite"]', { timeout: 10000 });
await p1.click('.ol-sheet [data-ol-f="invite"]');
await p1.waitForFunction(() => /Davet edildi/.test(document.querySelector('.ol-sheet [data-ol-f="invite"]').textContent));
check(true, 'davet gönderildi');
await p1.keyboard.press('Escape');
await p2.waitForSelector('.ol-banner [data-ol-b="yes"]', { timeout: 15000 });
check(true, 'u2: davet afişi göründü');
await p2.screenshot({ path: '/tmp/shots/invite_banner_1440.png' });
await p2.click('.ol-banner [data-ol-b="yes"]');
await p2.waitForSelector('.ol-lobby .ol-p.is-me', { timeout: 15000 });
await p1.waitForFunction(() => document.querySelectorAll('.ol-lobby .ol-p').length === 2, null, { timeout: 15000 });
check(true, 'iki oyuncu da lobide');
await sleep(800);
const g2 = await p1.$eval('#olGateLine', e => e.textContent);
check(/hazır değil/.test(g2) && await p1.$eval('[data-ol-l="start"]', b => b.disabled), 'başlat kapalı: ' + g2.trim());
const srv = await p1.evaluate(async () => (await window.PsikoVakaOnline.api.startMatch(window.PsikoVakaOnline.rooms.roomId)).error);
check(srv && srv.code === 'NOT_ALL_READY', 'sunucu da reddediyor: ' + (srv && srv.code));
// geç katılan (yabancı) — sonra denenecek
console.log('[lobi etkileşimi]');
const box = await p2.$('#olStage'); const bb = await box.boundingBox();
await p2.mouse.click(bb.x + bb.width * 0.25, bb.y + bb.height * 0.8);
await p2.click('[data-ol-emote="wave"]');
await p2.click('[data-ol-l="quick"]'); await p2.click('[data-ol-say="go"]');
const u2id = await p2.evaluate(() => window.PsikoVakaOnline.api.myId());
await p1.waitForFunction((id) => { const n = document.querySelector(`.ol-p[data-uid="${id}"]`); return n && Math.abs(parseFloat(n.dataset.x) - 0.25) < 0.05; }, u2id, { timeout: 8000 }).then(() => check(true, 'u1 u2nin hareketini gördü')).catch(() => check(false, 'u1 u2nin hareketini gördü'));
await p1.waitForFunction((id) => { const n = document.querySelector(`.ol-p-bubble[data-uid="${id}"]`); return n && !n.hidden; }, u2id, { timeout: 8000 }).then(() => check(true, 'u1 balonu gördü')).catch(() => check(false, 'u1 balonu gördü'));
await p1.screenshot({ path: '/tmp/shots/lobby_2_390.png' });
await p2.click('[data-ol-l="ready"]');
await p1.waitForFunction(() => !document.querySelector('[data-ol-l="start"]').disabled, null, { timeout: 10000 });
check(true, 'u2 hazır → başlat açık');
await p2.screenshot({ path: '/tmp/shots/lobby_2_1440.png' });
await p1.click('[data-ol-l="start"]');
await waitPhase(p2, ['countdown', 'playing'], 15000);
await p2.waitForSelector('#olCountNum', { timeout: 5000 }).then(() => p2.screenshot({ path: '/tmp/shots/countdown_1440.png' })).catch(() => {});
check(true, 'geri sayım');

console.log('[maç]');
const anomalies = [];
async function waitPlayingOrMissing(p, r) { return p.waitForFunction((rr) => { const NS = window.PsikoVakaOnline; const s = NS.rooms.state; if (!s || !s.round || s.round.round_no !== rr) return false; if (NS.match.isMissingCase()) return true; return NS.rooms.phase() === 'playing' && NS.app.view === 'play' && !document.getElementById('diagnosisInput').disabled; }, r, { timeout: 40000 }); }
const plan = [ // [u1 yanlış sayısı ya da 'fail'/'giveup', u2 ...]
  [1, 0], [0, 'fail'], [2, 'giveup']
];
for (let r = 1; r <= 3; r++) {
  await Promise.all([waitPlayingOrMissing(p1, r), waitPlayingOrMissing(p2, r)]);
  const miss = await p1.evaluate(() => window.PsikoVakaOnline.match.isMissingCase());
  if (miss) {
    anomalies.push({ round: r, kind: 'missing_case', case: (await state(p1)).round.case_id });
    console.log('   ANOMALİ: sunucu istemcide olmayan vaka seçti:', anomalies[anomalies.length - 1].case);
    await p1.screenshot({ path: '/tmp/shots/missing_case_390.png' });
    for (const p of [p1, p2]) { await p.click('[data-ol-x="forfeit"]'); }
    await Promise.all([waitPhase(p1, ['result', 'finished']), waitPhase(p2, ['result', 'finished'])]);
    continue;
  }
  if (r === 1) await p1.screenshot({ path: '/tmp/shots/round_hud_390.png' });
  const [a1, a2] = await Promise.all([answers(p1), answers(p2)]);
  check(a1.caseId === a2.caseId, `tur ${r}: aynı vaka (${a1.caseId})`);
  const run = async (p, a, how) => {
    if (how === 'fail') { for (const w of a.wrong.slice(0, 6)) await guess(p, w); return; }
    if (how === 'giveup') { await p.click('#btnGiveUp'); await p.click('.ol-sheet [data-ol-action="yes"]'); return; }
    for (const w of a.wrong.slice(0, how)) await guess(p, w);
    await guess(p, a.right);
  };
  await Promise.all([run(p1, a1, plan[r - 1][0]), run(p2, a2, plan[r - 1][1])]);
  if (r === 1) await p1.screenshot({ path: '/tmp/shots/round_wait_390.png', fullPage: false });
  await Promise.all([waitPhase(p1, ['result', 'finished']), waitPhase(p2, ['result', 'finished'])]);
  const s1 = await state(p1);
  const rp = Object.fromEntries(s1.round_players.map(x => [x.user_id, x]));
  const me1 = await p1.evaluate(() => window.PsikoVakaOnline.api.myId());
  const x1 = rp[me1], x2 = rp[u2id];
  console.log('   ', JSON.stringify({ u1: [x1.won, x1.guess_count, x1.points, x1.elapsed_sec, x1.finish_reason], u2: [x2.won, x2.guess_count, x2.points, x2.elapsed_sec, x2.finish_reason] }));
  const exp = (won, g, e) => !won ? 0 : ({ 1: 100, 2: 85, 3: 70, 4: 55, 5: 40, 6: 25 }[g]) + Math.max(0, Math.min(20, Math.round((60 - Math.min(60, e || 30)) / 3)));
  check(x1.points === exp(x1.won, x1.guess_count, x1.elapsed_sec) && x2.points === exp(x2.won, x2.guess_count, x2.elapsed_sec), `tur ${r}: puanlar formülle aynı`);
  const plannedWon1 = typeof plan[r - 1][0] === 'number', plannedWon2 = typeof plan[r - 1][1] === 'number';
  const ki = [...await keyIssues(p1), ...await keyIssues(p2)].filter(k => k.detail && k.detail.case_id === a1.caseId);
  if (ki.length) { anomalies.push({ round: r, kind: 'answer_mismatch', case: a1.caseId, issues: ki.map(k => k.kind + ':' + JSON.stringify(k.detail)) }); console.log('   ANOMALİ: cevap anahtarı uyuşmuyor', JSON.stringify(ki.map(k => k.detail))); }
  else check(x1.won === plannedWon1 && x2.won === plannedWon2, `tur ${r}: kazanma durumu plana uygun (anahtar uyumlu)`);
  if (r === 1) { await p1.waitForSelector('.ol-result-view'); await sleep(500); await p1.screenshot({ path: '/tmp/shots/round_result_390.png', fullPage: false }); }
}
await Promise.all([waitPhase(p1, 'finished', 40000), waitPhase(p2, 'finished', 40000)]);
await p1.waitForSelector('.ol-final-view .ol-pod', { timeout: 15000 });
await sleep(1500);
await p1.screenshot({ path: '/tmp/shots/podium_390.png' });
await p2.screenshot({ path: '/tmp/shots/podium_1440.png' });
const fs1 = await state(p1);
const res = fs1.results;
console.log('   results', JSON.stringify(res.map(x => [x.final_rank, x.total_score, x.rp_delta, x.rp_after])));
const rp1After = await myProfile(p1), rp2After = await myProfile(p2);
const me1 = await p1.evaluate(() => window.PsikoVakaOnline.api.myId());
const r1 = res.find(x => x.user_id === me1), r2 = res.find(x => x.user_id === u2id);
check(rp1After.ranked_points - rp1Before.ranked_points === r1.rp_delta && rp2After.ranked_points - rp2Before.ranked_points === r2.rp_delta, `RP bir kez uygulandı (${r1.rp_delta}/${r2.rp_delta})`);
check(new Set([r1.rp_delta, r2.rp_delta]).has(35) && new Set([r1.rp_delta, r2.rp_delta]).has(5), 'RP 35/5');
const t1 = fs1.players.find(p => p.user_id === me1).total_score;
check(t1 === r1.total_score, 'toplam puan = sonuç');
await sleep(4000);
const again = await myProfile(p1);
check(again.ranked_points === rp1After.ranked_points, 'RP tekrar eklenmedi');
console.log('   anahtar sorunları:', JSON.stringify(await keyIssues(p1)), JSON.stringify(await keyIssues(p2)));
// geç katılım: yabancı biri bitmiş odaya giremez (ayrı testte maç sırasında da denenir)
await p1.click('.ol-view-foot [data-ol-v="exit"]');
await p2.click('.ol-view-foot [data-ol-v="exit"]');
await sleep(500);
check(await p1.evaluate(() => !window.PsikoVakaOnline.rooms.roomId && document.getElementById('olLayer').hidden), 'çıkış: katman kapandı');
console.log('ANOMALİLER', JSON.stringify(anomalies));
console.log('errors', p1._errors, p2._errors);
console.log(`SONUÇ ${check.oks || 0} ok, ${check.fails || 0} fail`);
await b.close();
