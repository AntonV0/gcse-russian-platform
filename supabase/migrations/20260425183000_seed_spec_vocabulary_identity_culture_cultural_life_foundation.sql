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
    'identity-and-culture-cultural-life',
    'Cultural life',
    'Spec-required topic-specific GCSE Russian vocabulary for identity and culture: cultural life.',
    'identity_and_culture',
    'identity_and_culture_cultural_life',
    'both',
    'spec_only',
    'specification',
    'single_column',
    true,
    330,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'section-2:identity-and-culture:cultural-life'
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
    'Foundation tier vocabulary for cultural life.',
    'identity_and_culture',
    'identity_and_culture_cultural_life',
    'cultural_life',
    'foundation',
    'spec_only',
    'single_column',
    true,
    330,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Identity and culture / Cultural life / Foundation tier',
    'section-2:identity-and-culture:cultural-life:foundation:list'
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
    (1, $$accordion$$, $$аккордеон$$, $$аккордеон$$, 'noun', 'masculine', 'not_applicable', false),
    (2, $$aerobics$$, $$аэробика$$, $$аэробика$$, 'noun', 'feminine', 'not_applicable', false),
    (3, $$art gallery$$, $$галерея$$, $$галерея$$, 'noun', 'feminine', 'not_applicable', false),
    (4, $$a sport$$, $$вид спорта$$, $$вид спорта$$, 'noun', 'masculine', 'not_applicable', false),
    (5, $$athletics$$, $$атлетика$$, $$атлетика$$, 'noun', 'feminine', 'not_applicable', false),
    (6, $$badminton$$, $$бадминтон$$, $$бадминтон$$, 'noun', 'masculine', 'not_applicable', false),
    (7, $$balalaika$$, $$балалайка$$, $$балалайка$$, 'noun', 'feminine', 'not_applicable', false),
    (8, $$ball$$, $$мяч$$, $$мяч$$, 'noun', 'masculine', 'not_applicable', false),
    (9, $$ballet$$, $$балет$$, $$балет$$, 'noun', 'masculine', 'not_applicable', false),
    (10, $$band/group$$, $$группа$$, $$группа$$, 'noun', 'feminine', 'not_applicable', false),
    (11, $$basketball$$, $$баскетбол$$, $$баскетбол$$, 'noun', 'masculine', 'not_applicable', false),
    (12, $$book$$, $$книга$$, $$книга$$, 'noun', 'feminine', 'not_applicable', false),
    (13, $$boxing$$, $$бокс$$, $$бокс$$, 'noun', 'masculine', 'not_applicable', false),
    (14, $$camera$$, $$фотоаппарат$$, $$фотоаппарат$$, 'noun', 'masculine', 'not_applicable', false),
    (15, $$cartoon$$, $$мультфильм$$, $$мультфильм$$, 'noun', 'masculine', 'not_applicable', false),
    (16, $$cat$$, $$кошка$$, $$кошка$$, 'noun', 'feminine', 'not_applicable', false),
    (17, $$CD (compact disc)$$, $$компакт-диск$$, $$компакт-диск$$, 'noun', 'masculine', 'not_applicable', false),
    (18, $$celebration$$, $$праздник$$, $$праздник$$, 'noun', 'masculine', 'not_applicable', false),
    (19, $$chess$$, $$шахматы$$, $$шахматы$$, 'noun', 'plural_only', 'not_applicable', false),
    (20, $$choir$$, $$хор$$, $$хор$$, 'noun', 'masculine', 'not_applicable', false),
    (21, $$Christmas$$, $$Рождество$$, $$Рождество$$, 'noun', 'neuter', 'not_applicable', false),
    (22, $$cinema (medium)$$, $$кино$$, $$кино$$, 'noun', 'neuter', 'not_applicable', false),
    (23, $$clarinet$$, $$кларнет$$, $$кларнет$$, 'noun', 'masculine', 'not_applicable', false),
    (24, $$classical, classic$$, $$классический$$, $$классический$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (25, $$club$$, $$клуб$$, $$клуб$$, 'noun', 'masculine', 'not_applicable', false),
    (26, $$collection$$, $$коллекция$$, $$коллекция$$, 'noun', 'feminine', 'not_applicable', false),
    (27, $$computer game$$, $$компьютерная игра$$, $$компьютерная игра$$, 'noun', 'feminine', 'not_applicable', false),
    (28, $$concert$$, $$концерт$$, $$концерт$$, 'noun', 'masculine', 'not_applicable', false),
    (29, $$cultural$$, $$культурный$$, $$культурный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (30, $$culture$$, $$культура$$, $$культура$$, 'noun', 'feminine', 'not_applicable', false),
    (31, $$cycle$$, $$велосипед$$, $$велосипед$$, 'noun', 'masculine', 'not_applicable', false),
    (32, $$dance$$, $$танец$$, $$танец$$, 'noun', 'masculine', 'not_applicable', false),
    (33, $$detective/police (story)$$, $$детектив$$, $$детектив$$, 'noun', 'masculine', 'not_applicable', false),
    (34, $$documentary$$, $$документальный фильм$$, $$документальный фильм$$, 'noun', 'masculine', 'not_applicable', false),
    (35, $$drum$$, $$барабан$$, $$барабан$$, 'noun', 'masculine', 'not_applicable', false),
    (36, $$Easter$$, $$Пасха$$, $$Пасха$$, 'noun', 'feminine', 'not_applicable', false),
    (37, $$event$$, $$событие$$, $$событие$$, 'noun', 'neuter', 'not_applicable', false),
    (38, $$festival$$, $$праздник$$, $$праздник$$, 'noun', 'masculine', 'not_applicable', false),
    (39, $$film$$, $$фильм$$, $$фильм$$, 'noun', 'masculine', 'not_applicable', false),
    (40, $$flute$$, $$флейта$$, $$флейта$$, 'noun', 'feminine', 'not_applicable', false),
    (41, $$football$$, $$футбол$$, $$футбол$$, 'noun', 'masculine', 'not_applicable', false),
    (42, $$free time$$, $$свободное время$$, $$свободное время$$, 'noun', 'neuter', 'not_applicable', false),
    (43, $$game$$, $$игра$$, $$игра$$, 'noun', 'feminine', 'not_applicable', false),
    (44, $$guitar$$, $$гитара$$, $$гитара$$, 'noun', 'feminine', 'not_applicable', false),
    (45, $$gymnastics$$, $$гимнастика$$, $$гимнастика$$, 'noun', 'feminine', 'not_applicable', false),
    (46, $$Happy birthday!$$, $$С днём рождения!$$, $$С днём рождения!$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (47, $$Happy New Year!$$, $$С Новым годом!$$, $$С Новым Годом!$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (48, $$hobby; leisure activity$$, $$хобби$$, $$хобби$$, 'noun', 'neuter', 'not_applicable', false),
    (49, $$hockey$$, $$хоккей$$, $$хоккей$$, 'noun', 'masculine', 'not_applicable', false),
    (50, $$ice skating$$, $$катание на коньках$$, $$катание на коньках$$, 'noun', 'neuter', 'not_applicable', false),
    (51, $$idea$$, $$идея$$, $$идея$$, 'noun', 'feminine', 'not_applicable', false),
    (52, $$information$$, $$информация$$, $$информация$$, 'noun', 'feminine', 'not_applicable', false),
    (53, $$instrument$$, $$инструмент$$, $$инструмент$$, 'noun', 'masculine', 'not_applicable', false),
    (54, $$interest$$, $$интерес$$, $$интерес$$, 'noun', 'masculine', 'not_applicable', false),
    (55, $$lottery$$, $$лотерея$$, $$лотерея$$, 'noun', 'feminine', 'not_applicable', false),
    (56, $$magazine$$, $$журнал$$, $$журнал$$, 'noun', 'masculine', 'not_applicable', false),
    (57, $$method$$, $$метод$$, $$метод$$, 'noun', 'masculine', 'not_applicable', false),
    (58, $$mobile phone$$, $$мобильный телефон$$, $$мобильный телефон$$, 'noun', 'masculine', 'not_applicable', false),
    (59, $$MP3 player$$, $$MP3 плеер$$, $$MP3 плеер$$, 'noun', 'masculine', 'not_applicable', false),
    (60, $$music$$, $$музыка$$, $$музыка$$, 'noun', 'feminine', 'not_applicable', false),
    (61, $$musical (show)$$, $$мюзикл$$, $$мюзикл$$, 'noun', 'masculine', 'not_applicable', false),
    (62, $$New Year$$, $$Новый год$$, $$Новый год$$, 'noun', 'masculine', 'not_applicable', false),
    (63, $$news$$, $$новости$$, $$новости$$, 'noun', 'plural_only', 'not_applicable', false),
    (64, $$nightclub$$, $$ночной клуб$$, $$ночной клуб$$, 'noun', 'masculine', 'not_applicable', false),
    (65, $$opera$$, $$опера$$, $$опера$$, 'noun', 'feminine', 'not_applicable', false),
    (66, $$orchestra$$, $$оркестр$$, $$оркестр$$, 'noun', 'masculine', 'not_applicable', false),
    (67, $$photo(graph)$$, $$фото / фотография$$, $$фото(графия)$$, 'noun', 'unknown', 'not_applicable', false),
    (68, $$piano$$, $$пианино$$, $$пианино$$, 'noun', 'neuter', 'not_applicable', false),
    (69, $$ping pong$$, $$пинг-понг$$, $$пинг-понг$$, 'noun', 'masculine', 'not_applicable', false),
    (70, $$player$$, $$игрок$$, $$игрок$$, 'noun', 'masculine', 'not_applicable', false),
    (71, $$pop music$$, $$поп-музыка$$, $$поп-музыка$$, 'noun', 'feminine', 'not_applicable', false),
    (72, $$programme, broadcast$$, $$передача$$, $$передача$$, 'noun', 'feminine', 'not_applicable', false),
    (73, $$rap$$, $$рэп$$, $$рэп$$, 'noun', 'masculine', 'not_applicable', false),
    (74, $$reading$$, $$чтение$$, $$чтение$$, 'noun', 'neuter', 'not_applicable', false),
    (75, $$rock music$$, $$рок-музыка$$, $$рок-музыка$$, 'noun', 'feminine', 'not_applicable', false),
    (76, $$role model$$, $$пример$$, $$пример$$, 'noun', 'masculine', 'not_applicable', false),
    (77, $$romantic$$, $$романтический$$, $$романтический$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (78, $$rugby$$, $$регби$$, $$регби$$, 'noun', 'neuter', 'not_applicable', false),
    (79, $$saxophone$$, $$саксофон$$, $$саксофон$$, 'noun', 'masculine', 'not_applicable', false),
    (80, $$science fiction film$$, $$научно-фантастический фильм$$, $$научно-фантастический фильм$$, 'noun', 'masculine', 'not_applicable', false),
    (81, $$sculpture$$, $$скульптура$$, $$скульптура$$, 'noun', 'feminine', 'not_applicable', false),
    (82, $$series$$, $$сериал$$, $$сериал$$, 'noun', 'masculine', 'not_applicable', false),
    (83, $$show (theatre etc)$$, $$шоу$$, $$шоу$$, 'noun', 'neuter', 'not_applicable', false),
    (84, $$show, performance$$, $$спектакль$$, $$спектакль$$, 'noun', 'masculine', 'not_applicable', false),
    (85, $$skateboarding$$, $$скейтбординг$$, $$скейтбординг$$, 'noun', 'masculine', 'not_applicable', false),
    (86, $$skiing$$, $$катание на лыжах$$, $$катание на лыжах$$, 'noun', 'neuter', 'not_applicable', false),
    (87, $$socialising$$, $$общение$$, $$общение$$, 'noun', 'neuter', 'not_applicable', false),
    (88, $$sport$$, $$спорт$$, $$спорт$$, 'noun', 'masculine', 'not_applicable', false),
    (89, $$sports ground$$, $$спортивная площадка$$, $$спортивная площадка$$, 'noun', 'feminine', 'not_applicable', false),
    (90, $$sports hall$$, $$спортзал / спортивный комплекс$$, $$спортзал; спортивный комплекс$$, 'noun', 'masculine', 'not_applicable', false),
    (91, $$sporty$$, $$спортивный$$, $$спортивный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (92, $$spy film$$, $$шпионский фильм$$, $$шпионский фильм$$, 'noun', 'masculine', 'not_applicable', false),
    (93, $$squash$$, $$сквош$$, $$сквош$$, 'noun', 'masculine', 'not_applicable', false),
    (94, $$surfing$$, $$серфинг$$, $$серфинг$$, 'noun', 'masculine', 'not_applicable', false),
    (95, $$swimming$$, $$плавание$$, $$плавание$$, 'noun', 'neuter', 'not_applicable', false),
    (96, $$team$$, $$команда$$, $$команда$$, 'noun', 'feminine', 'not_applicable', false),
    (97, $$television (medium)$$, $$телевидение$$, $$телевидение$$, 'noun', 'neuter', 'not_applicable', false),
    (98, $$tennis$$, $$теннис$$, $$теннис$$, 'noun', 'masculine', 'not_applicable', false),
    (99, $$theme$$, $$тема$$, $$тема$$, 'noun', 'feminine', 'not_applicable', false),
    (100, $$thriller$$, $$триллер$$, $$триллер$$, 'noun', 'masculine', 'not_applicable', false),
    (101, $$tradition$$, $$традиция$$, $$традиция$$, 'noun', 'feminine', 'not_applicable', false),
    (102, $$traditional$$, $$традиционный$$, $$традиционный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (103, $$to adore$$, $$обожать$$, $$обожать$$, 'verb', 'not_applicable', 'imperfective', false),
    (104, $$to celebrate$$, $$отмечать / отметить$$, $$отмечать/отметить$$, 'verb', 'not_applicable', 'both', false),
    (105, $$to collect$$, $$собирать / собрать$$, $$собирать/собрать$$, 'verb', 'not_applicable', 'both', false),
    (106, $$to dance$$, $$танцевать$$, $$танцевать$$, 'verb', 'not_applicable', 'imperfective', false),
    (107, $$to do sport$$, $$заниматься спортом$$, $$заниматься спортом$$, 'verb', 'not_applicable', 'imperfective', true),
    (108, $$to get married$$, $$выходить / выйти замуж (f) / жениться / пожениться (m)$$, $$выходить/выйти замуж (f) / жениться/по- (m)$$, 'verb', 'not_applicable', 'both', true),
    (109, $$to socialise with$$, $$общаться с$$, $$общаться с$$, 'verb', 'not_applicable', 'imperfective', true),
    (110, $$to take a dog out for a walk$$, $$гулять с собакой$$, $$гулять с собакой$$, 'verb', 'not_applicable', 'imperfective', false),
    (111, $$toy$$, $$игрушка$$, $$игрушка$$, 'noun', 'feminine', 'not_applicable', false),
    (112, $$(TV) channel$$, $$(телевизионный) канал$$, $$(телевизионный) канал$$, 'noun', 'masculine', 'not_applicable', false),
    (113, $$video camera$$, $$камера$$, $$камера$$, 'noun', 'feminine', 'not_applicable', false),
    (114, $$video/computer game$$, $$видеоигра$$, $$видеоигра$$, 'noun', 'feminine', 'not_applicable', false),
    (115, $$violin$$, $$скрипка$$, $$скрипка$$, 'noun', 'feminine', 'not_applicable', false),
    (116, $$volleyball$$, $$волейбол$$, $$волейбол$$, 'noun', 'masculine', 'not_applicable', false),
    (117, $$windsurfing$$, $$виндсерфинг$$, $$виндсерфинг$$, 'noun', 'masculine', 'not_applicable', false)
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
      'cultural-life-foundation:item-' ||
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
    'identity_and_culture_cultural_life',
    'cultural_life',
    prepared_items.aspect,
    prepared_items.is_reflexive,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Identity and culture / Cultural life / Foundation tier',
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
  'Section 2: Topic-specific vocabulary / Identity and culture / Cultural life / Foundation tier',
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
