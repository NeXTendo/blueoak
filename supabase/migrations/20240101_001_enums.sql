-- BlueOak — Enum Types
-- Run first: defines all custom types used in table columns

create type public.user_type as enum (
  'buyer', 'seller', 'agent', 'admin', 'super_admin'
);

create type public.listing_type as enum (
  'sale', 'rent', 'short_term', 'lease', 'auction'
);

create type public.property_status as enum (
  'active', 'pending', 'sold', 'rented', 'archived', 'rejected', 'draft'
);

create type public.property_condition as enum (
  'new', 'excellent', 'good', 'fair', 'needs_work'
);

create type public.furnishing_status as enum (
  'unfurnished', 'semi_furnished', 'fully_furnished'
);

create type public.reservation_status as enum (
  'pending', 'confirmed', 'completed', 'cancelled', 'no_show'
);

create type public.meeting_type as enum (
  'in_person', 'virtual'
);

create type public.notification_type as enum (
  'new_message',
  'reservation_created', 'reservation_confirmed', 'reservation_cancelled',
  'reservation_reminder_24h', 'reservation_reminder_1h', 'reservation_completed',
  'review_prompt', 'review_received',
  'property_approved', 'property_rejected', 'property_featured',
  'property_expiring', 'property_saved',
  'price_drop_alert', 'new_listing_match',
  'auction_outbid', 'auction_ending_soon', 'auction_won', 'auction_lost',
  'account_verified', 'account_banned',
  'report_resolved', 'subscription_expiring', 'subscription_expired',
  'payment_received', 'system_announcement', 'new_follower', 'document_requested'
);

create type public.report_type as enum (
  'spam', 'misleading', 'offensive', 'wrong_price', 'sold', 'scam', 'other'
);

create type public.report_status as enum (
  'open', 'under_review', 'resolved', 'dismissed'
);

create type public.media_type as enum (
  'image', 'video', 'floor_plan', 'site_plan', 'document'
);

create type public.subscription_plan as enum (
  'free', 'basic', 'pro', 'enterprise'
);
