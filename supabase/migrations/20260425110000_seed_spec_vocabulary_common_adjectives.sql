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
  'Imported GCSE Russian specification vocabulary. Includes Section 1: High-frequency language sets.'
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
    'high-frequency-language-common-adjectives',
    'Common adjectives',
    'Spec-required high-frequency GCSE Russian adjectives from Section 1: High-frequency language.',
    'high_frequency_language',
    'common_adjectives',
    'both',
    'spec_only',
    'specification',
    'single_column',
    true,
    20,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'section-1:high-frequency-language:common-adjectives'
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
    'common-adjectives',
    'Common adjectives',
    'Spec-required high-frequency GCSE Russian common adjectives.',
    'high_frequency_language',
    'common_adjectives',
    'common_adjectives',
    'both',
    'spec_only',
    'single_column',
    true,
    20,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 1: High-frequency language / Common adjectives',
    'section-1:high-frequency-language:common-adjectives:list'
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
  spec_russian
) as (
  values
    (1, $$active$$, $$активный$$, $$активный$$),
    (2, $$alike; the same$$, $$похож / похожа / похоже / похожи$$, $$похож/-а/-е/и$$),
    (3, $$any sort of$$, $$любой$$, $$любой$$),
    (4, $$bad$$, $$плохой$$, $$плохой$$),
    (5, $$better, best$$, $$лучший$$, $$лучший$$),
    (6, $$big, large$$, $$большой$$, $$большой$$),
    (7, $$boring$$, $$скучный$$, $$скучный$$),
    (8, $$cheap$$, $$дешёвый$$, $$дешёвый$$),
    (9, $$children’s$$, $$детский$$, $$детский$$),
    (10, $$clean$$, $$чистый$$, $$чистый$$),
    (11, $$complex, complicated$$, $$сложный$$, $$сложный$$),
    (12, $$cosy$$, $$уютный$$, $$уютный$$),
    (13, $$dangerous$$, $$опасный$$, $$опасный$$),
    (14, $$dirty$$, $$грязный$$, $$грязный$$),
    (15, $$easy$$, $$лёгкий$$, $$лёгкий$$),
    (16, $$every$$, $$каждый$$, $$каждый$$),
    (17, $$excellent$$, $$отличный$$, $$отличный$$),
    (18, $$exciting, entertaining$$, $$увлекательный$$, $$увлекательный$$),
    (19, $$expensive$$, $$дорогой$$, $$дорогой$$),
    (20, $$fair$$, $$справедливый$$, $$справедливый$$),
    (21, $$famous$$, $$знаменитый$$, $$знаменитый$$),
    (22, $$fashionable$$, $$модный$$, $$модный$$),
    (23, $$fast$$, $$быстрый$$, $$быстрый$$),
    (24, $$fat$$, $$толстый$$, $$толстый$$),
    (25, $$favourite$$, $$любимый$$, $$любимый$$),
    (26, $$foreign$$, $$иностранный$$, $$иностранный$$),
    (27, $$former$$, $$бывший$$, $$бывший$$),
    (28, $$free (at no cost)$$, $$бесплатный$$, $$бесплатный$$),
    (29, $$free (unoccupied, available)$$, $$свободный$$, $$свободный$$),
    (30, $$friendly$$, $$дружелюбный$$, $$дружелюбный$$),
    (31, $$frightening$$, $$страшный$$, $$страшный$$),
    (32, $$full$$, $$полный$$, $$полный$$),
    (33, $$fun; amusing$$, $$забавный$$, $$забавный$$),
    (34, $$funny (comical)$$, $$смешной$$, $$смешной$$),
    (35, $$generous$$, $$щедрый$$, $$щедрый$$),
    (36, $$genuine$$, $$настоящий$$, $$настоящий$$),
    (37, $$glad$$, $$рад / рада / радо / рады$$, $$рад/-а/-о/-ы$$),
    (38, $$good$$, $$хороший / хорошая / хорошее$$, $$хороший/-ая/-ее$$),
    (39, $$good (well behaved)$$, $$послушный$$, $$послушный$$),
    (40, $$grateful$$, $$благодарный$$, $$благодарный$$),
    (41, $$great$$, $$великий$$, $$великий$$),
    (42, $$happy, fortunate$$, $$счастливый$$, $$счастливый$$),
    (43, $$hard (not soft)$$, $$твёрдый$$, $$твёрдый$$),
    (44, $$hard, difficult$$, $$трудный$$, $$трудный$$),
    (45, $$hardworking$$, $$трудолюбивый$$, $$трудолюбивый$$),
    (46, $$harmful$$, $$вредный$$, $$вредный$$),
    (47, $$healthy (food/way of life)$$, $$здоровый$$, $$здоровый$$),
    (48, $$heavy$$, $$тяжёлый$$, $$тяжёлый$$),
    (49, $$high; tall (building)$$, $$высокий$$, $$высокий$$),
    (50, $$honest$$, $$честный$$, $$честный$$),
    (51, $$hot (of liquid)$$, $$горячий$$, $$горячий$$),
    (52, $$huge$$, $$огромный$$, $$огромный$$),
    (53, $$ideal$$, $$идеальный$$, $$идеальный$$),
    (54, $$ill (chronic)$$, $$больной$$, $$больной$$),
    (55, $$important$$, $$важный$$, $$важный$$),
    (56, $$in a good mood$$, $$в хорошем настроении$$, $$в хорошем настроении$$),
    (57, $$independent$$, $$независимый$$, $$независимый$$),
    (58, $$intelligent; clever$$, $$умный$$, $$умный$$),
    (59, $$interesting$$, $$интересный$$, $$интересный$$),
    (60, $$jolly, happy$$, $$весёлый$$, $$весёлый$$),
    (61, $$kind$$, $$добрый$$, $$добрый$$),
    (62, $$last$$, $$последний$$, $$последний$$),
    (63, $$lazy$$, $$ленивый$$, $$ленивый$$),
    (64, $$light$$, $$светлый$$, $$светлый$$),
    (65, $$long$$, $$длинный$$, $$длинный$$),
    (66, $$lost$$, $$потерянный$$, $$потерянный$$),
    (67, $$loud$$, $$громкий$$, $$громкий$$),
    (68, $$magnificent$$, $$великолепный$$, $$великолепный$$),
    (69, $$main$$, $$главный$$, $$главный$$),
    (70, $$marvellous$$, $$замечательный$$, $$замечательный$$),
    (71, $$modern$$, $$современный$$, $$современный$$),
    (72, $$narrow$$, $$узкий$$, $$узкий$$),
    (73, $$naughty$$, $$непослушный$$, $$непослушный$$),
    (74, $$necessary, needed$$, $$нужный$$, $$нужный$$),
    (75, $$necessary, unavoidable$$, $$необходимый$$, $$необходимый$$),
    (76, $$negative$$, $$негативный$$, $$негативный$$),
    (77, $$negative$$, $$отрицательный$$, $$отрицательный$$),
    (78, $$new$$, $$новый$$, $$новый$$),
    (79, $$next$$, $$следующий$$, $$следующий$$),
    (80, $$nice; likeable$$, $$приятный$$, $$приятный$$),
    (81, $$noisy$$, $$шумный$$, $$шумный$$),
    (82, $$normal$$, $$обычный$$, $$обычный$$),
    (83, $$OK$$, $$нормальный$$, $$нормальный$$),
    (84, $$old$$, $$старый$$, $$старый$$),
    (85, $$old (former)$$, $$бывший$$, $$бывший$$),
    (86, $$old fashioned$$, $$старомодный$$, $$старомодный$$),
    (87, $$open$$, $$открытый$$, $$открытый$$),
    (88, $$optimistic$$, $$оптимистичный$$, $$оптимистичный$$),
    (89, $$original$$, $$оригинальный$$, $$оригинальный$$),
    (90, $$other$$, $$другой$$, $$другой$$),
    (91, $$patient (im-)$$, $$терпеливый / нетерпеливый$$, $$(не)терпеливый$$),
    (92, $$peaceful$$, $$спокойный$$, $$спокойный$$),
    (93, $$pessimistic$$, $$пессимистичный$$, $$пессимистичный$$),
    (94, $$pleasant, nice$$, $$приятный$$, $$приятный$$),
    (95, $$pleased$$, $$довольный$$, $$довольный$$),
    (96, $$polite (im-)$$, $$вежливый / невежливый$$, $$(не)вежливый$$),
    (97, $$poor$$, $$бедный$$, $$бедный$$),
    (98, $$popular$$, $$популярный$$, $$популярный$$),
    (99, $$possible$$, $$возможный$$, $$возможный$$),
    (100, $$positive$$, $$позитивный$$, $$позитивный$$),
    (101, $$positive$$, $$положительный$$, $$положительный$$),
    (102, $$practical$$, $$практичный$$, $$практичный$$),
    (103, $$pretty$$, $$симпатичный$$, $$симпатичный$$),
    (104, $$quiet$$, $$тихий$$, $$тихий$$),
    (105, $$ready, prepared$$, $$готовый$$, $$готовый$$),
    (106, $$real$$, $$реальный$$, $$реальный$$),
    (107, $$reasonable$$, $$разумный$$, $$разумный$$),
    (108, $$recent$$, $$недавний$$, $$недавний$$),
    (109, $$reliable$$, $$надёжный$$, $$надёжный$$),
    (110, $$responsible$$, $$ответственный$$, $$ответственный$$),
    (111, $$rich$$, $$богатый$$, $$богатый$$),
    (112, $$sad$$, $$грустный$$, $$грустный$$),
    (113, $$safe$$, $$безопасный$$, $$безопасный$$),
    (114, $$same$$, $$одинаковый$$, $$одинаковый$$),
    (115, $$selfish$$, $$эгоистичный$$, $$эгоистичный$$),
    (116, $$sensational$$, $$сенсационный$$, $$сенсационный$$),
    (117, $$serious$$, $$серьёзный$$, $$серьёзный$$),
    (118, $$short$$, $$короткий$$, $$короткий$$),
    (119, $$short (person)$$, $$невысокий$$, $$невысокий$$),
    (120, $$silent$$, $$молчаливый$$, $$молчаливый$$),
    (121, $$silly$$, $$глупый$$, $$глупый$$),
    (122, $$situated$$, $$расположенный$$, $$расположенный$$),
    (123, $$slender$$, $$стройный$$, $$стройный$$),
    (124, $$slow$$, $$медленный$$, $$медленный$$),
    (125, $$small$$, $$маленький$$, $$маленький$$),
    (126, $$soft$$, $$мягкий$$, $$мягкий$$),
    (127, $$splendid$$, $$прекрасный$$, $$прекрасный$$),
    (128, $$strange$$, $$странный$$, $$странный$$),
    (129, $$strict$$, $$строгий$$, $$строгий$$),
    (130, $$strong$$, $$сильный$$, $$сильный$$),
    (131, $$suitable$$, $$подходящий$$, $$подходящий$$),
    (132, $$super$$, $$классный$$, $$классный$$),
    (133, $$surprised$$, $$удивлённый$$, $$удивлённый$$),
    (134, $$talkative$$, $$разговорчивый$$, $$разговорчивый$$),
    (135, $$terrible$$, $$ужасный$$, $$ужасный$$),
    (136, $$thin, slim$$, $$тонкий$$, $$тонкий$$),
    (137, $$tired$$, $$устал / устала / устало / устали$$, $$устал/-а/-о/и$$),
    (138, $$typical$$, $$типичный$$, $$типичный$$),
    (139, $$ugly$$, $$некрасивый$$, $$некрасивый$$),
    (140, $$unfair$$, $$несправедливый$$, $$несправедливый$$),
    (141, $$unhappy$$, $$несчастный$$, $$несчастный$$),
    (142, $$unhealthy$$, $$нездоровый$$, $$нездоровый$$),
    (143, $$unique$$, $$уникальный$$, $$уникальный$$),
    (144, $$unpleasant$$, $$неприятный$$, $$неприятный$$),
    (145, $$useful$$, $$полезный$$, $$полезный$$),
    (146, $$useless$$, $$бесполезный$$, $$бесполезный$$),
    (147, $$valuable$$, $$ценный$$, $$ценный$$),
    (148, $$various$$, $$разный$$, $$разный$$),
    (149, $$weak$$, $$слабый$$, $$слабый$$),
    (150, $$well-known$$, $$известный$$, $$известный$$),
    (151, $$wet$$, $$мокрый$$, $$мокрый$$),
    (152, $$wise$$, $$мудрый$$, $$мудрый$$),
    (153, $$wonderful$$, $$чудесный$$, $$чудесный$$),
    (154, $$worse$$, $$худший$$, $$худший$$),
    (155, $$young$$, $$молодой$$, $$молодой$$),
    (156, $$younger$$, $$младший$$, $$младший$$)
),
prepared_items as (
  select
    raw_items.position,
    raw_items.english,
    raw_items.russian,
    raw_items.spec_russian,
    case
      when raw_items.russian ~ '\s' then 'phrase'
      else 'word'
    end as item_type,
    case
      when raw_items.russian ~ '\s' and raw_items.position = 56 then 'phrase'
      else 'adjective'
    end as part_of_speech,
    (
      'section-1:high-frequency-language:common-adjectives:item-' ||
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
    'not_applicable',
    'unknown',
    'both',
    'high_frequency_language',
    'common_adjectives',
    'common_adjectives',
    'not_applicable',
    false,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 1: High-frequency language / Common adjectives',
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
  'Section 1: High-frequency language / Common adjectives',
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
