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
    'high-frequency-language-numbers',
    'Numbers',
    'Spec-required high-frequency GCSE Russian numbers from Section 1: High-frequency language.',
    'high_frequency_language',
    'numbers',
    'both',
    'spec_only',
    'specification',
    'single_column',
    true,
    60,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'section-1:high-frequency-language:numbers'
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
    'numbers',
    'Numbers',
    'Spec-required high-frequency GCSE Russian numbers.',
    'high_frequency_language',
    'numbers',
    'numbers',
    'both',
    'spec_only',
    'single_column',
    true,
    60,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 1: High-frequency language / Numbers',
    'section-1:high-frequency-language:numbers:list'
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
    (1, $$1$$, $$один$$, $$один$$),
    (2, $$2$$, $$два$$, $$два$$),
    (3, $$3$$, $$три$$, $$три$$),
    (4, $$4$$, $$четыре$$, $$четыре$$),
    (5, $$5$$, $$пять$$, $$пять$$),
    (6, $$6$$, $$шесть$$, $$шесть$$),
    (7, $$7$$, $$семь$$, $$семь$$),
    (8, $$8$$, $$восемь$$, $$восемь$$),
    (9, $$9$$, $$девять$$, $$девять$$),
    (10, $$10$$, $$десять$$, $$десять$$),
    (11, $$11$$, $$одиннадцать$$, $$одиннадцать$$),
    (12, $$12$$, $$двенадцать$$, $$двенадцать$$),
    (13, $$13$$, $$тринадцать$$, $$тринадцать$$),
    (14, $$14$$, $$четырнадцать$$, $$четырнадцать$$),
    (15, $$15$$, $$пятнадцать$$, $$пятнадцать$$),
    (16, $$16$$, $$шестнадцать$$, $$шестнадцать$$),
    (17, $$17$$, $$семнадцать$$, $$семнадцать$$),
    (18, $$18$$, $$восемнадцать$$, $$восемнадцать$$),
    (19, $$19$$, $$девятнадцать$$, $$девятнадцать$$),
    (20, $$20$$, $$двадцать$$, $$двадцать$$),
    (21, $$21$$, $$двадцать один$$, $$двадцать один$$),
    (22, $$22$$, $$двадцать два$$, $$двадцать два$$),
    (23, $$23$$, $$двадцать три$$, $$двадцать три$$),
    (24, $$24$$, $$двадцать четыре$$, $$двадцать четыре$$),
    (25, $$25$$, $$двадцать пять$$, $$двадцать пять$$),
    (26, $$26$$, $$двадцать шесть$$, $$двадцать шесть$$),
    (27, $$27$$, $$двадцать семь$$, $$двадцать семь$$),
    (28, $$28$$, $$двадцать восемь$$, $$двадцать восемь$$),
    (29, $$29$$, $$двадцать девять$$, $$двадцать девять$$),
    (30, $$30$$, $$тридцать$$, $$тридцать$$),
    (31, $$31$$, $$тридцать один$$, $$тридцать один$$),
    (32, $$32 etc$$, $$тридцать два и т. д.$$, $$тридцать два и т. д.$$),
    (33, $$40$$, $$сорок$$, $$сорок$$),
    (34, $$50$$, $$пятьдесят$$, $$пятьдесят$$),
    (35, $$60$$, $$шестьдесят$$, $$шестьдесят$$),
    (36, $$70$$, $$семьдесят$$, $$семьдесят$$),
    (37, $$80$$, $$восемьдесят$$, $$восемьдесят$$),
    (38, $$90$$, $$девяносто$$, $$девяносто$$),
    (39, $$100$$, $$сто$$, $$сто$$),
    (40, $$101$$, $$сто один$$, $$сто один$$),
    (41, $$120$$, $$сто двадцать$$, $$сто двадцать$$),
    (42, $$200$$, $$двести$$, $$двести$$),
    (43, $$1000$$, $$тысяча$$, $$тысяча$$),
    (44, $$1100$$, $$тысяча сто$$, $$тысяча сто$$),
    (45, $$2000$$, $$две тысячи$$, $$две тысячи$$),
    (46, $$1.000.000$$, $$один миллион$$, $$один миллион$$),
    (47, $$2.000.000$$, $$два миллиона$$, $$два миллиона$$)
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
    (
      'section-1:high-frequency-language:numbers:item-' ||
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
    'number',
    'not_applicable',
    'unknown',
    'both',
    'high_frequency_language',
    'numbers',
    'numbers',
    'not_applicable',
    false,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 1: High-frequency language / Numbers',
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
  'Section 1: High-frequency language / Numbers',
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
