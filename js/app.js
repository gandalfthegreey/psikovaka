/**
 * PsikoVaka 2.0 - Klinik Vaka, Terapi, Psikofarmakoloji, Tam Konsültasyon (Kombo) & Canlı Düello Motoru
 */

class PsikoVakaGame {
    constructor() {
        this.allMasterCases = (typeof CLINICAL_CASES !== 'undefined') ? [...CLINICAL_CASES] : [];
        this.diagnoses = (typeof DIAGNOSES_DATABASE !== 'undefined') ? DIAGNOSES_DATABASE : [];
        this.categories = (typeof DSM_CATEGORIES !== 'undefined') ? DSM_CATEGORIES : {};
        this.courses = (typeof COURSE_CATEGORIES !== 'undefined') ? COURSE_CATEGORIES : {};
        this.therapies = (typeof THERAPIES_DATABASE !== 'undefined') ? THERAPIES_DATABASE : [];
        this.therapyFamilies = (typeof THERAPY_FAMILIES !== 'undefined') ? THERAPY_FAMILIES : {};
        this.pharmacology = (typeof PHARMACOLOGY_DATABASE !== 'undefined') ? PHARMACOLOGY_DATABASE : [];
        this.pharmacologyFamilies = (typeof PHARMACOLOGY_FAMILIES !== 'undefined') ? PHARMACOLOGY_FAMILIES : {};

        // Ensure every case has a pharmacologyId
        this.allMasterCases.forEach(c => {
            if (!c.pharmacologyId) {
                c.pharmacologyId = this.getFallbackPharmacologyId(c);
            }
        });

        this.cases = [...this.allMasterCases];
        this.activePackId = localStorage.getItem('psikovaka_active_pack_id') || 'all';
        this.savedCustomPacks = this.loadSavedCustomPacks();
        this.solvedCaseIds = this.loadSolvedCaseIds();
        this.onlyUnsolvedMode = localStorage.getItem('psikovaka_only_unsolved') === 'true';

        this.currentCase = null;
        this.currentMode = 'daily'; // 'daily', 'practice', 'custom', 'duel'
        this.targetGameMode = 'diagnosis'; // 'diagnosis', 'therapy', 'pharmacology', 'combo'
        this.comboStage = 1; // 1: Diagnosis, 2: Therapy, 3: Pharmacology
        this.comboResults = { stage1Guesses: 0, stage2Guesses: 0, stage3Guesses: 0 };

        this.unlockedClues = 1;
        this.maxClues = 6;
        this.guesses = [];
        this.isGameOver = false;
        this.gameWon = false;
        this.activeCategoryFilter = 'ALL';
        this.activeCourseFilter = 'ALL';
        this.currentDisplayTitle = '';
        this.recentPracticeIds = [];

        this.selectedAutocompleteIndex = -1;
        this.autocompleteResults = [];

        // Duel & Stopwatch State
        this.caseStartTime = Date.now();
        this.elapsedSeconds = 0;
        this.duelTimerInterval = null;
        this.activeDuelChallenge = null; // { caseId, mode, challengerName, challengerGuesses, challengerTimeSec, roomCode }
        this.peer = null;
        this.peerConn = null;
        this.broadcastChannel = null;
        this.duelMyNickname = localStorage.getItem('psikovaka_nickname') || 'Klinisyen';

        this.stats = this.loadStats();

        this.initDOM();
        this.applyActivePack(this.activePackId, false);
        this.initEventListeners();
        this.updateUnsolvedUI();
        this.checkURLForCustomOrDuelCase();
    }

    getFallbackPharmacologyId(c) {
        if (typeof resolvePharmacologyIdForCase === 'function') {
            return resolvePharmacologyIdForCase(c);
        }
        const diagId = c.diagnosisId || '';
        const cat = c.category || '';
        if (diagId === 'neuroleptic_malignant_syndrome') return 'dantrolene_bromocriptine';
        if (diagId === 'serotonin_syndrome') return 'cyproheptadine_serotonin';
        if (diagId === 'tardive_dyskinesia' || diagId === 'major_neurocognitive_huntington') return 'valbenazine_vmat2';
        if (diagId === 'medication_induced_dystonia' || diagId === 'medication_induced_parkinsonism') return 'biperiden_anticholinergic';
        if (diagId === 'medication_induced_akathisia' || diagId === 'social_anxiety_performance') return 'propranolol_beta';
        if (diagId === 'cotard_syndrome' || diagId === 'mdd_with_psychotic' || diagId === 'mdd_with_melancholic') return 'ect_biological_acute';
        if (diagId === 'catatonia_associated' || diagId === 'catatonia_medical') return 'lorazepam_catatonia';
        if (diagId === 'major_neurocognitive_nph') return 'vp_shunt_neurosurgery';
        if (diagId === 'wernicke_korsakoff_syndrome') return 'thiamine_iv_wernicke';
        if (diagId === 'narcolepsy' || diagId === 'kleine_levin_syndrome') return 'modafinil_oxybate';
        if (diagId === 'rem_sleep_behavior_disorder' || diagId === 'sexsomnia' || diagId === 'sleepwalking_disorder') return 'clonazepam_parasomnia';
        if (diagId === 'restless_legs_syndrome') return 'pramipexole_gabapentin_rls';
        if (diagId === 'enuresis' || diagId === 'enuresis_nocturna') return 'desmopressin_enuresis';
        if (diagId === 'bipolar_2' || diagId === 'hallucinogen_persisting_perception') return 'lamotrigine_bipolar2';
        if (diagId === 'bipolar_1_rapid_cycling' || diagId === 'bipolar_1_mixed') return 'valproate_acute_mania';
        if (cat === 'BIPOLAR') return 'lithium_gold';
        if (cat === 'PSYCHOTIC') return 'atypical_ap_secondgen';
        if (cat === 'NEUROCOGNITIVE') return 'cholinesterase_donepezil';
        if (cat === 'SUBSTANCE') return 'naltrexone_acamprosate';
        if (cat === 'NEURODEV') {
            if (diagId.includes('adhd')) return 'methylphenidate_stimulant';
            if (diagId.includes('tic') || diagId.includes('tourette')) return 'alpha2_agonist_tic';
            return 'psychotherapy_first_no_drug';
        }
        if (cat === 'PERSONALITY_A' || cat === 'PERSONALITY_B' || cat === 'PERSONALITY_C' || cat === 'DISSOCIATIVE') {
            return 'psychotherapy_first_no_drug';
        }
        return 'ssri_firstline';
    }

    getBuiltInPacksDefinition() {
        const total = this.allMasterCases.length;
        const dynamicPacks = [];
        if (total > 150) {
            let startNum = 151;
            let packIdx = 7;
            while (startNum <= total) {
                const endNum = Math.min(startNum + 99, total);
                const s = startNum;
                const e = endNum;
                dynamicPacks.push({
                    id: `pack${packIdx}`,
                    title: `🚀 Paket ${packIdx}: Aylık Genişleme Paketi`,
                    badge: `Vaka ${s}–${e}`,
                    desc: `Sonradan eklenen kalıcı klinik vaka koleksiyonu (Vaka ${s} - ${e}).`,
                    filterFn: (c) => c.caseNumber >= s && c.caseNumber <= e
                });
                startNum += 100;
                packIdx++;
            }
        }

        return [
            {
                id: 'all',
                title: `🌟 Tüm Vakalar (Tam Koleksiyon)`,
                badge: `${total} Vaka`,
                desc: 'Sistemdeki tüm DSM-5-TR klinik vakalarının eksiksiz tam havuzu.',
                filterFn: () => true
            },
            ...dynamicPacks.reverse(),
            {
                id: 'pack6',
                title: '🔥 Paket 6: Master Klinik & İlaç (Yeni!)',
                badge: 'Vaka 110–150',
                desc: 'Clérambault, Othello, Ekbom, Katatoni, PANDAS, Lewy, Wernicke, Akatizi, Distoni vb.',
                filterFn: (c) => c.caseNumber >= 110 && c.caseNumber <= 150
            },
            {
                id: 'pack5',
                title: '🧠 Paket 5: Nadir & Nöropsikiyatri',
                badge: 'Vaka 90–109',
                desc: 'Capgras, Cotard, NMS, Serotonin Sendromu, Narkolepsi, RBD, Pick, NPH, Ganser, TD.',
                filterFn: (c) => c.caseNumber >= 90 && c.caseNumber <= 109
            },
            {
                id: 'pack4',
                title: '⚡ Paket 4: Özel Sendromlar',
                badge: 'Vaka 70–89',
                desc: 'Cinsel işlev, uyku-uyanıklık, parafili, dürtü kontrol ve bağımlılık vakaları.',
                filterFn: (c) => c.caseNumber >= 70 && c.caseNumber <= 89
            },
            {
                id: 'pack3',
                title: '🔬 Paket 3: İleri Ayırıcı Tanı',
                badge: 'Vaka 50–69',
                desc: 'Karmaşık komorbiditeler, kişilik bozuklukları ve çocuk/ergen psikopatolojisi.',
                filterFn: (c) => c.caseNumber >= 50 && c.caseNumber <= 69
            },
            {
                id: 'pack2',
                title: '📘 Paket 2: Klinik Derinlik',
                badge: 'Vaka 30–49',
                desc: 'Somatik, dissosiyatif, yeme bozuklukları ve travma spektrumu vakaları.',
                filterFn: (c) => c.caseNumber >= 30 && c.caseNumber <= 49
            },
            {
                id: 'pack1',
                title: '🏛️ Paket 1: Çekirdek Vakalar',
                badge: 'Vaka 1–29',
                desc: 'Temel duygudurum, anksiyete, şizofreni, OKB ve klasik klinik tablolar.',
                filterFn: (c) => c.caseNumber >= 1 && c.caseNumber <= 29
            }
        ];
    }

    loadSavedCustomPacks() {
        try {
            const raw = localStorage.getItem('psikovaka_saved_packs');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch (e) {}
        return [];
    }

    saveCustomPacksToStorage() {
        localStorage.setItem('psikovaka_saved_packs', JSON.stringify(this.savedCustomPacks));
    }

    loadSolvedCaseIds() {
        try {
            const raw = localStorage.getItem('psikovaka_solved_cases');
            if (raw) {
                const arr = JSON.parse(raw);
                if (Array.isArray(arr)) return new Set(arr);
            }
        } catch (e) {}
        return new Set();
    }

    markCaseAsSolved(caseId) {
        if (!caseId) return;
        this.solvedCaseIds.add(caseId);
        localStorage.setItem('psikovaka_solved_cases', JSON.stringify([...this.solvedCaseIds]));
        this.updateUnsolvedUI();
    }

    resetSolvedCases() {
        this.solvedCaseIds.clear();
        localStorage.removeItem('psikovaka_solved_cases');
        this.updateUnsolvedUI();
        this.renderPackShelf();
        this.showToast("🧹 Çözülen vaka geçmişi sıfırlandı! Tüm vakalar tekrar yeni olarak işaretlendi.");
    }

    applyActivePack(packId, launchPracticeCase = true) {
        this.activePackId = packId;
        localStorage.setItem('psikovaka_active_pack_id', packId);

        const builtIn = this.getBuiltInPacksDefinition().find(p => p.id === packId);
        const customPack = this.savedCustomPacks.find(p => p.id === packId);

        let packTitle = 'Tüm Vakalar';
        if (builtIn) {
            const filtered = this.allMasterCases.filter(builtIn.filterFn);
            this.cases = filtered.length > 0 ? filtered : [...this.allMasterCases];
            packTitle = `${builtIn.title.replace(/^[^\s]+\s/, '')} (${this.cases.length})`;
        } else if (customPack && Array.isArray(customPack.cases) && customPack.cases.length > 0) {
            this.cases = customPack.cases.map(c => ({
                ...c,
                pharmacologyId: c.pharmacologyId || this.getFallbackPharmacologyId(c)
            }));
            packTitle = `📦 ${customPack.name} (${this.cases.length})`;
        } else {
            this.activePackId = 'all';
            this.cases = [...this.allMasterCases];
            packTitle = `Tüm Vakalar (${this.cases.length})`;
        }

        if (this.dom && this.dom.quickPackLabel) {
            this.dom.quickPackLabel.textContent = packTitle;
        }

        this.updateUnsolvedUI();
        this.renderPackShelf();

        if (launchPracticeCase) {
            this.setMode('practice');
        }
    }

    updateUnsolvedUI() {
        if (!this.dom) return;
        const unsolvedInPack = this.cases.filter(c => !this.solvedCaseIds.has(c.id)).length;
        if (this.dom.unsolvedCountBadge) {
            this.dom.unsolvedCountBadge.textContent = unsolvedInPack;
        }
        if (this.dom.btnToggleUnsolved) {
            this.dom.btnToggleUnsolved.classList.toggle('active', this.onlyUnsolvedMode);
        }
    }

    initDOM() {
        this.dom = {
            themeToggleBtn: document.getElementById('themeToggleBtn'),
            statsBtn: document.getElementById('statsBtn'),
            helpBtn: document.getElementById('helpBtn'),
            dsmGuideBtn: document.getElementById('dsmGuideBtn'),
            therapyGuideBtn: document.getElementById('therapyGuideBtn'),
            pharmaGuideBtn: document.getElementById('pharmaGuideBtn'),
            caseStudioBtn: document.getElementById('caseStudioBtn'),
            caseManagerBtn: document.getElementById('caseManagerBtn'),
            duelCenterBtn: document.getElementById('duelCenterBtn'),

            // Target Game Mode Switcher (4 Modes)
            btnModeDiagnosis: document.getElementById('btnModeDiagnosis'),
            btnModeTherapy: document.getElementById('btnModeTherapy'),
            btnModePharmacology: document.getElementById('btnModePharmacology'),
            btnModeCombo: document.getElementById('btnModeCombo'),

            navTabs: document.querySelectorAll('.nav-tab'),
            btnToggleUnsolved: document.getElementById('btnToggleUnsolved'),
            unsolvedCountBadge: document.getElementById('unsolvedCountBadge'),
            btnQuickPackIndicator: document.getElementById('btnQuickPackIndicator'),
            quickPackLabel: document.getElementById('quickPackLabel'),
            filterBar: document.getElementById('filterBar'),
            courseNav: document.getElementById('courseNav'),

            // Duel HUD & Combo Stepper
            duelHudBanner: document.getElementById('duelHudBanner'),
            duelMyName: document.getElementById('duelMyName'),
            duelMyScoreBadge: document.getElementById('duelMyScoreBadge'),
            duelOpponentName: document.getElementById('duelOpponentName'),
            duelOpponentStatus: document.getElementById('duelOpponentStatus'),
            duelTimerText: document.getElementById('duelTimerText'),
            btnExitDuel: document.getElementById('btnExitDuel'),
            comboStepperBar: document.getElementById('comboStepperBar'),
            comboStep1: document.getElementById('comboStep1'),
            comboStep2: document.getElementById('comboStep2'),
            comboStep3: document.getElementById('comboStep3'),
            comboStep1Val: document.getElementById('comboStep1Val'),
            comboStep2Val: document.getElementById('comboStep2Val'),
            comboStep3Val: document.getElementById('comboStep3Val'),

            // Patient Chart
            patientId: document.getElementById('patientId'),
            difficultyBadge: document.getElementById('difficultyBadge'),
            modeBadge: document.getElementById('modeBadge'),
            btnQuickChallengeCase: document.getElementById('btnQuickChallengeCase'),
            patientSummaryText: document.getElementById('patientSummaryText'),
            caseSolvedStatusBadge: document.getElementById('caseSolvedStatusBadge'),
            clueProgressTracker: document.getElementById('clueProgressTracker'),
            cluesContainer: document.getElementById('cluesContainer'),
            guessesFeed: document.getElementById('guessesFeed'),

            // Input & Autocomplete
            diagnosisInput: document.getElementById('diagnosisInput'),
            btnSubmit: document.getElementById('btnSubmit'),
            btnSubmitLabel: document.getElementById('btnSubmitLabel'),
            autocompleteDropdown: document.getElementById('autocompleteDropdown'),
            remainingGuessesText: document.getElementById('remainingGuessesText'),
            guessDots: document.getElementById('guessDots'),
            btnGiveUp: document.getElementById('btnGiveUp'),
            mainInputSection: document.getElementById('mainInputSection'),
            finishedActions: document.getElementById('finishedActions'),
            btnMainNextCase: document.getElementById('btnMainNextCase'),
            btnMainShowReport: document.getElementById('btnMainShowReport'),
            btnMainDuelShare: document.getElementById('btnMainDuelShare'),

            // Category & Diagnosis Tree Browser
            btnCategoryBrowser: document.getElementById('btnCategoryBrowser'),
            categoryTreePanel: document.getElementById('categoryTreePanel'),
            categoryBrowserWrapper: document.getElementById('categoryBrowserWrapper'),
            categoryBrowserIcon: document.getElementById('categoryBrowserIcon'),
            categoryBrowserLabel: document.getElementById('categoryBrowserLabel'),
            treePanelTitle: document.getElementById('treePanelTitle'),
            btnCloseCategoryTree: document.getElementById('btnCloseCategoryTree'),
            categoryTreeSearchInput: document.getElementById('categoryTreeSearchInput'),
            categoryTreeContent: document.getElementById('categoryTreeContent'),

            // Modals
            resultModal: document.getElementById('resultModal'),
            statsModal: document.getElementById('statsModal'),
            helpModal: document.getElementById('helpModal'),
            dsmGuideModal: document.getElementById('dsmGuideModal'),
            therapyGuideModal: document.getElementById('therapyGuideModal'),
            pharmaGuideModal: document.getElementById('pharmaGuideModal'),
            caseStudioModal: document.getElementById('caseStudioModal'),
            caseManagerModal: document.getElementById('caseManagerModal'),
            duelCenterModal: document.getElementById('duelCenterModal'),
            dsmCriteriaDetailModal: document.getElementById('dsmCriteriaDetailModal'),

            toastContainer: document.getElementById('toastContainer')
        };
    }

    initEventListeners() {
        if (this.dom.themeToggleBtn) {
            this.dom.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        }

        // 4-Way Target Mode Switcher
        ['btnModeDiagnosis', 'btnModeTherapy', 'btnModePharmacology', 'btnModeCombo'].forEach(btnKey => {
            if (this.dom[btnKey]) {
                this.dom[btnKey].addEventListener('click', (e) => {
                    const target = e.currentTarget.dataset.target;
                    this.setTargetGameMode(target);
                });
            }
        });

        // Unsolved Filter Toggle
        if (this.dom.btnToggleUnsolved) {
            this.dom.btnToggleUnsolved.addEventListener('click', () => {
                this.onlyUnsolvedMode = !this.onlyUnsolvedMode;
                localStorage.setItem('psikovaka_only_unsolved', String(this.onlyUnsolvedMode));
                this.updateUnsolvedUI();
                this.showToast(this.onlyUnsolvedMode ?
                    "🎯 Sadece Çözülmemiş Vakalar filtresi aktif!" :
                    "🌟 Tüm vakalar (çözülenler dahil) gösteriliyor.");
                if (this.currentMode === 'practice') {
                    this.loadRandomPracticeCase();
                }
            });
        }

        if (this.dom.btnQuickPackIndicator) {
            this.dom.btnQuickPackIndicator.addEventListener('click', () => this.openCaseManagerModal());
        }

        // Category Browser Toggle & Search
        if (this.dom.btnCategoryBrowser) {
            this.dom.btnCategoryBrowser.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleCategoryTree();
            });
        }
        if (this.dom.btnCloseCategoryTree) {
            this.dom.btnCloseCategoryTree.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeCategoryTree();
            });
        }
        if (this.dom.categoryTreeSearchInput) {
            this.dom.categoryTreeSearchInput.addEventListener('input', (e) => {
                this.renderCategoryTree(e.target.value);
            });
        }

        document.addEventListener('click', (e) => {
            if (this.dom.categoryBrowserWrapper && !this.dom.categoryBrowserWrapper.contains(e.target)) {
                this.closeCategoryTree();
            }
            if (this.dom.diagnosisInput && this.dom.autocompleteDropdown &&
                !this.dom.diagnosisInput.contains(e.target) && !this.dom.autocompleteDropdown.contains(e.target)) {
                this.closeAutocomplete();
            }
        });

        // Mode Tabs
        this.dom.navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.setMode(mode);
            });
        });

        // Search & Submit
        this.dom.diagnosisInput.addEventListener('input', (e) => this.handleSearchInput(e.target.value));
        this.dom.diagnosisInput.addEventListener('keydown', (e) => this.handleSearchKeydown(e));
        this.dom.btnSubmit.addEventListener('click', () => this.submitGuess());

        if (this.dom.btnGiveUp) {
            this.dom.btnGiveUp.addEventListener('click', () => this.giveUp());
        }

        // Finished Actions on Main Screen
        if (this.dom.btnMainNextCase) {
            this.dom.btnMainNextCase.addEventListener('click', () => {
                if (this.activeDuelChallenge && this.activeDuelChallenge.isRoomDuel) {
                    this.nextRoomDuelCase();
                } else {
                    this.setMode('practice');
                }
            });
        }
        if (this.dom.btnMainShowReport) {
            this.dom.btnMainShowReport.addEventListener('click', () => this.openResultModal(this.gameWon));
        }
        if (this.dom.btnMainDuelShare) {
            this.dom.btnMainDuelShare.addEventListener('click', () => this.openDuelCenterModal());
        }
        if (this.dom.btnQuickChallengeCase) {
            this.dom.btnQuickChallengeCase.addEventListener('click', () => this.openDuelCenterModal());
        }
        if (this.dom.btnExitDuel) {
            this.dom.btnExitDuel.addEventListener('click', () => this.exitDuelMode());
        }

        // Header Modal Openers
        this.dom.statsBtn.addEventListener('click', () => this.openStatsModal());
        this.dom.helpBtn.addEventListener('click', () => this.openModal(this.dom.helpModal));
        this.dom.dsmGuideBtn.addEventListener('click', () => this.openDsmGuideModal());
        if (this.dom.therapyGuideBtn) {
            this.dom.therapyGuideBtn.addEventListener('click', () => this.openTherapyGuideModal());
        }
        if (this.dom.pharmaGuideBtn) {
            this.dom.pharmaGuideBtn.addEventListener('click', () => this.openPharmaGuideModal());
        }
        this.dom.caseStudioBtn.addEventListener('click', () => this.openModal(this.dom.caseStudioModal));
        if (this.dom.caseManagerBtn) {
            this.dom.caseManagerBtn.addEventListener('click', () => this.openCaseManagerModal());
        }
        if (this.dom.duelCenterBtn) {
            this.dom.duelCenterBtn.addEventListener('click', () => this.openDuelCenterModal());
        }

        // Case Manager Actions
        const btnExport = document.getElementById('btnExportJSON');
        if (btnExport) btnExport.addEventListener('click', () => this.exportCasesJSON());

        const btnExportMasterJS = document.getElementById('btnExportMasterCasesJS');
        if (btnExportMasterJS) btnExportMasterJS.addEventListener('click', () => this.exportMasterCasesJS());

        const btnUpload = document.getElementById('btnTriggerUploadJSON');
        const fileInput = document.getElementById('jsonFileInput');
        if (btnUpload && fileInput) {
            btnUpload.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.handleImportJSON(e));
        }

        const btnImportPasted = document.getElementById('btnImportPastedJSON');
        if (btnImportPasted) {
            btnImportPasted.addEventListener('click', () => this.handleImportPastedJSON());
        }

        const btnRestore = document.getElementById('btnRestoreDefaultPool');
        if (btnRestore) {
            btnRestore.addEventListener('click', () => {
                this.applyActivePack('all', true);
                this.closeModal(this.dom.caseManagerModal);
                this.showToast(`🌟 Tüm ${this.allMasterCases.length} vaka aktif havuza alındı!`);
            });
        }

        const btnResetSolved = document.getElementById('btnResetSolvedHistory');
        if (btnResetSolved) {
            btnResetSolved.addEventListener('click', () => this.resetSolvedCases());
        }

        // Duel Center Modal Actions
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

        // Modal Closers
        document.querySelectorAll('.btn-close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-backdrop');
                if (modal) this.closeModal(modal);
            });
        });

        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) this.closeModal(backdrop);
            });
        });

        const studioForm = document.getElementById('caseStudioForm');
        if (studioForm) {
            studioForm.addEventListener('submit', (e) => this.handleCreateCustomCase(e));
        }

        if (this.dom.filterBar) this.renderCategoryFilters();
        if (this.dom.courseNav) this.renderCourseFilters();
    }

    // --- URL Routing for Custom Cases, Direct Case IDs & Live/Link Duels ---
    checkURLForCustomOrDuelCase() {
        const hash = window.location.hash;
        if (!hash) {
            this.setMode('daily');
            return;
        }

        if (hash.startsWith('#room=')) {
            const roomCode = hash.replace('#room=', '').trim().toUpperCase();
            if (roomCode) {
                setTimeout(() => this.joinLiveDuelRoom(roomCode), 300);
                return;
            }
        }

        if (hash.startsWith('#duel=')) {
            try {
                const encoded = hash.replace('#duel=', '');
                const duelData = JSON.parse(decodeURIComponent(escape(atob(encoded))));
                const foundCase = this.allMasterCases.find(c => c.id === duelData.caseId || c.caseNumber === duelData.caseNumber);
                if (foundCase) {
                    if (duelData.mode && ['diagnosis', 'therapy', 'pharmacology', 'combo'].includes(duelData.mode)) {
                        this.setTargetGameMode(duelData.mode, false);
                    }
                    this.startDuelChallenge(foundCase, duelData);
                    return;
                }
            } catch (e) {
                console.error("Düello linki çözümlenemedi:", e);
            }
        }

        if (hash.startsWith('#id=')) {
            const targetId = hash.replace('#id=', '').trim().toLowerCase();
            const found = this.allMasterCases.find(c => c.id.toLowerCase() === targetId || String(c.caseNumber) === targetId);
            if (found) {
                this.currentMode = 'practice';
                this.startCase(found, `Paylaşılan Vaka #${found.caseNumber}`);
                return;
            }
        }

        if (hash.startsWith('#case=')) {
            try {
                const encodedData = hash.replace('#case=', '');
                const jsonString = decodeURIComponent(escape(atob(encodedData)));
                const customCase = JSON.parse(jsonString);
                if (customCase && customCase.clues && customCase.diagnosisId) {
                    customCase.pharmacologyId = customCase.pharmacologyId || this.getFallbackPharmacologyId(customCase);
                    this.loadCustomCase(customCase);
                    return;
                }
            } catch (err) {
                console.error("Özel vaka yüklenemedi:", err);
            }
        }

        this.setMode('daily');
    }

    // --- Effective Target Type Helper (Supports 3-Stage Combo Mode) ---
    getEffectiveTargetType() {
        if (this.targetGameMode === 'combo') {
            if (this.comboStage === 1) return 'diagnosis';
            if (this.comboStage === 2) return 'therapy';
            return 'pharmacology';
        }
        return this.targetGameMode;
    }

    setTargetGameMode(targetMode, restartCurrentCase = true) {
        this.targetGameMode = targetMode;
        this.comboStage = 1;

        ['btnModeDiagnosis', 'btnModeTherapy', 'btnModePharmacology', 'btnModeCombo'].forEach(btnKey => {
            if (this.dom[btnKey]) {
                this.dom[btnKey].classList.toggle('active', this.dom[btnKey].dataset.target === targetMode);
            }
        });

        document.body.classList.toggle('therapy-mode-active', targetMode === 'therapy');
        document.body.classList.toggle('pharmacology-mode-active', targetMode === 'pharmacology');
        document.body.classList.toggle('combo-mode-active', targetMode === 'combo');

        if (this.dom.comboStepperBar) {
            this.dom.comboStepperBar.style.display = (targetMode === 'combo') ? 'grid' : 'none';
        }

        this.syncInputAndBrowserLabels();

        if (this.dom.categoryTreePanel && this.dom.categoryTreePanel.classList.contains('open')) {
            this.renderCategoryTree();
        }

        if (restartCurrentCase && this.currentCase) {
            this.startCase(this.currentCase, this.currentDisplayTitle || 'Vaka');
        }

        const modeMessages = {
            diagnosis: "🩺 DSM-5 Tanı Avcısı Modu Aktif!",
            therapy: "🛡️ Terapi Simülatörü Aktif! Altın standart psikoterapiyi bulun.",
            pharmacology: "💊 Farmakoterapi Avcısı Aktif! Birinci basamak ilacı/müdahaleyi seçin.",
            combo: "⚡ Tam Konsültasyon (Kombo) Modu! Sırasıyla Tanı ➔ Terapi ➔ İlaç belirleyin!"
        };
        if (restartCurrentCase) {
            this.showToast(modeMessages[targetMode] || "Mod değiştirildi.");
        }
    }

    syncInputAndBrowserLabels() {
        const effectiveType = this.getEffectiveTargetType();
        if (this.dom.categoryBrowserIcon && this.dom.categoryBrowserLabel) {
            if (effectiveType === 'therapy') {
                this.dom.categoryBrowserIcon.textContent = '🛡️';
                this.dom.categoryBrowserLabel.textContent = 'Terapi Ekolleri';
                if (this.dom.treePanelTitle) this.dom.treePanelTitle.textContent = '🛡️ Terapi Ekolleri & Yöntemleri Ağacı';
                if (this.dom.diagnosisInput) this.dom.diagnosisInput.placeholder = "🛡️ Altın standart psikoterapi yöntemini yazın veya soldan seçin...";
                if (this.dom.btnSubmitLabel) this.dom.btnSubmitLabel.textContent = (this.targetGameMode === 'combo') ? 'Aşama 2 Seç' : 'Tahmin Et';
            } else if (effectiveType === 'pharmacology') {
                this.dom.categoryBrowserIcon.textContent = '💊';
                this.dom.categoryBrowserLabel.textContent = 'İlaç Grupları';
                if (this.dom.treePanelTitle) this.dom.treePanelTitle.textContent = '💊 Psikofarmakoloji & Biyolojik Müdahale Ağacı';
                if (this.dom.diagnosisInput) this.dom.diagnosisInput.placeholder = "💊 Birinci basamak ilacı/antidotu yazın veya soldaki gruplardan seçin...";
                if (this.dom.btnSubmitLabel) this.dom.btnSubmitLabel.textContent = (this.targetGameMode === 'combo') ? 'Aşama 3 Seç' : 'Tahmin Et';
            } else {
                this.dom.categoryBrowserIcon.textContent = '📂';
                this.dom.categoryBrowserLabel.textContent = 'DSM-5 Kategorileri';
                if (this.dom.treePanelTitle) this.dom.treePanelTitle.textContent = '📖 DSM-5 Kategori & Tanı Ağacı (297 Tanı)';
                if (this.dom.diagnosisInput) this.dom.diagnosisInput.placeholder = "🔍 Bir DSM-5 tanısı yazın veya soldaki 22 kategoriden seçin...";
                if (this.dom.btnSubmitLabel) this.dom.btnSubmitLabel.textContent = (this.targetGameMode === 'combo') ? 'Aşama 1 Seç' : 'Tahmin Et';
            }
        }
    }

    updateComboStepperUI() {
        if (!this.dom.comboStepperBar) return;
        this.dom.comboStepperBar.style.display = (this.targetGameMode === 'combo') ? 'grid' : 'none';
        if (this.targetGameMode !== 'combo') return;

        const steps = [this.dom.comboStep1, this.dom.comboStep2, this.dom.comboStep3];
        steps.forEach((el, idx) => {
            if (!el) return;
            const stageNum = idx + 1;
            el.classList.remove('active', 'completed');
            if (stageNum < this.comboStage || (this.isGameOver && this.gameWon)) {
                el.classList.add('completed');
            } else if (stageNum === this.comboStage) {
                el.classList.add('active');
            }
        });
    }

    // --- Category & Diagnosis/Therapy/Pharmacology Tree Browser ---
    toggleCategoryTree() {
        if (!this.dom.categoryTreePanel) return;
        if (this.dom.categoryTreePanel.classList.contains('open')) {
            this.closeCategoryTree();
        } else {
            this.openCategoryTree();
        }
    }

    openCategoryTree() {
        if (!this.dom.categoryTreePanel) return;
        this.dom.categoryTreePanel.classList.add('open');
        if (this.dom.btnCategoryBrowser) this.dom.btnCategoryBrowser.classList.add('active');
        if (this.dom.categoryTreeSearchInput) {
            this.dom.categoryTreeSearchInput.value = '';
        }
        this.renderCategoryTree();
        setTimeout(() => {
            if (this.dom.categoryTreeSearchInput) this.dom.categoryTreeSearchInput.focus();
        }, 60);
    }

    closeCategoryTree() {
        if (!this.dom.categoryTreePanel) return;
        this.dom.categoryTreePanel.classList.remove('open');
        if (this.dom.btnCategoryBrowser) this.dom.btnCategoryBrowser.classList.remove('active');
    }

    renderCategoryTree(filterQuery = '') {
        const container = this.dom.categoryTreeContent;
        if (!container) return;
        container.innerHTML = '';

        const cleanQuery = this.normalizeTurkish(filterQuery);
        const fragment = document.createDocumentFragment();
        const effectiveType = this.getEffectiveTargetType();

        this.syncInputAndBrowserLabels();

        if (effectiveType === 'therapy') {
            Object.keys(this.therapyFamilies).forEach(famKey => {
                const fam = this.therapyFamilies[famKey];
                let items = this.therapies.filter(t => t.family === famKey);
                if (cleanQuery) {
                    items = items.filter(t =>
                        this.normalizeTurkish(t.nameTr).includes(cleanQuery) ||
                        this.normalizeTurkish(t.nameEn).includes(cleanQuery) ||
                        this.normalizeTurkish(fam.name).includes(cleanQuery)
                    );
                }
                if (items.length === 0) return;
                fragment.appendChild(this.buildTreeGroupElement(fam.icon || '🛡️', fam.name, `${items.length} Yöntem`, items, cleanQuery, (id) => {
                    return this.therapies.find(t => t.id === id);
                }));
            });
        } else if (effectiveType === 'pharmacology') {
            Object.keys(this.pharmacologyFamilies).forEach(famKey => {
                const fam = this.pharmacologyFamilies[famKey];
                let items = this.pharmacology.filter(p => p.family === famKey);
                if (cleanQuery) {
                    items = items.filter(p =>
                        this.normalizeTurkish(p.nameTr).includes(cleanQuery) ||
                        this.normalizeTurkish(p.nameEn).includes(cleanQuery) ||
                        this.normalizeTurkish(fam.name).includes(cleanQuery)
                    );
                }
                if (items.length === 0) return;
                fragment.appendChild(this.buildTreeGroupElement(fam.icon || '💊', fam.name, `${items.length} Protokol`, items, cleanQuery, (id) => {
                    return this.pharmacology.find(p => p.id === id);
                }));
            });
        } else {
            Object.keys(this.categories).forEach(catKey => {
                const cat = this.categories[catKey];
                let items = this.diagnoses.filter(d => d.category === catKey);
                if (cleanQuery) {
                    items = items.filter(d =>
                        this.normalizeTurkish(d.nameTr).includes(cleanQuery) ||
                        this.normalizeTurkish(d.nameEn).includes(cleanQuery) ||
                        this.normalizeTurkish(cat.name).includes(cleanQuery)
                    );
                }
                if (items.length === 0) return;
                fragment.appendChild(this.buildTreeGroupElement(cat.icon || '🏷️', cat.name, `${items.length} Tanı`, items, cleanQuery, (id) => {
                    return this.diagnoses.find(d => d.id === id);
                }));
            });
        }

        container.appendChild(fragment);
    }

    buildTreeGroupElement(icon, groupName, countText, items, cleanQuery, finderFn) {
        const groupDiv = document.createElement('div');
        groupDiv.className = `tree-category-group ${cleanQuery ? 'open' : ''}`;

        groupDiv.innerHTML = `
            <button class="tree-category-btn" type="button">
                <div class="tree-category-title-wrap">
                    <span class="tree-category-arrow">▶</span>
                    <span class="tree-category-name">${icon} ${groupName}</span>
                </div>
                <span class="tree-category-count">${countText}</span>
            </button>
            <div class="tree-diagnoses-list">
                ${items.map(item => `
                    <div class="tree-diagnosis-item" data-id="${item.id}" title="${item.shortDefinition || ''}">
                        <div class="tree-item-main">
                            <span class="tree-item-name-tr">${item.nameTr}</span>
                            <span class="tree-item-name-en">${item.nameEn || ''}</span>
                        </div>
                        <span class="tree-item-action-icon">⏎ Seç</span>
                    </div>
                `).join('')}
            </div>
        `;

        const btn = groupDiv.querySelector('.tree-category-btn');
        btn.onclick = () => {
            const willOpen = !groupDiv.classList.contains('open');
            groupDiv.classList.toggle('open');
            if (willOpen) {
                setTimeout(() => groupDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 40);
            }
        };

        groupDiv.querySelectorAll('.tree-diagnosis-item').forEach(itemEl => {
            itemEl.onclick = () => {
                const found = finderFn(itemEl.dataset.id);
                if (found) {
                    this.selectItem(found);
                    this.closeCategoryTree();
                }
            };
        });

        return groupDiv;
    }

    setMode(mode) {
        this.currentMode = mode;

        this.dom.navTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.mode === mode);
        });

        if (this.dom.filterBar) {
            this.dom.filterBar.style.display = (mode === 'practice') ? 'flex' : 'none';
        }
        if (this.dom.courseNav) {
            this.dom.courseNav.style.display = (mode === 'practice') ? 'flex' : 'none';
        }

        if (mode === 'daily') {
            this.loadDailyCase();
        } else if (mode === 'practice') {
            this.loadRandomPracticeCase();
        }
    }

    getDailySeed() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    loadDailyCase() {
        const seedStr = this.getDailySeed();
        let hash = 0;
        for (let i = 0; i < seedStr.length; i++) {
            hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
            hash |= 0;
        }
        const index = Math.abs(hash) % this.cases.length;
        const dailyCase = this.cases[index];

        this.startCase(dailyCase, `Günün Vakası #${dailyCase.caseNumber || (index + 1)} (${seedStr})`);
    }

    loadRandomPracticeCase() {
        let pool = [...this.cases];

        if (this.activeCourseFilter && this.activeCourseFilter !== 'ALL') {
            pool = pool.filter(c => c.course === this.activeCourseFilter);
        }
        if (this.activeCategoryFilter && this.activeCategoryFilter !== 'ALL') {
            pool = pool.filter(c => c.category === this.activeCategoryFilter);
        }

        // Unsolved filter
        if (this.onlyUnsolvedMode) {
            const unsolvedPool = pool.filter(c => !this.solvedCaseIds.has(c.id));
            if (unsolvedPool.length > 0) {
                pool = unsolvedPool;
            } else if (pool.length > 0) {
                this.showToast("🎉 Bu filtredeki tüm vakaları çözdünüz! Havuz baştan karıştırılıyor.");
            }
        }

        if (!pool || pool.length === 0) pool = [...this.cases];

        const availablePool = pool.filter(c => !this.recentPracticeIds.includes(c.id));
        const finalPool = availablePool.length > 0 ? availablePool : pool;

        const randomIndex = Math.floor(Math.random() * finalPool.length);
        const selectedCase = finalPool[randomIndex];

        this.recentPracticeIds.push(selectedCase.id);
        if (this.recentPracticeIds.length > 15) {
            this.recentPracticeIds.shift();
        }

        this.startCase(selectedCase, `Pratik Vaka #${selectedCase.caseNumber || (randomIndex + 1)}`);
    }

    loadCustomCase(customCase) {
        this.currentMode = 'custom';
        this.dom.navTabs.forEach(tab => tab.classList.remove('active'));
        if (this.dom.filterBar) this.dom.filterBar.style.display = 'none';
        if (this.dom.courseNav) this.dom.courseNav.style.display = 'none';

        this.startCase(customCase, `🔗 Paylaşılan Özel Vaka`);
        this.showToast("🎮 Paylaşılan özel vaka yüklendi!");
    }

    // --- Core Game Flow ---
    startCase(caseData, displayModeTitle = 'Vaka') {
        if (!caseData) return;
        this.currentCase = caseData;
        if (!this.currentCase.pharmacologyId) {
            this.currentCase.pharmacologyId = this.getFallbackPharmacologyId(this.currentCase);
        }
        this.currentDisplayTitle = displayModeTitle;
        this.guesses = [];
        this.unlockedClues = 1;
        this.isGameOver = false;
        this.gameWon = false;
        this.comboStage = 1;
        this.comboResults = { stage1Guesses: 0, stage2Guesses: 0, stage3Guesses: 0 };

        if (this.dom.comboStep1Val) this.dom.comboStep1Val.textContent = 'Tanıyı belirleyin...';
        if (this.dom.comboStep2Val) this.dom.comboStep2Val.textContent = 'Bekleniyor...';
        if (this.dom.comboStep3Val) this.dom.comboStep3Val.textContent = 'Bekleniyor...';
        this.updateComboStepperUI();
        this.syncInputAndBrowserLabels();

        this.closeAutocomplete();
        this.closeCategoryTree();

        // Start Timer for Duels / Speed stats
        this.startCaseTimer();

        // Reset UI
        this.dom.patientId.textContent = `DOSYA NO: ${this.currentCase.id.toUpperCase()}`;

        let diffStr = 'Orta';
        if (typeof this.currentCase.difficulty === 'number') {
            diffStr = this.currentCase.difficulty === 1 ? 'Kolay' : (this.currentCase.difficulty === 2 ? 'Orta' : 'Zor');
        } else if (typeof this.currentCase.difficulty === 'string') {
            diffStr = this.currentCase.difficulty;
        }
        this.dom.difficultyBadge.textContent = diffStr;
        this.dom.difficultyBadge.className = `badge badge-difficulty-${diffStr.toLowerCase()}`;

        const modePrefixes = {
            diagnosis: '🩺 TANI: ',
            therapy: '🛡️ TERAPİ: ',
            pharmacology: '💊 İLAÇ: ',
            combo: '⚡ KOMBO: '
        };
        this.dom.modeBadge.textContent = (modePrefixes[this.targetGameMode] || '🩺 ') + displayModeTitle;
        this.dom.patientSummaryText.textContent = this.currentCase.patientSummary;

        if (this.dom.caseSolvedStatusBadge) {
            const isSolved = this.solvedCaseIds.has(this.currentCase.id);
            this.dom.caseSolvedStatusBadge.style.display = isSolved ? 'inline-block' : 'none';
        }

        this.dom.diagnosisInput.value = '';
        delete this.dom.diagnosisInput.dataset.selectedId;
        this.dom.diagnosisInput.disabled = false;
        this.dom.btnSubmit.disabled = false;

        if (this.dom.finishedActions) this.dom.finishedActions.style.display = 'none';
        if (this.dom.mainInputSection) this.dom.mainInputSection.style.display = 'block';

        this.renderClues();
        this.renderGuesses();
        this.updateRemainingGuessesUI();
    }

    startCaseTimer() {
        this.caseStartTime = Date.now();
        this.elapsedSeconds = 0;
        if (this.duelTimerInterval) clearInterval(this.duelTimerInterval);
        this.duelTimerInterval = setInterval(() => {
            if (!this.isGameOver) {
                this.elapsedSeconds = Math.floor((Date.now() - this.caseStartTime) / 1000);
                if (this.dom.duelTimerText) {
                    const mins = String(Math.floor(this.elapsedSeconds / 60)).padStart(2, '0');
                    const secs = String(this.elapsedSeconds % 60).padStart(2, '0');
                    this.dom.duelTimerText.textContent = `${mins}:${secs}`;
                }
            }
        }, 500);
    }

    renderClues() {
        this.dom.cluesContainer.innerHTML = '';

        const clueLabels = [
            "1. İpucu • Başvuru Şikayeti & İlk İzlenim",
            "2. İpucu • Belirti Süresi & Başlangıç",
            "3. İpucu • İşlevsellik & Davranışsal Örüntü",
            "4. İpucu • Tıbbi Dışlama & Tetikleyiciler",
            "5. İpucu • Ruhsal Durum Muayenesi (MSE)",
            "6. İpucu • DSM-5 Kilit Tanı Kriteri"
        ];

        for (let i = 0; i < this.maxClues; i++) {
            const isUnlocked = (i < this.unlockedClues);
            const clueBox = document.createElement('div');
            clueBox.className = `clue-box ${isUnlocked ? 'active' : 'locked'}`;

            if (isUnlocked) {
                const rawClue = (this.currentCase && this.currentCase.clues && this.currentCase.clues[i]) ? this.currentCase.clues[i] : '';
                let clueContent = typeof rawClue === 'object' && rawClue !== null ? (rawClue.text || '') : String(rawClue);

                if (this.isGameOver && this.currentCase && Array.isArray(this.currentCase.symptomHighlights)) {
                    this.currentCase.symptomHighlights.forEach((hl) => {
                        if (hl && hl.clueIndex === i && typeof hl.text === 'string' && clueContent.includes(hl.text)) {
                            const escapedDsm = (hl.dsmMatch || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
                            const escapedText = hl.text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                            const tagLabel = hl.dsmMatch ? hl.dsmMatch.split(':')[0] : 'DSM-5';
                            const replacement = `<span class="symptom-tag-highlight" onclick="window.game.showDsmDetail('${escapedDsm}', '${escapedText}')" title="DSM-5 Kriterini Görmek İçin Tıklayın!">🔍 ${hl.text} <span class="symptom-pill">${tagLabel}</span></span>`;
                            clueContent = clueContent.replace(hl.text, replacement);
                        }
                    });
                }

                clueBox.innerHTML = `
                    <div class="clue-header">
                        <span class="clue-tag">
                            <span>🔍</span> ${clueLabels[i]}
                        </span>
                        <span style="font-size: 0.74rem; color: var(--text-muted); font-weight: 700;">Açık</span>
                    </div>
                    <div class="clue-text">${clueContent}</div>
                `;
            } else {
                clueBox.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.85rem; font-weight: 600;">
                        <span>🔒</span> ${clueLabels[i]}
                    </div>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${i + 1}. Tahminde Açılır</span>
                `;
            }

            this.dom.cluesContainer.appendChild(clueBox);
        }

        this.dom.clueProgressTracker.innerHTML = '';
        for (let i = 0; i < this.maxClues; i++) {
            const node = document.createElement('div');
            node.className = 'clue-step-node';
            if (this.gameWon) {
                node.classList.add('correct');
            } else if (i < this.unlockedClues) {
                node.classList.add('unlocked');
            }
            this.dom.clueProgressTracker.appendChild(node);
        }

        this.dom.cluesContainer.scrollTop = this.dom.cluesContainer.scrollHeight;
    }

    showDsmDetail(dsmMatch, symptomText) {
        const modalSymptom = document.getElementById('modalSymptomText');
        const modalCriteria = document.getElementById('modalCriteriaText');
        if (modalSymptom && modalCriteria) {
            modalSymptom.textContent = `"${symptomText}"`;
            modalCriteria.textContent = dsmMatch;
            this.openModal(this.dom.dsmCriteriaDetailModal);
        }
    }

    renderGuesses() {
        this.dom.guessesFeed.innerHTML = '';

        this.guesses.forEach((guess, index) => {
            const card = document.createElement('div');
            let cardClass = 'guess-card wrong';
            let statusText = guess.wrongLabel || 'Farklı Grup';
            let icon = '⬛';

            if (guess.isCorrect) {
                cardClass = 'guess-card correct';
                statusText = guess.correctLabel || '✨ Tam İsabet!';
                icon = '🟩';
            } else if (guess.categoryMatch) {
                cardClass = 'guess-card category-match';
                statusText = `🟨 Grup Doğru: ${guess.categoryName}`;
                icon = '🟨';
            }

            const stageTag = guess.stageBadge ? `<span class="badge" style="font-size:0.68rem; background:rgba(255,255,255,0.08);">${guess.stageBadge}</span>` : '';

            card.className = cardClass;
            card.innerHTML = `
                <div class="guess-name">
                    <span>${icon}</span>
                    ${stageTag}
                    <span><strong>#${index + 1}</strong> ${guess.nameTr}</span>
                </div>
                <div class="guess-status-pill">${statusText}</div>
            `;
            this.dom.guessesFeed.appendChild(card);
        });
    }

    updateRemainingGuessesUI() {
        const remaining = Math.max(0, this.maxClues - this.guesses.length);
        this.dom.remainingGuessesText.textContent = `Kalan Hak: ${remaining}/${this.maxClues}`;

        this.dom.guessDots.innerHTML = '';
        for (let i = 0; i < this.maxClues; i++) {
            const dot = document.createElement('div');
            dot.className = 'guess-dot';
            if (i < this.guesses.length) {
                dot.classList.add('used');
            } else if (i === this.guesses.length) {
                dot.classList.add('active');
            }
            this.dom.guessDots.appendChild(dot);
        }
    }

    // --- Autocomplete & Search ---
    normalizeTurkish(str) {
        if (!str) return '';
        return str
            .replace(/İ/g, 'i')
            .replace(/I/g, 'ı')
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .trim();
    }

    handleSearchInput(query) {
        const cleanQuery = this.normalizeTurkish(query);
        if (cleanQuery.length < 1) {
            this.closeAutocomplete();
            return;
        }

        const effectiveType = this.getEffectiveTargetType();

        if (effectiveType === 'therapy') {
            this.autocompleteResults = this.therapies.filter(t => {
                const tr = this.normalizeTurkish(t.nameTr);
                const en = this.normalizeTurkish(t.nameEn);
                const aliasMatch = t.aliases && t.aliases.some(a => this.normalizeTurkish(a).includes(cleanQuery));
                const defMatch = t.shortDefinition && this.normalizeTurkish(t.shortDefinition).includes(cleanQuery);
                return tr.includes(cleanQuery) || en.includes(cleanQuery) || aliasMatch || defMatch;
            }).slice(0, 8);
        } else if (effectiveType === 'pharmacology') {
            this.autocompleteResults = this.pharmacology.filter(p => {
                const tr = this.normalizeTurkish(p.nameTr);
                const en = this.normalizeTurkish(p.nameEn);
                const aliasMatch = p.aliases && p.aliases.some(a => this.normalizeTurkish(a).includes(cleanQuery));
                const defMatch = p.shortDefinition && this.normalizeTurkish(p.shortDefinition).includes(cleanQuery);
                return tr.includes(cleanQuery) || en.includes(cleanQuery) || aliasMatch || defMatch;
            }).slice(0, 8);
        } else {
            this.autocompleteResults = this.diagnoses.filter(d => {
                const tr = this.normalizeTurkish(d.nameTr);
                const en = this.normalizeTurkish(d.nameEn);
                const aliasMatch = d.aliases && d.aliases.some(a => this.normalizeTurkish(a).includes(cleanQuery));
                return tr.includes(cleanQuery) || en.includes(cleanQuery) || aliasMatch;
            }).slice(0, 8);
        }

        this.renderAutocomplete();
    }

    renderAutocomplete() {
        if (this.autocompleteResults.length === 0) {
            this.closeAutocomplete();
            return;
        }

        this.dom.autocompleteDropdown.innerHTML = '';
        this.selectedAutocompleteIndex = -1;
        const effectiveType = this.getEffectiveTargetType();

        this.autocompleteResults.forEach((item) => {
            const div = document.createElement('div');
            div.className = 'autocomplete-item';

            if (effectiveType === 'therapy') {
                const fam = this.therapyFamilies[item.family] || { name: item.family, icon: '🛡️' };
                div.innerHTML = `
                    <div class="item-main">
                        <span class="item-name-tr">${item.nameTr}</span>
                        <span class="item-name-en">${item.nameEn}</span>
                    </div>
                    <span class="therapy-family-tag">${fam.icon || '🛡️'} ${fam.name}</span>
                `;
            } else if (effectiveType === 'pharmacology') {
                const fam = this.pharmacologyFamilies[item.family] || { name: item.family, icon: '💊' };
                div.innerHTML = `
                    <div class="item-main">
                        <span class="item-name-tr">${item.nameTr}</span>
                        <span class="item-name-en">${item.nameEn}</span>
                    </div>
                    <span class="pharma-family-tag">${fam.icon || '💊'} ${fam.name}</span>
                `;
            } else {
                const categoryObj = this.categories[item.category] || { name: item.category };
                div.innerHTML = `
                    <div class="item-main">
                        <span class="item-name-tr">${item.nameTr}</span>
                        <span class="item-name-en">${item.nameEn}</span>
                    </div>
                    <span class="item-category-badge">${categoryObj.icon || '🏷️'} ${categoryObj.name}</span>
                `;
            }

            div.addEventListener('click', () => this.selectItem(item));
            this.dom.autocompleteDropdown.appendChild(div);
        });

        this.dom.autocompleteDropdown.classList.add('open');
    }

    closeAutocomplete() {
        this.dom.autocompleteDropdown.classList.remove('open');
        this.selectedAutocompleteIndex = -1;
    }

    selectItem(item) {
        this.dom.diagnosisInput.value = item.nameTr;
        this.dom.diagnosisInput.dataset.selectedId = item.id;
        this.closeAutocomplete();
        this.submitGuess();
    }

    handleSearchKeydown(e) {
        const items = this.dom.autocompleteDropdown.querySelectorAll('.autocomplete-item');
        if (!this.dom.autocompleteDropdown.classList.contains('open') || items.length === 0) {
            if (e.key === 'Enter') this.submitGuess();
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.selectedAutocompleteIndex = (this.selectedAutocompleteIndex + 1) % items.length;
            this.updateAutocompleteSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selectedAutocompleteIndex = (this.selectedAutocompleteIndex - 1 + items.length) % items.length;
            this.updateAutocompleteSelection(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this.selectedAutocompleteIndex >= 0 && this.selectedAutocompleteIndex < this.autocompleteResults.length) {
                this.selectItem(this.autocompleteResults[this.selectedAutocompleteIndex]);
            } else {
                this.submitGuess();
            }
        } else if (e.key === 'Escape') {
            this.closeAutocomplete();
        }
    }

    updateAutocompleteSelection(items) {
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedAutocompleteIndex);
            if (index === this.selectedAutocompleteIndex) {
                item.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    // --- Submit Guess Logic (Diagnosis, Therapy, Pharmacology, and 3-Stage Combo) ---
    submitGuess() {
        if (this.isGameOver) return;

        const inputVal = this.dom.diagnosisInput.value.trim();
        const effectiveType = this.getEffectiveTargetType();

        if (!inputVal) {
            this.showToast("Lütfen bir seçim yazın veya soldaki kategorilerden seçin.");
            return;
        }

        const selectedId = this.dom.diagnosisInput.dataset.selectedId;
        const clean = this.normalizeTurkish(inputVal);

        let chosenObj = null;
        let isCorrect = false;
        let categoryMatch = false;
        let categoryName = '';
        let correctLabel = '';
        let wrongLabel = '';
        let stageBadge = '';

        if (effectiveType === 'therapy') {
            chosenObj = this.therapies.find(t => t.id === selectedId) ||
                this.therapies.find(t =>
                    this.normalizeTurkish(t.nameTr) === clean ||
                    this.normalizeTurkish(t.nameEn) === clean ||
                    (t.aliases && t.aliases.some(a => this.normalizeTurkish(a) === clean))
                );
            if (!chosenObj) {
                this.showToast("❓ Terapi listede bulunamadı! Lütfen önerilen listeden seçin.");
                return;
            }
            const targetTherapyId = this.currentCase.therapyId || 'cbt_general';
            const targetTherapyObj = this.therapies.find(t => t.id === targetTherapyId);
            isCorrect = (chosenObj.id === targetTherapyId);
            categoryMatch = (!isCorrect && targetTherapyObj && chosenObj.family === targetTherapyObj.family);
            const famObj = this.therapyFamilies[chosenObj.family] || {};
            categoryName = famObj.name || chosenObj.family;
            correctLabel = '🛡️ Altın Standart Terapi!';
            wrongLabel = 'Farklı Terapi Ekolü';
            if (this.targetGameMode === 'combo') stageBadge = 'Aşama 2 • Terapi';
        } else if (effectiveType === 'pharmacology') {
            chosenObj = this.pharmacology.find(p => p.id === selectedId) ||
                this.pharmacology.find(p =>
                    this.normalizeTurkish(p.nameTr) === clean ||
                    this.normalizeTurkish(p.nameEn) === clean ||
                    (p.aliases && p.aliases.some(a => this.normalizeTurkish(a) === clean))
                );
            if (!chosenObj) {
                this.showToast("❓ Farmakoterapi protokolü bulunamadı! Lütfen listeden seçin.");
                return;
            }
            const targetPharmaId = this.currentCase.pharmacologyId || this.getFallbackPharmacologyId(this.currentCase);
            const targetPharmaObj = this.pharmacology.find(p => p.id === targetPharmaId);
            isCorrect = (chosenObj.id === targetPharmaId);
            categoryMatch = (!isCorrect && targetPharmaObj && chosenObj.family === targetPharmaObj.family);
            const famObj = this.pharmacologyFamilies[chosenObj.family] || {};
            categoryName = famObj.name || chosenObj.family;
            correctLabel = '💊 Doğru Farmakoterapi Protokolü!';
            wrongLabel = 'Farklı İlaç Grubu';
            if (this.targetGameMode === 'combo') stageBadge = 'Aşama 3 • İlaç';
        } else {
            chosenObj = this.diagnoses.find(d => d.id === selectedId) ||
                this.diagnoses.find(d =>
                    this.normalizeTurkish(d.nameTr) === clean ||
                    this.normalizeTurkish(d.nameEn) === clean ||
                    (d.aliases && d.aliases.some(a => this.normalizeTurkish(a) === clean))
                );
            if (!chosenObj) {
                this.showToast("❓ Tanı listede bulunamadı! Lütfen önerilen tanı listesinden seçin.");
                return;
            }
            isCorrect = (chosenObj.id === this.currentCase.diagnosisId);
            const correctDiagnosisObj = this.diagnoses.find(d => d.id === this.currentCase.diagnosisId);
            categoryMatch = (!isCorrect && correctDiagnosisObj && chosenObj.category === correctDiagnosisObj.category);
            const categoryObj = this.categories[chosenObj.category] || {};
            categoryName = categoryObj.name || chosenObj.category;
            correctLabel = '🩺 Kesin DSM-5 Tanısı!';
            wrongLabel = 'Farklı Tanı Grubu';
            if (this.targetGameMode === 'combo') stageBadge = 'Aşama 1 • Tanı';
        }

        if (this.guesses.some(g => g.itemId === chosenObj.id && g.stage === this.comboStage)) {
            this.showToast("⚠️ Bu seçeneği zaten tahmin ettiniz!");
            return;
        }

        const guessData = {
            itemId: chosenObj.id,
            diagnosisId: effectiveType === 'diagnosis' ? chosenObj.id : undefined,
            therapyId: effectiveType === 'therapy' ? chosenObj.id : undefined,
            pharmacologyId: effectiveType === 'pharmacology' ? chosenObj.id : undefined,
            stage: this.comboStage,
            stageBadge,
            nameTr: chosenObj.nameTr,
            isCorrect,
            categoryMatch,
            categoryName,
            correctLabel,
            wrongLabel
        };

        this.guesses.push(guessData);
        this.dom.diagnosisInput.value = '';
        delete this.dom.diagnosisInput.dataset.selectedId;
        this.closeAutocomplete();

        this.playTone(isCorrect ? 'win' : (categoryMatch ? 'warm' : 'cold'));

        // Broadcast live duel progress if in room duel
        this.broadcastDuelProgress(false);

        if (isCorrect) {
            if (this.targetGameMode === 'combo' && this.comboStage < 3) {
                // Advance to next Combo Stage!
                if (this.comboStage === 1) {
                    this.comboResults.stage1Guesses = this.guesses.filter(g => g.stage === 1).length;
                    if (this.dom.comboStep1Val) this.dom.comboStep1Val.textContent = `✅ ${chosenObj.nameTr}`;
                    if (this.dom.comboStep2Val) this.dom.comboStep2Val.textContent = 'Şimdi Terapiyi Seçin!';
                    this.comboStage = 2;
                    this.guesses = []; // Reset 6-guess allowance for Stage 2
                    this.updateComboStepperUI();
                    this.syncInputAndBrowserLabels();
                    this.renderGuesses();
                    this.updateRemainingGuessesUI();
                    this.showToast("🎉 Aşama 1 (Tanı) Tamamlandı! Şimdi Aşama 2: Altın Standart Psikoterapiyi Seçin!");
                    return;
                } else if (this.comboStage === 2) {
                    this.comboResults.stage2Guesses = this.guesses.filter(g => g.stage === 2).length;
                    if (this.dom.comboStep2Val) this.dom.comboStep2Val.textContent = `✅ ${chosenObj.nameTr}`;
                    if (this.dom.comboStep3Val) this.dom.comboStep3Val.textContent = 'Şimdi Farmakoterapiyi Seçin!';
                    this.comboStage = 3;
                    this.guesses = []; // Reset 6-guess allowance for Stage 3
                    this.updateComboStepperUI();
                    this.syncInputAndBrowserLabels();
                    this.renderGuesses();
                    this.updateRemainingGuessesUI();
                    this.showToast("🛡️ Aşama 2 (Terapi) Tamamlandı! Şimdi Aşama 3: Birinci Basamak İlacı/Müdahaleyi Seçin!");
                    return;
                }
            }

            if (this.targetGameMode === 'combo' && this.comboStage === 3) {
                this.comboResults.stage3Guesses = this.guesses.filter(g => g.stage === 3).length;
                if (this.dom.comboStep3Val) this.dom.comboStep3Val.textContent = `✅ ${chosenObj.nameTr}`;
            }

            this.handleGameEnd(true);
        } else {
            if (this.unlockedClues < this.maxClues) {
                this.unlockedClues++;
            }

            if (this.guesses.length >= this.maxClues) {
                this.handleGameEnd(false);
            } else {
                this.renderClues();
                this.renderGuesses();
                this.updateRemainingGuessesUI();

                if (categoryMatch) {
                    this.showToast(`🟨 Sıcak! Grup Doğru (${guessData.categoryName}), spesifik seçeneği daraltın!`);
                } else {
                    this.showToast(`Yeni ipucu açıldı! 🔍 (${this.unlockedClues}/${this.maxClues})`);
                }
            }
        }
    }

    giveUp() {
        if (this.isGameOver) return;
        this.unlockedClues = this.maxClues;
        this.handleGameEnd(false);
    }

    handleGameEnd(won) {
        this.isGameOver = true;
        this.gameWon = won;
        this.dom.diagnosisInput.disabled = true;
        this.dom.btnSubmit.disabled = true;

        if (this.dom.finishedActions) this.dom.finishedActions.style.display = 'flex';
        if (this.dom.mainInputSection) this.dom.mainInputSection.style.display = 'none';

        this.unlockedClues = this.maxClues;
        this.updateComboStepperUI();

        if (won && this.currentCase) {
            this.markCaseAsSolved(this.currentCase.id);
        }

        this.renderClues();
        this.renderGuesses();
        this.updateRemainingGuessesUI();

        this.recordStats(won, this.guesses.length);
        this.broadcastDuelProgress(true, won);

        if (won) {
            this.launchConfetti();
        }

        setTimeout(() => {
            this.openResultModal(won);
        }, 500);
    }

    openResultModal(won) {
        const correctDiag = this.diagnoses.find(d => d.id === this.currentCase.diagnosisId);
        const correctName = correctDiag ? correctDiag.nameTr : "Belirtilmemiş Tanı";
        const correctEn = correctDiag ? correctDiag.nameEn : "";

        const targetTherapyId = this.currentCase.therapyId || 'cbt_general';
        const targetTherapy = this.therapies.find(t => t.id === targetTherapyId);

        const targetPharmaId = this.currentCase.pharmacologyId || this.getFallbackPharmacologyId(this.currentCase);
        const targetPharma = this.pharmacology.find(p => p.id === targetPharmaId);

        const banner = document.getElementById('resultBanner');
        const icon = document.getElementById('resultIcon');
        const heading = document.getElementById('resultHeading');
        const diagNameEl = document.getElementById('resultDiagnosisName');
        const diagEnEl = document.getElementById('resultDiagnosisEn');
        const diffDiagEl = document.getElementById('resultDiffDiag');
        const dsmCriteriaEl = document.getElementById('resultDsmCriteria');
        const shareScoreTextEl = document.getElementById('shareScoreText');

        if (this.targetGameMode === 'therapy') {
            banner.className = won ? 'result-banner success' : 'result-banner failure';
            icon.textContent = won ? '🛡️' : '📋';
            heading.textContent = won ? `Harika Terapist! ${this.guesses.length}. Tahminde Bildiniz!` : `Terapi Simülasyonu Tamamlandı`;
            diagNameEl.innerHTML = `<span style="color: #10b981;">🛡️ ${targetTherapy ? targetTherapy.nameTr : 'Kanıta Dayalı Psikoterapi'}</span>`;
            diagEnEl.innerHTML = `Hedef DSM-5 Tanısı: <strong>${correctName}</strong> (${correctEn})`;
        } else if (this.targetGameMode === 'pharmacology') {
            banner.className = won ? 'result-banner success' : 'result-banner failure';
            icon.textContent = won ? '💊' : '📋';
            heading.textContent = won ? `Uzman Psikofarmakolog! ${this.guesses.length}. Tahminde Bildiniz!` : `Farmakoterapi Simülasyonu Tamamlandı`;
            diagNameEl.innerHTML = `<span style="color: #fb7185;">💊 ${targetPharma ? targetPharma.nameTr : 'Birinci Basamak Farmakoterapi'}</span>`;
            diagEnEl.innerHTML = `Hedef DSM-5 Tanısı: <strong>${correctName}</strong> | Terapi: <strong>${targetTherapy ? targetTherapy.nameTr : ''}</strong>`;
        } else if (this.targetGameMode === 'combo') {
            banner.className = won ? 'result-banner success' : 'result-banner failure';
            icon.textContent = won ? '⚡' : '🩺';
            heading.textContent = won ? `Tam Konsültasyon Ustası! 3 Aşamayı da Tamamladınız!` : `Konsültasyon Raporu`;
            diagNameEl.textContent = correctName;
            diagEnEl.innerHTML = `🛡️ ${targetTherapy ? targetTherapy.nameTr : ''} • 💊 ${targetPharma ? targetPharma.nameTr : ''}`;
        } else {
            banner.className = won ? 'result-banner success' : 'result-banner failure';
            icon.textContent = won ? '🎉' : '🩺';
            heading.textContent = won ? `Tebrikler! ${this.guesses.length}. İpucunda Bildiniz! (${this.elapsedSeconds} sn)` : `Vaka Tamamlandı`;
            diagNameEl.textContent = correctName;
            diagEnEl.textContent = correctEn;
        }

        // Combo Summary Box
        const comboBox = document.getElementById('comboSummaryBox');
        if (comboBox) {
            if (this.targetGameMode === 'combo') {
                comboBox.style.display = 'block';
                const totalScore = won ? Math.max(100, 300 - ((this.comboResults.stage1Guesses - 1) * 20) - ((this.comboResults.stage2Guesses - 1) * 20) - ((this.comboResults.stage3Guesses - 1) * 20)) : 0;
                comboBox.innerHTML = `
                    <div class="edu-title" style="color: #fbbf24;">⚡ 3 Aşamalı Tam Konsültasyon Karnesi (${totalScore} / 300 Puan)</div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-top: 0.5rem; font-size: 0.84rem;">
                        <div style="background: var(--bg-secondary); padding: 0.6rem; border-radius: 8px;">
                            <strong>1. Tanı:</strong><br>${correctName}<br><span style="color:#34d399;">${this.comboResults.stage1Guesses || '-'} deneme</span>
                        </div>
                        <div style="background: var(--bg-secondary); padding: 0.6rem; border-radius: 8px;">
                            <strong>2. Psikoterapi:</strong><br>${targetTherapy ? targetTherapy.nameTr : '-'}<br><span style="color:#34d399;">${this.comboResults.stage2Guesses || '-'} deneme</span>
                        </div>
                        <div style="background: var(--bg-secondary); padding: 0.6rem; border-radius: 8px;">
                            <strong>3. Farmakoterapi:</strong><br>${targetPharma ? targetPharma.nameTr : '-'}<br><span style="color:#34d399;">${this.comboResults.stage3Guesses || '-'} deneme</span>
                        </div>
                    </div>
                `;
            } else {
                comboBox.style.display = 'none';
            }
        }

        // Render Duel Comparison Podium if Duel is Active
        this.renderDuelPodium(won);

        diffDiagEl.textContent = this.currentCase.differentialDiagnosis || 'Ayırıcı tanı bilgisi bulunmuyor.';

        // 1. Detaylı Klinik Tanım
        const clinicalEl = document.getElementById('resultClinicalOverview');
        const manualData = (typeof DSM5_MANUAL !== 'undefined') ? DSM5_MANUAL[this.currentCase.diagnosisId] : null;

        if (clinicalEl) {
            if (manualData && manualData.clinicalDescription) {
                const desc = manualData.clinicalDescription;
                clinicalEl.innerHTML = `
                    <div class="clinical-overview-grid">
                        <div class="clinical-subcard">
                            <div class="clinical-subcard-title"><span>📌</span> Klinik Tablo & Genel Bakış</div>
                            <div class="clinical-subcard-text">${desc.overview || ''}</div>
                        </div>
                        <div class="clinical-subcard">
                            <div class="clinical-subcard-title"><span>📊</span> Yaygınlık & Başlangıç Yaşı</div>
                            <div class="clinical-subcard-text">${desc.epidemiology || ''}</div>
                        </div>
                        <div class="clinical-subcard">
                            <div class="clinical-subcard-title"><span>🧬</span> Etiyoloji & Bilişsel-Dinamik Model</div>
                            <div class="clinical-subcard-text">${desc.etiology || ''}</div>
                        </div>
                        <div class="clinical-subcard">
                            <div class="clinical-subcard-title"><span>🔮</span> Klinik Seyir & Prognoz</div>
                            <div class="clinical-subcard-text">${desc.prognosis || ''}</div>
                        </div>
                    </div>
                `;
            } else {
                clinicalEl.innerHTML = `<div style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${correctName} (${correctEn}), DSM-5-TR sınıflamasında yer alan klinik tablolardandır.</div>`;
            }
        }

        // 2. Resmi DSM-5 Tanı Kriterleri
        const fullCriteriaEl = document.getElementById('resultDsmFullCriteria');
        if (fullCriteriaEl) {
            if (manualData && manualData.criteriaList && manualData.criteriaList.length > 0) {
                let fullHTML = `<div class="dsm-criteria-container">`;
                manualData.criteriaList.forEach(crit => {
                    let itemsHTML = '';
                    if (crit.items && crit.items.length > 0) {
                        itemsHTML += `<div class="dsm-criterion-items-list">`;
                        crit.items.forEach(it => {
                            itemsHTML += `<div class="dsm-criterion-item-row">• ${it}</div>`;
                        });
                        itemsHTML += `</div>`;
                    }
                    fullHTML += `
                        <div class="dsm-criterion-card">
                            <div class="dsm-criterion-header">
                                <span class="dsm-criterion-badge">${crit.code}</span>
                                <span class="dsm-criterion-title">${crit.title}</span>
                            </div>
                            <div class="dsm-criterion-desc">${crit.content || ''}</div>
                            ${itemsHTML}
                        </div>
                    `;
                });
                fullHTML += `</div>`;
                fullCriteriaEl.innerHTML = fullHTML;
            } else {
                fullCriteriaEl.innerHTML = `<div style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${this.currentCase.dsmCriteriaSummary || 'DSM-5 tanı kriterleri özeti mevcut.'}</div>`;
            }
        }

        // 3. Vakadaki Belirti ➔ DSM-5 Eşleştirmeleri
        let criteriaHTML = `<div style="margin-bottom: 0.75rem; line-height: 1.6;">${this.currentCase.dsmCriteriaSummary || 'DSM-5 kriter özeti bulunuyor.'}</div>`;
        if (this.currentCase.symptomHighlights && this.currentCase.symptomHighlights.length > 0) {
            criteriaHTML += `<div style="display: flex; flex-direction: column; gap: 0.45rem;">`;
            this.currentCase.symptomHighlights.forEach(hl => {
                criteriaHTML += `
                    <div style="background: rgba(99, 102, 241, 0.1); border-left: 3px solid var(--accent-primary); padding: 0.5rem 0.75rem; border-radius: 4px; font-size: 0.86rem; line-height: 1.5;">
                        <span style="color: var(--text-primary); font-weight: 600;">"${hl.text}"</span> ➔ <strong style="color: #34d399;">${hl.dsmMatch}</strong>
                    </div>
                `;
            });
            criteriaHTML += `</div>`;
        }
        dsmCriteriaEl.innerHTML = criteriaHTML;

        this.renderMiniQuiz();
        this.renderTherapyCard(targetPharma);

        const shareString = this.generateShareString(won);
        shareScoreTextEl.textContent = shareString;

        const btnCopyScore = document.getElementById('btnCopyScore');
        if (btnCopyScore) {
            btnCopyScore.onclick = () => {
                navigator.clipboard.writeText(shareString);
                this.showToast("📋 Skor ve vaka linki panoya kopyalandı!");
            };
        }

        const btnShareWA = document.getElementById('btnShareWhatsApp');
        if (btnShareWA) {
            btnShareWA.onclick = () => {
                const duelUrl = this.buildCurrentCaseDuelLink();
                const waText = `${shareString}\n⚔️ Aynı vakada beni geçebilir misin? Tıkla ve çöz:\n${duelUrl}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`, '_blank');
            };
        }

        const btnChallengeLink = document.getElementById('btnChallengeFriendLink');
        if (btnChallengeLink) {
            btnChallengeLink.onclick = () => {
                const duelUrl = this.buildCurrentCaseDuelLink();
                navigator.clipboard.writeText(duelUrl);
                this.showToast("⚔️ Meydan okuma düello linki kopyalandı! Arkadaşına gönder!");
            };
        }

        const btnNextPractice = document.getElementById('btnNextPractice');
        if (btnNextPractice) {
            btnNextPractice.onclick = () => {
                this.closeModal(this.dom.resultModal);
                if (this.activeDuelChallenge && this.activeDuelChallenge.isRoomDuel) {
                    this.nextRoomDuelCase();
                } else {
                    this.setMode('practice');
                }
            };
        }

        this.openModal(this.dom.resultModal);
    }

    renderMiniQuiz() {
        const quizBox = document.getElementById('resultMiniQuizBox');
        const quizQ = document.getElementById('quizQuestion');
        const quizList = document.getElementById('quizOptionsList');
        const quizExp = document.getElementById('quizExplanation');

        if (!quizBox || !quizQ || !quizList || !quizExp) return;

        const quizData = this.currentCase.miniQuiz;
        if (!quizData) {
            quizBox.style.display = 'none';
            return;
        }

        quizBox.style.display = 'block';
        quizQ.textContent = quizData.question;
        quizList.innerHTML = '';
        quizExp.style.display = 'none';
        quizExp.innerHTML = '';

        quizData.options.forEach((optText, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opt-btn';
            btn.textContent = `${String.fromCharCode(65 + idx)}) ${optText}`;

            btn.onclick = () => {
                quizList.querySelectorAll('.quiz-opt-btn').forEach(b => b.disabled = true);
                if (idx === quizData.correctIndex) {
                    btn.classList.add('correct');
                    this.playTone('warm');
                    quizExp.innerHTML = `<strong>✅ Doğru Cevap!</strong><br>${quizData.explanation}`;
                } else {
                    btn.classList.add('wrong');
                    const correctBtn = quizList.querySelectorAll('.quiz-opt-btn')[quizData.correctIndex];
                    if (correctBtn) correctBtn.classList.add('correct');
                    quizExp.innerHTML = `<strong>❌ Yanıt:</strong> ${String.fromCharCode(65 + quizData.correctIndex)} seçeneği doğruydu.<br>${quizData.explanation}`;
                }
                quizExp.style.display = 'block';
            };

            quizList.appendChild(btn);
        });
    }

    renderTherapyCard(targetPharma) {
        const therapyBox = document.getElementById('resultTherapyBox');
        const goldEl = document.getElementById('therapyGold');
        const descEl = document.getElementById('therapyDesc');
        const pharmEl = document.getElementById('therapyPharm');

        if (!therapyBox || !goldEl || !descEl || !pharmEl) return;

        const therapyData = this.currentCase.treatmentModality;
        if (!therapyData) {
            therapyBox.style.display = 'none';
            return;
        }

        therapyBox.style.display = 'block';
        goldEl.textContent = therapyData.goldStandardTherapy;
        descEl.textContent = therapyData.therapyDetails;
        const pharmaName = targetPharma ? `[${targetPharma.nameTr}] ` : '';
        pharmEl.textContent = `💊 Birinci Basamak Farmakoterapi: ${pharmaName}${therapyData.pharmacologyNote || ''}`;
    }

    // --- Built-in Pack Shelf & Custom Pack Library ---
    openCaseManagerModal() {
        this.renderPackShelf();
        this.openModal(this.dom.caseManagerModal);
    }

    renderPackShelf() {
        const shelfEl = document.getElementById('builtInPackShelf');
        const totalCountEl = document.getElementById('totalCasesCount');
        const savedListEl = document.getElementById('savedCustomPacksList');

        if (totalCountEl) {
            const solvedInActive = this.cases.filter(c => this.solvedCaseIds.has(c.id)).length;
            totalCountEl.textContent = `${this.cases.length} Vaka (Çözülen: ${solvedInActive} / ${this.cases.length})`;
        }

        if (shelfEl) {
            shelfEl.innerHTML = '';
            const packs = this.getBuiltInPacksDefinition();
            packs.forEach(pk => {
                const packCases = this.allMasterCases.filter(pk.filterFn);
                const solvedCount = packCases.filter(c => this.solvedCaseIds.has(c.id)).length;
                const pct = packCases.length > 0 ? Math.round((solvedCount / packCases.length) * 100) : 0;

                const card = document.createElement('div');
                card.className = `pack-card ${this.activePackId === pk.id ? 'active' : ''}`;
                card.innerHTML = `
                    <div>
                        <div class="pack-card-header">
                            <span class="pack-card-title">${pk.title}</span>
                            <span class="pack-card-badge">${pk.badge}</span>
                        </div>
                        <p class="pack-card-desc" style="margin-top: 0.35rem;">${pk.desc}</p>
                    </div>
                    <div>
                        <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--text-muted); margin-bottom:4px;">
                            <span>İlerleme: ${solvedCount}/${packCases.length}</span>
                            <span>%${pct}</span>
                        </div>
                        <div class="pack-progress-bar">
                            <div class="pack-progress-fill" style="width: ${pct}%;"></div>
                        </div>
                    </div>
                `;
                card.onclick = () => {
                    this.applyActivePack(pk.id, true);
                    this.closeModal(this.dom.caseManagerModal);
                    this.showToast(`📦 "${pk.title}" seçildi (${packCases.length} Vaka)!`);
                };
                shelfEl.appendChild(card);
            });
        }

        if (savedListEl) {
            savedListEl.innerHTML = '';
            if (this.savedCustomPacks.length === 0) {
                savedListEl.innerHTML = `<div style="font-size: 0.82rem; color: var(--text-muted); font-style: italic;">Henüz özel bir JSON paketi kaydetmediniz. Aşağıdan yüklediğiniz paketler burada kalıcı olarak listelenir.</div>`;
            } else {
                this.savedCustomPacks.forEach(cp => {
                    const row = document.createElement('div');
                    row.style.cssText = 'display:flex; justify-content:space-between; align-items:center; background:var(--bg-secondary); padding:0.65rem 0.9rem; border-radius:10px; border:1px solid var(--border-color); gap:0.5rem;';
                    const isCurrent = this.activePackId === cp.id;
                    row.innerHTML = `
                        <div>
                            <strong style="font-size:0.88rem; color:${isCurrent ? 'var(--accent-emerald)' : 'var(--text-primary)'};">📦 ${cp.name}</strong>
                            <span style="font-size:0.76rem; color:var(--text-muted); margin-left:6px;">(${cp.cases.length} Vaka)</span>
                        </div>
                        <div style="display:flex; gap:0.4rem;">
                            <button class="btn-primary btn-play-cp" style="padding:0.35rem 0.75rem; font-size:0.78rem;">${isCurrent ? '✅ Aktif' : '▶️ Oyna'}</button>
                            <button class="btn-secondary btn-del-cp" style="padding:0.35rem 0.6rem; font-size:0.78rem; color:#f43f5e;">🗑️</button>
                        </div>
                    `;
                    row.querySelector('.btn-play-cp').onclick = () => {
                        this.applyActivePack(cp.id, true);
                        this.closeModal(this.dom.caseManagerModal);
                        this.showToast(`📦 "${cp.name}" paketi aktif edildi!`);
                    };
                    row.querySelector('.btn-del-cp').onclick = () => {
                        this.savedCustomPacks = this.savedCustomPacks.filter(x => x.id !== cp.id);
                        this.saveCustomPacksToStorage();
                        if (this.activePackId === cp.id) this.applyActivePack('all', true);
                        else this.renderPackShelf();
                    };
                    savedListEl.appendChild(row);
                });
            }
        }

        this.renderSolvedArchiveList();
    }

    renderSolvedArchiveList() {
        const archiveEl = document.getElementById('solvedArchiveList');
        if (!archiveEl) return;
        archiveEl.innerHTML = '';

        // Gather all unique cases across master + custom packs that are solved
        const allAvailableMap = new Map();
        this.allMasterCases.forEach(c => allAvailableMap.set(c.id, c));
        this.savedCustomPacks.forEach(cp => {
            if (Array.isArray(cp.cases)) {
                cp.cases.forEach(c => {
                    if (!allAvailableMap.has(c.id)) allAvailableMap.set(c.id, c);
                });
            }
        });

        const solvedCases = [];
        this.solvedCaseIds.forEach(id => {
            if (allAvailableMap.has(id)) {
                solvedCases.push(allAvailableMap.get(id));
            }
        });

        if (solvedCases.length === 0) {
            archiveEl.innerHTML = `<div style="font-size: 0.82rem; color: var(--text-muted); font-style: italic; padding: 0.4rem;">Henüz çözülmüş vakanız bulunmuyor. Bir vakayı doğru çözdüğünüzde otomatik olarak bu arşive eklenir.</div>`;
            return;
        }

        solvedCases.forEach(c => {
            const diagObj = this.diagnoses.find(d => d.id === c.diagnosisId);
            const diagName = diagObj ? diagObj.nameTr : c.diagnosisId;
            const row = document.createElement('div');
            row.style.cssText = 'display:flex; justify-content:space-between; align-items:center; background:var(--bg-secondary); padding:0.55rem 0.85rem; border-radius:10px; border:1px solid var(--border-color); gap:0.5rem; flex-wrap:wrap;';
            row.innerHTML = `
                <div style="flex:1; min-width:180px;">
                    <div style="font-size:0.84rem; font-weight:700; color:var(--text-primary);">
                        <span style="color:#c084fc; font-family:var(--font-mono);">Vaka #${c.caseNumber}</span> • ${diagName}
                    </div>
                    <div style="font-size:0.75rem; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:360px;">
                        ${c.patientSummary || ''}
                    </div>
                </div>
                <div style="display:flex; gap:0.35rem;">
                    <button class="btn-secondary btn-archive-report" style="padding:0.3rem 0.65rem; font-size:0.75rem;">📋 Raporu Gör</button>
                    <button class="btn-primary btn-archive-replay" style="padding:0.3rem 0.65rem; font-size:0.75rem;">🔄 Tekrar Çöz</button>
                </div>
            `;

            row.querySelector('.btn-archive-report').onclick = () => {
                this.closeModal(this.dom.caseManagerModal);
                this.currentMode = 'practice';
                this.startCase(c, `🗄️ Arşiv: Vaka #${c.caseNumber}`);
                this.unlockedClues = this.maxClues;
                this.isGameOver = true;
                this.gameWon = true;
                this.renderClues();
                this.openResultModal(true);
            };

            row.querySelector('.btn-archive-replay').onclick = () => {
                this.closeModal(this.dom.caseManagerModal);
                this.currentMode = 'practice';
                this.startCase(c, `🔄 Arşiv Tekrarı: Vaka #${c.caseNumber}`);
                this.showToast(`🔄 Vaka #${c.caseNumber} arşivden tekrar çözülmek üzere açıldı!`);
            };

            archiveEl.appendChild(row);
        });
    }

    exportMasterCasesJS() {
        const merged = [...this.allMasterCases];
        const existingIds = new Set(merged.map(c => c.id));
        let nextNum = merged.reduce((max, c) => Math.max(max, Number(c.caseNumber) || 0), 0) + 1;

        this.savedCustomPacks.forEach(cp => {
            if (Array.isArray(cp.cases)) {
                cp.cases.forEach(c => {
                    if (!existingIds.has(c.id)) {
                        const clone = { ...c };
                        clone.caseNumber = nextNum;
                        clone.id = `case-${String(nextNum).padStart(3, '0')}`;
                        clone.pharmacologyId = clone.pharmacologyId || this.getFallbackPharmacologyId(clone);
                        merged.push(clone);
                        existingIds.add(clone.id);
                        nextNum++;
                    }
                });
            }
        });

        this.allMasterCases = merged;
        const jsContent = `/**\n * PsikoVaka 2.0 - Birleştirilmiş Klinik Vaka Veritabanı (${merged.length} Vaka)\n * Otomatik oluşturuldu: ${new Date().toISOString()}\n */\nconst CLINICAL_CASES = ${JSON.stringify(merged, null, 4)};\n`;
        const blob = new Blob([jsContent], { type: 'application/javascript;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `cases.js`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.renderPackShelf();
        this.showToast(`🚀 Toplam ${merged.length} vakalık "cases.js" indirildi! GitHub'daki js/cases.js üzerine yükleyebilirsiniz!`);
    }

    exportCasesJSON() {
        const jsonStr = JSON.stringify(this.cases, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `psikovaka_paket_${this.activePackId}_${this.getDailySeed()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast("💾 Aktif vaka paketi JSON olarak indirildi!");
    }

    processAndSaveImportedCases(rawArray, defaultName) {
        if (!Array.isArray(rawArray) || rawArray.length === 0) {
            throw new Error("JSON geçerli bir vaka listesi (Array) içermelidir.");
        }

        const validCases = [];
        rawArray.forEach((newCase, idx) => {
            if (newCase.diagnosisId && Array.isArray(newCase.clues) && newCase.clues.length >= 6) {
                if (!newCase.id) newCase.id = `custom-pack-${Date.now()}-${idx + 1}`;
                if (!newCase.caseNumber) newCase.caseNumber = idx + 1;
                newCase.pharmacologyId = newCase.pharmacologyId || this.getFallbackPharmacologyId(newCase);
                validCases.push(newCase);
            }
        });

        if (validCases.length === 0) {
            throw new Error("6 ipucuna sahip geçerli klinik vaka bulunamadı.");
        }

        const nameInput = document.getElementById('customPackNameInput');
        const customName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : defaultName;
        const packId = `custom_${Date.now()}`;

        this.savedCustomPacks.unshift({
            id: packId,
            name: customName,
            cases: validCases,
            createdAt: new Date().toISOString()
        });
        this.saveCustomPacksToStorage();
        if (nameInput) nameInput.value = '';

        this.applyActivePack(packId, true);
        this.closeModal(this.dom.caseManagerModal);
        this.showToast(`🎉 "${customName}" (${validCases.length} vaka) kütüphaneye kaydedildi ve başlatıldı!`);
    }

    handleImportJSON(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                const cleanFileName = file.name.replace(/\.json$/i, '');
                this.processAndSaveImportedCases(imported, cleanFileName);
                e.target.value = '';
            } catch (err) {
                this.showToast("⚠️ Geçersiz JSON dosyası! " + (err.message || ""));
            }
        };
        reader.readAsText(file);
    }

    handleImportPastedJSON() {
        const textarea = document.getElementById('pasteJsonTextarea');
        if (!textarea || !textarea.value.trim()) {
            this.showToast("⚠️ Lütfen önce JSON metnini kutuya yapıştırın.");
            return;
        }
        try {
            const parsed = JSON.parse(textarea.value.trim());
            this.processAndSaveImportedCases(parsed, `Yapıştırılan Paket #${this.savedCustomPacks.length + 1}`);
            textarea.value = '';
        } catch (err) {
            this.showToast("⚠️ Yapıştırılan JSON formatı hatalı: " + (err.message || ""));
        }
    }

    // --- Live Duel & Challenge Link System ---
    openDuelCenterModal() {
        const nickInput = document.getElementById('duelNicknameInput');
        if (nickInput) {
            nickInput.value = this.duelMyNickname;
            nickInput.onchange = () => {
                this.duelMyNickname = nickInput.value.trim() || 'Klinisyen';
                localStorage.setItem('psikovaka_nickname', this.duelMyNickname);
            };
        }

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
                this.showToast("⚔️ Düello linki kopyalandı! Arkadaşına gönder!");
            };
        }

        const btnWaDuel = document.getElementById('btnWhatsappCurrentDuel');
        if (btnWaDuel) {
            btnWaDuel.onclick = () => {
                this.saveDuelNicknameFromModal();
                const link = this.buildCurrentCaseDuelLink();
                const caseNum = this.currentCase ? this.currentCase.caseNumber : 1;
                const msg = `⚔️ *PsikoVaka Klinik Düello Daveti!*\n\n🧑‍⚕️ *${this.duelMyNickname}* seni *Vaka #${caseNum}* üzerinde düelloya davet ediyor!\nBakalım kaçıncı ipucunda doğru tanıyı koyabileceksin?\n\n👉 Hemen tıkla ve yarışa başla:\n${link}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
            };
        }

        this.openModal(this.dom.duelCenterModal);
    }

    saveDuelNicknameFromModal() {
        const nickInput = document.getElementById('duelNicknameInput');
        if (nickInput && nickInput.value.trim()) {
            this.duelMyNickname = nickInput.value.trim();
            localStorage.setItem('psikovaka_nickname', this.duelMyNickname);
        }
    }

    buildCurrentCaseDuelLink() {
        const c = this.currentCase || this.cases[0];
        const payload = {
            caseId: c.id,
            caseNumber: c.caseNumber,
            mode: this.targetGameMode,
            challengerName: this.duelMyNickname || 'Klinisyen',
            challengerGuesses: this.isGameOver && this.gameWon ? this.guesses.length : null,
            challengerTimeSec: this.isGameOver && this.gameWon ? this.elapsedSeconds : null
        };
        const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
        return `${window.location.origin}${window.location.pathname}#duel=${encoded}`;
    }

    startDuelChallenge(caseObj, duelData) {
        this.activeDuelChallenge = {
            ...duelData,
            isRoomDuel: false
        };
        if (this.dom.duelHudBanner) {
            this.dom.duelHudBanner.style.display = 'flex';
            if (this.dom.duelMyName) this.dom.duelMyName.textContent = this.duelMyNickname;
            if (this.dom.duelMyScoreBadge) this.dom.duelMyScoreBadge.textContent = 'Yarışıyor...';
            if (this.dom.duelOpponentName) this.dom.duelOpponentName.textContent = duelData.challengerName || 'Rakip Klinisyen';
            if (this.dom.duelOpponentStatus) {
                if (duelData.challengerGuesses) {
                    this.dom.duelOpponentStatus.textContent = `🎯 ${duelData.challengerGuesses}/6 İpucu • ${duelData.challengerTimeSec || 30} sn`;
                } else {
                    this.dom.duelOpponentStatus.textContent = `⚔️ Meydan Okudu`;
                }
            }
        }
        this.startCase(caseObj, `⚔️ Düello: Vaka #${caseObj.caseNumber}`);
        this.showToast(`⚔️ ${duelData.challengerName || 'Arkadaşın'} sana bu vakayla meydan okudu!`);
    }

    // --- Global Automatic Matchmaking ("Canlı Rakip Ara") ---
    startMatchmaking() {
        this.saveDuelNicknameFromModal();
        this.cancelMatchmaking(false);

        const statusBox = document.getElementById('matchmakingStatusBox');
        const statusText = document.getElementById('matchmakingStatusText');
        const btnStart = document.getElementById('btnStartMatchmaking');

        if (statusBox) statusBox.style.display = 'block';
        if (btnStart) btnStart.disabled = true;
        if (statusText) statusText.textContent = '📡 Küresel Lobi Taranıyor... Aktif rakip aranıyor...';

        this.isMatchmaking = true;
        const myToken = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

        // 1. Local multi-tab instant matchmaking via BroadcastChannel
        if (typeof BroadcastChannel !== 'undefined') {
            this.mmChannel = new BroadcastChannel('psikovaka_global_matchmaking');
            this.mmChannel.onmessage = (ev) => {
                if (!this.isMatchmaking || !ev.data) return;
                const msg = ev.data;
                if (msg.type === 'MM_SEEK' && msg.token !== myToken) {
                    const roomCode = 'MM' + Math.floor(10 + Math.random() * 89);
                    this.mmChannel.postMessage({
                        type: 'MM_PAIR',
                        targetToken: msg.token,
                        roomCode,
                        hostNickname: this.duelMyNickname
                    });
                    this.finishMatchmakingAndLaunch(roomCode, true, msg.nickname || 'Rakip Klinisyen');
                } else if (msg.type === 'MM_PAIR' && msg.targetToken === myToken) {
                    this.finishMatchmakingAndLaunch(msg.roomCode, false, msg.hostNickname || 'Rakip Klinisyen');
                }
            };
            this.mmChannel.postMessage({ type: 'MM_SEEK', token: myToken, nickname: this.duelMyNickname });
        }

        // 2. Worldwide cross-device matchmaking via PeerJS public lobby slot
        if (typeof Peer !== 'undefined') {
            const lobbyId = 'psikovaka-global-mm-lobby-v2';
            try {
                const seekerPeer = new Peer();
                this.mmPeer = seekerPeer;
                let matchedOrClaimed = false;

                seekerPeer.on('open', () => {
                    const conn = seekerPeer.connect(lobbyId, { reliable: true });
                    const fallbackTimer = setTimeout(() => {
                        if (!matchedOrClaimed && this.isMatchmaking) {
                            matchedOrClaimed = true;
                            this.claimMatchmakingLobbyHost(lobbyId, statusText);
                        }
                    }, 2200);

                    conn.on('open', () => {
                        clearTimeout(fallbackTimer);
                        conn.send({ type: 'MM_JOIN_REQUEST', nickname: this.duelMyNickname });
                    });

                    conn.on('data', (data) => {
                        if (data && data.type === 'MM_MATCH_CONFIRMED' && data.roomCode) {
                            matchedOrClaimed = true;
                            clearTimeout(fallbackTimer);
                            this.finishMatchmakingAndLaunch(data.roomCode, false, data.hostNickname || 'Rakip Klinisyen');
                        }
                    });
                });

                seekerPeer.on('error', () => {
                    if (!matchedOrClaimed && this.isMatchmaking) {
                        matchedOrClaimed = true;
                        this.claimMatchmakingLobbyHost(lobbyId, statusText);
                    }
                });
            } catch (e) {
                console.warn("Matchmaking PeerJS hatası:", e);
            }
        }
    }

    claimMatchmakingLobbyHost(lobbyId, statusText) {
        if (!this.isMatchmaking) return;
        if (this.mmPeer) {
            try { this.mmPeer.destroy(); } catch (e) {}
            this.mmPeer = null;
        }
        try {
            const hostPeer = new Peer(lobbyId);
            this.mmPeer = hostPeer;
            hostPeer.on('open', () => {
                if (statusText) {
                    statusText.textContent = '🟢 Küresel Lobiye Bağlandı! Sitede "Rakip Ara" diyen ilk oyuncuyla otomatik eşleşeceksiniz...';
                }
            });
            hostPeer.on('connection', (conn) => {
                conn.on('data', (data) => {
                    if (data && data.type === 'MM_JOIN_REQUEST' && this.isMatchmaking) {
                        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                        const roomCode = 'M' + chars.charAt(Math.floor(Math.random() * chars.length)) +
                            chars.charAt(Math.floor(Math.random() * chars.length)) +
                            chars.charAt(Math.floor(Math.random() * chars.length));
                        conn.send({
                            type: 'MM_MATCH_CONFIRMED',
                            roomCode,
                            hostNickname: this.duelMyNickname
                        });
                        setTimeout(() => {
                            this.finishMatchmakingAndLaunch(roomCode, true, data.nickname || 'Rakip Klinisyen');
                        }, 250);
                    }
                });
            });
        } catch (e) {}
    }

    finishMatchmakingAndLaunch(roomCode, isHost, opponentNickname) {
        this.cancelMatchmaking(false);
        this.closeModal(this.dom.duelCenterModal);
        this.setupLiveRoomEngine(roomCode, isHost, null);
        if (this.activeDuelChallenge) {
            this.activeDuelChallenge.challengerName = opponentNickname;
        }
        if (this.dom.duelOpponentName) {
            this.dom.duelOpponentName.textContent = opponentNickname;
        }
        this.showToast(`🔥 Eşleşme Bulundu! Rakip: ${opponentNickname} (Oda: ${roomCode})`);
    }

    cancelMatchmaking(notify = true) {
        this.isMatchmaking = false;
        if (this.mmChannel) {
            try { this.mmChannel.close(); } catch (e) {}
            this.mmChannel = null;
        }
        if (this.mmPeer) {
            try { this.mmPeer.destroy(); } catch (e) {}
            this.mmPeer = null;
        }
        const statusBox = document.getElementById('matchmakingStatusBox');
        const btnStart = document.getElementById('btnStartMatchmaking');
        if (statusBox) statusBox.style.display = 'none';
        if (btnStart) btnStart.disabled = false;
        if (notify) {
            this.showToast("🔍 Otomatik rakip arama durduruldu.");
        }
    }

    // --- Live P2P Room Duel (PeerJS WebRTC + BroadcastChannel + Deterministic Room Seed) ---
    createLiveDuelRoom() {
        this.saveDuelNicknameFromModal();
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const roomBox = document.getElementById('liveRoomCreatedBox');
        const codeDisplay = document.getElementById('generatedRoomCodeDisplay');
        const statusEl = document.getElementById('liveRoomConnectionStatus');
        if (roomBox && codeDisplay) {
            roomBox.style.display = 'block';
            codeDisplay.textContent = code;
        }

        const roomInviteUrl = `${window.location.origin}${window.location.pathname}#room=${code}`;
        const btnCopyRoom = document.getElementById('btnCopyRoomInviteLink');
        if (btnCopyRoom) {
            btnCopyRoom.onclick = () => {
                navigator.clipboard.writeText(roomInviteUrl);
                this.showToast(`🔗 Oda davet linki (${code}) kopyalandı!`);
            };
        }
        const btnWaRoom = document.getElementById('btnWhatsappRoomInvite');
        if (btnWaRoom) {
            btnWaRoom.onclick = () => {
                const text = `⚔️ *PsikoVaka Canlı Düello Odası Kuruldu!*\n\n🔑 *Oda Kodu:* ${code}\n🧑‍⚕️ *Kurucu:* ${this.duelMyNickname}\n\nDoğrudan odaya katılmak için tıkla:\n${roomInviteUrl}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
            };
        }

        this.setupLiveRoomEngine(code, true, statusEl);
    }

    joinLiveDuelRoom(code) {
        this.saveDuelNicknameFromModal();
        const cleanCode = code.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 6);
        if (!cleanCode) return;
        this.closeModal(this.dom.duelCenterModal);
        this.setupLiveRoomEngine(cleanCode, false, null);
    }

    getDeterministicRoomCases(roomCode) {
        let hash = 2166136261;
        for (let i = 0; i < roomCode.length; i++) {
            hash ^= roomCode.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        const pool = [...this.allMasterCases];
        const selected = [];
        for (let round = 0; round < 5; round++) {
            const idx = Math.abs(hash + round * 9973) % pool.length;
            selected.push(pool[idx]);
        }
        return selected;
    }

    setupLiveRoomEngine(roomCode, isHost, statusEl) {
        const roomCases = this.getDeterministicRoomCases(roomCode);
        this.activeDuelChallenge = {
            isRoomDuel: true,
            roomCode,
            roomCases,
            roundIndex: 0,
            myWins: 0,
            opponentWins: 0,
            challengerName: 'Rakip Bekleniyor...'
        };

        // 1. Setup BroadcastChannel for instant same-device/tab sync
        if (typeof BroadcastChannel !== 'undefined') {
            if (this.broadcastChannel) this.broadcastChannel.close();
            this.broadcastChannel = new BroadcastChannel(`psikovaka_room_${roomCode}`);
            this.broadcastChannel.onmessage = (ev) => this.handleIncomingDuelMessage(ev.data);
            this.broadcastChannel.postMessage({ type: 'HELLO', nickname: this.duelMyNickname });
        }

        // 2. Setup PeerJS WebRTC for cross-device internet live sync
        if (typeof Peer !== 'undefined') {
            try {
                if (this.peer) this.peer.destroy();
                const hostPeerId = `psikovaka-duel-room-${roomCode.toLowerCase()}`;
                if (isHost) {
                    this.peer = new Peer(hostPeerId);
                    this.peer.on('connection', (conn) => {
                        this.peerConn = conn;
                        this.bindPeerConnection(conn, statusEl);
                    });
                } else {
                    this.peer = new Peer();
                    this.peer.on('open', () => {
                        const conn = this.peer.connect(hostPeerId);
                        this.peerConn = conn;
                        this.bindPeerConnection(conn, statusEl);
                    });
                }
            } catch (e) {
                console.warn("PeerJS P2P başlatılamadı, deterministik oda modu aktif:", e);
            }
        }

        if (this.dom.duelHudBanner) {
            this.dom.duelHudBanner.style.display = 'flex';
            if (this.dom.duelMyName) this.dom.duelMyName.textContent = `${this.duelMyNickname} (Oda: ${roomCode})`;
            if (this.dom.duelMyScoreBadge) this.dom.duelMyScoreBadge.textContent = `Tur 1/5`;
            if (this.dom.duelOpponentName) this.dom.duelOpponentName.textContent = isHost ? 'Arkadaşın Bekleniyor...' : 'Odaya Bağlandı';
            if (this.dom.duelOpponentStatus) this.dom.duelOpponentStatus.textContent = 'Canlı Senkron';
        }

        this.startCase(roomCases[0], `⚔️ Oda ${roomCode} • Tur 1/5`);
        this.showToast(`⚔️ Canlı Düello Odası (${roomCode}) Başladı! Tur 1/5`);
    }

    bindPeerConnection(conn, statusEl) {
        conn.on('open', () => {
            if (statusEl) statusEl.textContent = '🔥 Arkadaşın odaya canlı bağlandı! Düello başladı!';
            conn.send({ type: 'HELLO', nickname: this.duelMyNickname });
        });
        conn.on('data', (data) => {
            this.handleIncomingDuelMessage(data);
        });
    }

    sendDuelPacket(packet) {
        if (this.peerConn && this.peerConn.open) {
            try { this.peerConn.send(packet); } catch (e) {}
        }
        if (this.broadcastChannel) {
            try { this.broadcastChannel.postMessage(packet); } catch (e) {}
        }
    }

    broadcastDuelProgress(finished, won = false) {
        if (!this.activeDuelChallenge) return;
        this.sendDuelPacket({
            type: finished ? 'FINISHED' : 'PROGRESS',
            nickname: this.duelMyNickname,
            guessesCount: this.guesses.length,
            unlockedClues: this.unlockedClues,
            won,
            timeSec: this.elapsedSeconds
        });
    }

    handleIncomingDuelMessage(data) {
        if (!data || !this.activeDuelChallenge) return;
        if (data.nickname) {
            this.activeDuelChallenge.challengerName = data.nickname;
            if (this.dom.duelOpponentName) this.dom.duelOpponentName.textContent = data.nickname;
        }
        if (data.type === 'HELLO') {
            this.showToast(`⚔️ ${data.nickname} canlı düello odasına katıldı!`);
            if (this.dom.duelOpponentStatus) this.dom.duelOpponentStatus.textContent = '🟢 Canlı Bağlı';
        } else if (data.type === 'PROGRESS') {
            if (this.dom.duelOpponentStatus) {
                this.dom.duelOpponentStatus.textContent = `🔍 ${data.guessesCount}. Tahminde (${data.timeSec} sn)`;
            }
        } else if (data.type === 'FINISHED') {
            this.activeDuelChallenge.challengerGuesses = data.won ? data.guessesCount : 7;
            this.activeDuelChallenge.challengerTimeSec = data.timeSec;
            if (this.dom.duelOpponentStatus) {
                this.dom.duelOpponentStatus.textContent = data.won ?
                    `🎉 ${data.guessesCount}/6 İpucu (${data.timeSec} sn)` :
                    `❌ Çözemedi (${data.timeSec} sn)`;
            }
            this.showToast(data.won ?
                `⚡ ${data.nickname} vakayı ${data.guessesCount}. tahminde (${data.timeSec} sn) çözdü!` :
                `😮 ${data.nickname} bu vakada tüm haklarını doldurdu!`);
            if (this.isGameOver) {
                this.renderDuelPodium(this.gameWon);
            }
        }
    }

    nextRoomDuelCase() {
        if (!this.activeDuelChallenge || !this.activeDuelChallenge.isRoomDuel) return;
        this.activeDuelChallenge.roundIndex = (this.activeDuelChallenge.roundIndex + 1) % this.activeDuelChallenge.roomCases.length;
        const round = this.activeDuelChallenge.roundIndex + 1;
        const nextCase = this.activeDuelChallenge.roomCases[this.activeDuelChallenge.roundIndex];
        this.activeDuelChallenge.challengerGuesses = null;
        this.activeDuelChallenge.challengerTimeSec = null;
        if (this.dom.duelMyScoreBadge) this.dom.duelMyScoreBadge.textContent = `Tur ${round}/5`;
        if (this.dom.duelOpponentStatus) this.dom.duelOpponentStatus.textContent = `Tur ${round} Başladı`;
        this.startCase(nextCase, `⚔️ Oda ${this.activeDuelChallenge.roomCode} • Tur ${round}/5`);
    }

    exitDuelMode() {
        this.activeDuelChallenge = null;
        if (this.peer) { try { this.peer.destroy(); } catch (e) {} this.peer = null; }
        if (this.broadcastChannel) { try { this.broadcastChannel.close(); } catch (e) {} this.broadcastChannel = null; }
        if (this.dom.duelHudBanner) this.dom.duelHudBanner.style.display = 'none';
        window.location.hash = '';
        this.setMode('practice');
        this.showToast("Düello modundan çıkıldı.");
    }

    renderDuelPodium(won) {
        const podiumEl = document.getElementById('duelPodiumBox');
        if (!podiumEl) return;

        if (!this.activeDuelChallenge) {
            podiumEl.style.display = 'none';
            return;
        }

        podiumEl.style.display = 'block';
        const myGuesses = won ? this.guesses.length : 7;
        const myTime = this.elapsedSeconds;
        const oppName = this.activeDuelChallenge.challengerName || 'Rakip';
        const oppGuesses = this.activeDuelChallenge.challengerGuesses;
        const oppTime = this.activeDuelChallenge.challengerTimeSec;

        let verdictHTML = `<span style="color: #fbbf24;">⏳ Rakibin vakayı tamamlaması bekleniyor veya skorunuzu gönderin!</span>`;
        if (oppGuesses) {
            if (myGuesses < oppGuesses || (myGuesses === oppGuesses && myTime < oppTime)) {
                verdictHTML = `<span style="color: #34d399; font-size: 1.05rem; font-weight: 800;">🏆 DÜELLOYU SEN KAZANDIN! (${oppName}'i geçtin!)</span>`;
            } else if (myGuesses > oppGuesses || (myGuesses === oppGuesses && myTime > oppTime)) {
                verdictHTML = `<span style="color: #fb7185; font-size: 1.05rem; font-weight: 800;">⚔️ Bu turu ${oppName} kazandı! Rövanş için sıradaki vakaya geç!</span>`;
            } else {
                verdictHTML = `<span style="color: #38bdf8; font-size: 1.05rem; font-weight: 800;">🤝 TAM BERABERLİK! İkiniz de aynı sürede ve ipucunda bildiniz!</span>`;
            }
        }

        podiumEl.innerHTML = `
            <div style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: #fda4af; letter-spacing: 0.8px;">⚔️ Klinik Düello Karşılaştırma Podyumu</div>
            <div style="margin-top: 0.35rem;">${verdictHTML}</div>
            <div class="duel-podium-grid">
                <div style="background: var(--bg-secondary); padding: 0.7rem; border-radius: 10px; border: 1px solid var(--accent-emerald);">
                    <div style="font-weight: 800; color: #34d399;">🧑‍⚕️ ${this.duelMyNickname} (Sen)</div>
                    <div style="font-size: 0.85rem; margin-top: 4px;">${won ? `${this.guesses.length}/6 İpucu` : 'Çözemedi'} • ⏱️ ${myTime} sn</div>
                </div>
                <div class="duel-vs-badge">VS</div>
                <div style="background: var(--bg-secondary); padding: 0.7rem; border-radius: 10px; border: 1px solid var(--accent-rose);">
                    <div style="font-weight: 800; color: #fda4af;">⚔️ ${oppName}</div>
                    <div style="font-size: 0.85rem; margin-top: 4px;">${oppGuesses ? (oppGuesses <= 6 ? `${oppGuesses}/6 İpucu • ⏱️ ${oppTime || '-'} sn` : 'Çözemedi') : 'Oynuyor...'}</div>
                </div>
            </div>
        `;
    }

    renderCourseFilters() {
        if (!this.dom.courseNav) return;
        this.dom.courseNav.innerHTML = '';

        Object.keys(this.courses).forEach(courseKey => {
            const course = this.courses[courseKey];
            const btn = document.createElement('button');
            btn.className = `course-pill ${this.activeCourseFilter === course.id ? 'active' : ''}`;
            btn.innerHTML = `<span>${course.icon}</span> ${course.name}`;

            btn.onclick = () => {
                this.activeCourseFilter = course.id;
                this.renderCourseFilters();
                this.loadRandomPracticeCase();
            };

            this.dom.courseNav.appendChild(btn);
        });
    }

    renderCategoryFilters() {
        if (!this.dom.filterBar) return;
        this.dom.filterBar.innerHTML = '';

        const allPill = document.createElement('button');
        allPill.className = `filter-pill ${this.activeCategoryFilter === 'ALL' ? 'active' : ''}`;
        allPill.textContent = "🌟 Tüm Kategoriler";
        allPill.onclick = () => {
            this.activeCategoryFilter = 'ALL';
            this.renderCategoryFilters();
            this.loadRandomPracticeCase();
        };
        this.dom.filterBar.appendChild(allPill);

        Object.keys(this.categories).forEach(catKey => {
            const cat = this.categories[catKey];
            const pill = document.createElement('button');
            pill.className = `filter-pill ${this.activeCategoryFilter === catKey ? 'active' : ''}`;
            pill.textContent = `${cat.icon} ${cat.name}`;
            pill.onclick = () => {
                this.activeCategoryFilter = catKey;
                this.renderCategoryFilters();
                this.loadRandomPracticeCase();
            };
            this.dom.filterBar.appendChild(pill);
        });
    }

    generateShareString(won) {
        const caseNumber = this.currentCase.caseNumber || 1;
        const guessCount = won ? this.guesses.length : 'X';
        const modeLabels = {
            diagnosis: '🩺 PsikoVaka Tanı',
            therapy: '🛡️ PsikoTerapi',
            pharmacology: '💊 PsikoFarmakoloji',
            combo: '⚡ PsikoVaka Tam Konsültasyon'
        };
        const gameName = modeLabels[this.targetGameMode] || '🧠 PsikoVaka';
        let str = `${gameName} Vaka #${caseNumber} (${guessCount}/${this.maxClues}) • ⏱️ ${this.elapsedSeconds} sn\n\n`;

        this.guesses.forEach(g => {
            if (g.isCorrect) str += '🟩🟩🟩🟩\n';
            else if (g.categoryMatch) str += '🟨🟨⬛⬛\n';
            else str += '⬛⬛⬛⬛\n';
        });

        return str.trim();
    }

    handleCreateCustomCase(e) {
        e.preventDefault();

        const diagnosisId = document.getElementById('studioDiagnosisSelect').value;
        const difficulty = document.getElementById('studioDifficulty').value;
        const patientSummary = document.getElementById('studioPatientSummary').value.trim();
        const clue1 = document.getElementById('studioClue1').value.trim();
        const clue2 = document.getElementById('studioClue2').value.trim();
        const clue3 = document.getElementById('studioClue3').value.trim();
        const clue4 = document.getElementById('studioClue4').value.trim();
        const clue5 = document.getElementById('studioClue5').value.trim();
        const clue6 = document.getElementById('studioClue6').value.trim();
        const diffDiag = document.getElementById('studioDiffDiag').value.trim();
        const dsmSummary = document.getElementById('studioDsmSummary').value.trim();

        if (!diagnosisId || !patientSummary || !clue1 || !clue2 || !clue3 || !clue4 || !clue5 || !clue6) {
            this.showToast("⚠️ Lütfen tüm 6 ipucunu ve vaka bilgilerini doldurun.");
            return;
        }

        const selectedDiag = this.diagnoses.find(d => d.id === diagnosisId);

        const customCase = {
            id: `custom-${Date.now().toString(36)}`,
            caseNumber: 999,
            difficulty,
            diagnosisId,
            category: selectedDiag ? selectedDiag.category : 'MOOD',
            patientSummary,
            clues: [clue1, clue2, clue3, clue4, clue5, clue6],
            differentialDiagnosis: diffDiag || "Kullanıcı tarafından oluşturulmuş özel vaka.",
            dsmCriteriaSummary: dsmSummary || "DSM-5 Kriterleri"
        };

        const jsonStr = JSON.stringify(customCase);
        const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
        const shareUrl = `${window.location.origin}${window.location.pathname}#case=${encoded}`;

        const resultContainer = document.getElementById('studioResultContainer');
        const shareLinkInput = document.getElementById('studioShareLinkInput');

        if (resultContainer && shareLinkInput) {
            resultContainer.style.display = 'block';
            shareLinkInput.value = shareUrl;

            document.getElementById('btnCopyStudioLink').onclick = () => {
                navigator.clipboard.writeText(shareUrl);
                this.showToast("🔗 Özel vaka linki kopyalandı!");
            };

            document.getElementById('btnPlayStudioCase').onclick = () => {
                this.closeModal(this.dom.caseStudioModal);
                window.location.hash = `case=${encoded}`;
                this.loadCustomCase(customCase);
            };
        }
    }

    // --- Guides: DSM-5, Psychotherapy, and Psychopharmacology ---
    openDsmGuideModal() {
        const guideList = document.getElementById('dsmGuideList');
        if (!guideList) return;
        guideList.innerHTML = '';

        Object.keys(this.categories).forEach(catKey => {
            const cat = this.categories[catKey];
            const catDiags = this.diagnoses.filter(d => d.category === catKey);
            if (catDiags.length === 0) return;

            const section = document.createElement('div');
            section.className = 'edu-section';
            section.style.marginBottom = '1rem';

            let html = `<div class="edu-title">${cat.icon} ${cat.name} (${catDiags.length} Tanı)</div>`;
            html += `<ul style="padding-left: 1.2rem; font-size: 0.86rem; color: var(--text-secondary); line-height: 1.7;">`;
            catDiags.forEach(d => {
                html += `<li><strong>${d.nameTr}</strong> <span style="font-size: 0.75rem; color: var(--text-muted);">(${d.nameEn})</span></li>`;
            });
            html += `</ul>`;
            section.innerHTML = html;
            guideList.appendChild(section);
        });

        this.openModal(this.dom.dsmGuideModal);
    }

    openTherapyGuideModal() {
        const guideList = document.getElementById('therapyGuideList');
        if (!guideList) return;
        guideList.innerHTML = '';

        Object.keys(this.therapyFamilies).forEach(famKey => {
            const fam = this.therapyFamilies[famKey];
            const famTherapies = this.therapies.filter(t => t.family === famKey);
            if (famTherapies.length === 0) return;

            const section = document.createElement('div');
            section.className = 'edu-section';
            section.style.marginBottom = '1.1rem';

            let html = `<div class="edu-title">${fam.icon} ${fam.name} (${famTherapies.length} Yöntem)</div>`;
            html += `<div style="display: flex; flex-direction: column; gap: 0.7rem; margin-top: 0.5rem;">`;

            famTherapies.forEach(t => {
                let stepsHTML = '';
                if (t.protocolSteps && t.protocolSteps.length > 0) {
                    stepsHTML = `<div style="margin-top: 0.35rem; font-size: 0.81rem; color: var(--text-secondary);"><strong>🛠️ Protokol Adımları:</strong><ul style="padding-left: 1.1rem; margin-top: 0.2rem; line-height: 1.5;">${t.protocolSteps.map(s => `<li>${s}</li>`).join('')}</ul></div>`;
                }
                html += `
                    <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-left: 3px solid #10b981; border-radius: 8px; padding: 0.75rem 0.9rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.3rem;">
                            <strong style="color: var(--text-primary); font-size: 0.9rem;">${t.nameTr}</strong>
                            <span style="font-size: 0.74rem; color: var(--text-muted);">${t.nameEn}</span>
                        </div>
                        <p style="font-size: 0.84rem; color: var(--text-secondary); margin-top: 0.3rem; line-height: 1.5;">${t.shortDefinition}</p>
                        ${stepsHTML}
                        ${t.pitfalls ? `<div style="font-size: 0.79rem; color: #fbbf24; margin-top: 0.3rem; background: rgba(245, 158, 11, 0.08); padding: 0.3rem 0.5rem; border-radius: 4px;"><strong>⚠️ Klinik Tuzak:</strong> ${t.pitfalls}</div>` : ''}
                    </div>
                `;
            });

            html += `</div>`;
            section.innerHTML = html;
            guideList.appendChild(section);
        });

        this.openModal(this.dom.therapyGuideModal);
    }

    openPharmaGuideModal() {
        const guideList = document.getElementById('pharmaGuideList');
        if (!guideList) return;
        guideList.innerHTML = '';

        Object.keys(this.pharmacologyFamilies).forEach(famKey => {
            const fam = this.pharmacologyFamilies[famKey];
            const famItems = this.pharmacology.filter(p => p.family === famKey);
            if (famItems.length === 0) return;

            const section = document.createElement('div');
            section.className = 'edu-section';
            section.style.marginBottom = '1.1rem';

            let html = `<div class="edu-title" style="color: #fb7185;">${fam.icon} ${fam.name} (${famItems.length} Protokol)</div>`;
            html += `<div style="display: flex; flex-direction: column; gap: 0.7rem; margin-top: 0.5rem;">`;

            famItems.forEach(p => {
                let stepsHTML = '';
                if (p.protocolSteps && p.protocolSteps.length > 0) {
                    stepsHTML = `<div style="margin-top: 0.35rem; font-size: 0.81rem; color: var(--text-secondary);"><strong>💊 Klinik Uygulama & Endikasyon:</strong><ul style="padding-left: 1.1rem; margin-top: 0.2rem; line-height: 1.5;">${p.protocolSteps.map(s => `<li>${s}</li>`).join('')}</ul></div>`;
                }
                html += `
                    <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-left: 3px solid #f43f5e; border-radius: 8px; padding: 0.75rem 0.9rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.3rem;">
                            <strong style="color: var(--text-primary); font-size: 0.9rem;">${p.nameTr}</strong>
                            <span style="font-size: 0.74rem; color: var(--text-muted);">${p.nameEn || ''}</span>
                        </div>
                        <p style="font-size: 0.84rem; color: var(--text-secondary); margin-top: 0.3rem; line-height: 1.5;">${p.shortDefinition || ''}</p>
                        ${stepsHTML}
                        ${p.pitfalls ? `<div style="font-size: 0.79rem; color: #fda4af; margin-top: 0.3rem; background: rgba(244, 63, 94, 0.08); padding: 0.3rem 0.5rem; border-radius: 4px;"><strong>⚠️ Kontrendikasyon & Yan Etki Uyarısı:</strong> ${p.pitfalls}</div>` : ''}
                    </div>
                `;
            });

            html += `</div>`;
            section.innerHTML = html;
            guideList.appendChild(section);
        });

        this.openModal(this.dom.pharmaGuideModal);
    }

    // --- Statistics ---
    loadStats() {
        const saved = localStorage.getItem('psikovaka_stats');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return {
            played: 0,
            won: 0,
            currentStreak: 0,
            maxStreak: 0,
            distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
        };
    }

    recordStats(won, guessCount) {
        this.stats.played++;
        if (won) {
            this.stats.won++;
            this.stats.currentStreak++;
            if (this.stats.currentStreak > this.stats.maxStreak) {
                this.stats.maxStreak = this.stats.currentStreak;
            }
            if (this.stats.distribution[guessCount] !== undefined) {
                this.stats.distribution[guessCount]++;
            }
        } else {
            this.stats.currentStreak = 0;
        }
        localStorage.setItem('psikovaka_stats', JSON.stringify(this.stats));
    }

    openStatsModal() {
        document.getElementById('statPlayed').textContent = this.stats.played;
        const winRate = this.stats.played > 0 ? Math.round((this.stats.won / this.stats.played) * 100) : 0;
        document.getElementById('statWinRate').textContent = `%${winRate}`;
        document.getElementById('statStreak').textContent = this.stats.currentStreak;
        document.getElementById('statMaxStreak').textContent = this.stats.maxStreak;

        const distContainer = document.getElementById('statDistribution');
        distContainer.innerHTML = '';

        const maxVal = Math.max(...Object.values(this.stats.distribution), 1);

        for (let i = 1; i <= 6; i++) {
            const count = this.stats.distribution[i] || 0;
            const pct = Math.max(7, Math.round((count / maxVal) * 100));

            const row = document.createElement('div');
            row.style.cssText = 'display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; margin-bottom:0.35rem;';
            row.innerHTML = `
                <span style="width: 15px; font-weight: 700;">${i}</span>
                <div style="flex: 1; background: var(--bg-primary); border-radius: 4px; overflow: hidden;">
                    <div style="width: ${pct}%; background: var(--accent-primary); color: #fff; padding: 2px 8px; font-size: 0.75rem; font-weight: 700; border-radius: 4px; text-align: right;">
                        ${count}
                    </div>
                </div>
            `;
            distContainer.appendChild(row);
        }

        this.openModal(this.dom.statsModal);
    }

    playTone(type) {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'win') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, ctx.currentTime);
                osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
                osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
                osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
                osc.start();
                osc.stop(ctx.currentTime + 0.6);
            } else if (type === 'warm') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, ctx.currentTime);
                osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
                osc.start();
                osc.stop(ctx.currentTime + 0.25);
            } else {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(250, ctx.currentTime);
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
                osc.start();
                osc.stop(ctx.currentTime + 0.2);
            }
        } catch (e) {}
    }

    launchConfetti() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#38bdf8', '#a855f7'];

        for (let i = 0; i < 90; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15 - 5,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10
            });
        }

        let animationFrame;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let activeCount = 0;
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.32;
                p.rotation += p.rotSpeed;
                if (p.y < canvas.height) {
                    activeCount++;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.restore();
                }
            });
            if (activeCount > 0) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                cancelAnimationFrame(animationFrame);
                canvas.remove();
            }
        };
        animate();
    }

    openModal(modal) {
        if (modal) modal.classList.add('open');
    }

    closeModal(modal) {
        if (modal) modal.classList.remove('open');
    }

    showToast(message) {
        if (!this.dom || !this.dom.toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        this.dom.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px) scale(0.95)';
            setTimeout(() => {
                if (toast && typeof toast.remove === 'function') toast.remove();
            }, 350);
        }, 3000);
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('psikovaka_theme', next);
        if (this.dom.themeToggleBtn) {
            this.dom.themeToggleBtn.textContent = (next === 'light') ? '🌙' : '☀️';
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const studioSelect = document.getElementById('studioDiagnosisSelect');
    if (studioSelect && typeof DIAGNOSES_DATABASE !== 'undefined') {
        DIAGNOSES_DATABASE.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.id;
            opt.textContent = `${d.nameTr} (${d.nameEn})`;
            studioSelect.appendChild(opt);
        });
    }

    const savedTheme = localStorage.getItem('psikovaka_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.textContent = (savedTheme === 'light') ? '🌙' : '☀️';
    }

    window.game = new PsikoVakaGame();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PsikoVakaGame };
}
