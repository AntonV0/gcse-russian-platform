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
  'Imported GCSE Russian specification vocabulary. Includes high-frequency language, countries/nationalities, and social conventions sets.'
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
    'social-conventions',
    'Social conventions',
    'Spec-required GCSE Russian social conventions.',
    'high_frequency_language',
    'social_conventions',
    'both',
    'spec_only',
    'specification',
    'single_column',
    true,
    220,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'social-conventions'
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
    'social-conventions',
    'Social conventions',
    'Spec-required GCSE Russian social conventions.',
    'high_frequency_language',
    'social_conventions',
    'social_conventions',
    'both',
    'spec_only',
    'single_column',
    true,
    220,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Social conventions',
    'social-conventions:list'
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
    (1, $$best wishes$$, $$с наилучшими пожеланиями$$, $$с наилучшими пожеланиями$$),
    (2, $$(I’m) sorry (informal/formal)$$, $$извини / извините / прошу прощения$$, $$извини(те) / прошу прощения$$),
    (3, $$bye!$$, $$пока!$$, $$пока!$$),
    (4, $$Could you say that again, please?$$, $$повторите, пожалуйста.$$, $$повторите, пожалуйста.$$),
    (5, $$Dear (to begin formal letter)$$, $$Уважаемый / Уважаемая$$, $$Уважаемый/-ая$$),
    (6, $$don’t mention it$$, $$не за что$$, $$не за что$$),
    (7, $$good afternoon$$, $$добрый день$$, $$добрый день$$),
    (8, $$good evening$$, $$добрый вечер$$, $$добрый вечер$$),
    (9, $$good morning$$, $$доброе утро$$, $$доброе утро$$),
    (10, $$goodbye$$, $$до свидания$$, $$до свидания$$),
    (11, $$goodnight$$, $$спокойной ночи$$, $$спокойной ночи$$),
    (12, $$have a good journey$$, $$счастливого пути$$, $$счастливого пути$$),
    (13, $$hello$$, $$здравствуй / здравствуйте$$, $$здравствуй(те)$$),
    (14, $$hello (on the telephone)$$, $$алло$$, $$алло$$),
    (15, $$help!$$, $$помогите! / на помощь!$$, $$помогите! на помощь!$$),
    (16, $$hi!$$, $$привет!$$, $$привет!$$),
    (17, $$how are you?$$, $$как дела?$$, $$как дела?$$),
    (18, $$it is time to$$, $$пора$$, $$пора$$),
    (19, $$I beg your pardon? Pardon?$$, $$извините!$$, $$извините!$$),
    (20, $$It’s a pleasure$$, $$с удовольствием$$, $$с удовольствием$$),
    (21, $$meet you at 6 o’clock$$, $$встретимся в 6 часов$$, $$встретимся в 6 часов$$),
    (22, $$meeting; meeting place$$, $$встреча / место встречи$$, $$встреча; место встречи$$),
    (23, $$nightmare!$$, $$кошмар!$$, $$кошмар!$$),
    (24, $$no thank you$$, $$нет, спасибо$$, $$нет спасибо$$),
    (25, $$of course$$, $$конечно$$, $$конечно$$),
    (26, $$please$$, $$пожалуйста$$, $$пожалуйста$$),
    (27, $$see you later$$, $$пока!$$, $$пока!$$),
    (28, $$see you soon$$, $$до скорого$$, $$до скорого$$),
    (29, $$see you tomorrow/on Friday$$, $$до завтра / до пятницы$$, $$до завтра / до пятницы$$),
    (30, $$sorry$$, $$извини / извините$$, $$извини(те)$$),
    (31, $$thank you (very much)$$, $$спасибо / большое спасибо$$, $$(большое) спасибо$$),
    (32, $$that doesn't matter/that's ok$$, $$ничего$$, $$ничего$$),
    (33, $$what is (your) name?$$, $$как вас зовут?$$, $$как (вас) зовут?$$)
),
prepared_items as (
  select
    raw_items.position,
    raw_items.english,
    raw_items.russian,
    raw_items.spec_russian,
    (
      'social-conventions:item-' ||
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
    'social_conventions',
    'social_conventions',
    'not_applicable',
    false,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Social conventions',
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
  'Social conventions',
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
