-- ============================================================
-- BlueOak — Currency Aware RPC Update
-- ============================================================

-- 1. Update get_platform_stats to be currency-aware
CREATE OR REPLACE FUNCTION public.get_platform_stats(
  p_currency text default 'ZMW'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_catalog
AS $$
DECLARE
  v_active_listings INTEGER;
  v_countries INTEGER;
  v_assets_value NUMERIC := 0;
  v_verified_buyers INTEGER;
BEGIN
  -- Count total properties
  SELECT count(*) INTO v_active_listings FROM public.properties WHERE status = 'active';
  
  -- Count distinct countries
  SELECT count(DISTINCT country) INTO v_countries FROM public.properties WHERE status = 'active' AND country IS NOT NULL AND country != '';
  
  -- Sum total value based on selected currency
  IF p_currency = 'USD' THEN
    SELECT sum(coalesce(price_usd, 0)) INTO v_assets_value FROM public.properties WHERE status = 'active';
  ELSIF p_currency = 'ZAR' THEN
    SELECT sum(coalesce(price_zar, 0)) INTO v_assets_value FROM public.properties WHERE status = 'active';
  ELSIF p_currency = 'KES' THEN
    SELECT sum(coalesce(price_kes, 0)) INTO v_assets_value FROM public.properties WHERE status = 'active';
  ELSIF p_currency = 'BWP' THEN
    SELECT sum(coalesce(price_bwp, 0)) INTO v_assets_value FROM public.properties WHERE status = 'active';
  ELSIF p_currency = 'NGN' THEN
    SELECT sum(coalesce(price_ngn, 0)) INTO v_assets_value FROM public.properties WHERE status = 'active';
  ELSIF p_currency = 'GHS' THEN
    SELECT sum(coalesce(price_ghs, 0)) INTO v_assets_value FROM public.properties WHERE status = 'active';
  ELSIF p_currency = 'EUR' THEN
    SELECT sum(coalesce(price_eur, 0)) INTO v_assets_value FROM public.properties WHERE status = 'active';
  ELSIF p_currency = 'GBP' THEN
    SELECT sum(coalesce(price_gbp, 0)) INTO v_assets_value FROM public.properties WHERE status = 'active';
  ELSE
    SELECT sum(coalesce(price_zmw, 0)) INTO v_assets_value FROM public.properties WHERE status = 'active';
  END IF;
  
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

-- 2. Update get_homepage_data to include ALL currency columns
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
  -- Featured
  select jsonb_agg(t) into v_featured from (
    select id, title, slug, listing_type, property_type,
           asking_price, monthly_rent, nightly_rate, currency,
           price_zmw, price_usd, price_zar, price_kes, price_bwp,
           price_ngn, price_ghs, price_eur, price_gbp,
           city, suburb, bedrooms, bathrooms, floor_area,
           cover_image_url, is_featured, status, created_at
    from public.properties
    where status = 'active' and is_featured = true
    order by created_at desc limit 8
  ) t;

  -- New Listings
  select jsonb_agg(t) into v_new_listings from (
    select id, title, slug, listing_type, property_type,
           asking_price, monthly_rent, nightly_rate, currency,
           price_zmw, price_usd, price_zar, price_kes, price_bwp,
           price_ngn, price_ghs, price_eur, price_gbp,
           city, suburb, bedrooms, bathrooms, floor_area,
           cover_image_url, is_featured, status, created_at
    from public.properties
    where status = 'active'
    order by created_at desc limit 8
  ) t;

  -- Lands Lusaka
  select jsonb_agg(t) into v_lands_lusaka from (
    select id, title, slug, listing_type, property_type,
           asking_price, monthly_rent, nightly_rate, currency,
           price_zmw, price_usd, price_zar, price_kes, price_bwp,
           price_ngn, price_ghs, price_eur, price_gbp,
           city, suburb, bedrooms, bathrooms, floor_area,
           cover_image_url, is_featured, status, created_at
    from public.properties
    where status = 'active'
      and property_type in ('residential_plot', 'commercial_plot', 'agricultural_plot')
      and (city ilike '%lusaka%' or city ilike '%zambia%')
    limit 8
  ) t;

  -- Apartments Nairobi
  select jsonb_agg(t) into v_apartments_nairobi from (
    select id, title, slug, listing_type, property_type,
           asking_price, monthly_rent, nightly_rate, currency,
           price_zmw, price_usd, price_zar, price_kes, price_bwp,
           price_ngn, price_ghs, price_eur, price_gbp,
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
