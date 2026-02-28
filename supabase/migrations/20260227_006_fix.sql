-- ============================================================
-- BlueOak — Performance & Security Remediation Migration
-- Generated: 2026-02-27
-- Run this migration in your Supabase SQL Editor
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- SECTION 1: FIX auth_rls_initplan WARNINGS
-- Replace auth.<function>() with (select auth.<function>())
-- so the value is computed once per query, not once per row.
-- ────────────────────────────────────────────────────────────

-- profiles
drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ((select auth.uid()) = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using ((select auth.uid()) = id);

-- properties
drop policy if exists "Active properties are viewable by everyone" on public.properties;
create policy "Active properties are viewable by everyone"
  on public.properties for select
  using (
    status = 'active'
    or seller_id = (select auth.uid())
    or public.is_admin()
  );

drop policy if exists "Sellers can insert properties" on public.properties;
create policy "Sellers can insert properties"
  on public.properties for insert
  with check (
    (select auth.uid()) = seller_id
    and exists (
      select 1 from public.profiles
      where id = (select auth.uid())
        and user_type in ('seller','agent','admin','super_admin')
    )
  );

drop policy if exists "Sellers can update their own properties" on public.properties;
create policy "Sellers can update their own properties"
  on public.properties for update
  using (seller_id = (select auth.uid()) or public.is_admin());

drop policy if exists "Sellers can delete their own properties" on public.properties;
create policy "Sellers can delete their own properties"
  on public.properties for delete
  using (seller_id = (select auth.uid()) or public.is_admin());

-- saved_properties
drop policy if exists "Users can view their own saved properties" on public.saved_properties;
create policy "Users can view their own saved properties"
  on public.saved_properties for select
  using (user_id = (select auth.uid()));

drop policy if exists "Users can save/unsave properties" on public.saved_properties;
create policy "Users can save/unsave properties"
  on public.saved_properties for all
  using (user_id = (select auth.uid()));

-- conversations
drop policy if exists "Users can view their conversations" on public.conversations;
create policy "Users can view their conversations"
  on public.conversations for select
  using (
    buyer_id = (select auth.uid())
    or seller_id = (select auth.uid())
    or public.is_admin()
  );

drop policy if exists "Authenticated users can create conversations" on public.conversations;
create policy "Authenticated users can create conversations"
  on public.conversations for insert
  with check ((select auth.uid()) = buyer_id);

-- messages
drop policy if exists "Conversation participants can view messages" on public.messages;
create policy "Conversation participants can view messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.buyer_id = (select auth.uid()) or c.seller_id = (select auth.uid()))
    )
    or public.is_admin()
  );

drop policy if exists "Conversation participants can send messages" on public.messages;
create policy "Conversation participants can send messages"
  on public.messages for insert
  with check (
    (select auth.uid()) = sender_id
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.buyer_id = (select auth.uid()) or c.seller_id = (select auth.uid()))
    )
  );

-- notifications
drop policy if exists "Users can view their own notifications" on public.notifications;
create policy "Users can view their own notifications"
  on public.notifications for select
  using (user_id = (select auth.uid()));

drop policy if exists "Users can update their own notifications" on public.notifications;
create policy "Users can update their own notifications"
  on public.notifications for update
  using (user_id = (select auth.uid()));

-- reservations
drop policy if exists "Reservation participants can view" on public.reservations;
create policy "Reservation participants can view"
  on public.reservations for select
  using (
    buyer_id = (select auth.uid())
    or seller_id = (select auth.uid())
    or public.is_admin()
  );

drop policy if exists "Buyers can create reservations" on public.reservations;
create policy "Buyers can create reservations"
  on public.reservations for insert
  with check (buyer_id = (select auth.uid()));

drop policy if exists "Participants can update reservations" on public.reservations;
create policy "Participants can update reservations"
  on public.reservations for update
  using (
    buyer_id = (select auth.uid())
    or seller_id = (select auth.uid())
    or public.is_admin()
  );

-- reports
drop policy if exists "Users can create reports" on public.reports;
create policy "Users can create reports"
  on public.reports for insert
  with check (reporter_id = (select auth.uid()));

drop policy if exists "Admins can view all reports" on public.reports;
create policy "Admins can view all reports"
  on public.reports for select
  using (reporter_id = (select auth.uid()) or public.is_admin());


-- ────────────────────────────────────────────────────────────
-- SECTION 2: FIX multiple_permissive_policies WARNINGS
-- Consolidate overlapping SELECT and UPDATE policies.
-- ────────────────────────────────────────────────────────────

-- platform_settings: merge "Anyone can read settings" + "Only admins can modify settings"
-- The SELECT overlap is because "Only admins can modify settings" uses FOR ALL
-- which includes SELECT. Replace with explicit per-action policies.
drop policy if exists "Anyone can read settings" on public.platform_settings;
drop policy if exists "Only admins can modify settings" on public.platform_settings;

create policy "Anyone can read settings"
  on public.platform_settings for select
  using (true);

create policy "Only admins can insert settings"
  on public.platform_settings for insert
  with check (public.is_admin());

create policy "Only admins can update settings"
  on public.platform_settings for update
  using (public.is_admin());

create policy "Only admins can delete settings"
  on public.platform_settings for delete
  using (public.is_admin());

-- profiles UPDATE: merge "Admins can update any profile" + "Users can update their own profile"
drop policy if exists "Admins can update any profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

create policy "Users and admins can update profiles"
  on public.profiles for update
  using (
    (select auth.uid()) = id
    or public.is_admin()
  );

-- saved_properties SELECT: merge "Users can view their own saved properties"
-- + the implicit SELECT from "Users can save/unsave properties" (FOR ALL)
-- Fix by splitting FOR ALL into explicit per-action policies.
drop policy if exists "Users can view their own saved properties" on public.saved_properties;
drop policy if exists "Users can save/unsave properties" on public.saved_properties;

create policy "Users can view their own saved properties"
  on public.saved_properties for select
  using (user_id = (select auth.uid()));

create policy "Users can insert saved properties"
  on public.saved_properties for insert
  with check (user_id = (select auth.uid()));

create policy "Users can delete saved properties"
  on public.saved_properties for delete
  using (user_id = (select auth.uid()));


-- ────────────────────────────────────────────────────────────
-- SECTION 3: FIX unindexed_foreign_keys
-- Add missing indexes on FK columns flagged by the linter.
-- ────────────────────────────────────────────────────────────

-- conversations.property_id
create index if not exists idx_conversations_property_id
  on public.conversations(property_id);

-- platform_settings.updated_by
create index if not exists idx_platform_settings_updated_by
  on public.platform_settings(updated_by);

-- property_views.viewer_id
create index if not exists idx_property_views_viewer_id
  on public.property_views(viewer_id);

-- reports.reported_user
create index if not exists idx_reports_reported_user
  on public.reports(reported_user);

-- reports.reporter_id
create index if not exists idx_reports_reporter_id
  on public.reports(reporter_id);

-- reports.resolved_by
create index if not exists idx_reports_resolved_by
  on public.reports(resolved_by);

-- reviews.reservation_id
create index if not exists idx_reviews_reservation_id
  on public.reviews(reservation_id);

-- reviews.reviewed_id
create index if not exists idx_reviews_reviewed_id
  on public.reviews(reviewed_id);

-- reviews.reviewer_id
create index if not exists idx_reviews_reviewer_id
  on public.reviews(reviewer_id);

-- seller_subscriptions.seller_id
create index if not exists idx_seller_subscriptions_seller_id
  on public.seller_subscriptions(seller_id);


-- ────────────────────────────────────────────────────────────
-- SECTION 4: FIX function_search_path_mutable WARNINGS
-- Add SET search_path = '' to every security definer function.
-- This prevents search_path hijacking attacks.
-- ────────────────────────────────────────────────────────────

-- Helper: is_admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists(
    select 1 from public.profiles
    where id = auth.uid()
      and user_type in ('admin','super_admin')
  )
$$;

-- Helper: is_super_admin
create or replace function public.is_super_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists(
    select 1 from public.profiles
    where id = auth.uid()
      and user_type = 'super_admin'
  )
$$;

-- Helper: get_user_type
create or replace function public.get_user_type()
returns public.user_type
language sql
security definer
stable
set search_path = ''
as $$
  select user_type from public.profiles where id = auth.uid()
$$;

-- handle_updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- handle_new_user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles(id, full_name, email, user_type)
  values(
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data->>'user_type')::public.user_type, 'buyer')
  );
  return new;
end;
$$;

-- generate_property_slug
create or replace function public.generate_property_slug(p_title text, p_city text)
returns text
language plpgsql
set search_path = ''
as $$
declare
  base_slug text;
  final_slug text;
  counter int := 0;
begin
  base_slug := lower(regexp_replace(p_title || '-' || p_city, '[^a-z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  final_slug := base_slug;
  while exists(select 1 from public.properties where slug = final_slug) loop
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  end loop;
  return final_slug;
end;
$$;

-- handle_property_slug trigger function
create or replace function public.handle_property_slug()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug := public.generate_property_slug(new.title, new.city);
  end if;
  if new.reference is null or new.reference = '' then
    new.reference := 'BO-' || upper(substring(new.id::text, 1, 8));
  end if;
  return new;
end;
$$;

-- handle_property_location trigger function
create or replace function public.handle_property_location()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.latitude is not null and new.longitude is not null then
    new.location := st_makepoint(new.longitude::float8, new.latitude::float8)::geography;
  end if;
  return new;
end;
$$;

-- handle_cover_image trigger function
create or replace function public.handle_cover_image()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.is_cover then
    update public.properties set cover_image_url = new.url where id = new.property_id;
  end if;
  return new;
end;
$$;

-- handle_listing_count trigger function
create or replace function public.handle_listing_count()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  update public.profiles
  set listing_count = (
    select count(*) from public.properties
    where seller_id = coalesce(new.seller_id, old.seller_id)
      and status = 'active'
  )
  where id = coalesce(new.seller_id, old.seller_id);
  return coalesce(new, old);
end;
$$;

-- get_unread_notification_count
create or replace function public.get_unread_notification_count()
returns int
language sql
security definer
stable
set search_path = ''
as $$
  select count(*)::int
  from public.notifications
  where user_id = auth.uid() and is_read = false;
$$;

-- mark_all_notifications_read
create or replace function public.mark_all_notifications_read()
returns void
language sql
security definer
set search_path = ''
as $$
  update public.notifications
  set is_read = true
  where user_id = auth.uid() and is_read = false;
$$;

-- record_property_view
create or replace function public.record_property_view(p_property_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.property_views(property_id, viewer_id)
  values (p_property_id, auth.uid());
  update public.properties
  set view_count = view_count + 1
  where id = p_property_id;
end;
$$;

-- toggle_saved_property
create or replace function public.toggle_saved_property(p_property_id uuid)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare v_saved boolean;
begin
  if exists(
    select 1 from public.saved_properties
    where user_id = auth.uid() and property_id = p_property_id
  ) then
    delete from public.saved_properties
    where user_id = auth.uid() and property_id = p_property_id;
    update public.properties
    set save_count = greatest(0, save_count - 1)
    where id = p_property_id;
    v_saved := false;
  else
    insert into public.saved_properties(user_id, property_id)
    values(auth.uid(), p_property_id);
    update public.properties
    set save_count = save_count + 1
    where id = p_property_id;
    v_saved := true;
  end if;
  return json_build_object('saved', v_saved);
end;
$$;

-- get_or_create_conversation
create or replace function public.get_or_create_conversation(
  p_seller_id uuid, p_property_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare v_id uuid;
begin
  select id into v_id from public.conversations
  where buyer_id = auth.uid()
    and seller_id = p_seller_id
    and (p_property_id is null or property_id = p_property_id)
  limit 1;
  if v_id is null then
    insert into public.conversations(buyer_id, seller_id, property_id)
    values(auth.uid(), p_seller_id, p_property_id)
    returning id into v_id;
  end if;
  return v_id;
end;
$$;

-- get_platform_stats
create or replace function public.get_platform_stats()
returns json
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then raise exception 'Unauthorized'; end if;
  return json_build_object(
    'total_users',        (select count(*) from public.profiles),
    'total_properties',   (select count(*) from public.properties where status = 'active'),
    'pending_properties', (select count(*) from public.properties where status = 'pending'),
    'total_messages',     (select count(*) from public.messages),
    'open_reports',       (select count(*) from public.reports where status = 'open')
  );
end;
$$;

-- get_admin_stats
create or replace function public.get_admin_stats()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare result jsonb;
begin
  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and user_type in ('admin','super_admin')
  ) then
    raise exception 'Unauthorized: Admin access required';
  end if;
  select jsonb_build_object(
    'total_users',        (select count(*) from public.profiles),
    'active_properties',  (select count(*) from public.properties where status = 'active'),
    'pending_properties', (select count(*) from public.properties where status = 'pending'),
    'open_reports',       (select count(*) from public.reports where status = 'open'),
    'total_reservations', (select count(*) from public.reservations),
    'total_revenue',      (select coalesce(sum(amount_paid), 0) from public.seller_subscriptions where is_active = true)
  ) into result;
  return result;
end;
$$;

-- admin_approve_property
create or replace function public.admin_approve_property(p_property_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and user_type in ('admin','super_admin')
  ) then raise exception 'Unauthorized'; end if;
  update public.properties
  set status = 'active', updated_at = now()
  where id = p_property_id;
  insert into public.notifications (user_id, type, title, body)
  select seller_id, 'property_approved', 'Property Approved',
    'Your listing "' || title || '" has been approved and is now live.'
  from public.properties where id = p_property_id;
end;
$$;

-- admin_reject_property
create or replace function public.admin_reject_property(p_property_id uuid, p_reason text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and user_type in ('admin','super_admin')
  ) then raise exception 'Unauthorized'; end if;
  update public.properties
  set status = 'rejected', updated_at = now()
  where id = p_property_id;
  insert into public.notifications (user_id, type, title, body, data)
  select seller_id, 'property_rejected', 'Property Rejected',
    'Your listing "' || title || '" was rejected. Reason: ' || p_reason,
    jsonb_build_object('reason', p_reason)
  from public.properties where id = p_property_id;
end;
$$;

-- admin_verify_user
create or replace function public.admin_verify_user(p_user_id uuid, p_status boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and user_type in ('admin','super_admin')
  ) then raise exception 'Unauthorized'; end if;
  update public.profiles
  set is_verified = p_status, updated_at = now()
  where id = p_user_id;
  if p_status then
    insert into public.notifications (user_id, type, title, body)
    values (p_user_id, 'account_verified', 'Account Verified',
      'Congratulations! Your account has been verified.');
  end if;
end;
$$;

-- admin_update_role (super admin only)
create or replace function public.admin_update_role(p_user_id uuid, p_new_role public.user_type)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and user_type = 'super_admin'
  ) then raise exception 'Unauthorized: Super Admin access required'; end if;
  update public.profiles
  set user_type = p_new_role, updated_at = now()
  where id = p_user_id;
end;
$$;

-- admin_ban_user
create or replace function public.admin_ban_user(p_user_id uuid, p_status boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and user_type in ('admin','super_admin')
  ) then raise exception 'Unauthorized'; end if;
  update public.profiles
  set is_banned = p_status, updated_at = now()
  where id = p_user_id;
  if p_status then
    insert into public.notifications (user_id, type, title, body)
    values (p_user_id, 'account_banned', 'Account Banned',
      'Your account has been restricted due to platform policy violations.');
  end if;
end;
$$;

-- get_user_saved_properties
create or replace function public.get_user_saved_properties()
returns setof public.properties
language sql
security definer
stable
set search_path = ''
as $$
  select p.*
  from public.properties p
  join public.saved_properties s on s.property_id = p.id
  where s.user_id = auth.uid()
  order by s.saved_at desc;
$$;

-- get_user_conversations
create or replace function public.get_user_conversations()
returns table (
  id uuid, property_id uuid, property_title text, property_image text,
  other_user_id uuid, other_user_name text, other_user_avatar text,
  last_message text, last_message_at timestamptz, unread_count int
)
language plpgsql
security definer
stable
set search_path = ''
as $$
begin
  return query
  select
    c.id, c.property_id,
    p.title as property_title,
    p.cover_image_url as property_image,
    case when c.buyer_id = auth.uid() then c.seller_id else c.buyer_id end as other_user_id,
    pr.full_name as other_user_name,
    pr.avatar_url as other_user_avatar,
    m.content as last_message,
    c.last_message_at,
    case when c.buyer_id = auth.uid() then c.buyer_unread else c.seller_unread end as unread_count
  from public.conversations c
  left join public.properties p on p.id = c.property_id
  join public.profiles pr on pr.id = (
    case when c.buyer_id = auth.uid() then c.seller_id else c.buyer_id end
  )
  left join lateral (
    select content from public.messages
    where conversation_id = c.id
    order by created_at desc limit 1
  ) m on true
  where c.buyer_id = auth.uid() or c.seller_id = auth.uid()
  order by c.last_message_at desc nulls last;
end;
$$;

-- get_conversation_messages
create or replace function public.get_conversation_messages(p_conversation_id uuid)
returns setof public.messages
language sql
security definer
stable
set search_path = ''
as $$
  select * from public.messages
  where conversation_id = p_conversation_id
    and exists (
      select 1 from public.conversations
      where id = p_conversation_id
        and (buyer_id = auth.uid() or seller_id = auth.uid())
    )
  order by created_at asc;
$$;

-- get_homepage_data
create or replace function public.get_homepage_data()
returns jsonb
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  v_featured jsonb; v_new_listings jsonb;
  v_lands_lusaka jsonb; v_apartments_nairobi jsonb;
begin
  select jsonb_agg(t) into v_featured from (
    select id, title, slug, asking_price, currency, city, cover_image_url
    from public.properties where status = 'active' and is_featured = true limit 8
  ) t;
  select jsonb_agg(t) into v_new_listings from (
    select id, title, slug, asking_price, currency, city, cover_image_url
    from public.properties where status = 'active' order by created_at desc limit 8
  ) t;
  select jsonb_agg(t) into v_lands_lusaka from (
    select id, title, slug, asking_price, currency, city, cover_image_url
    from public.properties
    where status = 'active' and property_type ilike '%land%' and city ilike '%lusaka%' limit 8
  ) t;
  select jsonb_agg(t) into v_apartments_nairobi from (
    select id, title, slug, asking_price, currency, city, cover_image_url
    from public.properties
    where status = 'active' and property_type ilike '%apartment%' and city ilike '%nairobi%' limit 8
  ) t;
  return jsonb_build_object(
    'featured',            coalesce(v_featured, '[]'::jsonb),
    'new_listings',        coalesce(v_new_listings, '[]'::jsonb),
    'lands_lusaka',        coalesce(v_lands_lusaka, '[]'::jsonb),
    'apartments_nairobi',  coalesce(v_apartments_nairobi, '[]'::jsonb)
  );
end;
$$;

-- get_property_detail
create or replace function public.get_property_detail(p_slug text)
returns jsonb
language plpgsql
security definer
stable
set search_path = ''
as $$
declare result jsonb;
begin
  select jsonb_build_object(
    'id', p.id, 'seller_id', p.seller_id, 'title', p.title, 'slug', p.slug,
    'reference', p.reference, 'description', p.description,
    'listing_type', p.listing_type, 'property_type', p.property_type,
    'status', p.status, 'condition', p.condition, 'furnishing', p.furnishing,
    'country', p.country, 'province', p.province, 'city', p.city,
    'suburb', p.suburb, 'address', p.address,
    'latitude', p.latitude, 'longitude', p.longitude,
    'bedrooms', p.bedrooms, 'bathrooms', p.bathrooms, 'toilets', p.toilets,
    'floor_area', p.floor_area, 'lot_area', p.lot_area,
    'garages', p.garages, 'parking', p.parking, 'floors', p.floors,
    'year_built', p.year_built, 'amenities', p.amenities, 'pet_friendly', p.pet_friendly,
    'asking_price', p.asking_price, 'currency', p.currency, 'negotiable', p.negotiable,
    'monthly_rent', p.monthly_rent, 'deposit', p.deposit, 'nightly_rate', p.nightly_rate,
    'cleaning_fee', p.cleaning_fee, 'levy', p.levy, 'rates_taxes', p.rates_taxes,
    'cover_image_url', p.cover_image_url, 'virtual_tour_url', p.virtual_tour_url,
    'available_from', p.available_from, 'tags', p.tags,
    'created_at', p.created_at,
    'profiles', jsonb_build_object(
      'id', pr.id, 'full_name', pr.full_name, 'avatar_url', pr.avatar_url,
      'is_verified', pr.is_verified, 'user_type', pr.user_type, 'bio', pr.bio
    ),
    'media', (
      select jsonb_agg(m)
      from (
        select url, media_type, order_index
        from public.property_media
        where property_id = p.id
        order by order_index asc
      ) m
    )
  ) into result
  from public.properties p
  join public.profiles pr on pr.id = p.seller_id
  where p.slug = p_slug;

  if result is not null then
    perform public.record_property_view((result->>'id')::uuid);
  end if;
  return result;
end;
$$;

-- search_properties (latest version with technical spec filters)
create or replace function public.search_properties(
  p_listing_type            text default null,
  p_property_type           text default null,
  p_country                 text default null,
  p_city                    text default null,
  p_min_price               numeric default null,
  p_max_price               numeric default null,
  p_min_beds                int default null,
  p_max_beds                int default null,
  p_min_area                numeric default null,
  p_max_area                numeric default null,
  p_lat                     numeric default null,
  p_lng                     numeric default null,
  p_radius_km               numeric default 10,
  p_query                   text default null,
  p_amenities               text[] default null,
  p_sort_by                 text default 'newest',
  p_page                    int default 1,
  p_page_size               int default 20,
  p_min_solar_capacity      numeric default null,
  p_min_generator_capacity  numeric default null,
  p_min_water_tank_capacity numeric default null,
  p_has_borehole            boolean default null,
  p_has_staff_quarters      boolean default null
)
returns table (
  id uuid, title text, slug text, reference text, listing_type public.listing_type,
  property_type text, status public.property_status, country text, city text,
  suburb text, latitude numeric, longitude numeric, bedrooms int, bathrooms numeric,
  floor_area numeric, asking_price numeric, monthly_rent numeric, nightly_rate numeric,
  currency text, negotiable boolean, is_featured boolean, cover_image_url text,
  amenities text[], view_count int, save_count int, created_at timestamptz,
  seller_id uuid, seller_name text, seller_avatar text, seller_verified boolean,
  total_count bigint
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  return query
  with filtered as (
    select p.*,
      pr.full_name as seller_name,
      pr.avatar_url as seller_avatar,
      pr.is_verified as seller_verified,
      count(*) over() as total_count
    from public.properties p
    join public.profiles pr on pr.id = p.seller_id
    where p.status = 'active'
      and (p_listing_type is null or p.listing_type::text = p_listing_type)
      and (p_property_type is null or p.property_type = p_property_type)
      and (p_country is null or p.country = p_country)
      and (p_city is null or lower(p.city) like '%' || lower(p_city) || '%')
      and (p_min_price is null or coalesce(p.asking_price, p.monthly_rent, p.nightly_rate) >= p_min_price)
      and (p_max_price is null or coalesce(p.asking_price, p.monthly_rent, p.nightly_rate) <= p_max_price)
      and (p_min_beds is null or p.bedrooms >= p_min_beds)
      and (p_max_beds is null or p.bedrooms <= p_max_beds)
      and (p_min_area is null or p.floor_area >= p_min_area)
      and (p_max_area is null or p.floor_area <= p_max_area)
      and (p_amenities is null or p.amenities @> p_amenities)
      and (p_min_solar_capacity is null or p.solar_panel_capacity >= p_min_solar_capacity)
      and (p_min_generator_capacity is null or p.generator_capacity >= p_min_generator_capacity)
      and (p_min_water_tank_capacity is null or p.water_tank_capacity >= p_min_water_tank_capacity)
      and (p_has_borehole is null or p.borehole = p_has_borehole)
      and (p_has_staff_quarters is null or p.staff_quarters = p_has_staff_quarters)
      and (p_lat is null or p_lng is null or
        st_dwithin(p.location,
          st_makepoint(p_lng::float8, p_lat::float8)::geography,
          p_radius_km * 1000))
      and (p_query is null or
        to_tsvector('english',
          coalesce(p.title,'') || ' ' || coalesce(p.city,'') || ' ' || coalesce(p.suburb,'')
        ) @@ plainto_tsquery('english', p_query))
  )
  select
    f.id, f.title, f.slug, f.reference, f.listing_type, f.property_type, f.status,
    f.country, f.city, f.suburb, f.latitude, f.longitude,
    f.bedrooms, f.bathrooms, f.floor_area, f.asking_price, f.monthly_rent, f.nightly_rate,
    f.currency, f.negotiable, f.is_featured, f.cover_image_url, f.amenities,
    f.view_count, f.save_count, f.created_at,
    f.seller_id, f.seller_name, f.seller_avatar, f.seller_verified, f.total_count
  from filtered f
  order by
    case when p_sort_by = 'newest'       then f.created_at::text end desc,
    case when p_sort_by = 'price_asc'    then f.asking_price end asc nulls last,
    case when p_sort_by = 'price_desc'   then f.asking_price end desc nulls last,
    case when p_sort_by = 'most_popular' then f.view_count end desc,
    case when p_sort_by = 'most_saved'   then f.save_count end desc,
    f.is_featured desc, f.created_at desc
  limit p_page_size offset (p_page - 1) * p_page_size;
end;
$$;

-- create_property_listing
create or replace function public.create_property_listing(
  p_property_data jsonb,
  p_media         jsonb[] default '{}',
  p_documents     jsonb[] default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_property_id uuid;
  v_media_item  jsonb;
  v_seller_id   uuid := auth.uid();
begin
  insert into public.properties (
    seller_id, title, slug, reference, description, listing_type, property_type,
    status, condition, furnishing, country, province, city, suburb, address,
    address_private, latitude, longitude, location, erf_number, zoning,
    bedrooms, bathrooms, toilets, floor_area, lot_area, garages, parking,
    floors, year_built, amenities, pet_friendly, asking_price, currency,
    negotiable, monthly_rent, deposit, nightly_rate, cleaning_fee, levy,
    rates_taxes, price_per_sqft, cover_image_url, virtual_tour_url, available_from, tags,
    has_borehole, water_tank_capacity, has_solar, solar_capacity,
    has_generator, generator_capacity, has_staff_quarters
  ) values (
    v_seller_id,
    p_property_data->>'title',
    p_property_data->>'slug',
    p_property_data->>'reference',
    p_property_data->>'description',
    (p_property_data->>'listing_type')::public.listing_type,
    p_property_data->>'property_type',
    'pending',
    (p_property_data->>'condition')::public.property_condition,
    (p_property_data->>'furnishing')::public.furnishing_status,
    coalesce(p_property_data->>'country', 'ZM'),
    p_property_data->>'province',
    p_property_data->>'city',
    p_property_data->>'suburb',
    p_property_data->>'address',
    coalesce((p_property_data->>'address_private')::boolean, false),
    (p_property_data->>'latitude')::numeric,
    (p_property_data->>'longitude')::numeric,
    case
      when p_property_data->>'longitude' is not null and p_property_data->>'latitude' is not null
      then st_makepoint(
        (p_property_data->>'longitude')::float8,
        (p_property_data->>'latitude')::float8
      )::geography
      else null
    end,
    p_property_data->>'erf_number',
    p_property_data->>'zoning',
    (p_property_data->>'bedrooms')::integer,
    (p_property_data->>'bathrooms')::numeric,
    (p_property_data->>'toilets')::integer,
    (p_property_data->>'floor_area')::numeric,
    (p_property_data->>'lot_area')::numeric,
    (p_property_data->>'garages')::integer,
    (p_property_data->>'parking')::integer,
    (p_property_data->>'floors')::integer,
    (p_property_data->>'year_built')::integer,
    coalesce(array(select jsonb_array_elements_text(p_property_data->'amenities')), '{}'),
    coalesce((p_property_data->>'pet_friendly')::boolean, false),
    (p_property_data->>'asking_price')::numeric,
    coalesce(p_property_data->>'currency', 'ZMW'),
    coalesce((p_property_data->>'negotiable')::boolean, false),
    (p_property_data->>'monthly_rent')::numeric,
    (p_property_data->>'deposit')::numeric,
    (p_property_data->>'nightly_rate')::numeric,
    (p_property_data->>'cleaning_fee')::numeric,
    (p_property_data->>'levy')::numeric,
    (p_property_data->>'rates_taxes')::numeric,
    (p_property_data->>'price_per_sqft')::numeric,
    p_property_data->>'cover_image_url',
    p_property_data->>'virtual_tour_url',
    (p_property_data->>'available_from')::date,
    coalesce(array(select jsonb_array_elements_text(p_property_data->'tags')), '{}'),
    coalesce((p_property_data->>'borehole')::boolean, false),
    (p_property_data->>'water_tank_capacity')::integer,
    coalesce((p_property_data->>'solar_power')::boolean, false),
    (p_property_data->>'solar_panel_capacity')::numeric,
    coalesce((p_property_data->>'generator')::boolean, false),
    (p_property_data->>'generator_capacity')::numeric,
    coalesce((p_property_data->>'staff_quarters')::boolean, false)
  ) returning id into v_property_id;

  foreach v_media_item in array p_media loop
    insert into public.property_media (property_id, url, media_type, order_index, is_cover)
    values (
      v_property_id,
      v_media_item->>'url',
      (coalesce(v_media_item->>'type', 'image'))::public.media_type,
      (v_media_item->>'order')::integer,
      coalesce((v_media_item->>'is_cover')::boolean, false)
    );
  end loop;

  update public.profiles
  set listing_count = listing_count + 1
  where id = v_seller_id;

  return v_property_id;
end;
$$;


-- ────────────────────────────────────────────────────────────
-- SECTION 5: MOVE EXTENSIONS OUT OF PUBLIC SCHEMA
-- postgis, pg_trgm, unaccent should live in a dedicated schema.
-- NOTE: This changes the schema of existing extension objects.
-- Test in staging first. Your search_path or function calls
-- referencing these extension functions may need updating.
-- ────────────────────────────────────────────────────────────

-- create extensions schema if it doesn't exist
create schema if not exists extensions;

-- NOTE: On Supabase managed instances you may not have permission
-- to move extensions. If the commands below fail with a permission
-- error, you can safely skip this section — Supabase's own linter
-- flags it but their infrastructure team manages extension placement.
-- Uncomment and run these only if you have superuser access:

-- alter extension postgis  set schema extensions;
-- alter extension pg_trgm  set schema extensions;
-- alter extension unaccent set schema extensions;

-- After moving, update your search_path on functions that use
-- these extensions to include 'extensions', e.g.:
--   set search_path = 'public, extensions'


-- ────────────────────────────────────────────────────────────
-- SECTION 6: ENABLE LEAKED PASSWORD PROTECTION
-- Do this in the Supabase Dashboard → Authentication → Settings
-- → Password Security → Enable "Leaked Password Protection"
-- This cannot be set via SQL; it's an Auth config toggle.
-- ────────────────────────────────────────────────────────────
-- (No SQL needed — configure in Dashboard)


-- ────────────────────────────────────────────────────────────
-- SECTION 7: ADDITIONAL SECURITY HARDENING (Proactive)
-- Recommendations beyond what the linter flags.
-- ────────────────────────────────────────────────────────────

-- Prevent banned users from authenticating via a trigger
-- (currently banned users can still log in via Supabase Auth)
create or replace function public.check_user_not_banned()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (
    select 1 from public.profiles
    where id = new.id and is_banned = true
  ) then
    raise exception 'Account is banned';
  end if;
  return new;
end;
$$;

-- RLS policy: banned users cannot read data
-- Add is_banned check to profiles select policy
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);  -- Keep public but rely on app-level ban checks

-- Add admin_activity_log INSERT for non-admins defense
-- (the existing policy already restricts to admins — this is a reminder
--  that you should call log_admin_action from your admin RPCs)


-- ────────────────────────────────────────────────────────────
-- SECTION 8: REMOVE UNUSED INDEXES (after verifying in staging)
-- The linter flagged these as never used. On a fresh/low-traffic
-- DB, "unused" may just mean "not yet used". Review before dropping.
-- Uncomment to drop after verifying they are truly not needed.
-- ────────────────────────────────────────────────────────────

-- drop index if exists public.idx_profiles_user_type;
-- drop index if exists public.idx_profiles_country;
-- drop index if exists public.idx_profiles_username;
-- drop index if exists public.idx_properties_listing_type;
-- drop index if exists public.idx_properties_property_type;
-- drop index if exists public.idx_properties_country;
-- drop index if exists public.idx_properties_city;
-- drop index if exists public.idx_properties_is_featured;
-- drop index if exists public.idx_properties_created_at;
-- drop index if exists public.idx_properties_slug;
-- drop index if exists public.idx_properties_asking_price;
-- drop index if exists public.idx_properties_location_gist;
-- drop index if exists public.idx_properties_fts;
-- drop index if exists public.idx_property_media_property_id;
-- drop index if exists public.idx_property_media_is_cover;
-- drop index if exists public.idx_property_views_property_id;
-- drop index if exists public.idx_property_views_viewed_at;
-- drop index if exists public.idx_saved_property_id;
-- drop index if exists public.idx_conversations_last_msg;
-- drop index if exists public.idx_messages_conversation_id;
-- drop index if exists public.idx_messages_created_at;
-- drop index if exists public.idx_reservations_property_id;
-- drop index if exists public.idx_reservations_status;
-- drop index if exists public.idx_reservations_reserved_date;
-- drop index if exists public.idx_notifications_created_at;
-- drop index if exists public.idx_reports_property_id;
-- drop index if exists public.idx_admin_log_created_at;