insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'mock-exam-responses',
  'mock-exam-responses',
  false,
  52428800,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'audio/webm',
    'audio/mpeg',
    'audio/mp4',
    'audio/ogg',
    'audio/wav',
    'audio/x-wav'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Students and teachers can read mock exam response files"
on storage.objects;

create policy "Students and teachers can read mock exam response files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'mock-exam-responses'
  and (
    (storage.foldername(name))[2] = (auth.uid())::text
    or exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.is_admin = true
    )
    or exists (
      select 1
      from public.teaching_group_members
      where teaching_group_members.user_id = auth.uid()
        and teaching_group_members.member_role = any (array['teacher'::text, 'assistant'::text])
    )
  )
);

drop policy if exists "Students can upload their own mock exam response files"
on storage.objects;

create policy "Students can upload their own mock exam response files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'mock-exam-responses'
  and (storage.foldername(name))[2] = (auth.uid())::text
);

drop policy if exists "Students can update their own mock exam response files"
on storage.objects;

create policy "Students can update their own mock exam response files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'mock-exam-responses'
  and (storage.foldername(name))[2] = (auth.uid())::text
)
with check (
  bucket_id = 'mock-exam-responses'
  and (storage.foldername(name))[2] = (auth.uid())::text
);

drop policy if exists "Students can delete their own mock exam response files"
on storage.objects;

create policy "Students can delete their own mock exam response files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'mock-exam-responses'
  and (storage.foldername(name))[2] = (auth.uid())::text
);
