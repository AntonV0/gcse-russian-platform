# Architecture Overview

This document describes the current system architecture of the GCSE
Russian Course Platform.

It reflects the **latest system design**, including:

- the evolution of the lesson builder into a full CMS
- variant-aware content delivery
- shared section architecture
- major UX improvements introduced in this phase

---

## 1. Architectural model

The platform is shaped by **two independent axes**:

### Role axis

- Admin
- Teacher
- Student

### Student access axis

- Trial
- Self-study / Full
- Volna student

These axes are intentionally separated.

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
- dashboards
- course navigation
- lesson rendering
- assignment UI
- teacher review UI
- admin CMS UI
- lesson builder UI
- role-aware navigation
- account and settings UI

Route groups separate public marketing pages from authenticated platform pages:

- `(marketing)` contains temporary `/marketing/*` marketing pages and auth entry pages
- `(platform)` contains authenticated LMS pages and uses the platform sidebar layout

The app-facing landing page remains at `/` during local/single-domain development.
Future host-based routing can map `www.gcserussian.com` to marketing root URLs and
`app.gcserussian.com` to the app root.

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

---

### Data layer

Supabase:

- PostgreSQL
- authentication
- storage
- row-level security

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
- not yet used in progression logic

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

LESSONS → LESSON_SECTIONS → LESSON_BLOCKS

---

## 17. Navigation & UI Access Architecture

UI visibility is derived from role + access mode.

---

## 18. Dashboard Architecture

Aggregates role, variant, and progress.

---

## 19. Account System Architecture

Includes profile, avatar system, and settings page.

---

## 20. Architectural changes in this phase

Added:

- variant visibility system
- canonical section system
- UI Lab system
- reusable table architecture
- DevComponentMarker system
- structured row interaction patterns
- theme system

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

- progress syncing
- dashboard improvements
- builder UX upgrades
