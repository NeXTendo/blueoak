-- BlueOak — Property Detail RPC
-- Fetches comprehensive property data including seller profile and media

create or replace function public.get_property_detail(p_slug text)
returns jsonb
language plpgsql
security definer
stable
as $$
declare
  result jsonb;
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
    'cover_image_url', p.cover_image_url,
    'virtual_tour_url', p.virtual_tour_url,
    'available_from', p.available_from,
    'tags', p.tags,
    'has_borehole', p.has_borehole,
    'water_tank_capacity', p.water_tank_capacity,
    'has_solar', p.has_solar,
    'solar_capacity', p.solar_capacity,
    'has_generator', p.has_generator,
    'generator_capacity', p.generator_capacity,
    'has_staff_quarters', p.has_staff_quarters,
    'created_at', p.created_at,
    'profiles', jsonb_build_object(
      'id', pr.id,
      'full_name', pr.full_name,
      'avatar_url', pr.avatar_url,
      'is_verified', pr.is_verified,
      'user_type', pr.user_type,
      'bio', pr.bio
    ),
    'media', (
      select jsonb_agg(m)
      from (
        select url, media_type, order_index
        from public.property_media
        where property_id = p.id
        order by order_index asc
      ) m
    )
  ) into result
  from public.properties p
  join public.profiles pr on pr.id = p.seller_id
  where p.slug = p_slug;

  -- Record view
  if result is not null then
    perform public.record_property_view((result->>'id')::uuid);
  end if;

  return result;
end;
$$;
