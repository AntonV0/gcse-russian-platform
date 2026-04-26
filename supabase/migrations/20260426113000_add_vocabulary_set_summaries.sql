begin;

create index if not exists vocabulary_items_set_tier_idx
  on public.vocabulary_items (vocabulary_set_id, tier);

create index if not exists vocabulary_lists_set_tier_idx
  on public.vocabulary_lists (vocabulary_set_id, tier);

create or replace view public.vocabulary_set_summaries
with (security_invoker = true)
as
with direct_items as (
  select
    items.vocabulary_set_id,
    items.id as vocabulary_item_id,
    items.tier
  from public.vocabulary_items items
),
list_items as (
  select
    lists.vocabulary_set_id,
    lists.id as vocabulary_list_id,
    list_items.vocabulary_item_id,
    lists.tier as list_tier
  from public.vocabulary_lists lists
  join public.vocabulary_list_items list_items
    on list_items.vocabulary_list_id = lists.id
),
all_set_item_ids as (
  select
    direct_items.vocabulary_set_id,
    direct_items.vocabulary_item_id
  from direct_items
  union
  select
    list_items.vocabulary_set_id,
    list_items.vocabulary_item_id
  from list_items
),
item_counts as (
  select
    all_set_item_ids.vocabulary_set_id,
    count(distinct all_set_item_ids.vocabulary_item_id)::integer as item_count
  from all_set_item_ids
  group by all_set_item_ids.vocabulary_set_id
),
list_counts as (
  select
    lists.vocabulary_set_id,
    count(*)::integer as list_count
  from public.vocabulary_lists lists
  group by lists.vocabulary_set_id
),
variant_total_items as (
  select
    direct_items.vocabulary_set_id,
    'foundation'::text as variant,
    direct_items.vocabulary_item_id
  from direct_items
  where direct_items.tier in ('foundation', 'both', 'unknown')
  union
  select
    direct_items.vocabulary_set_id,
    'higher'::text as variant,
    direct_items.vocabulary_item_id
  from direct_items
  where direct_items.tier in ('foundation', 'higher', 'both', 'unknown')
  union
  select
    direct_items.vocabulary_set_id,
    'volna'::text as variant,
    direct_items.vocabulary_item_id
  from direct_items
  where direct_items.tier in ('foundation', 'higher', 'both', 'unknown')
  union
  select
    list_items.vocabulary_set_id,
    'foundation'::text as variant,
    list_items.vocabulary_item_id
  from list_items
  where list_items.list_tier in ('foundation', 'both', 'unknown')
  union
  select
    list_items.vocabulary_set_id,
    'higher'::text as variant,
    list_items.vocabulary_item_id
  from list_items
  where list_items.list_tier in ('foundation', 'higher', 'both', 'unknown')
  union
  select
    list_items.vocabulary_set_id,
    'volna'::text as variant,
    list_items.vocabulary_item_id
  from list_items
  where list_items.list_tier in ('foundation', 'higher', 'both', 'unknown')
),
variant_total_counts as (
  select
    variant_total_items.vocabulary_set_id,
    (count(distinct variant_total_items.vocabulary_item_id)
      filter (where variant_total_items.variant = 'foundation')
    )::integer as foundation_total_items,
    (count(distinct variant_total_items.vocabulary_item_id)
      filter (where variant_total_items.variant = 'higher')
    )::integer as higher_total_items,
    (count(distinct variant_total_items.vocabulary_item_id)
      filter (where variant_total_items.variant = 'volna')
    )::integer as volna_total_items
  from variant_total_items
  group by variant_total_items.vocabulary_set_id
),
variant_used_counts as (
  select
    variant_total_items.vocabulary_set_id,
    (count(distinct variant_total_items.vocabulary_item_id)
      filter (
        where variant_total_items.variant = 'foundation'
          and coverage.used_in_foundation
      )
    )::integer as foundation_used_items,
    (count(distinct variant_total_items.vocabulary_item_id)
      filter (
        where variant_total_items.variant = 'higher'
          and coverage.used_in_higher
      )
    )::integer as higher_used_items,
    (count(distinct variant_total_items.vocabulary_item_id)
      filter (
        where variant_total_items.variant = 'volna'
          and coverage.used_in_volna
      )
    )::integer as volna_used_items
  from variant_total_items
  left join public.vocabulary_item_coverage coverage
    on coverage.vocabulary_item_id = variant_total_items.vocabulary_item_id
  group by variant_total_items.vocabulary_set_id
),
custom_list_used_counts as (
  select
    all_set_item_ids.vocabulary_set_id,
    (count(distinct all_set_item_ids.vocabulary_item_id)
      filter (where coverage.used_in_custom_list)
    )::integer as custom_list_used_items
  from all_set_item_ids
  left join public.vocabulary_item_coverage coverage
    on coverage.vocabulary_item_id = all_set_item_ids.vocabulary_item_id
  group by all_set_item_ids.vocabulary_set_id
),
usage_counts as (
  select
    usages.vocabulary_set_id,
    count(*)::integer as total_occurrences,
    (count(*) filter (where usages.variant = 'foundation'))::integer
      as foundation_occurrences,
    (count(*) filter (where usages.variant = 'higher'))::integer
      as higher_occurrences,
    (count(*) filter (where usages.variant = 'volna'))::integer
      as volna_occurrences
  from public.lesson_vocabulary_set_usages usages
  where usages.variant in ('foundation', 'higher', 'volna')
  group by usages.vocabulary_set_id
)
select
  sets.id as vocabulary_set_id,
  coalesce(item_counts.item_count, 0) as item_count,
  coalesce(list_counts.list_count, 0) as list_count,
  coalesce(usage_counts.total_occurrences, 0) as total_occurrences,
  coalesce(usage_counts.foundation_occurrences, 0) as foundation_occurrences,
  coalesce(usage_counts.higher_occurrences, 0) as higher_occurrences,
  coalesce(usage_counts.volna_occurrences, 0) as volna_occurrences,
  coalesce(variant_total_counts.foundation_total_items, 0)
    as foundation_total_items,
  coalesce(variant_total_counts.higher_total_items, 0)
    as higher_total_items,
  coalesce(variant_total_counts.volna_total_items, 0)
    as volna_total_items,
  coalesce(item_counts.item_count, 0) as custom_list_total_items,
  coalesce(variant_used_counts.foundation_used_items, 0)
    as foundation_used_items,
  coalesce(variant_used_counts.higher_used_items, 0)
    as higher_used_items,
  coalesce(variant_used_counts.volna_used_items, 0)
    as volna_used_items,
  coalesce(custom_list_used_counts.custom_list_used_items, 0)
    as custom_list_used_items
from public.vocabulary_sets sets
left join item_counts
  on item_counts.vocabulary_set_id = sets.id
left join list_counts
  on list_counts.vocabulary_set_id = sets.id
left join usage_counts
  on usage_counts.vocabulary_set_id = sets.id
left join variant_total_counts
  on variant_total_counts.vocabulary_set_id = sets.id
left join variant_used_counts
  on variant_used_counts.vocabulary_set_id = sets.id
left join custom_list_used_counts
  on custom_list_used_counts.vocabulary_set_id = sets.id;

grant select on public.vocabulary_set_summaries to authenticated;

commit;
