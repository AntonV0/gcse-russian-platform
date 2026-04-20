alter table public.prices
add column if not exists upgrade_source_price_id uuid references public.prices(id) on delete
set null;
create index if not exists idx_prices_upgrade_source_price_id on public.prices(upgrade_source_price_id);