begin;

create or replace function public.can_read_public_course_variant(
  target_course_id uuid,
  target_variant_id uuid
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.course_variants variant
    join public.courses course
      on course.id = variant.course_id
    where course.id = target_course_id
      and variant.id = target_variant_id
      and course.is_active = true
      and course.is_published = true
      and variant.is_active = true
      and variant.is_published = true
  );
$$;

create or replace function public.can_read_public_module(target_module_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.modules module
    join public.course_variants variant
      on variant.id = module.course_variant_id
    where module.id = target_module_id
      and module.is_published = true
      and public.can_read_public_course_variant(variant.course_id, variant.id)
  );
$$;

create or replace function public.can_read_public_lesson_content(
  target_lesson_id uuid
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.lessons lesson
    where lesson.id = target_lesson_id
      and lesson.is_published = true
      and public.can_read_public_module(lesson.module_id)
      and (
        lesson.requires_paid_access = false
        or lesson.is_trial_visible = true
      )
  );
$$;

create or replace function public.can_read_public_question_set(
  target_question_set_id uuid
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.lesson_question_sets linked_set
    where linked_set.question_set_id = target_question_set_id
      and public.can_read_public_lesson_content(linked_set.lesson_id)
  )
  or exists (
    select 1
    from public.question_sets question_set
    join public.lesson_blocks block
      on block.data ->> 'questionSetSlug' = question_set.slug
    join public.lesson_sections section
      on section.id = block.lesson_section_id
    where question_set.id = target_question_set_id
      and question_set.is_template = false
      and block.block_type = 'question-set'
      and block.is_published = true
      and section.is_published = true
      and public.can_read_public_lesson_content(section.lesson_id)
  );
$$;

create or replace function public.can_read_public_question(target_question_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.questions question
    where question.id = target_question_id
      and question.is_active = true
      and public.can_read_public_question_set(question.question_set_id)
  );
$$;

create or replace function public.can_read_public_grammar_set(
  target_grammar_set_id uuid
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.grammar_sets grammar_set
    where grammar_set.id = target_grammar_set_id
      and grammar_set.is_published = true
      and grammar_set.requires_paid_access = false
  );
$$;

create or replace function public.can_read_public_grammar_point(
  target_grammar_point_id uuid
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.grammar_points grammar_point
    where grammar_point.id = target_grammar_point_id
      and grammar_point.is_published = true
      and public.can_read_public_grammar_set(grammar_point.grammar_set_id)
  );
$$;

create or replace function public.can_read_public_vocabulary_set(
  target_vocabulary_set_id uuid
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.vocabulary_sets vocabulary_set
    where vocabulary_set.id = target_vocabulary_set_id
      and vocabulary_set.is_published = true
  );
$$;

create or replace function public.can_read_public_vocabulary_list(
  target_vocabulary_list_id uuid
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.vocabulary_lists vocabulary_list
    where vocabulary_list.id = target_vocabulary_list_id
      and vocabulary_list.is_published = true
      and public.can_read_public_vocabulary_set(vocabulary_list.vocabulary_set_id)
  );
$$;

create or replace function public.can_read_public_vocabulary_item(
  target_vocabulary_item_id uuid
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.vocabulary_items vocabulary_item
    where vocabulary_item.id = target_vocabulary_item_id
      and public.can_read_public_vocabulary_set(vocabulary_item.vocabulary_set_id)
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
            and public.can_read_public_vocabulary_list(list_item.vocabulary_list_id)
        )
      )
  );
$$;

create or replace function public.can_read_public_past_paper_resource(
  target_is_published boolean,
  target_requires_paid_access boolean
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select target_is_published = true
    and target_requires_paid_access = false;
$$;

create or replace function public.can_read_public_mock_exam(
  target_mock_exam_id uuid
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.mock_exam_sets exam
    where exam.id = target_mock_exam_id
      and exam.is_published = true
      and exam.requires_paid_access = false
  );
$$;

revoke all on function public.can_read_public_course_variant(uuid, uuid) from public;
revoke all on function public.can_read_public_module(uuid) from public;
revoke all on function public.can_read_public_lesson_content(uuid) from public;
revoke all on function public.can_read_public_question_set(uuid) from public;
revoke all on function public.can_read_public_question(uuid) from public;
revoke all on function public.can_read_public_grammar_set(uuid) from public;
revoke all on function public.can_read_public_grammar_point(uuid) from public;
revoke all on function public.can_read_public_vocabulary_set(uuid) from public;
revoke all on function public.can_read_public_vocabulary_list(uuid) from public;
revoke all on function public.can_read_public_vocabulary_item(uuid) from public;
revoke all on function public.can_read_public_past_paper_resource(boolean, boolean) from public;
revoke all on function public.can_read_public_mock_exam(uuid) from public;

grant execute on function public.can_read_public_course_variant(uuid, uuid) to anon;
grant execute on function public.can_read_public_module(uuid) to anon;
grant execute on function public.can_read_public_lesson_content(uuid) to anon;
grant execute on function public.can_read_public_question_set(uuid) to anon;
grant execute on function public.can_read_public_question(uuid) to anon;
grant execute on function public.can_read_public_grammar_set(uuid) to anon;
grant execute on function public.can_read_public_grammar_point(uuid) to anon;
grant execute on function public.can_read_public_vocabulary_set(uuid) to anon;
grant execute on function public.can_read_public_vocabulary_list(uuid) to anon;
grant execute on function public.can_read_public_vocabulary_item(uuid) to anon;
grant execute on function public.can_read_public_past_paper_resource(boolean, boolean) to anon;
grant execute on function public.can_read_public_mock_exam(uuid) to anon;

grant select on
  public.courses,
  public.course_variants,
  public.modules,
  public.lessons,
  public.lesson_sections,
  public.lesson_blocks,
  public.lesson_question_sets,
  public.question_sets,
  public.questions,
  public.question_options,
  public.grammar_sets,
  public.grammar_points,
  public.grammar_examples,
  public.grammar_tables,
  public.lesson_grammar_links,
  public.vocabulary_sets,
  public.vocabulary_lists,
  public.vocabulary_items,
  public.vocabulary_list_items,
  public.lesson_vocabulary_set_usages,
  public.lesson_vocabulary_links,
  public.past_paper_resources,
  public.mock_exam_sets,
  public.mock_exam_sections,
  public.mock_exam_questions
to anon;

grant select on
  public.vocabulary_item_coverage,
  public.vocabulary_set_summaries,
  public.grammar_point_coverage,
  public.grammar_set_summaries
to anon;

revoke insert, update, delete, truncate, trigger, references on
  public.courses,
  public.course_variants,
  public.modules,
  public.lessons,
  public.lesson_sections,
  public.lesson_blocks,
  public.question_sets,
  public.questions,
  public.question_options,
  public.grammar_sets,
  public.grammar_points,
  public.grammar_examples,
  public.grammar_tables,
  public.vocabulary_sets,
  public.vocabulary_lists,
  public.vocabulary_items,
  public.vocabulary_list_items,
  public.past_paper_resources,
  public.mock_exam_sets,
  public.mock_exam_sections,
  public.mock_exam_questions
from anon;

drop policy if exists "Public courses are readable" on public.courses;
create policy "Public courses are readable"
  on public.courses
  as permissive
  for select
  to anon
  using (is_active = true and is_published = true);

drop policy if exists "Public course variants are readable" on public.course_variants;
create policy "Public course variants are readable"
  on public.course_variants
  as permissive
  for select
  to anon
  using (public.can_read_public_course_variant(course_id, id));

drop policy if exists "Public modules are readable" on public.modules;
create policy "Public modules are readable"
  on public.modules
  as permissive
  for select
  to anon
  using (public.can_read_public_module(id));

drop policy if exists "Public lessons are readable" on public.lessons;
create policy "Public lessons are readable"
  on public.lessons
  as permissive
  for select
  to anon
  using (public.can_read_public_lesson_content(id));

drop policy if exists "Public lesson sections are readable" on public.lesson_sections;
create policy "Public lesson sections are readable"
  on public.lesson_sections
  as permissive
  for select
  to anon
  using (
    is_published = true
    and public.can_read_public_lesson_content(lesson_id)
  );

drop policy if exists "Public lesson blocks are readable" on public.lesson_blocks;
create policy "Public lesson blocks are readable"
  on public.lesson_blocks
  as permissive
  for select
  to anon
  using (
    is_published = true
    and exists (
      select 1
      from public.lesson_sections section
      where section.id = lesson_blocks.lesson_section_id
        and section.is_published = true
        and public.can_read_public_lesson_content(section.lesson_id)
    )
  );

drop policy if exists "Public lesson question links are readable" on public.lesson_question_sets;
create policy "Public lesson question links are readable"
  on public.lesson_question_sets
  as permissive
  for select
  to anon
  using (public.can_read_public_lesson_content(lesson_id));

drop policy if exists "Public question sets are readable" on public.question_sets;
create policy "Public question sets are readable"
  on public.question_sets
  as permissive
  for select
  to anon
  using (public.can_read_public_question_set(id));

drop policy if exists "Public questions are readable" on public.questions;
create policy "Public questions are readable"
  on public.questions
  as permissive
  for select
  to anon
  using (public.can_read_public_question(id));

drop policy if exists "Public question options are readable" on public.question_options;
create policy "Public question options are readable"
  on public.question_options
  as permissive
  for select
  to anon
  using (public.can_read_public_question(question_id));

drop policy if exists "Public grammar sets are readable" on public.grammar_sets;
create policy "Public grammar sets are readable"
  on public.grammar_sets
  as permissive
  for select
  to anon
  using (public.can_read_public_grammar_set(id));

drop policy if exists "Public grammar points are readable" on public.grammar_points;
create policy "Public grammar points are readable"
  on public.grammar_points
  as permissive
  for select
  to anon
  using (public.can_read_public_grammar_point(id));

drop policy if exists "Public grammar examples are readable" on public.grammar_examples;
create policy "Public grammar examples are readable"
  on public.grammar_examples
  as permissive
  for select
  to anon
  using (public.can_read_public_grammar_point(grammar_point_id));

drop policy if exists "Public grammar tables are readable" on public.grammar_tables;
create policy "Public grammar tables are readable"
  on public.grammar_tables
  as permissive
  for select
  to anon
  using (public.can_read_public_grammar_point(grammar_point_id));

drop policy if exists "Public lesson grammar links are readable" on public.lesson_grammar_links;
create policy "Public lesson grammar links are readable"
  on public.lesson_grammar_links
  as permissive
  for select
  to anon
  using (public.can_read_public_lesson_content(lesson_id));

drop policy if exists "Public vocabulary sets are readable" on public.vocabulary_sets;
create policy "Public vocabulary sets are readable"
  on public.vocabulary_sets
  as permissive
  for select
  to anon
  using (public.can_read_public_vocabulary_set(id));

drop policy if exists "Public vocabulary lists are readable" on public.vocabulary_lists;
create policy "Public vocabulary lists are readable"
  on public.vocabulary_lists
  as permissive
  for select
  to anon
  using (public.can_read_public_vocabulary_list(id));

drop policy if exists "Public vocabulary items are readable" on public.vocabulary_items;
create policy "Public vocabulary items are readable"
  on public.vocabulary_items
  as permissive
  for select
  to anon
  using (public.can_read_public_vocabulary_item(id));

drop policy if exists "Public vocabulary list items are readable" on public.vocabulary_list_items;
create policy "Public vocabulary list items are readable"
  on public.vocabulary_list_items
  as permissive
  for select
  to anon
  using (
    public.can_read_public_vocabulary_list(vocabulary_list_id)
    and public.can_read_public_vocabulary_item(vocabulary_item_id)
  );

drop policy if exists "Public lesson vocabulary set usages are readable" on public.lesson_vocabulary_set_usages;
create policy "Public lesson vocabulary set usages are readable"
  on public.lesson_vocabulary_set_usages
  as permissive
  for select
  to anon
  using (public.can_read_public_lesson_content(lesson_id));

drop policy if exists "Public lesson vocabulary links are readable" on public.lesson_vocabulary_links;
create policy "Public lesson vocabulary links are readable"
  on public.lesson_vocabulary_links
  as permissive
  for select
  to anon
  using (public.can_read_public_lesson_content(lesson_id));

drop policy if exists "Public past paper resources are readable" on public.past_paper_resources;
create policy "Public past paper resources are readable"
  on public.past_paper_resources
  as permissive
  for select
  to anon
  using (
    public.can_read_public_past_paper_resource(
      is_published,
      requires_paid_access
    )
  );

drop policy if exists "Public mock exams are readable" on public.mock_exam_sets;
create policy "Public mock exams are readable"
  on public.mock_exam_sets
  as permissive
  for select
  to anon
  using (public.can_read_public_mock_exam(id));

drop policy if exists "Public mock exam sections are readable" on public.mock_exam_sections;
create policy "Public mock exam sections are readable"
  on public.mock_exam_sections
  as permissive
  for select
  to anon
  using (public.can_read_public_mock_exam(mock_exam_id));

drop policy if exists "Public mock exam questions are readable" on public.mock_exam_questions;
create policy "Public mock exam questions are readable"
  on public.mock_exam_questions
  as permissive
  for select
  to anon
  using (
    exists (
      select 1
      from public.mock_exam_sections section
      where section.id = mock_exam_questions.section_id
        and public.can_read_public_mock_exam(section.mock_exam_id)
    )
  );

commit;
