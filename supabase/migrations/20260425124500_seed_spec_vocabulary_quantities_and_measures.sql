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
    'high-frequency-language-quantities-and-measures',
    'Quantities and measures',
    'Spec-required high-frequency GCSE Russian quantities and measures from Section 1: High-frequency language.',
    'high_frequency_language',
    'quantities_and_measures',
    'both',
    'spec_only',
    'specification',
    'single_column',
    true,
    80,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'section-1:high-frequency-language:quantities-and-measures'
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
    'quantities-and-measures',
    'Quantities and measures',
    'Spec-required high-frequency GCSE Russian quantities and measures.',
    'high_frequency_language',
    'quantities_and_measures',
    'quantities_and_measures',
    'both',
    'spec_only',
    'single_column',
    true,
    80,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 1: High-frequency language / Quantities and measures',
    'section-1:high-frequency-language:quantities-and-measures:list'
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
  gender
) as (
  values
    (1, $$a bottle$$, $$бутылка$$, $$бутылка$$, 'noun', 'feminine'),
    (2, $$a box$$, $$коробка$$, $$коробка$$, 'noun', 'feminine'),
    (3, $$a jar$$, $$банка$$, $$банка$$, 'noun', 'feminine'),
    (4, $$a kilo$$, $$килограмм$$, $$килограмм$$, 'noun', 'masculine'),
    (5, $$a litre$$, $$литр$$, $$литр$$, 'noun', 'masculine'),
    (6, $$a little$$, $$немного$$, $$немного$$, 'adverb', 'not_applicable'),
    (7, $$a lot$$, $$много$$, $$много$$, 'adverb', 'not_applicable'),
    (8, $$a packet$$, $$пачка$$, $$пачка$$, 'noun', 'feminine'),
    (9, $$a piece$$, $$кусок$$, $$кусок$$, 'noun', 'masculine'),
    (10, $$a slice$$, $$кусочек$$, $$кусочек$$, 'noun', 'masculine'),
    (11, $$about a hundred$$, $$сотня$$, $$сотня$$, 'noun', 'feminine'),
    (12, $$centimetre$$, $$сантиметр$$, $$сантиметр$$, 'noun', 'masculine'),
    (13, $$enough$$, $$достаточно$$, $$достаточно$$, 'adverb', 'not_applicable'),
    (14, $$gramme$$, $$грамм$$, $$грамм$$, 'noun', 'masculine'),
    (15, $$half$$, $$половина$$, $$половина$$, 'noun', 'feminine'),
    (16, $$kilometre$$, $$километр$$, $$километр$$, 'noun', 'masculine'),
    (17, $$less$$, $$меньше$$, $$меньше$$, 'adverb', 'not_applicable'),
    (18, $$majority$$, $$большинство$$, $$большинство$$, 'noun', 'neuter'),
    (19, $$many$$, $$много$$, $$много$$, 'adverb', 'not_applicable'),
    (20, $$metre$$, $$метр$$, $$метр$$, 'noun', 'masculine'),
    (21, $$more$$, $$больше$$, $$больше$$, 'adverb', 'not_applicable'),
    (22, $$not much/not many$$, $$мало$$, $$мало$$, 'adverb', 'not_applicable'),
    (23, $$percent(age)$$, $$процент$$, $$процент$$, 'noun', 'masculine'),
    (24, $$quantity$$, $$количество$$, $$количество$$, 'noun', 'neuter'),
    (25, $$quarter$$, $$четверть$$, $$четверть$$, 'noun', 'feminine'),
    (26, $$several$$, $$несколько$$, $$несколько$$, 'number', 'not_applicable'),
    (27, $$some$$, $$некоторые$$, $$некоторые$$, 'pronoun', 'not_applicable'),
    (28, $$third$$, $$треть$$, $$треть$$, 'noun', 'feminine'),
    (29, $$too$$, $$слишком$$, $$слишком$$, 'adverb', 'not_applicable'),
    (30, $$weight$$, $$вес$$, $$вес$$, 'noun', 'masculine')
),
prepared_items as (
  select
    raw_items.position,
    raw_items.english,
    raw_items.russian,
    raw_items.spec_russian,
    raw_items.part_of_speech,
    raw_items.gender,
    case
      when raw_items.russian ~ '\s' then 'phrase'
      else 'word'
    end as item_type,
    (
      'section-1:high-frequency-language:quantities-and-measures:item-' ||
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
    'both',
    'high_frequency_language',
    'quantities_and_measures',
    'quantities_and_measures',
    'not_applicable',
    false,
    'pearson_edexcel_gcse_russian_1ru0',
    '1RU0',
    'Section 1: High-frequency language / Quantities and measures',
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
  'Section 1: High-frequency language / Quantities and measures',
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
