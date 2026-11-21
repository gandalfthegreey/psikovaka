-- =============================================================================
-- PsikoVaka — 0007: zorluk ayarları ("Tek tahmin hakkı" + "Kategori gizli") ve Elo zorluk bonusu
-- (Claude ajan Z1, 2026-11-21; Emre kararı 2026-11-21)
-- =============================================================================
-- Ek ve TEKRAR ÇALIŞTIRILABİLİR (idempotent) migration. 0001…0006'dan SONRA.
-- Sözleşme: supabase/TASARIM.md §16. GitHub Actions (supabase-migrasyon.yml →
-- tools/apply_migrations.sh) bunu bir kez uygular; ikinci çalıştırma hiçbir şeyi değiştirmez.
--
-- Arayüzde "RP" artık "Elo" diye yazılır; veritabanında adlar AYNI (ranked_points, rp_delta,
-- rp_breakdown, rp_* ayar anahtarları, get_my_rp_history).
--
-- Ne ekler / değiştirir:
--   A) Özel odalar (rooms.tek_hak, rooms.kategori_gizli; hızlı eşleşmede hep false):
--      * create_room / update_room_settings: isteğe bağlı p_tek_hak, p_kategori_gizli (varsayılanlı;
--        eski istemcilerin çağrıları aynen çalışır). Eski imzalar düşürülüp varsayılanlı yenisi kurulur
--        (PostgREST'te aşırı yükleme belirsizliği olmasın).
--      * submit_guess: tek hakta aşama başına 1 tahmin (yanlış = tur başarısız); kategori gizliyken
--        same_group her yerde false (yanıt, round_guesses, get_room_state.my_guesses).
--      * reveal_clue (yeni): tek hakta tahmin yapmadan sonraki ipucunu açar (round_players.ek_ipucu).
--        Tek hakta puan ve Elo "kaçıncı tahmin" yerine "kaçıncı ipucunda" (1 + ek_ipucu) hesaplanır.
--      * _finish_match: tur başına POZİTİF Elo kalemleri ×rp_zorluk_carpan_1 (bir ayar açık, 1.25) /
--        ×rp_zorluk_carpan_2 (ikisi açık, 1.5), en yakın tam sayıya yuvarlanır. −10, sıralama primi,
--        ayrılan cezası değişmez. rp_breakdown'a zorluk_carpani + zorluk + tur kalemlerinde base.
--   B) Günün vakası (daily_attempts / daily_results .tek_hak, .kategori_gizli; daily_attempts.ek_ipucu):
--      * daily_begin(p_target, p_tek_hak, p_kategori_gizli): ayarlar ilk tahmine (ya da ilk ek ipucuna)
--        kadar değiştirilebilir, sonra kilitli. Elo yok (değişmedi).
--      * daily_reveal_clue (yeni), daily_submit_guess (tek hak + maske), _daily_state (zorluk alanları),
--        _daily_record (tek hakta guess_count = açılan ipucu sayısı; sıralama kuralı aynı),
--        get_daily_leaderboard (satırlarda tek_hak / kategori_gizli).
--   C) Sınıf modu (sinif_oturumlari.tek_hak, .kategori_gizli): sinif_olustur ayar anahtarları
--      'tek_hak' (tahmin_hakki'nı 1'e sabitler) ve 'kategori_gizli'; sinif_tahmin aynı grup maskesi.
-- Kurallar: security definer + set search_path = '', şemalı adlar, sabit hata kodları, _uid() ile
-- anonim reddi; yeni/yeniden kurulan fonksiyonların yetkisi önce geri alınır sonra yalnızca gerekene verilir.
-- Yeni hata kodları: SINGLE_GUESS_OFF (tek hak kapalıyken ek ipucu), NO_MORE_CLUES (6 ipucu açık).
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- 1. Ayarlar ve sütunlar (var olan değerlere dokunulmaz)
-- -----------------------------------------------------------------------------
insert into public.game_config (key, value, note) values
  ('rp_zorluk_carpan_1', 1.25, 'Elo (rp): özel odada tek zorluk ayarı açıkken tur başına pozitif kalemlerin çarpanı'),
  ('rp_zorluk_carpan_2', 1.5,  'Elo (rp): özel odada iki zorluk ayarı açıkken tur başına pozitif kalemlerin çarpanı')
on conflict (key) do nothing;

alter table public.rooms            add column if not exists tek_hak        boolean not null default false;
alter table public.rooms            add column if not exists kategori_gizli boolean not null default false;
alter table public.round_players    add column if not exists ek_ipucu       smallint not null default 0;
alter table public.daily_attempts   add column if not exists tek_hak        boolean not null default false;
alter table public.daily_attempts   add column if not exists kategori_gizli boolean not null default false;
alter table public.daily_attempts   add column if not exists ek_ipucu       smallint not null default 0;
alter table public.daily_results    add column if not exists tek_hak        boolean not null default false;
alter table public.daily_results    add column if not exists kategori_gizli boolean not null default false;
alter table public.sinif_oturumlari add column if not exists tek_hak        boolean not null default false;
alter table public.sinif_oturumlari add column if not exists kategori_gizli boolean not null default false;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'round_players_ek_ipucu' and conrelid = 'public.round_players'::regclass) then
    alter table public.round_players add constraint round_players_ek_ipucu check (ek_ipucu between 0 and 5);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'daily_attempts_ek_ipucu' and conrelid = 'public.daily_attempts'::regclass) then
    alter table public.daily_attempts add constraint daily_attempts_ek_ipucu check (ek_ipucu between 0 and 5);
  end if;
  -- hızlı eşleşme odaları normal kurallarla oynanır
  if not exists (select 1 from pg_constraint where conname = 'rooms_quick_normal' and conrelid = 'public.rooms'::regclass) then
    alter table public.rooms add constraint rooms_quick_normal check (not is_quick or (not tek_hak and not kategori_gizli));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'sinif_tek_hak_bir' and conrelid = 'public.sinif_oturumlari'::regclass) then
    alter table public.sinif_oturumlari add constraint sinif_tek_hak_bir check (not tek_hak or tahmin_hakki = 1);
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- 2. Yardımcılar
-- -----------------------------------------------------------------------------
-- Açık zorluk ayarı sayısına göre Elo çarpanı (0 → 1, 1 → rp_zorluk_carpan_1, 2 → rp_zorluk_carpan_2)
create or replace function public._zorluk_carpan(p_tek boolean, p_gizli boolean)
returns numeric
language sql stable
security definer
set search_path = ''
as $$
  select case (coalesce(p_tek, false)::integer + coalesce(p_gizli, false)::integer)
           when 0 then 1::numeric
           when 1 then public._cfg('rp_zorluk_carpan_1')
           else public._cfg('rp_zorluk_carpan_2') end
$$;

-- -----------------------------------------------------------------------------
-- 3. Oda kurma ve ayarlar (eski imzalar düşürülür; yenisi varsayılanlı ek parametrelerle)
-- -----------------------------------------------------------------------------
drop function if exists public.create_room(text, text, text, integer, integer, text, integer, text);
create or replace function public.create_room(
  p_mode text,
  p_format text default null,
  p_target_type text default 'diagnosis',
  p_capacity integer default null,
  p_round_count integer default null,
  p_visibility text default 'private',
  p_round_time_limit_sec integer default null,
  p_bracket_seeding text default 'random',
  p_tek_hak boolean default false,
  p_kategori_gizli boolean default false)
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

  v_rounds := case v_format
                when 'hp' then public._cfg('hp_max_rounds')::integer
                when 'battle' then v_capacity - 1
                when 'bracket' then case v_capacity when 4 then 2 else 3 end
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
                                player_count, tek_hak, kategori_gizli)
      values (public._gen_room_code(), v_uid, p_mode::public.room_mode, v_format::public.room_format,
              p_target_type::public.target_type, p_visibility::public.room_visibility, v_capacity,
              v_rounds, v_limit, public._cfg('default_intermission_sec')::integer,
              p_bracket_seeding::public.bracket_seeding, 1,
              coalesce(p_tek_hak, false), coalesce(p_kategori_gizli, false))
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

drop function if exists public.update_room_settings(uuid, text, integer, text, integer, integer);
create or replace function public.update_room_settings(
  p_room_id uuid,
  p_target_type text default null,
  p_round_count integer default null,
  p_visibility text default null,
  p_capacity integer default null,
  p_round_time_limit_sec integer default null,
  p_tek_hak boolean default null,
  p_kategori_gizli boolean default null)
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
  v_tek boolean;
  v_gizli boolean;
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

  v_tek := coalesce(p_tek_hak, v_room.tek_hak);
  v_gizli := coalesce(p_kategori_gizli, v_room.kategori_gizli);

  v_changed := v_target <> v_room.target_type::text or v_vis <> v_room.visibility::text
            or v_cap <> v_room.capacity or v_rounds <> v_room.round_count
            or v_limit <> v_room.round_time_limit_sec
            or v_tek <> v_room.tek_hak or v_gizli <> v_room.kategori_gizli;

  if v_changed then
    update public.rooms
       set target_type = v_target::public.target_type,
           visibility = v_vis::public.room_visibility,
           capacity = v_cap,
           round_count = v_rounds,
           round_time_limit_sec = v_limit,
           tek_hak = v_tek,
           kategori_gizli = v_gizli
     where id = p_room_id
     returning * into v_room;
    update public.room_players set is_ready = false
     where room_id = p_room_id and left_at is null and user_id <> v_uid and is_ready;
  end if;
  perform public._touch_heartbeat(p_room_id, v_uid);
  return to_jsonb(v_room) || jsonb_build_object('changed', v_changed);
end $$;

-- -----------------------------------------------------------------------------
-- 4. Oda tahmini, ek ipucu, Elo sırası
-- -----------------------------------------------------------------------------
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
  v_clues integer;
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
  if v_room.tek_hak then v_max := 1; end if;   -- 0007: tek tahmin hakkı (aşama başına)

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
  -- 0007: kategori gizliyken aynı grup bilgisi hiçbir yere yazılmaz/dönmez
  v_same_group := not v_room.kategori_gizli and not v_is_correct
                  and v_item_group is not null and v_item_group = v_correct_group;
  v_elapsed := greatest(0, floor(extract(epoch from now() - v_round.starts_at))::integer);
  v_clues := least(6, 1 + v_rp.ek_ipucu);

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
    if v_room.tek_hak then
      -- tek hak: taban puan açılan ipucu sayısına göre (kombo dahil)
      v_points := public._case_points(true, v_clues, v_elapsed);
    elsif v_room.target_type = 'combo' then
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
    'clues_opened', v_clues,
    'answer', case when v_finished then jsonb_build_object(
                'diagnosis_id', v_key.diagnosis_id, 'therapy_id', v_key.therapy_id,
                'pharmacology_id', v_key.pharmacology_id) end,
    'room', public._room_brief(p_room_id));
end $$;

-- Tek hak: tahmin yapmadan sonraki ipucunu aç (tur başına en çok 5 ek ipucu = 6 ipucu)
create or replace function public.reveal_clue(p_room_id uuid, p_round_no integer)
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
  if not v_room.tek_hak then
    perform public._raise('SINGLE_GUESS_OFF', 'Bu odada ipuçları yanlış tahminle açılır.');
  end if;
  select * into v_round from public.room_rounds
   where room_id = p_room_id and round_no = v_room.current_round;
  if v_round.closed_at is not null or now() >= v_round.deadline_at then perform public._raise('ROUND_CLOSED'); end if;
  if now() < v_round.starts_at then perform public._raise('ROUND_NOT_STARTED'); end if;

  select * into v_rp from public.round_players
   where room_id = p_room_id and round_no = v_round.round_no and user_id = v_uid for update;
  if not found then perform public._raise('NOT_IN_ROUND', 'Bu turda oynamıyorsun (elendin veya ayrıldın).'); end if;
  if v_rp.finished then perform public._raise('ALREADY_FINISHED'); end if;
  if v_rp.ek_ipucu >= 5 then perform public._raise('NO_MORE_CLUES', 'Bütün ipuçları açık.'); end if;

  update public.round_players set ek_ipucu = ek_ipucu + 1
   where room_id = p_room_id and round_no = v_round.round_no and user_id = v_uid
  returning * into v_rp;
  perform public._touch_heartbeat(p_room_id, v_uid);
  return jsonb_build_object('server_time', now(), 'round_no', v_round.round_no,
                            'clues_opened', 1 + v_rp.ek_ipucu, 'room', public._room_brief(p_room_id));
end $$;

-- Turdaki sonucun "kaçıncı tahminde" karşılığı (1-6). 0007: tek hakta "kaçıncı ipucunda" (1 + ek_ipucu).
create or replace function public._round_guess_rank(p_room_id uuid, p_round smallint, p_uid uuid)
returns integer
language sql stable
security definer
set search_path = ''
as $$
  select least(6, greatest(1,
           case when r.tek_hak
                then (select 1 + rp.ek_ipucu from public.round_players rp
                       where rp.room_id = p_room_id and rp.round_no = p_round and rp.user_id = p_uid)
                when r.target_type = 'combo'
                then (select round(avg(s.n))::integer
                        from (select count(*)::integer as n from public.round_guesses g
                               where g.room_id = p_room_id and g.round_no = p_round and g.user_id = p_uid
                               group by g.stage) s)
                else (select rp.guess_count from public.round_players rp
                       where rp.room_id = p_room_id and rp.round_no = p_round and rp.user_id = p_uid)
           end))
    from public.rooms r where r.id = p_room_id
$$;

-- -----------------------------------------------------------------------------
-- 5. Elo (rp) v2 + zorluk bonusu (0004 gövdesi; yalnızca pozitif tur kalemleri çarpılır)
-- -----------------------------------------------------------------------------
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
  v_mult numeric;
  v_p record;
  v_r record;
  v_last integer;
  v_base integer;
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
  -- 0007: hızlı oda her zaman 1 (ayarlar orada hep kapalı; yine de açıkça)
  v_mult := case when v_room.is_quick then 1 else public._zorluk_carpan(v_room.tek_hak, v_room.kategori_gizli) end;

  select count(*) into v_closed from public.room_rounds
   where room_id = p_room_id and closed_at is not null;
  select count(*) into v_participants from public.room_players
   where room_id = p_room_id and played;

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
      v_base := case when v_r.outcome = 'void' then 0
                     when v_r.outcome = 'fail' then v_fail
                     else v_g[substr(v_r.outcome, 2)::integer] end;
      v_d := case when v_base > 0 and v_mult <> 1 then round(v_base * v_mult)::integer else v_base end;
      v_sum := v_sum + v_d;
      if v_d < 0 then v_neg := v_neg + v_d; end if;
      v_rounds := v_rounds || jsonb_build_array(
        jsonb_build_object('round', v_r.round_no, 'outcome', v_r.outcome, 'delta', v_d)
        || case when v_d <> v_base then jsonb_build_object('base', v_base) else '{}'::jsonb end
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
                    else v_sum end;

    insert into public.match_results
      (room_id, user_id, mode, format, final_rank, total_score, eliminated_round, final_hp, left_early,
       rp_delta, rp_breakdown)
    values (p_room_id, v_p.user_id, v_room.mode, v_room.format, v_p.rnk, v_p.total_score,
            v_p.eliminated_round, v_p.hp, v_p.left_at is not null, v_total,
            jsonb_build_object('rounds', v_rounds,
                               'placement', case when v_award then v_place else 0 end,
                               'voided', (not v_award) and v_p.left_at is not null,
                               'erken_bitis', (not v_award) and v_p.left_at is null,
                               'zorluk_carpani', v_mult,
                               'zorluk', jsonb_build_object('tek_hak', v_room.tek_hak, 'kategori_gizli', v_room.kategori_gizli),
                               'total', v_total))
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

-- -----------------------------------------------------------------------------
-- 6. Günün vakası
-- -----------------------------------------------------------------------------
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
    'stage', case when v_found then a.stage else 1 end,
    -- 0007
    'tek_hak', v_found and a.tek_hak,
    'kategori_gizli', v_found and a.kategori_gizli,
    'clues_opened', case when v_found then 1 + a.ek_ipucu else 1 end,
    'zorluk_kilitli', v_found and (a.finished or a.guess_count > 0 or a.ek_ipucu > 0));
end $$;

-- Biten denemeyi daily_results'a yazar ve seriyi günceller (0003 gövdesi; 0007: zorluk sütunları,
-- tek hakta guess_count = açılan ipucu sayısı — sıralamadaki "tahmin" karşılığı)
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
                                    points, elapsed_sec, completed_at, tek_hak, kategori_gizli)
  values (p_uid, p_day, p_target, a.case_id, a.won,
          case when a.tek_hak then least(6, 1 + a.ek_ipucu) else a.guess_count end,
          a.points, a.elapsed_sec, a.finished_at, a.tek_hak, a.kategori_gizli)
  on conflict (user_id, challenge_date, target_type) do nothing;
  get diagnostics v_n = row_count;
  if v_n = 0 then return; end if;

  insert into public.solo_streaks (user_id, target_type) values (p_uid, p_target)
  on conflict (user_id, target_type) do nothing;
  select * into s from public.solo_streaks
   where user_id = p_uid and target_type = p_target for update;

  if s.last_day is not null and p_day <= s.last_day then
    return;
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

drop function if exists public.daily_begin(text);
create or replace function public.daily_begin(p_target text, p_tek_hak boolean default null, p_kategori_gizli boolean default null)
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

  insert into public.daily_attempts (user_id, challenge_date, target_type, case_id, tek_hak, kategori_gizli)
  values (v_uid, v_day, v_t, v_case, coalesce(p_tek_hak, false), coalesce(p_kategori_gizli, false))
  on conflict (user_id, challenge_date, target_type) do nothing;
  select * into a from public.daily_attempts
   where user_id = v_uid and challenge_date = v_day and target_type = v_t for update;

  -- 0007: zorluk ilk tahmine (ya da ilk ek ipucuna) kadar değiştirilebilir; sonra kilitli (sessizce yok sayılır)
  if not a.finished and a.guess_count = 0 and a.ek_ipucu = 0
     and (p_tek_hak is not null or p_kategori_gizli is not null) then
    update public.daily_attempts
       set tek_hak = coalesce(p_tek_hak, tek_hak), kategori_gizli = coalesce(p_kategori_gizli, kategori_gizli)
     where user_id = v_uid and challenge_date = v_day and target_type = v_t
    returning * into a;
  end if;
  if a.tek_hak then v_max := 1; end if;

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

create or replace function public.daily_reveal_clue(p_target text)
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
  if not a.tek_hak then perform public._raise('SINGLE_GUESS_OFF', 'İpuçları yanlış tahminle açılır.'); end if;
  if a.ek_ipucu >= 5 then perform public._raise('NO_MORE_CLUES', 'Bütün ipuçları açık.'); end if;
  update public.daily_attempts set ek_ipucu = ek_ipucu + 1
   where user_id = v_uid and challenge_date = v_day and target_type = v_t;
  return public._daily_state(v_uid, v_day, v_t, a.case_id);
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
  v_clues integer;
begin
  perform public._require_player(v_uid);
  v_t := public._parse_target(p_target);
  v_day := public._daily_today();

  select * into a from public.daily_attempts
   where user_id = v_uid and challenge_date = v_day and target_type = v_t for update;
  if not found then perform public._raise('DAILY_NOT_STARTED', 'Önce daily_begin çağrılmalı.'); end if;
  if a.finished then perform public._raise('DAILY_ALREADY_FINISHED', 'Bugünün vakasını bitirdin.'); end if;
  if a.tek_hak then v_max := 1; end if;   -- 0007
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
  v_same_group := not a.kategori_gizli and not v_is_correct
                  and v_item_group is not null and v_item_group = v_correct_group;
  v_elapsed := greatest(0, floor(extract(epoch from now() - a.started_at))::integer);
  v_clues := least(6, 1 + a.ek_ipucu);

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
    if a.tek_hak then
      v_points := public._case_points(true, v_clues, v_elapsed);
    elsif v_t = 'combo' then
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
    'tek_hak', a.tek_hak,
    'kategori_gizli', a.kategori_gizli,
    'clues_opened', v_clues,
    'answer', case when v_finished then public._answer_json(a.case_id) end);
end $$;

-- 0005 gövdesi; satırlara tek_hak / kategori_gizli eklendi (sıralama kuralı aynı)
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
               'points', d.points, 'tek_hak', d.tek_hak, 'kategori_gizli', d.kategori_gizli) as row,
             row_number() over w as rnk
        from public.daily_results d
        join public.profiles p on p.id = d.user_id
       where d.challenge_date = v_day and d.target_type = v_t
         and (not p.needs_rename or d.user_id = v_uid)
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

-- -----------------------------------------------------------------------------
-- 7. Sınıf modu
-- -----------------------------------------------------------------------------
create or replace function public._sinif_ayarlar_json(p_o public.sinif_oturumlari)
returns jsonb
language sql stable
set search_path = ''
as $$
  select jsonb_build_object(
    'vaka_sayisi', p_o.vaka_sayisi, 'hedef', p_o.hedef, 'kurslar', to_jsonb(p_o.kurslar),
    'kategoriler', to_jsonb(p_o.kategoriler), 'ipucu_araligi_sn', p_o.ipucu_araligi_sn,
    'tahmin_hakki', p_o.tahmin_hakki, 'kapasite', p_o.kapasite, 'gec_katilim', p_o.gec_katilim,
    'tek_hak', p_o.tek_hak, 'kategori_gizli', p_o.kategori_gizli)
$$;

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
  v_tek boolean := false;
  v_gizli boolean := false;
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
  -- 0007: zorluk
  if v_j ? 'tek_hak' and jsonb_typeof(v_j -> 'tek_hak') <> 'null' then
    if jsonb_typeof(v_j -> 'tek_hak') <> 'boolean' then perform public._raise('INVALID_SETTINGS', 'tek_hak'); end if;
    v_tek := (v_j ->> 'tek_hak')::boolean;
  end if;
  if v_j ? 'kategori_gizli' and jsonb_typeof(v_j -> 'kategori_gizli') <> 'null' then
    if jsonb_typeof(v_j -> 'kategori_gizli') <> 'boolean' then perform public._raise('INVALID_SETTINGS', 'kategori_gizli'); end if;
    v_gizli := (v_j ->> 'kategori_gizli')::boolean;
  end if;
  if v_tek then v_hak := 1; end if;
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
                                           ipucu_araligi_sn, tahmin_hakki, kapasite, gec_katilim,
                                           tek_hak, kategori_gizli)
      values (v_kod, v_uid, v_vaka, 'diagnosis', v_kurs, v_kat, v_aralik, v_hak, v_kap, v_gec, v_tek, v_gizli)
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

  v_kind := v_o.hedef::text::public.answer_kind;
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
  -- 0007: kategori gizliyken aynı grup bilgisi yazılmaz/dönmez
  v_ayni := not v_o.kategori_gizli and not v_dogru and v_item_group is not null and v_item_group = v_dogru_group;
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

-- -----------------------------------------------------------------------------
-- 8. Yetkiler (yeni ve yeniden kurulan her fonksiyon: önce geri al, sonra yalnızca gerekene ver)
-- -----------------------------------------------------------------------------
revoke all on function public._zorluk_carpan(boolean, boolean)                            from public, anon, authenticated;
revoke all on function public._round_guess_rank(uuid, smallint, uuid)                     from public, anon, authenticated;
revoke all on function public._finish_match(uuid, boolean)                                from public, anon, authenticated;
revoke all on function public._daily_state(uuid, date, public.target_type, text)          from public, anon, authenticated;
revoke all on function public._daily_record(uuid, date, public.target_type)               from public, anon, authenticated;
revoke all on function public._sinif_ayarlar_json(public.sinif_oturumlari)                from public, anon, authenticated;

revoke all on function public.create_room(text, text, text, integer, integer, text, integer, text, boolean, boolean) from public, anon, authenticated;
revoke all on function public.update_room_settings(uuid, text, integer, text, integer, integer, boolean, boolean)    from public, anon, authenticated;
revoke all on function public.submit_guess(uuid, integer, text)                           from public, anon, authenticated;
revoke all on function public.reveal_clue(uuid, integer)                                  from public, anon, authenticated;
revoke all on function public.daily_begin(text, boolean, boolean)                         from public, anon, authenticated;
revoke all on function public.daily_reveal_clue(text)                                     from public, anon, authenticated;
revoke all on function public.daily_submit_guess(text, text)                              from public, anon, authenticated;
revoke all on function public.get_daily_leaderboard(text, date, integer)                  from public, anon, authenticated;
revoke all on function public.sinif_olustur(jsonb)                                        from public, anon, authenticated;
revoke all on function public.sinif_tahmin(uuid, text, integer)                           from public, anon, authenticated;

grant execute on function public.create_room(text, text, text, integer, integer, text, integer, text, boolean, boolean) to authenticated;
grant execute on function public.update_room_settings(uuid, text, integer, text, integer, integer, boolean, boolean)    to authenticated;
grant execute on function public.submit_guess(uuid, integer, text)                        to authenticated;
grant execute on function public.reveal_clue(uuid, integer)                               to authenticated;
grant execute on function public.daily_begin(text, boolean, boolean)                      to authenticated;
grant execute on function public.daily_reveal_clue(text)                                  to authenticated;
grant execute on function public.daily_submit_guess(text, text)                           to authenticated;
grant execute on function public.get_daily_leaderboard(text, date, integer)               to authenticated;
grant execute on function public.sinif_olustur(jsonb)                                     to authenticated;
grant execute on function public.sinif_tahmin(uuid, text, integer)                        to authenticated;

commit;
