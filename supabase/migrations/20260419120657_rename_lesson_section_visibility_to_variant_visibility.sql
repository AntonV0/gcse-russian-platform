alter table public.lesson_sections
  rename column track_visibility to variant_visibility;
alter table public.lesson_sections drop column if exists delivery_visibility;
alter table public.lesson_sections
alter column variant_visibility
set default 'shared';
update public.lesson_sections
set variant_visibility = 'shared'
where variant_visibility is null;
alter table public.lesson_sections
alter column variant_visibility
set not null;
alter table public.lesson_sections drop constraint if exists lesson_sections_track_visibility_check;
alter table public.lesson_sections drop constraint if exists lesson_sections_delivery_visibility_check;
alter table public.lesson_sections
add constraint lesson_sections_variant_visibility_check check (
    variant_visibility in (
      'shared',
      'foundation_only',
      'higher_only',
      'volna_only'
    )
  );
drop index if exists public.lesson_sections_track_visibility_idx;
drop index if exists public.lesson_sections_delivery_visibility_idx;
create index if not exists lesson_sections_variant_visibility_idx on public.lesson_sections (variant_visibility);
create index if not exists lesson_sections_canonical_section_key_idx on public.lesson_sections (canonical_section_key);