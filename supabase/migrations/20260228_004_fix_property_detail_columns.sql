-- ============================================================
-- BlueOak — Fix Property Detail Response Columns (Limit Fix)
-- Uses row_to_json to bypass the 100-argument limit for jsonb_build_object
-- Drops the old function first to clear the 'stable' (read-only) flag
-- ============================================================

drop function if exists public.get_property_detail(text);

create or replace function public.get_property_detail(p_slug text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare result jsonb;
begin
  select row_to_json(t)::jsonb into result
  from (
    select 
      p.*,
      (
        select row_to_json(pr_row)::jsonb
        from (
          select id, full_name, avatar_url, is_verified, user_type, bio, phone, whatsapp, agency_name, rating, listing_count
          from public.profiles 
          where id = p.seller_id
        ) pr_row
      ) as profiles,
      (
        select coalesce(json_agg(m order by m.order_index), '[]'::json)
        from (
          select url, media_type, order_index, is_cover
          from public.property_media
          where property_id = p.id
        ) m
      ) as media
    from public.properties p
    where p.slug = p_slug
      and (
        p.status = 'active'
        or p.seller_id = (select auth.uid())
        or exists (
          select 1 from public.profiles
          where id = (select auth.uid())
            and user_type in ('admin', 'super_admin')
        )
      )
  ) t;

  if result is not null then
    perform public.record_property_view((result->>'id')::uuid);
  end if;

  return result;
end;
$$;
