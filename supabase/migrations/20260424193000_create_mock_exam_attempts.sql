begin;

create table if not exists public.mock_exam_attempts (
  id uuid primary key default gen_random_uuid(),
  mock_exam_id uuid not null references public.mock_exam_sets(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'draft',
  started_at timestamp with time zone not null default now(),
  submitted_at timestamp with time zone,
  time_limit_minutes_snapshot integer,
  total_marks_snapshot numeric(6,2) not null default 0,
  awarded_marks numeric(6,2),
  feedback text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint mock_exam_attempts_status_check
    check (status in ('draft', 'submitted', 'marked', 'abandoned')),
  constraint mock_exam_attempts_time_limit_check
    check (
      time_limit_minutes_snapshot is null
      or time_limit_minutes_snapshot > 0
    ),
  constraint mock_exam_attempts_marks_check
    check (
      total_marks_snapshot >= 0
      and (awarded_marks is null or awarded_marks >= 0)
    )
);

create index if not exists mock_exam_attempts_exam_user_idx
  on public.mock_exam_attempts (mock_exam_id, user_id, started_at desc);
create index if not exists mock_exam_attempts_user_status_idx
  on public.mock_exam_attempts (user_id, status, started_at desc);

alter table public.mock_exam_attempts enable row level security;

drop policy if exists "Users can read their own mock exam attempts"
  on public.mock_exam_attempts;
create policy "Users can read their own mock exam attempts"
  on public.mock_exam_attempts
  as permissive for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users can create their own mock exam attempts"
  on public.mock_exam_attempts;
create policy "Users can create their own mock exam attempts"
  on public.mock_exam_attempts
  as permissive for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users can update their own draft mock exam attempts"
  on public.mock_exam_attempts;
create policy "Users can update their own draft mock exam attempts"
  on public.mock_exam_attempts
  as permissive for update to authenticated
  using (user_id = auth.uid() and status in ('draft', 'submitted'))
  with check (user_id = auth.uid());

drop policy if exists "Admins can manage mock_exam_attempts"
  on public.mock_exam_attempts;
create policy "Admins can manage mock_exam_attempts"
  on public.mock_exam_attempts
  as permissive for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

create table if not exists public.mock_exam_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.mock_exam_attempts(id) on delete cascade,
  question_id uuid not null references public.mock_exam_questions(id) on delete cascade,
  response_text text,
  response_payload jsonb not null default '{}'::jsonb,
  awarded_marks numeric(6,2),
  feedback text,
  is_flagged boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint mock_exam_responses_payload_object_check
    check (jsonb_typeof(response_payload) = 'object'),
  constraint mock_exam_responses_awarded_marks_check
    check (awarded_marks is null or awarded_marks >= 0),
  constraint mock_exam_responses_attempt_question_key unique (attempt_id, question_id)
);

create index if not exists mock_exam_responses_attempt_idx
  on public.mock_exam_responses (attempt_id);
create index if not exists mock_exam_responses_question_idx
  on public.mock_exam_responses (question_id);

alter table public.mock_exam_responses enable row level security;

drop policy if exists "Users can read responses for their own attempts"
  on public.mock_exam_responses;
create policy "Users can read responses for their own attempts"
  on public.mock_exam_responses
  as permissive for select to authenticated
  using (
    exists (
      select 1
      from public.mock_exam_attempts
      where mock_exam_attempts.id = mock_exam_responses.attempt_id
        and mock_exam_attempts.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert responses for their own draft attempts"
  on public.mock_exam_responses;
create policy "Users can insert responses for their own draft attempts"
  on public.mock_exam_responses
  as permissive for insert to authenticated
  with check (
    exists (
      select 1
      from public.mock_exam_attempts
      where mock_exam_attempts.id = mock_exam_responses.attempt_id
        and mock_exam_attempts.user_id = auth.uid()
        and mock_exam_attempts.status = 'draft'
    )
  );

drop policy if exists "Users can update responses for their own draft attempts"
  on public.mock_exam_responses;
create policy "Users can update responses for their own draft attempts"
  on public.mock_exam_responses
  as permissive for update to authenticated
  using (
    exists (
      select 1
      from public.mock_exam_attempts
      where mock_exam_attempts.id = mock_exam_responses.attempt_id
        and mock_exam_attempts.user_id = auth.uid()
        and mock_exam_attempts.status = 'draft'
    )
  )
  with check (
    exists (
      select 1
      from public.mock_exam_attempts
      where mock_exam_attempts.id = mock_exam_responses.attempt_id
        and mock_exam_attempts.user_id = auth.uid()
        and mock_exam_attempts.status = 'draft'
    )
  );

drop policy if exists "Admins can manage mock_exam_responses"
  on public.mock_exam_responses;
create policy "Admins can manage mock_exam_responses"
  on public.mock_exam_responses
  as permissive for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

create table if not exists public.mock_exam_scores (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null unique references public.mock_exam_attempts(id) on delete cascade,
  total_marks numeric(6,2) not null default 0,
  awarded_marks numeric(6,2) not null default 0,
  score_payload jsonb not null default '{}'::jsonb,
  feedback text,
  marked_by uuid references public.profiles(id) on delete set null,
  marked_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint mock_exam_scores_payload_object_check
    check (jsonb_typeof(score_payload) = 'object'),
  constraint mock_exam_scores_marks_check
    check (total_marks >= 0 and awarded_marks >= 0)
);

alter table public.mock_exam_scores enable row level security;

drop policy if exists "Users can read scores for their own attempts"
  on public.mock_exam_scores;
create policy "Users can read scores for their own attempts"
  on public.mock_exam_scores
  as permissive for select to authenticated
  using (
    exists (
      select 1
      from public.mock_exam_attempts
      where mock_exam_attempts.id = mock_exam_scores.attempt_id
        and mock_exam_attempts.user_id = auth.uid()
    )
  );

drop policy if exists "Admins can manage mock_exam_scores"
  on public.mock_exam_scores;
create policy "Admins can manage mock_exam_scores"
  on public.mock_exam_scores
  as permissive for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

commit;
