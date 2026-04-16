# GCSE Russian Course Platform

A full-stack online learning platform for GCSE Russian students, combining structured courses, interactive lessons, teacher-led assignment workflows, and a growing internal admin CMS.

Built as a real product for **gcserussian.com** and supporting **Volna Online Russian School**.

---

## 🚀 Overview

This platform combines self-study course delivery with teacher-managed homework and review workflows.

It currently includes:

- Structured course delivery across **Foundation**, **Higher**, and **Volna** learning tracks
- Student access modes for **trial**, **self-study/full**, and **Volna student** experiences
- Block-based lesson rendering
- **Section-based lesson navigation with progressive unlocking (NEW)**
- **DB-backed section visit tracking (lesson_section_progress) (NEW)**
- **Database-driven lesson content (sections + blocks) (NEW)**
- Database-driven question engine with metadata-based behaviour
- Custom admin tools for question sets, templates, and question authoring
- Full admin content management for **courses, variants, modules, and lessons**
- **Full admin lesson builder (sections + blocks, drag/drop, cross-section movement) (NEW)**
- Admin user management for **students, teachers, and teaching groups**
- Teacher assignment creation, editing, ordering, review, filtering, sorting, and reopening
- Student submission workflow with text, file uploads, locking after review, and feedback visibility
- Per-item assignment progress visibility for lessons and question sets
- Role-aware dashboards and secure Supabase-backed data access

---

## 🧠 Core Product Model

Two different concepts shape the platform and should not be confused.

### Roles

- **Admin** → system-level oversight and content management
- **Teacher** → group-based teaching and assignment review
- **Student** → course participation and homework submission

### Student access modes

- **Trial** → limited visible content and upgrade path
- **Self-study / Full** → paid independent learning experience
- **Volna student** → teacher-linked learning experience with assignments and review workflow

The platform uses one shared codebase and data model, with permissions and UI differences driven by access rules rather than separate apps.

---

## 🧱 Main Systems

### Lesson system

Lessons are currently rendered from reusable content blocks. Existing lesson rendering supports content such as:
Lessons are built from reusable content blocks.

#### Structure (UPDATED)

- Lesson
- Sections (steps)
- Blocks (content)

#### Behaviour (NEW)

- Lessons are divided into sections
- Sections unlock progressively
- First visit to a section is recorded in the database
- Visiting a section unlocks the next section
- Users cannot skip ahead beyond allowed progression
- Previously visited sections remain accessible
- Lesson completion remains a separate manual action

#### Supported content blocks

- text
- note
- vocabulary
- audio
- question set blocks
- **header (NEW)**
- **subheader (NEW)**
- **divider (NEW)**
- **callout (NEW)**
- **exam tip (NEW)**
- **image (NEW)**

This keeps lesson structure consistent and makes new content easier to create.

### 🛠️ Lesson Builder System (NEW)

The platform now includes a **fully DB-driven lesson builder CMS**.

Capabilities:

- Section-based lesson editing
- Block-based content editing
- Drag-and-drop section ordering
- Drag-and-drop block ordering
- **Move blocks between sections (NEW)**
- Block duplication and deletion
- Section duplication and deletion
- Inspector panel editing
- Sidebar navigation
- Publish/unpublish blocks

Architecture changes:

- ❌ Removed hardcoded templates:
  - lesson-block-presets.ts
  - lesson-section-templates.ts
  - lesson-templates.ts
- ✅ Replaced with DB-driven template system
- ✅ Lessons are now fully dynamic from database

---

### Question system

Questions are stored in the database and rendered through structured metadata rather than one-off hardcoded components.

Current supported and planned interaction patterns include:

- multiple choice
- short answer
- translation
- selection-based answers
- sentence builder behaviour
- listening/audio rules
- validation rules such as punctuation and whitespace handling

---

### Admin authoring system

A custom admin CMS now supports both **question authoring** and a growing **platform management layer**.

Current admin capabilities include:

- question set CRUD
- question CRUD
- option / accepted answer management
- duplication
- reordering
- activation toggles
- template-based authoring
- usage visibility for linked assignments
- content management for:
  - courses
  - variants
  - modules
  - lessons
- **lesson builder (sections + blocks editing) (NEW)**
- contextual content navigation:
  - `/admin/content`
  - `/admin/content/courses/[courseId]`
  - `/admin/content/courses/[courseId]/variants/[variantId]`
  - `/admin/content/courses/[courseId]/variants/[variantId]/modules/[moduleId]`
  - `/admin/content/courses/[courseId]/variants/[variantId]/modules/[moduleId]/lessons/[lessonId]`
- ordering controls for variants, modules, and lessons
- dedicated edit pages for content entities
- teaching group creation and editing
- student, teacher, and teaching group management views
- student access-grant switching
- teacher-role management through `profiles.is_teacher`
- admin feedback banners and confirmation flows for operational actions

---

### Assignment system

(unchanged — preserved)

---

## 🏗️ High-Level Architecture

### Course hierarchy

- Course
- Variant
  - foundation
  - higher
  - volna
- Module
- Lesson
- **Section (NEW)**
- **Block (NEW)**

---

## 📊 Progress Tracking

### Main tables

- lesson_progress
- **lesson_section_progress (NEW)**
- question_progress
- question_attempts

### Section progress behaviour

- first visit is recorded in DB
- visit unlocks next section
- revisits tracked
- UI reflects visited sections

---

## 🗄️ Database Overview (UPDATED)

### Core learning content

- courses
- course_variants
- modules
- lessons
- **lesson_sections (NEW)**
- **lesson_blocks (NEW)**

---

## 🧹 Technical Cleanup (NEW)

- Removed legacy hardcoded template files
- Fixed empty questionSetSlug issues
- Cleaned ESLint errors
- Fixed React effect misuse (setState in useEffect)
- Improved image handling (next/image)

---

## 🛣️ Next Areas for Expansion

- database-driven lesson authoring improvements
- richer lesson block library
- lesson UX improvements (carousel / steps)
- payments integration
- speaking workflows
- analytics dashboards

---

## 👤 Author

**Anton Vlasenko**  
Director — Volna Online Russian School
