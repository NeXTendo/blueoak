-- BlueOak — Default Platform Settings
insert into public.platform_settings (key, value, description) values
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
on conflict (key) do nothing;
