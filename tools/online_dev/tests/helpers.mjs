import { sleep, check, waitFor } from './lib.mjs';
export async function resetUser(p) {
  return p.evaluate(async () => {
    const NS = window.PsikoVakaOnline;
    const cur = await NS.api.getMyCurrentRoom();
    if (cur.ok && cur.data) { await NS.api.leaveRoom(cur.data.id); NS.rooms.close(true); }
    return cur.data;
  });
}
export async function removeFriendship(p, username) {
  return p.evaluate(async (u) => {
    const NS = window.PsikoVakaOnline;
    const r = await NS.api.listFriendships();
    const me = NS.api.myId();
    for (const f of (r.data || [])) {
      const other = f.requester_id === me ? f.addressee : f.requester;
      if (other && other.username === u) await NS.api.removeFriend(other.id);
      if (other && other.username === u && f.status === 'pending' && f.addressee_id === me) await NS.api.respondFriendRequest(f.id, false);
    }
    await NS.friends.load({ silent: true });
  }, username);
}
/** Oyuncunun bu turdaki doğru cevabı ve n yanlış seçenek (yerel veriden) */
export async function answers(p, nWrong = 6) {
  return p.evaluate((n) => {
    const NS = window.PsikoVakaOnline, g = window.game, s = NS.rooms.state;
    const c = NS.match.findCase(s.round.case_id);
    const mine = NS.rooms.myRound();
    const stage = mine ? mine.stage : 1;
    const kind = s.room.target_type === 'combo' ? ['diagnosis', 'therapy', 'pharmacology'][stage - 1] : s.room.target_type;
    const list = kind === 'therapy' ? g.therapies : kind === 'pharmacology' ? g.pharmacology : g.diagnoses;
    const id = kind === 'therapy' ? (c.therapyId || 'cbt_general') : kind === 'pharmacology' ? c.pharmacologyId : c.diagnosisId;
    const right = list.find(x => x.id === id);
    const wrong = list.filter(x => x.id !== id).slice(0, n).map(x => x.nameTr);
    return { caseId: c.id, kind, right: right ? right.nameTr : null, rightId: id, wrong, round: s.round.round_no };
  }, nWrong);
}
export async function guess(p, name) {
  await p.fill('#diagnosisInput', name);
  await p.evaluate(() => { const el = document.getElementById('autocompleteDropdown'); if (el) el.classList.remove('open'); });
  await p.click('#btnSubmit');
  await p.waitForFunction(() => !window.PsikoVakaOnline.match || !document.getElementById('btnSubmit').classList.contains('is-loading'), null, { timeout: 15000 });
  await sleep(150);
}
export async function phase(p) { return p.evaluate(() => window.PsikoVakaOnline.rooms.phase()); }
export async function waitPhase(p, ph, timeout = 30000) {
  return p.waitForFunction((x) => { const v = window.PsikoVakaOnline.rooms.phase(); return Array.isArray(x) ? x.includes(v) : v === x; }, ph, { timeout });
}
export async function waitPlaying(p, round, timeout = 40000) {
  return p.waitForFunction((r) => { const NS = window.PsikoVakaOnline; const s = NS.rooms.state; return s && s.round && s.round.round_no === r && NS.rooms.phase() === 'playing' && NS.app.view === 'play' && !document.getElementById('diagnosisInput').disabled; }, round, { timeout });
}
export async function state(p) { return p.evaluate(() => JSON.parse(JSON.stringify(window.PsikoVakaOnline.rooms.state))); }
export async function myProfile(p) {
  return p.evaluate(async () => { const c = window.PsikoVakaOnline.api.client(); const { data } = await c.from('profiles').select('ranked_points,matches_played,matches_won').eq('id', window.PsikoVakaOnline.api.myId()).single(); return data; });
}
export async function keyIssues(p) { return p.evaluate(() => window.PsikoVakaOnline.match.keyIssues); }
