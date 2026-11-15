/**
 * PsikoVaka - Supabase bağlantı ayarları.
 * Buradaki anahtar HERKESE AÇIK (publishable) anahtardır; sitede durması güvenlidir,
 * çünkü veriye erişimi veritabanındaki güvenlik kuralları (RLS) belirler.
 * "secret" / "service_role" anahtarı ASLA bu dosyaya veya depoya konmaz.
 * index.html bu dosyayı js/account.js'ten önce yükler.
 *
 * Bayraklar:
 *   accountsEnabled   false yapılırsa hesap arayüzü tamamen gizlenir (site misafir modunda çalışır).
 *   passwordMinLength İstemcideki en kısa şifre kuralı. Supabase panelindeki (Auth > Providers > Email >
 *                     Minimum password length) değerden küçük olmamalı.
 */
const PSIKOVAKA_SUPABASE = Object.freeze({
    url: 'https://wanjxcuqyghiyvculgau.supabase.co',
    publishableKey: 'sb_publishable_GgAlGyMZE5Rcgy12KiBXeQ_lIbYQdHJ',
    accountsEnabled: true,
    passwordMinLength: 8
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PSIKOVAKA_SUPABASE };
}
