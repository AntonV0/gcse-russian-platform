alter table public.vocabulary_sets
  add column if not exists is_trial_visible boolean not null default false,
  add column if not exists requires_paid_access boolean not null default true,
  add column if not exists available_in_volna boolean not null default true;

create or replace function public.can_read_public_lesson_content(
  target_lesson_id uuid
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select false;
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
  select target_is_published = true;
$$;
