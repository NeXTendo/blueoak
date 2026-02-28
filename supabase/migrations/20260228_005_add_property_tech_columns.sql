-- ============================================================
-- BlueOak — Add Missing Technical Infrastructure Columns
-- The frontend references these columns (borehole, solar_power, etc)
-- but they were never added to the actual properties table.
-- ============================================================

alter table public.properties
  add column if not exists borehole boolean default false,
  add column if not exists water_tank_capacity integer,
  add column if not exists solar_power boolean default false,
  add column if not exists solar_panel_capacity numeric,
  add column if not exists generator boolean default false,
  add column if not exists generator_capacity numeric,
  add column if not exists staff_quarters boolean default false;
