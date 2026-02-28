-- Create an RPC to fetch dynamic category counts for the homepage
CREATE OR REPLACE FUNCTION get_feature_category_counts()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_villas_count INTEGER;
  v_penthouses_count INTEGER;
  v_student_count INTEGER;
  v_land_count INTEGER;
BEGIN
  -- Count Villas (House with high value or specific type)
  SELECT count(*) INTO v_villas_count
  FROM properties
  WHERE property_type = 'House' AND price >= 1000000;

  -- Count Penthouses (Apartments with high value)
  SELECT count(*) INTO v_penthouses_count
  FROM properties
  WHERE property_type = 'Apartment' AND price >= 500000;

  -- Count Student Accommodation (Specific property type)
  SELECT count(*) INTO v_student_count
  FROM properties
  WHERE property_type = 'Student Accommodation';

  -- Count Land
  SELECT count(*) INTO v_land_count
  FROM properties
  WHERE property_type = 'Land';

  RETURN json_build_object(
    'villas', v_villas_count,
    'penthouses', v_penthouses_count,
    'student_accommodation', v_student_count,
    'land', v_land_count
  );
END;
$$;
