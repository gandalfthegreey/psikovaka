-- =============================================================================
-- PsikoVaka — 0002: online katman ekleri (ajan M, 2026-11-15)
-- =============================================================================
-- Ek, tekrar çalıştırılabilir (idempotent) migration. 0001_init.sql'den SONRA çalıştırın.
-- Ne ekler:
--   * public.update_room_settings(...)  — oda sahibi lobideyken ayarları değiştirebilir
--     (hedef, tur sayısı, kapasite, görünürlük, tur süresi). Değişiklik olursa diğer
--     oyuncuların "hazır" durumu sıfırlanır (yeni ayarları görmeden başlamasınlar).
-- Ne eklemez: tablo, sütun, politika, yayın değişikliği YOK. İstemci (js/online/) bu
--   fonksiyonu bulamazsa ayar düğmesini salt okunur gösterir; geri kalan her şey 0001 ile çalışır.
-- Kurallar 0001 ile aynı: security definer + set search_path = '', sabit hata kodları,
--   yetki önce geri alınır sonra yalnızca authenticated'a verilir.
-- =============================================================================

begin;

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

  -- Süre: açıkça verilmediyse ve eski hedefin varsayılanındaysa yeni hedefin varsayılanına geç
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

revoke all on function public.update_room_settings(uuid, text, integer, text, integer, integer) from public, anon, authenticated;
grant execute on function public.update_room_settings(uuid, text, integer, text, integer, integer) to authenticated;

commit;
