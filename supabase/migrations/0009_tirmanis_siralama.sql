-- ============================================================================
-- PsikoVaka — 0009: Tırmanış (Zor Mod Seri) Liderlik Tablosu
-- ============================================================================
-- 1. public.climb_scores:
--      * Kullanıcı başına en iyi Tırmanış serisi (best_streak), o serideki
--        ortalama ipucu sayısı (avg_clues) ve toplam deneme sayısı (runs_count).
-- 2. public.submit_climb_score(p_streak, p_avg_clues):
--      * Yalnızca giriş yapmış (anonim olmayan) üyeler çağırabilir (public._uid()).
--      * Daha yüksek seri veya aynı seride daha düşük ortalama ipucu varsa rekoru günceller.
-- 3. public.get_climb_leaderboard(p_limit):
--      * En iyi tırmanışçıları (best_streak ↓, avg_clues ↑, updated_at ↑) ve
--        oturum açıksa kullanıcının kendi sırasını döner. needs_rename filtrelidir.
-- ============================================================================

create table if not exists public.climb_scores (
  user_id     uuid primary key references public.profiles(id) on delete cascade,
  best_streak integer not null default 0 check (best_streak >= 0 and best_streak <= 500),
  avg_clues   numeric(4,2) not null default 0 check (avg_clues >= 0 and avg_clues <= 6),
  runs_count  integer not null default 0 check (runs_count >= 0),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_climb_scores_rank
  on public.climb_scores (best_streak desc, avg_clues asc, updated_at asc);

alter table public.climb_scores enable row level security;

drop policy if exists "climb_scores_select" on public.climb_scores;
create policy "climb_scores_select" on public.climb_scores
  for select to authenticated, anon
  using (true);

create or replace function public.submit_climb_score(
  p_streak integer,
  p_avg_clues numeric default 0
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
  v_streak integer := greatest(0, least(coalesce(p_streak, 0), 500));
  v_avg numeric(4,2) := round(greatest(0, least(coalesce(p_avg_clues, 0), 6))::numeric, 2);
  v_row public.climb_scores%rowtype;
begin
  if not exists (select 1 from public.profiles where id = v_uid and username is not null) then
    raise exception 'USERNAME_REQUIRED';
  end if;

  insert into public.climb_scores (user_id, best_streak, avg_clues, runs_count, updated_at)
  values (v_uid, v_streak, case when v_streak > 0 then v_avg else 0 end, 1, now())
  on conflict (user_id) do update
    set best_streak = case
          when excluded.best_streak > public.climb_scores.best_streak then excluded.best_streak
          else public.climb_scores.best_streak
        end,
        avg_clues = case
          when excluded.best_streak > public.climb_scores.best_streak then excluded.avg_clues
          when excluded.best_streak = public.climb_scores.best_streak
               and excluded.avg_clues > 0
               and (public.climb_scores.avg_clues = 0 or excluded.avg_clues < public.climb_scores.avg_clues)
            then excluded.avg_clues
          else public.climb_scores.avg_clues
        end,
        runs_count = public.climb_scores.runs_count + 1,
        updated_at = case
          when excluded.best_streak > public.climb_scores.best_streak then now()
          else public.climb_scores.updated_at
        end
  returning * into v_row;

  return jsonb_build_object(
    'best_streak', v_row.best_streak,
    'avg_clues', v_row.avg_clues,
    'runs_count', v_row.runs_count
  );
end $$;

create or replace function public.get_climb_leaderboard(
  p_limit integer default 30
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_lim integer := greatest(1, least(coalesce(p_limit, 30), 100));
  v_rows jsonb;
  v_me jsonb;
begin
  with ranked as (
    select
      row_number() over (
        order by c.best_streak desc,
                 case when c.avg_clues > 0 then c.avg_clues else 9 end asc,
                 c.updated_at asc
      ) as pos,
      c.user_id,
      p.username,
      p.avatar,
      p.ranked_points,
      c.best_streak,
      c.avg_clues,
      c.runs_count
    from public.climb_scores c
    join public.profiles p on p.id = c.user_id
    where c.best_streak > 0
      and p.username is not null
      and (not p.needs_rename or c.user_id = v_uid)
  )
  select
    coalesce((
      select jsonb_agg(jsonb_build_object(
        'pos', r.pos,
        'user_id', r.user_id,
        'username', r.username,
        'avatar', r.avatar,
        'ranked_points', r.ranked_points,
        'best_streak', r.best_streak,
        'avg_clues', r.avg_clues,
        'runs_count', r.runs_count
      ) order by r.pos)
      from ranked r
      where r.pos <= v_lim
    ), '[]'::jsonb),
    (
      select jsonb_build_object(
        'pos', r.pos,
        'user_id', r.user_id,
        'username', r.username,
        'avatar', r.avatar,
        'ranked_points', r.ranked_points,
        'best_streak', r.best_streak,
        'avg_clues', r.avg_clues,
        'runs_count', r.runs_count
      )
      from ranked r
      where r.user_id = v_uid
      limit 1
    )
  into v_rows, v_me;

  return jsonb_build_object('rows', v_rows, 'me', v_me);
end $$;

revoke all on function public.submit_climb_score(integer, numeric) from public;
grant execute on function public.submit_climb_score(integer, numeric) to authenticated;

revoke all on function public.get_climb_leaderboard(integer) from public;
grant execute on function public.get_climb_leaderboard(integer) to authenticated, anon;
