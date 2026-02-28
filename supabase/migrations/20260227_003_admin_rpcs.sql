-- BlueOak — Admin & Super Admin RPCs

-- 1. Get Global Admin Stats
create or replace function public.get_admin_stats()
returns jsonb
language plpgsql
security definer
as $$
declare
  result jsonb;
begin
  -- Check if user is admin or super_admin
  if not exists (
    select 1 from public.profiles
    where id = auth.uid() 
    and user_type in ('admin', 'super_admin')
  ) then
    raise exception 'Unauthorized: Admin access required';
  end if;

  select jsonb_build_object(
    'total_users', (select count(*) from public.profiles),
    'active_properties', (select count(*) from public.properties where status = 'active'),
    'pending_properties', (select count(*) from public.properties where status = 'pending'),
    'open_reports', (select count(*) from public.reports where status = 'open'),
    'total_reservations', (select count(*) from public.reservations),
    'total_revenue', (
      select coalesce(sum(amount_paid), 0) 
      from public.seller_subscriptions 
      where is_active = true
    )
  ) into result;

  return result;
end;
$$;

-- 2. Moderation: Approve Property
create or replace function public.admin_approve_property(p_property_id uuid)
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
  set status = 'active', 
      updated_at = now()
  where id = p_property_id;

  -- Create notification for owner
  insert into public.notifications (user_id, type, title, body)
  select seller_id, 'property_approved', 'Property Approved', 'Your listing "' || title || '" has been approved and is now live.'
  from public.properties
  where id = p_property_id;
end;
$$;

-- 3. Moderation: Reject Property
create or replace function public.admin_reject_property(p_property_id uuid, p_reason text)
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
  set status = 'rejected',
      updated_at = now()
  where id = p_property_id;

  -- Create notification for owner
  insert into public.notifications (user_id, type, title, body, data)
  select seller_id, 'property_rejected', 'Property Rejected', 'Your listing "' || title || '" was rejected. Reason: ' || p_reason, 
         jsonb_build_object('reason', p_reason)
  from public.properties
  where id = p_property_id;
end;
$$;

-- 4. User Management: Toggle Verification
create or replace function public.admin_verify_user(p_user_id uuid, p_status boolean)
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

  update public.profiles
  set is_verified = p_status,
      updated_at = now()
  where id = p_user_id;

  if p_status then
    insert into public.notifications (user_id, type, title, body)
    values (p_user_id, 'account_verified', 'Account Verified', 'Congratulations! Your account has been verified.');
  end if;
end;
$$;

-- 5. User Management: Update Role (Super Admin only)
create or replace function public.admin_update_role(p_user_id uuid, p_new_role public.user_type)
returns void
language plpgsql
security definer
as $$
begin
  -- Check super_admin status
  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and user_type = 'super_admin'
  ) then
    raise exception 'Unauthorized: Super Admin access required';
  end if;

  update public.profiles
  set user_type = p_new_role,
      updated_at = now()
  where id = p_user_id;
end;
$$;

-- 6. User Management: Ban User
create or replace function public.admin_ban_user(p_user_id uuid, p_status boolean)
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

  update public.profiles
  set is_banned = p_status,
      updated_at = now()
  where id = p_user_id;

  if p_status then
    insert into public.notifications (user_id, type, title, body)
    values (p_user_id, 'account_banned', 'Account Banned', 'Your account has been restricted due to platform policy violations.');
  end if;
end;
$$;
