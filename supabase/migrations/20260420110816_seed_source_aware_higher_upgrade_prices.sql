with foundation_product as (
  select *
  from public.products
  where code = 'gcse-russian-foundation'
  limit 1
), higher_product as (
  select *
  from public.products
  where code = 'gcse-russian-higher'
  limit 1
), inserted_upgrade_product as (
  insert into public.products (
      code,
      name,
      product_type,
      course_id,
      course_variant_id,
      is_active
    )
  select 'gcse-russian-higher-upgrade',
    'GCSE Russian Higher Upgrade',
    higher_product.product_type,
    higher_product.course_id,
    higher_product.course_variant_id,
    true
  from higher_product
  where not exists (
      select 1
      from public.products
      where code = 'gcse-russian-higher-upgrade'
    )
  returning *
),
upgrade_product as (
  select *
  from inserted_upgrade_product
  union all
  select *
  from public.products
  where code = 'gcse-russian-higher-upgrade'
),
foundation_monthly_price as (
  select *
  from public.prices
  where product_id = (
      select id
      from foundation_product
    )
    and billing_type = 'subscription'
    and interval_unit = 'month'
    and coalesce(interval_count, 1) = 1
    and is_active = true
  limit 1
), foundation_three_month_price as (
  select *
  from public.prices
  where product_id = (
      select id
      from foundation_product
    )
    and billing_type = 'subscription'
    and interval_unit = 'month'
    and coalesce(interval_count, 1) = 3
    and is_active = true
  limit 1
), foundation_lifetime_price as (
  select *
  from public.prices
  where product_id = (
      select id
      from foundation_product
    )
    and billing_type = 'one_time'
    and is_active = true
  limit 1
)
insert into public.prices (
    product_id,
    billing_type,
    interval_unit,
    interval_count,
    amount_gbp,
    stripe_price_id,
    upgrade_source_price_id,
    is_active
  )
select upgrade_product.id,
  seeded.billing_type,
  seeded.interval_unit,
  seeded.interval_count,
  seeded.amount_gbp,
  seeded.stripe_price_id,
  seeded.upgrade_source_price_id,
  true
from upgrade_product
  cross join (
    select 'subscription'::text as billing_type,
      'month'::text as interval_unit,
      1::integer as interval_count,
      10::integer as amount_gbp,
      'price_1TOFreHBF7iJoBFUdG1NYQ3v'::text as stripe_price_id,
      (
        select id
        from foundation_monthly_price
      ) as upgrade_source_price_id
    union all
    select 'one_time'::text,
      null::text,
      null::integer,
      350::integer,
      'price_1TOFreHBF7iJoBFULyii8Su9'::text,
      (
        select id
        from foundation_monthly_price
      )
    union all
    select 'subscription'::text,
      'month'::text,
      3::integer,
      20::integer,
      'price_1TOFreHBF7iJoBFUD2pbrGUW'::text,
      (
        select id
        from foundation_three_month_price
      )
    union all
    select 'one_time'::text,
      null::text,
      null::integer,
      270::integer,
      'price_1TOFreHBF7iJoBFUSUpXs8lg'::text,
      (
        select id
        from foundation_three_month_price
      )
    union all
    select 'one_time'::text,
      null::text,
      null::integer,
      100::integer,
      'price_1TOFv9HBF7iJoBFULK8qSkMy'::text,
      (
        select id
        from foundation_lifetime_price
      )
  ) as seeded
where seeded.upgrade_source_price_id is not null
  and not exists (
    select 1
    from public.prices p
    where p.product_id = upgrade_product.id
      and p.billing_type = seeded.billing_type
      and coalesce(p.interval_unit, '') = coalesce(seeded.interval_unit, '')
      and coalesce(p.interval_count, -1) = coalesce(seeded.interval_count, -1)
      and p.upgrade_source_price_id = seeded.upgrade_source_price_id
  );