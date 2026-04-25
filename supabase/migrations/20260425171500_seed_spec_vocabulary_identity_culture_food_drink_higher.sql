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
    'identity-and-culture-daily-life-food-and-drink',
    'Daily life, food and drink, including eating out',
    'Spec-required topic-specific GCSE Russian vocabulary for identity and culture: daily life, food and drink, including eating out.',
    'identity_and_culture',
    'identity_and_culture_food_and_drink',
    'both',
    'spec_only',
    'specification',
    'single_column',
    true,
    300,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'section-2:identity-and-culture:daily-life-food-and-drink-eating-out'
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
    'higher',
    'Higher tier',
    'Higher tier vocabulary for daily life, food and drink, including eating out. Higher learners also need the Foundation list for this topic.',
    'identity_and_culture',
    'identity_and_culture_food_and_drink',
    'daily_life_food_and_drink_eating_out',
    'higher',
    'spec_only',
    'single_column',
    true,
    301,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Identity and culture / Daily life, food and drink, including eating out / Higher tier',
    'section-2:identity-and-culture:daily-life-food-and-drink-eating-out:higher:list'
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
    (1, $$choice$$, $$выбор$$, $$выбор$$, 'noun', 'masculine', 'not_applicable', false),
    (2, $$chop (e.g. pork/lamb)$$, $$котлета$$, $$котлета$$, 'noun', 'feminine', 'not_applicable', false),
    (3, $$cooked$$, $$приготовленный$$, $$приготовленный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (4, $$cream$$, $$сливки$$, $$сливки$$, 'noun', 'plural_only', 'not_applicable', false),
    (5, $$duck$$, $$утка$$, $$утка$$, 'noun', 'feminine', 'not_applicable', false),
    (6, $$fork$$, $$вилка$$, $$вилка$$, 'noun', 'feminine', 'not_applicable', false),
    (7, $$fried egg$$, $$яичница$$, $$яичница$$, 'noun', 'feminine', 'not_applicable', false),
    (8, $$garlic$$, $$чеснок$$, $$чеснок$$, 'noun', 'masculine', 'not_applicable', false),
    (9, $$glass$$, $$стакан$$, $$стакан$$, 'noun', 'masculine', 'not_applicable', false),
    (10, $$homemade$$, $$домашний$$, $$домашний$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (11, $$honey$$, $$мёд$$, $$мёд$$, 'noun', 'masculine', 'not_applicable', false),
    (12, $$jar$$, $$банка$$, $$банка$$, 'noun', 'feminine', 'not_applicable', false),
    (13, $$knife$$, $$нож$$, $$нож$$, 'noun', 'masculine', 'not_applicable', false),
    (14, $$lamb$$, $$баранина$$, $$баранина$$, 'noun', 'feminine', 'not_applicable', false),
    (15, $$mayonnaise$$, $$майонез$$, $$майонез$$, 'noun', 'masculine', 'not_applicable', false),
    (16, $$medium$$, $$средний$$, $$средний$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (17, $$mince$$, $$фарш$$, $$фарш$$, 'noun', 'masculine', 'not_applicable', false),
    (18, $$mixed$$, $$смешанный$$, $$смешанный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (19, $$mustard$$, $$горчица$$, $$горчица$$, 'noun', 'feminine', 'not_applicable', false),
    (20, $$natural, organic food$$, $$натуральная еда$$, $$натуральная еда$$, 'noun', 'feminine', 'not_applicable', false),
    (21, $$noodles$$, $$лапша$$, $$лапша$$, 'noun', 'feminine', 'not_applicable', false),
    (22, $$nuts$$, $$орехи$$, $$орехи$$, 'noun', 'plural_only', 'not_applicable', false),
    (23, $$organic food$$, $$экологически чистая еда$$, $$экологически чистая еда$$, 'noun', 'feminine', 'not_applicable', false),
    (24, $$pastries$$, $$пирожные$$, $$пирожные$$, 'noun', 'plural_only', 'not_applicable', false),
    (25, $$pear$$, $$груша$$, $$груша$$, 'noun', 'feminine', 'not_applicable', false),
    (26, $$peas$$, $$горох$$, $$горох$$, 'noun', 'masculine', 'not_applicable', false),
    (27, $$pineapple$$, $$ананас$$, $$ананас$$, 'noun', 'masculine', 'not_applicable', false),
    (28, $$plate$$, $$тарелка$$, $$тарелка$$, 'noun', 'feminine', 'not_applicable', false),
    (29, $$pork$$, $$свинина$$, $$свинина$$, 'noun', 'feminine', 'not_applicable', false),
    (30, $$raspberry$$, $$малина$$, $$малина$$, 'noun', 'feminine', 'not_applicable', false),
    (31, $$roll (bread)$$, $$булочка$$, $$булочка$$, 'noun', 'feminine', 'not_applicable', false),
    (32, $$salmon$$, $$лосось$$, $$лосось$$, 'noun', 'masculine', 'not_applicable', false),
    (33, $$sauce$$, $$соус$$, $$соус$$, 'noun', 'masculine', 'not_applicable', false),
    (34, $$sea food$$, $$морепродукты$$, $$морепродукты$$, 'noun', 'plural_only', 'not_applicable', false),
    (35, $$self-service$$, $$самообслуживание$$, $$самообслуживание$$, 'noun', 'neuter', 'not_applicable', false),
    (36, $$service$$, $$обслуживание$$, $$обслуживание$$, 'noun', 'neuter', 'not_applicable', false),
    (37, $$slice$$, $$кусочек$$, $$кусочек$$, 'noun', 'masculine', 'not_applicable', false),
    (38, $$spoon$$, $$ложка$$, $$ложка$$, 'noun', 'feminine', 'not_applicable', false),
    (39, $$strawberry$$, $$клубника$$, $$клубника$$, 'noun', 'feminine', 'not_applicable', false),
    (40, $$table cloth$$, $$скатерть$$, $$скатерть$$, 'noun', 'feminine', 'not_applicable', false),
    (41, $$taste, preference$$, $$вкус$$, $$вкус$$, 'noun', 'masculine', 'not_applicable', false),
    (42, $$tip (money)$$, $$на чай$$, $$на чай$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (43, $$to get to know$$, $$знакомиться / познакомиться$$, $$знакомиться/по-$$, 'verb', 'not_applicable', 'both', true),
    (44, $$to serve$$, $$обслуживать / обслужить$$, $$обслуживать/обслужить$$, 'verb', 'not_applicable', 'both', false),
    (45, $$to taste$$, $$пробовать / попробовать$$, $$пробовать/по-$$, 'verb', 'not_applicable', 'both', false),
    (46, $$towel$$, $$полотенце$$, $$полотенце$$, 'noun', 'neuter', 'not_applicable', false),
    (47, $$turkey$$, $$индейка$$, $$индейка$$, 'noun', 'feminine', 'not_applicable', false),
    (48, $$vinegar$$, $$уксус$$, $$уксус$$, 'noun', 'masculine', 'not_applicable', false)
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
      'daily-life-food-and-drink-eating-out-higher:item-' ||
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
    'higher',
    'identity_and_culture',
    'identity_and_culture_food_and_drink',
    'daily_life_food_and_drink_eating_out',
    prepared_items.aspect,
    prepared_items.is_reflexive,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Identity and culture / Daily life, food and drink, including eating out / Higher tier',
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
  'higher',
  'Section 2: Topic-specific vocabulary / Identity and culture / Daily life, food and drink, including eating out / Higher tier',
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
