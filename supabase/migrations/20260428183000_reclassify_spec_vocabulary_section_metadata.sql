begin;

with section_moves (
  import_key,
  theme_key,
  topic_key,
  category_key,
  sort_order
) as (
  values
    (
      'countries',
      'local_area_holiday_travel',
      'local_area_holiday_travel',
      'countries',
      405
    ),
    (
      'areas-mountains-seas-places',
      'local_area_holiday_travel',
      'local_area_holiday_travel',
      'areas_mountains_seas_places',
      410
    ),
    (
      'nationalities',
      'identity_and_culture',
      'identity_and_culture_family_and_relationships',
      'nationalities',
      325
    ),
    (
      'continents',
      'international_global_dimension',
      'international_global_dimension_bringing_world_together_environmental_issues',
      'continents',
      705
    )
),
target_sets as (
  select
    sets.id,
    section_moves.theme_key,
    section_moves.topic_key,
    section_moves.category_key,
    section_moves.sort_order
  from public.vocabulary_sets sets
  join section_moves
    on section_moves.import_key = sets.import_key
  where sets.source_key = 'pearson_edexcel_gcse_russian_1ru0'
    and sets.set_type = 'specification'
)
update public.vocabulary_sets sets
set
  theme_key = target_sets.theme_key,
  topic_key = target_sets.topic_key,
  sort_order = target_sets.sort_order,
  updated_at = now()
from target_sets
where sets.id = target_sets.id;

with section_moves (
  import_key,
  theme_key,
  topic_key,
  category_key,
  sort_order
) as (
  values
    (
      'countries',
      'local_area_holiday_travel',
      'local_area_holiday_travel',
      'countries',
      405
    ),
    (
      'areas-mountains-seas-places',
      'local_area_holiday_travel',
      'local_area_holiday_travel',
      'areas_mountains_seas_places',
      410
    ),
    (
      'nationalities',
      'identity_and_culture',
      'identity_and_culture_family_and_relationships',
      'nationalities',
      325
    ),
    (
      'continents',
      'international_global_dimension',
      'international_global_dimension_bringing_world_together_environmental_issues',
      'continents',
      705
    )
),
target_sets as (
  select
    sets.id,
    section_moves.theme_key,
    section_moves.topic_key,
    section_moves.category_key,
    section_moves.sort_order
  from public.vocabulary_sets sets
  join section_moves
    on section_moves.import_key = sets.import_key
  where sets.source_key = 'pearson_edexcel_gcse_russian_1ru0'
    and sets.set_type = 'specification'
)
update public.vocabulary_lists lists
set
  theme_key = target_sets.theme_key,
  topic_key = target_sets.topic_key,
  category_key = target_sets.category_key,
  sort_order = target_sets.sort_order,
  updated_at = now()
from target_sets
where lists.vocabulary_set_id = target_sets.id;

with section_moves (
  import_key,
  theme_key,
  topic_key,
  category_key
) as (
  values
    (
      'countries',
      'local_area_holiday_travel',
      'local_area_holiday_travel',
      'countries'
    ),
    (
      'areas-mountains-seas-places',
      'local_area_holiday_travel',
      'local_area_holiday_travel',
      'areas_mountains_seas_places'
    ),
    (
      'nationalities',
      'identity_and_culture',
      'identity_and_culture_family_and_relationships',
      'nationalities'
    ),
    (
      'continents',
      'international_global_dimension',
      'international_global_dimension_bringing_world_together_environmental_issues',
      'continents'
    )
),
target_sets as (
  select
    sets.id,
    section_moves.theme_key,
    section_moves.topic_key,
    section_moves.category_key
  from public.vocabulary_sets sets
  join section_moves
    on section_moves.import_key = sets.import_key
  where sets.source_key = 'pearson_edexcel_gcse_russian_1ru0'
    and sets.set_type = 'specification'
)
update public.vocabulary_items items
set
  theme_key = target_sets.theme_key,
  topic_key = target_sets.topic_key,
  category_key = target_sets.category_key,
  updated_at = now()
from target_sets
where items.vocabulary_set_id = target_sets.id;

commit;
