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
    'higher',
    'Higher tier',
    'Higher tier vocabulary for relations, relationships, personal and physical characteristics. Higher learners also need the Foundation list for this topic.',
    'identity_and_culture',
    'identity_and_culture_family_and_relationships',
    'relations_relationships_personal_physical_characteristics',
    'higher',
    'spec_only',
    'single_column',
    true,
    321,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Identity and culture / What my friends and family are like / Relations, relationships, personal and physical characteristics / Higher tier',
    'section-2:identity-and-culture:what-my-friends-and-family-are-like:relations-relationships-personal-physical-characteristics:higher:list'
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
    (1, $$acquaintance$$, $$знакомый$$, $$знакомый$$, 'noun', 'masculine', 'not_applicable', false),
    (2, $$adult, grown-up$$, $$взрослый$$, $$взрослый$$, 'noun', 'masculine', 'not_applicable', false),
    (3, $$alone$$, $$один / одна / одно$$, $$один/одна/одно$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (4, $$argument$$, $$спор$$, $$спор$$, 'noun', 'masculine', 'not_applicable', false),
    (5, $$body$$, $$тело$$, $$тело$$, 'noun', 'neuter', 'not_applicable', false),
    (6, $$brave, adventurous$$, $$смелый$$, $$смелый$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (7, $$career$$, $$карьера$$, $$карьера$$, 'noun', 'feminine', 'not_applicable', false),
    (8, $$carpet$$, $$ковёр$$, $$ковёр$$, 'noun', 'masculine', 'not_applicable', false),
    (9, $$celebrity$$, $$знаменитость$$, $$знаменитость$$, 'noun', 'feminine', 'not_applicable', false),
    (10, $$character (in film, etc)$$, $$персонаж$$, $$персонаж$$, 'noun', 'masculine', 'not_applicable', false),
    (11, $$character trait$$, $$черта характера$$, $$черта характера$$, 'noun', 'feminine', 'not_applicable', false),
    (12, $$character, nature$$, $$характер$$, $$характер$$, 'noun', 'masculine', 'not_applicable', false),
    (13, $$confident, sure$$, $$уверенный$$, $$уверенный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (14, $$cousin$$, $$двоюродный брат / двоюродная сестра$$, $$двоюродный брат/двоюродная сестра$$, 'noun', 'common', 'not_applicable', false),
    (15, $$discrimination$$, $$дискриминация$$, $$дискриминация$$, 'noun', 'feminine', 'not_applicable', false),
    (16, $$eating, diet$$, $$питание$$, $$питание$$, 'noun', 'neuter', 'not_applicable', false),
    (17, $$elbow$$, $$локоть$$, $$локоть$$, 'noun', 'masculine', 'not_applicable', false),
    (18, $$elder$$, $$старший$$, $$старший$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (19, $$elderly$$, $$пожилой$$, $$пожилой$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (20, $$example$$, $$пример$$, $$пример$$, 'noun', 'masculine', 'not_applicable', false),
    (21, $$faith (religious)$$, $$вера$$, $$вера$$, 'noun', 'feminine', 'not_applicable', false),
    (22, $$family (adjective)$$, $$семейный$$, $$семейный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (23, $$famous$$, $$знаменитый$$, $$знаменитый$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (24, $$farewell$$, $$прощальный$$, $$прощальный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (25, $$feeling$$, $$чувство$$, $$чувство$$, 'noun', 'neuter', 'not_applicable', false),
    (26, $$furnished$$, $$меблированный$$, $$меблированный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (27, $$gender, sex$$, $$пол$$, $$пол$$, 'noun', 'masculine', 'not_applicable', false),
    (28, $$guy, dude, bloke$$, $$парень$$, $$парень$$, 'noun', 'masculine', 'not_applicable', false),
    (29, $$habit$$, $$привычка$$, $$привычка$$, 'noun', 'feminine', 'not_applicable', false),
    (30, $$hall (in house)$$, $$коридор$$, $$коридор$$, 'noun', 'masculine', 'not_applicable', false),
    (31, $$hungry$$, $$голодный$$, $$голодный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (32, $$husband$$, $$муж$$, $$муж$$, 'noun', 'masculine', 'not_applicable', false),
    (33, $$initiative$$, $$инициатива$$, $$инициатива$$, 'noun', 'feminine', 'not_applicable', false),
    (34, $$invitation$$, $$приглашение$$, $$приглашение$$, 'noun', 'neuter', 'not_applicable', false),
    (35, $$knee$$, $$колено$$, $$колено$$, 'noun', 'neuter', 'not_applicable', false),
    (36, $$loft$$, $$чердак / мансарда$$, $$чердак, мансарда$$, 'noun', 'unknown', 'not_applicable', false),
    (37, $$loyal, faithful$$, $$лояльный$$, $$лояльный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (38, $$married$$, $$замужем (f) / женат (m)$$, $$замужем (f) / женат (m)$$, 'phrase', 'not_applicable', 'not_applicable', false),
    (39, $$meeting$$, $$встреча$$, $$встреча$$, 'noun', 'feminine', 'not_applicable', false),
    (40, $$mirror$$, $$зеркало$$, $$зеркало$$, 'noun', 'neuter', 'not_applicable', false),
    (41, $$mood$$, $$настроение$$, $$настроение$$, 'noun', 'neuter', 'not_applicable', false),
    (42, $$neighbour$$, $$сосед / соседка$$, $$сосед/соседка$$, 'noun', 'common', 'not_applicable', false),
    (43, $$old age$$, $$старость$$, $$старость$$, 'noun', 'feminine', 'not_applicable', false),
    (44, $$old people’s home$$, $$дом престарелых$$, $$дом престарелых$$, 'noun', 'masculine', 'not_applicable', false),
    (45, $$older$$, $$старше$$, $$старше$$, 'adverb', 'not_applicable', 'not_applicable', false),
    (46, $$oldest (brother/sister)$$, $$самый старший$$, $$самый старший$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (47, $$only child$$, $$единственный ребёнок$$, $$единственный ребёнок$$, 'noun', 'masculine', 'not_applicable', false),
    (48, $$participant$$, $$участник$$, $$участник$$, 'noun', 'masculine', 'not_applicable', false),
    (49, $$pensioner$$, $$пенсионер / пенсионерка$$, $$пенсионер/ка$$, 'noun', 'common', 'not_applicable', false),
    (50, $$place of residence$$, $$место жительства$$, $$место жительства$$, 'noun', 'neuter', 'not_applicable', false),
    (51, $$project$$, $$проект$$, $$проект$$, 'noun', 'masculine', 'not_applicable', false),
    (52, $$racist$$, $$расистский$$, $$расистский$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (53, $$reasonable$$, $$разумный$$, $$разумный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (54, $$relative, relation$$, $$родственник$$, $$родственник$$, 'noun', 'masculine', 'not_applicable', false),
    (55, $$reliable$$, $$надёжный$$, $$надёжный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (56, $$sauna (Russian-style)$$, $$баня$$, $$баня$$, 'noun', 'feminine', 'not_applicable', false),
    (57, $$self (myself, yourself etc)$$, $$сам / сама / само / сами$$, $$сам/сама/само/сами$$, 'pronoun', 'not_applicable', 'not_applicable', false),
    (58, $$selfish$$, $$эгоистичный$$, $$эгоистичный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (59, $$sense of humour$$, $$чувство юмора$$, $$чувство юмора$$, 'noun', 'neuter', 'not_applicable', false),
    (60, $$sensitive$$, $$чувствительный$$, $$чувствительный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (61, $$similar$$, $$похож / похожа / похоже / похожи$$, $$похож/-а/-е/-и$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (62, $$study, office$$, $$кабинет$$, $$кабинет$$, 'noun', 'masculine', 'not_applicable', false),
    (63, $$survey$$, $$опрос$$, $$опрос$$, 'noun', 'masculine', 'not_applicable', false),
    (64, $$stereotype$$, $$стереотип$$, $$стереотип$$, 'noun', 'masculine', 'not_applicable', false),
    (65, $$thin/slender$$, $$стройный$$, $$стройный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (66, $$tired$$, $$уставший$$, $$уставший$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (67, $$to argue$$, $$спорить$$, $$спорить$$, 'verb', 'not_applicable', 'imperfective', false),
    (68, $$to babysit$$, $$смотреть за ребёнком$$, $$смотреть за ребёнком$$, 'verb', 'not_applicable', 'imperfective', false),
    (69, $$to be in a good/bad mood$$, $$быть в хорошем / плохом настроении$$, $$быть в хорошем/плохом настроении$$, 'verb', 'not_applicable', 'imperfective', false),
    (70, $$to do the washing up$$, $$мыть / помыть посуду$$, $$мыть/по- посуду$$, 'verb', 'not_applicable', 'both', false),
    (71, $$to feel$$, $$чувствовать себя$$, $$чувствовать (себя)$$, 'verb', 'not_applicable', 'imperfective', true),
    (72, $$to get on (well) with$$, $$быть в хороших отношениях с кем-то$$, $$быть в (хороших) отношениях с кем-то$$, 'verb', 'not_applicable', 'imperfective', false),
    (73, $$to move house$$, $$переезжать / переехать$$, $$переезжать/переехать$$, 'verb', 'not_applicable', 'both', false),
    (74, $$to participate$$, $$участвовать$$, $$участвовать$$, 'verb', 'not_applicable', 'imperfective', false),
    (75, $$to respect$$, $$уважать$$, $$уважать$$, 'verb', 'not_applicable', 'imperfective', false),
    (76, $$to support$$, $$поддерживать / поддержать$$, $$поддерживать/поддержать$$, 'verb', 'not_applicable', 'both', false),
    (77, $$understanding$$, $$понимание$$, $$понимание$$, 'noun', 'neuter', 'not_applicable', false),
    (78, $$unemployed$$, $$безработный$$, $$безработный$$, 'adjective', 'not_applicable', 'not_applicable', false),
    (79, $$wages$$, $$зарплата$$, $$зарплата$$, 'noun', 'feminine', 'not_applicable', false),
    (80, $$wanted$$, $$разыскивается$$, $$разыскивается$$, 'phrase', 'not_applicable', 'not_applicable', true),
    (81, $$way of life, lifestyle$$, $$образ жизни$$, $$образ жизни$$, 'noun', 'masculine', 'not_applicable', false),
    (82, $$younger$$, $$младший$$, $$младший$$, 'adjective', 'not_applicable', 'not_applicable', false)
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
      'what-my-friends-and-family-are-like-relationships-characteristics-higher:item-' ||
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
    'identity_and_culture_family_and_relationships',
    'relations_relationships_personal_physical_characteristics',
    prepared_items.aspect,
    prepared_items.is_reflexive,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Identity and culture / What my friends and family are like / Relations, relationships, personal and physical characteristics / Higher tier',
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
  'Section 2: Topic-specific vocabulary / Identity and culture / What my friends and family are like / Relations, relationships, personal and physical characteristics / Higher tier',
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
