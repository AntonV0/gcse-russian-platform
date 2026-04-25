begin;

create or replace view public.vocabulary_item_coverage as
with item_lesson_links as (
  select distinct
    items.id as vocabulary_item_id,
    links.variant,
    links.lesson_id
  from public.vocabulary_items items
  join public.lesson_vocabulary_links links
    on links.vocabulary_item_id = items.id
    or links.vocabulary_set_id = items.vocabulary_set_id
    or exists (
      select 1
      from public.vocabulary_list_items list_items
      where list_items.vocabulary_list_id = links.vocabulary_list_id
        and list_items.vocabulary_item_id = items.id
    )
  where links.variant in ('foundation', 'higher', 'volna')
),
legacy_set_lesson_usages as (
  select distinct
    items.id as vocabulary_item_id,
    usages.variant,
    usages.lesson_id
  from public.vocabulary_items items
  join public.lesson_vocabulary_set_usages usages
    on usages.vocabulary_set_id = items.vocabulary_set_id
  where usages.variant in ('foundation', 'higher', 'volna')
),
lesson_coverage as (
  select distinct vocabulary_item_id, variant, lesson_id
  from item_lesson_links
  union
  select distinct vocabulary_item_id, variant, lesson_id
  from legacy_set_lesson_usages
),
lesson_counts as (
  select
    vocabulary_item_id,
    count(*) filter (where variant = 'foundation') as foundation_occurrences,
    count(*) filter (where variant = 'higher') as higher_occurrences,
    count(*) filter (where variant = 'volna') as volna_occurrences
  from lesson_coverage
  group by vocabulary_item_id
),
custom_list_counts as (
  select
    list_items.vocabulary_item_id,
    count(*) as custom_list_occurrences
  from public.vocabulary_list_items list_items
  join public.vocabulary_lists lists
    on lists.id = list_items.vocabulary_list_id
  where lists.list_mode = 'custom'
  group by list_items.vocabulary_item_id
)
select
  items.id as vocabulary_item_id,
  coalesce(lesson_counts.foundation_occurrences, 0) > 0 as used_in_foundation,
  coalesce(lesson_counts.higher_occurrences, 0) > 0 as used_in_higher,
  coalesce(lesson_counts.volna_occurrences, 0) > 0 as used_in_volna,
  coalesce(custom_list_counts.custom_list_occurrences, 0) > 0 as used_in_custom_list,
  coalesce(lesson_counts.foundation_occurrences, 0)::integer as foundation_occurrences,
  coalesce(lesson_counts.higher_occurrences, 0)::integer as higher_occurrences,
  coalesce(lesson_counts.volna_occurrences, 0)::integer as volna_occurrences,
  coalesce(custom_list_counts.custom_list_occurrences, 0)::integer as custom_list_occurrences
from public.vocabulary_items items
left join lesson_counts
  on lesson_counts.vocabulary_item_id = items.id
left join custom_list_counts
  on custom_list_counts.vocabulary_item_id = items.id;

grant select on public.vocabulary_item_coverage to authenticated;

commit;
