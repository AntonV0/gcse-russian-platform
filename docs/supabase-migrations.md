# Supabase Migration Policy

Status: current as of 2026-05-21.

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
- Prefer idempotent SQL for operational seed migrations: `insert ... where not
exists`, `on conflict`, `create ... if not exists`, and `alter table ... add
column if not exists`.
- Do not commit proprietary course content, vocabulary banks, grammar banks,
  lesson maps, or production schema dumps to the public repository. Keep those
  as private data exports, private migrations, or environment-owned seed jobs.
- Do not commit environment-specific production placeholders such as
  `REPLACE_WITH_STRIPE_PRICE_ID...` as active seed data. Use real environment
  values through a dedicated seed/corrective migration, or keep the row inactive
  until the value is known.

## Public Repository Policy

The public repository should contain the application code and schema evolution
needed to understand the engineering work, but not the proprietary learning
dataset. Before pushing, confirm that migrations do not include:

- production schema dumps
- full vocabulary or grammar banks
- lesson maps or generated course scaffolds
- user, teacher, billing, or uploaded-response data
- active environment-specific payment identifiers

Small synthetic fixtures are acceptable when they are clearly fake and only
exist to support tests or demos.

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

## Schema Dumps

Do not commit production schema dumps to the public repository. If a private
baseline or rebaseline is needed, keep it in private storage and mirror only the
small, purpose-named migration files that are safe for public review.

## Recent Private Operational Migrations

This repository currently ignores most `supabase/migrations/*.sql` files to avoid
publishing proprietary course data and operational schema history. The following
local migrations have been applied to the linked remote database but are ignored
by default:

- `20260521150000_add_course_metadata.sql`
- `20260521193000_add_parent_guardian_profile_fields.sql`

Do not assume a fresh public clone has these files unless the private migration
policy changes or the files are intentionally force-added.

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
