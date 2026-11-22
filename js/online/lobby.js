/**
 * PsikoVaka Online — lobi sahnesi.
 * Oyuncuların Nöro'ları özgün bir terapi odasında (js/online/lobby_room.js) durur; boş yere dokununca kendi Nöro'n
 * engellerin etrafından dolaşarak oraya YÜRÜR (yalnızca hedef yayınlanır, her istemci yürüyüşü kendisi canlandırır;
 * geç gelenler presence'ten anında yerleşir). Eşyalara dokununca oraya yürüyüp bir etkinlik başlatır
 * (kitaplık/kanepe → okuma, sehpa → çay, koltuk → kestirme, şömine → gerinme, pencere → düşünme); hareket ya da duygu bitirir.
 * Eski istemcilerin "move" (zıplama) iletileri aynen işlenir: Nöro o noktaya yürür.
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
        offs: [], lastPlayers: null, lastHost: null, busy: false,
        room: null, walker: null, W: 0, H: 0, lastActs: {},
        idleTimer: 0, idleDoze: false
    };
    const A = () => global.PsikoVakaAvatar;

    function touchIdle() {
        const wasDozing = L.idleDoze;
        L.idleDoze = false;
        clearTimeout(L.idleTimer);
        if (wasDozing) {
            const myId = NS.api.myId();
            if (myId) refreshFigure(myId);
        }
        L.idleTimer = setTimeout(() => {
            if (!L.root || !L.walker || document.hidden) return;
            const myId = NS.api.myId();
            const st = myId && L.walker.get(myId);
            if (!st || st.walking || L.emotes[myId] || (st.opts && st.opts.act)) return;
            L.idleDoze = true;
            refreshFigure(myId);
        }, 35000);
    }

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

    /** Odaya göre varsayılan yerler: eşyaların önündeki açık alanda (yürünebilir en yakın noktaya oturtulur). */
    function roomSlots(n, nar) {
        const row = (cnt, y, x0, x1) => Array.from({ length: cnt }, (_, i) => ({ x: cnt === 1 ? (x0 + x1) / 2 : x0 + (x1 - x0) * i / (cnt - 1), y }));
        let out;
        if (nar) {
            // dar ekranda 3+ kişi birden çok sıra (ad etiketleri okunabilsin): 3-4 → 2+2, 5+ → 3-3-2
            if (n <= 2) out = row(n, 0.8, 0.3, 0.7);
            else if (n <= 4) out = [...row(Math.ceil(n / 2), 0.665, 0.22, 0.78), ...row(Math.floor(n / 2), 0.885, 0.36, 0.64)];   // D1: sıralar arası açıldı (durum çipi alttaki başa binmesin)
            else {
                // 5+ (ajan D1): iki seyrek sıra, arada bir Nöro + plaka boyu boşluk (3-3-2 sıralarda plakalar alttaki başlara
                // biniyordu); ön sıra yarım adım kaydırılır ve sağdaki ön plan saksısından uzak durur
                const a = Math.ceil(n / 2), b = n - a;
                const step = 0.76 / Math.max(1, a - 1);
                out = [...row(a, 0.665, 0.12, 0.88), ...(b < a ? Array.from({ length: b }, (_, i) => ({ x: 0.12 + step * (i + 0.5), y: 0.875 })) : row(b, 0.875, 0.13, 0.78))];
            }
        } else if (n <= 4) out = row(n, 0.8, n <= 2 ? 0.4 : 0.28, n <= 2 ? 0.6 : 0.72);
        else {
            // 5+ kişi iki sıra: arka sıra koltuk ile kanepe arasındaki açıklıkta, ön sıra halının önünde
            const c1 = (n <= 5 || (L.W && L.W < 900)) ? 2 : 3, c2 = n - c1;
            out = [...row(c1, 0.6, c1 === 2 ? 0.4 : 0.35, c1 === 2 ? 0.54 : 0.59), ...row(c2, 0.855, c2 > 5 && !(L.W && L.W < 900) ? 0.12 : 0.17, c2 > 5 ? 0.88 : 0.84)];   // D1: sıralar biraz açıldı (durum çipi öndeki başa binmesin)
        }
        const r = L.room;
        return out.map(p => r ? r.nearestFree(p.x, p.y) : p);
    }
    function narrow() { const l = L.root && L.root.querySelector('#olStageLayer'); return !!(l && l.clientWidth && l.clientWidth < 560); }
    function slotList(cap) { return L.room ? roomSlots(cap, narrow()) : slots(cap, narrow()); }
    function posFor(p, idx, cap) {
        const pr = NS.rooms.presence[p.user_id];
        if (pr && isFinite(pr.x) && isFinite(pr.y)) return { x: pr.x, y: Math.max(FLOOR_TOP, Math.min(FLOOR_BOTTOM, pr.y)) };
        const s = slotList(cap)[idx] || { x: 0.5, y: 0.8 };
        return s;
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
            <div class="ol-stage" id="olStage" tabindex="0" role="group" aria-roledescription="lobi sahnesi" aria-label="Lobi: terapi odası. Boş bir yere dokunarak ya da ok tuşlarıyla Nöro'nu yürüt; odadaki eşya düğmeleriyle bir etkinlik başlat.">
                <div class="ol-stage-layer" id="olStageLayer"></div>
                <div class="ol-bubble-layer" id="olBubbleLayer" aria-hidden="true"></div>
                <div class="ol-stage-hint" id="olStageHint"><span class="ol-lg-only">Boş bir yere dokun, Nöro'n oraya yürüsün. Eşyalara dokunursan bir şey yapar.</span><span class="ol-sm-only">Yere dokun: Nöro'n yürüsün. Eşyaya dokun: bir şey yapsın.</span></div>
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
        setupRoom(stage);
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
            ${quick ? '' : `<span class="ol-chip-static">${icon(room.visibility === 'public' ? 'globe' : 'lock')}${esc(T.visibility[room.visibility])}</span>`}
            ${quick ? '' : zorlukChips(room)}`;
        const setBtn = $('#olLobbySettingsBtn', L.root);
        if (setBtn) setBtn.hidden = quick || !NS.rooms.isHost();
        updatePlayers();
        updateRoster();
        updateCta();
        updateChallenge();
        announceDiff();
    }

    /** Zorluk çipleri (0007): Tek hak / Kategori gizli + Elo çarpanı. Ayar kapalıysa boş. */
    function zorlukChips(room) {
        const Zm = global.PsikoVakaZorluk;
        if (!Zm || !(room.tek_hak || room.kategori_gizli)) return '';
        const z = Zm.norm(room);
        const m = Zm.multiplier(z, NS.leaguesView ? NS.leaguesView.cfg() : null);
        return Zm.ITEMS.filter(i => z[i.key]).map(i => `<span class="ol-chip-static ol-chip-zor" data-ol-zor="${i.key}">${icon(i.icon)}${esc(i.short)}</span>`).join('')
            + `<span class="ol-chip-static ol-chip-zor is-mult" title="Zorluk bonusu: kazandığın Elo ${esc(Zm.fmtMult(m))}">${icon('zap')}Elo ${esc(Zm.fmtMult(m))}</span>`;
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

    function figureHtml(p, ready, emote, size, activity) {
        let cfg = p.avatar || {};
        if (ready && !emote && !activity && A()) {
            cfg = Object.assign({}, A().normalize(cfg), { eyes: 'happy', mouth: 'open' });
        }
        return NS.avatar(cfg, { size, framed: false, animated: true, emote: emote || undefined, activity: activity || undefined, title: p.username || '' });
    }

    // ------------------------------------------------------------ oda + yürüme
    function setupRoom(stage) {
        const layer = $('#olStageLayer', stage);
        if (!NS.lobbyRoom) return;
        L.walker = NS.lobbyRoom.createWalker({
            reduced: () => NS.util.reducedMotion(),
            onFrame: (uid, st, teleport) => positionNode(uid, st, teleport),
            onArrive: (uid, st) => arrived(uid, st)
        });
        L.room = NS.lobbyRoom.create(stage, {
            itemLayer: layer,
            interactive: !(NS.rooms.state && NS.rooms.state.room.is_quick),
            onLayout: () => {
                if (!L.room) return;          // ilk yerleşim create() içinde; aşağıda ayrıca çizilir
                L.W = layer.clientWidth || stage.clientWidth; L.H = layer.clientHeight || stage.clientHeight;
                // yerleşim değişti (ör. döndürme): herkes yeni yerleşimdeki karşılığına anında geçer
                L.nodes.forEach(n => { n._sig = ''; });
                if (L.walker) L.walker.states.clear();
                updatePlayers();
            }
        });
        L.W = layer.clientWidth || stage.clientWidth; L.H = layer.clientHeight || stage.clientHeight;
        const vis = () => stage.classList.toggle('nv-paused', document.hidden);
        document.addEventListener('visibilitychange', vis);
        L.offs.push(() => document.removeEventListener('visibilitychange', vis));
        touchIdle();
    }

    function positionNode(uid, st, teleport) {
        const node = L.nodes.get(uid);
        if (!node) return;
        const W = L.W || 1, H = L.H || 1;
        const depth = (0.82 + (st.y - FLOOR_TOP) * 0.45);
        node.style.transform = `translate3d(${(st.x * W).toFixed(1)}px, ${(st.y * H).toFixed(1)}px, 0) translate(-50%, -88%) scale(${depth.toFixed(3)})`;
        const z = String(st.seated && st.opts && st.opts.zBase ? 11 + Math.round(st.opts.zBase * 100) : 10 + Math.round(st.y * 100));
        if (node.style.zIndex !== z) node.style.zIndex = z;
        const fig = node.querySelector('.ol-p-fig');
        const pose = node._pose || {};
        if (pose.walking !== st.walking || pose.facing !== st.facing) {
            const flipped = (pose.facing === 'left' && st.facing === 'right') || (pose.facing === 'right' && st.facing === 'left');
            node._pose = { walking: st.walking, facing: st.facing };
            if (A()) A().setPose(fig, { walking: st.walking, facing: st.facing });
            node.classList.toggle('is-walking', !!st.walking);
            if (flipped && !teleport && !NS.util.reducedMotion()) {
                node.classList.remove('is-turning');
                void node.offsetWidth;
                node.classList.add('is-turning');
                clearTimeout(node._turnHopT);
                node._turnHopT = setTimeout(() => node.classList.remove('is-turning'), 180);
            }
        }
        if (teleport) { node.classList.remove('is-teleport'); void node.offsetWidth; node.classList.add('is-teleport'); }
        if (st.walking && !NS.util.reducedMotion()) {
            const nowMs = performance.now();
            if (!node._dustAt || nowMs - node._dustAt > 240) {
                node._dustAt = nowMs;
                spawnWalkDust(st.x, st.y);
            }
        }
        node._st = st;
        if (node._bubble && !node._bubble.hidden) placeBubble(node);
    }
    function spawnWalkDust(nx, ny) {
        const layer = L.root && $('#olStageLayer', L.root);
        if (!layer) return;
        const d = document.createElement('span');
        d.className = 'ol-walk-dust';
        d.style.left = (nx * 100).toFixed(2) + '%';
        d.style.top = (ny * 100).toFixed(2) + '%';
        d.style.zIndex = String(8 + Math.round(ny * 100));
        layer.appendChild(d);
        setTimeout(() => d.remove(), 520);
    }
    function spawnSparkBurst(nx, ny, glyph) {
        const layer = L.root && $('#olBubbleLayer', L.root);
        if (!layer) return;
        const sp = document.createElement('span');
        sp.className = 'ol-spark-burst';
        sp.textContent = glyph || '✨';
        sp.style.left = (nx * 100).toFixed(2) + '%';
        sp.style.top = (ny * 100).toFixed(2) + '%';
        layer.appendChild(sp);
        setTimeout(() => sp.remove(), 850);
    }
    /**
     * Konuşma/duygu balonu: Nöro düğümünün dışında, tüm eşyaların ve Nöro'ların üstündeki ayrı katmanda (#olBubbleLayer).
     * Konumu (CSS `translate`) Nöro'nun dünya koordinatından hesaplanır (yürürken her karede izler) ve sahnenin içinde kalacak şekilde
     * kırpılır; kuyruk (--tail) Nöro'yu göstermeye devam eder.
     */
    function placeBubble(node) {
        const b = node._bubble, st = node._st;
        if (!b || !st) return;
        const W = L.W || 1, H = L.H || 1;
        const depth = (0.82 + (st.y - FLOOR_TOP) * 0.45);
        if (!node._h) node._h = node.offsetHeight || 0;
        if (!b._w) { b._w = b.offsetWidth || 0; b._hh = b.offsetHeight || 0; }
        const ax = st.x * W, ay = st.y * H;
        // eski yerleşimle aynı: balonun altı düğümün üst kenarının 6 px altında (ölçekli)
        let bottom = ay - node._h * 0.88 * depth + 6 * depth;
        const m = 6, half = b._w / 2;
        let x = ax;
        if (half * 2 + 2 * m < W) x = Math.max(half + m, Math.min(W - half - m, ax));
        if (bottom - b._hh < m) bottom = b._hh + m;
        const tail = Math.max(-(half - 14), Math.min(half - 14, ax - x));
        b.style.translate = `${x.toFixed(1)}px ${bottom.toFixed(1)}px`;   // konum `translate`ta; `transform` açılış animasyonuna kalır
        b.style.setProperty('--tail', tail.toFixed(1) + 'px');
    }
    function arrived(uid, st) {
        st.arrived = true;
        st.seated = !!(st.opts && st.opts.seat);
        clearTimeout(st._turnT);
        // kısa bir an sonra rahat ön (ya da nesneye uygun) poza döner
        st._turnT = setTimeout(() => { st.facing = (st.opts && st.opts.facing) || 'front'; positionNode(uid, st); refreshFigure(uid); }, NS.util.reducedMotion() ? 0 : 160);
        positionNode(uid, st);
        // Anlamlı nesne varış tepkileri (ışık/kıvılcım/balon)
        const spotBase = st.opts && st.opts.spot ? String(st.opts.spot).split('.')[0] : '';
        if (spotBase === 'fire' && L.room && L.room.stokeFire) L.room.stokeFire();
        if (uid === NS.api.myId() && spotBase) {
            if (spotBase === 'fire') {
                showBubble(uid, esc('🔥 Şömine çok iyi geldi!'), 'is-say', 2800);
                spawnSparkBurst(st.x, st.y - 0.08, '🔥');
            } else if (spotBase === 'table') {
                showBubble(uid, esc('☕ Taze demlenmiş çay gibisi yok!'), 'is-say', 2800);
                spawnSparkBurst(st.x, st.y - 0.08, '✨');
            } else if (spotBase === 'shelf') {
                showBubble(uid, esc('📖 Kriterlere bir göz atayım...'), 'is-say', 2800);
                spawnSparkBurst(st.x, st.y - 0.09, '💡');
            } else if (spotBase === 'window') {
                showBubble(uid, esc('🪟 Dışarıda hava ne güzel...'), 'is-say', 2600);
            } else if (spotBase === 'couch' || spotBase === 'chair') {
                showBubble(uid, esc('🛋️ Oh, burası çok rahatmış!'), 'is-say', 2400);
            }
        }
    }
    /** Seçilen oturma yerleri: aynı yeri iki kişi isterse kimliği küçük olan oturur (her istemcide aynı sonuç). */
    function seatHolders(act) {
        const m = {};
        act.slice().sort((a, b) => (a.user_id < b.user_id ? -1 : 1)).forEach(p => {
            const pr = NS.rooms.presence[p.user_id];
            if (pr && pr.spot && pr.spot.includes('.') && !m[pr.spot]) m[pr.spot] = p.user_id;
        });
        return m;
    }
    /** Oyuncunun olması gereken yer: { x, y (çizim), lx, ly (yayındaki), act, spot, seat, approach, facing } */
    function desired(p, idx, cap, holders) {
        const pr = NS.rooms.presence[p.user_id];
        const base = posFor(p, idx, cap);
        const out = { lx: base.x, ly: base.y, act: null, spot: null, seat: false, approach: null, facing: 'front', via: pr ? (pr.via || 'sync') : 'slot' };
        const r = L.room;
        if (pr && pr.spot && r) {
            const sp = r.spotPos(pr.spot);
            if (sp) {
                out.act = pr.act || sp.object.act;
                out.facing = sp.object.facing || 'front';
                out.spot = pr.spot;
                if (sp.seat && holders[pr.spot] === p.user_id) { out.x = sp.x; out.y = sp.y; out.seat = true; out.approach = sp.approach; out.zBase = sp.zBase; return out; }
                const ap = sp.object.approach; out.x = ap.x; out.y = ap.y; return out;
            }
        }
        if (pr && pr.act && !pr.spot) out.act = pr.act;   // nesnesiz etkinlik (ileride)
        const q = r ? r.nearestFree(base.x, base.y) : base;
        out.x = q.x; out.y = q.y;
        return out;
    }
    function refreshFigure(uid) {
        const node = L.nodes.get(uid), s = NS.rooms.state;
        if (!node || !s) return;
        const p = NS.rooms.player(uid);
        if (!p) return;
        const st = L.walker && L.walker.get(uid);
        const ready = p.is_host || p.is_ready;
        const emote = L.emotes[uid] || '';
        const baseAct = (st && st.arrived && !st.walking && !emote && st.opts) ? (st.opts.act || '') : '';
        const activity = baseAct || (uid === NS.api.myId() && L.idleDoze && !emote && (!st || !st.walking) ? 'doze' : '');
        const size = node._size || 80;
        const key = JSON.stringify([p.avatar, !!ready, emote, size, activity]);
        const fig = node.querySelector('.ol-p-fig');
        if (fig.dataset.key !== key) {
            fig.innerHTML = figureHtml(p, ready, emote, size, activity);
            fig.dataset.key = key;
            node._pose = null;
            if (st) positionNode(uid, st);
            node.classList.toggle('is-active', !!activity);
            node.dataset.act = activity;
            if (activity && uid !== NS.api.myId() && L.lastActs[uid] !== activity && A()) NS.announce(`${p.username}: ${A().ACTIVITY_LABELS[activity] || ''}`);
            L.lastActs[uid] = activity;
        }
    }

    function updatePlayers() {
        const s = NS.rooms.state;
        const layer = L.root && $('#olStageLayer', L.root);
        if (!s || !layer) return;
        const act = NS.rooms.active();
        const cap = s.room.capacity;
        const myId = NS.api.myId();
        const w = layer.clientWidth || 360;
        if (!L.W) { L.W = w; L.H = layer.clientHeight || 400; }
        // Nöro boyu: lobi ~80-120 px (masaüstü), telefonda 52-66 px; eşyalarla orantılı kalsın diye üst sınırlı
        const size = w < 560 ? (cap > 4 ? 52 : 66) : Math.round(Math.max(cap > 4 ? 64 : 80, Math.min(cap > 4 ? 88 : 120, w * (cap > 4 ? 0.07 : 0.1))));
        const holders = seatHolders(act);
        const seen = new Set();
        act.forEach((p, idx) => {
            seen.add(p.user_id);
            let node = L.nodes.get(p.user_id);
            let fresh = false;
            if (!node) {
                node = document.createElement('div');
                node.className = 'ol-p';
                node.dataset.uid = p.user_id;
                node.innerHTML = `<div class="ol-p-fig"></div><span class="ol-p-ready" aria-hidden="true">${icon('check')}</span>
                    <div class="ol-p-plate"><span class="ol-p-crown" hidden>${icon('crown')}</span><span class="ol-p-name"></span><span class="ol-p-badge"></span></div><span class="ol-p-state"></span>`;
                node.classList.add('is-new');
                setTimeout(() => node.classList.remove('is-new'), 600);
                layer.appendChild(node);
                const bl = $('#olBubbleLayer', L.root);
                if (bl) {
                    const bub = document.createElement('div');
                    bub.className = 'ol-p-bubble';
                    bub.dataset.uid = p.user_id;
                    bub.hidden = true;
                    bl.appendChild(bub);
                    node._bubble = bub;
                }
                L.nodes.set(p.user_id, node);
                fresh = true;
            }
            node._size = size;
            const want = desired(p, idx, cap, holders);
            const sig = [want.x.toFixed(4), want.y.toFixed(4), want.spot || '', want.act || ''].join('|');
            if (node._sig !== sig) {
                node._sig = sig;
                node.dataset.x = want.lx; node.dataset.y = want.ly;
                node.dataset.spot = want.spot || '';
                const prevVia = node._via; node._via = want.via;
                const opts = { act: want.act, spot: want.spot, facing: want.facing, seat: want.seat, zBase: want.zBase };
                const st = L.walker && L.walker.get(p.user_id);
                if (!L.walker) positionNode(p.user_id, { x: want.x, y: want.y, walking: false, facing: 'front' });   // oda modülü yoksa: düz yerleştirme
                // ilk kez presence'ten gelen konum (geç katılma / ilk eşitleme): yürümeden yerleşir
                else if (fresh || !st || (prevVia === 'slot' && want.via === 'sync' && p.user_id !== myId)) { const st2 = L.walker.place(p.user_id, { x: want.x, y: want.y }, opts); st2.arrived = true; st2.seated = want.seat; st2.facing = want.facing; positionNode(p.user_id, st2); }
                else {
                    const path = L.room.route({ x: st.x, y: st.y }, { x: want.x, y: want.y }, want.seat ? want.approach : null);
                    st.arrived = false; st.seated = false;
                    clearTimeout(st._turnT);
                    L.walker.go(p.user_id, path, opts);
                }
            }
            refreshFigure(p.user_id);
            const disc = NS.rooms.isDisconnected(p.user_id);
            const wasReady = node.classList.contains('is-ready');
            const nowReady = !!p.is_ready && !p.is_host && !s.room.is_quick;
            node.classList.toggle('is-me', p.user_id === myId);
            node.classList.toggle('is-ready', nowReady);
            node.classList.toggle('is-host', !!p.is_host);
            node.classList.toggle('is-away', disc);
            node.classList.toggle('is-high-league', Number(p.ranked_points || 0) >= 2900);
            if (nowReady && !wasReady && !fresh) {
                node.classList.remove('is-ready-pop');
                void node.offsetWidth;
                node.classList.add('is-ready-pop');
                setTimeout(() => node.classList.remove('is-ready-pop'), 700);
            }
            node.querySelector('.ol-p-crown').hidden = !p.is_host || !!s.room.is_quick;
            const fullName = p.username || p.display_name || 'Oyuncu';
            // Sahnede ad 10 karakterde kesilir (H16); tam ad aşağıdaki "Oyuncular" listesinde ve aria-label'da
            node.querySelector('.ol-p-name').textContent = fullName.length > 10 ? fullName.slice(0, 10) + '…' : fullName;
            const b = node.querySelector('.ol-p-badge');
            if (b.dataset.rp !== String(p.ranked_points)) { b.innerHTML = NS.leagueBadge(p.ranked_points, 16); b.dataset.rp = String(p.ranked_points); b.title = NS.leagueName(p.ranked_points); }
            const stEl = node.querySelector('.ol-p-state');
            const quick = !!s.room.is_quick;
            const stHtml = disc ? `${icon('wifi-off')}Bağlantı koptu` : quick ? (p.user_id === myId ? 'Sen' : `${icon('check')}Geldi`) : p.is_host ? 'Oda sahibi' : p.is_ready ? `${icon('check')}Hazır` : 'Bekliyor';
            if (stEl._h !== stHtml) { stEl.innerHTML = stHtml; stEl._h = stHtml; }
            node.setAttribute('aria-label', `${p.username}${p.user_id === myId ? ' (sen)' : ''}: ${disc ? 'bağlantı koptu' : p.is_host ? 'oda sahibi' : p.is_ready ? 'hazır' : 'bekliyor'}`);
            node.setAttribute('role', 'img');
        });
        L.nodes.forEach((node, uid) => { if (!seen.has(uid)) { node.remove(); if (node._bubble) { clearTimeout(node._bubble._t); node._bubble.remove(); } L.nodes.delete(uid); if (L.walker) L.walker.remove(uid); } });
        L.nodes.forEach(node => { node._h = 0; });   // plaka/durum değişmiş olabilir: balon yüksekliği bir sonraki yerleştirmede yeniden ölçülür
        // boş yerler
        $all('.ol-slot', layer).forEach(e => e.remove());
        const sl = slotList(cap);
        for (let i = act.length; i < cap; i++) {
            const e = document.createElement('div');
            e.className = 'ol-slot';
            e.style.setProperty('--x', (sl[i].x * 100).toFixed(2) + '%');
            e.style.setProperty('--y', (sl[i].y * 100).toFixed(2) + '%');
            e.style.setProperty('--depth', (0.82 + (sl[i].y - FLOOR_TOP) * 0.45).toFixed(3));
            e.style.zIndex = String(10 + Math.round(sl[i].y * 100));
            const ch = NS.app.challenge;
            const chWait = ch && i === act.length && ['pending', 'accepted', 'sending'].includes(ch.status);
            e.classList.toggle('is-invited', !!chWait);
            e.innerHTML = chWait
                ? `<span class="ol-slot-ring is-invited">${NS.avatar(ch.user.avatar, { size: 40, framed: true })}</span><span class="ol-slot-text">${esc(ch.user.username)} bekleniyor</span>`
                : `<span class="ol-slot-ring">${icon('user')}</span><span class="ol-slot-text">Oyuncu bekleniyor</span>`;
            layer.appendChild(e);
        }
        layer.dataset.count = String(cap);
        layer.classList.toggle('is-mid', w >= 560 && w < 900);   // tablet genişliği: 5+ kişide daha küçük plaka (css/online.css)
        const stg = layer.parentNode; if (stg) stg.dataset.count = String(cap);
        if (L.room) L.room.setInteractive(!s.room.is_quick);
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
        if (e.target.closest('.ol-p:not(.is-me)') || e.target.closest('.olr-obj')) return;
        const r = stage.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        let y = (e.clientY - r.top) / r.height;
        if (y < FLOOR_TOP - 0.08) return;           // duvara tıklama yok sayılır
        y = Math.max(FLOOR_TOP, Math.min(FLOOR_BOTTOM, y));
        const q = L.room ? L.room.nearestFree(x, y) : { x, y };
        touchIdle();
        NS.rooms.move(q.x, q.y);
        hideHint();
        updatePlayers();
    }
    function hideHint() { const hint = L.root && $('#olStageHint', L.root); if (hint) hint.classList.add('is-gone'); }
    function onStageKey(e) {
        if (e.target.closest && e.target.closest('.olr-obj')) return;
        const d = { ArrowLeft: [-0.06, 0], ArrowRight: [0.06, 0], ArrowUp: [0, -0.06], ArrowDown: [0, 0.06] }[e.key];
        if (!d) return;
        e.preventDefault();
        touchIdle();
        const myId = NS.api.myId();
        const node = L.nodes.get(myId);
        const x = node ? parseFloat(node.dataset.x) : 0.5, y = node ? parseFloat(node.dataset.y) : 0.7;
        let nx = Math.max(0.04, Math.min(0.96, x + d[0])), ny = Math.max(FLOOR_TOP, Math.min(FLOOR_BOTTOM, y + d[1]));
        if (L.room) { const q = L.room.nearestFree(nx, ny); nx = q.x; ny = q.y; }
        NS.rooms.move(nx, ny);
        updatePlayers();
    }
    /** Oda nesnesine git + etkinlik: oturma yeri boşsa oraya, doluysa önüne. Yayın: move {x,y = yaklaşma noktası, act, spot}. */
    function goToObject(id) {
        const s = NS.rooms.state;
        if (!L.room || !s || s.room.is_quick) return;
        const ob = L.room.object(id);
        if (!ob) return;
        touchIdle();
        const myId = NS.api.myId();
        let spot = ob.id;
        if (ob.seats) {
            const holders = seatHolders(NS.rooms.active().filter(p => p.user_id !== myId));
            const mine = NS.rooms.presence[myId];
            const k = ob.seats.findIndex((_, i) => !holders[ob.id + '.' + i] || (mine && mine.spot === ob.id + '.' + i));
            if (k >= 0) spot = ob.id + '.' + k;
        }
        delete L.emotes[myId];
        NS.rooms.move(ob.approach.x, ob.approach.y, { act: ob.act, spot });
        hideHint();
        updatePlayers();
        if (A()) NS.announce(`Nöro'n: ${A().ACTIVITY_LABELS[ob.act] || ob.label}`);
    }

    function showEmote(uid, emote) {
        if (!T.emotes[emote]) return;
        L.emotes[uid] = emote;
        if (uid === NS.api.myId()) NS.rooms.clearActivity();     // duygu etkinliği bitirir (diğerlerinde rooms.js temizler)
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
        const b = node._bubble;
        if (!b) return;
        b.className = 'ol-p-bubble ' + (cls || '');
        b.innerHTML = html;
        b.hidden = false;
        b._w = 0; node._h = 0;
        b.classList.remove('is-pop'); void b.offsetWidth; b.classList.add('is-pop');
        if (L.walker && L.walker.get(uid)) node._st = L.walker.get(uid);   // yerleşim değişince durum nesnesi yenilenir
        placeBubble(node);
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
            touchIdle();
            const emote = em.dataset.olEmote;
            NS.rooms.send('emote', { emote });
            showEmote(NS.api.myId(), emote);
            return;
        }
        const obj = e.target.closest('[data-olr-obj]');
        if (obj) {
            const oid = obj.dataset.olrObj;
            if (oid === 'lamp' && L.room && L.room.toggleLamp) {
                const dim = L.room.toggleLamp();
                NS.toast(dim ? '🕯️ Oda ışığı kısıldı (sıcak akşam modu).' : '💡 Oda ışığı açıldı.');
                return;
            }
            if (oid === 'rorschach' && L.room && L.room.cycleRorschach) {
                const msg = L.room.cycleRorschach();
                goToObject('rorschach');
                showBubble(NS.api.myId(), esc(msg), 'is-say', 3400);
                return;
            }
            goToObject(oid);
            return;
        }
        // Başka bir oyuncunun Nöro'suna tıklayınca yanına yürüyüp karşılıklı selam ver / beşlik çak!
        const peerNode = e.target.closest('.ol-p[data-uid]');
        if (peerNode && peerNode.dataset.uid && peerNode.dataset.uid !== NS.api.myId() && L.room && L.walker) {
            const targetUid = peerNode.dataset.uid;
            const targetSt = L.walker.get(targetUid);
            if (targetSt) {
                touchIdle();
                const destX = Math.max(0.06, Math.min(0.94, targetSt.x + (targetSt.x > 0.5 ? -0.07 : 0.07)));
                const destY = Math.max(0.48, Math.min(0.88, targetSt.y + 0.02));
                const freePt = L.room.nearestFree(destX, destY);
                NS.rooms.move(freePt.x, freePt.y, { act: 'wave', spot: null });
                showEmote(NS.api.myId(), 'wave');
                showBubble(NS.api.myId(), esc('👋 Selam! Hazır mısın?'), 'is-say', 2600);
                // Tıklanan arkadaşın Nöro'su da yerel olarak sana dönüp hafifçe zıplar
                targetSt.facing = targetSt.x > freePt.x ? 'left' : 'right';
                positionNode(targetUid, targetSt);
                peerNode.classList.remove('is-ready-pop');
                void peerNode.offsetWidth;
                peerNode.classList.add('is-ready-pop');
                setTimeout(() => peerNode.classList.remove('is-ready-pop'), 700);
                spawnSparkBurst((targetSt.x + freePt.x) / 2, Math.min(targetSt.y, freePt.y) - 0.06, '✨');
                updatePlayers();
                return;
            }
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
        let cur = { mode: room.mode, format: room.format, target: room.target_type, capacity: room.capacity, rounds: room.round_count, visibility: room.visibility, seeding: room.bracket_seeding,
            tekHak: !!room.tek_hak, kategoriGizli: !!room.kategori_gizli };
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
                // 0007 yoksa zorluk alanı gönderilmez (eski sunucuda imza yok)
                if (!(NS.leaguesView && NS.leaguesView.zorlukSupported()) || !shx.body.querySelector('[data-ol-zorluk]')) { delete cur.tekHak; delete cur.kategoriGizli; }
                shx.setBusy('save', true);
                const r = await NS.api.updateRoomSettings(room.id, cur);
                shx.setBusy('save', false);
                if (r.ok) { shx.close(true); NS.rooms.refresh(); if (r.data.changed) NS.toast('Oda ayarları güncellendi.'); return; }
                const el = shx.body.querySelector('[data-ol-err]');
                if (r.error.code === 'UNSUPPORTED') el.textContent = 'Lobide ayar değiştirme yakında. Şimdilik yeni bir oda kurabilirsin.';
                else el.textContent = r.error.message;
            }
        });
        if (unsupported) sh.body.querySelectorAll('input, [data-zorluk]').forEach(i => { i.disabled = true; });
        NS.ui.bindZorluk(sh.body);
        sh.body.addEventListener('change', () => { NS.ui.syncChecked(sh.body); });
    }

    function cleanupNodes() {
        clearTimeout(L.idleTimer); L.idleTimer = 0; L.idleDoze = false;
        L.offs.forEach(f => { try { f(); } catch (e) { /* yok */ } });
        L.offs = [];
        if (L.walker) { L.walker.destroy(); L.walker = null; }
        if (L.room) { L.room.destroy(); L.room = null; }
        L.W = 0; L.H = 0; L.lastActs = {};
        L.nodes.forEach(n => { if (n._bubble) clearTimeout(n._bubble._t); });
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

    NS.lobby = { render, update, destroy, slots, showEmote, showSay, goToObject, get room() { return L.room; }, get walker() { return L.walker; } };
})(typeof window !== 'undefined' ? window : globalThis);
