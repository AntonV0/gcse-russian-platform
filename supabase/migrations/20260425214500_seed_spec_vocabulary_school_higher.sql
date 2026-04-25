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
    'school',
    'School',
    'Spec-required topic-specific GCSE Russian vocabulary for school.',
    'school',
    'school_life',
    'both',
    'spec_only',
    'specification',
    'single_column',
    true,
    500,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'section-2:school'
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
    'Higher tier vocabulary for school. Higher learners also need the Foundation list for this topic.',
    'school',
    'school_life',
    'school',
    'higher',
    'spec_only',
    'single_column',
    true,
    501,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / School / Higher tier',
    'section-2:school:higher:list'
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
    (1, $$able$$, $$способный$$, $$способный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (2, $$art$$, $$искусство$$, $$искусство$$, 'noun', 'neuter', 'not_applicable', false),
    (3, $$assessment$$, $$контрольная работа$$, $$контрольная работа$$, 'noun', 'feminine', 'not_applicable', false),
    (4, $$attention$$, $$внимание$$, $$внимание$$, 'noun', 'neuter', 'not_applicable', false),
    (5, $$ballpoint pen$$, $$шариковая ручка$$, $$шариковая ручка$$, 'noun', 'feminine', 'not_applicable', false),
    (6, $$boarding school$$, $$школа-интернат$$, $$школа-интернат$$, 'noun', 'feminine', 'not_applicable', false),
    (7, $$briefcase$$, $$портфель$$, $$портфель$$, 'noun', 'masculine', 'not_applicable', false),
    (8, $$circle, club$$, $$кружок$$, $$кружок$$, 'noun', 'masculine', 'not_applicable', false),
    (9, $$compulsory subject$$, $$обязательный предмет$$, $$обязательный предмет$$, 'noun', 'masculine', 'not_applicable', false),
    (10, $$core subjects$$, $$основные предметы$$, $$основные предметы$$, 'noun', 'plural_only', 'not_applicable', false),
    (11, $$degree (university)$$, $$диплом$$, $$диплом$$, 'noun', 'masculine', 'not_applicable', false),
    (12, $$dictionary$$, $$словарь$$, $$словарь$$, 'noun', 'masculine', 'not_applicable', false),
    (13, $$discipline$$, $$дисциплина$$, $$дисциплина$$, 'noun', 'feminine', 'not_applicable', false),
    (14, $$discussion$$, $$обсуждение$$, $$обсуждение$$, 'noun', 'neuter', 'not_applicable', false),
    (15, $$do badly; fail an exam$$, $$не сдать экзамен$$, $$не сдать экзамен$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (16, $$drama group, acting group$$, $$драматический кружок$$, $$драматический кружок$$, 'noun', 'masculine', 'not_applicable', false),
    (17, $$economics, economy$$, $$экономика$$, $$экономика$$, 'noun', 'feminine', 'not_applicable', false),
    (18, $$education$$, $$образование$$, $$образование$$, 'noun', 'neuter', 'not_applicable', false),
    (19, $$essay$$, $$сочинение$$, $$сочинение$$, 'noun', 'neuter', 'not_applicable', false),
    (20, $$exchange$$, $$обмен$$, $$обмен$$, 'noun', 'masculine', 'not_applicable', false),
    (21, $$felt tip$$, $$фломастер$$, $$фломастер$$, 'noun', 'masculine', 'not_applicable', false),
    (22, $$finishing/completing school$$, $$окончание школы$$, $$окончание школы$$, 'noun', 'neuter', 'not_applicable', false),
    (23, $$foreign languages$$, $$иностранные языки$$, $$иностранные языки$$, 'noun', 'plural_only', 'not_applicable', false),
    (24, $$fountain pen$$, $$авторучка$$, $$авторучка$$, 'noun', 'feminine', 'not_applicable', false),
    (25, $$glue$$, $$клей$$, $$клей$$, 'noun', 'masculine', 'not_applicable', false),
    (26, $$hardworking$$, $$трудолюбивый$$, $$трудолюбивый$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (27, $$headteacher$$, $$директор$$, $$директор$$, 'noun', 'masculine', 'not_applicable', false),
    (28, $$kindergarten$$, $$детский сад$$, $$детский сад$$, 'noun', 'masculine', 'not_applicable', false),
    (29, $$locker$$, $$шкафчик$$, $$шкафчик$$, 'noun', 'masculine', 'not_applicable', false),
    (30, $$mark, grade$$, $$оценка$$, $$оценка$$, 'noun', 'feminine', 'not_applicable', false),
    (31, $$means, way$$, $$способ / образ$$, $$способ, образ$$, 'noun', 'masculine', 'not_applicable', false),
    (32, $$meeting$$, $$встреча$$, $$встреча$$, 'noun', 'feminine', 'not_applicable', false),
    (33, $$mixed$$, $$смешанный$$, $$смешанный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (34, $$optional (subject)$$, $$(предмет) по выбору$$, $$(предмет) по выбору$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (35, $$oral$$, $$устный$$, $$устный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (36, $$pad of paper$$, $$блокнот$$, $$блокнот$$, 'noun', 'masculine', 'not_applicable', false),
    (37, $$page$$, $$страница$$, $$страница$$, 'noun', 'feminine', 'not_applicable', false),
    (38, $$parents’ evening$$, $$родительское собрание$$, $$родительское собрание$$, 'noun', 'neuter', 'not_applicable', false),
    (39, $$permission$$, $$разрешение$$, $$разрешение$$, 'noun', 'neuter', 'not_applicable', false),
    (40, $$pressure$$, $$давление$$, $$давление$$, 'noun', 'neuter', 'not_applicable', false),
    (41, $$primary school$$, $$начальная школа$$, $$начальная школа$$, 'noun', 'feminine', 'not_applicable', false),
    (42, $$private school$$, $$частная школа$$, $$частная школа$$, 'noun', 'feminine', 'not_applicable', false),
    (43, $$project$$, $$проект$$, $$проект$$, 'noun', 'masculine', 'not_applicable', false),
    (44, $$pronunciation$$, $$произношение$$, $$произношение$$, 'noun', 'neuter', 'not_applicable', false),
    (45, $$punishment$$, $$наказание$$, $$наказание$$, 'noun', 'neuter', 'not_applicable', false),
    (46, $$qualification$$, $$квалификация$$, $$квалификация$$, 'noun', 'feminine', 'not_applicable', false),
    (47, $$report$$, $$отчёт$$, $$отчёт$$, 'noun', 'masculine', 'not_applicable', false),
    (48, $$rule$$, $$правило$$, $$правило$$, 'noun', 'neuter', 'not_applicable', false),
    (49, $$school leaving certificate$$, $$аттестат об окончании школы$$, $$аттестат об окончании школы$$, 'noun', 'masculine', 'not_applicable', false),
    (50, $$school report$$, $$отчёт$$, $$отчёт$$, 'noun', 'masculine', 'not_applicable', false),
    (51, $$school textbook$$, $$учебник$$, $$учебник$$, 'noun', 'masculine', 'not_applicable', false),
    (52, $$science$$, $$наука$$, $$наука$$, 'noun', 'feminine', 'not_applicable', false),
    (53, $$scissors$$, $$ножницы$$, $$ножницы$$, 'noun', 'plural_only', 'not_applicable', false),
    (54, $$secondary school$$, $$средняя школа$$, $$средняя школа$$, 'noun', 'feminine', 'not_applicable', false),
    (55, $$seminar$$, $$семинар$$, $$семинар$$, 'noun', 'masculine', 'not_applicable', false),
    (56, $$sharpener$$, $$точилка$$, $$точилка$$, 'noun', 'feminine', 'not_applicable', false),
    (57, $$shelf$$, $$полка$$, $$полка$$, 'noun', 'feminine', 'not_applicable', false),
    (58, $$sixth form$$, $$старшие классы$$, $$старшие классы$$, 'noun', 'plural_only', 'not_applicable', false),
    (59, $$sociology$$, $$социология$$, $$социология$$, 'noun', 'feminine', 'not_applicable', false),
    (60, $$sports ground$$, $$спортивная площадка$$, $$спортивная площадка$$, 'noun', 'feminine', 'not_applicable', false),
    (61, $$staff room$$, $$учительская$$, $$учительская$$, 'noun', 'feminine', 'not_applicable', false),
    (62, $$state$$, $$государственный$$, $$государственный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (63, $$strict$$, $$строгий$$, $$строгий$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (64, $$strong, good at (subject)$$, $$сильный$$, $$сильный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (65, $$studies$$, $$учёба$$, $$учёба$$, 'noun', 'feminine', 'not_applicable', false),
    (66, $$successful$$, $$успешный$$, $$успешный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (67, $$term$$, $$триместр$$, $$триместр$$, 'noun', 'masculine', 'not_applicable', false),
    (68, $$textbook$$, $$учебник$$, $$учебник$$, 'noun', 'masculine', 'not_applicable', false),
    (69, $$to agree (with) something$$, $$соглашаться / согласиться с чем-то$$, $$соглашаться/согласиться с чем-то$$, 'verb', 'not_applicable', 'both', true),
    (70, $$to calculate$$, $$считать / подсчитать$$, $$считать/под-$$, 'verb', 'not_applicable', 'both', false),
    (71, $$to cancel (lessons)$$, $$отменять / отменить$$, $$отменять/отменить$$, 'verb', 'not_applicable', 'both', false),
    (72, $$to correct$$, $$исправлять / исправить$$, $$исправлять/исправить$$, 'verb', 'not_applicable', 'both', false),
    (73, $$to drop a subject$$, $$бросать / бросить предмет$$, $$бросать/бросить предмет$$, 'verb', 'not_applicable', 'both', false),
    (74, $$to improve$$, $$улучшать / улучшить$$, $$улучшать/улучшить$$, 'verb', 'not_applicable', 'both', false),
    (75, $$to pass (exam)$$, $$сдать экзамен$$, $$сдать (экзамен)$$, 'verb', 'not_applicable', 'perfective', false),
    (76, $$to pay attention$$, $$обращать / обратить внимание$$, $$обращать/обратить внимание$$, 'verb', 'not_applicable', 'both', false),
    (77, $$to practise$$, $$практиковаться$$, $$практиковаться$$, 'verb', 'not_applicable', 'imperfective', true),
    (78, $$to pronounce$$, $$произносить / произнести$$, $$произносить/произнести$$, 'verb', 'not_applicable', 'both', false),
    (79, $$to repeat$$, $$повторять / повторить$$, $$повторять/повторить$$, 'verb', 'not_applicable', 'both', false),
    (80, $$to revise$$, $$готовиться / подготовиться$$, $$готовиться/под-$$, 'verb', 'not_applicable', 'both', true),
    (81, $$to sit an exam$$, $$сдавать экзамен$$, $$сдавать экзамен$$, 'verb', 'not_applicable', 'imperfective', false),
    (82, $$to skive/to skip/bunk lessons$$, $$прогуливать / прогулять уроки$$, $$прогуливать/прогулять уроки$$, 'verb', 'not_applicable', 'both', false),
    (83, $$to teach$$, $$учить / преподавать$$, $$учить, преподавать$$, 'verb', 'not_applicable', 'imperfective', false),
    (84, $$to translate$$, $$переводить / перевести$$, $$переводить/перевести$$, 'verb', 'not_applicable', 'both', false),
    (85, $$to work hard$$, $$усердно работать$$, $$усердно работать$$, 'verb', 'not_applicable', 'imperfective', false),
    (86, $$translation$$, $$перевод$$, $$перевод$$, 'noun', 'masculine', 'not_applicable', false),
    (87, $$unfair$$, $$несправедливый$$, $$несправедливый$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (88, $$village$$, $$село$$, $$село$$, 'noun', 'neuter', 'not_applicable', false),
    (89, $$vocational school; technical college$$, $$техникум$$, $$техникум$$, 'noun', 'masculine', 'not_applicable', false),
    (90, $$waste of time$$, $$трата времени$$, $$трата времени$$, 'noun', 'feminine', 'not_applicable', false),
    (91, $$weak, bad at (subject)$$, $$слабый$$, $$слабый$$, 'adjective', 'not_applicable', 'not_applicable', false)
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
      'school-higher:item-' ||
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
    'school',
    'school_life',
    'school',
    prepared_items.aspect,
    prepared_items.is_reflexive,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / School / Higher tier',
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
  'Section 2: Topic-specific vocabulary / School / Higher tier',
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
