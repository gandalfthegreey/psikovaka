-- =============================================================================
-- PsikoVaka — 0006: sınıf (projeksiyon) modu + anonim kullanıcı sertleştirmesi
-- (Claude ajan S2, 2026-11-21; Emre kararı 2026-11-21)
-- =============================================================================
-- Ek ve TEKRAR ÇALIŞTIRILABİLİR (idempotent) migration. 0001…0005'ten SONRA.
-- Sözleşme: supabase/TASARIM.md §15. GitHub Actions (supabase-migrasyon.yml →
-- tools/apply_migrations.sh) bunu bir kez uygular; ikinci çalıştırma hiçbir şeyi değiştirmez.
--
-- Ne ekler / değiştirir:
--   A) Anonim kullanıcı (Supabase anonymous sign-in: rol 'authenticated', JWT is_anonymous=true)
--      * public.anon_mu() yardımcı fonksiyonu.
--      * public._uid() artık anonim çağırana ANON_IZINSIZ fırlatır. 0001–0005'teki bütün istemci
--        RPC'leri çağıranı _uid() ile aldığı için hepsi anonimi reddeder (imza/yetki değişmez).
--      * can_use_realtime_topic anonime her kanalda false.
--      * Sınıf dışı her RLS'li tabloya kısıtlayıcı (AS RESTRICTIVE) 'anon_engel' politikası:
--        anonim kullanıcı hiçbir satır göremez/yazamaz (game_config hariç).
--      * _handle_new_user anonim kullanıcıya profil AÇMAZ; anonim hesap kalıcıya dönerse
--        (is_anonymous true → false) profil o anda açılır.
--   B) Sınıf modu: sinif_* tabloları, RLS, Realtime yayını, sinif_* RPC'leri. RP'ye,
--      liderliğe, match_results'a, günlük/seri tablolarına DOKUNMAZ.
-- Kurallar 0001 ile aynı: security definer + set search_path = '', şemalı adlar, sabit hata
-- kodları, yeni nesnelerden yetki önce geri alınır sonra yalnızca gerekene verilir.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- 1. Ayarlar (var olan değerlere dokunulmaz)
-- -----------------------------------------------------------------------------
insert into public.game_config (key, value, note) values
  ('sinif_geri_sayim_sn',      3,   'Sınıf modu: tur açılırken ilk ipucundan önceki geri sayım (sn)'),
  ('sinif_hareketsiz_dk',      120, 'Sınıf modu: son durum değişikliğinden bu kadar dakika sonra açık oturum biter'),
  ('sinif_azami_saat',         24,  'Sınıf modu: oluşturulmasından bu kadar saat sonra açık oturum biter'),
  ('sinif_saatlik_katilim',    10,  'Sınıf modu: bir kullanıcının son 1 saatte katılabileceği farklı oturum sayısı'),
  ('sinif_azami_acik_oturum',  3,   'Sınıf modu: bir sunucunun aynı anda açık tutabileceği oturum sayısı')
on conflict (key) do nothing;

-- -----------------------------------------------------------------------------
-- 2. Anonim kullanıcı yardımcıları ve sertleştirme
-- -----------------------------------------------------------------------------
-- Çağıran anonim mi? JWT 'is_anonymous' claim'i (Supabase) VEYA auth.users.is_anonymous.
create or replace function public.anon_mu()
returns boolean
language plpgsql stable
security definer
set search_path = ''
as $$
declare
  v_claims jsonb;
  v_uid uuid;
begin
  begin
    v_claims := coalesce(nullif(current_setting('request.jwt.claims', true), ''),
                         nullif(current_setting('request.jwt.claim', true), ''))::jsonb;
  exception when others then
    v_claims := null;
  end;
  if coalesce(v_claims ->> 'is_anonymous', '') = 'true' then return true; end if;
  v_uid := auth.uid();
  if v_uid is null then return false; end if;
  -- İkinci savunma hattı: auth.users satırı (okunamazsa JWT claim'i tek kaynak kalır)
  begin
    return coalesce((select (to_jsonb(u) ->> 'is_anonymous') = 'true' from auth.users u where u.id = v_uid), false);
  exception when insufficient_privilege then
    return false;
  end;
end $$;

-- Bütün sınıf dışı istemci RPC'leri çağıranı buradan alır → anonim reddedilir.
create or replace function public._uid()
returns uuid
language plpgsql stable
set search_path = ''
as $$
declare v uuid := auth.uid();
begin
  if v is null then perform public._raise('NOT_AUTHENTICATED', 'Giriş yapmalısın.'); end if;
  if public.anon_mu() then
    perform public._raise('ANON_IZINSIZ', 'Misafir (anonim) oturumla bu işlem yapılamaz; hesabınla giriş yap.');
  end if;
  return v;
end $$;

-- Sınıf RPC'leri: anonim dahil her giriş yapmış kullanıcı
create or replace function public._sinif_uid()
returns uuid
language plpgsql stable
set search_path = ''
as $$
declare v uuid := auth.uid();
begin
  if v is null then perform public._raise('NOT_AUTHENTICATED', 'Giriş yapmalısın.'); end if;
  return v;
end $$;

-- Realtime özel kanal yetkisi (0001 ile aynı + anonime her zaman false)
create or replace function public.can_use_realtime_topic(p_topic text, p_write boolean)
returns boolean
language plpgsql stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_id uuid;
begin
  if v_uid is null or p_topic is null then return false; end if;
  if public.anon_mu() then return false; end if;

  if p_topic ~ '^room:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    v_id := substr(p_topic, 6)::uuid;
    return exists (select 1 from public.room_players
                    where room_id = v_id and user_id = v_uid and left_at is null);
  end if;

  if p_topic ~ '^online:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    v_id := substr(p_topic, 8)::uuid;
    if v_id = v_uid then return true; end if;
    return (not p_write) and public._is_friend(v_uid, v_id);
  end if;

  return false;
end $$;

-- Profil açma (0003'teki _handle_new_user gövdesi; anonim kullanıcıda çağrılmaz)
create or replace function public._profil_ac(p_id uuid, p_meta jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare v_name text;
begin
  v_name := left(btrim(coalesce(p_meta ->> 'full_name', p_meta ->> 'name', '')), 30);
  if v_name = '' then v_name := 'Klinisyen'; end if;
  insert into public.profiles (id, display_name, ranked_points)
  values (p_id, v_name, greatest(0, coalesce(
            (select c.value from public.game_config c where c.key = 'rp_default'), 0))::integer)
  on conflict (id) do nothing;
end $$;

-- Kayıt tetikleyicisi (0003 ile aynı davranış) + anonim kullanıcıya profil AÇILMAZ
create or replace function public._handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(to_jsonb(new) ->> 'is_anonymous', 'false') <> 'true' then
    perform public._profil_ac(new.id, coalesce(new.raw_user_meta_data, '{}'::jsonb));
  end if;
  return new;
end $$;

-- Anonim hesap kalıcı hesaba bağlanınca (is_anonymous true → false) profil açılır
create or replace function public._handle_user_upgraded()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(to_jsonb(old) ->> 'is_anonymous', 'false') = 'true'
     and coalesce(to_jsonb(new) ->> 'is_anonymous', 'false') <> 'true' then
    perform public._profil_ac(new.id, coalesce(new.raw_user_meta_data, '{}'::jsonb));
  end if;
  return new;
end $$;

do $$
begin
  if exists (select 1 from information_schema.columns
              where table_schema = 'auth' and table_name = 'users' and column_name = 'is_anonymous') then
    begin
      execute 'drop trigger if exists on_auth_user_upgraded on auth.users';
      execute 'create trigger on_auth_user_upgraded after update of is_anonymous on auth.users
                 for each row execute function public._handle_user_upgraded()';
    exception when insufficient_privilege then
      raise notice 'auth.users üzerinde tetikleyici yetkisi yok; on_auth_user_upgraded atlandı (anonim→kalıcı dönüşte profil açılmaz).';
    end;
  else
    raise notice 'auth.users.is_anonymous yok; on_auth_user_upgraded tetikleyicisi atlandı.';
  end if;
end $$;

-- Sınıf dışı RLS'li bütün tablolara kısıtlayıcı politika: anonim kullanıcı hiçbir satırı
-- okuyamaz/yazamaz. Görünümler (leaderboard, daily_leaderboard) security_invoker olduğu için
-- alttaki profiles/daily_results kuralına tabidir. game_config (zararsız ayarlar) hariç.
do $$
declare t text;
begin
  for t in
    select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity
       and c.relname <> 'game_config' and c.relname not like 'sinif\_%'
     order by c.relname
  loop
    execute format('drop policy if exists anon_engel on public.%I', t);
    execute format('create policy anon_engel on public.%I as restrictive for all to authenticated
                      using (not (select public.anon_mu())) with check (not (select public.anon_mu()))', t);
  end loop;
end $$;

-- -----------------------------------------------------------------------------
-- 3. Sınıf modu tabloları
-- -----------------------------------------------------------------------------
create table if not exists public.sinif_oturumlari (
  id               uuid primary key default gen_random_uuid(),
  kod              text not null,
  host_id          uuid not null references public.profiles(id) on delete cascade,
  durum            text not null default 'lobi',
  surum            integer not null default 1,
  tur_no           smallint not null default 0,
  vaka_sayisi      smallint not null default 5,
  hedef            public.target_type not null default 'diagnosis',
  kurslar          text[],
  kategoriler      text[],
  ipucu_araligi_sn smallint not null default 15,
  tahmin_hakki     smallint not null default 3,
  kapasite         smallint not null default 100,
  gec_katilim      boolean not null default true,
  tur_baslangic    timestamptz,
  tur_son          timestamptz,
  tur_kapandi      timestamptz,
  olusturma        timestamptz not null default now(),
  durum_degisti    timestamptz not null default now(),
  bitis            timestamptz,
  bitis_nedeni     text,
  constraint sinif_durum_gecerli check (durum in ('lobi', 'tur', 'cevap', 'skor', 'bitti', 'iptal')),
  constraint sinif_bitis_nedeni_gecerli check (bitis_nedeni is null or bitis_nedeni in ('tamamlandi', 'sunucu', 'iptal', 'zaman_asimi')),
  constraint sinif_kod_bicim check (kod ~ '^[A-Z0-9]{6}$'),
  constraint sinif_vaka_sayisi_aralik check (vaka_sayisi between 3 and 15),
  constraint sinif_aralik_aralik check (ipucu_araligi_sn between 8 and 60),
  constraint sinif_hak_aralik check (tahmin_hakki between 1 and 6),
  constraint sinif_kapasite_aralik check (kapasite between 2 and 100),
  constraint sinif_tur_no_aralik check (tur_no between 0 and vaka_sayisi)
);
create unique index if not exists sinif_oturumlari_acik_kod on public.sinif_oturumlari (kod)
  where durum in ('lobi', 'tur', 'cevap', 'skor');
create index if not exists sinif_oturumlari_host_acik on public.sinif_oturumlari (host_id)
  where durum in ('lobi', 'tur', 'cevap', 'skor');
create index if not exists sinif_oturumlari_acik_zaman on public.sinif_oturumlari (durum_degisti)
  where durum in ('lobi', 'tur', 'cevap', 'skor');

create table if not exists public.sinif_katilimcilar (
  id              uuid primary key default gen_random_uuid(),
  oturum_id       uuid not null references public.sinif_oturumlari(id) on delete cascade,
  user_id         uuid not null references auth.users(id) on delete cascade,
  takma_ad        text not null,
  takma_ad_kucuk  text not null,
  puan            integer not null default 0,
  dogru_sayisi    smallint not null default 0,
  toplam_sure_ms  bigint not null default 0,
  katildigi_tur   smallint not null default 1,
  katilma         timestamptz not null default now(),
  ayrildi         boolean not null default false,
  ayrilma         timestamptz,
  atildi          boolean not null default false,
  constraint sinif_katilimci_tek unique (oturum_id, user_id),
  constraint sinif_takma_ad_tek unique (oturum_id, takma_ad_kucuk),
  constraint sinif_takma_ad_uzunluk check (char_length(takma_ad) between 2 and 16),
  constraint sinif_puan_negatif_degil check (puan >= 0)
);
create index if not exists sinif_katilimcilar_user_zaman on public.sinif_katilimcilar (user_id, katilma);

-- Gizli: gelecek turların vakaları (istemci okuyamaz)
create table if not exists public.sinif_vaka_sirasi (
  oturum_id uuid not null references public.sinif_oturumlari(id) on delete cascade,
  tur_no    smallint not null,
  case_id   text not null references public.cases_answer_key(case_id),
  primary key (oturum_id, tur_no)
);

-- Başlamış turlar (üyeler okur; cevap YOK)
create table if not exists public.sinif_turlari (
  oturum_id      uuid not null references public.sinif_oturumlari(id) on delete cascade,
  tur_no         smallint not null,
  case_id        text not null references public.cases_answer_key(case_id),
  baslangic      timestamptz not null,
  son            timestamptz not null,
  kapandi        timestamptz,
  kapanma_nedeni text,
  primary key (oturum_id, tur_no),
  constraint sinif_kapanma_nedeni_gecerli check (kapanma_nedeni is null or kapanma_nedeni in ('sure', 'herkes_bitti', 'sunucu', 'oturum_bitti'))
);

-- Katılımcı × tur sonucu (ilk tahminde oluşur; tahmin içeriği yok)
create table if not exists public.sinif_tur_sonuclari (
  oturum_id     uuid not null references public.sinif_oturumlari(id) on delete cascade,
  tur_no        smallint not null,
  katilimci_id  uuid not null references public.sinif_katilimcilar(id) on delete cascade,
  tahmin_sayisi smallint not null default 0,
  bitti         boolean not null default false,
  cozdu         boolean not null default false,
  ipucu_no      smallint,
  puan          integer not null default 0,
  sure_ms       integer,
  guncelleme    timestamptz not null default now(),
  primary key (oturum_id, tur_no, katilimci_id)
);
create index if not exists sinif_tur_sonuclari_katilimci on public.sinif_tur_sonuclari (katilimci_id);

-- Gizli: tahmin içerikleri (yalnızca sinif_durum ile sahibine)
create table if not exists public.sinif_tahminleri (
  id           bigint generated always as identity primary key,
  oturum_id    uuid not null references public.sinif_oturumlari(id) on delete cascade,
  tur_no       smallint not null,
  katilimci_id uuid not null references public.sinif_katilimcilar(id) on delete cascade,
  tahmin_no    smallint not null,
  item_id      text not null,
  dogru        boolean not null,
  ayni_grup    boolean not null,
  ipucu_no     smallint not null,
  puan         integer not null default 0,
  zaman        timestamptz not null default now(),
  constraint sinif_tahmin_tek unique (oturum_id, tur_no, katilimci_id, item_id)
);
create index if not exists sinif_tahminleri_katilimci on public.sinif_tahminleri (katilimci_id, tur_no);

alter table public.sinif_oturumlari    enable row level security;
alter table public.sinif_katilimcilar  enable row level security;
alter table public.sinif_vaka_sirasi   enable row level security;
alter table public.sinif_turlari       enable row level security;
alter table public.sinif_tur_sonuclari enable row level security;
alter table public.sinif_tahminleri    enable row level security;

-- -----------------------------------------------------------------------------
-- 4. RLS yardımcıları ve politikalar
-- -----------------------------------------------------------------------------
create or replace function public.sinif_sunucusu_mu(p_oturum uuid)
returns boolean
language sql stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.sinif_oturumlari o where o.id = p_oturum and o.host_id = auth.uid())
$$;

-- Sunucu ya da (atılmamış) katılımcı
create or replace function public.sinif_uyesi_mi(p_oturum uuid)
returns boolean
language sql stable
security definer
set search_path = ''
as $$
  select public.sinif_sunucusu_mu(p_oturum)
      or exists (select 1 from public.sinif_katilimcilar k
                  where k.oturum_id = p_oturum and k.user_id = auth.uid() and not k.atildi)
$$;

-- Tur sonucu satırı okunur mu: sunucu her zaman; katılımcı kendi satırını; başkasınınkini tur kapandıysa
create or replace function public.sinif_tur_sonucu_okunur(p_oturum uuid, p_tur smallint, p_katilimci uuid)
returns boolean
language sql stable
security definer
set search_path = ''
as $$
  select public.sinif_sunucusu_mu(p_oturum)
      or exists (select 1 from public.sinif_katilimcilar k
                  where k.id = p_katilimci and k.user_id = auth.uid() and not k.atildi)
      or (public.sinif_uyesi_mi(p_oturum)
          and exists (select 1 from public.sinif_turlari t
                       where t.oturum_id = p_oturum and t.tur_no = p_tur and t.kapandi is not null))
$$;

drop policy if exists sinif_oturumlari_read on public.sinif_oturumlari;
create policy sinif_oturumlari_read on public.sinif_oturumlari
  for select to authenticated using (public.sinif_uyesi_mi(id));

drop policy if exists sinif_katilimcilar_read on public.sinif_katilimcilar;
create policy sinif_katilimcilar_read on public.sinif_katilimcilar
  for select to authenticated using (public.sinif_uyesi_mi(oturum_id));

drop policy if exists sinif_turlari_read on public.sinif_turlari;
create policy sinif_turlari_read on public.sinif_turlari
  for select to authenticated using (public.sinif_uyesi_mi(oturum_id));

drop policy if exists sinif_tur_sonuclari_read on public.sinif_tur_sonuclari;
create policy sinif_tur_sonuclari_read on public.sinif_tur_sonuclari
  for select to authenticated using (public.sinif_tur_sonucu_okunur(oturum_id, tur_no, katilimci_id));
-- sinif_vaka_sirasi, sinif_tahminleri: bilerek POLİTİKASIZ.

-- -----------------------------------------------------------------------------
-- 5. İç fonksiyonlar
-- -----------------------------------------------------------------------------
create or replace function public._sinif_acik(p_durum text)
returns boolean
language sql immutable
set search_path = ''
as $$ select p_durum in ('lobi', 'tur', 'cevap', 'skor') $$;

-- Taban puan: ipucu 1..6 → 1000, 850, 700, 550, 400, 250
create or replace function public._sinif_taban(p_ipucu integer)
returns integer
language sql immutable
set search_path = ''
as $$ select (array[1000, 850, 700, 550, 400, 250])[greatest(1, least(6, p_ipucu))] $$;

-- Şu anki ipucu (0 = geri sayım). p_gecen_ms = tur başından beri geçen ms
create or replace function public._sinif_ipucu(p_gecen_ms numeric, p_aralik integer)
returns integer
language sql immutable
set search_path = ''
as $$
  select case when p_gecen_ms < 0 then 0
              else least(6, 1 + floor(p_gecen_ms / (p_aralik * 1000.0))::integer) end
$$;

-- Hız bonusu: ipucu penceresinde geçen süreye göre 100 → 0 (doğrusal)
create or replace function public._sinif_hiz_bonusu(p_gecen_ms numeric, p_ipucu integer, p_aralik integer)
returns integer
language sql immutable
set search_path = ''
as $$
  select greatest(0, least(100, round(100 * (1 - (p_gecen_ms - (p_ipucu - 1) * p_aralik * 1000.0)
                                                  / (p_aralik * 1000.0)))::integer))
$$;

create or replace function public._sinif_aktif_sayisi(p_oturum uuid, p_tur integer)
returns integer
language sql stable
security definer
set search_path = ''
as $$
  select count(*)::integer from public.sinif_katilimcilar k
   where k.oturum_id = p_oturum and not k.ayrildi and not k.atildi and k.katildigi_tur <= greatest(p_tur, 1)
$$;

-- Turu kapat (oturum satırı kilitli olmalı). Puanlar toplamlara burada eklenir.
create or replace function public._sinif_turu_kapat(p_oturum uuid, p_neden text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare v_o public.sinif_oturumlari;
begin
  select * into v_o from public.sinif_oturumlari where id = p_oturum;
  if not found or v_o.durum <> 'tur' then return; end if;

  update public.sinif_turlari set kapandi = now(), kapanma_nedeni = p_neden
   where oturum_id = p_oturum and tur_no = v_o.tur_no and kapandi is null;

  update public.sinif_katilimcilar k
     set puan = k.puan + s.puan,
         dogru_sayisi = k.dogru_sayisi + (case when s.cozdu then 1 else 0 end),
         toplam_sure_ms = k.toplam_sure_ms + (case when s.cozdu then coalesce(s.sure_ms, 0) else 0 end)
    from public.sinif_tur_sonuclari s
   where s.oturum_id = p_oturum and s.tur_no = v_o.tur_no and s.katilimci_id = k.id
     and (s.puan > 0 or s.cozdu);

  update public.sinif_oturumlari
     set durum = 'cevap', tur_kapandi = now(), durum_degisti = now(), surum = surum + 1
   where id = p_oturum;
end $$;

-- Turu aç (oturum satırı kilitli olmalı)
create or replace function public._sinif_tur_baslat(p_oturum uuid, p_tur smallint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_o public.sinif_oturumlari;
  v_case text;
  v_bas timestamptz;
  v_son timestamptz;
begin
  select * into v_o from public.sinif_oturumlari where id = p_oturum;
  select q.case_id into v_case from public.sinif_vaka_sirasi q where q.oturum_id = p_oturum and q.tur_no = p_tur;
  if v_case is null then perform public._raise('NOT_ENOUGH_CASES', 'Tur için vaka bulunamadı.'); end if;
  v_bas := now() + make_interval(secs => public._cfg('sinif_geri_sayim_sn'));
  v_son := v_bas + make_interval(secs => 6 * v_o.ipucu_araligi_sn);
  insert into public.sinif_turlari (oturum_id, tur_no, case_id, baslangic, son)
  values (p_oturum, p_tur, v_case, v_bas, v_son)
  on conflict (oturum_id, tur_no) do nothing;
  update public.sinif_oturumlari
     set durum = 'tur', tur_no = p_tur, tur_baslangic = v_bas, tur_son = v_son, tur_kapandi = null,
         durum_degisti = now(), surum = surum + 1
   where id = p_oturum;
end $$;

-- Oturumu bitir (kilitli olmalı). Açık tur önce kapanır ve puanlanır.
create or replace function public._sinif_sonlandir(p_oturum uuid, p_neden text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare v_o public.sinif_oturumlari;
begin
  select * into v_o from public.sinif_oturumlari where id = p_oturum;
  if not found or not public._sinif_acik(v_o.durum) then return; end if;
  if v_o.durum = 'tur' then perform public._sinif_turu_kapat(p_oturum, 'oturum_bitti'); end if;
  update public.sinif_oturumlari
     set durum = case when v_o.durum = 'lobi' and p_neden = 'iptal' then 'iptal' else 'bitti' end,
         bitis = now(), bitis_nedeni = p_neden, durum_degisti = now(), surum = surum + 1
   where id = p_oturum;
end $$;

-- Zamana bağlı geçiş gerekiyor mu? (kilitsiz ön kontrol)
create or replace function public._sinif_gecis_gerekli(p_o public.sinif_oturumlari)
returns boolean
language sql stable
security definer
set search_path = ''
as $$
  select public._sinif_acik(p_o.durum) and (
           (p_o.durum = 'tur' and now() >= p_o.tur_son)
        or p_o.durum_degisti < now() - make_interval(mins => public._cfg('sinif_hareketsiz_dk')::integer)
        or p_o.olusturma < now() - make_interval(hours => public._cfg('sinif_azami_saat')::integer))
$$;

-- Zamana bağlı geçişler (kilitli olmalı; idempotent)
create or replace function public._sinif_ilerlet(p_oturum uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare v_o public.sinif_oturumlari;
begin
  select * into v_o from public.sinif_oturumlari where id = p_oturum;
  if not found or not public._sinif_acik(v_o.durum) then return; end if;
  if v_o.durum_degisti < now() - make_interval(mins => public._cfg('sinif_hareketsiz_dk')::integer)
     or v_o.olusturma < now() - make_interval(hours => public._cfg('sinif_azami_saat')::integer) then
    perform public._sinif_sonlandir(p_oturum, 'zaman_asimi');
    return;
  end if;
  if v_o.durum = 'tur' and now() >= v_o.tur_son then
    perform public._sinif_turu_kapat(p_oturum, 'sure');
  end if;
end $$;

-- Süresi dolan bütün açık oturumları kapat (oluştur/katıl/oturumlarım içinde çağrılır)
create or replace function public._sinif_zaman_asimi()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_n integer := 0;
begin
  for v_id in
    select o.id from public.sinif_oturumlari o
     where o.durum in ('lobi', 'tur', 'cevap', 'skor')
       and (o.durum_degisti < now() - make_interval(mins => public._cfg('sinif_hareketsiz_dk')::integer)
            or o.olusturma < now() - make_interval(hours => public._cfg('sinif_azami_saat')::integer))
     limit 200
     for update skip locked
  loop
    perform public._sinif_sonlandir(v_id, 'zaman_asimi');
    v_n := v_n + 1;
  end loop;
  return v_n;
end $$;

-- Herkes bitti mi? (en az bir aktif katılımcı varken)
create or replace function public._sinif_herkes_bitti(p_oturum uuid, p_tur smallint)
returns boolean
language sql stable
security definer
set search_path = ''
as $$
  select public._sinif_aktif_sayisi(p_oturum, p_tur) > 0
     and not exists (
       select 1 from public.sinif_katilimcilar k
        where k.oturum_id = p_oturum and not k.ayrildi and not k.atildi and k.katildigi_tur <= p_tur
          and not exists (select 1 from public.sinif_tur_sonuclari s
                           where s.oturum_id = p_oturum and s.tur_no = p_tur
                             and s.katilimci_id = k.id and s.bitti))
$$;

-- Kilitle + zaman geçişlerini uygula; güncel satırı döner
create or replace function public._sinif_kilitle(p_oturum uuid)
returns public.sinif_oturumlari
language plpgsql
security definer
set search_path = ''
as $$
declare v_o public.sinif_oturumlari;
begin
  select * into v_o from public.sinif_oturumlari where id = p_oturum for update;
  if not found then perform public._raise('SINIF_YOK', 'Sınıf oturumu bulunamadı.'); end if;
  perform public._sinif_ilerlet(p_oturum);
  select * into v_o from public.sinif_oturumlari where id = p_oturum;
  return v_o;
end $$;

-- Sunucu mu? değilse üye ise SADECE_SUNUCU, değilse SINIF_YOK
create or replace function public._sinif_sunucu_sart(p_o public.sinif_oturumlari, p_uid uuid)
returns void
language plpgsql stable
security definer
set search_path = ''
as $$
begin
  if p_o.host_id = p_uid then return; end if;
  if exists (select 1 from public.sinif_katilimcilar k where k.oturum_id = p_o.id and k.user_id = p_uid and not k.atildi) then
    perform public._raise('SADECE_SUNUCU', 'Bunu yalnızca oturumu açan öğretmen yapabilir.');
  end if;
  perform public._raise('SINIF_YOK', 'Sınıf oturumu bulunamadı.');
end $$;

-- Ayar okuma yardımcıları
create or replace function public._sinif_ayar_int(p_j jsonb, p_key text, p_def integer, p_min integer, p_max integer)
returns integer
language plpgsql immutable
set search_path = ''
as $$
declare v jsonb := p_j -> p_key; n numeric;
begin
  if v is null or jsonb_typeof(v) = 'null' then return p_def; end if;
  if jsonb_typeof(v) <> 'number' then perform public._raise('INVALID_SETTINGS', p_key); end if;
  n := (v #>> '{}')::numeric;
  if n <> trunc(n) or n < p_min or n > p_max then perform public._raise('INVALID_SETTINGS', p_key); end if;
  return n::integer;
end $$;

create or replace function public._sinif_ayar_liste(p_j jsonb, p_key text)
returns text[]
language plpgsql immutable
set search_path = ''
as $$
declare v jsonb := p_j -> p_key; r text[] := '{}'; e jsonb; s text;
begin
  if v is null or jsonb_typeof(v) = 'null' then return null; end if;
  if jsonb_typeof(v) = 'string' then v := jsonb_build_array(v); end if;
  if jsonb_typeof(v) <> 'array' or jsonb_array_length(v) > 30 then perform public._raise('INVALID_SETTINGS', p_key); end if;
  for e in select * from jsonb_array_elements(v) loop
    if jsonb_typeof(e) <> 'string' then perform public._raise('INVALID_SETTINGS', p_key); end if;
    s := btrim(e #>> '{}');
    if s = '' or char_length(s) > 60 then perform public._raise('INVALID_SETTINGS', p_key); end if;
    if not s = any(r) then r := r || s; end if;
  end loop;
  if cardinality(r) = 0 then return null; end if;
  return r;
end $$;

-- Süzgece uyan aktif vakalar
create or replace function public._sinif_uygun_vaka_sayisi(p_kurslar text[], p_kategoriler text[])
returns integer
language sql stable
security definer
set search_path = ''
as $$
  select count(*)::integer from public.cases_answer_key k
   where k.is_active
     and (p_kurslar is null or k.course = any(p_kurslar))
     and (p_kategoriler is null or k.category = any(p_kategoriler))
$$;

create or replace function public._sinif_ayarlar_json(p_o public.sinif_oturumlari)
returns jsonb
language sql stable
set search_path = ''
as $$
  select jsonb_build_object(
    'vaka_sayisi', p_o.vaka_sayisi, 'hedef', p_o.hedef, 'kurslar', to_jsonb(p_o.kurslar),
    'kategoriler', to_jsonb(p_o.kategoriler), 'ipucu_araligi_sn', p_o.ipucu_araligi_sn,
    'tahmin_hakki', p_o.tahmin_hakki, 'kapasite', p_o.kapasite, 'gec_katilim', p_o.gec_katilim)
$$;

-- Tam durum (çağıranın rolüne göre)
create or replace function public._sinif_durum_json(p_oturum uuid, p_uid uuid)
returns jsonb
language plpgsql stable
security definer
set search_path = ''
as $$
declare
  v_o public.sinif_oturumlari;
  v_t public.sinif_turlari;
  v_me public.sinif_katilimcilar;
  v_host boolean;
  v_kapali boolean;
  v_gecen numeric;
  v_ipucu integer;
  v_tur jsonb;
  v_ben jsonb;
  v_list jsonb;
  v_sonuc jsonb;
  v_podyum jsonb;
  v_host_j jsonb;
begin
  select * into v_o from public.sinif_oturumlari where id = p_oturum;
  v_host := v_o.host_id = p_uid;
  if not v_host then
    select * into v_me from public.sinif_katilimcilar where oturum_id = p_oturum and user_id = p_uid;
  end if;

  select jsonb_build_object('username', p.username, 'display_name', p.display_name, 'avatar', p.avatar)
    into v_host_j from public.profiles p where p.id = v_o.host_id;

  if v_o.tur_no > 0 then
    select * into v_t from public.sinif_turlari where oturum_id = p_oturum and tur_no = v_o.tur_no;
  end if;
  v_kapali := v_t.kapandi is not null;

  if v_t.tur_no is not null then
    v_gecen := extract(epoch from now() - v_t.baslangic) * 1000;
    v_ipucu := case when v_kapali then 6 else public._sinif_ipucu(v_gecen, v_o.ipucu_araligi_sn) end;
    v_tur := jsonb_build_object(
      'tur_no', v_t.tur_no, 'case_id', v_t.case_id, 'baslangic', v_t.baslangic, 'son', v_t.son,
      'ipucu_no', v_ipucu, 'kapandi', v_t.kapandi, 'kapanma_nedeni', v_t.kapanma_nedeni,
      'aktif_sayisi', public._sinif_aktif_sayisi(p_oturum, v_t.tur_no),
      'biten_sayisi', (select count(*) from public.sinif_tur_sonuclari s
                         join public.sinif_katilimcilar k on k.id = s.katilimci_id and not k.atildi
                        where s.oturum_id = p_oturum and s.tur_no = v_t.tur_no and s.bitti),
      'cozen_sayisi', case when v_kapali then
                        (select count(*) from public.sinif_tur_sonuclari s
                           join public.sinif_katilimcilar k on k.id = s.katilimci_id and not k.atildi
                          where s.oturum_id = p_oturum and s.tur_no = v_t.tur_no and s.cozdu) end,
      'cevap', case when v_kapali and v_o.durum in ('cevap', 'skor', 'bitti') then public._answer_json(v_t.case_id) end);
  end if;

  -- katılımcılar (atılanlar hariç), sıralı
  select coalesce(jsonb_agg(jsonb_build_object(
           'katilimci_id', x.id, 'takma_ad', x.takma_ad, 'puan', x.puan, 'sira', x.sira,
           'dogru_sayisi', x.dogru_sayisi, 'ayrildi', x.ayrildi, 'katildigi_tur', x.katildigi_tur,
           'bitti', coalesce(x.s_bitti, false),
           'tur_puan', case when v_kapali then coalesce(x.s_puan, 0) end,
           'cozdu', case when v_kapali then coalesce(x.s_cozdu, false) end,
           'ipucu_no', case when v_kapali then x.s_ipucu end) order by x.ord), '[]'::jsonb)
    into v_list
    from (select k.*, s.bitti as s_bitti, s.puan as s_puan, s.cozdu as s_cozdu, s.ipucu_no as s_ipucu,
                 rank() over (order by k.puan desc) as sira,
                 row_number() over (order by k.puan desc, k.dogru_sayisi desc, k.toplam_sure_ms asc,
                                             k.takma_ad_kucuk asc, k.id) as ord
            from public.sinif_katilimcilar k
            left join public.sinif_tur_sonuclari s
              on s.oturum_id = k.oturum_id and s.tur_no = v_o.tur_no and s.katilimci_id = k.id
           where k.oturum_id = p_oturum and not k.atildi) x;

  -- kapanmış turların özeti
  select coalesce(jsonb_agg(jsonb_build_object(
           'tur_no', t.tur_no, 'case_id', t.case_id, 'cevap', public._answer_json(t.case_id),
           'cozen_sayisi', (select count(*) from public.sinif_tur_sonuclari s
                              join public.sinif_katilimcilar k on k.id = s.katilimci_id and not k.atildi
                             where s.oturum_id = p_oturum and s.tur_no = t.tur_no and s.cozdu),
           'katilan_sayisi', (select count(*) from public.sinif_katilimcilar k
                               where k.oturum_id = p_oturum and not k.atildi and k.katildigi_tur <= t.tur_no))
           order by t.tur_no), '[]'::jsonb)
    into v_sonuc
    from public.sinif_turlari t
   where t.oturum_id = p_oturum and t.kapandi is not null;

  if v_o.durum = 'bitti' then
    select coalesce(jsonb_agg(e order by (e ->> 'sira')::integer), '[]'::jsonb) into v_podyum
      from jsonb_array_elements(v_list) e
     where (e ->> 'sira')::integer <= 3;
  end if;

  if v_me.id is not null then
    v_ben := jsonb_build_object(
      'katilimci_id', v_me.id, 'takma_ad', v_me.takma_ad, 'puan', v_me.puan,
      'sira', (select (e ->> 'sira')::integer from jsonb_array_elements(v_list) e
                where e ->> 'katilimci_id' = v_me.id::text),
      'katildigi_tur', v_me.katildigi_tur,
      'aktif', not v_me.ayrildi and not v_me.atildi and v_me.katildigi_tur <= greatest(v_o.tur_no, 1),
      'tur', case when v_t.tur_no is not null then
               (select jsonb_build_object(
                         'tahmin_sayisi', coalesce(s.tahmin_sayisi, 0),
                         'kalan', case when coalesce(s.bitti, false) then 0
                                       else v_o.tahmin_hakki - coalesce(s.tahmin_sayisi, 0) end,
                         'bitti', coalesce(s.bitti, false), 'cozdu', coalesce(s.cozdu, false),
                         'puan', coalesce(s.puan, 0))
                  from (select 1) d
                  left join public.sinif_tur_sonuclari s
                    on s.oturum_id = p_oturum and s.tur_no = v_t.tur_no and s.katilimci_id = v_me.id) end,
      'tahminlerim', coalesce((select jsonb_agg(jsonb_build_object(
                                 'tahmin_no', g.tahmin_no, 'item_id', g.item_id, 'dogru', g.dogru,
                                 'ayni_grup', g.ayni_grup, 'ipucu_no', g.ipucu_no) order by g.tahmin_no)
                                 from public.sinif_tahminleri g
                                where g.oturum_id = p_oturum and g.tur_no = v_o.tur_no and g.katilimci_id = v_me.id),
                              '[]'::jsonb));
  end if;

  return jsonb_build_object(
    'ok', true, 'server_now', now(),
    'rol', case when v_host then 'sunucu' else 'katilimci' end,
    'oturum', jsonb_build_object(
      'id', v_o.id, 'kod', v_o.kod, 'durum', v_o.durum, 'surum', v_o.surum, 'tur_no', v_o.tur_no,
      'vaka_sayisi', v_o.vaka_sayisi, 'ayarlar', public._sinif_ayarlar_json(v_o), 'sunucu', v_host_j,
      'katilimci_sayisi', public._sinif_aktif_sayisi(p_oturum, 1000),
      'olusturma', v_o.olusturma, 'bitis', v_o.bitis, 'bitis_nedeni', v_o.bitis_nedeni),
    'tur', v_tur,
    'ben', v_ben,
    'katilimcilar', v_list,
    'tur_sonuclari', v_sonuc,
    'podyum', v_podyum);
end $$;

-- -----------------------------------------------------------------------------
-- 6. İstemci RPC'leri (sınıf)
-- -----------------------------------------------------------------------------

-- 6.1 Oturum aç (sunucu: anonim değil + kullanıcı adı)
create or replace function public.sinif_olustur(p_ayarlar jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_j jsonb := coalesce(p_ayarlar, '{}'::jsonb);
  v_vaka integer; v_aralik integer; v_hak integer; v_kap integer;
  v_gec boolean := true;
  v_hedef text;
  v_kurs text[]; v_kat text[];
  v_bulunan integer;
  v_kod text;
  v_o public.sinif_oturumlari;
begin
  perform public._require_player(v_uid);
  if jsonb_typeof(v_j) <> 'object' then perform public._raise('INVALID_SETTINGS', 'ayarlar'); end if;

  v_vaka   := public._sinif_ayar_int(v_j, 'vaka_sayisi', 5, 3, 15);
  v_aralik := public._sinif_ayar_int(v_j, 'ipucu_araligi_sn', 15, 8, 60);
  v_hak    := public._sinif_ayar_int(v_j, 'tahmin_hakki', 3, 1, 6);
  v_kap    := public._sinif_ayar_int(v_j, 'kapasite', 100, 2, 100);
  if v_j ? 'hedef' and jsonb_typeof(v_j -> 'hedef') <> 'null' then
    if jsonb_typeof(v_j -> 'hedef') <> 'string' then perform public._raise('INVALID_SETTINGS', 'hedef'); end if;
    v_hedef := v_j ->> 'hedef';
    if v_hedef <> 'diagnosis' then perform public._raise('INVALID_SETTINGS', 'hedef'); end if;
  end if;
  if v_j ? 'gec_katilim' and jsonb_typeof(v_j -> 'gec_katilim') <> 'null' then
    if jsonb_typeof(v_j -> 'gec_katilim') <> 'boolean' then perform public._raise('INVALID_SETTINGS', 'gec_katilim'); end if;
    v_gec := (v_j ->> 'gec_katilim')::boolean;
  end if;
  v_kurs := public._sinif_ayar_liste(v_j, 'kurslar');
  v_kat  := public._sinif_ayar_liste(v_j, 'kategoriler');

  v_bulunan := public._sinif_uygun_vaka_sayisi(v_kurs, v_kat);
  if v_bulunan < v_vaka then
    perform public._raise('NOT_ENOUGH_CASES', format('Süzgece uyan vaka sayısı: %s', v_bulunan));
  end if;

  perform public._sinif_zaman_asimi();
  if (select count(*) from public.sinif_oturumlari o
       where o.host_id = v_uid and o.durum in ('lobi', 'tur', 'cevap', 'skor'))
     >= public._cfg('sinif_azami_acik_oturum') then
    perform public._raise('COK_FAZLA_OTURUM', 'Açık sınıf oturumu sınırına ulaştın; önce birini bitir.');
  end if;

  for i in 1..30 loop
    v_kod := public._gen_room_code();
    begin
      insert into public.sinif_oturumlari (kod, host_id, vaka_sayisi, hedef, kurslar, kategoriler,
                                           ipucu_araligi_sn, tahmin_hakki, kapasite, gec_katilim)
      values (v_kod, v_uid, v_vaka, 'diagnosis', v_kurs, v_kat, v_aralik, v_hak, v_kap, v_gec)
      returning * into v_o;
      exit;
    exception when unique_violation then
      v_o := null;
    end;
  end loop;
  if v_o.id is null then perform public._raise('CODE_GENERATION_FAILED'); end if;

  return jsonb_build_object('ok', true, 'server_now', now(), 'oturum_id', v_o.id, 'kod', v_o.kod,
                            'ayarlar', public._sinif_ayarlar_json(v_o));
end $$;

-- 6.2 Sunucunun açık oturumları (projeksiyon yeniden yüklenince)
create or replace function public.sinif_oturumlarim()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare v_uid uuid := public._uid();
begin
  perform public._sinif_zaman_asimi();
  return jsonb_build_object('ok', true, 'server_now', now(), 'oturumlar', coalesce((
    select jsonb_agg(jsonb_build_object(
             'oturum_id', o.id, 'kod', o.kod, 'durum', o.durum, 'tur_no', o.tur_no,
             'vaka_sayisi', o.vaka_sayisi, 'katilimci_sayisi', public._sinif_aktif_sayisi(o.id, 1000),
             'olusturma', o.olusturma) order by o.olusturma desc)
      from public.sinif_oturumlari o
     where o.host_id = v_uid and o.durum in ('lobi', 'tur', 'cevap', 'skor')), '[]'::jsonb));
end $$;

-- 6.3 Katıl (anonim dahil)
create or replace function public.sinif_katil(p_kod text, p_takma_ad text default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._sinif_uid();
  v_kod text := upper(regexp_replace(coalesce(p_kod, ''), '\s', '', 'g'));
  v_o public.sinif_oturumlari;
  v_k public.sinif_katilimcilar;
  v_ad text;
  v_yeniden boolean := false;
begin
  perform public._sinif_zaman_asimi();
  select * into v_o from public.sinif_oturumlari
   where kod = v_kod and durum in ('lobi', 'tur', 'cevap', 'skor') for update;
  if not found then perform public._raise('SINIF_YOK', 'Bu kodla açık bir sınıf yok.'); end if;
  perform public._sinif_ilerlet(v_o.id);
  select * into v_o from public.sinif_oturumlari where id = v_o.id;
  if not public._sinif_acik(v_o.durum) then perform public._raise('SINIF_YOK', 'Bu kodla açık bir sınıf yok.'); end if;
  if v_o.host_id = v_uid then
    perform public._raise('SUNUCU_KATILAMAZ', 'Oturumu açan öğretmen katılımcı olarak katılamaz.');
  end if;

  select * into v_k from public.sinif_katilimcilar where oturum_id = v_o.id and user_id = v_uid for update;
  if found then
    if v_k.atildi then perform public._raise('ATILDIN', 'Bu sınıftan çıkarıldın.'); end if;
    if v_k.ayrildi then
      if public._sinif_aktif_sayisi(v_o.id, 1000) >= v_o.kapasite then
        perform public._raise('SINIF_DOLU', 'Sınıf dolu.');
      end if;
      update public.sinif_katilimcilar set ayrildi = false, ayrilma = null where id = v_k.id
      returning * into v_k;
    end if;
    v_yeniden := true;
  else
    if v_o.durum <> 'lobi' and not v_o.gec_katilim then
      perform public._raise('SINIF_BASLADI', 'Oyun başladı; bu sınıfa geç katılım kapalı.');
    end if;
    if public._sinif_aktif_sayisi(v_o.id, 1000) >= v_o.kapasite then
      perform public._raise('SINIF_DOLU', 'Sınıf dolu.');
    end if;
    if (select count(*) from public.sinif_katilimcilar k
         where k.user_id = v_uid and k.katilma > now() - interval '1 hour')
       >= public._cfg('sinif_saatlik_katilim') then
      perform public._raise('COK_FAZLA_ISTEK', 'Kısa sürede çok fazla sınıfa katıldın; biraz sonra dene.');
    end if;

    v_ad := btrim(regexp_replace(coalesce(p_takma_ad, ''), '\s+', ' ', 'g'));
    if v_ad = '' and not public.anon_mu() then
      select coalesce(p.username, '') into v_ad from public.profiles p where p.id = v_uid;
      v_ad := coalesce(v_ad, '');
    end if;
    if char_length(v_ad) not between 2 and 16
       or v_ad !~ '^[A-Za-z0-9À-ÖØ-öø-ÿĞğİıŞş _.-]+$' then
      perform public._raise('TAKMA_AD_GECERSIZ', 'Takma ad 2–16 karakter olmalı; harf, rakam, boşluk, _ - . kullanılabilir.');
    end if;
    if not public.isim_uygun_mu(v_ad) then
      perform public._raise('TAKMA_AD_UYGUNSUZ', 'Bu takma ad kullanılamaz; başka bir ad seç.');
    end if;
    if exists (select 1 from public.sinif_katilimcilar k where k.oturum_id = v_o.id and k.takma_ad_kucuk = lower(v_ad)) then
      perform public._raise('TAKMA_AD_ALINMIS', 'Bu takma ad bu sınıfta alınmış.');
    end if;
    begin
      insert into public.sinif_katilimcilar (oturum_id, user_id, takma_ad, takma_ad_kucuk, katildigi_tur)
      values (v_o.id, v_uid, v_ad, lower(v_ad),
              case when v_o.durum = 'lobi' then 1 else v_o.tur_no + 1 end)
      returning * into v_k;
    exception when unique_violation then
      perform public._raise('TAKMA_AD_ALINMIS', 'Bu takma ad bu sınıfta alınmış.');
    end;
  end if;

  return jsonb_build_object('ok', true, 'server_now', now(), 'oturum_id', v_o.id, 'katilimci_id', v_k.id,
                            'takma_ad', v_k.takma_ad, 'yeniden', v_yeniden, 'katildigi_tur', v_k.katildigi_tur,
                            'durum', v_o.durum, 'tur_no', v_o.tur_no);
end $$;

-- 6.4 Ayrıl (idempotent)
create or replace function public.sinif_ayril(p_oturum uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._sinif_uid();
  v_o public.sinif_oturumlari;
  v_k public.sinif_katilimcilar;
begin
  v_o := public._sinif_kilitle(p_oturum);
  select * into v_k from public.sinif_katilimcilar where oturum_id = p_oturum and user_id = v_uid;
  if not found or v_k.atildi then perform public._raise('SINIF_YOK', 'Bu sınıfın katılımcısı değilsin.'); end if;
  if not v_k.ayrildi then
    update public.sinif_katilimcilar set ayrildi = true, ayrilma = now() where id = v_k.id;
    if v_o.durum = 'tur' and public._sinif_herkes_bitti(p_oturum, v_o.tur_no) then
      perform public._sinif_turu_kapat(p_oturum, 'herkes_bitti');
    end if;
  end if;
  return jsonb_build_object('ok', true, 'server_now', now());
end $$;

-- 6.5 At (sunucu)
create or replace function public.sinif_at(p_oturum uuid, p_katilimci uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._sinif_uid();
  v_o public.sinif_oturumlari;
begin
  v_o := public._sinif_kilitle(p_oturum);
  perform public._sinif_sunucu_sart(v_o, v_uid);
  if not exists (select 1 from public.sinif_katilimcilar where id = p_katilimci and oturum_id = p_oturum) then
    perform public._raise('KATILIMCI_YOK', 'Katılımcı bulunamadı.');
  end if;
  update public.sinif_katilimcilar
     set atildi = true, ayrildi = true, ayrilma = coalesce(ayrilma, now())
   where id = p_katilimci and not atildi;
  if v_o.durum = 'tur' and public._sinif_herkes_bitti(p_oturum, v_o.tur_no) then
    perform public._sinif_turu_kapat(p_oturum, 'herkes_bitti');
  end if;
  return jsonb_build_object('ok', true, 'server_now', now());
end $$;

-- 6.6 Başlat (sunucu)
create or replace function public.sinif_basla(p_oturum uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._sinif_uid();
  v_o public.sinif_oturumlari;
  v_n integer;
begin
  v_o := public._sinif_kilitle(p_oturum);
  perform public._sinif_sunucu_sart(v_o, v_uid);
  if v_o.durum in ('bitti', 'iptal') then perform public._raise('SINIF_BITTI', 'Oturum bitti.'); end if;
  if v_o.durum <> 'lobi' then perform public._raise('SINIF_BASLADI', 'Oyun zaten başladı.'); end if;
  if public._sinif_aktif_sayisi(p_oturum, 1) = 0 then
    perform public._raise('KIMSE_YOK', 'Henüz katılan yok.');
  end if;

  delete from public.sinif_vaka_sirasi where oturum_id = p_oturum;
  insert into public.sinif_vaka_sirasi (oturum_id, tur_no, case_id)
  select p_oturum, (row_number() over ())::smallint, s.case_id
    from (select k.case_id from public.cases_answer_key k
           where k.is_active
             and (v_o.kurslar is null or k.course = any(v_o.kurslar))
             and (v_o.kategoriler is null or k.category = any(v_o.kategoriler))
           order by random()
           limit v_o.vaka_sayisi) s;
  get diagnostics v_n = row_count;
  if v_n < v_o.vaka_sayisi then
    perform public._raise('NOT_ENOUGH_CASES', format('Süzgece uyan vaka sayısı: %s', v_n));
  end if;

  perform public._sinif_tur_baslat(p_oturum, 1::smallint);
  return public._sinif_durum_json(p_oturum, v_uid);
end $$;

-- 6.7 Tahmin (katılımcı)
create or replace function public.sinif_tahmin(p_oturum uuid, p_item_id text, p_tur_no integer default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._sinif_uid();
  v_item text := btrim(coalesce(p_item_id, ''));
  v_o public.sinif_oturumlari;
  v_k public.sinif_katilimcilar;
  v_t public.sinif_turlari;
  v_s public.sinif_tur_sonuclari;
  v_kind public.answer_kind;
  v_item_group text;
  v_dogru_id text;
  v_dogru_group text;
  v_dogru boolean;
  v_ayni boolean;
  v_gecen numeric;
  v_ipucu integer;
  v_puan integer := 0;
  v_no integer;
  v_bitti boolean;
begin
  select * into v_o from public.sinif_oturumlari where id = p_oturum for update;
  if not found then perform public._raise('SINIF_YOK', 'Sınıf oturumu bulunamadı.'); end if;
  select * into v_k from public.sinif_katilimcilar where oturum_id = p_oturum and user_id = v_uid;
  if not found then perform public._raise('SINIF_YOK', 'Bu sınıfın katılımcısı değilsin.'); end if;
  if v_k.atildi then perform public._raise('ATILDIN', 'Bu sınıftan çıkarıldın.'); end if;
  if v_k.ayrildi then perform public._raise('SINIF_YOK', 'Sınıftan ayrıldın; yeniden katıl.'); end if;

  if v_o.durum <> 'tur' or (p_tur_no is not null and p_tur_no <> v_o.tur_no) then
    perform public._raise('TUR_KAPALI', 'Şu an açık tur yok.');
  end if;
  if now() >= v_o.tur_son then
    perform public._raise('TUR_KAPALI', 'Süre doldu; sinif_durum çağırın.');
  end if;
  if now() < v_o.tur_baslangic then perform public._raise('TUR_BASLAMADI', 'Tur birazdan başlıyor.'); end if;
  if v_k.katildigi_tur > v_o.tur_no then
    perform public._raise('TUR_DISI', 'Geç katıldın; bir sonraki turda oynayacaksın.');
  end if;

  select * into v_s from public.sinif_tur_sonuclari
   where oturum_id = p_oturum and tur_no = v_o.tur_no and katilimci_id = v_k.id for update;
  if v_s.cozdu then perform public._raise('ZATEN_COZDUN', 'Bu vakayı çözdün.'); end if;
  if v_s.bitti then perform public._raise('HAK_BITTI', 'Bu turdaki tahmin hakların bitti.'); end if;

  v_kind := v_o.hedef::text::public.answer_kind;   -- şimdilik yalnızca 'diagnosis'
  select c.group_id into v_item_group from public.answer_catalog c where c.kind = v_kind and c.item_id = v_item;
  if not found then perform public._raise('UNKNOWN_ITEM', 'Seçenek listede yok.'); end if;
  if exists (select 1 from public.sinif_tahminleri g
              where g.oturum_id = p_oturum and g.tur_no = v_o.tur_no and g.katilimci_id = v_k.id and g.item_id = v_item) then
    perform public._raise('DUPLICATE_GUESS', 'Bu seçeneği zaten denedin.');
  end if;

  select * into v_t from public.sinif_turlari where oturum_id = p_oturum and tur_no = v_o.tur_no;
  select k.diagnosis_id into v_dogru_id from public.cases_answer_key k where k.case_id = v_t.case_id;
  select c.group_id into v_dogru_group from public.answer_catalog c where c.kind = v_kind and c.item_id = v_dogru_id;

  v_dogru := v_item = v_dogru_id;
  v_ayni := not v_dogru and v_item_group is not null and v_item_group = v_dogru_group;
  v_gecen := extract(epoch from now() - v_o.tur_baslangic) * 1000;
  v_ipucu := greatest(1, public._sinif_ipucu(v_gecen, v_o.ipucu_araligi_sn));
  if v_dogru then
    v_puan := public._sinif_taban(v_ipucu) + public._sinif_hiz_bonusu(v_gecen, v_ipucu, v_o.ipucu_araligi_sn);
  end if;
  v_no := coalesce(v_s.tahmin_sayisi, 0) + 1;
  v_bitti := v_dogru or v_no >= v_o.tahmin_hakki;

  insert into public.sinif_tahminleri (oturum_id, tur_no, katilimci_id, tahmin_no, item_id, dogru, ayni_grup, ipucu_no, puan)
  values (p_oturum, v_o.tur_no, v_k.id, v_no, v_item, v_dogru, v_ayni, v_ipucu, v_puan);

  insert into public.sinif_tur_sonuclari as s (oturum_id, tur_no, katilimci_id, tahmin_sayisi, bitti, cozdu, ipucu_no, puan, sure_ms, guncelleme)
  values (p_oturum, v_o.tur_no, v_k.id, v_no, v_bitti, v_dogru,
          case when v_dogru then v_ipucu end, v_puan,
          case when v_dogru then floor(v_gecen)::integer end, now())
  on conflict (oturum_id, tur_no, katilimci_id) do update
     set tahmin_sayisi = excluded.tahmin_sayisi, bitti = excluded.bitti, cozdu = excluded.cozdu,
         ipucu_no = excluded.ipucu_no, puan = excluded.puan, sure_ms = excluded.sure_ms, guncelleme = now();

  if v_bitti and public._sinif_herkes_bitti(p_oturum, v_o.tur_no) then
    perform public._sinif_turu_kapat(p_oturum, 'herkes_bitti');
  end if;

  return jsonb_build_object(
    'ok', true, 'server_now', now(), 'tur_no', v_o.tur_no, 'item_id', v_item,
    'correct', v_dogru, 'same_group', v_ayni, 'guess_no', v_no,
    'guesses_left', case when v_bitti then 0 else v_o.tahmin_hakki - v_no end,
    'done', v_bitti, 'points', v_puan, 'clue_index', v_ipucu);
end $$;

-- 6.8 Turu erken bitir (sunucu; tur değilse değişiklik yok)
create or replace function public.sinif_turu_bitir(p_oturum uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._sinif_uid();
  v_o public.sinif_oturumlari;
  v_degisti boolean := false;
begin
  v_o := public._sinif_kilitle(p_oturum);
  perform public._sinif_sunucu_sart(v_o, v_uid);
  if v_o.durum in ('bitti', 'iptal') then perform public._raise('SINIF_BITTI', 'Oturum bitti.'); end if;
  if v_o.durum = 'tur' then
    perform public._sinif_turu_kapat(p_oturum, 'sunucu');
    v_degisti := true;
  end if;
  return public._sinif_durum_json(p_oturum, v_uid) || jsonb_build_object('degisti', v_degisti);
end $$;

-- 6.9 Sonraki (sunucu): cevap → skor → tur(n+1) | bitti
create or replace function public.sinif_sonraki(p_oturum uuid, p_beklenen text default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._sinif_uid();
  v_o public.sinif_oturumlari;
begin
  v_o := public._sinif_kilitle(p_oturum);
  perform public._sinif_sunucu_sart(v_o, v_uid);
  if v_o.durum in ('bitti', 'iptal') then perform public._raise('SINIF_BITTI', 'Oturum bitti.'); end if;
  if p_beklenen is not null and p_beklenen <> v_o.durum then
    return public._sinif_durum_json(p_oturum, v_uid) || jsonb_build_object('degisti', false);
  end if;
  if v_o.durum in ('lobi', 'tur') then
    perform public._raise('ASAMA_UYGUN_DEGIL',
      case when v_o.durum = 'lobi' then 'Önce sinif_basla.' else 'Tur sürüyor; erken bitirmek için sinif_turu_bitir.' end);
  end if;
  if v_o.durum = 'cevap' then
    update public.sinif_oturumlari set durum = 'skor', durum_degisti = now(), surum = surum + 1 where id = p_oturum;
  elsif v_o.tur_no < v_o.vaka_sayisi then
    perform public._sinif_tur_baslat(p_oturum, (v_o.tur_no + 1)::smallint);
  else
    perform public._sinif_sonlandir(p_oturum, 'tamamlandi');
  end if;
  return public._sinif_durum_json(p_oturum, v_uid) || jsonb_build_object('degisti', true);
end $$;

-- 6.10 Bitir (sunucu; idempotent): lobide → iptal, değilse → bitti
create or replace function public.sinif_bitir(p_oturum uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._sinif_uid();
  v_o public.sinif_oturumlari;
begin
  v_o := public._sinif_kilitle(p_oturum);
  perform public._sinif_sunucu_sart(v_o, v_uid);
  if public._sinif_acik(v_o.durum) then
    perform public._sinif_sonlandir(p_oturum, case when v_o.durum = 'lobi' then 'iptal' else 'sunucu' end);
  end if;
  return public._sinif_durum_json(p_oturum, v_uid);
end $$;

-- Okuma RPC'leri için ortak: rol kontrolü + gerekiyorsa (yalnızca o zaman kilitle) zaman geçişi
create or replace function public._sinif_okuma_hazirla(p_oturum uuid, p_uid uuid)
returns public.sinif_oturumlari
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_o public.sinif_oturumlari;
  v_atildi boolean;
begin
  select * into v_o from public.sinif_oturumlari where id = p_oturum;
  if not found then perform public._raise('SINIF_YOK', 'Sınıf oturumu bulunamadı.'); end if;
  if v_o.host_id <> p_uid then
    select k.atildi into v_atildi from public.sinif_katilimcilar k where k.oturum_id = p_oturum and k.user_id = p_uid;
    if v_atildi is null then perform public._raise('SINIF_YOK', 'Sınıf oturumu bulunamadı.'); end if;
    if v_atildi then perform public._raise('ATILDIN', 'Bu sınıftan çıkarıldın.'); end if;
  end if;
  if public._sinif_gecis_gerekli(v_o) then
    v_o := public._sinif_kilitle(p_oturum);
  end if;
  return v_o;
end $$;

-- 6.11 Tam durum
create or replace function public.sinif_durum(p_oturum uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare v_uid uuid := public._sinif_uid();
begin
  perform public._sinif_okuma_hazirla(p_oturum, v_uid);
  return public._sinif_durum_json(p_oturum, v_uid);
end $$;

-- 6.12 Hafif özet (yoklama)
create or replace function public.sinif_ozet(p_oturum uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._sinif_uid();
  v_o public.sinif_oturumlari;
begin
  v_o := public._sinif_okuma_hazirla(p_oturum, v_uid);
  return jsonb_build_object('ok', true, 'server_now', now(), 'durum', v_o.durum, 'surum', v_o.surum,
                            'tur_no', v_o.tur_no, 'vaka_sayisi', v_o.vaka_sayisi,
                            'katilimci_sayisi', public._sinif_aktif_sayisi(p_oturum, 1000),
                            'tur_baslangic', v_o.tur_baslangic, 'tur_son', v_o.tur_son,
                            'ipucu_araligi_sn', v_o.ipucu_araligi_sn);
end $$;

-- -----------------------------------------------------------------------------
-- 7. Yetkiler (yalnızca bu migration'ın nesneleri + yeniden tanımlananlar)
-- -----------------------------------------------------------------------------
revoke all on public.sinif_oturumlari, public.sinif_katilimcilar, public.sinif_vaka_sirasi,
              public.sinif_turlari, public.sinif_tur_sonuclari, public.sinif_tahminleri
  from public, anon, authenticated;
grant select on public.sinif_oturumlari, public.sinif_katilimcilar, public.sinif_turlari,
                public.sinif_tur_sonuclari
  to authenticated;
do $$
begin
  execute 'revoke all on sequence public.sinif_tahminleri_id_seq from public, anon, authenticated';
exception when undefined_table then null;
end $$;

-- iç fonksiyonlar: kimseye açık değil
revoke all on function public._sinif_uid()                                      from public, anon, authenticated;
revoke all on function public._profil_ac(uuid, jsonb)                           from public, anon, authenticated;
revoke all on function public._handle_new_user()                                from public, anon, authenticated;
revoke all on function public._handle_user_upgraded()                           from public, anon, authenticated;
revoke all on function public._sinif_acik(text)                                 from public, anon, authenticated;
revoke all on function public._sinif_taban(integer)                             from public, anon, authenticated;
revoke all on function public._sinif_ipucu(numeric, integer)                    from public, anon, authenticated;
revoke all on function public._sinif_hiz_bonusu(numeric, integer, integer)      from public, anon, authenticated;
revoke all on function public._sinif_aktif_sayisi(uuid, integer)                from public, anon, authenticated;
revoke all on function public._sinif_turu_kapat(uuid, text)                     from public, anon, authenticated;
revoke all on function public._sinif_tur_baslat(uuid, smallint)                 from public, anon, authenticated;
revoke all on function public._sinif_sonlandir(uuid, text)                      from public, anon, authenticated;
revoke all on function public._sinif_gecis_gerekli(public.sinif_oturumlari)     from public, anon, authenticated;
revoke all on function public._sinif_ilerlet(uuid)                              from public, anon, authenticated;
revoke all on function public._sinif_zaman_asimi()                              from public, anon, authenticated;
revoke all on function public._sinif_herkes_bitti(uuid, smallint)               from public, anon, authenticated;
revoke all on function public._sinif_kilitle(uuid)                              from public, anon, authenticated;
revoke all on function public._sinif_sunucu_sart(public.sinif_oturumlari, uuid) from public, anon, authenticated;
revoke all on function public._sinif_ayar_int(jsonb, text, integer, integer, integer) from public, anon, authenticated;
revoke all on function public._sinif_ayar_liste(jsonb, text)                    from public, anon, authenticated;
revoke all on function public._sinif_uygun_vaka_sayisi(text[], text[])          from public, anon, authenticated;
revoke all on function public._sinif_ayarlar_json(public.sinif_oturumlari)      from public, anon, authenticated;
revoke all on function public._sinif_durum_json(uuid, uuid)                     from public, anon, authenticated;
revoke all on function public._sinif_okuma_hazirla(uuid, uuid)                  from public, anon, authenticated;

-- yeniden tanımlananlar (create or replace yetkiyi korur; yine de açıkça yeniden kurulur)
revoke all on function public._uid()                                            from public, anon, authenticated;
revoke all on function public.can_use_realtime_topic(text, boolean)             from public, anon, authenticated;
grant execute on function public.can_use_realtime_topic(text, boolean)          to authenticated;

-- RLS yardımcıları + istemci RPC'leri
revoke all on function public.anon_mu()                                         from public, anon, authenticated;
revoke all on function public.sinif_sunucusu_mu(uuid)                           from public, anon, authenticated;
revoke all on function public.sinif_uyesi_mi(uuid)                              from public, anon, authenticated;
revoke all on function public.sinif_tur_sonucu_okunur(uuid, smallint, uuid)     from public, anon, authenticated;
revoke all on function public.sinif_olustur(jsonb)                              from public, anon, authenticated;
revoke all on function public.sinif_oturumlarim()                               from public, anon, authenticated;
revoke all on function public.sinif_katil(text, text)                           from public, anon, authenticated;
revoke all on function public.sinif_ayril(uuid)                                 from public, anon, authenticated;
revoke all on function public.sinif_at(uuid, uuid)                              from public, anon, authenticated;
revoke all on function public.sinif_basla(uuid)                                 from public, anon, authenticated;
revoke all on function public.sinif_tahmin(uuid, text, integer)                 from public, anon, authenticated;
revoke all on function public.sinif_turu_bitir(uuid)                            from public, anon, authenticated;
revoke all on function public.sinif_sonraki(uuid, text)                         from public, anon, authenticated;
revoke all on function public.sinif_bitir(uuid)                                 from public, anon, authenticated;
revoke all on function public.sinif_durum(uuid)                                 from public, anon, authenticated;
revoke all on function public.sinif_ozet(uuid)                                  from public, anon, authenticated;

grant execute on function public.anon_mu()                                      to authenticated;
grant execute on function public.sinif_sunucusu_mu(uuid)                        to authenticated;
grant execute on function public.sinif_uyesi_mi(uuid)                           to authenticated;
grant execute on function public.sinif_tur_sonucu_okunur(uuid, smallint, uuid)  to authenticated;
grant execute on function public.sinif_olustur(jsonb)                           to authenticated;
grant execute on function public.sinif_oturumlarim()                            to authenticated;
grant execute on function public.sinif_katil(text, text)                        to authenticated;
grant execute on function public.sinif_ayril(uuid)                              to authenticated;
grant execute on function public.sinif_at(uuid, uuid)                           to authenticated;
grant execute on function public.sinif_basla(uuid)                              to authenticated;
grant execute on function public.sinif_tahmin(uuid, text, integer)              to authenticated;
grant execute on function public.sinif_turu_bitir(uuid)                         to authenticated;
grant execute on function public.sinif_sonraki(uuid, text)                      to authenticated;
grant execute on function public.sinif_bitir(uuid)                              to authenticated;
grant execute on function public.sinif_durum(uuid)                              to authenticated;
grant execute on function public.sinif_ozet(uuid)                               to authenticated;

-- -----------------------------------------------------------------------------
-- 8. Realtime yayını (RLS'e göre süzülür)
-- -----------------------------------------------------------------------------
do $$
declare t text;
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
  foreach t in array array['sinif_oturumlari', 'sinif_katilimcilar', 'sinif_tur_sonuclari'] loop
    if not exists (select 1 from pg_publication_tables
                    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

commit;
