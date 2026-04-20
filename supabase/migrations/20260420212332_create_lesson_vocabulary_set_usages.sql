begin;
create table if not exists public.lesson_vocabulary_set_usages (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null,
  vocabulary_set_id uuid not null,
  variant text not null,
  usage_type text not null default 'lesson_block',
  created_at timestamp with time zone not null default now(),
  constraint lesson_vocabulary_set_usages_lesson_id_fkey foreign key (lesson_id) references public.lessons(id) on delete cascade,
  constraint lesson_vocabulary_set_usages_vocabulary_set_id_fkey foreign key (vocabulary_set_id) references public.vocabulary_sets(id) on delete cascade,
  constraint lesson_vocabulary_set_usages_variant_check check (variant in ('foundation', 'higher', 'volna')),
  constraint lesson_vocabulary_set_usages_usage_type_check check (
    usage_type in (
      'lesson_block',
      'lesson_page',
      'revision_page',
      'other'
    )
  ),
  constraint lesson_vocabulary_set_usages_unique unique (
    lesson_id,
    vocabulary_set_id,
    variant,
    usage_type
  )
);
create index if not exists lesson_vocabulary_set_usages_vocabulary_set_id_idx on public.lesson_vocabulary_set_usages (vocabulary_set_id);
create index if not exists lesson_vocabulary_set_usages_lesson_id_idx on public.lesson_vocabulary_set_usages (lesson_id);
create index if not exists lesson_vocabulary_set_usages_variant_idx on public.lesson_vocabulary_set_usages (variant);
create index if not exists lesson_vocabulary_set_usages_usage_type_idx on public.lesson_vocabulary_set_usages (usage_type);
create index if not exists lesson_vocabulary_set_usages_vocab_variant_idx on public.lesson_vocabulary_set_usages (vocabulary_set_id, variant);
alter table public.lesson_vocabulary_set_usages enable row level security;
drop policy if exists "Allow authenticated read on lesson_vocabulary_set_usages" on public.lesson_vocabulary_set_usages;
create policy "Allow authenticated read on lesson_vocabulary_set_usages" on public.lesson_vocabulary_set_usages as permissive for
select to authenticated using (true);
drop policy if exists "Admins can manage lesson_vocabulary_set_usages" on public.lesson_vocabulary_set_usages;
create policy "Admins can manage lesson_vocabulary_set_usages" on public.lesson_vocabulary_set_usages as permissive for all to authenticated using (public.is_current_user_admin()) with check (public.is_current_user_admin());
commit;