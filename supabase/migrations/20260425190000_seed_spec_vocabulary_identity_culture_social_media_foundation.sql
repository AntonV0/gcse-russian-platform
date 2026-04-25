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
    'identity-and-culture-using-social-media',
    'Using social media',
    'Spec-required topic-specific GCSE Russian vocabulary for identity and culture: using social media.',
    'identity_and_culture',
    'identity_and_culture_using_social_media',
    'both',
    'spec_only',
    'specification',
    'single_column',
    true,
    340,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'section-2:identity-and-culture:using-social-media'
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
    'Foundation tier vocabulary for using social media.',
    'identity_and_culture',
    'identity_and_culture_using_social_media',
    'using_social_media',
    'foundation',
    'spec_only',
    'single_column',
    true,
    340,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Identity and culture / Using social media / Foundation tier',
    'section-2:identity-and-culture:using-social-media:foundation:list'
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
    (1, $$advantage$$, $$преимущество$$, $$преимущество$$, 'noun', 'neuter', 'not_applicable', false),
    (2, $$blog$$, $$блог$$, $$блог$$, 'noun', 'masculine', 'not_applicable', false),
    (3, $$chatroom$$, $$чат$$, $$чат$$, 'noun', 'masculine', 'not_applicable', false),
    (4, $$computer$$, $$компьютер$$, $$компьютер$$, 'noun', 'masculine', 'not_applicable', false),
    (5, $$disadvantage$$, $$недостаток$$, $$недостаток$$, 'noun', 'masculine', 'not_applicable', false),
    (6, $$disk$$, $$диск$$, $$диск$$, 'noun', 'masculine', 'not_applicable', false),
    (7, $$electronic$$, $$электронный$$, $$электронный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (8, $$email$$, $$электронная почта$$, $$электронная почта$$, 'noun', 'feminine', 'not_applicable', false),
    (9, $$internet$$, $$интернет$$, $$интернет$$, 'noun', 'masculine', 'not_applicable', false),
    (10, $$laptop$$, $$лэптоп$$, $$лэптоп$$, 'noun', 'masculine', 'not_applicable', false),
    (11, $$new technology$$, $$новая технология$$, $$новая технология$$, 'noun', 'feminine', 'not_applicable', false),
    (12, $$programme$$, $$программа$$, $$программа$$, 'noun', 'feminine', 'not_applicable', false),
    (13, $$risk$$, $$риск$$, $$риск$$, 'noun', 'masculine', 'not_applicable', false),
    (14, $$screen$$, $$экран$$, $$экран$$, 'noun', 'masculine', 'not_applicable', false),
    (15, $$social media$$, $$социальные медиа$$, $$социальные медиа$$, 'noun', 'plural_only', 'not_applicable', false),
    (16, $$technology$$, $$технология$$, $$технология$$, 'noun', 'feminine', 'not_applicable', false),
    (17, $$to chat online$$, $$разговаривать онлайн$$, $$разговаривать онлайн$$, 'verb', 'not_applicable', 'imperfective', false),
    (18, $$to download$$, $$скачивать / скачать$$, $$скачивать/скачать$$, 'verb', 'not_applicable', 'both', false),
    (19, $$to use$$, $$пользоваться / использовать$$, $$пользоваться/ис-$$, 'verb', 'not_applicable', 'both', true),
    (20, $$use of technology$$, $$использование технологии$$, $$использование технологии$$, 'noun', 'neuter', 'not_applicable', false),
    (21, $$virtual$$, $$виртуальный$$, $$виртуальный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (22, $$virus$$, $$вирус$$, $$вирус$$, 'noun', 'masculine', 'not_applicable', false),
    (23, $$web$$, $$веб-$$, $$веб-$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (24, $$web page$$, $$веб-страница$$, $$веб-страница$$, 'noun', 'feminine', 'not_applicable', false),
    (25, $$webcam$$, $$веб-камера$$, $$веб-камера$$, 'noun', 'feminine', 'not_applicable', false),
    (26, $$website$$, $$вебсайт$$, $$вебсайт$$, 'noun', 'masculine', 'not_applicable', false)
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
      'using-social-media-foundation:item-' ||
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
    'identity_and_culture_using_social_media',
    'using_social_media',
    prepared_items.aspect,
    prepared_items.is_reflexive,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Identity and culture / Using social media / Foundation tier',
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
  'Section 2: Topic-specific vocabulary / Identity and culture / Using social media / Foundation tier',
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
