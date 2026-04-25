do $$
begin
  if exists (
    select 1
    from (
      select provider_subscription_id
      from public.subscriptions
      where provider_subscription_id is not null
      group by provider_subscription_id
      having count(*) > 1
    ) duplicate_provider_subscriptions
  ) then
    raise exception 'Duplicate provider_subscription_id values exist in public.subscriptions; resolve them before adding the unique sync index.';
  end if;
end $$;

create unique index if not exists subscriptions_provider_subscription_id_unique_idx
  on public.subscriptions (provider_subscription_id)
  where provider_subscription_id is not null;

create index if not exists subscriptions_user_updated_idx
  on public.subscriptions (user_id, updated_at desc);

create index if not exists subscriptions_user_product_updated_idx
  on public.subscriptions (user_id, product_id, updated_at desc);

create index if not exists user_access_grants_user_product_source_active_idx
  on public.user_access_grants (user_id, product_id, source, is_active);
