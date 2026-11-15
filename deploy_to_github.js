/**
 * PsikoVaka — tek adımda yayın (GITHUBA_YUKLE.bat bunu çalıştırır).
 *
 * Sırayla:
 *   1. git ve depo kontrolü, GitHub'da sizde olmayan yeni commit var mı (salt okuma: git ls-remote)
 *   2. node build_portable_single_file.js   -> vakaları doğrular, PsikoVaka_Tam_Surum.html'i yeniden üretir
 *   3. node supabase/seed/generate_answer_key.js -> sunucu cevap anahtarını (SQL) vakalarla eşitler
 *   4. git add (yalnızca proje yolları) + commit (mesaj sorulur) + git push -u origin main (--force YOK)
 * GitHub'a gelince .github/workflows/supabase-cevap-anahtari.yml cevap anahtarını Supabase'e kendisi yükler.
 *
 * Seçenekler (geliştiriciler için):
 *   --dry-run         git'e yazan hiçbir komutu çalıştırmaz, yalnızca ne çalıştıracağını yazar
 *                     (PSIKOVAKA_DRY_RUN=1 ortam değişkeni de aynı işi görür)
 *   --skip-build      2. adımı atlar (derleyici js/cases.js ve PsikoVaka_Tam_Surum.html dosyalarını yeniden yazar)
 *   --message="..."   commit mesajını sormadan kullanır
 *
 * Windows'ta cmd.exe ile çalışır: hiçbir komut kabuk üzerinden çalıştırılmaz (spawnSync + argüman dizisi),
 * bu yüzden yol ve mesajlardaki boşluk, tırnak, % gibi karakterler sorun çıkarmaz.
 */
'use strict';
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT = __dirname;
process.chdir(ROOT);

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes('--dry-run') || process.env.PSIKOVAKA_DRY_RUN === '1';
const SKIP_BUILD = argv.includes('--skip-build');
const MESSAGE_ARG = (argv.find(a => a.startsWith('--message=')) || '').slice('--message='.length);

const BRANCH = 'main';
// Diskte olan yollar + git'in zaten izlediği (taşınmış/silinmiş) yollar eklenir;
// ikisinde de olmayan yol atlanır, böylece git add hata vermez.
const CANDIDATE_PATHS = [
    'index.html', 'manifest.json', 'css', 'js', 'PsikoVaka_Tam_Surum.html',
    'paketler', 'build_portable_single_file.js', 'deploy_to_github.js', 'GITHUBA_YUKLE.bat',
    '.gitignore', '.github', 'CLAUDE.md', 'GEMINI.md', 'AI_ISBIRLIGI.md', 'tools', 'supabase',
    // eski konumlar: kökten paketler/ altına taşındı, silinmeleri de kayda geçsin
    'vaka_paketi_150.json', 'vaka_paketi_80.json', 'vaka_paketi_60.json', 'vaka_paketi_40.json', 'vaka_paketi_20.json'
];

// ---------------------------------------------------------------------------
// yardımcılar
// ---------------------------------------------------------------------------
class StopError extends Error {}
function stop(lines) {
    throw new StopError(Array.isArray(lines) ? lines.join('\n') : lines);
}

function askQuestion(query) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans.trim());
    }));
}

const READ_ENV = { ...process.env, GIT_OPTIONAL_LOCKS: '0' };

/** Salt okuyan git komutu; çıktıyı döndürür, ekrana basmaz. */
function gitRead(args) {
    const r = spawnSync('git', args, { encoding: 'utf8', env: READ_ENV, windowsHide: true });
    return { status: r.error ? -1 : r.status, stdout: (r.stdout || '').trim(), stderr: (r.stderr || '').trim(), error: r.error };
}

const showCmd = args => 'git ' + args.map(a => (/[\s"']/.test(a) ? JSON.stringify(a) : a)).join(' ');

/** Depoya yazan git komutu. --dry-run'da yalnızca yazdırılır. */
function gitWrite(args, { captureStderr = false } = {}) {
    if (DRY_RUN) {
        console.log(`   [deneme] çalıştırılmadı: ${showCmd(args)}`);
        return { status: 0, stderr: '' };
    }
    const r = spawnSync('git', args, {
        encoding: 'utf8',
        stdio: ['inherit', 'inherit', captureStderr ? 'pipe' : 'inherit'],
        windowsHide: true
    });
    const stderr = r.stderr || '';
    if (captureStderr && stderr) process.stderr.write(stderr);
    return { status: r.error ? -1 : r.status, stderr, error: r.error };
}

/** Projedeki bir node betiğini çalıştırır; çıktıyı hem ekrana basar hem döndürür. */
function runNodeScript(relPath) {
    const r = spawnSync(process.execPath, [relPath], { cwd: ROOT, encoding: 'utf8', windowsHide: true, maxBuffer: 64 * 1024 * 1024 });
    if (r.stdout) process.stdout.write(r.stdout);
    if (r.stderr) process.stderr.write(r.stderr);
    return { status: r.error ? -1 : r.status, output: `${r.stdout || ''}\n${r.stderr || ''}`, error: r.error };
}

function actionsUrlFrom(remoteUrl) {
    const m = /github\.com[:/]+([^/]+)\/([^/]+?)(\.git)?\/?$/.exec(remoteUrl || '');
    return m ? `https://github.com/${m[1]}/${m[2]}/actions` : null;
}

// ---------------------------------------------------------------------------
// adımlar
// ---------------------------------------------------------------------------
function checkGitRepo() {
    const v = gitRead(['--version']);
    if (v.status !== 0) {
        stop(['git bulunamadı. Git for Windows kurun (https://git-scm.com/download/win), bilgisayarı yeniden başlatın ve tekrar deneyin.']);
    }
    const inside = gitRead(['rev-parse', '--is-inside-work-tree']);
    if (inside.status !== 0 || inside.stdout !== 'true') {
        stop(['Bu klasör bir git deposu değil. GITHUBA_YUKLE.bat dosyasını PsikoVaka proje klasörünün içinden çalıştırın.']);
    }
    const branch = gitRead(['rev-parse', '--abbrev-ref', 'HEAD']).stdout;
    if (branch !== BRANCH) {
        stop([
            `Şu an "${branch}" dalındasınız; yayın yalnızca "${BRANCH}" dalından yapılır.`,
            `Bu klasörde "git checkout ${BRANCH}" çalıştırın ya da bir geliştiriciye/asistana sorun.`
        ]);
    }
}

async function ensureRemote() {
    let remoteUrl = gitRead(['remote', 'get-url', 'origin']).stdout;
    if (!remoteUrl) {
        console.log('Kişisel GitHub depo adresinizi girin (Örn: https://github.com/kullaniciadiniz/psikovaka.git)');
        const inputUrl = await askQuestion('🔗 GitHub Repo Adresi: ');
        if (!inputUrl) stop('Repo adresi girilmedi.');
        remoteUrl = inputUrl.endsWith('.git') ? inputUrl : `${inputUrl.replace(/\/$/, '')}.git`;
        const r = gitWrite(['remote', 'add', 'origin', remoteUrl]);
        if (r.status !== 0) stop('Repo adresi kaydedilemedi (git remote add).');
    }
    return remoteUrl;
}

const BEHIND_MESSAGE = [
    'GitHub\'daki depoda bu bilgisayarda olmayan yeni değişiklikler (commit) var.',
    'Muhtemelen biri GitHub sitesinden ya da başka bir bilgisayardan bir şey yükledi.',
    'Üzerine yazmamak için yükleme durduruldu; hiçbir şey kaybolmadı.',
    'Ne yapmalı: bu klasörde bir komut penceresi açıp "git pull origin main" çalıştırın,',
    'sonra GITHUBA_YUKLE.bat dosyasını tekrar çalıştırın. Çakışma (conflict) çıkarsa',
    'bir geliştiriciye veya yapay zeka asistanına bu mesajı gösterin.'
];

/** GitHub'da bizde olmayan commit var mı? Salt okuma (ls-remote). Ağ yoksa uyarıp devam eder. */
function checkRemoteNotAhead() {
    const r = gitRead(['ls-remote', '--heads', 'origin', BRANCH]);
    if (r.status !== 0) {
        console.log('⚠️  GitHub\'daki son durum okunamadı (internet veya giriş sorunu olabilir); devam ediliyor.');
        return;
    }
    const remoteSha = (r.stdout.split(/\s+/)[0] || '').trim();
    if (!remoteSha) {
        console.log(`ℹ️  GitHub'da henüz "${BRANCH}" dalı yok; ilk yükleme yapılacak.`);
        return;
    }
    const known = gitRead(['cat-file', '-e', `${remoteSha}^{commit}`]).status === 0;
    const isAncestor = known && gitRead(['merge-base', '--is-ancestor', remoteSha, 'HEAD']).status === 0;
    if (!isAncestor) stop(BEHIND_MESSAGE);
    console.log('✓ GitHub\'daki son sürüm bu bilgisayarda da var.');
}

function runBuild() {
    if (SKIP_BUILD) {
        console.log('   (--skip-build: derleyici atlandı)');
        return;
    }
    const r = runNodeScript('build_portable_single_file.js');
    // Derleyici hata sayısını yazar ama hata olsa da 0 ile çıkar; o yüzden çıktısını da okuyoruz.
    const m = /Hata:\s*(\d+)/.exec(r.output);
    const errorCount = m ? Number(m[1]) : NaN;
    const problems = [];
    if (r.status !== 0) problems.push(`derleyici hata koduyla bitti (${r.status})`);
    if (!m) problems.push('derleyici doğrulama özetini yazmadı');
    else if (errorCount > 0) problems.push(`${errorCount} vaka hatası`);
    if (/UYARI/.test(r.output)) problems.push('index.html ile derleyici listeleri uyuşmuyor (UYARI satırları)');
    if (problems.length) {
        stop([
            `Vaka doğrulaması / tek dosya derlemesi başarısız: ${problems.join('; ')}.`,
            'Hatalı satırlar yukarıda. Genelde js/cases.js içindeki yeni bir vakada yanlış yazılmış bir',
            'diagnosisId / therapyId / pharmacologyId ya da 6 olmayan ipucu sayısı vardır.',
            'Düzeltip tekrar çalıştırın. GitHub\'a hiçbir şey gönderilmedi.'
        ]);
    }
}

function runAnswerKey() {
    const r = runNodeScript(path.join('supabase', 'seed', 'generate_answer_key.js'));
    if (r.status !== 0) {
        stop([
            'Sunucu cevap anahtarı üretilemedi (supabase/seed/generate_answer_key.js). Ayrıntı yukarıda.',
            'Düzeltip tekrar çalıştırın. GitHub\'a hiçbir şey gönderilmedi.'
        ]);
    }
}

function isTracked(p) {
    return gitRead(['ls-files', '--', p]).stdout !== '';
}

function stageAndCount() {
    const addPaths = CANDIDATE_PATHS.filter(p => fs.existsSync(p) || isTracked(p));
    const pending = gitRead(['status', '--porcelain', '--untracked-files=all', '--', ...addPaths]).stdout;
    const pendingCount = pending ? pending.split('\n').length : 0;
    console.log(`   Gönderilecek değişen dosya sayısı: ${pendingCount}`);
    const r = gitWrite(['add', '-A', '--', ...addPaths]);
    if (r.status !== 0) stop('Dosyalar hazırlanamadı (git add). Ayrıntı yukarıda.');
    return pendingCount;
}

async function commit(pendingCount) {
    const hasStaged = DRY_RUN ? pendingCount > 0 : gitRead(['diff', '--cached', '--quiet']).status === 1;
    if (!hasStaged) {
        console.log('ℹ️  Yeni commitlenecek değişiklik yok; varsa bekleyen commitler gönderilecek.');
        return;
    }
    let msg = MESSAGE_ARG;
    if (!msg && !DRY_RUN) msg = await askQuestion('📝 Commit mesajı (boş bırakırsan: "PsikoVaka guncellemesi"): ');
    if (!msg) msg = 'PsikoVaka guncellemesi';
    const r = gitWrite(['commit', '-m', msg]);
    if (r.status !== 0) {
        stop([
            'Commit oluşturulamadı. Ayrıntı yukarıda.',
            'İlk kullanımda git adınızı/e-postanızı soruyorsa şunları bir kez çalıştırın:',
            '  git config --global user.name "Adınız"',
            '  git config --global user.email "github-epostaniz@ornek.com"'
        ]);
    }
}

function push() {
    const r = gitWrite(['push', '-u', 'origin', BRANCH], { captureStderr: true });
    if (r.status === 0) return;
    const e = r.stderr || '';
    if (/\[rejected\]|non-fast-forward|fetch first|Updates were rejected/i.test(e)) stop(BEHIND_MESSAGE);
    if (/Authentication failed|could not read Username|Permission to .* denied|403|401/i.test(e)) {
        stop([
            'GitHub girişi / yetkisi reddedildi.',
            'Açılan GitHub giriş penceresinde depo sahibinin hesabıyla giriş yaptığınızdan emin olun.',
            '💡 Başka bir hesapla yüklüyorsanız: depoda Settings -> Collaborators kısmından o hesabı ekleyin ve daveti kabul edin.'
        ]);
    }
    if (/Could not resolve host|unable to access|Failed to connect|timed out/i.test(e)) {
        stop('GitHub\'a ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin. (Commit bu bilgisayarda duruyor; tekrar çalıştırınca gönderilir.)');
    }
    stop('git push başarısız oldu. Ayrıntı yukarıda. (Commit bu bilgisayarda duruyor; sorun çözülünce tekrar çalıştırın.)');
}

// ---------------------------------------------------------------------------
(async () => {
    try {
        console.log('==============================================================');
        console.log('🚀 PsikoVaka - Tek adımda yayın (doğrula + derle + GitHub\'a gönder)');
        if (DRY_RUN) console.log('   DENEME MODU: git\'e yazan hiçbir komut çalıştırılmayacak.');
        console.log('==============================================================\n');

        console.log('[1/5] Git ve GitHub kontrolü...');
        checkGitRepo();
        const remoteUrl = await ensureRemote();
        console.log(`📦 Hedef Depo: ${remoteUrl}`);
        checkRemoteNotAhead();

        console.log('\n[2/5] Vakalar doğrulanıyor ve tek dosyalık sürüm derleniyor...');
        runBuild();

        console.log('\n[3/5] Sunucu cevap anahtarı (Supabase SQL) vakalardan üretiliyor...');
        runAnswerKey();

        console.log('\n[4/5] Değişiklikler hazırlanıyor ve kaydediliyor (commit)...');
        const pendingCount = stageAndCount();
        await commit(pendingCount);

        console.log('\n[5/5] GitHub\'a gönderiliyor (git push)...');
        push();

        const actionsUrl = actionsUrlFrom(remoteUrl);
        if (DRY_RUN) {
            console.log('\n✅ DENEME BİTTİ. Doğrulama ve üretim adımları çalıştı; git komutları yalnızca yazdırıldı.');
        } else {
            console.log('\n✅ BAŞARILI! Güncellemeler GitHub\'a gönderildi.');
            console.log('   • Site (GitHub Pages) genelde 1-2 dakika içinde yenilenir.');
            console.log('   • Vaka/cevap değiştiyse, cevap anahtarı GitHub Actions tarafından Supabase\'e otomatik yüklenir.');
            if (actionsUrl) console.log(`     Sonucu görmek için: ${actionsUrl}  (yeşil tik = tamam, kırmızı çarpı = sorun)`);
        }
    } catch (err) {
        if (err instanceof StopError) {
            console.error('\n❌ ' + err.message);
        } else {
            console.error('\n❌ Beklenmeyen hata:', (err && err.message) || err);
        }
        process.exit(1);
    }
})();
