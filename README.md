# GCSE Russian Course Platform

An advanced online learning platform for GCSE Russian students, powering structured courses, interactive lessons, and teacher-led assignments.

---

## 🚀 Overview

This platform powers **gcserussian.com** and integrates with **Volna Online Russian School**.

The system supports:

* Structured course delivery (Foundation, Higher, Volna)
* Block-based lesson system
* Database-driven question engine
* Assignment system (teacher → student workflow)
* Role-based access (admin, teacher, student)
* Progress tracking (variant-aware)
* Scalable architecture for future expansion

---

## 🧠 Core Architecture

### Course Hierarchy

The platform uses a database-driven structure:

* **Course**
* **Variant (Learning Track)**  
  - `foundation`
  - `higher`
  - `volna`
* **Module**
* **Lesson**

---

### URL Structure
/courses/[courseSlug]
/courses/[courseSlug]/[variantSlug]
/courses/[courseSlug]/[variantSlug]/modules/[moduleSlug]
/courses/[courseSlug]/[variantSlug]/modules/[moduleSlug]/lessons/[lessonSlug]

/assignments
/assignments/[assignmentId]

/teacher/assignments
/teacher/assignments/new
/teacher/assignments/[assignmentId]

/question-sets/[questionSetSlug]

---

## 🔐 Access System

### Tables

* `products`
* `prices`
* `user_access_grants`

### Access Modes

* `trial`
* `full`
* `volna`

### Key Logic

* Access is determined via `user_access_grants`
* Each grant links to a `product`
* Products define:
  - course
  - variant
  - access type

### Lesson-level flags

* `is_trial_visible`
* `available_in_volna`

---

## 👥 Roles

Defined dynamically:

| Role | Source |
|------|--------|
| Admin | `profiles.is_admin = true` |
| Teacher | `teaching_group_members.member_role = teacher` |
| Student | default |

---

## 🎓 Volna System

### Tables

* `teaching_groups`
* `teaching_group_members`

### Features

* Teacher → student group management
* Volna-specific course variant
* Assignment distribution
* Homework review workflow

---

## 📝 Assignment System

### Tables

* `assignments`
* `assignment_items`
* `assignment_submissions`

### Assignment items

Each assignment can include:

* lesson
* question set
* custom task

---

### Teacher Flow

* Create assignment
* Attach multiple lessons
* Attach question sets
* Add custom tasks
* Review submissions
* Mark + give feedback

---

### Student Flow

* View assignments
* Open assignment detail page
* Access:
  - lessons
  - question sets
  - tasks
* Submit homework
* View feedback

---

## 🧩 Lesson System

Block-based architecture.

### Supported blocks

* text
* note
* vocabulary
* multiple choice
* short answer
* question set

### Location

src/components/lesson-blocks/

### Content stored in:

src/lib/lesson-content/

---

## ❓ Question System

Database-driven.

### Tables

* `question_sets`
* `questions`
* `question_options`
* `accepted_answers`
* `question_attempts`

### Supported types

* multiple_choice
* short_answer
* translation

---

## 📊 Progress Tracking

### Table

* `lesson_progress`

### Fields

* `course_slug`
* `variant_slug`
* `module_slug`
* `lesson_slug`
* `completed`

### Key Features

* Variant-aware (important fix)
* Used in:
  - lesson page
  - module page
  - dashboard

---

## 🧭 Dashboard System

Role-aware dashboard:

### Admin
* Role display only

### Teacher
* Role = teacher
* Volna context

### Student
* Learning track (foundation / higher / volna)
* Access type (trial / full / volna)
* Completed lessons

---

## 🧱 Tech Stack

* **Next.js (App Router)**
* **TypeScript**
* **Tailwind CSS**
* **Supabase (Postgres + Auth + RLS)**
* **Vercel**

---

## 🗂️ Project Structure
src/

app/
(platform)/
dashboard/
courses/
assignments/
teacher/
question-sets/

components/
layout/
ui/
lesson-blocks/
assignments/

lib/
auth.ts
dashboard-helpers.ts
access.ts
access-helpers-db.ts
assignment-helpers-db.ts
course-helpers-db.ts
progress.ts
progress-module.ts
question-helpers-db.ts
vocabulary-helpers-db.ts
teacher-auth.ts
volna-helpers-db.ts
routes.ts
supabase/

types/

---

## 🔐 Security

* Supabase RLS enforced
* Server-side access control
* Teacher route guards implemented
* Assignment access scoped by group membership

---

## 🛣️ Future Plans

* Question analytics
* Speaking exam system
* AI tutor
* Audio/listening blocks
* Admin panel
* Payment integration

---

## 🧑‍💻 Author

Anton Vlasenko  
Director — Volna Online Russian School
