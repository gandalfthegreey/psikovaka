/**
 * PsikoVaka — Arka Plan Odak Müziği & Sessize Alma Denetimi
 * Önce assets/ambiyans_muzik.mp3 (ör. Google MusicFX / Lyria ile üretilmiş parça) dosyasını dener;
 * dosya yoksa Web Audio API ile sıcak, düşük sesli lo-fi odak müziği üretir.
 */
(function (global) {
    'use strict';

    const STORAGE_KEY = 'psikovaka_music';
    const MP3_PATH = 'assets/ambiyans_muzik.mp3';

    let isPlaying = false;
    let wantMusic = false;
    let audioEl = null;
    let useMp3 = false;
    let mp3Checked = false;

    // Web Audio API synth state
    let ctx = null;
    let masterGain = null;
    let stepTimer = null;
    let chordIndex = 0;

    // Warm, calm study progression: Fmaj7 -> Em7 -> Dm9 -> Cmaj9
    const CHORDS = [
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [164.81, 196.00, 246.94, 293.66], // Em7
        [146.83, 220.00, 261.63, 329.63], // Dm9
        [130.81, 196.00, 246.94, 293.66]  // Cmaj9
    ];
    const MELODY_NOTES = [523.25, 493.88, 440.00, 392.00, 329.63, 392.00, 440.00, 523.25];

    function getBtn() {
        return document.getElementById('btnMusicToggle');
    }

    function updateButtonUI() {
        const btn = getBtn();
        if (!btn) return;
        const active = isPlaying && wantMusic;
        btn.textContent = active ? '🔊' : '🔇';
        btn.setAttribute('aria-pressed', String(active));
        btn.setAttribute('aria-label', active ? 'Arka plan müziğini kapat' : 'Arka plan müziğini aç');
        btn.title = active ? 'Müziği sessize al' : 'Odak müziğini aç';
        btn.classList.toggle('is-playing', active);
    }

    function checkMp3Available() {
        if (mp3Checked) return Promise.resolve(useMp3);
        mp3Checked = true;
        if (location.protocol === 'file:') {
            useMp3 = false;
            return Promise.resolve(false);
        }
        return fetch(MP3_PATH, { method: 'HEAD' })
            .then(r => { useMp3 = !!(r && r.ok); return useMp3; })
            .catch(() => { useMp3 = false; return false; });
    }

    function playWarmChord(freqs, now) {
        if (!ctx || !masterGain) return;
        freqs.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const filter = ctx.createBiquadFilter();
            const gain = ctx.createGain();

            osc.type = idx === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(f, now);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(620, now);

            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(idx === 0 ? 0.085 : 0.042, now + 0.65);
            gain.gain.exponentialRampToValueAtTime(0.0008, now + 4.1);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(masterGain);

            osc.start(now);
            osc.stop(now + 4.2);
        });

        // Soft Rhodes-like top note
        const note = MELODY_NOTES[(chordIndex * 2) % MELODY_NOTES.length];
        const mOsc = ctx.createOscillator();
        const mGain = ctx.createGain();
        mOsc.type = 'sine';
        mOsc.frequency.setValueAtTime(note, now + 1.2);
        mGain.gain.setValueAtTime(0.0001, now + 1.2);
        mGain.gain.linearRampToValueAtTime(0.032, now + 1.35);
        mGain.gain.exponentialRampToValueAtTime(0.0005, now + 3.4);
        mOsc.connect(mGain);
        mGain.connect(masterGain);
        mOsc.start(now + 1.2);
        mOsc.stop(now + 3.5);
    }

    function startSynth() {
        const AudioCtx = global.AudioContext || global.webkitAudioContext;
        if (!AudioCtx) return;
        if (!ctx) {
            ctx = new AudioCtx();
            masterGain = ctx.createGain();
            masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
            masterGain.connect(ctx.destination);
        }
        if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }
        masterGain.gain.cancelScheduledValues(ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 0.8);

        if (stepTimer) clearInterval(stepTimer);
        const tick = () => {
            if (!isPlaying || !ctx || document.hidden) return;
            playWarmChord(CHORDS[chordIndex % CHORDS.length], ctx.currentTime);
            chordIndex++;
        };
        tick();
        stepTimer = setInterval(tick, 4000);
    }

    function stopSynth() {
        if (stepTimer) {
            clearInterval(stepTimer);
            stepTimer = null;
        }
        if (ctx && masterGain) {
            try {
                masterGain.gain.cancelScheduledValues(ctx.currentTime);
                masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
            } catch (e) {}
        }
    }

    async function startMusic() {
        wantMusic = true;
        try { localStorage.setItem(STORAGE_KEY, 'on'); } catch (e) {}
        const hasMp3 = await checkMp3Available();
        if (!wantMusic) return;

        isPlaying = true;
        if (hasMp3) {
            if (!audioEl) {
                audioEl = new Audio(MP3_PATH);
                audioEl.loop = true;
                audioEl.volume = 0.28;
            }
            audioEl.play().catch(() => {
                useMp3 = false;
                startSynth();
            });
        } else {
            startSynth();
        }
        updateButtonUI();
    }

    function stopMusic() {
        wantMusic = false;
        isPlaying = false;
        try { localStorage.setItem(STORAGE_KEY, 'off'); } catch (e) {}
        if (audioEl) {
            try { audioEl.pause(); } catch (e) {}
        }
        stopSynth();
        updateButtonUI();
    }

    function toggleMusic() {
        if (isPlaying && wantMusic) {
            stopMusic();
        } else {
            startMusic();
        }
    }

    function init() {
        const btn = getBtn();
        if (btn) {
            btn.addEventListener('click', toggleMusic);
        }

        let saved = 'off';
        try { saved = localStorage.getItem(STORAGE_KEY) || 'off'; } catch (e) {}
        if (saved === 'on') {
            wantMusic = true;
            const unlockOnce = () => {
                if (wantMusic && !isPlaying) startMusic();
                document.removeEventListener('pointerdown', unlockOnce);
                document.removeEventListener('keydown', unlockOnce);
            };
            document.addEventListener('pointerdown', unlockOnce, { once: true });
            document.addEventListener('keydown', unlockOnce, { once: true });
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (audioEl && isPlaying) { try { audioEl.pause(); } catch (e) {} }
                if (ctx && ctx.state === 'running') { ctx.suspend().catch(() => {}); }
            } else if (isPlaying && wantMusic) {
                if (audioEl && useMp3) { audioEl.play().catch(() => {}); }
                else if (ctx && ctx.state === 'suspended') { ctx.resume().catch(() => {}); }
            }
        });

        updateButtonUI();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    global.PsikoVakaMuzik = { start: startMusic, stop: stopMusic, toggle: toggleMusic };
})(typeof window !== 'undefined' ? window : globalThis);
