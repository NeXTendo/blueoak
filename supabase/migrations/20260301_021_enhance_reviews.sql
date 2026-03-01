-- BlueOak — Enhance reviews for chat-based ratings
-- Migration: 20260301_021_enhance_reviews.sql

-- 1. Make reservation_id nullable
alter table public.reviews alter column reservation_id drop not null;

-- 2. Add property_id for context
do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_name='reviews' and column_name='property_id') then
    alter table public.reviews add column property_id uuid references public.properties(id) on delete set null;
  end if;
end $$;

-- 3. Add index for property_id
create index if not exists idx_reviews_property_id on public.reviews(property_id);

-- 4. RLS Policies
-- Enable RLS (already enabled in core table migration, but ensuring here)
alter table public.reviews enable row level security;

-- Select: Public reviews are viewable by everyone
drop policy if exists "Public reviews are viewable by everyone" on public.reviews;
create policy "Public reviews are viewable by everyone"
  on public.reviews for select
  using (is_public = true or reviewer_id = auth.uid());

-- Insert: Users can create reviews if they have a conversation or reservation
drop policy if exists "Users can create reviews" on public.reviews;
create policy "Users can create reviews"
  on public.reviews for insert
  with check (
    auth.uid() = reviewer_id and
    (
      -- Option A: They have a reservation
      (reservation_id is not null and exists(
        select 1 from public.reservations r 
        where r.id = reservation_id and (r.buyer_id = auth.uid() or r.seller_id = auth.uid())
      ))
      or
      -- Option B: They have a conversation with the person they are reviewing
      exists(
        select 1 from public.conversations c 
        where (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
        and (c.buyer_id = reviewed_id or c.seller_id = reviewed_id)
      )
    )
  );

-- Update/Delete: Own reviews only
drop policy if exists "Users can update their own reviews" on public.reviews;
create policy "Users can update their own reviews"
  on public.reviews for update
  using (auth.uid() = reviewer_id);

drop policy if exists "Users can delete their own reviews" on public.reviews;
create policy "Users can delete their own reviews"
  on public.reviews for delete
  using (auth.uid() = reviewer_id);
