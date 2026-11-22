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
        const deluxe = s.owned.length >= 5;
        const usePhoto = typeof location === 'undefined' || location.protocol !== 'file:';
        const blot = RORSCHACH_SHAPES[blotIndex % RORSCHACH_SHAPES.length];

        let svg = `<svg class="kl-room-svg${usePhoto ? ' is-overlay' : ''}" viewBox="0 0 640 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">`;

        // Yalnızca file:// çevrimdışı tek dosyalık sürümde yedek vektör oda çiz
        if (!usePhoto) {
            const wallTop = deluxe ? '#3d2c26' : '#f3e7ce';
            const wain = deluxe ? '#5c3c2a' : '#a8c2a6';
            const floor = deluxe ? '#7a4a2a' : '#d69f62';
            svg += `
                <rect x="0" y="0" width="640" height="132" fill="${wallTop}"/>
                <rect x="0" y="96" width="640" height="36" fill="${wain}"/>
                <rect x="0" y="132" width="640" height="168" fill="${floor}"/>`;
        }

        // Starter modda alınan dekor eşyaları Club Penguin başlangıç odasının boş alanlarına yerleşir;
        // Deluxe modda (5+ eşya) arka plan illüstrasyonu zaten şömine, kitaplık, halı, bitki ve espresso barı içerir.
        if (!deluxe) {
            if (has('decor_rug')) {
                svg += `<g class="kl-item">
                    <polygon points="155,186 435,186 468,266 122,266" fill="#9c4138" stroke="#3a2318" stroke-width="2.4" stroke-linejoin="round"/>
                    <polygon points="175,196 415,196 442,256 148,256" fill="#2f6b73" stroke="#3a2318" stroke-width="1.6"/>
                    <polygon points="215,208 375,208 394,244 196,244" fill="#e6b655" opacity=".88"/>
                </g>`;
            }
            if (has('equip_bookshelf')) {
                svg += `<g class="kl-item">
                    <rect x="150" y="24" width="84" height="110" rx="8" fill="#7c4b2c" stroke="#3a2318" stroke-width="2.4"/>
                    <rect x="158" y="34" width="68" height="92" rx="4" fill="#472818"/>
                    <rect x="163" y="40" width="10" height="22" rx="1.5" fill="#d45b47" stroke="#3a2318" stroke-width="1.2"/>
                    <rect x="175" y="43" width="9" height="19" rx="1.5" fill="#3a819e" stroke="#3a2318" stroke-width="1.2"/>
                    <rect x="186" y="38" width="11" height="24" rx="1.5" fill="#e3b04b" stroke="#3a2318" stroke-width="1.2"/>
                    <rect x="199" y="42" width="10" height="20" rx="1.5" fill="#5e9956" stroke="#3a2318" stroke-width="1.2"/>
                    <rect x="158" y="63" width="68" height="4" fill="#8f5a38"/>
                    <rect x="164" y="70" width="12" height="20" rx="1.5" fill="#4f9188" stroke="#3a2318" stroke-width="1.2"/>
                    <rect x="178" y="68" width="11" height="22" rx="1.5" fill="#e07d5c" stroke="#3a2318" stroke-width="1.2"/>
                    <rect x="192" y="71" width="14" height="19" rx="1.5" fill="#8c6bb5" stroke="#3a2318" stroke-width="1.2"/>
                    <rect x="158" y="92" width="68" height="4" fill="#8f5a38"/>
                    <rect x="165" y="99" width="13" height="23" rx="1.5" fill="#c95340" stroke="#3a2318" stroke-width="1.2"/>
                    <rect x="181" y="102" width="14" height="20" rx="1.5" fill="#d9a441" stroke="#3a2318" stroke-width="1.2"/>
                    <rect x="198" y="98" width="12" height="24" rx="1.5" fill="#3f6e8c" stroke="#3a2318" stroke-width="1.2"/>
                </g>`;
            }
            if (has('decor_fireplace')) {
                svg += `<g class="kl-item">
                    <rect x="262" y="54" width="112" height="84" rx="6" fill="#9c8b7e" stroke="#3a2318" stroke-width="2.4"/>
                    <rect x="254" y="48" width="128" height="12" rx="4" fill="#7c4b2c" stroke="#3a2318" stroke-width="2.2"/>
                    <path d="M290 136V96A28 22 0 0 1 346 96V136Z" fill="#2a1914" stroke="#3a2318" stroke-width="2.2"/>
                    <path class="kl-flame" d="M304 132C300 114 311 108 318 94C325 108 336 114 332 132Z" fill="#ff8a2b"/>
                    <path class="kl-flame" d="M311 132C309 120 315 116 318 106C321 116 327 120 325 132Z" fill="#ffe066"/>
                </g>`;
            }
            if (has('wall_diploma')) {
                svg += `<g class="kl-item">
                    <rect x="492" y="34" width="52" height="38" rx="3" fill="#c29042" stroke="#3a2318" stroke-width="2"/>
                    <rect x="497" y="39" width="42" height="28" fill="#fdf6e3"/>
                    <path d="M503 48H533M506 54H528M505 60H520" stroke="#8a7e6e" stroke-width="1.8" stroke-linecap="round"/>
                    <circle cx="530" cy="60" r="3.8" fill="#d45340"/>
                </g>`;
            }
            if (has('equip_espresso')) {
                svg += `<g class="kl-item">
                    <rect x="526" y="138" width="52" height="30" rx="4" fill="#825032" stroke="#3a2318" stroke-width="2.2"/>
                    <rect x="534" y="110" width="34" height="28" rx="5" fill="#d9e2ec" stroke="#3a2318" stroke-width="2.2"/>
                    <rect x="539" y="115" width="24" height="10" rx="2" fill="#243447"/>
                    <circle cx="544" cy="120" r="2.2" fill="#34d399"/><circle cx="551" cy="120" r="2.2" fill="#fbbf24"/>
                    <rect x="547" y="130" width="9" height="7" rx="1.5" fill="#fff" stroke="#3a2318" stroke-width="1.4"/>
                </g>`;
            }
            if (has('decor_plant')) {
                svg += `<g class="kl-item">
                    <ellipse cx="144" cy="156" rx="18" ry="5" fill="#3a2318" opacity=".2"/>
                    <path d="M130 124H158L153 154H135Z" fill="#c97149" stroke="#3a2318" stroke-width="2.2" stroke-linejoin="round"/>
                    <path d="M144 125C128 112 118 96 128 84C140 94 143 108 144 125Z" fill="#529e58" stroke="#2a4d2c" stroke-width="2"/>
                    <path d="M144 125C160 110 170 94 160 82C148 92 145 108 144 125Z" fill="#63b368" stroke="#2a4d2c" stroke-width="2"/>
                    <path d="M144 125C140 100 138 78 146 70C154 82 150 104 144 125Z" fill="#468c4c" stroke="#2a4d2c" stroke-width="2"/>
                </g>`;
            }
        }

        // Her iki modda da canlı / etkileşimli duvar öğeleri
        if (has('wall_rorschach')) {
            svg += `<g class="kl-item kl-rorschach-box" id="klRorschachWall">
                <rect x="434" y="28" width="46" height="56" rx="4" fill="#6e4429" stroke="#3a2318" stroke-width="2.2"/>
                <rect x="439" y="33" width="36" height="46" rx="2" fill="#faf3e0"/>
                <g transform="translate(457 56) scale(0.92)"><path d="${blot.d}" fill="#231c35"/></g>
            </g>`;
        }
        if (has('wall_clock')) {
            svg += drawClockSVG();
        }

        // Danışan Oturma Alanı (sol-orta halı üstünde: koltuk veya deri psikanaliz divanı)
        if (has('seat_couch')) {
            svg += `<g class="kl-item">
                <ellipse cx="242" cy="236" rx="84" ry="12" fill="#3a2318" opacity=".24"/>
                <path d="M170 176Q170 160 188 160H296Q314 160 314 176V222H170Z" fill="#a8503c" stroke="#3a2318" stroke-width="2.6" stroke-linejoin="round"/>
                <rect x="180" y="168" width="42" height="40" rx="10" fill="#c2654e" stroke="#3a2318" stroke-width="2"/>
                <rect x="224" y="168" width="42" height="40" rx="10" fill="#c2654e" stroke="#3a2318" stroke-width="2"/>
                <rect x="268" y="168" width="38" height="40" rx="10" fill="#c2654e" stroke="#3a2318" stroke-width="2"/>
                <rect x="174" y="202" width="136" height="22" rx="8" fill="#d47860" stroke="#3a2318" stroke-width="2.4"/>
                <rect x="158" y="182" width="20" height="46" rx="9" fill="#914230" stroke="#3a2318" stroke-width="2.4"/>
                <rect x="306" y="182" width="20" height="46" rx="9" fill="#914230" stroke="#3a2318" stroke-width="2.4"/>
            </g>`;
        } else if (has('seat_chair')) {
            svg += `<g class="kl-item">
                <ellipse cx="242" cy="234" rx="46" ry="10" fill="#3a2318" opacity=".22"/>
                <path d="M206 168Q206 154 222 154H262Q278 154 278 168V218H206Z" fill="#2f6f73" stroke="#3a2318" stroke-width="2.5" stroke-linejoin="round"/>
                <rect x="200" y="196" width="84" height="22" rx="8" fill="#3f8f94" stroke="#3a2318" stroke-width="2.4"/>
                <rect x="194" y="180" width="16" height="44" rx="7" fill="#255a5e" stroke="#3a2318" stroke-width="2.4"/>
                <rect x="274" y="180" width="16" height="44" rx="7" fill="#255a5e" stroke="#3a2318" stroke-width="2.4"/>
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

            <div class="kl-stage${s.owned.length >= 5 ? ' is-deluxe' : ''}" id="clinicStage">
                <div class="kl-bg-photo${s.owned.length >= 5 ? ' is-deluxe' : ''}" aria-hidden="true"></div>
                ${(s.owned.length >= 5 || has('decor_fireplace')) ? `<div class="kl-fire-ambient" aria-hidden="true"></div>` : ''}
                <div class="kl-motes" aria-hidden="true">
                    <span class="kl-mote" style="left:28%;top:28%;animation-delay:0s"></span>
                    <span class="kl-mote" style="left:44%;top:36%;animation-delay:2.1s"></span>
                    <span class="kl-mote" style="left:60%;top:30%;animation-delay:4.2s"></span>
                    <span class="kl-mote" style="left:76%;top:42%;animation-delay:1.4s"></span>
                </div>
                ${renderStageSVG()}
                ${has('wall_rorschach') ? `<button type="button" class="kl-rorschach-hit" id="btnClinicRorschach" aria-label="Rorschach tablosunu değiştir" title="Mürekkep lekesine bak"></button>` : ''}
                <div class="kl-noro kl-therapist">
                    ${renderAvatar(myCfg, 88, { facing: 'left', activity: walkingIn ? 'wave' : null })}
                    <span class="kl-tag">Sen</span>
                </div>
                <div class="kl-noro kl-patient${walkingIn ? ' is-entering' : ''}" id="clinicPatientSlot" ${activePatientAvatar ? '' : 'hidden'}>
                    <div class="kl-patient-bubble" id="clinicPatientBubble" hidden></div>
                    <div id="clinicPatientFig">${activePatientAvatar ? renderAvatar(activePatientAvatar, 84, { facing: 'right', walking: walkingIn }) : ''}</div>
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
