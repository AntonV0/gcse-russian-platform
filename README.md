# GCSE Russian Course Platform

A full-stack online learning platform for GCSE Russian students, combining structured courses, interactive lessons, and a teacher-led assignment system.

Built as a real-world product powering **gcserussian.com** and supporting **Volna Online Russian School**.

---

## 🚀 Overview

This platform delivers a complete online learning experience, including:

- Structured course delivery (Foundation, Higher, Volna tracks)
- Block-based lesson system
- Advanced database-driven question engine
- Teacher → student assignment workflow
- File uploads and feedback system
- Role-based access (admin, teacher, student)
- Progress tracking (variant-aware)
- Template-driven content system (question sets)
- Scalable architecture for future expansion

---

## 🧠 Key Technical Features

### 🔹 Metadata-Driven Question Engine

- Questions are dynamically rendered using structured metadata
- Supports multiple answer strategies without hardcoding UI
- Easily extensible for new question types

### 🔹 Reusable Block-Based Lesson System

- Lessons are composed of modular blocks:
  - text
  - note
  - vocabulary
  - audio
  - question sets
- Enables fast content creation and consistency

### 🔹 Admin CMS (Custom Built)

- Full CRUD system for:
  - question sets
  - questions
  - options
  - accepted answers
- Advanced tools:
  - duplication
  - reordering
  - normalization
  - activation toggles
  - inline editing
  - template system
  - usage visibility

### 🔹 Question Set Templates

- Mark question sets as reusable templates
- Template type classification
- Guided “create from template” workflow
- Standardises content creation patterns

### 🔹 Usage Tracking System

- Tracks which assignments use each question set
- Helps prevent accidental deletion of in-use content
- Links directly to relevant assignment pages

### 🔹 Assignment System

- Teachers can:
  - create assignments
  - attach lessons and question sets
  - review submissions
  - give marks and feedback
- Students can:
  - complete tasks
  - upload files
  - receive feedback

### 🔹 Role-Based Architecture

- Admin → full system access
- Teacher → group + assignment management
- Student → course + homework access

### 🔹 Supabase Integration

- PostgreSQL database
- Row Level Security (RLS)
- Auth system
- File storage with signed URLs

---

## 🏗️ Architecture Overview

### Course Hierarchy

- Course
- Variant (Learning Track)
  - foundation
  - higher
  - volna
- Module
- Lesson

---

### URL Structure

- /courses/[courseSlug]
- /courses/[courseSlug]/[variantSlug]
- /courses/[courseSlug]/[variantSlug]/modules/[moduleSlug]
- /courses/[courseSlug]/[variantSlug]/modules/[moduleSlug]/lessons/[lessonSlug]

- /assignments
- /assignments/[assignmentId]

- /teacher/assignments
- /teacher/assignments/new
- /teacher/assignments/[assignmentId]

- /question-sets/[questionSetSlug]
- /admin
- /admin/question-sets
- /admin/question-sets/templates
- /admin/questions/[questionId]

---

## 🧩 System Architecture

```mermaid
flowchart TD

  U[User] --> R{Role}

  R -->|Student| SD[Student Dashboard]
  R -->|Teacher| TD[Teacher Dashboard]
  R -->|Admin| AD[Admin Access]

  SD --> C[Courses]
  SD --> A1[Assignments]
  SD --> P[Progress]

  TD --> TG[Teaching Groups]
  TD --> TA[Teacher Assignments]
  TD --> TR[Submission Review]

  AD --> AC[Admin Content Tools]
  AC --> AQS[Question Set Management]
  AC --> AQ[Question Management]
  AC --> AT[Template System]

  C --> CV[Course Variant]
  CV --> M[Modules]
  M --> L[Lessons]

  L --> LB[Lesson Blocks]
  LB --> TXT[Text / Note / Vocabulary]
  LB --> QS[Question Set Block]

  QS --> QSE[Question Engine]
  QSE --> MCQ[Multiple Choice]
  QSE --> SA[Short Answer]
  QSE --> TRN[Translation]
  QSE --> SB[Sentence Builder]
  QSE --> SEL[Selection Based]

  QSE --> AU[Audio / Listening Mode]
  QSE --> VAL[Validation Engine]
  QSE --> QA[Question Attempts / Progress]

  A1 --> AS[Assignment Submission]
  AS --> UP[Text + File Upload]
  TR --> FB[Teacher Feedback + Mark]

  AQS --> DUP[Duplicate / Normalize / Toggle / Preview]
  AQS --> USE[Usage Visibility]
  AQS --> TMP[Create from Template]

  UP --> ST[(Supabase Storage)]
  C --> DB[(Supabase DB)]
  A1 --> DB
  TD --> DB
  AD --> DB
  QSE --> DB
  QA --> DB
```

---

## 🔐 Access System

### Tables

- products
- prices
- user_access_grants

### Access Modes

- trial
- full
- volna

### Key Logic

- Access is determined via `user_access_grants`
- Each grant links to a `product`
- Products define:
  - course
  - variant
  - access type

### Lesson-level flags

- is_trial_visible
- available_in_volna

---

## 👥 Roles

- Admin → `profiles.is_admin = true`
- Teacher → `teaching_group_members.member_role = teacher`
- Student → default

---

## 🎓 Volna System

### Tables

- teaching_groups
- teaching_group_members

### Features

- Teacher → student group management
- Volna-specific course variant
- Assignment distribution
- Homework review workflow

---

## 📝 Assignment System

### Tables

- assignments
- assignment_items
- assignment_submissions

### Assignment items

- lesson
- question set
- custom task

---

### Teacher Flow

- Create assignment
- Attach lessons
- Attach question sets
- Add custom tasks
- Review submissions
- Mark + give feedback

---

### Student Flow

- View assignments
- Access lesson + question sets
- Submit homework (text + file upload)
- View teacher feedback

---

## 🧩 Lesson System

Block-based architecture.

### Supported blocks

- text
- note
- vocabulary
- multiple choice
- short answer
- translation
- question set

### Location

- `src/components/lesson-blocks/`

---

## ❓ Question System

Database-driven.

### Tables

- question_sets
- questions
- question_options
- question_accepted_answers
- question_attempts
- question_progress

---

### Supported types

- multiple_choice
- short_answer
- translation

---

### Advanced Features

#### 🎧 Audio / Listening Mode

- Audio playback per question
- Max play limits
- Auto-play support
- Listening exam mode (restricted UI)
- Submission lock until audio completes

#### ✅ Validation Engine

- Case-insensitive matching
- Whitespace normalization
- Optional:
  - ignore punctuation
  - ignore articles

#### 🧠 Answer Strategies (metadata-driven)

- text_input
- selection_based
- sentence_builder
- upload_required (planned)

#### 🔘 Selection-based questions

- Grouped mode
- Inline gap mode

---

## 📊 Progress Tracking

### Tables

- lesson_progress
- question_progress

### Features

- Variant-aware tracking
- Per-question attempt tracking
- Best score + attempts stored

---

## 🧭 Dashboard System

Role-aware dashboard:

### Admin

- Full system visibility
- Content + assignment control
- Template management
- Usage visibility

### Teacher

- Group-based context
- Assignment management
- Submission review

### Student

- Learning track (foundation / higher / volna)
- Access type (trial / full / volna)
- Completed lessons

---

## 🗂️ Project Structure

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

  components/
    admin/
    layout/
    ui/
    lesson-blocks/
    questions/
    assignments/

  lib/
    auth.ts
    teacher-auth.ts
    access.ts
    dashboard-helpers.ts
    assignment-helpers-db.ts
    question-helpers-db.ts
    course-helpers-db.ts
    access-helpers-db.ts
    question-engine.ts
    progress.ts
    routes.ts
    media.ts
    supabase/

  types/
```

---

## 🗄️ Database Overview

### Core Content

- courses
- course_variants
- modules
- lessons

### Questions

- question_sets
- questions
- question_options
- question_accepted_answers

### Progress

- lesson_progress
- question_progress
- question_attempts

### Assignments

- assignments
- assignment_items
- assignment_submissions

### Volna

- teaching_groups
- teaching_group_members

### Access

- products
- user_access_grants

---

## 🗄️ Database Relationship Overview

```mermaid
erDiagram

  COURSES ||--o{ COURSE_VARIANTS : has
  COURSE_VARIANTS ||--o{ MODULES : has
  MODULES ||--o{ LESSONS : has

  COURSES ||--o{ PRODUCTS : linked_to
  COURSE_VARIANTS ||--o{ PRODUCTS : linked_to
  PRODUCTS ||--o{ USER_ACCESS_GRANTS : grants

  LESSONS ||--o{ LESSON_PROGRESS : tracked_in

  QUESTION_SETS ||--o{ QUESTIONS : contains
  QUESTIONS ||--o{ QUESTION_OPTIONS : has
  QUESTIONS ||--o{ QUESTION_ACCEPTED_ANSWERS : has
  QUESTIONS ||--o{ QUESTION_ATTEMPTS : logs
  QUESTIONS ||--o{ QUESTION_PROGRESS : tracked_in

  TEACHING_GROUPS ||--o{ TEACHING_GROUP_MEMBERS : has
  TEACHING_GROUPS ||--o{ ASSIGNMENTS : receives

  ASSIGNMENTS ||--o{ ASSIGNMENT_ITEMS : contains
  ASSIGNMENTS ||--o{ ASSIGNMENT_SUBMISSIONS : receives

  LESSONS ||--o{ ASSIGNMENT_ITEMS : may_reference
  QUESTION_SETS ||--o{ ASSIGNMENT_ITEMS : may_reference

  PROFILES ||--o{ ASSIGNMENTS : creates
  PROFILES ||--o{ ASSIGNMENT_SUBMISSIONS : submits
  PROFILES ||--o{ QUESTION_ATTEMPTS : answers

  COURSES {
    uuid id
    text slug
    text title
  }

  COURSE_VARIANTS {
    uuid id
    uuid course_id
    text slug
    text title
  }

  MODULES {
    uuid id
    uuid course_variant_id
    text slug
    text title
  }

  LESSONS {
    uuid id
    uuid module_id
    text slug
    text title
  }

  QUESTION_SETS {
    uuid id
    text slug
    text title
    boolean is_template
    text template_type
  }

  QUESTIONS {
    uuid id
    uuid question_set_id
    text question_type
    text prompt
    jsonb metadata
    text audio_path
  }

  QUESTION_OPTIONS {
    uuid id
    uuid question_id
    text option_text
    boolean is_correct
  }

  QUESTION_ACCEPTED_ANSWERS {
    uuid id
    uuid question_id
    text answer_text
    boolean is_primary
  }

  ASSIGNMENTS {
    uuid id
    uuid group_id
    text title
    boolean allow_file_upload
  }

  ASSIGNMENT_ITEMS {
    uuid id
    uuid assignment_id
    text item_type
    uuid lesson_id
    uuid question_set_id
  }

  ASSIGNMENT_SUBMISSIONS {
    uuid id
    uuid assignment_id
    uuid student_user_id
    text submitted_text
    text submitted_file_path
    text submitted_file_name
    numeric mark
    text feedback
  }

  TEACHING_GROUPS {
    uuid id
    text name
  }

  TEACHING_GROUP_MEMBERS {
    uuid id
    uuid group_id
    uuid user_id
    text member_role
  }

  PRODUCTS {
    uuid id
    uuid course_id
    uuid course_variant_id
    text access_mode
  }

  USER_ACCESS_GRANTS {
    uuid id
    uuid product_id
    uuid user_id
  }

  LESSON_PROGRESS {
    uuid id
    uuid user_id
    text course_slug
    text variant_slug
    text lesson_slug
    boolean completed
  }

  QUESTION_PROGRESS {
    uuid id
    uuid user_id
    uuid question_id
    int total_attempts
    int correct_attempts
  }

  QUESTION_ATTEMPTS {
    uuid id
    uuid user_id
    uuid question_id
    boolean is_correct
    numeric awarded_marks
  }

  PROFILES {
    uuid id
    text email
    boolean is_admin
  }
```

---

## 🔐 Storage & Security

- Supabase RLS enforced
- Admin override logic for restricted teacher/assignment views
- Private storage buckets
- Signed URLs for secure file access
- Assignment uploads scoped per user
- Server-side validation of access

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

### 2. Run dev server

```bash
npm run dev
```

### 3. Open app

```text
http://localhost:3000
```

---

## 🛣️ Future Improvements

- AI-assisted marking system
- Speaking exam system
- Audio recording tasks
- Payment integration
- Analytics dashboard
- Bulk admin actions (multi-select, batch operations)
- Advanced filtering/search in admin

---

## 👤 Author

**Anton Vlasenko**  
Director — Volna Online Russian School
