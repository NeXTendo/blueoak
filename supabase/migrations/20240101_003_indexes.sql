-- BlueOak — Performance Indexes

-- profiles
create index idx_profiles_user_type    on public.profiles(user_type);
create index idx_profiles_country      on public.profiles(country);
create index idx_profiles_username     on public.profiles(username);
create index idx_profiles_created_at   on public.profiles(created_at desc);

-- properties
create index idx_properties_seller_id       on public.properties(seller_id);
create index idx_properties_status          on public.properties(status);
create index idx_properties_listing_type    on public.properties(listing_type);
create index idx_properties_property_type   on public.properties(property_type);
create index idx_properties_country         on public.properties(country);
create index idx_properties_city            on public.properties(city);
create index idx_properties_is_featured     on public.properties(is_featured) where is_featured = true;
create index idx_properties_created_at      on public.properties(created_at desc);
create index idx_properties_slug            on public.properties(slug);
create index idx_properties_asking_price    on public.properties(asking_price);
create index idx_properties_location_gist   on public.properties using gist(location);
create index idx_properties_fts             on public.properties using gin(
  to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(city,'') || ' ' || coalesce(suburb,''))
);

-- property_media
create index idx_property_media_property_id on public.property_media(property_id);
create index idx_property_media_is_cover    on public.property_media(property_id) where is_cover = true;

-- property_views
create index idx_property_views_property_id on public.property_views(property_id);
create index idx_property_views_viewed_at   on public.property_views(viewed_at desc);

-- saved_properties
create index idx_saved_user_id     on public.saved_properties(user_id);
create index idx_saved_property_id on public.saved_properties(property_id);

-- conversations
create index idx_conversations_buyer_id  on public.conversations(buyer_id);
create index idx_conversations_seller_id on public.conversations(seller_id);
create index idx_conversations_last_msg  on public.conversations(last_message_at desc);

-- messages
create index idx_messages_conversation_id on public.messages(conversation_id);
create index idx_messages_sender_id       on public.messages(sender_id);
create index idx_messages_created_at      on public.messages(created_at desc);

-- reservations
create index idx_reservations_property_id   on public.reservations(property_id);
create index idx_reservations_buyer_id      on public.reservations(buyer_id);
create index idx_reservations_seller_id     on public.reservations(seller_id);
create index idx_reservations_status        on public.reservations(status);
create index idx_reservations_reserved_date on public.reservations(reserved_date);

-- notifications
create index idx_notifications_user_id    on public.notifications(user_id);
create index idx_notifications_is_read    on public.notifications(user_id, is_read) where is_read = false;
create index idx_notifications_created_at on public.notifications(created_at desc);

-- reports
create index idx_reports_status      on public.reports(status);
create index idx_reports_property_id on public.reports(property_id);

-- admin_activity_log
create index idx_admin_log_admin_id   on public.admin_activity_log(admin_id);
create index idx_admin_log_created_at on public.admin_activity_log(created_at desc);
