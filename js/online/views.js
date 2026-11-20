/**
 * PsikoVaka Online — ortak arayüz parçaları (alt sayfa, onay, afiş) + Online merkezi (#/online) + oda kurma sayfası.
 */
(function (global) {
    'use strict';
    const NS = global.PsikoVakaOnline;
    const { esc, icon, $, $all } = NS.util;
    const T = NS.T;

    // ================================================================ alt sayfa (sheet)
    let sheetSeq = 0;
    const openSheets = [];
    /**
     * opts: { title, body (html), actions:[{id,label,kind,icon}], onAction(id, sheet), onClose(), wide, className }
     * Dönüş: { el, body, close(), setBusy(id, b) }
     */
    function sheet(opts) {
        const id = 'olSheet' + (++sheetSeq);
        const wrap = document.createElement('div');
        wrap.className = 'ol-sheet-backdrop' + (opts.className ? ' ' + opts.className : '');
        wrap.innerHTML = `
            <div class="ol-sheet${opts.wide ? ' is-wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="${id}T">
                <div class="ol-sheet-head">
                    <h2 class="ol-sheet-title" id="${id}T">${esc(opts.title || '')}</h2>
                    <button class="icon-btn" type="button" data-ol-close aria-label="Kapat">${icon('x')}</button>
                </div>
                <div class="ol-sheet-body">${opts.body || ''}</div>
                ${opts.actions && opts.actions.length ? `<div class="ol-sheet-foot">${opts.actions.map(a =>
                    `<button type="button" class="btn ${a.kind === 'primary' ? 'btn-primary' : a.kind === 'danger' ? 'btn-secondary ol-btn-danger' : a.kind === 'ghost' ? 'btn-ghost' : 'btn-secondary'}" data-ol-action="${esc(a.id)}">${a.icon ? icon(a.icon) : ''}<span>${esc(a.label)}</span></button>`).join('')}</div>` : ''}
            </div>`;
        const returnFocus = document.activeElement;
        document.body.appendChild(wrap);
        document.body.classList.add('ol-sheet-open');
        syncBannerSpace();
        const api = {
            el: wrap,
            body: wrap.querySelector('.ol-sheet-body'),
            closed: false,
            close(silent) {
                if (api.closed) return;
                api.closed = true;
                wrap.classList.remove('open');
                const idx = openSheets.indexOf(api); if (idx >= 0) openSheets.splice(idx, 1);
                if (!openSheets.length) { document.body.classList.remove('ol-sheet-open'); syncBannerSpace(); }
                setTimeout(() => wrap.remove(), NS.util.reducedMotion() ? 0 : 180);
                if (!silent && opts.onClose) opts.onClose();
                if (returnFocus && document.body.contains(returnFocus) && returnFocus.focus) { try { returnFocus.focus({ preventScroll: true }); } catch (e) { /* yok */ } }
            },
            setBusy(actId, busy) {
                const b = wrap.querySelector(`[data-ol-action="${actId}"]`);
                if (b) { b.disabled = !!busy; b.classList.toggle('is-loading', !!busy); }
            }
        };
        openSheets.push(api);
        wrap.addEventListener('click', (e) => {
            if (e.target === wrap || e.target.closest('[data-ol-close]')) { api.close(); return; }
            const a = e.target.closest('[data-ol-action]');
            if (a && opts.onAction) opts.onAction(a.dataset.olAction, api);
        });
        requestAnimationFrame(() => {
            wrap.classList.add('open');
            const f = wrap.querySelector('[data-ol-autofocus]') || wrap.querySelector('.ol-sheet-foot .btn-primary') || wrap.querySelector('[data-ol-close]');
            if (f) { try { f.focus({ preventScroll: true }); } catch (e) { /* yok */ } }
        });
        return api;
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && openSheets.length) {
            e.stopPropagation();
            openSheets[openSheets.length - 1].close();
        }
    }, true);
    function closeAllSheets() { openSheets.slice().forEach(s => s.close(true)); }

    /** Onay sayfası. Dönüş: Promise<boolean> */
    function confirm(title, text, okLabel, opts) {
        return new Promise(resolve => {
            let done = false;
            const s = sheet({
                title,
                body: `<p class="ol-sheet-text">${esc(text)}</p>`,
                actions: [{ id: 'no', label: (opts && opts.cancelLabel) || 'Vazgeç', kind: 'secondary' }, { id: 'yes', label: okLabel || 'Tamam', kind: (opts && opts.danger) ? 'danger' : 'primary' }],
                onAction(id, sh) { done = true; sh.close(true); resolve(id === 'yes'); },
                onClose() { if (!done) resolve(false); }
            });
            return s;
        });
    }

    // ================================================================ afiş (davet vb.)
    let bannerHost = null;
    function bannerArea() {
        if (!bannerHost || !document.body.contains(bannerHost)) {
            bannerHost = document.createElement('div');
            bannerHost.className = 'ol-banners';
            bannerHost.setAttribute('aria-live', 'polite');
            document.body.appendChild(bannerHost);
            // Afiş hiçbir denetimi örtmesin: yüksekliği kadar yer ayrılır (--ol-banner-space; CSS üst çubukları aşağı iter)
            if (global.ResizeObserver) new ResizeObserver(syncBannerSpace).observe(bannerHost);
            new MutationObserver(syncBannerSpace).observe(bannerHost, { childList: true });
        }
        return bannerHost;
    }
    // Vaka çözülürken afiş ekranı örtmez (H17): oyun çubuğunda küçük "N davet" hapı; dokununca afiş açılır, vaka bitince tam afiş.
    let bannerPeek = false;
    function caseActive() {
        const gm = NS.game && NS.game();
        return document.body.classList.contains('is-playing') && !!gm && !gm.isGameOver;
    }
    function syncBannerSpace() {
        if (!bannerHost) return;
        const live = Array.from(bannerHost.children).filter(el => !el.classList.contains('is-leaving'));
        if (!live.length) bannerPeek = false;
        const docked = live.length > 0 && caseActive() && !bannerPeek;
        document.body.classList.toggle('ol-banners-docked', docked);
        const pill = document.getElementById('playInvitePill');
        if (pill) {
            pill.hidden = !docked;
            const t = pill.querySelector('[data-pill-text]');
            if (t) t.textContent = live.length === 1 ? '1 davet' : `${live.length} davet`;
        }
        const h = live.length && !docked && !document.body.classList.contains('ol-sheet-open') ? Math.ceil(bannerHost.getBoundingClientRect().height) + 8 : 0;
        document.documentElement.style.setProperty('--ol-banner-space', h + 'px');
        document.body.classList.toggle('ol-has-banner', h > 0);
    }
    document.addEventListener('psikovaka:playstate', () => { if (!caseActive()) bannerPeek = false; syncBannerSpace(); });
    document.addEventListener('click', (e) => {
        const pill = e.target.closest && e.target.closest('#playInvitePill');
        if (!pill) return;
        bannerPeek = true;
        syncBannerSpace();
        const first = bannerHost && bannerHost.querySelector('.ol-banner:not(.is-leaving) [data-ol-b]');
        if (first) { try { first.focus(); } catch (err) {} }
    });
    /** opts: { key, html, actions:[{id,label,kind}], onAction(id), ttlMs } */
    function banner(opts) {
        const host = bannerArea();
        if (opts.key) { const old = host.querySelector(`[data-key="${CSS.escape(opts.key)}"]`); if (old) old.remove(); }
        const el = document.createElement('div');
        el.className = 'ol-banner';
        if (opts.key) el.dataset.key = opts.key;
        el.setAttribute('role', 'alert');
        el.innerHTML = `<div class="ol-banner-main">${opts.html}</div><div class="ol-banner-actions">${(opts.actions || []).map(a =>
            `<button type="button" class="btn btn-sm ${a.kind === 'primary' ? 'btn-primary' : 'btn-secondary'}" data-ol-b="${esc(a.id)}">${esc(a.label)}</button>`).join('')}</div>`;
        let timer = null;
        const close = () => { clearTimeout(timer); el.classList.add('is-leaving'); syncBannerSpace(); setTimeout(() => { el.remove(); syncBannerSpace(); }, NS.util.reducedMotion() ? 0 : 200); };
        el.addEventListener('click', (e) => {
            const b = e.target.closest('[data-ol-b]');
            if (!b) return;
            if (opts.onAction) opts.onAction(b.dataset.olB, close, b);
        });
        host.appendChild(el);
        if (opts.ttlMs > 0) timer = setTimeout(close, opts.ttlMs);
        return { el, close };
    }
    function closeBanner(key) {
        if (!bannerHost) return;
        const el = bannerHost.querySelector(`[data-key="${CSS.escape(key)}"]`);
        if (el) el.remove();
        syncBannerSpace();
    }

    // ================================================================ menü rozeti
    function setNavBadge(n) {
        $all('[data-route="online"]').forEach(a => {
            let b = a.querySelector('.ol-nav-badge');
            if (!n) { if (b) b.remove(); a.removeAttribute('data-ol-badge'); return; }
            if (!b) { b = document.createElement('span'); b.className = 'ol-nav-badge'; a.appendChild(b); }
            b.textContent = n > 9 ? '9+' : String(n);
            b.setAttribute('aria-label', `${n} bekleyen bildirim`);
            a.setAttribute('data-ol-badge', String(n));
        });
    }

    // ================================================================ oyuncu satırı (küçük)
    function playerChip(p, extra) {
        const name = p.username || p.display_name || 'Oyuncu';
        return `<span class="ol-pchip">${NS.avatar(p.avatar, { size: 32, framed: true })}<span class="ol-pchip-name">${esc(name)}</span>${extra || ''}</span>`;
    }

    // ================================================================ ONLINE MERKEZİ
    const hub = {
        mount: null,
        publicRooms: [],
        pubTimer: null,
        lbLoaded: false,
        rendered: false
    };

    function hubState() {
        const A = global.PsikoVakaAccount;
        if (location.protocol === 'file:') return 'file';
        if (!A) return 'unavailable';
        const av = A.availability;
        if (av === 'pending') return 'pending';
        if (av !== 'ready') return 'unavailable';
        if (A.state === 'guest') return 'guest';
        if (A.state === 'signed_in_no_username') return 'username';
        return 'ready';
    }

    function renderHub() {
        const m = hub.mount;
        if (!m) return;
        const st = hubState();
        m.dataset.state = st;
        if (st !== 'ready') {
            stopHubLive();
            const g = NS.game();
            const box = (title, text, btns) => `
                <div class="ol-gate card">
                    <div class="ol-gate-art" aria-hidden="true">${NS.avatar({ v: 2, color: 'sky', eyes: 'happy', mouth: 'smile', headwear: 'headphones' }, { size: 96, framed: false, animated: true, emote: 'wave' })}</div>
                    <div class="ol-gate-text"><h2 class="ol-gate-title">${title}</h2><p class="ol-gate-sub">${text}</p></div>
                    ${btns ? `<div class="ol-gate-actions">${btns}</div>` : ''}
                </div>`;
            if (st === 'file') {
                m.innerHTML = box('Online bu sürümde kapalı', 'Tek dosyalık sürüm sunucuya bağlanamaz. Online oynamak için siteyi tarayıcıdan aç: gandalfthegreey.github.io/psikovaka', '');
            } else if (st === 'pending') {
                m.innerHTML = `<div class="ol-gate card ol-gate-loading"><span class="ol-spinner" aria-hidden="true"></span><span>Bağlanıyor…</span></div>`;
            } else if (st === 'unavailable') {
                m.innerHTML = box('Sunucuya ulaşılamıyor', 'Online özellikler şu an kullanılamıyor. Bağlantını kontrol et; tek kişilik oyun çalışmaya devam ediyor.', `<button class="btn btn-secondary" type="button" data-ol-hub="retry">${icon('refresh')} Tekrar dene</button>`);
            } else if (st === 'guest') {
                m.innerHTML = box('Arkadaşlarınla aynı vakayı çöz', 'Oda kurmak, arkadaş eklemek ve sıralamaya girmek için ücretsiz bir hesap aç ya da giriş yap.',
                    `<button class="btn btn-primary btn-lg" type="button" data-ol-hub="signup">${icon('user-plus')} Hesap oluştur</button><button class="btn btn-secondary btn-lg" type="button" data-ol-hub="signin">Giriş yap</button>`);
            } else if (st === 'username') {
                m.innerHTML = box('Bir kullanıcı adı seç', 'Arkadaşların seni kullanıcı adınla bulur.', `<button class="btn btn-primary" type="button" data-ol-hub="username">Kullanıcı adı seç</button>`);
            }
            hub.rendered = false;
            return;
        }
        if (!hub.rendered) {
            m.innerHTML = `
                <div class="ol-hub">
                    <section class="ol-quick card" id="olQuick" aria-labelledby="olQuickT" hidden></section>
                    <div class="ol-hub-cta">
                        <button class="ol-cta-card ol-cta-primary" type="button" data-ol-hub="create">
                            <span class="ol-cta-icon">${icon('swords')}</span>
                            <span class="ol-cta-text"><span class="ol-cta-title">Oda kur</span><span class="ol-cta-sub">Düello, herkes tek ya da turnuva</span></span>
                            ${icon('chevron-right', 'ol-cta-chev')}
                        </button>
                        <form class="ol-cta-card ol-join-card" data-ol-join novalidate>
                            <span class="ol-cta-icon">${icon('link')}</span>
                            <span class="ol-cta-text">
                                <label class="ol-cta-title" for="olJoinCode">Koda katıl</label>
                                <span class="ol-join-row">
                                    <input class="form-input ol-code-input" id="olJoinCode" name="code" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="6" placeholder="ABC234" aria-describedby="olJoinErr">
                                    <button class="btn btn-primary" type="submit">Katıl</button>
                                </span>
                                <span class="ol-form-error" id="olJoinErr" role="alert"></span>
                            </span>
                        </form>
                    </div>

                    <section class="ol-section" aria-labelledby="olPubTitle">
                        <div class="ol-section-head">
                            <h2 class="ol-section-title" id="olPubTitle">Açık odalar</h2>
                            <button class="icon-btn icon-btn-sm" type="button" data-ol-hub="refresh-pub" aria-label="Listeyi yenile">${icon('refresh')}</button>
                        </div>
                        <div class="ol-pub-list" id="olPubList" aria-live="polite"></div>
                    </section>

                    <section class="ol-section" aria-labelledby="olFriendsTitle">
                        <div class="ol-section-head">
                            <h2 class="ol-section-title" id="olFriendsTitle">Arkadaşlar</h2>
                        </div>
                        <div id="olFriendsMount"></div>
                    </section>

                    <section class="ol-section" aria-labelledby="olLbTitle">
                        <div class="ol-section-head">
                            <h2 class="ol-section-title" id="olLbTitle">Sıralama</h2>
                            <a class="btn btn-ghost btn-sm ol-section-link" href="#/ligler">${icon('trophy')}<span>Ligler</span></a>
                            <button class="icon-btn icon-btn-sm" type="button" data-ol-hub="refresh-lb" aria-label="Sıralamayı yenile">${icon('refresh')}</button>
                        </div>
                        <div class="ol-lb" id="olLb"></div>
                    </section>
                </div>`;
            hub.rendered = true;
            hub.lbLoaded = false;
        }
        if (NS.quick) { NS.quick.bindCard(m); NS.quick.renderCard(); }
        if (NS.friends) NS.friends.renderInto($('#olFriendsMount', m));
        renderPublicRooms();
        startHubLive();
        if (!hub.lbLoaded) loadLeaderboard();
    }

    function hubVisible() {
        if (!hub.mount) return false;
        const scr = hub.mount.closest('.screen');
        return !scr || !scr.hidden;
    }
    function startHubLive() {
        if (hub.pubTimer) return;
        refreshPublicRooms();
        NS.realtime.watchPublicRooms(NS.util.debounce(refreshPublicRooms, 400));
        hub.pubTimer = setInterval(() => { if (hubVisible() && !document.hidden) refreshPublicRooms(); }, 20000);
    }
    function stopHubLive() {
        clearInterval(hub.pubTimer); hub.pubTimer = null;
        if (NS.realtime) NS.realtime.stopPublicRooms();
    }

    let pubBusy = false;
    async function refreshPublicRooms() {
        if (pubBusy || hubState() !== 'ready') return;
        pubBusy = true;
        const r = await NS.api.listPublicRooms();
        pubBusy = false;
        hub.pubError = r.ok ? null : r.error;
        if (r.ok) hub.publicRooms = r.data.filter(x => x.player_count < x.capacity);
        hub.pubLoaded = true;
        renderPublicRooms();
    }
    function renderPublicRooms() {
        const list = hub.mount && $('#olPubList', hub.mount);
        if (!list) return;
        if (!hub.pubLoaded) { list.innerHTML = `<div class="ol-skel"></div><div class="ol-skel"></div>`; return; }
        if (hub.pubError) {
            list.innerHTML = `<div class="ol-empty">${icon('alert')}<span>${esc(hub.pubError.message)}</span><button class="btn btn-sm btn-secondary" type="button" data-ol-hub="refresh-pub">Tekrar dene</button></div>`;
            return;
        }
        if (!hub.publicRooms.length) {
            list.innerHTML = `<div class="ol-empty">${icon('globe')}<span>Şu an açık oda yok. İlk odayı sen kur.</span></div>`;
            return;
        }
        const myRoom = NS.rooms && NS.rooms.roomId;
        list.innerHTML = hub.publicRooms.map(r => {
            const host = r.host || {};
            const fmt = `${T.target[r.target_type]} · ${r.format === 'rounds' ? r.round_count + ' tur' : T.format[r.format]}`;
            return `
            <div class="ol-pub-row">
                <span class="ol-pub-icon ol-t-${esc(r.target_type)}">${icon(r.mode === 'tournament' ? 'trophy' : r.mode === 'ffa' ? 'users' : 'swords')}</span>
                <span class="ol-pub-text">
                    <span class="ol-pub-title">${esc(T.mode[r.mode])} <span class="ol-pub-dim">· ${esc(fmt)}</span></span>
                    <span class="ol-pub-sub">${NS.avatar(host.avatar, { size: 20, framed: true })}<span>${esc(host.username || 'Oyuncu')}</span></span>
                </span>
                <span class="ol-pub-count" aria-label="${r.player_count} / ${r.capacity} oyuncu">${icon('users')}${r.player_count}/${r.capacity}</span>
                <button class="btn btn-sm btn-secondary" type="button" data-ol-joincode="${esc(r.code)}" ${myRoom === r.id ? 'disabled' : ''}>Katıl</button>
            </div>`;
        }).join('');
    }

    async function loadLeaderboard() {
        const box = hub.mount && $('#olLb', hub.mount);
        const A = global.PsikoVakaAccount;
        if (!box || !A) return;
        hub.lbLoaded = true;
        box.innerHTML = `<div class="ol-skel"></div><div class="ol-skel"></div><div class="ol-skel"></div>`;
        const r = await A.getLeaderboard(10);
        if (!r.ok) {
            box.innerHTML = `<div class="ol-empty">${icon('alert')}<span>${esc(r.error.message)}</span><button class="btn btn-sm btn-secondary" type="button" data-ol-hub="refresh-lb">Tekrar dene</button></div>`;
            hub.lbLoaded = false;
            return;
        }
        const meId = NS.api.myId();
        const rows = r.rows.slice();
        if (r.me && !rows.find(x => x.user_id === r.me.user_id)) rows.push(r.me);
        if (!rows.length) { box.innerHTML = `<div class="ol-empty">${icon('trophy')}<span>Henüz sıralamada kimse yok. İlk sen ol.</span></div>`; return; }
        box.innerHTML = `<ol class="ol-lb-list">${rows.map(x => `
            <li class="ol-lb-row${x.user_id === meId ? ' is-me' : ''}">
                <span class="ol-lb-pos">${x.position}</span>
                ${NS.avatar(x.avatar, { size: 36, framed: true })}
                <span class="ol-lb-name">${esc(x.username || x.display_name)}${x.user_id === meId ? ' <span class="ol-me-tag">sen</span>' : ''}</span>
                <span class="ol-lb-tier">${NS.leagueBadge(x.ranked_points, 20)}<span class="ol-lb-tier-name">${esc(NS.leagueName(x.ranked_points))}</span></span>
                <span class="ol-lb-rp">${x.ranked_points} RP</span>
            </li>`).join('')}</ol>`;
    }

    function bindHub() {
        hub.mount.addEventListener('click', (e) => {
            const b = e.target.closest('[data-ol-hub]');
            const j = e.target.closest('[data-ol-joincode]');
            const g = NS.game();
            if (j) { NS.app.joinByCode(j.dataset.olJoincode, j); return; }
            if (!b) return;
            const act = b.dataset.olHub;
            if (act === 'create') openCreateSheet();
            else if (act === 'signin' && g) g.openAuthSheet('signin');
            else if (act === 'signup' && g) g.openAuthSheet('signup');
            else if (act === 'username' && g && g.openUsernameModal) g.openUsernameModal();
            else if (act === 'retry') location.reload();
            else if (act === 'refresh-pub') { hub.pubLoaded = false; renderPublicRooms(); refreshPublicRooms(); }
            else if (act === 'refresh-lb') loadLeaderboard();
        });
        hub.mount.addEventListener('submit', (e) => {
            const f = e.target.closest('[data-ol-join]');
            if (!f) return;
            e.preventDefault();
            const inp = $('#olJoinCode', f);
            const err = $('#olJoinErr', f);
            const code = (inp.value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (code.length !== 6) { err.textContent = 'Oda kodu 6 karakter olmalı.'; inp.focus(); return; }
            err.textContent = '';
            NS.app.joinByCode(code, f.querySelector('button[type="submit"]'), (msg) => { err.textContent = msg; });
        });
        hub.mount.addEventListener('input', (e) => {
            if (e.target.id === 'olJoinCode') {
                const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
                if (v !== e.target.value) e.target.value = v;
                const err = $('#olJoinErr', hub.mount); if (err) err.textContent = '';
            }
        });
    }

    function mountHub(el) {
        hub.mount = el;
        hub.rendered = false;
        bindHub();
        renderHub();
    }

    // ================================================================ ODA KURMA SAYFASI
    const LAST_KEY = 'psikovaka_online_last_room';
    function loadLast() {
        try {
            const v = JSON.parse(localStorage.getItem(LAST_KEY) || 'null');
            if (v && T.mode[v.mode]) return v;
        } catch (e) { /* yok */ }
        return null;
    }
    function defaultsFor(mode, prev) {
        const p = prev || {};
        const d = { mode, target: p.target || 'diagnosis', visibility: p.visibility || 'private', rounds: p.rounds || 5, seeding: p.seeding || 'random' };
        if (mode === 'duel') { d.format = (p.mode === 'duel' && p.format) || 'rounds'; d.capacity = 2; }
        if (mode === 'ffa') { d.format = 'rounds'; d.capacity = (p.mode === 'ffa' && p.capacity) || 4; }
        if (mode === 'tournament') { d.format = (p.mode === 'tournament' && p.format) || 'battle'; d.capacity = (p.mode === 'tournament' && p.capacity) || 4; }
        return d;
    }
    function roundsFor(s) {
        if (s.format === 'hp') return 10;
        if (s.format === 'battle') return s.capacity - 1;
        if (s.format === 'bracket') return s.capacity === 8 ? 3 : 2;
        return s.rounds;
    }

    /** Ayar formu HTML'i (oda kurma ve lobi ayarları ortak). opts.locked: mod/biçim değiştirilemez */
    function settingsForm(s, opts) {
        const o = opts || {};
        const radio = (group, val, title, sub, checked, ic) => `
            <label class="ol-opt${checked ? ' is-checked' : ''}">
                <input type="radio" name="${group}" value="${esc(val)}" ${checked ? 'checked' : ''}>
                ${ic ? `<span class="ol-opt-icon">${icon(ic)}</span>` : ''}
                <span class="ol-opt-text"><span class="ol-opt-title">${esc(title)}</span>${sub ? `<span class="ol-opt-sub">${esc(sub)}</span>` : ''}</span>
            </label>`;
        const chips = (group, vals, cur, label) => `<div class="ol-chips" role="radiogroup" aria-label="${esc(label)}">${vals.map(v =>
            `<label class="ol-chip${String(v.v) === String(cur) ? ' is-checked' : ''}"><input type="radio" name="${group}" value="${esc(v.v)}" ${String(v.v) === String(cur) ? 'checked' : ''}><span>${esc(v.l)}</span></label>`).join('')}</div>`;
        let html = '';
        if (!o.locked) {
            html += `<fieldset class="ol-field"><legend class="ol-legend">Mod</legend><div class="ol-opts ol-opts-3">
                ${radio('mode', 'duel', T.mode.duel, T.modeSub.duel, s.mode === 'duel', 'swords')}
                ${radio('mode', 'ffa', T.mode.ffa, T.modeSub.ffa, s.mode === 'ffa', 'users')}
                ${radio('mode', 'tournament', T.mode.tournament, T.modeSub.tournament, s.mode === 'tournament', 'trophy')}
            </div></fieldset>`;
            const fmts = s.mode === 'duel' ? ['rounds', 'hp'] : s.mode === 'tournament' ? ['battle', 'bracket'] : ['rounds'];
            html += `<fieldset class="ol-field"><legend class="ol-legend">Biçim</legend>${fmts.length > 1
                ? `<div class="ol-opts ol-opts-2">${fmts.map(f => radio('format', f, T.format[f], T.formatSub[f], s.format === f, f === 'hp' ? 'heart' : f === 'bracket' ? 'bracket' : f === 'battle' ? 'flag' : 'chart')).join('')}</div>`
                : `<p class="ol-field-note">${esc(T.format.rounds)}: ${esc(T.formatSub.rounds)}</p>`}</fieldset>`;
        }
        html += `<fieldset class="ol-field"><legend class="ol-legend">Hedef</legend>
            ${chips('target', ['diagnosis', 'therapy', 'pharmacology', 'combo'].map(t => ({ v: t, l: T.target[t] })), s.target, 'Hedef')}
            <p class="ol-field-note" data-ol-note="target">${esc(T.targetSub[s.target])}</p></fieldset>`;
        if (s.mode === 'ffa') {
            html += `<fieldset class="ol-field"><legend class="ol-legend">Kişi sayısı</legend>
                ${chips('capacity', [2, 3, 4, 5, 6, 7, 8].filter(n => !o.minCapacity || n >= o.minCapacity).map(n => ({ v: n, l: String(n) })), s.capacity, 'Kişi sayısı')}
                <p class="ol-field-note">Oda dolmadan maç başlamaz.</p></fieldset>`;
        } else if (s.mode === 'tournament') {
            html += `<fieldset class="ol-field"><legend class="ol-legend">Kişi sayısı</legend>
                ${chips('capacity', [4, 8].filter(n => !o.minCapacity || n >= o.minCapacity).map(n => ({ v: n, l: n + ' kişi' })), s.capacity, 'Kişi sayısı')}
                <p class="ol-field-note">Oda dolmadan maç başlamaz.</p></fieldset>`;
        }
        if (s.format === 'rounds') {
            html += `<fieldset class="ol-field"><legend class="ol-legend">Tur sayısı</legend>
                ${chips('rounds', [3, 5, 7, 10].map(n => ({ v: n, l: String(n) })), s.rounds, 'Tur sayısı')}</fieldset>`;
        } else {
            html += `<p class="ol-field-note ol-rounds-note">${icon('info')}<span>${s.format === 'hp' ? 'Can bitene kadar, en fazla 10 tur.' : `Tur sayısı kişi sayısına göre: ${roundsFor(s)} tur.`}</span></p>`;
        }
        if (s.format === 'bracket' && !o.locked) {
            html += `<fieldset class="ol-field"><legend class="ol-legend">Eşleştirme</legend>
                ${chips('seeding', [{ v: 'random', l: 'Rastgele' }, { v: 'ranked', l: 'RP’ye göre' }], s.seeding, 'Eşleştirme')}</fieldset>`;
        }
        html += `<label class="ol-switch-row"><span class="ol-switch-text"><span class="ol-opt-title">Herkese açık</span><span class="ol-opt-sub">Açık odalar listesinde görünür; kapalıysa yalnızca kod ve davetle girilir.</span></span>
            <input type="checkbox" class="ol-switch-input" name="visibility" ${s.visibility === 'public' ? 'checked' : ''}><span class="switch" aria-hidden="true"><span class="switch-knob"></span></span></label>`;
        return html;
    }
    function readForm(root, s) {
        const val = (n) => { const x = root.querySelector(`input[name="${n}"]:checked`); return x ? x.value : null; };
        const out = Object.assign({}, s);
        if (val('mode')) out.mode = val('mode');
        if (val('format')) out.format = val('format');
        if (val('target')) out.target = val('target');
        if (val('capacity')) out.capacity = parseInt(val('capacity'), 10);
        if (val('rounds')) out.rounds = parseInt(val('rounds'), 10);
        if (val('seeding')) out.seeding = val('seeding');
        const vis = root.querySelector('input[name="visibility"]');
        if (vis) out.visibility = vis.checked ? 'public' : 'private';
        return out;
    }

    function openCreateSheet(preset) {
        let s = preset || defaultsFor((loadLast() || {}).mode || 'duel', loadLast());
        const sh = sheet({
            title: 'Oda kur', wide: true,
            body: `<form class="ol-form" data-ol-create novalidate>${settingsForm(s)}</form><p class="ol-form-error" data-ol-err role="alert"></p>`,
            actions: [{ id: 'create', label: 'Oda kur', kind: 'primary', icon: 'play' }],
            async onAction(id, shx) {
                if (id !== 'create') return;
                s = readForm(shx.body, s);
                shx.setBusy('create', true);
                const r = await NS.app.createRoom(s);
                shx.setBusy('create', false);
                if (r.ok) {
                    try { localStorage.setItem(LAST_KEY, JSON.stringify(s)); } catch (e) { /* yok */ }
                    shx.close(true);
                } else {
                    const el = shx.body.querySelector('[data-ol-err]'); if (el) el.textContent = r.error.message;
                }
            }
        });
        sh.body.addEventListener('change', (e) => {
            const prev = s;
            s = readForm(sh.body, s);
            if (e.target.name === 'mode') s = defaultsFor(s.mode, prev);
            if (['mode', 'format', 'capacity'].includes(e.target.name)) {
                const form = sh.body.querySelector('[data-ol-create]');
                const y = sh.body.scrollTop;
                form.innerHTML = settingsForm(s);
                sh.body.scrollTop = y;
                const again = form.querySelector(`input[name="${e.target.name}"][value="${CSS.escape(String(e.target.value))}"]`);
                if (again) again.focus({ preventScroll: true });
            } else {
                syncChecked(sh.body);
                const note = sh.body.querySelector('[data-ol-note="target"]');
                if (note) note.textContent = T.targetSub[s.target];
            }
        });
        return sh;
    }
    function syncChecked(root) {
        $all('.ol-opt, .ol-chip', root).forEach(l => { const i = l.querySelector('input'); l.classList.toggle('is-checked', !!(i && i.checked)); });
    }

    NS.ui = { sheet, confirm, closeAllSheets, banner, closeBanner, setNavBadge, playerChip, settingsForm, readForm, syncChecked, roundsFor, defaultsFor };
    NS.hub = { mount: mountHub, render: renderHub, refreshPublicRooms, renderPublicRooms, loadLeaderboard, openCreateSheet, state: hubState, stop: stopHubLive };
})(typeof window !== 'undefined' ? window : globalThis);
