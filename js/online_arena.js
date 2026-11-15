/**
 * PsikoVaka 3.0 - İnteraktif Online Arena, Turnuva, Free-For-All,
 * Nöro Avatar Stüdyosu (js/avatar.js), Arkadaş Sistemi ve Top 10 Ranked Motoru
 */

// Avatarlar: js/avatar.js (window.PsikoVakaAvatar, "Nöro" ailesi). Ligler: js/leagues.js (window.PsikoVakaLeagues).

// Bot avatarları kimliklerinden tohumlanmış Nöro yapılandırmalarıdır (her yüklemede aynı).
const FUNNY_BOT_PROFILES = [
    {
        id: 'bot_sigmund',
        nickname: 'Dr. SigmundPipo',
        rankedPoints: 1320,
        wins: 48,
        avgGuesses: 2.1,
        avatar: null
    },
    {
        id: 'bot_kafein',
        nickname: 'Uzm.Dr.KafeinKomasi',
        rankedPoints: 1090,
        wins: 39,
        avgGuesses: 2.4,
        avatar: null
    },
    {
        id: 'bot_huni',
        nickname: 'Prof.HuniliKlinisyen',
        rankedPoints: 940,
        wins: 31,
        avgGuesses: 2.6,
        avatar: null
    },
    {
        id: 'bot_nobetci',
        nickname: 'Asist.Dr.Uykusuz36Saat',
        rankedPoints: 760,
        wins: 27,
        avgGuesses: 2.8,
        avatar: null
    },
    {
        id: 'bot_nöron',
        nickname: 'Doç.Dr.SinapsYakıcı',
        rankedPoints: 1480,
        wins: 54,
        avgGuesses: 1.9,
        avatar: null
    },
    {
        id: 'bot_dsm',
        nickname: 'Dr.AyırıcıTanıCanavarı',
        rankedPoints: 620,
        wins: 21,
        avgGuesses: 3.1,
        avatar: null
    },
    {
        id: 'bot_bashekim',
        nickname: 'Başhekim_Dopamin',
        rankedPoints: 1750,
        wins: 67,
        avgGuesses: 1.7,
        avatar: null
    },
    {
        id: 'bot_palyaco',
        nickname: 'Stj.Dr.Plasebo',
        rankedPoints: 340,
        wins: 12,
        avgGuesses: 3.5,
        avatar: null
    }
];
FUNNY_BOT_PROFILES.forEach(b => {
    b.avatar = (typeof PsikoVakaAvatar !== 'undefined') ? PsikoVakaAvatar.randomConfig(b.id) : {};
});

/** Eski çağrı yerleri için ince sarmalayıcı: her yapılandırmayı (eski v1 dahil) Nöro'ya çevirip çizer. */
function renderFunnyAvatarSVG(avatarCfg = {}, size = 56, opts = {}) {
    if (typeof PsikoVakaAvatar === 'undefined') return '';
    return PsikoVakaAvatar.render(PsikoVakaAvatar.normalize(avatarCfg), Object.assign({ size }, opts));
}

/** Tek lig tablosu js/leagues.js'te; eski arena da aynı işlevi kullanır. */
function getRankedTierInfo(rp = 0) {
    return PsikoVakaLeagues.tierFor(rp);
}

function calculateCasePoints(won, guessesCount, elapsedSeconds) {
    if (!won) return 0;
    const baseTable = { 1: 100, 2: 85, 3: 70, 4: 55, 5: 40, 6: 25 };
    const base = baseTable[guessesCount] || 25;
    const speedBonus = Math.max(0, Math.min(20, Math.round((60 - Math.min(60, elapsedSeconds || 30)) / 3)));
    return base + speedBonus;
}

function attachOnlineArenaToGame(GameClass) {
    const proto = GameClass.prototype;

    proto.initOnlineArena = function () {
        // Persistent Player Code (e.g., DR-4829)
        let savedId = localStorage.getItem('psikovaka_player_id');
        if (!savedId) {
            savedId = 'DR-' + Math.floor(1000 + Math.random() * 9000);
            localStorage.setItem('psikovaka_player_id', savedId);
        }
        this.myPlayerId = savedId;

        // Funny Avatar Config
        this.myAvatar = this.loadMyAvatar();

        // Ranked Points (RP)
        const savedRp = localStorage.getItem('psikovaka_ranked_rp');
        this.myRankedPoints = savedRp !== null ? parseInt(savedRp, 10) : 250;

        // Friends List
        this.myFriends = this.loadFriendsList();

        // Discovered Online Players for Scoreboard & Presence
        this.onlinePresenceMap = new Map();

        // Active Multiplayer Room State
        this.selectedArenaMode = 'duel'; // 'duel' | 'ffa' | 'tournament'
        this.includeFunnyBots = false;
        this.roomPlayers = new Map();
        this.roomHeartbeatTimer = null;
        this.botSimulationTimer = null;
        this.roomSocket = null;
        this.presenceSocket = null;

        this.renderHeaderProfilePill();
        this.initArenaTabsAndControls();
        this.connectGlobalPresenceChannel();
    };

    // Yerel avatar her yüklemede Nöro v2'ye normalize edilir; eski (v1) kayıt bulunursa v2 olarak geri yazılır.
    proto.loadMyAvatar = function () {
        let parsed = null;
        try {
            const raw = localStorage.getItem('psikovaka_funny_avatar');
            if (raw) parsed = JSON.parse(raw);
        } catch (e) {}
        const cfg = PsikoVakaAvatar.normalize(parsed);
        if (!parsed || JSON.stringify(parsed) !== JSON.stringify(cfg)) {
            try { localStorage.setItem('psikovaka_funny_avatar', JSON.stringify(cfg)); } catch (e) {}
        }
        return cfg;
    };

    proto.saveMyAvatar = function () {
        this.myAvatar = PsikoVakaAvatar.normalize(this.myAvatar);
        try { localStorage.setItem('psikovaka_funny_avatar', JSON.stringify(this.myAvatar)); } catch (e) {}
        this.renderHeaderProfilePill();
        this.broadcastMyPresence();
    };

    proto.loadFriendsList = function () {
        try {
            const raw = localStorage.getItem('psikovaka_friends');
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return [];
    };

    proto.saveFriendsList = function () {
        localStorage.setItem('psikovaka_friends', JSON.stringify(this.myFriends));
    };

    proto.addRankedPoints = function (deltaRp, reasonLabel = '') {
        this.myRankedPoints = Math.max(0, (this.myRankedPoints || 0) + deltaRp);
        localStorage.setItem('psikovaka_ranked_rp', String(this.myRankedPoints));
        this.renderHeaderProfilePill();
        this.broadcastMyPresence();
        if (deltaRp !== 0) {
            const sign = deltaRp > 0 ? `+${deltaRp}` : `${deltaRp}`;
            const tier = getRankedTierInfo(this.myRankedPoints);
            this.showToast(`${sign} RP (${reasonLabel}) · Yeni puan: ${this.myRankedPoints} RP (${tier.name})`);
        }
    };

    proto.renderHeaderProfilePill = function () {
        const avatarMount = document.getElementById('headerFunnyAvatarMount');
        const nameMount = document.getElementById('headerPlayerNameMount');
        const rpMount = document.getElementById('headerPlayerRpMount');
        const tier = getRankedTierInfo(this.myRankedPoints);

        if (avatarMount) {
            avatarMount.innerHTML = renderFunnyAvatarSVG(this.myAvatar, 34);
        }
        if (nameMount) {
            nameMount.textContent = this.duelMyNickname || 'Klinisyen';
        }
        if (rpMount) {
            rpMount.textContent = `${this.myRankedPoints} RP`;
        }
    };

    // --- Global Presence, Live Leaderboard Sync & Friend Invites ---
    proto.connectGlobalPresenceChannel = function () {
        if (typeof WebSocket === 'undefined') return;
        try {
            if (this.presenceSocket) {
                try { this.presenceSocket.close(); } catch (e) {}
            }
            const ws = new WebSocket('wss://ntfy.sh/psikovaka_global_presence_v3/ws');
            this.presenceSocket = ws;
            ws.onopen = () => {
                this.broadcastMyPresence();
            };
            ws.onmessage = (ev) => {
                try {
                    const outer = JSON.parse(ev.data);
                    if (outer.event !== 'message' || !outer.message) return;
                    const data = JSON.parse(outer.message);
                    this.handleGlobalPresencePacket(data);
                } catch (e) {}
            };
        } catch (e) {}
    };

    proto.sendGlobalPresencePacket = function (payload) {
        try {
            fetch('https://ntfy.sh/psikovaka_global_presence_v3', {
                method: 'POST',
                body: JSON.stringify(payload)
            }).catch(() => {});
        } catch (e) {}
        if (typeof BroadcastChannel !== 'undefined') {
            if (!this.globalLocalBus) {
                this.globalLocalBus = new BroadcastChannel('psikovaka_global_presence_v3');
                this.globalLocalBus.onmessage = (e) => this.handleGlobalPresencePacket(e.data);
            }
            try { this.globalLocalBus.postMessage(payload); } catch (e) {}
        }
    };

    proto.broadcastMyPresence = function () {
        const avgG = this.stats && this.stats.won > 0 ?
            ((Object.entries(this.stats.guesses || {}).reduce((acc, [k, v]) => acc + Number(k) * v, 0)) / this.stats.won).toFixed(1) :
            2.5;
        this.sendGlobalPresencePacket({
            type: 'PRESENCE',
            playerId: this.myPlayerId,
            nickname: this.duelMyNickname,
            avatar: this.myAvatar,
            rankedPoints: this.myRankedPoints,
            wins: (this.stats && this.stats.won) || 0,
            avgGuesses: avgG,
            ts: Date.now()
        });
    };

    proto.handleGlobalPresencePacket = function (data) {
        if (!data) return;
        if (data.type === 'PRESENCE' && data.playerId) {
            this.onlinePresenceMap.set(data.playerId, {
                ...data,
                lastSeen: Date.now()
            });
            // Update friend record if exists
            const fr = this.myFriends.find(f => f.playerId === data.playerId);
            if (fr) {
                fr.nickname = data.nickname;
                fr.avatar = data.avatar;
                fr.rankedPoints = data.rankedPoints;
                fr.online = true;
                this.saveFriendsList();
            }
        } else if (data.type === 'FRIEND_INVITE' && data.targetPlayerId === this.myPlayerId) {
            this.showInteractiveInviteBanner(data);
        } else if (data.type === 'MM_GLOBAL_SEEK' && data.playerId !== this.myPlayerId && this.isMatchmaking) {
            // Instant global matchmaking via presence relay!
            const roomCode = 'AR' + Math.floor(10 + Math.random() * 89);
            const matchMode = this.selectedArenaMode || 'duel';
            this.sendGlobalPresencePacket({
                type: 'MM_GLOBAL_FOUND',
                targetPlayerId: data.playerId,
                roomCode,
                mode: matchMode,
                hostPlayer: this.getMyPlayerSummary()
            });
            this.cancelMatchmaking(false);
            this.closeModal(this.dom.duelCenterModal);
            this.joinOrCreateArenaRoom(roomCode, matchMode, true, [data.playerSummary]);
        } else if (data.type === 'MM_GLOBAL_FOUND' && data.targetPlayerId === this.myPlayerId && this.isMatchmaking) {
            this.cancelMatchmaking(false);
            this.closeModal(this.dom.duelCenterModal);
            this.joinOrCreateArenaRoom(data.roomCode, data.mode || 'duel', false, [data.hostPlayer]);
        }
    };

    proto.showInteractiveInviteBanner = function (invite) {
        const banner = document.createElement('div');
        banner.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:9999; background:linear-gradient(135deg, #1e1b4b, #311042); border:2px solid #10b981; border-radius:16px; padding:1rem 1.25rem; box-shadow:0 16px 40px rgba(0,0,0,0.6); display:flex; align-items:center; gap:0.85rem; max-width:400px; animation:slideInUp 0.3s ease;';
        banner.innerHTML = `
            ${renderFunnyAvatarSVG(invite.fromAvatar, 48)}
            <div style="flex:1;">
                <div style="font-size:0.75rem; color:#34d399; font-weight:800; text-transform:uppercase;">🔔 Canlı Oda Daveti!</div>
                <div style="font-size:0.9rem; font-weight:800; color:#fff;">${invite.fromNickname} seni ${invite.modeLabel || 'Canlı Düello'} odasına (#${invite.roomCode}) çağırıyor!</div>
                <div style="display:flex; gap:0.5rem; margin-top:0.5rem;">
                    <button class="btn-primary btn-accept-inv" style="padding:0.35rem 0.8rem; font-size:0.78rem;">🚀 Hemen Katıl</button>
                    <button class="btn-secondary btn-dismiss-inv" style="padding:0.35rem 0.65rem; font-size:0.75rem;">Kapat</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);
        this.playTone('warm');

        banner.querySelector('.btn-accept-inv').onclick = () => {
            banner.remove();
            this.closeModal(this.dom.duelCenterModal);
            this.joinOrCreateArenaRoom(invite.roomCode, invite.mode || 'duel', false);
        };
        banner.querySelector('.btn-dismiss-inv').onclick = () => banner.remove();
        setTimeout(() => { if (banner.parentNode) banner.remove(); }, 18000);
    };

    proto.getMyPlayerSummary = function () {
        return {
            playerId: this.myPlayerId,
            nickname: this.duelMyNickname || 'Klinisyen',
            avatar: this.myAvatar,
            rankedPoints: this.myRankedPoints
        };
    };

    // --- Interactive Online Hub Modal (4 Tabs: Play, Scoreboard, Avatar, Friends) ---
    proto.initArenaTabsAndControls = function () {
        // Header Profile button opens Online Hub on Avatar/Play tab
        const btnProfilePill = document.getElementById('btnHeaderProfilePill');
        if (btnProfilePill) {
            btnProfilePill.addEventListener('click', () => {
                this.openDuelCenterModal('tabArenaAvatar');
            });
        }

        // Hub Tab Switchers
        document.querySelectorAll('.arena-hub-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.currentTarget.dataset.tab;
                this.switchArenaHubTab(targetTab);
            });
        });

        // Mode Card Selector (1v1 Duel, Free-For-All, Tournament)
        document.querySelectorAll('.arena-mode-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.arenamode;
                this.selectedArenaMode = mode;
                document.querySelectorAll('.arena-mode-card').forEach(c => c.classList.toggle('active', c.dataset.arenamode === mode));
                const botToggleWrap = document.getElementById('arenaBotFillToggleWrap');
                if (botToggleWrap) {
                    botToggleWrap.style.display = 'flex';
                }
            });
        });

        // Funny Bots Checkbox
        const botChk = document.getElementById('chkIncludeFunnyBots');
        if (botChk) {
            botChk.addEventListener('change', (e) => {
                this.includeFunnyBots = e.target.checked;
            });
        }

        // Random Funny Avatar Button
        const btnRandomAvatar = document.getElementById('btnRandomizeFunnyAvatar');
        if (btnRandomAvatar) {
            btnRandomAvatar.addEventListener('click', () => {
                this.setStudioAvatar(PsikoVakaAvatar.randomConfig(), true);
                this.playTone('warm');
            });
        }

        // Add Friend By Code Button
        const btnAddFriend = document.getElementById('btnAddFriendByCode');
        if (btnAddFriend) {
            btnAddFriend.addEventListener('click', () => {
                const codeInput = document.getElementById('friendCodeInput');
                const nameInput = document.getElementById('friendNameInput');
                const code = (codeInput ? codeInput.value : '').trim().toUpperCase();
                const name = (nameInput ? nameInput.value : '').trim() || `Klinisyen ${code}`;
                if (!code) {
                    this.showToast("⚠️ Lütfen arkadaşınızın DR-XXXX kodunu girin.");
                    return;
                }
                this.addPlayerToFriends({
                    playerId: code.startsWith('DR-') ? code : `DR-${code}`,
                    nickname: name,
                    rankedPoints: 300,
                    avatar: FUNNY_BOT_PROFILES[Math.floor(Math.random() * FUNNY_BOT_PROFILES.length)].avatar
                });
                if (codeInput) codeInput.value = '';
                if (nameInput) nameInput.value = '';
            });
        }
    };

    proto.switchArenaHubTab = function (tabId) {
        document.querySelectorAll('.arena-hub-tab-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.tab === tabId);
        });
        document.querySelectorAll('.arena-hub-panel').forEach(p => {
            p.style.display = (p.id === tabId) ? 'block' : 'none';
        });

        if (tabId === 'tabArenaScoreboard') {
            this.renderRankedScoreboardTab();
        } else if (tabId === 'tabArenaAvatar') {
            this.renderAvatarStudioTab();
        } else if (tabId === 'tabArenaFriends') {
            this.renderFriendsTab();
        }
    };

    // Override openDuelCenterModal to support the new 4-tab Interactive Hub
    proto.openDuelCenterModal = function (initialTab = 'tabArenaPlay') {
        const nickInput = document.getElementById('duelNicknameInput');
        if (nickInput) {
            nickInput.value = this.duelMyNickname;
            nickInput.oninput = () => {
                this.duelMyNickname = nickInput.value.trim() || 'Klinisyen';
                localStorage.setItem('psikovaka_nickname', this.duelMyNickname);
                this.renderHeaderProfilePill();
            };
        }

        const myCodeBadge = document.getElementById('myFriendCodeBadge');
        if (myCodeBadge) myCodeBadge.textContent = this.myPlayerId;

        const duelLinkInput = document.getElementById('currentCaseDuelLinkInput');
        if (duelLinkInput) {
            duelLinkInput.value = this.buildCurrentCaseDuelLink();
        }

        const btnCopyDuel = document.getElementById('btnCopyCurrentDuelLink');
        if (btnCopyDuel) {
            btnCopyDuel.onclick = () => {
                this.saveDuelNicknameFromModal();
                const link = this.buildCurrentCaseDuelLink();
                if (duelLinkInput) duelLinkInput.value = link;
                navigator.clipboard.writeText(link);
                this.showToast("⚔️ Tek vaka düello linki kopyalandı!");
            };
        }

        const btnWaDuel = document.getElementById('btnWhatsappCurrentDuel');
        if (btnWaDuel) {
            btnWaDuel.onclick = () => {
                this.saveDuelNicknameFromModal();
                const link = this.buildCurrentCaseDuelLink();
                const caseNum = this.currentCase ? this.currentCase.caseNumber : 1;
                const msg = `⚔️ *PsikoVaka Klinik Meydan Okuma!*\n🧑‍⚕️ *${this.duelMyNickname}* seni *Vaka #${caseNum}* üzerinde düelloya davet ediyor!\n👉 Tıkla ve yarış:\n${link}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
            };
        }

        this.broadcastMyPresence();
        this.switchArenaHubTab(initialTab || 'tabArenaPlay');
        this.openModal(this.dom.duelCenterModal);
    };

    // --- Tab 2: Sıralama ---
    // Ajan D (2026-11-15): Sıralama artık yalnızca sunucudaki `leaderboard` görünümünden gelir (gerçek hesaplar).
    // Örnek/bot oyuncular (FUNNY_BOT_PROFILES) ve doğrulanmamış yerel RP'ler hiçbir sıralamada gösterilmez.
    // Oda içi "bot oyuncu ekle" pratik özelliği ayrıdır ve değişmedi.
    proto.renderRankedScoreboardTab = function () {
        const bannerEl = document.getElementById('myRankedSummaryBanner');
        const listEl = document.getElementById('top10ScoreboardList');
        if (!listEl) return;
        const panel = listEl.closest('.arena-hub-panel');
        const headEl = panel ? panel.querySelector('.arena-board-head') : null;
        const A = (typeof window !== 'undefined' && window.PsikoVakaAccount) ? window.PsikoVakaAccount : null;
        const snap = A ? A.snapshot() : null;
        const esc = (v) => String(v === null || v === undefined ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
        const avatarOf = (a, size) => renderFunnyAvatarSVG(a && typeof a === 'object' ? a : {}, size);
        const seq = (this._rankSeq = (this._rankSeq || 0) + 1);
        const ready = !!(snap && snap.state === 'ready' && snap.profile && snap.profile.username);

        // Üst kart
        if (bannerEl) {
            if (ready) {
                const p = snap.profile;
                const rp = Number(p.ranked_points) || 0;
                const tier = getRankedTierInfo(rp);
                const pct = tier.pct;
                bannerEl.innerHTML = `
                    <div class="rank-banner">
                        <div class="rank-banner-main">
                            <span class="rank-avatar">${avatarOf(this.myAvatar || p.avatar, 48)}</span>
                            <div class="rank-banner-meta">
                                <span class="rank-banner-name">${esc(p.display_name || p.username)}</span>
                                <span class="rank-banner-sub">@${esc(p.username)}</span>
                            </div>
                            <span class="rank-banner-rp">${PsikoVakaLeagues.badge(rp, 22)}${rp} RP</span>
                        </div>
                        <div class="rank-progress">
                            <span class="rank-progress-track"><span class="rank-progress-fill"></span></span>
                            <span class="rank-progress-label">${esc(tier.name)} · ${esc(PsikoVakaLeagues.progressText(rp))}</span>
                        </div>
                    </div>`;
                const fill = bannerEl.querySelector('.rank-progress-fill');
                if (fill) fill.style.width = `${pct}%`;
            } else {
                let text = 'Sıralamada yalnızca hesabı olan oyuncular yer alır. Görmek ve sıralamaya girmek için giriş yap.';
                let actions = `<button class="btn btn-primary btn-sm" type="button" data-rank-auth="signin">Giriş yap</button>
                               <button class="btn btn-secondary btn-sm" type="button" data-rank-auth="signup">Kayıt ol</button>`;
                if (!A || !snap || snap.availability === 'disabled' || snap.availability === 'unsupported' || snap.availability === 'unavailable') {
                    text = snap && snap.availability === 'unsupported'
                        ? 'Sıralama yalnızca sitenin çevrimiçi sürümünde görünür.'
                        : 'Sıralama şu an yüklenemiyor: hesap hizmetine ulaşılamıyor.';
                    actions = '';
                } else if (snap.state === 'signed_in_no_username') {
                    text = 'Sıralamaya girmek için önce kullanıcı adını seç.';
                    actions = `<button class="btn btn-primary btn-sm" type="button" data-rank-username>Kullanıcı adı seç</button>`;
                } else if (snap.state === 'ready' && !snap.profile) {
                    text = 'Profilin yüklenemedi; sıralama gösterilemiyor.';
                    actions = '';
                }
                bannerEl.innerHTML = `<div class="rank-banner"><p class="rank-banner-text">${text}</p>${actions ? `<div class="rank-banner-actions">${actions}</div>` : ''}</div>`;
                bannerEl.querySelectorAll('[data-rank-auth]').forEach(b => {
                    b.addEventListener('click', () => { if (typeof this.openAuthSheet === 'function') this.openAuthSheet(b.dataset.rankAuth); });
                });
                const bu = bannerEl.querySelector('[data-rank-username]');
                if (bu) bu.addEventListener('click', () => {
                    if (this.dom && this.dom.duelCenterModal) this.closeModal(this.dom.duelCenterModal);
                    if (typeof this.openUsernameModal === 'function') this.openUsernameModal();
                });
            }
        }

        if (headEl) headEl.hidden = !ready;
        if (!ready) { listEl.innerHTML = ''; return; }

        listEl.innerHTML = `<div class="rank-list" aria-busy="true" aria-label="Sıralama yükleniyor">${'<div class="rank-skeleton"></div>'.repeat(5)}</div>`;
        const myId = snap.user ? snap.user.id : null;
        const rowHtml = (r) => {
            const rp = Number(r.ranked_points) || 0;
            const isMe = r.user_id === myId;
            const pos = Number(r.position) || 0;
            return `<div class="rank-row${isMe ? ' is-me' : ''}${pos > 0 && pos <= 3 ? ' is-top' : ''}"${isMe ? ' aria-current="true"' : ''}>
                <span class="rank-pos">${pos || '–'}</span>
                <span class="rank-avatar">${avatarOf(r.avatar, 36)}</span>
                <span class="rank-who">
                    <span class="rank-name">${esc(r.display_name || r.username)}${isMe ? '<span class="rank-you">(sen)</span>' : ''}</span>
                    <span class="rank-sub">@${esc(r.username)} · ${esc(getRankedTierInfo(rp).name)}</span>
                </span>
                <span class="rank-rp">${PsikoVakaLeagues.badge(rp, 18)}<span>${rp} RP</span></span>
            </div>`;
        };

        A.getLeaderboard(10).then(res => {
            if (seq !== this._rankSeq) return;
            if (!res || !res.ok) {
                const m = (res && res.error && res.error.message) || 'Bir şeyler ters gitti.';
                listEl.innerHTML = `<div class="rank-state" role="alert"><span>Sıralama yüklenemedi. ${esc(m)}</span><button class="btn btn-secondary btn-sm" type="button" data-rank-retry>Tekrar dene</button></div>`;
                const rb = listEl.querySelector('[data-rank-retry]');
                if (rb) rb.addEventListener('click', () => this.renderRankedScoreboardTab());
                return;
            }
            const rows = res.rows || [];
            if (!rows.length) {
                listEl.innerHTML = `<div class="rank-state">Henüz sıralamada kimse yok. İlk sen ol.</div>`;
                return;
            }
            let html = rows.map(rowHtml).join('');
            if (res.me && !rows.some(r => r.user_id === res.me.user_id)) {
                html += `<div class="rank-gap" aria-hidden="true">···</div>` + rowHtml(res.me);
            }
            listEl.innerHTML = `<div class="rank-list">${html}</div>`;
        }).catch(() => {
            if (seq !== this._rankSeq) return;
            listEl.innerHTML = `<div class="rank-state" role="alert">Sıralama yüklenemedi.</div>`;
        });
    };

    // --- Tab 3: Nöro avatar stüdyosu (js/avatar.js) ---
    proto.renderAvatarStudioTab = function () {
        const previewEl = document.getElementById('funnyAvatarLivePreview');
        const tabsEl = document.getElementById('avatarSlotTabs');
        const gridEl = document.getElementById('funnyAvatarControlsGrid');
        if (!previewEl || !tabsEl || !gridEl) return;
        const A = PsikoVakaAvatar;
        this.myAvatar = A.normalize(this.myAvatar);
        if (!this.avatarStudioSlot) this.avatarStudioSlot = 'body';

        if (!this._avatarStudioBound) {
            this._avatarStudioBound = true;
            const icons = { body: 'av-body', color: 'av-color', tufts: 'av-tuft', eyes: 'eye', mouth: 'av-mouth', pattern: 'av-pattern', headwear: 'av-hat', accessory: 'av-acc', background: 'av-bg' };
            tabsEl.innerHTML = A.SLOTS.map(sl => `<button type="button" class="nv-slot-tab" role="tab" id="avatarSlotTab-${sl.key}" data-slot="${sl.key}" aria-controls="avatarSlotPanel" aria-selected="false" tabindex="-1"><svg class="icon" aria-hidden="true"><use href="#i-${icons[sl.key]}"/></svg><span>${sl.label}</span></button>`).join('');
            tabsEl.addEventListener('click', (e) => {
                const b = e.target.closest('[data-slot]');
                if (b) this.selectAvatarStudioSlot(b.dataset.slot, false);
            });
            tabsEl.addEventListener('keydown', (e) => {
                const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
                if (!keys.includes(e.key)) return;
                e.preventDefault();
                const order = A.SLOTS.map(s => s.key);
                let i = order.indexOf(this.avatarStudioSlot);
                if (e.key === 'ArrowRight') i = (i + 1) % order.length;
                else if (e.key === 'ArrowLeft') i = (i - 1 + order.length) % order.length;
                else if (e.key === 'Home') i = 0;
                else i = order.length - 1;
                this.selectAvatarStudioSlot(order[i], true);
            });
            gridEl.addEventListener('click', (e) => {
                const b = e.target.closest('[data-val]');
                if (b) this.pickAvatarOption(b.dataset.val, false);
            });
            gridEl.addEventListener('keydown', (e) => {
                const items = Array.from(gridEl.querySelectorAll('[data-val]'));
                if (!items.length) return;
                const cur = Math.max(0, items.findIndex(x => x.getAttribute('aria-checked') === 'true'));
                let next = null;
                const cols = Math.max(1, Math.round(gridEl.clientWidth / Math.max(1, items[0].offsetWidth)));
                if (e.key === 'ArrowRight') next = (cur + 1) % items.length;
                else if (e.key === 'ArrowLeft') next = (cur - 1 + items.length) % items.length;
                else if (e.key === 'ArrowDown') next = Math.min(items.length - 1, cur + cols);
                else if (e.key === 'ArrowUp') next = Math.max(0, cur - cols);
                else if (e.key === 'Home') next = 0;
                else if (e.key === 'End') next = items.length - 1;
                else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this.pickAvatarOption(items[cur].dataset.val, true); return; }
                if (next === null) return;
                e.preventDefault();
                this.pickAvatarOption(items[next].dataset.val, true);
            });
            const btnReset = document.getElementById('btnResetAvatar');
            if (btnReset) btnReset.addEventListener('click', () => this.setStudioAvatar(Object.assign({}, A.DEFAULT), true));
        }
        this.renderAvatarStudioPreview();
        this.selectAvatarStudioSlot(this.avatarStudioSlot, false);
    };

    proto.renderAvatarStudioPreview = function () {
        const A = PsikoVakaAvatar;
        const previewEl = document.getElementById('funnyAvatarLivePreview');
        if (previewEl) previewEl.innerHTML = A.render(this.myAvatar, { size: 200, framed: true, animated: true, title: `Avatarın: ${A.describe(this.myAvatar)}` });
        const nameEl = document.getElementById('avatarStudioName');
        if (nameEl) nameEl.textContent = this.duelMyNickname || 'Klinisyen';
        const descEl = document.getElementById('avatarStudioDesc');
        if (descEl) descEl.textContent = A.describe(this.myAvatar);
    };

    proto.selectAvatarStudioSlot = function (slot, focus) {
        const A = PsikoVakaAvatar;
        const sl = A.SLOTS.find(s => s.key === slot) || A.SLOTS[0];
        this.avatarStudioSlot = sl.key;
        const tabsEl = document.getElementById('avatarSlotTabs');
        const gridEl = document.getElementById('funnyAvatarControlsGrid');
        const panel = document.getElementById('avatarSlotPanel');
        if (!tabsEl || !gridEl) return;
        tabsEl.querySelectorAll('[data-slot]').forEach(b => {
            const on = b.dataset.slot === sl.key;
            b.setAttribute('aria-selected', String(on));
            b.tabIndex = on ? 0 : -1;
            b.classList.toggle('active', on);
            if (on && focus) { b.focus(); }
            if (on) { try { b.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) {} }
        });
        if (panel) panel.setAttribute('aria-labelledby', `avatarSlotTab-${sl.key}`);
        gridEl.setAttribute('aria-label', sl.label);
        gridEl.classList.toggle('is-colors', sl.key === 'color' || sl.key === 'background');
        const cur = this.myAvatar[sl.key];
        gridEl.innerHTML = A.PARTS[sl.key].map(p => {
            const cfg = Object.assign({}, this.myAvatar, { [sl.key]: p.id });
            const framed = sl.key === 'background' ? p.id !== 'none' : true;
            if (sl.key !== 'background' && sl.key !== 'color') cfg.background = this.myAvatar.background === 'none' ? 'lavender' : this.myAvatar.background;
            const on = p.id === cur;
            return `<button type="button" class="nv-swatch" role="radio" aria-checked="${on}" tabindex="${on ? 0 : -1}" data-val="${p.id}">
                <span class="nv-swatch-art">${A.render(cfg, { size: 64, framed })}</span>
                <span class="nv-swatch-label">${p.name}</span>
            </button>`;
        }).join('');
    };

    proto.pickAvatarOption = function (val, focus) {
        const slot = this.avatarStudioSlot;
        const gridEl = document.getElementById('funnyAvatarControlsGrid');
        if (!gridEl) return;
        gridEl.querySelectorAll('[data-val]').forEach(b => {
            const on = b.dataset.val === val;
            b.setAttribute('aria-checked', String(on));
            b.tabIndex = on ? 0 : -1;
            if (on && focus) b.focus();
        });
        if (this.myAvatar[slot] === val) return;
        this.setStudioAvatar(Object.assign({}, this.myAvatar, { [slot]: val }), false);
    };

    /** Stüdyodan gelen değişiklik: önizleme hemen güncellenir, kayıt (yerel + hesap) kısa gecikmeyle. */
    proto.setStudioAvatar = function (cfg, rerenderGrid) {
        this.myAvatar = PsikoVakaAvatar.normalize(cfg);
        this.renderAvatarStudioPreview();
        if (rerenderGrid) this.selectAvatarStudioSlot(this.avatarStudioSlot, false);
        clearTimeout(this._avatarSaveTimer);
        this._avatarSaveTimer = setTimeout(() => {
            this._avatarSaveTimer = null;
            this.saveMyAvatar();
            const remote = typeof this.accountReady === 'function' && this.accountReady();
            this.setAvatarSaveStatus(remote ? 'saving' : 'saved');
        }, 300);
    };

    /** 'saving' | 'saved' | 'error' | '' — hesap senkronu (app.js) sonucu da buraya bildirir. */
    proto.setAvatarSaveStatus = function (state) {
        const el = document.getElementById('avatarSaveStatus');
        if (!el) return;
        const text = { saving: 'Kaydediliyor…', saved: 'Kaydedildi', error: 'Sunucuya kaydedilemedi; bu cihazda kayıtlı.' }[state] || '';
        el.textContent = text;
        el.dataset.state = state || '';
        clearTimeout(this._avatarStatusTimer);
        if (state === 'saved') this._avatarStatusTimer = setTimeout(() => { el.textContent = ''; el.dataset.state = ''; }, 2500);
    };

    // --- Tab 4: Friends System ---
    proto.addPlayerToFriends = function (playerObj) {
        if (!playerObj || !playerObj.playerId || playerObj.playerId === this.myPlayerId) return;
        const exists = this.myFriends.find(f => f.playerId === playerObj.playerId);
        if (exists) {
            exists.nickname = playerObj.nickname || exists.nickname;
            exists.avatar = playerObj.avatar || exists.avatar;
            exists.rankedPoints = playerObj.rankedPoints || exists.rankedPoints;
            this.saveFriendsList();
            this.showToast(`ℹ️ ${playerObj.nickname} zaten arkadaş listenizde (bilgileri güncellendi).`);
        } else {
            this.myFriends.unshift({
                playerId: playerObj.playerId,
                nickname: playerObj.nickname || 'Klinisyen',
                rankedPoints: playerObj.rankedPoints || 250,
                avatar: playerObj.avatar || FUNNY_BOT_PROFILES[0].avatar,
                addedAt: Date.now()
            });
            this.saveFriendsList();
            this.showToast(`👥 ${playerObj.nickname} arkadaş listenize eklendi!`);
        }
        this.renderFriendsTab();
    };

    proto.renderFriendsTab = function () {
        const esc = (v) => String(v === null || v === undefined ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
        const listEl = document.getElementById('friendsListContainer');
        const codeEl = document.getElementById('myFriendCodeBadge');
        if (codeEl) codeEl.textContent = this.myPlayerId;
        if (!listEl) return;

        if (this.myFriends.length === 0) {
            listEl.innerHTML = `<div style="font-size:0.84rem; color:var(--text-muted); text-align:center; padding:1.2rem; background:var(--bg-secondary); border-radius:12px;">Henüz arkadaş eklemediniz. Yukarıdan arkadaşınızın <strong>DR-XXXX</strong> kodunu girerek veya Canlı Düello / Top 10 listesindeki oyuncuların yanındaki <strong>➕</strong> butonuna basarak ekleyebilirsiniz!</div>`;
            return;
        }

        listEl.innerHTML = '';
        this.myFriends.forEach(fr => {
            const tier = getRankedTierInfo(fr.rankedPoints || 250);
            const isOnline = this.onlinePresenceMap.has(fr.playerId);
            const row = document.createElement('div');
            row.style.cssText = 'display:flex; justify-content:space-between; align-items:center; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:12px; padding:0.65rem 0.9rem; gap:0.6rem; flex-wrap:wrap;';
            row.innerHTML = `
                <div style="display:flex; align-items:center; gap:0.75rem;">
                    ${renderFunnyAvatarSVG(fr.avatar, 44)}
                    <div>
                        <div style="font-weight:800; font-size:0.9rem; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
                            ${fr.nickname}
                            <span style="font-size:0.7rem; padding:2px 6px; border-radius:99px; background:${isOnline ? 'rgba(16,185,129,0.18)' : 'rgba(148,163,184,0.15)'}; color:${isOnline ? '#34d399' : 'var(--text-muted)'};">
                                ${isOnline ? '🟢 Çevrimiçi' : '⚪ Çevrimdışı'}
                            </span>
                        </div>
                        <div class="friend-rp-line">${PsikoVakaLeagues.badge(fr.rankedPoints || 250, 16)} ${esc(tier.name)} · ${fr.rankedPoints || 250} RP · Kod: ${esc(fr.playerId)}</div>
                    </div>
                </div>
                <div style="display:flex; gap:0.4rem;">
                    <button class="btn-primary btn-invite-friend" style="padding:0.38rem 0.75rem; font-size:0.76rem;">⚔️ Odaya Çağır</button>
                    <button class="btn-secondary btn-del-friend" style="padding:0.38rem 0.55rem; font-size:0.76rem; color:#fb7185;">🗑️</button>
                </div>
            `;
            row.querySelector('.btn-invite-friend').onclick = () => {
                const roomCode = (this.activeDuelChallenge && this.activeDuelChallenge.roomCode) || ('RM' + Math.floor(10 + Math.random() * 89));
                const mode = this.selectedArenaMode || 'duel';
                const modeNames = { duel: '1v1 Düello', ffa: 'Free-For-All', tournament: 'Turnuva' };
                this.sendGlobalPresencePacket({
                    type: 'FRIEND_INVITE',
                    targetPlayerId: fr.playerId,
                    fromPlayerId: this.myPlayerId,
                    fromNickname: this.duelMyNickname,
                    fromAvatar: this.myAvatar,
                    roomCode,
                    mode,
                    modeLabel: modeNames[mode] || 'Canlı Düello'
                });
                this.closeModal(this.dom.duelCenterModal);
                this.joinOrCreateArenaRoom(roomCode, mode, true);
                this.showToast(`🔔 ${fr.nickname} adlı arkadaşınıza canlı oda daveti (#${roomCode}) gönderildi!`);
            };
            row.querySelector('.btn-del-friend').onclick = () => {
                this.myFriends = this.myFriends.filter(x => x.playerId !== fr.playerId);
                this.saveFriendsList();
                this.renderFriendsTab();
            };
            listEl.appendChild(row);
        });
    };

    // --- Triple-Redundant Real-Time Room Engine (1v1 Duel, Free-For-All, Tournament) ---
    proto.createLiveDuelRoom = function () {
        this.saveDuelNicknameFromModal();
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const mode = this.selectedArenaMode || 'duel';
        this.closeModal(this.dom.duelCenterModal);
        this.joinOrCreateArenaRoom(code, mode, true);
    };

    proto.joinLiveDuelRoom = function (code) {
        this.saveDuelNicknameFromModal();
        const cleanCode = code.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 6);
        if (!cleanCode) return;
        const mode = this.selectedArenaMode || 'duel';
        this.closeModal(this.dom.duelCenterModal);
        this.joinOrCreateArenaRoom(cleanCode, mode, false);
    };

    proto.joinOrCreateArenaRoom = function (roomCode, arenaMode = 'duel', isHost = false, initialPlayers = []) {
        this.cleanupArenaConnections();

        const roomCases = this.getDeterministicRoomCases(roomCode);
        this.roomPlayers = new Map();

        // Add myself
        this.roomPlayers.set(this.myPlayerId, {
            playerId: this.myPlayerId,
            nickname: this.duelMyNickname,
            avatar: this.myAvatar,
            rankedPoints: this.myRankedPoints,
            roundIndex: 0,
            guessesCount: 0,
            finished: false,
            won: false,
            roundScore: 0,
            totalScore: 0,
            timeSec: 0,
            eliminated: false,
            isMe: true
        });

        // Add any pre-known players
        initialPlayers.forEach(p => {
            if (p && p.playerId && p.playerId !== this.myPlayerId) {
                this.roomPlayers.set(p.playerId, {
                    playerId: p.playerId,
                    nickname: p.nickname || 'Rakip Klinisyen',
                    avatar: p.avatar || FUNNY_BOT_PROFILES[0].avatar,
                    rankedPoints: p.rankedPoints || 250,
                    roundIndex: 0,
                    guessesCount: 0,
                    finished: false,
                    won: false,
                    roundScore: 0,
                    totalScore: 0,
                    timeSec: 0,
                    eliminated: false
                });
            }
        });

        // Add Funny AI Bots if requested or if Tournament/FFA with bots enabled
        if (this.includeFunnyBots) {
            const botCount = arenaMode === 'tournament' ? 3 : (arenaMode === 'ffa' ? 3 : 1);
            const shuffledBots = [...FUNNY_BOT_PROFILES].sort(() => Math.random() - 0.5).slice(0, botCount);
            shuffledBots.forEach(b => {
                this.roomPlayers.set(b.id, {
                    playerId: b.id,
                    nickname: b.nickname,
                    avatar: b.avatar,
                    rankedPoints: b.rankedPoints,
                    roundIndex: 0,
                    guessesCount: 0,
                    finished: false,
                    won: false,
                    roundScore: 0,
                    totalScore: 0,
                    timeSec: 0,
                    eliminated: false,
                    isBot: true
                });
            });
        }

        const totalRounds = arenaMode === 'tournament' ? 3 : 5;
        this.activeDuelChallenge = {
            isRoomDuel: true,
            arenaMode, // 'duel' | 'ffa' | 'tournament'
            roomCode,
            roomCases,
            roundIndex: 0,
            totalRounds,
            challengerName: 'Rakip Bekleniyor...'
        };

        // 1. Channel A: Cloud WebSocket Relay (ntfy.sh) - Works across ALL NATs/Networks & Multi-Player!
        const topic = `psikovaka_room_v3_${roomCode.toUpperCase()}`;
        this.currentRoomTopic = topic;
        if (typeof WebSocket !== 'undefined') {
            try {
                const ws = new WebSocket(`wss://ntfy.sh/${topic}/ws`);
                this.roomSocket = ws;
                ws.onopen = () => {
                    this.broadcastMyRoomState();
                };
                ws.onmessage = (ev) => {
                    try {
                        const outer = JSON.parse(ev.data);
                        if (outer.event !== 'message' || !outer.message) return;
                        const packet = JSON.parse(outer.message);
                        this.handleIncomingDuelMessage(packet);
                    } catch (e) {}
                };
            } catch (e) {}
        }

        // 2. Channel B: BroadcastChannel for instant local tab sync
        if (typeof BroadcastChannel !== 'undefined') {
            this.broadcastChannel = new BroadcastChannel(topic);
            this.broadcastChannel.onmessage = (ev) => this.handleIncomingDuelMessage(ev.data);
        }

        // 3. Channel C: PeerJS WebRTC P2P with Google STUN servers
        if (typeof Peer !== 'undefined') {
            try {
                const peerConfig = {
                    config: {
                        iceServers: [
                            { urls: 'stun:stun.l.google.com:19302' },
                            { urls: 'stun:global.stun.twilio.com:3478' }
                        ]
                    }
                };
                const hostPeerId = `psikovaka-v3-room-${roomCode.toLowerCase()}`;
                this.peer = isHost ? new Peer(hostPeerId, peerConfig) : new Peer(undefined, peerConfig);
                this.peerConnections = [];

                this.peer.on('open', () => {
                    if (!isHost) {
                        const conn = this.peer.connect(hostPeerId, { reliable: true });
                        this.bindArenaPeerConn(conn);
                    }
                    this.broadcastMyRoomState();
                });

                this.peer.on('connection', (conn) => {
                    this.bindArenaPeerConn(conn);
                });

                this.peer.on('error', () => {
                    // If joining player noticed nobody holds hostPeerId yet, claim or rely on Cloud Relay
                });
            } catch (e) {}
        }

        // 4. Continuous Heartbeat every 2.5s so NO finish or guess state is EVER missed!
        this.roomHeartbeatTimer = setInterval(() => {
            if (this.activeDuelChallenge && this.activeDuelChallenge.isRoomDuel) {
                this.broadcastMyRoomState();
            }
        }, 2500);

        this.launchArenaRound(0);
    };

    proto.bindArenaPeerConn = function (conn) {
        if (!conn) return;
        this.peerConnections = this.peerConnections || [];
        this.peerConnections.push(conn);
        conn.on('open', () => {
            this.broadcastMyRoomState();
        });
        conn.on('data', (data) => {
            this.handleIncomingDuelMessage(data);
        });
    };

    proto.cleanupArenaConnections = function () {
        if (this.roomHeartbeatTimer) {
            clearInterval(this.roomHeartbeatTimer);
            this.roomHeartbeatTimer = null;
        }
        if (this.botSimulationTimer) {
            clearInterval(this.botSimulationTimer);
            this.botSimulationTimer = null;
        }
        if (this.roomSocket) {
            try { this.roomSocket.close(); } catch (e) {}
            this.roomSocket = null;
        }
        if (this.peer) {
            try { this.peer.destroy(); } catch (e) {}
            this.peer = null;
        }
        this.peerConnections = [];
        if (this.broadcastChannel) {
            try { this.broadcastChannel.close(); } catch (e) {}
            this.broadcastChannel = null;
        }
    };

    proto.sendDuelPacket = function (packet) {
        // Send over PeerJS
        if (Array.isArray(this.peerConnections)) {
            this.peerConnections.forEach(c => {
                if (c && c.open) {
                    try { c.send(packet); } catch (e) {}
                }
            });
        }
        // Send over BroadcastChannel
        if (this.broadcastChannel) {
            try { this.broadcastChannel.postMessage(packet); } catch (e) {}
        }
        // Send over Cloud HTTPS/WSS Relay (throttled for heartbeat, immediate for events)
        if (this.currentRoomTopic) {
            const now = Date.now();
            if (packet.immediate || !this.lastCloudPostTs || (now - this.lastCloudPostTs > 2000)) {
                this.lastCloudPostTs = now;
                try {
                    fetch(`https://ntfy.sh/${this.currentRoomTopic}`, {
                        method: 'POST',
                        body: JSON.stringify(packet)
                    }).catch(() => {});
                } catch (e) {}
            }
        }
    };

    proto.broadcastMyRoomState = function (immediate = false) {
        if (!this.activeDuelChallenge || !this.activeDuelChallenge.isRoomDuel) return;
        const me = this.roomPlayers.get(this.myPlayerId);
        if (!me) return;

        me.nickname = this.duelMyNickname;
        me.avatar = this.myAvatar;
        me.rankedPoints = this.myRankedPoints;
        me.roundIndex = this.activeDuelChallenge.roundIndex;
        me.guessesCount = this.guesses.length;
        me.unlockedClues = this.unlockedClues;
        me.finished = this.isGameOver;
        me.won = this.gameWon;
        me.timeSec = this.elapsedSeconds;

        this.sendDuelPacket({
            type: 'ROOM_STATE_SYNC',
            immediate,
            roomCode: this.activeDuelChallenge.roomCode,
            arenaMode: this.activeDuelChallenge.arenaMode,
            player: { ...me, isMe: false }
        });
    };

    // Override broadcastDuelProgress called from submitGuess & handleGameEnd
    proto.broadcastDuelProgress = function (finished, won = false) {
        if (!this.activeDuelChallenge) return;

        if (this.activeDuelChallenge.isRoomDuel) {
            const me = this.roomPlayers.get(this.myPlayerId);
            if (me) {
                me.guessesCount = this.guesses.length;
                me.finished = finished;
                me.won = won;
                me.timeSec = this.elapsedSeconds;
                if (finished && !me.roundScoredForRound) {
                    me.roundScoredForRound = true;
                    const pts = calculateCasePoints(won, this.guesses.length, this.elapsedSeconds);
                    me.roundScore = pts;
                    me.totalScore = (me.totalScore || 0) + pts;
                }
            }
            this.broadcastMyRoomState(true);
            this.renderLiveArenaStrip();
            this.updateRoundLockButtons();
        }
    };

    proto.handleIncomingDuelMessage = function (data) {
        if (!data || !this.activeDuelChallenge) return;

        if (data.type === 'ROOM_STATE_SYNC' && data.player && data.player.playerId !== this.myPlayerId) {
            const inc = data.player;
            const prev = this.roomPlayers.get(inc.playerId);
            const isNewJoiner = !prev;
            const justFinished = prev && !prev.finished && inc.finished && inc.roundIndex === this.activeDuelChallenge.roundIndex;

            this.roomPlayers.set(inc.playerId, {
                ...(prev || {}),
                ...inc,
                isMe: false
            });

            if (isNewJoiner) {
                this.showToast(`🎉 ${inc.nickname} odaya katıldı!`);
                // Immediately send back our state so the joiner sees us right away
                this.broadcastMyRoomState(true);
            }

            if (justFinished) {
                this.playTone(inc.won ? 'warm' : 'cold');
                this.showToast(inc.won ?
                    `⚡ ${inc.nickname} vakayı ${inc.guessesCount}. tahminde çözdü! (+${inc.roundScore || 0} Puan)` :
                    `😮 ${inc.nickname} bu vakayı çözemedi (0 Puan)!`);
            }

            this.renderLiveArenaStrip();
            this.updateRoundLockButtons();
            if (this.isGameOver) {
                this.CheckTournamentEliminationAndRenderPodium();
            }
        } else if (data.type === 'ADVANCE_ROUND' && data.nextRoundIndex !== undefined) {
            if (data.nextRoundIndex > this.activeDuelChallenge.roundIndex) {
                this.closeModal(this.dom.resultModal);
                this.launchArenaRound(data.nextRoundIndex);
            }
        } else if (data.type === 'EMOTE' && data.playerId !== this.myPlayerId) {
            this.showToast(`💬 ${data.nickname}: ${data.emoteText}`);
        }
    };

    proto.launchArenaRound = function (roundIdx) {
        if (!this.activeDuelChallenge || !this.activeDuelChallenge.isRoomDuel) return;
        const ch = this.activeDuelChallenge;
        ch.roundIndex = roundIdx;

        // Reset round state for all players
        this.roomPlayers.forEach(p => {
            p.roundIndex = roundIdx;
            p.guessesCount = 0;
            p.finished = false;
            p.won = false;
            p.roundScore = 0;
            p.timeSec = 0;
            p.roundScoredForRound = false;
        });

        const currentCase = ch.roomCases[roundIdx % ch.roomCases.length];
        const modeTitles = {
            duel: `⚔️ Canlı Düello (${ch.roomCode}) • Vaka ${roundIdx + 1}/${ch.totalRounds}`,
            ffa: `🏟️ Free-For-All (${ch.roomCode}) • Vaka ${roundIdx + 1}/${ch.totalRounds}`,
            tournament: `🏆 Turnuva (${ch.roomCode}) • ${roundIdx === 0 ? 'Çeyrek Final' : (roundIdx === 1 ? 'Yarı Final' : 'BÜYÜK FİNAL')} (Vaka ${roundIdx + 1}/${ch.totalRounds})`
        };

        if (this.dom.duelHudBanner) {
            this.dom.duelHudBanner.style.display = 'flex';
        }

        const me = this.roomPlayers.get(this.myPlayerId);
        this.startCase(currentCase, modeTitles[ch.arenaMode] || modeTitles.duel);

        if (me && me.eliminated) {
            this.showToast("🚑 Turnuvada elendiniz, bu turu izleyici (Gözlemci Klinisyen) olarak takip ediyorsunuz!");
            this.giveUp();
        }

        this.startFunnyBotSimulationForRound(roundIdx);
        this.renderLiveArenaStrip();
        this.updateRoundLockButtons();
        this.broadcastMyRoomState(true);
    };

    proto.startFunnyBotSimulationForRound = function (roundIdx) {
        if (this.botSimulationTimer) clearInterval(this.botSimulationTimer);
        const bots = [...this.roomPlayers.values()].filter(p => p.isBot && !p.eliminated);
        if (bots.length === 0) return;

        bots.forEach(b => {
            b.targetFinishSec = Math.floor(8 + Math.random() * 18);
            b.targetGuesses = Math.floor(1 + Math.random() * 5);
            b.targetWon = Math.random() > 0.15;
        });

        this.botSimulationTimer = setInterval(() => {
            if (!this.activeDuelChallenge || this.activeDuelChallenge.roundIndex !== roundIdx) {
                clearInterval(this.botSimulationTimer);
                return;
            }
            let changed = false;
            bots.forEach(b => {
                if (b.finished) return;
                b.timeSec = this.elapsedSeconds;
                const expectedGuess = Math.min(b.targetGuesses, Math.max(1, Math.floor(this.elapsedSeconds / 4)));
                if (expectedGuess !== b.guessesCount) {
                    b.guessesCount = expectedGuess;
                    changed = true;
                }
                if (this.elapsedSeconds >= b.targetFinishSec) {
                    b.finished = true;
                    b.won = b.targetWon;
                    b.guessesCount = b.targetWon ? b.targetGuesses : 6;
                    b.roundScore = calculateCasePoints(b.won, b.guessesCount, b.timeSec);
                    b.totalScore = (b.totalScore || 0) + b.roundScore;
                    changed = true;
                    this.showToast(b.won ?
                        `🤖 ${b.nickname} vakayı ${b.guessesCount}. ipucunda çözdü! (+${b.roundScore} Puan)` :
                        `🤖 ${b.nickname} vakayı yanlış teşhis etti (0 Puan)!`);
                }
            });
            if (changed) {
                this.renderLiveArenaStrip();
                this.updateRoundLockButtons();
                if (this.isGameOver) {
                    this.CheckTournamentEliminationAndRenderPodium();
                }
            }
        }, 1500);
    };

    // --- Strict Round Lock Check ---
    proto.areAllActivePlayersFinished = function () {
        if (!this.activeDuelChallenge || !this.activeDuelChallenge.isRoomDuel) return true;
        const activePlayers = [...this.roomPlayers.values()].filter(p => !p.eliminated);
        if (activePlayers.length < 2) return false; // Wait for at least 1 opponent in online room
        return activePlayers.every(p => p.finished && p.roundIndex === this.activeDuelChallenge.roundIndex);
    };

    proto.getFinishedCountStatus = function () {
        const activePlayers = [...this.roomPlayers.values()].filter(p => !p.eliminated);
        const doneCount = activePlayers.filter(p => p.finished && p.roundIndex === this.activeDuelChallenge.roundIndex).length;
        return { doneCount, totalCount: activePlayers.length };
    };

    proto.updateRoundLockButtons = function () {
        if (!this.activeDuelChallenge || !this.activeDuelChallenge.isRoomDuel) return;
        const btnModalNext = document.getElementById('btnNextPractice');
        const btnMainNext = this.dom.btnMainNextCase;
        const { doneCount, totalCount } = this.getFinishedCountStatus();
        const allDone = this.areAllActivePlayersFinished();

        const isLastRound = (this.activeDuelChallenge.roundIndex + 1) >= this.activeDuelChallenge.totalRounds;
        let label = '';
        if (totalCount < 2) {
            label = `⏳ Rakibin Odaya Katılması Bekleniyor... (Oda: ${this.activeDuelChallenge.roomCode})`;
        } else if (!allDone) {
            label = `⏳ Rakiplerin Çözmesi Bekleniyor (${doneCount}/${totalCount} Tamamladı)`;
        } else if (isLastRound) {
            label = `🏆 Maç Tamamlandı! Yeni Lobi / Pratik Moduna Dön`;
        } else {
            label = `🚀 Herkes Tamamladı! Sıradaki Vakaya Geç (${this.activeDuelChallenge.roundIndex + 2}/${this.activeDuelChallenge.totalRounds}) ➔`;
        }

        [btnModalNext, btnMainNext].forEach(btn => {
            if (!btn) return;
            btn.textContent = label;
            btn.disabled = !allDone;
            btn.style.opacity = allDone ? '1' : '0.65';
            btn.style.cursor = allDone ? 'pointer' : 'not-allowed';
        });
    };

    // Override nextRoomDuelCase to enforce strict synchronization
    proto.nextRoomDuelCase = function () {
        if (!this.activeDuelChallenge || !this.activeDuelChallenge.isRoomDuel) return;

        if (!this.areAllActivePlayersFinished()) {
            const { doneCount, totalCount } = this.getFinishedCountStatus();
            this.showToast(`⏳ Karşı taraf henüz vakayı bitirmedi! (${doneCount}/${totalCount} oyuncu tamamladı)`);
            return;
        }

        const nextIdx = this.activeDuelChallenge.roundIndex + 1;
        if (nextIdx >= this.activeDuelChallenge.totalRounds) {
            this.exitDuelMode();
            return;
        }

        this.sendDuelPacket({
            type: 'ADVANCE_ROUND',
            immediate: true,
            nextRoundIndex: nextIdx
        });
        this.launchArenaRound(nextIdx);
    };

    // Live Multi-Player Interactive Strip in HUD Banner
    proto.renderLiveArenaStrip = function () {
        if (!this.dom.duelHudBanner || !this.activeDuelChallenge) return;
        const ch = this.activeDuelChallenge;
        if (!ch.isRoomDuel) return;

        const players = [...this.roomPlayers.values()].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
        const modeBadgeMap = {
            duel: '⚔️ 1v1 CANLI DÜELLO',
            ffa: '🏟️ FREE-FOR-ALL (HERKES TEK)',
            tournament: '🏆 ELEMELİ TURNUVA'
        };

        let cardsHTML = '';
        players.forEach(p => {
            let statusBadge = '';
            let borderCol = 'rgba(255,255,255,0.16)';
            if (p.eliminated) {
                statusBadge = `<span style="color:#f43f5e; font-weight:800;">🚑 Elendi</span>`;
                borderCol = 'rgba(244,63,94,0.35)';
            } else if (p.finished && p.roundIndex === ch.roundIndex) {
                if (p.won) {
                    statusBadge = `<span style="color:#34d399; font-weight:800;">✅ ${p.guessesCount}. İpucunda Bildi (+${p.roundScore}P)</span>`;
                    borderCol = '#10b981';
                } else {
                    statusBadge = `<span style="color:#fb7185; font-weight:800;">❌ Çözemedi (0P)</span>`;
                    borderCol = '#f43f5e';
                }
            } else {
                statusBadge = `<span style="color:#fbbf24; font-weight:700;">🤔 ${(p.guessesCount || 0) + 1}. İpucunda Düşünüyor...</span>`;
                borderCol = p.isMe ? '#6366f1' : 'rgba(251,191,36,0.4)';
            }

            cardsHTML += `
                <div style="display:flex; align-items:center; gap:0.55rem; background:rgba(15,23,42,0.8); border:1.5px solid ${borderCol}; border-radius:12px; padding:0.38rem 0.7rem; min-width:195px; transition:all 0.25s ease;">
                    ${renderFunnyAvatarSVG(p.avatar, 36)}
                    <div style="flex:1; min-width:0;">
                        <div style="font-size:0.8rem; font-weight:800; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                            ${p.nickname} ${p.isMe ? '(Sen)' : ''}
                        </div>
                        <div style="font-size:0.71rem;">${statusBadge}</div>
                    </div>
                    <div style="text-align:right; font-family:var(--font-mono); font-weight:900; font-size:0.9rem; color:#38bdf8;">
                        ${p.totalScore || 0}P
                    </div>
                </div>
            `;
        });

        const inviteUrl = `${window.location.origin}${window.location.pathname}#room=${ch.roomCode}`;
        this.dom.duelHudBanner.innerHTML = `
            <div style="width:100%; display:flex; flex-direction:column; gap:0.55rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                    <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                        <span style="background:linear-gradient(135deg,#e11d48,#7c3aed); color:#fff; font-size:0.72rem; font-weight:900; padding:0.25rem 0.65rem; border-radius:99px; letter-spacing:0.6px;">
                            ${modeBadgeMap[ch.arenaMode] || '⚔️ CANLI ARENA'}
                        </span>
                        <span style="font-family:var(--font-mono); font-size:0.84rem; font-weight:900; color:#fda4af; background:rgba(244,63,94,0.15); padding:0.2rem 0.55rem; border-radius:8px; border:1px dashed #fb7185;">
                            Oda Kodu: ${ch.roomCode}
                        </span>
                        <span style="font-size:0.8rem; font-weight:800; color:#e2e8f0;">
                            Vaka ${ch.roundIndex + 1} / ${ch.totalRounds}
                        </span>
                        <button type="button" id="btnHudCopyInvite" class="btn-secondary" style="padding:0.2rem 0.55rem; font-size:0.72rem;">🔗 Davet Linkini Kopyala</button>
                        <button type="button" id="btnHudSendEmote" class="btn-secondary" style="padding:0.2rem 0.55rem; font-size:0.72rem;">☕ Emoji Gönder</button>
                    </div>
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                        <div class="duel-timer-pill">⏱️ <span id="duelTimerText">${String(Math.floor(this.elapsedSeconds / 60)).padStart(2, '0')}:${String(this.elapsedSeconds % 60).padStart(2, '0')}</span></div>
                        <button class="btn-secondary" id="btnExitDuel" style="padding: 0.28rem 0.6rem; font-size: 0.74rem;">✕ Çık</button>
                    </div>
                </div>
                <div style="display:flex; gap:0.5rem; overflow-x:auto; padding-bottom:2px;">
                    ${cardsHTML}
                </div>
            </div>
        `;

        this.dom.duelTimerText = document.getElementById('duelTimerText');
        const btnCopy = document.getElementById('btnHudCopyInvite');
        if (btnCopy) {
            btnCopy.onclick = () => {
                navigator.clipboard.writeText(inviteUrl);
                this.showToast(`🔗 Oda davet linki (#${ch.roomCode}) kopyalandı! Arkadaşlarına gönder!`);
            };
        }
        const btnEmote = document.getElementById('btnHudSendEmote');
        if (btnEmote) {
            btnEmote.onclick = () => {
                const emotes = ['☕ Acil kafein lazım!', '🧠 Beynim yandı!', '🧐 DSM-5-TR kriteri çok net!', '⚡ İlk ipucundan buldum!', '🤪 Bu hasta kesin organik!'];
                const pick = emotes[Math.floor(Math.random() * emotes.length)];
                this.sendDuelPacket({ type: 'EMOTE', immediate: true, playerId: this.myPlayerId, nickname: this.duelMyNickname, emoteText: pick });
                this.showToast(`💬 Gönderildi: "${pick}"`);
            };
        }
        const btnExit = document.getElementById('btnExitDuel');
        if (btnExit) {
            btnExit.onclick = () => this.exitDuelMode();
        }
    };

    proto.CheckTournamentEliminationAndRenderPodium = function () {
        if (!this.activeDuelChallenge) return;
        const ch = this.activeDuelChallenge;

        if (ch.isRoomDuel && this.areAllActivePlayersFinished()) {
            const roundKey = `scored_round_${ch.roundIndex}`;
            if (!ch[roundKey]) {
                ch[roundKey] = true;

                // Tournament elimination rule: lowest scorer of the round gets eliminated if > 2 players remain
                if (ch.arenaMode === 'tournament') {
                    const active = [...this.roomPlayers.values()].filter(p => !p.eliminated);
                    if (active.length > 2) {
                        active.sort((a, b) => (a.roundScore - b.roundScore) || (b.timeSec - a.timeSec));
                        const eliminatedPlayer = active[0];
                        eliminatedPlayer.eliminated = true;
                        this.showToast(`🚑 Turnuva Elemesi: ${eliminatedPlayer.nickname} en düşük puanla nöbete gönderildi (elendi)!`);
                    }
                }

                // Award Ranked Points on final round completion or per-round win
                const standings = [...this.roomPlayers.values()].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
                const myRank = standings.findIndex(p => p.playerId === this.myPlayerId) + 1;
                const isFinalRound = (ch.roundIndex + 1) >= ch.totalRounds;

                if (isFinalRound) {
                    if (myRank === 1) {
                        const bonus = ch.arenaMode === 'tournament' ? 75 : (ch.arenaMode === 'ffa' ? 50 : 35);
                        this.addRankedPoints(bonus, `${ch.arenaMode.toUpperCase()} Şampiyonluğu`);
                    } else if (myRank === 2 && standings.length > 2) {
                        this.addRankedPoints(20, `İkincilik Ödülü`);
                    } else {
                        this.addRankedPoints(5, `Maç Tamamlama`);
                    }
                }
            }
        }

        this.renderDuelPodium(this.gameWon);
        this.updateRoundLockButtons();
    };

    // Override renderDuelPodium to show Multi-Player Standings, Guess Points, and Add Friend buttons
    proto.renderDuelPodium = function (won) {
        const podiumEl = document.getElementById('duelPodiumBox');
        if (!podiumEl) return;

        if (!this.activeDuelChallenge) {
            podiumEl.style.display = 'none';
            return;
        }

        podiumEl.style.display = 'block';
        const ch = this.activeDuelChallenge;

        if (!ch.isRoomDuel) {
            // Asynchronous Single-Case Link Duel
            const myPts = calculateCasePoints(won, this.guesses.length, this.elapsedSeconds);
            const oppGuesses = ch.challengerGuesses;
            const oppTime = ch.challengerTimeSec || 30;
            const oppPts = oppGuesses && oppGuesses <= 6 ? calculateCasePoints(true, oppGuesses, oppTime) : 0;
            const oppName = ch.challengerName || 'Rakip Klinisyen';

            let verdict = `<span style="color:#fbbf24;">⚔️ Skorunuz hazır! Linki arkadaşınıza gönderin!</span>`;
            if (oppGuesses) {
                if (myPts > oppPts) {
                    verdict = `<span style="color:#34d399; font-weight:900;">🏆 DÜELLOYU KAZANDINIZ! (${myPts} Puan vs ${oppPts} Puan)</span>`;
                } else if (myPts < oppPts) {
                    verdict = `<span style="color:#fb7185; font-weight:900;">⚔️ Bu vakayı ${oppName} kazandı! (${oppPts} Puan vs ${myPts} Puan)</span>`;
                } else {
                    verdict = `<span style="color:#38bdf8; font-weight:900;">🤝 TAM BERABERLİK! (${myPts} Puan)</span>`;
                }
            }

            podiumEl.innerHTML = `
                <div style="font-size:0.78rem; font-weight:800; text-transform:uppercase; color:#fda4af;">⚔️ Vaka Düello Karşılaştırması (Az Tahmin = Yüksek Puan)</div>
                <div style="margin:0.35rem 0 0.65rem;">${verdict}</div>
                <div style="display:grid; grid-template-columns:1fr auto 1fr; gap:0.65rem; align-items:center;">
                    <div style="background:var(--bg-secondary); padding:0.7rem; border-radius:10px; border:1px solid #10b981;">
                        <div style="font-weight:800; color:#34d399;">${this.duelMyNickname} (Sen)</div>
                        <div style="font-size:0.84rem; margin-top:4px;">${won ? `${this.guesses.length}. İpucunda Bildi` : 'Çözemedi'} • <strong>${myPts} Puan</strong></div>
                    </div>
                    <div class="duel-vs-badge">VS</div>
                    <div style="background:var(--bg-secondary); padding:0.7rem; border-radius:10px; border:1px solid #f43f5e;">
                        <div style="font-weight:800; color:#fda4af;">${oppName}</div>
                        <div style="font-size:0.84rem; margin-top:4px;">${oppGuesses ? `${oppGuesses}. İpucunda • <strong>${oppPts} Puan</strong>` : 'Bekleniyor...'}</div>
                    </div>
                </div>
            `;
            return;
        }

        // Live Room Duel / Free-For-All / Tournament Multi-Player Standings Table
        const allDone = this.areAllActivePlayersFinished();
        const { doneCount, totalCount } = this.getFinishedCountStatus();
        const players = [...this.roomPlayers.values()].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));

        let headerStatus = '';
        if (totalCount < 2) {
            headerStatus = `<span style="color:#fbbf24;">⏳ Odaya (${ch.roomCode}) arkadaşınızın katılması bekleniyor...</span>`;
        } else if (!allDone) {
            headerStatus = `<span style="color:#fbbf24;">⏳ Karşı tarafın vakayı tamamlaması bekleniyor (${doneCount}/${totalCount} Tamamladı) — Herkes bitirmeden sıradaki vakaya geçilemez!</span>`;
        } else {
            const leader = players[0];
            headerStatus = `<span style="color:#34d399; font-weight:900;">🎉 Tüm oyuncular vakayı tamamladı! Lider: ${leader.nickname} (${leader.totalScore} Puan)</span>`;
        }

        let rowsHTML = '';
        players.forEach((p, idx) => {
            const st = (p.finished && p.roundIndex === ch.roundIndex) ?
                (p.won ? `✅ ${p.guessesCount}. İpucunda (+${p.roundScore}P • ${p.timeSec}sn)` : `❌ Çözemedi (+0P)`) :
                `⏳ Çözüyor (${(p.guessesCount || 0) + 1}. İpucunda...)`;

            rowsHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-secondary); padding:0.55rem 0.8rem; border-radius:10px; border:1px solid ${p.isMe ? '#10b981' : 'var(--border-color)'}; gap:0.5rem;">
                    <div style="display:flex; align-items:center; gap:0.6rem;">
                        <strong style="width:22px; color:#fbbf24;">#${idx + 1}</strong>
                        ${renderFunnyAvatarSVG(p.avatar, 36)}
                        <div style="text-align:left;">
                            <div style="font-size:0.86rem; font-weight:800; color:var(--text-primary);">
                                ${p.nickname} ${p.isMe ? '(Sen)' : ''} ${p.eliminated ? '<span style="color:#f43f5e;">(Elendi)</span>' : ''}
                            </div>
                            <div style="font-size:0.74rem; color:var(--text-secondary);">${st}</div>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                        <span style="font-family:var(--font-mono); font-weight:900; font-size:0.95rem; color:#38bdf8;">${p.totalScore || 0} Puan</span>
                        ${!p.isMe ? `<button type="button" class="btn-secondary btn-podium-friend" data-pid="${p.playerId}" style="padding:0.25rem 0.5rem; font-size:0.72rem;" title="Arkadaş Ekle">➕ Arkadaş Ekle</button>` : ''}
                    </div>
                </div>
            `;
        });

        podiumEl.innerHTML = `
            <div style="font-size:0.78rem; font-weight:800; text-transform:uppercase; color:#fda4af; letter-spacing:0.6px;">
                🏆 Canlı Puan Tablosu • Vaka ${ch.roundIndex + 1}/${ch.totalRounds} (1. Tahmin=100P, 2.=85P, 3.=70P...)
            </div>
            <div style="margin:0.35rem 0 0.65rem; font-size:0.86rem;">${headerStatus}</div>
            <div style="display:flex; flex-direction:column; gap:0.45rem;">
                ${rowsHTML}
            </div>
        `;

        podiumEl.querySelectorAll('.btn-podium-friend').forEach(btn => {
            btn.onclick = () => {
                const p = this.roomPlayers.get(btn.dataset.pid);
                if (p) this.addPlayerToFriends(p);
            };
        });
    };

    const origStartMM = proto.startMatchmaking;
    proto.startMatchmaking = function () {
        if (origStartMM) origStartMM.call(this);
        if (this.mmGlobalInterval) clearInterval(this.mmGlobalInterval);
        const sendSeek = () => {
            if (!this.isMatchmaking) return;
            this.sendGlobalPresencePacket({
                type: 'MM_GLOBAL_SEEK',
                playerId: this.myPlayerId,
                mode: this.selectedArenaMode || 'duel',
                playerSummary: this.getMyPlayerSummary()
            });
        };
        sendSeek();
        this.mmGlobalInterval = setInterval(sendSeek, 3000);
    };

    const origCancelMM = proto.cancelMatchmaking;
    proto.cancelMatchmaking = function (notify = true) {
        if (this.mmGlobalInterval) {
            clearInterval(this.mmGlobalInterval);
            this.mmGlobalInterval = null;
        }
        if (origCancelMM) origCancelMM.call(this, notify);
    };

    const origExit = proto.exitDuelMode;
    proto.exitDuelMode = function () {
        this.cleanupArenaConnections();
        if (origExit) origExit.call(this);
    };
}
