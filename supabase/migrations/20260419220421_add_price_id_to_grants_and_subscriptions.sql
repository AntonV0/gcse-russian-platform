alter table public.user_access_grants
add column if not exists price_id uuid references public.prices(id) on delete
set null;
alter table public.subscriptions
add column if not exists price_id uuid references public.prices(id) on delete
set null;
create index if not exists idx_user_access_grants_price_id on public.user_access_grants(price_id);
create index if not exists idx_subscriptions_price_id on public.subscriptions(price_id);