# GCSE Russian Course Platform

[![CI](https://github.com/AntonV0/gcse-russian-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/AntonV0/gcse-russian-platform/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ecf8e?logo=supabase&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Billing-635bff?logo=stripe&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-Unit%20Tests-6e9f18?logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-E2E%20Tests-2ead33?logo=playwright&logoColor=white)

Last reviewed: 2026-05-21

A full-stack online learning platform for GCSE Russian students,
combining structured courses, interactive lessons, teacher-led
assignment workflows, and a rapidly evolving internal CMS.

Built as a real product for **gcserussian.com** and supporting **Volna
Online Russian School**.

---

## Documentation

Project architecture notes are kept in `docs/`:

- `docs/CURRENT_STATE.md`
- `docs/architecture.md`
- `docs/content-review-workflows.md`
- `docs/decisions.md`
- `docs/image-strategy.md`
- `docs/local-setup.md`
- `docs/PROJECT_STRUCTURE.md`
- `docs/question-design-system.md`
- `docs/responsive-qa.md`
- `docs/seo-launch-checklist.md`
- `docs/strategy.md`
- `docs/supabase-migrations.md`
- `docs/ui-system-guidelines.md`
- `docs/vocabulary-admin-production-notes.md`
- `docs/vocabulary-section-placement.md`

---

## Local Development

Use the pinned dev script so this project can run alongside the Volna and
Pushkin sites without port collisions:

```bash
npm install
npm run dev
```

The dev server runs on:

```text
http://localhost:3030
```

For Codex, use a Local Environment `Run` action with `npm.cmd run dev` on
Windows and reuse the running server if `3030` is already occupied.

---

## Overview

This platform combines:

- structured self-study course delivery
- public/access-aware resource browsing
- teacher-managed assignments and review workflows
- a fully database-driven lesson system
- a growing CMS for managing all learning content
- Stripe-backed course access and billing workflows
- active course, brand/site, and billing product resolver helpers that keep
  current GCSE Russian behaviour explicit and centralised
- parent/guardian contact fields for practical under-16 account support
- Markdown export workflows for teacher review of lessons, vocabulary, and
  grammar
- a structured internal **UI design system (UI Lab)** for consistent UX across the platform

It is designed as a **single unified system** that supports multiple
learning experiences without splitting into separate apps.

---

## Core Product Model

Two independent axes shape the platform:

### Roles

- **Admin** -> full system control and content management
- **Teacher** -> manages groups, assignments, and student progress
- **Student** -> consumes content and completes work

### Student access modes

- **Trial** -> restricted access, upgrade-focused
- **Self-study / Full** -> independent paid learning
- **Volna student** -> teacher-linked experience with assignments

These are handled through:

- permissions
- access rules
- UI variation

NOT separate applications.

---

## Main Systems

### Course, Brand, and Product Context

The current default course context is GCSE Russian. Course records store
metadata for:

- language
- qualification level
- exam board
- curriculum code

Shared helpers centralise the current product assumptions:

- `src/lib/courses/active-course.ts` -> default active course slug and course
  paths
- `src/lib/brand/site-config.ts` -> public/app domains, site name, SEO defaults,
  and OG defaults
- `src/lib/billing/catalog/product-context.ts` -> current Foundation/Higher
  product-code mapping

The public product remains GCSE Russian. Marketing copy and public SEO routes are
intentionally GCSE Russian-specific.

### Lesson System (DB-Driven)

Lessons now follow a strict hierarchical structure:

- Lesson
- Section
- Block

#### Behaviour

- Sections unlock progressively
- First visit is recorded (`lesson_section_progress`)
- Visiting a section unlocks the next
- Users cannot skip ahead
- Previously visited sections remain accessible

#### Supported block types

- text
- note
- vocabulary
- audio
- image
- callout
- exam tip
- header / subheader / divider
- question set

---

## Variant-Based Content System

The lesson system now supports **variant-aware content delivery**.

### Key concept

Each section has a:

- `variant_visibility`

Values:

- `shared`
- `foundation_only`
- `higher_only`
- `volna_only`

### Behaviour

- **Shared sections** appear in all variants
- **Variant-specific sections** only appear in their respective variant
- The renderer filters sections based on the active variant:
  - foundation
  - higher
  - volna

This replaces the previous:

- Removed: track visibility
- Removed: delivery visibility

### Why this matters

- aligns with real product structure (variants are first-class)
- removes artificial separation between track and delivery
- simplifies mental model across backend + UI

---

## Shared Section Architecture

To support future content reuse, sections now include:

- `canonical_section_key`

### Purpose

- allows logically identical sections to exist across variants
- enables **shared progress tracking**
- enables **content reuse without duplication constraints**

### Example

food-vocabulary-core

This same key can exist in:

- foundation lesson
- higher lesson
- volna lesson

Each instance can still:

- have different blocks
- be positioned differently
- evolve independently

### Important note

This is currently:

- stored
- editable in CMS
- used by the V1 Foundation-to-Higher section progress sync

But not yet a complete canonical progress model. The current sync is intentionally
narrow:

- Foundation -> Higher only
- matching module/lesson slugs only
- matching canonical section keys only
- section visits only, not a full completion/analytics model

---

## Lesson Builder System (CORE CMS)

The lesson builder has evolved into a **true CMS-style authoring tool**.

### Capabilities

- Section CRUD
- Block CRUD
- Drag-and-drop ordering
- Cross-section block movement
- Block duplication
- Publish/unpublish states
- Sidebar navigation
- Inspector editing
- **Variant visibility control**
- **Canonical section key editing**
- Markdown export for teacher review

### Architectural shift

- Removed hardcoded templates
- Presets resolved dynamically from the database
- Removed track/delivery visibility system
- Fully DB-driven content system
- Templates resolved dynamically
- Variant-aware content system

### Teacher review exports

Admins can export review-friendly Markdown for:

- lesson-builder lessons
- vocabulary sets
- grammar sets

Lesson exports include ordered sections/blocks, access metadata, draft/published
status, and inline linked vocabulary, grammar, and question set content where it
can be loaded. Image/audio blocks and missing linked resources are referenced
clearly rather than embedded. These exports are QA artifacts only; the CMS
remains the source of truth.

---

## UI Lab & Design System

A dedicated **UI Lab system** has been introduced to standardise and evolve UI patterns across:

- Admin CMS
- Student platform
- Teacher workflows

### Purpose

- prevent inconsistent UI patterns
- design components in isolation before real usage
- ensure scalability across future features

### UI Lab coverage

Current UI Lab pages include:

- Overview
- Buttons
- Surfaces
- Feedback
- Tables
- Forms
- Components
- Navigation
- Layout
- Typography
- Icons
- Admin Patterns
- Lesson Builder
- Lesson Content
- Theme

Recent expansion added:

- page-level anchor navigation for longer UI Lab sections
- reusable "Future components" sections
- dedicated admin/CMS pattern references
- dedicated lesson-builder authoring references
- dedicated lesson-content and theme references

---

### Dev Component Marker System

All shared UI components support a **development-only visual marker**:

- Displays:
  - component name
  - file path
- Helps identify:
  - reuse opportunities
  - missing abstractions
  - inconsistent implementations

This is:

- enabled in development
- removed in production

---

## Table System & Data Display

A reusable table architecture has been introduced to replace raw table markup.

### Components

- `TableShell` -> outer structure (title, description, actions)
- `TableToolbar` -> filters, search, actions
- `DataTable`
  - header
  - body
  - rows
  - cells
  - density variants

### Patterns supported

- Standard admin tables (default)
- Dense tables (compact)
- Hierarchical list patterns (modules -> lessons -> blocks)
- Empty states
- Filtered-empty states
- Dark-surface compatibility testing

### Behaviour improvements

- consistent spacing and typography
- predictable row interactions
- reusable action patterns
- improved scanning and readability

---

## Lesson Builder UX Improvements

Recent lesson-builder work focused heavily on **authoring experience**, not just
functionality.

### 1. Block Creation Flow (Major Change)

Before:

- add block buried below list
- unclear workflow

Now:

- block creation moved **above block list**
- clear **"Create new block"** panel
- improved empty states
- faster first-block experience

---

### 2. Add Block Composer Redesign

- Block types grouped into logical categories:
  - Structure
  - Teaching
  - Media
  - Practice
- Improved:
  - visual hierarchy
  - selection clarity
  - inline form display
- Presets upgraded:
  - clearer descriptions
  - better layout
  - more usable as starting points

---

### 3. Section Editor Improvements

- Creation-first layout (not browsing-first)
- Cleaner metadata editing
- Added:
  - variant visibility selector
  - canonical section key field
- Better search and filtering
- Clearer CTAs
- Improved empty states

---

### 4. Draggable Block List Improvements

- Stronger selected state
- Cleaner card layout
- Better scanning of blocks
- Improved drag-and-drop feedback
- Clearer action controls:
  - move
  - duplicate
  - publish/unpublish

---

## Platform UX & Navigation System

This update introduced a more structured and scalable **student platform UI layer**.

### Sidebar system

- Fully role-aware navigation
- Clean separation between:
  - main navigation
  - conditional items
  - utility section (profile/settings/logout)

#### Conditional navigation behaviour

- **Volna students**
  - see: Assignments
  - do NOT see: Online Classes

- **Non-Volna students**
  - see: Online Classes (CTA into Volna ecosystem)
  - do NOT see: Assignments

This ensures:

- correct product funnel behaviour
- no UI confusion between learning modes

---

### Online Classes integration

- Added dedicated **Online Classes page**
- Acts as a bridge between:
  - platform users
  - Volna School website
- Hidden for Volna students (already enrolled)

---

### Settings positioning

- Settings moved to bottom utility section
- Visually separated from main navigation
- Reinforces mental model:
  - learning vs account management

---

## Account System Improvements

### Profile system

- Added structured profile page
- Introduced `avatar_key` system:
  - preset avatars (no uploads)
  - safer and simpler for younger users (12-16)
  - scalable for future expansion
- Added optional parent/guardian contact and awareness fields for account
  support and safeguarding context.

---

### Settings system

- Dedicated settings page
- Theme appearance controls
- Password update flow
- Future-ready for deeper account management

---

## Dashboard System

The dashboard is evolving into a **central learning hub**, not just a landing page.

### Current capabilities

- Role-based rendering:
  - guest
  - student
  - teacher
  - admin

- Access-aware behaviour:
  - Trial / Full / Volna

---

### Current dashboard additions

#### 1. Progress awareness

- Integrated `getCourseProgressSummary`
- Integrated `getStudentLearningPlan`
- Displays:
  - completed lessons
  - contextual progress messaging
  - next accessible lesson where available
  - resume links to the next unlocked visible section

#### 2. Next-step system (V1)

Dynamic guidance based on:

- access mode
- variant
- progress state

Examples:

- Trial -> explore platform
- Full -> continue learning
- Volna -> open assignments

---

### Important architectural note

This version intentionally:

- computes the next accessible lesson from the current course path
- resumes the next unlocked visible lesson section where possible
- does NOT attempt to solve the full long-term canonical progress model
- stays lightweight and safe

---

## Theme System

The platform supports a global theme system with three modes:

- Light
- Dark
- System (follows OS preference)

Theme state is managed via a client-side `ThemeProvider`, which:

- Stores user preference in localStorage
- Resolves active theme based on preference + system settings
- Syncs across tabs
- Reacts to OS theme changes when in System mode

Theme is applied using the `data-theme` attribute on `<html>`.

Example:

<html data-theme="dark">

All UI colours are implemented using CSS variables to support future extensibility (e.g. accent themes).

---

## Product Direction

The platform is moving toward:

- a **Notion-style lesson editor**
- fully DB-driven content
- modular learning system
- variant-aware course structure
- intelligent student progression
- a unified **design system-driven UI architecture**
- resource-first public learning surfaces that can sit between marketing and the signed-in app

---

## Progress Tracking

### Tables

- lesson_progress
- lesson_section_progress
- question_progress
- question_attempts

### Section tracking

- first visit recorded
- visit count tracked
- progression unlock logic

---

## Database Overview

Core content:

- courses
- course_variants
- modules
- lessons
- lesson_sections
- lesson_blocks

Important profile/course metadata:

- `courses.language_code`
- `courses.language_name`
- `courses.qualification_level`
- `courses.exam_board`
- `courses.curriculum_code`
- `profiles.parent_guardian_name`
- `profiles.parent_guardian_email`
- `profiles.parent_guardian_consent_confirmed`
- `profiles.parent_guardian_consent_confirmed_at`

---

## Technical Cleanup

- removed legacy template files
- removed track/delivery visibility system
- fixed slug issues
- cleaned ESLint errors
- improved React patterns
- improved image handling
- replaced raw table markup with reusable table system
- centralised active course routing assumptions
- centralised brand/site SEO defaults
- centralised current Foundation/Higher billing product-code mapping
- added schema naming guidance for new reusable systems

---

## Next Areas for Expansion

### Dashboard

- harden and expand the current V1 continue-lesson model
- module-level progress tracking
- personalised recommendations

### Builder UX

- inline "+ add block between blocks"
- faster workflows
- autosave

### UI System

- complete remaining UI Lab pages
- expand reusable components
- align student/admin/teacher UI patterns
- improve accessibility and responsiveness

### Content

- more block types
- richer media support
- reusable templates

### Platform

- harden billing/account edge cases
- analytics
- speaking workflows
- exam simulation features

---

## Author

Anton Vlasenko  
Director - Volna Online Russian School
