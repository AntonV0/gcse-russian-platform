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
    'foundation',
    'Foundation tier',
    'Foundation tier vocabulary for future aspirations, study and work.',
    'future_aspirations_study_work',
    'future_study_and_work',
    'future_aspirations_study_work',
    'foundation',
    'spec_only',
    'single_column',
    true,
    600,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Future aspirations, study and work / Foundation tier',
    'section-2:future-aspirations-study-and-work:foundation:list'
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
    (1, $$actor$$, $$актёр$$, $$актёр$$, 'noun', 'masculine', 'not_applicable', false),
    (2, $$actress$$, $$актриса$$, $$актриса$$, 'noun', 'feminine', 'not_applicable', false),
    (3, $$advertisement$$, $$реклама$$, $$реклама$$, 'noun', 'feminine', 'not_applicable', false),
    (4, $$air hostess$$, $$стюардесса$$, $$стюардесса$$, 'noun', 'feminine', 'not_applicable', false),
    (5, $$ambition$$, $$амбиция$$, $$амбиция$$, 'noun', 'feminine', 'not_applicable', false),
    (6, $$architect$$, $$архитектор$$, $$архитектор$$, 'noun', 'masculine', 'not_applicable', false),
    (7, $$army$$, $$армия$$, $$армия$$, 'noun', 'feminine', 'not_applicable', false),
    (8, $$aspiration$$, $$желание$$, $$желание$$, 'noun', 'neuter', 'not_applicable', false),
    (9, $$assistant$$, $$помощник$$, $$помощник$$, 'noun', 'masculine', 'not_applicable', false),
    (10, $$banker$$, $$банкир$$, $$банкир$$, 'noun', 'masculine', 'not_applicable', false),
    (11, $$beyond (the classroom)$$, $$вне (класса)$$, $$вне (класса)$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (12, $$builder$$, $$строитель$$, $$строитель$$, 'noun', 'masculine', 'not_applicable', false),
    (13, $$business$$, $$бизнес$$, $$бизнес$$, 'noun', 'masculine', 'not_applicable', false),
    (14, $$career$$, $$карьера$$, $$карьера$$, 'noun', 'feminine', 'not_applicable', false),
    (15, $$cashier$$, $$кассир$$, $$кассир$$, 'noun', 'masculine', 'not_applicable', false),
    (16, $$coffee (tea/lunch) break$$, $$перерыв на кофе (чай / обед)$$, $$перерыв на кофе (чай/обед)$$, 'noun', 'masculine', 'not_applicable', false),
    (17, $$colleague$$, $$коллега$$, $$коллега$$, 'noun', 'common', 'not_applicable', false),
    (18, $$company$$, $$компания$$, $$компания$$, 'noun', 'feminine', 'not_applicable', false),
    (19, $$computer$$, $$компьютер$$, $$компьютер$$, 'noun', 'masculine', 'not_applicable', false),
    (20, $$computer science$$, $$информатика$$, $$информатика$$, 'noun', 'feminine', 'not_applicable', false),
    (21, $$cook$$, $$повар$$, $$повар$$, 'noun', 'masculine', 'not_applicable', false),
    (22, $$degree$$, $$диплом$$, $$диплом$$, 'noun', 'masculine', 'not_applicable', false),
    (23, $$dentist$$, $$зубной врач$$, $$зубной врач$$, 'noun', 'masculine', 'not_applicable', false),
    (24, $$designer$$, $$дизайнер$$, $$дизайнер$$, 'noun', 'masculine', 'not_applicable', false),
    (25, $$doctor$$, $$врач$$, $$врач$$, 'noun', 'masculine', 'not_applicable', false),
    (26, $$dream (aspiration)$$, $$мечта$$, $$мечта$$, 'noun', 'feminine', 'not_applicable', false),
    (27, $$driver$$, $$шофёр$$, $$шофёр$$, 'noun', 'masculine', 'not_applicable', false),
    (28, $$electrician$$, $$электрик$$, $$электрик$$, 'noun', 'masculine', 'not_applicable', false),
    (29, $$employment$$, $$работа$$, $$работа$$, 'noun', 'feminine', 'not_applicable', false),
    (30, $$engineer$$, $$инженер$$, $$инженер$$, 'noun', 'masculine', 'not_applicable', false),
    (31, $$farmer$$, $$фермер$$, $$фермер$$, 'noun', 'masculine', 'not_applicable', false),
    (32, $$farm worker$$, $$работник на ферме$$, $$работник на ферме$$, 'noun', 'masculine', 'not_applicable', false),
    (33, $$fashion$$, $$мода$$, $$мода$$, 'noun', 'feminine', 'not_applicable', false),
    (34, $$file$$, $$файл$$, $$файл$$, 'noun', 'masculine', 'not_applicable', false),
    (35, $$fireman$$, $$пожарник$$, $$пожарник$$, 'noun', 'masculine', 'not_applicable', false),
    (36, $$folder$$, $$папка$$, $$папка$$, 'noun', 'feminine', 'not_applicable', false),
    (37, $$form$$, $$бланк$$, $$бланк$$, 'noun', 'masculine', 'not_applicable', false),
    (38, $$future$$, $$будущее$$, $$будущее$$, 'noun', 'neuter', 'not_applicable', false),
    (39, $$interview$$, $$интервью$$, $$интервью$$, 'noun', 'neuter', 'not_applicable', false),
    (40, $$job$$, $$работа$$, $$работа$$, 'noun', 'feminine', 'not_applicable', false),
    (41, $$journalist$$, $$журналист / журналистка$$, $$журналист/ка$$, 'noun', 'common', 'not_applicable', false),
    (42, $$language$$, $$язык$$, $$язык$$, 'noun', 'masculine', 'not_applicable', false),
    (43, $$lawyer$$, $$адвокат$$, $$адвокат$$, 'noun', 'masculine', 'not_applicable', false),
    (44, $$lecture$$, $$лекция$$, $$лекция$$, 'noun', 'feminine', 'not_applicable', false),
    (45, $$male nurse$$, $$медбрат$$, $$медбрат$$, 'noun', 'masculine', 'not_applicable', false),
    (46, $$manager$$, $$менеджер$$, $$менеджер$$, 'noun', 'masculine', 'not_applicable', false),
    (47, $$marketing$$, $$маркетинг$$, $$маркетинг$$, 'noun', 'masculine', 'not_applicable', false),
    (48, $$mechanic$$, $$механик$$, $$механик$$, 'noun', 'masculine', 'not_applicable', false),
    (49, $$medal$$, $$медаль$$, $$медаль f$$, 'noun', 'feminine', 'not_applicable', false),
    (50, $$medicine (study of the subject)$$, $$медицина$$, $$медицина$$, 'noun', 'feminine', 'not_applicable', false),
    (51, $$member$$, $$член$$, $$член$$, 'noun', 'masculine', 'not_applicable', false),
    (52, $$model$$, $$фотомодель$$, $$фотомодель f$$, 'noun', 'feminine', 'not_applicable', false),
    (53, $$musical$$, $$музыкальный$$, $$музыкальный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (54, $$musician$$, $$музыкант$$, $$музыкант$$, 'noun', 'masculine', 'not_applicable', false),
    (55, $$nurse$$, $$медсестра$$, $$медсестра$$, 'noun', 'feminine', 'not_applicable', false),
    (56, $$officer$$, $$офицер$$, $$офицер$$, 'noun', 'masculine', 'not_applicable', false),
    (57, $$per hour$$, $$в час$$, $$в час$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (58, $$poet$$, $$поэт$$, $$поэт$$, 'noun', 'masculine', 'not_applicable', false),
    (59, $$printer$$, $$принтер$$, $$принтер$$, 'noun', 'masculine', 'not_applicable', false),
    (60, $$profession$$, $$профессия$$, $$профессия$$, 'noun', 'feminine', 'not_applicable', false),
    (61, $$programmer$$, $$программист$$, $$программист$$, 'noun', 'masculine', 'not_applicable', false),
    (62, $$project$$, $$проект$$, $$проект$$, 'noun', 'masculine', 'not_applicable', false),
    (63, $$reporter$$, $$репортёр$$, $$репортёр$$, 'noun', 'masculine', 'not_applicable', false),
    (64, $$sales assistant$$, $$продавец / продавщица$$, $$продавец/продавщица$$, 'noun', 'common', 'not_applicable', false),
    (65, $$soldier$$, $$солдат$$, $$солдат$$, 'noun', 'masculine', 'not_applicable', false),
    (66, $$sponsor$$, $$спонсор$$, $$спонсор$$, 'noun', 'masculine', 'not_applicable', false),
    (67, $$student$$, $$студент / студентка$$, $$студент(ка)$$, 'noun', 'common', 'not_applicable', false),
    (68, $$study$$, $$изучение$$, $$изучение$$, 'noun', 'neuter', 'not_applicable', false),
    (69, $$teacher$$, $$учитель / преподаватель$$, $$учитель, преподаватель$$, 'noun', 'masculine', 'not_applicable', false),
    (70, $$teacher (f)$$, $$учительница$$, $$учительница$$, 'noun', 'feminine', 'not_applicable', false),
    (71, $$technician$$, $$техник$$, $$техник$$, 'noun', 'masculine', 'not_applicable', false),
    (72, $$telephone$$, $$телефон$$, $$телефон$$, 'noun', 'masculine', 'not_applicable', false),
    (73, $$to build$$, $$строить / построить$$, $$строить/по-$$, 'verb', 'not_applicable', 'both', false),
    (74, $$to organise$$, $$организовать$$, $$организовать$$, 'verb', 'not_applicable', 'perfective', false),
    (75, $$to study$$, $$изучать / учиться$$, $$изучать; учиться$$, 'verb', 'not_applicable', 'imperfective', true),
    (76, $$training (sport)$$, $$тренинг$$, $$тренинг$$, 'noun', 'masculine', 'not_applicable', false),
    (77, $$training (study)$$, $$обучение$$, $$обучение$$, 'noun', 'neuter', 'not_applicable', false),
    (78, $$travel agency$$, $$турагентство$$, $$турагентство$$, 'noun', 'neuter', 'not_applicable', false),
    (79, $$university$$, $$университет$$, $$университет$$, 'noun', 'masculine', 'not_applicable', false),
    (80, $$vet$$, $$ветеринар$$, $$ветеринар$$, 'noun', 'masculine', 'not_applicable', false),
    (81, $$volunteer$$, $$волонтёр$$, $$волонтёр$$, 'noun', 'masculine', 'not_applicable', false),
    (82, $$waiter/waitress$$, $$официант / официантка$$, $$официант/официантка$$, 'noun', 'common', 'not_applicable', false),
    (83, $$work$$, $$работа$$, $$работа$$, 'noun', 'feminine', 'not_applicable', false),
    (84, $$work experience$$, $$трудовая практика$$, $$трудовая практика$$, 'noun', 'feminine', 'not_applicable', false)
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
      'future-aspirations-study-and-work-foundation:item-' ||
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
    'future_aspirations_study_work',
    'future_study_and_work',
    'future_aspirations_study_work',
    prepared_items.aspect,
    prepared_items.is_reflexive,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Future aspirations, study and work / Foundation tier',
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
  'Section 2: Topic-specific vocabulary / Future aspirations, study and work / Foundation tier',
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
