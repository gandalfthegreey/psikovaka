-- =============================================================================
-- PsikoVaka 3.0 — Supabase online katmanı, ilk şema (0001)
-- =============================================================================
-- Durum: TASLAK. Yerel test ortamında (PostgreSQL 16 + supabase/tests stub'ları)
--        supabase/tests/scenario.test.mjs ile çalıştırıldı ve testler geçti.
--        Gerçek Supabase projesinde henüz çalıştırılmadı.
--
-- Nasıl çalıştırılır: Supabase Dashboard > SQL Editor > yeni sorgu > bu dosyanın
-- tamamını yapıştır > Run. Ardından supabase/seed/0002_cases_answer_key.sql.
--
-- İlkeler
--  * Her tabloda RLS açık. Politika yoksa erişim yok (varsayılan red).
--  * İstemciler (anon/authenticated) hiçbir tabloya INSERT/DELETE yapamaz.
--    Tek istisna: profiles.display_name ve profiles.avatar sütunlarının
--    sahibince UPDATE edilmesi. Diğer bütün yazmalar aşağıdaki RPC'lerden geçer.
--  * Bütün fonksiyonlar `security definer` + `set search_path = ''`; her nesne
--    şemasıyla birlikte yazılır.
--  * Hata kodları sabit İngilizce dizgelerdir (ör. ROOM_FULL); supabase-js
--    tarafında error.message olarak gelir. Türkçe açıklama error.details içinde.
--  * Ayarlanabilir sabitler public.game_config tablosundadır.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- 1. Tipler
-- -----------------------------------------------------------------------------
create type public.room_mode       as enum ('duel', 'ffa', 'tournament');
-- rounds : sabit tur sayısı, toplam puan (duel/ffa)
-- hp     : can puanlı düello (GeoGuessr Duels benzeri)
-- battle : turnuva, herkes aynı vaka, her tur en düşük puanlı elenir
-- bracket: turnuva, tek eleme ağacı, 1v1 eşleşmeler
create type public.room_format     as enum ('rounds', 'hp', 'battle', 'bracket');
create type public.target_type     as enum ('diagnosis', 'therapy', 'pharmacology', 'combo');
create type public.answer_kind     as enum ('diagnosis', 'therapy', 'pharmacology');
create type public.room_visibility as enum ('private', 'public');
create type public.room_status     as enum ('lobby', 'in_round', 'round_result', 'finished', 'abandoned');
create type public.friendship_status as enum ('pending', 'accepted', 'declined', 'removed');
create type public.invite_status   as enum ('pending', 'accepted', 'declined', 'expired');
create type public.finish_reason   as enum ('solved', 'failed', 'gave_up', 'timeout', 'absent', 'left', 'aborted');
create type public.bracket_seeding as enum ('random', 'ranked');

-- -----------------------------------------------------------------------------
-- 2. Ayarlar (tek yerden ayarlanır)
-- -----------------------------------------------------------------------------
create table public.game_config (
  key   text primary key,
  value numeric not null,
  note  text
);

insert into public.game_config (key, value, note) values
  ('max_guesses_per_stage',        6,   'Bir aşamada en fazla tahmin (kombo: aşama başına)'),
  ('round_countdown_sec',          3,   'Tur başlamadan önceki geri sayım'),
  ('default_round_time_limit_sec', 180, 'Tek hedefli modlarda varsayılan tur süresi'),
  ('default_combo_time_limit_sec', 300, 'Kombo modunda varsayılan tur süresi'),
  ('default_intermission_sec',     10,  'Tur sonucu ekranında bekleme'),
  ('default_round_count',          5,   'rounds formatında varsayılan tur sayısı'),
  ('lobby_absent_grace_sec',       60,  'Lobide bu kadar kalp atışı gelmeyen oyuncu odadan çıkarılır'),
  ('round_absent_grace_sec',       30,  'Maçta bu kadar kalp atışı gelmeyen oyuncu o turu kaybeder'),
  ('stale_room_minutes',           10,  'Kimseden kalp atışı gelmeyen oda bu süre sonra terk edilmiş sayılır'),
  ('invite_ttl_minutes',           10,  'Oda davetinin geçerlilik süresi'),
  ('hp_start',                     600, 'HP düellosu başlangıç canı'),
  ('hp_max_rounds',                10,  'HP düellosu tur sınırı; sonunda canı yüksek olan kazanır'),
  ('hp_multiplier_base',           1.0, 'HP hasar çarpanı (ilk turlar)'),
  ('hp_ramp_start_round',          4,   'Çarpanın artmaya başladığı tur'),
  ('hp_multiplier_step',           0.5, 'Her turda çarpana eklenen miktar'),
  ('rp_default',                   250, 'Yeni hesabın RP değeri (bilgi amaçlı; profiles varsayılanı da 250)'),
  ('rp_win_tournament',            75,  'Turnuva birinciliği'),
  ('rp_win_ffa',                   50,  'FFA birinciliği'),
  ('rp_win_duel',                  35,  'Düello galibiyeti'),
  ('rp_second',                    20,  'İkincilik (2''den fazla oyuncu varsa)'),
  ('rp_completion',                5,   'Maçı tamamlama'),
  ('max_pending_friend_requests',  50,  'Bekleyen giden arkadaşlık isteği sınırı'),
  ('max_friends',                  200, 'Arkadaş sınırı');

create or replace function public._cfg(p_key text)
returns numeric
language plpgsql stable
security definer
set search_path = ''
as $$
declare v numeric;
begin
  select c.value into v from public.game_config c where c.key = p_key;
  if v is null then
    raise exception using errcode = 'P0001', message = 'CONFIG_MISSING', detail = p_key;
  end if;
  return v;
end $$;

-- -----------------------------------------------------------------------------
-- 3. Tablolar
-- -----------------------------------------------------------------------------

-- 3.1 Profil (auth.users ile 1-1)
create table public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  username       text,
  display_name   text not null default 'Klinisyen',
  avatar         jsonb not null default
    '{"bg":"bg_indigo","skin":"skin_warm","hat":"hat_einstein","eye":"eye_hypno","mouth":"mouth_tongue","prop":"prop_steth"}'::jsonb,
  ranked_points  integer not null default 250,
  matches_played integer not null default 0,
  matches_won    integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint profiles_username_format check (username is null or username ~ '^[A-Za-z0-9_]{3,20}$'),
  constraint profiles_display_name_len check (char_length(btrim(display_name)) between 1 and 30),
  constraint profiles_avatar_shape check (jsonb_typeof(avatar) = 'object' and pg_column_size(avatar) <= 1024),
  constraint profiles_rp_nonneg check (ranked_points >= 0),
  constraint profiles_counts_nonneg check (matches_played >= 0 and matches_won >= 0 and matches_won <= matches_played)
);
create unique index profiles_username_lower_key on public.profiles (lower(username)) where username is not null;
create index profiles_ranked_idx on public.profiles (ranked_points desc) where username is not null;

-- 3.2 Arkadaşlık (karşılıklı; çift başına tek satır)
create table public.friendships (
  id           uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status       public.friendship_status not null default 'pending',
  created_at   timestamptz not null default now(),
  responded_at timestamptz,
  updated_at   timestamptz not null default now(),
  constraint friendships_not_self check (requester_id <> addressee_id)
);
create unique index friendships_pair_key on public.friendships
  (least(requester_id, addressee_id), greatest(requester_id, addressee_id));
create index friendships_addressee_idx on public.friendships (addressee_id, status);
create index friendships_requester_idx on public.friendships (requester_id, status);

-- 3.3 Cevap anahtarı (istemci okuyamaz) ve seçenek kataloğu
create table public.cases_answer_key (
  case_id         text primary key,
  case_number     integer,
  diagnosis_id    text not null,
  therapy_id      text not null,
  pharmacology_id text not null,
  category        text,
  difficulty      text,
  course          text,
  is_active       boolean not null default true,
  updated_at      timestamptz not null default now()
);

-- Tahmin edilebilir bütün seçenekler + grup (tanı kategorisi / terapi ekolü /
-- ilaç ailesi). Tahmin doğrulaması ve "grup doğru" (sıcak) ipucu için.
create table public.answer_catalog (
  kind     public.answer_kind not null,
  item_id  text not null,
  group_id text,
  primary key (kind, item_id)
);

-- 3.4 Odalar
create table public.rooms (
  id                   uuid primary key default gen_random_uuid(),
  code                 text not null,
  host_id              uuid references public.profiles(id) on delete set null,
  mode                 public.room_mode not null,
  format               public.room_format not null,
  target_type          public.target_type not null default 'diagnosis',
  visibility           public.room_visibility not null default 'private',
  capacity             smallint not null,
  round_count          smallint not null,
  round_time_limit_sec smallint not null,
  intermission_sec     smallint not null,
  bracket_seeding      public.bracket_seeding not null default 'random',
  status               public.room_status not null default 'lobby',
  player_count         smallint not null default 0,
  current_round        smallint not null default 0,
  next_round_at        timestamptz,
  ended_early          boolean not null default false,
  created_at           timestamptz not null default now(),
  started_at           timestamptz,
  finished_at          timestamptz,
  constraint rooms_code_format check (code ~ '^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$'),
  constraint rooms_capacity_by_mode check (
       (mode = 'duel' and capacity = 2)
    or (mode = 'ffa' and capacity between 2 and 8)
    or (mode = 'tournament' and capacity in (4, 8))),
  constraint rooms_format_by_mode check (
       (mode = 'duel' and format in ('rounds', 'hp'))
    or (mode = 'ffa' and format = 'rounds')
    or (mode = 'tournament' and format in ('battle', 'bracket'))),
  constraint rooms_round_count check (round_count between 1 and 30),
  constraint rooms_time_limit check (round_time_limit_sec between 30 and 900),
  constraint rooms_intermission check (intermission_sec between 3 and 60),
  constraint rooms_player_count check (player_count between 0 and capacity),
  constraint rooms_current_round check (current_round between 0 and round_count)
);
-- Kod yalnızca bitmemiş odalar arasında benzersiz
create unique index rooms_code_active_key on public.rooms (code)
  where status in ('lobby', 'in_round', 'round_result');
create index rooms_public_lobby_idx on public.rooms (created_at desc)
  where visibility = 'public' and status = 'lobby';
create index rooms_active_idx on public.rooms (created_at)
  where status in ('lobby', 'in_round', 'round_result');

-- 3.5 Oda oyuncuları (silinmez; ayrılma left_at ile işaretlenir)
create table public.room_players (
  room_id          uuid not null references public.rooms(id) on delete cascade,
  user_id          uuid not null references public.profiles(id) on delete cascade,
  joined_at        timestamptz not null default now(),
  is_ready         boolean not null default false,
  is_current       boolean not null default true,   -- kullanıcının "şu anki odası" mı
  played           boolean not null default false,  -- maç başladığında odadaydı
  left_at          timestamptz,
  total_score      integer not null default 0,
  eliminated_round smallint,                        -- battle / bracket
  hp               integer,                         -- hp düellosu
  team             smallint,                        -- HAZIRLIK: ileride 2v2 takım düellosu
  primary key (room_id, user_id),
  constraint room_players_team check (team is null or team in (1, 2)),
  constraint room_players_hp check (hp is null or hp >= 0)
);
create unique index room_players_one_current_room on public.room_players (user_id) where is_current;
create index room_players_user_idx on public.room_players (user_id);

-- 3.6 Kalp atışı (Realtime yayınında YOK; sık yazıldığı için ayrı tablo)
create table public.room_heartbeats (
  room_id      uuid not null references public.rooms(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  last_seen_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

-- 3.7 Maç başında sunucunun seçtiği vaka sırası (istemci okuyamaz)
create table public.room_case_queue (
  room_id  uuid not null references public.rooms(id) on delete cascade,
  round_no smallint not null,
  case_id  text not null references public.cases_answer_key(case_id),
  primary key (room_id, round_no),
  unique (room_id, case_id)
);

-- 3.8 Turlar (yalnızca başlamış turlar burada görünür)
create table public.room_rounds (
  room_id             uuid not null references public.rooms(id) on delete cascade,
  round_no            smallint not null,
  case_id             text not null references public.cases_answer_key(case_id),
  starts_at           timestamptz not null,
  deadline_at         timestamptz not null,
  closed_at           timestamptz,
  close_reason        text,
  hp_multiplier       numeric,
  eliminated_user_ids uuid[] not null default '{}',
  primary key (room_id, round_no),
  constraint room_rounds_close_reason check (close_reason is null or close_reason in ('all_finished', 'timeout', 'match_ended'))
);

-- 3.9 Oyuncunun turdaki durumu (odadaki herkes görür: sayı, bitti mi, kazandı mı, puan)
create table public.round_players (
  room_id          uuid not null,
  round_no         smallint not null,
  user_id          uuid not null,
  stage            smallint not null default 1,
  stage_guess_count smallint not null default 0,
  guess_count      smallint not null default 0,
  finished         boolean not null default false,
  won              boolean not null default false,
  points           integer not null default 0,
  elapsed_sec      integer,
  finish_reason    public.finish_reason,
  finished_at      timestamptz,
  hp_damage        integer,
  hp_after         integer,
  primary key (room_id, round_no, user_id),
  foreign key (room_id, round_no) references public.room_rounds(room_id, round_no) on delete cascade,
  foreign key (room_id, user_id) references public.room_players(room_id, user_id) on delete cascade,
  constraint round_players_stage check (stage between 1 and 3),
  constraint round_players_counts check (stage_guess_count between 0 and 6 and guess_count between 0 and 18)
);

-- 3.10 Tahminler (içerik: tur sürerken yalnızca sahibi görür)
create table public.round_guesses (
  id         bigint generated always as identity primary key,
  room_id    uuid not null,
  round_no   smallint not null,
  user_id    uuid not null,
  stage      smallint not null,
  guess_no   smallint not null,
  item_id    text not null,
  is_correct boolean not null,
  same_group boolean not null default false,
  created_at timestamptz not null default now(),
  foreign key (room_id, round_no, user_id) references public.round_players(room_id, round_no, user_id) on delete cascade,
  unique (room_id, round_no, user_id, stage, item_id)
);

-- 3.11 Turnuva eşleşme ağacı (bracket)
create table public.match_pairings (
  room_id        uuid not null references public.rooms(id) on delete cascade,
  bracket_round  smallint not null,          -- = room_rounds.round_no
  slot           smallint not null,          -- 0'dan başlar; sonraki turda slot/2
  player_a       uuid references public.profiles(id) on delete set null,
  player_b       uuid references public.profiles(id) on delete set null,
  seed_a         smallint,
  seed_b         smallint,
  winner_id      uuid references public.profiles(id) on delete set null,
  decided_reason text,
  decided_at     timestamptz,
  primary key (room_id, bracket_round, slot),
  constraint match_pairings_reason check (decided_reason is null or decided_reason in ('score', 'tiebreak', 'forfeit'))
);

-- 3.12 Maç sonuçları ve RP değişimi
create table public.match_results (
  room_id          uuid not null references public.rooms(id) on delete cascade,
  user_id          uuid not null references public.profiles(id) on delete cascade,
  mode             public.room_mode not null,
  format           public.room_format not null,
  final_rank       smallint not null,
  total_score      integer not null,
  eliminated_round smallint,
  final_hp         integer,
  left_early       boolean not null default false,
  rp_delta         integer not null,
  rp_after         integer,
  created_at       timestamptz not null default now(),
  primary key (room_id, user_id)
);
create index match_results_user_idx on public.match_results (user_id, created_at desc);

-- 3.13 Oda davetleri (yalnızca davet eden ve edilen görür)
create table public.room_invites (
  id           uuid primary key default gen_random_uuid(),
  room_id      uuid not null references public.rooms(id) on delete cascade,
  room_code    text not null,
  inviter_id   uuid not null references public.profiles(id) on delete cascade,
  invitee_id   uuid not null references public.profiles(id) on delete cascade,
  status       public.invite_status not null default 'pending',
  created_at   timestamptz not null default now(),
  expires_at   timestamptz not null,
  responded_at timestamptz
);
create unique index room_invites_one_pending on public.room_invites (room_id, invitee_id) where status = 'pending';
create index room_invites_invitee_idx on public.room_invites (invitee_id, status);

-- 3.14 Yerel ilerlemenin bir kerelik aktarımı
create table public.user_progress (
  user_id         uuid primary key references public.profiles(id) on delete cascade,
  solved_case_ids text[] not null default '{}',
  stats           jsonb not null default '{}'::jsonb,
  imported_at     timestamptz,
  updated_at      timestamptz not null default now()
);

-- 3.15 HAZIRLIK (RPC'si henüz yok): günlük meydan okuma
create table public.daily_challenges (
  challenge_date date not null,
  target_type    public.target_type not null,
  case_id        text not null references public.cases_answer_key(case_id),
  primary key (challenge_date, target_type)
);
create table public.daily_results (
  user_id        uuid not null references public.profiles(id) on delete cascade,
  challenge_date date not null,
  target_type    public.target_type not null,
  case_id        text not null references public.cases_answer_key(case_id),
  won            boolean not null,
  guess_count    smallint not null,
  points         integer not null,
  elapsed_sec    integer not null,
  completed_at   timestamptz not null default now(),
  primary key (user_id, challenge_date, target_type)
);
create index daily_results_board_idx on public.daily_results (challenge_date, target_type, points desc, elapsed_sec asc);

-- 3.16 HAZIRLIK (RPC'si henüz yok): tekli seri rekorları
create table public.solo_streaks (
  user_id        uuid not null references public.profiles(id) on delete cascade,
  target_type    public.target_type not null,
  current_streak integer not null default 0,
  best_streak    integer not null default 0,
  updated_at     timestamptz not null default now(),
  primary key (user_id, target_type),
  constraint solo_streaks_nonneg check (current_streak >= 0 and best_streak >= current_streak)
);

-- -----------------------------------------------------------------------------
-- 4. Görünümler (security_invoker: okuyanın RLS kuralları geçerli)
-- -----------------------------------------------------------------------------
create view public.leaderboard with (security_invoker = true) as
  select p.id as user_id, p.username, p.display_name, p.avatar, p.ranked_points,
         p.matches_played, p.matches_won,
         rank() over (order by p.ranked_points desc) as position
    from public.profiles p
   where p.username is not null;

create view public.daily_leaderboard with (security_invoker = true) as
  select d.challenge_date, d.target_type, d.user_id, p.username, p.display_name, p.avatar,
         d.won, d.guess_count, d.points, d.elapsed_sec,
         rank() over (partition by d.challenge_date, d.target_type
                      order by d.points desc, d.elapsed_sec asc) as position
    from public.daily_results d
    join public.profiles p on p.id = d.user_id;

-- -----------------------------------------------------------------------------
-- 5. Yardımcı fonksiyonlar (iç kullanım; istemciye açık değil)
-- -----------------------------------------------------------------------------
create or replace function public._raise(p_code text, p_detail text default null)
returns void
language plpgsql
set search_path = ''
as $$
begin
  raise exception using errcode = 'P0001', message = p_code, detail = coalesce(p_detail, p_code);
end $$;

create or replace function public._uid()
returns uuid
language plpgsql stable
set search_path = ''
as $$
declare v uuid := auth.uid();
begin
  if v is null then perform public._raise('NOT_AUTHENTICATED', 'Giriş yapmalısın.'); end if;
  return v;
end $$;

-- Kullanıcı adı seçmiş bir profil şart
create or replace function public._require_player(p_uid uuid)
returns public.profiles
language plpgsql stable
security definer
set search_path = ''
as $$
declare v public.profiles;
begin
  select * into v from public.profiles where id = p_uid;
  if not found or v.username is null then
    perform public._raise('USERNAME_REQUIRED', 'Önce kullanıcı adı seçmelisin.');
  end if;
  return v;
end $$;

-- calculateCasePoints (js/online_arena.js) ile birebir aynı
create or replace function public._base_points(p_guesses integer)
returns integer
language sql immutable
set search_path = ''
as $$
  select case p_guesses when 1 then 100 when 2 then 85 when 3 then 70
                        when 4 then 55 when 5 then 40 else 25 end
$$;

create or replace function public._speed_bonus(p_elapsed integer)
returns integer
language sql immutable
set search_path = ''
as $$
  -- JS: Math.round((60 - Math.min(60, elapsedSeconds || 30)) / 3), 0..20
  -- Not: `|| 30` yüzünden 0 sn, 30 sn sayılır (JS ile aynı davranış korunuyor).
  select greatest(0, least(20, round((60 - least(60, coalesce(nullif(p_elapsed, 0), 30)))::numeric / 3)))::integer
$$;

create or replace function public._case_points(p_won boolean, p_guesses integer, p_elapsed integer)
returns integer
language sql immutable
set search_path = ''
as $$
  select case when not p_won then 0
              else public._base_points(p_guesses) + public._speed_bonus(p_elapsed) end
$$;

create or replace function public._hp_multiplier(p_round integer)
returns numeric
language sql stable
security definer
set search_path = ''
as $$
  select case when p_round < public._cfg('hp_ramp_start_round')
              then public._cfg('hp_multiplier_base')
              else public._cfg('hp_multiplier_base')
                   + public._cfg('hp_multiplier_step') * (p_round - public._cfg('hp_ramp_start_round') + 1)
         end
$$;

create or replace function public._gen_room_code()
returns text
language plpgsql volatile
set search_path = ''
as $$
declare
  v_alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';  -- I, L, O, 0, 1 yok
  v_bytes bytea := uuid_send(gen_random_uuid());
  v_code text := '';
begin
  for i in 0..5 loop
    v_code := v_code || substr(v_alphabet, (get_byte(v_bytes, i) % 31) + 1, 1);
  end loop;
  return v_code;
end $$;

create or replace function public._is_friend(p_a uuid, p_b uuid)
returns boolean
language sql stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.friendships f
     where f.status = 'accepted'
       and least(f.requester_id, f.addressee_id) = least(p_a, p_b)
       and greatest(f.requester_id, f.addressee_id) = greatest(p_a, p_b))
$$;

create or replace function public._alive_count(p_room_id uuid)
returns integer
language sql stable
security definer
set search_path = ''
as $$
  select count(*)::integer from public.room_players p
   where p.room_id = p_room_id and p.played and p.left_at is null and p.eliminated_round is null
$$;

create or replace function public._sync_player_count(p_room_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.rooms r
     set player_count = (select count(*) from public.room_players p
                          where p.room_id = r.id and p.left_at is null)
   where r.id = p_room_id
$$;

create or replace function public._touch_heartbeat(p_room_id uuid, p_uid uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.room_heartbeats (room_id, user_id, last_seen_at)
  values (p_room_id, p_uid, now())
  on conflict (room_id, user_id) do update set last_seen_at = excluded.last_seen_at
$$;

create or replace function public._abandon_room(p_room_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.rooms
     set status = 'abandoned', finished_at = now(), next_round_at = null
   where id = p_room_id and status in ('lobby', 'in_round', 'round_result');
  update public.room_players set is_current = false where room_id = p_room_id and is_current;
  update public.room_invites set status = 'expired' where room_id = p_room_id and status = 'pending';
end $$;

-- Host odada değilse en erken katılana geçer; kimse kalmadıysa oda kapanır.
create or replace function public._fix_host_or_abandon(p_room_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_room public.rooms;
  v_next uuid;
begin
  select * into v_room from public.rooms where id = p_room_id;
  select p.user_id into v_next
    from public.room_players p
   where p.room_id = p_room_id and p.left_at is null
   order by (p.user_id = v_room.host_id) desc, p.joined_at, p.user_id
   limit 1;
  if v_next is null then
    perform public._abandon_room(p_room_id);
  elsif v_next is distinct from v_room.host_id then
    update public.rooms set host_id = v_next where id = p_room_id;
  end if;
end $$;

-- Hiç kalp atışı gelmeyen eski odaları kapatır (create_room içinden ucuzca;
-- istenirse pg_cron ile de çağrılabilir).
create or replace function public._close_stale_rooms()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_n integer := 0;
  v_cut timestamptz := now() - (public._cfg('stale_room_minutes')::float8 * interval '1 minute');
begin
  for v_id in
    select r.id from public.rooms r
     where r.status in ('lobby', 'in_round', 'round_result')
       and r.created_at < v_cut
       and not exists (select 1 from public.room_heartbeats h
                        where h.room_id = r.id and h.last_seen_at > v_cut)
     order by r.created_at
     limit 50
     for update skip locked
  loop
    perform public._abandon_room(v_id);
    v_n := v_n + 1;
  end loop;
  return v_n;
end $$;

-- Bir turu başlatır: kuyruktan vakayı alır, hayattaki oyunculara satır açar.
create or replace function public._start_round(p_room_id uuid, p_round smallint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_room public.rooms;
  v_case text;
  v_starts timestamptz;
begin
  select * into v_room from public.rooms where id = p_room_id for update;
  select q.case_id into v_case from public.room_case_queue q
   where q.room_id = p_room_id and q.round_no = p_round;
  if v_case is null then perform public._raise('NOT_ENOUGH_CASES'); end if;

  v_starts := now() + (public._cfg('round_countdown_sec')::float8 * interval '1 second');
  insert into public.room_rounds (room_id, round_no, case_id, starts_at, deadline_at, hp_multiplier)
  values (p_room_id, p_round, v_case, v_starts,
          v_starts + (v_room.round_time_limit_sec * interval '1 second'),
          case when v_room.format = 'hp' then public._hp_multiplier(p_round) end);

  insert into public.round_players (room_id, round_no, user_id)
  select p_room_id, p_round, p.user_id
    from public.room_players p
   where p.room_id = p_room_id and p.played and p.left_at is null and p.eliminated_round is null;

  update public.rooms
     set status = 'in_round', current_round = p_round, next_round_at = null
   where id = p_room_id;
end $$;

-- HP düellosu: düşük puanlı oyuncu (fark × çarpan) can kaybeder
create or replace function public._apply_hp_damage(p_room_id uuid, p_round smallint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_hi record;
  v_lo record;
  v_mult numeric;
  v_dmg integer;
begin
  select r.user_id, r.points into v_hi
    from public.round_players r join public.room_players p using (room_id, user_id)
   where r.room_id = p_room_id and r.round_no = p_round and p.left_at is null
   order by r.points desc limit 1;
  select r.user_id, r.points into v_lo
    from public.round_players r join public.room_players p using (room_id, user_id)
   where r.room_id = p_room_id and r.round_no = p_round and p.left_at is null
   order by r.points asc limit 1;

  if v_hi.user_id is not null and v_lo.user_id is not null
     and v_hi.user_id <> v_lo.user_id and v_hi.points > v_lo.points then
    v_mult := public._hp_multiplier(p_round);
    v_dmg := round((v_hi.points - v_lo.points) * v_mult)::integer;
    update public.room_players set hp = greatest(0, hp - v_dmg)
     where room_id = p_room_id and user_id = v_lo.user_id;
    update public.round_players set hp_damage = v_dmg
     where room_id = p_room_id and round_no = p_round and user_id = v_lo.user_id;
  end if;

  update public.round_players r
     set hp_damage = coalesce(r.hp_damage, 0), hp_after = p.hp
    from public.room_players p
   where r.room_id = p_room_id and r.round_no = p_round
     and p.room_id = r.room_id and p.user_id = r.user_id;
end $$;

-- Bracket: o turun eşleşmelerini karara bağlar, kaybedenleri eler, sonraki turu kurar.
-- Kazanan: odada kalan > yüksek puan > az tahmin > kısa süre > erken bitiren > üst sıra (a).
create or replace function public._decide_bracket_round(p_room_id uuid, p_round smallint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_room public.rooms;
  v_pair public.match_pairings;
  v_winner uuid;
  v_loser uuid;
  v_reason text;
  v_w record;
  v_l record;
  v_losers uuid[] := '{}';
begin
  select * into v_room from public.rooms where id = p_room_id;

  for v_pair in
    select * from public.match_pairings
     where room_id = p_room_id and bracket_round = p_round and winner_id is null
     order by slot
     for update
  loop
    select x.user_id into v_winner
      from (values (v_pair.player_a, 0), (v_pair.player_b, 1)) as x(user_id, side)
      join public.room_players p on p.room_id = p_room_id and p.user_id = x.user_id
      left join public.round_players r
             on r.room_id = p_room_id and r.round_no = p_round and r.user_id = x.user_id
     where x.user_id is not null
     order by (p.left_at is null) desc,
              (coalesce(r.finish_reason::text, 'absent') not in ('absent', 'left')) desc,
              coalesce(r.points, 0) desc,
              coalesce(r.guess_count, 99) asc,
              coalesce(r.elapsed_sec, 2147483647) asc,
              r.finished_at asc nulls last,
              x.side asc
     limit 1;

    v_loser := case when v_winner = v_pair.player_a then v_pair.player_b else v_pair.player_a end;

    select coalesce(r.points, 0) as points, p.left_at, r.finish_reason into v_w
      from public.room_players p
      left join public.round_players r on r.room_id = p.room_id and r.round_no = p_round and r.user_id = p.user_id
     where p.room_id = p_room_id and p.user_id = v_winner;
    select coalesce(r.points, 0) as points, p.left_at, r.finish_reason into v_l
      from public.room_players p
      left join public.round_players r on r.room_id = p.room_id and r.round_no = p_round and r.user_id = p.user_id
     where p.room_id = p_room_id and p.user_id = v_loser;

    if v_loser is null then
      v_reason := 'forfeit';
    elsif v_l.left_at is not null or v_l.finish_reason is null or v_l.finish_reason in ('absent', 'left') then
      v_reason := 'forfeit';
    elsif v_w.points > v_l.points then
      v_reason := 'score';
    else
      v_reason := 'tiebreak';
    end if;

    update public.match_pairings
       set winner_id = v_winner, decided_reason = v_reason, decided_at = now()
     where room_id = p_room_id and bracket_round = p_round and slot = v_pair.slot;

    if v_loser is not null then
      update public.room_players set eliminated_round = p_round
       where room_id = p_room_id and user_id = v_loser and eliminated_round is null;
      v_losers := v_losers || v_loser;
    end if;
  end loop;

  update public.room_rounds set eliminated_user_ids = eliminated_user_ids || v_losers
   where room_id = p_room_id and round_no = p_round;

  if p_round < v_room.round_count then
    insert into public.match_pairings (room_id, bracket_round, slot, player_a, player_b)
    select p_room_id, p_round + 1, (m.slot / 2)::smallint,
           (array_agg(m.winner_id order by m.slot))[1],
           (array_agg(m.winner_id order by m.slot))[2]
      from public.match_pairings m
     where m.room_id = p_room_id and m.bracket_round = p_round
     group by m.slot / 2
    on conflict do nothing;
  end if;
end $$;

-- Maçı bitirir, sıralar, RP dağıtır. Tekrar çağrılırsa hiçbir şey yapmaz.
create or replace function public._finish_match(p_room_id uuid, p_ended_early boolean default false)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_room public.rooms;
  v_closed integer;
  v_participants integer;
  v_award boolean;
  v_win_rp integer;
begin
  select * into v_room from public.rooms where id = p_room_id for update;
  if not found or v_room.status in ('finished', 'abandoned', 'lobby') then
    return;
  end if;

  select count(*) into v_closed from public.room_rounds
   where room_id = p_room_id and closed_at is not null;
  select count(*) into v_participants from public.room_players
   where room_id = p_room_id and played;

  -- Erken biten maçta (rakipler çıktı) en az turların yarısı oynanmadıysa RP yok:
  -- ikinci hesapla "katıl-çık" RP çiftçiliğini önler.
  v_award := (not p_ended_early) or (v_closed * 2 >= v_room.round_count);

  v_win_rp := case v_room.mode
                when 'tournament' then public._cfg('rp_win_tournament')
                when 'ffa' then public._cfg('rp_win_ffa')
                else public._cfg('rp_win_duel') end;

  with ranked as (
    select p.user_id, p.total_score, p.eliminated_round, p.hp, p.left_at,
           row_number() over (
             order by (p.left_at is not null) asc,
                      case when v_room.format in ('battle', 'bracket')
                           then coalesce(p.eliminated_round, 32767) else 0 end desc,
                      case when v_room.format = 'hp' then coalesce(p.hp, 0) else 0 end desc,
                      p.total_score desc,
                      (select coalesce(sum(r.elapsed_sec), 0) from public.round_players r
                        where r.room_id = p.room_id and r.user_id = p.user_id and r.won) asc,
                      p.joined_at asc, p.user_id
           ) as rnk
      from public.room_players p
     where p.room_id = p_room_id and p.played
  )
  insert into public.match_results
    (room_id, user_id, mode, format, final_rank, total_score, eliminated_round, final_hp, left_early, rp_delta)
  select p_room_id, k.user_id, v_room.mode, v_room.format, k.rnk, k.total_score, k.eliminated_round, k.hp,
         k.left_at is not null,
         case when not v_award or k.left_at is not null then 0
              when k.rnk = 1 then v_win_rp
              when k.rnk = 2 and v_participants > 2 then public._cfg('rp_second')::integer
              else public._cfg('rp_completion')::integer end
    from ranked k
  on conflict (room_id, user_id) do nothing;

  update public.profiles pr
     set ranked_points  = greatest(0, pr.ranked_points + mr.rp_delta),
         matches_played = pr.matches_played + 1,
         matches_won    = pr.matches_won + case when mr.final_rank = 1 and v_award then 1 else 0 end,
         updated_at     = now()
    from public.match_results mr
   where mr.room_id = p_room_id and mr.user_id = pr.id and mr.rp_after is null;

  update public.match_results mr
     set rp_after = pr.ranked_points
    from public.profiles pr
   where mr.room_id = p_room_id and pr.id = mr.user_id and mr.rp_after is null;

  update public.rooms
     set status = 'finished', finished_at = now(), next_round_at = null, ended_early = p_ended_early
   where id = p_room_id;
  update public.room_players set is_current = false where room_id = p_room_id and is_current;
  update public.room_invites set status = 'expired' where room_id = p_room_id and status = 'pending';
end $$;

-- Turu kapatır, formatın kuralını uygular, sonraki adıma geçer.
create or replace function public._close_round(p_room_id uuid, p_reason text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_room public.rooms;
  v_round public.room_rounds;
  v_loser uuid;
  v_alive integer;
  v_hp_zero boolean := false;
  v_last boolean;
begin
  select * into v_room from public.rooms where id = p_room_id for update;
  select * into v_round from public.room_rounds
   where room_id = p_room_id and round_no = v_room.current_round for update;
  if v_round.closed_at is not null then return; end if;

  update public.round_players
     set finished = true, won = false, points = 0, finished_at = now(),
         elapsed_sec = least(v_room.round_time_limit_sec,
                             greatest(0, floor(extract(epoch from now() - v_round.starts_at))::integer)),
         finish_reason = 'aborted'
   where room_id = p_room_id and round_no = v_round.round_no and not finished;

  update public.room_rounds set closed_at = now(), close_reason = p_reason
   where room_id = p_room_id and round_no = v_round.round_no;

  if p_reason <> 'match_ended' then
    if v_room.format = 'battle' then
      if public._alive_count(p_room_id) > 2 then
        select r.user_id into v_loser
          from public.round_players r
          join public.room_players p on p.room_id = r.room_id and p.user_id = r.user_id
         where r.room_id = p_room_id and r.round_no = v_round.round_no
           and p.left_at is null and p.eliminated_round is null
         order by r.points asc, r.elapsed_sec desc nulls first, p.joined_at desc
         limit 1;
        if v_loser is not null then
          update public.room_players set eliminated_round = v_round.round_no
           where room_id = p_room_id and user_id = v_loser;
          update public.room_rounds set eliminated_user_ids = array[v_loser]
           where room_id = p_room_id and round_no = v_round.round_no;
        end if;
      end if;
    elsif v_room.format = 'bracket' then
      perform public._decide_bracket_round(p_room_id, v_round.round_no);
    elsif v_room.format = 'hp' then
      perform public._apply_hp_damage(p_room_id, v_round.round_no);
      select exists (select 1 from public.room_players
                      where room_id = p_room_id and played and left_at is null and hp <= 0)
        into v_hp_zero;
    end if;
  end if;

  v_alive := public._alive_count(p_room_id);
  v_last := p_reason = 'match_ended'
            or v_round.round_no >= v_room.round_count
            or v_alive <= 1
            or v_hp_zero;

  if v_last then
    perform public._finish_match(p_room_id,
      p_ended_early => (v_round.round_no < v_room.round_count and not v_hp_zero));
  else
    update public.rooms
       set status = 'round_result',
           next_round_at = now() + (v_room.intermission_sec * interval '1 second')
     where id = p_room_id;
  end if;
end $$;

-- Zamanı gelen her geçişi yapar (oda satırı kilitli). Tekrar çağrılması güvenli.
create or replace function public._progress_room(p_room_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_room public.rooms;
  v_round public.room_rounds;
  v_n integer;
  v_unfinished integer;
begin
  select * into v_room from public.rooms where id = p_room_id for update;
  if not found then return; end if;

  if v_room.status = 'lobby' then
    update public.room_players rp
       set left_at = now(), is_current = false, is_ready = false
      from public.room_heartbeats h
     where rp.room_id = p_room_id and rp.left_at is null
       and h.room_id = rp.room_id and h.user_id = rp.user_id
       and h.last_seen_at < now() - (public._cfg('lobby_absent_grace_sec')::float8 * interval '1 second');
    get diagnostics v_n = row_count;
    if v_n > 0 then
      perform public._sync_player_count(p_room_id);
      perform public._fix_host_or_abandon(p_room_id);
    end if;
    return;
  end if;

  if v_room.status = 'in_round' then
    select * into v_round from public.room_rounds
     where room_id = p_room_id and round_no = v_room.current_round;

    if now() >= v_round.starts_at then
      -- çıkmış veya kalp atışı kesilmiş oyuncular bu turu kaybeder
      update public.round_players r
         set finished = true, won = false, points = 0, finished_at = now(),
             elapsed_sec = least(v_room.round_time_limit_sec,
                                 greatest(0, floor(extract(epoch from now() - v_round.starts_at))::integer)),
             finish_reason = case when p.left_at is not null then 'left'::public.finish_reason
                                  else 'absent'::public.finish_reason end
        from public.room_players p
        left join public.room_heartbeats h on h.room_id = p.room_id and h.user_id = p.user_id
       where r.room_id = p_room_id and r.round_no = v_round.round_no and not r.finished
         and p.room_id = r.room_id and p.user_id = r.user_id
         and (p.left_at is not null
              or h.last_seen_at is null
              or h.last_seen_at < now() - (public._cfg('round_absent_grace_sec')::float8 * interval '1 second'));

      if now() >= v_round.deadline_at then
        update public.round_players
           set finished = true, won = false, points = 0, finished_at = now(),
               elapsed_sec = v_room.round_time_limit_sec, finish_reason = 'timeout'
         where room_id = p_room_id and round_no = v_round.round_no and not finished;
      end if;
    end if;

    if public._alive_count(p_room_id) <= 1 then
      perform public._close_round(p_room_id, 'match_ended');
      return;
    end if;

    select count(*) into v_unfinished from public.round_players
     where room_id = p_room_id and round_no = v_round.round_no and not finished;
    if v_unfinished = 0 then
      perform public._close_round(p_room_id,
        case when now() >= v_round.deadline_at then 'timeout' else 'all_finished' end);
    end if;
    return;
  end if;

  if v_room.status = 'round_result' and public._alive_count(p_room_id) <= 1 then
    perform public._finish_match(p_room_id, p_ended_early => v_room.current_round < v_room.round_count);
    return;
  end if;

  if v_room.status = 'round_result' and now() >= v_room.next_round_at then
    perform public._start_round(p_room_id, (v_room.current_round + 1)::smallint);
  end if;
end $$;

-- Odadan ayrılma (iç). Lobi: host devri / kapanma. Maç: o turu kaybeder.
create or replace function public._leave_room(p_room_id uuid, p_uid uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_room public.rooms;
  v_rp public.room_players;
begin
  select * into v_room from public.rooms where id = p_room_id for update;
  if not found then return; end if;
  select * into v_rp from public.room_players
   where room_id = p_room_id and user_id = p_uid for update;
  if not found then return; end if;

  if v_rp.left_at is not null or v_room.status in ('finished', 'abandoned') then
    update public.room_players set is_current = false
     where room_id = p_room_id and user_id = p_uid and is_current;
    return;
  end if;

  update public.room_players
     set left_at = now(), is_current = false, is_ready = false
   where room_id = p_room_id and user_id = p_uid;
  perform public._sync_player_count(p_room_id);
  perform public._fix_host_or_abandon(p_room_id);

  if v_room.status in ('in_round', 'round_result') then
    perform public._progress_room(p_room_id);
  end if;
end $$;

-- Kullanıcının başka bir odadaki "şu anki" üyeliğini bırakır
create or replace function public._leave_other_rooms(p_uid uuid, p_except uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare v_id uuid;
begin
  for v_id in
    select room_id from public.room_players
     where user_id = p_uid and is_current and room_id is distinct from p_except
  loop
    perform public._leave_room(v_id, p_uid);
  end loop;
end $$;

-- -----------------------------------------------------------------------------
-- 6. RLS yardımcıları (politikalarda kullanılır; yalnızca çağıranı ilgilendirir)
-- -----------------------------------------------------------------------------
create or replace function public.is_room_member(p_room_id uuid)
returns boolean
language sql stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.room_players
                  where room_id = p_room_id and user_id = auth.uid())
$$;

create or replace function public.has_room_invite(p_room_id uuid)
returns boolean
language sql stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.room_invites
                  where room_id = p_room_id and invitee_id = auth.uid()
                    and status = 'pending' and expires_at > now())
$$;

create or replace function public.is_friend(p_other uuid)
returns boolean
language sql stable
security definer
set search_path = ''
as $$
  select public._is_friend(auth.uid(), p_other)
$$;

-- Realtime özel kanal yetkisi. Kanal adları:
--   room:<room_uuid>   -> odadaki (ayrılmamış) oyuncular okur/yazar (lobi presence, emoji)
--   online:<user_uuid> -> sahibi yazar (presence track); sahibi ve arkadaşları okur
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

-- -----------------------------------------------------------------------------
-- 7. Tetikleyiciler
-- -----------------------------------------------------------------------------
create or replace function public._handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare v_name text;
begin
  v_name := left(btrim(coalesce(new.raw_user_meta_data ->> 'full_name',
                                new.raw_user_meta_data ->> 'name', '')), 30);
  if v_name = '' then v_name := 'Klinisyen'; end if;
  insert into public.profiles (id, display_name) values (new.id, v_name)
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public._handle_new_user();

create or replace function public._touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public._touch_updated_at();

-- -----------------------------------------------------------------------------
-- 8. İstemci RPC'leri
-- -----------------------------------------------------------------------------

-- 8.1 Profil
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
begin
  if v_name !~ '^[A-Za-z0-9_]{3,20}$' then
    perform public._raise('USERNAME_INVALID', '3-20 karakter; harf, rakam ve _ kullanılabilir.');
  end if;
  if exists (select 1 from public.profiles
              where lower(username) = lower(v_name) and id <> v_uid) then
    perform public._raise('USERNAME_TAKEN', 'Bu kullanıcı adı alınmış.');
  end if;
  begin
    insert into public.profiles (id, username) values (v_uid, v_name)
    on conflict (id) do update set username = excluded.username
    returning * into v_prof;
  exception when unique_violation then
    perform public._raise('USERNAME_TAKEN', 'Bu kullanıcı adı alınmış.');
  end;
  return to_jsonb(v_prof);
end $$;

-- 8.2 Arkadaşlık
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
   where lower(username) = lower(btrim(coalesce(p_username, '')));
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

create or replace function public.respond_friend_request(p_friendship_id uuid, p_accept boolean)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_f public.friendships;
begin
  select * into v_f from public.friendships where id = p_friendship_id for update;
  if not found or v_f.addressee_id <> v_uid or v_f.status <> 'pending' then
    perform public._raise('REQUEST_NOT_FOUND');
  end if;
  if p_accept then
    if (select count(*) from public.friendships
         where status = 'accepted' and v_uid in (requester_id, addressee_id)) >= public._cfg('max_friends') then
      perform public._raise('FRIEND_LIMIT');
    end if;
  end if;
  update public.friendships
     set status = case when p_accept then 'accepted'::public.friendship_status
                       else 'declined'::public.friendship_status end,
         responded_at = now(), updated_at = now()
   where id = p_friendship_id returning * into v_f;
  return jsonb_build_object('friendship_id', v_f.id, 'status', v_f.status);
end $$;

-- Arkadaşlıktan çıkarır ya da kendi gönderdiği bekleyen isteği iptal eder
create or replace function public.remove_friend(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_f public.friendships;
begin
  select * into v_f from public.friendships
   where least(requester_id, addressee_id) = least(v_uid, p_user_id)
     and greatest(requester_id, addressee_id) = greatest(v_uid, p_user_id)
   for update;
  if not found or not (v_f.status = 'accepted' or (v_f.status = 'pending' and v_f.requester_id = v_uid)) then
    perform public._raise('NOT_FRIENDS');
  end if;
  update public.friendships set status = 'removed', updated_at = now()
   where id = v_f.id returning * into v_f;
  return jsonb_build_object('friendship_id', v_f.id, 'status', v_f.status);
end $$;

-- 8.3 Oda kurma / katılma
create or replace function public.create_room(
  p_mode text,
  p_format text default null,
  p_target_type text default 'diagnosis',
  p_capacity integer default null,
  p_round_count integer default null,
  p_visibility text default 'private',
  p_round_time_limit_sec integer default null,
  p_bracket_seeding text default 'random')
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_room public.rooms;
  v_format text;
  v_capacity integer;
  v_rounds integer;
  v_limit integer;
  v_attempt integer := 0;
begin
  perform public._require_player(v_uid);

  if p_mode is null or p_mode not in ('duel', 'ffa', 'tournament') then
    perform public._raise('INVALID_SETTINGS', 'mode');
  end if;
  if coalesce(p_target_type, '') not in ('diagnosis', 'therapy', 'pharmacology', 'combo') then
    perform public._raise('INVALID_SETTINGS', 'target_type');
  end if;
  if coalesce(p_visibility, '') not in ('private', 'public') then
    perform public._raise('INVALID_SETTINGS', 'visibility');
  end if;
  if coalesce(p_bracket_seeding, '') not in ('random', 'ranked') then
    perform public._raise('INVALID_SETTINGS', 'bracket_seeding');
  end if;

  v_format := coalesce(p_format, case p_mode when 'tournament' then 'battle' else 'rounds' end);
  v_capacity := coalesce(p_capacity, case p_mode when 'duel' then 2 else 4 end);

  if not ((p_mode = 'duel' and v_format in ('rounds', 'hp'))
       or (p_mode = 'ffa' and v_format = 'rounds')
       or (p_mode = 'tournament' and v_format in ('battle', 'bracket'))) then
    perform public._raise('INVALID_SETTINGS', 'format');
  end if;
  if not ((p_mode = 'duel' and v_capacity = 2)
       or (p_mode = 'ffa' and v_capacity between 2 and 8)
       or (p_mode = 'tournament' and v_capacity in (4, 8))) then
    perform public._raise('INVALID_SETTINGS', 'capacity');
  end if;

  -- Tur sayısı formata göre
  v_rounds := case v_format
                when 'hp' then public._cfg('hp_max_rounds')::integer
                when 'battle' then v_capacity - 1                      -- 4 -> 3, 8 -> 7
                when 'bracket' then case v_capacity when 4 then 2 else 3 end  -- log2
                else coalesce(p_round_count, public._cfg('default_round_count')::integer) end;
  if v_rounds not between 1 and 15 and v_format = 'rounds' then
    perform public._raise('INVALID_SETTINGS', 'round_count');
  end if;
  if v_rounds > (select count(*) from public.cases_answer_key where is_active) then
    perform public._raise('NOT_ENOUGH_CASES');
  end if;

  v_limit := coalesce(p_round_time_limit_sec,
                      case when p_target_type = 'combo'
                           then public._cfg('default_combo_time_limit_sec')
                           else public._cfg('default_round_time_limit_sec') end::integer);
  if v_limit not between 30 and 900 then
    perform public._raise('INVALID_SETTINGS', 'round_time_limit_sec');
  end if;

  perform public._close_stale_rooms();
  perform public._leave_other_rooms(v_uid, null);

  loop
    begin
      insert into public.rooms (code, host_id, mode, format, target_type, visibility, capacity,
                                round_count, round_time_limit_sec, intermission_sec, bracket_seeding,
                                player_count)
      values (public._gen_room_code(), v_uid, p_mode::public.room_mode, v_format::public.room_format,
              p_target_type::public.target_type, p_visibility::public.room_visibility, v_capacity,
              v_rounds, v_limit, public._cfg('default_intermission_sec')::integer,
              p_bracket_seeding::public.bracket_seeding, 1)
      returning * into v_room;
      exit;
    exception when unique_violation then
      v_attempt := v_attempt + 1;
      if v_attempt >= 8 then perform public._raise('CODE_GENERATION_FAILED'); end if;
    end;
  end loop;

  insert into public.room_players (room_id, user_id) values (v_room.id, v_uid);
  perform public._touch_heartbeat(v_room.id, v_uid);
  return to_jsonb(v_room);
end $$;

create or replace function public._join_room_locked(p_room_id uuid, p_uid uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_room public.rooms;
  v_rp public.room_players;
begin
  select * into v_room from public.rooms where id = p_room_id for update;
  if not found or v_room.status in ('finished', 'abandoned') then
    perform public._raise('ROOM_NOT_FOUND', 'Oda bulunamadı veya kapandı.');
  end if;

  select * into v_rp from public.room_players where room_id = p_room_id and user_id = p_uid;
  if found and v_rp.left_at is null then
    -- zaten üye (ör. sayfa yenilendi): yeniden bağlan
    update public.room_players set is_current = true where room_id = p_room_id and user_id = p_uid;
    perform public._touch_heartbeat(p_room_id, p_uid);
    return to_jsonb(v_room);
  end if;

  if v_room.status <> 'lobby' then
    perform public._raise('ALREADY_STARTED', 'Maç başladı; sonradan katılınamaz.');
  end if;
  if v_room.player_count >= v_room.capacity then
    perform public._raise('ROOM_FULL', 'Oda dolu.');
  end if;

  insert into public.room_players (room_id, user_id) values (p_room_id, p_uid)
  on conflict (room_id, user_id) do update
     set left_at = null, is_current = true, is_ready = false, joined_at = now();
  perform public._sync_player_count(p_room_id);
  perform public._touch_heartbeat(p_room_id, p_uid);
  update public.room_invites set status = 'accepted', responded_at = now()
   where room_id = p_room_id and invitee_id = p_uid and status = 'pending';

  select * into v_room from public.rooms where id = p_room_id;
  return to_jsonb(v_room);
end $$;

create or replace function public.join_room(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_id uuid;
begin
  perform public._require_player(v_uid);
  select id into v_id from public.rooms
   where code = upper(btrim(coalesce(p_code, '')))
     and status in ('lobby', 'in_round', 'round_result');
  if v_id is null then perform public._raise('ROOM_NOT_FOUND', 'Oda bulunamadı veya kapandı.'); end if;
  perform public._leave_other_rooms(v_uid, v_id);
  return public._join_room_locked(v_id, v_uid);
end $$;

create or replace function public.leave_room(p_room_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare v_uid uuid := public._uid();
begin
  if not exists (select 1 from public.room_players where room_id = p_room_id and user_id = v_uid) then
    perform public._raise('NOT_MEMBER');
  end if;
  perform public._leave_room(p_room_id, v_uid);
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.set_ready(p_room_id uuid, p_ready boolean)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_room public.rooms;
begin
  select * into v_room from public.rooms where id = p_room_id for update;
  if not found then perform public._raise('ROOM_NOT_FOUND'); end if;
  if not exists (select 1 from public.room_players
                  where room_id = p_room_id and user_id = v_uid and left_at is null) then
    perform public._raise('NOT_MEMBER');
  end if;
  if v_room.status <> 'lobby' then perform public._raise('ALREADY_STARTED'); end if;
  update public.room_players set is_ready = coalesce(p_ready, false)
   where room_id = p_room_id and user_id = v_uid;
  perform public._touch_heartbeat(p_room_id, v_uid);
  return jsonb_build_object('ok', true, 'is_ready', coalesce(p_ready, false));
end $$;

create or replace function public.start_match(p_room_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_room public.rooms;
  v_n integer;
begin
  select * into v_room from public.rooms where id = p_room_id for update;
  if not found then perform public._raise('ROOM_NOT_FOUND'); end if;
  if not exists (select 1 from public.room_players
                  where room_id = p_room_id and user_id = v_uid and left_at is null) then
    perform public._raise('NOT_MEMBER');
  end if;
  if v_room.status <> 'lobby' then perform public._raise('ALREADY_STARTED'); end if;

  perform public._touch_heartbeat(p_room_id, v_uid);
  perform public._progress_room(p_room_id);          -- kalp atışı kesilmiş lobi oyuncularını düşür
  select * into v_room from public.rooms where id = p_room_id;
  if v_room.status <> 'lobby' then perform public._raise('ROOM_NOT_FOUND'); end if;
  if v_room.host_id is distinct from v_uid then perform public._raise('NOT_HOST', 'Maçı yalnızca oda sahibi başlatabilir.'); end if;

  -- Host'un "başlat"a basması kendi hazır onayı sayılır
  update public.room_players set is_ready = true where room_id = p_room_id and user_id = v_uid;

  select count(*) into v_n from public.room_players where room_id = p_room_id and left_at is null;
  if v_n < v_room.capacity then
    perform public._raise('ROOM_NOT_FULL', format('Oda dolmadı (%s/%s).', v_n, v_room.capacity));
  end if;
  if exists (select 1 from public.room_players
              where room_id = p_room_id and left_at is null and not is_ready) then
    perform public._raise('NOT_ALL_READY', 'Herkes hazır değil.');
  end if;

  insert into public.room_case_queue (room_id, round_no, case_id)
  select p_room_id, (row_number() over ())::smallint, s.case_id
    from (select k.case_id from public.cases_answer_key k
           where k.is_active order by random() limit v_room.round_count) s;
  get diagnostics v_n = row_count;
  if v_n < v_room.round_count then perform public._raise('NOT_ENOUGH_CASES'); end if;

  update public.room_players
     set played = true,
         hp = case when v_room.format = 'hp' then public._cfg('hp_start')::integer end
   where room_id = p_room_id and left_at is null;

  if v_room.format = 'bracket' then
    with seeded as (
      select p.user_id,
             row_number() over (
               order by case when v_room.bracket_seeding = 'ranked' then pr.ranked_points else 0 end desc,
                        random()) as seed
        from public.room_players p
        join public.profiles pr on pr.id = p.user_id
       where p.room_id = p_room_id and p.left_at is null
    ),
    layout as (
      select t.seed, t.pos
        from unnest(case v_room.capacity when 4 then array[1,4,2,3]
                                         else array[1,8,4,5,3,6,2,7] end)
             with ordinality as t(seed, pos)
    )
    insert into public.match_pairings (room_id, bracket_round, slot, player_a, player_b, seed_a, seed_b)
    select p_room_id, 1, ((l.pos - 1) / 2)::smallint,
           (array_agg(s.user_id order by l.pos))[1], (array_agg(s.user_id order by l.pos))[2],
           (array_agg(s.seed order by l.pos))[1], (array_agg(s.seed order by l.pos))[2]
      from layout l join seeded s on s.seed = l.seed
     group by (l.pos - 1) / 2;
  end if;

  update public.rooms set started_at = now() where id = p_room_id;
  perform public._start_round(p_room_id, 1::smallint);

  return public._room_brief(p_room_id);
end $$;

create or replace function public._room_brief(p_room_id uuid)
returns jsonb
language sql stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'server_time', now(),
    'room_id', r.id,
    'status', r.status,
    'current_round', r.current_round,
    'round_count', r.round_count,
    'next_round_at', r.next_round_at,
    'round', (select jsonb_build_object('round_no', rr.round_no, 'case_id', rr.case_id,
                                        'starts_at', rr.starts_at, 'deadline_at', rr.deadline_at,
                                        'closed_at', rr.closed_at)
                from public.room_rounds rr
               where rr.room_id = r.id and rr.round_no = r.current_round))
  from public.rooms r where r.id = p_room_id
$$;

-- 8.4 Tahmin
create or replace function public.submit_guess(p_room_id uuid, p_round_no integer, p_item_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_room public.rooms;
  v_round public.room_rounds;
  v_rp public.round_players;
  v_key public.cases_answer_key;
  v_kind public.answer_kind;
  v_correct_id text;
  v_item_group text;
  v_correct_group text;
  v_is_correct boolean;
  v_same_group boolean;
  v_elapsed integer;
  v_max integer := public._cfg('max_guesses_per_stage')::integer;
  v_stage_done boolean := false;
  v_finished boolean := false;
  v_won boolean := false;
  v_points integer := 0;
  v_base_avg integer;
  v_item text := btrim(coalesce(p_item_id, ''));
  v_guess_no integer;
  v_guessed_stage integer;
begin
  select * into v_room from public.rooms where id = p_room_id for update;
  if not found then perform public._raise('ROOM_NOT_FOUND'); end if;
  if not exists (select 1 from public.room_players where room_id = p_room_id and user_id = v_uid) then
    perform public._raise('NOT_MEMBER');
  end if;
  if v_room.status = 'lobby' then perform public._raise('NOT_STARTED'); end if;
  if v_room.status <> 'in_round' or p_round_no is distinct from v_room.current_round then
    perform public._raise('ROUND_CLOSED');
  end if;

  select * into v_round from public.room_rounds
   where room_id = p_room_id and round_no = v_room.current_round;
  if v_round.closed_at is not null then perform public._raise('ROUND_CLOSED'); end if;
  if now() < v_round.starts_at then perform public._raise('ROUND_NOT_STARTED'); end if;
  if now() >= v_round.deadline_at then
    perform public._raise('ROUND_CLOSED', 'Süre doldu; advance_if_due çağırın.');
  end if;

  select * into v_rp from public.round_players
   where room_id = p_room_id and round_no = v_round.round_no and user_id = v_uid for update;
  if not found then perform public._raise('NOT_IN_ROUND', 'Bu turda oynamıyorsun (elendin veya ayrıldın).'); end if;
  if v_rp.finished then perform public._raise('ALREADY_FINISHED'); end if;
  if v_rp.stage_guess_count >= v_max then perform public._raise('GUESS_LIMIT'); end if;

  v_kind := case v_room.target_type
              when 'combo' then (array['diagnosis', 'therapy', 'pharmacology']::public.answer_kind[])[v_rp.stage]
              else v_room.target_type::text::public.answer_kind end;

  select c.group_id into v_item_group from public.answer_catalog c
   where c.kind = v_kind and c.item_id = v_item;
  if not found then perform public._raise('UNKNOWN_ITEM', 'Seçenek listede yok.'); end if;

  if exists (select 1 from public.round_guesses g
              where g.room_id = p_room_id and g.round_no = v_round.round_no and g.user_id = v_uid
                and g.stage = v_rp.stage and g.item_id = v_item) then
    perform public._raise('DUPLICATE_GUESS', 'Bu seçeneği zaten denedin.');
  end if;

  select * into v_key from public.cases_answer_key where case_id = v_round.case_id;
  v_correct_id := case v_kind when 'diagnosis' then v_key.diagnosis_id
                              when 'therapy' then v_key.therapy_id
                              else v_key.pharmacology_id end;
  select c.group_id into v_correct_group from public.answer_catalog c
   where c.kind = v_kind and c.item_id = v_correct_id;

  v_is_correct := v_item = v_correct_id;
  v_same_group := not v_is_correct and v_item_group is not null and v_item_group = v_correct_group;
  v_elapsed := greatest(0, floor(extract(epoch from now() - v_round.starts_at))::integer);

  insert into public.round_guesses (room_id, round_no, user_id, stage, guess_no, item_id, is_correct, same_group)
  values (p_room_id, v_round.round_no, v_uid, v_rp.stage, v_rp.stage_guess_count + 1, v_item, v_is_correct, v_same_group);

  v_guess_no := v_rp.stage_guess_count + 1;
  v_guessed_stage := v_rp.stage;
  v_rp.stage_guess_count := v_rp.stage_guess_count + 1;
  v_rp.guess_count := v_rp.guess_count + 1;

  if v_is_correct and v_room.target_type = 'combo' and v_rp.stage < 3 then
    v_stage_done := true;
    v_rp.stage := v_rp.stage + 1;
    v_rp.stage_guess_count := 0;
  elsif v_is_correct then
    v_stage_done := true;
    v_finished := true;
    v_won := true;
    if v_room.target_type = 'combo' then
      -- Kombo: üç aşamanın taban puanlarının ortalaması + hız bonusu
      select round(avg(public._base_points(s.n)))::integer into v_base_avg
        from (select count(*)::integer as n from public.round_guesses g
               where g.room_id = p_room_id and g.round_no = v_round.round_no and g.user_id = v_uid
               group by g.stage) s;
      v_points := v_base_avg + public._speed_bonus(v_elapsed);
    else
      v_points := public._case_points(true, v_rp.stage_guess_count, v_elapsed);
    end if;
  elsif v_rp.stage_guess_count >= v_max then
    v_finished := true;
  end if;

  update public.round_players
     set stage = v_rp.stage,
         stage_guess_count = v_rp.stage_guess_count,
         guess_count = v_rp.guess_count,
         finished = v_finished,
         won = v_won,
         points = v_points,
         elapsed_sec = case when v_finished then v_elapsed end,
         finish_reason = case when v_finished then
                           case when v_won then 'solved'::public.finish_reason else 'failed'::public.finish_reason end end,
         finished_at = case when v_finished then now() end
   where room_id = p_room_id and round_no = v_round.round_no and user_id = v_uid;

  if v_finished and v_points > 0 then
    update public.room_players set total_score = total_score + v_points
     where room_id = p_room_id and user_id = v_uid;
  end if;

  perform public._touch_heartbeat(p_room_id, v_uid);
  perform public._progress_room(p_room_id);

  return jsonb_build_object(
    'round_no', v_round.round_no,
    'stage', v_guessed_stage,
    'next_stage', case when v_stage_done and not v_finished then v_rp.stage end,
    'guess_no', v_guess_no,
    'guesses_left', case when v_finished then 0 else v_max - v_rp.stage_guess_count end,
    'is_correct', v_is_correct,
    'same_group', v_same_group,
    'stage_completed', v_stage_done,
    'finished', v_finished,
    'won', v_won,
    'points', v_points,
    'elapsed_sec', v_elapsed,
    'answer', case when v_finished then jsonb_build_object(
                'diagnosis_id', v_key.diagnosis_id, 'therapy_id', v_key.therapy_id,
                'pharmacology_id', v_key.pharmacology_id) end,
    'room', public._room_brief(p_room_id));
end $$;

-- Pes et (giveUp)
create or replace function public.forfeit_round(p_room_id uuid, p_round_no integer)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_room public.rooms;
  v_round public.room_rounds;
  v_key public.cases_answer_key;
  v_n integer;
begin
  select * into v_room from public.rooms where id = p_room_id for update;
  if not found then perform public._raise('ROOM_NOT_FOUND'); end if;
  if not exists (select 1 from public.room_players where room_id = p_room_id and user_id = v_uid) then
    perform public._raise('NOT_MEMBER');
  end if;
  if v_room.status <> 'in_round' or p_round_no is distinct from v_room.current_round then
    perform public._raise('ROUND_CLOSED');
  end if;
  select * into v_round from public.room_rounds where room_id = p_room_id and round_no = v_room.current_round;
  if now() < v_round.starts_at then perform public._raise('ROUND_NOT_STARTED'); end if;

  update public.round_players
     set finished = true, won = false, points = 0, finished_at = now(), finish_reason = 'gave_up',
         elapsed_sec = least(v_room.round_time_limit_sec,
                             greatest(0, floor(extract(epoch from now() - v_round.starts_at))::integer))
   where room_id = p_room_id and round_no = v_round.round_no and user_id = v_uid and not finished;
  get diagnostics v_n = row_count;
  if v_n = 0 then perform public._raise('ALREADY_FINISHED'); end if;

  select * into v_key from public.cases_answer_key where case_id = v_round.case_id;
  perform public._touch_heartbeat(p_room_id, v_uid);
  perform public._progress_room(p_room_id);
  return jsonb_build_object(
    'finished', true, 'won', false, 'points', 0,
    'answer', jsonb_build_object('diagnosis_id', v_key.diagnosis_id, 'therapy_id', v_key.therapy_id,
                                 'pharmacology_id', v_key.pharmacology_id),
    'room', public._room_brief(p_room_id));
end $$;

-- 8.5 Kalp atışı ve zaman geçişleri
create or replace function public.heartbeat(p_room_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare v_uid uuid := public._uid();
begin
  if not exists (select 1 from public.room_players
                  where room_id = p_room_id and user_id = v_uid and left_at is null) then
    perform public._raise('NOT_MEMBER');
  end if;
  perform 1 from public.rooms where id = p_room_id for update;
  perform public._touch_heartbeat(p_room_id, v_uid);
  perform public._progress_room(p_room_id);
  return public._room_brief(p_room_id);
end $$;

create or replace function public.advance_if_due(p_room_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare v_uid uuid := public._uid();
begin
  if not exists (select 1 from public.room_players where room_id = p_room_id and user_id = v_uid) then
    perform public._raise('NOT_MEMBER');
  end if;
  perform 1 from public.rooms where id = p_room_id for update;
  perform public._progress_room(p_room_id);
  return public._room_brief(p_room_id);
end $$;

-- 8.6 Davet
create or replace function public.invite_friend(p_room_id uuid, p_friend_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_room public.rooms;
  v_inv public.room_invites;
begin
  select * into v_room from public.rooms where id = p_room_id for update;
  if not found then perform public._raise('ROOM_NOT_FOUND'); end if;
  if not exists (select 1 from public.room_players
                  where room_id = p_room_id and user_id = v_uid and left_at is null) then
    perform public._raise('NOT_MEMBER');
  end if;
  if v_room.status <> 'lobby' then perform public._raise('ALREADY_STARTED'); end if;
  if v_room.player_count >= v_room.capacity then perform public._raise('ROOM_FULL'); end if;
  if not public._is_friend(v_uid, p_friend_id) then perform public._raise('NOT_FRIENDS'); end if;
  if exists (select 1 from public.room_players
              where room_id = p_room_id and user_id = p_friend_id and left_at is null) then
    perform public._raise('ALREADY_IN_ROOM');
  end if;

  update public.room_invites set status = 'expired'
   where room_id = p_room_id and invitee_id = p_friend_id and status = 'pending';
  insert into public.room_invites (room_id, room_code, inviter_id, invitee_id, expires_at)
  values (p_room_id, v_room.code, v_uid, p_friend_id,
          now() + (public._cfg('invite_ttl_minutes')::float8 * interval '1 minute'))
  returning * into v_inv;
  return to_jsonb(v_inv);
end $$;

create or replace function public.respond_room_invite(p_invite_id uuid, p_accept boolean)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_inv public.room_invites;
begin
  select * into v_inv from public.room_invites where id = p_invite_id for update;
  if not found or v_inv.invitee_id <> v_uid or v_inv.status <> 'pending' then
    perform public._raise('INVITE_NOT_FOUND');
  end if;
  if v_inv.expires_at <= now() then
    update public.room_invites set status = 'expired' where id = p_invite_id;
    return jsonb_build_object('ok', false, 'error', 'INVITE_EXPIRED');
  end if;
  if not p_accept then
    update public.room_invites set status = 'declined', responded_at = now() where id = p_invite_id;
    return jsonb_build_object('ok', true, 'status', 'declined');
  end if;
  perform public._require_player(v_uid);
  perform public._leave_other_rooms(v_uid, v_inv.room_id);
  return jsonb_build_object('ok', true, 'status', 'accepted',
                            'room', public._join_room_locked(v_inv.room_id, v_uid));
end $$;

-- 8.7 Oda anlık görüntüsü (yeniden bağlanma / ilk yükleme)
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
                   'user_id', p.user_id, 'username', pr.username, 'display_name', pr.display_name,
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

-- 8.8 Yerel ilerleme aktarımı (bir kez; RP aktarılamaz)
create or replace function public._json_int(p_j jsonb, p_key text)
returns integer
language plpgsql immutable
set search_path = ''
as $$
declare v jsonb := p_j -> p_key;
begin
  if v is null or jsonb_typeof(v) <> 'number' then return null; end if;
  if (v #>> '{}')::numeric <> trunc((v #>> '{}')::numeric) then return null; end if;
  if abs((v #>> '{}')::numeric) > 1000000 then return null; end if;
  return (v #>> '{}')::integer;
end $$;

create or replace function public.import_local_progress(p_solved_case_ids text[], p_stats jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_prog public.user_progress;
  v_played integer; v_won integer; v_cur integer; v_max integer;
  v_dist jsonb; v_dist_sum integer := 0; v_d integer;
  v_valid text[];
  v_input_count integer := coalesce(cardinality(p_solved_case_ids), 0);
begin
  if not exists (select 1 from public.profiles where id = v_uid) then
    perform public._raise('USERNAME_REQUIRED');
  end if;
  insert into public.user_progress (user_id) values (v_uid) on conflict (user_id) do nothing;
  select * into v_prog from public.user_progress where user_id = v_uid for update;
  if v_prog.imported_at is not null then perform public._raise('ALREADY_IMPORTED', 'Yerel ilerleme daha önce aktarıldı.'); end if;
  if v_input_count > 2000 then perform public._raise('INVALID_PROGRESS', 'Çok fazla vaka kimliği.'); end if;

  if p_stats is null or jsonb_typeof(p_stats) <> 'object' then
    perform public._raise('INVALID_STATS');
  end if;
  v_played := public._json_int(p_stats, 'played');
  v_won    := public._json_int(p_stats, 'won');
  v_cur    := public._json_int(p_stats, 'currentStreak');
  v_max    := public._json_int(p_stats, 'maxStreak');
  v_dist   := p_stats -> 'distribution';
  if v_played is null or v_won is null or v_cur is null or v_max is null
     or v_played < 0 or v_won < 0 or v_cur < 0 or v_max < 0
     or v_won > v_played or v_max > v_won or v_cur > v_max or v_played > 100000 then
    perform public._raise('INVALID_STATS');
  end if;
  if v_dist is null or jsonb_typeof(v_dist) <> 'object'
     or exists (select 1 from jsonb_object_keys(v_dist) k where k not in ('1','2','3','4','5','6')) then
    perform public._raise('INVALID_STATS');
  end if;
  for i in 1..6 loop
    v_d := coalesce(public._json_int(v_dist, i::text), case when v_dist ? i::text then -1 else 0 end);
    if v_d < 0 then perform public._raise('INVALID_STATS'); end if;
    v_dist_sum := v_dist_sum + v_d;
  end loop;
  if v_dist_sum > v_won then perform public._raise('INVALID_STATS'); end if;

  select coalesce(array_agg(distinct s.id order by s.id), '{}') into v_valid
    from unnest(coalesce(p_solved_case_ids, '{}')) as s(id)
    join public.cases_answer_key k on k.case_id = s.id;

  update public.user_progress
     set solved_case_ids = v_valid,
         stats = jsonb_build_object(
           'played', v_played, 'won', v_won, 'currentStreak', v_cur, 'maxStreak', v_max,
           'distribution', jsonb_build_object(
             '1', coalesce(public._json_int(v_dist, '1'), 0), '2', coalesce(public._json_int(v_dist, '2'), 0),
             '3', coalesce(public._json_int(v_dist, '3'), 0), '4', coalesce(public._json_int(v_dist, '4'), 0),
             '5', coalesce(public._json_int(v_dist, '5'), 0), '6', coalesce(public._json_int(v_dist, '6'), 0))),
         imported_at = now(), updated_at = now()
   where user_id = v_uid;

  return jsonb_build_object('ok', true, 'imported_case_count', cardinality(v_valid),
                            'ignored_case_count', v_input_count - cardinality(v_valid));
end $$;

-- -----------------------------------------------------------------------------
-- 9. Row Level Security
-- -----------------------------------------------------------------------------
alter table public.game_config      enable row level security;
alter table public.profiles         enable row level security;
alter table public.friendships      enable row level security;
alter table public.cases_answer_key enable row level security;
alter table public.answer_catalog   enable row level security;
alter table public.rooms            enable row level security;
alter table public.room_players     enable row level security;
alter table public.room_heartbeats  enable row level security;
alter table public.room_case_queue  enable row level security;
alter table public.room_rounds      enable row level security;
alter table public.round_players    enable row level security;
alter table public.round_guesses    enable row level security;
alter table public.match_pairings   enable row level security;
alter table public.match_results    enable row level security;
alter table public.room_invites     enable row level security;
alter table public.user_progress    enable row level security;
alter table public.daily_challenges enable row level security;
alter table public.daily_results    enable row level security;
alter table public.solo_streaks     enable row level security;
-- cases_answer_key, answer_catalog, room_heartbeats, room_case_queue,
-- daily_challenges: bilerek POLİTİKASIZ (istemci hiç okuyamaz).

create policy game_config_read on public.game_config
  for select to authenticated using (true);

create policy profiles_read on public.profiles
  for select to authenticated using (true);
create policy profiles_update_own on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy friendships_read_own on public.friendships
  for select to authenticated using (auth.uid() in (requester_id, addressee_id));

create policy rooms_read on public.rooms
  for select to authenticated using (
    public.is_room_member(id)
    or (visibility = 'public' and status = 'lobby')
    or public.has_room_invite(id));

create policy room_players_read on public.room_players
  for select to authenticated using (public.is_room_member(room_id));

create policy room_rounds_read on public.room_rounds
  for select to authenticated using (public.is_room_member(room_id));

create policy round_players_read on public.round_players
  for select to authenticated using (public.is_room_member(room_id));

-- Tahmin içeriği: kendi tahminlerin her zaman; başkalarınınki yalnızca tur kapandıktan sonra
create policy round_guesses_read on public.round_guesses
  for select to authenticated using (
    user_id = auth.uid()
    or (public.is_room_member(room_id) and exists (
          select 1 from public.room_rounds rr
           where rr.room_id = round_guesses.room_id and rr.round_no = round_guesses.round_no
             and rr.closed_at is not null)));

create policy match_pairings_read on public.match_pairings
  for select to authenticated using (public.is_room_member(room_id));

create policy match_results_read on public.match_results
  for select to authenticated using (user_id = auth.uid() or public.is_room_member(room_id));

create policy room_invites_read_own on public.room_invites
  for select to authenticated using (auth.uid() in (inviter_id, invitee_id));

create policy user_progress_read_own on public.user_progress
  for select to authenticated using (user_id = auth.uid());

create policy daily_results_read on public.daily_results
  for select to authenticated using (true);

create policy solo_streaks_read on public.solo_streaks
  for select to authenticated using (true);

-- -----------------------------------------------------------------------------
-- 10. Yetkiler: önce her şeyi geri al, sonra yalnızca gerekenleri ver
-- -----------------------------------------------------------------------------
revoke all on all tables    in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke execute on all functions in schema public from public, anon, authenticated;

grant select on
  public.game_config, public.profiles, public.friendships, public.rooms, public.room_players,
  public.room_rounds, public.round_players, public.round_guesses, public.match_pairings,
  public.match_results, public.room_invites, public.user_progress, public.daily_results,
  public.solo_streaks, public.leaderboard, public.daily_leaderboard
  to authenticated;

grant update (display_name, avatar) on public.profiles to authenticated;

-- RLS politikalarının çağırdığı yardımcılar
grant execute on function public.is_room_member(uuid)               to authenticated;
grant execute on function public.has_room_invite(uuid)              to authenticated;
grant execute on function public.is_friend(uuid)                    to authenticated;
grant execute on function public.can_use_realtime_topic(text, boolean) to authenticated;

-- İstemci RPC'leri
grant execute on function public.set_username(text)                        to authenticated;
grant execute on function public.send_friend_request(text)                 to authenticated;
grant execute on function public.respond_friend_request(uuid, boolean)     to authenticated;
grant execute on function public.remove_friend(uuid)                       to authenticated;
grant execute on function public.create_room(text, text, text, integer, integer, text, integer, text) to authenticated;
grant execute on function public.join_room(text)                           to authenticated;
grant execute on function public.leave_room(uuid)                          to authenticated;
grant execute on function public.set_ready(uuid, boolean)                  to authenticated;
grant execute on function public.start_match(uuid)                         to authenticated;
grant execute on function public.submit_guess(uuid, integer, text)         to authenticated;
grant execute on function public.forfeit_round(uuid, integer)              to authenticated;
grant execute on function public.heartbeat(uuid)                           to authenticated;
grant execute on function public.advance_if_due(uuid)                      to authenticated;
grant execute on function public.invite_friend(uuid, uuid)                 to authenticated;
grant execute on function public.respond_room_invite(uuid, boolean)        to authenticated;
grant execute on function public.get_room_state(uuid)                      to authenticated;
grant execute on function public.import_local_progress(text[], jsonb)      to authenticated;

-- -----------------------------------------------------------------------------
-- 11. Realtime
-- -----------------------------------------------------------------------------
-- 11.1 postgres_changes yayını (RLS'e göre süzülür)
do $$
declare t text;
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
  foreach t in array array['friendships', 'room_invites', 'rooms', 'room_players',
                           'room_rounds', 'round_players', 'match_pairings', 'match_results'] loop
    if not exists (select 1 from pg_publication_tables
                    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- 11.2 Özel kanal (Broadcast/Presence) yetkisi: realtime.messages üzerinde RLS
do $$
begin
  if to_regclass('realtime.messages') is not null then
    execute 'drop policy if exists psikovaka_channel_read on realtime.messages';
    execute 'drop policy if exists psikovaka_channel_write on realtime.messages';
    execute $p$create policy psikovaka_channel_read on realtime.messages
               for select to authenticated
               using (public.can_use_realtime_topic(realtime.topic(), false))$p$;
    execute $p$create policy psikovaka_channel_write on realtime.messages
               for insert to authenticated
               with check (public.can_use_realtime_topic(realtime.topic(), true))$p$;
  else
    raise notice 'realtime.messages bulunamadı; kanal politikaları atlandı.';
  end if;
end $$;

commit;
