-- ============================================================
-- BlueOak — Fix Featured Filtering in RPCs
-- ============================================================

-- 1. Update get_feature_category_counts to filter by is_featured
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
  -- Count Featured Villas
  SELECT count(*) INTO v_villas_count
  FROM public.properties
  WHERE (property_type = 'villa' OR (property_type = 'house' AND coalesce(asking_price, monthly_rent) >= 1000000))
    AND status = 'active'
    AND is_featured = true;

  -- Count Featured Penthouses
  SELECT count(*) INTO v_penthouses_count
  FROM public.properties
  WHERE property_type = 'penthouse'
    AND status = 'active'
    AND is_featured = true;

  -- Count Featured Student Accommodation
  SELECT count(*) INTO v_student_count
  FROM public.properties
  WHERE property_type = 'student_accom'
    AND status = 'active'
    AND is_featured = true;

  -- Count Featured Land
  SELECT count(*) INTO v_land_count
  FROM public.properties
  WHERE property_type IN ('residential_plot', 'commercial_plot', 'agricultural_plot')
    AND status = 'active'
    AND is_featured = true;

  RETURN json_build_object(
    'villas', COALESCE(v_villas_count, 0),
    'penthouses', COALESCE(v_penthouses_count, 0),
    'student_accommodation', COALESCE(v_student_count, 0),
    'land', COALESCE(v_land_count, 0)
  );
END;
$$;

-- 2. Update get_homepage_data to remove fallback for featured
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
  -- Featured (ONLY show properties marked as featured)
  select jsonb_agg(t) into v_featured from (
    select id, title, slug, listing_type, property_type,
           asking_price, monthly_rent, nightly_rate, currency,
           city, suburb, bedrooms, bathrooms, floor_area,
           cover_image_url, is_featured, status, created_at
    from public.properties
    where status = 'active' 
      and is_featured = true
    order by created_at desc limit 8
  ) t;

  -- The rest remain same...
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

-- 3. Update search_properties to include p_is_featured parameter
CREATE OR REPLACE FUNCTION public.search_properties(
  p_query TEXT DEFAULT NULL,
  p_listing_type TEXT DEFAULT NULL,
  p_property_type TEXT DEFAULT NULL,
  p_country TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_min_price NUMERIC DEFAULT NULL,
  p_max_price NUMERIC DEFAULT NULL,
  p_min_beds INTEGER DEFAULT NULL,
  p_max_beds INTEGER DEFAULT NULL,
  p_min_area NUMERIC DEFAULT NULL,
  p_max_area NUMERIC DEFAULT NULL,
  p_lat NUMERIC DEFAULT NULL,
  p_lng NUMERIC DEFAULT NULL,
  p_radius_km NUMERIC DEFAULT NULL,
  p_is_featured BOOLEAN DEFAULT NULL, -- NEW PARAMETER
  p_sort_by TEXT DEFAULT 'newest',
  p_page INTEGER DEFAULT 0,
  p_page_size INTEGER DEFAULT 20,
  p_min_solar_capacity NUMERIC DEFAULT NULL,
  p_min_generator_capacity NUMERIC DEFAULT NULL,
  p_min_water_tank_capacity NUMERIC DEFAULT NULL,
  p_has_borehole BOOLEAN DEFAULT NULL,
  p_has_staff_quarters BOOLEAN DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  description TEXT,
  listing_type TEXT,
  property_type TEXT,
  asking_price NUMERIC,
  monthly_rent NUMERIC,
  nightly_rate NUMERIC,
  currency TEXT,
  address TEXT,
  city TEXT,
  suburb TEXT,
  province TEXT,
  country TEXT,
  postcode TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  bedrooms INTEGER,
  bathrooms NUMERIC,
  floor_area NUMERIC,
  lot_size NUMERIC,
  year_built INTEGER,
  cover_image_url TEXT,
  images TEXT[],
  is_featured BOOLEAN,
  status TEXT,
  seller_id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  total_count BIGINT,
  profiles JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_catalog
AS $$
BEGIN
  RETURN QUERY
  WITH filtered_props AS (
    SELECT 
      p.*,
      jsonb_build_object(
        'id', pr.id,
        'full_name', pr.full_name,
        'avatar_url', pr.avatar_url,
        'is_verified', pr.is_verified
      ) as profiles_json
    FROM public.properties p
    LEFT JOIN public.profiles pr ON p.seller_id = pr.id
    WHERE (p.status = 'active')
      AND (p_query IS NULL OR 
           p.title ILIKE '%' || p_query || '%' OR 
           p.description ILIKE '%' || p_query || '%' OR
           p.city ILIKE '%' || p_query || '%' OR
           p.suburb ILIKE '%' || p_query || '%' OR
           p.property_type ILIKE '%' || p_query || '%')
      AND (p_listing_type IS NULL OR p.listing_type = p_listing_type)
      AND (p_property_type IS NULL OR p.property_type = p_property_type)
      AND (p_country IS NULL OR p.country = p_country)
      AND (p_city IS NULL OR p.city ILIKE '%' || p_city || '%')
      AND (p_min_price IS NULL OR coalesce(p.asking_price, p.monthly_rent, p.nightly_rate) >= p_min_price)
      AND (p_max_price IS NULL OR coalesce(p.asking_price, p.monthly_rent, p.nightly_rate) <= p_max_price)
      AND (p_min_beds IS NULL OR p.bedrooms >= p_min_beds)
      AND (p_max_beds IS NULL OR p.bedrooms <= p_max_beds)
      AND (p_min_area IS NULL OR p.floor_area >= p_min_area)
      AND (p_max_area IS NULL OR p.floor_area <= p_max_area)
      AND (p_is_featured IS NULL OR p.is_featured = p_is_featured) -- FILTER BY FEATURED
      AND (p_lat IS NULL OR p_lng IS NULL OR p_radius_km IS NULL OR
           (point(p.longitude, p.latitude) <@> point(p_lng, p_lat)) * 1.60934 <= p_radius_km)
      AND (p_min_solar_capacity IS NULL OR (p.technical_specs->>'solar_capacity')::numeric >= p_min_solar_capacity)
      AND (p_min_generator_capacity IS NULL OR (p.technical_specs->>'generator_capacity')::numeric >= p_min_generator_capacity)
      AND (p_min_water_tank_capacity IS NULL OR (p.technical_specs->>'water_tank_capacity')::numeric >= p_min_water_tank_capacity)
      AND (p_has_borehole IS NULL OR (p.technical_specs->>'has_borehole')::boolean = p_has_borehole)
      AND (p_has_staff_quarters IS NULL OR (p.technical_specs->>'has_staff_quarters')::boolean = p_has_staff_quarters)
  ),
  total_count AS (
    SELECT count(*) as count FROM filtered_props
  )
  SELECT 
    f.id, f.title, f.slug, f.description, f.listing_type, f.property_type,
    f.asking_price, f.monthly_rent, f.nightly_rate, f.currency,
    f.address, f.city, f.suburb, f.province, f.country, f.postcode,
    f.latitude, f.longitude, f.bedrooms, f.bathrooms, f.floor_area,
    f.lot_size, f.year_built, f.cover_image_url, f.images,
    f.is_featured, f.status, f.seller_id, f.created_at, f.updated_at,
    tc.count,
    f.profiles_json
  FROM filtered_props f, total_count tc
  ORDER BY
    CASE WHEN p_sort_by = 'price_asc' THEN coalesce(f.asking_price, f.monthly_rent, f.nightly_rate) END ASC,
    CASE WHEN p_sort_by = 'price_desc' THEN coalesce(f.asking_price, f.monthly_rent, f.nightly_rate) END DESC,
    CASE WHEN p_sort_by = 'most_popular' THEN f.created_at END DESC, -- Placeholder for views
    f.created_at DESC
  LIMIT p_page_size
  OFFSET p_page * p_page_size;
END;
$$;
