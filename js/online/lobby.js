/**
 * PsikoVaka Online — lobi sahnesi.
 * Oyuncuların Nöro'ları çizilmiş bir odada durur; boş yere dokununca kendi Nöro'n oraya zıplar
 * (konum room:<id> kanalında yayınlanır, geç gelenler presence'ten alır; yalnızca görsel).
 * Duygu ve hazır mesaj düğmeleri herkese gider. Serbest yazı yok.
 * Başlatma kuralları sunucudakinin aynısı (rooms.startGate); yarışta sunucu hatası zarifçe gösterilir.
 */
(function (global) {
    'use strict';
    const NS = global.PsikoVakaOnline;
    const { esc, icon, $ } = NS.util;
    const T = NS.T;

    const L = {
        root: null, nodes: new Map(), emotes: {}, bubbles: {}, timers: [],
        emoteLimit: NS.util.rateLimiter(4, 6000),
        sayLimit: NS.util.rateLimiter(3, 6000),
        offs: [], lastPlayers: null, lastHost: null, busy: false
    };

    // ------------------------------------------------------------ yerleşim
    const FLOOR_TOP = 0.46, FLOOR_BOTTOM = 0.9;
    /** Kapasiteye göre varsayılan yerler (0-1). 5+ kişide iki sıra. */
    function slots(n, narrow) {
        const out = [];
        if (narrow && n > 4) {
            // dar ekranda üç sıra (3-3-2) ki ad etiketleri okunabilsin
            const rows = [Math.ceil(n / 3), Math.ceil((n - Math.ceil(n / 3)) / 2)];
            rows.push(n - rows[0] - rows[1]);
            const ys = [0.57, 0.72, 0.87];
            rows.forEach((cnt, ri) => { for (let i = 0; i < cnt; i++) out.push({ x: (i + 1) / (cnt + 1) + (ri === 1 ? 0.04 : 0), y: ys[ri] }); });
            return out;
        }
        if (n <= 4) {
            for (let i = 0; i < n; i++) out.push({ x: (i + 1) / (n + 1), y: 0.72 + (i % 2 ? 0.05 : -0.02) });
        } else {
            const back = Math.ceil(n / 2), front = n - back;
            for (let i = 0; i < back; i++) out.push({ x: 0.1 + (i + 0.5) * (0.8 / back), y: 0.6 });
            for (let i = 0; i < front; i++) out.push({ x: 0.1 + (i + 0.5) * (0.8 / front) + (front < back ? 0.8 / back / 2 : 0), y: 0.84 });
        }
        return out;
    }

    function narrow() { const l = L.root && L.root.querySelector('#olStageLayer'); return !!(l && l.clientWidth && l.clientWidth < 480); }
    function posFor(p, idx, cap) {
        const pr = NS.rooms.presence[p.user_id];
        if (pr && isFinite(pr.x) && isFinite(pr.y)) return { x: pr.x, y: Math.max(FLOOR_TOP, Math.min(FLOOR_BOTTOM, pr.y)) };
        const s = slots(cap, narrow())[idx] || { x: 0.5, y: 0.72 };
        return s;
    }

    // ------------------------------------------------------------ sahne süsleri (özgün, sade)
    function stageArt() {
        return `
        <div class="ol-stage-wall" aria-hidden="true">
            <svg class="ol-deco ol-deco-bunting" viewBox="0 0 400 40" preserveAspectRatio="none"><path class="ol-deco-line" d="M0 6 Q100 22 200 8 T400 6"/>
                ${[20, 60, 100, 140, 180, 220, 260, 300, 340, 380].map((x, i) => `<path class="ol-flag ol-flag-${i % 4}" d="M${x - 9} ${10 + Math.sin(i) * 3} L${x + 9} ${10 + Math.sin(i + 0.5) * 3} L${x} ${30 + Math.sin(i) * 2} Z"/>`).join('')}</svg>
            <svg class="ol-deco ol-deco-board" viewBox="0 0 120 70"><rect class="ol-deco-frame" x="2" y="2" width="116" height="66" rx="8"/>
                <path class="ol-deco-pulse" d="M10 40 H38 L46 22 L58 54 L66 34 L72 40 H110"/></svg>
            <svg class="ol-deco ol-deco-window" viewBox="0 0 80 90"><rect class="ol-deco-frame" x="3" y="3" width="74" height="84" rx="38"/><path class="ol-deco-line" d="M40 6 V86 M6 46 H74"/><circle class="ol-deco-sun" cx="56" cy="28" r="8"/></svg>
            <svg class="ol-deco ol-deco-shelf" viewBox="0 0 90 80"><rect class="ol-deco-wood" x="2" y="30" width="86" height="5" rx="2"/><rect class="ol-deco-wood" x="2" y="72" width="86" height="5" rx="2"/>
                <rect class="ol-book ol-book-0" x="8" y="8" width="9" height="22" rx="2"/><rect class="ol-book ol-book-1" x="19" y="12" width="8" height="18" rx="2"/><rect class="ol-book ol-book-2" x="29" y="6" width="10" height="24" rx="2"/>
                <rect class="ol-book ol-book-3" x="44" y="50" width="9" height="22" rx="2"/><rect class="ol-book ol-book-0" x="55" y="54" width="8" height="18" rx="2"/><circle class="ol-deco-sun" cx="74" cy="62" r="8"/></svg>
        </div>
        <div class="ol-stage-floor" aria-hidden="true"><div class="ol-rug"></div></div>
        <svg class="ol-deco ol-deco-plant" viewBox="0 0 60 90" aria-hidden="true"><path class="ol-leaf" d="M30 58 C10 50 8 30 14 18 C26 26 32 40 30 58Z"/><path class="ol-leaf" d="M30 58 C48 48 54 30 48 14 C36 22 28 40 30 58Z"/><path class="ol-leaf ol-leaf-2" d="M30 60 C24 40 28 22 32 8 C38 24 36 42 30 60Z"/><path class="ol-pot" d="M16 58 H44 L40 86 H20Z"/></svg>
        <svg class="ol-deco ol-deco-lamp" viewBox="0 0 50 120" aria-hidden="true"><path class="ol-lamp-shade" d="M10 30 L18 6 H32 L40 30Z"/><path class="ol-deco-line" d="M25 30 V112 M12 114 H38"/><ellipse class="ol-lamp-glow" cx="25" cy="34" rx="22" ry="8"/></svg>`;
    }

    // ------------------------------------------------------------ çizim
    function render(root) {
        L.root = root;
        const s = NS.rooms.state;
        if (!s) return;
        if (!root.querySelector('.ol-lobby')) build(root);
        update();
    }

    function build(root) {
        cleanupNodes();
        root.innerHTML = `
        <div class="ol-lobby">
            <header class="ol-topbar">
                <button class="icon-btn" type="button" data-ol-l="leave" aria-label="Odadan ayrıl">${icon('arrow-left')}</button>
                <div class="ol-topbar-main">
                    <h1 class="ol-topbar-title" id="olLobbyTitle"></h1>
                    <div class="ol-topbar-chips" id="olLobbyChips"></div>
                </div>
                <div class="ol-topbar-side">
                    <button class="ol-code-btn" type="button" data-ol-l="copy-code" aria-describedby="olCodeHint"><span class="ol-code-label">Oda kodu</span><span class="ol-code-val" id="olLobbyCode"></span></button>
                    <span class="ol-offscreen" id="olCodeHint">Kopyalamak için dokun</span>
                </div>
            </header>
            <div class="ol-lobby-tools" id="olLobbyTools">
                <button class="btn btn-secondary btn-sm" type="button" data-ol-l="invite">${icon('user-plus')}<span>Arkadaş davet et</span></button>
                <button class="btn btn-ghost btn-sm" type="button" data-ol-l="noro" id="olLobbyNoroBtn" aria-label="Nöro'nu değiştir">${icon('pen')}<span class="ol-lg-only">Nöro'nu değiştir</span><span class="ol-sm-only">Nöro</span></button>
                <button class="btn btn-ghost btn-sm" type="button" data-ol-l="copy-link" aria-label="Davet bağlantısını kopyala">${icon('link')}<span class="ol-lg-only">Davet bağlantısını kopyala</span><span class="ol-sm-only">Bağlantı</span></button>
                <button class="btn btn-ghost btn-sm" type="button" data-ol-l="settings" id="olLobbySettingsBtn">${icon('settings')}<span>Ayarlar</span></button>
            </div>
            <div class="ol-ch-note" id="olChNote" aria-live="polite" hidden></div>
            <div class="ol-stage" id="olStage" tabindex="0" role="group" aria-roledescription="lobi sahnesi" aria-label="Lobi. Boş bir yere dokunarak ya da ok tuşlarıyla Nöro'nu taşı.">
                ${stageArt()}
                <div class="ol-stage-layer" id="olStageLayer"></div>
                <div class="ol-stage-hint" id="olStageHint">Boş bir yere dokun, Nöro'n oraya zıplasın.</div>
            </div>
            <details class="ol-roster" id="olRoster">
                <summary class="ol-roster-sum"><span id="olRosterTitle">Oyuncular</span>${icon('chevron-down')}</summary>
                <ul class="ol-roster-list" id="olRosterList"></ul>
            </details>
            <div class="ol-lobby-dock">
                <div class="ol-react-bar" role="toolbar" aria-label="Tepkiler">
                    ${Object.keys(T.emotes).map(e => `<button class="ol-react" type="button" data-ol-emote="${e}" aria-label="${esc(T.emotes[e])}" title="${esc(T.emotes[e])}">${icon(T.emoteIcon[e])}</button>`).join('')}
                    <span class="ol-react-sep" aria-hidden="true"></span>
                    <div class="ol-quick-wrap">
                        <button class="ol-react ol-react-msg" type="button" data-ol-l="quick" aria-haspopup="menu" aria-expanded="false" aria-controls="olQuickMenu" title="Hazır mesajlar">${icon('message')}<span class="ol-react-label">Mesaj</span></button>
                        <div class="ol-quick-menu" id="olQuickMenu" role="menu" hidden>
                            ${T.quickLobby.map(k => `<button type="button" role="menuitem" class="ol-quick-item" data-ol-say="${k}">${esc(T.quick[k])}</button>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="ol-lobby-cta">
                    <div class="ol-search" id="olSearch" hidden>
                        <span class="ol-search-pulse" aria-hidden="true"></span>
                        <span class="ol-search-text"><span class="ol-search-title" id="olSearchTitle" aria-live="polite">Rakip aranıyor…</span><span class="ol-search-time" id="olSearchTime" aria-hidden="true">0:00</span></span>
                    </div>
                    <p class="ol-gate-line" id="olGateLine" aria-live="polite"></p>
                    <div class="ol-lobby-btns" id="olLobbyBtns"></div>
                </div>
            </div>
        </div>`;
        const root2 = root.querySelector('.ol-lobby');
        root2.addEventListener('click', onClick);
        const stage = $('#olStage', root2);
        stage.addEventListener('pointerdown', onStagePointer);
        stage.addEventListener('keydown', onStageKey);
        document.addEventListener('click', closeQuickOutside, true);
        L.offs.push(() => document.removeEventListener('click', closeQuickOutside, true));
        L.offs.push(NS.rooms.bus.on('presence', () => update()));
        L.offs.push(NS.rooms.bus.on('broadcast', onBroadcast));
        // bağlantı koptu göstergesini düzenli yenile
        const tick = setInterval(() => updatePlayers(), 2000);
        L.offs.push(() => clearInterval(tick));
        // ilk konumumu herkese bildir (geç gelenler presence'ten alır)
        setTimeout(() => {
            const s = NS.rooms.state; if (!s) return;
            const me = NS.rooms.me(); const idx = NS.rooms.active().findIndex(p => p === me);
            const pos = me ? posFor(me, Math.max(0, idx), s.room.capacity) : { x: 0.5, y: 0.7 };
            NS.rooms.trackInitial(pos.x, pos.y);
        }, 400);
    }

    function update() {
        const s = NS.rooms.state;
        if (!s || !L.root || !L.root.querySelector('.ol-lobby')) return;
        const room = s.room;
        const quick = !!room.is_quick;
        L.root.querySelector('.ol-lobby').classList.toggle('is-quick', quick);
        $('#olLobbyTools', L.root).hidden = quick;
        $('.ol-topbar-side', L.root).hidden = quick;
        $('#olLobbyTitle', L.root).textContent = quick ? `Hızlı eşleşme · ${T.mode[room.mode]}` : NS.roomTitle(room);
        $('#olLobbyCode', L.root).textContent = room.code;
        const roundsTxt = room.format === 'rounds' ? `${room.round_count} tur` : room.format === 'hp' ? '600 can' : `${room.round_count} tur`;
        $('#olLobbyChips', L.root).innerHTML = `
            <span class="ol-chip-static ol-t-${esc(room.target_type)}">${icon(T.targetIcon[room.target_type])}${esc(T.target[room.target_type])}</span>
            <span class="ol-chip-static">${icon('clock')}${esc(roundsTxt)} · ${Math.round(room.round_time_limit_sec / 60 * 10) / 10} dk</span>
            ${quick ? '' : `<span class="ol-chip-static">${icon(room.visibility === 'public' ? 'globe' : 'lock')}${esc(T.visibility[room.visibility])}</span>`}`;
        const setBtn = $('#olLobbySettingsBtn', L.root);
        if (setBtn) setBtn.hidden = quick || !NS.rooms.isHost();
        updatePlayers();
        updateRoster();
        updateCta();
        updateChallenge();
        announceDiff();
    }

    /** Telefonda sahnenin altındaki açılır oyuncu listesi (H16): tam ad, lig rozeti, hazır durumu. */
    function updateRoster() {
        const s = NS.rooms.state;
        const box = L.root && $('#olRoster', L.root);
        if (!s || !box) return;
        const act = s.players.filter(p => !p.left_at);
        const myId = NS.api.myId();
        const quick = !!s.room.is_quick;
        $('#olRosterTitle', L.root).textContent = `Oyuncular (${act.length}/${s.room.capacity})`;
        $('#olRosterList', L.root).innerHTML = act.map(p => {
            const disc = NS.rooms.isDisconnected(p.user_id);
            const st = disc ? 'Bağlantı koptu' : quick ? (p.user_id === myId ? 'Sen' : 'Geldi') : p.is_host ? 'Oda sahibi' : p.is_ready ? 'Hazır' : 'Bekliyor';
            const ok = !disc && (p.is_host || p.is_ready || quick);
            return `<li class="ol-roster-row${p.user_id === myId ? ' is-me' : ''}">
                <span class="ol-roster-badge" title="${esc(NS.leagueName(p.ranked_points))}">${NS.leagueBadge(p.ranked_points, 18)}</span>
                <span class="ol-roster-name">${esc(p.username || p.display_name || 'Oyuncu')}${p.user_id === myId ? ' <span class="ol-roster-me">(sen)</span>' : ''}</span>
                <span class="ol-roster-state${ok ? ' is-ok' : ''}">${ok ? icon('check') : ''}${esc(st)}</span>
            </li>`;
        }).join('');
    }

    /** Düello çağrısı: davet edilen arkadaşın durumu (bekleniyor / reddetti / süresi doldu / gönderilemedi). */
    function updateChallenge() {
        const box = L.root && $('#olChNote', L.root);
        if (!box) return;
        const ch = NS.app.challenge;
        const s = NS.rooms.state;
        const joined = ch && s && s.players.some(p => p.user_id === ch.user.id && !p.left_at);
        if (!ch || joined || ch.status === 'sending') { box.hidden = true; box.innerHTML = ''; box.dataset.sig = ''; return; }
        const sig = ch.status + (ch.error ? ch.error.code : '');
        if (box.dataset.sig === sig) return;
        box.dataset.sig = sig;
        const name = esc(ch.user.username);
        let html = '';
        if (ch.status === 'pending' || ch.status === 'accepted') html = `${icon('hourglass')}<span><strong>${name}</strong> bekleniyor. Davet 10 dakika geçerli.</span>`;
        else if (ch.status === 'declined') html = `${icon('x')}<span><strong>${name}</strong> daveti reddetti.</span><span class="ol-ch-actions"><button class="btn btn-sm btn-secondary" type="button" data-ol-l="leave">Odayı kapat</button><button class="btn btn-sm btn-ghost" type="button" data-ol-l="invite">Başkasını davet et</button></span>`;
        else if (ch.status === 'expired') html = `${icon('clock')}<span>Davetin süresi doldu.</span><span class="ol-ch-actions"><button class="btn btn-sm btn-primary" type="button" data-ol-l="reinvite">Tekrar davet et</button><button class="btn btn-sm btn-secondary" type="button" data-ol-l="leave">Odayı kapat</button></span>`;
        else if (ch.status === 'error') html = `${icon('alert')}<span>Davet gönderilemedi: ${esc(ch.error ? ch.error.message : '')}</span><span class="ol-ch-actions"><button class="btn btn-sm btn-primary" type="button" data-ol-l="reinvite">Tekrar dene</button><button class="btn btn-sm btn-secondary" type="button" data-ol-l="leave">Odayı kapat</button></span>`;
        box.className = 'ol-ch-note is-' + ch.status;
        box.innerHTML = html;
        box.hidden = false;
    }

    function figureHtml(p, ready, emote, size) {
        let cfg = p.avatar || {};
        if (ready && !emote && global.PsikoVakaAvatar) {
            cfg = Object.assign({}, global.PsikoVakaAvatar.normalize(cfg), { eyes: 'happy', mouth: 'open' });
        }
        return NS.avatar(cfg, { size, framed: false, animated: true, emote: emote || undefined, title: p.username || '' });
    }

    function updatePlayers() {
        const s = NS.rooms.state;
        const layer = L.root && $('#olStageLayer', L.root);
        if (!s || !layer) return;
        const act = NS.rooms.active();
        const cap = s.room.capacity;
        const myId = NS.api.myId();
        const w = layer.clientWidth || 360;
        const size = w < 480 ? (cap > 4 ? 54 : 78) : Math.round(Math.max(cap > 4 ? 64 : 84, Math.min(cap > 4 ? 108 : 148, w * (cap > 4 ? 0.08 : 0.115))));
        const seen = new Set();
        act.forEach((p, idx) => {
            seen.add(p.user_id);
            let node = L.nodes.get(p.user_id);
            if (!node) {
                node = document.createElement('div');
                node.className = 'ol-p';
                node.dataset.uid = p.user_id;
                node.innerHTML = `<div class="ol-p-bubble" hidden></div><div class="ol-p-fig"></div><span class="ol-p-ready" aria-hidden="true">${icon('check')}</span>
                    <div class="ol-p-plate"><span class="ol-p-crown" hidden>${icon('crown')}</span><span class="ol-p-name"></span><span class="ol-p-badge"></span></div><span class="ol-p-state"></span>`;
                node.classList.add('is-new');
                setTimeout(() => node.classList.remove('is-new'), 600);
                layer.appendChild(node);
                L.nodes.set(p.user_id, node);
            }
            const pos = posFor(p, idx, cap);
            const prevX = parseFloat(node.dataset.x), prevY = parseFloat(node.dataset.y);
            if (prevX !== pos.x || prevY !== pos.y) {
                if (isFinite(prevX) && !NS.util.reducedMotion()) {
                    node.classList.remove('is-hopping'); void node.offsetWidth; node.classList.add('is-hopping');
                    node.classList.toggle('is-facing-left', pos.x < prevX);
                    clearTimeout(node._hopT); node._hopT = setTimeout(() => node.classList.remove('is-hopping'), 520);
                }
                node.dataset.x = pos.x; node.dataset.y = pos.y;
                node.style.setProperty('--x', (pos.x * 100).toFixed(2) + '%');
                node.style.setProperty('--y', (pos.y * 100).toFixed(2) + '%');
                node.style.setProperty('--depth', (0.82 + (pos.y - FLOOR_TOP) * 0.45).toFixed(3));
                node.style.zIndex = String(10 + Math.round(pos.y * 100));
            }
            const ready = p.is_host || p.is_ready;
            const emote = L.emotes[p.user_id] || '';
            const key = JSON.stringify([p.avatar, !!ready, emote, size]);
            const fig = node.querySelector('.ol-p-fig');
            if (fig.dataset.key !== key) { fig.innerHTML = figureHtml(p, ready, emote, size); fig.dataset.key = key; }
            const disc = NS.rooms.isDisconnected(p.user_id);
            node.classList.toggle('is-me', p.user_id === myId);
            node.classList.toggle('is-ready', !!p.is_ready && !p.is_host && !s.room.is_quick);
            node.classList.toggle('is-host', !!p.is_host);
            node.classList.toggle('is-away', disc);
            node.querySelector('.ol-p-crown').hidden = !p.is_host || !!s.room.is_quick;
            const fullName = p.username || p.display_name || 'Oyuncu';
            // Sahnede ad 10 karakterde kesilir (H16); tam ad aşağıdaki "Oyuncular" listesinde ve aria-label'da
            node.querySelector('.ol-p-name').textContent = fullName.length > 10 ? fullName.slice(0, 10) + '…' : fullName;
            const b = node.querySelector('.ol-p-badge');
            if (b.dataset.rp !== String(p.ranked_points)) { b.innerHTML = NS.leagueBadge(p.ranked_points, 16); b.dataset.rp = String(p.ranked_points); b.title = NS.leagueName(p.ranked_points); }
            const stEl = node.querySelector('.ol-p-state');
            const quick = !!s.room.is_quick;
            stEl.innerHTML = disc ? `${icon('wifi-off')}Bağlantı koptu` : quick ? (p.user_id === myId ? 'Sen' : `${icon('check')}Geldi`) : p.is_host ? 'Oda sahibi' : p.is_ready ? `${icon('check')}Hazır` : 'Bekliyor';
            node.setAttribute('aria-label', `${p.username}${p.user_id === myId ? ' (sen)' : ''}: ${disc ? 'bağlantı koptu' : p.is_host ? 'oda sahibi' : p.is_ready ? 'hazır' : 'bekliyor'}`);
            node.setAttribute('role', 'img');
        });
        L.nodes.forEach((node, uid) => { if (!seen.has(uid)) { node.remove(); L.nodes.delete(uid); } });
        // boş yerler
        $all('.ol-slot', layer).forEach(e => e.remove());
        const sl = slots(cap, w < 480);
        for (let i = act.length; i < cap; i++) {
            const e = document.createElement('div');
            e.className = 'ol-slot';
            e.style.setProperty('--x', (sl[i].x * 100).toFixed(2) + '%');
            e.style.setProperty('--y', (sl[i].y * 100).toFixed(2) + '%');
            e.style.setProperty('--depth', (0.82 + (sl[i].y - FLOOR_TOP) * 0.45).toFixed(3));
            const ch = NS.app.challenge;
            const chWait = ch && i === act.length && ['pending', 'accepted', 'sending'].includes(ch.status);
            e.classList.toggle('is-invited', !!chWait);
            e.innerHTML = chWait
                ? `<span class="ol-slot-ring is-invited">${NS.avatar(ch.user.avatar, { size: 40, framed: true })}</span><span class="ol-slot-text">${esc(ch.user.username)} bekleniyor</span>`
                : `<span class="ol-slot-ring">${icon('user')}</span><span class="ol-slot-text">Oyuncu bekleniyor</span>`;
            layer.appendChild(e);
        }
        layer.dataset.count = String(cap);
        const stg = layer.parentNode; if (stg) stg.dataset.count = String(cap);
    }
    function $all(sel, root) { return Array.from(root.querySelectorAll(sel)); }

    function updateCta() {
        const s = NS.rooms.state;
        const line = L.root && $('#olGateLine', L.root);
        const btns = L.root && $('#olLobbyBtns', L.root);
        if (!s || !line || !btns) return;
        const me = NS.rooms.me();
        const act = NS.rooms.active();
        const search = $('#olSearch', L.root);
        if (s.room.is_quick) {
            // Hızlı oda: hazır/başlat yok; sunucu oda dolunca başlatır. Yalnızca arama durumu + Vazgeç.
            search.hidden = false;
            const left = s.room.capacity - act.length;
            const title = left <= 0 ? 'Rakip bulundu. Maç başlıyor…' : s.room.capacity === 2 ? 'Rakip aranıyor…' : `${act.length}/${s.room.capacity} oyuncu · ${left} kişi aranıyor…`;
            const tEl = $('#olSearchTitle', L.root); if (tEl.textContent !== title) tEl.textContent = title;
            line.innerHTML = ''; line.hidden = true;
            if (btns.dataset.sig !== 'quick') {
                btns.dataset.sig = 'quick';
                btns.innerHTML = `<button class="btn btn-secondary btn-lg ol-cancel-btn" type="button" data-ol-l="leave">${icon('x')}<span>Vazgeç</span></button>`;
            }
            startSearchClock();
            return;
        }
        search.hidden = true; line.hidden = false;
        const gate = NS.rooms.startGate();
        const readyCount = act.filter(p => p.is_host || p.is_ready).length;
        line.innerHTML = `<span class="ol-gate-count">${act.length}/${s.room.capacity}</span> <span>${esc(gate.reason)}</span>${readyCount ? ` <span class="ol-gate-dim">· ${readyCount} hazır</span>` : ''}`;
        line.classList.toggle('is-ok', gate.can);
        const sig = JSON.stringify([!!(me && me.is_host), !!(me && me.is_ready), gate.can, L.busy]);
        if (btns.dataset.sig === sig) return;
        btns.dataset.sig = sig;
        if (me && me.is_host) {
            btns.innerHTML = `<button class="btn btn-primary btn-lg ol-start-btn" type="button" data-ol-l="start" ${gate.can && !L.busy ? '' : 'disabled'} aria-describedby="olGateLine">${icon('play')}<span>Maçı başlat</span></button>`;
        } else {
            const r = !!(me && me.is_ready);
            btns.innerHTML = `<button class="btn btn-lg ${r ? 'btn-secondary ol-ready-on' : 'btn-primary'} ol-ready-btn" type="button" data-ol-l="ready" aria-pressed="${r}" ${L.busy ? 'disabled' : ''}>${icon(r ? 'check' : 'hand')}<span>${r ? 'Hazırsın' : 'Hazırım'}</span></button>`;
        }
    }

    /** Arama süresi: odaya katıldığım andan (sunucu saati) beri. */
    function startSearchClock() {
        if (L.searchTimer) return;
        const tick = () => {
            const el = L.root && $('#olSearchTime', L.root);
            const m = NS.rooms.me();
            if (!el || !m) return;
            const sec = Math.max(0, Math.floor((NS.clock.now() - Date.parse(m.joined_at)) / 1000));
            el.textContent = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
        };
        tick();
        L.searchTimer = setInterval(tick, 1000);
        L.offs.push(() => { clearInterval(L.searchTimer); L.searchTimer = null; });
    }

    function announceDiff() {
        const s = NS.rooms.state;
        const act = NS.rooms.active();
        const ids = new Set(act.map(p => p.user_id));
        const host = act.find(p => p.is_host);
        const myId = NS.api.myId();
        if (L.lastPlayers) {
            act.forEach(p => { if (!L.lastPlayers.has(p.user_id) && p.user_id !== myId) { NS.announce(`${p.username} katıldı`); NS.toast(`${p.username} odaya katıldı`); } });
            L.lastPlayers.forEach((name, id) => { if (!ids.has(id) && id !== myId) { NS.announce(`${name} ayrıldı`); NS.toast(`${name} odadan ayrıldı`); } });
        }
        if (L.lastHost && host && L.lastHost !== host.user_id) {
            const msg = host.user_id === myId ? 'Oda sahibi artık sensin.' : `Oda sahibi artık ${host.username}.`;
            NS.announce(msg); NS.toast(msg);
        }
        L.lastPlayers = new Map(act.map(p => [p.user_id, p.username]));
        L.lastHost = host ? host.user_id : null;
        void s;
    }

    // ------------------------------------------------------------ etkileşim
    function onStagePointer(e) {
        if (e.button && e.button !== 0) return;
        const stage = e.currentTarget;
        if (e.target.closest('.ol-p:not(.is-me)')) return;
        const r = stage.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        let y = (e.clientY - r.top) / r.height;
        if (y < FLOOR_TOP - 0.08) return;           // duvara tıklama yok sayılır
        y = Math.max(FLOOR_TOP, Math.min(FLOOR_BOTTOM, y));
        NS.rooms.move(x, y);
        const hint = $('#olStageHint', L.root); if (hint) hint.classList.add('is-gone');
        updatePlayers();
    }
    function onStageKey(e) {
        const d = { ArrowLeft: [-0.06, 0], ArrowRight: [0.06, 0], ArrowUp: [0, -0.06], ArrowDown: [0, 0.06] }[e.key];
        if (!d) return;
        e.preventDefault();
        const myId = NS.api.myId();
        const node = L.nodes.get(myId);
        const x = node ? parseFloat(node.dataset.x) : 0.5, y = node ? parseFloat(node.dataset.y) : 0.7;
        NS.rooms.move(Math.max(0.04, Math.min(0.96, x + d[0])), Math.max(FLOOR_TOP, Math.min(FLOOR_BOTTOM, y + d[1])));
        updatePlayers();
    }

    function showEmote(uid, emote) {
        if (!T.emotes[emote]) return;
        L.emotes[uid] = emote;
        clearTimeout(L.emotes['_t' + uid]);
        L.emotes['_t' + uid] = setTimeout(() => { delete L.emotes[uid]; updatePlayers(); }, 2600);
        showBubble(uid, `${icon(T.emoteIcon[emote])}`, 'is-emote', 2600);
        updatePlayers();
        const p = NS.rooms.player(uid);
        if (p && uid !== NS.api.myId()) NS.announce(`${p.username}: ${T.emotes[emote]}`);
    }
    function showBubble(uid, html, cls, ms) {
        const node = L.nodes.get(uid);
        if (!node) return;
        const b = node.querySelector('.ol-p-bubble');
        b.className = 'ol-p-bubble ' + (cls || '');
        b.innerHTML = html;
        b.hidden = false;
        clearTimeout(b._t);
        b._t = setTimeout(() => { b.hidden = true; }, ms || 3000);
    }
    function showSay(uid, key) {
        const txt = T.quick[key];
        if (!txt) return;
        showBubble(uid, esc(txt), 'is-say', 3200);
        const p = NS.rooms.player(uid);
        if (p && uid !== NS.api.myId()) NS.announce(`${p.username}: ${txt}`);
    }
    function onBroadcast(ev, p) {
        if (!L.root || !L.root.querySelector('.ol-lobby')) return;
        if (ev === 'move') updatePlayers();
        else if (ev === 'emote') showEmote(p.user_id, p.emote);
        else if (ev === 'say') showSay(p.user_id, p.key);
    }

    function toggleQuick(force) {
        const menu = L.root && $('#olQuickMenu', L.root);
        const btn = L.root && L.root.querySelector('[data-ol-l="quick"]');
        if (!menu || !btn) return;
        const open = force != null ? force : menu.hidden;
        menu.hidden = !open;
        btn.setAttribute('aria-expanded', String(open));
        if (open) { const f = menu.querySelector('button'); if (f) f.focus(); }
    }
    function closeQuickOutside(e) {
        if (!L.root) return;
        const wrap = L.root.querySelector('.ol-quick-wrap');
        if (wrap && !wrap.contains(e.target)) toggleQuick(false);
    }

    async function onClick(e) {
        const em = e.target.closest('[data-ol-emote]');
        if (em) {
            if (!L.emoteLimit()) { NS.toast('Biraz yavaş: tepkiler kısa bir süre bekletiliyor.'); return; }
            const emote = em.dataset.olEmote;
            NS.rooms.send('emote', { emote });
            showEmote(NS.api.myId(), emote);
            return;
        }
        const say = e.target.closest('[data-ol-say]');
        if (say) {
            toggleQuick(false);
            if (!L.sayLimit()) { NS.toast('Biraz yavaş: mesajlar kısa bir süre bekletiliyor.'); return; }
            NS.rooms.send('say', { key: say.dataset.olSay });
            showSay(NS.api.myId(), say.dataset.olSay);
            return;
        }
        const b = e.target.closest('[data-ol-l]');
        if (!b) return;
        const act = b.dataset.olL;
        const s = NS.rooms.state;
        if (!s) return;
        if (act === 'quick') { toggleQuick(); return; }
        if (act === 'leave') { NS.app.leaveRoom(); return; }
        if (act === 'copy-code') { const ok = await NS.util.copyText(s.room.code); NS.toast(ok ? `Oda kodu kopyalandı: ${s.room.code}` : s.room.code); return; }
        if (act === 'copy-link') { const ok = await NS.util.copyText(NS.app.inviteLink(s.room.code)); NS.toast(ok ? 'Davet bağlantısı kopyalandı.' : NS.app.inviteLink(s.room.code)); return; }
        if (act === 'invite') { NS.friends.openInvitePicker(s.room); return; }
        if (act === 'reinvite') { NS.app.reinviteChallenge(b); return; }
        if (act === 'settings') { openSettings(); return; }
        if (act === 'noro') {
            // Avatar stüdyosu lobinin üstünde alt sayfa olarak; kayıt → rooms.js odaya duyurur
            const gm = NS.game();
            if (gm && typeof gm.openAvatarStudio === 'function') gm.openAvatarStudio({ sheet: true, returnFocus: b });
            return;
        }
        if (act === 'ready') {
            const me = NS.rooms.me();
            L.busy = true; updateCta();
            const r = await NS.rooms.setReady(!(me && me.is_ready));
            L.busy = false; updateCta();
            if (!r.ok) NS.toast(r.error.message);
            else if (r.data.is_ready) { NS.rooms.send('say', { key: 'ready' }); showSay(NS.api.myId(), 'ready'); }
            return;
        }
        if (act === 'start') {
            L.busy = true; updateCta();
            const r = await NS.rooms.start();
            L.busy = false; updateCta();
            if (!r.ok) {
                const map = { ROOM_NOT_FULL: 'Oda henüz dolmadı.', NOT_ALL_READY: 'Herkes hazır değil.', NOT_HOST: 'Artık oda sahibi sen değilsin.' };
                NS.toast(map[r.error.code] || r.error.message);
                NS.rooms.refresh();
            }
        }
    }

    function openSettings() {
        const s = NS.rooms.state;
        if (!s || !NS.rooms.isHost()) return;
        const room = s.room;
        let cur = { mode: room.mode, format: room.format, target: room.target_type, capacity: room.capacity, rounds: room.round_count, visibility: room.visibility, seeding: room.bracket_seeding };
        const minCap = NS.rooms.active().length;
        const unsupported = !NS.api.isSupported('update_room_settings');
        const sh = NS.ui.sheet({
            title: 'Oda ayarları',
            body: `${unsupported ? `<div class="notice">${icon('info')}<span>Lobide ayar değiştirme yakında. Şimdilik yeni bir oda kurabilirsin.</span></div>` : ''}
                <form class="ol-form" data-ol-set novalidate>${NS.ui.settingsForm(cur, { locked: true, minCapacity: Math.max(2, minCap) })}</form>
                <p class="ol-field-note">Ayar değişince diğer oyuncuların "hazır" durumu sıfırlanır.</p>
                <p class="ol-form-error" data-ol-err role="alert"></p>`,
            actions: unsupported ? [{ id: 'close', label: 'Kapat' }] : [{ id: 'cancel', label: 'Vazgeç' }, { id: 'save', label: 'Kaydet', kind: 'primary' }],
            async onAction(id, shx) {
                if (id !== 'save') { shx.close(); return; }
                cur = NS.ui.readForm(shx.body, cur);
                shx.setBusy('save', true);
                const r = await NS.api.updateRoomSettings(room.id, cur);
                shx.setBusy('save', false);
                if (r.ok) { shx.close(true); NS.rooms.refresh(); if (r.data.changed) NS.toast('Oda ayarları güncellendi.'); return; }
                const el = shx.body.querySelector('[data-ol-err]');
                if (r.error.code === 'UNSUPPORTED') el.textContent = 'Lobide ayar değiştirme yakında. Şimdilik yeni bir oda kurabilirsin.';
                else el.textContent = r.error.message;
            }
        });
        if (unsupported) sh.body.querySelectorAll('input').forEach(i => { i.disabled = true; });
        sh.body.addEventListener('change', () => { NS.ui.syncChecked(sh.body); });
    }

    function cleanupNodes() {
        L.offs.forEach(f => { try { f(); } catch (e) { /* yok */ } });
        L.offs = [];
        L.nodes.clear();
        Object.keys(L.emotes).forEach(k => { if (k.startsWith('_t')) clearTimeout(L.emotes[k]); });
        L.emotes = {};
    }
    function destroy() {
        cleanupNodes();
        L.lastPlayers = null; L.lastHost = null;
        if (L.root) L.root.innerHTML = '';
        L.root = null;
    }

    NS.lobby = { render, update, destroy, slots, showEmote, showSay };
})(typeof window !== 'undefined' ? window : globalThis);
