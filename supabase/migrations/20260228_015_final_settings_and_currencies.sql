-- ============================================================
-- BlueOak — Expanding Currencies, Platform Settings & Auto-Approval
-- Adds NGN, GHS, EUR, GBP. Installs default platform settings.
-- Modifies create_property_listing to auto-approve high quality listings.
-- Modifies analytics RPCs to sum all currencies.
-- ============================================================

-- 1. Insert Default Platform Settings
INSERT INTO public.platform_settings (key, value, description) VALUES
  ('allow_registration',          'true',   'Allow new user registrations'),
  ('auto_approve_listings',        'false',  'Skip moderation queue for new listings'),
  ('maintenance_mode',             'false',  'Show maintenance page to non-admins'),
  ('max_images_per_listing',       '50',     'Maximum photos per property'),
  ('featured_listing_price_7d',    '5',      'Featured listing price in USD for 7 days'),
  ('featured_listing_price_30d',   '20',     'Featured listing price in USD for 30 days'),
  ('free_plan_listing_limit',      '3',      'Max active listings on free plan'),
  ('basic_plan_listing_limit',     '10',     'Max active listings on basic plan'),
  ('pro_plan_listing_limit',       '50',     'Max active listings on pro plan'),
  ('contact_reveal_policy',        'after_auth', 'When to reveal seller contact: always | after_auth | after_reservation'),
  ('auction_anti_snipe_minutes',   '5',      'Minutes to extend auction if bid placed near end'),
  ('referral_credit_amount',       '10',     'Credits earned per successful referral in USD'),
  ('short_term_commission_rate',   '3',      'Platform commission % on short-term bookings'),
  ('image_watermark_enabled',      'false',  'Add BlueOak watermark to listing images'),
  ('geo_search_enabled',           'true',   'Enable proximity/radius property search'),
  ('supported_currencies',         'ZMW,ZAR,NGN,KES,GHS,USD,EUR,GBP', 'Comma-separated supported currencies'),
  ('default_country',              'ZM',     'Default country for new users'),
  ('require_email_verification',   'true',   'Require email verification before posting listings')
ON CONFLICT (key) DO NOTHING;

-- 2. Add explicit currency price columns to properties
ALTER TABLE public.properties
    ADD COLUMN IF NOT EXISTS price_ngn numeric,
    ADD COLUMN IF NOT EXISTS price_ghs numeric,
    ADD COLUMN IF NOT EXISTS price_eur numeric,
    ADD COLUMN IF NOT EXISTS price_gbp numeric;

-- 3. Update the property creation RPC with AUTO-APPROVAL logic
CREATE OR REPLACE FUNCTION public.create_property_listing(
  p_property_data jsonb,
  p_media         jsonb[] default '{}',
  p_documents     jsonb[] default '{}'
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_property_id uuid;
  v_media_item  jsonb;
  v_seller_id   uuid := auth.uid();
  v_status      public.property_status := 'pending';
  v_price_zmw   numeric := (p_property_data->>'price_zmw')::numeric;
  v_price_usd   numeric := (p_property_data->>'price_usd')::numeric;
  v_price_zar   numeric := (p_property_data->>'price_zar')::numeric;
  v_price_kes   numeric := (p_property_data->>'price_kes')::numeric;
  v_price_bwp   numeric := (p_property_data->>'price_bwp')::numeric;
  v_price_ngn   numeric := (p_property_data->>'price_ngn')::numeric;
  v_price_ghs   numeric := (p_property_data->>'price_ghs')::numeric;
  v_price_eur   numeric := (p_property_data->>'price_eur')::numeric;
  v_price_gbp   numeric := (p_property_data->>'price_gbp')::numeric;
  v_title       text := p_property_data->>'title';
  v_country     text := p_property_data->>'country';
BEGIN
  -- Auto-Approval Logic:
  -- Must have >= 2 media items, a non-null title, a non-null country, and at least one explicit price > 0.
  IF array_length(p_media, 1) >= 2 
     AND v_title IS NOT NULL AND v_title <> ''
     AND v_country IS NOT NULL AND v_country <> ''
     AND (
       (v_price_zmw IS NOT NULL AND v_price_zmw > 0) OR
       (v_price_usd IS NOT NULL AND v_price_usd > 0) OR
       (v_price_zar IS NOT NULL AND v_price_zar > 0) OR
       (v_price_kes IS NOT NULL AND v_price_kes > 0) OR
       (v_price_bwp IS NOT NULL AND v_price_bwp > 0) OR
       (v_price_ngn IS NOT NULL AND v_price_ngn > 0) OR
       (v_price_ghs IS NOT NULL AND v_price_ghs > 0) OR
       (v_price_eur IS NOT NULL AND v_price_eur > 0) OR
       (v_price_gbp IS NOT NULL AND v_price_gbp > 0)
     )
  THEN
    v_status := 'active';
  END IF;

  -- Insert the property
  INSERT INTO public.properties (
    seller_id,
    title,
    slug,
    reference,
    description,
    listing_type,
    property_type,
    status,
    country,
    city,
    suburb,
    address,
    bedrooms,
    bathrooms,
    floor_area,
    asking_price,
    currency,
    price_zmw,
    price_usd,
    price_zar,
    price_kes,
    price_bwp,
    price_ngn,
    price_ghs,
    price_eur,
    price_gbp,
    cover_image_url
  ) VALUES (
    v_seller_id,
    v_title,
    p_property_data->>'slug',
    p_property_data->>'reference',
    p_property_data->>'description',
    coalesce((p_property_data->>'listing_type'), 'sale')::public.listing_type,
    coalesce(p_property_data->>'property_type', 'house'),
    v_status,
    coalesce(v_country, 'ZM'),
    p_property_data->>'city',
    p_property_data->>'suburb',
    p_property_data->>'address',
    (p_property_data->>'bedrooms')::integer,
    (p_property_data->>'bathrooms')::numeric,
    (p_property_data->>'floor_area')::numeric,
    (p_property_data->>'asking_price')::numeric,
    coalesce(p_property_data->>'currency', 'ZMW'),
    v_price_zmw,
    v_price_usd,
    v_price_zar,
    v_price_kes,
    v_price_bwp,
    v_price_ngn,
    v_price_ghs,
    v_price_eur,
    v_price_gbp,
    p_property_data->>'cover_image_url'
  ) RETURNING id INTO v_property_id;

  -- Insert Media
  IF array_length(p_media, 1) > 0 THEN
    FOREACH v_media_item IN ARRAY p_media LOOP
      INSERT INTO public.property_media (
        property_id, url, media_type, order_index, is_cover
      ) VALUES (
        v_property_id,
        v_media_item->>'url',
        (coalesce(v_media_item->>'type', 'image'))::public.media_type,
        (v_media_item->>'order')::integer,
        coalesce((v_media_item->>'is_cover')::boolean, false)
      );
    END LOOP;
  END IF;

  -- Insert Documents
  IF array_length(p_documents, 1) > 0 THEN
    FOREACH v_media_item IN ARRAY p_documents LOOP
      INSERT INTO public.property_documents (
        property_id, file_url, title, file_size
      ) VALUES (
        v_property_id,
        v_media_item->>'url',
        v_media_item->>'name',
        (v_media_item->>'size')::integer
      );
    END LOOP;
  END IF;

  -- Update profile listing count
  UPDATE public.profiles 
  SET listing_count = coalesce(listing_count, 0) + 1 
  WHERE id = v_seller_id;

  RETURN v_property_id;
END;
$$;

-- 4. Ensure Realtime Publication for Properties
-- This is necessary so our React client can listen to INSERT events for the AdminNotifier
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;

-- 5. Dashboard Stats (Update to include new currencies)
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats(
  p_currency text default 'ZMW' 
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_users           int;
  v_buyers          int;
  v_sellers         int;
  v_properties      int;
  v_sold_properties int;
  v_total_revenue   numeric := 0;
BEGIN
  SELECT count(*) INTO v_users FROM public.profiles;
  SELECT count(*) INTO v_buyers FROM public.profiles WHERE role = 'buyer' AND status = 'active';
  SELECT count(*) INTO v_sellers FROM public.profiles WHERE role = 'seller' OR role = 'admin';

  SELECT count(*) INTO v_properties FROM public.properties WHERE status IN ('active', 'sold');
  SELECT count(*) INTO v_sold_properties FROM public.properties WHERE status = 'sold';

  IF p_currency = 'USD' THEN
    SELECT coalesce(sum(price_usd), 0) INTO v_total_revenue FROM public.properties WHERE status = 'sold';
  ELSIF p_currency = 'ZAR' THEN
    SELECT coalesce(sum(price_zar), 0) INTO v_total_revenue FROM public.properties WHERE status = 'sold';
  ELSIF p_currency = 'KES' THEN
    SELECT coalesce(sum(price_kes), 0) INTO v_total_revenue FROM public.properties WHERE status = 'sold';
  ELSIF p_currency = 'BWP' THEN
    SELECT coalesce(sum(price_bwp), 0) INTO v_total_revenue FROM public.properties WHERE status = 'sold';
  ELSIF p_currency = 'NGN' THEN
    SELECT coalesce(sum(price_ngn), 0) INTO v_total_revenue FROM public.properties WHERE status = 'sold';
  ELSIF p_currency = 'GHS' THEN
    SELECT coalesce(sum(price_ghs), 0) INTO v_total_revenue FROM public.properties WHERE status = 'sold';
  ELSIF p_currency = 'EUR' THEN
    SELECT coalesce(sum(price_eur), 0) INTO v_total_revenue FROM public.properties WHERE status = 'sold';
  ELSIF p_currency = 'GBP' THEN
    SELECT coalesce(sum(price_gbp), 0) INTO v_total_revenue FROM public.properties WHERE status = 'sold';
  ELSE
    SELECT coalesce(sum(price_zmw), 0) INTO v_total_revenue FROM public.properties WHERE status = 'sold';
  END IF;

  RETURN jsonb_build_object(
    'totalUsers', v_users,
    'verifiedBuyers', v_buyers,
    'activeSellers', v_sellers,
    'totalProperties', v_properties,
    'soldProperties', v_sold_properties,
    'totalRevenue', v_total_revenue,
    'activeCurrency', upper(p_currency)
  );
END;
$$;

-- 6. Revenue Chart Data (Update to include new currencies)
CREATE OR REPLACE FUNCTION public.get_admin_revenue_stats(
  p_currency text default 'ZMW'
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_result jsonb;
BEGIN
  WITH months AS (
    SELECT generate_series(
      date_trunc('month', (current_date - interval '5 months')),
      date_trunc('month', current_date),
      interval '1 month'
    )::date AS month_start
  ),
  monthly_revenue AS (
    SELECT 
      date_trunc('month', updated_at)::date AS sold_month,
      sum(
        CASE 
          WHEN p_currency = 'USD' THEN coalesce(price_usd, 0)
          WHEN p_currency = 'ZAR' THEN coalesce(price_zar, 0)
          WHEN p_currency = 'KES' THEN coalesce(price_kes, 0)
          WHEN p_currency = 'BWP' THEN coalesce(price_bwp, 0)
          WHEN p_currency = 'NGN' THEN coalesce(price_ngn, 0)
          WHEN p_currency = 'GHS' THEN coalesce(price_ghs, 0)
          WHEN p_currency = 'EUR' THEN coalesce(price_eur, 0)
          WHEN p_currency = 'GBP' THEN coalesce(price_gbp, 0)
          ELSE coalesce(price_zmw, 0)
        END
      ) AS revenue
    FROM public.properties
    WHERE status = 'sold'
      AND updated_at >= date_trunc('month', (current_date - interval '5 months'))
    GROUP BY 1
  )
  SELECT jsonb_agg(
    jsonb_build_object(
      'month', to_char(m.month_start, 'Mon YYYY'),
      'revenue', coalesce(mr.revenue, 0)
    )
    ORDER BY m.month_start ASC
  ) INTO v_result
  FROM months m
  LEFT JOIN monthly_revenue mr ON mr.sold_month = m.month_start;

  RETURN coalesce(v_result, '[]'::jsonb);
END;
$$;
