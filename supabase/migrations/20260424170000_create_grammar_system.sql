begin;

create table if not exists public.grammar_sets (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  theme_key text,
  topic_key text,
  tier text not null default 'both',
  sort_order integer not null default 0,
  is_published boolean not null default false,
  is_trial_visible boolean not null default false,
  requires_paid_access boolean not null default true,
  available_in_volna boolean not null default true,
  source_key text,
  source_version text,
  import_key text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint grammar_sets_tier_check
    check (tier in ('foundation', 'higher', 'both', 'unknown'))
);

create unique index if not exists grammar_sets_source_import_key_idx
  on public.grammar_sets (source_key, import_key)
  where source_key is not null and import_key is not null;
create index if not exists grammar_sets_theme_topic_idx
  on public.grammar_sets (theme_key, topic_key);
create index if not exists grammar_sets_tier_idx
  on public.grammar_sets (tier);
create index if not exists grammar_sets_sort_order_idx
  on public.grammar_sets (sort_order);
create index if not exists grammar_sets_is_published_idx
  on public.grammar_sets (is_published);
create index if not exists grammar_sets_access_idx
  on public.grammar_sets (
    is_trial_visible,
    requires_paid_access,
    available_in_volna
  );

alter table public.grammar_sets enable row level security;

drop policy if exists "Allow authenticated read on grammar_sets"
  on public.grammar_sets;
create policy "Allow authenticated read on grammar_sets"
  on public.grammar_sets
  as permissive for select to authenticated using (true);

drop policy if exists "Admins can manage grammar_sets"
  on public.grammar_sets;
create policy "Admins can manage grammar_sets"
  on public.grammar_sets
  as permissive for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

create table if not exists public.grammar_points (
  id uuid primary key default gen_random_uuid(),
  grammar_set_id uuid not null references public.grammar_sets(id) on delete cascade,
  slug text not null,
  title text not null,
  short_description text,
  full_explanation text,
  spec_reference text,
  grammar_tag_key text,
  category_key text,
  tier text not null default 'both',
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint grammar_points_tier_check
    check (tier in ('foundation', 'higher', 'both', 'unknown')),
  constraint grammar_points_set_slug_key unique (grammar_set_id, slug)
);

create index if not exists grammar_points_grammar_set_id_idx
  on public.grammar_points (grammar_set_id);
create index if not exists grammar_points_tag_idx
  on public.grammar_points (grammar_tag_key);
create index if not exists grammar_points_category_idx
  on public.grammar_points (category_key);
create index if not exists grammar_points_tier_idx
  on public.grammar_points (tier);
create index if not exists grammar_points_sort_order_idx
  on public.grammar_points (grammar_set_id, sort_order);
create index if not exists grammar_points_is_published_idx
  on public.grammar_points (is_published);

alter table public.grammar_points enable row level security;

drop policy if exists "Allow authenticated read on grammar_points"
  on public.grammar_points;
create policy "Allow authenticated read on grammar_points"
  on public.grammar_points
  as permissive for select to authenticated using (true);

drop policy if exists "Admins can manage grammar_points"
  on public.grammar_points;
create policy "Admins can manage grammar_points"
  on public.grammar_points
  as permissive for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

create table if not exists public.grammar_examples (
  id uuid primary key default gen_random_uuid(),
  grammar_point_id uuid not null references public.grammar_points(id) on delete cascade,
  russian_text text not null,
  english_translation text not null,
  optional_highlight text,
  note text,
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists grammar_examples_grammar_point_id_idx
  on public.grammar_examples (grammar_point_id);
create index if not exists grammar_examples_sort_order_idx
  on public.grammar_examples (grammar_point_id, sort_order);

alter table public.grammar_examples enable row level security;

drop policy if exists "Allow authenticated read on grammar_examples"
  on public.grammar_examples;
create policy "Allow authenticated read on grammar_examples"
  on public.grammar_examples
  as permissive for select to authenticated using (true);

drop policy if exists "Admins can manage grammar_examples"
  on public.grammar_examples;
create policy "Admins can manage grammar_examples"
  on public.grammar_examples
  as permissive for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

create table if not exists public.grammar_tables (
  id uuid primary key default gen_random_uuid(),
  grammar_point_id uuid not null references public.grammar_points(id) on delete cascade,
  title text not null,
  columns jsonb not null default '[]'::jsonb,
  rows jsonb not null default '[]'::jsonb,
  optional_note text,
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint grammar_tables_columns_json_array_check
    check (jsonb_typeof(columns) = 'array'),
  constraint grammar_tables_rows_json_array_check
    check (jsonb_typeof(rows) = 'array')
);

create index if not exists grammar_tables_grammar_point_id_idx
  on public.grammar_tables (grammar_point_id);
create index if not exists grammar_tables_sort_order_idx
  on public.grammar_tables (grammar_point_id, sort_order);

alter table public.grammar_tables enable row level security;

drop policy if exists "Allow authenticated read on grammar_tables"
  on public.grammar_tables;
create policy "Allow authenticated read on grammar_tables"
  on public.grammar_tables
  as permissive for select to authenticated using (true);

drop policy if exists "Admins can manage grammar_tables"
  on public.grammar_tables;
create policy "Admins can manage grammar_tables"
  on public.grammar_tables
  as permissive for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

create table if not exists public.lesson_grammar_links (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  lesson_section_id uuid references public.lesson_sections(id) on delete cascade,
  lesson_block_id uuid references public.lesson_blocks(id) on delete cascade,
  link_type text not null,
  grammar_set_id uuid references public.grammar_sets(id) on delete cascade,
  grammar_point_id uuid references public.grammar_points(id) on delete cascade,
  grammar_tag_key text,
  variant text not null,
  usage_type text not null default 'lesson_block',
  position integer not null default 0,
  created_at timestamp with time zone not null default now(),
  constraint lesson_grammar_links_link_type_check
    check (link_type in ('set', 'point', 'tag')),
  constraint lesson_grammar_links_variant_check
    check (variant in ('foundation', 'higher', 'volna')),
  constraint lesson_grammar_links_usage_type_check
    check (usage_type in ('lesson_block', 'lesson_page', 'explanation', 'practice', 'other')),
  constraint lesson_grammar_links_target_check
    check (
      (link_type = 'set' and grammar_set_id is not null)
      or (link_type = 'point' and grammar_point_id is not null)
      or (link_type = 'tag' and grammar_tag_key is not null)
    )
);

create unique index if not exists lesson_grammar_links_block_target_unique
  on public.lesson_grammar_links (
    lesson_id,
    coalesce(lesson_block_id, '00000000-0000-0000-0000-000000000000'::uuid),
    link_type,
    coalesce(grammar_set_id, '00000000-0000-0000-0000-000000000000'::uuid),
    coalesce(grammar_point_id, '00000000-0000-0000-0000-000000000000'::uuid),
    coalesce(grammar_tag_key, ''),
    variant,
    usage_type
  );
create index if not exists lesson_grammar_links_lesson_id_idx
  on public.lesson_grammar_links (lesson_id);
create index if not exists lesson_grammar_links_set_id_idx
  on public.lesson_grammar_links (grammar_set_id);
create index if not exists lesson_grammar_links_point_id_idx
  on public.lesson_grammar_links (grammar_point_id);
create index if not exists lesson_grammar_links_variant_idx
  on public.lesson_grammar_links (variant);

alter table public.lesson_grammar_links enable row level security;

drop policy if exists "Allow authenticated read on lesson_grammar_links"
  on public.lesson_grammar_links;
create policy "Allow authenticated read on lesson_grammar_links"
  on public.lesson_grammar_links
  as permissive for select to authenticated using (true);

drop policy if exists "Admins can manage lesson_grammar_links"
  on public.lesson_grammar_links;
create policy "Admins can manage lesson_grammar_links"
  on public.lesson_grammar_links
  as permissive for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

commit;
