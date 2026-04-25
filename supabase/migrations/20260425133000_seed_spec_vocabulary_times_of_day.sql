begin;

alter table public.vocabulary_items
  add column if not exists spec_russian text;

insert into public.vocabulary_import_sources (
  source_key,
  title,
  source_version,
  publisher,
  notes
)
values (
  'pearson_edexcel_gcse_russian_1ru0',
  'Pearson Edexcel GCSE Russian vocabulary specification',
  '1RU0',
  'Pearson Edexcel',
  'Imported GCSE Russian specification vocabulary. Includes Section 1: High-frequency language sets.'
)
on conflict (source_key) do update
set
  title = excluded.title,
  source_version = excluded.source_version,
  publisher = excluded.publisher,
  notes = excluded.notes,
  updated_at = now();

with upserted_set as (
  insert into public.vocabulary_sets (
    slug,
    title,
    description,
    theme_key,
    topic_key,
    tier,
    list_mode,
    set_type,
    default_display_variant,
    is_published,
    sort_order,
    source_key,
    source_version,
    import_key
  )
  values (
    'high-frequency-language-times-of-day',
    'Times of day',
    'Spec-required high-frequency GCSE Russian times of day from Section 1: High-frequency language.',
    'high_frequency_language',
    'times_of_day',
    'both',
    'spec_only',
    'specification',
    'single_column',
    true,
    110,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'section-1:high-frequency-language:times-of-day'
  )
  on conflict (source_key, import_key)
  where source_key is not null and import_key is not null
  do update
  set
    slug = excluded.slug,
    title = excluded.title,
    description = excluded.description,
    theme_key = excluded.theme_key,
    topic_key = excluded.topic_key,
    tier = excluded.tier,
    list_mode = excluded.list_mode,
    set_type = excluded.set_type,
    default_display_variant = excluded.default_display_variant,
    is_published = excluded.is_published,
    sort_order = excluded.sort_order,
    source_version = excluded.source_version,
    updated_at = now()
  returning id
),
upserted_list as (
  insert into public.vocabulary_lists (
    vocabulary_set_id,
    slug,
    title,
    description,
    theme_key,
    topic_key,
    category_key,
    tier,
    list_mode,
    default_display_variant,
    is_published,
    sort_order,
    source_key,
    source_version,
    source_section_ref,
    import_key
  )
  select
    id,
    'times-of-day',
    'Times of day',
    'Spec-required high-frequency GCSE Russian times of day.',
    'high_frequency_language',
    'times_of_day',
    'times_of_day',
    'both',
    'spec_only',
    'single_column',
    true,
    110,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 1: High-frequency language / Times of day',
    'section-1:high-frequency-language:times-of-day:list'
  from upserted_set
  on conflict (source_key, import_key)
  where source_key is not null and import_key is not null
  do update
  set
    title = excluded.title,
    description = excluded.description,
    theme_key = excluded.theme_key,
    topic_key = excluded.topic_key,
    category_key = excluded.category_key,
    tier = excluded.tier,
    list_mode = excluded.list_mode,
    default_display_variant = excluded.default_display_variant,
    is_published = excluded.is_published,
    sort_order = excluded.sort_order,
    source_version = excluded.source_version,
    source_section_ref = excluded.source_section_ref,
    updated_at = now()
  returning id, vocabulary_set_id
),
raw_items (
  position,
  english,
  russian,
  spec_russian
) as (
  values
    (1, $$1 a.m.$$, $$1 час ночи$$, $$1 час ночи$$),
    (2, $$1 p.m.$$, $$1 час дня$$, $$1 час дня$$),
    (3, $$nine o’clock in the evening$$, $$девять часов вечера$$, $$девять часов вечера$$),
    (4, $$13.00$$, $$13.00$$, $$13.00$$),
    (5, $$at exactly 2 o’clock$$, $$ровно в 2 часа$$, $$ровно в 2 часа$$),
    (6, $$at about ... o’clock$$, $$примерно в ... часа / часов$$, $$примерно в .... часа/часов$$),
    (7, $$it is five past three$$, $$пять минут четвёртого$$, $$пять минут четвёртого$$),
    (8, $$five to three$$, $$без пяти три$$, $$без пяти три$$),
    (9, $$half past nine$$, $$половина десятого / полдесятого$$, $$половина десятого, полдесятого$$),
    (10, $$ten past four$$, $$десять минут пятого$$, $$десять минут пятого$$),
    (11, $$ten to four$$, $$без десяти четыре$$, $$без десяти четыре$$),
    (12, $$quarter to six$$, $$без четверти шесть$$, $$без четверти шесть$$),
    (13, $$quarter past seven$$, $$четверть восьмого$$, $$четверть восьмого$$)
),
prepared_items as (
  select
    raw_items.position,
    raw_items.english,
    raw_items.russian,
    raw_items.spec_russian,
    (
      'section-1:high-frequency-language:times-of-day:item-' ||
      lpad(raw_items.position::text, 3, '0')
    ) as import_key,
    regexp_replace(
      lower(raw_items.english),
      '[^a-z0-9]+',
      '-',
      'g'
    ) as canonical_key
  from raw_items
),
upserted_items as (
  insert into public.vocabulary_items (
    vocabulary_set_id,
    canonical_key,
    russian,
    english,
    item_type,
    source_type,
    priority,
    part_of_speech,
    gender,
    productive_receptive,
    tier,
    theme_key,
    topic_key,
    category_key,
    aspect,
    is_reflexive,
    source_key,
    source_version,
    source_section_ref,
    import_key,
    position,
    spec_russian,
    notes
  )
  select
    upserted_list.vocabulary_set_id,
    trim(both '-' from prepared_items.canonical_key),
    prepared_items.russian,
    prepared_items.english,
    'phrase',
    'spec_required',
    'core',
    'phrase',
    'not_applicable',
    'unknown',
    'both',
    'high_frequency_language',
    'times_of_day',
    'times_of_day',
    'not_applicable',
    false,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 1: High-frequency language / Times of day',
    prepared_items.import_key,
    prepared_items.position,
    prepared_items.spec_russian,
    null
  from prepared_items
  cross join upserted_list
  on conflict (source_key, import_key)
  where source_key is not null and import_key is not null
  do update
  set
    vocabulary_set_id = excluded.vocabulary_set_id,
    canonical_key = excluded.canonical_key,
    russian = excluded.russian,
    english = excluded.english,
    item_type = excluded.item_type,
    source_type = excluded.source_type,
    priority = excluded.priority,
    part_of_speech = excluded.part_of_speech,
    gender = excluded.gender,
    productive_receptive = excluded.productive_receptive,
    tier = excluded.tier,
    theme_key = excluded.theme_key,
    topic_key = excluded.topic_key,
    category_key = excluded.category_key,
    aspect = excluded.aspect,
    is_reflexive = excluded.is_reflexive,
    source_version = excluded.source_version,
    source_section_ref = excluded.source_section_ref,
    position = excluded.position,
    spec_russian = excluded.spec_russian,
    notes = excluded.notes,
    updated_at = now()
  returning id, import_key, position
)
insert into public.vocabulary_list_items (
  vocabulary_list_id,
  vocabulary_item_id,
  position,
  productive_receptive_override,
  tier_override,
  source_section_ref,
  import_key
)
select
  upserted_list.id,
  upserted_items.id,
  upserted_items.position,
  null,
  'both',
  'Section 1: High-frequency language / Times of day',
  upserted_items.import_key
from upserted_items
cross join upserted_list
on conflict (vocabulary_list_id, import_key)
where import_key is not null
do update
set
  vocabulary_item_id = excluded.vocabulary_item_id,
  position = excluded.position,
  productive_receptive_override = excluded.productive_receptive_override,
  tier_override = excluded.tier_override,
  source_section_ref = excluded.source_section_ref;

commit;
