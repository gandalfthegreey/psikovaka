#!/usr/bin/env python3
"""Aşama 9: yeni online katmanı index.html / app.js / derleyiciye bağlar, eski arenayı söker.
Kullanım: python3 tools/online_dev/stage9_patch.py <proje_kökü>   (tekrar çalıştırmak güvenli: zaten uygulanmışsa atlar)"""
import sys, re, os
root = sys.argv[1] if len(sys.argv) > 1 else '.'
P = lambda f: os.path.join(root, f)
def rd(f): return open(P(f), encoding='utf-8').read()
def wr(f, s): open(P(f), 'w', encoding='utf-8', newline='\n').write(s)
def rep(s, old, new, count=1, required=True):
    if old not in s:
        if required: raise SystemExit('BULUNAMADI: ' + old[:120])
        return s
    return s.replace(old, new, count)

ONLINE = ['core', 'api', 'realtime', 'views', 'friends', 'rooms', 'lobby', 'match', 'online']

# ------------------------------------------------------------------ index.html
s = rd('index.html')
if 'js/online/core.js' not in s:
    s = re.sub(r'\n[^\n]*<script src="https://unpkg\.com/peerjs[^\n]*\n', '\n', s, count=1)
    s = rep(s, '<link rel="stylesheet" href="css/arena.css">', '<link rel="stylesheet" href="css/arena.css">\n    <link rel="stylesheet" href="css/online.css">')
    # Online ekranı
    a = s.index('<section class="screen" id="screenOnline"'); b = s.index('</section>', a) + len('</section>')
    s = s[:a] + '''<section class="screen" id="screenOnline" data-screen="online" aria-labelledby="onlineTitle" hidden>
            <header class="screen-head">
                <h1 class="screen-title" id="onlineTitle">Online</h1>
                <p class="screen-sub">Arkadaşlarınla ya da başka oyuncularla aynı vakaları aynı anda çöz.</p>
            </header>
            <!-- js/online/ (PsikoVakaOnline) burayı çizer: oda kur, koda katıl, açık odalar, arkadaşlar, sıralama -->
            <div id="onlineHubMount" class="ol-hub-mount"></div>
        </section>''' + s[b:]
    # Eski arena penceresi -> "Meydan oku" + ayrı avatar stüdyosu penceresi
    a = s.index('<div class="modal-backdrop" id="duelCenterModal"')
    b = s.index('<!-- Vaka paketleri -->', a)
    studio_a = s.index('<div class="nv-studio">', a)
    # nv-studio bloğunun sonu: "Sekme 4" yorumundan önceki son </div> (panel kapanışı)
    studio_end_marker = s.index('<!-- Sekme 4', studio_a)
    block = s[studio_a:studio_end_marker].rstrip()
    assert block.endswith('</div>'), 'nv-studio bloğu beklenmedik'
    block = block[: block.rfind('</div>')].rstrip()   # dıştaki arena-hub-panel kapanışını at
    modals = '''<div class="modal-backdrop" id="duelCenterModal" role="dialog" aria-modal="true" aria-labelledby="duelCenterTitle">
        <div class="modal-window">
            <div class="modal-header">
                <h2 class="modal-title" id="duelCenterTitle">Bu vakayla meydan oku</h2>
                <button class="icon-btn btn-close-modal" type="button" aria-label="Kapat"><svg class="icon"><use href="#i-x"/></svg></button>
            </div>
            <div class="modal-body">
                <p class="section-text">Bağlantıyı gönder; arkadaşın aynı vakayı çözer ve sonucunu seninkiyle karşılaştırır. Aynı anda oynamak için Online sekmesinden oda kur.</p>
                <div class="form-group">
                    <label class="form-label" for="duelNicknameInput">Görünen adın</label>
                    <input type="text" id="duelNicknameInput" class="form-input" placeholder="Örn: Dr. Emre" maxlength="24">
                </div>
                <div class="arena-share-strip">
                    <span class="arena-share-label">Meydan okuma bağlantısı</span>
                    <div class="arena-share-controls">
                        <input type="text" id="currentCaseDuelLinkInput" class="form-input" readonly aria-label="Meydan okuma bağlantısı">
                        <button class="btn btn-secondary btn-sm" id="btnCopyCurrentDuelLink" type="button"><svg class="icon"><use href="#i-copy"/></svg> Kopyala</button>
                        <button class="btn btn-secondary btn-sm" id="btnWhatsappCurrentDuel" type="button"><svg class="icon"><use href="#i-send"/></svg> WhatsApp</button>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <a class="btn btn-secondary btn-close-modal" href="#/online" id="btnChallengeGoOnline"><svg class="icon"><use href="#i-globe"/></svg> Online'a git</a>
                <button class="btn btn-ghost btn-close-modal" type="button">Kapat</button>
            </div>
        </div>
    </div>

    <!-- Avatar stüdyosu (js/avatar_studio.js) -->
    <div class="modal-backdrop" id="avatarStudioModal" role="dialog" aria-modal="true" aria-labelledby="avatarStudioTitle">
        <div class="modal-window modal-lg">
            <div class="modal-header">
                <h2 class="modal-title" id="avatarStudioTitle">Avatarın</h2>
                <button class="icon-btn btn-close-modal" type="button" aria-label="Kapat"><svg class="icon"><use href="#i-x"/></svg></button>
            </div>
            <div class="modal-body">
                ''' + block + '''
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary btn-close-modal" type="button">Tamam</button>
            </div>
        </div>
    </div>

    '''
    s = s[:a] + modals + s[b:]
    s = s.replace('    <!-- Online arena merkezi (online_arena.js yönetir; yeniden yazılacak) -->', '    <!-- Meydan okuma bağlantısı (#duel=) -->')
    # Betikler
    s = rep(s, '<script src="js/online_arena.js"></script>', '<script src="js/avatar_studio.js"></script>')
    tags = '\n'.join(f'    <script src="js/online/{n}.js"></script>' for n in ONLINE)
    s = rep(s, '    <script src="js/app.js"></script>', '    <script src="js/app.js"></script>\n' + tags)
    wr('index.html', s)
    print('index.html güncellendi')
else:
    print('index.html zaten güncel')

# ------------------------------------------------------------------ app.js
s = rd('js/app.js')
if 'initAvatarStudio' not in s:
    s = rep(s, """        this.activeDuelChallenge = null; // { caseId, mode, challengerName, challengerGuesses, challengerTimeSec, roomCode }
        this.peer = null;
        this.peerConn = null;
        this.broadcastChannel = null;
""", """        this.activeDuelChallenge = null; // #duel= meydan okuma bağlantısı: { caseId, mode, challengerName, challengerGuesses, challengerTimeSec }
""")
    s = rep(s, """        if (typeof this.initOnlineArena === 'function') {
            this.initOnlineArena();
        }""", """        if (typeof this.initAvatarStudio === 'function') {
            this.initAvatarStudio();   // js/avatar_studio.js (canlı oyun: js/online/)
        }""")
    s = rep(s, """        if (prev.state !== snap.state || ev.type === 'profile_saved') {
            const board = document.getElementById('tabArenaScoreboard');
            if (board && board.style.display !== 'none' && this.isModalOpen(this.dom.duelCenterModal) && typeof this.renderRankedScoreboardTab === 'function') {
                this.renderRankedScoreboardTab();
            }
        }
""", "")
    s = rep(s, "if (typeof this.openDuelCenterModal === 'function') this.openDuelCenterModal('tabArenaAvatar');", "if (typeof this.openAvatarStudio === 'function') this.openAvatarStudio();")
    s = rep(s, """                if (this.activeDuelChallenge && this.activeDuelChallenge.isRoomDuel) {
                    this.nextRoomDuelCase();
                } else {
                    this.setMode('practice');
                }""", """                this.setMode('practice');""")
    s = rep(s, """        // Duel Center Modal Actions
        const btnStartMM = document.getElementById('btnStartMatchmaking');
        if (btnStartMM) {
            btnStartMM.addEventListener('click', () => this.startMatchmaking());
        }
        const btnCancelMM = document.getElementById('btnCancelMatchmaking');
        if (btnCancelMM) {
            btnCancelMM.addEventListener('click', () => this.cancelMatchmaking());
        }

        const btnCreateRoom = document.getElementById('btnCreateLiveDuelRoom');
        if (btnCreateRoom) {
            btnCreateRoom.addEventListener('click', () => this.createLiveDuelRoom());
        }
        const btnJoinRoom = document.getElementById('btnJoinLiveDuelRoom');
        if (btnJoinRoom) {
            btnJoinRoom.addEventListener('click', () => {
                const code = (document.getElementById('joinRoomCodeInput').value || '').trim().toUpperCase();
                if (code) this.joinLiveDuelRoom(code);
            });
        }

""", "")
    s = rep(s, "        // Broadcast live duel progress if in room duel\n        this.broadcastDuelProgress(false);\n", "", required=False)
    s = rep(s, "        this.broadcastDuelProgress(false);\n", "", required=False)
    s = rep(s, "        this.broadcastDuelProgress(true, won);\n", "")
    s = rep(s, "if (this.dom.btnMainNextCase && !(this.activeDuelChallenge && this.activeDuelChallenge.isRoomDuel)) {", "if (this.dom.btnMainNextCase) {")
    s = rep(s, """                if (this.activeDuelChallenge && this.activeDuelChallenge.isRoomDuel) {
                    if (typeof this.areAllActivePlayersFinished === 'function' && !this.areAllActivePlayersFinished()) {
                        this.nextRoomDuelCase();
                        return;
                    }
                    this.closeModal(this.dom.resultModal);
                    this.nextRoomDuelCase();
                } else {
                    btnNextPractice.disabled = false;
                    btnNextPractice.style.opacity = '';
                    btnNextPractice.textContent = 'Sıradaki vaka';
                    this.closeModal(this.dom.resultModal);
                    this.setMode('practice');
                }""", """                btnNextPractice.disabled = false;
                btnNextPractice.textContent = 'Sıradaki vaka';
                this.closeModal(this.dom.resultModal);
                this.setMode('practice');""")
    s = rep(s, """        if (this.activeDuelChallenge && this.activeDuelChallenge.isRoomDuel && typeof this.updateRoundLockButtons === 'function') {
            this.updateRoundLockButtons();
        } else if (btnNextPractice) {""", """        if (btnNextPractice) {""")
    s = rep(s, "const html = (this.activeDuelChallenge && this.activeDuelChallenge.isRoomDuel) ? '' : this.libResultLinksHTML();", "const html = this.libResultLinksHTML();", required=False)
    # Eski canlı oda/eşleştirme yöntemleri: yorum satırından exitDuelMode'a kadar
    a = s.index('    // --- Global Automatic Matchmaking ("Canlı Rakip Ara") ---')
    b = s.index('    exitDuelMode() {', a)
    s = s[:a] + """    /** Eski #room= işleyicisi: artık sunucu odalarına (js/online/) yönlendirir. */
    joinLiveDuelRoom(code) {
        if (window.PsikoVakaOnline && window.PsikoVakaOnline.app) window.PsikoVakaOnline.app.joinByCode(code);
        else this.showRoute('online');
    }

""" + s[b:]
    s = rep(s, """        if (this.peer) { try { this.peer.destroy(); } catch (e) {} this.peer = null; }
        if (this.broadcastChannel) { try { this.broadcastChannel.close(); } catch (e) {} this.broadcastChannel = null; }
""", "")
    s = rep(s, """    if (typeof attachOnlineArenaToGame === 'function') {
        attachOnlineArenaToGame(PsikoVakaGame);
    }""", """    if (typeof attachAvatarStudioToGame === 'function') {
        attachAvatarStudioToGame(PsikoVakaGame);
    }""")
    s = rep(s, " * PsikoVaka 2.0 - Klinik Vaka, Terapi, Psikofarmakoloji, Tam Konsültasyon (Kombo) & Canlı Düello Motoru", " * PsikoVaka 2.0 - Klinik Vaka, Terapi, Psikofarmakoloji ve Tam Konsültasyon (Kombo) motoru.\n * Canlı çok oyunculu katman: js/online/ (Supabase); bu dosya yalnızca #duel= meydan okuma bağlantısını taşır", required=False)
    wr('js/app.js', s)
    print('app.js güncellendi')
else:
    print('app.js zaten güncel')

# ------------------------------------------------------------------ derleyici
s = rd('build_portable_single_file.js')
if "online/core.js" not in s:
    s = rep(s, "const CSS_FILES = ['tokens.css', 'style.css', 'arena.css'];", "const CSS_FILES = ['tokens.css', 'style.css', 'arena.css', 'online.css'];")
    s = rep(s, "'leagues.js', 'online_arena.js', 'supabase_config.js', 'account.js', 'app.js'];",
            "'leagues.js', 'avatar_studio.js', 'supabase_config.js', 'account.js', 'app.js', " + ", ".join(f"'online/{n}.js'" for n in ONLINE) + "];")
    s = rep(s, "// CSS dosyaları index.html'deki sırayla satır içine alınır (tokens -> style -> arena)", "// CSS dosyaları index.html'deki sırayla satır içine alınır (tokens -> style -> arena -> online)")
    wr('build_portable_single_file.js', s)
    print('derleyici güncellendi')
else:
    print('derleyici zaten güncel')
