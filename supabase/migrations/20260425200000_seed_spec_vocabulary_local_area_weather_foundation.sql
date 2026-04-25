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
  'Imported GCSE Russian specification vocabulary. Includes Section 1: High-frequency language and Section 2: Topic-specific vocabulary sets.'
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
    'local-area-holiday-and-travel-weather',
    'Phrases associated with weather',
    'Spec-required topic-specific GCSE Russian vocabulary for weather within local area, holiday and travel.',
    'local_area_holiday_travel',
    'local_area_holiday_travel_weather',
    'both',
    'spec_only',
    'specification',
    'single_column',
    true,
    410,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'section-2:local-area-holiday-and-travel:weather'
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
    'foundation',
    'Foundation tier',
    'Foundation tier vocabulary for phrases associated with weather.',
    'local_area_holiday_travel',
    'local_area_holiday_travel_weather',
    'weather',
    'foundation',
    'spec_only',
    'single_column',
    true,
    410,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Local area, holiday and travel / Phrases associated with weather / Foundation tier',
    'section-2:local-area-holiday-and-travel:weather:foundation:list'
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
  gender,
  aspect,
  is_reflexive
) as (
  values
    (1, $$bad$$, $$плохой$$, $$плохой$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (2, $$climate$$, $$климат$$, $$климат$$, 'noun', 'masculine', 'not_applicable', false),
    (3, $$cloudy$$, $$облачный$$, $$облачный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (4, $$cold$$, $$холодный$$, $$холодный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (5, $$degree (temperature)$$, $$градус$$, $$градус$$, 'noun', 'masculine', 'not_applicable', false),
    (6, $$fog$$, $$туман$$, $$туман$$, 'noun', 'masculine', 'not_applicable', false),
    (7, $$highest temperature$$, $$максимальная температура$$, $$максимальная температура$$, 'noun', 'feminine', 'not_applicable', false),
    (8, $$hot$$, $$жаркий$$, $$жаркий$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (9, $$in the east$$, $$на востоке$$, $$на востоке$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (10, $$in the north$$, $$на севере$$, $$на севере$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (11, $$in the south$$, $$на юге$$, $$на юге$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (12, $$in the west$$, $$на западе$$, $$на западе$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (13, $$it is chilly$$, $$прохладно$$, $$прохладно$$, 'adverb', 'not_applicable', 'not_applicable', false),
    (14, $$it is freezing$$, $$морозно$$, $$морозно$$, 'adverb', 'not_applicable', 'not_applicable', false),
    (15, $$it is raining$$, $$идёт дождь$$, $$идёт дождь$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (16, $$it is snowing$$, $$идёт снег$$, $$идёт снег$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (17, $$it is windy$$, $$дует ветер$$, $$дует ветер$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (18, $$lowest temperature$$, $$минимальная температура$$, $$минимальная температура$$, 'noun', 'feminine', 'not_applicable', false),
    (19, $$mist$$, $$(лёгкий) туман / дымка$$, $$(лёгкий) туман, дымка$$, 'noun', 'unknown', 'not_applicable', false),
    (20, $$overcast$$, $$пасмурно$$, $$пасмурно$$, 'adverb', 'not_applicable', 'not_applicable', false),
    (21, $$rain$$, $$дождь$$, $$дождь$$, 'noun', 'masculine', 'not_applicable', false),
    (22, $$snow$$, $$снег$$, $$снег$$, 'noun', 'masculine', 'not_applicable', false),
    (23, $$storm$$, $$гроза$$, $$гроза$$, 'noun', 'feminine', 'not_applicable', false),
    (24, $$sun$$, $$солнце$$, $$солнце$$, 'noun', 'neuter', 'not_applicable', false),
    (25, $$sunny$$, $$солнечно$$, $$солнечно$$, 'adverb', 'not_applicable', 'not_applicable', false),
    (26, $$the sun is shining$$, $$светит солнце$$, $$светит солнце$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (27, $$to be expected$$, $$ожидаться$$, $$ожидаться$$, 'verb', 'not_applicable', 'imperfective', true),
    (28, $$warm$$, $$тепло$$, $$тепло$$, 'adverb', 'not_applicable', 'not_applicable', false),
    (29, $$weather$$, $$погода$$, $$погода$$, 'noun', 'feminine', 'not_applicable', false),
    (30, $$weather forecast$$, $$прогноз погоды$$, $$прогноз погоды$$, 'noun', 'masculine', 'not_applicable', false),
    (31, $$wind$$, $$ветер$$, $$ветер$$, 'noun', 'masculine', 'not_applicable', false)
),
prepared_items as (
  select
    raw_items.position,
    raw_items.english,
    raw_items.russian,
    raw_items.spec_russian,
    raw_items.part_of_speech,
    raw_items.gender,
    raw_items.aspect,
    raw_items.is_reflexive,
    case
      when raw_items.part_of_speech = 'phrase' or raw_items.russian ~ '\s' then 'phrase'
      else 'word'
    end as item_type,
    (
      'local-area-weather-foundation:item-' ||
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
    'foundation',
    'local_area_holiday_travel',
    'local_area_holiday_travel_weather',
    'weather',
    prepared_items.aspect,
    prepared_items.is_reflexive,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Local area, holiday and travel / Phrases associated with weather / Foundation tier',
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
  'foundation',
  'Section 2: Topic-specific vocabulary / Local area, holiday and travel / Phrases associated with weather / Foundation tier',
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
