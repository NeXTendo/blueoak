-- BlueOak — Core Tables

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";
create extension if not exists "pg_trgm";
create extension if not exists "unaccent";

-- ── profiles ─────────────────────────────────────────────────────
create table public.profiles (
  id                   uuid primary key references auth.users on delete cascade,
  full_name            text not null,
  username             text unique,
  email                text not null unique,
  phone                text,
  whatsapp             text,
  avatar_url           text,
  cover_url            text,
  bio                  text,
  city                 text,
  country              text default 'ZM',
  website              text,
  user_type            public.user_type not null default 'buyer',
  is_verified          boolean not null default false,
  is_banned            boolean not null default false,
  preferred_currency   text not null default 'ZMW',
  preferred_language   text not null default 'en',
  listing_count        integer not null default 0,
  rating               numeric(3,2),
  response_time_hours  numeric(5,1),
  push_token           text,
  last_seen_at         timestamptz,
  agency_name          text,
  agency_logo_url      text,
  license_number       text,
  subscription_plan    public.subscription_plan not null default 'free',
  subscription_until   timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- ── properties ───────────────────────────────────────────────────
create table public.properties (
  id              uuid primary key default uuid_generate_v4(),
  seller_id       uuid not null references public.profiles(id) on delete cascade,
  title           text not null,
  slug            text unique not null,
  reference       text unique not null,
  description     text,
  listing_type    public.listing_type not null,
  property_type   text not null,
  status          public.property_status not null default 'pending',
  condition       public.property_condition,
  furnishing      public.furnishing_status,

  -- Location
  country         text not null default 'ZM',
  province        text,
  city            text not null,
  suburb          text,
  address         text,
  address_private boolean not null default false,
  latitude        numeric(10,8),
  longitude       numeric(11,8),
  location        geography(Point, 4326),
  erf_number      text,
  zoning          text,

  -- Specs
  bedrooms        integer,
  bathrooms       numeric(4,1),
  toilets         integer,
  floor_area      numeric(10,2),
  lot_area        numeric(12,2),
  garages         integer,
  parking         integer,
  floors          integer,
  year_built      integer,
  amenities       text[] not null default '{}',
  pet_friendly    boolean not null default false,

  -- Pricing
  asking_price    numeric(15,2),
  currency        text not null default 'ZMW',
  negotiable      boolean not null default false,
  monthly_rent    numeric(12,2),
  deposit         numeric(12,2),
  nightly_rate    numeric(10,2),
  cleaning_fee    numeric(10,2),
  levy            numeric(10,2),
  rates_taxes     numeric(10,2),
  price_per_sqft  numeric(12,2),

  -- Auction
  auction_start_at    timestamptz,
  auction_end_at      timestamptz,
  auction_reserve     numeric(15,2),
  auction_starting    numeric(15,2),
  auction_current_bid numeric(15,2),
  buyer_premium_pct   numeric(5,2),

  -- Meta
  is_featured         boolean not null default false,
  featured_until      timestamptz,
  view_count          integer not null default 0,
  save_count          integer not null default 0,
  cover_image_url     text,
  virtual_tour_url    text,
  available_from      date,
  tags                text[] not null default '{}',

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── property_media ────────────────────────────────────────────────
create table public.property_media (
  id           uuid primary key default uuid_generate_v4(),
  property_id  uuid not null references public.properties(id) on delete cascade,
  url          text not null,
  media_type   public.media_type not null default 'image',
  order_index  integer not null default 0,
  caption      text,
  alt_text     text,
  is_cover     boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ── property_views ────────────────────────────────────────────────
create table public.property_views (
  id           uuid primary key default uuid_generate_v4(),
  property_id  uuid not null references public.properties(id) on delete cascade,
  viewer_id    uuid references public.profiles(id) on delete set null,
  ip_address   inet,
  viewed_at    timestamptz not null default now()
);

-- ── saved_properties ──────────────────────────────────────────────
create table public.saved_properties (
  user_id      uuid not null references public.profiles(id) on delete cascade,
  property_id  uuid not null references public.properties(id) on delete cascade,
  saved_at     timestamptz not null default now(),
  primary key (user_id, property_id)
);

-- ── conversations ─────────────────────────────────────────────────
create table public.conversations (
  id              uuid primary key default uuid_generate_v4(),
  buyer_id        uuid not null references public.profiles(id) on delete cascade,
  seller_id       uuid not null references public.profiles(id) on delete cascade,
  property_id     uuid references public.properties(id) on delete set null,
  last_message_at timestamptz,
  buyer_unread    integer not null default 0,
  seller_unread   integer not null default 0,
  is_archived     boolean not null default false,
  created_at      timestamptz not null default now(),
  unique (buyer_id, seller_id, property_id)
);

-- ── messages ─────────────────────────────────────────────────────
create table public.messages (
  id              uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid not null references public.profiles(id) on delete cascade,
  content         text not null,
  attachment_url  text,
  is_read         boolean not null default false,
  created_at      timestamptz not null default now()
);

-- ── reservations ─────────────────────────────────────────────────
create table public.reservations (
  id              uuid primary key default uuid_generate_v4(),
  property_id     uuid not null references public.properties(id) on delete cascade,
  buyer_id        uuid not null references public.profiles(id) on delete cascade,
  seller_id       uuid not null references public.profiles(id) on delete cascade,
  status          public.reservation_status not null default 'pending',
  meeting_type    public.meeting_type not null default 'in_person',
  reserved_date   date not null,
  reserved_time   time not null,
  duration_mins   integer not null default 60,
  notes           text,
  virtual_link    text,
  review_prompted boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── notifications ─────────────────────────────────────────────────
create table public.notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        public.notification_type not null,
  title       text not null,
  body        text not null,
  action_url  text,
  is_read     boolean not null default false,
  data        jsonb,
  created_at  timestamptz not null default now()
);

-- ── reports ───────────────────────────────────────────────────────
create table public.reports (
  id             uuid primary key default uuid_generate_v4(),
  reporter_id    uuid not null references public.profiles(id) on delete cascade,
  report_type    public.report_type not null,
  status         public.report_status not null default 'open',
  reason         text not null,
  property_id    uuid references public.properties(id) on delete set null,
  reported_user  uuid references public.profiles(id) on delete set null,
  evidence_urls  text[],
  admin_notes    text,
  resolved_by    uuid references public.profiles(id) on delete set null,
  resolved_at    timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ── reviews ───────────────────────────────────────────────────────
create table public.reviews (
  id             uuid primary key default uuid_generate_v4(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  reviewer_id    uuid not null references public.profiles(id) on delete cascade,
  reviewed_id    uuid not null references public.profiles(id) on delete cascade,
  rating         integer not null check (rating between 1 and 5),
  comment        text,
  is_public      boolean not null default true,
  created_at     timestamptz not null default now()
);

-- ── admin_activity_log ────────────────────────────────────────────
create table public.admin_activity_log (
  id          uuid primary key default uuid_generate_v4(),
  admin_id    uuid not null references public.profiles(id) on delete cascade,
  action      text not null,
  entity_type text,
  entity_id   uuid,
  details     jsonb,
  ip_address  inet,
  created_at  timestamptz not null default now()
);

-- ── platform_settings ─────────────────────────────────────────────
create table public.platform_settings (
  key         text primary key,
  value       text not null,
  description text,
  updated_by  uuid references public.profiles(id),
  updated_at  timestamptz not null default now()
);

-- ── seller_subscriptions ──────────────────────────────────────────
create table public.seller_subscriptions (
  id               uuid primary key default uuid_generate_v4(),
  seller_id        uuid not null references public.profiles(id) on delete cascade,
  plan             public.subscription_plan not null,
  starts_at        timestamptz not null,
  ends_at          timestamptz,
  amount_paid      numeric(10,2),
  currency         text,
  payment_ref      text,
  payment_provider text,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now()
);
