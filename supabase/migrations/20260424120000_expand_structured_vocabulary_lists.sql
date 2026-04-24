begin;

alter table public.vocabulary_sets
  add column if not exists source_key text,
  add column if not exists source_version text,
  add column if not exists import_key text;

alter table public.vocabulary_sets drop constraint if exists vocabulary_sets_tier_check;
alter table public.vocabulary_sets
  add constraint vocabulary_sets_tier_check
  check (tier in ('foundation', 'higher', 'both', 'unknown'));

alter table public.vocabulary_sets drop constraint if exists vocabulary_sets_set_type_check;
alter table public.vocabulary_sets
  add constraint vocabulary_sets_set_type_check
  check (
    set_type in (
      'specification',
      'core',
      'theme',
      'phrase_bank',
      'exam_prep',
      'lesson_custom'
    )
  );

create unique index if not exists vocabulary_sets_source_import_key_idx
  on public.vocabulary_sets (source_key, import_key)
  where source_key is not null and import_key is not null;

alter table public.vocabulary_items
  add column if not exists canonical_key text,
  add column if not exists part_of_speech text not null default 'unknown',
  add column if not exists gender text not null default 'unknown',
  add column if not exists plural text,
  add column if not exists productive_receptive text not null default 'unknown',
  add column if not exists tier text not null default 'unknown',
  add column if not exists theme_key text,
  add column if not exists topic_key text,
  add column if not exists category_key text,
  add column if not exists subcategory_key text,
  add column if not exists aspect text not null default 'unknown',
  add column if not exists case_governed text,
  add column if not exists is_reflexive boolean not null default false,
  add column if not exists source_key text,
  add column if not exists source_version text,
  add column if not exists source_section_ref text,
  add column if not exists import_key text;

alter table public.vocabulary_items drop constraint if exists vocabulary_items_part_of_speech_check;
alter table public.vocabulary_items
  add constraint vocabulary_items_part_of_speech_check
  check (
    part_of_speech in (
      'noun',
      'verb',
      'adjective',
      'adverb',
      'pronoun',
      'preposition',
      'conjunction',
      'number',
      'phrase',
      'interjection',
      'other',
      'unknown'
    )
  );

alter table public.vocabulary_items drop constraint if exists vocabulary_items_gender_check;
alter table public.vocabulary_items
  add constraint vocabulary_items_gender_check
  check (
    gender in (
      'masculine',
      'feminine',
      'neuter',
      'plural_only',
      'common',
      'not_applicable',
      'unknown'
    )
  );

alter table public.vocabulary_items drop constraint if exists vocabulary_items_productive_receptive_check;
alter table public.vocabulary_items
  add constraint vocabulary_items_productive_receptive_check
  check (productive_receptive in ('productive', 'receptive', 'both', 'unknown'));

alter table public.vocabulary_items drop constraint if exists vocabulary_items_tier_check;
alter table public.vocabulary_items
  add constraint vocabulary_items_tier_check
  check (tier in ('foundation', 'higher', 'both', 'unknown'));

alter table public.vocabulary_items drop constraint if exists vocabulary_items_aspect_check;
alter table public.vocabulary_items
  add constraint vocabulary_items_aspect_check
  check (aspect in ('perfective', 'imperfective', 'both', 'not_applicable', 'unknown'));

create unique index if not exists vocabulary_items_source_import_key_idx
  on public.vocabulary_items (source_key, import_key)
  where source_key is not null and import_key is not null;

create index if not exists vocabulary_items_canonical_key_idx
  on public.vocabulary_items (canonical_key);
create index if not exists vocabulary_items_part_of_speech_idx
  on public.vocabulary_items (part_of_speech);
create index if not exists vocabulary_items_productive_receptive_idx
  on public.vocabulary_items (productive_receptive);
create index if not exists vocabulary_items_tier_idx
  on public.vocabulary_items (tier);
create index if not exists vocabulary_items_theme_topic_idx
  on public.vocabulary_items (theme_key, topic_key);
create index if not exists vocabulary_items_category_idx
  on public.vocabulary_items (category_key, subcategory_key);

create table if not exists public.vocabulary_import_sources (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  title text not null,
  source_version text,
  publisher text,
  notes text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.vocabulary_import_sources enable row level security;

drop policy if exists "Allow authenticated read on vocabulary_import_sources"
  on public.vocabulary_import_sources;
create policy "Allow authenticated read on vocabulary_import_sources"
  on public.vocabulary_import_sources
  as permissive for select to authenticated using (true);

drop policy if exists "Admins can manage vocabulary_import_sources"
  on public.vocabulary_import_sources;
create policy "Admins can manage vocabulary_import_sources"
  on public.vocabulary_import_sources
  as permissive for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

create table if not exists public.vocabulary_import_batches (
  id uuid primary key default gen_random_uuid(),
  source_key text not null,
  source_version text,
  manifest_path text,
  manifest_hash text,
  review_status text not null default 'draft',
  import_status text not null default 'pending',
  dry_run_summary jsonb not null default '{}'::jsonb,
  imported_at timestamp with time zone,
  imported_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint vocabulary_import_batches_review_status_check
    check (review_status in ('draft', 'reviewed', 'approved')),
  constraint vocabulary_import_batches_import_status_check
    check (import_status in ('pending', 'dry_run', 'imported', 'failed'))
);

create unique index if not exists vocabulary_import_batches_manifest_hash_idx
  on public.vocabulary_import_batches (manifest_hash)
  where manifest_hash is not null;

alter table public.vocabulary_import_batches enable row level security;

drop policy if exists "Allow authenticated read on vocabulary_import_batches"
  on public.vocabulary_import_batches;
create policy "Allow authenticated read on vocabulary_import_batches"
  on public.vocabulary_import_batches
  as permissive for select to authenticated using (true);

drop policy if exists "Admins can manage vocabulary_import_batches"
  on public.vocabulary_import_batches;
create policy "Admins can manage vocabulary_import_batches"
  on public.vocabulary_import_batches
  as permissive for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

create table if not exists public.vocabulary_lists (
  id uuid primary key default gen_random_uuid(),
  vocabulary_set_id uuid not null references public.vocabulary_sets(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  theme_key text,
  topic_key text,
  category_key text,
  subcategory_key text,
  tier text not null default 'unknown',
  list_mode text not null default 'custom',
  default_display_variant text not null default 'single_column',
  is_published boolean not null default false,
  sort_order integer not null default 0,
  source_key text,
  source_version text,
  source_section_ref text,
  import_key text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint vocabulary_lists_tier_check
    check (tier in ('foundation', 'higher', 'both', 'unknown')),
  constraint vocabulary_lists_list_mode_check
    check (list_mode in ('spec_only', 'extended_only', 'spec_and_extended', 'custom')),
  constraint vocabulary_lists_default_display_variant_check
    check (default_display_variant in ('single_column', 'two_column', 'compact_cards')),
  constraint vocabulary_lists_set_slug_key unique (vocabulary_set_id, slug)
);

create unique index if not exists vocabulary_lists_source_import_key_idx
  on public.vocabulary_lists (source_key, import_key)
  where source_key is not null and import_key is not null;
create index if not exists vocabulary_lists_vocabulary_set_id_idx
  on public.vocabulary_lists (vocabulary_set_id);
create index if not exists vocabulary_lists_theme_topic_idx
  on public.vocabulary_lists (theme_key, topic_key);
create index if not exists vocabulary_lists_category_idx
  on public.vocabulary_lists (category_key, subcategory_key);
create index if not exists vocabulary_lists_sort_order_idx
  on public.vocabulary_lists (sort_order);
create index if not exists vocabulary_lists_is_published_idx
  on public.vocabulary_lists (is_published);

alter table public.vocabulary_lists enable row level security;

drop policy if exists "Allow authenticated read on vocabulary_lists"
  on public.vocabulary_lists;
create policy "Allow authenticated read on vocabulary_lists"
  on public.vocabulary_lists
  as permissive for select to authenticated using (true);

drop policy if exists "Admins can manage vocabulary_lists"
  on public.vocabulary_lists;
create policy "Admins can manage vocabulary_lists"
  on public.vocabulary_lists
  as permissive for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

create table if not exists public.vocabulary_list_items (
  id uuid primary key default gen_random_uuid(),
  vocabulary_list_id uuid not null references public.vocabulary_lists(id) on delete cascade,
  vocabulary_item_id uuid not null references public.vocabulary_items(id) on delete cascade,
  position integer not null default 0,
  productive_receptive_override text,
  tier_override text,
  notes_override text,
  source_section_ref text,
  import_key text,
  created_at timestamp with time zone not null default now(),
  constraint vocabulary_list_items_unique_item unique (vocabulary_list_id, vocabulary_item_id),
  constraint vocabulary_list_items_productive_receptive_override_check
    check (
      productive_receptive_override is null
      or productive_receptive_override in ('productive', 'receptive', 'both', 'unknown')
    ),
  constraint vocabulary_list_items_tier_override_check
    check (
      tier_override is null
      or tier_override in ('foundation', 'higher', 'both', 'unknown')
    )
);

create unique index if not exists vocabulary_list_items_import_key_idx
  on public.vocabulary_list_items (vocabulary_list_id, import_key)
  where import_key is not null;
create index if not exists vocabulary_list_items_vocabulary_item_id_idx
  on public.vocabulary_list_items (vocabulary_item_id);
create index if not exists vocabulary_list_items_position_idx
  on public.vocabulary_list_items (vocabulary_list_id, position);

alter table public.vocabulary_list_items enable row level security;

drop policy if exists "Allow authenticated read on vocabulary_list_items"
  on public.vocabulary_list_items;
create policy "Allow authenticated read on vocabulary_list_items"
  on public.vocabulary_list_items
  as permissive for select to authenticated using (true);

drop policy if exists "Admins can manage vocabulary_list_items"
  on public.vocabulary_list_items;
create policy "Admins can manage vocabulary_list_items"
  on public.vocabulary_list_items
  as permissive for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

insert into public.vocabulary_lists (
  vocabulary_set_id,
  slug,
  title,
  description,
  theme_key,
  topic_key,
  tier,
  list_mode,
  default_display_variant,
  is_published,
  sort_order,
  source_key,
  source_version,
  import_key
)
select
  id,
  coalesce(nullif(slug, ''), 'default-list'),
  title,
  description,
  theme_key,
  topic_key,
  tier,
  list_mode,
  default_display_variant,
  is_published,
  0,
  source_key,
  source_version,
  case
    when import_key is null then null
    else import_key || ':default-list'
  end
from public.vocabulary_sets
on conflict (vocabulary_set_id, slug) do nothing;

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
  nullif(items.productive_receptive, 'unknown'),
  nullif(items.tier, 'unknown'),
  items.source_section_ref,
  items.import_key
from public.vocabulary_items items
join public.vocabulary_lists lists
  on lists.vocabulary_set_id = items.vocabulary_set_id
where lists.sort_order = 0
on conflict (vocabulary_list_id, vocabulary_item_id) do nothing;

create table if not exists public.lesson_vocabulary_links (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  lesson_section_id uuid references public.lesson_sections(id) on delete cascade,
  lesson_block_id uuid references public.lesson_blocks(id) on delete cascade,
  link_type text not null,
  vocabulary_set_id uuid references public.vocabulary_sets(id) on delete cascade,
  vocabulary_list_id uuid references public.vocabulary_lists(id) on delete cascade,
  vocabulary_item_id uuid references public.vocabulary_items(id) on delete cascade,
  theme_key text,
  topic_key text,
  variant text not null,
  usage_type text not null default 'lesson_block',
  position integer not null default 0,
  created_at timestamp with time zone not null default now(),
  constraint lesson_vocabulary_links_link_type_check
    check (link_type in ('set', 'list', 'item', 'theme', 'topic')),
  constraint lesson_vocabulary_links_variant_check
    check (variant in ('foundation', 'higher', 'volna')),
  constraint lesson_vocabulary_links_usage_type_check
    check (usage_type in ('lesson_block', 'lesson_page', 'revision_page', 'other')),
  constraint lesson_vocabulary_links_target_check
    check (
      (link_type = 'set' and vocabulary_set_id is not null)
      or (link_type = 'list' and vocabulary_list_id is not null)
      or (link_type = 'item' and vocabulary_item_id is not null)
      or (link_type = 'theme' and theme_key is not null)
      or (link_type = 'topic' and topic_key is not null)
    )
);

create unique index if not exists lesson_vocabulary_links_block_target_unique
  on public.lesson_vocabulary_links (
    lesson_id,
    coalesce(lesson_block_id, '00000000-0000-0000-0000-000000000000'::uuid),
    link_type,
    coalesce(vocabulary_set_id, '00000000-0000-0000-0000-000000000000'::uuid),
    coalesce(vocabulary_list_id, '00000000-0000-0000-0000-000000000000'::uuid),
    coalesce(vocabulary_item_id, '00000000-0000-0000-0000-000000000000'::uuid),
    coalesce(theme_key, ''),
    coalesce(topic_key, ''),
    variant,
    usage_type
  );
create index if not exists lesson_vocabulary_links_lesson_id_idx
  on public.lesson_vocabulary_links (lesson_id);
create index if not exists lesson_vocabulary_links_list_id_idx
  on public.lesson_vocabulary_links (vocabulary_list_id);
create index if not exists lesson_vocabulary_links_variant_idx
  on public.lesson_vocabulary_links (variant);

alter table public.lesson_vocabulary_links enable row level security;

drop policy if exists "Allow authenticated read on lesson_vocabulary_links"
  on public.lesson_vocabulary_links;
create policy "Allow authenticated read on lesson_vocabulary_links"
  on public.lesson_vocabulary_links
  as permissive for select to authenticated using (true);

drop policy if exists "Admins can manage lesson_vocabulary_links"
  on public.lesson_vocabulary_links;
create policy "Admins can manage lesson_vocabulary_links"
  on public.lesson_vocabulary_links
  as permissive for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

commit;
