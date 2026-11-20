-- =============================================================================
-- PsikoVaka — 0004: kural düzeltmeleri (Claude ajan X, 2026-11-20; Emre onayı 2026-11-20)
-- =============================================================================
-- Ek ve TEKRAR ÇALIŞTIRILABİLİR (idempotent) migration. 0001, 0002 ve 0003'ten SONRA.
-- Sözleşme: supabase/TASARIM.md §13.1 (günlük sıralama) ve §13.4 (RP v2, çiftçilik koruması).
-- GitHub Actions (supabase-migrasyon.yml → tools/apply_migrations.sh) bunu bir kez uygular;
-- elle ikinci kez çalıştırmak hiçbir şeyi değiştirmez.
--
-- Ne değiştirir (RPC imzaları ve dönüş biçimleri AYNI; tablo/sütun/ayar eklenmez):
--   1) Erken ayrılma (çiftçilik koruması) — public._finish_match:
--      Rakipler çıktığı için maç erken bittiyse ve turların yarısından azı oynandıysa
--        * odada kalanlar: oynadıkları turların normal RP v2 değerlerini alır (+10..+1 / −10;
--          yarıda kesilen tur 'void' = 0; hiç oynanmayan turlar için satır yok = 0),
--          sıralama primi YOK. rp_breakdown: placement 0, voided false, erken_bitis true.
--          (0003'te bu oyuncuların toplamı 0'dı: voided true.)
--        * çıkanlar: değişmedi — yalnızca negatif kalemler (voided true, erken_bitis false).
--      Galibiyet sayısı (matches_won) bu maçlarda yine artmaz (0003 ile aynı).
--      Yeni rp_breakdown alanı: "erken_bitis" (boolean, 0004'ten sonraki bütün maçlarda var).
--   2) Günlük sıralama — public.get_daily_leaderboard ve public.daily_leaderboard görünümü:
--      kazananlar önce: tahmin ↑, süre ↑, bitiş anı ↑; sonra kaybedenler (6 yanlış / pes):
--      tahmin ↓, bitiş anı ↑. Puan satırda kalır ama sırayı etkilemez. Geçmiş günler de aynı.
-- Kurallar 0003 ile aynı: security definer + set search_path = '', şemalı adlar, yetkiler
-- create or replace sonrasında 0003'teki gibi yeniden geri alınıp verilir.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- 1. Günlük sıralama görünümü (sütunlar 0001/0003 ile aynı; yalnızca sıra değişti)
-- -----------------------------------------------------------------------------
create or replace view public.daily_leaderboard with (security_invoker = true) as
  select d.challenge_date, d.target_type, d.user_id, p.username, p.display_name, p.avatar,
         d.won, d.guess_count, d.points, d.elapsed_sec,
         rank() over (partition by d.challenge_date, d.target_type
                      order by d.won desc,
                               case when d.won then d.guess_count else -d.guess_count end asc,
                               case when d.won then d.elapsed_sec end asc nulls last,
                               d.completed_at asc) as position
    from public.daily_results d
    join public.profiles p on p.id = d.user_id;

-- -----------------------------------------------------------------------------
-- 2. get_daily_leaderboard: aynı imza ve dönüş; yeni sıra
-- -----------------------------------------------------------------------------
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
      'rows', coalesce((select jsonb_agg(r.row order by r.rnk) from ranked r where r.rnk <= v_lim), '[]'::jsonb),
      'me', (select r.row from ranked r where r.user_id = v_uid)));
end $$;

-- -----------------------------------------------------------------------------
-- 3. RP v2: erken ayrılma kuralı
-- -----------------------------------------------------------------------------
-- Maçı bitirir, sıralar, RP v2'yi dağıtır. Tekrar çağrılırsa hiçbir şey yapmaz.
-- 0004: erken ayrılma kuralı değişti (yalnızca v_total ve rp_breakdown hesabı; geri kalan 0003 ile aynı).
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

  -- Çiftçilik koruması (0004): erken biten maçta turların yarısından azı oynandıysa
  -- odada kalanlar oynanan turların artı/eksi RP'sini alır ama sıralama primi almaz
  -- (rp_breakdown.erken_bitis = true); çıkanlar yine yalnızca negatif kalemlerini öder.
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
-- 4. Yetkiler (create or replace yetkileri korur; yine de 0003'teki gibi açıkça yeniden kurulur)
-- -----------------------------------------------------------------------------
revoke all on public.daily_leaderboard from anon;
grant select on public.daily_leaderboard to authenticated;

revoke all on function public._finish_match(uuid, boolean)                      from public, anon, authenticated;
revoke all on function public.get_daily_leaderboard(text, date, integer)        from public, anon, authenticated;
grant execute on function public.get_daily_leaderboard(text, date, integer)     to authenticated;

commit;
