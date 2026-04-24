begin;

create table if not exists public.past_paper_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  exam_series text not null,
  paper_number integer not null,
  paper_name text not null,
  tier text not null default 'both',
  resource_type text not null,
  official_url text not null,
  source_label text not null default 'Pearson',
  is_official boolean not null default true,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  is_trial_visible boolean not null default true,
  requires_paid_access boolean not null default false,
  available_in_volna boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint past_paper_resources_paper_number_check
    check (paper_number in (1, 2, 3, 4)),
  constraint past_paper_resources_paper_name_check
    check (
      paper_name in (
        'Paper 1 Listening',
        'Paper 2 Speaking',
        'Paper 3 Reading',
        'Paper 4 Writing'
      )
    ),
  constraint past_paper_resources_tier_check
    check (tier in ('foundation', 'higher', 'both')),
  constraint past_paper_resources_resource_type_check
    check (
      resource_type in (
        'question_paper',
        'mark_scheme',
        'transcript',
        'audio',
        'examiner_report',
        'sample_assessment_material',
        'other'
      )
    ),
  constraint past_paper_resources_official_url_check
    check (official_url ~* '^https?://')
);

create index if not exists past_paper_resources_series_idx
  on public.past_paper_resources (exam_series);
create index if not exists past_paper_resources_paper_idx
  on public.past_paper_resources (paper_number, paper_name);
create index if not exists past_paper_resources_tier_idx
  on public.past_paper_resources (tier);
create index if not exists past_paper_resources_resource_type_idx
  on public.past_paper_resources (resource_type);
create index if not exists past_paper_resources_published_sort_idx
  on public.past_paper_resources (is_published, sort_order, exam_series);
create index if not exists past_paper_resources_access_idx
  on public.past_paper_resources (
    is_trial_visible,
    requires_paid_access,
    available_in_volna
  );

alter table public.past_paper_resources enable row level security;

drop policy if exists "Allow authenticated read on past_paper_resources"
  on public.past_paper_resources;
create policy "Allow authenticated read on past_paper_resources"
  on public.past_paper_resources
  as permissive for select to authenticated using (true);

drop policy if exists "Admins can manage past_paper_resources"
  on public.past_paper_resources;
create policy "Admins can manage past_paper_resources"
  on public.past_paper_resources
  as permissive for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

create table if not exists public.mock_exam_sets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  paper_number integer not null,
  paper_name text not null,
  tier text not null default 'both',
  time_limit_minutes integer,
  total_marks numeric(6,2) not null default 0,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  is_trial_visible boolean not null default false,
  requires_paid_access boolean not null default true,
  available_in_volna boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint mock_exam_sets_paper_number_check
    check (paper_number in (1, 2, 3, 4)),
  constraint mock_exam_sets_paper_name_check
    check (
      paper_name in (
        'Paper 1 Listening',
        'Paper 2 Speaking',
        'Paper 3 Reading',
        'Paper 4 Writing'
      )
    ),
  constraint mock_exam_sets_tier_check
    check (tier in ('foundation', 'higher', 'both')),
  constraint mock_exam_sets_time_limit_check
    check (time_limit_minutes is null or time_limit_minutes > 0),
  constraint mock_exam_sets_total_marks_check
    check (total_marks >= 0)
);

create index if not exists mock_exam_sets_paper_idx
  on public.mock_exam_sets (paper_number, paper_name);
create index if not exists mock_exam_sets_tier_idx
  on public.mock_exam_sets (tier);
create index if not exists mock_exam_sets_published_sort_idx
  on public.mock_exam_sets (is_published, sort_order, title);
create index if not exists mock_exam_sets_access_idx
  on public.mock_exam_sets (
    is_trial_visible,
    requires_paid_access,
    available_in_volna
  );

alter table public.mock_exam_sets enable row level security;

drop policy if exists "Allow authenticated read on mock_exam_sets"
  on public.mock_exam_sets;
create policy "Allow authenticated read on mock_exam_sets"
  on public.mock_exam_sets
  as permissive for select to authenticated using (true);

drop policy if exists "Admins can manage mock_exam_sets"
  on public.mock_exam_sets;
create policy "Admins can manage mock_exam_sets"
  on public.mock_exam_sets
  as permissive for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

create table if not exists public.mock_exam_sections (
  id uuid primary key default gen_random_uuid(),
  mock_exam_id uuid not null references public.mock_exam_sets(id) on delete cascade,
  title text not null,
  instructions text,
  section_type text not null,
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint mock_exam_sections_section_type_check
    check (
      section_type in (
        'listening',
        'speaking',
        'reading',
        'writing',
        'translation',
        'mixed',
        'other'
      )
    )
);

create index if not exists mock_exam_sections_exam_sort_idx
  on public.mock_exam_sections (mock_exam_id, sort_order, title);
create index if not exists mock_exam_sections_section_type_idx
  on public.mock_exam_sections (section_type);

alter table public.mock_exam_sections enable row level security;

drop policy if exists "Allow authenticated read on mock_exam_sections"
  on public.mock_exam_sections;
create policy "Allow authenticated read on mock_exam_sections"
  on public.mock_exam_sections
  as permissive for select to authenticated using (true);

drop policy if exists "Admins can manage mock_exam_sections"
  on public.mock_exam_sections;
create policy "Admins can manage mock_exam_sections"
  on public.mock_exam_sections
  as permissive for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

create table if not exists public.mock_exam_questions (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.mock_exam_sections(id) on delete cascade,
  question_type text not null,
  prompt text not null,
  data jsonb not null default '{}'::jsonb,
  marks numeric(6,2) not null default 1,
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint mock_exam_questions_data_object_check
    check (jsonb_typeof(data) = 'object'),
  constraint mock_exam_questions_marks_check
    check (marks >= 0),
  constraint mock_exam_questions_question_type_check
    check (
      question_type in (
        'multiple_choice',
        'multiple_response',
        'short_answer',
        'gap_fill',
        'matching',
        'sequencing',
        'opinion_recognition',
        'true_false_not_mentioned',
        'translation_into_english',
        'translation_into_russian',
        'writing_task',
        'simple_sentences',
        'short_paragraph',
        'extended_writing',
        'role_play',
        'photo_card',
        'conversation',
        'sentence_builder',
        'note_completion',
        'listening_comprehension',
        'reading_comprehension',
        'other'
      )
    )
);

create index if not exists mock_exam_questions_section_sort_idx
  on public.mock_exam_questions (section_id, sort_order);
create index if not exists mock_exam_questions_type_idx
  on public.mock_exam_questions (question_type);

alter table public.mock_exam_questions enable row level security;

drop policy if exists "Allow authenticated read on mock_exam_questions"
  on public.mock_exam_questions;
create policy "Allow authenticated read on mock_exam_questions"
  on public.mock_exam_questions
  as permissive for select to authenticated using (true);

drop policy if exists "Admins can manage mock_exam_questions"
  on public.mock_exam_questions;
create policy "Admins can manage mock_exam_questions"
  on public.mock_exam_questions
  as permissive for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

commit;
