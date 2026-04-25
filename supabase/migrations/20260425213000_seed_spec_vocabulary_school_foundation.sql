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
    'foundation',
    'Foundation tier',
    'Foundation tier vocabulary for school.',
    'school',
    'school_life',
    'school',
    'foundation',
    'spec_only',
    'single_column',
    true,
    500,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / School / Foundation tier',
    'section-2:school:foundation:list'
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
    (1, $$answer$$, $$ответ$$, $$ответ$$, 'noun', 'masculine', 'not_applicable', false),
    (2, $$article$$, $$статья$$, $$статья$$, 'noun', 'feminine', 'not_applicable', false),
    (3, $$art, drawing$$, $$рисование$$, $$рисование$$, 'noun', 'neuter', 'not_applicable', false),
    (4, $$beginning, start$$, $$начало$$, $$начало$$, 'noun', 'neuter', 'not_applicable', false),
    (5, $$biology$$, $$биология$$, $$биология$$, 'noun', 'feminine', 'not_applicable', false),
    (6, $$board (blackboard, whiteboard etc)$$, $$доска$$, $$доска$$, 'noun', 'feminine', 'not_applicable', false),
    (7, $$book$$, $$книга$$, $$книга$$, 'noun', 'feminine', 'not_applicable', false),
    (8, $$break$$, $$перерыв$$, $$перерыв$$, 'noun', 'masculine', 'not_applicable', false),
    (9, $$business studies$$, $$бизнес$$, $$бизнес$$, 'noun', 'masculine', 'not_applicable', false),
    (10, $$calculator$$, $$калькулятор$$, $$калькулятор$$, 'noun', 'masculine', 'not_applicable', false),
    (11, $$calendar$$, $$календарь$$, $$календарь$$, 'noun', 'masculine', 'not_applicable', false),
    (12, $$canteen$$, $$столовая$$, $$столовая$$, 'noun', 'feminine', 'not_applicable', false),
    (13, $$chemistry$$, $$химия$$, $$химия$$, 'noun', 'feminine', 'not_applicable', false),
    (14, $$choir$$, $$хор$$, $$хор$$, 'noun', 'masculine', 'not_applicable', false),
    (15, $$circle, club$$, $$клуб$$, $$клуб$$, 'noun', 'masculine', 'not_applicable', false),
    (16, $$class$$, $$класс$$, $$класс$$, 'noun', 'masculine', 'not_applicable', false),
    (17, $$class test$$, $$тест$$, $$тест$$, 'noun', 'masculine', 'not_applicable', false),
    (18, $$classroom$$, $$классная комната$$, $$классная комната$$, 'noun', 'feminine', 'not_applicable', false),
    (19, $$copy$$, $$копия$$, $$копия$$, 'noun', 'feminine', 'not_applicable', false),
    (20, $$corridor$$, $$коридор$$, $$коридор$$, 'noun', 'masculine', 'not_applicable', false),
    (21, $$cupboard$$, $$шкаф$$, $$шкаф$$, 'noun', 'masculine', 'not_applicable', false),
    (22, $$desk$$, $$парта$$, $$парта$$, 'noun', 'feminine', 'not_applicable', false),
    (23, $$dining room$$, $$столовая$$, $$столовая$$, 'noun', 'feminine', 'not_applicable', false),
    (24, $$drama (school subject)$$, $$театр$$, $$театр$$, 'noun', 'masculine', 'not_applicable', false),
    (25, $$DT (design technology)$$, $$труд$$, $$труд$$, 'noun', 'masculine', 'not_applicable', false),
    (26, $$English$$, $$английский язык$$, $$английский язык$$, 'noun', 'masculine', 'not_applicable', false),
    (27, $$event (at school)$$, $$мероприятие (в школе)$$, $$мероприятие (в школе)$$, 'noun', 'neuter', 'not_applicable', false),
    (28, $$examination$$, $$экзамен$$, $$экзамен$$, 'noun', 'masculine', 'not_applicable', false),
    (29, $$exchange$$, $$обмен$$, $$обмен$$, 'noun', 'masculine', 'not_applicable', false),
    (30, $$exercise$$, $$упражнение$$, $$упражнение$$, 'noun', 'neuter', 'not_applicable', false),
    (31, $$exercise book$$, $$тетрадь$$, $$тетрадь$$, 'noun', 'feminine', 'not_applicable', false),
    (32, $$experiment$$, $$эксперимент$$, $$эксперимент$$, 'noun', 'masculine', 'not_applicable', false),
    (33, $$expert$$, $$эксперт$$, $$эксперт$$, 'noun', 'masculine', 'not_applicable', false),
    (34, $$French$$, $$французский язык$$, $$французский язык$$, 'noun', 'masculine', 'not_applicable', false),
    (35, $$future plans$$, $$планы на будущее$$, $$планы на будущее$$, 'noun', 'plural_only', 'not_applicable', false),
    (36, $$geography$$, $$география$$, $$география$$, 'noun', 'feminine', 'not_applicable', false),
    (37, $$German$$, $$немецкий язык$$, $$немецкий язык$$, 'noun', 'masculine', 'not_applicable', false),
    (38, $$gym$$, $$спортзал$$, $$спортзал$$, 'noun', 'masculine', 'not_applicable', false),
    (39, $$gymnastics$$, $$гимнастика$$, $$гимнастика$$, 'noun', 'feminine', 'not_applicable', false),
    (40, $$headteacher$$, $$директор$$, $$директор$$, 'noun', 'masculine', 'not_applicable', false),
    (41, $$history$$, $$история$$, $$история$$, 'noun', 'feminine', 'not_applicable', false),
    (42, $$homework$$, $$домашнее задание$$, $$домашнее задание$$, 'noun', 'neuter', 'not_applicable', false),
    (43, $$ICT$$, $$информатика$$, $$информатика$$, 'noun', 'feminine', 'not_applicable', false),
    (44, $$Italian$$, $$итальянский язык$$, $$итальянский язык$$, 'noun', 'masculine', 'not_applicable', false),
    (45, $$laboratory$$, $$лаборатория$$, $$лаборатория$$, 'noun', 'feminine', 'not_applicable', false),
    (46, $$languages$$, $$языки$$, $$языки$$, 'noun', 'plural_only', 'not_applicable', false),
    (47, $$latin$$, $$латынь$$, $$латынь$$, 'noun', 'feminine', 'not_applicable', false),
    (48, $$lesson$$, $$урок$$, $$урок$$, 'noun', 'masculine', 'not_applicable', false),
    (49, $$lessons; studies; activities$$, $$занятия$$, $$занятия$$, 'noun', 'plural_only', 'not_applicable', false),
    (50, $$letter$$, $$письмо$$, $$письмо$$, 'noun', 'neuter', 'not_applicable', false),
    (51, $$library$$, $$библиотека$$, $$библиотека$$, 'noun', 'feminine', 'not_applicable', false),
    (52, $$literature$$, $$литература$$, $$литература$$, 'noun', 'feminine', 'not_applicable', false),
    (53, $$lunch (adjective)$$, $$обеденный$$, $$обеденный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (54, $$lunch break$$, $$перерыв на обед$$, $$перерыв на обед$$, 'noun', 'masculine', 'not_applicable', false),
    (55, $$maths$$, $$математика$$, $$математика$$, 'noun', 'feminine', 'not_applicable', false),
    (56, $$music$$, $$музыка$$, $$музыка$$, 'noun', 'feminine', 'not_applicable', false),
    (57, $$PE$$, $$физкультура$$, $$физкультура$$, 'noun', 'feminine', 'not_applicable', false),
    (58, $$pen$$, $$ручка$$, $$ручка$$, 'noun', 'feminine', 'not_applicable', false),
    (59, $$pencil$$, $$карандаш$$, $$карандаш$$, 'noun', 'masculine', 'not_applicable', false),
    (60, $$pencil case$$, $$пенал$$, $$пенал$$, 'noun', 'masculine', 'not_applicable', false),
    (61, $$physics$$, $$физика$$, $$физика$$, 'noun', 'feminine', 'not_applicable', false),
    (62, $$plan$$, $$план$$, $$план$$, 'noun', 'masculine', 'not_applicable', false),
    (63, $$pupil (f)$$, $$ученица$$, $$ученица$$, 'noun', 'feminine', 'not_applicable', false),
    (64, $$pupil (m)$$, $$ученик$$, $$ученик$$, 'noun', 'masculine', 'not_applicable', false),
    (65, $$practice$$, $$практика$$, $$практика$$, 'noun', 'feminine', 'not_applicable', false),
    (66, $$pressure$$, $$давление$$, $$давление$$, 'noun', 'neuter', 'not_applicable', false),
    (67, $$progress$$, $$прогресс$$, $$прогресс$$, 'noun', 'masculine', 'not_applicable', false),
    (68, $$projector$$, $$проектор$$, $$проектор$$, 'noun', 'masculine', 'not_applicable', false),
    (69, $$question$$, $$вопрос$$, $$вопрос$$, 'noun', 'masculine', 'not_applicable', false),
    (70, $$religion, religious studies$$, $$религия$$, $$религия$$, 'noun', 'feminine', 'not_applicable', false),
    (71, $$result$$, $$результат$$, $$результат$$, 'noun', 'masculine', 'not_applicable', false),
    (72, $$rubber$$, $$резинка$$, $$резинка$$, 'noun', 'feminine', 'not_applicable', false),
    (73, $$rule$$, $$правило$$, $$правило$$, 'noun', 'neuter', 'not_applicable', false),
    (74, $$ruler$$, $$линейка$$, $$линейка$$, 'noun', 'feminine', 'not_applicable', false),
    (75, $$Russian (language)$$, $$русский язык$$, $$русский язык$$, 'noun', 'masculine', 'not_applicable', false),
    (76, $$school$$, $$школа$$, $$школа$$, 'noun', 'feminine', 'not_applicable', false),
    (77, $$school activities$$, $$школьные мероприятия$$, $$школьные мероприятия$$, 'noun', 'plural_only', 'not_applicable', false),
    (78, $$school bag$$, $$школьная сумка$$, $$школьная сумка$$, 'noun', 'feminine', 'not_applicable', false),
    (79, $$school bus$$, $$школьный автобус$$, $$школьный автобус$$, 'noun', 'masculine', 'not_applicable', false),
    (80, $$school day$$, $$школьный день$$, $$школьный день$$, 'noun', 'masculine', 'not_applicable', false),
    (81, $$school group/party$$, $$школьная группа$$, $$школьная группа$$, 'noun', 'feminine', 'not_applicable', false),
    (82, $$school trip$$, $$школьная поездка$$, $$школьная поездка$$, 'noun', 'feminine', 'not_applicable', false),
    (83, $$schoolchild (f)$$, $$школьница$$, $$школьница$$, 'noun', 'feminine', 'not_applicable', false),
    (84, $$schoolchild (m)$$, $$школьник$$, $$школьник$$, 'noun', 'masculine', 'not_applicable', false),
    (85, $$sociology$$, $$социология$$, $$социология$$, 'noun', 'feminine', 'not_applicable', false),
    (86, $$Spanish$$, $$испанский язык$$, $$испанский язык$$, 'noun', 'masculine', 'not_applicable', false),
    (87, $$specialist$$, $$специалист$$, $$специалист$$, 'noun', 'masculine', 'not_applicable', false),
    (88, $$sports hall, gym$$, $$спортзал$$, $$спортзал$$, 'noun', 'masculine', 'not_applicable', false),
    (89, $$stress$$, $$стресс$$, $$стресс$$, 'noun', 'masculine', 'not_applicable', false),
    (90, $$student$$, $$студент / студентка$$, $$студент(ка)$$, 'noun', 'common', 'not_applicable', false),
    (91, $$study$$, $$учёба$$, $$учёба$$, 'noun', 'feminine', 'not_applicable', false),
    (92, $$subject$$, $$предмет$$, $$предмет$$, 'noun', 'masculine', 'not_applicable', false),
    (93, $$success$$, $$успех$$, $$успех$$, 'noun', 'masculine', 'not_applicable', false),
    (94, $$summer holidays$$, $$летние каникулы$$, $$летние каникулы$$, 'noun', 'plural_only', 'not_applicable', false),
    (95, $$team$$, $$команда$$, $$команда$$, 'noun', 'feminine', 'not_applicable', false),
    (96, $$technology$$, $$технология$$, $$технология$$, 'noun', 'feminine', 'not_applicable', false),
    (97, $$the future$$, $$будущее$$, $$будущее$$, 'noun', 'neuter', 'not_applicable', false),
    (98, $$the past$$, $$прошлое$$, $$прошлое$$, 'noun', 'neuter', 'not_applicable', false),
    (99, $$tie$$, $$галстук$$, $$галстук$$, 'noun', 'masculine', 'not_applicable', false),
    (100, $$timetable$$, $$расписание$$, $$расписание$$, 'noun', 'neuter', 'not_applicable', false),
    (101, $$type$$, $$тип$$, $$тип$$, 'noun', 'masculine', 'not_applicable', false),
    (102, $$uniform$$, $$(школьная) форма$$, $$(школьная) форма$$, 'noun', 'feminine', 'not_applicable', false),
    (103, $$year$$, $$год$$, $$год$$, 'noun', 'masculine', 'not_applicable', false)
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
      'school-foundation:item-' ||
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
    'school',
    'school_life',
    'school',
    prepared_items.aspect,
    prepared_items.is_reflexive,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / School / Foundation tier',
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
  'Section 2: Topic-specific vocabulary / School / Foundation tier',
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
