-- BlueOak — Storage Buckets & Policies

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('property-media', 'property-media', true,  209715200, array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/quicktime','application/pdf']),
  ('avatars',        'avatars',        true,  5242880,   array['image/jpeg','image/png','image/webp']),
  ('documents',      'documents',      false, 10485760,  array['application/pdf','image/jpeg','image/png']),
  ('message-attachments', 'message-attachments', false, 10485760, array['image/jpeg','image/png','image/webp','application/pdf']);

-- property-media: anyone can view, authenticated can upload to own folder
create policy "Public can view property media"
  on storage.objects for select using (bucket_id = 'property-media');
create policy "Authenticated can upload property media"
  on storage.objects for insert with check (
    bucket_id = 'property-media' and auth.uid()::text = (storage.foldername(name))[1]
  );
create policy "Owners can delete property media"
  on storage.objects for delete using (
    bucket_id = 'property-media' and auth.uid()::text = (storage.foldername(name))[1]
  );

-- avatars: public read, owner write
create policy "Public can view avatars"
  on storage.objects for select using (bucket_id = 'avatars');
create policy "Users can upload own avatar"
  on storage.objects for insert with check (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );
create policy "Users can update own avatar"
  on storage.objects for update using (
    bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]
  );

-- documents: private, owner read/write
create policy "Owners can read their documents"
  on storage.objects for select using (
    bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
  );
create policy "Owners can upload documents"
  on storage.objects for insert with check (
    bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
  );
