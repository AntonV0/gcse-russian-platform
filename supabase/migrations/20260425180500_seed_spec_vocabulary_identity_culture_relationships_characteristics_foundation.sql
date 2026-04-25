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
    'identity-and-culture-relations-relationships-personal-physical-characteristics',
    'Relations, relationships, personal and physical characteristics',
    'Spec-required topic-specific GCSE Russian vocabulary for identity and culture: what my friends and family are like.',
    'identity_and_culture',
    'identity_and_culture_family_and_relationships',
    'both',
    'spec_only',
    'specification',
    'single_column',
    true,
    320,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'section-2:identity-and-culture:what-my-friends-and-family-are-like:relations-relationships-personal-physical-characteristics'
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
    'Foundation tier vocabulary for relations, relationships, personal and physical characteristics.',
    'identity_and_culture',
    'identity_and_culture_family_and_relationships',
    'relations_relationships_personal_physical_characteristics',
    'foundation',
    'spec_only',
    'single_column',
    true,
    320,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Identity and culture / What my friends and family are like / Relations, relationships, personal and physical characteristics / Foundation tier',
    'section-2:identity-and-culture:what-my-friends-and-family-are-like:relations-relationships-personal-physical-characteristics:foundation:list'
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
    (1, $$age$$, $$возраст$$, $$возраст$$, 'noun', 'masculine', 'not_applicable', false),
    (2, $$alcohol$$, $$алкоголь$$, $$алкоголь$$, 'noun', 'masculine', 'not_applicable', false),
    (3, $$arm, hand$$, $$рука$$, $$рука$$, 'noun', 'feminine', 'not_applicable', false),
    (4, $$armchair$$, $$кресло$$, $$кресло$$, 'noun', 'neuter', 'not_applicable', false),
    (5, $$at home$$, $$дома$$, $$дома$$, 'adverb', 'not_applicable', 'not_applicable', false),
    (6, $$at my / our house$$, $$у меня / у нас дома$$, $$у меня /у нас дома$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (7, $$aunt$$, $$тётя$$, $$тётя$$, 'noun', 'feminine', 'not_applicable', false),
    (8, $$back$$, $$спина$$, $$спина$$, 'noun', 'feminine', 'not_applicable', false),
    (9, $$bald$$, $$лысый$$, $$лысый$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (10, $$bath$$, $$ванна$$, $$ванна$$, 'noun', 'feminine', 'not_applicable', false),
    (11, $$bathroom$$, $$ванная$$, $$ванная$$, 'noun', 'feminine', 'not_applicable', false),
    (12, $$beard$$, $$борода$$, $$борода$$, 'noun', 'feminine', 'not_applicable', false),
    (13, $$bearded$$, $$с бородой$$, $$с бородой$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (14, $$beautiful$$, $$красивый$$, $$красивый$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (15, $$bed (linen)$$, $$постель$$, $$постель$$, 'noun', 'feminine', 'not_applicable', false),
    (16, $$bed(stead)$$, $$кровать$$, $$кровать$$, 'noun', 'feminine', 'not_applicable', false),
    (17, $$bedroom$$, $$спальня$$, $$спальня$$, 'noun', 'feminine', 'not_applicable', false),
    (18, $$bedside cabinet$$, $$тумбочка$$, $$тумбочка$$, 'noun', 'feminine', 'not_applicable', false),
    (19, $$bird$$, $$птица$$, $$птица$$, 'noun', 'feminine', 'not_applicable', false),
    (20, $$birthday$$, $$день рождения$$, $$день рождения$$, 'noun', 'masculine', 'not_applicable', false),
    (21, $$birthplace$$, $$место рождения$$, $$место рождения$$, 'noun', 'neuter', 'not_applicable', false),
    (22, $$block (of flats)$$, $$дом$$, $$дом$$, 'noun', 'masculine', 'not_applicable', false),
    (23, $$blond/e$$, $$блондин / блондинка$$, $$блондин/ка$$, 'noun', 'common', 'not_applicable', false),
    (24, $$boy$$, $$мальчик$$, $$мальчик$$, 'noun', 'masculine', 'not_applicable', false),
    (25, $$brother$$, $$брат$$, $$брат$$, 'noun', 'masculine', 'not_applicable', false),
    (26, $$brunette$$, $$брюнет / брюнетка$$, $$брюнет/ка$$, 'noun', 'common', 'not_applicable', false),
    (27, $$brothers and sisters, siblings$$, $$братья и сёстры$$, $$братья и сёстры$$, 'noun', 'plural_only', 'not_applicable', false),
    (28, $$cat (f)$$, $$кошка$$, $$кошка$$, 'noun', 'feminine', 'not_applicable', false),
    (29, $$cat (m)$$, $$кот$$, $$кот$$, 'noun', 'masculine', 'not_applicable', false),
    (30, $$chair$$, $$стул$$, $$стул$$, 'noun', 'masculine', 'not_applicable', false),
    (31, $$character, personality$$, $$характер$$, $$характер$$, 'noun', 'masculine', 'not_applicable', false),
    (32, $$charming, nice$$, $$милый$$, $$милый$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (33, $$child$$, $$ребёнок$$, $$ребёнок$$, 'noun', 'masculine', 'not_applicable', false),
    (34, $$children$$, $$дети$$, $$дети$$, 'noun', 'plural_only', 'not_applicable', false),
    (35, $$comfortable (house, furniture)$$, $$удобный$$, $$удобный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (36, $$curly$$, $$кудрявый$$, $$кудрявый$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (37, $$curtains$$, $$занавески$$, $$занавески$$, 'noun', 'plural_only', 'not_applicable', false),
    (38, $$dacha, country cottage$$, $$дача$$, $$дача$$, 'noun', 'feminine', 'not_applicable', false),
    (39, $$daily routine$$, $$режим дня$$, $$режим дня$$, 'noun', 'masculine', 'not_applicable', false),
    (40, $$dad$$, $$папа$$, $$папа$$, 'noun', 'masculine', 'not_applicable', false),
    (41, $$date of birth$$, $$дата рождения$$, $$дата рождения$$, 'noun', 'feminine', 'not_applicable', false),
    (42, $$daughter$$, $$дочь$$, $$дочь$$, 'noun', 'feminine', 'not_applicable', false),
    (43, $$diet$$, $$диета$$, $$диета$$, 'noun', 'feminine', 'not_applicable', false),
    (44, $$dining room$$, $$столовая$$, $$столовая$$, 'noun', 'feminine', 'not_applicable', false),
    (45, $$dog$$, $$собака$$, $$собака$$, 'noun', 'feminine', 'not_applicable', false),
    (46, $$door$$, $$дверь$$, $$дверь$$, 'noun', 'feminine', 'not_applicable', false),
    (47, $$ear/s$$, $$ухо / уши$$, $$ухо/уши$$, 'noun', 'unknown', 'not_applicable', false),
    (48, $$energetic$$, $$энергичный$$, $$энергичный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (49, $$enthusiasm$$, $$энтузиазм$$, $$энтузиазм$$, 'noun', 'masculine', 'not_applicable', false),
    (50, $$eyes$$, $$глаза$$, $$глаза$$, 'noun', 'plural_only', 'not_applicable', false),
    (51, $$face$$, $$лицо$$, $$лицо$$, 'noun', 'neuter', 'not_applicable', false),
    (52, $$family$$, $$семья$$, $$семья$$, 'noun', 'feminine', 'not_applicable', false),
    (53, $$father$$, $$отец$$, $$отец$$, 'noun', 'masculine', 'not_applicable', false),
    (54, $$first name$$, $$имя$$, $$имя$$, 'noun', 'neuter', 'not_applicable', false),
    (55, $$flat; apartment$$, $$квартира$$, $$квартира$$, 'noun', 'feminine', 'not_applicable', false),
    (56, $$friend (f)$$, $$подруга$$, $$подруга$$, 'noun', 'feminine', 'not_applicable', false),
    (57, $$friend (m)$$, $$друг$$, $$друг$$, 'noun', 'masculine', 'not_applicable', false),
    (58, $$friends$$, $$друзья$$, $$друзья$$, 'noun', 'plural_only', 'not_applicable', false),
    (59, $$furniture$$, $$мебель$$, $$мебель$$, 'noun', 'feminine', 'not_applicable', false),
    (60, $$garage$$, $$гараж$$, $$гараж$$, 'noun', 'masculine', 'not_applicable', false),
    (61, $$garden$$, $$сад$$, $$сад$$, 'noun', 'masculine', 'not_applicable', false),
    (62, $$girl (older)$$, $$девушка$$, $$девушка$$, 'noun', 'feminine', 'not_applicable', false),
    (63, $$girl (young)$$, $$девочка$$, $$девочка$$, 'noun', 'feminine', 'not_applicable', false),
    (64, $$glasses$$, $$очки$$, $$очки$$, 'noun', 'plural_only', 'not_applicable', false),
    (65, $$goldfish$$, $$золотая рыбка$$, $$золотая рыбка$$, 'noun', 'feminine', 'not_applicable', false),
    (66, $$grandchild (f)$$, $$внучка$$, $$внучка$$, 'noun', 'feminine', 'not_applicable', false),
    (67, $$grandchild (m)$$, $$внук$$, $$внук$$, 'noun', 'masculine', 'not_applicable', false),
    (68, $$grandfather, grandad$$, $$дедушка$$, $$дедушка$$, 'noun', 'masculine', 'not_applicable', false),
    (69, $$grandmother, grandma, granny$$, $$бабушка$$, $$бабушка$$, 'noun', 'feminine', 'not_applicable', false),
    (70, $$grandparents$$, $$бабушка и дедушка$$, $$бабушка и дедушка$$, 'noun', 'plural_only', 'not_applicable', false),
    (71, $$guest$$, $$гость$$, $$гость$$, 'noun', 'masculine', 'not_applicable', false),
    (72, $$guinea pig$$, $$морская свинка$$, $$морская свинка$$, 'noun', 'feminine', 'not_applicable', false),
    (73, $$hair$$, $$волосы$$, $$волосы$$, 'noun', 'plural_only', 'not_applicable', false),
    (74, $$hamster$$, $$хомяк$$, $$хомяк$$, 'noun', 'masculine', 'not_applicable', false),
    (75, $$head$$, $$голова$$, $$голова$$, 'noun', 'feminine', 'not_applicable', false),
    (76, $$health$$, $$здоровье$$, $$здоровье$$, 'noun', 'neuter', 'not_applicable', false),
    (77, $$horse$$, $$лошадь$$, $$лошадь$$, 'noun', 'feminine', 'not_applicable', false),
    (78, $$house$$, $$дом$$, $$дом$$, 'noun', 'masculine', 'not_applicable', false),
    (79, $$house (small)$$, $$домик$$, $$домик$$, 'noun', 'masculine', 'not_applicable', false),
    (80, $$ideal$$, $$идеальный$$, $$идеальный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (81, $$identity$$, $$личность$$, $$личность$$, 'noun', 'feminine', 'not_applicable', false),
    (82, $$intelligent, clever$$, $$умный$$, $$умный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (83, $$kind$$, $$добрый$$, $$добрый$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (84, $$kitchen$$, $$кухня$$, $$кухня$$, 'noun', 'feminine', 'not_applicable', false),
    (85, $$lamp, light$$, $$лампа$$, $$лампа$$, 'noun', 'feminine', 'not_applicable', false),
    (86, $$lazy$$, $$ленивый$$, $$ленивый$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (87, $$leg, foot$$, $$нога$$, $$нога$$, 'noun', 'feminine', 'not_applicable', false),
    (88, $$life$$, $$жизнь$$, $$жизнь$$, 'noun', 'feminine', 'not_applicable', false),
    (89, $$live, lively, alive$$, $$живой$$, $$живой$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (90, $$living room, front room$$, $$гостиная$$, $$гостиная$$, 'noun', 'feminine', 'not_applicable', false),
    (91, $$man$$, $$мужчина$$, $$мужчина$$, 'noun', 'masculine', 'not_applicable', false),
    (92, $$member of the family$$, $$член семьи$$, $$член семьи$$, 'noun', 'masculine', 'not_applicable', false),
    (93, $$mother$$, $$мать$$, $$мать$$, 'noun', 'feminine', 'not_applicable', false),
    (94, $$mouse$$, $$мышь$$, $$мышь$$, 'noun', 'feminine', 'not_applicable', false),
    (95, $$moustache$$, $$усы$$, $$усы$$, 'noun', 'plural_only', 'not_applicable', false),
    (96, $$mouth$$, $$рот$$, $$рот$$, 'noun', 'masculine', 'not_applicable', false),
    (97, $$mum$$, $$мама$$, $$мама$$, 'noun', 'feminine', 'not_applicable', false),
    (98, $$neck$$, $$шея$$, $$шея$$, 'noun', 'feminine', 'not_applicable', false),
    (99, $$nice, pleasant$$, $$приятный$$, $$приятный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (100, $$normal$$, $$обычный$$, $$обычный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (101, $$nose$$, $$нос$$, $$нос$$, 'noun', 'masculine', 'not_applicable', false),
    (102, $$old$$, $$старый$$, $$старый$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (103, $$optimist$$, $$оптимист$$, $$оптимист$$, 'noun', 'masculine', 'not_applicable', false),
    (104, $$organiser$$, $$организатор$$, $$организатор$$, 'noun', 'masculine', 'not_applicable', false),
    (105, $$parents$$, $$родители$$, $$родители$$, 'noun', 'plural_only', 'not_applicable', false),
    (106, $$party$$, $$вечеринка$$, $$вечеринка$$, 'noun', 'feminine', 'not_applicable', false),
    (107, $$penfriend (f)$$, $$подруга по переписке$$, $$подруга по переписке$$, 'noun', 'feminine', 'not_applicable', false),
    (108, $$penfriend (m)$$, $$друг по переписке$$, $$друг по переписке$$, 'noun', 'masculine', 'not_applicable', false),
    (109, $$people$$, $$люди$$, $$люди$$, 'noun', 'plural_only', 'not_applicable', false),
    (110, $$person$$, $$человек$$, $$человек$$, 'noun', 'masculine', 'not_applicable', false),
    (111, $$personal$$, $$персональный$$, $$персональный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (112, $$pessimist$$, $$пессимист$$, $$пессимист$$, 'noun', 'masculine', 'not_applicable', false),
    (113, $$pet$$, $$домашнее животное$$, $$домашнее животное$$, 'noun', 'neuter', 'not_applicable', false),
    (114, $$picture$$, $$картина$$, $$картина$$, 'noun', 'feminine', 'not_applicable', false),
    (115, $$plant$$, $$растение$$, $$растение$$, 'noun', 'neuter', 'not_applicable', false),
    (116, $$present; gift$$, $$подарок$$, $$подарок$$, 'noun', 'masculine', 'not_applicable', false),
    (117, $$public holiday$$, $$праздник$$, $$праздник$$, 'noun', 'masculine', 'not_applicable', false),
    (118, $$rabbit$$, $$кролик$$, $$кролик$$, 'noun', 'masculine', 'not_applicable', false),
    (119, $$refrigerator$$, $$холодильник$$, $$холодильник$$, 'noun', 'masculine', 'not_applicable', false),
    (120, $$relationship$$, $$отношения$$, $$отношения (pl.)$$, 'noun', 'plural_only', 'not_applicable', false),
    (121, $$religion$$, $$религия$$, $$религия$$, 'noun', 'feminine', 'not_applicable', false),
    (122, $$sauna$$, $$сауна$$, $$сауна$$, 'noun', 'feminine', 'not_applicable', false),
    (123, $$serious$$, $$серьёзный$$, $$серьёзный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (124, $$Shrove Tuesday$$, $$Масленица$$, $$масленица$$, 'noun', 'feminine', 'not_applicable', false),
    (125, $$sister$$, $$сестра$$, $$сестра$$, 'noun', 'feminine', 'not_applicable', false),
    (126, $$slim$$, $$тонкий$$, $$тонкий$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (127, $$snake$$, $$змея$$, $$змея$$, 'noun', 'feminine', 'not_applicable', false),
    (128, $$sofa; settee$$, $$диван$$, $$диван$$, 'noun', 'masculine', 'not_applicable', false),
    (129, $$son$$, $$сын$$, $$сын$$, 'noun', 'masculine', 'not_applicable', false),
    (130, $$staying as a guest$$, $$в гостях$$, $$в гостях$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (131, $$stomach$$, $$живот$$, $$живот$$, 'noun', 'masculine', 'not_applicable', false),
    (132, $$straight (hair)$$, $$прямые (волосы)$$, $$прямые (волосы)$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (133, $$study (room); office$$, $$кабинет$$, $$кабинет$$, 'noun', 'masculine', 'not_applicable', false),
    (134, $$surname$$, $$фамилия$$, $$фамилия$$, 'noun', 'feminine', 'not_applicable', false),
    (135, $$table$$, $$стол$$, $$стол$$, 'noun', 'masculine', 'not_applicable', false),
    (136, $$talent$$, $$талант$$, $$талант$$, 'noun', 'masculine', 'not_applicable', false),
    (137, $$talented$$, $$талантливый$$, $$талантливый$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (138, $$teenager$$, $$тинейджер$$, $$тинейджер$$, 'noun', 'masculine', 'not_applicable', false),
    (139, $$terrace$$, $$терраса$$, $$терраса$$, 'noun', 'feminine', 'not_applicable', false),
    (140, $$thin$$, $$худой$$, $$худой$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (141, $$throat$$, $$горло$$, $$горло$$, 'noun', 'neuter', 'not_applicable', false),
    (142, $$to be called (person)$$, $$звать$$, $$звать$$, 'verb', 'not_applicable', 'imperfective', false),
    (143, $$to be called (place)$$, $$называться$$, $$называться$$, 'verb', 'not_applicable', 'imperfective', true),
    (144, $$to be healthy, fit$$, $$быть в форме$$, $$быть в форме$$, 'verb', 'not_applicable', 'imperfective', false),
    (145, $$to look (e.g. angry/happy etc)$$, $$выглядеть$$, $$выглядеть$$, 'verb', 'not_applicable', 'imperfective', false),
    (146, $$to seem$$, $$казаться / показаться$$, $$казаться/по-$$, 'verb', 'not_applicable', 'both', true),
    (147, $$to stay as a guest$$, $$гостить$$, $$гостить$$, 'verb', 'not_applicable', 'imperfective', false),
    (148, $$tooth$$, $$зуб$$, $$зуб$$, 'noun', 'masculine', 'not_applicable', false),
    (149, $$tropical fish$$, $$тропические рыбки$$, $$тропические рыбки$$, 'noun', 'plural_only', 'not_applicable', false),
    (150, $$ugly$$, $$некрасивый$$, $$некрасивый$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (151, $$uncle$$, $$дядя$$, $$дядя$$, 'noun', 'masculine', 'not_applicable', false),
    (152, $$visit$$, $$визит$$, $$визит$$, 'noun', 'masculine', 'not_applicable', false),
    (153, $$wife$$, $$жена$$, $$жена$$, 'noun', 'feminine', 'not_applicable', false),
    (154, $$woman$$, $$женщина$$, $$женщина$$, 'noun', 'feminine', 'not_applicable', false),
    (155, $$younger$$, $$моложе$$, $$моложе$$, 'adverb', 'not_applicable', 'not_applicable', false),
    (156, $$youth$$, $$молодость$$, $$молодость$$, 'noun', 'feminine', 'not_applicable', false)
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
      'what-my-friends-and-family-are-like-relationships-characteristics-foundation:item-' ||
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
    'identity_and_culture_family_and_relationships',
    'relations_relationships_personal_physical_characteristics',
    prepared_items.aspect,
    prepared_items.is_reflexive,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Identity and culture / What my friends and family are like / Relations, relationships, personal and physical characteristics / Foundation tier',
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
  'Section 2: Topic-specific vocabulary / Identity and culture / What my friends and family are like / Relations, relationships, personal and physical characteristics / Foundation tier',
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
