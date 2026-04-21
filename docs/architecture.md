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

- dashboards
- course navigation
- lesson rendering
- assignment UI
- teacher review UI
- admin CMS UI
- lesson builder UI
- role-aware navigation
- account and settings UI

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

### UI System Layer (NEW)

A dedicated **UI system layer** has been introduced to standardise
design patterns across:

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

## 4. Core content architecture

### Course hierarchy

- Course
- Variant
- Module
- Lesson

### Lesson architecture (UPDATED)

- Lesson
- Section
- Block

This is the **single source of truth for lesson structure**.

---

## 5. Section-based lesson flow

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

## 6. Block system

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

## 7. Variant-Based Content Architecture (NEW)

The system now treats **variants as first-class citizens**.

Examples of variants:

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

Rules:

- shared → visible everywhere
- foundation_only → only foundation
- higher_only → only higher
- volna_only → only volna

### Architectural impact

This replaces:

- ❌ track visibility
- ❌ delivery visibility

Benefits:

- simpler mental model
- aligned with real product structure
- easier future expansion

---

## 8. Shared Section Architecture (NEW)

Sections now support:

- `canonical_section_key`

### Purpose

Allows logically identical sections to exist across variants.

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

### Why this matters

Enables future features:

- cross-variant progress syncing
- content reuse
- analytics across equivalent sections

### Current state

- stored in DB
- editable in CMS
- not yet used in progression logic

---

## 9. Lesson Builder Architecture (CORE SYSTEM)

The lesson builder is now a **central CMS**.

### Responsibilities

- write lesson content directly to DB
- manage sections + blocks
- control ordering
- manage publishing state
- control variant visibility
- manage canonical keys

### Capabilities

- section CRUD
- block CRUD
- drag-and-drop ordering
- cross-section block movement
- duplication
- publish/unpublish
- inspector editing
- sidebar navigation

---

## 10. Lesson Builder UX Architecture

### Key shift

From:

- list-first editing

To:

- creation-first workflow

---

### Block creation flow

- composer above block list
- clear entry point
- improved empty states
- faster first-block experience

---

### Composer architecture

- grouped block types:
  - structure
  - teaching
  - media
  - practice
- inline form rendering
- preset support (DB-driven)

---

### Section editor structure

1. Section overview
2. Metadata editing
3. Block creation
4. Block list

---

## 11. Data Display Architecture (NEW)

The platform now uses a **structured table system** instead of raw HTML tables.

### Motivation

Previously:

- tables were implemented per-page
- inconsistent spacing, hierarchy, and behaviour
- duplication of logic and styling

Now:

- tables are built from reusable components
- consistent across all admin interfaces

---

### Core components

#### TableShell

Provides:

- title
- description
- action area
- container styling

Acts as the **standard entry point** for all table-based views.

---

#### TableToolbar

Handles:

- search inputs
- filters
- bulk actions
- creation actions

Placed above table content.

---

#### DataTable system

A composable system including:

- header
- body
- rows
- cells
- density variants

This replaces direct `<table>` usage in application code.

---

### Supported patterns

- standard admin tables (default)
- dense tables (compact)
- hierarchical list pattern (modules → lessons → blocks)
- empty state
- filtered-empty state
- dark-surface compatibility

---

### Architectural impact

- removes duplication of table logic
- standardises interaction patterns
- improves readability and scanning
- enables future enhancements (sorting, pagination, selection)

---

## 12. Row Interaction Architecture (NEW)

Row behaviour is now treated as a **first-class UI concern**.

### States

- default
- hover
- selected
- disabled

### Patterns

- inline actions (always visible)
- compact action groups (icon-only)
- hover-reveal actions

### Component

- `AdminRow`

Used for:

- table rows
- list rows
- hierarchical structures

---

## 13. Hierarchical Content Display Pattern (NEW)

Not all structured data is displayed as tables.

A **hierarchical list pattern** is used for:

- modules
- lessons
- blocks

### Characteristics

- nested indentation
- flexible layout
- better representation of relationships

### Why this exists

Tables are optimal for:

- comparison

Hierarchy is optimal for:

- structure

The system intentionally supports both.

---

## 12. Progress architecture

### Tables

- lesson_progress
- lesson_section_progress

Tracks:

- first_visited_at
- last_visited_at
- visit_count

---

## 13. Database relationships

LESSONS → LESSON_SECTIONS → LESSON_BLOCKS

---

## 14. Navigation & UI Access Architecture

UI visibility is derived from role + access mode.

---

## 15. Dashboard Architecture

Aggregates role, variant, and progress to determine next actions.

---

## 16. Account System Architecture

Includes profile, avatar system, and settings page.

---

## 19. Architectural changes in this phase

Added:

- variant visibility system
- canonical section system
- UI Lab system
- reusable table architecture
- DevComponentMarker system
- structured row interaction patterns

Removed:

- track/delivery visibility
- raw table implementations across admin pages

---

## 18. Architectural strengths

- unified platform
- DB-driven
- scalable CMS

---

## 19. Next architectural steps

- progress syncing
- dashboard improvements
- builder UX upgrades
