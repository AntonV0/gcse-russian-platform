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
    'identity-and-culture-words-relating-to-dress-and-style',
    'Words relating to dress and style',
    'Spec-required topic-specific GCSE Russian vocabulary for identity and culture: what my friends and family are like, with a focus on dress and style.',
    'identity_and_culture',
    'identity_and_culture_clothes_and_style',
    'both',
    'spec_only',
    'specification',
    'single_column',
    true,
    310,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'section-2:identity-and-culture:what-my-friends-and-family-are-like:dress-and-style'
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
    'Foundation tier vocabulary for words relating to dress and style.',
    'identity_and_culture',
    'identity_and_culture_clothes_and_style',
    'dress_and_style',
    'foundation',
    'spec_only',
    'single_column',
    true,
    310,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Identity and culture / What my friends and family are like / Words relating to dress and style / Foundation tier',
    'section-2:identity-and-culture:what-my-friends-and-family-are-like:dress-and-style:foundation:list'
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
  aspect
) as (
  values
    (1, $$belt$$, $$пояс$$, $$пояс$$, 'noun', 'masculine', 'not_applicable'),
    (2, $$blouse$$, $$блузка$$, $$блузка$$, 'noun', 'feminine', 'not_applicable'),
    (3, $$boots$$, $$сапоги$$, $$сапоги$$, 'noun', 'plural_only', 'not_applicable'),
    (4, $$bracelet$$, $$браслет$$, $$браслет$$, 'noun', 'masculine', 'not_applicable'),
    (5, $$brand, label$$, $$бренд$$, $$бренд$$, 'noun', 'masculine', 'not_applicable'),
    (6, $$cap$$, $$кепка$$, $$кепка$$, 'noun', 'feminine', 'not_applicable'),
    (7, $$clothes$$, $$одежда$$, $$одежда$$, 'noun', 'feminine', 'not_applicable'),
    (8, $$clothes shop$$, $$магазин одежды$$, $$магазин одежды$$, 'noun', 'masculine', 'not_applicable'),
    (9, $$coat / overcoat$$, $$пальто$$, $$пальто$$, 'noun', 'neuter', 'not_applicable'),
    (10, $$dress$$, $$платье$$, $$платье$$, 'noun', 'neuter', 'not_applicable'),
    (11, $$dressed in$$, $$одет в$$, $$одет в$$, 'phrase', 'not_applicable', 'not_applicable'),
    (12, $$fashion$$, $$мода$$, $$мода$$, 'noun', 'feminine', 'not_applicable'),
    (13, $$fashionable$$, $$модный$$, $$модный$$, 'adjective', 'not_applicable', 'not_applicable'),
    (14, $$flowers$$, $$цветы$$, $$цветы$$, 'noun', 'plural_only', 'not_applicable'),
    (15, $$footwear$$, $$обувь$$, $$обувь$$, 'noun', 'feminine', 'not_applicable'),
    (16, $$fur coat$$, $$шуба$$, $$шуба$$, 'noun', 'feminine', 'not_applicable'),
    (17, $$fur hat$$, $$шапка$$, $$шапка$$, 'noun', 'feminine', 'not_applicable'),
    (18, $$handbag$$, $$сумка$$, $$сумка$$, 'noun', 'feminine', 'not_applicable'),
    (19, $$hat$$, $$шляпа$$, $$шляпа$$, 'noun', 'feminine', 'not_applicable'),
    (20, $$jacket$$, $$пиджак$$, $$пиджак$$, 'noun', 'masculine', 'not_applicable'),
    (21, $$jeans$$, $$джинсы$$, $$джинсы$$, 'noun', 'plural_only', 'not_applicable'),
    (22, $$jumper$$, $$джемпер$$, $$джемпер$$, 'noun', 'masculine', 'not_applicable'),
    (23, $$leather$$, $$кожа$$, $$кожа$$, 'noun', 'feminine', 'not_applicable'),
    (24, $$made of leather$$, $$кожаный$$, $$кожаный$$, 'adjective', 'not_applicable', 'not_applicable'),
    (25, $$make$$, $$марка$$, $$марка$$, 'noun', 'feminine', 'not_applicable'),
    (26, $$makeup$$, $$косметика$$, $$косметика$$, 'noun', 'feminine', 'not_applicable'),
    (27, $$pants, briefs$$, $$трусы$$, $$трусы$$, 'noun', 'plural_only', 'not_applicable'),
    (28, $$pyjamas$$, $$пижама$$, $$пижама$$, 'noun', 'feminine', 'not_applicable'),
    (29, $$rucksack$$, $$рюкзак$$, $$рюкзак$$, 'noun', 'masculine', 'not_applicable'),
    (30, $$scarf$$, $$шарф$$, $$шарф$$, 'noun', 'masculine', 'not_applicable'),
    (31, $$shirt$$, $$рубашка$$, $$рубашка$$, 'noun', 'feminine', 'not_applicable'),
    (32, $$shoes$$, $$туфли$$, $$туфли$$, 'noun', 'plural_only', 'not_applicable'),
    (33, $$shorts$$, $$шорты$$, $$шорты$$, 'noun', 'plural_only', 'not_applicable'),
    (34, $$size$$, $$размер$$, $$размер$$, 'noun', 'masculine', 'not_applicable'),
    (35, $$skirt$$, $$юбка$$, $$юбка$$, 'noun', 'feminine', 'not_applicable'),
    (36, $$small$$, $$маленький$$, $$маленький$$, 'adjective', 'not_applicable', 'not_applicable'),
    (37, $$smart$$, $$элегантный$$, $$элегантный$$, 'adjective', 'not_applicable', 'not_applicable'),
    (38, $$socks$$, $$носки$$, $$носки$$, 'noun', 'plural_only', 'not_applicable'),
    (39, $$sportsman$$, $$спортсмен$$, $$спортсмен$$, 'noun', 'masculine', 'not_applicable'),
    (40, $$sportswoman$$, $$спортсменка$$, $$спортсменка$$, 'noun', 'feminine', 'not_applicable'),
    (41, $$style$$, $$стиль$$, $$стиль$$, 'noun', 'masculine', 'not_applicable'),
    (42, $$suit$$, $$костюм$$, $$костюм$$, 'noun', 'masculine', 'not_applicable'),
    (43, $$sweater$$, $$свитер$$, $$свитер$$, 'noun', 'masculine', 'not_applicable'),
    (44, $$swimming costume$$, $$купальник / купальный костюм$$, $$купальник, купальный костюм$$, 'noun', 'masculine', 'not_applicable'),
    (45, $$tee shirt$$, $$футболка$$, $$футболка$$, 'noun', 'feminine', 'not_applicable'),
    (46, $$tie$$, $$галстук$$, $$галстук$$, 'noun', 'masculine', 'not_applicable'),
    (47, $$tracksuit$$, $$спортивный костюм$$, $$спортивный костюм$$, 'noun', 'masculine', 'not_applicable'),
    (48, $$trainers$$, $$кроссовки$$, $$кроссовки$$, 'noun', 'plural_only', 'not_applicable'),
    (49, $$trousers$$, $$брюки$$, $$брюки$$, 'noun', 'plural_only', 'not_applicable'),
    (50, $$umbrella$$, $$зонтик$$, $$зонтик$$, 'noun', 'masculine', 'not_applicable'),
    (51, $$uniform$$, $$форма$$, $$форма$$, 'noun', 'feminine', 'not_applicable'),
    (52, $$vest$$, $$майка$$, $$майка$$, 'noun', 'feminine', 'not_applicable'),
    (53, $$watch$$, $$часы$$, $$часы$$, 'noun', 'plural_only', 'not_applicable')
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
    case
      when raw_items.part_of_speech = 'phrase' or raw_items.russian ~ '\s' then 'phrase'
      else 'word'
    end as item_type,
    (
      'what-my-friends-and-family-are-like-dress-and-style-foundation:item-' ||
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
    'identity_and_culture',
    'identity_and_culture_clothes_and_style',
    'dress_and_style',
    prepared_items.aspect,
    false,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Identity and culture / What my friends and family are like / Words relating to dress and style / Foundation tier',
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
  'Section 2: Topic-specific vocabulary / Identity and culture / What my friends and family are like / Words relating to dress and style / Foundation tier',
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
