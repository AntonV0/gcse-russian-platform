begin;

delete from public.vocabulary_list_items list_items
using public.vocabulary_lists lists,
  public.vocabulary_sets sets,
  public.vocabulary_items items
where list_items.vocabulary_list_id = lists.id
  and list_items.vocabulary_item_id = items.id
  and lists.vocabulary_set_id = sets.id
  and items.vocabulary_set_id = sets.id
  and sets.source_key = 'pearson_edexcel_gcse_russian_1ru0'
  and sets.import_key like 'section-2:%'
  and sets.list_mode = 'spec_only'
  and lists.list_mode = 'spec_only'
  and lists.tier in ('foundation', 'higher')
  and items.tier in ('foundation', 'higher')
  and lists.tier <> items.tier;

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
  lists.id,
  items.id,
  items.position,
  null,
  items.tier,
  coalesce(items.source_section_ref, lists.source_section_ref),
  items.import_key
from public.vocabulary_sets sets
join public.vocabulary_lists lists
  on lists.vocabulary_set_id = sets.id
join public.vocabulary_items items
  on items.vocabulary_set_id = sets.id
where sets.source_key = 'pearson_edexcel_gcse_russian_1ru0'
  and sets.import_key like 'section-2:%'
  and sets.list_mode = 'spec_only'
  and lists.list_mode = 'spec_only'
  and lists.tier in ('foundation', 'higher')
  and items.tier in ('foundation', 'higher')
  and lists.tier = items.tier
  and items.source_type = 'spec_required'
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
