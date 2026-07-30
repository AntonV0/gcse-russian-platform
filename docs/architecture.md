# Architecture Overview

Last reviewed: 2026-05-21

This document describes the current system architecture of the GCSE
Russian Course Platform.

For long-term product, brand, and expansion direction, see
`docs/strategy.md`.

It reflects the **latest system design**, including:

- the evolution of the lesson builder into a full CMS
- variant-aware content delivery
- shared section architecture
- current lesson-builder and platform UX improvements
- the marketing / resources / platform route split
- course metadata, active course context, and central brand/site config
- central GCSE Russian Foundation/Higher billing product resolver
- parent/guardian profile contact fields
- Markdown export pipelines for teacher review

---

## 1. Architectural model

The platform is currently shaped by **two independent axes**:

### Role axis

- Admin
- Teacher
- Student

### Student access axis

- Trial
- Self-study / Full
- Volna student

These axes are intentionally separated.

The course model now stores explicit product dimensions on `courses`:

- language
- qualification level
- exam board
- curriculum code
- variant
- access mode

The system uses:

- one codebase
- one database
- one content model

Different experiences are produced through:

- permissions
- access logic
- UI variation

NOT separate applications.

---

## 2. High-level system architecture

(unchanged diagram retained)

---

## 3. Main architectural layers

### Presentation layer

Built with Next.js App Router and React.

Responsibilities:

- public marketing pages
- public and access-aware resource pages
- dashboards
- course navigation
- lesson rendering
- assignment UI
- teacher review UI
- admin CMS UI
- lesson builder UI
- role-aware navigation
- account and settings UI

Route groups separate public marketing pages, learning-resource pages, and
authenticated personal workflows:

- `(marketing)` contains public conversion/SEO pages and auth entry pages.
- `(resources)` contains public or access-aware courses, vocabulary, grammar,
  past papers, and mock exam browsing.
- `(platform)` contains signed-in personal workflows and uses the platform
  sidebar layout.

The app-facing landing page remains at `/` during local/single-domain
development. Future host-based routing can map these surfaces to different
domains or clean URLs without collapsing the internal separation.

---

### Application logic layer

Implemented via:

- server actions
- helper modules (`src/lib/`)

Responsibilities:

- authenticated writes
- role-aware logic
- lesson progression logic
- question rendering
- assignment workflows
- CMS orchestration
- lesson builder orchestration
- dashboard orchestration
- access-aware UI decisions

Large feature domains should be split into focused modules as they grow. Broad
compatibility facades such as `vocabulary-helpers-db.ts` and
`mock-exam-helpers-db.ts` may remain temporarily, but implementation code should
live in domain folders such as `src/lib/vocabulary/`, `src/lib/mock-exams/`, and
`src/app/actions/admin/<domain>/`.

---

### Data layer

Supabase:

- PostgreSQL
- authentication
- storage
- row-level security
- Signup profile provisioning runs server-side with service-role access and rolls
  back a newly created auth user if the profile cannot be saved.
- Email-confirmation links return through the app `/auth/callback` route, which
  must be included in the Supabase Auth redirect URL allowlist.

---

### UI System Layer

A dedicated **UI system layer** standardises design patterns across:

- admin CMS
- student platform
- teacher interfaces

This layer is developed and validated through the **UI Lab system**.

### Purpose

- prevent UI inconsistency across rapidly evolving features
- allow isolated development of reusable components
- ensure scalability as platform complexity increases

### Key characteristics

- component-driven
- pattern-first (not page-first)
- validated before real usage
- shared across all roles and access modes

---

### Dev Component Marker System

All shared UI components include a **development-only marker system**.

### Behaviour

- displays:
  - component name
  - file path
- visible only in development

### Purpose

- identify reuse opportunities
- expose accidental duplication
- enforce consistent abstraction boundaries

This is critical for maintaining long-term UI scalability.

---

## 4. Theme Architecture

The theme system is built using:

- `ThemeProvider` (client-side context)
- CSS variables in `globals.css`
- `data-theme` attribute on the root `<html>` element

### Theme layers

1. **Theme Preference**
   - Stored in localStorage
   - Values: `light`, `dark`, `system`

2. **Resolved Theme**
   - Final applied theme: `light` or `dark`
   - Derived from preference + system setting

3. **UI Application**
   - CSS variables control all colours
   - Components must not rely on hardcoded colour values

### Behaviour

- System mode listens to `prefers-color-scheme`
- Changes propagate across tabs via `storage` event
- Theme transitions are temporarily enabled during theme switch

### Future Extension

The architecture is designed to support:

- accent themes (e.g. blue, green, purple)
- user-specific theme preferences (DB-backed)

---

## 5. Core content architecture

### Course hierarchy

- Course
- Variant
- Module
- Lesson

Courses carry first-class metadata for the GCSE Russian and future A-Level
Russian course families:

- `language_code`
- `language_name`
- `qualification_level`
- `exam_board`
- `curriculum_code`

The current GCSE Russian course is backfilled as Russian, GCSE, Pearson Edexcel,
`1RU0`.

The app has a small active course context in
`src/lib/courses/active-course.ts`. It keeps GCSE Russian as the default active
course while allowing generic platform routes and dashboard helpers to request
the active course slug explicitly.

Brand, domain, and default SEO metadata live in
`src/lib/brand/site-config.ts`. `src/lib/seo/site.ts` remains the compatibility
facade for existing metadata helpers, while sourcing the current GCSE Russian
public/app domains, site names, and default OG metadata from that config.

### Schema naming and content neutrality

Existing Russian-specific vocabulary, grammar, lesson-content, and assessment
schemas may remain stable. Do not rename applied tables, columns, files, routes,
or schemas purely to make older Russian-focused content look more generic.

For new reusable platform systems, prefer neutral schema and field names unless
the data is genuinely Russian-specific. Good default names include:

- `source_text`
- `target_text`
- `prompt_text`
- `answer_text`
- `translation_direction`
- `language_code`
- `qualification_level`
- `curriculum_code`

Russian-specific wording is appropriate in public marketing pages, GCSE Russian
content, A-Level Russian content, vocabulary systems, grammar systems, and
schemas that model specifically Russian linguistic concepts.

Do not abstract prematurely. If a feature is genuinely GCSE Russian-only, name
and design it clearly for GCSE Russian rather than adding generic layers that do
not yet simplify the implementation.

### Lesson architecture

- Lesson
- Section
- Block

This is the **single source of truth for lesson structure**.

---

## 6. Section-based lesson flow

Sections enable:

- step-based learning
- progressive unlocking
- structured pacing
- better UX for long lessons

### Behaviour

- first visit recorded
- visit unlocks next section
- revisit allowed
- skipping prevented

### Key decision

Progression is **visit-based**, not completion-based.

---

## 7. Block system

Blocks represent atomic content units.

Supported types:

- text
- note
- vocabulary
- audio
- image
- callout
- exam tip
- header
- subheader
- divider
- question set

### Design principles

- small, composable units
- reusable rendering
- DB-driven configuration
- no hardcoded layouts

---

## 8. Variant-Based Content Architecture

The system treats **variants as first-class citizens**.

Examples:

- foundation
- higher
- volna

### Section-level visibility

Each section includes:

- `variant_visibility`

Values:

- `shared`
- `foundation_only`
- `higher_only`
- `volna_only`

### Rendering behaviour

The lesson renderer filters sections using:

(section.variant_visibility, active_variant)

### Architectural impact

Replaces:

- track visibility
- delivery visibility

Benefits:

- simpler mental model
- aligned with product structure
- easier expansion

---

## 9. Shared Section Architecture

Sections support:

- `canonical_section_key`

### Purpose

Allows logically identical sections across variants.

### Why this matters

Enables:

- cross-variant progress syncing
- content reuse
- analytics

### Current state

- stored in DB
- editable in CMS
- used by the current V1 Foundation-to-Higher section progress sync
- not yet a full canonical progress model

---

## 10. Lesson Builder Architecture

The lesson builder is a **central CMS**.

### Responsibilities

- write lesson content to DB
- manage sections + blocks
- control ordering
- manage publishing
- control variant visibility
- manage canonical keys

### Markdown export for teacher QA

Admins can export lesson-builder lessons, vocabulary sets, and grammar sets as
Markdown for document-first teacher review. The exports are deliberately
read-only and do not change student UI, progression, comments, approvals, or
publishing state.

The lesson export includes:

- course, variant, module, and lesson metadata
- estimated minutes and access/publishing flags
- ordered sections with kind, variant visibility, and canonical key
- ordered blocks with publication status
- direct text for header, subheader, text, note, callout, exam-tip, vocabulary,
  and simple embedded practice blocks
- inline linked GCSE Russian vocabulary sets, grammar sets/points, and question
  sets where the linked admin resource can be loaded
- references for image media, audio media, unknown block types, and missing or
  stale linked resources

Vocabulary and grammar exports include set metadata, access/publishing flags,
source/import fields where present, and ordered review content. Vocabulary
exports include list/item rows with Russian, English, transliteration, examples,
notes, and useful item metadata. Grammar exports include ordered points,
explanations, examples, and Markdown tables where practical.

This gives GCSE Russian teachers practical QA artifacts that can be pasted into
documents while keeping the platform CMS as the source of truth. See
`docs/content-review-workflows.md` for the current review workflow boundary.

---

## 11. Lesson Builder UX Architecture

### Key shift

From:

- list-first editing

To:

- creation-first workflow

---

## 12. Data Display Architecture

The platform uses a **structured table system**.

### Core components

- TableShell
- TableToolbar
- DataTable

### Impact

- removes duplication
- standardises patterns
- improves scalability

---

## 13. Row Interaction Architecture

Row behaviour is a **first-class concern**.

### States

- default
- hover
- selected
- disabled

---

## 14. Hierarchical Content Display Pattern

Used for:

- modules
- lessons
- blocks

---

## 15. Progress architecture

Tables:

- lesson_progress
- lesson_section_progress

---

## 16. Database relationships

LESSONS -> LESSON_SECTIONS -> LESSON_BLOCKS

---

## 17. Navigation & UI Access Architecture

UI visibility is derived from role + access mode.

Generic app navigation should use the active course context helper instead of
embedding the GCSE Russian course slug directly. Public marketing URLs and
Stripe product records remain deliberately specific to the current product
surface. Checkout, trial access, purchase-state, and low-level plan checks should
resolve supported course product codes through the central billing catalog
resolver before touching grants, subscriptions, or Stripe checkout.

---

## 18. Dashboard Architecture

Aggregates role, variant, progress, next-step guidance, and a V1 learning plan.
For active student paths, the dashboard can find the next accessible lesson and
resume the next unlocked visible lesson section.

---

## 19. Account System Architecture

Includes profile, avatar system, settings page, and a minimal safeguarding /
parent contact layer.

The profile record stores optional parent or guardian contact details:

- `parent_guardian_name`
- `parent_guardian_email`
- `parent_guardian_phone`
- `parent_guardian_consent_confirmed`
- `parent_guardian_consent_confirmed_at`

These fields are deliberately part of the existing user profile rather than a
separate parent account model. The current slice supports GCSE Russian account
setup, account support, and safeguarding context without adding parent login,
parent dashboards, parent-student linking, or student-to-student communication.

---

## 20. Current architectural changes

Added:

- first-class course metadata on `courses`
- active course context helper
- central brand/site config and SEO compatibility facade
- central billing product resolver for the current GCSE Russian Foundation and
  Higher products
- variant visibility system
- canonical section system
- Foundation-to-Higher canonical section progress sync V1
- UI Lab system
- reusable table architecture
- DevComponentMarker system
- structured row interaction patterns
- theme system
- marketing / resources / platform route separation
- Stripe billing and webhook-backed access grants
- optional parent/guardian contact and awareness fields on profiles
- admin-only Markdown exports for lessons, vocabulary sets, and grammar sets
- inline linked vocabulary, grammar, and question-set content in lesson exports
- schema naming guidance for new reusable systems

Removed:

- track/delivery visibility
- raw table implementations

---

## 21. Architectural strengths

- unified platform
- DB-driven
- scalable CMS

---

## 22. Next architectural steps

- full canonical progress model beyond the current V1 section sync
- dashboard recommendations and analytics
- builder UX upgrades
- mock exam / assessment export when teacher QA needs it
- parent notification/reporting model before broader under-16 marketing
- host-based routing only when deployment needs distinct public/app hosts
