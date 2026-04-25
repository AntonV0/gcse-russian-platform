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
    'local-area-holiday-and-travel',
    'Local area, holiday and travel',
    'Spec-required topic-specific GCSE Russian vocabulary for local area, holiday and travel.',
    'local_area_holiday_travel',
    'local_area_holiday_travel',
    'both',
    'spec_only',
    'specification',
    'single_column',
    true,
    400,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'section-2:local-area-holiday-and-travel'
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
    'Higher tier vocabulary for local area, holiday and travel. Higher learners also need the Foundation list for this topic.',
    'local_area_holiday_travel',
    'local_area_holiday_travel',
    'local_area_holiday_travel',
    'higher',
    'spec_only',
    'single_column',
    true,
    401,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Local area, holiday and travel / Higher tier',
    'section-2:local-area-holiday-and-travel:higher:list'
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
    (1, $$accident$$, $$авария$$, $$авария$$, 'noun', 'feminine', 'not_applicable', false),
    (2, $$to overtake$$, $$обгонять / обогнать$$, $$обгонять/обогнать$$, 'verb', 'not_applicable', 'both', false),
    (3, $$to validate a ticket (e.g. train, tram)$$, $$компостировать / закомпостировать билет$$, $$компостировать/за- билет$$, 'verb', 'not_applicable', 'both', false),
    (4, $$abroad$$, $$за границей / за рубежом$$, $$за границей; за рубежом$$, 'adverb', 'not_applicable', 'not_applicable', false),
    (5, $$accommodation$$, $$жильё$$, $$жильё$$, 'noun', 'neuter', 'not_applicable', false),
    (6, $$adolescent$$, $$подросток$$, $$подросток$$, 'noun', 'masculine', 'not_applicable', false),
    (7, $$adult$$, $$взрослый$$, $$взрослый$$, 'noun', 'masculine', 'not_applicable', false),
    (8, $$agricultural$$, $$сельскохозяйственный$$, $$сельскохозяйственный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (9, $$air conditioning/air-con$$, $$кондиционер$$, $$кондиционер$$, 'noun', 'masculine', 'not_applicable', false),
    (10, $$airline$$, $$авиакомпания$$, $$авиакомпания$$, 'noun', 'feminine', 'not_applicable', false),
    (11, $$ancient$$, $$древний$$, $$древний$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (12, $$area$$, $$площадь$$, $$площадь f$$, 'noun', 'feminine', 'not_applicable', false),
    (13, $$arrival$$, $$прибытие$$, $$прибытие$$, 'noun', 'neuter', 'not_applicable', false),
    (14, $$ATM$$, $$банкомат$$, $$банкомат$$, 'noun', 'masculine', 'not_applicable', false),
    (15, $$baker’s shop$$, $$булочная$$, $$булочная$$, 'noun', 'feminine', 'not_applicable', false),
    (16, $$bank card$$, $$банковская карточка$$, $$банковская карточка$$, 'noun', 'feminine', 'not_applicable', false),
    (17, $$basement$$, $$подвал$$, $$подвал$$, 'noun', 'masculine', 'not_applicable', false),
    (18, $$border$$, $$граница$$, $$граница$$, 'noun', 'feminine', 'not_applicable', false),
    (19, $$calm/peaceful$$, $$спокойный$$, $$спокойный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (20, $$canal$$, $$канал$$, $$канал$$, 'noun', 'masculine', 'not_applicable', false),
    (21, $$car park$$, $$стоянка / парковка$$, $$стоянка, парковка$$, 'noun', 'feminine', 'not_applicable', false),
    (22, $$castle$$, $$замок$$, $$зáмок$$, 'noun', 'masculine', 'not_applicable', false),
    (23, $$change$$, $$сдача$$, $$сдача$$, 'noun', 'feminine', 'not_applicable', false),
    (24, $$church (Orthodox)$$, $$храм$$, $$храм$$, 'noun', 'masculine', 'not_applicable', false),
    (25, $$comfortable$$, $$удобный$$, $$удобный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (26, $$commercial$$, $$коммерческий$$, $$коммерческий$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (27, $$compartment (train)$$, $$купе$$, $$купе$$, 'noun', 'neuter', 'not_applicable', false),
    (28, $$concrete$$, $$бетон / бетонный$$, $$бетон(ный)$$, 'noun', 'unknown', 'not_applicable', false),
    (29, $$conditions$$, $$условия$$, $$условия$$, 'noun', 'plural_only', 'not_applicable', false),
    (30, $$cooker$$, $$плита$$, $$плита$$, 'noun', 'feminine', 'not_applicable', false),
    (31, $$corner$$, $$угол$$, $$угол$$, 'noun', 'masculine', 'not_applicable', false),
    (32, $$crossroads$$, $$перекрёсток$$, $$перекрёсток$$, 'noun', 'masculine', 'not_applicable', false),
    (33, $$deathly$$, $$мёртвый$$, $$мёртвый$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (34, $$departure$$, $$отправление$$, $$отправление$$, 'noun', 'neuter', 'not_applicable', false),
    (35, $$diesel (fuel)$$, $$дизельное топливо$$, $$дизельное топливо$$, 'noun', 'neuter', 'not_applicable', false),
    (36, $$direction$$, $$направление$$, $$направление$$, 'noun', 'neuter', 'not_applicable', false),
    (37, $$double room$$, $$номер на двоих$$, $$номер на двоих$$, 'noun', 'masculine', 'not_applicable', false),
    (38, $$driver$$, $$водитель$$, $$водитель$$, 'noun', 'masculine', 'not_applicable', false),
    (39, $$driver (professional)$$, $$шофёр$$, $$шофёр$$, 'noun', 'masculine', 'not_applicable', false),
    (40, $$driving licence$$, $$водительские права$$, $$водительские права$$, 'noun', 'plural_only', 'not_applicable', false),
    (41, $$entertainment$$, $$развлечение$$, $$развлечение$$, 'noun', 'neuter', 'not_applicable', false),
    (42, $$event$$, $$событие$$, $$событие$$, 'noun', 'neuter', 'not_applicable', false),
    (43, $$exhibition$$, $$выставка$$, $$выставка$$, 'noun', 'feminine', 'not_applicable', false),
    (44, $$ferry$$, $$паром$$, $$паром$$, 'noun', 'masculine', 'not_applicable', false),
    (45, $$fireworks$$, $$фейерверк$$, $$фейерверк$$, 'noun', 'masculine', 'not_applicable', false),
    (46, $$flight$$, $$полёт$$, $$полёт$$, 'noun', 'masculine', 'not_applicable', false),
    (47, $$forbidden to$$, $$запрещается$$, $$запрещается$$, 'phrase', 'not_applicable', 'not_applicable', true),
    (48, $$foreigner$$, $$иностранец$$, $$иностранец$$, 'noun', 'masculine', 'not_applicable', false),
    (49, $$fortress$$, $$крепость$$, $$крепость$$, 'noun', 'feminine', 'not_applicable', false),
    (50, $$free (available, vacant)$$, $$свободный$$, $$свободный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (51, $$full (hotel etc)$$, $$нет мест$$, $$нет мест$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (52, $$games room$$, $$игровая комната$$, $$игровая комната$$, 'noun', 'feminine', 'not_applicable', false),
    (53, $$garage, service station, petrol station$$, $$заправочная станция$$, $$заправочная станция$$, 'noun', 'feminine', 'not_applicable', false),
    (54, $$heating$$, $$отопление$$, $$отопление$$, 'noun', 'neuter', 'not_applicable', false),
    (55, $$helicopter$$, $$вертолёт$$, $$вертолёт$$, 'noun', 'masculine', 'not_applicable', false),
    (56, $$hill$$, $$холм$$, $$холм$$, 'noun', 'masculine', 'not_applicable', false),
    (57, $$hire of/hiring$$, $$прокат$$, $$прокат$$, 'noun', 'masculine', 'not_applicable', false),
    (58, $$hospitality$$, $$гостеприимство$$, $$гостеприимство$$, 'noun', 'neuter', 'not_applicable', false),
    (59, $$in advance$$, $$заранее$$, $$заранее$$, 'adverb', 'not_applicable', 'not_applicable', false),
    (60, $$included$$, $$включено$$, $$включено$$, 'adverb', 'not_applicable', 'not_applicable', false),
    (61, $$industrial$$, $$промышленный$$, $$промышленный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (62, $$industry$$, $$промышленность$$, $$промышленность$$, 'noun', 'feminine', 'not_applicable', false),
    (63, $$inhabitant$$, $$житель$$, $$житель m$$, 'noun', 'masculine', 'not_applicable', false),
    (64, $$inside$$, $$внутри$$, $$внутри$$, 'adverb', 'not_applicable', 'not_applicable', false),
    (65, $$landscape$$, $$пейзаж$$, $$пейзаж$$, 'noun', 'masculine', 'not_applicable', false),
    (66, $$launderette$$, $$прачечная$$, $$прачечная$$, 'noun', 'feminine', 'not_applicable', false),
    (67, $$left luggage office$$, $$камера хранения$$, $$камера хранения$$, 'noun', 'feminine', 'not_applicable', false),
    (68, $$line (underground)$$, $$линия$$, $$линия$$, 'noun', 'feminine', 'not_applicable', false),
    (69, $$list$$, $$список$$, $$список$$, 'noun', 'masculine', 'not_applicable', false),
    (70, $$litter$$, $$мусор$$, $$мусор$$, 'noun', 'masculine', 'not_applicable', false),
    (71, $$local$$, $$местный$$, $$местный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (72, $$lorry$$, $$грузовик$$, $$грузовик$$, 'noun', 'masculine', 'not_applicable', false),
    (73, $$lost property office$$, $$бюро находок$$, $$бюро находок$$, 'noun', 'neuter', 'not_applicable', false),
    (74, $$luxurious$$, $$роскошный$$, $$роскошный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (75, $$mosque$$, $$мечеть$$, $$мечеть$$, 'noun', 'feminine', 'not_applicable', false),
    (76, $$nature$$, $$природа$$, $$природа$$, 'noun', 'feminine', 'not_applicable', false),
    (77, $$no parking$$, $$парковка запрещена$$, $$парковка запрещена$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (78, $$noise$$, $$шум$$, $$шум$$, 'noun', 'masculine', 'not_applicable', false),
    (79, $$open-air pool$$, $$бассейн на открытом воздухе$$, $$бассейн на открытом воздухе$$, 'noun', 'masculine', 'not_applicable', false),
    (80, $$outside$$, $$на улице$$, $$на улице$$, 'adverb', 'not_applicable', 'not_applicable', false),
    (81, $$outside/in the open air$$, $$на свежем воздухе$$, $$на свежем воздухе$$, 'adverb', 'not_applicable', 'not_applicable', false),
    (82, $$package holiday$$, $$путёвка$$, $$путёвка$$, 'noun', 'feminine', 'not_applicable', false),
    (83, $$park$$, $$парк$$, $$парк$$, 'noun', 'masculine', 'not_applicable', false),
    (84, $$pavement$$, $$тротуар$$, $$тротуар$$, 'noun', 'masculine', 'not_applicable', false),
    (85, $$pedestrian$$, $$пешеход$$, $$пешеход$$, 'noun', 'masculine', 'not_applicable', false),
    (86, $$pedestrian area$$, $$пешеходная зона$$, $$пешеходная зона$$, 'noun', 'feminine', 'not_applicable', false),
    (87, $$pedestrian crossing$$, $$переход$$, $$переход$$, 'noun', 'masculine', 'not_applicable', false),
    (88, $$picturesque$$, $$живописный$$, $$живописный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (89, $$pillow$$, $$подушка$$, $$подушка$$, 'noun', 'feminine', 'not_applicable', false),
    (90, $$playground$$, $$детская площадка$$, $$детская площадка$$, 'noun', 'feminine', 'not_applicable', false),
    (91, $$police station$$, $$полицейский участок$$, $$полицейский участок$$, 'noun', 'masculine', 'not_applicable', false),
    (92, $$police officer$$, $$полицейский / милиционер$$, $$полицейский; милиционер$$, 'noun', 'masculine', 'not_applicable', false),
    (93, $$procession$$, $$процессия$$, $$процессия$$, 'noun', 'feminine', 'not_applicable', false),
    (94, $$population$$, $$население$$, $$население$$, 'noun', 'neuter', 'not_applicable', false),
    (95, $$receipt$$, $$квитанция$$, $$квитанция$$, 'noun', 'feminine', 'not_applicable', false),
    (96, $$reception$$, $$регистрация$$, $$регистрация$$, 'noun', 'feminine', 'not_applicable', false),
    (97, $$receptionist$$, $$администратор гостиницы$$, $$администратор гостиницы$$, 'noun', 'masculine', 'not_applicable', false),
    (98, $$reduction$$, $$скидка$$, $$скидка$$, 'noun', 'feminine', 'not_applicable', false),
    (99, $$registration/booking in$$, $$регистрация$$, $$регистрация$$, 'noun', 'feminine', 'not_applicable', false),
    (100, $$route$$, $$маршрут$$, $$маршрут$$, 'noun', 'masculine', 'not_applicable', false),
    (101, $$rush hour$$, $$час пик$$, $$час пик$$, 'noun', 'masculine', 'not_applicable', false),
    (102, $$savings bank$$, $$сберегательный банк$$, $$сберегательный банк$$, 'noun', 'masculine', 'not_applicable', false),
    (103, $$seat belt$$, $$ремень безопасности$$, $$ремень безопасности$$, 'noun', 'masculine', 'not_applicable', false),
    (104, $$ship$$, $$корабль$$, $$корабль$$, 'noun', 'masculine', 'not_applicable', false),
    (105, $$sign$$, $$знак$$, $$знак$$, 'noun', 'masculine', 'not_applicable', false),
    (106, $$silence$$, $$тишина$$, $$тишина$$, 'noun', 'feminine', 'not_applicable', false),
    (107, $$single room$$, $$номер на одного$$, $$номер на одного$$, 'noun', 'masculine', 'not_applicable', false),
    (108, $$situated$$, $$расположенный$$, $$расположенный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (109, $$ski resort$$, $$лыжный курорт$$, $$лыжный курорт$$, 'noun', 'masculine', 'not_applicable', false),
    (110, $$skiing$$, $$катание на лыжах$$, $$катание на лыжах$$, 'noun', 'neuter', 'not_applicable', false),
    (111, $$sleeping bag$$, $$спальный мешок$$, $$спальный мешок$$, 'noun', 'masculine', 'not_applicable', false),
    (112, $$sleeping car (in a train)$$, $$спальный вагон$$, $$спальный вагон$$, 'noun', 'masculine', 'not_applicable', false),
    (113, $$soap$$, $$мыло$$, $$мыло$$, 'noun', 'neuter', 'not_applicable', false),
    (114, $$speed$$, $$скорость$$, $$скорость$$, 'noun', 'feminine', 'not_applicable', false),
    (115, $$speed limit$$, $$ограничение скорости$$, $$ограничение скорости$$, 'noun', 'neuter', 'not_applicable', false),
    (116, $$star$$, $$звезда$$, $$звезда$$, 'noun', 'feminine', 'not_applicable', false),
    (117, $$summer camp$$, $$летний лагерь$$, $$летний лагерь$$, 'noun', 'masculine', 'not_applicable', false),
    (118, $$ticket inspector$$, $$контролёр$$, $$контролёр$$, 'noun', 'masculine', 'not_applicable', false),
    (119, $$timetable$$, $$расписание$$, $$расписание$$, 'noun', 'neuter', 'not_applicable', false),
    (120, $$to add$$, $$добавлять / добавить$$, $$добавлять/добавить$$, 'verb', 'not_applicable', 'both', false),
    (121, $$to enjoy$$, $$наслаждаться / насладиться$$, $$наслаждаться/насладиться$$, 'verb', 'not_applicable', 'both', true),
    (122, $$to have time to$$, $$успевать / успеть$$, $$успевать/успеть$$, 'verb', 'not_applicable', 'both', false),
    (123, $$to pack (cases)$$, $$упаковывать / упаковать$$, $$упаковывать/упаковать$$, 'verb', 'not_applicable', 'both', false),
    (124, $$to represent$$, $$представлять / представить$$, $$представлять/представить$$, 'verb', 'not_applicable', 'both', false),
    (125, $$to send (set off)$$, $$отправлять / отправляться / отправить / отправиться$$, $$отправлять(ся)/отправить(ся)$$, 'verb', 'not_applicable', 'both', true),
    (126, $$to spend the night$$, $$ночевать / переночевать$$, $$ночевать/пере-$$, 'verb', 'not_applicable', 'both', false),
    (127, $$to unpack (cases)$$, $$распаковывать / распаковать$$, $$распаковывать/распаковать$$, 'verb', 'not_applicable', 'both', false),
    (128, $$toilet paper$$, $$туалетная бумага$$, $$туалетная бумага$$, 'noun', 'feminine', 'not_applicable', false),
    (129, $$toothbrush$$, $$зубная щётка$$, $$зубная щётка$$, 'noun', 'feminine', 'not_applicable', false),
    (130, $$toothpaste$$, $$зубная паста$$, $$зубная паста$$, 'noun', 'feminine', 'not_applicable', false),
    (131, $$tower$$, $$башня$$, $$башня$$, 'noun', 'feminine', 'not_applicable', false),
    (132, $$trade$$, $$торговля$$, $$торговля$$, 'noun', 'feminine', 'not_applicable', false),
    (133, $$traffic$$, $$движение$$, $$движение$$, 'noun', 'neuter', 'not_applicable', false),
    (134, $$traffic jam$$, $$пробка$$, $$пробка$$, 'noun', 'feminine', 'not_applicable', false),
    (135, $$traffic lights$$, $$светофор$$, $$светофор$$, 'noun', 'masculine', 'not_applicable', false),
    (136, $$travel$$, $$путешествие$$, $$путешествие$$, 'noun', 'neuter', 'not_applicable', false),
    (137, $$traveller$$, $$путешественник$$, $$путешественник$$, 'noun', 'masculine', 'not_applicable', false),
    (138, $$twin-bedded room$$, $$номер с двумя кроватями$$, $$номер с двумя кроватями$$, 'noun', 'masculine', 'not_applicable', false),
    (139, $$waiting room$$, $$зал ожидания$$, $$зал ожидания$$, 'noun', 'masculine', 'not_applicable', false),
    (140, $$walk, stroll$$, $$прогулка$$, $$прогулка$$, 'noun', 'feminine', 'not_applicable', false),
    (141, $$wash basin$$, $$умывальник$$, $$умывальник$$, 'noun', 'masculine', 'not_applicable', false),
    (142, $$winter holiday$$, $$зимний отдых$$, $$зимний отдых$$, 'noun', 'masculine', 'not_applicable', false)
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
      'local-area-holiday-and-travel-higher:item-' ||
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
    'local_area_holiday_travel',
    'local_area_holiday_travel',
    'local_area_holiday_travel',
    prepared_items.aspect,
    prepared_items.is_reflexive,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Local area, holiday and travel / Higher tier',
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
  'Section 2: Topic-specific vocabulary / Local area, holiday and travel / Higher tier',
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
