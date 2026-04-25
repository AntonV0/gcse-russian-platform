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
  'Imported GCSE Russian specification vocabulary. Includes high-frequency language and countries/nationalities sets.'
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
    'areas-mountains-seas-places',
    'Areas, mountains, seas and places',
    'Spec-required GCSE Russian areas, mountains, seas and places.',
    'high_frequency_language',
    'areas_mountains_seas_places',
    'both',
    'spec_only',
    'specification',
    'single_column',
    true,
    200,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'areas-mountains-seas-places'
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
    'areas-mountains-seas-places',
    'Areas, mountains, seas and places',
    'Spec-required GCSE Russian areas, mountains, seas and places.',
    'high_frequency_language',
    'areas_mountains_seas_places',
    'areas_mountains_seas_places',
    'both',
    'spec_only',
    'single_column',
    true,
    200,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Areas/mountains/seas/places',
    'areas-mountains-seas-places:list'
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
  gender
) as (
  values
    (1, $$area$$, $$область$$, $$область$$, 'feminine'),
    (2, $$Baltic Sea$$, $$Балтийское море$$, $$Балтийское море$$, 'neuter'),
    (3, $$Black Sea$$, $$Чёрное море$$, $$Чёрное море$$, 'neuter'),
    (4, $$east$$, $$восток$$, $$восток$$, 'masculine'),
    (5, $$Kremlin$$, $$Кремль$$, $$Кремль$$, 'masculine'),
    (6, $$north$$, $$север$$, $$север$$, 'masculine'),
    (7, $$Pacific Ocean$$, $$Тихий океан$$, $$Тихий океан$$, 'masculine'),
    (8, $$polar circle$$, $$полярный круг$$, $$полярный круг$$, 'masculine'),
    (9, $$region$$, $$регион$$, $$регион$$, 'masculine'),
    (10, $$Siberia$$, $$Сибирь$$, $$Сибирь$$, 'feminine'),
    (11, $$south$$, $$юг$$, $$юг$$, 'masculine'),
    (12, $$steppe$$, $$степь$$, $$степь$$, 'feminine'),
    (13, $$taiga$$, $$тайга$$, $$тайга$$, 'feminine'),
    (14, $$the Arctic$$, $$Арктика$$, $$Арктика$$, 'feminine'),
    (15, $$the Channel Tunnel$$, $$тоннель под Ла-Маншем$$, $$тоннель под Ла-Маншем$$, 'masculine'),
    (16, $$the English Channel$$, $$Ла-Манш$$, $$Ла-Манш$$, 'masculine'),
    (17, $$the Far East$$, $$Дальний восток$$, $$Дальний восток$$, 'masculine'),
    (18, $$the Mediterranean sea$$, $$Средиземное море$$, $$Средиземное море$$, 'neuter'),
    (19, $$the Urals$$, $$Урал$$, $$Урал$$, 'masculine'),
    (20, $$tundra$$, $$тундра$$, $$тундра$$, 'feminine'),
    (21, $$west$$, $$запад$$, $$запад$$, 'masculine'),
    (22, $$Bronze Horseman$$, $$Медный всадник$$, $$Медный всадник$$, 'masculine'),
    (23, $$Catherine Palace$$, $$Екатерининский дворец$$, $$Екатерининский дворец$$, 'masculine'),
    (24, $$Hermitage$$, $$Эрмитаж$$, $$Эрмитаж$$, 'masculine'),
    (25, $$Lenin Mausoleum$$, $$мавзолей Ленина$$, $$мавзолей Ленина$$, 'masculine'),
    (26, $$Peterhof$$, $$Петергоф$$, $$Петергоф$$, 'masculine'),
    (27, $$Red Square$$, $$Красная площадь$$, $$Красная площадь$$, 'feminine'),
    (28, $$Saint Isaac's Cathedral$$, $$Исаакиевский собор$$, $$Исаакиевский собор$$, 'masculine'),
    (29, $$Winter Palace$$, $$Зимний дворец$$, $$Зимний дворец$$, 'masculine')
),
prepared_items as (
  select
    raw_items.position,
    raw_items.english,
    raw_items.russian,
    raw_items.spec_russian,
    raw_items.gender,
    case
      when raw_items.russian ~ '\s' then 'phrase'
      else 'word'
    end as item_type,
    (
      'areas-mountains-seas-places:item-' ||
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
    'noun',
    prepared_items.gender,
    'unknown',
    'both',
    'high_frequency_language',
    'areas_mountains_seas_places',
    'areas_mountains_seas_places',
    'not_applicable',
    false,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Areas/mountains/seas/places',
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
  'Areas/mountains/seas/places',
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
