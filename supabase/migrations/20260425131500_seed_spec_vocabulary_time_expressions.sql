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
    'high-frequency-language-time-expressions',
    'Time expressions',
    'Spec-required high-frequency GCSE Russian time expressions from Section 1: High-frequency language.',
    'high_frequency_language',
    'time_expressions',
    'both',
    'spec_only',
    'specification',
    'single_column',
    true,
    100,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'section-1:high-frequency-language:time-expressions'
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
    'time-expressions',
    'Time expressions',
    'Spec-required high-frequency GCSE Russian time expressions.',
    'high_frequency_language',
    'time_expressions',
    'time_expressions',
    'both',
    'spec_only',
    'single_column',
    true,
    100,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 1: High-frequency language / Time expressions',
    'section-1:high-frequency-language:time-expressions:list'
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
  spec_russian,
  part_of_speech,
  gender
) as (
  values
    (1, $$after$$, $$после$$, $$после$$, 'preposition', 'not_applicable'),
    (2, $$ago$$, $$назад$$, $$назад$$, 'adverb', 'not_applicable'),
    (3, $$already$$, $$уже$$, $$уже$$, 'adverb', 'not_applicable'),
    (4, $$always$$, $$всегда$$, $$всегда$$, 'adverb', 'not_applicable'),
    (5, $$as soon as$$, $$как только$$, $$как только$$, 'conjunction', 'not_applicable'),
    (6, $$at night$$, $$ночью$$, $$ночью$$, 'adverb', 'not_applicable'),
    (7, $$at the same time$$, $$в одно и то же время$$, $$в одно и то же время$$, 'adverb', 'not_applicable'),
    (8, $$at the start$$, $$в начале$$, $$в начале$$, 'adverb', 'not_applicable'),
    (9, $$before$$, $$до$$, $$до$$, 'preposition', 'not_applicable'),
    (10, $$day$$, $$день$$, $$день$$, 'noun', 'masculine'),
    (11, $$day (24 hours)$$, $$сутки$$, $$сутки$$, 'noun', 'plural_only'),
    (12, $$day off$$, $$выходной$$, $$выходной$$, 'noun', 'masculine'),
    (13, $$during$$, $$во время / в течение$$, $$во время, в течение$$, 'preposition', 'not_applicable'),
    (14, $$early$$, $$рано$$, $$рано$$, 'adverb', 'not_applicable'),
    (15, $$evening$$, $$вечер$$, $$вечер$$, 'noun', 'masculine'),
    (16, $$every day$$, $$каждый день$$, $$каждый день$$, 'adverb', 'not_applicable'),
    (17, $$fortnight$$, $$две недели$$, $$две недели$$, 'noun', 'not_applicable'),
    (18, $$from$$, $$от$$, $$от$$, 'preposition', 'not_applicable'),
    (19, $$from time to time$$, $$время от времени$$, $$время от времени$$, 'adverb', 'not_applicable'),
    (20, $$hour$$, $$час$$, $$час$$, 'noun', 'masculine'),
    (21, $$immediately$$, $$сразу$$, $$сразу$$, 'adverb', 'not_applicable'),
    (22, $$in the afternoon$$, $$днём$$, $$днём$$, 'adverb', 'not_applicable'),
    (23, $$in the evening$$, $$вечером$$, $$вечером$$, 'adverb', 'not_applicable'),
    (24, $$in the morning$$, $$утром$$, $$утром$$, 'adverb', 'not_applicable'),
    (25, $$in the night$$, $$ночью$$, $$ночью$$, 'adverb', 'not_applicable'),
    (26, $$last night (during the night)$$, $$прошлой ночью$$, $$прошлой ночью$$, 'adverb', 'not_applicable'),
    (27, $$last night (yesterday evening)$$, $$вчера вечером$$, $$вчера вечером$$, 'adverb', 'not_applicable'),
    (28, $$late$$, $$поздно$$, $$поздно$$, 'adverb', 'not_applicable'),
    (29, $$later$$, $$позже$$, $$позже$$, 'adverb', 'not_applicable'),
    (30, $$midday$$, $$полдень$$, $$полдень$$, 'noun', 'masculine'),
    (31, $$midnight$$, $$полночь$$, $$полночь$$, 'noun', 'feminine'),
    (32, $$minute$$, $$минута$$, $$минута$$, 'noun', 'feminine'),
    (33, $$morning$$, $$утро$$, $$утро$$, 'noun', 'neuter'),
    (34, $$night$$, $$ночь$$, $$ночь$$, 'noun', 'feminine'),
    (35, $$now$$, $$теперь$$, $$теперь$$, 'adverb', 'not_applicable'),
    (36, $$on time$$, $$вовремя$$, $$вовремя$$, 'adverb', 'not_applicable'),
    (37, $$once$$, $$один раз$$, $$один раз$$, 'adverb', 'not_applicable'),
    (38, $$once, one day$$, $$однажды$$, $$однажды$$, 'adverb', 'not_applicable'),
    (39, $$right now$$, $$сейчас$$, $$сейчас$$, 'adverb', 'not_applicable'),
    (40, $$since$$, $$с$$, $$с$$, 'preposition', 'not_applicable'),
    (41, $$soon$$, $$скоро$$, $$скоро$$, 'adverb', 'not_applicable'),
    (42, $$the day after tomorrow$$, $$послезавтра$$, $$послезавтра$$, 'adverb', 'not_applicable'),
    (43, $$the day before yesterday$$, $$позавчера$$, $$позавчера$$, 'adverb', 'not_applicable'),
    (44, $$the day/evening before$$, $$накануне$$, $$накануне$$, 'adverb', 'not_applicable'),
    (45, $$the next day; following day$$, $$на следующий день$$, $$на следующий день$$, 'adverb', 'not_applicable'),
    (46, $$time$$, $$время$$, $$время$$, 'noun', 'neuter'),
    (47, $$today$$, $$сегодня$$, $$сегодня$$, 'adverb', 'not_applicable'),
    (48, $$tomorrow$$, $$завтра$$, $$завтра$$, 'adverb', 'not_applicable'),
    (49, $$twice$$, $$два раза$$, $$два раза$$, 'adverb', 'not_applicable'),
    (50, $$week$$, $$неделя$$, $$неделя$$, 'noun', 'feminine'),
    (51, $$weekend$$, $$выходные / уик-энд$$, $$выходные; уик-энд$$, 'noun', 'plural_only'),
    (52, $$what is the time?$$, $$который час?$$, $$который час?$$, 'phrase', 'not_applicable'),
    (53, $$year/s$$, $$год / лет$$, $$год/лет$$, 'noun', 'masculine'),
    (54, $$yesterday$$, $$вчера$$, $$вчера$$, 'adverb', 'not_applicable')
),
prepared_items as (
  select
    raw_items.position,
    raw_items.english,
    raw_items.russian,
    raw_items.spec_russian,
    raw_items.part_of_speech,
    raw_items.gender,
    case
      when raw_items.part_of_speech = 'phrase' or raw_items.russian ~ '\s' then 'phrase'
      else 'word'
    end as item_type,
    (
      'section-1:high-frequency-language:time-expressions:item-' ||
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
    prepared_items.item_type,
    'spec_required',
    'core',
    prepared_items.part_of_speech,
    prepared_items.gender,
    'unknown',
    'both',
    'high_frequency_language',
    'time_expressions',
    'time_expressions',
    'not_applicable',
    false,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 1: High-frequency language / Time expressions',
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
  'Section 1: High-frequency language / Time expressions',
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
