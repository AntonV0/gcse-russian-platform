# Product Strategy and Scaling Direction

Last reviewed: 2026-05-21

This document records the product, brand, and architecture direction for the GCSE
Russian platform. It should be read alongside `docs/architecture.md` and
`docs/decisions.md` before making product-shaping architecture changes.

## Strategic Position

The product is a hybrid education platform:

- B2C self-study GCSE Russian Foundation and Higher products.
- A teacher-supported Volna access layer using the same platform, lessons, CMS,
  auth, database, and billing systems.

Volna is an access and delivery mode, not a separate platform. The near-term
business goal is scalable self-study products with optional teacher-supported
pathways, not school SaaS, enterprise LMS, or white-label software.

## Public Brand, Internal Platform

Externally, the product should feel specialist and authoritative: a focused GCSE
Russian and A-Level Russian learning platform.

The current public and app-facing domains are:

- `gcserussian.com`
- `app.gcserussian.com`

Both should point at the same backend platform: one codebase, one database, one
auth system, one billing system, one CMS, and one operational backend.

## Expansion Sequence

The recommended order is:

1. Finish GCSE Russian Foundation.
2. Finish GCSE Russian Higher.
3. Integrate Volna delivery and accountability workflows.
4. Stabilise onboarding, payments, trials, retention, and mobile web UX.
5. Build A-Level Russian.

GCSE Russian is the reference implementation for architecture, CMS patterns,
content workflow, QA workflow, and curriculum structure.

## Product Dimensions

The platform should increasingly model content, access, and branding through
explicit dimensions for GCSE Russian and A-Level Russian:

| Dimension       | Example                    |
| --------------- | -------------------------- |
| Qualification   | GCSE / A-Level             |
| Exam board      | Pearson Edexcel            |
| Curriculum code | `1RU0`                     |
| Variant         | Foundation / Higher        |
| Access mode     | Trial / Self-study / Volna |

Avoid new one-off logic when a behaviour belongs to reusable course, product,
variant, access, billing, or CMS configuration.

## Mobile App Direction

Do not build the native app yet. The priority is excellent mobile web UX.

If a native app becomes worthwhile later, it should reuse the same account,
access, progress, and content systems rather than becoming a separate product.

## Onboarding and Trials

Registration should take students into the platform immediately. Trial lessons
and upgrade prompts should live inside the app, using the same gated content,
access-aware dashboard, and billing systems as paid users.

## AI Content and Teacher QA

AI should be used heavily for draft generation:

- lesson drafts
- grammar explanations
- vocabulary tasks
- quizzes
- reading passages
- mock papers
- translations
- speaking prompts
- listening scripts

AI is not the final authority. Human QA remains essential for linguistic
naturalness, exam suitability, difficulty calibration, cultural correctness, and
authentic phrasing.

The preferred teacher review workflow is document-first:

1. Export lesson, vocabulary, and grammar content for review in documents first.
   The current implementation is Markdown export focused on GCSE Russian teacher
   QA, with lesson exports able to inline linked vocabulary, grammar, and
   question sets.
2. Add further export surfaces only when the content shape is clear and teachers
   need those artifacts for review.
3. Use smaller in-platform QA passes for UX flow, answer validation, progression,
   and mobile experience.

CMS work should support lightweight export and review pipelines without turning
the first slice into comments, approvals, or a full review workflow. See
`docs/content-review-workflows.md` for the current implementation boundary.

## Safeguarding Direction

Assume parents are often the paying customers and students are the learners.
The platform already supports optional parent or guardian contact collection on
profiles. Future requirements include stronger safeguarding policies, privacy
policy review, AI disclosures, moderation and reporting systems, and restricted
communication patterns.

The early-stage acceptable posture is parent/guardian involvement during account
setup, teacher-controlled interactions, no student-to-student communication, and
clear terms and privacy pages.

The current product layer now supports optional parent or guardian contact
details and a conservative adult-awareness flag on student profiles. This is not
a parent portal: parents do not have separate logins, dashboards, or messaging
features yet. It exists to make GCSE Russian and future A-Level Russian account
setup and support more practical for families while keeping communication
boundaries tight.

## Current Repo Audit

The current platform already aligns well with the strategy in several important
ways:

- The codebase is a single Next.js/Supabase/Stripe platform.
- Roles and access modes are separate concepts.
- Trial, self-study, and Volna behaviour is handled through access and UI logic
  rather than separate apps.
- Courses use a database-backed Course -> Variant -> Module -> Lesson hierarchy.
- Lessons use database-backed sections and blocks.
- Section-level `variant_visibility` and `canonical_section_key` support reuse
  across Foundation, Higher, and Volna.
- Stripe-backed products, prices, grants, and subscriptions already map access to
  course products.
- Marketing, resources, and platform route groups preserve a future path to
  public/app subdomain routing.
- Vocabulary, grammar, past paper, mock exam, assignment, AI marking, and UI Lab
  systems already exist as reusable feature domains.
- Signup, privacy, account, profile, and admin student surfaces acknowledge
  parent or guardian involvement and can store optional adult contact details.

## Discrepancies and Scaling Risks

The current implementation is still correctly optimised for GCSE Russian, but the
following areas should be handled carefully before A-Level Russian expansion:

- `courses` now expose first-class metadata such as `language_code`,
  `language_name`, `qualification_level`, `exam_board`, and `curriculum_code`.
  Admin course forms and core course selects now preserve that metadata.
- Product-code eligibility now has a central billing catalog resolver for the
  current GCSE Russian Foundation and Higher products. The underlying Stripe
  products and prices remain unchanged.
- Trial tier selection now uses the same resolver instead of carrying its own
  product-code mapping.
- The default active course context is explicit in
  `src/lib/courses/active-course.ts`, with GCSE Russian remaining the current
  default for routes, dashboards, progress, profile, and navigation helpers.
- Brand, domain, and default SEO values now live in
  `src/lib/brand/site-config.ts`, with GCSE Russian remaining the current public
  and app-facing default.
- Admin Markdown exports now support lesson, vocabulary, and grammar review
  artifacts. Lesson exports can inline linked vocabulary, grammar, and question
  sets for teacher QA.
- Some legacy code content still lives under `src/lib/lesson-content/gcse-russian`,
  although the main direction is database-driven content.
- Vocabulary and grammar data structures include useful curriculum metadata but
  not qualification scoping yet.
- Several schemas use Russian-specific column names such as `russian`,
  `example_ru`, and `russian_text`. These are acceptable for the Russian product,
  but new reusable systems should not depend on presentation-language-specific
  column naming.
- `variant_visibility` works for Foundation, Higher, and Volna today, but it may
  become too narrow if variants expand beyond those three labels.
- A-Level will likely need richer writing, essay feedback, literature/film, and
  advanced speaking metadata, even if the core LMS architecture can stay shared.

## Recommended Architecture Changes Before Major Expansion

These are not blockers for finishing GCSE Russian. They are the recommended
pre-expansion changes before adding A-Level Russian.

1. Add host-based brand configuration only when deployment needs distinct public
   and app host behaviour. The current static GCSE Russian site config is enough
   for the present product.
2. Replace the current central product-code resolver with database-backed
   eligibility rules, scoped by course, variant, and access mode, when the
   product catalog needs more than the current GCSE Russian products.
3. Continue extending active course context where new surfaces appear. Current
   route, dashboard, progress, profile, trial, account, and billing surfaces have
   the first active-course slice in place.
4. Decide whether `variant_visibility` should remain a fixed enum or become a
   more flexible visibility rule keyed to course variant slugs.
5. Continue extending review exports beyond lessons, vocabulary, and grammar
   when the next content shape needs it, especially mock exams and assessment
   content.
6. Define the next safeguarding escalation path before broader under-16
   marketing: parent account model, parent notifications, reporting workflows,
   and policy ownership. The current profile-level parent/guardian contact layer
   is intentionally only the first slice.
7. Introduce reusable naming for new schemas and components when the structure is
   not inherently Russian-specific.

## Near-Term Guidance

Continue building GCSE Russian first. Do not pause current feature work for a
large abstraction refactor.

However, new platform code should avoid hardcoding `gcse-russian`, `Russian`,
`Foundation`, `Higher`, or `Volna` unless the file is explicitly Russian content,
Russian marketing copy, or a deliberately current-phase pricing surface. Prefer
course metadata, product records, and variant records as the source of truth.
