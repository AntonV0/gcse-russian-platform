# GCSE Russian Course Platform

A full-stack online learning platform for GCSE Russian students,
combining structured courses, interactive lessons, teacher-led
assignment workflows, and a rapidly evolving internal CMS.

Built as a real product for **gcserussian.com** and supporting **Volna
Online Russian School**.

---

## 🚀 Overview

This platform combines:

- structured self-study course delivery
- teacher-managed assignments and review workflows
- a fully database-driven lesson system
- a growing CMS for managing all learning content

It is designed as a **single unified system** that supports multiple
learning experiences without splitting into separate apps.

---

## 🧠 Core Product Model

Two independent axes shape the platform:

### Roles

- **Admin** → full system control and content management
- **Teacher** → manages groups, assignments, and student progress
- **Student** → consumes content and completes work

### Student access modes

- **Trial** → restricted access, upgrade-focused
- **Self-study / Full** → independent paid learning
- **Volna student** → teacher-linked experience with assignments

These are handled through:

- permissions
- access rules
- UI variation

NOT separate applications.

---

## 🧱 Main Systems

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

## 🛠️ Lesson Builder System (CORE CMS)

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

### Architectural shift

- ❌ Removed hardcoded templates
- ❌ Removed static preset files
- ✅ Fully DB-driven content system
- ✅ Templates resolved dynamically

---

## ✨ Lesson Builder UX Improvements (THIS UPDATE)

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

## 🧭 Platform UX & Navigation System (NEW)

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

## 👤 Account System Improvements (NEW)

### Profile system

- Added structured profile page
- Introduced `avatar_key` system:
  - preset avatars (no uploads)
  - safer and simpler for younger users (12–16)
  - scalable for future expansion

### Avatar direction

- mix of:
  - neutral characters
  - academic styles
  - future potential for themed sets
- supports both:
  - younger learners
  - adult learners

---

### Settings system

- Dedicated settings page scaffolded
- Future-ready for:
  - email change
  - password update
  - account management

---

## 🧠 Dashboard System (NEW)

The dashboard is evolving into a **central learning hub**, not just a landing page.

### Current capabilities

- Role-based rendering:
  - guest
  - student
  - teacher
  - admin

- Track + access awareness:
  - Foundation / Higher / Volna
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
- learning track
- progress state

Examples:

- Trial → explore platform
- Full → continue learning
- Volna → open assignments

#### 3. Improved student UX

- clearer learning direction
- reduced decision friction
- better onboarding for new users

---

### Important architectural note

This version intentionally:

- ❌ does NOT compute exact “next lesson”
- ❌ does NOT depend on complex progression logic
- ✅ stays lightweight and safe

This prepares for a future:

> **true lesson continuation system (Duolingo-style progression)**

---

## 🧠 Product Direction

The platform is moving toward:

- a **Notion-style lesson editor**
- fully DB-driven content
- modular learning system
- scalable course/product structure
- intelligent student progression

---

## 📊 Progress Tracking

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

## 🗄️ Database Overview

Core content:

- courses
- course_variants
- modules
- lessons
- lesson_sections
- lesson_blocks

---

## 🧹 Technical Cleanup

- removed legacy template files
- fixed slug issues
- cleaned ESLint errors
- improved React patterns
- improved image handling

---

## 🛣️ Next Areas for Expansion

### Dashboard

- true “continue lesson” system
- module-level progress tracking
- personalised recommendations

### Builder UX

- inline "+ add block between blocks"
- faster workflows
- autosave

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

## 👤 Author

Anton Vlasenko  
Director — Volna Online Russian School
