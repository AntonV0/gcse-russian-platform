create table if not exists public.onboarding_funnel_events (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null,
  user_id uuid references auth.users(id) on delete set null,
  event_name text not null,
  source text,
  entry_path text,
  destination_path text,
  selected_tier text,
  created_at timestamptz not null default now(),
  constraint onboarding_funnel_events_name_check
    check (
      event_name in (
        'signup_viewed',
        'signup_submitted',
        'account_created',
        'tier_viewed',
        'tier_selected',
        'profile_viewed',
        'profile_saved',
        'profile_skipped',
        'dashboard_arrived',
        'first_lesson_opened'
      )
    ),
  constraint onboarding_funnel_events_tier_check
    check (
      selected_tier is null
      or selected_tier in ('foundation', 'higher')
    ),
  constraint onboarding_funnel_events_journey_event_unique
    unique (journey_id, event_name)
);

create index if not exists onboarding_funnel_events_user_created_idx
  on public.onboarding_funnel_events (user_id, created_at desc);

create index if not exists onboarding_funnel_events_created_idx
  on public.onboarding_funnel_events (created_at desc);

alter table public.onboarding_funnel_events enable row level security;

comment on table public.onboarding_funnel_events is
  'Privacy-minimised onboarding funnel milestones. Writes are server-side only and contain no submitted names, email addresses, phone numbers, or passwords.';
