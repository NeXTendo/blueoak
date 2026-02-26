-- BlueOak — Row Level Security

alter table public.profiles             enable row level security;
alter table public.properties           enable row level security;
alter table public.property_media       enable row level security;
alter table public.property_views       enable row level security;
alter table public.saved_properties     enable row level security;
alter table public.conversations        enable row level security;
alter table public.messages             enable row level security;
alter table public.reservations         enable row level security;
alter table public.notifications        enable row level security;
alter table public.reports              enable row level security;
alter table public.reviews              enable row level security;
alter table public.admin_activity_log   enable row level security;
alter table public.platform_settings    enable row level security;
alter table public.seller_subscriptions enable row level security;

-- Helper functions
create or replace function public.get_user_type()
returns public.user_type language sql security definer stable as $$
  select user_type from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists(select 1 from public.profiles where id = auth.uid() and user_type in ('admin','super_admin'))
$$;

create or replace function public.is_super_admin()
returns boolean language sql security definer stable as $$
  select exists(select 1 from public.profiles where id = auth.uid() and user_type = 'super_admin')
$$;

-- profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);
create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Admins can update any profile"
  on public.profiles for update using (public.is_admin());

-- properties policies
create policy "Active properties are viewable by everyone"
  on public.properties for select using (status = 'active' or seller_id = auth.uid() or public.is_admin());
create policy "Sellers can insert properties"
  on public.properties for insert with check (
    auth.uid() = seller_id and
    exists(select 1 from public.profiles where id = auth.uid() and user_type in ('seller','agent','admin','super_admin'))
  );
create policy "Sellers can update their own properties"
  on public.properties for update using (seller_id = auth.uid() or public.is_admin());
create policy "Sellers can delete their own properties"
  on public.properties for delete using (seller_id = auth.uid() or public.is_admin());

-- saved_properties policies
create policy "Users can view their own saved properties"
  on public.saved_properties for select using (user_id = auth.uid());
create policy "Users can save/unsave properties"
  on public.saved_properties for all using (user_id = auth.uid());

-- conversations policies
create policy "Users can view their conversations"
  on public.conversations for select using (buyer_id = auth.uid() or seller_id = auth.uid() or public.is_admin());
create policy "Authenticated users can create conversations"
  on public.conversations for insert with check (auth.uid() = buyer_id);

-- messages policies
create policy "Conversation participants can view messages"
  on public.messages for select using (
    exists(select 1 from public.conversations c where c.id = conversation_id and (c.buyer_id = auth.uid() or c.seller_id = auth.uid()))
    or public.is_admin()
  );
create policy "Conversation participants can send messages"
  on public.messages for insert with check (
    auth.uid() = sender_id and
    exists(select 1 from public.conversations c where c.id = conversation_id and (c.buyer_id = auth.uid() or c.seller_id = auth.uid()))
  );

-- notifications policies
create policy "Users can view their own notifications"
  on public.notifications for select using (user_id = auth.uid());
create policy "Users can update their own notifications"
  on public.notifications for update using (user_id = auth.uid());

-- reservations policies
create policy "Reservation participants can view"
  on public.reservations for select using (buyer_id = auth.uid() or seller_id = auth.uid() or public.is_admin());
create policy "Buyers can create reservations"
  on public.reservations for insert with check (buyer_id = auth.uid());
create policy "Participants can update reservations"
  on public.reservations for update using (buyer_id = auth.uid() or seller_id = auth.uid() or public.is_admin());

-- reports policies
create policy "Users can create reports"
  on public.reports for insert with check (reporter_id = auth.uid());
create policy "Admins can view all reports"
  on public.reports for select using (reporter_id = auth.uid() or public.is_admin());
create policy "Admins can update reports"
  on public.reports for update using (public.is_admin());

-- platform_settings policies
create policy "Anyone can read settings"
  on public.platform_settings for select using (true);
create policy "Only admins can modify settings"
  on public.platform_settings for all using (public.is_admin());

-- admin_activity_log policies
create policy "Admins can view activity log"
  on public.admin_activity_log for select using (public.is_admin());
create policy "Admins can insert activity log"
  on public.admin_activity_log for insert with check (public.is_admin());
