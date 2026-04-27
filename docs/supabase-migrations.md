# Supabase Migration Policy

Supabase migrations are append-only once they may have been applied to any shared,
preview, staging, or production database. Do not rename, delete, squash, or edit
historical migration files for cosmetic cleanup.

## Rules

- Use filenames in the form `<timestamp>_<description>.sql`.
- Do not create empty migrations. If an empty migration is created locally and is
  definitely unapplied, delete it before sharing. If it may be applied, leave it
  in place and document it here.
- Do not rename `.sql.sql` files after they may have been applied. Supabase tracks
  migration versions by filename timestamp; renaming old files can desynchronise
  local history from remote history.
- Fix applied migration mistakes with new forward-only migrations.
- Only edit a migration directly when it is the latest local migration, has not
  been pushed, and has not been applied to any shared database.
- Prefer idempotent SQL for seed migrations: `insert ... where not exists`,
  `on conflict`, `create ... if not exists`, and `alter table ... add column if
not exists`.
- Keep static reference-content seeds, such as GCSE specification vocabulary,
  in migrations when the app depends on them being present after `db reset`.
- Do not commit environment-specific production placeholders such as
  `REPLACE_WITH_STRIPE_PRICE_ID...` as active seed data. Use real environment
  values through a dedicated seed/corrective migration, or keep the row inactive
  until the value is known.

## Current Audit

The following historical files are intentionally retained because they may have
been applied already:

- `20260403211956_remote_schema.sql` is empty.
- `20260406091833_create_lesson_section_progress.sql` is empty. It is superseded
  by `20260425103000_harden_profiles_and_create_lesson_section_progress.sql`.
- `20260418145812_add_avatar_key_to_profiles.sql.sql`,
  `20260418154343_add_lesson_section_visibility_fields.sql.sql`, and
  `20260420091747_seed_higher_upgrade_product_and_prices.sql.sql` use the
  suspicious `.sql.sql` extension. They must not be renamed unless the target
  database migration history is explicitly repaired at the same time.
- `20260404100727_remote_schema.sql` is a historical remote schema baseline.
  Keep it as the project baseline unless the team performs an explicit database
  rebaseline.
- `20260420091747_seed_higher_upgrade_product_and_prices.sql.sql` contains
  Stripe placeholder price IDs. It is superseded by
  `20260420110816_seed_source_aware_higher_upgrade_prices.sql` and corrected by
  `20260427130500_deactivate_placeholder_stripe_prices.sql`.

## Stripe Price Seed Strategy

Stripe price IDs are environment-specific operational data. If a migration must
seed Stripe-backed prices, it should either use known safe values for the target
environment or create inactive rows that are activated by a later migration once
real IDs are available.

The corrective migration
`20260427130500_deactivate_placeholder_stripe_prices.sql` preserves historical
placeholder rows but marks them inactive and adds a check constraint preventing
future active placeholder Stripe IDs. Runtime checkout/catalog code only reads
active prices, so fake IDs are removed from active checkout paths without
rewriting already-applied history.

## Remote Schema Dumps

Remote schema dumps should be rare. They are acceptable as an initial baseline
or an explicit rebaseline, but normal schema evolution should use small,
purpose-named migrations. If a new dump supersedes an old baseline, document the
reason, source database, and date in this file before committing it.

## Validation

Before committing migration work, run Supabase validation when local Supabase is
available:

```bash
npx supabase db lint --local
```

On Windows PowerShell, use `npx.cmd` if execution policy blocks `npx.ps1`:

```bash
npx.cmd supabase db lint --local
```

If Supabase validation is unavailable because Docker/local Supabase is not
running, run the application checks instead:

```bash
npm run lint
npm run build
```
