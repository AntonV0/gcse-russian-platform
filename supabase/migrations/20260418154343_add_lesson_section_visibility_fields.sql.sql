alter table public.lesson_sections
add column if not exists track_visibility text not null default 'shared',
  add column if not exists delivery_visibility text not null default 'all',
  add column if not exists canonical_section_key text null;
alter table public.lesson_sections
add constraint lesson_sections_track_visibility_check check (
    track_visibility in ('shared', 'foundation_only', 'higher_only')
  );
alter table public.lesson_sections
add constraint lesson_sections_delivery_visibility_check check (
    delivery_visibility in ('all', 'self_study_only', 'volna_only')
  );
create index if not exists lesson_sections_track_visibility_idx on public.lesson_sections (track_visibility);
create index if not exists lesson_sections_delivery_visibility_idx on public.lesson_sections (delivery_visibility);
create index if not exists lesson_sections_canonical_section_key_idx on public.lesson_sections (canonical_section_key);