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
    'high-frequency-language-useful-expressions',
    'Useful expressions',
    'Spec-required high-frequency GCSE Russian useful expressions from Section 1: High-frequency language.',
    'high_frequency_language',
    'useful_expressions',
    'both',
    'spec_only',
    'specification',
    'single_column',
    true,
    150,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'section-1:high-frequency-language:useful-expressions'
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
    'useful-expressions',
    'Useful expressions',
    'Spec-required high-frequency GCSE Russian useful expressions.',
    'high_frequency_language',
    'useful_expressions',
    'useful_expressions',
    'both',
    'spec_only',
    'single_column',
    true,
    150,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 1: High-frequency language / Useful expressions',
    'section-1:high-frequency-language:useful-expressions:list'
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
    (1, $$it annoys me$$, $$это раздражает меня$$, $$это раздражает меня$$),
    (2, $$it depends$$, $$это зависит$$, $$это зависит$$),
    (3, $$it doesn’t matter$$, $$это неважно$$, $$это неважно$$),
    (4, $$it makes me laugh$$, $$это смешно$$, $$это смешно$$),
    (5, $$it’s all the same to me$$, $$мне всё равно$$, $$мне всё равно$$),
    (6, $$let’s$$, $$давай / давайте$$, $$давай/те$$),
    (7, $$most of all$$, $$больше всего$$, $$больше всего$$),
    (8, $$must$$, $$должен / должна / должно / должны$$, $$должен/должна/должно/должны$$),
    (9, $$of course$$, $$конечно$$, $$конечно$$),
    (10, $$okay (in agreement)$$, $$ладно$$, $$ладно$$),
    (11, $$once again$$, $$ещё раз$$, $$ещё раз$$),
    (12, $$one of the following$$, $$один / одна / одно из следующих$$, $$один/одна/одно из следующих$$),
    (13, $$personally$$, $$лично$$, $$лично$$),
    (14, $$so much the better$$, $$тем лучше$$, $$тем лучше$$),
    (15, $$so, so$$, $$ничего$$, $$ничего$$),
    (16, $$suddenly$$, $$вдруг$$, $$вдруг$$),
    (17, $$that doesn’t interest me$$, $$это меня не интересует$$, $$это меня не интересует$$),
    (18, $$that’s enough$$, $$хватит / достаточно$$, $$хватит, достаточно$$),
    (19, $$the thing is that ...$$, $$дело в том, что ...$$, $$дело в том, что ….$$),
    (20, $$there is/are$$, $$есть$$, $$есть$$),
    (21, $$too bad, what a shame$$, $$очень жаль / как жалко$$, $$очень жаль, как жалко$$),
    (22, $$true (this is)$$, $$это правда$$, $$(это) правда$$),
    (23, $$well done!$$, $$молодец!$$, $$молодец!$$),
    (24, $$what does that mean?$$, $$что это значит?$$, $$что это значит?$$),
    (25, $$what is it like?$$, $$как это?$$, $$как это?$$),
    (26, $$with pleasure$$, $$с удовольствием$$, $$с удовольствием$$),
    (27, $$you are not allowed to$$, $$нельзя$$, $$нельзя$$),
    (28, $$you can (one can)$$, $$можно$$, $$можно$$),
    (29, $$you must (one must)$$, $$надо$$, $$надо$$)
),
prepared_items as (
  select
    raw_items.position,
    raw_items.english,
    raw_items.russian,
    raw_items.spec_russian,
    (
      'section-1:high-frequency-language:useful-expressions:item-' ||
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
    'useful_expressions',
    'useful_expressions',
    'not_applicable',
    false,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 1: High-frequency language / Useful expressions',
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
  'Section 1: High-frequency language / Useful expressions',
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
