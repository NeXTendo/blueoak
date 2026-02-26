-- BlueOak — Enable Realtime on key tables
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.reservations;
alter publication supabase_realtime add table public.properties;
