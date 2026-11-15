import { chromium } from 'playwright';
import fs from 'node:fs';
export const BASE = process.env.BASE || 'http://localhost:8899/tools/online_dev/harness.html';
// Şifreler supabase/tests/.test-credentials.json'dan (git dışı); dosya yoksa eski varsayılan
const CRED = (() => { try { return JSON.parse(fs.readFileSync(new URL('../../../supabase/tests/.test-credentials.json', import.meta.url), 'utf8')).accounts || []; } catch (e) { return []; } })();
export const PW = '123456';
export const pwFor = (email) => (CRED.find(a => a.email === email) || {}).password || PW;
const SUPA = fs.readFileSync('/home/claude/rt/node_modules/@supabase/supabase-js/dist/umd/supabase.js');
export async function browser() {
  return chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
}
export async function ctx(b, opts = {}) {
  const c = await b.newContext({ viewport: opts.viewport || { width: 390, height: 844 }, deviceScaleFactor: opts.dsf || 1, isMobile: !!opts.mobile, hasTouch: !!opts.mobile, colorScheme: opts.dark === false ? 'light' : 'dark', reducedMotion: opts.reduced ? 'reduce' : 'no-preference' });
  await c.route('**/*', (route) => {
    const u = route.request().url();
    if (u.includes('cdn.jsdelivr.net/npm/@supabase/supabase-js')) return route.fulfill({ status: 200, contentType: 'application/javascript', body: SUPA, headers: { 'access-control-allow-origin': '*' } });
    if (/fonts\.(googleapis|gstatic)|unpkg\.com|ntfy\.sh|peerjs|twilio|stun/.test(u)) return route.abort();
    return route.continue();
  });
  if (opts.theme) await c.addInitScript((t) => { try { localStorage.setItem('psikovaka_theme', t); } catch (e) {} }, opts.theme);
  return c;
}
export async function page(c, label) {
  const p = await c.newPage();
  p._label = label || '';
  p._errors = [];
  p.on('pageerror', e => { p._errors.push('pageerror: ' + e.message); console.log(`[${p._label}] PAGEERROR`, e.message); });
  p.on('console', m => { if (m.type() === 'error') { const t = m.text(); if (!/ERR_FAILED|net::|Failed to load resource|ntfy|peerjs|fonts/.test(t)) { p._errors.push(t); } if (process.env.VERBOSE) console.log(`[${p._label}] console.error`, t); } if (process.env.VERBOSE && m.type()==='warning') console.log(`[${p._label}] warn`, m.text()); });
  return p;
}
export async function signIn(p, email, url) {
  await p.goto(url || BASE + '#/online');
  await p.waitForFunction(() => window.PsikoVakaAccount && window.PsikoVakaAccount.availability !== 'pending', null, { timeout: 20000 });
  const st = await p.evaluate(() => window.PsikoVakaAccount.state);
  if (st !== 'ready') {
    const r = await p.evaluate(async ([e, pw]) => window.PsikoVakaAccount.signIn(e, pw, { remember: true }), [email, pwFor(email)]);
    if (!r.ok) throw new Error('signIn failed ' + JSON.stringify(r));
  }
  await p.waitForFunction(() => window.PsikoVakaAccount.state === 'ready', null, { timeout: 20000 });
  await p.waitForFunction(() => window.PsikoVakaOnline && window.PsikoVakaOnline.api.client(), null, { timeout: 10000 });
}
export const sleep = (ms) => new Promise(r => setTimeout(r, ms));
export function check(cond, msg) { if (!cond) { console.log('  FAIL', msg); check.fails = (check.fails || 0) + 1; } else { console.log('  ok  ', msg); check.oks = (check.oks || 0) + 1; } }
export async function waitFor(p, fn, arg, timeout = 20000) { return p.waitForFunction(fn, arg, { timeout }); }
