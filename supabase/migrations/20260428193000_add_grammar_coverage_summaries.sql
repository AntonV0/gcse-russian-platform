begin;

create index if not exists grammar_points_set_tier_idx
  on public.grammar_points (grammar_set_id, tier);

create index if not exists lesson_grammar_links_set_variant_idx
  on public.lesson_grammar_links (grammar_set_id, variant);

create index if not exists lesson_grammar_links_point_variant_idx
  on public.lesson_grammar_links (grammar_point_id, variant);

create or replace view public.grammar_point_coverage
with (security_invoker = true)
as
with point_lesson_links as (
  select distinct
    points.id as grammar_point_id,
    links.variant,
    links.lesson_id
  from public.grammar_points points
  join public.lesson_grammar_links links
    on links.grammar_point_id = points.id
    or links.grammar_set_id = points.grammar_set_id
  where links.variant in ('foundation', 'higher', 'volna')
),
lesson_counts as (
  select
    grammar_point_id,
    count(*) filter (where variant = 'foundation') as foundation_occurrences,
    count(*) filter (where variant = 'higher') as higher_occurrences,
    count(*) filter (where variant = 'volna') as volna_occurrences
  from point_lesson_links
  group by grammar_point_id
)
select
  points.id as grammar_point_id,
  coalesce(lesson_counts.foundation_occurrences, 0) > 0 as used_in_foundation,
  coalesce(lesson_counts.higher_occurrences, 0) > 0 as used_in_higher,
  coalesce(lesson_counts.volna_occurrences, 0) > 0 as used_in_volna,
  coalesce(lesson_counts.foundation_occurrences, 0)::integer as foundation_occurrences,
  coalesce(lesson_counts.higher_occurrences, 0)::integer as higher_occurrences,
  coalesce(lesson_counts.volna_occurrences, 0)::integer as volna_occurrences
from public.grammar_points points
left join lesson_counts
  on lesson_counts.grammar_point_id = points.id;

grant select on public.grammar_point_coverage to authenticated;

create or replace view public.grammar_set_summaries
with (security_invoker = true)
as
with point_counts as (
  select
    points.grammar_set_id,
    count(*)::integer as point_count
  from public.grammar_points points
  group by points.grammar_set_id
),
variant_total_points as (
  select
    points.grammar_set_id,
    'foundation'::text as variant,
    points.id as grammar_point_id
  from public.grammar_points points
  where points.tier in ('foundation', 'both')
  union
  select
    points.grammar_set_id,
    'higher'::text as variant,
    points.id as grammar_point_id
  from public.grammar_points points
  where points.tier in ('foundation', 'higher', 'both')
  union
  select
    points.grammar_set_id,
    'volna'::text as variant,
    points.id as grammar_point_id
  from public.grammar_points points
  where points.tier in ('foundation', 'higher', 'both')
),
variant_total_counts as (
  select
    variant_total_points.grammar_set_id,
    (count(distinct variant_total_points.grammar_point_id)
      filter (where variant_total_points.variant = 'foundation')
    )::integer as foundation_total_points,
    (count(distinct variant_total_points.grammar_point_id)
      filter (where variant_total_points.variant = 'higher')
    )::integer as higher_total_points,
    (count(distinct variant_total_points.grammar_point_id)
      filter (where variant_total_points.variant = 'volna')
    )::integer as volna_total_points
  from variant_total_points
  group by variant_total_points.grammar_set_id
),
variant_used_counts as (
  select
    variant_total_points.grammar_set_id,
    (count(distinct variant_total_points.grammar_point_id)
      filter (
        where variant_total_points.variant = 'foundation'
          and coverage.used_in_foundation
      )
    )::integer as foundation_used_points,
    (count(distinct variant_total_points.grammar_point_id)
      filter (
        where variant_total_points.variant = 'higher'
          and coverage.used_in_higher
      )
    )::integer as higher_used_points,
    (count(distinct variant_total_points.grammar_point_id)
      filter (
        where variant_total_points.variant = 'volna'
          and coverage.used_in_volna
      )
    )::integer as volna_used_points
  from variant_total_points
  left join public.grammar_point_coverage coverage
    on coverage.grammar_point_id = variant_total_points.grammar_point_id
  group by variant_total_points.grammar_set_id
),
lesson_set_usage as (
  select distinct
    links.grammar_set_id,
    links.variant,
    links.lesson_id
  from public.lesson_grammar_links links
  where links.grammar_set_id is not null
    and links.variant in ('foundation', 'higher', 'volna')
  union
  select distinct
    points.grammar_set_id,
    links.variant,
    links.lesson_id
  from public.lesson_grammar_links links
  join public.grammar_points points
    on points.id = links.grammar_point_id
  where links.variant in ('foundation', 'higher', 'volna')
),
usage_counts as (
  select
    lesson_set_usage.grammar_set_id,
    count(*)::integer as total_occurrences,
    (count(*) filter (where lesson_set_usage.variant = 'foundation'))::integer
      as foundation_occurrences,
    (count(*) filter (where lesson_set_usage.variant = 'higher'))::integer
      as higher_occurrences,
    (count(*) filter (where lesson_set_usage.variant = 'volna'))::integer
      as volna_occurrences
  from lesson_set_usage
  group by lesson_set_usage.grammar_set_id
)
select
  sets.id as grammar_set_id,
  coalesce(point_counts.point_count, 0) as point_count,
  coalesce(usage_counts.total_occurrences, 0) as total_occurrences,
  coalesce(usage_counts.foundation_occurrences, 0) as foundation_occurrences,
  coalesce(usage_counts.higher_occurrences, 0) as higher_occurrences,
  coalesce(usage_counts.volna_occurrences, 0) as volna_occurrences,
  coalesce(variant_total_counts.foundation_total_points, 0)
    as foundation_total_points,
  coalesce(variant_total_counts.higher_total_points, 0)
    as higher_total_points,
  coalesce(variant_total_counts.volna_total_points, 0)
    as volna_total_points,
  coalesce(variant_used_counts.foundation_used_points, 0)
    as foundation_used_points,
  coalesce(variant_used_counts.higher_used_points, 0)
    as higher_used_points,
  coalesce(variant_used_counts.volna_used_points, 0)
    as volna_used_points
from public.grammar_sets sets
left join point_counts
  on point_counts.grammar_set_id = sets.id
left join usage_counts
  on usage_counts.grammar_set_id = sets.id
left join variant_total_counts
  on variant_total_counts.grammar_set_id = sets.id
left join variant_used_counts
  on variant_used_counts.grammar_set_id = sets.id;

grant select on public.grammar_set_summaries to authenticated;

commit;
