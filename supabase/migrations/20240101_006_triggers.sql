-- BlueOak — Triggers & Automations

-- Auto-update updated_at timestamps
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger trigger_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger trigger_properties_updated_at
  before update on public.properties
  for each row execute function public.handle_updated_at();

create trigger trigger_reservations_updated_at
  before update on public.reservations
  for each row execute function public.handle_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles(id, full_name, email, user_type)
  values(
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data->>'user_type')::public.user_type, 'buyer')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-generate slug on property insert
create or replace function public.handle_property_slug()
returns trigger language plpgsql as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug := public.generate_property_slug(new.title, new.city);
  end if;
  if new.reference is null or new.reference = '' then
    new.reference := 'BO-' || upper(substring(new.id::text, 1, 8));
  end if;
  return new;
end;
$$;

create trigger trigger_property_slug
  before insert on public.properties
  for each row execute function public.handle_property_slug();

-- Sync PostGIS location from lat/lng
create or replace function public.handle_property_location()
returns trigger language plpgsql as $$
begin
  if new.latitude is not null and new.longitude is not null then
    new.location := st_makepoint(new.longitude::float8, new.latitude::float8)::geography;
  end if;
  return new;
end;
$$;

create trigger trigger_property_location
  before insert or update of latitude, longitude on public.properties
  for each row execute function public.handle_property_location();

-- Sync cover_image_url from property_media
create or replace function public.handle_cover_image()
returns trigger language plpgsql as $$
begin
  if new.is_cover then
    update public.properties set cover_image_url = new.url where id = new.property_id;
  end if;
  return new;
end;
$$;

create trigger trigger_cover_image
  after insert or update of is_cover on public.property_media
  for each row when (new.is_cover = true) execute function public.handle_cover_image();

-- Update seller listing_count
create or replace function public.handle_listing_count()
returns trigger language plpgsql as $$
begin
  update public.profiles set listing_count = (
    select count(*) from public.properties where seller_id = coalesce(new.seller_id, old.seller_id) and status = 'active'
  ) where id = coalesce(new.seller_id, old.seller_id);
  return coalesce(new, old);
end;
$$;

create trigger trigger_listing_count
  after insert or update of status or delete on public.properties
  for each row execute function public.handle_listing_count();
