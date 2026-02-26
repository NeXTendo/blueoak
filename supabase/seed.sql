-- BlueOak — Development Seed Data
-- Run with: supabase db reset --seed

-- Note: Auth users must be created via Supabase Auth API or Dashboard.
-- This seed populates additional test data assuming test users exist.

-- Insert platform settings defaults (already in migration 009, included here as backup)
insert into public.platform_settings (key, value, description) values
  ('maintenance_mode', 'false', 'Show maintenance page')
on conflict (key) do nothing;

-- Sample Zambia properties (seller_id must match a real auth user)
-- Uncomment and update UUIDs after creating test accounts:
/*
insert into public.properties (seller_id, title, listing_type, property_type, status, country, city, suburb, bedrooms, bathrooms, floor_area, asking_price, currency, description)
values
  ('YOUR_SELLER_UUID', '4 Bedroom Family Home in Kabulonga', 'sale', 'house', 'active', 'ZM', 'Lusaka', 'Kabulonga', 4, 3, 280, 850000, 'ZMW', 'Spacious family home in the heart of Kabulonga...'),
  ('YOUR_SELLER_UUID', 'Modern 2-Bed Apartment in Longacres', 'rent', 'apartment', 'active', 'ZM', 'Lusaka', 'Longacres', 2, 2, 120, 8500, 'ZMW', 'Contemporary apartment with backup power and fibre...');
*/
