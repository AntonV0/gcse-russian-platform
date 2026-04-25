begin;

create or replace function public.can_read_grammar_set(target_grammar_set_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.is_current_user_staff()
    or exists (
      select 1
      from public.grammar_sets grammar_set
      where grammar_set.id = target_grammar_set_id
        and grammar_set.is_published = true
        and public.current_user_has_exam_tier_access(
          grammar_set.tier,
          grammar_set.requires_paid_access,
          grammar_set.is_trial_visible,
          grammar_set.available_in_volna
        )
    );
$$;

create or replace function public.can_read_grammar_point(target_grammar_point_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.is_current_user_staff()
    or exists (
      select 1
      from public.grammar_points grammar_point
      where grammar_point.id = target_grammar_point_id
        and grammar_point.is_published = true
        and public.can_read_grammar_set(grammar_point.grammar_set_id)
    );
$$;

create or replace function public.can_read_vocabulary_set(target_vocabulary_set_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.is_current_user_staff()
    or exists (
      select 1
      from public.vocabulary_sets vocabulary_set
      where vocabulary_set.id = target_vocabulary_set_id
        and vocabulary_set.is_published = true
    );
$$;

create or replace function public.can_read_vocabulary_list(target_vocabulary_list_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.is_current_user_staff()
    or exists (
      select 1
      from public.vocabulary_lists vocabulary_list
      where vocabulary_list.id = target_vocabulary_list_id
        and vocabulary_list.is_published = true
        and public.can_read_vocabulary_set(vocabulary_list.vocabulary_set_id)
    );
$$;

create or replace function public.can_read_vocabulary_item(target_vocabulary_item_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.is_current_user_staff()
    or exists (
      select 1
      from public.vocabulary_items vocabulary_item
      where vocabulary_item.id = target_vocabulary_item_id
        and public.can_read_vocabulary_set(vocabulary_item.vocabulary_set_id)
        and (
          not exists (
            select 1
            from public.vocabulary_list_items any_list_item
            join public.vocabulary_lists any_list
              on any_list.id = any_list_item.vocabulary_list_id
            where any_list.vocabulary_set_id = vocabulary_item.vocabulary_set_id
          )
          or exists (
            select 1
            from public.vocabulary_list_items list_item
            where list_item.vocabulary_item_id = vocabulary_item.id
              and public.can_read_vocabulary_list(list_item.vocabulary_list_id)
          )
        )
    );
$$;

revoke all on function public.can_read_grammar_set(uuid) from public;
revoke all on function public.can_read_grammar_point(uuid) from public;
revoke all on function public.can_read_vocabulary_set(uuid) from public;
revoke all on function public.can_read_vocabulary_list(uuid) from public;
revoke all on function public.can_read_vocabulary_item(uuid) from public;

grant execute on function public.can_read_grammar_set(uuid) to authenticated;
grant execute on function public.can_read_grammar_point(uuid) to authenticated;
grant execute on function public.can_read_vocabulary_set(uuid) to authenticated;
grant execute on function public.can_read_vocabulary_list(uuid) to authenticated;
grant execute on function public.can_read_vocabulary_item(uuid) to authenticated;

create index if not exists grammar_examples_point_sort_idx
  on public.grammar_examples (grammar_point_id, sort_order);

create index if not exists grammar_tables_point_sort_idx
  on public.grammar_tables (grammar_point_id, sort_order);

create index if not exists vocabulary_lists_set_published_idx
  on public.vocabulary_lists (vocabulary_set_id, is_published, sort_order);

create index if not exists vocabulary_list_items_list_item_idx
  on public.vocabulary_list_items (vocabulary_list_id, vocabulary_item_id);

drop policy if exists "Allow authenticated read on grammar_sets" on public.grammar_sets;
create policy "Accessible grammar sets are readable"
  on public.grammar_sets
  as permissive
  for select
  to authenticated
  using (public.can_read_grammar_set(id));

drop policy if exists "Allow authenticated read on grammar_points" on public.grammar_points;
create policy "Accessible grammar points are readable"
  on public.grammar_points
  as permissive
  for select
  to authenticated
  using (public.can_read_grammar_point(id));

drop policy if exists "Allow authenticated read on grammar_examples" on public.grammar_examples;
create policy "Accessible grammar examples are readable"
  on public.grammar_examples
  as permissive
  for select
  to authenticated
  using (public.can_read_grammar_point(grammar_point_id));

drop policy if exists "Allow authenticated read on grammar_tables" on public.grammar_tables;
create policy "Accessible grammar tables are readable"
  on public.grammar_tables
  as permissive
  for select
  to authenticated
  using (public.can_read_grammar_point(grammar_point_id));

drop policy if exists "Allow authenticated read on lesson_grammar_links" on public.lesson_grammar_links;
create policy "Accessible lesson grammar links are readable"
  on public.lesson_grammar_links
  as permissive
  for select
  to authenticated
  using (
    public.is_current_user_staff()
    or public.can_read_lesson_content(lesson_id)
  );

drop policy if exists "Allow authenticated read on vocabulary_sets" on public.vocabulary_sets;
create policy "Published vocabulary sets are readable"
  on public.vocabulary_sets
  as permissive
  for select
  to authenticated
  using (public.can_read_vocabulary_set(id));

drop policy if exists "Allow authenticated read on vocabulary_lists" on public.vocabulary_lists;
create policy "Published vocabulary lists are readable"
  on public.vocabulary_lists
  as permissive
  for select
  to authenticated
  using (public.can_read_vocabulary_list(id));

drop policy if exists "Allow authenticated read on vocabulary_items" on public.vocabulary_items;
create policy "Published vocabulary items are readable"
  on public.vocabulary_items
  as permissive
  for select
  to authenticated
  using (public.can_read_vocabulary_item(id));

drop policy if exists "Allow authenticated read on vocabulary_list_items" on public.vocabulary_list_items;
create policy "Published vocabulary list items are readable"
  on public.vocabulary_list_items
  as permissive
  for select
  to authenticated
  using (
    public.can_read_vocabulary_list(vocabulary_list_id)
    and public.can_read_vocabulary_item(vocabulary_item_id)
  );

drop policy if exists "Allow authenticated read on lesson_vocabulary_set_usages" on public.lesson_vocabulary_set_usages;
create policy "Accessible lesson vocabulary usages are readable"
  on public.lesson_vocabulary_set_usages
  as permissive
  for select
  to authenticated
  using (
    public.is_current_user_staff()
    or public.can_read_lesson_content(lesson_id)
  );

drop policy if exists "Allow authenticated read on lesson_vocabulary_links" on public.lesson_vocabulary_links;
create policy "Accessible lesson vocabulary links are readable"
  on public.lesson_vocabulary_links
  as permissive
  for select
  to authenticated
  using (
    public.is_current_user_staff()
    or public.can_read_lesson_content(lesson_id)
  );

drop policy if exists "Allow authenticated read on vocabulary_import_sources" on public.vocabulary_import_sources;
create policy "Staff can read vocabulary import sources"
  on public.vocabulary_import_sources
  as permissive
  for select
  to authenticated
  using (public.is_current_user_staff());

drop policy if exists "Allow authenticated read on vocabulary_import_batches" on public.vocabulary_import_batches;
create policy "Staff can read vocabulary import batches"
  on public.vocabulary_import_batches
  as permissive
  for select
  to authenticated
  using (public.is_current_user_staff());

create or replace view public.vocabulary_item_coverage
with (security_invoker = true)
as
with item_lesson_links as (
  select distinct
    items.id as vocabulary_item_id,
    links.variant,
    links.lesson_id
  from public.vocabulary_items items
  join public.lesson_vocabulary_links links
    on links.vocabulary_item_id = items.id
    or links.vocabulary_set_id = items.vocabulary_set_id
    or exists (
      select 1
      from public.vocabulary_list_items list_items
      where list_items.vocabulary_list_id = links.vocabulary_list_id
        and list_items.vocabulary_item_id = items.id
    )
  where links.variant in ('foundation', 'higher', 'volna')
),
legacy_set_lesson_usages as (
  select distinct
    items.id as vocabulary_item_id,
    usages.variant,
    usages.lesson_id
  from public.vocabulary_items items
  join public.lesson_vocabulary_set_usages usages
    on usages.vocabulary_set_id = items.vocabulary_set_id
  where usages.variant in ('foundation', 'higher', 'volna')
),
lesson_coverage as (
  select distinct vocabulary_item_id, variant, lesson_id
  from item_lesson_links
  union
  select distinct vocabulary_item_id, variant, lesson_id
  from legacy_set_lesson_usages
),
lesson_counts as (
  select
    vocabulary_item_id,
    count(*) filter (where variant = 'foundation') as foundation_occurrences,
    count(*) filter (where variant = 'higher') as higher_occurrences,
    count(*) filter (where variant = 'volna') as volna_occurrences
  from lesson_coverage
  group by vocabulary_item_id
),
custom_list_counts as (
  select
    list_items.vocabulary_item_id,
    count(*) as custom_list_occurrences
  from public.vocabulary_list_items list_items
  join public.vocabulary_lists lists
    on lists.id = list_items.vocabulary_list_id
  where lists.list_mode = 'custom'
  group by list_items.vocabulary_item_id
)
select
  items.id as vocabulary_item_id,
  coalesce(lesson_counts.foundation_occurrences, 0) > 0 as used_in_foundation,
  coalesce(lesson_counts.higher_occurrences, 0) > 0 as used_in_higher,
  coalesce(lesson_counts.volna_occurrences, 0) > 0 as used_in_volna,
  coalesce(custom_list_counts.custom_list_occurrences, 0) > 0 as used_in_custom_list,
  coalesce(lesson_counts.foundation_occurrences, 0)::integer as foundation_occurrences,
  coalesce(lesson_counts.higher_occurrences, 0)::integer as higher_occurrences,
  coalesce(lesson_counts.volna_occurrences, 0)::integer as volna_occurrences,
  coalesce(custom_list_counts.custom_list_occurrences, 0)::integer as custom_list_occurrences
from public.vocabulary_items items
left join lesson_counts
  on lesson_counts.vocabulary_item_id = items.id
left join custom_list_counts
  on custom_list_counts.vocabulary_item_id = items.id;

grant select on public.vocabulary_item_coverage to authenticated;

commit;
