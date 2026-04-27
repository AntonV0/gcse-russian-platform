# Local Setup

This project uses Next.js, Supabase, and Stripe. Keep real values in `.env.local`
or your deployment environment; `.env.example` is only a blank template.

## 1. Install dependencies

```bash
npm install
```

## 2. Create local environment variables

Copy `.env.example` to `.env.local`, then fill in local or development values.
Every assignment in `.env.example` is intentionally empty so no real keys are
committed.

Required for the app to boot:

- `NEXT_PUBLIC_SUPABASE_URL` is the Supabase project URL. It is public and is
  exposed to browser code.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the Supabase anon key. It is public and is
  exposed to browser code.
- `SUPABASE_SERVICE_ROLE_KEY` is the privileged Supabase key used by server-only
  code. Never expose it to browser code or prefix it with `NEXT_PUBLIC_`.

Required for billing and webhook routes:

- `STRIPE_SECRET_KEY` is the server-only Stripe API key used to create checkout
  sessions and manage subscriptions.
- `STRIPE_WEBHOOK_SECRET` is the server-only signing secret used by
  `/api/stripe/webhook` to verify incoming Stripe events.

URL configuration:

- `NEXT_PUBLIC_SITE_URL` is the public marketing site origin used for SEO
  metadata. If omitted, the code falls back to the production marketing domain.
- `NEXT_PUBLIC_APP_URL` is the public app origin used for app links and Stripe
  checkout redirects.
- `APP_URL` is a server-only fallback for checkout redirects when
  `NEXT_PUBLIC_APP_URL` is not set.
- `VERCEL_PROJECT_PRODUCTION_URL` is normally supplied by Vercel deployments and
  is a final checkout redirect fallback. It is usually left empty locally.

Only variables prefixed with `NEXT_PUBLIC_` are safe to expose to the browser.
All other variables are server-only unless a framework or hosting provider
documents otherwise.

## 3. Configure Stripe webhooks locally

Stripe webhook signature verification requires `STRIPE_WEBHOOK_SECRET`. For
local testing, run the Stripe CLI listener and forward events to the local
Next.js route:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Use the webhook signing secret printed by the Stripe CLI as
`STRIPE_WEBHOOK_SECRET` in `.env.local`. Dashboard webhook endpoint secrets and
Stripe CLI listener secrets are different values, so keep local and deployed
environments separate.

The webhook route currently handles:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## 4. Run the app

```bash
npm run dev
```

Open the local app, exercise checkout with Stripe test-mode data, and keep the
Stripe CLI listener running while testing webhook-driven access changes.

## 5. Validate before committing

```bash
npm run lint
npm run build
```
