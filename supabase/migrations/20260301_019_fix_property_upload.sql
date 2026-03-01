-- Fix property creation RPC
-- 1. Handle empty strings when casting to numeric/integer
-- 2. Insert documents into property_media since property_documents table does not exist.

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
  v_price_zmw   numeric := nullif(p_property_data->>'price_zmw', '')::numeric;
  v_price_usd   numeric := nullif(p_property_data->>'price_usd', '')::numeric;
  v_price_zar   numeric := nullif(p_property_data->>'price_zar', '')::numeric;
  v_price_kes   numeric := nullif(p_property_data->>'price_kes', '')::numeric;
  v_price_bwp   numeric := nullif(p_property_data->>'price_bwp', '')::numeric;
  v_price_ngn   numeric := nullif(p_property_data->>'price_ngn', '')::numeric;
  v_price_ghs   numeric := nullif(p_property_data->>'price_ghs', '')::numeric;
  v_price_eur   numeric := nullif(p_property_data->>'price_eur', '')::numeric;
  v_price_gbp   numeric := nullif(p_property_data->>'price_gbp', '')::numeric;
  v_title       text := p_property_data->>'title';
  v_country     text := p_property_data->>'country';
BEGIN
  -- Auto-Approval Logic
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
    seller_id, title, slug, reference, description,
    listing_type, property_type, status, condition, furnishing,
    country, province, city, suburb, address, address_private,
    latitude, longitude, erf_number, zoning,
    bedrooms, bathrooms, toilets, floor_area, lot_area,
    garages, parking, floors, year_built,
    amenities, pet_friendly, asking_price, currency, negotiable,
    monthly_rent, deposit, nightly_rate, cleaning_fee,
    levy, rates_taxes, price_per_sqft, cover_image_url,
    virtual_tour_url, available_from, tags,
    borehole, water_tank_capacity, solar_power, solar_panel_capacity,
    generator, generator_capacity, staff_quarters,
    price_zmw, price_usd, price_zar, price_kes, price_bwp, 
    price_ngn, price_ghs, price_eur, price_gbp
  ) VALUES (
    v_seller_id, v_title, p_property_data->>'slug', p_property_data->>'reference', p_property_data->>'description',
    coalesce((p_property_data->>'listing_type'), 'sale')::public.listing_type,
    coalesce(p_property_data->>'property_type', 'house'),
    v_status,
    (p_property_data->>'condition')::public.property_condition,
    (p_property_data->>'furnishing')::public.furnishing_status,
    coalesce(v_country, 'ZM'),
    p_property_data->>'province',
    p_property_data->>'city',
    p_property_data->>'suburb',
    p_property_data->>'address',
    coalesce((p_property_data->>'address_private')::boolean, false),
    (p_property_data->>'latitude')::numeric,
    (p_property_data->>'longitude')::numeric,
    p_property_data->>'erf_number',
    p_property_data->>'zoning',
    nullif(p_property_data->>'bedrooms', '')::integer,
    nullif(p_property_data->>'bathrooms', '')::numeric,
    nullif(p_property_data->>'toilets', '')::integer,
    nullif(p_property_data->>'floor_area', '')::numeric,
    nullif(p_property_data->>'lot_area', '')::numeric,
    nullif(p_property_data->>'garages', '')::integer,
    nullif(p_property_data->>'parking', '')::integer,
    nullif(p_property_data->>'floors', '')::integer,
    nullif(p_property_data->>'year_built', '')::integer,
    coalesce(array(select jsonb_array_elements_text(nullif(p_property_data->'amenities', 'null'))), '{}'),
    coalesce((p_property_data->>'pet_friendly')::boolean, false),
    nullif(p_property_data->>'asking_price', '')::numeric,
    coalesce(p_property_data->>'currency', 'ZMW'),
    coalesce((p_property_data->>'negotiable')::boolean, false),
    nullif(p_property_data->>'monthly_rent', '')::numeric,
    nullif(p_property_data->>'deposit', '')::numeric,
    nullif(p_property_data->>'nightly_rate', '')::numeric,
    nullif(p_property_data->>'cleaning_fee', '')::numeric,
    nullif(p_property_data->>'levy', '')::numeric,
    nullif(p_property_data->>'rates_taxes', '')::numeric,
    nullif(p_property_data->>'price_per_sqft', '')::numeric,
    p_property_data->>'cover_image_url',
    p_property_data->>'virtual_tour_url',
    (p_property_data->>'available_from')::date,
    coalesce(array(select jsonb_array_elements_text(nullif(p_property_data->'tags', 'null'))), '{}'),
    coalesce((p_property_data->>'borehole')::boolean, false),
    (p_property_data->>'water_tank_capacity')::integer,
    coalesce((p_property_data->>'solar_power')::boolean, false),
    (p_property_data->>'solar_panel_capacity')::numeric,
    coalesce((p_property_data->>'generator')::boolean, false),
    (p_property_data->>'generator_capacity')::numeric,
    coalesce((p_property_data->>'staff_quarters')::boolean, false),
    v_price_zmw, v_price_usd, v_price_zar, v_price_kes, v_price_bwp,
    v_price_ngn, v_price_ghs, v_price_eur, v_price_gbp
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
        coalesce(nullif(v_media_item->>'order', ''), '0')::integer,
        coalesce((v_media_item->>'is_cover')::boolean, false)
      );
    END LOOP;
  END IF;

  -- Insert Documents
  IF array_length(p_documents, 1) > 0 THEN
    FOREACH v_media_item IN ARRAY p_documents LOOP
      INSERT INTO public.property_media (
        property_id, url, media_type, order_index, caption
      ) VALUES (
        v_property_id,
        v_media_item->>'url',
        'document'::public.media_type,
        0,
        v_media_item->>'name'
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
