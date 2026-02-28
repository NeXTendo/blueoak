-- Create an RPC to fetch dynamic platform stats for the homepage hero
CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_active_listings INTEGER;
  v_countries INTEGER;
  v_assets_value NUMERIC;
  v_verified_buyers INTEGER;
BEGIN
  -- Count total properties
  SELECT count(*) INTO v_active_listings FROM properties;
  
  -- Count distinct countries
  SELECT count(DISTINCT country) INTO v_countries FROM properties WHERE country IS NOT NULL AND country != '';
  
  -- Sum total value of all properties
  SELECT sum(price) INTO v_assets_value FROM properties;
  
  -- Count verified buyers (assuming user_type = 'buyer', or just all profiles if we want to reflect total network)
  SELECT count(*) INTO v_verified_buyers FROM profiles WHERE user_type = 'buyer';

  RETURN json_build_object(
    'active_listings', COALESCE(v_active_listings, 0),
    'countries', COALESCE(v_countries, 0),
    'assets_value', COALESCE(v_assets_value, 0),
    'verified_buyers', COALESCE(v_verified_buyers, 0)
  );
END;
$$;
