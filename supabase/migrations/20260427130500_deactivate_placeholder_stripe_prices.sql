-- Keep historical placeholder seed rows for auditability, but make them unusable
-- by checkout/catalog reads, which only select active prices.
update public.prices
set is_active = false
where stripe_price_id like 'REPLACE_WITH_STRIPE_PRICE_ID_%'
  and is_active = true;

alter table public.prices
drop constraint if exists prices_no_active_placeholder_stripe_price_id;

alter table public.prices
add constraint prices_no_active_placeholder_stripe_price_id
check (
  stripe_price_id is null
  or stripe_price_id not like 'REPLACE_WITH_STRIPE_PRICE_ID_%'
  or is_active = false
) not valid;

alter table public.prices
validate constraint prices_no_active_placeholder_stripe_price_id;
