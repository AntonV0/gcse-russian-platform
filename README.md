# GCSE Russian Course Platform

A full-stack online learning platform for GCSE Russian students,
combining structured courses, interactive lessons, teacher-led
assignment workflows, and a rapidly evolving internal CMS.

Built as a real product for **gcserussian.com** and supporting **Volna
Online Russian School**.

---

## Documentation

Project architecture notes are kept in `docs/`:

- `docs/architecture.md`
- `docs/decisions.md`
- `docs/image-strategy.md`
- `docs/local-setup.md`
- `docs/PROJECT_STRUCTURE.md`
- `docs/supabase-migrations.md`
- `docs/ui-system-guidelines.md`

---

## Overview

This platform combines:

- structured self-study course delivery
- teacher-managed assignments and review workflows
- a fully database-driven lesson system
- a growing CMS for managing all learning content
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
- enables **shared progress tracking (future)**
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

But not yet used for:

- cross-variant progress syncing (future feature)

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

### Architectural shift

- Removed hardcoded templates
- Presets resolved dynamically from the database
- Removed track/delivery visibility system
- Fully DB-driven content system
- Templates resolved dynamically
- Variant-aware content system

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

This phase focused heavily on **authoring experience**, not just
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

---

### Settings system

- Dedicated settings page scaffolded
- Future-ready for:
  - email change
  - password update
  - account management

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

### New additions in this phase

#### 1. Progress awareness

- Integrated `getCourseProgressSummary`
- Displays:
  - completed lessons
  - contextual progress messaging

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

- does NOT compute exact "next lesson"
- does NOT depend on complex progression logic
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

---

## Technical Cleanup

- removed legacy template files
- removed track/delivery visibility system
- fixed slug issues
- cleaned ESLint errors
- improved React patterns
- improved image handling
- replaced raw table markup with reusable table system

---

## Next Areas for Expansion

### Dashboard

- true "continue lesson" system
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

- payments
- analytics
- speaking workflows
- exam simulation features

---

## Author

Anton Vlasenko  
Director - Volna Online Russian School
