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
  'Imported GCSE Russian specification vocabulary.'
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
    'language-used-in-dialogues-and-messages',
    'Language used in dialogues and messages',
    'Spec-required GCSE Russian language used in dialogues and messages.',
    'high_frequency_language',
    'language_used_in_dialogues_and_messages',
    'both',
    'spec_only',
    'specification',
    'single_column',
    true,
    230,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'language-used-in-dialogues-and-messages'
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
    'language-used-in-dialogues-and-messages',
    'Language used in dialogues and messages',
    'Spec-required GCSE Russian language used in dialogues and messages.',
    'high_frequency_language',
    'language_used_in_dialogues_and_messages',
    'language_used_in_dialogues_and_messages',
    'both',
    'spec_only',
    'single_column',
    true,
    230,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Language used in dialogues and messages',
    'language-used-in-dialogues-and-messages:list'
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
    (1, $$address$$, $$адрес$$, $$адрес$$, 'noun', 'masculine', 'not_applicable'),
    (2, $$area code$$, $$код региона$$, $$код региона$$, 'noun', 'masculine', 'not_applicable'),
    (3, $$call me (informal/formal)$$, $$позвони мне / позвоните мне$$, $$позвони(те) мне$$, 'phrase', 'not_applicable', 'not_applicable'),
    (4, $$dial the number$$, $$набирать / набрать номер$$, $$набирать/набрать номер$$, 'verb', 'not_applicable', 'both'),
    (5, $$email$$, $$электронная почта$$, $$электронная почта$$, 'noun', 'feminine', 'not_applicable'),
    (6, $$I’ll be right back$$, $$я сейчас вернусь$$, $$я сейчас вернусь$$, 'phrase', 'not_applicable', 'not_applicable'),
    (7, $$I’m listening$$, $$я вас слушаю$$, $$я вас слушаю$$, 'phrase', 'not_applicable', 'not_applicable'),
    (8, $$message$$, $$сообщение$$, $$сообщение$$, 'noun', 'neuter', 'not_applicable'),
    (9, $$mobile phone$$, $$мобильный телефон / мобильник$$, $$мобильный телефон, мобильник$$, 'noun', 'masculine', 'not_applicable'),
    (10, $$moment$$, $$момент$$, $$момент$$, 'noun', 'masculine', 'not_applicable'),
    (11, $$on line$$, $$онлайн$$, $$онлайн$$, 'adverb', 'not_applicable', 'not_applicable'),
    (12, $$on the line/speaking$$, $$на линии / слушаю$$, $$на линии / слушаю$$, 'phrase', 'not_applicable', 'not_applicable'),
    (13, $$please repeat that$$, $$пожалуйста, повторите$$, $$пожалуйста, повторите$$, 'phrase', 'not_applicable', 'not_applicable'),
    (14, $$postcode$$, $$индекс$$, $$индекс$$, 'noun', 'masculine', 'not_applicable'),
    (15, $$receiver (telephone)$$, $$телефонная трубка$$, $$телефонная трубка$$, 'noun', 'feminine', 'not_applicable'),
    (16, $$sender$$, $$отправитель$$, $$отправитель$$, 'noun', 'masculine', 'not_applicable'),
    (17, $$stay on the line$$, $$не кладите трубку$$, $$не кладите трубку$$, 'phrase', 'not_applicable', 'not_applicable'),
    (18, $$telephone$$, $$телефон$$, $$телефон$$, 'noun', 'masculine', 'not_applicable'),
    (19, $$text message$$, $$СМС$$, $$СМС$$, 'noun', 'neuter', 'not_applicable'),
    (20, $$tone$$, $$тон$$, $$тон$$, 'noun', 'masculine', 'not_applicable'),
    (21, $$voice mail$$, $$голосовая почта$$, $$голосовая почта$$, 'noun', 'feminine', 'not_applicable'),
    (22, $$wait$$, $$подождите$$, $$подождите$$, 'verb', 'not_applicable', 'perfective'),
    (23, $$wrong number$$, $$не тот номер / вы ошиблись номером$$, $$не тот номер / вы ошиблись номером$$, 'phrase', 'not_applicable', 'not_applicable')
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
      'language-used-in-dialogues-and-messages:item-' ||
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
    'language_used_in_dialogues_and_messages',
    'language_used_in_dialogues_and_messages',
    prepared_items.aspect,
    false,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Language used in dialogues and messages',
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
  'Language used in dialogues and messages',
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
