-- ============================================================
-- BlueOak — Strict Hero Section Filtering Fix
-- ============================================================

-- Ensure the get_homepage_data RPC only returns GENUINELY featured properties in the 'featured' set.
-- This prevents normal listings from "leaking" into the hero gallery when featured items are present.

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
  -- 1. Featured (STRICTLY ONLY featured items)
  select jsonb_agg(t) into v_featured from (
    select id, title, slug, listing_type, property_type,
           asking_price, monthly_rent, nightly_rate, currency,
           price_zmw, price_usd, price_zar, price_kes, price_bwp,
           price_ngn, price_ghs, price_eur, price_gbp,
           city, suburb, bedrooms, bathrooms, floor_area,
           cover_image_url, is_featured, status, created_at
    from public.properties
    where status = 'active' 
      and is_featured = true  -- Strict enforcement
    order by created_at desc 
    limit 8
  ) t;

  -- 2. New Listings (Source of fallback for the hero and main list)
  select jsonb_agg(t) into v_new_listings from (
    select id, title, slug, listing_type, property_type,
           asking_price, monthly_rent, nightly_rate, currency,
           price_zmw, price_usd, price_zar, price_kes, price_bwp,
           price_ngn, price_ghs, price_eur, price_gbp,
           city, suburb, bedrooms, bathrooms, floor_area,
           cover_image_url, is_featured, status, created_at
    from public.properties
    where status = 'active'
    order by created_at desc 
    limit 8
  ) t;

  -- 3. Category Specific: Lands Lusaka
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

  -- 4. Category Specific: Apartments Nairobi
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
