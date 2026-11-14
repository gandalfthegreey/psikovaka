/**
 * PsikoVaka 3.0 - İnteraktif Online Arena, Turnuva, Free-For-All,
 * Komik Karakter Avatar Stüdyosu, Arkadaş Sistemi ve Top 10 Ranked Motoru
 */

const FUNNY_AVATAR_PARTS = {
    bgColors: [
        { id: 'bg_indigo', name: 'Gece Nöbeti Moru', grad: 'linear-gradient(135deg, #4f46e5, #7c3aed)' },
        { id: 'bg_emerald', name: 'Acil Servis Yeşili', grad: 'linear-gradient(135deg, #059669, #10b981)' },
        { id: 'bg_rose', name: 'Adrenalin Pembesi', grad: 'linear-gradient(135deg, #e11d48, #fb7185)' },
        { id: 'bg_amber', name: 'Kafein Altını', grad: 'linear-gradient(135deg, #d97706, #fbbf24)' },
        { id: 'bg_cyan', name: 'Buzul Sakinliği', grad: 'linear-gradient(135deg, #0284c7, #38bdf8)' },
        { id: 'bg_ cosmic', name: 'Freud Rüyası', grad: 'linear-gradient(135deg, #9333ea, #ec4899)' }
    ],
    skinTones: [
        { id: 'skin_warm', name: 'Klasik Ten', fill: '#fcd34d', cheek: '#fb7185' },
        { id: 'skin_light', name: 'Nöbet Solgunu', fill: '#fde68a', cheek: '#f43f5e' },
        { id: 'skin_tan', name: 'Kongre Bronzu', fill: '#d97706', cheek: '#ef4444' },
        { id: 'skin_alien', name: 'Uzaylı Yeşili', fill: '#4ade80', cheek: '#10b981' },
        { id: 'skin_zombie', name: '72 Saat Uykusuz Mor', fill: '#c4b5fd', cheek: '#8b5cf6' },
        { id: 'skin_robot', name: 'Sibernetik Mavi', fill: '#7dd3fc', cheek: '#0284c7' }
    ],
    hats: [
        { id: 'hat_einstein', name: '⚡ Çılgın Profesör Saçı' },
        { id: 'hat_brain', name: '🧠 Açıkta Zonklayan Beyin' },
        { id: 'hat_funnel', name: '🎩 Parlak Huni Şapka' },
        { id: 'hat_freud', name: '🕵️ Freud Fötr Şapkası' },
        { id: 'hat_coffee', name: '☕ Çift Kafein Serumu Kaskı' },
        { id: 'hat_clown', name: '🤡 Gökkuşağı Peruk' },
        { id: 'hat_crown', name: '👑 Altın Başhekim Tacı' },
        { id: 'hat_scrub', name: '🩺 Cerrahi Bone & Ayna' }
    ],
    eyes: [
        { id: 'eye_hypno', name: '😵‍💫 Hipnoz Sarmal Gözler' },
        { id: 'eye_ sleepless', name: '👀 72 Saat Nöbet Gözleri' },
        { id: 'eye_monocle', name: '🧐 Dev Büyüteç Monokl' },
        { id: 'eye_cool', name: '😎 Havalı Güneş Gözlüğü' },
        { id: 'eye_nerd', name: '🤓 Şişe Dibi Gözlük' },
        { id: 'eye_wink', name: '😜 Çapkın Göz Kırpma' }
    ],
    mouths: [
        { id: 'mouth_freud', name: '🧔 Freud Sakalı & Pipo' },
        { id: 'mouth_tongue', name: '🤪 Dili Dışarıda Çılgın' },
        { id: 'mouth_mustache', name: '🥸 Burulmuş Dali Bıyığı' },
        { id: 'mouth_coffee_jitters', name: '😬 Kafein Titremesi Dişler' },
        { id: 'mouth_thermometer', name: '🌡️ Ağzında Derece' },
        { id: 'mouth_laugh', name: '😂 Kahkaha Atan Ağız' }
    ],
    props: [
        { id: 'prop_steth', name: '🩺 Altın Stetoskop' },
        { id: 'prop_coffee', name: '☕ Dev "Acil Espresso" Kupası' },
        { id: 'prop_dsm', name: '📕 10 Kiloluk DSM-5-TR' },
        { id: 'prop_bowtie', name: '🎀 Doktor Papyonu' },
        { id: 'prop_hypno', name: '🕰️ Sallanan Hipnoz Saati' }
    ]
};

const RANKED_TIERS = [
    { min: 0, max: 199, name: 'Stajyer Klinisyen', icon: '🥉', color: '#94a3b8' },
    { min: 200, max: 449, name: 'Asistan Doktor', icon: '🥈', color: '#38bdf8' },
    { min: 450, max: 799, name: 'Uzman Psikiyatrist', icon: '🥇', color: '#34d399' },
    { min: 800, max: 1199, name: 'Doçent Doktor', icon: '💎', color: '#a855f7' },
    { min: 1200, max: 1699, name: 'Profesör / Klinik Şefi', icon: '👑', color: '#fbbf24' },
    { min: 1700, max: 999999, name: 'Freud Efsanesi (Grandmaster)', icon: '🔥', color: '#f43f5e' }
];

const FUNNY_BOT_PROFILES = [
    {
        id: 'bot_sigmund',
        nickname: 'Dr. SigmundPipo',
        rankedPoints: 1320,
        wins: 48,
        avgGuesses: 2.1,
        avatar: { bg: 'bg_ cosmic', skin: 'skin_warm', hat: 'hat_freud', eye: 'eye_monocle', mouth: 'mouth_freud', prop: 'prop_hypno' }
    },
    {
        id: 'bot_kafein',
        nickname: 'Uzm.Dr.KafeinKomasi',
        rankedPoints: 1090,
        wins: 39,
        avgGuesses: 2.4,
        avatar: { bg: 'bg_amber', skin: 'skin_light', hat: 'hat_coffee', eye: 'eye_ sleepless', mouth: 'mouth_coffee_jitters', prop: 'prop_coffee' }
    },
    {
        id: 'bot_huni',
        nickname: 'Prof.HuniliKlinisyen',
        rankedPoints: 940,
        wins: 31,
        avgGuesses: 2.6,
        avatar: { bg: 'bg_indigo', skin: 'skin_alien', hat: 'hat_funnel', eye: 'eye_hypno', mouth: 'mouth_tongue', prop: 'prop_dsm' }
    },
    {
        id: 'bot_nobetci',
        nickname: 'Asist.Dr.Uykusuz36Saat',
        rankedPoints: 760,
        wins: 27,
        avgGuesses: 2.8,
        avatar: { bg: 'bg_rose', skin: 'skin_zombie', hat: 'hat_einstein', eye: 'eye_ sleepless', mouth: 'mouth_thermometer', prop: 'prop_coffee' }
    },
    {
        id: 'bot_nöron',
        nickname: 'Doç.Dr.SinapsYakıcı',
        rankedPoints: 1480,
        wins: 54,
        avgGuesses: 1.9,
        avatar: { bg: 'bg_emerald', skin: 'skin_robot', hat: 'hat_brain', eye: 'eye_cool', mouth: 'mouth_mustache', prop: 'prop_steth' }
    },
    {
        id: 'bot_dsm',
        nickname: 'Dr.AyırıcıTanıCanavarı',
        rankedPoints: 620,
        wins: 21,
        avgGuesses: 3.1,
        avatar: { bg: 'bg_cyan', skin: 'skin_tan', hat: 'hat_scrub', eye: 'eye_nerd', mouth: 'mouth_laugh', prop: 'prop_dsm' }
    },
    {
        id: 'bot_bashekim',
        nickname: 'Başhekim_Dopamin',
        rankedPoints: 1750,
        wins: 67,
        avgGuesses: 1.7,
        avatar: { bg: 'bg_amber', skin: 'skin_warm', hat: 'hat_crown', eye: 'eye_cool', mouth: 'mouth_mustache', prop: 'prop_bowtie' }
    },
    {
        id: 'bot_palyaco',
        nickname: 'Stj.Dr.Plasebo',
        rankedPoints: 340,
        wins: 12,
        avgGuesses: 3.5,
        avatar: { bg: 'bg_rose', skin: 'skin_light', hat: 'hat_clown', eye: 'eye_wink', mouth: 'mouth_tongue', prop: 'prop_steth' }
    }
];

function renderFunnyAvatarSVG(avatarCfg = {}, size = 56) {
    const bgObj = FUNNY_AVATAR_PARTS.bgColors.find(x => x.id === avatarCfg.bg) || FUNNY_AVATAR_PARTS.bgColors[0];
    const skinObj = FUNNY_AVATAR_PARTS.skinTones.find(x => x.id === avatarCfg.skin) || FUNNY_AVATAR_PARTS.skinTones[0];
    const hat = avatarCfg.hat || 'hat_einstein';
    const eye = avatarCfg.eye || 'eye_hypno';
    const mouth = avatarCfg.mouth || 'mouth_tongue';
    const prop = avatarCfg.prop || 'prop_steth';

    let hatSVG = '';
    if (hat === 'hat_einstein') {
        hatSVG = `<path d="M12 36 Q4 18 22 22 Q28 6 44 18 Q56 4 70 18 Q88 6 92 24 Q108 20 98 38 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>`;
    } else if (hat === 'hat_brain') {
        hatSVG = `<g><ellipse cx="55" cy="22" rx="28" ry="15" fill="#fb7185" stroke="#be123c" stroke-width="2.5"/><path d="M35 22 Q45 12 55 22 Q65 12 75 22 M42 15 Q55 28 68 15" fill="none" stroke="#881337" stroke-width="2.5" stroke-linecap="round"/></g>`;
    } else if (hat === 'hat_funnel') {
        hatSVG = `<g><polygon points="28,28 55,2 82,28" fill="#cbd5e1" stroke="#475569" stroke-width="2.5"/><rect x="51" y="-4" width="8" height="10" fill="#94a3b8" stroke="#475569" stroke-width="2"/></g>`;
    } else if (hat === 'hat_freud') {
        hatSVG = `<g><ellipse cx="55" cy="27" rx="38" ry="7" fill="#451a03"/><path d="M30 27 Q35 6 55 9 Q75 6 80 27 Z" fill="#78350f" stroke="#451a03" stroke-width="2"/><rect x="31" y="21" width="48" height="4" fill="#d97706"/></g>`;
    } else if (hat === 'hat_coffee') {
        hatSVG = `<g><path d="M26 30 A29 22 0 0 1 84 30 Z" fill="#ef4444" stroke="#991b1b" stroke-width="2"/><rect x="12" y="14" width="12" height="18" rx="3" fill="#78350f" stroke="#fde68a" stroke-width="1.5"/><rect x="86" y="14" width="12" height="18" rx="3" fill="#78350f" stroke="#fde68a" stroke-width="1.5"/></g>`;
    } else if (hat === 'hat_clown') {
        hatSVG = `<g><circle cx="26" cy="26" r="14" fill="#ef4444"/><circle cx="44" cy="16" r="15" fill="#eab308"/><circle cx="66" cy="16" r="15" fill="#3b82f6"/><circle cx="84" cy="26" r="14" fill="#a855f7"/></g>`;
    } else if (hat === 'hat_crown') {
        hatSVG = `<polygon points="26,28 32,8 46,20 55,4 64,20 78,8 84,28" fill="#fbbf24" stroke="#b45309" stroke-width="2.5"/><circle cx="55" cy="12" r="3.5" fill="#ef4444"/>`;
    } else if (hat === 'hat_scrub') {
        hatSVG = `<g><path d="M25 30 Q55 8 85 30 Z" fill="#14b8a6" stroke="#0f766e" stroke-width="2"/><circle cx="55" cy="22" r="8" fill="#e2e8f0" stroke="#475569" stroke-width="2"/><circle cx="55" cy="22" r="3" fill="#38bdf8"/></g>`;
    }

    let eyeSVG = '';
    if (eye === 'eye_hypno') {
        eyeSVG = `<g><circle cx="41" cy="48" r="10" fill="#fff" stroke="#1e293b" stroke-width="2"/><circle cx="41" cy="48" r="5" fill="none" stroke="#e11d48" stroke-width="2" stroke-dasharray="4 2"/><circle cx="41" cy="48" r="2" fill="#1e293b"/><circle cx="69" cy="48" r="10" fill="#fff" stroke="#1e293b" stroke-width="2"/><circle cx="69" cy="48" r="5" fill="none" stroke="#4f46e5" stroke-width="2" stroke-dasharray="4 2"/><circle cx="69" cy="48" r="2" fill="#1e293b"/></g>`;
    } else if (eye === 'eye_ sleepless') {
        eyeSVG = `<g><ellipse cx="41" cy="51" rx="11" ry="6" fill="#7e22ce" opacity="0.45"/><ellipse cx="69" cy="51" rx="11" ry="6" fill="#7e22ce" opacity="0.45"/><circle cx="41" cy="47" r="10" fill="#fff" stroke="#dc2626" stroke-width="2"/><circle cx="41" cy="47" r="3" fill="#0f172a"/><circle cx="69" cy="47" r="10" fill="#fff" stroke="#dc2626" stroke-width="2"/><circle cx="69" cy="47" r="3" fill="#0f172a"/></g>`;
    } else if (eye === 'eye_monocle') {
        eyeSVG = `<g><circle cx="41" cy="48" r="6" fill="#fff" stroke="#1e293b" stroke-width="2"/><circle cx="41" cy="48" r="2.5" fill="#0f172a"/><circle cx="69" cy="47" r="12" fill="#e0f2fe" stroke="#eab308" stroke-width="3"/><circle cx="69" cy="47" r="4" fill="#0f172a"/><line x1="81" y1="49" x2="86" y2="75" stroke="#eab308" stroke-width="2"/></g>`;
    } else if (eye === 'eye_cool') {
        eyeSVG = `<g><rect x="26" y="40" width="25" height="14" rx="4" fill="#0f172a" stroke="#f8fafc" stroke-width="2"/><rect x="59" y="40" width="25" height="14" rx="4" fill="#0f172a" stroke="#f8fafc" stroke-width="2"/><line x1="51" y1="45" x2="59" y2="45" stroke="#f8fafc" stroke-width="2.5"/><line x1="30" y1="43" x2="40" y2="51" stroke="#38bdf8" stroke-width="2"/></g>`;
    } else if (eye === 'eye_nerd') {
        eyeSVG = `<g><rect x="27" y="38" width="24" height="18" rx="4" fill="#ffffff" fill-opacity="0.8" stroke="#1e293b" stroke-width="3"/><rect x="59" y="38" width="24" height="18" rx="4" fill="#ffffff" fill-opacity="0.8" stroke="#1e293b" stroke-width="3"/><line x1="51" y1="46" x2="59" y2="46" stroke="#f8fafc" stroke-width="4"/><circle cx="39" cy="47" r="3.5" fill="#0f172a"/><circle cx="71" cy="47" r="3.5" fill="#0f172a"/></g>`;
    } else {
        eyeSVG = `<g><path d="M33 48 Q41 40 49 48" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/><circle cx="69" cy="47" r="8" fill="#fff" stroke="#0f172a" stroke-width="2"/><circle cx="69" cy="47" r="3.5" fill="#0f172a"/></g>`;
    }

    let mouthSVG = '';
    if (mouth === 'mouth_freud') {
        mouthSVG = `<g><path d="M32 64 Q55 95 78 64 Q66 60 55 64 Q44 60 32 64 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/><line x1="60" y1="68" x2="88" y2="75" stroke="#78350f" stroke-width="4" stroke-linecap="round"/><rect x="85" y="68" width="8" height="10" rx="2" fill="#451a03"/></g>`;
    } else if (mouth === 'mouth_tongue') {
        mouthSVG = `<g><path d="M38 64 Q55 78 72 64 Z" fill="#881337" stroke="#0f172a" stroke-width="2"/><path d="M48 68 Q55 86 64 68 Z" fill="#fb7185" stroke="#be123c" stroke-width="1.5"/></g>`;
    } else if (mouth === 'mouth_mustache') {
        mouthSVG = `<g><path d="M55 64 Q40 56 26 66 Q18 60 24 54 M55 64 Q70 56 84 66 Q92 60 86 54" fill="none" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"/></g>`;
    } else if (mouth === 'mouth_coffee_jitters') {
        mouthSVG = `<g><rect x="36" y="62" width="38" height="12" rx="5" fill="#fff" stroke="#0f172a" stroke-width="2"/><line x1="45" y1="62" x2="45" y2="74" stroke="#0f172a" stroke-width="2"/><line x1="55" y1="62" x2="55" y2="74" stroke="#0f172a" stroke-width="2"/><line x1="65" y1="62" x2="65" y2="74" stroke="#0f172a" stroke-width="2"/></g>`;
    } else if (mouth === 'mouth_thermometer') {
        mouthSVG = `<g><line x1="43" y1="67" x2="67" y2="67" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/><line x1="58" y1="67" x2="88" y2="56" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/><circle cx="88" cy="56" r="4" fill="#ef4444"/></g>`;
    } else {
        mouthSVG = `<g><path d="M36 62 Q55 84 74 62 Z" fill="#be123c" stroke="#0f172a" stroke-width="2"/><rect x="42" y="62" width="26" height="5" fill="#fff"/></g>`;
    }

    let propSVG = '';
    if (prop === 'prop_steth') {
        propSVG = `<g><path d="M35 82 Q35 102 55 102 Q75 102 75 82" fill="none" stroke="#fbbf24" stroke-width="3.5"/><circle cx="55" cy="100" r="6" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/></g>`;
    } else if (prop === 'prop_coffee') {
        propSVG = `<g><rect x="68" y="76" width="22" height="26" rx="4" fill="#f8fafc" stroke="#334155" stroke-width="2"/><rect x="70" y="83" width="18" height="8" fill="#10b981"/><text x="79" y="90" font-size="6" font-weight="bold" fill="#fff" text-anchor="middle">KAFEİN</text></g>`;
    } else if (prop === 'prop_dsm') {
        propSVG = `<g><rect x="18" y="76" width="26" height="28" rx="3" fill="#7c3aed" stroke="#ddd6fe" stroke-width="2"/><text x="31" y="92" font-size="6.5" font-weight="900" fill="#fff" text-anchor="middle">DSM-5</text></g>`;
    } else if (prop === 'prop_bowtie') {
        propSVG = `<g><polygon points="40,82 55,89 40,96" fill="#f43f5e"/><polygon points="70,82 55,89 70,96" fill="#f43f5e"/><circle cx="55" cy="89" r="4" fill="#be123c"/></g>`;
    } else if (prop === 'prop_hypno') {
        propSVG = `<g><line x1="84" y1="68" x2="84" y2="90" stroke="#fbbf24" stroke-width="2"/><circle cx="84" cy="94" r="9" fill="#fef08a" stroke="#d97706" stroke-width="2"/><circle cx="84" cy="94" r="4" fill="#d97706"/></g>`;
    }

    return `
    <div class="funny-avatar-badge" style="width:${size}px; height:${size}px; border-radius:50%; background:${bgObj.grad}; display:inline-flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.35); border:2px solid rgba(255,255,255,0.35); overflow:hidden; flex-shrink:0;">
        <svg viewBox="0 0 110 110" width="${size}" height="${size}">
            <!-- Doctor Coat Shoulders -->
            <path d="M20 110 Q25 78 55 78 Q85 78 90 110 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
            <!-- Head -->
            <circle cx="55" cy="52" r="28" fill="${skinObj.fill}" stroke="#1e293b" stroke-width="2.5"/>
            <!-- Rosy Cheeks -->
            <circle cx="33" cy="58" r="5" fill="${skinObj.cheek}" opacity="0.45"/>
            <circle cx="77" cy="58" r="5" fill="${skinObj.cheek}" opacity="0.45"/>
            ${hatSVG}
            ${eyeSVG}
            ${mouthSVG}
            ${propSVG}
        </svg>
    </div>`;
}

function getRankedTierInfo(rp = 0) {
    const cleanRp = Math.max(0, Number(rp) || 0);
    return RANKED_TIERS.find(t => cleanRp >= t.min && cleanRp <= t.max) || RANKED_TIERS[0];
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

    proto.loadMyAvatar = function () {
        try {
            const raw = localStorage.getItem('psikovaka_funny_avatar');
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return {
            bg: 'bg_indigo',
            skin: 'skin_warm',
            hat: 'hat_einstein',
            eye: 'eye_hypno',
            mouth: 'mouth_tongue',
            prop: 'prop_steth'
        };
    };

    proto.saveMyAvatar = function () {
        localStorage.setItem('psikovaka_funny_avatar', JSON.stringify(this.myAvatar));
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
            this.showToast(`🏆 ${sign} RP (${reasonLabel}) • Yeni Puan: ${this.myRankedPoints} RP (${tier.icon} ${tier.name})`);
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
            rpMount.innerHTML = `${tier.icon} ${this.myRankedPoints} RP`;
            rpMount.style.color = tier.color;
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
                const pick = arr => arr[Math.floor(Math.random() * arr.length)].id;
                this.myAvatar = {
                    bg: pick(FUNNY_AVATAR_PARTS.bgColors),
                    skin: pick(FUNNY_AVATAR_PARTS.skinTones),
                    hat: pick(FUNNY_AVATAR_PARTS.hats),
                    eye: pick(FUNNY_AVATAR_PARTS.eyes),
                    mouth: pick(FUNNY_AVATAR_PARTS.mouths),
                    prop: pick(FUNNY_AVATAR_PARTS.props)
                };
                this.saveMyAvatar();
                this.renderAvatarStudioTab();
                this.playTone('warm');
                this.showToast("🎲 Rastgele komik klinisyen karakteriniz oluşturuldu!");
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

    // --- Tab 2: Top 10 Ranked Scoreboard ---
    proto.renderRankedScoreboardTab = function () {
        const myBannerEl = document.getElementById('myRankedSummaryBanner');
        const listEl = document.getElementById('top10ScoreboardList');
        if (!listEl) return;

        const myTier = getRankedTierInfo(this.myRankedPoints);
        const nextTier = RANKED_TIERS.find(t => t.min > this.myRankedPoints);
        const progressPct = nextTier ?
            Math.min(100, Math.round(((this.myRankedPoints - myTier.min) / (nextTier.min - myTier.min)) * 100)) :
            100;

        if (myBannerEl) {
            myBannerEl.innerHTML = `
                <div style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap; justify-content:space-between;">
                    <div style="display:flex; align-items:center; gap:0.85rem;">
                        ${renderFunnyAvatarSVG(this.myAvatar, 58)}
                        <div>
                            <div style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:${myTier.color};">${myTier.icon} ${myTier.name}</div>
                            <div style="font-size:1.15rem; font-weight:900; color:var(--text-primary);">${this.duelMyNickname} <span style="font-size:0.78rem; color:var(--text-muted); font-family:var(--font-mono);">(${this.myPlayerId})</span></div>
                            <div style="font-size:0.82rem; color:var(--text-secondary);">Düello, Free-For-All ve Turnuvalardan RP kazanarak lig atlayın!</div>
                        </div>
                    </div>
                    <div style="text-align:right; min-width:140px;">
                        <div style="font-size:1.45rem; font-weight:900; font-family:var(--font-mono); color:${myTier.color};">${this.myRankedPoints} RP</div>
                        <div style="font-size:0.73rem; color:var(--text-muted);">${nextTier ? `Sonraki Lig: ${nextTier.icon} ${nextTier.name} (${nextTier.min} RP)` : '🔥 En Üst Ligdesiniz!'}</div>
                        <div style="width:100%; height:7px; background:rgba(255,255,255,0.1); border-radius:99px; overflow:hidden; margin-top:5px;">
                            <div style="width:${progressPct}%; height:100%; background:${myTier.color}; border-radius:99px;"></div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Build combined leaderboard: Real Online Players + Friends + Me + Ranked Clinicians
        const entriesMap = new Map();
        FUNNY_BOT_PROFILES.forEach(b => entriesMap.set(b.id, { ...b, isBot: true }));
        this.myFriends.forEach(f => {
            entriesMap.set(f.playerId, {
                id: f.playerId,
                nickname: f.nickname,
                rankedPoints: f.rankedPoints || 300,
                wins: f.wins || 5,
                avgGuesses: f.avgGuesses || 2.5,
                avatar: f.avatar || FUNNY_BOT_PROFILES[0].avatar
            });
        });
        this.onlinePresenceMap.forEach((p, id) => {
            entriesMap.set(id, {
                id,
                nickname: p.nickname,
                rankedPoints: p.rankedPoints || 250,
                wins: p.wins || 1,
                avgGuesses: p.avgGuesses || 2.5,
                avatar: p.avatar,
                isOnline: true
            });
        });

        const myAvg = this.stats && this.stats.won > 0 ?
            ((Object.entries(this.stats.guesses || {}).reduce((acc, [k, v]) => acc + Number(k) * v, 0)) / this.stats.won).toFixed(1) :
            '2.4';

        entriesMap.set(this.myPlayerId, {
            id: this.myPlayerId,
            nickname: `${this.duelMyNickname} (Sen)`,
            rankedPoints: this.myRankedPoints,
            wins: (this.stats && this.stats.won) || 0,
            avgGuesses: myAvg,
            avatar: this.myAvatar,
            isMe: true
        });

        const sorted = [...entriesMap.values()]
            .sort((a, b) => b.rankedPoints - a.rankedPoints)
            .slice(0, 10);

        listEl.innerHTML = '';
        sorted.forEach((item, idx) => {
            const rank = idx + 1;
            const tier = getRankedTierInfo(item.rankedPoints);
            const medal = rank === 1 ? '🥇' : (rank === 2 ? '🥈' : (rank === 3 ? '🥉' : `#${rank}`));
            const row = document.createElement('div');
            row.className = `scoreboard-row ${item.isMe ? 'is-me' : ''}`;
            row.innerHTML = `
                <div style="display:flex; align-items:center; gap:0.75rem; flex:1; min-width:200px;">
                    <div style="width:32px; font-weight:900; font-size:${rank <= 3 ? '1.25rem' : '0.9rem'}; text-align:center; color:${rank <= 3 ? '#fbbf24' : 'var(--text-muted)'};">${medal}</div>
                    ${renderFunnyAvatarSVG(item.avatar, 42)}
                    <div>
                        <div style="font-weight:800; font-size:0.9rem; color:${item.isMe ? '#34d399' : 'var(--text-primary)'}; display:flex; align-items:center; gap:6px;">
                            ${item.nickname}
                            ${item.isOnline ? '<span style="width:8px;height:8px;border-radius:50%;background:#10b981;display:inline-block;" title="Çevrimiçi"></span>' : ''}
                        </div>
                        <div style="font-size:0.74rem; color:${tier.color}; font-weight:700;">${tier.icon} ${tier.name} • Ort. ${item.avgGuesses} İpucu</div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:0.65rem;">
                    <div style="text-align:right;">
                        <div style="font-family:var(--font-mono); font-weight:900; font-size:0.98rem; color:${tier.color};">${item.rankedPoints} RP</div>
                        <div style="font-size:0.7rem; color:var(--text-muted);">${item.wins || 0} Zafer</div>
                    </div>
                    ${!item.isMe ? `<button class="btn-secondary btn-quick-friend" style="padding:0.3rem 0.55rem; font-size:0.74rem;" title="Arkadaş Ekle">➕</button>` : ''}
                </div>
            `;
            const btnFr = row.querySelector('.btn-quick-friend');
            if (btnFr) {
                btnFr.onclick = () => this.addPlayerToFriends({
                    playerId: item.id,
                    nickname: item.nickname,
                    rankedPoints: item.rankedPoints,
                    avatar: item.avatar
                });
            }
            listEl.appendChild(row);
        });
    };

    // --- Tab 3: Funny Character Avatar Studio ---
    proto.renderAvatarStudioTab = function () {
        const previewEl = document.getElementById('funnyAvatarLivePreview');
        const controlsEl = document.getElementById('funnyAvatarControlsGrid');
        if (!previewEl || !controlsEl) return;

        previewEl.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem;">
                ${renderFunnyAvatarSVG(this.myAvatar, 118)}
                <div style="font-weight:900; font-size:1.05rem; color:var(--text-primary); margin-top:0.25rem;">${this.duelMyNickname}</div>
                <div style="font-size:0.76rem; color:var(--text-muted);">Komik Klinisyen Kimliği: <strong style="color:#38bdf8;">${this.myPlayerId}</strong></div>
            </div>
        `;

        const sections = [
            { key: 'hat', label: '🎩 Komik Şapka / Saç', items: FUNNY_AVATAR_PARTS.hats },
            { key: 'eye', label: '👀 Gözler & Gözlük', items: FUNNY_AVATAR_PARTS.eyes },
            { key: 'mouth', label: '🤪 Ağız, Bıyık & Sakal', items: FUNNY_AVATAR_PARTS.mouths },
            { key: 'prop', label: '🩺 Doktor Aksesuarı', items: FUNNY_AVATAR_PARTS.props },
            { key: 'skin', label: '🎨 Ten / Nöbet Rengi', items: FUNNY_AVATAR_PARTS.skinTones },
            { key: 'bg', label: '🌈 Arka Plan Aurası', items: FUNNY_AVATAR_PARTS.bgColors }
        ];

        controlsEl.innerHTML = '';
        sections.forEach(sec => {
            const box = document.createElement('div');
            box.style.cssText = 'background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:12px; padding:0.65rem 0.8rem;';
            let btnsHTML = `<div style="font-size:0.78rem; font-weight:800; color:var(--text-secondary); margin-bottom:0.45rem;">${sec.label}</div><div style="display:flex; flex-wrap:wrap; gap:0.35rem;">`;
            sec.items.forEach(it => {
                const active = this.myAvatar[sec.key] === it.id;
                btnsHTML += `<button type="button" class="avatar-part-pill ${active ? 'active' : ''}" data-key="${sec.key}" data-val="${it.id}">${it.name}</button>`;
            });
            btnsHTML += `</div>`;
            box.innerHTML = btnsHTML;
            box.querySelectorAll('.avatar-part-pill').forEach(btn => {
                btn.onclick = () => {
                    this.myAvatar[btn.dataset.key] = btn.dataset.val;
                    this.saveMyAvatar();
                    this.renderAvatarStudioTab();
                };
            });
            controlsEl.appendChild(box);
        });
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
                        <div style="font-size:0.75rem; color:${tier.color};">${tier.icon} ${fr.rankedPoints || 250} RP • Kod: ${fr.playerId}</div>
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
