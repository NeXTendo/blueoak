-- BlueOak — Dynamic Content RPCs
-- Powering the frontend with efficient, server-side data fetching

-- 1. Get User Saved Properties
create or replace function public.get_user_saved_properties()
returns setof public.properties language sql security definer stable as $$
  select p.*
  from public.properties p
  join public.saved_properties s on s.property_id = p.id
  where s.user_id = auth.uid()
  order by s.saved_at desc;
$$;

-- 2. Get User Conversations with Metadata
create or replace function public.get_user_conversations()
returns table (
  id uuid,
  property_id uuid,
  property_title text,
  property_image text,
  other_user_id uuid,
  other_user_name text,
  other_user_avatar text,
  last_message text,
  last_message_at timestamptz,
  unread_count int
) language plpgsql security definer stable as $$
begin
  return query
  select 
    c.id,
    c.property_id,
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
  join public.profiles pr on pr.id = (case when c.buyer_id = auth.uid() then c.seller_id else c.buyer_id end)
  left join lateral (
    select content from public.messages 
    where conversation_id = c.id 
    order by created_at desc limit 1
  ) m on true
  where c.buyer_id = auth.uid() or c.seller_id = auth.uid()
  order by c.last_message_at desc nulls last;
end;
$$;

-- 3. Get Conversation Messages
create or replace function public.get_conversation_messages(p_conversation_id uuid)
returns setof public.messages language sql security definer stable as $$
  select * from public.messages
  where conversation_id = p_conversation_id
    and (
      exists (
        select 1 from public.conversations 
        where id = p_conversation_id 
        and (buyer_id = auth.uid() or seller_id = auth.uid())
      )
    )
  order by created_at asc;
$$;

-- 4. Get Homepage Sections (Consolidated)
create or replace function public.get_homepage_data()
returns jsonb language plpgsql security definer stable as $$
declare
  v_featured jsonb;
  v_new_listings jsonb;
  v_lands_lusaka jsonb;
  v_apartments_nairobi jsonb;
begin
  -- Featured
  select jsonb_agg(t) into v_featured from (
    select id, title, slug, asking_price, currency, city, cover_image_url 
    from public.properties where status = 'active' and is_featured = true limit 8
  ) t;

  -- New Listings
  select jsonb_agg(t) into v_new_listings from (
    select id, title, slug, asking_price, currency, city, cover_image_url 
    from public.properties where status = 'active' order by created_at desc limit 8
  ) t;

  -- Lands in Lusaka
  select jsonb_agg(t) into v_lands_lusaka from (
    select id, title, slug, asking_price, currency, city, cover_image_url 
    from public.properties where status = 'active' and property_type ilike '%land%' and city ilike '%lusaka%' limit 8
  ) t;

  -- Apartments in Nairobi
  select jsonb_agg(t) into v_apartments_nairobi from (
    select id, title, slug, asking_price, currency, city, cover_image_url 
    from public.properties where status = 'active' and property_type ilike '%apartment%' and city ilike '%nairobi%' limit 8
  ) t;

  return jsonb_build_object(
    'featured', coalesce(v_featured, '[]'::jsonb),
    'new_listings', coalesce(v_new_listings, '[]'::jsonb),
    'lands_lusaka', coalesce(v_lands_lusaka, '[]'::jsonb),
    'apartments_nairobi', coalesce(v_apartments_nairobi, '[]'::jsonb)
  );
end;
$$;
