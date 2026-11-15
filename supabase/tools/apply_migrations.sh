#!/usr/bin/env bash
# PsikoVaka — supabase/migrations/NNNN_*.sql dosyalarını sırayla, yalnızca bir kez uygular.
#
# Kullanım:  DATABASE_URL=postgres://... bash supabase/tools/apply_migrations.sh [migrations_klasörü]
#   GitHub Actions'ta DATABASE_URL = secrets.SUPABASE_DB_URL (Session pooler). Bağlantı dizesi
#   hiçbir zaman yazdırılmaz.
#
# Kurallar
#   * Kayıt tablosu public._migrations(name, applied_at, checksum) yoksa açılır
#     (RLS açık, politika yok, anon/authenticated'a yetki yok).
#   * Dosyalar ad sırasıyla (LC_ALL=C) işlenir; kaydı olan atlanır. Kaydı olanın içeriği
#     (sha256) değiştiyse UYARI verilir ama başarısız sayılmaz (dosya yeniden çalıştırılmaz).
#   * Başlangıç kuralı: 0001_init.sql tekrar çalıştırılamaz ve canlı projede zaten elle
#     uygulanmıştır. public.profiles varsa ve 0001 kaydı yoksa, 0001 çalıştırılmadan
#     "uygulanmış" diye kaydedilir. (Boş veritabanında 0001 normal çalışır.)
#   * Her dosya kendi begin/commit bloğunu içerir; psql -v ON_ERROR_STOP=1 ile ilk hatada
#     durulur, açık işlem geri alınır, o dosya KAYDEDİLMEZ ve betik 1 ile çıkar
#     (sonraki dosyalar denenmez).
#   * Dosya ve kayıt aynı psql oturumunda: dosya başarıyla biterse hemen kaydedilir.
set -euo pipefail
set +x   # bağlantı dizesi hiçbir koşulda izlenmesin

MIG_DIR="${1:-supabase/migrations}"
if [ -z "${DATABASE_URL:-}" ]; then
  echo "::error::DATABASE_URL tanımlı değil. / DATABASE_URL is not set."
  exit 2
fi
if [ ! -d "$MIG_DIR" ]; then
  echo "::error::Migration klasörü yok: $MIG_DIR"
  exit 2
fi

PSQL=(psql "$DATABASE_URL" -X -q -v ON_ERROR_STOP=1 --no-psqlrc)
q() { "${PSQL[@]}" -At -c "$1"; }

summary() { if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then echo "$1" >> "$GITHUB_STEP_SUMMARY"; fi; }

# 1) Kayıt tablosu
"${PSQL[@]}" <<'SQL'
set client_min_messages = warning;
create table if not exists public._migrations (
  name       text primary key,
  applied_at timestamptz not null default now(),
  checksum   text
);
alter table public._migrations enable row level security;
revoke all on public._migrations from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on public._migrations from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on public._migrations from authenticated';
  end if;
end $$;
SQL

applied=0; skipped=0; recorded=0; warned=0
summary "### Veritabanı güncellemeleri (migration)"
summary ""

FILES=()
for f in "$MIG_DIR"/[0-9][0-9][0-9][0-9]_*.sql; do
  [ -e "$f" ] || continue
  n=$(basename "$f")
  if [[ "$n" =~ ^[0-9]{4}_[A-Za-z0-9_]+\.sql$ ]]; then
    FILES+=("$n")
  else
    echo "::warning::Ad deseni uymadığı için atlandı (yalnızca harf, rakam, _): $n"
  fi
done
mapfile -t FILES < <(printf '%s\n' "${FILES[@]}" | LC_ALL=C sort)
[ "${#FILES[@]}" -eq 1 ] && [ -z "${FILES[0]}" ] && FILES=()
if [ "${#FILES[@]}" -eq 0 ]; then
  echo "Migration dosyası yok."
  exit 0
fi

for name in "${FILES[@]}"; do
  # ad deseni yukarıda doğrulandı: yalnızca rakam, harf, _ ve .sql -> SQL'e güvenle gömülebilir
  file="$MIG_DIR/$name"
  sum=$(sha256sum "$file" | cut -d' ' -f1)
  old=$(q "select coalesce((select checksum from public._migrations where name = '$name'), '<yok>')")

  if [ "$old" != "<yok>" ]; then
    if [ -n "$old" ] && [ "$old" != "$sum" ]; then
      echo "::warning title=Migration değişmiş / changed::$name daha önce uygulanmış ama içeriği değişmiş (yeniden çalıştırılmadı). Değişiklik gerekiyorsa yeni bir NNNN_ dosyası ekleyin."
      summary "- ⚠️ \`$name\`: zaten uygulanmış, içeriği sonradan değişmiş (yeniden çalıştırılmadı)"
      warned=$((warned + 1))
    else
      echo "atlandı (zaten uygulanmış): $name"
      summary "- \`$name\`: zaten uygulanmış"
    fi
    skipped=$((skipped + 1))
    continue
  fi

  if [ "$name" = "0001_init.sql" ] && [ "$(q "select (to_regclass('public.profiles') is not null)::text")" = "true" ]; then
    q "insert into public._migrations (name, checksum) values ('$name', '$sum') on conflict (name) do nothing" >/dev/null
    echo "kaydedildi (önceden elle uygulanmış, çalıştırılmadı): $name"
    summary "- \`$name\`: önceden elle uygulanmış; çalıştırılmadan kaydedildi"
    recorded=$((recorded + 1))
    continue
  fi

  echo "uygulanıyor: $name"
  if "${PSQL[@]}" -f "$file" \
       -c "insert into public._migrations (name, checksum) values ('$name', '$sum') on conflict (name) do update set checksum = excluded.checksum, applied_at = now()"; then
    echo "uygulandı: $name"
    summary "- ✅ \`$name\`: uygulandı"
    applied=$((applied + 1))
  else
    echo "::error title=Migration başarısız / failed::$name uygulanamadı; değişiklikleri geri alındı ve kaydedilmedi. Sonraki dosyalar denenmedi. Ayrıntı yukarıdaki psql çıktısında."
    summary "- ❌ \`$name\`: BAŞARISIZ (geri alındı, kaydedilmedi). Sonrakiler denenmedi."
    exit 1
  fi
done

echo "Özet: $applied uygulandı, $recorded kaydedildi (önceden uygulanmış), $skipped atlandı, $warned uyarı."
summary ""
summary "Özet: $applied uygulandı, $recorded kaydedildi, $skipped atlandı, $warned uyarı."
