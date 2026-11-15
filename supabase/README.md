# PsikoVaka — Supabase kurulumu (adım adım)

Bu klasör, PsikoVaka'nın çevrimiçi katmanının (hesaplar, arkadaşlar, odalar, sunucu otoriteli maç, RP)
Supabase tarafını içerir. Site yine GitHub Pages'te statik kalır; tarayıcı Supabase'e yalnızca
**herkese açık (publishable / anon) anahtar** ile bağlanır.

> **Durum:** Taslak. SQL, yerel test ortamında çalıştırıldı ve 44 senaryo testinin hepsi geçti
> (PGlite/PostgreSQL 18.6 ve PostgreSQL 16.15 üzerinde, `tests/00_supabase_stubs.sql` taklitleriyle).
> Gerçek Supabase projesinde henüz çalıştırılmadı. İlk çalıştırmada bir hata çıkarsa mesajı
> olduğu gibi geliştiriciye iletin.

Proje: `wanjxcuqyghiyvculgau` → Project URL: **`https://wanjxcuqyghiyvculgau.supabase.co`**

## Klasördeki dosyalar

| Dosya | Ne işe yarar |
|---|---|
| `migrations/0001_init.sql` | Bütün tablolar, güvenlik kuralları (RLS), sunucu fonksiyonları, Realtime ayarları. **Bir kez** çalıştırılır. |
| `seed/0002_cases_answer_key.sql` | Vakaların doğru cevapları + seçenek listesi. Otomatik üretilir; elle düzenlemeyin. |
| `seed/generate_answer_key.js` | Yukarıdaki dosyayı `js/cases.js` vb. dosyalardan üretir. `GITHUBA_YUKLE.bat` bunu her seferinde çalıştırır. |
| `../.github/workflows/supabase-cevap-anahtari.yml` | GitHub'a her yüklemede cevap anahtarını Supabase'e **otomatik** uygular (bkz. "Yeni vaka ekleyince"). |
| `tests/` | Yalnızca geliştiriciler için test. Supabase'e **yüklenmez**. |
| `TASARIM.md` | Veri modeli, oda durum makinesi, Realtime ve API sözleşmesi, açık kararlar. |

## 1. Proje (tamam)

Proje zaten açılmış. Yeni bir proje açmanız gerekirse bölge olarak Avrupa'dan birini seçin
(ör. Frankfurt `eu-central-1`); Türkiye'ye en yakın seçenekler bunlar. Veritabanı şifresini bir
şifre yöneticisine kaydedin; siteye hiçbir zaman girmeyecek.

## 2. Şemayı kurun (SQL Editor)

1. Supabase Dashboard'da projeyi açın → sol menüde **SQL Editor** → yeni sorgu (**New query**).
2. `supabase/migrations/0001_init.sql` dosyasının **tamamını** kopyalayıp yapıştırın → **Run**.
   - Dosya tek bir işlem (`begin … commit`) olarak çalışır: hata olursa hiçbir şey yarım kalmaz.
   - Sonda "realtime.messages bulunamadı" uyarısı görürseniz kanal yetkileri atlanmış demektir;
     geliştiriciye haber verin.
3. Cevap anahtarı: aşağıdaki "GitHub'a veritabanı bağlantısını tanıtma" kurulumunu bir kez yaptıysanız
   bunu elle yapmanız gerekmez; GitHub kendisi yükler. Kurulumdan önce denemek isterseniz: yeni bir sorgu
   açın, `supabase/seed/0002_cases_answer_key.sql` dosyasının tamamını yapıştırın → **Run**.
4. Kontrol: `select count(*) from public.cases_answer_key where is_active;` → `js/cases.js` içindeki
   aktif vaka sayısı dönmeli (`node supabase/seed/generate_answer_key.js` çıktısındaki sayıyla aynı).

`0001_init.sql` dosyasını ikinci kez çalıştırmayın ("already exists" hatası verir). İleride şema
değişikliği `0002_...sql`, `0003_...sql` gibi yeni dosyalarla `migrations/` klasörüne gelecek.

> **Şema değişiklikleri (`migrations/*.sql`) otomatik UYGULANMAZ.** GitHub yalnızca cevap anahtarını
> (`seed/0002_cases_answer_key.sql`) yükler. Yeni bir migration dosyası geldiğinde onu bir geliştiriciyle
> birlikte okuyup SQL Editor'de **elle** çalıştırın. Sebep: şema değişikliği tabloları/kuralları
> değiştirir; yanlışlıkla otomatik çalışırsa oyuncu verisini bozabilir.

## Yeni vaka ekleyince (her seferinde — tek adım)

1. `js/cases.js` dosyasına vakayı ekleyin (ya da yapay zeka asistanına ekletin).
2. Proje klasöründe **`GITHUBA_YUKLE.bat`** dosyasına çift tıklayın. Commit mesajı sorarsa kısa bir
   açıklama yazın (ör. "5 yeni vaka") ya da boş bırakıp Enter'a basın.

Bu kadar. Arka planda sırayla şunlar olur:

| Adım | Nerede | Ne olur |
|---|---|---|
| 1 | Bilgisayarınız | GitHub'da sizde olmayan bir değişiklik var mı bakılır; varsa üzerine yazmamak için durur ve ne yapacağınızı söyler. |
| 2 | Bilgisayarınız | `node build_portable_single_file.js`: bütün vakalar doğrulanır (tanı/terapi/ilaç kimlikleri gerçekten var mı, 6 ipucu var mı) ve `PsikoVaka_Tam_Surum.html` yeniden üretilir. **Hata varsa durur, hiçbir şey gönderilmez**; hatalı vaka ekranda yazar. |
| 3 | Bilgisayarınız | `node supabase/seed/generate_answer_key.js`: sunucunun cevap anahtarı (`seed/0002_cases_answer_key.sql`) vakalardan yeniden üretilir. |
| 4 | Bilgisayarınız | Değişiklikler kaydedilir (commit) ve GitHub'a gönderilir (push). `--force` kullanılmaz. |
| 5 | GitHub | Site (GitHub Pages) 1-2 dakikada yenilenir. |
| 6 | GitHub Actions | Vaka/tanı/terapi/ilaç dosyaları değiştiyse "Supabase cevap anahtari" işi çalışır: cevap anahtarını **yeniden üretir** ve Supabase'e uygular, sonunda kaç vakanın yüklendiğini yazar. |

- Güvenle tekrar çalıştırılabilir. `js/cases.js`'ten silinen ya da kimliği değişen bir vaka Supabase'den
  **silinmez**, "pasif" yapılır (yeni maçlarda çıkmaz; eski maç kayıtları bozulmaz). Geri eklenirse tekrar aktif olur.
  Tanı/terapi/ilaç listelerinden çıkan seçenekler katalogdan silinir; ama hâlâ bir vakanın (pasif olsa bile)
  doğru cevabıysa tutulur.
- 6. adım çalışmazsa (ör. kurulum yapılmadıysa) sunucu **eski cevaplara göre** puanlar; Actions sekmesinde
  kırmızı çarpı görürsünüz (aşağıya bakın).
- Bu ilk kurulumu henüz yapmadıysanız ilk yükleme sonrası Actions'ta kırmızı çarpı görmeniz normal:
  kurulumu yapıp işi elle yeniden çalıştırın.
- Gerekenler: bilgisayarda **Node.js** (https://nodejs.org, LTS) ve **Git for Windows** kurulu olmalı.
  Eksikse `GITHUBA_YUKLE.bat` bunu söyler.

## GitHub'a veritabanı bağlantısını tanıtma (bir kez)

GitHub'ın cevap anahtarını Supabase'e yükleyebilmesi için veritabanına bağlanma adresini, depoya
**gizli değer (secret)** olarak bir kez girmeniz gerekir.

> **Bu adres bir sırdır.** İçinde veritabanı şifresi var; bu adresi bilen herkes bütün güvenlik
> kurallarını atlayıp veritabanını değiştirebilir. Yalnızca GitHub'daki secret alanına yapıştırın.
> **Siteye, koda, herhangi bir dosyaya, sohbete (yapay zeka dahil), e-postaya yazmayın.**
> Yanlışlıkla paylaşırsanız hemen aşağıdaki "şifreyi sıfırlama" adımıyla şifreyi değiştirin ve
> secret'ı yeni şifreyle güncelleyin.

**A. Bağlantı adresini kopyalayın (Session pooler)**
1. Supabase Dashboard'da projeyi açın → sayfanın üstündeki **Connect** düğmesine tıklayın.
2. Açılan pencerede bağlantı türü olarak **Session pooler**'ı seçin ("Direct connection" değil;
   "Transaction pooler" da değil). Arayüzde adlar biraz farklı olabilir; "Session" geçen seçeneği arayın.
3. Adres şuna benzer (URI biçimi):
   `postgresql://postgres.wanjxcuqyghiyvculgau:[YOUR-PASSWORD]@aws-0-....pooler.supabase.com:5432/postgres`
   - Kullanıcı adı `postgres.wanjxcuqyghiyvculgau` biçiminde (noktadan sonra proje kimliği), adres
     `...pooler.supabase.com` ile bitiyor ve port **5432** olmalı.
   - Sunucu adını (`aws-...pooler.supabase.com` kısmı) kendiniz yazmayın; pencereden olduğu gibi kopyalayın.
4. Neden Session pooler: GitHub'ın sunucuları yalnızca IPv4 kullanır; Supabase'in doğrudan bağlantısı
   (`db.wanjxcuqyghiyvculgau.supabase.co`) varsayılan olarak IPv6'dır ve GitHub'dan bağlanamaz.
   Session pooler her planda IPv4 ile çalışır.

**B. Şifreyi yerleştirin**
- Adresteki `[YOUR-PASSWORD]` kısmını (köşeli parantezler dahil) **gerçek veritabanı şifrenizle**
  değiştirin. Bu, Supabase hesabınızın giriş şifresi değil; projeyi açarken belirlediğiniz
  **veritabanı şifresi**.
- Şifrede `@ : / ? # & %` veya boşluk gibi karakterler varsa adres bozulur. En kolayı: şifreyi
  aşağıdaki gibi sıfırlayıp **yalnızca harf ve rakamdan** oluşan uzun bir şifre seçmek.
- **Şifreyi unuttuysanız / sıfırlamak için:** Dashboard → **Database** → **Settings** bölümünde
  (arayüze göre Project Settings → Database altında da olabilir) "Reset database password" benzeri
  düğme. Yeni şifreyi bir şifre yöneticisine kaydedin. Sıfırlamadan hemen sonra pooler bağlantısı
  birkaç dakika eski şifreyi bekleyip hata verebilir; biraz bekleyip tekrar deneyin.
  Not: şifreyi değiştirirseniz GitHub'daki secret'ı da yeni şifreyle güncelleyin.

**C. GitHub'a secret olarak ekleyin**
1. https://github.com/gandalfthegreey/psikovaka → üstte **Settings** (depo ayarları; hesap ayarları değil).
2. Sol menü → **Secrets and variables** → **Actions** → **New repository secret**.
3. **Name:** tam olarak `SUPABASE_DB_URL` (büyük harf, alt çizgi).
   **Secret:** B adımında şifreyi yerleştirdiğiniz adresin tamamı. → **Add secret**.
4. GitHub secret'ı bir daha göstermez; değiştirmek için aynı yerden **Update** kullanılır.

**D. Çalıştı mı? / elle yeniden çalıştırma**
- Depoda üstteki **Actions** sekmesi → solda **Supabase cevap anahtari**. Her çalışma bir satırdır:
  yeşil tik = cevap anahtarı yüklendi; kırmızı çarpı = yüklenmedi.
- Bir çalışmaya tıklayıp "Dogrulama / Verify counts" adımını açınca kaç aktif vaka, kaç pasif vaka
  ve kaç seçenek olduğu yazar; aktif vaka sayısı `js/cases.js` ile aynı olmalı.
- Elle çalıştırmak için (ör. secret'ı ilk kez ekledikten sonra): Actions → **Supabase cevap anahtari** →
  sağda **Run workflow** → dal `main` → **Run workflow**. Başarısız bir çalışmayı aynen tekrarlamak
  için o çalışmanın sayfasında **Re-run jobs** de kullanılabilir.
- Sık görülen kırmızı çarpı sebepleri (hata mesajı Türkçe + İngilizce yazar):
  - "SUPABASE_DB_URL eksik": C adımı yapılmamış ya da adı farklı yazılmış.
  - "[YOUR-PASSWORD]": şifre yerleştirilmemiş (B adımı).
  - `password authentication failed`: şifre yanlış; sıfırlayıp secret'ı güncelleyin.
  - `Network is unreachable` / bağlantı zaman aşımı: Session pooler yerine doğrudan bağlantı adresi girilmiş (A adımı).
  - "Sema yok / Schema missing": `migrations/0001_init.sql` henüz Supabase'de çalıştırılmamış (bölüm 2).
  - Supabase projesi duraklatılmış (bölüm 7): Dashboard'dan **Resume project**, sonra Run workflow.
- Yedek yol (GitHub çalışmazsa): `supabase/seed/0002_cases_answer_key.sql` dosyasının tamamını SQL
  Editor'de çalıştırmak aynı sonucu verir.

## 3. Giriş yöntemleri

### 3a. E-posta + şifre
Dashboard → **Authentication** → **Sign In / Providers** (eski arayüzde "Providers") → **Email**:
açık olduğundan emin olun. "Confirm email" (e-posta doğrulaması) açık kalsın.

Not: Supabase'in yerleşik e-posta gönderimi deneme amaçlıdır ve saatlik gönderim sınırı düşüktür.
Gerçek kullanıcılar gelince **Authentication → Emails → SMTP Settings** bölümünden kendi SMTP
sağlayıcınızı bağlamanız önerilir. Güncel sınırları Supabase belgelerinden kontrol edin.

### 3b. Google ile giriş
> **2026-11-15 (Emre kararı):** Google ile giriş siteden kaldırıldı; yalnızca e-posta + şifre kullanılıyor. Bu bölüm yalnızca ileride geri açılırsa diye duruyor (istemcide de yeniden bağlanması gerekir).

Google tarafı (Google Cloud Console, https://console.cloud.google.com):
1. Bir proje seçin/oluşturun → **APIs & Services** → **OAuth consent screen**: uygulama adı
   (PsikoVaka), destek e-postası; kullanıcı türü **External**. İzinler (scopes) için `email`,
   `profile`, `openid` yeterli.
2. **APIs & Services → Credentials → Create credentials → OAuth client ID** → tür: **Web application**.
3. **Authorized JavaScript origins**:
   - `https://gandalfthegreey.github.io`
   - `http://localhost:5500` (yerelde hangi portu kullanıyorsanız onu ekleyin)
4. **Authorized redirect URIs** (tam olarak bu, Supabase'in geri dönüş adresi):
   - `https://wanjxcuqyghiyvculgau.supabase.co/auth/v1/callback`
5. Oluşan **Client ID** ve **Client secret** değerlerini kopyalayın.

Supabase tarafı: **Authentication → Sign In / Providers → Google** → etkinleştirin, Client ID ve
Client secret'ı yapıştırın → Save. (Bu ekranda da aynı callback adresi gösterilir; Google'a girdiğinizle
aynı olmalı.)

Google client secret de bir sırdır: yalnızca Supabase'deki bu alana girilir, siteye veya sohbete yazılmaz.

## 4. Site adresi ve izinli yönlendirmeler

**Authentication → URL Configuration**:
- **Site URL:** `https://gandalfthegreey.github.io/psikovaka/`
- **Redirect URLs** (her biri ayrı satır):
  - `https://gandalfthegreey.github.io/psikovaka/**`
  - `http://localhost:5500/**`
  - `http://127.0.0.1:5500/**`

Giriş sonrası (Google veya e-posta doğrulama bağlantısı) kullanıcı bu adreslerden birine döner;
listede olmayan bir adrese yönlendirme reddedilir.

## 5. Realtime ayarı

Oda ve çevrimiçi durumu kanalları **özel kanal** olarak tasarlandı (yalnızca odadakiler / arkadaşlar
dinleyebilir). Dashboard → **Realtime → Settings** bölümünde, yalnızca özel kanallara izin veren
seçeneği (arayüzde "Allow public access" anahtarını kapatmak gibi görünüyor; adı değişmiş olabilir)
açın. Bu ayar istemci kodu yeni sürüme geçtikten sonra yapılmalı; eski sürüm Realtime kullanmıyor,
etkilenmez.

## 6. Geliştiricilere verilecek İKİ değer

1. **Project URL:** `https://wanjxcuqyghiyvculgau.supabase.co`
2. **Herkese açık anahtar** (publishable ya da anon public).

**Anahtarı nerede bulurum?** Dashboard'da projeyi açın → sol altta **Project Settings** (dişli) →
**API Keys**. Aynı anahtarlar sayfanın üstündeki **Connect** düğmesinden de kopyalanabilir.
Supabase arayüzü zaman zaman değişiyor; aşağıdakilerden birini arayın:
- `sb_publishable_` ile başlayan **Publishable key** (yeni anahtar sistemi; tercih edilen), **veya**
- "Legacy API keys" sekmesinde **anon** / **public** etiketli, `eyJ` ile başlayan uzun anahtar.

Bu anahtar herkese açık olacak şekilde tasarlanmıştır; sitenin koduna girmesi sorun değildir,
çünkü bütün güvenlik veritabanındaki RLS kurallarıyla sağlanır.

> **UYARI — ASLA paylaşmayın, siteye koymayın:** `sb_secret_` ile başlayan **Secret key** ve
> **service_role** etiketli anahtar. Bunlar bütün güvenlik kurallarını atlar; sızarsa bütün
> veritabanı açığa çıkar. Sohbete, e-postaya, GitHub'a yazmayın. Yanlışlıkla paylaşırsanız
> aynı sayfadan hemen yenileyin (rotate). Veritabanı şifresi için de aynısı geçerli.

## 7. Ücretsiz plan uyarısı

Ücretsiz plandaki projeler, yaklaşık **bir hafta** boyunca veritabanında çok az etkinlik olursa
**duraklatılır** (pause). Supabase önceden e-posta ile uyarır. Duraklatılan proje Dashboard'dan
**Resume project** ile geri açılır; veriler korunur (geri açma süresi sınırlıdır, belgelerden
kontrol edin). Oyun düzenli oynandıkça bu sorun olmaz; sınav dönemi gibi uzun aralarda dikkat edin.
Kota ve fiyatlar değişebildiği için kesin değerleri https://supabase.com/pricing sayfasından kontrol edin.

## 8. (İsteğe bağlı) Eski odaların temizliği

Kimsenin bağlı olmadığı odalar, biri yeni oda kurduğunda otomatik kapatılır. Ayrıca düzenli
temizlik istenirse Dashboard → **Integrations → Cron** (pg_cron) ile 15 dakikada bir şu çalıştırılabilir:
`select public._close_stale_rooms();` — zorunlu değil.

## 9. Ayarları değiştirmek

Tur süresi, HP düellosu canı/çarpanı, RP ödülleri, bağlantı kopma toleransları
`public.game_config` tablosundadır. Örnek: `update public.game_config set value = 800 where key = 'hp_start';`
Değişiklik yeni başlayan maçlara uygulanır.

## 10. Testler (geliştiriciler için)

```
cd supabase/tests
npm install
npm test            # PGlite (tarayıcı dışı WASM Postgres) ile, kurulum gerektirmez
```
Gerçek bir Postgres ile: `DATABASE_URL=postgres://...  npm test` — **yalnızca boş, atılabilir bir
test veritabanı**; Supabase projesine bağlamayın (test, stub şema kurar).
