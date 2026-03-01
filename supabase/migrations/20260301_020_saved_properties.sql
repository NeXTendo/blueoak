-- ============================================================
-- Migration: saved_properties
-- Allows buyers to save/bookmark listings
-- ============================================================

CREATE TABLE IF NOT EXISTS public.saved_properties (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  created_at  timestamptz DEFAULT now(),
  UNIQUE(user_id, property_id)
);

ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;

-- Users can only see and manage their own saved properties
CREATE POLICY "Users manage their own saved properties"
  ON public.saved_properties
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
