/**
 * PsikoVaka — Kliniğim v1 (Tek Oyunculu Klinik & Dekorasyon Modu)
 * Danışan Nöro kabulü, seans ücreti + itibar, odada canlı görünen eşya mağazası.
 * İlerleme localStorage.psikovaka_clinic_v1 içinde saklanır (online Elo'yu etkilemez).
 */
(function (global) {
    'use strict';

    const STORAGE_KEY = 'psikovaka_clinic_v1';

    const SHOP_ITEMS = [
        { id: 'decor_plant', cat: 'Atmosfer', name: 'Salon Bitkisi', desc: 'Odaya canlılık ve ferahlık katar.', price: 150, bonusPct: 5, icon: '🪴' },
        { id: 'wall_diploma', cat: 'Prestij', name: 'Uzmanlık Diploması', desc: 'Duvara asılı çerçeveli klinik yetki belgesi.', price: 200, bonusPct: 5, icon: '📜' },
        { id: 'seat_chair', cat: 'Oturma', name: 'Rahat Terapi Koltuğu', desc: 'Tabure yerine yumuşak, geniş bir koltuk.', price: 250, bonusPct: 10, icon: '🪑' },
        { id: 'decor_rug', cat: 'Atmosfer', name: 'Desenli Klinik Halısı', desc: 'Zemini ısıtan dokuma terapi halısı.', price: 300, bonusPct: 10, icon: '🧶' },
        { id: 'wall_clock', cat: 'Prestij', name: 'Sessiz Duvar Saati', desc: 'Gerçek zamanlı çalışan klasik ahşap saat.', price: 350, bonusPct: 8, icon: '🕰️' },
        { id: 'wall_rorschach', cat: 'Prestij', name: 'Rorschach Tablosu', desc: 'Tıklandıkça değişen mürekkep lekesi tablosu.', price: 450, bonusPct: 12, icon: '🦋' },
        { id: 'equip_espresso', cat: 'İkram', name: 'Espresso Makinesi', desc: 'Sıcak kahve ikramı seans memnuniyetini artırır.', price: 500, bonusPct: 15, icon: '☕' },
        { id: 'seat_couch', cat: 'Oturma', name: 'Deri Psikanaliz Divanı', desc: 'Klasik, gösterişli üç kişilik terapi divanı.', price: 650, bonusPct: 20, icon: '🛋️', requires: 'seat_chair' },
        { id: 'equip_bookshelf', cat: 'İkram', name: 'DSM-5-TR Kütüphanesi', desc: 'Tavana kadar uzanan zengin klinik kitaplık.', price: 700, bonusPct: 20, icon: '📚' },
        { id: 'decor_fireplace', cat: 'Atmosfer', name: 'Sıcak Şömine', desc: 'Kıvılcımlı şömine ile en üst düzey klinik atmosferi.', price: 800, bonusPct: 25, icon: '🔥' }
    ];

    const CLINIC_RANKS = [
        { minItems: 0, title: 'Stajyer Görüşme Odası' },
        { minItems: 2, title: 'Genç Klinisyen Ofisi' },
        { minItems: 5, title: 'Özel Danışmanlık Kliniği' },
        { minItems: 8, title: 'Uzman Psikiyatri Merkezi' },
        { minItems: 10, title: 'Efsanevi Başhekim Enstitüsü' }
    ];

    const GREETINGS = [
        'Merhaba hocam, biraz konuşabilir miyiz?',
        'Bir süredir kendimi hiç iyi hissetmiyorum...',
        'Yakınlarım mutlaka size görünmemi istedi.',
        'Son haftalarda uyku ve düzenim tamamen bozuldu.',
        'Kimseye anlatamadığım bazı şeyler yaşıyorum...'
    ];

    const WIN_REVIEWS = [
        'İlk bakışta beni anladı, harika bir klinisyen!',
        'Çok dikkatli dinledi ve nokta atışı tanı koydu.',
        'Oda atmosferi çok rahatlatıcı, kesinlikle tavsiye ederim.',
        'Kafamdaki bütün soru işaretleri çözüldü, teşekkürler!',
        'Sanki kitabın içinden çıkıp gelmiş gibi doğru teşhis!'
    ];

    const RORSCHACH_SHAPES = [
        { d: 'M0 -11 C-4 -14 -12 -10 -14 -3 C-16 4 -9 10 -4 8 L0 5 L4 8 C9 10 16 4 14 -3 C12 -10 4 -14 0 -11 Z', msg: '🦋 Kelebek mi, iki ayı mı?' },
        { d: 'M0 -13 C-3 -9 -9 -11 -13 -6 C-15 -1 -10 2 -6 4 C-9 8 -6 13 -2 10 L0 6 L2 10 C6 13 9 8 6 4 C10 2 15 -1 13 -6 C9 -11 3 -9 0 -13 Z', msg: '🦇 Yarasa kanadı gibi!' },
        { d: 'M0 -10 C-6 -14 -15 -6 -11 2 C-8 8 -13 11 -5 12 L0 8 L5 12 C13 11 8 8 11 2 C15 -6 6 -14 0 -10 Z', msg: '☕ İki terapist kahve içiyor!' }
    ];

    let state = null;
    let activePatientAvatar = null;
    let walkingIn = false;
    let lastPayout = null;
    let blotIndex = 0;

    function defaultState() {
        return { money: 0, reputation: 0, treated: 0, wonCount: 0, owned: [], reviews: [] };
    }

    function load() {
        if (state) return state;
        try {
            const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            if (raw && typeof raw === 'object') {
                state = Object.assign(defaultState(), raw);
                if (!Array.isArray(state.owned)) state.owned = [];
                if (!Array.isArray(state.reviews)) state.reviews = [];
                return state;
            }
        } catch (e) {}
        state = defaultState();
        return state;
    }

    function save() {
        if (!state) return;
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
    }

    function has(itemId) {
        return load().owned.includes(itemId);
    }

    function totalBonusPct() {
        const s = load();
        return SHOP_ITEMS.reduce((sum, it) => sum + (s.owned.includes(it.id) ? it.bonusPct : 0), 0);
    }

    function clinicRankTitle() {
        const n = load().owned.length;
        let title = CLINIC_RANKS[0].title;
        for (const r of CLINIC_RANKS) {
            if (n >= r.minItems) title = r.title;
        }
        return title;
    }

    function avgRating() {
        const s = load();
        if (!s.treated) return '—';
        const score = Math.min(5, Math.max(3.0, 3.2 + (s.wonCount / Math.max(1, s.treated)) * 1.8));
        return score.toFixed(1);
    }

    function esc(str) {
        return String(str == null ? '' : str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    function renderAvatar(cfg, size, opts) {
        const AV = global.PsikoVakaAvatar;
        if (!AV) return '';
        return AV.render(cfg, Object.assign({ size: size || 78, framed: false, animated: true }, opts || {}));
    }

    function drawClockSVG() {
        const now = new Date();
        const sec = now.getHours() % 12 * 3600 + now.getMinutes() * 60 + now.getSeconds();
        const st = (period, offs) => `style="transform-origin:520px 62px;animation-duration:${period}s;animation-delay:-${offs}s"`;
        return `<g class="kl-item kl-clock">
            <circle cx="520" cy="64" r="21" fill="#000" opacity=".2"/>
            <circle cx="520" cy="62" r="21" fill="#7a4d33" stroke="#2a1f1c" stroke-width="1.5"/>
            <circle cx="520" cy="62" r="17" fill="#fbf4e4"/>
            <path class="olr-hand" ${st(43200, sec % 43200)} d="M520 64V52" stroke="#2a1f1c" stroke-width="2.2" stroke-linecap="round"/>
            <path class="olr-hand" ${st(3600, sec % 3600)} d="M520 64V48" stroke="#2a1f1c" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="520" cy="62" r="2" fill="#c0533f"/>
        </g>`;
    }

    function renderStageSVG() {
        const s = load();
        const rich = s.owned.length >= 6;
        const wallTop = rich ? '#3d2c26' : '#2a2f3d';
        const wain = rich ? '#5c3c2a' : '#353b4b';
        const floor = rich ? '#5a3a26' : '#3e3a38';
        const blot = RORSCHACH_SHAPES[blotIndex % RORSCHACH_SHAPES.length];

        let svg = `<svg class="kl-room-svg" viewBox="0 0 640 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <!-- Duvar & Zemin -->
            <rect x="0" y="0" width="640" height="132" fill="${wallTop}"/>
            <rect x="0" y="96" width="640" height="36" fill="${wain}"/>
            <rect x="0" y="94" width="640" height="4" fill="#201a18" opacity=".4"/>
            <rect x="0" y="132" width="640" height="168" fill="${floor}"/>
            <path d="M0 165H640M0 205H640M0 250H640" stroke="#000" stroke-opacity=".14" stroke-width="1.2"/>
            <!-- Pencere (sol) -->
            <g class="kl-window">
                <rect x="26" y="22" width="84" height="72" rx="3" fill="${rich ? '#21345c' : '#27364f'}" stroke="#7a5238" stroke-width="4"/>
                <path d="M68 22V94M26 58H110" stroke="#7a5238" stroke-width="3"/>
                <circle cx="88" cy="40" r="7" fill="#fde68a" opacity=".85"/>
                <path d="M26 132L110 132L175 245L50 245Z" fill="#fde68a" opacity="${rich ? '.07' : '.04'}"/>
            </g>
            <!-- Kapı (sağ kenar) -->
            <g class="kl-door">
                <rect x="572" y="34" width="52" height="98" rx="2" fill="#6b442b" stroke="#241a17" stroke-width="2"/>
                <rect x="580" y="44" width="36" height="34" rx="2" fill="#593722"/>
                <rect x="580" y="86" width="36" height="34" rx="2" fill="#593722"/>
                <circle cx="582" cy="84" r="3" fill="#e3b04b"/>
            </g>`;

        // Halı
        if (has('decor_rug')) {
            svg += `<g class="kl-item">
                <polygon points="165,172 475,172 515,274 125,274" fill="#8b3a3a" stroke="#241a17" stroke-width="1.5"/>
                <polygon points="186,184 454,184 486,262 154,262" fill="#2c4f6b"/>
                <polygon points="225,200 415,200 436,246 204,246" fill="#d9a441" opacity=".82"/>
            </g>`;
        }

        // Kütüphane
        if (has('equip_bookshelf')) {
            svg += `<g class="kl-item">
                <rect x="128" y="20" width="96" height="114" rx="3" fill="#6e432a" stroke="#241a17" stroke-width="2"/>
                <rect x="136" y="28" width="80" height="98" fill="#3b2316"/>
                <rect x="140" y="34" width="11" height="22" fill="#c0533f"/><rect x="153" y="38" width="10" height="18" fill="#2f6f8f"/>
                <rect x="165" y="32" width="12" height="24" fill="#d9a441"/><rect x="180" y="36" width="10" height="20" fill="#6a8f5a"/>
                <rect x="193" y="34" width="14" height="22" fill="#7b5ea7"/>
                <rect x="136" y="56" width="80" height="4" fill="#8a5a3c"/>
                <rect x="142" y="64" width="14" height="20" fill="#4d8c84"/><rect x="159" y="62" width="11" height="22" fill="#d97a5a"/>
                <rect x="173" y="66" width="15" height="18" fill="#e0b48f"/><rect x="191" y="62" width="12" height="22" fill="#c0533f"/>
                <rect x="136" y="84" width="80" height="4" fill="#8a5a3c"/>
                <rect x="144" y="92" width="12" height="24" fill="#38506e"/><rect x="160" y="96" width="16" height="20" fill="#a3442f"/>
                <rect x="180" y="94" width="12" height="22" fill="#6a8f5a"/><rect x="196" y="92" width="12" height="24" fill="#d9a441"/>
            </g>`;
        }

        // Şömine
        if (has('decor_fireplace')) {
            svg += `<g class="kl-item">
                <ellipse cx="315" cy="144" rx="95" ry="24" fill="#ff9436" opacity=".18"/>
                <rect x="255" y="42" width="120" height="94" rx="3" fill="#9c543e" stroke="#241a17" stroke-width="2"/>
                <rect x="247" y="38" width="136" height="11" rx="2" fill="#7a4d33" stroke="#241a17" stroke-width="1.6"/>
                <path d="M285 134V94A30 24 0 0 1 345 94V134Z" fill="#231613" stroke="#241a17" stroke-width="2"/>
                <path class="kl-flame" d="M300 130C296 112 308 106 315 92C322 106 334 112 330 130Z" fill="#ff8a2b"/>
                <path class="kl-flame" d="M307 130C305 118 312 114 315 104C319 114 325 118 323 130Z" fill="#ffe066"/>
            </g>`;
        }

        // Diploma
        if (has('wall_diploma')) {
            svg += `<g class="kl-item">
                <rect x="392" y="34" width="52" height="38" rx="2" fill="#b88c46" stroke="#241a17" stroke-width="1.4"/>
                <rect x="397" y="39" width="42" height="28" fill="#fbf4e4"/>
                <path d="M403 48H433M406 54H428M405 60H420" stroke="#8a7e6e" stroke-width="1.6"/>
                <circle cx="430" cy="60" r="3.5" fill="#c0533f"/>
            </g>`;
        }

        // Rorschach Tablosu
        if (has('wall_rorschach')) {
            svg += `<g class="kl-item kl-rorschach-box" id="klRorschachWall">
                <rect x="454" y="30" width="44" height="54" rx="2" fill="#5e3e29" stroke="#241a17" stroke-width="1.5"/>
                <rect x="459" y="35" width="34" height="44" fill="#f5eedc"/>
                <g transform="translate(476 57) scale(0.9)"><path d="${blot.d}" fill="#231c35"/></g>
            </g>`;
        }

        // Duvar Saati
        if (has('wall_clock')) {
            svg += drawClockSVG();
        }

        // Espresso Makinesi & Sehpa
        if (has('equip_espresso')) {
            svg += `<g class="kl-item">
                <rect x="195" y="136" width="56" height="34" rx="3" fill="#7a4d33" stroke="#241a17" stroke-width="1.6"/>
                <rect x="205" y="108" width="34" height="28" rx="4" fill="#cbd5e1" stroke="#241a17" stroke-width="1.6"/>
                <rect x="210" y="113" width="24" height="10" rx="2" fill="#1e293b"/>
                <circle cx="215" cy="118" r="2" fill="#34d399"/><circle cx="222" cy="118" r="2" fill="#fbbf24"/>
                <rect x="218" y="128" width="9" height="7" rx="1" fill="#fff" stroke="#241a17" stroke-width="1"/>
                <path class="kl-steam" d="M221 104q-2 -4 0 -8M226 105q2 -4 0 -8" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.4" stroke-linecap="round"/>
            </g>`;
        }

        // Danışan Oturma Alanı (sağ orta: Tabure -> Koltuk -> Deri Divan)
        if (has('seat_couch')) {
            svg += `<g class="kl-item">
                <ellipse cx="425" cy="222" rx="95" ry="12" fill="#000" opacity=".22"/>
                <path d="M342 156Q342 142 358 142H492Q508 142 508 156V208H342Z" fill="#9f4e3a" stroke="#241a17" stroke-width="2.2"/>
                <rect x="352" y="150" width="46" height="44" rx="10" fill="#b86049" stroke="#241a17" stroke-width="1.5"/>
                <rect x="402" y="150" width="46" height="44" rx="10" fill="#b86049" stroke="#241a17" stroke-width="1.5"/>
                <rect x="452" y="150" width="46" height="44" rx="10" fill="#b86049" stroke="#241a17" stroke-width="1.5"/>
                <rect x="346" y="188" width="158" height="22" rx="7" fill="#c9725a" stroke="#241a17" stroke-width="2"/>
                <rect x="330" y="168" width="20" height="46" rx="8" fill="#8c4230" stroke="#241a17" stroke-width="2"/>
                <rect x="500" y="168" width="20" height="46" rx="8" fill="#8c4230" stroke="#241a17" stroke-width="2"/>
            </g>`;
        } else if (has('seat_chair')) {
            svg += `<g class="kl-item">
                <ellipse cx="425" cy="218" rx="48" ry="10" fill="#000" opacity=".2"/>
                <path d="M388 148Q388 136 402 136H448Q462 136 462 148V202H388Z" fill="#2f6f73" stroke="#241a17" stroke-width="2"/>
                <rect x="382" y="178" width="86" height="24" rx="7" fill="#3c8a8e" stroke="#241a17" stroke-width="2"/>
                <rect x="376" y="164" width="14" height="44" rx="6" fill="#255a5e" stroke="#241a17" stroke-width="2"/>
                <rect x="460" y="164" width="14" height="44" rx="6" fill="#255a5e" stroke="#241a17" stroke-width="2"/>
            </g>`;
        } else {
            // Başlangıç stajyer taburesi
            svg += `<g class="kl-item">
                <ellipse cx="425" cy="218" rx="28" ry="7" fill="#000" opacity=".2"/>
                <path d="M408 186L402 216M442 186L448 216" stroke="#5a3c28" stroke-width="4" stroke-linecap="round"/>
                <ellipse cx="425" cy="184" rx="26" ry="9" fill="#8a6042" stroke="#241a17" stroke-width="2"/>
            </g>`;
        }

        // Terapist koltuğu (sol taraf, oyuncunun Nöro'su burada)
        svg += `<g class="kl-item">
            <ellipse cx="140" cy="222" rx="44" ry="9" fill="#000" opacity=".2"/>
            <path d="M106 154Q106 142 120 142H160Q174 142 174 154V206H106Z" fill="#3f4b6e" stroke="#241a17" stroke-width="2"/>
            <rect x="100" y="184" width="80" height="22" rx="7" fill="#4f5f8c" stroke="#241a17" stroke-width="2"/>
        </g>`;

        // Salon Bitkisi (ön sol köşe)
        if (has('decor_plant')) {
            svg += `<g class="kl-item">
                <ellipse cx="52" cy="276" rx="22" ry="6" fill="#000" opacity=".22"/>
                <path d="M36 238H68L63 274H41Z" fill="#c26b45" stroke="#241a17" stroke-width="1.8"/>
                <path d="M52 240C36 226 24 210 34 196C46 206 50 220 52 240Z" fill="#4f8f54" stroke="#241a17" stroke-width="1.5"/>
                <path d="M52 240C68 224 80 208 70 194C58 204 54 220 52 240Z" fill="#5da662" stroke="#241a17" stroke-width="1.5"/>
                <path d="M52 240C48 214 44 192 54 182C62 194 58 216 52 240Z" fill="#3f7a44" stroke="#241a17" stroke-width="1.5"/>
            </g>`;
        }

        svg += `</svg>`;
        return svg;
    }

    function render() {
        const root = document.getElementById('clinicMount');
        if (!root) return;
        const s = load();
        const gm = global.game;
        const myCfg = (gm && gm.myAvatar) || (global.PsikoVakaAvatar && global.PsikoVakaAvatar.DEFAULT) || {};
        const bonus = totalBonusPct();
        const nextBtnDisabled = walkingIn ? ' disabled' : '';

        const payoutHtml = lastPayout ? `
            <div class="kl-payout-banner ${lastPayout.won ? 'is-win' : 'is-loss'}">
                <div class="kl-payout-main">
                    <strong>${lastPayout.won ? `+${lastPayout.earned} ₺ Seans Ücreti Kazanıldı!` : 'Seans tamamlandı (0 ₺)'}</strong>
                    <span>${esc(lastPayout.note)}</span>
                </div>
                <button type="button" class="btn btn-ghost btn-sm" id="btnClinicClosePayout">Tamam</button>
            </div>` : '';

        const shopHtml = SHOP_ITEMS.map(it => {
            const owned = has(it.id);
            const lockedBy = it.requires && !has(it.requires);
            const reqName = lockedBy ? (SHOP_ITEMS.find(x => x.id === it.requires) || {}).name : '';
            const canBuy = !owned && !lockedBy && s.money >= it.price;
            return `<article class="kl-shop-card${owned ? ' is-owned' : ''}${lockedBy ? ' is-locked' : ''}">
                <div class="kl-shop-top">
                    <span class="kl-shop-ico" aria-hidden="true">${it.icon}</span>
                    <div class="kl-shop-info">
                        <div class="kl-shop-name">${esc(it.name)}</div>
                        <div class="kl-shop-desc">${esc(it.desc)}</div>
                    </div>
                </div>
                <div class="kl-shop-foot">
                    <span class="kl-shop-bonus">+%${it.bonusPct} ücret</span>
                    ${owned
                        ? `<span class="kl-shop-owned">✓ Odada</span>`
                        : lockedBy
                            ? `<span class="kl-shop-req">Önce: ${esc(reqName)}</span>`
                            : `<button type="button" class="btn btn-sm ${canBuy ? 'btn-primary' : 'btn-secondary'}" data-kl-buy="${it.id}" ${canBuy ? '' : 'disabled'}>${it.price} ₺</button>`
                    }
                </div>
            </article>`;
        }).join('');

        const reviewsHtml = s.reviews.length
            ? s.reviews.slice(0, 4).map(r => `<li class="kl-review-item"><span class="kl-review-stars">${r.won ? '★★★★★' : '★★★☆☆'}</span><span class="kl-review-text">"${esc(r.text)}"</span></li>`).join('')
            : `<li class="kl-review-empty">Henüz danışan kabul etmedin. İlk seansını başlattığında yorumlar burada görünecek.</li>`;

        root.innerHTML = `
            <div class="kl-header">
                <div>
                    <h1 class="kl-title">${esc(clinicRankTitle())}</h1>
                    <p class="kl-sub">Danışan kabul et, doğru teşhislerle bütçe kazan ve kliniğini geliştir.</p>
                </div>
                <div class="kl-stats">
                    <div class="kl-stat-pill is-money"><span>💰</span><strong>${s.money} ₺</strong></div>
                    <div class="kl-stat-pill"><span>⭐</span><strong>${avgRating()}</strong></div>
                    <div class="kl-stat-pill"><span>🧑‍⚕️</span><strong>${s.treated} seans</strong></div>
                    ${bonus > 0 ? `<div class="kl-stat-pill is-bonus"><span>📈</span><strong>+%${bonus}</strong></div>` : ''}
                </div>
            </div>

            ${payoutHtml}

            <div class="kl-stage" id="clinicStage">
                ${renderStageSVG()}
                ${has('wall_rorschach') ? `<button type="button" class="kl-rorschach-hit" id="btnClinicRorschach" aria-label="Rorschach tablosunu değiştir" title="Mürekkep lekesine bak"></button>` : ''}
                <div class="kl-noro kl-therapist">
                    ${renderAvatar(myCfg, 84, { facing: 'right', activity: walkingIn ? 'wave' : null })}
                    <span class="kl-tag">Sen</span>
                </div>
                <div class="kl-noro kl-patient${walkingIn ? ' is-entering' : ''}" id="clinicPatientSlot" ${activePatientAvatar ? '' : 'hidden'}>
                    <div class="kl-patient-bubble" id="clinicPatientBubble" hidden></div>
                    <div id="clinicPatientFig">${activePatientAvatar ? renderAvatar(activePatientAvatar, 80, { facing: 'left', walking: walkingIn }) : ''}</div>
                    <span class="kl-tag">Danışan</span>
                </div>
            </div>

            <div class="kl-actions-bar">
                <button type="button" class="btn btn-primary btn-lg kl-accept-btn" id="btnClinicNextPatient"${nextBtnDisabled}>
                    🔔 Sıradaki Danışanı Al
                </button>
            </div>

            <section class="kl-section" aria-labelledby="klShopHeading">
                <div class="kl-section-head">
                    <h2 class="kl-section-title" id="klShopHeading">Klinik Geliştirme Mağazası</h2>
                    <span class="kl-section-meta">${s.owned.length}/${SHOP_ITEMS.length} eşya</span>
                </div>
                <div class="kl-shop-grid">${shopHtml}</div>
            </section>

            <section class="kl-section" aria-labelledby="klReviewHeading">
                <h2 class="kl-section-title" id="klReviewHeading">Son Danışan Yorumları</h2>
                <ul class="kl-reviews-list">${reviewsHtml}</ul>
            </section>
        `;

        bindEvents(root);
    }

    function bindEvents(root) {
        const btnNext = root.querySelector('#btnClinicNextPatient');
        if (btnNext) btnNext.addEventListener('click', acceptNextPatient);

        const btnClosePayout = root.querySelector('#btnClinicClosePayout');
        if (btnClosePayout) {
            btnClosePayout.addEventListener('click', () => { lastPayout = null; render(); });
        }

        const btnRor = root.querySelector('#btnClinicRorschach');
        if (btnRor) {
            btnRor.addEventListener('click', () => {
                blotIndex = (blotIndex + 1) % RORSCHACH_SHAPES.length;
                render();
                if (global.game) global.game.showToast(RORSCHACH_SHAPES[blotIndex].msg);
            });
        }

        root.querySelectorAll('[data-kl-buy]').forEach(btn => {
            btn.addEventListener('click', () => buyItem(btn.dataset.klBuy));
        });
    }

    function buyItem(itemId) {
        const it = SHOP_ITEMS.find(x => x.id === itemId);
        const s = load();
        if (!it || s.owned.includes(it.id)) return;
        if (it.requires && !s.owned.includes(it.requires)) return;
        if (s.money < it.price) {
            if (global.game) global.game.showToast('Yeterli klinik bütçen yok.');
            return;
        }
        s.money -= it.price;
        s.owned.push(it.id);
        save();
        if (global.game) {
            global.game.playTone('win');
            global.game.showToast(`${it.icon} ${it.name} kliniğine eklendi! (+%${it.bonusPct} seans ücreti)`);
        }
        render();
    }

    function pickClinicCase() {
        const gm = global.game;
        if (!gm) return null;
        const pool = (gm.allMasterCases && gm.allMasterCases.length) ? gm.allMasterCases : (gm.cases || []);
        const unsolved = pool.filter(c => !gm.solvedCaseIds || !gm.solvedCaseIds.has(c.id));
        const list = unsolved.length ? unsolved : pool;
        return list[Math.floor(Math.random() * list.length)] || null;
    }

    function acceptNextPatient() {
        const gm = global.game;
        if (!gm || walkingIn) return;
        const nextCase = pickClinicCase();
        if (!nextCase) return;

        lastPayout = null;
        walkingIn = true;
        const AV = global.PsikoVakaAvatar;
        activePatientAvatar = AV ? AV.randomConfig(nextCase.id + '-' + Date.now()) : null;
        render();

        const bubble = document.getElementById('clinicPatientBubble');
        if (bubble) {
            bubble.textContent = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
            bubble.hidden = false;
        }

        setTimeout(() => {
            walkingIn = false;
            gm.currentRoute = 'klinigim';
            gm.currentMode = 'clinic';
            gm.startCase(nextCase, 'Kliniğim · Danışan Seansı');
            if (gm.dom && gm.dom.btnMainNextCase) {
                gm.dom.btnMainNextCase.textContent = '🏥 Kliniğe dön';
            }
        }, 950);
    }

    function onCaseFinished(won, gm) {
        const s = load();
        s.treated += 1;
        let earned = 0;
        let note = 'Danışan teşekkür edip ayrıldı; yeni bir seans deneyebilirsin.';

        if (won) {
            s.wonCount += 1;
            const cluesUsed = Math.max(1, Math.min(6, (gm.zorluk && gm.zorluk.tekHak) ? (gm.cluesUsed || gm.unlockedClues || 1) : (gm.guesses ? gm.guesses.length : 1)));
            const baseTable = { 1: 200, 2: 160, 3: 130, 4: 100, 5: 75, 6: 50 };
            let raw = baseTable[cluesUsed] || 50;
            const isHard = !!(gm.zorluk && (gm.zorluk.tekHak || gm.zorluk.kategoriGizli));
            if (isHard) raw = Math.round(raw * 1.5);
            if (gm.targetGameMode === 'combo') raw = Math.round(raw * 2);
            const bonusPct = totalBonusPct();
            earned = Math.round(raw * (1 + bonusPct / 100));
            s.money += earned;
            s.reputation += cluesUsed <= 2 ? 2 : 1;
            note = `${cluesUsed}. ipucunda doğru teşhis${isHard ? ' · Zor ×1,5' : ''}${bonusPct > 0 ? ` · Klinik +%${bonusPct}` : ''}`;
            s.reviews.unshift({ won: true, text: WIN_REVIEWS[Math.floor(Math.random() * WIN_REVIEWS.length)], at: Date.now() });
        } else {
            s.reviews.unshift({ won: false, text: 'Biraz daha zamana ihtiyacım var sanırım, yine geleceğim.', at: Date.now() });
        }

        s.reviews = s.reviews.slice(0, 10);
        save();
        activePatientAvatar = null;
        lastPayout = { won: !!won, earned, note };

        if (gm && gm.dom && gm.dom.btnMainNextCase) {
            gm.dom.btnMainNextCase.textContent = won ? `🏥 Kliniğe dön (+${earned} ₺)` : '🏥 Kliniğe dön';
        }
    }

    function init() {
        const gm = global.game;
        if (!gm || !gm.registerScreen) { setTimeout(init, 60); return; }
        gm.registerScreen('klinigim', () => render());
    }

    global.PsikoVakaKlinik = { load, render, acceptNextPatient, onCaseFinished, SHOP_ITEMS };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
    else setTimeout(init, 0);
})(typeof window !== 'undefined' ? window : globalThis);
