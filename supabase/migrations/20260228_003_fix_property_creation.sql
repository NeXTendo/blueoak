-- ============================================================
-- BlueOak — Fix Property Creation RPC Column Names
-- Matches the RPC schema to the actual properties table columns
-- ============================================================

create or replace function public.create_property_listing(
  p_property_data jsonb,
  p_media         jsonb[] default '{}',
  p_documents     jsonb[] default '{}'
) returns uuid language plpgsql security definer as $$
declare
  v_property_id uuid;
  v_media_item  jsonb;
  v_doc_item    jsonb;
  v_seller_id   uuid := auth.uid();
begin
  -- 1. Insert the property
  insert into public.properties (
    seller_id,
    title,
    slug,
    reference,
    description,
    listing_type,
    property_type,
    status,
    condition,
    furnishing,
    country,
    province,
    city,
    suburb,
    address,
    address_private,
    latitude,
    longitude,
    location,
    erf_number,
    zoning,
    bedrooms,
    bathrooms,
    toilets,
    floor_area,
    lot_area,
    garages,
    parking,
    floors,
    year_built,
    amenities,
    pet_friendly,
    asking_price,
    currency,
    negotiable,
    monthly_rent,
    deposit,
    nightly_rate,
    cleaning_fee,
    levy,
    rates_taxes,
    price_per_sqft,
    cover_image_url,
    virtual_tour_url,
    available_from,
    tags,
    borehole,
    water_tank_capacity,
    solar_power,
    solar_panel_capacity,
    generator,
    generator_capacity,
    staff_quarters
  ) values (
    v_seller_id,
    p_property_data->>'title',
    p_property_data->>'slug',
    p_property_data->>'reference',
    p_property_data->>'description',
    coalesce((p_property_data->>'listing_type'), 'sale')::public.listing_type,
    coalesce(p_property_data->>'property_type', 'house'),
    'pending', -- All new listings start as pending
    (p_property_data->>'condition')::public.property_condition,
    (p_property_data->>'furnishing')::public.furnishing_status,
    coalesce(p_property_data->>'country', 'ZM'),
    p_property_data->>'province',
    p_property_data->>'city',
    p_property_data->>'suburb',
    p_property_data->>'address',
    coalesce((p_property_data->>'address_private')::boolean, false),
    (p_property_data->>'latitude')::numeric,
    (p_property_data->>'longitude')::numeric,
    case 
      when p_property_data->>'longitude' is not null and p_property_data->>'latitude' is not null 
      then st_makepoint((p_property_data->>'longitude')::float8, (p_property_data->>'latitude')::float8)::geography
      else null 
    end,
    p_property_data->>'erf_number',
    p_property_data->>'zoning',
    (p_property_data->>'bedrooms')::integer,
    (p_property_data->>'bathrooms')::numeric,
    (p_property_data->>'toilets')::integer,
    (p_property_data->>'floor_area')::numeric,
    (p_property_data->>'lot_area')::numeric,
    (p_property_data->>'garages')::integer,
    (p_property_data->>'parking')::integer,
    (p_property_data->>'floors')::integer,
    (p_property_data->>'year_built')::integer,
    coalesce(array(select jsonb_array_elements_text(nullif(p_property_data->'amenities', 'null'))), '{}'),
    coalesce((p_property_data->>'pet_friendly')::boolean, false),
    (p_property_data->>'asking_price')::numeric,
    coalesce(p_property_data->>'currency', 'ZMW'),
    coalesce((p_property_data->>'negotiable')::boolean, false),
    (p_property_data->>'monthly_rent')::numeric,
    (p_property_data->>'deposit')::numeric,
    (p_property_data->>'nightly_rate')::numeric,
    (p_property_data->>'cleaning_fee')::numeric,
    (p_property_data->>'levy')::numeric,
    (p_property_data->>'rates_taxes')::numeric,
    (p_property_data->>'price_per_sqft')::numeric,
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
    coalesce((p_property_data->>'staff_quarters')::boolean, false)
  ) returning id into v_property_id;

  -- 2. Insert Media
  foreach v_media_item in array p_media loop
    insert into public.property_media (
      property_id,
      url,
      media_type,
      order_index,
      is_cover
    ) values (
      v_property_id,
      v_media_item->>'url',
      (coalesce(v_media_item->>'type', 'image'))::public.media_type,
      (v_media_item->>'order')::integer,
      coalesce((v_media_item->>'is_cover')::boolean, false)
    );
  end loop;

  -- Update profile listing count
  update public.profiles 
  set listing_count = coalesce(listing_count, 0) + 1 
  where id = v_seller_id;

  return v_property_id;
end;
$$;
