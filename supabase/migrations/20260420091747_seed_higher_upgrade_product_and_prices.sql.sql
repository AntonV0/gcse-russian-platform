with higher_product as (
  select *
  from public.products
  where code = 'gcse-russian-higher'
  limit 1
), inserted_product as (
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
    product_type,
    course_id,
    course_variant_id,
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
  from inserted_product
  union all
  select *
  from public.products
  where code = 'gcse-russian-higher-upgrade'
)
insert into public.prices (
    product_id,
    billing_type,
    interval_unit,
    interval_count,
    amount_gbp,
    stripe_price_id,
    is_active
  )
select upgrade_product.id,
  seeded.billing_type,
  seeded.interval_unit,
  seeded.interval_count,
  seeded.amount_gbp,
  seeded.stripe_price_id,
  true
from upgrade_product
  cross join (
    values (
        'subscription',
        'month',
        1,
        10,
        'REPLACE_WITH_STRIPE_PRICE_ID_HIGHER_UPGRADE_MONTHLY'
      ),
      (
        'subscription',
        'month',
        3,
        20,
        'REPLACE_WITH_STRIPE_PRICE_ID_HIGHER_UPGRADE_3_MONTH'
      ),
      (
        'one_time',
        null,
        null,
        100,
        'REPLACE_WITH_STRIPE_PRICE_ID_HIGHER_UPGRADE_LIFETIME'
      )
  ) as seeded(
    billing_type,
    interval_unit,
    interval_count,
    amount_gbp,
    stripe_price_id
  )
where not exists (
    select 1
    from public.prices p
    where p.product_id = upgrade_product.id
      and p.billing_type = seeded.billing_type
      and coalesce(p.interval_unit, '') = coalesce(seeded.interval_unit, '')
      and coalesce(p.interval_count, -1) = coalesce(seeded.interval_count, -1)
  );