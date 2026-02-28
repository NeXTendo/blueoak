-- ============================================================
-- BlueOak — Fix Storage Buckets
-- Creates missing buckets necessary for image uploads
-- ============================================================

-- Create property-media bucket if it doesn't exist
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-media',
  'property-media',
  true,
  209715200,
  array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/quicktime','application/pdf']
)
on conflict (id) do nothing;

-- Create avatars bucket if it doesn't exist
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do nothing;

-- Create documents bucket if it doesn't exist
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  10485760,
  array['application/pdf','image/jpeg','image/png']
)
on conflict (id) do nothing;

-- Create message-attachments bucket if it doesn't exist
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'message-attachments',
  'message-attachments',
  false,
  10485760,
  array['image/jpeg','image/png','image/webp','application/pdf']
)
on conflict (id) do nothing;


-- ============================================================
-- RLS Policies (Safely recreate them)
-- ============================================================

do $$
begin
  -- property-media
  drop policy if exists "Public can view property media" on storage.objects;
  create policy "Public can view property media"
    on storage.objects for select using (bucket_id = 'property-media');

  drop policy if exists "Authenticated can upload property media" on storage.objects;
  create policy "Authenticated can upload property media"
    on storage.objects for insert with check (
      bucket_id = 'property-media' and auth.uid()::text = (storage.foldername(name))[1]
    );

  drop policy if exists "Owners can delete property media" on storage.objects;
  create policy "Owners can delete property media"
    on storage.objects for delete using (
      bucket_id = 'property-media' and auth.uid()::text = (storage.foldername(name))[1]
    );

  -- avatars
  drop policy if exists "Public can view avatars" on storage.objects;
  create policy "Public can view avatars"
    on storage.objects for select using (bucket_id = 'avatars');

  drop policy if exists "Users can upload own avatar" on storage.objects;
  create policy "Users can upload own avatar"
    on storage.objects for insert with check (
      bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
    );

  drop policy if exists "Users can update own avatar" on storage.objects;
  create policy "Users can update own avatar"
    on storage.objects for update using (
      bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
    );

  -- documents
  drop policy if exists "Owners can read their documents" on storage.objects;
  create policy "Owners can read their documents"
    on storage.objects for select using (
      bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
    );

  drop policy if exists "Owners can upload documents" on storage.objects;
  create policy "Owners can upload documents"
    on storage.objects for insert with check (
      bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
    );
end $$;
