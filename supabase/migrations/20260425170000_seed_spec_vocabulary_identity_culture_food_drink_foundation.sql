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
    'identity-and-culture-daily-life-food-and-drink',
    'Daily life, food and drink, including eating out',
    'Spec-required topic-specific GCSE Russian vocabulary for identity and culture: daily life, food and drink, including eating out.',
    'identity_and_culture',
    'identity_and_culture_food_and_drink',
    'both',
    'spec_only',
    'specification',
    'single_column',
    true,
    300,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'section-2:identity-and-culture:daily-life-food-and-drink-eating-out'
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
    'Foundation tier vocabulary for daily life, food and drink, including eating out.',
    'identity_and_culture',
    'identity_and_culture_food_and_drink',
    'daily_life_food_and_drink_eating_out',
    'foundation',
    'spec_only',
    'single_column',
    true,
    300,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Identity and culture / Daily life, food and drink, including eating out / Foundation tier',
    'section-2:identity-and-culture:daily-life-food-and-drink-eating-out:foundation:list'
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
  aspect
) as (
  values
    (1, $$appetite$$, $$аппетит$$, $$аппетит$$, 'noun', 'masculine', 'not_applicable'),
    (2, $$apple$$, $$яблоко$$, $$яблоко$$, 'noun', 'neuter', 'not_applicable'),
    (3, $$banana$$, $$банан$$, $$банан$$, 'noun', 'masculine', 'not_applicable'),
    (4, $$beans$$, $$фасоль$$, $$фасоль$$, 'noun', 'feminine', 'not_applicable'),
    (5, $$beef$$, $$говядина$$, $$говядина$$, 'noun', 'feminine', 'not_applicable'),
    (6, $$Beef Stroganov$$, $$Бефстроганов$$, $$Бефстроганов$$, 'noun', 'masculine', 'not_applicable'),
    (7, $$beer$$, $$пиво$$, $$пиво$$, 'noun', 'neuter', 'not_applicable'),
    (8, $$beetroot$$, $$свёкла$$, $$свёкла$$, 'noun', 'feminine', 'not_applicable'),
    (9, $$beetroot soup, borscht$$, $$борщ$$, $$борщ$$, 'noun', 'masculine', 'not_applicable'),
    (10, $$bill$$, $$счёт$$, $$счёт$$, 'noun', 'masculine', 'not_applicable'),
    (11, $$biscuit$$, $$печенье$$, $$печенье$$, 'noun', 'neuter', 'not_applicable'),
    (12, $$bottle$$, $$бутылка$$, $$бутылка$$, 'noun', 'feminine', 'not_applicable'),
    (13, $$bread$$, $$хлеб$$, $$хлеб$$, 'noun', 'masculine', 'not_applicable'),
    (14, $$breakfast$$, $$завтрак$$, $$завтрак$$, 'noun', 'masculine', 'not_applicable'),
    (15, $$business lunch$$, $$бизнес-ланч$$, $$бизнес-ланч$$, 'noun', 'masculine', 'not_applicable'),
    (16, $$butter$$, $$масло$$, $$масло$$, 'noun', 'neuter', 'not_applicable'),
    (17, $$cabbage$$, $$капуста$$, $$капуста$$, 'noun', 'feminine', 'not_applicable'),
    (18, $$cabbage soup$$, $$щи$$, $$щи$$, 'noun', 'plural_only', 'not_applicable'),
    (19, $$café$$, $$кафе$$, $$кафе$$, 'noun', 'neuter', 'not_applicable'),
    (20, $$cake$$, $$торт$$, $$торт$$, 'noun', 'masculine', 'not_applicable'),
    (21, $$carrot$$, $$морковь$$, $$морковь$$, 'noun', 'feminine', 'not_applicable'),
    (22, $$caviar$$, $$икра$$, $$икра$$, 'noun', 'feminine', 'not_applicable'),
    (23, $$champagne$$, $$шампанское$$, $$шампанское$$, 'noun', 'neuter', 'not_applicable'),
    (24, $$cheese$$, $$сыр$$, $$сыр$$, 'noun', 'masculine', 'not_applicable'),
    (25, $$chicken$$, $$курица$$, $$курица$$, 'noun', 'feminine', 'not_applicable'),
    (26, $$chips$$, $$картофель фри$$, $$картофель фри$$, 'noun', 'masculine', 'not_applicable'),
    (27, $$chocolate$$, $$шоколад$$, $$шоколад$$, 'noun', 'masculine', 'not_applicable'),
    (28, $$closed (on Mondays)$$, $$закрыто (по понедельникам)$$, $$закрыто (по понедельникам)$$, 'phrase', 'not_applicable', 'not_applicable'),
    (29, $$cocoa$$, $$какао$$, $$какао$$, 'noun', 'neuter', 'not_applicable'),
    (30, $$coffee$$, $$кофе$$, $$кофе$$, 'noun', 'masculine', 'not_applicable'),
    (31, $$crisps$$, $$чипсы$$, $$чипсы$$, 'noun', 'plural_only', 'not_applicable'),
    (32, $$cucumber$$, $$огурец$$, $$огурец$$, 'noun', 'masculine', 'not_applicable'),
    (33, $$cup$$, $$чашка$$, $$чашка$$, 'noun', 'feminine', 'not_applicable'),
    (34, $$custom$$, $$обычай$$, $$обычай$$, 'noun', 'masculine', 'not_applicable'),
    (35, $$customer$$, $$покупатель / клиент$$, $$покупатель, клиент$$, 'noun', 'masculine', 'not_applicable'),
    (36, $$daily$$, $$повседневный$$, $$повседневный$$, 'adjective', 'not_applicable', 'not_applicable'),
    (37, $$delicious$$, $$вкусно$$, $$вкусно$$, 'adverb', 'not_applicable', 'not_applicable'),
    (38, $$dessert$$, $$десерт$$, $$десерт$$, 'noun', 'masculine', 'not_applicable'),
    (39, $$dining room$$, $$столовая$$, $$столовая$$, 'noun', 'feminine', 'not_applicable'),
    (40, $$dish$$, $$блюдо$$, $$блюдо$$, 'noun', 'neuter', 'not_applicable'),
    (41, $$drink$$, $$напиток$$, $$напиток$$, 'noun', 'masculine', 'not_applicable'),
    (42, $$egg$$, $$яйцо$$, $$яйцо$$, 'noun', 'neuter', 'not_applicable'),
    (43, $$enjoy your meal!$$, $$приятного аппетита$$, $$приятного аппетита$$, 'phrase', 'not_applicable', 'not_applicable'),
    (44, $$euro$$, $$евро$$, $$евро$$, 'noun', 'neuter', 'not_applicable'),
    (45, $$evening meal, dinner$$, $$ужин$$, $$ужин$$, 'noun', 'masculine', 'not_applicable'),
    (46, $$everyday$$, $$повседневный$$, $$повседневный$$, 'adjective', 'not_applicable', 'not_applicable'),
    (47, $$fast food$$, $$фаст-фуд$$, $$фаст-фуд$$, 'noun', 'masculine', 'not_applicable'),
    (48, $$first course$$, $$первое (блюдо)$$, $$первое (блюдо)$$, 'noun', 'neuter', 'not_applicable'),
    (49, $$fish$$, $$рыба$$, $$рыба$$, 'noun', 'feminine', 'not_applicable'),
    (50, $$fizzy water$$, $$газированная вода$$, $$газированная вода$$, 'noun', 'feminine', 'not_applicable'),
    (51, $$fresh$$, $$свежий$$, $$свежий$$, 'adjective', 'not_applicable', 'not_applicable'),
    (52, $$food$$, $$еда$$, $$еда$$, 'noun', 'feminine', 'not_applicable'),
    (53, $$foodstuffs$$, $$продукты$$, $$продукты$$, 'noun', 'plural_only', 'not_applicable'),
    (54, $$fruit$$, $$фрукты$$, $$фрукты$$, 'noun', 'plural_only', 'not_applicable'),
    (55, $$fruit juice$$, $$сок$$, $$сок$$, 'noun', 'masculine', 'not_applicable'),
    (56, $$grapefruit$$, $$грейпфрут$$, $$грейпфрут$$, 'noun', 'masculine', 'not_applicable'),
    (57, $$grapes$$, $$виноград$$, $$виноград$$, 'noun', 'masculine', 'not_applicable'),
    (58, $$ham$$, $$ветчина$$, $$ветчина$$, 'noun', 'feminine', 'not_applicable'),
    (59, $$hamburger$$, $$гамбургер$$, $$гамбургер$$, 'noun', 'masculine', 'not_applicable'),
    (60, $$hot chocolate$$, $$горячий шоколад$$, $$горячий шоколад$$, 'noun', 'masculine', 'not_applicable'),
    (61, $$ice cream$$, $$мороженое$$, $$мороженое$$, 'noun', 'neuter', 'not_applicable'),
    (62, $$ice cream parlour$$, $$кафе-мороженое$$, $$кафе-мороженое$$, 'noun', 'neuter', 'not_applicable'),
    (63, $$I’ll take it!$$, $$Я возьму!$$, $$Я возьму!$$, 'phrase', 'not_applicable', 'not_applicable'),
    (64, $$jam$$, $$варенье / джем$$, $$варенье, джем$$, 'noun', 'unknown', 'not_applicable'),
    (65, $$juice$$, $$сок$$, $$сок$$, 'noun', 'masculine', 'not_applicable'),
    (66, $$kebab$$, $$шашлык$$, $$шашлык$$, 'noun', 'masculine', 'not_applicable'),
    (67, $$lemon$$, $$лимон$$, $$лимон$$, 'noun', 'masculine', 'not_applicable'),
    (68, $$lemonade$$, $$лимонад$$, $$лимонад$$, 'noun', 'masculine', 'not_applicable'),
    (69, $$lettuce, salad$$, $$салат$$, $$салат$$, 'noun', 'masculine', 'not_applicable'),
    (70, $$life$$, $$жизнь$$, $$жизнь$$, 'noun', 'feminine', 'not_applicable'),
    (71, $$lunch$$, $$обед$$, $$обед$$, 'noun', 'masculine', 'not_applicable'),
    (72, $$main course$$, $$второе (блюдо)$$, $$второе (блюдо)$$, 'noun', 'neuter', 'not_applicable'),
    (73, $$margarine$$, $$маргарин$$, $$маргарин$$, 'noun', 'masculine', 'not_applicable'),
    (74, $$meal$$, $$обед$$, $$обед$$, 'noun', 'masculine', 'not_applicable'),
    (75, $$meat$$, $$мясо$$, $$мясо$$, 'noun', 'neuter', 'not_applicable'),
    (76, $$menu$$, $$меню$$, $$меню$$, 'noun', 'neuter', 'not_applicable'),
    (77, $$milk$$, $$молоко$$, $$молоко$$, 'noun', 'neuter', 'not_applicable'),
    (78, $$milkshake$$, $$молочный коктейль$$, $$молочный коктейль$$, 'noun', 'masculine', 'not_applicable'),
    (79, $$mineral water$$, $$минеральная вода$$, $$минеральная вода$$, 'noun', 'feminine', 'not_applicable'),
    (80, $$money$$, $$деньги$$, $$деньги$$, 'noun', 'plural_only', 'not_applicable'),
    (81, $$mushroom$$, $$гриб$$, $$гриб$$, 'noun', 'masculine', 'not_applicable'),
    (82, $$napkin$$, $$салфетка$$, $$салфетка$$, 'noun', 'feminine', 'not_applicable'),
    (83, $$oil$$, $$масло$$, $$масло$$, 'noun', 'neuter', 'not_applicable'),
    (84, $$omelette$$, $$омлет$$, $$омлет$$, 'noun', 'masculine', 'not_applicable'),
    (85, $$onion$$, $$лук$$, $$лук$$, 'noun', 'masculine', 'not_applicable'),
    (86, $$orange$$, $$апельсин$$, $$апельсин$$, 'noun', 'masculine', 'not_applicable'),
    (87, $$packet$$, $$пачка$$, $$пачка$$, 'noun', 'feminine', 'not_applicable'),
    (88, $$pancakes$$, $$блины$$, $$блины$$, 'noun', 'plural_only', 'not_applicable'),
    (89, $$pasta$$, $$макароны$$, $$макароны$$, 'noun', 'plural_only', 'not_applicable'),
    (90, $$peach$$, $$персик$$, $$персик$$, 'noun', 'masculine', 'not_applicable'),
    (91, $$pelmeni (meat parcels)$$, $$пельмени$$, $$пельмени$$, 'noun', 'plural_only', 'not_applicable'),
    (92, $$pepper$$, $$перец$$, $$перец$$, 'noun', 'masculine', 'not_applicable'),
    (93, $$pizza$$, $$пицца$$, $$пицца$$, 'noun', 'feminine', 'not_applicable'),
    (94, $$pizzeria, pizza restaurant$$, $$пиццерия$$, $$пиццерия$$, 'noun', 'feminine', 'not_applicable'),
    (95, $$porridge$$, $$каша$$, $$каша$$, 'noun', 'feminine', 'not_applicable'),
    (96, $$portion$$, $$порция$$, $$порция$$, 'noun', 'feminine', 'not_applicable'),
    (97, $$potato$$, $$картофель / картошка$$, $$картофель, картошка$$, 'noun', 'unknown', 'not_applicable'),
    (98, $$price$$, $$цена$$, $$цена$$, 'noun', 'feminine', 'not_applicable'),
    (99, $$restaurant$$, $$ресторан$$, $$ресторан$$, 'noun', 'masculine', 'not_applicable'),
    (100, $$rice$$, $$рис$$, $$рис$$, 'noun', 'masculine', 'not_applicable'),
    (101, $$rouble$$, $$рубль$$, $$рубль$$, 'noun', 'masculine', 'not_applicable'),
    (102, $$salami, cooked sausage$$, $$колбаса$$, $$колбаса$$, 'noun', 'feminine', 'not_applicable'),
    (103, $$salt$$, $$соль$$, $$соль$$, 'noun', 'feminine', 'not_applicable'),
    (104, $$sandwich$$, $$бутерброд / сандвич$$, $$бутерброд, сандвич$$, 'noun', 'masculine', 'not_applicable'),
    (105, $$sausages$$, $$сосиски$$, $$сосиски$$, 'noun', 'plural_only', 'not_applicable'),
    (106, $$service$$, $$сервис$$, $$сервис$$, 'noun', 'masculine', 'not_applicable'),
    (107, $$sideboard, dresser$$, $$буфет$$, $$буфет$$, 'noun', 'masculine', 'not_applicable'),
    (108, $$snack$$, $$закуска$$, $$закуска$$, 'noun', 'feminine', 'not_applicable'),
    (109, $$snack bar$$, $$буфет$$, $$буфет$$, 'noun', 'masculine', 'not_applicable'),
    (110, $$soup$$, $$суп$$, $$суп$$, 'noun', 'masculine', 'not_applicable'),
    (111, $$soured cream$$, $$сметана$$, $$сметана$$, 'noun', 'feminine', 'not_applicable'),
    (112, $$speciality$$, $$специальность$$, $$специальность$$, 'noun', 'feminine', 'not_applicable'),
    (113, $$starters$$, $$закуски$$, $$закуски$$, 'noun', 'plural_only', 'not_applicable'),
    (114, $$steak$$, $$бифштекс$$, $$бифштекс$$, 'noun', 'masculine', 'not_applicable'),
    (115, $$still water$$, $$негазированная вода$$, $$негазированная вода$$, 'noun', 'feminine', 'not_applicable'),
    (116, $$sugar$$, $$сахар$$, $$сахар$$, 'noun', 'masculine', 'not_applicable'),
    (117, $$supermarket$$, $$супермаркет$$, $$супермаркет$$, 'noun', 'masculine', 'not_applicable'),
    (118, $$supper$$, $$ужин$$, $$ужин$$, 'noun', 'masculine', 'not_applicable'),
    (119, $$sweet$$, $$конфета$$, $$конфета$$, 'noun', 'feminine', 'not_applicable'),
    (120, $$sweet (tasting)$$, $$сладкий$$, $$сладкий$$, 'adjective', 'not_applicable', 'not_applicable'),
    (121, $$sweet course, dessert$$, $$сладкое (блюдо)$$, $$сладкое (блюдо)$$, 'noun', 'neuter', 'not_applicable'),
    (122, $$table$$, $$стол$$, $$стол$$, 'noun', 'masculine', 'not_applicable'),
    (123, $$tasty$$, $$вкусный$$, $$вкусный$$, 'adjective', 'not_applicable', 'not_applicable'),
    (124, $$tea$$, $$чай$$, $$чай$$, 'noun', 'masculine', 'not_applicable'),
    (125, $$to have breakfast$$, $$завтракать / позавтракать$$, $$завтракать/по-$$, 'verb', 'not_applicable', 'both'),
    (126, $$to have lunch$$, $$обедать / пообедать$$, $$обедать/по-$$, 'verb', 'not_applicable', 'both'),
    (127, $$to have supper$$, $$ужинать / поужинать$$, $$ужинать/по-$$, 'verb', 'not_applicable', 'both'),
    (128, $$to pay$$, $$платить / заплатить$$, $$платить/за-$$, 'verb', 'not_applicable', 'both'),
    (129, $$tomato$$, $$помидор$$, $$помидор$$, 'noun', 'masculine', 'not_applicable'),
    (130, $$vegetables$$, $$овощи$$, $$овощи$$, 'noun', 'plural_only', 'not_applicable'),
    (131, $$vegetarian$$, $$вегетарианец / вегетарианка$$, $$вегетарианец, вегетарианка$$, 'noun', 'common', 'not_applicable'),
    (132, $$vitamins$$, $$витамины$$, $$витамины$$, 'noun', 'plural_only', 'not_applicable'),
    (133, $$vodka$$, $$водка$$, $$водка$$, 'noun', 'feminine', 'not_applicable'),
    (134, $$waiter/waitress$$, $$официант / официантка$$, $$официант/официантка$$, 'noun', 'common', 'not_applicable'),
    (135, $$water$$, $$вода$$, $$вода$$, 'noun', 'feminine', 'not_applicable'),
    (136, $$watermelon$$, $$арбуз$$, $$арбуз$$, 'noun', 'masculine', 'not_applicable'),
    (137, $$wine$$, $$вино$$, $$вино$$, 'noun', 'neuter', 'not_applicable'),
    (138, $$yoghurt$$, $$йогурт$$, $$йогурт$$, 'noun', 'masculine', 'not_applicable')
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
    case
      when raw_items.part_of_speech = 'phrase' or raw_items.russian ~ '\s' then 'phrase'
      else 'word'
    end as item_type,
    (
      'daily-life-food-and-drink-eating-out-foundation:item-' ||
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
    'identity_and_culture_food_and_drink',
    'daily_life_food_and_drink_eating_out',
    prepared_items.aspect,
    false,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 2: Topic-specific vocabulary / Identity and culture / Daily life, food and drink, including eating out / Foundation tier',
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
  'Section 2: Topic-specific vocabulary / Identity and culture / Daily life, food and drink, including eating out / Foundation tier',
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
