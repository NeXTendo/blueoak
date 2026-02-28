-- Add settings and status columns to profiles
alter table public.profiles 
  add column if not exists email_notifications boolean not null default true,
  add column if not exists push_notifications boolean not null default true,
  add column if not exists message_notifications boolean not null default true,
  add column if not exists dark_mode boolean not null default false,
  add column if not exists status text not null default 'active' check (status in ('active', 'hibernated'));

-- Create index for status
create index if not exists idx_profiles_status on public.profiles(status);
