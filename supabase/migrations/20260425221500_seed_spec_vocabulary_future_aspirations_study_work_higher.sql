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
    'future-aspirations-study-and-work',
    'Future aspirations, study and work',
    'Spec-required topic-specific GCSE Russian vocabulary for future aspirations, study and work.',
    'future_aspirations_study_work',
    'future_study_and_work',
    'both',
    'spec_only',
    'specification',
    'single_column',
    true,
    600,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'section-2:future-aspirations-study-and-work'
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
    'Higher tier vocabulary for future aspirations, study and work. Higher learners also need the Foundation list for this topic.',
    'future_aspirations_study_work',
    'future_study_and_work',
    'future_aspirations_study_work',
    'higher',
    'spec_only',
    'single_column',
    true,
    601,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Future aspirations, study and work / Higher tier',
    'section-2:future-aspirations-study-and-work:higher:list'
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
    (1, $$aim; goal$$, $$цель$$, $$цель$$, 'noun', 'feminine', 'not_applicable', false),
    (2, $$ambition$$, $$амбиция$$, $$амбиция$$, 'noun', 'feminine', 'not_applicable', false),
    (3, $$answerphone$$, $$автоответчик$$, $$автоответчик$$, 'noun', 'masculine', 'not_applicable', false),
    (4, $$artist$$, $$художник$$, $$художник$$, 'noun', 'masculine', 'not_applicable', false),
    (5, $$badly paid$$, $$плохо оплачиваемый$$, $$плохо оплачиваемый$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (6, $$charity$$, $$благотворительная организация$$, $$благотворительная организация$$, 'noun', 'feminine', 'not_applicable', false),
    (7, $$civil servant$$, $$госслужащий$$, $$госслужащий$$, 'noun', 'masculine', 'not_applicable', false),
    (8, $$conference$$, $$конференция$$, $$конференция$$, 'noun', 'feminine', 'not_applicable', false),
    (9, $$database$$, $$база данных$$, $$база данных$$, 'noun', 'feminine', 'not_applicable', false),
    (10, $$dream$$, $$мечта$$, $$мечта$$, 'noun', 'feminine', 'not_applicable', false),
    (11, $$driver$$, $$водитель$$, $$водитель$$, 'noun', 'masculine', 'not_applicable', false),
    (12, $$educational$$, $$образовательный$$, $$образовательный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (13, $$employer$$, $$работодатель$$, $$работодатель$$, 'noun', 'masculine', 'not_applicable', false),
    (14, $$enclosed$$, $$прилагаемый$$, $$прилагаемый$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (15, $$experienced$$, $$опытный$$, $$опытный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (16, $$hard disk$$, $$жёсткий диск$$, $$жёсткий диск$$, 'noun', 'masculine', 'not_applicable', false),
    (17, $$higher education$$, $$высшее образование$$, $$высшее образование$$, 'noun', 'neuter', 'not_applicable', false),
    (18, $$impression$$, $$впечатление$$, $$впечатление$$, 'noun', 'neuter', 'not_applicable', false),
    (19, $$in aid of$$, $$в помощь$$, $$в помощь$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (20, $$internship$$, $$стажировка$$, $$стажировка$$, 'noun', 'feminine', 'not_applicable', false),
    (21, $$interview$$, $$собеседование$$, $$собеседование$$, 'noun', 'neuter', 'not_applicable', false),
    (22, $$job$$, $$работа$$, $$работа$$, 'noun', 'feminine', 'not_applicable', false),
    (23, $$job advert$$, $$объявление о работе$$, $$объявление о работе$$, 'noun', 'neuter', 'not_applicable', false),
    (24, $$keyboard$$, $$клавиатура$$, $$клавиатура$$, 'noun', 'feminine', 'not_applicable', false),
    (25, $$law (study of the subject)$$, $$юриспруденция$$, $$юриспруденция$$, 'noun', 'feminine', 'not_applicable', false),
    (26, $$link$$, $$связь$$, $$связь$$, 'noun', 'feminine', 'not_applicable', false),
    (27, $$model$$, $$манекенщица$$, $$манекенщица$$, 'noun', 'feminine', 'not_applicable', false),
    (28, $$mouse$$, $$мышка$$, $$мышка$$, 'noun', 'feminine', 'not_applicable', false),
    (29, $$part time$$, $$на полставки$$, $$на полставки$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (30, $$photo model$$, $$фотомодель$$, $$фото модель$$, 'noun', 'feminine', 'not_applicable', false),
    (31, $$plumber$$, $$сантехник$$, $$сантехник$$, 'noun', 'masculine', 'not_applicable', false),
    (32, $$programmer$$, $$программист$$, $$программист$$, 'noun', 'masculine', 'not_applicable', false),
    (33, $$prospects$$, $$перспектива$$, $$перспектива$$, 'noun', 'feminine', 'not_applicable', false),
    (34, $$qualification$$, $$квалификация$$, $$квалификация$$, 'noun', 'feminine', 'not_applicable', false),
    (35, $$qualified$$, $$квалифицированный$$, $$квалифицированный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (36, $$representative$$, $$представитель$$, $$представитель m$$, 'noun', 'masculine', 'not_applicable', false),
    (37, $$salary, wages$$, $$зарплата$$, $$зарплата$$, 'noun', 'feminine', 'not_applicable', false),
    (38, $$signature$$, $$подпись$$, $$подпись$$, 'noun', 'feminine', 'not_applicable', false),
    (39, $$situation wanted$$, $$ищу работу$$, $$ищу работу$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (40, $$skills$$, $$навыки$$, $$навыки$$, 'noun', 'plural_only', 'not_applicable', false),
    (41, $$society$$, $$общество$$, $$общество$$, 'noun', 'neuter', 'not_applicable', false),
    (42, $$surgeon$$, $$хирург$$, $$хирург$$, 'noun', 'masculine', 'not_applicable', false),
    (43, $$to apply for a job$$, $$подавать / подать заявление на работу$$, $$подавать/подать заявление на работу$$, 'verb', 'not_applicable', 'both', false),
    (44, $$to apply to / get in to university$$, $$поступать / поступить в университет$$, $$поступать/поступить в университет$$, 'verb', 'not_applicable', 'both', false),
    (45, $$to attach$$, $$прилагать / приложить$$, $$прилагать/приложить$$, 'verb', 'not_applicable', 'both', false),
    (46, $$to do a course$$, $$проходить / пройти курс$$, $$проходить/пройти курс$$, 'verb', 'not_applicable', 'both', false),
    (47, $$to enclose$$, $$вкладывать / вложить$$, $$вкладывать/вложить$$, 'verb', 'not_applicable', 'both', false),
    (48, $$to fill in a form$$, $$заполнять / заполнить бланк$$, $$заполнять/заполнить бланк$$, 'verb', 'not_applicable', 'both', false),
    (49, $$to introduce oneself$$, $$представляться / представиться$$, $$представляться/представиться$$, 'verb', 'not_applicable', 'both', true),
    (50, $$to print out$$, $$распечатывать / распечатать$$, $$распечатывать/распечатать$$, 'verb', 'not_applicable', 'both', false),
    (51, $$to telephone$$, $$звонить / позвонить по телефону$$, $$звонить/по- по телефону$$, 'verb', 'not_applicable', 'both', false),
    (52, $$to type$$, $$печатать / напечатать$$, $$печатать/на-$$, 'verb', 'not_applicable', 'both', false),
    (53, $$to volunteer$$, $$выступать / выступить волонтёром$$, $$выступать/выступить волонтёром$$, 'verb', 'not_applicable', 'both', false),
    (54, $$unemployment$$, $$безработица$$, $$безработица$$, 'noun', 'feminine', 'not_applicable', false),
    (55, $$vacancy$$, $$вакансия$$, $$вакансия$$, 'noun', 'feminine', 'not_applicable', false),
    (56, $$voluntarily$$, $$добровольно$$, $$добровольно$$, 'adverb', 'not_applicable', 'not_applicable', false),
    (57, $$voluntary work$$, $$волонтёрская работа$$, $$волонтёрская работа$$, 'noun', 'feminine', 'not_applicable', false),
    (58, $$webmail$$, $$веб-почта$$, $$веб-почта$$, 'noun', 'feminine', 'not_applicable', false),
    (59, $$well paid$$, $$хорошо оплачиваемый$$, $$хорошо оплачиваемый$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (60, $$without pay$$, $$без зарплаты$$, $$без зарплаты$$, 'phrase', 'not_applicable', 'not_applicable', false)
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
      'future-aspirations-study-and-work-higher:item-' ||
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
    'future_aspirations_study_work',
    'future_study_and_work',
    'future_aspirations_study_work',
    prepared_items.aspect,
    prepared_items.is_reflexive,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Future aspirations, study and work / Higher tier',
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
  'Section 2: Topic-specific vocabulary / Future aspirations, study and work / Higher tier',
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
