begin;
-- =========================
-- vocabulary_sets expansion
-- =========================
alter table public.vocabulary_sets
add column if not exists theme_key text,
  add column if not exists topic_key text,
  add column if not exists tier text not null default 'both',
  add column if not exists list_mode text not null default 'custom',
  add column if not exists set_type text not null default 'lesson_custom',
  add column if not exists default_display_variant text not null default 'single_column',
  add column if not exists is_published boolean not null default false,
  add column if not exists sort_order integer not null default 0;
alter table public.vocabulary_sets drop constraint if exists vocabulary_sets_tier_check;
alter table public.vocabulary_sets
add constraint vocabulary_sets_tier_check check (tier in ('foundation', 'higher', 'both'));
alter table public.vocabulary_sets drop constraint if exists vocabulary_sets_list_mode_check;
alter table public.vocabulary_sets
add constraint vocabulary_sets_list_mode_check check (
    list_mode in (
      'spec_only',
      'extended_only',
      'spec_and_extended',
      'custom'
    )
  );
alter table public.vocabulary_sets drop constraint if exists vocabulary_sets_set_type_check;
alter table public.vocabulary_sets
add constraint vocabulary_sets_set_type_check check (
    set_type in (
      'core',
      'theme',
      'phrase_bank',
      'exam_prep',
      'lesson_custom'
    )
  );
alter table public.vocabulary_sets drop constraint if exists vocabulary_sets_default_display_variant_check;
alter table public.vocabulary_sets
add constraint vocabulary_sets_default_display_variant_check check (
    default_display_variant in (
      'single_column',
      'two_column',
      'compact_cards'
    )
  );
create index if not exists vocabulary_sets_theme_key_idx on public.vocabulary_sets (theme_key);
create index if not exists vocabulary_sets_topic_key_idx on public.vocabulary_sets (topic_key);
create index if not exists vocabulary_sets_tier_idx on public.vocabulary_sets (tier);
create index if not exists vocabulary_sets_list_mode_idx on public.vocabulary_sets (list_mode);
create index if not exists vocabulary_sets_is_published_idx on public.vocabulary_sets (is_published);
create index if not exists vocabulary_sets_sort_order_idx on public.vocabulary_sets (sort_order);
-- =========================
-- vocabulary_items expansion
-- =========================
alter table public.vocabulary_items
add column if not exists item_type text not null default 'word',
  add column if not exists source_type text not null default 'custom',
  add column if not exists priority text not null default 'core';
alter table public.vocabulary_items drop constraint if exists vocabulary_items_item_type_check;
alter table public.vocabulary_items
add constraint vocabulary_items_item_type_check check (item_type in ('word', 'phrase'));
alter table public.vocabulary_items drop constraint if exists vocabulary_items_source_type_check;
alter table public.vocabulary_items
add constraint vocabulary_items_source_type_check check (
    source_type in ('spec_required', 'extended', 'custom')
  );
alter table public.vocabulary_items drop constraint if exists vocabulary_items_priority_check;
alter table public.vocabulary_items
add constraint vocabulary_items_priority_check check (priority in ('core', 'extension'));
create index if not exists vocabulary_items_source_type_idx on public.vocabulary_items (source_type);
create index if not exists vocabulary_items_priority_idx on public.vocabulary_items (priority);
create index if not exists vocabulary_items_position_idx on public.vocabulary_items (position);
commit;