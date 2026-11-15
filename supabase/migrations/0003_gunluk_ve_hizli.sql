-- =============================================================================
-- PsikoVaka — 0003: günlük vaka + seriler, hızlı eşleşme, RP v2 (ajan N, 2026-11-15)
-- =============================================================================
-- Ek ve TEKRAR ÇALIŞTIRILABİLİR (idempotent) migration. 0001 ve 0002'den SONRA.
-- Sözleşme: supabase/TASARIM.md §13. Normalde GitHub Actions (supabase-migrasyon.yml)
-- bunu kendisi uygular; elle çalıştırmak da güvenlidir (ikinci çalıştırma hiçbir şeyi değiştirmez).
--
-- Ne ekler / değiştirir:
--   * Günlük vaka: daily_attempts, daily_guesses (politikasız), get_daily_challenge (anon da),
--     daily_begin, daily_submit_guess, daily_give_up, get_daily_leaderboard, get_my_streaks.
--     Günlük oyun RP VERMEZ.
--   * Hızlı eşleşme: rooms.is_quick, rooms.close_reason, quick_match; hızlı oda dolunca
--     otomatik başlar (start_match gövdesi _start_match_locked'a taşındı); yalnız bekleyen
--     oyuncu quick_wait_timeout_sec sonra QUICK_TIMEOUT alır (heartbeat / advance_if_due).
--   * RP v2: tur başına +10..+1 / −10, küçük sıralama primi, match_results.rp_breakdown,
--     get_my_rp_history; yeni hesaplar 0 RP ile başlar.
-- Kurallar 0001 ile aynı: security definer + set search_path = '', şemalı adlar, sabit
-- hata kodları, yeni nesnelerden yetki önce geri alınır sonra yalnızca gerekene verilir.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- 1. Ayarlar (var olan değerlere dokunulmaz; rp_default yalnızca 250 ise 0 yapılır)
-- -----------------------------------------------------------------------------
insert into public.game_config (key, value, note) values
  ('quick_wait_timeout_sec', 120, 'Hızlı eşleşmede tek başına bekleyen oyuncunun odası bu kadar saniye sonra kapanır'),
  ('quick_round_count',      3,   'Hızlı eşleşme maçlarının tur sayısı'),
  ('daily_no_repeat_days',   60,  'Günlük vaka seçerken bu kadar gün içinde aynı hedefte kullanılan vakalar atlanır'),
  ('rp_round_g1',            10,  'RP v2: turu 1. tahminde çözme'),
  ('rp_round_g2',            8,   'RP v2: 2. tahminde'),
  ('rp_round_g3',            6,   'RP v2: 3. tahminde'),
  ('rp_round_g4',            4,   'RP v2: 4. tahminde'),
  ('rp_round_g5',            2,   'RP v2: 5. tahminde'),
  ('rp_round_g6',            1,   'RP v2: 6. tahminde'),
  ('rp_round_fail',          -10, 'RP v2: turu çözememe (yanlış, pes, süre, kopma, maçtan çıkma)'),
  ('rp_place_duel_1',        10,  'RP v2 primi: düello galibiyeti'),
  ('rp_place_ffa_1',         15,  'RP v2 primi: FFA birinciliği'),
  ('rp_place_ffa_2',         5,   'RP v2 primi: FFA ikinciliği (en az 3 oyuncu)'),
  ('rp_place_tournament_1',  25,  'RP v2 primi: turnuva birinciliği'),
  ('rp_place_tournament_2',  10,  'RP v2 primi: turnuva ikinciliği')
on conflict (key) do nothing;

update public.game_config
   set value = 0, note = 'Yeni hesabın RP değeri (RP v2: 0; profiles varsayılanı da 0)'
 where key = 'rp_default' and value = 250;

-- -----------------------------------------------------------------------------
-- 2. Sütunlar, kısıtlar, indeksler
-- -----------------------------------------------------------------------------
alter table public.rooms         add column if not exists is_quick boolean not null default false;
alter table public.rooms         add column if not exists close_reason text;
alter table public.solo_streaks  add column if not exists last_day date;
alter table public.match_results add column if not exists rp_breakdown jsonb;
alter table public.profiles      alter column ranked_points set default 0;

do $$
begin
  if not exists (select 1 from pg_constraint
                  where conname = 'rooms_close_reason' and conrelid = 'public.rooms'::regclass) then
    alter table public.rooms add constraint rooms_close_reason
      check (close_reason is null or close_reason in ('quick_timeout'));
  end if;
end $$;

create index if not exists rooms_quick_lobby_idx on public.rooms (mode, target_type, created_at)
  where is_quick and status = 'lobby';

-- -----------------------------------------------------------------------------
-- 3. Günlük deneme tabloları (istemci okuyamaz: RLS açık, politika yok, yetki yok)
-- -----------------------------------------------------------------------------
create table if not exists public.daily_attempts (
  user_id           uuid not null references public.profiles(id) on delete cascade,
  challenge_date    date not null,
  target_type       public.target_type not null,
  case_id           text not null references public.cases_answer_key(case_id),
  started_at        timestamptz not null default now(),
  stage             smallint not null default 1,
  stage_guess_count smallint not null default 0,
  guess_count       smallint not null default 0,
  finished          boolean not null default false,
  won               boolean,
  points            integer,
  elapsed_sec       integer,
  finish_reason     public.finish_reason,
  finished_at       timestamptz,
  primary key (user_id, challenge_date, target_type),
  constraint daily_attempts_stage check (stage between 1 and 3),
  constraint daily_attempts_counts check (stage_guess_count between 0 and 6 and guess_count between 0 and 18)
);

create table if not exists public.daily_guesses (
  id             bigint generated always as identity primary key,
  user_id        uuid not null,
  challenge_date date not null,
  target_type    public.target_type not null,
  stage          smallint not null,
  guess_no       smallint not null,
  item_id        text not null,
  is_correct     boolean not null,
  same_group     boolean not null default false,
  created_at     timestamptz not null default now(),
  foreign key (user_id, challenge_date, target_type)
    references public.daily_attempts(user_id, challenge_date, target_type) on delete cascade,
  unique (user_id, challenge_date, target_type, stage, item_id)
);

alter table public.daily_attempts enable row level security;
alter table public.daily_guesses  enable row level security;

create index if not exists daily_challenges_target_idx on public.daily_challenges (target_type, challenge_date);

-- Günlük sıralama görünümü: yeni sıralama (sütunlar 0001 ile aynı)
create or replace view public.daily_leaderboard with (security_invoker = true) as
  select d.challenge_date, d.target_type, d.user_id, p.username, p.display_name, p.avatar,
         d.won, d.guess_count, d.points, d.elapsed_sec,
         rank() over (partition by d.challenge_date, d.target_type
                      order by d.won desc, d.points desc, d.guess_count asc, d.elapsed_sec asc,
                               d.completed_at asc) as position
    from public.daily_results d
    join public.profiles p on p.id = d.user_id;

-- -----------------------------------------------------------------------------
-- 4. Günlük: iç yardımcılar
-- -----------------------------------------------------------------------------

-- "Bugün" = İstanbul takvim günü. Test kancası: psikovaka.test_today yalnızca oturum
-- kullanıcısı süper kullanıcıysa dikkate alınır (PostgREST'in authenticator rolü değildir).
create or replace function public._daily_today()
returns date
language plpgsql stable
security definer
set search_path = ''
as $$
declare v text := current_setting('psikovaka.test_today', true);
begin
  if v is not null and v <> ''
     and exists (select 1 from pg_catalog.pg_roles where rolname = session_user and rolsuper) then
    return v::date;
  end if;
  return (now() at time zone 'Europe/Istanbul')::date;
end $$;

create or replace function public._parse_target(p_target text)
returns public.target_type
language plpgsql immutable
set search_path = ''
as $$
begin
  if coalesce(p_target, '') not in ('diagnosis', 'therapy', 'pharmacology', 'combo') then
    perform public._raise('INVALID_TARGET', 'Hedef diagnosis, therapy, pharmacology veya combo olmalı.');
  end if;
  return p_target::public.target_type;
end $$;

create or replace function public._target_kind(p_target public.target_type, p_stage integer)
returns public.answer_kind
language sql immutable
set search_path = ''
as $$
  select case p_target
           when 'combo' then (array['diagnosis', 'therapy', 'pharmacology']::public.answer_kind[])[p_stage]
           else p_target::text::public.answer_kind end
$$;

create or replace function public._answer_json(p_case_id text)
returns jsonb
language sql stable
security definer
set search_path = ''
as $$
  select jsonb_build_object('diagnosis_id', k.diagnosis_id, 'therapy_id', k.therapy_id,
                            'pharmacology_id', k.pharmacology_id)
    from public.cases_answer_key k where k.case_id = p_case_id
$$;

-- (gün, hedef) vakası: yoksa seçer ve bir kez yazar. Eşzamanlı çağrılarda herkes aynı satırı alır.
create or replace function public._daily_case(p_day date, p_target public.target_type)
returns text
language plpgsql volatile
security definer
set search_path = ''
as $$
declare
  v_case text;
  v_days integer := public._cfg('daily_no_repeat_days')::integer;
begin
  select d.case_id into v_case from public.daily_challenges d
   where d.challenge_date = p_day and d.target_type = p_target;
  if v_case is not null then return v_case; end if;

  select k.case_id into v_case
    from public.cases_answer_key k
   where k.is_active
     and not exists (select 1 from public.daily_challenges d
                      where d.target_type = p_target and d.case_id = k.case_id
                        and d.challenge_date >= p_day - v_days and d.challenge_date < p_day)
   order by random() limit 1;
  if v_case is null then
    select k.case_id into v_case from public.cases_answer_key k
     where k.is_active order by random() limit 1;
  end if;
  if v_case is null then perform public._raise('NOT_ENOUGH_CASES'); end if;

  insert into public.daily_challenges (challenge_date, target_type, case_id)
  values (p_day, p_target, v_case)
  on conflict (challenge_date, target_type) do nothing;

  select d.case_id into v_case from public.daily_challenges d
   where d.challenge_date = p_day and d.target_type = p_target;
  return v_case;
end $$;

create or replace function public._daily_state(p_uid uuid, p_day date, p_target public.target_type, p_case text)
returns jsonb
language plpgsql stable
security definer
set search_path = ''
as $$
declare
  a public.daily_attempts;
  v_found boolean := false;
begin
  if p_uid is not null then
    select * into a from public.daily_attempts
     where user_id = p_uid and challenge_date = p_day and target_type = p_target;
    v_found := found;
  end if;
  return jsonb_build_object(
    'server_time', now(),
    'day', p_day,
    'target', p_target,
    'case_id', p_case,
    'status', case when not v_found then 'not_started' when a.finished then 'finished' else 'in_progress' end,
    'guesses_used', case when v_found then a.guess_count else 0 end,
    'won', case when v_found and a.finished then a.won end,
    'points', case when v_found and a.finished then a.points end,
    'time_sec', case when v_found and a.finished then a.elapsed_sec end,
    'stage', case when v_found then a.stage else 1 end);
end $$;

-- Biten denemeyi daily_results'a yazar ve seriyi günceller (deneme satırı kilitli çağrılır)
create or replace function public._daily_record(p_uid uuid, p_day date, p_target public.target_type)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  a public.daily_attempts;
  s public.solo_streaks;
  v_cur integer;
  v_n integer;
begin
  select * into a from public.daily_attempts
   where user_id = p_uid and challenge_date = p_day and target_type = p_target;
  if not found or not a.finished then return; end if;

  insert into public.daily_results (user_id, challenge_date, target_type, case_id, won, guess_count,
                                    points, elapsed_sec, completed_at)
  values (p_uid, p_day, p_target, a.case_id, a.won, a.guess_count, a.points, a.elapsed_sec, a.finished_at)
  on conflict (user_id, challenge_date, target_type) do nothing;
  get diagnostics v_n = row_count;
  if v_n = 0 then return; end if;   -- zaten kaydedilmiş: seriye ikinci kez dokunma

  insert into public.solo_streaks (user_id, target_type) values (p_uid, p_target)
  on conflict (user_id, target_type) do nothing;
  select * into s from public.solo_streaks
   where user_id = p_uid and target_type = p_target for update;

  if s.last_day is not null and p_day <= s.last_day then
    return;                          -- sıra dışı (olmamalı): seriye dokunma
  elsif a.won then
    v_cur := case when s.last_day = p_day - 1 then s.current_streak + 1 else 1 end;
    update public.solo_streaks
       set current_streak = v_cur, best_streak = greatest(best_streak, v_cur),
           last_day = p_day, updated_at = now()
     where user_id = p_uid and target_type = p_target;
  else
    update public.solo_streaks
       set current_streak = 0, last_day = p_day, updated_at = now()
     where user_id = p_uid and target_type = p_target;
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- 5. Günlük: istemci RPC'leri
-- -----------------------------------------------------------------------------
create or replace function public.get_daily_challenge(p_target text)
returns jsonb
language plpgsql volatile
security definer
set search_path = ''
as $$
declare
  v_t public.target_type := public._parse_target(p_target);
  v_day date := public._daily_today();
  v_case text := public._daily_case(v_day, v_t);
begin
  return public._daily_state(auth.uid(), v_day, v_t, v_case);
end $$;

create or replace function public.daily_begin(p_target text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_t public.target_type;
  v_day date;
  v_case text;
  a public.daily_attempts;
  v_max integer := public._cfg('max_guesses_per_stage')::integer;
begin
  perform public._require_player(v_uid);
  v_t := public._parse_target(p_target);
  v_day := public._daily_today();
  v_case := public._daily_case(v_day, v_t);

  insert into public.daily_attempts (user_id, challenge_date, target_type, case_id)
  values (v_uid, v_day, v_t, v_case)
  on conflict (user_id, challenge_date, target_type) do nothing;
  select * into a from public.daily_attempts
   where user_id = v_uid and challenge_date = v_day and target_type = v_t;

  return public._daily_state(v_uid, v_day, v_t, a.case_id) || jsonb_build_object(
    'started_at', a.started_at,
    'guesses_left', case when a.finished then 0 else v_max - a.stage_guess_count end,
    'guesses', (select coalesce(jsonb_agg(jsonb_build_object(
                    'stage', g.stage, 'guess_no', g.guess_no, 'item_id', g.item_id,
                    'correct', g.is_correct, 'same_group', g.same_group) order by g.id), '[]'::jsonb)
                  from public.daily_guesses g
                 where g.user_id = v_uid and g.challenge_date = v_day and g.target_type = v_t),
    'answer', case when a.finished then public._answer_json(a.case_id) end);
end $$;

create or replace function public.daily_submit_guess(p_target text, p_item_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_t public.target_type;
  v_day date;
  a public.daily_attempts;
  v_key public.cases_answer_key;
  v_kind public.answer_kind;
  v_item text := btrim(coalesce(p_item_id, ''));
  v_item_group text;
  v_correct_id text;
  v_correct_group text;
  v_is_correct boolean;
  v_same_group boolean;
  v_elapsed integer;
  v_max integer := public._cfg('max_guesses_per_stage')::integer;
  v_stage_done boolean := false;
  v_finished boolean := false;
  v_won boolean := false;
  v_points integer := 0;
  v_guess_no integer;
  v_guessed_stage integer;
begin
  perform public._require_player(v_uid);
  v_t := public._parse_target(p_target);
  v_day := public._daily_today();

  select * into a from public.daily_attempts
   where user_id = v_uid and challenge_date = v_day and target_type = v_t for update;
  if not found then perform public._raise('DAILY_NOT_STARTED', 'Önce daily_begin çağrılmalı.'); end if;
  if a.finished then perform public._raise('DAILY_ALREADY_FINISHED', 'Bugünün vakasını bitirdin.'); end if;
  if a.stage_guess_count >= v_max then perform public._raise('GUESS_LIMIT'); end if;

  v_kind := public._target_kind(v_t, a.stage);
  select c.group_id into v_item_group from public.answer_catalog c
   where c.kind = v_kind and c.item_id = v_item;
  if not found then perform public._raise('UNKNOWN_ITEM', 'Seçenek listede yok.'); end if;
  if exists (select 1 from public.daily_guesses g
              where g.user_id = v_uid and g.challenge_date = v_day and g.target_type = v_t
                and g.stage = a.stage and g.item_id = v_item) then
    perform public._raise('DUPLICATE_GUESS', 'Bu seçeneği zaten denedin.');
  end if;

  select * into v_key from public.cases_answer_key where case_id = a.case_id;
  v_correct_id := case v_kind when 'diagnosis' then v_key.diagnosis_id
                              when 'therapy' then v_key.therapy_id
                              else v_key.pharmacology_id end;
  select c.group_id into v_correct_group from public.answer_catalog c
   where c.kind = v_kind and c.item_id = v_correct_id;
  v_is_correct := v_item = v_correct_id;
  v_same_group := not v_is_correct and v_item_group is not null and v_item_group = v_correct_group;
  v_elapsed := greatest(0, floor(extract(epoch from now() - a.started_at))::integer);

  v_guess_no := a.stage_guess_count + 1;
  v_guessed_stage := a.stage;
  insert into public.daily_guesses (user_id, challenge_date, target_type, stage, guess_no, item_id, is_correct, same_group)
  values (v_uid, v_day, v_t, a.stage, v_guess_no, v_item, v_is_correct, v_same_group);

  a.stage_guess_count := a.stage_guess_count + 1;
  a.guess_count := a.guess_count + 1;

  if v_is_correct and v_t = 'combo' and a.stage < 3 then
    v_stage_done := true;
    a.stage := a.stage + 1;
    a.stage_guess_count := 0;
  elsif v_is_correct then
    v_stage_done := true;
    v_finished := true;
    v_won := true;
    if v_t = 'combo' then
      select round(avg(public._base_points(s.n)))::integer + public._speed_bonus(v_elapsed) into v_points
        from (select count(*)::integer as n from public.daily_guesses g
               where g.user_id = v_uid and g.challenge_date = v_day and g.target_type = v_t
               group by g.stage) s;
    else
      v_points := public._case_points(true, a.stage_guess_count, v_elapsed);
    end if;
  elsif a.stage_guess_count >= v_max then
    v_finished := true;
  end if;

  update public.daily_attempts
     set stage = a.stage, stage_guess_count = a.stage_guess_count, guess_count = a.guess_count,
         finished = v_finished,
         won = case when v_finished then v_won end,
         points = case when v_finished then v_points end,
         elapsed_sec = case when v_finished then v_elapsed end,
         finish_reason = case when v_finished then
                           case when v_won then 'solved'::public.finish_reason else 'failed'::public.finish_reason end end,
         finished_at = case when v_finished then now() end
   where user_id = v_uid and challenge_date = v_day and target_type = v_t;
  if v_finished then perform public._daily_record(v_uid, v_day, v_t); end if;

  return jsonb_build_object(
    'server_time', now(),
    'day', v_day,
    'target', v_t,
    'case_id', a.case_id,
    'correct', v_is_correct,
    'same_group', v_same_group,
    'stage', v_guessed_stage,
    'next_stage', case when v_stage_done and not v_finished then a.stage end,
    'stage_completed', v_stage_done,
    'guess_no', v_guess_no,
    'guesses_used', a.guess_count,
    'guesses_left', case when v_finished then 0 else v_max - a.stage_guess_count end,
    'finished', v_finished,
    'won', case when v_finished then v_won end,
    'points', case when v_finished then v_points end,
    'time_sec', case when v_finished then v_elapsed end,
    'answer', case when v_finished then public._answer_json(a.case_id) end);
end $$;

create or replace function public.daily_give_up(p_target text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_t public.target_type;
  v_day date;
  a public.daily_attempts;
begin
  perform public._require_player(v_uid);
  v_t := public._parse_target(p_target);
  v_day := public._daily_today();
  select * into a from public.daily_attempts
   where user_id = v_uid and challenge_date = v_day and target_type = v_t for update;
  if not found then perform public._raise('DAILY_NOT_STARTED', 'Önce daily_begin çağrılmalı.'); end if;
  if a.finished then perform public._raise('DAILY_ALREADY_FINISHED', 'Bugünün vakasını bitirdin.'); end if;

  update public.daily_attempts
     set finished = true, won = false, points = 0, finish_reason = 'gave_up', finished_at = now(),
         elapsed_sec = greatest(0, floor(extract(epoch from now() - started_at))::integer)
   where user_id = v_uid and challenge_date = v_day and target_type = v_t;
  perform public._daily_record(v_uid, v_day, v_t);
  return public._daily_state(v_uid, v_day, v_t, a.case_id)
         || jsonb_build_object('answer', public._answer_json(a.case_id));
end $$;

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
      window w as (order by d.won desc, d.points desc, d.guess_count asc, d.elapsed_sec asc,
                            d.completed_at asc, d.user_id)
    )
    select jsonb_build_object(
      'server_time', now(),
      'day', v_day,
      'target', v_t,
      'total_players', (select count(*) from ranked),
      'rows', coalesce((select jsonb_agg(r.row order by r.rnk) from ranked r where r.rnk <= v_lim), '[]'::jsonb),
      'me', (select r.row from ranked r where r.user_id = v_uid)));
end $$;

create or replace function public.get_my_streaks()
returns jsonb
language plpgsql stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_today date := public._daily_today();
begin
  return (
    select jsonb_agg(jsonb_build_object(
             'target', t.t,
             'current_streak', case when s.last_day >= v_today - 1 then s.current_streak else 0 end,
             'best_streak', coalesce(s.best_streak, 0),
             'last_day', s.last_day,
             'played_today', exists (select 1 from public.daily_results r
                                      where r.user_id = v_uid and r.challenge_date = v_today
                                        and r.target_type = t.t)) order by t.ord)
      from unnest(array['diagnosis', 'therapy', 'pharmacology', 'combo']::public.target_type[])
           with ordinality as t(t, ord)
      left join public.solo_streaks s on s.user_id = v_uid and s.target_type = t.t);
end $$;

-- -----------------------------------------------------------------------------
-- 6. Maç başlatma: start_match gövdesi iç fonksiyona taşındı (hızlı oda da kullanır)
-- -----------------------------------------------------------------------------
create or replace function public._start_match_locked(p_room_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_room public.rooms;
  v_n integer;
begin
  select * into v_room from public.rooms where id = p_room_id for update;
  if not found then perform public._raise('ROOM_NOT_FOUND'); end if;
  if v_room.status <> 'lobby' then perform public._raise('ALREADY_STARTED'); end if;

  select count(*) into v_n from public.room_players where room_id = p_room_id and left_at is null;
  if v_n < v_room.capacity then
    perform public._raise('ROOM_NOT_FULL', format('Oda dolmadı (%s/%s).', v_n, v_room.capacity));
  end if;
  if not v_room.is_quick and exists (select 1 from public.room_players
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
         is_ready = true,
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
  perform public._start_match_locked(p_room_id);
  return public._room_brief(p_room_id);
end $$;

-- Katılma (iç): 0001 ile aynı + hızlı odada katılan hazır sayılır, oda dolunca maç başlar
create or replace function public._join_room_locked(p_room_id uuid, p_uid uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_room public.rooms;
  v_rp public.room_players;
  v_n integer;
begin
  select * into v_room from public.rooms where id = p_room_id for update;
  if not found or v_room.status in ('finished', 'abandoned') then
    perform public._raise('ROOM_NOT_FOUND', 'Oda bulunamadı veya kapandı.');
  end if;

  select * into v_rp from public.room_players where room_id = p_room_id and user_id = p_uid;
  if found and v_rp.left_at is null then
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

  insert into public.room_players (room_id, user_id, is_ready) values (p_room_id, p_uid, v_room.is_quick)
  on conflict (room_id, user_id) do update
     set left_at = null, is_current = true, is_ready = excluded.is_ready, joined_at = now();
  perform public._sync_player_count(p_room_id);
  perform public._touch_heartbeat(p_room_id, p_uid);
  update public.room_invites set status = 'accepted', responded_at = now()
   where room_id = p_room_id and invitee_id = p_uid and status = 'pending';

  if v_room.is_quick then
    select count(*) into v_n from public.room_players where room_id = p_room_id and left_at is null;
    if v_n >= v_room.capacity then
      perform public._start_match_locked(p_room_id);
    end if;
  end if;

  select * into v_room from public.rooms where id = p_room_id;
  return to_jsonb(v_room);
end $$;

-- -----------------------------------------------------------------------------
-- 7. Hızlı eşleşme
-- -----------------------------------------------------------------------------

-- Hızlı oda zaman aşımı: tek kişi kaldıysa ve son üyelik değişikliğinden beri
-- quick_wait_timeout_sec geçtiyse odayı kapatır. Kapandıysa (şimdi ya da önce) true.
create or replace function public._quick_timeout_if_due(p_room_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_room public.rooms;
  v_active integer;
  v_last timestamptz;
begin
  select * into v_room from public.rooms where id = p_room_id for update;
  if not found or not v_room.is_quick then return false; end if;
  if v_room.status = 'abandoned' and v_room.close_reason = 'quick_timeout' then return true; end if;
  if v_room.status <> 'lobby' then return false; end if;

  select count(*) filter (where p.left_at is null),
         max(greatest(p.joined_at, coalesce(p.left_at, p.joined_at)))
    into v_active, v_last
    from public.room_players p where p.room_id = p_room_id;
  if v_active = 1
     and v_last < now() - (public._cfg('quick_wait_timeout_sec')::float8 * interval '1 second') then
    perform public._abandon_room(p_room_id);
    update public.rooms set close_reason = 'quick_timeout' where id = p_room_id;
    return true;
  end if;
  return false;
end $$;

create or replace function public._quick_result(p_room_id uuid, p_created boolean)
returns jsonb
language sql stable
security definer
set search_path = ''
as $$
  select jsonb_build_object('server_time', now(), 'room_id', r.id, 'code', r.code, 'created', p_created,
                            'players', r.player_count, 'capacity', r.capacity, 'status', r.status,
                            'room', to_jsonb(r))
    from public.rooms r where r.id = p_room_id
$$;

create or replace function public.quick_match(p_mode text default 'duel', p_target text default 'diagnosis')
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_t public.target_type;
  v_cap integer;
  v_rounds integer := public._cfg('quick_round_count')::integer;
  v_limit integer;
  v_cur public.rooms;
  v_id uuid;
  v_room public.rooms;
  v_attempt integer := 0;
begin
  perform public._require_player(v_uid);
  if coalesce(p_mode, '') not in ('duel', 'ffa') then
    perform public._raise('INVALID_MODE', 'Hızlı eşleşme modu duel veya ffa olmalı.');
  end if;
  v_t := public._parse_target(p_target);
  v_cap := case p_mode when 'duel' then 2 else 4 end;

  -- Aynı kullanıcının iki sekmesi ve aynı kovadaki eşzamanlı çağrılar sıraya girer
  -- (sıra hep: kullanıcı kilidi -> kova kilidi; kilitlenme döngüsü olmaz).
  perform pg_advisory_xact_lock(hashtext('psikovaka.quick_user'), hashtext(v_uid::text));
  perform pg_advisory_xact_lock(hashtext('psikovaka.quick_match'), hashtext(p_mode || ':' || v_t::text));

  select r.* into v_cur
    from public.room_players p join public.rooms r on r.id = p.room_id
   where p.user_id = v_uid and p.is_current and p.left_at is null
     and r.status in ('lobby', 'in_round', 'round_result')
   order by p.joined_at desc limit 1;
  if v_cur.id is not null then
    if v_cur.is_quick and v_cur.status = 'lobby' and v_cur.mode::text = p_mode and v_cur.target_type = v_t then
      if not public._quick_timeout_if_due(v_cur.id) then
        perform public._touch_heartbeat(v_cur.id, v_uid);
        return public._quick_result(v_cur.id, false);
      end if;
      -- kendi odası zaman aşımına uğradı: aşağıda yeniden eşleş
    else
      perform public._raise('ALREADY_IN_ROOM', v_cur.code);
    end if;
  end if;

  perform public._close_stale_rooms();

  select r.id into v_id
    from public.rooms r
   where r.is_quick and r.status = 'lobby' and r.mode::text = p_mode and r.format = 'rounds'
     and r.target_type = v_t and r.player_count > 0 and r.player_count < r.capacity
     and not exists (
           select 1 from public.room_players p
             left join public.room_heartbeats h on h.room_id = p.room_id and h.user_id = p.user_id
            where p.room_id = r.id and p.left_at is null
              and (h.last_seen_at is null
                   or h.last_seen_at < now() - (public._cfg('lobby_absent_grace_sec')::float8 * interval '1 second')))
     and not (r.player_count = 1 and
              (select max(greatest(p.joined_at, coalesce(p.left_at, p.joined_at)))
                 from public.room_players p where p.room_id = r.id)
              < now() - (public._cfg('quick_wait_timeout_sec')::float8 * interval '1 second'))
   order by r.created_at, r.id
   limit 1;

  if v_id is not null then
    perform public._join_room_locked(v_id, v_uid);
    return public._quick_result(v_id, false);
  end if;

  if v_rounds > (select count(*) from public.cases_answer_key where is_active) then
    perform public._raise('NOT_ENOUGH_CASES');
  end if;
  v_limit := case when v_t = 'combo' then public._cfg('default_combo_time_limit_sec')
                  else public._cfg('default_round_time_limit_sec') end::integer;

  loop
    begin
      insert into public.rooms (code, host_id, mode, format, target_type, visibility, capacity,
                                round_count, round_time_limit_sec, intermission_sec, player_count, is_quick)
      values (public._gen_room_code(), v_uid, p_mode::public.room_mode, 'rounds', v_t, 'private', v_cap,
              v_rounds, v_limit, public._cfg('default_intermission_sec')::integer, 1, true)
      returning * into v_room;
      exit;
    exception when unique_violation then
      v_attempt := v_attempt + 1;
      if v_attempt >= 8 then perform public._raise('CODE_GENERATION_FAILED'); end if;
    end;
  end loop;

  insert into public.room_players (room_id, user_id, is_ready) values (v_room.id, v_uid, true);
  perform public._touch_heartbeat(v_room.id, v_uid);
  return public._quick_result(v_room.id, true);
end $$;

-- Kalp atışı / zaman geçişi: 0001 ile aynı + hızlı oda zaman aşımı (veri olarak QUICK_TIMEOUT)
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
  if public._quick_timeout_if_due(p_room_id) then
    return public._room_brief(p_room_id) || jsonb_build_object('ok', false, 'error', 'QUICK_TIMEOUT');
  end if;
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
  if public._quick_timeout_if_due(p_room_id) then
    return public._room_brief(p_room_id) || jsonb_build_object('ok', false, 'error', 'QUICK_TIMEOUT');
  end if;
  return public._room_brief(p_room_id);
end $$;

-- 0002'deki update_room_settings + hızlı odada ayar değiştirilemez (QUICK_ROOM)
create or replace function public.update_room_settings(
  p_room_id uuid,
  p_target_type text default null,
  p_round_count integer default null,
  p_visibility text default null,
  p_capacity integer default null,
  p_round_time_limit_sec integer default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_room public.rooms;
  v_target text;
  v_vis text;
  v_cap integer;
  v_rounds integer;
  v_limit integer;
  v_old_default integer;
  v_changed boolean;
begin
  select * into v_room from public.rooms where id = p_room_id for update;
  if not found then perform public._raise('ROOM_NOT_FOUND'); end if;
  if not exists (select 1 from public.room_players
                  where room_id = p_room_id and user_id = v_uid and left_at is null) then
    perform public._raise('NOT_MEMBER');
  end if;
  if v_room.status <> 'lobby' then perform public._raise('ALREADY_STARTED'); end if;
  if v_room.is_quick then
    perform public._raise('QUICK_ROOM', 'Hızlı eşleşme odasının ayarları değiştirilemez.');
  end if;
  if v_room.host_id is distinct from v_uid then
    perform public._raise('NOT_HOST', 'Ayarları yalnızca oda sahibi değiştirebilir.');
  end if;

  v_target := coalesce(p_target_type, v_room.target_type::text);
  if v_target not in ('diagnosis', 'therapy', 'pharmacology', 'combo') then
    perform public._raise('INVALID_SETTINGS', 'target_type');
  end if;
  v_vis := coalesce(p_visibility, v_room.visibility::text);
  if v_vis not in ('private', 'public') then
    perform public._raise('INVALID_SETTINGS', 'visibility');
  end if;

  v_cap := coalesce(p_capacity, v_room.capacity);
  if not ((v_room.mode = 'duel' and v_cap = 2)
       or (v_room.mode = 'ffa' and v_cap between 2 and 8)
       or (v_room.mode = 'tournament' and v_cap in (4, 8))) then
    perform public._raise('INVALID_SETTINGS', 'capacity');
  end if;
  if v_cap < v_room.player_count then
    perform public._raise('INVALID_SETTINGS', 'capacity');
  end if;

  v_rounds := case v_room.format
                when 'hp' then v_room.round_count
                when 'battle' then v_cap - 1
                when 'bracket' then case v_cap when 4 then 2 else 3 end
                else coalesce(p_round_count, v_room.round_count) end;
  if v_room.format = 'rounds' and v_rounds not between 1 and 15 then
    perform public._raise('INVALID_SETTINGS', 'round_count');
  end if;
  if v_rounds > (select count(*) from public.cases_answer_key where is_active) then
    perform public._raise('NOT_ENOUGH_CASES');
  end if;

  v_old_default := case when v_room.target_type = 'combo'
                        then public._cfg('default_combo_time_limit_sec')
                        else public._cfg('default_round_time_limit_sec') end::integer;
  v_limit := coalesce(p_round_time_limit_sec,
                      case when v_room.round_time_limit_sec = v_old_default
                           then case when v_target = 'combo'
                                     then public._cfg('default_combo_time_limit_sec')
                                     else public._cfg('default_round_time_limit_sec') end::integer
                           else v_room.round_time_limit_sec end);
  if v_limit not between 30 and 900 then
    perform public._raise('INVALID_SETTINGS', 'round_time_limit_sec');
  end if;

  v_changed := v_target <> v_room.target_type::text or v_vis <> v_room.visibility::text
            or v_cap <> v_room.capacity or v_rounds <> v_room.round_count
            or v_limit <> v_room.round_time_limit_sec;

  if v_changed then
    update public.rooms
       set target_type = v_target::public.target_type,
           visibility = v_vis::public.room_visibility,
           capacity = v_cap,
           round_count = v_rounds,
           round_time_limit_sec = v_limit
     where id = p_room_id
     returning * into v_room;
    update public.room_players set is_ready = false
     where room_id = p_room_id and left_at is null and user_id <> v_uid and is_ready;
  end if;
  perform public._touch_heartbeat(p_room_id, v_uid);
  return to_jsonb(v_room) || jsonb_build_object('changed', v_changed);
end $$;

-- -----------------------------------------------------------------------------
-- 8. RP v2
-- -----------------------------------------------------------------------------

-- Turdaki sonucun "kaçıncı tahminde" karşılığı (1-6): tek hedefte tahmin sayısı;
-- komboda üç aşamanın tahmin sayılarının yuvarlanmış ortalaması.
create or replace function public._round_guess_rank(p_room_id uuid, p_round smallint, p_uid uuid)
returns integer
language sql stable
security definer
set search_path = ''
as $$
  select least(6, greatest(1,
           case when r.target_type = 'combo'
                then (select round(avg(s.n))::integer
                        from (select count(*)::integer as n from public.round_guesses g
                               where g.room_id = p_room_id and g.round_no = p_round and g.user_id = p_uid
                               group by g.stage) s)
                else (select rp.guess_count from public.round_players rp
                       where rp.room_id = p_room_id and rp.round_no = p_round and rp.user_id = p_uid)
           end))
    from public.rooms r where r.id = p_room_id
$$;

-- Maçı bitirir, sıralar, RP v2'yi dağıtır. Tekrar çağrılırsa hiçbir şey yapmaz.
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
  v_g integer[];
  v_fail integer := public._cfg('rp_round_fail')::integer;
  v_p record;
  v_r record;
  v_last integer;
  v_d integer;
  v_sum integer;
  v_neg integer;
  v_place integer;
  v_total integer;
  v_rounds jsonb;
begin
  select * into v_room from public.rooms where id = p_room_id for update;
  if not found or v_room.status in ('finished', 'abandoned', 'lobby') then
    return;
  end if;

  v_g := array[public._cfg('rp_round_g1'), public._cfg('rp_round_g2'), public._cfg('rp_round_g3'),
               public._cfg('rp_round_g4'), public._cfg('rp_round_g5'), public._cfg('rp_round_g6')]::integer[];

  select count(*) into v_closed from public.room_rounds
   where room_id = p_room_id and closed_at is not null;
  select count(*) into v_participants from public.room_players
   where room_id = p_room_id and played;

  -- Çiftçilik koruması: erken biten maçta turların yarısından azı oynandıysa
  -- odada kalanlar için maç geçersiz (0), çıkanlar yalnızca negatif kalemlerini öder.
  v_award := (not p_ended_early) or (v_closed * 2 >= v_room.round_count);

  for v_p in
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
  loop
    v_rounds := '[]'::jsonb; v_sum := 0; v_neg := 0;
    select coalesce(max(r.round_no), 0) into v_last from public.round_players r
     where r.room_id = p_room_id and r.user_id = v_p.user_id;

    for v_r in
      select x.round_no, x.outcome, x.missed from (
        select r.round_no::integer as round_no,
               case when r.won then 'g' || public._round_guess_rank(p_room_id, r.round_no, v_p.user_id)
                    when r.finish_reason = 'aborted' and v_p.left_at is null then 'void'
                    else 'fail' end as outcome,
               false as missed
          from public.round_players r
         where r.room_id = p_room_id and r.user_id = v_p.user_id
        union all
        -- maç sürerken çıkan: oynayacağı kalan turlar (bracket: yalnızca eşleşmesinin turu)
        select gs.n, 'fail', true
          from generate_series(v_last + 1, v_room.round_count) as gs(n)
         where v_p.left_at is not null
           and ((v_room.format <> 'bracket' and v_p.eliminated_round is null)
                or (v_room.format = 'bracket' and exists (
                      select 1 from public.match_pairings m
                       where m.room_id = p_room_id and m.bracket_round = gs.n
                         and v_p.user_id in (m.player_a, m.player_b))))
      ) x order by x.round_no
    loop
      v_d := case when v_r.outcome = 'void' then 0
                  when v_r.outcome = 'fail' then v_fail
                  else v_g[substr(v_r.outcome, 2)::integer] end;
      v_sum := v_sum + v_d;
      if v_d < 0 then v_neg := v_neg + v_d; end if;
      v_rounds := v_rounds || jsonb_build_array(
        jsonb_build_object('round', v_r.round_no, 'outcome', v_r.outcome, 'delta', v_d)
        || case when v_r.missed then jsonb_build_object('missed', true) else '{}'::jsonb end);
    end loop;

    v_place := 0;
    if v_p.left_at is null then
      v_place := case
        when v_room.mode = 'duel' and v_p.rnk = 1 then public._cfg('rp_place_duel_1')
        when v_room.mode = 'ffa' and v_p.rnk = 1 then public._cfg('rp_place_ffa_1')
        when v_room.mode = 'ffa' and v_p.rnk = 2 and v_participants >= 3 then public._cfg('rp_place_ffa_2')
        when v_room.mode = 'tournament' and v_p.rnk = 1 then public._cfg('rp_place_tournament_1')
        when v_room.mode = 'tournament' and v_p.rnk = 2 then public._cfg('rp_place_tournament_2')
        else 0 end::integer;
    end if;

    v_total := case when v_award then v_sum + v_place
                    when v_p.left_at is not null then v_neg
                    else 0 end;

    insert into public.match_results
      (room_id, user_id, mode, format, final_rank, total_score, eliminated_round, final_hp, left_early,
       rp_delta, rp_breakdown)
    values (p_room_id, v_p.user_id, v_room.mode, v_room.format, v_p.rnk, v_p.total_score,
            v_p.eliminated_round, v_p.hp, v_p.left_at is not null, v_total,
            jsonb_build_object('rounds', v_rounds,
                               'placement', case when v_award then v_place else 0 end,
                               'voided', not v_award, 'total', v_total))
    on conflict (room_id, user_id) do nothing;
  end loop;

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

create or replace function public.get_my_rp_history(p_limit integer default 20)
returns jsonb
language plpgsql stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_lim integer := least(100, greatest(1, coalesce(p_limit, 20)));
begin
  return (
    select coalesce(jsonb_agg(s.j order by s.fin desc, s.room_id), '[]'::jsonb)
      from (select m.room_id, coalesce(r.finished_at, m.created_at) as fin,
                   jsonb_build_object(
                     'room_id', m.room_id, 'finished_at', coalesce(r.finished_at, m.created_at),
                     'mode', m.mode, 'format', m.format, 'target', r.target_type,
                     'placement', m.final_rank,
                     'players', (select count(*) from public.room_players p
                                  where p.room_id = m.room_id and p.played),
                     'rp_delta', m.rp_delta, 'rp_breakdown', m.rp_breakdown, 'rp_after', m.rp_after) as j
              from public.match_results m
              join public.rooms r on r.id = m.room_id
             where m.user_id = v_uid
             order by coalesce(r.finished_at, m.created_at) desc, m.room_id
             limit v_lim) s);
end $$;

-- Yeni hesap: RP game_config.rp_default'tan (RP v2: 0)
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
  insert into public.profiles (id, display_name, ranked_points)
  values (new.id, v_name, greatest(0, coalesce(
            (select c.value from public.game_config c where c.key = 'rp_default'), 0))::integer)
  on conflict (id) do nothing;
  return new;
end $$;

-- -----------------------------------------------------------------------------
-- 9. Yetkiler (yalnızca bu migration'ın nesneleri)
-- -----------------------------------------------------------------------------
revoke all on public.daily_attempts, public.daily_guesses from anon, authenticated;
revoke all on public.daily_leaderboard from anon;
grant select on public.daily_leaderboard to authenticated;

revoke all on function public._daily_today()                                      from public, anon, authenticated;
revoke all on function public._parse_target(text)                                 from public, anon, authenticated;
revoke all on function public._target_kind(public.target_type, integer)           from public, anon, authenticated;
revoke all on function public._answer_json(text)                                  from public, anon, authenticated;
revoke all on function public._daily_case(date, public.target_type)               from public, anon, authenticated;
revoke all on function public._daily_state(uuid, date, public.target_type, text)  from public, anon, authenticated;
revoke all on function public._daily_record(uuid, date, public.target_type)       from public, anon, authenticated;
revoke all on function public._start_match_locked(uuid)                           from public, anon, authenticated;
revoke all on function public._join_room_locked(uuid, uuid)                       from public, anon, authenticated;
revoke all on function public._quick_timeout_if_due(uuid)                         from public, anon, authenticated;
revoke all on function public._quick_result(uuid, boolean)                        from public, anon, authenticated;
revoke all on function public._round_guess_rank(uuid, smallint, uuid)             from public, anon, authenticated;
revoke all on function public._finish_match(uuid, boolean)                        from public, anon, authenticated;
revoke all on function public._handle_new_user()                                  from public, anon, authenticated;

revoke all on function public.get_daily_challenge(text)                    from public, anon, authenticated;
revoke all on function public.daily_begin(text)                            from public, anon, authenticated;
revoke all on function public.daily_submit_guess(text, text)               from public, anon, authenticated;
revoke all on function public.daily_give_up(text)                          from public, anon, authenticated;
revoke all on function public.get_daily_leaderboard(text, date, integer)   from public, anon, authenticated;
revoke all on function public.get_my_streaks()                             from public, anon, authenticated;
revoke all on function public.quick_match(text, text)                      from public, anon, authenticated;
revoke all on function public.get_my_rp_history(integer)                   from public, anon, authenticated;
revoke all on function public.start_match(uuid)                            from public, anon, authenticated;
revoke all on function public.heartbeat(uuid)                              from public, anon, authenticated;
revoke all on function public.advance_if_due(uuid)                         from public, anon, authenticated;
revoke all on function public.update_room_settings(uuid, text, integer, text, integer, integer) from public, anon, authenticated;

grant execute on function public.get_daily_challenge(text)                  to anon, authenticated;
grant execute on function public.daily_begin(text)                          to authenticated;
grant execute on function public.daily_submit_guess(text, text)             to authenticated;
grant execute on function public.daily_give_up(text)                        to authenticated;
grant execute on function public.get_daily_leaderboard(text, date, integer) to authenticated;
grant execute on function public.get_my_streaks()                           to authenticated;
grant execute on function public.quick_match(text, text)                    to authenticated;
grant execute on function public.get_my_rp_history(integer)                 to authenticated;
grant execute on function public.start_match(uuid)                          to authenticated;
grant execute on function public.heartbeat(uuid)                            to authenticated;
grant execute on function public.advance_if_due(uuid)                       to authenticated;
grant execute on function public.update_room_settings(uuid, text, integer, text, integer, integer) to authenticated;

commit;
