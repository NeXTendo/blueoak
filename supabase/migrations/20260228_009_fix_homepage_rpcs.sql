-- ============================================================
-- BlueOak — Fix Homepage RPCs (Category Counts & Stats)
-- ============================================================

-- 1. Fix get_feature_category_counts
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
  -- Count Villas (Villa slug + House with high value)
  SELECT count(*) INTO v_villas_count
  FROM public.properties
  WHERE (property_type = 'villa' OR (property_type = 'house' AND coalesce(asking_price, monthly_rent) >= 1000000))
    AND status = 'active';

  -- Count Penthouses (Penthouse slug)
  SELECT count(*) INTO v_penthouses_count
  FROM public.properties
  WHERE property_type = 'penthouse'
    AND status = 'active';

  -- Count Student Accommodation (student_accom slug)
  SELECT count(*) INTO v_student_count
  FROM public.properties
  WHERE property_type = 'student_accom'
    AND status = 'active';

  -- Count Land (residential_plot slug)
  SELECT count(*) INTO v_land_count
  FROM public.properties
  WHERE property_type IN ('residential_plot', 'commercial_plot', 'agricultural_plot')
    AND status = 'active';

  RETURN json_build_object(
    'villas', COALESCE(v_villas_count, 0),
    'penthouses', COALESCE(v_penthouses_count, 0),
    'student_accommodation', COALESCE(v_student_count, 0),
    'land', COALESCE(v_land_count, 0)
  );
END;
$$;

-- 2. Fix get_platform_stats
CREATE OR REPLACE FUNCTION public.get_platform_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_catalog
AS $$
DECLARE
  v_active_listings INTEGER;
  v_countries INTEGER;
  v_assets_value NUMERIC;
  v_verified_buyers INTEGER;
BEGIN
  -- Count total properties
  SELECT count(*) INTO v_active_listings FROM public.properties WHERE status = 'active';
  
  -- Count distinct countries
  SELECT count(DISTINCT country) INTO v_countries FROM public.properties WHERE status = 'active' AND country IS NOT NULL AND country != '';
  
  -- Sum total value of all properties (using asking_price as base value)
  SELECT sum(coalesce(asking_price, monthly_rent * 10, 0)) INTO v_assets_value FROM public.properties WHERE status = 'active';
  
  -- Count verified buyers
  SELECT count(*) INTO v_verified_buyers FROM public.profiles WHERE is_verified = true;

  RETURN json_build_object(
    'active_listings', COALESCE(v_active_listings, 0),
    'countries', COALESCE(v_countries, 0),
    'assets_value', COALESCE(v_assets_value, 0),
    'verified_buyers', COALESCE(v_verified_buyers, 0)
  );
END;
$$;

-- 3. Enhance get_homepage_data with fallback for featured
CREATE OR REPLACE FUNCTION public.get_homepage_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, extensions, pg_catalog
AS $$
DECLARE
  v_featured jsonb; v_new_listings jsonb;
  v_lands_lusaka jsonb; v_apartments_nairobi jsonb;
BEGIN
  -- Featured (Fall back to latest if none are marked as featured)
  select jsonb_agg(t) into v_featured from (
    select id, title, slug, listing_type, property_type,
           asking_price, monthly_rent, nightly_rate, currency,
           city, suburb, bedrooms, bathrooms, floor_area,
           cover_image_url, is_featured, status, created_at
    from public.properties
    where status = 'active' 
    order by is_featured desc, created_at desc limit 8
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
      and property_type in ('residential_plot', 'commercial_plot', 'agricultural_plot')
      and (city ilike '%lusaka%' or city ilike '%zambia%')
    limit 8
  ) t;

  select jsonb_agg(t) into v_apartments_nairobi from (
    select id, title, slug, listing_type, property_type,
           asking_price, monthly_rent, nightly_rate, currency,
           city, suburb, bedrooms, bathrooms, floor_area,
           cover_image_url, is_featured, status, created_at
    from public.properties
    where status = 'active'
      and property_type in ('apartment', 'penthouse', 'studio')
      and (city ilike '%nairobi%' or city ilike '%kenya%')
    limit 8
  ) t;

  return jsonb_build_object(
    'featured',           coalesce(v_featured, '[]'::jsonb),
    'new_listings',       coalesce(v_new_listings, '[]'::jsonb),
    'lands_lusaka',       coalesce(v_lands_lusaka, '[]'::jsonb),
    'apartments_nairobi', coalesce(v_apartments_nairobi, '[]'::jsonb)
  );
END;
$$;
