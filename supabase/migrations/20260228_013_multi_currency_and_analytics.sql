-- ============================================================
-- BlueOak — Multi-Currency Pricing & Analytics Setup
-- Adds explicit price columns for all supported currencies
-- ============================================================

-- 1. Ensure 'sold' exists in property_status enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_status') THEN
        -- Enum doesn't exist, create it (fallback)
        CREATE TYPE public.property_status AS ENUM ('active', 'pending', 'sold', 'rented', 'archived', 'rejected', 'draft');
    ELSE
        -- Enum exists, try adding 'sold' if it's missing
        IF NOT EXISTS (
            SELECT 1 FROM pg_enum 
            WHERE enumtypid = 'property_status'::regtype 
              AND enumlabel = 'sold'
        ) THEN
            ALTER TYPE public.property_status ADD VALUE 'sold';
        END IF;
    END IF;
END $$;


-- 2. Add explicit currency price columns to properties
ALTER TABLE public.properties
    ADD COLUMN IF NOT EXISTS price_zmw numeric,
    ADD COLUMN IF NOT EXISTS price_usd numeric,
    ADD COLUMN IF NOT EXISTS price_zar numeric,
    ADD COLUMN IF NOT EXISTS price_kes numeric,
    ADD COLUMN IF NOT EXISTS price_bwp numeric;

-- Backfill data: If asking_price exists, move it to the currency they selected
UPDATE public.properties
SET 
    price_zmw = CASE WHEN currency = 'ZMW' THEN asking_price ELSE NULL END,
    price_usd = CASE WHEN currency = 'USD' THEN asking_price ELSE NULL END,
    price_zar = CASE WHEN currency = 'ZAR' THEN asking_price ELSE NULL END,
    price_kes = CASE WHEN currency = 'KES' THEN asking_price ELSE NULL END,
    price_bwp = CASE WHEN currency = 'BWP' THEN asking_price ELSE NULL END
WHERE 
    price_zmw IS NULL AND price_usd IS NULL AND price_zar IS NULL 
    AND price_kes IS NULL AND price_bwp IS NULL;


-- 3. Update the property creation RPC to handle explicit currencies
CREATE OR REPLACE FUNCTION public.create_property_listing(
  p_property_data jsonb,
  p_media         jsonb[] default '{}',
  p_documents     jsonb[] default '{}'
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_property_id uuid;
  v_media_item  jsonb;
  v_seller_id   uuid := auth.uid();
BEGIN
  -- Insert the property with explicit multi-currency fields
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
    -- Old fallback fields
    asking_price,
    currency,
    -- NEW Multi-Currency Fields
    price_zmw,
    price_usd,
    price_zar,
    price_kes,
    price_bwp,
    -- Tech specs, etc.
    cover_image_url
  ) VALUES (
    v_seller_id,
    p_property_data->>'title',
    p_property_data->>'slug',
    p_property_data->>'reference',
    p_property_data->>'description',
    coalesce((p_property_data->>'listing_type'), 'sale')::public.listing_type,
    coalesce(p_property_data->>'property_type', 'house'),
    'pending', -- All new listings start as pending
    coalesce(p_property_data->>'country', 'ZM'),
    p_property_data->>'city',
    p_property_data->>'suburb',
    p_property_data->>'address',
    (p_property_data->>'bedrooms')::integer,
    (p_property_data->>'bathrooms')::numeric,
    (p_property_data->>'floor_area')::numeric,
    
    (p_property_data->>'asking_price')::numeric,
    coalesce(p_property_data->>'currency', 'ZMW'),
    
    -- Explicit Currencies
    (p_property_data->>'price_zmw')::numeric,
    (p_property_data->>'price_usd')::numeric,
    (p_property_data->>'price_zar')::numeric,
    (p_property_data->>'price_kes')::numeric,
    (p_property_data->>'price_bwp')::numeric,
    
    p_property_data->>'cover_image_url'
  ) RETURNING id INTO v_property_id;

  -- Insert Media
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

  -- Update profile listing count
  UPDATE public.profiles 
  SET listing_count = coalesce(listing_count, 0) + 1 
  WHERE id = v_seller_id;

  RETURN v_property_id;
END;
$$;
