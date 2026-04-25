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
    'international-global-dimension-bringing-world-together-environmental-issues',
    'Bringing the world together and environmental issues',
    'Spec-required topic-specific GCSE Russian vocabulary for the international and global dimension: bringing the world together and environmental issues.',
    'international_global_dimension',
    'international_global_dimension_bringing_world_together_environmental_issues',
    'both',
    'spec_only',
    'specification',
    'single_column',
    true,
    700,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'section-2:international-global-dimension:bringing-world-together-environmental-issues'
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
    'Foundation tier vocabulary for bringing the world together and environmental issues.',
    'international_global_dimension',
    'international_global_dimension_bringing_world_together_environmental_issues',
    'bringing_world_together_environmental_issues',
    'foundation',
    'spec_only',
    'single_column',
    true,
    700,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / International and global dimension / Bringing the world together, environmental issues / Foundation tier',
    'section-2:international-global-dimension:bringing-world-together-environmental-issues:foundation:list'
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
    (1, $$access to$$, $$доступ к$$, $$доступ к$$, 'noun', 'masculine', 'not_applicable', false),
    (2, $$against$$, $$против$$, $$против$$, 'preposition', 'not_applicable', 'not_applicable', false),
    (3, $$animals$$, $$животные$$, $$животные$$, 'noun', 'plural_only', 'not_applicable', false),
    (4, $$atmosphere$$, $$атмосфера$$, $$атмосфера$$, 'noun', 'feminine', 'not_applicable', false),
    (5, $$campaign$$, $$кампания$$, $$кампания$$, 'noun', 'feminine', 'not_applicable', false),
    (6, $$championship$$, $$чемпионат$$, $$чемпионат$$, 'noun', 'masculine', 'not_applicable', false),
    (7, $$charity$$, $$благотворительная организация$$, $$благотворительная организация$$, 'noun', 'feminine', 'not_applicable', false),
    (8, $$country$$, $$страна$$, $$страна$$, 'noun', 'feminine', 'not_applicable', false),
    (9, $$earth$$, $$земля$$, $$земля$$, 'noun', 'feminine', 'not_applicable', false),
    (10, $$ecological$$, $$экологический$$, $$экологический$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (11, $$ecology$$, $$экология$$, $$экология$$, 'noun', 'feminine', 'not_applicable', false),
    (12, $$effect$$, $$эффект$$, $$эффект$$, 'noun', 'masculine', 'not_applicable', false),
    (13, $$electricity$$, $$электричество / электроэнергия$$, $$электричество; электроэнергия$$, 'noun', 'unknown', 'not_applicable', false),
    (14, $$energy$$, $$энергия$$, $$энергия$$, 'noun', 'feminine', 'not_applicable', false),
    (15, $$environment$$, $$окружающая среда$$, $$окружающая среда$$, 'noun', 'feminine', 'not_applicable', false),
    (16, $$environmental issues$$, $$экологические проблемы$$, $$экологические проблемы$$, 'noun', 'plural_only', 'not_applicable', false),
    (17, $$festival$$, $$фестиваль$$, $$фестиваль$$, 'noun', 'masculine', 'not_applicable', false),
    (18, $$for$$, $$за$$, $$за$$, 'preposition', 'not_applicable', 'not_applicable', false),
    (19, $$forest$$, $$лес$$, $$лес$$, 'noun', 'masculine', 'not_applicable', false),
    (20, $$gas$$, $$газ$$, $$газ$$, 'noun', 'masculine', 'not_applicable', false),
    (21, $$good cause$$, $$благое дело$$, $$благое дело$$, 'noun', 'neuter', 'not_applicable', false),
    (22, $$global$$, $$глобальный$$, $$глобальный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (23, $$green$$, $$зелёный$$, $$зелёный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (24, $$hurricane$$, $$ураган$$, $$ураган$$, 'noun', 'masculine', 'not_applicable', false),
    (25, $$illegal$$, $$нелегальный$$, $$нелегальный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (26, $$international$$, $$международный$$, $$международный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (27, $$international dimension$$, $$международный аспект$$, $$международный аспект$$, 'noun', 'masculine', 'not_applicable', false),
    (28, $$legal$$, $$легальный$$, $$легальный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (29, $$music festival$$, $$музыкальный фестиваль$$, $$музыкальный фестиваль$$, 'noun', 'masculine', 'not_applicable', false),
    (30, $$musical event$$, $$музыкальное мероприятие$$, $$музыкальное мероприятие$$, 'noun', 'neuter', 'not_applicable', false),
    (31, $$natural resources$$, $$природные ресурсы$$, $$природные ресурсы$$, 'noun', 'plural_only', 'not_applicable', false),
    (32, $$ocean$$, $$океан$$, $$океан$$, 'noun', 'masculine', 'not_applicable', false),
    (33, $$oil$$, $$нефть$$, $$нефть$$, 'noun', 'feminine', 'not_applicable', false),
    (34, $$Olympic games$$, $$Олимпийские игры$$, $$Олимпийские игры$$, 'noun', 'plural_only', 'not_applicable', false),
    (35, $$organisation$$, $$организация$$, $$организация$$, 'noun', 'feminine', 'not_applicable', false),
    (36, $$people$$, $$люди$$, $$люди$$, 'noun', 'plural_only', 'not_applicable', false),
    (37, $$planet$$, $$планета$$, $$планета$$, 'noun', 'feminine', 'not_applicable', false),
    (38, $$political$$, $$политический$$, $$политический$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (39, $$politician$$, $$политик$$, $$политик$$, 'noun', 'masculine', 'not_applicable', false),
    (40, $$politics; policy$$, $$политика$$, $$политика$$, 'noun', 'feminine', 'not_applicable', false),
    (41, $$recycling$$, $$переработка$$, $$переработка$$, 'noun', 'feminine', 'not_applicable', false),
    (42, $$sporting event$$, $$спортивное мероприятие$$, $$спортивное мероприятие$$, 'noun', 'neuter', 'not_applicable', false),
    (43, $$tiger$$, $$тигр$$, $$тигр$$, 'noun', 'masculine', 'not_applicable', false),
    (44, $$to die$$, $$умирать / умереть$$, $$умирать/умереть$$, 'verb', 'not_applicable', 'both', false),
    (45, $$to live$$, $$жить$$, $$жить$$, 'verb', 'not_applicable', 'imperfective', false),
    (46, $$to recycle$$, $$перерабатывать$$, $$перерабатывать$$, 'verb', 'not_applicable', 'imperfective', false),
    (47, $$world$$, $$мир$$, $$мир$$, 'noun', 'masculine', 'not_applicable', false),
    (48, $$World Cup (football)$$, $$чемпионат мира (по футболу)$$, $$чемпионат мира (по футболу)$$, 'noun', 'masculine', 'not_applicable', false)
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
      'international-global-dimension-foundation:item-' ||
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
    'international_global_dimension',
    'international_global_dimension_bringing_world_together_environmental_issues',
    'bringing_world_together_environmental_issues',
    prepared_items.aspect,
    prepared_items.is_reflexive,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / International and global dimension / Bringing the world together, environmental issues / Foundation tier',
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
  'Section 2: Topic-specific vocabulary / International and global dimension / Bringing the world together, environmental issues / Foundation tier',
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
