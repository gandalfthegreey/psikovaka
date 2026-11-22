-- ============================================================================
-- PsikoVaka — 0008: Boş / Etkinliksiz Açık Odaların Otomatik Kapanması
-- ============================================================================
-- 1. game_config:
--      * stale_room_minutes = 3 (kimseden kalp atışı gelmeyen odalar 3 dk'da kapanır)
--      * empty_lobby_close_minutes = 2 (lobide hiç canlı oyuncu / kalp atışı kalmayan odalar 2 dk'da kapanır)
-- 2. _close_stale_rooms():
--      * player_count = 0 olan odaları anında kapatır,
--      * lobide 2 dk'dır kalp atışı olmayan odaları kapatır,
--      * maç içi 3 dk'dır kalp atışı olmayan odaları kapatır.
-- 3. cleanup_stale_rooms() RPC:
--      * İstemci açık odaları listelerken ucuzca çağırır; boş/terk edilmiş odalar
--        kimse yeni oda kurmasa bile otomatik kapanır.
-- ============================================================================

insert into public.game_config (key, value, note) values
  ('empty_lobby_close_minutes', 2, 'Lobide kimseden kalp atışı gelmeyen açık oda bu sürede (dk) otomatik kapanır')
on conflict (key) do update
  set value = excluded.value,
      note = excluded.note;

update public.game_config
   set value = 3,
       note = 'Kimseden kalp atışı gelmeyen oda bu sürede (dk) terk edilmiş sayılır ve kapanır'
 where key = 'stale_room_minutes';

create or replace function public._close_stale_rooms()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_n integer := 0;
  v_lobby_cut timestamptz := now() - (coalesce(public._cfg('empty_lobby_close_minutes'), 2)::float8 * interval '1 minute');
  v_match_cut timestamptz := now() - (coalesce(public._cfg('stale_room_minutes'), 3)::float8 * interval '1 minute');
begin
  for v_id in
    select r.id from public.rooms r
     where r.status in ('lobby', 'in_round', 'round_result')
       and (
         r.player_count <= 0
         or (
           r.status = 'lobby'
           and r.created_at < v_lobby_cut
           and not exists (
             select 1 from public.room_heartbeats h
              where h.room_id = r.id and h.last_seen_at > v_lobby_cut
           )
         )
         or (
           r.status in ('in_round', 'round_result')
           and r.created_at < v_match_cut
           and not exists (
             select 1 from public.room_heartbeats h
              where h.room_id = r.id and h.last_seen_at > v_match_cut
           )
         )
       )
     order by r.created_at
     limit 50
     for update skip locked
  loop
    perform public._abandon_room(v_id);
    v_n := v_n + 1;
  end loop;
  return v_n;
end $$;

create or replace function public.cleanup_stale_rooms()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public._uid();
begin
  perform v_uid;
  return public._close_stale_rooms();
end $$;

revoke all on function public._close_stale_rooms() from public;
revoke all on function public.cleanup_stale_rooms() from public;
grant execute on function public.cleanup_stale_rooms() to authenticated;
