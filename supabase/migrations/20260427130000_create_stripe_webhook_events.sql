create table if not exists public.stripe_webhook_events (
  id text primary key,
  event_type text not null,
  livemode boolean not null default false,
  status text not null default 'processing',
  processing_started_at timestamp with time zone,
  processed_at timestamp with time zone,
  failed_at timestamp with time zone,
  last_error text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint stripe_webhook_events_status_check
    check (status in ('processing', 'processed', 'failed'))
);

alter table public.stripe_webhook_events enable row level security;

revoke all on table public.stripe_webhook_events from anon;
revoke all on table public.stripe_webhook_events from authenticated;

grant select, insert, update on table public.stripe_webhook_events to service_role;

create index if not exists stripe_webhook_events_status_processing_started_idx
  on public.stripe_webhook_events (status, processing_started_at);
