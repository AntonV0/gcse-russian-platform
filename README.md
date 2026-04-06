# GCSE Russian Course Platform

A full-stack online learning platform for GCSE Russian students, combining structured courses, interactive lessons, and a teacher-led assignment workflow.

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
- Database-driven question engine with metadata-based behaviour
- Custom admin tools for question sets, templates, and question authoring
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

This keeps lesson structure consistent and makes new content easier to create.

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

### Admin authoring system

A custom admin CMS supports:

- question set CRUD
- question CRUD
- option / accepted answer management
- duplication
- reordering
- activation toggles
- template-based authoring
- usage visibility for linked assignments

### Assignment system

Teachers can:

- create assignments
- edit title, instructions, due date, and file-upload settings
- attach lessons, question sets, and custom tasks
- order assignment items
- review submissions with mark and feedback
- filter and sort submissions
- reopen reviewed submissions for resubmission

Students can:

- view assignments
- follow assignment items in order
- submit text and optional file uploads
- see submission state
- get locked after review
- view teacher feedback and marks
- see per-item assignment progress

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

### Main route structure

```text
/courses/[courseSlug]
/courses/[courseSlug]/[variantSlug]
/courses/[courseSlug]/[variantSlug]/modules/[moduleSlug]
/courses/[courseSlug]/[variantSlug]/modules/[moduleSlug]/lessons/[lessonSlug]

/assignments
/assignments/[assignmentId]

/teacher/assignments
/teacher/assignments/new
/teacher/assignments/[assignmentId]
/teacher/assignments/[assignmentId]/edit

/question-sets/[questionSetSlug]

/admin
/admin/question-sets
/admin/question-sets/templates
/admin/questions/[questionId]
```

---

## 🧩 System Architecture

```mermaid
flowchart TD

  U[User] --> R{Role}

  R -->|Student| S{Student access}
  R -->|Teacher| T[Teacher workspace]
  R -->|Admin| A[Admin workspace]

  S -->|Trial| ST[Trial student UI]
  S -->|Self-study / Full| SS[Self-study UI]
  S -->|Volna student| SV[Volna student UI]

  ST --> C[Courses]
  SS --> C
  SV --> C
  SV --> ASG[Assignments]

  C --> CV[Course variant]
  CV --> M[Modules]
  M --> L[Lessons]

  L --> SEC[Lesson sections (NEW)]
  SEC --> LB[Lesson blocks]
  LB --> TXT[Text / Notes / Vocabulary]
  LB --> QSB[Question set block]

  QSB --> QE[Question engine]
  QE --> MCQ[Multiple choice]
  QE --> SA[Short answer]
  QE --> TRN[Translation]
  QE --> SEL[Selection based]
  QE --> SB[Sentence builder]
  QE --> AU[Audio / listening behaviour]
  QE --> VAL[Validation + metadata rules]
  QE --> QP[Question attempts and progress]

  T --> TG[Teaching groups]
  T --> TA[Teacher assignments]
  T --> TR[Submission review]

  TA --> AC[Create / Edit / Order items]
  TR --> REV[Review / Reopen / Filter / Sort]

  A --> CMS[Admin content tools]
  CMS --> QS[Question set management]
  CMS --> QQ[Question management]
  CMS --> TMP[Template workflows]
  CMS --> USE[Usage visibility]

  ASG --> SUB[Submission workflow]
  SUB --> TXT2[Text response]
  SUB --> FILE[File upload]
  SUB --> LOCK[Locked after review]
  SUB --> FB[Teacher feedback + marks]
  SUB --> PROG[Per-item assignment progress]

  C --> DB[(Supabase DB)]
  QE --> DB
  T --> DB
  A --> DB
  FILE --> STOR[(Supabase Storage)]
```

---

## 🔐 Access Model

### Key tables

- products
- prices
- user_access_grants

### Access modes

- trial
- full
- volna

### Main idea

Access is determined through `user_access_grants`, linked to `products`, which define:

- course
- variant
- access mode

Lesson and course visibility can then be shaped by flags such as:

- `is_trial_visible`
- `available_in_volna`

---

## 👥 Role Model

- **Admin** → `profiles.is_admin = true`
- **Teacher / assistant** → `teaching_group_members.member_role`
- **Student** → default authenticated learning user

Role and access mode are separate concerns. A student may be in a Foundation, Higher, or Volna variant, and may also have trial/full/Volna access behaviour.

---

## 🎓 Volna System

### Main tables

- teaching_groups
- teaching_group_members
- assignments
- assignment_items
- assignment_submissions

### Current Volna-specific capabilities

- teacher-group relationships
- teacher assignment creation and editing
- student homework submission
- review workflow with marks and feedback
- reopening reviewed work
- teacher filtering and prioritisation views

---

## 📝 Assignment Workflow

### Assignment item types

- lesson
- question set
- custom task

### Teacher flow

- create assignment
- edit assignment fields
- order items
- review submissions
- mark and give feedback
- filter and sort review queues
- reopen reviewed submissions when needed

### Student flow

- open assignment
- follow ordered steps
- complete linked lesson / question set work
- submit text and optional file
- see item-level progress
- receive feedback
- get locked after review unless teacher reopens

### Current UX rules

- derived teacher review state is calculated from submissions
- due date urgency is separate from workflow state
- reviewed submissions are locked on the student side
- teacher can reopen to allow another submission round

---

## ❓ Question System

### Main tables

- question_sets
- questions
- question_options
- question_accepted_answers
- question_attempts
- question_progress

### Supported question types

- multiple_choice
- short_answer
- translation

### Metadata-driven behaviour

The engine supports structured configuration such as:

- answer strategy
- listening mode
- max plays
- selection display mode
- punctuation/article handling
- sentence-building behaviour

---

## 📊 Progress Tracking

### Main tables

- lesson_progress
- **lesson_section_progress (NEW)**
- question_progress
- question_attempts

### Current tracked behaviour

- lesson completion
- **section visit tracking and unlocking (NEW)**
- question attempts and scores
- assignment item progress
  - lesson items show completed / not completed
  - question set items show started / not started

### Section progress behaviour

- first visit is recorded in DB
- visit unlocks next section
- revisits increment visit count
- progress UI reflects visited sections (not forced completion)

---

## 🧭 Dashboards and Views

### Admin

- content management
- templates
- question set usage visibility
- privileged system-wide visibility

### Teacher

- assignment lists
- pending review prioritisation
- submission review filters and sorting
- reopen workflow

### Student

- course navigation
- assignment lists
- assignment detail pages
- submission state and review result visibility

---

## 🗂️ Project Structure

This is a representative structure, not an exhaustive file list.

```text
src/
  app/
    (platform)/
      dashboard/
      courses/
      assignments/
      teacher/
      question-sets/
    admin/
    actions/

  components/
    admin/
    assignments/
    layout/
    lesson-blocks/
    questions/
    ui/

  lib/
    access.ts
    access-helpers-db.ts
    assignment-helpers-db.ts
    assignment-progress.ts
    auth.ts
    course-helpers-db.ts
    dashboard-helpers.ts
    progress.ts
    question-engine.ts
    question-helpers-db.ts
    question-progress.ts
    routes.ts
    storage-helpers.ts
    teacher-auth.ts
    supabase/

  types/
```

---

## 🗄️ Database Overview

### Core learning content

- courses
- course_variants
- modules
- lessons

### Questions and templates

- question_sets
- questions
- question_options
- question_accepted_answers

### Progress

- lesson_progress
- **lesson_section_progress (NEW)**
- question_progress
- question_attempts

### Assignments

- assignments
- assignment_items
- assignment_submissions

### Teaching groups

- teaching_groups
- teaching_group_members

### Access and billing

- products
- prices
- user_access_grants

---

## 🔐 Storage and Security

- Supabase Auth
- Supabase PostgreSQL
- Row Level Security
- signed URLs for uploaded files
- assignment uploads scoped by user
- helper-level admin-aware access handling for management views

---

## ⚙️ Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Supabase (DB, Auth, Storage)
- Server Actions

---

## ⚙️ Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## 🧑‍💻 Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

### 3. Open locally

```text
http://localhost:3000
```

---

## 🛣️ Next Areas for Expansion

- payment integration
- analytics and reporting
- speaking workflows
- audio recording tasks
- richer assignment analytics
- more advanced question-set progress summaries
- broader admin tools
- **DB-driven lesson content system (sections + blocks)**

---

## 👤 Author

**Anton Vlasenko**  
Director — Volna Online Russian School
