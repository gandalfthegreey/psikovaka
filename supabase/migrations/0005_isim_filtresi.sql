-- =============================================================================
-- PsikoVaka — 0005: isim filtresi (Claude ajan K2, 2026-11-20; Emre kararı 2026-11-20)
-- =============================================================================
-- Ek ve TEKRAR ÇALIŞTIRILABİLİR (idempotent) migration. 0001…0004'ten SONRA, tek işlemde.
-- GitHub Actions (supabase-migrasyon.yml → tools/apply_migrations.sh) bunu bir kez uygular.
-- Sözleşme: supabase/TASARIM.md §14.
--
-- Ne yapar:
--   1) Küfür / hakaret / nefret ifadesi / ayrılmış ad süzgeci (Türkçe + İngilizce). Terimler
--      public.isim_filtresi_terimleri tablosunda (istemciye kapalı). Tek kaynak tools/isim_filtresi/liste.json;
--      üretici (tools/isim_filtresi/uret.js) aynı veriyi js/isim_filtresi.js'e de yazar. Sonraki liste
--      değişiklikleri yalnızca veri içeren yeni bir migration'dır (uret.js --yeni-migration).
--   2) public.isim_kontrol_ayrinti(text) -> null | 'tr' | 'kalip' | 'en' | 'ayrilmis' (iç kullanım, kayıt için)
--      public.isim_uygun_mu(text) -> boolean (istemci de çağırabilir).
--   3) set_username: yeni hata kodları USERNAME_INAPPROPRIATE ve USERNAME_RESERVED; needs_rename = true olan
--      kullanıcı yeni ad seçince bayrak kalkar (görünen ad da uygunsuzsa 'Klinisyen' olur).
--   4) profiles: needs_rename sütunu + BEFORE INSERT/UPDATE OF username, display_name tetikleyicisi
--      (DISPLAY_NAME_INAPPROPRIATE). Yalnızca bu iki sütun gerçekten değişince denetler; RP/maç sayacı
--      güncellemelerini etkilemez. Kayıtta (INSERT) uygunsuz görünen ad hata vermez, 'Klinisyen' olur.
--   5) Mevcut profiller taranır: kullanıcı adı ya da görünen adı uygunsuz olanlar needs_rename = true.
--      Bayraklı kullanıcı başkalarına görünmez: profiles okuma kuralı (RLS), leaderboard, daily_leaderboard,
--      get_daily_leaderboard (yalnızca kendi 'me' satırı kalır), arkadaş arama/isteği (USER_NOT_FOUND),
--      açık oda listesi (kurduğu lobi listelenmez); get_room_state başkalarına ad yerine 'Oyuncu' gösterir.
-- Kurallar 0003/0004 ile aynı: security definer + set search_path = '', şemalı adlar, yetkiler
-- create or replace sonrasında geri alınıp yeniden verilir.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- 1. Tablolar (istemciye kapalı: RLS açık, politika yok, yetki yok)
-- -----------------------------------------------------------------------------
create table if not exists public.isim_filtresi_terimleri (
  sira   integer primary key,
  tur    text not null,
  kip    text not null,
  terim  text not null,
  desen  text not null,
  ek     text not null default '',
  constraint isim_filtresi_terimleri_tur check (tur in ('tr', 'kalip', 'en', 'ayrilmis', 'beyaz')),
  constraint isim_filtresi_terimleri_kip check (kip in ('alt', 'kelime', 'kelime_ek', 'bas', 'son', 'tam')),
  constraint isim_filtresi_terimleri_desen check (desen ~ '^[a-z+{},2]+$' and ek ~ '^[a-z+{},2|]*$')
);
create table if not exists public.isim_filtresi_harita (
  tur    text not null,
  kaynak text not null,
  hedef  text not null,
  primary key (tur, kaynak),
  constraint isim_filtresi_harita_tur check (tur in ('gorunmez', 'benzer', 'leet'))
);
-- Hızlı yol: kategori başına tek birleşik desen (_isim_filtresi_derle doldurur)
create table if not exists public.isim_filtresi_desenler (
  tur   text primary key,
  desen text not null
);
create table if not exists public.isim_filtresi_surum (
  id          integer primary key default 1,
  surum       integer not null default 0,
  guncellendi timestamptz not null default now(),
  constraint isim_filtresi_surum_tek check (id = 1)
);
insert into public.isim_filtresi_surum (id) values (1) on conflict (id) do nothing;

alter table public.isim_filtresi_terimleri enable row level security;
alter table public.isim_filtresi_harita    enable row level security;
alter table public.isim_filtresi_desenler  enable row level security;
alter table public.isim_filtresi_surum     enable row level security;

-- -----------------------------------------------------------------------------
-- 2. Normalleştirme ve eşleştirme (tools/isim_filtresi/cekirdek.js ile adım adım aynı)
-- -----------------------------------------------------------------------------
-- Adım 1-5: ilk 64 karakter, görünmezleri sil, benzer harf tablosu, NFKD + birleşen işaretleri sil,
-- sözcük sınırı (AMYalamak -> AM Yalamak, AliVeli -> Ali Veli), ASCII küçük harf.
create or replace function public._isim_on_isle(p_metin text)
returns text
language plpgsql stable
security definer
set search_path = ''
as $$
declare
  v text := left(coalesce(p_metin, ''), 64);
  r record;
begin
  for r in select h.kaynak, h.hedef from public.isim_filtresi_harita h where h.tur = 'gorunmez' loop
    v := replace(v, r.kaynak, '');
  end loop;
  for r in select h.kaynak, h.hedef from public.isim_filtresi_harita h where h.tur = 'benzer' loop
    v := replace(v, r.kaynak, r.hedef);
  end loop;
  v := normalize(v, NFKD);
  v := regexp_replace(v, '[' || chr(768) || '-' || chr(879) || ']', '', 'g');
  v := regexp_replace(v, '([A-Z])([A-Z][a-z])', '\1 \2', 'g');
  v := regexp_replace(v, '([a-z])([A-Z])', '\1 \2', 'g');
  return translate(v, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz');
end $$;

-- Eşleşme [p_bas, p_son) (1 tabanlı, son hariç) s içindeki bir beyaz liste eşleşmesinin tamamen içinde mi?
create or replace function public._isim_kapsanmis(p_s text, p_bas integer, p_son integer)
returns boolean
language plpgsql stable
security definer
set search_path = ''
as $$
declare
  w record;
  j integer;
  m text;
begin
  for w in select t.desen from public.isim_filtresi_terimleri t
            where t.tur = 'beyaz' and p_s ~ t.desen order by t.sira loop
    for j in 1 .. least(p_bas, length(p_s)) loop
      m := substring(substr(p_s, j) from '^(' || w.desen || ')');
      if m is not null and j + length(m) >= p_son then
        return true;
      end if;
    end loop;
  end loop;
  return false;
end $$;

-- null (uygun) ya da ilk eşleşen kategori: 'tr' > 'kalip' > 'en' > 'ayrilmis'. İç kullanım (kayıt/teşhis).
create or replace function public.isim_kontrol_ayrinti(p_metin text)
returns text
language plpgsql stable
security definer
set search_path = ''
as $$
declare
  v_on text;
  v_var text;
  v_t text;
  v_soz text[];
  v_butun text;
  v_s text[] := '{}';       -- denenecek dizgeler
  v_b boolean[] := '{}';    -- dizge bir varyantın bütünü mü
  v_butunler text[] := '{}';
  v_kat text;
  r record;
  t record;
  i integer;
  k integer;
  s text;
  m text;
  v_re text;
begin
  if p_metin is null or p_metin = '' then return null; end if;
  v_on := public._isim_on_isle(p_metin);
  foreach v_var in array array['leet', 'rakamsiz'] loop
    v_t := v_on;
    if v_var = 'leet' then
      for r in select h.kaynak, h.hedef from public.isim_filtresi_harita h where h.tur = 'leet' loop
        v_t := replace(v_t, r.kaynak, r.hedef);
      end loop;
    end if;
    v_soz := array(select x from unnest(regexp_split_to_array(v_t, '[^a-z]+')) with ordinality as u(x, n)
                    where x <> '' order by n);
    v_butun := array_to_string(v_soz, '');
    continue when v_butun = '';
    v_s := v_s || v_butun; v_b := v_b || true; v_butunler := v_butunler || v_butun;
    foreach s in array v_soz loop
      if s <> v_butun then v_s := v_s || s; v_b := v_b || false; end if;
    end loop;
  end loop;
  if cardinality(v_s) = 0 then return null; end if;

  foreach v_kat in array array['tr', 'kalip', 'en', 'ayrilmis'] loop
    -- hızlı yol: kökün hiçbiri hiçbir bütünde geçmiyorsa bu kategoride eşleşme olamaz
    select d.desen into v_re from public.isim_filtresi_desenler d where d.tur = v_kat;
    continue when v_re is null;
    continue when not exists (select 1 from unnest(v_butunler) b where b ~ v_re);
    for t in select x.kip, x.desen, x.ek from public.isim_filtresi_terimleri x
              where x.tur = v_kat
                and exists (select 1 from unnest(v_butunler) b where b ~ x.desen)
              order by x.sira loop
      for k in 1 .. cardinality(v_s) loop
        s := v_s[k];
        if t.kip = 'alt' then
          if v_b[k] then
            for i in 1 .. length(s) loop
              m := substring(substr(s, i) from '^(' || t.desen || ')');
              if m is not null and not public._isim_kapsanmis(s, i, i + length(m)) then return v_kat; end if;
            end loop;
          end if;
        elsif t.kip in ('kelime', 'kelime_ek', 'tam') then
          if t.kip = 'kelime_ek' then
            v_re := '^(?:' || t.desen || ')(?:' || t.ek || '){1,2}$';
          elsif t.kip = 'kelime' and t.ek <> '' then
            v_re := '^(?:' || t.desen || ')(?:' || t.ek || '){0,2}$';
          else
            v_re := '^(?:' || t.desen || ')$';
          end if;
          if s ~ v_re and not public._isim_kapsanmis(s, 1, length(s) + 1) then return v_kat; end if;
        elsif t.kip = 'bas' then
          m := substring(s from '^(' || t.desen || ')');
          if m is not null and not public._isim_kapsanmis(s, 1, 1 + length(m)) then return v_kat; end if;
        elsif t.kip = 'son' then
          for i in 1 .. length(s) loop
            if substr(s, i) ~ ('^(?:' || t.desen || ')$') then
              if not public._isim_kapsanmis(s, i, length(s) + 1) then return v_kat; end if;
              exit;
            end if;
          end loop;
        end if;
      end loop;
    end loop;
  end loop;
  return null;
end $$;

-- Ad uygun mu? (ayrılmış adlar da false). İstemci de çağırabilir; hangi sözcüğün eşleştiğini söylemez.
create or replace function public.isim_uygun_mu(p_metin text)
returns boolean
language sql stable
security definer
set search_path = ''
as $$ select public.isim_kontrol_ayrinti(p_metin) is null $$;

-- Kategori başına birleşik hızlı yol deseni (veri migration'larından sonra çağrılır)
create or replace function public._isim_filtresi_derle()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare n integer;
begin
  delete from public.isim_filtresi_desenler;
  insert into public.isim_filtresi_desenler (tur, desen)
  select t.tur, '(?:' || string_agg(t.desen, '|' order by t.sira) || ')'
    from public.isim_filtresi_terimleri t
   where t.tur <> 'beyaz'
   group by t.tur;
  get diagnostics n = row_count;
  return n;
end $$;

-- -----------------------------------------------------------------------------
-- 3. profiles.needs_rename + ad tetikleyicisi
-- -----------------------------------------------------------------------------
alter table public.profiles add column if not exists needs_rename boolean not null default false;

-- Kayıtlı profilleri yeniden tarar. Kullanıcı adı ya da görünen adı uygunsuz (ayrılmış ad DEĞİL) olanları
-- işaretler; listeden çıkarılan bir sözcük yüzünden işaretli kalanların bayrağını kaldırır.
-- Dönüş: yeni işaretlenen profil sayısı.
create or replace function public._isim_filtresi_tara()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare n integer;
begin
  update public.profiles p set needs_rename = true
   where not p.needs_rename
     and (coalesce(public.isim_kontrol_ayrinti(p.username), '') in ('tr', 'kalip', 'en')
          or coalesce(public.isim_kontrol_ayrinti(p.display_name), '') in ('tr', 'kalip', 'en'));
  get diagnostics n = row_count;
  update public.profiles p set needs_rename = false
   where p.needs_rename and p.username is not null
     and coalesce(public.isim_kontrol_ayrinti(p.username), '') not in ('tr', 'kalip', 'en')
     and coalesce(public.isim_kontrol_ayrinti(p.display_name), '') not in ('tr', 'kalip', 'en');
  return n;
end $$;

-- username / display_name değişince denetler. Kayıtta (INSERT) uygunsuz görünen ad -> 'Klinisyen'
-- (auth.users tetikleyicisi kaydı bozmasın). Ayrılmış görünen ad yalnızca istemci rolleriyle yazılırken
-- reddedilir (Emre panelden verebilir); ayrılmış kullanıcı adı set_username'de denetlenir.
create or replace function public._profiles_isim_denetle()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_k text;
  v_istemci boolean := coalesce(current_setting('role', true), 'none') in ('authenticated', 'anon');
begin
  if tg_op = 'INSERT' then
    v_k := public.isim_kontrol_ayrinti(new.display_name);
    if v_k in ('tr', 'kalip', 'en') or (v_k = 'ayrilmis' and v_istemci) then
      new.display_name := 'Klinisyen';
    end if;
    if new.username is not null and public.isim_kontrol_ayrinti(new.username) in ('tr', 'kalip', 'en') then
      perform public._raise('USERNAME_INAPPROPRIATE', 'Bu ad kullanılamıyor. Lütfen başka bir ad seç.');
    end if;
    return new;
  end if;

  if new.username is distinct from old.username and new.username is not null
     and public.isim_kontrol_ayrinti(new.username) in ('tr', 'kalip', 'en') then
    perform public._raise('USERNAME_INAPPROPRIATE', 'Bu ad kullanılamıyor. Lütfen başka bir ad seç.');
  end if;
  if new.display_name is distinct from old.display_name then
    v_k := public.isim_kontrol_ayrinti(new.display_name);
    if v_k in ('tr', 'kalip', 'en') or (v_k = 'ayrilmis' and v_istemci) then
      perform public._raise('DISPLAY_NAME_INAPPROPRIATE', 'Bu ad kullanılamıyor. Lütfen başka bir ad seç.');
    end if;
  end if;
  -- İşaretli kullanıcı iki adını da düzelttiyse bayrak kalkar
  if new.needs_rename and new.username is not null
     and coalesce(public.isim_kontrol_ayrinti(new.username), '') not in ('tr', 'kalip', 'en')
     and coalesce(public.isim_kontrol_ayrinti(new.display_name), '') not in ('tr', 'kalip', 'en') then
    new.needs_rename := false;
  end if;
  return new;
end $$;

drop trigger if exists profiles_isim_denetle on public.profiles;
create trigger profiles_isim_denetle
  before insert or update of username, display_name on public.profiles
  for each row execute function public._profiles_isim_denetle();

-- -----------------------------------------------------------------------------
-- 4. set_username: filtre + işaretli kullanıcının yeniden adlandırması
-- -----------------------------------------------------------------------------
create or replace function public.set_username(p_username text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_name text := btrim(coalesce(p_username, ''));
  v_prof public.profiles;
  v_k text;
begin
  if v_name !~ '^[A-Za-z0-9_]{3,20}$' then
    perform public._raise('USERNAME_INVALID', '3-20 karakter; harf, rakam ve _ kullanılabilir.');
  end if;
  v_k := public.isim_kontrol_ayrinti(v_name);
  if v_k in ('tr', 'kalip', 'en') then
    perform public._raise('USERNAME_INAPPROPRIATE', 'Bu ad kullanılamıyor. Lütfen başka bir ad seç.');
  elsif v_k = 'ayrilmis' then
    perform public._raise('USERNAME_RESERVED', 'Bu ad ayrılmış. Lütfen başka bir ad seç.');
  end if;
  if exists (select 1 from public.profiles
              where lower(username) = lower(v_name) and id <> v_uid) then
    perform public._raise('USERNAME_TAKEN', 'Bu kullanıcı adı alınmış.');
  end if;
  begin
    insert into public.profiles (id, username) values (v_uid, v_name)
    on conflict (id) do update
      set username = excluded.username,
          display_name = case
            when public.profiles.needs_rename
             and public.isim_kontrol_ayrinti(public.profiles.display_name) is not null then 'Klinisyen'
            else public.profiles.display_name end,
          needs_rename = false
    returning * into v_prof;
  exception when unique_violation then
    perform public._raise('USERNAME_TAKEN', 'Bu kullanıcı adı alınmış.');
  end;
  return to_jsonb(v_prof);
end $$;

-- -----------------------------------------------------------------------------
-- 5. İşaretli kullanıcıyı başkalarından gizle
-- -----------------------------------------------------------------------------
-- 5.1 profiles okuma: kendi satırın her zaman; başkasınınki yalnızca işaretli değilse. (Arkadaş arama,
--     arkadaş/davet/oda sahibi gömmeleri bu kurala tabidir: istemci boş gelen profili atlar.)
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles
  for select to authenticated using (id = (select auth.uid()) or not needs_rename);

-- 5.2 açık oda listesi: sahibi işaretli olan lobi listelenmez (üyeler ve davetliler görmeye devam eder)
drop policy if exists rooms_read on public.rooms;
create policy rooms_read on public.rooms
  for select to authenticated using (
    public.is_room_member(id)
    or (visibility = 'public' and status = 'lobby'
        and exists (select 1 from public.profiles hp where hp.id = rooms.host_id and not hp.needs_rename))
    or public.has_room_invite(id));

-- 5.3 sıralama görünümleri (sütunlar aynı)
create or replace view public.leaderboard with (security_invoker = true) as
  select p.id as user_id, p.username, p.display_name, p.avatar, p.ranked_points,
         p.matches_played, p.matches_won,
         rank() over (order by p.ranked_points desc) as position
    from public.profiles p
   where p.username is not null and not p.needs_rename;

create or replace view public.daily_leaderboard with (security_invoker = true) as
  select d.challenge_date, d.target_type, d.user_id, p.username, p.display_name, p.avatar,
         d.won, d.guess_count, d.points, d.elapsed_sec,
         rank() over (partition by d.challenge_date, d.target_type
                      order by d.won desc,
                               case when d.won then d.guess_count else -d.guess_count end asc,
                               case when d.won then d.elapsed_sec end asc nulls last,
                               d.completed_at asc) as position
    from public.daily_results d
    join public.profiles p on p.id = d.user_id
   where not p.needs_rename;

-- 5.4 günlük sıralama RPC'si (0004 ile aynı; işaretli başkaları satırlarda yok, kendi 'me' satırın kalır)
create or replace function public.get_daily_leaderboard(p_target text, p_day date default null, p_limit integer default 50)
returns jsonb
language plpgsql stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_t public.target_type := public._parse_target(p_target);
  v_day date := coalesce(p_day, public._daily_today());
  v_lim integer := least(200, greatest(1, coalesce(p_limit, 50)));
begin
  return (
    with ranked as (
      select d.user_id,
             jsonb_build_object(
               'rank', row_number() over w,
               'user_id', d.user_id, 'username', p.username, 'display_name', p.display_name,
               'avatar', p.avatar, 'ranked_points', p.ranked_points,
               'won', d.won, 'guesses_used', d.guess_count, 'time_sec', d.elapsed_sec,
               'points', d.points) as row,
             row_number() over w as rnk
        from public.daily_results d
        join public.profiles p on p.id = d.user_id
       where d.challenge_date = v_day and d.target_type = v_t
         and (not p.needs_rename or d.user_id = v_uid)
      -- kazananlar: az tahmin > kısa süre > erken bitiren; kaybedenler: çok tahmin > erken bitiren
      window w as (order by d.won desc,
                            case when d.won then d.guess_count else -d.guess_count end asc,
                            case when d.won then d.elapsed_sec end asc nulls last,
                            d.completed_at asc, d.user_id)
    )
    select jsonb_build_object(
      'server_time', now(),
      'day', v_day,
      'target', v_t,
      'total_players', (select count(*) from ranked),
      'rows', coalesce((select jsonb_agg(r.row order by r.rnk) from ranked r
                         where r.rnk <= v_lim
                           and (r.user_id <> v_uid
                                or not exists (select 1 from public.profiles x where x.id = v_uid and x.needs_rename))),
                       '[]'::jsonb),
      'me', (select r.row from ranked r where r.user_id = v_uid)));
end $$;

-- 5.5 oda anlık görüntüsü (0001 ile aynı; işaretli BAŞKA oyuncuların adı yerine 'Oyuncu')
create or replace function public.get_room_state(p_room_id uuid)
returns jsonb
language plpgsql stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_room public.rooms;
begin
  if not public.is_room_member(p_room_id) then perform public._raise('NOT_MEMBER'); end if;
  select * into v_room from public.rooms where id = p_room_id;
  return jsonb_build_object(
    'server_time', now(),
    'room', to_jsonb(v_room),
    'players', (select coalesce(jsonb_agg(jsonb_build_object(
                   'user_id', p.user_id,
                   'username', case when pr.needs_rename and p.user_id <> v_uid then 'Oyuncu' else pr.username end,
                   'display_name', case when pr.needs_rename and p.user_id <> v_uid then 'Oyuncu' else pr.display_name end,
                   'avatar', pr.avatar, 'ranked_points', pr.ranked_points,
                   'is_host', p.user_id = v_room.host_id, 'is_ready', p.is_ready,
                   'joined_at', p.joined_at, 'left_at', p.left_at, 'played', p.played,
                   'total_score', p.total_score, 'eliminated_round', p.eliminated_round,
                   'hp', p.hp, 'team', p.team) order by p.joined_at), '[]'::jsonb)
                  from public.room_players p join public.profiles pr on pr.id = p.user_id
                 where p.room_id = p_room_id),
    'round', (select to_jsonb(rr) from public.room_rounds rr
               where rr.room_id = p_room_id and rr.round_no = v_room.current_round),
    'round_players', (select coalesce(jsonb_agg(to_jsonb(r) order by r.user_id), '[]'::jsonb)
                        from public.round_players r
                       where r.room_id = p_room_id and r.round_no = v_room.current_round),
    'my_guesses', (select coalesce(jsonb_agg(jsonb_build_object(
                      'stage', g.stage, 'guess_no', g.guess_no, 'item_id', g.item_id,
                      'is_correct', g.is_correct, 'same_group', g.same_group) order by g.id), '[]'::jsonb)
                     from public.round_guesses g
                    where g.room_id = p_room_id and g.round_no = v_room.current_round and g.user_id = v_uid),
    'pairings', (select coalesce(jsonb_agg(to_jsonb(m) order by m.bracket_round, m.slot), '[]'::jsonb)
                   from public.match_pairings m where m.room_id = p_room_id),
    'results', (select coalesce(jsonb_agg(to_jsonb(x) order by x.final_rank), '[]'::jsonb)
                  from public.match_results x where x.room_id = p_room_id));
end $$;

-- 5.6 arkadaşlık isteği: işaretli kullanıcı bulunamaz (0001 ile aynı; yalnızca hedef araması değişti)
create or replace function public.send_friend_request(p_username text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_target uuid;
  v_f public.friendships;
begin
  perform public._require_player(v_uid);
  select id into v_target from public.profiles
   where lower(username) = lower(btrim(coalesce(p_username, ''))) and not needs_rename;
  if v_target is null then perform public._raise('USER_NOT_FOUND', 'Kullanıcı bulunamadı.'); end if;
  if v_target = v_uid then perform public._raise('CANNOT_FRIEND_SELF'); end if;

  insert into public.friendships (requester_id, addressee_id)
  values (v_uid, v_target)
  on conflict do nothing
  returning * into v_f;

  if v_f.id is null then
    select * into v_f from public.friendships
     where least(requester_id, addressee_id) = least(v_uid, v_target)
       and greatest(requester_id, addressee_id) = greatest(v_uid, v_target)
     for update;

    if v_f.status = 'accepted' then
      perform public._raise('ALREADY_FRIENDS');
    elsif v_f.status = 'pending' and v_f.requester_id = v_uid then
      return jsonb_build_object('friendship_id', v_f.id, 'status', v_f.status);  -- zaten gönderilmiş
    elsif v_f.status = 'pending' then
      -- karşı taraf zaten istek göndermiş: karşılıklı -> kabul
      update public.friendships set status = 'accepted', responded_at = now(), updated_at = now()
       where id = v_f.id returning * into v_f;
      return jsonb_build_object('friendship_id', v_f.id, 'status', v_f.status);
    else
      update public.friendships
         set requester_id = v_uid, addressee_id = v_target, status = 'pending',
             created_at = now(), responded_at = null, updated_at = now()
       where id = v_f.id returning * into v_f;
    end if;
  end if;

  if (select count(*) from public.friendships
       where requester_id = v_uid and status = 'pending') > public._cfg('max_pending_friend_requests') then
    perform public._raise('TOO_MANY_REQUESTS', 'Çok fazla bekleyen isteğin var.');
  end if;
  return jsonb_build_object('friendship_id', v_f.id, 'status', v_f.status);
end $$;

-- -----------------------------------------------------------------------------
-- 6. Terim verisi (tools/isim_filtresi/uret.js --sql-veri) ve ilk tarama
-- -----------------------------------------------------------------------------
-- <<isim_filtresi_veri>> (tools/isim_filtresi/uret.js üretti; elle düzenleme)
delete from public.isim_filtresi_terimleri;
delete from public.isim_filtresi_harita;
insert into public.isim_filtresi_terimleri (sira, tur, kip, terim, desen, ek) values
  (1, 'tr', 'alt', 'orospu', 'o+r+o+s+p+u+', ''),
  (2, 'tr', 'alt', 'orspu', 'o+r+s+p+u+', ''),
  (3, 'tr', 'alt', 'oruspu', 'o+r+u+s+p+u+', ''),
  (4, 'tr', 'alt', 'orosbu', 'o+r+o+s+b+u+', ''),
  (5, 'tr', 'alt', 'orsbu', 'o+r+s+b+u+', ''),
  (6, 'tr', 'alt', 'orusbu', 'o+r+u+s+b+u+', ''),
  (7, 'tr', 'alt', 'orozbu', 'o+r+o+z+b+u+', ''),
  (8, 'tr', 'alt', 'siktir', 's+i+k+t+i+r+', ''),
  (9, 'tr', 'alt', 'siktr', 's+i+k+t+r+', ''),
  (10, 'tr', 'alt', 'sktir', 's+k+t+i+r+', ''),
  (11, 'tr', 'alt', 'sktr', 's+k+t+r+', ''),
  (12, 'tr', 'alt', 'siktig', 's+i+k+t+i+g+', ''),
  (13, 'tr', 'alt', 'siktim', 's+i+k+t+i+m+', ''),
  (14, 'tr', 'alt', 'siktin', 's+i+k+t+i+n+', ''),
  (15, 'tr', 'alt', 'sikerim', 's+i+k+e+r+i+m+', ''),
  (16, 'tr', 'alt', 'sikeyim', 's+i+k+e+y+i+m+', ''),
  (17, 'tr', 'alt', 'sikiyim', 's+i+k+i+y+i+m+', ''),
  (18, 'tr', 'alt', 'sikeyin', 's+i+k+e+y+i+n+', ''),
  (19, 'tr', 'alt', 'sikerler', 's+i+k+e+r+l+e+r+', ''),
  (20, 'tr', 'alt', 'sikecem', 's+i+k+e+c+e+m+', ''),
  (21, 'tr', 'alt', 'sikeceg', 's+i+k+e+c+e+g+', ''),
  (22, 'tr', 'alt', 'sikicem', 's+i+k+i+c+e+m+', ''),
  (23, 'tr', 'alt', 'sikis', 's+i+k+i+s+', ''),
  (24, 'tr', 'alt', 'sikik', 's+i+k+i+k+', ''),
  (25, 'tr', 'alt', 'sikim', 's+i+k+i+m+', ''),
  (26, 'tr', 'alt', 'sikini', 's+i+k+i+n+i+', ''),
  (27, 'tr', 'alt', 'sikine', 's+i+k+i+n+e+', ''),
  (28, 'tr', 'alt', 'sikmek', 's+i+k+m+e+k+', ''),
  (29, 'tr', 'alt', 'sikmis', 's+i+k+m+i+s+', ''),
  (30, 'tr', 'alt', 'sikilmis', 's+i+k+i+l+m+i+s+', ''),
  (31, 'tr', 'alt', 'sikko', 's+i+k{2,}o+', ''),
  (32, 'tr', 'kelime', 'sik', 's+i+k+', 'i+m+|i+n+|i+|e+|l+e+r+|i+k+|e+r+|e+r+i+m+|e+y+i+m+|t+i+r+|t+i+m+|t+i+|i+c+i+|i+m+e+|i+m+i+|i+n+i+|i+n+e+|s+i+n+|m+e+k+|e+c+e+m+|i+c+e+m+|i+s+|i+s+i+|i+s+m+e+|l+e+r+i+m+|k+o+|k+a+f+a+'),
  (33, 'tr', 'alt', 'amcik', 'a+m+c+i+k+', ''),
  (34, 'tr', 'alt', 'amcuk', 'a+m+c+u+k+', ''),
  (35, 'tr', 'alt', 'amcig', 'a+m+c+i+g+', ''),
  (36, 'tr', 'alt', 'aminako', 'a+m+i+n+a+k+o+', ''),
  (37, 'tr', 'alt', 'aminiko', 'a+m+i+n+i+k+o+', ''),
  (38, 'tr', 'alt', 'aminagoy', 'a+m+i+n+a+g+o+y+', ''),
  (39, 'tr', 'alt', 'aminakoy', 'a+m+i+n+a+k+o+y+', ''),
  (40, 'tr', 'alt', 'amnako', 'a+m+n+a+k+o+', ''),
  (41, 'tr', 'alt', 'aminisik', 'a+m+i+n+i+s+i+k+', ''),
  (42, 'tr', 'alt', 'aminasik', 'a+m+i+n+a+s+i+k+', ''),
  (43, 'tr', 'alt', 'aminiyala', 'a+m+i+n+i+y+a+l+a+', ''),
  (44, 'tr', 'alt', 'amyala', 'a+m+y+a+l+a+', ''),
  (45, 'tr', 'alt', 'amyalar', 'a+m+y+a+l+a+r+', ''),
  (46, 'tr', 'alt', 'amligot', 'a+m+l+i+g+o+t+', ''),
  (47, 'tr', 'kelime', 'am', 'a+m+', 'c+i+k+|c+u+k+|i+n+a+|i+n+i+|i+n+|i+|l+a+r+|c+i+'),
  (48, 'tr', 'kelime', 'amk', 'a+m+k+', ''),
  (49, 'tr', 'bas', 'amk', 'a+m+k+', ''),
  (50, 'tr', 'son', 'amk', 'a+m+k+', ''),
  (51, 'tr', 'kelime', 'amq', 'a+m+q+', ''),
  (52, 'tr', 'bas', 'amq', 'a+m+q+', ''),
  (53, 'tr', 'son', 'amq', 'a+m+q+', ''),
  (54, 'tr', 'kelime', 'aq', 'a+q+', ''),
  (55, 'tr', 'kelime', 'amg', 'a+m+g+', ''),
  (56, 'tr', 'kelime', 'skm', 's+k+m+', ''),
  (57, 'tr', 'kelime', 'skrm', 's+k+r+m+', ''),
  (58, 'tr', 'alt', 'yarrak', 'y+a+r{2,}a+k+', ''),
  (59, 'tr', 'alt', 'yarrag', 'y+a+r{2,}a+g+', ''),
  (60, 'tr', 'alt', 'yarram', 'y+a+r{2,}a+m+', ''),
  (61, 'tr', 'alt', 'yarran', 'y+a+r{2,}a+n+', ''),
  (62, 'tr', 'alt', 'dalyarak', 'd+a+l+y+a+r+a+k+', ''),
  (63, 'tr', 'bas', 'yarak', 'y+a+r+a+k+', ''),
  (64, 'tr', 'kelime', 'yarak', 'y+a+r+a+k+', 'l+e+r+|l+a+r+|i+|u+|e+|a+|i+n+|u+n+|i+m+|u+m+|d+e+|d+a+|d+e+n+|d+a+n+|c+i+|c+u+|l+i+k+|l+u+k+|l+i+|l+u+|n+e+|n+a+|n+i+|n+u+|n+i+n+|n+u+n+|s+|e+s+|y+|i+e+|z+'),
  (65, 'tr', 'alt', 'tasak', 't+a+s+a+k+', ''),
  (66, 'tr', 'alt', 'tassak', 't+a+s{2,}a+k+', ''),
  (67, 'tr', 'alt', 'tasag', 't+a+s+a+g+', ''),
  (68, 'tr', 'alt', 'daltasak', 'd+a+l+t+a+s+a+k+', ''),
  (69, 'tr', 'alt', 'gotveren', 'g+o+t+v+e+r+e+n+', ''),
  (70, 'tr', 'alt', 'gotlek', 'g+o+t+l+e+k+', ''),
  (71, 'tr', 'alt', 'gotos', 'g+o+t+o+s+', ''),
  (72, 'tr', 'alt', 'gotunu', 'g+o+t+u+n+u+', ''),
  (73, 'tr', 'alt', 'gotune', 'g+o+t+u+n+e+', ''),
  (74, 'tr', 'alt', 'gotunden', 'g+o+t+u+n+d+e+n+', ''),
  (75, 'tr', 'alt', 'gotum', 'g+o+t+u+m+', ''),
  (76, 'tr', 'alt', 'gotverici', 'g+o+t+v+e+r+i+c+i+', ''),
  (77, 'tr', 'kelime', 'gtvrn', 'g+t+v+r+n+', ''),
  (78, 'tr', 'kelime_ek', 'got', 'g+o+t+', 'u+|u+n+|u+n+e+|u+n+u+|u+n+d+e+n+|e+|t+e+|t+e+n+|l+e+r+|l+e+k+|o+s+|v+e+r+e+n+|l+u+|u+n+u+z+|u+m+e+'),
  (79, 'tr', 'kelime', 'pic', 'p+i+c+', 'l+e+r+|l+i+k+|i+|i+n+|e+|k+u+r+u+s+u+|l+a+r+'),
  (80, 'tr', 'alt', 'pickurusu', 'p+i+c+k+u+r+u+s+u+', ''),
  (81, 'tr', 'alt', 'piclik', 'p+i+c+l+i+k+', ''),
  (82, 'tr', 'alt', 'ibne', 'i+b+n+e+', ''),
  (83, 'tr', 'alt', 'ipne', 'i+p+n+e+', ''),
  (84, 'tr', 'alt', 'ibine', 'i+b+i+n+e+', ''),
  (85, 'tr', 'alt', 'pezevenk', 'p+e+z+e+v+e+n+k+', ''),
  (86, 'tr', 'alt', 'pezevek', 'p+e+z+e+v+e+k+', ''),
  (87, 'tr', 'kelime', 'pezo', 'p+e+z+o+', ''),
  (88, 'tr', 'alt', 'gavat', 'g+a+v+a+t+', ''),
  (89, 'tr', 'alt', 'kahpe', 'k+a+h+p+e+', ''),
  (90, 'tr', 'alt', 'kaltak', 'k+a+l+t+a+k+', ''),
  (91, 'tr', 'alt', 'surtuk', 's+u+r+t+u+k+', ''),
  (92, 'tr', 'alt', 'fahise', 'f+a+h+i+s+e+', ''),
  (93, 'tr', 'alt', 'kevase', 'k+e+v+a+s+e+', ''),
  (94, 'tr', 'alt', 'oglanci', 'o+g+l+a+n+c+i+', ''),
  (95, 'tr', 'alt', 'durzu', 'd+u+r+z+u+', ''),
  (96, 'tr', 'alt', 'kerhane', 'k+e+r+h+a+n+e+', ''),
  (97, 'tr', 'alt', 'asifte', 'a+s+i+f+t+e+', ''),
  (98, 'tr', 'alt', 'kancik', 'k+a+n+c+i+k+', ''),
  (99, 'tr', 'alt', 'yavsak', 'y+a+v+s+a+k+', ''),
  (100, 'tr', 'alt', 'yavsag', 'y+a+v+s+a+g+', ''),
  (101, 'tr', 'kelime', 'pust', 'p+u+s+t+', 'l+a+r+|l+u+k+|u+|u+n+|t+'),
  (102, 'tr', 'alt', 'serefsiz', 's+e+r+e+f+s+i+z+', ''),
  (103, 'tr', 'alt', 'serefsz', 's+e+r+e+f+s+z+', ''),
  (104, 'tr', 'alt', 'sakso', 's+a+k+s+o+', ''),
  (105, 'tr', 'alt', 'saksocu', 's+a+k+s+o+c+u+', ''),
  (106, 'tr', 'kelime', 'oc', 'o+c+', ''),
  (107, 'tr', 'alt', 'orospucocugu', 'o+r+o+s+p+u+c+o+c+u+g+u+', ''),
  (108, 'tr', 'alt', 'orospuevladi', 'o+r+o+s+p+u+e+v+l+a+d+i+', ''),
  (109, 'tr', 'alt', 'otuzbirci', 'o+t+u+z+b+i+r+c+i+', ''),
  (110, 'tr', 'alt', 'otuzbirc', 'o+t+u+z+b+i+r+c+', ''),
  (111, 'tr', 'alt', 'sicmak', 's+i+c+m+a+k+', ''),
  (112, 'tr', 'alt', 'sictig', 's+i+c+t+i+g+', ''),
  (113, 'tr', 'alt', 'sicarim', 's+i+c+a+r+i+m+', ''),
  (114, 'tr', 'alt', 'sicayim', 's+i+c+a+y+i+m+', ''),
  (115, 'tr', 'kelime', 'bok', 'b+o+k+', 'u+|u+n+|l+u+|t+a+n+|c+u+|c+a+|k+a+f+a+|y+i+y+e+n+'),
  (116, 'tr', 'alt', 'boktan', 'b+o+k+t+a+n+', ''),
  (117, 'tr', 'alt', 'bokkafa', 'b+o+k{2,}a+f+a+', ''),
  (118, 'tr', 'alt', 'avradini', 'a+v+r+a+d+i+n+i+', ''),
  (119, 'tr', 'alt', 'bacini', 'b+a+c+i+n+i+', ''),
  (120, 'tr', 'kelime', 'gavur', 'g+a+v+u+r+', 'l+e+r+|l+a+r+|i+|u+|e+|a+|i+n+|u+n+|i+m+|u+m+|d+e+|d+a+|d+e+n+|d+a+n+|c+i+|c+u+|l+i+k+|l+u+k+|l+i+|l+u+|n+e+|n+a+|n+i+|n+u+|n+i+n+|n+u+n+|s+|e+s+|y+|i+e+|z+'),
  (121, 'tr', 'kelime', 'pedofil', 'p+e+d+o+f+i+l+', 'l+e+r+|l+a+r+|i+|u+|e+|a+|i+n+|u+n+|i+m+|u+m+|d+e+|d+a+|d+e+n+|d+a+n+|c+i+|c+u+|l+i+k+|l+u+k+|l+i+|l+u+|n+e+|n+a+|n+i+|n+u+|n+i+n+|n+u+n+|s+|e+s+|y+|i+e+|z+'),
  (122, 'tr', 'kelime', 'pedo', 'p+e+d+o+', ''),
  (123, 'kalip', 'alt', 'anasinisik', 'a+n+a+s+i+n+i+s+i+k+', ''),
  (124, 'kalip', 'alt', 'ananisik', 'a+n+a+n+i+s+i+k+', ''),
  (125, 'kalip', 'alt', 'ananiskm', 'a+n+a+n+i+s+k+m+', ''),
  (126, 'kalip', 'alt', 'ananiavrad', 'a+n+a+n+i+a+v+r+a+d+', ''),
  (127, 'kalip', 'alt', 'bacinisik', 'b+a+c+i+n+i+s+i+k+', ''),
  (128, 'kalip', 'alt', 'agzinasic', 'a+g+z+i+n+a+s+i+c+', ''),
  (129, 'kalip', 'alt', 'agzinisik', 'a+g+z+i+n+i+s+i+k+', ''),
  (130, 'kalip', 'alt', 'orospucocu', 'o+r+o+s+p+u+c+o+c+u+', ''),
  (131, 'kalip', 'alt', 'orosbucocu', 'o+r+o+s+b+u+c+o+c+u+', ''),
  (132, 'kalip', 'alt', 'pisarap', 'p+i+s+a+r+a+p+', ''),
  (133, 'kalip', 'alt', 'pisermeni', 'p+i+s+e+r+m+e+n+i+', ''),
  (134, 'kalip', 'alt', 'pisyahudi', 'p+i+s+y+a+h+u+d+i+', ''),
  (135, 'kalip', 'alt', 'piskurt', 'p+i+s+k+u+r+t+', ''),
  (136, 'kalip', 'alt', 'piszenci', 'p+i+s+z+e+n+c+i+', ''),
  (137, 'kalip', 'alt', 'ermenidolu', 'e+r+m+e+n+i+d+o+l+u+', ''),
  (138, 'kalip', 'alt', 'yahudidolu', 'y+a+h+u+d+i+d+o+l+u+', ''),
  (139, 'kalip', 'alt', 'kurtdolu', 'k+u+r+t+d+o+l+u+', ''),
  (140, 'kalip', 'alt', 'aminakoyim', 'a+m+i+n+a+k+o+y+i+m+', ''),
  (141, 'kalip', 'alt', 'aminakodum', 'a+m+i+n+a+k+o+d+u+m+', ''),
  (142, 'kalip', 'alt', 'aminakoydug', 'a+m+i+n+a+k+o+y+d+u+g+', ''),
  (143, 'kalip', 'alt', 'suckmydick', 's+u+c+k+m+y+d+i+c+k+', ''),
  (144, 'kalip', 'alt', 'suckmycock', 's+u+c+k+m+y+c+o+c+k+', ''),
  (145, 'kalip', 'alt', 'eatmyass', 'e+a+t+m+y+a+s{2,}', ''),
  (146, 'kalip', 'alt', 'killallj', 'k+i+l{2,}a+l{2,}j+', ''),
  (147, 'kalip', 'alt', 'gasthej', 'g+a+s+t+h+e+j+', ''),
  (148, 'en', 'alt', 'fuck', 'f+u+c+k+', ''),
  (149, 'en', 'kelime', 'fuk', 'f+u+k+', 's+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+'),
  (150, 'en', 'kelime', 'fck', 'f+c+k+', 's+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+'),
  (151, 'en', 'alt', 'fcuk', 'f+c+u+k+', ''),
  (152, 'en', 'alt', 'phuck', 'p+h+u+c+k+', ''),
  (153, 'en', 'kelime', 'phuk', 'p+h+u+k+', ''),
  (154, 'en', 'alt', 'fukk', 'f+u+k{2,}', ''),
  (155, 'en', 'alt', 'shit', 's+h+i+t+', ''),
  (156, 'en', 'alt', 'cunt', 'c+u+n+t+', ''),
  (157, 'en', 'alt', 'bitch', 'b+i+t+c+h+', ''),
  (158, 'en', 'alt', 'biatch', 'b+i+a+t+c+h+', ''),
  (159, 'en', 'alt', 'whore', 'w+h+o+r+e+', ''),
  (160, 'en', 'alt', 'slut', 's+l+u+t+', ''),
  (161, 'en', 'alt', 'asshole', 'a+s{2,}h+o+l+e+', ''),
  (162, 'en', 'alt', 'arsehole', 'a+r+s+e+h+o+l+e+', ''),
  (163, 'en', 'alt', 'dumbass', 'd+u+m+b+a+s{2,}', ''),
  (164, 'en', 'alt', 'fatass', 'f+a+t+a+s{2,}', ''),
  (165, 'en', 'alt', 'jackass', 'j+a+c+k+a+s{2,}', ''),
  (166, 'en', 'kelime', 'ass', 'a+s{2,}', 's+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+'),
  (167, 'en', 'kelime', 'arse', 'a+r+s+e+', ''),
  (168, 'en', 'alt', 'dickhead', 'd+i+c+k+h+e+a+d+', ''),
  (169, 'en', 'kelime', 'dick', 'd+i+c+k+', 's+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+'),
  (170, 'en', 'alt', 'cocksucker', 'c+o+c+k+s+u+c+k+e+r+', ''),
  (171, 'en', 'kelime', 'cock', 'c+o+c+k+', 's+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+'),
  (172, 'en', 'alt', 'bastard', 'b+a+s+t+a+r+d+', ''),
  (173, 'en', 'alt', 'bollocks', 'b+o+l{2,}o+c+k+s+', ''),
  (174, 'en', 'alt', 'wanker', 'w+a+n+k+e+r+', ''),
  (175, 'en', 'alt', 'wank', 'w+a+n+k+', ''),
  (176, 'en', 'alt', 'twat', 't+w+a+t+', ''),
  (177, 'en', 'kelime', 'prick', 'p+r+i+c+k+', 's+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+'),
  (178, 'en', 'alt', 'pussy', 'p+u+s{2,}y+', ''),
  (179, 'en', 'alt', 'dildo', 'd+i+l+d+o+', ''),
  (180, 'en', 'alt', 'blowjob', 'b+l+o+w+j+o+b+', ''),
  (181, 'en', 'alt', 'handjob', 'h+a+n+d+j+o+b+', ''),
  (182, 'en', 'alt', 'rimjob', 'r+i+m+j+o+b+', ''),
  (183, 'en', 'alt', 'footjob', 'f+o{2,}t+j+o+b+', ''),
  (184, 'en', 'alt', 'jizz', 'j+i+z{2,}', ''),
  (185, 'en', 'alt', 'cumshot', 'c+u+m+s+h+o+t+', ''),
  (186, 'en', 'kelime', 'cum', 'c+u+m+', 's+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+'),
  (187, 'en', 'alt', 'creampie', 'c+r+e+a+m+p+i+e+', ''),
  (188, 'en', 'alt', 'gangbang', 'g+a+n+g+b+a+n+g+', ''),
  (189, 'en', 'alt', 'bukkake', 'b+u+k{2,}a+k+e+', ''),
  (190, 'en', 'alt', 'porn', 'p+o+r+n+', ''),
  (191, 'en', 'alt', 'hentai', 'h+e+n+t+a+i+', ''),
  (192, 'en', 'alt', 'milf', 'm+i+l+f+', ''),
  (193, 'en', 'alt', 'titties', 't+i+t{2,}i+e+s+', ''),
  (194, 'en', 'kelime', 'tits', 't+i+t+s+', ''),
  (195, 'en', 'kelime', 'titty', 't+i+t{2,}y+', ''),
  (196, 'en', 'kelime', 'boobs', 'b+o{2,}b+s+', ''),
  (197, 'en', 'kelime', 'boob', 'b+o{2,}b+', ''),
  (198, 'en', 'kelime', 'horny', 'h+o+r+n+y+', ''),
  (199, 'en', 'kelime', 'rape', 'r+a+p+e+', 's+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+'),
  (200, 'en', 'kelime', 'rapist', 'r+a+p+i+s+t+', 's+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+'),
  (201, 'en', 'kelime', 'raping', 'r+a+p+i+n+g+', ''),
  (202, 'en', 'alt', 'motherfuck', 'm+o+t+h+e+r+f+u+c+k+', ''),
  (203, 'en', 'kelime', 'mofo', 'm+o+f+o+', ''),
  (204, 'en', 'kelime', 'stfu', 's+t+f+u+', ''),
  (205, 'en', 'kelime', 'gtfo', 'g+t+f+o+', ''),
  (206, 'en', 'alt', 'nigger', 'n+i+g{2,}e+r+', ''),
  (207, 'en', 'alt', 'nigga', 'n+i+g{2,}a+', ''),
  (208, 'en', 'alt', 'niggah', 'n+i+g{2,}a+h+', ''),
  (209, 'en', 'kelime', 'negro', 'n+e+g+r+o+', 's+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+'),
  (210, 'en', 'alt', 'faggot', 'f+a+g{2,}o+t+', ''),
  (211, 'en', 'kelime', 'fag', 'f+a+g+', 's+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+'),
  (212, 'en', 'alt', 'retard', 'r+e+t+a+r+d+', ''),
  (213, 'en', 'alt', 'tranny', 't+r+a+n{2,}y+', ''),
  (214, 'en', 'alt', 'shemale', 's+h+e+m+a+l+e+', ''),
  (215, 'en', 'kelime', 'kike', 'k+i+k+e+', 's+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+'),
  (216, 'en', 'kelime', 'spic', 's+p+i+c+', 's+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+'),
  (217, 'en', 'kelime', 'chink', 'c+h+i+n+k+', 's+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+'),
  (218, 'en', 'kelime', 'gook', 'g+o{2,}k+', 's+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+'),
  (219, 'en', 'kelime', 'coon', 'c+o{2,}n+', 's+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+'),
  (220, 'en', 'alt', 'wetback', 'w+e+t+b+a+c+k+', ''),
  (221, 'en', 'alt', 'beaner', 'b+e+a+n+e+r+', ''),
  (222, 'en', 'alt', 'raghead', 'r+a+g+h+e+a+d+', ''),
  (223, 'en', 'alt', 'towelhead', 't+o+w+e+l+h+e+a+d+', ''),
  (224, 'en', 'alt', 'jigaboo', 'j+i+g+a+b+o{2,}', ''),
  (225, 'en', 'alt', 'jiggaboo', 'j+i+g{2,}a+b+o{2,}', ''),
  (226, 'en', 'kelime', 'darkie', 'd+a+r+k+i+e+', ''),
  (227, 'en', 'kelime', 'dyke', 'd+y+k+e+', 's+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+'),
  (228, 'en', 'kelime', 'paki', 'p+a+k+i+', 's+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+'),
  (229, 'en', 'alt', 'slanteye', 's+l+a+n+t+e+y+e+', ''),
  (230, 'en', 'alt', 'hitler', 'h+i+t+l+e+r+', ''),
  (231, 'en', 'alt', 'neonazi', 'n+e+o+n+a+z+i+', ''),
  (232, 'en', 'kelime', 'nazi', 'n+a+z+i+', 's+|e+s+|z+|h+e+a+d+|i+n+g+|e+d+|h+o+l+e+|f+a+c+e+|b+o+y+|g+i+r+l+'),
  (233, 'en', 'alt', 'siegheil', 's+i+e+g+h+e+i+l+', ''),
  (234, 'en', 'alt', 'heilhitler', 'h+e+i+l+h+i+t+l+e+r+', ''),
  (235, 'en', 'alt', 'whitepower', 'w+h+i+t+e+p+o+w+e+r+', ''),
  (236, 'en', 'alt', 'swastika', 's+w+a+s+t+i+k+a+', ''),
  (237, 'en', 'kelime', 'kkk', 'k{2,}', ''),
  (238, 'en', 'alt', 'pedophile', 'p+e+d+o+p+h+i+l+e+', ''),
  (239, 'en', 'alt', 'paedophile', 'p+a+e+d+o+p+h+i+l+e+', ''),
  (240, 'ayrilmis', 'alt', 'admin', 'a+d+m+i+n+', ''),
  (241, 'ayrilmis', 'alt', 'administrator', 'a+d+m+i+n+i+s+t+r+a+t+o+r+', ''),
  (242, 'ayrilmis', 'alt', 'moderator', 'm+o+d+e+r+a+t+o+r+', ''),
  (243, 'ayrilmis', 'alt', 'yonetici', 'y+o+n+e+t+i+c+i+', ''),
  (244, 'ayrilmis', 'tam', 'yonetim', 'y+o+n+e+t+i+m+', ''),
  (245, 'ayrilmis', 'alt', 'yetkili', 'y+e+t+k+i+l+i+', ''),
  (246, 'ayrilmis', 'alt', 'psikovaka', 'p+s+i+k+o+v+a+k+a+', ''),
  (247, 'ayrilmis', 'alt', 'anthropic', 'a+n+t+h+r+o+p+i+c+', ''),
  (248, 'ayrilmis', 'alt', 'supabase', 's+u+p+a+b+a+s+e+', ''),
  (249, 'ayrilmis', 'tam', 'mod', 'm+o+d+', ''),
  (250, 'ayrilmis', 'tam', 'mods', 'm+o+d+s+', ''),
  (251, 'ayrilmis', 'tam', 'destek', 'd+e+s+t+e+k+', ''),
  (252, 'ayrilmis', 'alt', 'destekekibi', 'd+e+s+t+e+k+e+k+i+b+i+', ''),
  (253, 'ayrilmis', 'tam', 'support', 's+u+p{2,}o+r+t+', ''),
  (254, 'ayrilmis', 'tam', 'sistem', 's+i+s+t+e+m+', ''),
  (255, 'ayrilmis', 'tam', 'system', 's+y+s+t+e+m+', ''),
  (256, 'ayrilmis', 'tam', 'root', 'r+o{2,}t+', ''),
  (257, 'ayrilmis', 'tam', 'staff', 's+t+a+f{2,}', ''),
  (258, 'ayrilmis', 'tam', 'claude', 'c+l+a+u+d+e+', ''),
  (259, 'ayrilmis', 'tam', 'official', 'o+f{2,}i+c+i+a+l+', ''),
  (260, 'ayrilmis', 'tam', 'resmi', 'r+e+s+m+i+', ''),
  (261, 'ayrilmis', 'tam', 'yardim', 'y+a+r+d+i+m+', ''),
  (262, 'ayrilmis', 'tam', 'help', 'h+e+l+p+', ''),
  (263, 'ayrilmis', 'tam', 'sysop', 's+y+s+o+p+', ''),
  (264, 'ayrilmis', 'tam', 'superuser', 's+u+p+e+r+u+s+e+r+', ''),
  (265, 'ayrilmis', 'tam', 'owner', 'o+w+n+e+r+', ''),
  (266, 'ayrilmis', 'tam', 'kurucu', 'k+u+r+u+c+u+', ''),
  (267, 'ayrilmis', 'tam', 'gemini', 'g+e+m+i+n+i+', ''),
  (268, 'ayrilmis', 'tam', 'chatgpt', 'c+h+a+t+g+p+t+', ''),
  (269, 'ayrilmis', 'tam', 'openai', 'o+p+e+n+a+i+', ''),
  (270, 'ayrilmis', 'tam', 'anonymous', 'a+n+o+n+y+m+o+u+s+', ''),
  (271, 'ayrilmis', 'tam', 'null', 'n+u+l{2,}', ''),
  (272, 'ayrilmis', 'tam', 'undefined', 'u+n+d+e+f+i+n+e+d+', ''),
  (273, 'beyaz', 'alt', 'ama', 'a+m+a+', ''),
  (274, 'beyaz', 'alt', 'amac', 'a+m+a+c+', ''),
  (275, 'beyaz', 'alt', 'amaci', 'a+m+a+c+i+', ''),
  (276, 'beyaz', 'alt', 'amateur', 'a+m+a+t+e+u+r+', ''),
  (277, 'beyaz', 'alt', 'amator', 'a+m+a+t+o+r+', ''),
  (278, 'beyaz', 'alt', 'amaze', 'a+m+a+z+e+', ''),
  (279, 'beyaz', 'alt', 'amazing', 'a+m+a+z+i+n+g+', ''),
  (280, 'beyaz', 'alt', 'amazon', 'a+m+a+z+o+n+', ''),
  (281, 'beyaz', 'alt', 'ambalaj', 'a+m+b+a+l+a+j+', ''),
  (282, 'beyaz', 'alt', 'ambar', 'a+m+b+a+r+', ''),
  (283, 'beyaz', 'alt', 'ambassador', 'a+m+b+a+s{2,}a+d+o+r+', ''),
  (284, 'beyaz', 'alt', 'amblem', 'a+m+b+l+e+m+', ''),
  (285, 'beyaz', 'alt', 'ambulans', 'a+m+b+u+l+a+n+s+', ''),
  (286, 'beyaz', 'alt', 'amca', 'a+m+c+a+', ''),
  (287, 'beyaz', 'alt', 'amcalar', 'a+m+c+a+l+a+r+', ''),
  (288, 'beyaz', 'alt', 'amcam', 'a+m+c+a+m+', ''),
  (289, 'beyaz', 'alt', 'amcan', 'a+m+c+a+n+', ''),
  (290, 'beyaz', 'alt', 'amcasi', 'a+m+c+a+s+i+', ''),
  (291, 'beyaz', 'alt', 'amcazade', 'a+m+c+a+z+a+d+e+', ''),
  (292, 'beyaz', 'alt', 'amel', 'a+m+e+l+', ''),
  (293, 'beyaz', 'alt', 'amele', 'a+m+e+l+e+', ''),
  (294, 'beyaz', 'alt', 'ameliyat', 'a+m+e+l+i+y+a+t+', ''),
  (295, 'beyaz', 'alt', 'american', 'a+m+e+r+i+c+a+n+', ''),
  (296, 'beyaz', 'alt', 'amerika', 'a+m+e+r+i+k+a+', ''),
  (297, 'beyaz', 'alt', 'amfi', 'a+m+f+i+', ''),
  (298, 'beyaz', 'alt', 'amfibi', 'a+m+f+i+b+i+', ''),
  (299, 'beyaz', 'alt', 'amigo', 'a+m+i+g+o+', ''),
  (300, 'beyaz', 'alt', 'amil', 'a+m+i+l+', ''),
  (301, 'beyaz', 'alt', 'amin', 'a+m+i+n+', ''),
  (302, 'beyaz', 'alt', 'amine', 'a+m+i+n+e+', ''),
  (303, 'beyaz', 'alt', 'amino', 'a+m+i+n+o+', ''),
  (304, 'beyaz', 'alt', 'aminoasit', 'a+m+i+n+o+a+s+i+t+', ''),
  (305, 'beyaz', 'alt', 'amir', 'a+m+i+r+', ''),
  (306, 'beyaz', 'alt', 'amiral', 'a+m+i+r+a+l+', ''),
  (307, 'beyaz', 'alt', 'amla', 'a+m+l+a+', ''),
  (308, 'beyaz', 'alt', 'amonyak', 'a+m+o+n+y+a+k+', ''),
  (309, 'beyaz', 'alt', 'amper', 'a+m+p+e+r+', ''),
  (310, 'beyaz', 'alt', 'ampul', 'a+m+p+u+l+', ''),
  (311, 'beyaz', 'alt', 'amsterdam', 'a+m+s+t+e+r+d+a+m+', ''),
  (312, 'beyaz', 'alt', 'assam', 'a+s{2,}a+m+', ''),
  (313, 'beyaz', 'alt', 'assassin', 'a+s{2,}a+s{2,}i+n+', ''),
  (314, 'beyaz', 'alt', 'assault', 'a+s{2,}a+u+l+t+', ''),
  (315, 'beyaz', 'alt', 'assess', 'a+s{2,}e+s{2,}', ''),
  (316, 'beyaz', 'alt', 'asset', 'a+s{2,}e+t+', ''),
  (317, 'beyaz', 'alt', 'assist', 'a+s{2,}i+s+t+', ''),
  (318, 'beyaz', 'alt', 'assistant', 'a+s{2,}i+s+t+a+n+t+', ''),
  (319, 'beyaz', 'alt', 'bass', 'b+a+s{2,}', ''),
  (320, 'beyaz', 'alt', 'boks', 'b+o+k+s+', ''),
  (321, 'beyaz', 'alt', 'bokser', 'b+o+k+s+e+r+', ''),
  (322, 'beyaz', 'alt', 'boksor', 'b+o+k+s+o+r+', ''),
  (323, 'beyaz', 'alt', 'boobook', 'b+o{2,}b+o{2,}k+', ''),
  (324, 'beyaz', 'alt', 'boxer', 'b+o+x+e+r+', ''),
  (325, 'beyaz', 'alt', 'cassandra', 'c+a+s{2,}a+n+d+r+a+', ''),
  (326, 'beyaz', 'alt', 'class', 'c+l+a+s{2,}', ''),
  (327, 'beyaz', 'alt', 'classic', 'c+l+a+s{2,}i+c+', ''),
  (328, 'beyaz', 'alt', 'cockatoo', 'c+o+c+k+a+t+o{2,}', ''),
  (329, 'beyaz', 'alt', 'cockpit', 'c+o+c+k+p+i+t+', ''),
  (330, 'beyaz', 'alt', 'cockroach', 'c+o+c+k+r+o+a+c+h+', ''),
  (331, 'beyaz', 'alt', 'cocktail', 'c+o+c+k+t+a+i+l+', ''),
  (332, 'beyaz', 'alt', 'compass', 'c+o+m+p+a+s{2,}', ''),
  (333, 'beyaz', 'alt', 'cucumber', 'c+u+c+u+m+b+e+r+', ''),
  (334, 'beyaz', 'alt', 'cuma', 'c+u+m+a+', ''),
  (335, 'beyaz', 'alt', 'cumartesi', 'c+u+m+a+r+t+e+s+i+', ''),
  (336, 'beyaz', 'alt', 'cumhur', 'c+u+m+h+u+r+', ''),
  (337, 'beyaz', 'alt', 'cumhuriyet', 'c+u+m+h+u+r+i+y+e+t+', ''),
  (338, 'beyaz', 'alt', 'cumulus', 'c+u+m+u+l+u+s+', ''),
  (339, 'beyaz', 'alt', 'dickens', 'd+i+c+k+e+n+s+', ''),
  (340, 'beyaz', 'alt', 'dickinson', 'd+i+c+k+i+n+s+o+n+', ''),
  (341, 'beyaz', 'alt', 'dickson', 'd+i+c+k+s+o+n+', ''),
  (342, 'beyaz', 'alt', 'document', 'd+o+c+u+m+e+n+t+', ''),
  (343, 'beyaz', 'alt', 'drape', 'd+r+a+p+e+', ''),
  (344, 'beyaz', 'alt', 'embassy', 'e+m+b+a+s{2,}y+', ''),
  (345, 'beyaz', 'alt', 'glass', 'g+l+a+s{2,}', ''),
  (346, 'beyaz', 'alt', 'gotan', 'g+o+t+a+n+', ''),
  (347, 'beyaz', 'alt', 'gotham', 'g+o+t+h+a+m+', ''),
  (348, 'beyaz', 'alt', 'gotik', 'g+o+t+i+k+', ''),
  (349, 'beyaz', 'alt', 'gotland', 'g+o+t+l+a+n+d+', ''),
  (350, 'beyaz', 'alt', 'gotur', 'g+o+t+u+r+', ''),
  (351, 'beyaz', 'alt', 'goturmek', 'g+o+t+u+r+m+e+k+', ''),
  (352, 'beyaz', 'alt', 'goturu', 'g+o+t+u+r+u+', ''),
  (353, 'beyaz', 'alt', 'grape', 'g+r+a+p+e+', ''),
  (354, 'beyaz', 'alt', 'grass', 'g+r+a+s{2,}', ''),
  (355, 'beyaz', 'alt', 'hancock', 'h+a+n+c+o+c+k+', ''),
  (356, 'beyaz', 'alt', 'harass', 'h+a+r+a+s{2,}', ''),
  (357, 'beyaz', 'alt', 'ibnesina', 'i+b+n+e+s+i+n+a+', ''),
  (358, 'beyaz', 'alt', 'ibnhaldun', 'i+b+n+h+a+l+d+u+n+', ''),
  (359, 'beyaz', 'alt', 'ibnihaldun', 'i+b+n+i+h+a+l+d+u+n+', ''),
  (360, 'beyaz', 'alt', 'ibnisina', 'i+b+n+i+s+i+n+a+', ''),
  (361, 'beyaz', 'alt', 'isik', 'i+s+i+k+', ''),
  (362, 'beyaz', 'alt', 'kancikkopek', 'k+a+n+c+i+k{2,}o+p+e+k+', ''),
  (363, 'beyaz', 'alt', 'kasim', 'k+a+s+i+m+', ''),
  (364, 'beyaz', 'alt', 'kasimpasa', 'k+a+s+i+m+p+a+s+a+', ''),
  (365, 'beyaz', 'alt', 'kiskirt', 'k+i+s+k+i+r+t+', ''),
  (366, 'beyaz', 'alt', 'lasso', 'l+a+s{2,}o+', ''),
  (367, 'beyaz', 'alt', 'masikler', 'm+a+s+i+k+l+e+r+', ''),
  (368, 'beyaz', 'alt', 'mass', 'm+a+s{2,}', ''),
  (369, 'beyaz', 'alt', 'matsushita', 'm+a+t+s+u+s+h+i+t+a+', ''),
  (370, 'beyaz', 'alt', 'nazife', 'n+a+z+i+f+e+', ''),
  (371, 'beyaz', 'alt', 'nazik', 'n+a+z+i+k+', ''),
  (372, 'beyaz', 'alt', 'nazilli', 'n+a+z+i+l{2,}i+', ''),
  (373, 'beyaz', 'alt', 'parapet', 'p+a+r+a+p+e+t+', ''),
  (374, 'beyaz', 'alt', 'pass', 'p+a+s{2,}', ''),
  (375, 'beyaz', 'alt', 'passion', 'p+a+s{2,}i+o+n+', ''),
  (376, 'beyaz', 'alt', 'peacock', 'p+e+a+c+o+c+k+', ''),
  (377, 'beyaz', 'alt', 'pikachu', 'p+i+k+a+c+h+u+', ''),
  (378, 'beyaz', 'alt', 'piknik', 'p+i+k+n+i+k+', ''),
  (379, 'beyaz', 'alt', 'pussycat', 'p+u+s{2,}y+c+a+t+', ''),
  (380, 'beyaz', 'alt', 'rapeseed', 'r+a+p+e+s+e{2,}d+', ''),
  (381, 'beyaz', 'alt', 'retardant', 'r+e+t+a+r+d+a+n+t+', ''),
  (382, 'beyaz', 'alt', 'saksofon', 's+a+k+s+o+f+o+n+', ''),
  (383, 'beyaz', 'alt', 'sassy', 's+a+s{2,}y+', ''),
  (384, 'beyaz', 'alt', 'saxophone', 's+a+x+o+p+h+o+n+e+', ''),
  (385, 'beyaz', 'alt', 'scrape', 's+c+r+a+p+e+', ''),
  (386, 'beyaz', 'alt', 'scum', 's+c+u+m+', ''),
  (387, 'beyaz', 'alt', 'scunthorpe', 's+c+u+n+t+h+o+r+p+e+', ''),
  (388, 'beyaz', 'alt', 'shiitake', 's+h+i{2,}t+a+k+e+', ''),
  (389, 'beyaz', 'alt', 'shitake', 's+h+i+t+a+k+e+', ''),
  (390, 'beyaz', 'alt', 'sikca', 's+i+k+c+a+', ''),
  (391, 'beyaz', 'alt', 'siki', 's+i+k+i+', ''),
  (392, 'beyaz', 'alt', 'sikici', 's+i+k+i+c+i+', ''),
  (393, 'beyaz', 'alt', 'sikilasma', 's+i+k+i+l+a+s+m+a+', ''),
  (394, 'beyaz', 'alt', 'sikildim', 's+i+k+i+l+d+i+m+', ''),
  (395, 'beyaz', 'alt', 'sikilma', 's+i+k+i+l+m+a+', ''),
  (396, 'beyaz', 'alt', 'sikilmak', 's+i+k+i+l+m+a+k+', ''),
  (397, 'beyaz', 'alt', 'sikinti', 's+i+k+i+n+t+i+', ''),
  (398, 'beyaz', 'alt', 'sikintili', 's+i+k+i+n+t+i+l+i+', ''),
  (399, 'beyaz', 'alt', 'sikisik', 's+i+k+i+s+i+k+', ''),
  (400, 'beyaz', 'alt', 'sikisma', 's+i+k+i+s+m+a+', ''),
  (401, 'beyaz', 'alt', 'sikismak', 's+i+k+i+s+m+a+k+', ''),
  (402, 'beyaz', 'alt', 'sikistir', 's+i+k+i+s+t+i+r+', ''),
  (403, 'beyaz', 'alt', 'sikiyonetim', 's+i+k+i+y+o+n+e+t+i+m+', ''),
  (404, 'beyaz', 'alt', 'sikke', 's+i+k{2,}e+', ''),
  (405, 'beyaz', 'alt', 'sikkeler', 's+i+k{2,}e+l+e+r+', ''),
  (406, 'beyaz', 'alt', 'siklet', 's+i+k+l+e+t+', ''),
  (407, 'beyaz', 'alt', 'sikma', 's+i+k+m+a+', ''),
  (408, 'beyaz', 'alt', 'sikmak', 's+i+k+m+a+k+', ''),
  (409, 'beyaz', 'alt', 'snigger', 's+n+i+g{2,}e+r+', ''),
  (410, 'beyaz', 'alt', 'sniggering', 's+n+i+g{2,}e+r+i+n+g+', ''),
  (411, 'beyaz', 'alt', 'spice', 's+p+i+c+e+', ''),
  (412, 'beyaz', 'alt', 'spicy', 's+p+i+c+y+', ''),
  (413, 'beyaz', 'alt', 'swank', 's+w+a+n+k+', ''),
  (414, 'beyaz', 'alt', 'terapist', 't+e+r+a+p+i+s+t+', ''),
  (415, 'beyaz', 'alt', 'therapeutic', 't+h+e+r+a+p+e+u+t+i+c+', ''),
  (416, 'beyaz', 'alt', 'therapist', 't+h+e+r+a+p+i+s+t+', ''),
  (417, 'beyaz', 'alt', 'titan', 't+i+t+a+n+', ''),
  (418, 'beyaz', 'alt', 'titanic', 't+i+t+a+n+i+c+', ''),
  (419, 'beyaz', 'alt', 'yarasa', 'y+a+r+a+s+a+', '');
insert into public.isim_filtresi_harita (tur, kaynak, hedef) values
  ('gorunmez', chr(173), ''),
  ('gorunmez', chr(847), ''),
  ('gorunmez', chr(6158), ''),
  ('gorunmez', chr(8203), ''),
  ('gorunmez', chr(8204), ''),
  ('gorunmez', chr(8205), ''),
  ('gorunmez', chr(8206), ''),
  ('gorunmez', chr(8207), ''),
  ('gorunmez', chr(8288), ''),
  ('gorunmez', chr(8289), ''),
  ('gorunmez', chr(8290), ''),
  ('gorunmez', chr(8291), ''),
  ('gorunmez', chr(8292), ''),
  ('gorunmez', chr(65279), ''),
  ('benzer', chr(305), 'i'),
  ('benzer', chr(223), 'ss'),
  ('benzer', chr(230), 'ae'),
  ('benzer', chr(198), 'AE'),
  ('benzer', chr(339), 'oe'),
  ('benzer', chr(338), 'OE'),
  ('benzer', chr(248), 'o'),
  ('benzer', chr(216), 'O'),
  ('benzer', chr(273), 'd'),
  ('benzer', chr(272), 'D'),
  ('benzer', chr(322), 'l'),
  ('benzer', chr(321), 'L'),
  ('benzer', chr(295), 'h'),
  ('benzer', chr(1072), 'a'),
  ('benzer', chr(1040), 'A'),
  ('benzer', chr(1074), 'b'),
  ('benzer', chr(1042), 'B'),
  ('benzer', chr(1089), 'c'),
  ('benzer', chr(1057), 'C'),
  ('benzer', chr(1077), 'e'),
  ('benzer', chr(1045), 'E'),
  ('benzer', chr(1105), 'e'),
  ('benzer', chr(1025), 'E'),
  ('benzer', chr(1085), 'h'),
  ('benzer', chr(1053), 'H'),
  ('benzer', chr(1110), 'i'),
  ('benzer', chr(1030), 'I'),
  ('benzer', chr(1112), 'j'),
  ('benzer', chr(1032), 'J'),
  ('benzer', chr(1082), 'k'),
  ('benzer', chr(1050), 'K'),
  ('benzer', chr(1084), 'm'),
  ('benzer', chr(1052), 'M'),
  ('benzer', chr(1086), 'o'),
  ('benzer', chr(1054), 'O'),
  ('benzer', chr(1088), 'p'),
  ('benzer', chr(1056), 'P'),
  ('benzer', chr(1109), 's'),
  ('benzer', chr(1029), 'S'),
  ('benzer', chr(1090), 't'),
  ('benzer', chr(1058), 'T'),
  ('benzer', chr(1091), 'y'),
  ('benzer', chr(1059), 'Y'),
  ('benzer', chr(1093), 'x'),
  ('benzer', chr(1061), 'X'),
  ('benzer', chr(945), 'a'),
  ('benzer', chr(913), 'A'),
  ('benzer', chr(946), 'b'),
  ('benzer', chr(914), 'B'),
  ('benzer', chr(949), 'e'),
  ('benzer', chr(917), 'E'),
  ('benzer', chr(953), 'i'),
  ('benzer', chr(921), 'I'),
  ('benzer', chr(954), 'k'),
  ('benzer', chr(922), 'K'),
  ('benzer', chr(959), 'o'),
  ('benzer', chr(927), 'O'),
  ('benzer', chr(961), 'p'),
  ('benzer', chr(929), 'P'),
  ('benzer', chr(964), 't'),
  ('benzer', chr(932), 'T'),
  ('benzer', chr(965), 'u'),
  ('benzer', chr(933), 'Y'),
  ('benzer', chr(967), 'x'),
  ('benzer', chr(935), 'X'),
  ('benzer', chr(957), 'v'),
  ('benzer', chr(925), 'N'),
  ('benzer', chr(956), 'm'),
  ('benzer', chr(924), 'M'),
  ('leet', chr(48), 'o'),
  ('leet', chr(49), 'i'),
  ('leet', chr(51), 'e'),
  ('leet', chr(52), 'a'),
  ('leet', chr(53), 's'),
  ('leet', chr(55), 't'),
  ('leet', chr(56), 'b'),
  ('leet', chr(57), 'g'),
  ('leet', chr(64), 'a'),
  ('leet', chr(36), 's'),
  ('leet', chr(33), 'i'),
  ('leet', chr(124), 'i'),
  ('leet', chr(8364), 'e');
update public.isim_filtresi_surum set surum = 1, guncellendi = now() where id = 1;
-- <</isim_filtresi_veri>>
do $$ begin perform public._isim_filtresi_derle(); end $$;
-- Mevcut profiller: uygunsuz kullanıcı adı / görünen ad -> needs_rename = true (sayı Actions günlüğünde NOTICE)
do $$
declare n integer;
begin
  n := public._isim_filtresi_tara();
  raise notice 'isim filtresi: % profil yeniden ad seçmeye işaretlendi', n;
end $$;

-- -----------------------------------------------------------------------------
-- 7. Yetkiler (yalnızca bu migration'ın nesneleri)
-- -----------------------------------------------------------------------------
revoke all on public.isim_filtresi_terimleri, public.isim_filtresi_harita,
              public.isim_filtresi_desenler, public.isim_filtresi_surum from anon, authenticated;
revoke all on public.leaderboard, public.daily_leaderboard from anon;
grant select on public.leaderboard, public.daily_leaderboard to authenticated;

revoke all on function public._isim_on_isle(text)                         from public, anon, authenticated;
revoke all on function public._isim_kapsanmis(text, integer, integer)     from public, anon, authenticated;
revoke all on function public.isim_kontrol_ayrinti(text)                  from public, anon, authenticated;
revoke all on function public.isim_uygun_mu(text)                         from public, anon, authenticated;
revoke all on function public._isim_filtresi_derle()                      from public, anon, authenticated;
revoke all on function public._isim_filtresi_tara()                       from public, anon, authenticated;
revoke all on function public._profiles_isim_denetle()                    from public, anon, authenticated;
revoke all on function public.set_username(text)                          from public, anon, authenticated;
revoke all on function public.send_friend_request(text)                   from public, anon, authenticated;
revoke all on function public.get_room_state(uuid)                        from public, anon, authenticated;
revoke all on function public.get_daily_leaderboard(text, date, integer)  from public, anon, authenticated;

grant execute on function public.isim_uygun_mu(text)                        to authenticated;
grant execute on function public.set_username(text)                         to authenticated;
grant execute on function public.send_friend_request(text)                  to authenticated;
grant execute on function public.get_room_state(uuid)                       to authenticated;
grant execute on function public.get_daily_leaderboard(text, date, integer) to authenticated;

commit;
