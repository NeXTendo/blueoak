-- ============================================================
-- BlueOak — Fix Property Detail & Homepage Data (Patch)
-- ============================================================

-- FIX 1: get_homepage_data — expand returned columns so cards
--         show listing_type, bedrooms, bathrooms, suburb, is_featured
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
    select id, title, slug, listing_type, property_type,
           asking_price, monthly_rent, nightly_rate, currency,
           city, suburb, bedrooms, bathrooms, floor_area,
           cover_image_url, is_featured, status, created_at
    from public.properties
    where status = 'active' and is_featured = true
    order by updated_at desc limit 8
  ) t;

  select jsonb_agg(t) into v_new_listings from (
    select id, title, slug, listing_type, property_type,
           asking_price, monthly_rent, nightly_rate, currency,
           city, suburb, bedrooms, bathrooms, floor_area,
           cover_image_url, is_featured, status, created_at
    from public.properties
    where status = 'active'
    order by created_at desc limit 8
  ) t;

  select jsonb_agg(t) into v_lands_lusaka from (
    select id, title, slug, listing_type, property_type,
           asking_price, monthly_rent, nightly_rate, currency,
           city, suburb, bedrooms, bathrooms, floor_area,
           cover_image_url, is_featured, status, created_at
    from public.properties
    where status = 'active'
      and property_type ilike '%land%'
      and city ilike '%lusaka%'
    limit 8
  ) t;

  select jsonb_agg(t) into v_apartments_nairobi from (
    select id, title, slug, listing_type, property_type,
           asking_price, monthly_rent, nightly_rate, currency,
           city, suburb, bedrooms, bathrooms, floor_area,
           cover_image_url, is_featured, status, created_at
    from public.properties
    where status = 'active'
      and property_type ilike '%apartment%'
      and city ilike '%nairobi%'
    limit 8
  ) t;

  return jsonb_build_object(
    'featured',           coalesce(v_featured, '[]'::jsonb),
    'new_listings',       coalesce(v_new_listings, '[]'::jsonb),
    'lands_lusaka',       coalesce(v_lands_lusaka, '[]'::jsonb),
    'apartments_nairobi', coalesce(v_apartments_nairobi, '[]'::jsonb)
  );
end;
$$;


-- FIX 2: get_property_detail — remove references to non-existent technical columns
--         (has_borehole, has_solar, solar_capacity, has_generator, generator_capacity,
--          has_staff_quarters, water_tank_capacity) which don't exist in the properties table.
--         Also remove status filter so pending properties are viewable by owner/admin.
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
    'id', p.id,
    'seller_id', p.seller_id,
    'title', p.title,
    'slug', p.slug,
    'reference', p.reference,
    'description', p.description,
    'listing_type', p.listing_type,
    'property_type', p.property_type,
    'status', p.status,
    'condition', p.condition,
    'furnishing', p.furnishing,
    'country', p.country,
    'province', p.province,
    'city', p.city,
    'suburb', p.suburb,
    'address', p.address,
    'latitude', p.latitude,
    'longitude', p.longitude,
    'bedrooms', p.bedrooms,
    'bathrooms', p.bathrooms,
    'toilets', p.toilets,
    'floor_area', p.floor_area,
    'lot_area', p.lot_area,
    'garages', p.garages,
    'parking', p.parking,
    'floors', p.floors,
    'year_built', p.year_built,
    'amenities', p.amenities,
    'pet_friendly', p.pet_friendly,
    'asking_price', p.asking_price,
    'currency', p.currency,
    'negotiable', p.negotiable,
    'monthly_rent', p.monthly_rent,
    'deposit', p.deposit,
    'nightly_rate', p.nightly_rate,
    'cleaning_fee', p.cleaning_fee,
    'levy', p.levy,
    'rates_taxes', p.rates_taxes,
    'price_per_sqft', p.price_per_sqft,
    'cover_image_url', p.cover_image_url,
    'virtual_tour_url', p.virtual_tour_url,
    'available_from', p.available_from,
    'tags', p.tags,
    'is_featured', p.is_featured,
    'view_count', p.view_count,
    'save_count', p.save_count,
    'created_at', p.created_at,
    'updated_at', p.updated_at,
    'profiles', jsonb_build_object(
      'id', pr.id,
      'full_name', pr.full_name,
      'avatar_url', pr.avatar_url,
      'is_verified', pr.is_verified,
      'user_type', pr.user_type,
      'bio', pr.bio,
      'phone', pr.phone,
      'whatsapp', pr.whatsapp,
      'agency_name', pr.agency_name,
      'rating', pr.rating,
      'listing_count', pr.listing_count
    ),
    'media', (
      select coalesce(jsonb_agg(m order by m.order_index), '[]'::jsonb)
      from (
        select url, media_type, order_index, is_cover
        from public.property_media
        where property_id = p.id
      ) m
    )
  ) into result
  from public.properties p
  join public.profiles pr on pr.id = p.seller_id
  where p.slug = p_slug
    and (
      p.status = 'active'
      or p.seller_id = (select auth.uid())
      or exists (
        select 1 from public.profiles
        where id = (select auth.uid())
          and user_type in ('admin', 'super_admin')
      )
    );

  if result is not null then
    perform public.record_property_view((result->>'id')::uuid);
  end if;

  return result;
end;
$$;


-- FIX 3: search_properties pagination and overload resolution
--   Frontend sends p_page starting at 0 (0-indexed).
--   RPC used (p_page - 1) assuming 1-indexed, causing offset = -1 * page_size on first page.
--   Fix: use p_page directly as 0-based offset multiplier.
--   Also explicitly DROP all existing search_properties overloads.

do $$
declare func_rec record;
begin
  for func_rec in select oid::regprocedure as signature from pg_proc where proname = 'search_properties'
  loop
    execute 'drop function if exists ' || func_rec.signature || ' cascade;';
  end loop;
end $$;

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
  p_page                    int default 0,
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
set search_path = public, extensions, pg_catalog
as $$
begin
  return query
  with filtered as (
    select p.*, pr.full_name as seller_name, pr.avatar_url as seller_avatar,
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
      and (p_lat is null or p_lng is null or
        st_dwithin(p.location, st_makepoint(p_lng::float8, p_lat::float8)::geography, p_radius_km * 1000))
      and (p_query is null or
        to_tsvector('english', coalesce(p.title,'') || ' ' || coalesce(p.city,'') || ' ' || coalesce(p.suburb,''))
        @@ plainto_tsquery('english', p_query))
  )
  select f.id, f.title, f.slug, f.reference, f.listing_type, f.property_type, f.status,
    f.country, f.city, f.suburb, f.latitude, f.longitude,
    f.bedrooms, f.bathrooms, f.floor_area, f.asking_price, f.monthly_rent, f.nightly_rate,
    f.currency, f.negotiable, f.is_featured, f.cover_image_url, f.amenities,
    f.view_count, f.save_count, f.created_at,
    f.seller_id, f.seller_name, f.seller_avatar, f.seller_verified, f.total_count
  from filtered f
  order by
    case when p_sort_by = 'newest'       then f.created_at::text end desc,
    case when p_sort_by = 'price_asc'    then f.asking_price end asc  nulls last,
    case when p_sort_by = 'price_desc'   then f.asking_price end desc nulls last,
    case when p_sort_by = 'most_popular' then f.view_count end desc,
    case when p_sort_by = 'most_saved'   then f.save_count end desc,
    f.is_featured desc, f.created_at desc
  limit p_page_size offset p_page * p_page_size;
end;
$$;
