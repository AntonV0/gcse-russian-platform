# Architecture Decisions

Last reviewed: 2026-05-21

This document records the main technical decisions behind the GCSE
Russian Course Platform.

For product strategy, domain strategy, and expansion sequencing, see
`docs/strategy.md`.

It focuses on decisions that materially shaped the system, not every
implementation detail.

This version includes:

- lesson builder CMS evolution
- platform UI and dashboard decisions
- variant-based content architecture
- shared section system
- UI Lab system and component architecture
- active course, brand/site, and product-context decisions
- parent/guardian profile support
- Markdown export pipelines for teacher review

---

## 1. Why build one platform instead of separate student apps?

### Decision

Use a single platform with shared architecture and differentiate experiences via access + UI.

### Why

Supports:

- trial
- self-study
- Volna

### Benefits

- one codebase
- shared systems

---

## 2. Why separate role from access mode?

### Decision

Role != access mode

### Why

A student is still a student across modes.

---

## 3. Why use a block-based lesson system?

### Decision

Lessons use reusable blocks.

### Benefits

- scalable
- flexible

---

## 4. Why move lessons to DB-driven architecture?

### Decision

Remove hardcoded content.

### Benefits

- CMS-driven
- no code needed for content

---

## 5. Why introduce section-based lessons?

### Decision

Lesson -> Section -> Block

### Benefits

- structured learning
- progression

---

## 6. Why use visit-based progression?

### Decision

Track visits, not completion.

---

## 7. Why build a custom CMS?

### Decision

Internal builder instead of external CMS.

---

## 8. Why introduce variant-based content system?

### Decision

Replace track/delivery with a single field:

- variant_visibility

Values:

- shared
- foundation_only
- higher_only
- volna_only

### Why

- matches real product (variants)
- simplifies logic

### Benefits

- cleaner architecture
- easier rendering logic

---

## 9. Why introduce canonical section keys?

### Decision

Add canonical_section_key to sections.

### Why

- support shared content across variants

### Benefits

- future progress syncing
- reuse without coupling

---

## 10. Why keep variants separate but reusable?

### Decision

Foundation, Higher, Volna are independent variants.

### Why

- different structures
- but overlapping content

### Result

- reuse via canonical keys
- not shared lesson instances

---

## 11. Why shift builder UX to creation-first?

### Decision

Prioritise block creation in UI.

---

## 12. Why introduce access-aware navigation?

### Decision

UI adapts to access mode.

---

## 13. Why separate UI visibility from backend auth?

### Decision

Frontend controls UX, backend controls access.

---

## 14. Why introduce dashboard orchestration?

### Decision

Central helper aggregates user state.

---

## 15. Why introduce next-step system?

### Decision

Guide users dynamically.

---

## 16. Why use preset avatars?

### Decision

Use avatar_key instead of uploads.

---

## 17. Why introduce a UI Lab system?

### Decision

Build a dedicated UI Lab to design and validate components before using them in production pages.

### Why

- prevents inconsistent UI patterns
- avoids ad-hoc component creation
- allows safe iteration on design system

### Benefits

- consistent UI across admin, student, and teacher areas
- faster future development
- clearer component boundaries

---

## 18. Why use Dev Component Markers?

### Decision

Attach a development-only marker to all shared UI components.

### Why

- makes component usage visible in the UI
- helps identify duplication and missing abstractions

### Benefits

- enforces reuse
- improves maintainability
- accelerates UI refactoring

---

## 19. Why replace raw table markup with a table system?

### Decision

Introduce a reusable table architecture:

- TableShell
- TableToolbar
- DataTable components

### Why

Raw tables led to:

- duplication
- inconsistent styling
- unpredictable behaviour

### Benefits

- consistent structure across admin pages
- reusable patterns
- easier future enhancements (sorting, filtering, pagination)

---

## 20. Why treat tables and hierarchy as separate patterns?

### Decision

Support both:

- table layouts
- hierarchical list layouts

### Why

Different data needs different representation:

- tables -> comparison
- hierarchy -> structure

### Benefits

- clearer UX
- better alignment with LMS data (modules -> lessons -> blocks)

---

## 21. Why introduce structured row interaction patterns?

### Decision

Define consistent row states and behaviours:

- default
- hover
- selected
- disabled

### Why

Previously:

- row behaviour varied per page

### Benefits

- predictable UX
- easier component reuse
- cleaner interaction model

---

## 22. Why prioritise architecture first?

### Decision

Build strong foundations before features.

---

## 23. Theme System Design

### Decision

Implement a three-mode theme system (Light, Dark, System) using a client-side ThemeProvider and CSS variables.

### Rationale

- Avoid SSR hydration issues
- Enable system preference syncing
- Provide consistent UX across pages
- Prepare for future colour theme extensibility

### Key Choices

- Store preference in localStorage (not DB initially)
- Use `data-theme` attribute instead of class toggling
- Separate theme preference from resolved theme
- Keep header toggle as quick override
- Use CSS variables instead of hardcoded colours

### Trade-offs

- Requires discipline to avoid hardcoded colours
- Initial UI may mix token-based and hardcoded values (to be refactored)

### Future Work

- Token cleanup across UI
- Accent colour themes
- Persist preferences to user profile

---

## 24. Why introduce marketing, resources, and platform route groups?

### Decision

Use Next.js App Router route groups to separate:

- marketing pages in `(marketing)`
- public/access-aware learning resources in `(resources)`
- authenticated personal LMS workflows in `(platform)`

while preserving a future path to clean URLs.

### Why

The product needs to support:

- `www.gcserussian.com` for public marketing and SEO pages
- `app.gcserussian.com` for the LMS platform in future
- public resource browsing that can sit between marketing and signed-in personal
  workflows
- one codebase during the current single-domain development model

### Key Choices

- Keep `/` as the app-facing landing page during local/single-domain development.
- Keep clean public marketing URLs such as `/pricing`, `/resources`, and the
  GCSE guide pages.
- Keep `/marketing/:path+` redirects to the matching clean public URL.
- Use `(resources)` for courses, vocabulary, grammar, past papers, and mock exam
  browsing because these pages are public or access-aware, not purely personal.
- Move authenticated Stripe checkout and upgrade UI to `/account/billing`.
- Keep platform pages inside the authenticated platform layout with `PlatformSidebar`.
- Keep marketing pages inside a separate public layout with marketing-only header and footer.
- Keep brand, domain, and default SEO values in `src/lib/brand/site-config.ts`,
  with `src/lib/seo/site.ts` preserving the existing helper exports.
- Do not implement middleware or subdomain routing yet.

### Result

Public pages and resource browsing can grow independently from personal platform
workflows. When host-based routing is introduced, the surfaces can be mapped to
the right hosts without changing the internal mental model.

---

## 25. Why use domain folders with compatibility facades?

### Decision

Large feature areas should move from broad `*-helpers-db.ts` and `admin-*` files
toward focused domain folders, while keeping small compatibility facades during
the transition.

### Why

Fast-growing systems such as vocabulary, mock exams, and dashboard orchestration
were becoming difficult to scan when types, labels, parsing, data access, and
page logic lived in one file.

### Key Choices

- Keep old import paths working while refactors are in progress.
- Prefer new imports from focused domain paths.
- Move route pages toward thin data-loading shells.
- Move parsing and serialization helpers into domain modules.
- Do not rename applied Supabase migrations purely for tidiness.

### Result

The codebase can become more modular without forcing risky all-at-once import
changes across the app.

---

## 26. Why keep existing Russian-specific schemas stable while using neutral naming for new reusable systems?

### Decision

Keep existing Russian-specific vocabulary, grammar, lesson-content, assessment,
table, column, route, file, and schema names stable. For new reusable platform
systems, use neutral names such as `source_text`, `target_text`, `prompt_text`,
`answer_text`, `translation_direction`, `language_code`, `qualification_level`,
and `curriculum_code` unless the data is genuinely Russian-specific.

### Why

The current GCSE Russian and A-Level Russian platform needs reliable existing
content systems. Renaming stable Russian-specific schemas would add migration
risk, disrupt imports and admin workflows, and create churn without improving the
current product.

At the same time, new shared platform systems should avoid unnecessary
Russian-specific assumptions when the same structure is really about course
metadata, prompts, answers, translations, access, billing, progress, or CMS
workflow.

### Boundaries

- Russian-specific wording is correct for public marketing, Russian lesson
  content, Russian vocabulary, Russian grammar, and data that models Russian
  linguistic concepts.
- Neutral naming is preferred for new reusable platform systems.
- Do not abstract prematurely when a system is genuinely GCSE Russian-only.
- Do not create migrations or rename existing objects for naming consistency
  alone.

### Result

Existing Russian content remains stable, while new platform work gets clearer
names and fewer unnecessary course-specific assumptions.

---

## 27. Why add first-class course metadata?

### Decision

Store core course dimensions on `courses`:

- `language_code`
- `language_name`
- `qualification_level`
- `exam_board`
- `curriculum_code`

### Why

The platform needs GCSE Russian content and future A-Level Russian content to be
described by data rather than scattered strings.

### Result

Admin course screens and course helpers can preserve qualification, exam-board,
curriculum, and language metadata without changing public routes or billing
behaviour.

---

## 28. Why introduce active course and site config helpers?

### Decision

Use small central helpers for current GCSE Russian assumptions:

- `src/lib/courses/active-course.ts`
- `src/lib/brand/site-config.ts`

### Why

Generic app surfaces should not repeatedly embed the same default course slug,
public domain, app domain, site name, SEO title, or OG defaults.

### Result

Current public output remains GCSE Russian, while route helpers, dashboard
helpers, metadata builders, OG routes, and structured-data helpers have a single
place to read the current product context.

---

## 29. Why centralise billing product-code resolution without changing Stripe?

### Decision

Keep the existing GCSE Russian Foundation and Higher Stripe products/prices, but
resolve supported product codes through a central catalog mapping.

### Why

Checkout validation, trial tier grants, purchase state, pricing UI, and account
helpers previously needed to know the same product-code mapping independently.

### Result

The current commercial behaviour is unchanged, but product-code knowledge is
centralised. Foundation-to-Higher upgrade rules remain explicit because they are
real current business rules.

---

## 30. Why store parent/guardian details on profiles instead of building parent accounts?

### Decision

Add optional parent/guardian contact and awareness fields to `profiles`.

### Why

GCSE learners are often under 16 and parents or guardians may help with setup,
support, and payment decisions. The product needs a practical safeguarding layer
now, but not a full parent portal.

### Result

Signup, profile, account/settings, and admin student pages can store and display
parent/guardian context. The platform still has no parent login, parent
dashboard, parent-student linking model, or student-to-student messaging.

---

## 31. Why start teacher review with Markdown exports?

### Decision

Use admin-only Markdown downloads for lesson, vocabulary, and grammar review.

### Why

Teachers can review AI-assisted drafts faster in documents than by clicking
through every platform interaction. Markdown is simple, deterministic, portable,
and easy to paste into shared review docs.

### Result

Admins can export lessons, vocabulary sets, and grammar sets. Lesson exports
inline linked vocabulary, grammar, and question sets when available, while media
and stale links remain clear references. This supports teacher QA without adding
comments, approvals, locking, or version comparison yet.
