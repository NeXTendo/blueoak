-- Admin Actions: Feature & Delete

-- 1. Feature Property
create or replace function public.admin_feature_property(p_property_id uuid, p_status boolean)
returns void
language plpgsql
security definer
as $$
begin
  -- Check admin status
  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and user_type in ('admin', 'super_admin')
  ) then
    raise exception 'Unauthorized';
  end if;

  update public.properties
  set is_featured = p_status,
      featured_until = case when p_status then now() + interval '30 days' else null end,
      updated_at = now()
  where id = p_property_id;

  -- Notify owner
  if p_status then
    insert into public.notifications (user_id, type, title, body)
    select seller_id, 'property_featured', 'Listing Featured', 'Your listing "' || title || '" is now featured on the homepage!'
    from public.properties
    where id = p_property_id;
  end if;
end;
$$;

-- 2. Delete Property (Force)
create or replace function public.admin_delete_property(p_property_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- Check admin status
  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and user_type in ('admin', 'super_admin')
  ) then
    raise exception 'Unauthorized';
  end if;

  delete from public.properties
  where id = p_property_id;
end;
$$;
