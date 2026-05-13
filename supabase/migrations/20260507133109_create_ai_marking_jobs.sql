begin;

create table if not exists public.ai_marking_jobs (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.mock_exam_attempts(id) on delete cascade,
  question_id uuid not null references public.mock_exam_questions(id) on delete cascade,
  response_id uuid references public.mock_exam_responses(id) on delete set null,
  status text not null default 'queued',
  input_kind text not null,
  provider text not null default 'openai',
  extraction_model text,
  marking_model text,
  transcription_model text,
  prompt_version text not null,
  rubric_version text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone not null default now(),
  completed_at timestamp with time zone,
  error_message text,
  constraint ai_marking_jobs_status_check
    check (status in ('queued', 'running', 'succeeded', 'failed', 'requires_review')),
  constraint ai_marking_jobs_input_kind_check
    check (input_kind in ('typed_text', 'handwriting_image', 'audio', 'mixed'))
);

create index if not exists ai_marking_jobs_attempt_idx
  on public.ai_marking_jobs (attempt_id, created_at desc);
create index if not exists ai_marking_jobs_response_idx
  on public.ai_marking_jobs (response_id, created_at desc);
create index if not exists ai_marking_jobs_question_idx
  on public.ai_marking_jobs (question_id, created_at desc);
create index if not exists ai_marking_jobs_status_idx
  on public.ai_marking_jobs (status, created_at desc);

alter table public.ai_marking_jobs enable row level security;

drop policy if exists "Admins can manage ai_marking_jobs"
  on public.ai_marking_jobs;
create policy "Admins can manage ai_marking_jobs"
  on public.ai_marking_jobs
  as permissive for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

create table if not exists public.ai_marking_outputs (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null unique references public.ai_marking_jobs(id) on delete cascade,
  extracted_text text,
  transcription_confidence text,
  suggested_marks numeric(6,2),
  max_marks numeric(6,2) not null default 0,
  band text,
  confidence text,
  rationale text,
  evidence text,
  strengths text,
  targets text,
  flags jsonb not null default '[]'::jsonb,
  raw_json jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  constraint ai_marking_outputs_flags_array_check
    check (jsonb_typeof(flags) = 'array'),
  constraint ai_marking_outputs_raw_json_object_check
    check (jsonb_typeof(raw_json) = 'object'),
  constraint ai_marking_outputs_confidence_check
    check (confidence is null or confidence in ('low', 'medium', 'high')),
  constraint ai_marking_outputs_transcription_confidence_check
    check (
      transcription_confidence is null
      or transcription_confidence in ('low', 'medium', 'high')
    ),
  constraint ai_marking_outputs_marks_check
    check (
      max_marks >= 0
      and (suggested_marks is null or suggested_marks >= 0)
      and (suggested_marks is null or suggested_marks <= max_marks)
    )
);

alter table public.ai_marking_outputs enable row level security;

drop policy if exists "Admins can manage ai_marking_outputs"
  on public.ai_marking_outputs;
create policy "Admins can manage ai_marking_outputs"
  on public.ai_marking_outputs
  as permissive for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

commit;
