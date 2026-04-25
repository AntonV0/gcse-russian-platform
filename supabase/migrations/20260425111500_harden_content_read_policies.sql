begin;

create or replace function public.is_current_user_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
      select 1
      from public.profiles
      where id = auth.uid()
        and (is_admin = true or is_teacher = true)
    )
    or exists (
      select 1
      from public.teaching_group_members
      where user_id = auth.uid()
        and member_role in ('teacher', 'assistant')
    );
$$;

create or replace function public.current_user_has_course_variant_access(
  target_course_id uuid,
  target_course_variant_id uuid,
  allow_volna boolean default false
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
      select 1
      from public.user_access_grants grant_row
      join public.products product
        on product.id = grant_row.product_id
      where grant_row.user_id = auth.uid()
        and grant_row.is_active = true
        and (grant_row.starts_at is null or grant_row.starts_at <= now())
        and (grant_row.ends_at is null or grant_row.ends_at >= now())
        and product.is_active = true
        and product.course_id = target_course_id
        and product.course_variant_id = target_course_variant_id
        and (
          grant_row.access_mode = 'full'
          or (allow_volna = true and grant_row.access_mode = 'volna')
        )
    )
    or exists (
      select 1
      from public.courses course_row
      join public.course_variants variant_row
        on variant_row.course_id = course_row.id
      join public.user_course_access legacy_access
        on legacy_access.course_slug = course_row.slug
       and legacy_access.course_variant = variant_row.slug
      where course_row.id = target_course_id
        and variant_row.id = target_course_variant_id
        and legacy_access.user_id = auth.uid()
        and (
          legacy_access.access_mode = 'full'
          or (allow_volna = true and legacy_access.access_mode = 'volna')
        )
    );
$$;

create or replace function public.current_user_has_exam_tier_access(
  target_tier text,
  target_requires_paid_access boolean,
  target_is_trial_visible boolean,
  target_available_in_volna boolean
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select target_requires_paid_access = false
    or exists (
      select 1
      from public.user_access_grants grant_row
      join public.products product
        on product.id = grant_row.product_id
      left join public.course_variants variant_row
        on variant_row.id = product.course_variant_id
      where grant_row.user_id = auth.uid()
        and grant_row.is_active = true
        and (grant_row.starts_at is null or grant_row.starts_at <= now())
        and (grant_row.ends_at is null or grant_row.ends_at >= now())
        and product.is_active = true
        and (
          (
            target_available_in_volna = true
            and grant_row.access_mode = 'volna'
          )
          or (
            grant_row.access_mode = 'full'
            and (
              target_tier = 'both'
              or variant_row.slug = target_tier
            )
          )
          or (
            target_is_trial_visible = true
            and grant_row.access_mode = 'trial'
            and (
              target_tier = 'both'
              or variant_row.slug = target_tier
            )
          )
        )
    )
    or exists (
      select 1
      from public.user_course_access legacy_access
      where legacy_access.user_id = auth.uid()
        and (
          (
            target_available_in_volna = true
            and legacy_access.access_mode = 'volna'
          )
          or (
            legacy_access.access_mode = 'full'
            and (
              target_tier = 'both'
              or legacy_access.course_variant = target_tier
            )
          )
          or (
            target_is_trial_visible = true
            and legacy_access.access_mode = 'trial'
            and (
              target_tier = 'both'
              or legacy_access.course_variant = target_tier
            )
          )
        )
    );
$$;

create or replace function public.can_read_lesson_content(target_lesson_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.is_current_user_staff()
    or exists (
      select 1
      from public.lessons lesson
      join public.modules module
        on module.id = lesson.module_id
      join public.course_variants variant
        on variant.id = module.course_variant_id
      join public.courses course
        on course.id = variant.course_id
      where lesson.id = target_lesson_id
        and lesson.is_published = true
        and module.is_published = true
        and variant.is_active = true
        and variant.is_published = true
        and course.is_active = true
        and course.is_published = true
        and (
          lesson.is_trial_visible = true
          or lesson.requires_paid_access = false
          or public.current_user_has_course_variant_access(
            course.id,
            variant.id,
            lesson.available_in_volna
          )
        )
    );
$$;

create or replace function public.can_read_question_set(target_question_set_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.is_current_user_staff()
    or exists (
      select 1
      from public.question_sets question_set
      where question_set.id = target_question_set_id
        and question_set.is_template = false
        and question_set.source_type <> 'lesson'
    )
    or exists (
      select 1
      from public.lesson_question_sets linked_set
      where linked_set.question_set_id = target_question_set_id
        and public.can_read_lesson_content(linked_set.lesson_id)
    )
    or exists (
      select 1
      from public.question_sets question_set
      join public.lesson_blocks block
        on block.data ->> 'questionSetSlug' = question_set.slug
      join public.lesson_sections section
        on section.id = block.lesson_section_id
      where question_set.id = target_question_set_id
        and block.block_type = 'question-set'
        and block.is_published = true
        and section.is_published = true
        and public.can_read_lesson_content(section.lesson_id)
    );
$$;

create or replace function public.can_read_question(target_question_id uuid)
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
      and public.can_read_question_set(question.question_set_id)
  );
$$;

create or replace function public.can_read_mock_exam(target_mock_exam_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.is_current_user_staff()
    or exists (
      select 1
      from public.mock_exam_sets exam
      where exam.id = target_mock_exam_id
        and exam.is_published = true
        and public.current_user_has_exam_tier_access(
          exam.tier,
          exam.requires_paid_access,
          exam.is_trial_visible,
          exam.available_in_volna
        )
    );
$$;

create or replace function public.can_read_past_paper_resource(
  target_tier text,
  target_is_published boolean,
  target_requires_paid_access boolean,
  target_is_trial_visible boolean,
  target_available_in_volna boolean
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.is_current_user_staff()
    or (
      target_is_published = true
      and public.current_user_has_exam_tier_access(
        target_tier,
        target_requires_paid_access,
        target_is_trial_visible,
        target_available_in_volna
      )
    );
$$;

revoke all on function public.is_current_user_staff() from public;
revoke all on function public.current_user_has_course_variant_access(uuid, uuid, boolean) from public;
revoke all on function public.current_user_has_exam_tier_access(text, boolean, boolean, boolean) from public;
revoke all on function public.can_read_lesson_content(uuid) from public;
revoke all on function public.can_read_question_set(uuid) from public;
revoke all on function public.can_read_question(uuid) from public;
revoke all on function public.can_read_mock_exam(uuid) from public;
revoke all on function public.can_read_past_paper_resource(text, boolean, boolean, boolean, boolean) from public;

grant execute on function public.is_current_user_staff() to authenticated;
grant execute on function public.current_user_has_course_variant_access(uuid, uuid, boolean) to authenticated;
grant execute on function public.current_user_has_exam_tier_access(text, boolean, boolean, boolean) to authenticated;
grant execute on function public.can_read_lesson_content(uuid) to authenticated;
grant execute on function public.can_read_question_set(uuid) to authenticated;
grant execute on function public.can_read_question(uuid) to authenticated;
grant execute on function public.can_read_mock_exam(uuid) to authenticated;
grant execute on function public.can_read_past_paper_resource(text, boolean, boolean, boolean, boolean) to authenticated;

create index if not exists user_access_grants_user_active_product_idx
  on public.user_access_grants (user_id, is_active, product_id);

create index if not exists products_course_variant_active_idx
  on public.products (course_id, course_variant_id, is_active);

create index if not exists lessons_module_published_idx
  on public.lessons (module_id, is_published);

create index if not exists lesson_sections_lesson_published_idx
  on public.lesson_sections (lesson_id, is_published);

create index if not exists lesson_blocks_section_published_idx
  on public.lesson_blocks (lesson_section_id, is_published);

create index if not exists lesson_blocks_question_set_slug_idx
  on public.lesson_blocks ((data ->> 'questionSetSlug'))
  where block_type = 'question-set';

create index if not exists question_options_question_id_idx
  on public.question_options (question_id);

create index if not exists question_accepted_answers_question_id_idx
  on public.question_accepted_answers (question_id);

drop policy if exists "Allow authenticated read on courses" on public.courses;
create policy "Published courses are readable"
  on public.courses
  as permissive
  for select
  to authenticated
  using (
    public.is_current_user_staff()
    or (is_active = true and is_published = true)
  );

drop policy if exists "Allow authenticated read on course_variants" on public.course_variants;
create policy "Published course variants are readable"
  on public.course_variants
  as permissive
  for select
  to authenticated
  using (
    public.is_current_user_staff()
    or (
      is_active = true
      and is_published = true
      and exists (
        select 1
        from public.courses course
        where course.id = course_variants.course_id
          and course.is_active = true
          and course.is_published = true
      )
    )
  );

drop policy if exists "Allow authenticated read on modules" on public.modules;
create policy "Published modules are readable"
  on public.modules
  as permissive
  for select
  to authenticated
  using (
    public.is_current_user_staff()
    or (
      is_published = true
      and exists (
        select 1
        from public.course_variants variant
        join public.courses course
          on course.id = variant.course_id
        where variant.id = modules.course_variant_id
          and variant.is_active = true
          and variant.is_published = true
          and course.is_active = true
          and course.is_published = true
      )
    )
  );

drop policy if exists "Allow authenticated read on lessons" on public.lessons;
create policy "Published lesson metadata is readable"
  on public.lessons
  as permissive
  for select
  to authenticated
  using (
    public.is_current_user_staff()
    or (
      is_published = true
      and exists (
        select 1
        from public.modules module
        join public.course_variants variant
          on variant.id = module.course_variant_id
        join public.courses course
          on course.id = variant.course_id
        where module.id = lessons.module_id
          and module.is_published = true
          and variant.is_active = true
          and variant.is_published = true
          and course.is_active = true
          and course.is_published = true
      )
    )
  );

drop policy if exists "Allow authenticated read on lesson_sections" on public.lesson_sections;
create policy "Accessible published lesson sections are readable"
  on public.lesson_sections
  as permissive
  for select
  to authenticated
  using (
    public.is_current_user_staff()
    or (
      is_published = true
      and public.can_read_lesson_content(lesson_id)
    )
  );

drop policy if exists "Allow authenticated read on lesson_blocks" on public.lesson_blocks;
create policy "Accessible published lesson blocks are readable"
  on public.lesson_blocks
  as permissive
  for select
  to authenticated
  using (
    public.is_current_user_staff()
    or (
      is_published = true
      and exists (
        select 1
        from public.lesson_sections section
        where section.id = lesson_blocks.lesson_section_id
          and section.is_published = true
          and public.can_read_lesson_content(section.lesson_id)
      )
    )
  );

drop policy if exists "Allow authenticated read on lesson_question_sets" on public.lesson_question_sets;
create policy "Accessible lesson question links are readable"
  on public.lesson_question_sets
  as permissive
  for select
  to authenticated
  using (
    public.is_current_user_staff()
    or public.can_read_lesson_content(lesson_id)
  );

drop policy if exists "Allow authenticated read on question_sets" on public.question_sets;
create policy "Accessible question sets are readable"
  on public.question_sets
  as permissive
  for select
  to authenticated
  using (public.can_read_question_set(id));

drop policy if exists "Allow authenticated read on questions" on public.questions;
create policy "Accessible active questions are readable"
  on public.questions
  as permissive
  for select
  to authenticated
  using (
    public.is_current_user_staff()
    or (
      is_active = true
      and public.can_read_question_set(question_set_id)
    )
  );

drop policy if exists "Allow authenticated read on question_options" on public.question_options;
create policy "Accessible question options are readable"
  on public.question_options
  as permissive
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.questions question
      where question.id = question_options.question_id
        and public.can_read_question(question.id)
    )
  );

drop policy if exists "Allow authenticated read on question_accepted_answers" on public.question_accepted_answers;
create policy "Accessible question accepted answers are readable"
  on public.question_accepted_answers
  as permissive
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.questions question
      where question.id = question_accepted_answers.question_id
        and public.can_read_question(question.id)
    )
  );

drop policy if exists "Allow authenticated read on past_paper_resources" on public.past_paper_resources;
create policy "Accessible past paper resources are readable"
  on public.past_paper_resources
  as permissive
  for select
  to authenticated
  using (
    public.can_read_past_paper_resource(
      tier,
      is_published,
      requires_paid_access,
      is_trial_visible,
      available_in_volna
    )
  );

drop policy if exists "Allow authenticated read on mock_exam_sets" on public.mock_exam_sets;
create policy "Published mock exam metadata is readable"
  on public.mock_exam_sets
  as permissive
  for select
  to authenticated
  using (
    public.is_current_user_staff()
    or is_published = true
  );

drop policy if exists "Allow authenticated read on mock_exam_sections" on public.mock_exam_sections;
create policy "Accessible mock exam sections are readable"
  on public.mock_exam_sections
  as permissive
  for select
  to authenticated
  using (
    public.is_current_user_staff()
    or public.can_read_mock_exam(mock_exam_id)
  );

drop policy if exists "Allow authenticated read on mock_exam_questions" on public.mock_exam_questions;
create policy "Accessible mock exam questions are readable"
  on public.mock_exam_questions
  as permissive
  for select
  to authenticated
  using (
    public.is_current_user_staff()
    or exists (
      select 1
      from public.mock_exam_sections section
      where section.id = mock_exam_questions.section_id
        and public.can_read_mock_exam(section.mock_exam_id)
    )
  );

commit;
