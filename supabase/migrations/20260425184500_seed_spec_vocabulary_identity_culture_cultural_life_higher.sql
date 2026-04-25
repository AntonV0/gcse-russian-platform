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
    'higher',
    'Higher tier',
    'Higher tier vocabulary for cultural life. Higher learners also need the Foundation list for this topic.',
    'identity_and_culture',
    'identity_and_culture_cultural_life',
    'cultural_life',
    'higher',
    'spec_only',
    'single_column',
    true,
    331,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Identity and culture / Cultural life / Higher tier',
    'section-2:identity-and-culture:cultural-life:higher:list'
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
    (1, $$adventure film$$, $$приключенческий фильм$$, $$приключенческий фильм$$, 'noun', 'masculine', 'not_applicable', false),
    (2, $$amusement$$, $$развлечение$$, $$развлечение$$, 'noun', 'neuter', 'not_applicable', false),
    (3, $$any (sort of)$$, $$любой$$, $$любой$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (4, $$audience$$, $$аудитория$$, $$аудитория$$, 'noun', 'feminine', 'not_applicable', false),
    (5, $$author$$, $$автор$$, $$автор$$, 'noun', 'masculine', 'not_applicable', false),
    (6, $$boat$$, $$лодка$$, $$лодка$$, 'noun', 'feminine', 'not_applicable', false),
    (7, $$bowling (tenpin)$$, $$боулинг$$, $$боулинг$$, 'noun', 'masculine', 'not_applicable', false),
    (8, $$budget$$, $$бюджет$$, $$бюджет$$, 'noun', 'masculine', 'not_applicable', false),
    (9, $$ceremony$$, $$церемония$$, $$церемония$$, 'noun', 'feminine', 'not_applicable', false),
    (10, $$Christmas tree$$, $$ёлка$$, $$ёлка$$, 'noun', 'feminine', 'not_applicable', false),
    (11, $$comedy$$, $$комедия$$, $$комедия$$, 'noun', 'feminine', 'not_applicable', false),
    (12, $$competition$$, $$соревнование / конкурс$$, $$соревнование; конкурс$$, 'noun', 'unknown', 'not_applicable', false),
    (13, $$drama (TV etc)$$, $$драма$$, $$драма$$, 'noun', 'feminine', 'not_applicable', false),
    (14, $$earphones$$, $$наушники$$, $$наушники$$, 'noun', 'plural_only', 'not_applicable', false),
    (15, $$entertainment$$, $$развлечение$$, $$развлечение$$, 'noun', 'neuter', 'not_applicable', false),
    (16, $$extreme sports$$, $$экстремальные виды спорта$$, $$экстремальные виды спорта$$, 'noun', 'plural_only', 'not_applicable', false),
    (17, $$fantasy (literature, film)$$, $$фантастика$$, $$фантастика$$, 'noun', 'feminine', 'not_applicable', false),
    (18, $$fencing$$, $$фехтование$$, $$фехтование$$, 'noun', 'neuter', 'not_applicable', false),
    (19, $$figure skating$$, $$фигурное катание$$, $$фигурное катание$$, 'noun', 'neuter', 'not_applicable', false),
    (20, $$genre$$, $$жанр$$, $$жанр$$, 'noun', 'masculine', 'not_applicable', false),
    (21, $$goal$$, $$гол$$, $$гол$$, 'noun', 'masculine', 'not_applicable', false),
    (22, $$horror film$$, $$фильм ужасов$$, $$фильм ужасов$$, 'noun', 'masculine', 'not_applicable', false),
    (23, $$knowledge$$, $$знание$$, $$знание$$, 'noun', 'neuter', 'not_applicable', false),
    (24, $$league$$, $$лига$$, $$лига$$, 'noun', 'feminine', 'not_applicable', false),
    (25, $$leisure$$, $$досуг$$, $$досуг$$, 'noun', 'masculine', 'not_applicable', false),
    (26, $$melody$$, $$мелодия$$, $$мелодия$$, 'noun', 'feminine', 'not_applicable', false),
    (27, $$mountain bike$$, $$горный велосипед$$, $$горный велосипед$$, 'noun', 'masculine', 'not_applicable', false),
    (28, $$mountaineering$$, $$альпинизм$$, $$альпинизм$$, 'noun', 'masculine', 'not_applicable', false),
    (29, $$play (theatre)$$, $$пьеса$$, $$пьеса$$, 'noun', 'feminine', 'not_applicable', false),
    (30, $$pleasure$$, $$удовольствие$$, $$удовольствие$$, 'noun', 'neuter', 'not_applicable', false),
    (31, $$plot$$, $$сюжет$$, $$сюжет$$, 'noun', 'masculine', 'not_applicable', false),
    (32, $$pocket money$$, $$карманные деньги$$, $$карманные деньги$$, 'noun', 'plural_only', 'not_applicable', false),
    (33, $$poet$$, $$поэт$$, $$поэт$$, 'noun', 'masculine', 'not_applicable', false),
    (34, $$poetry$$, $$поэзия$$, $$поэзия$$, 'noun', 'feminine', 'not_applicable', false),
    (35, $$prize$$, $$приз$$, $$приз$$, 'noun', 'masculine', 'not_applicable', false),
    (36, $$prize winner$$, $$призёр$$, $$призёр$$, 'noun', 'masculine', 'not_applicable', false),
    (37, $$referee$$, $$судья$$, $$судья$$, 'noun', 'common', 'not_applicable', false),
    (38, $$review$$, $$отзыв$$, $$отзыв$$, 'noun', 'masculine', 'not_applicable', false),
    (39, $$riding$$, $$верховая езда$$, $$верховая езда$$, 'noun', 'feminine', 'not_applicable', false),
    (40, $$roller blading$$, $$катание на роликах$$, $$катание на роликах$$, 'noun', 'neuter', 'not_applicable', false),
    (41, $$sailing$$, $$парусный спорт$$, $$парусный спорт$$, 'noun', 'masculine', 'not_applicable', false),
    (42, $$short story$$, $$рассказ / повесть$$, $$рассказ; повесть f$$, 'noun', 'unknown', 'not_applicable', false),
    (43, $$singer$$, $$певец / певица$$, $$певец/певица$$, 'noun', 'common', 'not_applicable', false),
    (44, $$soap (opera)$$, $$мыльная опера$$, $$мыльная опера$$, 'noun', 'feminine', 'not_applicable', false),
    (45, $$song$$, $$песня$$, $$песня$$, 'noun', 'feminine', 'not_applicable', false),
    (46, $$speakers$$, $$колонки$$, $$колонки$$, 'noun', 'plural_only', 'not_applicable', false),
    (47, $$special effects$$, $$спецэффекты$$, $$спецэффекты$$, 'noun', 'plural_only', 'not_applicable', false),
    (48, $$stage$$, $$сцена$$, $$сцена$$, 'noun', 'feminine', 'not_applicable', false),
    (49, $$subtitles$$, $$субтитры$$, $$субтитры$$, 'noun', 'plural_only', 'not_applicable', false),
    (50, $$table tennis$$, $$настольный теннис$$, $$настольный теннис$$, 'noun', 'masculine', 'not_applicable', false),
    (51, $$to (be) relax(ed)$$, $$расслаблять / расслабляться / расслабить / расслабиться$$, $$расслаблять(ся)/расслабить(ся)$$, 'verb', 'not_applicable', 'both', true),
    (52, $$to bathe$$, $$купаться / искупаться$$, $$купаться/ис-$$, 'verb', 'not_applicable', 'both', true),
    (53, $$to celebrate (a public holiday/festival)$$, $$праздновать / отпраздновать$$, $$праздновать/от-$$, 'verb', 'not_applicable', 'both', false),
    (54, $$to congratulate$$, $$поздравлять / поздравить$$, $$поздравлять/поздравить$$, 'verb', 'not_applicable', 'both', false),
    (55, $$to create$$, $$создавать / создать$$, $$создавать/создать$$, 'verb', 'not_applicable', 'both', false),
    (56, $$to do gymnastics$$, $$заниматься гимнастикой$$, $$заниматься гимнастикой$$, 'verb', 'not_applicable', 'imperfective', true),
    (57, $$to exercise$$, $$делать / сделать зарядку$$, $$делать/с- зарядку$$, 'verb', 'not_applicable', 'both', false),
    (58, $$to fish/go fishing$$, $$ловить рыбу$$, $$ловить рыбу$$, 'verb', 'not_applicable', 'imperfective', false),
    (59, $$to go for a walk/stroll$$, $$гулять / погулять$$, $$гулять/по-$$, 'verb', 'not_applicable', 'both', false),
    (60, $$to hike, ramble$$, $$ходить / идти / пойти в поход$$, $$ходить/идти//пойти в походку$$, 'verb', 'not_applicable', 'both', false),
    (61, $$to manage, control$$, $$управлять$$, $$управлять$$, 'verb', 'not_applicable', 'imperfective', false),
    (62, $$to occupy oneself, do$$, $$заниматься / заняться$$, $$заниматься/заняться$$, 'verb', 'not_applicable', 'both', true),
    (63, $$to participate$$, $$участвовать$$, $$участвовать$$, 'verb', 'not_applicable', 'imperfective', false),
    (64, $$to roller-skate$$, $$кататься на роликах$$, $$кататься на роликах$$, 'verb', 'not_applicable', 'imperfective', true),
    (65, $$to sail$$, $$заниматься парусным спортом$$, $$заниматься парусным спортом$$, 'verb', 'not_applicable', 'imperfective', true),
    (66, $$to score a goal$$, $$забивать / забить гол$$, $$забивать/забить гол$$, 'verb', 'not_applicable', 'both', false),
    (67, $$to sew$$, $$шить / сшить$$, $$шить/с-$$, 'verb', 'not_applicable', 'both', false),
    (68, $$to skateboard$$, $$кататься на скейтборде$$, $$кататься на скейтборде$$, 'verb', 'not_applicable', 'imperfective', true),
    (69, $$to swim$$, $$плавать / плыть / поплыть$$, $$плавать/плыть//поплыть$$, 'verb', 'not_applicable', 'both', false),
    (70, $$to take part (in)$$, $$принимать / принять участие$$, $$принимать/принять участие$$, 'verb', 'not_applicable', 'both', false),
    (71, $$to train$$, $$тренировать / тренироваться$$, $$тренировать(ся)$$, 'verb', 'not_applicable', 'imperfective', true),
    (72, $$tournament$$, $$турнир$$, $$турнир$$, 'noun', 'masculine', 'not_applicable', false),
    (73, $$training$$, $$тренировка$$, $$тренировка$$, 'noun', 'feminine', 'not_applicable', false),
    (74, $$trumpet$$, $$труба$$, $$труба$$, 'noun', 'feminine', 'not_applicable', false),
    (75, $$unforgettable$$, $$незабываемый$$, $$незабываемый$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (76, $$viewer$$, $$зритель$$, $$зритель$$, 'noun', 'masculine', 'not_applicable', false),
    (77, $$writer$$, $$писатель$$, $$писатель$$, 'noun', 'masculine', 'not_applicable', false),
    (78, $$Xbox$$, $$игровая приставка Xbox$$, $$игровая приставка Xbox$$, 'noun', 'feminine', 'not_applicable', false),
    (79, $$youth club$$, $$молодёжный клуб$$, $$молодёжный клуб$$, 'noun', 'masculine', 'not_applicable', false)
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
      'cultural-life-higher:item-' ||
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
    'identity_and_culture',
    'identity_and_culture_cultural_life',
    'cultural_life',
    prepared_items.aspect,
    prepared_items.is_reflexive,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Identity and culture / Cultural life / Higher tier',
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
  'Section 2: Topic-specific vocabulary / Identity and culture / Cultural life / Higher tier',
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
