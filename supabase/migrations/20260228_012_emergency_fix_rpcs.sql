-- ============================================================
-- BlueOak — Emergency Fix v7: Definitive Structural Restoration
-- ============================================================

-- 1. DROP ALL VERSIONS of search_properties using the reliable DO block
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT oid::regprocedure as proc_name
              FROM pg_proc
              WHERE proname = 'search_properties'
                AND pronamespace = 'public'::regnamespace)
    LOOP
        EXECUTE 'DROP FUNCTION ' || r.proc_name;
    END LOOP;
END $$;

-- 2. Restore get_feature_category_counts (Inventory Count)
CREATE OR REPLACE FUNCTION public.get_feature_category_counts()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_catalog
AS $$
DECLARE
  v_villas_count INTEGER;
  v_penthouses_count INTEGER;
  v_student_count INTEGER;
  v_land_count INTEGER;
BEGIN
  -- Count ALL Active Villas
  SELECT count(*) INTO v_villas_count
  FROM public.properties
  WHERE (property_type = 'villa' OR (property_type = 'house' AND coalesce(asking_price, monthly_rent) >= 1000000))
    AND status::text = 'active';

  -- Count ALL Active Penthouses
  SELECT count(*) INTO v_penthouses_count
  FROM public.properties
  WHERE property_type = 'penthouse'
    AND status::text = 'active';

  -- Count ALL Active Student Accommodation
  SELECT count(*) INTO v_student_count
  FROM public.properties
  WHERE property_type = 'student_accom'
    AND status::text = 'active';

  -- Count ALL Active Land
  SELECT count(*) INTO v_land_count
  FROM public.properties
  WHERE property_type IN ('residential_plot', 'commercial_plot', 'agricultural_plot')
    AND status::text = 'active';

  RETURN json_build_object(
    'villas', COALESCE(v_villas_count, 0),
    'penthouses', COALESCE(v_penthouses_count, 0),
    'student_accommodation', COALESCE(v_student_count, 0),
    'land', COALESCE(v_land_count, 0)
  );
END;
$$;

-- 3. Re-create search_properties based on the successful Feb 27th logic
CREATE OR REPLACE FUNCTION public.search_properties(
  p_listing_type          text default null,
  p_property_type         text default null,
  p_country               text default null,
  p_city                  text default null,
  p_min_price             numeric default null,
  p_max_price             numeric default null,
  p_min_beds              int default null,
  p_max_beds              int default null,
  p_min_area              numeric default null,
  p_max_area              numeric default null,
  p_lat                   numeric default null,
  p_lng                   numeric default null,
  p_radius_km             numeric default 10,
  p_query                 text default null,
  p_amenities             text[] default null,
  p_sort_by               text default 'newest',
  p_page                  int default 0,
  p_page_size             int default 20,
  p_min_solar_capacity    numeric default null,
  p_min_generator_capacity numeric default null,
  p_min_water_tank_capacity numeric default null,
  p_has_borehole          boolean default null,
  p_has_staff_quarters    boolean default null,
  p_is_featured           boolean default null
) returns table (
  id uuid, title text, slug text, reference text, listing_type text,
  property_type text, status text, country text, city text,
  suburb text, latitude numeric, longitude numeric, bedrooms int, bathrooms numeric,
  floor_area numeric, asking_price numeric, monthly_rent numeric, nightly_rate numeric,
  currency text, negotiable boolean, is_featured boolean, cover_image_url text,
  amenities text[], view_count int, save_count int, created_at timestamptz,
  seller_id uuid, seller_name text, seller_avatar text, seller_verified boolean,
  total_count bigint
) language plpgsql security definer 
SET search_path = public, extensions, pg_catalog
AS $$
begin
  return query
  with filtered as (
    select 
      p.*, 
      pr.full_name as seller_name, 
      pr.avatar_url as seller_avatar, 
      pr.is_verified as seller_verified,
      count(*) over() as total_count_raw
    from public.properties p
    left join public.profiles pr on pr.id = p.seller_id
    where p.status::text = 'active'
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
      and (p_is_featured is null or p.is_featured = p_is_featured)
      -- Technical Specs (Surgical Schema Alignment)
      and (p_min_solar_capacity is null or p.solar_panel_capacity >= p_min_solar_capacity)
      and (p_min_generator_capacity is null or p.generator_capacity >= p_min_generator_capacity)
      and (p_min_water_tank_capacity is null or p.water_tank_capacity >= p_min_water_tank_capacity)
      and (p_has_borehole is null or p.borehole = p_has_borehole)
      and (p_has_staff_quarters is null or p.staff_quarters = p_has_staff_quarters)
      -- Geo Distance (PostGIS)
      and (p_lat is null or p_lng is null or
        st_dwithin(p.location, st_makepoint(p_lng::float8, p_lat::float8)::geography, p_radius_km * 1000))
      -- Query (Supports City/Suburb/Title)
      and (p_query is null or (
           p.title ilike '%' || p_query || '%' or 
           p.city ilike '%' || p_query || '%' or 
           p.suburb ilike '%' || p_query || '%' or
           p.description ilike '%' || p_query || '%'
          ))
  )
  select 
    f.id, f.title, f.slug, f.reference, f.listing_type::text, 
    f.property_type, f.status::text, f.country, f.city, f.suburb, 
    f.latitude, f.longitude, f.bedrooms, f.bathrooms, f.floor_area, 
    f.asking_price, f.monthly_rent, f.nightly_rate, f.currency, 
    f.negotiable, f.is_featured, f.cover_image_url, f.amenities, 
    f.view_count, f.save_count, f.created_at, 
    f.seller_id, f.seller_name, f.seller_avatar, f.seller_verified, 
    f.total_count_raw
  from filtered f
  order by
    case when p_sort_by = 'price_asc'    then coalesce(f.asking_price, f.monthly_rent, f.nightly_rate) end asc,
    case when p_sort_by = 'price_desc'   then coalesce(f.asking_price, f.monthly_rent, f.nightly_rate) end desc,
    case when p_sort_by = 'most_popular' then f.view_count end desc,
    case when p_sort_by = 'most_saved'   then f.save_count end desc,
    f.is_featured desc, f.created_at desc
  limit p_page_size 
  offset p_page * p_page_size;
end;
$$;

-- 4. Grant access to everyone
GRANT EXECUTE ON FUNCTION public.search_properties TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_feature_category_counts TO anon, authenticated, service_role;
